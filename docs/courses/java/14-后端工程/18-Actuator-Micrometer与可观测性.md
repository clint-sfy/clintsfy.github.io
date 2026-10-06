---
title: Actuator、Micrometer 与可观测性
date: 2026-10-05
category: Java后端工程
tags: [Java, Actuator, Micrometer, Observability]
description: 从受控管理端点到指标、追踪与日志关联，建立有限开销的生产诊断链。
---

# Actuator、Micrometer 与可观测性

## 学习目标

- 能安全暴露管理端点并区分存活、就绪与业务健康。
- 能选择 Counter、Timer、Gauge，避免高基数标签压垮监控系统。
- 能把请求追踪与结构化日志关联，并用 SLO 定义告警而非猜阈值。

## 核心知识点

Actuator 提供管理端点，Micrometer 给指标/观测接口，registry 或 tracing bridge 才把数据送到后端。Metric 汇总数量和分布，Trace 串联一次调用，Log 保留事件细节；三者各有采样、成本和隐私边界。correlation ID 不必等同 trace ID，但同一请求应能可靠关联。

本文沿 JDK 20、Spring Boot 3.4、Micrometer 1.14 与 Micrometer Tracing 1.x；使用 actuator starter，Prometheus 另加 `micrometer-registry-prometheus`，追踪另选匹配的 bridge/exporter，不自动假定已上报。结构化日志配置按 Boot 3.4 的 ECS 支持；旧 Boot 不具有相同属性。参考 [管理端点](https://docs.spring.io/spring-boot/reference/actuator/endpoints.html)、[指标](https://docs.spring.io/spring-boot/reference/actuator/metrics.html)、[Micrometer 观测](https://docs.micrometer.io/micrometer/reference/observation.html)。方法体示例用 SimpleMeterRegistry 做本地确定性验证。

部署时优先只暴露 health 与 prometheus，管理网络、TLS 和身份授权共同限制访问。`management.endpoints.web.exposure.include` 只是选择端点，不是认证；配置自定义 SecurityFilterChain 时 Boot 默认规则会退让，应显式保护 actuator。env、heapdump、loggers、shutdown 等可能泄露/改变状态，不能通配公开。

## 常用用法

### `Health.up`：表达组件健康而非业务保证

用途：用于在已完成实际检查后构造健康结果，为健康组提供可分类的组件状态。

```java
// 初始状态：教学检查确认 order-store 的磁盘预算足够，组件名不携带敏感路径。
org.springframework.boot.actuate.health.Health health =
    org.springframework.boot.actuate.health.Health.up().withDetail("component", "order-store").build();
// 关键变化：组件结果成为 UP，可被 HealthIndicator 返回并参与健康组聚合。
org.junit.jupiter.api.Assertions.assertEquals(org.springframework.boot.actuate.health.Status.UP, health.getStatus());
// 结果：状态为 UP；不能据此证明每笔订单可成功，真实检查需限时且避免副作用。
```

推荐配置：

```yaml
management:
  endpoints:
    web:
      exposure:
        include: health,prometheus
  endpoint:
    health:
      show-details: when_authorized
      probes:
        enabled: true
server:
  shutdown: graceful
spring:
  lifecycle:
    timeout-per-shutdown-phase: 20s
logging:
  structured:
    format:
      console: ecs
```

liveness 判断进程是否必须重启，不应把外部数据库失败放入存活组，否则下游故障可能造成全体重启。readiness 判断是否接收流量，可以按业务决定关键依赖，不能把所有共享下游都盲目纳入而导致无实例可用。若管理端口与业务端口分离，探针成功不证明业务端口可达，应使用主端口 additional paths 并验证部署路由。优雅停机需结合入口摘流量、在途请求、后台任务和容器终止预算；20 秒不是所有事务完成的保证。

### `Counter.builder`：统计累计事件

用途：用于记录可聚合的订单结果次数，标签仅采用有限的业务分类。

```java
// 初始状态：内存 registry 没有订单计数器，outcome 只允许 success/failure 两类。
io.micrometer.core.instrument.simple.SimpleMeterRegistry registry =
    new io.micrometer.core.instrument.simple.SimpleMeterRegistry();
io.micrometer.core.instrument.Counter counter = io.micrometer.core.instrument.Counter
    .builder("orders.created").tag("outcome", "success").register(registry);
counter.increment();
// 关键变化：累计成功次数由 0 变为 1；counter 只能增加，不能表示当前队列长度。
org.junit.jupiter.api.Assertions.assertEquals(1.0, counter.count());
registry.close();
// 结果：本地 count=1；生产 registry 在应用停机时统一释放。
```

用户名、订单号、URL 参数、异常 message 都是高基数标签，禁止作为 meter tag。有限标签集合也有乘积，10 个状态×100 个租户×20 个服务会产生大量序列。租户细节应使用日志/追踪，并控制采样和访问。

### `Timer.builder`：记录次数与耗时分布

用途：用于在成功和失败路径都记录订单处理耗时，帮助定位尾部延迟。

```java
// 初始状态：教学 timer 未记录事件，使用固定 duration 避免伪造业务运行速度。
io.micrometer.core.instrument.simple.SimpleMeterRegistry registry = new io.micrometer.core.instrument.simple.SimpleMeterRegistry();
io.micrometer.core.instrument.Timer timer = io.micrometer.core.instrument.Timer.builder("orders.processing")
    .tag("outcome", "success").serviceLevelObjectives(java.time.Duration.ofMillis(100), java.time.Duration.ofMillis(500))
    .register(registry);
timer.record(java.time.Duration.ofMillis(120));
// 关键变化：样本数从 0 变为 1，总时间增加教学输入 120ms。
org.junit.jupiter.api.Assertions.assertEquals(1L, timer.count());
org.junit.jupiter.api.Assertions.assertEquals(120.0, timer.totalTime(java.util.concurrent.TimeUnit.MILLISECONDS));
registry.close();
// 结果：本地 count=1/total=120ms；不是生产延迟测量。
```

真实代码用 `Timer.Sample` 在 finally stop；失败也计时，避免只看成功导致偏低。直方图桶需要后端支持和预算；客户端 percentile 通常不能跨实例聚合，Prometheus histogram 应在后端计算。SLO 为“99% 请求在 500ms 内且错误率小于约定值”等业务目标，用多窗口错误预算消耗告警；p99 低样本可能误导，须同时看请求量和错误。

### `Gauge.builder`：观察当前状态

用途：用于读取当前队列长度等瞬时值，而不把累计事件数当成实时占用。

```java
// 初始状态：应用持有 queueDepth 强引用，当前积压 2 个任务。
java.util.concurrent.atomic.AtomicInteger queueDepth = new java.util.concurrent.atomic.AtomicInteger(2);
io.micrometer.core.instrument.simple.SimpleMeterRegistry registry = new io.micrometer.core.instrument.simple.SimpleMeterRegistry();
io.micrometer.core.instrument.Gauge gauge = io.micrometer.core.instrument.Gauge.builder("orders.queue.depth", queueDepth, java.util.concurrent.atomic.AtomicInteger::get)
    .register(registry);
queueDepth.set(1);
// 关键变化：一次任务完成后积压从 2 变为 1，采集读取最新值。
org.junit.jupiter.api.Assertions.assertEquals(1.0, gauge.value());
registry.close();
// 结果：value=1；两次采集之间的峰值可能丢失。
```

Gauge 通常持弱引用，业务必须保留被观测对象。回调必须廉价且无副作用，不在 scrape 时执行慢数据库查询。连接池 active/pending、HTTP 池、JVM/GC 与业务指标一起排查，不能凭某一瞬时值自动扩容。

### `Observation.createNotStarted`：关联一次业务观测

用途：用于把业务操作的开始、错误与结束交给已配置的观测处理器，连接指标和追踪。

```java
// 初始状态：教学 registry 没有 exporter，固定事件 orders.lookup 不携带敏感标签。
io.micrometer.observation.ObservationRegistry registry = io.micrometer.observation.ObservationRegistry.create();
io.micrometer.observation.Observation observation = io.micrometer.observation.Observation
    .createNotStarted("orders.lookup", registry).lowCardinalityKeyValue("outcome", "success");
String state = observation.observe(() -> "PAID");
// 关键变化：observe 管理开始/结束和 scope；只有安装 handler 才会生成对应后端数据。
org.junit.jupiter.api.Assertions.assertEquals("PAID", state);
// 结果：业务结果保持 PAID；无 exporter 的教学 registry 不会自动上报 trace。
```

使用 Boot 自动配置的 RestClient.Builder/WebClient.Builder，追踪传播才更容易接上；手工 new 客户端可能遗漏 observation。跨线程用受支持的 context propagation，不能假定 ThreadLocal/MDC 自动传播；HTTP traceparent/baggage 也须限制外部信任、长度和敏感内容。采样使部分 trace 不保留，不能宣称每个请求都有完整追踪。

### `MDC.put`：给日志添加安全关联 ID

用途：用于在当前线程日志中添加可信关联 ID，并在线程池复用之前恢复上下文。

```java
// 初始状态：当前线程可能已有外层 correlationId，req-7 已按白名单校验。
String previous = org.slf4j.MDC.get("correlationId");
try {
    org.slf4j.MDC.put("correlationId", "req-7");
    // 关键变化：本 scope 的日志关联 req-7；不记录密码、令牌、完整请求体。
    org.junit.jupiter.api.Assertions.assertEquals("req-7", org.slf4j.MDC.get("correlationId"));
} finally {
    if (previous == null) org.slf4j.MDC.remove("correlationId");
    else org.slf4j.MDC.put("correlationId", previous);
}
// 结果：退出后恢复原 MDC，嵌套调用与线程复用都不会遗留 req-7。
```

示例依赖支持 MDC 的日志 provider；无 provider 时断言不成立，应先核对启动告警。ECS 等结构化 JSON 方便检索，仍要脱敏、限长、保留策略和日志注入防护。MDC 深入边界见[SLF4J/Logback](/courses/java/14-后端工程/09-SLF4J与Logback日志)。

Prometheus 采集 `/actuator/prometheus`，应验证鉴权、抓取状态、标签集合和时间序列预算。指标端点可用不代表监控已收到数据；还需后端查询和告警演练。报警应包含服务、症状、影响和 runbook，避免只报“CPU 高”而没有业务证据。

## 易混点

UP 不是业务成功保证；端点暴露不是访问控制；Counter 与 Gauge 不可互换；有 observation 不表示有 exporter。追踪和日志关联都需要跨线程/跨服务传播检查。

## 课后小问

1. 可以给每个订单创建一个标签吗？答案：不可以。解析：订单数增长让高基数序列失控，用日志/trace 定位。
2. 数据库断开应让 liveness 失败吗？答案：通常不应。解析：重启应用不能修复共享数据库，可能放大事故。
3. 两个实例 p99 能直接平均吗？答案：不能。解析：分位数不能这样合并，使用可聚合直方图。

## 本节小结

可观测性需要可信采集链、安全访问和有限成本。用业务 SLO 连接指标、追踪与日志，避免把单个探针或图表当全部证据。

## 快速回顾

受控端点 → liveness/readiness 分组 → 有限标签指标 → 追踪传播 → MDC 恢复/结构化脱敏 → Prometheus 后端确认 → SLO 告警与停机演练。
