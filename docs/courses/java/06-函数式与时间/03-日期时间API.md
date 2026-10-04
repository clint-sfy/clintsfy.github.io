---
title: 日期时间 API
date: 2026-09-22T00:00:00.000Z
category: Java基础快速入门
tags:
  - Java
  - 日期时间
  - 时区
description: 使用 java.time 处理日期、时间、时区、格式化和周期计算。
---

# 日期时间 API

## 学习目标

- 区分 `Instant`、`LocalDate`、`LocalDateTime`、`ZonedDateTime` 和 `Duration`。
- 使用明确时区、格式化器和解析策略处理外部时间。
- 用不可变的 `java.time` 类型完成转换，并让时间相关测试可重复。

## 核心知识点

### 专业术语

- **Instant**：UTC 时间线上的一个瞬时点，适合存储事件发生时刻或截止时间。
- **LocalDate/LocalTime/LocalDateTime**：没有时区或偏移的本地日历/时钟值，不能独立表示全球唯一时刻。
- **ZonedDateTime**：带 `ZoneId` 区域规则的日期时间，会考虑夏令时等历史规则。
- **OffsetDateTime**：带固定偏移量的日期时间，不包含完整区域规则。
- **`DateTimeFormatter` 与 `Clock`**：分别负责稳定格式化/解析与可替换的当前时间来源。

### 白话解释与边界

先问业务要表达什么：生日和营业日通常是 `LocalDate`，会议输入若明确地区应保存 `ZonedDateTime` 或转换成 `Instant`，服务器记录和消息时间点通常使用 UTC `Instant`。`LocalDateTime` 只是墙上时钟读数，把它直接当成时间点会在跨时区或夏令时切换时产生歧义。`ZoneId` 是区域规则，不能只用一个固定 `+08:00` 代替所有历史和未来变化。

`java.time` 类型不可变且线程安全，每次 `plus` 或 `with` 都返回新对象。`Period` 按日历单位计算日期，`Duration` 按时间线秒/纳秒计算时长；测试不要直接调用 `now()`，应注入固定 `Clock`，否则测试会随机器时间漂移。

## 常用用法

### `Date()`：构造旧式时间对象

`new Date(long)` 把自 Unix 时间纪元起的毫秒数包装为可变的旧式时间对象；新代码优先使用不可变的 `Instant`，仅在旧 API 边界转换。

```java
import java.util.Date;

Date epoch = new Date(0L);
// 初始状态：epoch 由 new Date(0L) 构造，对应 1970-01-01T00:00:00Z。
// 作用：Date(long) 把毫秒时间戳保存在旧式 Date 对象中。
System.out.println(epoch.getTime());
// 输出：0
```

### `LocalDate`：表达不带时区的日期

`LocalDate` 适合生日、营业日等只关心年月日的值，不能独立定位全球时间线上的时刻。

```java
import java.time.LocalDate;

LocalDate release = LocalDate.of(2026, 9, 27);
// 初始状态：release 当前为 LocalDate.of(2026, 9, 27)。
// 作用：LocalDate 适合生日、营业日等只关心年月日的值，不能独立定位全球时间线上的时刻。
LocalDate nextDay = release.plusDays(1);
// 初始状态：nextDay 当前为 release.plusDays(1)。

System.out.println(release);
// 输出：2026-09-27
System.out.println(nextDay);
// 输出：2026-09-28
```

### `LocalTime`：表达不带日期和时区的时间

`LocalTime` 适合每日营业时间等时钟读数，跨地区安排不能只保存这一类型。

```java
import java.time.LocalTime;

LocalTime opensAt = LocalTime.of(9, 30);
// 初始状态：opensAt 当前为 LocalTime.of(9, 30)。
// 作用：LocalTime 适合每日营业时间等时钟读数，跨地区安排不能只保存这一类型。
LocalTime closesAt = opensAt.plusHours(8);
// 初始状态：closesAt 当前为 opensAt.plusHours(8)。

System.out.println(opensAt);
// 输出：09:30
System.out.println(closesAt);
// 输出：17:30
```

### `LocalDateTime`：表达不带时区的日期时间

`LocalDateTime` 适合尚未绑定地区的表单值，转换为唯一时刻前必须补充 `ZoneId` 或偏移。

```java
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

LocalDate date = LocalDate.of(2026, 9, 27);
// 初始状态：date 当前为 LocalDate.of(2026, 9, 27)。
LocalTime time = LocalTime.of(9, 30);
// 初始状态：time 当前为 LocalTime.of(9, 30)。
LocalDateTime meeting = LocalDateTime.of(date, time);
// 作用：LocalDateTime 适合尚未绑定地区的表单值，转换为唯一时刻前必须补充 ZoneId 或偏移。
System.out.println(meeting);
// 输出：2026-09-27T09:30
```

