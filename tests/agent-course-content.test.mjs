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

test('chapters 02 and 03 expose the rewritten article order and entry points', () => {
  const roadmap = readRoadmap()
  const expected = {
    '02': [
      'docs/courses/agent/02-Agent基础/01-Agent是什么.md',
      'docs/courses/agent/02-Agent基础/02-Agent系统组成.md',
      'docs/courses/agent/02-Agent基础/03-Goal-Instructions与Constraints.md',
      'docs/courses/agent/02-Agent基础/04-Observation-Action与Agent-Loop.md',
      'docs/courses/agent/02-Agent基础/05-Run-Turn-Step与运行状态.md',
      'docs/courses/agent/02-Agent基础/06-停止条件超时与失败边界.md',
      'docs/courses/agent/02-Agent基础/07-同步异步取消与流式执行.md',
      'docs/courses/agent/02-Agent基础/08-Agent-Workflow与普通程序的区别.md',
    ],
    '03': [
      'docs/courses/agent/03-模型与消息/01-Model-Provider与Model-Adapter.md',
      'docs/courses/agent/03-模型与消息/02-Message-Role与消息顺序.md',
      'docs/courses/agent/03-模型与消息/03-Text-Image-Audio与Content-Block.md',
      'docs/courses/agent/03-模型与消息/04-System-Instructions与Prompt边界.md',
      'docs/courses/agent/03-模型与消息/05-Token-上下文窗口与Usage.md',
      'docs/courses/agent/03-模型与消息/06-Temperature-Top-P与生成参数.md',
      'docs/courses/agent/03-模型与消息/07-Structured-Output与Schema校验.md',
      'docs/courses/agent/03-模型与消息/08-Streaming-Delta与模型事件.md',
      'docs/courses/agent/03-模型与消息/09-Rate-Limit-超时-重试与模型降级.md',
    ],
  }

  for (const [chapterId, paths] of Object.entries(expected)) {
    const chapter = roadmap.chapters.find(({ id }) => id === chapterId)
    assert.ok(chapter, `chapter ${chapterId} should exist`)
    assert.deepEqual(chapter.articles.map(({ path }) => path), paths)
    assert.equal(chapter.articles.length, paths.length)
  }

  const homepage = readArticle('docs/courses/agent/index.md')
  assert.match(homepage, /\| 02 \| \[Agent 基础（8 篇）\]\(\/courses\/agent\/02-Agent基础\/01-Agent是什么\)/)
  assert.match(homepage, /\| 03 \| \[模型与消息（9 篇）\]\(\/courses\/agent\/03-模型与消息\/01-Model-Provider与Model-Adapter\)/)
})

test('chapters 05 through 07 expose the integrated article order and entry points', () => {
  const roadmap = readRoadmap()
  const expected = {
    '05': [
      'docs/courses/agent/05-状态上下文会话与记忆/01-State与Context.md',
      'docs/courses/agent/05-状态上下文会话与记忆/02-Session生命周期.md',
      'docs/courses/agent/05-状态上下文会话与记忆/03-Checkpoint中断与恢复.md',
      'docs/courses/agent/05-状态上下文会话与记忆/04-上下文压缩与摘要.md',
      'docs/courses/agent/05-状态上下文会话与记忆/05-短期记忆与长期记忆.md',
      'docs/courses/agent/05-状态上下文会话与记忆/06-记忆污染与隔离.md',
      'docs/courses/agent/05-状态上下文会话与记忆/07-短期记忆与对话历史.md',
      'docs/courses/agent/05-状态上下文会话与记忆/08-长期记忆写入检索与更新.md',
      'docs/courses/agent/05-状态上下文会话与记忆/09-记忆污染并发冲突与数据隔离.md',
    ],
    '06': [
      'docs/courses/agent/06-MCP/01-MCP解决什么问题.md',
      'docs/courses/agent/06-MCP/02-Host-Client与Server.md',
      'docs/courses/agent/06-MCP/03-JSON-RPC请求响应通知与_meta.md',
      'docs/courses/agent/06-MCP/04-无状态模型与版本协商.md',
      'docs/courses/agent/06-MCP/05-server-discover与能力发现.md',
      'docs/courses/agent/06-MCP/06-Tools与JSON-Schema-2020-12.md',
      'docs/courses/agent/06-MCP/07-Resources-URI与订阅.md',
      'docs/courses/agent/06-MCP/08-Prompts与参数补全.md',
      'docs/courses/agent/06-MCP/09-Elicitation与Multi-Round-Trip-Requests.md',
      'docs/courses/agent/06-MCP/10-stdio与Streamable-HTTP.md',
      'docs/courses/agent/06-MCP/11-Cancellation-Progress-Pagination与错误.md',
      'docs/courses/agent/06-MCP/12-Authorization安全边界与Python-SDK-v2实践.md',
    ],
    '07': [
      'docs/courses/agent/07-Skills插件与Hook/01-Skill-Tool-MCP-Plugin与Hook边界.md',
      'docs/courses/agent/07-Skills插件与Hook/02-Skill结构与渐进式上下文.md',
      'docs/courses/agent/07-Skills插件与Hook/03-Skill发现匹配加载与卸载.md',
      'docs/courses/agent/07-Skills插件与Hook/04-Skill指令资源与脚本.md',
      'docs/courses/agent/07-Skills插件与Hook/05-Plugin注册与生命周期.md',
      'docs/courses/agent/07-Skills插件与Hook/06-Dependency-Injection与能力容器.md',
      'docs/courses/agent/07-Skills插件与Hook/07-Hook-Interceptor与事件系统.md',
      'docs/courses/agent/07-Skills插件与Hook/08-能力冲突版本与依赖排序.md',
      'docs/courses/agent/07-Skills插件与Hook/09-权限隔离失败传播与插件安全.md',
    ],
  }

  for (const [chapterId, paths] of Object.entries(expected)) {
    const chapter = roadmap.chapters.find(({ id }) => id === chapterId)
    assert.ok(chapter, `chapter ${chapterId} should exist`)
    assert.deepEqual(chapter.articles.map(({ path }) => path), paths)
    assert.equal(chapter.articles.length, paths.length)
  }

  const homepage = readArticle('docs/courses/agent/index.md')
  assert.match(homepage, /\| 05 \| \[State、Context、Session 与 Memory（9 篇）\]\(\/courses\/agent\/05-状态上下文会话与记忆\/01-State与Context\)/)
  assert.match(homepage, /\| 06 \| \[MCP（12 篇）\]\(\/courses\/agent\/06-MCP\/01-MCP解决什么问题\)/)
  assert.match(homepage, /\| 07 \| \[Skills、Plugin 与 Hook（9 篇）\]\(\/courses\/agent\/07-Skills插件与Hook\/01-Skill-Tool-MCP-Plugin与Hook边界\)/)
})

