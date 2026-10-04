---
title: Stream 分组聚合与扁平化
date: 2026-09-27T00:00:00.000Z
category: Java基础快速入门
tags:
  - Java
  - Stream
  - 分组聚合
description: 用 Stream 和下游收集器处理嵌套集合、分组、统计和去重。
---

# Stream 分组聚合与扁平化

## 学习目标

- 能把嵌套订单、标签或权限列表扁平化为一条流。
- 能用 `groupingBy`、`partitioningBy`、`toMap` 和下游收集器组织结果。
- 能区分归约、收集和副作用，避免在 Stream 中修改共享状态。

## 核心知识点

### 专业术语

- **扁平化（flatten）**：把 `Stream<List<T>>` 变成 `Stream<T>`，常用 `flatMap`。
- **下游收集器**：分组后对每组继续 `mapping`、`counting`、`summingInt` 或 `reducing`。
- **归约（reduction）**：把多个元素按结合规则合成一个值，如求和、最大值或拼接。
- **一键一值与一键多值**：`toMap` 通常要求一键一值，`groupingBy` 保存或聚合一键多值。

### 白话解释与边界

先决定结果形状，再选择操作：嵌套列表需要 `flatMap`，分组需要 `groupingBy`，每组只留一个汇总值才使用下游 `reducing` 或 `summing`。`map` 只把一个输入变成一个输出，如果在其中返回 List，会得到嵌套结果而不是平面结果。

Stream 管道应尽量保持无副作用。收集器会管理结果容器和合并逻辑，比在 `forEach` 里往普通 `ArrayList` 追加更容易保证串行/并行语义。需要复杂提前退出、逐步调试或细粒度异常处理时，普通循环仍然是清晰的选择。

## 常用用法

### `flatMap`：把多层列表展开一层

空子列表自然产生空子流；如果子列表可能为 `null`，应先转换为 `List.of()` 或 `Stream.empty()`。

```java
import java.util.List;

var nested = List.of(List.of("Java", "SQL"), List.of("HTTP", "JVM"));
// 初始状态：nested 当前为 List.of(List.of("Java", "SQL"), List.of("HTTP", "JVM"))。
var flat = nested.stream().flatMap(List::stream).toList();
// 初始状态：flat 当前为 nested.stream().flatMap(List::stream).toList()。
// 作用：空子列表自然产生空子流。
System.out.println(flat);
// 输出：[Java, SQL, HTTP, JVM]
```

### 多层 `flatMap`：展开订单和商品

展开后会丢失订单边界；需要保留订单信息时先映射成包含订单 ID 的记录，而不是只收集字符串。

```java
// 语义：展开后会丢失订单边界。
// 初始状态：orders 初始为 List.of(new Order("A", List.of("book", "pen")), new Order("B", List.of("cup")))；items 初始为 orders.stream().flatMap(order -> order.items().stream()).toList()。
import java.util.List;

record Order(String id, List<String> items) { }

var orders = List.of(new Order("A", List.of("book", "pen")), new Order("B", List.of("cup")));
// 初始状态：orders 的初始值为 List.of(new Order("A", List.of("book", "pen")), new Order("B", List.of("cup")))。
var items = orders.stream().flatMap(order -> order.items().stream()).toList();
// 返回：items 接收 orders.stream().flatMap(order -> order.items().stream()).toList() 的返回值。
System.out.println(items);
// 输出：[book, pen, cup]
```

### `flatMap` + `distinct`：展开后去重

`distinct` 依赖元素的 `equals`/`hashCode`；自定义对象应先正确实现值相等语义。

```java
import java.util.List;

var tags = List.of(List.of("java", "sql"), List.of("java", "http"));
// 初始状态：tags 当前为 List.of(List.of("java", "sql"), List.of("java", "http"))。
var unique = tags.stream().flatMap(List::stream).distinct().toList();
// 初始状态：unique 当前为 tags.stream().flatMap(List::stream).distinct().toList()。
// 作用：distinct 依赖元素的 equals/hashCode。
System.out.println(unique);
// 输出：[java, sql, http]
```

