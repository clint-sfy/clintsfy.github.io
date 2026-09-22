---
title: 日期时间 API
date: 2026-09-22
category: Java系统补习
tags:
  - Java
  - 日期时间
  - 时区
description: 使用 java.time 处理日期、时间、时区、格式化和周期计算。
---

# 日期时间 API

## 学习目标

- 区分 Instant、LocalDate、LocalDateTime、ZonedDateTime 和 Duration。
- 使用明确时区、格式化器和解析策略处理外部时间。
- 正确计算周期、截止时间和夏令时边界。

## 核心知识点

`Instant` 表示时间线上的瞬时点，`LocalDate/Time` 不带时区，`ZonedDateTime` 带区域规则，`OffsetDateTime` 只带固定偏移。时间戳存储通常使用 UTC，展示时转换为用户时区。时间对象不可变且线程安全；格式化用 `DateTimeFormatter`，区间计算区分 `Period`（日期）和 `Duration`（时间）。不要用旧 `Date/Calendar` 混合隐式时区。

## 实践任务

实现预约服务：保存 UTC 的开始时间，按用户时区展示，计算预约是否过期；用固定 `Clock` 测试跨午夜、闰年和夏令时切换。

## 易错点

- 用系统默认时区解析没有偏移的字符串。
- 把 Duration 的小时与 Period 的天数混用。
- 手写日期格式或拼接时区，导致不可逆解析。
- 用 `now()` 直接写测试，测试随时间漂移。

## 复习清单

- [ ] 能根据存储、计算、展示场景选择时间类型。
- [ ] 能解释 UTC 与用户时区转换。
- [ ] 能使用 Clock 为时间相关代码写稳定测试。

