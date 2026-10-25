# Java 后端工程通用速查实施计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 在 `docs/courses/java/13-后端工程` 新增 14 篇可检索的 Java 后端通用速查文章，补齐 Java 根入口导航和机器校验，并通过构建、提交、推送和既有 Vercel 部署完成发布。

**Architecture:** 采用“4 个可独立审查正文批次 + 分批扩展测试清单”的垂直切片：Spring 请求链路、持久化与数据基础设施、安全与数据边界、工程能力。新目录不创建 `index.md`，由现有 `sidebar.ts` 的目录扫描自动生成侧栏；导航集中在 `docs/courses/java/index.md`，旧 01–12 章正文保持不变。

**Tech Stack:** Markdown、VitePress 1.0.0-rc.31、Node.js 22、`node:test`、`fast-glob`、`gray-matter`、pnpm 9.15.9、GitHub/Vercel 现有部署链路。

**Spec:** `docs/superpowers/ruoyi-java-notes-coverage-audit.md`

## Global Constraints

- 新增文件必须是 `docs/courses/java/13-后端工程/` 下恰好 14 篇文章；不创建该目录的 `index.md`，避免自动侧栏把导航页误算成第 15 篇文章。
- 默认不修改既有 80 个 Java Markdown 文件的正文；唯一允许修改的既有课程文件是 `docs/courses/java/index.md` 导航。不得修改 `docs/.vitepress/config/sidebar.ts`、主题、依赖或部署配置。
- 新文章正文不得出现“若依”或 `RuoYi`；覆盖审计中的源码项目仅是缺口样本，不能进入通用文章标题、主示例或叙述。测试对 14 篇正文执行禁用词检查。
- List、Map、String 只引用现有速查页，不复制基础 API 正文；相关链接分别指向 `/courses/java/05-泛型与集合/04-List常用API`、`/courses/java/05-泛型与集合/07-Map常用API`、`/courses/java/02-数组与文本/02-String与文本处理`。
- 数据库文章固定写明 MySQL 8.0；MyBatis 文章以原生 MyBatis XML 为基础、以 MyBatis-Plus 为重点对照，并明确 MyBatis-Plus 是独立知识示例，不能声称覆盖样本当前依赖了它。
- 每篇文章沿用现有结构：front matter、`学习目标`、`核心知识点`（含 `专业术语` 与 `白话解释与边界`）、`常用用法`、`不常用但需要知道`、`简单案例`、`易混点`、`课后小问`、`本节小结`、`快速回顾`。不写 `实践任务`、`练习题`、`面试常问` 或占位内容；`课后小问`至少两题，每题紧跟 `答案：` 与 `解析：`。
- 每个可查用法使用明确的 `###` 小标题，下一段给出一句以 `用途：` 开头的用途/边界说明，随后提供短 fenced Java 或 SQL 示例；可观察结果必须单独成行写 `// 输出：...` 或 `-- 输出：...`，不得把结果藏在代码行尾或用途段落。
- 常用与不常用 API 都必须有可检索的标题、用途和短代码；单个用法代码控制在约 8–25 个非空代码行，完整链路放入 `简单案例`，不把文章写成框架源码教程。
- 示例按 JDK 20 风格组织，但不得使用 JDK 20 之后才出现且未明确说明的 API；Spring Boot、MyBatis Spring Boot、Jackson/Fastjson2、JWT、POI、Quartz 等框架/库 API 以覆盖样本实际依赖兼容性为准。审计记录的关键版本基线为 Java 17、Spring Boot 4.1.0、MyBatis Spring Boot 4.1.0；文章要标出版本差异，不把 JDK 语法示例与框架依赖版本混为一谈。
- 批次提交必须显式 `git add` 文件清单，不使用 `git add .`；当前未跟踪的审计报告 `docs/superpowers/ruoyi-java-notes-coverage-audit.md` 不属于本计划提交范围。
- 最后才执行发布：全量测试、VitePress 构建、`git diff --check`、范围审计通过后提交最后变更、`git push origin main`，再按 `vercel.json` 的自动部署链路检查线上 HTTP 200。

