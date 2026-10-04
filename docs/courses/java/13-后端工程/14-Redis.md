---
title: Redis
date: 2026-10-01T00:00:00.000Z
category: Java后端工程
tags:
  - Java
  - Redis
  - Spring Data Redis
  - 缓存
description: 速查 RedisTemplate 数据结构、TTL、序列化、Lua 原子操作、缓存一致性与故障边界。
---

# Redis

## 学习目标

- 能按数据形状选择 String、Hash、List、Set 等 Redis 数据结构，并为 key 设计命名和生命周期。
- 能使用 `RedisTemplate` 配置序列化、TTL 和原子操作，识别缓存与数据库的一致性边界。
- 能解释缓存穿透、击穿、雪崩、限流和并发失败路径，不把 Redis 当作数据库事务替代品。

## 核心知识点

### 专业术语

- **Redis key/value**：Redis 以 key 定位值，值可以是 String、Hash、List、Set、Sorted Set 等数据结构。
- **TTL（time to live）**：key 的剩余生存时间；过期由 Redis 删除，不能当作精确业务定时器。
- **序列化**：把 Java key/value 转成 Redis 字节的过程；key 编码、value 编码和 Hash field 编码要保持契约一致。
- **Lua 原子脚本**：在 Redis 服务端一次执行多条命令，避免客户端读改写之间被其他客户端插入。
- **Cache-Aside**：先查缓存，未命中读数据库并回填；写入通常先更新数据库再删除或刷新缓存。

### 白话解释与边界

Redis 很快，但它首先是一个网络服务和内存数据结构服务器：网络超时、重启、淘汰、复制延迟和序列化变化都可能发生。缓存 key 要带业务前缀、版本和合理 TTL；value 的大小、热点分布和最大内存策略决定稳定性。`RedisTemplate` 的泛型只约束 Java 调用端，最终字节格式仍由 serializer 决定。

缓存命中不代表数据永远正确，删除缓存也不等于数据库事务已经提交。Lua 可以保证 Redis 内部命令的原子性，但不能把 Redis 和 MySQL 变成一个分布式事务。Spring Boot 4.1.0 项目应确认实际 Spring Data Redis 版本后再选择对象序列化器；Java 片段按 JDK 20 风格组织，覆盖样本基线为 Java 17。

## 常用用法

### `RedisTemplate.opsForHash`：读写 Hash 字段

用途：用于在一个 Redis Hash 中按字段读写结构化对象的局部数据。

```java
redisTemplate.opsForHash().put("user:7", "name", "Ann");
System.out.println(redisTemplate.opsForHash().get("user:7", "name"));
// 输出：Ann
// 说明：opsForHash().put("user:42", "name", "Alice") 写入 key=user:42、field=name、value=Alice；get 用同一 key/field 返回 Alice。
```

### `RedisTemplate.opsForList`：维护列表元素

用途：用于按队列或栈语义向 Redis List 写入并读取元素。

```java
redisTemplate.opsForList().rightPush("jobs", "job-1");
System.out.println(redisTemplate.opsForList().leftPop("jobs"));
// 输出：job-1
// 说明：rightPush("jobs", "job-1") 把 job-1 追加到列表右端，leftPop("jobs") 从左端取出，形成 FIFO；空列表返回 null。
```

### `RedisTemplate.delete`：删除明确缓存键

用途：用于在数据变更后删除一个已知缓存键并观察是否存在目标。

```java
Boolean deleted = redisTemplate.delete("user:7");
System.out.println(Boolean.TRUE.equals(deleted));
// 输出：删除到键时为 true。
// 说明：redisTemplate.delete("user:42") 只删除精确 key user:42，返回 true 表示原键存在并被删除，false 表示不存在。
```

### `RedisTemplate.keys`：查找匹配键及生产风险

用途：用于小型受控数据集的诊断查找；生产大键空间应改用游标式 `SCAN`。

