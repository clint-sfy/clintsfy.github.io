---
title: ReadWriteLock 读写锁
date: 2026-09-27T00:00:00.000Z
category: Java基础快速入门
tags:
  - Java
  - ReadWriteLock
  - ReentrantReadWriteLock
  - 读写锁
description: 使用 ReentrantReadWriteLock 分离读写临界区，掌握锁降级、升级风险、公平策略和读多写少边界。
---

# ReadWriteLock 读写锁

> 版本基线：本文按 JDK 20 的 `java.util.concurrent.locks` API 编写；示例优先使用可直接编译运行的标准库能力。

## 学习目标

- 会用 `ReentrantReadWriteLock` 的读锁和写锁分别保护共享状态。
- 能正确写出写锁降级流程，并解释为什么读锁不能直接升级为写锁。
- 能根据读写比例、临界区长度和公平性要求判断读写锁是否值得使用。

## 核心知识点

### 专业术语

- **ReadWriteLock**：把一个共享资源拆成读锁和写锁的锁协议；多个读者可以并行，写者必须独占。
- **ReentrantReadWriteLock**：JDK 提供的可重入读写锁实现，支持公平/非公平策略以及读写锁的中断、超时获取。
- **读锁（read lock）**：共享锁；持有读锁的线程之间可以并行，但会阻塞写锁。
- **写锁（write lock）**：独占锁；获得写锁后不能再有其他读者或写者进入。
- **锁降级（lock downgrading）**：先持有写锁，再获取读锁，最后释放写锁，让线程继续以读者身份观察状态。
- **锁升级（lock upgrading）**：持有读锁时再申请写锁；`ReentrantReadWriteLock` 不提供安全的直接升级路径。

### 白话解释与边界

把锁想成一间阅览室：读者可以一起看，写作者进来时必须清场。只有在“读操作明显多、读临界区不太短、写操作相对少”的情况下，并发读才可能抵消读写锁本身的管理成本。若读操作只是读取一个字段，普通 `synchronized`、`ReentrantLock` 或不可变快照往往更清晰。

读写锁只保护遵守同一锁协议的访问路径。任何绕过读锁/写锁的直接字段访问，都会破坏这个协议；它也不会自动让多个业务步骤组成事务。锁降级可以保证写入完成后继续读取同一份状态，锁升级则可能因为自己持有读锁而把写者永远挡住。

## 常用用法

### ReentrantReadWriteLock()：创建非公平读写锁

默认构造器适合先验证读多写少的并发模型；非公平策略通常吞吐更高，但不保证等待顺序。

```java
// 说明：ReentrantReadWriteLock()：创建非公平读写锁。
import java.util.concurrent.locks.ReentrantReadWriteLock;

public class ReadWriteLockCreateDemo {
    public static void main(String[] args) {
        var lock = new ReentrantReadWriteLock();
// 初始状态：lock = new ReentrantReadWriteLock()。
// 作用：var lock = new ReentrantReadWriteLock();；创建非公平读写锁。
        System.out.println("fair=" + lock.isFair());
// 输出：fair=false
    }
}
```

默认构造器使用非公平策略，通常吞吐更高，但不承诺严格的先来先得顺序。先用默认策略写出正确的锁协议，再根据等待时间和饥饿证据评估公平锁。

### readLock()：用读锁保护只读临界区

只读临界区需要允许多个线程并行访问时使用读锁；读取必须短小，不能把未知 I/O 长时间放在锁内。

```java
// 说明：readLock()：用读锁保护只读临界区。
import java.util.concurrent.locks.ReentrantReadWriteLock;

public class ReadLockDemo {
    private final ReentrantReadWriteLock lock = new ReentrantReadWriteLock();
// 初始状态：lock = new ReentrantReadWriteLock()。
// 作用：private final ReentrantReadWriteLock lock = new ReentrantReadWriteLock();；用读锁保护只读临界区。
    private int value = 42;
// 初始状态：value = 42。

    int read() {
        lock.readLock().lock();
// 初始状态：lock.readLock().lock()。
// 作用：lock.readLock().lock();；用读锁保护只读临界区。
        try {
            return value;
        } finally {
            lock.readLock().unlock();
// 初始状态：lock.readLock().unlock()。
// 作用：lock.readLock().unlock();；用读锁保护只读临界区。
        }
    }

    public static void main(String[] args) {
        var state = new ReadLockDemo();
// 初始状态：state = new ReadLockDemo()。
// 作用：var state = new ReadLockDemo();；用读锁保护只读临界区。
        System.out.println(state.read());
// 输出：42
    }
}
```

