---
title: JDBC 与事务
date: 2026-09-22
category: Java基础快速入门
tags:
  - Java
  - JDBC
  - 数据库
  - 事务
description: 使用 JDBC 安全访问数据库，理解连接、预编译、事务隔离和资源管理。
---

# JDBC 与事务

## 学习目标

- 使用 DataSource、Connection、PreparedStatement 和 ResultSet 完成 CRUD。
- 用 try-with-resources 管理数据库资源，处理批量和分页。
- 理解提交、回滚、隔离级别、锁和连接池边界。

## 核心知识点

PreparedStatement 参数绑定可防止 SQL 注入，并帮助数据库复用执行计划。Connection 默认是否自动提交要明确设置；一组业务更新必须在同一事务中，失败时回滚。隔离级别影响脏读、不可重复读和幻读；连接池管理的是连接生命周期，不是事务边界。ResultSet 映射应处理 null、时区、精度和资源关闭，批量操作需控制批次大小。

## 实践任务

实现转账仓储：锁定并校验两账户余额，更新后提交，任一步失败回滚；用 Testcontainers 或本地数据库测试并发转账、重复提交、死锁重试和 SQL 注入输入。

## 易错点

- 字符串拼接 SQL，造成注入。
- 只回滚一个 DAO 方法，事务实际跨服务边界未统一。
- 忘记关闭 ResultSet/Statement/Connection，连接池最终耗尽。
- 在事务中进行网络调用，长时间持有数据库锁。

## 复习清单

- [ ] 能写出 PreparedStatement + try-with-resources。
- [ ] 能解释事务边界和常见隔离现象。
- [ ] 能区分数据库连接池、事务管理和重试策略。

