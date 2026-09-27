---
title: Stream 流式处理
date: 2026-09-22
category: Java基础快速入门
tags:
  - Java
  - Stream
  - Lambda
description: 掌握 Stream 的中间操作、终止操作、收集器和并行流边界。
---

# Stream 流式处理

## 学习目标

- 区分惰性中间操作与触发计算的终止操作，读懂一条流水线。
- 使用 `filter`、`map`、`flatMap`、排序和收集器生成聚合结果。
- 判断串行、并行和普通循环的适用场景，避免复用流或隐藏副作用。

## 核心知识点

### 专业术语

- **Stream**：描述元素处理步骤的流水线视图，不是存储数据的集合，也不负责持久化。
- **中间操作（intermediate operation）**：`filter`、`map`、`flatMap`、`sorted` 等返回新 Stream，通常惰性执行。
- **终止操作（terminal operation）**：`toList`、`collect`、`reduce`、`forEach` 等触发遍历并产生结果或副作用。
- **收集器（Collector）**：把元素聚合成列表、Map、分组或归约结果的策略，如 `groupingBy`。
- **Spliterator/并行流**：负责拆分数据源并调度并行处理；顺序、线程安全和开销都需要单独评估。

### 白话解释与边界

Stream 像一条尚未开机的流水线：中间操作只描述步骤，遇到终止操作才真正拉取元素，因此没有终止操作的管道不会执行。一次 Stream 消费后不能重新使用，因为它保存的是遍历状态；需要两次结果就从源集合重新创建。`map` 一进一出，`flatMap` 把每个元素产生的子流摊平，`reduce` 适合无副作用且满足结合律的归约，复杂聚合通常用 `collect`。

并行流不保证业务顺序，依赖拆分器、线程池和合并成本；小数据、阻塞 I/O、共享可变状态和顺序敏感逻辑通常不适合并行。循环更便于断点调试、提前退出和复杂错误处理，不要为了“看起来函数式”而牺牲清晰度。

## 常用用法

### `Collection.stream`/`Stream.of`：创建顺序流

```java
import java.util.List;
import java.util.stream.Stream;

List<String> names = List.of("Ann", "Bob");
long fromCollection = names.stream().count();
long fromValues = Stream.of("Java", "SQL").count();
System.out.println(fromCollection + ", " + fromValues);
// 输出：2, 2
```

流是数据源的处理视图，不会复制或持久化集合；同一条流消费后不能再次使用。

### `filter`：保留满足条件的元素

```java
import java.util.List;

List<Integer> result = List.of(1, 2, 3, 4).stream()
        .filter(number -> number % 2 == 0)
        .toList();
System.out.println(result);
// 输出：[2, 4]
```

`filter` 不改变源集合，多个条件可以串联；谓词应尽量无副作用。

### `map`：一进一出的转换

```java
import java.util.List;

List<String> labels = List.of("java", "sql").stream()
        .map(String::toUpperCase)
        .toList();
System.out.println(labels);
// 输出：[JAVA, SQL]
```

每个输入对应一个输出，适合字段提取和类型转换；一对多转换不要硬塞进 `map`。

### `flatMap`：展开嵌套流

```java
import java.util.List;

List<List<String>> groups = List.of(List.of("java", "sql"), List.of("http"));
List<String> all = groups.stream().flatMap(List::stream).toList();
System.out.println(all);
// 输出：[java, sql, http]
```

`flatMap` 把每个元素产生的子流合并成一层；子流为 `null` 时应改成 `Stream.empty()`，不要让管道抛异常。

### `distinct`：按 `equals` 去重

```java
import java.util.List;

List<String> unique = List.of("java", "sql", "java").stream().distinct().toList();
System.out.println(unique);
// 输出：[java, sql]
```

去重依赖元素的 `equals`/`hashCode` 契约，并保持顺序流中首次出现的顺序。

### `sorted`：排序流元素

```java
import java.util.Comparator;
import java.util.List;

List<String> sorted = List.of("Java", "C", "Go").stream()
        .sorted(Comparator.comparingInt(String::length).thenComparing(String::compareTo))
        .toList();
System.out.println(sorted);
// 输出：[C, Go, Java]
```

排序是有状态操作，可能需要缓存全部元素；比较器必须与业务排序规则一致。

### `limit`/`skip`：截取流的一段

