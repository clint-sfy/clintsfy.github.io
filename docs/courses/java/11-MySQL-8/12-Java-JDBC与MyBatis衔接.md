---
title: Java、JDBC 与 MyBatis 衔接
date: 2026-10-05
category: Java课程
tags: [Java, MySQL, JDBC, MyBatis]
description: 把 MySQL 8.0 的 SQL 与事务知识映射到 Java 数据访问层，建立 JDBC、MyBatis 和 Spring 的职责边界。
---

# Java、JDBC 与 MyBatis 衔接

## 学习目标

- 理解Connector/J、DataSource、Mapper与事务管理器的连接关系。
- 把参数、生成键、批处理和类型语义准确交给Java数据访问层。
- 按单一事实源定位数据库、API生命周期、映射与代理事务问题。

## 核心知识点

MySQL 8.0 / InnoDB负责SQL执行、约束、隔离与锁；Connector/J把JDBC调用转换成数据库协议；JDBC负责Java资源/API生命周期；MyBatis负责参数与结果映射；MyBatis-Plus在这些能力上提供通用CRUD与Wrapper；Spring transaction manager（事务管理器）负责把连接绑定到事务并决定提交/回滚。它们叠在同一链路上，但不能彼此替代。

本篇是进入Java工程章节的桥梁。完整代码与驱动配置见[JDBC事实源](/courses/java/12-工程实践/02-JDBC与事务)，数据库内部见[事务与锁](/courses/java/11-MySQL-8/09-事务MVCC隔离级别与锁)，映射/插件/缓存见[MyBatis与MyBatis-Plus](/courses/java/14-后端工程/06-MyBatis核心与MyBatis-Plus重点)，代理/传播/回滚见[Spring事务](/courses/java/14-后端工程/03-Spring-AOP与声明式事务)。下面是JDK 20方法体片段，放入声明throws Exception的方法，并传入段前注明的参数；使用完整类名避免隐含导入。独立批处理片段需要`org.mybatis:mybatis`；Spring集成另需`org.mybatis:mybatis-spring`及兼容的Spring依赖，MP另需对应starter，不能把四套版本号当作同一发行版本。

## 常用用法

### DriverManager.getConnection：验证Connector/J URL

用于先验证驱动与MySQL连接，再引入池和映射框架定位配置问题。

```java
// 初始：方法声明throws SQLException；MYSQL_JDBC_URL/USER/PASSWORD来自秘密配置。
String url = System.getenv("MYSQL_JDBC_URL");
try (java.sql.Connection connection = java.sql.DriverManager.getConnection(
        url,System.getenv("MYSQL_USER"),System.getenv("MYSQL_PASSWORD"))) {
    // 关键变化：直接验证连接，不经过Mapper或连接池。
    System.out.println(connection.getMetaData().getDatabaseProductName());
    // 输出：成功连接MySQL时为MySQL；认证或TLS失败抛SQLException。
}
```

