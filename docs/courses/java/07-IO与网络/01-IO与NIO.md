---
title: I/O 与 NIO 文件处理
date: 2026-09-22T00:00:00.000Z
category: Java基础快速入门
tags:
  - Java
  - I/O
  - NIO
  - 文件
description: 从 I/O 类型选择开始，串起 Path、Files、字节流、字符流、Buffer 与 Channel 的文件处理边界。
---

# I/O 与 NIO 文件处理

## 学习目标

- 能按数据类型、文件大小和访问方式选择传统流或 NIO API。
- 能读懂 Path、Files、Stream、Buffer 与 Channel 的职责边界。
- 能把文件资源放进 try-with-resources，并明确字符集、异常和路径安全问题。

## 核心知识点

### 专业术语

- **I/O（Input/Output）**：程序与文件、网络或其他设备交换数据的过程。
- **Stream**：按顺序读写字节或字符的抽象，适合直接消费数据。
- **NIO（New I/O）**：以 `Path`、`Files`、`Channel` 和 `Buffer` 为中心的一组 API。
- **Charset**：字节与字符之间的编码规则，例如 UTF-8。

### 白话解释与边界

小文本可以用 `Files.readString` 一次读完；大文件、二进制文件或持续数据要使用缓冲、分块或流式处理。`Reader/Writer` 负责字符，`InputStream/OutputStream` 负责字节，不能只因为“内容看起来是文字”就忽略编码。现代文件代码优先使用 `Path`/`Files`，只有维护旧接口时才回到 `java.io.File`。

## 常用用法

### `Path.of`：构造文件系统路径

需要用多个路径片段构造与操作系统分隔符兼容的文件路径时使用 `Path.of`。

```java
// 说明：Path.of：构造文件系统路径。
import java.nio.file.Path;

Path path = Path.of("docs", "guide.txt");
// 输入：path 的初始值为 Path.of("docs", "guide.txt")。
// 作用：需要用多个路径片段构造与操作系统分隔符兼容的文件路径时使用 Path.of。
System.out.println(path.getFileName());
// 输出：guide.txt
```

### `Files.writeString`：写入短文本文件

需要一次写入能够放进内存的短文本时使用 `Files.writeString`，并应显式选择业务所需字符集。

```java
// 说明：Files.writeString：写入短文本文件。
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;

var file = Files.createTempFile("java-io-", ".txt");
// 初始状态：file 当前为 Files.createTempFile("java-io-", ".txt")。
Files.writeString(file, "java api", StandardCharsets.UTF_8);
// 作用：需要一次写入能够放进内存的短文本时使用 Files.writeString，并应显式选择业务所需字符集。
System.out.println(Files.size(file) > 0);
// 输出：true
Files.deleteIfExists(file);
```

### `Files.lines`：按行流式读取文本

需要按行处理文本或避免一次载入整个文件时使用 `Files.lines`，并用 try-with-resources 关闭返回的流。

```java
// 说明：Files.lines：按行流式读取文本。
import java.nio.file.Files;

var file = Files.createTempFile("java-lines-", ".txt");
// 初始状态：file 当前为 Files.createTempFile("java-lines-", ".txt")。
Files.writeString(file, "java\napi\n");
try (var lines = Files.lines(file)) {
// 关键变化：try (var lines = Files.lines(file)) {；当前对象；try；当前对象.try(var lines = Files.lines(file)) 返回本次调用的具体结果，后续语句继续使用该值。
    System.out.println(lines.count());
    // 输出：2
}
Files.deleteIfExists(file);
```

完整 API 见 [Path 与 Files 常用 API](/courses/java/07-IO与网络/03-Path与Files常用API)。

### 字节、字符与缓冲层的组合

二进制协议从 `InputStream`/`OutputStream` 开始，文本再叠加 `Charset` 和 `Reader`/`Writer`；缓冲层只改善访问方式，不会替你修正错误编码。

```java
// 说明：字节、字符与缓冲层的组合。
import java.io.BufferedReader;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;

public class IoLayerChoiceDemo {
    public static void main(String[] args) throws IOException {
        Path file = Files.createTempFile("java-text-", ".txt");
// 关键变化：file 接收表达式 Files.createTempFile("java-text-", ".txt") 的计算结果。
// 初始状态：file 的初始值为 Files.createTempFile("java-text-", ".txt")。
        Files.writeString(file, "你好", StandardCharsets.UTF_8);
        try (BufferedReader reader = Files.newBufferedReader(file, StandardCharsets.UTF_8)) {
            System.out.println(reader.readLine());
            // 输出：你好
        }
        Files.deleteIfExists(file);
    }
}
```

