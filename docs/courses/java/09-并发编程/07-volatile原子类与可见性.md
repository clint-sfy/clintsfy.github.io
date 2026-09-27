---
title: volatile、原子类与可见性
date: 2026-09-27
category: Java基础快速入门
tags:
  - Java
  - volatile
  - Atomic
  - CAS
description: 对比 volatile、CAS、Atomic 系列和 LongAdder，正确处理可见性与复合更新。
---

# volatile、原子类与可见性

## 学习目标

- 了解 volatile 的 happens-before、可见性和有序性边界。
- 会用 AtomicInteger、AtomicReference、AtomicLongArray 和 LongAdder 表达单变量并发更新。
- 识别 ABA、复合操作和统计快照等容易误判的场景。

## 核心知识点

### 专业术语

- **volatile**：对字段读写提供可见性和有序性的修饰符，不提供复合操作互斥。
- **CAS（compare-and-set）**：比较内存中的旧值，仍相等时才写入新值的原子指令语义。
- **Atomic***：基于 CAS 或其他原子机制封装的单变量更新类。
- **LongAdder**：通过分散计数热点降低竞争，适合高并发统计。
- **ABA 问题**：值从 A 变为 B 又回到 A，CAS 只比较值时可能误以为从未变化。

### 白话解释与边界

volatile 适合“一个线程发布状态，其他线程读取”的信号，例如停止标志；它不把 `count++` 变成不可分割操作。Atomic 类适合单个数值、引用或数组元素的 CAS 更新；多个字段要一起满足不变式时，锁、不可变快照或事务式结构更合适。

CAS 失败时通常重试，竞争激烈会消耗 CPU。LongAdder 的总和适合监控指标，不适合要求每一次读取都是严格账面余额的业务。

## 常用用法

### volatile：可见的停止标志

普通字段可能被编译器或处理器重排、缓存观察；volatile 读写建立跨线程可见性。停止线程仍需要任务定期检查标志，阻塞在 I/O 时还需要超时或中断。

```java
public class VolatileStopDemo {
    private static volatile boolean running = true;

    public static void main(String[] args) {
        running = false;
        System.out.println("running=" + running);
        // 输出：running=false
    }
}
```

### AtomicInteger.incrementAndGet：原子计数

incrementAndGet 把读、加一、写回封装为一个原子更新。不要先 `get()` 再独立 `set(get + 1)`，那样又把复合操作拆开了。

```java
import java.util.concurrent.atomic.AtomicInteger;

public class AtomicIncrementDemo {
    public static void main(String[] args) {
        AtomicInteger count = new AtomicInteger(0);
        int current = count.incrementAndGet();
        System.out.println(current + ", stored=" + count.get());
        // 输出：1, stored=1
    }
}
```

### AtomicInteger.compareAndSet：条件更新

CAS 失败说明当前值已经被其他路径改变，调用方可以重试、放弃或走冲突处理。CAS 只保护它比较的变量，不会自动保护旁边的普通字段。

```java
import java.util.concurrent.atomic.AtomicInteger;

public class AtomicCompareDemo {
    public static void main(String[] args) {
        AtomicInteger state = new AtomicInteger(0);
        boolean first = state.compareAndSet(0, 1);
        boolean second = state.compareAndSet(0, 2);
        System.out.println(first + ", " + second + ", state=" + state.get());
        // 输出：true, false, state=1
    }
}
```

### AtomicReference：原子替换不可变快照

用不可变对象整体替换引用，能避免读线程看到半更新状态。updateAndGet 的函数应无副作用，因为竞争时可能被重复计算。

```java
import java.util.concurrent.atomic.AtomicReference;

public class AtomicReferenceDemo {
    record Config(String host, int port) { }

    public static void main(String[] args) {
        AtomicReference<Config> ref = new AtomicReference<>(new Config("a", 80));
        ref.updateAndGet(old -> new Config(old.host(), old.port() + 1));
        System.out.println(ref.get());
        // 输出：Config[host=a, port=81]
    }
}
```

### AtomicLongArray：原子更新数组元素

AtomicLongArray 保护每个索引的更新，不会把两个索引的组合关系变成一次原子事务。需要跨元素不变式时，改用锁或不可变快照。

```java
import java.util.concurrent.atomic.AtomicLongArray;

public class AtomicArrayDemo {
    public static void main(String[] args) {
        AtomicLongArray values = new AtomicLongArray(2);
        values.incrementAndGet(1);
        values.addAndGet(1, 4);
        System.out.println(values.get(1));
        // 输出：5
    }
}
```

### LongAdder：并发统计总量

LongAdder 把热点分散到多个槽，适合 QPS、命中次数等最终汇总；清零和读取期间如果还有并发更新，观察到的是近似时间点的统计。

```java
import java.util.concurrent.atomic.LongAdder;

public class LongAdderCounterDemo {
    public static void main(String[] args) {
        LongAdder hits = new LongAdder();
        hits.add(2);
        hits.increment();
        System.out.println(hits.sum());
        // 输出：3
    }
}
```