## Review Focus

- 路由、目录计数和旧文章边界：13 个章节、94 个 Markdown、93 篇文章的最终路径集合必须精确，且 01–12 章正文无 diff（Task 1 的 manifest、Task 2–5 的分批路径断言，Task 5 的最终范围审计）。
- 用法可检索性：每个 `常用用法`/`不常用但需要知道` 小节都要有一句用途、短 Java/SQL 代码和独立输出注释；失败时测试报告具体文章、小标题和缺失项（Task 1 的通用检查器，Task 2–5 的分批关键词与输出检查）。
- 基础知识去重与专名边界：List/Map/String 只交叉链接既有页面，后端正文不出现“若依”/`RuoYi`，不把覆盖样本误写成 MyBatis-Plus 的使用证据（Task 1、Task 2、Task 5 的静态断言）。
- 版本与 API 选择：Spring Boot/MyBatis 4.1.0、Jackson 3 风格与 Fastjson2、JJWT 0.9.1、POI 5.5.1 等示例不得照抄不兼容版本；MySQL 章节必须明确 8.0 与 `EXPLAIN`（Task 2–3 的关键词/版本检查和人工审阅）。
- 安全、资源和并发边界：JWT 密钥、参数校验、路径穿越、日志脱敏、Excel/文件流释放、Quartz 并发控制、Redis 原子操作均要同时写成功路径与失败/边界路径（Task 4–5 的边界小节和机器检查）。

## File Map

**Create (14 articles):**

- `docs/courses/java/13-后端工程/01-Spring-Boot启动与配置.md` 至 `04-Spring-MVC与Servlet边界.md`
- `docs/courses/java/13-后端工程/05-Spring-Security与JWT.md` 至 `08-Bean-Validation参数校验.md`
- `docs/courses/java/13-后端工程/09-SLF4J与Logback日志.md` 至 `12-Quartz定时任务.md`
- `docs/courses/java/13-后端工程/13-MySQL-8.0.md`、`14-Redis.md`

**Modify:**

- `docs/courses/java/index.md`：最终补第 13 章入口、14 篇文章的导航链接和“后端工程”学习阶段说明。
- `tests/java-course-content.test.mjs`：保留旧路径基线，分批加入第 13 章路径、标题、用法契约、输出注释、专名/交叉链接、关键 API 和导航断言。

**Do not modify:**

- `docs/courses/java/01-Java基础` 至 `12-设计与项目` 的既有正文（根 `index.md` 除外）、`docs/.vitepress/config/sidebar.ts`、`package.json`、`pnpm-lock.yaml`、`vercel.json`。

---

### Task 1: 批次 0——目录、交叉链接与测试契约

**Files:**

- Modify: `tests/java-course-content.test.mjs`

**Interfaces:**

- Consumes: 当前 80 个 Java Markdown 的路径/front matter/交叉链接测试与审计中的 14 个目标标题。
- Produces: `BACKEND_ARTICLE_SPECS`（14 个精确路径、标题、关键词、用途小标题和交叉链接要求）、可复用的 `inspectBackendUsage()`/`inspectBackendArticle()` 规则；正文批次随后只把已创建的路径追加到 `EXPECTED_ARTICLES_BY_CHAPTER`，不让未来文件阻塞当前批次。

- [ ] **Step 1: 写测试规格的失败断言**

  在 `tests/java-course-content.test.mjs` 先加入 `test('backend article specification manifest covers 14 planned pages', ...)`，断言规格表有 14 个唯一文件名、标题和至少一个常用/不常用关键词；引用尚未定义的 `BACKEND_ARTICLE_SPECS`，使脚手架测试先失败。

  Run: `node --loader ./tests/typescript-loader.mjs --test tests/java-course-content.test.mjs`

  Expected: FAIL with the missing backend specification manifest，而既有 80 页路径和质量测试仍保持原结果。

