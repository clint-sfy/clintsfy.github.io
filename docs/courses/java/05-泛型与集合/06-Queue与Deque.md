---
title: Queue 与 Deque
date: 2026-09-27T00:00:00.000Z
category: Java基础快速入门
tags:
  - Java
  - Queue
  - Deque
  - ArrayDeque
  - PriorityQueue
description: 速查 FIFO 队列、双端队列、栈、优先级队列及并发队列的常用与低频操作。
---

# Queue 与 Deque

## 学习目标

- 用 offer、poll、peek 写出安全的 FIFO 队列操作。
- 用 Deque 表达双端进出和栈，理解 add/remove/element 的异常边界。
- 分清 PriorityQueue、BlockingQueue、ConcurrentLinkedQueue 的使用场景。

## 核心知识点

### 专业术语

- **Queue**：通常表达先进先出（FIFO）的等待序列。
- **Deque**：double-ended queue，支持头尾两端操作。
- **ArrayDeque**：基于循环数组的通用双端队列，通常优先于遗留 Stack。
- **PriorityQueue**：按优先级取出元素，不保证遍历顺序。
- **BlockingQueue**：支持等待元素或等待容量的线程间队列。

### 白话解释与边界

普通队列优先 ArrayDeque；需要栈语义也用 ArrayDeque。offer、poll、peek 失败时返回 false 或 null，适合把空队列当作正常分支；add、remove、element 失败时抛异常，适合调用方明确要求操作必须成功的内部不变式。ArrayDeque 不接受 null。

## 常用用法

### Queue.offer：安全入队

`offer(element)` 尝试入队，成功返回 true；有容量限制且已满时返回 false，适合由调用方决定重试或丢弃。

```java
import java.util.ArrayDeque;
import java.util.Queue;

public class QueueOfferDemo {
    public static void main(String[] args) {
        Queue<String> queue = new ArrayDeque<>();
        boolean accepted = queue.offer("job-1");
        System.out.println(accepted + ", " + queue);
        // 输出：true, [job-1]
    }
}
```

队列的顺序由具体实现决定：普通 FIFO 队列追加到队尾，优先队列则按比较顺序安排。

### Queue.poll：取出队首

`poll()` 返回并删除队首，适合循环消费可选任务；队列为空时返回 null。

```java
import java.util.ArrayDeque;
import java.util.Queue;

public class QueuePollDemo {
    public static void main(String[] args) {
        Queue<String> queue = new ArrayDeque<>();
        queue.offer("job-1");
        System.out.println(queue.poll());
        // 输出：job-1
        System.out.println(queue.poll());
        // 输出：null
    }
}
```

为了不混淆空队列和 null 元素，常见实现如 `ArrayDeque` 不允许存入 null。

### Queue.peek：查看队首

`peek()` 适合先观察下一项：它返回队首但不删除，空队列返回 null。

```java
import java.util.ArrayDeque;
import java.util.Queue;

public class QueuePeekDemo {
    public static void main(String[] args) {
        Queue<String> queue = new ArrayDeque<>();
        queue.offer("job-1");
        System.out.println(queue.peek());
        // 输出：job-1
        System.out.println(queue.size());
        // 输出：1
    }
}
```

并发队列中，查看之后队首可能已被其他线程取走，不能把 peek 和后续操作当成原子操作。

### Queue.add：必须成功地入队

`add(element)` 成功时返回 true；有容量限制的队列已满时抛 `IllegalStateException`。

```java
import java.util.ArrayDeque;
import java.util.Queue;

public class QueueAddDemo {
    public static void main(String[] args) {
        Queue<String> queue = new ArrayDeque<>();
        boolean added = queue.add("required");
        System.out.println(added + ", " + queue);
        // 输出：true, [required]
    }
}
```

当容量不足属于可预期情况时用 `offer`；对不允许 null 的实现传 null 仍会抛异常。

### Queue.remove：必须成功地取出队首

remove 返回并删除队首，空队列调用会抛 NoSuchElementException。

```java
import java.util.ArrayDeque;
import java.util.Queue;

public class QueueRemoveDemo {
    public static void main(String[] args) {
        Queue<String> queue = new ArrayDeque<>();
        queue.add("required");
        System.out.println(queue.remove());
        // 输出：required
    }
}
```

### Queue.element：必须成功地查看队首

element 返回但不删除队首，空队列调用会抛 NoSuchElementException。

```java
import java.util.ArrayDeque;
import java.util.Queue;

public class QueueElementDemo {
    public static void main(String[] args) {
        Queue<String> queue = new ArrayDeque<>();
        queue.add("required");
        System.out.println(queue.element());
        // 输出：required
        System.out.println(queue.size());
        // 输出：1
    }
}
```

