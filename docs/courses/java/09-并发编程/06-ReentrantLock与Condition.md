---
title: ReentrantLock 与 Condition
date: 2026-09-27T00:00:00.000Z
category: Java基础快速入门
tags:
  - Java
  - ReentrantLock
  - Condition
description: 使用 ReentrantLock 的超时、可中断、公平锁和 Condition 条件队列设计显式锁协作。
---

# ReentrantLock 与 Condition

## 学习目标

- 正确掌握 `lock`、`unlock`、`tryLock` 和 `lockInterruptibly` 的生命周期。
- 使用 Condition 把不同等待条件分到不同队列。
- 知道公平锁、读写锁和 StampedLock 的选择边界。

## 核心知识点

### 专业术语

- **ReentrantLock**：可重入的显式互斥锁，提供 synchronized 没有的可中断、超时和公平选项。
- **Condition**：绑定到 Lock 的条件队列，作用类似 wait/notify，但可为不同条件分别建队列。
- **公平锁（fair lock）**：倾向按等待时间顺序授予锁，减少插队但通常吞吐更低。
- **ReadWriteLock**：把读锁和写锁分开，允许多个读者并行、写者独占。
- **StampedLock**：支持乐观读的低频锁工具，不可重入。

### 白话解释与边界

显式锁的能力更强，责任也更大：成功获得锁后必须在 finally 中解锁；等待、超时和异常路径都要设计。Condition 的 await 会释放绑定的 Lock，signal 只是唤醒候选线程，线程仍需重新获得锁并检查条件。

公平锁不是“绝对没有饥饿”的性能保证；大多数短临界区先用默认非公平锁，只有调度体验和尾延迟有证据时才选择公平策略。

## 常用用法

### 使用显式锁：获得后在 `finally` 释放

`lock()` 返回后代表当前线程已经持有锁；即使临界区抛异常也必须释放。

```java
// 说明：使用显式锁：获得后在 finally 释放。
import java.util.concurrent.locks.ReentrantLock;

public class LockFinallyDemo {
    public static void main(String[] args) {
        ReentrantLock lock = new ReentrantLock();
        lock.lock();
        try {
            System.out.println("inside lock");
            // 输出：inside lock
        } finally {
            lock.unlock();
        }
    }
}
```

不要把 unlock 放在可能未成功加锁的路径上。

### tryLock：有界地尝试获得锁

tryLock 能避免无限等待，适合降级、重试或按锁顺序获取；超时分支必须有业务策略，不能静默丢请求。

```java
// 说明：tryLock：有界地尝试获得锁。
import java.util.concurrent.TimeUnit;
import java.util.concurrent.locks.ReentrantLock;

public class TryLockDemo {
    public static void main(String[] args) throws InterruptedException {
        ReentrantLock lock = new ReentrantLock();
        if (lock.tryLock(10, TimeUnit.MILLISECONDS)) {
            try {
                System.out.println("acquired");
                // 输出：acquired
            } finally {
                lock.unlock();
            }
        } else {
            System.out.println("busy");
            // 输出：可能是 busy（如果超时未获得）
        }
    }
}
```

### lockInterruptibly：可响应中断地等待锁

与不可中断的 `lock()` 相比，它允许上层取消等待；捕获 InterruptedException 后应决定退出、恢复中断或转成业务异常。

```java
// 说明：lockInterruptibly：可响应中断地等待锁。
import java.util.concurrent.locks.ReentrantLock;

public class InterruptibleLockDemo {
    public static void main(String[] args) throws InterruptedException {
        ReentrantLock lock = new ReentrantLock();
        lock.lockInterruptibly();
        try {
            System.out.println("interruptible lock");
            // 输出：interruptible lock
        } finally {
            lock.unlock();
        }
    }
}
```

### 等待锁条件：释放锁并广播唤醒

await 必须在持有绑定 Lock 时调用；醒来后要 while 检查条件。

```java
// 说明：等待锁条件：释放锁并广播唤醒。
import java.util.concurrent.locks.Condition;
import java.util.concurrent.locks.ReentrantLock;

public class ConditionDemo {
    private final ReentrantLock lock = new ReentrantLock();
    private final Condition ready = lock.newCondition();
    private boolean available;

    void awaitReady() throws InterruptedException {
        lock.lock();
        try {
            while (!available) {
                ready.await();
            }
        } finally {
            lock.unlock();
        }
    }

    void markReady() {
        lock.lock();
        try {
            available = true;
            ready.signalAll();
        } finally {
            lock.unlock();
        }
    }

    public static void main(String[] args) throws InterruptedException {
        var state = new ConditionDemo();
        state.markReady();
        state.awaitReady();
        System.out.println("ready");
        // 输出：ready
    }
}
```

多个 Condition 可以分别表示 notEmpty、notFull 等状态，减少无关线程唤醒。

### ReentrantLock(boolean fair)：创建公平锁

公平锁减少插队机会，但会增加排队和调度成本；默认非公平锁往往吞吐更好，先用指标证明需要公平性。

```java
// 说明：ReentrantLock(boolean fair)：创建公平锁。
import java.util.concurrent.locks.ReentrantLock;

public class FairLockDemo {
    public static void main(String[] args) {
        ReentrantLock fair = new ReentrantLock(true);
        fair.lock();
        try {
            System.out.println("fair lock configured=" + fair.isFair());
            // 输出：fair lock configured=true
        } finally {
            fair.unlock();
        }
    }
}
```