- [ ] **Step 2: 实现不依赖正文的目录与用法检查器**

  定义 14 个目标文件名：Spring 请求链路 01–04、安全与数据边界 05/07/08、MyBatis/数据基础设施 06/13/14、工程能力 09–12；每条规格声明文章标题、关键 API、共享小节、三条基础交叉链接和禁止专名。将旧硬编码计数改为从 `EXPECTED_JAVA_PATHS` 推导，并让 `inspectBackendUsage()` 能识别 Java/SQL fenced block、`用途：` 和独立 `// 输出：`/`-- 输出：` 行，但暂不把缺失的 14 篇加入路径清单。

  Run: `node --loader ./tests/typescript-loader.mjs --test tests/java-course-content.test.mjs`

  Expected: PASS；仍为 80 个 Markdown、79 篇文章、12 个章节，且新增 manifest 测试确认 14 个计划条目和基础链接目标无重复。

- [ ] **Step 3: 构建并检查脚手架范围**

  Run: `corepack pnpm@9.15.9 build` and `git diff --check`

  Expected: build exit 0、无空白错误；`git diff -- docs/courses/java` 只包含测试文件，不应出现课程正文。

- [ ] **Step 4: 提交批次 0**

  ```bash
  git add tests/java-course-content.test.mjs
  git commit -m "test: scaffold Java backend quick-reference contract"
  ```

### Task 2: 批次 1——Spring 请求链路（4 篇）

**Files:**

- Create: `docs/courses/java/13-后端工程/01-Spring-Boot启动与配置.md`
- Create: `docs/courses/java/13-后端工程/02-Spring-IoC与Bean生命周期.md`
- Create: `docs/courses/java/13-后端工程/03-Spring-AOP与声明式事务.md`
- Create: `docs/courses/java/13-后端工程/04-Spring-MVC与Servlet边界.md`
- Modify: `tests/java-course-content.test.mjs`

**Interfaces:**

- Consumes: 审计中的 Spring Boot、IoC、AOP、Spring 事务、MVC、Servlet 缺口；既有 `getQuickReferenceSubsections`、`getJavaBlocks`、`hasStandaloneOutputComment` 检查逻辑。
- Produces: `CHAPTER_NAMES` 新增 `13-后端工程`；`EXPECTED_ARTICLES_BY_CHAPTER['13-后端工程']` 首批 4 个精确文件名；`BACKEND_ARTICLE_SPECS` 为这 4 页声明标题、用法标题和关键词，后续批次只追加条目。

- [ ] **Step 1: 为批次 1 写失败的路径与内容契约测试**

  在 `tests/java-course-content.test.mjs` 将旧测试的硬编码文件数改为从 `EXPECTED_JAVA_PATHS` 推导，追加第 13 章与首批 4 个路径，并新增 `BACKEND_ARTICLE_SPECS`/`inspectBackendUsage()`：每页必须有 front matter、共享结构、`常用用法` 和 `不常用但需要知道`，每个 `###` 用法小节必须包含 `用途：`、Java/SQL fenced block 和独立输出注释；正文拒绝 `若依|RuoYi|实践任务|练习题|面试常问`。保留已有 01–10 质量测试语义，不把旧 80 篇正文纳入改写。

  Run: `node --loader ./tests/typescript-loader.mjs --test tests/java-course-content.test.mjs`

  Expected: FAIL，报告新增的 4 个路径不存在或用法契约缺失；既有基线断言不应因测试重构而改变。

