---
title: LockSupport 与锁选择
date: 2026-09-27T00:00:00.000Z
category: Java基础快速入门
tags:
  - Java
  - LockSupport
  - 锁选择
  - CAS
  - Semaphore
description: 掌握 LockSupport 的许可语义、park/unpark 与中断边界，并按公平性、可重入、超时和读写并发选择合适的并发工具。
---

# LockSupport 与锁选择

> 版本基线：本文按 JDK 20 的并发锁与同步器 API 编写；示例优先使用可直接编译运行的标准库能力。

## 学习目标

- 会用 `LockSupport.park/unpark` 构造最小的线程阻塞与唤醒协议。
- 理解许可只有一个、虚假返回和中断状态保留等 `LockSupport` 边界。
- 能区分普通互斥锁、CAS、Semaphore、并发容器和不可变性，并按需求做锁选择。

## 核心知识点

### 专业术语

- **LockSupport**：为线程提供阻塞/唤醒原语的工具类，`park` 阻塞当前线程，`unpark` 给目标线程发放一个许可。
- **许可（permit）**：每个线程最多保存一个的二值信号；已有许可时下一次 `park` 立即返回，重复 `unpark` 不会累积多个许可。
- **虚假返回（spurious return）**：`park` 没有看到许可、明确中断或业务信号，也可能提前返回，因此必须循环检查条件。
- **中断状态（interrupt status）**：`park` 因中断返回时不会清除线程中断标志；调用方要决定退出、传播或清除它。
- **互斥锁（mutex）**：同一时刻只允许一个线程进入临界区，并通常具有持有者和释放规则。
- **CAS（compare-and-set）**：比较当前值并在相等时更新的原子操作，适合独立变量竞争更新，不等同于普通互斥锁。
- **Semaphore**：许可证计数器，用于并发名额或资源池；它不是默认只有一个持有者的普通互斥锁。

### 白话解释与边界

`LockSupport` 只负责“让线程停一下、再允许它继续”，不负责保护共享数据，也不会替你判断条件。正确协议是“先改变共享条件，再 `unpark`；被唤醒后循环检查条件”。只靠一次 `park` 或一次 `unpark` 不能替代锁、队列和取消协议。

锁选择先看业务不变式，再看 API 能力：简单互斥优先 `synchronized`；需要超时、可中断等待或多个 `Condition` 时使用 `ReentrantLock`；读多写少再评估 `ReadWriteLock` 或 `StampedLock`。如果只是一个计数器，CAS 可能足够；如果限制并发名额，应该用 `Semaphore`。能用不可变快照或并发容器消除共享写入时，通常比手写锁更容易维护。

## 常用用法

### 传递一次许可：阻塞并唤醒指定线程

需要构造最小的线程阻塞与唤醒协议时使用 `park/unpark`；它只管理许可，不负责保护共享数据或判断业务条件。

```java
// 说明：传递一次许可：阻塞并唤醒指定线程。
import java.util.concurrent.locks.LockSupport;

public class ParkUnparkDemo {
    public static void main(String[] args) throws InterruptedException {
        Thread worker = new Thread(() -> {
// 关键变化：worker 接收表达式 new Thread(() -> { 的计算结果。
// 初始状态：worker 的初始值为 new Thread(() ->。
            LockSupport.park();
            System.out.println("worker resumed");
            // 输出：worker resumed
        });
        worker.start();
        LockSupport.unpark(worker);
        worker.join();
    }
}
```

`unpark(thread)` 只让目标线程拥有一次可消费的许可；它不要求线程当前已经停在 `park` 上。示例中如果 `unpark` 先于 worker 真正执行 `park`，许可仍会保留到下一次 `park`。

### unpark(thread) 先发生：许可不会累积

通知可能早于等待发生时可依赖 `unpark` 的许可语义；每个线程最多保存一个许可，队列或信号量用于表达多个事件。

```java
// 说明：unpark(thread) 先发生：许可不会累积。
import java.util.concurrent.locks.LockSupport;

public class PermitBeforeParkDemo {
    public static void main(String[] args) {
        LockSupport.unpark(Thread.currentThread());
        LockSupport.park();
        System.out.println("passed without blocking");
        // 输出：passed without blocking
    }
}
```

每个线程最多一个许可；连续调用两次 `unpark` 也只保证下一次 `park` 通过一次，不能当作计数信号量使用。需要多个事件时使用队列、`Semaphore` 或其他同步器表达计数语义。