```java
import java.util.stream.IntStream;

var page = IntStream.rangeClosed(1, 10).skip(3).limit(4).boxed().toList();
System.out.println(page);
// 输出：[4, 5, 6, 7]
```

`skip` 先跳过前 N 个，`limit` 再取最多 N 个；分页前要明确排序，否则数据源顺序变化会导致结果漂移。

### `peek`：调试流水线中的元素

```java
import java.util.ArrayList;
import java.util.List;

List<String> trace = new ArrayList<>();
List<Integer> result = List.of(1, 2, 3).stream()
        .peek(number -> trace.add("read=" + number))
        .map(number -> number * 2)
        .toList();
System.out.println(trace);
// 输出：[read=1, read=2, read=3]
System.out.println(result);
// 输出：[2, 4, 6]
```

`peek` 仍然是惰性的，只有终止操作触发才会执行；生产逻辑不要依赖它完成关键副作用。

### `reduce`：把元素归约成一个值

```java
import java.util.List;

int total = List.of(1, 2, 3, 4).stream().reduce(0, Integer::sum);
System.out.println(total);
// 输出：10
```

并行归约要求累加器满足结合律、尽量无副作用；复杂可变聚合优先考虑 `collect`。

### `anyMatch`/`allMatch`/`noneMatch`：匹配并短路

```java
import java.util.List;

var numbers = List.of(2, 4, 6);
System.out.println(numbers.stream().anyMatch(number -> number > 5));
// 输出：true
System.out.println(numbers.stream().allMatch(number -> number % 2 == 0));
// 输出：true
System.out.println(numbers.stream().noneMatch(number -> number < 0));
// 输出：true
```

匹配操作可能提前结束，适合存在性和约束检查；空流对 `allMatch`/`noneMatch` 的结果分别是 `true`。

### `findFirst`/`findAny`：查找元素

```java
import java.util.List;

var first = List.of("a", "b").stream().findFirst().orElse("none");
var any = List.of("a", "b").parallelStream().findAny().orElse("none");
System.out.println(first + ", " + any);
// 输出：a, a 或 b
```

`findFirst` 保留顺序语义，`findAny` 更适合并行流且不保证具体元素；结果为空时通过 `Optional` 表达。

### `forEach`/`forEachOrdered`：遍历并执行动作

```java
import java.util.List;

List.of("a", "b").stream().forEach(System.out::println);
// 输出：a
// 输出：b
```

`forEach` 适合末端通知或打印；需要并行流中的遇到顺序时才用 `forEachOrdered`，不要用它代替收集。

### `toList`：得到不可变结果列表

```java
import java.util.List;

List<String> result = List.of("a", "b").stream().map(String::toUpperCase).toList();
System.out.println(result);
// 输出：[A, B]
```

JDK 16 的 `Stream.toList()` 返回不可修改列表；需要可变列表时使用 `collect(Collectors.toCollection(ArrayList::new))`。

### `collect`：使用收集器汇总结果

```java
import java.util.List;
import java.util.stream.Collectors;

var result = List.of("java", "sql").stream().collect(Collectors.joining(", "));
System.out.println(result);
// 输出：java, sql
```

`collect` 适合把流变成列表、Map、分组或统计结果，具体收集器可查 [Collectors 收集器速查](./05-Collectors收集器速查)。

## 不常用但需要知道

### 流不可复用：终止操作后必须重新创建

```java
import java.util.List;
import java.util.stream.Stream;

Stream<String> stream = List.of("a", "b").stream();
System.out.println(stream.count());
// 输出：2
try {
    stream.count();
} catch (IllegalStateException ex) {
    System.out.println(ex.getClass().getSimpleName());
    // 输出：IllegalStateException
}
```

需要多个结果时保留源集合，或者为每次计算重新调用 `stream()`。

### 有副作用的 `forEach`：不要并发写普通集合

```java
import java.util.ArrayList;
import java.util.List;

List<Integer> target = new ArrayList<>();
List.of(1, 2, 3).stream().forEach(target::add);
System.out.println(target.size());
// 输出：3
```

顺序流中这个例子可运行，但切换成并行流后普通 `ArrayList` 不提供安全性；优先使用 `toList` 或 `collect`。

### `parallel()`/`parallelStream()`：显式并行边界

```java
import java.util.List;

long count = List.of(1, 2, 3, 4).parallelStream()
        .filter(number -> number % 2 == 0)
        .count();
System.out.println(count);
// 输出：2
```