- [ ] **Step 2: 创建四篇 Spring 请求链路文章**

  每篇采用统一 front matter（`title`、`date`、`category`、`tags`、`description`）和共享章节结构。内容规格如下：

  - `01-Spring-Boot启动与配置.md`：`@SpringBootApplication` 启动入口、`application.yml`、`@ConfigurationProperties`、条件装配、启动失败定位；不常用入口覆盖 `ApplicationRunner`、`Environment` 或条件报告，说明配置绑定与环境变量边界。
  - `02-Spring-IoC与Bean生命周期.md`：`@Component`/`@Service`、`@Bean`、构造器注入、`@PostConstruct`、作用域、代理对象；不常用入口覆盖 `ObjectProvider`、`@Lazy`、`@Primary`，强调循环依赖与构造器注入选择。
  - `03-Spring-AOP与声明式事务.md`：`@Aspect`/`@Pointcut`、`@Around`/`proceed`、`@Transactional`、传播/隔离/回滚/只读和自调用陷阱；不常用入口覆盖 `@Order`、`TransactionTemplate`、回滚规则，明确对照已有 JDBC 事务页。
  - `04-Spring-MVC与Servlet边界.md`：`@RestController`、`@RequestMapping`/`@GetMapping`、`@RequestBody`、响应体、异常处理、Filter/Interceptor；不常用入口覆盖 `ResponseEntity`、`OncePerRequestFilter`、拦截器顺序和 Servlet request/response 生命周期，说明 MVC 与 Servlet 的责任边界。

  每个 API 小标题紧跟一句用途和短示例；用到 List/Map/String 时只链接既有速查页，不复制集合或字符串 API。示例使用 `jakarta.*` 与项目兼容的 Spring Boot 4.1.0 API，不放项目专名。

- [ ] **Step 3: 运行批次 1 的红绿验证和机器检查**

  Run: `node --loader ./tests/typescript-loader.mjs --test tests/java-course-content.test.mjs`

  Expected: PASS，路径基线为 84 个 Markdown、83 篇文章、13 个章节；批次 1 的四篇文章通过 front matter、共享结构、用途/代码/输出检查。

  Run: `rg -n '若依|RuoYi|实践任务|练习题|面试常问' docs/courses/java/13-后端工程`

  Expected: no matches。

  Run: `rg -n '^\s*(//|--)\s*输出\s*[:：]' docs/courses/java/13-后端工程 -g '0[1-4]-*.md'`

  Expected: 每个用法示例至少有一行独立输出注释；缺行时由测试而非人工猜测报告具体文件。

- [ ] **Step 4: 构建并检查批次 1 范围**

  Run: `corepack pnpm@9.15.9 build`

  Expected: exit 0，VitePress 能生成第 13 章四个页面。

  Run: `git diff --check`

  Expected: no whitespace errors；`git diff -- docs/courses/java/01-Java基础 docs/courses/java/12-设计与项目` 为空。

- [ ] **Step 5: 提交批次 1**

  ```bash
  git add docs/courses/java/13-后端工程/01-Spring-Boot启动与配置.md docs/courses/java/13-后端工程/02-Spring-IoC与Bean生命周期.md docs/courses/java/13-后端工程/03-Spring-AOP与声明式事务.md docs/courses/java/13-后端工程/04-Spring-MVC与Servlet边界.md tests/java-course-content.test.mjs
  git commit -m "docs: add Spring backend quick references"
  ```

### Task 3: 批次 2——持久化与数据基础设施（3 篇）

**Files:**

- Create: `docs/courses/java/13-后端工程/06-MyBatis核心与MyBatis-Plus重点.md`
- Create: `docs/courses/java/13-后端工程/13-MySQL-8.0.md`
- Create: `docs/courses/java/13-后端工程/14-Redis.md`
- Modify: `tests/java-course-content.test.mjs`

**Interfaces:**

- Consumes: Task 1 的第 13 章 manifest、`BACKEND_ARTICLE_SPECS` 和共享用法检查器；前文事务、集合、String、JDBC 页面通过链接复用。
- Produces: manifest 追加 06、13、14，路径基线变为 87 个 Markdown/86 篇文章；`BACKEND_ARTICLE_SPECS` 追加 MyBatis、MySQL 8.0、Redis 的标题、关键词和输出注释要求。