### parkNanos(nanos)：限制阻塞时间

只需要限制等待上限时使用 `parkNanos`；返回后仍要循环检查条件，不能把超时返回当成业务成功。

```java
// 说明：parkNanos(nanos)：限制阻塞时间。
import java.util.concurrent.TimeUnit;
import java.util.concurrent.locks.LockSupport;

public class ParkNanosDemo {
    public static void main(String[] args) {
        LockSupport.parkNanos(TimeUnit.MILLISECONDS.toNanos(1));
        System.out.println("park returned");
        // 输出：park returned（可能因超时、unpark 或中断返回）
    }
}
```

`parkNanos` 只提供时间上限，不说明业务条件已经满足。返回后仍要循环检查条件，并用 `System.nanoTime()` 重新计算剩余时间，避免虚假返回导致过早结束等待。

### park() 遇到中断：返回但保留中断状态

等待协议需要观察取消信号时使用 `park` 并检查中断；它不会抛出 `InterruptedException`，调用方要决定传播或退出。

```java
// 说明：park() 遇到中断：返回但保留中断状态。
import java.util.concurrent.locks.LockSupport;

public class ParkInterruptDemo {
    public static void main(String[] args) {
        Thread.currentThread().interrupt();
        LockSupport.park();
        System.out.println("interrupted=" + Thread.currentThread().isInterrupted());
        // 输出：interrupted=true
        Thread.interrupted();
    }
}
```

`park` 因中断返回时不会像 `Object.wait()` 那样抛出 `InterruptedException`，中断标志仍为 `true`。清除标志前要先决定调用方是否应退出或把取消信号继续向上层传播。

### while 条件循环：防止虚假返回

条件可能虚假返回或被多个线程竞争时必须在 `while` 中重查；先更新条件，再调用 `unpark` 唤醒等待者。

```java
// 说明：worker 每次从 park() 返回都重读 AtomicBoolean ready；main 先设为 true 再 unpark(worker)，避免丢失条件变化。
import java.util.concurrent.atomic.AtomicBoolean;
import java.util.concurrent.locks.LockSupport;

public class ParkConditionLoopDemo {
    public static void main(String[] args) throws InterruptedException {
    // 作用：条件可能虚假返回或被多个线程竞争时必须在 while 中重查；先更新条件，再调用 unpark 唤醒等待者。
        var ready = new AtomicBoolean(false);
// 关键变化：ready 接收表达式 new AtomicBoolean(false) 的计算结果。
// 初始状态：ready 的初始值为 new AtomicBoolean(false)。
        Thread worker = new Thread(() -> {
            while (!ready.get()) {
                LockSupport.park();
                if (Thread.currentThread().isInterrupted()) {
                    Thread.currentThread().interrupt();
                    return;
                }
            }
            System.out.println("condition met");
            // 输出：condition met
        });
        worker.start();
        ready.set(true);
        LockSupport.unpark(worker);
        worker.join();
    }
}
```

条件变量必须先更新，再唤醒；被唤醒后仍然要回到 `while` 重新读取条件。循环同时处理了虚假返回、多个线程竞争同一条件以及通知先于阻塞发生的情况。

### 诊断阻塞原因：携带并读取 blocker

需要在线程转储中标识等待原因时传入 blocker；它只用于诊断，不是锁，也不会自动建立条件同步协议。

```java
// 说明：诊断阻塞原因：携带并读取 blocker。
import java.util.concurrent.locks.LockSupport;

public class ParkBlockerDemo {
    public static void main(String[] args) throws InterruptedException {
        Object blocker = "demo-blocker";
        Thread worker = new Thread(() -> LockSupport.park(blocker));
// 关键变化：worker 接收表达式 new Thread(() -> LockSupport.park(blocker)) 的计算结果。
// 初始状态：worker 的初始值为 new Thread(() -> LockSupport.park(blocker))。
        worker.start();
        while (LockSupport.getBlocker(worker) == null) {
            Thread.yield();
        }
        System.out.println(LockSupport.getBlocker(worker));
        // 输出：demo-blocker
        LockSupport.unpark(worker);
        worker.join();
    }
}
```

blocker 只用于线程转储和诊断，不是锁，也不会自动建立条件协议。生产代码可以用有意义的对象描述等待原因，方便 JFR 或线程转储定位阻塞点。

## 不常用但需要知道

