---
title: Class 与反射常用 API
date: 2026-09-27T00:00:00.000Z
category: Java基础快速入门
tags:
  - Java
  - Class
  - Reflection
  - Method
description: 直接用 Java 案例速查 Class、构造器、方法、字段、泛型类型和访问权限 API。
---

# Class 与反射常用 API

## 学习目标

- 会获取 Class，并读取构造器、方法、字段和父类信息。
- 能安全地创建对象、调用方法、读取字段和处理反射异常。
- 能理解泛型擦除、数组类型、模块边界与缓存反射元数据的原因。

## 核心知识点

### 专业术语

- **Class**：Java 类型在运行时的元数据入口。
- **Constructor/Method/Field**：分别描述构造器、方法和字段，并提供动态调用能力。
- **AccessibleObject**：反射成员的访问控制入口，受 Java 访问权限和模块封装限制。
- **Type**：泛型等更丰富的类型信息接口，具体实现可能是 `ParameterizedType`、`GenericArrayType`。

### 白话解释与边界

反射 API 的名称和参数是字符串/对象组合，编译器无法像普通调用一样提前检查；拼错方法名、参数类型或访问权限都会在运行时报错。把反射集中在框架边界，缓存稳定的 `Method`/`Field`，并解包 `InvocationTargetException` 还原业务异常。模块化后，能否访问还取决于 `exports`/`opens`。

## 常用用法

### 获取运行时类型：按已知类型、对象或类名选择入口

类字面量适合已知类型，`getClass` 反映对象的实际运行时类型，`Class.forName` 按名称加载并可能初始化类；不要把外部输入的类名直接交给它。

```java
// 说明：获取运行时类型：按已知类型、对象或类名选择入口。
public class ClassGetDemo {
    public static void main(String[] args) throws Exception {
        Class<String> literal = String.class;
// 关键变化：literal 接收表达式 String.class 的计算结果。
// 初始状态：literal 的初始值为 String.class。
        Class<?> object = "java".getClass();
        Class<?> loaded = Class.forName("java.lang.String");
        System.out.println(literal == object && object == loaded);
        // 输出：true
    }
}
```

### 查询类型名称：选择完整名、简单名或包名

日志和配置映射要明确使用哪种名称；内部类、数组和匿名类的 `getName` 可能包含特殊格式，不能简单当作展示文本。

```java
// 说明：查询类型名称：选择完整名、简单名或包名。
public class ClassNameDemo {
    public static void main(String[] args) {
        Class<?> type = java.util.ArrayList.class;
// 关键变化：type 接收表达式 java.util.ArrayList.class 的计算结果。
// 初始状态：type 的初始值为 java.util.ArrayList.class。
        System.out.println(type.getName() + " / " + type.getSimpleName() + " / " + type.getPackageName());
        // 输出：java.util.ArrayList / ArrayList / java.util
    }
}
```

### 查询直接类型层次：读取父类与接口

`getSuperclass` 只返回直接父类，接口没有父类对象；`getInterfaces` 只列出当前类直接声明的接口，完整层次要递归遍历。

```java
// 说明：查询直接类型层次：读取父类与接口。
import java.util.ArrayList;

public class ClassHierarchyDemo {
    public static void main(String[] args) {
        Class<?> type = ArrayList.class;
// 关键变化：type 接收表达式 ArrayList.class 的计算结果。
// 初始状态：type 的初始值为 ArrayList.class。
        System.out.println(type.getSuperclass().getSimpleName());
        // 输出：AbstractList
        System.out.println(type.getInterfaces()[0].getSimpleName());
        // 输出：List
    }
}
```

### 反射创建对象：取得构造器后实例化

参数类型必须精确匹配构造器签名，基本类型和包装类型也不是同一个 Class；没有无参构造器时不能假设 `getDeclaredConstructor()` 存在。

```java
// 说明：反射创建对象：取得构造器后实例化。
import java.lang.reflect.Constructor;

class User {
    private final String name;

    User(String name) { this.name = name; }
// 关键变化：name 接收右侧表达式 name; } 的计算结果。
// 初始状态：name 的初始值为 name; }。

    String name() { return name; }
}

public class ConstructorReflectDemo {
    public static void main(String[] args) throws Exception {
        Constructor<User> constructor = User.class.getDeclaredConstructor(String.class);
        User user = constructor.newInstance("Ann");
        System.out.println(user.name());
        // 输出：Ann
    }
}
```

### 反射调用公共方法：查找后执行

