---
title: JUnit 5、Mockito 与 MockMvc
date: 2026-10-05
category: Java后端工程
tags: [Java, JUnit, Mockito, MockMvc]
description: 用确定性的单元测试、MVC 切片和真实上下文测试验证业务边界。
---

# JUnit 5、Mockito 与 MockMvc

## 学习目标

- 能选择单元测试、MVC 切片和完整上下文测试的正确边界。
- 能用生命周期、参数化测试和严格 mock 观察业务行为。
- 能控制时间、测试数据和线程，避免依赖偶然通过。

## 核心知识点

测试金字塔强调大量廉价的业务测试、适量接口/组件测试以及少量完整链路测试。JUnit Jupiter 提供测试模型，Mockito 提供替身，MockMvc 在进程内通过 MVC 调度链执行请求；MockMvc 不启动真实 HTTP 服务，无法验证代理、TLS 或套接字超时。

本文使用 JDK 20、JUnit Jupiter 5.x、Mockito 5.x、Spring Boot 3.4 / Framework 6.2；Boot 3.4 的默认 BOM 管理 Jupiter 5.11 系列，这些示例也适用于 5.13。依赖 `spring-boot-starter-test`，升级时通过 JUnit 5 BOM 保持 platform/jupiter 一致，不要只改聚合依赖版本或混入 JUnit 6。完整测试类可直接放 `src/test/java`，方法体片段放入测试方法。参考 [JUnit 5 用户指南](https://docs.junit.org/5.13.4/user-guide/)、[Mockito API](https://javadoc.io/doc/org.mockito/mockito-core/latest/org/mockito/Mockito.html)、[Spring MockMvc](https://docs.spring.io/spring-framework/reference/testing/mockmvc.html)。

先写会失败的业务断言，观察正确的失败原因，再实现行为；不要把断言写成实现的拷贝。只替换慢或不稳定的外部边界，金额计算、排序和校验尽量使用真实对象。数据库方言、事务提交和 ORM 映射由[容器集成测试](/courses/java/14-后端工程/15-Testcontainers集成测试)验证。

## 常用用法

### `@BeforeEach`：隔离每次测试的数据

用途：用于为每个测试建立新的可变状态，避免前一个测试污染后一个测试。

```java
// 初始状态：JUnit 默认每个测试方法创建新的实例，items 在初始化时为空。
class ItemsTest {
    java.util.List<String> items;
    @org.junit.jupiter.api.BeforeEach
    void prepare() { items = new java.util.ArrayList<>(); }
    @org.junit.jupiter.api.Test
    void addingOneItemChangesSize() {
        items.add("book");
        // 关键变化：这个测试独占的 items 从空变成包含 book。
        org.junit.jupiter.api.Assertions.assertEquals(java.util.List.of("book"), items);
    }
}
// 结果：断言只依赖本测试的 book；不依赖方法运行顺序。
```

`@BeforeAll` 默认需要 static，适合昂贵的共享只读资源；`@AfterEach` 释放每次资源，`@AfterAll` 释放共享资源。`PER_CLASS` 改变实例生命周期，共享字段仍可能泄漏。不要靠 `@Order` 把一个业务流程拆成相互依赖的测试；一个流程放在一个测试里。

### `Assertions.assertThrows`：验证失败的类型和信息

用途：用于证明非法输入被业务拒绝，防止测试只覆盖正常分支。

```java
// 初始状态：金额 -1 不合法，教学函数要求金额非负。
java.util.function.IntUnaryOperator checked = amount -> {
    if (amount < 0) throw new IllegalArgumentException("NEGATIVE_AMOUNT");
    return amount;
};
IllegalArgumentException failure = org.junit.jupiter.api.Assertions.assertThrows(
    IllegalArgumentException.class, () -> checked.applyAsInt(-1));
// 关键变化：amount=-1 被转换为 IllegalArgumentException，failure 保存拒绝原因。
org.junit.jupiter.api.Assertions.assertEquals("NEGATIVE_AMOUNT", failure.getMessage());
// 结果：错误类型和稳定错误码同时受保护；中文展示文案不作为业务分支。
```

常见断言还有 `assertEquals`、`assertAll`、`assertDoesNotThrow`；`assertTimeoutPreemptively` 使用独立线程，可能脱离 Spring 测试事务和线程局部上下文，不应无差别包住数据库测试。

### `@ParameterizedTest`：覆盖边界值

用途：用于让同一业务规则在多个边界输入下运行，减少复制测试造成的漏改。

```java
// 初始状态：分页大小允许 1 到 100；这里验证两端和中间值。
class PageSizeTest {
    @org.junit.jupiter.params.ParameterizedTest
    @org.junit.jupiter.params.provider.ValueSource(ints = {1, 50, 100})
    void acceptsAllowedSize(int size) {
        int bounded = Math.max(1, Math.min(100, size));
        // 关键变化：size=1/50/100 经限幅计算返回 bounded，三个合法值保持不变。
        org.junit.jupiter.api.Assertions.assertEquals(size, bounded);
    }
}
// 结果：产生三个独立用例；还需另测 0、101、负数的拒绝或限幅契约。
```

多字段期望可用 `@CsvSource`、对象或复杂场景用 `@MethodSource`。期望应手算，例如 101→100，不要调用同一个待测函数生成 expected。

### `Mockito.when`：只替代外部读取

用途：用于让价格服务在隔离外部数据源时仍执行真实的金额计算逻辑。

```java
// 初始状态：PriceSource 是外部接口，教学 Checkout 将价格乘数量。
interface PriceSource { int cents(String sku); }
record Checkout(PriceSource source) {
    int total(String sku, int count) { return Math.multiplyExact(source.cents(sku), count); }
}
PriceSource source = org.mockito.Mockito.mock(PriceSource.class);
org.mockito.Mockito.when(source.cents("book")).thenReturn(1200);
Checkout checkout = new Checkout(source);
int total = checkout.total("book", 2);
// 关键变化：真实 Checkout 将固定单价 1200 乘以数量 2。
org.junit.jupiter.api.Assertions.assertEquals(2400, total);
// 结果：断言业务金额 2400，而不是只证明 mock 能返回 1200。
```

spy 会调用真实方法；`when(spy.call())` 可能触发副作用，必要时使用 `doReturn(...).when(spy)...`。`@ExtendWith(MockitoExtension.class)` 配合 `@Mock` 默认使用严格行为；`Strictness.STRICT_STUBS` 检查未用 stub 和参数不匹配，不应为消除提示而全局设 lenient。

### `Mockito.verify`：验证业务要求的外部副作用

用途：用于检查扣款后的通知恰好发生一次，防止重复发送或漏发这种真实业务错误。

```java
// 初始状态：教学 ReceiptService 的业务要求为每次成功结账发送一次收据。
interface ReceiptSender { void send(String order); }
record ReceiptService(ReceiptSender sender) { void paid(String order) { sender.send(order); } }
ReceiptSender sender = org.mockito.Mockito.mock(ReceiptSender.class);
new ReceiptService(sender).paid("order-7");
// 关键变化：真实服务成功路径请求一次发送 order-7。
org.mockito.Mockito.verify(sender, org.mockito.Mockito.times(1)).send("order-7");
// 结果：verify 检查 order-7 恰好调用 1 次；漏发、重复发或传错订单使验证失败。
```

不要给所有内部方法加 verify；重构实现时这些测试会误报。验证交互应有可说明的业务副作用，同时断言可见的返回值或状态。对超时后重试的通知，要靠持久化去重验证，而不是 mock 的调用数证明可靠投递。

### `@WebMvcTest`：限制上下文为 MVC 切片

用途：用于仅加载 Controller、MVC 配置和相关 advice，快速验证输入与响应契约。

```java
// 初始状态：导入上一篇 OrderController/OrderErrors；切片不启动数据库。
@org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest(OrderController.class)
@org.springframework.context.annotation.Import(OrderErrors.class)
class OrderSliceTest {
    @org.springframework.beans.factory.annotation.Autowired
    org.springframework.test.web.servlet.MockMvc mvc;
    @org.junit.jupiter.api.Test
    void unknownOrderIsNotFound() throws Exception {
        mvc.perform(org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get("/orders/8"))
            .andExpect(org.springframework.test.web.servlet.result.MockMvcResultMatchers.status().isNotFound())
            .andExpect(org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath("$.code").value("ORDER_NOT_FOUND"));
        // 关键变化：8 进入异常路径，经 advice 变成公开 404/code。
    }
}
// 结果：两个断言同时保护状态码与错误结构；完整安全链可能要求认证测试 fixture。
```

有业务依赖时用 Framework 6.2 `@MockitoBean` 替换服务；Boot 3.4 的 `@MockBean` 已弃用。安全过滤器默认可能返回 401/403，应该用 spring-security-test 构造身份、单独验证授权规则，不能为了让测试通过永久关闭过滤器。

### `MockMvc.perform`：观察成功响应

用途：用于在无真实网络的进程内执行 MVC 请求并校验 JSON 输出。

```java
// 初始状态：用 stand-alone 模式注册教学 Controller；此模式不加载整个 Boot 配置。
org.springframework.test.web.servlet.MockMvc mvc =
    org.springframework.test.web.servlet.setup.MockMvcBuilders.standaloneSetup(new OrderController()).build();
mvc.perform(org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get("/orders/7"))
    .andExpect(org.springframework.test.web.servlet.result.MockMvcResultMatchers.status().isOk())
    .andExpect(org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath("$.state").value("PAID"));
// 关键变化：MVC 绑定 id=7，Controller 生成 PAID 的 JSON。
// 结果：状态 200 和 state=PAID 被断言；stand-alone 不能证明应用的真实安全配置。
```

### `@SpringBootTest`：验证完整应用接线

用途：用于加载完整 Boot 上下文，验证服务、配置与框架自动配置能够共同工作。

```java
// 初始状态：应用主配置可发现，测试 profile 必须指向隔离数据库或容器。
@org.springframework.boot.test.context.SpringBootTest
@org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc
class FullOrderTest {
    @org.springframework.beans.factory.annotation.Autowired
    org.springframework.test.web.servlet.MockMvc mvc;
    @org.junit.jupiter.api.Test
    void applicationRoutesOrder() throws Exception {
        mvc.perform(org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get("/orders/7"))
            .andExpect(org.springframework.test.web.servlet.result.MockMvcResultMatchers.status().isOk());
        // 关键变化：请求经过应用实际注册的 MVC 组件与过滤器。
    }
}
// 结果：GET /orders/7 的状态必须为 200；测试前置数据及认证身份需按工程补齐。
```

`RANDOM_PORT` 才启动真实服务器，请求在独立线程执行；测试方法的 `@Transactional` 回滚不能撤销服务器线程已提交的写入。异步任务、`REQUIRES_NEW`、外部 Redis 和发出的 HTTP 请求也不受测试事务自动回滚。用隔离 schema、唯一数据前缀和显式清理，测试完检查无残留。

### `Clock.fixed`：控制业务时间

用途：用于把时间作为显式依赖注入，避免等待午夜或使用 sleep 验证到期规则。

```java
// 初始状态：固定 UTC 时间为 2026-10-05T00:00:00Z，订单在一分钟后到期。
java.time.Clock clock = java.time.Clock.fixed(java.time.Instant.parse("2026-10-05T00:00:00Z"), java.time.ZoneOffset.UTC);
java.time.Instant expiry = java.time.Instant.parse("2026-10-05T00:01:00Z");
boolean expired = !java.time.Instant.now(clock).isBefore(expiry);
// 关键变化：判断只读取传入 clock，真实系统时钟不影响测试。
org.junit.jupiter.api.Assertions.assertFalse(expired);
// 结果：当前时间早于到期时间，expired=false；另测恰好到期为 true。
```

## 易混点

单元测试通过不代表 ORM SQL 或事务传播正确；MockMvc 通过不代表网络配置正确。严格 stub 提示通常揭示 fixture 与行为脱节。测试事务的回滚是线程和资源范围内的机制，不是环境清理的万能开关。

## 课后小问

1. 为何时间测试不用 Thread.sleep？答案：慢且受调度影响。解析：注入 Clock，把临界时间设成确定输入。
2. RANDOM_PORT 请求后测试回滚能删掉订单吗？答案：通常不能。解析：服务线程提交与测试线程事务分离。
3. verify 所有方法有什么代价？答案：把实现结构固化。解析：只验证业务约定的外部副作用，其余看可见结果。

## 本节小结

测试边界决定证据边界。控制输入、时间和数据，用真实业务断言保护行为；外部替身和全上下文测试各承担明确职责。

## 快速回顾

纯逻辑用 Jupiter → 外部慢依赖用严格 Mockito → MVC 契约用切片 → 接线用 Boot 上下文 → 数据库/网络用真实集成 → 显式隔离和清理。
