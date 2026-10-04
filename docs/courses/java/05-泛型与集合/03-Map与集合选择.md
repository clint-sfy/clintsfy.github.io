---
title: Map 与集合选择总览
date: 2026-09-27T00:00:00.000Z
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

## 常用用法

### `Map.put`：写入键值

需要新增或覆盖键对应的值时使用 `put`，返回值是旧值。

```java
import java.util.LinkedHashMap;
import java.util.Map;

public class MapBasicOverviewDemo {
    public static void main(String[] args) {
        Map<String, Integer> scores = new LinkedHashMap<>();
        // 初始状态：scores 当前为 new LinkedHashMap<>()。
        scores.put("java", 95);
        // 作用：需要新增或覆盖键对应的值时使用 put，返回值是旧值。
        System.out.println(scores);
        // 输出：{java=95}
    }
}
```

### `Map.get`：按键读取值

需要读取键对应的值时使用 `get`，键缺失时返回 `null`。

```java
import java.util.Map;

Map<String, Integer> scores = Map.of("java", 95);
// 初始状态：scores 当前为 Map.of("java", 95)。
System.out.println(scores.get("java"));
// 输出：95
// 作用：需要读取键对应的值时使用 get，键缺失时返回 null。
```

### `Map.containsKey`：判断键是否存在

需要区分“键不存在”和“键映射到 null”时使用 `containsKey`。

```java
import java.util.HashMap;
import java.util.Map;

Map<String, Integer> scores = new HashMap<>();
// 初始状态：scores 当前为 new HashMap<>()。
scores.put("java", null);
System.out.println(scores.containsKey("java"));
// 输出：true
// 作用：需要区分“键不存在”和“键映射到 null”时使用 containsKey。
```

### `Map.merge`：合并键对应的值

需要累加计数或按规则合并新旧值时使用 `merge`。

```java
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class MapCompoundOverviewDemo {
    public static void main(String[] args) {
        Map<String, Integer> count = new HashMap<>();
        // 初始状态：count 当前为 new HashMap<>()。
        count.merge("java", 1, Integer::sum);
        // 作用：需要累加计数或按规则合并新旧值时使用 merge。
        System.out.println(count);
        // 输出：{java=1}
    }
}
```

### `Map.computeIfAbsent`：缺失时初始化值

需要按键延迟创建集合或昂贵对象时使用 `computeIfAbsent`。

```java
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

Map<String, List<String>> groups = new HashMap<>();
// 初始状态：groups 当前为 new HashMap<>()。
groups.computeIfAbsent("java", key -> new ArrayList<>()).add("String");
// 作用：需要按键延迟创建集合或昂贵对象时使用 computeIfAbsent。
System.out.println(groups);
// 输出：{java=[String]}
```

### `HashMap`：通用键值映射

不需要稳定迭代顺序或按键排序时，通常使用 `HashMap`。

```java
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.Map;
import java.util.TreeMap;

public class MapChoiceOverviewDemo {
    public static void main(String[] args) {
        Map<String, Integer> hash = new HashMap<>();
        // 初始状态：hash 当前为 new HashMap<>()。
        // 作用：不需要稳定迭代顺序或按键排序时，通常使用 HashMap。
        hash.put("b", 2);
        System.out.println(hash.getClass().getSimpleName());
        // 输出：HashMap
    }
}
```

### `LinkedHashMap`：保留插入顺序

需要稳定地按插入顺序遍历键值时使用 `LinkedHashMap`。

```java
import java.util.LinkedHashMap;
import java.util.Map;

Map<String, Integer> map = new LinkedHashMap<>();
// 初始状态：map 当前为 new LinkedHashMap<>()。
// 作用：需要稳定地按插入顺序遍历键值时使用 LinkedHashMap。
map.put("b", 2);
map.put("a", 1);
System.out.println(map.keySet());
// 输出：[b, a]
```

### `TreeMap`：按键排序

需要键的有序遍历或范围查询时使用 `TreeMap`。

```java
import java.util.Map;
import java.util.TreeMap;

Map<String, Integer> map = new TreeMap<>();
// 初始状态：map 当前为 new TreeMap<>()。
// 作用：需要键的有序遍历或范围查询时使用 TreeMap。
map.put("b", 2);
map.put("a", 1);
System.out.println(map.keySet());
// 输出：[a, b]
```

### 按 key 的稳定性选择不可变键

