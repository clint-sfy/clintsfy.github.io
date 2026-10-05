---
title: 线程池、Callable 与 Future
date: 2026-09-27T00:00:00.000Z
category: Java基础快速入门
tags:
  - Java
  - ThreadPoolExecutor
  - Callable
  - Future
description: 配置 ThreadPoolExecutor，使用 Callable/Future 获取结果、取消任务并处理拒绝与关闭。
---

# 线程池、Callable 与 Future

## 学习目标

- 会配置 ThreadPoolExecutor 的核心线程数、最大线程数、队列、线程工厂和拒绝策略。
- 使用 Callable、Future、FutureTask 和 CompletionService 管理异步结果。
- 区分关闭、取消、超时和任务异常，避免线程泄漏与无界堆积。

## 核心知识点

### 专业术语

- **Callable&lt;V&gt;**：返回 V 并可抛出异常的任务。
- **Future&lt;V&gt;**：异步计算的结果句柄，支持 get、取消和状态查询。
- **FutureTask&lt;V&gt;**：同时实现 RunnableFuture，可提交给执行器也可直接运行。
- **ThreadPoolExecutor**：按核心数、最大数、队列和拒绝策略调度平台线程。
- **拒绝策略**：执行器不能再接收任务时的处理方式，如 Abort、CallerRuns、Discard 和 DiscardOldest。

### 白话解释与边界

线程池是“有限工人 + 等待队列”。提交任务时先用核心线程，再放队列，队列满后才扩展到最大线程，仍满才触发拒绝策略。无界队列会让最大线程数几乎不起作用并把压力推到内存；有界队列要配合业务降级、超时或重试。

Future 只代表一个结果，不会自动完成超时后的清理。与直接调用同步方法相比，`get(timeout)` 超时只是调用方停止等待，任务可能仍在运行；需要取消时显式调用 cancel，并让任务响应中断。

## 常用用法

### 获取任务结果：提交 `Callable` 并持有 `Future`

Callable 适合需要结果或声明异常的任务；执行异常会在 `get()` 时包装为 ExecutionException，调用方要区分任务失败、等待被中断和调用方超时。

```java
// 说明：获取任务结果：提交 Callable 并持有 Future。
import java.util.concurrent.Callable;
import java.util.concurrent.Executors;

public class CallableFutureDemo {
    public static void main(String[] args) throws Exception {
        try (var executor = Executors.newSingleThreadExecutor()) {
// 初始状态：executor = Executors.newSingleThreadExecutor())。
            Callable<Integer> task = () -> 20 + 22;
// 初始状态：task = () -> 20 + 22。
            var future = executor.submit(task);
// 初始状态：future = executor.submit(task)。
// 作用：var future = executor.submit(task);；提交 Callable 并持有 Future。
            System.out.println(future.get());
// 输出：42
        }
    }
}
```

### Future.get：观察任务异常

`submit` 不会把任务异常直接抛到提交线程；只有读取对应 Future 时才会以 `ExecutionException` 观察到。

```java
// 说明：Future.get：观察任务异常。
import java.util.concurrent.Callable;
import java.util.concurrent.ExecutionException;
import java.util.concurrent.Executors;

public class FutureExceptionDemo {
    public static void main(String[] args) {
        try (var executor = Executors.newSingleThreadExecutor()) {
// 初始状态：executor = Executors.newSingleThreadExecutor())。
            Callable<Void> task = () -> {
// 初始状态：task = () ->。
                throw new IllegalArgumentException("bad input");
// 作用：throw new IllegalArgumentException("bad input");；观察任务异常。
// 初始状态：throw new IllegalArgumentException("bad input")。
            };
            var future = executor.submit(task);
// 作用：var future = executor.submit(task);；观察任务异常。
// 初始状态：future = executor.submit(task)。
            try {
                future.get();
// 初始状态：future.get()。
// 作用：future.get();；观察任务异常。
            } catch (ExecutionException ex) {
                System.out.println(ex.getCause().getClass().getSimpleName());
// 输出：IllegalArgumentException
            } catch (InterruptedException ex) {
                Thread.currentThread().interrupt();
// 作用：Thread.currentThread().interrupt();；观察任务异常。
            }
        }
    }
}
```

生产代码应记录 cause，并区分可重试失败和编程错误。

### Future.get(timeout)：有界等待

`Future.get(timeout)` 用于限制等待时间，但超时只表示观察边界，不等于任务已停止。

