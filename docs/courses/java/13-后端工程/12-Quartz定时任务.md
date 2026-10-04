---
title: Quartz 定时任务
date: 2026-10-01T00:00:00.000Z
category: Java后端工程
tags:
  - Java
  - Quartz
  - 定时任务
  - 调度
description: 速查 Quartz 的 Job、JobDetail、CronTrigger、misfire、暂停恢复、持久化与失败重试边界。
---

# Quartz 定时任务

## 学习目标

- 能把任务实现为 `Job`，用 `JobDetail`、`Trigger` 和 `Scheduler` 组合出可管理的调度。
- 能写 Quartz Cron 表达式，选择 misfire 策略，暂停/恢复任务并解释错过触发的结果。
- 能用 `@DisallowConcurrentExecution`、JDBCJobStore 和有界重试处理并发、重启与失败边界，并区分 `ScheduledExecutorService`。

## 核心知识点

### 专业术语

- **`Job`**：实现 `execute(JobExecutionContext)` 的一次任务逻辑；Quartz 为每次执行创建 Job 实例，业务状态应放在外部存储或 `JobDataMap` 中。
- **`JobDetail`**：任务定义和身份（`JobKey`）的描述，保存 Job 类、持久化标记和静态数据。
- **`Trigger`/`CronTrigger`**：触发计划；`CronTrigger` 用 Quartz 六字段 Cron 表达式描述日历时间。
- **Scheduler**：调度器，负责线程池、触发状态、暂停恢复和任务执行。
- **misfire**：调度器停机、线程不足或执行过久导致触发错过计划时间后的补偿策略。
- **JDBCJobStore**：把 Job、Trigger 和状态写入数据库表，以支持重启恢复和集群协调。
- **`@DisallowConcurrentExecution`**：按同一 `JobKey` 禁止同一 Job 的并发执行，不是全局互斥锁。

### 白话解释与边界

Quartz 把“任务是什么”和“什么时候触发”分成 `JobDetail` 与 `Trigger`，再由 `Scheduler` 管理生命周期。Cron 触发只负责启动任务，不替代业务幂等、分布式锁或事务；任务执行时间超过下一次触发时，要明确允许重叠、跳过还是排队。

Cron 表达式通常包含秒、分、时、日、月、星期（可选年），`0 0/5 * * * ?` 表示每五分钟的第 0 秒。时区应在 Trigger 上明确设置，不要把服务器默认时区当作协议。misfire 不是“补跑所有历史任务”的保证，应按任务语义选择 `DoNothing`、`FireAndProceed` 或 `IgnoreMisfirePolicy`。

内存 JobStore 适合单进程、可丢失的调度；需要重启恢复或多节点竞争时使用 JDBCJobStore 并准备 Quartz 表、事务和时钟同步。失败重试要限制次数、延迟和幂等键，区分 Quartz 立即 refire、Trigger 下一次触发和业务队列重试。暂停/恢复改变调度状态，不会中断已经执行的 Job。

### 依赖与版本基线

本文按 Java 17、Spring Boot 4.1.0 与 Spring Framework 7 的项目基线组织示例；直接使用 Quartz 时依赖 `org.quartz-scheduler:quartz:2.x`，由 Spring Boot 集成时通常使用 `org.springframework.boot:spring-boot-starter-quartz:4.1.0` 并让 BOM 管理 Quartz patch 版本。Quartz 2.x 使用 `JobBuilder`、`TriggerBuilder` 和 `CronScheduleBuilder`，旧 Quartz 1.x 常见的构造器/`StatefulJob` 写法不能直接照抄；Boot 4 周边 Servlet 配置使用 `jakarta.*`，也不要和旧 `javax.*` 依赖混用。下文的属性键名来自 Quartz 2.x 配置 API，实际数据库方言和 Spring Boot 绑定方式仍要以锁定的依赖版本为准。

## 常用用法

### `JobBuilder.newJob`：创建 JobDetail 构建器

用途：用于从 Job 实现类开始构建具有稳定身份的任务定义。

```java
JobDetail detail = JobBuilder.newJob(CleanupJob.class)
    .withIdentity("cleanup", "maintenance").build();
// 初始状态：detail = JobBuilder.newJob(CleanupJob.class)。
// 作用：JobDetail detail = JobBuilder.newJob(CleanupJob.class)；创建 JobDetail 构建器。
System.out.println(detail.getKey());
// 输出：maintenance.cleanup
// 说明：以 CleanupJob.class 构建 JobDetail，任务键固定为组 maintenance、名称 cleanup，打印 maintenance.cleanup；这里只构造定义，尚未注册 Scheduler。
```

### `TriggerBuilder.newTrigger`：创建 Trigger 构建器

用途：用于创建触发器并显式绑定任务身份与调度规则。

```java
Trigger trigger = TriggerBuilder.newTrigger()
    .withIdentity("cleanup-trigger", "maintenance").forJob(detail).startNow().build();
// 初始状态：trigger = TriggerBuilder.newTrigger()。
// 作用：Trigger trigger = TriggerBuilder.newTrigger()；创建 Trigger 构建器。
System.out.println(trigger.getJobKey());
// 输出：maintenance.cleanup
// 说明：TriggerKey 为 maintenance.cleanup-trigger，forJob(detail) 绑定 JobKey maintenance.cleanup，startNow 表示注册后尽快首次触发。
```

