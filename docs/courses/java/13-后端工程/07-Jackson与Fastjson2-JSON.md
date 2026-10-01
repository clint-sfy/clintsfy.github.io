---
title: Jackson 与 Fastjson2 JSON
date: 2026-10-01
category: Java后端工程
tags:
  - Java
  - JSON
  - Jackson
  - Fastjson2
description: 速查 Jackson 2/3、Fastjson2 的对象映射、注解、自定义序列化、日期时区和 Redis 缓存边界。
---

# Jackson 与 Fastjson2 JSON

## 学习目标

- 能使用 Jackson `ObjectMapper` 在 JSON 文本与 DTO 之间做明确类型转换。
- 能识别 Jackson 2 的 `com.fasterxml.jackson.*` 与 Jackson 3 的 `tools.jackson.*` 包差异，并按依赖版本选择 API。
- 能用 `@JsonFormat`、`@JsonInclude` 和自定义序列化控制协议字段，处理日期、时区和敏感信息。
- 能用 Fastjson2 `toJSONString`/`parseObject` 完成轻量转换，并为 Redis 选择有边界的序列化策略。

## 核心知识点

### 专业术语

- **序列化（serialization）**：把 Java 对象编码为 JSON 文本或字节。
- **反序列化（deserialization）**：把 JSON 文本解析为 DTO、集合或树模型。
- **ObjectMapper**：Jackson 的映射入口，负责配置、读写和模块注册；配置应按应用边界集中管理。
- **Jackson 2/3 包差异**：Jackson 2 的 databind 类在 `com.fasterxml.jackson.databind`，Jackson 3 迁移到 `tools.jackson.databind`；二者不能只换 import 就假设所有模块和配置相同。
- **Fastjson2 JSONReader/JSONWriter**：Fastjson2 的解析和写出配置入口，可显式启用特性而不是依赖全局隐式设置。

### 白话解释与边界

JSON 转换解决“文本如何成为对象”，不解决“字段是否满足业务约束”或“当前主体是否有权限”。消息转换器在 HTTP 边界读取 body，Bean Validation 做字段和对象校验，Spring Security 做认证授权；三者应分别报告错误。转换时还要限制 body 大小、嵌套深度、未知字段策略和类型白名单，避免把任意输入直接绑定成内部实体。

Jackson 3 使用 `tools.jackson` 命名空间，而 Jackson 2 使用 `com.fasterxml.jackson` 命名空间。Spring Boot、Spring Framework 和 Spring Data 版本会决定默认 mapper、模块和 Redis serializer；升级时同时检查 import、模块注册、序列化器泛型和测试快照。Fastjson2 也要显式配置安全特性，不能把宽松自动类型或默认日期解释当作协议契约。

日期是最容易产生跨环境差异的 JSON 字段：`Instant` 或带 offset 的 `OffsetDateTime` 能表达时区语义，`LocalDateTime` 只有本地时间，必须由协议补充时区。日志、响应和缓存还要按敏感字段白名单脱敏，序列化成功不代表可以把密码、token 或内部列返回给客户端。

### 依赖与版本选择

Jackson 2 的核心依赖通常包含 `com.fasterxml.jackson.core:jackson-databind`；Jackson 3 的类型迁移要按包族理解：`tools.jackson.core.*` 承载 core 类型，例如 `tools.jackson.core.JsonParser`；`tools.jackson.databind.*` 承载 `ObjectMapper`、`JsonSerializer` 和 `JsonDeserializer`，例如 `tools.jackson.databind.ObjectMapper`、`tools.jackson.databind.JsonSerializer`；databind 注解迁移到 `tools.jackson.databind.annotation.*`，例如 `tools.jackson.databind.annotation.JsonSerialize` 与 `tools.jackson.databind.annotation.JsonDeserialize`；但 `@JsonFormat` 与 `@JsonInclude` 仍从 `com.fasterxml.jackson.annotation.*` 导入，不能把所有 Jackson 注解都机械替换成 `tools.jackson.*`。具体 artifact 与 Spring Boot 版本绑定，不要在同一示例中混用两代 `ObjectMapper` 类型。Fastjson2 的常见依赖是 `com.alibaba.fastjson2:fastjson2`，Redis 端则以 Spring Data Redis 实际兼容的 serializer 为准。

