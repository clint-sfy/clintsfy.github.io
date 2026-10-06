---
title: Key 过期、扫描与删除
date: 2026-10-06
category: Java课程
tags: [Java, Redis, 可靠性]
description: 理解过期、扫描和删除的成本，以明确目标和可观察返回值控制数据清理。
---

# Key 过期、扫描与删除

## 学习目标

理解过期、扫描和删除的成本，以明确目标和可观察返回值控制数据清理。

## 核心知识点

本篇采用 Redis 8 稳定主版本的基础语义；官方文档核对日期：2026-10-06，不声明未验证的补丁版本。需要更高小版本的选项单独标明。

过期用于限制存活期，扫描用于发现名称，删除用于移除对象；三者不是同一个原子清理动作。运行中的写入、重建和迁槽都会改变扫描结果。

实验只在本机独立可丢弃 Redis 8、数据库 0 中执行。先通过终端运行 `redis-cli -h 127.0.0.1 -p 6379`，在交互提示符输入 redis 代码块；有 ACL 时使用 `--user lab_user --askpass`，不在命令中写密码。输出数组的排版因客户端而异。每节独立重建输入，命名空间 `lab:{reliability}:` 专用于学习；开始和结束只清理本节明确列出的 key，不把通配符传给删除命令。运行前确认没有业务数据，配置与恢复步骤另按注明的受控前提执行。

## 常用用法

### `EXPIRE`：设置过期与主动采样边界

用于给一个明确的实验 key 设置秒级生存时间。

```redis
# 初始：只清理本节明确的学习 key。
# 边界：DEL 仅用于明确的可丢弃 lab 学习键范围，禁止生产批量误删。
DEL lab:{reliability}:ttl
SET lab:{reliability}:ttl value
EXPIRE lab:{reliability}:ttl 60 NX
EXPIRE lab:{reliability}:ttl 120 NX
# 关键变化：第一次增加 TTL，第二次 NX 不覆盖已有 TTL。
# 输出：0 或 1（清理）、OK、1、0。
```