### `CronScheduleBuilder.cronSchedule`：创建 Cron 调度规则

用途：用于把经过校验的 Quartz Cron 表达式转换为调度构建器。

```java
CronScheduleBuilder schedule = CronScheduleBuilder.cronSchedule("0 0 2 * * ?");
// 初始状态：schedule = CronScheduleBuilder.cronSchedule("0 0 2 * * ?")。
// 作用：CronScheduleBuilder schedule = CronScheduleBuilder.cronSchedule("0 0 2 * * ?");；创建 Cron 调度规则。
System.out.println(schedule != null);
// 输出：true
// 说明："0 0 2 * * ?" 表示每天 02:00:00；cronSchedule 解析失败会抛异常，创建 builder 本身还没有向 Scheduler 注册 Trigger。
```

### `CronExpression`：校验 Cron 表达式

用途：用于在保存调度配置前解析并校验 Quartz Cron 表达式。

```java
CronExpression expression = new CronExpression("0 0/5 * * * ?");
// 初始状态：expression = new CronExpression("0 0/5 * * * ?")。
// 作用：CronExpression expression = new CronExpression("0 0/5 * * * ?");；校验 Cron 表达式。
System.out.println(expression.getNextValidTimeAfter(new Date()) != null);
// 输出：true
// 说明："0 0/5 * * * ?" 是 Quartz 六字段表达式，表示每 5 分钟的第 0 秒；getNextValidTimeAfter 从当前 Date 计算下一次触发时间。
```

### `JobDataMap`：构造任务参数映射

用途：用于创建只包含可序列化小型参数的任务数据容器。

```java
JobDataMap data = new JobDataMap();
// 初始状态：data = new JobDataMap()。
// 作用：JobDataMap data = new JobDataMap();；构造任务参数映射。
data.put("batchSize", 100);
// 作用：data.put("batchSize", 100);；构造任务参数映射。
System.out.println(data.getInt("batchSize"));
// 输出：100
// 说明：JobDataMap 以 key=batchSize 保存整数 100，getInt("batchSize") 返回 100；持久化 JobStore 下该值必须可序列化且不应包含服务对象。
```

### `JobDataMap.put`：写入任务参数

用途：用于按明确键写入任务执行所需的轻量参数，避免放入连接或服务对象。

```java
JobDataMap data = new JobDataMap();
// 作用：JobDataMap data = new JobDataMap();；写入任务参数。
// 初始状态：data = new JobDataMap()。
data.put("tenantId", "acme");
// 初始状态：data.put("tenantId", "acme")。
// 作用：data.put("tenantId", "acme");；写入任务参数。
System.out.println(data.getString("tenantId"));
// 输出：acme
// 说明：put("tenantId", "acme") 写入任务参数 tenantId=acme，执行端用同一键 getString 读取；键名是任务数据契约的一部分。
```

### `JobKey.jobKey`：构造任务身份

用途：用于由任务名和组名构造稳定的调度器查找键。

```java
JobKey key = JobKey.jobKey("cleanup", "maintenance");
// 初始状态：key = JobKey.jobKey("cleanup", "maintenance")。
// 作用：JobKey key = JobKey.jobKey("cleanup", "maintenance");；构造任务身份。
System.out.println(key);
// 输出：maintenance.cleanup
// 说明：JobKey.jobKey("cleanup", "maintenance") 构造组 maintenance、名称 cleanup 的身份，toString 输出 maintenance.cleanup，供暂停、恢复和删除精确定位。
```

### `Scheduler.checkExists`：检查任务是否存在

用途：用于在创建或更新前判断指定 JobKey 是否已注册。

```java
boolean exists = scheduler.checkExists(JobKey.jobKey("cleanup", "maintenance"));
// 初始状态：exists = scheduler.checkExists(JobKey.jobKey("cleanup", "maintenance"))。
// 作用：boolean exists = scheduler.checkExists(JobKey.jobKey("cleanup", "maintenance"));；检查任务是否存在。
System.out.println(exists);
// 输出：true 或 false。
// 作用：用于在创建或更新前判断指定 JobKey 是否已注册。
```

### `Scheduler.deleteJob`：删除指定任务

用途：用于显式删除任务及其关联触发器，并检查是否确实找到目标。

```java
boolean deleted = scheduler.deleteJob(JobKey.jobKey("cleanup", "maintenance"));
// 初始状态：deleted = scheduler.deleteJob(JobKey.jobKey("cleanup", "maintenance"))。
// 作用：boolean deleted = scheduler.deleteJob(JobKey.jobKey("cleanup", "maintenance"));；删除指定任务。
System.out.println(deleted);
// 输出：找到并删除时为 true。
// 说明：deleteJob(maintenance.cleanup) 返回 true 表示 JobDetail 及关联 Trigger 已删除，false 表示该 key 不存在；不会撤销已经开始的执行。
```

### `Scheduler.scheduleJob`：注册任务与触发器

用途：用于把 JobDetail 与匹配的 Trigger 原子地交给调度器注册。

