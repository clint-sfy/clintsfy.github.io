# Agent 开发课程 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 将现有 Agent 简介扩展为一套按认知依赖连续学习、以 Python 案例为主、同时可按标题速查并能衔接五个开源项目源码的完整课程。

**Architecture:** 课程采用 01 资源导航、02–10 基础知识、11 源码精读的三级结构。基础文章只依赖本篇或前序文章，统一使用 Python 展示可运行机制；TypeScript 仅在 MCP TypeScript SDK 与 DeepSeek Harness 源码导读中作为必要对照。用 Node 测试扫描 Markdown 元数据、路径、标题、代码契约和学习依赖，再由 VitePress 构建验证页面集成。

**Tech Stack:** VitePress、Markdown、Python 3、Node.js 22.13+、Node Test Runner、pnpm 9.15.9

**Spec:** `docs/superpowers/specs/2026-10-07-agent-development-course-design.md`

## Global Constraints

- 不讲 Java、Python 或 TypeScript 通用语言基础，只讲 Agent 开发必须掌握的知识。
- 02–10 章正文和案例统一使用 Python；TypeScript 仅出现在相关源码导读的必要片段中。
- 每个概念、API、协议操作和错误边界拥有独立 H3，标题优先采用标准术语或真实 API 名。
- 每个代码块前必须有一句用途说明；注释只标注关键输入、状态变化、副作用、安全边界和输出。
- 后一篇只使用本篇或前序文章已解释概念；不可避免的前向引用必须给出最小说明和链接。
- 第一章是随时查阅的资源导航，不是开始第 02 章前必须通读的理论章节。
- 五个源码主线固定为 smolagents、OpenAI Agents SDK、MCP TypeScript SDK、LangGraph、DeepSeek Harness，并按此顺序学习。
- 外部资源优先使用官方仓库、官方文档与原始论文，易变信息标注 `2026-10-07` 查看日期。

## Review Focus

- 学习顺序发生循环依赖时，测试必须指出首次出现的未解释术语及其文章路径。
- Python 示例引用在线模型时必须通过环境变量读取密钥，并给出缺失密钥时的明确失败提示。
- 危险工具、文件、Shell、浏览器和网络操作必须写明权限边界，且示例不得默认执行破坏性操作。
- 外部项目重命名、分支变化或文档迁移不能让站内构建失败；核心链接必须由独立 URL 检查报告标记。
- 自动生成侧边栏必须与首页和章内顺序一致，数字前缀变化不能产生孤立页面或重复入口。

---

### Task 1: 建立 Agent 课程结构和自动化契约

**Files:**
- Create: `tests/agent-course-content.test.mjs`
- Create: `tests/data/agent-course-roadmap.json`
- Modify: `docs/courses/agent/index.md`
- Move: `docs/courses/agent/01-Agent基础/01-Agent系统组成.md` → `docs/courses/agent/02-Agent基础/01-Agent系统组成.md`
- Remove after migration: `docs/courses/agent/02-Tool与MCP/`, `docs/courses/agent/03-Agent-Skills/`, `docs/courses/agent/04-Context与RAG/`, `docs/courses/agent/05-评测与可靠性/`, `docs/courses/agent/06-框架选型/`

**Interfaces:**
- Consumes: `getItems("courses/agent")` 的数字前缀排序行为。
- Produces: `agent-course-roadmap.json` 中的 `chapters[]`、`articles[]`、`introducedTerms[]`、`requiresTerms[]`，供后续所有内容测试使用。

- [ ] **Step 1: 写失败测试**

测试名称：`agent roadmap follows the approved 01-11 order`、`every required term is introduced before use`、`course examples obey the Python-first policy`。断言 11 章目录存在、首页顺序一致、02–10 章无 TypeScript 代码块、每篇 `requiresTerms` 都属于自身或前序 `introducedTerms`。

- [ ] **Step 2: 运行测试并确认失败**

Run: `pnpm test -- --test-name-pattern="agent roadmap|introduced before use|Python-first"`
Expected: FAIL，提示缺少 `tests/data/agent-course-roadmap.json` 或章节不完整。

- [ ] **Step 3: 建立课程清单并迁移现有六篇内容**

