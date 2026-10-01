---
title: MySQL 8.0
date: 2026-10-01
category: Java后端工程
tags:
  - Java
  - MySQL 8.0
  - SQL
  - 数据库
description: 固定以 MySQL 8.0 为基线，速查类型、索引、EXPLAIN、事务锁、窗口函数、分页与 JDBC 边界。
---

# MySQL 8.0

## 学习目标

- 能按 MySQL 8.0 的语法和 InnoDB 约束设计表、类型、字符集与索引。
- 能使用 `EXPLAIN` 分析过滤、排序、连接和分页是否命中合理索引。
- 能区分 SQL 语句、数据库事务、连接池和 JDBC 资源的责任边界。

## 核心知识点

### 专业术语

- **MySQL 8.0**：本文固定的数据库版本基线；语法和行为应以实际 8.0.x 小版本文档与配置为准。
- **DDL/DML**：DDL 定义表和索引，DML 读取或修改数据；两者的锁和隐式提交行为不能混为一谈。
- **InnoDB**：常用事务存储引擎，提供行锁、MVCC、崩溃恢复和外键能力。
- **EXPLAIN**：查看优化器选择的访问路径、估算行数、连接顺序和索引使用情况。
- **CTE 与窗口函数**：CTE 用 `WITH` 命名中间结果；窗口函数在不折叠行的前提下计算排名、累计和等分析值。

### 白话解释与边界

数据库不会因为 SQL 看起来短就自动执行得快：类型、索引、数据分布、排序和事务等待都会影响结果。`EXPLAIN` 是定位访问路径的起点，不是性能承诺；执行计划估算与真实数据偏差较大时要用实际数据、慢查询和锁等待共同验证。

本文固定围绕 MySQL 8.0 与 InnoDB，不把其他数据库方言当成可直接复制的语法。时间类型要先确定“业务时间”还是“绝对时刻”，金额要用定点数而不是浮点数；连接池只管理连接复用，事务边界仍需要 JDBC 或框架明确控制。Java 代码按 JDK 20 风格组织，覆盖样本兼容基线为 Java 17。

## 常用用法

### MySQL 8.0：创建 InnoDB 表

用途：用于以 MySQL 8.0 的字符集、存储引擎、主键和约束建立可演进的业务表。

```sql
CREATE TABLE account (
    id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    username VARCHAR(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
    balance DECIMAL(12, 2) NOT NULL DEFAULT 0.00,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    UNIQUE KEY uk_account_username (username)
) ENGINE = InnoDB;
-- 输出：表 account 创建成功，主键与唯一索引同时建立
```

生产变更要通过可回滚的迁移工具执行，并评估锁表、默认值和已有数据；`AUTO_INCREMENT` 不是业务编号安全策略，外部暴露的标识仍需按威胁模型设计。

### DDL/常用类型/字符集：明确数据语义

用途：用于在建表或迁移时选择与业务含义匹配的类型，避免隐式转换、乱码和精度丢失。

```sql
ALTER TABLE account
    ADD COLUMN status VARCHAR(16) CHARACTER SET utf8mb4 NOT NULL DEFAULT 'ACTIVE',
    ADD COLUMN version INT NOT NULL DEFAULT 0;
-- 输出：account 增加 status 与 version，未提供值的旧行使用默认值
```

`VARCHAR` 长度与字符集有关；中文、表情和跨服务文本优先统一 `utf8mb4`。金额使用 `DECIMAL(p, s)`，状态等有限值可用受控字符串或字典表，避免把展示文字当作稳定主键。

### 索引与 EXPLAIN：验证访问路径

用途：用于检查过滤、排序和连接是否利用合适索引，先观察计划再决定是否改 SQL 或索引。

```sql
CREATE INDEX idx_account_status_created ON account(status, created_at, id);
EXPLAIN SELECT id, username
FROM account
WHERE status = 'ACTIVE'
ORDER BY created_at DESC, id DESC
LIMIT 20;
-- 输出：EXPLAIN 展示 key、type、rows 与 Extra，实际值需按数据分布验证
```

