import { existsSync } from 'node:fs';
import type { DefaultTheme } from 'vitepress';

export interface JavaCourseArticle {
  readonly file: string;
  readonly title: string;
  readonly route: string;
  /** Legacy source kept visible until its canonical file is available. */
  readonly legacyFile?: string;
  readonly legacyRoute?: string;
  readonly legacyTitle?: string;
  readonly legacyFallbackPriority?: number;
}

export interface JavaCourseChapter {
  readonly id: string;
  readonly title: string;
  readonly articles: readonly JavaCourseArticle[];
}

type ArticleDefinition = readonly [
  fileName: string,
  title: string,
  legacyFile?: string,
  legacyTitle?: string,
  legacyFallbackPriority?: number,
];

const LEGACY_CHAPTER_IDS: Readonly<Record<string, string>> = {
  '12-工程实践': '11-工程实践',
  '13-设计与项目': '12-设计与项目',
  '14-后端工程': '13-后端工程',
};

function routeFromFile(file: string): string {
  return `/${file.replace(/^docs\//u, '').replace(/\.md$/u, '')}`;
}

function createArticle(
  chapterId: string,
  [fileName, title, explicitLegacyFile, legacyTitle, legacyFallbackPriority]: ArticleDefinition,
): JavaCourseArticle {
  const file = `docs/courses/java/${chapterId}/${fileName}`;
  const legacyChapterId = LEGACY_CHAPTER_IDS[chapterId];
  const legacyFile =
    explicitLegacyFile ??
    (legacyChapterId ? `docs/courses/java/${legacyChapterId}/${fileName}` : undefined);

  return {
    file,
    title,
    route: routeFromFile(file),
    ...(legacyFile
      ? {
          legacyFile,
          legacyRoute: routeFromFile(legacyFile),
          legacyTitle,
          legacyFallbackPriority,
        }
      : {}),
  };
}

function createChapter(
  id: string,
  title: string,
  articleDefinitions: readonly ArticleDefinition[],
): JavaCourseChapter {
  return {
    id,
    title,
    articles: articleDefinitions.map((article) => createArticle(id, article)),
  };
}

const article = (
  fileName: string,
  title: string,
  legacyFile?: string,
  legacyTitle?: string,
  legacyFallbackPriority?: number,
): ArticleDefinition => [fileName, title, legacyFile, legacyTitle, legacyFallbackPriority];

/**
 * The sole source of order for the Java learning route.
 *
 * Entries for chapters that are being written in later tasks intentionally live
 * here from the beginning. The sidebar uses a canonical file first and a
 * deterministic legacy fallback only while that canonical file is absent, so
 * migration can happen incrementally without dropping existing navigation.
 */