并行不等于更快；小数据、阻塞 I/O、顺序敏感和共享状态场景通常应保持串行，并用基准测试验证收益。

### `unordered`：声明不需要遇到顺序

```java
import java.util.List;

long count = List.of("a", "b", "c").parallelStream().unordered().distinct().count();
System.out.println(count);
// 输出：3
```

只有业务确实不关心顺序时才使用，否则可能破坏 `findFirst`、排序或分页语义。

### `onClose`/`close`：管理特殊流资源

```java
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Stream;

List<String> events = new ArrayList<>();
try (Stream<String> stream = Stream.of("a").onClose(() -> events.add("closed"))) {
    System.out.println(stream.count());
    // 输出：1
}
System.out.println(events);
// 输出：[closed]
```

普通集合流不需要手动关闭；读取文件等拥有资源的流才应使用 try-with-resources。

## 专题导航

- 需要分组、聚合、扁平化嵌套数据，查看 [Stream 分组聚合与扁平化](./06-Stream分组聚合与扁平化)。
- 需要选择 `joining`、`groupingBy`、`toMap` 或统计收集器，查看 [Collectors 收集器速查](./05-Collectors收集器速查)。

## 简单案例

```java
import java.math.BigDecimal;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

record Order(String user, List<String> items, BigDecimal amount, boolean paid) { }

public class StreamDemo {
    public static void main(String[] args) {
        List<Order> orders = List.of(
                new Order("alice", List.of("book", "pen"), new BigDecimal("20.00"), true),
                new Order("bob", List.of("bag"), new BigDecimal("80.00"), false),
                new Order("alice", List.of("cup"), new BigDecimal("35.00"), true));

        Map<String, BigDecimal> totals = orders.stream()
                .filter(Order::paid)
                .collect(Collectors.groupingBy(Order::user,
                        Collectors.reducing(BigDecimal.ZERO, Order::amount, BigDecimal::add)));
        List<String> itemNames = orders.stream()
                .filter(Order::paid)
                .flatMap(order -> order.items().stream())
                .map(String::toUpperCase)
                .sorted()
                .toList();

        System.out.println("totals=" + totals);
        // 输出：totals={alice=55.00}
        System.out.println("items=" + itemNames);
        // 输出：items=[BOOK, CUP, PEN]
    }
}
```

输出为 `totals={alice=55.00}` 和按字母排序的已支付商品名。第一条流水线用 `filter`、`groupingBy` 和 `reducing` 聚合金额，第二条用 `flatMap` 把订单内列表展开；源订单没有被修改。

## 易混点

- 中间操作是惰性的，必须有终止操作才会遍历；写出管道不等于已经执行。
- Stream 只能消费一次，重用会抛 `IllegalStateException`；需要另一个结果就从源集合重新创建。
- `toMap` 遇重复键默认抛异常，应提供合并函数；`groupingBy` 更适合一键多值或分组聚合。
- 并行流不是免费加速器，共享可变集合、阻塞 I/O 和顺序依赖会让结果或性能变差。

## 课后小问

1. 为什么只写 `orders.stream().filter(...)` 不会产生输出？
答案：`filter` 是惰性中间操作，只有 `toList`、`collect`、`forEach` 等终止操作才会触发遍历。
解析：Stream 保存的是处理描述而不是结果；缺少终止操作时，流水线没有被启动，谓词甚至不会被调用。

2. 什么时候普通 for 循环可能比 Stream 更合适？
答案：需要复杂分支、提前退出、逐步调试、精细异常处理或本身数据很小且流水线难以表达时。
解析：Stream 擅长声明式变换和聚合，但并不消除控制流成本；可读性、性能证据和副作用边界应共同决定选择。

## 本节小结

- Stream 是一次性的惰性处理视图，中间操作描述步骤，终止操作触发计算。
- filter、map、flatMap 分别筛选、转换和展开，收集器负责分组与聚合。
- reduce 需要结合律和无副作用，复杂可变归约优先使用合适的 Collector。
- 并行流有拆分和合并成本，顺序、I/O、共享状态和小数据是重要边界。

## 快速回顾

- 能区分中间操作与终止操作并指出执行时机。
- 能用 flatMap 处理嵌套集合并用 groupingBy 聚合。
- 能说明 Stream 为什么不能复用。
- 能根据控制流复杂度和数据规模判断是否使用 Stream 或并行流。
