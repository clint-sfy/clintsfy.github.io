---
title: sealed 受限继承
date: 2026-09-27T00:00:00.000Z
category: Java基础快速入门
tags:
  - Java
  - sealed
  - 继承
  - 模式匹配
description: 用 sealed、permits、final 和 non-sealed 描述封闭的继承层次，并掌握它们的扩展边界。
---

# sealed 受限继承

## 学习目标

- 用 sealed interface 或 sealed class 明确允许的直接子类型。
- 理解 permits、final、sealed 和 non-sealed 在继承树中的职责。
- 根据领域是否需要开放扩展，选择 sealed 还是普通接口。

## 核心知识点

### 专业术语

- **sealed type**：限制直接子类型集合的接口或类。
- **permits**：显式列出允许直接继承的类型；同文件的类型可省略。
- **final 子类**：继承链在此终止，不能再有子类。
- **sealed 子类**：继续限制下一层直接子类型。
- **non-sealed 子类**：从此处重新开放继承。

### 白话解释与边界

sealed 不是把所有后代都锁死，而是把“下一层允许谁继承”写进类型契约。每个直接子类必须声明 final、sealed 或 non-sealed；其中 non-sealed 会重新打开扩展。它适合支付结果、命令、状态等有限集合，不适合第三方插件随时增加实现的开放 SPI。

sealed 检查的是直接继承关系，子类仍需满足访问级别、同一模块或同一包等普通 Java 规则。sealed 也不会自动校验业务字段，record 常和 sealed 组合成轻量的代数数据类型。

## 常用用法

### 用 sealed interface 限定实现集合

实现类型必须出现在 permits 列表中；record 默认是 final，正好适合表示不会继续扩展的数据结果。

```java
// 语义：实现类型必须出现在 permits 列表中。
// 调用参数：代码依次使用 "paid:"、"declined:"、"unreachable"、"p-1"、-1。
sealed interface PaymentResult permits Paid, Declined {}

record Paid(String id) implements PaymentResult {}
record Declined(String reason) implements PaymentResult {}

public class SealedInterfaceDemo {
    static String describe(PaymentResult result) {
        if (result instanceof Paid paid) {
            return "paid:" + paid.id();
        }
        if (result instanceof Declined declined) {
            return "declined:" + declined.reason();
        }
        throw new IllegalStateException("unreachable");
    }

    public static void main(String[] args) {
        System.out.println(describe(new Paid("p-1")));
        // 输出：paid:p-1
    }
}
```

### 用 sealed class 限定抽象基类

sealed class 适合共享少量受保护行为或状态的有限层次；如果实现只承载数据，sealed interface 加 record 往往更轻量。

```java
// 语义：sealed class 适合共享少量受保护行为或状态的有限层次。
// 调用参数：代码依次使用 "create"、"delete"。
sealed abstract class Command permits CreateUser, DeleteUser {
    abstract String name();
}

final class CreateUser extends Command {
    @Override
    String name() {
        return "create";
    }
}

final class DeleteUser extends Command {
    @Override
    String name() {
        return "delete";
    }
}

public class SealedClassDemo {
    public static void main(String[] args) {
        System.out.println(new CreateUser().name());
        // 输出：create
    }
}
```

### 用 final 结束继承分支

final 表示该直接子类型不能再被继承，编译器可以把这一支视为稳定叶子节点。

```java
// 语义：final 表示该直接子类型不能再被继承，编译器可以把这一支视为稳定叶子节点。
// 调用参数：代码依次使用 "ok"。
sealed interface Result permits Success {}

final class Success implements Result {
    String message() {
        return "ok";
    }
}

public class SealedFinalDemo {
    public static void main(String[] args) {
        System.out.println(new Success().message());
        // 输出：ok
    }
}
```

### 用 sealed 子类继续分层约束

中间层声明 sealed 后，必须继续列出自己的直接子类；这适合“文件节点—文件—具体文件类型”这类有层次的领域模型。

```java
// 语义：中间层声明 sealed 后，必须继续列出自己的直接子类。
// 调用参数：代码依次使用 true。
sealed interface FileNode permits File, Directory {}

sealed class File implements FileNode permits TextFile, ImageFile {}
final class TextFile extends File {}
final class ImageFile extends File {}

final class Directory implements FileNode {}

public class NestedSealedDemo {
    public static void main(String[] args) {
        System.out.println(new TextFile() instanceof FileNode);
        // 输出：true
    }
}
```

### 用 non-sealed 在边界处重新开放扩展

non-sealed 只放开这一支，不影响同一 sealed 层次的其他分支；常用于核心事件集合中预留外部扩展点。

