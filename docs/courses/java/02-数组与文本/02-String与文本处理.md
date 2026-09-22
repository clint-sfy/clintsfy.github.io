---
title: String 与文本处理
date: 2026-09-22
category: Java基础快速入门
tags:
  - Java
  - String
  - Unicode
description: 掌握不可变字符串、字符编码、StringBuilder 和正则表达式的基础用法。
---

# String 与文本处理

## 学习目标

- 理解 `String` 不可变性、常量池和内容比较。
- 使用 `StringBuilder` 组织高频拼接，掌握常用查找、切分和格式化 API。
- 认识 UTF-8、UTF-16、码点与正则表达式边界。

## 核心知识点

`String` 的每次修改都会产生新值；内容比较用 `equals`，规范化常用 `trim`、`strip`、大小写和 Unicode 处理。循环拼接使用 `StringBuilder`，多线程共享时再考虑 `StringBuffer`。字节和文本转换必须显式指定 `StandardCharsets.UTF_8`。正则表达式适合词法级匹配，不应代替完整解析器；使用 `Pattern` 预编译重复规则。

## 实践任务

实现日志清洗器：读取一行日志，提取时间、级别、请求 ID 和消息；对前后空白、中文字符、缺失字段和非法编码分别处理。写一个基准对比循环中的 `+` 与 `StringBuilder`，记录输入规模和结果。

## 易错点

- 用 `==` 比较文本，结果受字符串池影响。
- `length()` 返回 UTF-16 code unit 数，不一定是用户可见字符数。
- `split` 的参数是正则表达式，点号、竖线等字符需要转义。
- 使用平台默认字符集读写文件，导致跨机器乱码。

## 复习清单

- [ ] 能解释 String 不可变的好处和代价。
- [ ] 能在字符、码点、字节之间选择正确 API。
- [ ] 能写出指定 UTF-8 且不会误吞字段的文本处理代码。

