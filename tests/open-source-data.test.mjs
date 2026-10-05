import assert from 'node:assert/strict'
import { mkdirSync, mkdtempSync, readFileSync, readdirSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { test } from 'node:test'
import matter from 'gray-matter'
import fg from 'fast-glob'
import articleLoader from '../article.data.js'
import { loadOpenSourceProjects } from '../docs/.vitepress/theme/data/open-source.ts'
import openSourceLoader, {
  createOpenSourceDataLoader,
  resolveOpenSourceDocsRoot,
} from '../docs/.vitepress/theme/data/open-source.data.ts'
import { getJavaCourseItems } from '../docs/.vitepress/config/java-course.ts'

const EXPECTED_JAVA_ARTICLES_BY_CHAPTER = {
  '01-Java基础': [
    '01-开发环境与第一个程序.md',
    '02-基础语法与程序结构.md',
    '03-数据类型与运算符.md',
    '04-控制流与方法.md',
    '05-类型转换与数值精度.md',
    '06-运算符与表达式.md',
    '07-方法参数重载与递归.md',
  ],
  '02-数组与文本': [
    '01-数组与多维数组.md',
    '02-String与文本处理.md',
    '03-常用类与包装类型.md',
    '04-正则表达式与文本匹配.md',
    '05-JSON与Java对象转换.md',
    '06-大数与精确计算.md',
  ],
  '03-面向对象': [
    '01-类与对象.md',
    '02-封装继承与多态.md',
    '03-接口与抽象类.md',
    '04-内部类枚举基础.md',
    '05-构造器与初始化顺序.md',
    '06-Object方法与对象相等.md',
    '07-static-final与代码组织.md',
  ],
  '04-现代Java类型': [
    '01-枚举record与sealed.md',
    '02-异常体系与资源管理.md',
    '03-record数据载体.md',
    '04-sealed受限继承.md',
    '05-异常处理常用写法.md',
    '06-自定义异常与异常转换.md',
  ],
  '05-泛型与集合': [
    '01-泛型与类型安全.md',
    '02-集合框架与数据结构.md',
    '03-Map与集合选择.md',
    '04-List常用API.md',
    '05-Set去重与集合运算.md',
    '06-Queue与Deque.md',
    '07-Map常用API.md',
    '08-集合排序与不可变集合.md',
  ],
  '06-函数式与时间': [
    '01-Lambda与函数式接口.md',
    '02-Stream流式处理.md',
    '03-日期时间API.md',
    '04-Optional常用API.md',
    '05-Collectors收集器速查.md',
    '06-Stream分组聚合与扁平化.md',
    '07-日期格式化与解析.md',
    '08-时区Instant与ZonedDateTime.md',
  ],
  '07-IO与网络': [
    '01-IO与NIO.md',
    '02-网络编程.md',
    '03-Path与Files常用API.md',
    '04-字节流字符流与缓冲.md',
    '05-NIO-Buffer与Channel.md',
    '06-HTTP-Client常用API.md',
    '07-Socket与网络边界.md',
  ],
  '08-反射与模块': [
    '01-反射与注解.md',
    '02-模块化系统.md',
    '03-Class与反射常用API.md',
    '04-注解定义与运行时读取.md',
    '05-动态代理与反射边界.md',
    '06-module-info模块速查.md',
    '07-ServiceLoader服务发现.md',
  ],
  '09-并发编程': [
    '01-线程基础与执行器.md',
    '02-并发工具与线程安全.md',
    '03-JMM与并发内存模型.md',
    '04-虚拟线程.md',
    '05-synchronized互斥锁.md',
    '06-ReentrantLock与Condition.md',
    '07-volatile原子类与可见性.md',
    '08-线程池Callable与Future.md',
    '09-CompletableFuture异步编排.md',
    '10-并发集合与阻塞队列.md',
    '11-CountDownLatch-Semaphore与CyclicBarrier.md',
    '12-死锁定位与避免.md',
    '13-ReadWriteLock读写锁.md',
    '14-StampedLock乐观读.md',
    '15-LockSupport与锁选择.md',
  ],
  '10-JVM': [
    '01-JVM内存与类加载.md',
    '02-垃圾回收与调优.md',
    '03-类加载初始化与类加载器.md',
    '04-JVM诊断命令与JFR.md',
    '05-GC日志与问题定位.md',
  ],
  '11-MySQL-8': ['index.md', '01-环境连接与数据库对象.md', '02-表设计与DDL.md', '03-数据类型字符集与时区.md', '04-数据写入更新与删除.md', '05-查询过滤排序与分页.md', '06-连接子查询与集合查询.md', '07-聚合CTE窗口函数与JSON.md', '08-约束与索引设计.md', '09-事务MVCC隔离级别与锁.md', '10-EXPLAIN慢SQL与性能优化.md'],
  '12-工程实践': [
    '01-Maven与测试工程.md',
    '02-JDBC与事务.md',
    '04-Velocity代码生成.md',
  ],
  '13-设计与项目': ['01-设计原则模式与综合复习.md'],
  '14-后端工程': [
    '01-Spring-Boot启动与配置.md',
    '02-Spring-IoC与Bean生命周期.md',
    '03-Spring-AOP与声明式事务.md',
    '04-Spring-MVC与Servlet边界.md',
    '05-Spring-Security与JWT.md',
    '06-MyBatis核心与MyBatis-Plus重点.md',
    '07-Jackson与Fastjson2-JSON.md',
    '08-Bean-Validation参数校验.md',
    '09-SLF4J与Logback日志.md',
    '10-文件上传下载与资源安全.md',
    '11-Apache-POI-Excel导入导出.md',
    '12-Quartz定时任务.md',
  ],
}

const EXPECTED_JAVA_PATHS = [
  'docs/courses/java/index.md',
  ...Object.entries(EXPECTED_JAVA_ARTICLES_BY_CHAPTER).flatMap(([chapter, articles]) =>
    articles.map((article) => `docs/courses/java/${chapter}/${article}`),
  ),
].sort()

const EXPECTED_JAVA_CHAPTER_COUNTS = [7, 6, 7, 6, 8, 8, 7, 7, 15, 5, 11, 3, 1, 12]
const EXPECTED_JAVA_ROADMAP_PATHS = [
  'docs/courses/java/12-工程实践/01-Maven与测试工程.md',
  'docs/courses/java/12-工程实践/02-JDBC与事务.md',
  'docs/courses/java/12-工程实践/04-Velocity代码生成.md',
  'docs/courses/java/13-设计与项目/01-设计原则模式与综合复习.md',
  'docs/courses/java/14-后端工程/01-Spring-Boot启动与配置.md',
  'docs/courses/java/14-后端工程/02-Spring-IoC与Bean生命周期.md',
  'docs/courses/java/14-后端工程/03-Spring-AOP与声明式事务.md',
  'docs/courses/java/14-后端工程/04-Spring-MVC与Servlet边界.md',
  'docs/courses/java/14-后端工程/05-Spring-Security与JWT.md',
  'docs/courses/java/14-后端工程/06-MyBatis核心与MyBatis-Plus重点.md',
  'docs/courses/java/14-后端工程/07-Jackson与Fastjson2-JSON.md',
  'docs/courses/java/14-后端工程/08-Bean-Validation参数校验.md',
  'docs/courses/java/14-后端工程/09-SLF4J与Logback日志.md',
  'docs/courses/java/14-后端工程/10-文件上传下载与资源安全.md',
  'docs/courses/java/14-后端工程/11-Apache-POI-Excel导入导出.md',
  'docs/courses/java/14-后端工程/12-Quartz定时任务.md',
]

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

test('real DSH MyTable content is indexed with three notes and its repository', () => {
  const docsRoot = resolve(dirname(fileURLToPath(import.meta.url)), '../docs')
  const projects = loadOpenSourceProjects(docsRoot)
  const mytable = projects.find(({ name }) => name === 'DSH MyTable')

  assert.ok(mytable, 'DSH MyTable should be loaded from the real Markdown content')
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
  assert.equal(homepage.hero.text, '专注 · 洞察 · 分享')
  assert.doesNotMatch(homepage.hero.tagline, /牛马工程师/)
  assert.match(homepage.hero.tagline, /持续学习/)
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
    /  @supports \(\(backdrop-filter: blur\(1px\)\) or \(-webkit-backdrop-filter: blur\(1px\)\)\) \{([\s\S]*?)\r?\n  \}\r?\n\}/,
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
  assert.match(nav, /link:\s*'\/courses\/agent\/'/)
  assert.match(sidebar, /'\/courses\/agent\/':\s*getItems\("courses\/agent"\)/)
  assert.match(roadmap, /MCP/)
  assert.match(roadmap, /Agent Skills/)
  assert.match(roadmap, /RAG/)
  assert.match(roadmap, /LangChain/)
})