```java
Set<String> keys = redisTemplate.keys("demo:user:*");
System.out.println(keys == null ? 0 : keys.size());
// 输出：当前匹配键数量；禁止把外部输入直接作为模式。
// 说明：keys("user:*") 返回当前数据库中匹配 user: 前缀的 key 集合，但会阻塞遍历整个 keyspace；生产环境用 SCAN 游标分批读取。
```

### `RedisTemplate.execute`：原子执行 Lua 脚本

用途：用于在 Redis 服务端一次完成需要原子性的检查与更新。

```java
DefaultRedisScript<Long> script = new DefaultRedisScript<>("return redis.call('INCR', KEYS[1])", Long.class);
Long value = redisTemplate.execute(script, List.of("counter"));
System.out.println(value);
// 输出：counter 自增后的值。
// 说明：execute(script, List.of("counter:42"), "10") 在 Redis 单次 Lua 执行中检查并更新 key counter:42，返回值按脚本声明类型转换；keys 与 argv 分开传入。
```

### `DefaultRedisScript`：构造带返回类型的脚本

用途：用于声明 Lua 文本及其 Java 返回类型，便于复用和结果转换。

```java
DefaultRedisScript<Long> script = new DefaultRedisScript<>("return 1", Long.class);
System.out.println(script.getResultType().getSimpleName());
// 输出：Long
// 说明：DefaultRedisScript<Long> 同时保存 Lua 文本和 Long 返回类型，因此 Redis 整数回复被转换为 Java Long；脚本本身应作为单例 Bean 复用 SHA 缓存。
```

### `StringRedisSerializer`：构造字符串序列化器

用途：用于把 Redis key 或字符串值编码为稳定 UTF-8 字节。

```java
StringRedisSerializer serializer = new StringRedisSerializer(StandardCharsets.UTF_8);
System.out.println(new String(serializer.serialize("user:7"), StandardCharsets.UTF_8));
// 输出：user:7
// 说明：StringRedisSerializer 把 "user:42" 编码为 UTF-8 字节并可无损还原；它不负责把 User 对象序列化为 JSON。
```

### RedisTemplate.opsForValue：读写带前缀的值

用途：用于存放计数器、短文本或序列化后的单对象，并显式设置命名空间和过期时间。

```java
import java.time.Duration;
import org.springframework.data.redis.core.RedisTemplate;

RedisTemplate<String, String> redis = redisTemplate;
String key = "app:profile:7";
redis.opsForValue().set(key, "active", Duration.ofMinutes(5));
String value = redis.opsForValue().get(key);
System.out.println(value);
// 输出：active
// 说明：opsForValue 对带业务前缀的 key（如 session:42）写入单个值，并按示例 TTL 自动过期；读取不存在或已过期 key 返回 null。
```

字符串 key 要包含业务前缀和版本；`get` 返回 `null` 时要走缓存未命中路径，不能把空值误当作异常或直接拼接进 SQL。

### Redis Hash：按字段更新对象

用途：用于在同一 key 下按 field 读写对象的局部属性。

```java
redis.opsForHash().put("app:user:7", "status", "ACTIVE");
System.out.println(redis.opsForHash().get("app:user:7", "status"));
// 输出：ACTIVE
// 说明：Hash key=user:42 下可分别写 field=name/value=Alice 与 field=status/value=ACTIVE，更新 status 不会重写 name。
```

Hash field 需要稳定命名和类型契约；多个 field 的跨 key 更新不是自动事务。

### Redis List：维护有序元素

用途：用于按插入顺序追加并消费简单队列元素。

```java
redis.opsForList().rightPush("app:jobs", "job-1");
System.out.println(redis.opsForList().leftPop("app:jobs"));
// 输出：job-1
// 说明：List key=jobs 右端依次追加 job-1、job-2，左端弹出时先得到 job-1；该简单队列不提供确认或失败重投语义。
```

List 需要设置长度上限并处理消费失败；需要可靠消息时应评估 Redis Streams 或专用消息系统。

### Redis Set：保存唯一成员

用途：用于保存不需要业务顺序的去重成员集合。

