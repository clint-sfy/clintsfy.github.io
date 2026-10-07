---
title: Structured Output
author: 阿源
date: 2026/10/07 00:00
categories: [Agent 开发]
tags: [Structured Output, Schema]
status: 大纲骨架
chapter: 03
---

# Structured Output

本篇用于建立「Structured Output」在 Agent 系统中的基本边界。学完后知道它解决什么问题、如何与前后组件衔接，以及实现时需要关注的关键约束。

## 前置知识

- [Message 与 Role](./02-Message与Role) 和 [Token、上下文窗口与截断](./03-Token上下文窗口与截断)。

## 知识点

1. `StructuredOutput` 与 `JSONSchema`。
2. `SchemaValidation` 的成功与失败。
3. 解析重试与幂等边界。
4. 结构化字段进入工具调用前的权限校验。

> 当前状态：大纲骨架，仅列出学习范围，不包含正文、代码或已验证结论。
