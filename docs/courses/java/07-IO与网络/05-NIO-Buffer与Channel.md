---
title: NIO Buffer 与 Channel
date: 2026-09-27T00:00:00.000Z
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

### 写入缓冲区：分配容量并推进游标

`allocate` 创建堆缓冲区，`position` 会随着写入前进；写入超出容量会抛 `BufferOverflowException`，容量要按协议或分块策略规划。

```java
// 说明：写入缓冲区：分配容量并推进游标。
import java.nio.ByteBuffer;

public class ByteBufferPutDemo {
    public static void main(String[] args) {
        ByteBuffer buffer = ByteBuffer.allocate(4);
        buffer.put((byte) 10).put((byte) 20);
// 关键变化：buffer.put((byte) 10).put((byte) 20);；依次写入 (byte) 10 和 (byte) 20，两个 put 都返回同一 ByteBuffer，position 前进到 2。
        System.out.println(buffer.position() + "/" + buffer.limit() + "/" + buffer.capacity());
        // 输出：2/4/4
    }
}
```

### `flip`：从写模式切换到读模式

`flip` 把当前 position 变成 limit，再把 position 归零；每次写完准备读都要正确切换，否则读到的可能是空区间。

```java
// 说明：flip：从写模式切换到读模式。
import java.nio.ByteBuffer;

public class ByteBufferFlipDemo {
    public static void main(String[] args) {
        ByteBuffer buffer = ByteBuffer.allocate(4);
        buffer.put((byte) 10).put((byte) 20);
// 关键变化：buffer.put((byte) 10).put((byte) 20);；依次写入 (byte) 10 和 (byte) 20，两个 put 都返回同一 ByteBuffer，position 前进到 2。
        buffer.flip();
        // 关键变化：buffer.flip();；调用 flip，实参为 无显式参数；将 buffer 切换到读模式，position 置 0、limit 设为此前写入长度；缓冲状态更新。
        System.out.println(buffer.get() + "," + buffer.get());
        // 输出：10,20
    }
}
```

### 读取缓冲区：消费有效区间

`hasRemaining` 判断 position 是否小于 limit；相对 `get()` 会推进 position，绝对 `get(index)` 不会改变游标。

```java
// 说明：读取缓冲区：消费有效区间。
import java.nio.ByteBuffer;

public class ByteBufferGetDemo {
    public static void main(String[] args) {
        ByteBuffer buffer = ByteBuffer.wrap(new byte[]{1, 2, 3});
        while (buffer.hasRemaining()) {
            System.out.println(buffer.get());
            // 输出：1
        }
    }
}
```

### 复用缓冲区：丢弃或保留未读数据

`clear` 丢弃尚未读取的内容并准备全量重写；`compact` 保留剩余内容并把它移到缓冲区开头，适合处理半包协议。

```java
// 说明：复用缓冲区：丢弃或保留未读数据。
import java.nio.ByteBuffer;

public class ByteBufferReuseDemo {
    public static void main(String[] args) {
        ByteBuffer buffer = ByteBuffer.allocate(4);
        buffer.put((byte) 1).put((byte) 2);
// 关键变化：buffer.put((byte) 1).put((byte) 2);；依次写入 (byte) 1 和 (byte) 2，两个 put 都返回同一 ByteBuffer，position 前进到 2。
        buffer.flip();
        // 关键变化：buffer.flip();；调用 flip，实参为 无显式参数；将 buffer 切换到读模式，position 置 0、limit 设为此前写入长度；缓冲状态更新。
        System.out.println(buffer.get());
        // 输出：1
        buffer.compact();
        // 关键变化：buffer.compact();；调用 compact，实参为 无显式参数；保留 buffer 的未读字节并切回写模式；position 移到剩余数据末端。
        buffer.put((byte) 3).flip();
// 关键变化：buffer.put((byte) 3).flip();；put 写入 (byte) 3 后返回同一 ByteBuffer，flip 将 position 置 0、limit 置 1。
        System.out.println(buffer.get() + "," + buffer.get());
        // 输出：2
    }
}
```

### 回看缓冲区：重置或恢复读取位置

`rewind` 只把 position 归零并保留 limit，`mark/reset` 用于短暂回看；调用 `clear`、`flip` 等状态操作后 mark 可能失效。

