---
title: Lambda 与函数式接口
date: 2026-09-22
category: Java基础快速入门
tags:
  - Java
  - Lambda
  - 函数式编程
description: 使用 Lambda、方法引用和函数式接口表达可组合的行为。
---

# Lambda 与函数式接口

## 学习目标

- 识别函数式接口并使用 `Predicate`、`Function`、`Consumer`、`Supplier`。
- 掌握 Lambda 参数、返回值、捕获变量和方法引用的语法边界。
- 组合可替换策略，同时识别副作用、线程安全和可读性风险。

## 核心知识点

### 专业术语

- **函数式接口（functional interface）**：只有一个抽象方法的接口，可用 Lambda 或方法引用创建实例。
- **Lambda expression**：把行为作为值传递的匿名函数语法，目标类型由上下文中的函数式接口决定。
- **方法引用（method reference）**：如 `String::trim`，把已有方法映射到函数式接口，比等价 Lambda 更简洁。
- **Predicate/Function/Consumer/Supplier**：分别表示判断、转换、消费和无输入提供值的标准接口。
- **effectively final**：被 Lambda 捕获的局部变量虽未写 `final`，但初始化后没有再次赋值。

### 白话解释与边界

Lambda 不是“自动多线程”，只是把一段行为交给一个有唯一抽象方法的接口。捕获局部变量时，变量必须 final 或 effectively final，因为 Lambda 可能在原方法返回后继续使用；实例字段不受此限制，但会受对象生命周期和并发访问影响。`Predicate.and/or/negate` 与 `Function.compose/andThen` 可以组合逻辑，组合顺序仍会影响结果。

函数式接口让过滤、映射和通知策略可替换，但副作用会让组合难以推理。`Consumer` 改共享列表、写文件或更新计数器时要明确执行顺序和线程安全；逻辑复杂、需要名字或错误处理时，提取成普通方法通常更清楚。

## 常用用法

### `Predicate<T>`：表达真假条件

```java
import java.util.function.Predicate;

Predicate<String> longName = name -> name.length() >= 4;
System.out.println(longName.test("Java"));
// 输出：true
```

`test` 返回布尔值，适合过滤、校验和权限判断；不要在谓词里偷偷修改共享状态。

### `Predicate.and/or/negate`：组合条件

```java
import java.util.function.Predicate;

Predicate<String> notBlank = text -> !text.isBlank();
Predicate<String> javaName = text -> text.startsWith("Java");
Predicate<String> valid = notBlank.and(javaName).or(text -> text.equals("JDK"));
System.out.println(valid.test("Java 20"));
// 输出：true
```

组合顺序会影响短路和可读性；条件复杂时应拆成有名字的谓词。

### `Function<T, R>`：把输入转换为输出

```java
import java.util.function.Function;

Function<String, Integer> length = String::length;
System.out.println(length.apply("Java"));
// 输出：4
```

`Function` 适合 `map`、字段提取和格式转换；转换失败时要明确是返回默认值还是抛出异常。

### `Function.compose/andThen`：串联转换步骤

```java
import java.util.function.Function;

Function<String, String> trim = String::trim;
Function<String, String> upper = String::toUpperCase;
System.out.println(upper.compose(trim).apply(" java "));
// 输出：JAVA
System.out.println(trim.andThen(upper).apply(" java "));
// 输出：JAVA
```

`compose` 先执行参数函数，`andThen` 先执行当前函数；阅读时要确认数据流方向。

### `Consumer<T>`：接收值并执行动作

```java
import java.util.ArrayList;
import java.util.List;
import java.util.function.Consumer;

List<String> log = new ArrayList<>();
Consumer<String> record = log::add;
record.accept("saved");
System.out.println(log);
// 输出：[saved]
```

`Consumer` 没有返回值，常用于日志、通知和写入；并行流中使用它修改普通集合通常不安全。

### `Consumer.andThen`：按顺序组合副作用

```java
import java.util.ArrayList;
import java.util.List;
import java.util.function.Consumer;

List<String> output = new ArrayList<>();
Consumer<String> print = text -> output.add("value=" + text);
Consumer<String> count = text -> output.add("length=" + text.length());
print.andThen(count).accept("Java");
System.out.println(output);
// 输出：[value=Java, length=4]
```

组合的两个动作按顺序执行；前一个动作抛异常时，后一个动作不会执行。

### `Supplier<T>`：延迟提供一个值

```java
import java.util.function.Supplier;

Supplier<String> requestId = () -> "REQ-20";
System.out.println(requestId.get());
// 输出：REQ-20
```

`Supplier` 不接收参数，可用于延迟构造默认值；只有调用 `get()` 才会计算。

### `UnaryOperator<T>`：同类型的一进一出

```java
import java.util.function.UnaryOperator;

UnaryOperator<String> normalize = String::trim;
System.out.println(normalize.apply(" Java "));
// 输出：Java
```

它是 `Function<T, T>` 的语义别名，适合原类型变换，如规范化、递增和复制。

### `BinaryOperator<T>`：两个同类型值合并

```java
import java.util.function.BinaryOperator;

BinaryOperator<Integer> add = Integer::sum;
System.out.println(add.apply(20, 22));
// 输出：42
```

它是 `BiFunction<T, T, T>` 的语义别名，常用于 `reduce`；合并操作最好满足结合律，便于并行处理。

