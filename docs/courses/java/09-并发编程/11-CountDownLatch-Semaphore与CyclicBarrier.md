---
title: CountDownLatch、Semaphore 与 CyclicBarrier
date: 2026-09-27T00:00:00.000Z
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

### 等待一次性事件：递减计数并放行等待者

`CountDownLatch` 用于等待一次性事件，计数归零后所有 `await` 都会通过且不能重置。

```java
// 说明：等待一次性事件：递减计数并放行等待者。
import java.util.concurrent.CountDownLatch;

public class LatchInitDemo {
    public static void main(String[] args) throws InterruptedException {
        CountDownLatch latch = new CountDownLatch(2);
// 初始状态：latch = new CountDownLatch(2)。
// 作用：CountDownLatch latch = new CountDownLatch(2);；递减计数并放行等待者。
        latch.countDown();
// 初始状态：latch.countDown()。
// 作用：latch.countDown();；递减计数并放行等待者。
        latch.countDown();
// 初始状态：latch.countDown()。
// 作用：latch.countDown();；递减计数并放行等待者。
        latch.await();
// 初始状态：latch.await()。
// 作用：latch.await();；递减计数并放行等待者。
        System.out.println("started");
// 输出：started
    }
}
```

计数必须与实际参与者数量匹配，漏掉 countDown 会让等待永久阻塞。

### CountDownLatch.await(timeout)：有界等待

超时返回 false 表示门闩尚未归零；调用方应选择降级、重试或终止，而不是假设初始化成功。

```java
// 说明：CountDownLatch.await(timeout)：有界等待。
import java.util.concurrent.CountDownLatch;
import java.util.concurrent.TimeUnit;

public class LatchTimeoutDemo {
    public static void main(String[] args) throws InterruptedException {
        CountDownLatch latch = new CountDownLatch(1);
// 初始状态：latch = new CountDownLatch(1)。
// 作用：CountDownLatch latch = new CountDownLatch(1);；有界等待。
        boolean ready = latch.await(1, TimeUnit.MILLISECONDS);
// 初始状态：ready = latch.await(1, TimeUnit.MILLISECONDS)。
// 作用：boolean ready = latch.await(1, TimeUnit.MILLISECONDS);；有界等待。
        System.out.println("ready=" + ready);
// 输出：ready=false
    }
}
```

### 限制并发名额：获取后归还许可证

许可证不是线程所有权锁，任意线程都可以 release；这既方便资源归还，也意味着必须由业务保证 release 次数和所有权协议。

```java
// 说明：限制并发名额：获取后归还许可证。
import java.util.concurrent.Semaphore;

public class SemaphoreDemo {
    public static void main(String[] args) throws InterruptedException {
        Semaphore semaphore = new Semaphore(1);
// 初始状态：semaphore = new Semaphore(1)。
// 作用：Semaphore semaphore = new Semaphore(1);；获取后归还许可证。
        semaphore.acquire();
// 初始状态：semaphore.acquire()。
// 作用：semaphore.acquire();；获取后归还许可证。
        try {
            System.out.println("permit acquired");
// 输出：permit acquired
        } finally {
            semaphore.release();
// 初始状态：semaphore.release()。
// 作用：semaphore.release();；获取后归还许可证。
        }
    }
}
```

### Semaphore.tryAcquire：拒绝或降级

tryAcquire 不等待，适合快速失败；带超时版本允许有限等待。

```java
// 说明：Semaphore.tryAcquire：拒绝或降级。
import java.util.concurrent.Semaphore;

public class SemaphoreTryDemo {
    public static void main(String[] args) {
        Semaphore semaphore = new Semaphore(1);
// 初始状态：semaphore = new Semaphore(1)。
// 作用：Semaphore semaphore = new Semaphore(1);；拒绝或降级，返回调用结果。
        if (semaphore.tryAcquire()) {
// 作用：if (semaphore.tryAcquire()) {；拒绝或降级，调用后目标状态更新。
            try {
                System.out.println("accepted");
// 输出：accepted
            } finally {
                semaphore.release();
// 作用：semaphore.release();；拒绝或降级，调用后目标状态更新。
            }
        } else {
            System.out.println("busy");
// 输出：可能是 busy（如果没有及时获得许可证）
        }
    }
}
```