### `Instant`：记录时间线上的唯一时刻

`Instant` 适合数据库、日志和消息传输；它不直接携带用户要看的地区时间。

```java
import java.time.Instant;

Instant event = Instant.parse("2026-09-27T01:30:00Z");
// 初始状态：event 当前为 Instant.parse("2026-09-27T01:30:00Z")。
// 作用：Instant 适合数据库、日志和消息传输。
System.out.println(event.plusSeconds(60));
// 输出：2026-09-27T01:31:00Z
```

### `Instant.atZone`：按地区显示同一时刻

区域时区包含历史和夏令时规则，不要用一个固定偏移量替代所有地区。

```java
import java.time.Instant;
import java.time.ZoneId;

Instant event = Instant.parse("2026-09-27T01:30:00Z");
// 初始状态：event 当前为 Instant.parse("2026-09-27T01:30:00Z")。
System.out.println(event.atZone(ZoneId.of("Asia/Shanghai")));
// 作用：区域时区包含历史和夏令时规则，不要用一个固定偏移量替代所有地区。
// 输出：2026-09-27T09:30+08:00[Asia/Shanghai]
```

### `DateTimeFormatter`：格式化与解析文本

外部协议应固定格式和 Locale；`DateTimeFormatter` 可共享，因为它是不可变且线程安全的。

```java
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;

DateTimeFormatter formatter = DateTimeFormatter.ofPattern("uuuu-MM-dd");
// 初始状态：formatter 当前为 DateTimeFormatter.ofPattern("uuuu-MM-dd")。
// 作用：外部协议应固定格式和 Locale。
LocalDate date = LocalDate.parse("2026-09-27", formatter);
// 初始状态：date 当前为 LocalDate.parse("2026-09-27", formatter)。
System.out.println(formatter.format(date));
// 输出：2026-09-27
```

### `Duration`：计算时间线时长

`Duration` 按秒和纳秒表达时长，适合超时、耗时等连续时间线计算。

```java
import java.time.Duration;
import java.time.Instant;

Instant start = Instant.parse("2026-09-27T01:00:00Z");
// 初始状态：start 当前为 Instant.parse("2026-09-27T01:00:00Z")。
Instant end = Instant.parse("2026-09-27T03:30:00Z");
// 初始状态：end 当前为 Instant.parse("2026-09-27T03:30:00Z")。
Duration elapsed = Duration.between(start, end);
// 作用：Duration 按秒和纳秒表达时长，适合超时、耗时等连续时间线计算。

System.out.println(elapsed.toMinutes());
// 输出：150
```

### `Period`：计算日历周期

`Period` 按年、月、日表达周期，适合账期和日期跨度，不等价于固定秒数。

```java
import java.time.LocalDate;
import java.time.Period;

LocalDate start = LocalDate.of(2026, 1, 1);
// 初始状态：start 当前为 LocalDate.of(2026, 1, 1)。
LocalDate end = LocalDate.of(2026, 1, 3);
// 初始状态：end 当前为 LocalDate.of(2026, 1, 3)。
Period period = Period.between(start, end);
// 作用：Period 按年、月、日表达周期，适合账期和日期跨度，不等价于固定秒数。

System.out.println(period.getDays());
// 输出：2
```

### `Clock`：让当前时间可替换

生产代码可使用系统时钟，测试使用固定时钟；不要把直接 `now()` 藏在难以替换的业务逻辑里。

```java
import java.time.Clock;
import java.time.Instant;
import java.time.ZoneOffset;

Clock fixed = Clock.fixed(Instant.parse("2026-09-27T00:00:00Z"), ZoneOffset.UTC);
// 初始状态：fixed 当前为 Clock.fixed(Instant.parse("2026-09-27T00:00:00Z"), ZoneOffset.UTC)。
// 作用：生产代码可使用系统时钟，测试使用固定时钟。
System.out.println(Instant.now(fixed));
// 输出：2026-09-27T00:00:00Z
```
## 不常用但需要知道

### `ZoneOffset`：使用固定偏移量

固定偏移不包含地区规则，适合协议中已明确偏移的时间，不等于 `Asia/Shanghai` 这样的区域时区。

```java
import java.time.OffsetDateTime;
import java.time.ZoneOffset;

OffsetDateTime value = OffsetDateTime.of(2026, 9, 27, 9, 30, 0, 0, ZoneOffset.ofHours(8));
// 作用：通过 ZoneOffset 使用固定偏移量。
System.out.println(value.getOffset());
// 输出：+08:00
```

### `TemporalAdjusters`：寻找下一个日历位置

它适合账期、月初和月末等规则日期；复杂节假日仍需要业务日历，而不是简单调节器。

