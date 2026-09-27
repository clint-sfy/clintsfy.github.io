---
title: CompletableFuture 异步编排
date: 2026-09-27
category: Java基础快速入门
tags:
  - Java
  - CompletableFuture
  - 异步
description: 用 CompletableFuture 组合异步任务、处理异常、并行汇总和超时降级。
---

# CompletableFuture 异步编排

## 学习目标

- 会使用 supplyAsync、thenApply、thenCompose 和 thenCombine 串联或合并任务。
- 使用 allOf 等待一组任务，并正确收集结果和传播异常。
- 使用 exceptionally、handle、orTimeout 和 completeOnTimeout 设计失败与超时策略。

## 核心知识点

### 专业术语

- **CompletionStage**：描述异步阶段及其依赖关系的接口。
- **CompletableFuture**：既是 Future 又是可手动完成的 CompletionStage 实现。
- **thenApply**：把上一步结果同步映射成新结果。
- **thenCompose**：把返回 CompletableFuture 的函数扁平化，形成串行依赖。
- **thenCombine**：等待两个独立阶段完成后合并结果。
- **异常阶段**：exceptionally、handle 等用来把失败转换为降级结果或同时观察成功/失败。

### 白话解释与边界

CompletableFuture 是一张异步依赖图，不是自动创建无限线程的魔法。带 `Async` 的方法默认使用 commonPool，生产代码通常传入有界 Executor；阻塞 I/O 不应无界塞进公共池。每个阶段都要明确异常、取消、超时和线程池归属。

`thenApply` 适合“结果变换”，`thenCompose` 适合“上一步决定下一次异步调用”，`thenCombine` 适合两个互不依赖的分支汇合。`allOf` 本身只返回 Void，结果需要从原始 Future 中逐个 join 收集。

## 常用用法

### supplyAsync：启动异步供应任务

```java
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.Executors;

public class SupplyAsyncDemo {
    public static void main(String[] args) {
        try (var executor = Executors.newSingleThreadExecutor()) {
            CompletableFuture<String> future = CompletableFuture
                    .supplyAsync(() -> "java", executor);
            System.out.println(future.join());
            // 输出：java
        }
    }
}
```

给 supplyAsync 传入执行器，能明确异步任务在哪个线程池运行；不传执行器会使用 commonPool，任务类型和阻塞比例不受当前方法控制。

### thenApply：转换上一步结果

```java
import java.util.concurrent.CompletableFuture;

public class ThenApplyDemo {
    public static void main(String[] args) {
        String result = CompletableFuture.completedFuture("java")
                .thenApply(String::toUpperCase)
                .join();
        System.out.println(result);
        // 输出：JAVA
    }
}
```

thenApply 的函数输入是前一阶段的结果，返回普通值；没有 `Async` 后缀时，阶段可能在完成前一阶段的线程上执行，函数应短小且不要阻塞。

### thenCompose：串联两个异步阶段

```java
import java.util.concurrent.CompletableFuture;

public class ThenComposeDemo {
    static CompletableFuture<String> loadName(int id) {
        return CompletableFuture.completedFuture("user-" + id);
    }

    public static void main(String[] args) {
        String result = CompletableFuture.completedFuture(7)
                .thenCompose(ThenComposeDemo::loadName)
                .join();
        System.out.println(result);
        // 输出：user-7
    }
}
```

如果用 thenApply 返回 CompletableFuture，会得到嵌套的 `CompletableFuture&lt;CompletableFuture&lt;T&gt;&gt;`；thenCompose 会把它展平成一个阶段。

### thenCombine：汇合两个独立结果

```java
import java.util.concurrent.CompletableFuture;

public class ThenCombineDemo {
    public static void main(String[] args) {
        CompletableFuture<String> user = CompletableFuture.completedFuture("Ann");
        CompletableFuture<Integer> score = CompletableFuture.completedFuture(100);
        String result = user.thenCombine(score, (name, value) -> name + ":" + value).join();
        System.out.println(result);
        // 输出：Ann:100
    }
}
```

两个分支互不依赖时可以并行启动再 combine；任一分支失败时，合并阶段通常也会失败，需要统一的异常策略。

### allOf：等待多个异步任务

