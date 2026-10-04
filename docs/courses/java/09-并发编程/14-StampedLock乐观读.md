---
title: StampedLock 乐观读
date: 2026-09-27T00:00:00.000Z
category: Java基础快速入门
tags:
  - Java
  - StampedLock
  - 乐观读
  - 并发读
description: 掌握 StampedLock 的读写 stamp、乐观读校验和转换锁边界，理解它的非可重入与不可中断特性。
---

# StampedLock 乐观读

> 版本基线：本文按 JDK 20 的 `java.util.concurrent.locks` API 编写；示例优先使用可直接编译运行的标准库能力。

## 学习目标

- 会使用 `writeLock`、`readLock` 和 `tryOptimisticRead` 保护共享状态。
- 能在读取后调用 `validate`，校验失败时回退到真实读锁。
- 理解 `StampedLock` 非可重入、基础阻塞获取的中断边界以及转换锁失败的边界。

## 核心知识点

### 专业术语

- **StampedLock**：用 `long stamp` 代表一次锁定或乐观读凭证的锁工具，支持写锁、读锁和乐观读。
- **stamp**：锁操作返回的凭证；解锁时必须把对应 stamp 传回 `unlockRead` 或 `unlockWrite`。
- **乐观读（optimistic read）**：先不阻塞写者地读取，再用 `validate(stamp)` 检查读取期间是否发生写入。
- **validate**：验证一个乐观读 stamp 在读取期间是否仍然有效；返回 `false` 时不能使用未经保护的快照。
- **锁转换（conversion）**：用 `tryConvertToReadLock`、`tryConvertToWriteLock` 等方法尝试改变当前 stamp 的模式。
- **非可重入（non-reentrant）**：同一线程再次申请同类型锁也不会因为“自己持有”而自动通过。

### 白话解释与边界

`StampedLock` 像是先快速拍一张现场照片：乐观读可以直接读取，最后用 `validate` 确认拍照期间没有写者改动。校验失败就丢弃这次快照，重新拿真正的读锁读取。它适合读多写少、读操作短、冲突不高且基准测试证明有收益的场景，不适合作为所有共享状态的默认锁。

stamp 不是线程身份，也不是可以随意保存和复用的令牌；它只对应一次具体的锁操作。所有真实读写锁都必须在 `finally` 中用正确的 stamp 解锁。`StampedLock` 不可重入，基础的 `readLock()`/`writeLock()` 不响应中断，但也提供 `readLockInterruptibly()`/`writeLockInterruptibly()` 和带超时的获取方法；需要更丰富的条件队列或公平策略时再选择 `ReentrantReadWriteLock`。

## 常用用法

### StampedLock()：创建锁

需要乐观读或锁模式转换时创建 `StampedLock`；先确认业务能接受 stamp 管理、非可重入和无 `Condition` 的边界。

```java
// 说明：StampedLock()：创建锁。
import java.util.concurrent.locks.StampedLock;

public class StampedLockCreateDemo {
    public static void main(String[] args) {
        var lock = new StampedLock();
// 初始状态：lock = new StampedLock()。
// 作用：var lock = new StampedLock();；创建锁。
        System.out.println("created=" + (lock != null));
// 输出：created=true
    }
}
```

`StampedLock` 不接受公平策略参数，也不提供 `Condition`。创建它之前应先确认业务能接受 stamp 管理、非重入和更复杂的异常路径。

### 独占写入：按戳记获得并释放写锁

修改受保护状态时使用写锁；每次成功获取返回的 stamp 都必须在 `finally` 中传给 `unlockWrite`。

