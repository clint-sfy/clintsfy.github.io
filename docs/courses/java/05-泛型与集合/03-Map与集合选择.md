---
title: Map 与集合选择
date: 2026-09-22
category: Java系统补习
tags:
  - Java
  - 集合
  - Map
  - 缓存
description: 掌握 HashMap、LinkedHashMap、TreeMap、ConcurrentHashMap 和集合选择方法。
---

# Map 与集合选择

## 学习目标

- 理解 Map 的键唯一性、哈希桶、扩容和排序语义。
- 熟练使用 compute、merge、putIfAbsent 等原子表达式。
- 根据并发、顺序、范围查询和内存要求选择 Map。

## 核心知识点

HashMap 平均常数时间查找，容量和负载因子影响扩容；LinkedHashMap 可保留插入或访问顺序，适合简单 LRU；TreeMap 提供排序键和范围查询。键应稳定、正确实现 equals/hashCode。不要用 `get` 后再 `put` 模拟并发原子更新；单线程聚合可用 `merge`，多线程场景考虑 ConcurrentHashMap 的 `compute` 和 LongAdder。Map 的视图集合会反映原 Map。

## 实践任务

实现单词频率统计与一个容量受限的 LRU：先用 HashMap，后用 LinkedHashMap 重写；为并发计数比较 synchronizedMap、ConcurrentHashMap 和 LongAdder，并说明测量方法。

## 易错点

- 使用可变对象作为键，插入后修改键字段。
- 在 ConcurrentHashMap 的计算函数中执行慢 I/O 或再次递归修改同一 Map。
- 把 null 键/值的支持情况套用到所有 Map 实现。
- 认为 synchronizedMap 的复合操作自动线程安全。

## 复习清单

- [ ] 能解释 HashMap 的 key 契约和扩容影响。
- [ ] 能写出 merge/compute 的聚合代码。
- [ ] 能针对顺序、范围和并发需求选择 Map 实现。

