# Agent 开发课程设计

## 1. 目标

将现有 `docs/courses/agent/` 下的六篇简介扩展为一套可持续查阅的 Agent 开发课程。学习者完成基础部分后，应能读懂主流 Agent 框架的关键抽象，并按顺序阅读 DeepSeek Harness 及其对照项目源码。

课程同时承担两个用途：

1. **速查**：通过细粒度标题快速定位概念、API、协议、设计边界与常见失败。
2. **源码学习**：通过五个主线项目建立从最小 Agent Loop 到插件化 Harness 的完整理解。

## 2. 读者与学习结果

面向已有 Python 基础编程能力，但需要系统补齐 Agent 工程的学习者。不要求事先掌握 LangChain 或任何特定供应商 SDK。Java、Python 和 TypeScript 的通用语言基础不属于本课程；阅读项目源码确实遇到语言障碍时，再回到对应语言课程单独补充。

完成后应当能够：

- 用 Python 实现最小可观测 Agent Loop。
- 说清 Model、Instructions、Tools、State、Context、Session、Memory 的边界。
- 区分 Function Calling、MCP、Skill 和 Plugin。
- 设计可中断、恢复、审批和追踪的工作流。
- 建立现代 RAG 管线，并分别评测检索和生成。
- 识别无限循环、提示注入、越权工具、脏状态、重试风暴和记忆污染。
- 阅读 smolagents、OpenAI Agents SDK、MCP TypeScript SDK、LangGraph 和 DeepSeek Harness 的核心源码。

## 3. 信息架构

### 3.1 第一章：项目与知识库导航

第一章是长期维护的可点击资源库，不限于五个主线项目。资源按以下类别组织：

- Agent 框架与运行时。
- Coding Agent 与 Harness。
- MCP、Tools、Skills 与集成。
- RAG、Memory 与 Context Engineering。
- Workflow、Planning 与 Multi-Agent。
- Evals、Tracing 与可观测性。
- Browser Agent、Sandbox 与执行环境。
- 中英文课程、知识库、官方协议与关键论文。

每条资源至少包含：

- 项目或文章名称。
- GitHub、官方文档或原文链接。
- 解决的问题和推荐学习内容。
- 需要的前置知识。
- 建议阅读阶段：入门、进阶或生产工程。
- 学习方式：通读、精读、查阅或运行实验。
- 推荐阅读目录或文章。
- 与 DeepSeek Harness 中某个概念的对应关系。

资源库不复制项目 README 的宣传文字，不以 Star 数代替技术评价。易变信息标明查看日期。

### 3.2 基础速查章节

基础内容必须按认知依赖排列，支持从第 02 章开始逐篇连续阅读。每篇文章只能直接使用本篇已经解释或前序文章已经解释的术语；不可避免地引用后续主题时，必须给出一句最小说明并链接到后续文章。第一章是可随时打开的资源导航，不要求在开始基础课程前通读。

| 章 | 主题 | 核心范围 |
| --- | --- | --- |
| 02 | Agent 基础 | 系统组成、最小闭环、停止条件、执行模式 |
| 03 | 模型与消息 | Message、Role、Token、Streaming、Structured Output、Reasoning 边界 |
| 04 | Tool Calling 与 Agent Loop | Schema、调用、结果回填、并行工具、超时、重试、幂等 |
| 05 | State、Context、Session 与 Memory | 状态所有权、持久化、恢复、压缩、短期/长期记忆 |
| 06 | MCP | Host/Client/Server、Tools/Resources/Prompts、Transport、生命周期、授权与安全 |
| 07 | Skills、Plugin 与 Hook | 能力封装、渐进式上下文、插件生命周期、拦截与事件 |
| 08 | RAG 与 Context Engineering | Ingestion、Chunking、Embedding、Hybrid Search、Rerank、Citation、检索评测 |
| 09 | Workflow、Planning 与 Multi-Agent | State Machine、Plan-and-Execute、Handoff、Supervisor、中断恢复 |
| 10 | Evals、Tracing、Guardrails 与安全 | Trace、Dataset、Judge、确定性校验、权限、注入、Sandbox |

同一章内同样遵循“概念 → 最小实现 → 常用能力 → 状态与异常 → 工程边界”的顺序。课程首页和每章导读都应标明前置章节、当前学习目标和下一步，避免学习者依赖侧边栏猜测顺序。

### 3.3 源码精读主线

第十一章包含五个项目，按认知依赖排序：

1. **Hugging Face smolagents**：最小 Agent Loop、Tool、Code Agent、停止与执行。
2. **OpenAI Agents SDK**：Agent、Runner、Handoff、Guardrail、Session 与 Tracing。
3. **MCP TypeScript SDK**：Client、Server、Transport、Capability 和协议错误。
4. **LangGraph**：State、Node、Edge、Checkpoint、Interrupt 与 Durable Execution。
5. **DeepSeek Harness**：Agent Driver、Plugin、Session、Skill、Hook、事件系统和 Cordis。

每个项目不仅提供 README 摘要，而是提供：

