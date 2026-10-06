---
title: 分布式锁、租约与 Fencing Token
date: 2026-10-06
category: Java课程
tags: [Java, Redis, Lock]
description: 用所有权令牌安全释放和续期，并在受保护资源端拒绝过期持有者。
---

# 分布式锁、租约与 Fencing Token

## 学习目标

掌握唯一 owner token、原子释放、有限续期，区分协作互斥与资源写入安全。

## 核心知识点

本篇采用 JDK 20、Redis 8 基础语义和 Redisson 3.52.0；官方文档核对日期 2026-10-06。[Redis 锁协议](https://redis.io/docs/latest/develop/clients/patterns/distributed-locks/)描述单节点及 Redlock 的假设；[Redisson 锁](https://redisson.pro/docs/data-and-services/locks-and-synchronizers/)描述客户端行为。Redis 8.4 的 DELEX IFEQ 不作为 Redis 8 全版本可用命令，下面保持 Lua 兼容路径。事务/脚本的一般规则见[事务与 Lua](./07-事务Watch-Pipeline与Lua)，重建场景见[缓存一致性](./09-缓存穿透击穿雪崩与一致性)。框架选择见[后端缓存选型](../14-后端工程/19-Spring-Cache-Caffeine与Redisson)。

学习命令仅在本机独立可丢弃 Redis 8 的 DB 0 执行：`redis-cli -h 127.0.0.1 -p 6379`；有 ACL 使用 `--user lab_user --askpass`。每次实验换新的 owner 值，下文两个 UUID 是固定教学输入，生产不得重复使用。租约从服务器成功写入时开始，客户端等待响应也消耗时间；应用截止时间需用单调时钟预算并预留安全余量。超时不能证明获取失败；不确定时不进入临界区，尝试按 token 释放并等待有界恢复。

### `SET NX PX`：故障模型与有限互斥

用于观察锁过期后另一持有者可进入而旧持有者尚未停止的状态。

```redis
SET lab:{locks}:fault 05a69d76-330e-4ddc-9906-56c91959d089 NX PX 1000
# 初始：实验 key 不存在，A 暂停超过 1 秒；等待到期后再执行 B。
SET lab:{locks}:fault e8d1f73f-bc7a-426d-8d08-dc0147bdcd28 NX PX 10000
GET lab:{locks}:fault
# 关键变化：B 得到租约，恢复后的 A 仍可能执行外部写入。
# 输出：到期后第二次 SET 为 OK，GET 为 B 的 token。
```

这里故意手动等待以演示故障，不是生产协调办法。长 GC、进程暂停、网络分区都可越过租约；异步复制在主节点写入尚未复制时故障转移可能出现两个持有者。Redlock 使用多个独立主节点、多数派和时间假设，不等于 Sentinel 主从，也不解除资源端 fencing 要求。网络/时钟假设不满足时不能承诺互斥；强约束交给事实资源的事务、条件写或专门协调系统。

## 常用用法

### `SET NX PX`：获取带期限的锁

用于把仅在不存在时写入与毫秒租约放在同一个命令里。

```redis
SET lab:{locks}:order 05a69d76-330e-4ddc-9906-56c91959d089 NX PX 30000
SET lab:{locks}:order e8d1f73f-bc7a-426d-8d08-dc0147bdcd28 NX PX 30000
GET lab:{locks}:order
# 初始：order key 不存在，立即连续执行两个申请。
# 关键变化：A 占有 30 秒租约；B 不覆盖 A。
# 输出：OK、nil、A 的 UUID；过期或延迟会改变本次观察。
```

不能先 SETNX 再 EXPIRE，中途崩溃会留下无期限锁。未取得 OK 不得执行业务，竞争时采用有界等待和 jitter；随机 owner 只证明所有权，不是排序 token。[SET](https://redis.io/docs/latest/commands/set/)。

### `UUID.randomUUID`：每次申请生成 owner token

用于为一次锁申请生成独立令牌而不是复用线程名或业务主键。

```java
String first = java.util.UUID.randomUUID().toString();
String second = java.util.UUID.randomUUID().toString();
System.out.println(first.equals(second));
// 输出：通常 false
// 初始：两个不同的锁申请，输出具体 UUID 不固定。
// 关键变化：两次申请分别生成随机 owner，冲突概率极低但不是数学零。
```

所有重试必须明确是恢复同一次申请还是新的申请；新申请使用新 token，不用时间戳单独充当唯一值。

### `EVAL`：比较 owner 后原子删除

用于让旧申请的释放操作不能删除新申请已经取得的锁。

```redis
SET lab:{locks}:release e8d1f73f-bc7a-426d-8d08-dc0147bdcd28 NX PX 30000
# 边界：EVAL 仅用于测试环境已审查短脚本，防止阻塞与错误写入。
EVAL "if redis.call('GET',KEYS[1])==ARGV[1] then return redis.call('DEL',KEYS[1]) else return 0 end" 1 lab:{locks}:release 05a69d76-330e-4ddc-9906-56c91959d089
GET lab:{locks}:release
# 边界：EVAL 仅用于测试环境已审查短脚本，防止阻塞与错误写入。
EVAL "if redis.call('GET',KEYS[1])==ARGV[1] then return redis.call('DEL',KEYS[1]) else return 0 end" 1 lab:{locks}:release e8d1f73f-bc7a-426d-8d08-dc0147bdcd28
# 初始：release 由 B 拥有，A 已过期。
# 关键变化：A 返回 0 保留 B，B 自己释放返回 1。
# 输出：OK、0、B 的 token、1。
```

比较与删除必须在同一服务端原子操作中；客户端 GET 后 DEL 有竞态。脚本只能保证 Redis 侧释放，不能撤销已经发生的数据库写入。[官方释放算法](https://redis.io/docs/latest/develop/clients/patterns/distributed-locks/)。

### `PEXPIRE`：在 owner 比较后续期

用于只给仍属于本次申请的锁续租并观察续期失败。

```redis
SET lab:{locks}:renew 05a69d76-330e-4ddc-9906-56c91959d089 NX PX 30000
# 边界：EVAL 仅用于测试环境已审查短脚本，防止阻塞与错误写入。
EVAL "if redis.call('GET',KEYS[1])==ARGV[1] then return redis.call('PEXPIRE',KEYS[1],ARGV[2]) else return 0 end" 1 lab:{locks}:renew 05a69d76-330e-4ddc-9906-56c91959d089 30000
PTTL lab:{locks}:renew
# 边界：EVAL 仅用于测试环境已审查短脚本，防止阻塞与错误写入。
EVAL "if redis.call('GET',KEYS[1])==ARGV[1] then return redis.call('PEXPIRE',KEYS[1],ARGV[2]) else return 0 end" 1 lab:{locks}:renew e8d1f73f-bc7a-426d-8d08-dc0147bdcd28 30000
# 初始：renew 是 A 的 30 秒租约，立即执行。
# 关键变化：A 续期为 1，错误 owner 为 0，不复活已过期锁。
# 输出：OK、1、0 到 30000 之间的剩余毫秒、0。
```

不能裸 PEXPIRE 别人的锁。客户端安排续期时必须有任务总截止时间与最大次数；失败/不确定就停止提交新工作，并使用资源端拒绝保护已经在途的写。无限续期不能代替截止时间，也无法停止暂停中的线程。此 H3 的真实操作在 Lua 的 redis.call 内。[PEXPIRE](https://redis.io/docs/latest/commands/pexpire/)。

### `RLock.tryLock`：显式等待和 leaseTime

用于通过 Redisson 限制获取等待与持有租约并正确退出竞争。

```java
org.redisson.api.RLock lock = redissonClient.getLock("lab:{locks}:redisson");
boolean acquired = lock.tryLock(200, 5000, java.util.concurrent.TimeUnit.MILLISECONDS);
if (!acquired) System.out.println("BUSY");
// 输出：竞争失败时 BUSY
else {
    try { System.out.println(lock.isHeldByCurrentThread()); }
// 输出：持有租约时 true
    finally { if (lock.isHeldByCurrentThread()) lock.unlock(); }
}
// 初始：已注入连接隔离 Redis 的 redissonClient，调用线程允许 InterruptedException 上抛。
// 关键变化：最多等待 200ms，成功后显式 5 秒租约到期可被别人取得。
```

显式 leaseTime 路径不依赖 watchdog 自动延长。未传 leaseTime 的获取方式可使用 watchdog，默认 lockWatchdogTimeout 常为 30 秒，须按版本配置确认。两条路径都不保证工作能及时停止，锁不是外部事务。[Redisson RLock](https://redisson.pro/docs/data-and-services/locks-and-synchronizers/)。

### `RLock.unlock`：所有权与释放异常

用于在同一持有线程释放锁并保留所有权丢失的可观察结果。

```java
org.redisson.api.RLock lock = redissonClient.getLock("lab:{locks}:watchdog");
boolean acquired = lock.tryLock(200, java.util.concurrent.TimeUnit.MILLISECONDS);
if (acquired) {
    try { System.out.println("ACQUIRED"); }
// 输出：取得租约时 ACQUIRED
    finally {
        try { if (lock.isHeldByCurrentThread()) lock.unlock(); }
        catch (IllegalMonitorStateException lost) { System.out.println("OWNERSHIP_LOST"); }
// 输出：竞态丢失所有权时 OWNERSHIP_LOST
    }
}
// 初始：同线程执行，未指定 leaseTime；watchdog 也可能因暂停或断网失败。
// 关键变化：finally 尝试释放，但检查和 unlock 之间仍存在竞态。
```

生产还需处理 Redis 网络异常、保留原业务异常（追加 suppressed 或结构化记录），不能让解锁错误覆盖根因，也不盲重试外部写。可重入次数须匹配释放次数；异步任务不能把普通线程所有权直接转给其他线程。普通 RLock 不生成 fencing token。

### `FencingResource.write`：资源端原子拒绝旧 token

用于用一个可运行资源模型证明新持有者写入后旧持有者无法覆盖状态。

```java
class FencingResource {
    private long lastToken = 40;
    private String state = "PAID";
    public synchronized boolean write(long token, String next) {
        if (token <= lastToken) return false;
        lastToken = token;
        state = next;
        return true;
    }
    public synchronized String state() { return state; }
}
FencingResource resource = new FencingResource();
boolean fresh = resource.write(42, "CANCELLED");
boolean stale = resource.write(41, "PAID");
System.out.println(fresh + "/" + stale + "/" + resource.state());
// 输出：true/false/CANCELLED
// 初始：资源 lastToken=40；42 是新持有者，41 是暂停后恢复的旧持有者。
// 关键变化：同一资源同步方法原子比较并更新，旧 41 被拒绝。
```

这是资源端内存模型，未连接数据库。生产数据库应在同一原子条件 UPDATE 中检查 `last_token < token` 并更新 state/last_token，检查影响行数；不能先 SELECT 再无条件 UPDATE。严格递增拒绝同 token 重试，多次操作需额外定义幂等协议。token 分配必须单调且恢复后不回退；Redis INCR 在异步故障转移/备份回退后不能单独证明该条件。Redisson RFencedLock 可提供 token API，但仍必须让受保护资源验证并审计恢复假设。owner 随机值、fencing 顺序号和用户授权分别负责不同问题。[Redisson Fenced Lock](https://redisson.pro/docs/data-and-services/locks-and-synchronizers/#fenced-lock)。

## 易混点

安全解锁只保护锁 key；续期只是推迟过期。fencing 拒绝较旧 token 的写入，但不是身份认证，也不能仅在客户端生成或比较。

## 课后小问

1. A 超过租约后检查自己仍活着，能继续写吗？答案：不能据此判断所有权；资源必须原子拒绝过旧 token。
2. Redis 主从加 Sentinel 就保证锁唯一吗？答案：不保证，异步复制可能丢失已确认锁。

## 本节小结

把获取、续期、释放和资源条件写分开验证，故障时按不确定结果处理。

## 快速回顾

唯一 owner → SET NX PX → Lua compare-delete/renew → 有限预算 → 资源 fencing。结束实验只清理 `lab:{locks}:fault`、`lab:{locks}:order`、`lab:{locks}:release`、`lab:{locks}:renew`、`lab:{locks}:redisson`、`lab:{locks}:watchdog`，停止客户端后由实验管理员逐个删除；不得清理业务锁。
