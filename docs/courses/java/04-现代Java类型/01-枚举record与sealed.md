---
title: 枚举、record 与 sealed 总览
date: 2026-09-27T00:00:00.000Z
category: Java基础快速入门
tags:
  - Java
  - record
  - sealed
  - 枚举
description: 快速区分 enum、record、sealed 和 record patterns，并跳转到对应的细粒度案例。
---

# 枚举、record 与 sealed 总览

## 学习目标

- 知道 enum、record、sealed 分别解决固定取值、数据承载和受限继承问题。
- 能根据领域模型选择对应类型，而不是把所有状态都塞进普通 class。
- 知道 JDK 20 的 record patterns 与模式 switch 仍是预览特性。

## 核心知识点

### 专业术语

- **enum**：由编译器管理固定实例集合的枚举类型。
- **record**：用组件声明数据并自动提供值语义成员的数据载体。
- **sealed**：限制直接子类型集合的接口或类。
- **record pattern**：把 record 组件直接绑定到模式变量的预览语法。

### 白话解释与边界

enum 表达“只能从这几个值中选一个”，record 表达“这些字段共同构成一个值”，sealed 表达“继承树只允许这些分支”。它们可以组合，但不是替代关系：enum 不适合承载任意业务对象，record 不负责实体生命周期，sealed 也不等于运行时权限控制。

细节案例按用途拆在以下页面：

- [record 数据载体](./03-record数据载体)：组件、构造器、浅不可变、泛型 record、record patterns。
- [sealed 受限继承](./04-sealed受限继承)：permits、final、sealed、non-sealed 和继承边界。

## 常用用法

### 用 enum 表达固定状态

需要表达订单状态或权限级别等固定集合时使用 enum，并应使用稳定业务字段而不是 `ordinal` 进行持久化。

```java
// 语义：需要表达订单状态或权限级别等固定集合时使用 enum，并应使用稳定业务字段而不是 ordinal 进行持久化。
// 初始状态：status 初始为 OrderStatus.PAID。
enum OrderStatus {
    CREATED, PAID, CANCELLED
}

public class EnumOverviewDemo {
    public static void main(String[] args) {
        OrderStatus status = OrderStatus.PAID;
        // 关键变化：OrderStatus status = OrderStatus.PAID; 将返回值写入 status；status 现在保存该具体结果。
        System.out.println(status.name() + ", " + status.ordinal());
        // 输出：PAID, 1
    }
}
```

### 用 record 表达小型值对象

需要校验、规范化或保护可变组件时，跳转到 record 数据载体页面查看完整写法。

```java
// 语义：需要校验、规范化或保护可变组件时，跳转到 record 数据载体页面查看完整写法。
// 调用参数：代码依次使用 "CNY"、1999。
record Money(String currency, long cents) {}
// 关键变化：// 语义：需要校验、规范化或保护可变组件时，跳转到 record 数据载体页面查看完整写法。 // 调用参数：代码依次使用 "CNY"、1999。 record Money(String currency, long cents) {}；当前对象.该操作(String currency) 返回本次调用的具体结果，后续语句继续使用该值。


public class RecordOverviewDemo {
    public static void main(String[] args) {
        System.out.println(new Money("CNY", 1999).currency());
// 输出：CNY；System.out.println 的实参为 new Money("CNY", 1999).currency()。
    }
// 输入：// 输出：CNY；System.out.println 的实参为 new Money("CNY", 1999).currency()。 } 使用语句中的具体实参或初始值，当前对象 从这里进入后续操作。
}
```

### 用 sealed 描述有限结果集合

sealed 让新增结果分支变成显式的类型变更，适合编译器帮助检查有限状态模型。

```java
// 语义：sealed 让新增结果分支变成显式的类型变更，适合编译器帮助检查有限状态模型。
// 初始状态：result 初始为 new LoginSuccess("u-1")。
sealed interface LoginResult permits LoginSuccess, LoginFailure {}
// 输入：// 初始状态：result 初始为 new LoginSuccess("u-1")。 sealed interface LoginResult permits LoginSuccess, LoginFailure {} 使用语句中的具体实参或初始值，当前对象 从这里进入后续操作。
record LoginSuccess(String userId) implements LoginResult {}
record LoginFailure(String reason) implements LoginResult {}

public class SealedOverviewDemo {
    public static void main(String[] args) {
        LoginResult result = new LoginSuccess("u-1");
// 关键变化：result 接收表达式 new LoginSuccess("u-1") 的计算结果。
// 初始状态：result 的初始值为 new LoginSuccess("u-1")。
        System.out.println(result instanceof LoginSuccess);
        // 输出：true
    }
}
```

### 使用 record pattern 拆出 record 组件（JDK 20 预览）

需要在 JDK 20 中直接拆出 record 组件时可使用预览版 record pattern，并为编译与运行同时启用预览特性。

