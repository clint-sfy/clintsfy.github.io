# Java 基础笔记补齐实施计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 将 Java 课程的 32 篇文章补齐为适合初学、速查和日常复习的 JDK 20 系列笔记，并保持现有 URL 与导航不变。

**Architecture:** 先用只读内容测试固定统一模板和版本边界，再按 02–06、07–10、11–12 三批扩写正文；每批独立测试、审阅和提交。最后统一更新入口文案、执行全量构建、推送并验证线上静态页面。

**Tech Stack:** Markdown、VitePress、Node.js、`node:test`、pnpm、GitHub/Vercel 既有部署流程。

**Spec:** `docs/superpowers/specs/2026-09-26-java-notes-completion-design.md`

## Global Constraints

- 全系列以 JDK 20 为基准，不使用 JDK 20 之后才提供的 API。
- 每篇必须包含专业术语、白话解释、至少一个简单 Java 案例、易混点、易错点、本节小结和普通列表式快速回顾。
- 删除课程文章中的 Markdown/Unicode checkbox、实践任务和练习题，不提供不可持久化的交互假象。
- 不改名、不移动 `docs/courses/java/` 下现有 12 个章节目录和 32 篇文章，不改变页面 URL。
- 不修改站点主题、侧栏逻辑和依赖版本。
- `switch` 模式匹配、record patterns、虚拟线程在编译和运行两侧都使用 `--enable-preview`，编译固定带 `--release 20`；结构化并发使用 `--add-modules jdk.incubator.concurrent`，若同时使用预览语法再叠加 `--enable-preview`，不得混淆 preview 与 incubator。
- 案例保持最小且可观察，不扩张成 Spring 或其他框架教程。
- Sol 仅负责计划、技术决策和验收；Luna 5.6 极高负责执行，Luna 不可用时由 Terra 5.6 中等接替。

## Review Focus

- 基础概念是否先使用准确术语，再以初学者能理解的语言说明用途与边界。
- Java 案例是否可在声明的 JDK 20 模式下编译运行，且结果可观察、没有依赖未说明的上下文。
- 易混点是否用直接结论说清概念差异和选择边界，而不是写成问答题库或只罗列 API。
- preview/incubator 特性是否在编译和运行两侧都给出正确参数，并清楚说明非稳定状态。
- 批量编辑后文章数量、路径、frontmatter 与入口链接是否仍保持兼容。

---

### Task 1: 建立 Java 内容质量门槛

**Files:**
- Create: `tests/java-course-content.test.mjs`
- Reference: `tests/open-source-data.test.mjs`
- Reference: `docs/courses/java/**/*.md`

**Interfaces:**
- Consumes: 设计规范中的统一文章模板、32 篇文章清单和 JDK 20 约束。
- Produces: `pnpm test` 可执行的课程内容检查，后续三个正文批次均以此为验收门槛。

- [ ] **Step 1: 编写结构与禁用内容测试**

新增测试并断言：33 个 Markdown、32 篇课程文章、12 个章节；逐篇 frontmatter 存在 `title`、`description`、`category`、`tags`；正文包含“学习目标”“核心知识点”“简单案例”“易混点”“易错点”“本节小结”“快速回顾”和至少一个非空 `java` 代码块；课程目录不含 checkbox、`实践任务`、`练习题`或明显占位标记。失败信息必须包含相对文件路径和规则名。

- [ ] **Step 2: 编写版本与链接一致性测试**

检查入口页阶段链接和文章相对链接均指向存在的路径；文件路径集合与当前基线一致；JDK 20 preview/incubator 文章包含对应的成对命令和状态说明。

- [ ] **Step 3: 运行测试并记录预期红灯**

Run: `corepack pnpm@9.15.9 test`

Expected: 新测试因 28 篇提纲正文、旧 checkbox/实践任务而失败；现有测试仍通过。保存失败文件清单作为后续批次输入。

- [ ] **Step 4: 提交测试基线**

