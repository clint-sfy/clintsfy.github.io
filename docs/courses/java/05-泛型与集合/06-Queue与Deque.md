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

offer 尝试把元素加入队尾，并用返回值表示是否成功。

```java
import java.util.ArrayDeque;
import java.util.Queue;

public class QueueOfferDemo {
    public static void main(String[] args) {
        Queue<String> queue = new ArrayDeque<>();
        // 初始状态：queue 当前为 new ArrayDeque<>()。
        boolean accepted = queue.offer("job-1");
        // 初始状态：accepted 当前为 queue.offer("job-1")。
        // 作用：offer 尝试把元素加入队尾，并用返回值表示是否成功。
        System.out.println(accepted + ", " + queue);
        // 输出：true, [job-1]
    }
}
```

### Queue.poll：取出队首

poll 返回并删除队首，队列为空时返回 null。

```java
import java.util.ArrayDeque;
import java.util.Queue;

public class QueuePollDemo {
    public static void main(String[] args) {
        Queue<String> queue = new ArrayDeque<>();
        // 初始状态：queue 当前为 new ArrayDeque<>()。
        queue.offer("job-1");
        System.out.println(queue.poll());
// 输出：job-1
        // 作用：poll 返回并删除队首，队列为空时返回 null。
        System.out.println(queue.poll());
        // 输出：null
    }
}
```

### Queue.peek：查看队首

peek 返回但不删除队首，队列为空时返回 null。

```java
import java.util.ArrayDeque;
import java.util.Queue;

public class QueuePeekDemo {
    public static void main(String[] args) {
        Queue<String> queue = new ArrayDeque<>();
        // 初始状态：queue 当前为 new ArrayDeque<>()。
        queue.offer("job-1");
        System.out.println(queue.peek());
// 输出：job-1
        // 作用：peek 返回但不删除队首，队列为空时返回 null。
        System.out.println(queue.size());
        // 输出：1
    }
}
```

### Queue.add：必须成功地入队

add 在无法加入元素时抛异常，适合把失败视为违背程序约束的场景。

```java
import java.util.ArrayDeque;
import java.util.Queue;

public class QueueAddDemo {
    public static void main(String[] args) {
        Queue<String> queue = new ArrayDeque<>();
        // 初始状态：queue 当前为 new ArrayDeque<>()。
        boolean added = queue.add("required");
        // 初始状态：added 当前为 queue.add("required")。
        // 作用：add 在无法加入元素时抛异常，适合把失败视为违背程序约束的场景。
        System.out.println(added + ", " + queue);
        // 输出：true, [required]
    }
}
```

### Queue.remove：必须成功地取出队首

remove 返回并删除队首，空队列调用会抛 NoSuchElementException。

```java
import java.util.ArrayDeque;
import java.util.Queue;

public class QueueRemoveDemo {
    public static void main(String[] args) {
        Queue<String> queue = new ArrayDeque<>();
        // 初始状态：queue 当前为 new ArrayDeque<>()。
        queue.add("required");
        System.out.println(queue.remove());
// 输出：required
        // 作用：remove 返回并删除队首，空队列调用会抛 NoSuchElementException。
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
        // 初始状态：queue 当前为 new ArrayDeque<>()。
        queue.add("required");
        System.out.println(queue.element());
// 输出：required
        // 作用：element 返回但不删除队首，空队列调用会抛 NoSuchElementException。
        System.out.println(queue.size());
        // 输出：1
    }
}
```

### Deque.offerFirst：从头部入队

offerFirst 尝试从双端队列头部加入元素，并返回是否成功。

```java
import java.util.ArrayDeque;
import java.util.Deque;

public class DequeOfferFirstDemo {
    public static void main(String[] args) {
        Deque<String> deque = new ArrayDeque<>();
        // 初始状态：deque 当前为 new ArrayDeque<>()。
        deque.offerFirst("urgent");
        // 作用：offerFirst 尝试从双端队列头部加入元素，并返回是否成功。
        System.out.println(deque);
        // 输出：[urgent]
    }
}
```

### Deque.offerLast：从尾部入队

offerLast 尝试从双端队列尾部加入元素，并返回是否成功。

```java
import java.util.ArrayDeque;
import java.util.Deque;

public class DequeOfferLastDemo {
    public static void main(String[] args) {
        Deque<String> deque = new ArrayDeque<>();
        // 初始状态：deque 当前为 new ArrayDeque<>()。
        deque.offerLast("normal");
        // 作用：offerLast 尝试从双端队列尾部加入元素，并返回是否成功。
        System.out.println(deque);
        // 输出：[normal]
    }
}
```

