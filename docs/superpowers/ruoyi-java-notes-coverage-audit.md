# Java 后端笔记覆盖审计报告

## 审计范围与方法

审计对象：

- 源码：`C:\MyProject\JAVA\learn_ruoyi\RuoYi-Vue`
- 通用笔记：`C:\MyProject\clintsfy.github.io\docs\courses\java`
- 本报告：`docs/superpowers/ruoyi-java-notes-coverage-audit.md`

方法是先读取全部 `pom.xml`，再用 `rg` 扫描 Java 的 import、注解和代表性方法调用，最后按标题和正文搜索笔记。统计是静态文本证据，不替代编译期类型解析；项目内部 `com.ruoyi.*` 工具类只作为项目导读范围，不作为通用笔记正文要求。

### 源码侧统计

| 项目 | 数量/结果 |
|---|---:|
| `pom.xml` | 7 |
| Java 文件 | 266 |
| Java 源码行 | 34,327 |
| import 行 | 2,120 |
| 不重复 import | 601 |
| 注解行 | 1,182 |
| 不重复注解名 | 67 |
| XML 文件 | 29 |
| mapper XML | 20 |
| SQL 文件 | 2 |
| pom 中 artifactId 标签 | 72（不重复 40） |

Java 文件按模块：`ruoyi-common` 110、`ruoyi-system` 56、`ruoyi-framework` 45、`ruoyi-admin` 24、`ruoyi-quartz` 18、`ruoyi-generator` 13。

重点 import 家族：`java.*` 469、`org.springframework.*` 452、`com.ruoyi.*` 784、`jakarta.*` 120、`org.apache.commons.*` 56、`org.slf4j.*` 46、`org.apache.poi.*` 46、`com.alibaba.fastjson2.*` 18、`tools.jackson.*` 8、`com.fasterxml.jackson.*` 13、`io.jsonwebtoken.*` 4、`org.quartz.*` 22。根 `pom.xml:17-22` 表明 Java 17、Spring Boot 4.1.0、MyBatis Spring Boot 4.1.0；`ruoyi-common/pom.xml:34-118` 集中了 Security、Validation、JSON、POI、JWT、Redis、Servlet 等依赖。

代表性注解计数：`@Override` 270、`@PreAuthorize` 116、`@Autowired` 104、`@Excel` 80、`@Log` 74、`@GetMapping` 63、`@Transactional` 25、`@RestController` 24、`@Bean` 22、`@RequestMapping` 21、`@Service` 19、`@Aspect` 4、`@DisallowConcurrentExecution` 1、`@EnableCaching` 1。

代表性点号调用频次（启发式统计）：`append` 273、`put` 144、`hasPermi` 115、`equals` 108、`isEmpty` 97、`toString` 96、`add` 89、`get` 85、`error` 81、`isNotEmpty` 64、`contains` 59、`length` 57、`format` 52、`split` 50、`compile` 46、`substring` 43。`hasPermi` 属于项目授权表达式，内部工具/业务方法不纳入通用正文；其余基础调用优先交叉链接现有 JDK 章节。

### 笔记侧现状

共有 80 篇 Markdown、约 643,351 字符。现有覆盖集中在 JDK 基础、集合、String、IO/NIO、反射、并发、JVM、Maven/JUnit、通用日志、JDBC 与事务、Hutool JSON。搜索到的后端框架结果只有：

- `index.md:41` 将 Spring Boot/Web、MyBatis/JPA 列为后续路线，并非可查用法正文。
- `11-工程实践/01-Maven与测试工程.md:19,23,40` 有通用 SLF4J/日志原则，但没有 Logback 配置或 AOP 请求日志。
- `11-工程实践/02-JDBC与事务.md:17-23,38-40` 有 JDBC 事务边界、隔离级别和资源管理，但没有 Spring `@Transactional`。
- `02-数组与文本/05-JSON与Java对象转换.md:13-20,46-60` 是 Hutool `JSONUtil`；没有 Jackson、Fastjson2 或 Spring MVC JSON 消息转换。
- `07-IO与网络/03-Path与Files常用API.md`、`07-IO与网络/06-HTTP-Client常用API.md:224,328` 覆盖 JDK 文件 API 和 HTTP 文件体，但没有 `MultipartFile` 控制器上传/下载边界。

