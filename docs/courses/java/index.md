---
title: Java基础快速入门
date: 2026-09-22
category: Java基础快速入门
tags:
  - Java
  - 学习路线
  - 后端开发
description: 以 JDK 20 为基准，完成第 01–10 章的 Java 语言、标准库、并发与 JVM 学习路线；第 11–12 章作为后续工程化与设计项目路线，并补充第 13 章后端工程速查。
showArticleMetadata: false
editLink: false
lastUpdated: false
showComment: false
---

# Java基础快速入门

这是一套从 Java 基础到后端工程的学习笔记，内容按章节整理。
既可以按顺序学习，也可以通过标题快速查找常用 API 和示例。

## 阶段路线

| 阶段 | 目录 | 当前状态与目标 |
| --- | --- | --- |
| 1. 入门 | [Java基础](/courses/java/01-Java基础/01-开发环境与第一个程序) | 已完成：能配置 JDK、编译运行程序，掌握语句、类型、方法和控制流 |
| 2. 数据与对象 | [数组与文本](/courses/java/02-数组与文本/01-数组与多维数组)、[面向对象](/courses/java/03-面向对象/01-类与对象) | 已完成：用数组、字符串和对象组织中小型程序 |
| 3. 语言进阶 | [现代 Java 类型](/courses/java/04-现代Java类型/01-枚举record与sealed)、[泛型与集合](/courses/java/05-泛型与集合/01-泛型与类型安全) | 已完成：理解类型系统、异常、集合、泛型和现代语法 |
| 4. 标准库 | [函数式与时间](/courses/java/06-函数式与时间/01-Lambda与函数式接口)、[IO与网络](/courses/java/07-IO与网络/01-IO与NIO) | 已完成：函数式、时间、I/O、NIO、HTTP Client 和 Socket |
| 5. 运行时 | [反射与模块](/courses/java/08-反射与模块/01-反射与注解)、[并发编程](/courses/java/09-并发编程/01-线程基础与执行器)、[JVM](/courses/java/10-JVM/01-JVM内存与类加载) | 已完成：反射、模块、并发工具、线程池、异步编排和 JVM 诊断 |
| 6. 工程化 | [工程实践](/courses/java/11-工程实践/01-Maven与测试工程)、[设计与项目](/courses/java/12-设计与项目/01-设计原则模式与综合复习) | 后续路线：工程实践、设计原则、设计模式与综合项目 |
| 7. 后端工程 | [后端工程](/courses/java/13-后端工程/01-Spring-Boot启动与配置) | 已完成：框架边界、日志、文件、Excel、定时任务、MySQL 与 Redis 速查 |

## 后端工程路由

- [Spring Boot 启动与配置](/courses/java/13-后端工程/01-Spring-Boot启动与配置)
- [Spring IoC 与 Bean 生命周期](/courses/java/13-后端工程/02-Spring-IoC与Bean生命周期)
- [Spring AOP 与声明式事务](/courses/java/13-后端工程/03-Spring-AOP与声明式事务)
- [Spring MVC 与 Servlet 边界](/courses/java/13-后端工程/04-Spring-MVC与Servlet边界)
- [Spring Security 与 JWT](/courses/java/13-后端工程/05-Spring-Security与JWT)
- [MyBatis 核心与 MyBatis-Plus 重点](/courses/java/13-后端工程/06-MyBatis核心与MyBatis-Plus重点)
- [Jackson 与 Fastjson2 JSON](/courses/java/13-后端工程/07-Jackson与Fastjson2-JSON)
- [Bean Validation 参数校验](/courses/java/13-后端工程/08-Bean-Validation参数校验)
- [SLF4J 与 Logback 日志](/courses/java/13-后端工程/09-SLF4J与Logback日志)
- [文件上传下载与资源安全](/courses/java/13-后端工程/10-文件上传下载与资源安全)
- [Apache POI Excel 导入导出](/courses/java/13-后端工程/11-Apache-POI-Excel导入导出)
- [Quartz 定时任务](/courses/java/13-后端工程/12-Quartz定时任务)
- [MySQL 8.0](/courses/java/13-后端工程/13-MySQL-8.0)
- [Redis](/courses/java/13-后端工程/14-Redis)

## 学习建议

1. 本系列统一使用 JDK 20，IDE 可选 IntelliJ IDEA；先用命令行完成一次 `javac`、`java` 和 `jar` 流程，再依赖 IDE。JDK 20 不是 LTS，学习预览特性时需明确启用 `--enable-preview`。
2. 每篇先读“学习目标”，再运行简单案例并观察输出；不要只停留在复制示例，至少做一次改需求、加测试或压测。
3. 先掌握对象模型和集合，再学习 Lambda、Stream 与并发；遇到抽象概念时回到可运行的最小示例，用日志、调试器和线程转储验证推断。
4. 每完成一个已发布阶段，做一次复盘：能否不用查资料解释核心概念？能否写出边界测试？能否说明选择某个 API 的理由？
5. 第 11–12 章后续补齐后，再把命令行或 REST 服务、数据库、单元测试、日志和 Maven 组合成最小闭环，并在 JVM、并发、设计模式章节之后迭代优化。

## 进阶出口

完成第 01–10 章后，可以按目标继续深入；第 11–12 章补齐后再把知识落到工程与项目中：Spring Boot 与 Web、MyBatis/JPA、消息队列、容器化部署、性能工程、分布式系统或 Java 源码阅读。进阶学习应围绕真实问题展开，优先记录指标、约束、取舍和验证结果。