失败分支要明确返回、排队或降级，不能静默丢掉请求。

### CyclicBarrier.await：阶段汇合

参与者全部 await 后屏障动作执行一次并放行；通过后 barrier 可以再次使用。

```java
// 说明：CyclicBarrier.await：阶段汇合。
import java.util.concurrent.CyclicBarrier;

public class BarrierDemo {
    public static void main(String[] args) throws Exception {
        CyclicBarrier barrier = new CyclicBarrier(1,
                () -> {
// 作用：CyclicBarrier barrier = new CyclicBarrier(1,；阶段汇合，调用后目标状态更新。
// 初始状态：barrier = new CyclicBarrier(1,。
                    System.out.println("phase complete");
// 输出：phase complete
                });
        barrier.await();
// 初始状态：barrier.await()。
// 作用：barrier.await();；阶段汇合，调用后目标状态更新。
    }
}
```

真实多线程场景中一个参与者异常或超时会让屏障破坏，其他参与者应处理 BrokenBarrierException。

### CyclicBarrier.reset：重置破坏的屏障

reset 会让当前 generation 失效，正在等待的线程可能收到 BrokenBarrierException。

```java
// 说明：CyclicBarrier.reset：重置破坏的屏障。
import java.util.concurrent.CyclicBarrier;

public class BarrierResetDemo {
    public static void main(String[] args) {
        CyclicBarrier barrier = new CyclicBarrier(2);
// 作用：CyclicBarrier barrier = new CyclicBarrier(2);；重置破坏的屏障，调用后目标状态更新。
// 初始状态：barrier = new CyclicBarrier(2)。
        barrier.reset();
// 初始状态：barrier.reset()。
// 作用：barrier.reset();；重置破坏的屏障，返回调用结果。
        System.out.println("parties=" + barrier.getParties());
// 输出：parties=2
    }
}
```

不要在不清楚参与者状态时随意 reset，最好让整个阶段以失败结束再重新创建。
## 不常用但需要知道

### 协调动态多阶段任务：注册参与者并推进阶段

Phaser 的参与者可动态注册，phase 可以推进多次；参与者固定、只等待一次时 CountDownLatch 更直观。`arriveAndAwaitAdvance` 返回的是推进后的 phase 值，业务不要依赖具体编号做脆弱判断。

```java
import java.util.concurrent.Phaser;

public class PhaserDemo {
    public static void main(String[] args) {
        Phaser phaser = new Phaser(1);
// 初始状态：phaser = new Phaser(1)。
// 作用：Phaser phaser = new Phaser(1);；注册参与者并推进阶段。
        int phase = phaser.arriveAndAwaitAdvance();
// 初始状态：phase = phaser.arriveAndAwaitAdvance()。
// 作用：int phase = phaser.arriveAndAwaitAdvance();；注册参与者并推进阶段。
        System.out.println("next phase=" + phase);
// 输出：next phase=1
        phaser.arriveAndDeregister();
// 初始状态：phaser.arriveAndDeregister()。
// 作用：phaser.arriveAndDeregister();；注册参与者并推进阶段。
    }
}
```

### 注册阶段参与者：添加单个或多个任务

注册和注销必须成对，否则 phase 永远等不到；Phaser 还支持 onAdvance 自定义终止条件，复杂度明显高于 latch/barrier。

```java
import java.util.concurrent.Phaser;

public class PhaserRegisterDemo {
    public static void main(String[] args) {
        Phaser phaser = new Phaser();
// 初始状态：phaser = new Phaser()。
// 作用：Phaser phaser = new Phaser();；添加单个或多个任务。
        phaser.bulkRegister(2);
// 初始状态：phaser.bulkRegister(2)。
// 作用：phaser.bulkRegister(2);；添加单个或多个任务。
        System.out.println(phaser.getRegisteredParties());
// 输出：2
        phaser.arriveAndDeregister();
// 初始状态：phaser.arriveAndDeregister()。
// 作用：phaser.arriveAndDeregister();；添加单个或多个任务。
        phaser.arriveAndDeregister();
// 初始状态：phaser.arriveAndDeregister()。
// 作用：phaser.arriveAndDeregister();；添加单个或多个任务。
    }
}
```

