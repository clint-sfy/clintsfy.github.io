---
title: 函数调用与 JSON Schema
author: 阿源
date: 2026/10/07 00:00
categories: [Agent 开发]
tags: [Tool Calling, JSON Schema]
status: 大纲骨架
chapter: 04
---

# 函数调用与 JSON Schema

本篇用于建立「函数调用与 JSON Schema」在 Agent 系统中的基本边界。学完后知道它解决什么问题、如何与前后组件衔接，以及实现时需要关注的关键约束。

## 前置知识

- 第 03 章的 Message、Structured Output、SchemaValidation。
- 第 02 章的 Tools、Action 和 StopReason。

## 知识点

1. `ToolCalling`、`JSONSchema` 和 `ToolDefinition`。
2. 参数校验、默认值和拒绝。
3. `ToolCall` 的 id、名称和参数。
4. 结构化调用进入 Agent Loop 的边界。

> 当前状态：大纲骨架，仅列出学习范围，不包含正文、代码或已验证结论。
