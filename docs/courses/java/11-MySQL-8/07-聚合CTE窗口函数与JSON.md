---
title: 聚合、CTE、窗口函数与 JSON
date: 2026-10-05
category: Java课程
tags: [MySQL, 聚合, JSON]
description: 掌握分组粒度、递归终止、窗口帧以及 JSON 值与字符串的区别。
---

# 聚合、CTE、窗口函数与 JSON

## 学习目标

- 能区分 GROUP BY 合并行与窗口函数保留行。
- 能写有终止条件的递归 CTE 并解释并列排名。
- 能读取和修改 JSON，并知道哪些表达式可以建立索引。

## 核心知识点

本节使用 MySQL 8.0 / InnoDB 的 `learning_lab.users/orders` [种子数据](./02-表设计与DDL)。GROUP BY 将多行归为每组一行；窗口函数在当前结果集的分区内计算，保留明细行。CTE 是单条语句内的命名查询，不是永久表，也不保证物化。

默认 SQL mode 含 ONLY_FULL_GROUP_BY：非聚合列需要属于分组键、满足可识别的函数依赖，或被条件限制为单值，不能关闭模式来掩盖不确定查询。COUNT(*) 计行，COUNT(expr) 忽略 NULL；SUM/AVG 等通常忽略 NULL，空集 SUM 返回 NULL，COUNT 返回 0。JSON 原生类型保存结构化值，缺失路径的 SQL NULL 与文档中的 JSON null 不同。[GROUP BY](https://dev.mysql.com/doc/refman/8.0/en/group-by-handling.html)、[聚合函数](https://dev.mysql.com/doc/refman/8.0/en/aggregate-functions.html)。

## 常用用法

### SELECT GROUP BY：按用户汇总订单

用于把订单明细归并为每位用户的订单数与总金额。

```sql
-- 初始：用户1金额25、15，用户2金额40。
SELECT user_id,COUNT(*) AS n,SUM(amount) AS total
FROM learning_lab.orders WHERE id BETWEEN 101 AND 103 GROUP BY user_id ORDER BY user_id;
SELECT COUNT(*) AS rows_n,COUNT(v) AS values_n,SUM(v) AS total
FROM (SELECT 10 AS v UNION ALL SELECT NULL) x;
-- 关键变化：订单归并为两组，NULL不参与SUM与COUNT(v)。
-- 输出：用户1/2/40、用户2/1/40；rows_n=2,values_n=1,total=10。
```

不能在按 user_id 分组的 SELECT 中直接取任意订单 id；同组 id 不唯一。可按业务取 MIN(id)，或用窗口选出具体行。

### SELECT HAVING：过滤聚合后的组

用于保留订单数量至少为两单的用户组。

```sql
-- 初始：用户1两单，用户2一单。
SELECT user_id,COUNT(*) AS n FROM learning_lab.orders
WHERE id BETWEEN 101 AND 103 GROUP BY user_id HAVING COUNT(*)>=2 ORDER BY user_id;
-- 关键变化：聚合之后移除用户2组。
-- 输出：user_id=1,n=2。
```

WHERE 过滤输入行，HAVING 过滤组；能在 WHERE 表达的行条件通常先放 WHERE。HAVING 支持部分别名用法，但明确写聚合表达式更易跨工具阅读。

### WITH：命名中间查询

用于在同一条语句内为汇总结果命名，减少重复 SQL。

```sql
-- 初始：101、102、103三单，总额80。
WITH totals AS (SELECT user_id,SUM(amount) AS amount
 FROM learning_lab.orders WHERE id BETWEEN 101 AND 103 GROUP BY user_id)
SELECT user_id,amount FROM totals ORDER BY user_id;
-- 关键变化：totals提供两行汇总。
-- 输出：1/40、2/40。
```

CTE 只在当前语句有效；写成 WITH 不保证只扫描一次，也不保证比派生表更快，需查看计划。

### WITH RECURSIVE：生成有界序列

用于从锚点逐轮生成小序列并明确终止条件。

```sql
-- 输入：锚点1，递归上限3。
-- 风险：递归缺少终止条件会消耗资源；仅在实验会话生成3行，不提高生产递归上限。
WITH RECURSIVE seq(n) AS (
 SELECT 1 UNION ALL SELECT n+1 FROM seq WHERE n<3
) SELECT n FROM seq ORDER BY n;
SELECT @@session.cte_max_recursion_depth;
-- 关键变化：逐轮新增2、3后终止。
-- 输出：1、2、3，默认深度限制为1000。
```

`cte_max_recursion_depth` 默认 1000，但实际以会话值为准；还应控制执行时间和行数。递归列类型由非递归部分决定，字符串路径增长时在锚点 CAST 到足够宽度，否则可能截断或报错。[WITH 与限制](https://dev.mysql.com/doc/refman/8.0/en/with.html)。

### SELECT ROW_NUMBER()：生成分区内序号

用于按金额排序给每个用户的订单编号，便于选每组第一条。

```sql
-- 初始：用户1有101/25与102/15，用户2有103/40。
SELECT id,user_id,ROW_NUMBER() OVER(PARTITION BY user_id ORDER BY amount DESC,id) AS rn
FROM learning_lab.orders WHERE id BETWEEN 101 AND 103 ORDER BY user_id,rn;
-- 关键变化：用户1的两单编号1、2，用户2重新从1开始。
-- 输出：101/1/1、102/1/2、103/2/1。
```

过滤 rn=1 需外层派生表或 CTE，不能在同层 WHERE 使用窗口结果。ORDER BY 加唯一键保证并列值的编号稳定。

### SELECT RANK()：让并列排名留下空档

用于给相同分数相同名次，并体现被并列占用的后续位置。

```sql
-- 输入：甲40、乙40、丙15，peer按金额定义。
SELECT name,RANK() OVER(ORDER BY amount DESC) AS r
FROM (SELECT 1 display_order,'甲' name,40 amount UNION ALL SELECT 2,'乙',40 UNION ALL SELECT 3,'丙',15) scores
ORDER BY amount DESC,display_order;
-- 关键变化：甲乙并列1，丙跳到3。
-- 输出：甲/1、乙/1、丙/3。
```

窗口 ORDER BY 若加入唯一序号就不再并列；展示顺序在外层另加数值display_order，避免中文姓名的排序规则影响甲乙输出次序。

### SELECT DENSE_RANK()：让并列排名连续

用于给相同分数相同名次，并让下一种分数紧接编号。

```sql
-- 输入：甲40、乙40、丙15。
SELECT name,DENSE_RANK() OVER(ORDER BY amount DESC) AS r
FROM (SELECT 1 display_order,'甲' name,40 amount UNION ALL SELECT 2,'乙',40 UNION ALL SELECT 3,'丙',15) scores
ORDER BY amount DESC,display_order;
-- 关键变化：甲乙并列1，丙得到2。
-- 输出：甲/1、乙/1、丙/2。
```

ROW_NUMBER 给每行独立编号，RANK 留空档，DENSE_RANK 不留空档，选哪种取决于业务排名规则。

### SELECT LAG()：比较前一条记录

用于在时间序列中读取前一条订单金额而无需自连接。

```sql
-- 初始：用户1按id有101/25、102/15。
SELECT id,amount,LAG(amount) OVER(ORDER BY id) AS previous_amount
FROM learning_lab.orders WHERE id IN (101,102) ORDER BY id;
-- 关键变化：第一条无前驱，第二条取前驱25。
-- 输出：101/25/NULL、102/15/25。
```

默认偏移 1，无前驱默认 NULL；多用户时间线需 PARTITION BY user_id。MySQL 当前支持 RESPECT NULLS，IGNORE NULLS 会报错。

### SELECT LEAD()：读取后一条记录

用于观察时间序列下一项或计算相邻间隔。

```sql
-- 初始：用户1订单顺序101、102，金额25、15。
SELECT id,LEAD(amount) OVER(ORDER BY id) AS next_amount
FROM learning_lab.orders WHERE id IN (101,102) ORDER BY id;
-- 关键变化：101得到下一条15，102没有后继。
-- 输出：101/15、102/NULL。
```

窗口的顺序决定前后，不是磁盘顺序。[窗口函数语义](https://dev.mysql.com/doc/refman/8.0/en/window-function-descriptions.html)。

### SELECT OVER：明确 ROWS 与 RANGE 窗口帧

用于控制累计聚合覆盖物理行还是相同排序值的整个 peer 集合。

```sql
-- 输入：a=10,b=10,c=20，排序值前两行相同。
SELECT name,amount,
 SUM(amount) OVER(ORDER BY amount ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW) AS row_sum,
 SUM(amount) OVER(ORDER BY amount RANGE BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW) AS range_sum
FROM (SELECT 'a' name,10 amount UNION ALL SELECT 'b',10 UNION ALL SELECT 'c',20) x
ORDER BY amount,name;
-- 关键变化：ROWS逐行累计，RANGE把同值10两行同时纳入。
-- 输出：a、b的row_sum集合为10、20（peer先后不定），range_sum均20；c两列均40。
```

有 ORDER BY 且未指定帧时，默认 RANGE 从分区开头到当前 peer 末尾；无 ORDER BY 默认整个分区。确定逐行累计可用 `ORDER BY amount,name ROWS ...`；LAST_VALUE 常需把帧末尾改为 UNBOUNDED FOLLOWING 才能取分区末值。排名与 LAG/LEAD 不按聚合帧缩小范围。[窗口帧](https://dev.mysql.com/doc/refman/8.0/en/window-functions-frames.html)。

### SELECT JSON_EXTRACT()：按路径读取 JSON

用于从文档中读取结构化值并观察路径缺失的 SQL NULL。

```sql
-- 输入：{"name":"林同学","vip":true,"note":null}。
SET @profile='{"name":"林同学","vip":true,"note":null}';
SELECT JSON_EXTRACT(@profile,'$.name') AS name,
 JSON_EXTRACT(@profile,'$.missing') IS NULL AS missing;
-- 关键变化：读取JSON字符串与缺失标志。
-- 输出："林同学" | 1。
```

返回 JSON 值而不是自动去引号的 SQL 文本；缺失路径返回 SQL NULL，文档内的 null 是 JSON null。

### SELECT JSON_TYPE()：检查 JSON 值类型

用于区分 JSON null、字符串与其他 JSON 数据类型。

```sql
-- 输入：含note:null与name字符串的文档。
SELECT JSON_TYPE(JSON_EXTRACT('{"note":null,"name":"林同学"}','$.note')) AS note_type,
 JSON_TYPE(JSON_EXTRACT('{"note":null,"name":"林同学"}','$.name')) AS name_type;
-- 关键变化：返回JSON类型标签。
-- 输出：NULL（文本标签）| STRING。
```

JSON_TYPE 的 `NULL` 标签是字符串，不是 SQL NULL。[JSON 类型检查](https://dev.mysql.com/doc/refman/8.0/en/json-attribute-functions.html)。

### SELECT ->：列路径读取简写

用于对 JSON 列使用 JSON_EXTRACT 的路径简写。

```sql
USE learning_lab;
-- 初始：独立表lab_profiles尚不存在；本表也是后两段前置条件。
CREATE TABLE lab_profiles(id INT PRIMARY KEY,doc JSON NOT NULL) ENGINE=InnoDB;
INSERT INTO lab_profiles VALUES (1,'{"name":"林同学","vip":true}');
SELECT id,doc->'$.name' AS name FROM lab_profiles WHERE id=1;
-- 关键变化：保存文档后返回JSON字符串。
-- 输出：1/"林同学"。
```

左侧使用 JSON 列，右侧为路径字面值；前面的 JSON_EXTRACT 示例则可接受表达式参数。

### SELECT ->>：读取去引号文本

用于将 JSON 字符串值解引号后作为 SQL 文本使用。

```sql
-- 前置条件：lab_profiles.id=1含name=林同学。
SELECT doc->>'$.name' AS name,JSON_UNQUOTE(JSON_EXTRACT(doc,'$.name')) AS equivalent
FROM learning_lab.lab_profiles WHERE id=1;
-- 关键变化：id=1的两种表达式都返回去引号文本。
-- 输出：林同学 | 林同学。
```

`->>` 等价于 JSON_UNQUOTE(JSON_EXTRACT(...))，不是对所有 JSON 值做强类型转换。[JSON 搜索与运算符](https://dev.mysql.com/doc/refman/8.0/en/json-search-functions.html)。

### SELECT JSON_SET()：替换或新增路径值

用于生成修改后的文档，并区分函数返回值与持久化写入。

```sql
-- 输入：原文档{"vip":false}，希望新增level并改变vip。
SELECT JSON_SET('{"vip":false}','$.vip',CAST('true' AS JSON),'$.level',2) AS changed;
-- 关键变化：返回的新文档含vip=true、level=2。
-- 输出：两字段分别为JSON布尔与数字。
```

SELECT 不修改原表；持久化需明确 UPDATE 列与主键条件。SQL 字符串 `'true'` 会成为 JSON 字符串，用 CAST 得到 JSON 布尔。JSON_SET 替换存在路径或新增适用路径，不能保证任意不存在的深层父路径都自动创建。[JSON 修改函数](https://dev.mysql.com/doc/refman/8.0/en/json-modification-functions.html)。

### SELECT JSON_ARRAYAGG()：聚合为 JSON 数组

用于将用户订单的金额集合组成一个 JSON 数组。

```sql
-- 初始：用户1有25与15两笔种子订单。
SELECT user_id,JSON_ARRAYAGG(amount) AS amounts FROM learning_lab.orders
WHERE id IN (101,102) GROUP BY user_id;
-- 关键变化：金额25与15合并成user_id=1的数组。
-- 输出：user_id=1，数组包含25与15，顺序不作承诺。
```

JSON_ARRAYAGG 普通聚合的元素顺序未定义；外层 ORDER BY 不能定义数组内部顺序。需稳定顺序时评估支持的窗口用法（8.0.14+）、明确窗口帧，或由应用按有序行构建。不能套用其他数据库的 `JSON_ARRAYAGG(x ORDER BY ...)` 语法。

### ALTER TABLE generated column：为 JSON 字段建受控索引

用于将频繁过滤的 JSON 字符串映射为有界生成列并建立普通索引。

```sql
-- 前置条件：lab_profiles.id=1含name=林同学，profile_name列尚不存在。
ALTER TABLE learning_lab.lab_profiles
 ADD COLUMN profile_name VARCHAR(64) GENERATED ALWAYS AS (doc->>'$.name') STORED,
 ADD INDEX idx_profile_name(profile_name);
SELECT id,profile_name FROM learning_lab.lab_profiles WHERE profile_name='林同学';
EXPLAIN SELECT id FROM learning_lab.lab_profiles WHERE profile_name='林同学';
-- 关键变化：id=1生成可索引姓名林同学，doc改变时生成列随之计算。
-- 输出：1/林同学；计划是否使用索引取决于实际代价。
```

DDL 通常隐式提交且可等待元数据锁；先评估旧文档的类型、长度和缺失值。生成列不能任意赋值，本表只有一行也不能证明性能。8.0.13+ 函数索引需要可索引类型，`->>` 返回文本不能直接作为无限长度索引键，应 CAST 到有界类型，并核对表达式和排序规则。具体见 [函数索引](./08-约束与索引设计#create-index-functional-建立表达式索引)、[生成列](https://dev.mysql.com/doc/refman/8.0/en/create-table-generated-columns.html)。

## 易混点

GROUP BY 改变行数，窗口通常保留行数；窗口 ORDER BY 与最终展示排序相互独立。JSON null、SQL NULL 和字符串 "null" 是三个概念。递归 CTE 的停止条件、深度限制和类型宽度都要检查。

## 课后小问

1. LEFT JOIN 后 COUNT(*) 能代表订单数吗？

   答：无订单用户仍有补行，会计为1；应 COUNT(右表非空主键)。

2. `JSON_SET` 的 SELECT 会更新表吗？

   答：不会，函数返回新值；只有显式写入语句才持久化。

## 本节小结

先定义分组与分区粒度，再定义排序和帧；JSON 操作明确类型与路径，常用过滤字段考虑关系列或受控索引。

## 快速回顾

- COUNT(*) 计行；COUNT(expr) 跳过 NULL。
- RANK 留空档，DENSE_RANK 连续；ROWS 与 RANGE 的 peer 行为不同。
- JSON_EXTRACT 保留 JSON 形态，->> 解引号；JSON_ARRAYAGG 不承诺普通聚合顺序。
