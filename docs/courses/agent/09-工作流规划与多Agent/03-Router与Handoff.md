---
title: Router 与 Handoff
author: 阿源
date: 2026/10/07 00:00
categories: [Agent 开发]
tags: [Router, Handoff]
status: 大纲骨架
chapter: 09
---

# Router 与 Handoff

本篇用于建立「Router 与 Handoff」在 Agent 系统中的基本边界。学完后知道它解决什么问题、如何与前后组件衔接，以及实现时需要关注的关键约束。

## 前置知识

- [Planning 与 Plan-and-Execute](./02-Planning与Plan-and-Execute)、第 03 章的 Message/Role。

## 知识点

1. `Router`、`RouteCondition`。
2. `Handoff` 的输入和输出。
3. 上下文裁剪、权限和循环防护。
4. 回退、取消和事件记录。

> 当前状态：大纲骨架，仅列出学习范围，不包含正文、代码或已验证结论。