```java
// 说明：独占写入：按戳记获得并释放写锁。
import java.util.concurrent.locks.StampedLock;

public class StampedWriteLockDemo {
    private final StampedLock lock = new StampedLock();
// 初始状态：lock = new StampedLock()。
// 作用：private final StampedLock lock = new StampedLock();；按戳记获得并释放写锁。
    private int value;

    void add(int delta) {
        long stamp = lock.writeLock();
// 初始状态：stamp = lock.writeLock()。
// 作用：long stamp = lock.writeLock();；按戳记获得并释放写锁。
        try {
            value += delta;
        } finally {
            lock.unlockWrite(stamp);
// 初始状态：lock.unlockWrite(stamp)。
// 作用：lock.unlockWrite(stamp);；按戳记获得并释放写锁。
        }
    }

    public static void main(String[] args) {
        var state = new StampedWriteLockDemo();
// 初始状态：state = new StampedWriteLockDemo()。
// 作用：var state = new StampedWriteLockDemo();；按戳记获得并释放写锁。
        state.add(3);
// 初始状态：state.add(3)。
// 作用：state.add(3);；按戳记获得并释放写锁。
        System.out.println("write complete");
// 输出：write complete
    }
}
```

写锁排斥所有读锁和其他写锁。不要只保存一个字段级 stamp 供多个方法共用；每次成功的 `writeLock()` 都要由同一套生命周期在 `finally` 中释放。

### 悲观读取：按戳记获得并释放读锁

读取必须在锁保护下保持一致时使用悲观读锁；它允许读者并行，但会阻塞写者。

```java
// 说明：悲观读取：按戳记获得并释放读锁。
import java.util.concurrent.locks.StampedLock;

public class StampedReadLockDemo {
    private final StampedLock lock = new StampedLock();
// 初始状态：lock = new StampedLock()。
// 作用：private final StampedLock lock = new StampedLock();；按戳记获得并释放读锁。
    private int value = 42;
// 初始状态：value = 42。

    int read() {
        long stamp = lock.readLock();
// 初始状态：stamp = lock.readLock()。
// 作用：long stamp = lock.readLock();；按戳记获得并释放读锁。
        try {
            return value;
        } finally {
            lock.unlockRead(stamp);
// 初始状态：lock.unlockRead(stamp)。
// 作用：lock.unlockRead(stamp);；按戳记获得并释放读锁。
        }
    }

    public static void main(String[] args) {
        var state = new StampedReadLockDemo();
// 初始状态：state = new StampedReadLockDemo()。
// 作用：var state = new StampedReadLockDemo();；按戳记获得并释放读锁。
        System.out.println(state.read());
// 输出：42
    }
}
```

悲观读会真正占用读锁，允许多个读者并行但会阻塞写者。无法保证读期间没有写入时，用它比错误地使用乐观读更可靠。

### 乐观读取：复制状态后校验戳记

读多写少且冲突较低时适合使用乐观读；复制字段后必须调用 `validate`，失败就丢弃快照并回退到读锁。

```java
// 说明：乐观读取：复制状态后校验戳记。
import java.util.concurrent.locks.StampedLock;

public class OptimisticReadDemo {
    private final StampedLock lock = new StampedLock();
// 初始状态：lock = new StampedLock()。
// 作用：private final StampedLock lock = new StampedLock();；复制状态后校验戳记。
    private int x = 3;
// 初始状态：x = 3。
    private int y = 4;
// 初始状态：y = 4。

    int distanceSquared() {
        long stamp = lock.tryOptimisticRead();
// 初始状态：stamp = lock.tryOptimisticRead()。
// 作用：long stamp = lock.tryOptimisticRead();；复制状态后校验戳记。
        int localX = x;
// 初始状态：localX = x。
        int localY = y;
// 初始状态：localY = y。
        if (!lock.validate(stamp)) {
            stamp = lock.readLock();
// 初始状态：stamp = lock.readLock()。
// 作用：stamp = lock.readLock();；复制状态后校验戳记。
            try {
                localX = x;
// 初始状态：localX = x。
                localY = y;
// 初始状态：localY = y。
            } finally {
                lock.unlockRead(stamp);
// 初始状态：lock.unlockRead(stamp)。
// 作用：lock.unlockRead(stamp);；复制状态后校验戳记。
            }
        }
        return localX * localX + localY * localY;
    }

    public static void main(String[] args) {
        var point = new OptimisticReadDemo();
// 初始状态：point = new OptimisticReadDemo()。
// 作用：var point = new OptimisticReadDemo();；复制状态后校验戳记。
        System.out.println(point.distanceSquared());
// 输出：25
    }
}
```

