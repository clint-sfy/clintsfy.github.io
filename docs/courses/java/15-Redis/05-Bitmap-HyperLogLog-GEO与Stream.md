---
title: Bitmap、HyperLogLog、GEO 与 Stream
date: 2026-10-06
category: Java课程
tags: [Java, Redis, 数据结构]
description: 学习 Bitmap、HyperLogLog、GEO 与 Stream 的命令、可观察结果、容量与并发边界。
---

# Bitmap、HyperLogLog、GEO 与 Stream

## 学习目标

掌握本篇独立命令的输入、返回与状态变化，按访问形状选择结构，并为键、返回数量和失败重试设置边界。

## 核心知识点

本篇采用 Redis 8 稳定主版本的基础命令语义；官方文档核对日期：2026-10-06，不声明未验证的补丁版本。[官方数据类型](https://redis.io/docs/latest/develop/data-types/) 是本章事实依据。

Bitmap 在 String 上按位保存精确布尔值，适合连续且有上限的 ID；稀疏巨大 ID 可能造成内存浪费。HyperLogLog 只保存近似基数状态，不能列举、判断或删除单个成员；典型标准误差 0.81%，寄存器负载最多约 12 KB（另有对象开销），不是每次误差上限。GEO 是 Sorted Set 上的空间索引；球面距离是近似值，不用于精密测量。Stream 是有 ID 的追加日志，普通读取与消费组确认不同，本篇先掌握基本追加与读取。

实验前提：本机独立 Redis 8 服务在 127.0.0.1:6379 运行；通过终端执行 `redis-cli -h 127.0.0.1 -p 6379` 后在交互提示符输入下面的命令（不是 PowerShell 命令）。有 ACL 时用 `--user lab_user --askpass` 输入密码。示例注释记录返回，不需要把输出复制成输入；不同客户端的数组排版可能不同。

每个 H3 都是独立实验。运行每段前、结束后在数据库 0 执行 `DEL lab:{core}:bits lab:{core}:bits2 lab:{core}:both lab:{core}:hll lab:{core}:hll2 lab:{core}:all lab:{core}:period-new lab:{core}:geo lab:{core}:stream`，只清理这些明确的学习 key，不使用通配符、FLUSHDB 或业务库。初始状态：这些 key 均不存在；每段的写入步骤重新创建所需状态。

## 常用用法

### `SETBIT`：设置指定用户对应的布尔位并观察旧值

用于设置指定用户对应的布尔位并观察旧值。

```redis
# 初始：本段实验 key 已按上文清理，数据库 0 内不存在。
SETBIT lab:{core}:bits 7 1
SETBIT lab:{core}:bits 7 1
# 关键变化：bits 的偏移 7 从 0 变为 1；重复设为 1 不改变内容。
# 输出：整数 0、整数 1，第二次返回原位值。
```

偏移从 0 开始，位按字节高位到低位编号；最大偏移 2^32-1，最高可分配 512 MiB。大偏移首次分配会阻塞，必须验证上限。 官方参考：[SETBIT](https://redis.io/docs/latest/commands/setbit/)。

### `GETBIT`：读取精确用户位并识别未分配区域的零值

用于读取精确用户位并识别未分配区域的零值。

```redis
# 初始：本段实验 key 已按上文清理，数据库 0 内不存在。
SETBIT lab:{core}:bits 7 1
GETBIT lab:{core}:bits 7
GETBIT lab:{core}:bits 8
# 关键变化：bits 仅把偏移 7 置为 1；偏移 8 保持为 0。
# 输出：整数 0、整数 1、整数 0。
```

O(1)，缺失 key 或越界位返回 0；不能区分未签到与从未创建用户，业务需另存身份信息。 官方参考：[GETBIT](https://redis.io/docs/latest/commands/getbit/)。

### `BITCOUNT`：统计位图中的置一数量以获得精确活跃数

用于统计位图中的置一数量以获得精确活跃数。

```redis
# 初始：本段实验 key 已按上文清理，数据库 0 内不存在。
SETBIT lab:{core}:bits 0 1
SETBIT lab:{core}:bits 7 1
BITCOUNT lab:{core}:bits
# 关键变化：bits 偏移 0 和 7 都变为 1，同一字节中共有两位。
# 输出：两个整数 0、整数 2。
```

O(字节长度)，范围参数默认按字节；大位图全量计数也会占用服务时间。 官方参考：[BITCOUNT](https://redis.io/docs/latest/commands/bitcount/)。

### `BITOP`：按位求交以找出两组共同活跃用户

用于按位求交以找出两组共同活跃用户。

```redis
# 初始：本段实验 key 已按上文清理，数据库 0 内不存在。
SETBIT lab:{core}:bits 7 1
SETBIT lab:{core}:bits2 7 1
BITOP AND lab:{core}:both lab:{core}:bits lab:{core}:bits2
BITCOUNT lab:{core}:both
# 关键变化：两个输入的偏移 7 都置为 1；交集写入 both，其字节长度为 1。
# 输出：两个整数 0、整数 1（目标字节长度）、整数 1（交集人数）。
```

O(最长输入字节长度)，覆盖目标 String；多键必须同槽，统一用户到偏移的映射后才能正确求交。 官方参考：[BITOP](https://redis.io/docs/latest/commands/bitop/)。

### `PFADD`：加入去重计数输入并观察寄存器是否发生变化

用于加入去重计数输入并观察寄存器是否发生变化。

```redis
# 初始：本段实验 key 已按上文清理，数据库 0 内不存在。
PFADD lab:{core}:hll user-1 user-2
PFADD lab:{core}:hll user-1
# 关键变化：首次输入使 hll 寄存器改变；重复 user-1 不再改变状态。
# 输出：整数 1、整数 0。
```

返回寄存器是否改变，不是新增人数；适合允许误差的 UV，不适合账单或精确名单。 官方参考：[PFADD](https://redis.io/docs/latest/commands/pfadd/)。

### `PFCOUNT`：读取近似独立访客基数而不保存成员列表

用于读取近似独立访客基数而不保存成员列表。

```redis
# 初始：本段实验 key 已按上文清理，数据库 0 内不存在。
PFADD lab:{core}:hll user-1 user-2
PFCOUNT lab:{core}:hll
# 关键变化：hll 接收两个用户，读取当前近似基数。
# 输出：整数 1；本小样本通常估算为 2，正式统计必须允许误差。
```

单 key 平均 O(1)，多 key 成本随 key 数增加；不能保证每一个集合得到精确值。 官方参考：[PFCOUNT](https://redis.io/docs/latest/commands/pfcount/)。

### `PFMERGE`：合并多个近似去重统计以形成联合估算

用于合并多个近似去重统计以形成联合估算。

```redis
# 初始：本段实验 key 已按上文清理，数据库 0 内不存在。
PFADD lab:{core}:hll user-1
PFADD lab:{core}:hll2 user-1 user-2
PFADD lab:{core}:all previous-user
PFMERGE lab:{core}:all lab:{core}:hll lab:{core}:hll2
PFCOUNT lab:{core}:all
# 关键变化：all 的 previous-user 也参与合并，旧观察没有被清除。
# 输出：三次 PFADD 通常为整数 1，合并为 OK，all 的小样本估算通常为 3。
PFMERGE lab:{core}:period-new lab:{core}:hll lab:{core}:hll2
PFCOUNT lab:{core}:period-new
# 关键变化：period-new 初始不存在，只合并本期两个源，不带 previous-user。
# 输出：OK，period-new 的小样本估算通常为 2；两组估算仍允许 HLL 误差。
```

联合去重不是简单相加；同槽，多源合并 O(源 key 数)且常数较大。现有目标也会作为源参与合并，保留其中已有的观察；复用上期目标会把上期用户带入本期 UV。按统计周期使用新目标，或在受控无并发写入时清理明确目标后重建；不要把并发 DEL 与 PFMERGE 当作一个原子重置。官方参考：[PFMERGE 的 destination 参与语义](https://redis.io/docs/latest/commands/pfmerge/)。

### `GEOADD`：写入经纬度地点并建立可搜索空间索引

用于写入经纬度地点并建立可搜索空间索引。

```redis
# 初始：本段实验 key 已按上文清理，数据库 0 内不存在。
GEOADD lab:{core}:geo 13.361389 38.115556 Palermo 15.087269 37.502669 Catania
# 关键变化：geo 新增 Palermo 与 Catania 两个地点并建立空间索引。
# 输出：整数 2，索引保存两个 member。
```

经度先于纬度，经度范围 [-180,180]，纬度范围约 [-85.05112878,85.05112878]；超界报错。O(log N) 每项，编码有量化误差。 官方参考：[GEOADD](https://redis.io/docs/latest/commands/geoadd/)。

### `GEOPOS`：读取索引里经过量化的地点坐标

用于读取索引里经过量化的地点坐标。

```redis
# 初始：本段实验 key 已按上文清理，数据库 0 内不存在。
GEOADD lab:{core}:geo 13.361389 38.115556 Palermo
GEOPOS lab:{core}:geo Palermo
# 关键变化：geo 新增 Palermo；读取索引量化后的经纬度。
# 输出：整数 1；坐标约为经度 13.361389338970184、纬度 38.1155563954963。
```

读取不是原输入的无限精度恢复；浮点输出末位可能随呈现变化，比较时使用合理容差。 官方参考：[GEOPOS](https://redis.io/docs/latest/commands/geopos/)。

### `GEODIST`：计算两地球面近似距离并明确输出单位

用于计算两地球面近似距离并明确输出单位。

```redis
# 初始：本段实验 key 已按上文清理，数据库 0 内不存在。
GEOADD lab:{core}:geo 13.361389 38.115556 Palermo 15.087269 37.502669 Catania
GEODIST lab:{core}:geo Palermo Catania km
# 关键变化：geo 新增两地，读取以 km 为单位的球面距离。
# 输出：整数 2，距离约 "166.2742" km。
```

O(1)，默认单位是米，支持 m/km/mi/ft；球面模型误差可达约 0.5%，不等于导航路程。地点缺失返回 nil。 官方参考：[GEODIST](https://redis.io/docs/latest/commands/geodist/)。

### `GEOSEARCH`：搜索圆形范围内的地点并按距离排序

用于搜索圆形范围内的地点并按距离排序。

```redis
# 初始：本段实验 key 已按上文清理，数据库 0 内不存在。
GEOADD lab:{core}:geo 13.361389 38.115556 Palermo 15.087269 37.502669 Catania
GEOSEARCH lab:{core}:geo FROMMEMBER Palermo BYRADIUS 200 km ASC COUNT 2
# 关键变化：geo 新增两地，读取 Palermo 周围 200 km 内的两个匹配地点。
# 输出：整数 2；数组为 Palermo、Catania。
```

推荐 GEOSEARCH 而非旧 GEORADIUS；支持 BYBOX，COUNT 限制结果，ANY 可更早停止但不保证最近结果。范围越大候选越多，复杂度依赖候选与匹配数量。 官方参考：[GEOSEARCH](https://redis.io/docs/latest/commands/geosearch/)。

### `XADD`：追加带显式事件 ID 的字段记录

用于追加带显式事件 ID 的字段记录。

```redis
# 初始：本段实验 key 已按上文清理，数据库 0 内不存在。
XADD lab:{core}:stream 1-0 kind created
XADD lab:{core}:stream 2-0 kind paid
# 关键变化：stream 先追加 1-0，再追加 2-0，两条记录按 ID 保序。
# 输出："1-0"、"2-0"，日志增加两条事件。
```

本例显式 ID 保证可复核；生产常用 * 由服务端生成。ID 必须严格递增且大于 0-0；重复指定旧 ID 会报错，写超时仍需业务幂等。 官方参考：[XADD](https://redis.io/docs/latest/commands/xadd/)。

### `XRANGE`：读取日志中有界 ID 区间以查看事件内容

用于读取日志中有界 ID 区间以查看事件内容。

```redis
# 初始：本段实验 key 已按上文清理，数据库 0 内不存在。
XADD lab:{core}:stream 1-0 kind created
XADD lab:{core}:stream 2-0 kind paid
XRANGE lab:{core}:stream 1-0 2-0 COUNT 2
# 关键变化：stream 追加两事件；读取闭区间 1-0 到 2-0，不删除记录。
# 输出：两次追加返回各自 ID，范围含 1-0/kind/created 与 2-0/kind/paid。
```

两端包含；- 和 + 表示最小/最大边界，分页继续可用 (2-0 排除上一末项。O(返回条数)，避免无界读取。 官方参考：[XRANGE](https://redis.io/docs/latest/commands/xrange/)。

### `XREAD`：从已知游标之后读取日志而不移除记录

用于从已知游标之后读取日志而不移除记录。

```redis
# 初始：本段实验 key 已按上文清理，数据库 0 内不存在。
XADD lab:{core}:stream 1-0 kind created
XADD lab:{core}:stream 2-0 kind paid
XREAD COUNT 2 STREAMS lab:{core}:stream 1-0
# 关键变化：stream 追加两事件；游标 1-0 之后只读取 2-0，原记录保留。
# 输出：两次追加返回各自 ID；读取只返回 2-0/kind/paid。
```

游标是排他起点；持久保存最后处理 ID，重复处理需幂等。BLOCK 毫秒阻塞当前连接，0 无限等待；首次用 $ 只等待新事件，之后必须用实际 ID。多 stream 在 Cluster 必须同槽；XREAD 不提供消费组 ACK。 官方参考：[XREAD](https://redis.io/docs/latest/commands/xread/)。

### `XLEN`：读取日志条数以观察容量与保留策略

用于读取日志条数以观察容量与保留策略。

```redis
# 初始：本段实验 key 已按上文清理，数据库 0 内不存在。
XADD lab:{core}:stream 1-0 kind created
XLEN lab:{core}:stream
# 关键变化：stream 追加 1-0，读取保留事件数量为 1。
# 输出："1-0"、整数 1。
```

O(1)，长度不表示未确认数量；Stream 默认会增长，必须设计保留和重放窗口。 官方参考：[XLEN](https://redis.io/docs/latest/commands/xlen/)。

### `XTRIM`：按精确最大条数修剪实验日志并观察残留事件

用于按精确最大条数修剪实验日志并观察残留事件。

```redis
# 初始：本段实验 key 已按上文清理，数据库 0 内不存在。
XADD lab:{core}:stream 1-0 kind created
XADD lab:{core}:stream 2-0 kind paid
XTRIM lab:{core}:stream MAXLEN = 1
XRANGE lab:{core}:stream - +
# 关键变化：stream 先追加两记录，再移除最旧的 1-0，仅保留 2-0。
# 输出：两个 ID、整数 1；仅剩 2-0/kind/paid。
```

修剪删除历史数据，确认重放与消费进度后才用于生产；= 精确裁剪，~ 近似裁剪可能保留更多。O(移除条数)，消费组 pending 引用和载荷保留另有边界。 官方参考：[XTRIM](https://redis.io/docs/latest/commands/xtrim/)。

## 易混点

Bitmap 是精确布尔位，HyperLogLog 是近似去重数，GEO 是空间索引，Stream 是可回读日志；它们不能互相替代。日志存储不等于消费组已确认。

## 课后小问

1. 本篇怎样验证示例没有依赖上一次实验？

答案：每个小节先清理明确实验 key，再按本段重建输入，读回结果后清理；连接与认证例按注明的连接前置条件执行。

2. 网络超时后能否直接重试写操作？

答案：不能由超时推断服务端未执行。对计数、入队、事件追加等写操作应设计幂等、重试上限与恢复路径。

## 本节小结

按输入与输出验证命令语义，再评估数据量、阻塞时间、精度和失败路径；实验清理只针对明确学习 key。

## 快速回顾

能根据本篇 H3 搜索命令、重建初始状态、解释返回值，并说明哪些边界需要客户端或业务协议补齐。
