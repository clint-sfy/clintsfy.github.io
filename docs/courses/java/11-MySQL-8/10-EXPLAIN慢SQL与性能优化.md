---
title: EXPLAIN、慢 SQL 与性能优化
date: 2026-10-05
category: Java课程
tags: [MySQL, EXPLAIN, 性能]
description: 从估算计划、真实迭代统计与慢日志建立可验证的 SQL 优化循环。
---

# EXPLAIN、慢 SQL 与性能优化

## 学习目标

- 能读懂传统、JSON 与 TREE 计划，并区分估算和实际执行。
- 能从统计信息、慢日志与语句摘要找到优化优先级。
- 能用同一数据与参数比较改写前后，避免凭索引名称判断成功。

## 核心知识点

本节基于 MySQL 8.0 / InnoDB 的 `learning_lab.users/orders` [种子模型](./02-表设计与DDL)，可先完成 [索引实验](./08-约束与索引设计)。种子只有三张订单，用于语义推演，不足以证明生产性能。优化器基于行数、分布、索引和代价选择访问路径，同一 SQL 在不同数据、统计信息、版本与缓存状态下可能有不同计划。

优化循环是：找高总成本或高尾延迟查询 → 保存真实参数与数据分布 → EXPLAIN 检查访问路径 → 有控制地测实际运行 → 改写/索引/统计 → 核对结果等价性与写入代价 → 同条件复测。不能只看“是否走索引”，也不能把三行表的毫秒结果写成普遍承诺。

## 常用用法

### EXPLAIN：读传统计划列

用于在不实际运行目标查询的情况下读取估算访问路径。

```sql
-- 初始：orders含101、102、103三行，PRIMARY(id)存在。
EXPLAIN FORMAT=TRADITIONAL SELECT id,user_id,amount FROM learning_lab.orders WHERE id=101;
-- 关键变化：读取id=101主键查询的估算计划而非订单数据。
-- 输出：检查key=PRIMARY、访问类型与rows估算。
```