### Deque.offerFirst：从头部入队

`offerFirst(element)` 在头部插入并返回是否成功；有界双端队列满时返回 false。

```java
import java.util.ArrayDeque;
import java.util.Deque;

public class DequeOfferFirstDemo {
    public static void main(String[] args) {
        Deque<String> deque = new ArrayDeque<>();
        deque.offerFirst("urgent");
        System.out.println(deque);
        // 输出：[urgent]
    }
}
```

适合把紧急任务插到普通任务前面；`ArrayDeque` 不允许 null。

### Deque.offerLast：从尾部入队

`offerLast(element)` 在尾部插入并返回是否成功；有界双端队列满时返回 false。

```java
import java.util.ArrayDeque;
import java.util.Deque;

public class DequeOfferLastDemo {
    public static void main(String[] args) {
        Deque<String> deque = new ArrayDeque<>();
        deque.offerLast("normal");
        System.out.println(deque);
        // 输出：[normal]
    }
}
```

配合 `pollFirst()` 可以按先进先出的顺序处理任务。

### Deque.pollFirst：从头部取出

pollFirst 返回并删除头部元素，双端队列为空时返回 null。

```java
import java.util.ArrayDeque;
import java.util.Deque;

public class DequePollFirstDemo {
    public static void main(String[] args) {
        Deque<Integer> deque = new ArrayDeque<>();
        deque.addLast(1);
        deque.addLast(2);
        System.out.println(deque.pollFirst());
        // 输出：1
        System.out.println(deque);
        // 输出：[2]
    }
}
```

### Deque.pollLast：从尾部取出

pollLast 返回并删除尾部元素，双端队列为空时返回 null。

```java
import java.util.ArrayDeque;
import java.util.Deque;

public class DequePollLastDemo {
    public static void main(String[] args) {
        Deque<Integer> deque = new ArrayDeque<>();
        deque.addLast(1);
        deque.addLast(2);
        System.out.println(deque.pollLast());
        // 输出：2
        System.out.println(deque);
        // 输出：[1]
    }
}
```

### Deque.peekFirst：查看头部

peekFirst 返回但不删除头部元素，双端队列为空时返回 null。

```java
import java.util.ArrayDeque;
import java.util.Deque;

public class DequePeekFirstDemo {
    public static void main(String[] args) {
        Deque<Integer> deque = new ArrayDeque<>();
        deque.addLast(1);
        deque.addLast(2);
        System.out.println(deque.peekFirst());
        // 输出：1
        System.out.println(deque);
        // 输出：[1, 2]
    }
}
```

### Deque.peekLast：查看尾部

peekLast 返回但不删除尾部元素，双端队列为空时返回 null。

```java
import java.util.ArrayDeque;
import java.util.Deque;

public class DequePeekLastDemo {
    public static void main(String[] args) {
        Deque<Integer> deque = new ArrayDeque<>();
        deque.addLast(1);
        deque.addLast(2);
        System.out.println(deque.peekLast());
        // 输出：2
        System.out.println(deque);
        // 输出：[1, 2]
    }
}
```

### Deque.push：压入栈顶

push 从头部压入元素，普通栈场景优先 Deque 而不是遗留 Stack。

```java
import java.util.ArrayDeque;
import java.util.Deque;

public class DequePushDemo {
    public static void main(String[] args) {
        Deque<String> stack = new ArrayDeque<>();
        stack.push("page-1");
        System.out.println(stack);
        // 输出：[page-1]
    }
}
```

### Deque.pop：弹出栈顶

pop 返回并删除头部元素，空栈调用会抛 NoSuchElementException。

```java
import java.util.ArrayDeque;
import java.util.Deque;

public class DequePopDemo {
    public static void main(String[] args) {
        Deque<String> stack = new ArrayDeque<>();
        stack.push("page-1");
        stack.push("page-2");
        System.out.println(stack.pop());
        // 输出：page-2
    }
}
```

### Deque.peek：查看栈顶

peek 返回但不删除头部元素，空栈时返回 null。

```java
import java.util.ArrayDeque;
import java.util.Deque;

public class DequeStackPeekDemo {
    public static void main(String[] args) {
        Deque<String> stack = new ArrayDeque<>();
        stack.push("page-1");
        System.out.println(stack.peek());
        // 输出：page-1
        System.out.println(stack.size());
        // 输出：1
    }
}
```

### PriorityQueue.offer：按优先级入队

`offer(element)` 把元素加入优先队列并返回 true；默认自然顺序下较小元素先出队。

