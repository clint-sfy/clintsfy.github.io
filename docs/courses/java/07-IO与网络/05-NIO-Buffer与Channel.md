---
title: NIO Buffer 与 Channel
date: 2026-09-27
category: Java基础快速入门
tags:
  - Java
  - NIO
  - Buffer
  - Channel
description: 直接用 Java 案例速查 ByteBuffer 状态、FileChannel 读写、映射、传输和 Selector 边界。
---

# NIO Buffer 与 Channel

## 学习目标

- 能解释 Buffer 的 capacity、position、limit 和 mark 状态。
- 会用 FileChannel 完成分块读写、传输和内存映射。
- 能判断 Selector、异步文件通道和普通流之间的适用边界。

## 核心知识点

### 专业术语

- **Buffer**：一段带状态游标的内存区域，Channel 通过它批量交换数据。
- **Channel**：可读、可写或可传输数据的 I/O 通道，例如 `FileChannel`、`SocketChannel`。
- **position/limit/capacity**：当前读写位置、有效边界和底层容量。
- **Selector**：把多个非阻塞网络 Channel 的就绪事件集中到一个线程处理。

### 白话解释与边界

Buffer 不是“自动增长的集合”，写入前要留意容量，读写模式转换要调用 `flip`。Channel 的一次 `read` 或 `write` 也可能只处理一部分数据，必须循环检查返回值。Selector 适合大量非阻塞网络连接，不会自动让普通文件 Channel 变成非阻塞；简单文件读写通常使用 Files 或阻塞式 FileChannel 更清晰。

## 常用用法

### `ByteBuffer.allocate` 与 `put`

```java
import java.nio.ByteBuffer;

public class ByteBufferPutDemo {
    public static void main(String[] args) {
        ByteBuffer buffer = ByteBuffer.allocate(4);
        buffer.put((byte) 10).put((byte) 20);
        System.out.println(buffer.position() + "/" + buffer.limit() + "/" + buffer.capacity());
        // 输出：2/4/4
    }
}
```

`allocate` 创建堆缓冲区，`position` 会随着写入前进；写入超出容量会抛 `BufferOverflowException`，容量要按协议或分块策略规划。

### `flip`：从写模式切换到读模式

```java
import java.nio.ByteBuffer;

public class ByteBufferFlipDemo {
    public static void main(String[] args) {
        ByteBuffer buffer = ByteBuffer.allocate(4);
        buffer.put((byte) 10).put((byte) 20);
        buffer.flip();
        System.out.println(buffer.get() + "," + buffer.get());
        // 输出：10,20
    }
}
```

`flip` 把当前 position 变成 limit，再把 position 归零；每次写完准备读都要正确切换，否则读到的可能是空区间。

### `get` 与 `hasRemaining`：读取有效数据

```java
import java.nio.ByteBuffer;

public class ByteBufferGetDemo {
    public static void main(String[] args) {
        ByteBuffer buffer = ByteBuffer.wrap(new byte[]{1, 2, 3});
        while (buffer.hasRemaining()) {
            System.out.println(buffer.get());
            // 输出：1
            // 输出：2
            // 输出：3
        }
    }
}
```

`hasRemaining` 判断 position 是否小于 limit；相对 `get()` 会推进 position，绝对 `get(index)` 不会改变游标。

### `clear` 与 `compact`：准备复用缓冲区

```java
import java.nio.ByteBuffer;

public class ByteBufferReuseDemo {
    public static void main(String[] args) {
        ByteBuffer buffer = ByteBuffer.allocate(4);
        buffer.put((byte) 1).put((byte) 2);
        buffer.flip();
        System.out.println(buffer.get());
        // 输出：1
        buffer.compact();
        buffer.put((byte) 3).flip();
        System.out.println(buffer.get() + "," + buffer.get());
        // 输出：2,3
    }
}
```

`clear` 丢弃尚未读取的内容并准备全量重写；`compact` 保留剩余内容并把它移到缓冲区开头，适合处理半包协议。

### `rewind`、`mark` 与 `reset`

```java
import java.nio.ByteBuffer;

public class ByteBufferMarkDemo {
    public static void main(String[] args) {
        ByteBuffer buffer = ByteBuffer.wrap(new byte[]{1, 2, 3});
        buffer.get();
        buffer.mark();
        int second = buffer.get();
        buffer.reset();
        System.out.println(second + "," + buffer.get());
        // 输出：2,2
    }
}
```

`rewind` 只把 position 归零并保留 limit，`mark/reset` 用于短暂回看；调用 `clear`、`flip` 等状态操作后 mark 可能失效。

### `FileChannel.read`：分块读取文件

```java
import java.nio.ByteBuffer;
import java.nio.channels.FileChannel;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.StandardOpenOption;

public class FileChannelReadDemo {
    public static void main(String[] args) throws Exception {
        Path file = Files.createTempFile("channel-read-", ".txt");
        Files.writeString(file, "java");
        try (FileChannel channel = FileChannel.open(file, StandardOpenOption.READ)) {
            ByteBuffer buffer = ByteBuffer.allocate(8);
            int count = channel.read(buffer);
            System.out.println(count);
            // 输出：4
        }
        Files.deleteIfExists(file);
    }
}
```

