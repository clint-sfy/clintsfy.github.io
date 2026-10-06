---
title: 发布订阅与 Stream 消费组
date: 2026-10-06
category: Java课程
tags: [Java, Redis, 可靠性]
description: 区分实时通知与可回读日志，通过 pending、确认、接管和幂等管理消息生命周期。
---

# 发布订阅与 Stream 消费组

## 学习目标

区分实时通知与可回读日志，通过 pending、确认、接管和幂等管理消息生命周期。

## 核心知识点

本篇采用 Redis 8 稳定主版本的基础语义；官方文档核对日期：2026-10-06，不声明未验证的补丁版本。需要更高小版本的选项单独标明。

Pub/Sub 无离线恢复；Streams 消费组维护游标和 PEL，为重新投递提供状态，实际可靠性仍取决于持久化、保留策略与业务提交。Stream 不保证端到端 exactly-once；命令响应丢失和消费者崩溃都需要恢复设计。

实验只在本机独立可丢弃 Redis 8、数据库 0 中执行。先通过终端运行 `redis-cli -h 127.0.0.1 -p 6379`，在交互提示符输入 redis 代码块；有 ACL 时使用 `--user lab_user --askpass`，不在命令中写密码。输出数组的排版因客户端而异。每节独立重建输入，命名空间 `lab:{reliability}:` 专用于学习；开始和结束只清理本节明确列出的 key，不把通配符传给删除命令。运行前确认没有业务数据，配置与恢复步骤另按注明的受控前提执行。

## 常用用法

### `SUBSCRIBE`：Pub/Sub 在线订阅与断连丢失

用于在专用连接上接收一个实验频道的实时消息。

```redis
# 初始：打开连接 A，仅供订阅，暂无其他订阅者。
SUBSCRIBE lab:reliability:news
# 关键变化：连接 A 进入订阅状态，随后由下一节的连接 B 发布。
# 输出：subscribe、频道名、订阅数 1；发布时收到 message、频道名、hello。
```

