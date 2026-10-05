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
// 语义：需要增删改时使用 ArrayList。
import java.util.ArrayList;
import java.util.List;

public class ListCreateDemo {
    public static void main(String[] args) {
        List<String> names = new ArrayList<>(List.of("Alice", "Bob"));
        // 输入：List<String> names = new ArrayList<>(List.of("Alice", "Bob"));；使用构造参数 List.of("Alice", "Bob") 创建 ArrayList<>，结果赋给 names。
        // 关键变化：List<String> names = new ArrayList<>(List.of("Alice", "Bob"));；创建 ArrayList<>，构造参数为 List.of("Alice", "Bob")，实例写入 names。
        names.add("Carol");
        // 输入：names.add("Carol");；接收对象为 names，调用 add 的实参为 "Carol"。
        // 关键变化：names.add("Carol");；向 names 加入 "Carol"，返回 boolean 表示是否发生变化；names 内容更新。
        System.out.println(names);
        // 输出：[Alice, Bob, Carol]
    }
}
```

### `List.add`：追加或按索引插入

add(value) 追加到末尾，add(index, value) 会移动后续元素；插入索引允许等于 size。

```java
// 语义：add(value) 追加到末尾，add(index, value) 会移动后续元素。
import java.util.ArrayList;
import java.util.List;

public class ListAddDemo {
    public static void main(String[] args) {
        List<String> list = new ArrayList<>(List.of("a", "c"));
        // 输入：List<String> list = new ArrayList<>(List.of("a", "c"));；使用构造参数 List.of("a", "c") 创建 ArrayList<>，结果赋给 list。
        // 关键变化：List<String> list = new ArrayList<>(List.of("a", "c"));；创建 ArrayList<>，构造参数为 List.of("a", "c")，list 初始为 [a, c]。
        list.add("d");
        // 输入：list.add("d");；接收对象为 list，调用 add 的实参为 "d"。
        // 关键变化：list.add("d");；向 list 追加 "d"，list 变为 [a, c, d]。
        list.add(1, "b");
        // 输入：list.add(1, "b");；接收对象为 list，调用 add 的实参为 1, "b"。
        // 关键变化：list.add(1, "b");；在索引 1 插入 "b"，该重载返回 void；list 变为 [a, b, c, d]。
        System.out.println(list);
        // 输出：[a, b, c, d]
    }
}
```

### `List.addAll`：批量追加或插入

addAll 返回是否发生变化；批量操作通常比多次手动插入更清晰。

```java
// 语义：addAll 返回是否发生变化。
import java.util.ArrayList;
import java.util.List;

public class ListAddAllDemo {
    public static void main(String[] args) {
        List<String> list = new ArrayList<>(List.of("a"));
        // 输入：List<String> list = new ArrayList<>(List.of("a"));；使用构造参数 List.of("a") 创建 ArrayList<>，结果赋给 list。
        // 关键变化：List<String> list = new ArrayList<>(List.of("a"));；创建 ArrayList<>，构造参数为 List.of("a")，实例写入 list。
        list.addAll(List.of("b", "c"));
        // 输入：list.addAll(List.of("b", "c"));；接收对象为 list，调用 addAll 的实参为 List.of("b", "c")。
        // 关键变化：list.addAll(List.of("b", "c"));；向 list 加入 List.of("b", "c")，返回 boolean 表示是否发生变化；list 内容更新。
        list.addAll(1, List.of("x", "y"));
        // 输入：list.addAll(1, List.of("x", "y"));；接收对象为 list，调用 addAll 的实参为 1, List.of("x", "y")。
        // 关键变化：list.addAll(1, List.of("x", "y"));；向 list 加入 1, List.of("x", "y")，返回 boolean 表示是否发生变化；list 内容更新。
        System.out.println(list);
        // 输出：[a, x, y, b, c]
    }
}
```

### `List.get`：按索引读取

需要读取指定位置的元素时使用 `get`，索引必须在 `0` 到 `size - 1` 之间。

```java
// 语义：需要读取指定位置的元素时使用 get，索引必须在 0 到 size - 1 之间。
import java.util.List;