读锁允许多个线程同时读取，但读操作也必须保持短小；如果读取期间还要调用未知代码或执行 I/O，读锁可能长时间阻塞写者。

### writeLock()：用写锁保护独占更新

更新共享状态或维护多个字段不变式时适合使用写锁；成功获取后必须在 `finally` 中释放。

```java
// 说明：writeLock()：用写锁保护独占更新。
import java.util.concurrent.locks.ReentrantReadWriteLock;

public class WriteLockDemo {
    private final ReentrantReadWriteLock lock = new ReentrantReadWriteLock();
// 初始状态：lock = new ReentrantReadWriteLock()。
// 作用：private final ReentrantReadWriteLock lock = new ReentrantReadWriteLock();；用写锁保护独占更新。
    private int value;

    void add(int delta) {
        lock.writeLock().lock();
// 初始状态：lock.writeLock().lock()。
// 作用：lock.writeLock().lock();；用写锁保护独占更新。
        try {
            value += delta;
        } finally {
            lock.writeLock().unlock();
// 初始状态：lock.writeLock().unlock()。
// 作用：lock.writeLock().unlock();；用写锁保护独占更新。
        }
    }

    public static void main(String[] args) {
        var state = new WriteLockDemo();
// 初始状态：state = new WriteLockDemo()。
// 作用：var state = new WriteLockDemo();；用写锁保护独占更新。
        state.add(5);
// 初始状态：state.add(5)。
// 作用：state.add(5);；用写锁保护独占更新。
        System.out.println("updated");
// 输出：updated
    }
}
```

写锁同时排斥读者和其他写者，适合维护多个字段之间的不变式。每次成功获得写锁都要在 `finally` 中释放，不能因为方法提前 `return` 或抛异常而跳过解锁。

### 锁降级：写锁转为读锁

写入后还要继续读取同一份状态时使用锁降级；先取得读锁再释放写锁，避免中间被其他写者插入。

```java
// 说明：锁降级：写锁转为读锁。
import java.util.concurrent.locks.ReentrantReadWriteLock;

public class LockDowngradeDemo {
    private final ReentrantReadWriteLock lock = new ReentrantReadWriteLock();
// 初始状态：lock = new ReentrantReadWriteLock()。
// 作用：private final ReentrantReadWriteLock lock = new ReentrantReadWriteLock();；写锁转为读锁。
    private int version;

    int refreshAndRead() {
        lock.writeLock().lock();
// 初始状态：lock.writeLock().lock()。
// 作用：lock.writeLock().lock();；写锁转为读锁。
        try {
            version++;
            lock.readLock().lock();
// 初始状态：lock.readLock().lock()。
// 作用：lock.readLock().lock();；写锁转为读锁。
        } finally {
            lock.writeLock().unlock();
// 初始状态：lock.writeLock().unlock()。
// 作用：lock.writeLock().unlock();；写锁转为读锁。
        }

        try {
            return version;
        } finally {
            lock.readLock().unlock();
// 初始状态：lock.readLock().unlock()。
// 作用：lock.readLock().unlock();；写锁转为读锁。
        }
    }

    public static void main(String[] args) {
        var state = new LockDowngradeDemo();
// 初始状态：state = new LockDowngradeDemo()。
// 作用：var state = new LockDowngradeDemo();；写锁转为读锁。
        System.out.println(state.refreshAndRead());
// 输出：1
    }
}
```

降级的顺序必须是“先获得读锁，再释放写锁”。这样释放写锁的瞬间，当前线程仍在读锁保护下；若先释放写锁再申请读锁，中间可能被其他写者插入，读到的就不一定是刚刚更新的状态。

