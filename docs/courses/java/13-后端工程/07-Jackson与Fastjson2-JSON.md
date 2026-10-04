---
title: Jackson 与 Fastjson2 JSON
date: 2026-10-01T00:00:00.000Z
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

Jackson 2 的核心依赖通常包含 `com.fasterxml.jackson.core:jackson-databind`；本节的 Jackson 3.1.4 覆盖样本以 `tools.jackson:jackson-bom:3.1.4` 管理 `tools.jackson.core:jackson-core` 与 `tools.jackson.core:jackson-databind`。Jackson 3 的类型迁移要按包族理解：`tools.jackson.core.*` 承载 core 类型，例如 `tools.jackson.core.JsonParser`；`tools.jackson.databind.*` 承载 `ObjectMapper`、`ValueSerializer` 和 `ValueDeserializer`，例如 `tools.jackson.databind.ObjectMapper`、`tools.jackson.databind.ValueSerializer`；databind 注解迁移到 `tools.jackson.databind.annotation.*`，例如 `tools.jackson.databind.annotation.JsonSerialize` 与 `tools.jackson.databind.annotation.JsonDeserialize`；但 `@JsonFormat` 与 `@JsonInclude` 仍从 `com.fasterxml.jackson.annotation.*` 导入，不能把所有 Jackson 注解都机械替换成 `tools.jackson.*`。具体 artifact 与 Spring Boot 版本绑定，不要在同一示例中混用两代 `ObjectMapper` 类型。Fastjson2 的常见依赖是 `com.alibaba.fastjson2:fastjson2`，Redis 端则以 Spring Data Redis 实际兼容的 serializer 为准。

## 常用用法

### `@JSONField`：控制 Fastjson2 字段名称

用途：用于声明 Fastjson2 序列化和反序列化时使用的字段名。

```java
record User(@com.alibaba.fastjson2.annotation.JSONField(name = "user_name") String name) {}
// 关键变化：name 接收右侧表达式 "user_name") String name) {} 的计算结果。
System.out.println(JSON.toJSONString(new User("Ann")));
// 输出：{"user_name":"Ann"}
// 说明：Java 字段 userName 在 Fastjson2 输入输出中使用 user_name；直接 new 对象不会验证注解，需调用 JSON 序列化/反序列化 API。
```

### `JSONObject.containsKey`：判断动态字段是否存在

用途：用于区分 JSON 字段缺失与字段存在但值为 `null`。

```java
JSONObject object = JSON.parseObject("{\"enabled\":null}");
// 初始状态：object 当前为 JSON.parseObject("{\"enabled\":null}")。
System.out.println(object.containsKey("enabled"));
// 输出：true
// 作用：用于区分 JSON 字段缺失与字段存在但值为 `null`。
```

### `JSONObject.parseObject`：把 JSON 文本解析为动态对象

用途：用于在字段结构尚不固定时把 JSON 文本解析为可按键读取的对象。

```java
JSONObject object = JSONObject.parseObject("{\"mode\":\"safe\"}");
// 输入：object 的初始值为 JSONObject.parseObject("{\"mode\":\"safe\"}")。
// 关键变化：object 接收右侧表达式 JSONObject.parseObject("{\"mode\":\"safe\"}") 的计算结果。
System.out.println(object.getString("mode"));
// 输出：safe
// 说明：JSONObject.parseObject 解析 {"user_id":7}，getLong("user_id") 返回 7；未知结构仍需限制输入大小并检查字段类型。
```

### `@JsonProperty`：重命名 Jackson 协议字段

用途：用于让 Java 属性名与对外 JSON 字段名保持显式映射。

```java
record User(@com.fasterxml.jackson.annotation.JsonProperty("user_name") String name) {}
// // 关键变化：record User(@com.fasterxml.jackson.annotation.JsonProperty("user_name") String name) {} 使用表达式中的具体参数完成本次调用。
System.out.println(new ObjectMapper().writeValueAsString(new User("Ann")));
// 输出：{"user_name":"Ann"}
// 说明：Jackson 把 Java 属性 userId 写成协议字段 user_id，也从 user_id 读回；直接 new record 不经过 ObjectMapper，因此不验证注解。
```

### `@JsonIgnore`：忽略内部字段