- [ ] **Step 1: 为批次 2 扩展失败测试**

  追加三个路径、精确标题和关键词断言：MyBatis 页必须同时出现 XML `<select>`/`<insert>`、`#{}`、动态 `<if>`/`<foreach>`、结果映射、`BaseMapper`、`QueryWrapper`、分页与原生 XML 对照；MySQL 页必须出现 `MySQL 8.0` 与 `EXPLAIN`；Redis 页必须出现 `RedisTemplate`、`opsForValue`、TTL、Lua 和至少一个缓存故障边界。增加“不得写成当前覆盖样本使用 MyBatis-Plus”的负向文案检查。

  Run: `node --loader ./tests/typescript-loader.mjs --test tests/java-course-content.test.mjs`

  Expected: FAIL，新增三篇路径不存在；Task 2 的 4 篇仍保持 PASS。

- [ ] **Step 2: 创建三篇持久化与数据基础设施文章**

  - `06-MyBatis核心与MyBatis-Plus重点.md`：先讲 mapper XML、`#{}` 参数绑定、动态 SQL、结果映射、分页/批量/事务，再讲 `BaseMapper`、`IService`、`QueryWrapper`/`LambdaQueryWrapper`、分页插件和 MP 与原生 XML 的取舍；明确 MP 是独立扩展知识，版本/依赖需由使用方确认，不出现项目专名或“源码已使用”结论。
  - `13-MySQL-8.0.md`：固定围绕 MySQL 8.0，覆盖 DDL/常用类型/字符集、索引与 `EXPLAIN`、事务/行锁、CTE/窗口函数、时间类型与 JDBC 驱动、offset/keyset 分页和批量写入；SQL 示例的结果用独立 `-- 输出：` 注释，说明连接池与事务边界仍回链 JDBC 页。
  - `14-Redis.md`：覆盖 `RedisTemplate.opsForValue`、Hash/List/Set、TTL、序列化、Lua 原子操作、缓存一致性、穿透/击穿/雪崩、限流和并发失败边界；Java 示例成短片段并在释放/超时/重试处写清边界，不把 Redis 当作数据库事务替代品。

- [ ] **Step 3: 运行批次 2 的红绿验证和机器检查**

  Run: `node --loader ./tests/typescript-loader.mjs --test tests/java-course-content.test.mjs`

  Expected: PASS，路径基线为 87 个 Markdown、86 篇文章、13 个章节；三个新页面通过通用用途/代码/输出契约和关键词/负向文案契约。

  Run: `rg -n 'MySQL 8\.0|EXPLAIN|BaseMapper|QueryWrapper|RedisTemplate|opsForValue|TTL|Lua' docs/courses/java/13-后端工程 -g '06-*.md' -g '13-*.md' -g '14-*.md'`

  Expected: 关键字命中对应文章；`rg -n '源码.{0,20}MyBatis-Plus|当前.{0,20}MyBatis-Plus' docs/courses/java/13-后端工程 -g '06-*.md'` 无匹配。

- [ ] **Step 4: 构建并检查批次 2 范围**

  Run: `corepack pnpm@9.15.9 build` and `git diff --check`

  Expected: build exit 0、无空白错误；`git diff -- docs/courses/java/01-Java基础 docs/courses/java/12-设计与项目` 仍为空，既有 JDBC/List/Map/String 正文未被复制或修改。

- [ ] **Step 5: 提交批次 2**

  ```bash
  git add docs/courses/java/13-后端工程/06-MyBatis核心与MyBatis-Plus重点.md docs/courses/java/13-后端工程/13-MySQL-8.0.md docs/courses/java/13-后端工程/14-Redis.md tests/java-course-content.test.mjs
  git commit -m "docs: add MyBatis MySQL Redis references"
  ```

### Task 4: 批次 3——安全与数据边界（3 篇）

**Files:**