## 1. 现有覆盖结论

结论不是“全部覆盖”，而是“JDK 基础强覆盖，后端框架与组件覆盖严重不足”。

| 层次 | 当前结论 |
|---|---|
| JDK 基础 | 高覆盖。List/Map/String、IO/NIO、反射、并发、日期等已有成体系文章；按约束交叉链接，不重复造基础章节。 |
| JSON | 部分覆盖。已有 Hutool JSONUtil 教程，但源码实际使用 Fastjson2、Jackson 注解和 `tools.jackson` 序列化器。 |
| JDBC/事务 | 部分覆盖。已有原生 JDBC 事务；源码另有 Spring 声明式事务，尚未覆盖。 |
| 日志 | 部分覆盖。已有 SLF4J 原则；源码还有 Logback rolling appender、`@Log` 与 LogAspect。 |
| 文件 | 部分覆盖。已有 Path/Files 与 HTTP 文件体；源码的 `MultipartFile`、安全下载和响应头未覆盖。 |
| Spring Boot、IoC、AOP、MVC、Security | 缺口。笔记只有路线提及，没有 API 用法文章。 |
| MyBatis | 缺口。源码大量使用原生 MyBatis XML，笔记没有 mapper、动态 SQL、参数绑定文章。 |
| MyBatis-Plus | 当前源码没有依赖、import 或调用；笔记也没有。按用户要求作为后续重点章节，保留原生 MyBatis 对照。 |
| Validation、Servlet、Excel、JWT、Quartz、MySQL 8.0、Redis | 缺口。笔记没有对应标题/正文用法。 |

## 2. 缺口矩阵：源码证据与笔记证据

状态含义：`覆盖` 表示可直接查用法；`部分` 表示只有邻近概念或其他库；`缺口` 表示没有通用正文；`计划` 表示当前源码没有调用但用户明确要求补齐。