用途：用于阻止内部字段参与 Jackson 序列化和反序列化。

```java
record Session(String id, @com.fasterxml.jackson.annotation.JsonIgnore String secret) {}
// // 关键变化：record Session(String id, @com.fasterxml.jackson.annotation.JsonIgnore String secret) {} 使用表达式中的具体参数完成本次调用。
System.out.println(new ObjectMapper().writeValueAsString(new Session("s-1", "token")));
// 输出：{"id":"s-1"}
// 说明：标注 @JsonIgnore 的 passwordHash 不会出现在输出，也不会从输入赋值；它不是访问控制，字段仍存在于 Java 对象内。
```

### `@JacksonAnnotationsInside`：组合 Jackson 注解

用途：用于把多个 Jackson 元注解封装成一个可复用的领域注解。

```java
@com.fasterxml.jackson.annotation.JacksonAnnotationsInside
@com.fasterxml.jackson.annotation.JsonIgnore
@java.lang.annotation.Retention(java.lang.annotation.RetentionPolicy.RUNTIME)
@interface InternalOnly {}
// // 关键变化：@interface InternalOnly {} 使用表达式中的具体参数完成本次调用。
// 输出：标注 @InternalOnly 的属性按 @JsonIgnore 处理。
// 说明：@JacksonAnnotationsInside 让 @InternalOnly 汇总其上的 @JsonIgnore；Jackson 会忽略被标注属性，直接反射读取则不会执行映射规则。
```

### `@JsonSerialize`：指定自定义序列化器

用途：用于把字段或类型交给明确的 Jackson 序列化器处理。

```java
import com.fasterxml.jackson.core.JsonGenerator;
import com.fasterxml.jackson.databind.JsonSerializer;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializerProvider;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import java.io.IOException;

final class MaskingSerializer extends JsonSerializer<String> {
    @Override
    public void serialize(String value, JsonGenerator gen, SerializerProvider provider)
            throws IOException {
        if (value == null) {
            gen.writeNull();
            return;
        }
        gen.writeString(value.replaceAll("(?<=\\d{3})\\d{4}(?=\\d{4})", "****"));
    }
}

record Contact(@JsonSerialize(using = MaskingSerializer.class) String phone) {}
// 作用：Contact.phone 的序列化器固定为 MaskingSerializer；只有 ObjectMapper 写出该字段时才会执行脱敏。
// 输入：phone 的原始值为 "13812345678"，本次序列化把它作为 Contact.phone 传给 MaskingSerializer。
ObjectMapper mapper = new ObjectMapper();
// 初始状态：mapper 使用默认 Jackson 2 配置，待序列化的 phone 输入为 "13812345678"。
String json = mapper.writeValueAsString(new Contact("13812345678"));
// 返回：ObjectMapper.writeValueAsString 调用 MaskingSerializer，把 phone 的中间四位替换为 ****。
System.out.println(json);
// 输出：{"phone":"138****5678"}
// 说明：直接调用 new Contact("13812345678").phone() 仍返回原值，脱敏只发生在本次 JSON 写出路径。
```

### `Jwts.builder`：创建待签名 JWT

用途：用于建立 JWT 构建器并设置必要声明，最终必须使用受控密钥签名。

```java
String token = Jwts.builder().subject("user-7").signWith(signingKey).compact();
// 输入：token 的初始值为 Jwts.builder().subject("user-7").signWith(signingKey).compact()。
// 关键变化：token 接收右侧表达式 Jwts.builder().subject("user-7").signWith(signingKey).compact() 的计算结果。
System.out.println(token.split("\\.").length);
// 输出：3
// 说明：Jwts.builder() 写入 subject=user-42 和签发/过期时间，signWith(key) 后 compact 才产生可传输令牌；未签名构建器不是可接受的访问令牌。
```

### `Claims.put`：写入自定义 JWT 声明

用途：用于向声明集合写入最少且非敏感的业务属性。

```java
Claims claims = Jwts.claims().add("tenant", "acme").build();
claims.put("role", "reader");
// 输入：表达式为 claims.put("role", "reader")。
// // 关键变化：claims.put("role", "reader") 使用括号内的具体实参更新接收对象状态。
System.out.println(claims.get("role"));
// 输出：reader
// 说明：claims.put("tenant_id", "t-7") 写入自定义声明 tenant_id=t-7；解析端必须在验签后按 String 读取，且不能把密码或密钥放进 claim。
```

