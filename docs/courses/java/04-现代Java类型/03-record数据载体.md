---
title: record 数据载体
date: 2026-09-27T00:00:00.000Z
category: Java基础快速入门
tags:
  - Java
  - record
  - 数据载体
description: 用 record 快速声明值对象，掌握构造器校验、访问器、浅不可变和 record patterns。
---

# record 数据载体

## 学习目标

- 用 record 声明字段固定、主要用于承载数据的值对象。
- 会写规范构造器和紧凑构造器，建立输入校验与规范化规则。
- 分清 record 自动生成的成员、浅不可变边界和 JDK 20 的 record patterns。

## 核心知识点

### 专业术语

- **record component**：record User(String name, int age) 括号中的组件声明。
- **规范构造器（canonical constructor）**：参数列表与组件完全对应的构造器。
- **紧凑构造器（compact constructor）**：省略参数列表的规范构造器写法，可以在隐式字段赋值前校验参数。
- **浅不可变**：组件引用不能重新赋值，但引用指向的可变对象仍可能变化。
- **record pattern**：把 record 的组件直接绑定到模式变量的模式语法；JDK 20 中属于预览特性。

### 白话解释与边界

record 解决“这几个字段共同表示一个值”的问题，自动生成访问器、equals、hashCode 和 toString，并不替你完成深复制、数据库映射或业务生命周期管理。组件字段是 private final，但 record Order(List&lt;String&gt; items) 仍可能因为列表本身可变而被外部修改。需要隔离集合结构时，在构造器中使用 List.copyOf；需要深不可变时，还要让元素本身不可变或逐个复制。

record 不能继承普通类，只能隐式继承 java.lang.Record，但可以实现接口。record 的访问器名称是组件名（user.name()），不是 JavaBean 风格的 getName()。

## 常用用法

### 声明最小 record：自动获得值语义成员

需要声明小型值对象时使用 record 组件，编译器会生成同名访问器、规范构造器以及 `equals`、`hashCode` 和 `toString`。

```java
// 语义：需要声明小型值对象时使用 record 组件，编译器会生成同名访问器、规范构造器以及 equals、hashCode 和 toString。
// 初始状态：left 初始为 new Point(3, 4)；right 初始为 new Point(3, 4)。
record Point(int x, int y) {}
// 输入：// 初始状态：left 初始为 new Point(3, 4)；right 初始为 new Point(3, 4)。 record Point(int x, int y) {} 使用语句中的具体实参或初始值，当前对象 从这里进入后续操作。

public class RecordBasicDemo {
    public static void main(String[] args) {
        Point left = new Point(3, 4);
        // 关键变化：Point left = new Point(3, 4)；left 接收 该操作(3) 的返回值，当前值变为这次调用得到的具体结果。
// 初始状态：left 的初始值为 new Point(3, 4)。
        Point right = new Point(3, 4);
        // 关键变化：Point right = new Point(3, 4)；right 接收 该操作(3) 的返回值，当前值变为这次调用得到的具体结果。
        System.out.println(left.x() + ", " + left.y());
        // 输出：3, 4
        System.out.println(left.equals(right) + ", " + left);
        // 输出：true, Point[x=3, y=4]
    }
}
```

### 使用紧凑构造器校验和规范化参数

紧凑构造器的参数名就是组件名，可以在隐式赋值前校验和规范化；不要在其中再次给字段赋值，record 组件字段由编译器完成赋值。

```java
// 语义：紧凑构造器的参数名就是组件名，可以在隐式赋值前校验和规范化。
// 初始状态：name 初始为 new UserName(" Alice ")。
record UserName(String value) {
    public UserName {
        if (value == null || value.isBlank()) {
            throw new IllegalArgumentException("name must not be blank");
// 异常：throw new IllegalArgumentException("name must not be blank") 立即进入异常路径。
// 初始状态：表达式为 throw new IllegalArgumentException("name must not be blank")。
        }
        value = value.trim();
    }
}

public class RecordCompactConstructorDemo {
    public static void main(String[] args) {
        UserName name = new UserName("  Alice  ");
        System.out.println(name.value());
        // 输出：Alice
    }
}
```

### 写显式规范构造器：需要清晰控制赋值时使用

显式规范构造器的参数必须与组件一一对应，并且要明确给每个组件赋值；大多数校验场景用紧凑构造器更简洁。

```java
// 语义：显式规范构造器的参数必须与组件一一对应，并且要明确给每个组件赋值。
// 调用参数：代码依次使用 1、65535、"port out of range"、8080。
record Port(int value) {
    public Port(int value) {
        if (value < 1 || value > 65535) {
            throw new IllegalArgumentException("port out of range");
// 异常：throw new IllegalArgumentException("port out of range") 立即进入异常路径。
// 初始状态：表达式为 throw new IllegalArgumentException("port out of range")。
        }
        this.value = value;
    }
}

public class RecordCanonicalConstructorDemo {
    public static void main(String[] args) {
        System.out.println(new Port(8080).value());
        // 输出：8080
    }
}
```

