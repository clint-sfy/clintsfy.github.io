---
title: Hash 与对象字段
date: 2026-10-06
category: Java课程
tags: [Java, Redis, 数据结构]
description: 学习 Hash 与对象字段 的命令、可观察结果、容量与并发边界。
---

# Hash 与对象字段

## 学习目标

掌握本篇独立命令的输入、返回与状态变化，按访问形状选择结构，并为键、返回数量和失败重试设置边界。

## 核心知识点

本篇采用 Redis 8 稳定主版本的基础命令语义；官方文档核对日期：2026-10-06，不声明未验证的补丁版本。[官方数据类型](https://redis.io/docs/latest/develop/data-types/) 是本章事实依据。

Hash 将一个对象映射为 field-value 字节对，适合局部更新；field 不存在与值为空字符串不同。普通 Hash 没有嵌套对象语义，需要自行定义序列化契约。Redis 8 支持字段过期相关扩展，但本篇只用长期稳定的基础命令，不推断字段跟随任何业务时间自动删除。单字段读写通常 O(1)，多字段写 O(N)。

实验前提：本机独立 Redis 8 服务在 127.0.0.1:6379 运行；通过终端执行 `redis-cli -h 127.0.0.1 -p 6379` 后在交互提示符输入下面的命令（不是 PowerShell 命令）。有 ACL 时用 `--user lab_user --askpass` 输入密码。示例注释记录返回，不需要把输出复制成输入；不同客户端的数组排版可能不同。

每个 H3 都是独立实验。运行每段前、结束后在数据库 0 执行 `DEL lab:{core}:h`，只清理这些明确的学习 key，不使用通配符、FLUSHDB 或业务库。初始状态：这些 key 均不存在；每段的写入步骤重新创建所需状态。

## 常用用法

### `HSET`：写入对象字段并区分新增字段与覆盖字段

用于写入对象字段并区分新增字段与覆盖字段。

```redis
# 初始：本段实验 key 已按上文清理，数据库 0 内不存在。
HSET lab:{core}:h name Ann age 20
HSET lab:{core}:h age 21
HGET lab:{core}:h age
# 关键变化：h 新增 name、age 两字段；随后 age 从 20 更新为 21，字段数量不变。
# 输出：整数 2、整数 0、"21"。
```

返回新增字段数，不是写入成功次数；推荐 HSET 多字段写法，旧 HMSET 不再是首选。 官方参考：[HSET](https://redis.io/docs/latest/commands/hset/)。

### `HGET`：读取明确字段并观察不存在字段的结果

用于读取明确字段并观察不存在字段的结果。

```redis
# 初始：本段实验 key 已按上文清理，数据库 0 内不存在。
HSET lab:{core}:h name Ann
HGET lab:{core}:h name
HGET lab:{core}:h missing
# 关键变化：h 新增 name=Ann，missing 字段仍不存在。
# 输出：整数 1、"Ann"、(nil)。
```

字段值不是自动反序列化的 Java 属性；修改编码需要兼容策略。 官方参考：[HGET](https://redis.io/docs/latest/commands/hget/)。

### `HMGET`：按请求顺序批量读取对象的部分字段

用于按请求顺序批量读取对象的部分字段。

```redis
# 初始：本段实验 key 已按上文清理，数据库 0 内不存在。
HSET lab:{core}:h name Ann age 20
HMGET lab:{core}:h age name missing
# 关键变化：h 保存 name=Ann、age=20，读取按 age、name、missing 排列。
# 输出：整数 2，数组为 "20"、"Ann"、(nil)。
```

O(N)，适合明确投影，避免为一个字段拉取整个对象。 官方参考：[HMGET](https://redis.io/docs/latest/commands/hmget/)。

### `HGETALL`：读取小对象的全部字段和值

用于读取小对象的全部字段和值。

```redis
# 初始：本段实验 key 已按上文清理，数据库 0 内不存在。
HSET lab:{core}:h name Ann age 20
HGETALL lab:{core}:h
# 关键变化：h 保存两字段，读取全部 field/value 对而不改变状态。
# 输出：整数 2；字段集合为 name=Ann、age=20，顺序不保证。
```

O(N)，大 Hash 会阻塞且产生大响应；分页遍历应选 HSCAN。 官方参考：[HGETALL](https://redis.io/docs/latest/commands/hgetall/)。

### `HSCAN`：用游标遍历大对象的字段和值

用于用游标遍历大对象的字段和值。

```redis
# 初始：本段实验 key 已按上文清理，数据库 0 内不存在。
HSET lab:{core}:h name Ann age 20
HSCAN lab:{core}:h 0 COUNT 1
# 关键变化：h 保存两字段，游标遍历读取其中一批；内容和下一游标依编码决定。
# 输出：整数 2；随后是下一游标和若干 field/value 对，具体分页不固定。
```

重复提交返回游标直到字符串 "0"；COUNT 是提示而非页大小，可能空页或一次返回全部。全遍历 O(N)，单步平均 O(1)；并发变更不是快照，可能重复，调用方需去重。 官方参考：[HSCAN](https://redis.io/docs/latest/commands/hscan/)。

### `HDEL`：删除明确字段并观察对象保留的部分

用于删除明确字段并观察对象保留的部分。

```redis
# 初始：本段实验 key 已按上文清理，数据库 0 内不存在。
HSET lab:{core}:h name Ann age 20
HDEL lab:{core}:h age
HLEN lab:{core}:h
# 关键变化：h 新增 name、age 后移除 age，只保留 name。
# 输出：整数 2、整数 1、整数 1。
```

删除最后一个字段会删除整个 Hash key；返回实际删除字段数。 官方参考：[HDEL](https://redis.io/docs/latest/commands/hdel/)。

### `HEXISTS`：检查字段存在性而不读取字段值

用于检查字段存在性而不读取字段值。

```redis
# 初始：本段实验 key 已按上文清理，数据库 0 内不存在。
HSET lab:{core}:h name ""
HEXISTS lab:{core}:h name
HEXISTS lab:{core}:h age
# 关键变化：h 的 name 存在且为空，age 没有被创建。
# 输出：整数 1、整数 1、整数 0。
```

存在但为空的字段仍返回 1；检查与后续修改的组合不是原子条件更新。 官方参考：[HEXISTS](https://redis.io/docs/latest/commands/hexists/)。

### `HLEN`：检查对象字段数以识别不受控扩张

用于检查对象字段数以识别不受控扩张。

```redis
# 初始：本段实验 key 已按上文清理，数据库 0 内不存在。
HSET lab:{core}:h name Ann age 20
HLEN lab:{core}:h
# 关键变化：h 新增两个字段，读取字段数量为 2。
# 输出：整数 2、整数 2。
```

O(1)；字段数不能表示内存大小，仍要限制每个字段和整个对象的字节量。 官方参考：[HLEN](https://redis.io/docs/latest/commands/hlen/)。

### `HINCRBY`：原子增加对象里的整数字段

用于原子增加对象里的整数字段。

```redis
# 初始：本段实验 key 已按上文清理，数据库 0 内不存在。
HSET lab:{core}:h visits 2
HINCRBY lab:{core}:h visits 3
HGET lab:{core}:h visits
# 关键变化：visits 从 2 累加 3 后变为 5。
# 输出：整数 1、整数 5、"5"。
```

缺失字段从 0 开始；有符号 64 位整数且不自动提供库存下限约束。 官方参考：[HINCRBY](https://redis.io/docs/latest/commands/hincrby/)。

## 易混点

命令返回的整数有的表示数量、有的表示旧值或新值，应按命令解释；nil 与空字符串不同。单命令原子不等于跨命令或跨数据库的业务事务。

## 课后小问

1. 本篇怎样验证示例没有依赖上一次实验？

答案：每个小节先清理明确实验 key，再按本段重建输入，读回结果后清理；连接与认证例按注明的连接前置条件执行。

2. 网络超时后能否直接重试写操作？

答案：不能由超时推断服务端未执行。对计数、入队、事件追加等写操作应设计幂等、重试上限与恢复路径。

## 本节小结

按输入与输出验证命令语义，再评估数据量、阻塞时间、精度和失败路径；实验清理只针对明确学习 key。

## 快速回顾

能根据本篇 H3 搜索命令、重建初始状态、解释返回值，并说明哪些边界需要客户端或业务协议补齐。
