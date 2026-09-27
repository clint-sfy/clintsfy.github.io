---
title: Queue 与 Deque
date: 2026-09-27
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

### ArrayDeque.offer、poll、peek：FIFO 队列

```java
import java.util.ArrayDeque;
import java.util.Queue;

public class QueueBasicDemo {
    public static void main(String[] args) {
        Queue<String> queue = new ArrayDeque<>();
        queue.offer("job-1");
        queue.offer("job-2");
        System.out.println(queue.peek() + ", " + queue.poll());
        // 输出：job-1, job-1
    }
}
```

offer 入队，poll 取出并删除队首，peek 只查看队首；空队列时 poll 和 peek 返回 null。

### Queue.add、remove、element：必须成功的操作

```java
import java.util.ArrayDeque;
import java.util.Queue;

public class QueueStrictDemo {
    public static void main(String[] args) {
        Queue<String> queue = new ArrayDeque<>();
        queue.add("required");
        String head = queue.element();
        String value = queue.remove();
        System.out.println(head + ", " + value);
        // 输出：required, required
    }
}
```

add、remove、element 在容量不足或队列为空时抛异常；业务循环通常优先 offer、poll、peek。

### Deque.offerFirst、offerLast：两端入队

```java
import java.util.ArrayDeque;
import java.util.Deque;

public class DequeEndsDemo {
    public static void main(String[] args) {
        Deque<String> deque = new ArrayDeque<>();
        deque.offerFirst("urgent");
        deque.offerLast("normal");
        System.out.println(deque.pollFirst() + ", " + deque.pollLast());
        // 输出：urgent, normal
    }
}
```

offerFirst 和 offerLast 分别从头尾放入；取出时使用对应的 pollFirst、pollLast，能把业务优先级写在代码中。

### Deque.pollFirst、pollLast、peekFirst、peekLast：两端取出与查看

```java
import java.util.ArrayDeque;
import java.util.Deque;

public class DequeReadDemo {
    public static void main(String[] args) {
        Deque<Integer> deque = new ArrayDeque<>();
        deque.addLast(1);
        deque.addLast(2);
        System.out.println(deque.peekFirst() + ", " + deque.peekLast());
        // 输出：1, 2
        System.out.println(deque.pollFirst() + ", " + deque.pollLast());
        // 输出：1, 2
    }
}
```

peek 不删除，poll 删除；空 Deque 时返回 null，适合把“没有任务”作为正常控制流。

### Deque.push、pop、peek：用 Deque 实现栈

```java
import java.util.ArrayDeque;
import java.util.Deque;

public class DequeStackDemo {
    public static void main(String[] args) {
        Deque<String> stack = new ArrayDeque<>();
        stack.push("page-1");
        stack.push("page-2");
        System.out.println(stack.peek() + ", " + stack.pop());
        // 输出：page-2, page-2
    }
}
```

push 等价于头部压入，pop 取出头部；普通栈场景优先 Deque，不要使用遗留 Stack。

### PriorityQueue.offer、poll、peek：按优先级取出

```java
import java.util.PriorityQueue;
import java.util.Queue;

public class PriorityQueueDemo {
    public static void main(String[] args) {
        Queue<Integer> queue = new PriorityQueue<>();
        queue.offer(30);
        queue.offer(10);
        queue.offer(20);
        System.out.println(queue.peek() + ", " + queue.poll());
        // 输出：10, 10
    }
}
```

默认自然顺序最小值优先；遍历 PriorityQueue 不等于排序遍历，只保证每次 poll 取出当前最高优先级元素。

### 使用 Comparator 自定义优先级

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

构造器传 Comparator 后，poll 按比较器取出元素；比较器要稳定，否则优先级变化会破坏预期。

## 不常用但需要知道

### BlockingQueue.put、take：阻塞式生产消费

```java
import java.util.concurrent.ArrayBlockingQueue;
import java.util.concurrent.BlockingQueue;

public class BlockingQueueDemo {
    public static void main(String[] args) throws InterruptedException {
        BlockingQueue<String> queue = new ArrayBlockingQueue<>(2);
        queue.put("task-1");
        System.out.println(queue.take());
        // 输出：task-1
    }
}
```

put 在容量满时等待，take 在队列空时等待；它适合线程间交接，不要在不需要阻塞的单线程逻辑中使用。

### BlockingQueue.offer、poll：带边界的非阻塞操作

```java
import java.util.concurrent.ArrayBlockingQueue;
import java.util.concurrent.BlockingQueue;

public class BlockingQueueTimedBoundaryDemo {
    public static void main(String[] args) {
        BlockingQueue<String> queue = new ArrayBlockingQueue<>(1);
        boolean accepted = queue.offer("task");
        boolean rejected = queue.offer("overflow");
        System.out.println(accepted + ", " + rejected);
        // 输出：true, false
    }
}
```

offer 和 poll 不等待，适合由调用方决定“满了丢弃、重试还是降级”的场景；带 timeout 的重载会抛 InterruptedException。

### ConcurrentLinkedQueue：无界非阻塞并发队列

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

ConcurrentLinkedQueue 适合多线程下非阻塞入队出队，但不提供等待能力，也不适合把 size 当作精确并发协调条件。

### Deque.removeFirstOccurrence、removeLastOccurrence：按值清理

```java
import java.util.ArrayDeque;
import java.util.Deque;

public class DequeOccurrenceDemo {
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

这两个方法按 equals 从指定方向删除一个匹配项；如果队列通常只按首尾消费，不必引入中间删除。

### Queue.toArray：查看当前快照

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

toArray 只得到某一时刻的数组，在并发队列中不能把它当作后续操作的事务快照。

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
