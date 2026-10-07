---
title: Workflow、Multi-Agent、Evals 与 Tracing
author: 阿源
date: 2026/10/07 00:00
categories: [Agent 开发]
tags: [Workflow, Multi-Agent, Evals, Tracing, Browser, Sandbox]
status: 预览版导航
---

# Workflow、Multi-Agent、Evals 与 Tracing

这一页把“怎么编排”“怎么观测”“怎么执行”放在同一张地图里。先用单 Agent 状态机表达流程，再决定是否需要多 Agent；先记录可审计 trace，再谈 LLM-as-Judge；先在无登录本地页面或临时 sandbox 中实验，再接入浏览器和代码执行。

## CrewAI

官方入口：[文档](https://docs.crewai.com/) · [GitHub](https://github.com/crewAIInc/crewAI)

- **解决的问题**：提供 role/task/crew/flow 等多 Agent 编排方式，便于比较协作抽象与显式状态机。
- **推荐学习内容**：先理解单 Agent 和确定性 Workflow，再阅读 delegation、state、guardrail 和 observability；不要默认多 Agent 更好。
- **前置知识**：第 02、05、09 章。
- **学习阶段**：进阶。
- **阅读深度**：案例参考。
- **推荐目录/文章**：Agents、Tasks、Flows、Guardrails、Observability。
- **与 DeepSeek Harness 对应关系**：Crew/Flow 的协作层与 dsh 插件协作对照，但 dsh 的核心可组合性来自 Cordis plugin context。
- **查看日期**：2026-10-07。

## AutoGen

官方入口：[稳定版文档](https://microsoft.github.io/autogen/stable/) · [GitHub](https://github.com/microsoft/autogen)

- **解决的问题**：展示消息驱动的多 Agent 对话、团队、工具和可扩展运行时。
- **推荐学习内容**：阅读 agent protocol、team runtime、termination 和 intervention，比较消息图与状态图的故障边界。
- **前置知识**：Message、Role、State；第 03、09 章。
- **学习阶段**：进阶。
- **阅读深度**：案例参考。
- **推荐目录/文章**：AgentChat、Core、Teams、Termination。
- **与 DeepSeek Harness 对应关系**：Agent message/runtime 可与 dsh 事件系统和插件协作对照，不等同于 Cordis 生命周期。
- **查看日期**：2026-10-07。

## OpenAI Evals

官方入口：[GitHub](https://github.com/openai/evals)

- **解决的问题**：为模型和 Agent 建立数据集、评测模板、可复现运行和回归对比。
- **推荐学习内容**：先以确定性 parser/schema 测试起步，再把工具轨迹和最终答案分层纳入数据集。
- **前置知识**：第 04、10 章；测试断言与 JSONL 基础。
- **学习阶段**：生产工程。
- **阅读深度**：专题查阅。
- **推荐目录/文章**：evals registry、sample evals、model graded evals、CLI。
- **与 DeepSeek Harness 对应关系**：评测输入、轨迹和结果对应 dsh 的 session/event 记录，适合验证 driver 与插件回归。
- **查看日期**：2026-10-07。

## LangSmith Tracing

官方入口：[Observability 文档](https://docs.langchain.com/langsmith/observability) · [Tracing 文档](https://docs.langchain.com/langsmith/observability-concepts)

- **解决的问题**：记录运行、节点、工具和模型调用的 trace/span，定位 Agent 失败与成本。
- **推荐学习内容**：先掌握 trace/span/event 的数据模型，再比较采样、敏感字段脱敏和离线评测关联。
- **前置知识**：第 09、10 章；事件日志和指标基础。
- **学习阶段**：生产工程。
- **阅读深度**：专题查阅。
- **推荐目录/文章**：Observability、Tracing、Datasets、Online evaluations。
- **与 DeepSeek Harness 对应关系**：trace/span 可映射到 dsh event bus 和 driver 轨迹，但需自行审计敏感工具参数。
- **查看日期**：2026-10-07。

## Arize Phoenix

官方入口：[GitHub](https://github.com/Arize-ai/phoenix) · [文档](https://arize.com/docs/phoenix)

- **解决的问题**：提供开放式 LLM/Agent tracing、评测和本地观测界面。
- **推荐学习内容**：用本地示例观察 span 属性、检索/生成评测和敏感数据配置，不把展示结果当作正确性证明。
- **前置知识**：Trace、Span、RAG eval；第 08、10 章。
- **学习阶段**：生产工程。
- **阅读深度**：案例参考。
- **推荐目录/文章**：OpenTelemetry tracing、evaluators、RAG analysis、self-hosting。
- **与 DeepSeek Harness 对应关系**：OpenTelemetry span 可承载 dsh driver、plugin 和 tool event 的跨层观测。
- **查看日期**：2026-10-07。

## Browser Use

官方入口：[GitHub](https://github.com/browser-use/browser-use) · [文档](https://docs.browser-use.com/)

- **解决的问题**：展示让 Agent 观察和操作真实浏览器的状态、动作、工具与执行环境。
- **推荐学习内容**：先用无登录、无写入的本地页面实验，阅读浏览器 session、动作确认、超时和权限；真实账号必须隔离。
- **前置知识**：Tool Calling、State、Guardrail；第 04、10 章。
- **学习阶段**：生产工程。
- **阅读深度**：案例参考。
- **推荐目录/文章**：quickstart、browser session、agent actions、security and deployment。
- **与 DeepSeek Harness 对应关系**：浏览器动作可视作 dsh tool plugin；权限、审批、session 隔离和审计不能交给模型默认决定。
- **查看日期**：2026-10-07。

## Playwright

官方入口：[入门文档](https://playwright.dev/docs/intro) · [浏览器文档](https://playwright.dev/docs/browsers)

- **解决的问题**：提供可重复的浏览器控制和测试基础，让 Agent 浏览器工具有确定性执行层。
- **推荐学习内容**：先掌握 locator、context、timeouts、tracing 和无头运行，再阅读 Agent 如何生成受控动作。
- **前置知识**：Python 函数、异常和测试；浏览器基础。
- **学习阶段**：入门。
- **阅读深度**：专题查阅。
- **推荐目录/文章**：Library、Browser contexts、Auto-waiting、Trace viewer。
- **与 DeepSeek Harness 对应关系**：Playwright context 是 dsh 浏览器插件可拥有的隔离资源；Harness 仍负责授权与审批。
- **查看日期**：2026-10-07。

## E2B Code Interpreter

官方入口：[GitHub](https://github.com/e2b-dev/E2B) · [文档](https://e2b.dev/docs)

- **解决的问题**：提供临时隔离执行环境，帮助理解 Agent 生成代码与宿主文件系统的安全边界。
- **推荐学习内容**：重点读 sandbox 生命周期、网络/文件权限、超时和清理；危险代码只在受控测试数据中运行。
- **前置知识**：Tool、Sandbox、最小权限；第 04、10 章。
- **学习阶段**：生产工程。
- **阅读深度**：案例参考。
- **推荐目录/文章**：sandbox lifecycle、filesystem、network controls、timeouts and cleanup。
- **与 DeepSeek Harness 对应关系**：Sandbox 是 dsh 执行插件的隔离实现，不能由 `LocalPythonExecutor` 等 best-effort 模式替代。
- **查看日期**：2026-10-07。

## 统一的观测字段

无论选择哪个框架或服务，至少为每次 run 保存输入摘要、模型/配置版本、session id、每个 tool call 的参数和结果、状态转移、重试、人工介入、停止原因、token/延迟/成本以及最终产物验证结果。文件、Shell、浏览器、网络和外发动作要单独记录权限和审批。
