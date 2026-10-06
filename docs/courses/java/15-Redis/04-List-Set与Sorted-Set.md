---
title: List、Set 与 Sorted Set
date: 2026-10-06
category: Java课程
tags: [Java, Redis, 数据结构]
description: 学习 List、Set 与 Sorted Set 的命令、可观察结果、容量与并发边界。
---

# List、Set 与 Sorted Set

## 学习目标

掌握本篇独立命令的输入、返回与状态变化，按访问形状选择结构，并为键、返回数量和失败重试设置边界。

## 核心知识点

本篇采用 Redis 8 稳定主版本的基础命令语义；官方文档核对日期：2026-10-06，不声明未验证的补丁版本。[官方数据类型](https://redis.io/docs/latest/develop/data-types/) 是本章事实依据。

List 按插入位置保序并允许重复，适合简易队列；Set 无序去重，适合成员判断与集合运算；Sorted Set 按 double score 排序、member 唯一，适合排名。两端 List push/pop、Set 单成员操作通常 O(1)；批次受元素数影响。List 随机访问与遍历 O(N)；Sorted Set 写入通常 O(log N)，范围读取 O(log N + M)。必须控制集合基数和返回条数。

实验前提：本机独立 Redis 8 服务在 127.0.0.1:6379 运行；通过终端执行 `redis-cli -h 127.0.0.1 -p 6379` 后在交互提示符输入下面的命令（不是 PowerShell 命令）。有 ACL 时用 `--user lab_user --askpass` 输入密码。示例注释记录返回，不需要把输出复制成输入；不同客户端的数组排版可能不同。

每个 H3 都是独立实验。运行每段前、结束后在数据库 0 执行 `DEL lab:{core}:q lab:{core}:processing lab:{core}:a lab:{core}:b lab:{core}:z`，只清理这些明确的学习 key，不使用通配符、FLUSHDB 或业务库。初始状态：这些 key 均不存在；每段的写入步骤重新创建所需状态。

## 常用用法

### `LPUSH`：把多个元素放入列表左侧以理解插入次序

用于把多个元素放入列表左侧以理解插入次序。

```redis
# 初始：本段实验 key 已按上文清理，数据库 0 内不存在。
LPUSH lab:{core}:q a b
LRANGE lab:{core}:q 0 -1
# 关键变化：先把 a 放左端，再把 b 放左端，列表变为 b,a。
# 输出：整数 2，数组为 "b"、"a"。
```

多个参数逐个放左端，所以参数顺序会反转；LPUSH 加 LPOP 是栈，LPUSH 加 RPOP 是队列。 官方参考：[LPUSH](https://redis.io/docs/latest/commands/lpush/)。

### `RPUSH`：在列表右端追加任务以建立先进先出队列

用于在列表右端追加任务以建立先进先出队列。

```redis
# 初始：本段实验 key 已按上文清理，数据库 0 内不存在。
RPUSH lab:{core}:q a b
LRANGE lab:{core}:q 0 -1
# 关键变化：先追加 a 再追加 b，列表变为 a,b。
# 输出：整数 2，数组为 "a"、"b"。
```

搭配 LPOP 得到 FIFO；List 没有自动确认和重投机制。 官方参考：[RPUSH](https://redis.io/docs/latest/commands/rpush/)。

### `LPOP`：从左端移除一个元素并观察剩余队列

用于从左端移除一个元素并观察剩余队列。

```redis
# 初始：本段实验 key 已按上文清理，数据库 0 内不存在。
RPUSH lab:{core}:q a b
LPOP lab:{core}:q
LRANGE lab:{core}:q 0 -1
# 关键变化：列表先保存 a,b；移除左端 a 后剩余 b。
# 输出：整数 2、"a"，剩余数组为 "b"。
```

空 key 返回 nil；取走后客户端崩溃会丢失处理机会，可靠交付应另设 processing 列表或使用 Stream 消费组。 官方参考：[LPOP](https://redis.io/docs/latest/commands/lpop/)。

### `RPOP`：从右端移除一个元素并观察栈式顺序

用于从右端移除一个元素并观察栈式顺序。

```redis
# 初始：本段实验 key 已按上文清理，数据库 0 内不存在。
RPUSH lab:{core}:q a b
RPOP lab:{core}:q
LRANGE lab:{core}:q 0 -1
# 关键变化：列表先保存 a,b；移除右端 b 后剩余 a。
# 输出：整数 2、"b"，剩余数组为 "a"。
```

RPUSH 与 RPOP 组合是后进先出。 官方参考：[RPOP](https://redis.io/docs/latest/commands/rpop/)。

### `LRANGE`：按闭区间读取有限数量的列表元素

用于按闭区间读取有限数量的列表元素。

```redis
# 初始：本段实验 key 已按上文清理，数据库 0 内不存在。
RPUSH lab:{core}:q a b c
LRANGE lab:{core}:q 0 1
# 关键变化：列表保存 a,b,c；闭区间 0..1 返回 a,b。
# 输出：整数 3，数组为 "a"、"b"。
```

stop 包含末端，-1 指末尾；生产禁止无界拉取巨大列表。复杂度与偏移和返回长度有关。 官方参考：[LRANGE](https://redis.io/docs/latest/commands/lrange/)。

### `LLEN`：读取队列长度以观察积压数量

用于读取队列长度以观察积压数量。

```redis
# 初始：本段实验 key 已按上文清理，数据库 0 内不存在。
RPUSH lab:{core}:q a b
LLEN lab:{core}:q
# 关键变化：q 追加两个元素，读取当前积压数量为 2。
# 输出：整数 2、整数 2。
```

O(1)，长度是等待元素数，不含已弹出但尚未完成的任务。 官方参考：[LLEN](https://redis.io/docs/latest/commands/llen/)。

### `BLPOP`：等待空队列出现元素并限定阻塞超时

用于等待空队列出现元素并限定阻塞超时。

```redis
# 初始：本段实验 key 已按上文清理，数据库 0 内不存在。
BLPOP lab:{core}:q 1
# 关键变化：连接等待约 1 秒，队列仍为空。
# 输出：空队列在约 1 秒后返回 (nil)。
```

阻塞当前客户端连接，其他连接可继续工作；0 表示无限等待。使用专用连接与取消策略，Cluster 多 key 必须同槽，不在普通共享连接上无期限等待。 官方参考：[BLPOP](https://redis.io/docs/latest/commands/blpop/)。

### `LMOVE`：原子把任务转移到处理列表以保留失败恢复线索

用于原子把任务转移到处理列表以保留失败恢复线索。

```redis
# 初始：本段实验 key 已按上文清理，数据库 0 内不存在。
RPUSH lab:{core}:q job-1
LMOVE lab:{core}:q lab:{core}:processing LEFT RIGHT
LRANGE lab:{core}:processing 0 -1
# 关键变化：q 创建 job-1；转移后 q 消失，processing 保存 job-1。
# 输出：整数 1、"job-1"，处理列表为 "job-1"。
```

两键同槽；转移只是可靠队列的一步，处理成功需确认删除，失败需回收与幂等。LMOVE 不阻塞，阻塞版本是 BLMOVE。 官方参考：[LMOVE](https://redis.io/docs/latest/commands/lmove/)。

### `SADD`：向无序集合添加成员并观察去重

用于向无序集合添加成员并观察去重。

```redis
# 初始：本段实验 key 已按上文清理，数据库 0 内不存在。
SADD lab:{core}:a red blue red
SCARD lab:{core}:a
# 关键变化：a 新增 red、blue，重复 red 没有再增加成员。
# 输出：整数 2、整数 2。
```

返回新成员数；不维护插入顺序。 官方参考：[SADD](https://redis.io/docs/latest/commands/sadd/)。

### `SISMEMBER`：判断成员是否在精确去重集合内

用于判断成员是否在精确去重集合内。

```redis
# 初始：本段实验 key 已按上文清理，数据库 0 内不存在。
SADD lab:{core}:a red
SISMEMBER lab:{core}:a red
SISMEMBER lab:{core}:a blue
# 关键变化：a 新增 red；red 存在而 blue 不存在。
# 输出：整数 1、整数 1、整数 0。
```

精确成员判断，适合标签与访问名单；高基数需要相应内存。 官方参考：[SISMEMBER](https://redis.io/docs/latest/commands/sismember/)。

### `SMEMBERS`：枚举小集合的全部成员以检查内容

用于枚举小集合的全部成员以检查内容。

```redis
# 初始：本段实验 key 已按上文清理，数据库 0 内不存在。
SADD lab:{core}:a red blue
SMEMBERS lab:{core}:a
# 关键变化：a 保存两个唯一成员，枚举结果不承诺顺序。
# 输出：整数 2；成员为 red、blue，顺序不保证。
```

O(N)，大集合应改用 SSCAN 并处理重复与并发变化。 官方参考：[SMEMBERS](https://redis.io/docs/latest/commands/smembers/)。

### `SCARD`：读取精确集合基数以核对去重结果

用于读取精确集合基数以核对去重结果。

```redis
# 初始：本段实验 key 已按上文清理，数据库 0 内不存在。
SADD lab:{core}:a red red blue
SCARD lab:{core}:a
# 关键变化：a 接收 red、red、blue，去重后数量为 2。
# 输出：整数 2、整数 2。
```

O(1)，精确计数但需要保存全部成员；只需大规模近似 UV 时考虑 HyperLogLog。 官方参考：[SCARD](https://redis.io/docs/latest/commands/scard/)。

### `SREM`：移除明确成员并观察不存在成员的计数

用于移除明确成员并观察不存在成员的计数。

```redis
# 初始：本段实验 key 已按上文清理，数据库 0 内不存在。
SADD lab:{core}:a red blue
SREM lab:{core}:a red missing
SCARD lab:{core}:a
# 关键变化：a 新增 red、blue；移除 red 成功，missing 无变化，剩余 blue。
# 输出：整数 2、整数 1、整数 1。
```

最后一个成员移除后 key 消失。 官方参考：[SREM](https://redis.io/docs/latest/commands/srem/)。

### `SINTER`：计算共同成员以筛选共享标签

用于计算共同成员以筛选共享标签。

```redis
# 初始：本段实验 key 已按上文清理，数据库 0 内不存在。
SADD lab:{core}:a red blue
SADD lab:{core}:b blue green
SINTER lab:{core}:a lab:{core}:b
# 关键变化：a 保存 red、blue，b 保存 blue、green；交集读取 blue。
# 输出：两个整数 2；交集为 blue。
```

最坏 O(N*M)，N 是最小集合大小、M 是集合数；多键同槽且需要限制集合规模。 官方参考：[SINTER](https://redis.io/docs/latest/commands/sinter/)。

### `SUNION`：计算去重并集以合并成员名单

用于计算去重并集以合并成员名单。

```redis
# 初始：本段实验 key 已按上文清理，数据库 0 内不存在。
SADD lab:{core}:a red blue
SADD lab:{core}:b blue green
SUNION lab:{core}:a lab:{core}:b
# 关键变化：a 与 b 分别创建两成员，并集去重后返回三成员。
# 输出：两个整数 2；并集为 red、blue、green，顺序不保证。
```

O(所有输入成员总数)，输出可能远大于单个输入；Cluster 多键同槽。 官方参考：[SUNION](https://redis.io/docs/latest/commands/sunion/)。

### `SDIFF`：计算有方向的差集以找出未覆盖成员

用于计算有方向的差集以找出未覆盖成员。

```redis
# 初始：本段实验 key 已按上文清理，数据库 0 内不存在。
SADD lab:{core}:a red blue
SADD lab:{core}:b blue green
SDIFF lab:{core}:a lab:{core}:b
# 关键变化：a 与 b 分别创建两成员，从 a 排除 b 的成员后返回 red。
# 输出：两个整数 2；差集为 red。
```

a-b 与 b-a 不同；O(输入成员总数)，Cluster 多键同槽。 官方参考：[SDIFF](https://redis.io/docs/latest/commands/sdiff/)。

### `ZADD`：给唯一成员写入分数以建立排名

用于给唯一成员写入分数以建立排名。

```redis
# 初始：本段实验 key 已按上文清理，数据库 0 内不存在。
ZADD lab:{core}:z 10 Ann 20 Bob
ZADD lab:{core}:z 30 Ann
ZSCORE lab:{core}:z Ann
# 关键变化：z 新增 Ann=10、Bob=20；随后 Ann 更新为 30，没有新增 member。
# 输出：整数 2、整数 0、"30"。
```

默认返回新成员数；同 member 更新分数。double 精确整数范围为 ±2^53，同分按 member 字节的字典序排列。 官方参考：[ZADD](https://redis.io/docs/latest/commands/zadd/)。

### `ZRANGE`：按排名或分数读取有界的排行榜

用于按排名或分数读取有界的排行榜。

```redis
# 初始：本段实验 key 已按上文清理，数据库 0 内不存在。
ZADD lab:{core}:z 10 Ann 20 Bob
ZRANGE lab:{core}:z 0 1 REV WITHSCORES
ZRANGE lab:{core}:z 10 20 BYSCORE WITHSCORES
# 关键变化：z 保存 Ann=10、Bob=20；读取降序排名和升序分数区间。
# 输出：整数 2；第一数组为 Bob,20,Ann,10，第二为 Ann,10,Bob,20。
```

rank 从 0 开始，两端包含；REV 倒序，BYSCORE 改为分数区间。优先统一 ZRANGE 选项而非旧 ZREVRANGE；O(log N + M)。 官方参考：[ZRANGE](https://redis.io/docs/latest/commands/zrange/)。

### `ZSCORE`：读取单个成员当前的分数

用于读取单个成员当前的分数。

```redis
# 初始：本段实验 key 已按上文清理，数据库 0 内不存在。
ZADD lab:{core}:z 10 Ann
ZSCORE lab:{core}:z Ann
ZSCORE lab:{core}:z missing
# 关键变化：z 保存 Ann=10，missing 不存在，读取区分分数与 nil。
# 输出：整数 1、"10"、(nil)。
```

O(1)，零分数和不存在 member 不同。 官方参考：[ZSCORE](https://redis.io/docs/latest/commands/zscore/)。

### `ZRANK`：读取成员从零开始的升序排名

用于读取成员从零开始的升序排名。

```redis
# 初始：本段实验 key 已按上文清理，数据库 0 内不存在。
ZADD lab:{core}:z 10 Ann 20 Bob
ZRANK lab:{core}:z Bob
# 关键变化：z 保存两成员；升序位置 Ann=0、Bob=1。
# 输出：整数 2、整数 1。
```

O(log N)，面向用户显示名次时通常加 1；降序排名使用 ZREVRANK。 官方参考：[ZRANK](https://redis.io/docs/latest/commands/zrank/)。

### `ZINCRBY`：原子调整成员分数并观察累计排名依据

用于原子调整成员分数并观察累计排名依据。

```redis
# 初始：本段实验 key 已按上文清理，数据库 0 内不存在。
ZADD lab:{core}:z 10 Ann
ZINCRBY lab:{core}:z 5 Ann
ZSCORE lab:{core}:z Ann
# 关键变化：Ann 分数从 10 累加 5 后变为 15。
# 输出：整数 1、"15"、"15"。
```

不能用浮点分数存精确财务金额；写超时盲重试可能重复加分。 官方参考：[ZINCRBY](https://redis.io/docs/latest/commands/zincrby/)。

### `ZREM`：移除排名成员并确认后续查询缺失

用于移除排名成员并确认后续查询缺失。

```redis
# 初始：本段实验 key 已按上文清理，数据库 0 内不存在。
ZADD lab:{core}:z 10 Ann
ZREM lab:{core}:z Ann
ZSCORE lab:{core}:z Ann
# 关键变化：Ann 创建后被移除，z 最后一个成员消失，后续读取为 nil。
# 输出：整数 1、整数 1、(nil)。
```

GEO 索引也使用 ZREM 删除地点，但不要对 GEO 索引任意改写 score。 官方参考：[ZREM](https://redis.io/docs/latest/commands/zrem/)。

## 易混点

队列的顺序、成功处理和可靠交付是三个独立契约；弹出不等于完成任务。集合没有固定返回顺序，同分排名也需解释 member 的字典序。

## 课后小问

1. 本篇怎样验证示例没有依赖上一次实验？

答案：每个小节先清理明确实验 key，再按本段重建输入，读回结果后清理；连接与认证例按注明的连接前置条件执行。

2. 网络超时后能否直接重试写操作？

答案：不能由超时推断服务端未执行。对计数、入队、事件追加等写操作应设计幂等、重试上限与恢复路径。

## 本节小结

按输入与输出验证命令语义，再评估数据量、阻塞时间、精度和失败路径；实验清理只针对明确学习 key。

## 快速回顾

能根据本篇 H3 搜索命令、重建初始状态、解释返回值，并说明哪些边界需要客户端或业务协议补齐。
