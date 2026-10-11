import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { test } from 'node:test'

const REPO_ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const CLASS_ARTICLE = readFileSync(
  join(REPO_ROOT, 'docs/courses/c_plus/01-C++的基础/02-c++类和对象.md'),
  'utf8',
).replace(/\r\n/g, '\n')

test('C++基础示例保留真实输出并使用独立注释', () => {
  assert.match(
    CLASS_ARTICLE,
    /```cpp\n\/\/ 输出： 101 lucylucy 89\.8\n\/\/ 101 lucylucy 89\.8\n```/u,
  )
  assert.match(
    CLASS_ARTICLE,
    /```cpp\n\/\/ 输出： Son的fun01 char\n\/\/ Base 无参的fun01\n\/\/ Base 的fun01 int\n\/\/ Base 的fun01 int int\n```/u,
  )
  assert.match(CLASS_ARTICLE, /```cpp\n\/\/ 输出： 10\n\/\/ 20\n```/u)
  assert.doesNotMatch(CLASS_ARTICLE, /\/\/ 输出： 30\n\/\/ 10\n\/\/ 20/u)
})
