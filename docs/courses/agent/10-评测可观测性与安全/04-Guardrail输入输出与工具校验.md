---
title: Guardrail、输入输出与工具校验
author: 阿源
date: 2026/10/07 00:00
categories: [Agent 开发]
tags: [Guardrail, Validation, Safety]
status: 大纲骨架
chapter: 10
---

# Guardrail、输入输出与工具校验

本篇用于建立「Guardrail、输入输出与工具校验」在 Agent 系统中的基本边界。学完后知道它解决什么问题、如何与前后组件衔接，以及实现时需要关注的关键约束。

## 前置知识

- [确定性断言与 LLM-as-Judge](./03-确定性断言与LLM-as-Judge)、第 04 章的 ToolCall/Permission。

## 知识点

1. `InputGuardrail`。
2. `OutputGuardrail`。
3. `ToolValidation`、schema 和 capability。
4. 失败、升级人工和恢复。

> 当前状态：大纲骨架，仅列出学习范围，不包含正文、代码或已验证结论。