```java
import java.util.PriorityQueue;
import java.util.Queue;

public class PriorityQueueDemo {
    public static void main(String[] args) {
        Queue<Integer> queue = new PriorityQueue<>();
        queue.offer(30);
        queue.offer(10);
        queue.offer(20);
        System.out.println(queue.offer(20));
        // 输出：true
        System.out.println(queue.peek());
        // 输出：10
    }
}
```

元素必须能相互比较且不能为 null；相同优先级的出队顺序没有保证。

### PriorityQueue.poll：取出最高优先级元素

`poll()` 返回并删除当前队首，空队列返回 null。

```java
import java.util.PriorityQueue;

public class PriorityQueuePollDemo {
    public static void main(String[] args) {
        PriorityQueue<Integer> queue = new PriorityQueue<>();
        queue.offer(30);
        queue.offer(10);
        queue.offer(20);
        System.out.println(queue.poll());
        // 输出：10
    }
}
```

默认自然顺序下队首最小；自定义比较器后按其顺序决定。遍历队列不保证排序，需连续 poll 才按优先级取出。

### PriorityQueue.peek：查看最高优先级元素

peek 查看但不删除当前最高优先级元素，空队列时返回 null。

```java
import java.util.PriorityQueue;

public class PriorityQueuePeekDemo {
    public static void main(String[] args) {
        PriorityQueue<Integer> queue = new PriorityQueue<>();
        queue.offer(30);
        queue.offer(10);
        System.out.println(queue.peek());
        // 输出：10
        System.out.println(queue.size());
        // 输出：2
    }
}
```

### 使用 Comparator 自定义优先级

构造器传 Comparator 后，poll 按比较器取出元素；比较器要稳定，否则优先级变化会破坏预期。

```java
import java.util.Comparator;
import java.util.PriorityQueue;

public class CustomPriorityQueueDemo {
    public static void main(String[] args) {
        PriorityQueue<String> queue =
            new PriorityQueue<>(Comparator.comparingInt(String::length).reversed());
        queue.offer("a");
        queue.offer("long");
        System.out.println(queue.poll());
        // 输出：long
    }
}
```
## 不常用但需要知道

### BlockingQueue.put：等待容量后入队

`put(element)` 用于生产者向有界队列交接任务；队列满时等待有空间，没有返回值。等待期间线程可能被中断并抛出 `InterruptedException`，调用方应传播异常或按线程取消策略处理，不能悄悄忽略。下面容量足够，因此不会等待。

```java
import java.util.concurrent.ArrayBlockingQueue;
import java.util.concurrent.BlockingQueue;

public class BlockingQueuePutDemo {
    public static void main(String[] args) throws InterruptedException {
        BlockingQueue<String> queue = new ArrayBlockingQueue<>(2);
        queue.put("task-1");
        System.out.println(queue.size());
        // 输出：1
    }
}
```

### BlockingQueue.take：等待元素后出队

`take()` 返回并删除队首；队列为空时等待生产者放入元素，适合消费者线程。等待期间也可能抛出 `InterruptedException`。不要在没有生产者的单线程流程中对空队列调用它，否则会一直等待。

```java
import java.util.concurrent.ArrayBlockingQueue;
import java.util.concurrent.BlockingQueue;

public class BlockingQueueTakeDemo {
    public static void main(String[] args) throws InterruptedException {
        BlockingQueue<String> queue = new ArrayBlockingQueue<>(2);
        queue.put("task-1");
        System.out.println(queue.take());
        // 输出：task-1
    }
}
```

### BlockingQueue.offer：非阻塞入队

offer 不等待容量，适合由调用方决定队列满时丢弃、重试还是降级。

```java
import java.util.concurrent.ArrayBlockingQueue;
import java.util.concurrent.BlockingQueue;

public class BlockingQueueOfferDemo {
    public static void main(String[] args) {
        BlockingQueue<String> queue = new ArrayBlockingQueue<>(1);
        boolean accepted = queue.offer("task");
        boolean rejected = queue.offer("overflow");
        System.out.println(accepted + ", " + rejected);
        // 输出：true, false
    }
}
```

### BlockingQueue.poll：非阻塞出队

poll 不等待元素，队列为空时返回 null；带 timeout 的重载会等待并可能被中断。

```java
import java.util.concurrent.ArrayBlockingQueue;
import java.util.concurrent.BlockingQueue;

public class BlockingQueuePollDemo {
    public static void main(String[] args) {
        BlockingQueue<String> queue = new ArrayBlockingQueue<>(1);
        queue.offer("task");
        System.out.println(queue.poll());
        // 输出：task
        System.out.println(queue.poll());
        // 输出：null
    }
}
```