- Create: `docs/courses/java/13-后端工程/05-Spring-Security与JWT.md`
- Create: `docs/courses/java/13-后端工程/07-Jackson与Fastjson2-JSON.md`
- Create: `docs/courses/java/13-后端工程/08-Bean-Validation参数校验.md`
- Modify: `tests/java-course-content.test.mjs`

**Interfaces:**

- Consumes: Task 1–3 的共享结构、输出注释检查和现有 Hutool JSON/JDBC/异常页面链接；测试继续只扩展第 13 章 manifest，不改变旧文章质量范围。
- Produces: manifest 追加 05、07、08，路径基线变为 90 个 Markdown/89 篇文章；新增安全、JSON、Validation 关键词与职责分离断言。

- [ ] **Step 1: 为批次 3 扩展失败测试**

  加入三个路径和标题契约：Security/JWT 必须包含 `SecurityFilterChain`、`authorizeHttpRequests`、`@PreAuthorize`、BCrypt、Bearer、claims、过期、401/403；JSON 必须同时出现 `ObjectMapper`、Jackson 注解、Fastjson2 `toJSONString`/`parseObject`、自定义序列化和 Redis 序列化边界；Validation 必须出现 `@NotBlank`/`@Size`、`@Valid`/`@Validated`、级联、分组、`ConstraintValidator` 和字段错误响应。增加负向检查：不得把 JSON 转换写成授权/校验，也不得把 JWT 解析等同于授权。

  Run: `node --loader ./tests/typescript-loader.mjs --test tests/java-course-content.test.mjs`

  Expected: FAIL，仅因三个新路径尚不存在；前两批文章继续通过。

- [ ] **Step 2: 创建三篇安全与数据边界文章**

  - `05-Spring-Security与JWT.md`：按过滤器链→认证→密码编码→方法授权→Bearer token/claims/过期→401/403→无状态会话→密钥轮换/吊销讲解；不常用入口覆盖自定义 `AuthenticationEntryPoint`、`AccessDeniedHandler` 和测试替身。JWT 示例不得写真实密钥，不使用与项目 `jjwt` 版本不兼容的新版专属 API。
  - `07-Jackson与Fastjson2-JSON.md`：对照 `ObjectMapper`/Jackson Databind（同时说明项目可能使用 `tools.jackson` 的 Jackson 3 风格）与 Fastjson2 `JSON.toJSONString`/`JSON.parseObject`，覆盖 `@JsonFormat`、`@JsonInclude`、自定义序列化、日期/敏感字段和 Redis 序列化；与既有 Hutool JSON 页交叉链接，不重复 List/Map/String 基础。
  - `08-Bean-Validation参数校验.md`：覆盖 `@NotBlank`/`@Size`、`@Valid`/`@Validated`、嵌套级联、校验分组、方法参数、`ConstraintValidator` 和统一字段错误响应；强调转换、校验、授权是三步职责，不把 `null`、空字符串和缺失字段混写。

- [ ] **Step 3: 运行批次 3 的红绿验证和机器检查**

  Run: `node --loader ./tests/typescript-loader.mjs --test tests/java-course-content.test.mjs`

  Expected: PASS，路径基线为 90 个 Markdown、89 篇文章、13 个章节；每页均有成功路径和失败/边界说明，输出注释检查通过。

  Run: `rg -n '若依|RuoYi|真实密钥|实践任务|练习题|面试常问' docs/courses/java/13-后端工程 -g '05-*.md' -g '07-*.md' -g '08-*.md'`

  Expected: no matches；`rg -n 'SecurityFilterChain|PreAuthorize|ObjectMapper|fastjson|ConstraintValidator' ...` 命中对应文章。

- [ ] **Step 4: 构建并检查批次 3 范围**

  Run: `corepack pnpm@9.15.9 build` and `git diff --check`

  Expected: build exit 0、无空白错误；新增页面的 Java 示例不触发既有 JDK 20+ API 规则，旧章正文和既有 JSON/JDBC 页面仍无 diff。

