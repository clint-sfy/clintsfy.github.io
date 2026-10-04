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
// 初始状态：names 初始为 new ArrayList<>(List.of("Alice", "Bob"))。
import java.util.ArrayList;
// 输入：// 初始状态：names 初始为 new ArrayList<>(List.of("Alice", "Bob"))。 import java.util.ArrayList; 使用语句中的具体实参或初始值，当前对象 从这里进入后续操作。
import java.util.List;

public class ListCreateDemo {
    public static void main(String[] args) {
        List<String> names = new ArrayList<>(List.of("Alice", "Bob"));
        // 关键变化：List<String> names = new ArrayList<>(List.of("Alice", "Bob"))；List.of(List.of("Alice", "Bob")) 返回转换后的具体值，赋给当前示例中的接收变量。
// 初始状态：names 的初始值为 new ArrayList<>(List.of("Alice", "Bob"))。
        names.add("Carol");
        // 关键变化：names.add("Carol");；names 追加具体参数 "Carol"，容器内容随之增长。
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
        // 初始状态：list 当前为 new ArrayList<>(List.of("a", "c"))。
        list.add("d");
        // 关键变化：list.add("d") 将 "d" 追加到末尾，list 变为 [a, c, d]。
        list.add(1, "b");
        // 关键变化：list.add(1, "b") 在索引 1 插入 "b"，list 变为 [a, b, c, d]。
        System.out.println(list);
        // 输出：[a, b, c, d]
    }
}
```

### `List.addAll`：批量追加或插入

addAll 返回是否发生变化；批量操作通常比多次手动插入更清晰。

```java
import java.util.ArrayList;
import java.util.List;

public class ListAddAllDemo {
    public static void main(String[] args) {
        List<String> list = new ArrayList<>(List.of("a"));
        // 初始状态：list 当前为 new ArrayList<>(List.of("a"))。
        list.addAll(List.of("b", "c"));
        // 关键变化：list.addAll(List.of("b", "c")) 将 "b"、"c" 追加后 list 变为 [a, b, c]。
        list.addAll(1, List.of("x", "y"));
        // 关键变化：list.addAll(1, List.of("x", "y")) 在索引 1 插入 "x"、"y"，list 变为 [a, x, y, b, c]。
        System.out.println(list);
        // 输出：[a, x, y, b, c]
    }
}
```

### `List.get`：按索引读取

需要读取指定位置的元素时使用 `get`，索引必须在 `0` 到 `size - 1` 之间。

```java
import java.util.List;

List<String> list = List.of("a", "b");
// 关键变化：List<String> list = List.of("a", "b")；List.of("a") 返回转换后的具体值，赋给当前示例中的接收变量。
// 初始状态：list 当前为 List.of("a", "b")。
System.out.println(list.get(1));
// 输出：b
```

### `List.set`：按索引替换

需要替换指定位置的元素并取得旧值时使用 `set`。

```java
import java.util.ArrayList;
import java.util.List;

public class ListGetSetDemo {
    public static void main(String[] args) {
        List<String> list = new ArrayList<>(List.of("a", "b"));
        // 初始状态：list 当前为 new ArrayList<>(List.of("a", "b"))。
        String old = list.set(1, "B");
        // 初始状态：old 当前为 list.set(1, "B")。
        // 作用：需要替换指定位置的元素并取得旧值时使用 set。
        System.out.println(old + " -> " + list);
        // 输出：b -> [a, B]
    }
}
```

### `List.remove`：按索引或按值删除

需要从 `List<Integer>` 删除元素时应区分按索引的 `remove(1)` 和按值的 `remove(Integer.valueOf(1))`，后者找不到时返回 `false`。

```java
import java.util.ArrayList;
import java.util.List;

