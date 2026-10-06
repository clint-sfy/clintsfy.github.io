---
title: Testcontainers 集成测试
date: 2026-10-05
category: Java后端工程
tags: [Java, Testcontainers, MySQL, Redis]
description: 用可管理生命周期的真实依赖验证数据库方言、迁移、客户端连接和测试清理。
---

# Testcontainers 集成测试

## 学习目标

- 能启动独立 MySQL/Redis 并把动态地址交给 Spring。
- 能让迁移、初始数据、测试事务与清理形成明确顺序。
- 能区分端口开放、服务就绪和业务就绪，报告 CI 环境限制。

## 核心知识点

Testcontainers 管理 Docker 容器，不提供数据库语义的替身。随机宿主端口避免并行测试争用，测试应读 `getHost()` 和 `getMappedPort()`，不能把地址写死为 localhost:3306。MySQL 真实实例可以发现 H2 看不出的方言、索引和锁行为；Redis 真实实例才能验证序列化和连接配置。

本文使用 JDK 20、Spring Boot 3.4、JUnit 5、Testcontainers 1.20.x 的 API，依赖 `org.testcontainers:junit-jupiter`、`mysql`、Connector/J；Boot 集成另需 test scope `spring-boot-testcontainers`。Testcontainers 2.x 模块名和包迁移需独立核对，不能混装 BOM。MySQL 镜像使用 8.0；Redis 使用经过团队验证的稳定主版本（教学示例为 7），CI 应锁定具体镜像 digest，避免浮动标签改变测试。依据：[Jupiter 生命周期](https://java.testcontainers.org/test_framework_integration/junit_5/)、[MySQL 模块](https://java.testcontainers.org/modules/databases/mysql/)、[Boot 连接集成](https://docs.spring.io/spring-boot/reference/testing/testcontainers.html)。

运行顺序是 Docker 可用 → 容器就绪 → 注册地址 → Boot 启动 → Flyway 迁移 → 初始化独立数据 → 断言 → 清理 → 停止。自动回滚只保护测试线程内受同一事务管理器控制的写入，不能清理 Redis、服务器线程或异步任务。以下示例未执行真实 Docker 集成；代码所述结果是运行时必须检查的断言，不是已发生的成功记录。

## 常用用法

### `@Testcontainers`：声明 Jupiter 管理生命周期

用途：用于让扩展自动启动并停止测试容器，避免测试异常后资源无人管理。

```java
// 初始状态：Docker engine 可达，测试方法前尚未启动 Redis 容器。
@org.testcontainers.junit.jupiter.Testcontainers
class RedisLifecycleTest {
    @org.testcontainers.junit.jupiter.Container
    static final org.testcontainers.containers.GenericContainer<?> redis =
        new org.testcontainers.containers.GenericContainer<>(
            org.testcontainers.utility.DockerImageName.parse("redis:7"))
            .withExposedPorts(6379);
    @org.junit.jupiter.api.Test
    void extensionStartedRedis() {
        // 关键变化：static @Container 在测试类前启动，类后停止。
        org.junit.jupiter.api.Assertions.assertTrue(redis.isRunning());
    }
}
// 结果：运行时 redis.isRunning() 必须为 true；实例字段容器则每个方法启动/停止。
```

static 只是在本测试类共享，不等于跨 JVM 复用。共享实例仍要隔离数据。`withReuse(true)` 是实验性本地加速机制，需要显式环境启用，不适合默认 CI；复用保留旧数据和配置，可能让迁移或清理测试失真。Jupiter 扩展并行执行有支持限制，遵循锁定版本说明并用独立容器/数据范围。

### `MySQLContainer`：使用真实 MySQL 8.0

用途：用于获得随机端口、JDBC URL 和就绪检测，让测试跑在实际 MySQL 方言上。

```java
// 初始状态：测试独占 lesson 数据库，固定密码只用于可丢弃的容器。
try (org.testcontainers.containers.MySQLContainer<?> mysql =
        new org.testcontainers.containers.MySQLContainer<>("mysql:8.0")
            .withDatabaseName("lesson").withUsername("test").withPassword("test-only")) {
    mysql.start();
    // 关键变化：容器就绪后 URL 包含实际随机宿主端口，不采用生产凭据。
    try (java.sql.Connection connection = java.sql.DriverManager.getConnection(
            mysql.getJdbcUrl(), mysql.getUsername(), mysql.getPassword());
         java.sql.Statement query = connection.createStatement();
         java.sql.ResultSet rows = query.executeQuery("SELECT 1")) {
        org.junit.jupiter.api.Assertions.assertTrue(rows.next());
        org.junit.jupiter.api.Assertions.assertEquals(1, rows.getInt(1));
        // 结果：真实 SQL 返回 1；退出 try 后连接和容器都关闭。
    }
}
```

不要覆盖模块的 wait strategy 为简单 sleep。模块启动成功仍不代表应用 schema 已迁移；启动后运行与生产一致的 Flyway migrations，再用业务查询验证表、约束和初始化状态，参见[数据库迁移](/courses/java/12-工程实践/03-Flyway数据库迁移)。

### `GenericContainer`：为 Redis 获取真实地址

用途：用于启动没有专用模块要求的服务，并把动态连接信息交给真实客户端。

```java
// 初始状态：Redis 容器尚未启动，6379 是容器端口而非固定宿主端口。
try (org.testcontainers.containers.GenericContainer<?> redis =
        new org.testcontainers.containers.GenericContainer<>(
            org.testcontainers.utility.DockerImageName.parse("redis:7"))
            .withExposedPorts(6379)) {
    redis.start();
    String host = redis.getHost();
    int port = redis.getMappedPort(6379);
    // 关键变化：port 由 Docker 分配，客户端必须用 host/port 组合。
    org.junit.jupiter.api.Assertions.assertFalse(host.isBlank());
    org.junit.jupiter.api.Assertions.assertTrue(port > 0);
    // 结果：地址可配置给 Lettuce；这里没有声称验证 PING/序列化成功。
}
```

Redis 测试使用唯一前缀 `test:<run-id>:`，在 finally 中只清理自己创建的已知键，不用清空共享实例。连接、命令、序列化的完整测试安排在第 15 章《RedisTemplate 序列化与连接管理》，规范路径为 `/courses/java/15-Redis/13-RedisTemplate序列化与连接管理`；该后续章节上线后再提供可点击入口。

### `@DynamicPropertySource`：注入动态连接属性

用途：用于在 Spring 测试上下文刷新前提供容器地址，避免应用抢先连接默认数据库。

```java
// 初始状态：@Container 的 static MySQL 在扩展控制下启动，测试不是生产 profile。
@org.springframework.boot.test.context.SpringBootTest
@org.testcontainers.junit.jupiter.Testcontainers
class DatabaseBootTest {
    @org.testcontainers.junit.jupiter.Container
    static final org.testcontainers.containers.MySQLContainer<?> mysql =
        new org.testcontainers.containers.MySQLContainer<>("mysql:8.0");
    @org.springframework.test.context.DynamicPropertySource
    static void properties(org.springframework.test.context.DynamicPropertyRegistry registry) {
        registry.add("spring.datasource.url", mysql::getJdbcUrl);
        registry.add("spring.datasource.username", mysql::getUsername);
        registry.add("spring.datasource.password", mysql::getPassword);
        // 关键变化：属性 supplier 指向这个测试的 MySQL，随后 Boot/Flyway 使用同一资源。
    }
    @org.junit.jupiter.api.Test
    void containerIsAvailable() { org.junit.jupiter.api.Assertions.assertTrue(mysql.isRunning()); }
}
// 结果：连接属性来自容器；实际 schema/业务成功仍需 JDBC 或 Mapper 断言。
```

缓存的 Spring context 可能继续使用旧地址。继承测试类如果修改动态属性或容器实例，应核对 context 缓存生命周期，必要时用 `@DirtiesContext`；不要只为省时间共享已经停止的容器。

### `@ServiceConnection`：让 Boot 提供连接细节

用途：用于在支持的 Boot 版本中由容器类型生成 ConnectionDetails，减少手写属性错误。

```java
// 初始状态：工程含 spring-boot-testcontainers，Boot 3.1+ 支持 service connection。
@org.springframework.boot.test.context.SpringBootTest
@org.testcontainers.junit.jupiter.Testcontainers
class ServiceConnectionTest {
    @org.testcontainers.junit.jupiter.Container
    @org.springframework.boot.testcontainers.service.connection.ServiceConnection
    static final org.testcontainers.containers.MySQLContainer<?> mysql =
        new org.testcontainers.containers.MySQLContainer<>("mysql:8.0");
    @org.junit.jupiter.api.Test
    void mysqlWasStarted() { org.junit.jupiter.api.Assertions.assertTrue(mysql.isRunning()); }
    // 关键变化：Boot 根据 MySQLContainer 创建 JDBC ConnectionDetails。
}
// 结果：无需再为同一连接写 DynamicPropertySource；迁移仍由应用配置驱动。
```

GenericContainer 无法仅凭 Java 类型识别服务时需要 `@ServiceConnection(name="redis")`；不要把 name 当数据库名。连接细节通常优先于普通属性，选一种配置方式并验证真正连到测试实例。

### `Wait.forListeningPort`：区分端口和业务就绪

用途：用于给通用容器声明端口就绪条件，避免固定 sleep 掩盖启动速度变化。

```java
// 初始状态：Docker 可用；端口监听只是网络层条件，不证明 Redis 命令可成功。
try (org.testcontainers.containers.GenericContainer<?> redis =
        new org.testcontainers.containers.GenericContainer<>(
            org.testcontainers.utility.DockerImageName.parse("redis:7"))
            .withExposedPorts(6379)
            .waitingFor(org.testcontainers.containers.wait.strategy.Wait.forListeningPort())
            .withStartupTimeout(java.time.Duration.ofSeconds(60))) {
    redis.start();
    // 关键变化：start 最多等待配置启动预算，超时导致测试失败而非继续连接。
    org.junit.jupiter.api.Assertions.assertTrue(redis.isRunning());
    // 结果：容器运行且端口监听；客户端认证和 PING 仍需单独断言。
}
```

## 易混点

容器就绪不等于应用就绪，应用就绪还要求迁移完成、客户端可访问和测试数据存在。`withInitScript` 适合明确的测试初始化，不应替代验证生产 Flyway 链。数据清理应按外键顺序、限定测试行范围并检查影响数；共享数据库或容器禁止大范围删除。

CI 必须提供兼容 Docker API、镜像拉取权限、可达端口和足够内存；镜像缓存加速但不能掩盖版本。默认不要挂载生产凭据或 Docker socket 到不可信应用容器。记录拉取、启动、迁移三类失败；本机没有 engine 时报告环境失败，不将跳过视为集成通过。

## 课后小问

1. 为什么不写 localhost:3306？答案：随机端口且 Docker 可能远程运行。解析：使用 getHost/getMappedPort 或模块 JDBC URL。
2. static 容器保证数据隔离吗？答案：不保证。解析：类内共享生命周期，方法仍需独立数据和清理。
3. 如何证明迁移成功？答案：执行迁移后查 history、约束和业务数据。解析：只断言容器 isRunning 证据不足。

## 本节小结

真实依赖让测试能够验证方言和配置；生命周期、地址、schema 与数据清理决定它是否可重复。执行证据必须与 Docker 环境状态分开报告。

## 快速回顾

锁定 BOM/镜像 → Docker 检查 → 生命周期与 wait → 动态地址 → Flyway → 业务断言 → 限定数据清理 → 停止容器 → 保存 CI 失败日志。
