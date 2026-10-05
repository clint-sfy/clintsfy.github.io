---
title: Maven、JUnit 与日志工程
date: 2026-09-22T00:00:00.000Z
category: Java基础快速入门
tags:
  - Java
  - Maven
  - JUnit
  - 日志
description: 用 Maven 管理依赖与生命周期，使用 JUnit 和日志建立可验证的工程闭环。
---

# Maven、JUnit 与日志工程

## 学习目标

- 读写 pom.xml、坐标、依赖范围、生命周期和多模块构建。
- 用 JUnit 5 编写单元、参数化、异常和集成测试。
- 通过 SLF4J 门面、结构化字段和日志级别建立可观测性。

## 核心知识点

Maven 坐标由 groupId、artifactId、version 组成，依赖树和 dependencyManagement 用来治理版本；生命周期阶段通常经历 validate、compile、test、package、verify、install。测试应隔离时间、网络和数据库，优先验证公开行为。JUnit 5 的 `@Test`、`@ParameterizedTest`、`assertThrows` 和扩展机制覆盖主要场景。日志用 SLF4J API，避免字符串拼接和敏感信息，使用请求 ID、级别与结构化参数。

## 常用用法

### Maven 生命周期：运行测试与工程校验

在项目根目录先运行测试，再执行包含集成检查的验证阶段。

```java
// 说明：Maven 生命周期：运行测试与工程校验 的具体调用为 String[] lifecycle = {"mvn", "test", "&&", "mvn", "verify"};
String[] lifecycle = {"mvn", "test", "&&", "mvn", "verify"};
// 作用：String[] lifecycle = {"mvn", "test", "&&", "mvn", "verify"};；运行测试与工程校验。
// 初始状态：lifecycle = {"mvn", "test", "&&", "mvn", "verify"}。
System.out.println(String.join(" ", lifecycle));
// 输出：构建成功时显示 BUILD SUCCESS，失败时进程返回非零退出码。
// 命令：mvn test
// 命令：mvn verify
```

### `@Test`：声明单元测试

用 `@Test` 标记可由 JUnit 5 独立执行的测试方法。

```java
// 说明：@Test：声明单元测试 的具体调用为 class PriceTest {
import static org.junit.jupiter.api.Assertions.assertEquals;
import org.junit.jupiter.api.Test;

class PriceTest {
    @Test
// 初始状态：@Test。
// 作用：@Test；声明单元测试。
    void totalsTwoItems() {
        assertEquals(30, 10 + 20);
    }
}
// 输出：断言成立，测试通过。
```

### `assertThrows`：验证异常路径

用 `assertThrows` 同时验证异常类型并取得异常对象供后续断言。

```java
// 说明：assertThrows：验证异常路径 的具体调用为 var error = assertThrows(IllegalArgumentException.class,
import static org.junit.jupiter.api.Assertions.assertThrows;

var error = assertThrows(IllegalArgumentException.class,
        () -> Integer.parseInt("x"));
// 初始状态：() -> Integer.parseInt("x"))。
// 初始状态：error = assertThrows(IllegalArgumentException.class,。
// 作用：var error = assertThrows(IllegalArgumentException.class,；验证异常路径。
// 输出：error 的类型是 NumberFormatException。
```

### SLF4J 参数化日志：记录结构化上下文

用占位符记录业务字段，避免不必要的字符串拼接并保留日志上下文。

```java
// 说明：SLF4J 参数化日志：记录结构化上下文 的具体调用为 logger.info("order accepted, orderId={}", orderId);
logger.info("order accepted, orderId={}", orderId);
// 初始状态：orderId = {}", orderId)。
// 作用：logger.info("order accepted, orderId={}", orderId);；记录结构化上下文。
// 输出：INFO order accepted, orderId=42（前提：orderId 为 42 且 INFO 级别已启用）。
```

### `@PreDestroy`：在容器销毁前释放资源

容器管理的 Bean 可用它声明关闭回调；不要依赖它处理必须立即提交的业务数据。

```java
// 说明：@PreDestroy：在容器销毁前释放资源 的具体调用为 class Worker {
import jakarta.annotation.PreDestroy;
class Worker {
    private boolean closed;
    @PreDestroy void close() { closed = true; }
// 初始状态：closed = true; }。
// 作用：@PreDestroy void close() { closed = true; }；在容器销毁前释放资源。
    boolean isClosed() { return closed; }
}
// 结果：Spring/Jakarta 容器销毁 Worker 前调用 close()
```