```java
redis.opsForSet().add("app:roles:7", "reader", "reader");
System.out.println(redis.opsForSet().size("app:roles:7"));
// 输出：1
// 说明：Set key=user:42:roles 添加 ADMIN 两次仍只有一个成员，isMember 精确判断 ADMIN 是否存在；集合迭代顺序不属于契约。
```

Set 只保证成员唯一，不保证顺序；集合过大时应限制基数并避免一次返回全部成员。

### TTL：让缓存拥有明确生命周期

用途：用于给缓存、验证码和短期会话设置过期时间，并在续期、删除和未设置 TTL 时做可观测判断。

```java
import java.time.Duration;

redis.opsForValue().set("app:token:7", "opaque", Duration.ofSeconds(60));
Long seconds = redis.getExpire("app:token:7");
System.out.println(seconds != null && seconds > 0);
// 输出：true
// 作用：用于给缓存、验证码和短期会话设置过期时间，并在续期、删除和未设置 TTL 时做可观测判断。
```

没有 TTL 的 key 可能长期占用内存；`-1` 表示没有过期时间，`-2` 通常表示 key 不存在。续期要防止把永久缓存误延长，批量 key 过期还要加入抖动以降低雪崩风险。

### 序列化：固定 key 与 value 字节契约

用途：用于让不同服务、版本和语言能够稳定读写 Redis，并避免 JDK 原生序列化带来的安全和兼容风险。

```java
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.data.redis.serializer.StringRedisSerializer;

StringRedisTemplate redis = stringRedisTemplate;
StringRedisSerializer text = new StringRedisSerializer();
redis.setKeySerializer(text);
redis.setValueSerializer(text);
redis.setHashKeySerializer(text);
redis.setHashValueSerializer(text);
redis.afterPropertiesSet();
System.out.println(redis.getKeySerializer().getClass().getSimpleName());
// 输出：StringRedisSerializer
// 作用：用于让不同服务、版本和语言能够稳定读写 Redis，并避免 JDK 原生序列化带来的安全和兼容风险。
```

这个模板把 key、value、Hash field 和 Hash value 都按字符串契约编码；如果 value 改成 JSON 或二进制，必须同时为对应字段选择明确 serializer，并记录版本。跨服务读取时不要默认相信类名和类型信息。序列化升级应通过双读、版本 key 或迁移脚本逐步切换，而不是直接让旧字节被新类强转。

## 不常用但需要知道

### Lua：把检查与更新放在一次原子执行中

用途：用于实现限额、令牌桶或“只有当前值匹配才删除”等读改写操作，避免客户端往返造成竞态。

```java
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.data.redis.core.script.DefaultRedisScript;

StringRedisTemplate redis = stringRedisTemplate;
String lua = "local n = redis.call('GET', KEYS[1]); "
    + "if n and tonumber(n) >= tonumber(ARGV[1]) then "
    + "redis.call('DECRBY', KEYS[1], ARGV[1]); return 1; end; return 0;";
var script = new DefaultRedisScript<Long>(lua, Long.class);
java.util.List<String> keys = java.util.List.of("app:quota:7");
String amount = "1";
Long allowed = redis.execute(script, keys, amount);
System.out.println(allowed);
// 输出：1
// 说明：Lua 在 Redis 服务端对 KEYS[1] 指定的限流/锁 key 比较当前值与 ARGV[1]，仅匹配时更新或删除；检查与写入不会被其他命令插入。
```

`StringRedisTemplate` 使用字符串 serializer 编解码 `KEYS` 和 `ARGV`，`DefaultRedisScript<Long>` 把 Redis 的整数回复还原为 `Long`；自定义 `RedisTemplate` 时必须显式配置等价的 key/argument/result serializer。脚本必须限制执行时间和输入规模，KEYS 只传同一 Redis hash slot 可处理的 key；Lua 的原子性不覆盖数据库更新、消息发送或网络调用。

### 缓存一致性：数据库提交后再失效