### ReentrantReadWriteLock(boolean fair)：创建公平读写锁

等待顺序和饥饿风险需要更可控时选择公平构造器；公平策略会增加排队成本，不能替代超时和取消。

```java
// 说明：ReentrantReadWriteLock(boolean fair)：创建公平读写锁。
import java.util.concurrent.locks.ReentrantReadWriteLock;

public class FairReadWriteLockDemo {
    public static void main(String[] args) {
        var lock = new ReentrantReadWriteLock(true);
// 初始状态：lock = new ReentrantReadWriteLock(true)。
// 作用：var lock = new ReentrantReadWriteLock(true);；创建公平读写锁。
        System.out.println("fair=" + lock.isFair());
// 输出：fair=true
    }
}
```

公平模式倾向于让等待时间更长的线程先获得锁，降低插队机会，但会增加排队成本。公平策略不是严格实时调度，也不能替代合理的超时、取消和临界区设计。

## 不常用但需要知道

### 读锁升级：不要在读锁内直接申请写锁

读操作发现需要更新时不要直接升级；先释放读锁再重新竞争写锁，否则可能因其他读者而永久等待。

```java
import java.util.concurrent.locks.ReentrantReadWriteLock;

public class LockUpgradeRiskDemo {
    public static void main(String[] args) {
        var lock = new ReentrantReadWriteLock();
// 初始状态：lock = new ReentrantReadWriteLock()。
// 作用：var lock = new ReentrantReadWriteLock();；不要在读锁内直接申请写锁。
        lock.readLock().lock();
// 初始状态：lock.readLock().lock()。
// 作用：lock.readLock().lock();；不要在读锁内直接申请写锁。
        try {
            boolean upgraded = lock.writeLock().tryLock();
// 初始状态：upgraded = lock.writeLock().tryLock()。
// 作用：boolean upgraded = lock.writeLock().tryLock();；不要在读锁内直接申请写锁。
            System.out.println("upgraded=" + upgraded);
// 输出：upgraded=false
        } finally {
            lock.readLock().unlock();
// 初始状态：lock.readLock().unlock()。
// 作用：lock.readLock().unlock();；不要在读锁内直接申请写锁。
        }
    }
}
```

读锁升级没有安全的原子操作：当前线程的读锁本身就是写锁必须等待的读者。示例用 `tryLock()` 立即失败来暴露风险；如果改成 `writeLock().lock()`，线程可能一直等自己释放读锁。需要写入时，应先释放读锁、再按固定策略申请写锁，并重新检查条件。

### readLock().tryLock(timeout)：有界等待读锁

调用方不能无限等待读锁时使用带超时的获取；超时后必须走降级、返回或重试策略。

```java
import java.util.concurrent.TimeUnit;
import java.util.concurrent.locks.ReentrantReadWriteLock;

public class ReadLockTimeoutDemo {
    public static void main(String[] args) throws InterruptedException {
        var lock = new ReentrantReadWriteLock();
// 初始状态：lock = new ReentrantReadWriteLock()。
// 作用：var lock = new ReentrantReadWriteLock();；有界等待读锁。
        boolean acquired = lock.readLock().tryLock(1, TimeUnit.MILLISECONDS);
// 初始状态：acquired = lock.readLock().tryLock(1, TimeUnit.MILLISECONDS)。
// 作用：boolean acquired = lock.readLock().tryLock(1, TimeUnit.MILLISECONDS);；有界等待读锁。
        try {
            System.out.println("acquired=" + acquired);
// 输出：acquired=true（没有其他线程持有写锁时）
        } finally {
            if (acquired) {
                lock.readLock().unlock();
// 初始状态：lock.readLock().unlock()。
// 作用：lock.readLock().unlock();；有界等待读锁。
            }
        }
    }
}
```

超时获取让调用方可以选择降级、重试或返回忙碌，而不是无限等待。获取失败时没有持有锁，不能无条件调用 `unlock()`。

### writeLock().lockInterruptibly()：可中断地等待写锁

线程需要响应取消信号时使用可中断的写锁获取；捕获中断异常后应恢复中断状态或向上层传播。