```powershell
git add tests/java-course-content.test.mjs
git commit -m "test: define Java course content standards"
```

### Task 2: 补齐第 01–06 章语言基础

**Files:**
- Modify: `docs/courses/java/01-Java基础/*.md`
- Modify: `docs/courses/java/02-数组与文本/*.md`
- Modify: `docs/courses/java/03-面向对象/*.md`
- Modify: `docs/courses/java/04-现代Java类型/*.md`
- Modify: `docs/courses/java/05-泛型与集合/*.md`
- Modify: `docs/courses/java/06-函数式与时间/*.md`
- Test: `tests/java-course-content.test.mjs`

**Interfaces:**
- Consumes: Task 1 的质量检查；设计规范第 4–6 节的文章模板与最低覆盖点。
- Produces: 4 篇统一格式的基准文章和 15 篇完整的数组、OOP、现代类型、集合、函数式与时间文章。

- [ ] **Step 1: 统一前 4 篇基准文章**

保留已有解释、表格和案例，补齐“易混点”“易错点”和“快速回顾”，删除复选框与任务式表达；避免重复讲解方法和重载。

- [ ] **Step 2: 扩写第 02–04 章**

逐篇落实规范中的数组/文本/常用类、OOP、record/sealed/异常覆盖点。每个核心概念使用“准确术语 → 白话边界 → 一个最小案例”的顺序；record patterns 案例注明 JDK 20 preview 命令。

- [ ] **Step 3: 扩写第 05–06 章**

补齐泛型、集合、Map、Lambda、Stream 和时间 API；案例分别覆盖 PECS、集合选择、频次统计、函数组合、流式聚合和带时区转换。

- [ ] **Step 4: 运行批次测试并修正**

Run: `corepack pnpm@9.15.9 test`

Expected: 第 01–06 章全部通过内容规则；第 07–12 章仍以明确文件路径失败。

- [ ] **Step 5: 人工审阅专业准确性与案例简洁度**

逐篇确认术语、白话解释、案例结果和易混点相互一致，没有大型示例、题库式问答或重复堆砌。

- [ ] **Step 6: 提交第一批正文**

```powershell
git add docs/courses/java/01-Java基础 docs/courses/java/02-数组与文本 docs/courses/java/03-面向对象 docs/courses/java/04-现代Java类型 docs/courses/java/05-泛型与集合 docs/courses/java/06-函数式与时间
git commit -m "docs: complete Java language fundamentals"
```

### Task 3: 补齐第 07–10 章运行时与并发

**Files:**
- Modify: `docs/courses/java/07-IO与网络/*.md`
- Modify: `docs/courses/java/08-反射与模块/*.md`
- Modify: `docs/courses/java/09-并发编程/*.md`
- Modify: `docs/courses/java/10-JVM/*.md`
- Test: `tests/java-course-content.test.mjs`

**Interfaces:**
- Consumes: Task 1 的质量检查和 Task 2 建立的写作基准。
- Produces: 10 篇完整的 I/O、网络、反射、模块、并发和 JVM 笔记。

- [ ] **Step 1: 扩写 I/O、网络、反射与模块**

补齐字符集、资源关闭、Path/Files、HTTP Client 超时、运行时注解、模块可见性与反射开放边界；所有案例都说明失败路径。

- [ ] **Step 2: 扩写线程、并发工具和 JMM**

用最小案例说明任务执行、取消/关闭、同步工具、竞态、happens-before、volatile 和安全发布；“易混点”明确原子性、可见性和有序性的区别。

- [ ] **Step 3: 扩写虚拟线程与 JVM**

区分虚拟线程 preview 和结构化并发 incubator 命令；说明 pinning 与外部资源限流。JVM 文章以证据驱动方式介绍内存、类加载、GC 和诊断，避免给出无条件调优结论。

- [ ] **Step 4: 运行批次测试并修正**

Run: `corepack pnpm@9.15.9 test`

