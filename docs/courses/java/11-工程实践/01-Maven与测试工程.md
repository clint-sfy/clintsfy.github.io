---
title: Maven、JUnit 与日志工程
date: 2026-09-22
category: Java系统补习
tags:
  - Java
  - Maven
  - JUnit
  - 日志
description: 用 Maven 管理依赖与生命周期，使用 JUnit 和日志建立可验证的工程闭环。
---

# Maven、JUnit 与日志工程

## 学习目标

- 读写 pom.xml、坐标、依赖范围、生命周期和多模块构建。
- 用 JUnit 5 编写单元、参数化、异常和集成测试。
- 通过 SLF4J 门面、结构化字段和日志级别建立可观测性。

## 核心知识点

Maven 坐标由 groupId、artifactId、version 组成，依赖树和 dependencyManagement 用来治理版本；生命周期阶段通常经历 validate、compile、test、package、verify、install。测试应隔离时间、网络和数据库，优先验证公开行为。JUnit 5 的 `@Test`、`@ParameterizedTest`、`assertThrows` 和扩展机制覆盖主要场景。日志用 SLF4J API，避免字符串拼接和敏感信息，使用请求 ID、级别与结构化参数。

## 实践任务

把一个 Java 程序改成 Maven 项目：配置编译版本、测试插件和 Checkstyle；为核心服务补单元测试、参数化测试和一个集成测试，加入带请求 ID 的日志，并用 `mvn test`、`mvn verify` 验证。

## 易错点

- 依赖版本漂移或把运行时依赖误设为 test scope。
- 测试共享静态状态、真实网络和系统时间，导致偶发失败。
- 捕获异常后只打印 message，丢失堆栈与上下文。
- 在日志中输出密码、令牌、个人信息和完整请求体。

## 复习清单

- [ ] 能通过 dependency:tree 定位依赖冲突。
- [ ] 能为正常、边界、异常和集成路径分层测试。
- [ ] 能制定日志级别、字段、脱敏和采样规则。

