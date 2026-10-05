# Java Backend Learning Roadmap Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Reorder the Java course into a dependency-correct 01–15 roadmap, add complete MySQL 8 and Redis chapters, expand production backend topics, preserve every old URL, and prove both RuoYi-derived and official-common API coverage.

**Architecture:** Store the canonical chapter/article order, redirects, and coverage baselines as explicit data instead of inferring them from filesystem enumeration. Generate the VitePress sidebar and static client-side compatibility redirects from those manifests, while Markdown remains the single source for course content. Deliver content in independently reviewable chapter batches and keep structural/API-title checks separate from expert review of technical correctness.

**Tech Stack:** VitePress 1, TypeScript configuration, Node.js 22.13+, pnpm 9.15.9, Node test runner, fast-glob, gray-matter, Markdown, JDK 20 examples, MySQL 8.0/InnoDB, Redis stable official documentation, Spring Boot/Spring Data Redis/MyBatis-Plus.

**Spec:** `docs/superpowers/specs/2026-10-05-java-learning-roadmap-design.md`

## Global Constraints

- Java examples use JDK 20; preview/incubator APIs state their JDK 20 status and required compiler/runtime flags.
- Database examples use MySQL 8.0 and InnoDB only; do not mix dialects.
- MyBatis-Plus is the primary ORM practice entry, while native MyBatis mapping, dynamic SQL, cache, and plugin boundaries remain explicit.
- Redis facts come from the stable official documentation current at implementation time; state the applicable major version and never present release-candidate behavior as stable.
- Keep the site static on VitePress and GitHub Pages; add no server-side dependency and never claim an HTTP 301.
- Keep chapters 01–10 body text unchanged except necessary navigation, cross-links, and version-boundary corrections.
- RuoYi is an audit source only: exclude `com.ruoyi.*`, generated calls, and scanner false positives; keep all published notes project-neutral.
- Every added or materially rewritten article has complete frontmatter and the exact sections `学习目标`, `核心知识点`, `常用用法`, `易混点`, `课后小问`, `本节小结`, and `快速回顾`.
- Every independent API/command/operation uses a searchable real-name H3, one purpose sentence, and a minimal executable example with concrete initial input, each important state transition, and observable output/result.
- SQL and Redis CLI examples remain native; Java examples are JDK 20 compilable; nondeterministic framework/network/concurrency examples use assertions, state, or logs rather than invented output.
- Preserve user-owned/unrelated worktree changes; use `git mv` for chapter migrations; commit only files owned by the current task.

## Review Focus

- Numeric ordering: `01` through `15` must remain identical in the manifest, sidebar, index, and previous/next links even when filesystem enumeration returns lexical or arbitrary order (Task 1 test).
- Redirect safety: every legacy route maps once to an existing canonical target, handles non-ASCII paths, and emits matching canonical/meta-refresh/location.replace/fallback targets without overwriting a real route (Task 2 test).
- Content quality: an API section containing only prose, only a final output comment, or generic template wording must fail even if the heading exists (Task 3 test).
- Version and danger boundaries: preview JDK APIs, MySQL locking/backup operations, and dangerous Redis commands must state version/flags/risk instead of looking like universally safe defaults (Tasks 6, 7, 12, and 13 tests plus review records).
- Coverage honesty: RuoYi attribution and official-common coverage are separate denominators; exclusions require reasons, and neither report may substitute for the other (Task 14 test).

---

## File Structure

- `docs/.vitepress/config/java-course.ts` — canonical typed 01–15 chapter/article order consumed by navigation and tests.
- `docs/.vitepress/config/sidebar.ts` — uses the canonical Java manifest while retaining existing generic scanners for other courses.
- `docs/.vitepress/data/java-redirects.json` — one legacy-route-to-canonical-route mapping source.
- `scripts/generate-java-redirects.mjs` — validates the redirect map and writes static compatibility HTML under `docs/public/`.
- `tests/java-course-roadmap.test.mjs` — order, counts, links, redirects, version boundaries, and single-source invariants.
- `tests/java-course-content.test.mjs` — article structure, API headings, examples, and technical topic gates.
- `tests/fixtures/java-course/` — intentionally invalid article/redirect/coverage fixtures for regression tests.
- `tests/data/ruoyi-external-api-coverage.json` — regenerated external-call attribution with status, destination article, and H3.
- `tests/data/official-common-api-coverage.json` — explicit JDK/MySQL/Redis/Spring/MyBatis-Plus common-capability baseline.
- `docs/superpowers/reviews/java-roadmap-technical-review.md` — separate human review evidence for SQL/locks/cache/distributed systems and example accuracy.
- `docs/courses/java/index.md` — public roadmap, stage links, and learning order.
- `docs/courses/java/11-MySQL-8/` — index plus the fixed 12 MySQL 8 articles.
- `docs/courses/java/12-工程实践/` — migrated engineering content plus Flyway and HikariCP/multi-datasource material.
- `docs/courses/java/13-设计与项目/` — migrated design/project content.
- `docs/courses/java/14-后端工程/` — migrated Spring backend content plus required general backend production topics; no duplicate standalone MySQL/Redis pages.
- `docs/courses/java/15-Redis/` — index plus the fixed 15 Redis articles.

### Task 1: Canonical Course Manifest and Explicit Sidebar Order

**Files:**
- Create: `docs/.vitepress/config/java-course.ts`
- Modify: `docs/.vitepress/config/sidebar.ts`
- Create: `tests/java-course-roadmap.test.mjs`
- Modify: `tests/sidebar-rendering.test.mjs`

