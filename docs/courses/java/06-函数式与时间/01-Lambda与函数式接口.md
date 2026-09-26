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
