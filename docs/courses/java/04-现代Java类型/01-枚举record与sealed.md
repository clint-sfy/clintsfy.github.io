---
title: 枚举、record 与 sealed 类型
date: 2026-09-22
category: Java基础快速入门
tags:
  - Java
  - record
  - sealed
  - 枚举
description: 学习现代 Java 的数据载体、受限继承和 record patterns 基础。
---

# 枚举、record 与 sealed 类型

## 学习目标

- 用 `record` 表达数据载体，并理解其浅不可变边界与构造器校验。
- 用 `sealed`、`permits`、`final` 和 `non-sealed` 描述受限继承层次。
- 了解 JDK 20 预览中的 record patterns 与模式 `switch`，按成对命令运行案例。

## 核心知识点

### 专业术语

- **record**：以组件声明数据的特殊类，自动生成 `private final` 组件字段、访问器、规范构造器、`equals`、`hashCode` 和 `toString`。
- **紧凑构造器（compact constructor）**：record 中省略参数列表的构造器，可在字段赋值前校验和规范化组件。
- **浅不可变（shallow immutability）**：record 自身组件引用不能重新赋值，但引用指向的 `List` 或 `Map` 仍可能可变。
- **sealed type**：通过 `permits` 限制直接子类型的接口或类；直接子类必须声明 `final`、`sealed` 或 `non-sealed`。
- **record pattern**：把 record 组件直接绑定到模式变量的语法；JDK 20 中仍是预览特性。

### 白话解释与边界

record 适合“数据是什么”比“生命周期怎么变”更重要的值载体，不是自动深复制或自动校验的魔法。组件引用在构造后不能换，但可变集合内容仍可改；`List.copyOf` 将元素引用复制到新的不可修改列表容器，属于浅拷贝，不会深度冻结其中的可变元素。要得到深不可变结果，需要使用不可变元素类型或逐元素复制。`sealed` 把可扩展范围写进类型定义，使编译器知道已知子类型，适合表达有限的领域结果，但开放扩展的插件模型不应强行封闭。

record patterns 和模式 `switch` 在 JDK 20 是非稳定预览能力，必须同时给 `javac --release 20 --enable-preview` 与 `java --enable-preview`。它们与普通 `switch` 表达式不同，不能因为代码看起来简洁就省略预览开关。

## 简单案例

```java
import java.math.BigDecimal;

enum PaymentKind { CARD, BALANCE }

sealed interface PaymentResult permits Success, RetryableFailure, Rejected { }

record Success(String id, BigDecimal amount) implements PaymentResult {
    public Success {
        if (id == null || id.isBlank() || amount == null || amount.signum() <= 0) {
            throw new IllegalArgumentException("invalid success");
        }
    }
}

record RetryableFailure(String reason) implements PaymentResult { }
record Rejected(String code) implements PaymentResult { }

public class ModernTypesDemo {
    static String message(PaymentResult result) {
        return switch (result) {
            case Success(var id, var amount) -> "success:" + id + ":" + amount;
            case RetryableFailure(var reason) -> "retry:" + reason;
            case Rejected(var code) -> "rejected:" + code;
        };
    }

    public static void main(String[] args) {
        PaymentResult result = new Success("P-1", new BigDecimal("12.50"));
        System.out.println(message(result));
        // 输出：success:P-1:12.50
        System.out.println(PaymentKind.CARD);
        // 输出：CARD
    }
}
```

在 JDK 20 下，保存为 `ModernTypesDemo.java` 后使用以下成对命令：

```powershell
javac --release 20 --enable-preview ModernTypesDemo.java
java --enable-preview ModernTypesDemo
```

输出为 `success:P-1:12.50` 和 `CARD`。`switch` 能覆盖 sealed 层次的三个结果；新增允许的子类型时，编译器会提醒所有穷尽分支需要重新检查。

## 易混点

- record 的 `final` 组件只阻止重新指向，不能让组件引用的可变集合自动深不可变。
- sealed 限制直接子类型，`non-sealed` 子类又重新开放扩展；它不是“所有后代都不可扩展”。
- record patterns 是 JDK 20 预览语法，必须配套 `--release 20 --enable-preview` 编译和 `--enable-preview` 运行。
- `enum` 的固定实例、record 的数据载体和 sealed 的继承约束解决不同问题，不能互相替代。

## 课后小问

1. 为什么 `record Order(List<String> items)` 仍可能被外部修改？
答案：record 只保证 `items` 引用组件不能重新赋值，引用指向的列表内容仍可能可变。
解析：构造器可以保存 `List.copyOf(items)` 来阻止调用者修改列表结构；这仍是浅拷贝，元素自身若可变，还需要不可变元素或逐元素复制才能保护集合内容。

2. 运行 record pattern 案例为什么需要两个 `--enable-preview` 位置？
答案：编译阶段需要让 `javac` 接受 JDK 20 预览语法，运行阶段需要让 JVM 接受对应预览字节码。
解析：只在一侧加开关会导致编译失败或运行时拒绝；`--release 20` 还应与所学习的基准版本保持一致。

## 本节小结

- record 自动生成值语义成员，适合数据载体，但只提供浅不可变保证。
- 紧凑构造器可建立组件校验和规范化不变式，嵌套可变对象仍需显式复制。
- sealed/permits 把可扩展类型集合写进契约，子类型必须声明后续继承策略。
- JDK 20 的 record patterns 和模式 switch 是预览特性，编译与运行命令必须成对。

## 快速回顾

- 能列出 record 自动生成的主要成员。
- 能判断 record 组件的不可变边界是否只停留在引用层。
- 能解释 sealed、permits、final 和 non-sealed 的关系。
- 能写出 JDK 20 preview 的编译与运行命令。
