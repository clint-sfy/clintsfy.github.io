---
title: Optional 常用 API
date: 2026-09-27T00:00:00.000Z
category: Java基础快速入门
tags:
  - Java
  - Optional
  - 函数式编程
description: 用 Optional 表达可能缺失的返回值，掌握转换、兜底和异常边界。
---

# Optional 常用 API

## 学习目标

- 会用 `Optional` 表达“有值或没有值”，避免把 `null` 传播到调用方。
- 能选择 `map`、`flatMap`、`filter`、`orElse` 和 `orElseThrow` 处理结果。
- 能判断 `Optional` 适合的返回值边界，以及不应把它放在字段和参数中的场景。

## 核心知识点

### 专业术语

- **`Optional<T>`**：最多包含一个非空值的容器，显式表达返回值可能缺失。
- **`of`/`ofNullable`/`empty`**：分别创建确定非空、可能为空和空的 Optional。
- **`map` 与 `flatMap`**：转换内部值；后者用于转换函数本身返回 `Optional` 的场景。
- **兜底操作**：`orElse`、`orElseGet`、`orElseThrow` 分别表示直接默认值、惰性默认值和缺失时抛异常。

### 白话解释与边界

`Optional` 不是“把所有变量都包起来”的新类型，而是让一个方法的“可能没有结果”变成可读的返回契约。调用方必须选择继续转换、给默认值或把缺失转成异常。`Optional` 自身不应存放 `null`；`of(null)` 会立即抛 `NullPointerException`。

它最适合方法返回值，不适合实体字段、序列化模型和高频参数。`orElse` 的默认表达式无论是否用到都会执行，可能造成额外 I/O 或对象创建；需要延迟计算时使用 `orElseGet`。

## 常用用法

### `ofNullable`：从可能为空的值创建

接收外部输入或旧 API 返回值时优先使用 `ofNullable`；它只包装非空值，不能替代业务校验。

```java
// 语义：接收外部输入或旧 API 返回值时优先使用 ofNullable。
import java.util.Optional;

String input = null;
// 输入：String input = null;；右侧表达式 null 的结果赋给 input。
// 关键变化：String input = null;；将 null 的计算结果写入 input；赋值完成。
Optional<String> value = Optional.ofNullable(input);
// 输入：Optional<String> value = Optional.ofNullable(input);；右侧表达式 Optional.ofNullable(input) 的结果赋给 value。
// 关键变化：Optional<String> value = Optional.ofNullable(input);；调用 ofNullable，实参为 input，返回值写入 value。
System.out.println(value.isEmpty());
// 输出：true
```

### `of`：断言值一定非空

只有已经确认非空时才用 `of`；不确定时使用 `ofNullable`，否则 `null` 会在创建处抛异常。

```java
// 语义：只有已经确认非空时才用 of。
import java.util.Optional;

Optional<String> value = Optional.of("Java");
// 输入：Optional<String> value = Optional.of("Java");；右侧表达式 Optional.of("Java") 的结果赋给 value。
// 关键变化：Optional<String> value = Optional.of("Java");；按 "Java" 调用 of 创建值，结果写入 value。
System.out.println(value.get());
// 输出：Java
```

### `map`：转换内部值

`map` 会在有值时执行函数，函数返回 `null` 时结果变为空 Optional；多个转换可以串联。

```java
// 语义：map 会在有值时执行函数，函数返回 null 时结果变为空 Optional。
import java.util.Optional;

Optional<String> name = Optional.of(" java ");
// 输入：Optional<String> name = Optional.of(" java ");；右侧表达式 Optional.of(" java ") 的结果赋给 name。
// 关键变化：Optional<String> name = Optional.of(" java ");；按 " java " 调用 of 创建值，结果写入 name。
Optional<Integer> length = name.map(String::trim).map(String::length);
// 输入：Optional<Integer> length = name.map(String::trim).map(String::length);；右侧表达式 name.map(String::trim).map(String::length) 的结果赋给 length。
// 关键变化：Optional<Integer> length = name.map(String::trim).map(String::length);；把方法引用 name.map(String::trim).map(String::length) 绑定到目标函数式接口，结果写入 length。
System.out.println(length.orElse(0));
// 输出：4
```

### `flatMap`：串联返回 Optional 的方法

