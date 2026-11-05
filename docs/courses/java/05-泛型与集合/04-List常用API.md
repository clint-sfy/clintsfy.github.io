---
title: List 常用 API
date: 2026-09-27T00:00:00.000Z
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

需要增删改时使用 ArrayList；从已有集合复制到 ArrayList 可以获得独立的可变容器。

```java
import java.util.ArrayList;
import java.util.List;

public class ListCreateDemo {
    public static void main(String[] args) {
        List<String> names = new ArrayList<>(List.of("Alice", "Bob"));
        // 此时 names 是 [Alice, Bob]。
        names.add("Carol");
        System.out.println(names);
        // 输出：[Alice, Bob, Carol]
    }
}
```

### `List.add`：追加或按索引插入

add(value) 追加到末尾，add(index, value) 会移动后续元素；插入索引允许等于 size。

```java
import java.util.ArrayList;
import java.util.List;

public class ListAddDemo {
    public static void main(String[] args) {
        List<String> list = new ArrayList<>(List.of("a", "c"));
        // 从 [a, c] 开始。
        list.add("d");
        // 末尾追加后：[a, c, d]。
        list.add(1, "b");
        System.out.println(list);
        // 输出：[a, b, c, d]
    }
}
```

### `List.addAll`：批量追加或插入

`addAll(collection)` 按来源集合的迭代顺序追加元素；带索引的重载从指定位置插入并将后续元素后移。

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

返回值表示列表是否发生变化，来源为空时返回 false。

### `List.get`：按索引读取

需要读取指定位置的元素时使用 `get`，索引必须在 `0` 到 `size - 1` 之间。

```java
import java.util.List;

List<String> list = List.of("a", "b");
System.out.println(list.get(1));
// 输出：b
```

### `List.set`：按索引替换

`set(index, element)` 用新元素替换已有位置并返回旧元素，列表长度不变；索引必须小于 `size()`，不能用它在末尾追加。

```java
import java.util.ArrayList;
import java.util.List;

public class ListGetSetDemo {
    public static void main(String[] args) {
        List<String> list = new ArrayList<>(List.of("a", "b"));
        String old = list.set(1, "B");
        System.out.println(old + " -> " + list);
        // 输出：b -> [a, B]
    }
}
```

列表不支持修改或索引越界时会抛异常。

### `List.remove`：按索引或按值删除

需要从 `List<Integer>` 删除元素时应区分按索引的 `remove(1)` 和按值的 `remove(Integer.valueOf(1))`，后者找不到时返回 `false`。

```java
import java.util.ArrayList;
import java.util.List;

public class ListRemoveDemo {
    public static void main(String[] args) {
        List<Integer> numbers = new ArrayList<>(List.of(10, 20, 30));
        // numbers：[10, 20, 30]
        numbers.remove(1);
        // numbers：[10, 30]
        numbers.remove(Integer.valueOf(30));
        System.out.println(numbers);
        // 输出：[10]
    }
}
```

### `List.contains`：判断元素是否存在

只需要知道列表是否含有某元素时使用 `contains`，比较依赖元素的 `equals`。

```java
import java.util.List;

List<String> list = List.of("java", "sql", "java");
System.out.println(list.contains("sql"));
// 输出：true
```

### `List.indexOf`：查找首次位置

需要元素第一次出现的索引时使用 `indexOf`，找不到返回 `-1`。

```java
import java.util.List;

public class ListSearchDemo {
    public static void main(String[] args) {
        List<String> list = List.of("java", "sql", "java");
        System.out.println(list.indexOf("java"));
        // 输出：0
    }
}
```

### `List.lastIndexOf`：查找末次位置

需要元素最后一次出现的索引时使用 `lastIndexOf`，找不到返回 `-1`。

```java
import java.util.List;

List<String> list = List.of("java", "sql", "java");
System.out.println(list.lastIndexOf("java"));
// 输出：2
```

### `List.iterator`：创建显式迭代器

需要显式控制遍历进度时先调用 `iterator`，并用 `hasNext` 判断后再调用 `next` 取值。

```java
import java.util.Iterator;
import java.util.List;

List<String> names = List.of("Alice", "Bob");
// names：[Alice, Bob]
Iterator<String> iterator = names.iterator();
while (iterator.hasNext()) {
    System.out.println(iterator.next());
    // 输出：Alice、Bob
}
```

### `List.forEach`：以动作遍历

需要把每个元素交给同一 `Consumer` 时使用 `forEach`。

```java
java.util.List.of("java").forEach(System.out::println);
// 输出：java
```

### `Iterator.remove`：遍历时删除当前元素

`Iterator.remove()` 删除最近一次 `next()` 返回的元素，适合边遍历边删除；每次 `next()` 后最多调用一次，否则抛 `IllegalStateException`。

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
        System.out.println(list);
        // 输出：[java, sql]
    }
}
```

遍历时直接通过列表结构性修改可能触发并发修改异常。

### removeIf：按条件批量删除

removeIf 直接表达按条件删除，返回是否有元素被删除；条件应保持简单，不要在谓词中再次修改同一个列表。

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

### sort：原地排序

sort 会修改当前列表；Comparator 的组合和 null 排序见集合排序与不可变集合页面。

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

### subList：获取左闭右开视图

`subList(from, to)` 返回左闭右开区间的视图，视图和源列表的修改相互可见。

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

在视图外直接对源列表增删元素后，视图的行为不再有保证，常见实现会抛 `ConcurrentModificationException`。需要独立容器时使用 `new ArrayList<>(source.subList(from, to))`。

### `List.of`：创建不可修改列表

需要直接声明少量且不含 `null` 的固定元素时使用 `List.of`。

```java
import java.util.List;