### `groupingBy`：分组保留元素列表

默认结果是 `Map<User, List<Order>>`；只需要汇总值时可以直接指定下游收集器，避免保留整组对象。

```java
import java.util.List;
import java.util.stream.Collectors;

record Order(String user, String item, int amount) { }

var orders = List.of(new Order("ann", "book", 20), new Order("bob", "pen", 8), new Order("ann", "cup", 35));
// 初始状态：orders 当前为 List.of(new Order("ann", "book", 20), new Order("bob", "pen", 8), new Order("ann", "cup", 35))。
var groups = orders.stream().collect(Collectors.groupingBy(Order::user));
// 初始状态：groups 当前为 orders.stream().collect(Collectors.groupingBy(Order::user))。
// 作用：默认结果是 Map<User, List<Order>>。
System.out.println(groups.get("ann").size());
// 输出：2
```

### `groupingBy` + `mapping`：分组后提取字段

`mapping` 让结果只保留需要的字段；需要去重时替换下游为 `Collectors.toSet()`。

```java
import java.util.List;
import java.util.stream.Collectors;

record Order(String user, String item, int amount) { }

var orders = List.of(new Order("ann", "book", 20), new Order("ann", "cup", 35));
// 初始状态：orders 当前为 List.of(new Order("ann", "book", 20), new Order("ann", "cup", 35))。
var items = orders.stream().collect(Collectors.groupingBy(
        Order::user, Collectors.mapping(Order::item, Collectors.toList())));
        // 作用：mapping 让结果只保留需要的字段。
System.out.println(items);
// 输出：{ann=[book, cup]}
```

### `groupingBy` + `summingInt`：分组求和

用数值下游收集器比先分组 List 再循环求和更直接，也减少中间对象。

```java
import java.util.List;
import java.util.stream.Collectors;

record Order(String user, int amount) { }

var orders = List.of(new Order("ann", 20), new Order("ann", 35), new Order("bob", 8));
// 初始状态：orders 当前为 List.of(new Order("ann", 20), new Order("ann", 35), new Order("bob", 8))。
var totals = orders.stream().collect(Collectors.groupingBy(
        Order::user, Collectors.summingInt(Order::amount)));
        // 作用：用数值下游收集器比先分组 List 再循环求和更直接，也减少中间对象。
System.out.println(totals);
// 输出：{ann=55, bob=8}
```

### `groupingBy` + `summarizingInt`：分组统计摘要

摘要同时提供数量、总和、最小、最大和平均值，适合报表或诊断数据。

```java
import java.util.List;
import java.util.stream.Collectors;

record Order(String user, int amount) { }

var orders = List.of(new Order("ann", 20), new Order("ann", 35), new Order("bob", 8));
// 初始状态：orders 当前为 List.of(new Order("ann", 20), new Order("ann", 35), new Order("bob", 8))。
var stats = orders.stream().collect(Collectors.groupingBy(
        Order::user, Collectors.summarizingInt(Order::amount)));
        // 作用：摘要同时提供数量、总和、最小、最大和平均值，适合报表或诊断数据。
System.out.println(stats.get("ann").getAverage());
// 输出：27.5
```

### `groupingBy` + `reducing`：每组按规则归约

归约函数要明确初始值和结合规则；如果只是求和、最大值等常见统计，优先使用对应的专用收集器。

```java
import java.util.List;
import java.util.stream.Collectors;

record Order(String user, int amount) { }

var orders = List.of(new Order("ann", 20), new Order("ann", 35), new Order("bob", 8));
// 初始状态：orders 当前为 List.of(new Order("ann", 20), new Order("ann", 35), new Order("bob", 8))。
var max = orders.stream().collect(Collectors.groupingBy(
        Order::user, Collectors.reducing(0, Order::amount, Integer::max)));
        // 作用：归约函数要明确初始值和结合规则。
System.out.println(max);
// 输出：{ann=35, bob=8}
```

### `partitioningBy`：把数据切成两部分

二分条件用 `partitioningBy` 更清晰；多个分类值不要把复杂条件硬塞成真假。

