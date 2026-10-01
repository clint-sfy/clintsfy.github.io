import assert from 'node:assert/strict'
import { readFileSync, readdirSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { test } from 'node:test'
import fg from 'fast-glob'
import matter from 'gray-matter'

const REPO_ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const JAVA_ROOT = join(REPO_ROOT, 'docs/courses/java')
const JAVA_GLOB = 'docs/courses/java/**/*.md'
const JAVA_INDEX_PATH = 'docs/courses/java/index.md'

const CHAPTER_NAMES = [
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
  '11-工程实践',
  '12-设计与项目',
  '13-后端工程',
]

const QUALITY_CHAPTER_NAMES = CHAPTER_NAMES.slice(0, 10)

const EXPECTED_ARTICLES_BY_CHAPTER = {
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
  '11-工程实践': ['01-Maven与测试工程.md', '02-JDBC与事务.md'],
  '12-设计与项目': ['01-设计原则模式与综合复习.md'],
  '13-后端工程': [
    '01-Spring-Boot启动与配置.md',
    '02-Spring-IoC与Bean生命周期.md',
    '03-Spring-AOP与声明式事务.md',
    '04-Spring-MVC与Servlet边界.md',
    '06-MyBatis核心与MyBatis-Plus重点.md',
    '13-MySQL-8.0.md',
    '14-Redis.md',
  ],
}

const EXPECTED_JAVA_PATHS = [
  JAVA_INDEX_PATH,
  ...CHAPTER_NAMES.flatMap((chapter) =>
    EXPECTED_ARTICLES_BY_CHAPTER[chapter].map(
      (article) => `docs/courses/java/${chapter}/${article}`,
    ),
  ),
].sort()

const ARTICLE_PATHS = EXPECTED_JAVA_PATHS.filter((file) => file !== JAVA_INDEX_PATH)
// Chapters 01-10 are the completed quality-gated learning path. Chapters
// 11-12 remain the unchanged follow-up roadmap and are covered only by the
// global path/frontmatter/navigation guards.
const QUALITY_ARTICLE_PATHS = ARTICLE_PATHS.filter((file) =>
  QUALITY_CHAPTER_NAMES.some((chapter) => file.startsWith(`docs/courses/java/${chapter}/`)),
)

const REQUIRED_FRONTMATTER_FIELDS = ['title', 'description', 'category', 'tags']
const REQUIRED_SECTIONS = [
  '学习目标',
  '核心知识点',
  '简单案例',
  '易混点',
  '课后小问',
  '本节小结',
  '快速回顾',
]
const REQUIRED_CORE_SUBSECTIONS = ['专业术语', '白话解释与边界']

const BACKEND_SHARED_SECTIONS = [
  ...REQUIRED_SECTIONS,
  '常用用法',
  '不常用但需要知道',
]

const BACKEND_CROSS_LINKS = [
  '/courses/java/05-泛型与集合/04-List常用API',
  '/courses/java/05-泛型与集合/07-Map常用API',
  '/courses/java/02-数组与文本/02-String与文本处理',
]

const BACKEND_FORBIDDEN_TERMS = ['若依', 'RuoYi', '实践任务', '练习题', '面试常问']

function createBackendArticleSpec({ path, title, keywords, commonUsage, uncommonUsage }) {
  return {
    path,
    title,
    keywords,
    commonUsage,
    uncommonUsage,
    usageHeadings: [...commonUsage, ...uncommonUsage],
    sharedSections: [...BACKEND_SHARED_SECTIONS],
    coreSubsections: [...REQUIRED_CORE_SUBSECTIONS],
    crossLinks: [...BACKEND_CROSS_LINKS],
    forbiddenTerms: [...BACKEND_FORBIDDEN_TERMS],
  }
}

const BACKEND_ARTICLE_SPECS = [
  createBackendArticleSpec({
    path: 'docs/courses/java/13-后端工程/01-Spring-Boot启动与配置.md',
    title: 'Spring Boot 启动与配置',
    keywords: ['@SpringBootApplication', 'application.yml', '@ConfigurationProperties', 'ApplicationRunner', 'Environment'],
    commonUsage: ['@SpringBootApplication', 'application.yml', '@ConfigurationProperties'],
    uncommonUsage: ['条件装配', '启动失败定位', 'ApplicationRunner', 'Environment'],
  }),
  createBackendArticleSpec({
    path: 'docs/courses/java/13-后端工程/02-Spring-IoC与Bean生命周期.md',
    title: 'Spring IoC 与 Bean 生命周期',
    keywords: ['@Component', '@Service', '@Bean', '构造器注入', '@PostConstruct', '作用域', '代理对象'],
    commonUsage: ['@Component/@Service', '@Bean', '构造器注入', '@PostConstruct', '作用域', '代理对象'],
    uncommonUsage: ['ObjectProvider', '@Lazy', '@Primary'],
  }),
  createBackendArticleSpec({
    path: 'docs/courses/java/13-后端工程/03-Spring-AOP与声明式事务.md',
    title: 'Spring AOP 与声明式事务',
    keywords: ['@Aspect', '@Pointcut', '@Around', 'proceed', '@Transactional', '传播', '隔离', '回滚', '只读', '自调用'],
    commonUsage: ['@Aspect/@Pointcut', '@Around', 'proceed', '@Transactional', '传播/隔离/回滚/只读', '自调用'],
    uncommonUsage: ['@Order', 'TransactionTemplate', '回滚规则'],
  }),
  createBackendArticleSpec({
    path: 'docs/courses/java/13-后端工程/04-Spring-MVC与Servlet边界.md',
    title: 'Spring MVC 与 Servlet 边界',
    keywords: ['@RestController', '@RequestMapping', '@GetMapping', '@RequestBody', '响应体', '异常处理', 'Filter', 'Interceptor'],
    commonUsage: ['@RestController', '@RequestMapping/@GetMapping', '@RequestBody', '响应体', '异常处理', 'Filter/Interceptor'],
    uncommonUsage: ['ResponseEntity', 'OncePerRequestFilter', '拦截器顺序', 'Servlet request/response 生命周期'],
  }),
  createBackendArticleSpec({
    path: 'docs/courses/java/13-后端工程/05-Spring-Security与JWT.md',
    title: 'Spring Security 与 JWT',
    keywords: ['SecurityFilterChain', 'authorizeHttpRequests', '@PreAuthorize', 'BCrypt', 'Bearer', 'claims', '过期', '401', '403'],
    commonUsage: ['SecurityFilterChain', 'authorizeHttpRequests', '@PreAuthorize', 'BCrypt', 'Bearer token', 'claims/过期'],
    uncommonUsage: ['AuthenticationEntryPoint', 'AccessDeniedHandler', '测试替身'],
  }),
  createBackendArticleSpec({
    path: 'docs/courses/java/13-后端工程/06-MyBatis核心与MyBatis-Plus重点.md',
    title: 'MyBatis 核心与 MyBatis-Plus 重点',
    keywords: ['<select>', '<insert>', '#{}', '<if>', '<foreach>', '结果映射', 'BaseMapper', 'IService', 'QueryWrapper', '分页'],
    commonUsage: ['XML <select>/<insert>', '#{}', '动态 <if>/<foreach>', '结果映射'],
    uncommonUsage: ['BaseMapper', 'IService', 'QueryWrapper/LambdaQueryWrapper', '分页', '原生 XML 对照'],
  }),
  createBackendArticleSpec({
    path: 'docs/courses/java/13-后端工程/07-Jackson与Fastjson2-JSON.md',
    title: 'Jackson 与 Fastjson2 JSON',
    keywords: ['ObjectMapper', 'Jackson Databind', '@JsonFormat', '@JsonInclude', 'toJSONString', 'parseObject', '自定义序列化', 'Redis 序列化'],
    commonUsage: ['ObjectMapper/Jackson Databind', '@JsonFormat/@JsonInclude', 'Fastjson2 toJSONString/parseObject'],
    uncommonUsage: ['自定义序列化', 'Redis 序列化'],
  }),
  createBackendArticleSpec({
    path: 'docs/courses/java/13-后端工程/08-Bean-Validation参数校验.md',
    title: 'Bean Validation 参数校验',
    keywords: ['@NotBlank', '@Size', '@Valid', '@Validated', '级联', '分组', 'ConstraintValidator', '字段错误响应'],
    commonUsage: ['@NotBlank/@Size', '@Valid/@Validated', '级联', '分组'],
    uncommonUsage: ['ConstraintValidator', '字段错误响应', '转换/校验/授权职责'],
  }),
  createBackendArticleSpec({
    path: 'docs/courses/java/13-后端工程/09-SLF4J与Logback日志.md',
    title: 'SLF4J 与 Logback 日志',
    keywords: ['LoggerFactory', 'info', 'error', 'Logback', 'appender', '滚动', 'MDC', '脱敏', 'AOP 操作日志'],
    commonUsage: ['LoggerFactory', '参数化 info/error', 'Logback appender/滚动', 'MDC'],
    uncommonUsage: ['脱敏', 'AOP 操作日志', '采样/异常堆栈'],
  }),
  createBackendArticleSpec({
    path: 'docs/courses/java/13-后端工程/10-文件上传下载与资源安全.md',
    title: '文件上传下载与资源安全',
    keywords: ['MultipartFile', 'transferTo', '扩展名', '大小白名单', '路径规范化', '路径穿越', 'Content-Disposition', '流式下载'],
    commonUsage: ['MultipartFile', 'transferTo', '扩展名/大小白名单', '路径规范化', 'Content-Disposition', '流式下载'],
    uncommonUsage: ['路径穿越', '临时文件', '拒绝路径'],
  }),
  createBackendArticleSpec({
    path: 'docs/courses/java/13-后端工程/11-Apache-POI-Excel导入导出.md',
    title: 'Apache POI Excel 导入导出',
    keywords: ['WorkbookFactory', 'SXSSFWorkbook', '注解列映射', 'importExcel', 'exportExcel', '大文件', '日期', '公式', '资源释放'],
    commonUsage: ['WorkbookFactory', 'SXSSFWorkbook', '注解列映射', 'importExcel/exportExcel'],
    uncommonUsage: ['大文件', '日期/公式', '资源释放'],
  }),
  createBackendArticleSpec({
    path: 'docs/courses/java/13-后端工程/12-Quartz定时任务.md',
    title: 'Quartz 定时任务',
    keywords: ['Job', 'JobDetail', 'CronTrigger', 'Cron 表达式', 'misfire', '暂停/恢复', '@DisallowConcurrentExecution', '持久化表', '失败重试'],
    commonUsage: ['Job', 'JobDetail', 'CronTrigger', 'Cron 表达式', 'misfire', '暂停/恢复'],
    uncommonUsage: ['@DisallowConcurrentExecution', '持久化表', '失败重试', 'ScheduledExecutorService'],
  }),
  createBackendArticleSpec({
    path: 'docs/courses/java/13-后端工程/13-MySQL-8.0.md',
    title: 'MySQL 8.0',
    keywords: ['MySQL 8.0', 'DDL', '常用类型', '字符集', '索引', 'EXPLAIN', '事务', '行锁', 'CTE', '窗口函数'],
    commonUsage: ['MySQL 8.0', 'DDL/常用类型/字符集', '索引与 EXPLAIN'],
    uncommonUsage: ['事务/行锁', 'CTE/窗口函数', '时间类型与 JDBC 驱动', 'offset/keyset 分页', '批量写入'],
  }),
  createBackendArticleSpec({
    path: 'docs/courses/java/13-后端工程/14-Redis.md',
    title: 'Redis',
    keywords: ['RedisTemplate', 'opsForValue', 'Hash', 'List', 'Set', 'TTL', '序列化', 'Lua', '缓存一致性', '限流'],
    commonUsage: ['RedisTemplate.opsForValue', 'Hash/List/Set', 'TTL', '序列化'],
    uncommonUsage: ['Lua', '缓存一致性', '穿透/击穿/雪崩', '限流', '并发失败边界'],
  }),
]

const EXPECTED_BACKEND_TITLES_BY_FILENAME = new Map([
  ['01-Spring-Boot启动与配置.md', 'Spring Boot 启动与配置'],
  ['02-Spring-IoC与Bean生命周期.md', 'Spring IoC 与 Bean 生命周期'],
  ['03-Spring-AOP与声明式事务.md', 'Spring AOP 与声明式事务'],
  ['04-Spring-MVC与Servlet边界.md', 'Spring MVC 与 Servlet 边界'],
  ['05-Spring-Security与JWT.md', 'Spring Security 与 JWT'],
  ['06-MyBatis核心与MyBatis-Plus重点.md', 'MyBatis 核心与 MyBatis-Plus 重点'],
  ['07-Jackson与Fastjson2-JSON.md', 'Jackson 与 Fastjson2 JSON'],
  ['08-Bean-Validation参数校验.md', 'Bean Validation 参数校验'],
  ['09-SLF4J与Logback日志.md', 'SLF4J 与 Logback 日志'],
  ['10-文件上传下载与资源安全.md', '文件上传下载与资源安全'],
  ['11-Apache-POI-Excel导入导出.md', 'Apache POI Excel 导入导出'],
  ['12-Quartz定时任务.md', 'Quartz 定时任务'],
  ['13-MySQL-8.0.md', 'MySQL 8.0'],
  ['14-Redis.md', 'Redis'],
])
const EXPECTED_JDK20_PREVIEW_ARTICLES = [
  'docs/courses/java/04-现代Java类型/01-枚举record与sealed.md',
]

const QUICK_REFERENCE_SECTIONS = {
  'docs/courses/java/02-数组与文本/01-数组与多维数组.md': ['常用 API 速查'],
  'docs/courses/java/02-数组与文本/02-String与文本处理.md': [
    'String API 速查',
    '项目常用：Hutool JSONUtil',
  ],
  'docs/courses/java/05-泛型与集合/02-集合框架与数据结构.md': ['常用 API 速查'],
  'docs/courses/java/05-泛型与集合/03-Map与集合选择.md': ['常用 API 速查'],
}

const NEW_LOCK_ARTICLE_PATHS = [
  'docs/courses/java/09-并发编程/13-ReadWriteLock读写锁.md',
  'docs/courses/java/09-并发编程/14-StampedLock乐观读.md',
  'docs/courses/java/09-并发编程/15-LockSupport与锁选择.md',
]

// Keep version policy data-driven: add a rule here when a newer JDK API is
// discovered, and use the explicit allow pattern only for explanatory prose
// that compares a later JDK rather than using that API in a Java example.
const POST_JDK20_API_RULES = [
  {
    name: 'Sequenced Collections (JDK 21)',
    pattern: /\b(?:SequencedCollection|SequencedSet|SequencedMap)\b/gu,
    allow: /(?:JDK|Java)\s*21|JDK\s*20\s*(?:之后|以后)|更高版本|仅(?:作|供)对比/iu,
  },
  {
    name: 'String templates (JDK 21 preview)',
    pattern: /\bStringTemplate\b|\bSTR\./gu,
    allow: /(?:JDK|Java)\s*21|JDK\s*20\s*(?:之后|以后)|更高版本|仅(?:作|供)对比/iu,
  },
  {
    name: 'Scoped values (JDK 21 preview)',
    pattern: /\bScopedValue\b/gu,
    allow: /(?:JDK|Java)\s*21|JDK\s*20\s*(?:之后|以后)|更高版本|仅(?:作|供)对比/iu,
  },
]

function normalizePath(file) {
  return file.replaceAll('\\', '/')
}

function readMarkdown(relativePath) {
  const absolutePath = join(REPO_ROOT, ...relativePath.split('/'))
  const source = readFileSync(absolutePath, 'utf8')
  const parsed = matter(source)
  return {
    relativePath,
    source,
    data: parsed.data,
    body: parsed.content,
  }
}

function isMeaningfulField(value) {
  if (typeof value === 'string') return value.trim() !== ''
  if (Array.isArray(value)) return value.length > 0
  return value !== undefined && value !== null
}

function headingMatches(line, label) {
  const escapedLabel = label.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  return new RegExp(`^##\\s+${escapedLabel}(?:\\s|[:：，,（(]|$)`).test(line)
}

function getSection(body, label) {
  const lines = body.split(/\r?\n/)
  const start = lines.findIndex((line) => headingMatches(line, label))
  if (start < 0) return null

  const end = lines.findIndex((line, index) => index > start && /^##\s+/.test(line))
  return lines.slice(start + 1, end < 0 ? lines.length : end).join('\n').trim()
}

function getSectionsByLabel(body, label) {
  const lines = body.split(/\r?\n/)
  const starts = lines
    .map((line, index) => ({ line, index }))
    .filter(({ line }) => headingMatches(line, label))
    .map(({ index }) => index)

  return starts.map((start, index) => {
    const end = lines.findIndex((line, lineIndex) => lineIndex > start && /^##\s+/.test(line))
    return lines.slice(start + 1, end < 0 ? lines.length : end).join('\n').trim()
  })
}

function subsectionMatches(line, label) {
  const escapedLabel = label.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  const normalizedLine = line.replaceAll('&lt;', '<').replaceAll('&gt;', '>')
  return new RegExp(`^###\\s+${escapedLabel}(?:\\s|[:：，,（(]|$)`).test(normalizedLine)
}

function getSubsection(section, label) {
  if (section === null) return null
  const lines = section.split(/\r?\n/)
  const start = lines.findIndex((line) => subsectionMatches(line, label))
  if (start < 0) return null

  const end = lines.findIndex((line, index) => index > start && /^###\s+/.test(line))
  return lines.slice(start + 1, end < 0 ? lines.length : end).join('\n').trim()
}

function getQuickReferenceSubsections(body, sectionLabel) {
  return getSectionsByLabel(body, sectionLabel).flatMap((section) => {
    const lines = section.split(/\r?\n/)
    const starts = []

    lines.forEach((line, index) => {
      const match = line.match(/^(#{3,4})\s+(\S.*)$/)
      if (match) {
        starts.push({ index, level: match[1].length, heading: match[2].trim() })
      }
    })

    return starts
      .map((start, index) => ({
        heading: start.heading,
        level: start.level,
        content: lines
          .slice(start.index + 1, starts[index + 1]?.index ?? lines.length)
          .join('\n'),
      }))
      // A ### overview may own several #### API examples. Check the leaf
      // headings individually, while still checking a parent that has its own
      // Java block before any nested heading.
      .filter(({ content, level }, index) => {
        const next = starts[index + 1]
        const hasNestedHeading = next && next.level > level
        return !hasNestedHeading || getJavaBlocks(content).length > 0
      })
  })
}

function inspectUsageSubsection(content, { requireExplanation = false } = {}) {
  const lines = content.split(/\r?\n/)
  const firstContentIndex = lines.findIndex((line) => line.trim() !== '')
  if (firstContentIndex < 0) return ['needs a java code block']

  const firstContentLine = lines[firstContentIndex].trim()
  if (firstContentLine === '```java') {
    return requireExplanation
      ? ['needs a concise what/when explanation before the java code block']
      : []
  }

  const codeIndex = lines.findIndex(
    (line, index) => index >= firstContentIndex && line.trim() === '```java',
  )
  if (codeIndex < 0) return ['needs a java code block after the explanation']

  const explanation = lines
    .slice(firstContentIndex, codeIndex)
    .filter((line) => line.trim() !== '')
    .join(' ')
  const plainExplanation = stripMarkdown(explanation)
  if (plainExplanation.length < 12) return ['needs a concise what/when explanation before the java code block']
  if (plainExplanation.length > 220) return ['explanation before the java code block is too long']
  if (!/(?:用于|适合|不适合|需要|保证|避免|表示|返回|创建|读取|写入|阻塞|唤醒|保护|转换|选择|当|用|使用|运行|启动|编译|查看|定位|指向|调用|判断|处理|不要|先|循环|优先|必须|比较|索引|复制|排序|查找|遍历|构造|解析|校验|匹配|共享|范围|长度|字段|元素|线程|锁|异常|类型|状态|条件|结果|参数|失败|成功|配置|限制|允许|支持|区分|超过|释放|重试|关闭|恢复|抛|入口|关联|延长|改善|编码|权限|归档|目录|时间|版本|签名|保留|接口|依赖|注册|推进|固定|数据|采样|趋势|含义|检查|迁移|风险|安全)/u.test(plainExplanation)) {
    return ['explanation before the java code block must state what/when or a key boundary']
  }
  return []
}

function removeFencedCode(text) {
  const lines = text.split(/\r?\n/)
  const visibleLines = []
  let inFence = false

  for (const line of lines) {
    if (/^\s*```/.test(line)) {
      inFence = !inFence
      continue
    }
    if (!inFence) visibleLines.push(line)
  }
  return visibleLines.join('\n')
}

function getMarkdownLinkDestinations(text) {
  const visibleText = removeFencedCode(text)
  return [...visibleText.matchAll(/\[[^\]\r\n]+\]\(\s*(\/courses\/java\/[^)#\s]+)(?:#[^)#\s]*)?\s*\)/g)].map(
    (match) => match[1],
  )
}

function stripMarkdown(text) {
  return removeFencedCode(text)
    .replace(/`([^`]+)`/g, '$1')
    .replace(/[*_>#]/g, '')
    .replace(/^\s*[-*+]\s+/gm, '')
    .replace(/\s+/g, '')
    .trim()
}

function hasConcreteExplanation(text, minimumLength = 20) {
  const plainText = stripMarkdown(text)
  return (
    plainText.length >= minimumLength &&
    /(?:因为|因此|区别|差异|而不是|适合|不适合|不能|不应|应当|优先|边界|否则|避免|相比|用于|表示|返回|异常|如果)/u.test(
      plainText,
    )
  )
}

function hasProfessionalTerm(text) {
  return (
    stripMarkdown(text).length >= 4 &&
    /`[^`]+`|\b[A-Za-z][A-Za-z0-9_.]*(?:\([^)]*\))?\b/u.test(text)
  )
}

function getTopLevelListItems(text) {
  return removeFencedCode(text)
    .split(/\r?\n/)
    .filter((line) => /^[-*+]\s+\S/.test(line))
    .map((line) => line.replace(/^[-*+]\s+/, '').trim())
}

function getJavaBlocks(text) {
  return [...text.matchAll(/```java[^\r\n]*\r?\n([\s\S]*?)```/gi)].map((match) => match[1])
}

function getBackendCodeBlocks(text) {
  return [...text.matchAll(/```(java|sql)[^\r\n]*\r?\n([\s\S]*?)```/gi)].map((match) => ({
    language: match[1].toLowerCase(),
    code: match[2],
  }))
}

function stripBackendComments(code) {
  return code
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/^\s*(?:\/\/|--|#).*$/gmu, '')
    .replace(/^\s*\*.*$/gmu, '')
    .trim()
}

function hasStandaloneOutputComment(code) {
  return /^\s*\/\/\s*输出\s*[:：]\s*\S.*$/mu.test(code)
}

function hasStandaloneBackendOutputComment(code) {
  return /^\s*(?:\/\/|--)\s*输出\s*[:：]\s*\S.*$/mu.test(code)
}

function inspectBackendUsage(content, { requireOutput = true } = {}) {
  if (typeof content !== 'string' || content.trim() === '') return ['usage subsection is empty']

  const lines = content.split(/\r?\n/)
  const firstCodeIndex = lines.findIndex((line) => /^\s*```(?:java|sql)(?:\s|$)/iu.test(line))
  const purposeIndex = lines.findIndex((line) => /^\s*用途\s*[:：]\s*\S/u.test(line))
  const blocks = getBackendCodeBlocks(content)
  const issues = []

  if (purposeIndex < 0) {
    issues.push('needs a 用途： purpose/boundary sentence')
  } else if (firstCodeIndex >= 0 && purposeIndex > firstCodeIndex) {
    issues.push('用途： purpose/boundary sentence must precede the code block')
  } else {
    const purposeText = stripMarkdown(
      lines[purposeIndex].replace(/^\s*用途\s*[:：]\s*/u, ''),
    )
    if (purposeText.length < 12) {
      issues.push('用途： purpose/boundary sentence must contain at least 12 meaningful characters')
    }
  }

  if (firstCodeIndex < 0 || blocks.length === 0) {
    issues.push('needs a java or sql code block')
  } else {
    for (const { code } of blocks) {
      if (stripBackendComments(code) === '') {
        issues.push('java/sql code block must contain at least one real code line')
      }
    }
  }

  if (requireOutput && !blocks.some(({ code }) => hasStandaloneBackendOutputComment(code))) {
    issues.push('needs a standalone // 输出： or -- 输出： comment')
  }

  return issues
}

function inspectBackendArticle(article, spec) {
  const violations = []
  if (!article || !spec) return ['article and specification are required']

  for (const field of REQUIRED_FRONTMATTER_FIELDS) {
    if (!isMeaningfulField(article.data?.[field])) {
      violations.push(`${spec.path} [frontmatter.${field}] is missing or empty`)
    }
  }
  if (article.data?.title !== spec.title) {
    violations.push(`${spec.path} [title] expected ${spec.title}`)
  }

  for (const section of spec.sharedSections ?? BACKEND_SHARED_SECTIONS) {
    const content = getSection(article.body, section)
    if (content === null) {
      violations.push(`${spec.path} [section:${section}] heading is missing`)
    } else if (content === '') {
      violations.push(`${spec.path} [section:${section}] body is empty`)
    }
  }

  const coreKnowledge = getSection(article.body, '核心知识点')
  for (const subsection of spec.coreSubsections ?? REQUIRED_CORE_SUBSECTIONS) {
    if (getSubsection(coreKnowledge, subsection) === null) {
      violations.push(`${spec.path} [core:${subsection}] subsection is missing`)
    }
  }

  for (const keyword of spec.keywords ?? []) {
    if (!article.body.includes(keyword)) {
      violations.push(`${spec.path} [keyword:${keyword}] is missing`)
    }
  }

  for (const sectionLabel of ['常用用法', '不常用但需要知道']) {
    const sections = getSectionsByLabel(article.body, sectionLabel)
    if (sections.length === 0) {
      violations.push(`${spec.path} [usage:${sectionLabel}] heading is missing`)
      continue
    }
    for (const subsection of getQuickReferenceSubsections(article.body, sectionLabel)) {
      for (const issue of inspectBackendUsage(subsection.content)) {
        violations.push(`${spec.path} [usage:${sectionLabel}/${subsection.heading}] ${issue}`)
      }
    }
  }

  for (const heading of [...(spec.commonUsage ?? []), ...(spec.uncommonUsage ?? [])]) {
    const sectionLabel = spec.commonUsage?.includes(heading) ? '常用用法' : '不常用但需要知道'
    const section = getSection(article.body, sectionLabel)
    if (getSubsection(section, heading) === null) {
      violations.push(`${spec.path} [usage-heading:${sectionLabel}/${heading}] heading is missing`)
    }
  }

  const articleLinks = new Set(getMarkdownLinkDestinations(article.body))
  for (const link of spec.crossLinks ?? []) {
    if (!articleLinks.has(link)) {
      violations.push(`${spec.path} [cross-link:${link}] link is missing`)
    }
  }

  for (const forbiddenTerm of spec.forbiddenTerms ?? []) {
    if (article.body.includes(forbiddenTerm)) {
      violations.push(`${spec.path} [forbidden:${forbiddenTerm}] forbidden term found`)
    }
  }

  return violations
}

function createBackendInspectorFixture() {
  const spec = {
    path: 'docs/courses/java/13-后端工程/00-runtime-fixture.md',
    title: 'Backend Runtime Fixture',
    keywords: ['DemoApi'],
    commonUsage: ['DemoApi'],
    uncommonUsage: ['RareApi'],
    sharedSections: [...BACKEND_SHARED_SECTIONS],
    coreSubsections: [...REQUIRED_CORE_SUBSECTIONS],
    crossLinks: [...BACKEND_CROSS_LINKS],
    forbiddenTerms: [...BACKEND_FORBIDDEN_TERMS],
  }
  const body = `## 学习目标

- 能够辨认后端用法契约。

## 核心知识点

### 专业术语

\`DemoApi\` 是一个测试用 API。

### 白话解释与边界

用途：用于说明检查器如何区分结构、代码和边界。

## 常用用法

### DemoApi：运行 Java 示例

用途：用于展示一个可运行的 Java 用法与边界。

\`\`\`java
class Demo {
}
// 输出：运行成功
\`\`\`

## 不常用但需要知道

### RareApi：运行 SQL 示例

用途：用于展示一个较少使用但仍需验证的 SQL 边界。

\`\`\`sql
SELECT 1;
-- 输出：1
\`\`\`

## 简单案例

把结构、用途和输出放在同一篇文章中。

## 易混点

用途说明不是代码输出，二者必须分开。

## 课后小问

1. 哪一行是用途说明？

答案：用途行。

解析：它位于代码块之前。

## 本节小结

- 结构清晰且可检查。

## 快速回顾

- 用途、代码和输出缺一不可。

[List 基础](/courses/java/05-泛型与集合/04-List常用API)
[Map 基础](/courses/java/05-泛型与集合/07-Map常用API)
[String 基础](/courses/java/02-数组与文本/02-String与文本处理)
`
  return {
    spec,
    article: {
      data: {
        title: spec.title,
        description: '用于直接运行检查器单元测试。',
        category: 'Java 后端',
        tags: ['Java'],
      },
      body,
    },
  }
}

function stripJavaComments(code) {
  return code
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/^\s*\/\/.*$/gm, '')
    .replace(/^\s*\*.*$/gm, '')
    .trim()
}

function inspectJavaCase(section) {
  const blocks = getJavaBlocks(section ?? '')
  if (blocks.length === 0) return ['needs a java code block']

  const executableBlocks = blocks.map(stripJavaComments).filter((code) => code !== '')
  if (executableBlocks.length === 0) return ['java code block contains comments only']

  const hasTypeDeclaration = executableBlocks.some((code) =>
    /\b(?:class|record|interface|enum)\s+[A-Za-z_$][\w$]*/.test(code),
  )
  const hasObservableResult = executableBlocks.some((code) =>
    /\bSystem\.out\.(?:print|println|printf)\s*\(/.test(code),
  )
  const issues = []
  if (!hasTypeDeclaration) issues.push('case needs a type declaration')
  if (!hasObservableResult) issues.push('case needs an observable System.out result')
  return issues
}

function matchesPattern(pattern, text) {
  pattern.lastIndex = 0
  return pattern.test(text)
}

function inspectPostJdk20Apis(body) {
  const lines = body.split(/\r?\n/)
  const violations = []
  let inFence = false

  lines.forEach((line, index) => {
    if (/^\s*```/.test(line)) {
      inFence = !inFence
      return
    }
    for (const rule of POST_JDK20_API_RULES) {
      if (!matchesPattern(rule.pattern, line)) continue
      const context = lines
        .slice(Math.max(0, index - 1), Math.min(lines.length, index + 2))
        .join(' ')
      if (inFence || !rule.allow.test(context)) {
        violations.push(`${rule.name} at line ${index + 1}`)
      }
    }
  })
  return violations
}

function getQuestionChunks(section) {
  if (section === null) return []
  const lines = section.split(/\r?\n/)
  const starts = []
  let inFence = false

  lines.forEach((line, index) => {
    if (/^\s*```/.test(line)) {
      inFence = !inFence
      return
    }
    // Questions are top-level ordered-list items. Indented numbered examples
    // are deliberately not questions.
    if (!inFence && /^\d+\.\s+\S/.test(line)) starts.push(index)
  })

  return starts.map((start, index) =>
    lines.slice(start, starts[index + 1] ?? lines.length).join('\n').trim(),
  )
}

function inspectQuestionBlock(chunk) {
  const lines = chunk.split(/\r?\n/)
  const firstLine = lines.findIndex((line) => line.trim() !== '')
  if (firstLine < 0) return ['question is empty']

  const answerLine = lines.findIndex(
    (line, index) => index > firstLine && /^\s*[-*+]?\s*答案\s*[:：]\s*\S/.test(line),
  )
  const explanationLine = lines.findIndex(
    (line, index) => index > (answerLine < 0 ? firstLine : answerLine) && /^\s*[-*+]?\s*解析\s*[:：]\s*\S/.test(line),
  )
  const issues = []
  const firstContentAfterQuestion = lines.findIndex(
    (line, index) => index > firstLine && line.trim() !== '',
  )
  if (
    answerLine < 0 ||
    firstContentAfterQuestion < 0 ||
    answerLine !== firstContentAfterQuestion
  ) {
    issues.push('answer must immediately follow its question')
  }
  if (explanationLine < 0 || explanationLine <= answerLine) {
    issues.push('explanation must follow the answer in the same question block')
  } else {
    const firstContentAfterAnswer = lines.findIndex(
      (line, index) => index > answerLine && line.trim() !== '',
    )
    if (explanationLine !== firstContentAfterAnswer) {
      issues.push('explanation must immediately follow its answer')
    }
  }
  return issues
}

function relativeRoute(relativePath) {
  return `/${relativePath.replace(/^docs\//, '').replace(/\.md$/, '')}`
}

function formatViolations(violations) {
  return violations.length === 0 ? '' : `\n${violations.join('\n')}`
}

test('backend article specification manifest covers 14 planned pages', () => {
  assert.equal(BACKEND_ARTICLE_SPECS.length, 14, 'rule backend-manifest-count: expected 14 planned pages')

  const paths = BACKEND_ARTICLE_SPECS.map((spec) => spec.path)
  assert.equal(new Set(paths).size, paths.length, 'rule backend-manifest-paths: planned paths must be unique')
  assert.equal(new Set(BACKEND_CROSS_LINKS).size, 3, 'rule backend-cross-links: expected three unique basic targets')
  const actualTitlesByFilename = new Map(
    BACKEND_ARTICLE_SPECS.map((spec) => [spec.path.split('/').pop(), spec.title]),
  )
  assert.deepEqual(
    actualTitlesByFilename,
    EXPECTED_BACKEND_TITLES_BY_FILENAME,
    'rule backend-manifest-title-map: planned filenames must keep their exact titles',
  )

  for (const spec of BACKEND_ARTICLE_SPECS) {
    assert.match(
      spec.path,
      /^docs\/courses\/java\/13-后端工程\/[^/]+\.md$/u,
      `rule backend-manifest-path: ${spec.path} must be a chapter 13 Markdown path`,
    )
    assert.ok(spec.title, `rule backend-manifest-title: ${spec.path} needs a title`)
    assert.ok(spec.keywords?.length > 0, `rule backend-manifest-keywords: ${spec.path} needs API keywords`)
    assert.ok(spec.commonUsage?.length > 0, `rule backend-manifest-common-usage: ${spec.path} needs common usage keywords`)
    assert.ok(spec.uncommonUsage?.length > 0, `rule backend-manifest-uncommon-usage: ${spec.path} needs uncommon usage keywords`)
    assert.equal(
      new Set(spec.crossLinks).size,
      spec.crossLinks.length,
      `rule backend-manifest-cross-links: ${spec.path} has duplicate basic links`,
    )
    assert.deepEqual(
      [...spec.crossLinks].sort(),
      [...BACKEND_CROSS_LINKS].sort(),
      `rule backend-manifest-cross-links: ${spec.path} must declare all basic link targets`,
    )
  }
})

test('backend inspectors execute direct pass and failure fixtures', () => {
  const { article, spec } = createBackendInspectorFixture()

  assert.deepEqual(inspectBackendUsage(getSection(article.body, '常用用法')), [], 'backend usage fixture should pass')
  assert.deepEqual(inspectBackendArticle(article, spec), [], 'backend article fixture should pass')

  const missingPurpose = inspectBackendUsage(`### DemoApi

\`\`\`java
class Demo {
}
// 输出：运行成功
\`\`\``)
  assert.ok(missingPurpose.some((issue) => issue.includes('用途')), 'missing purpose must be reported')

  const commentsOnly = inspectBackendUsage(`用途：用于展示一个足够长的边界说明。

\`\`\`java
// 这里只有注释
/* 仍然没有真实代码 */
// 输出：没有执行
\`\`\``)
  assert.ok(
    commentsOnly.some((issue) => issue.includes('real code line')),
    'comment-only code blocks must be rejected',
  )

  const sqlCommentsOnly = inspectBackendUsage(`用途：用于展示一个足够长的边界说明。

\`\`\`sql
-- 这里只有注释
# 仍然没有真实代码
/* 输出也只是注释 */
\`\`\``)
  assert.ok(
    sqlCommentsOnly.some((issue) => issue.includes('real code line')),
    'SQL comment-only code blocks must be rejected',
  )

  const missingOutput = inspectBackendUsage(`用途：用于展示一个足够长的边界说明。

\`\`\`sql
SELECT 1;
\`\`\``)
  assert.ok(missingOutput.some((issue) => issue.includes('standalone')), 'missing standalone output must be reported')

  const shortPurpose = inspectBackendUsage(`用途：太短

\`\`\`java
class Demo {
}
// 输出：运行成功
\`\`\``)
  assert.ok(shortPurpose.some((issue) => issue.includes('at least 12')), 'short purpose must be rejected')

  const forbiddenArticle = {
    ...article,
    body: `${article.body}\n若依`,
  }
  assert.ok(
    inspectBackendArticle(forbiddenArticle, spec).some((issue) => issue.includes('[forbidden:若依]')),
    'forbidden terms must be reported',
  )

  const link = BACKEND_CROSS_LINKS[0]
  const missingLinkArticle = {
    ...article,
    body: article.body
      .replace(`[List 基础](${link})`, '')
      .concat(`\n\`\`\`java\nString fake = "[伪链接](${link})";\n// 输出：伪链接\n\`\`\`\n伪文本](${link})`),
  }
  assert.ok(
    inspectBackendArticle(missingLinkArticle, spec).some((issue) => issue.includes(`[cross-link:${link}]`)),
    'code-block and plain-text pseudo links must not satisfy a missing Markdown link',
  )
})

test('Spring backend batch exposes four article paths and content contracts', () => {
  const batchSpecs = BACKEND_ARTICLE_SPECS.filter((spec) =>
    /\/13-后端工程\/0[1-4]-/u.test(spec.path),
  )
  assert.equal(batchSpecs.length, 4, 'rule backend-batch1-manifest: expected four Spring pages')

  const violations = []
  for (const spec of batchSpecs) {
    try {
      const article = readMarkdown(spec.path)
      for (const issue of inspectBackendArticle(article, spec)) {
        violations.push(issue)
      }
    } catch (error) {
      violations.push(`${spec.path} [article-read] ${error.message}`)
    }
  }

  assert.deepEqual(
    violations,
    [],
    `rule backend-batch1-contract${formatViolations(violations)}`,
  )
})

test('Spring backend references document runtime boundaries and compatibility baselines', () => {
  const batchSpecs = BACKEND_ARTICLE_SPECS.filter((spec) =>
    /\/13-后端工程\/0[1-4]-/u.test(spec.path),
  )
  const violations = []
  const articles = new Map()

  for (const spec of batchSpecs) {
    try {
      const article = readMarkdown(spec.path)
      articles.set(spec.path, article.body)
      for (const requiredText of [
        'JDK 20',
        'Java 17',
        'Spring Boot 4.1.0',
        'Spring Framework 7',
        'jakarta.*',
        'javax.*',
        '框架片段需容器运行',
      ]) {
        if (!article.body.includes(requiredText)) {
          violations.push(`${spec.path} [compatibility:${requiredText}] is missing`)
        }
      }
    } catch (error) {
      violations.push(`${spec.path} [article-read] ${error.message}`)
    }
  }

  const iocBody = articles.get('docs/courses/java/13-后端工程/02-Spring-IoC与Bean生命周期.md') ?? ''
  for (const requiredText of ['ProxyFactory', 'AopUtils.isAopProxy', 'AnnotationConfigApplicationContext', 'getBean(']) {
    if (!iocBody.includes(requiredText)) {
      violations.push(`docs/courses/java/13-后端工程/02-Spring-IoC与Bean生命周期.md [runtime:${requiredText}] is missing`)
    }
  }

  const mvcBody = articles.get('docs/courses/java/13-后端工程/04-Spring-MVC与Servlet边界.md') ?? ''
  for (const requiredText of ['flushBuffer()', 'isCommitted()', '输出：req-7/true']) {
    if (!mvcBody.includes(requiredText)) {
      violations.push(`docs/courses/java/13-后端工程/04-Spring-MVC与Servlet边界.md [servlet:${requiredText}] is missing`)
    }
  }

  assert.deepEqual(
    violations,
    [],
    `rule backend-runtime-boundaries${formatViolations(violations)}`,
  )
})

test('persistence backend batch exposes MyBatis MySQL and Redis contracts', () => {
  const batchSpecs = BACKEND_ARTICLE_SPECS.filter((spec) =>
    /\/13-后端工程\/(?:06-|13-|14-)/u.test(spec.path),
  )
  assert.equal(batchSpecs.length, 3, 'rule backend-batch2-manifest: expected three persistence pages')

  const violations = []
  for (const spec of batchSpecs) {
    try {
      const article = readMarkdown(spec.path)
      for (const issue of inspectBackendArticle(article, spec)) {
        violations.push(issue)
      }
    } catch (error) {
      violations.push(`${spec.path} [article-read] ${error.message}`)
    }
  }

  assert.deepEqual(
    violations,
    [],
    `rule backend-batch2-contract${formatViolations(violations)}`,
  )
})

test('persistence backend batch keeps MyBatis source boundary and database keywords', () => {
  const articles = new Map()
  const violations = []

  for (const relativePath of [
    'docs/courses/java/13-后端工程/06-MyBatis核心与MyBatis-Plus重点.md',
    'docs/courses/java/13-后端工程/13-MySQL-8.0.md',
    'docs/courses/java/13-后端工程/14-Redis.md',
  ]) {
    try {
      articles.set(relativePath, readMarkdown(relativePath).body)
    } catch (error) {
      violations.push(`${relativePath} [article-read] ${error.message}`)
    }
  }

  const myBatisBody = articles.get('docs/courses/java/13-后端工程/06-MyBatis核心与MyBatis-Plus重点.md') ?? ''
  for (const requiredText of [
    '<select>', '<insert>', '#{}', '<if>', '<foreach>', '结果映射',
    'BaseMapper', 'QueryWrapper', '分页', '原生 XML',
    '@TableId', 'IdType.AUTO', 'getId', 'setId', 'getStatus', 'setStatus',
    'getCreatedAt', 'setCreatedAt', 'useGeneratedKeys', 'keyProperty',
  ]) {
    if (!myBatisBody.includes(requiredText)) {
      violations.push(`docs/courses/java/13-后端工程/06-MyBatis核心与MyBatis-Plus重点.md [keyword:${requiredText}] is missing`)
    }
  }

  const mysqlBody = articles.get('docs/courses/java/13-后端工程/13-MySQL-8.0.md') ?? ''
  for (const requiredText of ['MySQL 8.0', 'EXPLAIN']) {
    if (!mysqlBody.includes(requiredText)) {
      violations.push(`docs/courses/java/13-后端工程/13-MySQL-8.0.md [keyword:${requiredText}] is missing`)
    }
  }

  const redisBody = articles.get('docs/courses/java/13-后端工程/14-Redis.md') ?? ''
  for (const requiredText of ['RedisTemplate', 'opsForValue', 'TTL', 'Lua']) {
    if (!redisBody.includes(requiredText)) {
      violations.push(`docs/courses/java/13-后端工程/14-Redis.md [keyword:${requiredText}] is missing`)
    }
  }

  assert.doesNotMatch(
    myBatisBody,
    /(?:源码|当前).{0,20}MyBatis-Plus/u,
    'MyBatis-Plus must remain an independent example and not be claimed as current source usage',
  )
  assert.doesNotMatch(
    myBatisBody,
    /User::(?:status|createdAt)/u,
    'LambdaQueryWrapper must use JavaBean getter references rather than record accessors',
  )
  assert.doesNotMatch(
    myBatisBody,
    /record User\(/u,
    'MyBatis-Plus save example must use a writable JavaBean entity',
  )
  assert.doesNotMatch(
    myBatisBody,
    /service\.save\(new User\(/u,
    'MyBatis-Plus save example must allow generated id backfill before reading it',
  )
  assert.doesNotMatch(
    myBatisBody,
    /\\\$\{\}/u,
    'MyBatis parameter explanation must not contain an escaped dollar typo',
  )

  for (const requiredText of [
    '8.0.18+', 'EXPLAIN ANALYZE', '真实执行', '8.0.20+', 'AS new',
    '左前缀', '等值', '排序',
  ]) {
    if (!mysqlBody.includes(requiredText)) {
      violations.push(`docs/courses/java/13-后端工程/13-MySQL-8.0.md [review:${requiredText}] is missing`)
    }
  }

  for (const requiredText of [
    'StringRedisTemplate', 'KEYS', 'ARGV', 'Long', 'setKeySerializer',
    'setValueSerializer', 'setHashKeySerializer', 'setHashValueSerializer',
    '@TransactionalEventListener', 'AFTER_COMMIT',
    'TransactionPhase',
  ]) {
    if (!redisBody.includes(requiredText)) {
      violations.push(`docs/courses/java/13-后端工程/14-Redis.md [review:${requiredText}] is missing`)
    }
  }

  assert.deepEqual(
    violations,
    [],
    `rule backend-persistence-keywords${formatViolations(violations)}`,
  )

  assert.doesNotMatch(
    mysqlBody,
    /ON DUPLICATE KEY UPDATE\s+balance\s*=\s*VALUES\(balance\)/u,
    'MySQL upsert example must use the row alias syntax in executable SQL',
  )
  assert.match(
    redisBody,
    /StringRedisTemplate redis = stringRedisTemplate;\s+String lua =[\s\S]*?java\.util\.List<String> keys[\s\S]*?Long allowed = redis\.execute\(script, keys, amount\)/u,
    'Redis Lua example must bind string KEYS/ARGV and a Long result through StringRedisTemplate',
  )
  assert.match(
    redisBody,
    /events\.publishEvent\(new UserStatusChanged\(id\)\)[\s\S]*?@TransactionalEventListener\(phase = TransactionPhase\.AFTER_COMMIT\)/u,
    'Redis invalidation example must publish an event and evict only after commit',
  )
})

test('Java course keeps the expected Markdown files, article counts, chapters, and baseline paths', () => {
  const markdownPaths = fg
    .sync(JAVA_GLOB, { cwd: REPO_ROOT, onlyFiles: true })
    .map(normalizePath)
    .sort()
  const chapterDirectories = readdirSync(JAVA_ROOT, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .sort()

  assert.equal(
    markdownPaths.length,
    EXPECTED_JAVA_PATHS.length,
    `rule java-markdown-count: expected ${EXPECTED_JAVA_PATHS.length} Markdown files`,
  )
  assert.equal(
    markdownPaths.filter((file) => file !== JAVA_INDEX_PATH).length,
    ARTICLE_PATHS.length,
    `rule java-article-count: expected ${ARTICLE_PATHS.length} course articles`,
  )
  assert.equal(
    chapterDirectories.length,
    CHAPTER_NAMES.length,
    `rule java-chapter-count: expected ${CHAPTER_NAMES.length} chapter directories`,
  )
  assert.deepEqual(
    chapterDirectories,
    [...CHAPTER_NAMES].sort(),
    'rule java-chapter-paths: chapter directory set changed',
  )
  assert.deepEqual(
    chapterDirectories.map((chapter) => EXPECTED_ARTICLES_BY_CHAPTER[chapter].length),
    CHAPTER_NAMES.map((chapter) => EXPECTED_ARTICLES_BY_CHAPTER[chapter].length),
    'rule java-chapter-article-counts: chapter article counts changed',
  )
  assert.deepEqual(
    markdownPaths,
    EXPECTED_JAVA_PATHS,
    'rule java-path-baseline: Java Markdown path set changed',
  )
})

test('Java articles keep the required frontmatter fields', () => {
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

  assert.deepEqual(violations, [], `rule java-frontmatter${formatViolations(violations)}`)
})

test('01-10 Java articles use the shared quality structure and runnable examples', () => {
  const violations = []

  for (const relativePath of QUALITY_ARTICLE_PATHS) {
    let article
    try {
      article = readMarkdown(relativePath)
    } catch (error) {
      violations.push(`${relativePath} [article-read] ${error.message}`)
      continue
    }

    for (const section of REQUIRED_SECTIONS) {
      const content = getSection(article.body, section)
      if (content === null) {
        violations.push(`${relativePath} [section:${section}] heading is missing`)
      } else if (content === '') {
        violations.push(`${relativePath} [section:${section}] body is empty`)
      } else if (
        ['本节小结', '快速回顾'].includes(section) &&
        !/^\s*[-*+]\s+\S/m.test(content)
      ) {
        violations.push(`${relativePath} [section:${section}] needs a plain Markdown list`)
      } else if (section === '易混点' && !hasConcreteExplanation(content, 12)) {
        violations.push(`${relativePath} [section:易混点] needs a concrete comparison or boundary explanation`)
      } else if (['本节小结', '快速回顾'].includes(section)) {
        const items = getTopLevelListItems(content)
        const minimum = section === '本节小结' ? 3 : 3
        const maximum = section === '本节小结' ? 5 : 6
        if (items.length < minimum || items.length > maximum) {
          violations.push(
            `${relativePath} [section:${section}] needs ${minimum}-${maximum} top-level list items, found ${items.length}`,
          )
        }
        if (items.some((item) => stripMarkdown(item).length < 8)) {
          violations.push(`${relativePath} [section:${section}] contains a vague list item`)
        }
      }
    }

    const coreKnowledge = getSection(article.body, '核心知识点')
    for (const subsection of REQUIRED_CORE_SUBSECTIONS) {
      const content = getSubsection(coreKnowledge, subsection)
      if (content === null) {
        violations.push(`${relativePath} [core:${subsection}] subsection is missing`)
      } else if (content === '') {
        violations.push(`${relativePath} [core:${subsection}] body is empty`)
      } else if (subsection === '专业术语' && !hasProfessionalTerm(content)) {
        violations.push(`${relativePath} [core:专业术语] needs a Java API or English term`)
      } else if (subsection === '白话解释与边界' && !hasConcreteExplanation(content)) {
        violations.push(`${relativePath} [core:白话解释与边界] needs a concrete plain-language explanation`)
      }
    }

    for (const issue of inspectJavaCase(getSection(article.body, '简单案例'))) {
      violations.push(`${relativePath} [java-example] ${issue}`)
    }
  }

  assert.deepEqual(violations, [], `rule java-article-structure${formatViolations(violations)}`)
})

test('01-10 Java articles expose usage headings with explained Java examples', () => {
  const violations = []

  for (const relativePath of QUALITY_ARTICLE_PATHS) {
    let article
    try {
      article = readMarkdown(relativePath)
    } catch (error) {
      violations.push(`${relativePath} [article-read] ${error.message}`)
      continue
    }

    for (const sectionLabel of ['常用用法', '不常用但需要知道']) {
      const sections = getSectionsByLabel(article.body, sectionLabel)
      if (sections.length === 0) {
        violations.push(`${relativePath} [usage:${sectionLabel}] heading is missing`)
        continue
      }

      for (const subsection of getQuickReferenceSubsections(article.body, sectionLabel)) {
        for (const issue of inspectUsageSubsection(subsection.content, { requireExplanation: true })) {
          violations.push(`${relativePath} [usage:${sectionLabel}/${subsection.heading}] ${issue}`)
        }
      }
    }
  }

  assert.deepEqual(violations, [], `rule java-usage-headings${formatViolations(violations)}`)
})

test('01-10 Java articles provide two answered review questions and no deprecated task markers', () => {
  const violations = []
  const forbiddenPatterns = [
    { rule: 'checkbox', pattern: /^\s*[-*+]\s*\[[ xX]\](?:\s|$)/m },
    { rule: 'checkbox-unicode', pattern: /[☐☑]/u },
    { rule: '实践任务', pattern: /实践任务/u },
    { rule: '练习题', pattern: /练习题/u },
    { rule: '面试常问', pattern: /面试常问/u },
    { rule: 'deprecated-review-heading', pattern: /^##\s+复习清单(?:\s|$)/mu },
    { rule: 'placeholder', pattern: /\b(?:TODO|FIXME|TBD)\b|待补(?:充)?|占位|未完成(?:内容|正文|案例|部分|章节|$)|后续补充|自行查阅|^\s*略\s*$/imu },
  ]

  for (const relativePath of QUALITY_ARTICLE_PATHS) {
    let article
    try {
      article = readMarkdown(relativePath)
    } catch (error) {
      violations.push(`${relativePath} [article-read] ${error.message}`)
      continue
    }
    const questions = getQuestionChunks(getSection(article.body, '课后小问'))
    if (questions.length < 2) {
      violations.push(`${relativePath} [review-question-count] expected at least 2 questions, found ${questions.length}`)
    }
    questions.forEach((question, index) => {
      for (const issue of inspectQuestionBlock(question)) {
        violations.push(`${relativePath} [review-question-${index + 1}] ${issue}`)
      }
    })

    for (const { rule, pattern } of forbiddenPatterns) {
      if (pattern.test(article.body)) {
        violations.push(`${relativePath} [forbidden:${rule}] deprecated or placeholder content found`)
      }
    }
  }

  const index = readMarkdown(JAVA_INDEX_PATH)
  if (/实践任务/u.test(index.body)) {
    violations.push(`${JAVA_INDEX_PATH} [forbidden:实践任务] entry page still advertises deprecated practice tasks`)
  }

  assert.deepEqual(violations, [], `rule java-review-and-forbidden-content${formatViolations(violations)}`)
})

test('All expected Java pages keep Java cross-links free of dead routes', () => {
  const articleRoutes = new Set(ARTICLE_PATHS.map(relativeRoute))
  const brokenLinks = []
  let linkCount = 0

  for (const relativePath of [JAVA_INDEX_PATH, ...ARTICLE_PATHS]) {
    const { body } = readMarkdown(relativePath)
    for (const match of body.matchAll(/\]\((\/courses\/java\/[^)#\s]+)(?:#[^)]*)?\)/g)) {
      linkCount += 1
      if (!articleRoutes.has(match[1])) {
        brokenLinks.push(`${relativePath} -> ${match[1]}`)
      }
    }
  }

  assert.ok(linkCount > 0, 'rule java-cross-links: no Java links found')
  assert.deepEqual(
    brokenLinks,
    [],
    `rule java-cross-links: broken links${formatViolations(brokenLinks)}`,
  )
})

test('JDK 20 preview and incubator articles document status and paired commands', () => {
  const violations = []
  const scopedBodies = new Map()

  for (const relativePath of QUALITY_ARTICLE_PATHS) {
    try {
      scopedBodies.set(relativePath, readMarkdown(relativePath).body)
    } catch (error) {
      violations.push(`${relativePath} [article-read] ${error.message}`)
    }
  }

  const previewArticles = new Set(EXPECTED_JDK20_PREVIEW_ARTICLES)
  for (const [relativePath, body] of scopedBodies) {
    if (/--enable-preview/iu.test(body)) {
      previewArticles.add(relativePath)
    }
  }

  for (const relativePath of previewArticles) {
    const body = scopedBodies.get(relativePath)
    if (body === undefined) {
      violations.push(`${relativePath} [article-read] article is outside the scoped path set`)
      continue
    }
    if (!/预览特性|preview/iu.test(body) || !/JDK\s*20/iu.test(body)) {
      violations.push(`${relativePath} [preview-status] must identify the JDK 20 preview status`)
    }
    const compileCommand = body.split(/\r?\n/).some(
      (line) => /\bjavac\b/.test(line) && /--release\s+20/.test(line) && /--enable-preview/.test(line),
    )
    if (!compileCommand) {
      violations.push(`${relativePath} [preview-compile-command] needs javac --release 20 --enable-preview`)
    }
    const runCommand = body.split(/\r?\n/).some(
      (line) => /\bjava\b/.test(line) && !/\bjavac\b/.test(line) && /--enable-preview/.test(line),
    )
    if (!runCommand) {
      violations.push(`${relativePath} [preview-run-command] needs java --enable-preview`)
    }
  }

  // The current 01-06 scope has no planned incubator article. Keep this guard
  // data-driven so a scoped article cannot introduce incubator APIs without the
  // required JDK 20 status and paired --add-modules commands.
  for (const [relativePath, body] of scopedBodies) {
    if (!/jdk\.incubator\.|孵化 API|孵化模块|结构化并发/iu.test(body)) continue

    if (!/孵化\s*(?:API|模块)|incubator\s*(?:API|module)|非稳定\s*API/iu.test(body)) {
      violations.push(`${relativePath} [incubator-status] must explicitly identify a non-stable incubator API`)
    }
    // Structured concurrency is an incubator API in JDK 20, not a preview
    // language/API feature. A page may document both it and a separate
    // preview API (for example virtual threads), so do not incorrectly force
    // --enable-preview onto the incubator module's paired commands.
    const needsPreviewFlag = false
    const compileCommand = body.split(/\r?\n/).some(
      (line) =>
        /\bjavac\b/.test(line) &&
        /--release\s+20/.test(line) &&
        /--add-modules\s+jdk\.incubator\.concurrent/.test(line) &&
        (!needsPreviewFlag || /--enable-preview/.test(line)),
    )
    if (!compileCommand) {
      violations.push(
        `${relativePath} [incubator-compile-command] needs javac --release 20 --add-modules jdk.incubator.concurrent`,
      )
    }
    const runCommand = body.split(/\r?\n/).some(
      (line) =>
        /\bjava\b/.test(line) &&
        !/\bjavac\b/.test(line) &&
        /--add-modules\s+jdk\.incubator\.concurrent/.test(line) &&
        (!needsPreviewFlag || /--enable-preview/.test(line)),
    )
    if (!runCommand) {
      violations.push(`${relativePath} [incubator-run-command] needs java --add-modules jdk.incubator.concurrent`)
    }
  }

  assert.deepEqual(violations, [], `rule jdk20-preview-contract${formatViolations(violations)}`)
})

test('new Java lock articles state the JDK 20 API baseline', () => {
  const violations = []
  for (const relativePath of NEW_LOCK_ARTICLE_PATHS) {
    const { body } = readMarkdown(relativePath)
    if (!/JDK\s*20/iu.test(body)) {
      violations.push(`${relativePath} [jdk20-baseline] must state the JDK 20 baseline`)
    }
  }
  assert.deepEqual(violations, [], `rule jdk20-lock-baseline${formatViolations(violations)}`)
})

test('01-10 Java examples reject JDK 20+ APIs unless an allowed comparison is explicit', () => {
  const violations = []

  for (const relativePath of QUALITY_ARTICLE_PATHS) {
    let body
    try {
      body = readMarkdown(relativePath).body
    } catch (error) {
      violations.push(`${relativePath} [article-read] ${error.message}`)
      continue
    }
    for (const issue of inspectPostJdk20Apis(body)) {
      violations.push(`${relativePath} [jdk20-api] ${issue}`)
    }
  }

  assert.deepEqual(violations, [], `rule jdk20-api-compatibility${formatViolations(violations)}`)
})

test('Java quick-reference API headings put a concise explanation before the Java example', () => {
  const violations = []

  for (const [relativePath, sectionLabels] of Object.entries(QUICK_REFERENCE_SECTIONS)) {
    let article
    try {
      article = readMarkdown(relativePath)
    } catch (error) {
      violations.push(`${relativePath} [article-read] ${error.message}`)
      continue
    }

    for (const sectionLabel of sectionLabels) {
      const subsections = getQuickReferenceSubsections(article.body, sectionLabel)
      if (subsections.length === 0) {
        violations.push(`${relativePath} [quick-reference:${sectionLabel}] needs API subsections`)
        continue
      }
      for (const { heading, content } of subsections) {
        if (/^常见边界(?:\s|：|:|$)/u.test(heading)) continue
        for (const issue of inspectUsageSubsection(content)) {
          violations.push(
            `${relativePath} [quick-reference:${sectionLabel}/${heading}] ${issue}`,
          )
        }
        const javaBlocks = getJavaBlocks(content)
        if (
          javaBlocks.some((code) => /\bSystem\.out\.(?:print|println|printf)\s*\(/.test(code)) &&
          !javaBlocks.some(hasStandaloneOutputComment)
        ) {
          violations.push(
            `${relativePath} [quick-reference:${sectionLabel}/${heading}] observable output needs a standalone // 输出： comment`,
          )
        }
      }
    }
  }

  assert.deepEqual(violations, [], `rule java-quick-reference-examples${formatViolations(violations)}`)
})

test('01-10 Java examples keep standalone output comments and concurrency resource boundaries', () => {
  const violations = []

  for (const relativePath of QUALITY_ARTICLE_PATHS) {
    const { body } = readMarkdown(relativePath)
    for (const [index, code] of getJavaBlocks(body).entries()) {
      if (
        /\bSystem\.out\.(?:print|println|printf)\s*\(/.test(code) &&
        !hasStandaloneOutputComment(code)
      ) {
        violations.push(`${relativePath} [java-block-${index + 1}] observable output needs a standalone // 输出： comment`)
      }
    }
  }

  const concurrencyPaths = ARTICLE_PATHS.filter((file) =>
    file.startsWith('docs/courses/java/09-并发编程/'),
  )
  for (const relativePath of concurrencyPaths) {
    const { body } = readMarkdown(relativePath)
    for (const [index, code] of getJavaBlocks(body).entries()) {
      if (/\.(?:lock|lockInterruptibly|tryLock)\s*\(/.test(code)) {
        if (!/\.unlock(?:Read|Write)?\s*\(/.test(code)) {
          violations.push(`${relativePath} [java-block-${index + 1}] lock acquisition must have a matching unlock`)
        }
        if (!/finally/u.test(code)) {
          violations.push(`${relativePath} [java-block-${index + 1}] lock release must be in finally`)
        }
      }
      if (/\.(?:acquire|acquireUninterruptibly|acquireInterruptibly|tryAcquire)\s*\(/.test(code)) {
        if (!/\.release\s*\(/.test(code)) {
          violations.push(`${relativePath} [java-block-${index + 1}] permit acquisition must have a matching release`)
        }
      }
      if (/(?:Executors\.new|new\s+ThreadPoolExecutor\s*\()/.test(code) &&
          !/(?:\bshutdown(?:Now)?\s*\(|\bclose\s*\(|try\s*\()/u.test(code)) {
        violations.push(`${relativePath} [java-block-${index + 1}] executor must have a close/shutdown boundary`)
      }
    }
  }

  const futureArticle = readMarkdown('docs/courses/java/09-并发编程/08-线程池Callable与Future.md').body
  if (!/ExecutionException/u.test(futureArticle) || !/TimeoutException/u.test(futureArticle) || !/\.cancel\(/u.test(futureArticle)) {
    violations.push('docs/courses/java/09-并发编程/08-线程池Callable与Future.md [future-contract] needs exception, timeout, and cancellation coverage')
  }

  const completableFutureArticle = readMarkdown('docs/courses/java/09-并发编程/09-CompletableFuture异步编排.md').body
  if (!/supplyAsync\([\s\S]*?,\s*executor\)/u.test(completableFutureArticle)) {
    violations.push('docs/courses/java/09-并发编程/09-CompletableFuture异步编排.md [executor-boundary] supplyAsync should show an explicit executor')
  }
  if (!/thenApplyAsync\([\s\S]*?,\s*executor\)/u.test(completableFutureArticle)) {
    violations.push('docs/courses/java/09-并发编程/09-CompletableFuture异步编排.md [executor-boundary] thenApplyAsync should show an explicit executor')
  }
  if (!/commonPool/u.test(completableFutureArticle)) {
    violations.push('docs/courses/java/09-并发编程/09-CompletableFuture异步编排.md [executor-boundary] should explain the default commonPool')
  }

  const deadlockArticle = readMarkdown('docs/courses/java/09-并发编程/12-死锁定位与避免.md').body
  if (!/DeadlockReproductionDemo/u.test(deadlockArticle) || !/仅用于受控诊断[\s\S]*不能直接放进生产/u.test(deadlockArticle)) {
    violations.push('docs/courses/java/09-并发编程/12-死锁定位与避免.md [deadlock-safety] deliberate deadlock must be marked diagnostic-only')
  }

  assert.deepEqual(violations, [], `rule java-executable-safety${formatViolations(violations)}`)
})