```java
// 说明：回看缓冲区：重置或恢复读取位置。
import java.nio.ByteBuffer;

public class ByteBufferMarkDemo {
    public static void main(String[] args) {
        ByteBuffer buffer = ByteBuffer.wrap(new byte[]{1, 2, 3});
        buffer.get();
        // 关键变化：buffer.get();；读取 buffer 当前 position 的字节并推进 position；缓冲内容本身不变。
        buffer.mark();
        // 关键变化：buffer.mark();；调用 mark，实参为 无显式参数；记录 buffer 当前 position 作为 mark；后续 reset 可回到该位置。
        int second = buffer.get();
        // 关键变化：int second = buffer.get();；读取 buffer 当前 position 的字节 2 并写入 second；position 前进，缓冲内容不变。
        buffer.reset();
        // 关键变化：buffer.reset();；调用 reset，实参为 无显式参数；将 buffer 的 position 恢复到最近 mark。
        System.out.println(second + "," + buffer.get());
        // 输出：2,2
    }
}
```

### `FileChannel.read`：分块读取文件

`read` 返回实际读到的字节数，`-1` 表示 EOF；不能假设一次 read 会填满 Buffer 或读完文件。

```java
// 说明：FileChannel.read：分块读取文件。
import java.nio.ByteBuffer;
import java.nio.channels.FileChannel;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.StandardOpenOption;

public class FileChannelReadDemo {
    public static void main(String[] args) throws Exception {
        Path file = Files.createTempFile("channel-read-", ".txt");
        Files.writeString(file, "java");
        // 关键变化：Files.writeString(file, "java");；将 "java" 写入路径 file；writeString 返回目标 Path，文件内容更新。
        try (FileChannel channel = FileChannel.open(file, StandardOpenOption.READ)) {
        // 输入：try (FileChannel channel = FileChannel.open(file, StandardOpenOption.READ)) {；资源变量 channel 接收 FileChannel.open(file, StandardOpenOption.READ)，try 结束时自动关闭。
        // 关键变化：try (FileChannel channel = FileChannel.open(file, StandardOpenOption.READ)) {；创建资源 channel，构造表达式为 FileChannel.open(file, StandardOpenOption.READ)；try 结束时关闭该资源。
            ByteBuffer buffer = ByteBuffer.allocate(8);
            int count = channel.read(buffer);
// 关键变化：int count = channel.read(buffer);；从文件读取 4 个字节“java”到 buffer，返回字节数 4 并写入 count；EOF 时才返回 -1。
            System.out.println(count);
            // 输出：4
        }
        Files.deleteIfExists(file);
        // 关键变化：Files.deleteIfExists(file);；删除路径 file；路径存在时返回 true，不存在时返回 false；文件系统状态更新。
    }
}
```

### `FileChannel.write`：循环写出 Buffer

`write` 也可能只消费部分 Buffer；循环 `hasRemaining` 是可靠写出模式。

```java
// 说明：FileChannel.write：循环写出 Buffer。
import java.nio.ByteBuffer;
import java.nio.channels.FileChannel;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.StandardOpenOption;

public class FileChannelWriteDemo {
    public static void main(String[] args) throws Exception {
        Path file = Files.createTempFile("channel-write-", ".txt");
        try (FileChannel channel = FileChannel.open(file, StandardOpenOption.WRITE)) {
        // 输入：try (FileChannel channel = FileChannel.open(file, StandardOpenOption.WRITE)) {；资源变量 channel 接收 FileChannel.open(file, StandardOpenOption.WRITE)，try 结束时自动关闭。
        // 关键变化：try (FileChannel channel = FileChannel.open(file, StandardOpenOption.WRITE)) {；创建资源 channel，构造表达式为 FileChannel.open(file, StandardOpenOption.WRITE)；try 结束时关闭该资源。
            ByteBuffer buffer = ByteBuffer.wrap("java".getBytes());
            while (buffer.hasRemaining()) {
                channel.write(buffer);
                // 关键变化：channel.write(buffer);；向 channel 写入 buffer 的剩余字节，返回本次写入字节数；buffer position 前进。
            }
        }
        System.out.println(Files.size(file));
        // 输出：4
        Files.deleteIfExists(file);
        // 关键变化：Files.deleteIfExists(file);；删除路径 file；路径存在时返回 true，不存在时返回 false；文件系统状态更新。
    }
}
```

需要强制落盘时再考虑 `force` 的成本。

### `FileChannel.position` 与随机访问

随机访问适合固定格式文件和分块任务；多个线程共享同一 Channel 时要明确 position 是否共享，必要时使用带 position 参数的读写方法。

