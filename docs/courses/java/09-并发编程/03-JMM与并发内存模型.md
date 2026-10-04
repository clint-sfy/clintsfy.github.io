---
title: JMM 与并发内存模型
date: 2026-09-27T00:00:00.000Z
category: Java基础快速入门
tags:
  - Java
  - JMM
  - 并发
description: 用 happens-before、volatile、锁和安全发布推理 Java 并发读写。
---

# JMM 与并发内存模型

## 学习目标

- 理解可见性、有序性和原子性的含义及其边界。
- 会使用 happens-before 关系判断一次写入何时对另一个线程可见。
- 知道 volatile、锁、Atomic 和安全发布分别解决什么问题。

## 核心知识点

### 专业术语

- **Java Memory Model（JMM）**：规定线程读写共享变量时可见性、有序性和同步语义的抽象模型。
- **happens-before**：如果 A happens-before B，A 的结果对 B 可见，且 A 的执行顺序先于 B。
- **可见性（visibility）**：一个线程写入后，其他线程能观察到最新值。
- **有序性（ordering）**：同步边界约束了编译器、JIT 和处理器重排对观察结果的影响。
- **原子性（atomicity）**：一个操作不会被其他线程观察到中间状态。

### 白话解释与边界

JMM 不是“每个线程都有一份永久独立内存”的实现承诺，而是给出跨线程观察规则。单线程里看起来顺序正确的代码，跨线程没有同步时可能看不到最新值，也可能看到不完整的复合状态。

常见 happens-before 边包括：同一锁的解锁先于后续加锁；volatile 写先于后续读；`Thread.start()` 先于新线程动作；线程中的动作先于成功的 `join()` 返回；Future 完成先于 `get()` 返回。它们建立可见性，但是否足以保证整个业务不变式还要看原子边界。

## 常用用法

### volatile：发布状态标志

volatile 读写具有可见性和有序性，适合停止标志、配置快照引用等单变量发布。

```java
// 说明：main 线程对 volatile stopped 写入 true，其他线程后续读取该字段时能看到这个停止状态。
public class VolatileFlagDemo {
    private static volatile boolean stopped;

    public static void main(String[] args) {
        stopped = false;
// 初始状态：stopped = false。
// 作用：stopped = false;；发布状态标志。
        stopped = true;
// 初始状态：stopped = true。
        if (stopped) {
            System.out.println("stop requested");
// 输出：stop requested
        }
    }
}
```

它不提供互斥，也不能保护 `count++`、检查再写入等复合操作。

### synchronized：用锁建立可见性与互斥

`synchronized` 用于让同一个监视器的 unlock→lock 建立 happens-before，并保证临界区互斥。

```java
// 说明：set() 退出 box 监视器先于 get() 再次获取它，所以 value=42 既互斥更新又对读线程可见。
public class SynchronizedVisibilityDemo {
    private int value;

    synchronized void set(int value) {
        this.value = value;
// 初始状态：value = value。
// 作用：this.value = value;；用锁建立可见性与互斥。
    }

    synchronized int get() {
        return value;
    }

    public static void main(String[] args) {
        var box = new SynchronizedVisibilityDemo();
// 作用：var box = new SynchronizedVisibilityDemo();；用锁建立可见性与互斥。
// 初始状态：box = new SynchronizedVisibilityDemo()。
        box.set(42);
// 作用：box.set(42);；用锁建立可见性与互斥。
        System.out.println(box.get());
// 输出：42
    }
}
```

读写必须使用同一个锁对象；只给写方法加锁、读方法不加锁并不能形成完整的保护。

### 在线程间发布结果：启动后等待完成

启动前的写入对新线程可见，线程完成前的写入对成功 join 的线程可见。

```java
// 说明：在线程间发布结果：启动后等待完成。
public class ThreadHappensBeforeDemo {
    private static int value;

    public static void main(String[] args) throws InterruptedException {
        value = 41;
// 初始状态：value = 41。
        Thread worker = new Thread(() -> value++);
// 初始状态：worker = new Thread(() -> value++)。
// 作用：Thread worker = new Thread(() -> value++);；启动后等待完成。
        worker.start();
// 初始状态：worker.start()。
// 作用：worker.start();；启动后等待完成。
        worker.join();
// 初始状态：worker.join()。
// 作用：worker.join();；启动后等待完成。
        System.out.println(value);
// 输出：42
    }
}
```

