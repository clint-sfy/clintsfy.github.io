---
title: 表设计与 DDL
date: 2026-10-05
category: Java课程
tags: [Java, MySQL, DDL]
description: 建立贯穿章节的用户与订单模型，区分建表、结构演进、清空与删除的事务边界。
---

# 表设计与 DDL

## 学习目标

- 能为用户和订单选择主键、金额字段和合理默认值。
- 能检查并演进表结构，区分 ALTER、RENAME、TRUNCATE 与 DROP。
- 能解释原子 DDL 与业务事务回滚的区别。

## 核心知识点

DDL（Data Definition Language）定义对象，DML（Data Manipulation Language）修改行。本章固定 MySQL 8.0 / InnoDB；先完成 [实验库连接](./01-环境连接与数据库对象)。`users` 是用户，`orders.user_id` 表示订单所属用户；真正的外键、CHECK 与索引取舍将在约束篇展开。

MySQL 8.0 对受支持的 InnoDB DDL 提供原子性：数据字典、存储引擎变更与二进制日志在单个 DDL 中协调成功或失败。但这不等于可用 `ROLLBACK` 撤回 DDL，也不等于多条 DDL 是一个事务。通常 DDL 会在执行前、执行后隐式提交；不得与待回滚的业务写入混用。[官方原子 DDL 说明](https://dev.mysql.com/doc/refman/8.0/en/atomic-ddl.html)、[隐式提交清单](https://dev.mysql.com/doc/refman/8.0/en/implicit-commit.html)。

## 常用用法

### CREATE TABLE：建立用户与订单基础模型

用于在空实验库中建立后续查询共用的实体及明确的列约束。

```sql
USE learning_lab;
-- 初始：users、orders 均不存在；在独立实验库按顺序执行一次。
CREATE TABLE users (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  username VARCHAR(64) NOT NULL,
  balance DECIMAL(12,2) NOT NULL DEFAULT 0.00,
  status VARCHAR(16) NOT NULL DEFAULT 'ACTIVE',
  created_at DATETIME(6) NOT NULL,
  PRIMARY KEY (id),
  UNIQUE KEY uk_users_username (username)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
CREATE TABLE orders (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  user_id BIGINT UNSIGNED NOT NULL,
  amount DECIMAL(12,2) NOT NULL,
  status VARCHAR(16) NOT NULL DEFAULT 'NEW',
  created_at DATETIME(6) NOT NULL,
  PRIMARY KEY (id),
  KEY idx_orders_user (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
INSERT INTO users(id, username, balance, created_at) VALUES
  (1, '林同学', 100.00, '2026-10-05 09:00:00'),
  (2, '陈同学', 50.00, '2026-10-05 09:10:00');
INSERT INTO orders(id, user_id, amount, created_at) VALUES
  (101, 1, 25.00, '2026-10-05 10:00:00'),
  (102, 1, 15.00, '2026-10-05 10:05:00'),
  (103, 2, 40.00, '2026-10-05 10:10:00');
-- 关键变化：创建两表并写入种子数据；users=2 行，orders=3 行。
SELECT id, username, balance FROM users ORDER BY id;
SELECT id, user_id, amount FROM orders ORDER BY id;
-- 输出：用户余额 1/100.00、2/50.00；订单金额 101/25.00、102/15.00、103/40.00。
```

日期按业务约定的北京时间写入，`DATETIME` 本身不记录时区。显式 ID 便于后续可重复推演，但生产插入通常让自增分配 ID。此阶段尚未添加外键，删除用户不会自动检查订单；不能据此误认为业务关联已得到数据库保护。

### ALTER TABLE：为存量数据新增列

用于给已有用户增加可空昵称，并检查旧行如何体现新结构。

```sql
USE learning_lab;
-- 初始：users 有 id=1、2，尚无 nickname 列。
ALTER TABLE users ADD COLUMN nickname VARCHAR(64) NULL;
-- 关键变化：users 新增 nickname；旧行读取该字段为 NULL。
SELECT id, nickname FROM users ORDER BY id;
SHOW CREATE TABLE users;
-- 输出：id=1、2 的 nickname 均为 NULL，建表定义包含 nickname 列。
```

结构变更可能等待元数据锁或重建大表。`ALGORITHM=INSTANT` 的支持取决于 8.0 小版本与具体操作；不要将本例宣传为生产环境无锁。迁移前检查版本、表规模、长事务与可恢复备份；不能靠 `ROLLBACK` 撤销此 ALTER。

### RENAME TABLE：变更实验表名

用于在不复制行数据的情况下调整独立实验表的名称。

```sql
USE learning_lab;
-- 初始：lab_rename、lab_renamed 均不存在。
CREATE TABLE lab_rename (id INT PRIMARY KEY) ENGINE=InnoDB;
INSERT INTO lab_rename VALUES (7);
-- 风险：RENAME TABLE 影响对象名称及依赖，仅在实验库确认目标名空闲后执行。
RENAME TABLE lab_rename TO lab_renamed;
-- 关键变化：id=7 保留在 lab_renamed，旧名称不再可查询。
SELECT id FROM lab_renamed;
-- 输出：id=7。
```

生产重命名要检查视图、应用 SQL、表权限与元数据锁；不要默认所有依赖都会自动修复。

### TRUNCATE TABLE：清空独立实验表

用于演示保留表结构但移除全部行和重置自增计数器的效果。

```sql
USE learning_lab;
CREATE TABLE lab_truncate (id INT AUTO_INCREMENT PRIMARY KEY) ENGINE=InnoDB;
INSERT INTO lab_truncate VALUES (NULL), (NULL);
-- 初始：lab_truncate 含 id=1、2；已核对当前库和独立实验表。
-- 风险：TRUNCATE 不可事务回滚，清空全表；仅在测试环境确认无需恢复的数据上执行。
TRUNCATE TABLE lab_truncate;
-- 关键变化：lab_truncate 删除全部行，表结构保留，自增计数器重置。
SELECT COUNT(*) FROM lab_truncate;
INSERT INTO lab_truncate VALUES (NULL);
SELECT id FROM lab_truncate;
-- 输出：COUNT(*) 为 0；重新插入的 id 为 1。
```

TRUNCATE 是 DDL，不能当成“更快且可回滚的 DELETE”；也不会逐行触发 DELETE 触发器，被其他表外键引用的 InnoDB 表通常不能这样清空。

### DROP TABLE：移除独立实验对象

用于删除已确认不再需要的实验表及其结构。

```sql
USE learning_lab;
CREATE TABLE lab_drop (id INT PRIMARY KEY) ENGINE=InnoDB;
INSERT INTO lab_drop VALUES (9);
-- 初始：lab_drop 含 id=9，已确认没有需要保留的数据和依赖。
-- 风险：DROP TABLE 删除结构和数据且不可回滚，仅在测试环境核对备份和表名后执行。
DROP TABLE lab_drop;
-- 关键变化：移除 lab_drop 对象；以下元数据查询返回 0。
SELECT COUNT(*) FROM information_schema.tables
WHERE table_schema='learning_lab' AND table_name='lab_drop';
-- 输出：COUNT(*)=0，lab_drop 已不存在。
```

不要用 `IF EXISTS` 掩盖连错库或对象名错误；生产删除先明确影响范围、依赖与恢复方案。

## 易混点

主键唯一标识一行，业务唯一键限制用户名重复；两者承担不同职责。`DEFAULT` 是省略列时的默认值，不会修复显式传入的错误值。TRUNCATE 保留定义，DROP 删除对象，DELETE 按条件逐行删除并可参与 InnoDB 事务。

## 课后小问

1. 原子 DDL 能否意味着先建两张表再统一 ROLLBACK？

   答：不能。原子性针对受支持的单条 DDL，普通 DDL 隐式提交，不参与业务事务回滚。

2. 为什么金额不用 DOUBLE？

   答：浮点数是近似值，金额通常需要确定的十进制精度；应按上限与小数位选择 DECIMAL。

## 本节小结

- users 与 orders 是后续章节共用的基础表和种子数据。
- 结构演进需检查已有数据、版本支持与元数据锁。
- 原子 DDL 不提供多语句业务事务回滚能力。

## 快速回顾

- `CREATE TABLE` 明确列、主键、引擎和字符集。
- `ALTER TABLE` 修改结构，先评估存量数据影响。
- `TRUNCATE` 清空表，`DROP` 删除对象，均需恢复边界。
