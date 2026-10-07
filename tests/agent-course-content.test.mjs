import test from 'node:test'
import assert from 'node:assert/strict'
import { existsSync, readdirSync, readFileSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import fg from 'fast-glob'
import matter from 'gray-matter'

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const courseRoot = join(repoRoot, 'docs/courses/agent')
const roadmapPath = join(repoRoot, 'tests/data/agent-course-roadmap.json')

function readRoadmap() {
  return JSON.parse(readFileSync(roadmapPath, 'utf8'))
}

function readArticle(path) {
  return readFileSync(join(repoRoot, path), 'utf8')
}

test('agent roadmap follows the approved 01-11 order', () => {
  const roadmap = readRoadmap()
  const chapterIds = roadmap.chapters.map(({ id }) => id)
  assert.deepEqual(chapterIds, Array.from({ length: 11 }, (_, index) => String(index + 1).padStart(2, '0')))

  for (const chapter of roadmap.chapters) {
    assert.match(chapter.directory, new RegExp(`^docs/courses/agent/${chapter.id}-`))
    assert.ok(chapter.goal, `${chapter.id} should declare a learning goal`)
    assert.ok(Array.isArray(chapter.prerequisites), `${chapter.id} should declare prerequisites`)
    assert.ok(Array.isArray(chapter.articles) && chapter.articles.length > 0, `${chapter.id} should expose articles`)
    assert.ok(existsSync(join(repoRoot, chapter.directory)), `${chapter.directory} should exist`)
    for (const article of chapter.articles) {
      assert.ok(existsSync(join(repoRoot, article.path)), `${article.path} should exist`)
      assert.equal(article.path.startsWith(`${chapter.directory}/`), true)
    }
  }

  const homepage = readArticle('docs/courses/agent/index.md')
  const routePosition = roadmap.chapters.map(({ id }) => homepage.indexOf(`| ${id} |`))
  assert.ok(routePosition.every((position) => position >= 0), 'homepage should list every chapter number')
  assert.deepEqual([...routePosition].sort((a, b) => a - b), routePosition, 'homepage chapter order should match roadmap')
})

test('every required term is introduced before use', () => {
  const roadmap = readRoadmap()
  const introduced = new Set()
  for (const chapter of roadmap.chapters) {
    for (const article of chapter.articles) {
      for (const term of article.requiresTerms ?? []) {
        assert.ok(introduced.has(term) || (article.introducedTerms ?? []).includes(term),
          `${article.path} requires ${term} before it is introduced`)
      }
      for (const term of article.introducedTerms ?? []) introduced.add(term)
    }
  }
})

test('course examples obey the Python-first policy', () => {
  const roadmap = readRoadmap()
  for (const chapter of roadmap.chapters.filter(({ id }) => Number(id) >= 2 && Number(id) <= 10)) {
    for (const article of chapter.articles) {
      const source = readArticle(article.path)
      assert.doesNotMatch(source, /```(?:typescript|tsx|javascript|ts|js)\b/i,
        `${article.path} should keep examples in Python`)
    }
  }
})

test('every resource record has required learning metadata', () => {
  const roadmap = readRoadmap()
  const required = [
    'name', 'url', 'problem', 'recommendedLearning', 'prerequisites', 'stage',
    'readingDepth', 'recommendedReading', 'deepSeekHarnessMapping', 'checkedAt',
  ]
  const resources = roadmap.chapters.find(({ id }) => id === '01')?.resources ?? []
  assert.ok(resources.length >= 20, 'chapter 01 should provide a substantial resource catalog')
  for (const resource of resources) {
    for (const field of required) {
      assert.ok(resource[field], `${resource.name ?? 'resource'} should include ${field}`)
    }
    assert.match(resource.url, /^https:\/\//, `${resource.name} should use an HTTPS official URL`)
    assert.equal(resource.checkedAt, '2026-10-07', `${resource.name} should expose the review date`)
    assert.ok(['入门', '进阶', '生产工程'].includes(resource.stage), `${resource.name} has an invalid stage`)
    assert.ok(['主线精读', '专题查阅', '案例参考'].includes(resource.readingDepth), `${resource.name} has an invalid reading depth`)
    assert.ok(Array.isArray(resource.recommendedReading) && resource.recommendedReading.length > 0)
  }
})

test('five core projects appear consistently', () => {
  const roadmap = readRoadmap()
  const coreProjects = roadmap.coreProjects
  assert.deepEqual(coreProjects.map(({ name }) => name), [
    'smolagents',
    'OpenAI Agents SDK',
    'MCP TypeScript SDK',
    'LangGraph',
    'DeepSeek Harness',
  ])
  const homepage = readArticle('docs/courses/agent/index.md')
  const navigation = readArticle('docs/courses/agent/01-项目与知识库导航/01-学习地图与资源使用方法.md')
  const sourceGuide = readArticle('docs/courses/agent/11-源码精读/06-五个项目架构对照.md')
  for (const project of coreProjects) {
    assert.match(homepage, new RegExp(project.name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')))
    assert.match(navigation, new RegExp(project.name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')))
    assert.match(sourceGuide, new RegExp(project.name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')))
    assert.match(project.url, /^https:\/\//)
    assert.ok(existsSync(join(repoRoot, project.sourceGuidePath)), `${project.name} source guide should exist`)
  }
  assert.equal(coreProjects.at(-1).name, 'DeepSeek Harness')
})

test('agent article paths and internal links resolve', () => {
  const roadmap = readRoadmap()
  const knownRoutes = new Set(roadmap.chapters.flatMap(({ articles }) => articles.map(({ path }) => `/courses/agent/${path.replace(/^docs\/courses\/agent\//, '').replace(/\.md$/, '')}`)))
  for (const chapter of roadmap.chapters) {
    for (const article of chapter.articles) {
      const source = readArticle(article.path)
      for (const link of source.matchAll(/\]\((\/courses\/agent\/[^)#]+)(?:#[^)]+)?\)/g)) {
        const route = link[1].replace(/\/$/, '')
        assert.ok(knownRoutes.has(route), `${article.path} points to missing route ${route}`)
      }
    }
  }
})

test('agent sidebar uses the canonical 01-11 chapter order', async () => {
  const { sidebar } = await import('../docs/.vitepress/config/sidebar.ts')
  const groups = sidebar['/courses/agent/']
  assert.ok(Array.isArray(groups))
  assert.deepEqual(groups.map((group) => group.text.replace(/<[^>]+>/g, '').replace(/^\d+/, '').replace(/\s*\(\d+篇\)$/, '')), [
    '项目与知识库导航', 'Agent 基础', '模型与消息', 'Tool Calling 与 Agent Loop',
    'State、Context、Session 与 Memory', 'MCP', 'Skills、Plugin 与 Hook',
    'RAG 与 Context Engineering', 'Workflow、Planning 与 Multi-Agent',
    'Evals、Tracing、Guardrails 与安全', '源码精读',
  ])
})
