---
title: Spring Cache、Caffeine 与 Redisson
date: 2026-10-05
category: Java后端工程
tags: [Java, Cache, Caffeine, Redisson]
description: 区分缓存抽象、本地缓存与分布式协调，明确两级缓存和锁的故障边界。
---

# Spring Cache、Caffeine 与 Redisson

## 学习目标

- 能设计缓存键、加载条件和写后失效，不把缓存当事实数据库。
- 能选择 Caffeine 的容量、过期、刷新与统计并解释多实例行为。
- 能说明 Redisson 锁的所有权、watchdog、租约和 fencing 限制。

## 核心知识点

Spring Cache 是方法调用缓存的抽象，不规定存储、TTL 或一致性。Caffeine 是进程内缓存，读取快但各实例独立。Redisson 提供 Redis 客户端与分布式对象，锁可以协调参与者，却不替代数据库约束或事务。两级缓存通常为 L1 Caffeine/L2 Redis；数据库仍是事实源，缓存允许的陈旧时间必须业务明确。

本文采用 JDK 20、Spring Boot 3.4 / Framework 6.2、Caffeine 3.x、Redisson 3.x。依赖 cache starter、`com.github.ben-manes.caffeine:caffeine`；Redisson 为可选依赖，Spring 集成模块要匹配 Framework/Spring Data 版本，不能只看 Redisson 主版本。参考 [Spring 缓存注解](https://docs.spring.io/spring-framework/reference/integration/cache/annotations.html)、[Caffeine eviction](https://github.com/ben-manes/caffeine/wiki/Eviction)、[refresh](https://github.com/ben-manes/caffeine/wiki/Refresh)、[Redisson 锁](https://redisson.pro/docs/data-and-services/locks-and-synchronizers/)。本篇负责框架选型与两级缓存的工程取舍：单实例短期热点优先 Caffeine，多实例共享值选择 Redis provider，协作互斥另选 Redisson。命令与算法事实统一查[缓存故障与一致性](../15-Redis/09-缓存穿透击穿雪崩与一致性)、[锁租约与 fencing](../15-Redis/11-分布式锁租约与Fencing-Token)；注解/provider 细节统一查[Spring Cache](../15-Redis/12-Spring-Cache与缓存抽象)、[RedisTemplate 与连接](../15-Redis/13-RedisTemplate序列化与连接管理)。

缓存键应包含租户、业务标识、数据版本等隔离维度，不能只用 id。更新一般先提交数据库，再使缓存失效；“数据库+Redis+每个 L1”不是一个原子事务，消息丢失或并发读回填仍可能旧值复活。用 TTL 限制陈旧窗口、版本比较/事件重试和修复任务达成最终一致性；要求强一致的数据直接读事实数据库。两次删除、普通 Pub/Sub 或锁都不能单独证明无陈旧。

方法缓存适合读多写少、允许陈旧的派生视图；需要每次读取最新事实时绕过缓存。先决定租户与视图隔离、空结果策略和提交后失效，再选择 provider；`condition`、`unless`、`sync` 和自调用的机制查[Cacheable 条件与代理边界](../15-Redis/12-Spring-Cache与缓存抽象#cacheable-key、condition-与-unless)。写入返回最新视图和写后失效分别查[CachePut](../15-Redis/12-Spring-Cache与缓存抽象#cacheput-执行后写入最新视图)、[CacheEvict](../15-Redis/12-Spring-Cache与缓存抽象#cacheevict-失效范围与-beforeinvocation)；[事务感知配置](../15-Redis/12-Spring-Cache与缓存抽象#rediscachemanagerbuilder-transactionaware-提交后的写缓存)不免除提交后修复责任。

多个实例重复重建同一热点时可考虑 Redisson 协作锁；若只是单进程重复加载，先评估 Caffeine 加载与刷新。选用分布式锁时，等待、租约、watchdog 和业务截止时间必须符合故障预算，操作规则查[RLock 获取](../15-Redis/11-分布式锁租约与Fencing-Token#rlock-trylock-显式等待和-leasetime)与[所有权释放](../15-Redis/11-分布式锁租约与Fencing-Token#rlock-unlock-所有权与释放异常)。不可接受旧持有者覆盖写入的业务，仍需数据库约束、幂等及[资源端 fencing](../15-Redis/11-分布式锁租约与Fencing-Token#fencingresource-write-资源端原子拒绝旧-token)；这里将其作为选型前提，不把持锁当作写入安全证明。

## 常用用法

### `Caffeine.newBuilder`：限制本地缓存空间和寿命

用途：用于给本地缓存设置容量、写后过期和统计，避免缓存无限增长。

```java
// 初始状态：教学缓存为空，最多 1000 个条目，写后 30 秒过期。
com.github.benmanes.caffeine.cache.Cache<String, String> cache =
    com.github.benmanes.caffeine.cache.Caffeine.newBuilder()
        .maximumSize(1000).expireAfterWrite(java.time.Duration.ofSeconds(30)).recordStats().build();
cache.put("tenant-a:7", "PAID");
String state = cache.getIfPresent("tenant-a:7");
// 关键变化：只有本进程缓存 tenant-a:7；另一应用实例没有同步得到该条目。
org.junit.jupiter.api.Assertions.assertEquals("PAID", state);
org.junit.jupiter.api.Assertions.assertEquals(1L, cache.stats().hitCount());
// 结果：确定的立即读取命中一次；过期测试应用受控 Ticker，不用 sleep。
```

maximumSize 是条目数，不是精确内存上限；大对象可使用 maximumWeight/weigher，仍需测真实内存。expireAfterAccess 按访问续期可能让热旧值长期存在；expireAfterWrite 提供写后陈旧上限。过期后的可见性和物理清理由库机制处理，estimatedSize 不代表即时清理完毕。统计用于命中/驱逐/加载失败诊断，不能把高命中率当一致性证明。

### `LoadingCache.refresh`：刷新时保留旧值

用途：用于异步重新加载已有键，降低集中到期重建压力并明确刷新失败时的旧值语义。

```java
// 初始状态：教学加载器第一次返回 PAID，第二次返回 CANCELLED。
java.util.concurrent.atomic.AtomicInteger loads = new java.util.concurrent.atomic.AtomicInteger();
com.github.benmanes.caffeine.cache.LoadingCache<String, String> cache =
    com.github.benmanes.caffeine.cache.Caffeine.newBuilder()
        .refreshAfterWrite(java.time.Duration.ofSeconds(10))
        .expireAfterWrite(java.time.Duration.ofSeconds(30))
        .build(key -> loads.incrementAndGet() == 1 ? "PAID" : "CANCELLED");
org.junit.jupiter.api.Assertions.assertEquals("PAID", cache.get("tenant-a:7"));
cache.refresh("tenant-a:7").join();
// 关键变化：显式 refresh 的 future 完成后新值替代 PAID；等待前可能仍读到旧值。
org.junit.jupiter.api.Assertions.assertEquals("CANCELLED", cache.getIfPresent("tenant-a:7"));
// 结果：教学刷新成功后为 CANCELLED；生产刷新失败仍需监控与过期兜底。
```

refreshAfterWrite 让条目在被读取时具备刷新资格，不是周期性扫描所有键；刷新异步且旧值可继续被读取，刷新失败通常保留旧值并记录异常。独立 expireAfterWrite 限制寿命，不应宣称刷新机制天然保持最新。

两级缓存写路径可为：数据库提交 → 发布带版本的失效事件 → 删除 L2 → 所有节点失效 L1。每一步可能失败，需可靠事件/重试、版本判断和 TTL；普通广播丢失后落后实例会继续读旧 L1。CacheManager 本身不会自动串联两级缓存，组合读写/失败策略要自定义并用多实例故障测试证明陈旧窗口。强一致要求不满足时关闭该路径缓存。

### `Cache.asMap`：两级缓存一致性与版本失效

用途：用于演示多个 L1 的失效丢失和延迟事件处理，把允许陈旧窗口与修复行为变成可观察状态。

```java
// 初始状态：内存模型代表两个实例的 L1；shared 仅模拟 L2，不声称已连接 Redis。
record Versioned(long version, String state) {}
String key = "tenant-a:7";
com.github.benmanes.caffeine.cache.Cache<String,Versioned> first = com.github.benmanes.caffeine.cache.Caffeine.newBuilder().build();
com.github.benmanes.caffeine.cache.Cache<String,Versioned> second = com.github.benmanes.caffeine.cache.Caffeine.newBuilder().build();
java.util.Map<String,Versioned> shared = new java.util.concurrent.ConcurrentHashMap<>();
Versioned old = new Versioned(1, "PAID");
first.put(key, old); second.put(key, old); shared.put(key, old);
Versioned committed = new Versioned(2, "CANCELLED");
shared.remove(key); first.invalidate(key);
// 关键变化：数据库提交 v2 后 L2/A 失效；B 丢失事件，仍返回 v1=PAID。
org.junit.jupiter.api.Assertions.assertEquals("PAID", second.getIfPresent(key).state());
second.invalidate(key);
second.put(key, committed);
first.put(key, committed);
long delayedEventVersion = 1;
first.asMap().computeIfPresent(key, (k, value) -> value.version() <= delayedEventVersion ? null : value);
// 关键变化：重试事件使 B 重新加载 v2；晚到的 v1 失效不能删除 A 已有的 v2。
org.junit.jupiter.api.Assertions.assertEquals(2L, second.getIfPresent(key).version());
org.junit.jupiter.api.Assertions.assertEquals(2L, first.getIfPresent(key).version());
// 结果：两个 L1 最终均为 v2；丢失事件后的旧值 PAID 是模型明确展示的故障。
```

生产 L2 失效/回填需要同样的版本保护；单纯删除后并发旧读仍可回填旧数据。可靠事件或 outbox、重试和周期修复承担传播，独立 TTL 限制未收到事件实例的陈旧窗口。这个内存模型只验证状态规则，不验证 Redis、消息可靠性或跨实例传输。应在真实两实例测试中断开 B 的订阅、更新数据库、恢复并核对版本及陈旧持续时间；超过业务允许窗口时改读事实数据库。

## 易混点

TTL 由 provider 配置，Cacheable 不设置它；sync 不等于跨节点锁；refresh 不等于定时最新；持锁不等于外部写入安全。分布式锁不能替代数据库约束、事务或幂等键。

## 课后小问

1. L2 删除后所有 L1 都最新了吗？答案：不保证。解析：各实例独立，失效事件可能丢失，需要 TTL/重试/版本修复。
2. watchdog 能防止暂停后的旧持有者写入吗？答案：不能。解析：需要资源端 fencing/版本拒绝。
3. 刷新失败后读到什么？答案：可能是旧值。解析：刷新与过期不同，故障和陈旧窗口必须监控。

## 本节小结

缓存提高吞吐，锁减少重复工作；二者都需要显式的陈旧和失败策略。事实数据库承担最终约束，跨实例一致性必须有故障证据。

## 快速回顾

隔离缓存键 → condition/unless/代理 → 提交后失效 → Caffeine 容量/过期/刷新 → 两级版本与修复 → 锁等待/租约/所有权 → fencing 与数据库约束。
