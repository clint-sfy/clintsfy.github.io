---
title: Streaming 与事件
author: 阿源
date: 2026/10/07 00:00
categories: [Agent 开发]
tags: [Streaming, Events]
status: 大纲骨架
chapter: 03
---

# Streaming 与事件

本篇用于建立「Streaming 与事件」在 Agent 系统中的基本边界。学完后知道它解决什么问题、如何与前后组件衔接，以及实现时需要关注的关键约束。

## 前置知识

- [Token、上下文窗口与截断](./03-Token上下文窗口与截断)、[Structured Output](./04-Structured-Output) 和第 02 章的 EventStream。

## 知识点

1. `Delta`、`ModelEvent` 和 `EventStream`。
2. 工具调用事件与最终 `ToolResult`。
3. `Usage`、结束事件和错误事件。
4. 断线、取消、重连和重复事件。

> 当前状态：大纲骨架，仅列出学习范围，不包含正文、代码或已验证结论。
