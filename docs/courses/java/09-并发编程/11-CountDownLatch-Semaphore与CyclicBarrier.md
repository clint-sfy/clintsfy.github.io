---
title: CountDownLatch、Semaphore 与 CyclicBarrier
date: 2026-09-27
category: Java基础快速入门
tags:
  - Java
  - CountDownLatch
  - Semaphore
  - CyclicBarrier
description: 按一次性等待、并发名额和重复阶段选择常用同步器，并了解 Phaser 的低频边界。
---

# CountDownLatch、Semaphore 与 CyclicBarrier

## 学习目标

- 区分 CountDownLatch、Semaphore 和 CyclicBarrier 的语义与生命周期。
- 使用同步器处理初始化、限流、阶段汇合和资源归还。
- 知道 Phaser、Exchanger 等低频同步器何时才值得使用。

## 核心知识点

### 专业术语

- **CountDownLatch**：计数归零后永久放行的“一次性门闩”。
- **Semaphore**：维护许可证数量的同步器，用于并发名额和资源池。
- **CyclicBarrier**：一组参与者反复到达同一个阶段后一起放行的循环屏障。
- **Phaser**：支持动态参与者和多阶段推进的可变屏障。
- **Exchanger**：两个线程在交汇点交换对象的同步点。

### 白话解释与边界

CountDownLatch 是“等别人完成一次”，Semaphore 是“同时最多允许 N 个”，CyclicBarrier 是“大家到齐后一起出发”。不要用 latch 代替循环屏障，也不要用 Semaphore 模拟业务完成通知而忘记 release。

await 类方法可被中断或超时，返回后必须检查业务条件。同步器是协作机制，不会自动取消线程、回滚已完成工作或释放外部连接。

## 常用用法

### CountDownLatch.await/countDown：等待初始化

```java
import java.util.concurrent.CountDownLatch;

public class LatchInitDemo {
    public static void main(String[] args) throws InterruptedException {
        CountDownLatch latch = new CountDownLatch(2);
        latch.countDown();
        latch.countDown();
        latch.await();
        System.out.println("started");
        // 输出：started
    }
}
```

计数归零后所有 await 都会通过，之后新增的 await 也会立即通过；它不能 reset。计数必须与实际参与者数量匹配，漏掉 countDown 会让等待永久阻塞。

### CountDownLatch.await(timeout)：有界等待

```java
import java.util.concurrent.CountDownLatch;
import java.util.concurrent.TimeUnit;

public class LatchTimeoutDemo {
    public static void main(String[] args) throws InterruptedException {
        CountDownLatch latch = new CountDownLatch(1);
        boolean ready = latch.await(1, TimeUnit.MILLISECONDS);
        System.out.println("ready=" + ready);
        // 输出：ready=false
    }
}
```

超时返回 false 表示门闩尚未归零；调用方应选择降级、重试或终止，而不是假设初始化成功。

### Semaphore.acquire/release：限制并发名额

```java
import java.util.concurrent.Semaphore;

public class SemaphoreDemo {
    public static void main(String[] args) throws InterruptedException {
        Semaphore semaphore = new Semaphore(1);
        semaphore.acquire();
        try {
            System.out.println("permit acquired");
            // 输出：permit acquired
        } finally {
            semaphore.release();
        }
    }
}
```

许可证不是线程所有权锁，任意线程都可以 release；这既方便资源归还，也意味着必须由业务保证 release 次数和所有权协议。

### Semaphore.tryAcquire：拒绝或降级

```java
import java.util.concurrent.Semaphore;

public class SemaphoreTryDemo {
    public static void main(String[] args) {
        Semaphore semaphore = new Semaphore(1);
        if (semaphore.tryAcquire()) {
            try {
                System.out.println("accepted");
                // 输出：accepted
            } finally {
                semaphore.release();
            }
        } else {
            System.out.println("busy");
            // 输出：可能是 busy（如果没有及时获得许可证）
        }
    }
}
```

tryAcquire 不等待，适合快速失败；带超时版本允许有限等待。失败分支要明确返回、排队或降级，不能静默丢掉请求。

### CyclicBarrier.await：阶段汇合

```java
import java.util.concurrent.CyclicBarrier;

public class BarrierDemo {
    public static void main(String[] args) throws Exception {
        CyclicBarrier barrier = new CyclicBarrier(1,
                () -> {
                    System.out.println("phase complete");
                    // 输出：phase complete
                });
        barrier.await();
    }
}
```

参与者全部 await 后屏障动作执行一次并放行；通过后 barrier 可以再次使用。真实多线程场景中一个参与者异常或超时会让屏障破坏，其他参与者应处理 BrokenBarrierException。

### CyclicBarrier.reset：重置破坏的屏障

```java
import java.util.concurrent.CyclicBarrier;

public class BarrierResetDemo {
    public static void main(String[] args) {
        CyclicBarrier barrier = new CyclicBarrier(2);
        barrier.reset();
        System.out.println("parties=" + barrier.getParties());
        // 输出：parties=2
    }
}
```

reset 会让当前 generation 失效，正在等待的线程可能收到 BrokenBarrierException。不要在不清楚参与者状态时随意 reset，最好让整个阶段以失败结束再重新创建。

## 不常用但需要知道

