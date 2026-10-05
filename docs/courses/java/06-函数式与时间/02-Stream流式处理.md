---
title: Stream 流式处理
date: 2026-09-22T00:00:00.000Z
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

### `Collection.stream`：从集合创建顺序流

流是数据源的处理视图，不会复制或持久化集合；同一条流消费后不能再次使用。

```java
// 语义：流是数据源的处理视图，不会复制或持久化集合。
import java.util.List;
import java.util.stream.Stream;

List<String> names = List.of("Ann", "Bob");
long fromCollection = names.stream().count();
// 关键变化：long fromCollection = names.stream().count();；统计 上一个链式结果 的元素数量，计数结果写入 fromCollection。
long fromValues = Stream.of("Java", "SQL").count();
// 关键变化：long fromValues = Stream.of("Java", "SQL").count();；统计 上一个链式结果 的元素数量，计数结果写入 fromValues。
// 输出：2
System.out.println(fromCollection + ", " + fromValues);
// 输出：2, 2
```

### `Stream.of`：从显式元素创建顺序流

`Stream.of("Java", "SQL")` 把两个给定值作为流元素，不依赖外部集合；上例的 `fromValues` 因此为 2。

```java
long fromValues = Stream.of("Java", "SQL").count();
// 关键变化：long fromValues = Stream.of("Java", "SQL").count();；统计 上一个链式结果 的元素数量，计数结果写入 fromValues。
// 输出：2
```

### `filter`：保留满足条件的元素

`filter` 不改变源集合，多个条件可以串联；谓词应尽量无副作用。

```java
// 语义：filter 不改变源集合，多个条件可以串联。
import java.util.List;

List<Integer> result = List.of(1, 2, 3, 4).stream()
        .filter(number -> number % 2 == 0)
        .toList();
        // 关键变化：List<Integer> result = List.of(1, 2, 3, 4).stream() .filter(number -> number % 2 == 0) .toList();；在流上调用 filter 处理元素，结果写入 result。
        // 输入：filter(number -> number % 2 == 0)；从 1、2、3、4 中筛选出 2、4。
        // 关键变化：filter 返回只含 2、4 的流，toList 收集为 [2, 4] 并写入 result。
        // 关键变化：.toList();；终止当前流管道并把元素收集为 List；返回列表结果。
System.out.println(result);
// 输出：[2, 4]
```

### `map`：一进一出的转换

每个输入对应一个输出，适合字段提取和类型转换；一对多转换不要硬塞进 `map`。

```java
// 语义：每个输入对应一个输出，适合字段提取和类型转换。
import java.util.List;

List<String> labels = List.of("java", "sql").stream()
        .map(String::toUpperCase)
        .toList();
        // 关键变化：.map(String::toUpperCase) .toList();；按 mapper 将每个元素转换后继续传递到下游。
        // 关键变化：.toList();；终止当前流管道并把元素收集为 List；返回列表结果。
System.out.println(labels);
// 输出：[JAVA, SQL]
```

### `flatMap`：展开嵌套流

`flatMap` 把每个元素产生的子流合并成一层；子流为 `null` 时应改成 `Stream.empty()`，不要让管道抛异常。

```java
// 语义：flatMap 把每个元素产生的子流合并成一层。
import java.util.List;

List<List<String>> groups = List.of(List.of("java", "sql"), List.of("http"));
List<String> all = groups.stream().flatMap(List::stream).toList();
System.out.println(all);
// 输出：[java, sql, http]
```

### `distinct`：按 `equals` 去重

去重依赖元素的 `equals`/`hashCode` 契约，并保持顺序流中首次出现的顺序。

```java
// 语义：去重依赖元素的 equals/hashCode 契约，并保持顺序流中首次出现的顺序。
import java.util.List;

List<String> unique = List.of("java", "sql", "java").stream().distinct().toList();
// 关键变化：List<String> unique = List.of("java", "sql", "java").stream().distinct().toList();；在流上调用 distinct 处理元素，结果写入 unique。
System.out.println(unique);
// 输出：[java, sql]
```

### `sorted`：排序流元素

排序是有状态操作，可能需要缓存全部元素；比较器必须与业务排序规则一致。