```java
Date firstFireTime = scheduler.scheduleJob(detail, trigger);
// 初始状态：firstFireTime = scheduler.scheduleJob(detail, trigger)。
// 作用：Date firstFireTime = scheduler.scheduleJob(detail, trigger);；注册任务与触发器。
System.out.println(firstFireTime != null);
// 输出：true
// 说明：scheduleJob(detail, trigger) 注册 maintenance.cleanup 及其绑定触发器，返回首次计划触发 Date；键冲突通常抛 ObjectAlreadyExistsException。
```

### `Scheduler.pauseJob`：暂停任务触发

用途：用于维护窗口暂时阻止指定任务产生新的触发。

```java
scheduler.pauseJob(JobKey.jobKey("cleanup", "maintenance"));
// 初始状态：scheduler.pauseJob(JobKey.jobKey("cleanup", "maintenance"))。
// 作用：scheduler.pauseJob(JobKey.jobKey("cleanup", "maintenance"));；暂停任务触发。
System.out.println("paused");
// 输出：paused
// 说明：pauseJob(maintenance.cleanup) 阻止该 JobKey 后续触发，但不会中断正在运行的 CleanupJob；恢复时如何处理错过时间由 Trigger 的 misfire 策略决定。
```

### `Scheduler.resumeJob`：恢复任务触发

用途：用于结束维护窗口后恢复指定任务，并遵循既定 misfire 策略。

```java
scheduler.resumeJob(JobKey.jobKey("cleanup", "maintenance"));
// 初始状态：scheduler.resumeJob(JobKey.jobKey("cleanup", "maintenance"))。
// 作用：scheduler.resumeJob(JobKey.jobKey("cleanup", "maintenance"));；恢复任务触发。
System.out.println("resumed");
// 输出：resumed
// 说明：resumeJob(maintenance.cleanup) 重新允许后续触发；暂停期间错过的运行不会无条件全部补跑，而按绑定 Trigger 的 misfire 策略处理。
```

### Job：实现一次执行单元

用途：用于实现一段可被 Quartz 调度的工作，并从 `JobExecutionContext` 读取受控参数、输出稳定结果。

```java
import org.quartz.Job;
import org.quartz.JobExecutionContext;

final class CleanupJob implements Job {
    @Override
    public void execute(JobExecutionContext context) {
        String name = context.getJobDetail().getKey().getName();
// 初始状态：name = context.getJobDetail().getKey().getName()。
// 作用：String name = context.getJobDetail().getKey().getName();；实现一次执行单元，返回读取结果。
        System.out.println("job=" + name + ":done");
// 输出：job=cleanup:done
    }
}

// 作用：用于实现一段可被 Quartz 调度的工作，并从 `JobExecutionContext` 读取受控参数、输出稳定结果。
```

`execute` 运行时可能由 Quartz 工作线程调用，不能依赖请求线程、ThreadLocal 或未传播的 MDC。任务应设置超时、记录关联 ID，并对重复执行和部分成功设计幂等处理；抛出异常要让调度层看见，而不是悄悄吞掉。

### JobDetail：声明身份与数据

用途：用于为 Job 声明稳定的 `JobKey` 和静态参数，方便暂停、恢复、替换和审计。

```java
import org.quartz.JobBuilder;
import org.quartz.JobDetail;

JobDetail detail = JobBuilder.newJob(CleanupJob.class)
    .withIdentity("cleanup", "maintenance")
    .usingJobData("batch", "nightly")
    .storeDurably()
    .build();
// 初始状态：detail = JobBuilder.newJob(CleanupJob.class)。
// 作用：JobDetail detail = JobBuilder.newJob(CleanupJob.class)；声明身份与数据，调用后目标状态更新。

System.out.println(detail.getKey());
// 输出：maintenance.cleanup
// 说明：JobDetail 的 key 为 maintenance.cleanup，JobDataMap 含 batch=nightly，storeDurably 允许它暂时没有 Trigger 仍保留；尚未调用 Scheduler 注册。
```

`JobDataMap` 适合小型、可序列化配置，不适合放大对象、密码或实时状态；持久化 JobStore 会序列化数据，升级类结构时要考虑兼容。JobKey 是运维操作的身份，不要用用户可控文本直接构造未经校验的 key。

### CronTrigger：按日历调度

用途：用于把 `JobDetail` 绑定到明确时区和 Cron 计划，并让 Scheduler 负责后续触发。

```java
import java.time.ZoneId;
import org.quartz.CronScheduleBuilder;
import org.quartz.CronTrigger;
import org.quartz.TriggerBuilder;

CronTrigger trigger = TriggerBuilder.newTrigger()
    .withIdentity("cleanup-trigger", "maintenance")
    .withSchedule(CronScheduleBuilder.cronSchedule("0 0/5 * * * ?")
        .inTimeZone(java.util.TimeZone.getTimeZone(ZoneId.of("Asia/Shanghai"))))
    .forJob("cleanup", "maintenance")
    .build();
// 初始状态：trigger = TriggerBuilder.newTrigger()。
// 作用：CronTrigger trigger = TriggerBuilder.newTrigger()；按日历调度，调用后目标状态更新。

System.out.println(trigger.getCronExpression());
// 输出：0 0/5 * * * ?
// 说明：CronTrigger 键为 maintenance.cleanup-trigger，绑定 maintenance.cleanup，在 Asia/Shanghai 时区按 "0 0/5 * * * ?" 每 5 分钟触发。
```