乐观读期间读取到的中间值可能不一致，所以必须先把必要字段复制到局部变量，再调用 `validate`；校验失败时丢弃这些局部值并回退到读锁。若读取对象引用指向可变对象，校验成功也不等于对象内部已经不可变，仍需复制快照或使用不可变数据。

### tryOptimisticRead：检查是否有可用的乐观凭证

只想快速探测是否能进行无阻塞读取时使用该方法；stamp 只有通过 `validate` 校验后才可使用。

```java
// 说明：tryOptimisticRead：检查是否有可用的乐观凭证。
import java.util.concurrent.locks.StampedLock;

public class OptimisticStampDemo {
    public static void main(String[] args) {
        var lock = new StampedLock();
// 作用：var lock = new StampedLock();；检查是否有可用的乐观凭证。
// 初始状态：lock = new StampedLock()。
        long stamp = lock.tryOptimisticRead();
// 初始状态：stamp = lock.tryOptimisticRead()。
// 作用：long stamp = lock.tryOptimisticRead();；检查是否有可用的乐观凭证。
        System.out.println("valid=" + lock.validate(stamp));
// 输出：valid=true（校验期间没有写入时）
    }
}
```

`tryOptimisticRead()` 不阻塞，返回的 stamp 可能是无效值或随后失效；只有 `validate` 返回 `true`，并且读取对象本身满足快照要求时，结果才可使用。并发写入时该输出也可能为 `false`。

## 不常用但需要知道

### tryReadLock(timeout)：带超时的真实读锁

不能无限等待读锁时使用带超时的获取；返回零 stamp 时应及时降级或返回，而不是继续解锁无效凭证。

```java
// 作用：通过 tryReadLock(timeout) 带超时的真实读锁。
import java.util.concurrent.TimeUnit;
import java.util.concurrent.locks.StampedLock;

public class StampedReadTimeoutDemo {
    public static void main(String[] args) throws InterruptedException {
        var lock = new StampedLock();
// 初始状态：lock = new StampedLock()。
// 作用：var lock = new StampedLock();；带超时的真实读锁。
        long stamp = lock.tryReadLock(1, TimeUnit.MILLISECONDS);
// 初始状态：stamp = lock.tryReadLock(1, TimeUnit.MILLISECONDS)。
// 作用：long stamp = lock.tryReadLock(1, TimeUnit.MILLISECONDS);；带超时的真实读锁。
        System.out.println("stampAvailable=" + (stamp != 0L));
// 输出：stampAvailable=true（没有写者占用时）
        if (stamp != 0L) {
            lock.unlockRead(stamp);
// 初始状态：lock.unlockRead(stamp)。
// 作用：lock.unlockRead(stamp);；带超时的真实读锁。
        }
    }
}
```

带超时的获取方法适合设置取消和降级边界。返回 `0L` 表示没有获得锁，此时不能调用 `unlockRead(0L)`；并发竞争下输出可能是 `false`。

### tryWriteLock(timeout)：可被中断的有界写锁等待

写锁等待需要时间上限且可响应中断时使用该方法；成功后仍要在 `finally` 中释放对应 stamp。

```java
// 作用：通过 tryWriteLock(timeout) 可被中断的有界写锁等待。
import java.util.concurrent.TimeUnit;
import java.util.concurrent.locks.StampedLock;

public class StampedWriteTimeoutDemo {
    public static void main(String[] args) throws InterruptedException {
        var lock = new StampedLock();
// 初始状态：lock = new StampedLock()。
// 作用：var lock = new StampedLock();；可被中断的有界写锁等待。
        long stamp = lock.tryWriteLock(1, TimeUnit.MILLISECONDS);
// 初始状态：stamp = lock.tryWriteLock(1, TimeUnit.MILLISECONDS)。
// 作用：long stamp = lock.tryWriteLock(1, TimeUnit.MILLISECONDS);；可被中断的有界写锁等待。
        System.out.println("stampAvailable=" + (stamp != 0L));
// 输出：stampAvailable=true（没有读者或写者占用时）
        if (stamp != 0L) {
            lock.unlockWrite(stamp);
// 初始状态：lock.unlockWrite(stamp)。
// 作用：lock.unlockWrite(stamp);；可被中断的有界写锁等待。
        }
    }
}
```

