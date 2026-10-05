---
title: 同义反复注释示例
date: 2026-10-05
category: Java 示例
tags:
  - Java
description: 用于测试只复述相邻语句的注释必须失败。
---

# 同义反复注释示例

## 学习目标

- 识别没有补充任何状态或边界的注释。

## 核心知识点

### 专业术语

同义反复注释只是把代码改写成自然语言。

### 白话解释与边界

注释应该补充代码本身看不出的状态、生命周期、副作用或边界。

## 常用用法

### `Channels.newInputStream`：创建输入流

用途：用于把已打开的字节通道适配成输入流。

```java
var channel = FileChannel.open(path);
var input = Channels.newInputStream(channel);
// 初始状态：input = Channels.newInputStream(channel)。
// 关键变化：input 可以通过流式 API 读取 channel 中的字节。
System.out.println(input.available());
// 输出：返回当前可读字节数。
```

## 易混点

写出赋值表达式不等于说明资源共享或关闭副作用。

## 课后小问

1. 什么信息值得写进注释？

答案：代码本身无法直接表达的状态、生命周期、副作用和边界。

解析：复述语句不会增加可验证信息。

## 本节小结

- 注释应补充代码以外的信息。

## 快速回顾

- 删除同义反复的注释。
