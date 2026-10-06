---
title: 事务、Watch、Pipeline 与 Lua
date: 2026-10-06
category: Java课程
tags: [Java, Redis, 可靠性]
description: 区分队列事务、乐观条件提交、网络批量和服务端脚本，正确解释中止与重试。
---

# 事务、Watch、Pipeline 与 Lua

## 学习目标

区分队列事务、乐观条件提交、网络批量和服务端脚本，正确解释中止与重试。

## 核心知识点

本篇采用 Redis 8 稳定主版本的基础语义；官方文档核对日期：2026-10-06，不声明未验证的补丁版本。需要更高小版本的选项单独标明。

单命令优先于自造协议；需要客户端计算用 WATCH，需要服务器条件读写用短 Lua，纯吞吐批量可用 Pipeline。所有方案都需要区分明确失败与响应丢失。

实验只在本机独立可丢弃 Redis 8、数据库 0 中执行。先通过终端运行 `redis-cli -h 127.0.0.1 -p 6379`，在交互提示符输入 redis 代码块；有 ACL 时使用 `--user lab_user --askpass`，不在命令中写密码。输出数组的排版因客户端而异。每节独立重建输入，命名空间 `lab:{reliability}:` 专用于学习；开始和结束只清理本节明确列出的 key，不把通配符传给删除命令。运行前确认没有业务数据，配置与恢复步骤另按注明的受控前提执行。

## 常用用法

### `MULTI`：开启队列与取消事务

用于将一组实验命令入队并在执行前取消它们。

```redis
SET lab:{reliability}:txn 1
MULTI
INCR lab:{reliability}:txn
DISCARD
GET lab:{reliability}:txn
# 初始：txn 保存字符串数字 1。
# 关键变化：INCR 只入队，DISCARD 丢弃队列，没有执行递增。
# 输出：OK、OK、QUEUED、OK、"1"。
```