```java
// 说明：Future.get(timeout)：有界等待。
import java.util.concurrent.FutureTask;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.TimeoutException;

public class FutureTimeoutDemo {
    public static void main(String[] args) {
        FutureTask<String> future = new FutureTask<>(() -> "ready");
// 初始状态：future = new FutureTask<>(() -> "ready")。
// 作用：FutureTask<String> future = new FutureTask<>(() -> "ready");；有界等待。
        try {
            System.out.println(future.get(1, TimeUnit.MILLISECONDS));
// 输出：ready
        } catch (TimeoutException ex) {
            System.out.println("timed out");
// 输出：timed out
            future.cancel(false);
// 初始状态：future.cancel(false)。
// 作用：future.cancel(false);；有界等待。
        } catch (Exception ex) {
            throw new RuntimeException(ex);
// 初始状态：throw new RuntimeException(ex)。
// 作用：throw new RuntimeException(ex);；有界等待。
        }
    }
}
```

真正的线程池任务还应在超时后决定 cancel(true)、继续后台运行或交给补偿队列。

### Future.cancel：请求取消

尚未运行时 `cancel(false)` 可以取消任务；运行中使用 `cancel(true)` 只发送中断请求。

```java
// 说明：Future.cancel：请求取消。
import java.util.concurrent.FutureTask;

public class FutureTaskCancelDemo {
    public static void main(String[] args) {
        FutureTask<String> future = new FutureTask<>(() -> "not run");
// 作用：FutureTask<String> future = new FutureTask<>(() -> "not run");；请求取消。
// 初始状态：future = new FutureTask<>(() -> "not run")。
        boolean cancelled = future.cancel(false);
// 初始状态：cancelled = future.cancel(false)。
// 作用：boolean cancelled = future.cancel(false);；请求取消。
        System.out.println(cancelled + ", done=" + future.isDone());
// 输出：true, done=true
    }
}
```

任务如果忽略中断，资源仍可能继续占用。

### FutureTask：把任务当作 Runnable 执行

FutureTask 可被 Thread 或 Executor 执行，也能被多个调用方等待同一个结果；它只执行一次，适合简单的可复用异步计算句柄。

```java
// 说明：FutureTask：把任务当作 Runnable 执行。
import java.util.concurrent.FutureTask;

public class FutureTaskDemo {
    public static void main(String[] args) throws Exception {
        FutureTask<Integer> task = new FutureTask<>(() -> 6 * 7);
// 初始状态：task = new FutureTask<>(() -> 6 * 7)。
// 作用：FutureTask<Integer> task = new FutureTask<>(() -> 6 * 7);；把任务当作 Runnable 执行。
        Thread worker = new Thread(task, "calculator");
// 作用：Thread worker = new Thread(task, "calculator");；把任务当作 Runnable 执行。
// 初始状态：worker = new Thread(task, "calculator")。
        worker.start();
// 作用：worker.start();；把任务当作 Runnable 执行。
        System.out.println(task.get());
// 输出：42
    }
}
```

### ThreadPoolExecutor：显式配置边界

核心线程数控制常驻处理能力，最大线程数处理队列满后的短时扩展，keepAlive 回收多余线程，ArrayBlockingQueue 给堆积设置上限。

```java
// 说明：ThreadPoolExecutor：显式配置边界。
import java.util.concurrent.ArrayBlockingQueue;
import java.util.concurrent.ThreadPoolExecutor;
import java.util.concurrent.TimeUnit;

public class ThreadPoolConfigDemo {
    public static void main(String[] args) throws Exception {
        var executor = new ThreadPoolExecutor(
                1, 2, 10, TimeUnit.SECONDS,
                new ArrayBlockingQueue<>(2),
                new ThreadPoolExecutor.AbortPolicy());
// 初始状态：executor = new ThreadPoolExecutor(。
// 作用：var executor = new ThreadPoolExecutor(；显式配置边界。
// 作用：new ThreadPoolExecutor.AbortPolicy());；显式配置边界。
        try {
            var future = executor.submit(() -> "bounded");
// 作用：var future = executor.submit(() -> "bounded");；显式配置边界。
// 初始状态：future = executor.submit(() -> "bounded")。
            System.out.println(future.get());
// 输出：bounded
        } finally {
            executor.shutdown();
// 作用：executor.shutdown();；显式配置边界。
        }
    }
}
```

参数应根据 CPU、阻塞比例和下游容量用基准测试确定。