```java
// 语义：二分条件用 partitioningBy 更清晰。
// 调用参数：代码依次使用 10、25、80、5、20。
import java.util.List;
import java.util.stream.Collectors;

var parts = List.of(10, 25, 80, 5).stream().collect(
        Collectors.partitioningBy(amount -> amount >= 20));
        // 初始状态：parts 当前保存 List.of(10, 25, 80, 5).stream().collect( Collectors.partitioningBy(amount -> amount >= 20))的计算结果。
        // 作用：通过 partitioningBy 把数据切成两部分。
System.out.println(parts);
// 输出：{false=[10, 5], true=[25, 80]}
```

### `toMap` + 合并函数：一键一值并处理冲突

没有合并策略的重复键会抛异常；覆盖、相加、取最大或收集列表都应在代码中明确表达。

```java
// 语义：没有合并策略的重复键会抛异常。
// 初始状态：scores 初始为 List.of(new Score("java", 80), new Score("java", 95))。
import java.util.List;
import java.util.stream.Collectors;

record Score(String name, int value) { }
// 作用：没有合并策略的重复键会抛异常；覆盖、相加、取最大或收集列表都应在代码中明确表达。

var scores = List.of(new Score("java", 80), new Score("java", 95));
// 关键变化：scores 接收表达式 List.of(new Score("java", 80), new Score("java", 95)) 的计算结果。
// 初始状态：scores 的初始值为 List.of(new Score("java", 80), new Score("java", 95))。
var best = scores.stream().collect(Collectors.toMap(
        Score::name, Score::value, Integer::max));
System.out.println(best);
// 输出：{java=95}
```

### `collect`：把管道结果交给收集器

`collect` 适合可变结果容器或复杂聚合；只需要不可变 List 时直接使用 `toList()` 更简洁。

```java
// 语义：collect 适合可变结果容器或复杂聚合。
// 调用参数：代码依次使用 "java"、"stream"、"api"、4、"/"。
import java.util.List;
import java.util.stream.Collectors;

var result = List.of("java", "stream", "api").stream()
        .filter(text -> text.length() >= 4)
        .collect(Collectors.joining("/"));
        // 初始状态：result 当前保存 List.of("java", "stream", "api").stream() .filter(text -> text.length() >= 4) .collect(Collectors.joining("/"))的计算结果。
        // 作用：通过 collect 把管道结果交给收集器。
System.out.println(result);
// 输出：java/stream
```

### `reduce`：不依赖收集器的单值归约

`reduce` 的累加器应满足结合律，才能安全地考虑并行；需要同时保留多个字段时使用 `collect` 或记录类型。

```java
import java.util.List;

int total = List.of(20, 35, 8).stream().reduce(0, Integer::sum);
// 初始状态：total 当前为 List.of(20, 35, 8).stream().reduce(0, Integer::sum)。
// 作用：reduce 的累加器应满足结合律，才能安全地考虑并行。
System.out.println(total);
// 输出：63
```
## 不常用但需要知道

### `mapMulti`：用回调直接发出多个元素（Java 16+）

`mapMulti` 可避免为每个元素创建短生命周期子流，但回调逻辑比 `flatMap` 更难读；只有性能或多值回调确实需要时使用。

```java
import java.util.List;

var result = List.of("java", "sql").stream()
        .<String>mapMulti((text, sink) -> {
        // 初始状态：result 当前保存 List.of("java", "sql").stream() .<String>mapMulti((text, sink) -> {的计算结果。
        // 作用：通过 mapMulti 用回调直接发出多个元素（Java 16+）。
            sink.accept(text);
            sink.accept(text.toUpperCase());
        })
        .toList();
System.out.println(result);
// 输出：[java, JAVA, sql, SQL]
```

### `collectingAndThen`：分组后固定结果形态

它常用于把可变收集结果变成只读快照；不要为了少写一行而隐藏重要的业务转换。

