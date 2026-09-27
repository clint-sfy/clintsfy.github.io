---
title: Map 常用 API
date: 2026-09-27
category: Java基础快速入门
tags:
  - Java
  - Map
  - HashMap
  - ConcurrentHashMap
  - 集合
description: 速查 Map 的读写、视图、复合更新、排序和并发边界。
---

# Map 常用 API

## 学习目标

- 用 put、get、containsKey、remove 完成键值读写。
- 用 getOrDefault、putIfAbsent、merge、computeIfAbsent 表达常见复合更新。
- 根据顺序、排序、并发和不可变需求选择 Map 实现。

## 核心知识点

### 专业术语

- **Map**：键到值的映射，键唯一，keySet、values、entrySet 是视图。
- **HashMap**：通用哈希映射，不承诺遍历顺序。
- **LinkedHashMap**：维护插入顺序或访问顺序。
- **TreeMap**：按键排序并支持范围查询。
- **ConcurrentHashMap**：支持并发读写和单键复合更新，不接受 null 键和值。

### 白话解释与边界

Map 的键放入后必须保持 equals/hashCode 或比较关系稳定；修改可变键参与比较的字段会导致条目存在却找不到。get 后再 put 是两个步骤，并发场景优先 merge 或 computeIfAbsent。Map 的视图会跟随源 Map 变化，不要误当作副本。

## 常用用法

### put 和 get：写入与读取

```java
import java.util.LinkedHashMap;
import java.util.Map;

public class MapPutGetDemo {
    public static void main(String[] args) {
        Map<String, Integer> scores = new LinkedHashMap<>();
        Integer old = scores.put("java", 95);
        Integer score = scores.get("java");
        System.out.println(old + ", " + score);
        // 输出：null, 95
    }
}
```

put 会新增或替换并返回旧值；get 找不到键时返回 null，允许 null 值的 Map 不能只靠 get 判断是否存在。

### getOrDefault：读取默认值

```java
import java.util.Map;

public class MapDefaultDemo {
    public static void main(String[] args) {
        Map<String, Integer> map = Map.of("java", 95);
        System.out.println(map.getOrDefault("sql", 0));
        // 输出：0
    }
}
```

getOrDefault 只提供读取时的兜底，不会把默认值写回 Map。

### containsKey 和 containsValue：判断存在性

```java
import java.util.Map;

public class MapContainsDemo {
    public static void main(String[] args) {
        Map<String, Integer> map = Map.of("java", 95);
        System.out.println(map.containsKey("java"));
        // 输出：true
        System.out.println(map.containsValue(90));
        // 输出：false
    }
}
```

判断键优先 containsKey；containsValue 通常需要扫描值，不能用 get 替代。

### remove：按键或键值对删除

```java
import java.util.LinkedHashMap;
import java.util.Map;

public class MapRemoveDemo {
    public static void main(String[] args) {
        Map<String, String> map = new LinkedHashMap<>();
        map.put("draft", "old");
        boolean removed = map.remove("draft", "old");
        System.out.println(removed + ", " + map.isEmpty());
        // 输出：true, true
    }
}
```

remove(key) 按键删除；remove(key, value) 只有键和值同时匹配才删除，适合避免覆盖他人更新后的值。

### entrySet：同时遍历键和值

```java
import java.util.LinkedHashMap;
import java.util.Map;

public class MapEntrySetDemo {
    public static void main(String[] args) {
        Map<String, Integer> map = new LinkedHashMap<>();
        map.put("java", 95);
        map.put("sql", 88);
        for (Map.Entry<String, Integer> entry : map.entrySet()) {
            System.out.println(entry.getKey() + "=" + entry.getValue());
            // 输出：java=95
            // 输出：sql=88
        }
    }
}
```

同时需要键和值时优先 entrySet；entrySet、keySet、values 都是源 Map 的视图。

### putIfAbsent：缺失键才写入

```java
import java.util.LinkedHashMap;
import java.util.Map;

public class MapPutIfAbsentDemo {
    public static void main(String[] args) {
        Map<String, Integer> map = new LinkedHashMap<>();
        map.putIfAbsent("java", 95);
        map.putIfAbsent("java", 100);
        System.out.println(map);
        // 输出：{java=95}
    }
}
```

键不存在或当前值为 null 时写入，已有非 null 值不覆盖；并发 Map 中它还是单键原子更新工具。

### merge：按旧值累加或合并

