---
title: Host、Client 与 Server
author: 阿源
date: 2026/10/07 00:00
categories: [Agent 开发]
tags: [MCP, Host, Client, Server]
status: 大纲骨架
chapter: 06
---

# Host、Client 与 Server

本篇用于建立 MCP 在 Agent 系统中的一个实现边界。学完后知道本主题的协议角色、生命周期、传输或安全约束，并能把它映射回第 06 章的 Python-first 案例。

## 前置知识

- [MCP 解决什么问题](./01-MCP解决什么问题) 的角色和 Capability。

## 知识点

1. `HostBoundary`。
2. `ClientConnection`。
3. `ServerCapability`。
4. 多连接、租户和授权上下文。

> 当前状态：大纲骨架，仅列出学习范围，不包含正文、代码或已验证结论。