联合索引要从高选择性过滤和稳定排序需求出发；函数包裹列、隐式类型转换或前导通配符可能让索引失效。`EXPLAIN ANALYZE` 在可用的小版本上可进一步观察实际执行，但不能替代线上低风险压测。

## 不常用但需要知道

### 事务/行锁：缩短一致性边界

用途：用于把相互依赖的更新放进同一 InnoDB 事务，并用行锁保护读取后即将修改的记录。

```sql
START TRANSACTION;
SELECT id, balance FROM account WHERE id = 1 FOR UPDATE;
UPDATE account SET balance = balance - 10 WHERE id = 1 AND balance >= 10;
COMMIT;
-- 输出：满足余额条件时提交一笔受行锁保护的扣款；失败路径必须 ROLLBACK
```

`FOR UPDATE` 需要在事务中使用，锁住的范围受索引和隔离级别影响；事务中不要调用慢速网络服务。更新影响行数为零时要回滚并返回业务错误，不要无条件提交。

### CTE/窗口函数：表达分阶段分析

用途：用于把中间筛选命名后再做排名、累计或分组内计算，同时保留原始行粒度。

```sql
WITH ranked AS (
    SELECT id, username, balance,
           ROW_NUMBER() OVER (ORDER BY balance DESC, id) AS ranking
    FROM account
    WHERE status = 'ACTIVE'
)
SELECT id, username, ranking
FROM ranked
WHERE ranking <= 3;
-- 输出：返回余额最高的前三个 ACTIVE 账户及其排名
```

CTE 提升可读性但不保证物化或更快；窗口排序仍需要扫描和排序成本，复杂分析要结合 `EXPLAIN` 与数据量验证。

### 时间类型与 JDBC 驱动：区分时刻和本地时间

用途：用于让数据库列、Java 类型、JDBC 驱动和时区约定保持一致，避免跨机器出现偏移。

```java
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.time.Instant;

try (Connection connection = dataSource.getConnection();
     PreparedStatement statement = connection.prepareStatement(
         "UPDATE account SET created_at = ? WHERE id = ?")) {
    statement.setObject(1, Instant.parse("2026-10-01T00:00:00Z"));
    statement.setLong(2, 1L);
    System.out.println(statement.getParameterMetaData().getParameterCount());
    // 输出：2
}
```

`TIMESTAMP`、`DATETIME` 与驱动时区设置的组合必须在项目契约中写明；连接池和事务资源释放可回看[JDBC 与事务](/courses/java/11-工程实践/02-JDBC与事务)。示例中的 `dataSource` 由应用配置提供，不能在每个请求中手写连接字符串。

### offset/keyset 分页：按数据规模选择

用途：用于在结果集较小或需要跳到任意页时使用 offset，在大表连续翻页时用最后一条记录做 keyset 游标。

```sql
SELECT id, username FROM account
WHERE status = 'ACTIVE'
  AND (created_at, id) < ('2026-10-01 00:00:00', 120)
ORDER BY created_at DESC, id DESC
LIMIT 20;
-- 输出：返回游标之前的下一页 20 行，不必扫描并丢弃前置页
```

offset 页码越深，数据库通常需要扫描并跳过越多行；keyset 要求排序键稳定、索引匹配且客户端保存游标。排序字段要加入唯一的 tie-breaker，例如 `id`，否则翻页可能重复或漏行。

### 批量写入：控制批次与失败重试

用途：用于减少网络往返写入多行，同时限制单次事务的锁、日志和内存占用。

```sql
INSERT INTO account (username, balance) VALUES
    ('ann', 10.00),
    ('bob', 20.00),
    ('cat', 30.00)
ON DUPLICATE KEY UPDATE balance = VALUES(balance);
-- 输出：一次写入或更新 3 个用户名，冲突行为由唯一键决定
```

