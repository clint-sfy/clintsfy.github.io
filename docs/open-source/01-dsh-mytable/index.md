---
title: DSH MyTable 项目导读
projectName: DSH MyTable
repo: https://github.com/clint-sfy/dsh-mytable
summary: 为 DeepSeek Harness 打造的可分栏工作台，把项目、文件、终端、浏览器、Git 改动和对话收进同一个界面。
stack: [TypeScript, React, Node.js, DSH Plugin]
status: learning
order: 1
showArticleMetadata: false
showComment: false
---

# DSH MyTable 项目导读

`dsh-mytable` 是我为 DeepSeek Harness Web 界面开发的工作台插件。它不是简单的页面皮肤，而是在 DSH 的插件系统里同时扩展服务端能力和客户端工作区：服务端提供文件、Git、终端和本地资源访问，客户端负责分栏布局、窗口注册、文件预览与状态持久化。

## 它解决什么问题

使用 AI 辅助开发时，注意力经常在对话、文件树、代码预览、终端、浏览器和 Git 改动之间来回跳转。这个项目尝试把这些高频上下文放进同一个可组合工作区，让“对话—查看—验证—修改”尽量在一个界面完成。

## 阅读路线

1. [整体架构](/open-source/01-dsh-mytable/01-整体架构)：先建立服务端、客户端和 DSH 宿主之间的边界。
2. [分栏工作区模型](/open-source/01-dsh-mytable/02-分栏工作区模型)：理解多行、多窗格、多标签和持久化如何组合。
3. [插件扩展与安全边界](/open-source/01-dsh-mytable/03-插件扩展与安全边界)：查看开放注册表、文件访问和浏览器嵌入策略。

## 项目信息

- 当前版本：`0.1.0`
- 运行环境：Node.js `22.19+` 或 `24+`
- 开源许可：MIT
- 源码仓库：[clint-sfy/dsh-mytable](https://github.com/clint-sfy/dsh-mytable)

> DeepSeek Harness 仍处于快速迭代阶段。这里记录的是当前仓库结构和设计思路，实际接口以对应版本源码为准。