`flatMap` 避免出现 `Optional<Optional<T>>`；如果转换函数返回普通值，使用 `map`。

```java
// 语义：flatMap 避免出现 Optional<Optional<T>>。
import java.util.Optional;

Optional<String> text = Optional.of("42");
// 输入：Optional<String> text = Optional.of("42");；右侧表达式 Optional.of("42") 的结果赋给 text。
// 关键变化：Optional<String> text = Optional.of("42");；按 "42" 调用 of 创建值，结果写入 text。
Optional<Integer> number = text.flatMap(value -> parseInt(value));
// 输入：Optional<Integer> number = text.flatMap(value -> parseInt(value));；右侧表达式 text.flatMap(value -> parseInt(value)) 的结果赋给 number。
// 关键变化：Optional<Integer> number = text.flatMap(value -> parseInt(value));；在流上调用 flatMap 处理元素，结果写入 number。
System.out.println(number.orElse(-1));
// 输出：42

static Optional<Integer> parseInt(String value) {
    try {
        return Optional.of(Integer.parseInt(value));
        // 输入：return Optional.of(Integer.parseInt(value));；接收对象为 Optional，调用 of 的实参为 Integer.parseInt(value)。
        // 关键变化：return Optional.of(Integer.parseInt(value));；按 Integer.parseInt(value) 调用 of 创建值，返回新实例。
    } catch (NumberFormatException ex) {
        return Optional.empty();
        // 输入：return Optional.empty();；接收对象为 Optional，调用 empty 的实参为 无显式参数。
        // 关键变化：return Optional.empty();；调用 empty，实参为 无显式参数；返回空 Optional。
    }
}
```

### `filter`：值存在且满足条件才保留

条件不满足时得到空 Optional，适合把校验接到查询或转换链中；复杂校验应提取成有名字的方法。

```java
// 语义：条件不满足时得到空 Optional，适合把校验接到查询或转换链中。
// 调用参数：代码依次使用 "JAVA-20"、"JAVA-"、"invalid"、-20。
import java.util.Optional;

Optional<String> code = Optional.of("JAVA-20")
        .filter(value -> value.startsWith("JAVA-"));
        // 输入：Optional<String> code = Optional.of("JAVA-20") .filter(value -> value.startsWith("JAVA-"));；右侧表达式 Optional.of("JAVA-20") .filter(value -> value.startsWith("JAVA-")) 的结果赋给 code。
        // 关键变化：Optional<String> code = Optional.of("JAVA-20") .filter(value -> value.startsWith("JAVA-"));；在流上调用 filter 处理元素，结果写入 code。
        // 输入：.filter(value -> value.startsWith("JAVA-"));；接收对象为 上一个链式结果，调用 filter 的实参为 value -> value.startsWith("JAVA-")。
        // 关键变化：.filter(value -> value.startsWith("JAVA-"));；按 predicate 筛选元素，只保留满足条件的元素。
System.out.println(code.orElse("invalid"));
// 输出：JAVA-20
```

### `orElse`：缺失时使用默认值

默认值表达式会立即求值；默认值很简单或已经准备好时使用它。

```java
// 语义：默认值表达式会立即求值。
import java.util.Optional;

String label = Optional.<String>empty().orElse("unknown");
// 输入：String label = Optional.<String>empty().orElse("unknown");；右侧表达式 Optional.<String>empty().orElse("unknown") 的结果赋给 label。
// 关键变化：String label = Optional.<String>empty().orElse("unknown");；调用 orElse，实参为 "unknown"，返回值写入 label。
System.out.println(label);
// 输出：unknown
```

### `orElseGet`：惰性生成默认值

默认值需要计算、查询或创建对象时使用 `orElseGet`，避免值已经存在时做无用工作。

```java
// 语义：默认值需要计算、查询或创建对象时使用 orElseGet，避免值已经存在时做无用工作。
import java.util.Optional;

String label = Optional.<String>empty().orElseGet(() -> "generated-20");
// 输入：String label = Optional.<String>empty().orElseGet(() -> "generated-20");；右侧表达式 Optional.<String>empty().orElseGet(() -> "generated-20") 的结果赋给 label。
// 关键变化：String label = Optional.<String>empty().orElseGet(() -> "generated-20");；调用 orElseGet，实参为 () -> "generated-20"，返回值写入 label。
System.out.println(label);
// 输出：generated-20
```

