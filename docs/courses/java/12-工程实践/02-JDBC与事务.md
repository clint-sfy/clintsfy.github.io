---
title: JDBC 与事务
date: 2026-10-05
category: Java基础快速入门
tags: [Java, JDBC, 数据库, 事务]
description: 管理 JDBC 资源，正确处理参数、NULL、生成键、批处理、超时与事务状态。
---

# JDBC 与事务

## 学习目标

- 使用JDK 20的连接、语句和结果集API完成可验证的数据访问。
- 处理NULL、生成键、批量失败、超时与取消。
- 明确事务所有权和连接池状态恢复边界。

## 核心知识点

JDBC是Java标准接口，Connector/J是MySQL驱动。DriverManager适合独立实验；DataSource提供取连接入口，但DataSource不保证有池。池连接close通常是归还物理连接，业务仍需自己结束事务。ResultSet、Statement、Connection按逆序关闭。

本篇拥有Java生命周期/API；[MySQL类型](/courses/java/11-MySQL-8/03-数据类型字符集与时区)拥有SQL NULL、精度与时区，[MySQL事务](/courses/java/11-MySQL-8/09-事务MVCC隔离级别与锁)拥有隔离/MVCC/锁。对象映射见[MyBatis](/courses/java/14-后端工程/06-MyBatis核心与MyBatis-Plus重点)，代理、传播与回滚规则见[Spring事务](/courses/java/14-后端工程/03-Spring-AOP与声明式事务)。

以下是JDK 20方法体片段，需要 `import java.sql.*; import javax.sql.DataSource; import java.util.Properties;`，放入声明 `throws SQLException` 的方法。各段独立执行，段前注明的方法参数必须传入真实资源。外部依赖为 `com.mysql:mysql-connector-j`，选择支持项目JDK与MySQL 8.0的稳定版本并固定在依赖管理中；连接池与测试依赖单独管理。现代驱动自动注册，无需常规调用Class.forName。手工事务示例不得接管Spring管理的连接。

## 常用用法

### DriverManager.getConnection：创建独立连接

用于在没有容器时验证驱动、认证与连接URL。

```java
// 初始：MYSQL_JDBC_URL指向TLS实验库，凭据由秘密注入。
Properties properties = new Properties();
properties.setProperty("user",System.getenv("MYSQL_USER"));
properties.setProperty("password",System.getenv("MYSQL_PASSWORD"));
String url = System.getenv("MYSQL_JDBC_URL");
try (Connection connection = DriverManager.getConnection(url,properties)) {
    // 关键变化：握手成功后得到Connection，退出块自动关闭。
    System.out.println(connection.isValid(2));
    // 输出：连接健康时true，认证失败时抛SQLException。
}
```

