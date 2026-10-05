---
title: HikariCP 与多数据源
date: 2026-10-05
category: Java基础快速入门
tags: [Java, HikariCP, Spring, 数据源, 连接池]
description: 配置和观测 JDBC 连接池，理解多数据源路由与 Spring 事务的连接边界。
---

# HikariCP 与多数据源

## 学习目标

- 按负载测量连接池容量与超时，而非套用固定数字。
- 通过指标识别等待、连接生命周期和疑似泄漏。
- 设计数据源路由上下文、只读副本策略和事务连接边界。

## 核心知识点

JDBC `DataSource` 是连接池可替换的统一入口，[JDBC 文章](/courses/java/12-工程实践/02-JDBC与事务)介绍连接、事务和状态清理。本篇以 HikariCP 官方文档和 Spring Framework 事务文档为依据，实际依赖版本由 Spring Boot BOM 或构建依赖管理固定，不把 Hikari 某个补丁版本当规范。

池容量是数据库连接预算的一部分：所有应用实例、后台作业和管理工具的连接上限要合并核算。MySQL 端连接限制、服务端 wait timeout 和代理/防火墙空闲连接限制应与客户端超时和连接寿命一起规划。连接归还前结束事务并清理应用设置；Hikari 会处理 JDBC 可识别的部分状态，但任意 session SQL 或应用共享状态不能想当然地自动复位。

Spring `AbstractRoutingDataSource` 根据每次获取连接时的 lookup key 选择目标数据源。Spring JDBC 事务管理通常会把一个连接绑定到当前线程；同一事务开始后更改 ThreadLocal 路由键，并不会把已经绑定的物理连接切换到另一库。读写路由必须在事务获取连接前决定，并避免以注解顺序猜测实际路由。

## 常用用法

### HikariConfig.setJdbcUrl：建立显式 DataSource

用于将 URL、凭据和池策略集中配置为 `DataSource`，凭据从秘密存储注入。

```java
// 外部依赖：com.zaxxer:HikariCP，由应用的依赖管理固定版本。
HikariConfig config = new HikariConfig();
config.setJdbcUrl(System.getenv("MYSQL_JDBC_URL"));
config.setUsername(System.getenv("MYSQL_USER"));
config.setPassword(System.getenv("MYSQL_PASSWORD"));
config.setPoolName("orders-primary");
config.setMaximumPoolSize(12); // 仅示例值，须按压测和数据库总连接预算调整。
// 关键变化：使用配置创建DataSource，池启动并向调用者提供连接。
try (HikariDataSource dataSource = new HikariDataSource(config);
     Connection connection = dataSource.getConnection()) {
    // 初始：池启动且 URL 指向隔离实验库。
    try (Statement statement = connection.createStatement();
         ResultSet result = statement.executeQuery("SELECT 1")) {
        result.next();
        System.out.println(result.getInt(1));
        // 输出：1；退出块后连接归池，关闭DataSource结束池生命周期。
    }
}
```

Spring Boot 应用一般通过配置属性和自动配置创建池，不要又手工 new 一套生命周期重叠的池。关闭 `HikariDataSource` 会关闭池，不应对每次请求创建池。

### HikariConfig.setMaximumPoolSize：maximumPoolSize 限制总连接数

用于限制池内空闲与借出连接总数，形成清楚的数据库并发预算。

```java
// 初始状态：HikariConfig默认maximumPoolSize为10，单实例数据库预算尚待压测确认。
System.out.println(config.getMaximumPoolSize());
// 输出：10。
config.setMaximumPoolSize(12);
System.out.println(config.getMaximumPoolSize());
// 输出：12。
// 关键变化：配置上限从10增至12；启动DataSource后实际连接数按负载建立。
// 可观察结果：maximumPoolSize getter返回12；压测记录活跃/空闲/等待线程和吞吐延迟。
```

