---
title: stdio 与 Streamable HTTP
author: 阿源
date: 2026/10/07 00:00
categories: [Agent 开发]
tags: [MCP, Transport, HTTP]
status: 大纲骨架
chapter: 06
---

# stdio 与 Streamable HTTP

本篇用于建立 MCP 在 Agent 系统中的一个实现边界。学完后知道本主题的协议角色、生命周期、传输或安全约束，并能把它映射回第 06 章的 Python-first 案例。

## 前置知识

- [Host、Client 与 Server](./02-Host-Client与Server)、[工具资源与提示](./03-Tools-Resources与Prompts) 和第 04 章的 Timeout。

## 知识点

1. `StdioTransport`。
2. `StreamableHTTP`。
3. `Transport` 错误、超时与重连。
4. 网络、授权和日志边界。

> 当前状态：大纲骨架，仅列出学习范围，不包含正文、代码或已验证结论。
