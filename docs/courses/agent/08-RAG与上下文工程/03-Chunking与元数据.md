---
title: Chunking 与元数据
author: 阿源
date: 2026/10/07 00:00
categories: [Agent 开发]
tags: [RAG, Chunking, Metadata]
status: 大纲骨架
chapter: 08
---

# Chunking 与元数据

本篇用于建立「Chunking 与元数据」在 Agent 系统中的基本边界。学完后知道它解决什么问题、如何与前后组件衔接，以及实现时需要关注的关键约束。

## 前置知识

- [Ingestion、解析与清洗](./02-Ingestion解析与清洗)、第 03 章的 Token。

## 知识点

1. `Chunk` 和 `Overlap`。
2. 标题、段落、表格和代码边界。
3. `Metadata` 与过滤。
4. 版本、删除和重新索引。

> 当前状态：大纲骨架，仅列出学习范围，不包含正文、代码或已验证结论。