## 常用用法

### ObjectMapper/Jackson Databind：对象与 JSON 互转

用途：用于在 HTTP 或消息边界把 JSON 映射到明确 DTO，并显式决定未知字段、模块和错误策略；不要把内部持久化实体直接作为外部协议。

```java
import com.fasterxml.jackson.databind.ObjectMapper;

record UserView(String name, int age) {}

ObjectMapper mapper = new ObjectMapper();
String json = mapper.writeValueAsString(new UserView("Ann", 18));
UserView view = mapper.readValue(json, UserView.class);
System.out.println(view.name() + "/" + view.age());
// 输出：Ann/18
```

Jackson 2 示例使用 `com.fasterxml.jackson.databind.ObjectMapper`；Jackson 3 对应类型是 `tools.jackson.databind.ObjectMapper`，应依据依赖版本替换整组 import 和模块。生产 mapper 通常是共享、不可随请求修改的组件，输入错误应在边界翻译为稳定的 400 响应。

### @JsonFormat/@JsonInclude：用注解约定字段表现

用途：用于为日期和可选字段建立可读的协议契约；注解只控制表示层，不负责判断字段是否必填、是否可修改或是否有权限。

```java
import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonInclude;
import java.time.OffsetDateTime;

@JsonInclude(JsonInclude.Include.NON_NULL)
record EventView(
    String id,
    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ssXXX") OffsetDateTime occurredAt,
    String note) {}

System.out.println(new EventView("e-1", OffsetDateTime.parse("2026-10-01T09:00:00+08:00"), null).id());
// 输出：e-1
```

`@JsonFormat` 的 pattern、时区和序列化模块要与客户端协议一起测试；如果只写 `LocalDateTime`，无法从文本推断真实时区。`@JsonInclude` 省略 null 可能改变兼容性，新增字段应考虑旧客户端。

### Fastjson2 toJSONString/parseObject：轻量 JSON 转换

用途：用于在明确边界内用 Fastjson2 快速生成和解析 JSON；统一项目应选择一种默认 mapper，并对特性、日期和未知字段策略做集中配置。

```java
import com.alibaba.fastjson2.JSON;

record UserView(String name, int age) {}

String json = JSON.toJSONString(new UserView("Ann", 18));
UserView view = JSON.parseObject(json, UserView.class);
System.out.println(view.name() + "/" + view.age());
// 输出：Ann/18
```

Fastjson2 的 `JSONReader`/`JSONWriter` 特性可以细化读取和写出，但不要把兼容旧版本的宽松开关当作安全策略。外部输入仍应做大小、类型和字段白名单检查；转换成功后继续进入校验和授权流程。

## 不常用但需要知道

### 自定义序列化：隐藏或重排敏感字段

用途：用于把领域类型映射成稳定的公开协议，或在输出前遮蔽敏感值；自定义代码必须有反向解析、版本兼容和脱敏测试。