### `orElseThrow`：缺失时抛出异常

把“找不到就是错误”的边界明确转换为异常；异常类型和消息应符合调用方契约。

```java
// 语义：把“找不到就是错误”的边界明确转换为异常。
// 调用参数：代码依次使用 "user not found"。
import java.util.Optional;

String user = Optional.<String>empty()
        .orElseThrow(() -> new IllegalArgumentException("user not found"));
        // 输入：String user = Optional.<String>empty() .orElseThrow(() -> new IllegalArgumentException("user not found"));；使用构造参数 "user not found" 创建 IllegalArgumentException，结果赋给 user。
        // 关键变化：String user = Optional.<String>empty() .orElseThrow(() -> new IllegalArgumentException("user not found"));；创建 IllegalArgumentException，构造参数为 "user not found"，实例写入 user。
        // 输入：.orElseThrow(() -> new IllegalArgumentException("user not found"));；接收对象为 上一个链式结果，调用 orElseThrow 的实参为 () -> new IllegalArgumentException("user not found")。
        // 关键变化：.orElseThrow(() -> new IllegalArgumentException("user not found"));；调用 orElseThrow，实参为 () -> new IllegalArgumentException("user not found")；Optional 为空时执行 () -> new IllegalArgumentException("user not found") 抛出异常；有值时返回值。
System.out.println(user);
// 输出：缺失时抛出 IllegalArgumentException
```

### `ifPresent`：有值时执行动作

适合末端通知或记录日志，不要用多个嵌套 `ifPresent` 代替有清晰返回值的业务流程。

```java
// 作用：Optional.of("saved").ifPresent 在值存在时执行打印动作。
// 语义：适合末端通知或记录日志，不要用多个嵌套 ifPresent 代替有清晰返回值的业务流程。
// 调用参数：代码依次使用 "saved"、"status="。
import java.util.Optional;

Optional.of("saved").ifPresent(value -> System.out.println("status=" + value));
// 输出：status=saved
```

### `ifPresentOrElse`：分别处理有值和缺失（Java 9+）

当有值和无值都需要末端动作时使用；如果两个分支还要继续返回结果，应优先考虑 `map` 与兜底。

```java
// 语义：当有值和无值都需要末端动作时使用。
import java.util.Optional;

StringBuilder output = new StringBuilder();
// 输入：StringBuilder output = new StringBuilder();；使用构造参数 无显式参数 创建 StringBuilder，结果赋给 output。
// 关键变化：StringBuilder output = new StringBuilder();；创建 StringBuilder，构造参数为 无显式参数，实例写入 output。
Optional.<String>empty().ifPresentOrElse(
        value -> output.append("value=").append(value),
        // 输入：value -> output.append("value=").append(value);；有值分支会追加 value= 和具体值。
        // 关键变化：本例 Optional 为空，因此该分支不执行；output 不追加 value 文本。
        () -> output.append("missing"));
        // 输入：Optional.<String>empty().ifPresentOrElse( value -> output.append("value=").append(value), () -> output.append("missing"));；Optional 为空，实参提供有值与缺失两个分支。
        // 关键变化：Optional.empty() 跳过 value 分支并执行缺失分支，向 output 追加 "missing"；最终文本为 missing。
System.out.println(output);
// 输出：missing
```
## 不常用但需要知道

### `empty`：明确创建空结果

方法找不到结果时返回 `Optional.empty()` 比返回 `null` 更容易让调用方发现缺失路径。

```java
import java.util.Optional;

Optional<String> missing = Optional.empty();
// 输入：Optional<String> missing = Optional.empty();；右侧表达式 Optional.empty() 的结果赋给 missing。
// 关键变化：Optional<String> missing = Optional.empty();；调用 empty，实参为 无显式参数，返回值写入 missing。
System.out.println(missing.isPresent());
// 输出：false
```

### `or`：缺失时切换到另一个 Optional（Java 9+）

`or` 的备用函数也是惰性的，适合多个查询源按优先级回退；不要把异常吞掉后无条件回退。

