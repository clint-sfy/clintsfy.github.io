---
title: 日期时间 API
date: 2026-09-22
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
        System.out.println("newYork=" + formatter.format(event.atZone(newYork)));
        System.out.println("testNow=" + Instant.now(fixed));
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