```java
import java.util.List;
import java.util.concurrent.CompletableFuture;

public class AllOfDemo {
    public static void main(String[] args) {
        List<CompletableFuture<String>> futures = List.of(
                CompletableFuture.completedFuture("a"),
                CompletableFuture.completedFuture("b"));
        CompletableFuture.allOf(futures.toArray(CompletableFuture[]::new)).join();
        List<String> results = futures.stream().map(CompletableFuture::join).toList();
        System.out.println(results);
        // 输出：[a, b]
    }
}
```

allOf 等待所有阶段完成但不直接返回结果列表；先等待再按原列表 join，可以保持输入顺序。任何一个阶段异常都要在 join 处观察并按业务处理。

### exceptionally：失败时降级

```java
import java.util.concurrent.CompletableFuture;

public class ExceptionallyDemo {
    public static void main(String[] args) {
        String result = CompletableFuture.<String>failedFuture(
                        new IllegalStateException("down"))
                .exceptionally(error -> "fallback")
                .join();
        System.out.println(result);
        // 输出：fallback
    }
}
```

exceptionally 只在上游异常时执行，返回一个替代结果；不要把所有异常都吞成默认值，至少记录原异常并区分可恢复错误和编程错误。

### handle：同时处理成功和失败

```java
import java.util.concurrent.CompletableFuture;

public class HandleDemo {
    public static void main(String[] args) {
        String result = CompletableFuture.<String>failedFuture(
                        new IllegalArgumentException("bad input"))
                .handle((value, error) -> error == null ? value : "handled")
                .join();
        System.out.println(result);
        // 输出：handled
    }
}
```

handle 无论成功失败都会执行，适合统一转换结果或记录状态；若只想在失败时提供默认值，exceptionally 更直接。

### orTimeout：超时并让阶段失败

```java
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.TimeUnit;

public class OrTimeoutDemo {
    public static void main(String[] args) {
        String result = CompletableFuture.completedFuture("fast")
                .orTimeout(1, TimeUnit.SECONDS)
                .join();
        System.out.println(result);
        // 输出：fast
    }
}
```

orTimeout 在期限内未完成时以 TimeoutException 异常完成阶段；它是结果协议的一部分，底层 I/O 是否真的取消要看连接客户端和任务实现。

### completeOnTimeout：超时返回默认值

```java
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.TimeUnit;

public class CompleteOnTimeoutDemo {
    public static void main(String[] args) {
        String result = new CompletableFuture<String>()
                .completeOnTimeout("default", 1, TimeUnit.MILLISECONDS)
                .join();
        System.out.println(result);
        // 输出：default
    }
}
```

completeOnTimeout 以默认值完成阶段，适合允许降级的查询；它同样不保证取消底层任务，不能用默认值掩盖下游持续超载。

### thenAccept：异步流程末端消费结果

```java
import java.util.concurrent.CompletableFuture;

public class ThenAcceptDemo {
    public static void main(String[] args) {
        CompletableFuture.completedFuture("saved")
                .thenAccept(System.out::println)
                .join();
        // 输出：saved
    }
}
```

thenAccept 返回 `CompletableFuture<Void>`，适合通知、写日志等末端动作；需要返回新业务结果时使用 thenApply。

## 不常用但需要知道

### thenApplyAsync：把变换交给指定执行器

```java
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.Executors;

public class ThenApplyAsyncDemo {
    public static void main(String[] args) {
        try (var executor = Executors.newSingleThreadExecutor()) {
            String result = CompletableFuture.completedFuture("java")
                    .thenApplyAsync(String::toUpperCase, executor)
                    .join();
            System.out.println(result);
            // 输出：JAVA
        }
    }
}
```

Async 变体把阶段提交到执行器，适合隔离阻塞或 CPU 工作；线程池仍需有界，不能为了“异步”把所有任务都投向公共池。

### exceptionallyCompose：异步降级分支

```java
import java.util.concurrent.CompletableFuture;

public class ExceptionallyComposeDemo {
    static CompletableFuture<String> backup() {
        return CompletableFuture.completedFuture("backup");
    }

    public static void main(String[] args) {
        String value = CompletableFuture.<String>failedFuture(new RuntimeException())
                .exceptionallyCompose(error -> backup())
                .join();
        System.out.println(value);
        // 输出：backup
    }
}
```