优先使用 String、数字或 record 作为 key；可变 key 放入后不要修改参与 equals/hashCode 的字段。

```java
// 语义：优先使用 String、数字或 record 作为 key。
// 初始状态：map 初始为 new HashMap<>()。
import java.util.HashMap;
import java.util.Map;

record UserKey(String id) {}

public class MapStableKeyDemo {
    public static void main(String[] args) {
        Map<UserKey, Integer> map = new HashMap<>();
// 关键变化：map 接收表达式 new HashMap<>() 的计算结果。
// 初始状态：map 的初始值为 new HashMap<>()。
        map.put(new UserKey("u-1"), 95);
        System.out.println(map.get(new UserKey("u-1")));
        // 输出：95
    }
}
```

### 用 entrySet 遍历键值

entrySet 同时提供 key 和 value；只需要键或值时才使用 keySet 或 values。

```java
// 语义：entrySet 同时提供 key 和 value。
// 初始状态：map 初始为 new LinkedHashMap<>(Map.of("java", 95))。
import java.util.LinkedHashMap;
import java.util.Map;

public class MapEntryOverviewDemo {
    public static void main(String[] args) {
        Map<String, Integer> map = new LinkedHashMap<>(Map.of("java", 95));
// 关键变化：map 接收表达式 new LinkedHashMap<>(Map.of("java", 95)) 的计算结果。
// 初始状态：map 的初始值为 new LinkedHashMap<>(Map.of("java", 95))。
        for (Map.Entry<String, Integer> entry : map.entrySet()) {
            System.out.println(entry.getKey() + "=" + entry.getValue());
            // 输出：java=95
        }
    }
}
```
## 不常用但需要知道

### Map.copyOf：复制为不可变 Map

不可变工厂拒绝 null；Map.copyOf 复制容器结构但不会深复制键和值对象。

```java
import java.util.Map;

public class MapImmutableOverviewDemo {
// 初始状态：constants 只有映射 "ok" -> 200，Map.copyOf 保留该映射并返回不可修改的 copy。
    public static void main(String[] args) {
        Map<String, Integer> constants = Map.of("ok", 200);
        // 初始状态：constants 当前为 Map.of("ok", 200)。
        Map<String, Integer> copy = Map.copyOf(constants);
        // 作用：不可变工厂拒绝 null；Map.copyOf 复制容器结构但不会深复制键和值对象。
        System.out.println(copy);
        // 输出：{ok=200}
    }
}
```

### LinkedHashMap 访问顺序：LRU 基础

访问顺序只维护最近访问排列，不自动实现容量淘汰；完整边界见 Map 常用 API。

```java
// 初始状态：map 以 accessOrder=true 保存 A、B；get("A") 将 A 移到访问顺序的末尾。
import java.util.LinkedHashMap;

public class MapAccessOrderOverviewDemo {
    public static void main(String[] args) {
    // 作用：访问顺序只维护最近访问排列，不自动实现容量淘汰；完整边界见 Map 常用 API。
        LinkedHashMap<String, Integer> map =
            new LinkedHashMap<>(16, 0.75f, true);
// // 关键变化：LinkedHashMap<String, Integer> map = 使用表达式中的具体参数完成本次调用。
// 初始状态：表达式为 LinkedHashMap<String, Integer> map =。
        map.put("A", 1);
        map.put("B", 2);
        map.get("A");
        System.out.println(map.keySet());
        // 输出：[B, A]
    }
}
```

### ConcurrentHashMap：并发单键操作

ConcurrentHashMap 不接受 null；merge、computeIfAbsent 的原子性以单键操作为边界，跨键流程仍需要锁或事务协调。

```java
import java.util.concurrent.ConcurrentHashMap;

public class ConcurrentMapOverviewDemo {
// 初始状态：count 是空 ConcurrentHashMap。
// 初始状态：merge("java", 1, Integer::sum) 原子地建立 java -> 1。
    public static void main(String[] args) {
        ConcurrentHashMap<String, Integer> count = new ConcurrentHashMap<>();
// 输入：count 的初始值为 new ConcurrentHashMap<>()。
        // 作用：ConcurrentHashMap 不接受 null；merge、computeIfAbsent 的原子性以单键操作为边界，跨键流程仍需要锁或事务协调。
        count.merge("java", 1, Integer::sum);
        System.out.println(count.get("java"));
        // 输出：1
    }
}
```
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
