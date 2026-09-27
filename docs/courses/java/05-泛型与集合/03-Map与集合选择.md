---
title: Map 与集合选择总览
date: 2026-09-27
category: Java基础快速入门
tags:
  - Java
  - Map
  - 集合选择
  - 并发集合
description: 从键值语义、顺序、排序、不可变和并发边界选择 Map，并跳转到 API 细页。
---

# Map 与集合选择总览

## 学习目标

- 理解 Map 的键唯一性、顺序、排序和视图语义。
- 根据通用查找、保序、范围查询、不可变和并发需求选择实现。
- 通过 Map 常用 API 页面按标题检索每个方法。

## 核心知识点

### 专业术语

- **HashMap**：通用哈希 Map，平均查找接近 O(1)，不承诺顺序。
- **LinkedHashMap**：维护插入顺序或访问顺序。
- **TreeMap**：按键排序并支持范围查询。
- **ConcurrentHashMap**：并发读写和单键复合更新，不接受 null。
- **视图**：keySet、values、entrySet 与源 Map 共享结构。

### 白话解释与边界

Map 的键必须保持 equals/hashCode 或比较器关系稳定；修改可变 key 的字段会让它“还在 Map 中却找不到”。HashMap 是默认通用选择，LinkedHashMap 表达稳定展示顺序，TreeMap 表达排序与范围，ConcurrentHashMap 只解决容器级并发访问，不会自动保护跨多个键的业务事务。

细粒度案例见 [Map 常用 API](./07-Map常用API)；排序、不可变和并发集合边界见 [集合排序与不可变集合](./08-集合排序与不可变集合)。

## 常用 API 速查

### put、get、containsKey：基础读写入口

```java
import java.util.LinkedHashMap;
import java.util.Map;

public class MapBasicOverviewDemo {
    public static void main(String[] args) {
        Map<String, Integer> scores = new LinkedHashMap<>();
        scores.put("java", 95);
        System.out.println(scores.containsKey("java") + ", " + scores.get("java"));
        // 输出：true, 95
    }
}
```

基础读写和删除见 Map 常用 API 的对应标题；不要用 get != null 替代 containsKey。

### merge、computeIfAbsent：复合更新入口

```java
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class MapCompoundOverviewDemo {
    public static void main(String[] args) {
        Map<String, Integer> count = new HashMap<>();
        count.merge("java", 1, Integer::sum);
        Map<String, List<String>> groups = new HashMap<>();
        groups.computeIfAbsent("java", key -> new ArrayList<>()).add("String");
        System.out.println(count + " / " + groups);
        // 输出：{java=1} / {java=[String]}
    }
}
```

缺失初始化、频次累加和按键建集合优先使用这些表达式，避免 get 后 put 的重复分支。

### HashMap、LinkedHashMap、TreeMap：实现选择入口

```java
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.Map;
import java.util.TreeMap;

public class MapChoiceOverviewDemo {
    public static void main(String[] args) {
        Map<String, Integer> hash = new HashMap<>();
        Map<String, Integer> ordered = new LinkedHashMap<>();
        Map<String, Integer> sorted = new TreeMap<>();
        hash.put("b", 2);
        ordered.put("b", 2);
        sorted.put("b", 2);
        String names = hash.getClass().getSimpleName() + ", "
            + ordered.getClass().getSimpleName() + ", "
            + sorted.getClass().getSimpleName();
        System.out.println(names);
        // 输出：HashMap, LinkedHashMap, TreeMap
    }
}
```

实现选择决定顺序与范围语义，不要先按“看起来快”选 HashMap 再补业务排序。

## 常用用法

### 按 key 的稳定性选择不可变键

```java
import java.util.HashMap;
import java.util.Map;

record UserKey(String id) {}

public class MapStableKeyDemo {
    public static void main(String[] args) {
        Map<UserKey, Integer> map = new HashMap<>();
        map.put(new UserKey("u-1"), 95);
        System.out.println(map.get(new UserKey("u-1")));
        // 输出：95
    }
}
```

优先使用 String、数字或 record 作为 key；可变 key 放入后不要修改参与 equals/hashCode 的字段。

### 用 entrySet 遍历键值