`join(timeout)` 超时返回时不代表后续写入已经可见或任务已经完成。

### AtomicInteger：CAS 保证单变量更新

CAS 会比较当前值，只有仍等于期望值才写入新值；失败时通常重试或走冲突路径。

```java
// 说明：AtomicInteger：CAS 保证单变量更新。
import java.util.concurrent.atomic.AtomicInteger;

public class AtomicCasDemo {
    public static void main(String[] args) {
        AtomicInteger version = new AtomicInteger(1);
// 初始状态：version = new AtomicInteger(1)。
// 作用：AtomicInteger version = new AtomicInteger(1);；CAS 保证单变量更新。
        boolean updated = version.compareAndSet(1, 2);
// 作用：boolean updated = version.compareAndSet(1, 2);；CAS 保证单变量更新。
// 初始状态：updated = version.compareAndSet(1, 2)。
        System.out.println(updated + ", version=" + version.get());
// 输出：true, version=2
    }
}
```

CAS 适合无锁更新独立状态，不代表任意多字段操作都能无锁完成。

### 安全发布：用不可变对象传递快照

把不可变对象引用通过 volatile、锁、静态初始化或并发容器发布，可以让读取线程看到完整构造结果。

```java
// 说明：安全发布：用不可变对象传递快照。
public class SafePublicationDemo {
    record Config(String host, int port) { }
    private static volatile Config config = new Config("localhost", 8080);
// 初始状态：config = new Config("localhost", 8080)。
// 作用：private static volatile Config config = new Config("localhost", 8080);；用不可变对象传递快照。

    public static void main(String[] args) {
        Config snapshot = config;
// 初始状态：snapshot = config。
        System.out.println(snapshot.host() + ":" + snapshot.port());
// 输出：localhost:8080
    }
}
```

只把普通可变对象引用放出去，仍可能被调用方绕过保护修改内部字段。

### Future.get：等待完成并取得可见结果

Future 完成后调用 `get()` 能读取任务结果；如果只查询 `isDone()` 而不取结果，业务仍需要决定异常和取消如何传播。

```java
// 说明：Future.get：等待完成并取得可见结果。
import java.util.concurrent.Executors;

public class FutureHappensBeforeDemo {
    public static void main(String[] args) throws Exception {
        try (var executor = Executors.newSingleThreadExecutor()) {
// 初始状态：executor = Executors.newSingleThreadExecutor())。
// 作用：try (var executor = Executors.newSingleThreadExecutor()) {；等待完成并取得可见结果。
            var future = executor.submit(() -> "ready");
// 作用：var future = executor.submit(() -> "ready");；等待完成并取得可见结果。
// 初始状态：future = executor.submit(() -> "ready")。
            System.out.println(future.get());
// 输出：ready
        }
    }
}
```
## 不常用但需要知道

### final 字段：构造完成后的特殊可见性

final 字段在构造器正常完成后有额外的初始化安全保证，但不等于整个对象天然线程安全；可变字段和 `this` 逃逸仍需同步。

```java
// 说明：User 构造器在对象发布前把 final name 设为 "Ann"；前提是构造期间没有泄露 this。
public class FinalFieldDemo {
    static final class User {
        private final String name;

        User(String name) {
            this.name = name;
// 初始状态：name = name。
        }

        String name() {
            return name;
        }
    }

    public static void main(String[] args) {
        System.out.println(new User("Ann").name());
// 输出：Ann
    }
}
```

### VarHandle：低层次内存访问工具

VarHandle 可以精细选择普通、opaque、acquire/release 或 volatile 访问语义，常用于并发库和高性能底层组件。业务代码优先用 Atomic、Lock 和并发集合，避免自己组合错误的内存语义。

```java
// 说明：handle 精确指向 VarHandleDemo.value；set/get 在 box 实例上以普通内存语义写入并读取 42。
import java.lang.invoke.MethodHandles;
import java.lang.invoke.VarHandle;

public class VarHandleDemo {
    private int value;

    public static void main(String[] args) throws Exception {
        VarHandle handle = MethodHandles.lookup().findVarHandle(
                VarHandleDemo.class, "value", int.class);
// 初始状态：handle = MethodHandles.lookup().findVarHandle(。
// 作用：VarHandle handle = MethodHandles.lookup().findVarHandle(；低层次内存访问工具，返回读取结果。
        var box = new VarHandleDemo();
// 初始状态：box = new VarHandleDemo()。
// 作用：var box = new VarHandleDemo();；低层次内存访问工具，返回调用结果。
        handle.set(box, 42);
// 作用：handle.set(box, 42);；低层次内存访问工具，调用后目标状态更新。
        System.out.println(handle.get(box));
// 输出：42
    }
}
```