test('chapter 04 exposes the approved nine-article Tool Calling order', () => {
  const roadmap = readRoadmap()
  const chapter = roadmap.chapters.find(({ id }) => id === '04')
  assert.ok(chapter, 'chapter 04 should exist')
  assert.deepEqual(chapter.articles.map(({ path }) => path), [
    'docs/courses/agent/04-Tool-Calling与Agent-Loop/01-函数调用与JSON-Schema.md',
    'docs/courses/agent/04-Tool-Calling与Agent-Loop/02-工具定义注册与能力发现.md',
    'docs/courses/agent/04-Tool-Calling与Agent-Loop/03-模型如何选择工具和生成参数.md',
    'docs/courses/agent/04-Tool-Calling与Agent-Loop/04-参数校验类型转换与错误反馈.md',
    'docs/courses/agent/04-Tool-Calling与Agent-Loop/05-工具执行Tool-Result与消息回填.md',
    'docs/courses/agent/04-Tool-Calling与Agent-Loop/06-多工具并行调用与依赖调用.md',
    'docs/courses/agent/04-Tool-Calling与Agent-Loop/07-超时重试幂等与去重.md',
    'docs/courses/agent/04-Tool-Calling与Agent-Loop/08-审批权限Sandbox与危险操作.md',
    'docs/courses/agent/04-Tool-Calling与Agent-Loop/09-完整可观测Agent-Loop.md',
  ])
  assert.equal(chapter.articles.length, 9)

  const homepage = readArticle('docs/courses/agent/index.md')
  assert.match(homepage, /\| 04 \| \[Tool Calling 与 Agent Loop（9 篇）\]\(\/courses\/agent\/04-Tool-Calling与Agent-Loop\/01-函数调用与JSON-Schema\)/)
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

test('chapters 05 through 07 keep article-local term order', () => {
  const roadmap = readRoadmap()
  const introduced = new Set(roadmap.chapters
    .filter(({ id }) => ['02', '03', '04'].includes(id))
    .flatMap(({ articles }) => articles.flatMap(({ introducedTerms = [] }) => introducedTerms)))

  for (const chapter of roadmap.chapters.filter(({ id }) => ['05', '06', '07'].includes(id))) {
    for (const article of chapter.articles) {
      for (const term of article.requiresTerms ?? []) {
        assert.ok(introduced.has(term) || (article.introducedTerms ?? []).includes(term),
          `${article.path} requires ${term} before its article-local introduction`)
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
      assert.doesNotMatch(source, /(?:```|~~~)(?:typescript|tsx|javascript|ts|js)\b/i,
        `${article.path} should keep examples in Python`)
    }
  }
})

test('chapters 02 through 07 are complete正文 rather than outline skeletons', () => {
  const roadmap = readRoadmap()
  for (const chapter of roadmap.chapters.filter(({ id }) => ['02', '03', '04', '05', '06', '07'].includes(id))) {
    for (const article of chapter.articles) {
      const source = readArticle(article.path)
      const parsed = matter(source)
      const questionSection = source.split(/^## 课后小问(?:（含解析）)?\s*$/m)[1] ?? ''

      const status = String(parsed.data.status ?? '').toLowerCase()
      assert.notEqual(status, 'outline', `${article.path} must be正文`)
      if (status) assert.equal(status, '正文', `${article.path} must use 正文 metadata when status is declared`)
      assert.doesNotMatch(source, /大纲骨架|status:\s*outline/i, `${article.path} must not advertise outline status`)
      assert.ok((source.match(/^## (?!学习目标|前置知识|易混点|课后小问|本节小结|快速回顾).+/gm) ?? []).length >= 1,
        `${article.path} should explain a concept`)
      assert.ok((source.match(/^###\s+.+/gm) ?? []).length >= 2, `${article.path} should provide H3 structure`)
      assert.match(source, /用途|作用|适合|用于|场景|责任|边界/, `${article.path} should explain usage or responsibility`)
      assert.match(source, /(?:```|~~~)python\b/i, `${article.path} should include a Python example`)
      assert.match(source, /^## 易混点\s*$/m, `${article.path} should include 易混点`)
      assert.match(source, /^## 课后小问(?:（含解析）)?\s*$/m, `${article.path} should include 课后小问`)
      assert.match(questionSection, /解析|答案/, `${article.path} questions should include an explanation`)
      assert.match(source, /^## (?:本节)?小结\s*$/m, `${article.path} should include a summary`)
      assert.match(source, /^## 快速回顾\s*$/m, `${article.path} should include 快速回顾`)
    }
  }
})

test('chapters 02 through 07 keep one readable Mermaid diagram per article', () => {
  const roadmap = readRoadmap()
  for (const chapter of roadmap.chapters.filter(({ id }) => ['02', '03', '04', '05', '06', '07'].includes(id))) {
    for (const article of chapter.articles) {
      const source = readArticle(article.path)
      const diagrams = source.match(/(```|~~~)mermaid\s*\r?\n[\s\S]*?\r?\n\1/g) ?? []

      assert.equal(diagrams.length, 1, `${article.path} should contain exactly one Mermaid diagram`)
      if (!['06'].includes(chapter.id)) {
        assert.match(source, /阅读提示：|这个顺序说明|图中|这张图|数据流|流程图/,
          `${article.path} should explain how to read its diagram`)
      }
      assert.doesNotMatch(diagrams[0], /fill\s*:\s*#[0-9a-f]{3,8}/i,
        `${article.path} should not hard-code a light/dark-dependent fill color`)
    }
  }
})

test('chapter 06 locks the MCP 2026-07-28 protocol baseline', () => {
  const chapter = readRoadmap().chapters.find(({ id }) => id === '06')
  const sources = chapter.articles.map(({ path }) => readArticle(path)).join('\n')
  const stateless = readArticle('docs/courses/agent/06-MCP/04-无状态模型与版本协商.md')
  const metadata = readArticle('docs/courses/agent/06-MCP/03-JSON-RPC请求响应通知与_meta.md')
  const authorization = readArticle('docs/courses/agent/06-MCP/12-Authorization安全边界与Python-SDK-v2实践.md')
  const navigation = readArticle('docs/courses/agent/01-项目与知识库导航/04-MCP工具Skills与集成.md')

  assert.match(sources, /2026-07-28/)
  assert.match(metadata, /每个 Request params 都必须携带 _meta/)
  assert.match(stateless, /没有 initialize\/initialized 握手和协议 Session/)
  assert.match(stateless, /server\/discover/)
  assert.match(stateless, /Tasks 是 2026-07-28 的可选扩展/)
  assert.match(authorization, /Python SDK v2/)
  assert.match(authorization, /Roots、Sampling 和 MCP logging 在规范中 deprecated/)
  assert.match(navigation, /TypeScript SDK v2/)
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

test('renamed chapter 02 and 03 articles leave no stale internal links', () => {
  const staleNames = [
    '01-Agent系统组成', '02-最小Agent-Loop', '03-停止条件与失败边界', '04-同步异步与流式执行',
    '01-Model与推理边界', '02-Message与Role', '03-Token上下文窗口与截断', '04-Structured-Output', '05-Streaming与事件',
  ]
  for (const path of fg.sync('docs/courses/agent/**/*.md')) {
    const source = readArticle(path)
    for (const staleName of staleNames) {
      assert.doesNotMatch(source, new RegExp(staleName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')),
        `${path} should not point to removed article ${staleName}`)
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
