---
title: MCP、Tools、Skills 与集成
author: 阿源
date: 2026/10/07 00:00
categories: [Agent 开发]
tags: [MCP, Tools, Skills, Plugin]
status: 预览版导航
---

# MCP、Tools、Skills 与集成

这一页刻意把四个容易混淆的词拆开：Tool 是一次可调用能力，MCP 是连接应用与外部能力的协议，Skill 是完成一类任务的方法和上下文，Plugin 是宿主可装配的扩展单元。先读 [04 Tool Calling](/courses/agent/04-Tool-Calling与Agent-Loop/01-函数调用与JSON-Schema)，再按协议、实现和工作方法进入以下资源。

本页以 **MCP 2026-07-28 规范**为协议基线；实现优先看官方 TypeScript SDK v2 与当前官方 Python SDK。旧 v1 教程、包名和初始化/会话假设只作为迁移对照，不作为新示例的默认写法。

## MCP TypeScript SDK

官方入口：[GitHub](https://github.com/modelcontextprotocol/typescript-sdk) · [官方 TypeScript SDK v2 文档](https://ts.sdk.modelcontextprotocol.io/v2/) · [2026-07-28 适配说明](https://ts.sdk.modelcontextprotocol.io/v2/migration/support-2026-07-28)

- **解决的问题**：用官方 SDK 实现 MCP Client/Server、tools/resources/prompts、传输和授权。
- **推荐学习内容**：先阅读 v2 Server tutorial，再按 Client、transport、capability、错误和 2026-07-28 适配说明查阅；旧 `@modelcontextprotocol/sdk` v1 包结构只用于迁移对照。
- **前置知识**：MCP 的 Host/Client/Server 模型；只需能读懂当前 TypeScript 类型和异步调用。
- **学习阶段**：进阶。
- **阅读深度**：主线精读。
- **推荐目录/文章**：v2 十分钟 Server tutorial、2026-07-28 适配说明、`packages/server`、`packages/client`、`examples`。
- **与 DeepSeek Harness 对应关系**：MCP capability、transport 和 tool result 对应 dsh 的能力插件与外部工具边界；协议连接不等于内部插件生命周期。
- **查看日期**：2026-10-07。

## MCP Python SDK

官方入口：[GitHub](https://github.com/modelcontextprotocol/python-sdk) · [官方文档](https://py.sdk.modelcontextprotocol.io/) · [迁移指南](https://py.sdk.modelcontextprotocol.io/migration/)

- **解决的问题**：用当前官方 Python SDK 构建 MCP Server/Client，并覆盖 tools、resources、prompts 与标准 transport。
- **推荐学习内容**：按当前官方文档的 Get started → Servers → Clients → Protocol versions 阅读，案例默认使用当前 `mcp` 包和 Python 3.10+；旧 v1 教程的导入路径、FastMCP/Server 结构和 session/initialize 假设需逐项对照迁移指南。
- **前置知识**：第 02–06 章的 Agent Loop、Tool、JSON-RPC、transport 和授权边界；Python 异步基础。
- **学习阶段**：进阶。
- **阅读深度**：运行实验。
- **推荐目录/文章**：Installation、First steps、Testing、Servers/Tools、Clients、Protocol versions、Migration Guide。
- **与 DeepSeek Harness 对应关系**：Python SDK 的 Server/Client 与 transport 对应 dsh 外部能力插件边界；SDK 不替代 dsh 的审批、沙箱和事件审计。
- **查看日期**：2026-10-07。

## MCP Specification（2026-07-28）

官方入口：[Model Context Protocol Specification 2026-07-28](https://modelcontextprotocol.io/specification/2026-07-28) · [规范仓库](https://github.com/modelcontextprotocol/modelcontextprotocol)

- **解决的问题**：定义跨 Host、Client、Server 的消息、能力、资源、工具、提示、传输和生命周期契约。
- **推荐学习内容**：按 Architecture → Base Protocol → Server/Client Features → Extensions → Security 阅读；以 2026-07-28 规范为准，旧版本只用于迁移对照。
- **前置知识**：JSON-RPC 基本概念；第 06 章。
- **学习阶段**：进阶。
- **阅读深度**：主线精读。
- **推荐目录/文章**：Architecture、Base Protocol、Server Features、Client Features、Extensions、Security。
- **与 DeepSeek Harness 对应关系**：MCP 能力协商与授权是 dsh 接入外部工具时的协议边界，不替代 dsh 内部插件注册与事件生命周期。
- **查看日期**：2026-10-07。

## MCP 官方服务器集合

官方入口：[GitHub](https://github.com/modelcontextprotocol/servers)

- **解决的问题**：提供可运行的 MCP Server 实例，用于观察 tool schema、资源暴露、错误和权限。
- **推荐学习内容**：选择一个无敏感数据的本地 server 运行，检查 README、schema、权限与日志；不要默认启用有写权限的服务。
- **前置知识**：MCP Host/Client/Server；本地进程和权限基础。
- **学习阶段**：入门。
- **阅读深度**：运行实验。
- **推荐目录/文章**：README、filesystem server、每个 server 的安全说明、测试用例。
- **与 DeepSeek Harness 对应关系**：可把 server 视作 dsh 的外部工具插件，比较进程边界、schema、授权和审计责任。
- **查看日期**：2026-10-07。

## Agent Skills Specification

官方入口：[Specification](https://agentskills.io/specification) · [首页](https://agentskills.io/)

- **解决的问题**：约定如何以渐进式上下文包装可复用任务能力、脚本、资源和验证步骤。
- **推荐学习内容**：先读 frontmatter、目录布局、渐进加载和脚本边界，再对比 Skill、Tool、MCP、Plugin 的职责。
- **前置知识**：Markdown frontmatter；第 07 章。
- **学习阶段**：进阶。
- **阅读深度**：专题查阅。
- **推荐目录/文章**：Specification、What are skills?、Writing skills、Security considerations。
- **与 DeepSeek Harness 对应关系**：Skill 的渐进式上下文与验证步骤对应 dsh Skill 插件，加载和生命周期仍以 dsh 源码为准。
- **查看日期**：2026-10-07。

## 一次集成的检查顺序

1. 先写 Tool schema 和本地确定性实现，确认输入、输出、错误与幂等边界。
2. 再用 MCP 暴露能力，明确 Host/Client/Server 及 transport；敏感 HTTP 能力另做授权和 token audience 校验。
3. 用 Skill 写任务方法和渐进式上下文，不把密钥、账号、偶然环境状态写进 Skill。
4. 宿主需要热插拔、生命周期和事件拦截时，再引入 Plugin/Hook；把工具结果当不可信数据处理。
