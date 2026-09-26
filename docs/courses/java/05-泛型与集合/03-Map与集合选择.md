---
title: Map 与集合选择
date: 2026-09-22
category: Java基础快速入门
tags:
  - Java
  - 集合
  - Map
  - 缓存
description: 掌握 HashMap、LinkedHashMap、TreeMap、ConcurrentHashMap 和集合选择方法。
---

# Map 与集合选择

## 学习目标

- 理解 Map 的键唯一性、哈希桶、扩容、顺序和排序语义。
- 使用 `merge`、`compute`、`putIfAbsent` 表达单次复合更新。
- 根据并发、顺序、范围查询、缓存和可变键边界选择 Map 实现。

## 核心知识点

### 专业术语

- **Map**：键到值的映射，键唯一；`entrySet`、`keySet`、`values` 是原 Map 的视图集合。
- **HashMap**：基于哈希桶的通用 Map，平均查找接近 O(1)，容量和负载因子影响扩容。
- **LinkedHashMap**：在哈希表上维护链表，可保留插入顺序或访问顺序；access-order 是 LRU 的基础，但容量淘汰仍需额外策略。
- **TreeMap**：基于平衡树按键排序，支持范围查询但基本操作通常为 O(log n)。
- **ConcurrentHashMap**：为并发读写设计的 Map，提供 `compute`、`merge` 等原子复合操作，但不接受 `null` 键和值。

### 白话解释与边界

Map 的键必须在放入后保持 equals/hashCode 或排序关系稳定；修改参与哈希或比较的字段会让条目“还在桶里却找不到”。`get` 后再 `put` 是两个步骤，并发下可能丢失更新；单线程也可用 `merge` 表达频次累加。`ConcurrentHashMap` 的计算函数应短小、无阻塞且不要递归修改同一 Map，复合原子性只覆盖该次计算，不会自动包住整段业务流程。

HashMap 不承诺遍历顺序，LinkedHashMap 的顺序语义需要在构造时选插入或访问模式，TreeMap 则把比较器视为键身份的一部分。access-order 只提供“最近访问顺序”，不是完整的容量受限 LRU；需要淘汰最旧项时可重写 `removeEldestEntry`，或显式实现容量策略。需要线程安全时，优先选择并发实现仍不等于所有复合操作都安全，外部状态仍需单独同步。

## 简单案例

```java
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.Map;
import java.util.TreeMap;

public class MapDemo {
    public static void main(String[] args) {
        Map<String, Integer> frequency = new HashMap<>();
        for (String word : new String[]{"java", "map", "java", "set"}) {
            frequency.merge(word, 1, Integer::sum);
        }

        Map<String, Integer> sorted = new TreeMap<>(frequency);
        LinkedHashMap<String, Integer> accessOrder = new LinkedHashMap<>(2, 0.75f, true);
        accessOrder.put("A", 1);
        accessOrder.put("B", 2);
        accessOrder.get("A"); // A 移到访问顺序末尾
        accessOrder.put("C", 3);

        System.out.println("frequency=" + frequency);
        System.out.println("sorted=" + sorted + ", accessOrder=" + accessOrder.keySet());
    }
}
```

输出会显示 `java=2` 的频次、按键排序的 `TreeMap` 和访问顺序变化后的 `[B, A, C]`。`merge` 把“没有就放 1，有就相加”作为一次表达式，避免了手写的检查再更新。

## 易混点

- HashMap 不保证顺序，LinkedHashMap 维护插入或访问顺序，TreeMap 按比较器排序；三者不能按“Map 都一样”替换。
- `get` 再 `put` 不是并发原子操作，单次聚合可用 `merge`，并发复合计算可用 `ConcurrentHashMap.compute`。
- 可变 key 修改后可能无法查找，`Map` 中已有条目不会自动迁移到新哈希桶或排序位置。
- synchronizedMap 只包装单次方法调用，遍历和多个调用组合仍需外部同步；ConcurrentHashMap 也不允许 `null`。

## 课后小问

1. 频次统计为什么适合 `merge(word, 1, Integer::sum)`？
答案：它把缺失键的初始值和已有键的合并规则放在一次 Map 更新中，表达了完整的累加语义。
解析：相比先 `get` 再 `put`，merge 更不容易遗漏首次出现的单词；并发版本还应选择支持原子计算的并发 Map。

2. 为什么修改 Map 的可变键后可能 `get` 不到原来的值？
答案：键的哈希或比较结果改变了，查找会走新的桶或树路径，而条目仍在插入时的位置。
解析：键参与定位的字段必须稳定；可以使用不可变值对象或在修改前移除再以新键放入。

## 本节小结

- Map 的键唯一且必须遵守稳定的相等、哈希或排序契约。
- HashMap、LinkedHashMap、TreeMap 分别强调通用哈希、顺序和范围排序。
- merge/compute 表达复合更新，ConcurrentHashMap 提供并发边界但不自动保护外部流程。
- 选择 Map 时同时考虑顺序、范围、并发、null 支持和可变键风险。

## 快速回顾

- 能说明 HashMap 扩容与键哈希的基本关系。
- 能根据插入顺序、访问顺序和范围查询选择 Map。
- 能用 merge 写出稳定的单词频次统计。
- 能指出可变 key 和复合操作在并发中的问题。