**Interfaces:**
- Produces: `JavaCourseArticle`, `JavaCourseChapter`, and `JAVA_COURSE_CHAPTERS: readonly JavaCourseChapter[]`; `getJavaCourseItems(): DefaultTheme.SidebarItem[]` consumes that manifest.
- Produces: ordered chapter IDs `01-Java基础` through `15-Redis`; later tasks append only article metadata, never create a second order list.

- [ ] **Step 1: Write failing order and sidebar tests**

Assert 15 unique chapter IDs in exact numeric order, unique article routes, chapter/article links beginning with `/courses/java/`, and that the Java sidebar is built by `getJavaCourseItems()` rather than `getItems("courses/java")`. Include a test that shuffles a copied input list and still expects manifest order, pinning the first Review Focus item.

- [ ] **Step 2: Run the focused tests and confirm failure**

Run: `corepack pnpm@9.15.9 test -- --test-name-pattern="Java roadmap|Java sidebar"`

Expected: FAIL because `java-course.ts` and `getJavaCourseItems` do not exist and only 13 chapters are discoverable.

- [ ] **Step 3: Add the typed manifest and Java-only sidebar builder**

Define exact chapter labels and ordered article descriptors (`file`, `title`, `route`) for existing and planned articles. Keep planned entries in the same manifest so missing-file tests stay red until their owning content task. Render group labels with counts and preserve current numbering/collapse behavior without relying on `fast-glob` order.

- [ ] **Step 4: Run sidebar tests**

Run: `corepack pnpm@9.15.9 test -- --test-name-pattern="Java roadmap|Java sidebar|sidebar link labels"`

Expected: PASS for order/rendering assertions; missing-content assertions remain scoped to later tests and are not added yet.

- [ ] **Step 5: Commit**

```bash
git add docs/.vitepress/config/java-course.ts docs/.vitepress/config/sidebar.ts tests/java-course-roadmap.test.mjs tests/sidebar-rendering.test.mjs
git commit -m "feat(java): define ordered course manifest"
```

### Task 2: Permanent Static Compatibility Redirect Contract

**Files:**
- Create: `docs/.vitepress/data/java-redirects.json`
- Create: `scripts/generate-java-redirects.mjs`
- Create: `tests/fixtures/java-course/invalid-redirects.json`
- Modify: `tests/java-course-roadmap.test.mjs`
- Modify: `package.json`

**Interfaces:**
- Consumes: canonical routes from `JAVA_COURSE_CHAPTERS`.
- Produces: `validateRedirects(entries, canonicalRoutes)` and `renderRedirectHtml(targetRoute)` exports; `pnpm generate:java-redirects`; `prebuild` invokes generation.

- [ ] **Step 1: Add failing redirect-contract tests**

Assert every old `11-工程实践`, `12-设计与项目`, and `13-后端工程` article route appears exactly once; old MySQL maps to `/11-MySQL-8/01-环境连接与数据库对象`, old Redis maps to `/15-Redis/01-基础连接与数据模型`, and all other old articles map to their shifted chapter equivalents. Assert targets exist in the canonical manifest, sources do not collide with canonical routes, invalid duplicate/missing-target fixtures fail, and rendered HTML contains the same encoded destination in canonical, zero-delay refresh, `location.replace`, and fallback anchor.

- [ ] **Step 2: Run the redirect tests and confirm failure**

Run: `node --test tests/java-course-roadmap.test.mjs --test-name-pattern="redirect"`

Expected: FAIL because no redirect map or generator exists.

- [ ] **Step 3: Implement validated static redirect generation**

Generate one `docs/public/<legacy-route>.html` file per route, including UTF-8 HTML escaping and URL-safe JavaScript serialization. Add `generate:java-redirects` and a `prebuild` hook; do not check generated HTML into Git unless the repository's existing build convention requires it.

- [ ] **Step 4: Generate and test redirects**

Run: `corepack pnpm@9.15.9 generate:java-redirects`

Expected: exits 0 and reports the exact redirect count.

Run: `node --test tests/java-course-roadmap.test.mjs --test-name-pattern="redirect"`

Expected: PASS, including non-ASCII, duplicate-source, missing-target, and canonical collision cases.

- [ ] **Step 5: Commit**

```bash
git add package.json docs/.vitepress/data/java-redirects.json scripts/generate-java-redirects.mjs tests/java-course-roadmap.test.mjs tests/fixtures/java-course/invalid-redirects.json
git commit -m "feat(java): preserve legacy course routes"
```

### Task 3: Article Structure and Example Quality Gate

**Files:**
- Modify: `tests/java-course-content.test.mjs`
- Create: `tests/fixtures/java-course/only-final-output.md`
- Create: `tests/fixtures/java-course/template-comment.md`
- Create: `tests/fixtures/java-course/missing-purpose.md`
- Create: `tests/fixtures/java-course/danger-without-warning.md`

**Interfaces:**
- Produces: reusable assertions for frontmatter, required H2 order, real-name H3, purpose sentence, concrete initial state, key transition comments, and observable result.
- Produces: `DANGEROUS_MYSQL_REDIS_TOKENS` requiring a nearby risk boundary.

- [ ] **Step 1: Add failing positive and negative fixture tests**

