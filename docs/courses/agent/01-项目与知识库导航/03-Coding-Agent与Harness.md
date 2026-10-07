---
title: Coding Agent 与 Harness
author: 阿源
date: 2026/10/07 00:00
categories: [Agent 开发]
tags: [Coding Agent, Harness, Sandbox]
status: 预览版导航
---

# Coding Agent 与 Harness

Coding Agent 的难点不只是让模型生成代码，而是提供可审计的工作区、工具、执行环境、会话恢复、审批和失败处理。先读通用边界，再把 [第 10 章的 Sandbox 与最小权限](/courses/agent/10-评测可观测性与安全/06-Sandbox最小权限与审计) 作为安全门槛。以下资源不以 benchmark 排名作结论，只作为架构和实现取样。

## DeepSeek Harness

官方入口：[GitHub](https://github.com/deepseek-ai/deepseek-harness) · [官方文档](https://deepseek-harness.github.io/deepseek-harness/) · [介绍页](https://www.deepseek.com/harness/en/)

- **解决的问题**：用 Everything is a Plugin 的 Harness 组织 Coding Agent、工具、会话、技能和事件。
- **推荐学习内容**：最后阅读仓库结构、Cordis 上下文、Agent Driver、`dsh-plugin`、Session/Skill/Hook 调用链；运行前先看安全说明。
- **前置知识**：第 02–10 章；Node.js 项目结构阅读能力。这里不展开 TypeScript 通用语法教程。
- **学习阶段**：生产工程。
- **阅读深度**：主线精读。
- **推荐目录/文章**：README 与安全说明、`core/`、`ai-agents/`、`cordis/`、`dsh-plugin/`。
- **与 DeepSeek Harness 对应关系**：这是本课程的终点对照对象；官方明确标注 developer preview，内部接口可能发生兼容性破坏，不能写成永久稳定契约。
- **查看日期**：2026-10-07。

## OpenHands

官方入口：[GitHub](https://github.com/All-Hands-AI/OpenHands) · [文档](https://docs.all-hands.dev/)

- **解决的问题**：提供可运行的 Coding Agent、工作区、工具和事件驱动执行参考。
- **推荐学习内容**：只选架构和运行时文档阅读，比较 agent controller、workspace 和安全隔离，不把产品功能当成通用保证。
- **前置知识**：第 02、04、06、10 章；容器和工作区权限边界。
- **学习阶段**：生产工程。
- **阅读深度**：案例参考。
- **推荐目录/文章**：architecture overview、agent runtime、workspace / sandbox、security docs。
- **与 DeepSeek Harness 对应关系**：Controller、workspace 和 event stream 可与 dsh driver、插件和 session 对照；两套扩展生命周期需分别验证。
- **查看日期**：2026-10-07。

## SWE-agent

官方入口：[GitHub](https://github.com/SWE-agent/SWE-agent) · [文档](https://swe-agent.com/latest/)

- **解决的问题**：展示面向软件工程任务的 Agent Loop、工具接口、轨迹记录和评测闭环。
- **推荐学习内容**：阅读配置、工具环境、轨迹和评测入口，专注可复现任务与失败边界，不以单次 benchmark 结果做结论。
- **前置知识**：Python 基础；第 04、10 章。
- **学习阶段**：进阶。
- **阅读深度**：案例参考。
- **推荐目录/文章**：configuration、agent loop、environment tools、evaluation。
- **与 DeepSeek Harness 对应关系**：任务轨迹和工具环境对应 dsh 的 session/event 与插件工具；可重点比较工作区注入和权限模型。
- **查看日期**：2026-10-07。

## 阅读 Harness 时的安全边界

- 不在真实仓库、真实账号或共享工作区里直接运行未审计的生成命令。
- 将文件、Shell、网络和浏览器工具按 capability 分开，默认只读；需要写入或外发时显示审批理由。
- 给每次运行记录 session id、工具参数、返回、耗时、失败和最终停止原因。
- 如果项目文档把开发者预览接口描述为当前实现，标注版本和查看日期，不把它当成协议保证。
