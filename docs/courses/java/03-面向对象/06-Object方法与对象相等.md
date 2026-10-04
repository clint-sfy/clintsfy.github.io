---
title: Object 方法与对象相等
date: 2026-09-27T00:00:00.000Z
category: Java基础快速入门
tags:
  - Java
  - Object
  - equals
  - hashCode
  - Objects
description: 速查 Object、Objects、equals、hashCode、toString 和对象身份的契约与边界。
---

# Object 方法与对象相等

## 学习目标

- 区分对象身份相等、逻辑相等和字段相等。
- 正确重写 `equals`、`hashCode`、`toString`，让值对象能安全进入集合和日志。
- 使用 `Objects` 的空值安全工具和深层比较方法。
- 理解 `getClass`、`clone`、`wait/notify` 等低频 Object API 的边界。

## 核心知识点

### 专业术语

- **对象身份（identity）**：由 `==` 判断两个引用是否指向同一个对象。
- **逻辑相等（logical equality）**：由 `equals` 根据业务字段判断两个对象是否表示同一个值。
- **哈希契约（hashCode contract）**：`equals` 为真时，两个对象必须拥有相同的 `hashCode`。
- **值对象（value object）**：由稳定字段表达身份，通常不可变并按内容比较的对象。
- **可读表示（string representation）**：`toString` 提供调试和日志文本，不应泄露敏感信息。

### 白话解释与边界

`==` 像比较两张地址卡是否指向同一间房，`equals` 像比较房子的业务编号和内容是否相同。`HashMap`、`HashSet` 先用哈希定位，再用 `equals` 确认；只重写一个方法会导致查找、去重或删除出现反直觉结果。参与相等判断的字段应稳定，放入哈希集合后不要再改变它们。

默认 `Object.equals` 只判断身份，默认 `hashCode` 和 `toString` 也只反映对象身份。因此 `Objects.equals` 虽可安全处理 `null`，但不会替你决定大小写、时区或领域规范化规则。

## 常用用法

### `==`：比较引用身份

`==` 对引用比较对象身份，对基本类型比较数值；字符串、包装类型和值对象的内容比较不要依赖它。

```java
// 语义：== 对引用比较对象身份，对基本类型比较数值。
// 初始状态：first 初始为 new String("Java")；second 初始为 new String("Java")。
String first = new String("Java");
// 关键变化：first 接收表达式 new String("Java") 的计算结果。
// 初始状态：first 的初始值为 new String("Java")。
String second = new String("Java");
// 初始状态：second 也保存内容为 "Java" 的独立 String 对象。
System.out.println(first == second);
// 输出：false
```

### `equals`：比较逻辑内容

重写时先判断类型，再比较参与身份的字段；允许 `null` 的字段用 `Objects.equals`，不要为了方便把所有字段都纳入相等规则。

```java
// 语义：重写时先判断类型，再比较参与身份的字段。
// 调用参数：代码依次使用 "U-1"、true。
import java.util.Objects;

class UserId {
    private final String value;

    UserId(String value) {
        this.value = value;
    }

    @Override
    public boolean equals(Object other) {
    // 作用：通过 equals 比较两个 UserId 的 value 字段。
        return other instanceof UserId id && Objects.equals(value, id.value);
// 返回：比较两个 UserId("U-1") 时类型检查和 value 比较都为 true，因此 equals 返回 true。
// 输入：other 为 UserId("U-1")，value 与 id.value 都是 "U-1"，作为 equals 的比较输入。
// 关键变化：Objects.equals(value, id.value) 比较两个 "U-1" 后让 equals 返回 true。
    }
}

System.out.println(new UserId("U-1").equals(new UserId("U-1")));
// 输出：true
```

### `hashCode`：配合 equals 进入哈希集合

需要把对象放入哈希集合时应让 `hashCode` 与 `equals` 使用一致字段，并避免入集合后修改参与哈希的字段。