Require all new/migrated articles to use the eight-section contract. Reject each fixture for its named reason, including examples that have only `// 输出：...`, vague “执行后得到预期结果”, missing initial values, or dangerous operations (`FLUSHALL`, `KEYS`, `DEL` on big keys, broad `UPDATE`/`DELETE`, lock/backup operations) without an explicit boundary.

- [ ] **Step 2: Run quality-gate tests and confirm failure**

Run: `node --test tests/java-course-content.test.mjs --test-name-pattern="article contract|example state|danger boundary"`

Expected: FAIL because the new fixture contracts are not implemented.

- [ ] **Step 3: Implement the checks without weakening existing Java API gates**

Apply strict checks to new chapters and materially rewritten migrated articles. Keep current exact external API heading assertions and all forbidden generic comment phrases.

- [ ] **Step 4: Run the focused content tests**

Run: `node --test tests/java-course-content.test.mjs --test-name-pattern="article contract|example state|danger boundary"`

Expected: PASS for fixtures and existing covered articles.

- [ ] **Step 5: Commit**

```bash
git add tests/java-course-content.test.mjs tests/fixtures/java-course
git commit -m "test(java): enforce searchable stateful examples"
```

### Task 4: Migrate Chapters 11–13 to 12–14

**Files:**
- Move: `docs/courses/java/11-工程实践/*.md` → `docs/courses/java/12-工程实践/*.md`
- Move: `docs/courses/java/12-设计与项目/*.md` → `docs/courses/java/13-设计与项目/*.md`
- Move: `docs/courses/java/13-后端工程/01-*.md` through `12-*.md` → `docs/courses/java/14-后端工程/`
- Modify: `docs/.vitepress/config/java-course.ts`
- Modify: `docs/courses/java/index.md`
- Modify: all Markdown files containing old `/courses/java/11-`, `/12-`, or `/13-后端工程/` routes
- Modify: `tests/java-course-roadmap.test.mjs`
- Modify: `tests/java-course-content.test.mjs`
- Modify: `tests/open-source-data.test.mjs`

**Interfaces:**
- Consumes: redirect map from Task 2 and exact destination paths from the spec.
- Produces: canonical 12/13/14 directories; no canonical MySQL/Redis article remains under chapter 14.

- [ ] **Step 1: Add failing migration and internal-link tests**

Assert old canonical directories are absent, shifted articles exist at exact new paths, no Markdown link points to an old canonical route, no orphan Markdown exists outside the manifest, and source-history migration is detectable via the staged rename set.

- [ ] **Step 2: Run focused tests and confirm failure**

Run: `node --test tests/java-course-roadmap.test.mjs tests/open-source-data.test.mjs --test-name-pattern="migration|internal Java links|course inventory"`

Expected: FAIL against the current 11/12/13 layout.

- [ ] **Step 3: Move with Git and update all consumers**

Use `git mv`; update test path maps, entry-page links, article cross-links, and manifest entries. Do not move the old standalone MySQL and Redis pages into chapter 14; their material is consumed by Tasks 5–7 and 10–12.

- [ ] **Step 4: Verify migrated structure and links**

Run: `corepack pnpm@9.15.9 test -- --test-name-pattern="migration|internal Java links|course inventory|external API"`

Expected: PASS with external API gates pointing to chapter 14 equivalents.

- [ ] **Step 5: Commit**

```bash
git add -u docs/courses/java tests docs/.vitepress/config/java-course.ts
git add docs/courses/java/12-工程实践 docs/courses/java/13-设计与项目 docs/courses/java/14-后端工程 docs/courses/java/index.md
git commit -m "docs(java): reorder engineering chapters"
```

### Task 5: MySQL 8 Chapter Foundation and CRUD Articles

**Files:**
- Create: `docs/courses/java/11-MySQL-8/index.md`
- Create: `docs/courses/java/11-MySQL-8/01-环境连接与数据库对象.md`
- Create: `docs/courses/java/11-MySQL-8/02-表设计与DDL.md`
- Create: `docs/courses/java/11-MySQL-8/03-数据类型字符集与时区.md`
- Create: `docs/courses/java/11-MySQL-8/04-数据写入更新与删除.md`
- Modify: `docs/.vitepress/config/java-course.ts`
- Modify: `tests/java-course-roadmap.test.mjs`
- Modify: `tests/java-course-content.test.mjs`

**Interfaces:**
- Consumes: article contract from Task 3.
- Produces: chapter 11 entry route and foundational terms linked by all later MySQL/MyBatis pages.

- [ ] **Step 1: Add failing inventory and topic tests**

Assert exact files/titles, MySQL 8.0/InnoDB/utf8mb4/time-zone boundaries, searchable H3s for connection/session/database/view, `CREATE/ALTER/DROP TABLE`, core types/JSON/NULL, and `INSERT/UPDATE/DELETE/INSERT ... ON DUPLICATE KEY UPDATE`; require unsafe write warnings.

- [ ] **Step 2: Run focused MySQL tests and confirm failure**

Run: `node --test tests/java-course-roadmap.test.mjs tests/java-course-content.test.mjs --test-name-pattern="MySQL foundation|MySQL CRUD"`

Expected: FAIL with four missing articles and index.

- [ ] **Step 3: Write the index and four articles**

Use a consistent sample schema so state-transition comments show concrete rows before and after each write. Fold useful material from the former `13-MySQL-8.0.md` into the correct fact-source article without retaining project-specific wording.

- [ ] **Step 4: Run focused tests**

