---
title: 确定性断言与 LLM-as-Judge
author: 阿源
date: 2026/10/07 00:00
categories: [Agent 开发]
tags: [Evals, Judge, Assertions]
status: 大纲骨架
chapter: 10
---

# 确定性断言与 LLM-as-Judge

本篇用于建立「确定性断言与 LLM-as-Judge」在 Agent 系统中的基本边界。学完后知道它解决什么问题、如何与前后组件衔接，以及实现时需要关注的关键约束。

## 前置知识

- [Dataset 与回归评测](./02-Dataset与回归评测)、第 03 章的 StructuredOutput。

## 知识点

1. `DeterministicAssertion`。
2. `LLMJudge`、`Rubric` 和评分理由。
3. 轨迹/答案/安全分层。
4. judge 校准、抽样和人工复核。

> 当前状态：大纲骨架，仅列出学习范围，不包含正文、代码或已验证结论。
