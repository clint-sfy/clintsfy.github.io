---
title: synchronized 互斥锁
date: 2026-09-27T00:00:00.000Z
category: Java基础快速入门
tags:
  - Java
  - synchronized
  - 互斥锁
description: 理解 synchronized 的对象锁、类锁、可重入和 wait/notify 协作方式。
---

# synchronized 互斥锁

## 学习目标

- 区分实例对象锁、类锁和任意锁对象的保护范围。
- 理解 synchronized 的互斥、可见性和可重入语义。
- 使用 wait、notify、notifyAll 编写带条件检查的线程协作代码。

## 核心知识点

### 专业术语

- **监视器（monitor）**：每个 Java 对象关联的互斥入口，synchronized 通过它获得对象锁。
- **对象锁**：锁住某个实例；同一实例的 synchronized 方法/块互斥，不同实例可以并行。
- **类锁**：锁住 `SomeClass.class`，用于保护静态共享状态。
- **可重入（reentrant）**：已经持有锁的线程可以再次获得同一把锁。
- **条件等待**：线程在监视器内用 wait 暂停，条件满足后由其他线程通知。

### 白话解释与边界

synchronized 同时提供互斥和释放/获得锁之间的内存可见性。实例方法锁的是 `this`，静态方法锁的是类对象；两个方法即使都写着 synchronized，只要锁对象不同就不互斥。锁只保护遵守同一锁协议的访问者，不能阻止别人直接改公开字段。

`wait/notify` 必须在持有同一个对象监视器时调用。等待线程醒来后要重新检查条件，通常写成 `while` 而不是 `if`，因为可能出现虚假唤醒或被其他线程先消费条件。

## 常用用法

### synchronized 块：锁住指定对象

使用私有 final 锁对象可以避免外部代码意外锁住或替换锁。

```java
// 说明：两次 increment() 都必须先持有私有 final lock，因此不同线程对 count++ 的读-改-写不会丢失更新。
public class SynchronizedBlockDemo {
    private final Object lock = new Object();
// 初始状态：lock = new Object()。
// 作用：private final Object lock = new Object();；锁住指定对象。
    private int count;

    void increment() {
        synchronized (lock) {
            count++;
        }
    }

    public static void main(String[] args) {
        var counter = new SynchronizedBlockDemo();
// 初始状态：counter = new SynchronizedBlockDemo()。
// 作用：var counter = new SynchronizedBlockDemo();；锁住指定对象。
        counter.increment();
// 初始状态：counter.increment()。
// 作用：counter.increment();；锁住指定对象。
        counter.increment();
// 初始状态：counter.increment()。
// 作用：counter.increment();；锁住指定对象。
        System.out.println(counter.count);
// 输出：2
    }
}
```

临界区只放共享状态读写，不要把未知代码和慢 I/O 放进去。

### synchronized 实例方法：保护对象状态

实例 synchronized 方法锁住当前对象。

```java
// 说明：withdraw() 和 balance() 共用 account 监视器，amount<=balance 的检查与扣减在同一临界区内完成。
public class SynchronizedMethodDemo {
    private int balance = 100;
// 初始状态：balance = 100。

    synchronized void withdraw(int amount) {
        if (amount <= balance) {
            balance -= amount;
        }
    }

    synchronized int balance() {
        return balance;
    }

    public static void main(String[] args) {
        var account = new SynchronizedMethodDemo();
// 初始状态：account = new SynchronizedMethodDemo()。
// 作用：var account = new SynchronizedMethodDemo();；保护对象状态。
        account.withdraw(30);
// 初始状态：account.withdraw(30)。
// 作用：account.withdraw(30);；保护对象状态。
        System.out.println(account.balance());
// 输出：70
    }
}
```

若两个账户对象彼此独立，它们的操作可以并行；若共享转账需要同时保护两个账户，必须规定锁顺序或改用更高层的协调方式。

### synchronized 静态方法：保护类级状态

静态 synchronized 方法锁住 `SynchronizedStaticDemo.class`，所有实例共享这把类锁。

```java
// 说明：record() 每次获取 SynchronizedStaticDemo.class 的监视器，使所有实例对 static created 的递增串行化。
public class SynchronizedStaticDemo {
    private static int created;

    static synchronized void record() {
        created++;
    }

    public static void main(String[] args) {
        record();
        record();
        System.out.println(created);
// 输出：2
    }
}
```

它不会自动和某个实例方法互斥，因为实例方法锁的是 `this`。

### 类锁与对象锁：明确锁的身份

对象锁保护实例状态，类锁保护静态状态；不要只看 synchronized 关键字，要确认实际锁住的是谁。

```java
// 说明：类锁与对象锁：明确锁的身份。
public class ClassAndObjectLockDemo {
    private int value;

    synchronized void instancePart() {
        value++;
    }

    static void classPart() {
        synchronized (ClassAndObjectLockDemo.class) {
            System.out.println("class lock");
// 输出：class lock
        }
    }

    public static void main(String[] args) {
        var demo = new ClassAndObjectLockDemo();
// 初始状态：demo = new ClassAndObjectLockDemo()。
// 作用：var demo = new ClassAndObjectLockDemo();；明确锁的身份。
        demo.instancePart();
// 初始状态：demo.instancePart()。
// 作用：demo.instancePart();；明确锁的身份。
        classPart();
        System.out.println(demo.value);
// 输出：1
    }
}
```