### lazySet：较弱的最终发布

`lazySet` 允许延迟传播，适合不需要立即同步观察的状态清理；若后续代码依赖写入马上对其他线程可见，使用普通 `set` 更直白。

```java
// 说明：state.lazySet(1) 以 release 语义发布最终值；它不承诺另一线程立即观察到 1。
import java.util.concurrent.atomic.AtomicInteger;

public class LazySetDemo {
    public static void main(String[] args) {
        AtomicInteger state = new AtomicInteger();
// 作用：AtomicInteger state = new AtomicInteger();；较弱的最终发布。
// 初始状态：state = new AtomicInteger()。
        state.lazySet(1);
// 初始状态：state.lazySet(1)。
// 作用：state.lazySet(1);；较弱的最终发布。
        System.out.println(state.get());
// 输出：1
    }
}
```

### 数据竞争：没有同步就没有可靠推理

单线程输出确定不代表多线程安全；并发地执行 `count++` 会拆成读、加一、写回，更新可能丢失。遇到数据竞争应先建立同步边界，再谈性能优化。

```java
public class DataRaceDemo {
    private static int count;

    public static void main(String[] args) {
        count++;
        System.out.println(count);
// 输出：1
    }
}
```
## 简单案例

```java
import java.util.concurrent.atomic.AtomicBoolean;

public class StopSignalDemo {
    public static void main(String[] args) {
        AtomicBoolean running = new AtomicBoolean(true);
// 初始状态：running = new AtomicBoolean(true)。
// 作用：AtomicBoolean running = new AtomicBoolean(true);；没有同步就没有可靠推理，返回调用结果。
        running.set(false);
// 初始状态：running.set(false)。
// 作用：running.set(false);；没有同步就没有可靠推理，调用后目标状态更新。
        System.out.println("running=" + running.get());
// 输出：running=false
    }
}
```

停止信号只需要单变量可见性；如果停止时还要更新队列、统计和资源状态，就应设计完整的关闭协议，而不是堆叠多个 volatile 字段。

## 易混点

- volatile 解决“看见最新值”，不解决“多个线程同时改值”的互斥和复合原子性。
- happens-before 是可见性与顺序关系，不是所有业务动作自动串行。
- `Thread.start()`/`join()` 的边界只覆盖对应线程生命周期，普通轮询没有同等保证。
- final 字段有初始化安全语义，但对象内部的集合、数组和可变字段仍可能被并发修改。
- Atomic 的 CAS 失败表示竞争发生了，不应把“无锁”误解成“永远不会重试”。

## 课后小问

1. 为什么 volatile 不能安全实现 `count++`？
答案：自增由读、加法、写回组成，多个线程可能读到同一个旧值并覆盖彼此的结果。
解析：需要 AtomicInteger、LongAdder 或锁把复合更新变成一个受保护的原子边界。

2. `join()` 返回后为什么可以读取线程写入的普通字段？
答案：线程动作先于成功的 join 返回，建立了 happens-before 关系。
解析：这只说明该线程结束前的写入对 join 调用线程可见，不等于其他线程自动同步。

3. 为什么“加了 final”不等于对象完全不可变？
答案：final 只约束引用或字段不能重新赋值，引用指向的集合、数组等内部对象仍可能变化。
解析：不可变对象还要求状态不暴露可变引用，并在构造过程中不让 this 逃逸。

## 本节小结

- JMM 用 happens-before 描述跨线程的可见性与有序性。
- volatile 适合状态发布，synchronized/Lock 负责互斥，Atomic/CAS 适合单变量竞争更新。
- start、join、锁、volatile 和 Future 都能建立特定的同步边界。
- 先消除数据竞争并明确安全发布，再用基准测试决定是否需要低层 VarHandle。

## 快速回顾

- 能解释可见性、有序性和原子性的区别。
- 能列出至少五条常见 happens-before 边。
- 能判断 volatile、Atomic 和锁各自的适用边界。
- 能说明安全发布为什么需要不可变对象或明确同步。
