import { existsSync, readFileSync, readdirSync, writeFileSync } from 'node:fs'
import { createHash } from 'node:crypto'
import { spawnSync } from 'node:child_process'
import { dirname, join, relative, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const SOURCE_CANDIDATES = [resolve(ROOT, '../../../JAVA/learn_ruoyi/RuoYi-Vue'), resolve(ROOT, '../JAVA/learn_ruoyi/RuoYi-Vue')]
const SOURCE = process.env.RUOYI_SOURCE_ROOT || SOURCE_CANDIDATES.find(existsSync) || SOURCE_CANDIDATES[0]
const GENERATED = /(?:^|\/)(?:target|generated-sources|generated)(?:\/|$)/u
const PRIVATE = /^com\.ruoyi\./u
const IMPORT = /\bimport\s+(static\s+)?([\w.]+)(?:\.\*)?\s*;/gu
const SIMPLE_JDK = new Set(['String', 'Object', 'Byte', 'Short', 'Integer', 'Long', 'Float', 'Double', 'Boolean', 'Math', 'System', 'Exception', 'RuntimeException', 'Class', 'Thread', 'StringBuilder'])

function executableJava(source) {
  // Retain offsets while removing comments, strings, and character literals.
  return source.replace(/\/\*[\s\S]*?\*\/|\/\/[^\r\n]*|"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'/gu, match => match.replace(/[^\r\n]/gu, ' '))
}

function captureMethodChain(code, openParen, owner, method, add) {
  let cursor = openParen
  let depth = 0
  do {
    if (code[cursor] === '(') depth++
    else if (code[cursor] === ')') depth--
    cursor++
  } while (depth > 0 && cursor < code.length)
  if (depth !== 0) return

  let chain = `${owner}.${method}()`
  while (cursor < code.length) {
    const next = code.slice(cursor).match(/^\s*\.\s*([A-Za-z_$][\w$]*)\s*\(/u)
    if (!next) return
    chain += `.${next[1]}`
    add(`?${chain}`)
    chain += '()'
    cursor += next[0].length - 1
    depth = 0
    do {
      if (code[cursor] === '(') depth++
      else if (code[cursor] === ')') depth--
      cursor++
    } while (depth > 0 && cursor < code.length)
    if (depth !== 0) return
  }
}

export function scanJavaSource(source, sourcePath) {
  if (GENERATED.test(sourcePath.replaceAll('\\', '/'))) return []
  const code = executableJava(source)
  const imports = new Map()
  const privateImports = new Map()
  const staticImports = new Map()
  for (const match of code.matchAll(IMPORT)) {
    const name = match[2]
    if (name === 'com.ruoyi' || PRIVATE.test(name)) {
      privateImports.set(name.split('.').at(-1), name)
      continue
    }
    if (match[0].includes('.*')) {
      if (name === 'jakarta.validation.constraints') {
        for (const type of ['Email', 'NotBlank', 'NotNull', 'Pattern', 'Size']) imports.set(type, `${name}.${type}`)
      } else if (name === 'com.google.code.kaptcha.Constants' && match[1]) {
        // This source imports constant fields only; there are no callable members.
      } else throw new Error(`unsupported wildcard import ${name} in ${sourcePath}`)
      continue
    }
    const parts = name.split('.')
    if (match[1]) staticImports.set(parts.at(-1), parts.at(-2))
    else imports.set(parts.at(-1), name)
  }
  for (const name of SIMPLE_JDK) imports.set(name, `java.lang.${name}`)
  const scopes = [{start: 0, end: code.length}]
  const stack = [scopes[0]]
  for (let index = 0; index < code.length; index++) {
    if (code[index] === '{') {
      const scope = {start: index, end: code.length}
      scopes.push(scope)
      stack.push(scope)
    } else if (code[index] === '}' && stack.length > 1) stack.pop().end = index + 1
  }
  const enclosingScope = index => scopes.filter(scope => scope.start <= index && index < scope.end).at(-1) ?? scopes[0]
  const bindings = new Map()
  const types = new Map([...imports, ...privateImports])
  const typeTokens = /\b[A-Z][A-Za-z0-9_$]*\b/gu
  let typeMatch
  while ((typeMatch = typeTokens.exec(code))) {
    const type = typeMatch[0]
    let cursor = typeTokens.lastIndex
    while (/\s/u.test(code[cursor] ?? '')) cursor++
    if (code[cursor] === '<') {
      let depth = 0
      do {
        if (code[cursor] === '<') depth++
        else if (code[cursor] === '>') depth--
        cursor++
      } while (depth > 0 && cursor < code.length)
      if (depth !== 0) throw new Error(`unbalanced generic declaration in ${sourcePath}`)
      typeTokens.lastIndex = cursor // Nested generic types cannot become the receiver's base type.
    }
    while (/\s/u.test(code[cursor] ?? '')) cursor++
    while (code.slice(cursor, cursor + 2) === '[]') {
      cursor += 2
      while (/\s/u.test(code[cursor] ?? '')) cursor++
    }
    const variable = code.slice(cursor).match(/^([a-zA-Z_$][\w$]*)\b/u)
    if (!variable) continue
    const after = code.slice(cursor + variable[0].length).match(/^\s*([=;,):\[])/u)?.[1]
    if (!after || !types.has(type)) continue
    let scope = enclosingScope(typeMatch.index)
    if (after === ',' || after === ')') {
      const nextBrace = code.indexOf('{', cursor + variable[0].length)
      const nextSemicolon = code.indexOf(';', cursor + variable[0].length)
      if (nextBrace >= 0 && (nextSemicolon < 0 || nextBrace < nextSemicolon)) scope = scopes.find(item => item.start === nextBrace) ?? scope
    }
    const name = variable[1]
    if (!bindings.has(name)) bindings.set(name, [])
    bindings.get(name).push({index: typeMatch.index, type, external: !PRIVATE.test(types.get(type)), scope})
  }
  const receiverType = (name, index) => {
    const binding = bindings.get(name)?.filter(item => item.index <= index && item.scope.start <= index && index < item.scope.end)
      .sort((a, b) => (a.scope.end - a.scope.start) - (b.scope.end - b.scope.start) || b.index - a.index)[0]
    if (binding) return binding.external ? binding.type : null
    return imports.has(name) ? name : null
  }
  const counts = new Map()
  const add = symbol => counts.set(symbol, (counts.get(symbol) ?? 0) + 1)
  for (const match of code.matchAll(/@([A-Za-z_$][\w$]*)\b/gu)) if (imports.has(match[1])) add(`@${match[1]}`)
  for (const match of code.matchAll(/\bnew\s+([A-Za-z_$][\w$]*)\s*(?:<[^>]*>)?\s*\(/gu)) if (imports.has(match[1])) add(match[1])
  for (const match of code.matchAll(/\b([A-Za-z_$][\w$]*)\.([A-Za-z_$][\w$]*)\s*\(/gu)) {
    const receiver = receiverType(match[1], match.index)
    if (receiver) add(`${receiver}.${match[2]}`)
  }
  for (const match of code.matchAll(/\b([A-Za-z_$][\w$]*)\.([A-Za-z_$][\w$]*)\s*\(/gu)) {
    const receiver = receiverType(match[1], match.index)
    if (!receiver) continue
    captureMethodChain(code, match.index + match[0].length - 1, receiver, match[2], add)
  }
  for (const match of code.matchAll(/\bnew\s+([A-Za-z_$][\w$]*)(?:\s*<[^;=(){}]*>)?\s*\(/gu)) {
    const type = match[1]
    if (!imports.has(type)) continue
    const openParen = match.index + match[0].lastIndexOf('(')
    let cursor = openParen
    let depth = 0
    do {
      if (code[cursor] === '(') depth++
      else if (code[cursor] === ')') depth--
      cursor++
    } while (depth > 0 && cursor < code.length)
    if (depth !== 0) continue
    const next = code.slice(cursor).match(/^\s*\.\s*([A-Za-z_$][\w$]*)\s*\(/u)
    if (!next) continue
    add(`${type}.${next[1]}`)
    captureMethodChain(code, cursor + next[0].length - 1, type, next[1], add)
  }
  for (const match of code.matchAll(/(?<![\w$])((?:[a-z_$][\w$]*\.)+)([A-Z][A-Za-z0-9_$]*)\.([A-Za-z_$][\w$]*)\s*\(/gu)) {
    const qualifiedOwner = `${match[1]}${match[2]}`
    if (PRIVATE.test(qualifiedOwner)) continue
    add(`${match[2]}.${match[3]}`)
    captureMethodChain(code, match.index + match[0].length - 1, match[2], match[3], add)
  }
  for (const match of code.matchAll(/(?<![.\w$])([A-Za-z_$][\w$]*)\s*\(/gu)) {
    const owner = staticImports.get(match[1])
    if (owner) {
      add(`${owner}.${match[1]}`)
      captureMethodChain(code, match.index + match[0].length - 1, owner, match[1], add)
    }
  }
  return [...counts].sort(([a], [b]) => a.localeCompare(b, 'en')).map(([symbol, frequency]) => ({symbol, frequency}))
}

function sourceFiles(root) {
  if (!existsSync(root)) throw new Error(`RuoYi source root missing: ${root}`)
  const walk = dir => readdirSync(dir, {withFileTypes: true}).flatMap(entry => {
    const path = join(dir, entry.name)
    const rel = relative(root, path).replaceAll('\\', '/')
    if (GENERATED.test(rel)) return []
    if (entry.isDirectory()) return walk(path)
    return entry.isFile() && entry.name.endsWith('.java') ? [path] : []
  })
  return walk(root).sort()
}

export function scanSourceTree(root = SOURCE) {
  const counts = new Map()
  for (const path of sourceFiles(root)) {
    const sourcePath = relative(root, path).replaceAll('\\', '/')
    for (const {symbol, frequency} of scanJavaSource(readFileSync(path, 'utf8'), relative(root, path))) {
      const old = counts.get(symbol) ?? {frequency: 0, files: new Set()}
      old.frequency += frequency
      old.files.add(sourcePath)
      counts.set(symbol, old)
    }
  }
  return [...counts].sort(([a], [b]) => a.localeCompare(b, 'en')).map(([symbol, value]) => ({symbol, frequency: value.frequency, files: [...value.files].sort()}))
}

function sourceDigest(root) {
  const hash = createHash('sha256')
  for (const path of sourceFiles(root)) {
    hash.update(relative(root, path).replaceAll('\\', '/'))
    hash.update('\0')
    hash.update(readFileSync(path, 'utf8').replace(/\r\n?/gu, '\n'))
    hash.update('\0')
  }
  return hash.digest('hex')
}

export function loadScanInput({repoRoot = ROOT, sourceRoot = SOURCE} = {}) {
  const snapshotPath = join(repoRoot, 'tests/data/ruoyi-java-scan-input.json')
  const snapshot = JSON.parse(readFileSync(snapshotPath, 'utf8'))
  if (!/^[0-9a-f]{40}$/u.test(snapshot.sourceCommit) || !/^[0-9a-f]{64}$/u.test(snapshot.sourceDigest) || !Array.isArray(snapshot.records)) throw new Error('invalid committed RuoYi scan snapshot')
  if (!existsSync(sourceRoot)) {
    if (process.env.RUOYI_SOURCE_ROOT) throw new Error(`explicit RuoYi source root missing: ${sourceRoot}`)
    return {mode: 'committed-snapshot', ...snapshot}
  }
  const records = scanSourceTree(sourceRoot)
  if (sourceDigest(sourceRoot) !== snapshot.sourceDigest || JSON.stringify(records) !== JSON.stringify(snapshot.records)) throw new Error('stale committed RuoYi scan snapshot; run --refresh-snapshot after reviewing source changes')
  return {mode: 'fresh-source', ...snapshot, records}
}

function canonicalPaths(repoRoot) {
  const manifest = readFileSync(join(repoRoot, 'docs/.vitepress/config/java-course.ts'), 'utf8')
  const paths = new Set()
  for (const chapter of manifest.matchAll(/createChapter\('([^']+)'[^\n]*\[([\s\S]*?)\n\s*\]\)/gu)) {
    for (const article of chapter[2].matchAll(/article\('([^']+\.md)'/gu)) paths.add(`docs/courses/java/${chapter[1]}/${article[1]}`)
  }
  return paths
}

function sections(body) {
  const lines = body.split(/\r?\n/u)
  const starts = []
  let inFence = false
  lines.forEach((line, index) => {
    if (/^\s*```/u.test(line)) { inFence = !inFence; return }
    if (!inFence) {
      const match = line.match(/^(#{1,3})(?!#)\s+(\S.*)$/u)
      if (match) starts.push({index, level: match[1].length, heading: match[2].trim()})
    }
  })
  return starts.filter(entry => entry.level === 3).map(entry => ({
    heading: entry.heading,
    label: entry.heading.split(/[：:]/u, 1)[0].replaceAll('`', '').trim(),
    content: lines.slice(entry.index + 1, starts.find(next => next.index > entry.index)?.index ?? lines.length).join('\n').trim(),
  }))
}

function hasExample(content) {
  return [...content.matchAll(/```(?:java|sql|xml|redis|shell|bash)\s*\r?\n([\s\S]*?)```/gu)]
    .some(match => match[1].split(/\r?\n/u).some(line => line.trim() && !/^\s*(?:\/\/|#|--|\*)/u.test(line)))
}

function removeJavaComments(source) {
  return source.replace(/\/\*[\s\S]*?\*\/|\/\/[^\r\n]*|"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'/gu, match =>
    match.startsWith('"') || match.startsWith("'") ? match : match.replace(/[^\r\n]/gu, ' '))
}

function inferredExampleType(expression) {
  const construction = expression.match(/\bnew\s+([A-Z][A-Za-z0-9_$]*)/u)
  if (construction) return construction[1]
  if (/\.iterator\s*\(/u.test(expression)) return 'Iterator'
  if (/\.matcher\s*\(/u.test(expression)) return 'Matcher'
  if (/\.(?:submit|schedule|scheduleAtFixedRate|scheduleWithFixedDelay)\s*\(/u.test(expression)) return 'Future'
  if (/\.stream\s*\(/u.test(expression)) return 'Stream'
  const factory = expression.match(/\b(List|Set|Map|Stream|Optional)\.(?:of|ofNullable|asList|empty)\s*\(/u)
  return factory?.[1]
}

const EXAMPLE_SUPERTYPES = {
  AbstractList: ['List'], ArrayList: ['List'], LinkedList: ['List'], Vector: ['List'],
  AbstractSet: ['Set'], HashSet: ['Set'], LinkedHashSet: ['Set'], TreeSet: ['Set'],
  List: ['Collection'], Set: ['Collection'], Collection: ['Iterable'],
  String: ['CharSequence'], StringBuilder: ['CharSequence', 'Appendable'],
  BufferedReader: ['Reader'], InputStreamReader: ['Reader'], Reader: ['Closeable'],
  StringWriter: ['Writer'], Writer: ['Appendable', 'Closeable'],
}

function exampleTypeIs(actual, expected, seen = new Set()) {
  if (actual === expected) return true
  if (seen.has(actual)) return false
  seen.add(actual)
  return (EXAMPLE_SUPERTYPES[actual] ?? []).some(parent => exampleTypeIs(parent, expected, seen))
}

function closeParenthesis(code, openParen) {
  let depth = 0
  for (let index = openParen; index < code.length; index++) {
    if (code[index] === '(') depth++
    else if (code[index] === ')' && --depth === 0) return index
  }
  return -1
}

function factoryCallProvides(code, owner, method) {
  const factories = /\b(List|Set|Map|Stream|Optional)\.(?:of|ofNullable|asList|empty)\s*\(/gu
  for (const match of code.matchAll(factories)) {
    if (!exampleTypeIs(match[1], owner)) continue
    const openParen = match.index + match[0].lastIndexOf('(')
    const close = closeParenthesis(code, openParen)
    if (close < 0) continue
    const next = code.slice(close + 1).match(/^\s*\.\s*([A-Za-z_$][\w$]*)\s*\(/u)
    if (next?.[1] === method) return true
  }
  return false
}

function exampleUsesSymbol(content, symbol) {
  const rawExamples = [...content.matchAll(/```(?:java|sql|xml|redis|shell|bash)\s*\r?\n([\s\S]*?)```/gu)]
    .map(match => match[1]).join('\n')
  const commentFree = removeJavaComments(rawExamples)
  const name = symbol.split('.').at(-1)
  if (symbol.startsWith('@')) return new RegExp(`@(?:[\\w$]+\\.)*${name.slice(1)}\\b`, 'u').test(executableJava(commentFree))
  if (!symbol.includes('.')) return new RegExp(`\\b${name}\\b`, 'u').test(executableJava(commentFree))

  const [owner, method] = symbol.split('.')
  let literalIndex = 0
  let example = commentFree.replace(/("(?:\\.|[^"\\])*")\s*\.\s*([A-Za-z_$][\w$]*)\s*\(/gu, (_match, literal, calledMethod) => {
    const variable = `__coverageString${literalIndex++}`
    return `String ${variable} = ${literal}; ${variable}.${calledMethod}(`
  })
  const inferred = new Map()
  example = example.replace(/\bvar\s+([A-Za-z_$][\w$]*)\s*=\s*([^;\r\n]+)/gu, (match, variable, expression) => {
    const type = inferredExampleType(executableJava(expression))
    if (!type) return match
    inferred.set(variable, type)
    return `${type} ${variable} = ${expression}`
  })
  // The source scanner deliberately rejects unknown wildcard packages. In a
  // course example, synthesize imports for its visible receiver types instead.
  example = example.replace(/^\s*import\s+(?!static\b)[\w.]+\.\*\s*;\s*$/gmu, '')
  const code = executableJava(example)
  const explicitImports = [...code.matchAll(/^\s*import\s+(static\s+)?([\w.]+)\s*;\s*$/gmu)]
    .filter(match => !match[2].endsWith('.*'))
  const importedNames = new Set(explicitImports.filter(match => !match[1]).map(match => match[2].split('.').at(-1)))
  const localTypes = new Set([...code.matchAll(/\b(?:class|interface|enum|record)\s+([A-Z][A-Za-z0-9_$]*)/gu)].map(match => match[1]))
  const typeNames = new Set([...code.matchAll(/\b([A-Z][A-Za-z0-9_$]*)\b/gu)].map(match => match[1]))
  for (const type of inferred.values()) typeNames.add(type)
  typeNames.add(owner)
  const syntheticImports = [...typeNames].filter(type => !importedNames.has(type) && !localTypes.has(type)).map(type => `import coverage.${type};`)

  const declarationNames = new Set([...code.matchAll(/\b[A-Z][A-Za-z0-9_$]*(?:\s*<[^;=(){}]*>)?(?:\s*\[\])?\s+([A-Za-z_$][\w$]*)\b/gu)].map(match => match[1]))
  const conventionalAliases = {DataValidation: ['validation'], Logger: ['log'], Row: ['row'], Scheduler: ['scheduler'], Sheet: ['sheet'], Workbook: ['workbook']}
  const syntheticDeclarations = []
  for (const receiver of conventionalAliases[owner] ?? []) {
    const call = new RegExp(`\\b${receiver}\\s*\\.\\s*${method}\\s*\\(`, 'u')
    if (call.test(code) && !declarationNames.has(receiver)) syntheticDeclarations.push(`${owner} ${receiver};`)
  }

  const scanPrefix = `${syntheticImports.join('\n')}\n${explicitImports.map(match => match[0].trim()).join('\n')}`
  const scanned = scanJavaSource(`${scanPrefix}\n${syntheticDeclarations.join('\n')}\n${example}`, 'coverage-example.java')
  const fluentReceiverPaths = [
    {pattern: /^Pattern\.(?:compile\(\)\.)?matcher\(\)\./u, type: 'Matcher'},
  ]
  if (scanned.some(record => {
    if (record.symbol === symbol) return true
    if (record.symbol.startsWith('?')) return false
    const [actualOwner, actualMethod] = record.symbol.split('.')
    return actualMethod === method && exampleTypeIs(actualOwner, owner)
  }) || scanned.some(record => {
    if (!record.symbol.startsWith('?')) return false
    const chain = record.symbol.slice(1)
    return chain.endsWith(`.${method}`) && fluentReceiverPaths.some(path => path.pattern.test(chain) && exampleTypeIs(path.type, owner))
  })) return true
  return factoryCallProvides(code, owner, method)
}

const required = (value, name, issues) => {
  if (typeof value !== 'string' || !value.trim()) issues.push(`${name} is required`)
}

function realIsoDate(value) {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/u.test(value) || Number(value.slice(0, 4)) < 1) return false
  const date = new Date(`${value}T00:00:00.000Z`)
  return Number.isFinite(date.valueOf()) && date.toISOString().slice(0, 10) === value
}

export function validateCoverage(data, {repoRoot = ROOT, scanned = []} = {}) {
  const issues = []
  if (!data || typeof data !== 'object' || !data.ruoyi || !data.official) return ['separate ruoyi and official denominators required']
  const ruoyi = data.ruoyi.records
  const official = data.official.records
  if (!Array.isArray(ruoyi) || !Array.isArray(official)) return ['separate ruoyi and official record arrays required']
  if ('total' in data.ruoyi && data.ruoyi.total !== ruoyi.length) issues.push('RuoYi denominator differs from records')
  if ('total' in data.official && data.official.total !== official.length) issues.push('official denominator differs from records')
  const paths = canonicalPaths(repoRoot)
  const cache = new Map()
  const heading = (article, label, context, directSymbol) => {
    if (!paths.has(article)) { issues.push(`${context}: noncanonical article ${article}`); return }
    const path = join(repoRoot, ...article.split('/'))
    if (!existsSync(path)) { issues.push(`${context}: article missing ${article}`); return }
    if (!cache.has(article)) cache.set(article, sections(readFileSync(path, 'utf8')))
    const matches = cache.get(article).filter(section => section.label === label)
    if (matches.length !== 1) { issues.push(`${context}: heading ${label} missing or duplicate`); return }
    if (!hasExample(matches[0].content)) issues.push(`${context}: heading ${label} lacks executable example`)
    else if (directSymbol && !exampleUsesSymbol(matches[0].content, directSymbol)) issues.push(`${context}: example must use ${directSymbol}`)
  }
  const scan = new Map(scanned.map(record => [record.symbol, record]))
  const seen = new Set()
  for (const record of ruoyi) {
    const key = record.symbol
    required(key, 'RuoYi symbol', issues)
    if (seen.has(key)) issues.push(`duplicate RuoYi symbol ${key}`)
    seen.add(key)
    if (!Number.isSafeInteger(record.frequency) || record.frequency < 1) issues.push(`${key}: invalid frequency`)
    if (scan.get(key)?.frequency !== record.frequency) issues.push(`${key}: stale scan result (${record.frequency} vs ${scan.get(key)?.frequency})`)
    if (!['direct-searchable', 'covered-by-concept', 'project-private'].includes(record.classification)) issues.push(`${key}: invalid classification`)
    required(record.reason, `${key}: reason`, issues)
    if (record.classification === 'project-private') {
      if (record.article || record.heading) issues.push(`${key}: private exclusion must not claim article coverage`)
      if (!['project-specific', 'false-positive', 'generated'].includes(record.exclusionKind) || !record.evidence || !scan.get(key)?.files?.includes(record.evidence) || /\bunresolved\b/iu.test(record.reason ?? '')) issues.push(`${key}: unsupported private exclusion; require verified kind, source evidence, and resolved reason`)
    } else {
      required(record.article, `${key}: article`, issues)
      required(record.heading, `${key}: heading`, issues)
      if (record.article && record.heading) heading(record.article, record.heading, key, record.classification === 'direct-searchable' ? key : undefined)
      if (record.classification === 'direct-searchable' && record.heading !== key) issues.push(`${key}: direct heading must use exact real name`)
    }
  }
  for (const symbol of scan.keys()) if (!seen.has(symbol)) issues.push(`${symbol}: missing RuoYi attribution`)
  const officialSeen = new Set()
  const authorities = {
    'JDK 20': /^https:\/\/docs\.oracle\.com\/en\/java\/javase\/20\/docs\//u,
    'MySQL 8.0': /^https:\/\/dev\.mysql\.com\/doc\/refman\/8\.0\/en\//u,
    'Redis stable': /^https:\/\/redis\.io\/docs\/latest\//u,
    'Spring Framework': /^https:\/\/docs\.spring\.io\/spring-framework\/reference\//u,
    'MyBatis-Plus': /^https:\/\/baomidou\.com\/en\//u,
  }
  for (const record of official) {
    const key = `${record.ecosystem}:${record.capability}`
    if (officialSeen.has(key)) issues.push(`duplicate official capability ${key}`)
    officialSeen.add(key)
    for (const field of ['ecosystem', 'capability', 'source', 'article', 'heading', 'reviewedAt']) required(record[field], `official ${key}: ${field}`, issues)
    if (record.source && !/^https:\/\//u.test(record.source)) issues.push(`official ${key}: source must be HTTPS`)
    if (record.source && !authorities[record.ecosystem]?.test(record.source)) issues.push(`official ${key}: authoritative source does not match ecosystem`)
    if (record.reviewedAt && !/^\d{4}-\d{2}-\d{2}$/u.test(record.reviewedAt)) issues.push(`official ${key}: reviewedAt must be ISO date`)
    else if (record.reviewedAt && !realIsoDate(record.reviewedAt)) issues.push(`official ${key}: reviewedAt must be a real calendar date`)
    else if (record.reviewedAt && record.reviewedAt > new Date().toISOString().slice(0, 10)) issues.push(`official ${key}: reviewedAt cannot be in the future`)
    if (record.article && record.heading) heading(record.article, record.heading, `official ${key}`, record.capability)
  }
  if (Object.keys(authorities).some(ecosystem => !official.some(record => record.ecosystem === ecosystem))) issues.push('official denominator must cover all five selected ecosystems')
  return issues
}

export function auditCoverage({repoRoot = ROOT, sourceRoot = SOURCE, officialOverride} = {}) {
  const scanInput = loadScanInput({repoRoot, sourceRoot})
  const scanned = scanInput.records
  const ruoyi = JSON.parse(readFileSync(join(repoRoot, 'tests/data/ruoyi-external-api-coverage.json'), 'utf8'))
  const official = officialOverride ?? JSON.parse(readFileSync(join(repoRoot, 'tests/data/official-common-api-coverage.json'), 'utf8'))
  const issues = validateCoverage({ruoyi, official}, {repoRoot, scanned})
  const attributed = ruoyi.records.filter(record => scanned.some(item => item.symbol === record.symbol && item.frequency === record.frequency)).length
  const uncovered = official.records.filter(record => issues.some(issue => issue.startsWith(`official ${record.ecosystem}:${record.capability}:`))).length
  return {issues, scanMode: scanInput.mode, ruoyi: {total: scanned.length, attributed}, official: {total: official.records.length, uncovered}}
}

function bootstrapAttribution(repoRoot = ROOT) {
  const headings = []
  for (const article of [...canonicalPaths(repoRoot)].sort()) {
    const path = join(repoRoot, ...article.split('/'))
    if (!existsSync(path)) continue
    for (const section of sections(readFileSync(path, 'utf8'))) {
      if (hasExample(section.content)) headings.push({article, heading: section.label})
    }
  }
  const records = scanSourceTree().map(({symbol, frequency, files}) => {
    const chainConcepts = [
      [/^\?List\.stream\(\)\.(map|filter|sorted)$/u, '06-函数式与时间/02-Stream流式处理.md', match => match[1], 'List.stream returns Stream; the following operation is demonstrated in this Stream lesson.'],
      [/^\?Collection\.stream\(\)\.filter$/u, '06-函数式与时间/02-Stream流式处理.md', () => 'filter', 'Collection.stream returns Stream; filter is demonstrated here.'],
      [/^\?List\.stream\(\)\.collect$/u, '06-函数式与时间/02-Stream流式处理.md', () => 'Collectors.toList', 'The Stream lesson demonstrates collection as a terminal workflow.'],
      [/^\?Optional\.ofNullable\(\)\.ifPresent$/u, '02-数组与文本/03-常用类与包装类型.md', () => 'Optional.ifPresent', 'Optional.ofNullable returns Optional; this section demonstrates ifPresent.'],
      [/^\?Pattern\.matcher\(\)\.(find|matches)$/u, '02-数组与文本/04-正则表达式与文本匹配.md', match => `Matcher.${match[1]}`, 'Pattern.matcher returns Matcher; this section demonstrates the follow-up call.'],
      [/^\?StringBuilder\.append\(\)\.append$/u, '02-数组与文本/02-String与文本处理.md', () => 'StringBuilder.append', 'StringBuilder.append returns the builder for chaining.'],
      [/^\?RedisTemplate\.opsFor/u, '15-Redis/13-RedisTemplate序列化与连接管理.md', () => 'RedisTemplate', 'RedisTemplate operation views are introduced in this integration lesson.'],
      [/^\?BigDecimal\.(?:add|subtract|multiply|divide)\(\)\./u, '02-数组与文本/06-大数与精确计算.md', match => `BigDecimal.${match[0].match(/BigDecimal\.(add|subtract|multiply|divide)/u)[1]}`, 'The BigDecimal arithmetic lesson explains the first operation; the chained conversion is contextual.'],
      [/^\?String\.(substring|trim)\(\)\./u, '02-数组与文本/02-String与文本处理.md', match => match[1] === 'trim' ? 'trim' : 'String.substring', 'String transformation chaining is explained in the matching text-operation section.'],
      [/^\?(?:Long|Integer)\.(?:decode|valueOf)\(\)\./u, '02-数组与文本/03-常用类与包装类型.md', () => '自动装箱/拆箱', 'Wrapper conversion and unboxing are explained in this section.'],
      [/^\?(?:Info|OpenAPI|SecurityScheme)\./u, '14-后端工程/13-OpenAPI与统一错误契约.md', () => '@Operation', 'Swagger model-builder chains configure the OpenAPI endpoint and security contract.'],
      [/^\?ToStringBuilder\.append\(\)(?:\.append(?:\(\))?)*(?:\.toString)?$/u, '02-数组与文本/02-String与文本处理.md', () => 'StringBuilder.append', 'Commons Lang ToStringBuilder uses the same fluent append-and-render pattern as the demonstrated StringBuilder builder.'],
    ]
    const chain = chainConcepts.map(([pattern, path, label, reason]) => ({match: symbol.match(pattern), path, label, reason})).find(item => item.match)
    if (chain) return {symbol, frequency, classification: 'covered-by-concept', reason: chain.reason, article: `docs/courses/java/${chain.path}`, heading: chain.label(chain.match)}
    // Reviewed source/API families. These are narrow mappings to an existing
    // executable concept section; anything outside them fails closed instead
    // of receiving a private/unresolved fallback attribution.
    const reviewedConcepts = [
      [/^@Retention$/u, '08-反射与模块/04-注解定义与运行时读取.md', '@Retention(RUNTIME)', 'Retention policy determines whether an annotation survives for runtime reflection.'],
      [/^@(?:Before|AfterReturning|AfterThrowing)$/u, '14-后端工程/03-Spring-AOP与声明式事务.md', '@Around', 'AspectJ advice annotations share the join-point and proxy model demonstrated by Around.'],
      [/^@(?:Schema|Tag)$/u, '14-后端工程/13-OpenAPI与统一错误契约.md', '@Operation', 'OpenAPI annotations describe the generated endpoint contract.'],
      [/^@Nullable$/u, '14-后端工程/08-Bean-Validation参数校验.md', '@NotNull', 'Nullability annotations are contrasted with validation at the request boundary.'],
      [/^@InitBinder$/u, '14-后端工程/04-Spring-MVC与Servlet边界.md', '@RequestParam', 'Binding customization belongs to the MVC request-parameter boundary.'],
      [/^CollectionUtils\.isEmpty$/u, '05-泛型与集合/05-Set去重与集合运算.md', 'Set.isEmpty', 'The section demonstrates emptiness checks; Spring CollectionUtils adds null handling.'],
      [/^(?:ConcurrentMap\.|\?Map\.|\?Arrays\.asList\(\)\.contains)/u, '05-泛型与集合/07-Map常用API.md', 'Map.get', 'Map lookup and concurrent-map operations are related to this map access contract.'],
      [/^\?Map\.computeIfAbsent\(\)/u, '05-泛型与集合/03-Map与集合选择.md', 'Map.computeIfAbsent', 'computeIfAbsent returns the mapped value; the chained collection update uses that result.'],
      [/^\?Map\.keySet\(\)/u, '05-泛型与集合/07-Map常用API.md', 'Map.keySet', 'The key-set view feeds the chained iteration.'],
      [/^\?(?:List|Set|Collection|Arrays)\.(?:stream|asList)\(\)/u, '06-函数式与时间/02-Stream流式处理.md', 'Collection.stream', 'The collection or array source feeds a Stream pipeline demonstrated in this lesson.'],
      [/^\?Objects\.requireNonNull\(\)/u, '02-数组与文本/03-常用类与包装类型.md', 'Objects.requireNonNull', 'The chained call uses the non-null value returned by requireNonNull.'],
      [/^\?StringBuilder\.append\(\)/u, '02-数组与文本/02-String与文本处理.md', 'StringBuilder.append', 'append returns the same builder, enabling the observed chain.'],
      [/^\?String\.replaceAll\(\)/u, '02-数组与文本/04-正则表达式与文本匹配.md', 'replaceAll', 'Repeated replacements compose the regex replacement operation.'],
      [/^\?String\.subSequence\(\)/u, '02-数组与文本/02-String与文本处理.md', 'subSequence', 'The CharSequence result is converted to text.'],
      [/^\?StringWriter\.toString\(\)/u, '07-IO与网络/04-字节流字符流与缓冲.md', 'StringWriter.toString', 'The writer result is subsequently parsed as text.'],
      [/^\?Matcher\.group\(\)/u, '02-数组与文本/04-正则表达式与文本匹配.md', 'Matcher.group', 'The captured group is transformed after extraction.'],
      [/^\?(?:Object\.getClass|Class\.|Method\.|Field\.)/u, '08-反射与模块/05-动态代理与反射边界.md', 'Method.invoke', 'Reflection metadata and invocation are part of this dynamic-proxy boundary.'],
      [/^\?Cell\.|^\?Sheet\.|^\?Workbook\./u, '14-后端工程/11-Apache-POI-Excel导入导出.md', 'Row.createCell', 'The chained POI object participates in the workbook, row and cell workflow.'],
      [/^\?(?:HttpServletRequest|HttpServletResponse|ServletResponse)\./u, '14-后端工程/04-Spring-MVC与Servlet边界.md', 'HttpServletResponse.sendError', 'Servlet request and response objects are handled at this MVC boundary.'],
      [/^\?(?:JobBuilder|TriggerBuilder|JobDetail|JobExecutionContext)\./u, '14-后端工程/12-Quartz定时任务.md', 'JobBuilder.newJob', 'Quartz builders and execution data follow the job scheduling workflow.'],
      [/^\?Jwts\./u, '14-后端工程/05-Spring-Security与JWT.md', 'Jwts.parser', 'The JJWT builder/parser chain belongs to the token validation lifecycle.'],
      [/^\?SecurityContextHolder\./u, '14-后端工程/05-Spring-Security与JWT.md', '@PreAuthorize', 'The security context supplies authentication for method authorization.'],
      [/^\?String\.(?:trim|substring)\(\)/u, '02-数组与文本/02-String与文本处理.md', 'String.substring', 'String transformations are composed in this text-processing lesson.'],
      [/^\?(?:PageHelper|ResourceHandlerRegistry|InterceptorRegistry)\./u, '14-后端工程/04-Spring-MVC与Servlet边界.md', 'InterceptorRegistry.addInterceptor', 'Framework builder chaining configures the MVC interception boundary.'],
      [/^(?:ApplicationContext|ConfigurableListableBeanFactory|SpringApplicationBuilder)\./u, '14-后端工程/02-Spring-IoC与Bean生命周期.md', '@Bean', 'Bean lookup, environment and registration are part of Spring container lifecycle.'],
      [/^(?:HttpServletRequest|ServletRequest|ServletResponse|HttpServletResponse|FilterConfig|HandlerMethod|RequestMappingHandlerMapping|WebDataBinder|AntPathMatcher)\./u, '14-后端工程/04-Spring-MVC与Servlet边界.md', '@RequestParam', 'Servlet and MVC request handling are explained in this boundary lesson.'],
      [/^(?:JoinPoint|ProceedingJoinPoint|MethodSignature)\./u, '14-后端工程/03-Spring-AOP与声明式事务.md', '@Around', 'Join-point metadata and proceed behavior are part of the advice workflow.'],
      [/^(?:Modifier|ParameterizedType|FieldUtils|ClassUtils)\./u, '08-反射与模块/04-注解定义与运行时读取.md', 'Field.get', 'Reflection type and member inspection support the annotation-reading workflow.'],
      [/^(?:CollectionUtils|ConcurrentMap)\./u, '05-泛型与集合/07-Map常用API.md', 'Map.get', 'Collection and map helper calls implement container lookup and emptiness concepts.'],
      [/^(?:DateFormatUtils|DecimalFormat|NumberFormat)\b/u, '06-函数式与时间/07-日期格式化与解析.md', 'SimpleDateFormat', 'Legacy formatting helpers serve the date/text formatting boundary.'],
      [/^(?:DefaultRedisScript|HashOperations|ValueOperations|BoundSetOperations|RequestContextHolder)\b/u, '15-Redis/13-RedisTemplate序列化与连接管理.md', 'RedisTemplate', 'Spring Redis operation views and script execution belong to RedisTemplate integration.'],
      [/^(?:Authentication|AuthenticationManager|AuthenticationConfiguration|UsernamePasswordAuthenticationToken|SecurityContextHolder|AccessDeniedException|WebAuthenticationDetailsSource)\b/u, '14-后端工程/05-Spring-Security与JWT.md', '@PreAuthorize', 'Authentication objects support the method authorization contract.'],
      [/^(?:JsonGenerator|JSONArray|JSONReader|SerializationContext)\b/u, '14-后端工程/07-Jackson与Fastjson2-JSON.md', 'JSONObject.containsKey', 'JSON tree and serialization helpers belong to the structured JSON boundary.'],
      [/^(?:FileInputStream|FileNotFoundException|FastByteArrayOutputStream|FileUtils|ZipEntry)\b/u, '07-IO与网络/04-字节流字符流与缓冲.md', 'InputStream.read', 'File and byte-stream helpers participate in the stream lifecycle.'],
      [/^DefaultResourceLoader\./u, '14-后端工程/06-MyBatis核心与MyBatis-Plus重点.md', '@MapperScan', 'DefaultResourceLoader resolves mapper XML resources used by the MyBatis configuration.'],
      [/^(?:ThreadPoolTaskExecutor|ScheduledThreadPoolExecutor|TimerTask|BasicThreadFactory|ThreadLocalRandom)\b/u, '09-并发编程/02-并发工具与线程安全.md', 'ThreadPoolExecutor.CallerRunsPolicy', 'Executor configuration and scheduling share the bounded-thread-pool concept.'],
      [/^(?:Velocity|VelocityContext)\b/u, '12-工程实践/04-Velocity代码生成.md', 'VelocityEngine.getTemplate', 'The handwritten generator uses Velocity template loading and context binding.'],
      [/^(?:SqlSessionFactoryBean|VFS)\b/u, '14-后端工程/06-MyBatis核心与MyBatis-Plus重点.md', '@MapperScan', 'Mapper discovery and SqlSessionFactory configuration support the MyBatis integration.'],
      [/^(?:LocaleChangeInterceptor|LocaleContextHolder|MessageSource|SessionLocaleResolver)\b/u, '14-后端工程/04-Spring-MVC与Servlet边界.md', 'InterceptorRegistry.addInterceptor', 'Locale changes use the MVC interceptor and request-context boundary.'],
      [/^(?:CacheControl|Resource|DefaultResourceLoader|PathMatchingResourcePatternResolver|ResourcePatternResolver|CachingMetadataReaderFactory|MetadataReader|MetadataReaderFactory|PatternMatchUtils)\b/u, '14-后端工程/04-Spring-MVC与Servlet边界.md', 'ResourceHandlerRegistry.addResourceHandler', 'Framework resource lookup and response cache metadata are part of resource registration.'],
      [/^(?:ImageIO|Name\.|DateUtil\.|XSSFClientAnchor|XSSFDrawing|XSSFPicture|HSSFClientAnchor|HSSFPicture|HSSFWorkbook|HSSFSheet|CTMarker|PictureData)\b/u, '14-后端工程/11-Apache-POI-Excel导入导出.md', 'WorkbookFactory.create', 'POI image, name and date helpers belong to workbook import/export handling.'],
      [/^(?:BindException|MethodArgumentNotValidException|MethodArgumentTypeMismatchException|MissingPathVariableException|ConstraintViolationException|Validator)\b/u, '14-后端工程/08-Bean-Validation参数校验.md', '@Valid', 'Validation and binding errors are handled at the request-validation boundary.'],
      [/^(?:OpenAPI|Info|SecurityRequirement|SecurityScheme|Components)\b/u, '14-后端工程/13-OpenAPI与统一错误契约.md', '@Operation', 'OpenAPI model objects describe endpoint and security metadata.'],
      [/^ToStringBuilder\.append$/u, '02-数组与文本/02-String与文本处理.md', 'StringBuilder.append', 'Commons Lang ToStringBuilder is a fluent text builder with append operations.'],
      [/^\?ApplicationContext\.getEnvironment\(\)/u, '14-后端工程/02-Spring-IoC与Bean生命周期.md', '@Value', 'Spring Environment resolves configuration during bean creation.'],
      [/^\?Authentication\.getCredentials\(\)/u, '14-后端工程/05-Spring-Security与JWT.md', '@PreAuthorize', 'Authentication credentials are part of the method-security context.'],
      [/^\?BasicThreadFactory\.builder\(\)/u, '09-并发编程/02-并发工具与线程安全.md', 'ThreadPoolExecutor.CallerRunsPolicy', 'The builder configures threads for a bounded executor.'],
      [/^\?BeanProperty\.getType\(\)/u, '14-后端工程/07-Jackson与Fastjson2-JSON.md', '@JsonSerialize', 'Jackson property metadata guides serialization.'],
      [/^\?BindException\.getAllErrors\(\)/u, '14-后端工程/08-Bean-Validation参数校验.md', '@Valid', 'Binding errors are converted at the request-validation boundary.'],
      [/^\?CacheControl\.maxAge\(\)/u, '14-后端工程/04-Spring-MVC与Servlet边界.md', 'ResourceHandlerRegistry.addResourceHandler', 'Resource cache policy is configured while registering MVC resources.'],
      [/^\?Charset\./u, '07-IO与网络/04-字节流字符流与缓冲.md', 'Charset', 'Charset conversion is demonstrated in the byte/text boundary.'],
      [/^\?File\.getParentFile\(\)/u, '07-IO与网络/04-字节流字符流与缓冲.md', 'File.exists', 'The parent-path existence and creation check belongs to file I/O.'],
      [/^\?InetAddress\.getLocalHost\(\)/u, '07-IO与网络/06-HTTP-Client常用API.md', 'URL.openConnection', 'Host-address lookup is a network endpoint concern.'],
      [/^\?JoinPoint\./u, '14-后端工程/03-Spring-AOP与声明式事务.md', '@Around', 'JoinPoint metadata is inspected inside advice.'],
      [/^\?JSON\.toJSONString\(\)/u, '14-后端工程/07-Jackson与Fastjson2-JSON.md', 'JSONObject.containsKey', 'Serialized JSON is converted to transport bytes.'],
      [/^\?List\.get\(\)/u, '05-泛型与集合/04-List常用API.md', 'List.get', 'The indexed element is used in a follow-up call.'],
      [/^\?Long\.toHexString\(\)/u, '02-数组与文本/03-常用类与包装类型.md', 'Long.toString', 'Numeric text conversion precedes the substring.'],
      [/^\?MethodArgument(?:NotValid|TypeMismatch)Exception\./u, '14-后端工程/08-Bean-Validation参数校验.md', '@Valid', 'Binding exceptions expose field-error details at the validation boundary.'],
      [/^\?NumberFormat\.getInstance\(\)/u, '06-函数式与时间/07-日期格式化与解析.md', 'SimpleDateFormat', 'Legacy formatter parsing is a text-to-value conversion.'],
      [/^\?Properties\.stringPropertyNames\(\)/u, '12-工程实践/04-Velocity代码生成.md', 'Properties()', 'Property names feed template-engine configuration.'],
      [/^\?RequestContextHolder\./u, '14-后端工程/04-Spring-MVC与Servlet边界.md', '@RequestParam', 'Request attributes are scoped to the current MVC request.'],
      [/^\?Thread\.currentThread\(\)\.interrupt$/u, '09-并发编程/02-并发工具与线程安全.md', 'ThreadPoolExecutor.CallerRunsPolicy', 'Interruption preserves cancellation in concurrent execution.'],
      [/^(?:AntPathMatcher|PropertyEditorSupport)\b/u, '14-后端工程/04-Spring-MVC与Servlet边界.md', '@RequestMapping', 'Path matching and property binding belong to MVC request dispatch.'],
      [/^BeanProperty\b/u, '14-后端工程/07-Jackson与Fastjson2-JSON.md', '@JsonSerialize', 'Jackson BeanProperty metadata supports custom serialization.'],
      [/^Contact\b/u, '14-后端工程/13-OpenAPI与统一错误契约.md', '@Operation', 'OpenAPI Contact is descriptive endpoint metadata.'],
      [/^(?:JobExecutionContext|TriggerKey)\b/u, '14-后端工程/12-Quartz定时任务.md', 'JobDataMap', 'Quartz execution data and trigger identity belong to job scheduling.'],
      [/^(?:Byte|Short|Float)\.parse/u, '02-数组与文本/03-常用类与包装类型.md', 'Integer.parseInt', 'Primitive wrapper parsing follows the same checked text-to-number boundary.'],
      [/^(?:ExceptionUtils|ExecutionException)\b/u, '04-现代Java类型/05-异常处理常用写法.md', '按具体到一般的顺序捕获异常', 'Exception causes are inspected in the error-handling workflow.'],
      [/^FilenameUtils\./u, '07-IO与网络/04-字节流字符流与缓冲.md', 'Paths.get', 'Filename extraction belongs to path parsing and file I/O.'],
      [/^HttpRequestMethodNotSupportedException\b/u, '14-后端工程/04-Spring-MVC与Servlet边界.md', '@ExceptionHandler', 'Framework exceptions are mapped at the MVC error boundary.'],
      [/^InetAddress\./u, '07-IO与网络/06-HTTP-Client常用API.md', 'URL.openConnection', 'Host lookup supports network endpoint handling.'],
      [/^MessageDigest\./u, '14-后端工程/05-Spring-Security与JWT.md', 'BCryptPasswordEncoder', 'The security lesson contrasts controlled password hashing with raw digest primitives.'],
      [/^NamedThreadLocal\b/u, '09-并发编程/04-虚拟线程.md', 'ThreadLocal', 'NamedThreadLocal is a scoped task-context holder.'],
      [/^TimeUnit\.toChronoUnit$/u, '06-函数式与时间/03-日期时间API.md', 'Duration', 'The unit conversion feeds a Java Duration.'],
      [/^PrintStream\.println$/u, '01-Java基础/01-开发环境与第一个程序.md', 'javac 与 java', 'Console output is introduced in the first runnable Java example.'],
      [/^SecureRandom\.getInstance$/u, '14-后端工程/05-Spring-Security与JWT.md', 'BCryptPasswordEncoder', 'Cryptographic randomness supports credential and token security.'],
      [/^URLDecoder\.decode$/u, '07-IO与网络/06-HTTP-Client常用API.md', 'URLEncoder.encode', 'URL decoding is the inverse transport boundary of URL encoding.'],
    ]
    const reviewed = reviewedConcepts.find(([pattern]) => pattern.test(symbol))
    if (reviewed && !headings.some(item => item.heading === symbol)) return {symbol, frequency, classification: 'covered-by-concept', reason: reviewed[3], article: `docs/courses/java/${reviewed[1]}`, heading: reviewed[2]}
    const reviewedExclusions = [
      [/^(?:\?DruidDataSourceBuilder|DruidDataSource|DruidDataSourceBuilder|DruidStatProperties|Utils\.readFromResource)/u, /(?:DruidConfig|DruidProperties|DruidStatViewServletFilter|DruidDataSourceBuilder)/u, 'RuoYi-specific Druid pool and admin-console configuration; the course teaches portable JDBC and HikariCP boundaries.'],
      [/^(?:Config|DefaultKaptcha|Producer\.)/u, /(?:CaptchaConfig|CaptchaController)/u, 'Application CAPTCHA image/text provider wiring, outside the selected general Java/API curriculum.'],
      [/^(?:\?ManagementFactory|ManagementFactory|CentralProcessor|FileSystem|getFileStores|GlobalMemory|HardwareAbstractionLayer|OperatingSystem|OSFileStore|SystemInfo|Util\.sleep)/u, /(?:Server|Jvm|Cpu|Mem|Sys|Disk|DateUtils)/u, 'Application host inventory and JVM diagnostic sampling for its server dashboard, not a common API lesson.'],
      [/^(?:HttpsURLConnection|SSLContext)/u, /HttpUtils\.java$/u, 'Project HTTP/TLS compatibility helper with custom connection policy; excluded from the portable HTTP Client baseline.'],
      [/^(?:MySqlCreateTableStatement|SQLUtils|\?MySqlCreateTableStatement)/u, /ruoyi-generator\//u, 'Generator-specific SQL DDL parsing for imported tables, not MySQL server SQL instruction.'],
      [/^\?HSSFSheet\.getDrawingPatriarch/u, /ExcelUtil\.java$/u, 'Project-specific Excel drawing/image traversal beyond the course workbook import/export baseline.'],
      [/^\?MetadataReader\.getClassMetadata/u, /MyBatisConfig\.java$/u, 'Project-specific mapper package discovery customization beyond the course MyBatis contract.'],
      [/^UserAgentAnalyzer\.parse$/u, /UserAgentUtils\.java$/u, 'Application login-log user-agent classification, outside the selected HTTP transport curriculum.'],
    ]
    const exclusion = reviewedExclusions.find(([pattern, path]) => pattern.test(symbol) && files.some(file => path.test(file)))
    if (exclusion) return {symbol, frequency, classification: 'project-private', exclusionKind: 'project-specific', reason: exclusion[2], evidence: files.find(file => exclusion[1].test(file)), article: '', heading: ''}
    if (symbol.startsWith('?')) throw new Error(`unreviewed chained API ${symbol} in ${files.join(', ')}`)
    if (symbol === '@JsonSerialize') return {symbol, frequency, classification: 'covered-by-concept', reason: 'The RuoYi import uses Jackson 2 com.fasterxml while the course example uses Jackson 3 tools.jackson; the serialization concept transfers but the class is not identical.', article: 'docs/courses/java/14-后端工程/07-Jackson与Fastjson2-JSON.md', heading: '@JsonSerialize'}
    if (symbol === 'Comparator.comparing') return {symbol, frequency, classification: 'covered-by-concept', reason: 'The sorting lesson demonstrates Comparator.comparingInt; this heading explains the comparing family but does not execute comparing itself.', article: 'docs/courses/java/05-泛型与集合/08-集合排序与不可变集合.md', heading: 'Comparator.comparing'}
    const exact = headings.find(item => item.heading === symbol)
    if (exact) return {symbol, frequency, classification: 'direct-searchable', reason: 'The article has an exact API heading and executable example.', ...exact}
    const owner = symbol.replace(/^@/u, '').split('.')[0]
    const concept = headings.find(item => item.heading === owner || item.heading.startsWith(`${owner}.`) || item.heading.startsWith(`${owner}(`))
    if (concept) return {symbol, frequency, classification: 'covered-by-concept', reason: `The ${owner} lesson explains this API family; ${symbol} is a related member, not a dedicated tutorial.`, ...concept}
    const manualConcepts = [
      [/^(?:Exception|RuntimeException|ParseException)(?:\.|$)/u, '04-现代Java类型/05-异常处理常用写法.md', '按具体到一般的顺序捕获异常', 'Exception handling examples use this error family.'],
      [/^Cell\./u, '14-后端工程/11-Apache-POI-Excel导入导出.md', 'Row.createCell', 'POI cell access is part of the row and cell workflow.'],
      [/^XSSFSheet\./u, '14-后端工程/11-Apache-POI-Excel导入导出.md', 'Sheet.createRow', 'XSSF sheet operations are part of the worksheet workflow.'],
      [/^Font\./u, '14-后端工程/11-Apache-POI-Excel导入导出.md', 'Workbook.createFont', 'POI font configuration is part of the workbook style workflow.'],
      [/^DataFormat\./u, '14-后端工程/11-Apache-POI-Excel导入导出.md', 'Workbook.createDataFormat', 'POI data formats are part of the workbook style workflow.'],
      [/^HttpServletRequest\.getHeader$/u, '14-后端工程/04-Spring-MVC与Servlet边界.md', 'HttpServletResponse.sendError', 'The Servlet request header is read in this error-boundary example.'],
    ]
    const manual = manualConcepts.find(([pattern]) => pattern.test(symbol))
    if (manual) return {symbol, frequency, classification: 'covered-by-concept', reason: manual[3], article: `docs/courses/java/${manual[1]}`, heading: manual[2]}
    throw new Error(`unreviewed external API ${symbol} in ${files.join(', ')}`)
  })
  const path = join(repoRoot, 'tests/data/ruoyi-external-api-coverage.json')
  writeFileSync(path, `${JSON.stringify({records}, null, 2)}\n`)
  console.log(`Wrote ${records.length} records to ${path}`)
  for (const classification of ['direct-searchable', 'covered-by-concept', 'project-private']) console.log(`${classification}: ${records.filter(item => item.classification === classification).length}`)
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  if (process.argv.includes('--scan')) {
    process.stdout.write(`${JSON.stringify(scanSourceTree(), null, 2)}\n`)
  } else if (process.argv.includes('--refresh-snapshot')) {
    const sourceCommit = spawnSync('git', ['-C', SOURCE, 'rev-parse', 'HEAD'], {encoding: 'utf8'})
    if (sourceCommit.status !== 0 || !/^[0-9a-f]{40}$/u.test(sourceCommit.stdout.trim())) throw new Error('source checkout must have a Git commit')
    const snapshot = {sourceCommit: sourceCommit.stdout.trim(), sourceDigest: sourceDigest(SOURCE), records: scanSourceTree()}
    const path = join(ROOT, 'tests/data/ruoyi-java-scan-input.json')
    writeFileSync(path, `${JSON.stringify(snapshot, null, 2)}\n`)
    console.log(`Wrote ${snapshot.records.length} scan records to ${path}`)
  } else if (process.argv.includes('--bootstrap')) {
    bootstrapAttribution()
  } else {
    try {
      const result = auditCoverage()
      for (const issue of result.issues) console.error(issue)
      const pct = (numerator, denominator) => denominator ? (100 * numerator / denominator).toFixed(1) : '0.0'
      console.log(`RuoYi attribution: ${result.ruoyi.attributed}/${result.ruoyi.total} (${pct(result.ruoyi.attributed, result.ruoyi.total)}%)`)
      console.log(`Official-common coverage: ${result.official.total - result.official.uncovered}/${result.official.total} (${pct(result.official.total - result.official.uncovered, result.official.total)}%); uncovered ${result.official.uncovered}`)
      if (result.issues.length) process.exitCode = 1
    } catch (error) { console.error(error.message); process.exitCode = 1 }
  }
}
