---
title: Model 与推理边界
author: 阿源
date: 2026/10/07 00:00
categories: [Agent 开发]
tags: [Model, Inference]
status: 大纲骨架
chapter: 03
---

# Model 与推理边界

本篇用于建立「Model 与推理边界」在 Agent 系统中的基本边界。学完后知道它解决什么问题、如何与前后组件衔接，以及实现时需要关注的关键约束。

## 前置知识

- 第 02 章的 Agent Loop、State、Context 和 StopReason。

## 知识点

1. `Model`、`ModelAdapter` 与 `InferenceBoundary`。
2. 指令、上下文和模型输出的责任边界。
3. 能力、版本、延迟和费用的记录方式。
4. 失败重试前的错误分类。

> 当前状态：大纲骨架，仅列出学习范围，不包含正文、代码或已验证结论。
