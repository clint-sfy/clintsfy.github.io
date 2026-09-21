---
title: MCP 为什么重要
author: 阿源
date: 2026/09/21 12:00
categories: [Agent 开发]
tags: [Agent, MCP]
---

# MCP 为什么重要

Model Context Protocol（MCP）为 AI 应用连接工具和数据源提供统一协议。它解决的不是模型推理，而是“能力如何被发现、描述、调用和隔离”。

## 核心角色

- **Host**：承载用户体验与权限边界的 AI 应用。
- **Client**：Host 内与某个 MCP Server 保持连接的一侧。
- **Server**：向客户端暴露 tools、resources 和 prompts。

## 学习重点

1. JSON-RPC 消息与生命周期；
2. stdio 与远程传输的差别；
3. tool schema、结构化结果与错误模型；
4. resources 与 tools 的边界；
5. 用户授权、最小权限、超时、重试和审计；
6. 不可信工具结果不能被当作系统指令。

MCP 不等于 Agent。它是 Agent 访问能力的一条标准化通道；任务规划、状态管理和可靠性仍然属于 Agent 应用本身。

参考：[Model Context Protocol 官方文档](https://modelcontextprotocol.io/)