在 JSON 中锁定 01–11 章顺序和每篇文章路径；把可复用段落迁移到新位置，删除旧目录前确保没有遗失内容。首页只保留简洁课程说明、学习顺序、前置知识和五个源码项目入口。

- [ ] **Step 4: 运行结构测试**

Run: `pnpm test -- --test-name-pattern="agent roadmap|introduced before use|Python-first"`
Expected: PASS。

- [ ] **Step 5: 提交**

```bash
git add tests/agent-course-content.test.mjs tests/data/agent-course-roadmap.json docs/courses/agent
git commit -m "test(agent): define ordered course contract"
```

### Task 2: 建设第一章项目与知识库导航

**Files:**
- Create: `docs/courses/agent/01-项目与知识库导航/01-学习地图与资源使用方法.md`
- Create: `docs/courses/agent/01-项目与知识库导航/02-Agent框架与运行时.md`
- Create: `docs/courses/agent/01-项目与知识库导航/03-Coding-Agent与Harness.md`
- Create: `docs/courses/agent/01-项目与知识库导航/04-MCP工具Skills与集成.md`
- Create: `docs/courses/agent/01-项目与知识库导航/05-RAG记忆与上下文工程.md`
- Create: `docs/courses/agent/01-项目与知识库导航/06-工作流多Agent评测与可观测性.md`
- Create: `docs/courses/agent/01-项目与知识库导航/07-课程知识库官方文档与论文.md`
- Modify: `tests/data/agent-course-roadmap.json`
- Modify: `tests/agent-course-content.test.mjs`

**Interfaces:**
- Consumes: Task 1 的章节清单。
- Produces: 统一资源记录字段：名称、官方链接、解决问题、推荐学习内容、前置知识、阶段、阅读深度、推荐目录/文章、与 DeepSeek Harness 的对应关系、查看日期。

- [ ] **Step 1: 扩展失败测试**

新增 `every resource record has required learning metadata` 和 `five core projects appear consistently`；断言资源记录字段完整、URL 使用 HTTPS、五个主线名称和链接在首页、第一章和第十一章清单一致。

- [ ] **Step 2: 运行定向测试并确认失败**

Run: `pnpm test -- --test-name-pattern="resource record|five core projects"`
Expected: FAIL，列出缺失页面或字段。

- [ ] **Step 3: 编写分类资源导航**

收录已核实的框架、Coding Agent、MCP、RAG/Memory、Workflow/Multi-Agent、Evals/Tracing、Browser/Sandbox、中英文课程与论文；用“主线精读 / 专题查阅 / 案例参考”标记阅读深度，不用 Star 数作为技术结论。

- [ ] **Step 4: 运行资源测试**

Run: `pnpm test -- --test-name-pattern="resource record|five core projects"`
Expected: PASS。

- [ ] **Step 5: 提交**

```bash
git add docs/courses/agent/01-项目与知识库导航 tests
git commit -m "docs(agent): add project and knowledge resource hub"
```

### Task 3: 编写 Agent、模型消息和 Tool Calling 基础

**Files:**
- Create: `docs/courses/agent/02-Agent基础/02-最小Agent-Loop.md`
- Create: `docs/courses/agent/02-Agent基础/03-停止条件与失败边界.md`
- Create: `docs/courses/agent/02-Agent基础/04-同步异步与流式执行.md`
- Create: `docs/courses/agent/03-模型与消息/01-Model与推理边界.md`
- Create: `docs/courses/agent/03-模型与消息/02-Message与Role.md`
- Create: `docs/courses/agent/03-模型与消息/03-Token上下文窗口与截断.md`
- Create: `docs/courses/agent/03-模型与消息/04-Structured-Output.md`
- Create: `docs/courses/agent/03-模型与消息/05-Streaming与事件.md`
- Create: `docs/courses/agent/04-Tool-Calling与Agent-Loop/01-函数调用与JSON-Schema.md`
- Create: `docs/courses/agent/04-Tool-Calling与Agent-Loop/02-工具注册选择与结果回填.md`
- Create: `docs/courses/agent/04-Tool-Calling与Agent-Loop/03-并行工具与依赖工具.md`
- Create: `docs/courses/agent/04-Tool-Calling与Agent-Loop/04-超时重试幂等与去重.md`
- Create: `docs/courses/agent/04-Tool-Calling与Agent-Loop/05-审批权限与危险操作.md`
- Create: `docs/courses/agent/04-Tool-Calling与Agent-Loop/06-完整可观测Agent-Loop.md`
- Modify: `tests/data/agent-course-roadmap.json`

