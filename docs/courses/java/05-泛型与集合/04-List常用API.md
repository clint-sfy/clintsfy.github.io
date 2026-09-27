---
title: List 常用 API
date: 2026-09-27
category: Java基础快速入门
tags:
  - Java
  - List
  - ArrayList
  - 集合
description: 按增删改查、遍历、排序和视图边界速查 List 与 ArrayList 的常用 API。
---

# List 常用 API

## 学习目标

- 会用 ArrayList 完成 List 的增删改查、遍历和排序。
- 分清按索引删除与按对象删除，识别 subList 和 Arrays.asList 的视图边界。
- 能选择可变列表、不可变列表或只读包装。

## 核心知识点

### 专业术语

- **List**：有序、可重复、支持按索引访问的集合接口。
- **ArrayList**：基于动态数组的通用 List，按索引读取通常很快。
- **视图（view）**：与源集合共享数据的窗口，例如 subList 和 Arrays.asList。
- **不可变集合**：不能通过当前引用进行结构性修改的集合结果。

### 白话解释与边界

普通业务列表优先 ArrayList；需要按索引读取、末尾追加和遍历时，它通常比 LinkedList 更合适。List 的索引从 0 开始，区间通常是左闭右开。List.of 和 List.copyOf 返回不可修改结果，Arrays.asList 返回固定大小的数组视图，不是普通可变 ArrayList。

## 常用用法

### 创建可变 List

```java
import java.util.ArrayList;
import java.util.List;

public class ListCreateDemo {
    public static void main(String[] args) {
        List<String> names = new ArrayList<>(List.of("Alice", "Bob"));
        names.add("Carol");
        System.out.println(names);
        // 输出：[Alice, Bob, Carol]
    }
}
```

需要增删改时使用 ArrayList；从已有集合复制到 ArrayList 可以获得独立的可变容器。

### add：追加或按索引插入

```java
import java.util.ArrayList;
import java.util.List;

public class ListAddDemo {
    public static void main(String[] args) {
        List<String> list = new ArrayList<>(List.of("a", "c"));
        list.add("d");
        list.add(1, "b");
        System.out.println(list);
        // 输出：[a, b, c, d]
    }
}
```

add(value) 追加到末尾，add(index, value) 会移动后续元素；插入索引允许等于 size。

### addAll：批量追加或插入

```java
import java.util.ArrayList;
import java.util.List;

public class ListAddAllDemo {
    public static void main(String[] args) {
        List<String> list = new ArrayList<>(List.of("a"));
        list.addAll(List.of("b", "c"));
        list.addAll(1, List.of("x", "y"));
        System.out.println(list);
        // 输出：[a, x, y, b, c]
    }
}
```

addAll 返回是否发生变化；批量操作通常比多次手动插入更清晰。

### get 和 set：读取与替换

```java
import java.util.ArrayList;
import java.util.List;

public class ListGetSetDemo {
    public static void main(String[] args) {
        List<String> list = new ArrayList<>(List.of("a", "b"));
        String old = list.set(1, "B");
        System.out.println(list.get(1) + ", old=" + old);
        // 输出：B, old=b
    }
}
```

get(index) 读取元素，set(index, value) 替换并返回旧值；两者都要求索引在 0 到 size-1 之间。

### remove：按索引与按值删除

```java
import java.util.ArrayList;
import java.util.List;

public class ListRemoveDemo {
    public static void main(String[] args) {
        List<Integer> list = new ArrayList<>(List.of(10, 20, 30));
        list.remove(1);
        list.remove(Integer.valueOf(30));
        System.out.println(list);
        // 输出：[10]
    }
}
```

List&lt;Integer&gt; 的 remove(1) 是按索引删除；按值删除要写 Integer.valueOf(1)。remove(Object) 找不到时返回 false。

### contains、indexOf 和 lastIndexOf：查找

