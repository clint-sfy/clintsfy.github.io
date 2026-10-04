---
title: JVM 内存与类加载
date: 2026-09-27T00:00:00.000Z
category: Java基础快速入门
tags:
  - Java
  - JVM
  - 内存
  - 类加载
description: 建立 JVM 运行时内存区、对象生命周期和类加载初始化的整体模型。
---

# JVM 内存与类加载

## 学习目标

- 区分堆、线程栈、元空间、程序计数器、本地方法栈和直接内存。
- 理解对象可达性、栈帧和类元数据在运行时的职责边界。
- 了解加载、链接、初始化和类加载器的关系，知道异常该找什么证据。

## 核心知识点

### 专业术语

- **堆（heap）**：对象和数组通常分配的共享运行时区域，由垃圾收集器管理。
- **Java 虚拟机栈（JVM stack）**：每个线程私有，保存调用栈帧、局部变量表和操作数栈。
- **元空间（Metaspace）**：保存类元数据的本地内存区域，受 `MaxMetaspaceSize` 等参数影响。
- **程序计数器（PC）**：记录当前线程下一条要执行的字节码位置。
- **类加载（class loading）**：把二进制类表示加载、链接并初始化为可使用的 Class。

### 白话解释与边界

“内存区”是 JVM 规范与实现的抽象，不要把它当作固定的物理分区图。对象通常在堆上，但 JIT 可能通过逃逸分析消除分配或把字段标量化；栈帧也可能被优化。堆溢出、栈溢出、元空间耗尽和直接内存耗尽的原因与诊断手段不同。

类加载大致经历加载、验证、准备、解析和初始化；验证、准备、解析属于链接。与普通方法调用相比，主动使用类时才会触发初始化，类的身份由“二进制名称 + 定义它的类加载器”共同决定。

## 常用用法

### 观察对象与栈帧边界：区分堆对象和线程调用状态

局部变量 `value` 和 `sum` 属于当前线程的栈帧视角，String 对象通常在堆上；具体分配会受 JVM 优化影响，不能用这张图反推每个对象的物理位置。

```java
// 说明：观察对象与栈帧边界：区分堆对象和线程调用状态。
public class HeapStackDemo {
    static int add(int left, int right) {
        int sum = left + right;
        return sum;
    }

    public static void main(String[] args) {
        String value = new String("heap");
        System.out.println(add(value.length(), 1));
        // 输出：5
    }
}
```

### Runtime：观察当前进程的内存上限

Runtime 的数值受启动参数和容器限制影响，适合做运行时观测，不能直接当成“应用实际可用内存”或据此盲目调大堆。

```java
// 说明：Runtime：观察当前进程的内存上限。
public class RuntimeMemoryDemo {
// 作用：Runtime 的数值受启动参数和容器限制影响，适合做运行时观测，不能直接当成“应用实际可用内存”或据此盲目调大堆。
    public static void main(String[] args) {
        Runtime runtime = Runtime.getRuntime();
        System.out.println("processors>0=" + (runtime.availableProcessors() > 0));
        // 输出：processors>0=true
        System.out.println("max>0=" + (runtime.maxMemory() > 0));
        // 输出：max>0=true
    }
}
```

### 类字面量：获取 Class 而不初始化

使用 `Service.class` 取得 Class 通常不会触发 Service 的初始化；主动使用静态字段、静态方法或反射初始化时机要另行判断。

```java
// 说明：类字面量：获取 Class 而不初始化。
public class ClassLiteralDemo {
    static class Service {
        static {
            System.out.println("initialized");
                // 输出：initialized（如果后续主动初始化 Service）
        }
    }

    public static void main(String[] args) {
        Class<Service> type = Service.class;
        System.out.println(type.getSimpleName());
        // 输出：Service
    }
}
```

### Class.forName：选择是否初始化

`Class.forName(name, false, loader)` 只加载并链接，不主动初始化；传 true 或直接使用需要初始化的静态成员时才可能执行 `<clinit>`。

```java
// 说明：Class.forName：选择是否初始化。
public class ClassForNameDemo {
    static class Plugin {
        static {
            System.out.println("plugin initialized");
                // 输出：plugin initialized（使用 Class.forName 初始化时）
        }
    }

    public static void main(String[] args) throws ClassNotFoundException {
        Class.forName(Plugin.class.getName(), false, Plugin.class.getClassLoader());
        // 作用：Class.forName(name, false, loader) 只加载并链接，不主动初始化；传 true 或直接使用需要初始化的静态成员时才可能执行 <clinit>。
        System.out.println("loaded only");
        // 输出：loaded only
    }
}
```

动态类名错误会抛 ClassNotFoundException。

### ClassLoader：查看类的定义加载器

核心类通常由 bootstrap loader 定义，因此 `getClassLoader()` 返回 null；应用类通常由应用类加载器定义。

```java
// 说明：ClassLoader：查看类的定义加载器。
public class ClassLoaderDemo {
// 作用：核心类通常由 bootstrap loader 定义，因此 getClassLoader() 返回 null；应用类通常由应用类加载器定义。
    public static void main(String[] args) {
        ClassLoader loader = String.class.getClassLoader();
        System.out.println(loader == null ? "bootstrap" : loader.getClass().getSimpleName());
        // 输出：bootstrap
    }
}
```

类加载器层次与模块、容器和插件隔离有关。

### 静态初始化：类首次主动使用时执行

初始化由 JVM 保证在类初始化期间串行执行一次；如果 `<clinit>` 抛错，后续主动使用可能得到 ExceptionInInitializerError 或 NoClassDefFoundError。

