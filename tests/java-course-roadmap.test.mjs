import assert from 'node:assert/strict'
import { existsSync, mkdtempSync, readFileSync, readdirSync, rmSync } from 'node:fs'
import { join } from 'node:path'
import { tmpdir } from 'node:os'
import { test } from 'node:test'

import {
  JAVA_COURSE_CHAPTERS,
  getJavaCourseItems,
} from '../docs/.vitepress/config/java-course.ts'
import {
  generateRedirects,
  renderRedirectHtml,
  validateRedirects,
} from '../scripts/generate-java-redirects.mjs'

const EXPECTED_CHAPTER_IDS = [
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
  '11-MySQL-8',
  '12-工程实践',
  '13-设计与项目',
  '14-后端工程',
  '15-Redis',
]

test('Redis inventory activates fifteen articles plus index and a valid legacy target', () => {
  const chapter = JAVA_COURSE_CHAPTERS.find(entry => entry.id === '15-Redis')
  const files = ['01-基础连接与数据模型.md', '02-String与计数器.md', '03-Hash与对象字段.md', '04-List-Set与Sorted-Set.md', '05-Bitmap-HyperLogLog-GEO与Stream.md', '06-Key过期扫描与删除.md', '07-事务Watch-Pipeline与Lua.md', '08-持久化内存淘汰与数据安全.md', '09-缓存穿透击穿雪崩与一致性.md', '10-发布订阅与Stream消费组.md', '11-分布式锁租约与Fencing-Token.md', '12-Spring-Cache与缓存抽象.md', '13-RedisTemplate序列化与连接管理.md']
  assert.ok(existsSync('docs/courses/java/15-Redis/index.md'), 'missing Redis index')
  files.push('14-主从哨兵与Cluster.md', '15-性能诊断监控与生产清单.md')
  assert.equal(readdirSync('docs/courses/java/15-Redis').filter(file => file.endsWith('.md')).length, 16)
  for (const file of files) assert.ok(existsSync(`docs/courses/java/15-Redis/${file}`), `missing ${file}`)
  assert.deepEqual(getJavaCourseItems([chapter])[0].items.map(item => item.link), files.map(file => `/courses/java/15-Redis/${file.slice(0, -3)}`))
  const legacy = REDIRECTS.find(entry => entry.source.includes('14-Redis'))
  assert.equal(legacy.target, '/courses/java/15-Redis/01-基础连接与数据模型')
})

test('MySQL foundation inventory exposes the index and four canonical articles', () => {
  const chapter = JAVA_COURSE_CHAPTERS.find((entry) => entry.id === '11-MySQL-8')
  const names = ['01-环境连接与数据库对象', '02-表设计与DDL', '03-数据类型字符集与时区', '04-数据写入更新与删除']
  const titles = ['环境连接与数据库对象', '表设计与 DDL', '数据类型、字符集与时区', '数据写入、更新与删除']
  assert.ok(existsSync(join('docs/courses/java/11-MySQL-8/index.md')), 'MySQL index is missing')
  for (const name of names) {
    assert.ok(existsSync(join(`docs/courses/java/11-MySQL-8/${name}.md`)), `${name} is missing`)
    assert.ok(chapter.articles.some((article) => article.file === `docs/courses/java/11-MySQL-8/${name}.md` && article.title === titles[names.indexOf(name)]))
  }
})

const EXPECTED_CHAPTER_LABELS = [
  'Java基础',
  '数组与文本',
  '面向对象',
  '现代Java类型',
  '泛型与集合',
  '函数式与时间',
  'IO与网络',
  '反射与模块',
  '并发编程',
  'JVM',
  'MySQL 8',
  '工程实践',
  '设计与项目',
  '后端工程',
  'Redis',
]

function stripMarkup(value) {
  return value.replace(/<[^>]+>/g, '')
}

function collectLinks(items, result = []) {
  for (const item of items ?? []) {
    if (item.link) result.push(item)
    collectLinks(item.items, result)
  }
  return result
}