CronTrigger 只表达触发计划，实际任务仍可能失败或超时；时区、开始时间和 misfire 策略要在同一 Trigger 上显式配置。修改计划应使用稳定 TriggerKey，并先确认旧 Trigger 是否仍被其他运维操作依赖。

### Cron 表达式：表达时间规则

用途：用于把人类时间需求转换为 Quartz 的六字段表达式，并在发布前验证边界日期和时区。

```java
import org.quartz.CronExpression;

String expression = "0 30 9 ? * MON-FRI";
// 作用：String expression = "0 30 9 ? * MON-FRI";；表达时间规则。
// 初始状态：expression = "0 30 9 ? * MON-FRI"。
System.out.println(CronExpression.isValidExpression(expression));
// 输出：true
// 说明："0 30 9 ? * MON-FRI" 表示周一至周五 09:30:00，isValidExpression 返回 true；是否符合本地业务时间仍取决于 Trigger 时区。
```

Quartz 的秒字段位于最前面，星期和日期字段通常一个使用 `?`；它与 Unix 五字段 Cron 不完全相同。生产规则应固定时区并测试夏令时、月底和闰日，不要把“每五分钟”误写成每五秒。

### misfire：补偿错过的触发

用途：用于决定 Scheduler 恢复或资源不足后如何处理错过的 Cron 触发，避免默认策略与业务语义不符。

```java
// 说明：CronScheduleBuilder 为 "0 0/5 * * * ?" 配置 DoNothing misfire 策略，恢复后跳过过期触发点。
import org.quartz.CronScheduleBuilder;

var schedule = CronScheduleBuilder.cronSchedule("0 0/5 * * * ?")
    .withMisfireHandlingInstructionDoNothing();
// 初始状态：schedule = CronScheduleBuilder.cronSchedule("0 0/5 * * * ?")。
// 作用：var schedule = CronScheduleBuilder.cronSchedule("0 0/5 * * * ?")；补偿错过的触发。
System.out.println("misfire=skip-old-run");
// 输出：misfire=skip-old-run
```

`DoNothing` 适合过期即无意义的刷新任务，`FireAndProceed` 适合恢复后补一次，`IgnoreMisfirePolicy` 则可能带来集中执行压力。misfire 只影响触发器补偿，不会自动重试已经抛异常的业务步骤；每种策略都要有可观测指标。

### 维护期间控制调度启停

用途：用于在维护或下游故障时暂停 Job/Trigger，再在条件满足后恢复计划，而不误以为暂停会停止正在执行的实例。

```java
import org.quartz.JobKey;
import org.quartz.Scheduler;

void maintenance(Scheduler scheduler) throws Exception {
    JobKey key = JobKey.jobKey("cleanup", "maintenance");
// 初始状态：key = JobKey.jobKey("cleanup", "maintenance")。
// 作用：JobKey key = JobKey.jobKey("cleanup", "maintenance");；jobKey 返回本次调用的结果。
    scheduler.pauseJob(key);
// 初始状态：scheduler.pauseJob(key)。
// 作用：scheduler.pauseJob(key);；pauseJob 返回本次调用的结果。
    System.out.println("state=paused");
// 输出：state=paused
    scheduler.resumeJob(key);
// 初始状态：scheduler.resumeJob(key)。
// 作用：scheduler.resumeJob(key);；resumeJob 返回本次调用的结果。
    System.out.println("state=resumed");
// 输出：state=resumed
}

// 作用：用于在维护或下游故障时暂停 Job/Trigger，再在条件满足后恢复计划，而不误以为暂停会停止正在执行的实例。
```

暂停只阻止后续触发，已进入 `execute` 的任务仍需自己完成、超时或取消；恢复后是否产生 misfire 由 Trigger 策略决定。运维接口要限制权限并记录操作者、原因和恢复时间。

## 不常用但需要知道

### @DisallowConcurrentExecution：避免同一 JobKey 重叠

用途：用于禁止同一 `JobKey` 的多个实例并发执行，适合非幂等或会竞争同一资源的任务。

```java
import org.quartz.DisallowConcurrentExecution;
import org.quartz.Job;
import org.quartz.JobExecutionContext;

@DisallowConcurrentExecution
// 初始状态：@DisallowConcurrentExecution。
// 作用：@DisallowConcurrentExecution；避免同一 JobKey 重叠，返回调用结果。
final class RebuildJob implements Job {
    @Override public void execute(JobExecutionContext context) {
        System.out.println("overlap=blocked");
// 输出：overlap=blocked
    }
}
// 作用：用于禁止同一 `JobKey` 的多个实例并发执行，适合非幂等或会竞争同一资源的任务。
```

注解的作用范围是同一个 JobKey；使用不同 key、不同调度器或外部进程仍可能并发。它也不替代数据库唯一约束、分布式锁和幂等写入，长任务要配合 misfire 和超时策略评估排队效果。

### 持久化表：使用 JDBCJobStore

用途：用于在进程重启和多节点部署中保存 Job/Trigger 状态，让调度器依靠 Quartz 表恢复和协调，而不是依靠内存快照。