显式 TRADITIONAL 避免 8.0.32+ explain_format 改变默认输出。主要列：id/select_type 表示查询块；table 表示对象；partitions 表示分区；type 是访问类型；possible_keys 是候选键；key 是实际键；key_len 是所用键长度；ref 表示比较来源；rows 是估算扫描行数；filtered 是过滤后估算百分比；Extra 包含额外步骤。const、eq_ref、ref、range、index、ALL 含义不同：index 是全索引扫描，不自动等于高效；ALL 在极小表上可能合理。估算 `rows × filtered/100` 帮助判断传给后续步骤的规模，不是精确输出。[计划列](https://dev.mysql.com/doc/refman/8.0/en/explain-output.html)。

### EXPLAIN FORMAT=JSON：查看详细代价与条件

用于读取查询块结构、成本估算和附加条件的机器可读计划。

```sql
-- 初始：用户1有101、102两单，idx_orders_user存在。
EXPLAIN FORMAT=JSON SELECT id,amount FROM learning_lab.orders WHERE user_id=1;
-- 关键变化：返回JSON计划。
-- 输出：检查access_type、key、rows_examined_per_scan与attached_condition（字段按计划适用）。
```

cost_info 是优化器代价模型，不是实测毫秒；没有的字段可能不适用。JSON 不会执行目标查询。不要开启 end_markers_in_json 后仍把输出当合法 JSON 解析。

### EXPLAIN FORMAT=TREE：查看迭代器树

用于在 MySQL 8.0.16+ 观察连接、排序与扫描之间的执行层次。

```sql
-- 初始：两位用户与三张订单。
EXPLAIN FORMAT=TREE SELECT u.id,o.id FROM learning_lab.users u
JOIN learning_lab.orders o ON o.user_id=u.id WHERE u.id=1;
-- 关键变化：返回用户id=1的树形估算路径。
-- 输出：检查各节点的过滤、连接与索引访问层次。
```

TREE 能表达 hash join，传统列不完整呈现这些信息。树形格式与 EXPLAIN ANALYZE 的实际计时是不同能力。[EXPLAIN 格式](https://dev.mysql.com/doc/refman/8.0/en/explain.html)。

### EXPLAIN ANALYZE：核对估算与实际迭代

用于在受控环境实际执行读取查询并获得各迭代器的行数和循环统计。

```sql
-- 初始：MySQL 8.0.18+，独立学习库orders三行。
-- 风险：EXPLAIN ANALYZE会实际执行查询，可能消耗资源并产生锁等待；只在实验库运行本SELECT。
EXPLAIN ANALYZE SELECT id,amount FROM learning_lab.orders WHERE id BETWEEN 101 AND 103;
-- 关键变化：查询被执行，返回TREE中actual time/rows/loops。
-- 输出：结果迭代器实际返回3行；耗时和访问路径按环境变化，不写固定毫秒。
```

actual time 包括子迭代器耗时，多循环时为每循环平均；rows 也需结合 loops 判断累计规模，不能把树节点时间相加当总耗时。在 MySQL 8.0，ANALYZE 使用 TREE，JSON/TRADITIONAL 不支持；8.0.32+ 若 explain_format=JSON，应核对配置并在支持显式格式的小版本使用 FORMAT=TREE。

EXPLAIN ANALYZE 还支持多表 UPDATE、DELETE，它们会真正修改数据，禁止在生产为“看计划”直接运行；普通 EXPLAIN 的可解释语句范围更广，不能据此认为所有单表写语句都支持 ANALYZE。即使 SELECT，也需检查大范围扫描、锁定读、存储函数副作用与负载；事务回滚不是无风险承诺。[实际执行的官方边界](https://dev.mysql.com/doc/refman/8.0/en/explain.html)。

### ANALYZE TABLE：更新索引统计信息

用于在数据分布明显变化后刷新优化器依赖的键分布统计。

```sql
-- 初始：learning_lab.orders为独立3行实验表，已完成索引实验。
-- 风险：ANALYZE TABLE消耗资源并涉及锁，生产大表要评估版本、等待与变更窗口。
ANALYZE TABLE learning_lab.orders;
SHOW INDEX FROM learning_lab.orders;
-- 关键变化：重新采样orders的3行数据并保存键分布统计。
-- 输出：ANALYZE状态通常为OK，Cardinality仍是估算值。
```

ANALYZE 不重建表，也不保证选择新索引。小样本统计误差、数据倾斜与相关列都可能影响估算；先对比估算与实际，再决定是否刷新。[ANALYZE TABLE](https://dev.mysql.com/doc/refman/8.0/en/analyze-table.html)。

### ANALYZE TABLE histogram：采样列值分布

用于为特定列生成直方图，帮助优化器估计非均匀过滤条件。

```sql
-- 初始：orders三行status均NEW，实验账号有所需权限。
-- 风险：UPDATE HISTOGRAM改变统计而非业务行，但会影响查询计划；生产需核对采样范围，此处只处理3行实验表。
ANALYZE TABLE learning_lab.orders UPDATE HISTOGRAM ON status WITH 8 BUCKETS;
SELECT COLUMN_NAME,HISTOGRAM FROM information_schema.COLUMN_STATISTICS
WHERE SCHEMA_NAME='learning_lab' AND TABLE_NAME='orders' AND COLUMN_NAME='status';
-- 关键变化：保存status分布统计。
-- 输出：直方图包含NEW的分布信息，具体JSON按版本读取。
```

直方图不是索引，不能直接定位行；普通 ANALYZE 不等于自动刷新此直方图，数据变化后应按策略更新或删除。唯一键等列存在限制，不能给每列盲目建立。

### SHOW slow_query_log：先读取慢日志配置

用于确认慢日志开关、阈值和输出位置，再决定如何采集。

```sql
-- 初始：learning_lab诊断连接准备读取5个全局配置项。
SHOW GLOBAL VARIABLES WHERE Variable_name IN
 ('slow_query_log','long_query_time','min_examined_row_limit','log_output','slow_query_log_file');
-- 关键变化：读取5项配置。
-- 输出：slow_query_log为实际ON/OFF值，其他行显示long_query_time等4项当前配置。
```

慢日志按执行时间和扫描行阈值等规则选择记录，通常在执行完成并释放锁后写入；顺序不必等于开始顺序。long_query_time 的会话值与全局默认可能不同。生产启用日志、降低阈值或记录未用索引查询会增加 I/O 并暴露 SQL 数据，应先评估权限、保留周期、磁盘容量和脱敏，再走变更流程，不能照抄全局 SET 命令。[慢查询日志](https://dev.mysql.com/doc/refman/8.0/en/slow-query-log.html)。

### SELECT performance_schema：按总耗时找语句

用于从规范化 SQL 摘要中找频繁执行且总成本高的查询。

```sql
-- 初始：performance_schema已启用且摘要采集有效；有读取权限。
SELECT DIGEST_TEXT,COUNT_STAR,SUM_TIMER_WAIT/1000000000000 AS total_seconds,
 SUM_ROWS_EXAMINED,SUM_ROWS_SENT
FROM performance_schema.events_statements_summary_by_digest
WHERE SCHEMA_NAME='learning_lab'
ORDER BY SUM_TIMER_WAIT DESC LIMIT 5;
-- 关键变化：按累计等待时间筛选前5项。
-- 输出：实际摘要、次数、秒数与扫描/发送行数，空集表示尚无可见摘要。
```

计时字段使用皮秒单位，可先换算为秒；摘要把具体字面值归一化。数据依赖采集配置、重置和容量，不是永远完整的历史；进一步查看具体参数、延迟分位和等待事件，不能只凭平均值优化。[语句摘要表](https://dev.mysql.com/doc/refman/8.0/en/performance-schema-statement-summary-tables.html)。

### EXPLAIN sargability：让条件可用于索引查找

用于对比给列包函数与直接写原列范围的过滤形式。

```sql
-- 初始：orders三单均在2026-10-05，created_at可能有联合索引。
EXPLAIN SELECT id FROM learning_lab.orders WHERE user_id=1 AND DATE(created_at)='2026-10-05';
EXPLAIN SELECT id FROM learning_lab.orders WHERE user_id=1
 AND created_at>='2026-10-05' AND created_at<'2026-10-06';
-- 关键变化：第二条改为2026-10-05到06的原列半开区间，保留用户1两单。
-- 输出：比较key、key_len、rows与过滤步骤。
```

sargability 指可利用索引定位条件的形式；索引列函数、隐式类型转换、不同排序规则、前导通配符可能影响定位。函数索引是有前提的另一方案，不是“所有函数必不走索引”。[范围优化](https://dev.mysql.com/doc/refman/8.0/en/range-optimization.html)。

### EXPLAIN JOIN：检查驱动规模与连接代价

用于评估用户与订单连接时中间结果和被连接表的访问方式。

```sql
-- 初始：用户1两张订单，orders.user_id有索引。
EXPLAIN FORMAT=TREE SELECT u.username,o.amount FROM learning_lab.users u
JOIN learning_lab.orders o ON o.user_id=u.id WHERE u.id=1;
-- 关键变化：读取用户id=1的连接层次与扫描估算。
-- 输出：检查每侧过滤行数、连接条件及索引/哈希策略。
```

驱动表由优化器选择，SQL 写左侧不保证先驱动；hash join 的可用条件与 8.0 小版本相关。先缩小无谓结果、核对连接键类型与索引，再考虑提示；EXISTS 可避免只判断存在时展开明细。[Hash Join](https://dev.mysql.com/doc/refman/8.0/en/hash-joins.html)。

### EXPLAIN filesort：判断额外排序是否必要

用于比较索引顺序与金额排序的计划成本。

```sql
-- 初始：用户1两单金额25、15，无(user_id,amount)匹配索引。
EXPLAIN FORMAT=TRADITIONAL SELECT id,amount FROM learning_lab.orders
WHERE user_id=1 ORDER BY amount DESC,id DESC LIMIT 2;
-- 关键变化：读取user_id=1按amount和id降序取2行的排序计划。
-- 输出：检查Extra是否有Using filesort，具体以实际计划为准。
```

filesort 表示不能仅用索引顺序满足排序，不等于必定落磁盘。少量排序可能比额外索引更划算；评估扫描、内存、排序行数与写入代价，不机械消灭标志。[ORDER BY 优化](https://dev.mysql.com/doc/refman/8.0/en/order-by-optimization.html)。

### EXPLAIN temporary：检查聚合中间结果

用于观察不同分组与排序键是否需要临时中间结构。

```sql
-- 初始：三单按user_id分成两组。
EXPLAIN FORMAT=TRADITIONAL SELECT user_id,SUM(amount) AS total
FROM learning_lab.orders WHERE id BETWEEN 101 AND 103 GROUP BY user_id ORDER BY total DESC;
-- 关键变化：读取订单101到103按user_id分组后按总额排序的步骤。
-- 输出：检查Using temporary/Using filesort或TREE中的聚合节点。
```

内部临时表可能在内存或磁盘，并非看到 temporary 就意味着磁盘 I/O；Extra 也不展示所有物化场景。减少不必要列和 DISTINCT，核对聚合粒度，再看统计与计划。[内部临时表](https://dev.mysql.com/doc/refman/8.0/en/internal-temporary-tables.html)。

### EXPLAIN keyset：验证分页扫描范围

用于比较偏移分页与按主键游标继续查询的访问路径。

```sql
-- 初始：主键101、102、103；上一页最后id=101。
EXPLAIN SELECT id FROM learning_lab.orders ORDER BY id LIMIT 2 OFFSET 1;
EXPLAIN SELECT id FROM learning_lab.orders WHERE id>101 ORDER BY id LIMIT 2;
SELECT id FROM learning_lab.orders WHERE id>101 ORDER BY id LIMIT 2;
-- 关键变化：游标增加id>101范围条件，排除上一页订单101。
-- 输出：语义结果102、103，计划性能需真实规模复测。
```

OFFSET=1 在三行表上不是性能问题；生产深偏移才需要评估扫描浪费。按创建时间分页需完整复合游标，见 [分页](./05-查询过滤排序与分页)。复测还要验证结果、并发行为、索引空间与写延迟，保存前后计划及实际统计；只改一项便于归因。

## 易混点

rows 是估算，不是已执行计数；EXPLAIN ANALYZE 才运行查询。成本不等于毫秒，filesort 不等于磁盘，Using index 不等于整体高效。分析工具也会产生负载与权限需求。

## 课后小问

1. 三行表没有使用新索引，是否索引设计错误？

   答：小表扫描可能更便宜，需在代表性数据与参数上验证，不能凭小样本否定设计。

2. 为什么不能直接 ANALYZE 生产多表 DELETE 看真实耗时？

   答：它真正执行删除，会修改数据并持锁；先用普通 EXPLAIN，受控复制环境再验证执行行为。

## 本节小结

从总成本找优先级，用估算计划定位假设，再在受控条件下验证真实行数、时间、等价性与写入代价。

## 快速回顾

- TRADITIONAL 看列，JSON 看结构与代价，TREE 看执行层次。
- EXPLAIN ANALYZE 从8.0.18支持，实际执行且使用TREE。
- 统计、日志与语句摘要是证据，优化应可重复比较。