function findArticle(chapterId, fileName) {
  const chapter = JAVA_COURSE_CHAPTERS.find((item) => item.id === chapterId)
  assert.ok(chapter, `chapter ${chapterId} must exist in the canonical manifest`)
  const article = chapter.articles.find((item) => item.file.endsWith(`/${fileName}`))
  assert.ok(article, `${chapterId}/${fileName} must exist in the canonical manifest`)
  return article
}

function listExistingLegacyRoutes() {
  return [
    '/courses/java/11-工程实践/01-Maven与测试工程',
    '/courses/java/11-工程实践/02-JDBC与事务',
    '/courses/java/11-工程实践/04-Velocity代码生成',
    '/courses/java/12-设计与项目/01-设计原则模式与综合复习',
    ...Array.from({ length: 14 }, (_, index) =>
      `/courses/java/13-后端工程/${String(index + 1).padStart(2, '0')}-${[
        'Spring-Boot启动与配置',
        'Spring-IoC与Bean生命周期',
        'Spring-AOP与声明式事务',
        'Spring-MVC与Servlet边界',
        'Spring-Security与JWT',
        'MyBatis核心与MyBatis-Plus重点',
        'Jackson与Fastjson2-JSON',
        'Bean-Validation参数校验',
        'SLF4J与Logback日志',
        '文件上传下载与资源安全',
        'Apache-POI-Excel导入导出',
        'Quartz定时任务',
        'MySQL-8.0',
        'Redis',
      ][index]}`,
    ),
  ]
}

function expectedRedirectTarget(source) {
  if (source.endsWith('/13-MySQL-8.0')) {
    return findArticle('11-MySQL-8', '01-环境连接与数据库对象.md').route
  }
  if (source.endsWith('/14-Redis')) {
    return findArticle('15-Redis', '01-基础连接与数据模型.md').route
  }

  const match = source.match(/^\/courses\/java\/(11-工程实践|12-设计与项目|13-后端工程)\/(.+)$/u)
  assert.ok(match, `legacy route ${source} must belong to an old Java chapter`)
  const targetChapter = {
    '11-工程实践': '12-工程实践',
    '12-设计与项目': '13-设计与项目',
    '13-后端工程': '14-后端工程',
  }[match[1]]
  return findArticle(targetChapter, `${match[2]}.md`).route
}

const REDIRECTS = JSON.parse(
  readFileSync('docs/.vitepress/data/java-redirects.json', 'utf8'),
)
const CANONICAL_ROUTES = new Set(
  JAVA_COURSE_CHAPTERS.flatMap((chapter) => chapter.articles.map((article) => article.route)),
)