### Deque.pollFirst：从头部取出

pollFirst 返回并删除头部元素，双端队列为空时返回 null。

```java
import java.util.ArrayDeque;
import java.util.Deque;

public class DequePollFirstDemo {
    public static void main(String[] args) {
        Deque<Integer> deque = new ArrayDeque<>();
        // 初始状态：deque 当前为 new ArrayDeque<>()。
        deque.addLast(1);
        deque.addLast(2);
        System.out.println(deque.pollFirst());
// 输出：1
        // 作用：pollFirst 返回并删除头部元素，双端队列为空时返回 null。
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
        // 初始状态：deque 当前为 new ArrayDeque<>()。
        deque.addLast(1);
        deque.addLast(2);
        System.out.println(deque.pollLast());
// 输出：2
        // 作用：pollLast 返回并删除尾部元素，双端队列为空时返回 null。
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
        // 初始状态：deque 当前为 new ArrayDeque<>()。
        deque.addLast(1);
        deque.addLast(2);
        System.out.println(deque.peekFirst());
// 输出：1
        // 作用：peekFirst 返回但不删除头部元素，双端队列为空时返回 null。
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
        // 初始状态：deque 当前为 new ArrayDeque<>()。
        deque.addLast(1);
        deque.addLast(2);
        System.out.println(deque.peekLast());
// 输出：2
        // 作用：peekLast 返回但不删除尾部元素，双端队列为空时返回 null。
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
        // 初始状态：stack 当前为 new ArrayDeque<>()。
        stack.push("page-1");
        // 作用：push 从头部压入元素，普通栈场景优先 Deque 而不是遗留 Stack。
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
        // 初始状态：stack 当前为 new ArrayDeque<>()。
        stack.push("page-1");
        stack.push("page-2");
        System.out.println(stack.pop());
// 输出：page-2
        // 作用：pop 返回并删除头部元素，空栈调用会抛 NoSuchElementException。
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
        // 初始状态：stack 当前为 new ArrayDeque<>()。
        stack.push("page-1");
        System.out.println(stack.peek());
// 输出：page-1
        // 作用：peek 返回但不删除头部元素，空栈时返回 null。
        System.out.println(stack.size());
        // 输出：1
    }
}
```

### PriorityQueue.offer：按优先级入队

offer 把元素加入优先级队列，默认由自然顺序决定队首。

```java
import java.util.PriorityQueue;
import java.util.Queue;

public class PriorityQueueDemo {
    public static void main(String[] args) {
        Queue<Integer> queue = new PriorityQueue<>();
        // 初始状态：queue 当前为 new PriorityQueue<>()。
        queue.offer(30);
        // 作用：offer 把元素加入优先级队列，默认由自然顺序决定队首。
        queue.offer(10);
// // 关键变化：queue.offer(10) 使用括号内的具体实参更新接收对象状态。
        queue.offer(20);
// // 关键变化：queue.offer(20) 使用括号内的具体实参更新接收对象状态。
        System.out.println(queue.offer(20));
// 输出：true
        System.out.println(queue.peek());
        // 输出：10
    }
}
```

### PriorityQueue.poll：取出最高优先级元素

poll 删除当前最小元素，遍历顺序本身不代表完整排序结果。

```java
import java.util.PriorityQueue;

public class PriorityQueuePollDemo {
    public static void main(String[] args) {
        PriorityQueue<Integer> queue = new PriorityQueue<>();
        // 初始状态：queue 当前为 new PriorityQueue<>()。
        queue.offer(30);
        queue.offer(10);
        queue.offer(20);
        System.out.println(queue.poll());
// 输出：10
        // 作用：poll 删除当前最小元素，遍历顺序本身不代表完整排序结果。
    }
}
```

### PriorityQueue.peek：查看最高优先级元素

peek 查看但不删除当前最高优先级元素，空队列时返回 null。

```java
import java.util.PriorityQueue;

public class PriorityQueuePeekDemo {
    public static void main(String[] args) {
        PriorityQueue<Integer> queue = new PriorityQueue<>();
        // 初始状态：queue 当前为 new PriorityQueue<>()。
        queue.offer(30);
        queue.offer(10);
        System.out.println(queue.peek());
// 输出：10
        // 作用：peek 查看但不删除当前最高优先级元素，空队列时返回 null。
        System.out.println(queue.size());
        // 输出：2
    }
}
```