### Exchanger：交换两个线程的缓冲区

Exchanger 只有两个参与方，适合成对交换缓冲区；一般生产/消费流程应使用 BlockingQueue。

```java
// 说明：peer 线程提交 "peer-data"，main 提交 "main-data"；两者都到达 exchange 后互换字符串并各自返回。
import java.util.concurrent.Exchanger;

public class ExchangerDemo {
    public static void main(String[] args) throws Exception {
        var exchanger = new Exchanger<String>();
// 初始状态：exchanger = new Exchanger<String>()。
// 作用：var exchanger = new Exchanger<String>();；交换两个线程的缓冲区。
        Thread peer = new Thread(() -> {
// 作用：Thread peer = new Thread(() -> {；交换两个线程的缓冲区。
// 初始状态：peer = new Thread(() ->。
            try {
                exchanger.exchange("peer-data");
// 作用：exchanger.exchange("peer-data");；交换两个线程的缓冲区。
            } catch (InterruptedException ex) {
                Thread.currentThread().interrupt();
// 作用：Thread.currentThread().interrupt();；交换两个线程的缓冲区。
            }
        });
        peer.start();
// 作用：peer.start();；交换两个线程的缓冲区。
        String received = exchanger.exchange("main-data");
// 作用：String received = exchanger.exchange("main-data");；交换两个线程的缓冲区。
// 初始状态：received = exchanger.exchange("main-data")。
        peer.join();
// 作用：peer.join();；交换两个线程的缓冲区。
        System.out.println(received);
// 输出：peer-data
    }
}
```

### Semaphore(fair)：公平许可证队列

公平 Semaphore 按等待顺序倾向授予许可证，但会付出排队成本；它和公平 ReentrantLock 一样需要基准证明。

```java
// 作用：通过 Semaphore(fair) 公平许可证队列。
import java.util.concurrent.Semaphore;

public class FairSemaphoreDemo {
    public static void main(String[] args) throws InterruptedException {
        Semaphore semaphore = new Semaphore(1, true);
// 初始状态：semaphore = new Semaphore(1, true)。
// 作用：Semaphore semaphore = new Semaphore(1, true);；公平许可证队列。
        semaphore.acquire();
// 初始状态：semaphore.acquire()。
// 作用：semaphore.acquire();；公平许可证队列。
        try {
            System.out.println("fair=" + semaphore.isFair());
// 输出：fair=true
        } finally {
            semaphore.release();
// 初始状态：semaphore.release()。
// 作用：semaphore.release();；公平许可证队列。
        }
    }
}
```
## 简单案例

```java
import java.util.concurrent.CountDownLatch;
import java.util.concurrent.Semaphore;

public class SynchronizerChoiceDemo {
    public static void main(String[] args) throws InterruptedException {
        CountDownLatch ready = new CountDownLatch(1);
// 初始状态：ready = new CountDownLatch(1)。
// 作用：CountDownLatch ready = new CountDownLatch(1);；公平许可证队列。
        Semaphore permits = new Semaphore(1);
// 初始状态：permits = new Semaphore(1)。
// 作用：Semaphore permits = new Semaphore(1);；公平许可证队列。
        ready.countDown();
// 初始状态：ready.countDown()。
// 作用：ready.countDown();；公平许可证队列。
        ready.await();
// 初始状态：ready.await()。
// 作用：ready.await();；公平许可证队列。
        permits.acquire();
// 初始状态：permits.acquire()。
// 作用：permits.acquire();；公平许可证队列。
        try {
            System.out.println("ready and limited");
// 输出：ready and limited
        } finally {
            permits.release();
// 初始状态：permits.release()。
// 作用：permits.release();；公平许可证队列。
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
