---
title: Agent 框架与运行时
author: 阿源
date: 2026/10/07 00:00
categories: [Agent 开发]
tags: [Agent, Runtime, Framework]
status: 预览版导航
---

# Agent 框架与运行时

这一页解决“先看哪个运行时”的问题。阅读顺序是：先用 smolagents 建立最小 loop，再看 OpenAI Agents SDK 如何托管常见运行时能力，随后用 Responses API 理解更低层的自主管理边界，最后用 LangGraph 观察显式状态图如何承载长流程。不要先背框架 API；先回到 [02 Agent 基础](/courses/agent/02-Agent基础/01-Agent系统组成) 的 Model、Tools、State 和 StopReason。

## smolagents

官方入口：[GitHub](https://github.com/huggingface/smolagents) · [官方文档](https://huggingface.co/docs/smolagents/)

- **解决的问题**：用很少的抽象搭建可读的 Agent Loop、工具和代码执行 Agent。
- **推荐学习内容**：先运行一个本地、只读工具，再阅读 Agent 与 CodeAgent 的循环、停止和执行器边界。
- **前置知识**：Python 函数与异常处理；已理解 Agent Loop、Tool 的直觉。
- **学习阶段**：入门。
- **阅读深度**：主线精读。
- **推荐目录/文章**：README 的核心抽象、`docs/source/en/tutorials/overview.mdx`、`src/smolagents/agents.py`。
- **与 DeepSeek Harness 对应关系**：Agent Loop、Tool 与 CodeAgent 对应 dsh 的 Agent Driver、工具插件和执行沙箱边界；两者不是 API 等价。
- **查看日期**：2026-10-07。

## OpenAI Agents SDK

官方入口：[GitHub](https://github.com/openai/openai-agents-python) · [官方文档](https://openai.github.io/openai-agents-python/)

- **解决的问题**：把 Agent、工具、handoff、guardrail、session 和 tracing 组合成可观测运行时。
- **推荐学习内容**：按 Quickstart → Agents → Running agents → Handoffs → Guardrails → Tracing 阅读，比较托管 Runner 与自建循环。
- **前置知识**：Python 类型标注和数据校验的基本概念；第 02–04 章。
- **学习阶段**：进阶。
- **阅读深度**：主线精读。
- **推荐目录/文章**：Quickstart、Agents、Running agents、Tracing。
- **与 DeepSeek Harness 对应关系**：Agent/Runner、handoff 和 tracing 对应 dsh 的 driver、插件协作和事件流；session 的持久化语义需分别核对。
- **查看日期**：2026-10-07。

## OpenAI Responses API

官方入口：[Agents 指南](https://platform.openai.com/docs/guides/agents) · [Responses API](https://platform.openai.com/docs/api-reference/responses)

- **解决的问题**：在需要自主管理模型请求、工具循环和状态时提供较低层的 Agent 原语。
- **推荐学习内容**：查 function calling、streaming 和 conversation state，理解何时把 loop 责任留在应用层。
- **前置知识**：第 02–04 章；HTTP JSON API 基础。
- **学习阶段**：进阶。
- **阅读深度**：专题查阅。
- **推荐目录/文章**：Agents guide、Tools、Conversation state、Streaming events。
- **与 DeepSeek Harness 对应关系**：Responses turn 与 tool result 可映射到 dsh 的 driver turn 和事件记录，但 Responses API 不等同于插件架构。
- **查看日期**：2026-10-07。

## LangGraph

官方入口：[GitHub](https://github.com/langchain-ai/langgraph) · [Python 文档](https://docs.langchain.com/oss/python/langgraph/)

- **解决的问题**：用显式 State、Node、Edge、checkpoint 和 interrupt 编排长流程、恢复与人工介入。
- **推荐学习内容**：先做单 Agent StateGraph，再阅读 checkpointer、interrupt、durable execution 和多 Agent 路由。
- **前置知识**：第 02–05、09 章；Python 状态机思维。
- **学习阶段**：进阶。
- **阅读深度**：主线精读。
- **推荐目录/文章**：Graph API、Persistence / Checkpointers、Interrupts、Durable execution。
- **与 DeepSeek Harness 对应关系**：State/checkpoint/interrupt 对应 dsh 的 Session、Hook 和可恢复事件；图节点并不等于 dsh plugin。
- **查看日期**：2026-10-07。

## 选型检查表

1. 如果只有一个短循环和少量确定性工具，先保留 Python 函数和显式状态，不急着引入框架。
2. 如果需要标准化 handoff、guardrail、session 或 tracing，阅读 OpenAI Agents SDK 的运行时职责。
3. 如果流程有长时间等待、多个分支、人工介入或恢复要求，阅读 LangGraph 的 checkpoint 和 interrupt 语义。
4. 如果要研究插件化 Coding Agent，跳到 [Coding Agent 与 Harness](/courses/agent/01-项目与知识库导航/03-Coding-Agent与Harness) 和最后的 DeepSeek Harness 导读。
