---
title: Spring Cache 与缓存抽象
date: 2026-10-06
category: Java课程
tags: [Java, Spring, Redis, Cache]
description: 区分方法缓存代理与 Redis provider，配置键、TTL、null 和事务边界。
---

# Spring Cache 与缓存抽象

## 学习目标

能通过真实代理观察缓存注解，配置 Redis provider 并解释 TTL、加载竞争和事务时序。

## 核心知识点

采用 JDK 20、Spring Boot 3.4.13、Framework 6.2 / Spring Data Redis 3.4.x；不是把当前 4.x API 当作 Boot 3 API。依赖 `spring-boot-starter-cache`、`spring-boot-starter-data-redis`；Boot 管理版本。核对日期 2026-10-06：[Framework 注解](https://docs.spring.io/spring-framework/reference/integration/cache/annotations.html)、[Data Redis 3.4 cache](https://github.com/spring-projects/spring-data-redis/blob/3.4.13/src/main/antora/modules/ROOT/pages/redis/redis-cache.adoc)、[Boot 3.4 cache](https://docs.spring.io/spring-boot/3.4/reference/io/caching.html)。

Spring Cache 抽象拦截方法调用，CacheManager 决定区域和 provider；RedisCache 才把区域映射到 Redis。TTL、序列化和多实例行为不由注解决定。命令事实见[Redis 过期](./06-Key过期扫描与删除)，失效一致性见[缓存故障](./09-缓存穿透击穿雪崩与一致性)，Caffeine/Redisson 与两级缓存选型见[后端缓存选型](../14-后端工程/19-Spring-Cache-Caffeine与Redisson)。

以下完整代理实验使用进程内 ConcurrentMapCacheManager 和模拟事实源，证明注解拦截而不声称测试 Redis/数据库。其他 Java 片段在同版本依赖下独立使用；Redis 片段要求隔离 DB 0，只使用 `lab-cache` 前缀。

## 常用用法

### `@EnableCaching`：启用真实 Bean 代理

用于在可运行 Spring 上下文中观察第一次加载与第二次缓存命中。

```java
@org.springframework.context.annotation.Configuration
@org.springframework.cache.annotation.EnableCaching
class CacheLabConfig {
    @org.springframework.context.annotation.Bean
    org.springframework.cache.CacheManager cacheManager() {
        return new org.springframework.cache.concurrent.ConcurrentMapCacheManager("orders");
    }
    @org.springframework.context.annotation.Bean
    OrderRead orderRead() { return new OrderRead(); }
}
class OrderRead {
    private int loads;
    @org.springframework.cache.annotation.Cacheable(cacheNames="orders", key="#p0")
    public String find(String id) { loads++; return "PAID"; }
    public int loads() { return loads; }
}
try (var context = new org.springframework.context.annotation.AnnotationConfigApplicationContext(CacheLabConfig.class)) {
    OrderRead reads = context.getBean(OrderRead.class);
    System.out.println(reads.find("tenant-a:7"));
// 输出：PAID（第一次加载）
    System.out.println(reads.find("tenant-a:7"));
// 输出：PAID（第二次命中）
    System.out.println(reads.loads());
// 输出：1 次实际加载
}
// 初始：orders 区域为空，事实源只模拟返回 PAID。
// 关键变化：两次从 Bean 代理调用，实际方法只加载一次。
```

默认 proxy 模式应从代理调用 public 可拦截方法；直接 new 对象或自调用绕过代理。示例类和方法不能 final。统一方法声明与代理策略，避免在接口和实现混用注解产生误解。

### `@Cacheable`：key、condition 与 unless

用于在方法执行前筛选输入并在执行后拒绝缓存空结果。

```java
class TenantReads {
    @org.springframework.cache.annotation.Cacheable(cacheNames="orders",
        key="#p0 + ':' + #p1", condition="#p1 > 0", unless="#result == null")
    public String find(String tenant, long id) { return id == 7 ? "PAID" : null; }
    public String internal(String tenant, long id) { return this.find(tenant, id); }
}
// 初始：TenantReads 注册为 Bean，orders 空；经代理调用 tenant-a/7。
// 关键变化：condition 先于调用、unless 在结果后；internal 的自调用绕过缓存。
// 输出：find(tenant-a,7) 为 PAID，再次命中；find(tenant-a,8) 为 null 且不缓存。
```

使用 #p0/#p1 不依赖编译参数名；租户、权限视图、语言和模式版本应成为键的一部分，分隔符须转义或使用规范编码防碰撞。null 不缓存可能反复访问事实源，短期空值缓存要单独定义 TTL 和业务空值类型。`sync=true` 请求 provider 同步同键加载，不能与 unless 一起使用，也受单缓存等限制；不自动成为跨 JVM 锁。默认 RedisCacheWriter 非锁写入不是集群防击穿承诺。[注解条件](https://docs.spring.io/spring-framework/reference/integration/cache/annotations.html)。

### `@CachePut`：执行后写入最新视图

用于始终执行更新方法并把返回值放入与读取相同的缓存键。

```java
class TenantWrites {
    @org.springframework.cache.annotation.CachePut(cacheNames="orders", key="#p0 + ':' + #p1")
    public String cancel(String tenant, long id) { return "CANCELLED"; }
}
// 初始：Bean 由代理调用；cancel 只模拟事实源更新，未执行 SQL。
// 关键变化：即使已有 PAID 缓存，方法也会执行并替换该键。
// 输出：cancel(tenant-a,7) 为 CANCELLED，随后 orders 中对应值为 CANCELLED。
```

方法正常返回不一定等于数据库已提交；写后回滚/并发读可能使缓存与事实源分离。不把 CachePut 和 Cacheable 合并在同一方法依赖不明确的跳过行为。

### `@CacheEvict`：失效范围与 beforeInvocation

用于只在写方法正常返回后使指定业务键失效。

```java
class TenantEvictions {
    @org.springframework.cache.annotation.CacheEvict(cacheNames="orders", key="#p0 + ':' + #p1")
    public void invalidate(String tenant, long id) { }
}
// 初始：orders 存在 tenant-a:7 和 tenant-b:7，调用来自代理。
// 关键变化：tenant-a/7 正常返回后删除 tenant-a:7，不触及 tenant-b:7。
// 输出：orders.get("tenant-a:7") 为 null，tenant-b:7 仍有值。
```

`beforeInvocation=true` 在执行前失效，即便方法随后抛异常；`allEntries=true` 清空区域而非单业务键，忽略 key，需容量与重建预算。大区域清理的 KEYS/SCAN 策略属于 provider；不对生产区域无条件全清。[CacheEvict](https://docs.spring.io/spring-framework/reference/integration/cache/annotations.html)。

### `SimpleKeyGenerator`：默认键不包含方法名

用于观察多参数默认键由参数组成并识别同缓存方法碰撞风险。

```java
Object key = org.springframework.cache.interceptor.SimpleKeyGenerator.generateKey("tenant-a", 7L);
Object same = org.springframework.cache.interceptor.SimpleKeyGenerator.generateKey("tenant-a", 7L);
System.out.println(key.equals(same));
// 输出：true
// 初始：两个不同方法输入均为 tenant-a 与 7L，使用同一个 orders 区域。
// 关键变化：tenant-a/7 的两个键相等，生成器不会添加方法名。
```

无参数返回 SimpleKey.EMPTY，单参数通常返回该参数，多参数返回 SimpleKey；参数必须有稳定 equals/hashCode。可变实体作为键可能导致无法命中；Redis key 的最终字节还受键转换/序列化影响。[默认键](https://docs.spring.io/spring-framework/reference/integration/cache/annotations.html)。

### `RedisCacheConfiguration.entryTtl`：默认 TTL 与 null 策略

用于把默认缓存寿命设置为一分钟并显式禁止 null 值缓存。

```java
org.springframework.data.redis.cache.RedisCacheConfiguration defaults =
    org.springframework.data.redis.cache.RedisCacheConfiguration.defaultCacheConfig();
defaults = defaults.entryTtl(java.time.Duration.ofMinutes(1))
        .disableCachingNullValues().computePrefixWith(name -> "lab-cache:v1:" + name + "::");
System.out.println(defaults.getTtl().getSeconds() + "/" + defaults.getAllowCacheNullValues());
// 输出：60/false
// 初始：defaultCacheConfig 默认无过期 TTL，允许 null，使用区域前缀。
// 关键变化：设置一分钟写入 TTL、禁止 null，加入实验及模式版本前缀。
```

默认 TTL 是 provider 配置；普通命中不刷新写入 TTL。Boot 属性 `spring.cache.redis.time-to-live=60s` 可设默认值，自定义 CacheManager 时要确认是否接入 Boot customizer。禁用 null 时须配合 unless/非 null 返回，否则 provider 可抛异常。默认 value 采用 JDK 序列化，生产要明确可信数据与格式，参见[序列化](./13-RedisTemplate序列化与连接管理)。Data Redis 3.2+ 支持 TtlFunction 动态 TTL；TTI 的 enableTimeToIdle 使用 GETEX、要求 Redis 6.2+ 且所有读取路径遵循同协议，不是一般 Redis 默认行为。[TTL/TTI](https://github.com/spring-projects/spring-data-redis/blob/3.4.13/src/main/antora/modules/ROOT/pages/redis/redis-cache.adoc)。

### `RedisCacheManager.builder`：不同区域独立 TTL

用于给常规 orders 和短期 missing 配置不同寿命而不修改注解。

```java
org.springframework.data.redis.cache.RedisCacheConfiguration defaults =
    org.springframework.data.redis.cache.RedisCacheConfiguration.defaultCacheConfig()
        .entryTtl(java.time.Duration.ofSeconds(60)).disableCachingNullValues();
org.springframework.data.redis.cache.RedisCacheManager manager =
    org.springframework.data.redis.cache.RedisCacheManager.builder(redisConnectionFactory)
        .cacheDefaults(defaults)
        .withInitialCacheConfigurations(java.util.Map.of("missing", defaults.entryTtl(java.time.Duration.ofSeconds(5))))
        .enableStatistics().build();
manager.afterPropertiesSet();
System.out.println(manager.getCacheNames().contains("missing"));
// 输出：true
// 初始：注入已配置工厂，orders 默认寿命 60 秒；没有业务缓存读取。
// 关键变化：missing 覆盖默认 60 秒为 5 秒，统计在本实例采集。
```

RedisCacheWriter 默认非锁，批量清理/putIfAbsent 可包含多个命令；locking writer 是缓存级锁及额外往返，不能混同业务级 fencing。默认清理使用 KEYS，生产大区域可选择 BatchStrategies.scan 的有界批量并核对驱动/Cluster 支持；统计是本地 hit/miss 快照，不是全节点总量。[CacheManager 默认行为](https://github.com/spring-projects/spring-data-redis/blob/3.4.13/src/main/antora/modules/ROOT/pages/redis/redis-cache.adoc)。

### `Cache.get`：加载器与竞争边界

用于通过 Cache 抽象观察同进程第二次读取跳过加载器。

```java
org.springframework.cache.Cache cache = new org.springframework.cache.concurrent.ConcurrentMapCache("orders");
var loads = new java.util.concurrent.atomic.AtomicInteger();
String first = cache.get("tenant-a:7", () -> { loads.incrementAndGet(); return "PAID"; });
String second = cache.get("tenant-a:7", () -> { loads.incrementAndGet(); return "CANCELLED"; });
System.out.println(first + "/" + second + "/" + loads.get());
// 输出：PAID/PAID/1
// 初始：本地缓存为空，加载器只是内存模拟。
// 关键变化：第一次填入 PAID，第二次已有值而不执行加载器。
```

生产命中、加载失败和同键并发行为由 provider 决定；必须用两实例并发与断网验证，不把 sync 或本地演示当分布式防击穿。结合有界互斥重建、过期 jitter、短期空值与降级；失效异常通过 CacheErrorHandler 决定 fail-open/fail-closed，但吞异常可能持续暴露旧值，必须记录指标和修复事件。[Cache API](https://docs.spring.io/spring-framework/docs/6.2.x/javadoc-api/org/springframework/cache/Cache.html)。

### `RedisCacheManagerBuilder.transactionAware`：提交后的写缓存

用于将常规缓存 put/evict/clear 延迟到 Spring 管理事务成功提交后。

```java
org.springframework.data.redis.cache.RedisCacheManager.RedisCacheManagerBuilder builder =
    org.springframework.data.redis.cache.RedisCacheManager.builder(redisConnectionFactory);
org.springframework.data.redis.cache.RedisCacheManager manager = builder.transactionAware().build();
System.out.println(manager.isTransactionAware());
// 输出：true
// 初始：配置层注入工厂；业务必须实际运行在 Spring 管理的事务内。
// 关键变化：启用事务同步装饰，而非把 Redis 加入数据库事务。
```

提交后缓存写入仍可失败，不形成数据库和 Redis 原子提交。即时 putIfAbsent/evictIfPresent 等操作不能都被延迟；代理顺序、无事务调用及异步线程需另查。Cacheable 读写也不提供数据库快照，避免从未提交状态构造缓存。需要可靠失效可用 AFTER_COMMIT/outbox、重试与版本判断；缓存旧读回填仍可能发生，强一致读取应使用事实数据库。[TransactionAwareCacheDecorator](https://docs.spring.io/spring-framework/docs/6.2.x/javadoc-api/org/springframework/cache/transaction/TransactionAwareCacheDecorator.html)。

## 易混点

缓存注解没有 TTL 参数。正常返回不是跨资源提交成功；空结果、不缓存和短期负缓存是不同策略。

## 课后小问

1. this.find 会缓存吗？答案：默认代理模式下不会，因为没有经过代理。
2. transactionAware 能保证两边同时成功吗？答案：不能，提交后 Redis 失败仍要可靠修复。

## 本节小结

先确认代理入口、键和 provider，再验证真实 TTL、加载竞争与失败恢复。

## 快速回顾

代理 → 注解条件 → 隔离键 → 默认/区域 TTL → null → stampede → 提交后修复。清理实验时停止写入，仅删除明确列出的 `lab-cache:v1:orders::tenant-a:7` 和 `lab-cache:v1:missing::tenant-a:7`，不全清业务区域。