```java
import java.util.Objects;
import java.util.Properties;

Properties quartz = new Properties();
// 初始状态：quartz = new Properties()。
// 作用：Properties quartz = new Properties();；使用 JDBCJobStore，返回调用结果。
quartz.setProperty("org.quartz.scheduler.instanceName", "app-scheduler");
// 初始状态：quartz.setProperty("org.quartz.scheduler.instanceName", "app-scheduler")。
// 作用：quartz.setProperty("org.quartz.scheduler.instanceName", "app-scheduler");；使用 JDBCJobStore，调用后目标状态更新。
quartz.setProperty("org.quartz.scheduler.instanceId", "AUTO");
// 初始状态：quartz.setProperty("org.quartz.scheduler.instanceId", "AUTO")。
// 作用：quartz.setProperty("org.quartz.scheduler.instanceId", "AUTO");；使用 JDBCJobStore，调用后目标状态更新。
quartz.setProperty("org.quartz.threadPool.threadCount", "10");
// 初始状态：quartz.setProperty("org.quartz.threadPool.threadCount", "10")。
// 作用：quartz.setProperty("org.quartz.threadPool.threadCount", "10");；使用 JDBCJobStore，调用后目标状态更新。
quartz.setProperty("org.quartz.jobStore.class", "org.quartz.impl.jdbcjobstore.JobStoreTX");
// 初始状态：quartz.setProperty("org.quartz.jobStore.class", "org.quartz.impl.jdbcjobstore.JobStoreTX")。
// 作用：quartz.setProperty("org.quartz.jobStore.class", "org.quartz.impl.jdbcjobstore.JobStoreTX");；使用 JDBCJobStore，调用后目标状态更新。
quartz.setProperty("org.quartz.jobStore.driverDelegateClass", "org.quartz.impl.jdbcjobstore.StdJDBCDelegate");
// 初始状态：quartz.setProperty("org.quartz.jobStore.driverDelegateClass", "org.quartz.impl.jdbcjobstore.StdJDBCDelegate")。
// 作用：quartz.setProperty("org.quartz.jobStore.driverDelegateClass", "org.quartz.impl.jdbcjobstore.StdJDBCDelegate");；使用 JDBCJobStore，调用后目标状态更新。
quartz.setProperty("org.quartz.jobStore.dataSource", "main");
// 初始状态：quartz.setProperty("org.quartz.jobStore.dataSource", "main")。
// 作用：quartz.setProperty("org.quartz.jobStore.dataSource", "main");；使用 JDBCJobStore，调用后目标状态更新。
quartz.setProperty("org.quartz.jobStore.tablePrefix", "QRTZ_");
// 初始状态：quartz.setProperty("org.quartz.jobStore.tablePrefix", "QRTZ_")。
// 作用：quartz.setProperty("org.quartz.jobStore.tablePrefix", "QRTZ_");；使用 JDBCJobStore，调用后目标状态更新。
quartz.setProperty("org.quartz.jobStore.isClustered", "true");
// 初始状态：quartz.setProperty("org.quartz.jobStore.isClustered", "true")。
// 作用：quartz.setProperty("org.quartz.jobStore.isClustered", "true");；使用 JDBCJobStore，调用后目标状态更新。
quartz.setProperty("org.quartz.dataSource.main.driver", "com.mysql.cj.jdbc.Driver");
// 初始状态：quartz.setProperty("org.quartz.dataSource.main.driver", "com.mysql.cj.jdbc.Driver")。
// 作用：quartz.setProperty("org.quartz.dataSource.main.driver", "com.mysql.cj.jdbc.Driver");；使用 JDBCJobStore，调用后目标状态更新。
quartz.setProperty("org.quartz.dataSource.main.URL", Objects.requireNonNull(System.getenv("QUARTZ_DB_URL")));
// 初始状态：quartz.setProperty("org.quartz.dataSource.main.URL", Objects.requireNonNull(System.getenv("QUARTZ_DB_URL")))。
// 作用：quartz.setProperty("org.quartz.dataSource.main.URL", Objects.requireNonNull(System.getenv("QUARTZ_DB_URL")));；使用 JDBCJobStore，调用后目标状态更新。
quartz.setProperty("org.quartz.dataSource.main.user", Objects.requireNonNull(System.getenv("QUARTZ_DB_USER")));
// 初始状态：quartz.setProperty("org.quartz.dataSource.main.user", Objects.requireNonNull(System.getenv("QUARTZ_DB_USER")))。
// 作用：quartz.setProperty("org.quartz.dataSource.main.user", Objects.requireNonNull(System.getenv("QUARTZ_DB_USER")));；使用 JDBCJobStore，调用后目标状态更新。
quartz.setProperty("org.quartz.dataSource.main.password", Objects.requireNonNull(System.getenv("QUARTZ_DB_PASSWORD")));
// 初始状态：quartz.setProperty("org.quartz.dataSource.main.password", Objects.requireNonNull(System.getenv("QUARTZ_DB_PASSWORD")))。
// 作用：quartz.setProperty("org.quartz.dataSource.main.password", Objects.requireNonNull(System.getenv("QUARTZ_DB_PASSWORD")));；使用 JDBCJobStore，调用后目标状态更新。
System.out.println("store=" + quartz.getProperty("org.quartz.jobStore.class")
    + ",prefix=" + quartz.getProperty("org.quartz.jobStore.tablePrefix"));
// 输出：store=org.quartz.impl.jdbcjobstore.JobStoreTX,prefix=QRTZ_
// 作用：用于在进程重启和多节点部署中保存 Job/Trigger 状态，让调度器依靠 Quartz 表恢复和协调，而不是依靠内存快照。
```