### 用组件访问器读取数据

访问器名就是组件名；如果框架要求 getName()，可以额外定义方法，但不要误以为 record 自动生成 JavaBean getter。

```java
// 语义：访问器名就是组件名。
// 初始状态：user 初始为 new User("Alice", 20)。
record User(String name, int age) {}

public class RecordAccessorDemo {
    public static void main(String[] args) {
        User user = new User("Alice", 20);
// 关键变化：user 接收表达式 new User("Alice", 20) 的计算结果。
// 初始状态：user 的初始值为 new User("Alice", 20)。
        System.out.println(user.name() + ", " + user.age());
        // 输出：Alice, 20
    }
}
```

### 用 List.copyOf 隔离可变集合组件

需要隔离 record 的可变列表组件时使用 `List.copyOf`，它会复制列表结构并拒绝 `null`，但不会复制可变元素本身。

```java
// 语义：需要隔离 record 的可变列表组件时使用 List.copyOf，它会复制列表结构并拒绝 null，但不会复制可变元素本身。
// 初始状态：source 初始为 new ArrayList<>(List.of("book"))；order 初始为 new Order(source)。
import java.util.ArrayList;
// 输入：// 初始状态：source 初始为 new ArrayList<>(List.of("book"))；order 初始为 new Order(source)。 import java.util.ArrayList; 使用语句中的具体实参或初始值，当前对象 从这里进入后续操作。
import java.util.List;

record Order(List<String> items) {
    public Order {
        items = List.copyOf(items);
        // 关键变化：items = List.copyOf(items); 将返回值写入 items；items 现在保存该具体结果。
    }
}

public class RecordShallowImmutableDemo {
    public static void main(String[] args) {
        List<String> source = new ArrayList<>(List.of("book"));
// 关键变化：source 接收表达式 new ArrayList<>(List.of("book")) 的计算结果。
// 初始状态：source 的初始值为 new ArrayList<>(List.of("book"))。
        Order order = new Order(source);
        // 关键变化：Order order = new Order(source); 将返回值写入 order；order 现在保存该具体结果。
        source.add("pen");
        // 关键变化：source.add("pen")；source 追加具体参数 "pen"，容器内容随之增长。
        System.out.println(order.items());
        // 输出：[book]
    }
}
```

### 让 record 实现接口：统一值对象能力

record 可以实现一个或多个接口，适合让不同数据载体遵守同一读取契约；它不能通过 extends SomeClass 继承普通类。

```java
// 语义：record 可以实现一个或多个接口，适合让不同数据载体遵守同一读取契约。
// 调用参数：代码依次使用 "p-1"、"Book"、-1。
interface Identified {
    String id();
    // 关键变化：String id();；当前对象.该操作() 完成本例中的具体调用，后续语句观察调用后的状态。
    // 输入：String id(); 使用语句中的具体实参或初始值，当前对象 从这里进入后续操作。
}

record Product(String id, String name) implements Identified {}

public class RecordInterfaceDemo {
    static String show(Identified value) {
    // 关键变化：static String show(Identified value) {；当前对象；该操作；当前对象.该操作(Identified value) 返回本次调用的具体结果，后续语句继续使用该值。
        return value.id();
        // 关键变化：return value.id()；value.id() 完成本例中的具体调用，后续语句观察调用后的状态。
    }

    public static void main(String[] args) {
        System.out.println(show(new Product("p-1", "Book")));
// 输出：p-1；System.out.println 的实参为 show(new Product("p-1", "Book"))。
    }
}
```

### 使用 record pattern 直接拆出组件（JDK 20 预览）

需要在 JDK 20 中合并类型判断、转换和组件读取时可使用预览版 record pattern，并为编译与运行配套启用预览特性。