test('Java learning path follows Python and uses the explicit roadmap sidebar', () => {
  const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..')
  const nav = readFileSync(join(repoRoot, 'docs/.vitepress/config/nav.ts'), 'utf8')
  const sidebar = readFileSync(join(repoRoot, 'docs/.vitepress/config/sidebar.ts'), 'utf8')
  const javaFiles = fg.sync('docs/courses/java/**/*.md', { cwd: repoRoot })

  assert.match(
    nav,
    /Python基础快速入门[\s\S]*Java基础快速入门/,
    'Java should appear immediately after Python in the learning navigation',
  )
  assert.match(sidebar, /'\/courses\/java\/':\s*getJavaCourseItems\(\)/)
  assert.equal(javaFiles.length, 104, 'the Java path should contain 104 Markdown files including indexes')
  assert.equal(
    getJavaCourseItems().flatMap((chapter) => chapter.items ?? []).length,
    102,
    'the published sidebar should expose the 102 existing canonical articles',
  )

  const javaContent = javaFiles
    .map((file) => readFileSync(join(repoRoot, file), 'utf8'))
    .join('\n')
  for (const topic of [
    '基础语法', '面向对象', '集合', '泛型', 'Lambda', 'Stream',
    'I/O', '网络', '并发', 'JVM', '反射', '注解', 'Maven', 'JUnit',
    'record', '模块化', '虚拟线程',
  ]) {
    assert.match(javaContent, new RegExp(topic), `Java outline should cover ${topic}`)
  }
})