```java
import java.util.HashSet;
import java.util.Objects;
import java.util.Set;

class UserId {
    private final String value;

    UserId(String value) { this.value = value; }
    // 初始状态：构造 UserId("U-1") 时，字段 value 保存传入文本 "U-1"。

    @Override
    public boolean equals(Object other) {
        return other instanceof UserId id && Objects.equals(value, id.value);
    }

    @Override
    public int hashCode() {
    // 作用：需要把对象放入哈希集合时应让 hashCode 与 equals 使用一致字段，并避免入集合后修改参与哈希的字段。
        return Objects.hash(value);
    }
}

Set<UserId> ids = new HashSet<>();
// 初始状态：ids 当前为 new HashSet<>()。
ids.add(new UserId("U-1"));
// 关键变化：ids.add(new UserId("U-1")) 把 value="U-1" 的 UserId 放入集合，集合大小变为 1。
System.out.println(ids.contains(new UserId("U-1")));
// 输出：true
```

### `toString`：提供安全可读表示

`toString` 适合日志、调试和错误信息；不要拼出密码、令牌、身份证号等敏感字段，也不要让日志格式承担协议稳定性。

```java
// 语义：toString 适合日志、调试和错误信息。
// 调用参数：代码依次使用 "User[name="、"]"、"Ann"。
class User {
    private final String name;

    User(String name) { this.name = name; }
    // 初始状态：构造 User("Ann") 时，字段 name 保存传入文本 "Ann"。

    @Override
    public String toString() {
    // 作用：通过 toString 提供安全可读表示。
        return "User[name=" + name + "]";
    }
}

System.out.println(new User("Ann"));
// 输出：User[name=Ann]
```

### `Objects.equals`：空值安全比较

一方或双方为 `null` 时不会抛异常；业务仍要明确大小写、空白和规范化规则。

```java
String left = null;
// 初始状态：left 当前为 null。
String right = "Java";
// 初始状态：right 当前为 "Java"。
System.out.println(Objects.equals(left, right));
// 输出：false
// 作用：一方或双方为 null 时不会抛异常。
```

### `Objects.hash`：按字段组合哈希

适合实现值对象 `hashCode`；字段顺序和字段集合要与 `equals` 保持一致。

```java
int hash = Objects.hash("U-1", "Ann");
// 初始状态：hash 当前为 Objects.hash("U-1", "Ann")。
// 作用：适合实现值对象 hashCode。
System.out.println(hash != 0);
// 输出：true
```

### `Objects.toString`：为 null 提供文本默认值

适合日志或展示的轻量默认值；不要用它把必填字段的缺失静默变成合法业务值。

```java
String value = null;
// 初始状态：value 当前为 null。
System.out.println(Objects.toString(value, "(missing)"));
// 输出：(missing)
// 作用：适合日志或展示的轻量默认值。
```

### `Objects.requireNonNull`：构造入口校验

传入 `null` 会立即抛 `NullPointerException`，适合构造器和方法入口；延迟到深层调用才失败会丢失上下文。

```java
String name = Objects.requireNonNull("Ann", "name");
// 初始状态：name 当前为 Objects.requireNonNull("Ann", "name")。
// 作用：传入 null 会立即抛 NullPointerException，适合构造器和方法入口。
System.out.println(name);
// 输出：Ann
```

### `getClass`：读取精确运行时类型

`getClass()` 返回精确运行时类，不能替代多态；比较类型前要考虑代理、继承和接口边界。

```java
Object value = "Java";
// 初始状态：value 当前为 "Java"。
System.out.println(value.getClass().getSimpleName());
// 输出：String
// 作用：getClass() 返回精确运行时类，不能替代多态。
```
## 不常用但需要知道

### `Objects.deepEquals`：比较嵌套数组或对象

它会对数组使用深层内容比较；普通对象仍依赖各自的 `equals`，不会自动递归所有字段。

```java
int[][] left = {{1, 2}};
// 初始状态：left 当前为 {{1, 2}}。
int[][] right = {{1, 2}};
System.out.println(Objects.deepEquals(left, right));
// 输出：true
// 作用：通过 Objects.deepEquals 比较嵌套数组或对象。
```

