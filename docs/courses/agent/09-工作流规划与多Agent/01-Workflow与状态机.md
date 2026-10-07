---
title: Workflow 与状态机
author: 阿源
date: 2026/10/07 00:00
categories: [Agent 开发]
tags: [Workflow, State Machine]
status: 大纲骨架
chapter: 09
---

# Workflow 与状态机

本篇用于建立「Workflow 与状态机」在 Agent 系统中的基本边界。学完后知道它解决什么问题、如何与前后组件衔接，以及实现时需要关注的关键约束。

## 前置知识

- 第 02–08 章的 State、Checkpoint、Tool、Memory 和 RAG。

## 知识点

1. `Workflow` 和 `StateMachine`。
2. `Node`、`Edge` 和条件转移。
3. 终点、错误边和恢复。
4. 工具副作用、审批和可重放。

> 当前状态：大纲骨架，仅列出学习范围，不包含正文、代码或已验证结论。