| 领域 | 源码依赖/调用证据（代表性文件与行） | 笔记证据 | 状态与缺口 |
|---|---|---|---|
| JDK 基础 | `ruoyi-system/src/main/java/com/ruoyi/system/service/ISysUserService.java:3-5` 的 `Date`/`List`；`ruoyi-common/src/main/java/com/ruoyi/common/utils/StringUtils.java:3-9` 的 List/Map/Set/String；全项目 `java.*` import 469 条 | `05-泛型与集合/04-List常用API.md`、`05-泛型与集合/07-Map常用API.md`、`02-数组与文本/02-String与文本处理.md`、`07-IO与网络/03-Path与Files常用API.md`、`08-反射与模块/03-Class与反射常用API.md`、`09-并发编程/01-线程基础与执行器.md` | 覆盖；只补交叉链接和项目导读，不新增重复基础章。 |
| Spring Boot / IoC | `ruoyi-admin/src/main/java/com/ruoyi/RuoYiApplication.java:12` `@SpringBootApplication`；`ruoyi-framework/src/main/java/com/ruoyi/framework/config/ApplicationConfig.java:12-16` `@Configuration`/`@MapperScan`；`ruoyi-system/src/main/java/com/ruoyi/system/service/impl/SysDeptServiceImpl.java:29-35` `@Service`/`@Autowired`；`ruoyi-common/pom.xml:22-29` Spring 核心依赖 | 只有 `index.md:41` 路线提及；无 Spring Boot/Bean/配置注入标题 | 缺口。需要启动、组件扫描、Bean 生命周期、配置属性、条件装配和测试切片。 |
| Spring AOP | `ruoyi-framework/src/main/java/com/ruoyi/framework/aspectj/RateLimiterAspect.java:27,49`；`LogAspect.java:41,59,82`；`DataSourceAspect.java:23,30,37`；`ApplicationConfig.java:14` `@EnableAspectJAutoProxy` | `rg` 对 80 篇笔记无 AOP 结果 | 缺口。需要切点、代理、`@Before`/`@Around`、异常与自调用边界。 |
| Spring MVC | `ruoyi-admin/src/main/java/com/ruoyi/web/controller/tool/TestController.java:28-39` 的 `@RestController`/`@RequestMapping`/`@GetMapping`；`CommonController.java:28-75` 的控制器与文件接口 | 无 MVC 标题或正文 | 缺口。需要路由、参数绑定、响应体、异常处理、拦截器和消息转换。 |
| Spring 事务 | `ruoyi-system/src/main/java/com/ruoyi/system/service/impl/SysUserServiceImpl.java:261,292,314,459,476`；`ruoyi-generator/src/main/java/com/ruoyi/generator/service/GenTableServiceImpl.java:125,147,172,294` 的 `@Transactional` | `11-工程实践/02-JDBC与事务.md:17-23` 只有原生 Connection 事务 | 部分。需要事务代理、传播、隔离、回滚规则、只读和自调用陷阱。 |
| Spring Security | `ruoyi-common/pom.xml:34-36`；`ruoyi-framework/src/main/java/com/ruoyi/framework/config/SecurityConfig.java:27,86-116,123-126`；`JwtAuthenticationTokenFilter.java:25-40`；控制器 `@PreAuthorize` 116 次 | 无 Security 标题/正文 | 缺口。需要过滤器链、认证/授权、密码编码、方法安全、无状态会话和 401/403。 |
| 原生 MyBatis | 根 `pom.xml:70-74`；`ruoyi-framework/src/main/java/com/ruoyi/framework/config/ApplicationConfig.java:16` `@MapperScan`；`MyBatisConfig.java:117-126`；`ruoyi-system/src/main/resources/mapper/system/SysUserMapper.xml:5,60,146,180,216` 的 mapper、动态 SQL、CRUD | `index.md:41` 仅提到 MyBatis/JPA 路线 | 缺口。需要 XML mapper、`#{}` 参数、动态 SQL、结果映射、分页、批量和事务衔接。 |
| MyBatis-Plus | 全源码无 `mybatis-plus`、`BaseMapper`、`IService`、`QueryWrapper`、`selectById` 等 token；POM 无 MP artifact | `rg` 无 MyBatis-Plus 结果 | 计划。当前不是源码调用；后续文章重点讲 MP CRUD/Wrapper/分页，同时保留原生 XML 对照与何时不用 MP。 |
| Jackson / JSON | `ruoyi-common/pom.xml:58-65` 有 Jackson Databind 与 Fastjson2；`ruoyi-framework/src/main/java/com/ruoyi/framework/config/FastJson2JsonRedisSerializer.java:6-9,38,50`；`ruoyi-common/src/main/java/com/ruoyi/common/core/domain/BaseEntity.java:7-9,28-42`；`ruoyi-common/src/main/java/com/ruoyi/common/config/serializer/SensitiveJsonSerializer.java:4-21` 使用 `tools.jackson` | `02-数组与文本/05-JSON与Java对象转换.md:13-20,48-60` 只讲 Hutool JSONUtil | 部分。需要 Jackson 3 风格 API/注解、Fastjson2 序列化、日期/敏感字段、Redis 序列化和 Web JSON 边界。 |
| Bean Validation | `ruoyi-common/pom.xml:46-48`；`ruoyi-common/src/main/java/com/ruoyi/common/utils/bean/BeanValidators.java:4-21`；`ruoyi-common/src/main/java/com/ruoyi/common/xss/XssValidator.java:4-19`；`ruoyi-admin/src/main/java/com/ruoyi/web/controller/system/SysUserController.java:125,152` `@Validated`；`ruoyi-generator/src/main/java/com/ruoyi/generator/domain/GenTable.java:24-83` 的 `@NotBlank`/`@Valid` | `04-现代Java类型/05-异常处理常用写法.md:235` 只有自定义 ArgumentValidationDemo，无 Jakarta Bean Validation | 缺口。需要约束、级联、分组、方法参数、错误响应和自定义 `ConstraintValidator`。 |
| Servlet | `ruoyi-common/pom.xml:118-120`；`ruoyi-framework/src/main/java/com/ruoyi/framework/security/filter/JwtAuthenticationTokenFilter.java:4-7,31`；`ruoyi-admin/src/main/java/com/ruoyi/web/controller/common/CommonController.java:46,75`；`XssFilter.java`/`RepeatSubmitInterceptor.java` 使用 Filter/Interceptor | 无 Servlet 标题或正文 | 缺口。需要 request/response、FilterChain、Servlet 生命周期、异步/编码和 Spring MVC 边界。 |
| 日志 | `ruoyi-framework/.../LogAspect.java:43-45,133,214` 使用 SLF4J；`ruoyi-admin/src/main/resources/logback.xml:9-77` 有 console/rolling appender；`@Log` 74 次 | `11-工程实践/01-Maven与测试工程.md:19,23,40` 有 SLF4J 原则 | 部分。需要 LoggerFactory、参数化日志、Logback 配置、滚动、脱敏、MDC/请求 ID和 AOP 操作日志。 |
| 文件上传/下载 | `ruoyi-common/src/main/java/com/ruoyi/common/utils/file/FileUploadUtils.java:8,58-137,186-251` 使用 `MultipartFile`、扩展名/大小校验、`transferTo`；`FileUtils.java:39-104,224-226`；`ruoyi-admin/src/main/java/com/ruoyi/web/controller/common/CommonController.java:45-155` 上传、下载、路径安全和响应头 | `07-IO与网络/03-Path与Files常用API.md` 覆盖本地文件；`07-IO与网络/06-HTTP-Client常用API.md:224,328` 覆盖 HTTP 文件体 | 部分。需要 multipart 绑定、白名单、路径穿越、临时文件、下载响应头和流式输出。 |
| Excel | `ruoyi-common/pom.xml:77-79` `poi-ooxml`；`ruoyi-common/src/main/java/com/ruoyi/common/utils/poi/ExcelUtil.java:318-357` 导入、`539-600`/`754-776` 导出；`ruoyi-admin/src/main/java/com/ruoyi/web/controller/system/SysUserController.java:70-84`；`@Excel` 80 次 | 无 Excel 标题/正文 | 缺口。需要 POI Workbook、注解映射、流式导出、导入校验、日期/公式/大文件资源释放。 |
| JWT | 根 `pom.xml:126-128`、`ruoyi-common/pom.xml:82-84`；`ruoyi-framework/src/main/java/com/ruoyi/framework/web/service/TokenService.java:115-125,179-197` `Jwts.builder`/`parseClaimsJws`；过滤器读取请求 token | 无 JWT 标题/正文 | 缺口。需要 claims、签名、过期、Bearer 头、刷新/吊销、安全密钥和过滤器链。 |
| Quartz 定时任务 | `ruoyi-quartz/pom.xml:22-24`；`ruoyi-quartz/src/main/java/com/ruoyi/quartz/util/ScheduleUtils.java:60-90` `JobBuilder`/`CronScheduleBuilder`/`scheduler.scheduleJob`；`CronUtils.java:23-55`；`QuartzDisallowConcurrentExecution.java:13` | 无 Quartz/定时任务标题或正文；现有“ScheduledExecutorService”仅为 JDK 并发文章 | 缺口。需要 Job/Trigger/Cron、misfire、持久化表、并发控制、暂停恢复和失败重试。 |
| MySQL 8.0 | `ruoyi-admin/pom.xml:33-37` `mysql-connector-j`；`ruoyi-admin/src/main/resources/application-druid.yml:5,9` MySQL 驱动/连接；`sql/ry_20260417.sql:5-21,42-64` InnoDB、`auto_increment`、`datetime`；mapper 中 `sysdate()` | 无 MySQL 标题或正文；JDBC 文章不绑定 MySQL 版本 | 部分（只有 JDBC 邻近知识）。需要单独 MySQL 8.0 章：类型、索引、事务/锁、字符集、时间、窗口/CTE、执行计划、JDBC 注意事项。 |
| Redis | `ruoyi-common/pom.xml:92-106`；`ruoyi-framework/src/main/java/com/ruoyi/framework/config/RedisConfig.java:19,24-36`；`ruoyi-common/src/main/java/com/ruoyi/common/core/redis/RedisCache.java:35-50,106,142,195-256` 覆盖 value/list/set/hash；`RateLimiterAspect.java:59` Lua `RedisTemplate.execute`；`CacheController.java:53-110` 监控与删除 | 无 Redis 标题或正文 | 缺口。需要 key/TTL、String/Hash/List/Set、序列化、Lua、缓存一致性、穿透/击穿/雪崩和并发边界。 |

