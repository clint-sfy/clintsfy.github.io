---
title: Map 常用 API
date: 2026-09-27T00:00:00.000Z
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

### Map.put：写入键值对

put 会新增或替换键对应的值，并返回该键原来的值。

```java
// 语义：put 会新增或替换键对应的值，并返回该键原来的值。
// 初始状态：scores 初始为 new LinkedHashMap<>()；old 初始为 scores.put("java", 95)。
import java.util.LinkedHashMap;
import java.util.Map;

public class MapPutDemo {
    public static void main(String[] args) {
        Map<String, Integer> scores = new LinkedHashMap<>();
        Integer old = scores.put("java", 95);
        System.out.println(old + ", " + scores);
        // 输出：null, {java=95}
    }
}
```

### Map.get：按键读取值

get 返回键对应的值，键不存在时返回 null。

```java
// 语义：get 返回键对应的值，键不存在时返回 null。
// 初始状态：scores 初始为 new LinkedHashMap<>()。
import java.util.LinkedHashMap;
import java.util.Map;

public class MapGetDemo {
    public static void main(String[] args) {
        Map<String, Integer> scores = new LinkedHashMap<>();
        scores.put("java", 95);
        System.out.println(scores.get("java"));
        System.out.println(scores.get("sql"));
        // 输出：95
        // 输出：null
    }
}
```

### getOrDefault：读取默认值

getOrDefault 只提供读取时的兜底，不会把默认值写回 Map。

```java
// 语义：getOrDefault 只提供读取时的兜底，不会把默认值写回 Map。
// 初始状态：map 初始为 Map.of("java", 95)。
import java.util.Map;

public class MapDefaultDemo {
    public static void main(String[] args) {
        Map<String, Integer> map = Map.of("java", 95);
        System.out.println(map.getOrDefault("sql", 0));
        // 输出：0
    }
}
```

### Map.containsKey：判断键是否存在

containsKey 能区分“键缺失”和“键存在但映射到 null”。

```java
// 语义：containsKey 能区分“键缺失”和“键存在但映射到 null”。
// 初始状态：map 初始为 Map.of("java", 95)。
import java.util.Map;

public class MapContainsKeyDemo {
    public static void main(String[] args) {
        Map<String, Integer> map = Map.of("java", 95);
        System.out.println(map.containsKey("java"));
        // 输出：true
    }
}
```

### Map.containsValue：判断值是否存在

containsValue 通常需要扫描全部值，不适合放在高频热点循环中。

```java
// 语义：containsValue 通常需要扫描全部值，不适合放在高频热点循环中。
// 初始状态：map 初始为 Map.of("java", 95)。
import java.util.Map;

public class MapContainsValueDemo {
    public static void main(String[] args) {
        Map<String, Integer> map = Map.of("java", 95);
        System.out.println(map.containsValue(95));
        System.out.println(map.containsValue(90));
        // 输出：true
        // 输出：false
    }
}
```

### `Map.remove`：按键或键值对删除

remove(key) 按键删除；remove(key, value) 只有键和值同时匹配才删除，适合避免覆盖他人更新后的值。

```java
// 语义：remove(key) 按键删除。
// 初始状态：map 初始为 new LinkedHashMap<>()；removed 初始为 map.remove("draft", "old")。
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

### entrySet：同时遍历键和值

同时需要键和值时优先 entrySet；entrySet、keySet、values 都是源 Map 的视图。

```java
// 语义：同时需要键和值时优先 entrySet。
// 初始状态：map 初始为 new LinkedHashMap<>()。
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

### putIfAbsent：缺失键才写入

键不存在或当前值为 null 时写入，已有非 null 值不覆盖；并发 Map 中它还是单键原子更新工具。

```java
// 语义：键不存在或当前值为 null 时写入，已有非 null 值不覆盖。
// 初始状态：map 初始为 new LinkedHashMap<>()。
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

### merge：按旧值累加或合并

缺失键直接放入给定值，已有值才执行合并函数；合并结果为 null 时会删除该键。

```java
// 语义：缺失键直接放入给定值，已有值才执行合并函数。
// 初始状态：count 初始为 new LinkedHashMap<>()。
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

### computeIfAbsent：缺失时懒创建

已有非 null 值时不执行计算；计算结果为 null 时不写入，常用于按键创建列表或集合。

```java
// 语义：已有非 null 值时不执行计算。
// 初始状态：tags 初始为 new LinkedHashMap<>()。
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

### replace：只替换已存在或匹配旧值的键

replace(key, value) 不新增键；三参数版本还要求旧值相等，适合避免覆盖别人已更新的值。

```java
// 语义：replace(key, value) 不新增键。
// 初始状态：map 初始为 new LinkedHashMap<>()；replaced 初始为 map.replace("java", 90, 95)。
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

