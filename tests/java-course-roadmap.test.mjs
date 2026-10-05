import assert from 'node:assert/strict'
import { existsSync } from 'node:fs'
import { test } from 'node:test'

import {
  JAVA_COURSE_CHAPTERS,
  getJavaCourseItems,
} from '../docs/.vitepress/config/java-course.ts'

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

test('Java sidebar preserves the current legacy inventory during migration', () => {
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
    ['MySQL 8', 0, true],
    ['工程实践', 3, true],
    ['设计与项目', 1, true],
    ['后端工程', 14, true],
    ['Redis', 0, true],
  ]

  assert.deepEqual(
    groups.map((group) => [
      stripMarkup(group.text).replace(/ \(\d+篇\)$/u, ''),
      group.items?.length ?? 0,
      group.collapsed,
    ]),
    expected,
  )

  const expectedLegacyLinks = [
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
  const legacyLinks = groups
    .flatMap((group) => group.items ?? [])
    .map((item) => item.link)
    .filter((link) => /\/courses\/java\/(?:11|12|13)-/u.test(link))
  assert.deepEqual(legacyLinks, expectedLegacyLinks)
  assert.equal(new Set(legacyLinks).size, legacyLinks.length, 'legacy fallback routes must be unique')
})

test('Java sidebar only links to existing canonical or transitional legacy files', () => {
  const links = collectLinks(getJavaCourseItems())
  const manifestByRoute = new Map(
    JAVA_COURSE_CHAPTERS.flatMap((chapter) => chapter.articles.map((article) => [article.route, article])),
  )
  const legacyByRoute = new Map(
    JAVA_COURSE_CHAPTERS.flatMap((chapter) =>
      chapter.articles
        .filter((article) => article.legacyRoute)
        .map((article) => [article.legacyRoute, article]),
    ),
  )

  for (const item of links) {
    const canonicalArticle = manifestByRoute.get(item.link)
    if (canonicalArticle) {
      assert.ok(existsSync(canonicalArticle.file), `sidebar link ${item.link} must point to an existing file`)
      continue
    }

    const legacyArticle = legacyByRoute.get(item.link)
    assert.ok(legacyArticle, `sidebar link ${item.link} must come from the manifest fallback metadata`)
    assert.ok(
      legacyArticle.legacyFile && existsSync(legacyArticle.legacyFile),
      `sidebar legacy link ${item.link} must point to an existing file`,
    )
  }
})

test('Java sidebar canonical files win over legacy fallbacks when both paths are available', () => {
  const mysqlArticle = JAVA_COURSE_CHAPTERS
    .find((chapter) => chapter.id === '11-MySQL-8')
    ?.articles[0]
  assert.ok(mysqlArticle?.legacyFile)
  assert.ok(mysqlArticle?.legacyRoute)

  const groups = getJavaCourseItems(JAVA_COURSE_CHAPTERS, {
    fileExists: (file) => file === mysqlArticle.file || file === mysqlArticle.legacyFile || existsSync(file),
  })
  const mysqlGroup = groups.find((group) => stripMarkup(group.text).startsWith('MySQL 8'))
  const backendGroup = groups.find((group) => stripMarkup(group.text).startsWith('后端工程'))

  assert.equal(mysqlGroup?.items?.[0]?.link, mysqlArticle.route)
  assert.ok(
    !(backendGroup?.items ?? []).some((item) => item.link === mysqlArticle.legacyRoute),
    'the legacy route must not be duplicated after its canonical file appears',
  )
})