## 3. 建议的通用章节树与文章标题

新增后端内容放在现有 Java 笔记末尾，建议从 `13-后端工程` 开始；List/Map/String 等基础只做交叉链接。文章标题和示例不带项目专名，内部工具类只在“源码导读”小节提及。

```text
13-后端工程/
├─ 01-Spring-Boot启动与配置.md
├─ 02-Spring-IoC与Bean生命周期.md
├─ 03-Spring-AOP与声明式事务.md
├─ 04-Spring-MVC与Servlet边界.md
├─ 05-Spring-Security与JWT.md
├─ 06-MyBatis核心与MyBatis-Plus重点.md
├─ 07-Jackson与Fastjson2-JSON.md
├─ 08-Bean-Validation参数校验.md
├─ 09-SLF4J与Logback日志.md
├─ 10-文件上传下载与资源安全.md
├─ 11-Apache-POI-Excel导入导出.md
├─ 12-Quartz定时任务.md
├─ 13-MySQL-8.0.md
└─ 14-Redis.md
```

| 文章 | 必须覆盖的可查用法小标题（示例） |
|---|---|
| Spring Boot 启动与配置 | `@SpringBootApplication`、`application.yml`、`@ConfigurationProperties`、条件装配、启动失败定位 |
| Spring IoC 与 Bean 生命周期 | `@Component`/`@Service`、`@Bean`、构造器注入、`@PostConstruct`、作用域、代理对象 |
| Spring AOP 与声明式事务 | `@Aspect`/`@Pointcut`、`@Around`、`proceed`、`@Transactional`、传播/回滚、自调用 |
| Spring MVC 与 Servlet 边界 | `@RestController`、`@RequestMapping`、`@RequestBody`、`@Valid`、异常处理、Filter/Interceptor、响应体 |
| Spring Security 与 JWT | `SecurityFilterChain`、`authorizeHttpRequests`、`@PreAuthorize`、BCrypt、Bearer token、claims/过期 |
| MyBatis 核心与 MyBatis-Plus 重点 | XML `<select>`/`<insert>`、`#{}`、动态 `<if>`/`<foreach>`、结果映射；`BaseMapper`、`QueryWrapper`、分页与原生 XML 对照 |
| Jackson 与 Fastjson2 JSON | `ObjectMapper`/Jackson Databind、`@JsonFormat`/`@JsonInclude`、Fastjson2 `toJSONString`/`parseObject`、自定义序列化、Redis 序列化 |
| Bean Validation 参数校验 | `@NotBlank`/`@Size`、`@Valid`/`@Validated`、级联、分组、`ConstraintValidator`、字段错误响应 |
| SLF4J 与 Logback 日志 | `LoggerFactory`、参数化 `info`/`error`、Logback appender/滚动、MDC、脱敏、AOP 操作日志 |
| 文件上传下载与资源安全 | `MultipartFile`、`transferTo`、扩展名/大小白名单、路径规范化、`Content-Disposition`、流式下载 |
| Apache POI Excel 导入导出 | `WorkbookFactory`、`SXSSFWorkbook`、注解列映射、`importExcel`/`exportExcel`、大文件与资源释放 |
| Quartz 定时任务 | `Job`、`JobDetail`、`CronTrigger`、misfire、暂停/恢复、`@DisallowConcurrentExecution`、持久化表 |
| MySQL 8.0 | DDL/类型/字符集、索引与 `EXPLAIN`、事务/锁、CTE/窗口、时间与 JDBC 驱动、分页与批量 |
| Redis | `RedisTemplate.opsForValue`/Hash/List/Set、TTL、序列化、Lua、缓存一致性、限流和故障边界 |