`tryWriteLock(timeout, unit)` 的超时重载可以响应中断，是阻塞式 `writeLock()` 的取消替代方案。超时后要有明确的降级或失败策略，不要把 `0L` 当作有效 stamp。

### 可中断地获取锁：按访问模式选择读锁或写锁

线程需要响应取消而又必须拿真实读写锁时使用可中断版本；处理中断异常时要恢复状态或传播取消。

```java
import java.util.concurrent.locks.StampedLock;

public class StampedInterruptibleLockDemo {
    public static void main(String[] args) throws InterruptedException {
        var lock = new StampedLock();
// 初始状态：lock = new StampedLock()。
// 作用：var lock = new StampedLock();；按访问模式选择读锁或写锁。
        long stamp = lock.writeLockInterruptibly();
// 初始状态：stamp = lock.writeLockInterruptibly()。
// 作用：long stamp = lock.writeLockInterruptibly();；按访问模式选择读锁或写锁。
        try {
            System.out.println("interruptible write acquired");
// 输出：interruptible write acquired
        } finally {
            lock.unlockWrite(stamp);
// 初始状态：lock.unlockWrite(stamp)。
// 作用：lock.unlockWrite(stamp);；按访问模式选择读锁或写锁。
        }
    }
}
```

基础 `readLock()`/`writeLock()` 在等待时不会因为中断而抛出异常；`readLockInterruptibly()` 和 `writeLockInterruptibly()` 则会响应中断。两组方法都返回 stamp，成功后仍必须在 `finally` 中用对应的 `unlockRead` 或 `unlockWrite` 释放。

### tryConvertToWriteLock(stamp)：尝试读锁转写锁

已持有读 stamp 且希望原子升级时可以尝试转换；转换返回零表示失败，不能假设升级一定成功。

```java
// 作用：通过 tryConvertToWriteLock(stamp) 尝试读锁转写锁。
import java.util.concurrent.locks.StampedLock;

public class StampedConvertWriteDemo {
    private final StampedLock lock = new StampedLock();
// 初始状态：lock = new StampedLock()。
// 作用：private final StampedLock lock = new StampedLock();；尝试读锁转写锁。
    private int value;

    void increment() {
        long stamp = lock.readLock();
// 初始状态：stamp = lock.readLock()。
// 作用：long stamp = lock.readLock();；尝试读锁转写锁。
        try {
            long converted = lock.tryConvertToWriteLock(stamp);
// 初始状态：converted = lock.tryConvertToWriteLock(stamp)。
// 作用：long converted = lock.tryConvertToWriteLock(stamp);；尝试读锁转写锁。
            if (converted != 0L) {
                stamp = converted;
// 初始状态：stamp = converted。
                value++;
                System.out.println("converted=true");
// 输出：converted=true
                lock.unlockWrite(stamp);
// 初始状态：lock.unlockWrite(stamp)。
// 作用：lock.unlockWrite(stamp);；尝试读锁转写锁。
                stamp = 0L;
// 初始状态：stamp = 0L。
            } else {
                lock.unlockRead(stamp);
// 初始状态：lock.unlockRead(stamp)。
// 作用：lock.unlockRead(stamp);；尝试读锁转写锁。
                stamp = 0L;
// 初始状态：stamp = 0L。
                long writeStamp = lock.writeLock();
// 初始状态：writeStamp = lock.writeLock()。
// 作用：long writeStamp = lock.writeLock();；尝试读锁转写锁。
                try {
                    value++;
                    System.out.println("converted=false, write acquired");
// 输出：converted=false, write acquired
                } finally {
                    lock.unlockWrite(writeStamp);
// 初始状态：lock.unlockWrite(writeStamp)。
// 作用：lock.unlockWrite(writeStamp);；尝试读锁转写锁。
                }
            }
        } finally {
            if (stamp != 0L) {
                lock.unlockRead(stamp);
// 初始状态：lock.unlockRead(stamp)。
// 作用：lock.unlockRead(stamp);；尝试读锁转写锁。
            }
        }
    }

    public static void main(String[] args) {
        new StampedConvertWriteDemo().increment();
// 初始状态：new StampedConvertWriteDemo().increment()。
// 作用：new StampedConvertWriteDemo().increment();；尝试读锁转写锁。
    }
}
```

