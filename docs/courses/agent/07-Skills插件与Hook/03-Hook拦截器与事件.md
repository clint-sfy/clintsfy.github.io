---
title: Hook、拦截器与事件
author: 阿源
date: 2026/10/07 00:00
categories: [Agent 开发]
tags: [Hook, Event, Plugin]
status: 大纲骨架
chapter: 07
---

# Hook、拦截器与事件

本篇用于建立「Hook、拦截器与事件」在 Agent 系统中的基本边界。学完后知道它解决什么问题、如何与前后组件衔接，以及实现时需要关注的关键约束。

## 前置知识

- [Plugin 能力注册与生命周期](./02-Plugin能力注册与生命周期)、第 04 章的 Trace 和 Audit。

## 知识点

1. `Hook` 与 `Interceptor`。
2. `EventBus`、payload 和关联 id。
3. 拦截、拒绝、修改和旁路记录。
4. 事件错误、重入和顺序。

> 当前状态：大纲骨架，仅列出学习范围，不包含正文、代码或已验证结论。