List<String> list = List.of("a", "b");
// 输入：List<String> list = List.of("a", "b");；右侧表达式 List.of("a", "b") 的结果赋给 list。
// 关键变化：List<String> list = List.of("a", "b");；按 "a", "b" 调用 of 创建值，结果写入 list。
System.out.println(list.get(1));
// 输出：b
```

### `List.set`：按索引替换

需要替换指定位置的元素并取得旧值时使用 `set`。

```java
// 语义：需要替换指定位置的元素并取得旧值时使用 set。
import java.util.ArrayList;
import java.util.List;

public class ListGetSetDemo {
    public static void main(String[] args) {
        List<String> list = new ArrayList<>(List.of("a", "b"));
        // 输入：List<String> list = new ArrayList<>(List.of("a", "b"));；使用构造参数 List.of("a", "b") 创建 ArrayList<>，结果赋给 list。
        // 关键变化：List<String> list = new ArrayList<>(List.of("a", "b"));；创建 ArrayList<>，构造参数为 List.of("a", "b")，实例写入 list。
        String old = list.set(1, "B");
        // 输入：String old = list.set(1, "B");；右侧表达式 list.set(1, "B") 的结果赋给 old。
        // 关键变化：String old = list.set(1, "B");；调用 set，实参为 1, "B"，返回值写入 old。
        System.out.println(old + " -> " + list);
        // 输出：b -> [a, B]
    }
}
```

### `List.remove`：按索引或按值删除

需要从 `List<Integer>` 删除元素时应区分按索引的 `remove(1)` 和按值的 `remove(Integer.valueOf(1))`，后者找不到时返回 `false`。

```java
// 语义：需要从 List<Integer> 删除元素时应区分按索引的 remove(1) 和按值的 remove(Integer.valueOf(1))，后者找不到时返回 false。
import java.util.ArrayList;
import java.util.List;

public class ListRemoveDemo {
    public static void main(String[] args) {
        List<Integer> numbers = new ArrayList<>(List.of(10, 20, 30));
        // 输入：List<Integer> numbers = new ArrayList<>(List.of(10, 20, 30));；使用构造参数 List.of(10, 20, 30) 创建 ArrayList<>，结果赋给 numbers。
        // 关键变化：List<Integer> numbers = new ArrayList<>(List.of(10, 20, 30));；创建 ArrayList<>，构造参数为 List.of(10, 20, 30)，实例写入 numbers。
        // numbers：[10, 20, 30]
        numbers.remove(1);
        // 输入：numbers.remove(1);；接收对象为 numbers，调用 remove 的实参为 1。
        // 关键变化：numbers.remove(1);；按索引 1 删除元素 20，返回被移除的 Integer 20；numbers 变为 [10, 30]。
        // numbers：[10, 30]
        numbers.remove(Integer.valueOf(30));
        // 输入：numbers.remove(Integer.valueOf(30));；接收对象为 numbers，调用 remove 的实参为 Integer.valueOf(30)。
        // 关键变化：numbers.remove(Integer.valueOf(30));；按值删除元素 30，返回 true；numbers 变为 [10]。
        System.out.println(numbers);
        // 输出：[10]
    }
}
```

### `List.contains`：判断元素是否存在

只需要知道列表是否含有某元素时使用 `contains`，比较依赖元素的 `equals`。

```java
// 语义：只需要知道列表是否含有某元素时使用 contains，比较依赖元素的 equals。
import java.util.List;