```java
import java.util.Optional;

Optional<String> primary = Optional.empty();
// 输入：Optional<String> primary = Optional.empty();；右侧表达式 Optional.empty() 的结果赋给 primary。
// 关键变化：Optional<String> primary = Optional.empty();；调用 empty，实参为 无显式参数，返回值写入 primary。
Optional<String> result = primary.or(() -> Optional.of("fallback"));
// 输入：Optional<String> result = primary.or(() -> Optional.of("fallback"));；右侧表达式 primary.or(() -> Optional.of("fallback")) 的结果赋给 result。
// 关键变化：Optional<String> result = primary.or(() -> Optional.of("fallback"));；按 "fallback" 调用 of 创建值，结果写入 result。
System.out.println(result.get());
// 输出：fallback
```

### `stream`：把 Optional 接入 Stream（Java 9+）

`Optional.stream()` 在有值时产生一个元素、无值时产生空流，适合拼接批量转换管道。

```java
import java.util.List;

List<String> values = List.of("java", "", "sql").stream()
        .map(text -> text.isBlank() ? java.util.Optional.<String>empty() : java.util.Optional.of(text))
        .flatMap(java.util.Optional::stream)
        .toList();
        // 输入：List<String> values = List.of("java", "", "sql").stream() .map(text -> text.isBlank() ? java.util.Optional.<String>empty() : java.util.Optional.of(text)) .flatMap(java.util.Optional::stream) .toList();；右侧表达式 List.of("java", "", "sql").stream() .map(text -> text.isBlank() ? java.util.Optional.<String>empty() : java.util.Optional.of(text)) .flatMap(java.util.Optional::stream) .toList() 的结果赋给 values。
        // 关键变化：List<String> values = List.of("java", "", "sql").stream() .map(text -> text.isBlank() ? java.util.Optional.<String>empty() : java.util.Optional.of(text)) .flatMap(java.util.Optional::stream) .toList();；把方法引用 List.of("java", "", "sql").stream() .map(text -> text.isBlank() ? java.util.Optional.<String>empty() : java.util.Optional.of(text)) .flatMap(java.util.Optional::stream) .toList() 绑定到目标函数式接口，结果写入 values。
        // 输入：.map(text -> text.isBlank() ? java.util.Optional.<String>empty() : java.util.Optional.of(text)) .flatMap(java.util.Optional::stream) .toList();；接收对象为 上一个链式结果，调用 flatMap 的实参为 java.util.Optional::stream。
        // 关键变化：.map(text -> text.isBlank() ? java.util.Optional.<String>empty() : java.util.Optional.of(text)) .flatMap(java.util.Optional::stream) .toList();；把每个元素映射成子流并展开为一个连续流。
        // 输入：.flatMap(java.util.Optional::stream) .toList();；接收对象为 上一个链式结果，调用 flatMap 的实参为 java.util.Optional::stream。
        // 关键变化：.flatMap(java.util.Optional::stream) .toList();；把每个元素映射成子流并展开为一个连续流。
        // 输入：.toList();；接收对象为 上一个链式结果，调用 toList 的实参为 无显式参数。
        // 关键变化：.toList();；终止当前流管道并把元素收集为 List；返回列表结果。
System.out.println(values);
// 输出：[java, sql]
```

### `get`：直接取值（谨慎使用）

`get()` 在空 Optional 上抛 `NoSuchElementException`；只有前面已经可靠判断存在时才使用，通常优先 `orElse` 或 `orElseThrow`。

```java
import java.util.Optional;

Optional<String> value = Optional.of("Java");
// 输入：Optional<String> value = Optional.of("Java");；右侧表达式 Optional.of("Java") 的结果赋给 value。
// 关键变化：Optional<String> value = Optional.of("Java");；按 "Java" 调用 of 创建值，结果写入 value。
System.out.println(value.get());
// 输出：Java
```

### `OptionalInt`：避免基本类型装箱

大量数值流可以使用 `OptionalInt`、`OptionalLong` 或 `OptionalDouble`，普通对象结果仍使用 `Optional<T>`。

```java
import java.util.OptionalInt;

OptionalInt result = OptionalInt.of(20);
// 输入：OptionalInt result = OptionalInt.of(20);；右侧表达式 OptionalInt.of(20) 的结果赋给 result。
// 关键变化：OptionalInt result = OptionalInt.of(20);；按 20 调用 of 创建值，结果写入 result。
System.out.println(result.orElse(0));
// 输出：20
```
## 简单案例

