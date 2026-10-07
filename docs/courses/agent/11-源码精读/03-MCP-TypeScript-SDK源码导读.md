---
title: MCP TypeScript SDK 源码导读
author: 阿源
date: 2026/10/07 00:00
categories: [Agent 开发]
tags: [MCP, TypeScript SDK, Source Reading]
status: 大纲骨架
chapter: 11
---

# MCP TypeScript SDK 源码导读

本篇用于规划官方 MCP TypeScript SDK v2 的源码阅读路径，并对照 MCP 2026-07-28 规范定位实现。学完后知道 Client、Server、Transport 和 Capability 在 SDK 中的职责；这里只保留必要 TypeScript 片段，不讲通用语法。

## 前置知识

- 第 02–10 章的 MCP、Transport、Capability、JSONRPCError 和权限边界。

## 知识点

1. 官方 monorepo、packages 和 examples。
2. `MCPClientImplementation`。
3. `MCPServerImplementation`、tools/resources/prompts。
4. transport、初始化、错误和授权。

> 当前状态：大纲骨架，仅列出学习范围，不包含正文、代码或已验证结论。
