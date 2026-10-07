---
title: 最小 Agent Loop
author: 阿源
date: 2026/10/07 00:00
categories: [Agent 开发]
tags: [Agent, Loop, Python]
status: 大纲骨架
chapter: 02
---

# 最小 Agent Loop

本篇用于建立「最小 Agent Loop」在 Agent 系统中的基本边界。学完后知道它解决什么问题、如何与前后组件衔接，以及实现时需要关注的关键约束。

## 前置知识

- [Agent 系统组成](./01-Agent系统组成) 中的 Model、Tools、State、Context。
- Python 函数、字典和异常处理基础（不在本课程重复讲通用语法）。

## 知识点

1. `AgentLoop`、`RunState` 与一次运行的边界。
2. `Observation`、`Action` 与 `FinalAnswer` 的状态转移。
3. 一个无框架、无密钥的 Python 最小循环。
4. 工具结果回填和空结果的失败边界。

> 当前状态：大纲骨架，仅列出学习范围，不包含正文、代码或已验证结论。
