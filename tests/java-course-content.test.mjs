import assert from 'node:assert/strict'
import { existsSync, readFileSync, readdirSync } from 'node:fs'
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
  '11-MySQL-8',
  '12-工程实践',
  '13-设计与项目',
  '14-后端工程',
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
  '11-MySQL-8': ['01-环境连接与数据库对象.md', '02-表设计与DDL.md', '03-数据类型字符集与时区.md', '04-数据写入更新与删除.md', '05-查询过滤排序与分页.md', '06-连接子查询与集合查询.md', '07-聚合CTE窗口函数与JSON.md', '08-约束与索引设计.md', '09-事务MVCC隔离级别与锁.md', '10-EXPLAIN慢SQL与性能优化.md'],
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
  JAVA_INDEX_PATH,
  'docs/courses/java/11-MySQL-8/index.md',
  ...CHAPTER_NAMES.flatMap((chapter) =>
    EXPECTED_ARTICLES_BY_CHAPTER[chapter].map(
      (article) => `docs/courses/java/${chapter}/${article}`,
    ),
  ),
].sort()

const ARTICLE_PATHS = EXPECTED_JAVA_PATHS.filter((file) => !file.endsWith('/index.md'))

const COMMENT_CONTRACT_PATHS = ARTICLE_PATHS.filter((file) =>
  /^docs\/courses\/java\/(?:08-|09-|10-|12-|13-|14-)/u.test(file),
)

const FORBIDDEN_GENERIC_COMMENT_TAILS = [
  '返回本次调用的结果',
  '返回调用结果',
  '返回本次调用结果',
  '调用后目标状态更新',
  '得到调用结果',
]
const JAVA_COMMENT_CONTRACT_FORBIDDEN = /当前对象|具体参数|具体实参|当前值|具体结果|该操作|执行预期分支|后续代码可观察|示例输入固定|当前资源或任务状态|后续语句继续使用该值|本例中的具体调用|返回本次调用的结果|返回调用结果|返回本次调用结果|调用后目标状态更新|得到调用结果|\/\/\s*\//u

// Snapshot of the RuoYi external-call audit used for this course revision.
// It deliberately lives in the test instead of depending on uncommitted audit reports:
// every manifest entry with status=body, every missing entry with frequency >= 3,
// plus the three review batches' explicit P0/P1 items must remain searchable in H3 titles.
const REQUIRED_EXTERNAL_API_HEADINGS = {
  'docs/courses/java/02-数组与文本/02-String与文本处理.md': ['String.substring'],
  'docs/courses/java/02-数组与文本/03-常用类与包装类型.md': [
    'IOUtils.close', 'ArrayUtils.contains', 'RegExUtils.replaceAll', 'Validate.notBlank',
  ],
  'docs/courses/java/02-数组与文本/04-正则表达式与文本匹配.md': [
    'Matcher.appendReplacement', 'Matcher.appendTail', 'Matcher.quoteReplacement', 'Pattern.matcher',
  ],
  'docs/courses/java/03-面向对象/06-Object方法与对象相等.md': ['ToStringBuilder'],
  'docs/courses/java/05-泛型与集合/04-List常用API.md': [
    'ArrayList.add', 'Collection.size', 'Iterator.hasNext', 'Iterator.next', 'List.add',
    'List.addAll', 'List.contains', 'List.get', 'List.iterator', 'List.remove', 'List.size',
    'List.stream', 'List.toArray',
  ],
  'docs/courses/java/05-泛型与集合/05-Set去重与集合运算.md': ['HashSet', 'Set.add'],
  'docs/courses/java/05-泛型与集合/03-Map与集合选择.md': [
    'Map.computeIfAbsent', 'Map.merge',
  ],
  'docs/courses/java/05-泛型与集合/07-Map常用API.md': [
    'Map.containsKey', 'Map.containsValue', 'Map.entrySet', 'Map.get', 'Map.keySet',
    'Map.put', 'Map.remove', 'Map.size', 'Map.values',
  ],
  'docs/courses/java/06-函数式与时间/02-Stream流式处理.md': [
    'Collectors.groupingBy', 'Collectors.joining', 'Collectors.toList',
    'Collectors.toMap', 'Collectors.toSet',
  ],
  'docs/courses/java/06-函数式与时间/07-日期格式化与解析.md': [
    'SimpleDateFormat', 'Duration.of', 'LocalDateTime.of', 'LocalTime.of',
  ],
  'docs/courses/java/06-函数式与时间/03-日期时间API.md': ['Date'],
  'docs/courses/java/07-IO与网络/04-字节流字符流与缓冲.md': [
    'BufferedReader', 'BufferedReader.close', 'ByteArrayInputStream', 'ByteArrayOutputStream', 'File.exists',
    'FileOutputStream', 'InputStreamReader', 'IOException', 'PrintWriter',
    'StringWriter', 'StringWriter.toString', 'Paths.get', 'ZipOutputStream',
  ],
  'docs/courses/java/07-IO与网络/06-HTTP-Client常用API.md': [
    'URL', 'URL.openConnection', 'URLEncoder.encode',
  ],
  'docs/courses/java/08-反射与模块/04-注解定义与运行时读取.md': [
    'Field.get', 'Field.set', 'AnnotationUtils.findAnnotation',
  ],
  'docs/courses/java/09-并发编程/02-并发工具与线程安全.md': [
    'ThreadPoolExecutor.CallerRunsPolicy',
  ],
  'docs/courses/java/12-工程实践/01-Maven与测试工程.md': [
    '@PreDestroy', '@Resource', 'Charset.defaultCharset', 'Charset.forName',
    'Random.nextInt', 'UUID.randomUUID',
  ],
  'docs/courses/java/12-工程实践/04-Velocity代码生成.md': [
    'Properties', 'Template.merge', 'VelocityContext.put',
  ],
  'docs/courses/java/14-后端工程/01-Spring-Boot启动与配置.md': ['@Configuration'],
  'docs/courses/java/14-后端工程/02-Spring-IoC与Bean生命周期.md': [
    '@Autowired', '@Value', '@ConditionalOnProperty', 'SpringApplication.run',
    'FilterRegistrationBean', 'FilterRegistrationBean.addUrlPatterns',
  ],
  'docs/courses/java/14-后端工程/03-Spring-AOP与声明式事务.md': [
    '@Transactional', 'AopContext.currentProxy',
  ],
  'docs/courses/java/14-后端工程/04-Spring-MVC与Servlet边界.md': [
    '@DeleteMapping', '@ExceptionHandler', '@GetMapping', '@PathVariable', '@PostMapping',
    '@PutMapping', '@RequestMapping', '@RequestParam', '@ResponseBody', '@RestController',
    '@RestControllerAdvice', 'FilterChain.doFilter', 'HttpServletResponse.addHeader',
  ],
  'docs/courses/java/14-后端工程/05-Spring-Security与JWT.md': [
    '@EnableMethodSecurity', '@PreAuthorize', 'Claims.get', 'Jwts.parser', 'BCryptPasswordEncoder',
  ],
  'docs/courses/java/14-后端工程/06-MyBatis核心与MyBatis-Plus重点.md': [
    '@Param', '@MapperScan', 'PageHelper.startPage', 'PageHelper.orderBy',
    'PageHelper.clearPage', 'PageInfo',
  ],
  'docs/courses/java/14-后端工程/07-Jackson与Fastjson2-JSON.md': [
    '@JSONField', '@JsonSerialize', 'JSONObject.containsKey', 'JSONObject.parseObject',
    '@JsonProperty', '@JsonIgnore', '@JacksonAnnotationsInside', 'Jwts.builder', 'Claims.put',
  ],
  'docs/courses/java/14-后端工程/08-Bean-Validation参数校验.md': [
    '@Constraint', '@Email', '@NotNull', '@Pattern',
  ],
  'docs/courses/java/14-后端工程/09-SLF4J与Logback日志.md': ['Logger.debug', 'Logger.warn'],
  'docs/courses/java/14-后端工程/11-Apache-POI-Excel导入导出.md': [
    'Row.createCell', 'Sheet.addMergedRegion', 'Sheet.createRow',
    'Workbook.createCellStyle', 'Workbook.createDataFormat', 'Workbook.createFont',
    'Workbook.createSheet', 'WorkbookFactory.create', 'CellRangeAddress',
    'IOUtils.closeQuietly', 'SXSSFWorkbook.write', 'CellStyle.cloneStyleFrom',
    'DataValidationHelper.createValidation', 'DataValidation.createPromptBox',
    'Sheet.addValidationData', 'CellRangeAddressList', 'IOUtils.toByteArray',
  ],
  'docs/courses/java/14-后端工程/12-Quartz定时任务.md': [
    'CronExpression', 'CronScheduleBuilder.cronSchedule', 'JobBuilder.newJob', 'JobDataMap',
    'JobDataMap.put', 'JobKey.jobKey', 'Scheduler.checkExists', 'Scheduler.deleteJob',
    'Scheduler.pauseJob', 'Scheduler.resumeJob', 'Scheduler.scheduleJob',
    'TriggerBuilder.newTrigger',
  ],
}
// Chapters 01-10 are the completed quality-gated learning path. Chapters
// Chapters 11-15 are still being authored and are covered only by the
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

// New, migrated, and materially rewritten pages opt into the strict article
// contract through this manifest. Later content tasks append route entries
// here; legacy pages stay on their existing, intentionally separate checks.
const ARTICLE_CONTRACT_MANIFEST = {
  requiredH2: [
    '学习目标',
    '核心知识点',
    '常用用法',
    '易混点',
    '课后小问',
    '本节小结',
    '快速回顾',
  ],
  entries: [
    ...['01-环境连接与数据库对象', '02-表设计与DDL', '03-数据类型字符集与时区', '04-数据写入更新与删除'].map((name) => ({ path: `docs/courses/java/11-MySQL-8/${name}.md`, source: 'new' })),
    ...['05-查询过滤排序与分页', '06-连接子查询与集合查询', '07-聚合CTE窗口函数与JSON', '08-约束与索引设计', '09-事务MVCC隔离级别与锁', '10-EXPLAIN慢SQL与性能优化'].map((name) => ({ path: `docs/courses/java/11-MySQL-8/${name}.md`, source: 'new' })),
    // Future entries use { path: 'docs/courses/java/...md', source: 'new' | 'migrated' | 'rewritten' }.
  ],
}
const ARTICLE_CONTRACT_FRONTMATTER_FIELDS = [
  'title',
  'date',
  'category',
  'tags',
  'description',
]
const ARTICLE_CONTRACT_PATHS = new Set(
  ARTICLE_CONTRACT_MANIFEST.entries.map((entry) =>
    typeof entry === 'string' ? entry : entry.path,
  ),
)

test('MySQL foundation and MySQL CRUD preserve searchable operations and safe executable examples', () => {
  const topics = {
    '01-环境连接与数据库对象': ['mysql', 'SELECT', 'CREATE DATABASE', 'USE', 'SHOW', 'CREATE VIEW'],
    '02-表设计与DDL': ['CREATE TABLE', 'ALTER TABLE', 'RENAME TABLE', 'TRUNCATE TABLE', 'DROP TABLE'],
    '03-数据类型字符集与时区': ['CREATE TABLE', 'SELECT', 'SET'],
    '04-数据写入更新与删除': ['INSERT', 'SELECT LAST_INSERT_ID()', 'UPDATE', 'DELETE', 'INSERT IGNORE', 'REPLACE', 'INSERT ... ON DUPLICATE KEY UPDATE'],
  }
  for (const [name, operations] of Object.entries(topics)) {
    const path = `docs/courses/java/11-MySQL-8/${name}.md`
    assert.ok(existsSync(join(REPO_ROOT, path)), `${path} is missing`)
    const article = readMarkdown(path)
    assert.deepEqual(inspectArticleContract(article, { path }), [])
    const headings = getArticleContractH3Subsections(getArticleContractSection(article.body, '常用用法')).map(({ heading }) => getArticleContractOperationHeadingLabel(heading))
    for (const operation of operations) assert.ok(headings.includes(operation), `${path}: ${operation}`)
    assert.match(article.body, /learning_lab/u)
    assert.match(article.body, /MySQL 8\.0/u)
    assert.match(article.body, /InnoDB/u)
  }
  const types = readMarkdown('docs/courses/java/11-MySQL-8/03-数据类型字符集与时区.md').body
  for (const term of ['BIGINT', 'DECIMAL', 'VARCHAR', 'VARBINARY', 'DATETIME', 'TIMESTAMP', 'JSON', 'NULL', 'STRICT_TRANS_TABLES', 'utf8mb4', 'COLLATE', 'time_zone']) assert.ok(types.includes(term), term)
  const crud = readMarkdown('docs/courses/java/11-MySQL-8/04-数据写入更新与删除.md').body
  assert.match(crud, /ROW_COUNT\(\)/u)
  assert.match(crud, /START TRANSACTION[\s\S]*ROLLBACK/u)
  assert.match(crud, /风险[\s\S]*WHERE/u)
})

const MYSQL_QUERY_INTERNALS_TOPICS = {
  '05-查询过滤排序与分页': ['SELECT', 'SELECT WHERE', 'SELECT IS NULL', 'SELECT LIKE', 'SELECT IN', 'SELECT BETWEEN', 'SELECT CASE', 'SELECT DISTINCT', 'SELECT ORDER BY', 'SELECT LIMIT', 'SELECT keyset', 'SELECT COALESCE()', 'SELECT CONCAT()', 'SELECT DATE_FORMAT()'],
  '06-连接子查询与集合查询': ['SELECT INNER JOIN', 'SELECT LEFT JOIN', 'SELECT CROSS JOIN', 'SELECT self JOIN', 'SELECT scalar subquery', 'SELECT correlated subquery', 'SELECT EXISTS', 'SELECT IN subquery', 'SELECT NOT IN', 'SELECT UNION', 'SELECT UNION ALL', 'SELECT derived table'],
  '07-聚合CTE窗口函数与JSON': ['SELECT GROUP BY', 'SELECT HAVING', 'WITH', 'WITH RECURSIVE', 'SELECT ROW_NUMBER()', 'SELECT RANK()', 'SELECT DENSE_RANK()', 'SELECT LAG()', 'SELECT LEAD()', 'SELECT OVER', 'SELECT JSON_EXTRACT()', 'SELECT JSON_TYPE()', 'SELECT ->', 'SELECT ->>', 'SELECT JSON_SET()', 'SELECT JSON_ARRAYAGG()', 'ALTER TABLE generated column'],
  '08-约束与索引设计': ['CREATE TABLE NOT NULL DEFAULT', 'CREATE TABLE UNIQUE', 'CREATE TABLE CHECK', 'CREATE TABLE FOREIGN KEY', 'SHOW INDEX', 'CREATE INDEX composite', 'EXPLAIN covering', 'CREATE INDEX prefix', 'CREATE INDEX functional', 'CREATE INDEX descending', 'ALTER TABLE invisible'],
  '09-事务MVCC隔离级别与锁': ['START TRANSACTION', 'SET autocommit', 'SAVEPOINT', 'SET TRANSACTION', 'SELECT snapshot read', 'SELECT FOR UPDATE', 'SELECT FOR SHARE', 'SELECT gap lock', 'SELECT next-key lock', 'SELECT intention lock', 'SELECT metadata lock', 'SHOW ENGINE INNODB STATUS', 'SELECT data_lock_waits'],
  '10-EXPLAIN慢SQL与性能优化': ['EXPLAIN', 'EXPLAIN FORMAT=JSON', 'EXPLAIN FORMAT=TREE', 'EXPLAIN ANALYZE', 'ANALYZE TABLE', 'ANALYZE TABLE histogram', 'SHOW slow_query_log', 'SELECT performance_schema', 'EXPLAIN sargability', 'EXPLAIN JOIN', 'EXPLAIN filesort', 'EXPLAIN temporary', 'EXPLAIN keyset'],
}
for (const [name, operations] of Object.entries(MYSQL_QUERY_INTERNALS_TOPICS)) {
  test(`MySQL query index transaction explain: ${name} searchable coverage and boundary matrix`, () => {
    const path = `docs/courses/java/11-MySQL-8/${name}.md`
    assert.ok(existsSync(join(REPO_ROOT, path)), `${path} is missing`)
    const article = readMarkdown(path)
    assert.deepEqual(inspectArticleContract(article, { path }), [])
    const headings = getArticleContractH3Subsections(getArticleContractSection(article.body, '常用用法')).map(({ heading }) => getArticleContractOperationHeadingLabel(heading))
    for (const operation of operations) assert.ok(headings.includes(operation), `${path}: ${operation}`)
    for (const baseline of ['learning_lab', 'MySQL 8.0', 'InnoDB']) assert.ok(article.body.includes(baseline), `${path}: ${baseline}`)
    const boundaries = {
      '05': [/参数绑定/u, /白名单/u, /NULL[\s\S]*UNKNOWN/u, /唯一/u],
      '06': [/NOT IN[\s\S]*NULL/u, /ON[\s\S]*WHERE/u, /多行/u],
      '07': [/ONLY_FULL_GROUP_BY/u, /cte_max_recursion_depth/u, /ROWS[\s\S]*RANGE/u, /JSON_ARRAYAGG[\s\S]*顺序/u],
      '08': [/8\.0\.16/u, /8\.0\.13/u, /B\+Tree/u, /最左前缀/u, /选择性/u],
      '09': [/ACID/u, /REPEATABLE READ/u, /首次/u, /短事务/u, /幂等/u, /1205/u, /1213/u],
      '10': [/实际执行/u, /UPDATE[\s\S]*DELETE/u, /生产/u, /估算/u, /统计信息/u],
    }[name.slice(0, 2)]
    for (const boundary of boundaries) assert.match(article.body, boundary, `${path}: ${boundary}`)
  })
}

test('MySQL transaction and statistics headings require executable native statements', () => {
  for (const [heading, command] of [['START TRANSACTION', 'START TRANSACTION;'], ['SAVEPOINT', 'SAVEPOINT before_change;'], ['ANALYZE TABLE', 'ANALYZE TABLE learning_lab.orders;']]) {
    assert.equal(isArticleContractOperationHeading(heading, `\`\`\`sql\n${command}\n\`\`\``), true)
    assert.equal(isArticleContractOperationHeading(heading, `\`\`\`sql\n-- ${command}\nSELECT 1;\n\`\`\``), false)
  }
})

test('MySQL foundation native headings require the matching executable command', () => {
  for (const [heading, language, command] of [
    ['mysql', 'shell', 'mysql --host=127.0.0.1 --user=lab_user --password'],
    ['USE', 'sql', 'USE learning_lab;'],
    ['RENAME TABLE', 'sql', 'RENAME TABLE lab_old TO lab_new;'],
    ['REPLACE', 'sql', "REPLACE INTO lab_replace VALUES (1,'新名称');"],
  ]) {
    assert.equal(isArticleContractOperationHeading(heading, `\`\`\`${language}\n${command}\n\`\`\``), true)
    assert.equal(isArticleContractOperationHeading(heading, `\`\`\`${language}\n# ${command}\nSELECT 1;\n\`\`\``), false)
  }
})

// Keep this list public within the test module so the MySQL/Redis content
// batches can reuse one danger vocabulary without copying it into each test.
const DANGEROUS_MYSQL_REDIS_TOKENS = Object.freeze([
  'FLUSHALL',
  'FLUSHDB',
  'KEYS',
  'DEL',
  'UNLINK',
  'TRUNCATE',
  'DROP TABLE',
  'DROP DATABASE',
  'LOCK TABLES',
  'LOCK INSTANCE FOR BACKUP',
  'FLUSH TABLES WITH READ LOCK',
  'MYSQLDUMP',
  'BACKUP',
  'RESTORE',
  'CONFIG SET',
  'EVAL',
  'EVALSHA',
  'SCRIPT FLUSH',
  'MONITOR',
  'DEBUG',
  'REPLICAOF',
  'SLAVEOF',
  'MIGRATE',
  'SLOWLOG',
  'INFO',
  'LATENCY',
  'MEMORY',
  'SHUTDOWN',
  'SAVE',
  'BGSAVE',
  'UPDATE',
  'DELETE',
])
const MYSQL_DANGER_TOKENS = new Set([
  'TRUNCATE',
  'DROP TABLE',
  'DROP DATABASE',
  'LOCK TABLES',
  'LOCK INSTANCE FOR BACKUP',
  'FLUSH TABLES WITH READ LOCK',
  'MYSQLDUMP',
  'BACKUP',
  'RESTORE',
  'UPDATE',
  'DELETE',
])
const REDIS_DANGER_TOKENS = new Set(
  DANGEROUS_MYSQL_REDIS_TOKENS.filter((token) => !MYSQL_DANGER_TOKENS.has(token)),
)
const SHELL_DANGER_TOKENS = new Set(DANGEROUS_MYSQL_REDIS_TOKENS)

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
const FORBIDDEN_TEMPLATE_PHRASES = [
  ...FORBIDDEN_GENERIC_COMMENT_TAILS,
  '本例演示',
  '本段示例的具体调用入口',
  '下方结果',
  '示例所需依赖',
  '受控输入与运行上下文',
  '结果：执行后',
  '示例执行到' + '预期分支',
]

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
    path: 'docs/courses/java/14-后端工程/01-Spring-Boot启动与配置.md',
    title: 'Spring Boot 启动与配置',
    keywords: ['@SpringBootApplication', 'application.yml', '@ConfigurationProperties', 'ApplicationRunner', 'Environment'],
    commonUsage: ['@SpringBootApplication', 'application.yml', '@ConfigurationProperties'],
    uncommonUsage: ['条件装配', '启动失败定位', 'ApplicationRunner', 'Environment'],
  }),
  createBackendArticleSpec({
    path: 'docs/courses/java/14-后端工程/02-Spring-IoC与Bean生命周期.md',
    title: 'Spring IoC 与 Bean 生命周期',
    keywords: ['@Component', '@Service', '@Bean', '构造器注入', '@PostConstruct', '作用域', '代理对象'],
    commonUsage: ['@Component', '@Service', '@Bean', '构造器注入', '@PostConstruct', '作用域', '代理对象'],
    uncommonUsage: ['ObjectProvider', '@Lazy', '@Primary'],
  }),
  createBackendArticleSpec({
    path: 'docs/courses/java/14-后端工程/03-Spring-AOP与声明式事务.md',
    title: 'Spring AOP 与声明式事务',
    keywords: ['@Aspect', '@Pointcut', '@Around', 'proceed', '@Transactional', '传播', '隔离', '回滚', '只读', '自调用'],
    commonUsage: ['@Aspect', '@Pointcut', '@Around', 'proceed', '@Transactional', '配置只读查询的事务策略', '自调用'],
    uncommonUsage: ['@Order', 'TransactionTemplate', '回滚规则'],
  }),
  createBackendArticleSpec({
    path: 'docs/courses/java/14-后端工程/04-Spring-MVC与Servlet边界.md',
    title: 'Spring MVC 与 Servlet 边界',
    keywords: ['@RestController', '@RequestMapping', '@GetMapping', '@RequestBody', '响应体', '异常处理', 'Filter', 'Interceptor'],
    commonUsage: ['@RestController', '@RequestMapping', '@GetMapping', '@RequestBody', '响应体', '异常处理', 'Filter', 'HandlerInterceptor'],
    uncommonUsage: ['ResponseEntity', 'OncePerRequestFilter', '拦截器顺序', 'HttpServletResponse.flushBuffer'],
  }),
  createBackendArticleSpec({
    path: 'docs/courses/java/14-后端工程/05-Spring-Security与JWT.md',
    title: 'Spring Security 与 JWT',
    keywords: ['SecurityFilterChain', 'authorizeHttpRequests', '@PreAuthorize', 'BCrypt', 'Bearer', 'claims', '过期', '401', '403'],
    commonUsage: ['SecurityFilterChain', 'authorizeHttpRequests', '@PreAuthorize', 'BCrypt', 'Bearer token', 'JWT claims', 'JWT exp'],
    uncommonUsage: ['AuthenticationEntryPoint', 'AccessDeniedHandler', '测试替身'],
  }),
  createBackendArticleSpec({
    path: 'docs/courses/java/14-后端工程/06-MyBatis核心与MyBatis-Plus重点.md',
    title: 'MyBatis 核心与 MyBatis-Plus 重点',
    keywords: ['<select', '<insert', '#{}', '<if ', '<foreach ', '结果映射', 'BaseMapper', 'IService', 'QueryWrapper', '分页'],
    commonUsage: ['XML <select>', 'XML <insert>', '#{}', '按可选 ID 集合构建查询', '结果映射'],
    uncommonUsage: ['BaseMapper', 'IService', 'LambdaQueryWrapper', '分页', '原生 XML 对照'],
  }),
  createBackendArticleSpec({
    path: 'docs/courses/java/14-后端工程/07-Jackson与Fastjson2-JSON.md',
    title: 'Jackson 与 Fastjson2 JSON',
    keywords: ['ObjectMapper', 'Jackson', '@JsonFormat', '@JsonInclude', 'toJSONString', 'parseObject', '自定义序列化', 'Redis 序列化'],
    commonUsage: ['ObjectMapper.writeValueAsString', 'ObjectMapper.readValue', '@JsonFormat', '@JsonInclude', 'JSON.toJSONString', 'JSON.parseObject'],
    uncommonUsage: ['自定义序列化', 'Redis 序列化'],
  }),
  createBackendArticleSpec({
    path: 'docs/courses/java/14-后端工程/08-Bean-Validation参数校验.md',
    title: 'Bean Validation 参数校验',
    keywords: ['@NotBlank', '@Size', '@Valid', '@Validated', '级联', '分组', 'ConstraintValidator', '字段错误响应'],
    commonUsage: ['@NotBlank', '@Size', '@Valid', '@Validated', '级联', '分组'],
    uncommonUsage: ['ConstraintValidator', '字段错误响应', '转换/校验/授权职责'],
  }),
  createBackendArticleSpec({
    path: 'docs/courses/java/14-后端工程/09-SLF4J与Logback日志.md',
    title: 'SLF4J 与 Logback 日志',
    keywords: ['LoggerFactory', 'info', 'error', 'Logback', 'appender', '滚动', 'MDC', '脱敏', 'AOP 操作日志'],
    commonUsage: ['LoggerFactory', 'Logger.info', 'Logger.error', 'Logback 滚动文件', 'MDC'],
    uncommonUsage: ['脱敏', 'AOP 操作日志', '采样/异常堆栈'],
  }),
  createBackendArticleSpec({
    path: 'docs/courses/java/14-后端工程/10-文件上传下载与资源安全.md',
    title: '文件上传下载与资源安全',
    keywords: ['MultipartFile', 'transferTo', '扩展名', '大小白名单', '路径规范化', '路径穿越', 'Content-Disposition', '流式下载'],
    commonUsage: ['MultipartFile', 'transferTo', '执行上传白名单校验', '路径规范化', 'Content-Disposition', '流式下载'],
    uncommonUsage: ['路径穿越', '临时文件', '拒绝路径'],
  }),
  createBackendArticleSpec({
    path: 'docs/courses/java/14-后端工程/11-Apache-POI-Excel导入导出.md',
    title: 'Apache POI Excel 导入导出',
    keywords: ['WorkbookFactory', 'SXSSFWorkbook', '注解列映射', 'importExcel', 'exportExcel', '大文件', '日期', '公式', '资源释放'],
    commonUsage: ['WorkbookFactory', 'SXSSFWorkbook', '注解列映射', 'importExcel', 'exportExcel'],
    uncommonUsage: ['大文件', '日期/公式', '资源释放'],
  }),
  createBackendArticleSpec({
    path: 'docs/courses/java/14-后端工程/12-Quartz定时任务.md',
    title: 'Quartz 定时任务',
    keywords: ['Job', 'JobDetail', 'CronTrigger', 'Cron 表达式', 'misfire', '暂停/恢复', '@DisallowConcurrentExecution', '持久化表', '失败重试'],
    commonUsage: ['Job', 'JobDetail', 'CronTrigger', 'Cron 表达式', 'misfire', '维护期间控制调度启停'],
    uncommonUsage: ['@DisallowConcurrentExecution', '持久化表', '失败重试', 'ScheduledExecutorService'],
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
])
const EXPECTED_JDK20_PREVIEW_ARTICLES = [
  'docs/courses/java/04-现代Java类型/01-枚举record与sealed.md',
]