### RejectedExecutionHandler：AbortPolicy 拒绝

AbortPolicy 直接抛异常，适合不能静默丢任务的边界。

```java
// 说明：RejectedExecutionHandler：AbortPolicy 拒绝。
import java.util.concurrent.RejectedExecutionException;
import java.util.concurrent.ThreadPoolExecutor;

public class AbortPolicyDemo {
    public static void main(String[] args) {
        var executor = new ThreadPoolExecutor(
                1, 1, 0, java.util.concurrent.TimeUnit.SECONDS,
                new java.util.concurrent.SynchronousQueue<>(),
                new ThreadPoolExecutor.AbortPolicy());
// 初始状态：new java.util.concurrent.SynchronousQueue<>(),。
// 初始状态：executor = new ThreadPoolExecutor(。
// 作用：var executor = new ThreadPoolExecutor(；AbortPolicy 拒绝。
        executor.shutdown();
// 作用：executor.shutdown();；AbortPolicy 拒绝。
        try {
            executor.execute(() -> { });
// 作用：executor.execute(() -> { });；AbortPolicy 拒绝。
        } catch (RejectedExecutionException ex) {
            System.out.println("rejected");
// 输出：rejected
        }
    }
}
```

CallerRunsPolicy 会让提交者执行任务形成背压，Discard/DiscardOldest 只有在明确允许丢弃或淘汰任务时才使用。

### 创建工作线程：统一名称和异常策略

统一命名方便线程转储和日志定位；还可以在 ThreadFactory 中设置 daemon、UncaughtExceptionHandler，但不要因为 daemon 而省略有序关闭。

```java
// 说明：创建工作线程：统一名称和异常策略。
import java.util.concurrent.Executors;
import java.util.concurrent.ThreadFactory;

public class ThreadFactoryDemo {
    public static void main(String[] args) throws Exception {
        ThreadFactory factory = new ThreadFactory() {
// 初始状态：factory = new ThreadFactory()。
// 作用：ThreadFactory factory = new ThreadFactory() {；统一名称和异常策略。
            private int nextId;

            @Override
            public Thread newThread(Runnable task) {
                return new Thread(task, "worker-" + nextId++);
// 初始状态：return new Thread(task, "worker-" + nextId++)。
// 作用：return new Thread(task, "worker-" + nextId++);；统一名称和异常策略。
            }
        };
        try (var executor = Executors.newFixedThreadPool(1, factory)) {
// 初始状态：executor = Executors.newFixedThreadPool(1, factory))。
            var future = executor.submit(() -> Thread.currentThread().getName());
// 初始状态：future = executor.submit(() -> Thread.currentThread().getName())。
// 作用：var future = executor.submit(() -> Thread.currentThread().getName());；统一名称和异常策略。
            System.out.println(future.get());
// 输出：worker-0
        }
    }
}
```

### invokeAll：等待一批 Callable

invokeAll 会等待全部任务完成或被中断；带超时版本返回时可能有未完成 Future，需要逐个取消或处理失败。

```java
// 说明：invokeAll：等待一批 Callable。
import java.util.List;
import java.util.concurrent.Executors;

public class InvokeAllDemo {
    public static void main(String[] args) throws Exception {
        try (var executor = Executors.newFixedThreadPool(2)) {
// 初始状态：executor = Executors.newFixedThreadPool(2))。
            var futures = executor.invokeAll(List.of(
                    () -> "first",
                    () -> "second"));
// 初始状态：futures = executor.invokeAll(List.of(。
// 作用：var futures = executor.invokeAll(List.of(；等待一批 Callable。
            System.out.println(futures.get(0).get() + "," + futures.get(1).get());
// 输出：first,second
        }
    }
}
```
## 不常用但需要知道

### CompletionService：按完成顺序消费结果

完成顺序由调度决定，上例两行的先后是可能变化的；需要输入顺序时保留 Future 列表并按索引读取。CompletionService 适合“谁先完成先处理”的批量任务。