```java
import java.util.concurrent.locks.ReentrantReadWriteLock;

public class WriteLockInterruptibleDemo {
    public static void main(String[] args) throws InterruptedException {
        var lock = new ReentrantReadWriteLock();
// 初始状态：lock = new ReentrantReadWriteLock()。
// 作用：var lock = new ReentrantReadWriteLock();；可中断地等待写锁。
        lock.writeLock().lockInterruptibly();
// 初始状态：lock.writeLock().lockInterruptibly()。
// 作用：lock.writeLock().lockInterruptibly();；可中断地等待写锁。
        try {
            System.out.println("write lock acquired");
// 输出：write lock acquired
        } finally {
            lock.writeLock().unlock();
// 初始状态：lock.writeLock().unlock()。
// 作用：lock.writeLock().unlock();；可中断地等待写锁。
        }
    }
}
```

`ReadLock` 和 `WriteLock` 都实现 `Lock`，因此可使用 `lockInterruptibly()`。捕获 `InterruptedException` 后应由上层决定退出、恢复中断状态或转换为业务异常，不能悄悄吞掉取消信号。

### getReadLockCount()：只用于诊断当前读者数量

需要观测当前读者数量时使用该方法做诊断；返回值是瞬时估计，不能作为业务同步条件。

```java
// 作用：通过 getReadLockCount() 只用于诊断当前读者数量。
import java.util.concurrent.locks.ReentrantReadWriteLock;

public class ReadLockCountDemo {
    public static void main(String[] args) {
        var lock = new ReentrantReadWriteLock();
// 初始状态：lock = new ReentrantReadWriteLock()。
// 作用：var lock = new ReentrantReadWriteLock();；只用于诊断当前读者数量。
        lock.readLock().lock();
// 初始状态：lock.readLock().lock()。
// 作用：lock.readLock().lock();；只用于诊断当前读者数量。
        try {
            System.out.println(lock.getReadLockCount());
// 输出：1
        } finally {
            lock.readLock().unlock();
// 初始状态：lock.readLock().unlock()。
// 作用：lock.readLock().unlock();；只用于诊断当前读者数量。
        }
    }
}
```

`getReadLockCount()` 适合监控和诊断，不应作为业务判断依据；返回值可能在并发环境中随时变化。当前线程自己的重入次数可用 `getReadHoldCount()` 观察，但同样不应代替状态协议。

### readLock().newCondition()：读锁不支持 Condition

需要条件队列时应改用写锁或 `ReentrantLock`；读锁不支持 `newCondition()`，不能把读锁当作条件同步器。

```java
import java.util.concurrent.locks.ReentrantReadWriteLock;

public class ReadLockConditionDemo {
    public static void main(String[] args) {
        var lock = new ReentrantReadWriteLock();
// 初始状态：lock = new ReentrantReadWriteLock()。
// 作用：var lock = new ReentrantReadWriteLock();；读锁不支持 Condition。
        try {
            lock.readLock().newCondition();
// 初始状态：lock.readLock().newCondition()。
// 作用：lock.readLock().newCondition();；读锁不支持 Condition。
        } catch (UnsupportedOperationException ex) {
            System.out.println(ex.getClass().getSimpleName());
// 输出：UnsupportedOperationException
        }
    }
}
```

读锁是共享锁，不能直接建立 `Condition`。需要条件等待时使用写锁的 `newCondition()`，或改用 `ReentrantLock` 的多个条件队列；条件状态必须和写入它的锁保持一致。

## 简单案例

### 读多写少缓存：读写路径分离

缓存命中远多于刷新且读临界区足够长时才考虑读写锁；先用基准确认收益，避免为单字段读取增加复杂度。

