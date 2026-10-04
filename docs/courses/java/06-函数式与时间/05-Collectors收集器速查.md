---
title: Collectors 收集器速查
date: 2026-09-27T00:00:00.000Z
category: Java基础快速入门
tags:
  - Java
  - Stream
  - Collectors
description: 用 Collectors 把 Stream 汇总成列表、Map、分组、连接和统计结果。
---

# Collectors 收集器速查

## 学习目标

- 能从 Stream 收集列表、集合、字符串和 Map。
- 能用 `groupingBy`、`partitioningBy` 与下游收集器完成分组和聚合。
- 能处理重复键、空分组、并发收集和结果不可变性等边界。

## 核心知识点

### 专业术语

- **Collector**：描述“如何把流元素累积成结果”的策略，包含供应器、累加器和合并器。
- **下游收集器（downstream collector）**：传给 `groupingBy` 等分组收集器，对每个组继续做 `mapping`、`counting` 或统计。
- **`groupingBy`/`partitioningBy`**：按键分组，或按真假分成两个分区。
- **`toMap`**：把元素映射为键值对，重复键必须通过合并函数处理。

### 白话解释与边界

Stream 负责逐个处理元素，Collector 负责把处理结果装进目标结构。`Collectors.toList()`、`joining()` 和 `groupingBy()` 的差别不只是返回类型，还包括重复键、顺序、可变性和合并成本。看到“一个键对应多个元素”时优先考虑 `groupingBy`；看到“一个键只能对应一个结果”时再选择 `toMap` 并明确冲突策略。

收集器通常在终止操作 `collect` 中执行。下游操作必须与业务语义匹配：`mapping` 先提取字段，`reducing` 自定义归约，`summarizing` 生成统计摘要。并行流使用自定义或非并发收集器时要关注合并开销，不要仅凭 API 名称判断会更快。

## 常用用法

### `toList`：收集为列表

`toList` 保留遇到顺序和重复元素，但不承诺结果列表的具体实现或不可变性。

```java
// 语义：toList 保留遇到顺序和重复元素，但不承诺结果列表的具体实现或不可变性。
// 调用参数：代码依次使用 "java"、"sql"。
import java.util.List;
import java.util.stream.Collectors;

List<String> result = List.of("java", "java", "sql").stream()
        .collect(Collectors.toList());
        // 关键变化：.collect(Collectors.toList());；当前对象；collect；当前对象.collect(Collectors.toList()) 处理当前元素流并得到对应结果。
        // 初始状态：result 当前保存 List.of("java", "java", "sql").stream() .collect(Collectors.toList())的计算结果。

System.out.println(result);
// 输出：[java, java, sql]
```

### `toSet`：收集为去重集合

`toSet` 按相等性去重且不保证迭代顺序，需要稳定顺序时应明确指定集合类型。

```java
// 语义：toSet 按相等性去重且不保证迭代顺序，需要稳定顺序时应明确指定集合类型。
// 调用参数：代码依次使用 "java"、"sql"、", "、true、2。
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

Set<String> result = List.of("java", "java", "sql").stream()
        .collect(Collectors.toSet());
        // 关键变化：.collect(Collectors.toSet());；当前对象；collect；当前对象.collect(Collectors.toSet()) 处理当前元素流并得到对应结果。
        // 初始状态：result 当前保存 List.of("java", "java", "sql").stream() .collect(Collectors.toSet())的计算结果。

System.out.println(result.contains("sql") + ", " + result.size());
// 输出：true, 2
```

### `toUnmodifiableList`：收集不可变列表

需要保留顺序和重复元素并把结果作为只读快照时使用，修改会抛异常。

```java
// 语义：需要保留顺序和重复元素并把结果作为只读快照时使用，修改会抛异常。
// 调用参数：代码依次使用 "java"、"sql"。
import java.util.List;
import java.util.stream.Collectors;

List<String> result = List.of("java", "sql").stream()
        .collect(Collectors.toUnmodifiableList());
        // 关键变化：.collect(Collectors.toUnmodifiableList());；当前对象；collect；当前对象.collect(Collectors.toUnmodifiableList()) 处理当前元素流并得到对应结果。
        // 初始状态：result 当前保存 List.of("java", "sql").stream() .collect(Collectors.toUnmodifiableList())的计算结果。

System.out.println(result);
// 输出：[java, sql]
```