### `ObjectMapper.writeValueAsString`：序列化对象

用途：用于在 HTTP 或消息边界把明确 DTO 序列化为 JSON。

```java
import com.fasterxml.jackson.databind.ObjectMapper;

record UserView(String name, int age) {}

ObjectMapper mapper = new ObjectMapper();
// 初始状态：mapper 当前为 new ObjectMapper()。
String json = mapper.writeValueAsString(new UserView("Ann", 18));
// 关键变化：json 接收右侧表达式 mapper.writeValueAsString(new UserView("Ann", 18)) 的计算结果。
System.out.println(json);
// 输出：{"name":"Ann","age":18}
// 说明：ObjectMapper.writeValueAsString(user) 生成包含协议字段的 JSON 文本；输出字段名、null 策略和日期格式由 UserDto 注解及 mapper 配置共同决定。
```

Jackson 2 示例使用 `com.fasterxml.jackson.databind.ObjectMapper`；Jackson 3 对应类型是 `tools.jackson.databind.ObjectMapper`，不要混用两组 import。

### `ObjectMapper.readValue`：反序列化 JSON

用途：用于把受控大小的 JSON 输入转换为明确 DTO。

```java
import com.fasterxml.jackson.databind.ObjectMapper;

record UserInput(String name, int age) {}
UserInput input = new ObjectMapper().readValue("{\"name\":\"Ann\",\"age\":18}", UserInput.class);
// 输入：input 的初始值为 new ObjectMapper().readValue("{\"name\":\"Ann\",\"age\":18}", UserInput.class)。
// 关键变化：input 接收右侧表达式 new ObjectMapper().readValue("{\"name\":\"Ann\",\"age\":18}", UserInput.class) 的计算结果。
System.out.println(input.name() + "/" + input.age());
// 输出：Ann/18
// 说明：ObjectMapper.readValue(json, UserDto.class) 把输入字段绑定到 UserDto；未知字段、类型错误或构造约束会按 mapper 配置报错，而不是静默成为可信对象。
```

生产 mapper 通常是共享、不可随请求修改的组件；输入错误应在边界翻译为稳定的 400 响应。

### `@JsonFormat`：约定日期表现

用途：用于给日期时间字段声明明确的 JSON 文本格式。

```java
import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.time.OffsetDateTime;

record EventView(@JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ssXXX") OffsetDateTime occurredAt) {}
// 作用：@JsonFormat 把 occurredAt 的 JSON 输出格式固定为日期、时间和数值时区偏移。
// 输入：occurredAt 输入为 OffsetDateTime.parse("2026-10-01T09:00:00+08:00")，pattern 为 yyyy-MM-dd'T'HH:mm:ssXXX。
ObjectMapper mapper = new ObjectMapper().findAndRegisterModules();
// 初始状态：mapper 已注册 Java Time 模块，输入时间为 2026-10-01T09:00:00+08:00。
String json = mapper.writeValueAsString(
    new EventView(OffsetDateTime.parse("2026-10-01T09:00:00+08:00")));
// 返回：ObjectMapper 按 @JsonFormat 的 pattern 写出 occurredAt，而不是使用默认的数组或未格式化表示。
System.out.println(json);
// 输出：{"occurredAt":"2026-10-01T09:00:00+08:00"}
// 说明：直接调用 record 访问器只会得到 OffsetDateTime 对象；本次 JSON 字符串才展示注解真正生效的格式。
```

pattern、时区和 Java Time 模块要与客户端协议一起测试；`LocalDateTime` 本身不含时区。

### `@JsonInclude`：省略可选字段

用途：用于声明 null 或空值字段是否出现在 JSON 中。