### 方法引用：复用已有方法

```java
import java.util.List;

List<String> names = List.of("Bob", "Ann");
names.stream().map(String::toUpperCase).forEach(System.out::println);
// 输出：BOB
// 输出：ANN
```

方法引用必须放在目标函数式接口的上下文中；有重载或额外分支时，显式 Lambda 往往更清楚。

## 不常用但需要知道

### `BiPredicate`/`BiFunction`/`BiConsumer`：处理两个输入

```java
import java.util.function.BiFunction;
import java.util.function.BiPredicate;

BiPredicate<String, Integer> longEnough = (text, min) -> text.length() >= min;
BiFunction<String, String, String> join = (left, right) -> left + ":" + right;
System.out.println(longEnough.test("Java", 4));
// 输出：true
System.out.println(join.apply("id", "20"));
// 输出：id:20
```

三参数以上通常应使用自定义类型，避免把参数顺序藏在 Lambda 里。

### `Function.identity()`：原样返回元素

```java
import java.util.List;
import java.util.function.Function;
import java.util.stream.Collectors;

List<String> names = List.of("Ann", "Bob");
var same = names.stream().collect(Collectors.toMap(Function.identity(), String::length));
System.out.println(same);
// 输出：{Ann=3, Bob=3}
```

只在收集器需要一个“键就是元素本身”的函数时使用；直接写 `name -> name` 也完全可以。

### 自定义函数式接口：给策略补充领域名字

```java
@FunctionalInterface
interface DiscountRule {
    int priceAfterDiscount(int price);
}

DiscountRule memberRule = price -> price - 10;
System.out.println(memberRule.priceAfterDiscount(80));
// 输出：70
```

自定义接口适合表达领域语义或补充文档，不能为了少写一个方法而滥造通用接口。

### Lambda 捕获变量：`final` 或 effectively final

```java
int limit = 10;
java.util.function.Predicate<Integer> underLimit = value -> value < limit;
System.out.println(underLimit.test(8));
// 输出：true
```

局部变量创建 Lambda 后不能再次赋值；需要变化的状态应显式传参或使用受控的对象。

## 专题导航

- 需要处理可能缺失的返回值，查看 [Optional 常用 API](./04-Optional常用API)。
- 需要批量转换、过滤和聚合，查看 [Stream 流式处理](./02-Stream流式处理) 与 [Stream 分组聚合与扁平化](./06-Stream分组聚合与扁平化)。

## 简单案例

```java
import java.util.List;
import java.util.function.Function;
import java.util.function.Predicate;

record Product(String name, int price, int stock) { }

public class LambdaDemo {
    static List<String> labels(List<Product> products,
                               Predicate<Product> filter,
                               Function<Product, String> mapper) {
        return products.stream().filter(filter).map(mapper).toList();
    }

    public static void main(String[] args) {
        List<Product> products = List.of(
                new Product("book", 30, 4),
                new Product("pen", 8, 0),
                new Product("bag", 80, 2));
        int limit = 50; // effectively final，可被 Lambda 捕获
        Predicate<Product> available = product -> product.stock() > 0;
        Predicate<Product> affordable = product -> product.price() <= limit;
        Function<Product, String> label = Product::name;

        System.out.println(labels(products, available.and(affordable), label));
        // 输出：[book]
    }
}
```

输出为 `[book]`。调用者可以把 `available`、`affordable` 和 `label` 替换成别的策略，而 `labels` 不需要知道筛选规则；`limit` 没有重新赋值，所以属于 effectively final。

## 易混点

- 函数式接口只有一个抽象方法，`default` 与 `static` 方法不计入这个数量；普通接口不能直接接收 Lambda。
- Lambda 捕获局部变量要求 final/effectively final，不能在创建后再给 `limit` 赋值。
- 方法引用只是已有方法的简写，参数适配和重载仍由目标接口上下文决定，复杂分支不应强行压成引用。
- `Predicate` 的组合表达条件，`Consumer` 常带副作用；并行执行副作用可能产生竞态或顺序变化。

## 课后小问

1. 为什么案例中的 `limit` 不能在 Lambda 创建后改成 100？
答案：Lambda 捕获的局部变量必须是 final 或 effectively final，重新赋值会破坏这项编译期保证。
解析：Lambda 可能在当前方法返回后执行，Java 不把局部变量的可变栈槽暴露给闭包；需要变化时应传入可控状态对象并同步管理。

2. `Product::name` 和 `product -> product.name()` 有什么关系？
答案：在目标类型匹配时，方法引用是对已有实例方法调用的更简洁表达，效果等价。
解析：方法引用不能脱离上下文独立确定参数类型；遇到重载或需要额外逻辑时，显式 Lambda 或命名方法更容易读懂。

## 本节小结

- 函数式接口提供唯一抽象方法，Lambda 和方法引用把行为作为值传递。
- Predicate、Function、Consumer、Supplier 分别表达判断、转换、消费和提供。
- 捕获局部变量要求有效 final，实例字段还要考虑生命周期与并发访问。
- 组合能替换策略，但副作用和过度压缩会降低可读性与可测试性。

## 快速回顾

- 能为过滤、转换、消费和提供值选择标准函数式接口。
- 能解释 effectively final 的编译约束。
- 能把两个 Predicate 或 Function 按明确顺序组合。
- 能判断一段 Lambda 是否应提取为命名方法。
