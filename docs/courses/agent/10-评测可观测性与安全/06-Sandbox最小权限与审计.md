---
title: Sandbox、最小权限与审计
author: 阿源
date: 2026/10/07 00:00
categories: [Agent 开发]
tags: [Sandbox, Permission, Audit]
status: 大纲骨架
chapter: 10
---

# Sandbox、最小权限与审计

本篇用于建立「Sandbox、最小权限与审计」在 Agent 系统中的基本边界。学完后知道它解决什么问题、如何与前后组件衔接，以及实现时需要关注的关键约束。

## 前置知识

- [Prompt Injection 与数据泄露](./05-Prompt-Injection与数据泄露)、第 04 章的 DangerousOperation。

## 知识点

1. `Sandbox` 边界和逃逸风险。
2. `LeastPrivilege` 与 capability allowlist。
3. `CapabilitySecurity`、审批和租约。
4. 审计、清理、恢复和人工接管。

> 当前状态：大纲骨架，仅列出学习范围，不包含正文、代码或已验证结论。
