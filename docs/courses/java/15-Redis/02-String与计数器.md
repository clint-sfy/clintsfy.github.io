---
title: String 与计数器
date: 2026-10-06
category: Java课程
tags: [Java, Redis, 数据结构]
description: 学习 String 与计数器 的命令、可观察结果、容量与并发边界。
---

# String 与计数器

## 学习目标

掌握本篇独立命令的输入、返回与状态变化，按访问形状选择结构，并为键、返回数量和失败重试设置边界。

## 核心知识点

本篇采用 Redis 8 稳定主版本的基础命令语义；官方文档核对日期：2026-10-06，不声明未验证的补丁版本。[官方数据类型](https://redis.io/docs/latest/develop/data-types/) 是本章事实依据。

String 适合短文本、序列化对象、整数计数器和位图底层字节。String 最大为 512 MiB，但这不是生产推荐大小；大值增加网络与内存开销。整数命令使用有符号 64 位范围，溢出报错；浮点计数不能替代精确金额。单命令原子不代表 GET 后 SET 的客户端组合原子。

实验前提：本机独立 Redis 8 服务在 127.0.0.1:6379 运行；通过终端执行 `redis-cli -h 127.0.0.1 -p 6379` 后在交互提示符输入下面的命令（不是 PowerShell 命令）。有 ACL 时用 `--user lab_user --askpass` 输入密码。示例注释记录返回，不需要把输出复制成输入；不同客户端的数组排版可能不同。

每个 H3 都是独立实验。运行每段前、结束后在数据库 0 执行 `DEL lab:{core}:s lab:{core}:t lab:{core}:missing`，只清理这些明确的学习 key，不使用通配符、FLUSHDB 或业务库。初始状态：这些 key 均不存在；每段的写入步骤重新创建所需状态。

## 常用用法

### `SET`：写入完整字符串并观察旧内容被替换

用于写入完整字符串并观察旧内容被替换。

```redis
# 初始：本段实验 key 已按上文清理，数据库 0 内不存在。
SET lab:{core}:s old
SET lab:{core}:s new
GET lab:{core}:s
# 关键变化：s 先保存 old，再被 new 整体替换。
# 输出：两次 SET 为 OK，GET 为 "new"。
```

`SET key value` 把一整个字符串值写到 key，无论旧值是否存在都会返回 `OK`；它既能存文本，也能存按约定序列化后的字节。普通 SET 覆盖旧值时会清除原 TTL，所以更新会话或缓存时要明确选择 `EX`（秒）、`PX`（毫秒）或 `KEEPTTL`，否则可能把原本会过期的 key 变成永久 key。官方参考：[SET](https://redis.io/docs/latest/commands/set/)。

### `SET NX`：仅在键缺失时创建值以避免覆盖已有内容

用于仅在键缺失时创建值以避免覆盖已有内容。

```redis
# 初始：本段实验 key 已按上文清理，数据库 0 内不存在。
SET lab:{core}:s first NX
SET lab:{core}:s second NX
GET lab:{core}:s
# 关键变化：第一次创建 s=first，第二次 NX 被拒绝，原值保留。
# 输出：依次为 OK、(nil)、"first"。
```

`NX` 是 SET 的“仅当不存在”选项：创建成功返回 `OK`，已有 key 时返回空结果，原值不会被覆盖。它适合一次性占位或去重入口；业务要区分“别人已经写入”和“这次写入失败”。原子存在性检查不等于完整分布式锁协议，临时占位通常还要在同一条 SET 中附加 `EX/PX`，避免无期限残留。官方参考：[SET NX](https://redis.io/docs/latest/commands/set/)。

### `SET XX`：仅在键存在时更新并识别条件写入失败

用于仅在键存在时更新并识别条件写入失败。

```redis
# 初始：本段实验 key 已按上文清理，数据库 0 内不存在。
SET lab:{core}:s next XX
SET lab:{core}:s first
SET lab:{core}:s next XX
GET lab:{core}:s
# 关键变化：缺失时更新被拒绝；创建 first 后更新为 next。
# 输出：依次为 (nil)、OK、OK、"next"。
```

XX 检查存在性，不能检查旧值或版本；并发条件更新需要进一步的事务或脚本设计。 官方参考：[SET XX](https://redis.io/docs/latest/commands/set/)。

### `GET`：读取单个字符串并区分缺失键与空字符串

用于读取单个字符串并区分缺失键与空字符串。

```redis
# 初始：本段实验 key 已按上文清理，数据库 0 内不存在。
SET lab:{core}:s ""
GET lab:{core}:s
GET lab:{core}:missing
# 关键变化：s 保存空字节串，missing 仍不存在，读取结果不同。
# 输出：OK、""、(nil)。
```

`GET key` 返回字符串内容；不存在时返回空结果，值为 `""` 时返回长度为零的字符串，这是两个不同状态。读缓存时要用返回值是否为 `null` 判断 miss，不能把空字符串也当作缺失；如果 key 实际存的是 Hash/List 等类型，服务器会返回 WRONGTYPE。官方参考：[GET](https://redis.io/docs/latest/commands/get/)。

### `INCR`：原子增加整数计数并观察缺失键从零开始

用于原子增加整数计数并观察缺失键从零开始。

```redis
# 初始：本段实验 key 已按上文清理，数据库 0 内不存在。
INCR lab:{core}:s
INCR lab:{core}:s
GET lab:{core}:s
# 关键变化：s 从缺失的隐含 0 递增到 1，再到 2。
# 输出：整数 1、整数 2、"2"。
```

`INCR key` 把整数值加 1 并返回加完后的整数；缺失 key 当作 0，所以第一次返回 1。适合访问次数等可重复计数，但它不自动设置 TTL，单独再发 `EXPIRE` 存在故障窗口。原值不是整数或超出有符号 64 位范围会报错；请求超时后也不能盲重试，否则可能多加一次。官方参考：[INCR](https://redis.io/docs/latest/commands/incr/)。

### `DECR`：原子减少整数计数并观察负值语义

用于原子减少整数计数并观察负值语义。

```redis
# 初始：本段实验 key 已按上文清理，数据库 0 内不存在。
DECR lab:{core}:s
GET lab:{core}:s
# 关键变化：s 从缺失的隐含 0 递减到 -1。
# 输出：整数 -1、"-1"。
```

DECR 不会自动阻止库存变成负数；库存下限检查和扣减需要一个原子操作。 官方参考：[DECR](https://redis.io/docs/latest/commands/decr/)。

### `MGET`：批量读取并保留键与返回位置的对应关系

用于批量读取并保留键与返回位置的对应关系。

```redis
# 初始：本段实验 key 已按上文清理，数据库 0 内不存在。
SET lab:{core}:s Ann
MGET lab:{core}:s lab:{core}:missing
# 关键变化：s 保存 Ann，missing 缺失；读取保持请求位置。
# 输出：OK，数组依次为 "Ann"、(nil)。
```

`MGET key1 key2 ...` 返回一个与输入 key 顺序一致的数组，缺失项保留空位置，因此可以按下标对应请求，不要丢弃空项后再配对。它适合一次读取少量相关键，时间复杂度随 key 数增长，还要限制批次和总返回字节数。Cluster 多键需同槽，本章 hash tag 已满足；非字符串类型的项也会返回空值。官方参考：[MGET](https://redis.io/docs/latest/commands/mget/)。

### `MSET`：一次写入多个字符串并观察原子批量更新

用于一次写入多个字符串并观察原子批量更新。

```redis
# 初始：本段实验 key 已按上文清理，数据库 0 内不存在。
MSET lab:{core}:s Ann lab:{core}:t Bob
MGET lab:{core}:s lab:{core}:t
# 关键变化：s 和 t 原子写入 Ann 与 Bob，批量读取得到相同次序。
# 输出：OK，数组为 "Ann"、"Bob"。
```

`MSET key1 value1 key2 value2 ...` 一次写入多对字符串，成功返回 `OK`；它会覆盖已有值，整条命令原子执行。适合一起更新少量相关键，但没有给每个键分别设置 TTL 的参数；需要各键不同寿命时要另做设计。成本随键值对数量增长，Cluster 多键必须同槽。官方参考：[MSET](https://redis.io/docs/latest/commands/mset/)。

### `GETRANGE`：按字节位置读取字符串的闭区间片段

用于按字节位置读取字符串的闭区间片段。

```redis
# 初始：本段实验 key 已按上文清理，数据库 0 内不存在。
SET lab:{core}:s hello
GETRANGE lab:{core}:s 1 3
# 关键变化：s 保存 hello，读取偏移 1 到 3 的字节，得到 ell。
# 输出：OK、"ell"。
```

索引从 0 开始，两端包含，负索引从末尾计；UTF-8 中文可能在字节中间截断。O(返回长度)。 官方参考：[GETRANGE](https://redis.io/docs/latest/commands/getrange/)。

### `SETRANGE`：在字节偏移处替换片段而不截断剩余内容

用于在字节偏移处替换片段而不截断剩余内容。

```redis
# 初始：本段实验 key 已按上文清理，数据库 0 内不存在。
SET lab:{core}:s hello
SETRANGE lab:{core}:s 1 a
GET lab:{core}:s
# 关键变化：s 从 hello 变为 hallo，长度保持 5。
# 输出：OK、整数 5、"hallo"。
```

越过末尾会以零字节补齐；大偏移可触发大分配和阻塞，不把用户 ID 直接当偏移。 官方参考：[SETRANGE](https://redis.io/docs/latest/commands/setrange/)。

### `STRLEN`：读取字符串的字节长度以控制值的容量

用于读取字符串的字节长度以控制值的容量。

```redis
# 初始：本段实验 key 已按上文清理，数据库 0 内不存在。
SET lab:{core}:s hello
STRLEN lab:{core}:s
# 关键变化：s 保存 5 个 ASCII 字节，读取长度为 5。
# 输出：OK、整数 5。
```

O(1)，长度是字节数，不是 Java String.length 的 UTF-16 code unit 数。 官方参考：[STRLEN](https://redis.io/docs/latest/commands/strlen/)。

#### Java 调用：`StringRedisTemplate.opsForValue()`

在 Spring Boot 引入 `spring-boot-starter-data-redis` 并注入 `StringRedisTemplate` 后，用它操作字符串键；计数值必须是整数文本。

```java
import java.time.Duration;
import org.springframework.data.redis.core.StringRedisTemplate;

class StringDemo {
    private final StringRedisTemplate redis;
    StringDemo(StringRedisTemplate redis) { this.redis = redis; }

    void run() {
        redis.opsForValue().set("lab:counter", "1", Duration.ofMinutes(5));
        System.out.println(redis.opsForValue().get("lab:counter"));
        // 输出：1
        System.out.println(redis.opsForValue().increment("lab:counter"));
        // 输出：2
    }
}
```

`increment` 对不存在的键从 0 开始，但这里先写入了 1；过期时间仍按原键的 TTL 计算。更多序列化与连接配置见[RedisTemplate](./13-RedisTemplate序列化与连接管理)。

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