Pub/Sub 是 at-most-once：离线、断连或处理失败的消息不会重放，没有 ACK/PEL。RESP2 订阅态只允许有限命令，应使用专用连接；不要把订阅连接送回普通连接池。适合允许丢失的通知；关键事件改用有持久化与业务恢复协议的日志/队列。[SUBSCRIBE](https://redis.io/docs/latest/commands/subscribe/)、[Pub/Sub 投递语义](https://redis.io/docs/latest/develop/pubsub/)。

### `PUBLISH`：订阅者数量不代表业务处理成功

用于从第二个连接发布消息并观察服务端匹配的订阅数。

```redis
# 初始：连接 A 已按上一节订阅，连接 B 是普通本机连接。
PUBLISH lab:reliability:news hello
# 关键变化：hello 被投递给当前在线订阅连接，无日志条目保留。
# 输出：独立单节点且仅 A 订阅时整数 1，A 收到 hello。
```

断开 A 后再发布通常返回 0，重新连接不能获取这条旧消息；返回 1 也不说明应用已经处理。PUBLISH O(N+M)，随订阅者和匹配模式增加。频道不按 SELECT 数据库隔离；使用业务命名空间。Cluster 广播与分片 Pub/Sub 的路由/计数语义要按拓扑核对，不把单节点计数当全网处理确认。[PUBLISH](https://redis.io/docs/latest/commands/publish/)。

### `XGROUP CREATE`：从起点建立消费组

用于创建独立 Stream 的组状态以消费全部历史记录。

```redis
# 危险：只清理该可丢弃学习 Stream，连同组状态会被删除。
# 边界：DEL 仅用于明确的可丢弃 lab 学习键范围，禁止生产批量误删。
DEL lab:{reliability}:events
XADD lab:{reliability}:events 1-0 event_id order-1
XGROUP CREATE lab:{reliability}:events workers 0
# 初始：实验 Stream 和消费组均不存在。
# 关键变化：创建日志条目与 groups.workers 游标 0，尚无 PEL。
# 输出：清理数、"1-0"、OK。
```

0 从已有日志最早条目开始，$ 跳过建组时已有记录，仅后续新条目可由 > 读取；MKSTREAM 可创建空日志。组已存在时报 BUSYGROUP，不随意删除生产组重建。XGROUP CREATE O(1)。组间独立，同组消费者竞争分配；不是每个消费者都拿每条新消息。[XGROUP CREATE](https://redis.io/docs/latest/commands/xgroup-create/)。

### `XREADGROUP`：新消息、PEL 与重启读取

用于观察送达后未确认的事件仍在消费组待处理列表中。

```redis
# 边界：DEL 仅用于明确的可丢弃 lab 学习键范围，禁止生产批量误删。
DEL lab:{reliability}:events
XADD lab:{reliability}:events 1-0 event_id order-1
XGROUP CREATE lab:{reliability}:events workers 0
XREADGROUP GROUP workers c1 COUNT 1 STREAMS lab:{reliability}:events >
XREADGROUP GROUP workers c1 COUNT 1 STREAMS lab:{reliability}:events 0
# 初始：只含 1-0 的学习 Stream，新建 workers 与 c1。
# 关键变化：第一次分配 1-0 到 c1 的 PEL，第二次重读 c1 自己的 pending。
# 输出：清理数、"1-0"、OK；两次读取均包含 1-0/event_id/order-1。
```

危险：DEL 仅用于明确的可丢弃学习 Stream，不能用于重置生产消费组。> 读取未分配过的新记录；0 等具体 ID 查询该消费者自身 pending，不接管别的消费者。BLOCK 毫秒等待新消息，0 无限等待当前连接；设置有界超时与 COUNT。NOACK 不维护 PEL，不能用于需要恢复的处理。成本取决于返回条数，阻塞消费者多时 XADD 还承担唤醒成本；Cluster 多 Stream 需同槽。PEL 只代表送达未确认，不保证业务已提交，也不是自动重试定时器。[XREADGROUP](https://redis.io/docs/latest/commands/xreadgroup/)。

### `XACK`：业务完成后确认与日志保留

用于确认已处理的消息并观察重复确认不会重复移除。

```redis
# 边界：DEL 仅用于明确的可丢弃 lab 学习键范围，禁止生产批量误删。
DEL lab:{reliability}:events
XADD lab:{reliability}:events 1-0 event_id order-1
XGROUP CREATE lab:{reliability}:events workers 0
XREADGROUP GROUP workers c1 COUNT 1 STREAMS lab:{reliability}:events >
XACK lab:{reliability}:events workers 1-0
XACK lab:{reliability}:events workers 1-0
XLEN lab:{reliability}:events
# 初始：建立单条学习日志，业务处理已成功持久提交后才确认。
# 关键变化：1-0 从 workers 的 PEL 移除，但日志载荷仍在。
# 输出：清理数、ID、OK、事件；1、0、1。
```

危险：初始化 DEL 仅针对可丢弃学习 key。XACK O(ID 数)，只清除指定组的 pending，不删除日志，也不替其他组确认。先 ACK 后处理可能永久漏处理；先处理后 ACK 在断连时会重复，必须业务幂等。确认超时可重试，返回 0 可能已确认或不存在，需结合业务处理记录判断。[XACK](https://redis.io/docs/latest/commands/xack/)。

### `XPENDING`：观察积压、空闲和重试次数

用于查看一个已送达未确认条目的所有者与空闲时间。

```redis
# 边界：DEL 仅用于明确的可丢弃 lab 学习键范围，禁止生产批量误删。
DEL lab:{reliability}:events
XADD lab:{reliability}:events 1-0 event_id order-1
XGROUP CREATE lab:{reliability}:events workers 0
XREADGROUP GROUP workers c1 COUNT 1 STREAMS lab:{reliability}:events >
XPENDING lab:{reliability}:events workers
XPENDING lab:{reliability}:events workers - + 10
# 初始：workers 只有一个分配给 c1 的未确认事件。
# 关键变化：读取组的总积压和该条目的投递元数据。（lab 学习数据）。
# 输出：摘要总数 1，最小/最大 ID 为 1-0；明细含 1-0、c1、动态空闲毫秒、投递次数 1。
```

危险：初始化只删除独立学习 Stream。摘要与明细成本不同；按 COUNT 有界读取，带 IDLE 过滤时扫描成本也需评估。监控 pending 数、最老年龄、消费者闲置和投递次数；次数不等于数据库事务尝试次数。XPENDING 只观测不重发，毒消息需退避、最大尝试次数和受控死信转移（包含原 ID、原因、次数）；持久记录死信后再 ACK，跨系统边界仍需幂等。[XPENDING](https://redis.io/docs/latest/commands/xpending/)。

### `XAUTOCLAIM`：接管闲置消息与有界重试

用于把超出最小空闲时间的 pending 转移给恢复消费者。

```redis
# 边界：DEL 仅用于明确的可丢弃 lab 学习键范围，禁止生产批量误删。
DEL lab:{reliability}:events
XADD lab:{reliability}:events 1-0 event_id order-1
XGROUP CREATE lab:{reliability}:events workers 0
XREADGROUP GROUP workers c1 COUNT 1 STREAMS lab:{reliability}:events >
# 初始：c1 已拿到 1-0，但未 ACK；本机演示 min-idle=0，无需等待。
XAUTOCLAIM lab:{reliability}:events workers c2 0 0-0 COUNT 1
# 关键变化：1-0 所有者变为 c2，空闲时间重置，常规接管增加投递计数。
# 输出：下一游标、含 1-0 的事件数组、被清理的已删除 ID 数组（本例为空）。
```

危险：DEL 只清理学习 Stream，min-idle=0 仅用于本机演示，生产不得立即抢占活跃任务。自 6.2 提供；Redis 7+ 返回第三数组，扫描遇到载荷已删除的记录会清除 PEL 并报告 ID。按返回游标循环至 0-0，空批次也可能需继续；单次扫描最多 COUNT×10 个候选，可少于 COUNT。生产阈值高于正常处理耗时并包含停顿余量，仍可能与旧消费者并行；接管不能提供 exactly-once。JUSTID 不增加重试计数，需另记录尝试策略。[XAUTOCLAIM](https://redis.io/docs/latest/commands/xautoclaim/)。

### `SET NX`：消费幂等与业务事务边界

用于演示同一个事件 ID 重复出现时可检测重复。

```redis
# 边界：DEL 仅用于明确的可丢弃 lab 学习键范围，禁止生产批量误删。
DEL lab:{reliability}:dedup-order-1
SET lab:{reliability}:dedup-order-1 processed NX EX 3600
SET lab:{reliability}:dedup-order-1 processed NX EX 3600
# 初始：学习 key 模拟同一个 event_id=order-1 的去重记录。
# 关键变化：order-1 首次占位成功，重复占位失败。
# 输出：清理数、OK、nil；只验证 Redis 标记，未执行任何业务事务。
```

这个标记不能直接实现可靠消费：先占位再业务，崩溃会漏处理；先业务再占位，崩溃会重复。可靠方案是在权威数据库的同一个事务中插入 event_id 唯一约束与业务变更，提交后 XACK；重复事件查已提交结果再确认。跨外部系统副作用使用幂等键/outbox，不能跨 Redis 和数据库凭空获得事务。去重保留期覆盖日志重放、pending 恢复与最大延迟；TTL 结束后重新投递可能再执行。[SET NX](https://redis.io/docs/latest/commands/set/)。这是对存储提交边界的应用层推导。

### `XTRIM KEEPREF`：裁剪载荷与保留 PEL 的区别

用于在 Redis 8.2+ 的可丢弃实例观察裁剪后仍有 pending 引用。

```redis
# 危险：只在可丢弃 Stream 上裁剪；载荷删除不可由 PEL 恢复。
# 边界：DEL 仅用于明确的可丢弃 lab 学习键范围，禁止生产批量误删。
DEL lab:{reliability}:events
XADD lab:{reliability}:events 1-0 event_id order-1
XGROUP CREATE lab:{reliability}:events workers 0
XREADGROUP GROUP workers c1 COUNT 1 STREAMS lab:{reliability}:events >
XTRIM lab:{reliability}:events MAXLEN = 0 KEEPREF
XPENDING lab:{reliability}:events workers
XREADGROUP GROUP workers c1 COUNT 1 STREAMS lab:{reliability}:events 0
# 初始：1-0 在 c1 的 PEL，载荷仍存在，服务支持 Redis 8.2+ 选项。
# 关键变化：日志条目被删除，PEL 仍保留 1-0 引用。
# 输出：清理数、ID、OK、事件、1；pending 总数仍为 1，重读得到 1-0 但载荷为 null。
```

本节是消费组裁剪引用的规范位置；基础 MAXLEN/= 与 ~ 示例仍见 [特殊结构的 XTRIM](./05-Bitmap-HyperLogLog-GEO与Stream.md#xtrim-按精确最大条数修剪实验日志并观察残留事件)，不重复其命令教程。显式 KEEPREF/DELREF/ACKED 自 Redis 8.2 提供：KEEPREF 为默认行为，仅留引用，不能恢复载荷；DELREF 同时清除所有组对应 PEL 引用，可能丢失待处理任务；ACKED 只裁剪已被所有组读取且确认的条目，因此不能保证达到 MAXLEN。早期版本使用无选项裁剪也会留下 pending 引用，本例的显式参数不可在 8.0 使用。修剪 O(删除数量)，~ 可能多保留，LIMIT 限制扫描工作且只与近似模式使用。保留窗口应覆盖最慢消费者、最大故障与重放需求；监控组 lag、pending 年龄与载荷缺失，不能只看 XLEN。三种策略都不能替代备份与可靠消息处理。[XTRIM 引用策略](https://redis.io/docs/latest/commands/xtrim/)。

## 易混点

XACK 移除待确认引用而不删除日志；XTRIM 可能删除日志却保留引用；PEL 存在不代表载荷完整。

## 课后小问

1. 消费者业务已提交，但 XACK 前退出应怎样恢复？

答案：重投后按同一 event_id 验证已提交记录并跳过重复副作用，再确认，业务事务和去重必须协调。

2. 怎样处理写命令响应丢失？

答案：响应丢失不能证明没有执行；先检查业务状态，对非幂等写入使用业务 ID、去重记录或有界恢复流程。

## 本节小结

选择可接受丢失的通知或有恢复状态的日志，再把业务幂等、持久化和保留窗口组合成可靠流程。

## 快速回顾

按 H3 定位真实命令或操作流程，重建初始状态并读回结果，再检查超时、容量和数据安全边界。
