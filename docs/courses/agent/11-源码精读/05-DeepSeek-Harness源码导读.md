---
title: DeepSeek Harness 源码导读
author: 阿源
date: 2026/10/07 00:00
categories: [Agent 开发]
tags: [DeepSeek Harness, Cordis, Source Reading]
status: 大纲骨架
chapter: 11
---

# DeepSeek Harness 源码导读

本篇用于建立「DeepSeek Harness 源码导读」在 Agent 系统中的基本边界。学完后知道它解决什么问题、如何与前后组件衔接，以及实现时需要关注的关键约束。

## 前置知识

- 第 02–10 章全部术语，以及前四个项目的对照问题。

## 知识点

1. 官方仓库、运行入口和安全说明。
2. `AgentDriver`、`PluginContext` 与 Cordis。
3. `Session`、`SkillRuntime`、`HookRuntime`。
4. 事件、工具、审批、测试和最小调用链。

> 当前状态：大纲骨架，仅列出学习范围，不包含正文、代码或已验证结论。