JDBCJobStore 需要先执行与数据库方言匹配的 Quartz 建表脚本，并配置真实的 `jobStore.class`、`driverDelegateClass`、`dataSource`、`tablePrefix`、`isClustered`、`instanceId` 与数据源 URL/账号属性。密码只能来自受控密钥或环境变量，不能写进 `JobDataMap` 或日志；上例也不打印数据源凭据。还要观察锁等待与时钟偏差。JobDataMap 的序列化内容应可迁移且不含机密；持久化成功不代表业务数据库事务自动和 Job 执行处于同一事务。

### 失败重试：区分立即 refire 与有界指数退避 Trigger

用途：用于限制 Quartz 立即 refire 的次数，并把需要延迟的重试用有界指数退避显式建成新的 Trigger，避免把两种语义混成一个开关。

```java
import org.quartz.JobExecutionContext;
import org.quartz.JobExecutionException;
import java.util.UUID;

void executeWithBound(JobExecutionContext context) throws JobExecutionException {
    int maxRefires = 2;
// 初始状态：maxRefires = 2。
    if (context.getRefireCount() < maxRefires) {
        JobExecutionException retry = new JobExecutionException("temporary failure");
// 初始状态：retry = new JobExecutionException("temporary failure")。
// 作用：JobExecutionException retry = new JobExecutionException("temporary failure");；区分立即 refire 与有界指数退避 Trigger，返回调用结果。
        retry.setRefireImmediately(true);
// 初始状态：retry.setRefireImmediately(true)。
// 作用：retry.setRefireImmediately(true);；区分立即 refire 与有界指数退避 Trigger，调用后目标状态更新。
        throw retry;
    }
    System.err.println("retry=exhausted, job=" + context.getJobDetail().getKey());
// 初始状态：retry = exhausted, job=" + context.getJobDetail().getKey())。
// 作用：System.err.println("retry=exhausted, job=" + context.getJobDetail().getKey());；区分立即 refire 与有界指数退避 Trigger，返回调用结果。
    throw new JobExecutionException("retry limit exceeded");
// 初始状态：throw new JobExecutionException("retry limit exceeded")。
// 作用：throw new JobExecutionException("retry limit exceeded");；区分立即 refire 与有界指数退避 Trigger，返回调用结果。
}
// 作用：用于限制 Quartz 立即 refire 的次数，并把需要延迟的重试用有界指数退避显式建成新的 Trigger，避免把两种语义混成一个开关。
// 结果：refireCount 为 0 或 1 时任务立即重试；达到 2 时输出 retry=exhausted 并以 JobExecutionException 失败结束
```

`setRefireImmediately(true)` 只是请求 Quartz 立即再次执行，不是退避；不能无条件设置，否则会形成紧密重试环。达到 `maxRefires` 后必须记录失败告警并抛出异常，让 Job 以失败结束，不能打印成功。需要延迟时使用新的 `SimpleTrigger`，按 attempt 计算有上限的指数退避：