```java
// 语义：排序是有状态操作，可能需要缓存全部元素。
import java.util.Comparator;
import java.util.List;

List<String> sorted = List.of("Java", "C", "Go").stream()
        .sorted(Comparator.comparingInt(String::length).thenComparing(String::compareTo))
        .toList();
        // 关键变化：.sorted(Comparator.comparingInt(String::length).thenComparing(String::compareTo)) .toList();；按指定比较器或自然顺序重新排列元素。
        // 关键变化：.toList();；终止当前流管道并把元素收集为 List；返回列表结果。
System.out.println(sorted);
// 输出：[C, Go, Java]
```

### `limit`：只取前 N 个元素

`limit` 截断流并保留最多 N 个元素，依赖“前几个”语义时要先确定稳定顺序。

```java
// 语义：limit 截断流并保留最多 N 个元素，依赖“前几个”语义时要先确定稳定顺序。
import java.util.List;

List<Integer> firstThree = List.of(1, 2, 3, 4, 5).stream()
        .limit(3)
        .toList();
        // 关键变化：List<Integer> firstThree = List.of(1, 2, 3, 4, 5).stream() .limit(3) .toList();；在流上调用 limit 处理元素，结果写入 firstThree。
        // 关键变化：.limit(3) .toList();；只保留前 3 个元素；流长度受限。
        // 关键变化：.toList();；终止当前流管道并把元素收集为 List；返回列表结果。

System.out.println(firstThree);
// 输出：[1, 2, 3]
```

### `skip`：跳过前 N 个元素

`skip` 丢弃前 N 个元素，常用于偏移读取；用于分页时仍需先建立稳定排序。

```java
// 语义：skip 丢弃前 N 个元素，常用于偏移读取。
import java.util.List;

List<Integer> remaining = List.of(1, 2, 3, 4, 5).stream()
        .skip(2)
        .toList();
        // 关键变化：List<Integer> remaining = List.of(1, 2, 3, 4, 5).stream() .skip(2) .toList();；在流上调用 skip 处理元素，结果写入 remaining。
        // 关键变化：.skip(2) .toList();；跳过前 2 个元素；后续流从其余元素开始。
        // 关键变化：.toList();；终止当前流管道并把元素收集为 List；返回列表结果。

System.out.println(remaining);
// 输出：[3, 4, 5]
```

### `peek`：调试流水线中的元素

`peek` 仍然是惰性的，只有终止操作触发才会执行；生产逻辑不要依赖它完成关键副作用。

```java
// 语义：peek 仍然是惰性的，只有终止操作触发才会执行。
import java.util.ArrayList;
import java.util.List;

List<String> trace = new ArrayList<>();
List<Integer> result = List.of(1, 2, 3).stream()
        .peek(number -> trace.add("read=" + number))
        // 输入：peek(number -> trace.add("read=" + number));；对 1、2、3 逐个执行观察 lambda。
        // 关键变化：peek 为每个元素向 trace 追加 read=1、read=2、read=3；元素继续流向 map。
        .map(number -> number * 2)
        .toList();
        // 关键变化：List<Integer> result = List.of(1, 2, 3).stream() .peek(number -> trace.add("read=" + number)) .map(number -> number * 2) .toList();；peek 依次追加 read=1、read=2、read=3，map 将元素翻倍，toList 返回 [2, 4, 6] 写入 result。
        // 关键变化：.map(number -> number * 2) .toList();；按 mapper 将每个元素转换后继续传递到下游。
        // 关键变化：.toList();；终止当前流管道并把元素收集为 List；返回列表结果。
System.out.println(trace);
// 输出：[read=1, read=2, read=3]
System.out.println(result);
// 输出：[2, 4, 6]
```

### `reduce`：把元素归约成一个值

并行归约要求累加器满足结合律、尽量无副作用；复杂可变聚合优先考虑 `collect`。

```java
// 语义：并行归约要求累加器满足结合律、尽量无副作用。
import java.util.List;

int total = List.of(1, 2, 3, 4).stream().reduce(0, Integer::sum);
System.out.println(total);
// 输出：10
```

### `allMatch`：检查所有元素是否满足条件

`allMatch` 遇到第一个不匹配元素就短路，空流会返回 `true`。

```java
// 语义：allMatch 遇到第一个不匹配元素就短路，空流会返回 true。
import java.util.List;

List<Integer> numbers = List.of(2, 4, 6);
boolean allEven = numbers.stream()
        .allMatch(number -> number % 2 == 0);
        // 关键变化：numbers 中的 2、4、6 都满足 number % 2 == 0，allMatch 返回 true 并写入 allEven。
        // 输入：allMatch(number -> number % 2 == 0)；检查 numbers 中的 2、4、6。
        // 关键变化：2、4、6 都满足谓词，allMatch 返回 true 并写入 allEven。

System.out.println(allEven);
// 输出：true
```

