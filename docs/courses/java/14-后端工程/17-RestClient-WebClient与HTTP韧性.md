---
title: RestClient、WebClient 与 HTTP 韧性
date: 2026-10-05
category: Java后端工程
tags: [Java, HTTP, Spring, Resilience4j]
description: 为 HTTP 调用配置资源预算、错误映射和受控重试，区分连接复用与业务幂等。
---

# RestClient、WebClient 与 HTTP 韧性

## 学习目标

- 能按阻塞/响应式执行模型选择客户端，并限定连接和响应预算。
- 能区分网络失败、HTTP 拒绝与业务失败，避免不安全重试。
- 能组合重试、熔断、隔离和限流，并验证拒绝与恢复路径。

## 核心知识点

RestClient 是同步客户端（Framework 6.1+），适合普通 MVC 调用；WebClient 使用 Reactor，适合响应式组合和流式读取。非阻塞不等于无限并发，`.block()` 也不会把链路变成免费等待。OpenFeign 适合声明式接口与 Spring Cloud 生态，应单独确认 Cloud BOM、底层客户端和重试配置，不能再叠加未知次数的重试。

本文使用 JDK 20、Spring Boot 3.4 / Framework 6.2、Reactor Netty 1.2、Resilience4j 2.x；RestClient 属于 spring-web，WebClient 需 WebFlux starter，Resilience4j 是可选第三方库。采用 JDK HttpClient 示例避免混淆 Apache HttpClient 的 API 版本。依据：[Spring REST 客户端](https://docs.spring.io/spring-framework/reference/integration/rest-clients.html)、[Reactor Netty HTTP](https://projectreactor.io/docs/netty/release/reference/http-client.html)、[Resilience4j Retry](https://resilience4j.readme.io/docs/retry)。代码片段用于方法体，网络 URL 为教学测试服务器地址，不是已验证线上服务。

超时是一组预算：连接建立、池等待、响应读取、整体业务截止时间不同；一次调用最多两次尝试时必须把两次等待和退避都算进总预算。池上限要匹配下游承载能力。取消可能关闭/释放本地资源，却不证明服务器没有提交。响应体有大小限制，错误体也应限长、脱敏。

## 常用用法

### `HttpClient.newBuilder`：建立连接复用与超时基础

用途：用于构建共享的 JDK HTTP 客户端并限定连接建立时间，减少每个请求重新建连接的开销。

```java
// 初始状态：教学连接预算 2 秒，客户端作为应用级对象复用。
java.net.http.HttpClient transport = java.net.http.HttpClient.newBuilder()
    .connectTimeout(java.time.Duration.ofSeconds(2))
    .followRedirects(java.net.http.HttpClient.Redirect.NEVER).build();
org.springframework.http.client.JdkClientHttpRequestFactory factory =
    new org.springframework.http.client.JdkClientHttpRequestFactory(transport);
factory.setReadTimeout(java.time.Duration.ofSeconds(3));
// 关键变化：Spring 请求工厂复用 transport，并有独立 3 秒读取预算。
org.junit.jupiter.api.Assertions.assertEquals(java.time.Duration.ofSeconds(2), transport.connectTimeout().orElseThrow());
// 结果：连接预算可检查；该配置不是端到端总耗时 3 秒的保证。
```

不要把 read timeout 当所有阶段的统一截止时间。DNS、代理、TLS 和重定向路径需在真实客户端测试；服务端地址由配置白名单限定，禁止直接把用户 URL 当 baseUrl，否则可能产生 SSRF。

### `RestClient`：同步查询与状态映射

用途：用于在有明确超时预算的同步调用中读取订单，并把已知 HTTP 拒绝转换为业务异常。

```java
// 初始状态：factory 是上节的请求工厂；测试服务器约定订单 7 返回 {"state":"PAID"}。
org.springframework.web.client.RestClient client = org.springframework.web.client.RestClient.builder()
    .requestFactory(factory).baseUrl("http://127.0.0.1:18080").build();
String body = client.get().uri(builder -> builder.path("/orders/{id}").build(7))
    .retrieve().onStatus(status -> status.value() == 404,
        (request, response) -> { throw new IllegalStateException("ORDER_NOT_FOUND"); })
    .body(String.class);
// 关键变化：7 按 URI 模板展开；404 进入固定业务异常，其他错误保留默认错误处理。
org.junit.jupiter.api.Assertions.assertNotNull(body);
org.junit.jupiter.api.Assertions.assertTrue(body.contains("PAID"));
// 结果：受控测试服务器必须返回 PAID；本文未声称真实网络执行成功。
```

URI 变量或 `queryParam` 交给 builder 编码，避免字符串拼接和重复手工编码；专门测试空格、中文、`+`、`/` 的契约。`retrieve()` 默认对 4xx/5xx 抛异常；使用 `exchange()` 时需要自己完成状态处理。响应内容不能直接写日志，转换后的 DTO 仍需业务校验。

### `ConnectionProvider.builder`：限制响应式连接池

用途：用于为 Reactor Netty 限定连接数量和排队等待，防止调用高峰无限占用资源。

```java
// 初始状态：教学池最多 20 条连接、40 个等待者、等待不超过 1 秒。
reactor.netty.resources.ConnectionProvider pool = reactor.netty.resources.ConnectionProvider.builder("orders")
    .maxConnections(20).pendingAcquireMaxCount(40)
    .pendingAcquireTimeout(java.time.Duration.ofSeconds(1)).build();
reactor.netty.http.client.HttpClient transport = reactor.netty.http.client.HttpClient.create(pool)
    .option(io.netty.channel.ChannelOption.CONNECT_TIMEOUT_MILLIS, 2000)
    .responseTimeout(java.time.Duration.ofSeconds(3));
// 关键变化：pool 的 20 条连接用满后最多排队 40 个请求，超过 1 秒等待预算失败。
org.junit.jupiter.api.Assertions.assertNotNull(transport);
pool.dispose();
// 结果：这里只构建/释放池；应用中池应共享并在停机时释放，不能请求后立即 dispose。
```

响应超时通常针对网络读取阶段，不等于全部上游组合的整体期限。指标应记录 active、pending、超时和拒绝；池默认值和资源释放方式按锁定的 Netty 版本确认。

### `WebClient`：限定响应体和整体期限

用途：用于把响应式请求组合成有限预算的链，并在错误分支释放响应体资源。

```java
// 初始状态：transport 是上节共享 Reactor 客户端，教学响应最多 256 KiB。
org.springframework.web.reactive.function.client.WebClient client =
    org.springframework.web.reactive.function.client.WebClient.builder()
        .baseUrl("http://127.0.0.1:18080")
        .clientConnector(new org.springframework.http.client.reactive.ReactorClientHttpConnector(transport))
        .codecs(codecs -> codecs.defaultCodecs().maxInMemorySize(256 * 1024)).build();
reactor.core.publisher.Mono<String> result = client.get().uri("/orders/{id}", 7)
    .exchangeToMono(response -> response.statusCode().is2xxSuccessful()
        ? response.bodyToMono(String.class)
        : response.createException().flatMap(reactor.core.publisher.Mono::error))
    .timeout(java.time.Duration.ofSeconds(4));
// 关键变化：请求尚未订阅；订阅后错误体被消费，整体链超过 4 秒发出超时并取消上游。
org.junit.jupiter.api.Assertions.assertNotNull(result);
// 结果：需要 StepVerifier/受控 HTTP 服务器断言 PAID、错误、超时、过大 body 和取消分支。
```

不要在 event loop 上调用阻塞 JDBC 或 `block()`。取消不是远端回滚，POST 超时后仍可能已产生订单。`maxInMemorySize` 限制聚合内存，不等于所有流式下载的总字节限额；流式下载另做累计限制并释放 DataBuffer。

### `Retry.backoff`：仅对可安全重放的读取退避

用途：用于对明确的临时传输故障有限重试，通过退避与抖动降低同时恢复造成的冲击。

```java
// 初始状态：教学读取第一次发出 IOException，第二次成功；输入没有副作用。
java.util.concurrent.atomic.AtomicInteger attempts = new java.util.concurrent.atomic.AtomicInteger();
reactor.core.publisher.Mono<String> read = reactor.core.publisher.Mono.defer(() ->
    attempts.incrementAndGet() == 1 ? reactor.core.publisher.Mono.error(new java.io.IOException("temporary"))
        : reactor.core.publisher.Mono.just("PAID"));
reactor.core.publisher.Mono<String> retried = read.retryWhen(reactor.util.retry.Retry.backoff(1, java.time.Duration.ofMillis(20))
    .jitter(0.5).filter(error -> error instanceof java.io.IOException));
// 关键变化：attempts 从 1 递增为 2 后返回 PAID；最多重试 1 次，业务拒绝不重试。
org.junit.jupiter.api.Assertions.assertEquals("PAID", retried.block(java.time.Duration.ofSeconds(2)));
org.junit.jupiter.api.Assertions.assertEquals(2, attempts.get());
// 结果：教学同步测试中两次尝试；生产响应式线程不使用 block。
```

真实 WebClient 网络故障常包装为 WebClientRequestException，需基于可复核的异常分类，而不是照搬此 IOException 过滤。429/503 可按服务契约处理 Retry-After，并限制总截止时间；业务 4xx 默认不重试。非幂等 POST 禁止盲目重试。幂等键只有服务端去重协议支持、同键同请求摘要、明确保留期及结果查询时才有效；客户端仅设置 header 不会创造幂等性。Resilience4j `Retry` 的 maxAttempts 通常含第一次尝试，与 Reactor 的重试次数语义不同，配置时核对。

### `CircuitBreaker.ofDefaults`：观测失败并拒绝后续调用

用途：用于在下游持续失败时熔断调用，限制故障传播而非替代请求超时。

```java
// 初始状态：新断路器状态 CLOSED，教学代码验证状态机初值。
io.github.resilience4j.circuitbreaker.CircuitBreaker breaker =
    io.github.resilience4j.circuitbreaker.CircuitBreaker.ofDefaults("orders");
java.util.function.Supplier<String> guarded = io.github.resilience4j.circuitbreaker.CircuitBreaker.decorateSupplier(
    breaker, () -> "PAID");
String state = guarded.get();
// 关键变化：成功结果被断路器记录；尚未达到最小样本，不会因一条失败立刻 OPEN。
org.junit.jupiter.api.Assertions.assertEquals("PAID", state);
org.junit.jupiter.api.Assertions.assertEquals(io.github.resilience4j.circuitbreaker.CircuitBreaker.State.CLOSED, breaker.getState());
// 结果：正常分支通过；失败率、半开探测和恢复需用自定义窗口测试。
```

依据：[CircuitBreaker](https://resilience4j.readme.io/docs/circuitbreaker)。选择重试放在熔断内或外会改变计数含义；不要叠加多层自动重试形成乘法放大。拒绝应映射为明确的暂不可用响应，不返回伪造的业务成功。

### `Bulkhead.ofDefaults`：隔离并发占用

用途：用于把某个下游的并发量限定在预算内，避免故障调用占满全部应用资源。

```java
// 初始状态：教学 semaphore bulkhead 默认配置，执行一个短同步查询。
io.github.resilience4j.bulkhead.Bulkhead bulkhead = io.github.resilience4j.bulkhead.Bulkhead.ofDefaults("orders");
java.util.function.Supplier<String> call = io.github.resilience4j.bulkhead.Bulkhead.decorateSupplier(bulkhead, () -> "PAID");
String result = call.get();
// 关键变化：bulkhead 为 PAID 查询获取许可，返回后释放；饱和路径拒绝或有限等待。
org.junit.jupiter.api.Assertions.assertEquals("PAID", result);
// 结果：成功路径返回 PAID；真实并发预算需按线程数和连接池容量配置。
```

semaphore 隔离并发，线程池 bulkhead 还涉及线程和队列；它们不保证请求超时或限每秒速率。响应式链用匹配 Reactor operator，不能用同步装饰器把未订阅 Mono 当成已经完成的调用。依据：[Bulkhead](https://resilience4j.readme.io/docs/bulkhead)。

### `RateLimiter.ofDefaults`：限制本实例调用速率

用途：用于在调用入口控制许可发放速度，避免单实例持续超过下游约定的配额。

```java
// 初始状态：limiter 名为 orders，采用库默认许可配置；生产按配额显式设置。
io.github.resilience4j.ratelimiter.RateLimiter limiter = io.github.resilience4j.ratelimiter.RateLimiter.ofDefaults("orders");
java.util.function.Supplier<String> call = io.github.resilience4j.ratelimiter.RateLimiter.decorateSupplier(limiter, () -> "PAID");
String result = call.get();
// 关键变化：许可允许一次本地调用；拒绝分支由 RequestNotPermitted 表示。
org.junit.jupiter.api.Assertions.assertEquals("PAID", result);
// 结果：单次成功受保护；多实例总配额需要网关或共享协调，不能简单复制本地配额。
```

限流许可按周期配置，并不是全局共享配额；等待许可也要纳入整体截止时间。依据：[RateLimiter](https://resilience4j.readme.io/docs/ratelimiter)。

## 易混点

连接复用降低开销，不提供幂等；超时限制等待，不撤销远端提交；熔断按失败历史拒绝，隔离按并发限制，限流按速率发许可。教学默认配置只演示入口，生产数值要通过压力、故障和恢复测试确定。

## 课后小问

1. POST 超时能直接重发吗？答案：不能判断是否已提交。解析：使用服务端幂等契约和结果查询。
2. 为什么要有抖动？答案：分散客户端重试时刻。解析：固定退避可能导致同步重试风暴。
3. Mono 被装饰就完成请求了吗？答案：通常还没有订阅。解析：响应式 operator 必须记录真实终止信号。

## 本节小结

韧性来自有限资源和清晰语义。先确定截止时间、响应大小与幂等条件，再组合重试、熔断、隔离和限流，并观察拒绝分支。

## 快速回顾

客户端模型 → URI 编码 → 共享连接/有限池 → 分阶段超时/总预算 → 状态映射/响应体限制 → 安全重试 → 熔断/隔离/限流 → 故障注入和指标。