```java
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.databind.ObjectMapper;

@JsonInclude(JsonInclude.Include.NON_NULL)
record ResultView(String id, String note) {}
// 作用：@JsonInclude(NON_NULL) 让 ObjectMapper 在 note 为 null 时省略该字段。
// 输入：ResultView 输入为 id="e-1"、note=null；本次序列化应只保留非 null 字段。
ObjectMapper mapper = new ObjectMapper();
// 初始状态：mapper 待序列化的 ResultView 为 id="e-1"、note=null。
String json = mapper.writeValueAsString(new ResultView("e-1", null));
// 返回：ObjectMapper 保留非 null 的 id，并从 JSON 中移除 note。
System.out.println(json);
// 输出：{"id":"e-1"}
// 说明：空字符串不是 null，仍会被写出；字段缺失与显式 null 的协议语义需要单独约定。
```

省略 null 会改变响应字段形状，必须与客户端兼容策略一起评估。

### `JSON.toJSONString`：用 Fastjson2 序列化

用途：用于在明确边界内用 Fastjson2 把对象序列化为 JSON。

```java
import com.alibaba.fastjson2.JSON;

record UserView(String name, int age) {}

String json = JSON.toJSONString(new UserView("Ann", 18));
// 输入：json 的初始值为 JSON.toJSONString(new UserView("Ann", 18))。
// 作用：用于在明确边界内用 Fastjson2 把对象序列化为 JSON。
System.out.println(json.contains("\"name\":\"Ann\"") && json.contains("\"age\":18"));
// 输出：true
```

统一项目应选择一种默认 mapper，并集中配置写出特性。

### `JSON.parseObject`：用 Fastjson2 反序列化

用途：用于把受控大小的 JSON 输入解析为指定类型。

```java
import com.alibaba.fastjson2.JSON;

record UserInput(String name, int age) {}
UserInput input = JSON.parseObject("{\"name\":\"Ann\",\"age\":18}", UserInput.class);
// 输入：input 的初始值为 JSON.parseObject("{\"name\":\"Ann\",\"age\":18}", UserInput.class)。
// 作用：用于把受控大小的 JSON 输入解析为指定类型。
System.out.println(input.name() + "/" + input.age());
// 输出：Ann/18
```

不要把宽松兼容特性当作安全策略；转换成功后仍要继续校验和授权。

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
        if (value == null) {
            gen.writeNull();
            return;
        }
        int at = value.indexOf('@');
// 关键变化：at 接收表达式 value.indexOf('@') 的计算结果。
// 初始状态：at 的初始值为 value.indexOf('@')。
        String masked = at > 0 && at < value.length() - 1
            ? (at == 1 ? "*" : value.charAt(0) + "***") + value.substring(at)
            : value;
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
    String email,
    String displayName) {}

com.fasterxml.jackson.databind.ObjectMapper mapper =
    new com.fasterxml.jackson.databind.ObjectMapper();
String json = mapper.writeValueAsString(new PublicUser("ann@example.test", "Ann"));
System.out.println(json);
// 输出：{"email":"a***@example.test","displayName":"Ann"}
String singleCharLocal = mapper.writeValueAsString(new PublicUser("a@example.test", "Ann"));
System.out.println(singleCharLocal);
// 输出：{"email":"*@example.test","displayName":"Ann"}
// 作用：用于把领域类型映射成稳定的公开协议，或在输出前遮蔽敏感值；自定义代码必须有反向解析、版本兼容和脱敏测试。
```

`@JsonSerialize` 和 `@JsonDeserialize` 把具体实现绑定到字段或类型，示例中的 `EmailDeserializer` 代表项目自己的反序列化器；这里使用字段级 serializer 并由 `ObjectMapper.writeValueAsString` 实际调用，不会全局替换所有 `String` 的序列化。脱敏条件从 `at > 0` 开始：单字符本地部（如 `a@example.test`）输出 `*@example.test`，更长本地部保留首字符；不含 `@` 或缺少域部分的值安全透传，未绑定 serializer 的 `displayName` 也保持 `Ann`。这个代码块使用 Jackson 2 API，因此 serializer 的 core/databind 类型来自 `com.fasterxml.jackson.*`；迁移 Jackson 3 时分别改为 `tools.jackson.core.*`、`tools.jackson.databind.*` 与 `tools.jackson.databind.annotation.*`，而 `@JsonFormat`/`@JsonInclude` 仍保留 `com.fasterxml.jackson.annotation.*`。敏感字段还应在日志、错误响应和缓存 key 中分别检查，单一注解覆盖不了所有输出路径。

### Jackson 3 自定义序列化：ValueSerializer/ValueDeserializer

用途：用于在 Jackson 3.1.4 中为单个协议字段实现脱敏和反向解析；Jackson 3 的自定义 handler 已将 Jackson 2 的 `JsonSerializer`/`JsonDeserializer` 更名为 `ValueSerializer`/`ValueDeserializer`。

```java
import tools.jackson.core.JacksonException;
import tools.jackson.core.JsonGenerator;
import tools.jackson.databind.SerializationContext;
import tools.jackson.databind.ValueSerializer;
import tools.jackson.databind.annotation.JsonSerialize;