MULTI O(1)，队列占用连接状态；DISCARD 不是撤销已执行写入。事务必须使用同一连接，连接池归还前清理事务/WATCH 状态。入队语法错误在 EXEC 时导致 EXECABORT；逐条检查返回，不能把 QUEUED 当成功写入。[事务与 DISCARD](https://redis.io/docs/latest/develop/using-commands/transactions/)。

### `DISCARD`：执行前丢弃连接事务队列

用于在业务决定取消时让已入队的命令不再执行。

```redis
SET lab:{reliability}:txn 5
MULTI
INCR lab:{reliability}:txn
DISCARD
GET lab:{reliability}:txn
# 初始：txn 为数字 5，事务尚未提交。
# 关键变化：DISCARD 清空队列并退出事务状态，txn 仍为 5。
# 输出：OK、OK、QUEUED、OK、"5"。
```

O(队列命令数)，同时取消 WATCH；不能撤销 EXEC 已完成的写入。取消与后续请求必须在正确连接上发生。[DISCARD](https://redis.io/docs/latest/commands/discard/)。

### `EXEC`：原子执行与运行期错误不回滚

用于观察一条运行期类型错误不会撤销其他命令。

```redis
SET lab:{reliability}:txn text
MULTI
INCR lab:{reliability}:txn
SET lab:{reliability}:txn after
EXEC
GET lab:{reliability}:txn
# 初始：txn 是非数字 String，所以 INCR 在执行时失败。
# 关键变化：队列按顺序执行，错误不阻止后面的 SET。
# 输出：OK、OK、QUEUED、QUEUED；EXEC 数组含整数错误和 OK；GET 为 "after"。
```

原子性指执行期间没有其他客户端命令穿插，不代表数据库式失败回滚；Redis 不回滚运行期已完成的命令。EXEC 复杂度是队列内命令成本总和。多 key 在 Cluster 同槽；超时可能发生在已执行之后，盲目重试 INCR 会重复递增。[EXEC](https://redis.io/docs/latest/commands/exec/)。

### `WATCH`：两连接 CAS 冲突与 null 中止

用于在读取后被其他连接修改时阻止整个队列执行。

```redis
# 初始：连接 A 执行 SET，连接 B 是第二个本机 redis-cli。
# A:
SET lab:{reliability}:watch 10
WATCH lab:{reliability}:watch
GET lab:{reliability}:watch
# 暂停 A，切到 B 输入：
SET lab:{reliability}:watch 11
# 回到 A：
MULTI
SET lab:{reliability}:watch 12
EXEC
GET lab:{reliability}:watch
# 关键变化：B 把 10 改为 11，A 的 CAS 队列全部中止。
# 输出：A 的 EXEC 为 null（RESP2 客户端常显示 nil），GET 为 "11"。
```

WATCH O(key 数)，必须先 WATCH 再 GET；自身写入、其他客户端写入、Redis 过期或淘汰都可触发中止（过期自 6.0.9 起适用）。null 与包含错误的 EXEC 数组不同。EXEC 完成后取消 WATCH；不执行事务时 UNWATCH。冲突后重新 WATCH、读取、计算，并退避、有重试上限；不可复用过时值。网络中断后执行状态不确定仍要业务幂等。[WATCH](https://redis.io/docs/latest/commands/watch/)。

### `UNWATCH`：提前退出乐观锁流程

用于在业务条件不满足时取消连接上的监视状态。

```redis
SET lab:{reliability}:watch 0
WATCH lab:{reliability}:watch
GET lab:{reliability}:watch
UNWATCH
# 初始：watch 值为 0，业务规则不允许继续扣减。
# 关键变化：读到 0 后退出流程，连接不再监视该 key。
# 输出：OK、OK、"0"、OK。
```

UNWATCH O(1)，不是释放业务互斥锁。连接关闭也清除监视；不要把事务连接和常规并发请求混用。[UNWATCH](https://redis.io/docs/latest/commands/unwatch/)。

### `Pipeline`：批量往返与非原子执行

用于在一次网络批量中发送预先确定的命令并统计响应。

```shell
# 初始：以下是 Bash 终端命令，独立可丢弃本机实例，学习 pipe key 可覆盖。
printf 'SET lab:{reliability}:pipe 1\r\nINCR lab:{reliability}:pipe\r\nGET lab:{reliability}:pipe\r\n' | redis-cli -h 127.0.0.1 -p 6379 --pipe
# 关键变化：同一连接依次写入 1、递增到 2、读取 2。
# 输出：All data transferred，errors: 0, replies: 3（成功时）；单独 GET 验证为 2。
```

Pipeline 减少 RTT 和系统调用，非原子：其他客户端可能在命令之间执行；不能用前一响应动态构造同一批后续命令。--pipe 的汇总不显示每条值，需单独读回。批量有界以避免客户端/服务端响应缓冲占用内存，逐条检查错误；部分响应丢失不表示整批失败，不盲重放非幂等写入。Cluster 客户端可分发各节点批次，不能据此得到跨节点原子性。[Pipelining](https://redis.io/docs/latest/develop/using-commands/pipelining/)。

### `EVAL`：Lua 原子读改写与 Cluster 同槽

用于在服务端一次执行中检查库存并决定是否扣减。

```redis
SET lab:{reliability}:stock 2
# 危险：EVAL 只在本机可丢弃 key 上执行经审查的短脚本；生产脚本要限制循环与输入规模。
# 边界：EVAL 仅用于测试环境已审查短脚本，防止阻塞与错误写入。
EVAL "local n=tonumber(redis.call('GET',KEYS[1]) or '0'); local q=tonumber(ARGV[1]); if n>=q then return redis.call('DECRBY',KEYS[1],q) else return -1 end" 1 lab:{reliability}:stock 1
GET lab:{reliability}:stock
# 初始：库存为 2，参数为可信的正整数 1。
# 关键变化：stock 从 2 扣减到 1，读改写不能被其他客户端穿插。
# 输出：OK、1、"1"。
```

示例要求库存为非负整数、q 为正整数，生产应在任何写入前验证类型、范围、参数；Lua 数值精度不能覆盖任意 64 位整数。脚本原子但不回滚：写入后发生错误仍可能保留此前写入。执行期间阻塞其他客户端，时间随脚本操作量增长，不能用于全库扫描。所有访问的 key 必须显式列在 KEYS，ARGV 只传值；Cluster 所有 key 必须同槽，{reliability} 是 hash tag，不能动态拼出未声明 key。超时后的 BUSY/KILL 与已写脚本处理需专门运维方案。[EVAL](https://redis.io/docs/latest/commands/eval/)、[脚本执行边界](https://redis.io/docs/latest/develop/programmability/eval-intro/)。

### `SCRIPT LOAD`：载入固定脚本并观察摘要

用于提前将固定脚本字节载入当前节点的执行缓存。

```redis
# 初始：固定脚本文本为 return 1，是否已缓存不影响重复载入结果。
# 边界：SCRIPT LOAD 仅用于受控测试环境已审查脚本，生产需管理权限和部署范围。
SCRIPT LOAD "return 1"
# 关键变化：缓存得到 return 1 的 SHA 映射，没有业务 key 写入。
# 输出："e0e1f9fabfc9d4800c877a703b823ac0578ff8db"。
```

O(脚本长度)，重复载入相同字节得到相同 SHA。返回摘要不表示所有 Cluster 节点均已加载；缓存不能替代源代码与发布记录。[SCRIPT LOAD](https://redis.io/docs/latest/commands/script-load/)。

### `EVALSHA`：脚本缓存与 NOSCRIPT 恢复

用于按固定脚本的 SHA 调用并观察缓存缺失时的错误。

```redis
# 初始：在本机实验服务中载入不访问 key 的只读常量脚本。
# 边界：SCRIPT 仅用于受控测试环境载入已审查短脚本。
SCRIPT LOAD "return 1"
# 边界：EVALSHA 仅用于受控测试环境短脚本，执行前验证缓存与权限。
EVALSHA e0e1f9fabfc9d4800c877a703b823ac0578ff8db 0
# 关键变化：载入脚本缓存后通过其 SHA 调用。
# 输出：SHA "e0e1f9fabfc9d4800c877a703b823ac0578ff8db"、整数 1。
```

危险：SCRIPT LOAD/EVALSHA 只演示本机经审查短脚本，生产需控制脚本权限和执行耗时。SHA 与脚本字节精确对应；重启、切节点或缓存变动可能得到 NOSCRIPT，要在实际执行节点重新加载/按客户端规范回退。Pipeline 中收到 NOSCRIPT 已不能把回退插入原批次，先加载或按可靠客户端策略处理。Redis 7+ Functions 是独立的持久化、复制函数库机制，并非 EVAL 缓存同义词；本篇不提供 FUNCTION LOAD 部署流程。[EVALSHA](https://redis.io/docs/latest/commands/evalsha/)、[SCRIPT LOAD](https://redis.io/docs/latest/commands/script-load/)。

## 易混点

事务、Lua 的无穿插执行不意味着失败回滚，Pipeline 只是减少网络往返。

## 课后小问

1. WATCH 的 EXEC 返回 null 后是否重新发送旧 SET 即可？

答案：必须重新建立 WATCH 并读取现值，重新计算后有界提交；null 说明队列未执行。

2. 怎样处理写命令响应丢失？

答案：响应丢失不能证明没有执行；先检查业务状态，对非幂等写入使用业务 ID、去重记录或有界恢复流程。

## 本节小结

根据依赖关系选择最小原子范围，验证错误、连接状态与 Cluster 槽位。

## 快速回顾

按 H3 定位真实命令或操作流程，重建初始状态并读回结果，再检查超时、容量和数据安全边界。