用途：用于在 Cache-Aside 中先写数据库、提交成功后删除缓存，降低旧值在缓存中长期存在的概率。

```java
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.transaction.event.TransactionPhase;
import org.springframework.transaction.event.TransactionalEventListener;
import org.springframework.data.redis.core.StringRedisTemplate;

record UserStatusChanged(long id) {}

@Service
class UserService {
    private final UserRepository repository;
    private final ApplicationEventPublisher events;

    UserService(UserRepository repository, ApplicationEventPublisher events) {
        this.repository = repository;
        this.events = events;
    }

    @Transactional
    void updateStatus(long id, String status) {
        repository.updateStatus(id, status);
        events.publishEvent(new UserStatusChanged(id));
    }
}

@Component
class UserCacheInvalidator {
    private final StringRedisTemplate redis;

    UserCacheInvalidator(StringRedisTemplate redis) {
        this.redis = redis;
    }

    @TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT)
    void evict(UserStatusChanged event) {
        Boolean deleted = redis.delete("app:user:" + event.id());
        System.out.println(deleted);
        // 输出：true
    }
}
// 作用：用于在 Cache-Aside 中先写数据库、提交成功后删除缓存，降低旧值在缓存中长期存在的概率。
```

只有数据库事务提交成功后，`AFTER_COMMIT` 监听器才会删除缓存；事务回滚时不会触发该监听器。监听器中的删除失败要记录并通过消息或重试补偿；并发读可能在删除前回填旧值，需要通过延迟双删、版本号或短 TTL 等策略按业务风险取舍。该事件依赖事务上下文，不能把发布事件当成跨资源事务提交。

### 穿透/击穿/雪崩：分别处理三种缓存故障

用途：用于把不存在数据、热点 key 同时失效和大量 key 同时过期分开治理，避免一个“加缓存”方案掩盖不同根因。

```java
String key = "app:item:404";
String cached = redis.opsForValue().get(key);
if (cached == null) {
    redis.opsForValue().set(key, "__NULL__", Duration.ofSeconds(20));
}
System.out.println("negative-cache");
// 输出：negative-cache
// 作用：用于把不存在数据、热点 key 同时失效和大量 key 同时过期分开治理，避免一个“加缓存”方案掩盖不同根因。
```

穿透可用参数校验、布隆过滤器或短期空值；击穿可用互斥锁、single-flight 或逻辑过期；雪崩可用 TTL 抖动、分批预热和限流。空值缓存也必须防止把真实新数据永久挡住。

### 限流：用原子计数和过期窗口

用途：用于限制同一主体在固定时间窗内的请求次数，并在超限、Redis 超时和降级时给出明确策略。

```java
String key = "app:rate:user:7:202610010930";
Long count = redis.opsForValue().increment(key);
if (count != null && count == 1) {
    redis.expire(key, Duration.ofSeconds(60));
}
boolean accepted = count != null && count <= 100;
System.out.println(accepted);
// 输出：true
// 作用：用于限制同一主体在固定时间窗内的请求次数，并在超限、Redis 超时和降级时给出明确策略。
```

`increment` 与首个 `expire` 之间可能发生进程崩溃，严格限流应使用 Lua 一次完成；Redis 超时是可用性与安全性的取舍，不能无条件放行敏感操作。

### 并发失败边界：超时、重试与资源释放

用途：用于让 Redis 调用在网络抖动、连接池耗尽和重复重试时保持可控，并避免把缓存故障放大成线程堆积。

```java
try {
    String value = redis.opsForValue().get("app:health");
    System.out.println(value == null ? "miss" : value);
    // 输出：miss
} catch (RuntimeException timeout) {
    System.out.println("degraded");
    // 输出：degraded
}
// 作用：用于让 Redis 调用在网络抖动、连接池耗尽和重复重试时保持可控，并避免把缓存故障放大成线程堆积。
```

客户端要设置连接与命令超时、限制连接池等待、区分可重试读与不可重复写，并记录命中率和错误率。RedisTemplate 通常复用连接池资源，不要在业务代码中手动关闭由框架管理的连接；降级结果必须经过权限和数据新鲜度评估。