final class MaskedEmailValueSerializer extends ValueSerializer<String> {
    @Override
    public void serialize(String value, JsonGenerator gen, SerializationContext ctxt)
            throws JacksonException {
// // 关键变化：throws JacksonException { 使用表达式中的具体参数完成本次调用。
        int at = value.indexOf('@');
// 关键变化：at 接收表达式 value.indexOf('@') 的计算结果。
// 初始状态：at 的初始值为 value.indexOf('@')。
        String masked = at > 0 && at < value.length() - 1
                ? (at == 1 ? "*" : value.charAt(0) + "***") + value.substring(at)
                : value;
        gen.writeString(masked);
    }
}

record PublicUserOutputV3(
    @JsonSerialize(using = MaskedEmailValueSerializer.class)
    String email) {}

// 输出：ann@example.test 序列化为 a***@example.test
// 作用：用于在 Jackson 3.1.4 中为单个协议字段实现脱敏和反向解析；Jackson 3 的自定义 handler 已将 Jackson 2 的 `JsonSerializer`/`JsonDeserializer` 更名为 `ValueSerializer`/`ValueDeserializer`。
```

Jackson 3.1.4 的 `ValueSerializer.serialize` 使用 `SerializationContext`，异常统一从 `tools.jackson.core.JacksonException` 传播。`@JsonSerialize` 将它限定在 `email` 字段，不会全局改写所有 `String`。

### Jackson 3 自定义反序列化：ValueDeserializer

用途：用于在 Jackson 3.1.4 中将单个 JSON 字段转换成领域值；字段规范化后仍要继续执行业务校验。

```java
import tools.jackson.core.JacksonException;
import tools.jackson.core.JsonParser;
import tools.jackson.databind.DeserializationContext;
import tools.jackson.databind.ValueDeserializer;
import tools.jackson.databind.annotation.JsonDeserialize;

final class EmailValueDeserializer extends ValueDeserializer<String> {
    @Override
    public String deserialize(JsonParser parser, DeserializationContext ctxt)
            throws JacksonException {
// // 关键变化：throws JacksonException { 使用表达式中的具体参数完成本次调用。
        return parser.getString().trim();
    }
}

record PublicUserV3(
    @JsonDeserialize(using = EmailValueDeserializer.class)
    String email) {}

// 输出：" ann@example.test " 反序列化为 ann@example.test
// 作用：用于在 Jackson 3.1.4 中将单个 JSON 字段转换成领域值；字段规范化后仍要继续执行业务校验。
```

`ValueDeserializer.deserialize` 使用 `DeserializationContext`，`JsonParser.getString()` 是 3.x 的文本访问 API。Jackson 2 的对照仍使用上一个片段中的 `JsonSerializer`/`JsonDeserializer` 和 `com.fasterxml.jackson.*` 包，不能混用两代类型。实际项目通过 3.x `ObjectMapper`/`JsonMapper` 注册 DTO，并用 BOM 锁定整组版本。

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
// // 关键变化：RedisTemplate<String, String> redisTemplate(RedisConnectionFactory connectionFactory) { 使用表达式中的具体参数完成本次调用。
        RedisTemplate<String, String> redis = new RedisTemplate<>();
// 关键变化：redis 接收表达式 new RedisTemplate<>() 的计算结果。
// 初始状态：redis 的初始值为 new RedisTemplate<>()。
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
// 说明：key/hashKey 使用 StringRedisSerializer，value/hashValue 使用限定 DTO 的 JSON 序列化器；例如 user:42 的字节 key 稳定，缓存 value 只能反序列化为约定类型，不能接受任意类元数据。
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