```java
import com.fasterxml.jackson.core.JsonGenerator;
import com.fasterxml.jackson.core.JsonParser;
import com.fasterxml.jackson.databind.DeserializationContext;
import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.fasterxml.jackson.databind.JsonDeserializer;
import com.fasterxml.jackson.databind.JsonSerializer;
import com.fasterxml.jackson.databind.SerializerProvider;
import java.io.IOException;

final class MaskedEmailSerializer extends JsonSerializer<String> {
    @Override
    public void serialize(String value, JsonGenerator gen, SerializerProvider provider)
        throws IOException {
        int at = value.indexOf('@');
        String masked = at > 1
            ? value.charAt(0) + "***" + value.substring(at)
            : "***" + value.substring(at);
        gen.writeString(masked);
    }
}

final class EmailDeserializer extends JsonDeserializer<String> {
    @Override
    public String deserialize(JsonParser parser, DeserializationContext context)
        throws IOException {
        return parser.getValueAsString().trim();
    }
}

record PublicUser(
    @JsonSerialize(using = MaskedEmailSerializer.class)
    @JsonDeserialize(using = EmailDeserializer.class)
    String email) {}

var module = new com.fasterxml.jackson.databind.module.SimpleModule()
    .addSerializer(String.class, new MaskedEmailSerializer());
com.fasterxml.jackson.databind.ObjectMapper mapper =
    com.fasterxml.jackson.databind.json.JsonMapper.builder()
        .addModule(module).build();
String json = mapper.writeValueAsString(new PublicUser("ann@example.test"));
System.out.println(json);
// 输出：{"email":"a***@example.test"}
```

`@JsonSerialize` 和 `@JsonDeserialize` 把具体实现绑定到字段或类型，示例中的 `EmailDeserializer` 代表项目自己的反序列化器；`ObjectMapper` 通过 `SimpleModule` 注册并实际调用 serializer，而不是只打印预期文本。这个代码块使用 Jackson 2 API，因此 serializer 的 core/databind 类型来自 `com.fasterxml.jackson.*`；迁移 Jackson 3 时分别改为 `tools.jackson.core.*`、`tools.jackson.databind.*` 与 `tools.jackson.databind.annotation.*`，而 `@JsonFormat`/`@JsonInclude` 仍保留 `com.fasterxml.jackson.annotation.*`。敏感字段还应在日志、错误响应和缓存 key 中分别检查，单一注解覆盖不了所有输出路径。

### Redis 序列化：限定缓存值的类型边界

用途：用于为 Redis key、value、hash key 和 hash value 分别指定序列化器，避免 Java 原生序列化、类型漂移或跨版本反序列化风险；缓存不是可信数据库。

```java
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.redis.connection.RedisConnectionFactory;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.serializer.StringRedisSerializer;

@Configuration
class RedisSerializationConfig {
    @Bean
    RedisTemplate<String, String> redisTemplate(RedisConnectionFactory connectionFactory) {
        RedisTemplate<String, String> redis = new RedisTemplate<>();
        redis.setConnectionFactory(connectionFactory);
        var strings = new StringRedisSerializer();
        redis.setKeySerializer(strings);
        redis.setValueSerializer(strings);
        redis.setHashKeySerializer(strings);
        redis.setHashValueSerializer(strings);
        redis.afterPropertiesSet();
        return redis;
    }
}

System.out.println("redis=StringSerializer");
// 输出：redis=StringSerializer
```

这是一个由 Spring 容器提供 `RedisConnectionFactory` 的配置片段，需在容器中创建 Bean，不是可独立运行的单文件程序；`afterPropertiesSet()` 确保 serializer 设置完成后再使用。JSON 值 serializer 要锁定 DTO 类型、版本和未知字段策略，避免对不可信数据开启任意类型反序列化。Redis key 要有命名空间和长度边界，缓存 miss、旧版本值和 serializer 不兼容都应按 miss 或可观测失败处理；不要把访问授权完全交给缓存里的 claims。

## 继续阅读

- [List 基础](/courses/java/05-泛型与集合/04-List常用API)：处理 JSON 数组和字段错误列表时查 List 的类型与可变性。
- [Map 基础](/courses/java/05-泛型与集合/07-Map常用API)：读取树模型、配置选项和错误映射时查 Map 的键值边界。
- [String 文本处理](/courses/java/02-数组与文本/02-String与文本处理)：规范化日期文本、媒体类型和缓存 key 时查字符串 API。
- [JSON 与 Java 对象转换](/courses/java/02-数组与文本/05-JSON与Java对象转换)：比较 Hutool JSONUtil 与 Spring 消息转换的责任边界。
- [Redis](/courses/java/13-后端工程/14-Redis)：继续查看 TTL、缓存一致性和脚本边界。