export const JAVA_COURSE_CHAPTERS: readonly JavaCourseChapter[] = [
  createChapter('01-Java基础', 'Java基础', [
    article('01-开发环境与第一个程序.md', '开发环境与第一个 Java 程序'),
    article('02-基础语法与程序结构.md', '基础语法与程序结构'),
    article('03-数据类型与运算符.md', '数据类型与变量'),
    article('04-控制流与方法.md', '条件判断与循环'),
    article('05-类型转换与数值精度.md', '类型转换与数值精度'),
    article('06-运算符与表达式.md', '运算符与表达式'),
    article('07-方法参数重载与递归.md', '方法、参数、重载与递归'),
  ]),
  createChapter('02-数组与文本', '数组与文本', [
    article('01-数组与多维数组.md', '数组与多维数组'),
    article('02-String与文本处理.md', 'String 与文本处理'),
    article('03-常用类与包装类型.md', '常用类与包装类型'),
    article('04-正则表达式与文本匹配.md', '正则表达式与文本匹配'),
    article('05-JSON与Java对象转换.md', 'JSON 与 Java 对象转换'),
    article('06-大数与精确计算.md', '大数与精确计算'),
  ]),
  createChapter('03-面向对象', '面向对象', [
    article('01-类与对象.md', '类与对象'),
    article('02-封装继承与多态.md', '封装、继承与多态'),
    article('03-接口与抽象类.md', '接口与抽象类'),
    article('04-内部类枚举基础.md', '内部类与枚举基础'),
    article('05-构造器与初始化顺序.md', '构造器与初始化顺序'),
    article('06-Object方法与对象相等.md', 'Object 方法与对象相等'),
    article('07-static-final与代码组织.md', 'static、final 与代码组织'),
  ]),
  createChapter('04-现代Java类型', '现代Java类型', [
    article('01-枚举record与sealed.md', '枚举、record 与 sealed 总览'),
    article('02-异常体系与资源管理.md', '异常体系与资源管理总览'),
    article('03-record数据载体.md', 'record 数据载体'),
    article('04-sealed受限继承.md', 'sealed 受限继承'),
    article('05-异常处理常用写法.md', '异常处理常用写法'),
    article('06-自定义异常与异常转换.md', '自定义异常与异常转换'),
  ]),
  createChapter('05-泛型与集合', '泛型与集合', [
    article('01-泛型与类型安全.md', '泛型与类型安全'),
    article('02-集合框架与数据结构.md', '集合框架与数据结构总览'),
    article('03-Map与集合选择.md', 'Map 与集合选择总览'),
    article('04-List常用API.md', 'List 常用 API'),
    article('05-Set去重与集合运算.md', 'Set 去重与集合运算'),
    article('06-Queue与Deque.md', 'Queue 与 Deque'),
    article('07-Map常用API.md', 'Map 常用 API'),
    article('08-集合排序与不可变集合.md', '集合排序与不可变集合'),
  ]),
  createChapter('06-函数式与时间', '函数式与时间', [
    article('01-Lambda与函数式接口.md', 'Lambda 与函数式接口'),
    article('02-Stream流式处理.md', 'Stream 流式处理'),
    article('03-日期时间API.md', '日期时间 API'),
    article('04-Optional常用API.md', 'Optional 常用 API'),
    article('05-Collectors收集器速查.md', 'Collectors 收集器速查'),
    article('06-Stream分组聚合与扁平化.md', 'Stream 分组聚合与扁平化'),
    article('07-日期格式化与解析.md', '日期格式化与解析'),
    article('08-时区Instant与ZonedDateTime.md', '时区、Instant 与 ZonedDateTime'),
  ]),
  createChapter('07-IO与网络', 'IO与网络', [
    article('01-IO与NIO.md', 'I/O 与 NIO 文件处理'),
    article('02-网络编程.md', '网络编程与 HTTP'),
    article('03-Path与Files常用API.md', 'Path 与 Files 常用 API'),
    article('04-字节流字符流与缓冲.md', '字节流、字符流与缓冲'),
    article('05-NIO-Buffer与Channel.md', 'NIO Buffer 与 Channel'),
    article('06-HTTP-Client常用API.md', 'HTTP Client 常用 API'),
    article('07-Socket与网络边界.md', 'Socket 与网络边界'),
  ]),
  createChapter('08-反射与模块', '反射与模块', [
    article('01-反射与注解.md', '反射与注解'),
    article('02-模块化系统.md', '模块化系统'),
    article('03-Class与反射常用API.md', 'Class 与反射常用 API'),
    article('04-注解定义与运行时读取.md', '注解定义与运行时读取'),
    article('05-动态代理与反射边界.md', '动态代理与反射边界'),
    article('06-module-info模块速查.md', 'module-info 模块速查'),
    article('07-ServiceLoader服务发现.md', 'ServiceLoader 服务发现'),
  ]),
  createChapter('09-并发编程', '并发编程', [
    article('01-线程基础与执行器.md', '线程基础与执行器'),
    article('02-并发工具与线程安全.md', '并发工具与线程安全'),
    article('03-JMM与并发内存模型.md', 'JMM 与并发内存模型'),
    article('04-虚拟线程.md', '虚拟线程'),
    article('05-synchronized互斥锁.md', 'synchronized 互斥锁'),
    article('06-ReentrantLock与Condition.md', 'ReentrantLock 与 Condition'),
    article('07-volatile原子类与可见性.md', 'volatile、原子类与可见性'),
    article('08-线程池Callable与Future.md', '线程池、Callable 与 Future'),
    article('09-CompletableFuture异步编排.md', 'CompletableFuture 异步编排'),
    article('10-并发集合与阻塞队列.md', '并发集合与阻塞队列'),
    article('11-CountDownLatch-Semaphore与CyclicBarrier.md', 'CountDownLatch、Semaphore 与 CyclicBarrier'),
    article('12-死锁定位与避免.md', '死锁定位与避免'),
    article('13-ReadWriteLock读写锁.md', 'ReadWriteLock 读写锁'),
    article('14-StampedLock乐观读.md', 'StampedLock 乐观读'),
    article('15-LockSupport与锁选择.md', 'LockSupport 与锁选择'),
  ]),
  createChapter('10-JVM', 'JVM', [
    article('01-JVM内存与类加载.md', 'JVM 内存与类加载'),
    article('02-垃圾回收与调优.md', '垃圾回收与 JVM 调优'),
    article('03-类加载初始化与类加载器.md', '类加载、初始化与类加载器'),
    article('04-JVM诊断命令与JFR.md', 'JVM 诊断命令与 JFR'),
    article('05-GC日志与问题定位.md', 'GC 日志与问题定位'),
  ]),
  createChapter('11-MySQL-8', 'MySQL 8', [
    article(
      '01-环境连接与数据库对象.md',
      '环境连接与数据库对象',
      'docs/courses/java/13-后端工程/13-MySQL-8.0.md',
      'MySQL 8.0',
    ),
    article('02-表设计与DDL.md', '表设计与 DDL'),
    article('03-数据类型字符集与时区.md', '数据类型、字符集与时区'),
    article('04-数据写入更新与删除.md', '数据写入、更新与删除'),
    article('05-查询过滤排序与分页.md', '查询、过滤、排序与分页'),
    article('06-连接子查询与集合查询.md', '连接、子查询与集合查询'),
    article('07-聚合CTE窗口函数与JSON.md', '聚合、CTE、窗口函数与 JSON'),
    article('08-约束与索引设计.md', '约束与索引设计'),
    article('09-事务MVCC隔离级别与锁.md', '事务、MVCC、隔离级别与锁'),
    article('10-EXPLAIN慢SQL与性能优化.md', 'EXPLAIN、慢 SQL 与性能优化'),
    article('11-用户权限备份与恢复.md', '用户、权限、备份与恢复'),
    article('12-Java-JDBC与MyBatis衔接.md', 'Java、JDBC 与 MyBatis 衔接'),
  ]),
  createChapter('12-工程实践', '工程实践', [
    article('01-Maven与测试工程.md', 'Maven、JUnit 与日志工程'),
    article('02-JDBC与事务.md', 'JDBC 与事务'),
    article('03-Flyway数据库迁移.md', 'Flyway 数据库迁移'),
    article('04-Velocity代码生成.md', 'Velocity 代码生成'),
    article('05-HikariCP与多数据源.md', 'HikariCP 与多数据源'),
  ]),
  createChapter('13-设计与项目', '设计与项目', [
    article('01-设计原则模式与综合复习.md', '设计原则、常见模式与综合复习'),
  ]),
  createChapter('14-后端工程', '后端工程', [
    article('01-Spring-Boot启动与配置.md', 'Spring Boot 启动与配置'),
    article('02-Spring-IoC与Bean生命周期.md', 'Spring IoC 与 Bean 生命周期'),
    article('03-Spring-AOP与声明式事务.md', 'Spring AOP 与声明式事务'),
    article('04-Spring-MVC与Servlet边界.md', 'Spring MVC 与 Servlet 边界'),
    article('05-Spring-Security与JWT.md', 'Spring Security 与 JWT'),
    article('06-MyBatis核心与MyBatis-Plus重点.md', 'MyBatis 核心与 MyBatis-Plus 重点'),
    article('07-Jackson与Fastjson2-JSON.md', 'Jackson 与 Fastjson2 JSON'),
    article('08-Bean-Validation参数校验.md', 'Bean Validation 参数校验'),
    article('09-SLF4J与Logback日志.md', 'SLF4J 与 Logback 日志'),
    article('10-文件上传下载与资源安全.md', '文件上传下载与资源安全'),
    article('11-Apache-POI-Excel导入导出.md', 'Apache POI Excel 导入导出'),
    article('12-Quartz定时任务.md', 'Quartz 定时任务'),
    article(
      '13-OpenAPI与统一错误契约.md',
      'OpenAPI 与统一错误契约',
      'docs/courses/java/13-后端工程/13-MySQL-8.0.md',
      'MySQL 8.0',
      100,
    ),
    article(
      '14-JUnit5-Mockito与MockMvc.md',
      'JUnit 5、Mockito 与 MockMvc',
      'docs/courses/java/13-后端工程/14-Redis.md',
      'Redis',
      100,
    ),
    article('15-Testcontainers集成测试.md', 'Testcontainers 集成测试'),
    article('16-MyBatis生产边界.md', 'MyBatis 生产边界'),
    article('17-RestClient-WebClient与HTTP韧性.md', 'RestClient、WebClient 与 HTTP 韧性'),
    article('18-Actuator-Micrometer与可观测性.md', 'Actuator、Micrometer 与可观测性'),
    article('19-Spring-Cache-Caffeine与Redisson.md', 'Spring Cache、Caffeine 与 Redisson'),
  ]),
  createChapter('15-Redis', 'Redis', [
    article(
      '01-基础连接与数据模型.md',
      '基础连接与数据模型',
      'docs/courses/java/13-后端工程/14-Redis.md',
      'Redis',
    ),
    article('02-String与计数器.md', 'String 与计数器'),
    article('03-Hash与对象字段.md', 'Hash 与对象字段'),
    article('04-List-Set与Sorted-Set.md', 'List、Set 与 Sorted Set'),
    article('05-Bitmap-HyperLogLog-GEO与Stream.md', 'Bitmap、HyperLogLog、GEO 与 Stream'),
    article('06-Key过期扫描与删除.md', 'Key 过期、扫描与删除'),
    article('07-事务Watch-Pipeline与Lua.md', '事务、Watch、Pipeline 与 Lua'),
    article('08-持久化内存淘汰与数据安全.md', '持久化、内存淘汰与数据安全'),
    article('09-缓存穿透击穿雪崩与一致性.md', '缓存穿透、击穿、雪崩与一致性'),
    article('10-发布订阅与Stream消费组.md', '发布订阅与 Stream 消费组'),
    article('11-分布式锁租约与Fencing-Token.md', '分布式锁、租约与 Fencing Token'),
    article('12-Spring-Cache与缓存抽象.md', 'Spring Cache 与缓存抽象'),
    article('13-RedisTemplate序列化与连接管理.md', 'RedisTemplate 序列化与连接管理'),
    article('14-主从哨兵与Cluster.md', '主从、哨兵与 Cluster'),
    article('15-性能诊断监控与生产清单.md', '性能诊断、监控与生产清单'),
  ]),
];

