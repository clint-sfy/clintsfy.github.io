---
title: Agent 开发
showArticleMetadata: false
showComment: false
---

# Agent 开发

这组笔记不围绕某一个框架背 API，而是从 Agent 系统真正长期有效的能力出发：模型与指令、工具调用、MCP、Skills、上下文工程、RAG、评测与可靠性。

## 2026 年的学习判断

| 主题 | 是否过时 | 建议定位 |
| --- | --- | --- |
| MCP | 不过时 | 工具与外部系统接入的主线协议 |
| Agent Skills | 不过时 | 把流程、约束和资源沉淀成可复用能力 |
| RAG | 不过时，但做法已升级 | 从“向量库问答”升级为检索、重排、引用、权限与评测体系 |
| LangChain | 没过时，但不宜做主线 | 用于快速集成和理解生态；复杂状态流优先看 LangGraph 思路 |
| Prompt Engineering | 没过时，但不够完整 | 应升级为 Context Engineering，包括状态、工具结果、记忆和压缩 |

## 推荐顺序

1. Agent 系统组成与单 Agent 闭环。
2. Tool calling 与 MCP。
3. Agent Skills 的边界和渐进式上下文。
4. Context Engineering 与现代 RAG。
5. Evals、Tracing、权限与失败恢复。
6. 最后再对照 LangChain / LangGraph 等框架。

先学协议、模型和工程约束，再学框架，框架换代时知识不会一起作废。