### `anyMatch`：检查是否存在匹配元素

`anyMatch` 遇到第一个匹配元素就短路，适合存在性检查。

```java
// 语义：anyMatch 遇到第一个匹配元素就短路，适合存在性检查。
import java.util.List;

List<Integer> numbers = List.of(2, 4, 6);
boolean hasLargeValue = numbers.stream()
        .anyMatch(number -> number > 5);
        // 关键变化：numbers 中的 6 满足 number > 5，anyMatch 立即返回 true 并写入 hasLargeValue。
        // 关键变化：.anyMatch(number -> number > 5);；调用 anyMatch，实参为 number -> number > 5；按 number -> number > 5 检查流，返回是否存在匹配元素。

System.out.println(hasLargeValue);
// 输出：true
```

### `noneMatch`：检查是否没有元素匹配

`noneMatch` 遇到第一个匹配元素就返回 `false`，空流会返回 `true`。

```java
// 语义：noneMatch 遇到第一个匹配元素就返回 false，空流会返回 true。
import java.util.List;

List<Integer> numbers = List.of(2, 4, 6);
boolean hasNoNegative = numbers.stream()
        .noneMatch(number -> number < 0);
        // 关键变化：2、4、6 都不满足 number < 0，noneMatch 返回 true 并写入 hasNoNegative。
        // 关键变化：.noneMatch(number -> number < 0);；调用 noneMatch，实参为 number -> number < 0；按 number -> number < 0 检查流，返回是否不存在匹配元素。

System.out.println(hasNoNegative);
// 输出：true
```

### `findFirst`：查找遇到顺序中的首个元素

`findFirst` 保留流的遇到顺序，并用 `Optional` 表达空流没有结果。

```java
// 语义：findFirst 保留流的遇到顺序，并用 Optional 表达空流没有结果。
import java.util.List;

String first = List.of("a", "b", "c").stream()
        .filter(text -> !text.isBlank())
        .findFirst()
        .orElse("none");
        // 关键变化：String first = List.of("a", "b", "c").stream() .filter(text -> !text.isBlank()) .findFirst() .orElse("none");；在流上调用 filter 处理元素，结果写入 first。
        // 关键变化：.filter(text -> !text.isBlank()) .findFirst() .orElse("none");；按 predicate 筛选元素，只保留满足条件的元素。
        // 关键变化：.findFirst() .orElse("none");；从流中查找元素并返回 Optional 结果；流源内容不变。
        // 关键变化：.orElse("none");；调用 orElse，实参为 "none"；Optional 为空时使用 "none"；返回最终值。
System.out.println(first);
// 输出：a
```

### `findAny`：查找任意一个元素

`findAny` 不承诺返回哪个匹配元素，更适合不关心顺序的并行查询。

```java
// 语义：findAny 不承诺返回哪个匹配元素，更适合不关心顺序的并行查询。
import java.util.List;

String any = List.of("a", "b", "c").parallelStream()
        .filter(text -> !text.isBlank())
        .findAny()
        .orElse("none");
        // 关键变化："a"、"b"、"c" 都通过非空筛选，findAny 返回其中任一项并由 orElse 写入 any；并行执行不保证具体是哪一项。
        // 关键变化：.filter(text -> !text.isBlank()) .findAny() .orElse("none");；按 predicate 筛选元素，只保留满足条件的元素。
        // 关键变化：.findAny() .orElse("none");；从流中查找元素并返回 Optional 结果；流源内容不变。
        // 关键变化：.orElse("none");；调用 orElse，实参为 "none"；Optional 为空时使用 "none"；返回最终值。
System.out.println(List.of("a", "b", "c").contains(any));
// 输出：true
```

### `forEach`：对每个元素执行动作

`forEach` 适合末端通知或打印；并行流中不要依赖顺序，也不要修改非线程安全共享状态。

