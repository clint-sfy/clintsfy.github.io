---
title: Trace、Span 与事件日志
author: 阿源
date: 2026/10/07 00:00
categories: [Agent 开发]
tags: [Evals, Tracing, Observability]
status: 大纲骨架
chapter: 10
---

# Trace、Span 与事件日志

本篇用于建立「Trace、Span 与事件日志」在 Agent 系统中的基本边界。学完后知道它解决什么问题、如何与前后组件衔接，以及实现时需要关注的关键约束。

## 前置知识

- 第 02–09 章的 loop、workflow、tool、checkpoint 和 failure。

## 知识点

1. `TraceSpan`、`EventLog` 和 `CorrelationId`。
2. span 层级、时间和状态。
3. 工具参数、脱敏和审计。
4. 从事件轨迹定位一次失败。

> 当前状态：大纲骨架，仅列出学习范围，不包含正文、代码或已验证结论。