```java
import java.util.List;
import java.util.stream.Collectors;

var result = List.of("java", "sql").stream().collect(
        Collectors.collectingAndThen(Collectors.toList(), List::copyOf));
        // 初始状态：result 当前保存 List.of("java", "sql").stream().collect( Collectors.collectingAndThen(Collectors.toList(), List::copyOf))的计算结果。
        // 作用：通过 collectingAndThen 分组后固定结果形态。
System.out.println(result);
// 输出：[java, sql]
```

### `unordered`：放弃顺序约束换取并行空间

只有业务不需要遇到顺序时才可使用；分页、首个元素和有序输出不应取消顺序语义。

```java
import java.util.List;

long count = List.of("java", "sql", "java").parallelStream()
        .unordered().distinct().count();
        // 初始状态：count 当前保存 List.of("java", "sql", "java").parallelStream() .unordered().distinct().count()的计算结果。
        // 作用：通过 unordered 放弃顺序约束换取并行空间。
System.out.println(count);
// 输出：2
```

### 并行收集与共享副作用：边界示例

并行流应使用线程安全的收集器或无副作用的归约；小数据、阻塞 I/O 和顺序敏感逻辑通常不适合并行。

```java
import java.util.ArrayList;
import java.util.List;

List<Integer> result = new ArrayList<>();
// 关键变化：result 接收表达式 new ArrayList<>() 的计算结果。
// 初始状态：result 的初始值为 new ArrayList<>()。
List.of(1, 2, 3, 4).parallelStream().forEach(result::add);
System.out.println(result.size());
// 输出：不应依赖具体结果（共享 ArrayList 非线程安全）
```
## 简单案例

```java
import java.util.List;
import java.util.stream.Collectors;

record Order(String user, List<String> items, int amount) { }

public class StreamGroupDemo {
    public static void main(String[] args) {
        var orders = List.of(
                new Order("ann", List.of("book", "pen"), 28),
                new Order("bob", List.of("cup"), 35),
                new Order("ann", List.of("cup"), 20));
        var items = orders.stream().flatMap(order -> order.items().stream()).distinct().sorted().toList();
        var totals = orders.stream().collect(Collectors.groupingBy(
                Order::user, Collectors.summingInt(Order::amount)));
        System.out.println(items);
        // 输出：[book, cup, pen]
        System.out.println(totals);
        // 输出：{ann=48, bob=35}
    }
}
```

## 易混点

- `map` 返回一层元素，`flatMap` 返回子流并摊平；嵌套集合用错会得到 `List<List<T>>`。
- `groupingBy` 默认保留每组列表，直接用下游求和或统计可以减少中间数据。
- `reduce` 适合单值结合运算，复杂多字段聚合使用 `collect` 更易维护。
- 并行流中的 `forEach` 不能安全地修改普通集合，收集器和无副作用函数才是可组合边界。

## 课后小问

1. 为什么订单商品要用 `flatMap` 而不是 `map`？
   - 答案：每个订单有多个商品，`flatMap` 能把每个订单产生的子流合并为一条商品流。
   - 解析：若使用 `map`，结果会是 `Stream<List<String>>`；还需要继续遍历才能拿到商品本身。

2. 什么时候应该用 `groupingBy` 的下游 `summingInt`？
   - 答案：只需要每组的总和而不需要保留每个元素时。
   - 解析：下游收集器直接维护数值结果，避免先存储完整列表再进行第二次循环。

## 本节小结

- `flatMap` 负责把嵌套元素展开，`distinct`、`sorted` 可在展开后继续整理结果。
- `groupingBy` 配合 `mapping`、`summingInt`、`summarizingInt` 和 `reducing` 可以表达分组聚合。
- `partitioningBy` 适合真假二分，`toMap` 必须处理重复键。
- 聚合优先使用无副作用收集器，只有证据支持时才考虑并行和 `mapMulti`。

## 快速回顾

- 能把嵌套订单转换成平面的商品流。
- 能根据结果形状选择 `groupingBy`、`partitioningBy` 或 `toMap`。
- 能用下游收集器直接计算分组总和与统计摘要。
- 能解释 Stream 中共享可变副作用和并行边界。