### Phaser：动态注册与多阶段

```java
import java.util.concurrent.Phaser;

public class PhaserDemo {
    public static void main(String[] args) {
        Phaser phaser = new Phaser(1);
        int phase = phaser.arriveAndAwaitAdvance();
        System.out.println("next phase=" + phase);
        // 输出：next phase=1
        phaser.arriveAndDeregister();
    }
}
```

Phaser 的参与者可动态注册，phase 可以推进多次；参与者固定、只等待一次时 CountDownLatch 更直观。`arriveAndAwaitAdvance` 返回的是推进后的 phase 值，业务不要依赖具体编号做脆弱判断。

### Phaser.register/bulkRegister：动态参与者

```java
import java.util.concurrent.Phaser;

public class PhaserRegisterDemo {
    public static void main(String[] args) {
        Phaser phaser = new Phaser();
        phaser.bulkRegister(2);
        System.out.println(phaser.getRegisteredParties());
        // 输出：2
        phaser.arriveAndDeregister();
        phaser.arriveAndDeregister();
    }
}
```

注册和注销必须成对，否则 phase 永远等不到；Phaser 还支持 onAdvance 自定义终止条件，复杂度明显高于 latch/barrier。

### Exchanger：交换两个线程的缓冲区

```java
import java.util.concurrent.Exchanger;

public class ExchangerDemo {
    public static void main(String[] args) throws Exception {
        var exchanger = new Exchanger<String>();
        Thread peer = new Thread(() -> {
            try {
                exchanger.exchange("peer-data");
            } catch (InterruptedException ex) {
                Thread.currentThread().interrupt();
            }
        });
        peer.start();
        String received = exchanger.exchange("main-data");
        peer.join();
        System.out.println(received);
        // 输出：peer-data
    }
}
```

Exchanger 只有两个参与方，适合成对交换缓冲区；一般生产/消费流程应使用 BlockingQueue。

### Semaphore(fair)：公平许可证队列

```java
import java.util.concurrent.Semaphore;

public class FairSemaphoreDemo {
    public static void main(String[] args) throws InterruptedException {
        Semaphore semaphore = new Semaphore(1, true);
        semaphore.acquire();
        try {
            System.out.println("fair=" + semaphore.isFair());
            // 输出：fair=true
        } finally {
            semaphore.release();
        }
    }
}
```

公平 Semaphore 按等待顺序倾向授予许可证，但会付出排队成本；它和公平 ReentrantLock 一样需要基准证明。

## 简单案例

```java
import java.util.concurrent.CountDownLatch;
import java.util.concurrent.Semaphore;

public class SynchronizerChoiceDemo {
    public static void main(String[] args) throws InterruptedException {
        CountDownLatch ready = new CountDownLatch(1);
        Semaphore permits = new Semaphore(1);
        ready.countDown();
        ready.await();
        permits.acquire();
        try {
            System.out.println("ready and limited");
            // 输出：ready and limited
        } finally {
            permits.release();
        }
    }
}
```

同一个流程可能既需要一次性初始化门闩，也需要限制下游名额；同步器的语义可以组合，但每个计数都要明确负责人和释放路径。

## 易混点

- CountDownLatch 只能向零递减，CyclicBarrier 可重复，Phaser 还可动态注册参与者。
- Semaphore 的许可证没有线程所有权，release 次数错误会导致“虚假的容量”。
- CyclicBarrier 任一参与者超时或异常会破坏本轮屏障，其他线程不能继续假设阶段成功。
- await 超时或中断只说明等待结束，不说明业务条件满足。
- 同步器不负责关闭线程、取消 I/O 或回滚外部副作用。

## 课后小问

1. 为什么 CountDownLatch 不能直接复用下一轮？
答案：计数归零后永久开放，没有恢复到初始计数的操作。
解析：重复阶段使用 CyclicBarrier 或 Phaser；若阶段逻辑复杂，重新创建一个新的 latch 也更清楚。

2. Semaphore 和 ReentrantLock 都叫“锁”吗？
答案：Semaphore 是许可证计数器，没有线程所有权；ReentrantLock 有持有线程和重入规则。
解析：Semaphore 适合限制并发资源数量，释放可以由不同线程负责，但这也增加协议风险。

3. 为什么屏障动作不应包含长时间 I/O？
答案：屏障动作会延迟所有参与者进入下一阶段，长 I/O 会把整个阶段一起拖住。
解析：屏障动作只做短小的阶段切换或统计，外部调用放到后续任务中并设置独立超时。

## 本节小结

- CountDownLatch 表达一次性完成等待，Semaphore 表达并发许可证，CyclicBarrier 表达重复阶段汇合。
- Phaser 和 Exchanger 是低频特化工具，只有动态阶段或成对交换时才值得使用。
- 所有 await 都要处理超时、中断和失败，所有 permit 都要有成对 release。
- 同步器只是时序骨架，线程取消、资源关闭和业务补偿仍由应用负责。

## 快速回顾

- 能按“一次等待、并发名额、重复汇合”选择同步器。
- 会用 CountDownLatch、Semaphore 和 CyclicBarrier 的基本 API。
- 知道 Phaser 的动态参与者和 Exchanger 的两方交换语义。
- 能说明超时、中断、破坏屏障和许可证泄漏的处理边界。