```java
import org.quartz.DateBuilder;
import org.quartz.IntervalUnit;
import org.quartz.SimpleScheduleBuilder;
import org.quartz.Trigger;
import org.quartz.TriggerBuilder;

Trigger delayedRetry(JobExecutionContext context, int attempt) throws Exception {
    int maxAttempts = 5;
// 初始状态：maxAttempts = 5。
    if (attempt < 0 || attempt >= maxAttempts) {
        throw new IllegalArgumentException("retry attempts exhausted");
// 初始状态：throw new IllegalArgumentException("retry attempts exhausted")。
// 作用：throw new IllegalArgumentException("retry attempts exhausted");；区分立即 refire 与有界指数退避 Trigger，返回调用结果。
    }
    long baseSeconds = 30L;
// 初始状态：baseSeconds = 30L。
    long maxSeconds = 15L * 60L;
// 初始状态：maxSeconds = 15L * 60L。
    long multiplier = 1L << Math.min(attempt, 5);
// 初始状态：multiplier = 1L << Math.min(attempt, 5)。
// 作用：long multiplier = 1L << Math.min(attempt, 5);；区分立即 refire 与有界指数退避 Trigger，返回调用结果。
    long delaySeconds = Math.min(baseSeconds * multiplier, maxSeconds);
// 初始状态：delaySeconds = Math.min(baseSeconds * multiplier, maxSeconds)。
// 作用：long delaySeconds = Math.min(baseSeconds * multiplier, maxSeconds);；区分立即 refire 与有界指数退避 Trigger，返回调用结果。
    String jobKey = context.getJobDetail().getKey().toString();
// 初始状态：jobKey = context.getJobDetail().getKey().toString()。
// 作用：String jobKey = context.getJobDetail().getKey().toString();；区分立即 refire 与有界指数退避 Trigger，返回读取结果。
    String fireInstanceId = context.getFireInstanceId();
// 初始状态：fireInstanceId = context.getFireInstanceId()。
// 作用：String fireInstanceId = context.getFireInstanceId();；区分立即 refire 与有界指数退避 Trigger，返回读取结果。
    String runId = fireInstanceId == null || fireInstanceId.isBlank()
        ? UUID.randomUUID().toString()
        : fireInstanceId;
// 初始状态：runId = fireInstanceId == null || fireInstanceId.isBlank()。
// 作用：String runId = fireInstanceId == null || fireInstanceId.isBlank()；区分立即 refire 与有界指数退避 Trigger，返回读取结果。
// 作用：? UUID.randomUUID().toString()；区分立即 refire 与有界指数退避 Trigger，返回调用结果。
    Trigger retry = TriggerBuilder.newTrigger()
        .withIdentity("cleanup-retry-" + jobKey + "-" + runId + "-" + attempt, "maintenance")
        .forJob(context.getJobDetail())
        .startAt(DateBuilder.futureDate(Math.toIntExact(delaySeconds), IntervalUnit.SECOND))
        .withSchedule(SimpleScheduleBuilder.simpleSchedule().withRepeatCount(0))
        .build();
// 初始状态：retry = TriggerBuilder.newTrigger()。
// 作用：.build();；区分立即 refire 与有界指数退避 Trigger，调用后目标状态更新。
// 作用：Trigger retry = TriggerBuilder.newTrigger()；区分立即 refire 与有界指数退避 Trigger，返回调用结果。
// 作用：.forJob(context.getJobDetail())；区分立即 refire 与有界指数退避 Trigger，返回调用结果。
// 作用：.startAt(DateBuilder.futureDate(Math.toIntExact(delaySeconds), IntervalUnit.SECOND))；区分立即 refire 与有界指数退避 Trigger，调用后目标状态更新。
// 作用：.withSchedule(SimpleScheduleBuilder.simpleSchedule().withRepeatCount(0))；区分立即 refire 与有界指数退避 Trigger，返回调用结果。
    context.getScheduler().scheduleJob(retry);
// 初始状态：context.getScheduler().scheduleJob(retry)。
// 作用：context.getScheduler().scheduleJob(retry);；区分立即 refire 与有界指数退避 Trigger，返回读取结果。
    System.out.println("retry=delayed-trigger,delay=" + delaySeconds + "s");
// 输出：retry=delayed-trigger,delay=30s
    return retry;
}

```

这里的 `attempt` 从 0 开始，延迟是 `min(baseSeconds * 2^attempt, maxSeconds)`，超过 `maxAttempts` 直接拒绝调度；每次延迟重试都由新的 Trigger 表达，身份包含 JobKey、当前 `fireInstanceId`（缺失时用 UUID）和 attempt，避免并发运行只用 attempt 造成 TriggerKey 冲突。更复杂的死信和跨服务重试应放在业务队列或持久化状态中；每次重试要使用幂等键并区分永久校验失败与暂时依赖失败。

### ScheduledExecutorService：轻量内存调度对照

用途：用于比较进程内轻量延迟/周期任务；它与 Quartz 的区别是无需持久化时更简单，但不适合需要重启恢复、misfire 策略或集群协调的任务。

```java
import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.TimeUnit;

ScheduledExecutorService scheduler = Executors.newScheduledThreadPool(1);
// 初始状态：scheduler = Executors.newScheduledThreadPool(1)。
// 作用：ScheduledExecutorService scheduler = Executors.newScheduledThreadPool(1);；轻量内存调度对照，调用后目标状态更新。
try {
    var done = scheduler.schedule(() -> System.out.println("memory=once"), 1, TimeUnit.MILLISECONDS);
// 输出：memory=once
    done.get();
// 作用：done.get();；轻量内存调度对照，返回读取结果。
} finally {
    scheduler.shutdown();
// 作用：scheduler.shutdown();；轻量内存调度对照，调用后目标状态更新。
}
// 说明：ScheduledExecutorService 以进程内存保存任务，示例 initialDelay 与 period 只在当前 JVM 存活时有效；重启后不会恢复 task key、历史触发或 misfire 状态。
```

`ScheduledExecutorService` 的任务状态只在当前 JVM 内存中，进程重启会丢失计划，周期任务抛出未捕获异常后还可能停止后续执行。单机清理、短延迟和测试可选它；需要 Cron 日历、暂停恢复、持久化和多节点协调时应选择 Quartz 或其他持久调度系统。

## 继续阅读

- [List 基础](/courses/java/05-泛型与集合/04-List常用API)：组织批量任务结果、重试记录和错误摘要时查 List 的遍历与容量。
- [Map 基础](/courses/java/05-泛型与集合/07-Map常用API)：保存 JobDataMap、任务标签和执行状态时查 Map 的键值边界。
- [String 文本处理](/courses/java/02-数组与文本/02-String与文本处理)：解析任务名称、Cron 文本和错误码时查字符串处理。

## 简单案例