### `toUnmodifiableSet`：收集不可变集合

需要去重并把结果作为只读快照时使用，结果同样不承诺迭代顺序。

```java
// 语义：需要去重并把结果作为只读快照时使用，结果同样不承诺迭代顺序。
// 调用参数：代码依次使用 "java"、"sql"、2。
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

Set<String> result = List.of("java", "java", "sql").stream()
        .collect(Collectors.toUnmodifiableSet());
        // 关键变化：.collect(Collectors.toUnmodifiableSet());；当前对象；collect；当前对象.collect(Collectors.toUnmodifiableSet()) 处理当前元素流并得到对应结果。
        // 初始状态：result 当前保存 List.of("java", "java", "sql").stream() .collect(Collectors.toUnmodifiableSet())的计算结果。

System.out.println(result.size());
// 输出：2
```

### `joining`：连接文本

`joining` 适合日志、标签和 CSV 片段；需要转义、引号或复杂协议时应使用专门序列化器。

```java
import java.util.List;
import java.util.stream.Collectors;

String csv = List.of("Java", "SQL").stream().collect(Collectors.joining(", ", "[", "]"));
// 初始状态：csv 当前为 List.of("Java", "SQL").stream().collect(Collectors.joining(", ", "[", "]"))。
// 作用：joining 适合日志、标签和 CSV 片段。
System.out.println(csv);
// 输出：[Java, SQL]
```

### `groupingBy`：按键分组

默认值类型是 `Map<K, List<T>>`；一个键有多个元素时最自然，顺序与 Map 实现仍需单独确认。

```java
import java.util.List;
import java.util.stream.Collectors;

record User(String name, String team) { }

var users = List.of(new User("Ann", "A"), new User("Bob", "B"), new User("Kai", "A"));
// 初始状态：users 当前为 List.of(new User("Ann", "A"), new User("Bob", "B"), new User("Kai", "A"))。
var byTeam = users.stream().collect(Collectors.groupingBy(User::team));
// 初始状态：byTeam 当前为 users.stream().collect(Collectors.groupingBy(User::team))。
// 作用：默认值类型是 Map<K, List<T>>。
System.out.println(byTeam.get("A").size());
// 输出：2
```

### `counting`：统计元素数量

`counting` 返回 `Long` 计数，作为 `groupingBy` 的下游时可把每组列表直接换成数量。

```java
// 语义：counting 返回 Long 计数，作为 groupingBy 的下游时可把每组列表直接换成数量。
// 调用参数：代码依次使用 "java"、"sql"、"http"、4、2。
import java.util.List;
import java.util.stream.Collectors;

Long count = List.of("java", "sql", "http").stream()
        .filter(word -> word.length() >= 4)
        .collect(Collectors.counting());
        // 关键变化：.collect(Collectors.counting());；当前对象；collect；当前对象.collect(Collectors.counting()) 处理当前元素流并得到对应结果。
// 输入：表达式为 .collect(Collectors.counting())。

System.out.println(count);
// 输出：2
```

### `summingInt`：汇总整数值

`summingInt` 用于通过映射函数提取整数并求和，也可作为 `groupingBy` 的下游收集器。

```java
// 语义：summingInt 用于通过映射函数提取整数并求和，也可作为 groupingBy 的下游收集器。
// 调用参数：代码依次使用 "Ann"、20、"Bob"、8、28。
import java.util.List;
import java.util.stream.Collectors;

record Order(String user, int amount) { }

int total = List.of(new Order("Ann", 20), new Order("Bob", 8)).stream()
        .collect(Collectors.summingInt(Order::amount));
        // 关键变化：.collect(Collectors.summingInt(Order::amount));；当前对象；collect；当前对象.collect(Collectors.summingInt(Order::amount)) 处理当前元素流并得到对应结果。
        // 初始状态：total 当前保存 List.of(new Order("Ann", 20), new Order("Bob", 8)).stream() .collect(Collectors.summingInt(Order::amount))的计算结果。
System.out.println(total);
// 输出：28
```

