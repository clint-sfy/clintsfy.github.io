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

test('Java sidebar never links to a planned article before its file exists', () => {
  const links = collectLinks(getJavaCourseItems())
  const manifestByRoute = new Map(
    JAVA_COURSE_CHAPTERS.flatMap((chapter) => chapter.articles.map((article) => [article.route, article])),
  )

  for (const item of links) {
    const article = manifestByRoute.get(item.link)
    assert.ok(article, `sidebar link ${item.link} must come from the manifest`)
    assert.ok(existsSync(article.file), `sidebar link ${item.link} must point to an existing file`)
  }
})
