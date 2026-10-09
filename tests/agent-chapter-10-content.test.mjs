import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import matter from 'gray-matter'

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const chapterRoot = 'docs/courses/agent/10-评测可观测性与安全'
const expectedFiles = [
  '01-Trace-Span与事件日志.md',
  '02-Dataset与回归评测.md',
  '03-确定性断言与LLM-as-Judge.md',
  '04-Guardrail输入输出与工具校验.md',
  '05-Prompt-Injection与数据泄露.md',
  '06-Sandbox最小权限与审计.md',
  '07-生产故障模式与排查顺序.md',
]

function readArticle(file) {
  return readFileSync(join(repoRoot, chapterRoot, file), 'utf8')
}

test('chapter 10 exposes the approved seven-article order', () => {
  for (const [index, file] of expectedFiles.entries()) {
    const source = readArticle(file)
    const parsed = matter(source)
    assert.equal(parsed.data.chapter, 10, file + ' should belong to chapter 10')
    assert.equal(parsed.data.status, '正文', file + ' should be正文')
    const title = source.match(/^title: (.+)$/m)?.[1]
    assert.match(source, new RegExp('^# ' + title + '$', 'm'))
    assert.match(source, /模型|工具|数据|安全|观测|评测/u)
    assert.equal(source.includes('01-' + file), false)
    assert.match(source, /date: 2026\/10\/09/)
    assert.ok(index >= 0)
  }
})

test('chapter 10 articles keep the readable content contract', () => {
  for (const file of expectedFiles) {
    const source = readArticle(file)
    const questionSection = source.split(/^## 课后小问（含解析）\s*$/m)[1] ?? ''
    assert.ok((source.match(/^###\s+.+/gm) ?? []).length >= 4, file + ' needs searchable H3 headings')
    assert.match(source, /^## 学习目标\s*$/m)
    assert.match(source, /^## 前置知识\s*$/m)
    assert.match(source, /^## 易混点\s*$/m)
    assert.match(source, /^## 课后小问（含解析）\s*$/m)
    assert.match(questionSection, /答案|解析/u)
    assert.match(source, /^## 本节小结\s*$/m)
    assert.match(source, /^## 快速回顾\s*$/m)
    assert.match(source, /用途：/u)
    assert.match(source, /~~~python\s*[\s\S]+?~~~/u)
    assert.equal((source.match(/~~~mermaid/g) ?? []).length, 1)
    assert.doesNotMatch(source, /~~~(?:javascript|typescript|tsx|js|ts)\b/iu)
    assert.doesNotMatch(source, /大纲骨架|status:\s*outline/iu)
  }
})

test('chapter 10 keeps the safety and evaluation boundaries explicit', () => {
  const sources = expectedFiles.map(readArticle).join('\n')
  for (const term of [
    'Trace', 'Span', 'Event', 'Dataset', 'Fixture', 'LLM-as-Judge',
    'InputGuardrail', 'OutputGuardrail', 'ToolValidation', 'Prompt Injection',
    'Sandbox', '最小权限', '审计', '回归', '数据泄露', '人工',
  ]) {
    assert.match(sources, new RegExp(term), 'missing ' + term)
  }
  assert.match(sources, /不能保证|不能单独保证|不等于/u)
  assert.match(sources, /fail closed|失败关闭/u)
  assert.match(sources, /数据泄漏|数据泄露/u)
  assert.match(sources, /回归门禁|发布门禁/u)
})

test('chapter 10 examples lock the reviewed safety contracts', () => {
  const trace = readArticle('01-Trace-Span与事件日志.md')
  assert.match(trace, /current\.attributes\.update\(redact\(attributes\)\)/u)
  assert.match(trace, /api_key="secret-key", cookie="session-value"/u)
  assert.match(trace, /message": "redacted"/u)
  assert.doesNotMatch(trace, /message":\s*str\(exc\)/u)

  const dataset = readArticle('02-Dataset与回归评测.md')
  for (const field of ['required_tools', 'tool_sequence', 'max_tool_calls']) {
    assert.match(dataset, new RegExp(field), 'GoldenTask should validate ' + field)
  }
  assert.match(dataset, /required_tools_ok/u)
  assert.match(dataset, /sequence_ok/u)
  assert.match(dataset, /call_count_ok/u)

  const assertions = readArticle('03-确定性断言与LLM-as-Judge.md')
  const nonDictGuard = assertions.indexOf('if not isinstance(result, dict):')
  const resultGet = assertions.indexOf('result.get("answer")')
  assert.ok(nonDictGuard >= 0 && nonDictGuard < resultGet, 'non-dict result must fail before result.get')
  assert.match(assertions, /内容清晰，分点说明/u)
  assert.match(assertions, /"score": 2/u)

  for (const file of [
    '04-Guardrail输入输出与工具校验.md',
    '06-Sandbox最小权限与审计.md',
  ]) {
    const source = readArticle(file)
    assert.match(source, /Path\("\/workspace"\)\.resolve\(\)/u)
    assert.match(source, /candidate\.relative_to\(/u)
    assert.match(source, /workspace\/\.\.\/(?:secrets|secret)\.txt/u)
    assert.match(source, /符号链接/u)
  }
})