Run: `node --test tests/java-course-roadmap.test.mjs tests/java-course-content.test.mjs --test-name-pattern="MySQL foundation|MySQL CRUD|article contract"`

Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add docs/courses/java/11-MySQL-8 docs/.vitepress/config/java-course.ts tests/java-course-roadmap.test.mjs tests/java-course-content.test.mjs
git commit -m "docs(java): add MySQL foundations and CRUD"
```

### Task 6: MySQL Querying, Indexing, Transactions, and Diagnostics

**Files:**
- Create: `docs/courses/java/11-MySQL-8/05-查询过滤排序与分页.md`
- Create: `docs/courses/java/11-MySQL-8/06-连接子查询与集合查询.md`
- Create: `docs/courses/java/11-MySQL-8/07-聚合CTE窗口函数与JSON.md`
- Create: `docs/courses/java/11-MySQL-8/08-约束与索引设计.md`
- Create: `docs/courses/java/11-MySQL-8/09-事务MVCC隔离级别与锁.md`
- Create: `docs/courses/java/11-MySQL-8/10-EXPLAIN慢SQL与性能优化.md`
- Modify: `docs/.vitepress/config/java-course.ts`
- Modify: `tests/java-course-content.test.mjs`

**Interfaces:**
- Consumes: schema/data established in Task 5.
- Produces: MySQL fact-source anchors for SQL semantics, index design, isolation/MVCC/locks, and execution plans.

- [ ] **Step 1: Add failing searchable-topic tests**

Require independent H3s for SELECT/WHERE/ORDER BY/LIMIT and cursor pagination; INNER/LEFT JOIN/EXISTS/UNION; GROUP BY/HAVING/WITH/OVER/JSON functions; unique/foreign/check and B+Tree/composite/covering/prefix/function indexes; ACID/autocommit/isolation/snapshot/current read/row-gap-next-key locks/deadlocks; EXPLAIN ANALYZE/statistics/slow log. Assert SQL injection, lock duration, and production `EXPLAIN ANALYZE` risk boundaries.

- [ ] **Step 2: Run tests and confirm failure**

Run: `node --test tests/java-course-content.test.mjs --test-name-pattern="MySQL query|MySQL index|MySQL transaction|MySQL explain"`

Expected: FAIL with six missing articles.

- [ ] **Step 3: Write the six articles with linked single facts**

Make query plans and transaction state observable with concrete SQL and expected row/plan properties; do not promise an exact optimizer plan where statistics can vary.

- [ ] **Step 4: Record expert review evidence**

Create the MySQL section in `docs/superpowers/reviews/java-roadmap-technical-review.md`, recording reviewed article, claim, official MySQL 8.0 reference section, and pass/correction for SQL, MVCC/locks, and optimizer claims.

- [ ] **Step 5: Run tests and commit**

Run: `node --test tests/java-course-content.test.mjs --test-name-pattern="MySQL query|MySQL index|MySQL transaction|MySQL explain|article contract"`

Expected: PASS.

```bash
git add docs/courses/java/11-MySQL-8 docs/.vitepress/config/java-course.ts docs/superpowers/reviews/java-roadmap-technical-review.md tests/java-course-content.test.mjs
git commit -m "docs(java): add MySQL querying and internals"
```

### Task 7: MySQL Operations and Java Boundary

**Files:**
- Create: `docs/courses/java/11-MySQL-8/11-用户权限备份与恢复.md`
- Create: `docs/courses/java/11-MySQL-8/12-Java-JDBC与MyBatis衔接.md`
- Modify: `docs/courses/java/12-工程实践/02-JDBC与事务.md`
- Modify: `docs/courses/java/14-后端工程/03-Spring-AOP与声明式事务.md`
- Modify: `docs/courses/java/14-后端工程/06-MyBatis核心与MyBatis-Plus重点.md`
- Modify: `docs/.vitepress/config/java-course.ts`
- Modify: `tests/java-course-content.test.mjs`
- Modify: `docs/superpowers/reviews/java-roadmap-technical-review.md`

**Interfaces:**
- Consumes: MySQL fact-source anchors from Tasks 5–6.
- Produces: explicit boundaries: MySQL owns database internals, JDBC owns Java lifecycle/API, MyBatis owns mapping, Spring owns proxy/propagation/rollback.

- [ ] **Step 1: Add failing operations and boundary tests**

Require searchable headings for least privilege/roles/logical and physical backup/restore drill, Connector/J URLs, PreparedStatement, generated keys, batching, JDBC transactions, pools, MyBatis/MyBatis-Plus handoff; assert JDBC/MyBatis/Spring pages link rather than re-teach MVCC/locks.

- [ ] **Step 2: Run tests and confirm failure**

Run: `node --test tests/java-course-content.test.mjs --test-name-pattern="MySQL operations|data access boundary"`

Expected: FAIL with missing articles and stale cross-links.

- [ ] **Step 3: Write the articles and narrow duplicate explanations**

State backup/restore risks and verification steps. Keep JDBC examples compilable under JDK 20 with dependencies identified, and update downstream pages to link canonical MySQL sections.

- [ ] **Step 4: Review and verify**

Append permission/backup/restore and Java-boundary review evidence, then run:

`node --test tests/java-course-content.test.mjs --test-name-pattern="MySQL operations|data access boundary|article contract"`

Expected: PASS and exactly 12 MySQL articles plus index.

- [ ] **Step 5: Commit**

```bash
git add docs/courses/java/11-MySQL-8 docs/courses/java/12-工程实践/02-JDBC与事务.md docs/courses/java/14-后端工程/03-Spring-AOP与声明式事务.md docs/courses/java/14-后端工程/06-MyBatis核心与MyBatis-Plus重点.md docs/.vitepress/config/java-course.ts docs/superpowers/reviews/java-roadmap-technical-review.md tests/java-course-content.test.mjs
git commit -m "docs(java): complete MySQL operations and integration"
```

### Task 8: Engineering Practice—Migration, Pooling, and Multi-Data-Source Boundaries

**Files:**
- Create: `docs/courses/java/12-工程实践/03-Flyway数据库迁移.md`
- Create: `docs/courses/java/12-工程实践/05-HikariCP与多数据源.md`
- Modify: `docs/courses/java/12-工程实践/01-Maven与测试工程.md`
- Modify: `docs/courses/java/12-工程实践/02-JDBC与事务.md`
- Modify: `docs/.vitepress/config/java-course.ts`
- Modify: `tests/java-course-content.test.mjs`

**Interfaces:**
- Consumes: MySQL/JDBC anchors from Task 7.
- Produces: Flyway migration ordering/validation/rollback boundaries, Liquibase comparison, HikariCP metrics/timeouts/leak diagnostics, routing-datasource transaction rules.

- [ ] **Step 1: Add failing engineering-topic tests**

Require H3s for Flyway versioned/repeatable migrations, validate/repair and rollback policy, Liquibase applicability, Hikari timeouts/metrics/leak detection, `AbstractRoutingDataSource`, and transaction pinning. Require purpose sentences and concrete observable examples.

- [ ] **Step 2: Run tests and confirm failure**

Run: `node --test tests/java-course-content.test.mjs --test-name-pattern="Flyway|Hikari|routing datasource"`

Expected: FAIL with missing articles.

- [ ] **Step 3: Write both articles and update the engineering learning sequence**

Keep schema semantics in chapter 11; show only migration/pool/client behavior here. Make rollback limitations and pool sizing non-prescriptive without workload measurements.

- [ ] **Step 4: Run tests and commit**

Run: `node --test tests/java-course-content.test.mjs --test-name-pattern="Flyway|Hikari|routing datasource|article contract"`

Expected: PASS.

```bash
git add docs/courses/java/12-工程实践 docs/.vitepress/config/java-course.ts tests/java-course-content.test.mjs
git commit -m "docs(java): add migration and connection management"
```

### Task 9: Spring Backend Production Expansion

**Files:**
- Create: `docs/courses/java/14-后端工程/13-OpenAPI与统一错误契约.md`
- Create: `docs/courses/java/14-后端工程/14-JUnit5-Mockito与MockMvc.md`
- Create: `docs/courses/java/14-后端工程/15-Testcontainers集成测试.md`
- Create: `docs/courses/java/14-后端工程/16-MyBatis生产边界.md`
- Create: `docs/courses/java/14-后端工程/17-RestClient-WebClient与HTTP韧性.md`
- Create: `docs/courses/java/14-后端工程/18-Actuator-Micrometer与可观测性.md`
- Create: `docs/courses/java/14-后端工程/19-Spring-Cache-Caffeine与Redisson.md`
- Modify: `docs/.vitepress/config/java-course.ts`
- Modify: `tests/java-course-content.test.mjs`

**Interfaces:**
- Consumes: MySQL, JDBC, and Redis chapter route contracts; the cache page may link forward to chapter 15 but must define prerequisite concepts locally.
- Produces: required common backend API coverage independent of RuoYi.

- [ ] **Step 1: Add failing per-article API/topic gates**

Require Springdoc/ProblemDetail/validation/error codes; JUnit 5/Mockito/MockMvc; Testcontainers lifecycle; complex resultMap/dynamic SQL/batch/pagination/L1/L2 cache/N+1/plugins/MyBatis-Plus wrapper safety; RestClient/WebClient timeouts/reuse/retry/idempotency/circuit breaking/rate limiting; Actuator/Micrometer/health/metrics/trace correlation/structured logs; Spring Cache/Caffeine/Redisson/two-level consistency/distributed-lock boundaries.

- [ ] **Step 2: Run tests and confirm failure**

Run: `node --test tests/java-course-content.test.mjs --test-name-pattern="backend production topics"`

Expected: FAIL listing seven absent articles.

- [ ] **Step 3: Write the seven articles in dependency order**

Give each public annotation/class/method its own searchable H3 and one-sentence purpose. Identify non-JDK dependencies and versions by stable major/minor policy; do not imply retries are safe for non-idempotent requests or that distributed locks replace database constraints.

- [ ] **Step 4: Run focused tests**

Run: `node --test tests/java-course-content.test.mjs --test-name-pattern="backend production topics|article contract|external API"`

Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add docs/courses/java/14-后端工程 docs/.vitepress/config/java-course.ts tests/java-course-content.test.mjs
git commit -m "docs(java): add production backend practices"
```

