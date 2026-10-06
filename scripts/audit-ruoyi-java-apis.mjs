import { existsSync, readFileSync, readdirSync, writeFileSync } from 'node:fs'
import { dirname, join, relative, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const SOURCE = process.env.RUOYI_SOURCE_ROOT || resolve(ROOT, '../../../JAVA/learn_ruoyi/RuoYi-Vue')
const GENERATED = /(?:^|\/)(?:ruoyi-generator|target|generated-sources|generated)(?:\/|$)/u
const PRIVATE = /^com\.ruoyi\./u
const IMPORT = /\bimport\s+(static\s+)?([\w.]+)(?:\.\*)?\s*;/gu
const SIMPLE_JDK = new Set(['String', 'Object', 'Integer', 'Long', 'Boolean', 'Math', 'System', 'Exception', 'RuntimeException', 'Class', 'Thread', 'StringBuilder'])

function executableJava(source) {
  // Retain offsets while removing comments, strings, and character literals.
  return source.replace(/\/\*[\s\S]*?\*\/|\/\/[^\r\n]*|"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'/gu, match => match.replace(/[^\r\n]/gu, ' '))
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
  const bindings = new Map()
  for (const [type, qualified] of [...imports, ...privateImports]) {
    const escaped = type.replace(/[.*+?^${}()|[\]\\]/gu, '\\$&')
    const declaration = new RegExp(`\\b${escaped}(?:\\s*<[^;=(){}]*>)?(?:\\s*\\[\\])?\\s+([a-zA-Z_$][\\w$]*)\\b`, 'gu')
    for (const match of code.matchAll(declaration)) {
      const name = match[1]
      if (!bindings.has(name)) bindings.set(name, [])
      bindings.get(name).push({index: match.index, type, external: !PRIVATE.test(qualified)})
    }
  }
  for (const matches of bindings.values()) matches.sort((a, b) => a.index - b.index)
  const receiverType = (name, index) => {
    const binding = bindings.get(name)?.filter(item => item.index <= index).at(-1)
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
  for (const match of code.matchAll(/\b([A-Za-z_$][\w$]*)\.([A-Za-z_$][\w$]*)\s*\([^()]*\)\s*\.\s*([A-Za-z_$][\w$]*)\s*\(/gu)) {
    const receiver = receiverType(match[1], match.index)
    if (receiver) add(`?${receiver}.${match[2]}().${match[3]}`)
  }
  for (const match of code.matchAll(/(?<![.\w$])([A-Za-z_$][\w$]*)\s*\(/gu)) {
    const owner = staticImports.get(match[1])
    if (owner) add(`${owner}.${match[1]}`)
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
    for (const {symbol, frequency} of scanJavaSource(readFileSync(path, 'utf8'), relative(root, path))) {
      counts.set(symbol, (counts.get(symbol) ?? 0) + frequency)
    }
  }
  return [...counts].sort(([a], [b]) => a.localeCompare(b, 'en')).map(([symbol, frequency]) => ({symbol, frequency}))
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
      const match = line.match(/^###\s+(\S.*)$/u)
      if (match) starts.push({index, heading: match[1].trim()})
    }
  })
  return starts.map((entry, index) => ({
    heading: entry.heading,
    label: entry.heading.split(/[：:]/u, 1)[0].replaceAll('`', '').trim(),
    content: lines.slice(entry.index + 1, starts[index + 1]?.index ?? lines.length).join('\n').trim(),
  }))
}

function hasExample(content) {
  return [...content.matchAll(/```(?:java|sql|xml|redis|shell|bash)\s*\r?\n([\s\S]*?)```/gu)]
    .some(match => match[1].split(/\r?\n/u).some(line => line.trim() && !/^\s*(?:\/\/|#|--|\*)/u.test(line)))
}

function exampleUsesSymbol(content, symbol) {
  const examples = [...content.matchAll(/```(?:java|sql|xml|redis|shell|bash)\s*\r?\n([\s\S]*?)```/gu)]
    .map(match => executableJava(match[1])).join('\n')
  const name = symbol.split('.').at(-1)
  if (symbol.startsWith('@')) return new RegExp(`@(?:[\\w$]+\\.)*${name.slice(1)}\\b`, 'u').test(examples)
  if (symbol.includes('.')) return new RegExp(`\\b${name}\\s*\\(`, 'u').test(examples)
  return new RegExp(`\\b${name}\\b`, 'u').test(examples)
}

const required = (value, name, issues) => {
  if (typeof value !== 'string' || !value.trim()) issues.push(`${name} is required`)
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
  const scan = new Map(scanned.map(record => [record.symbol, record.frequency]))
  const seen = new Set()
  for (const record of ruoyi) {
    const key = record.symbol
    required(key, 'RuoYi symbol', issues)
    if (seen.has(key)) issues.push(`duplicate RuoYi symbol ${key}`)
    seen.add(key)
    if (!Number.isSafeInteger(record.frequency) || record.frequency < 1) issues.push(`${key}: invalid frequency`)
    if (scan.get(key) !== record.frequency) issues.push(`${key}: stale scan result (${record.frequency} vs ${scan.get(key)})`)
    if (!['direct-searchable', 'covered-by-concept', 'project-private'].includes(record.classification)) issues.push(`${key}: invalid classification`)
    required(record.reason, `${key}: reason`, issues)
    if (record.classification === 'project-private') {
      if (record.article || record.heading) issues.push(`${key}: private exclusion must not claim article coverage`)
      if (!/private|project|unresolved|generated|internal/i.test(record.reason ?? '')) issues.push(`${key}: private exclusion reason is not explicit`)
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
    if (record.article && record.heading) heading(record.article, record.heading, `official ${key}`, record.capability)
  }
  if (Object.keys(authorities).some(ecosystem => !official.some(record => record.ecosystem === ecosystem))) issues.push('official denominator must cover all five selected ecosystems')
  return issues
}

export function auditCoverage({repoRoot = ROOT, sourceRoot = SOURCE, officialOverride} = {}) {
  const scanned = scanSourceTree(sourceRoot)
  const ruoyi = JSON.parse(readFileSync(join(repoRoot, 'tests/data/ruoyi-external-api-coverage.json'), 'utf8'))
  const official = officialOverride ?? JSON.parse(readFileSync(join(repoRoot, 'tests/data/official-common-api-coverage.json'), 'utf8'))
  const issues = validateCoverage({ruoyi, official}, {repoRoot, scanned})
  const attributed = ruoyi.records.filter(record => scanned.some(item => item.symbol === record.symbol && item.frequency === record.frequency)).length
  const uncovered = official.records.filter(record => issues.some(issue => issue.startsWith(`official ${record.ecosystem}:${record.capability}:`))).length
  return {issues, ruoyi: {total: scanned.length, attributed}, official: {total: official.records.length, uncovered}}
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
  const records = scanSourceTree().map(({symbol, frequency}) => {
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
    ]
    const chain = chainConcepts.map(([pattern, path, label, reason]) => ({match: symbol.match(pattern), path, label, reason})).find(item => item.match)
    if (chain) return {symbol, frequency, classification: 'covered-by-concept', reason: chain.reason, article: `docs/courses/java/${chain.path}`, heading: chain.label(chain.match)}
    if (symbol.startsWith('?')) return {symbol, frequency, classification: 'project-private', reason: `Unresolved chained receiver after an external call (${symbol}); excluded from asserted instructional coverage pending type resolution.`, article: '', heading: ''}
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
    return {symbol, frequency, classification: 'project-private', reason: `Project-specific integration use of ${symbol}; no course article claims this operation.`, article: '', heading: ''}
  })
  const path = join(repoRoot, 'tests/data/ruoyi-external-api-coverage.json')
  writeFileSync(path, `${JSON.stringify({records}, null, 2)}\n`)
  console.log(`Wrote ${records.length} records to ${path}`)
  for (const classification of ['direct-searchable', 'covered-by-concept', 'project-private']) console.log(`${classification}: ${records.filter(item => item.classification === classification).length}`)
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  if (process.argv.includes('--scan')) {
    process.stdout.write(`${JSON.stringify(scanSourceTree(), null, 2)}\n`)
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