```java
// 语义：forEach 适合末端通知或打印。
import java.util.List;

List<String> names = List.of("Ann", "Bob");
names.stream()
        .map(String::toUpperCase)
        .forEach(System.out::println);
        // 关键变化：names.stream() .map(String::toUpperCase) .forEach(System.out::println);；把 上一个链式结果 的每个元素交给 System.out::println，无返回值；遍历动作完成。
        // 关键变化：.map(String::toUpperCase) .forEach(System.out::println);；把 上一个链式结果 的每个元素交给 System.out::println，无返回值；遍历动作完成。
        // 关键变化：.forEach(System.out::println);；把 上一个链式结果 的每个元素交给 System.out::println，无返回值；遍历动作完成。
// 输出：ANN、BOB
```

### `forEachOrdered`：按遇到顺序执行动作

`forEachOrdered` 在并行流中仍保留遇到顺序，但顺序约束可能降低并行收益。

```java
// 语义：forEachOrdered 在并行流中仍保留遇到顺序，但顺序约束可能降低并行收益。
import java.util.List;

List<Integer> numbers = List.of(1, 2, 3);
numbers.parallelStream()
        .map(number -> number * 10)
        .forEachOrdered(System.out::println);
        // 关键变化：numbers.parallelStream() .map(number -> number * 10) .forEachOrdered(System.out::println);；把 上一个链式结果 的每个元素交给 System.out::println，无返回值；遍历动作完成。
        // 关键变化：.map(number -> number * 10) .forEachOrdered(System.out::println);；把 上一个链式结果 的每个元素交给 System.out::println，无返回值；遍历动作完成。
        // 关键变化：.forEachOrdered(System.out::println);；把 上一个链式结果 的每个元素交给 System.out::println，无返回值；遍历动作完成。
// 输出：10、20、30
```

### `toList`：得到不可变结果列表

JDK 16 的 `Stream.toList()` 返回不可修改列表；需要可变列表时使用 `collect(Collectors.toCollection(ArrayList::new))`。

```java
// 语义：JDK 16 的 Stream.toList() 返回不可修改列表。
import java.util.List;

List<String> result = List.of("a", "b").stream().map(String::toUpperCase).toList();
System.out.println(result);
// 输出：[A, B]
```

### `Collectors.toList`：收集为可变列表

需要继续增删结果时，用它收集元素；不要把可变性当作接口契约。

```java
// 语义：需要继续增删结果时，用它收集元素。
import java.util.List;
import java.util.stream.Collectors;
var values = List.of("a", "b").stream()
        .collect(Collectors.toList());
        // 关键变化：var values = List.of("a", "b").stream() .collect(Collectors.toList());；在流上调用 collect 处理元素，结果写入 values。
        // 关键变化：.collect(Collectors.toList());；使用指定 Collector 聚合当前元素；返回该 Collector 的结果。
values.add("c");
System.out.println(values);
// 输出：[a, b, c]
```

### `Collectors.toSet`：收集并去重

它按 `equals`/`hashCode` 去重，结果集合的具体实现与顺序不保证。

```java
// 语义：它按 equals/hashCode 去重，结果集合的具体实现与顺序不保证。
import java.util.List;
import java.util.stream.Collectors;
var values = List.of("a", "a", "b").stream()
        .collect(Collectors.toSet());
        // 关键变化：var values = List.of("a", "a", "b").stream() .collect(Collectors.toSet());；在流上调用 collect 处理元素，结果写入 values。
        // 关键变化：.collect(Collectors.toSet());；使用指定 Collector 聚合当前元素；返回该 Collector 的结果。
System.out.println(values.size());
// 输出：2
System.out.println(values.containsAll(List.of("a", "b")));
// 输出：true
```

### `Collectors.toMap`：按键和值构造映射

键可能重复时必须提供合并函数，否则收集会抛出异常。

```java
// 语义：键可能重复时必须提供合并函数，否则收集会抛出异常。
import java.util.List;
import java.util.stream.Collectors;
var lengths = List.of("aa", "ab", "b").stream()
        .collect(Collectors.toMap(String::length, s -> s,
                (left, right) -> left + "," + right));
                // 关键变化：.collect(Collectors.toMap(String::length, s -> s, (left, right) -> left + "," + right));；使用指定 Collector 聚合当前元素；返回该 Collector 的结果。
System.out.println(lengths);
// 输出：{1=b, 2=aa,ab}
```

### `Collectors.joining`：拼接文本

它适合把字符序列按分隔符汇总，也可一次指定前缀和后缀。