`getMethod` 只找 public 方法（含继承），`invoke` 的返回值是 Object；目标方法抛出的异常通常被包装在 `InvocationTargetException` 中。

```java
// 说明：反射调用公共方法：查找后执行。
import java.lang.reflect.Method;

public class MethodInvokeDemo {
    public static void main(String[] args) throws Exception {
        Method method = String.class.getMethod("substring", int.class, int.class);
// 关键变化：method 接收表达式 String.class.getMethod("substring", int.class, int.class) 的计算结果。
// 初始状态：method 的初始值为 String.class.getMethod("substring", int.class, int.class)。
        String result = (String) method.invoke("java", 1, 3);
        System.out.println(result);
        // 输出：av
    }
}
```

### 查询本类方法：按签名或批量读取

`getDeclared*` 只看当前类声明，包括 private，但不自动包含父类成员；框架扫描时要明确是否需要递归父类。

```java
// 说明：查询本类方法：按签名或批量读取。
import java.lang.reflect.Method;

class Commands {
    private void hidden() { }
    public void visible() { }
}

public class DeclaredMethodDemo {
    public static void main(String[] args) throws Exception {
        Method hidden = Commands.class.getDeclaredMethod("hidden");
// 关键变化：hidden 接收表达式 Commands.class.getDeclaredMethod("hidden") 的计算结果。
// 初始状态：hidden 的初始值为 Commands.class.getDeclaredMethod("hidden")。
        long count = java.util.Arrays.stream(Commands.class.getDeclaredMethods()).count();
        System.out.println(hidden.getName() + " / " + count);
        // 输出：hidden / 2
    }
}
```

### 反射访问字段：查找后读取或写入

修改 private 字段会破坏封装，也可能在强模块边界失败；已知对象应优先提供方法或构造器，反射字段只留给受控框架。

```java
// 说明：反射访问字段：查找后读取或写入。
import java.lang.reflect.Field;

class Config {
    private String value = "old";
// 关键变化：value 接收右侧表达式 "old" 的计算结果。
// 初始状态：value 的初始值为 "old"。
}

public class FieldReflectDemo {
    public static void main(String[] args) throws Exception {
        Config config = new Config();
        Field field = Config.class.getDeclaredField("value");
        field.setAccessible(true);
        System.out.println(field.get(config));
        // 输出：old
        field.set(config, "new");
        System.out.println(field.get(config));
        // 输出：new
    }
}
```

### 查询字段集合：选择公共继承或本类声明范围

`getFields` 返回 public 字段（含继承），`getDeclaredFields` 只返回当前类声明（含非 public）；字段顺序不应当作业务顺序依赖。

```java
// 说明：查询字段集合：选择公共继承或本类声明范围。
class Parent { public int parent; }
class Child extends Parent { private int child; public int own; }

public class FieldScopeDemo {
    public static void main(String[] args) {
        System.out.println(Child.class.getFields().length);
        // 输出：2
        System.out.println(Child.class.getDeclaredFields().length);
        // 输出：2
    }
}
```

### `isAssignableFrom`：判断类型兼容

调用方向是“左侧能否接收右侧对象”；它比比较类名更可靠，适合插件注册和参数校验。

```java
// 说明：isAssignableFrom：判断类型兼容。
import java.util.ArrayList;
// 关键变化：// 说明：isAssignableFrom：判断类型兼容。 import java.util.ArrayList;；当前对象.isAssignableFrom() 完成本例中的具体调用，后续语句观察调用后的状态。

import java.util.List;

public class AssignableDemo {
    public static void main(String[] args) {
        System.out.println(List.class.isAssignableFrom(ArrayList.class));
// 输出：true；输入：System.out.println(List.class.isAssignableFrom(ArrayList.class));。
        System.out.println(ArrayList.class.isAssignableFrom(List.class));
        // 输出：false
    }
}
```

### `isInstance`：判断对象运行时类型

`isInstance` 处理对象与 Class 的关系，空引用会返回 false；它不提供泛型参数的运行时判断。

```java
// 说明：isInstance：判断对象运行时类型。
import java.util.ArrayList;
import java.util.List;

public class InstanceReflectDemo {
    public static void main(String[] args) {
        List<String> list = new ArrayList<>();
        // 关键变化：List<String> list = new ArrayList<>()；list 接收 该操作(当前参数) 的返回值，当前值变为这次调用得到的具体结果。
        // 初始状态：list 当前为 new ArrayList<>()。
        System.out.println(List.class.isInstance(list));
        // 输出：true
    }
}
```