EXPIRE O(1)；NX/XX/GT/LT 条件自 Redis 7.0 提供，NX 不与其他条件组合。零或负超时立即删除。访问时惰性检查过期，后台主动采样过期 key；不是为每个 key 建独立定时器，也不承诺到点立即释放全部内存。普通 SET 覆盖默认清除 TTL；INCR、HSET 这类原地修改保留 key TTL。[EXPIRE 官方语义](https://redis.io/docs/latest/commands/expire/)。

### `TTL`：区分缺失、永久与剩余期限

用于读取剩余秒数并辨认两个特殊返回值。

```redis
# 边界：DEL 仅用于明确的可丢弃 lab 学习键范围，禁止生产批量误删。
DEL lab:{reliability}:ttl
TTL lab:{reliability}:ttl
SET lab:{reliability}:ttl value
TTL lab:{reliability}:ttl
EXPIRE lab:{reliability}:ttl 60
TTL lab:{reliability}:ttl
# 关键变化：key 从缺失变为永久，再变为限时。
# 输出：清理数、-2、OK、-1、1、0 到 60 内剩余秒数。
```

O(1)；-2 表示 key 不存在，-1 表示无 TTL。PTTL 是毫秒精度，不把两个负值当作过期剩余时间。读到 TTL 后 key 仍可能立即过期；不能以先查 TTL 再写构造原子协议。[TTL](https://redis.io/docs/latest/commands/ttl/)。

### `SCAN`：完整游标扫描与去重

用于以游标逐批枚举当前节点上的匹配 key。

```redis
SET lab:{reliability}:scan-a a
SET lab:{reliability}:scan-b b
SCAN 0 MATCH lab:{reliability}:scan-* COUNT 10
# 初始：学习命名空间内只有这两个 scan key；其余 key 不匹配。
# 关键变化：scan-a/scan-b 写入后开始游标遍历。
# 输出：下一游标与零到多个匹配 key；若游标非 0，继续传回该游标。
```

操作流程：逐次使用返回游标，直到返回 0，保存已处理名称或让操作幂等；不能固定只执行这一页。单次一般 O(1)，完整遍历 O(N)，COUNT 是工作量提示而非返回数上限。完整遍历保证一直存在的元素被返回，不返回一直不存在的元素；变化中的元素结果未定义，可能重复，空批次不代表结束。不是快照；Cluster 需按主节点分别遍历，迁槽另处理。[SCAN 保证](https://redis.io/docs/latest/commands/scan/)。扫描后删除有竞态：旧 key 可能被重建，必要时结合业务版本验证。

### `UNLINK`：逻辑删除与异步回收

用于立即移除名称并观察 key 已不可访问。

```redis
SET lab:{reliability}:unlink value
# 边界：UNLINK 仅用于可丢弃 lab 单键，生产先核验目标与异步回收压力。
UNLINK lab:{reliability}:unlink
EXISTS lab:{reliability}:unlink
# 初始：本段创建一个独立 String 实验 key。
# 关键变化：unlink 名称从键空间移除，释放工作可交给后台。
# 输出：OK、1、0。
```

危险边界：只删除这个可丢弃学习 key，生产先核验目标。每 key 从键空间摘除 O(1)，后台释放 O(对象分配数量)；简单对象可直接释放，不保证所有类型一定排队。命令返回不等于 RSS 立即下降，分配器可能保留页，异步队列仍占内存。[UNLINK](https://redis.io/docs/latest/commands/unlink/)。

### `MEMORY USAGE`：大 Key 删除前量化容量

用于估算一个明确 key 的内存并选择删除节奏。

```redis
# 边界：DEL 仅用于明确的可丢弃 lab 学习键范围，禁止生产批量误删。
DEL lab:{reliability}:big
HSET lab:{reliability}:big a one b two
# 边界：MEMORY 仅在受控范围采样明确 lab key，避免全量诊断阻塞。
MEMORY USAGE lab:{reliability}:big SAMPLES 5
# 边界：UNLINK 仅用于可丢弃 lab 单键，生产先核验目标与异步回收压力。
UNLINK lab:{reliability}:big
EXISTS lab:{reliability}:big
# 初始：big 是可丢弃的小 Hash，用它模拟容量诊断输入。
# 关键变化：建立 Hash，测量后解除名称绑定。
# 输出：清理数、2、版本相关字节数、1、0。
```

危险：此示例只删除明确学习 key；生产大 Key 删除先测类型、字段/成员数量和字节数，在低峰限制批次与速率，监控延迟、used_memory、RSS、lazyfree_pending_objects，确认业务可重建。MEMORY USAGE 的复杂度取决于采样量；SAMPLES 0 全量采样可能昂贵。UNLINK 不能消除瞬间大量删除产生的后台积压。避免在 Lua 中循环删除海量元素。[MEMORY USAGE](https://redis.io/docs/latest/commands/memory-usage/)。

### `KEYS`：只在小型可丢弃库演示阻塞枚举

用于在确认规模很小的实验库观察全量匹配结果。

```redis
# 危险：KEYS 阻塞遍历整个数据库；只用于本机小型可丢弃实验库。
SET lab:{reliability}:keys-demo one
# 边界：KEYS 仅用于受控测试环境小库，生产遍历会阻塞服务。
KEYS lab:{reliability}:keys-*
# 初始：该前缀下没有其他学习 key。
# 关键变化：keys-demo 增加后全量枚举匹配名称。
# 输出：OK、包含 lab:{reliability}:keys-demo 的数组。
```

O(N)，即使匹配前缀很窄也遍历库；生产枚举优先 SCAN，别把 KEYS * 放进接口或运维定时任务。[KEYS](https://redis.io/docs/latest/commands/keys/)。

### `DEL`：明确名称删除与 broad DEL 风险

用于删除两个已核验的实验名称并观察实际删除数。

```redis
# 危险：DEL 只针对这两个可丢弃学习 key，禁止扫描业务库后无审查批量删除。
SET lab:{reliability}:del-a a
SET lab:{reliability}:del-b b
# 边界：DEL 仅用于明确的可丢弃 lab 学习键范围，禁止生产批量误删。
DEL lab:{reliability}:del-a lab:{reliability}:del-b
EXISTS lab:{reliability}:del-a lab:{reliability}:del-b
# 初始：两个独立学习 String 创建后各保存一个值。
# 关键变化：del-a/del-b 两个名称与其对象同步删除。
# 输出：OK、OK、2、0。
```

DEL 接收具体名称，不展开 *；O(key 数)，复杂集合还需 O(元素数)释放。大对象同步释放可能造成长尾延迟，多 key 在 Cluster 必须同槽。broad DEL 的危险常来自脚本把大量匹配结果变成删除列表；需预览、审批范围和备份，分批删除也不能解决误删。[DEL](https://redis.io/docs/latest/commands/del/)。

### `FLUSHDB`：数据库级删除的隔离演示

用于在单独可丢弃实例中验证整个当前数据库被清空。

```redis
# 危险：只在无业务数据的独立本机可丢弃实例执行；不得连接生产。
SET lab:{reliability}:flush one
# 边界：FLUSHDB 仅用于独立测试环境，生产执行将删除整个当前库。
FLUSHDB SYNC
DBSIZE
# 初始：当前数据库只含刚创建的学习 key，其他实验已清理。
# 关键变化：数据库中的所有 key 被删除。
# 输出：OK、OK、0。
```

FLUSHDB 清空当前库，FLUSHALL 清空所有库；两者都没有业务前缀边界。ASYNC 只异步释放，不是安全删除或撤销功能；Cluster 的库与节点作用域还需确认。生产误操作没有命令级回滚，只能走事先演练的备份恢复。[FLUSHDB](https://redis.io/docs/latest/commands/flushdb/)。

## 易混点

TTL 到期与物理回收存在时间差；SCAN 返回游标是继续令牌，不能当作偏移页码。

## 课后小问

1. SCAN 返回空数组时应否停止？

答案：只看返回游标，非 0 就继续；遍历期间重复返回需去重或幂等。

2. 怎样处理写命令响应丢失？

答案：响应丢失不能证明没有执行；先检查业务状态，对非幂等写入使用业务 ID、去重记录或有界恢复流程。

## 本节小结

先界定 key 和容量，再选择有界扫描与删除，观察逻辑消失和内存回收两个阶段。

## 快速回顾

按 H3 定位真实命令或操作流程，重建初始状态并读回结果，再检查超时、容量和数据安全边界。