```java
// 语义：它适合把字符序列按分隔符汇总，也可一次指定前缀和后缀。
import java.util.List;
import java.util.stream.Collectors;
String text = List.of("java", "sql").stream()
        .collect(Collectors.joining(", ", "[", "]"));
        // 关键变化：String text = List.of("java", "sql").stream() .collect(Collectors.joining(", ", "[", "]"));；在流上调用 collect 处理元素，结果写入 text。
        // 关键变化：.collect(Collectors.joining(", ", "[", "]"));；使用指定 Collector 聚合当前元素；返回该 Collector 的结果。
System.out.println(text);
// 输出：[java, sql]
```

### `Collectors.groupingBy`：按分类键分组

它把相同分类键的元素收进列表，适合构造一对多索引。

```java
// 语义：它把相同分类键的元素收进列表，适合构造一对多索引。
import java.util.List;
import java.util.stream.Collectors;
var groups = List.of("a", "bb", "c").stream()
        .collect(Collectors.groupingBy(String::length));
        // 关键变化：.collect(Collectors.groupingBy(String::length));；使用指定 Collector 聚合当前元素；返回该 Collector 的结果。
System.out.println(groups.get(1));
// 输出：[a, c]
System.out.println(groups.get(2));
// 输出：[bb]
```

具体收集器的更多组合可查 [Collectors 收集器速查](./05-Collectors收集器速查)。
## 不常用但需要知道

### 流不可复用：终止操作后必须重新创建

需要多个结果时保留源集合，或者为每次计算重新调用 `stream()`。

```java
import java.util.List;
import java.util.stream.Stream;

Stream<String> stream = List.of("a", "b").stream();
System.out.println(stream.count());
// 输出：2
try {
    stream.count();
    // 关键变化：stream.count();；统计 stream 中的元素数量，返回 long 计数值；源流内容不变。
} catch (IllegalStateException ex) {
    System.out.println(ex.getClass().getSimpleName());
    // 输出：IllegalStateException
}
```

### 有副作用的 `forEach`：不要并发写普通集合

顺序流中这个例子可运行，但切换成并行流后普通 `ArrayList` 不提供安全性；优先使用 `toList` 或 `collect`。

```java
import java.util.ArrayList;
import java.util.List;

List<Integer> target = new ArrayList<>();
List.of(1, 2, 3).stream().forEach(target::add);
// 关键变化：List.of(1, 2, 3).stream().forEach(target::add);；把 上一个链式结果 的每个元素交给 target::add，无返回值；遍历动作完成。
System.out.println(target.size());
// 输出：3
```

### `Collection.parallelStream`：从集合创建并行流

并行不等于更快；小数据、阻塞 I/O、顺序敏感和共享状态场景通常应保持串行，并用基准测试验证收益。

```java
import java.util.List;

long count = List.of(1, 2, 3, 4).parallelStream()
        .filter(number -> number % 2 == 0)
        .count();
        // 关键变化：long count = List.of(1, 2, 3, 4).parallelStream() .filter(number -> number % 2 == 0) .count();；统计 上一个链式结果 的元素数量，计数结果写入 count。
        // 输入：filter(number -> number % 2 == 0)；从 1、2、3、4 中筛选出 2、4。
        // 关键变化：filter 后流中有 2、4，count 返回 2 并写入 count。
        // 关键变化：.count();；统计 上一个链式结果 中的元素数量，返回 long 计数值；源流内容不变。
System.out.println(count);
// 输出：2
```

### `BaseStream.parallel`：将已有流切换为并行模式

`stream.parallel()` 返回并行模式的流管道，它与 `parallelStream()` 的并行成本和无副作用要求相同；不会自动保证更快。

```java
boolean parallel = Stream.of(1, 2, 3).parallel().isParallel();
// 关键变化：boolean parallel = Stream.of(1, 2, 3).parallel().isParallel();；调用 parallel 将流切换为并行状态，再由 isParallel 返回布尔值写入 parallel。
// 结果：true
```

### `unordered`：声明不需要遇到顺序

只有业务确实不关心顺序时才使用，否则可能破坏 `findFirst`、排序或分页语义。

```java
import java.util.List;

long count = List.of("a", "b", "c").parallelStream().unordered().distinct().count();
// 关键变化：long count = List.of("a", "b", "c").parallelStream().unordered().distinct().count();；统计 上一个链式结果 的元素数量，计数结果写入 count。
System.out.println(count);
// 输出：3
```