### 操作反射数组：识别组件类型并读写元素

`Array` 可创建运行时才知道组件类型的数组；基本类型数组和引用类型数组的反射读写规则不同，越界和类型不匹配会抛异常。

```java
// 说明：操作反射数组：识别组件类型并读写元素。
import java.lang.reflect.Array;

public class ArrayReflectDemo {
    public static void main(String[] args) {
        Class<?> type = String[].class;
// 关键变化：type 接收表达式 String[].class 的计算结果。
// 初始状态：type 的初始值为 String[].class。
        Object values = Array.newInstance(type.getComponentType(), 2);
        Array.set(values, 0, "java");
        System.out.println(type.isArray() + " / " + Array.get(values, 0));
        // 输出：true / java
    }
}
```
## 不常用但需要知道

### `trySetAccessible`：探测访问是否可打开

相比直接 `setAccessible(true)`，`trySetAccessible` 可以把当前访问是否成功作为结果处理；强模块边界下仍可能返回 false。

```java
import java.lang.reflect.Field;

class PrivateValue { private int value = 1; }
// 初始状态：value 当前为 1; }。

public class TryAccessibleDemo {
    public static void main(String[] args) throws Exception {
        Field field = PrivateValue.class.getDeclaredField("value");
        // 关键变化：Field field = PrivateValue.class.getDeclaredField("value")；field 接收 getDeclaredField("value") 的返回值，当前值变为这次调用得到的具体结果。
        System.out.println(field.trySetAccessible());
// 输出：true
    }
}
```

### `getGenericSuperclass`：读取部分泛型签名

只有声明位置的泛型签名可能保留在 class 文件中；普通 `new ArrayList<String>()` 的对象实例本身通常不知道 String。

```java
import java.lang.reflect.ParameterizedType;
import java.util.ArrayList;

class Names extends ArrayList<String> { }

public class GenericSuperclassDemo {
    public static void main(String[] args) {
        var type = (ParameterizedType) Names.class.getGenericSuperclass();
// 输入：type 的初始值为 (ParameterizedType) Names.class.getGenericSuperclass()。
        // 作用：通过 getGenericSuperclass 读取部分泛型签名。
        System.out.println(type.getActualTypeArguments()[0].getTypeName());
        // 输出：java.lang.String
    }
}
```

### `getRecordComponents`：读取 record 组件

record 组件提供名称、类型和访问器信息，但反射读取不改变 record 的浅不可变语义。

```java
record Point(int x, int y) { }

public class RecordComponentReflectDemo {
    public static void main(String[] args) {
        var components = Point.class.getRecordComponents();
// 输入：components 的初始值为 Point.class.getRecordComponents()。
        // 作用：通过 getRecordComponents 读取 record 组件。
        System.out.println(components[0].getName() + " / " + components.length);
        // 输出：x / 2
    }
}
```

### 查询嵌套关系：读取宿主与成员

Nestmate 信息用于编译器和运行时表达嵌套类的访问关系；业务框架很少需要直接依赖它。

```java
public class NestReflectDemo {
    static class Inner { }

    public static void main(String[] args) {
        System.out.println(Inner.class.getNestHost() == NestReflectDemo.class);
        // 输出：true
    }
}
```

### `InvocationTargetException`：还原目标异常

框架日志和异常转换应优先记录 `getCause()`；只打印 InvocationTargetException 会丢失真正业务根因。

```java
import java.lang.reflect.InvocationTargetException;
import java.lang.reflect.Method;

public class InvocationTargetDemo {
    static void fail() { throw new IllegalArgumentException("bad input"); }
    // 关键变化：static void fail() { throw new IllegalArgumentException("bad input"); }；当前对象.该操作() 完成本例中的具体调用，后续语句观察调用后的状态。
// 初始状态：表达式为 static void fail() { throw new IllegalArgumentException("bad input"); }。

    public static void main(String[] args) throws Exception {
        Method method = InvocationTargetDemo.class.getDeclaredMethod("fail");
        // 关键变化：Method method = InvocationTargetDemo.class.getDeclaredMethod("fail")；method 接收 getDeclaredMethod("fail") 的返回值，当前值变为这次调用得到的具体结果。
        try {
            method.invoke(null);
            // 关键变化：method.invoke(null);；method；invoke；method.invoke(null) 返回本次调用的具体结果，后续语句继续使用该值。
        } catch (InvocationTargetException e) {
        // 关键变化：} catch (InvocationTargetException e) {；当前对象；该操作；当前对象.该操作(InvocationTargetException e) 返回本次调用的具体结果，后续语句继续使用该值。
            System.out.println(e.getCause().getClass().getSimpleName());
            // 输出：IllegalArgumentException
        }
    }
}
```