```java
import java.util.LinkedHashMap;
import java.util.Map;

public class MapMergeDemo {
    public static void main(String[] args) {
        Map<String, Integer> count = new LinkedHashMap<>();
        count.merge("java", 1, Integer::sum);
        count.merge("java", 1, Integer::sum);
        System.out.println(count);
        // 输出：{java=2}
    }
}
```

缺失键直接放入给定值，已有值才执行合并函数；合并结果为 null 时会删除该键。

### computeIfAbsent：缺失时懒创建

```java
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

public class MapComputeIfAbsentDemo {
    public static void main(String[] args) {
        Map<String, List<String>> tags = new LinkedHashMap<>();
        tags.computeIfAbsent("java", key -> new ArrayList<>()).add("String");
        System.out.println(tags);
        // 输出：{java=[String]}
    }
}
```

已有非 null 值时不执行计算；计算结果为 null 时不写入，常用于按键创建列表或集合。

### replace：只替换已存在或匹配旧值的键

```java
import java.util.LinkedHashMap;
import java.util.Map;

public class MapReplaceDemo {
    public static void main(String[] args) {
        Map<String, Integer> map = new LinkedHashMap<>();
        map.put("java", 90);
        boolean replaced = map.replace("java", 90, 95);
        System.out.println(replaced + ", " + map.get("java"));
        // 输出：true, 95
    }
}
```

replace(key, value) 不新增键；三参数版本还要求旧值相等，适合避免覆盖别人已更新的值。

### keySet、values、entrySet：使用 Map 视图

```java
import java.util.LinkedHashMap;
import java.util.Map;

public class MapViewsDemo {
    public static void main(String[] args) {
        Map<String, Integer> map = new LinkedHashMap<>();
        map.put("java", 95);
        map.put("sql", 88);
        System.out.println(map.keySet() + " / " + map.values());
        // 输出：[java, sql] / [95, 88]
    }
}
```

视图会反映源 Map 的变化；需要独立结果时复制到 List 或 Set。

### HashMap、LinkedHashMap、TreeMap：按需求选实现

```java
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.Map;
import java.util.TreeMap;

public class MapImplementationDemo {
    public static void main(String[] args) {
        Map<String, Integer> hash = new HashMap<>(Map.of("b", 2, "a", 1));
        Map<String, Integer> insertion = new LinkedHashMap<>(hash);
        Map<String, Integer> sorted = new TreeMap<>(hash);
        System.out.println(sorted);
        // 输出：{a=1, b=2}
    }
}
```

HashMap 通用但无序，LinkedHashMap 保留顺序，TreeMap 按键排序并支持范围查询；不要把 HashMap 的偶然遍历顺序当契约。

## 不常用但需要知道

### compute 和 computeIfPresent：按存在性重算

```java
import java.util.LinkedHashMap;
import java.util.Map;

public class MapComputeDemo {
    public static void main(String[] args) {
        Map<String, Integer> map = new LinkedHashMap<>();
        map.put("java", 1);
        map.computeIfPresent("java", (key, old) -> old + 1);
        map.compute("sql", (key, old) -> old == null ? 1 : old + 1);
        System.out.println(map);
        // 输出：{java=2, sql=1}
    }
}
```

回调返回 null 可能删除键；逻辑复杂时先写清楚存在与缺失分支，避免回调里产生副作用。

### replaceAll：批量重映射值

```java
import java.util.LinkedHashMap;
import java.util.Map;

public class MapReplaceAllDemo {
    public static void main(String[] args) {
        Map<String, Integer> scores = new LinkedHashMap<>();
        scores.put("java", 90);
        scores.put("sql", 80);
        scores.replaceAll((key, value) -> value + 5);
        System.out.println(scores);
        // 输出：{java=95, sql=85}
    }
}
```

replaceAll 原地更新每个值；不要在回调里递归结构性修改同一个 Map。

### Map.of 和 Map.ofEntries：小型不可变 Map

```java
import java.util.Map;

public class MapFactoryDemo {
    public static void main(String[] args) {
        Map<String, Integer> codes = Map.of("ok", 200, "notFound", 404);
        Map<String, Integer> more = Map.ofEntries(
            Map.entry("created", 201),
            Map.entry("badRequest", 400));
        System.out.println(codes.get("ok") + ", " + more.get("created"));
        // 输出：200, 201
    }
}
```

Map.of 适合少量常量，Map.ofEntries 适合条目稍多的常量；两者都拒绝 null 且不能修改。

### Map.copyOf：不可修改 Map 快照