**Interfaces:**
- Consumes: Task 1 的文章契约。
- Produces: 后续章节共同使用的 Model、Message、ToolCall、ToolResult、RunState、StopReason 术语与 Python 最小实现。

- [ ] **Step 1: 为文章清单补充术语依赖和示例断言**

在 roadmap 中声明每篇引入与依赖术语；测试断言每篇至少包含用途说明、细粒度 H3、Python 代码块、关键状态或输出注释。

- [ ] **Step 2: 编写 02–04 章正文**

每个 API/动作独立 H3；示例从无框架 Python Agent Loop 递进到 schema 校验、工具执行、回填、停止、超时、重试与审批，不要求真实模型密钥即可理解核心循环。

- [ ] **Step 3: 运行内容与依赖测试**

Run: `pnpm test -- --test-name-pattern="agent course|introduced before use"`
Expected: PASS。

- [ ] **Step 4: 提交**

```bash
git add docs/courses/agent/02-Agent基础 docs/courses/agent/03-模型与消息 docs/courses/agent/04-Tool-Calling与Agent-Loop tests/data/agent-course-roadmap.json
git commit -m "docs(agent): add ordered agent loop foundations"
```

### Task 4: 编写状态、MCP 和扩展机制

**Files:**
- Create: `docs/courses/agent/05-状态上下文会话与记忆/01-State与Context.md`
- Create: `docs/courses/agent/05-状态上下文会话与记忆/02-Session生命周期.md`
- Create: `docs/courses/agent/05-状态上下文会话与记忆/03-Checkpoint中断与恢复.md`
- Create: `docs/courses/agent/05-状态上下文会话与记忆/04-上下文压缩与摘要.md`
- Create: `docs/courses/agent/05-状态上下文会话与记忆/05-短期记忆与长期记忆.md`
- Create: `docs/courses/agent/05-状态上下文会话与记忆/06-记忆污染与隔离.md`
- Create: `docs/courses/agent/06-MCP/01-MCP解决什么问题.md`
- Create: `docs/courses/agent/06-MCP/02-Host-Client与Server.md`
- Create: `docs/courses/agent/06-MCP/03-Tools-Resources与Prompts.md`
- Create: `docs/courses/agent/06-MCP/04-stdio与Streamable-HTTP.md`
- Create: `docs/courses/agent/06-MCP/05-初始化能力协商与生命周期.md`
- Create: `docs/courses/agent/06-MCP/06-错误授权与安全边界.md`
- Create: `docs/courses/agent/06-MCP/07-Python实现最小MCP服务.md`
- Create: `docs/courses/agent/07-Skills插件与Hook/01-Skill与渐进式上下文.md`
- Create: `docs/courses/agent/07-Skills插件与Hook/02-Plugin能力注册与生命周期.md`
- Create: `docs/courses/agent/07-Skills插件与Hook/03-Hook拦截器与事件.md`
- Create: `docs/courses/agent/07-Skills插件与Hook/04-能力发现冲突与版本.md`
- Create: `docs/courses/agent/07-Skills插件与Hook/05-Skill-Tool-MCP与Plugin对比.md`
- Modify: `tests/data/agent-course-roadmap.json`

**Interfaces:**
- Consumes: Task 3 的 RunState、ToolCall、ToolResult 和执行边界。
- Produces: Checkpoint、Memory、MCP Capability、Skill、Plugin、Hook 等源码阅读前置术语。

- [ ] **Step 1: 将 05–07 章文章及术语依赖加入 roadmap**

- [ ] **Step 2: 编写状态与恢复文章，示例展示状态变化而非机械逐行注释**

- [ ] **Step 3: 编写 MCP 文章并以 Python SDK 为主案例**

协议字段使用官方名称；TypeScript SDK 仅链接到第十一章源码导读，不在基础章切换示例语言。