List<String> list = List.of("java", "sql", "java");
// 输入：List<String> list = List.of("java", "sql", "java");；右侧表达式 List.of("java", "sql", "java") 的结果赋给 list。
// 关键变化：List<String> list = List.of("java", "sql", "java");；按 "java", "sql", "java" 调用 of 创建值，结果写入 list。
System.out.println(list.contains("sql"));
// 输出：true
```

### `List.indexOf`：查找首次位置

需要元素第一次出现的索引时使用 `indexOf`，找不到返回 `-1`。

```java
// 语义：需要元素第一次出现的索引时使用 indexOf，找不到返回 -1。
import java.util.List;

public class ListSearchDemo {
    public static void main(String[] args) {
        List<String> list = List.of("java", "sql", "java");
        // 输入：List<String> list = List.of("java", "sql", "java");；右侧表达式 List.of("java", "sql", "java") 的结果赋给 list。
        // 关键变化：List<String> list = List.of("java", "sql", "java");；按 "java", "sql", "java" 调用 of 创建值，结果写入 list。
        System.out.println(list.indexOf("java"));
        // 输出：0
    }
}
```

### `List.lastIndexOf`：查找末次位置

需要元素最后一次出现的索引时使用 `lastIndexOf`，找不到返回 `-1`。

```java
// 语义：需要元素最后一次出现的索引时使用 lastIndexOf，找不到返回 -1。
import java.util.List;

List<String> list = List.of("java", "sql", "java");
// 输入：List<String> list = List.of("java", "sql", "java");；右侧表达式 List.of("java", "sql", "java") 的结果赋给 list。
// 关键变化：List<String> list = List.of("java", "sql", "java");；按 "java", "sql", "java" 调用 of 创建值，结果写入 list。
System.out.println(list.lastIndexOf("java"));
// 输出：2
```

### `List.iterator`：创建显式迭代器

需要显式控制遍历进度时先调用 `iterator`，并用 `hasNext` 判断后再调用 `next` 取值。

```java
// 语义：需要显式控制遍历进度时先调用 iterator，并用 hasNext 判断后再调用 next 取值。
import java.util.Iterator;
import java.util.List;

List<String> names = List.of("Alice", "Bob");
// 输入：List<String> names = List.of("Alice", "Bob");；右侧表达式 List.of("Alice", "Bob") 的结果赋给 names。
// 关键变化：List<String> names = List.of("Alice", "Bob");；按 "Alice", "Bob" 调用 of 创建值，结果写入 names。
// names：[Alice, Bob]
Iterator<String> iterator = names.iterator();
// 输入：Iterator<String> iterator = names.iterator();；右侧表达式 names.iterator() 的结果赋给 iterator。
// 关键变化：Iterator<String> iterator = names.iterator();；调用 iterator，实参为 无显式参数，返回值写入 iterator。
while (iterator.hasNext()) {
    System.out.println(iterator.next());
    // 输出：Alice、Bob
}
```

### `List.forEach`：以动作遍历

需要把每个元素交给同一 `Consumer` 时使用 `forEach`。

```java
// 语义：需要把每个元素交给同一 Consumer 时使用 forEach。
// 调用参数：代码依次使用 "java"。
java.util.List.of("java").forEach(System.out::println);
// 输入：java.util.List.of("java").forEach(System.out::println);；接收对象为 上一个链式结果，调用 forEach 的实参为 System.out::println。
// 关键变化：java.util.List.of("java").forEach(System.out::println);；把 上一个链式结果 的每个元素交给 System.out::println，无返回值；遍历动作完成。
// 输出：java
```

### `Iterator.remove`：遍历时删除当前元素

需要在遍历过程中安全删除当前元素时使用 `Iterator.remove`，不要直接结构性修改列表。

```java
// 语义：需要在遍历过程中安全删除当前元素时使用 Iterator.remove，不要直接结构性修改列表。
import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;