### Map.keySet：获取键视图

keySet 返回与源 Map 联动的键视图，需要独立结果时显式复制。

```java
// 语义：keySet 返回与源 Map 联动的键视图，需要独立结果时显式复制。
// 初始状态：map 初始为 new LinkedHashMap<>()。
import java.util.LinkedHashMap;
import java.util.Map;

public class MapKeySetDemo {
    public static void main(String[] args) {
        Map<String, Integer> map = new LinkedHashMap<>();
        map.put("java", 95);
        map.put("sql", 88);
        map.keySet().remove("sql");
        System.out.println(map);
        // 输出：{java=95}
    }
}
```

### Map.values：获取值视图

values 返回与源 Map 联动的值视图，并允许出现重复值。

```java
// 语义：values 返回与源 Map 联动的值视图，并允许出现重复值。
// 初始状态：map 初始为 new LinkedHashMap<>()。
import java.util.LinkedHashMap;
import java.util.Map;

public class MapValuesDemo {
    public static void main(String[] args) {
        Map<String, Integer> map = new LinkedHashMap<>();
        map.put("java", 95);
        map.put("sql", 95);
        System.out.println(map.values());
        // 输出：[95, 95]
    }
}
```

### Map.entrySet：获取键值条目视图

entrySet 适合同时读取键和值，条目视图也会与源 Map 联动。

```java
// 语义：entrySet 适合同时读取键和值，条目视图也会与源 Map 联动。
// 初始状态：map 初始为 new LinkedHashMap<>()。
import java.util.LinkedHashMap;
import java.util.Map;

public class MapEntrySetViewDemo {
    public static void main(String[] args) {
        Map<String, Integer> map = new LinkedHashMap<>();
        map.put("java", 95);
        System.out.println(map.entrySet());
        // 输出：[java=95]
    }
}
```

### HashMap：通用键值查找

HashMap 提供通用的快速键值查找，但不承诺遍历顺序。

```java
// 语义：HashMap 提供通用的快速键值查找，但不承诺遍历顺序。
// 初始状态：hash 初始为 new HashMap<>(Map.of("b", 2, "a", 1))。
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.Map;
import java.util.TreeMap;

public class HashMapDemo {
    public static void main(String[] args) {
        Map<String, Integer> hash = new HashMap<>(Map.of("b", 2, "a", 1));
        System.out.println(hash.get("a"));
        // 输出：1
    }
}
```

### LinkedHashMap：保留迭代顺序

LinkedHashMap 默认保留插入顺序，也可以配置为按访问顺序排列。

```java
// 语义：LinkedHashMap 默认保留插入顺序，也可以配置为按访问顺序排列。
// 初始状态：map 初始为 new LinkedHashMap<>()。
import java.util.LinkedHashMap;
import java.util.Map;

public class LinkedHashMapDemo {
    public static void main(String[] args) {
        Map<String, Integer> map = new LinkedHashMap<>();
        map.put("b", 2);
        map.put("a", 1);
        System.out.println(map);
        // 输出：{b=2, a=1}
    }
}
```

### TreeMap：按键排序

TreeMap 按键的自然顺序或比较器排序，并支持范围查询。

```java
// 语义：TreeMap 按键的自然顺序或比较器排序，并支持范围查询。
// 初始状态：map 初始为 new TreeMap<>()。
import java.util.Map;
import java.util.TreeMap;

public class TreeMapDemo {
    public static void main(String[] args) {
        Map<String, Integer> map = new TreeMap<>();
        map.put("b", 2);
        map.put("a", 1);
        System.out.println(map);
        // 输出：{a=1, b=2}
    }
}
```
## 不常用但需要知道

### Map.compute：按当前映射重算

compute 无论键是否存在都会调用回调，回调返回 null 时会删除映射。

```java
// 作用：通过 Map.compute 按当前映射重算。
import java.util.LinkedHashMap;
import java.util.Map;

public class MapComputeDemo {
    public static void main(String[] args) {
        Map<String, Integer> map = new LinkedHashMap<>();
        map.compute("sql", (key, old) -> old == null ? 1 : old + 1);
        System.out.println(map);
        // 输出：{sql=1}
    }
}
```

### Map.computeIfPresent：存在时重算

computeIfPresent 只处理已有非 null 值的键，回调返回 null 时删除该键。