```java
// 语义：non-sealed 只放开这一支，不影响同一 sealed 层次的其他分支。
// 调用参数：代码依次使用 true。
sealed interface Event permits OpenEvent, ExternalEvent {}

record OpenEvent() implements Event {}

non-sealed class ExternalEvent implements Event {}
class VendorEvent extends ExternalEvent {}

public class NonSealedDemo {
    public static void main(String[] args) {
        System.out.println(new VendorEvent() instanceof Event);
        // 输出：true
    }
}
```

### 使用模式变量处理已知类型

编译器知道 sealed 的已知分支，但普通 if 仍需要显式覆盖或转换；JDK 20 预览的模式 switch 可以把穷尽性表达得更直接。

```java
// 语义：编译器知道 sealed 的已知分支，但普通 if 仍需要显式覆盖或转换。
// 初始状态：rectangle 初始为 (Rectangle) shape。
sealed interface Shape permits Circle, Rectangle {}
record Circle(double radius) implements Shape {}
record Rectangle(double width, double height) implements Shape {}

public class SealedPatternDemo {
    static double area(Shape shape) {
        if (shape instanceof Circle circle) {
            return Math.PI * circle.radius() * circle.radius();
        }
        Rectangle rectangle = (Rectangle) shape;
        return rectangle.width() * rectangle.height();
    }

    public static void main(String[] args) {
        System.out.println(area(new Rectangle(3, 4)));
        // 输出：12.0
    }
}
```
## 不常用但需要知道

### 省略 permits：同一文件中的直接子类可以自动推断

当所有直接子类型和 sealed 类型写在同一编译单元时，可以省略 permits；跨文件或需要显式文档化时建议保留 permits。

```java
sealed interface LocalState {}

final class Ready implements LocalState {}
final class Closed implements LocalState {}

public class InferredPermitsDemo {
    public static void main(String[] args) {
        System.out.println(new Ready() instanceof LocalState);
        // 输出：true
    }
}
```

### 了解 sealed 类型的文件与模块边界

直接子类必须与 sealed 类型处在允许的同一包或同一命名模块中；模块化项目中还要遵守 exports 与 requires 的普通可见性规则。

```java
sealed interface LocalCommand permits LocalCreate {}
final class LocalCreate implements LocalCommand {}

public class SealedBoundaryDemo {
    public static void main(String[] args) {
        System.out.println(new LocalCreate() instanceof LocalCommand);
        // 输出：true
    }
}
```

### 组合 sealed、record 与枚举状态

sealed 负责限制结果种类，record 负责承载字段，enum 负责固定状态值；三者解决不同问题，组合时不要把职责混在一个大类中。

```java
sealed interface ImportResult permits Imported, Skipped {}
record Imported(String file, ImportStatus status) implements ImportResult {}
record Skipped(String file, String reason) implements ImportResult {}
enum ImportStatus { CREATED, UPDATED }

public class SealedDomainDemo {
    public static void main(String[] args) {
        System.out.println(new Imported("a.csv", ImportStatus.CREATED).status());
        // 输出：CREATED
    }
}
```
## 简单案例

```java
sealed interface State permits Ready, Closed {}
record Ready() implements State {}
record Closed() implements State {}

public class SealedSummaryDemo {
    public static void main(String[] args) {
        System.out.println(new Ready() instanceof State);
        // 输出：true
    }
}
```

有限状态用 sealed 表达允许的分支，数据字段可交给 record 承载。

## 易混点

- sealed 只限制直接子类型；后代是否开放取决于中间层的 final、sealed 或 non-sealed 声明。
- record 默认 final，普通 class 不会自动 final，必须显式选择继承策略。
- non-sealed 不是“少限制一点”，而是从该分支开始恢复普通开放继承，而不是继续限制所有后代。
- sealed 不是运行时权限控制，也不会阻止反射、模块配置或业务数据错误；它主要提供编译期类型契约。

## 课后小问

1. 为什么 sealed 的直接子类必须声明 final、sealed 或 non-sealed？
答案：编译器需要知道该分支是否终止、继续受限还是重新开放。
解析：如果没有其中一种声明，继承策略不明确，Java 会拒绝编译；record 因为隐式 final 可以直接作为叶子节点。

2. 什么时候不应该使用 sealed？
答案：当实现需要由第三方、插件或未来模块自由增加时，不应把实现集合封闭。
解析：sealed 更适合有限且由同一方维护的领域状态；开放扩展点可用普通接口，并通过文档或注册机制管理实现。

## 本节小结

- sealed interface/class 用 permits 把直接子类型写入类型契约。
- final 终止分支，sealed 继续约束，non-sealed 在指定分支重新开放。
- sealed、record、enum 可以分别负责层次、数据和固定状态。
- 选择 sealed 前要判断领域集合是否真的有限，避免封死插件或扩展模型。

## 快速回顾

- 能写出 sealed interface 与 permits。
- 能解释 final、sealed、non-sealed 三种后续继承策略。
- 能区分 sealed 的直接子类型限制与所有后代的扩展边界。
- 能判断有限状态模型和开放 SPI 应分别选什么类型设计。