test('Java course keeps the exact migrated path set and 01-10 quality range', () => {
  const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..')
  const javaPaths = fg
    .sync('docs/courses/java/**/*.md', { cwd: repoRoot, onlyFiles: true })
    .map((file) => file.replaceAll('\\', '/'))
    .sort()
  const chapterPaths = Object.keys(EXPECTED_JAVA_ARTICLES_BY_CHAPTER)
    .map((chapter) => `docs/courses/java/${chapter}`)
    .sort()
  const actualChapterPaths = readdirSync(join(repoRoot, 'docs/courses/java'), { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => `docs/courses/java/${entry.name}`)
    .sort()
  const actualChapterCounts = actualChapterPaths.map(
    (chapterPath) => fg.sync(`${chapterPath}/*.md`, { cwd: repoRoot, onlyFiles: true }).length,
  )

  assert.deepEqual(javaPaths, EXPECTED_JAVA_PATHS, 'the Java path set must stay exact')
  assert.equal(javaPaths.length, 104, 'the Java path should contain 104 Markdown files')
  assert.equal(
    javaPaths.filter((file) => !file.endsWith('/index.md')).length,
    102,
    'the Java path should contain 102 article pages',
  )
  assert.deepEqual(actualChapterPaths, chapterPaths, 'the Java chapter directory range must stay exact')
  assert.deepEqual(actualChapterCounts, EXPECTED_JAVA_CHAPTER_COUNTS, 'the Java chapter counts must stay exact')

  const qualityPaths = javaPaths.filter((file) =>
    /^docs\/courses\/java\/(?:0[1-9]-|10-)/u.test(file) && file !== 'docs/courses/java/index.md',
  )
  assert.equal(qualityPaths.length, 76, 'chapters 01-10 must contain 76 quality-gated articles')
  assert.deepEqual(
    javaPaths.filter((file) => /^(?:docs\/courses\/java\/(?:12|13|14)-)/u.test(file)),
    EXPECTED_JAVA_ROADMAP_PATHS,
    'chapters 12-14 must retain the migrated article paths',
  )
})

test('the first Java chapter contains complete lessons with runnable examples', () => {
  const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..')
  const firstChapter = fg.sync('docs/courses/java/01-Java基础/*.md', { cwd: repoRoot })
  const expectedFirstChapter = [
    'docs/courses/java/01-Java基础/01-开发环境与第一个程序.md',
    'docs/courses/java/01-Java基础/02-基础语法与程序结构.md',
    'docs/courses/java/01-Java基础/03-数据类型与运算符.md',
    'docs/courses/java/01-Java基础/04-控制流与方法.md',
    'docs/courses/java/01-Java基础/05-类型转换与数值精度.md',
    'docs/courses/java/01-Java基础/06-运算符与表达式.md',
    'docs/courses/java/01-Java基础/07-方法参数重载与递归.md',
  ]

  assert.equal(firstChapter.length, 7)
  assert.deepEqual(firstChapter.sort(), expectedFirstChapter)
  for (const file of firstChapter) {
    const lesson = readFileSync(join(repoRoot, file), 'utf8')
    assert.ok(lesson.length >= 1200, `${file} should contain a useful knowledge-point reference`)
    assert.match(lesson, /```java[\s\S]+?```/, `${file} should contain runnable Java code`)
    assert.doesNotMatch(lesson, /## 实战练习/)
    assert.match(lesson, /## 本节小结/)
  }
})

test('open-source projects are exposed as a dynamic top navigation menu', () => {
  const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..')
  const nav = readFileSync(join(repoRoot, 'docs/.vitepress/config/nav.ts'), 'utf8')

  assert.match(nav, /openSourceNavItems/)
  assert.match(nav, /docs\/open-source\/\*\/index\.md/)
  assert.match(nav, /text:\s*'项目总览'/)
  assert.match(nav, /items:\s*openSourceNavItems/)
})

test('legacy project documents are not exposed as a top-level navigation column', () => {
  const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..')
  const nav = readFileSync(join(repoRoot, 'docs/.vitepress/config/nav.ts'), 'utf8')

  assert.doesNotMatch(nav, /text:\s*'项目文档'/)
  assert.doesNotMatch(nav, /link:\s*'\/my_project\/index'/)
})

test('open-source portfolio and Markdown tables use the full readable width', () => {
  const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..')
  const projects = readFileSync(
    join(repoRoot, 'docs/.vitepress/theme/components/OpenSourceProjects.vue'),
    'utf8',
  )
  const customStyles = readFileSync(
    join(repoRoot, 'docs/.vitepress/theme/styles/custom.css'),
    'utf8',
  )

  assert.match(projects, /open-source-card__index/)
  assert.match(projects, /open-source-card__actions/)
  assert.doesNotMatch(projects, /open-source-card__status-pill/)
  assert.match(customStyles, /\.open-source-grid\s*\{[^}]*grid-template-columns:\s*minmax\(0,\s*1fr\)/s)
  assert.match(customStyles, /\.vp-doc\s+table\s*\{[^}]*width:\s*100%/s)
  assert.match(customStyles, /\.vp-doc\s+table\s*\{[^}]*border-collapse:\s*separate/s)
})

test('the site defaults to dark mode and the about page reflects the current status', () => {
  const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..')
  const config = readFileSync(join(repoRoot, 'docs/.vitepress/config.ts'), 'utf8')
  const about = readFileSync(join(repoRoot, 'docs/about/me.md'), 'utf8')

  assert.match(config, /appearance:\s*'dark'/)
  assert.match(about, /目前在当牛马工程师/)
  assert.doesNotMatch(about, /当前目标/)
})

test('archive data excludes non-article Markdown without valid dates', () => {
  const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..')
  const files = fg.sync(join(repoRoot, 'docs/**/*.md').replace(/\\/g, '/'))
  const articles = articleLoader.load(files)

  assert.ok(articles.length > 0)
  assert.ok(articles.every(({ title }) => typeof title === 'string' && title.trim() !== ''))
  assert.ok(articles.every(({ date }) => typeof date === 'string' && !Number.isNaN(Date.parse(date))))
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
  assert.equal(packageJson.engines.node, '>=22.13.0')
})

test('Vercel uses the same pinned toolchain and VitePress output directory', () => {
  const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..')
  const vercel = JSON.parse(readFileSync(join(repoRoot, 'vercel.json'), 'utf8'))

  assert.equal(vercel.buildCommand, 'corepack pnpm@9.15.9 build')
  assert.equal(vercel.installCommand, 'corepack pnpm@9.15.9 install --frozen-lockfile')
  assert.equal(vercel.outputDirectory, 'docs/.vitepress/dist')
  assert.equal(vercel.cleanUrls, true)
})