### 可重入：同一线程可以再次获得同一把锁

如果 synchronized 不可重入，outer 调用 inner 会把自己永久阻塞。

```java
// 说明：可重入：同一线程可以再次获得同一把锁。
public class ReentrantMonitorDemo {
    synchronized void outer() {
        inner();
    }

    synchronized void inner() {
        System.out.println("reentered");
// 输出：reentered
    }

    public static void main(String[] args) {
        new ReentrantMonitorDemo().outer();
// 初始状态：new ReentrantMonitorDemo().outer()。
// 作用：new ReentrantMonitorDemo().outer();；同一线程可以再次获得同一把锁。
    }
}
```

可重入不代表锁可以随意嵌套；跨对象嵌套仍可能形成死锁。

### 等待监视器条件：释放锁并广播唤醒

`wait()` 释放当前监视器，醒来后重新竞争锁；`notifyAll()` 只唤醒等待者，并不把锁交给它们。

```java
// 说明：等待监视器条件：释放锁并广播唤醒。
public class WaitNotifyDemo {
    private final Object lock = new Object();
// 初始状态：lock = new Object()。
// 作用：private final Object lock = new Object();；释放锁并广播唤醒。
    private boolean ready;

    void awaitReady() throws InterruptedException {
        synchronized (lock) {
            while (!ready) {
                lock.wait();
// 初始状态：lock.wait()。
// 作用：lock.wait();；释放锁并广播唤醒。
            }
        }
    }

    void markReady() {
        synchronized (lock) {
            ready = true;
// 初始状态：ready = true。
            lock.notifyAll();
// 初始状态：lock.notifyAll()。
// 作用：lock.notifyAll();；释放锁并广播唤醒。
        }
    }

    public static void main(String[] args) throws InterruptedException {
        var state = new WaitNotifyDemo();
// 初始状态：state = new WaitNotifyDemo()。
// 作用：var state = new WaitNotifyDemo();；释放锁并广播唤醒。
        state.markReady();
// 初始状态：state.markReady()。
// 作用：state.markReady();；释放锁并广播唤醒。
        state.awaitReady();
// 初始状态：state.awaitReady()。
// 作用：state.awaitReady();；释放锁并广播唤醒。
        System.out.println("ready");
// 输出：ready
    }
}
```

条件状态必须在同一把锁内读写。

### 唤醒监视器等待者：选择单个或全部通知

多个条件共用一个监视器时优先 `notifyAll()`，让每个线程重新检查自己的条件；只有能证明任意一个等待者都能继续、且误唤醒成本可接受时才用 `notify()`。

```java
// 说明：唤醒监视器等待者：选择单个或全部通知。
public class NotifyChoiceDemo {
    public static void main(String[] args) {
        Object lock = new Object();
// 初始状态：lock = new Object()。
// 作用：Object lock = new Object();；选择单个或全部通知。
        synchronized (lock) {
            lock.notifyAll();
// 初始状态：lock.notifyAll()。
// 作用：lock.notifyAll();；选择单个或全部通知。
            System.out.println("all waiters notified");
// 输出：all waiters notified
        }
    }
}
```
## 不常用但需要知道

### wait(long)：带超时的条件等待

超时返回只说明等待结束，不说明条件已经满足；醒来后仍要在 while 中检查状态。纳秒级重载适合精细超时，但通常要把剩余时间重新计算。

```java
// 作用：通过 wait(long) 带超时的条件等待。
public class TimedWaitDemo {
    public static void main(String[] args) throws InterruptedException {
        Object lock = new Object();
// 初始状态：lock = new Object()。
// 作用：Object lock = new Object();；带超时的条件等待。
        synchronized (lock) {
            long start = System.nanoTime();
// 初始状态：start = System.nanoTime()。
// 作用：long start = System.nanoTime();；带超时的条件等待。
            lock.wait(1);
// 初始状态：lock.wait(1)。
// 作用：lock.wait(1);；带超时的条件等待。
            System.out.println("wait returned=" + (System.nanoTime() >= start));
// 输出：wait returned=true
        }
    }
}
```

### notify：只唤醒一个等待者

`notify()` 不保证唤醒哪个线程，也不保证它能立即获得锁。生产者/消费者通常选择 notifyAll，并让每个醒来的线程重新检查自己的条件。

```java
// 说明：main 线程已持有 lock 才调用 notify()；它最多把一个等待者转为竞争该监视器的状态。
public class NotifyOneDemo {
    public static void main(String[] args) {
        Object lock = new Object();
// 作用：Object lock = new Object();；只唤醒一个等待者。
// 初始状态：lock = new Object()。
        synchronized (lock) {
            lock.notify();
// 初始状态：lock.notify()。
// 作用：lock.notify();；只唤醒一个等待者。
            System.out.println("one waiter may wake");
// 输出：one waiter may wake
        }
    }
}
```