```java
// 说明：FileChannel.position 与随机访问。
import java.nio.ByteBuffer;
import java.nio.channels.FileChannel;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.StandardOpenOption;

public class FileChannelPositionDemo {
    public static void main(String[] args) throws Exception {
        Path file = Files.createTempFile("channel-position-", ".bin");
        Files.write(file, new byte[]{10, 20, 30});
        // 关键变化：Files.write(file, new byte[]{10, 20, 30});；将 new byte[]{10, 20, 30} 写入路径 file；write 返回目标 Path，文件内容更新。
        try (FileChannel channel = FileChannel.open(file, StandardOpenOption.READ)) {
        // 输入：try (FileChannel channel = FileChannel.open(file, StandardOpenOption.READ)) {；资源变量 channel 接收 FileChannel.open(file, StandardOpenOption.READ)，try 结束时自动关闭。
        // 关键变化：try (FileChannel channel = FileChannel.open(file, StandardOpenOption.READ)) {；创建资源 channel，构造表达式为 FileChannel.open(file, StandardOpenOption.READ)；try 结束时关闭该资源。
            channel.position(1);
            // 关键变化：channel.position(1);；调用 position，实参为 1；将 channel 的 position 设置为 1；位置状态更新。
            ByteBuffer buffer = ByteBuffer.allocate(1);
            channel.read(buffer);
// 关键变化：channel.read(buffer);；从 position=1 读取 1 个字节 20 到 buffer，返回 1；EOF 时才返回 -1。
            buffer.flip();
            // 关键变化：buffer.flip();；调用 flip，实参为 无显式参数；将 buffer 切换到读模式，position 置 0、limit 设为此前写入长度；缓冲状态更新。
            System.out.println(buffer.get());
            // 输出：20
        }
        Files.deleteIfExists(file);
        // 关键变化：Files.deleteIfExists(file);；删除路径 file；路径存在时返回 true，不存在时返回 false；文件系统状态更新。
    }
}
```

### 通道间传输：减少用户态复制

通道传输可减少用户态复制，但返回值仍可能小于请求长度，跨平台和大文件场景要循环传输。

```java
// 说明：通道间传输：减少用户态复制。
import java.nio.channels.FileChannel;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.StandardOpenOption;

public class FileChannelTransferDemo {
    public static void main(String[] args) throws Exception {
        Path source = Files.createTempFile("channel-source-", ".bin");
        Path target = Files.createTempFile("channel-target-", ".bin");
        Files.write(source, new byte[]{1, 2, 3});
        // 关键变化：Files.write(source, new byte[]{1, 2, 3});；将 new byte[]{1, 2, 3} 写入路径 source；write 返回目标 Path，文件内容更新。
        try (var in = FileChannel.open(source, StandardOpenOption.READ);
        // 输入：try (var in = FileChannel.open(source, StandardOpenOption.READ);；资源变量 in 接收 FileChannel.open(source, StandardOpenOption.READ，try 结束时自动关闭。
        // 关键变化：try (var in = FileChannel.open(source, StandardOpenOption.READ);；创建资源 in，构造表达式为 FileChannel.open(source, StandardOpenOption.READ；try 结束时关闭该资源。
             var out = FileChannel.open(target, StandardOpenOption.WRITE)) {
            long copied = in.transferTo(0, in.size(), out);
            // 关键变化：long copied = in.transferTo(0, in.size(), out);；把 source 文件从位置 0 开始的全部字节传给 out，返回复制字节数 3 并写入 copied。
            System.out.println(copied);
            // 输出：3
        }
        Files.deleteIfExists(source);
        // 关键变化：Files.deleteIfExists(source);；删除路径 source；路径存在时返回 true，不存在时返回 false；文件系统状态更新。
        Files.deleteIfExists(target);
        // 关键变化：Files.deleteIfExists(target);；删除路径 target；路径存在时返回 true，不存在时返回 false；文件系统状态更新。
    }
}
```

### `FileChannel.map`：内存映射文件

映射适合随机访问大文件，但会占用虚拟地址空间，生命周期和刷盘语义也更复杂；不要把它当成所有文件读取的默认方案。