### Task 10: Redis Foundations and Core Data Structures

**Files:**
- Create: `docs/courses/java/15-Redis/index.md`
- Create: `docs/courses/java/15-Redis/01-基础连接与数据模型.md`
- Create: `docs/courses/java/15-Redis/02-String与计数器.md`
- Create: `docs/courses/java/15-Redis/03-Hash与对象字段.md`
- Create: `docs/courses/java/15-Redis/04-List-Set与Sorted-Set.md`
- Create: `docs/courses/java/15-Redis/05-Bitmap-HyperLogLog-GEO与Stream.md`
- Modify: `docs/.vitepress/config/java-course.ts`
- Modify: `tests/java-course-roadmap.test.mjs`
- Modify: `tests/java-course-content.test.mjs`

**Interfaces:**
- Consumes: article contract from Task 3.
- Produces: Redis Core fact-source anchors and explicit stable-major/documentation-date metadata.

- [ ] **Step 1: Add failing Redis structure tests**

Require exact files and independent searchable command H3s for connection/model, SET/GET/NX/XX/INCR/MGET/MSET/ranges/bits, HSET/HGET/HMGET/HGETALL/HSCAN, List/Set/Sorted Set queue/set/ranking and blocking boundaries, Bitmap/HyperLogLog/GEO/Stream with precision/capacity/selection guidance.