### parkUntil(deadline)：按绝对时间等待

等待必须对齐一个绝对截止时间时使用 `parkUntil`；返回后仍需检查条件和中断状态，避免把提前唤醒当作完成。

```java
import java.util.concurrent.locks.LockSupport;

public class ParkUntilDemo {
    public static void main(String[] args) {
        LockSupport.parkUntil(System.currentTimeMillis() + 1);
        System.out.println("deadline reached or signal received");
// 输出：deadline reached or signal received
        // 作用：通过 parkUntil(deadline) 按绝对时间等待。
    }
}
```

`parkUntil` 使用墙上时钟的绝对时间，系统时钟调整可能影响等待时长；需要稳定的相对超时通常优先 `parkNanos`，并用 `System.nanoTime()` 计算剩余时间。

### synchronized：简单互斥的默认选择

临界区简单且只需互斥与可见性时适合优先使用 `synchronized`；它由语言自动管理释放，通常比手写锁更不易出错。

```java
// 说明：synchronized increment() 在 counter 监视器下完成 count++，方法正常或异常退出都由 JVM 自动释放锁。
public class SynchronizedChoiceDemo {
// 作用：临界区简单且只需互斥与可见性时适合优先使用 synchronized；它由语言自动管理释放，通常比手写锁更不易出错。
    private int count;

    synchronized void increment() {
        count++;
    }

    public static void main(String[] args) {
        var counter = new SynchronizedChoiceDemo();
// 关键变化：counter 接收表达式 new SynchronizedChoiceDemo() 的计算结果。
// 初始状态：counter 的初始值为 new SynchronizedChoiceDemo()。
        counter.increment();
        System.out.println(counter.count);
        // 输出：1
    }
}
```

`synchronized` 可重入、释放可靠，适合短小明确的单一互斥临界区。它没有可配置的超时或可中断获取；需要这些能力时再考虑显式锁。

### ReentrantLock：需要中断、超时或 Condition

需要可中断、超时获取或多个条件队列时选择 `ReentrantLock`；每次成功 `lock` 都要在 `finally` 中 `unlock`。

```java
// 说明：tryLock(1, MILLISECONDS) 让 main 最多等待 1 毫秒；只有获锁成功的分支才在 finally 调用 unlock()。
import java.util.concurrent.TimeUnit;
import java.util.concurrent.locks.ReentrantLock;

public class ReentrantLockChoiceDemo {
    public static void main(String[] args) throws InterruptedException {
        var lock = new ReentrantLock();
// 输入：lock 的初始值为 new ReentrantLock()。
        // 作用：需要可中断、超时获取或多个条件队列时选择 ReentrantLock；每次成功 lock 都要在 finally 中 unlock。
        if (lock.tryLock(1, TimeUnit.MILLISECONDS)) {
            try {
                System.out.println("lock acquired");
                // 输出：lock acquired
            } finally {
                lock.unlock();
            }
        } else {
            System.out.println("busy");
            // 输出：可能是 busy（竞争线程未及时释放时）
        }
    }
}
```

`ReentrantLock` 适合需要 `tryLock`、`lockInterruptibly`、公平策略或多个 `Condition` 的场景。它增加了手动 `unlock` 的责任，必须只在成功获得锁后进入 `try/finally`。

### ReadWriteLock：读多写少时分离访问

读操作明显多于写操作且临界区值得并行时适合评估 `ReadWriteLock`；读写协议必须覆盖所有访问路径。

```java
// 说明：main 线程持有 readLock 时允许其他读者并行，但写者需等待 finally 中的 unlock()。
import java.util.concurrent.locks.ReentrantReadWriteLock;

public class ReadWriteChoiceDemo {
// 作用：读操作明显多于写操作且临界区值得并行时适合评估 ReadWriteLock；读写协议必须覆盖所有访问路径。
    public static void main(String[] args) {
        var lock = new ReentrantReadWriteLock();
// 关键变化：lock 接收表达式 new ReentrantReadWriteLock() 的计算结果。
// 初始状态：lock 的初始值为 new ReentrantReadWriteLock()。
        lock.readLock().lock();
        try {
            System.out.println("shared read");
            // 输出：shared read
        } finally {
            lock.readLock().unlock();
        }
    }
}
```

读写锁只有在读操作足够多且读临界区值得并行时才可能获益；它的读锁升级复杂，读操作很短时普通互斥锁可能更快。详细的降级和升级边界见本章《ReadWriteLock 读写锁》。