```java
// 语义：需要在 JDK 20 中直接拆出 record 组件时可使用预览版 record pattern，并为编译与运行同时启用预览特性。
// 调用参数：代码依次使用 ":"、"unknown"、"Alice"、20。
record User(String name, int age) {}

public class PatternOverviewDemo {
    static String label(Object value) {
    // 关键变化：static String label(Object value) {；当前对象；该操作；当前对象.该操作(Object value) 返回本次调用的具体结果，后续语句继续使用该值。
    // 输入：static String label(Object value) { 使用语句中的具体实参或初始值，当前对象 从这里进入后续操作。
        if (value instanceof User(String name, int age)) {
        // 关键变化：if (value instanceof User(String name, int age)) {；当前对象；if；当前对象.if(value instanceof User(String name, int age)) 返回本次调用的具体结果，后续语句继续使用该值。
            return name + ":" + age;
        }
        return "unknown";
    }

    public static void main(String[] args) {
        System.out.println(label(new User("Alice", 20)));
// 输出：Alice:20；System.out.println 的实参为 label(new User("Alice", 20))。
    }
}
```

```powershell
javac --release 20 --enable-preview PatternOverviewDemo.java
java --enable-preview PatternOverviewDemo
```

## 不常用但需要知道

### 用 enum 实现字段和方法

枚举可以有字段、构造器和方法，但实例构造器不能由调用方直接调用；需要外部配置或动态扩展时不要硬编码为 enum。

```java
enum Level {
    LOW(1), HIGH(2);
    // 关键变化：LOW(1), HIGH(2);；当前对象；LOW；当前对象.LOW(1) 返回本次调用的具体结果，后续语句继续使用该值。
    // 输入：LOW(1), HIGH(2); 使用语句中的具体实参或初始值，当前对象 从这里进入后续操作。

    private final int code;

    Level(int code) {
    // 关键变化：Level(int code) {；当前对象；Level；当前对象.Level(int code) 返回本次调用的具体结果，后续语句继续使用该值。
        this.code = code;
        // 关键变化：this.code = code;；当前对象.该操作() 完成本例中的具体调用，后续语句观察调用后的状态。
    }

    int code() {
    // 关键变化：int code() {；当前对象.该操作() 完成本例中的具体调用，后续语句观察调用后的状态。
        return code;
    }
}

public class EnumFieldDemo {
    public static void main(String[] args) {
        System.out.println(Level.HIGH.code());
        // 输出：2
    }
}
```

### 用 sealed 的 non-sealed 分支保留扩展点

non-sealed 会从该分支恢复开放继承；具体层次边界和模块规则见 sealed 受限继承页面。

```java
sealed interface Event permits BuiltInEvent, ExtensionEvent {}
// 关键变化：sealed interface Event permits BuiltInEvent, ExtensionEvent {}；当前对象.该操作() 完成本例中的具体调用，后续语句观察调用后的状态。
record BuiltInEvent() implements Event {}
non-sealed class ExtensionEvent implements Event {}
class VendorEvent extends ExtensionEvent {}

public class SealedExtensionOverviewDemo {
    public static void main(String[] args) {
        System.out.println(new VendorEvent() instanceof Event);
// 输出：true；System.out.println 的实参为 new VendorEvent() instanceof Event。
    }
// 输入：// 输出：true；System.out.println 的实参为 new VendorEvent() instanceof Event。 } 使用语句中的具体实参或初始值，当前对象 从这里进入后续操作。
}
```
## 简单案例

```java
enum Status { NEW, DONE }
record Task(String id, Status status) {}

public class ModernTypesOverviewDemo {
    public static void main(String[] args) {
        System.out.println(new Task("t-1", Status.DONE));
        // 输出：Task[id=t-1, status=DONE]
    }
}
```

这个最小案例把 enum 的固定状态和 record 的数据载体放在一起；需要受限继承时再组合 sealed。

## 易混点

- enum 的 ordinal 不是稳定业务编号；需要持久化时定义明确 code，因为序号会随声明顺序变化。
- record 的 final 组件只保护引用，不会自动深冻结 List、Map 或可变元素。
- sealed 限制直接子类型，non-sealed 后代仍可继续扩展。
- record patterns 与模式 switch 在 JDK 20 需要编译和运行两侧的 preview 开关。

## 课后小问

1. 为什么 enum、record、sealed 不能互相替代？
答案：它们分别约束值集合、数据结构和继承范围，解决的问题不同。
解析：例如订单状态适合 enum，订单快照适合 record，有限支付结果适合 sealed；组合使用比强行选择一种更清楚。

2. 什么时候应该跳转到细粒度页面而不是继续看本页？
答案：需要具体 API、构造器校验、浅不可变或 permits 规则时，应直接打开对应细粒度页面。
解析：本页负责建立选择地图，细节页按每个用法提供可复制 Java 案例，适合作为速查入口。

## 本节小结

- enum 表达固定实例集合，record 表达值对象，sealed 表达受限继承。
- record 和 sealed 常组合表达有限的领域结果，enum 可以承载固定状态。
- JDK 20 record patterns 属于预览语法，命令必须配套。
- 复杂用法分别见 record 数据载体和 sealed 受限继承页面。

## 快速回顾

- 能说出 enum、record、sealed 的核心职责。
- 能判断状态、值对象和有限层次分别该用什么类型。
- 能解释 record 的浅不可变边界。
- 能写出 JDK 20 preview 的编译与运行命令。