- [ ] **Step 2: Run tests and confirm failure**

Run: `node --test tests/java-course-roadmap.test.mjs tests/java-course-content.test.mjs --test-name-pattern="Redis core|Redis data structures"`

Expected: FAIL with five missing articles and index.

- [ ] **Step 3: Write the index and five articles**

Use redis-cli examples with explicit initial keys, each state change, final command result, and cleanup. Fold the useful core content from the former backend Redis page into these fact-source pages.

- [ ] **Step 4: Run tests and commit**

Run: `node --test tests/java-course-roadmap.test.mjs tests/java-course-content.test.mjs --test-name-pattern="Redis core|Redis data structures|article contract"`

Expected: PASS.

```bash
git add docs/courses/java/15-Redis docs/.vitepress/config/java-course.ts tests/java-course-roadmap.test.mjs tests/java-course-content.test.mjs
git commit -m "docs(java): add Redis core data structures"
```

### Task 11: Redis Keys, Atomic Workflows, Persistence, and Caching Patterns

**Files:**
- Create: `docs/courses/java/15-Redis/06-Key过期扫描与删除.md`
- Create: `docs/courses/java/15-Redis/07-事务Watch-Pipeline与Lua.md`
- Create: `docs/courses/java/15-Redis/08-持久化内存淘汰与数据安全.md`
- Create: `docs/courses/java/15-Redis/09-缓存穿透击穿雪崩与一致性.md`
- Create: `docs/courses/java/15-Redis/10-发布订阅与Stream消费组.md`
- Modify: `docs/.vitepress/config/java-course.ts`
- Modify: `tests/java-course-content.test.mjs`

**Interfaces:**
- Consumes: Redis Core concepts from Task 10.
- Produces: fact-source anchors for expiration/deletion, transaction/pipeline/Lua, persistence/eviction, cache failure modes, and messaging semantics.

- [ ] **Step 1: Add failing command and safety tests**

Require H3s for EXPIRE/TTL/SCAN/UNLINK and big-key deletion; MULTI/EXEC/WATCH/Pipeline/EVAL with cluster constraints; RDB/AOF/mixed persistence/maxmemory policies/recovery checks; null caching/Bloom/mutex rebuild/jitter/double-delete limits; Pub/Sub versus Streams, XGROUP/XREADGROUP/XACK/XPENDING/retry/idempotency. Require explicit warnings for KEYS, broad DEL, FLUSH*, EVAL, and production recovery operations.

- [ ] **Step 2: Run tests and confirm failure**

Run: `node --test tests/java-course-content.test.mjs --test-name-pattern="Redis key|Redis atomic|Redis persistence|Redis cache failure|Redis messaging"`

Expected: FAIL with five missing articles.

- [ ] **Step 3: Write five articles with failure boundaries**

Show command results and state evolution without presenting Pub/Sub as reliable delivery, Pipeline as atomic, or double deletion as strong consistency.

- [ ] **Step 4: Run tests and commit**

Run: `node --test tests/java-course-content.test.mjs --test-name-pattern="Redis key|Redis atomic|Redis persistence|Redis cache failure|Redis messaging|danger boundary"`

Expected: PASS.

```bash
git add docs/courses/java/15-Redis docs/.vitepress/config/java-course.ts tests/java-course-content.test.mjs
git commit -m "docs(java): add Redis reliability patterns"
```

### Task 12: Redis Locks and Spring Integration

**Files:**
- Create: `docs/courses/java/15-Redis/11-分布式锁租约与Fencing-Token.md`
- Create: `docs/courses/java/15-Redis/12-Spring-Cache与缓存抽象.md`
- Create: `docs/courses/java/15-Redis/13-RedisTemplate序列化与连接管理.md`
- Modify: `docs/courses/java/14-后端工程/19-Spring-Cache-Caffeine与Redisson.md`
- Modify: `docs/.vitepress/config/java-course.ts`
- Modify: `tests/java-course-content.test.mjs`
- Modify: `docs/superpowers/reviews/java-roadmap-technical-review.md`

**Interfaces:**
- Consumes: Redis service semantics from Tasks 10–11.
- Produces: Spring Data Redis API anchors and clear division between Redis Core, Spring cache abstraction, templates, serializers, Lettuce/pools/timeouts, and Redisson.

- [ ] **Step 1: Add failing lock and Spring API tests**

Require SET NX PX/owner token/Lua compare-delete/renewal/fault limits/fencing token; `@Cacheable`, `@CachePut`, `@CacheEvict`, keys/conditions/TTL/self-invocation; StringRedisTemplate/RedisTemplate serializers/Lettuce/pool/timeout/pipelining/exceptions. Require every API heading to include the real name and an observable example.