### `Objects.compare`：带比较器的空值边界

比较器由调用者决定 `null` 是否可接受；`Objects.compare` 不会自动把 `null` 当作最大或最小值。

```java
Comparator<String> byLength = Comparator.comparingInt(String::length);
// 初始状态：byLength 当前为 Comparator.comparingInt(String::length)。
int order = Objects.compare("Java", "API", byLength);
// 作用：通过 Objects.compare 带比较器的空值边界。
System.out.println(order > 0);
// 输出：true
```

### `clone`：受保护的浅复制入口

`Object.clone` 默认是浅复制，嵌套可变字段仍可能共享；新设计通常优先使用复制构造器、静态工厂或明确的拷贝方法。

```java
class Box implements Cloneable {
    int value = 7;
    // 初始状态：value 当前为 7。

    @Override
    public Box clone() {
    // 作用：通过 clone 受保护的浅复制入口。
        try {
            return (Box) super.clone();
// 返回：super.clone() 创建 Box 的浅复制；本例返回的新对象 value=7。
// 关键变化：super.clone() 复制当前 value=7 的 Box，返回一个 value 仍为 7 的新对象。
        } catch (CloneNotSupportedException error) {
            throw new AssertionError(error);
        }
    }
}

Box copy = new Box().clone();
// 返回：copy 接收 new Box().clone() 的返回值。
// 关键变化：new Box().clone() 创建浅复制并写入 copy，copy.value 保持为 7。
System.out.println(copy.value);
// 输出：7
```

### `Object.wait`：释放监视器并等待条件

`wait` 必须在持有同一对象监视器时调用，它会释放监视器；唤醒后还必须在循环中重新检查条件。

```java
// 前置条件：当前线程已经持有 lock 的监视器
synchronized (lock) {
    while (!ready) lock.wait();
    // 关键变化：ready 为 false 时，lock.wait() 释放 lock 监视器并等待通知；唤醒后循环重新检查 ready。
}
// 结果：被唤醒并重新取得监视器后才继续执行
```

### `Object.notifyAll`：唤醒同一监视器上的等待线程

调用这些方法必须持有对象监视器，且要配合条件循环；并发代码通常优先使用 `java.util.concurrent` 工具，不要把任意对象当成全局锁。

```java
Object lock = new Object();
// 初始状态：lock 当前为 new Object()。
synchronized (lock) {
    lock.notifyAll();
    // 关键变化：lock.notifyAll() 唤醒所有等待 lock 的线程，线程仍需重新检查 ready 条件。
    // 作用：通过 Object.notifyAll 唤醒同一监视器上的等待线程。
    System.out.println("notified");
    // 输出：notified
}
```

### `finalize`：不要依赖对象终结

`finalize` 已被弃用，不应在新代码中重写或用来释放资源；使用 `try-with-resources`、`AutoCloseable` 和显式生命周期管理。

```java
Object value = new Object();
// 初始状态：value 当前为 new Object()。
// 作用：通过 finalize 不要依赖对象终结。
System.out.println(value.getClass().getSimpleName());
// 输出：Object
```
## 继续阅读

- [常用类与包装类型](/courses/java/02-数组与文本/03-常用类与包装类型)：`Objects`、包装类型和 `Optional`。
- [集合框架与数据结构](/courses/java/05-泛型与集合/02-集合框架与数据结构)：哈希集合为何依赖 equals/hashCode。
- [`static`、`final` 与代码组织](/courses/java/03-面向对象/07-static-final与代码组织)：不可变字段和常量组织。

## 简单案例

### `ToStringBuilder`：生成可维护的 `toString`

Apache Commons Lang 的构造器按字段追加对象摘要；敏感字段仍需主动排除。