### getHoldCount：查看当前线程的重入次数

重入次数只用于诊断或断言，不能作为业务状态。

```java
// 说明：getHoldCount：查看当前线程的重入次数。
import java.util.concurrent.locks.ReentrantLock;

public class HoldCountDemo {
    public static void main(String[] args) {
        ReentrantLock lock = new ReentrantLock();
        lock.lock();
        try {
            lock.lock();
            try {
                System.out.println(lock.getHoldCount());
                // 输出：2
            } finally {
                lock.unlock();
            }
        } finally {
            lock.unlock();
        }
    }
}
```

每次成功 lock 都必须对应一次 unlock。
## 不常用但需要知道

### Condition.awaitNanos：带剩余时间的等待

超时等待可能被提前 signal 或中断，返回值只是剩余时间提示。业务条件仍需要在循环中检查，不应只依据返回值判定成功。

```java
// 作用：通过 Condition.awaitNanos 带剩余时间的等待。
import java.util.concurrent.TimeUnit;
import java.util.concurrent.locks.ReentrantLock;

public class ConditionTimeoutDemo {
    public static void main(String[] args) throws InterruptedException {
        var lock = new ReentrantLock();
        var condition = lock.newCondition();
        lock.lock();
        try {
            long remaining = condition.awaitNanos(TimeUnit.MILLISECONDS.toNanos(1));
            System.out.println("timed wait finished=" + (remaining <= 0));
            // 输出：通常是 timed wait finished=true；也可能是 false（提前唤醒）
        } finally {
            lock.unlock();
        }
    }
}
```

### ReentrantReadWriteLock：读写锁

读锁并行不等于一定更快；写频繁、读临界区很短或升级路径复杂时，普通锁可能更清晰。不要在持有读锁时直接申请写锁形成升级死锁。

```java
// 说明：当前线程获得 lock.readLock() 后只读共享快照，finally 释放读锁，避免后续写线程一直被阻塞。
import java.util.concurrent.locks.ReentrantReadWriteLock;

public class ReadWriteLockLowFrequencyDemo {
    public static void main(String[] args) {
        var lock = new ReentrantReadWriteLock();
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

### StampedLock：乐观读并校验

StampedLock 不可重入，乐观读必须 validate，失败后回退到读锁。只有读多写少且基准显示收益时才使用。

```java
// 说明：tryOptimisticRead() 产生 stamp；若 validate(stamp) 发现期间有写锁，就持有 readLock 重读 result。
import java.util.concurrent.locks.StampedLock;

public class StampedLockLowFrequencyDemo {
    public static void main(String[] args) {
        StampedLock lock = new StampedLock();
        long stamp = lock.tryOptimisticRead();
        int result = 7;
        if (!lock.validate(stamp)) {
            stamp = lock.readLock();
            try {
                result = 7;
            } finally {
                lock.unlockRead(stamp);
            }
        }
        System.out.println(result);
        // 输出：7
    }
}
```
## 简单案例

```java
import java.util.concurrent.locks.ReentrantLock;

public class LockCounterDemo {
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

    int count() {
        lock.lock();
        try {
            return count;
        } finally {
            lock.unlock();
        }
    }

    public static void main(String[] args) {
        var counter = new LockCounterDemo();
        counter.increment();
        counter.increment();
        System.out.println(counter.count());
        // 输出：2
    }
}
```

把每次成功的 lock 放在 try 之前、unlock 放在 finally 中，是显式锁最重要的固定模板。

## 易混点

- `tryLock` 返回 false 时没有持锁，不能无条件 unlock。
- Condition 属于某个 Lock；await、signal 和 signalAll 都必须在持有该 Lock 时调用。
- `signal()` 只是通知，不代表条件成立，也不保证被唤醒线程马上运行。
- 公平锁只改变获取策略，不修复临界区过大、锁顺序错误或外部 I/O 阻塞。
- StampedLock 不可重入，读锁升级和乐观读校验都比 ReentrantLock 更容易误用。

## 课后小问

1. 为什么 unlock 必须写在 finally？
答案：临界区任何 return 或异常都不能跳过释放，否则后续线程可能永久阻塞。
解析：只有成功获得锁后才进入 try；tryLock 失败不能执行对应 unlock。

2. Condition.signal 后被唤醒的线程会立即执行吗？
答案：不会，它还要重新获得关联的 Lock，并且重新检查等待条件。
解析：signal 只把线程从条件队列移到竞争队列，锁的所有权仍由当前线程持有到退出临界区。

3. 公平锁一定比非公平锁更好吗？
答案：不一定，公平性通常降低吞吐，只有饥饿或尾延迟目标明确时才值得付成本。
解析：先用压测观察排队、吞吐和延迟，再选择公平参数。

## 本节小结

- ReentrantLock 提供显式解锁、可中断、超时和公平策略。
- Condition 用独立条件队列实现生产/消费等等待协议，必须 while 检查状态。
- 读写锁和 StampedLock 是低频优化工具，先验证读写比例与性能收益。
- tryLock、超时和锁顺序可以减少无限等待，但都需要明确失败策略。

## 快速回顾

- 会写 lock/try/finally/unlock 模板。
- 能区分 tryLock、lockInterruptibly 和 lock 的等待语义。
- 会使用 Condition.await/signalAll 协调条件状态。
- 知道公平锁、读写锁和 StampedLock 的适用边界。