```java
// 语义：需要在 JDK 20 中合并类型判断、转换和组件读取时可使用预览版 record pattern，并为编译与运行配套启用预览特性。
// 调用参数：代码依次使用 "x="、", y="、"unknown"、2、5。
record Point(int x, int y) {}

public class RecordPatternDemo {
    static String locate(Object value) {
    // 关键变化：static String locate(Object value) {；当前对象；该操作；当前对象.该操作(Object value) 返回本次调用的具体结果，后续语句继续使用该值。
    // 输入：static String locate(Object value) { 使用语句中的具体实参或初始值，当前对象 从这里进入后续操作。
        if (value instanceof Point(int x, int y)) {
        // 关键变化：if (value instanceof Point(int x, int y)) {；当前对象；if；当前对象.if(value instanceof Point(int x, int y)) 返回本次调用的具体结果，后续语句继续使用该值。
            return "x=" + x + ", y=" + y;
            // 关键变化：return "x=" + x + ", y=" + y;；当前对象.该操作() 完成本例中的具体调用，后续语句观察调用后的状态。
        }
        return "unknown";
    }

    public static void main(String[] args) {
        System.out.println(locate(new Point(2, 5)));
// 输出：x=2, y=5；System.out.println 的实参为 locate(new Point(2, 5))。
    }
}
```

```powershell
javac --release 20 --enable-preview RecordPatternDemo.java
java --enable-preview RecordPatternDemo
```

### 使用嵌套 record pattern 读取嵌套数据

嵌套模式适合小型、结构稳定的数据树；当校验逻辑复杂或需要多处复用时，先显式转换为局部变量通常更容易调试。

```java
// 语义：javac --release 20 --enable-preview RecordPatternDemo.java java --enable-preview RecordPatternDemo。
// 调用参数：代码依次使用 "@"、"unknown"、"Alice"、"Shanghai"。
record Address(String city) {}
record User(String name, Address address) {}

public class NestedRecordPatternDemo {
    static String cityOf(Object value) {
    // 关键变化：static String cityOf(Object value) {；当前对象；该操作；当前对象.该操作(Object value) 返回本次调用的具体结果，后续语句继续使用该值。
    // 输入：static String cityOf(Object value) { 使用语句中的具体实参或初始值，当前对象 从这里进入后续操作。
        if (value instanceof User(String name, Address(String city))) {
        // 关键变化：if (value instanceof User(String name, Address(String city))) {；当前对象；if；当前对象.if(value instanceof User(String name, Address(String city))) 返回本次调用的具体结果，后续语句继续使用该值。
            return name + "@" + city;
        }
        return "unknown";
    }

    public static void main(String[] args) {
        System.out.println(cityOf(new User("Alice", new Address("Shanghai"))));
// 输出：Alice@Shanghai；System.out.println 的实参为 cityOf(new User("Alice", new Address("Shanghai")))。
    }
}
```
## 不常用但需要知道

### 声明泛型 record：组件也可以使用类型参数

泛型 record 遵守普通泛型不变性；它适合作为通用返回值，但类型参数的约束仍需要写在声明或方法边界上。

```java
record Pair<L, R>(L left, R right) {}

public class GenericRecordDemo {
    public static void main(String[] args) {
        Pair<String, Integer> pair = new Pair<>("age", 20);
        // 关键变化：Pair<String, Integer> pair = new Pair<>("age", 20)；pair 接收 该操作("age") 的返回值，当前值变为这次调用得到的具体结果。
// 初始状态：pair 的初始值为 new Pair<>("age", 20)。
        System.out.println(pair.left() + "=" + pair.right());
        // 输出：age=20
    }
}
```

### 在 record 中声明静态成员和业务方法

record 不是只能放字段的哑数据结构，可以声明静态工厂和派生方法；但状态仍应由组件表达，避免把 record 当作可变实体类使用。

```java
record Celsius(double value) {
    static Celsius ofFahrenheit(double fahrenheit) {
    // 关键变化：static Celsius ofFahrenheit(double fahrenheit) {；当前对象；该操作；当前对象.该操作(double fahrenheit) 返回本次调用的具体结果，后续语句继续使用该值。
    // 输入：static Celsius ofFahrenheit(double fahrenheit) { 使用语句中的具体实参或初始值，当前对象 从这里进入后续操作。
        return new Celsius((fahrenheit - 32) * 5 / 9);
        // 关键变化：return new Celsius((fahrenheit - 32) * 5 / 9);；当前对象；该操作；当前对象.该操作((fahrenheit - 32) * 5 / 9) 返回本次调用的具体结果，后续语句继续使用该值。
// 初始状态：表达式为 return new Celsius((fahrenheit - 32) * 5 / 9)。
    }

    double rounded() {
    // 关键变化：double rounded() {；当前对象.该操作() 完成本例中的具体调用，后续语句观察调用后的状态。
        return Math.round(value * 10) / 10.0;
        // 关键变化：return Math.round(value * 10) / 10.0;；Math；round；Math.round(value * 10) 返回本次调用的具体结果，后续语句继续使用该值。
    }
}

public class RecordMethodDemo {
    public static void main(String[] args) {
        System.out.println(Celsius.ofFahrenheit(212).rounded());
        // 输出：100.0
    }
}
```

### 自定义 equals/hashCode：改变值语义前要谨慎