转换只是一次尝试，不保证成功；失败后必须释放旧的读锁，再申请写锁，并重新检查业务条件。示例在转换成功时用 `unlockWrite`，在失败路径中先 `unlockRead`，不能把同一个 stamp 无条件交给某一种解锁方法。

### tryConvertToReadLock(stamp)：写锁降级为读锁

写入完成后还需保持读保护时使用转换降级；转换成功后要用新的读 stamp 解锁，失败则继续使用旧模式。

```java
// 作用：通过 tryConvertToReadLock(stamp) 写锁降级为读锁。
import java.util.concurrent.locks.StampedLock;

public class StampedConvertReadDemo {
    public static void main(String[] args) {
        var lock = new StampedLock();
// 初始状态：lock = new StampedLock()。
// 作用：var lock = new StampedLock();；写锁降级为读锁。
        long stamp = lock.writeLock();
// 初始状态：stamp = lock.writeLock()。
// 作用：long stamp = lock.writeLock();；写锁降级为读锁。
        try {
            long readStamp = lock.tryConvertToReadLock(stamp);
// 初始状态：readStamp = lock.tryConvertToReadLock(stamp)。
// 作用：long readStamp = lock.tryConvertToReadLock(stamp);；写锁降级为读锁。
            if (readStamp != 0L) {
                stamp = readStamp;
// 初始状态：stamp = readStamp。
                System.out.println("downgraded=true");
// 输出：downgraded=true
                lock.unlockRead(stamp);
// 初始状态：lock.unlockRead(stamp)。
// 作用：lock.unlockRead(stamp);；写锁降级为读锁。
                stamp = 0L;
// 初始状态：stamp = 0L。
            } else {
                System.out.println("downgraded=false");
// 输出：downgraded=false
                lock.unlockWrite(stamp);
// 初始状态：lock.unlockWrite(stamp)。
// 作用：lock.unlockWrite(stamp);；写锁降级为读锁。
                stamp = 0L;
// 初始状态：stamp = 0L。
            }
        } finally {
            if (stamp != 0L) {
                lock.unlockWrite(stamp);
// 初始状态：lock.unlockWrite(stamp)。
// 作用：lock.unlockWrite(stamp);；写锁降级为读锁。
            }
        }
    }
}
```

从写锁转换为读锁通常比释放再重新获取更连续，但转换仍可能失败。成功后 stamp 已变成读锁凭证，必须使用 `unlockRead`；失败时原写锁仍由当前线程持有。

### 非可重入：同一线程不能重复获得写锁

同一线程需要多层调用时不要把 `StampedLock` 当可重入锁；重复获取可能阻塞，应改用显式协议或 `ReentrantLock`。