### StampedLock：低冲突读场景的乐观校验

低冲突的短读可能从乐观读受益时选择 `StampedLock`；它不可重入、没有 `Condition`，读取后必须校验 stamp。

```java
// 说明：stamp 代表一次未加锁快照；validate(stamp) 只在乐观读期间没有写锁获取时返回 true。
import java.util.concurrent.locks.StampedLock;

public class StampedChoiceDemo {
    public static void main(String[] args) {
        var lock = new StampedLock();
// 输入：lock 的初始值为 new StampedLock()。
        // 作用：低冲突的短读可能从乐观读受益时选择 StampedLock；它不可重入、没有 Condition，读取后必须校验 stamp。
        long stamp = lock.tryOptimisticRead();
        boolean valid = lock.validate(stamp);
        System.out.println("snapshot valid=" + valid);
        // 输出：snapshot valid=true（校验期间无写入时）
    }
}
```

`StampedLock` 适合可以丢弃并重读快照的低冲突读路径，不可重入；基础 `readLock/writeLock` 不响应中断，但提供 `*Interruptibly` 和超时获取版本。详细的 stamp 生命周期和转换锁见本章《StampedLock 乐观读》。

### CAS：独立变量的原子更新，不是普通互斥锁

只有一个独立变量需要比较更新时使用 CAS；它没有持有与释放生命周期，不能保护多字段复合不变式。

```java
// 说明：compareAndSet(0, 1) 仅当 count 当前仍为 0 时原子写入 1，updated 告诉调用线程这次竞争是否成功。
import java.util.concurrent.atomic.AtomicInteger;

public class CasChoiceDemo {
// 作用：只有一个独立变量需要比较更新时使用 CAS；它没有持有与释放生命周期，不能保护多字段复合不变式。
    public static void main(String[] args) {
        var count = new AtomicInteger(0);
// 关键变化：count 接收表达式 new AtomicInteger(0) 的计算结果。
// 初始状态：count 的初始值为 new AtomicInteger(0)。
        boolean updated = count.compareAndSet(0, 1);
        System.out.println("updated=" + updated + ", value=" + count.get());
        // 输出：updated=true, value=1
    }
}
```

CAS 没有“持有者必须释放”的锁生命周期，也不能自动把多个字段绑定为一个不变式。它适合单变量状态机、计数器或无锁数据结构；竞争激烈时要注意自旋成本和 ABA 等问题。

### Semaphore：并发名额，不是普通互斥锁

需要限制并发名额或管理资源池时使用 `Semaphore`；许可证数量可大于一，获取成功后必须在释放路径归还。

```java
// 说明：permits 初始为 2，acquire() 占用一个并发名额使剩余数为 1，finally 保证 release() 归还。
import java.util.concurrent.Semaphore;

public class SemaphoreChoiceDemo {
    public static void main(String[] args) throws InterruptedException {
        var permits = new Semaphore(2);
// 输入：permits 的初始值为 new Semaphore(2)。
        // 作用：需要限制并发名额或管理资源池时使用 Semaphore；许可证数量可大于一，获取成功后必须在释放路径归还。
        permits.acquire();
        try {
            System.out.println("remaining=" + permits.availablePermits());
            // 输出：remaining=1
        } finally {
            permits.release();
        }
    }
}
```

两个许可证表示最多两个线程可以同时进入资源区，因此 `Semaphore(2)` 不是互斥锁。Semaphore 没有线程所有权，任意线程都可能 `release`；它适合连接池、限流和并发名额，而不是保护必须由同一线程成对更新的对象状态。

### 不可变性：消除共享写入

状态可以整体替换或复制快照时优先使用不可变对象；减少共享写入通常比引入更复杂的锁更容易维护。

```java
public class ImmutableChoiceDemo {
    record Snapshot(int version, String value) {}

    public static void main(String[] args) {
        Snapshot current = new Snapshot(1, "ready");
// 关键变化：current 接收表达式 new Snapshot(1, "ready") 的计算结果。
// 初始状态：current 的初始值为 new Snapshot(1, "ready")。
        Snapshot next = new Snapshot(current.version() + 1, "done");
        System.out.println(next);
        // 输出：Snapshot[version=2, value=done]
    }
}
```

不可变对象创建后不再修改，线程之间只需安全发布新的整体快照，通常比保护多个可变字段更简单。若快照较大或更新频繁，可配合 `AtomicReference` 进行整体替换。

