---
title: Embedding 与向量检索
author: 阿源
date: 2026/10/07 00:00
categories: [Agent 开发]
tags: [RAG, Embedding, Vector Search]
status: 大纲骨架
chapter: 08
---

# Embedding 与向量检索

本篇用于建立「Embedding 与向量检索」在 Agent 系统中的基本边界。学完后知道它解决什么问题、如何与前后组件衔接，以及实现时需要关注的关键约束。

## 前置知识

- [Chunking 与元数据](./03-Chunking与元数据)、[RAG 管线](./01-RAG管线与适用边界)。

## 知识点

1. `Embedding` 生成和版本。
2. `Similarity` 与距离函数。
3. `VectorSearch`、top-k 和空召回。
4. 索引更新、删除和回退。

> 当前状态：大纲骨架，仅列出学习范围，不包含正文、代码或已验证结论。