```java
import java.util.List;

public class ListSearchDemo {
    public static void main(String[] args) {
        List<String> list = List.of("java", "sql", "java");
        System.out.println(list.contains("sql"));
        // 输出：true
        System.out.println(list.indexOf("java") + ", " + list.lastIndexOf("java"));
        // 输出：0, 2
    }
}
```

查找依赖元素的 equals；indexOf 和 lastIndexOf 找不到时返回 -1。

### for、forEach 和 Iterator.remove：遍历与删除

```java
import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;

public class ListIterationDemo {
    public static void main(String[] args) {
        List<String> list = new ArrayList<>(List.of("java", "", "sql"));
        for (Iterator<String> it = list.iterator(); it.hasNext();) {
            if (it.next().isBlank()) {
                it.remove();
            }
        }
        list.forEach(System.out::println);
        // 输出：java
        // 输出：sql
    }
}
```

只读遍历可用增强 for 或 forEach；遍历中删除当前元素用 Iterator.remove 或 removeIf，不要直接结构性修改 ArrayList。

### removeIf：按条件批量删除

```java
import java.util.ArrayList;
import java.util.List;

public class ListRemoveIfDemo {
    public static void main(String[] args) {
        List<Integer> numbers = new ArrayList<>(List.of(1, 2, 3, 4));
        numbers.removeIf(number -> number % 2 == 0);
        System.out.println(numbers);
        // 输出：[1, 3]
    }
}
```

removeIf 直接表达按条件删除，返回是否有元素被删除；条件应保持简单，不要在谓词中再次修改同一个列表。

### sort：原地排序

```java
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;

public class ListSortDemo {
    public static void main(String[] args) {
        List<String> list = new ArrayList<>(List.of("Java", "C", "Python"));
        list.sort(Comparator.comparingInt(String::length));
        System.out.println(list);
        // 输出：[C, Java, Python]
    }
}
```

sort 会修改当前列表；Comparator 的组合和 null 排序见集合排序与不可变集合页面。

### subList：获取左闭右开视图

```java
import java.util.ArrayList;
import java.util.List;

public class ListSubListDemo {
    public static void main(String[] args) {
        List<String> source = new ArrayList<>(List.of("a", "b", "c"));
        List<String> view = source.subList(0, 2);
        view.set(0, "A");
        System.out.println(source + " / " + view);
        // 输出：[A, b, c] / [A, b]
    }
}
```

subList 是源列表的视图，区间是 from inclusive、to exclusive；需要独立副本时写 new ArrayList&lt;&gt;(source.subList(...))。

### List.of 和 List.copyOf：创建不可修改列表

```java
import java.util.ArrayList;
import java.util.List;

public class ListImmutableFactoryDemo {
    public static void main(String[] args) {
        List<String> source = new ArrayList<>(List.of("a"));
        List<String> snapshot = List.copyOf(source);
        source.add("b");
        System.out.println(snapshot);
        // 输出：[a]
    }
}
```

List.of 直接创建不可修改列表，List.copyOf 复制当前结构；两者都拒绝 null 元素，调用 add、remove、set 会抛 UnsupportedOperationException。

### toArray：把 List 转为数组

```java
import java.util.List;

public class ListToArrayDemo {
    public static void main(String[] args) {
        List<String> list = List.of("a", "b");
        String[] array = list.toArray(String[]::new);
        System.out.println(array.length + ", " + array[0]);
        // 输出：2, a
    }
}
```

带数组构造器的方法引用可以得到正确的运行时类型；老代码中 toArray(new String[0]) 也常见。

## 不常用但需要知道

### Arrays.asList：固定大小数组视图

```java
import java.util.Arrays;
import java.util.List;

public class ArraysAsListDemo {
    public static void main(String[] args) {
        List<String> fixed = Arrays.asList("a", "b");
        fixed.set(0, "A");
        System.out.println(fixed);
        // 输出：[A, b]
    }
}
```

Arrays.asList 允许 set，但不允许 add 或 remove；底层数组与列表共享元素，需要普通可变列表时复制到 ArrayList。

### Collections.unmodifiableList：只读包装视图

