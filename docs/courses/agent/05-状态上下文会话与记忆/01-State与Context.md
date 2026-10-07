---
title: State 与 Context
author: 阿源
date: 2026/10/07 00:00
categories: [Agent 开发]
tags: [State, Context, Memory]
status: 大纲骨架
chapter: 05
---

# State 与 Context

本篇用于建立「State 与 Context」在 Agent 系统中的基本边界。学完后知道它解决什么问题、如何与前后组件衔接，以及实现时需要关注的关键约束。

## 前置知识

- 第 02–04 章的 Run、Message、ToolCall、ToolResult 和 Trace。

## 知识点

1. `StateOwnership` 与状态所有者。
2. `ContextProjection` 与最小输入。
3. 运行态、会话态和持久化态。
4. 状态变更、来源和审计。

> 当前状态：大纲骨架，仅列出学习范围，不包含正文、代码或已验证结论。