Expected: 第 01–10 章通过内容规则；仅第 11–12 章仍失败。

- [ ] **Step 5: 提交第二批正文**

```powershell
git add docs/courses/java/07-IO与网络 docs/courses/java/08-反射与模块 docs/courses/java/09-并发编程 docs/courses/java/10-JVM
git commit -m "docs: complete Java runtime and concurrency notes"
```

### Task 4: 补齐工程实践、综合设计与入口页

**Files:**
- Modify: `docs/courses/java/11-工程实践/*.md`
- Modify: `docs/courses/java/12-设计与项目/*.md`
- Modify: `docs/courses/java/index.md`
- Test: `tests/java-course-content.test.mjs`

**Interfaces:**
- Consumes: Task 1 的质量检查和前两批写作基准。
- Produces: 完整的工程实践与设计文章，以及与新模板一致的课程入口说明。

- [ ] **Step 1: 扩写 Maven、测试、日志与 JDBC**

使用最小 `pom.xml`、JUnit 5 测试和安全日志案例说明工程边界；使用转账事务案例说明参数绑定、提交/回滚、隔离级别和资源生命周期。

- [ ] **Step 2: 扩写设计原则与综合复习**

围绕一个小型订单/库存场景解释 SOLID 和常见模式，只使用能降低具体耦合的模式；串联测试、日志、事务、并发与 JVM 观测，但不扩张成框架项目。

- [ ] **Step 3: 更新课程入口文案**

删除“实践任务/练习”承诺，改为说明“专业术语、白话解释、简单案例、易混点和快速回顾”；保持阶段、链接和进阶出口不变。

- [ ] **Step 4: 运行完整内容测试**

Run: `corepack pnpm@9.15.9 test`

Expected: 所有测试通过，0 failures。

- [ ] **Step 5: 提交第三批正文**

```powershell
git add docs/courses/java/11-工程实践 docs/courses/java/12-设计与项目 docs/courses/java/index.md
git commit -m "docs: complete Java engineering study guide"
```

### Task 5: 全量审阅、构建与发布

**Files:**
- Verify: `docs/courses/java/**/*.md`
- Verify: `tests/java-course-content.test.mjs`
- Verify: `docs/.vitepress/dist/courses/java/**`

**Interfaces:**
- Consumes: Tasks 1–4 的文章、测试和提交。
- Produces: 通过全量验证并在线可访问的 Java 笔记版本。

- [ ] **Step 1: 执行全量质量扫描**

Run: `corepack pnpm@9.15.9 test`

Expected: 全部测试通过，0 failures。

Run: `rg -n --glob '*.md' '^- \[[ xX]\]|☐|☑|## 实践任务|## 练习题' docs/courses/java`

Expected: 无匹配。

- [ ] **Step 2: 构建静态站点**

Run: `corepack pnpm@9.15.9 build`

Expected: exit code 0；入口页、12 章和 32 篇文章均生成静态页面。

- [ ] **Step 3: 检查 Git 与构建产物**

Run: `git diff --check`

Expected: 无错误。确认没有改动主题、依赖、侧栏或部署配置；抽查数组/String、异常、泛型、并发/JMM、虚拟线程、JVM、JDBC 和综合设计页面。

- [ ] **Step 4: 独立整体验收**

由未参与正文编写的审阅 Agent 对照规范检查专业准确性、JDK 20 兼容、案例简洁度、易混点辨析质量和文件范围。Critical/Important 问题必须修复并重新验证。

- [ ] **Step 5: 推送并等待部署**

推送当前分支到既有远端；检查 GitHub/Vercel 部署状态直到成功。若部署失败，定位根因、修复、重新运行测试和构建后再推送。

- [ ] **Step 6: 验证线上页面**

请求课程入口与至少八个代表页面，确认 HTTP 200、标题/侧栏存在、新“快速回顾”可见、旧 checkbox/实践任务不存在；将线上 URL、最终 commit 和部署状态写入报告。