### 使用 Comparator 自定义优先级

构造器传 Comparator 后，poll 按比较器取出元素；比较器要稳定，否则优先级变化会破坏预期。

```java
// 语义：构造器传 Comparator 后，poll 按比较器取出元素。
// 调用参数：代码依次使用 "a"、"long"。
import java.util.Comparator;
import java.util.PriorityQueue;

public class CustomPriorityQueueDemo {
    public static void main(String[] args) {
        PriorityQueue<String> queue =
            new PriorityQueue<>(Comparator.comparingInt(String::length).reversed());
// // 关键变化：PriorityQueue<String> queue = 使用表达式中的具体参数完成本次调用。
// 初始状态：表达式为 PriorityQueue<String> queue =。
        queue.offer("a");
        queue.offer("long");
        System.out.println(queue.poll());
        // 输出：long
    }
}
```
## 不常用但需要知道

### BlockingQueue.put、take：阻塞式生产消费

put 在容量满时等待，take 在队列空时等待；它适合线程间交接，不要在不需要阻塞的单线程逻辑中使用。

```java
import java.util.concurrent.ArrayBlockingQueue;
import java.util.concurrent.BlockingQueue;

public class BlockingQueueDemo {
// 初始状态：queue 是容量为 2 的空 ArrayBlockingQueue。
// 初始状态：put("task-1") 入队，take() 会移除并返回它。
    public static void main(String[] args) throws InterruptedException {
        BlockingQueue<String> queue = new ArrayBlockingQueue<>(2);
        // 初始状态：queue 当前为 new ArrayBlockingQueue<>(2)。
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
        // 初始状态：queue 当前为 new ArrayBlockingQueue<>(1)。
        boolean accepted = queue.offer("task");
        // 作用：通过 BlockingQueue.offer 非阻塞入队。
        boolean rejected = queue.offer("overflow");
// 返回：rejected 接收 queue.offer("overflow") 的返回值。
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
        // 初始状态：queue 当前为 new ArrayBlockingQueue<>(1)。
        queue.offer("task");
        System.out.println(queue.poll());
// 输出：task
        // 作用：通过 BlockingQueue.poll 非阻塞出队。
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
// 初始状态：queue 是空 ConcurrentLinkedQueue。
// 初始状态：offer("task") 非阻塞入队，poll() 移除队头。
    public static void main(String[] args) {
        Queue<String> queue = new ConcurrentLinkedQueue<>();
// 输入：queue 的初始值为 new ConcurrentLinkedQueue<>()。
        // 作用：ConcurrentLinkedQueue 适合多线程下非阻塞入队出队，但不提供等待能力，也不适合把 size 当作精确并发协调条件。
        queue.offer("task");
        System.out.println(queue.poll());
        // 输出：task
    }
}
```

### Deque.removeFirstOccurrence：从头部方向删除匹配项

removeFirstOccurrence 按 equals 从头向尾删除第一个匹配元素。

```java
import java.util.ArrayDeque;
import java.util.Deque;

public class DequeRemoveFirstOccurrenceDemo {
    public static void main(String[] args) {
        Deque<String> deque = new ArrayDeque<>();
        // 初始状态：deque 当前为 new ArrayDeque<>()。
        deque.addLast("a");
        deque.addLast("b");
        deque.addLast("a");
        deque.removeFirstOccurrence("a");
        // 作用：通过 Deque.removeFirstOccurrence 从头部方向删除匹配项。
        System.out.println(deque);
        // 输出：[b, a]
    }
}
```

### Deque.removeLastOccurrence：从尾部方向删除匹配项

removeLastOccurrence 按 equals 从尾向头删除第一个匹配元素。

```java
import java.util.ArrayDeque;
import java.util.Deque;

public class DequeRemoveLastOccurrenceDemo {
    public static void main(String[] args) {
        Deque<String> deque = new ArrayDeque<>();
        // 初始状态：deque 当前为 new ArrayDeque<>()。
        deque.addLast("a");
        deque.addLast("b");
        deque.addLast("a");
        deque.removeLastOccurrence("a");
        // 作用：通过 Deque.removeLastOccurrence 从尾部方向删除匹配项。
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
        // 初始状态：queue 当前为 new ArrayDeque<>()。
        queue.offer("a");
        queue.offer("b");
        String[] values = queue.toArray(String[]::new);
        // 作用：通过 Queue.toArray 查看当前快照。
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