```java
import org.apache.commons.lang3.builder.ToStringBuilder;
import org.apache.commons.lang3.builder.ToStringStyle;
var builder = new ToStringBuilder(new Object(), ToStringStyle.NO_CLASS_NAME_STYLE);
// 初始状态：builder 使用空对象和 NO_CLASS_NAME_STYLE 创建，当前内容为空。
// 关键变化：new ToStringBuilder(new Object(), ToStringStyle.NO_CLASS_NAME_STYLE) 创建空摘要 builder。
builder.append("id", 7);
// 关键变化：builder.append("id", 7) 写入 id=7，当前摘要为 "id=7"。
builder.append("name", "job");
// 关键变化：builder.append("name", "job") 再写入 name=job，当前摘要为 "id=7,name=job"。
String text = builder.toString();
// 返回：builder.toString() 生成不可变文本 "[id=7,name=job]"。
// 作用：Apache Commons Lang 的构造器按字段追加对象摘要；敏感字段仍需主动排除。
System.out.println(text);
// 输出：[id=7,name=job]
```

```java
import java.util.HashMap;
import java.util.Map;
import java.util.Objects;

public class ValueObjectDemo {
    record UserKey(String tenant, String id) {
        UserKey {
            Objects.requireNonNull(tenant, "tenant");
            Objects.requireNonNull(id, "id");
        }
    }

    public static void main(String[] args) {
        Map<UserKey, String> names = new HashMap<>();
// 初始状态：names 的初始值为 new HashMap<>()。
        names.put(new UserKey("acme", "U-1"), "Ann");
        // 关键变化：names.put(new UserKey("acme", "U-1"), "Ann") 写入键 UserKey[tenant=acme, id=U-1] 对应的值 Ann。

        System.out.println(names.get(new UserKey("acme", "U-1")));
        // 输出：Ann
        System.out.println(new UserKey("acme", "U-1").toString());
        // 输出：UserKey[tenant=acme, id=U-1]
    }
}
```

案例使用不可变值对象作为 Map 键；相等字段稳定、哈希契约一致，另一个逻辑相同的键也能找到原值。`record` 的自动方法是语言提供的实现，但普通类仍要遵守同一契约。

## 易混点

- `==` 比较身份，`equals` 比较逻辑内容；字符串和包装类型尤其不能依赖引用身份。
- `equals` 为真必须意味着 `hashCode` 相同；只重写一个会破坏 HashMap/HashSet 行为。
- `BigDecimal` 的 `equals` 还比较 scale，领域对象应明确使用哪个比较契约。
- `toString` 是诊断表示，不是稳定 JSON 或接口协议，也不应暴露敏感字段。
- `clone` 默认浅复制，`finalize` 不可靠且已弃用；资源释放应显式管理。

## 课后小问

1. 为什么两个内容相同的 `UserKey` 可以作为 Map 键互相查找？
答案：它们按相同字段实现了 `equals`，并根据同一组字段实现了 `hashCode`。
解析：哈希映射先定位桶再调用 `equals`，两份契约必须一致；参与键身份的字段还必须保持稳定。

2. 只重写 `equals` 而不重写 `hashCode` 会有什么问题？
答案：逻辑相等对象可能落入不同哈希桶，集合查找、去重和删除可能失败。
解析：Object 默认哈希通常反映身份，和新的内容相等规则不一致；实现值对象时要成对重写。

## 本节小结

- 对象身份、逻辑相等和哈希定位是三个不同层次，不能用 `==` 代替 `equals`。
- 值对象的 `equals`、`hashCode`、`toString` 应围绕稳定字段和安全表示设计。
- `Objects` 提供空值安全工具，但比较规则、规范化和业务校验仍由领域决定。
- `clone`、监视器方法和 `finalize` 属于低频边界，新代码优先使用明确的复制、并发和资源管理方案。

## 快速回顾

- 能区分 `==`、`equals`、`hashCode` 和 `toString` 的职责。
- 能写出保持契约一致的值对象比较方法。
- 能用 `Objects.equals`、`hash`、`requireNonNull` 处理空值。
- 能说明 `clone` 的浅复制和 `finalize` 的弃用边界。
