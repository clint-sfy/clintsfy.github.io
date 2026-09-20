import assert from 'node:assert/strict'
import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { test } from 'node:test'
import matter from 'gray-matter'
import { loadOpenSourceProjects } from '../docs/.vitepress/theme/data/open-source.ts'
import openSourceLoader, {
  createOpenSourceDataLoader,
  resolveOpenSourceDocsRoot,
} from '../docs/.vitepress/theme/data/open-source.data.ts'

function addProject(docsRoot, directoryName, frontmatter, notes = []) {
  const projectDir = join(docsRoot, 'open-source', directoryName)
  mkdirSync(projectDir, { recursive: true })
  writeFileSync(
    join(projectDir, 'index.md'),
    `---\n${frontmatter}\n---\n\n# Project notes\n`,
  )

  for (const note of notes) {
    writeFileSync(join(projectDir, note), '# Note\n')
  }
}

test('loads projects with stable order, safe defaults, note counts, and directory links', () => {
  const tempRoot = mkdtempSync(join(tmpdir(), 'open-source-data-'))
  const docsRoot = join(tempRoot, 'docs')

  try {
    addProject(
      docsRoot,
      '03-Gamma',
      'name: Gamma Project\nsummary: Later project\norder: 20\nstatus: completed\nstack:\n  - TypeScript',
      ['notes.md'],
    )
    addProject(
      docsRoot,
      '02-Beta',
      'name: Alpha Project\nsummary: Second tie\norder: 10\nstatus: learning',
      ['progress.md'],
    )
    addProject(
      docsRoot,
      '01-Alpha',
      'name: Zulu Project\nsummary: First tie\norder: 10\nstatus: unknown',
      ['first.md', 'second.md', 'diagram.svg'],
    )

    const projects = loadOpenSourceProjects(docsRoot)

    assert.deepEqual(
      projects.map(({ link }) => link),
      ['/open-source/01-Alpha/', '/open-source/02-Beta/', '/open-source/03-Gamma/'],
    )
    assert.deepEqual(
      projects.map(({ order }) => order),
      [10, 10, 20],
    )
    assert.equal(projects[0].noteCount, 2)
    assert.equal(projects[0].status, 'paused')
    assert.equal(projects[0].statusLabel, '暂停')
    assert.deepEqual(projects[0].stack, [])
  } finally {
    rmSync(tempRoot, { recursive: true, force: true })
  }
})

test('VitePress loader resolves the docs root and delegates using a non-empty fixture', () => {
  const tempRoot = mkdtempSync(join(tmpdir(), 'open-source-loader-'))
  const docsRoot = join(tempRoot, 'docs')

  try {
    addProject(
      docsRoot,
      '07-Loader-fixture',
      'name: Loader fixture\nsummary: Loader fixture project\norder: 7\nstatus: learning',
      ['note.md'],
    )

    const loader = createOpenSourceDataLoader(docsRoot)
    const loaderModuleUrl = new URL(
      '../docs/.vitepress/theme/data/open-source.data.ts',
      import.meta.url,
    ).href
    const expectedDocsRoot = resolve(
      dirname(fileURLToPath(import.meta.url)),
      '../docs',
    )

    assert.deepEqual(loader.watch, ['../../../open-source/*/*.md'])
    assert.deepEqual(openSourceLoader.watch, ['../../../open-source/*/*.md'])
    assert.deepEqual(loader.load(), loadOpenSourceProjects(docsRoot))
    assert.deepEqual(
      loader.load().map(({ link }) => link),
      ['/open-source/07-Loader-fixture/'],
    )
    assert.equal(resolveOpenSourceDocsRoot(loaderModuleUrl), expectedDocsRoot)
  } finally {
    rmSync(tempRoot, { recursive: true, force: true })
  }
})

test('normalizes the project display name from projectName, name, title, or directory', () => {
  const tempRoot = mkdtempSync(join(tmpdir(), 'open-source-project-name-'))
  const docsRoot = join(tempRoot, 'docs')

  try {
    addProject(
      docsRoot,
      '01-ProjectName',
      'projectName: Preferred name\nname: Legacy name\ntitle: Article title\norder: 1',
    )
    addProject(
      docsRoot,
      '02-LegacyName',
      'name: Legacy name\ntitle: Article title\norder: 2',
    )
    addProject(docsRoot, '03-Title', 'title: Article title\norder: 3')
    addProject(docsRoot, '04-DirectoryFallback', 'summary: No explicit name\norder: 4')

    const projects = loadOpenSourceProjects(docsRoot)

    assert.deepEqual(
      projects.map(({ name }) => name),
      ['Preferred name', 'Legacy name', 'Article title', '04-DirectoryFallback'],
    )
  } finally {
    rmSync(tempRoot, { recursive: true, force: true })
  }
})

test('real RuoYi content is indexed with three notes and its directory link', () => {
  const docsRoot = resolve(dirname(fileURLToPath(import.meta.url)), '../docs')
  const projects = loadOpenSourceProjects(docsRoot)
  const ruoYi = projects.find(({ name }) => name === 'RuoYi')

  assert.ok(ruoYi, 'RuoYi should be loaded from the real Markdown content')
  assert.equal(ruoYi.noteCount, 3)
  assert.equal(ruoYi.link, '/open-source/01-RuoYi/')
})

test('site visual contract keeps the learning homepage and accessible blue project grid', () => {
  const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..')
  const variables = readFileSync(
    join(repoRoot, 'docs/.vitepress/theme/styles/vars.css'),
    'utf8',
  )
  const customStyles = readFileSync(
    join(repoRoot, 'docs/.vitepress/theme/styles/custom.css'),
    'utf8',
  )
  const homepage = matter(readFileSync(join(repoRoot, 'docs/index.md'), 'utf8')).data
  const head = readFileSync(join(repoRoot, 'docs/.vitepress/config/head.ts'), 'utf8')

  assert.match(variables, /#0071e3/i, 'the brand primary color should be Apple blue')
  assert.match(customStyles, /\.open-source-grid\b/, 'project cards should use the visual grid styles')
  assert.match(customStyles, /:focus-visible\b/, 'interactive controls should expose a keyboard focus ring')
  assert.match(customStyles, /prefers-reduced-motion\s*:\s*reduce/, 'nonessential motion should respect user preferences')
  assert.match(customStyles, /html\.dark\b/, 'surface colors should include a dark-mode variant')

  const navRule = customStyles.match(/\.VPNavBar\s*\{([^}]*)\}/s)?.[1] ?? ''
  assert.match(navRule, /background-color\s*:/, 'the navigation should have a solid-color fallback')
  assert.match(navRule, /backdrop-filter\s*:/, 'the navigation may use a translucent glass effect')
  assert.ok(
    navRule.indexOf('background-color:') < navRule.indexOf('backdrop-filter:'),
    'the solid navigation background should precede backdrop-filter',
  )

  assert.equal(homepage.hero.name, '阿源的知识库')
  assert.match(homepage.hero.tagline, /学习|研习|实践/, 'the tagline should focus on learning')
  assert.deepEqual(
    homepage.hero.actions.map(({ text, link }) => ({ text, link })),
    [
      { text: '学习开源项目', link: '/open-source/' },
      { text: '开始阅读', link: '/introduction' },
    ],
  )
  assert.deepEqual(
    homepage.features.map(({ title }) => title),
    ['开源项目研习', '系统学习笔记', '项目实践', '持续分享'],
  )
  assert.match(head, /name:\s*['"]theme-color['"]\s*,\s*content:\s*['"]#f5f5f7['"]/, 'the browser theme color should match the light surface')
})
