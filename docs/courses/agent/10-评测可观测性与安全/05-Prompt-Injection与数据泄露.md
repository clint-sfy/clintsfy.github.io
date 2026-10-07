---
title: Prompt Injection 与数据泄露
author: 阿源
date: 2026/10/07 00:00
categories: [Agent 开发]
tags: [Security, Prompt Injection, Data Leakage]
status: 大纲骨架
chapter: 10
---

# Prompt Injection 与数据泄露

本篇用于建立「Prompt Injection 与数据泄露」在 Agent 系统中的基本边界。学完后知道它解决什么问题、如何与前后组件衔接，以及实现时需要关注的关键约束。

## 前置知识

- [Guardrail、输入输出与工具校验](./04-Guardrail输入输出与工具校验)、第 06 章的 MCPResource 和第 05 章的 Memory。

## 知识点

1. `PromptInjection` 与 `IndirectInjection`。
2. `DataExfiltration` 的路径。
3. `Taint`、来源和不可信指令。
4. 外发动作、审批和事件响应。

> 当前状态：大纲骨架，仅列出学习范围，不包含正文、代码或已验证结论。