依赖是`com.mysql:mysql-connector-j`，URL包含库名与明确的TLS、时区、连接/网络超时策略；生产验证`sslMode=VERIFY_IDENTITY`与信任配置。属性含义、DriverManager/DataSource区别及try-with-resources完整生命周期由[JDBC连接](/courses/java/12-工程实践/02-JDBC与事务#drivermanager-getconnection-创建独立连接)统一解释。

### PreparedStatement.setLong：把SQL参数交给Java层

用于识别Mapper的#{id}最终应成为JDBC参数，而不是SQL字符串拼接。

```java
// 初始：方法参数java.sql.Connection connection，users基础行id=1已存在。
try (java.sql.PreparedStatement statement = connection.prepareStatement(
        "SELECT id,name FROM learning_lab.users WHERE id=?")) {
    statement.setLong(1,1L);
    // 关键变化：只有参数值变化，SQL结构固定。
    try (java.sql.ResultSet result = statement.executeQuery()) {
        if (result.next()) System.out.println(result.getLong("id"));
        // 输出：基础数据未更改时1；不存在时无行，不伪造对象。
    }
}
```

MyBatis的`${}`是文本替换，不能用它接收外部排序/表名；标识符需要白名单。NULL、精度与时区先确定[数据库类型](/courses/java/11-MySQL-8/03-数据类型字符集与时区)，再选择JDBC取值/TypeHandler，不靠默认映射猜语义。

### ResultSet.getLong：识别生成键交接

用于理解useGeneratedKeys把数据库生成键回填对象，但不生成业务唯一性。

```java
// 初始：方法参数java.sql.ResultSet keys来自成功INSERT的getGeneratedKeys。
java.sql.ResultSet generatedKeys = keys;
if (!generatedKeys.next()) throw new java.sql.SQLException("missing generated key");
long generatedId = generatedKeys.getLong(1);
// 关键变化：读取generatedId作为本次INSERT实际返回键，用于后续关联。
System.out.println(generatedId > 0);
// 输出：正数自增键时true，实际id不承诺连续。
```

完整RETURN_GENERATED_KEYS插入见[JDBC生成键](/courses/java/12-工程实践/02-JDBC与事务#preparedstatement-getgeneratedkeys-读取生成主键)。MyBatis XML用`useGeneratedKeys="true" keyProperty="id"`，MP配合实体`IdType.AUTO`；字段名、驱动返回与批量SQL形态都需测试，不从单行推断批量主键一一对应。

### SqlSessionFactory.openSession：识别ExecutorType.BATCH边界

用于在非Spring管理的独立MyBatis实验中，把Mapper多次写入缓存在批执行器内。

```java
// 风险：只在隔离learning_lab执行，不能混入Spring管理的SqlSession事务。
// 初始：factory为方法参数，已注册第14章example.UserMapper.insert映射。
// 实验库learning_lab.app_user有自增id和username列，两个名称尚未写入。
org.apache.ibatis.session.SqlSessionFactory sessionFactory = factory;
try (org.apache.ibatis.session.SqlSession session = sessionFactory.openSession(
        org.apache.ibatis.session.ExecutorType.BATCH,false)) {
    try {
        java.util.Map<String,Object> first = new java.util.HashMap<>();
        first.put("username","batch-a");
        java.util.Map<String,Object> second = new java.util.HashMap<>();
        second.put("username","batch-b");
        session.insert("example.UserMapper.insert",first);
        session.insert("example.UserMapper.insert",second);
        java.util.List<org.apache.ibatis.executor.BatchResult> results = session.flushStatements();
        // 关键变化：flush执行两次缓冲INSERT，仍不等于commit。
        int items = 0;
        for (org.apache.ibatis.executor.BatchResult result : results) {
            for (int count : result.getUpdateCounts()) {
                if (count == java.sql.Statement.EXECUTE_FAILED)
                    throw new IllegalStateException("batch item failed");
                items++;
            }
        }
        System.out.println(items);
        // 输出：执行成功时2；不把SUCCESS_NO_INFO当精确受影响行数。
        session.rollback();
    } catch (RuntimeException error) {
        session.rollback();
        throw error;
    }
}
```

片段复用第14章XML写入映射，运行前须配置该映射和实验app_user表；rollback后两个名称均不新增，自增键可能留下缺口。JDBC executeBatch的部分失败见[JDBC批处理](/courses/java/12-工程实践/02-JDBC与事务)；MyBatis批模式中的Mapper即时返回值不一定是真实行数，flush/commit才执行缓冲，查询也可能触发flush。Spring集成选专用SqlSessionTemplate和相同transaction manager，已有事务中不要随意切换ExecutorType。[MyBatis Java API](https://mybatis.org/mybatis-3/java-api.html)、[MyBatis-Spring事务](https://mybatis.org/spring/transactions.html)。

### SELECT mapping contract：核对TypeHandler与N+1

用于先固定列名、类型和查询次数，再测试Mapper结果映射。

```sql
-- 初始：orders基础数据101/用户1/25，users中用户1已存在。
SELECT o.id AS order_id,u.id AS user_id,u.name AS user_name,o.amount
FROM learning_lab.orders o JOIN learning_lab.users u ON u.id=o.user_id
WHERE o.id=101;
-- 关键变化：用显式别名避免两列id冲突，一次查询返回关联字段。
-- 输出：基础数据未改时一行，order_id=101、user_id=1、amount=25。
```

TypeHandler负责Java/JDBC类型转换，必须覆盖NULL、边界值、JSON及时间往返，不能在handler中偷偷开事务。嵌套select可能产生N+1：一页N行再发N次查询；按实际SQL次数和结果验证join、批量IN或嵌套结果映射取舍。只开SQL日志不够，绑定值可能包含秘密，应脱敏；测试同时检查对象字段、生成键、分页、查询次数和异常回滚。实现细节继续在[MyBatis事实源](/courses/java/14-后端工程/06-MyBatis核心与MyBatis-Plus重点)维护。[结果映射](https://mybatis.org/mybatis-3/sqlmap-xml.html)。

### DataSource.getConnection：区分池与业务事务

用于观察连接池提供资源，而业务事务仍需由明确的所有者管理。

```java
// 初始：方法参数javax.sql.DataSource dataSource已配置，未进入Spring事务。
javax.sql.DataSource source = dataSource;
try (java.sql.Connection connection = source.getConnection()) {
    boolean autoCommit = connection.getAutoCommit();
    // 关键变化：取得autoCommit实际借出状态，不猜池默认配置。
    System.out.println(autoCommit);
    // 输出：实际true/false；此处不修改或提交任何业务数据。
}
```

Spring事务内Mapper应通过Spring绑定资源执行，不能另开连接期待加入同一事务；代理调用、传播、rollbackFor与自调用由[Spring事实源](/courses/java/14-后端工程/03-Spring-AOP与声明式事务)解释。连接归还前commit/rollback、isolation/readOnly等状态卫生在[JDBC](/courses/java/12-工程实践/02-JDBC与事务)解释，池大小与监控在工程连接池章节扩展。

## 易混点

- Connector/J依赖和JDBC接口是两层，配置成功不证明Mapper正确。
- useGeneratedKeys只回填返回键，不承诺自增连续或批量映射无条件成立。
- flushStatements是执行批次，commit才结束事务，失败需完整回滚。
- TypeHandler负责类型转换，Spring负责事务，MySQL负责实际锁语义。
- 一页对象映射可能触发N+1，需测SQL次数而不只看对象结果。

## 课后小问

1. 为什么在Spring事务里另开DriverManager连接危险？
答案：新连接不会自动加入已绑定的事务资源。
解析：它可能独立提交，导致外层回滚后仍保留部分写入。

2. 为什么BATCH的Mapper返回值不能直接当行数？
答案：语句可能还缓存在执行器里。
解析：刷新后读取批结果，再按事务边界提交/回滚并验证数据库状态。

3. 为什么映射测试要检查SQL次数？
答案：相同对象结果可能由一次JOIN或N+1查询得到。
解析：结果正确不保证数据库负载合理，分页规模下尤其需要测查询数。

## 本节小结

- MySQL、JDBC、MyBatis与Spring各有事实源，桥接调用不重复内部原理。
- 驱动连接先验证，参数、类型与生成键再映射到Mapper契约。
- 批处理执行和事务提交分开，连接池提供资源但不决定业务原子性。
- 类型、字段、查询次数与回滚共同构成数据访问测试。

## 快速回顾

- JDBC管理生命周期，MySQL解释隔离和锁，Spring管理代理事务。
- Mapper参数用井号绑定，标识符与文本替换需白名单。
- ExecutorType.BATCH刷新后检查结果，再由事务所有者结束事务。
- TypeHandler与N+1验证归属映射章节，日志和测试都要保护秘密。
