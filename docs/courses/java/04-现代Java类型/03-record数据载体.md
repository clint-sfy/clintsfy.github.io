---
title: record 数据载体
date: 2026-09-27
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

组件声明会生成同名访问器、规范构造器、equals、hashCode 和 toString。两个组件值相同的 record 实例通常具有值对象语义。

```java
record Point(int x, int y) {}

public class RecordBasicDemo {
    public static void main(String[] args) {
        Point left = new Point(3, 4);
        Point right = new Point(3, 4);
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
record UserName(String value) {
    public UserName {
        if (value == null || value.isBlank()) {
            throw new IllegalArgumentException("name must not be blank");
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
record Port(int value) {
    public Port(int value) {
        if (value < 1 || value > 65535) {
            throw new IllegalArgumentException("port out of range");
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
record User(String name, int age) {}

public class RecordAccessorDemo {
    public static void main(String[] args) {
        User user = new User("Alice", 20);
        System.out.println(user.name() + ", " + user.age());
        // 输出：Alice, 20
    }
}
```

### 用 List.copyOf 隔离可变集合组件

List.copyOf 会复制列表结构并返回不可修改列表，但不会复制可变元素本身。它也拒绝 null 列表元素；是否允许 null 要在构造器边界明确决定。

```java
import java.util.ArrayList;
import java.util.List;

record Order(List<String> items) {
    public Order {
        items = List.copyOf(items);
    }
}

public class RecordShallowImmutableDemo {
    public static void main(String[] args) {
        List<String> source = new ArrayList<>(List.of("book"));
        Order order = new Order(source);
        source.add("pen");
        System.out.println(order.items());
        // 输出：[book]
    }
}
```

### 让 record 实现接口：统一值对象能力

record 可以实现一个或多个接口，适合让不同数据载体遵守同一读取契约；它不能通过 extends SomeClass 继承普通类。

```java
interface Identified {
    String id();
}

record Product(String id, String name) implements Identified {}

public class RecordInterfaceDemo {
    static String show(Identified value) {
        return value.id();
    }

    public static void main(String[] args) {
        System.out.println(show(new Product("p-1", "Book")));
        // 输出：p-1
    }
}
```

### 使用 record pattern 直接拆出组件（JDK 20 预览）

record pattern 把类型判断、转换和组件读取合在一起。JDK 20 中它是预览特性，编译与运行必须配套：

```java
record Point(int x, int y) {}

public class RecordPatternDemo {
    static String locate(Object value) {
        if (value instanceof Point(int x, int y)) {
            return "x=" + x + ", y=" + y;
        }
        return "unknown";
    }

    public static void main(String[] args) {
        System.out.println(locate(new Point(2, 5)));
        // 输出：x=2, y=5
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
record Address(String city) {}
record User(String name, Address address) {}

public class NestedRecordPatternDemo {
    static String cityOf(Object value) {
        if (value instanceof User(String name, Address(String city))) {
            return name + "@" + city;
        }
        return "unknown";
    }

    public static void main(String[] args) {
        System.out.println(cityOf(new User("Alice", new Address("Shanghai"))));
        // 输出：Alice@Shanghai
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
        return new Celsius((fahrenheit - 32) * 5 / 9);
    }

    double rounded() {
        return Math.round(value * 10) / 10.0;
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
        return other instanceof CaseInsensitiveName that
            && value.equalsIgnoreCase(that.value);
    }

    @Override
    public int hashCode() {
        return value.toLowerCase(java.util.Locale.ROOT).hashCode();
    }
}

public class RecordEqualityDemo {
    public static void main(String[] args) {
        boolean same = new CaseInsensitiveName("JAVA")
            .equals(new CaseInsensitiveName("java"));
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

public class RecordSerializableDemo {
    public static void main(String[] args) {
        System.out.println(new UserSnapshot("u-1") instanceof Serializable);
        // 输出：true
    }
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