```java
import org.quartz.JobBuilder;
import org.quartz.Scheduler;
import org.quartz.TriggerBuilder;
import org.quartz.CronScheduleBuilder;

void schedule(Scheduler scheduler) throws Exception {
    try {
        var detail = JobBuilder.newJob(CleanupJob.class)
            .withIdentity("cleanup", "maintenance")
            .build();
// 初始状态：detail = JobBuilder.newJob(CleanupJob.class)。
// 作用：var detail = JobBuilder.newJob(CleanupJob.class)；轻量内存调度对照，返回调用结果。
        var trigger = TriggerBuilder.newTrigger()
            .withIdentity("cleanup-trigger", "maintenance")
            .forJob(detail)
            .withSchedule(CronScheduleBuilder.cronSchedule("0 0/5 * * * ?")
                .withMisfireHandlingInstructionDoNothing())
            .build();
// 作用：var trigger = TriggerBuilder.newTrigger()；轻量内存调度对照，调用后目标状态更新。
// 作用：.withIdentity("cleanup-trigger", "maintenance")；轻量内存调度对照，调用后目标状态更新。
// 作用：.forJob(detail)；轻量内存调度对照，调用后目标状态更新。
// 作用：.withSchedule(CronScheduleBuilder.cronSchedule("0 0/5 * * * ?")；轻量内存调度对照，调用后目标状态更新。
// 作用：.withMisfireHandlingInstructionDoNothing())；轻量内存调度对照，调用后目标状态更新。
// 作用：.build();；轻量内存调度对照，调用后目标状态更新。
// 初始状态：trigger = TriggerBuilder.newTrigger()。
        scheduler.scheduleJob(detail, trigger);
// 作用：scheduler.scheduleJob(detail, trigger);；轻量内存调度对照，调用后目标状态更新。
        scheduler.start();
// 作用：scheduler.start();；轻量内存调度对照，调用后目标状态更新。
        System.out.println("schedule=started");
// 输出：schedule=started
    } finally {
        if (!scheduler.isShutdown()) scheduler.shutdown(true);
    }
}
```

案例把任务身份、Cron 计划和 misfire 策略放在同一个受控入口，并在示例所有权结束时调用 `Scheduler.shutdown(true)`；真实应用通常把相同关闭动作放到应用停止钩子，而不是每次注册任务都关闭共享 Scheduler。还要配置线程池、时区、JDBCJobStore、权限和关闭钩子。任务本身要可重入或加 `@DisallowConcurrentExecution`，失败重试不能依赖无限 refire。

## 易混点

- `Job` 是执行逻辑，`JobDetail` 是身份和配置，`CronTrigger` 是时间计划；三者都不能单独替代 Scheduler。
- Quartz Cron 是六字段语法，秒在最前面，和 Unix 五字段表达式不同；时区必须显式验证。
- misfire 处理错过的触发，失败重试处理执行结果；两者不是同一个重试机制。
- `pauseJob` 不会中断已运行实例，`resumeJob` 后是否补跑取决于 Trigger 的 misfire 策略。
- `@DisallowConcurrentExecution` 只约束同一 JobKey，不是跨节点、跨 key 的全局锁。
- JDBCJobStore 保存调度状态，但不会自动把业务写库和 Job 执行绑定为一个事务。
- `ScheduledExecutorService` 轻量且只在当前进程内存中，Quartz 才提供持久化、Cron、misfire 和集群协调能力。

## 课后小问

1. 为什么 CronTrigger 的表达式不能直接照搬 Linux 的五字段 Cron？
答案：Quartz 通常把秒字段放在最前面，并对日、星期字段使用 `?` 等不同语法。
解析：例如 `0 0/5 * * * ?` 表示每五分钟的第 0 秒；发布前应使用 Quartz 校验器并测试时区边界。

2. `@DisallowConcurrentExecution` 能否保证所有节点都不重复执行？
答案：它按同一 JobKey 约束 Quartz 调度实例，不能代替业务幂等、数据库约束或跨系统锁。
解析：不同 key、错误的集群配置和外部重复投递仍可能造成重复，任务应以幂等键保护写入。

3. Quartz 任务失败后应该无限设置 `setRefireImmediately(true)` 吗？
答案：不应该，重试必须有界并区分暂时失败、永久失败和下一次计划触发。
解析：无限 refire 会占满工作线程；应限制次数、加入退避和告警，复杂重试交给持久化队列或业务状态机。

## 本节小结

- `Job`、`JobDetail`、`CronTrigger` 和 `Scheduler` 分别表达执行、身份、时间和调度生命周期。
- Cron 表达式、时区与 misfire 策略共同决定错过触发后的行为，不能依赖默认值。
- 暂停恢复只改变未来触发；`@DisallowConcurrentExecution` 只约束同一 JobKey 的重叠执行。
- JDBCJobStore 支持重启和集群状态，业务写入仍需独立事务与幂等设计。
- 失败重试应有界；`ScheduledExecutorService` 适合轻量内存调度，不提供 Quartz 的持久化语义。

## 快速回顾

- 会用 JobBuilder、TriggerBuilder 和 CronScheduleBuilder 组合基本任务。
- 能解释 `0 0/5 * * * ?`、misfire、pause/resume 的行为边界。
- 知道 `@DisallowConcurrentExecution`、JDBCJobStore 与业务幂等各自解决什么。
- 能在 Quartz 与 `ScheduledExecutorService` 之间按持久化、集群和运维需求选择。