```java
import java.util.Map;
import java.util.Optional;

public class OptionalDemo {
    public static void main(String[] args) {
        Map<String, String> users = Map.of("ann", "ann@example.com");
        // 输入：Map<String, String> users = Map.of("ann", "ann@example.com");；右侧表达式 Map.of("ann", "ann@example.com") 的结果赋给 users。
        // 关键变化：Map<String, String> users = Map.of("ann", "ann@example.com");；按 "ann", "ann@example.com" 调用 of 创建值，结果写入 users。
        String email = findEmail(users, "ann")
                .filter(value -> value.contains("@"))
                .orElseThrow(() -> new IllegalArgumentException("email missing"));
                // 输入：String email = findEmail(users, "ann") .filter(value -> value.contains("@")) .orElseThrow(() -> new IllegalArgumentException("email missing"));；使用构造参数 "email missing" 创建 IllegalArgumentException，结果赋给 email。
                // 关键变化：String email = findEmail(users, "ann") .filter(value -> value.contains("@")) .orElseThrow(() -> new IllegalArgumentException("email missing"));；创建 IllegalArgumentException，构造参数为 "email missing"，实例写入 email。
                // 输入：.filter(value -> value.contains("@")) .orElseThrow(() -> new IllegalArgumentException("email missing"));；接收对象为 上一个链式结果，调用 filter 的实参为 value -> value.contains("@")。
                // 关键变化：.filter(value -> value.contains("@")) .orElseThrow(() -> new IllegalArgumentException("email missing"));；按 predicate 筛选元素，只保留满足条件的元素。
                // 输入：.orElseThrow(() -> new IllegalArgumentException("email missing"));；接收对象为 上一个链式结果，调用 orElseThrow 的实参为 () -> new IllegalArgumentException("email missing")。
                // 关键变化：.orElseThrow(() -> new IllegalArgumentException("email missing"));；调用 orElseThrow，实参为 () -> new IllegalArgumentException("email missing")；Optional 为空时执行 () -> new IllegalArgumentException("email missing") 抛出异常；有值时返回值。
        System.out.println(email);
        // 输出：ann@example.com
    }

    static Optional<String> findEmail(Map<String, String> users, String user) {
        return Optional.ofNullable(users.get(user));
        // 输入：return Optional.ofNullable(users.get(user));；接收对象为 users，调用 get 的实参为 user。
        // 关键变化：return Optional.ofNullable(users.get(user));；从 users 按 user 读取值，返回值不修改映射内容。
    }
}
```

## 易混点

- `map` 接收返回普通值的函数，`flatMap` 接收返回 `Optional` 的函数；后者用于消除嵌套容器。
- `orElse` 会立刻求默认值，`orElseGet` 只在空值时调用；默认值有副作用时差异尤其明显。
- `Optional` 不是异常处理器，也不能让空值自动消失；缺失是正常分支还是错误必须由业务决定。
- `Optional` 最适合作为返回值；实体字段、序列化 DTO 和高频参数使用它会增加复杂度。

## 课后小问

1. 为什么 `Optional.of(null)` 不适合处理外部输入？
   - 答案：`of` 要求参数非空，传入 `null` 会立即抛出 `NullPointerException`。
   - 解析：外部输入可能为空时应使用 `ofNullable`，让缺失状态进入后续的 `map`、兜底或异常分支。

2. 什么情况下要把 `orElse` 换成 `orElseGet`？
   - 答案：默认值需要计算、查询或创建对象，并且只应在缺失时执行时。
   - 解析：`orElse` 的参数在调用前就已经求值；`orElseGet` 接收 Supplier，只有 Optional 为空才执行。

## 本节小结

- Optional 用返回值契约表达“可能缺失”，不应把它当成所有字段的包装器。
- `ofNullable`、`map`、`flatMap` 和 `filter` 能组成安全的转换链。
- `orElse`、`orElseGet` 和 `orElseThrow` 分别对应直接默认、惰性默认和异常边界。
- `ifPresent`、`or` 和 `stream` 适合把 Optional 接入末端动作或批量流处理。

## 快速回顾

- 能区分 `of`、`ofNullable` 和 `empty` 的使用前提。
- 能根据转换函数返回类型选择 `map` 或 `flatMap`。
- 能解释 `orElse` 与 `orElseGet` 的求值时机。
- 能判断 Optional 应返回给调用方还是应该转换成异常。
