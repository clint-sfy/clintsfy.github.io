---
title: Token、上下文窗口与截断
author: 阿源
date: 2026/10/07 00:00
categories: [Agent 开发]
tags: [Token, Context, Budget]
status: 大纲骨架
chapter: 03
---

# Token、上下文窗口与截断

本篇用于建立「Token、上下文窗口与截断」在 Agent 系统中的基本边界。学完后知道它解决什么问题、如何与前后组件衔接，以及实现时需要关注的关键约束。

## 前置知识

- [Message 与 Role](./02-Message与Role) 的消息顺序和 [Model 与推理边界](./01-Model与推理边界)。

## 知识点

1. `Token` 和 `ContextWindow`。
2. 输入/输出预算与 `Usage`。
3. `Truncation`、摘要和显式状态。
4. 超预算、降级和失败提示。

> 当前状态：大纲骨架，仅列出学习范围，不包含正文、代码或已验证结论。
