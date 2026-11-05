---
title: RedisTemplate 序列化与连接管理
date: 2026-10-06
category: Java课程
tags: [Java, Redis, Spring, Lettuce]
description: 明确 Redis 字节协议、序列化迁移、连接生命周期和批量错误边界。
---

# RedisTemplate 序列化与连接管理

## 学习目标

能配置四类 serializer、区分模板与连接的线程安全，制定超时、批量及未知写入结果策略。

## 核心知识点

采用 JDK 20、Spring Boot 3.4.13、Spring Data Redis 3.4.x / Lettuce 6.x，依赖 `spring-boot-starter-data-redis`，池另需 `org.apache.commons:commons-pool2`。核对日期 2026-10-06：[Data Redis 3.4 模板](https://github.com/spring-projects/spring-data-redis/blob/3.4.13/src/main/antora/modules/ROOT/pages/redis/template.adoc)、[驱动](https://github.com/spring-projects/spring-data-redis/blob/3.4.13/src/main/antora/modules/ROOT/pages/redis/drivers.adoc)、[Lettuce 官方连接池](https://github.com/redis/lettuce/wiki/Connection-Pooling)、[Boot 3.4 属性](https://docs.spring.io/spring-boot/3.4/appendix/application-properties/index.html)。当前 Data Redis 4.x 的 JacksonJsonRedisSerializer 命名/版本不直接搬到本篇 3.4。

Redis 存的是字节；RedisTemplate 负责序列化、获取/释放连接和异常转换，不改变服务器命令语义。SET/Hash 等见[Redis 数据结构](./02-String与计数器)，Pipeline 语义见[事务与批量](./07-事务Watch-Pipeline与Lua)，缓存抽象见[Spring Cache](./12-Spring-Cache与缓存抽象)。需要连接的示例使用 `run(RedisConnectionFactory redisConnectionFactory)`，由 Spring 管理的 Bean 注入工厂后调用；其余示例可直接运行 `main`；需 Redis 的示例只在隔离本机 DB 0 运行，使用 `lab:{template}:` 前缀，不假称本地构造验证已连接 Redis。

运行带连接工厂参数的示例时，在 Spring Boot 中配置 `spring.data.redis.host=127.0.0.1` 和 `spring.data.redis.port=6379`，将示例类与下面的启动器放入组件扫描范围。启动时执行一次；要尝试其他示例，把调用的类名换成对应类名。

```java
import org.springframework.boot.CommandLineRunner;
import org.springframework.data.redis.connection.RedisConnectionFactory;
import org.springframework.stereotype.Component;

@Component
class TemplateExampleRunner implements CommandLineRunner {
    private final RedisConnectionFactory factory;
    TemplateExampleRunner(RedisConnectionFactory factory) { this.factory = factory; }

    @Override
    public void run(String... args) throws Exception {
        RedisExample13_1.run(factory);
    }
}
```

## 常用用法

### `StringRedisTemplate`：可读 UTF-8 键值

用于用统一的 String serializer 写入和读回字符串而不引入 Java 对象元数据。

```java
import java.time.Duration;
import org.springframework.data.redis.connection.RedisConnectionFactory;
import org.springframework.data.redis.core.StringRedisTemplate;

class RedisExample13_1 {
    public static void run(RedisConnectionFactory redisConnectionFactory) throws Exception {
        StringRedisTemplate strings =
            new StringRedisTemplate(redisConnectionFactory);
        strings.opsForValue().set("lab:{template}:state", "PAID", Duration.ofSeconds(30));
        System.out.println(strings.opsForValue().get("lab:{template}:state"));
        // 输出：PAID（立即读取）
    }
}
```

实验前提：隔离 Redis 可用，实验 state 不存在；代码会覆盖该实验键。

StringRedisTemplate 对 key/value/hash key/hash value 使用 StringRedisSerializer；不要拿它读取 JDK 序列化对象并以为只是显示乱码，实际 key 字节也可能根本不同。[String-focused 模板](https://github.com/spring-projects/spring-data-redis/blob/3.4.13/src/main/antora/modules/ROOT/pages/redis/template.adoc)。

### `RedisTemplate`：显式配置四类字节格式

用于为对象值和 Hash 值指定固定 DTO JSON，同时保持所有键使用字符串编码。

```java
import org.springframework.data.redis.connection.RedisConnectionFactory;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.serializer.Jackson2JsonRedisSerializer;
import org.springframework.data.redis.serializer.StringRedisSerializer;

class RedisExample13_2 {
    public static void run(RedisConnectionFactory redisConnectionFactory) throws Exception {
        record OrderView(long id, String state) {}
        RedisTemplate<String, OrderView> template = new RedisTemplate<>();
        var keys = new StringRedisSerializer();
        var values = new Jackson2JsonRedisSerializer<OrderView>(OrderView.class);
        template.setConnectionFactory(redisConnectionFactory);
        template.setKeySerializer(keys); template.setHashKeySerializer(keys);
        template.setValueSerializer(values); template.setHashValueSerializer(values);
        template.afterPropertiesSet();
        System.out.println(template.getKeySerializer().getClass().getSimpleName());
        // 输出：StringRedisSerializer
    }
}
```

实验前提：裸模板尚未初始化，目标 DTO 为 OrderView(7,PAID)。

泛型不会自动选 serializer。默认启用的 JDK serializer 与 StringRedisTemplate 不能天然互读；同一个物理 key 的所有客户端必须约定类型、编码和 schema。opsForValue、opsForHash、opsForList、opsForSet、opsForZSet 等只是类型操作视图，服务器 WRONGTYPE 仍可能出现。模板初始化后可多线程复用，RedisConnection 包装器不能跨线程共享。[模板 API](https://github.com/spring-projects/spring-data-redis/blob/3.4.13/src/main/antora/modules/ROOT/pages/redis/template.adoc)。

### `StringRedisSerializer`：确认真实 key 字节

用于独立验证 UTF-8 字符串在 Java 和 redis-cli 间的编码兼容性。

```java
import java.nio.charset.StandardCharsets;
import org.springframework.data.redis.serializer.StringRedisSerializer;

class RedisExample13_3 {
    public static void main(String[] args) throws Exception {
        var serializer = new StringRedisSerializer();
        byte[] bytes = serializer.serialize("lab:{template}:v2:7");
        System.out.println(new String(bytes, StandardCharsets.UTF_8));
        // 输出：lab:{template}:v2:7（UTF-8 字节）
        System.out.println(serializer.deserialize(bytes));
        // 输出：lab:{template}:v2:7（反序列化）
    }
}
```

实验前提：业务键包含 namespace、schema 版本及实体 id。

改变 key serializer 就改变了键身份，不是修改显示方式；旧 key 可能继续占内存直到过期。Cluster hash tag 只是槽位约定，不应把全业务键都放到同一个槽。

### `Jackson2JsonRedisSerializer`：固定 DTO 与迁移

用于让固定类型 JSON 独立往返并把格式变化纳入版本化迁移。

```java
import org.springframework.data.redis.serializer.Jackson2JsonRedisSerializer;

class RedisExample13_4 {
    public static void main(String[] args) throws Exception {
        record OrderView(long id, String state) {}
        var serializer = new Jackson2JsonRedisSerializer<OrderView>(OrderView.class);
        byte[] bytes = serializer.serialize(new OrderView(7, "PAID"));
        OrderView view = serializer.deserialize(bytes);
        System.out.println(view.id() + "/" + view.state());
        // 输出：7/PAID
    }
}
```

实验前提：固定 DTO 字段为 id/state，不使用不受限制的多态类型元数据。

迁移使用 v2 新 key：先兼容读 v2，miss 时按旧 schema 白名单解码 v1 并校验，再写 v2、切换写端，观察 TTL 后逐步清旧键。并发旧回填要版本条件与回滚计划；不把所有旧二进制直接当 JSON。GenericJackson2JsonRedisSerializer 适合需要类型信息的通用值，但多态元数据不是安全许可；禁止开放任意类 default typing，定义允许类型/字段、大小限制和 Redis 写权限。Jackson2 的 3.4 API 与 4.x Jackson 3 API 应按依赖版本选用。[serializer 安全](https://github.com/spring-projects/spring-data-redis/blob/3.4.13/src/main/antora/modules/ROOT/pages/redis/template.adoc)。

### `JdkSerializationRedisSerializer`：识别历史格式风险

用于观察 Java 原生序列化字节头并解释它与 String/JSON 的不兼容。

```java
import org.springframework.data.redis.serializer.JdkSerializationRedisSerializer;

class RedisExample13_5 {
    public static void main(String[] args) throws Exception {
        var serializer = new JdkSerializationRedisSerializer();
        byte[] bytes = serializer.serialize("PAID");
        System.out.printf("%02x %02x%n", bytes[0] & 255, bytes[1] & 255);
        // 输出：ac ed
        System.out.println(serializer.deserialize(bytes));
        // 输出：PAID
    }
}
```

实验前提：输入仅为本程序创建的可信 String，禁止接受外部构造字节。

反序列化不可信数据可执行恶意对象链；生产优先固定 schema JSON，历史兼容须输入过滤、严格类型白名单和访问权限。serialVersionUID、类移动与跨语言兼容是额外迁移成本，不应将“存入 Redis”视为可信化。[Spring 官方安全警告](https://github.com/spring-projects/spring-data-redis/blob/3.4.13/src/main/antora/modules/ROOT/pages/redis/template.adoc)。

### `LettuceConnectionFactory`：共享连接与超时预算

用于创建带命令超时的工厂并把连接所有权交给明确的生命周期。

```java
import io.lettuce.core.ClientOptions;
import io.lettuce.core.SocketOptions;
import java.time.Duration;
import org.springframework.data.redis.connection.RedisStandaloneConfiguration;
import org.springframework.data.redis.connection.lettuce.LettuceClientConfiguration;
import org.springframework.data.redis.connection.lettuce.LettuceConnectionFactory;

class RedisExample13_6 {
    public static void main(String[] args) throws Exception {
        var server = new RedisStandaloneConfiguration("127.0.0.1", 6379);
        var options = ClientOptions.builder()
            .socketOptions(SocketOptions.builder().connectTimeout(Duration.ofSeconds(1)).build()).build();
        var client = LettuceClientConfiguration.builder()
            .clientOptions(options).commandTimeout(Duration.ofSeconds(2)).build();
        var factory = new LettuceConnectionFactory(server, client);
        System.out.println(factory.getShareNativeConnection());
        // 输出：true
    }
}
```

实验前提：127.0.0.1 隔离地址，只构造工厂；没有调用 afterPropertiesSet/start。

Lettuce 原生连接可以线程安全复用；Spring RedisConnection 包装器不是线程安全对象。默认普通非阻塞、非事务操作共享原生连接，阻塞与事务路径使用专用连接；池不意味着每次 GET 都借一条独占连接。timeout 分为 TCP connect、命令响应、池借用等待和业务总预算，重连/重试也要计入。Boot 属性为 `spring.data.redis.connect-timeout`、`spring.data.redis.timeout`；不使用旧 `spring.redis.*`。在 Netty event loop 上调用同步阻塞操作会阻塞 I/O；响应丢失不证明写入没发生。[驱动线程规则](https://github.com/spring-projects/spring-data-redis/blob/3.4.13/src/main/antora/modules/ROOT/pages/redis/drivers.adoc)。

### `LettucePoolingClientConfiguration`：有界连接池

用于限制专用连接数量与借用等待，避免资源耗尽时无限排队。

```java
import io.lettuce.core.api.StatefulConnection;
import java.time.Duration;
import org.apache.commons.pool2.impl.GenericObjectPoolConfig;
import org.springframework.data.redis.connection.lettuce.LettucePoolingClientConfiguration;

class RedisExample13_7 {
    public static void main(String[] args) throws Exception {
        var pool = new GenericObjectPoolConfig<StatefulConnection<?, ?>>();
        pool.setMaxTotal(8); pool.setMaxIdle(4); pool.setMinIdle(0);
        pool.setMaxWait(Duration.ofMillis(200));
        var client = LettucePoolingClientConfiguration.builder()
            .poolConfig(pool).commandTimeout(Duration.ofSeconds(2)).build();
        System.out.println(client.getPoolConfig().getMaxTotal());
        // 输出：8
    }
}
```

实验前提：commons-pool2 已引入，配置对象尚未创建任何连接。

Boot 可配置 `spring.data.redis.lettuce.pool.max-active/max-idle/min-idle/max-wait`，引入 pool2 后再确认自动配置实际启用。共享连接、订阅、不同工厂和 Redisson 仍各自消耗资源；池只管受它管理的专用连接。压测观察 active/idle、借用等待、耗尽、阻塞命令与关闭行为；不能用增大池替代服务端容量诊断。[Lettuce pooling](https://github.com/redis/lettuce/wiki/Connection-Pooling)。

### `ClientResources`：Netty 线程与资源关闭

用于在手工创建 Lettuce 资源时保证自有线程池最终关闭。

```java
import io.lettuce.core.resource.ClientResources;
import io.lettuce.core.resource.DefaultClientResources;
import java.time.Duration;
import org.springframework.data.redis.connection.lettuce.LettuceClientConfiguration;

class RedisExample13_8 {
    public static void main(String[] args) throws Exception {
        ClientResources resources = DefaultClientResources.create();
        try {
            var client = LettuceClientConfiguration.builder()
                .clientResources(resources).commandTimeout(Duration.ofSeconds(2)).build();
            System.out.println(client.getClientResources().isPresent());
            // 输出：true
        } finally { resources.shutdown().get(); }
    }
}
```

实验前提：本例拥有独立 ClientResources，没有活跃连接工厂。

Spring Bean 的工厂由容器初始化/停止/销毁；手工工厂应 afterPropertiesSet/start 并在 finally destroy。共享 ClientResources 应先关闭所有客户端/工厂，再由创建者关闭资源；Lettuce 不自动关闭外部提供的共享资源。RedisTemplate 管理回调连接，不应自己关闭借来的共享原生连接。[ClientResources](https://javadoc.io/doc/io.lettuce/lettuce-core/6.4.2.RELEASE/io/lettuce/core/resource/ClientResources.html)。

### `RedisTemplate.executePipelined`：批量响应与非原子执行

用于把固定 String 命令批量发送并按顺序读取结果列表。

```java
import java.util.List;
import org.springframework.data.redis.connection.RedisConnectionFactory;
import org.springframework.data.redis.connection.StringRedisConnection;
import org.springframework.data.redis.core.RedisCallback;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.core.StringRedisTemplate;

class RedisExample13_9 {
    public static void run(RedisConnectionFactory redisConnectionFactory) throws Exception {
        RedisTemplate<String, String> strings =
            new StringRedisTemplate(redisConnectionFactory);
        List<Object> replies = strings.executePipelined((RedisCallback<Object>) connection -> {
            var text = (StringRedisConnection) connection;
            text.set("lab:{template}:pipe", "1");
            text.incr("lab:{template}:pipe");
            text.get("lab:{template}:pipe");
            return null;
        });
        System.out.println(replies.get(1) + "/" + replies.get(2));
        // 输出：2/2
    }
}
```

实验前提：实验 pipe 允许被覆盖，真实 Redis 无其他写者。

Pipeline 非原子，不能基于尚未收到的前条响应构造本批次后条命令；批量要限制数量及字节。检查回复/异常，命令错误和断网都可能部分成功；禁止自动重试含 INCR 的整批。Cluster 跨节点与 Lettuce flush 策略受具体驱动版本限制；同槽不自动带来事务。事务需要 SessionCallback 保持同连接，不能用两个独立模板调用 MULTI/EXEC 假设绑定。[pipelining](https://github.com/spring-projects/spring-data-redis/blob/3.4.13/src/main/antora/modules/ROOT/pages/redis/pipelining.adoc)。

### `RedisSystemException`：异常分类与未知结果

用于保留底层原因并让超时分类形成可观察故障记录。

```java
import io.lettuce.core.RedisCommandTimeoutException;
import org.springframework.data.redis.RedisSystemException;

class RedisExample13_10 {
    public static void main(String[] args) throws Exception {
        var cause = new RedisCommandTimeoutException("lab command budget exceeded");
        var failure = new RedisSystemException("lab write outcome unknown", cause);
        System.out.println(failure.getMostSpecificCause().getClass().getSimpleName());
        // 输出：RedisCommandTimeoutException
    }
}
```

实验前提：显式构造超时异常作分类演示，不假称已断开 Redis。

实际翻译可能是 QueryTimeoutException、RedisConnectionFailureException、InvalidDataAccessApiUsageException 或 RedisSystemException，不能只捕获一个类型；SerializationException 表示字节/schema 问题，WRONGTYPE 是服务端类型错误，不应按网络瞬态处理。超时意味着写入结果不确定，先确认业务状态，以业务幂等键恢复，非幂等 INCR 不盲重放。指标记录低基数的操作/结果、延迟、连接/池等待、序列化失败和未知结果数；日志带关联 ID 但不暴露密码、完整业务 key 或 value，缓存命中率不替代错误监测。[异常翻译器](https://docs.spring.io/spring-data/redis/docs/3.4.13/api/org/springframework/data/redis/connection/lettuce/LettuceExceptionConverter.html)。

## 易混点

泛型不是存储格式；模板线程安全不意味着 RedisConnection 可共享；连接池不保证命令原子性或写入重试安全。

## 课后小问

1. JSON value 配好但 key 仍用 JDK serializer 会怎样？答案：key 字节仍不兼容 String 客户端，必须分别配置。
2. Pipeline 超时可以重放吗？答案：不能一般化，部分写入可能已完成，先做幂等恢复。

## 本节小结

显式固定字节协议与资源生命周期，再以真实服务验证超时和错误结果。

## 快速回顾

模板 → 四类 serializer → v2 迁移 → 共享连接 → pool/timeout → 关闭资源 → 有界批量 → 未知结果。停止客户端后只清理实验 `lab:{template}:state` 与 `lab:{template}:pipe`，不使用全库删除。
