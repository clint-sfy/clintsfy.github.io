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

## 常用 API 速查

### 基本读写与遍历

| 任务 | 高频写法 | 说明 |
| --- | --- | --- |
| 写入/替换 | `map.put(key, value)` | 键不存在则新增，存在则替换，并返回旧值；键仍然唯一。 |
| 读取 | `map.get(key)` | 键不存在返回 `null`；Map 若允许 `null` 值时不能只靠返回值判断是否存在。 |
| 带默认值读取 | `map.getOrDefault(key, defaultValue)` | 只提供读取默认值，不会把默认值写回 Map。 |
| 删除 | `map.remove(key)`、`map.remove(key, value)` | 后者只在键和值同时匹配时删除。 |
| 判断 | `containsKey(key)`、`containsValue(value)` | 判断键是否存在优先用 `containsKey`，不要用 `get(...) != null` 替代。 |
| 遍历键值 | `for (var entry : map.entrySet())` | 同时需要键和值时首选；`entry.setValue` 可替换当前值。 |
| 遍历键/值 | `keySet()`、`values()` | 都是原 Map 的视图，不是自动复制；修改 Map 会反映到视图。 |

```java
Map<String, Integer> scores = new HashMap<>();
scores.put("java", 95);
int score = scores.getOrDefault("sql", 0);
if (scores.containsKey("java")) {
    scores.replace("java", score + 95); // 仅已有键时替换
}
for (Map.Entry<String, Integer> entry : scores.entrySet()) {
    System.out.println(entry.getKey() + "=" + entry.getValue());
    // 输出：java=95
}
```

### 复合更新

| 任务 | 高频写法 | 关键边界 |
| --- | --- | --- |
| 缺失才写入 | `map.putIfAbsent(key, value)` | 已有非 `null` 值时不覆盖；`HashMap` 与并发 Map 都常用。 |
| 缺失时计算 | `map.computeIfAbsent(key, k -> createValue(k))` | 已有值时不执行计算；计算结果为 `null` 时不会写入。 |
| 按旧值合并 | `map.merge(key, value, (oldV, newV) -> ...)` | 缺失键直接放入 `value`；合并结果为 `null` 时会删除键。 |
| 条件替换 | `map.replace(key, oldValue, newValue)` | 只有当前值仍等于 `oldValue` 才替换，适合避免覆盖别人的更新。 |

```java
Map<String, Integer> count = new HashMap<>();
for (String word : List.of("java", "map", "java")) {
    count.merge(word, 1, Integer::sum);
}
Map<String, List<Integer>> groups = new HashMap<>();
groups.computeIfAbsent("even", key -> new ArrayList<>()).add(2);
System.out.println("count=" + count + ", groups=" + groups);
// 输出：count={java=2, map=1}, groups={even=[2]}（HashMap 遍历顺序不作保证）
```

不常用补充：`compute`/`computeIfPresent` 按存在性统一计算，`replaceAll` 批量替换值，`Map.of`/`Map.ofEntries` 创建小型不可变 Map，`Map.copyOf` 创建不可变副本。

### 排序、顺序与并发选择

| 需求 | 推荐实现/写法 | 说明 |
| --- | --- | --- |
| 通用键值映射 | `HashMap` | 平均查找接近 O(1)，不承诺遍历顺序。 |
| 保留插入顺序 | `LinkedHashMap` | 遍历按插入顺序；构造时传 `true` 可改为访问顺序。 |
| 按键排序/范围查询 | `TreeMap` | 按自然顺序或比较器排序，`firstKey`/`subMap` 等范围 API 通常为 O(log n)。 |
| 按键排序 | `new TreeMap<>(map)` | 得到按键排序的新 Map；原 Map 不会被原地排序。 |
| 按值排序 | `map.entrySet().stream().sorted(Map.Entry.comparingByValue()).toList()` | 得到排序后的条目列表，不再是可按键直接查找的 Map。 |
| 并发读写 | `ConcurrentHashMap` | 支持并发复合更新，不接受 `null` 键和值。 |
| 简单同步包装 | `Collections.synchronizedMap(map)` | 单次调用同步；遍历和多步组合仍要按文档外部同步。 |

并发更新时，优先用 `ConcurrentHashMap` 的 `putIfAbsent`、`computeIfAbsent` 或 `merge` 表达按键原子操作；这不等于自动保护跨多个键的业务事务。

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
        // 输出：frequency 包含 java=2、map=1、set=1（HashMap 顺序不作保证）
        System.out.println("sorted=" + sorted + ", accessOrder=" + accessOrder.keySet());
        // 输出：sorted={java=2, map=1, set=1}, accessOrder=[B, A, C]
    }
}
```

`merge` 把“没有就放 1，有就相加”作为一次表达式，`TreeMap` 展示按键排序，access-order 的 `LinkedHashMap` 展示访问后顺序变化。

## 易混点

- HashMap 不保证顺序，LinkedHashMap 维护插入或访问顺序，TreeMap 按比较器排序；三者不能按“Map 都一样”替换。
- `get` 再 `put` 不是并发原子操作，单次聚合可用 `merge`，并发复合计算可用 `ConcurrentHashMap.compute`。
- `getOrDefault` 只负责读取时的兜底，不会写入；`putIfAbsent`、`computeIfAbsent` 和 `merge` 才分别表达缺失写入、缺失计算和合并更新。
- 可变 key 修改后可能无法查找，`Map` 中已有条目不会自动迁移到新哈希桶或排序位置。
- synchronizedMap 只包装单次方法调用，遍历和多个调用组合仍需外部同步；ConcurrentHashMap 也不允许 `null`。
- `HashMap` 无顺序保证，`LinkedHashMap` 保插入/访问顺序，`TreeMap` 按键排序；按值排序通常得到条目列表而不是“排序后的 HashMap”。

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
- 能用 `getOrDefault`、`putIfAbsent`、`computeIfAbsent`、`merge` 和 `replace` 表达常见 Map 更新。
- 能区分按键排序、按值排序、顺序 Map 和并发 Map 的结果与边界。
- 能指出可变 key 和复合操作在并发中的问题。
