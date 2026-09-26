# Java 基础笔记收口与发布实施计划

> 本计划已按最终范围更新：本次只发布第 01–06 章 19 篇文章。第 07–12 章的 13 篇正文保持原样并延期，不把历史上的后续批次当成本次交付。

**Goal:** 将第 01–06 章的 19 篇文章整理为适合初学、速查和日常复习的 JDK 20 系列笔记，保持现有 URL 与导航不变，完成全量验证和线上发布。

**Architecture:** 质量测试固定 33 个 Markdown、32 篇文章的路径基线，同时只对第 01–06 章执行结构、案例、问答和版本质量门槛；第 07–12 章只做未被本次提交修改的范围审计。入口页和本规范/计划文件明确延期边界，最终通过 VitePress 构建、Git 推送和线上 HTTP 抽查。

**Tech Stack:** Markdown、VitePress、Vue、Node.js、`node:test`、pnpm、GitHub/Vercel 既有部署流程。

**Spec:** `docs/superpowers/specs/2026-09-26-java-notes-completion-design.md`

## Global Constraints

- 本次完成范围只有 `docs/courses/java/01-Java基础` 至 `06-函数式与时间`，共 19 篇；第 07–12 章正文不修改。
- 全系列以 JDK 20 为基准，不使用 JDK 20 之后才提供且未说明的 API。
- 已完成文章必须按“专业术语→白话解释与边界→简单案例→易混点→课后小问→本节小结→快速回顾”组织；每道课后小问附简洁答案和解析。
- 第 01–06 章不含 Markdown/Unicode checkbox、实践任务、练习题、旧复习清单或占位正文；第 07–12 章不因本次范围而顺手清理这些旧结构。
- 不改名、不移动 `docs/courses/java/` 下现有 12 个章节目录和 32 篇文章，不改变页面 URL。
- 不修改站点主题、侧栏逻辑、依赖版本或部署配置。
- `switch` 模式匹配、record patterns 等预览特性在编译和运行两侧都使用 `--enable-preview`，编译固定带 `--release 20`；孵化 API 使用对应 `--add-modules`。
- 案例保持最小且可观察，不扩张成框架教程。

## Review Focus

- 第 01–06 章是否先使用准确术语，再以初学者能理解的语言说明用途与边界。
- Java 案例是否可在声明的 JDK 20 模式下编译运行，且结果可观察、没有依赖未说明的上下文。
- 易混点是否用直接结论说清概念差异和选择边界；课后小问是否每题紧跟答案和解析。
- preview/incubator 特性是否在编译和运行两侧给出正确参数，并清楚说明非稳定状态。
- 批量编辑后文章数量、路径、frontmatter、入口链接与第 07–12 章正文是否保持兼容/不变。

---

### Task 1: 建立 Java 内容质量门槛 — 已完成

**Files:** `tests/java-course-content.test.mjs`

**Result:** 测试保留全课程路径/frontmatter 基线，对第 01–06 章执行文章结构、可运行案例、问答答案/解析、JDK 20 版本边界和禁用内容检查。历史提交：`4dfc14e5a`、`5f8c8b48e`。

### Task 2: 补齐第 01–06 章语言基础 — 已完成

**Files:** `docs/courses/java/01-Java基础` 至 `docs/courses/java/06-函数式与时间`

**Result:** 4 篇基准文章和 15 篇数组、文本、面向对象、现代类型、泛型、集合、函数式与时间文章完成模板统一、案例和问答审阅。历史提交：`334f8316d`、`18f28eeb4`、`cd311c5d6`。

### Task 3: 第 07–10 章运行时与并发 — 延期，未执行

原计划的第 07–10 章扩写因范围裁剪取消。本次不修改 I/O、网络、反射、模块、并发或 JVM 正文；这些 10 篇文章保留现状，未来另立任务。

### Task 4: 第 11–12 章工程实践与综合设计 — 延期，未执行

原计划的第 11–12 章扩写因范围裁剪取消。本次不修改工程实践、JDBC、设计与项目正文；这 3 篇文章保留现状。入口页、规范和计划的最终范围文案由 Task 5 收口。

### Task 5: 全量审阅、构建与发布 — 已完成

**Files:**

- Modify: `docs/courses/java/index.md`
- Modify: `docs/superpowers/specs/2026-09-26-java-notes-completion-design.md`
- Modify: `docs/superpowers/plans/2026-09-26-java-notes-completion.md`
- Verify: `docs/courses/java/01-Java基础` through `06-函数式与时间`
- Verify only: `docs/courses/java/07-IO与网络` through `12-设计与项目`
- Report: `.superpowers/sdd/java-notes-completion/task-5-report.md`

验收记录由报告保存，步骤如下：

1. 运行 `node --loader ./tests/typescript-loader.mjs --test tests/java-course-content.test.mjs`，确认 7/7 Java 内容测试通过。
2. 运行 `corepack pnpm@9.15.9 test`，确认 Java 内容测试全部通过；记录唯一既有导航视觉断言失败为 baseline，不修改主题/CSS。
3. 运行 `corepack pnpm@9.15.9 build`，确认 exit 0 并检查 Java 页面构建产物。
4. 运行 `git diff --check`，检查提交范围只包括入口/规范/计划/报告及既有 01–06 历史提交；确认 07–12 正文、主题、侧栏、依赖、部署配置均未改动。
5. 以 `docs: finalize Java fundamentals guide` 提交 Task 5 改动，将隔离分支提交按历史顺序快进合并到 `main`，推送 `main`，等待既有 GitHub/Vercel 部署成功。
6. 请求线上入口和至少 8 个代表页面 HTTP 200，确认“课后小问”“快速回顾”及答案/解析可见；确认 01–06 页面没有旧 checkbox、实践任务或面试常问文案，并在报告写入 URL、最终 commit 和部署证据。

**Final status:** 以 `task-5-report.md` 的真实命令输出、合并/推送记录和线上抽查为准；若部署失败，只允许在本次范围内修复后重新执行步骤 1–6。