- 开始前必须掌握的基础知识。
- 仓库结构与核心包责任。
- 推荐的源码阅读顺序。
- 重要类、函数、事件和数据结构索引。
- 一条可运行的最小调用链。
- 与其他四个项目的设计对照。
- 版本、开发阶段和可能的破坏性变化警告。

## 4. 文章编写契约

文章沿用 Java 速查笔记的可检索结构：

- 一个概念、API、协议操作或错误边界使用一个 H3。
- H3 优先使用真实 API 名或标准术语，不用“其他用法”等空泛标题。
- 代码前必须有一句说明“它做什么、什么时候用”。
- 常用用法给出小而完整的 Python 案例；不常用用法也保留独立标题和最小例子。
- 注释只解释关键输入、状态变化、非显然副作用、安全边界和最终输出。
- 输出注释单独一行，不对每行代码做机械复述。
- 基础概念给出专业术语、白话解释、最小案例和易混点。
- 不设练习题；可以使用“课后小问”形式给出带解析的概念检查。
- 任何安全敏感、版本敏感或容易被误解为强保证的内容，都必须明确边界。

## 5. 语言与代码策略

- Agent 基础章节的正文与可运行案例统一使用 Python，包括 Agent Loop、Tool Calling、MCP、RAG、Memory、Workflow 和 Evals。
- 不在 Agent 课程内重复讲 Java、Python 或 TypeScript 的通用语法和标准库基础。
- MCP TypeScript SDK 与 DeepSeek Harness 源码导读可以保留必要的 TypeScript 代码片段，但必须同时说明它对应的 Agent 概念；只补充读懂当前片段所需的最小说明，不扩展成 TypeScript 基础教程。
- 框架示例与“不依赖框架的核心机制”分开。
- 不为了展示 API 而引入不必要的在线服务或密钥。
- 可纯本地演示的状态机、检索、解析、校验和评测必须可独立运行。
- 必须调用模型的例子使用显式的环境变量与失败提示，不记录真实密钥。

## 6. 资源选择和更新规则

资源收录优先级：

1. 协议、项目或库的官方仓库和官方文档。
2. 有实际实现、测试、架构文档和可重现案例的活跃项目。
3. 内容可验证、来源可追溯的课程或知识库。

不收录仅有链接堆积、无法核对技术内容、过度营销或长期无维护的项目。第一章允许收录多于五个项目，但必须用“主线精读”、“专题查阅”、“案例参考”标记阅读深度。

## 7. 导航和页面行为

- `/courses/agent/` 展示完整路线、章节数量和五个主线项目。
- 第一章必须从 Agent 首页和侧边栏的第一项直接进入。
- 侧边栏保持 01–11 依赖顺序，同一章内文章按数字前缀排序。
- 首页、侧边栏、章内上一篇/下一篇导航必须表达相同的逐篇学习顺序。
- 项目卡片与资源表格中的外部链接可直接点击，站内概念指向对应速查文章。
- 不在侧边栏为每一个外部项目展开过深层级；资源详情由第一章页面承担。

## 8. 质量门禁

自动化检查至少覆盖：

- 章节目录、Agent 首页和侧边栏的顺序一致。
- 每篇文章的前置概念只引用本篇或前序文章，学习顺序不存在未解释的循环依赖。
- 文章路径、站内链接和本地锚点存在。
- 第一章的资源记录包含必填字段和可访问 URL。
- 五个主线项目在资源库、首页和源码精读章中一致。
- 新文章的 H3 标题、用途说明、代码块、关键状态注释和输出契约。
- 代码块不包含真实凭据，危险工具操作有明确警告和权限边界。
- 资源库的查看日期、主线标记和项目名称可检查。
- VitePress 构建成功，首页、资源导航、基础文章和五个源码页面可访问。

## 9. 非目标

- 不复制五个上游项目的全部 API 文档。
- 不将 Star 数、排行或“最好”作为稳定事实写入核心知识文章。
- 不在本轮实现可托管的 Agent 服务、向量数据库、模型网关或在线评测平台。
- 不把 Multi-Agent 宣传为默认或必然更好的方案。
- 不将 DeepSeek Harness 开发者预览阶段的内部接口写成永久稳定契约。

## 10. 验收标准

1. Agent 首页呈现 01–11 完整学习路线。
2. 第一章提供分类、可点击、有学习建议的项目与文章导航。
3. 五个主线项目均有独立源码导读页，且 DeepSeek Harness 排在最后。
4. 基础章节可单独速查，不依赖某个框架才能理解。
5. 从第 02 章第一篇开始按上一篇/下一篇连续阅读时，不会先遇到尚未解释且无最小说明的基础术语。
6. 基础章节的 Python 例子符合文章契约，可本地验证的例子全部通过；TypeScript 仅出现在对应源码导读的必要片段中。
7. 所有站内链接、锚点、外部核心链接、侧边栏和构建通过验证。
8. 技术审查分别给出结构/可检索性和 Agent 专业准确性结果。