### ConcurrentHashMap：用并发容器代替手写容器锁

业务只需要标准容器的并发操作时选择 `ConcurrentHashMap`；单次方法安全不等于跨多个操作或系统的不变式安全。

```java
// 说明：cache.merge("java", 1, Integer::sum) 把单键的查找与更新合成一次原子操作，避免手写容器级锁。
import java.util.concurrent.ConcurrentHashMap;

public class ConcurrentContainerChoiceDemo {
    public static void main(String[] args) {
        var cache = new ConcurrentHashMap<String, Integer>();
// 输入：cache 的初始值为 new ConcurrentHashMap<String, Integer>()。
        // 作用：业务只需要标准容器的并发操作时选择 ConcurrentHashMap；单次方法安全不等于跨多个操作或系统的不变式安全。
        cache.merge("java", 1, Integer::sum);
        System.out.println(cache.get("java"));
        // 输出：1
    }
}
```

并发容器负责自己的内部协调，`merge`、`compute` 和 `putIfAbsent` 可以表达常见的原子组合操作。但容器方法安全不等于整个业务流程安全；跨多个容器或外部系统的不变式仍需要更高层的协议。

- **FileLock 与分布式锁边界**：`FileLock` 解决文件/进程协调，分布式锁解决多进程/多机器协调；二者都不是 JVM 线程互斥锁，进程内临界区仍要使用线程同步工具。

## 锁选择速查

### 能力对比表

| 工具 | 普通互斥 | 可重入 | 公平策略 | 可中断/超时获取 | Condition | 读写并发 |
| --- | --- | --- | --- | --- | --- | --- |
| `synchronized` | 是 | 是 | 无配置保证 | 不支持中断或超时 | `wait/notify` 单监视器条件 | 否 |
| `ReentrantLock` | 是 | 是 | 可选公平 | `lockInterruptibly/tryLock` | 支持多个 Condition | 否 |
| `ReentrantReadWriteLock` | 写锁是；读锁共享 | 是，但升级有风险 | 可选公平 | 两种锁都支持 Lock 能力 | 只有写锁支持 | 是 |
| `StampedLock` | 写锁是；读锁共享；另有乐观读 | 否 | 无公平配置 | 基础获取不响应；`*Interruptibly` 和超时版本可响应 | 不支持 | 是，含乐观读 |
| CAS/Atomic | 否，不建立临界区 | 不适用 | 无 | 不适用 | 不支持 | 不适用 |
| `Semaphore` | 否；许可证可大于一个 | 不适用且无线程所有权 | 可选公平 | `acquire` 可中断，`tryAcquire` 可超时 | 不支持 | 不是读写模型 |

CAS 和 Semaphore 都很有用，但它们不是“另一种普通互斥锁”：CAS 是原子更新原语，Semaphore 是许可证计数器。把二者误当成互斥锁会遗漏复合状态、释放责任和线程所有权问题。

### 先确认是否真的需要锁

准备增加同步工具前先确认共享可变状态确实存在；线程私有数据、不可变对象或消息传递通常更简单。

```java
public class LockNeedDecisionDemo {
    record UserView(String name, int level) {}

    public static void main(String[] args) {
        UserView view = new UserView("Ada", 3);
        System.out.println(view.name() + ":" + view.level());
        // 输出：Ada:3
    }
}
```

优先顺序通常是：线程私有数据或不可变对象，其次是消息传递/阻塞队列，再考虑并发容器或单变量 CAS，最后才为复杂可变不变式选择锁。减少共享写入往往比选择更“高级”的锁更有效。

### 用需求反查工具

无法凭性能直觉选锁时按可重入、超时、中断、条件队列和读写并发需求反查；需求比“哪把锁最快”更可靠。

```java
import java.util.concurrent.locks.ReentrantLock;

public class LockRequirementDemo {
    public static void main(String[] args) throws InterruptedException {
        var lock = new ReentrantLock();
        if (lock.tryLock(1, java.util.concurrent.TimeUnit.MILLISECONDS)) {
            try {
                System.out.println("bounded wait is available");
                // 输出：bounded wait is available
            } finally {
                lock.unlock();
            }
        }
    }
}
```

可以用以下问题快速筛选：是否只是一个独立变量？是否需要同一线程重入？等待能否被中断或超时？是否有多个条件队列？读者能否并行？是否需要公平倾向？问题的答案比“哪把锁性能最高”更能决定正确工具。