### `partitioningBy`：按真假分成两组

`partitioningBy` 固定得到真假两个分区；只有一个布尔条件时比 `groupingBy` 更能表达意图。

```java
import java.util.List;
import java.util.stream.Collectors;

List<Integer> numbers = List.of(1, 2, 3, 4);
// 初始状态：numbers 当前为 List.of(1, 2, 3, 4)。
var parts = numbers.stream()
        .collect(Collectors.partitioningBy(number -> number % 2 == 0));
        // 关键变化：.collect(Collectors.partitioningBy(number -> number % 2 == 0));；按收集器 Collectors.partitioningBy(number -> number % 2 == 0) 聚合流元素并返回集合或汇总值。
System.out.println(parts);
// 输出：{false=[1, 3], true=[2, 4]}
```

### `mapping`：分组后只收集某个字段

`mapping` 适合下游先提取字段再连接、去重或继续聚合；它不是顶层 Stream 的 `map` 替代品。

```java
import java.util.List;
import java.util.stream.Collectors;

record User(String name, String team) { }

var users = List.of(new User("Ann", "A"), new User("Kai", "A"), new User("Bob", "B"));
// 初始状态：users 当前为 List.of(new User("Ann", "A"), new User("Kai", "A"), new User("Bob", "B"))。
var names = users.stream().collect(Collectors.groupingBy(
        User::team, Collectors.mapping(User::name, Collectors.joining("/"))));
        // 关键变化：User::team, Collectors.mapping(User::name, Collectors.joining("/"))));；Collectors；mapping；Collectors.mapping(User::name) 返回本次调用的具体结果，后续语句继续使用该值。
System.out.println(names);
// 输出：{A=Ann/Kai, B=Bob}
```

### `toMap`：收集唯一键值对

默认 `toMap` 遇到重复键会抛 `IllegalStateException`；数据不保证唯一时必须提供合并函数。

```java
import java.util.List;
import java.util.function.Function;
import java.util.stream.Collectors;

record User(int id, String name) { }

var users = List.of(new User(1, "Ann"), new User(2, "Bob"));
// 初始状态：users 当前为 List.of(new User(1, "Ann"), new User(2, "Bob"))。
var byId = users.stream().collect(Collectors.toMap(User::id, Function.identity()));
// 初始状态：byId 当前为 users.stream().collect(Collectors.toMap(User::id, Function.identity()))。
// 作用：默认 toMap 遇到重复键会抛 IllegalStateException。
System.out.println(byId.get(2).name());
// 输出：Bob
```

### `toMap` + 合并函数：处理重复键

合并函数应明确“保留、相加还是报错”；需要保留插入顺序时使用 `toMap` 的 Map 工厂重载。

```java
// 语义：合并函数应明确“保留、相加还是报错”。
// 初始状态：scores 初始为 List.of(new Score("java", 80), new Score("java", 95))。
import java.util.List;
// 输入：// 初始状态：scores 初始为 List.of(new Score("java", 80), new Score("java", 95))。 import java.util.List; 使用语句中的具体实参或初始值，当前对象 从这里进入后续操作。
import java.util.stream.Collectors;

record Score(String name, int value) { }

var scores = List.of(new Score("java", 80), new Score("java", 95));
// 关键变化：scores 接收表达式 List.of(new Score("java", 80), new Score("java", 95)) 的计算结果。
// 初始状态：scores 的初始值为 List.of(new Score("java", 80), new Score("java", 95))。
var best = scores.stream().collect(Collectors.toMap(
        Score::name, Score::value, Integer::max));
// 关键变化：var best = scores.stream().collect(Collectors.toMap( Score::name, Score::value, Integer::max)); 将返回值写入 best；best 现在保存该具体结果。
System.out.println(best);
// 输出：{java=95}
```

