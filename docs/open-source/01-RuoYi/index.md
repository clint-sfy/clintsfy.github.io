---
title: RuoYi 项目导读
projectName: RuoYi
repo: https://gitee.com/y_project/RuoYi-Vue
summary: 从多模块结构、请求流转和 Spring Boot 启动过程理解 RuoYi-Vue 管理后台。
stack: [Java, Spring Boot, Vue]
status: learning
order: 1
showArticleMetadata: false
showComment: false
---

# RuoYi 项目导读

这组笔记按“先定位项目，再看模块边界，最后跟启动过程”的顺序整理。内容以当前阅读的 RuoYi-Vue 源码为线索；不同版本、分支或二次开发仓库的具体路径和实现可能不同，请以本地 checkout 为准。

## 阅读路线

1. [项目概览](/open-source/01-RuoYi/01-项目概览)：确认仓库边界和阅读入口。
2. [目录与模块](/open-source/01-RuoYi/02-目录与模块)：从 Maven 模块依赖建立结构图。
3. [启动链路](/open-source/01-RuoYi/03-启动链路)：从 `main` 方法跟到 Spring Boot 应用上下文。

源码入口：[RuoYi-Vue Gitee 仓库](https://gitee.com/y_project/RuoYi-Vue)。
