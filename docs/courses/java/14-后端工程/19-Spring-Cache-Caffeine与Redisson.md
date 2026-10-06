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

本文采用 JDK 20、Spring Boot 3.4 / Framework 6.2、Caffeine 3.x、Redisson 3.x。依赖 cache starter、`com.github.ben-manes.caffeine:caffeine`；Redisson 为可选依赖，Spring 集成模块要匹配 Framework/Spring Data 版本，不能只看 Redisson 主版本。参考 [Spring 缓存注解](https://docs.spring.io/spring-framework/reference/integration/cache/annotations.html)、[Caffeine eviction](https://github.com/ben-manes/caffeine/wiki/Eviction)、[refresh](https://github.com/ben-manes/caffeine/wiki/Refresh)、[Redisson 锁](https://redisson.pro/docs/data-and-services/locks-and-synchronizers/)。Redis 命令和锁算法详解安排在第 15 章《缓存穿透、击穿、雪崩与一致性》和《分布式锁、租约与 Fencing Token》，规范路径为 `/courses/java/15-Redis/09-缓存穿透击穿雪崩与一致性`、`/courses/java/15-Redis/11-分布式锁租约与Fencing-Token`；后续章节上线后再提供可点击入口。这里先定义必要边界，不要求先学后置章。

缓存键应包含租户、业务标识、数据版本等隔离维度，不能只用 id。更新一般先提交数据库，再使缓存失效；“数据库+Redis+每个 L1”不是一个原子事务，消息丢失或并发读回填仍可能旧值复活。用 TTL 限制陈旧窗口、版本比较/事件重试和修复任务达成最终一致性；要求强一致的数据直接读事实数据库。两次删除、普通 Pub/Sub 或锁都不能单独证明无陈旧。

## 常用用法

### `@Cacheable`：按键缓存读取

用途：用于跳过已有结果的昂贵读取，并在输入与返回值符合策略时缓存结果。

```java
// 初始状态：工程启用 @EnableCaching 且配置 orders CacheManager；真实调用从代理进入。
class OrderReads {
    @org.springframework.cache.annotation.Cacheable(cacheNames="orders", key="#p0 + ':' + #p1",
        condition="#p1 > 0", unless="#result == null")
    public String find(String tenant, long id) { return id == 7 ? "PAID" : null; }
    // 关键变化：tenant-a/7 缓存键为 tenant-a:7，缺失结果不缓存。
}
// 结果：通过代理首次读加载 PAID，再次读命中；需要用真实缓存和加载计数断言。
```

这里类必须注册为 Spring Bean，`@EnableCaching` 开启代理，CacheManager 创建 orders 区域。`condition` 调用前判断、`unless` 获得结果后否决；null 不缓存可能持续穿透，是否短期缓存空值需另外设计。`sync=true` 提示 provider 对同键加载同步，通常不支持与 unless 组合，具体行为受 provider 限制；不是跨实例分布式锁。自调用 `this.find(...)` 不经过代理，会绕过缓存。

### `@CachePut`：执行方法并更新缓存

用途：用于让更新方法在执行后把返回的最新视图写入同一缓存键。

```java
// 初始状态：tenant-a:7 已缓存 PAID；教学方法表示数据库更新后返回新状态。
class OrderWrites {
    @org.springframework.cache.annotation.CachePut(cacheNames="orders", key="#p0 + ':' + #p1")
    public String cancel(String tenant, long id) {
        // 关键变化：真实实现应完成受约束的数据库更新，返回 CANCELLED 视图。
        return "CANCELLED";
    }
}
// 结果：通过代理调用后键 tenant-a:7 可变为 CANCELLED；本例没有假称执行了数据库事务。
```

CachePut 总会调用方法，不是缓存读命中。缓存更新若先于事务提交，随后回滚会泄漏未提交状态；需要事务感知 CacheManager 或 AFTER_COMMIT 同步事件，并处理缓存写失败。不要把 CachePut 和 Cacheable 放在同一个方法依赖模糊的执行顺序。

### `@CacheEvict`：写后失效

用途：用于在业务写入成功后删除指定键，让后续读取重新从事实源加载。

```java
// 初始状态：orders 中 tenant-a:7 可能存在，业务调用由代理进入。
class OrderEvictions {
    @org.springframework.cache.annotation.CacheEvict(cacheNames="orders", key="#p0 + ':' + #p1")
    public void invalidate(String tenant, long id) {
        // 关键变化：正常返回后删除 tenant-a:7 缓存键；真实调用由提交成功事件驱动。
    }
}
// 结果：调用 tenant-a/7 后对应键失效；其他租户键不受影响。
```

默认方法成功返回后失效，但成功返回与事务提交顺序仍需确认；`beforeInvocation=true` 在方法执行前删除，即使方法失败也可能已经删除。`allEntries=true` 清空区域，生产必须评估规模和重建冲击，不作为每次订单更新方案。缓存失败时 fail-open 还是 fail-closed 应按业务明确，监控失效失败并提供重试修复。

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

### `RLock.tryLock`：有限等待与显式租约

用途：用于让参与同一 Redis 锁协议的节点互斥执行，限制等待并在结束时正确释放。

```java
// 初始状态：redissonClient 是已配置的教学客户端，锁名按租户/订单隔离。
org.redisson.api.RedissonClient redisson = redissonClient;
org.redisson.api.RLock lock = redisson.getLock("order:tenant-a:7");
boolean acquired = lock.tryLock(200, 5000, java.util.concurrent.TimeUnit.MILLISECONDS);
// 关键变化：最多等 200ms；拿到后租约 5 秒，不会因此保证工作在 5 秒内完成。
if (acquired) {
    try {
        org.junit.jupiter.api.Assertions.assertTrue(lock.isHeldByCurrentThread());
        // 结果：lock.isHeldByCurrentThread() 必须为 true；写入仍需数据库唯一/版本条件。
    } finally {
        if (lock.isHeldByCurrentThread()) lock.unlock();
    }
}
```

未获得锁时应返回明确忙碌或排队结果，不能继续执行。显式 leaseTime 到期可自动释放，超过租约的旧持有者仍可能继续运行。未指定租约的获取方式可用 watchdog 续期（常见默认 timeout 为 30 秒，按版本配置核对）；客户端故障、长暂停和网络分区仍可能失去所有权。watchdog 不是永久保证。限时等待、租约和业务截止时间是三件不同的事。

### `RLock.unlock`：只释放当前线程的锁

用途：用于在所有异常路径恢复锁资源，避免释放别人的锁或让失败持有者继续写入。

```java
// 初始状态：redissonClient 指向隔离测试 Redis；这里不用显式 leaseTime，由 watchdog 路径管理。
org.redisson.api.RedissonClient redisson = redissonClient;
org.redisson.api.RLock lock = redisson.getLock("order:tenant-a:8");
boolean acquired = lock.tryLock(200, java.util.concurrent.TimeUnit.MILLISECONDS);
if (acquired) {
    try {
        // 关键变化：获得 order:tenant-a:8 的线程进入临界区；异步工作不能跨线程偷偷绕过所有权。
        org.junit.jupiter.api.Assertions.assertTrue(lock.isHeldByCurrentThread());
    } finally {
        if (lock.isHeldByCurrentThread()) lock.unlock();
    }
}
// 结果：正常持有时 finally 释放；租约丢失时不强制解开其他线程锁。
```

isHeldByCurrentThread 与 unlock 之间仍可能丢失锁，IllegalMonitorStateException 或网络失败需要处理并保留业务根因；不能把 finally 中解锁失败掩盖原异常。普通 RLock 不给外部存储提供 fencing token。fencing 需要递增 token，并由数据库/资源服务原子拒绝过旧 token；只在客户端比较不成立。数据库约束、幂等记录、版本字段保护最终写入，锁只是协作手段。

两级缓存写路径可为：数据库提交 → 发布带版本的失效事件 → 删除 L2 → 所有节点失效 L1。每一步可能失败，需可靠事件/重试、版本判断和 TTL；普通广播丢失后落后实例会继续读旧 L1。CacheManager 本身不会自动串联两级缓存，组合读写/失败策略要自定义并用多实例故障测试证明陈旧窗口。强一致要求不满足时关闭该路径缓存。

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