- [ ] **Step 4: 编写 Skill、Plugin 与 Hook 文章并明确四者边界**

- [ ] **Step 5: 运行测试并提交**

Run: `pnpm test -- --test-name-pattern="agent course|introduced before use|Python-first"`
Expected: PASS。

```bash
git add docs/courses/agent/05-状态上下文会话与记忆 docs/courses/agent/06-MCP docs/courses/agent/07-Skills插件与Hook tests/data/agent-course-roadmap.json
git commit -m "docs(agent): add state MCP and extension foundations"
```

### Task 5: 编写 RAG、Workflow、Evals 和安全工程

**Files:**
- Create: `docs/courses/agent/08-RAG与上下文工程/01-RAG管线与适用边界.md`
- Create: `docs/courses/agent/08-RAG与上下文工程/02-Ingestion解析与清洗.md`
- Create: `docs/courses/agent/08-RAG与上下文工程/03-Chunking与元数据.md`
- Create: `docs/courses/agent/08-RAG与上下文工程/04-Embedding与向量检索.md`
- Create: `docs/courses/agent/08-RAG与上下文工程/05-关键词混合检索与过滤.md`
- Create: `docs/courses/agent/08-RAG与上下文工程/06-Rerank引用与上下文组装.md`
- Create: `docs/courses/agent/08-RAG与上下文工程/07-检索评测与生成评测.md`
- Create: `docs/courses/agent/09-工作流规划与多Agent/01-Workflow与状态机.md`
- Create: `docs/courses/agent/09-工作流规划与多Agent/02-Planning与Plan-and-Execute.md`
- Create: `docs/courses/agent/09-工作流规划与多Agent/03-Router与Handoff.md`
- Create: `docs/courses/agent/09-工作流规划与多Agent/04-Supervisor与Multi-Agent.md`
- Create: `docs/courses/agent/09-工作流规划与多Agent/05-Interrupt审批与恢复.md`
- Create: `docs/courses/agent/09-工作流规划与多Agent/06-并发竞态与失败传播.md`
- Create: `docs/courses/agent/10-评测可观测性与安全/01-Trace-Span与事件日志.md`
- Create: `docs/courses/agent/10-评测可观测性与安全/02-Dataset与回归评测.md`
- Create: `docs/courses/agent/10-评测可观测性与安全/03-确定性断言与LLM-as-Judge.md`
- Create: `docs/courses/agent/10-评测可观测性与安全/04-Guardrail输入输出与工具校验.md`
- Create: `docs/courses/agent/10-评测可观测性与安全/05-Prompt-Injection与数据泄露.md`
- Create: `docs/courses/agent/10-评测可观测性与安全/06-Sandbox最小权限与审计.md`
- Create: `docs/courses/agent/10-评测可观测性与安全/07-生产故障模式与排查顺序.md`
- Modify: `tests/data/agent-course-roadmap.json`

**Interfaces:**
- Consumes: Task 3–4 的 Agent Loop、State、Tool、Memory 和 MCP 边界。
- Produces: 五个源码项目导读共同使用的检索、图工作流、评测、追踪、安全与恢复术语。

- [ ] **Step 1: 将 08–10 章文章和依赖加入 roadmap**

- [ ] **Step 2: 编写可本地运行的 RAG 最小管线**

用小型内存语料展示切分、关键词/向量接口、融合、重排和引用；不要求外部向量数据库或在线服务。

- [ ] **Step 3: 编写 Workflow、Planning 和 Multi-Agent**

先单 Agent 状态机，再 Router/Handoff，最后 Supervisor；明确多 Agent 的成本和不适用条件。

- [ ] **Step 4: 编写 Evals、Tracing、Guardrails 和安全**

分别评测检索、工具轨迹和最终回答；危险操作示例使用模拟执行或显式审批。

- [ ] **Step 5: 运行测试并提交**

Run: `pnpm test -- --test-name-pattern="agent course|introduced before use|danger"`
Expected: PASS。

```bash
git add docs/courses/agent/08-RAG与上下文工程 docs/courses/agent/09-工作流规划与多Agent docs/courses/agent/10-评测可观测性与安全 tests/data/agent-course-roadmap.json
git commit -m "docs(agent): add retrieval workflow and reliability foundations"
```