### Object.wait 的非法调用

调用 wait、notify 或 notifyAll 前必须持有对应监视器，否则会抛 IllegalMonitorStateException。这个规则经常在把锁对象和条件对象拆开时被忽略。

```java
// 说明：main 未进入 synchronized(lock) 就调用 lock.wait()，因此当前线程不是监视器所有者并抛出 IllegalMonitorStateException。
public class WaitMonitorRuleDemo {
    public static void main(String[] args) {
        Object lock = new Object();
// 初始状态：lock = new Object()。
// 作用：Object lock = new Object();；Object 返回本次调用的结果。
        try {
            lock.wait();
// 初始状态：lock.wait()。
// 作用：lock.wait();；wait 返回本次调用的结果。
        } catch (InterruptedException ex) {
            Thread.currentThread().interrupt();
// 初始状态：Thread.currentThread().interrupt()。
// 作用：Thread.currentThread().interrupt();；currentThread 返回本次调用的结果。
        } catch (IllegalMonitorStateException ex) {
            System.out.println(ex.getClass().getSimpleName());
// 输出：IllegalMonitorStateException
        }
    }
}
```

### synchronized 与虚拟线程 pinning 边界

在 JDK 20 虚拟线程预览实现中，监视器内的长时间阻塞可能 pin 住载体线程；这不是要求把所有 synchronized 换成 Lock，而是要通过 JFR 定位并缩短临界区。

```java
// 说明：shortWork() 持有 this 监视器期间不做阻塞 I/O；这样虚拟线程能尽快释放监视器及载体。
public class MonitorBlockingBoundaryDemo {
    synchronized void shortWork() {
        System.out.println("keep monitor work short");
// 输出：keep monitor work short
    }

    public static void main(String[] args) {
        new MonitorBlockingBoundaryDemo().shortWork();
// 初始状态：new MonitorBlockingBoundaryDemo().shortWork()。
// 作用：new MonitorBlockingBoundaryDemo().shortWork();；shortWork 返回本次调用的结果。
    }
}
```
## 简单案例

```java
public class SynchronizedStateDemo {
    private int value;

    synchronized void add(int delta) {
        value += delta;
    }

    synchronized int value() {
        return value;
    }

    public static void main(String[] args) {
        var state = new SynchronizedStateDemo();
// 初始状态：state = new SynchronizedStateDemo()。
// 作用：var state = new SynchronizedStateDemo();；SynchronizedStateDemo 返回本次调用的结果。
        state.add(2);
// 初始状态：state.add(2)。
// 作用：state.add(2);；add 返回本次调用的结果。
        state.add(3);
// 初始状态：state.add(3)。
// 作用：state.add(3);；add 返回本次调用的结果。
        System.out.println(state.value());
// 输出：5
    }
}
```

使用同一对象锁保护读写，就能让 `value += delta` 的复合更新保持完整；业务不变式复杂时再考虑 ReentrantLock 和多个 Condition。

## 易混点

- 实例锁是 `this`，类锁是 `Type.class`；二者默认不互斥。
- synchronized 可重入，但“锁住不同对象”的嵌套仍能死锁。
- wait 会释放监视器，sleep 不释放；notify 只是发信号，不会立即交出锁。
- wait 必须在 while 中检查条件，不能用一次 if 判断代替循环。
- 共享字段必须由所有读写路径遵守同一锁协议，否则锁没有保护完整状态。

## 课后小问

1. 为什么 `wait()` 不能写在 `if` 后面直接继续？
答案：线程醒来时条件可能仍不满足，需要重新竞争锁并循环检查。
解析：虚假唤醒、多个消费者争抢以及通知与条件变化之间的时序都要求使用 while。

2. synchronized 静态方法和实例 synchronized 方法会互相阻塞吗？
答案：默认不会，因为前者锁类对象，后者锁实例对象。
解析：只有它们显式使用同一个锁对象时才共享互斥范围。

3. 为什么通常推荐 notifyAll 而不是 notify？
答案：notify 不保证唤醒哪个等待线程，可能唤醒一个当前条件仍不满足的线程。
解析：notifyAll 让所有等待者重新检查条件，代价是可能有更多线程短暂竞争锁。

## 本节小结

- synchronized 用对象监视器同时提供互斥、可见性和可重入。
- 实例方法锁对象，静态方法锁类，代码块可以选择私有 final 锁。
- wait/notify 是条件协作机制，必须持锁并在 while 中反复检查条件。
- 长临界区、锁协议不一致和跨对象嵌套是常见风险；虚拟线程场景还要关注 pinning。

## 快速回顾

- 能说清对象锁、类锁和锁对象的区别。
- 会用 synchronized 保护复合状态更新。
- 会写带 while 条件检查的 wait/notifyAll。
- 能解释 sleep、wait、notify 和 notifyAll 的释放锁与唤醒边界。