需要异步调用备用服务时用 exceptionallyCompose，避免在 exceptionally 中阻塞等待另一个 Future。

### applyToEither：两个结果谁先完成用谁

```java
import java.util.concurrent.CompletableFuture;

public class ApplyToEitherDemo {
    public static void main(String[] args) {
        String result = CompletableFuture.completedFuture("primary")
                .applyToEither(CompletableFuture.completedFuture("backup"), value -> value)
                .join();
        System.out.println(result);
        // 输出：可能是 primary，也可能是 backup
    }
}
```

完成顺序由实际调度决定，结果是“可能”为 primary 或 backup；要把它用于竞速请求，必须取消慢分支并处理重复副作用。

### minimalCompletionStage：只暴露完成阶段接口

```java
import java.util.concurrent.CompletableFuture;

public class MinimalStageDemo {
    public static void main(String[] args) {
        CompletableFuture<String> source = CompletableFuture.completedFuture("value");
        var view = source.minimalCompletionStage();
        System.out.println(view.toCompletableFuture().join());
        // 输出：value
    }
}
```

minimalCompletionStage 可把内部可手动 complete 的 Future 以更窄的 CompletionStage 视图暴露给调用者，降低外部篡改完成状态的机会。

## 简单案例

```java
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.Executors;

public class CompletablePipelineDemo {
    public static void main(String[] args) {
        try (var executor = Executors.newFixedThreadPool(2)) {
            var result = CompletableFuture
                    .supplyAsync(() -> "java", executor)
                    .thenApply(String::toUpperCase)
                    .thenCombine(CompletableFuture.completedFuture(" API"), String::concat)
                    .exceptionally(error -> "fallback")
                    .join();
            System.out.println(result);
            // 输出：JAVA API
        }
    }
}
```

异步编排要把线程池、依赖关系、错误边界和降级值一起写清楚；链越长，越需要统一的超时与取消策略。

## 易混点

- thenApply 是值转换，thenCompose 是异步阶段扁平化，thenCombine 是两个独立分支汇合。
- allOf 返回 Void，需要从原始 Future 收集结果；异常要在 join/get 处观察。
- 非 Async 阶段可能在上一步完成线程中运行，Async 阶段也不是无限并发保证。
- orTimeout/completeOnTimeout 改变 Future 结果，不一定停止底层 I/O 或释放连接。
- exceptionally 只处理失败，handle 成功失败都处理；默认值必须有监控和业务语义。

## 课后小问

1. 为什么用 thenApply 调一个返回 Future 的方法会产生嵌套？
答案：thenApply 把函数返回值当作普通结果，因此得到 `Future&lt;Future&lt;T&gt;&gt;`。
解析：返回异步阶段时使用 thenCompose，它会把内外两层展开成一个 `Future&lt;T&gt;`。

2. allOf 为什么不直接返回结果列表？
答案：它只负责等待一组阶段完成，结果类型各不相同，API 无法推断统一列表类型。
解析：保留原始 Future 列表，allOf.join 后再逐个 join，必要时按输入顺序收集。

3. `get(timeout)` 或 orTimeout 超时后下游连接一定释放了吗？
答案：不一定，超时首先改变等待者看到的结果，底层任务和 I/O 需要独立的取消机制。
解析：把 Future 取消、客户端超时、连接关闭和补偿策略作为一整套资源协议设计。

## 本节小结

- CompletableFuture 用阶段依赖图表达串行、并行、汇合和降级。
- supplyAsync、thenApply、thenCompose、thenCombine 和 allOf 覆盖大多数编排路径。
- exceptionally、handle、orTimeout 和 completeOnTimeout 负责异常与超时结果，但不自动清理外部资源。
- 明确执行器、取消、线程池容量和副作用边界，异步链才可观测、可维护。

## 快速回顾

- 会区分 thenApply、thenCompose、thenCombine。
- 会用 allOf 等待并按输入顺序收集结果。
- 能写 exceptionally、handle、orTimeout 和 completeOnTimeout。
- 知道 Async 后缀与 commonPool/自定义执行器的关系。
