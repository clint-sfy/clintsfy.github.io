---
title: JDBC 与事务
date: 2026-09-22T00:00:00.000Z
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

## 常用用法

### `PreparedStatement`：绑定查询参数

用 `PreparedStatement` 把数据作为参数绑定，避免把不可信输入拼进 SQL。

```java
// 说明：PreparedStatement：绑定查询参数 的具体调用为 String sql = "select name from account where id = ?";
// 输入：// 说明：PreparedStatement：绑定查询参数 的具体调用为 String sql = "select name from account where id = ?"; 使用语句中的具体实参或初始值，当前对象 从这里进入后续操作。
String sql = "select name from account where id = ?";
// 关键变化：String sql = "select name from account where id = ?"；sql 取右侧具体表达式的值，当前状态变为 "select name from account where id = ?"。
// 初始状态：sql 当前为 "select name from account where id = ?"。
try (var ps = connection.prepareStatement(sql)) {
// 关键变化：try (var ps = connection.prepareStatement(sql)) {；当前对象；try；当前对象.try(var ps = connection.prepareStatement(sql)) 返回本次调用的具体结果，后续语句继续使用该值。
    ps.setLong(1, 42L);
    // 关键变化：ps.setLong(1, 42L);；ps；setLong；ps.setLong(1) 返回本次调用的具体结果，后续语句继续使用该值。
    try (var rs = ps.executeQuery()) {
    // 关键变化：try (var rs = ps.executeQuery()) {；当前对象；try；当前对象.try(var rs = ps.executeQuery()) 返回本次调用的具体结果，后续语句继续使用该值。
        if (rs.next()) System.out.println(rs.getString("name"));
// 输出：存在 id=42 的账户时输出其 name；不存在时无输出。
    }
}
```

### JDBC 事务：提交或回滚一组更新

把必须共同成功的数据库更新放在同一连接上，并在失败时回滚。

```java
// 说明：JDBC 事务：提交或回滚一组更新 的具体调用为 connection.setAutoCommit(false);
connection.setAutoCommit(false);
// 关键变化：connection.setAutoCommit(false);；connection；setAutoCommit；connection.setAutoCommit(false) 返回本次调用的具体结果，后续语句继续使用该值。
// 输入：connection.setAutoCommit(false) 接收 false，使后续 debit/credit 更新留在同一显式事务中。
try {
    debit(connection, 1L, 100);
    // 关键变化：debit(connection, 1L, 100);；当前对象；debit；当前对象.debit(connection) 返回本次调用的具体结果，后续语句继续使用该值。
    credit(connection, 2L, 100);
    // 关键变化：credit(connection, 2L, 100);；当前对象；credit；当前对象.credit(connection) 返回本次调用的具体结果，后续语句继续使用该值。
    connection.commit();
    // 结果：commit 提交 debit 和 credit 两笔更新；失败路径由 catch 中的 rollback 撤销。
    // 关键变化：connection.commit()；connection.commit() 完成本例中的具体调用，后续语句观察调用后的状态。
} catch (Exception error) {
// 关键变化：} catch (Exception error) {；当前对象；该操作；当前对象.该操作(Exception error) 返回本次调用的具体结果，后续语句继续使用该值。
    connection.rollback();
    // 关键变化：connection.rollback()；connection.rollback() 完成本例中的具体调用，后续语句观察调用后的状态。
    throw error;
}
```

### try-with-resources：关闭 JDBC 资源

用 try-with-resources 按逆序关闭结果集、语句和连接，确保连接归还连接池。

```java
// 说明：try-with-resources：关闭 JDBC 资源 的具体调用为 try (var connection = dataSource.getConnection();
// 输入：// 说明：try-with-resources：关闭 JDBC 资源 的具体调用为 try (var connection = dataSource.getConnection(); 使用语句中的具体实参或初始值，当前对象 从这里进入后续操作。
try (var connection = dataSource.getConnection();
// 初始状态：connection 当前为 dataSource.getConnection()。
// 作用：用 try-with-resources 按逆序关闭结果集、语句和连接，确保连接归还连接池。
     var statement = connection.prepareStatement("select 1");
     // 关键变化：var statement = connection.prepareStatement("select 1"); 将返回值写入 statement；statement 现在保存该具体结果。
     var result = statement.executeQuery()) {
     // 关键变化：var result = statement.executeQuery()) {；result 接收 executeQuery(当前参数) 的返回值，当前值变为这次调用得到的具体结果。
    result.next();
    // 作用：result.next(); 读取括号中的具体参数对应的元素或文本并返回给后续逻辑。
    System.out.println(result.getInt(1));
// 输出：1（前提：数据库支持 select 1）。
}
```

## 综合练习

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