## 简单案例

### 用 ReentrantLock 保护复合计数

```java
import java.util.concurrent.locks.ReentrantLock;

public class LockChoiceCaseDemo {
    private final ReentrantLock lock = new ReentrantLock();
    private int count;

    void increment() {
        lock.lock();
        try {
            count++;
        } finally {
            lock.unlock();
        }
    }

    public static void main(String[] args) {
        var counter = new LockChoiceCaseDemo();
        counter.increment();
        counter.increment();
        System.out.println(counter.count);
        // 输出：2
    }
}
```

这个案例的状态只有一个复合计数，使用可重入互斥锁比引入读写锁、StampedLock 或手写 `park/unpark` 更容易验证。只有需求明确要求超时、取消、条件队列或更高并发读时，才继续升级工具。

## 易混点

- `LockSupport` 的 `unpark` 是一个最多一个的许可，不是可累积事件队列；业务条件必须单独保存并在 `while` 中检查。
- `park` 可能因虚假返回或中断返回；中断状态通常仍保留，不能把一次返回当作条件已满足。
- `synchronized` 与 `ReentrantLock` 是普通互斥锁；CAS 不拥有锁，Semaphore 也没有线程所有权，二者不能直接替代复杂临界区。
- 读写锁只有在读多写少且临界区值得并行时才可能获益；读操作很短时锁开销可能超过收益。
- `StampedLock` 不可重入、没有 Condition，基础读写获取不响应中断但有 `*Interruptibly` 变体，乐观读还需要校验；需要可重入和条件队列时优先 `ReentrantLock` 或 `ReentrantReadWriteLock`。
- `FileLock` 和分布式锁解决进程/机器边界，不会自动保护同 JVM 内的普通线程访问。
- 公平策略只能改变等待队列倾向，不能修复锁内 I/O、错误锁顺序、过大的临界区或业务饥饿。

## 课后小问

1. 为什么 `unpark` 可以先于 `park` 调用？
答案：`unpark` 为目标线程准备一个最多一个的许可，之后的 `park` 会消费它并立即返回。
解析：这正是 `LockSupport` 和必须先进入等待队列的某些条件协议的差别；但许可不累积，多个业务事件仍需队列或计数器表达。

2. 为什么 CAS 和 Semaphore 不能统称为普通互斥锁？
答案：CAS 是单次原子比较更新，没有持有/释放生命周期；Semaphore 是可配置数量的许可证，也没有线程所有权。
解析：普通互斥锁保护临界区并要求清晰的获取与释放关系，而 CAS 和 Semaphore 的正确性依赖不同的状态和资源协议。

3. 什么情况下应优先用不可变对象或并发容器，而不是再加一把锁？
答案：状态可以整体替换、读多写少且快照容易复制，或业务只是并发地读写一个标准容器操作时。
解析：减少共享可变状态能缩小同步边界；但跨字段、跨容器或跨外部系统的不变式仍需要原子组合操作或更高层协调。

4. 为什么不能因为存在虚拟线程就把 synchronized 全部换成 LockSupport 或 ReentrantLock？
答案：虚拟线程改变线程调度成本，不会改变临界区、可见性和释放责任；盲目替换可能引入遗漏解锁和新的竞态。
解析：应先用 JFR 和基准定位 pinning、阻塞或竞争，再按需求选择工具并缩短临界区。

## 本节小结

- `LockSupport` 是线程阻塞/唤醒原语，不是共享状态保护器；许可只有一个，返回后必须循环检查条件。
- 简单互斥优先 `synchronized`，需要超时/中断/多个条件时选择 `ReentrantLock`。
- 读多写少再评估 `ReadWriteLock` 或 `StampedLock`，并接受它们的升级、stamp 和可重入边界。
- CAS 适合独立变量，Semaphore 适合并发名额；不可变对象和并发容器常能直接减少锁需求。
- FileLock 与分布式锁属于进程/机器边界协调，不应冒充 JVM 线程互斥锁。

## 快速回顾

- 会写 `park/unpark`、许可、超时和中断状态的基本模板。
- 能在 `while` 中重新检查条件，处理虚假返回和多个线程竞争。
- 能按可重入、公平、超时、中断、Condition 和读写并发能力比较锁。
- 能解释 CAS、Semaphore、并发容器、不可变性和普通互斥锁的边界。
