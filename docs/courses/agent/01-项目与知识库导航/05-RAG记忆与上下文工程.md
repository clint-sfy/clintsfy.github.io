---
title: RAG、Memory 与 Context Engineering
author: 阿源
date: 2026/10/07 00:00
categories: [Agent 开发]
tags: [RAG, Memory, Context Engineering]
status: 预览版导航
---

# RAG、Memory 与 Context Engineering

RAG、Memory 和 Context Engineering 都在影响模型输入，但解决的问题不同：RAG 负责从外部资料取证，Memory 负责跨回合保留经过筛选的信息，Context Engineering 负责在当前预算内组装可用上下文。先读 [05 State、Context、Session 与 Memory](/courses/agent/05-状态上下文会话与记忆/01-State与Context)，再进入 [08 RAG 与 Context Engineering](/courses/agent/08-RAG与上下文工程/01-RAG管线与适用边界)。

## LlamaIndex RAG 组件文档

官方入口：[Querying 文档](https://docs.llamaindex.ai/en/stable/module_guides/querying/) · [GitHub](https://github.com/run-llama/llama_index)

- **解决的问题**：把文档摄取、索引、检索、重排和回答组装为可替换的 RAG 管线。
- **推荐学习内容**：只用作组件地图，先理解无框架 RAG，再按 ingestion、retriever、reranker、citation 查阅。
- **前置知识**：第 05、08 章；文本切分与检索直觉。
- **学习阶段**：进阶。
- **阅读深度**：专题查阅。
- **推荐目录/文章**：Querying、Retrievers、Node parsers、Evaluation。
- **与 DeepSeek Harness 对应关系**：检索结果与上下文组装可作为 dsh tool/Skill 输出进入 driver context，但框架不决定 dsh session。
- **查看日期**：2026-10-07。

## Mem0

官方入口：[GitHub](https://github.com/mem0ai/mem0) · [文档](https://docs.mem0.ai/)

- **解决的问题**：提供长期记忆提取、存储和召回的实现参考，帮助区分会话状态与持久记忆。
- **推荐学习内容**：重点阅读 memory extraction、scoping、更新和删除策略；先设计隔离与保留策略，再尝试集成。
- **前置知识**：State、Session、Memory；第 05 章。
- **学习阶段**：生产工程。
- **阅读深度**：案例参考。
- **推荐目录/文章**：memory model、add/search/update/delete、privacy and isolation、tests。
- **与 DeepSeek Harness 对应关系**：长期记忆属于 dsh Session 之外的持久化插件，必须明确租户、用户和会话作用域。
- **查看日期**：2026-10-07。

## LangChain 文档：Context Engineering

官方入口：[Context engineering 文档](https://docs.langchain.com/oss/python/langchain/context-engineering) · [LangChain 文档](https://docs.langchain.com/)

- **解决的问题**：整理模型输入上下文、工具结果、状态和记忆的工程化边界。
- **推荐学习内容**：用来建立术语地图，回到本课程的无框架 Python 示例验证每个概念。
- **前置知识**：第 02–05 章。
- **学习阶段**：入门。
- **阅读深度**：专题查阅。
- **推荐目录/文章**：runtime context、state、memory、context shaping。
- **与 DeepSeek Harness 对应关系**：Context shaping 对应 dsh driver 在每一轮把 Session、Skill 和 tool result 拼入模型输入的责任。
- **查看日期**：2026-10-07。

## 选型与安全检查

- 资料是实时、私有或需要引用时，考虑 RAG；先做权限过滤和证据追踪，再做 embedding 优化。
- 用户偏好或跨会话事实需要保存时，考虑 Memory；为用户、租户、会话设置独立 scope，提供删除和过期策略。
- 当前回合信息超预算时，先做 context projection、压缩和摘要；不要把所有历史原文无条件塞回模型。
- 任何来自检索或记忆的文本都可能包含指令注入，必须与系统规则和工具权限分开处理。