### AtomicBoolean：一次性状态转换

CAS 可以表达“只有第一个线程成功初始化”的状态迁移；初始化失败时要定义是否允许回滚或重试。

```java
import java.util.concurrent.atomic.AtomicBoolean;

public class AtomicBooleanDemo {
    public static void main(String[] args) {
        AtomicBoolean started = new AtomicBoolean(false);
        boolean first = started.compareAndSet(false, true);
        boolean second = started.compareAndSet(false, true);
        System.out.println(first + ", " + second);
        // 输出：true, false
    }
}
```
## 不常用但需要知道

### AtomicStampedReference：处理版本号与 ABA

版本号让调用方同时比较引用和值的版本，减少 A→B→A 被误判为“没有变化”的风险。它仍需要清晰的更新协议，不是所有锁自由算法的通用替代品。

```java
import java.util.concurrent.atomic.AtomicStampedReference;

public class StampedReferenceDemo {
    public static void main(String[] args) {
        var ref = new AtomicStampedReference<>("A", 1);
        boolean changed = ref.compareAndSet("A", "B", 1, 2);
        System.out.println(changed + ", value=" + ref.getReference() + ", stamp=" + ref.getStamp());
        // 输出：true, value=B, stamp=2
    }
}
```

### weakCompareAndSet：弱 CAS 边界

弱 CAS 允许无理由失败，必须放在循环算法里；简单业务代码优先使用 compareAndSet，语义更容易读懂。特定 JDK 文档对内存语义的说明优先于经验。

```java
import java.util.concurrent.atomic.AtomicInteger;

public class WeakCasDemo {
    public static void main(String[] args) {
        AtomicInteger value = new AtomicInteger();
        boolean changed;
        do {
            changed = value.weakCompareAndSet(0, 1);
        } while (!changed);
        System.out.println(changed + ", value=" + value.get());
        // 输出：true, value=1
    }
}
```

### LongAccumulator：自定义结合运算

累积函数必须满足结合性，且初始值要合理；如果只统计加法，LongAdder 更直接。

```java
import java.util.concurrent.atomic.LongAccumulator;

public class LongAccumulatorDemo {
    public static void main(String[] args) {
        LongAccumulator max = new LongAccumulator(Math::max, Long.MIN_VALUE);
        max.accumulate(7);
        max.accumulate(3);
        System.out.println(max.get());
        // 输出：7
    }
}
```
## 简单案例

```java
import java.util.concurrent.atomic.AtomicInteger;

public class AtomicStateDemo {
    public static void main(String[] args) {
        AtomicInteger state = new AtomicInteger(0);
        if (state.compareAndSet(0, 1)) {
            System.out.println("initialized=" + state.get());
            // 输出：initialized=1
        }
    }
}
```

把“从未初始化到已初始化”表达成一次 CAS，比使用 volatile 再分开判断和赋值更安全；若初始化过程本身很长，还要考虑失败重试和发布完整对象。

## 易混点

- volatile 保证可见性和有序性，不保证 `++`、检查再写入等复合操作的原子性。
- Atomic 是单变量边界，不会自动把多个字段绑成一个事务。
- LongAdder 的 `sum()` 适合统计，不适合需要严格线性一致读写的余额。
- CAS 失败不是异常，而是并发冲突信号；自旋重试过多也会浪费 CPU。
- ABA 是值相同但中间发生过变化，必要时使用版本号或更高层的锁协议。

## 课后小问

1. 为什么 `volatile int count` 仍不能安全地执行 `count++`？
答案：volatile 只保证每次读写可见，读、加一、写回仍是三个可能交错的动作。
解析：使用 AtomicInteger.incrementAndGet、LongAdder 或锁来定义复合更新边界。

2. 什么时候 LongAdder 不适合替代 AtomicLong？
答案：需要每次读取都是精确线性一致值、需要 CAS 比较或需要严格顺序时。
解析：LongAdder 以吞吐换取读取瞬间的一致性，适合指标计数而非账务状态。

3. 为什么 AtomicReference 更新函数不应产生外部副作用？
答案：竞争重试时函数可能被多次计算，副作用可能重复执行。
解析：让函数只根据旧快照生成新快照，把发送消息、写文件等动作放到 CAS 成功后的明确路径。

## 本节小结

- volatile 是轻量的可见性/有序性工具，不是互斥锁。
- Atomic 系列用 CAS 保护单变量，AtomicReference 适合整体替换不可变快照。
- LongAdder/LongAccumulator 面向高竞争聚合，读取语义与精确业务状态不同。
- 竞争、ABA、复合不变式和副作用都需要在选择原子工具时明确写出。

## 快速回顾

- 能判断 volatile 是否足够解决一个并发需求。
- 会用 AtomicInteger、AtomicReference 和 AtomicLongArray。
- 能解释 CAS、重试和 ABA。
- 能说明 LongAdder 为什么适合统计而不是余额。