### Task 6: 编写五个项目源码精读主线

**Files:**
- Create: `docs/courses/agent/11-源码精读/01-smolagents源码导读.md`
- Create: `docs/courses/agent/11-源码精读/02-OpenAI-Agents-SDK源码导读.md`
- Create: `docs/courses/agent/11-源码精读/03-MCP-TypeScript-SDK源码导读.md`
- Create: `docs/courses/agent/11-源码精读/04-LangGraph源码导读.md`
- Create: `docs/courses/agent/11-源码精读/05-DeepSeek-Harness源码导读.md`
- Create: `docs/courses/agent/11-源码精读/06-五个项目架构对照.md`
- Modify: `tests/data/agent-course-roadmap.json`

**Interfaces:**
- Consumes: 02–10 章全部已定义术语。
- Produces: 每个项目的前置知识、仓库结构、阅读顺序、符号索引、最小调用链、项目对照和版本风险。

- [ ] **Step 1: 为五个项目建立官方来源和版本快照**

只以官方仓库、官方文档、源码和发布说明为事实来源，记录查看日期、默认分支和开发阶段。

- [ ] **Step 2: 编写四个基础项目导读**

按 smolagents → OpenAI Agents SDK → MCP TypeScript SDK → LangGraph 排列；TypeScript 片段旁只解释当前 Agent 抽象和必要语法差异。

- [ ] **Step 3: 编写 DeepSeek Harness 导读**

覆盖 Agent Driver、Everything is a Plugin、Cordis、Session、Skill、Hook、事件与 SDK 调用链，并明确开发者预览和破坏性变化风险。

- [ ] **Step 4: 编写架构对照并运行一致性测试**

Run: `pnpm test -- --test-name-pattern="five core projects|source guide"`
Expected: PASS。

- [ ] **Step 5: 提交**

```bash
git add docs/courses/agent/11-源码精读 tests/data/agent-course-roadmap.json
git commit -m "docs(agent): add five source study guides"
```

### Task 7: 集成导航、运行示例并完成发布验证

**Files:**
- Modify: `docs/courses/agent/index.md`
- Modify if required by rendering defects: `docs/.vitepress/theme/styles/markdown.scss`
- Modify: `tests/agent-course-content.test.mjs`
- Create: `.agent-course-publish-report.md`

**Interfaces:**
- Consumes: Task 1–6 的完整课程树。
- Produces: 可发布 VitePress 站点、验证报告和线上抽查记录。

- [ ] **Step 1: 增加完整链接、锚点、顺序和危险示例测试**

测试覆盖首页/侧边栏/roadmap 一致性、Markdown 站内链接、五个主线入口、缺失用途说明、密钥字面量、危险操作警告和 TypeScript 越界。

- [ ] **Step 2: 执行 Python 示例验证**

将无需网络和密钥的代码块提取到临时目录运行；需要模型的代码执行语法检查并验证存在环境变量保护。不得修改正文来掩盖失败，应修复示例本身。

- [ ] **Step 3: 运行全部测试与构建**

Run: `pnpm test`
Expected: 全部 PASS。

Run: `pnpm build`
Expected: VitePress build 成功，无 dead link 或 Markdown 错误。

- [ ] **Step 4: 启动预览并抽查关键页面**

Run: `pnpm preview --host 127.0.0.1`
Expected: `/courses/agent/`、第一章导航、Python MCP 示例、RAG、Evals、五个源码导读均可打开；侧边栏按 01–11 排序且上一篇/下一篇连续。

- [ ] **Step 5: 写发布报告并提交**

报告记录测试、构建、抽查路径、外部核心链接检查日期和已知的上游版本风险。

```bash
git add docs/courses/agent tests/agent-course-content.test.mjs tests/data/agent-course-roadmap.json .agent-course-publish-report.md
git commit -m "docs(agent): complete ordered Python-first course"
```

- [ ] **Step 6: 推送并确认 GitHub Actions 部署**

Run: `git push origin main`
Expected: 推送成功，GitHub Pages workflow 对该提交返回 success；生产站点抽查首页、资源导航、基础文章和 DeepSeek Harness 导读均显示新内容。