### `reducing`：按自定义规则归约

`reducing` 适合需要下游归约或自定义初始值的场景；普通数值求和也可直接使用 `mapToInt().sum()`。

```java
import java.util.List;
import java.util.stream.Collectors;

var total = List.of(10, 20, 30).stream().collect(Collectors.reducing(0, Integer::sum));
// 初始状态：total 当前为 List.of(10, 20, 30).stream().collect(Collectors.reducing(0, Integer::sum))。
// 作用：reducing 适合需要下游归约或自定义初始值的场景。
System.out.println(total);
// 输出：60
```

### `summarizingInt`：一次得到数值摘要

`summarizingInt` 同时提供数量、总和、最小、最大和平均值；`summarizingLong`、`summarizingDouble` 对应其他数值类型。

```java
import java.util.List;
import java.util.stream.Collectors;

var summary = List.of(10, 20, 30).stream().collect(Collectors.summarizingInt(Integer::intValue));
// 初始状态：summary 当前为 List.of(10, 20, 30).stream().collect(Collectors.summarizingInt(Integer::intValue))。
// 作用：summarizingInt 同时提供数量、总和、最小、最大和平均值。
System.out.println(summary.getCount() + ", " + summary.getAverage() + ", " + summary.getMax());
// 输出：3, 20.0, 30
```

### `maxBy`：按比较器收集最大元素

`maxBy` 返回 `Optional`，因此空流不会伪造默认元素；比较器必须对应业务极值规则。

```java
// 语义：maxBy 返回 Optional，因此空流不会伪造默认元素。
// 调用参数：代码依次使用 "java"、"stream"、"api"、"none"。
import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

var longest = List.of("java", "stream", "api").stream()
        .collect(Collectors.maxBy(Comparator.comparingInt(String::length)));
        // 关键变化：.collect(Collectors.maxBy(Comparator.comparingInt(String::length)));；当前对象；collect；当前对象.collect(Collectors.maxBy(Comparator.comparingInt(String::length))) 处理当前元素流并得到对应结果。
        // 初始状态：longest 当前保存 List.of("java", "stream", "api").stream() .collect(Collectors.maxBy(Comparator.comparingInt(String::length)))的计算结果。

System.out.println(longest.orElse("none"));
// 输出：stream
```

### `minBy`：按比较器收集最小元素

`minBy` 同样返回 `Optional`，适合直接收集或作为分组后的下游极值计算。

```java
// 语义：minBy 同样返回 Optional，适合直接收集或作为分组后的下游极值计算。
// 调用参数：代码依次使用 "java"、"stream"、"api"、"none"。
import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

var shortest = List.of("java", "stream", "api").stream()
        .collect(Collectors.minBy(Comparator.comparingInt(String::length)));
        // 关键变化：.collect(Collectors.minBy(Comparator.comparingInt(String::length)));；当前对象；collect；当前对象.collect(Collectors.minBy(Comparator.comparingInt(String::length))) 处理当前元素流并得到对应结果。
        // 初始状态：shortest 当前保存 List.of("java", "stream", "api").stream() .collect(Collectors.minBy(Comparator.comparingInt(String::length)))的计算结果。

System.out.println(shortest.orElse("none"));
// 输出：api
```
## 不常用但需要知道

### `collectingAndThen`：收集完成后再转换

它适合把可变中间结果包装成不可变快照；转换函数应保持结果语义清晰。

```java
import java.util.List;
import java.util.stream.Collectors;

var result = List.of("java", "sql").stream().collect(
        Collectors.collectingAndThen(Collectors.toList(), List::copyOf));
        // 关键变化：Collectors.collectingAndThen(Collectors.toList(), List::copyOf));；Collectors；collectingAndThen；Collectors.collectingAndThen(Collectors.toList()) 返回本次调用的具体结果，后续语句继续使用该值。
        // 初始状态：result 当前保存 List.of("java", "sql").stream().collect( Collectors.collectingAndThen(Collectors.toList(), List::copyOf))的计算结果。
System.out.println(result);
// 输出：[java, sql]
```

