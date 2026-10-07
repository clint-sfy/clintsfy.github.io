---
title: Message 与 Role
author: 阿源
date: 2026/10/07 00:00
categories: [Agent 开发]
tags: [Message, Role]
status: 大纲骨架
chapter: 03
---

# Message 与 Role

本篇用于建立「Message 与 Role」在 Agent 系统中的基本边界。学完后知道它解决什么问题、如何与前后组件衔接，以及实现时需要关注的关键约束。

## 前置知识

- [Model 与推理边界](./01-Model与推理边界) 的输入输出责任。

## 知识点

1. `Message` 与 `Role`。
2. 系统规则、用户目标和模型输出。
3. `ToolMessage`、结果来源与不可信内容。
4. 消息历史的顺序、关联和审计。

> 当前状态：大纲骨架，仅列出学习范围，不包含正文、代码或已验证结论。