```java
import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.locks.ReentrantReadWriteLock;

public class ReadWriteCacheDemo {
    private final Map<String, String> cache = new HashMap<>();
// 初始状态：cache = new HashMap<>()。
// 作用：private final Map<String, String> cache = new HashMap<>();；读写路径分离。
    private final ReentrantReadWriteLock lock = new ReentrantReadWriteLock();
// 初始状态：lock = new ReentrantReadWriteLock()。
// 作用：private final ReentrantReadWriteLock lock = new ReentrantReadWriteLock();；读写路径分离。

    String get(String key) {
        lock.readLock().lock();
// 初始状态：lock.readLock().lock()。
// 作用：lock.readLock().lock();；读写路径分离，返回读取结果。
        try {
            return cache.get(key);
// 初始状态：return cache.get(key)。
// 作用：return cache.get(key);；读写路径分离，返回读取结果。
        } finally {
            lock.readLock().unlock();
// 初始状态：lock.readLock().unlock()。
// 作用：lock.readLock().unlock();；读写路径分离，返回读取结果。
        }
    }

    void put(String key, String value) {
        lock.writeLock().lock();
// 初始状态：lock.writeLock().lock()。
// 作用：lock.writeLock().lock();；读写路径分离。
        try {
            cache.put(key, value);
// 初始状态：cache.put(key, value)。
// 作用：cache.put(key, value);；读写路径分离。
        } finally {
            lock.writeLock().unlock();
// 初始状态：lock.writeLock().unlock()。
// 作用：lock.writeLock().unlock();；读写路径分离。
        }
    }

    public static void main(String[] args) {
        var cache = new ReadWriteCacheDemo();
// 初始状态：cache = new ReadWriteCacheDemo()。
// 作用：var cache = new ReadWriteCacheDemo();；读写路径分离，返回读取结果。
        cache.put("language", "Java");
// 初始状态：cache.put("language", "Java")。
// 作用：cache.put("language", "Java");；读写路径分离。
        System.out.println(cache.get("language"));
// 输出：Java
    }
}
```

这个模板只在读竞争确实存在时才有价值。缓存值若能用不可变对象整体替换，读锁甚至可以被安全发布或并发容器取代，减少锁协议的复杂度。

## 易混点

- 读锁是共享的，但写锁仍然独占；“读读不互斥”不等于“读写不互斥”。
- 锁降级可以先写锁再读锁；读锁升级不能直接 `lock()`，否则可能等待自己释放读锁。
- 公平读写锁只是改变排队倾向，不保证绝对先来先服务，也通常牺牲部分吞吐。
- `readLock().newCondition()` 不受支持；只有写锁可以建立 `Condition`，因为条件等待需要独占地修改状态。
- 读写锁不是读多写少的万能加速器；读临界区很短、写比例高或锁竞争不明显时，普通互斥锁可能更快更简单。
- 读写锁不会保护绕过它的字段访问；所有读写路径必须遵守同一个锁协议。

## 课后小问

1. 为什么锁降级必须先获得读锁，再释放写锁？
答案：这样释放写锁后当前线程仍由读锁保护，不会在写锁和读锁之间暴露空档。
解析：如果先释放写锁再申请读锁，其他写者可能插入并修改状态，当前线程随后读到的就不一定是自己刚写入的版本。

2. 为什么不能在持有读锁时直接申请写锁？
答案：读锁计数还包括当前线程自己，写锁需要等所有读者离开，直接升级可能把自己永久阻塞。
解析：需要升级时应释放读锁、申请写锁并重新检查条件；如果业务经常需要升级，通常应改用写锁或重新设计状态机。

3. 什么时候普通 `synchronized` 可能优于读写锁？
答案：读临界区很短、写操作不少、并发读竞争不明显，或代码更需要简单可靠的锁协议时。
解析：读写锁有额外的读者计数和排队成本，只有基准测试证明并发读收益时才值得引入。

## 本节小结

- `ReentrantReadWriteLock` 用共享读锁和独占写锁表达读写并发边界。
- 写锁降级必须先获得读锁再释放写锁，读锁升级没有安全的直接路径。
- 公平策略可以降低插队机会，但会付出吞吐和排队成本。
- 读写锁只适合经过测量的读多写少场景，短临界区可能用普通互斥锁更合适。

## 快速回顾

- 会用 `readLock()` 和 `writeLock()` 的 `lock/finally/unlock` 模板。
- 能写出“写锁内获取读锁，再释放写锁”的降级流程。
- 能解释读锁升级风险、公平策略和 `Condition` 的边界。
- 会根据读写比例、临界区长度和基准结果决定是否使用读写锁。