### `filtering`：在下游分组内过滤（Java 9+）

下游过滤可以保留空组；如果不需要空组，直接在顶层 `filter` 更简单。

```java
import java.util.List;
import java.util.stream.Collectors;

record User(String name, boolean active) { }

var users = List.of(new User("Ann", true), new User("Bob", false));
// 初始状态：users 当前为 List.of(new User("Ann", true), new User("Bob", false))。
var active = users.stream().collect(Collectors.groupingBy(
        User::active, Collectors.filtering(User::active, Collectors.mapping(User::name, Collectors.toList()))));
        // 关键变化：User::active, Collectors.filtering(User::active, Collectors.mapping(User::name, Collectors.toList()))));；Collectors；filtering；Collectors.filtering(User::active) 返回本次调用的具体结果，后续语句继续使用该值。
System.out.println(active);
// 输出：{false=[], true=[Ann]}
```

### `flatMapping`：分组后摊平嵌套值（Java 9+）

`flatMapping` 是下游版本的 `flatMap`；嵌套关系简单时直接先 `flatMap` 再收集更易读。

```java
import java.util.List;
import java.util.stream.Collectors;

record User(String team, List<String> skills) { }

var users = List.of(new User("A", List.of("Java", "SQL")), new User("A", List.of("HTTP")));
// 初始状态：users 当前为 List.of(new User("A", List.of("Java", "SQL")), new User("A", List.of("HTTP")))。
var skills = users.stream().collect(Collectors.groupingBy(
        User::team, Collectors.flatMapping(user -> user.skills().stream(), Collectors.toSet())));
        // 关键变化：User::team, Collectors.flatMapping(user -> user.skills().stream(), Collectors.toSet())));；Collectors；flatMapping；Collectors.flatMapping(user -> user.skills().stream()) 返回本次调用的具体结果，后续语句继续使用该值。
System.out.println(skills);
// 输出：{A=[Java, SQL, HTTP]}
```

### `teeing`：同时计算两个结果再合并（Java 12+）

`teeing` 会同时维护两个下游结果，适合一个遍历需要多个统计值；逻辑过于复杂时拆成清晰的两次计算反而更容易维护。

```java
import java.util.List;
import java.util.stream.Collectors;

var range = List.of(10, 20, 30).stream().collect(Collectors.teeing(
        Collectors.minBy(Integer::compareTo),
        Collectors.maxBy(Integer::compareTo),
        (min, max) -> min.orElse(0) + ".." + max.orElse(0)));
// 关键变化：var range = List.of(10, 20, 30).stream().collect(Collectors.teeing( Collectors.minBy(Integer::compareTo), Collectors.maxBy(Integer::compareTo), (min, max) -> min.orElse(0) + ".." + max.orElse(0)))；List.of(10) 返回转换后的具体值，赋给当前示例中的接收变量。
// 输入：range 的初始值为 List.of(10, 20, 30).stream().collect(Collectors.teeing(。
System.out.println(range);
// 输出：10..30
```

### `toConcurrentMap`：并发收集到 ConcurrentHashMap

只有并行收集和共享并发 Map 的需求才使用；小数据或串行代码使用普通 `toMap` 更简单。

```java
import java.util.List;
import java.util.concurrent.ConcurrentMap;
import java.util.stream.Collectors;

ConcurrentMap<String, Integer> lengths = List.of("java", "sql").parallelStream()
        .collect(Collectors.toConcurrentMap(text -> text, String::length));
        // 关键变化：.collect(Collectors.toConcurrentMap(text -> text, String::length));；当前对象；collect；当前对象.collect(Collectors.toConcurrentMap(text -> text, String::length)) 处理当前元素流并得到对应结果。
        // 初始状态：lengths 当前保存 List.of("java", "sql").parallelStream() .collect(Collectors.toConcurrentMap(text -> text, String::length))的计算结果。
System.out.println(lengths.get("java"));
// 输出：4
```