`read` 返回实际读到的字节数，`-1` 表示 EOF；不能假设一次 read 会填满 Buffer 或读完文件。

### `FileChannel.write`：循环写出 Buffer

```java
import java.nio.ByteBuffer;
import java.nio.channels.FileChannel;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.StandardOpenOption;

public class FileChannelWriteDemo {
    public static void main(String[] args) throws Exception {
        Path file = Files.createTempFile("channel-write-", ".txt");
        try (FileChannel channel = FileChannel.open(file, StandardOpenOption.WRITE)) {
            ByteBuffer buffer = ByteBuffer.wrap("java".getBytes());
            while (buffer.hasRemaining()) {
                channel.write(buffer);
            }
        }
        System.out.println(Files.size(file));
        // 输出：4
        Files.deleteIfExists(file);
    }
}
```

`write` 也可能只消费部分 Buffer；循环 `hasRemaining` 是可靠写出模式。需要强制落盘时再考虑 `force` 的成本。

### `FileChannel.position` 与随机访问

```java
import java.nio.ByteBuffer;
import java.nio.channels.FileChannel;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.StandardOpenOption;

public class FileChannelPositionDemo {
    public static void main(String[] args) throws Exception {
        Path file = Files.createTempFile("channel-position-", ".bin");
        Files.write(file, new byte[]{10, 20, 30});
        try (FileChannel channel = FileChannel.open(file, StandardOpenOption.READ)) {
            channel.position(1);
            ByteBuffer buffer = ByteBuffer.allocate(1);
            channel.read(buffer);
            buffer.flip();
            System.out.println(buffer.get());
            // 输出：20
        }
        Files.deleteIfExists(file);
    }
}
```

随机访问适合固定格式文件和分块任务；多个线程共享同一 Channel 时要明确 position 是否共享，必要时使用带 position 参数的读写方法。

### `transferTo` 与 `transferFrom`：通道间传输

```java
import java.nio.channels.FileChannel;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.StandardOpenOption;

public class FileChannelTransferDemo {
    public static void main(String[] args) throws Exception {
        Path source = Files.createTempFile("channel-source-", ".bin");
        Path target = Files.createTempFile("channel-target-", ".bin");
        Files.write(source, new byte[]{1, 2, 3});
        try (var in = FileChannel.open(source, StandardOpenOption.READ);
             var out = FileChannel.open(target, StandardOpenOption.WRITE)) {
            long copied = in.transferTo(0, in.size(), out);
            System.out.println(copied);
            // 输出：3
        }
        Files.deleteIfExists(source);
        Files.deleteIfExists(target);
    }
}
```

通道传输可减少用户态复制，但返回值仍可能小于请求长度，跨平台和大文件场景要循环传输。

### `FileChannel.map`：内存映射文件

```java
import java.nio.channels.FileChannel;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.StandardOpenOption;

public class MappedByteBufferDemo {
    public static void main(String[] args) throws Exception {
        Path file = Files.createTempFile("channel-map-", ".bin");
        Files.write(file, new byte[]{7});
        try (var channel = FileChannel.open(file, StandardOpenOption.READ)) {
            var mapped = channel.map(FileChannel.MapMode.READ_ONLY, 0, 1);
            System.out.println(mapped.get(0));
            // 输出：7
        }
        Files.deleteIfExists(file);
    }
}
```

映射适合随机访问大文件，但会占用虚拟地址空间，生命周期和刷盘语义也更复杂；不要把它当成所有文件读取的默认方案。

### `Selector`：注册非阻塞 Channel

```java
import java.nio.channels.Selector;
import java.nio.channels.SelectionKey;
import java.nio.channels.SocketChannel;

public class SelectorRegisterDemo {
    public static void main(String[] args) throws Exception {
        try (Selector selector = Selector.open(); SocketChannel channel = SocketChannel.open()) {
            channel.configureBlocking(false);
            channel.register(selector, SelectionKey.OP_CONNECT);
            System.out.println(selector.keys().size());
            // 输出：1
        }
    }
}
```

Selector 只对支持非阻塞模式的网络 Channel 有意义；事件循环必须处理 key 失效、异常、读写部分完成和唤醒。

## 不常用但需要知道

### `ByteBuffer.allocateDirect`：堆外缓冲

```java
import java.nio.ByteBuffer;

public class DirectBufferDemo {
    public static void main(String[] args) {
        ByteBuffer buffer = ByteBuffer.allocateDirect(4);
        buffer.put((byte) 1).flip();
        System.out.println(buffer.get());
        // 输出：1
    }
}
```

Direct Buffer 可能减少 native I/O 的复制，但分配和回收成本更高；只有在长期、批量的底层 I/O 场景中经验证后才使用。

### `slice` 与 `duplicate`：共享或复制游标视图