function addOrderNumber(groups: DefaultTheme.SidebarItem[]): void {
  for (const group of groups) {
    for (const [index, item] of (group.items ?? []).entries()) {
      const number = index + 1;
      let color = 'text-color-gray';
      if (number === 1) color = 'text-color-red';
      if (number === 2) color = 'text-color-orange';
      if (number === 3) color = 'text-color-yellow';
      item.text = `<span class="${color} mr-[6px]" style="font-weight: 550; display: inline-block;">${number}</span>${item.text}`;
    }
  }
}

export interface JavaCourseSidebarOptions {
  /** Injectable for tests and migration fixtures; defaults to the real file system. */
  readonly fileExists?: (file: string) => boolean;
}

interface ResolvedArticle {
  readonly title: string;
  readonly route: string;
}

function compareFallbackPriority(left: JavaCourseArticle, right: JavaCourseArticle): number {
  return (left.legacyFallbackPriority ?? 0) - (right.legacyFallbackPriority ?? 0);
}

function resolveAvailableArticles(
  chapters: readonly JavaCourseChapter[],
  fileExists: (file: string) => boolean,
): Map<string, ResolvedArticle> {
  const articles = chapters.flatMap((chapter) => chapter.articles);
  const canonicalFiles = new Set(
    articles.filter((article) => fileExists(article.file)).map((article) => article.file),
  );
  const legacyFilesClaimedByCanonical = new Set(
    articles
      .filter((article) => canonicalFiles.has(article.file) && article.legacyFile)
      .map((article) => article.legacyFile as string),
  );
  const fallbackWinners = new Map<string, JavaCourseArticle>();

  for (const article of articles) {
    if (
      canonicalFiles.has(article.file) ||
      !article.legacyFile ||
      legacyFilesClaimedByCanonical.has(article.legacyFile) ||
      !fileExists(article.legacyFile)
    ) {
      continue;
    }

    const currentWinner = fallbackWinners.get(article.legacyFile);
    if (!currentWinner || compareFallbackPriority(article, currentWinner) > 0) {
      fallbackWinners.set(article.legacyFile, article);
    }
  }

  const resolved = new Map<string, ResolvedArticle>();
  const usedRoutes = new Set<string>();
  for (const article of articles) {
    let candidate: ResolvedArticle | undefined;
    if (canonicalFiles.has(article.file)) {
      candidate = { title: article.title, route: article.route };
    } else if (article.legacyFile && fallbackWinners.get(article.legacyFile) === article) {
      candidate = {
        title: article.legacyTitle ?? article.title,
        route: article.legacyRoute ?? routeFromFile(article.legacyFile),
      };
    }

    if (candidate && !usedRoutes.has(candidate.route)) {
      usedRoutes.add(candidate.route);
      resolved.set(article.route, candidate);
    }
  }
  return resolved;
}