```java
import java.time.LocalDate;
import java.time.temporal.TemporalAdjusters;

LocalDate date = LocalDate.of(2026, 9, 27);
// 初始状态：date 当前为 LocalDate.of(2026, 9, 27)。
// 作用：它适合账期、月初和月末等规则日期；复杂节假日仍需要业务日历，而不是简单调节器。
System.out.println(date.with(TemporalAdjusters.firstDayOfNextMonth()));
// 作用：通过 TemporalAdjusters 寻找下一个日历位置。
// 输出：2026-10-01
```

### `YearMonth.of`：构造年月值

账期或生日等确实缺少日、年的场景可用它们；不要为了凑成完整时间而随意补一个日期。

```java
import java.time.MonthDay;
import java.time.YearMonth;

System.out.println(YearMonth.of(2026, 9));
// 作用：通过 YearMonth.of 构造年月值。
// 输出：2026-09
```

### `MonthDay.of`：构造月日值

`MonthDay` 不包含年份，适合每年重复的生日或纪念日；与具体年份结合前需考虑 2 月 29 日。

```java
// 语义：MonthDay.of(9, 27) 只保存 9 月 27 日，不附加年份。
import java.time.MonthDay;

System.out.println(MonthDay.of(9, 27));
// 作用：通过 MonthDay.of 构造月日值。
// 输出：--09-27
```
## 专题导航

- 需要解析、格式化和严格校验文本，查看 [日期格式化与解析](./07-日期格式化与解析)。
- 需要时间线、时区转换和固定时钟，查看 [时区、Instant 与 ZonedDateTime](./08-时区Instant与ZonedDateTime)。

## 简单案例

```java
import java.time.Clock;
import java.time.Instant;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Locale;

public class TimeDemo {
    public static void main(String[] args) {
        Instant event = Instant.parse("2026-09-26T12:00:00Z");
        ZoneId shanghai = ZoneId.of("Asia/Shanghai");
        ZoneId newYork = ZoneId.of("America/New_York");
        ZonedDateTime local = event.atZone(shanghai);
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("uuuu-MM-dd HH:mm z", Locale.ROOT);
        Clock fixed = Clock.fixed(event, ZoneId.of("UTC"));

        System.out.println("shanghai=" + formatter.format(local));
        // 输出：shanghai=2026-09-26 20:00 CST
        System.out.println("newYork=" + formatter.format(event.atZone(newYork)));
        // 输出：newYork=2026-09-26 08:00 EDT
        System.out.println("testNow=" + Instant.now(fixed));
        // 输出：testNow=2026-09-26T12:00:00Z
    }
}
```

输出会把同一个 `Instant` 显示为上海和纽约的不同本地时间，但 `testNow` 始终是固定的 UTC 值。存储事件时保留 `Instant`，展示时才按用户 `ZoneId` 转换，避免把本地读数误当成时间线位置。

## 易混点

- `Instant` 是唯一时间点，`LocalDateTime` 没有时区，二者不能互换；解析本地字符串前必须补充区域或偏移。
- `ZoneId` 包含区域规则，`ZoneOffset` 只是固定偏移；夏令时场景不能只拼接 `+08:00`。
- `Period` 按日历日期计算，`Duration` 按时间线计算；跨夏令时的一天不一定等于 24 小时。
- `now()` 适合生产实时读取，不适合稳定测试；使用 `Clock.fixed` 才能重复验证边界。

## 课后小问

1. 为什么不能把用户输入的 `2026-09-26 20:00` 直接当作 Instant？
答案：它只有本地日期和时间，没有时区或偏移，无法确定全球时间线上的唯一位置。
解析：必须根据用户地区补上 `ZoneId`，或要求输入带偏移；否则不同服务器解释结果可能不同。

2. 为什么测试预约过期逻辑要使用固定 `Clock`？
答案：固定时钟让“当前时间”可预测，测试在不同机器和不同运行时刻都得到同一结果。
解析：直接调用 `Instant.now()` 会把墙钟变化带进断言，导致跨午夜或慢测试偶发失败；注入 Clock 可以精确构造边界时刻。

## 本节小结

- Instant 表示时间点，Local 类型表示无时区的业务读数，ZonedDateTime 结合区域规则展示或计算。
- 存储和跨系统传输通常使用 UTC Instant，展示时按明确 ZoneId 转换。
- Period 与 Duration 的计算单位不同，夏令时和闰年会暴露错误假设。
- java.time 对象不可变，格式化器和 Clock 能让解析与测试边界明确且可重复。

## 快速回顾

- 能根据存储、业务日期和展示场景选择时间类型。
- 能解释 ZoneId、ZoneOffset 与 UTC Instant 的关系。
- 能区分 Period 和 Duration 的计算语义。
- 能用 DateTimeFormatter 和固定 Clock 写出稳定的时间代码。