test('Java roadmap manifest keeps the exact 01-15 chapter order', () => {
  assert.deepEqual(
    JAVA_COURSE_CHAPTERS.map((chapter) => chapter.id),
    EXPECTED_CHAPTER_IDS,
  )
  assert.equal(
    new Set(JAVA_COURSE_CHAPTERS.map((chapter) => chapter.id)).size,
    EXPECTED_CHAPTER_IDS.length,
    'chapter IDs must be unique',
  )

  const articles = JAVA_COURSE_CHAPTERS.flatMap((chapter) => chapter.articles)
  assert.ok(articles.length > 0, 'the manifest should contain article descriptors')
  assert.equal(
    new Set(articles.map((article) => article.route)).size,
    articles.length,
    'article routes must be unique',
  )
  for (const article of articles) {
    assert.match(article.route, /^\/courses\/java\//u)
    assert.match(article.file, /^docs\/courses\/java\//u)
    assert.ok(article.title, `article ${article.file} should have a title`)
  }
})

test('Java sidebar follows canonical order even when a copied manifest is shuffled', () => {
  const shuffled = [...JAVA_COURSE_CHAPTERS].reverse()
  const groups = getJavaCourseItems(shuffled)

  assert.deepEqual(
    groups.map((group) => stripMarkup(group.text).replace(/ \(\d+篇\)$/u, '')),
    EXPECTED_CHAPTER_LABELS,
  )
  assert.deepEqual(
    groups.flatMap((group) => (group.items ?? []).map((item) => item.link)),
    getJavaCourseItems().flatMap((group) => (group.items ?? []).map((item) => item.link)),
  )
})

test('Java sidebar uses the migrated canonical inventory', () => {
  const groups = getJavaCourseItems()
  const expected = [
    ['Java基础', 7, false],
    ['数组与文本', 6, false],
    ['面向对象', 7, false],
    ['现代Java类型', 6, true],
    ['泛型与集合', 8, true],
    ['函数式与时间', 8, true],
    ['IO与网络', 7, true],
    ['反射与模块', 7, true],
    ['并发编程', 15, true],
    ['JVM', 5, true],
    ['MySQL 8', 12, true],
    ['工程实践', 5, true],
    ['设计与项目', 1, true],
    ['后端工程', 19, true],
    ['Redis', 15, true],
  ]

  assert.deepEqual(
    groups.map((group) => [
      stripMarkup(group.text).replace(/ \(\d+篇\)$/u, ''),
      group.items?.length ?? 0,
      group.collapsed,
    ]),
    expected,
  )

  const legacyLinks = groups
    .flatMap((group) => group.items ?? [])
    .map((item) => item.link)
    .filter((link) => /\/courses\/java\/(?:11-工程实践|12-设计与项目|13-后端工程)\//u.test(link))
  assert.deepEqual(legacyLinks, [], 'the sidebar must not publish old chapter routes')
})

test('Java chapter migration keeps only canonical 12-14 files and updates Markdown links', () => {
  const oldDirectories = ['11-工程实践', '12-设计与项目', '13-后端工程']
  for (const chapter of oldDirectories) {
    const directory = join('docs', 'courses', 'java', chapter)
    assert.equal(existsSync(directory), false, `legacy chapter directory ${chapter} must be absent`)
  }

  for (const chapter of ['12-工程实践', '13-设计与项目', '14-后端工程']) {
    const manifestFiles = JAVA_COURSE_CHAPTERS
      .find((entry) => entry.id === chapter)
      ?.articles.map((entry) => entry.file)
      .filter((file) => existsSync(file))
      .sort()
    assert.ok(manifestFiles?.length, `${chapter} must have canonical manifest entries`)
    const diskFiles = readdirSync(join('docs', 'courses', 'java', chapter), { withFileTypes: true })
      .filter((entry) => entry.isFile() && entry.name.endsWith('.md'))
      .map((entry) => `docs/courses/java/${chapter}/${entry.name}`)
      .sort()
    assert.deepEqual(diskFiles, manifestFiles, `${chapter} files must match the canonical manifest`)
  }

  const markdownFiles = readdirSync('docs/courses/java', { recursive: true, withFileTypes: true })
  const courseMarkdownPaths = markdownFiles
    .filter((entry) => entry.isFile() && entry.name.endsWith('.md'))
  for (const entry of courseMarkdownPaths) {
    const markdown = readFileSync(join(entry.parentPath, entry.name), 'utf8')
    assert.doesNotMatch(
      markdown,
      /\]\(\/courses\/java\/(?:11-工程实践|12-设计与项目|13-后端工程)\//u,
      `${entry.name} must not link to a legacy chapter route`,
    )
  }
})

test('Java sidebar only links to existing canonical manifest files', () => {
  const links = collectLinks(getJavaCourseItems())
  const manifestByRoute = new Map(
    JAVA_COURSE_CHAPTERS.flatMap((chapter) => chapter.articles.map((article) => [article.route, article])),
  )
  for (const item of links) {
    const canonicalArticle = manifestByRoute.get(item.link)
    assert.ok(canonicalArticle, `sidebar link ${item.link} must be canonical`)
    assert.ok(existsSync(canonicalArticle.file), `sidebar link ${item.link} must point to an existing file`)
  }
})

test('Java permanent redirects map every existing legacy route exactly once', () => {
  const legacyRoutes = listExistingLegacyRoutes()
  assert.equal(REDIRECTS.length, legacyRoutes.length, 'redirect count must derive from legacy content')
  assert.equal(new Set(REDIRECTS.map((entry) => entry.source)).size, REDIRECTS.length)
  assert.deepEqual(
    new Set(REDIRECTS.map((entry) => entry.source)),
    new Set(legacyRoutes),
  )

  validateRedirects(REDIRECTS, CANONICAL_ROUTES)
  for (const entry of REDIRECTS) {
    assert.equal(entry.target, expectedRedirectTarget(entry.source))
    assert.ok(CANONICAL_ROUTES.has(entry.target), `redirect target ${entry.target} must be canonical`)
  }
})

test('Java redirect validation rejects duplicate, missing, colliding, and unsafe routes', () => {
  const fixtures = JSON.parse(
    readFileSync('tests/fixtures/java-course/invalid-redirects.json', 'utf8'),
  )

  for (const [name, entries] of Object.entries(fixtures)) {
    assert.throws(
      () => validateRedirects(entries, CANONICAL_ROUTES),
      undefined,
      `${name} fixture must be rejected`,
    )
  }
})

test('Java redirect HTML repeats one encoded destination in every navigation mechanism', () => {
  const target = findArticle('11-MySQL-8', '01-环境连接与数据库对象.md').route
  const encodedTarget = encodeURI(target)
  const escapedTarget = encodedTarget
    .replaceAll('&', '&amp;')
    .replaceAll('"', '&quot;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll("'", '&#39;')
  const html = renderRedirectHtml(target)

  assert.match(html, new RegExp(`<link rel="canonical" href="${escapedTarget}"`))
  assert.match(html, new RegExp(`content="0; url=${escapedTarget}"`))
  assert.match(html, new RegExp(`location\\.replace\\(${JSON.stringify(encodedTarget)}\\)`))
  assert.match(html, new RegExp(`<a href="${escapedTarget}"`))

  const escapedTargetHtml = renderRedirectHtml('/courses/java/引号"&<script>')
  assert.doesNotMatch(escapedTargetHtml, /引号"&<script>/u)
  assert.doesNotMatch(escapedTargetHtml, /<\/script>.*引号/u)
})

test('Java redirect generator emits one flat HTML file for every legacy route', async () => {
  const temporaryPublicDirectory = mkdtempSync(join(tmpdir(), 'java-redirects-'))
  try {
    const result = await generateRedirects({ publicDirectory: temporaryPublicDirectory })
    assert.equal(result.count, REDIRECTS.length)
    assert.ok(
      existsSync(join(
        temporaryPublicDirectory,
        'courses',
        'java',
        '11-工程实践',
        '01-Maven与测试工程.html',
      )),
      'Chinese legacy route should become a flat .html file',
    )
    assert.ok(
      existsSync(join(
        temporaryPublicDirectory,
        'courses',
        'java',
        '13-后端工程',
        '13-MySQL-8.0.html',
      )),
    )
    assert.equal(
      existsSync(join(
        temporaryPublicDirectory,
        'courses',
        'java',
        '13-后端工程',
        '13-MySQL-8.0',
        'index.html',
      )),
      false,
      'redirect output must not use a directory-index variant',
    )

    const generatedFiles = []
    const collectFiles = (directory) => {
      for (const entry of readdirSync(directory, { withFileTypes: true })) {
        const entryPath = join(directory, entry.name)
        if (entry.isDirectory()) collectFiles(entryPath)
        else generatedFiles.push(entryPath)
      }
    }
    collectFiles(temporaryPublicDirectory)
    assert.equal(generatedFiles.length, REDIRECTS.length)
    assert.ok(generatedFiles.every((filePath) => filePath.endsWith('.html')))
  } finally {
    rmSync(temporaryPublicDirectory, { recursive: true, force: true })
  }
})
