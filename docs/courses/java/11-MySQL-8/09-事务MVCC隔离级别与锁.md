---
title: 事务、MVCC、隔离级别与锁
date: 2026-10-05
category: Java课程
tags: [MySQL, InnoDB, 事务]
description: 通过两会话实验区分快照与当前读，理解记录、间隙、临键锁及死锁重试边界。
---

# 事务、MVCC、隔离级别与锁

## 学习目标

- 能用短事务完成完整业务变更并处理提交、回滚与保存点。
- 能解释 RR 的读视图与当前读为什么可能看到不同值。
- 能根据等待证据区分行锁、元数据锁与死锁，并设计幂等重试。

## 核心知识点

本节固定 MySQL 8.0 / InnoDB 的 `learning_lab.users/orders` [种子模型](./02-表设计与DDL)。ACID 分别指原子性、在约束与业务规则下的一致性、隔离性、持久性；事务并不能自动保证“余额等于真实账目”等所有业务不变量。持久性还依赖日志刷新配置、硬件与故障类型，不能把数据库成功响应理解为任何灾难下绝不丢失。[InnoDB 与 ACID](https://dev.mysql.com/doc/refman/8.0/en/mysql-acid.html)。

默认隔离级别 REPEATABLE READ（RR）。READ UNCOMMITTED 可脏读；READ COMMITTED（RC）每次一致性读建立新快照；RR 一般复用首次一致性读的快照；SERIALIZABLE 在 autocommit 关闭时可把普通 SELECT 变为共享锁定读，降低并发。MVCC 利用行版本与 undo，读视图判断版本可见性；普通 START TRANSACTION 通常并不立即创建快照，WITH CONSISTENT SNAPSHOT 在 RR 下可显式建立一致性快照。自己事务已写的行可见，不能把快照理解为事务永远看到一份不可变的旧数据库。

两会话实验只在隔离学习库进行，使用 A、B 两个 mysql 连接按指定顺序执行，必要时第三个连接观察。所有锁实验在几秒内结束；持锁事务中不要调用远程服务或等待人工操作。下面范围锁用独立 lab_lock 表，避免为业务表无意锁住大范围。

## 常用用法

### START TRANSACTION：演练转账的原子性

用于把两次余额变更组成同一个提交或回滚单元。

```sql
USE learning_lab;
-- 初始：users.id=1余额100，id=2余额50。
START TRANSACTION;
-- 风险：UPDATE会持有行锁至事务结束；按已核对主键演练，保持短事务并回滚。
UPDATE users SET balance=balance-10 WHERE id=1 AND balance>=10;
SELECT ROW_COUNT() AS debited;
-- 风险：UPDATE目标必须明确，实际业务仅在上一条成功且业务校验通过后入账。
UPDATE users SET balance=balance+10 WHERE id=2;
SELECT id,balance FROM users WHERE id IN (1,2) ORDER BY id;
ROLLBACK;
SELECT id,balance FROM users WHERE id IN (1,2) ORDER BY id;
-- 关键变化：事务中余额90/60，回滚后恢复100/50。
-- 输出：debited=1；最终1/100、2/50。
```

正式实现应检查每步受影响行数，失败回滚完整事务，成功才 COMMIT。单独扣减与入账若分两次提交，中间失败会破坏业务一致性；此 SQL 演练不能代替应用中的异常分支。[事务语句](https://dev.mysql.com/doc/refman/8.0/en/commit.html)。

### SET autocommit：核对自动提交

用于观察会话事务模式并在独立实验连接恢复默认行为。

```sql
-- 初始：新的学习连接未开启事务，默认autocommit=1。
SELECT @@session.autocommit;
SET SESSION autocommit=0;
SELECT @@session.autocommit;
ROLLBACK;
SET SESSION autocommit=1;
SELECT @@session.autocommit;
-- 关键变化：自动提交从1变0再恢复1。
-- 输出：1、0、1。
```

从 0 改为 1 会提交当前事务，因此先 ROLLBACK；连接池复用必须恢复连接状态。autocommit=1 不阻止显式 START TRANSACTION，显式事务仍需结束。多数 DDL 有隐式提交边界。[autocommit](https://dev.mysql.com/doc/refman/8.0/en/innodb-autocommit-commit-rollback.html)。

### SAVEPOINT：撤销事务的一部分

用于保留前一步修改并回滚后一步实验变更。

```sql
-- 初始：用户1余额100。
START TRANSACTION;
-- 风险：UPDATE会持锁，限已核对主键的短事务实验并最终回滚。
UPDATE learning_lab.users SET balance=90 WHERE id=1;
SAVEPOINT before_second;
-- 风险：第二次UPDATE仍在同一持锁事务，实验后立即结束事务。
UPDATE learning_lab.users SET balance=80 WHERE id=1;
ROLLBACK TO SAVEPOINT before_second;
SELECT balance FROM learning_lab.users WHERE id=1;
RELEASE SAVEPOINT before_second;
ROLLBACK;
-- 关键变化：80撤销到90，完整回滚后100。
-- 输出：中间SELECT为90。
```

ROLLBACK TO 不是完整事务结束；不能假定它释放所有已取得行锁。保存点不允许撤销已隐式提交的 DDL。[SAVEPOINT](https://dev.mysql.com/doc/refman/8.0/en/savepoint.html)。

### SET TRANSACTION：指定下一个事务的隔离

用于只改变接下来一个事务的隔离策略，避免修改其他连接。

```sql
-- 初始：当前连接没有活动事务，默认会话为RR。
SET TRANSACTION ISOLATION LEVEL READ COMMITTED;
START TRANSACTION;
SELECT balance FROM learning_lab.users WHERE id=1;
COMMIT;
-- 关键变化：本次事务按RC读取已提交版本。
-- 输出：无并发时余额100。
```

无 SESSION 的 SET TRANSACTION 作用于下一事务，不能在活动事务中改变其隔离；SESSION 形式影响随后事务。不要把 @@session.transaction_isolation 当成一次性下一事务设置的验证器。[隔离级别](https://dev.mysql.com/doc/refman/8.0/en/innodb-transaction-isolation-levels.html)。

### SELECT snapshot read：观察 RR 读视图

用于在两会话交错中验证首次一致性读与后续快照读。

```sql
-- 初始：用户1余额100，A/B均无活动事务；按编号交错执行。
-- A 1：创建事务并首次一致性读，返回100。
SET TRANSACTION ISOLATION LEVEL REPEATABLE READ;
START TRANSACTION;
SELECT balance FROM learning_lab.users WHERE id=1;
-- B 2：另一个连接执行以下三句。
START TRANSACTION;
-- 风险：UPDATE会持行锁，仅按id=1实验，立即提交避免阻塞。
UPDATE learning_lab.users SET balance=110 WHERE id=1;
COMMIT;
-- A 3：在A原事务继续读，随后结束事务。
SELECT balance FROM learning_lab.users WHERE id=1;
COMMIT;
SELECT balance FROM learning_lab.users WHERE id=1;
-- 关键变化：A事务内仍读100，结束后新读返回110。
-- 输出：A的三次SELECT依次100、100、110。
```

代码中 A/B 标记表示两个连接，不能整段粘进一个连接。完成后另开短事务按主键把余额恢复 100 再提交（仅学习库）。RC 在 B 提交后第二次一致性读会看到 110。普通快照读不加这些行的记录锁，但仍涉及元数据锁；[一致性读](https://dev.mysql.com/doc/refman/8.0/en/innodb-consistent-read.html)。

### SELECT FOR UPDATE：观察当前读与记录锁

用于读取最新可锁定记录，并阻止其他事务同时修改目标行。

```sql
-- 初始：沿用上一实验A原事务第二次读之后、COMMIT之前，B已提交110。
-- 风险：FOR UPDATE会持排他锁至事务结束；仅在实验库按唯一主键读取，保持短事务。
SELECT balance FROM learning_lab.users WHERE id=1 FOR UPDATE;
ROLLBACK;
-- 关键变化：当前读读取并锁定已提交的110，而A先前快照读为100。
-- 输出：110；ROLLBACK释放本次锁。
```

此段是上一实验 A 第三步 COMMIT 的替代分支，需重跑交错前置条件。完整唯一键等值查找已存在行时通常仅锁记录，不锁前间隙；不存在键、非唯一条件、范围查询则不同。UPDATE/DELETE 也是当前读，不能用“RR 永远只能修改旧快照”推断写入结果。[锁定读](https://dev.mysql.com/doc/refman/8.0/en/innodb-locking-reads.html)。

### SELECT FOR SHARE：持共享记录锁

用于在短事务内允许其他共享读取但阻止目标行被并发修改。

```sql
-- 初始：用户2余额50，没有其他持锁事务。
START TRANSACTION;
-- 风险：FOR SHARE会阻塞目标行写入；按主键限制范围并立即结束实验事务。
SELECT balance FROM learning_lab.users WHERE id=2 FOR SHARE;
ROLLBACK;
-- 关键变化：取得id=2的共享记录锁后释放。
-- 输出：50。
```

锁定读需显式事务或关闭自动提交才能跨后续语句保留锁。NOWAIT 快速报错、SKIP LOCKED 跳过行会改变结果语义，适合经过设计的队列场景，不能当成通用一致性查询。

### SELECT gap lock：锁住不存在键的间隙

用于演示 RR 下缺失主键的锁定查找如何阻塞间隙内插入。

```sql
USE learning_lab;
-- 初始：独立lab_lock不存在；只创建一次，含键10、20、30。
CREATE TABLE lab_lock(id INT PRIMARY KEY,value INT NOT NULL) ENGINE=InnoDB;
INSERT INTO lab_lock VALUES (10,1),(20,2),(30,3);
-- A：RR短事务查不存在的15。
SET TRANSACTION ISOLATION LEVEL REPEATABLE READ;
START TRANSACTION;
-- 风险：FOR UPDATE会锁住(10,20)间隙并阻塞插入；仅在隔离实验表，观察后立即回滚A。
SELECT * FROM lab_lock WHERE id=15 FOR UPDATE;
-- B：另一个连接先设短超时，再尝试插入。
SET SESSION innodb_lock_wait_timeout=3;
START TRANSACTION;
INSERT INTO lab_lock VALUES (15,9);
ROLLBACK;
-- A：B超时并回滚后，回到A执行ROLLBACK。
ROLLBACK;
-- 关键变化：A返回空集仍锁住间隙，B插入等待后失败。
-- 输出：B在A未结束时收到1205，最终表仍只有10、20、30。
```

B 的 INSERT 超时后需在 B 显式 ROLLBACK，再切回 A。间隙锁目的在于禁止插入；不同事务间 gap 锁可相容，不能把其 S/X 标签当记录锁冲突规则。RC 一般关闭查询的间隙锁，但外键与重复键检查仍可使用。

### SELECT next-key lock：观察范围与幻行边界

用于演示 RR 的范围锁定读取如何保护范围内的插入位置。

```sql
-- 前置条件：lab_lock只有10、20、30，没有其他活动事务。
SET TRANSACTION ISOLATION LEVEL REPEATABLE READ;
START TRANSACTION;
-- 风险：FOR UPDATE范围扫描可能锁住目标外的边界间隙；仅在3行实验表，立即回滚。
SELECT id FROM learning_lab.lab_lock WHERE id>=10 AND id<30 FOR UPDATE;
SELECT LOCK_TYPE,LOCK_MODE,LOCK_DATA FROM performance_schema.data_locks
WHERE OBJECT_SCHEMA='learning_lab' AND OBJECT_NAME='lab_lock';
ROLLBACK;
-- 关键变化：返回10、20并取得范围相关锁。
-- 输出：锁视图可见RECORD锁，具体模式以实际访问路径为准。
```

next-key 是记录锁与前间隙的组合（典型区间 `(前键,当前键]`），扫描可能覆盖上界记录前的间隙。幻读是同一条件再读出现新增/消失匹配行：RR 普通一致性读用快照处理可见性，范围当前读可通过 next-key 限制插入；混合快照与当前读不能概括成“RR 消灭一切幻读”。[InnoDB 锁](https://dev.mysql.com/doc/refman/8.0/en/innodb-locking.html)。

### SELECT intention lock：观察表级意向锁

用于在锁视图中看到行锁之前的表级意向排他标记。

```sql
-- 初始：lab_lock.id=10存在，无其他事务。
START TRANSACTION;
-- 风险：FOR UPDATE持目标行锁，仅在实验表按主键并立即回滚。
SELECT id FROM learning_lab.lab_lock WHERE id=10 FOR UPDATE;
SELECT LOCK_TYPE,LOCK_MODE FROM performance_schema.data_locks
WHERE OBJECT_SCHEMA='learning_lab' AND OBJECT_NAME='lab_lock' AND LOCK_TYPE='TABLE';
ROLLBACK;
-- 关键变化：行排他锁配套表级IX。
-- 输出：TABLE/IX。
```

IS/IX 声明将对行加共享/排他锁，不表示整个表所有行都被排他锁定；它们协调行锁与表锁的兼容性。

### SELECT metadata lock：区分对象定义锁

用于查看事务读取表后持有的元数据锁及其授予状态。

```sql
-- 初始：学习连接可读取performance_schema，lab_lock存在。
START TRANSACTION;
SELECT id FROM learning_lab.lab_lock WHERE id=10;
SELECT OBJECT_TYPE,LOCK_TYPE,LOCK_STATUS FROM performance_schema.metadata_locks
WHERE OBJECT_SCHEMA='learning_lab' AND OBJECT_NAME='lab_lock';
ROLLBACK;
-- 关键变化：事务访问表后保留MDL直到结束。
-- 输出：可见GRANTED锁（需相关instrument开启）。
```

本例不发 DDL；若另一连接 ALTER 此表，可能等待事务释放 MDL。行锁等待与 MDL 等待查不同视图；普通 SELECT 不加行记录锁也会阻碍 DDL。生产不能为了“试一试”执行大表 ALTER。[元数据锁](https://dev.mysql.com/doc/refman/8.0/en/metadata-locking.html)。

### SHOW ENGINE INNODB STATUS：读取死锁证据

用于查看最近一次检测到的死锁与事务等待信息。

```sql
-- 初始：有PROCESS权限的诊断连接；当前学习库没有人为制造死锁。
SHOW ENGINE INNODB STATUS;
-- 关键变化：读取InnoDB状态文本，有死锁时可见LATEST DETECTED DEADLOCK。
-- 输出：若服务器曾检测死锁可见LATEST DETECTED DEADLOCK，否则该段可缺省。
```

死锁是循环等待：例如 A 先锁10后请求20，B 先锁20后请求10。此处不主动制造阻塞，按证据识别受害事务和索引。InnoDB 检测后通常回滚受害事务并报1213；1205锁等待超时默认只回滚当前语句（受 `innodb_rollback_on_timeout` 影响），应用应显式回滚完整业务事务再考虑重试。重试需有次数、退避与幂等业务键，不能仅重跑最后一句；提交结果未知时先查业务状态，防止重复扣款。固定加锁顺序、合理索引和短事务降低概率，不能保证永无死锁。[死锁处理](https://dev.mysql.com/doc/refman/8.0/en/innodb-deadlocks-handling.html)、[错误处理](https://dev.mysql.com/doc/refman/8.0/en/innodb-error-handling.html)。

### SELECT data_lock_waits：关联等待与阻塞

用于在第三个诊断连接查看行锁等待双方的事务关系。

```sql
-- 前置条件：gap实验中A未回滚且B尚在3秒等待窗口；诊断账号可读performance_schema。
SELECT REQUESTING_ENGINE_TRANSACTION_ID,BLOCKING_ENGINE_TRANSACTION_ID
FROM performance_schema.data_lock_waits;
-- 关键变化：读取B在3秒窗口内等待A的关系。
-- 输出：若等待仍在会返回请求方B与阻塞方A，结束后该行消失。
```

锁视图是瞬时状态，查询晚了空集并不证明从未阻塞。可联合 data_locks 与 threads 查对象、线程和 SQL；先确认业务归属再处理阻塞源，不自动终止陌生会话。[锁等待表](https://dev.mysql.com/doc/refman/8.0/en/performance-schema-data-lock-waits-table.html)。

## 易混点

快照读、当前读和 MDL 是不同维度；无索引的锁定扫描可能锁大量记录，WHERE 精确不代表锁范围必然小。事务超时与死锁回滚范围不同。数据库事务不覆盖外部 HTTP、邮件或缓存写入。

## 课后小问

1. START TRANSACTION 后、首次 SELECT 前别人提交，RR 能否读到？

   答：普通开启事务通常尚未建立读视图，首次一致性读可见此前提交；显式一致性快照是另一个边界。

2. 1205 后为何通常回滚再重试整个事务？

   答：默认可能仅撤销失败语句，前面成功写入仍在；完整回滚配合幂等重试才能明确业务边界。

## 本节小结

用完整业务事务表达原子性，用隔离和访问路径判断可见性与锁范围，用实际等待证据定位问题；重试是业务设计的一部分。

## 快速回顾

- RR 首次一致性读建快照，RC 每次新快照；当前读读取可锁定的新版本。
- 记录锁、gap、next-key 限制不同位置；IX 不等于全表排他。
- 1213与1205分开处理，事务结束后重试且必须幂等。