- [ ] **Step 5: 提交批次 3**

  ```bash
  git add docs/courses/java/13-后端工程/05-Spring-Security与JWT.md docs/courses/java/13-后端工程/07-Jackson与Fastjson2-JSON.md docs/courses/java/13-后端工程/08-Bean-Validation参数校验.md tests/java-course-content.test.mjs
  git commit -m "docs: add security JSON validation references"
  ```

### Task 5: 批次 4——工程能力、导航与最终发布（4 篇）

**Files:**

- Create: `docs/courses/java/13-后端工程/09-SLF4J与Logback日志.md`
- Create: `docs/courses/java/13-后端工程/10-文件上传下载与资源安全.md`
- Create: `docs/courses/java/13-后端工程/11-Apache-POI-Excel导入导出.md`
- Create: `docs/courses/java/13-后端工程/12-Quartz定时任务.md`
- Modify: `docs/courses/java/index.md`
- Modify: `tests/java-course-content.test.mjs`

**Interfaces:**

- Consumes: Task 1–4 的 90 个文件路径/文章契约和现有自动侧栏行为；根入口使用与现有 Java 页面相同的 `/courses/java/...` 路由格式。
- Produces: 完整 14 页 manifest（94 个 Markdown、93 篇文章、13 个章节）、Java 根入口的第 13 章导航、线上可访问的 14 个页面；最终提交后由 `origin/main` 触发 Vercel。

- [ ] **Step 1: 为批次 4 扩展失败测试并锁定导航契约**

  追加 09–12 路径与标题，最终断言第 13 章恰好 14 篇；新增导航测试要求 `docs/courses/java/index.md` 出现第 13 章入口并链接全部 14 个不带 `.md` 的路由。关键词契约要求日志页有 `LoggerFactory`/`logback`/`MDC`，文件页有 `MultipartFile`/`Content-Disposition`，Excel 页有 `Workbook`/`SXSSFWorkbook`，Quartz 页有 `JobDetail`/`CronTrigger`/`@DisallowConcurrentExecution`。

  Run: `node --loader ./tests/typescript-loader.mjs --test tests/java-course-content.test.mjs`

  Expected: FAIL，报告缺少四个页面和导航链接。

- [ ] **Step 2: 创建四篇工程能力文章并更新根导航**

  - `09-SLF4J与Logback日志.md`：覆盖 `LoggerFactory`、参数化 `info`/`error`、Logback appender/滚动、MDC 请求 ID、脱敏和 AOP 操作日志；至少一段说明异常堆栈、采样和敏感字段边界。
  - `10-文件上传下载与资源安全.md`：覆盖 `MultipartFile`、`transferTo`、扩展名/大小白名单、路径规范化与路径穿越、临时文件、`Content-Disposition` 和流式下载；成功与拒绝路径都给短代码和独立输出注释。
  - `11-Apache-POI-Excel导入导出.md`：覆盖 `WorkbookFactory`、`SXSSFWorkbook`、通用列/注解映射、导入校验、导出响应、大文件、日期/公式和 Workbook/流资源释放；版本说明与 POI 5.5.1 兼容。
  - `12-Quartz定时任务.md`：覆盖 `Job`、`JobDetail`、`CronTrigger`、Cron 表达式、misfire、暂停/恢复、`@DisallowConcurrentExecution`、持久化表和失败重试；区分 Quartz 与 JDK `ScheduledExecutorService`，不把并发控制写成绝对保证。

  `docs/courses/java/index.md` 增加“后端工程”阶段及 14 个文章链接/用途描述，保留旧 01–12 章统计与链接，只修正必要的“后续路线”表述；不要将审计文件或源码项目名写进课程正文。