```java
// 说明：completion 把两个 Future 按完成时间入队；take() 会阻塞到下一个任务完成，因此结果不保持提交顺序。
import java.util.concurrent.ExecutorCompletionService;
import java.util.concurrent.Executors;

public class CompletionServiceDemo {
    public static void main(String[] args) throws Exception {
        try (var executor = Executors.newFixedThreadPool(2)) {
// 初始状态：executor = Executors.newFixedThreadPool(2))。
// 作用：try (var executor = Executors.newFixedThreadPool(2)) {；按完成顺序消费结果。
            var completion = new ExecutorCompletionService<String>(executor);
// 作用：var completion = new ExecutorCompletionService<String>(executor);；按完成顺序消费结果。
// 初始状态：completion = new ExecutorCompletionService<String>(executor)。
            completion.submit(() -> "done-1");
// 作用：completion.submit(() -> "done-1");；按完成顺序消费结果。
            completion.submit(() -> "done-2");
// 作用：completion.submit(() -> "done-2");；按完成顺序消费结果。
            System.out.println(completion.take().get());
// 输出：可能是 done-1，也可能是 done-2
            System.out.println(completion.take().get());
// 输出：另一个结果（可能是 done-1，也可能是 done-2）
        }
    }
}
```

### invokeAny：只取最快成功结果

invokeAny 返回第一个成功结果，并取消其他未完成任务；“最快”不等于“最可靠”，超时、异常和副作用要在任务层设计。

```java
// 说明：invokeAny 在两个工作线程中竞速 replica-a 与 replica-b，返回第一个正常完成值并取消其余任务。
import java.util.List;
import java.util.concurrent.Executors;

public class InvokeAnyDemo {
    public static void main(String[] args) throws Exception {
        try (var executor = Executors.newFixedThreadPool(2)) {
// 初始状态：executor = Executors.newFixedThreadPool(2))。
            String result = executor.invokeAny(List.of(
                    () -> "replica-a",
                    () -> "replica-b"));
// 初始状态：result = executor.invokeAny(List.of(。
// 作用：String result = executor.invokeAny(List.of(；只取最快成功结果。
            System.out.println(result);
// 输出：可能是 replica-a，也可能是 replica-b
        }
    }
}
```

### CallerRunsPolicy：提交者承担背压

第一个任务占住唯一工作线程后，第二个任务会触发 CallerRunsPolicy 并在提交线程同步执行。它能形成背压但会拖慢请求线程，不能用于不允许阻塞的事件循环。

```java
// 说明：唯一工作线程被 releaseWorker 占用且 SynchronousQueue 不存储任务，第二次 execute 因此在 main 线程运行。
import java.util.concurrent.CountDownLatch;
import java.util.concurrent.ThreadPoolExecutor;

public class CallerRunsPolicyDemo {
    public static void main(String[] args) throws InterruptedException {
        var executor = new ThreadPoolExecutor(
                1, 1, 0, java.util.concurrent.TimeUnit.SECONDS,
                new java.util.concurrent.SynchronousQueue<>(),
                new ThreadPoolExecutor.CallerRunsPolicy());
// 初始状态：new java.util.concurrent.SynchronousQueue<>(),。
// 初始状态：executor = new ThreadPoolExecutor(。
// 作用：new ThreadPoolExecutor.CallerRunsPolicy());；提交者承担背压。
        var workerStarted = new CountDownLatch(1);
// 作用：var workerStarted = new CountDownLatch(1);；提交者承担背压。
// 初始状态：workerStarted = new CountDownLatch(1)。
        var releaseWorker = new CountDownLatch(1);
// 作用：var releaseWorker = new CountDownLatch(1);；提交者承担背压。
// 初始状态：releaseWorker = new CountDownLatch(1)。
        try {
            executor.execute(() -> {
// 作用：executor.execute(() -> {；提交者承担背压。
                workerStarted.countDown();
// 作用：workerStarted.countDown();；提交者承担背压。
                try {
                    releaseWorker.await();
// 作用：releaseWorker.await();；提交者承担背压。
                } catch (InterruptedException ex) {
                    Thread.currentThread().interrupt();
// 作用：Thread.currentThread().interrupt();；提交者承担背压。
                }
            });
            workerStarted.await();
// 作用：workerStarted.await();；提交者承担背压。
            executor.execute(() -> {
// 作用：executor.execute(() -> {；提交者承担背压。
                System.out.println("caller-runs");
// 输出：caller-runs
            });
        } finally {
            releaseWorker.countDown();
// 作用：releaseWorker.countDown();；提交者承担背压。
            executor.shutdown();
// 作用：executor.shutdown();；提交者承担背压。
            executor.awaitTermination(1, java.util.concurrent.TimeUnit.SECONDS);
// 作用：executor.awaitTermination(1, java.util.concurrent.TimeUnit.SECONDS);；提交者承担背压。
        }
    }
}
```

