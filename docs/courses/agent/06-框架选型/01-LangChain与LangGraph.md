---
title: LangChain 与 LangGraph 怎么学
author: 阿源
date: 2026/09/21 12:00
categories: [Agent 开发]
tags: [Agent, LangChain, LangGraph]
---

# LangChain 与 LangGraph 怎么学

LangChain 没有过时，但它不应该成为 Agent 学习的第一层抽象。框架 API 变化较快，如果还不理解 tool calling、状态、上下文、重试和评测，很容易只会拼装示例。

## 合理定位

- 用 LangChain 了解模型、工具、检索器与生态集成；
- 用 LangGraph 学习显式状态、节点、边、条件路由、检查点和人工介入；
- 用原生 SDK 或少量自建代码完成边界简单的 Agent；
- 当流程需要可恢复、可观测和复杂分支时，再引入图式编排。

## 选型问题

1. 是否真的需要框架，还是几个明确函数就够？
2. 状态是否需要持久化和恢复？
3. 是否需要人工审批、暂停和继续？
4. 是否能观测每个节点和工具调用？
5. 框架抽象是否隐藏了模型与供应商的重要能力？
6. 升级成本和锁定成本是否可接受？

先理解协议和运行时，再看框架源码与设计取舍，学到的东西会更耐久。

参考：[LangChain 官方文档](https://docs.langchain.com/)