详见 [字节流、字符流与缓冲](/courses/java/07-IO与网络/04-字节流字符流与缓冲)。

### `ByteBuffer`：承载分块读写的数据

需要为 NIO 分块读写准备内存区域时使用 `ByteBuffer`，写入数据后必须调用 `flip()` 才能按有效范围读取。

```java
// 说明：ByteBuffer：承载分块读写的数据。
import java.nio.ByteBuffer;

ByteBuffer buffer = ByteBuffer.allocate(4);
// 关键变化：ByteBuffer buffer = ByteBuffer.allocate(4)；buffer 接收 allocate(4) 的返回值，当前值变为这次调用得到的具体结果。
// 输入：ByteBuffer buffer = ByteBuffer.allocate(4); 使用语句中的具体实参或初始值，buffer 从这里进入后续操作。
buffer.put((byte) 7).put((byte) 8);
// 关键变化：buffer.put((byte) 7).put((byte) 8);；buffer 按具体键值参数 (byte) 7 更新映射内容。
buffer.flip();
// 关键变化：buffer.flip()；buffer.flip() 完成本例中的具体调用，后续语句观察调用后的状态。
System.out.println(buffer.get() + ", " + buffer.get());
// 输出：7, 8
```

### `FileChannel`：在文件与缓冲区之间交换数据

需要通过 NIO 通道分块读取文件时使用 `FileChannel`，并在资源边界关闭通道和处理未读完的数据。

```java
// 说明：FileChannel：在文件与缓冲区之间交换数据。
import java.nio.ByteBuffer;
import java.nio.channels.FileChannel;
import java.nio.file.Files;
import java.nio.file.StandardOpenOption;

var file = Files.createTempFile("java-channel-", ".txt");
// 关键变化：var file = Files.createTempFile("java-channel-", ".txt")；file 接收 createTempFile("java-channel-") 的返回值，当前值变为这次调用得到的具体结果。
// 初始状态：file 当前为 Files.createTempFile("java-channel-", ".txt")。
Files.writeString(file, "OK");
// 关键变化：Files.writeString(file, "OK");；Files 写入具体参数 file，对象状态或输出内容随之改变。
try (FileChannel channel = FileChannel.open(file, StandardOpenOption.READ)) {
// 关键变化：try (FileChannel channel = FileChannel.open(file, StandardOpenOption.READ)) {；当前对象；try；当前对象.try(FileChannel channel = FileChannel.open(file, StandardOpenOption.READ)) 返回本次调用的具体结果，后续语句继续使用该值。
    ByteBuffer buffer = ByteBuffer.allocate(2);
    // 关键变化：ByteBuffer buffer = ByteBuffer.allocate(2)；buffer 接收 allocate(2) 的返回值，当前值变为这次调用得到的具体结果。
    System.out.println(channel.read(buffer));
    // 输出：2
}
Files.deleteIfExists(file);
// 关键变化：Files.deleteIfExists(file);；Files 按具体参数 file 删除目标内容。
```

需要控制 position、limit 和零拷贝传输时阅读 [NIO Buffer 与 Channel](/courses/java/07-IO与网络/05-NIO-Buffer与Channel)。
## 不常用但需要知道

### `File.toPath`：转换到 Path API

`File` 仍存在于旧库和旧签名中，但它的异常、属性和符号链接表达能力较弱；新代码从 `Path` 开始，需要兼容旧 API 时用 `toPath()` 或 `toFile()` 做边界转换。

```java
// 说明：legacy 指向当前工作目录下的 notes.txt；toPath() 只转换路径表示，不会读取文件字节。
import java.io.File;
import java.nio.file.Path;

public class FilePathBridgeDemo {
    public static void main(String[] args) {
        File legacy = new File("notes.txt");
        // 关键变化：File legacy = new File("notes.txt")；legacy 接收 该操作("notes.txt") 的返回值，当前值变为这次调用得到的具体结果。
        // 初始状态：legacy 当前为 new File("notes.txt")。
        Path modern = legacy.toPath();
        // 作用：File 仍存在于旧库和旧签名中，但它的异常、属性和符号链接表达能力较弱；新代码从 Path 开始，需要兼容旧 API 时用 toPath() 或 toFile() 做边界转换。
        System.out.println(modern.getFileName());
        // 输出：notes.txt
    }
}
```