public class ListIterationDemo {
    public static void main(String[] args) {
        List<String> list = new ArrayList<>(List.of("java", "", "sql"));
        // 输入：List<String> list = new ArrayList<>(List.of("java", "", "sql"));；使用构造参数 List.of("java", "", "sql") 创建 ArrayList<>，结果赋给 list。
        // 关键变化：List<String> list = new ArrayList<>(List.of("java", "", "sql"));；创建 ArrayList<>，构造参数为 List.of("java", "", "sql")，实例写入 list。
        for (Iterator<String> it = list.iterator(); it.hasNext();) {
            if (it.next().isBlank()) {
                it.remove();
                // 输入：it.remove();；接收对象为 it，调用 remove 的实参为 无显式参数。
                // 关键变化：it.remove();；删除最近一次 it.next() 返回的空字符串，返回 void；list 变为 [java, sql]。
            }
        }
        System.out.println(list);
        // 输出：[java, sql]
    }
}
```

### removeIf：按条件批量删除

removeIf 直接表达按条件删除，返回是否有元素被删除；条件应保持简单，不要在谓词中再次修改同一个列表。

```java
// 语义：removeIf 直接表达按条件删除，返回是否有元素被删除。
import java.util.ArrayList;
import java.util.List;

public class ListRemoveIfDemo {
    public static void main(String[] args) {
        List<Integer> numbers = new ArrayList<>(List.of(1, 2, 3, 4));
        // 输入：List<Integer> numbers = new ArrayList<>(List.of(1, 2, 3, 4));；使用构造参数 List.of(1, 2, 3, 4) 创建 ArrayList<>，结果赋给 numbers。
        // 关键变化：List<Integer> numbers = new ArrayList<>(List.of(1, 2, 3, 4));；创建 ArrayList<>，构造参数为 List.of(1, 2, 3, 4)，实例写入 numbers。
        numbers.removeIf(number -> number % 2 == 0);
        // 输入：numbers.removeIf(number -> number % 2 == 0);；接收对象为 numbers，调用 removeIf 的实参为 number -> number % 2 == 0。
        // 关键变化：numbers.removeIf(number -> number % 2 == 0);；按谓词 number -> number % 2 == 0 删除 numbers 中的偶数，返回 boolean；numbers 内容更新。
        System.out.println(numbers);
        // 输出：[1, 3]
    }
}
```

### sort：原地排序

sort 会修改当前列表；Comparator 的组合和 null 排序见集合排序与不可变集合页面。

```java
// 语义：sort 会修改当前列表。
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;

public class ListSortDemo {
    public static void main(String[] args) {
        List<String> list = new ArrayList<>(List.of("Java", "C", "Python"));
        // 输入：List<String> list = new ArrayList<>(List.of("Java", "C", "Python"));；使用构造参数 List.of("Java", "C", "Python") 创建 ArrayList<>，结果赋给 list。
        // 关键变化：List<String> list = new ArrayList<>(List.of("Java", "C", "Python"));；创建 ArrayList<>，构造参数为 List.of("Java", "C", "Python")，实例写入 list。
        list.sort(Comparator.comparingInt(String::length));
        // 输入：list.sort(Comparator.comparingInt(String::length));；接收对象为 list，调用 sort 的实参为 Comparator.comparingInt(String::length)。
        // 关键变化：list.sort(Comparator.comparingInt(String::length));；按 Comparator.comparingInt(String::length) 重排 list，返回 void；集合顺序更新。
        System.out.println(list);
        // 输出：[C, Java, Python]
    }
}
```

### subList：获取左闭右开视图

subList 是源列表的视图，区间是 from inclusive、to exclusive；需要独立副本时写 new ArrayList&lt;&gt;(source.subList(...))。

```java
// 语义：subList 是源列表的视图，区间是 from inclusive、to exclusive。
import java.util.ArrayList;
import java.util.List;