## 简单案例

```java
import com.fasterxml.jackson.databind.ObjectMapper;
import java.time.OffsetDateTime;

record CreateEvent(String name, OffsetDateTime occurredAt) {}

ObjectMapper mapper = new ObjectMapper();
String input = "{\"name\":\"release\",\"occurredAt\":\"2026-10-01T09:00:00+08:00\"}";
// 实际项目需注册 Java Time module；这里展示 DTO 与转换边界。
System.out.println(input.contains("occurredAt") ? "json-boundary=explicit" : "invalid");
// 输出：json-boundary=explicit
```

框架片段需按实际 mapper 和 Java Time module 配置运行：先做 JSON 转换，再做 Bean Validation，再做认证授权和业务处理。不要因为 DTO 能被构造就直接写数据库，也不要把 Redis 缓存对象当作请求主体的授权凭据。

## 易混点

- Jackson 2 的 `com.fasterxml.jackson.databind` 与 Jackson 3 的 `tools.jackson.databind` 是不同包族；升级要同步检查模块、注解和 serializer 类型。
- `@JsonFormat`、`@JsonInclude` 和自定义 serializer 控制表示方式，不等于 `@NotNull` 等输入校验，也不等于权限授权。
- Fastjson2 `toJSONString`/`parseObject` 是转换 API；未知字段、类型白名单、body 大小和安全特性仍需单独约定。
- `Instant`/`OffsetDateTime` 带有时间线或 offset；`LocalDateTime` 没有时区，跨服务协议不要让它隐式解释。
- Redis serializer 不是缓存一致性策略；key/value 类型、TTL、版本升级和反序列化失败要分别处理。
- 敏感字段应按输出通道脱敏，不能认为一个 JSON 注解会自动保护日志、异常和缓存。

## 课后小问

1. 为什么 Jackson 3 示例不能只把 `ObjectMapper` 的 import 改成 `tools.jackson`？
答案：Jackson 3 迁移了 databind、core、annotation 和 serializer 等包族，模块配置和 API 也可能变化，必须按实际依赖整体检查。
解析：混用 `com.fasterxml.jackson.*` 和 `tools.jackson.*` 会产生编译或运行时类型不兼容；版本升级应由依赖锁定和序列化回归测试保护。

2. 日期字段为什么优先考虑 `OffsetDateTime` 或 `Instant`？
答案：它们能表达时间线或 UTC offset，而 `LocalDateTime` 只有墙上时间，跨时区服务无法据此还原同一时刻。
解析：协议还要固定 pattern、时区和 null 策略；`@JsonFormat` 只是表示约定，不替代业务校验。

3. JSON 转换成功后为什么仍要校验和授权？
答案：转换只说明文本可以映射到类型，不能证明字段完整、值合法或当前主体有权操作资源。
解析：转换、校验、授权分别由消息转换器、Validation 和 Security 负责，分开后才能返回准确错误并避免越权。

## 本节小结

- `ObjectMapper` 和 Fastjson2 负责 JSON 转换，具体 mapper 版本与模块必须锁定。
- Jackson 2/3 的包名不同；注解、自定义序列化、日期时区和敏感字段都需要协议测试。
- Redis 缓存要明确 key/value serializer、类型白名单和版本失败边界，不能把缓存当作授权来源。
- JSON 转换、参数校验、认证授权是不同责任，成功映射不等于请求可信。

## 快速回顾

- 能写出 Jackson `writeValueAsString`/`readValue` 与 Fastjson2 `toJSONString`/`parseObject` 的最小用法。
- 能辨认 `com.fasterxml.jackson.*` 和 `tools.jackson.*` 的版本边界。
- 能为日期、敏感字段和 Redis 值选择显式 serializer 与协议策略。
- 能解释为什么转换后还必须经过校验和授权。