### ConcurrentLinkedQueue：无界非阻塞并发队列

ConcurrentLinkedQueue 适合多线程下非阻塞入队出队，但不提供等待能力，也不适合把 size 当作精确并发协调条件。

```java
import java.util.Queue;
import java.util.concurrent.ConcurrentLinkedQueue;

public class ConcurrentQueueDemo {
    public static void main(String[] args) {
        Queue<String> queue = new ConcurrentLinkedQueue<>();
        queue.offer("task");
        System.out.println(queue.poll());
        // 输出：task
    }
}
```

### Deque.removeFirstOccurrence：从头部方向删除匹配项

`removeFirstOccurrence(value)` 按 `equals` 从头向尾删除第一个匹配元素，删除成功返回 true，没有匹配项返回 false。其他重复元素保留，适合只撤销最早的一项。

```java
import java.util.ArrayDeque;
import java.util.Deque;

public class DequeRemoveFirstOccurrenceDemo {
    public static void main(String[] args) {
        Deque<String> deque = new ArrayDeque<>();
        deque.addLast("a");
        deque.addLast("b");
        deque.addLast("a");
        deque.removeFirstOccurrence("a");
        System.out.println(deque);
        // 输出：[b, a]
    }
}
```

### Deque.removeLastOccurrence：从尾部方向删除匹配项

`removeLastOccurrence(value)` 按 `equals` 从尾向头删除第一个匹配元素，删除成功返回 true，没有匹配项返回 false。适合保留较早的重复项。

```java
import java.util.ArrayDeque;
import java.util.Deque;

public class DequeRemoveLastOccurrenceDemo {
    public static void main(String[] args) {
        Deque<String> deque = new ArrayDeque<>();
        deque.addLast("a");
        deque.addLast("b");
        deque.addLast("a");
        deque.removeLastOccurrence("a");
        System.out.println(deque);
        // 输出：[a, b]
    }
}
```

### Queue.toArray：查看当前快照

toArray 只得到某一时刻的数组，在并发队列中不能把它当作后续操作的事务快照。

```java
import java.util.ArrayDeque;
import java.util.Queue;

public class QueueToArrayDemo {
    public static void main(String[] args) {
        Queue<String> queue = new ArrayDeque<>();
        queue.offer("a");
        queue.offer("b");
        String[] values = queue.toArray(String[]::new);
        System.out.println(values.length + ", " + values[0]);
        // 输出：2, a
    }
}
```
## 简单案例

```java
import java.util.ArrayDeque;
import java.util.Queue;

public class QueueSummaryDemo {
    public static void main(String[] args) {
        Queue<String> queue = new ArrayDeque<>();
        queue.offer("task");
        System.out.println(queue.poll());
        // 输出：task
    }
}
```

普通任务队列优先用 offer、poll、peek 表达空队列边界。

## 易混点

- ArrayDeque 不接受 null；null 作为 poll/peek 的空标记，因此不能放入队列。
- Queue 的 offer/poll/peek 失败返回值，add/remove/element 失败抛异常。
- PriorityQueue 的遍历顺序不保证有序，只有反复 poll 才能按优先级取出。
- ConcurrentLinkedQueue 不阻塞，BlockingQueue 才提供 put/take 等等待语义。

## 课后小问

1. 为什么普通 FIFO 业务优先 offer、poll、peek？
答案：它们用返回值表达满或空，不会把正常边界变成异常控制流。
解析：add、remove、element 适合“必须成功”的不变式；循环消费和可选任务通常更适合 offer、poll、peek。

2. 为什么 PriorityQueue 不能直接 for-each 当成排序结果？
答案：它只保证队首是最高优先级，内部堆结构不保证每个遍历相邻元素有序。
解析：需要有序结果应循环 poll，或复制到 List 后排序；不要依赖实现细节。

## 本节小结

- ArrayDeque 覆盖 FIFO 队列、双端队列和栈三类常见需求。
- PriorityQueue 按优先级取出但不保证遍历顺序。
- BlockingQueue 用于阻塞式生产消费，ConcurrentLinkedQueue 用于非阻塞并发交接。
- 选择 API 时先决定空/满边界是返回值还是异常。

## 快速回顾

- 能写出 Queue 的入队、出队和查看队首。
- 能用 Deque 实现双端进出和栈。
- 能解释 PriorityQueue、BlockingQueue、ConcurrentLinkedQueue 的区别。
- 能判断何时使用返回值 API、何时使用异常式 API。