- [ ] **Step 2: Run tests and confirm failure**

Run: `node --test tests/java-course-content.test.mjs --test-name-pattern="Redis lock|Spring Cache|RedisTemplate"`

Expected: FAIL with three missing articles.

- [ ] **Step 3: Write three articles and deduplicate chapter 14**

Keep server command behavior in chapter 15 and framework selection scenarios in chapter 14. State that a Redis lock cannot by itself prevent stale writers and show fencing-token validation at the protected resource.

- [ ] **Step 4: Record expert review and verify**

Append cache consistency/distributed lock review evidence, then run:

`node --test tests/java-course-content.test.mjs --test-name-pattern="Redis lock|Spring Cache|RedisTemplate|article contract"`

Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add docs/courses/java/15-Redis docs/courses/java/14-后端工程/19-Spring-Cache-Caffeine与Redisson.md docs/.vitepress/config/java-course.ts docs/superpowers/reviews/java-roadmap-technical-review.md tests/java-course-content.test.mjs
git commit -m "docs(java): add Redis locks and Spring integration"
```

### Task 13: Redis Topology, Diagnostics, and Production Completion

**Files:**
- Create: `docs/courses/java/15-Redis/14-主从哨兵与Cluster.md`
- Create: `docs/courses/java/15-Redis/15-性能诊断监控与生产清单.md`
- Modify: `docs/.vitepress/config/java-course.ts`
- Modify: `tests/java-course-roadmap.test.mjs`
- Modify: `tests/java-course-content.test.mjs`
- Modify: `docs/superpowers/reviews/java-roadmap-technical-review.md`

**Interfaces:**
- Consumes: Redis fact-source chapter from Tasks 10–12.
- Produces: complete 15-article Redis chapter and reviewed production boundaries.

- [ ] **Step 1: Add failing topology and diagnostics tests**

Require replication/failover/Sentinel/slots/hash tags/redirection/consistency limits; SLOWLOG/INFO/LATENCY/MEMORY, big/hot-key diagnosis, metrics/alerts/capacity/change checklist. Require dangerous diagnostic/administrative commands to be labeled and bounded.

- [ ] **Step 2: Run tests and confirm failure**

Run: `node --test tests/java-course-roadmap.test.mjs tests/java-course-content.test.mjs --test-name-pattern="Redis topology|Redis diagnostics|Redis inventory"`

Expected: FAIL with two missing articles and incomplete 15-article inventory.

- [ ] **Step 3: Write both articles and complete chapter navigation**

Use state diagrams in prose/tables where exact output is topology-dependent; identify availability versus consistency tradeoffs and avoid implying Sentinel or Cluster provides lossless failover.

- [ ] **Step 4: Record expert review and verify**

Append topology/diagnostic review evidence, then run:

`node --test tests/java-course-roadmap.test.mjs tests/java-course-content.test.mjs --test-name-pattern="Redis topology|Redis diagnostics|Redis inventory|danger boundary"`

Expected: PASS with exactly 15 Redis articles plus index.

- [ ] **Step 5: Commit**

```bash
git add docs/courses/java/15-Redis docs/.vitepress/config/java-course.ts docs/superpowers/reviews/java-roadmap-technical-review.md tests/java-course-roadmap.test.mjs tests/java-course-content.test.mjs
git commit -m "docs(java): complete Redis production chapter"
```

### Task 14: RuoYi Attribution and Official-Common Coverage Baselines

**Files:**
- Create: `scripts/audit-ruoyi-java-apis.mjs`
- Create: `tests/data/ruoyi-external-api-coverage.json`
- Create: `tests/data/official-common-api-coverage.json`
- Create: `tests/fixtures/java-course/invalid-coverage.json`
- Modify: `tests/java-course-content.test.mjs`
- Modify: `package.json`

**Interfaces:**
- Produces: `pnpm audit:java-apis`; each RuoYi record has `symbol`, `frequency`, `classification`, `reason`, `article`, `heading`; each official record has `ecosystem`, `capability`, `source`, `article`, `heading`, `reviewedAt`.
- Consumes: canonical article routes and rendered H3 extraction from existing content tests.

- [ ] **Step 1: Add failing schema, attribution, and denominator tests**

Assert classifications are exactly `direct-searchable`, `covered-by-concept`, or `project-private`; direct entries point to an exact real-name H3 and example; concept entries point to an existing concept H3 with reason; private entries include an exclusion reason. Assert 100% attribution for regenerated external calls, exclude `com.ruoyi.*`/generated/known false positives, and report RuoYi and official coverage separately. Use an invalid fixture that attempts to merge denominators and another whose heading is missing.

- [ ] **Step 2: Run coverage tests and confirm failure**

Run: `node --test tests/java-course-content.test.mjs --test-name-pattern="RuoYi attribution|official common coverage"`

Expected: FAIL because manifests and audit script do not exist.

- [ ] **Step 3: Regenerate and curate the RuoYi audit**

Scan `C:/MyProject/JAVA/learn_ruoyi/RuoYi-Vue`, normalize external symbols, then manually classify scanner ambiguity. Preserve the prior 159-title threshold as a regression subset, but calculate the new denominator from the fresh scan.

- [ ] **Step 4: Create the official-common baseline**

Record selected common JDK 20, MySQL 8.0, stable Redis, Spring, and MyBatis-Plus capabilities with authoritative source URL/section and exact article/H3. The manifest is a reviewed curriculum baseline, not a scraped copy of entire manuals.

- [ ] **Step 5: Run audit and commit**

Run: `corepack pnpm@9.15.9 audit:java-apis`

Expected: exits 0 and prints two distinct totals/percentages, with RuoYi attribution at 100% and official-common uncovered count 0.

Run: `node --test tests/java-course-content.test.mjs --test-name-pattern="external API|RuoYi attribution|official common coverage"`

Expected: PASS.

```bash
git add package.json scripts/audit-ruoyi-java-apis.mjs tests/data tests/fixtures/java-course/invalid-coverage.json tests/java-course-content.test.mjs
git commit -m "test(java): track source and official API coverage"
```

### Task 15: Entry Page, Cross-Link, Redirect, Build, and Deployment QA

**Files:**
- Modify: `docs/courses/java/index.md`
- Modify: `docs/.vitepress/config/java-course.ts`
- Modify: `tests/java-course-roadmap.test.mjs`
- Modify: `tests/open-source-data.test.mjs`
- Modify: `docs/superpowers/reviews/java-roadmap-technical-review.md`

**Interfaces:**
- Consumes: completed manifest, redirect map, content chapters, two coverage reports, and expert review record.
- Produces: release-ready 01–15 learning route and a deployment verification record appended to the review document.

- [ ] **Step 1: Add failing completion tests**

Assert exactly 15 chapter directories; MySQL has 12 articles and Redis 15 (indexes excluded); index/sidebar/manifest share exact order; every canonical and cross-link target exists; titles/routes are unique; no orphan article exists; MyBatis/JDBC/Spring transaction occur after MySQL; Redis occurs after Spring backend; chapter 14 has no old standalone MySQL/Redis page; all redirect artifacts point to built targets. Assert the technical review has separate structural/API and professional-accuracy results.

- [ ] **Step 2: Run completion tests and resolve every failure**

Run: `corepack pnpm@9.15.9 test -- --test-name-pattern="Java roadmap completion|Java links|review evidence"`

Expected: initially FAIL for stale entry copy or links; PASS after updating the index and final cross-links.

- [ ] **Step 3: Run full local verification**

Run: `corepack pnpm@9.15.9 test`

Expected: all tests PASS; report the exact count.

Run: `corepack pnpm@9.15.9 build`

Expected: VitePress build exits 0 after redirect generation.

Run: `git diff --check`

Expected: no whitespace errors.

- [ ] **Step 4: Inspect build output and representative pages**

Serve with `corepack pnpm@9.15.9 preview --host 127.0.0.1 --port 4173`. Verify HTTP 200 and visible ordered sidebar for the Java index, MySQL index, Redis index, and at least eight representative articles covering CRUD, locks, EXPLAIN, JDBC/MyBatis, Redis structures, cache consistency, distributed locks, and Cluster. Verify at least three non-ASCII old URLs automatically replace to their unique targets and retain a clickable fallback.

- [ ] **Step 5: Commit the release-ready course**

```bash
git add docs/courses/java/index.md docs/.vitepress/config/java-course.ts tests/java-course-roadmap.test.mjs tests/open-source-data.test.mjs docs/superpowers/reviews/java-roadmap-technical-review.md
git commit -m "docs(java): finalize ordered backend roadmap"
```

- [ ] **Step 6: Request final code/content review before integration**

Use `superpowers:requesting-code-review`. The reviewer must separately state: structural/API-title coverage result; professional accuracy result for SQL, transactions/locks, cache consistency, distributed locks, topology; redirect/link result; and any blocking findings.

- [ ] **Step 7: Integrate and publish only after review is clean**

Use `superpowers:finishing-a-development-branch`, fast-forward or merge into the intended main checkout without overwriting unrelated files, rerun full test/build/diff checks there, then push the authorized branch.

Expected: GitHub Pages Action succeeds.

- [ ] **Step 8: Verify production**

After the Action is successful, verify production HTTP 200 for the Java index, both new chapter indexes, and the same eight representative articles; verify three old URLs land on their canonical destinations; inspect sidebar 01–15 and representative API headings/examples. Record Action URL, commit SHA, verification time (Asia/Shanghai), URLs, redirect destinations, two coverage percentages, test count, and build result in the review document or publish report.

---

## Self-Review Result

- **Spec coverage:** Tasks 1–15 cover ordering, migration, redirects, 12 MySQL articles, 15 Redis articles, removal of duplicate old pages, all eight mandatory production-topic groups, dual coverage manifests, full QA, build, deployment, and production inspection. Recommended next-stage/non-goal topics remain excluded.
- **Dependency check:** Manifest and quality contracts precede migration/content; MySQL precedes JDBC/MyBatis/Spring boundary edits; Redis Core precedes Spring Redis integration; coverage is regenerated only after content exists; publishing is last.
- **Type/path consistency:** All later tasks consume `JAVA_COURSE_CHAPTERS`; canonical directories are exactly `11-MySQL-8`, `12-工程实践`, `13-设计与项目`, `14-后端工程`, and `15-Redis`; redirect and coverage records use canonical route/H3 strings.
- **Review Focus coverage:** Each of the five high-risk conditions is pinned to a named owning task and test, with expert review evidence kept separate from structural tests.
- **Proportion:** The plan specifies boundaries, paths, tests, commands, and decisions but intentionally omits article prose and full API/command lists beyond acceptance anchors.