可以覆盖自动生成的方法，但必须同时保持 equals 与 hashCode 契约；除非领域确实需要，否则优先使用默认的组件值比较。

```java
record CaseInsensitiveName(String value) {
    @Override
    public boolean equals(Object other) {
    // 关键变化：public boolean equals(Object other) {；当前对象；该操作；当前对象.该操作(Object other) 返回本次调用的具体结果，后续语句继续使用该值。
    // 输入：public boolean equals(Object other) { 使用语句中的具体实参或初始值，当前对象 从这里进入后续操作。
        return other instanceof CaseInsensitiveName that
            && value.equalsIgnoreCase(that.value);
    }

    @Override
    public int hashCode() {
    // 关键变化：public int hashCode() {；当前对象.hashCode() 完成本例中的具体调用，后续语句观察调用后的状态。
// 输入：表达式为 public int hashCode() {。
        return value.toLowerCase(java.util.Locale.ROOT).hashCode();
        // 关键变化：return value.toLowerCase(java.util.Locale.ROOT).hashCode();；value；toLowerCase；value.toLowerCase(java.util.Locale.ROOT) 返回本次调用的具体结果，后续语句继续使用该值。
    }
}

public class RecordEqualityDemo {
    public static void main(String[] args) {
        boolean same = new CaseInsensitiveName("JAVA")
            .equals(new CaseInsensitiveName("java"));
            // 关键变化：.equals(new CaseInsensitiveName("java"))；当前对象.equals(new CaseInsensitiveName("java")) 检查当前状态是否满足条件，返回 true 或 false。
        System.out.println(same);
        // 输出：true
    }
}
```

### 了解 record 的序列化边界

record 可以声明实现 Serializable，但序列化兼容策略、组件版本演进和敏感字段保护仍由应用负责；不要因为声明了 record 就认为它天然适合长期持久化。

```java
import java.io.Serializable;

record UserSnapshot(String id) implements Serializable {}
// 关键变化：record UserSnapshot(String id) implements Serializable {}；当前对象；该操作；当前对象.该操作(String id) 返回本次调用的具体结果，后续语句继续使用该值。

public class RecordSerializableDemo {
    public static void main(String[] args) {
        System.out.println(new UserSnapshot("u-1") instanceof Serializable);
// 输出：true；System.out.println 的实参为 new UserSnapshot("u-1") instanceof Serializable。
    }
// 输入：// 输出：true；System.out.println 的实参为 new UserSnapshot("u-1") instanceof Serializable。 } 使用语句中的具体实参或初始值，当前对象 从这里进入后续操作。
}
```
## 简单案例

```java
record Book(String title, int pages) {}

public class RecordSummaryDemo {
    public static void main(String[] args) {
        System.out.println(new Book("Java", 300).title());
        // 输出：Java
    }
}
```

record 适合把一组相关字段作为值传递；复杂校验和可变集合边界再回到上面的对应标题。

## 易混点

- user.name() 是 record 自动生成的访问器，不是 user.getName()；框架适配时要显式增加 getter 或映射层。
- final 组件只限制引用重新指向，不能阻止组件对象内部变化；List.copyOf 只提供容器层的浅隔离。
- 紧凑构造器里修改的是参数变量，不能写 this.value = ...；显式规范构造器才需要手动给组件字段赋值。
- record patterns 与模式 switch 在 JDK 20 是预览特性，javac 和 java 两侧都必须带正确开关。

## 课后小问

1. record Order(List&lt;String&gt; items) 为什么不能自动保证订单明细不变？
答案：record 的组件引用不可重新赋值，但 List 仍可能是外部传入的可变对象。
解析：在规范构造器中使用 List.copyOf 可以隔离列表结构；如果列表元素自身可变，还需要不可变元素或逐元素复制。

2. 紧凑构造器和显式规范构造器怎么选择？
答案：只需校验或规范化参数时优先紧凑构造器；需要完全控制字段赋值或构造流程时使用显式规范构造器。
解析：两者都必须覆盖全部组件，显式写法要手动完成 this.component = component，紧凑写法由编译器插入赋值。

## 本节小结

- record 用组件声明数据载体，并自动提供访问器、值比较和字符串表示。
- 紧凑构造器适合校验与规范化，集合组件要显式处理浅不可变边界。
- record 可以实现接口、声明静态工厂和泛型参数，但不能继承普通类。
- JDK 20 的 record patterns 是预览特性，复制案例时要配套编译与运行开关。

## 快速回顾

- 能写出最小 record 和组件访问器。
- 能解释紧凑构造器与显式规范构造器的区别。
- 能判断 List.copyOf 是否已经实现深不可变。
- 能写出 JDK 20 record pattern 的成对命令。