```java
import java.util.LinkedHashMap;
import java.util.Map;

public class MapCopyOfDemo {
    public static void main(String[] args) {
        Map<String, Integer> source = new LinkedHashMap<>();
        source.put("java", 95);
        Map<String, Integer> snapshot = Map.copyOf(source);
        source.put("java", 100);
        System.out.println(snapshot.get("java"));
        // 输出：95
    }
}
```

Map.copyOf 复制键值结构并拒绝 null；它不深复制可变键和值对象。

### LinkedHashMap 访问顺序：简单 LRU 基础

```java
import java.util.LinkedHashMap;

public class AccessOrderMapDemo {
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

最后一个构造参数 true 开启访问顺序；这只是 LRU 的基础，不自动限制容量或提供并发保护。

### TreeMap.subMap、headMap、tailMap：键范围查询

```java
import java.util.Map;
import java.util.TreeMap;

public class TreeMapRangeDemo {
    public static void main(String[] args) {
        TreeMap<Integer, String> map = new TreeMap<>();
        map.put(1, "a");
        map.put(2, "b");
        map.put(3, "c");
        System.out.println(map.subMap(1, true, 3, false));
        // 输出：{1=a, 2=b}
    }
}
```

范围方法返回 TreeMap 的视图，边界包含关系由重载参数决定；需要独立副本时复制结果。

### ConcurrentHashMap：并发单键复合更新

```java
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ConcurrentMap;

public class ConcurrentMapDemo {
    public static void main(String[] args) {
        ConcurrentMap<String, Integer> counts = new ConcurrentHashMap<>();
        counts.merge("java", 1, Integer::sum);
        counts.merge("java", 1, Integer::sum);
        System.out.println(counts.get("java"));
        // 输出：2
    }
}
```

ConcurrentHashMap 支持并发访问和单键 compute、merge、putIfAbsent；不接受 null，也不自动把多个键的业务更新组成事务。

### Collections.synchronizedMap：同步包装

```java
import java.util.Collections;
import java.util.HashMap;
import java.util.Map;

public class SynchronizedMapDemo {
    public static void main(String[] args) {
        Map<String, Integer> map =
            Collections.synchronizedMap(new HashMap<>());
        map.put("java", 95);
        synchronized (map) {
            System.out.println(map.get("java"));
            // 输出：95
        }
    }
}
```

包装只同步单次方法调用；遍历和多步组合仍要按文档对包装对象加锁。新并发代码通常优先选择 ConcurrentHashMap。

## 简单案例

```java
import java.util.HashMap;
import java.util.Map;

public class MapSummaryDemo {
    public static void main(String[] args) {
        Map<String, Integer> count = new HashMap<>();
        count.merge("java", 1, Integer::sum);
        System.out.println(count);
        // 输出：{java=1}
    }
}
```

Map 常用路径是按 key 读写和用 merge 表达复合更新。

## 易混点

- getOrDefault 不会写回默认值，computeIfAbsent 才会在需要时创建并保存。
- HashMap 无序，LinkedHashMap 保序，TreeMap 按键排序；按值排序应得到条目列表。
- Map 的 keySet、values、entrySet 是视图，不是自动快照。
- ConcurrentHashMap 不接受 null，且单键原子不等于跨多键事务安全。

## 课后小问

1. 为什么统计词频优先使用 merge？
答案：merge 把缺失键初始化和已存在键累加表达在一次操作中。
解析：get 后 put 是两个步骤，在并发场景可能丢失更新；ConcurrentHashMap 的 merge 还能提供单键复合更新语义。

2. 为什么 Map.copyOf 后修改 source 不会改变 snapshot？
答案：copyOf 复制了键值容器结构，返回不可修改结果。
解析：这是浅结构复制，键和值对象自身若可变仍可能通过其他引用变化。

## 本节小结

- put/get/containsKey/remove 是 Map 基础读写，entrySet 是键值遍历首选。
- getOrDefault、putIfAbsent、merge、computeIfAbsent 让复合更新更清晰。
- HashMap、LinkedHashMap、TreeMap 分别表达通用、保序和排序范围需求。
- ConcurrentHashMap 只承诺并发单键操作，跨键事务仍需外部协调。

## 快速回顾

- 能写出 Map 的基础读写和视图遍历。
- 能选择 getOrDefault、merge 或 computeIfAbsent。
- 能区分不可变 Map、只读包装和并发 Map。
- 能解释可变 key、顺序和范围视图的边界。