```java
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

public class UnmodifiableListDemo {
    public static void main(String[] args) {
        List<String> source = new ArrayList<>(List.of("a"));
        List<String> view = Collections.unmodifiableList(source);
        source.add("b");
        System.out.println(view);
        // 输出：[a, b]
    }
}
```

包装引用不能修改，但源列表变化会反映到 view；需要快照时使用 List.copyOf。

### listIterator：双向遍历并修改

```java
import java.util.ArrayList;
import java.util.List;
import java.util.ListIterator;

public class ListIteratorDemo {
    public static void main(String[] args) {
        List<String> list = new ArrayList<>(List.of("a", "b"));
        ListIterator<String> it = list.listIterator();
        it.next();
        it.set("A");
        it.add("x");
        System.out.println(list);
        // 输出：[A, x, b]
    }
}
```

listIterator 适合需要在当前位置插入、替换或反向移动的旧式算法；普通遍历优先增强 for。

### Collections.binarySearch：在有序列表中二分查找

```java
import java.util.Collections;
import java.util.List;

public class BinarySearchListDemo {
    public static void main(String[] args) {
        List<Integer> sorted = List.of(1, 3, 5, 7);
        int index = Collections.binarySearch(sorted, 5);
        System.out.println(index);
        // 输出：2
    }
}
```

列表必须按相同的自然顺序或 Comparator 排序；未找到时返回负的插入点编码，不要直接把负数当普通索引。

### Collections.rotate、swap 和 frequency：小型批量工具

```java
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

public class CollectionsListToolsDemo {
    public static void main(String[] args) {
        List<String> list = new ArrayList<>(List.of("a", "b", "a"));
        Collections.swap(list, 0, 1);
        int count = Collections.frequency(list, "a");
        System.out.println(list + ", count=" + count);
        // 输出：[b, a, a], count=2
    }
}
```

这些工具适合局部算法和兼容旧代码；集合排序、不可变结果和 Comparator 组合见第08页。

## 简单案例

```java
import java.util.ArrayList;
import java.util.List;

public class ListSummaryDemo {
    public static void main(String[] args) {
        List<String> list = new ArrayList<>(List.of("java"));
        list.add("api");
        System.out.println(list);
        // 输出：[java, api]
    }
}
```

List 的常见路径就是创建、追加、读取和遍历；需要去重或队列语义时切换到对应集合页面。

## 易混点

- remove(1) 对 List&lt;Integer&gt; 是按索引，而不是删除值 1；按值写 Integer.valueOf(1)。
- subList、Arrays.asList 和 unmodifiableList 可能是视图，不等于独立不可变副本。
- List.of、List.copyOf 拒绝 null；ArrayList 可以保存 null，但业务上是否允许要先约定。
- 遍历中直接结构性修改可能触发 ConcurrentModificationException，应使用 Iterator.remove 或 removeIf。

## 课后小问

1. 为什么 source.subList(0, 2) 之后修改 view 会改变 source？
答案：subList 返回的是共享源列表的视图，而不是独立副本。
解析：需要隔离结构时复制到 new ArrayList；源列表结构变化也可能让旧视图失效。

2. 为什么 List&lt;Integer&gt; 的 remove(1) 容易写错？
答案：重载选择优先匹配 int 索引，所以它删除第二个元素。
解析：按值删除要传 Integer.valueOf(1)，或使用 removeIf 明确表达条件。

## 本节小结

- ArrayList 是通用可变 List，支持索引读取、增删改查和原地排序。
- List.of、List.copyOf 适合不可修改结果，Arrays.asList 是固定大小数组视图。
- subList 和 unmodifiableList 的视图边界需要在 API 传递时说明。
- Iterator.remove、removeIf 能安全表达遍历删除，避免并发修改异常。

## 快速回顾

- 能写出 List 的增删改查和遍历。
- 能区分按索引 remove 与按值 remove。
- 能判断一个列表是可变、固定大小、只读视图还是不可变快照。
- 能解释 subList 的左闭右开和共享结构。