## 继续阅读

- [List 基础](/courses/java/05-泛型与集合/04-List常用API)：理解 Redis List 与 Java List 的顺序、可变性和视图不是同一层概念。
- [Map 基础](/courses/java/05-泛型与集合/07-Map常用API)：组织 Hash 字段或反序列化后的键值对象时查 Map 的 key 和视图边界。
- [String 文本处理](/courses/java/02-数组与文本/02-String与文本处理)：设计 key 前缀、状态值和协议文本时查字符集与字面匹配边界。
- [JDBC 与事务](/courses/java/11-工程实践/02-JDBC与事务)：Redis 与数据库配合时，回看 JDBC 事务提交、回滚和资源边界。

## 简单案例

```java
String key = "app:article:42";
String cached = redis.opsForValue().get(key);
if (cached == null) {
    String loaded = repository.findArticleJson(42L);
    if (loaded != null) {
        redis.opsForValue().set(key, loaded, Duration.ofMinutes(2));
        cached = loaded;
    }
}
System.out.println(cached == null ? "not-found" : "hit");
// 输出：hit
```

这是最小 Cache-Aside 形状，不包含锁、负缓存和数据库事务；生产代码应防止热点并发回源、给 TTL 加抖动、处理删除失败，并在 Redis 不可用时选择安全降级。缓存命中只代表读到了某份字节，不代表数据库事务和跨服务副作用已经完成。

## 易混点

- TTL 是 Redis key 的过期边界，不是精确任务调度器；没有 TTL 的缓存可能无限增长。
- Redis 的 Lua 原子性只覆盖脚本中的 Redis 命令，不能同时回滚 MySQL 或外部消息。
- `RedisTemplate` 的泛型不等于字节格式契约，key/value serializer 不一致会导致乱码、反序列化异常或跨服务不兼容。
- 缓存穿透、击穿和雪崩的根因不同，分别需要空值/布隆过滤器、热点互斥和 TTL 抖动等策略。
- `increment` 的单次操作是原子的，但“首次设置过期时间”及跨 key 操作仍可能竞态，应按需要使用 Lua。

## 课后小问

1. 为什么缓存删除要放在数据库提交成功之后？
答案：只有数据库变更成功后删除缓存，下一次读取才会回源到新数据或重新生成缓存。
解析：事务回滚前删除会让缓存短暂失效，提交失败仍可能留下不一致；删除失败还要通过重试、消息或短 TTL 补偿。

2. Lua 脚本能否把 Redis 和数据库变成一个事务？
答案：不能，Lua 只保证脚本内 Redis 命令的原子执行。
解析：数据库、消息和网络调用不在 Redis 脚本事务里；跨资源一致性需要事务消息、幂等和补偿策略。

3. Redis 超时后是否应该无条件重试写操作？
答案：不应该，必须先判断操作是否幂等、是否可能已在服务端执行，再选择重试或降级。
解析：超时只说明客户端没有及时收到结果，重复写可能增加计数、重复入队或覆盖新值；重试应有上限和退避。

## 本节小结

- 先按数据形状选择 Redis 结构，再为 key、序列化、TTL 和容量设定可观测契约。
- `RedisTemplate` 负责访问抽象，Lua 负责 Redis 内部原子读改写，二者都不能替代数据库事务。
- Cache-Aside 需要处理一致性、穿透、击穿、雪崩、限流和并发失败路径。
- 超时、重试、连接池和降级策略要同时考虑安全、幂等和资源释放。

## 快速回顾

- 能为单值、字段集合、队列和去重集合选择 String、Hash、List 或 Set。
- 能解释 TTL、serializer 和 key 命名如何影响缓存生命周期与兼容性。
- 能用 Lua 保护 Redis 内的检查加更新，并说明它不跨越数据库事务。
- 能区分穿透、击穿、雪崩与限流，并为超时和重试写出安全边界。