### `groupingBy` 的 Map 工厂：明确分组顺序

默认 `HashMap` 不承诺键顺序；只有输出协议依赖顺序时才指定 `LinkedHashMap` 或排序 Map。

```java
// 输入：result 按 "b"、"a"、"b" 的首次出现顺序分组，LinkedHashMap::new 使键顺序保持为 b 后 a。
import java.util.List;
// 输入：// 输入：result 按 "b"、"a"、"b" 的首次出现顺序分组，LinkedHashMap::new 使键顺序保持为 b 后 a。 import java.util.List; 使用语句中的具体实参或初始值，当前对象 从这里进入后续操作。
import java.util.LinkedHashMap;
import java.util.stream.Collectors;

var result = List.of("b", "a", "b").stream().collect(Collectors.groupingBy(
        text -> text, LinkedHashMap::new, Collectors.counting()));
// 初始状态：result 的初始值为 List.of("b", "a", "b").stream().collect(Collectors.groupingBy(。
        // 作用：默认 HashMap 不承诺键顺序；只有输出协议依赖顺序时才指定 LinkedHashMap 或排序 Map。
System.out.println(result);
// 输出：{b=2, a=1}
```
## 简单案例

```java
import java.util.List;
import java.util.stream.Collectors;

record Order(String user, String item, int amount) { }

public class CollectorsDemo {
    public static void main(String[] args) {
        var orders = List.of(
                new Order("ann", "book", 20),
                new Order("ann", "pen", 8),
                new Order("bob", "book", 20));
        var totals = orders.stream().collect(Collectors.groupingBy(
                Order::user, Collectors.summingInt(Order::amount)));
        var items = orders.stream().collect(Collectors.groupingBy(
                Order::user, Collectors.mapping(Order::item, Collectors.joining(","))));
        System.out.println(totals);
        // 输出：{ann=28, bob=20}
        System.out.println(items);
        // 输出：{ann=book,pen, bob=book}
    }
}
```

## 易混点

- `toMap` 处理一键一值，重复键必须显式合并；`groupingBy` 适合一键多值或下游聚合。
- `mapping` 是下游字段转换，顶层 `map` 是 Stream 中间操作；两者位置和结果类型不同。
- `toSet` 和 `groupingBy` 的顺序不应凭运行结果猜测，必须选择明确的集合或 Map 实现。
- `toUnmodifiableList` 与 `Stream.toList()` 都适合只读结果，但 `Collectors.toList()` 不承诺不可变性。

## 课后小问

1. 为什么 `toMap` 遇到重复键会抛异常？
   - 答案：默认收集器不知道重复键应该覆盖、相加还是报错，因此要求调用方提供合并策略。
   - 解析：使用三参数 `toMap` 传入 `BinaryOperator`，或者改用 `groupingBy` 保存一个键对应的多个元素。

2. 什么时候使用 `partitioningBy` 而不是 `groupingBy`？
   - 答案：分组条件只有真假两类，并且希望结果明确包含两个分区时。
   - 解析：`partitioningBy` 表达二分语义，空分区也会保留；多类别或复杂键则使用 `groupingBy`。

## 本节小结

- Collector 把 Stream 的元素累积成列表、集合、文本、Map 或统计结果。
- `groupingBy`、`partitioningBy`、`mapping` 和 `toMap` 组合后可以表达大多数分组需求。
- `reducing`、`counting` 和 `summarizing` 分别处理自定义归约、计数和数值摘要。
- 重复键、顺序、可变性和并行合并成本必须在选择收集器时明确。

## 快速回顾

- 能解释 `toMap` 与 `groupingBy` 的键冲突差异。
- 能用下游 `mapping`、`counting` 或 `summarizingInt` 完成分组聚合。
- 能选择 `joining`、`partitioningBy` 和 `collectingAndThen`。
- 能指出默认 Map 顺序和结果可变性不能凭经验假设。
