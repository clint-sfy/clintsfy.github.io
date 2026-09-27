import assert from 'node:assert/strict'
import { readFileSync, existsSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { spawnSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'
import { test } from 'node:test'
import fg from 'fast-glob'
import matter from 'gray-matter'

const REPO_ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const PYTHON_ROOT = 'docs/courses/python'
const PYTHON_INDEX_PATH = `${PYTHON_ROOT}/index.md`
const PYTHON_BASIC_ROOT = `${PYTHON_ROOT}/01-python基础篇`
const PYTHON_ADVANCED_ROOT = `${PYTHON_ROOT}/02-python进阶篇`
const PYTORCH_ROOT = 'docs/courses/tangyudi/03-深度学习篇'

const PYTHON_BASIC_ARTICLES = [
  '01-python基础.md',
  '02-变量与数据类型.md',
  '03-字符串.md',
  '04-列表与元组.md',
  '05-字典与集合.md',
  '06-条件与循环.md',
  '07-函数.md',
  '08-模块与包.md',
  '09-异常处理.md',
  '10-文件与路径.md',
  '11-面向对象.md',
  '12-迭代器与生成器.md',
  '13-装饰器.md',
  '14-类型提示.md',
  '15-标准库速查.md',
  '16-虚拟环境与包管理.md',
  '17-测试与调试.md',
]

const PYTHON_ADVANCED_ARTICLES = [
  '01-numpy.md',
  '02-pandas.md',
  '03-matplotlib.md',
  '04-seaborn.md',
]

const PYTORCH_QUALITY_ARTICLES = [
  '01-Pytorch.md',
  '05-Tensor基础.md',
  '06-Autograd自动求导.md',
  '07-Dataset与DataLoader.md',
  '08-nn.Module与模型构建.md',
  '09-训练循环与评估.md',
  '10-保存加载与推理.md',
  '11-GPU与迁移学习.md',
]

const PYTORCH_OTHER_ARTICLES = ['02-MMLAB实战.md', '03-OpenCV.md', '04-YOLO.md']

const ARTICLE_PATHS = [
  ...PYTHON_BASIC_ARTICLES.map((file) => `${PYTHON_BASIC_ROOT}/${file}`),
  ...PYTHON_ADVANCED_ARTICLES.map((file) => `${PYTHON_ADVANCED_ROOT}/${file}`),
  ...PYTORCH_QUALITY_ARTICLES.map((file) => `${PYTORCH_ROOT}/${file}`),
]
const TARGET_MARKDOWN_PATHS = [PYTHON_INDEX_PATH, ...ARTICLE_PATHS]

const REQUIRED_FRONTMATTER_FIELDS = ['title', 'author', 'date', 'categories', 'tags']
const REQUIRED_SECTIONS = [
  '学习目标',
  '核心知识点',
  '常用用法',
  '不常用但需要知道',
  '易混点',
  '课后小问',
  '本节小结',
  '快速回顾',
]

const FORBIDDEN_API_RULES = [
  { name: 'np.object', pattern: /\bnp\.object\b/gu },
  { name: 'np.int/np.float/np.bool', pattern: /\bnp\.(?:int|float|bool)\b/gu },
  { name: 'DataFrame.append', pattern: /\b(?:DataFrame|df)\.append\s*\(/gu },
  { name: 'sns.distplot', pattern: /\bsns\.distplot\s*\(/gu },
  { name: 'sns.factorplot', pattern: /\bsns\.factorplot\s*\(/gu },
  { name: 'iter(...).next', pattern: /\biter\s*\([^\n)]*\)\s*\.\s*next\s*\(/gu },
  { name: 'loss.data', pattern: /\bloss\.data\b/gu },
  { name: 'torchvision pretrained=True', pattern: /\bpretrained\s*=\s*True\b/gu },
]

function normalizePath(file) {
  return file.replaceAll('\\', '/')
}

function absolutePath(relativePath) {
  return join(REPO_ROOT, ...relativePath.split('/'))
}

function readMarkdown(relativePath) {
  const source = readFileSync(absolutePath(relativePath), 'utf8')
  const parsed = matter(source)
  return { relativePath, source, data: parsed.data, body: parsed.content }
}

function isMeaningfulField(value) {
  if (typeof value === 'string') return value.trim() !== ''
  if (Array.isArray(value)) return value.length > 0
  return value !== undefined && value !== null
}

function headingMatches(line, label, level = 2) {
  const escapedLabel = label.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  return new RegExp(`^#{${level}}\\s+${escapedLabel}(?:\\s|[:：，,（(]|$)`, 'u').test(line)
}

function getSection(body, label) {
  const lines = body.split(/\r?\n/)
  const start = lines.findIndex((line) => headingMatches(line, label))
  if (start < 0) return null

  const end = lines.findIndex((line, index) => index > start && /^##\s+/.test(line))
  return lines.slice(start + 1, end < 0 ? lines.length : end).join('\n').trim()
}

function scanFences(text) {
  const lines = text.split(/\r?\n/)
  const blocks = []
  const issues = []
  let open = null

  lines.forEach((line, index) => {
    const opening = /^\s*```([^\s`]*)?(?:\s+(.*?))?\s*$/.exec(line)
    if (!open && opening) {
      open = {
        language: (opening[1] ?? '').toLowerCase(),
        info: opening[2] ?? '',
        startLine: index + 1,
        lines: [],
      }
      return
    }

    if (open && /^\s*```\s*$/.test(line)) {
      blocks.push({ ...open, code: open.lines.join('\n') })
      open = null
      return
    }

    if (open) open.lines.push(line)
  })

  if (open) {
    issues.push(`unclosed ${open.language || 'unknown'} fence at line ${open.startLine}`)
  }

  return { blocks, issues }
}

function getApiHeadings(section) {
  if (section === null) return []
  const lines = section.split(/\r?\n/)
  const headings = []
  let inFence = false

  lines.forEach((line, index) => {
    if (/^\s*```/.test(line)) {
      inFence = !inFence
      return
    }
    if (!inFence && /^#{3,}\s+\S/.test(line)) {
      headings.push({ line, index })
    }
  })
  return headings
}

function isIntentionalPartial(code, info) {
  const marker = `${info}\n${code}`.split(/\r?\n/).slice(0, 4).join('\n')
  return /(?:省略上下文|仅展示片段|代码片段|伪代码|partial|context omitted)/iu.test(marker)
}

function hasTextOutputRule(code) {
  return code.split(/\r?\n/).some((line) =>
    /^\s*#\s*(?:图形|绘图|训练(?:过程|循环)?|无确定文本|没有确定文本|保存文件|返回对象|输出由)/u.test(line) ||
    /^\s*#\s*输出\s*[:：]\s*(?:图形|绘图|训练|无确定文本|没有确定文本|保存文件|返回对象|输出由)/u.test(line),
  )
}

function inspectOutputContract(code) {
  if (isIntentionalPartial(code, '')) return []

  const lines = code.split(/\r?\n/)
  const hasPrint = lines.some((line) => /^\s*print\s*\(/u.test(line))
  const outputComment = /^\s*#\s*输出\s*[:：]\s*\S/u

  if (!hasPrint) {
    return hasTextOutputRule(code)
      ? []
      : ['needs print(...) followed by an independent # 输出：... line']
  }

  const hasAdjacentOutput = lines.some(
    (line, index) => /^\s*print\s*\(/u.test(line) && outputComment.test(lines[index + 1] ?? ''),
  )
  return hasAdjacentOutput ? [] : ['print(...) must be immediately followed by an independent # 输出：... line']
}

function inspectApiHeadings(article) {
  const issues = []

  for (const sectionLabel of ['常用用法', '不常用但需要知道']) {
    const section = getSection(article.body, sectionLabel)
    const headings = getApiHeadings(section)
    if (headings.length === 0) {
      issues.push(`[section:${sectionLabel}] needs at least one ### API/use heading`)
      continue
    }

    const lines = section.split(/\r?\n/)
    for (const { line, index } of headings) {
      const next = lines.slice(index + 1).find((candidate) => candidate.trim() !== '')
      if (!next || !/^\s*```(?:python|py)(?:\s|$)/iu.test(next)) {
        issues.push(`[section:${sectionLabel}] ${line.trim()} must be followed directly by a python fence`)
      }
    }
  }

  return issues
}

function inspectQuestions(section) {
  if (section === null) return ['section is missing']

  const lines = section.split(/\r?\n/)
  const starts = lines
    .map((line, index) => ({ line, index }))
    .filter(({ line }) => /^\s*\d+[.)]\s+\S/u.test(line))
    .map(({ index }) => index)

  const qualified = starts.filter((start, index) => {
    const end = starts[index + 1] ?? lines.length
    const chunk = lines.slice(start, end)
    const answer = chunk.findIndex((line, lineIndex) =>
      lineIndex > 0 && /^\s*(?:[-*+]\s+)?答案\s*[:：]\s*\S/u.test(line),
    )
    const explanation = chunk.findIndex((line, lineIndex) =>
      lineIndex > answer && /^\s*(?:[-*+]\s+)?解析\s*[:：]\s*\S/u.test(line),
    )
    return answer > 0 && explanation > answer
  })

  return qualified.length >= 2
    ? []
    : ['needs at least two numbered questions with immediate 答案： and 解析： lines']
}

function runAstParse(code) {
  const result = spawnSync(
    'python',
    ['-c', 'import ast, sys; ast.parse(sys.stdin.read())'],
    { input: code, encoding: 'utf8' },
  )
  if (result.error) return { error: `python ast.parse unavailable: ${result.error.message}` }
  if (result.status !== 0) return { error: (result.stderr || 'ast.parse failed').trim() }
  return { error: null }
}

function inspectInternalLinks(article) {
  const issues = []
  const lines = article.body.split(/\r?\n/)
  let inFence = false

  lines.forEach((line, lineIndex) => {
    if (/^\s*```/.test(line)) {
      inFence = !inFence
      return
    }
    if (inFence) return

    const markdownLink = /(?<!!)\[[^\]]*\]\(([^)\s]+)(?:\s+[^)]*)?\)/gu
    for (const match of line.matchAll(markdownLink)) {
      const target = match[1].replace(/^<|>$/g, '')
      if (!target || /^(?:#|https?:|mailto:|tel:|data:|javascript:)/iu.test(target)) continue

      const [pathPart] = target.split(/[?#]/u)
      if (!pathPart) continue

      let decodedPath
      try {
        decodedPath = decodeURIComponent(pathPart)
      } catch {
        issues.push(`${article.relativePath}:${lineIndex + 1} has malformed link target ${target}`)
        continue
      }

      const sourceAbsolute = absolutePath(article.relativePath)
      const targetAbsolute = decodedPath.startsWith('/')
        ? join(REPO_ROOT, 'docs', ...decodedPath.slice(1).split('/'))
        : resolve(dirname(sourceAbsolute), decodedPath)
      const candidates = []
      if (decodedPath.endsWith('.md')) candidates.push(targetAbsolute)
      else {
        candidates.push(targetAbsolute, `${targetAbsolute}.md`, join(targetAbsolute, 'index.md'))
      }

      if (!candidates.some((candidate) => existsSync(candidate))) {
        issues.push(`${article.relativePath}:${lineIndex + 1} dead internal link ${target}`)
      }
    }
  })

  return issues
}

test('Python and PyTorch course paths stay exact while preserving unrelated deep-learning pages', () => {
  const basicPaths = fg
    .sync(`${PYTHON_BASIC_ROOT}/*.md`, { cwd: REPO_ROOT, onlyFiles: true })
    .map(normalizePath)
    .sort()
  const advancedPaths = fg
    .sync(`${PYTHON_ADVANCED_ROOT}/*.md`, { cwd: REPO_ROOT, onlyFiles: true })
    .map(normalizePath)
    .sort()
  const pytorchPaths = fg
    .sync(`${PYTORCH_ROOT}/*.md`, { cwd: REPO_ROOT, onlyFiles: true })
    .map(normalizePath)
    .sort()

  assert.deepEqual(
    basicPaths,
    PYTHON_BASIC_ARTICLES.map((file) => `${PYTHON_BASIC_ROOT}/${file}`).sort(),
    'rule python-basic-paths: the fundamentals range must be exactly 01–17',
  )
  assert.deepEqual(
    advancedPaths,
    PYTHON_ADVANCED_ARTICLES.map((file) => `${PYTHON_ADVANCED_ROOT}/${file}`).sort(),
    'rule python-advanced-paths: NumPy/Pandas/Matplotlib/Seaborn paths must stay stable',
  )
  assert.deepEqual(
    pytorchPaths,
    [...PYTORCH_QUALITY_ARTICLES, ...PYTORCH_OTHER_ARTICLES]
      .map((file) => `${PYTORCH_ROOT}/${file}`)
      .sort(),
    'rule pytorch-paths: keep 02–04 and add only the planned 05–11 quick-reference pages',
  )
})

test('Python homepage and every target article have parseable frontmatter', () => {
  const index = readMarkdown(PYTHON_INDEX_PATH)
  assert.ok(index.source.startsWith('---'), 'Python index must keep YAML frontmatter')
  assert.match(
    index.source,
    /\]\(\/?courses\/tangyudi\/03-深度学习篇\/01-Pytorch(?:\.md)?(?:#[^)]+)?\)/u,
    'Python homepage must link to the single PyTorch entry point',
  )

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

  assert.deepEqual(violations, [], `rule python-frontmatter\n${violations.join('\n')}`)
})

test('Python and PyTorch articles expose the shared learning structure', () => {
  const violations = []

  for (const relativePath of ARTICLE_PATHS) {
    let article
    try {
      article = readMarkdown(relativePath)
    } catch (error) {
      violations.push(`${relativePath} [article-read] ${error.message}`)
      continue
    }

    for (const sectionLabel of REQUIRED_SECTIONS) {
      const content = getSection(article.body, sectionLabel)
      if (content === null) {
        violations.push(`${relativePath} [section:${sectionLabel}] heading is missing`)
      } else if (!content.trim()) {
        violations.push(`${relativePath} [section:${sectionLabel}] body is empty`)
      }
    }

    violations.push(
      ...inspectApiHeadings(article).map((issue) => `${relativePath} ${issue}`),
    )
    violations.push(
      ...inspectQuestions(getSection(article.body, '课后小问')).map(
        (issue) => `${relativePath} [section:课后小问] ${issue}`,
      ),
    )
  }

  assert.deepEqual(violations, [], `rule python-article-structure\n${violations.join('\n')}`)
})

test('Python examples keep explicit output contracts and avoid Notebook magic', () => {
  const violations = []

  for (const relativePath of ARTICLE_PATHS) {
    let article
    try {
      article = readMarkdown(relativePath)
    } catch (error) {
      violations.push(`${relativePath} [article-read] ${error.message}`)
      continue
    }

    const { blocks: allBlocks, issues: fenceIssues } = scanFences(article.body)
    const blocks = allBlocks.filter(({ language }) => language === 'python' || language === 'py')
    violations.push(...fenceIssues.map((issue) => `${relativePath} [fence] ${issue}`))

    allBlocks.forEach((block, index) => {
      if (isIntentionalPartial(block.code, block.info)) return
      if (/^\s*>>>/mu.test(block.code)) {
        violations.push(`${relativePath} [code-block-${index + 1} line ${block.startLine}] contains raw REPL output`)
      }
    })

    blocks.forEach((block, index) => {
      const label = `${relativePath} [python-block-${index + 1} line ${block.startLine}]`
      if (isIntentionalPartial(block.code, block.info)) return

      for (const rule of FORBIDDEN_API_RULES) {
        rule.pattern.lastIndex = 0
        if (rule.pattern.test(block.code)) {
          violations.push(`${label} uses forbidden or deprecated API ${rule.name}`)
        }
      }

      if (/^\s*%{1,2}|\bget_ipython\s*\(/mu.test(block.code)) {
        violations.push(`${label} contains Notebook magic; use ordinary Python or shell fences`)
      }

      violations.push(...inspectOutputContract(block.code).map((issue) => `${label} ${issue}`))

      const parsed = runAstParse(block.code)
      if (parsed.error) violations.push(`${label} ast.parse failed: ${parsed.error}`)
    })
  }

  assert.deepEqual(violations, [], `rule python-code-quality\n${violations.join('\n')}`)
})

test('Python and PyTorch target pages do not contain dead internal Markdown links', () => {
  const violations = []
  for (const relativePath of TARGET_MARKDOWN_PATHS) {
    try {
      violations.push(...inspectInternalLinks(readMarkdown(relativePath)))
    } catch (error) {
      violations.push(`${relativePath} [article-read] ${error.message}`)
    }
  }

  assert.deepEqual(violations, [], `rule python-internal-links\n${violations.join('\n')}`)
})
