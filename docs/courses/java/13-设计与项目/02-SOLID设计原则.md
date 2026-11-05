---
title: SOLID 设计原则
category: Java基础快速入门
tags: [Java, 设计原则]
description: 通过订单处理例子理解 SOLID 的适用场景和取舍。
---

# SOLID 设计原则

SOLID 是五条帮助识别耦合的设计原则，不是必须为每个类创建接口的规则。先让代码解决实际问题，再针对真实变化点拆分；抽象本身也需要维护。

以下片段可以分别粘贴到 JDK 17 或更高版本的 JShell；每个片段使用独立会话，避免同名类型冲突。

## 五条原则

### 单一职责：按变化原因划分

一个模块应围绕一个清晰职责组织；当订单计算规则和邮件格式由不同原因变化时，可分开它们。

```java
record Order(int cents) {}
class OrderCalculator {
    int total(Order order) { return order.cents(); }
}
class ReceiptFormatter {
    String format(Order order) { return "金额：" + order.cents(); }
}
System.out.println(new ReceiptFormatter().format(new Order(1000)));
// 输出：金额：1000
```

职责不是方法越少越好：始终一起变化的代码放在一起通常更容易理解。

### 开闭原则：扩展变化点

对经常变化的折扣规则增加实现，而不反复修改结算流程。接口方法接受原价（分），返回折后金额。

```java
interface Discount { int apply(int cents); }
class Checkout {
    int total(int cents, Discount discount) { return discount.apply(cents); }
}
System.out.println(new Checkout().total(1000, cents -> cents * 9 / 10));
// 输出：900
```

先确认确实存在多种规则；只有一种且不预计变化时，直接计算更简单。真实金额计算还需要明确舍入规则和溢出边界。

### 里氏替换原则：实现遵守契约

调用方应能使用任意实现而无需猜测其特殊条件。下面契约要求返回非负库存；实现不能悄悄用负数表示“未知”。

```java
interface Stock { int available(); }
class FixedStock implements Stock {
    public int available() { return 3; }
}
Stock stock = new FixedStock();
System.out.println(stock.available() >= 0);
// 输出：true
```

如果数据源无法确定库存，应在契约中明确表达失败，例如抛出约定异常，而不是违反返回值约束。测试各实现的共同契约。

### 接口隔离原则：只暴露调用方需要的能力

查询页面不应为了读取库存而依赖修改库存的方法。拆分后，查询服务只接收 `StockReader`。

```java
interface StockReader { int available(); }
interface StockWriter { void add(int quantity); }
class Inventory implements StockReader, StockWriter {
    private int count;
    public int available() { return count; }
    public void add(int quantity) { count += quantity; }
}
Inventory inventory = new Inventory();
inventory.add(2);
StockReader reader = inventory;
System.out.println(reader.available());
// 输出：2
```

接口划分应服务于不同调用方，避免为每个方法机械地创建接口。示例未处理负数和并发，生产实现需定义这些约束。

### 依赖倒置原则：业务依赖稳定契约

业务流程依赖发送通知的接口，具体实现从外部传入；测试时也可以传入简单替身。

```java
interface Notifier { void send(String message); }
class OrderService {
    private final Notifier notifier;
    OrderService(Notifier notifier) { this.notifier = notifier; }
    void place() { notifier.send("订单已创建"); }
}
new OrderService(System.out::println).place();
```

这里是普通构造器注入，无需 Spring。接口应描述业务需要的能力；是否使用容器管理对象是另一项决定。

## 易混点

单一职责关注变化原因，接口隔离关注调用方需要的能力；依赖倒置则关注业务对具体实现的依赖方向。它们可以同时使用，但并不要求每个类都拆成多个接口。