List<String> names = List.of("a", "b");
System.out.println(names);
// 输出：[a, b]
```

### `List.copyOf`：创建不可修改快照

需要把当前集合内容复制为不可修改列表时使用 `List.copyOf`；它拒绝 `null` 元素。

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

### `List.toArray`：把 List 转为数组

带数组构造器的方法引用可以得到正确的运行时类型；老代码中 toArray(new String[0]) 也常见。

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
## 不常用但需要知道

### Arrays.asList：固定大小数组视图

Arrays.asList 允许 set，但不允许 add 或 remove；底层数组与列表共享元素，需要普通可变列表时复制到 ArrayList。

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

### Collections.unmodifiableList：只读包装视图

包装引用不能修改，但源列表变化会反映到 view；需要快照时使用 List.copyOf。

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

### listIterator：双向遍历并修改

listIterator 适合需要在当前位置插入、替换或反向移动的旧式算法；普通遍历优先增强 for。

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

### Collections.binarySearch：在有序列表中二分查找

列表必须按相同的自然顺序或 Comparator 排序；未找到时返回负的插入点编码，不要直接把负数当普通索引。

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

### `Collections.rotate`：循环移动列表元素

需要按固定距离循环调整列表顺序时使用，正数向右移动，且会直接修改可变列表。

```java
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

List<String> list = new ArrayList<>(List.of("a", "b", "c"));
Collections.rotate(list, 1);
System.out.println(list);
// 输出：[c, a, b]
```

### `Collections.swap`：交换两个索引位置

需要原地交换列表中的两个元素时使用；两个索引都必须位于列表范围内。

```java
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

List<String> list = new ArrayList<>(List.of("a", "b", "c"));
Collections.swap(list, 0, 2);
System.out.println(list);
// 输出：[c, b, a]
```

### `Collections.frequency`：统计相等元素数量

需要按 `equals` 语义统计目标元素出现次数时使用，该方法只读取集合而不改变顺序。

```java
import java.util.Collections;
import java.util.List;

List<String> list = List.of("a", "b", "a");
int count = Collections.frequency(list, "a");
System.out.println(count);
// 输出：2
```
## 简单案例

### `ArrayList.add`：向可变数组列表追加元素

它在容量足够时摊销为常数时间，并返回集合是否发生变化。

```java
import java.util.ArrayList;
var names = new ArrayList<String>();
boolean changed = names.add("Ann");
names.add("Bob");
System.out.println(changed);
// 输出：true
System.out.println(names);
// 输出：[Ann, Bob]
```

### `Iterator.hasNext`：判断是否还有元素

在调用 `next` 前检查它，避免越过迭代器末尾。

```java
import java.util.List;
var iterator = List.of("A").iterator();
System.out.println(iterator.hasNext());
// 输出：true
System.out.println(iterator.next());
// 输出：A
System.out.println(iterator.hasNext());
// 输出：false
```

### `Iterator.next`：取得下一个元素

它会推进迭代位置；没有剩余元素时抛出 `NoSuchElementException`。

```java
import java.util.List;
var iterator = List.of("A", "B").iterator();
String first = iterator.next();
String second = iterator.next();
System.out.println(first);
// 输出：A
System.out.println(second);
// 输出：B
```

### `List.size`：读取列表元素数量

`size` 返回当前元素个数，不是最后一个合法索引。

```java
import java.util.List;
List<String> names = List.of("A", "B", "C");
System.out.println(names.size());
// 输出：3
System.out.println(names.get(names.size() - 1));
// 输出：C
```

### `Collection.size`：通过集合接口读取元素数量

`Collection.size` 返回当前包含的元素数；变量声明为 `Collection` 时，不需要知道实际是 `List` 还是 `Set` 也能读取数量。

```java
import java.util.Collection;
import java.util.Set;

Collection<String> tags = Set.of("java", "sql");
System.out.println(tags.size());
// 输出：2
```

### `List.stream`：把列表接入流式处理

它创建顺序流而不修改原列表，结果由终止操作产生。

```java
import java.util.List;
List<String> names = List.of("ann", "bob");
long count = names.stream()
        .filter(name -> name.length() == 3)
        .count();
        // 输入：filter(name -> name.length() == 3)；对 names 中的 "ann"、"bob" 分别检查长度。
System.out.println(count);
// 输出：2
```

### `List.put` 不存在：按索引替换应使用 `List.set`

`put` 属于 `Map`；列表按位置覆盖必须使用 `set`，索引也必须已存在。

```java
import java.util.ArrayList;
import java.util.List;
List<String> names = new ArrayList<>(List.of("A", "B"));
String old = names.set(1, "C");
System.out.println(old);
// 输出：B
System.out.println(names);
// 输出：[A, C]
```

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
