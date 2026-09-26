import assert from 'node:assert/strict'
import { readFileSync, readdirSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { test } from 'node:test'
import fg from 'fast-glob'
import matter from 'gray-matter'

const REPO_ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const JAVA_ROOT = join(REPO_ROOT, 'docs/courses/java')
const JAVA_GLOB = 'docs/courses/java/**/*.md'
const JAVA_INDEX_PATH = 'docs/courses/java/index.md'

const CHAPTER_NAMES = [
  '01-Java基础',
  '02-数组与文本',
  '03-面向对象',
  '04-现代Java类型',
  '05-泛型与集合',
  '06-函数式与时间',
  '07-IO与网络',
  '08-反射与模块',
  '09-并发编程',
  '10-JVM',
  '11-工程实践',
  '12-设计与项目',
]

const QUALITY_CHAPTER_NAMES = CHAPTER_NAMES.slice(0, 6)

const EXPECTED_ARTICLES_BY_CHAPTER = {
  '01-Java基础': [
    '01-开发环境与第一个程序.md',
    '02-基础语法与程序结构.md',
    '03-数据类型与运算符.md',
    '04-控制流与方法.md',
    '05-类型转换与数值精度.md',
    '06-运算符与表达式.md',
    '07-方法参数重载与递归.md',
  ],
  '02-数组与文本': [
    '01-数组与多维数组.md',
    '02-String与文本处理.md',
    '03-常用类与包装类型.md',
  ],
  '03-面向对象': [
    '01-类与对象.md',
    '02-封装继承与多态.md',
    '03-接口与抽象类.md',
    '04-内部类枚举基础.md',
  ],
  '04-现代Java类型': [
    '01-枚举record与sealed.md',
    '02-异常体系与资源管理.md',
  ],
  '05-泛型与集合': [
    '01-泛型与类型安全.md',
    '02-集合框架与数据结构.md',
    '03-Map与集合选择.md',
  ],
  '06-函数式与时间': [
    '01-Lambda与函数式接口.md',
    '02-Stream流式处理.md',
    '03-日期时间API.md',
  ],
  '07-IO与网络': ['01-IO与NIO.md', '02-网络编程.md'],
  '08-反射与模块': ['01-反射与注解.md', '02-模块化系统.md'],
  '09-并发编程': [
    '01-线程基础与执行器.md',
    '02-并发工具与线程安全.md',
    '03-JMM与并发内存模型.md',
    '04-虚拟线程.md',
  ],
  '10-JVM': ['01-JVM内存与类加载.md', '02-垃圾回收与调优.md'],
  '11-工程实践': ['01-Maven与测试工程.md', '02-JDBC与事务.md'],
  '12-设计与项目': ['01-设计原则模式与综合复习.md'],
}

const EXPECTED_JAVA_PATHS = [
  JAVA_INDEX_PATH,
  ...CHAPTER_NAMES.flatMap((chapter) =>
    EXPECTED_ARTICLES_BY_CHAPTER[chapter].map(
      (article) => `docs/courses/java/${chapter}/${article}`,
    ),
  ),
].sort()

const ARTICLE_PATHS = EXPECTED_JAVA_PATHS.filter((file) => file !== JAVA_INDEX_PATH)
// Task scope: only chapters 01-06 are being completed in this batch. Chapters
// 07-12 remain available for later batches and are covered here only by the
// global path/frontmatter/navigation guards.
const QUALITY_ARTICLE_PATHS = ARTICLE_PATHS.filter((file) =>
  QUALITY_CHAPTER_NAMES.some((chapter) => file.startsWith(`docs/courses/java/${chapter}/`)),
)

const REQUIRED_FRONTMATTER_FIELDS = ['title', 'description', 'category', 'tags']
const REQUIRED_SECTIONS = [
  '学习目标',
  '核心知识点',
  '简单案例',
  '易混点',
  '课后小问',
  '本节小结',
  '快速回顾',
]
const REQUIRED_CORE_SUBSECTIONS = ['专业术语', '白话解释与边界']
const EXPECTED_JDK20_PREVIEW_ARTICLES = [
  'docs/courses/java/04-现代Java类型/01-枚举record与sealed.md',
]

const QUICK_REFERENCE_SECTIONS = {
  'docs/courses/java/02-数组与文本/01-数组与多维数组.md': ['常用 API 速查'],
  'docs/courses/java/02-数组与文本/02-String与文本处理.md': [
    'String API 速查',
    '项目常用：Hutool JSONUtil',
  ],
  'docs/courses/java/05-泛型与集合/02-集合框架与数据结构.md': ['常用 API 速查'],
  'docs/courses/java/05-泛型与集合/03-Map与集合选择.md': ['常用 API 速查'],
}

// Keep version policy data-driven: add a rule here when a newer JDK API is
// discovered, and use the explicit allow pattern only for explanatory prose
// that compares a later JDK rather than using that API in a Java example.
const POST_JDK20_API_RULES = [
  {
    name: 'Sequenced Collections (JDK 21)',
    pattern: /\b(?:SequencedCollection|SequencedSet|SequencedMap)\b/gu,
    allow: /(?:JDK|Java)\s*21|JDK\s*20\s*(?:之后|以后)|更高版本|仅(?:作|供)对比/iu,
  },
  {
    name: 'String templates (JDK 21 preview)',
    pattern: /\bStringTemplate\b|\bSTR\./gu,
    allow: /(?:JDK|Java)\s*21|JDK\s*20\s*(?:之后|以后)|更高版本|仅(?:作|供)对比/iu,
  },
  {
    name: 'Scoped values (JDK 21 preview)',
    pattern: /\bScopedValue\b/gu,
    allow: /(?:JDK|Java)\s*21|JDK\s*20\s*(?:之后|以后)|更高版本|仅(?:作|供)对比/iu,
  },
]

function normalizePath(file) {
  return file.replaceAll('\\', '/')
}

function readMarkdown(relativePath) {
  const absolutePath = join(REPO_ROOT, ...relativePath.split('/'))
  const source = readFileSync(absolutePath, 'utf8')
  const parsed = matter(source)
  return {
    relativePath,
    source,
    data: parsed.data,
    body: parsed.content,
  }
}

function isMeaningfulField(value) {
  if (typeof value === 'string') return value.trim() !== ''
  if (Array.isArray(value)) return value.length > 0
  return value !== undefined && value !== null
}

function headingMatches(line, label) {
  const escapedLabel = label.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  return new RegExp(`^##\\s+${escapedLabel}(?:\\s|[:：，,（(]|$)`).test(line)
}

function getSection(body, label) {
  const lines = body.split(/\r?\n/)
  const start = lines.findIndex((line) => headingMatches(line, label))
  if (start < 0) return null

  const end = lines.findIndex((line, index) => index > start && /^##\s+/.test(line))
  return lines.slice(start + 1, end < 0 ? lines.length : end).join('\n').trim()
}

function subsectionMatches(line, label) {
  const escapedLabel = label.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  return new RegExp(`^###\\s+${escapedLabel}(?:\\s|[:：，,（(]|$)`).test(line)
}

function getSubsection(section, label) {
  if (section === null) return null
  const lines = section.split(/\r?\n/)
  const start = lines.findIndex((line) => subsectionMatches(line, label))
  if (start < 0) return null

  const end = lines.findIndex((line, index) => index > start && /^###\s+/.test(line))
  return lines.slice(start + 1, end < 0 ? lines.length : end).join('\n').trim()
}

function getQuickReferenceSubsections(body, sectionLabel) {
  const section = getSection(body, sectionLabel)
  if (section === null) return []
  const lines = section.split(/\r?\n/)
  const starts = []

  lines.forEach((line, index) => {
    if (/^###\s+\S/.test(line)) starts.push(index)
  })

  return starts.map((start, index) => ({
    heading: lines[start].replace(/^###\s+/, '').trim(),
    content: lines.slice(start + 1, starts[index + 1] ?? lines.length).join('\n'),
  }))
}

function removeFencedCode(text) {
  const lines = text.split(/\r?\n/)
  const visibleLines = []
  let inFence = false

  for (const line of lines) {
    if (/^\s*```/.test(line)) {
      inFence = !inFence
      continue
    }
    if (!inFence) visibleLines.push(line)
  }
  return visibleLines.join('\n')
}

function stripMarkdown(text) {
  return removeFencedCode(text)
    .replace(/`([^`]+)`/g, '$1')
    .replace(/[*_>#]/g, '')
    .replace(/^\s*[-*+]\s+/gm, '')
    .replace(/\s+/g, '')
    .trim()
}

function hasConcreteExplanation(text, minimumLength = 20) {
  const plainText = stripMarkdown(text)
  return (
    plainText.length >= minimumLength &&
    /(?:因为|因此|区别|差异|而不是|适合|不适合|不能|不应|应当|优先|边界|否则|避免|相比|用于|表示|返回|异常|如果)/u.test(
      plainText,
    )
  )
}

function hasProfessionalTerm(text) {
  return (
    stripMarkdown(text).length >= 4 &&
    /`[^`]+`|\b[A-Za-z][A-Za-z0-9_.]*(?:\([^)]*\))?\b/u.test(text)
  )
}

function getTopLevelListItems(text) {
  return removeFencedCode(text)
    .split(/\r?\n/)
    .filter((line) => /^[-*+]\s+\S/.test(line))
    .map((line) => line.replace(/^[-*+]\s+/, '').trim())
}

function getJavaBlocks(text) {
  return [...text.matchAll(/```java[^\r\n]*\r?\n([\s\S]*?)```/gi)].map((match) => match[1])
}

function stripJavaComments(code) {
  return code
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/^\s*\/\/.*$/gm, '')
    .replace(/^\s*\*.*$/gm, '')
    .trim()
}

function inspectJavaCase(section) {
  const blocks = getJavaBlocks(section ?? '')
  if (blocks.length === 0) return ['needs a java code block']

  const executableBlocks = blocks.map(stripJavaComments).filter((code) => code !== '')
  if (executableBlocks.length === 0) return ['java code block contains comments only']

  const hasTypeDeclaration = executableBlocks.some((code) =>
    /\b(?:class|record|interface|enum)\s+[A-Za-z_$][\w$]*/.test(code),
  )
  const hasObservableResult = executableBlocks.some((code) =>
    /\bSystem\.out\.(?:print|println|printf)\s*\(/.test(code),
  )
  const issues = []
  if (!hasTypeDeclaration) issues.push('case needs a type declaration')
  if (!hasObservableResult) issues.push('case needs an observable System.out result')
  return issues
}

function matchesPattern(pattern, text) {
  pattern.lastIndex = 0
  return pattern.test(text)
}

function inspectPostJdk20Apis(body) {
  const lines = body.split(/\r?\n/)
  const violations = []
  let inFence = false

  lines.forEach((line, index) => {
    if (/^\s*```/.test(line)) {
      inFence = !inFence
      return
    }
    for (const rule of POST_JDK20_API_RULES) {
      if (!matchesPattern(rule.pattern, line)) continue
      const context = lines
        .slice(Math.max(0, index - 1), Math.min(lines.length, index + 2))
        .join(' ')
      if (inFence || !rule.allow.test(context)) {
        violations.push(`${rule.name} at line ${index + 1}`)
      }
    }
  })
  return violations
}

function getQuestionChunks(section) {
  if (section === null) return []
  const lines = section.split(/\r?\n/)
  const starts = []
  let inFence = false

  lines.forEach((line, index) => {
    if (/^\s*```/.test(line)) {
      inFence = !inFence
      return
    }
    // Questions are top-level ordered-list items. Indented numbered examples
    // are deliberately not questions.
    if (!inFence && /^\d+\.\s+\S/.test(line)) starts.push(index)
  })

  return starts.map((start, index) =>
    lines.slice(start, starts[index + 1] ?? lines.length).join('\n').trim(),
  )
}

function inspectQuestionBlock(chunk) {
  const lines = chunk.split(/\r?\n/)
  const firstLine = lines.findIndex((line) => line.trim() !== '')
  if (firstLine < 0) return ['question is empty']

  const answerLine = lines.findIndex(
    (line, index) => index > firstLine && /^\s*[-*+]?\s*答案\s*[:：]\s*\S/.test(line),
  )
  const explanationLine = lines.findIndex(
    (line, index) => index > (answerLine < 0 ? firstLine : answerLine) && /^\s*[-*+]?\s*解析\s*[:：]\s*\S/.test(line),
  )
  const issues = []
  const firstContentAfterQuestion = lines.findIndex(
    (line, index) => index > firstLine && line.trim() !== '',
  )
  if (
    answerLine < 0 ||
    firstContentAfterQuestion < 0 ||
    answerLine !== firstContentAfterQuestion
  ) {
    issues.push('answer must immediately follow its question')
  }
  if (explanationLine < 0 || explanationLine <= answerLine) {
    issues.push('explanation must follow the answer in the same question block')
  } else {
    const firstContentAfterAnswer = lines.findIndex(
      (line, index) => index > answerLine && line.trim() !== '',
    )
    if (explanationLine !== firstContentAfterAnswer) {
      issues.push('explanation must immediately follow its answer')
    }
  }
  return issues
}

function relativeRoute(relativePath) {
  return `/${relativePath.replace(/^docs\//, '').replace(/\.md$/, '')}`
}

function formatViolations(violations) {
  return violations.length === 0 ? '' : `\n${violations.join('\n')}`
}

test('Java course keeps 36 Markdown files, 35 articles, 12 chapters, and the baseline paths', () => {
  const markdownPaths = fg
    .sync(JAVA_GLOB, { cwd: REPO_ROOT, onlyFiles: true })
    .map(normalizePath)
    .sort()
  const chapterDirectories = readdirSync(JAVA_ROOT, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .sort()

  assert.equal(markdownPaths.length, 36, 'rule java-markdown-count: expected 36 Markdown files')
  assert.equal(
    markdownPaths.filter((file) => file !== JAVA_INDEX_PATH).length,
    35,
    'rule java-article-count: expected 35 course articles',
  )
  assert.equal(chapterDirectories.length, 12, 'rule java-chapter-count: expected 12 chapter directories')
  assert.deepEqual(
    chapterDirectories,
    [...CHAPTER_NAMES].sort(),
    'rule java-chapter-paths: chapter directory set changed',
  )
  assert.deepEqual(
    markdownPaths,
    EXPECTED_JAVA_PATHS,
    'rule java-path-baseline: Java Markdown path set changed',
  )
})

test('Java articles keep the required frontmatter fields', () => {
  const violations = []

  for (const relativePath of ARTICLE_PATHS) {
    try {
      const { data } = readMarkdown(relativePath)
      for (const field of REQUIRED_FRONTMATTER_FIELDS) {
        if (!isMeaningfulField(data[field])) {
          violations.push(`${relativePath} [frontmatter.${field}] is missing or empty`)
        }
      }
    } catch (error) {
      violations.push(`${relativePath} [frontmatter-parse] ${error.message}`)
    }
  }

  assert.deepEqual(violations, [], `rule java-frontmatter${formatViolations(violations)}`)
})

test('01-06 Java articles use the shared quality structure and runnable examples', () => {
  const violations = []

  for (const relativePath of QUALITY_ARTICLE_PATHS) {
    let article
    try {
      article = readMarkdown(relativePath)
    } catch (error) {
      violations.push(`${relativePath} [article-read] ${error.message}`)
      continue
    }

    for (const section of REQUIRED_SECTIONS) {
      const content = getSection(article.body, section)
      if (content === null) {
        violations.push(`${relativePath} [section:${section}] heading is missing`)
      } else if (content === '') {
        violations.push(`${relativePath} [section:${section}] body is empty`)
      } else if (
        ['本节小结', '快速回顾'].includes(section) &&
        !/^\s*[-*+]\s+\S/m.test(content)
      ) {
        violations.push(`${relativePath} [section:${section}] needs a plain Markdown list`)
      } else if (section === '易混点' && !hasConcreteExplanation(content, 12)) {
        violations.push(`${relativePath} [section:易混点] needs a concrete comparison or boundary explanation`)
      } else if (['本节小结', '快速回顾'].includes(section)) {
        const items = getTopLevelListItems(content)
        const minimum = section === '本节小结' ? 3 : 3
        const maximum = section === '本节小结' ? 5 : 6
        if (items.length < minimum || items.length > maximum) {
          violations.push(
            `${relativePath} [section:${section}] needs ${minimum}-${maximum} top-level list items, found ${items.length}`,
          )
        }
        if (items.some((item) => stripMarkdown(item).length < 8)) {
          violations.push(`${relativePath} [section:${section}] contains a vague list item`)
        }
      }
    }

    const coreKnowledge = getSection(article.body, '核心知识点')
    for (const subsection of REQUIRED_CORE_SUBSECTIONS) {
      const content = getSubsection(coreKnowledge, subsection)
      if (content === null) {
        violations.push(`${relativePath} [core:${subsection}] subsection is missing`)
      } else if (content === '') {
        violations.push(`${relativePath} [core:${subsection}] body is empty`)
      } else if (subsection === '专业术语' && !hasProfessionalTerm(content)) {
        violations.push(`${relativePath} [core:专业术语] needs a Java API or English term`)
      } else if (subsection === '白话解释与边界' && !hasConcreteExplanation(content)) {
        violations.push(`${relativePath} [core:白话解释与边界] needs a concrete plain-language explanation`)
      }
    }

    for (const issue of inspectJavaCase(getSection(article.body, '简单案例'))) {
      violations.push(`${relativePath} [java-example] ${issue}`)
    }
  }

  assert.deepEqual(violations, [], `rule java-article-structure${formatViolations(violations)}`)
})

test('01-06 Java articles provide two answered review questions and no deprecated task markers', () => {
  const violations = []
  const forbiddenPatterns = [
    { rule: 'checkbox', pattern: /^\s*[-*+]\s*\[[ xX]\](?:\s|$)/m },
    { rule: 'checkbox-unicode', pattern: /[☐☑]/u },
    { rule: '实践任务', pattern: /实践任务/u },
    { rule: '练习题', pattern: /练习题/u },
    { rule: '面试常问', pattern: /面试常问/u },
    { rule: 'deprecated-review-heading', pattern: /^##\s+复习清单(?:\s|$)/mu },
    { rule: 'placeholder', pattern: /\b(?:TODO|FIXME|TBD)\b|待补(?:充)?|占位|未完成|后续补充|自行查阅|^\s*略\s*$/imu },
  ]

  for (const relativePath of QUALITY_ARTICLE_PATHS) {
    let article
    try {
      article = readMarkdown(relativePath)
    } catch (error) {
      violations.push(`${relativePath} [article-read] ${error.message}`)
      continue
    }
    const questions = getQuestionChunks(getSection(article.body, '课后小问'))
    if (questions.length < 2) {
      violations.push(`${relativePath} [review-question-count] expected at least 2 questions, found ${questions.length}`)
    }
    questions.forEach((question, index) => {
      for (const issue of inspectQuestionBlock(question)) {
        violations.push(`${relativePath} [review-question-${index + 1}] ${issue}`)
      }
    })

    for (const { rule, pattern } of forbiddenPatterns) {
      if (pattern.test(article.body)) {
        violations.push(`${relativePath} [forbidden:${rule}] deprecated or placeholder content found`)
      }
    }
  }

  const index = readMarkdown(JAVA_INDEX_PATH)
  if (/实践任务/u.test(index.body)) {
    violations.push(`${JAVA_INDEX_PATH} [forbidden:实践任务] entry page still advertises deprecated practice tasks`)
  }

  assert.deepEqual(violations, [], `rule java-review-and-forbidden-content${formatViolations(violations)}`)
})

test('Java index stage links resolve to the existing article path set', () => {
  const index = readMarkdown(JAVA_INDEX_PATH)
  const articleRoutes = new Set(ARTICLE_PATHS.map(relativeRoute))
  const stageLinks = [...index.body.matchAll(/\]\((\/courses\/java\/[^)#\s]+)(?:#[^)]*)?\)/g)].map(
    (match) => match[1],
  )
  const brokenLinks = stageLinks.filter((link) => !articleRoutes.has(link))

  assert.ok(stageLinks.length > 0, 'rule java-index-stage-links: no Java stage links found')
  assert.deepEqual(
    brokenLinks,
    [],
    `rule java-index-stage-links: broken links${formatViolations(brokenLinks)}`,
  )
})

test('JDK 20 preview and incubator articles document status and paired commands', () => {
  const violations = []
  const scopedBodies = new Map()

  for (const relativePath of QUALITY_ARTICLE_PATHS) {
    try {
      scopedBodies.set(relativePath, readMarkdown(relativePath).body)
    } catch (error) {
      violations.push(`${relativePath} [article-read] ${error.message}`)
    }
  }

  const previewArticles = new Set(EXPECTED_JDK20_PREVIEW_ARTICLES)
  for (const [relativePath, body] of scopedBodies) {
    if (/--enable-preview/iu.test(body)) {
      previewArticles.add(relativePath)
    }
  }

  for (const relativePath of previewArticles) {
    const body = scopedBodies.get(relativePath)
    if (body === undefined) {
      violations.push(`${relativePath} [article-read] article is outside the scoped path set`)
      continue
    }
    if (!/预览特性|preview/iu.test(body) || !/JDK\s*20/iu.test(body)) {
      violations.push(`${relativePath} [preview-status] must identify the JDK 20 preview status`)
    }
    const compileCommand = body.split(/\r?\n/).some(
      (line) => /\bjavac\b/.test(line) && /--release\s+20/.test(line) && /--enable-preview/.test(line),
    )
    if (!compileCommand) {
      violations.push(`${relativePath} [preview-compile-command] needs javac --release 20 --enable-preview`)
    }
    const runCommand = body.split(/\r?\n/).some(
      (line) => /\bjava\b/.test(line) && !/\bjavac\b/.test(line) && /--enable-preview/.test(line),
    )
    if (!runCommand) {
      violations.push(`${relativePath} [preview-run-command] needs java --enable-preview`)
    }
  }

  // The current 01-06 scope has no planned incubator article. Keep this guard
  // data-driven so a scoped article cannot introduce incubator APIs without the
  // required JDK 20 status and paired --add-modules commands.
  for (const [relativePath, body] of scopedBodies) {
    if (!/jdk\.incubator\.|孵化 API|孵化模块|结构化并发/iu.test(body)) continue

    if (!/孵化\s*(?:API|模块)|incubator\s*(?:API|module)|非稳定\s*API/iu.test(body)) {
      violations.push(`${relativePath} [incubator-status] must explicitly identify a non-stable incubator API`)
    }
    const needsPreviewFlag = /预览特性|preview|--enable-preview/iu.test(body)
    const compileCommand = body.split(/\r?\n/).some(
      (line) =>
        /\bjavac\b/.test(line) &&
        /--release\s+20/.test(line) &&
        /--add-modules\s+jdk\.incubator\.concurrent/.test(line) &&
        (!needsPreviewFlag || /--enable-preview/.test(line)),
    )
    if (!compileCommand) {
      violations.push(
        `${relativePath} [incubator-compile-command] needs javac --release 20 --add-modules jdk.incubator.concurrent`,
      )
    }
    const runCommand = body.split(/\r?\n/).some(
      (line) =>
        /\bjava\b/.test(line) &&
        !/\bjavac\b/.test(line) &&
        /--add-modules\s+jdk\.incubator\.concurrent/.test(line) &&
        (!needsPreviewFlag || /--enable-preview/.test(line)),
    )
    if (!runCommand) {
      violations.push(`${relativePath} [incubator-run-command] needs java --add-modules jdk.incubator.concurrent`)
    }
  }

  assert.deepEqual(violations, [], `rule jdk20-preview-contract${formatViolations(violations)}`)
})

test('01-06 Java examples reject JDK 20+ APIs unless an allowed comparison is explicit', () => {
  const violations = []

  for (const relativePath of QUALITY_ARTICLE_PATHS) {
    let body
    try {
      body = readMarkdown(relativePath).body
    } catch (error) {
      violations.push(`${relativePath} [article-read] ${error.message}`)
      continue
    }
    for (const issue of inspectPostJdk20Apis(body)) {
      violations.push(`${relativePath} [jdk20-api] ${issue}`)
    }
  }

  assert.deepEqual(violations, [], `rule jdk20-api-compatibility${formatViolations(violations)}`)
})

test('Java quick-reference API headings put a Java example immediately below the heading', () => {
  const violations = []

  for (const [relativePath, sectionLabels] of Object.entries(QUICK_REFERENCE_SECTIONS)) {
    let article
    try {
      article = readMarkdown(relativePath)
    } catch (error) {
      violations.push(`${relativePath} [article-read] ${error.message}`)
      continue
    }

    for (const sectionLabel of sectionLabels) {
      const subsections = getQuickReferenceSubsections(article.body, sectionLabel)
      if (subsections.length === 0) {
        violations.push(`${relativePath} [quick-reference:${sectionLabel}] needs API subsections`)
        continue
      }
      for (const { heading, content } of subsections) {
        if (/^常见边界(?:\s|：|:|$)/u.test(heading)) continue
        const firstContentLine = content
          .split(/\r?\n/)
          .find((line) => line.trim() !== '')
          ?.trim()
        if (firstContentLine !== '```java') {
          violations.push(
            `${relativePath} [quick-reference:${sectionLabel}/${heading}] first content must be a java fenced code block`,
          )
        }
      }
    }
  }

  assert.deepEqual(violations, [], `rule java-quick-reference-examples${formatViolations(violations)}`)
})