public class ListSubListDemo {
    public static void main(String[] args) {
        List<String> source = new ArrayList<>(List.of("a", "b", "c"));
        // 输入：List<String> source = new ArrayList<>(List.of("a", "b", "c"));；使用构造参数 List.of("a", "b", "c") 创建 ArrayList<>，结果赋给 source。
        // 关键变化：List<String> source = new ArrayList<>(List.of("a", "b", "c"));；创建 ArrayList<>，构造参数为 List.of("a", "b", "c")，实例写入 source。
        List<String> view = source.subList(0, 2);
        // 输入：List<String> view = source.subList(0, 2);；右侧表达式 source.subList(0, 2) 的结果赋给 view。
        // 关键变化：List<String> view = source.subList(0, 2);；调用 subList，实参为 0, 2，返回值写入 view。
        view.set(0, "A");
        // 输入：view.set(0, "A");；接收对象为 view，调用 set 的实参为 0, "A"。
        // 关键变化：view.set(0, "A");；把 0, "A" 写入 view 的指定位置，返回旧元素；列表状态更新。
        System.out.println(source + " / " + view);
        // 输出：[A, b, c] / [A, b]
    }
}
```

### `List.of`：创建不可修改列表

需要直接声明少量且不含 `null` 的固定元素时使用 `List.of`。

```java
// 语义：需要直接声明少量且不含 null 的固定元素时使用 List.of。
import java.util.List;

List<String> names = List.of("a", "b");
// 输入：List<String> names = List.of("a", "b");；右侧表达式 List.of("a", "b") 的结果赋给 names。
// 关键变化：List<String> names = List.of("a", "b");；按 "a", "b" 调用 of 创建值，结果写入 names。
System.out.println(names);
// 输出：[a, b]
```

### `List.copyOf`：创建不可修改快照

需要把当前集合内容复制为不可修改列表时使用 `List.copyOf`；它拒绝 `null` 元素。

```java
// 语义：需要把当前集合内容复制为不可修改列表时使用 List.copyOf。
import java.util.ArrayList;
import java.util.List;

public class ListImmutableFactoryDemo {
    public static void main(String[] args) {
        List<String> source = new ArrayList<>(List.of("a"));
        // 输入：List<String> source = new ArrayList<>(List.of("a"));；使用构造参数 List.of("a") 创建 ArrayList<>，结果赋给 source。
        // 关键变化：List<String> source = new ArrayList<>(List.of("a"));；创建 ArrayList<>，构造参数为 List.of("a")，实例写入 source。
        List<String> snapshot = List.copyOf(source);
        // 输入：List<String> snapshot = List.copyOf(source);；右侧表达式 List.copyOf(source) 的结果赋给 snapshot。
        // 关键变化：List<String> snapshot = List.copyOf(source);；调用 copyOf，实参为 source，返回值写入 snapshot。
        source.add("b");
        // 输入：source.add("b");；接收对象为 source，调用 add 的实参为 "b"。
        // 关键变化：source.add("b");；向 source 加入 "b"，返回 boolean 表示是否发生变化；source 内容更新。
        System.out.println(snapshot);
        // 输出：[a]
    }
}
```

### `List.toArray`：把 List 转为数组

带数组构造器的方法引用可以得到正确的运行时类型；老代码中 toArray(new String[0]) 也常见。

```java
// 语义：带数组构造器的方法引用可以得到正确的运行时类型。
import java.util.List;

