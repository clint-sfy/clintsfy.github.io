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
const REQUIRED_SECTIONS = ['易混点', '课后小问', '本节小结', '快速回顾']

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

function hasMeaningfulJavaCode(body) {
  const blocks = body.matchAll(/```java[^\r\n]*\r?\n([\s\S]*?)```/gi)
  for (const [, code] of blocks) {
    const withoutComments = code
      .replace(/\/\*[\s\S]*?\*\//g, '')
      .replace(/^\s*\/\/.*$/gm, '')
      .replace(/^\s*\*.*$/gm, '')
      .trim()
    if (withoutComments !== '') return true
  }
  return false
}

function getQuestionChunks(section) {
  if (section === null) return []
  const starts = [...section.matchAll(/^\s*\d+\.\s+\S.*$/gm)].map((match) => match.index)
  return starts.map((start, index) => section.slice(start, starts[index + 1] ?? section.length).trim())
}

function hasLabeledAnswer(chunk, label) {
  return new RegExp(`${label}\\s*[:：]\\s*[^\\r\\n]+`).test(chunk)
}

function relativeRoute(relativePath) {
  return `/${relativePath.replace(/^docs\//, '').replace(/\.md$/, '')}`
}

function formatViolations(violations) {
  return violations.length === 0 ? '' : `\n${violations.join('\n')}`
}

test('Java course keeps 33 Markdown files, 32 articles, 12 chapters, and the baseline paths', () => {
  const markdownPaths = fg
    .sync(JAVA_GLOB, { cwd: REPO_ROOT, onlyFiles: true })
    .map(normalizePath)
    .sort()
  const chapterDirectories = readdirSync(JAVA_ROOT, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .sort()

  assert.equal(markdownPaths.length, 33, 'rule java-markdown-count: expected 33 Markdown files')
  assert.equal(
    markdownPaths.filter((file) => file !== JAVA_INDEX_PATH).length,
    32,
    'rule java-article-count: expected 32 course articles',
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
      }
    }

    if (!hasMeaningfulJavaCode(article.body)) {
      violations.push(`${relativePath} [java-example] needs a non-empty Java code block`)
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
      if (!hasLabeledAnswer(question, '答案')) {
        violations.push(`${relativePath} [review-question-${index + 1}-answer] concise answer is missing`)
      }
      if (!hasLabeledAnswer(question, '解析')) {
        violations.push(`${relativePath} [review-question-${index + 1}-explanation] explanation is missing`)
      }
    })

    for (const { rule, pattern } of forbiddenPatterns) {
      if (pattern.test(article.body)) {
        violations.push(`${relativePath} [forbidden:${rule}] deprecated or placeholder content found`)
      }
    }
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
  const previewArticles = [
    'docs/courses/java/04-现代Java类型/01-枚举record与sealed.md',
  ]
  const violations = []

  for (const relativePath of previewArticles) {
    let body
    try {
      body = readMarkdown(relativePath).body
    } catch (error) {
      violations.push(`${relativePath} [article-read] ${error.message}`)
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
  for (const relativePath of QUALITY_ARTICLE_PATHS) {
    let body
    try {
      body = readMarkdown(relativePath).body
    } catch {
      continue
    }
    if (!/jdk\.incubator\.|孵化 API|孵化模块|结构化并发/iu.test(body)) continue

    if (!/孵化 API|孵化模块|incubator/iu.test(body)) {
      violations.push(`${relativePath} [incubator-status] must identify the incubator API status`)
    }
    const compileCommand = body.split(/\r?\n/).some(
      (line) => /\bjavac\b/.test(line) && /--add-modules\s+jdk\.incubator\.concurrent/.test(line),
    )
    if (!compileCommand) {
      violations.push(`${relativePath} [incubator-compile-command] needs javac --add-modules jdk.incubator.concurrent`)
    }
    const runCommand = body.split(/\r?\n/).some(
      (line) => /\bjava\b/.test(line) && !/\bjavac\b/.test(line) && /--add-modules\s+jdk\.incubator\.concurrent/.test(line),
    )
    if (!runCommand) {
      violations.push(`${relativePath} [incubator-run-command] needs java --add-modules jdk.incubator.concurrent`)
    }
  }

  assert.deepEqual(violations, [], `rule jdk20-preview-contract${formatViolations(violations)}`)
})
