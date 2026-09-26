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