12 只是展示参数，不是推荐值。依据真实 SQL 持有时长、并发、数据库吞吐与所有实例数测量；更大的池可能增加数据库争用而降低吞吐。[HikariCP pool sizing](https://github.com/brettwooldridge/HikariCP/wiki/About-Pool-Sizing)。

### HikariConfig.setMinimumIdle：minimumIdle 控制保留空闲连接

用于在弹性池中表达期望保留的空闲连接数；默认与最大连接数相同会形成固定尺寸池。

```java
// 初始状态：maximumPoolSize=12，因此minimumIdle默认也是12；已有测量显示可尝试弹性池。
config.setMaximumPoolSize(12);
config.setMinimumIdle(12);
config.setMinimumIdle(3);
System.out.println(config.getMinimumIdle());
// 输出：3。
// 关键变化：低峰期池尽力保留3条空闲连接；需求上升时仍可增长到12。
// 可观察结果：minimumIdle getter返回3；监控低峰空闲数、建连耗时和高峰等待。
```

若追求对突发的响应，固定尺寸可能更合适；弹性空闲配置是否有益要用连接建立成本和数据库预算验证。[HikariCP configuration](https://github.com/brettwooldridge/HikariCP)。

### HikariConfig.setConnectionTimeout：connectionTimeout 限制借连接等待

用于限制没有可用池连接时调用 `getConnection()` 的等待时间。

```java
// 初始状态：HikariConfig.connectionTimeout为默认30000毫秒，maximumPoolSize已测量为12。
config.setConnectionTimeout(30_000);
config.setConnectionTimeout(1500);
// 关键变化：配置预算从30000毫秒缩短为1500毫秒。
// 可观察结果：DataSource启动后，12条连接全忙时，新借用最多等待1500毫秒；这不取消已运行SQL。
System.out.println(config.getConnectionTimeout());
// 输出：1500。
```

把池等待预算纳入请求端到端超时，并区分 SQL 执行、驱动网络、负载均衡器和服务端超时。过短会在正常瞬时峰值时拒绝，过长会占住业务线程。

### HikariConfig.setValidationTimeout：validationTimeout 限制连接存活探测

用于限制连接健康验证时间；必须小于 `connectionTimeout`，且 HikariCP 有允许的最小值。

```java
// 初始状态：connectionTimeout=30000毫秒，当前validationTimeout为5000毫秒。
config.setValidationTimeout(700);
// 关键变化：validationTimeout从5000毫秒缩短为700毫秒，仍小于connectionTimeout。
// 可观察结果：记录验证失败与连接创建失败，结合数据库握手告警区分网络和池排队。
System.out.println(config.getValidationTimeout());
// 输出：700。
```

数值只是有约束的示例，核对锁定版本参数边界并为网络抖动留出预算。[HikariCP configuration](https://github.com/brettwooldridge/HikariCP)。

### HikariConfig.setIdleTimeout：idleTimeout 管理空闲连接回收

用于允许弹性池在空闲一段时间后收缩，不作用于正在使用的连接。

```java
// 初始状态：minimumIdle=3、maximumPoolSize=12，当前idleTimeout为600000毫秒。
config.setIdleTimeout(420_000);
// 关键变化：idleTimeout从600000毫秒调整为420000毫秒，池可回收超过minimumIdle的连接。
// 可观察结果：低峰监控空闲连接数与之后的重新建连延迟。
System.out.println(config.getIdleTimeout());
// 输出：420000。
```

当 `minimumIdle` 等于 `maximumPoolSize` 时，空闲超时不能使池低于保留数量。服务端空闲超时也会影响连接，不能仅依赖客户端回收。

### HikariConfig.setMaxLifetime：maxLifetime 错开连接最大寿命

用于让池在连接达到配置寿命时逐步淘汰并替换，避免复用已接近基础设施上限的连接。

```java
// 初始状态：当前maxLifetime由Hikari默认配置管理，代理设备上限由运维确认。
config.setMaxLifetime(1_500_000);
// 关键变化：maxLifetime设置为1500000毫秒，并留在代理连接寿命上限以内。
// 可观察结果：观测连接创建/关闭速率和短暂空闲连接失败，确认轮换不制造尖峰。
System.out.println(config.getMaxLifetime());
// 输出：1500000。
```

示例寿命并非通用推荐值。需比数据库、代理或防火墙施加的上限短一些；过短会产生不必要的连接抖动。[HikariCP configuration](https://github.com/brettwooldridge/HikariCP)。

### HikariConfig.setKeepaliveTime：keepaliveTime 探测空闲连接

用于在连接寿命内定期验证空闲连接，避免网络中间设备默默清理导致下次借用失败。

```java
// 初始状态：maxLifetime=1500000毫秒，网络设备空闲断开预算经测量为数分钟。
config.setKeepaliveTime(120_000);
// 关键变化：keepaliveTime设置为120000毫秒，且小于maxLifetime。
// 可观察结果：比较借用时首次失败率和探测日志，确认额外探测成本可接受。
System.out.println(config.getKeepaliveTime());
// 输出：120000。
```

**危险边界：**配置不能修复不稳定网络；keepalive 仅对空闲连接工作，周期受最小值和 `maxLifetime` 约束，需按已锁定 Hikari 版本文档设置。[HikariCP configuration](https://github.com/brettwooldridge/HikariCP)。

### HikariConfig.setLeakDetectionThreshold：leakDetectionThreshold 定位未归还连接

用于在连接借出超过阈值时记录疑似泄漏线索，不会中止使用者或自动修复泄漏。

```java
// 初始状态：测试池的leakDetectionThreshold为0，即未启用疑似泄漏检测。
config.setLeakDetectionThreshold(30_000);
// 关键变化：leakDetectionThreshold从0改为30000毫秒。
// 可观察结果：核对线程栈与业务追踪；日志报告连接稍后归还时应重新判断是否只是长事务。
System.out.println(config.getLeakDetectionThreshold());
// 输出：30000。
```

**危险边界：**过低阈值会把合法长事务误报为泄漏并产生噪音；日志可能含类名和代码位置，按组织日志策略处理。它是诊断开关，不是超时或池回收机制。[HikariCP configuration](https://github.com/brettwooldridge/HikariCP)。

### HikariPoolMXBean.getActiveConnections：观测池压力与指标

用于读取活动、空闲、总连接和等待线程等运行状态，并配合指标系统告警。

```java
// 初始状态：dataSource 是已启动的 HikariDataSource，并有唯一 poolName。
HikariPoolMXBean pool = dataSource.getHikariPoolMXBean();
// 关键变化：读取4项实际池计数，形成一次瞬时观测。
System.out.printf("active=%d idle=%d total=%d waiting=%d%n",
    pool.getActiveConnections(), pool.getIdleConnections(),
    pool.getTotalConnections(), pool.getThreadsAwaitingConnection());
// 输出：实际活动数、空闲数、总数、等待线程数。
// 关键变化：观测池当前快照，不修改池和数据库。
```

快照可能在读取后立即变化，不能用于精确并发控制。为每个池配置稳定名称，通过 Spring Boot Actuator/Micrometer 或 JMX 采集等待、活跃、空闲、超时和建连情况，并结合数据库侧连接数观察。[HikariCP metrics](https://github.com/brettwooldridge/HikariCP/wiki/Metrics)。

### Connection.setAutoCommit：按 JDBC 生命周期归还连接

用于在借用期间结束事务并还原应用改变的 JDBC 状态。

```java
// 初始状态：应用拥有借出的Connection，autoCommit为true，业务确认归自己管理。
boolean originalAutoCommit = connection.getAutoCommit();
boolean ended = false;
SQLException failure = null;
try {
    connection.setAutoCommit(false);
    // 执行业务SQL；成功路径明确提交。
    connection.commit();
    ended = true;
} catch (SQLException error) {
    failure = error;
    try { connection.rollback(); ended = true; }
    catch (SQLException rollbackError) { error.addSuppressed(rollbackError); }
    throw error;
} finally {
    if (ended) {
        try {
            connection.setAutoCommit(originalAutoCommit);
            System.out.println(connection.getAutoCommit());
            // 输出：true，确认事务结束后恢复到借用时状态。
        } catch (SQLException resetError) {
            if (failure != null) failure.addSuppressed(resetError);
            else throw resetError;
        }
    }
    // 关键变化：结束状态不确定时不复位；Hikari集成须在归还前淘汰该连接。
}
```

示例用于展示生命周期，不可替代完整异常安全清理：若 rollback 或 reset 失败，须保留原失败并从池淘汰状态未知的连接。不要在 Spring 管理的事务里自行提交、回滚或切换 autoCommit。`SET` 修改的会话变量、临时表和应用设置不一定属于池可自动恢复的 JDBC 状态；避免跨请求遗留。

### AbstractRoutingDataSource.determineCurrentLookupKey：按上下文选择连接池

用于将逻辑数据源路由到预先配置的多个目标 `DataSource`。

```java
enum DbRoute { PRIMARY, REPLICA }
final class DbRouteContext {
    private static final ThreadLocal<DbRoute> ROUTE = new ThreadLocal<>();
    static DbRoute current() { return ROUTE.get(); }
    static void set(DbRoute route) { ROUTE.set(route); }
    static void clear() { ROUTE.remove(); }
}
final class ReadWriteDataSource extends AbstractRoutingDataSource {
    @Override protected Object determineCurrentLookupKey() {
        return DbRouteContext.current();
    }
    // 输出：空键使用配置的默认primary，REPLICA键选择replicaPool。
}
```

初始状态：`DbRouteContext.current()` 为 `null`，空键默认指向 primary；设置 `REPLICA` 后，新获取连接的目标变为 replica。

外部依赖为 `org.springframework:spring-jdbc`（通常由 Spring Boot BOM 管理）。初始状态上下文为空，配置映射为 `PRIMARY -> primaryPool` 且默认 primary；进入读流程前设置 `REPLICA`，调用路由 DataSource 获取连接会选 replica。测试以两个记录连接来源的 stub DataSource 断言空键选 primary、显式键选预期池，不连接真实库。[Spring AbstractRoutingDataSource API](https://docs.spring.io/spring-framework/docs/current/javadoc-api/org/springframework/jdbc/datasource/lookup/AbstractRoutingDataSource.html)。

路由上下文应在 `try/finally` 清理：

```java
// 初始状态：请求线程尚无路由键。
assert DbRouteContext.current() == null;
DbRouteContext.set(DbRoute.REPLICA);
try {
    return repository.findForDisplay();
} finally {
    // 关键变化：即使查询抛错也移除ThreadLocal，避免线程池复用串到下一请求。
    DbRouteContext.clear();
}
// 输出：成功/异常分支退出后，DbRouteContext.current()均为null。
```

绝不要依赖 ThreadLocal 在线程结束自动消失；应用线程通常会复用。异步任务必须显式传播受控上下文或默认走主库，不能随意跨线程继承路由状态。未知 lookup key 应明确配置 fallback 策略，避免静默路由至意外库。

### @Transactional：transaction pinning 在事务前完成路由

用于理解为什么当前事务里修改路由键不会安全切换到另一个库。

```java
// 初始状态：事务拦截器进入方法，事务管理器绑定了primary DataSource连接。
@Transactional(readOnly = true)
public Account loadAccount(long id) {
    // 事务已开始后再设REPLICA，后续仍可能复用已绑定的primary连接。
    // 关键变化：lookup key改变，但当前线程绑定的Connection目标不随之改变。
    DbRouteContext.set(DbRoute.REPLICA);
    Account account = repository.findById(id);
    System.out.println(connectionProbe.ownerOfBoundConnection());
    // 输出：primary。
    return account;
}
```

路由拦截器與事务 advisor 的先后次序会决定获取连接时看到的键；不要假设 `@Transactional(readOnly=true)` 自动表示只读副本路由。需要在事务 advice 外先设置并清理路由，或通过明确的事务管理器/服务方法选择数据源；用集成测试记录实际连接目标。[Spring 事务 AOP](https://docs.spring.io/spring-framework/reference/data-access/transaction/declarative/tx-decl-explained.html)、[`@Transactional` advisor order](https://docs.spring.io/spring-framework/reference/data-access/transaction/declarative/annotations.html)。

### UPDATE：read-your-writes 考虑副本复制延迟

用于在写入后保证当前用户马上能读到新状态时选择合适的数据源。

```sql
-- 初始状态：primary写入账户余额100；replica尚未应用该事务。
UPDATE account SET balance = 100 WHERE id = 7;
-- 关键变化：primary提交成功，但复制存在延迟。
SELECT balance FROM account WHERE id = 7;
-- 输出：replica延迟时可能读到旧值；read-your-writes路径在规定窗口读primary。
```

读写分离是一致性策略，不只是负载平衡。定义哪些请求需强读、强读持续窗口和超时退化行为；不要为获取旧副本的暂时优势而破坏业务不变量。MySQL 事务隔离与锁的语义见[MySQL 事务章节](/courses/java/11-MySQL-8/09-事务MVCC隔离级别与锁)。

### flyway.migrate：migrations per DataSource 逐个目标库维护 schema

用于明确多个独立库各自的迁移位置、凭据、历史和部署结果。

```shell
# 初始状态：primary 与 analytics 是不同 schema，各有独立账号和 migration history。
flyway -url="$PRIMARY_URL" -locations=filesystem:db/primary migrate
flyway -url="$ANALYTICS_URL" -locations=filesystem:db/analytics migrate
# 关键变化：primary和analytics各自的迁移版本从pending变为success。
# 输出：CI 分别记录数据库身份、当前版本、校验结果和部署状态。
echo "primary and analytics migrations recorded separately"
```

迁移工作流不可因运行时路由恰好选择了某库就隐式执行。为每个 DataSource 配置唯一迁移所有者，验证凭据最小权限、位置映射与部分失败补偿；跨库迁移通常不是一个原子事务。

### HikariPoolMXBean.getTotalConnections：health and metrics 按池告警

用于结合应用健康端点和池指标发现数据库连接故障及容量压力。

```java
// 初始状态：dataSource已启动，Actuator/Micrometer注册orders-primary池指标。
HikariPoolMXBean pool = dataSource.getHikariPoolMXBean();
System.out.printf("active=%d idle=%d total=%d waiting=%d%n",
    pool.getActiveConnections(), pool.getIdleConnections(),
    pool.getTotalConnections(), pool.getThreadsAwaitingConnection());
// 输出：实际活动/空闲/总连接/等待线程计数。
// 关键变化：采集池快照供Actuator/Micrometer指标采样，不修改数据库。
```

不要把深度 SQL 探针放进每个健康请求，也不要把指标标签设成 SQL、用户 ID 等高基数字段。为主库和副本分别命名并配置健康、延迟、连接数与错误告警；Actuator 暴露范围受安全边界控制。

## 易混点

- `maximumPoolSize` 是池上限，不是吞吐目标；增大可能加重数据库竞争。
- `connectionTimeout` 管取连接等待，不等于 SQL 或 socket 超时。
- 泄漏阈值只是疑似泄漏日志，长事务也可能触发。
- Hikari 状态重置不能替代应用对事务、session 变量和临时对象的管理。
- 事务获取连接后路由键变化不能改变该事务绑定的物理连接。
- 副本读取可能滞后；路由需满足业务的一致性要求。

## 课后小问

1. 为什么不能从一个应用副本单独推导池大小？
答案：数据库承受所有应用实例和其他客户端的连接总量。
解析：容量还受 SQL 持有时长和数据库吞吐影响，应压测并观察数据库侧负载。

2. 在线程池请求完成后为什么要移除路由 ThreadLocal？
答案：工作线程会复用于其他请求。
解析：不清理会让后续请求错误地访问上一次的数据源。

3. 事务开始后设置 replica 路由为何可能无效？
答案：事务管理器可能已绑定 primary 的连接。
解析：路由发生在 DataSource 获取连接时，路由键不是活动连接的切换命令。

## 本节小结

- 连接池参数按测量配置，统一核算所有实例的连接预算。
- 用池指标和数据库侧观测解释等待、超时与疑似泄漏。
- 连接的事务、JDBC 状态和 session 状态要在借用边界处理。
- 数据源路由在线程上下文中需 finally 清理，并在事务取连接前完成。
- 副本延迟、迁移所有者和健康告警都属于多数据源设计。

## 快速回顾

- `maximumPoolSize`、借用超时和网络/服务端超时共同决定连接行为。
- `maxLifetime`、`keepaliveTime` 与基础设施连接限制一起设定。
- ThreadLocal 路由在所有成功与异常路径清除。
- 事务绑定连接后不能安全中途换库；读写分离需显式定义一致性。