每篇文章的“常用用法”必须统一成可检索单元：明确三级小标题（如 `### RedisTemplate.opsForValue().set：写入带 TTL 的值`）、紧随一句“用途：……”、简短 Java/SQL fenced 示例，并把结果写成独立注释行（Java 为 `// 输出：...`，SQL 为 `-- 输出：...`）。这比只罗列概念更容易被搜索和机器校验。

## 4. 分批实施方案

### 批次 0：目录与交叉链接

先新增 `13-后端工程` 目录规划并补 `index.md` 导航；只链接已有 List/Map/String、IO、反射、并发、Maven、JDBC、JSON 页面，不复制基础 API。为每篇新文档建立统一 front matter、用法小标题和输出注释模板。

### 批次 1：Spring 请求链路

依次完成 Spring Boot 启动/配置、IoC、AOP/事务、MVC/Servlet。以 `RuoYiApplication` → 配置类 → Controller → Service → Mapper 的一条请求链贯穿，事务文章同时对照现有 JDBC 文章。

### 批次 2：持久化与数据基础设施

完成原生 MyBatis 后再完成 MyBatis-Plus 重点文章；明确 MP 不是当前源码依赖。随后独立完成 MySQL 8.0 和 Redis，覆盖源码中的 mapper XML、InnoDB SQL、RedisTemplate 数据结构与 Lua 限流。