URL示意为 `jdbc:mysql://db.example.test:3306/learning_lab?sslMode=VERIFY_IDENTITY&connectTimeout=3000&socketTimeout=10000&connectionTimeZone=UTC`，需替换实际主机并配置受信证书，主机名必须匹配。Connector/J默认sslMode=PREFERRED不等于身份验证；不要把useSSL=false或allowPublicKeyRetrieval=true作为生产通用修复。connectTimeout/socketTimeout单位毫秒，池等待是另一预算。时区选项还需配合列类型和会话时区验证。[URL语法](https://dev.mysql.com/doc/connector-j/en/connector-j-reference-jdbc-url-format.html)、[连接属性](https://dev.mysql.com/doc/connector-j/en/connector-j-reference-configuration-properties.html)。

### DataSource.getConnection：获取并关闭资源

用于把连接配置与业务分离，用try-with-resources逆序释放所有资源。

```java
// 初始：方法参数DataSource dataSource已配置，是否有池由实现决定。
DataSource source = dataSource;
try (Connection connection = source.getConnection();
     PreparedStatement statement = connection.prepareStatement("SELECT 1");
     ResultSet result = statement.executeQuery()) {
    result.next();
    // 关键变化：读取SELECT 1后依次关闭ResultSet、Statement、Connection。
    System.out.println(result.getInt(1));
    // 输出：1；池代理close通常归还连接。
}
```

活动事务关闭行为由实现决定，必须先commit/rollback。不要把Connection共享为字段或跨线程使用，也不要在事务中等待慢远程I/O。

### PreparedStatement.setString：绑定参数值

用于让不可信值作为数据参与查询，保持SQL结构固定。

```java
// 初始：方法参数Connection connection；输入含看似SQL的文字。
String input = "x' OR 1=1 --";
try (PreparedStatement statement = connection.prepareStatement(
        "SELECT id FROM learning_lab.users WHERE name=? ORDER BY id")) {
    statement.setString(1,input);
    // 关键变化：绑定一个完整字符串，不会改变WHERE条件。
    try (ResultSet result = statement.executeQuery()) {
        while (result.next()) System.out.println(result.getLong(1));
        // 输出：匹配的id；只返回name精确等于input的行，不会因输入返回全表。
    }
}
```

占位符不能绑定表名、列名或排序方向，它们需白名单。参数绑定安全不等于保证服务端预编译或执行计划复用，Connector/J配置决定实现。

### ResultSet.wasNull：区分NULL与零

用于读取基本类型后立即检查最后读取列是否为SQL NULL。

```java
// 初始：方法参数Connection connection，常量查询不依赖业务数据。
try (PreparedStatement statement = connection.prepareStatement("SELECT NULL AS score,0 AS zero_value");
     ResultSet result = statement.executeQuery()) {
    result.next();
    int score = result.getInt("score");
    boolean scoreNull = result.wasNull();
    // 关键变化：getInt(NULL)返回0，记录该列的NULL状态后再读取下一列。
    int zero = result.getInt("zero_value");
    System.out.println(score + "/" + scoreNull + "/" + zero + "/" + result.wasNull());
    // 输出：0/true/0/false。
}
```

支持的驱动也可用getObject(column,Integer.class)读取包装类型；另一列读取会覆盖wasNull状态。[ResultSet](https://docs.oracle.com/en/java/javase/20/docs/api/java.sql/java/sql/ResultSet.html)。

### CREATE TABLE：准备JDBC实验表

用于在独立库建立生成键、批处理和回滚示例共用的最小表。

```sql
-- 风险：CREATE TABLE仅在独立learning_lab执行，会修改结构且隐式提交。
-- 初始：lab_jdbc不存在，用有建表权限的实验账号执行。
CREATE TABLE learning_lab.lab_jdbc(
 id BIGINT AUTO_INCREMENT PRIMARY KEY,
 name VARCHAR(80) NOT NULL
) ENGINE=InnoDB;
-- 关键变化：创建lab_jdbc自增键和非空name列，不影响users/orders。
SELECT COUNT(*) FROM learning_lab.lab_jdbc;
-- 输出：0，重复执行前先检查对象，不直接覆盖已有表。
```

日常应用账号不应为此获得DDL权限；[表设计](/courses/java/11-MySQL-8/02-表设计与DDL)解释结构语义，后续片段只使用该表。

### PreparedStatement.getGeneratedKeys：读取生成主键

用于获取本次插入的数据库生成键，不用MAX(id)猜并发结果。

```java
// 风险：只写独立实验表lab_jdbc，自动提交会新增一行。
// 初始：方法参数Connection connection自动提交为true，lab_jdbc为空。
try (PreparedStatement statement = connection.prepareStatement(
        "INSERT INTO learning_lab.lab_jdbc(name) VALUES(?)",Statement.RETURN_GENERATED_KEYS)) {
    statement.setString(1,"first");
    if (statement.executeUpdate() != 1) throw new SQLException("insert count");
    // 关键变化：确认插入1行，再读取同一语句的生成键。
    try (ResultSet keys = statement.getGeneratedKeys()) {
        if (!keys.next()) throw new SQLException("missing generated key");
        System.out.println(keys.getLong(1));
        // 输出：实际生成id，不承诺从1开始或无缺口。
    }
}
```

多行、UPSERT与批量重写的键映射需单独验证，不能从单行示例推断一项一键。

### PreparedStatement.executeBatch：检查部分失败

用于减少往返并保留每项执行状态，控制批次大小和事务时长。

```java
// 风险：写实验表，调用者须先开启事务并负责结束，失败不可无条件重放全部。
// 初始：方法参数Connection connection自动提交为false，lab_jdbc存在。
try (PreparedStatement statement = connection.prepareStatement(
        "INSERT INTO learning_lab.lab_jdbc(name) VALUES(?)")) {
    for (String name : new String[]{"batch-a","batch-b"}) {
        statement.setString(1,name);
        statement.addBatch();
    }
    // 关键变化：两项参数一起执行，但执行批次不等于commit。
    try {
        int[] counts = statement.executeBatch();
        for (int count : counts) {
            if (count == Statement.EXECUTE_FAILED) throw new SQLException("batch item failed");
            System.out.println(count);
            // 输出：每项实际行数或SUCCESS_NO_INFO(-2)，不保证全为1。
        }
        // 结果：计数可以是实际行数或SUCCESS_NO_INFO(-2)，不保证全为1。
    } catch (BatchUpdateException error) {
        System.out.println(error.getUpdateCounts().length);
        // 输出：实际计数数组长度，数组可能只含之前成功项或含EXECUTE_FAILED(-3)。
        throw error; // 事务所有者负责完整rollback
    }
}
```

驱动可能失败后继续执行；continueBatchOnError/rewriteBatchedStatements影响计数、键与SQL重写。自动提交时不能保证整个批次原子，超大批次还会碰到包大小和内存限制。[Connector/J实现说明](https://dev.mysql.com/doc/connector-j/en/connector-j-reference-implementation-notes.html)。

### Connection.setSavepoint：结束事务并恢复状态

用于在应用拥有的连接上演练局部回滚，成功结束后恢复池连接设置。

```java
// 风险：只操作实验物理连接；未决事务设置自动提交可能提交数据，rollback失败不得复用。
// 初始：实验URL与凭据从秘密配置读取，lab_jdbc存在；最终撤销所有写入。
try (Connection connection = DriverManager.getConnection(
        System.getenv("MYSQL_JDBC_URL"),System.getenv("MYSQL_USER"),System.getenv("MYSQL_PASSWORD"))) {
    boolean originalAutoCommit = connection.getAutoCommit();
    int originalIsolation = connection.getTransactionIsolation();
    if (!originalAutoCommit) throw new SQLException("caller owns transaction");
    boolean ended = false;
    SQLException failure = null;
    try {
        connection.setTransactionIsolation(Connection.TRANSACTION_READ_COMMITTED);
        connection.setAutoCommit(false);
        try (PreparedStatement statement = connection.prepareStatement(
                "INSERT INTO learning_lab.lab_jdbc(name) VALUES(?)")) {
            statement.setString(1,"before-savepoint");
            statement.executeUpdate();
            Savepoint point = connection.setSavepoint("optional_step");
            statement.setString(1,"after-savepoint");
            statement.executeUpdate();
            connection.rollback(point);
            connection.releaseSavepoint(point);
            // 关键变化：after-savepoint撤销，before-savepoint仍未提交。
        }
        connection.rollback();
        ended = true;
        // 结果：两条均不保留；业务成功路径在此改用commit并确认成功。
    } catch (SQLException error) {
        failure = error;
        try { connection.rollback(); ended = true; }
        catch (SQLException rollbackError) { error.addSuppressed(rollbackError); }
    } finally {
        if (ended) {
            try {
                connection.setTransactionIsolation(originalIsolation);
                connection.setAutoCommit(originalAutoCommit);
            } catch (SQLException resetError) {
                if (failure == null) failure = resetError;
                else failure.addSuppressed(resetError);
                ended = false;
            }
        }
        if (!ended) {
            if (failure == null) failure = new SQLException("connection state unknown");
            try { connection.abort(Runnable::run); }
            catch (SQLException abortError) { failure.addSuppressed(abortError); }
        }
    }
    if (failure != null) throw failure;
}
```

本段拥有独立物理连接，结束或复位失败时请求abort，并在外层关闭，不会把它归还池。池集成不能照搬：通用JDBC无统一evict方法，应采用具体池的淘汰API/受支持的abort策略，禁止归还未知状态连接。commit失败也可能结果未知，业务要核对而不是盲重试。保存点不等于结束事务或释放全部锁；隔离级别在事务开始前设置，readOnly、catalog/schema及session变量也需清理，池未必恢复任意SET。[Connection](https://docs.oracle.com/en/java/javase/20/docs/api/java.sql/java/sql/Connection.html)。

### PreparedStatement.setFetchSize：选择读取策略

用于控制大结果集缓冲，按驱动配置验证读取模式。

```java
// 初始：方法参数Connection connection，URL已配置useCursorFetch=true。
try (PreparedStatement statement = connection.prepareStatement(
        "SELECT id FROM learning_lab.users ORDER BY id",ResultSet.TYPE_FORWARD_ONLY,ResultSet.CONCUR_READ_ONLY)) {
    statement.setFetchSize(100);
    // 关键变化：在Connector/J游标模式下每批抓取100行，并不是LIMIT 100。
    int count = 0;
    try (ResultSet result = statement.executeQuery()) {
        while (result.next()) count++;
    }
    System.out.println(count);
    // 输出：实际users行数；完整消费或关闭后释放结果资源。
}
```

默认常缓冲全部结果，正fetchSize需useCursorFetch=true，驱动启用服务端预编译。传统流式扩展是forward-only/read-only配Integer.MIN_VALUE；它不是JDBC通用规则，未关闭/消费完前不能在同一连接执行另一查询，慢消费占连接且受网络超时影响。优先适量查询或键集分页。[实现说明](https://dev.mysql.com/doc/connector-j/en/connector-j-reference-implementation-notes.html)。

### PreparedStatement.setQueryTimeout：设置语句预算

用于给执行设置秒级上限，区分连接、池等待和网络超时。

```java
// 初始：方法参数Connection connection，运行正常SELECT 1。
try (PreparedStatement statement = connection.prepareStatement("SELECT 1")) {
    statement.setQueryTimeout(2);
    // 关键变化：设置2秒语句预算，不包括池等待等全部端到端阶段。
    try (ResultSet result = statement.executeQuery()) {
        result.next();
        System.out.println(result.getInt(1));
        // 输出：正常为1；超时按驱动抛异常，不保证事务已回滚。
    }
}
```

语句预算不覆盖全部结果消费时间，超时也不代表数据库事务已回滚；按驱动版本实测取消与连接状态。[Statement](https://docs.oracle.com/en/java/javase/20/docs/api/java.sql/java/sql/Statement.html)。

### Connection.setNetworkTimeout：限制网络响应等待

用于为驱动等待数据库网络响应设置毫秒预算，并明确恢复与Executor关闭边界。

```java
// 初始：方法参数Connection connection健康，应用拥有该连接，尚无活动事务。
Connection owned = connection;
java.util.concurrent.ExecutorService executor = java.util.concurrent.Executors.newSingleThreadExecutor();
int originalTimeout = 0;
boolean timeoutRead = false;
SQLException failure = null;
try {
    // 初始状态：网络超时getter本身也可能失败；先进入try，确保Executor最终关闭。
    originalTimeout = owned.getNetworkTimeout();
    timeoutRead = true;
    owned.setNetworkTimeout(executor,5000);
    // 关键变化：网络响应预算变为5000毫秒，不替代语句或池等待超时。
    System.out.println(owned.getNetworkTimeout());
    // 输出：驱动支持并成功设置时5000；不支持时抛SQLFeatureNotSupportedException。
} catch (SQLException error) {
    failure = error;
    throw error;
} finally {
    try {
        if (timeoutRead) owned.setNetworkTimeout(executor,originalTimeout);
    } catch (SQLException resetError) {
        if (failure != null) failure.addSuppressed(resetError);
        else throw resetError;
    } finally {
        executor.shutdown();
    }
}
```

JDBC网络超时触发时连接按契约关闭；驱动socketTimeout是另一个配置入口，不能假设所有超时都保持连接可复用。getter失败时不会尝试用未初始化值复位，但Executor仍会关闭；设置或读取后的原始失败会保留，复位异常作为suppressed异常附加。生产从池借出时，复位失败须淘汰连接；Executor应按应用生命周期集中管理，此段独立创建仅便于看清关闭顺序。

### Statement.cancel：请求取消正在执行的语句

用于在受控协作线程中取消另一线程正在执行的语句，并核对异常与事务结果。

```java
// 初始：方法参数Statement runningStatement，由同一测试的查询线程执行只读长查询。
Statement statement = runningStatement;
statement.cancel();
// 关键变化：发送cancel请求，不能据此判定数据库事务已结束。
System.out.println("cancel requested");
// 输出：正常返回时cancel requested；查询线程须记录实际异常/完成状态。
```

此片段需要测试协调查询线程，JDBC cancel允许一个线程取消另一线程语句，不代表Connection可以任意并发使用。若语句已结束，取消可能无效果；也可能因驱动/网络失败。查询线程必须继续检查结果与SQLState，由事务所有者结束事务并检查连接健康。HTTP请求结束不代表数据库工作停止。

### SQLException.getSQLState：保留诊断码

用于同时记录标准SQLState与MySQL供应商错误码，不靠消息文本猜错误类型。

```java
// 初始：方法参数SQLException error来自真实失败，日志不打印密码和绑定值。
for (SQLException item = error; item != null; item = item.getNextException()) {
    // 关键变化：遍历SQLException链，保留SQLState和vendor code。
    System.out.println(item.getSQLState() + "/" + item.getErrorCode());
    // 输出：实际状态/错误码；死锁常见40001/1213，需以实际异常为准。
}
```

连接故障、约束失败、超时、死锁不能共用无条件重试。1205/1213回滚范围见[服务端事实源](/courses/java/11-MySQL-8/09-事务MVCC隔离级别与锁)；重试先完整回滚、限制次数/退避，并确认幂等和提交结果。

### SELECT Testcontainers validation：检查真实驱动结果

用于在隔离MySQL 8.0测试中验证mock不能覆盖的协议与事务行为。

```sql
-- 初始：测试启动MySQL 8.0容器并迁移lab_jdbc，应用使用映射端口。
SELECT VERSION(),@@transaction_isolation;
SELECT COUNT(*) FROM learning_lab.lab_jdbc;
-- 关键变化：读取VERSION和transaction_isolation，对比lab_jdbc事务前后行数。
-- 结果：回滚测试后行数等于测试前基线，不要求自增序列无缺口。
```

Testcontainers是测试依赖，需要Docker、固定版本的MySQL模块及JUnit集成，不是生产连接池。覆盖参数注入、NULL、生成键、批量中间失败、回滚、池复用状态和游标关闭；并发测试用独立连接与屏障控制交错。框架教程与依赖版本在后端测试章节统一维护。

## 易混点

- 参数绑定不能绑定标识符，也不能保证服务端预编译。
- 基本类型NULL可能变成零，wasNull须紧接对应读取。
- executeBatch不是commit，自动提交批次不承诺整体原子。
- fetchSize是读取策略，超时与取消不代表数据库已回滚。
- 复位失败需要按池API淘汰，不能继续复用未知状态连接。

## 课后小问

1. 为什么getInt后立即wasNull？
答案：wasNull只反映最后读取列。
解析：另一列读取会覆盖状态，导致NULL和零混淆。

2. 为什么批量失败不能直接重放全部？
答案：之前项可能已执行甚至提交。
解析：检查计数与事务，完整回滚并确认幂等，未知提交结果需要业务核对。

3. 为什么池归还前必须结束事务？
答案：活动事务关闭行为由实现决定。
解析：业务所有者明确commit/rollback，状态未知时淘汰而不是借给下一请求。

## 本节小结

- JDBC资源按结果集、语句、连接逆序关闭，事务由所有者结束。
- 参数、NULL、生成键和批量计数需要真实驱动验证。
- 池状态恢复和异常淘汰是连接复用的必要边界。
- 超时分层设置，诊断码和幂等策略支持可靠错误处理。

## 快速回顾

- DataSource统一取连接，try-with-resources管理资源关闭。
- PreparedStatement绑定值，标识符仍需要白名单。
- RETURN_GENERATED_KEYS读取键，BatchUpdateException检查失败计数。
- rollback成功后恢复状态，失败时淘汰连接并保留异常链。