### prestartAllCoreThreads：提前创建核心线程

提前创建线程可以减少第一次请求的冷启动抖动，但会增加空闲资源；仅在启动延迟目标明确时使用。

```java
// 说明：fixedThreadPool 的 corePoolSize 为 2，prestartAllCoreThreads() 在未提交任务时就创建两个空闲工作线程。
import java.util.concurrent.Executors;

public class PrestartThreadsDemo {
    public static void main(String[] args) {
        var executor = (java.util.concurrent.ThreadPoolExecutor)
                Executors.newFixedThreadPool(2);
// 作用：Executors.newFixedThreadPool(2);；提前创建核心线程。
// 初始状态：executor = (java.util.concurrent.ThreadPoolExecutor)。
        try {
            int started = executor.prestartAllCoreThreads();
// 初始状态：started = executor.prestartAllCoreThreads()。
// 作用：int started = executor.prestartAllCoreThreads();；提前创建核心线程。
            System.out.println("started=" + started);
// 输出：started=2
        } finally {
            executor.shutdown();
// 作用：executor.shutdown();；提前创建核心线程。
        }
    }
}
```
## 简单案例

```java
import java.util.concurrent.ArrayBlockingQueue;
import java.util.concurrent.ThreadPoolExecutor;
import java.util.concurrent.TimeUnit;

public class BoundedPoolDemo {
    public static void main(String[] args) throws Exception {
        var executor = new ThreadPoolExecutor(
                1, 1, 0, TimeUnit.SECONDS,
                new ArrayBlockingQueue<>(1),
                new ThreadPoolExecutor.AbortPolicy());
// 初始状态：new ArrayBlockingQueue<>(1),。
// 初始状态：executor = new ThreadPoolExecutor(。
// 作用：var executor = new ThreadPoolExecutor(；提前创建核心线程。
        try {
            var future = executor.submit(() -> 40 + 2);
// 作用：var future = executor.submit(() -> 40 + 2);；提前创建核心线程。
// 初始状态：future = executor.submit(() -> 40 + 2)。
            System.out.println("result=" + future.get());
// 输出：result=42
        } finally {
            executor.shutdown();
// 作用：executor.shutdown();；提前创建核心线程。
        }
    }
}
```

有界队列、明确拒绝策略和 finally 关闭是一个可观测线程池的最小骨架；真正上线还要记录队列长度、活跃线程、拒绝次数和任务耗时。

## 易混点

- Future 超时不会自动中断任务；cancel、任务响应中断和资源释放要一起设计。
- 无界队列会隐藏积压，最大线程数通常也不会按想象扩展。
- execute 的异常走线程异常处理器，submit 的异常保存在 Future，需要 get 才能看到。
- CallerRunsPolicy 会阻塞提交者，Discard 策略可能丢任务；拒绝策略是业务语义，不是随便填写的参数。
- invokeAll 按输入顺序返回 Future 列表，CompletionService 按完成顺序取结果，二者不要混淆。

## 课后小问

1. 为什么线程池要使用有界队列？
答案：有界队列把等待任务数量限制住，让系统能在排满时触发背压或拒绝。
解析：无界队列可能持续占用内存，延迟越来越大但调用方直到 OOM 才看到问题。

2. submit 的 Callable 抛异常后什么时候能观察到？
答案：调用对应 Future.get 时会以 ExecutionException 形式观察到。
解析：只提交不读取 Future 会把失败任务当作成功排队，监控和重试都可能失效。

3. 为什么 shutdown 后仍要 awaitTermination？
答案：shutdown 只停止接收新任务，已有任务可能仍在运行。
解析：等待、超时、取消和最终 shutdownNow 组成完整关闭流程，保证资源有机会释放。

## 本节小结

- Callable/Future 表达有返回值的异步计算，FutureTask 是可执行的 Future。
- ThreadPoolExecutor 的容量由线程数、队列和拒绝策略共同决定。
- 超时、取消、异常和关闭都需要显式观察，不能依靠线程池“自动处理”。
- CompletionService 适合按完成顺序消费，invokeAll/invokeAny 适合批量等待或最快结果。

## 快速回顾

- 会配置核心线程、最大线程、有界队列和拒绝策略。
- 会区分 execute、submit、Future.get、cancel 和 shutdown。
- 能说明超时为什么不等于任务停止。
- 能按输入顺序或完成顺序选择 invokeAll 与 CompletionService。