### 序列化流的兼容与安全边界

Java 原生序列化带有版本、类加载和反序列化执行风险；不应对不可信输入直接使用 `ObjectInputStream`，跨服务数据优先选择有明确格式和校验规则的协议。

```java
import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.ObjectInputStream;
import java.io.ObjectOutputStream;

public class SerializationBoundaryDemo {
    public static void main(String[] args) throws IOException, ClassNotFoundException {
        var bytes = new ByteArrayOutputStream();
// 关键变化：bytes 接收表达式 new ByteArrayOutputStream() 的计算结果。
// 初始状态：bytes 的初始值为 new ByteArrayOutputStream()。
        try (var out = new ObjectOutputStream(bytes)) {
            out.writeObject("java");
        }
        try (var in = new ObjectInputStream(new ByteArrayInputStream(bytes.toByteArray()))) {
            System.out.println(in.readObject());
            // 输出：java
        }
    }
}
```

### 路径规范化与安全检查

`normalize()` 只消除 `.` 和 `..`，不会访问文件系统，也不会自动解决符号链接目录穿越；处理用户输入时还要结合绝对路径、真实路径和权限检查。网络输入的 HTTP 边界见 [HTTP Client 常用 API](/courses/java/07-IO与网络/06-HTTP-Client常用API)。

```java
import java.nio.file.Path;

public class PathBoundaryDemo {
    public static void main(String[] args) {
        Path root = Path.of("/srv/data").toAbsolutePath().normalize();
// 关键变化：root 接收表达式 Path.of("/srv/data").toAbsolutePath().normalize() 的计算结果。
// 初始状态：root 的初始值为 Path.of("/srv/data").toAbsolutePath().normalize()。
        Path candidate = root.resolve("reports", "2026.txt").normalize();
        System.out.println(candidate.startsWith(root));
        // 输出：true
    }
}
```
## 简单案例

```java
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;

public class IoNioDemo {
    public static void main(String[] args) throws IOException {
        Path directory = Files.createTempDirectory("java-io-demo-");
        Path source = directory.resolve("source.txt");
        Path copy = directory.resolve("copy.txt");
        Files.writeString(source, "Java I/O", StandardCharsets.UTF_8);
        Files.copy(source, copy);
        System.out.println(Files.readString(copy, StandardCharsets.UTF_8));
        // 输出：Java I/O
        Files.deleteIfExists(copy);
        Files.deleteIfExists(source);
        Files.deleteIfExists(directory);
    }
}
```

这个流程把路径、写入、复制、读取和清理串起来；生产代码还应处理权限、文件已存在、磁盘空间和清理失败等异常。

## 易混点

- `InputStream`/`OutputStream` 是字节层，`Reader`/`Writer` 是字符层；编码转换必须显式指定 `Charset`。
- `Files.readString` 适合小文本，不等于可以把任意大文件一次性装入内存。
- Buffer 的 `flip()` 是“写模式切换到读模式”，不是清空数据；`clear()` 才是准备重新写入。
- TCP/Socket 也是字节流，单次 `read` 不代表收到一个完整业务消息；网络边界见 [Socket 与网络边界](/courses/java/07-IO与网络/07-Socket与网络边界)。

## 课后小问

1. 为什么文本文件不能只调用 `new String(bytes)` 而不指定字符集？
答案：默认字符集随运行环境变化，可能导致同一份字节在不同机器上得到不同文本。
解析：跨平台读写应显式使用 `StandardCharsets.UTF_8` 或协议规定的其他字符集。

2. 什么时候选择 `Files.lines` 而不是 `Files.readAllLines`？
答案：文件较大或只需顺序处理时选择 `Files.lines`，避免一次性创建完整列表。
解析：`Files.lines` 返回的 Stream 持有文件资源，必须在 try-with-resources 中关闭。

## 本节小结

- 先按字节/字符、文件大小和访问方式选择 I/O API。
- 新文件代码优先使用 Path、Files 和明确 Charset。
- Buffer 保存批量数据，Channel 负责数据交换，读写状态要正确切换。
- 资源关闭、路径安全、编码和异常是文件代码的基本边界。

## 快速回顾

- 小文本可以使用 `Files.readString`，大文件优先流式或分块处理。
- 字节流不等于字符流，编码必须显式约定。
- `flip` 切换 Buffer 的读写状态，`clear` 准备重新写入。
- 文件 API 与网络 API 都要区分数据、资源和协议边界。