### `getAnnotatedType`：读取类型使用位置注解

`AnnotatedType` 关注类型使用位置，而不是方法/字段声明本身；它通常服务于校验框架或静态/运行时类型工具。

```java
import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

@Retention(RetentionPolicy.RUNTIME)
// 关键变化：@Retention(RetentionPolicy.RUNTIME)；注解参数 RetentionPolicy.RUNTIME 绑定到声明位置，框架或反射按该配置处理声明。
// 输入：@Retention(RetentionPolicy.RUNTIME) 使用语句中的具体实参或初始值，当前对象 从这里进入后续操作。
@Target(ElementType.TYPE_USE)
// 关键变化：@Target(ElementType.TYPE_USE)；注解参数 ElementType.TYPE_USE 绑定到声明位置，框架或反射按该配置处理声明。
@interface NonNull { }

public class AnnotatedTypeDemo {
    static @NonNull String value() { return "java"; }
    // 关键变化：static @NonNull String value() { return "java"; }；当前对象.该操作() 完成本例中的具体调用，后续语句观察调用后的状态。

    public static void main(String[] args) throws Exception {
        var type = AnnotatedTypeDemo.class.getDeclaredMethod("value").getAnnotatedReturnType();
        // 关键变化：var type = AnnotatedTypeDemo.class.getDeclaredMethod("value").getAnnotatedReturnType()；type 接收 getDeclaredMethod("value") 的返回值，当前值变为这次调用得到的具体结果。
// 初始状态：type 的初始值为 AnnotatedTypeDemo.class.getDeclaredMethod("value").getAnnotatedReturnType()。
        System.out.println(type.isAnnotationPresent(NonNull.class));
        // 输出：true
    }
}
```
## 简单案例

```java
import java.lang.reflect.Constructor;
import java.lang.reflect.Method;

class Message {
    private final String text;

    public Message(String text) { this.text = text; }
    public String upper() { return text.toUpperCase(); }
}

public class ClassReflectionDemo {
    public static void main(String[] args) throws Exception {
        Constructor<Message> constructor = Message.class.getDeclaredConstructor(String.class);
        Message message = constructor.newInstance("java");
        Method method = Message.class.getMethod("upper");
        System.out.println(method.invoke(message));
        // 输出：JAVA
    }
}
```

反射边界的最小流程是“验证类型 → 找到成员 → 创建/调用 → 处理包装异常”；知道类型时仍应优先直接写 `new Message("java").upper()`。

## 易混点

- `getMethod`/`getMethods` 面向 public 成员和继承关系，`getDeclared*` 面向当前类声明。
- `isAssignableFrom` 的方向是左侧接收右侧；反过来通常得到 false。
- 泛型参数大多会擦除，只有声明签名等位置可能通过 Type 元数据读取。
- `setAccessible`、反射调用和模块 `opens` 是三个相互关联但不等价的边界。

## 课后小问

1. 为什么 `getDeclaredMethods()` 的返回顺序不能当作方法定义顺序？
答案：Java 反射不承诺按源码顺序返回成员。
解析：需要稳定排序时按方法名、参数类型或显式注解排序，不要依赖当前 JVM 输出。

2. 为什么 `InvocationTargetException.getCause()` 比外层异常更重要？
答案：外层只是反射调用包装，真正由目标方法抛出的是 cause。
解析：异常日志、重试和业务转换都应根据真实根因决定，而不是把所有反射异常混为一类。

## 本节小结

- Class 提供类型入口，Constructor/Method/Field 提供动态成员操作。
- `get*` 与 `getDeclared*` 的可见性和继承范围不同。
- 反射要校验参数、缓存元数据、处理访问权限和异常包装。
- 泛型、数组、record 和类型注解提供更低频的元数据读取能力。

## 快速回顾

- 类字面量、对象 getClass 和 Class.forName 是常用入口。
- 创建、调用、字段读写分别使用 Constructor、Method、Field。
- `isAssignableFrom` 判断类型兼容，`isInstance` 判断对象实例。
- 反射不能替代已知类型的普通调用，也不能绕过模块封装。
