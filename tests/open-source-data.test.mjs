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

test('real dsh-mytable content is indexed with three notes and its repository', () => {
  const docsRoot = resolve(dirname(fileURLToPath(import.meta.url)), '../docs')
  const projects = loadOpenSourceProjects(docsRoot)
  const mytable = projects.find(({ name }) => name === 'dsh-mytable')

  assert.ok(mytable, 'dsh-mytable should be loaded from the real Markdown content')
  assert.equal(mytable.noteCount, 3)
  assert.equal(mytable.link, '/open-source/01-dsh-mytable/')
  assert.equal(mytable.repo, 'https://github.com/clint-sfy/dsh-mytable')
})

test('AGV documentation is indexed under open-source learning', () => {
  const docsRoot = resolve(dirname(fileURLToPath(import.meta.url)), '../docs')
  const projects = loadOpenSourceProjects(docsRoot)
  const agv = projects.find(({ name }) => name === 'AGV 智能叉车')

  assert.ok(agv, 'AGV should be migrated into the open-source project collection')
  assert.equal(agv.noteCount, 7)
  assert.equal(agv.link, '/open-source/02-AGV项目/')
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
  assert.match(variables, /#30d158/i, 'the hero title should retain a refined green gradient stop')
  assert.match(
    variables,
    /--vp-home-hero-image-background-image:\s*radial-gradient\([\s\S]*?rgba\(0, 113, 227, 0\.38\)[\s\S]*?radial-gradient\([\s\S]*?rgba\(48, 209, 88, 0\.34\)/,
    'the whale should have layered blue and green halo gradients',
  )
  assert.match(customStyles, /\.VPHomeHero\s+\.image-bg\b/, 'the hero halo should receive explicit visual depth styling')
  assert.match(customStyles, /\.open-source-grid\b/, 'project cards should use the visual grid styles')
  assert.match(customStyles, /:focus-visible\b/, 'interactive controls should expose a keyboard focus ring')
  assert.match(customStyles, /prefers-reduced-motion\s*:\s*reduce/, 'nonessential motion should respect user preferences')
  assert.match(customStyles, /html\.dark\b/, 'surface colors should include a dark-mode variant')
  assert.match(customStyles, /\.vp-doc\s*>\s*div\s*>\s*p\s*\{[^}]*text-indent:\s*2em/s, 'rendered Markdown prose should use a two-character first-line indent')
  assert.match(customStyles, /\.vp-doc\s+h2::before/, 'Markdown section headings should use the refined accent')

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

test('VitePress navigation controls keep 44px targets and the scrolled nav retains its surface', () => {
  const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..')
  const customStyles = readFileSync(
    join(repoRoot, 'docs/.vitepress/theme/styles/custom.css'),
    'utf8',
  )

  const searchButtonRule = customStyles.match(
    /\.VPNavBarSearch\s+\.DocSearch-Button\s*\{([^}]*)\}/s,
  )?.[1]
  assert.ok(searchButtonRule, 'the real VitePress search button should receive a size rule')
  assert.match(searchButtonRule, /min-height:\s*44px/)
  assert.match(searchButtonRule, /min-width:\s*44px/)

  const switchRule = customStyles.match(
    /html\s+\.VPNavBarAppearance\s+\.VPSwitch,\s*html\s+\.VPNavBarExtra\s+\.VPSwitch,\s*html\s+\.VPNavScreenAppearance\s+\.VPSwitch\s*\{([^}]*)\}/s,
  )?.[1]
  assert.ok(switchRule, 'desktop, tablet, and mobile appearance switches should receive the same target size')
  assert.match(switchRule, /min-height:\s*44px/)
  assert.match(switchRule, /min-width:\s*44px/)

  const sidebarLinkRule = customStyles.match(
    /#app\s+\.VPSidebarItem\s*>\s*\.item\s*>\s*\.link\s*\{([^}]*)\}/s,
  )?.[1]
  assert.ok(sidebarLinkRule, 'VitePress document sidebar links should receive a stable touch-target rule')
  assert.match(sidebarLinkRule, /min-height:\s*44px/)

  const mobileGroupLinkRule = customStyles.match(
    /#app\s+\.VPNavScreenMenuGroupLink\s*\{([^}]*)\}/s,
  )?.[1]
  assert.ok(mobileGroupLinkRule, 'mobile navigation group links should receive a stable touch-target rule')
  assert.match(mobileGroupLinkRule, /min-height:\s*44px/)
  assert.match(mobileGroupLinkRule, /display:\s*flex/)
  assert.match(mobileGroupLinkRule, /align-items:\s*center/)

  const scrolledNavRule = customStyles.match(
    /#app\s+\.VPNavBar:not\(\.top\)\s+\.content-body\s*\{([^}]*)\}/s,
  )?.[1]
  assert.ok(scrolledNavRule, 'the desktop scrolled navigation content should outrank VitePress scoped defaults')
  assert.match(scrolledNavRule, /background-color:\s*var\(--site-page-bg\)/)
  assert.match(scrolledNavRule, /backdrop-filter\s*:/)
  assert.ok(
    scrolledNavRule.indexOf('background-color:') < scrolledNavRule.indexOf('backdrop-filter:'),
    'the scrolled navigation should keep its solid fallback before backdrop-filter',
  )

  const backdropSupportRules = customStyles.match(
    /  @supports \(\(backdrop-filter: blur\(1px\)\) or \(-webkit-backdrop-filter: blur\(1px\)\)\) \{([\s\S]*?)\n  \}\n\}/,
  )?.[1]
  assert.ok(backdropSupportRules, 'the translucent scrolled navigation rules should be feature-gated')
  const translucentNavRule = backdropSupportRules.match(
    /#app\s+\.VPNavBar:not\(\.top\)\s+\.content-body\s*\{([^}]*)\}/s,
  )?.[1]
  assert.ok(translucentNavRule, 'the translucent surface should outrank VitePress scoped defaults')
  assert.match(translucentNavRule, /background-color:\s*color-mix\(/)
  const transparentNavWrapperRule = backdropSupportRules.match(
    /#app\s+\.VPNavBar:not\(\.has-sidebar\):not\(\.top\)\s*,\s*#app\s+\.VPNavBar\.has-sidebar:not\(\.top\)\s*\{([^}]*)\}/s,
  )?.[1]
  assert.ok(transparentNavWrapperRule, 'the transparent wrapper should use the same stable specificity')
  assert.match(transparentNavWrapperRule, /background-color:\s*transparent/)

  assert.match(
    customStyles,
    /#app\s+\.VPNavBar:not\(\.has-sidebar\):not\(\.top\)\s*,\s*#app\s+\.VPNavBar\.has-sidebar:not\(\.top\)\s*\{[^}]*background-color:\s*var\(--site-page-bg\)/s,
    'the scrolled navigation wrapper should outrank its desktop default background rule',
  )
})

test('documentation navigation scales to many projects and can be collapsed on desktop', () => {
  const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..')
  const sidebar = readFileSync(join(repoRoot, 'docs/.vitepress/config/sidebar.ts'), 'utf8')
  const layout = readFileSync(join(repoRoot, 'docs/.vitepress/theme/MyLayout.vue'), 'utf8')
  const collapseControl = readFileSync(
    join(repoRoot, 'docs/.vitepress/theme/components/layout/SidebarCollapse.vue'),
    'utf8',
  )
  const homepage = readFileSync(join(repoRoot, 'docs/index.md'), 'utf8')

  assert.match(sidebar, /text:\s*'项目总览'/)
  assert.match(sidebar, /collapsed:\s*projectIndex\s*!==\s*0/)
  assert.match(layout, /<SidebarCollapse\s*\/>/)
  assert.match(collapseControl, /localStorage/)
  assert.match(collapseControl, /sidebar-collapsed/)
  assert.match(collapseControl, /aria-label/)
  assert.match(collapseControl, /\.VPNavBarTitle\s*>\s*\.title/)
  assert.match(collapseControl, /font-size:\s*0/)
  assert.match(homepage, /<HomeOpenSourceProjects\s*\/>/)
})

test('Agent development notes are exposed through navigation and sidebar', () => {
  const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..')
  const nav = readFileSync(join(repoRoot, 'docs/.vitepress/config/nav.ts'), 'utf8')
  const sidebar = readFileSync(join(repoRoot, 'docs/.vitepress/config/sidebar.ts'), 'utf8')
  const roadmap = readFileSync(join(repoRoot, 'docs/courses/agent/index.md'), 'utf8')

  assert.match(nav, /text:\s*'Agent 开发'/)
  assert.match(nav, /\/courses\/agent\/index/)
  assert.match(sidebar, /'\/courses\/agent\/':\s*getItems\("courses\/agent"\)/)
  assert.match(roadmap, /MCP/)
  assert.match(roadmap, /Agent Skills/)
  assert.match(roadmap, /RAG/)
  assert.match(roadmap, /LangChain/)
})

test('open-source projects are exposed as a dynamic top navigation menu', () => {
  const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..')
  const nav = readFileSync(join(repoRoot, 'docs/.vitepress/config/nav.ts'), 'utf8')

  assert.match(nav, /openSourceNavItems/)
  assert.match(nav, /docs\/open-source\/\*\/index\.md/)
  assert.match(nav, /text:\s*'项目总览'/)
  assert.match(nav, /items:\s*openSourceNavItems/)
})

test('GitHub Pages workflow pins a Node-compatible pnpm toolchain', () => {
  const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..')
  const workflow = readFileSync(join(repoRoot, '.github/workflows/deploy.yml'), 'utf8')
  const packageJson = JSON.parse(readFileSync(join(repoRoot, 'package.json'), 'utf8'))

  assert.match(workflow, /uses:\s*pnpm\/action-setup@v4/)
  assert.match(workflow, /version:\s*9\.15\.9/)
  assert.match(workflow, /uses:\s*actions\/setup-node@v4/)
  assert.match(workflow, /node-version:\s*22/)
  assert.equal(packageJson.packageManager, 'pnpm@9.15.9')
})