### `BaseStream.onClose`：注册流关闭处理器

普通集合流不需要手动关闭；读取文件等拥有资源的流才应使用 try-with-resources。

```java
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Stream;

List<String> events = new ArrayList<>();
try (Stream<String> stream = Stream.of("a").onClose(() -> events.add("closed"))) {
// 输入：try (Stream<String> stream = Stream.of("a").onClose(() -> events.add("closed"))) {；资源变量 stream 接收 Stream.of("a").onClose(() -> events.add("closed"))，try 结束时自动关闭。
// 关键变化：try (Stream<String> stream = Stream.of("a").onClose(() -> events.add("closed"))) {；创建资源 stream，构造表达式为 Stream.of("a").onClose(() -> events.add("closed"))；try 结束时关闭该资源。
    System.out.println(stream.count());
    // 输出：1
}
System.out.println(events);
// 输出：[closed]
```

### `BaseStream.close`：关闭拥有外部资源的流

try-with-resources 在代码块结束时调用 `close()`，因此上例注册的处理器向 `events` 追加 `"closed"`；普通集合流本身不持有需关闭资源。

```java
try (Stream<String> lines = Files.lines(Path.of("data.txt"))) {
// 输入：try (Stream<String> lines = Files.lines(Path.of("data.txt"))) {；资源变量 lines 接收 Files.lines(Path.of("data.txt"))，try 结束时自动关闭。
// 关键变化：try (Stream<String> lines = Files.lines(Path.of("data.txt"))) {；创建资源 lines，构造表达式为 Files.lines(Path.of("data.txt"))；try 结束时关闭该资源。
    lines.findFirst();
    // 关键变化：lines.findFirst();；从流中查找元素并返回 Optional 结果；流源内容不变。
}
// 结果：try 代码块结束后 lines 自动关闭。
```
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
                // 关键变化：new Order("alice", List.of("book", "pen"), new BigDecimal("20.00"), true), new Order("bob", List.of("bag"), new BigDecimal("80.00"), false), new Order("alice", List.of("cup"), new BigDecimal("35.00"), true));；创建 Order，构造参数保留在外层调用中。
                // 关键变化：new Order("bob", List.of("bag"), new BigDecimal("80.00"), false), new Order("alice", List.of("cup"), new BigDecimal("35.00"), true));；创建 Order，构造参数保留在外层调用中。
                // 关键变化：new Order("alice", List.of("cup"), new BigDecimal("35.00"), true));；创建 Order，构造参数保留在外层调用中。

        Map<String, BigDecimal> totals = orders.stream()
                .filter(Order::paid)
                .collect(Collectors.groupingBy(Order::user,
                        Collectors.reducing(BigDecimal.ZERO, Order::amount, BigDecimal::add)));
                        // 关键变化：.filter(Order::paid) .collect(Collectors.groupingBy(Order::user, Collectors.reducing(BigDecimal.ZERO, Order::amount, BigDecimal::add)));；按 predicate 筛选元素，只保留满足条件的元素。
                        // 关键变化：.collect(Collectors.groupingBy(Order::user, Collectors.reducing(BigDecimal.ZERO, Order::amount, BigDecimal::add)));；使用指定 Collector 聚合当前元素；返回该 Collector 的结果。
                        // 关键变化：Collectors.reducing(BigDecimal.ZERO, Order::amount, BigDecimal::add)));；调用 reducing，实参为 BigDecimal.ZERO, Order::amount, BigDecimal::add))；返回按给定初值和二元操作聚合的 Collector。
        List<String> itemNames = orders.stream()
                .filter(Order::paid)
                .flatMap(order -> order.items().stream())
                .map(String::toUpperCase)
                .sorted()
                .toList();
                // 关键变化：.filter(Order::paid) .flatMap(order -> order.items().stream()) .map(String::toUpperCase) .sorted() .toList();；把每个元素映射成子流并展开为一个连续流。
                // 关键变化：.flatMap(order -> order.items().stream()) .map(String::toUpperCase) .sorted() .toList();；把每个元素映射成子流并展开为一个连续流。
                // 关键变化：.map(String::toUpperCase) .sorted() .toList();；按指定比较器或自然顺序重新排列元素。
                // 关键变化：.sorted() .toList();；按指定比较器或自然顺序重新排列元素。
                // 关键变化：.toList();；终止当前流管道并把元素收集为 List；返回列表结果。

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