public class ListToArrayDemo {
    public static void main(String[] args) {
        List<String> list = List.of("a", "b");
        // 输入：List<String> list = List.of("a", "b");；右侧表达式 List.of("a", "b") 的结果赋给 list。
        // 关键变化：List<String> list = List.of("a", "b");；按 "a", "b" 调用 of 创建值，结果写入 list。
        String[] array = list.toArray(String[]::new);
        // 输入：String[] array = list.toArray(String[]::new);；右侧表达式 list.toArray(String[]::new) 的结果赋给 array。
        // 关键变化：String[] array = list.toArray(String[]::new);；把方法引用 list.toArray(String[]::new) 绑定到目标函数式接口，结果写入 array。
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
        // 输入：List<String> fixed = Arrays.asList("a", "b");；右侧表达式 Arrays.asList("a", "b") 的结果赋给 fixed。
        // 关键变化：List<String> fixed = Arrays.asList("a", "b");；调用 asList，实参为 "a", "b"，返回值写入 fixed。
        fixed.set(0, "A");
        // 输入：fixed.set(0, "A");；接收对象为 fixed，调用 set 的实参为 0, "A"。
        // 关键变化：fixed.set(0, "A");；把 0, "A" 写入 fixed 的指定位置，返回旧元素；列表状态更新。
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
        // 输入：List<String> source = new ArrayList<>(List.of("a"));；使用构造参数 List.of("a") 创建 ArrayList<>，结果赋给 source。
        // 关键变化：List<String> source = new ArrayList<>(List.of("a"));；创建 ArrayList<>，构造参数为 List.of("a")，实例写入 source。
        List<String> view = Collections.unmodifiableList(source);
        // 输入：List<String> view = Collections.unmodifiableList(source);；右侧表达式 Collections.unmodifiableList(source) 的结果赋给 view。
        // 关键变化：List<String> view = Collections.unmodifiableList(source);；调用 unmodifiableList，实参为 source，返回值写入 view。
        source.add("b");
        // 输入：source.add("b");；接收对象为 source，调用 add 的实参为 "b"。
        // 关键变化：source.add("b");；向 source 加入 "b"，返回 boolean 表示是否发生变化；source 内容更新。
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
        // 输入：List<String> list = new ArrayList<>(List.of("a", "b"));；使用构造参数 List.of("a", "b") 创建 ArrayList<>，结果赋给 list。
        // 关键变化：List<String> list = new ArrayList<>(List.of("a", "b"));；创建 ArrayList<>，构造参数为 List.of("a", "b")，实例写入 list。
        ListIterator<String> it = list.listIterator();
        // 输入：ListIterator<String> it = list.listIterator();；右侧表达式 list.listIterator() 的结果赋给 it。
        // 关键变化：ListIterator<String> it = list.listIterator();；调用 listIterator，实参为 无显式参数，返回值写入 it。
        it.next();
        // 输入：it.next();；接收对象为 it，调用 next 的实参为 无显式参数。
        // 关键变化：it.next();；从 it 取得下一个元素，返回元素值；迭代器位置向前推进。
        it.set("A");
        // 输入：it.set("A");；接收对象为 it，调用 set 的实参为 "A"。
        // 关键变化：it.set("A");；把 "A" 写入 it 的指定位置，返回旧元素；列表状态更新。
        it.add("x");
        // 输入：it.add("x");；接收对象为 it，调用 add 的实参为 "x"。
        // 关键变化：it.add("x");；向 it 加入 "x"，返回 boolean 表示是否发生变化；it 内容更新。
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
        // 输入：List<Integer> sorted = List.of(1, 3, 5, 7);；右侧表达式 List.of(1, 3, 5, 7) 的结果赋给 sorted。
        // 关键变化：List<Integer> sorted = List.of(1, 3, 5, 7);；按 1, 3, 5, 7 调用 of 创建值，结果写入 sorted。
        int index = Collections.binarySearch(sorted, 5);
        // 输入：int index = Collections.binarySearch(sorted, 5);；右侧表达式 Collections.binarySearch(sorted, 5) 的结果赋给 index。
        // 关键变化：int index = Collections.binarySearch(sorted, 5);；调用 binarySearch，实参为 sorted, 5，返回值写入 index。
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
// 输入：List<String> list = new ArrayList<>(List.of("a", "b", "c"));；使用构造参数 List.of("a", "b", "c") 创建 ArrayList<>，结果赋给 list。
// 关键变化：List<String> list = new ArrayList<>(List.of("a", "b", "c"));；创建 ArrayList<>，构造参数为 List.of("a", "b", "c")，实例写入 list。
Collections.rotate(list, 1);
// 输入：Collections.rotate(list, 1);；接收对象为 Collections，调用 rotate 的实参为 list, 1。
// 关键变化：Collections.rotate(list, 1);；调用 rotate，实参为 list, 1；将 list 向右旋转 1 位；list 顺序更新。
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
// 输入：List<String> list = new ArrayList<>(List.of("a", "b", "c"));；使用构造参数 List.of("a", "b", "c") 创建 ArrayList<>，结果赋给 list。
// 关键变化：List<String> list = new ArrayList<>(List.of("a", "b", "c"));；创建 ArrayList<>，构造参数为 List.of("a", "b", "c")，实例写入 list。
Collections.swap(list, 0, 2);
// 输入：Collections.swap(list, 0, 2);；接收对象为 Collections，调用 swap 的实参为 list, 0, 2。
// 关键变化：Collections.swap(list, 0, 2);；调用 swap，实参为 list, 0, 2；交换 list 下标 0 和 2 的元素；list 顺序更新。
System.out.println(list);
// 输出：[c, b, a]
```

### `Collections.frequency`：统计相等元素数量

需要按 `equals` 语义统计目标元素出现次数时使用，该方法只读取集合而不改变顺序。

```java
import java.util.Collections;
import java.util.List;

List<String> list = List.of("a", "b", "a");
// 输入：List<String> list = List.of("a", "b", "a");；右侧表达式 List.of("a", "b", "a") 的结果赋给 list。
// 关键变化：List<String> list = List.of("a", "b", "a");；按 "a", "b", "a" 调用 of 创建值，结果写入 list。
int count = Collections.frequency(list, "a");
// 输入：int count = Collections.frequency(list, "a");；右侧表达式 Collections.frequency(list, "a") 的结果赋给 count。
// 关键变化：int count = Collections.frequency(list, "a");；调用 frequency，实参为 list, "a"，返回值写入 count。
System.out.println(count);
// 输出：2
```
## 简单案例

### `ArrayList.add`：向可变数组列表追加元素

它在容量足够时摊销为常数时间，并返回集合是否发生变化。

```java
import java.util.ArrayList;
var names = new ArrayList<String>();
// 输入：var names = new ArrayList<String>();；使用构造参数 无显式参数 创建 ArrayList<String>，结果赋给 names。
// 关键变化：var names = new ArrayList<String>();；创建 ArrayList<String>，构造参数为 无显式参数，实例写入 names。
boolean changed = names.add("Ann");
// 输入：boolean changed = names.add("Ann");；右侧表达式 names.add("Ann") 的结果赋给 changed。
// 关键变化：boolean changed = names.add("Ann");；调用 add，实参为 "Ann"，返回值写入 changed。
names.add("Bob");
// 输入：names.add("Bob");；接收对象为 names，调用 add 的实参为 "Bob"。
// 关键变化：names.add("Bob");；向 names 加入 "Bob"，返回 boolean 表示是否发生变化；names 内容更新。
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
// 输入：var iterator = List.of("A").iterator();；右侧表达式 List.of("A").iterator() 的结果赋给 iterator。
// 关键变化：var iterator = List.of("A").iterator();；按 "A" 调用 of 创建值，结果写入 iterator。
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
// 输入：var iterator = List.of("A", "B").iterator();；右侧表达式 List.of("A", "B").iterator() 的结果赋给 iterator。
// 关键变化：var iterator = List.of("A", "B").iterator();；按 "A", "B" 调用 of 创建值，结果写入 iterator。
String first = iterator.next();
// 输入：String first = iterator.next();；右侧表达式 iterator.next() 的结果赋给 first。
// 关键变化：String first = iterator.next();；调用 next，实参为 无显式参数，返回值写入 first。
String second = iterator.next();
// 输入：String second = iterator.next();；右侧表达式 iterator.next() 的结果赋给 second。
// 关键变化：String second = iterator.next();；调用 next，实参为 无显式参数，返回值写入 second。
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
// 输入：List<String> names = List.of("A", "B", "C");；右侧表达式 List.of("A", "B", "C") 的结果赋给 names。
// 关键变化：List<String> names = List.of("A", "B", "C");；按 "A", "B", "C" 调用 of 创建值，结果写入 names。
System.out.println(names.size());
// 输出：3
System.out.println(names.get(names.size() - 1));
// 输出：C
```

### `Collection.size`：通过集合接口读取元素数量

`Collection.size` 返回当前包含的元素数；变量声明为 `Collection` 时，不需要知道实际是 `List` 还是 `Set` 也能读取数量。

```java
// 语义：Collection.size 根据当前集合内容返回元素数量。
import java.util.Collection;
import java.util.Set;

Collection<String> tags = Set.of("java", "sql");
// 输入：Collection<String> tags = Set.of("java", "sql");；右侧表达式 Set.of("java", "sql") 的结果赋给 tags。
// 关键变化：Collection<String> tags = Set.of("java", "sql");；按 "java", "sql" 调用 of 创建值，结果写入 tags。
System.out.println(tags.size());
// 输出：2
```

### `List.stream`：把列表接入流式处理

它创建顺序流而不修改原列表，结果由终止操作产生。

```java
import java.util.List;
List<String> names = List.of("ann", "bob");
// 输入：List<String> names = List.of("ann", "bob");；右侧表达式 List.of("ann", "bob") 的结果赋给 names。
// 关键变化：List<String> names = List.of("ann", "bob");；按 "ann", "bob" 调用 of 创建值，结果写入 names。
long count = names.stream()
        .filter(name -> name.length() == 3)
        .count();
        // 输入：long count = names.stream() .filter(name -> name.length() == 3) .count();；右侧表达式 names.stream() .filter(name -> name.length() == 3) .count() 的结果赋给 count。
        // 关键变化：long count = names.stream() .filter(name -> name.length() == 3) .count();；统计 上一个链式结果 的元素数量，计数结果写入 count。
        // 输入：filter(name -> name.length() == 3)；对 names 中的 "ann"、"bob" 分别检查长度。
        // 关键变化："ann"、"bob" 都满足长度为 3，filter 后 count 返回 2 并写入 count。
        // 输入：.count();；接收对象为 上一个链式结果，调用 count 的实参为 无显式参数。
        // 关键变化：.count();；统计 上一个链式结果 中的元素数量，返回 long 计数值；源流内容不变。
System.out.println(count);
// 输出：2
```

### `List.put` 不存在：按索引替换应使用 `List.set`

`put` 属于 `Map`；列表按位置覆盖必须使用 `set`，索引也必须已存在。

```java
import java.util.ArrayList;
import java.util.List;
List<String> names = new ArrayList<>(List.of("A", "B"));
// 输入：List<String> names = new ArrayList<>(List.of("A", "B"));；使用构造参数 List.of("A", "B") 创建 ArrayList<>，结果赋给 names。
// 关键变化：List<String> names = new ArrayList<>(List.of("A", "B"));；创建 ArrayList<>，构造参数为 List.of("A", "B")，实例写入 names。
String old = names.set(1, "C");
// 输入：String old = names.set(1, "C");；右侧表达式 names.set(1, "C") 的结果赋给 old。
// 关键变化：String old = names.set(1, "C");；调用 set，实参为 1, "C"，返回值写入 old。
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
        // 输入：List<String> list = new ArrayList<>(List.of("java"));；使用构造参数 List.of("java") 创建 ArrayList<>，结果赋给 list。
        // 关键变化：List<String> list = new ArrayList<>(List.of("java"));；创建 ArrayList<>，构造参数为 List.of("java")，实例写入 list。
        list.add("api");
        // 输入：list.add("api");；接收对象为 list，调用 add 的实参为 "api"。
        // 关键变化：list.add("api");；向 list 加入 "api"，返回 boolean 表示是否发生变化；list 内容更新。
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