```java
// 说明：静态初始化：类首次主动使用时执行。
public class ClassInitializationDemo {
    static class Config {
        static final String VALUE = new String("ready");

        static {
            System.out.println("init once");
            // 输出：init once
        }
    }

    public static void main(String[] args) {
        System.out.println(Config.VALUE);
        // 输出：ready
    }
}
```

### DirectByteBuffer：堆外缓冲的边界

直接缓冲区的内容不在普通 Java 堆中，适合与本地 I/O 交互；它仍受本地内存和 `MaxDirectMemorySize` 等边界影响，忘记释放引用也会造成压力。

```java
// 说明：DirectByteBuffer：堆外缓冲的边界。
import java.nio.ByteBuffer;

public class DirectMemoryDemo {
// 作用：直接缓冲区的内容不在普通 Java 堆中，适合与本地 I/O 交互；它仍受本地内存和 MaxDirectMemorySize 等边界影响，忘记释放引用也会造成压力。
    public static void main(String[] args) {
        ByteBuffer buffer = ByteBuffer.allocateDirect(4);
        buffer.putInt(42).flip();
        System.out.println(buffer.getInt());
        // 输出：42
    }
}
```
## 不常用但需要知道

### 控制类初始化：选择只加载或立即初始化

反射加载的初始化开关适合框架启动和插件探测；不要在静态初始化块中执行不可控 I/O，否则类初始化失败可能阻断整个调用链。

```java
public class ClassInitializationFlagDemo {
    static class Feature {
        static int value = 42;
    }

    public static void main(String[] args) throws Exception {
        Class.forName(Feature.class.getName(), false, Feature.class.getClassLoader());
        System.out.println("class prepared");
        // 输出：class prepared
        Class.forName(Feature.class.getName(), true, Feature.class.getClassLoader());
        System.out.println(Feature.value);
        // 输出：42
    }
}
```

### 弱引用与类卸载线索

弱引用只能说明对象是否仍被强引用；GC 时机不确定，不能用一次 `get()` 断言对象一定会被回收。类卸载还要求对应 ClassLoader、Class 元数据和实例都不可达。

```java
import java.lang.ref.WeakReference;

public class ClassUnloadHintDemo {
    public static void main(String[] args) {
        Object plugin = new Object();
        WeakReference<Object> reference = new WeakReference<>(plugin);
        plugin = null;
        System.out.println(reference.get() != null);
        // 输出：true（GC 尚未发生时可能）
    }
}
```

### 线程栈溢出：递归没有终止

实际无限递归会导致 StackOverflowError，栈大小由 `-Xss` 影响；它不是堆溢出，应从递归深度、调用链和每帧局部变量着手诊断。

```java
public class StackOverflowHintDemo {
    static int depth(int n) {
        if (n == 0) {
            return 0;
        }
        return 1 + depth(n - 1);
    }

    public static void main(String[] args) {
        System.out.println(depth(3));
        // 输出：3
    }
}
```

### 元空间边界：类元数据不是普通堆对象

动态生成大量类、重复创建 ClassLoader 或框架代理可能耗尽元空间；只调大堆不能解决。需要结合 `jcmd <pid> VM.native_memory summary`（若开启 NMT）和类加载统计确认来源。

```java
public class MetaspaceHintDemo {
    public static void main(String[] args) {
        System.out.println("configure with -XX:MaxMetaspaceSize=<size>");
        // 输出：configure with -XX:MaxMetaspaceSize=<size>
    }
}
```
## 简单案例

```java
public class JvmMemoryBoundaryDemo {
    static final class Message {
        private final String text;

        Message(String text) {
            this.text = text;
        }

        String text() {
            return text;
        }
    }

    public static void main(String[] args) {
        Message message = new Message("hello JVM");
        System.out.println(message.text());
        // 输出：hello JVM
    }
}
```

栈帧保存局部引用，实例状态通常位于堆，类元数据由类加载器管理；诊断时要先分清是哪一类资源耗尽。

## 易混点

- 堆溢出、StackOverflowError、元空间耗尽和直接内存耗尽不是同一个问题。
- `SomeClass.class` 获取 Class 不等于执行静态初始化；主动使用才可能触发 `<clinit>`。
- 类的身份不仅是全限定名，还包含定义类加载器；同名类可能不能互相强转。
- 直接内存不在普通堆中，但仍受本地内存和引用生命周期影响。
- JIT 可能改变对象实际分配方式，内存区域图用于推理职责，不是逐对象的物理证明。

## 课后小问

1. 为什么两个类加载器加载同名类也可能不能强制转换？
答案：类身份由名称和定义它的类加载器共同决定，两个 Class 实际上不是同一个类型。
解析：插件隔离和容器部署经常利用这一点；共享接口必须由共同父加载器定义。

2. `Class.forName(name, false, loader)` 的 false 有什么作用？
答案：只加载并链接类，不主动执行静态初始化。
解析：框架可以先探测类是否存在，再在真正使用时决定初始化，避免启动阶段副作用。

3. 为什么不能用一次 System.gc() 证明对象已经被回收？
答案：System.gc() 只是建议，GC 是否发生和何时发生由 JVM 决定。
解析：回收问题应结合堆转储、GC 日志、JFR 和引用链证据，而不是单次弱引用观察。

## 本节小结

- 堆、栈、元空间、PC 和直接内存承担不同职责，错误类型对应不同诊断方向。
- 类加载包含加载、链接和初始化，主动使用与类加载器身份决定运行时行为。
- 静态初始化只执行一次，但失败会影响后续主动使用。
- JIT、GC 和类卸载都会让简单内存图存在实现边界，结论要以诊断证据为准。

## 快速回顾

- 能区分 JVM 主要内存区及其错误类型。
- 会解释 Class.forName 的初始化开关。
- 能说明类加载器为什么参与类型身份。
- 知道堆、元空间、直接内存和线程栈各自的排查方向。