```java
// 作用：通过 Map.computeIfPresent 存在时重算。
import java.util.LinkedHashMap;
import java.util.Map;

public class MapComputeIfPresentDemo {
    public static void main(String[] args) {
        Map<String, Integer> map = new LinkedHashMap<>();
        map.put("java", 1);
        map.computeIfPresent("java", (key, old) -> old + 1);
        System.out.println(map);
        // 输出：{java=2}
    }
}
```

### replaceAll：批量重映射值

replaceAll 原地更新每个值；不要在回调里递归结构性修改同一个 Map。

```java
// 初始状态：scores 中 java=90、sql=80；replaceAll 把每个 value 原地增加 5。
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

### Map.of：创建少量不可变映射

Map.of 适合少量常量键值对，拒绝 null 和重复键且不能修改。

```java
// 作用：通过 Map.of 创建少量不可变映射。
import java.util.Map;

public class MapOfDemo {
    public static void main(String[] args) {
        Map<String, Integer> codes = Map.of("ok", 200, "notFound", 404);
        System.out.println(codes.get("ok"));
        // 输出：200
    }
}
```

### Map.ofEntries：创建多条不可变映射

Map.ofEntries 用条目参数创建不可变映射，适合键值对较多的常量。

```java
// 作用：通过 Map.ofEntries 创建多条不可变映射。
import java.util.Map;

public class MapOfEntriesDemo {
    public static void main(String[] args) {
        Map<String, Integer> codes = Map.ofEntries(
            Map.entry("created", 201),
            Map.entry("badRequest", 400));
        System.out.println(codes.get("created"));
        // 输出：201
    }
}
```

### Map.copyOf：不可修改 Map 快照

Map.copyOf 复制键值结构并拒绝 null；它不深复制可变键和值对象。

```java
// 作用：通过 Map.copyOf 不可修改 Map 快照。
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

### LinkedHashMap 访问顺序：简单 LRU 基础

最后一个构造参数 true 开启访问顺序；这只是 LRU 的基础，不自动限制容量或提供并发保护。

```java
// 初始状态：map 以 accessOrder=true 按访问排序；get("A") 后 keySet 从 [A, B] 变为 [B, A]。
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

### TreeMap.subMap：查询键区间视图

subMap 返回两个键边界之间的动态视图，需要独立结果时复制它。

```java
// 作用：通过 TreeMap.subMap 查询键区间视图。
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

### TreeMap.headMap：查询小于上界的键视图

headMap 返回上界之前的动态视图，布尔参数决定是否包含上界。

```java
// 作用：通过 TreeMap.headMap 查询小于上界的键视图。
import java.util.TreeMap;

public class TreeMapHeadMapDemo {
    public static void main(String[] args) {
        TreeMap<Integer, String> map = new TreeMap<>();
        map.put(1, "a");
        map.put(2, "b");
        map.put(3, "c");
        System.out.println(map.headMap(2, true));
        // 输出：{1=a, 2=b}
    }
}
```

### TreeMap.tailMap：查询大于下界的键视图

tailMap 返回下界之后的动态视图，布尔参数决定是否包含下界。

```java
// 作用：通过 TreeMap.tailMap 查询大于下界的键视图。
import java.util.TreeMap;

public class TreeMapTailMapDemo {
    public static void main(String[] args) {
        TreeMap<Integer, String> map = new TreeMap<>();
        map.put(1, "a");
        map.put(2, "b");
        map.put(3, "c");
        System.out.println(map.tailMap(2, false));
        // 输出：{3=c}
    }
}
```

### ConcurrentHashMap：并发单键复合更新

ConcurrentHashMap 支持并发访问和单键 compute、merge、putIfAbsent；不接受 null，也不自动把多个键的业务更新组成事务。

```java
// 初始状态：counts 为空；两次 merge("java", 1, Integer::sum) 以单键原子更新将计数累加到 2。
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

### Collections.synchronizedMap：同步包装

包装只同步单次方法调用；遍历和多步组合仍要按文档对包装对象加锁。新并发代码通常优先选择 ConcurrentHashMap。

```java
// 作用：通过 Collections.synchronizedMap 同步包装。
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
## 简单案例

### `Map.size`：统计映射条目数量

它统计键值条目而不是不同值的数量，同一个键重复写入不会增加结果。

```java
// 作用：通过 Map.size 统计映射条目数量。
import java.util.HashMap;
import java.util.Map;
Map<String, Integer> scores = new HashMap<>();
scores.put("A", 1);
scores.put("A", 2);
System.out.println(scores.size());
// 输出：1
```

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

- getOrDefault 不会写回默认值，而不是“读取后自动保存”；computeIfAbsent 才会在需要时创建并保存。
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