const QUICK_REFERENCE_SECTIONS = {
  'docs/courses/java/02-数组与文本/01-数组与多维数组.md': ['常用用法'],
  'docs/courses/java/02-数组与文本/02-String与文本处理.md': ['常用用法'],
  'docs/courses/java/05-泛型与集合/02-集合框架与数据结构.md': ['常用用法'],
  'docs/courses/java/05-泛型与集合/03-Map与集合选择.md': ['常用用法'],
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
  const normalizedLine = line
    .replaceAll('&lt;', '<')
    .replaceAll('&gt;', '>')
    .replaceAll('`', '')
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

const ATOMIC_USAGE_HEADING_ALLOWLIST = new Set([
  // These headings describe one inseparable Stream collector/pipeline expression;
  // splitting either stage would no longer demonstrate the documented operation.
  '`flatMap` + `distinct`：展开后去重',
  '`groupingBy` + `mapping`：分组后提取字段',
  '`groupingBy` + `summingInt`：分组求和',
  '`groupingBy` + `summarizingInt`：分组统计摘要',
  '`groupingBy` + `reducing`：每组按规则归约',
  '`javac` 与 `java`：编译并运行类',
  '`&&` 与 `||`：使用短路逻辑',
  '`final` 与 `static final`：表达稳定值',
  '`class`/`new`：声明类并创建对象',
  '`interface`/`implements`：声明并实现能力契约',
  '`wait`/`notifyAll`：对象监视器协作',
  '自动装箱/拆箱：在基本值与对象间转换',
  '`Collection.stream`/`Stream.of`：创建顺序流',
  '`onClose`/`close`：管理特殊流资源',
  '`LocalDate.parse`/`format`：处理日期文本',
  '`LocalTime.parse`/`format`：处理时间文本',
  '`LocalDateTime.parse`/`format`：处理本地日期时间',
  '`ZoneId`/`ZonedDateTime`：按地区显示同一时刻',
  '`Instant.parse`/`ofEpochMilli`：创建时间线时刻',
  'BlockingQueue.put、take：阻塞式生产消费',
  '`shutdownInput`/`shutdownOutput`：TCP 半关闭',
  '`META-INF/services`：classpath 提供方配置',
  '完成一次 JFR 记录：启动、导出并停止',
  '序列化：固定 key 与 value 字节契约',
  '资源释放：关闭输入流、Workbook 与临时文件',
])

function getExactH2Sections(body, label) {
  const lines = body.split(/\r?\n/u)
  const heading = `## ${label}`
  const starts = lines.flatMap((line, index) => line === heading ? [index] : [])
  return starts.map((start) => {
    const relativeEnd = lines.slice(start + 1).findIndex((line) => /^##\s+/u.test(line))
    const end = relativeEnd < 0 ? lines.length : start + 1 + relativeEnd
    return lines.slice(start + 1, end).join('\n')
  })
}

function getH3Subsections(section) {
  const lines = section.split(/\r?\n/u)
  const starts = lines.flatMap((line, index) => {
    const match = line.match(/^###\s+(\S.*)$/u)
    return match ? [{ index, heading: match[1].trim() }] : []
  })
  return starts.map((start, index) => ({
    heading: start.heading,
    content: lines.slice(start.index + 1, starts[index + 1]?.index ?? lines.length).join('\n'),
  }))
}

function getAllH3Subsections(body) {
  const lines = body.split(/\r?\n/u)
  const starts = []
  let inFence = false
  lines.forEach((line, index) => {
    if (/^\s*```/u.test(line)) {
      inFence = !inFence
      return
    }
    const match = !inFence && line.match(/^###\s+(\S.*)$/u)
    if (match) starts.push({ index, heading: match[1].trim() })
  })
  return starts.map((start, index) => ({
    heading: start.heading,
    content: lines.slice(start.index + 1, starts[index + 1]?.index ?? lines.length).join('\n'),
  }))
}

function isExplicitApiHeading(heading) {
  const label = heading.split(/[：:]/u, 1)[0].trim()
  const normalized = label.replaceAll('`', '')
  const apiToken = '@?[A-Za-z_$][\w$]*(?:\.[A-Za-z_$][\w$]*)*(?:\([^)]*\))?'
  return new RegExp(`^${apiToken}(?:\\s*(?:\\+|/|、|与|和|及|以及)\\s*${apiToken})*$`, 'u').test(normalized)
}

function isCombinedApiHeading(heading) {
  const label = heading.split(/[：:]/u, 1)[0].replaceAll('`', '').trim()
  const apiToken = '@?[A-Za-z_$][\w$]*(?:\.[A-Za-z_$][\w$]*)*(?:\([^)]*\))?'
  return new RegExp(`^${apiToken}\\s*(?:\\+|/|、|与|和|及|以及)\\s*${apiToken}`, 'u').test(label)
}

function getSupportedApiH3Subsections(body) {
  const explicit = getAllH3Subsections(body).filter(({ heading, content }) =>
    isExplicitApiHeading(heading) &&
    /```(?:java|sql|xml|properties|yaml|shell)(?:\s|$)/iu.test(content),
  )
  const extra = getAllH3Subsections(body).filter(({ heading, content }) =>
    [
      'BlockingQueue：用消息传递代替共享列表',
      'CountDownLatch：等待一组一次性事件',
      '读写短文本文件：使用明确字符集',
    ].includes(heading) && /```java(?:\s|$)/iu.test(content),
  )
  return [...explicit, ...extra]
}

function getExternalApiHeadingTokens(body) {
  const tokens = new Set()
  for (const match of body.matchAll(/^###\s+(\S.*)$/gmu)) {
    const label = match[1].split(/[：:]/u, 1)[0].trim()
    if (/不存在|不是\s*API|不可用/u.test(label)) continue

    for (const tokenMatch of label.matchAll(/@?[A-Za-z_$][\w$]*(?:\.[A-Za-z_$][\w$]*)*/gu)) {
      tokens.add(tokenMatch[0])
    }
  }
  return tokens
}

function inspectApiHeadingFormat(body) {
  const violations = []
  const sections = getExactH2Sections(body, '常用用法')
  if (sections.length !== 1) {
    return [`expected exactly one exact \"## 常用用法\" heading, found ${sections.length}`]
  }

  const commonSubsections = getH3Subsections(sections[0])
  if (commonSubsections.length === 0) violations.push('常用用法 needs at least one H3 API subsection')
  const subsections = commonSubsections

  for (const { heading, content } of subsections) {
    const prefix = `[${heading}]`
    const lines = content.split(/\r?\n/u)
    const first = lines.findIndex((line) => line.trim() !== '')
    if (first < 0 || /^(?:```|[-*+]\s|\d+[.)]\s|>|#{1,6}\s)/u.test(lines[first].trim())) {
      violations.push(`${prefix} first non-empty block must be a purpose sentence`)
      continue
    }

    const fence = lines.findIndex((line, index) => index > first && /^```(?:java|sql|xml|shell)\s*$/u.test(line.trim()))
    if (fence < 0) {
      violations.push(`${prefix} purpose sentence must be followed by a java/sql/xml fence`)
      continue
    }
    const explanationLines = lines.slice(first, fence).filter((line) => line.trim() !== '')
    const explanation = stripMarkdown(explanationLines.join(' '))
    if (explanationLines.length !== 1 || explanation.length < 10 || !/[。！？]$/u.test(explanation) || (explanation.match(/[。！？]/gu)?.length ?? 0) !== 1) {
      violations.push(`${prefix} purpose must be one complete sentence of at least 10 characters`)
    }

    const language = lines[fence].trim().slice(3)
    const closingOffset = lines.slice(fence + 1).findIndex((line) => line.trim() === '```')
    if (closingOffset < 0) {
      violations.push(`${prefix} code fence is not closed`)
      continue
    }
    const close = fence + 1 + closingOffset
    const codeLines = lines.slice(fence + 1, close)
    const realCode = codeLines.some((line) => {
      const trimmed = line.trim()
      if (!trimmed) return false
      if (language === 'java') return !/^(?:\/\/|\/\*|\*|\*\/)/u.test(trimmed)
      if (language === 'sql') return !/^--/u.test(trimmed)
      if (language === 'shell') return !/^#/u.test(trimmed)
      return !/^(?:<!--|-->|--)/u.test(trimmed)
    })
    if (!realCode) violations.push(`${prefix} example needs real non-comment code`)

    const standaloneResult = language === 'java'
      ? codeLines.some((line) => /^\s*\/\/\s*(?:输出|结果|效果)：\s*\S/u.test(line))
      : language === 'shell'
        ? codeLines.some((line) => /^\s*#\s*(?:输出|结果|效果)：\s*\S/u.test(line))
      : codeLines.some((line) => /^\s*--\s*(?:输出|结果|效果)：\s*\S/u.test(line))
        || lines.slice(close + 1).some((line) => /^\s*(?:输出|结果|效果)：\s*\S/u.test(line))
    if (!standaloneResult) violations.push(`${prefix} example needs a standalone output/result line`)

    if (isCombinedApiHeading(heading) && !ATOMIC_USAGE_HEADING_ALLOWLIST.has(heading)) {
      violations.push(`${prefix} combined API heading is not in the atomic-operation allowlist`)
    }
  }
  for (const { heading } of getSupportedApiH3Subsections(body)) {
    if (isCombinedApiHeading(heading) && !ATOMIC_USAGE_HEADING_ALLOWLIST.has(heading)) {
      const issue = `[${heading}] combined API heading is not in the atomic-operation allowlist`
      if (!violations.includes(issue)) violations.push(issue)
    }
  }
  return violations
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
  return [...text.matchAll(/```(java|sql|xml)[^\r\n]*\r?\n([\s\S]*?)```/gi)].map((match) => ({
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
  return /^\s*(?:\/\/|--)\s*(?:输出|结果)\s*[:：]\s*\S.*$/mu.test(code)
}

const COMMON_USAGE_CODE_LANGUAGES = new Set([
  'java', 'sql', 'xml', 'properties', 'yaml', 'shell',
])
const EXPLANATION_COMMENT_LABEL = /(?:输入|初始(?:状态)?|前置(?:条件)?|作用|关键变化|当前状态|说明)\s*[:：]/u
const RESULT_COMMENT_LABEL = /(?:输出|结果)\s*[:：]/u
const JAVA_INPUT_COMMENT_LABEL = /(?:输入|初始(?:状态)?|前置(?:条件)?)\s*[:：]/u
// A result/return label describes an observable value, not the operation that
// produced it. Keep the action labels deliberately separate so the final
// output line can never satisfy the adjacent-action contract by accident.
const JAVA_ACTION_COMMENT_LABEL = /(?:作用|关键变化|当前状态|效果)\s*[:：]/u
const JAVA_RESULT_COMMENT_LABEL = /(?:输出|结果|返回|异常)\s*[:：]/u
const JAVA_ACTION_EFFECT_PATTERN = /(?:变为|变成|更新|追加|插入|删除|移除|写入|读取|返回|得到|产生|注册|匹配|替换|合并|累加|递减|递增|阻塞|唤醒|等待|创建|关闭|释放|格式化|判断|比较|校验|验证|转换|复制|获取|计算|查找|截取|拼接|检查|选择|遍历|处理|提供|取得|生成|启动|提交|停止|触发|保留|保持|消费|生产|长度|数量|元素|字段|键|值|状态|结果|集合|列表|队列|映射|异常|成功|失败|生效|调用后|之后|此时|最终|现在|剩余|内容|字符串|文本|时间|线程|任务|锁|配置|规则|响应|请求|对象|文件|目录|连接|资源|流|字节|索引|位置|引用|实例|类型|名称|标识)/u
const JAVA_OUTPUT_CALL_PATTERN = /\bSystem\.out\.(?:print|println|printf)\s*\(/u
const FORBIDDEN_EXAMPLE_COMMENT_PATTERN = /关键输入或调用是|执行后[^\r\n]*(?:完成|进入|得到|产生)|本例演示|示例完成|本次输出调用已产生可观察结果|接收对象或返回值按该参数产生对应状态|使用给定参数产生该输出|使用具体参数[^\r\n。]*(?:计算并返回结果|完成判断并返回布尔结果)|使用表达式中的具体参数完成本次调用|保存该调用按具体参数计算出的返回值|追加具体参数 当前元素|按具体键值参数 当前键和值|按具体参数 当前索引或条件|写入具体参数 当前值|标准输出写入具体参数 当前值|[^\r\n。]+按这次调用的具体参数完成更新|处理当前语句中的具体状态|后续代码可观察该调用产生的状态|该配置语句明确示例中的具体边界/u
const FORBIDDEN_NO_INFORMATION_COMMENT_PATTERN = /^(?:(?:TODO|FIXME|TBD)(?:\s*[:：])?\s*(?:(?:待补充(?:具体说明)?|此处(?:需要)?补充(?:具体)?说明|执行后得到预期结果|操作成功|如上所述|输出结果如下|此处省略))?|(?:调用参数\s*[:：]\s*代码依次使用\s+\S+)|待补充(?:具体说明)?|此处(?:需要)?补充(?:具体)?说明|执行后得到预期结果|操作成功|如上所述|输出结果如下|此处省略|输入表达式为\s*.+|(?:创建|构造)\s*\w+，?\s*构造参数保留在外层调用中|将\s*.+?\s*的计算结果写入\s*.+?；?\s*赋值完成|.+构造参数保留在外层调用中|.+的计算结果写入.+赋值完成)[。.!！]?$/iu

function inspectJavaCodeComments(code) {
  const lines = code.split(/\r?\n/u)
  const issues = []
  for (let index = 0; index < lines.length; index += 1) {
    const commentMatch = lines[index].match(/^\s*\/\/\s*(.*)$/u)
    if (!commentMatch) continue
    const comment = commentMatch[1].trim().replace(/[。.!?]+$/u, '')
    if (FORBIDDEN_NO_INFORMATION_COMMENT_PATTERN.test(comment)) {
      issues.push(`line ${index + 1} generic or mechanical comment: ${comment}`)
    }
    if (/^(?:输入|初始(?:状态)?|前置(?:条件)?)\s*[:：]/u.test(comment)) continue

    const adjacent = [lines[index - 1] ?? '', lines[index + 1] ?? '']
      .map((line) => line.trim())
      .filter((line) => line && !line.startsWith('//') && !/^(?:import|package)\b/u.test(line))
    const normalizedComment = comment
      .replace(/^(?:输入|初始(?:状态)?|前置(?:条件)?|作用|关键变化|当前状态|效果|说明)\s*[:：]\s*/u, '')
      .replace(/[。.!?;；]+$/u, '')
      .replace(/\s+/gu, ' ')
      .toLowerCase()
    if (normalizedComment.length < 8) continue
    if (adjacent.some((statement) => {
      const normalizedStatement = statement
        .replace(/[;{}]+$/gu, '')
        .replace(/\s+/gu, ' ')
        .trim()
        .toLowerCase()
      const withoutDeclaration = normalizedStatement
        .replace(/^(?:(?:final\s+)?(?:var|[A-Za-z_$][\w$.]*(?:<[^>]+>)?(?:\[\])?)\s+)(?=[A-Za-z_$][\w$]*\s*=)/u, '')
      return normalizedComment === normalizedStatement || normalizedComment === withoutDeclaration
    })) {
      issues.push(`line ${index + 1} comment repeats adjacent code: ${comment}`)
    }
  }
  return issues
}

const WEAK_EXPLANATION_ANCHORS = new Set([
  'abstract', 'boolean', 'break', 'byte', 'case', 'catch', 'char', 'class', 'const',
  'continue', 'default', 'do', 'double', 'else', 'enum', 'extends', 'false', 'final',
  'finally', 'float', 'for', 'goto', 'if', 'implements', 'import', 'instanceof', 'int',
  'interface', 'Java', 'long', 'native', 'new', 'null', 'package', 'private', 'protected',
  'public', 'record', 'Redis', 'return', 'sealed', 'short', 'static', 'String', 'super',
  'switch', 'synchronized', 'this', 'throw', 'throws', 'transient', 'true', 'try', 'var',
  'void', 'volatile', 'while', 'yield',
])

function isMeaningfulExplanationAnchor(token) {
  return !WEAK_EXPLANATION_ANCHORS.has(token) && !WEAK_EXPLANATION_ANCHORS.has(token.toLowerCase())
}

function getExplanationAnchors(heading, code) {
  const headingLabel = heading.split(/[：:]/u, 1)[0].replaceAll('`', '')
  const headingTokens = [...headingLabel.matchAll(/@?[A-Za-z_$][\w$]*(?:\.[A-Za-z_$][\w$]*)*/gu)]
    .map((match) => match[0])
  const codeWithoutComments = code
    .replace(/\/\*[\s\S]*?\*\//gu, ' ')
    .replace(/^\s*(?:\/\/|--|#).*$/gmu, ' ')
  const codeAnchors = [
    ...[...codeWithoutComments.matchAll(/\b[A-Za-z_$][\w$]*\b/gu)].map((match) => match[0]),
    ...[...codeWithoutComments.matchAll(/"(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'|\b\d+(?:\.\d+)?\b/gu)].map((match) => match[0]),
  ]
  return [...new Set([...headingTokens, ...codeAnchors])]
    .filter((token) => token.length > 1 && isMeaningfulExplanationAnchor(token))
}

function getLanguageComments(language, code) {
  if (language === 'xml') {
    return [...code.matchAll(/<!--[\s\S]*?-->/gu)].map((match) =>
      match[0].replace(/^<!--|-->$/gu, '').trim(),
    )
  }

  const marker = ['java'].includes(language) ? '//' : language === 'sql' ? '--' : '#'
  return code
    .split(/\r?\n/u)
    .map((line) => line.trim())
    .filter((line) => line.startsWith(marker))
    .map((line) => line.slice(marker.length).trim())
}

function getJavaStatementComment(code, statementIndex) {
  const lines = code.split(/\r?\n/u)
  const comments = []
  for (let index = statementIndex + 1; index < lines.length; index += 1) {
    const nextLine = lines[index].trim()
    if (!nextLine.startsWith('//')) break
    comments.push(nextLine.slice(2).trim())
  }
  return comments.join('\n')
}

function getJavaStatementEndIndex(code, statementIndex) {
  const lines = code.split(/\r?\n/u)
  let annotationDepth = 0
  const startsWithAnnotation = /^\s*@[A-Za-z_$][\w$]*(?:\.[A-Za-z_$][\w$]*)*\s*\(/u.test(lines[statementIndex] ?? '')
  for (let index = statementIndex; index < lines.length; index += 1) {
    const trimmed = lines[index].trim()
    if (startsWithAnnotation || annotationDepth > 0) {
      annotationDepth += (trimmed.match(/\(/gu) || []).length
      annotationDepth -= (trimmed.match(/\)/gu) || []).length
      if (annotationDepth <= 0) return index
      continue
    }
    if (/[;{}]\s*$/u.test(trimmed)) return index
    // An annotation declaration is a complete operation even though Java
    // does not terminate it with `;`; its adjacent contract comment belongs
    // directly after the annotation line, before the annotated declaration.
    if (/^@[A-Za-z_$][\w$]*(?:\([^\n]*\))?\s*$/u.test(trimmed)) return index
  }
  return statementIndex
}

function inspectJavaOutputContract(code) {
  const lines = code.split(/\r?\n/u)
  const issues = []
  const outputValues = new Map()
  for (let index = 0; index < lines.length; index += 1) {
    if (!JAVA_OUTPUT_CALL_PATTERN.test(lines[index])) continue
    const end = getJavaStatementEndIndex(code, index)
    const next = lines[end + 1]?.trim() ?? ''
    const outputMatch = next.match(/^\/\/\s*输出\s*[:：]\s*(\S.*)$/u)
    if (!outputMatch) {
      issues.push(`output at line ${index + 1} is not followed by one standalone 输出 comment`)
      continue
    }
    const comment = getJavaStatementComment(code, end)
    if (/\/\/\s*输出\s*[:：]/u.test(comment)) {
      issues.push(`output at line ${index + 1} contains recursive 输出 text`)
    }
    const value = outputMatch[1].trim()
    if (outputValues.has(value)) {
      issues.push(`output at line ${index + 1} reuses the comment for line ${outputValues.get(value)}`)
    } else {
      outputValues.set(value, index + 1)
    }
  }
  return issues
}

function isJavaApiOperationLine(text) {
  const trimmed = text.trim()
  if (/^(?:for|if|while|switch|catch|synchronized)\s*\(/u.test(trimmed)) return false
  if (/^@?[A-Za-z_$][\w$]*\s*$/u.test(trimmed) && trimmed.startsWith('@')) return false
  // A declaration such as `public boolean equals(...) {` is not the call
  // documented by an API heading; the invocation inside the example is.
  if (trimmed.endsWith('{') && !/->\s*\{/u.test(trimmed) && !/\b(?:return|new)\b/u.test(trimmed)) return false
  return true
}

function hasNonOutputJavaCall(text) {
  const methodNames = [...text.matchAll(/\b[A-Za-z_$][\w$]*\s*\.\s*([A-Za-z_$][\w$]*)\s*\(/gu)]
    .map((match) => match[1])
  return methodNames.some((name) => !['print', 'println', 'printf'].includes(name))
}

function getJavaOperationCandidates(codeLines) {
  return codeLines.filter(({ text }) => {
    if (!isJavaApiOperationLine(text)) return false
    if (JAVA_OUTPUT_CALL_PATTERN.test(text)) return false
    if (/^\s*(?:package|import)\s/u.test(text)) return false
    if (/\b(?:class|interface|record|enum)\s+[A-Za-z_$][\w$]*/u.test(text)) return false
    if (/\bmain\s*\(/u.test(text)) return false
    return /\bnew\s+[A-Z_$][\w$]*\s*(?:<[^>]*>)?\s*\(/u.test(text) || hasNonOutputJavaCall(text)
  })
}

const JAVA_SETUP_IGNORED_TOKENS = new Set([
  'abstract', 'boolean', 'break', 'byte', 'case', 'catch', 'char', 'class', 'const',
  'continue', 'default', 'do', 'double', 'else', 'enum', 'extends', 'false', 'final',
  'finally', 'float', 'for', 'goto', 'if', 'implements', 'import', 'instanceof', 'int',
  'interface', 'long', 'native', 'new', 'null', 'package', 'private', 'protected',
  'public', 'record', 'return', 'sealed', 'short', 'static', 'super', 'switch',
  'synchronized', 'this', 'throw', 'throws', 'transient', 'true', 'try', 'var', 'void',
  'volatile', 'while', 'yield',
])

function hasConcreteJavaStatementReference(comment, statement) {
  const codeWithoutComments = statement.replace(/\/\/.*$/u, '')
  const normalizedStatement = codeWithoutComments.replace(/\s+/gu, ' ').trim().replace(/;\s*$/u, '')
  const normalizedComment = comment.replace(/\s+/gu, ' ').trim()
  if (normalizedStatement.length > 0 && normalizedComment.includes(normalizedStatement)) return true
  const callNames = new Set(
    [...codeWithoutComments.matchAll(/\b(?:new\s+)?([A-Za-z_$][\w$]*)\s*\(/gu)]
      .map((match) => match[1]),
  )
  const identifiers = [...codeWithoutComments.matchAll(/\b[A-Za-z_$][\w$]*\b/gu)]
    .map((match) => match[0])
    .filter((token) =>
      token.length > 1 &&
      !JAVA_SETUP_IGNORED_TOKENS.has(token) &&
      !callNames.has(token),
    )
  const literals = [
    ...codeWithoutComments.matchAll(/"(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'|\b\d+(?:\.\d+)?\b/gu),
  ].map((match) => match[0])
  return [...new Set([...identifiers, ...literals])].some((anchor) => comment.includes(anchor))
}

function hasConcreteJavaActionComment(comment, statement) {
  return (
    JAVA_ACTION_COMMENT_LABEL.test(comment) &&
    hasConcreteJavaStatementReference(comment, statement) &&
    JAVA_ACTION_EFFECT_PATTERN.test(comment)
  )
}

function inspectJavaStatementAdjacentComments(heading, code) {
  const lines = code.split(/\r?\n/u)
  const codeLines = lines
    .map((line, index) => ({ index, text: line.trim() }))
    .filter(({ text }) =>
      text !== '' &&
      !text.startsWith('//') &&
      !/^(?:package|import)\s/u.test(text) &&
      !/^[{}]+;?$/u.test(text),
    )
  if (codeLines.length === 0) return []

  const headingLabel = heading.split(/[：:]/u, 1)[0].replaceAll('`', '')
  const apiName = headingLabel.match(/(@?[A-Za-z_$][\w$]*)\s*$/u)?.[1] ?? ''
  const bareApiName = apiName.replace(/^@/u, '')
  const escapedApiName = bareApiName.replace(/[.*+?^${}()|[\]\\]/gu, '\\$&')
  const keyPattern = apiName === ''
    ? null
    : apiName.startsWith('@')
      ? new RegExp(`@${escapedApiName}\\b`, 'u')
      : new RegExp(`(?:\\b${escapedApiName}\\s*\\(|\\bnew\\s+${escapedApiName}\\b)`, 'u')
  const explicitKeyLines = keyPattern
    ? codeLines.filter(({ text }) =>
      keyPattern.test(text) &&
      isJavaApiOperationLine(text) &&
      !JAVA_OUTPUT_CALL_PATTERN.test(text),
    )
    : []
  const broadHeading = !keyPattern ||
    ['BlockingQueue', 'CountDownLatch'].includes(headingLabel) ||
    headingLabel === '读写短文本文件'
  const keyLines = broadHeading ? getJavaOperationCandidates(codeLines) : explicitKeyLines
  const setupCandidates = codeLines.filter(({ index, text }) =>
    (keyLines.length === 0 || index <= keyLines[0].index) &&
    (!keyPattern || !keyPattern.test(text)) &&
    !JAVA_OUTPUT_CALL_PATTERN.test(text) &&
    /(?:\bnew\s+|\b(?:var|byte|short|int|long|float|double|boolean|char|String|List|Set|Map|Queue|Deque|Path|File|URI|URL|Optional|Stream|LocalDate|LocalTime|LocalDateTime|Instant|Duration|Period|Pattern|Matcher|Class|Method|Field|Constructor|Thread|Executor\w*|Future|CompletableFuture|Atomic\w*|CountDownLatch|Semaphore|CyclicBarrier|ReentrantLock|ReadWriteLock|StampedLock|ObjectMapper|JSONObject|Workbook|Sheet|Row|CellStyle|JobDataMap)\b[^;=]*=)/u.test(text),
  )
  const setupLine = setupCandidates.find(({ index }) => {
    const statementEnd = getJavaStatementEndIndex(code, index)
    return JAVA_INPUT_COMMENT_LABEL.test(getJavaStatementComment(code, statementEnd))
  }) ?? setupCandidates[0]

  const issues = []
  if (setupLine) {
    const setupEnd = getJavaStatementEndIndex(code, setupLine.index)
    const comment = getJavaStatementComment(code, setupEnd)
    if (!JAVA_INPUT_COMMENT_LABEL.test(comment)) {
      issues.push(`[${heading}] first java block must explain the input or initial state on the line after its setup statement`)
    } else if (!hasConcreteJavaStatementReference(comment, codeLines.find(({ index }) => index === setupLine.index)?.text ?? '')) {
      issues.push(`[${heading}] first java block setup comment must include a concrete input or initial value`)
    }
  }

  const controlOnlyHeading = /^(?:for|do-while|while|if|switch|try|catch|synchronized)$/u.test(headingLabel)
  const effectiveKeyLines = keyLines.length > 0
    ? keyLines
    : !keyPattern && setupLine && !controlOnlyHeading
      ? [setupLine]
      : []
  for (const [keyIndex, keyLine] of effectiveKeyLines.entries()) {
    const keyEnd = getJavaStatementEndIndex(code, keyLine.index)
    const keyComment = getJavaStatementComment(code, keyEnd)
    const keyIsObservableOutput = JAVA_OUTPUT_CALL_PATTERN.test(keyLine.text)
    if (keyIndex === 0 && !setupLine && !keyIsObservableOutput && !JAVA_INPUT_COMMENT_LABEL.test(keyComment)) {
      issues.push(`[${heading}] first java block must explain the input on the line after its key statement when no setup statement exists`)
    }
    if (!hasConcreteJavaActionComment(keyComment, keyLine.text)) {
      issues.push(`[${heading}] first java block must explain the API call or state change on the line after its key statement`)
    }
  }

  const outputLines = codeLines.filter(({ text }) => JAVA_OUTPUT_CALL_PATTERN.test(text))
  for (const outputLine of outputLines) {
    const outputComment = getJavaStatementComment(code, getJavaStatementEndIndex(code, outputLine.index))
    if (!JAVA_RESULT_COMMENT_LABEL.test(outputComment)) {
      issues.push(`[${heading}] first java block must put its result/output comment on the line after the observable statement`)
      break
    }
  }
  return issues
}

function inspectApiExampleComments(body) {
  const issues = []
  for (const { heading, content } of getSupportedApiH3Subsections(body)) {
    const blocks = [...content.matchAll(/```([^\s`]+)[^\r\n]*\r?\n([\s\S]*?)```/gu)]
    const firstSupportedBlock = blocks.find((match) =>
      COMMON_USAGE_CODE_LANGUAGES.has(match[1].toLowerCase()),
    )
    const language = firstSupportedBlock[1].toLowerCase()
    const comments = getLanguageComments(language, firstSupportedBlock[2])
    const explanationComments = comments.filter((comment) => EXPLANATION_COMMENT_LABEL.test(comment))
    if (explanationComments.length === 0) {
      issues.push(`[${heading}] first ${language} block needs an explanation comment`)
    } else if (!['properties', 'yaml', 'xml'].includes(language)) {
      const anchors = getExplanationAnchors(heading, firstSupportedBlock[2])
      const hasAnchoredExplanation = explanationComments.some((comment) =>
        anchors.some((anchor) => comment.includes(anchor)),
      )
      if (!hasAnchoredExplanation) {
        issues.push(`[${heading}] first ${language} block explanation must name its API or a real code identifier/literal`)
      } else if (language === 'java') {
        issues.push(...inspectJavaStatementAdjacentComments(heading, firstSupportedBlock[2]))
      }
    }
    if (!comments.some((comment) => RESULT_COMMENT_LABEL.test(comment))) {
      issues.push(`[${heading}] first ${language} block needs a result/output comment`)
    }
  }
  return issues
}

function inspectBackendUsage(content, { requireOutput = true } = {}) {
  if (typeof content !== 'string' || content.trim() === '') return ['usage subsection is empty']

  const lines = content.split(/\r?\n/)
  const firstCodeIndex = lines.findIndex((line) => /^\s*```(?:java|sql|xml)(?:\s|$)/iu.test(line))
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
    issues.push('needs a java, sql, or xml code block')
  } else {
    for (const { code } of blocks) {
      if (stripBackendComments(code) === '') {
        issues.push('java/sql/xml code block must contain at least one real code line')
      }
    }
  }

  if (
    requireOutput &&
    !blocks.some(({ code }) => hasStandaloneBackendOutputComment(code)) &&
    !/^\s*结果\s*[:：]\s*\S.*$/mu.test(content)
  ) {
    issues.push('needs a standalone output/result comment')
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
    path: 'docs/courses/java/14-后端工程/00-runtime-fixture.md',
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

function getArticleContractHeadings(body, level) {
  const lines = body.split(/\r?\n/u)
  const marker = '#'.repeat(level)
  const headingPattern = new RegExp(`^${marker}(?!#)\\s+(\\S.*)$`, 'u')
  const headings = []
  let inFence = false

  lines.forEach((line, index) => {
    if (/^\s*```/u.test(line)) {
      inFence = !inFence
      return
    }
    if (!inFence) {
      const match = line.match(headingPattern)
      if (match) headings.push({ index, heading: match[1].trim() })
    }
  })
  return headings
}

function getArticleContractSection(body, label) {
  const headings = getArticleContractHeadings(body, 2)
  const start = headings.find((entry) => entry.heading === label)
  if (!start) return null
  const end = headings.find((entry) => entry.index > start.index)
  const lines = body.split(/\r?\n/u)
  return lines.slice(start.index + 1, end?.index ?? lines.length).join('\n').trim()
}

function getArticleContractH3Subsections(section) {
  if (section === null) return []
  const lines = section.split(/\r?\n/u)
  const starts = []
  let inFence = false
  lines.forEach((line, index) => {
    if (/^\s*```/u.test(line)) {
      inFence = !inFence
      return
    }
    if (!inFence) {
      const match = line.match(/^###\s+(\S.*)$/u)
      if (match) starts.push({ index, heading: match[1].trim() })
    }
  })
  return starts.map((start, index) => ({
    heading: start.heading,
    content: lines.slice(start.index + 1, starts[index + 1]?.index ?? lines.length).join('\n').trim(),
  }))
}

function getArticleContractCodeBlocks(content) {
  return [...content.matchAll(/```([A-Za-z][\w-]*)[^\r\n]*\r?\n([\s\S]*?)```/gu)].map((match) => {
    const matchStart = match.index ?? 0
    const codeStart = matchStart + match[0].indexOf(match[2])
    const codeStartLine = content.slice(0, codeStart).split(/\r?\n/u).length - 1
    return {
      language: match[1].toLowerCase(),
      code: match[2],
      codeStartLine,
    }
  })
}

function stripArticleContractComments(code, language) {
  const withoutBlocks = code.replace(/\/\*[\s\S]*?\*\//gu, '')
  const commentPattern = language === 'java'
    ? /^\s*\/\/.*$/u
    : language === 'sql'
      ? /^\s*(?:--|#).*$/u
      : /^\s*(?:#|\/\/|--).*$/u
  return withoutBlocks
    .split(/\r?\n/u)
    .filter((line) => !commentPattern.test(line))
    .join('\n')
    .trim()
}

function lexArticleContractCode(code, language) {
  const lineCommentMarkers = language === 'java'
    ? ['//']
    : language === 'sql'
      ? ['--', '#']
      : ['#']
  const executable = []
  const semantic = []
  const stringLiterals = []
  const comments = []
  let blockComment = false
  let lineComment = false
  let commentValue = ''
  let commentStart = 0
  let commentLine = 0
  let quote = null
  let literalValue = ''
  let literalStart = 0
  let literalLine = 0
  let line = 0

  const appendSpace = () => { executable.push(' '); semantic.push(' ') }
  const appendNewline = () => {
    executable.push('\n')
    semantic.push('\n')
    line += 1
  }

  for (let index = 0; index < code.length; index += 1) {
    const current = code[index]
    const next = code[index + 1] ?? ''

    if (lineComment) {
      if (current === '\n') {
        comments.push({ value: commentValue.trim(), start: commentStart, line: commentLine })
        lineComment = false
        commentValue = ''
        appendNewline()
      } else if (current === '\r' && next === '\n') {
        appendSpace()
      } else {
        commentValue += current
        appendSpace()
      }
      continue
    }

    if (blockComment) {
      if (current === '*' && next === '/') {
        comments.push({ value: commentValue.trim(), start: commentStart, line: commentLine })
        appendSpace()
        appendSpace()
        index += 1
        blockComment = false
        commentValue = ''
      } else if (current === '\n') {
        commentValue += current
        appendNewline()
      } else {
        commentValue += current
        appendSpace()
      }
      continue
    }

    if (quote !== null) {
      if (current === '\\' && next) {
        literalValue += next
        appendSpace()
        appendSpace()
        semantic[semantic.length - 2] = current
        semantic[semantic.length - 1] = next
        index += 1
        continue
      }
      if (current === quote) {
        // SQL escapes a quote by doubling it; keep the doubled quote inside
        // one literal rather than ending the literal early.
        if (next === quote) {
          literalValue += current
          appendSpace()
          appendSpace()
          semantic[semantic.length - 2] = current
          semantic[semantic.length - 1] = next
          index += 1
          continue
        }
        stringLiterals.push({
          value: literalValue,
          start: literalStart,
          end: index + 1,
          line: literalLine,
        })
        appendSpace()
        semantic[semantic.length - 1] = current
        quote = null
        literalValue = ''
        continue
      }
      if (current === '\n') {
        literalValue += current
        appendNewline()
        semantic[semantic.length - 1] = current
      } else {
        literalValue += current
        appendSpace()
        semantic[semantic.length - 1] = current
      }
      continue
    }

    if (current === '/' && next === '*') {
      commentStart = index
      commentLine = line
      commentValue = ''
      appendSpace()
      appendSpace()
      index += 1
      blockComment = true
      continue
    }

    const commentMarker = lineCommentMarkers.find((marker) =>
      code.startsWith(marker, index),
    )
    if (commentMarker) {
      commentStart = index
      commentLine = line
      commentValue = ''
      for (let markerIndex = 0; markerIndex < commentMarker.length; markerIndex += 1) appendSpace()
      index += commentMarker.length - 1
      lineComment = true
      continue
    }

    if (language === 'java' && code.startsWith('"""', index)) {
      const end = code.indexOf('"""', index + 3)
      const literalEnd = end < 0 ? code.length : end
      const value = code.slice(index + 3, literalEnd)
      stringLiterals.push({ value, start: index, end: end < 0 ? code.length : end + 3, line })
      const consumed = code.slice(index, end < 0 ? code.length : end + 3)
      for (const char of consumed) {
        if (char === '\n') appendNewline()
        else appendSpace()
      }
      index = (end < 0 ? code.length : end + 3) - 1
      continue
    }

    if (current === '"' || current === "'" || (language === 'sql' && current === '`')) {
      quote = current
      literalValue = ''
      literalStart = index
      literalLine = line
      appendSpace()
      semantic[semantic.length - 1] = current
      continue
    }

      executable.push(current)
      semantic.push(current)
    if (current === '\n') line += 1
  }

  if (lineComment || blockComment) {
    comments.push({ value: commentValue.trim(), start: commentStart, line: commentLine })
  }

  return {
    executable: executable.join(''),
    semantic: semantic.join(''),
    stringLiterals,
    comments,
  }
}

function hasArticleContractTautologicalComment(code, language) {
  const lexical = lexArticleContractCode(code, language)
  const statements = lexical.semantic
    .split(/;|\r?\n/u)
    .map((statement) => statement.replace(/\s+/gu, ' ').trim())
    .filter(Boolean)
  return lexical.comments.some(({ value }) => {
    const comment = value
      .replace(/^(?:输入|初始(?:状态)?|前置(?:条件)?|作用|关键变化|当前状态|效果|输出|结果|返回|说明)\s*[:：]\s*/u, '')
      .replace(/[。.!?]+$/u, '')
      .replace(/\s+/gu, ' ')
      .trim()
      .toLowerCase()
    if (!comment) return false
    return statements.some((statement) => {
      const normalizedStatement = statement
        .replace(/^(?:(?:final\s+)?(?:var|[A-Za-z_$][\w$]*(?:<[^>]+>)?)\s+)?(?=[A-Za-z_$][\w$]*\s*=)/u, '')
        .replace(/[。.!?]+$/u, '')
        .toLowerCase()
      return normalizedStatement.length >= 8 && comment === normalizedStatement
    })
  })
}

function hasArticleContractNoInformationComment(code, language) {
  return lexArticleContractCode(code, language).comments.some(({ value }) =>
    FORBIDDEN_NO_INFORMATION_COMMENT_PATTERN.test(value.trim().replace(/^[:：\s]+/u, '')),
  )
}

function getArticleContractEvidenceLines(content, pattern) {
  return content
    .split(/\r?\n/u)
    .map((line) => line.trim())
    .filter((line) => pattern.test(line))
    .map((line) => line.replace(/^(?:\/\/|--|#)\s*/u, '').trim())
}

function isConcreteArticleContractEvidence(value) {
  const plain = stripMarkdown(value)
    .replace(/^(?:输入|初始(?:状态)?|前置(?:条件)?|作用|关键变化|当前状态|效果)\s*[:：]\s*/u, '')
    .trim()
  if (plain.length < 4) return false
  if (/^(?:具体|给定|某个|相关|预期|示例输入|示例参数|执行后得到预期结果)/u.test(plain)) return false
  return /(?:["'“”`][^"'“”`]+["'“”`]|\b\d+(?:\.\d+)?\b|[A-Za-z_$][\w$]*(?:[:._-][\w$-]+)?)/u.test(plain)
}

function hasArticleContractInitialState(content, blocks) {
  const initialLines = getArticleContractEvidenceLines(
    content,
    /(?:输入|初始(?:状态)?|前置(?:条件)?|initial(?:\s+state|\s+input)|before)\s*[:：]/iu,
  )
  if (initialLines.some(isConcreteArticleContractEvidence)) return true

  return blocks.some(({ language, code }) => {
    const executable = stripArticleContractComments(code, language)
    if (!executable || /<[^>]+>|\$\{[^}]+\}|\?\s*(?:,|\)|$)/u.test(executable)) return false
    if (language === 'sql') {
      return /\b(?:INSERT\s+INTO|CREATE\s+TABLE|SELECT[\s\S]*\bWHERE\b)\b/iu.test(executable) &&
        /(?:["'][^"']+["']|\b\d+\b)/u.test(executable)
    }
    if (['redis', 'shell', 'bash', 'sh'].includes(language)) {
      return /^(?:SET|HSET|LPUSH|RPUSH|SADD|ZADD|XADD)\s+\S+\s+\S+/imu.test(executable) &&
        /(?:["'][^"']+["']|\b\d+\b|[A-Za-z0-9_-]+:[A-Za-z0-9_:-]+)/u.test(executable)
    }
    if (language === 'java') {
      return /\b(?:byte|short|int|long|float|double|boolean|char|String|var|List<[^>]+>)\s+[A-Za-z_$][\w$]*\s*=\s*(?:["'\d]|List\.of\(|new\s+)/u.test(executable)
    }
    return false
  })
}

function hasArticleContractTransition(content) {
  const transitionLines = getArticleContractEvidenceLines(
    content,
    /(?:作用|关键变化|当前状态|效果|transition|after)\s*[:：]/iu,
  )
  return transitionLines.some((line) =>
    isConcreteArticleContractEvidence(line) && JAVA_ACTION_EFFECT_PATTERN.test(line),
  )
}

function hasArticleContractObservableResult(content, blocks) {
  const resultLines = getArticleContractEvidenceLines(
    content,
    /(?:输出|结果|返回|响应|断言|日志|observable|result)\s*[:：]/iu,
  )
  if (resultLines.some(isConcreteArticleContractEvidence)) return true

  return blocks.some(({ language, code }) => {
    const executable = stripArticleContractComments(code, language)
    return (
      /\bSystem\.out\.(?:print|println|printf)\s*\(/u.test(executable) ||
      /\b(?:assert|assertEquals|echo|SELECT)\b/iu.test(executable)
    )
  })
}

function getArticleContractOperationHeadingLabel(heading) {
  return heading.split(/[：:]/u, 1)[0].replaceAll('`', '').trim()
}

function getArticleContractJavaExecutable(content) {
  return getArticleContractCodeBlocks(content)
    .filter(({ language }) => language === 'java')
    .map(({ code }) => lexArticleContractCode(code, 'java').executable)
    .join('\n')
}

function isArticleContractOperationHeading(heading, content = '') {
  const label = getArticleContractOperationHeadingLabel(heading)
  if (/^(START TRANSACTION|SAVEPOINT|ANALYZE TABLE)(?:\s|$)/iu.test(label)) {
    const command = label.match(/^(START TRANSACTION|SAVEPOINT|ANALYZE TABLE)/iu)[1]
    return getArticleContractCodeBlocks(content).some(({ code, language }) =>
      language === 'sql' && new RegExp(`(?:^|[;\\n])\\s*${command.replaceAll(' ', '\\s+')}\\b`, 'imu').test(lexArticleContractCode(code, language).executable),
    )
  }
  if (/^(mysql|USE|RENAME TABLE|REPLACE)$/iu.test(label)) {
    return getArticleContractCodeBlocks(content).some(({ code, language }) =>
      ['sql', 'shell', 'bash', 'sh'].includes(language) &&
      new RegExp(`(?:^|[;\\n])\\s*${label.replaceAll(' ', '\\s+')}\\b`, 'imu').test(lexArticleContractCode(code, language).executable),
    )
  }
  if (!label || /^(?:示例|操作|用法|案例|说明|注意|风险|边界)/u.test(label)) return false
  const sqlOrRedis = label.match(/^(SELECT|INSERT|UPDATE|DELETE|SET|GET|MGET|MSET|INCR|DECR|HSET|HGET|HMGET|HGETALL|HSCAN|LPUSH|RPUSH|LPOP|RPOP|SADD|SMEMBERS|ZADD|ZRANGE|EXISTS|EXPIRE|TTL|SCAN|FLUSHALL|FLUSHDB|KEYS|DEL|UNLINK|TRUNCATE|DROP|CREATE|ALTER|LOCK|UNLOCK|EXPLAIN|WITH|SHOW|DESCRIBE|MYSQLDUMP|BACKUP|RESTORE|EVAL|EVALSHA|SCRIPT|MONITOR|DEBUG|REPLICAOF|SLAVEOF|MIGRATE|SLOWLOG|INFO|LATENCY|MEMORY|CONFIG)(?:\s+(TABLE|DATABASE|INSTANCE|TABLES|INTO))?/iu)
  if (sqlOrRedis) {
    const operationPattern = sqlOrRedis[1].replace(/[.*+?^${}()|[\]\\]/gu, '\\$&')
    const sources = getArticleContractCodeBlocks(content)
      .flatMap(({ language, code }) => {
        if (['sql', 'redis', 'shell', 'bash', 'sh'].includes(language)) {
          return [lexArticleContractCode(code, language).executable]
        }
        if (language === 'java') {
          return getJavaExecutionStringLiterals(code).map(({ value, mode }) =>
            mode === 'jdbc' ? lexArticleContractCode(value, 'sql').executable : value,
          )
        }
        return []
      })
      .join('\n')
    const commandPrefix = '(?:redis-cli\\s+(?:(?:-[A-Za-z][\\w-]*|--[\\w-]+)(?:\\s+\\S+)?\\s+)*)?'
    return new RegExp(`(?:^|[;\\n])\\s*${commandPrefix}${operationPattern}\\b`, 'iu').test(sources)
  }

  const javaLike = /^@?[A-Za-z_$][\w$]*(?:\.[A-Za-z_$][\w$]*)*(?:\([^)]*\))?$/u
  if (!javaLike.test(label)) return false
  const executable = getArticleContractJavaExecutable(content)
  const normalized = label.replace(/\([^)]*\)$/u, '')
  const knownApiHeading = Object.values(REQUIRED_EXTERNAL_API_HEADINGS)
    .flat()
    .some((entry) => entry === normalized)
  if (!executable.trim()) return knownApiHeading
  const escaped = normalized.replace(/[.*+?^${}()|[\]\\]/gu, '\\$&')

  if (normalized.startsWith('@')) {
    return new RegExp(`${escaped}\\b`, 'u').test(executable)
  }

  const segments = normalized.split('.')
  const method = segments.at(-1) ?? normalized
  const escapedMethod = method.replace(/[.*+?^${}()|[\]\\]/gu, '\\$&')
  if (segments.length > 1) {
    const receiver = segments.slice(0, -1).join('.')
    const escapedReceiver = receiver.replace(/[.*+?^${}()|[\]\\]/gu, '\\$&')
    if (new RegExp(`\\b${escapedReceiver}\\s*\\.\\s*${escapedMethod}\\s*\\(`, 'u').test(executable)) return true
    // Match the method immediately after this constructor's balanced argument
    // list, so another expression's method cannot supply receiver evidence.
    const constructorPattern = new RegExp(`\\bnew\\s+${escapedReceiver}(?:\\s*<[^>]*>)?\\s*\\(`, 'gu')
    for (const constructor of executable.matchAll(constructorPattern)) {
      let depth = 1
      let end = constructor.index + constructor[0].length
      while (end < executable.length && depth > 0) {
        if (executable[end] === '(') depth += 1
        if (executable[end] === ')') depth -= 1
        end += 1
      }
      if (depth === 0 && new RegExp(`^\\s*\\.\\s*${escapedMethod}\\s*\\(`, 'u').test(executable.slice(end))) return true
    }
    const typedVariable = executable.match(new RegExp(`\\b${escapedReceiver}(?:<[^>]+>)?\\s+([A-Za-z_$][\\w$]*)\\s*=`, 'u'))?.[1]
    const inferredVariable = executable.match(new RegExp(`\\bvar\\s+([A-Za-z_$][\\w$]*)\\s*=\\s*new\\s+${escapedReceiver}(?:<[^>]*>)?\\s*\\(`, 'u'))?.[1]
    const implementationType = receiver === 'List' ? '(?:ArrayList|LinkedList|Vector)' : receiver === 'Set' ? '(?:HashSet|LinkedHashSet|TreeSet)' : receiver === 'Map' ? '(?:HashMap|LinkedHashMap|TreeMap)' : escapedReceiver
    const compatibleVariable = executable.match(new RegExp(`\\bvar\\s+([A-Za-z_$][\\w$]*)\\s*=\\s*new\\s+${implementationType}(?:<[^>]*>)?\\s*\\(`, 'u'))?.[1]
    const receiverVariable = typedVariable ?? inferredVariable ?? compatibleVariable
    if (receiverVariable && new RegExp(`\\b${receiverVariable}\\s*\\.\\s*${escapedMethod}\\s*\\(`, 'u').test(executable)) return true
    return receiver === 'List' && new RegExp(`\\bList\\s*\\.\\s*of\\s*\\([\\s\\S]*?\\)\\s*\\.\\s*${escapedMethod}\\s*\\(`, 'u').test(executable)
  }

  const builtInType = new Set([
    'String', 'StringBuilder', 'StringBuffer', 'List', 'Set', 'Map', 'Queue', 'Deque',
    'Path', 'File', 'URI', 'URL', 'Optional', 'Stream', 'LocalDate', 'LocalTime',
    'LocalDateTime', 'Instant', 'Duration', 'Period', 'Pattern', 'Matcher', 'Class',
  ])
  return new RegExp(`\\bnew\\s+${escaped}(?:\\s*<[^>]*>)?\\s*\\(`, 'u').test(executable) ||
    new RegExp(`\\b${escaped}\\s*\\.\\s*[A-Za-z_$][\\w$]*\\s*\\(`, 'u').test(executable) ||
    (builtInType.has(normalized) && new RegExp(`\\b${escaped}\\s+[A-Za-z_$][\\w$]*\\s*=`, 'u').test(executable))
}

function getDangerousArticleContractOperations(code, language) {
  return getHardenedDangerousArticleContractOperations(code, language)
}

function getArticleContractLineIndex(text, offset) {
  return text.slice(0, offset).split(/\r?\n/u).length - 1
}

function getArticleContractStatementAround(executable, offset) {
  const start = executable.lastIndexOf(';', offset) + 1
  const semicolonEnd = executable.indexOf(';', offset)
  const end = semicolonEnd < 0 ? executable.length : semicolonEnd
  return { start, end, text: executable.slice(start, end) }
}

function splitSqlBoolean(text, operator) {
  const parts = []
  let quote = null
  let depth = 0
  let start = 0
  for (let index = 0; index < text.length; index += 1) {
    const char = text[index]
    if (quote) {
      if (char === quote && text[index + 1] === quote) index += 1
      else if (char === quote) quote = null
      continue
    }
    if (char === "'" || char === '"' || char === '`') { quote = char; continue }
    if (char === '(') { depth += 1; continue }
    if (char === ')') { depth -= 1; continue }
    const match = depth === 0 && text.slice(index).match(new RegExp(`^\\b${operator}\\b`, 'iu'))
    if (match) { parts.push(text.slice(start, index).trim()); index += match[0].length - 1; start = index + 1 }
  }
  parts.push(text.slice(start).trim())
  return parts
}

function isArticleContractTautologicalWhere(where) {
  const stripBalancedOuterParentheses = (value) => {
    let normalized = value.trim()
    while (normalized.startsWith('(') && normalized.endsWith(')')) {
      let depth = 0
      let quote = null
      let closesAtEnd = true
      for (let index = 0; index < normalized.length; index += 1) {
        const char = normalized[index]
        if (quote) {
          if (char === quote && normalized[index + 1] === quote) index += 1
          else if (char === quote) quote = null
          continue
        }
        if (char === "'" || char === '"' || char === '`') { quote = char; continue }
        if (char === '(') depth += 1
        if (char === ')') depth -= 1
        if (depth === 0 && index < normalized.length - 1) { closesAtEnd = false; break }
      }
      if (!closesAtEnd) break
      normalized = normalized.slice(1, -1).trim()
    }
    return normalized
  }
  const isTautologicalAtom = (term) => {
    const atom = stripBalancedOuterParentheses(term)
    if (!atom) return true
    const disjuncts = splitSqlBoolean(atom, 'OR')
    if (disjuncts.length > 1) return disjuncts.some(isTautologicalAtom)
    const conjuncts = splitSqlBoolean(atom, 'AND')
    if (conjuncts.length > 1) return conjuncts.every(isTautologicalAtom)
    if (/^(?:TRUE|1\s*=\s*1|1\s*<>\s*0)$/iu.test(atom)) return true
    const equality = atom.match(/^('(?:''|[^'])*'|"(?:""|[^"])*"|\d+(?:\.\d+)?|TRUE|FALSE)\s*(=|<>|!=)\s*('(?:''|[^'])*'|"(?:""|[^"])*"|\d+(?:\.\d+)?|TRUE|FALSE)$/iu)
    if (!equality) {
      const identifier = atom.match(/^([A-Za-z_]\w*)\s*=\s*([A-Za-z_]\w*)$/u)
      return Boolean(identifier && identifier[1].toLowerCase() === identifier[2].toLowerCase())
    }
    const [, left, operator, right] = equality
    const unquote = (value) => value.startsWith("'") ? value.slice(1, -1).replaceAll("''", "'") : value.startsWith('"') ? value.slice(1, -1).replaceAll('""', '"') : value.toUpperCase()
    const same = unquote(left) === unquote(right)
    return operator === '=' ? same : !same
  }
  return isTautologicalAtom(where)
}

function hasArticleContractBroadKeyArguments(argumentText) {
  const argumentsList = argumentText.split(/\s+/u).filter(Boolean)
  return argumentsList.length > 1 ||
    /\*|\b(?:big|large|huge|hot)[A-Za-z0-9_:\-*]*(?:key|keys|hash|list|set|values?)?/iu.test(argumentText)
}

function getRedisCliCommand(line) {
  const normalized = line.trim().replace(/^\$\s*/u, '')
  if (!/^redis-cli\b/iu.test(normalized)) return null
  const tokens = normalized.split(/\s+/u).slice(1)
  const optionsWithValues = new Set(['-h', '-p', '-s', '-a', '-u', '-n', '--user', '--pass', '--cacert', '--cert', '--key', '--tls-ciphers', '--tls-ciphersuites'])
  let index = 0
  while (tokens[index]?.startsWith('-')) {
    if (optionsWithValues.has(tokens[index])) index += 1
    index += 1
  }
  const operation = tokens[index]?.toUpperCase()
  if (!operation) return null
  return { operation, argumentText: tokens.slice(index + 1).join(' ') }
}

function getArticleContractShellDangerousOccurrences(code) {
  const executable = lexArticleContractCode(code, 'shell').executable
  const occurrences = []
  executable.split(/\r?\n/u).forEach((line, lineIndex) => {
    const redisCommand = getRedisCliCommand(line)
    if (redisCommand && REDIS_DANGER_TOKENS.has(redisCommand.operation)) {
      if (
        !['DEL', 'UNLINK'].includes(redisCommand.operation) ||
        hasArticleContractBroadKeyArguments(redisCommand.argumentText)
      ) {
        occurrences.push({ operation: redisCommand.operation, lineIndex, source: 'redis-cli' })
      }
      return
    }

    const command = line.trim().replace(/^\$\s*/u, '').split(/\s+/u)[0]?.toUpperCase()
    if (command === 'MYSQLDUMP') occurrences.push({ operation: 'MYSQLDUMP', lineIndex, source: 'shell' })
  })
  return occurrences
}

function getArticleContractRedisDangerousOccurrences(code) {
  const executable = lexArticleContractCode(code, 'redis').executable
  const occurrences = []
  executable.split(/\r?\n/u).forEach((line, lineIndex) => {
    const normalized = line.trim().replace(/^(?:redis>\s*|[\w.-]+:\d+>\s*)/iu, '')
    const [command = '', ...args] = normalized.split(/\s+/u)
    const operation = command.toUpperCase()
    if (!REDIS_DANGER_TOKENS.has(operation)) return
    if (['DEL', 'UNLINK'].includes(operation) && !hasArticleContractBroadKeyArguments(args.join(' '))) return
    occurrences.push({ operation, lineIndex, source: 'redis-cli' })
  })
  return occurrences
}

function getArticleContractDirectDangerousOccurrences(code, language) {
  if (['shell', 'bash', 'sh'].includes(language)) return getArticleContractShellDangerousOccurrences(code)
  if (language === 'redis') return getArticleContractRedisDangerousOccurrences(code)
  const lexical = lexArticleContractCode(code, language)
  const executable = lexical.executable
  const allowedTokens = language === 'sql'
    ? MYSQL_DANGER_TOKENS
    : language === 'redis'
      ? REDIS_DANGER_TOKENS
      : SHELL_DANGER_TOKENS
  const occurrences = []
  for (const token of DANGEROUS_MYSQL_REDIS_TOKENS) {
    if (!allowedTokens.has(token)) continue
    const escapedToken = token.replace(/[.*+?^${}()|[\]\\]/gu, '\\$&')
    const pattern = new RegExp(`\\b${escapedToken}\\b`, 'giu')
    for (const match of executable.matchAll(pattern)) {
      const offset = match.index ?? 0
      const statement = getArticleContractStatementAround(executable, offset)
      if (token === 'UPDATE' || token === 'DELETE') {
        const where = lexical.semantic.slice(statement.start, statement.end).match(/\bWHERE\b([\s\S]*)$/iu)?.[1]?.trim()
        if (!isArticleContractTautologicalWhere(where ?? '')) continue
      }
      if (token === 'DEL' || token === 'UNLINK') {
        const lineStart = Math.max(executable.lastIndexOf('\n', offset), 0) + 1
        const lineEnd = executable.indexOf('\n', offset)
        const line = executable.slice(lineStart, lineEnd < 0 ? executable.length : lineEnd)
        const argumentText = line.replace(new RegExp(`^[\\s\\S]*?\\b${escapedToken}\\b`, 'iu'), '').trim()
        if (!hasArticleContractBroadKeyArguments(argumentText)) continue
      }
      occurrences.push({
        operation: token,
        lineIndex: getArticleContractLineIndex(executable, offset),
        source: 'direct',
      })
    }
  }
  return occurrences
}

function getJavaCallArguments(code, openIndex) {
  let depth = 0
  for (let index = openIndex; index < code.length; index += 1) {
    if (code[index] === '(') depth += 1
    if (code[index] === ')') {
      depth -= 1
      if (depth === 0) return code.slice(openIndex + 1, index)
    }
  }
  return code.slice(openIndex + 1)
}

function getJavaExecutionCalls(code) {
  const executable = lexArticleContractCode(code, 'java').executable
  const jdbcPattern = /\b(?:jdbcTemplate|namedParameterJdbcTemplate|jdbcOperations|statement|preparedStatement|connection|entityManager|sqlSession)\s*\.\s*(?:execute|update|query|batchUpdate|executeUpdate|executeQuery|prepareStatement)\s*\(/giu
  const redisPattern = /\b(?:redisTemplate|stringRedisTemplate|redisOperations)\s*\.\s*(?:execute|eval|evalSha)\s*\(/giu
  const calls = []
  for (const [mode, pattern] of [['jdbc', jdbcPattern], ['redis', redisPattern]]) {
    for (const match of executable.matchAll(pattern)) {
      const openIndex = executable.indexOf('(', match.index ?? 0)
      const args = getJavaCallArguments(executable, openIndex)
      calls.push({ mode, start: openIndex + 1, end: openIndex + 1 + args.length, args, lineIndex: getArticleContractLineIndex(executable, match.index ?? 0) })
    }
  }
  return calls
}

function getJavaExecutionStringLiterals(code) {
  const lexical = lexArticleContractCode(code, 'java')
  const executable = lexical.executable
  const calls = getJavaExecutionCalls(code)
  const literals = []
  const variableNames = new Set()
  for (const literal of lexical.stringLiterals) {
    const directCall = calls.find((call) => literal.start >= call.start && literal.end <= call.end)
    if (directCall) {
      literals.push({ ...literal, mode: directCall.mode, executionLineIndex: directCall.lineIndex })
    }
  }

  const declarationPattern = /\b(?:String|var)\s+([A-Za-z_$][\w$]*)\s*=/gu
  for (const match of executable.matchAll(declarationPattern)) {
    const name = match[1]
    if (variableNames.has(name)) continue
    variableNames.add(name)
    const start = (match.index ?? 0) + match[0].length
    const semicolon = executable.indexOf(';', start)
    const end = semicolon < 0 ? executable.length : semicolon
    const expressionCode = code.slice(start, end)
    const passedCalls = calls.filter((call) => new RegExp(`\\b${name}\\b`, 'u').test(call.args))
    if (!passedCalls.length) continue
    const expressionLiterals = lexical.stringLiterals.filter((item) => item.start >= start && item.start < end)
    const expressionExecutable = executable.slice(start, end).replace(/[+\s]/gu, '')
    const dynamic = expressionExecutable.length > 0
    const combinedValue = expressionLiterals.map((item) => item.value).join(' ')
    for (const passedCall of passedCalls) {
      if (dynamic) {
        literals.push({ value: combinedValue, mode: passedCall.mode, executionLineIndex: passedCall.lineIndex, dynamic: true })
      } else if (expressionLiterals.length) {
        literals.push({ value: combinedValue, mode: passedCall.mode, executionLineIndex: passedCall.lineIndex, dynamic: false })
      }
    }
  }
  return literals
}

function getJavaEmbeddedStringOccurrences(value, mode) {
  if (mode === 'jdbc') return getArticleContractDirectDangerousOccurrences(value, 'sql').map((occurrence) => ({
    ...occurrence,
    source: 'java-string',
  }))

  const occurrences = []
  const redisCallPattern = /redis\.call\s*\(\s*['"]([A-Za-z][A-Za-z ]*)['"]/giu
  for (const match of value.matchAll(redisCallPattern)) {
    const operation = match[1].toUpperCase()
    if (!REDIS_DANGER_TOKENS.has(operation)) continue
    occurrences.push({ operation, lineIndex: 0, source: 'java-string' })
  }
  return occurrences
}

function getDangerousJavaArticleContractOperations(code) {
  const lexical = lexArticleContractCode(code, 'java')
  const executable = lexical.executable
  const occurrences = []
  for (const literal of getJavaExecutionStringLiterals(code)) {
    const { mode } = literal
    if (literal.dynamic) {
      const detectedOperation = DANGEROUS_MYSQL_REDIS_TOKENS.find((operation) => new RegExp(`\\b${operation}\\b`, 'iu').test(literal.value))
      occurrences.push({ operation: detectedOperation ?? (mode === 'jdbc' ? 'UPDATE' : 'DEL'), lineIndex: literal.executionLineIndex, source: 'java-dynamic' })
      continue
    }
    for (const occurrence of getJavaEmbeddedStringOccurrences(literal.value, mode)) {
      occurrences.push({
        ...occurrence,
        lineIndex: literal.executionLineIndex,
      })
    }
  }

  const methodPattern = /\b(?:RedisTemplate|redisTemplate|stringRedisTemplate|redisOperations)\s*\.\s*(keys|delete|unlink)\s*\(/giu
  for (const match of executable.matchAll(methodPattern)) {
    const offset = match.index ?? 0
    const method = match[1].toUpperCase()
    if (method === 'KEYS') {
      occurrences.push({ operation: 'KEYS', lineIndex: getArticleContractLineIndex(executable, offset), source: 'java-call' })
      continue
    }
    const openIndex = executable.indexOf('(', offset)
    const argumentsText = getJavaCallArguments(code, openIndex)
    if (hasArticleContractBroadKeyArguments(argumentsText)) {
      occurrences.push({ operation: 'DEL', lineIndex: getArticleContractLineIndex(executable, offset), source: 'java-call' })
    }
  }
  return occurrences
}

function getHardenedDangerousArticleContractOperations(code, language) {
  if (!['sql', 'redis', 'shell', 'bash', 'sh', 'java'].includes(language)) return []
  if (language === 'java') return getDangerousJavaArticleContractOperations(code)
  return getArticleContractDirectDangerousOccurrences(code, language)
}

function hasArticleContractRiskBoundary(content, operation, occurrence = null, block = null) {
  if (!occurrence || !block) return false
  const lines = content.split(/\r?\n/u)
  const operationLine = block.codeStartLine + occurrence.lineIndex
  const windowRadius = 2
  const start = Math.max(0, operationLine - windowRadius)
  const end = Math.min(lines.length - 1, operationLine + windowRadius)
  const riskPattern = /(?:风险|边界|警告|注意)\s*[:：]|(?:仅(?:在|用于)|只在|限制|禁止|不要|避免|谨慎|不得|不应|切勿|测试环境|受控|生产环境|先备份|恢复策略|可恢复|备份验证|超时)/iu
  const operationPattern = new RegExp(escapedRiskToken(operation), 'iu')
  const evidencePattern = operation === 'DEL' || operation === 'UNLINK'
    ? /(?:大键|大对象|单键|通配|键范围|批量|低峰|异步|影响范围|阻塞|生产)/iu
    : operation === 'KEYS'
      ? /(?:测试环境|受控|生产|SCAN|阻塞|性能|键空间)/iu
      : operation === 'UPDATE' || operation === 'DELETE'
        ? /(?:全表|WHERE|条件|范围|行|主键|影响行数)/iu
        : ['LOCK TABLES', 'LOCK INSTANCE FOR BACKUP', 'FLUSH TABLES WITH READ LOCK'].includes(operation)
          ? /(?:锁表|锁实例|事务|超时|释放|阻塞|维护窗口)/iu
          : ['MYSQLDUMP', 'BACKUP', 'RESTORE'].includes(operation)
            ? /(?:备份|恢复|一致性|验证|可恢复|演练)/iu
            : /(?:测试环境|受控|生产环境|范围|影响|低峰|超时|阻塞|权限|备份|恢复)/iu
  return lines
    .slice(start, end + 1)
    .map((line) => line.trim())
    .some((line) => riskPattern.test(line) && operationPattern.test(line) && evidencePattern.test(line))
}

function escapedRiskToken(token) {
  return token.replace(/[.*+?^${}()|[\]\\]/gu, '\\$&')
}

function inspectArticleContract(article, { path = 'article.md' } = {}) {
  const violations = []
  if (!article || typeof article.body !== 'string') {
    return [`[article:input] ${path} needs parsed frontmatter and Markdown body`]
  }

  for (const field of ARTICLE_CONTRACT_FRONTMATTER_FIELDS) {
    if (!isMeaningfulField(article.data?.[field])) {
      violations.push(`[article:frontmatter] ${path} ${field} is missing or empty`)
    }
  }

  const h1s = getArticleContractHeadings(article.body, 1)
  if (h1s.length !== 1) {
    violations.push(`[article:title] ${path} needs exactly one H1 title`)
  } else if (isMeaningfulField(article.data?.title) && h1s[0].heading !== String(article.data.title).trim()) {
    violations.push(`[article:title] ${path} H1 must match frontmatter.title`)
  }

  const h2s = getArticleContractHeadings(article.body, 2).map(({ heading }) => heading)
  if (JSON.stringify(h2s) !== JSON.stringify(ARTICLE_CONTRACT_MANIFEST.requiredH2)) {
    violations.push(
      `[article:h2] ${path} requires exact H2 order: ${ARTICLE_CONTRACT_MANIFEST.requiredH2.join(' > ')}`,
    )
  }

  const usage = getArticleContractSection(article.body, '常用用法')
  const subsections = getArticleContractH3Subsections(usage)
  if (subsections.length === 0) {
    violations.push(`[h3:name] ${path} 常用用法 needs a searchable operation H3`)
    return violations
  }

  for (const { heading, content } of subsections) {
    const prefix = `${path} [${heading}]`
    if (!isArticleContractOperationHeading(heading, content)) {
      violations.push(`[h3:name] ${prefix} must start with a real API, SQL, or Redis operation name`)
      continue
    }

    const lines = content.split(/\r?\n/u)
    const first = lines.findIndex((line) => line.trim() !== '')
    const firstLine = first < 0 ? '' : lines[first].trim()
    const codeIndex = lines.findIndex((line, index) => index > first && /^```[A-Za-z][\w-]*(?:\s|$)/u.test(line.trim()))
    if (first < 0 || /^(?:```|[-*+]\s|\d+[.)]\s|>|#{1,6}\s|\/\/|--|#)/u.test(firstLine)) {
      violations.push(`[example:purpose] ${prefix} needs an immediate purpose sentence before code`)
    } else if (codeIndex < 0) {
      violations.push(`[example:code] ${prefix} needs a supported executable code block`)
    } else {
      const purposeLines = lines.slice(first, codeIndex).filter((line) => line.trim() !== '')
      const purpose = stripMarkdown(purposeLines.join(' '))
      const sentenceEnds = purpose.match(/[。！？!?]|\.(?=\s|$)/gu) ?? []
      if (
        purposeLines.length > 2 ||
        purpose.length < 10 ||
        sentenceEnds.length < 1 ||
        sentenceEnds.length > 2 ||
        !/[。！？.!?]$/u.test(purpose)
      ) {
        violations.push(`[example:purpose] ${prefix} purpose must be one complete sentence`)
      }
    }

    const blocks = getArticleContractCodeBlocks(content)
    const supportedBlocks = blocks.filter(({ language }) =>
      ['java', 'sql', 'redis', 'shell', 'bash', 'sh'].includes(language),
    )
    if (supportedBlocks.length === 0) {
      violations.push(`[example:code] ${prefix} needs java, SQL, or Redis CLI code`)
      continue
    }

    const executableBlocks = supportedBlocks.filter(({ language, code }) =>
      stripArticleContractComments(code, language) !== '',
    )
    if (!FORBIDDEN_EXAMPLE_COMMENT_PATTERN.test(content) &&
      supportedBlocks.some(({ language, code }) => hasArticleContractNoInformationComment(code, language))) {
      violations.push(`[example:template] ${prefix} must not use generic no-information code comments`)
    }
    if (executableBlocks.length === 0) {
      violations.push(`[example:state] ${prefix} must include executable input/state, not only a final output comment`)
      continue
    }

    if (FORBIDDEN_EXAMPLE_COMMENT_PATTERN.test(content) || FORBIDDEN_TEMPLATE_PHRASES.some((phrase) => content.includes(phrase))) {
      violations.push(`[example:template] ${prefix} contains generic template wording`)
    }
    if (supportedBlocks.some(({ language, code }) => hasArticleContractTautologicalComment(code, language))) {
      violations.push(`[example:tautological-comment] ${prefix} contains a comment that only restates adjacent code`)
    }
    if (!hasArticleContractInitialState(content, supportedBlocks)) {
      violations.push(`[example:state] ${prefix} needs a concrete initial input or state`)
    }
    if (!hasArticleContractTransition(content)) {
      violations.push(`[example:state] ${prefix} needs a concrete key transition`)
    }
    if (!hasArticleContractObservableResult(content, supportedBlocks)) {
      violations.push(`[example:result] ${prefix} needs an observable output, result, assertion, or log`)
    }

    for (const block of supportedBlocks) {
      const { language, code } = block
      for (const occurrence of getDangerousArticleContractOperations(code, language)) {
        if (!hasArticleContractRiskBoundary(content, occurrence.operation, occurrence, block)) {
          violations.push(`[danger:boundary] ${prefix} ${occurrence.operation} needs a nearby explicit risk boundary`)
        }
      }
    }
  }

  return violations
}

function inspectArticleContractManifest() {
  const violations = []
  const entries = ARTICLE_CONTRACT_MANIFEST.entries
  const paths = entries.map((entry) => (typeof entry === 'string' ? entry : entry.path))
  if (new Set(paths).size !== paths.length) {
    violations.push('[article:manifest] strict article routes must be unique')
  }

  for (const entry of entries) {
    const path = typeof entry === 'string' ? entry : entry.path
    if (!path || !/^docs\/courses\/java\/[^/]+\/[^/]+\.md$/u.test(path)) {
      violations.push(`[article:manifest] invalid strict article route ${path ?? '<missing>'}`)
      continue
    }
    if (!ARTICLE_CONTRACT_PATHS.has(path) || !existsSync(join(REPO_ROOT, ...path.split('/')))) {
      violations.push(`[article:manifest] strict article route ${path} must point to an existing file`)
      continue
    }
    try {
      for (const issue of inspectArticleContract(readMarkdown(path), { path })) {
        violations.push(issue)
      }
    } catch (error) {
      violations.push(`[article:manifest] ${path} could not be read: ${error.message}`)
    }
  }
  return violations
}

const CONTRACT_FIXTURE_ROOT = join(REPO_ROOT, 'tests/fixtures/java-course')

function readContractFixture(fileName) {
  const source = readFileSync(join(CONTRACT_FIXTURE_ROOT, fileName), 'utf8')
  const parsed = matter(source)
  return { data: parsed.data, body: parsed.content }
}

function createValidArticleContractFixture() {
  return {
    data: {
      title: '可验证的 Redis 示例',
      date: '2026-10-05',
      category: 'Redis 基础',
      tags: ['Redis'],
      description: '展示带有具体状态变化和可观察结果的 Redis 命令。',
    },
    body: `# 可验证的 Redis 示例

## 学习目标

- 能够按状态变化阅读一个 Redis 命令示例。

## 核心知识点

### 专业术语

Redis key/value 用 key 定位具体值，命令会改变或读取该值。

### 白话解释与边界

具体 key 和 value 让示例可以复现；生产数据还要考虑权限和生命周期。

## 常用用法

### \`INCR\`：递增计数器

用途：用于在已有计数器上做原子递增并观察新的数值。

\`\`\`redis
# 初始状态：demo:count = 1，输入 key 为 demo:count。
SET demo:count 1
# 关键变化：demo:count 从 1 递增为 2。
INCR demo:count
# 输出：命令返回整数 2。
\`\`\`

## 易混点

递增计数器只改变一个已知 key，不能替代多字段事务。

## 课后小问

1. 递增前的 key 是什么？

答案：demo:count，初始值为 1。

解析：代码先写入 1，再调用 INCR 得到 2。

## 本节小结

- 具体 key、变化和结果应当逐项可见。

## 快速回顾

- 先写入初值，再观察递增结果。`,
  }
}

function createArticleContractOperationFixture({
  heading,
  language,
  code,
  purpose = '用途：用于把一个具体操作绑定到可复现的输入、状态变化和结果。',
  boundary = '',
}) {
  const fixture = createValidArticleContractFixture()
  const codeLines = code.trim().split(/\r?\n/u)
  if (boundary) codeLines.splice(Math.min(1, codeLines.length), 0, boundary)
  const operationSection = [
    `### ${heading}`,
    '',
    purpose,
    '',
    `\`\`\`${language}`,
    codeLines.join('\n'),
    '\`\`\`',
  ].join('\n')
  fixture.body = fixture.body.replace(
    /### `INCR`：递增计数器[\s\S]*?```redis[\s\S]*?```/u,
    operationSection,
  )
  return fixture
}

function articleContractIssueTypes(issues) {
  return issues.map((issue) => issue.match(/^\[[^\]]+\]/u)?.[0] ?? issue)
}

function assertArticleContractIssueTypes(fixture, expectedTypes, label) {
  const issues = inspectArticleContract(fixture, { path: label })
  assert.deepEqual(
    articleContractIssueTypes(issues),
    expectedTypes,
    `${label} should emit exactly the intended issue types${formatViolations(issues)}`,
  )
  return issues
}

test('article contract checks frontmatter, exact H2 order, and searchable operation headings', () => {
  const valid = createValidArticleContractFixture()
  assert.deepEqual(inspectArticleContract(valid, { path: 'valid-fixture.md' }), [])

  const malformedFrontmatter = createValidArticleContractFixture()
  delete malformedFrontmatter.data.description
  const frontmatterIssues = inspectArticleContract(malformedFrontmatter, { path: 'missing-description.md' })
  assert.ok(frontmatterIssues.some((issue) => issue.startsWith('[article:frontmatter]')))
  assert.deepEqual(
    frontmatterIssues.filter((issue) => !issue.startsWith('[article:frontmatter]')),
    [],
  )

  const reorderedSections = createValidArticleContractFixture()
  reorderedSections.body = reorderedSections.body
    .replace('## 易混点', '## 临时顺序')
    .replace('## 课后小问', '## 易混点')
    .replace('## 临时顺序', '## 课后小问')
  const sectionIssues = inspectArticleContract(reorderedSections, { path: 'wrong-h2-order.md' })
  assert.ok(sectionIssues.some((issue) => issue.startsWith('[article:h2]')))
  assert.deepEqual(
    sectionIssues.filter((issue) => !issue.startsWith('[article:h2]')),
    [],
  )

  const genericHeading = createValidArticleContractFixture()
  genericHeading.body = genericHeading.body.replace('### \`INCR\`：递增计数器', '### 计数器操作：递增一个值')
  const headingIssues = inspectArticleContract(genericHeading, { path: 'generic-heading.md' })
  assert.ok(headingIssues.some((issue) => issue.startsWith('[h3:name]')))
  assert.deepEqual(
    headingIssues.filter((issue) => !issue.startsWith('[h3:name]')),
    [],
  )

  const missingPurpose = readContractFixture('missing-purpose.md')
  const issues = inspectArticleContract(missingPurpose, { path: 'missing-purpose.md' })
  assert.deepEqual(
    articleContractIssueTypes(issues),
    ['[example:purpose]'],
    `missing-purpose fixture should fail for purpose only${formatViolations(issues)}`,
  )

  const twoPurposeSentences = createArticleContractOperationFixture({
    heading: 'INCR：递增计数器',
    language: 'redis',
    purpose: '用途：用于递增已有计数器。它会原子地返回更新后的数值。',
    code: '# 初始状态：demo:count = 1。\nSET demo:count 1\n# 关键变化：demo:count 从 1 递增为 2。\nINCR demo:count\n# 输出：命令返回整数 2。',
  })
  assertArticleContractIssueTypes(twoPurposeSentences, [], 'two-purpose-sentences.md')

  const threePurposeSentences = createArticleContractOperationFixture({
    heading: 'INCR：递增计数器',
    language: 'redis',
    purpose: '用途：用于递增已有计数器。它会原子地更新值。读者可以观察返回结果。',
    code: '# 初始状态：demo:count = 1。\nSET demo:count 1\n# 关键变化：demo:count 从 1 递增为 2。\nINCR demo:count\n# 输出：命令返回整数 2。',
  })
  assertArticleContractIssueTypes(threePurposeSentences, ['[example:purpose]'], 'three-purpose-sentences.md')
})

test('example state checks reject output-only and template-comment fixtures', () => {
  const onlyOutputIssues = inspectArticleContract(
    readContractFixture('only-final-output.md'),
    { path: 'only-final-output.md' },
  )
  assert.deepEqual(
    articleContractIssueTypes(onlyOutputIssues),
    ['[example:state]'],
    `only-final-output fixture should require executable state${formatViolations(onlyOutputIssues)}`,
  )

  const templateIssues = inspectArticleContract(
    readContractFixture('template-comment.md'),
    { path: 'template-comment.md' },
  )
  assert.deepEqual(
    articleContractIssueTypes(templateIssues),
    ['[example:template]'],
    `template-comment fixture should reject generic wording${formatViolations(templateIssues)}`,
  )
})

test('article contract rejects tautological adjacent comments but accepts concrete state and lifecycle facts', () => {
  assertArticleContractIssueTypes(
    readContractFixture('tautological-comment.md'),
    ['[example:tautological-comment]'],
    'tautological-comment.md',
  )

  for (const transition of [
    '// 关键变化：list 当前包含 [a, c]。',
    '// 关键变化：input 与 channel 共享读取位置，关闭 input 会关闭 channel。',
  ]) {
    const fixture = createArticleContractOperationFixture({
      heading: 'List.add：更新列表',
      language: 'java',
      code: `var list = new ArrayList<>(List.of("a"));
list.add("c");
${transition}
System.out.println(list);
// 输出：[a, c]。`,
    })
    assertArticleContractIssueTypes(fixture, [], `matrix/informative-${transition.length}.md`)
  }

  const noRoutineDeclarationComments = createArticleContractOperationFixture({
    heading: 'StringBuilder.append：追加文本',
    language: 'java',
    code: `String seed = "a";
StringBuilder builder = new StringBuilder(seed);
builder.append("b");
// 关键变化：builder 从 a 追加为 ab。
System.out.println(builder);
// 输出：ab。`,
  })
  assertArticleContractIssueTypes(noRoutineDeclarationComments, [], 'matrix/no-routine-comments.md')

  const callWithStringArgument = createArticleContractOperationFixture({
    heading: 'StringBuilder.append：追加文本',
    language: 'java',
    code: `var builder = new StringBuilder();
builder.append("b");
// 关键变化：builder.append("b")。
System.out.println(builder);
// 输出：b。`,
  })
  assertArticleContractIssueTypes(
    callWithStringArgument,
    ['[example:tautological-comment]'],
    'matrix/tautological-call-with-string-argument.md',
  )

  const genericNoInformation = createArticleContractOperationFixture({
    heading: 'StringBuilder.append：追加文本',
    language: 'java',
    code: `var builder = new StringBuilder();
builder.append("b");
// TODO：此处需要补充具体说明。
// 关键变化：builder 从空文本更新为 b。
System.out.println(builder);
// 输出：b。`,
  })
  assertArticleContractIssueTypes(
    genericNoInformation,
    ['[example:template]'],
    'matrix/generic-no-information-comment.md',
  )

  const noInformationWithConcreteDetail = createArticleContractOperationFixture({
    heading: 'StringBuilder.append：追加文本',
    language: 'java',
    code: `var builder = new StringBuilder();
builder.append("b");
// TODO: users.id=7; return 1.
// 关键变化：builder 从空文本更新为 b。
System.out.println(builder);
// 输出：b。`,
  })
  assertArticleContractIssueTypes(noInformationWithConcreteDetail, [], 'matrix/no-information-comment-with-details.md')
  for (const comment of ['TODO', 'FIXME', 'TBD:', '待补充具体说明', 'TODO: 待补充具体说明。', '此处补充说明']) {
    const fixture = { ...genericNoInformation, body: genericNoInformation.body.replace('TODO：此处需要补充具体说明。', comment) }
    assertArticleContractIssueTypes(fixture, ['[example:template]'], `matrix/placeholder-${comment}.md`)
  }
  for (const comment of [
    '调用参数：代码依次使用 "Java"。',
    '执行后得到预期结果。',
    '操作成功。',
  ]) {
    const fixture = { ...genericNoInformation, body: genericNoInformation.body.replace('TODO：此处需要补充具体说明。', comment) }
    assertArticleContractIssueTypes(fixture, ['[example:template]'], `matrix/mechanical-comment-${comment}.md`)
  }
  for (const comment of ['TODO: users.id=7 写入后返回1', 'FIXME: users.id=7 写入后返回1', '待补充具体说明：users.id=7 写入后返回1']) {
    const fixture = { ...genericNoInformation, body: genericNoInformation.body.replace('TODO：此处需要补充具体说明。', comment) }
    assertArticleContractIssueTypes(fixture, [], `matrix/concrete-${comment}.md`)
  }

  const informativeFreeFormComment = createArticleContractOperationFixture({
    heading: 'StringBuilder.append：追加文本',
    language: 'java',
    code: `var builder = new StringBuilder();
builder.append("b");
// StringBuilder retains appended text in the same mutable buffer.
// 关键变化：builder 从空文本更新为 b。
System.out.println(builder);
// 输出：b。`,
  })
  assertArticleContractIssueTypes(informativeFreeFormComment, [], 'matrix/informative-free-form-comment.md')
})

test('existing Java Markdown rejects mechanical comments without requiring routine-line comments', () => {
  const badFixtures = [
    ['var value = source();\n// 关键变化：var value = source();', 'exact assignment restatement'],
    ['items.add("book");\n// 输入表达式为 items.add("book")', 'input expression narration'],
    ['new Order("ann", 20);\n// 关键变化：创建 Order，构造参数保留在外层调用中。', 'constructor narration'],
    ['int total = amount + tax;\n// 关键变化：将 amount + tax 的计算结果写入 total；赋值完成。', 'generated assignment narration'],
    ['builder.append("x");\n// 调用参数：代码依次使用 "x"。', 'generic call narration'],
  ]
  for (const [code, label] of badFixtures) {
    assert.ok(inspectJavaCodeComments(code).length > 0, `${label} must be rejected`)
  }

  const informativeFixtures = [
    'String input = "x";\nitems.add(input);',
    'buffer.compact();\n// 关键变化：未读字节移动到开头，position 指向剩余数据末端。',
    'InputStream input = Channels.newInputStream(channel);\n// 关键变化：关闭 input 会关闭底层 channel。',
    'System.out.println(value);\n// 输出：2,3',
  ]
  for (const code of informativeFixtures) {
    assert.deepEqual(inspectJavaCodeComments(code), [], 'routine lines may be unannotated and informative comments remain valid')
  }

  const violations = []
  for (const relativePath of [JAVA_INDEX_PATH, ...ARTICLE_PATHS]) {
    const { body } = readMarkdown(relativePath)
    for (const [blockIndex, code] of getJavaBlocks(body).entries()) {
      for (const issue of inspectJavaCodeComments(code)) {
        violations.push(`${relativePath} [java-block-${blockIndex + 1}] ${issue}`)
      }
    }
  }
  assert.deepEqual(violations, [], `rule java-mechanical-comments${formatViolations(violations)}`)
})

test('danger boundary requires an explicit warning for dangerous MySQL and Redis operations', () => {
  const dangerIssues = inspectArticleContract(
    readContractFixture('danger-without-warning.md'),
    { path: 'danger-without-warning.md' },
  )
  assert.deepEqual(
    articleContractIssueTypes(dangerIssues),
    ['[danger:boundary]'],
    `danger-without-warning fixture should require a risk boundary${formatViolations(dangerIssues)}`,
  )

  const safeKeyedSql = {
    data: createValidArticleContractFixture().data,
    body: createValidArticleContractFixture().body
      .replace('### `INCR`：递增计数器', '### UPDATE：按主键更新一行')
      .replace('用途：用于在已有计数器上做原子递增并观察新的数值。', '用途：用于按具体主键更新一行并观察受影响行数。')
      .replaceAll('```redis', '```sql')
      .replace('SET demo:count 1', 'UPDATE users SET name = \'Ann\' WHERE id = 7;')
      .replace('INCR demo:count', 'SELECT name FROM users WHERE id = 7;')
      .replace('demo:count = 1，输入 key 为 demo:count。', 'users 表已有 id = 7、name = \'Bob\'。')
      .replace('demo:count 从 1 递增为 2。', 'users.id = 7 的 name 从 Bob 更新为 Ann。')
      .replace('命令返回整数 2。', '查询返回 id = 7 的 name = Ann。'),
  }
  assert.deepEqual(
    inspectArticleContract(safeKeyedSql, { path: 'safe-keyed-sql.md' }),
    [],
    'keyed UPDATE/SELECT examples should not be classified as dangerous',
  )
})

test('danger and executable parsing matrix keeps boundaries local and ignores literal or comment text', () => {
  const matrix = [
    {
      name: 'keys-boundary-cannot-be-borrowed-from-scan-only-warning',
      heading: 'KEYS：扫描键空间',
      language: 'redis',
      code: `# 初始状态：demo:count = 1。
SET demo:count 1
# 风险边界：SCAN 用于生产环境遍历键空间，避免阻塞。
KEYS demo:*
# 关键变化：demo:keys 从空结果变为 1 条匹配结果。
# 输出：命令返回 1 个匹配键。`,
      expected: ['[danger:boundary]'],
    },
    {
      name: 'redis-cli-keys-without-boundary',
      heading: 'KEYS：扫描键空间',
      language: 'shell',
      code: `# 初始状态：demo:count = 1。
redis-cli --user reader --pass secret -h 127.0.0.1 -p 6379 KEYS demo:*
# 关键变化：匹配结果包含 demo:count。
# 输出：命令返回 1 个匹配键。`,
      expected: ['[danger:boundary]'],
    },
    {
      name: 'redis-cli-keyed-value-is-not-a-dangerous-command',
      heading: 'SET：保存命令名称文本',
      language: 'shell',
      code: `# 初始状态：demo:message 不存在。
redis-cli SET demo:message DELETE
# 关键变化：demo:message 被保存为 DELETE。
# 输出：返回 OK。`,
      expected: [],
    },
    {
      name: 'keys-without-boundary',
      heading: 'KEYS：扫描键空间',
      language: 'redis',
      code: `# 初始状态：demo:count = 1。
SET demo:count 1
KEYS demo:*
# 关键变化：demo:keys 从空结果变为 1 条匹配结果。
# 输出：命令返回 1 个匹配键。`,
      expected: ['[danger:boundary]'],
    },
    {
      name: 'keys-boundary-without-impact-evidence',
      heading: 'KEYS：扫描键空间',
      language: 'redis',
      code: `# 初始状态：demo:count = 1。
SET demo:count 1
# 风险边界：KEYS 有风险。
KEYS demo:*
# 关键变化：demo:keys 从空结果变为 1 条匹配结果。
# 输出：命令返回 1 个匹配键。`,
      expected: ['[danger:boundary]'],
    },
    {
      name: 'keys-with-local-boundary',
      heading: 'KEYS：扫描键空间',
      language: 'redis',
      code: `# 初始状态：demo:count = 1。
SET demo:count 1
# 风险边界：KEYS 只在受控测试环境执行，生产环境使用 SCAN 以避免阻塞键空间。
KEYS demo:*
# 关键变化：demo:keys 从空结果变为 1 条匹配结果。
# 输出：命令返回 1 个匹配键。`,
      expected: [],
    },
    {
      name: 'del-big-key-without-boundary',
      heading: 'DEL：删除多个键',
      language: 'redis',
      code: `# 初始状态：demo:count = 1。
SET demo:count 1
DEL demo:* archive:*
# 关键变化：demo:* 和 archive:* 两个键范围被删除。
# 输出：命令返回删除数量 2。`,
      expected: ['[danger:boundary]'],
    },
    {
      name: 'del-big-key-with-local-boundary',
      heading: 'DEL：删除大键',
      language: 'redis',
      code: `# 初始状态：big:session:hash 有大量字段。
SET big:session:hash 1
# 风险边界：DEL 只在受控低峰窗口删除 big:key，并先确认影响范围。
DEL big:key
# 关键变化：big:key 被删除。
# 输出：命令返回删除数量 1。`,
      expected: [],
    },
    {
      name: 'del-single-key-is-bounded',
      heading: 'DEL：删除单个键',
      language: 'redis',
      code: `# 初始状态：demo:count = 1。
SET demo:count 1
DEL demo:count
# 关键变化：demo:count 被删除。
# 输出：命令返回删除数量 1。`,
      expected: [],
    },
    {
      name: 'unlink-big-key-without-boundary',
      heading: 'UNLINK：异步删除大键',
      language: 'redis',
      code: `# 初始状态：big:session:hash 有大量字段。
SET big:session:hash 1
UNLINK big:session:hash
# 关键变化：big:session:hash 进入异步回收队列。
# 输出：命令返回删除数量 1。`,
      expected: ['[danger:boundary]'],
    },
    {
      name: 'unlink-big-key-with-local-boundary',
      heading: 'UNLINK：异步删除大键',
      language: 'redis',
      code: `# 初始状态：big:session:hash 有大量字段。
SET big:session:hash 1
# 风险边界：UNLINK 只在受控低峰窗口处理 big:key，并观察异步回收状态。
UNLINK big:key
# 关键变化：big:key 进入异步回收队列。
# 输出：命令返回删除数量 1。`,
      expected: [],
    },
    {
      name: 'delete-without-where',
      heading: 'DELETE：删除全表数据',
      language: 'sql',
      code: `-- 初始状态：users 表有 id = 7 的记录。
INSERT INTO users(id, name) VALUES (7, 'Bob');
DELETE FROM users;
-- 关键变化：users 表中的记录被删除。
SELECT COUNT(*) FROM users;`,
      expected: ['[danger:boundary]'],
    },
    {
      name: 'delete-with-local-boundary',
      heading: 'DELETE：删除全表数据',
      language: 'sql',
      code: `-- 初始状态：users 表有 id = 7 的记录。
INSERT INTO users(id, name) VALUES (7, 'Bob');
-- 风险边界：DELETE 必须在受控维护窗口执行，并先备份后核对影响范围。
DELETE FROM users;
-- 关键变化：users 表中的记录被删除。
SELECT COUNT(*) FROM users;`,
      expected: [],
    },
    {
      name: 'delete-with-primary-key',
      heading: 'DELETE：按主键删除',
      language: 'sql',
      code: `-- 初始状态：users 表有 id = 7 的记录。
INSERT INTO users(id, name) VALUES (7, 'Bob');
DELETE FROM users WHERE id = 7;
-- 关键变化：users.id = 7 的记录被删除。
SELECT COUNT(*) FROM users WHERE id = 7;`,
      expected: [],
    },
    {
      name: 'update-with-or-tautology',
      heading: 'UPDATE：包含 OR 恒真条件',
      language: 'sql',
      code: `-- 初始状态：users 表有 id = 7 的记录。
INSERT INTO users(id, name) VALUES (7, 'Bob');
UPDATE users SET name = 'Ann' WHERE id = 7 OR 1 = 1;
-- 关键变化：users 表可能被恒真条件更新。
SELECT name FROM users WHERE id = 7;`,
      expected: ['[danger:boundary]'],
    },
    {
      name: 'update-with-where-true',
      heading: 'UPDATE：WHERE TRUE',
      language: 'sql',
      code: `-- 初始状态：users 表有 id = 7 的记录。
INSERT INTO users(id, name) VALUES (7, 'Bob');
UPDATE users SET name = 'Ann' WHERE TRUE;
-- 关键变化：users 表可能被 WHERE TRUE 更新。
SELECT name FROM users WHERE id = 7;`,
      expected: ['[danger:boundary]'],
    },
    {
      name: 'delete-with-one-equals-one',
      heading: 'DELETE：WHERE 1 = 1',
      language: 'sql',
      code: `-- 初始状态：users 表有 id = 7 的记录。
INSERT INTO users(id, name) VALUES (7, 'Bob');
DELETE FROM users WHERE 1 = 1;
-- 关键变化：users 表可能被 1 = 1 删除条件覆盖。
SELECT COUNT(*) FROM users;`,
      expected: ['[danger:boundary]'],
    },
    {
      name: 'delete-with-or-numeric-tautology',
      heading: 'DELETE：OR 条件包含恒真项',
      language: 'sql',
      code: `-- 初始状态：users 表有 id = 7 的记录。
INSERT INTO users(id, name) VALUES (7, 'Bob');
DELETE FROM users WHERE id = 7 OR 2 = 2;
-- 关键变化：users 表的记录可能全部被删除。
SELECT COUNT(*) FROM users;`,
      expected: ['[danger:boundary]'],
    },
    {
      name: 'delete-with-equal-string-literals',
      heading: 'DELETE：字符串谓词恒真',
      language: 'sql',
      code: `-- 初始状态：users 表有 id = 7 的记录。
INSERT INTO users(id, name) VALUES (7, 'Bob');
DELETE FROM users WHERE 'x' = 'x';
-- 关键变化：users 表的记录可能全部被删除。
SELECT COUNT(*) FROM users;`,
      expected: ['[danger:boundary]'],
    },
    {
      name: 'delete-with-string-tautology-under-or',
      heading: 'DELETE：OR 包含字符串恒真谓词',
      language: 'sql',
      code: `-- 初始状态：users 表有 id = 7 的记录。
INSERT INTO users(id, name) VALUES (7, 'Bob');
DELETE FROM users WHERE id = 7 OR 'same' = 'same';
-- 关键变化：users 表的记录可能全部被删除。
SELECT COUNT(*) FROM users;`,
      expected: ['[danger:boundary]'],
    },
    {
      name: 'delete-with-nested-parenthesized-tautology',
      heading: 'DELETE：嵌套括号包含恒真谓词',
      language: 'sql',
      code: `-- 初始状态：users 表有 id = 7 的记录。
INSERT INTO users(id, name) VALUES (7, 'Bob');
DELETE FROM users WHERE ((id = 7 OR 2 = 2));
-- 关键变化：users 表中的记录可能全部被删除。
SELECT COUNT(*) FROM users;`,
      expected: ['[danger:boundary]'],
    },
    {
      name: 'delete-with-false-predicate-is-not-broad',
      heading: 'DELETE：使用恒假条件',
      language: 'sql',
      code: `-- 初始状态：users 表有 id = 7 的记录。
INSERT INTO users(id, name) VALUES (7, 'Bob');
DELETE FROM users WHERE FALSE;
-- 关键变化：users 表中的记录保持不变。
SELECT COUNT(*) FROM users;`,
      expected: [],
    },
    {
      name: 'update-with-local-boundary',
      heading: 'UPDATE：包含 OR 恒真条件',
      language: 'sql',
      code: `-- 初始状态：users 表有 id = 7 的记录。
INSERT INTO users(id, name) VALUES (7, 'Bob');
-- 风险边界：UPDATE 的 WHERE TRUE OR 条件可能覆盖全表，必须先备份并限制影响范围。
UPDATE users SET name = 'Ann' WHERE TRUE OR id = 7;
-- 关键变化：users 表可能被恒真条件更新。
SELECT name FROM users WHERE id = 7;`,
      expected: [],
    },
    {
      name: 'lock-without-boundary',
      heading: 'LOCK TABLES：锁定表',
      language: 'sql',
      code: `-- 初始状态：users 表可供维护。
INSERT INTO users(id, name) VALUES (7, 'Bob');
LOCK TABLES users WRITE;
-- 关键变化：users 表进入写锁状态。
SELECT 1;`,
      expected: ['[danger:boundary]'],
    },
    {
      name: 'lock-with-local-boundary',
      heading: 'LOCK TABLES：锁定表',
      language: 'sql',
      code: `-- 初始状态：users 表可供维护。
INSERT INTO users(id, name) VALUES (7, 'Bob');
-- 风险边界：LOCK TABLES 只在受控维护窗口持有，并设置超时后释放锁。
LOCK TABLES users WRITE;
-- 关键变化：users 表进入写锁状态。
SELECT 1;`,
      expected: [],
    },
    {
      name: 'lock-boundary-cannot-be-borrowed-from-backup-warning',
      heading: 'LOCK TABLES：锁定表',
      language: 'sql',
      code: `-- 初始状态：users 表可供维护。
INSERT INTO users(id, name) VALUES (7, 'Bob');
-- 风险边界：BACKUP 需要验证一致性并保留可恢复文件。
LOCK TABLES users WRITE;
-- 关键变化：users 表进入写锁状态。
SELECT 1;`,
      expected: ['[danger:boundary]'],
    },
    {
      name: 'backup-without-boundary',
      heading: 'BACKUP：备份数据库',
      language: 'sql',
      code: `-- 初始状态：备份任务 id = 1。
INSERT INTO backup_jobs(id, name) VALUES (1, 'daily');
BACKUP DATABASE app TO DISK = '/tmp/app.bak';
-- 关键变化：app 数据库生成 backup 文件。
SELECT 1;`,
      expected: ['[danger:boundary]'],
    },
    {
      name: 'backup-with-local-boundary',
      heading: 'BACKUP：备份数据库',
      language: 'sql',
      code: `-- 初始状态：备份任务 id = 1。
INSERT INTO backup_jobs(id, name) VALUES (1, 'daily');
-- 风险边界：BACKUP 需要先验证一致性并保留可恢复的备份文件。
BACKUP DATABASE app TO DISK = '/tmp/app.bak';
-- 关键变化：app 数据库生成备份文件。
SELECT 1;`,
      expected: [],
    },
    {
      name: 'sql-literal-and-comment-are-not-commands',
      heading: 'SELECT：读取说明文本',
      language: 'sql',
      code: `-- 初始状态：说明行 id = 1。
INSERT INTO notes(id, body) VALUES (1, 'ready');
SELECT 'DELETE' AS note; -- DELETE 只是注释文本
-- 关键变化：note 返回文字 DELETE 而不改变数据。
SELECT 1;`,
      expected: [],
    },
    {
      name: 'redis-literal-and-comment-are-not-commands',
      heading: 'SET：保存命令名称文本',
      language: 'redis',
      code: `# 初始状态：demo:message 不存在。
SET demo:message "KEYS"
# KEYS 只是说明文本，不是本次执行的命令。
# 关键变化：demo:message 被保存为 KEYS。
# 输出：返回 1 个值。
GET demo:message`,
      expected: [],
    },
    {
      name: 'redis-unquoted-value-is-not-a-command',
      heading: 'SET：保存命令名称文本',
      language: 'redis',
      code: `# 初始状态：demo:message 不存在。
SET demo:message KEYS
# 关键变化：demo:message 被保存为 KEYS。
# 输出：返回 OK。
GET demo:message`,
      expected: [],
    },
    {
      name: 'java-literal-is-not-a-jdbc-command',
      heading: 'String：保存 SQL 名称文本',
      language: 'java',
      code: `String label = "DELETE";
// 关键变化：label 保持为说明文本 DELETE。
System.out.println(label);
// 输出：DELETE。`,
      expected: [],
    },
    {
      name: 'java-jdbc-string-is-executable-sql',
      heading: 'jdbcTemplate.update：执行删除',
      language: 'java',
      code: `String id = "7";
jdbcTemplate.update("DELETE FROM users");
// 关键变化：DELETE 语句影响 users 表中的记录。
System.out.println("affected=1");
// 输出：affected=1。`,
      expected: ['[danger:boundary]'],
    },
    {
      name: 'java-jdbc-string-with-local-boundary',
      heading: 'jdbcTemplate.update：执行删除',
      language: 'java',
      code: `String id = "7";
// 风险边界：DELETE 只在受控维护窗口执行，并先备份后核对影响范围。
jdbcTemplate.update("DELETE FROM users");
// 关键变化：DELETE 语句影响 users 表中的记录。
System.out.println("affected=1");
// 输出：affected=1。`,
      expected: [],
    },
    {
      name: 'java-jdbc-variable-is-executable-sql',
      heading: 'jdbcTemplate.update：执行删除',
      language: 'java',
      code: `String sql = "DELETE FROM users";
jdbcTemplate.update(sql);
// 关键变化：DELETE 语句影响 users 表中的记录。
System.out.println("affected=1");
// 输出：affected=1。`,
      expected: ['[danger:boundary]'],
    },
    {
      name: 'jdbc-variable-boundary-must-be-at-execution-site',
      heading: 'jdbcTemplate.update：执行删除',
      language: 'java',
      code: `String sql = "DELETE FROM users";
int count = 0;
count += 1;
count += 1;
count += 1;
jdbcTemplate.update(sql);
// 关键变化：users 表中的匹配记录被删除。
System.out.println(count);
// 输出：3。`,
      boundary: '// 风险边界：DELETE 只在受控维护窗口执行，并先备份后核对影响范围。',
      expected: ['[danger:boundary]'],
    },
    {
      name: 'jdbc-concatenated-variable-keeps-later-sql-fragments',
      heading: 'jdbcTemplate.execute：执行删除',
      language: 'java',
      code: `String sql = "SELECT 1; " + "DELETE FROM users";
jdbcTemplate.execute(sql);
// 关键变化：users 表中的记录被删除。
System.out.println("done");
// 输出：done。`,
      expected: ['[danger:boundary]'],
    },
    {
      name: 'jdbc-semicolon-inside-string-does-not-end-declaration',
      heading: 'jdbcTemplate.execute：执行删除',
      language: 'java',
      code: `String sql = "SELECT ';'; " + "DELETE FROM users";
jdbcTemplate.execute(sql);
// 关键变化：users 表中的记录被删除。
System.out.println("done");
// 输出：done。`,
      expected: ['[danger:boundary]'],
    },
    {
      name: 'jdbc-text-block-boundary-at-execution-passes',
      heading: 'jdbcTemplate.execute：执行删除',
      language: 'java',
      code: `String sql = """
DELETE FROM users
""";
// 风险边界：DELETE 只在受控维护窗口执行，并先备份后核对影响范围。
jdbcTemplate.execute(sql);
// 关键变化：users 表中的记录被删除。
System.out.println("done");
// 输出：done。`,
      expected: [],
    },
    {
      name: 'jdbc-text-block-is-executable-sql',
      heading: 'jdbcTemplate.execute：执行删除',
      language: 'java',
      code: `String sql = """
DELETE FROM users
""";
jdbcTemplate.execute(sql);
// 关键变化：users 表中的记录被删除。
System.out.println("done");
// 输出：done。`,
      expected: ['[danger:boundary]'],
    },
    {
      name: 'jdbc-unanalysable-dynamic-sql-requires-boundary',
      heading: 'jdbcTemplate.execute：执行动态 SQL',
      language: 'java',
      code: `String operation = "DELETE";
String tableName = "users";
String sql = buildStatement(operation, tableName);
jdbcTemplate.execute(sql);
// 关键变化：SQL 执行后影响目标表。
System.out.println("done");
// 输出：done。`,
      expected: ['[danger:boundary]'],
    },
    {
      name: 'java-redis-script-variable-is-executable',
      heading: 'DefaultRedisScript：执行 Redis 脚本',
      language: 'java',
      code: `String script = "return redis.call('FLUSHALL')";
redisTemplate.execute(new DefaultRedisScript<>(script, Long.class));
// 关键变化：Redis 实例中的数据被脚本清空。
System.out.println("done");
// 输出：done。`,
      expected: ['[danger:boundary]'],
    },
    {
      name: 'redis-variable-boundary-must-be-at-execution-site',
      heading: 'DefaultRedisScript：执行 Redis 脚本',
      language: 'java',
      code: `String script = "return redis.call('FLUSHALL')";
String label = "separator";
int count = 0;
count += 1;
count += 1;
redisTemplate.execute(new DefaultRedisScript<>(script, Long.class));
// 关键变化：Redis 实例中的数据被脚本清空。
System.out.println(count);
// 输出：2。`,
      boundary: '// 风险边界：FLUSHALL 只在受控测试实例执行，并先备份后验证恢复路径。',
      expected: ['[danger:boundary]'],
    },
    {
      name: 'java-unrelated-sql-label-near-jdbc-call',
      heading: 'jdbcTemplate.query：查询记录',
      language: 'java',
      code: `String label = "DELETE FROM users";
String sql = "SELECT name FROM users WHERE id = 7";
var names = jdbcTemplate.query(sql, rowMapper);
// 关键变化：names 从空集合更新为 id = 7 的查询结果。
System.out.println(names.size());
// 输出：1。`,
      expected: [],
    },
    {
      name: 'java-redis-script-string-is-executable',
      heading: 'DefaultRedisScript：执行 Redis 脚本',
      language: 'java',
      code: `String key = "demo:count";
redisTemplate.execute(new DefaultRedisScript<>("return redis.call('FLUSHALL')", Long.class));
// 关键变化：Redis 实例中的数据被脚本清空。
System.out.println("done");
// 输出：done。`,
      expected: ['[danger:boundary]'],
    },
    {
      name: 'java-redis-script-string-with-local-boundary',
      heading: 'DefaultRedisScript：执行 Redis 脚本',
      language: 'java',
      code: `String key = "demo:count";
// 风险边界：FLUSHALL 只在受控测试实例执行，并先备份后验证恢复路径。
redisTemplate.execute(new DefaultRedisScript<>("return redis.call('FLUSHALL')", Long.class));
// 关键变化：Redis 实例中的数据被脚本清空。
System.out.println("done");
// 输出：done。`,
      expected: [],
    },
  ]

  for (const scenario of matrix) {
    const fixture = createArticleContractOperationFixture({
      heading: scenario.heading,
      language: scenario.language,
      code: scenario.code,
      boundary: scenario.boundary,
    })
    assertArticleContractIssueTypes(fixture, scenario.expected, `matrix/${scenario.name}.md`)
  }
})

test('danger boundaries are associated with each executable occurrence', () => {
  const fixture = createArticleContractOperationFixture({
    heading: 'KEYS：对比两个键空间查询',
    language: 'redis',
    code: `# 初始状态：demo:count = 1。
SET demo:count 1
KEYS demo:*
# 风险边界：KEYS 只在受控测试环境执行，生产环境使用 SCAN 以避免阻塞键空间。
# 说明：这里刻意留出距离，避免后一条命令继承前一条边界。
# 说明：后一条命令仍然需要单独评估。
KEYS archive:*
# 关键变化：demo:count 从 1 递增为 2。
# 输出：命令返回 2 个匹配结果。`,
  })

  const issues = inspectArticleContract(fixture, { path: 'matrix/keys-per-occurrence.md' })
  assert.deepEqual(articleContractIssueTypes(issues), ['[danger:boundary]'])
  assert.match(issues[0], /KEYS needs a nearby explicit risk boundary/u)
})

test('danger boundaries describe the matching operation instead of a neighboring danger', () => {
  const fixture = createArticleContractOperationFixture({
    heading: 'DEL：删除多个键',
    language: 'redis',
    code: `# 初始状态：demo:1 和 demo:2 都存在。
# 风险边界：KEYS 只在受控测试环境执行，生产环境使用 SCAN 避免阻塞键空间。
DEL demo:1 demo:2
# 关键变化：demo:1 和 demo:2 被删除。
# 输出：命令返回删除数量 2。`,
  })

  assertArticleContractIssueTypes(fixture, ['[danger:boundary]'], 'matrix/del-wrong-operation-boundary.md')
})

test('operation H3 names correlate with executable APIs instead of arbitrary identifiers', () => {
  for (const heading of ['Foo：任意标识符', 'NotAnApi：任意标识符']) {
    const fixture = createArticleContractOperationFixture({
      heading,
      language: 'java',
      code: `int count = 1;
// 关键变化：count 从 1 更新为 2。
count = 2;
System.out.println(count);
// 输出：2。`,
    })
    assertArticleContractIssueTypes(fixture, ['[h3:name]'], `matrix/${heading.split('：')[0]}.md`)
  }

  const mismatchedReceiver = createArticleContractOperationFixture({
    heading: 'Foo.get：读取列表元素',
    language: 'java',
    code: `List<String> names = List.of("Ada");
String name = names.get(0);
// 关键变化：name 从列表中的 Ada 更新为该元素。
System.out.println(name);
// 输出：Ada。`,
  })
  assertArticleContractIssueTypes(mismatchedReceiver, ['[h3:name]'], 'matrix/Foo.get-mismatched-receiver.md')

  const unrelatedReceiverEvidence = createArticleContractOperationFixture({
    heading: 'Foo.get：读取列表元素',
    language: 'java',
    code: `Foo.bar();
List<String> names = List.of("Ada");
String name = names.get(0);
// 关键变化：name 从列表中的 Ada 更新为该元素。
System.out.println(name);
// 输出：Ada。`,
  })
  assertArticleContractIssueTypes(unrelatedReceiverEvidence, ['[h3:name]'], 'matrix/Foo.get-unrelated-receiver-evidence.md')
  const unrelatedConstructor = {
    ...unrelatedReceiverEvidence,
    body: unrelatedReceiverEvidence.body.replace('Foo.bar();', 'new Foo().bar();'),
  }
  assertArticleContractIssueTypes(unrelatedConstructor, ['[h3:name]'], 'matrix/Foo.get-unrelated-constructor.md')

  const positiveExamples = [
    {
      heading: 'Foo.get：读取值',
      code: `int value = new Foo().get();
// 关键变化：value 从 Foo 读取为 7。
System.out.println(value);
// 输出：7。`,
    },
    {
      heading: 'StringBuilder.append：追加文本',
      code: `var value = new StringBuilder(String.valueOf(7)).append("A");
// 关键变化：value 从 7 追加为 7A。
System.out.println(value);
// 输出：7A。`,
    },
    {
      heading: 'StringBuilder.append：追加文本',
      code: `String seed = "A";
StringBuilder builder = new StringBuilder();
builder.append("A");
// 关键变化：builder 从空文本更新为 A。
System.out.println(builder);
// 输出：A。`,
    },
    {
      heading: '@Configuration：声明配置类',
      code: `String profile = "demo";
@Configuration
class DemoConfig {}
// 关键变化：DemoConfig 被注册为配置类。
System.out.println(DemoConfig.class);
// 输出：DemoConfig。`,
    },
    {
      heading: 'List.size：读取列表数量',
      code: `String seed = "A";
int count = List.of(seed).size();
// 关键变化：count 从 0 更新为 1。
System.out.println(count);
// 输出：1。`,
    },
  ]
  for (const example of positiveExamples) {
    const fixture = createArticleContractOperationFixture({
      heading: example.heading,
      language: 'java',
      code: example.code,
    })
    assertArticleContractIssueTypes(fixture, [], `matrix/${example.heading}.md`)
  }

  for (const example of [
    {
      heading: 'DELETE：删除记录',
      language: 'sql',
      code: `-- 初始状态：users 表有 id = 7 的记录。
SELECT name FROM users WHERE id = 7;
-- 关键变化：查询返回 id = 7 的姓名。
-- 输出：返回 Bob。`,
    },
    {
      heading: 'KEYS：扫描键空间',
      language: 'redis',
      code: `# 初始状态：demo:count = 1。
GET demo:count
# 关键变化：读取 demo:count 的值 1。
# 输出：返回 1。`,
    },
  ]) {
    const fixture = createArticleContractOperationFixture(example)
    assertArticleContractIssueTypes(fixture, ['[h3:name]'], `matrix/mismatched-${example.heading}.md`)
  }
})

test('article contract manifest scopes strict checks to explicit new or rewritten routes', () => {
  const entries = ARTICLE_CONTRACT_MANIFEST.entries
  const paths = entries.map((entry) => (typeof entry === 'string' ? entry : entry.path))
  assert.deepEqual(
    [...ARTICLE_CONTRACT_PATHS].sort(),
    [...new Set(paths)].sort(),
    'strict article paths must be derived from the explicit manifest only',
  )
  assert.deepEqual(
    inspectArticleContractManifest(),
    [],
    'all opted-in article routes must satisfy the strict contract',
  )
})

test('backend article specification manifest covers 12 migrated pages', () => {
  assert.equal(BACKEND_ARTICLE_SPECS.length, 12, 'rule backend-manifest-count: expected 12 migrated pages')

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
      /^docs\/courses\/java\/14-后端工程\/[^/]+\.md$/u,
      `rule backend-manifest-path: ${spec.path} must be a chapter 14 Markdown path`,
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
    /\/14-后端工程\/0[1-4]-/u.test(spec.path),
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
    /\/14-后端工程\/0[1-4]-/u.test(spec.path),
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

  const iocBody = articles.get('docs/courses/java/14-后端工程/02-Spring-IoC与Bean生命周期.md') ?? ''
  for (const requiredText of ['ProxyFactory', 'AopUtils.isAopProxy', 'AnnotationConfigApplicationContext', 'getBean(']) {
    if (!iocBody.includes(requiredText)) {
      violations.push(`docs/courses/java/14-后端工程/02-Spring-IoC与Bean生命周期.md [runtime:${requiredText}] is missing`)
    }
  }

  const mvcBody = articles.get('docs/courses/java/14-后端工程/04-Spring-MVC与Servlet边界.md') ?? ''
  for (const requiredText of ['flushBuffer()', 'isCommitted()', '输出：req-7/true']) {
    if (!mvcBody.includes(requiredText)) {
      violations.push(`docs/courses/java/14-后端工程/04-Spring-MVC与Servlet边界.md [servlet:${requiredText}] is missing`)
    }
  }

  assert.deepEqual(
    violations,
    [],
    `rule backend-runtime-boundaries${formatViolations(violations)}`,
  )
})

test('persistence backend batch exposes the MyBatis contract', () => {
  const batchSpecs = BACKEND_ARTICLE_SPECS.filter((spec) =>
    /\/14-后端工程\/06-/u.test(spec.path),
  )
  assert.equal(batchSpecs.length, 1, 'rule backend-batch2-manifest: expected the migrated MyBatis page')

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

test('persistence backend batch keeps the MyBatis source boundary and database keywords', () => {
  const myBatisBody = readMarkdown(
    'docs/courses/java/14-后端工程/06-MyBatis核心与MyBatis-Plus重点.md',
  ).body
  for (const requiredText of [
    '<select', '<insert', '#{}', '<if ', '<foreach ', '结果映射',
    'BaseMapper', 'QueryWrapper', '分页', '原生 XML',
    '@TableId', 'IdType.AUTO', 'getId', 'setId', 'getStatus', 'setStatus',
    'getCreatedAt', 'setCreatedAt', 'useGeneratedKeys', 'keyProperty',
  ]) {
    assert.ok(myBatisBody.includes(requiredText), `MyBatis article needs ${requiredText}`)
  }
  assert.doesNotMatch(
    myBatisBody,
    /(?:源码|当前).{0,20}MyBatis-Plus/u,
    'MyBatis-Plus must remain an independent example and not be claimed as current source usage',
  )
  assert.doesNotMatch(myBatisBody, /User::(?:status|createdAt)/u)
  assert.doesNotMatch(myBatisBody, /record User\(/u)
  assert.doesNotMatch(myBatisBody, /service\.save\(new User\(/u)
  assert.doesNotMatch(myBatisBody, /\\\$\{\}/u)
})

test('security JSON and validation backend batch exposes boundary contracts', () => {
  const batchSpecs = BACKEND_ARTICLE_SPECS.filter((spec) =>
    /\/14-后端工程\/(?:05-|07-|08-)/u.test(spec.path),
  )
  assert.equal(batchSpecs.length, 3, 'rule backend-batch3-manifest: expected three security/JSON/validation pages')

  const articles = new Map()
  const violations = []
  for (const spec of batchSpecs) {
    try {
      const article = readMarkdown(spec.path)
      articles.set(spec.path, article.body)
      for (const issue of inspectBackendArticle(article, spec)) {
        violations.push(issue)
      }
    } catch (error) {
      violations.push(`${spec.path} [article-read] ${error.message}`)
    }
  }

  const securityPath = 'docs/courses/java/14-后端工程/05-Spring-Security与JWT.md'
  const securityBody = articles.get(securityPath) ?? ''
  for (const requiredText of [
    '认证', '授权', 'SecurityFilterChain', 'authorizeHttpRequests', '@PreAuthorize',
    'BCrypt', 'Bearer', 'claims', 'exp', 'iat', 'jti', '过期', '401', '403',
    '无状态', 'SessionCreationPolicy.STATELESS', '撤销', 'AuthenticationEntryPoint',
    'AccessDeniedHandler', 'JJWT 0.11', 'JJWT 0.12', 'jjwt-api', 'jjwt-impl',
    'jjwt-jackson', 'JWT_SECRET',
  ]) {
    if (!securityBody.includes(requiredText)) {
      violations.push(`${securityPath} [security:${requiredText}] is missing`)
    }
  }
  if (!/parserBuilder\(\)[\s\S]*?parseClaimsJws\(/u.test(securityBody)) {
    violations.push(`${securityPath} [security:jjwt-0.11-api] parserBuilder/parseClaimsJws example is missing`)
  }
  if (!/Jwts\.parser\(\)[\s\S]*?verifyWith\([\s\S]*?parseSignedClaims\(/u.test(securityBody)) {
    violations.push(`${securityPath} [security:jjwt-0.12-api] parser/verifyWith/parseSignedClaims example is missing`)
  }
  if (!/System\.getenv\("JWT_SECRET"\)|<[^>]*(?:secret|key)[^>]*>/iu.test(securityBody)) {
    violations.push(`${securityPath} [security:key-placeholder] secret must be supplied as a placeholder or environment value`)
  }
  assert.doesNotMatch(
    securityBody,
    /(?:secret|密钥)\s*[:=]\s*["'][^"']{8,}["']/iu,
    'JWT examples must not hard-code a realistic secret',
  )

  const jsonPath = 'docs/courses/java/14-后端工程/07-Jackson与Fastjson2-JSON.md'
  const jsonBody = articles.get(jsonPath) ?? ''
  for (const requiredText of [
    'Jackson 3', 'tools.jackson', 'com.fasterxml.jackson.databind', 'ObjectMapper',
    '@JsonFormat', '@JsonInclude', '@JsonSerialize', '@JsonDeserialize',
    'Fastjson2', 'JSONWriter', 'JSONReader', 'toJSONString', 'parseObject',
    '自定义序列化', '日期', '时区', 'Redis', '序列化', '敏感',
  ]) {
    if (!jsonBody.includes(requiredText)) {
      violations.push(`${jsonPath} [json:${requiredText}] is missing`)
    }
  }
  if (!/tools\.jackson\.databind\.ObjectMapper[\s\S]*?com\.fasterxml\.jackson\.databind\.ObjectMapper/u.test(jsonBody)) {
    violations.push(`${jsonPath} [json:jackson-package-difference] Jackson 3 and Jackson 2 package examples are missing`)
  }
  if (!/Redis[\s\S]*?(?:白名单|边界|serializer|Serializer)/iu.test(jsonBody)) {
    violations.push(`${jsonPath} [json:redis-boundary] Redis serialization boundary is missing`)
  }

  const validationPath = 'docs/courses/java/14-后端工程/08-Bean-Validation参数校验.md'
  const validationBody = articles.get(validationPath) ?? ''
  for (const requiredText of [
    '@NotBlank', '@NotNull', '@Size', '@Email', '@Pattern', '@Valid', '@Validated',
    '级联', '分组', 'Default', 'ConstraintValidator', '字段', 'FieldError',
    'BindingResult', '@RequestParam', '@PathVariable', '方法参数', '转换', '校验', '授权',
  ]) {
    if (!validationBody.includes(requiredText)) {
      violations.push(`${validationPath} [validation:${requiredText}] is missing`)
    }
  }
  if (!/@Constraint\(validatedBy\s*=\s*\w+\.class\)/u.test(validationBody)) {
    violations.push(`${validationPath} [validation:custom-constraint] @Constraint(validatedBy = ...) example is missing`)
  }
  if (!/implements\s+ConstraintValidator</u.test(validationBody)) {
    violations.push(`${validationPath} [validation:constraint-validator] ConstraintValidator implementation is missing`)
  }
  if (!/(?:转换)[\s\S]{0,160}(?:校验)[\s\S]{0,160}(?:授权)/u.test(validationBody)) {
    violations.push(`${validationPath} [validation:responsibility-separation] conversion/validation/authorization must be separated`)
  }

  assert.deepEqual(
    violations,
    [],
    `rule backend-batch3-contract${formatViolations(violations)}`,
  )
})

test('Task4 review regressions lock version, proxy, package, and response details', () => {
  const securityPath = 'docs/courses/java/14-后端工程/05-Spring-Security与JWT.md'
  const jsonPath = 'docs/courses/java/14-后端工程/07-Jackson与Fastjson2-JSON.md'
  const validationPath = 'docs/courses/java/14-后端工程/08-Bean-Validation参数校验.md'
  const securityBody = readMarkdown(securityPath).body
  const jsonBody = readMarkdown(jsonPath).body
  const validationBody = readMarkdown(validationPath).body

  assert.match(
    securityBody,
    /io\.jsonwebtoken[\s\S]*?<artifactId>jjwt<\/artifactId>[\s\S]*?<version>0\.9\.1<\/version>/u,
    'JJWT 0.9.1 must document its legacy monolithic dependency',
  )
  for (const artifact of ['jjwt-api', 'jjwt-impl', 'jjwt-jackson']) {
    assert.match(
      securityBody,
      new RegExp(`<artifactId>${artifact}<\\/artifactId>[\\s\\S]{0,120}<version>0\\.12\\.6<\\/version>`, 'u'),
      `JJWT 0.12.6 must version the ${artifact} module explicitly`,
    )
  }
  assert.doesNotMatch(
    securityBody,
    /<artifactId>jjwt<\/artifactId>[\s\S]{0,120}<version>0\.12/u,
    'the legacy jjwt monolith must not be presented as a modern 0.12.x dependency',
  )
  assert.match(
    securityBody,
    /Jwts\.parser\(\)\s*\.setSigningKey\([\s\S]*?\.parseClaimsJws\(/u,
    'JJWT 0.9.1 must show the legacy parser chain',
  )
  assert.match(
    securityBody,
    /Base64\.getUrlDecoder\(\)/u,
    'JWT_SECRET Base64URL examples must use the URL decoder',
  )
  assert.doesNotMatch(
    securityBody,
    /Base64\.getDecoder\(\)/u,
    'JWT_SECRET Base64URL examples must not use the standard decoder',
  )
  for (const migrationMarker of ['迁移矩阵', '0.9.1', '0.11.x', '0.12.x']) {
    assert.match(securityBody, new RegExp(migrationMarker, 'u'), `JJWT migration matrix needs ${migrationMarker}`)
  }
  for (const proxyMarker of [
    '@EnableMethodSecurity', 'AnnotationConfigApplicationContext',
    'context.getBean(ReportService.class)', 'TestingAuthenticationToken',
    'AccessDeniedException', 'denied=403', '@P("ownerId")',
  ]) {
    assert.match(securityBody, new RegExp(proxyMarker.replace(/[().]/g, '\\$&'), 'u'), `method security proxy example needs ${proxyMarker}`)
  }
  for (const httpBoundaryMarker of ['方法授权拒绝', 'HTTP 403', 'AccessDeniedHandler']) {
    assert.match(securityBody, new RegExp(httpBoundaryMarker, 'u'), `method security boundary needs ${httpBoundaryMarker}`)
  }
  assert.doesNotMatch(securityBody, /真实密钥/u, 'security warning must avoid the plan-forbidden phrase')
  assert.match(securityBody, /(?:生产密钥|实际机密值|机密值)/u, 'security warning must retain a secret-safety warning')

  for (const packageMarker of [
    'com.fasterxml.jackson.annotation.JsonFormat',
    'com.fasterxml.jackson.annotation.JsonInclude',
    'tools.jackson.core.JsonParser',
    'tools.jackson.databind.ObjectMapper',
    'tools.jackson.databind.ValueSerializer',
    'tools.jackson.databind.ValueDeserializer',
    'tools.jackson.databind.annotation.JsonSerialize',
    'tools.jackson.databind.annotation.JsonDeserialize',
  ]) {
    assert.match(jsonBody, new RegExp(packageMarker.replaceAll('.', '\\.'), 'u'), `Jackson 3 package boundary needs ${packageMarker}`)
  }
  assert.doesNotMatch(
    jsonBody,
    /tools\.jackson\.databind\.(?:JsonSerializer|JsonDeserializer)/u,
    'Jackson 3 custom handlers must use ValueSerializer/ValueDeserializer names',
  )
  assert.match(jsonBody, /@JsonSerialize\(using\s*=\s*MaskedEmailSerializer\.class\)/u, 'email masking must be field-scoped')
  assert.doesNotMatch(jsonBody, /addSerializer\(\s*String\.class\s*,\s*new\s+MaskedEmailSerializer/u, 'email masking must not globally replace String serialization')
  assert.match(jsonBody, /ObjectMapper mapper[\s\S]*?writeValueAsString\(/u, 'custom serializer must be called through ObjectMapper')
  assert.match(jsonBody, /:\s*value;/u, 'non-email values must safely pass through the serializer')
  assert.match(jsonBody, /(?:displayName|label)[\s\S]*?Ann/u, 'ObjectMapper example must show a non-email value passing through')
  assert.match(jsonBody, /at\s*>\s*0[\s\S]*?at\s*==\s*1/u, 'single-character email local parts need a dedicated masking branch')
  assert.match(jsonBody, /new PublicUser\("a@example\.test",\s*"Ann"\)/u, 'ObjectMapper example must exercise a single-character email local part')
  assert.match(jsonBody, /\*@example\.test/u, 'single-character email local parts must serialize as *@domain')
  for (const redisMarker of ['setConnectionFactory', 'afterPropertiesSet']) {
    assert.match(jsonBody, new RegExp(redisMarker, 'u'), `Redis serializer config needs ${redisMarker}`)
  }
  assert.match(jsonBody, /(?:配置片段|非独立运行)/u, 'Redis serializer snippet must state its container/config boundary')

  for (const annotationMarker of [
    '@Documented', '@Target', '@Retention(RetentionPolicy.RUNTIME)',
    'message() default', 'groups() default', 'payload() default',
  ]) {
    assert.match(validationBody, new RegExp(annotationMarker.replace(/[().]/g, '\\$&'), 'u'), `custom constraint needs ${annotationMarker}`)
  }
  assert.match(validationBody, /getDefaultMessage\(\)/u, 'field error mapping must expose the stable default message')
  assert.match(validationBody, /new\s+FieldViolation\(/u, 'field error mapping must return a stable response object')
})

test('final backend review regressions close Jackson 3 and upload failure boundaries', () => {
  const jsonPath = 'docs/courses/java/14-后端工程/07-Jackson与Fastjson2-JSON.md'
  const filePath = 'docs/courses/java/14-后端工程/10-文件上传下载与资源安全.md'
  const jsonBody = readMarkdown(jsonPath).body
  const fileBody = readMarkdown(filePath).body

  assert.match(jsonBody, /tools\.jackson\.databind\.ValueSerializer/u)
  assert.match(jsonBody, /tools\.jackson\.databind\.ValueDeserializer/u)
  assert.match(jsonBody, /extends\s+ValueSerializer<String>[\s\S]*?SerializationContext/u)
  assert.match(jsonBody, /extends\s+ValueDeserializer<String>[\s\S]*?DeserializationContext/u)
  assert.match(jsonBody, /@JsonSerialize\(using\s*=\s*MaskedEmailValueSerializer\.class\)/u)
  assert.match(jsonBody, /@JsonDeserialize\(using\s*=\s*EmailValueDeserializer\.class\)/u)
  assert.match(jsonBody, /throws\s+JacksonException/u)
  assert.match(jsonBody, /com\.fasterxml\.jackson\.databind\.JsonSerializer/u)
  assert.match(jsonBody, /com\.fasterxml\.jackson\.databind\.JsonDeserializer/u)
  assert.doesNotMatch(jsonBody, /tools\.jackson\.databind\.(?:JsonSerializer|JsonDeserializer)/u)

  const transferSection = getSection(fileBody, '常用用法') ?? ''
  assert.match(transferSection, /String extension\s*=\s*extensionOf\(file\.getOriginalFilename\(\)\)/u)
  assert.match(transferSection, /isAllowedSize\(file\.getSize\(\)\)/u)
  assert.match(transferSection, /private\s+(?:static\s+)?String extensionOf\(/u)
  assert.match(transferSection, /ALLOWED_EXTENSIONS|allowedExtensions/u)
  assert.match(transferSection, /MAX_UPLOAD_BYTES|maxUploadBytes/u)
  assert.match(
    transferSection,
    /metadata\.save\(serverName,\s*target\)[\s\S]{0,500}Files\.deleteIfExists\(target\)[\s\S]{0,180}metadataFailure\.addSuppressed\(cleanup\)[\s\S]{0,180}throw metadataFailure/u,
  )
  const helperSections = getQuickReferenceSubsections(fileBody, '常用用法')
    .filter(({ heading }) => /SecureFileService|transferTo|metadata\.save|extensionOf|download|resolveAuthorized|streamAuthorized/u.test(heading))
  assert.ok(helperSections.length >= 4, 'file service must expose searchable helper snippets')
  for (const { content } of helperSections) {
    const blocks = getBackendCodeBlocks(content)
    assert.equal(blocks.length, 1, 'each file helper heading should expose one focused code snippet')
    const codeLineCount = stripBackendComments(blocks[0].code)
      .split(/\r?\n/u)
      .filter((line) => line.trim()).length
    assert.ok(codeLineCount >= 8 && codeLineCount <= 25, 'file helper snippets should keep 8-25 non-comment code lines')
  }

  const transferBlocks = getBackendCodeBlocks(transferSection).map(({ code }) => code)
  assert.ok(
    transferBlocks.some((code) => /extensionOf\(file\.getOriginalFilename\(\)\)/u.test(code)
      && /isAllowedSize\(file\.getSize\(\)\)/u.test(code)),
    'store must call both extension and size policy helpers before writing',
  )
})

test('Task5 backend references cover logging, resource safety, Excel, and Quartz boundaries', () => {
  const task5Specs = BACKEND_ARTICLE_SPECS.filter((spec) =>
    /\/14-后端工程\/(?:09-|10-|11-|12-)/u.test(spec.path),
  )
  assert.equal(task5Specs.length, 4, 'rule backend-batch4-manifest: expected four engineering pages')

  const articles = new Map()
  const violations = []
  for (const spec of task5Specs) {
    try {
      const article = readMarkdown(spec.path)
      articles.set(spec.path, article.body)
      for (const issue of inspectBackendArticle(article, spec)) {
        violations.push(issue)
      }
    } catch (error) {
      violations.push(`${spec.path} [article-read] ${error.message}`)
    }
  }

  const loggingPath = 'docs/courses/java/14-后端工程/09-SLF4J与Logback日志.md'
  const loggingBody = articles.get(loggingPath) ?? ''
  for (const requiredText of [
    'LoggerFactory', '参数化', 'Throwable', 'MDC', 'traceId',
    'RollingFileAppender', 'SizeAndTimeBasedRollingPolicy', '脱敏',
    'AOP', 'Pointcut', '异常堆栈',
  ]) {
    if (!loggingBody.includes(requiredText)) {
      violations.push(`${loggingPath} [logging:${requiredText}] is missing`)
    }
  }
  if (!/log\.error\([^\n]*,\s*(?:ex|exception|throwable)/iu.test(loggingBody)) {
    violations.push(`${loggingPath} [logging:throwable-last] parameterized exception logging example is missing`)
  }
  if (!/%X\{traceId\}/u.test(loggingBody)) {
    violations.push(`${loggingPath} [logging:mdc-pattern] Logback MDC traceId pattern is missing`)
  }

  const filePath = 'docs/courses/java/14-后端工程/10-文件上传下载与资源安全.md'
  const fileBody = articles.get(filePath) ?? ''
  for (const requiredText of [
    'MultipartFile', 'transferTo', '扩展名', '大小白名单', 'normalize',
    '路径穿越', 'Files.createTempFile', 'Content-Disposition',
    'StreamingResponseBody', '流式',
  ]) {
    if (!fileBody.includes(requiredText)) {
      violations.push(`${filePath} [file:${requiredText}] is missing`)
    }
  }
  if (!/(?:大小|size)[\s\S]{0,100}(?:拒绝|超过|异常)/iu.test(fileBody)) {
    violations.push(`${filePath} [file:failure-boundary] upload size failure boundary is missing`)
  }
  if (!/startsWith\(root\)|startsWith\(storageRoot\)/u.test(fileBody)) {
    violations.push(`${filePath} [file:root-boundary] normalized path root check is missing`)
  }

  const poiPath = 'docs/courses/java/14-后端工程/11-Apache-POI-Excel导入导出.md'
  const poiBody = articles.get(poiPath) ?? ''
  for (const requiredText of [
    'WorkbookFactory', 'SXSSFWorkbook', '注解列映射', 'importExcel', 'exportExcel',
    '大文件', 'DateUtil.isCellDateFormatted', 'FormulaEvaluator', '资源释放',
  ]) {
    if (!poiBody.includes(requiredText)) {
      violations.push(`${poiPath} [poi:${requiredText}] is missing`)
    }
  }
  if (!/try\s*\([^)]*Workbook|try\s*\([\s\S]*?Workbook/iu.test(poiBody)) {
    violations.push(`${poiPath} [poi:resource-release] workbook try-with-resources is missing`)
  }
  if (!/(?:校验|validation)[\s\S]{0,160}(?:失败|拒绝|错误)/iu.test(poiBody)) {
    violations.push(`${poiPath} [poi:import-validation] import validation failure boundary is missing`)
  }

  const quartzPath = 'docs/courses/java/14-后端工程/12-Quartz定时任务.md'
  const quartzBody = articles.get(quartzPath) ?? ''
  for (const requiredText of [
    'Job', 'JobDetail', 'CronTrigger', 'Cron 表达式', 'misfire', '暂停', '恢复',
    '@DisallowConcurrentExecution', 'JDBCJobStore', '失败重试', 'ScheduledExecutorService',
  ]) {
    if (!quartzBody.includes(requiredText)) {
      violations.push(`${quartzPath} [quartz:${requiredText}] is missing`)
    }
  }
  if (!/(?:reschedule|重试)[\s\S]{0,160}(?:次数|attempt|失败)/iu.test(quartzBody)) {
    violations.push(`${quartzPath} [quartz:retry-boundary] retry policy is missing`)
  }
  if (!/(?:ScheduledExecutorService)[\s\S]{0,220}(?:不适合|区别|不同|无需持久化)/iu.test(quartzBody)) {
    violations.push(`${quartzPath} [quartz:scheduler-boundary] ScheduledExecutorService distinction is missing`)
  }

  assert.deepEqual(
    violations,
    [],
    `rule backend-batch4-contract${formatViolations(violations)}`,
  )
})

test('Task5 review regressions lock versions, input safety, cleanup, bytes, and scheduler lifecycle', () => {
  const loggingPath = 'docs/courses/java/14-后端工程/09-SLF4J与Logback日志.md'
  const filePath = 'docs/courses/java/14-后端工程/10-文件上传下载与资源安全.md'
  const poiPath = 'docs/courses/java/14-后端工程/11-Apache-POI-Excel导入导出.md'
  const quartzPath = 'docs/courses/java/14-后端工程/12-Quartz定时任务.md'
  const loggingBody = readMarkdown(loggingPath).body
  const fileBody = readMarkdown(filePath).body
  const poiBody = readMarkdown(poiPath).body
  const quartzBody = readMarkdown(quartzPath).body

  assert.match(loggingBody, /Spring Boot 4\.1\.0[\s\S]*Spring Framework 7/u)
  assert.match(loggingBody, /org\.slf4j:slf4j-api:2\.0\.x[\s\S]*ch\.qos\.logback:logback-classic:1\.5\.x/u)
  assert.match(loggingBody, /SLF4J 1\.7[\s\S]*(?:静态 binder|static binder)/u)
  assert.match(loggingBody, /SLF4J 2\.0[\s\S]*(?:ServiceLoader|provider)/u)
  assert.match(loggingBody, /safeContextId|safeTraceId/u)
  assert.match(loggingBody, /A-Za-z0-9\._:-\]{1,64}/u)
  assert.match(loggingBody, /CRLF|\\r|\\n/u)
  assert.match(loggingBody, /MDC\.put\("traceId",\s*(?:safeContextId|safeTraceId)\(/u)
  assert.match(loggingBody, /jobId[\s\S]{0,240}(?:safeContextId|safeJobId)/u)
  assert.match(loggingBody, /(?:password|secret|token)[\s\S]{0,80}(?:不记录|不得|不能|禁止)/iu)
  const mdcSection = getSubsection(getSection(loggingBody, '常用用法'), 'MDC：为请求附加 traceId') ?? ''
  assert.match(mdcSection, /MDC\.put\("traceId",\s*(?:safeContextId|safeTraceId)\([\s\S]{0,240}finally\s*\{[\s\S]{0,120}MDC\.remove\("traceId"\)/u)

  assert.match(fileBody, /Spring Boot 4\.1\.0[\s\S]*Spring Framework 7/u)
  assert.match(fileBody, /org\.springframework\.boot:spring-boot-starter-web:4\.1\.0/u)
  assert.match(fileBody, /transferTo\(Path\)[\s\S]*(?:transferTo\(File\)|File 重载|File overload)/iu)
  assert.match(fileBody, /trusted|受信|授权|authorization|canRead|isAuthorized/iu)
  assert.match(fileBody, /toRealPath|isSymbolicLink|NOFOLLOW_LINKS/u)
  assert.match(fileBody, /getOriginalFilename\(\)[\s\S]{0,240}(?:不能|禁止|not)[\s\S]{0,240}(?:路径|path)/iu)
  assert.match(fileBody, /addSuppressed/u)
  assert.match(fileBody, /toLowerCase\(Locale\.ROOT\)/u)
  assert.doesNotMatch(fileBody, /\.toLowerCase\(\)/u)
  const fileServiceSection = getSection(fileBody, '常用用法') ?? ''
  const transferSection = getSubsection(fileServiceSection, 'transferTo：在白名单目录落盘') ?? ''
  const downloadSection = getSubsection(getSection(fileBody, '常用用法'), '流式下载：避免一次性读入内存') ?? ''
  assert.match(transferSection, /class SecureFileService/u)
  assert.match(transferSection, /store\(MultipartFile file, String principal\)/u)
  assert.match(transferSection, /authorization\.canUpload\(principal\)/u)
  assert.match(transferSection, /String serverName\s*=\s*UUID\.randomUUID\(\)\.toString\(\)/u)
  assert.match(transferSection, /resolveWriteTarget\(serverName, extension\)/u)
  assert.match(transferSection, /Files\.newOutputStream\(target,[\s\S]{0,160}StandardOpenOption\.CREATE_NEW[\s\S]{0,160}LinkOption\.NOFOLLOW_LINKS/u)
  assert.match(transferSection, /file\.getInputStream\(\)[\s\S]{0,320}\.transferTo\(output\)/u)
  assert.match(transferSection, /FileAlreadyExistsException/u)
  assert.doesNotMatch(transferSection, /file\.transferTo\(target\)/u)
  assert.doesNotMatch(transferSection, /Files\.exists\(candidate,\s*LinkOption\.NOFOLLOW_LINKS\)/u)
  assert.match(fileServiceSection, /SecureDirectoryStream/u)
  assert.match(fileServiceSection, /newByteChannel\(relative,[\s\S]{0,180}LinkOption\.NOFOLLOW_LINKS/u)
  assert.match(fileServiceSection, /Files\.newInputStream\(file,\s*LinkOption\.NOFOLLOW_LINKS\)/u)
  assert.match(fileBody, /TOCTOU|竞态/u)
  assert.match(fileBody, /trustedRoot[\s\S]{0,320}(?:服务进程专属|仅服务进程可写|service process only writable)/iu)
  assert.match(fileBody, /跨平台/u)
  assert.match(fileServiceSection, /parent\.toRealPath\(\)[\s\S]{0,180}startsWith\(trustedRoot\)/u)
  assert.match(fileServiceSection, /download\(String fileId, String principal\)/u)
  assert.match(fileServiceSection, /resolveAuthorized\(record, principal\)/u)
  assert.match(fileServiceSection, /return output -> streamAuthorized\(file, relative, output\)/u)
  assert.match(downloadSection, /resourceService\.download\("file-7", principal\)/u)
  assert.doesNotMatch(fileBody, /StreamingResponseBody download\(Path file\)/u)

  assert.match(poiBody, /org\.apache\.poi:poi-ooxml:5\.5\.1/u)
  assert.match(poiBody, /POI 5\.5\.1[\s\S]*(?:CellType\.FORMULA|Workbook\.close|dispose)/u)
  assert.match(poiBody, /new BufferedInputStream\(input\)/u)
  assert.match(poiBody, /MissingCellPolicy|DataFormatter/u)
  assert.match(poiBody, /workbook\.write\((?:out|output)\)/u)
  assert.match(poiBody, /return output\.toByteArray\(\)/u)
  assert.doesNotMatch(poiBody, /return new byte\[0\]/u)
  const formulaSection = getSubsection(getSection(poiBody, '不常用但需要知道'), '日期/公式') ?? ''
  assert.ok(
    formulaSection.indexOf('CellType.FORMULA') >= 0 &&
      formulaSection.indexOf('CellType.FORMULA') < formulaSection.indexOf('DateUtil.isCellDateFormatted'),
    'formula cells must be classified before date formatting',
  )
  assert.match(poiBody, /dispose\(\)[\s\S]{0,100}(?:boolean|true|false|删除成功)/u)
  assert.doesNotMatch(poiBody, /必须同时[^\n]*(?:close|关闭)[^\n]*(?:dispose|临时)/u)
  assert.match(poiBody, /addSuppressed/u)

  assert.match(quartzBody, /org\.quartz-scheduler:quartz:2\.x/u)
  assert.match(quartzBody, /Quartz 1\.x[\s\S]*Quartz 2\.x[\s\S]*(?:JobBuilder|TriggerBuilder)/u)
  for (const property of [
    'org.quartz.jobStore.class',
    'org.quartz.jobStore.driverDelegateClass',
    'org.quartz.jobStore.dataSource',
    'org.quartz.jobStore.tablePrefix',
    'org.quartz.jobStore.isClustered',
    'org.quartz.scheduler.instanceId',
    'org.quartz.dataSource.',
  ]) {
    assert.match(quartzBody, new RegExp(property.replaceAll('.', '\\.'), 'u'), `Quartz property ${property} is missing`)
  }
  const retrySection = getSubsection(getSection(quartzBody, '不常用但需要知道'), '失败重试') ?? ''
  assert.match(quartzBody, /### 失败重试：区分立即 refire 与有界指数退避 Trigger/u)
  assert.match(retrySection, /setRefireImmediately\(true\)/u)
  assert.match(retrySection, /(?:立即|immediate)/iu)
  assert.match(retrySection, /(?:新|new)\s*Trigger|SimpleTrigger|startAt|scheduleJob/u)
  assert.match(retrySection, /maxRefires|MAX_REFIRES/u)
  assert.match(retrySection, /retry=exhausted|retry limit exceeded|失败告警/u)
  assert.match(retrySection, /throw new JobExecutionException\(["']retry limit exceeded["']\)/u)
  assert.match(retrySection, /baseSeconds[\s\S]{0,220}maxSeconds/u)
  assert.match(retrySection, /Math\.min\([\s\S]{0,220}attempt/u)
  assert.match(retrySection, /attempt\s*<\s*0[\s\S]{0,180}attempt\s*>=\s*maxAttempts/u)
  assert.match(retrySection, /DateBuilder\.futureDate\(Math\.toIntExact\(delaySeconds\)/u)
  assert.match(retrySection, /getFireInstanceId\(\)/u)
  assert.match(retrySection, /UUID\.randomUUID\(\)/u)
  assert.match(retrySection, /jobKey[\s\S]{0,260}runId/u)
  assert.match(retrySection, /withIdentity\([\s\S]{0,260}(?:jobKey|runId|fireInstanceId)/u)
  assert.doesNotMatch(retrySection, /withIdentity\("cleanup-retry-"\s*\+\s*attempt/u)
  assert.match(quartzBody, /Scheduler[\s\S]*scheduler\.shutdown\(/u)
})

test('Java backend index exposes all twelve migrated article routes', () => {
  const index = readMarkdown(JAVA_INDEX_PATH).body
  const violations = []
  for (const spec of BACKEND_ARTICLE_SPECS) {
    const route = relativeRoute(spec.path)
    const escapedRoute = route.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    if (!new RegExp(`\\]\\(${escapedRoute}(?:#[^) ]*)?\\)`, 'u').test(index)) {
      violations.push(`${JAVA_INDEX_PATH} [backend-route:${route}] linked route is missing`)
    }
  }
  assert.deepEqual(violations, [], `rule backend-index-routes${formatViolations(violations)}`)
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
    104,
    'rule java-markdown-count: expected 104 Markdown files',
  )
  assert.equal(
    markdownPaths.filter((file) => !file.endsWith('/index.md')).length,
    102,
    'rule java-article-count: expected 102 course articles',
  )
  assert.equal(
    chapterDirectories.length,
    14,
    'rule java-chapter-count: expected 14 chapter directories',
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

test('Java API heading format guard rejects malformed fixture content', () => {
  const valid = `
## 常用用法

### \`first\`：读取第一个值

需要读取第一个结果时使用这个入口。

\`\`\`java
int first = 1;
// 输出：1
\`\`\`
`
  assert.deepEqual(inspectApiHeadingFormat(valid), [])

  const cases = [
    ['', 'expected exactly one exact "## 常用用法" heading, found 0'],
    [valid + '\n## 常用用法\n', 'expected exactly one exact "## 常用用法" heading, found 2'],
    [valid.replace('需要读取第一个结果时使用这个入口。', '- 先看列表'), 'first non-empty block must be a purpose sentence'],
    [valid.replace('需要读取第一个结果时使用这个入口。', '太短。'), 'purpose must be one complete sentence of at least 10 characters'],
    [valid.replace('```java', '```text'), 'purpose sentence must be followed by a java/sql/xml fence'],
    [valid.replace('int first = 1;', '// 只有注释'), 'example needs real non-comment code'],
    [valid.replace('// 输出：1', '// 普通注释'), 'example needs a standalone output/result line'],
    [valid.replace('`first`：读取第一个值', '`first`/`second`：两个独立入口'), 'combined API heading is not in the atomic-operation allowlist'],
  ]
  for (const [fixture, expected] of cases) {
    assert.ok(inspectApiHeadingFormat(fixture).some((issue) => issue.includes(expected)), expected)
  }
})

test('external API heading tokens require an exact positive H3 API label', () => {
  const fixture = `
### \`List.add\`：追加元素

### \`List.put\` 不存在：列表按索引替换应使用 \`List.set\`

### File.transferTo 不存在：文件复制应使用 Files.copy
`

  assert.deepEqual(
    getExternalApiHeadingTokens(fixture),
    new Set(['List.add']),
    'negative or explanatory H3 titles must not masquerade as external API headings',
  )
})

test('List iterator and remove examples show calls, state, and output', () => {
  const body = readMarkdown('docs/courses/java/05-泛型与集合/04-List常用API.md').body
  const commonUsage = getSection(body, '常用用法')
  const iteratorExample = getSubsection(commonUsage, 'List.iterator') ?? ''
  const removeExample = getSubsection(commonUsage, 'List.remove') ?? ''

  assert.match(iteratorExample, /\.iterator\(\)[\s\S]*\.hasNext\(\)[\s\S]*\.next\(\)/u)
  assert.match(iteratorExample, /\/\/ names：\[Alice, Bob\][\s\S]*\/\/ 输出：Alice、Bob/u)
  assert.match(removeExample, /\/\/ numbers：\[10, 20, 30\][\s\S]*remove\(1\)[\s\S]*remove\(Integer\.valueOf\(30\)\)[\s\S]*\/\/ 输出：\[10\]/u)
})

test('all 102 Java articles keep the unified API heading format', () => {
  const violations = []
  for (const relativePath of ARTICLE_PATHS) {
    const { body } = readMarkdown(relativePath)
    for (const issue of inspectApiHeadingFormat(body)) {
      violations.push(`${relativePath} ${issue}`)
    }
  }
  assert.deepEqual(violations, [], `rule java-api-heading-format${formatViolations(violations)}`)
})

test('combined API headings reject plus signs, Chinese connectors, and trailing bare method names', () => {
  const fixture = `
## 常用用法

### \`JSONUtil.toJsonStr\` + \`toBean\`：复制对象

用途说明必须完整且具体。

\`\`\`java
// 作用：JSONUtil.toJsonStr 先序列化 source
String json = JSONUtil.toJsonStr(source);
// 输出：json
\`\`\`

### \`JSONUtil.toBean\` 与 \`TypeReference\`：转换泛型

用途说明必须完整且具体。

\`\`\`java
// 作用：TypeReference 保留 grouped 的泛型参数
Object grouped = JSONUtil.toBean(json, typeReference, false);
// 输出：grouped
\`\`\`

### Collections.rotate、swap 和 frequency：集合工具

用途说明必须完整且具体。

\`\`\`java
// 作用：Collections.rotate 调整 list 的元素位置
Collections.rotate(list, 1);
// 输出：list
\`\`\`
`
  assert.deepEqual(inspectApiHeadingFormat(fixture), [
    '[`JSONUtil.toJsonStr` + `toBean`：复制对象] combined API heading is not in the atomic-operation allowlist',
    '[`JSONUtil.toBean` 与 `TypeReference`：转换泛型] combined API heading is not in the atomic-operation allowlist',
    '[Collections.rotate、swap 和 frequency：集合工具] combined API heading is not in the atomic-operation allowlist',
  ])
})

test('reviewed JSON, regex, and Collections APIs keep one operation per H3', () => {
  const expectations = {
    'docs/courses/java/02-数组与文本/04-正则表达式与文本匹配.md': [
      '`Matcher.appendReplacement`', '`Matcher.quoteReplacement`', '`Matcher.appendTail`',
    ],
    'docs/courses/java/02-数组与文本/05-JSON与Java对象转换.md': [
      '`TypeReference`', '`JSONUtil.toBean`', '`JSONUtil.toJsonStr`',
    ],
    'docs/courses/java/05-泛型与集合/04-List常用API.md': [
      '`Collections.rotate`', '`Collections.swap`', '`Collections.frequency`',
    ],
  }

  for (const [relativePath, requiredLabels] of Object.entries(expectations)) {
    const headings = getAllH3Subsections(readMarkdown(relativePath).body)
      .map(({ heading }) => heading.split(/[：:]/u, 1)[0].trim())
    for (const label of requiredLabels) assert.ok(headings.includes(label), `${relativePath} needs ${label}`)
  }
})

test('@Primary example proves Spring container selection instead of direct construction', () => {
  const body = readMarkdown('docs/courses/java/14-后端工程/02-Spring-IoC与Bean生命周期.md').body
  const primary = getSubsection(getSection(body, '不常用但需要知道'), '@Primary') ?? ''
  assert.match(primary, /AnnotationConfigApplicationContext/u)
  assert.match(primary, /@Primary[\s\S]*Notifier systemClockNotifier/u)
  assert.match(primary, /Notifier backupClockNotifier/u)
  assert.match(primary, /AlertService alertService\(Notifier notifier\)/u)
  assert.match(primary, /getBean\(Notifier\.class\)[\s\S]*getBean\(AlertService\.class\)/u)
  assert.match(primary, /直接 `new`[^。]*不能证明 `@Primary` 生效/u)
})

test('common-usage first examples require explanation and result comments in their own language', () => {
  const valid = `
## 常用用法

### \`List.get\`：读取元素

\`\`\`java
int first = 1;
// 初始状态：List.get 将读取列表中的 first
// 作用：List.get 返回索引 0 的元素
// 输出：1
\`\`\`

### \`SELECT\`：读取一行

\`\`\`sql
-- 作用：SELECT 按主键 id 读取用户
SELECT * FROM sys_user WHERE id = 1;
-- 结果：返回一行用户数据
\`\`\`

### \`select\`：声明映射查询

\`\`\`xml
<!--
  前置：已经声明 Mapper 命名空间
-->
<select id="findById">SELECT 1</select>
<!-- 结果：映射为一个整数 -->
\`\`\`

### \`spring.profiles.active\`：选择环境

\`\`\`properties
# 说明：启用开发环境配置
spring.profiles.active=dev
# 结果：dev 配置生效
\`\`\`

### \`server.port\`：配置端口

\`\`\`yaml
# 输入：服务监听端口
server:
  port: 8080
# 结果：应用监听 8080 端口
\`\`\`

### \`java\`：运行类

\`\`\`shell
# 当前状态：java 将运行 Demo
java Demo
# 输出：hello
\`\`\`
`

  assert.deepEqual(inspectApiExampleComments(valid), [])

  const onlyOutput = valid.replace('// 初始状态：List.get 将读取列表中的 first\n', '')
  assert.deepEqual(
    inspectApiExampleComments(onlyOutput),
    ['[`List.get`：读取元素] first java block must explain the input or initial state on the line after its setup statement'],
    'an output comment alone must not satisfy the explanation requirement',
  )

  const detachedSummary = `
## 常用用法
### \`List.add\`：追加元素
\`\`\`java
// 说明：names 初始包含 Alice、Bob，List.add 会追加 Carol
List<String> names = new ArrayList<>(List.of("Alice", "Bob"));
names.add("Carol");
System.out.println(names);
// 输出：[Alice, Bob, Carol]
\`\`\`
`
  assert.deepEqual(
    inspectApiExampleComments(detachedSummary),
    [
      '[\`List.add\`：追加元素] first java block must explain the input or initial state on the line after its setup statement',
      '[\`List.add\`：追加元素] first java block must explain the API call or state change on the line after its key statement',
    ],
    'a detached summary plus output must not replace statement-adjacent input and action comments',
  )

  const externalMutationWithoutInput = `
## 常用用法
### \`RedisTemplate.opsForHash\`：写入 Hash 字段
\`\`\`java
redisTemplate.opsForHash().put("user:7", "name", "Ann");
// 关键变化：redisTemplate.opsForHash().put("user:7", "name", "Ann") 写入后该字段变为 Ann
System.out.println(redisTemplate.opsForHash().get("user:7", "name"));
// 输出：Ann
// 作用：redisTemplate.opsForHash().get("user:7", "name") 返回已写入的 Ann。
\`\`\`
`
  assert.deepEqual(
    inspectApiExampleComments(externalMutationWithoutInput),
    ['[\`RedisTemplate.opsForHash\`：写入 Hash 字段] first java block must explain the input on the line after its key statement when no setup statement exists'],
    'an external state mutation still needs explicit key/value input even without a local setup variable',
  )

  const outputMasqueradingAsAction = `
## 常用用法
### \`List.add\`：追加元素
\`\`\`java
List<String> names = new ArrayList<>(List.of("Alice", "Bob"));
// 初始状态：names 包含 Alice、Bob
names.add("Carol");
// 输出：[Alice, Bob, Carol]
\`\`\`
`
  assert.deepEqual(
    inspectApiExampleComments(outputMasqueradingAsAction),
    ['[\`List.add\`：追加元素] first java block must explain the API call or state change on the line after its key statement'],
    'an output comment must not also satisfy the call-effect contract',
  )

  const resultOrReturnMasqueradingAsAction = `
## 常用用法
### \`List.get\`：读取元素
\`\`\`java
List<String> names = List.of("Alice", "Bob");
// 初始状态：names 包含 Alice、Bob。
int first = names.get(0);
// 结果：first 为 Alice。
System.out.println(first);
// 输出：Alice
\`\`\`
`
  assert.deepEqual(
    inspectApiExampleComments(resultOrReturnMasqueradingAsAction),
    ['[\`List.get\`：读取元素] first java block must explain the API call or state change on the line after its key statement'],
    'a 结果 comment must not satisfy the adjacent action contract',
  )

  const directOutputCall = `
## 常用用法
### \`List.get\`：读取元素
\`\`\`java
List<String> names = List.of("Alice", "Bob");
// 初始状态：names 包含 Alice、Bob。
System.out.println(names.get(1));
// 输出：Bob
\`\`\`
`
  assert.deepEqual(
    inspectApiExampleComments(directOutputCall),
    [],
    'a final println may report a nested API result without treating its output comment as an action comment',
  )

  const returnMasqueradingAsAction = resultOrReturnMasqueradingAsAction.replace(
    '// 结果：first 为 Alice。',
    '// 返回：first 接收 names.get(0) 的返回值。',
  )
  assert.deepEqual(
    inspectApiExampleComments(returnMasqueradingAsAction),
    ['[\`List.get\`：读取元素] first java block must explain the API call or state change on the line after its key statement'],
    'a 返回 comment must not satisfy the adjacent action contract',
  )

  const genericAction = resultOrReturnMasqueradingAsAction.replace(
    '// 结果：first 为 Alice。',
    '// 作用：执行新增操作。',
  )
  assert.deepEqual(
    inspectApiExampleComments(genericAction),
    ['[\`List.get\`：读取元素] first java block must explain the API call or state change on the line after its key statement'],
    'a generic action comment without the call target or argument must be rejected',
  )

  const genericActionWithoutEffect = resultOrReturnMasqueradingAsAction.replace(
    '// 结果：first 为 Alice。',
    '// 作用：names 使用参数 0。',
  )
  assert.deepEqual(
    inspectApiExampleComments(genericActionWithoutEffect),
    ['[\`List.get\`：读取元素] first java block must explain the API call or state change on the line after its key statement'],
    'an action comment naming inputs but no post-call effect must be rejected',
  )

  const onlyFirstOfTwoCalls = resultOrReturnMasqueradingAsAction.replace(
    'int first = names.get(0);\n// 结果：first 为 Alice。',
    'int first = names.get(0);\n// 作用：names.get(0) 返回的元素写入 first。',
  )
    .replace(
      'System.out.println(first);',
      'int second = names.get(1);\nSystem.out.println(first + second);',
    )
  assert.deepEqual(
    inspectApiExampleComments(onlyFirstOfTwoCalls),
    ['[\`List.get\`：读取元素] first java block must explain the API call or state change on the line after its key statement'],
    'every repeated API call needs its own adjacent action comment',
  )

  const repeatedMutations = `
## 常用用法
### \`List.add\`：逐次追加元素
\`\`\`java
List<String> list = new ArrayList<>(List.of("a"));
// 初始状态：list 当前为 [a]
list.add("b");
// 关键变化：list.add("b") 将 "b" 追加到末尾，list 变为 [a, b]
list.add("c");
// 关键变化：list.add("c") 再追加 "c"，list 变为 [a, b, c]
System.out.println(list);
// 输出：[a, b, c]
\`\`\`
`
  assert.deepEqual(inspectApiExampleComments(repeatedMutations), [])
  const missingRepeatedMutation = repeatedMutations.replace(
    '// 关键变化：list.add("c") 再追加 "c"，list 变为 [a, b, c]',
    '// 输出：先前列表内容',
  )
  assert.deepEqual(
    inspectApiExampleComments(missingRepeatedMutation),
    ['[\`List.add\`：逐次追加元素] first java block must explain the API call or state change on the line after its key statement'],
    'every repeated mutating call needs its own concrete state-change comment',
  )

  const detachedResult = `
## 常用用法
### \`List.size\`：读取元素数
\`\`\`java
// 输出：2
List<String> names = List.of("Alice", "Bob");
// 初始状态：names 包含 Alice、Bob
int size = names.size();
// 作用：List.size 返回 names 的元素数
System.out.println(size);
\`\`\`
`
  assert.deepEqual(
    inspectApiExampleComments(detachedResult),
    ['[\`List.size\`：读取元素数] first java block must put its result/output comment on the line after the observable statement'],
    'a detached result comment must not satisfy the observable-result contract',
  )

  const vagueInitialState = `
## 常用用法
### \`List.add\`：追加元素
\`\`\`java
List<String> names = new ArrayList<>(List.of("Alice", "Bob"));
// 初始状态：准备输入
names.add("Carol");
// 关键变化：names 增加一个元素
System.out.println(names);
// 输出：[Alice, Bob, Carol]
\`\`\`
`
  assert.deepEqual(
    inspectApiExampleComments(vagueInitialState),
    ['[\`List.add\`：追加元素] first java block setup comment must include a concrete input or initial value'],
    'a setup label without the actual variable, literal, or API input must be rejected',
  )

  const onlyExplanation = valid.replace('// 输出：1\n', '')
  assert.deepEqual(
    inspectApiExampleComments(onlyExplanation),
    ['[`List.get`：读取元素] first java block needs a result/output comment'],
  )

  const wrongLanguageMarker = valid.replace('-- 作用：SELECT 按主键 id 读取用户', '// 作用：SELECT 按主键 id 读取用户')
  assert.deepEqual(
    inspectApiExampleComments(wrongLanguageMarker),
    ['[`SELECT`：读取一行] first sql block needs an explanation comment'],
  )

  const fencedPseudoHeading = `
## 常用用法
### \`run-demo\`：运行 Shell 示例
\`\`\`shell
### this is shell content, not a Markdown heading
echo ready
# 输出：ready
\`\`\`
`
  assert.deepEqual(
    inspectApiExampleComments(fencedPseudoHeading),
    ['[`run-demo`：运行 Shell 示例] first shell block needs an explanation comment'],
  )

  const conceptHeading = `
## 简单案例
### 事务传播与回滚边界
\`\`\`java
service.save();
\`\`\`
`
  assert.deepEqual(inspectApiExampleComments(conceptHeading), [], 'pure concept H3 headings are not API subsections')

  const vagueExplanation = `
## 常用用法
### \`List.get\`：读取元素
\`\`\`java
// 说明：读取需要的内容
int first = numbers.get(0);
// 输出：1
\`\`\`
`
  assert.deepEqual(
    inspectApiExampleComments(vagueExplanation),
    ['[`List.get`：读取元素] first java block explanation must name its API or a real code identifier/literal'],
  )

  const concreteExplanation = vagueExplanation
    .replace('// 说明：读取需要的内容', '// 输入：numbers 包含 "Alice"，List.get 读取索引 0')
    .replace(
      'int first = numbers.get(0);\n// 输出：1',
      'int first = numbers.get(0);\n// 输入：numbers 包含 "Alice"，本次读取索引 0。\n// 作用：List.get 返回 numbers 在索引 0 的元素。\n// 输出：1',
    )
  assert.deepEqual(inspectApiExampleComments(concreteExplanation), [])

  const keywordOnlyExplanation = vagueExplanation.replace(
    '读取需要的内容',
    'import public private protected static final class String try var return new true false Java Redis',
  )
  assert.deepEqual(
    inspectApiExampleComments(keywordOnlyExplanation),
    ['[`List.get`：读取元素] first java block explanation must name its API or a real code identifier/literal'],
  )
})

test('all 102 Java articles put API purpose prose before examples and retain observable results', () => {
  const violations = []
  for (const relativePath of ARTICLE_PATHS) {
    const { body } = readMarkdown(relativePath)
    for (const { heading, content } of getSupportedApiH3Subsections(body)) {
      const lines = content.split(/\r?\n/u)
      const firstCode = lines.findIndex((line) => /^\s*```(?:java|sql|xml|properties|yaml|shell)\b/iu.test(line))
      if (firstCode < 0) {
        violations.push(`${relativePath} [${heading}] has no supported example`)
        continue
      }
      const purpose = stripMarkdown(lines.slice(0, firstCode).join(' '))
      if (purpose.length < 10 || !/[。！？.!?]$/u.test(purpose)) {
        violations.push(`${relativePath} [${heading}] needs a concise purpose sentence before its example`)
      }
      const language = lines.slice(firstCode).find((line) => /^\s*```/u.test(line))?.trim().slice(3).split(/\s/u, 1)[0].toLowerCase()
      const codeEnd = lines.findIndex((line, index) => index > firstCode && /^\s*```\s*$/u.test(line))
      const code = lines.slice(firstCode + 1, codeEnd).join('\n')
      if (language === 'java') {
        for (const issue of inspectJavaOutputContract(code)) violations.push(`${relativePath} [${heading}] ${issue}`)
      } else if (!getLanguageComments(language, code).some((comment) => RESULT_COMMENT_LABEL.test(comment))) {
        violations.push(`${relativePath} [${heading}] needs a standalone result/output comment`)
      }
    }
  }
  assert.deepEqual(violations, [], `rule java-common-usage-example-comments${formatViolations(violations)}`)
})

test('08-14 Java blocks reject recursive, templated, reused, and detached output comments', () => {
  const recursiveFixture = `
### \`List.size\`：读取元素数
\`\`\`java
int size = 2;
// 初始状态：size = 2
System.out.println(size);
// 输出：// 输出：2
\`\`\`
`
  assert.match(
    inspectJavaOutputContract(getJavaBlocks(recursiveFixture)[0]).join('\n'),
    /recursive 输出/u,
    'recursive output comments must remain a rejected fixture',
  )

  const reusedFixture = `
### \`List.get\`：读取元素
\`\`\`java
int first = 1;
System.out.println(first);
// 输出：1
int second = 1;
System.out.println(second);
// 输出：1
\`\`\`
`
  assert.match(
    inspectJavaOutputContract(getJavaBlocks(reusedFixture)[0]).join('\n'),
    /reuses the comment/u,
    'two println calls must not reuse one output description',
  )

  const missingOutputFixture = `
### \`List.size\`：读取元素数
\`\`\`java
int size = 2;
System.out.println(size);
// 作用：size 已经计算完成
\`\`\`
`
  assert.match(
    inspectJavaOutputContract(getJavaBlocks(missingOutputFixture)[0]).join('\n'),
    /not followed/u,
    'a println without an adjacent output comment must remain a rejected fixture',
  )

  const missingActionFixture = `
### \`List.add\`：追加元素
\`\`\`java
List<String> names = new ArrayList<>(List.of("Alice"));
// 初始状态：names 包含 "Alice"
names.add("Bob");
// 输出：[Alice, Bob]
\`\`\`
`
  assert.match(
    inspectApiExampleComments(missingActionFixture).join('\n'),
    /must explain the API call or state change/u,
    'a key call without a concrete adjacent action must remain a rejected fixture',
  )

  const templateFixture = '// 作用：foo(具体参数)；后续代码继续使用该值。\n// // 输出：1'
  assert.match(templateFixture, JAVA_COMMENT_CONTRACT_FORBIDDEN, 'generic and recursive comments must remain bad fixtures')
  const genericTailFixture = '// 作用：LockSupport.park();；返回调用结果。'
  assert.match(
    genericTailFixture,
    JAVA_COMMENT_CONTRACT_FORBIDDEN,
    'generic return-result tails must remain a locked bad fixture',
  )

  const violations = []
  for (const relativePath of COMMENT_CONTRACT_PATHS) {
    const { body } = readMarkdown(relativePath)
    for (const code of getJavaBlocks(body)) {
      for (const issue of inspectJavaOutputContract(code)) violations.push(`${relativePath} ${issue}`)
      for (const [lineNumber, line] of code.split(/\r?\n/u).entries()) {
        if (JAVA_COMMENT_CONTRACT_FORBIDDEN.test(line)) {
          violations.push(`${relativePath}:java:${lineNumber + 1} contains forbidden comment template`)
        }
      }
    }
  }
  assert.deepEqual(violations, [], `rule java-comment-contract${formatViolations(violations)}`)
})

test('all Java course prose stays free of known generated template filler', () => {
  const badResultFixture = '// 结果：执行后，注册静态资源 URL。'
  const badBranchFixture = '// 结果：import 示例执行到' + '预期分支'
  const badAdjacentFixture = '// 关键变化：本次调用 foo();；接收对象或返回值按该参数产生对应状态。'
  const badConcreteTemplateFixture = '// 关键变化：foo("x");；foo 使用具体参数 "x" 计算并返回结果。'
  assert.ok(
    FORBIDDEN_TEMPLATE_PHRASES.some((phrase) => badResultFixture.includes(phrase)),
    'generic 结果：执行后 comments must remain a locked bad fixture',
  )
  assert.ok(
    FORBIDDEN_TEMPLATE_PHRASES.some((phrase) => badBranchFixture.includes(phrase)),
    'generic expected-branch comments must remain a locked bad fixture',
  )
  assert.match(
    badAdjacentFixture,
    FORBIDDEN_EXAMPLE_COMMENT_PATTERN,
    'generic adjacent API comments must remain a locked bad fixture',
  )
  assert.match(
    badConcreteTemplateFixture,
    FORBIDDEN_EXAMPLE_COMMENT_PATTERN,
    'concrete-looking but still templated adjacent API comments must remain a locked bad fixture',
  )

  const violations = []
  for (const relativePath of ARTICLE_PATHS) {
    const { body } = readMarkdown(relativePath)
    for (const phrase of FORBIDDEN_TEMPLATE_PHRASES) {
      if (body.includes(phrase)) violations.push(`${relativePath} [template-filler:${phrase}]`)
    }
    if (FORBIDDEN_EXAMPLE_COMMENT_PATTERN.test(body)) {
      violations.push(`${relativePath} [template-filler:generic-example-comment]`)
    }
  }
  assert.deepEqual(violations, [], `rule java-template-filler${formatViolations(violations)}`)
})

test('RuoYi common external calls remain directly searchable in API H3 headings', () => {
  const violations = []
  let requiredCount = 0

  for (const [relativePath, requiredApis] of Object.entries(REQUIRED_EXTERNAL_API_HEADINGS)) {
    const { body } = readMarkdown(relativePath)
    const headingTokens = getExternalApiHeadingTokens(body)
    requiredCount += requiredApis.length

    for (const api of requiredApis) {
      if (!headingTokens.has(api)) {
        violations.push(`${relativePath} [external-api-heading:${api}] heading is missing`)
      }
    }
  }

  assert.equal(requiredCount, 152, 'rule java-external-api-heading-count: audit snapshot changed')
  assert.deepEqual(violations, [], `rule java-external-api-headings${formatViolations(violations)}`)
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
