---
title: Ingestion、解析与清洗
author: 阿源
date: 2026/10/07 00:00
categories: [Agent 开发]
tags: [RAG, Ingestion, Parsing]
status: 大纲骨架
chapter: 08
---

# Ingestion、解析与清洗

本篇用于建立「Ingestion、解析与清洗」在 Agent 系统中的基本边界。学完后知道它解决什么问题、如何与前后组件衔接，以及实现时需要关注的关键约束。

## 前置知识

- [RAG 管线与适用边界](./01-RAG管线与适用边界)、第 05 章的 State 和 Memory。

## 知识点

1. `Document` 和来源元数据。
2. `Ingestion` 生命周期。
3. `Parsing` 与 `Normalization`。
4. 失败文档、重试和隔离。

> 当前状态：大纲骨架，仅列出学习范围，不包含正文、代码或已验证结论。