### `@Resource`：按名称或类型注入依赖

它是 Jakarta 标准注解；显式指定 `name` 可把注入点与 Bean 名称对齐。

```java
// 说明：@Resource：按名称或类型注入依赖 的具体调用为 class ReportService {
import jakarta.annotation.Resource;
class ReportService {
    @Resource(name = "auditClock")
// 初始状态：name = "auditClock")。
// 作用：@Resource(name = "auditClock")；按名称或类型注入依赖。
    java.time.Clock clock;
    long now() { return clock.millis(); }
// 作用：long now() { return clock.millis(); }；按名称或类型注入依赖。
// 初始状态：long now() { return clock.millis(); 。
}
// 结果：容器把名为 auditClock 的 Bean 注入 clock
```

### `Charset.forName`：按规范名称查找字符集

名称来自外部配置时可能抛出不支持异常；固定 UTF-8 优先使用 `StandardCharsets.UTF_8`。

```java
// 说明：Charset.forName：按规范名称查找字符集 的具体调用为 Charset utf8 = Charset.forName("UTF-8");
import java.nio.charset.Charset;
Charset utf8 = Charset.forName("UTF-8");
// 初始状态：utf8 = Charset.forName("UTF-8")。
// 作用：Charset utf8 = Charset.forName("UTF-8");；按规范名称查找字符集。
System.out.println(utf8.name());
// 输出：UTF-8
System.out.println(utf8.equals(Charset.forName("utf8")));
// 输出：true
System.out.println(utf8.newEncoder().canEncode('中'));
// 输出：true（第2次输出）
```

### `Charset.defaultCharset`：读取平台默认字符集

默认值由运行环境决定，协议与持久化格式不应依赖它。

```java
// 说明：Charset.defaultCharset：读取平台默认字符集 的具体调用为 Charset current = Charset.defaultCharset();
import java.nio.charset.Charset;
Charset current = Charset.defaultCharset();
// 初始状态：current = Charset.defaultCharset()。
// 作用：Charset current = Charset.defaultCharset();；读取平台默认字符集。
System.out.println(current != null);
// 输出：true
System.out.println(current.name().isBlank());
// 输出：false
System.out.println(Charset.isSupported(current.name()));
// 输出：true（第2次输出）
```

### `Random.nextInt`：生成有上界的伪随机整数

`nextInt(bound)` 返回 `[0, bound)`；它不适合密码、令牌等安全用途。

```java
// 说明：Random.nextInt：生成有上界的伪随机整数 的具体调用为 var random = new Random(42);
import java.util.Random;
var random = new Random(42);
// 作用：var random = new Random(42);；生成有上界的伪随机整数。
// 初始状态：random = new Random(42)。
int value = random.nextInt(10);
// 初始状态：value = random.nextInt(10)。
// 作用：int value = random.nextInt(10);；生成有上界的伪随机整数。
System.out.println(value >= 0);
// 输出：true
System.out.println(value < 10);
// 输出：true（第2次输出）
System.out.println(value);
// 输出：0
```

### `UUID.randomUUID`：生成随机 UUID

它适合非连续标识符；文本形式固定为带连字符的 36 个字符。

```java
// 说明：UUID.randomUUID：生成随机 UUID 的具体调用为 UUID id = UUID.randomUUID();
import java.util.UUID;
UUID id = UUID.randomUUID();
// 初始状态：id = UUID.randomUUID()。
// 作用：UUID id = UUID.randomUUID();；生成随机 UUID。
System.out.println(id.version());
// 输出：版本 4
System.out.println(id.toString().length());
// 输出：长度 36
System.out.println(UUID.fromString(id.toString()).equals(id));
// 输出：true
```

把一个 Java 程序改成 Maven 项目：配置编译版本、测试插件和 Checkstyle；为核心服务补单元测试、参数化测试和一个集成测试，加入带请求 ID 的日志，并用 `mvn test`、`mvn verify` 验证。

## 易错点

- 依赖版本漂移或把运行时依赖误设为 test scope。
- 测试共享静态状态、真实网络和系统时间，导致偶发失败。
- 捕获异常后只打印 message，丢失堆栈与上下文。
- 在日志中输出密码、令牌、个人信息和完整请求体。

## 复习清单

- [ ] 能通过 dependency:tree 定位依赖冲突。
- [ ] 能为正常、边界、异常和集成路径分层测试。
- [ ] 能制定日志级别、字段、脱敏和采样规则。