### 批次 3：安全与数据边界

完成 Security/JWT、Jackson/Fastjson2、Bean Validation。示例必须分开“解析/校验/授权”职责，避免把 JSON 转换当作校验，把 JWT 解析当作授权。

### 批次 4：工程能力

完成 SLF4J/Logback、文件上传下载、POI Excel、Quartz。每篇至少包含一个成功路径、一个边界/失败路径和一个输出注释；完成后再刷新索引与机器校验结果。

## 5. 机器校验规则

以下规则可在 `docs/courses/java` 执行，不依赖网络或编译：

1. 文件数：`rg --files 13-后端工程 -g '*.md'` 应为 14；每个计划标题必须存在。
2. 标题与用法：每篇至少有 `^# `、`^## `、`^### `；每个可查 API 小节必须有 `用途：`、` ```java` 或 ` ```sql`、以及独立的 `// 输出：` 或 `-- 输出：` 行。
3. 关键词覆盖：分别检查 `SpringBootApplication|Autowired|Bean`、`Aspect|Pointcut|Transactional`、`RestController|RequestBody|Filter`、`SecurityFilterChain|PreAuthorize`、`MapperScan|<select>|BaseMapper`、`ObjectMapper|fastjson|JsonFormat`、`Valid|NotBlank|ConstraintValidator`、`LoggerFactory|logback|MDC`、`MultipartFile|Content-Disposition`、`Workbook|SXSSFWorkbook`、`CronTrigger|JobDetail`、`MySQL 8.0|EXPLAIN`、`RedisTemplate|opsForValue|TTL`。
4. 输出注释：用 `rg -n '^\s*(//|--) 输出：' 13-后端工程` 检查结果注释是否独立成行，不接受把结果写在用途段落或代码行尾。
5. 基础交叉链接：新目录中的 `List`/`Map`/`String` 用法应包含指向现有 `05-泛型与集合` 或 `02-数组与文本` 页面链接，避免重复基础正文。
6. 专名约束：`rg -n '若依' 13-后端工程` 应无结果；项目内部类名只能出现在源码导读/证据，不进入通用文章标题和主示例。
7. 源码回归扫描：重新统计 7 个 POM、266 个 Java、import/注解家族，并确保新增文章没有声称“源码使用 MyBatis-Plus”；当前源码扫描应继续报告无 `mybatis-plus`/`BaseMapper`/`QueryWrapper` token。
8. 变更范围：`git diff -- docs/courses/java` 只能包含新增后端文章和必要的 `index.md` 导航，不应改动既有 80 篇正文；本轮审计报告位于 `docs/superpowers`，不作为课程正文。

## 6. 明确回答

**现在是否所有调用都有？否。**

静态证据表明，现有笔记能覆盖大部分 JDK 基础调用，并对 JSON、JDBC/事务、日志、文件 IO 有邻近内容；但源码真实使用的 Spring Boot/IoC/AOP/MVC、Security、原生 MyBatis、Validation、Servlet、POI、JWT、Quartz、MySQL 8.0、Redis 等没有可查用法正文。MyBatis-Plus 当前没有源码调用，属于按要求新增的重点知识而不是当前缺失调用的补录。

### 尚未解决的问题

- 本审计没有运行 Maven 编译、集成测试或真实数据库/Redis/Quartz；结论是源码文本与笔记文本的覆盖关系。
- 依赖版本显示为 Spring Boot/MyBatis 4.1.0、Jackson 3 风格 `tools.jackson`，后续文章示例需要以本仓库实际版本验证 API。
- 当前没有修改既有课程正文，也没有提交；新增章节实施后需要再次执行本报告的规则 1-8。