/**
 * Build the Java sidebar in manifest order.
 *
 * The optional argument is useful for callers that provide a selected copy of
 * the manifest. Its values are treated as a set of chapter IDs; the canonical
 * manifest still supplies both ordering and article metadata, so shuffling the
 * copy cannot change navigation order. A legacy file may temporarily stand in
 * for an absent canonical file, with canonical files always taking precedence.
 */
export function getJavaCourseItems(
  selectedChapters: readonly JavaCourseChapter[] = JAVA_COURSE_CHAPTERS,
  options: JavaCourseSidebarOptions = {},
): DefaultTheme.SidebarItem[] {
  const selectedIds = new Set(selectedChapters.map((chapter) => chapter.id));
  const chapters = JAVA_COURSE_CHAPTERS.filter((chapter) => selectedIds.has(chapter.id));
  const resolve = resolveAvailableArticles(chapters, options.fileExists ?? existsSync);
  let total = 0;

  const groups = chapters.map((chapter) => {
    const items = chapter.articles
      .map((article) => resolve.get(article.route))
      .filter((article): article is ResolvedArticle => Boolean(article))
      .map(({ title, route }) => ({ text: title, link: route }));
    total += items.length;

    return {
      text: `${chapter.title} (${items.length}篇)`,
      items,
      collapsed: items.length < 2 || total > 20,
    } satisfies DefaultTheme.SidebarItem;
  });

  addOrderNumber(groups);
  return groups;
}