```java
// 说明：FileChannel.map：内存映射文件。
import java.nio.channels.FileChannel;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.StandardOpenOption;

public class MappedByteBufferDemo {
    public static void main(String[] args) throws Exception {
        Path file = Files.createTempFile("channel-map-", ".bin");
        Files.write(file, new byte[]{7});
        // 关键变化：Files.write(file, new byte[]{7});；将 new byte[]{7} 写入路径 file；write 返回目标 Path，文件内容更新。
        try (var channel = FileChannel.open(file, StandardOpenOption.READ)) {
        // 输入：try (var channel = FileChannel.open(file, StandardOpenOption.READ)) {；资源变量 channel 接收 FileChannel.open(file, StandardOpenOption.READ)，try 结束时自动关闭。
        // 关键变化：try (var channel = FileChannel.open(file, StandardOpenOption.READ)) {；创建资源 channel，构造表达式为 FileChannel.open(file, StandardOpenOption.READ)；try 结束时关闭该资源。
            var mapped = channel.map(FileChannel.MapMode.READ_ONLY, 0, 1);
            // 关键变化：var mapped = channel.map(FileChannel.MapMode.READ_ONLY, 0, 1);；在流上调用 map 处理元素，结果写入 mapped。
            System.out.println(mapped.get(0));
            // 输出：7
        }
        Files.deleteIfExists(file);
        // 关键变化：Files.deleteIfExists(file);；删除路径 file；路径存在时返回 true，不存在时返回 false；文件系统状态更新。
    }
}
```

### `Selector`：注册非阻塞 Channel

Selector 只对支持非阻塞模式的网络 Channel 有意义；事件循环必须处理 key 失效、异常、读写部分完成和唤醒。

```java
// 说明：Selector：注册非阻塞 Channel。
import java.nio.channels.Selector;
import java.nio.channels.SelectionKey;
import java.nio.channels.SocketChannel;

public class SelectorRegisterDemo {
    public static void main(String[] args) throws Exception {
        try (Selector selector = Selector.open(); SocketChannel channel = SocketChannel.open()) {
        // 输入：try (Selector selector = Selector.open(); SocketChannel channel = SocketChannel.open()) {；资源变量 selector 接收 Selector.open(); SocketChannel channel = SocketChannel.open()，try 结束时自动关闭。
        // 关键变化：try (Selector selector = Selector.open(); SocketChannel channel = SocketChannel.open()) {；创建资源 selector，构造表达式为 Selector.open(); SocketChannel channel = SocketChannel.open()；try 结束时关闭该资源。
            channel.configureBlocking(false);
            // 关键变化：channel.configureBlocking(false);；把 channel 的阻塞模式设置为 false，通道状态更新。
            channel.register(selector, SelectionKey.OP_CONNECT);
            // 关键变化：channel.register(selector, SelectionKey.OP_CONNECT);；调用 register，实参为 selector, SelectionKey.OP_CONNECT；向 selector 注册 channel 的事件 SelectionKey.OP_CONNECT，返回 SelectionKey。
            System.out.println(selector.keys().size());
            // 输出：1
        }
    }
}
```
## 不常用但需要知道

### `ByteBuffer.allocateDirect`：堆外缓冲

Direct Buffer 可能减少 native I/O 的复制，但分配和回收成本更高；只有在长期、批量的底层 I/O 场景中经验证后才使用。

```java
import java.nio.ByteBuffer;

public class DirectBufferDemo {
    public static void main(String[] args) {
        ByteBuffer buffer = ByteBuffer.allocateDirect(4);
        buffer.put((byte) 1).flip();
// 关键变化：buffer.put((byte) 1).flip();；put 写入 (byte) 1 后返回同一 ByteBuffer，flip 将 position 置 0、limit 置 1。
        System.out.println(buffer.get());
        // 输出：1
    }
}
```

### 创建缓冲区视图：共享数据并隔离游标

`slice` 和 `duplicate` 共享底层数据但有独立游标；视图变化会影响源 Buffer 的内容，线程共享时尤其要明确所有权。

```java
import java.nio.ByteBuffer;

public class BufferViewDemo {
    public static void main(String[] args) {
        ByteBuffer source = ByteBuffer.wrap(new byte[]{1, 2, 3});
        source.position(1);
        // 关键变化：source.position(1);；调用 position，实参为 1；将 source 的 position 设置为 1；位置状态更新。
        ByteBuffer slice = source.slice();
        slice.put(0, (byte) 9);
        // 关键变化：slice.put(0, (byte) 9);；按索引 0 向 slice 写入 (byte) 9；绝对写入不改变 position。
        System.out.println(source.get(1));
        // 输出：9
    }
}
```

### `asReadOnlyBuffer`：只读视图

只读视图防止通过该引用修改内容，但不能阻止源 Buffer 修改底层数组；需要真正隔离时复制数据。

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

### 分散与聚集 I/O：在多个缓冲区间传输