批量大小应按行宽、索引数量和日志吞吐压测；失败重试必须考虑唯一键、幂等键和事务回滚。不要把 `ON DUPLICATE KEY UPDATE` 当成所有业务冲突的自动解决方案。

## 继续阅读

- [List 基础](/courses/java/05-泛型与集合/04-List常用API)：组织批量参数和分页结果时查列表的可变性与快照边界。
- [Map 基础](/courses/java/05-泛型与集合/07-Map常用API)：把列名、聚合结果或 JDBC 行映射成键值结构时查 Map 视图语义。
- [String 文本处理](/courses/java/02-数组与文本/02-String与文本处理)：处理 SQL 标识符白名单、状态值和日志文本时查字符串边界。
- [JDBC 与事务](/courses/java/11-工程实践/02-JDBC与事务)：连接、PreparedStatement、提交、回滚和资源释放的 Java 边界。

## 简单案例

```sql
START TRANSACTION;
UPDATE account
SET balance = balance - 10.00, version = version + 1
WHERE id = 1 AND balance >= 10.00;
UPDATE account
SET balance = balance + 10.00, version = version + 1
WHERE id = 2;
COMMIT;
-- 输出：两次更新都成功时转账提交；任一步失败时回滚整个事务
```

一次转账需要在同一连接和事务中完成，并检查每条 `UPDATE` 的影响行数；生产代码还要固定账户加锁顺序、限制事务超时、处理死锁重试和幂等请求。连接池负责复用连接，不会替业务自动判断何时提交。

## 易混点

- `VARCHAR`、`TEXT`、`DECIMAL` 和时间类型表达的语义不同，不能仅按“能存下”选择。
- `EXPLAIN` 显示优化器估算，不等于真实耗时；索引命中还要看 `rows`、排序、回表和锁等待。
- `FOR UPDATE` 只在事务内对符合索引范围的记录提供行锁语义，不是全局互斥锁。
- `DATETIME` 与 `TIMESTAMP` 的时区边界不同，Java `Instant` 等绝对时刻要配合驱动和连接时区验证。
- offset 分页易理解但深页成本高，keyset 分页更快但要求稳定排序键和游标契约。

## 课后小问

1. 为什么建索引后还要运行 `EXPLAIN`？
答案：索引是否被采用取决于谓词、排序、数据分布和统计信息，不能只看索引名称。
解析：需要检查访问类型、候选 key、估算行数、回表和排序，并用真实数据验证计划是否符合预期。

2. `FOR UPDATE` 能否替代整个业务的并发控制？
答案：不能，它只在事务和数据库锁范围内保护记录，幂等、超时和跨资源协调仍需应用设计。
解析：锁会受索引、隔离级别和事务时长影响；慢调用会延长持锁时间，跨服务副作用也不会被数据库回滚。

3. 什么时候优先考虑 keyset 分页？
答案：大表连续向前或向后翻页、且结果有稳定排序键时优先考虑 keyset。
解析：它用游标定位下一段范围，避免深 offset 扫描；需要任意跳页时仍可能选择 offset，但要限制最大页码。

## 本节小结

- MySQL 8.0 文章中的语法和行为以 InnoDB、utf8mb4、明确类型和迁移流程为基线。
- `EXPLAIN` 帮助理解索引和访问路径，但必须结合真实数据、锁等待和实际耗时验证。
- 事务、行锁、JDBC 连接池和批量写入需要分别定义边界与失败路径。
- CTE、窗口函数、keyset 分页和批量写入都是表达能力，不能替代索引、幂等和资源治理。

## 快速回顾

- 能为金额、状态、字符和时间选择合适 MySQL 8.0 类型。
- 能读 `EXPLAIN` 的索引、行数、连接与排序线索。
- 能说明行锁、事务、连接池和 JDBC 资源的责任边界。
- 能在 offset 与 keyset、单行与批量写入之间按规模做取舍。
