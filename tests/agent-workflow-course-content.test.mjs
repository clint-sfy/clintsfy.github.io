import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync, readdirSync } from 'node:fs'
import { join, resolve } from 'node:path'
import matter from 'gray-matter'

const repoRoot = resolve(import.meta.dirname, '..')
const chapterRoot = join(repoRoot, 'docs/courses/agent/09-工作流规划与多Agent')

const expectedFiles = [
  '01-Workflow与状态机.md',
  '02-Planning与Plan-and-Execute.md',
  '03-Router与Handoff.md',
  '04-Supervisor与Multi-Agent.md',
  '05-Interrupt审批与恢复.md',
  '06-并发竞态与失败传播.md',
]

test('chapter 09 keeps the approved six-article order', () => {
  assert.deepEqual(readdirSync(chapterRoot).filter((name) => name.endsWith('.md')).sort(), expectedFiles)
})

test('chapter 09 articles are complete正文 with executable-shaped examples', () => {
  for (const name of expectedFiles) {
    const source = readFileSync(join(chapterRoot, name), 'utf8')
    const metadata = matter(source).data
    assert.equal(String(metadata.chapter), '09', `${name} should belong to chapter 09`)
    assert.equal(metadata.status, '正文', `${name} should be marked 正文`)
    assert.doesNotMatch(source, /大纲骨架|status:\s*outline/i, `${name} must not remain an outline`)
    assert.match(source, /^## 学习目标\s*$/m)
    assert.match(source, /^## 前置知识\s*$/m)
    assert.match(source, /^## 易混点\s*$/m)
    assert.match(source, /^## 课后小问（含解析）\s*$/m)
    assert.match(source, /^## 本节小结\s*$/m)
    assert.match(source, /^## 快速回顾\s*$/m)
    assert.ok((source.match(/^###\s+.+/gm) ?? []).length >= 4, `${name} should provide searchable H3 headings`)
    assert.equal((source.match(/```mermaid\s*\n[\s\S]*?\n```/g) ?? []).length, 1, `${name} should contain one Mermaid diagram`)
    assert.match(source, /```python\s*\n[\s\S]*?\n```/, `${name} should use a Python-first example`)
    assert.match(source, /用途|作用|适合|用于|责任|边界/, `${name} should explain usage or responsibility`)
  }
})

test('chapter 09 keeps failure semantics visible', () => {
  const sources = expectedFiles.map((name) => readFileSync(join(chapterRoot, name), 'utf8')).join('\n')
  for (const term of ['幂等', 'Checkpoint', '取消', '失败', '恢复', '预算']) {
    assert.match(sources, new RegExp(term), `chapter 09 should explain ${term}`)
  }
})