Scatter/gather 适合固定头部加主体等协议格式；Buffer 数组的顺序、剩余量和部分写入都要由调用方管理。

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
        // 输入：try (FileChannel channel = FileChannel.open(file, StandardOpenOption.WRITE)) {；资源变量 channel 接收 FileChannel.open(file, StandardOpenOption.WRITE)，try 结束时自动关闭。
        // 关键变化：try (FileChannel channel = FileChannel.open(file, StandardOpenOption.WRITE)) {；创建资源 channel，构造表达式为 FileChannel.open(file, StandardOpenOption.WRITE)；try 结束时关闭该资源。
            long count = channel.write(new ByteBuffer[]{ByteBuffer.wrap(new byte[]{1}), ByteBuffer.wrap(new byte[]{2})});
            // 关键变化：long count = channel.write(new ByteBuffer[]{ByteBuffer.wrap(new byte[]{1}), ByteBuffer.wrap(new byte[]{2})});；按顺序写入两个各含 1 字节的 ByteBuffer，返回写入字节总数 2 并写入 count。
            System.out.println(count);
            // 输出：2
        }
        Files.deleteIfExists(file);
        // 关键变化：Files.deleteIfExists(file);；删除路径 file；路径存在时返回 true，不存在时返回 false；文件系统状态更新。
    }
}
```

### `AsynchronousFileChannel`：异步文件操作

异步 Channel 的 completion handler/future 让等待方式不同，但不代表磁盘本身一定并行；需要结合线程池、队列和取消策略测量。

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
        // 关键变化：Files.writeString(file, "java");；将 "java" 写入路径 file；writeString 返回目标 Path，文件内容更新。
        try (var channel = AsynchronousFileChannel.open(file, StandardOpenOption.READ)) {
        // 输入：try (var channel = AsynchronousFileChannel.open(file, StandardOpenOption.READ)) {；资源变量 channel 接收 AsynchronousFileChannel.open(file, StandardOpenOption.READ)，try 结束时自动关闭。
        // 关键变化：try (var channel = AsynchronousFileChannel.open(file, StandardOpenOption.READ)) {；创建资源 channel，构造表达式为 AsynchronousFileChannel.open(file, StandardOpenOption.READ)；try 结束时关闭该资源。
            var result = channel.read(ByteBuffer.allocate(4), 0).get();
            // 关键变化：var result = channel.read(ByteBuffer.allocate(4), 0).get();；异步读取从位置 0 开始的 4 个字节，get 等待完成并把读取字节数 4 写入 result。
            System.out.println(result);
            // 输出：4
        }
        Files.deleteIfExists(file);
        // 关键变化：Files.deleteIfExists(file);；删除路径 file；路径存在时返回 true，不存在时返回 false；文件系统状态更新。
    }
}
```
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
        // 输入：try (FileChannel channel = FileChannel.open(file, StandardOpenOption.WRITE, StandardOpenOption.READ)) {；资源变量 channel 接收 FileChannel.open(file, StandardOpenOption.WRITE, StandardOpenOption.READ)，try 结束时自动关闭。
        // 关键变化：try (FileChannel channel = FileChannel.open(file, StandardOpenOption.WRITE, StandardOpenOption.READ)) {；创建资源 channel，构造表达式为 FileChannel.open(file, StandardOpenOption.WRITE, StandardOpenOption.READ)；try 结束时关闭该资源。
            ByteBuffer write = ByteBuffer.wrap("NIO".getBytes());
            while (write.hasRemaining()) {
                channel.write(write);
                // 关键变化：channel.write(write);；向 channel 写入 write 的剩余字节，返回本次写入字节数；write position 前进。
            }
            channel.position(0);
            // 关键变化：channel.position(0);；调用 position，实参为 0；将 channel 的 position 设置为 0；位置状态更新。
            ByteBuffer read = ByteBuffer.allocate(3);
            channel.read(read);
// 关键变化：channel.read(read);；从文件读取 3 个字节“NIO”到 read，返回 3；EOF 时才返回 -1。
            read.flip();
            // 关键变化：read.flip();；调用 flip，实参为 无显式参数；将 read 切换到读模式，position 置 0、limit 设为此前写入长度；缓冲状态更新。
            System.out.println((char) read.get() + "" + (char) read.get() + (char) read.get());
            // 输出：NIO
        }
        Files.deleteIfExists(file);
        // 关键变化：Files.deleteIfExists(file);；删除路径 file；路径存在时返回 true，不存在时返回 false；文件系统状态更新。
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