```java
import java.util.concurrent.locks.StampedLock;

public class StampedNonReentrantDemo {
    public static void main(String[] args) {
        var lock = new StampedLock();
// 初始状态：lock = new StampedLock()。
// 作用：var lock = new StampedLock();；同一线程不能重复获得写锁。
        long stamp = lock.writeLock();
// 初始状态：stamp = lock.writeLock()。
// 作用：long stamp = lock.writeLock();；同一线程不能重复获得写锁。
        try {
            long nested = lock.tryWriteLock();
// 初始状态：nested = lock.tryWriteLock()。
// 作用：long nested = lock.tryWriteLock();；同一线程不能重复获得写锁。
            System.out.println("reentered=" + (nested != 0L));
// 输出：reentered=false
            if (nested != 0L) {
                lock.unlockWrite(nested);
// 初始状态：lock.unlockWrite(nested)。
// 作用：lock.unlockWrite(nested);；同一线程不能重复获得写锁。
            }
        } finally {
            lock.unlockWrite(stamp);
// 初始状态：lock.unlockWrite(stamp)。
// 作用：lock.unlockWrite(stamp);；同一线程不能重复获得写锁。
        }
    }
}
```

`tryWriteLock()` 在当前线程已经持有写锁时不会像 `ReentrantLock` 一样自动成功；如果把它换成阻塞式 `writeLock()`，同一线程可能永久等待。嵌套调用前必须重新设计锁边界，或改用可重入锁。

### tryWriteLock(timeout)：用超时获取响应中断

需要同时限制等待时间并观察中断时使用超时获取；失败和中断都必须明确返回、重试或取消路径。

```java
// 作用：通过 tryWriteLock(timeout) 用超时获取响应中断。
import java.util.concurrent.TimeUnit;
import java.util.concurrent.locks.StampedLock;

public class StampedInterruptBoundaryDemo {
    public static void main(String[] args) {
        var lock = new StampedLock();
// 初始状态：lock = new StampedLock()。
// 作用：var lock = new StampedLock();；用超时获取响应中断。
        Thread.currentThread().interrupt();
// 初始状态：Thread.currentThread().interrupt()。
// 作用：Thread.currentThread().interrupt();；用超时获取响应中断。
        try {
            lock.tryWriteLock(1, TimeUnit.MILLISECONDS);
// 初始状态：lock.tryWriteLock(1, TimeUnit.MILLISECONDS)。
// 作用：lock.tryWriteLock(1, TimeUnit.MILLISECONDS);；用超时获取响应中断。
            System.out.println("not interrupted");
// 输出：不会执行到这里
        } catch (InterruptedException ex) {
            System.out.println("interrupted");
// 输出：interrupted
        } finally {
            Thread.interrupted();
// 初始状态：Thread.interrupted()。
// 作用：Thread.interrupted();；用超时获取响应中断。
        }
    }
}
```

基础阻塞式 `readLock()` 和 `writeLock()` 不响应中断；`readLockInterruptibly()`、`writeLockInterruptibly()` 以及带时间参数的获取方法可以在等待期间响应中断。若业务经常依赖多个条件队列或公平策略，`ReentrantReadWriteLock` 往往更合适。

## 简单案例

### 坐标快照：乐观读失败后回退

```java
import java.util.concurrent.locks.StampedLock;

public class PointSnapshotDemo {
    private final StampedLock lock = new StampedLock();
// 初始状态：lock = new StampedLock()。
// 作用：private final StampedLock lock = new StampedLock();；乐观读失败后回退。
    private int x;
    private int y;

    void move(int deltaX, int deltaY) {
        long stamp = lock.writeLock();
// 初始状态：stamp = lock.writeLock()。
// 作用：long stamp = lock.writeLock();；乐观读失败后回退。
        try {
            x += deltaX;
            y += deltaY;
        } finally {
            lock.unlockWrite(stamp);
// 初始状态：lock.unlockWrite(stamp)。
// 作用：lock.unlockWrite(stamp);；乐观读失败后回退。
        }
    }

    String snapshot() {
        long stamp = lock.tryOptimisticRead();
// 初始状态：stamp = lock.tryOptimisticRead()。
// 作用：long stamp = lock.tryOptimisticRead();；乐观读失败后回退。
        int localX = x;
// 初始状态：localX = x。
        int localY = y;
// 初始状态：localY = y。
        if (!lock.validate(stamp)) {
            stamp = lock.readLock();
// 初始状态：stamp = lock.readLock()。
// 作用：stamp = lock.readLock();；乐观读失败后回退。
            try {
                localX = x;
// 初始状态：localX = x。
                localY = y;
// 初始状态：localY = y。
            } finally {
                lock.unlockRead(stamp);
// 初始状态：lock.unlockRead(stamp)。
// 作用：lock.unlockRead(stamp);；乐观读失败后回退。
            }
        }
        return "(" + localX + "," + localY + ")";
    }

    public static void main(String[] args) {
        var point = new PointSnapshotDemo();
// 初始状态：point = new PointSnapshotDemo()。
// 作用：var point = new PointSnapshotDemo();；乐观读失败后回退。
        point.move(2, 3);
// 初始状态：point.move(2, 3)。
// 作用：point.move(2, 3);；乐观读失败后回退。
        System.out.println(point.snapshot());
// 输出：(2,3)
    }
}
```