```java
import java.util.LinkedHashMap;
import java.util.Map;

public class MapEntryOverviewDemo {
    public static void main(String[] args) {
        Map<String, Integer> map = new LinkedHashMap<>(Map.of("java", 95));
        for (Map.Entry<String, Integer> entry : map.entrySet()) {
            System.out.println(entry.getKey() + "=" + entry.getValue());
            // 输出：java=95
        }
    }
}
```

entrySet 同时提供 key 和 value；只需要键或值时才使用 keySet 或 values。

## 不常用但需要知道

### Map.of 和 Map.copyOf：不可变 Map

```java
import java.util.Map;

public class MapImmutableOverviewDemo {
    public static void main(String[] args) {
        Map<String, Integer> constants = Map.of("ok", 200);
        Map<String, Integer> copy = Map.copyOf(constants);
        System.out.println(copy);
        // 输出：{ok=200}
    }
}
```

不可变工厂拒绝 null；Map.copyOf 复制容器结构但不会深复制键和值对象。

### LinkedHashMap 访问顺序：LRU 基础

```java
import java.util.LinkedHashMap;

public class MapAccessOrderOverviewDemo {
    public static void main(String[] args) {
        LinkedHashMap<String, Integer> map =
            new LinkedHashMap<>(16, 0.75f, true);
        map.put("A", 1);
        map.put("B", 2);
        map.get("A");
        System.out.println(map.keySet());
        // 输出：[B, A]
    }
}
```

访问顺序只维护最近访问排列，不自动实现容量淘汰；完整边界见 Map 常用 API。

### ConcurrentHashMap：并发单键操作

```java
import java.util.concurrent.ConcurrentHashMap;

public class ConcurrentMapOverviewDemo {
    public static void main(String[] args) {
        ConcurrentHashMap<String, Integer> count = new ConcurrentHashMap<>();
        count.merge("java", 1, Integer::sum);
        System.out.println(count.get("java"));
        // 输出：1
    }
}
```

ConcurrentHashMap 不接受 null；merge、computeIfAbsent 的原子性以单键操作为边界，跨键流程仍需要锁或事务协调。

## 简单案例

```java
import java.util.LinkedHashMap;
import java.util.Map;

public class MapSelectionDemo {
    public static void main(String[] args) {
        Map<String, Integer> scores = new LinkedHashMap<>();
        scores.merge("java", 1, Integer::sum);
        System.out.println(scores);
        // 输出：{java=1}
    }
}
```

频次统计使用 merge，比先 get 再 put 更直接；需要顺序时选择 LinkedHashMap。

## 易混点

- HashMap 不承诺顺序，LinkedHashMap 保序，TreeMap 按 key 排序；三者的顺序区别属于实现契约。
- getOrDefault 不写回，putIfAbsent 和 computeIfAbsent 才可能修改 Map。
- keySet、values、entrySet 是视图；Map.copyOf 才是不可修改结构副本。
- ConcurrentHashMap 的单键原子更新不等于整个业务流程原子。

## 课后小问

1. 为什么按值排序后通常得到 List&lt;Entry&gt; 而不是“排序后的 HashMap”？
答案：Map 的基本顺序语义按键映射，按值排序更自然地表示为条目序列。
解析：如果要保留展示顺序，可把条目收集到 LinkedHashMap；不能把 HashMap 本身当成按值有序容器。

2. 为什么 ConcurrentHashMap 不接受 null？
答案：并发 Map 需要区分“没有映射”和“映射到 null”，null 会让 get 的语义不明确。
解析：使用 get、putIfAbsent、computeIfAbsent 时，明确的无映射结果有助于保证并发操作语义。

## 本节小结

- Map 选择先看 key 语义，再看顺序、排序、范围和并发。
- HashMap、LinkedHashMap、TreeMap、ConcurrentHashMap 分别承担不同边界。
- 复合更新优先 merge、computeIfAbsent 等按键操作。
- Map 的视图、不可变副本和并发原子性不能混为一谈。

## 快速回顾

- 能解释四种常见 Map 实现的选择依据。
- 能写出基础读写、复合更新和 entrySet 遍历。
- 能判断 Map key 是否稳定。
- 能说明 ConcurrentHashMap 的原子边界和 null 限制。