- [ ] **Step 3: 运行最终红绿验证、全量测试与机器审计**

  Run: `node --loader ./tests/typescript-loader.mjs --test tests/java-course-content.test.mjs`

  Expected: PASS，路径/前置字段/共享结构/用法标题/输出注释/JDK 20 兼容/导航和第 13 章专用检查全部通过。

  Run: `corepack pnpm@9.15.9 test`

  Expected: all Node tests pass；若出现既有 `sidebar-rendering` baseline，记录真实断言和原因，不能通过修改主题或本计划无关文件绕过。

  Run: `rg --files docs/courses/java/13-后端工程 -g '*.md' | Measure-Object`、`rg -n '若依|RuoYi' docs/courses/java/13-后端工程`、`rg -n '^\s*(//|--)\s*输出\s*[:：]' docs/courses/java/13-后端工程`

  Expected: 文件数为 14；专名扫描无结果；每个用法示例都有独立输出注释。再执行 `git diff -- docs/courses/java/01-Java基础 docs/courses/java/12-设计与项目`，Expected 为空。

- [ ] **Step 4: 构建、检查并提交最终内容**

  Run: `corepack pnpm@9.15.9 build` and `git diff --check`

  Expected: VitePress exit 0，`docs/.vitepress/dist` 生成第 13 章入口和 14 个页面；无空白错误。

  ```bash
  git add docs/courses/java/13-后端工程/09-SLF4J与Logback日志.md docs/courses/java/13-后端工程/10-文件上传下载与资源安全.md docs/courses/java/13-后端工程/11-Apache-POI-Excel导入导出.md docs/courses/java/13-后端工程/12-Quartz定时任务.md docs/courses/java/index.md tests/java-course-content.test.mjs
  git commit -m "docs: complete Java backend quick references"
  ```

- [ ] **Step 5: 推送并等待既有部署链路完成**

  ```bash
  git push origin main
  ```

  推送后按 `vercel.json` 的 `corepack pnpm@9.15.9 build`/`docs/.vitepress/dist` 配置等待 Vercel 部署，不改部署配置、不直接引入新部署工具。部署完成后用浏览器或 `Invoke-WebRequest` 抽查 Java 根入口、四个批次各至少一个页面及 MySQL/Redis 页面，确认 HTTP 200、无 `.md` 源地址、正文可见“常用用法”“不常用但需要知道”“课后小问”“快速回顾”。将最终 commit、推送和线上 URL/状态保存到交付记录。

## Self-Review

- Spec coverage: 14 个标题全部在 File Map 和四个正文批次中出现；Spring、Security/JWT、MyBatis/MP、JSON、Validation、日志、文件、POI、Quartz、MySQL 8.0、Redis 均有独立内容规格和机器关键词。
- Step scan: 每个批次先扩展可失败的路径/内容测试，再创建文章，再运行测试、构建、范围检查和显式提交；后续批次只追加 manifest，不会让尚未开始的文章阻塞前一批的审查。
- Type consistency: `EXPECTED_ARTICLES_BY_CHAPTER`、`EXPECTED_JAVA_PATHS`、`BACKEND_ARTICLE_SPECS` 和导航路由均以相同文件名为单一事实来源；最终期望为 94 个 Markdown、93 篇文章、13 个章节。
- Review Focus coverage: 路径/范围由分批 manifest 与最终 diff 审计覆盖；用途/代码/输出由共享检查器覆盖；专名/去重由负向与交叉链接断言覆盖；版本与数据/安全边界由批次关键词和人工页面审阅覆盖。
- Proportion: 计划只固定文件、标题、契约、验证命令和边界，不预写 14 篇正文；实现者仍可在约束内选择简短、可运行的示例。

## Execution Handoff

计划完成并保存到 `docs/superpowers/plans/2026-10-01-java-backend-quick-reference.md`。父 Agent 应先审阅任务边界和四批文件清单，再选择 `superpowers:subagent-driven-development` 或 `superpowers:executing-plans` 执行；本次委派只创建计划，不执行正文、提交、推送或部署。