示例读取的是两个基本类型并在校验后一起返回，适合说明乐观读的快照边界。真实业务中如果快照包含集合、数组或可变对象，应在写锁下复制为不可变结果，不能只校验一个引用。

## 易混点

- `tryOptimisticRead()` 不代表已经获得读锁；必须读取局部快照并调用 `validate`，失败就回退。
- stamp 不是锁对象也不是线程所有权；真实读锁用 `unlockRead`，写锁用 `unlockWrite`，不能混用。
- `StampedLock` 不可重入；同一线程重复申请写锁不会像 `ReentrantLock` 一样自动成功。
- `readLock()` 和 `writeLock()` 的基础阻塞获取不响应中断；需要取消时可用 `readLockInterruptibly()`、`writeLockInterruptibly()` 或带超时的获取方法。
- 转换方法返回 `0L` 表示失败，失败后旧锁仍可能由当前线程持有，必须按对应模式解锁再重新获取。
- `StampedLock` 没有 `Condition`，也不保证公平；不要为了“乐观读”而牺牲可维护性。

## 课后小问

1. 为什么乐观读必须在读取后调用 `validate`？
答案：读取期间可能有写者修改共享状态，只有校验成功才能说明这次局部快照没有被写入打断。
解析：即使两个字段都读到了，写入也可能发生在两个读取动作之间；校验失败时必须丢弃局部值并用真实读锁重读。

2. `StampedLock` 为什么不能直接当作 `ReentrantLock` 使用？
答案：它不是可重入的 `Lock` 实现，基础阻塞获取不响应中断，也没有 `Condition`；它还要求调用者管理 stamp。
解析：它虽然提供 `readLockInterruptibly()`、`writeLockInterruptibly()` 和超时重载，但这些能力仍比 `ReentrantLock` 更分散。若业务需要可重入、条件队列或统一的中断等待，应选择其他锁。

3. `tryConvertToWriteLock` 返回 `0L` 后应该怎么做？
答案：按当前 stamp 解锁旧模式，重新申请写锁，并重新检查需要更新的条件。
解析：转换是一次无阻塞尝试，不成功并不表示业务条件已经失效，也不能把 `0L` 传给 `unlockWrite`。

## 本节小结

- `StampedLock` 通过 stamp 区分写锁、悲观读锁和乐观读凭证。
- 乐观读必须复制局部快照并用 `validate` 校验，失败后回退到真实读锁。
- 转换锁是尝试而非保证；每条路径都要按实际模式在 `finally` 中解锁。
- 非可重入、基础获取不响应中断和无 Condition 是重要边界，读多写少的收益必须用基准证明。

## 快速回顾

- 会写 `writeLock/readLock` 与对应 `unlock(stamp)` 的模板。
- 能用 `tryOptimisticRead`、局部快照和 `validate` 完成安全乐观读。
- 能解释转换失败、stamp 为零、非可重入和不可中断的含义。
- 知道什么时候应放弃 StampedLock，改用更直观的可重入读写锁或不可变快照。