public class ListRemoveDemo {
    public static void main(String[] args) {
        List<Integer> numbers = new ArrayList<>(List.of(10, 20, 30));
        // 初始状态：numbers 当前为 new ArrayList<>(List.of(10, 20, 30))。
        // numbers：[10, 20, 30]
        numbers.remove(1);
        // 作用：需要从 List<Integer> 删除元素时应区分按索引的 remove(1) 和按值的 remove(Integer.valueOf(1))，后者找不到时返回 false。
        // numbers：[10, 30]
        numbers.remove(Integer.valueOf(30));
        // 关键变化：numbers.remove(Integer.valueOf(30));；numbers 按具体参数 Integer.valueOf(30) 删除目标内容。
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
// 关键变化：List<String> list = List.of("java", "sql", "java")；List.of("java") 返回转换后的具体值，赋给当前示例中的接收变量。
// 初始状态：list 当前为 List.of("java", "sql", "java")。
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
        // 关键变化：List<String> list = List.of("java", "sql", "java")；List.of("java") 返回转换后的具体值，赋给当前示例中的接收变量。
        // 初始状态：list 当前为 List.of("java", "sql", "java")。
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
// 关键变化：List<String> list = List.of("java", "sql", "java")；List.of("java") 返回转换后的具体值，赋给当前示例中的接收变量。
// 初始状态：list 当前为 List.of("java", "sql", "java")。
System.out.println(list.lastIndexOf("java"));
// 输出：2
```

### `List.iterator`：创建显式迭代器

需要显式控制遍历进度时先调用 `iterator`，并用 `hasNext` 判断后再调用 `next` 取值。

```java
import java.util.Iterator;
import java.util.List;

List<String> names = List.of("Alice", "Bob");
// 初始状态：names 当前为 List.of("Alice", "Bob")。
// names：[Alice, Bob]
Iterator<String> iterator = names.iterator();
// 初始状态：iterator 当前为 names.iterator()。
// 作用：需要显式控制遍历进度时先调用 iterator，并用 hasNext 判断后再调用 next 取值。
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
// 输入：表达式为 java.util.List.of("java").forEach(System.out::println)。
// 作用：通过 List.forEach 以动作遍历。
// 输出：java
```

### `Iterator.remove`：遍历时删除当前元素

需要在遍历过程中安全删除当前元素时使用 `Iterator.remove`，不要直接结构性修改列表。

```java
import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;

public class ListIterationDemo {
    public static void main(String[] args) {
        List<String> list = new ArrayList<>(List.of("java", "", "sql"));
        // 初始状态：list 当前为 new ArrayList<>(List.of("java", "", "sql"))。
        for (Iterator<String> it = list.iterator(); it.hasNext();) {
            if (it.next().isBlank()) {
                it.remove();
                // 关键变化：it.remove();；it 按具体参数 当前键或路径 删除目标内容。
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
import java.util.ArrayList;
import java.util.List;

public class ListRemoveIfDemo {
    public static void main(String[] args) {
        List<Integer> numbers = new ArrayList<>(List.of(1, 2, 3, 4));
        // 初始状态：numbers 当前为 new ArrayList<>(List.of(1, 2, 3, 4))。
        numbers.removeIf(number -> number % 2 == 0);
        // 关键变化：numbers.removeIf(number -> number % 2 == 0);；numbers；removeIf；numbers.removeIf(number -> number % 2 == 0) 返回本次调用的具体结果，后续语句继续使用该值。
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
        // 初始状态：list 当前为 new ArrayList<>(List.of("Java", "C", "Python"))。
        list.sort(Comparator.comparingInt(String::length));
        // 关键变化：list.sort(Comparator.comparingInt(String::length));；list；sort；list.sort(Comparator.comparingInt(String::length)) 返回本次调用的具体结果，后续语句继续使用该值。
        System.out.println(list);
        // 输出：[C, Java, Python]
    }
}
```

### subList：获取左闭右开视图

subList 是源列表的视图，区间是 from inclusive、to exclusive；需要独立副本时写 new ArrayList&lt;&gt;(source.subList(...))。

```java
import java.util.ArrayList;
import java.util.List;

public class ListSubListDemo {
    public static void main(String[] args) {
        List<String> source = new ArrayList<>(List.of("a", "b", "c"));
        // 初始状态：source 当前为 new ArrayList<>(List.of("a", "b", "c"))。
        List<String> view = source.subList(0, 2);
        // 初始状态：view 当前为 source.subList(0, 2)。
        // 作用：subList 是源列表的视图，区间是 from inclusive、to exclusive。
        view.set(0, "A");
        System.out.println(source + " / " + view);
        // 输出：[A, b, c] / [A, b]
    }
}
```

### `List.of`：创建不可修改列表

需要直接声明少量且不含 `null` 的固定元素时使用 `List.of`。

```java
import java.util.List;

List<String> names = List.of("a", "b");
// 初始状态：names 当前为 List.of("a", "b")。
// 作用：需要直接声明少量且不含 null 的固定元素时使用 List.of。
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
        // 初始状态：source 当前为 new ArrayList<>(List.of("a"))。
        List<String> snapshot = List.copyOf(source);
        // 初始状态：snapshot 当前为 List.copyOf(source)。
        // 作用：需要把当前集合内容复制为不可修改列表时使用 List.copyOf。
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
        // 初始状态：list 当前为 List.of("a", "b")。
        String[] array = list.toArray(String[]::new);
        // 初始状态：array 当前为 list.toArray(String[]::new)。
        // 作用：带数组构造器的方法引用可以得到正确的运行时类型。
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
// 输入：fixed 的初始值为 Arrays.asList("a", "b")。
        // 作用：通过 Arrays.asList 固定大小数组视图。
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
        // 初始状态：source 当前为 new ArrayList<>(List.of("a"))。
        List<String> view = Collections.unmodifiableList(source);
        // 关键变化：List<String> view = Collections.unmodifiableList(source); 的返回值写入 view，调用后 view 保存该具体结果。
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
// 初始状态：listIterator 从 names 的列表起点开始双向遍历。
    public static void main(String[] args) {
        List<String> list = new ArrayList<>(List.of("a", "b"));
        // 初始状态：list 当前为 new ArrayList<>(List.of("a", "b"))。
        ListIterator<String> it = list.listIterator();
        // 作用：listIterator 适合需要在当前位置插入、替换或反向移动的旧式算法；普通遍历优先增强 for。
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
        // 初始状态：sorted 当前为 List.of(1, 3, 5, 7)。
        int index = Collections.binarySearch(sorted, 5);
        // 作用：通过 Collections.binarySearch 在有序列表中二分查找。
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
// 初始状态：Collections.rotate 将 [a, b, c] 向右移动 1 位。；具体值：list = new ArrayList<>(List.of("a", "b", "c"))
Collections.rotate(list, 1);
// 关键变化：Collections.rotate(list, 1);；Collections；rotate；Collections.rotate(list) 返回本次调用的具体结果，后续语句继续使用该值。
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
// 初始状态：Collections.swap 交换 list 的索引 0 和 2。
Collections.swap(list, 0, 2);
// 关键变化：Collections.swap(list, 0, 2);；Collections；swap；Collections.swap(list) 返回本次调用的具体结果，后续语句继续使用该值。
System.out.println(list);
// 输出：[c, b, a]
```

### `Collections.frequency`：统计相等元素数量

需要按 `equals` 语义统计目标元素出现次数时使用，该方法只读取集合而不改变顺序。

```java
import java.util.Collections;
import java.util.List;

List<String> list = List.of("a", "b", "a");
// 初始状态：Collections.frequency 在 list 中统计字符串 "a"。
int count = Collections.frequency(list, "a");
// 关键变化：int count = Collections.frequency(list, "a"); 的返回值写入 count，调用后 count 保存该具体结果。
System.out.println(count);
// 输出：2
```
## 简单案例

### `ArrayList.add`：向可变数组列表追加元素

它在容量足够时摊销为常数时间，并返回集合是否发生变化。

```java
import java.util.ArrayList;
var names = new ArrayList<String>();
// 关键变化：var names = new ArrayList<String>()；names 接收 该操作(当前参数) 的返回值，当前值变为这次调用得到的具体结果。
// 初始状态：names 当前为 new ArrayList<String>()。
boolean changed = names.add("Ann");
// 关键变化：boolean changed = names.add("Ann"); 的返回值写入 changed，调用后 changed 保存该具体结果。
names.add("Bob");
// 关键变化：names.add("Bob");；names 追加具体参数 "Bob"，容器内容随之增长。
System.out.println(changed);
// 输出：true、[Ann, Bob]
System.out.println(names);
// 输出：System.out 调用参数为 names。
```

### `Iterator.hasNext`：判断是否还有元素

在调用 `next` 前检查它，避免越过迭代器末尾。

```java
import java.util.List;
var iterator = List.of("A").iterator();
// 关键变化：var iterator = List.of("A").iterator()；List.of("A") 返回转换后的具体值，赋给当前示例中的接收变量。
// 初始状态：iterator 当前为 List.of("A").iterator()。
System.out.println(iterator.hasNext());
// 输出：true、A、false
System.out.println(iterator.next());
// 输出：System.out 调用参数为 iterator.next()。
System.out.println(iterator.hasNext());
// 输出：System.out 调用参数为 iterator.hasNext()。
```

### `Iterator.next`：取得下一个元素

它会推进迭代位置；没有剩余元素时抛出 `NoSuchElementException`。

```java
import java.util.List;
var iterator = List.of("A", "B").iterator();
// 初始状态：iterator 当前为 List.of("A", "B").iterator()。
String first = iterator.next();
// 关键变化：String first = iterator.next(); 的返回值写入 first，调用后 first 保存该具体结果。
String second = iterator.next();
// 返回：second 接收 iterator.next() 的返回值。
// 关键变化：String second = iterator.next(); 的返回值写入 second，调用后 second 保存该具体结果。
System.out.println(first);
// 输出：A、B
System.out.println(second);
// 输出：System.out 调用参数为 second。
```

### `List.size`：读取列表元素数量

`size` 返回当前元素个数，不是最后一个合法索引。

```java
import java.util.List;
List<String> names = List.of("A", "B", "C");
// 关键变化：List<String> names = List.of("A", "B", "C")；List.of("A") 返回转换后的具体值，赋给当前示例中的接收变量。
// 初始状态：names 当前为 List.of("A", "B", "C")。
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
// 关键变化：Collection<String> tags = Set.of("java", "sql")；Set.of("java") 返回转换后的具体值，赋给当前示例中的接收变量。
// 初始状态：tags 包含 "java" 和 "sql"，因此 size() 返回 2。
System.out.println(tags.size());
// 输出：2
```

### `List.stream`：把列表接入流式处理

它创建顺序流而不修改原列表，结果由终止操作产生。

```java
import java.util.List;
List<String> names = List.of("ann", "bob");
// 初始状态：names 当前为 List.of("ann", "bob")。
long count = names.stream()
        .filter(name -> name.length() == 3)
        .count();
// 关键变化：long count = names.stream() .filter(name -> name.length() == 3) .count()；count 接收 stream(当前参数) 的返回值，当前值变为这次调用得到的具体结果。
System.out.println(count);
// 输出：2
```

### `List.put` 不存在：按索引替换应使用 `List.set`

`put` 属于 `Map`；列表按位置覆盖必须使用 `set`，索引也必须已存在。

```java
// 初始状态：List.set 将 names 索引 1 的 "B" 替换为 "C"
import java.util.ArrayList;
import java.util.List;
List<String> names = new ArrayList<>(List.of("A", "B"));
// 初始状态：names 当前为 [A, B]，本次 set 使用索引 1 和新值 "C"。
// 作用：put 属于 Map；列表按位置覆盖必须使用 set，索引也必须已存在。
String old = names.set(1, "C");
// 关键变化：String old = names.set(1, "C"); 将返回值写入 old；old 现在保存该具体结果。
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