```java
import java.nio.ByteBuffer;

public class BufferViewDemo {
    public static void main(String[] args) {
        ByteBuffer source = ByteBuffer.wrap(new byte[]{1, 2, 3});
        source.position(1);
        ByteBuffer slice = source.slice();
        slice.put(0, (byte) 9);
        System.out.println(source.get(1));
        // 输出：9
    }
}
```

`slice` 和 `duplicate` 共享底层数据但有独立游标；视图变化会影响源 Buffer 的内容，线程共享时尤其要明确所有权。

### `asReadOnlyBuffer`：只读视图

```java
import java.nio.ByteBuffer;

public class ReadOnlyBufferDemo {
    public static void main(String[] args) {
        ByteBuffer readOnly = ByteBuffer.wrap(new byte[]{1}).asReadOnlyBuffer();
        System.out.println(readOnly.isReadOnly());
        // 输出：true
    }
}
```

只读视图防止通过该引用修改内容，但不能阻止源 Buffer 修改底层数组；需要真正隔离时复制数据。

### `ScatteringByteChannel` 与 `GatheringByteChannel`

```java
import java.nio.ByteBuffer;
import java.nio.channels.FileChannel;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.StandardOpenOption;

public class ScatterGatherDemo {
    public static void main(String[] args) throws Exception {
        Path file = Files.createTempFile("scatter-gather-", ".bin");
        try (FileChannel channel = FileChannel.open(file, StandardOpenOption.WRITE)) {
            long count = channel.write(new ByteBuffer[]{ByteBuffer.wrap(new byte[]{1}), ByteBuffer.wrap(new byte[]{2})});
            System.out.println(count);
            // 输出：2
        }
        Files.deleteIfExists(file);
    }
}
```

Scatter/gather 适合固定头部加主体等协议格式；Buffer 数组的顺序、剩余量和部分写入都要由调用方管理。

### `AsynchronousFileChannel`：异步文件操作

```java
import java.nio.ByteBuffer;
import java.nio.channels.AsynchronousFileChannel;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.StandardOpenOption;

public class AsyncFileChannelDemo {
    public static void main(String[] args) throws Exception {
        Path file = Files.createTempFile("async-channel-", ".txt");
        Files.writeString(file, "java");
        try (var channel = AsynchronousFileChannel.open(file, StandardOpenOption.READ)) {
            var result = channel.read(ByteBuffer.allocate(4), 0).get();
            System.out.println(result);
            // 输出：4
        }
        Files.deleteIfExists(file);
    }
}
```

异步 Channel 的 completion handler/future 让等待方式不同，但不代表磁盘本身一定并行；需要结合线程池、队列和取消策略测量。

## 简单案例

```java
import java.nio.ByteBuffer;
import java.nio.channels.FileChannel;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.StandardOpenOption;

public class BufferChannelDemo {
    public static void main(String[] args) throws Exception {
        Path file = Files.createTempFile("buffer-channel-", ".txt");
        try (FileChannel channel = FileChannel.open(file, StandardOpenOption.WRITE, StandardOpenOption.READ)) {
            ByteBuffer write = ByteBuffer.wrap("NIO".getBytes());
            while (write.hasRemaining()) {
                channel.write(write);
            }
            channel.position(0);
            ByteBuffer read = ByteBuffer.allocate(3);
            channel.read(read);
            read.flip();
            System.out.println((char) read.get() + "" + (char) read.get() + (char) read.get());
            // 输出：NIO
        }
        Files.deleteIfExists(file);
    }
}
```

案例体现了写 Buffer、循环写入、移动 Channel position、读入和 flip 的完整状态流转。

## 易混点

- `capacity` 是总容量，`limit` 是当前有效边界，`position` 是下一次读写位置。
- `flip` 切换到读取已有数据，`clear` 准备覆盖，`compact` 保留未读数据。
- Channel 的 `read/write` 都可能部分完成，不能把一次调用当作全部数据。
- Selector 适合非阻塞网络，不会让普通 FileChannel 获得网络式事件循环。

## 课后小问

1. 为什么写入 ByteBuffer 后直接 `get()` 容易读不到数据？
答案：写入后 position 在数据末尾，若不 flip，读模式的有效区间仍不正确。
解析：`flip` 会把已写长度设为 limit，并把 position 归零，随后才能读取。

2. 为什么 FileChannel.write 要循环调用？
答案：一次 write 只保证尽力消费当前 Buffer，返回值可能小于剩余字节数。
解析：循环检查 `hasRemaining()` 才能保证整个 Buffer 被写出，网络 Channel 更应如此。

## 本节小结

- Buffer 用 position、limit、capacity 描述读写状态，状态切换决定数据是否可见。
- Channel 负责交换数据，读写都要处理部分完成和 EOF。
- FileChannel 支持随机访问、通道传输和映射，但复杂度随能力增加。
- Selector、异步文件和 Direct Buffer 只在明确的性能/并发边界中使用。

## 快速回顾

- 写后读通常是 `put -> flip -> get`。
- 复用 Buffer：丢弃旧数据用 `clear`，保留未读数据用 `compact`。
- FileChannel 读写要循环，transferTo 也要考虑部分传输。
- Selector 管网络事件，Files/阻塞 Channel 适合多数普通文件任务。
