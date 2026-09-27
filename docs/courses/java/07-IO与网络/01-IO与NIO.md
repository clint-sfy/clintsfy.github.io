---
title: I/O 与 NIO 文件处理
date: 2026-09-22
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

### `Path`、`Files` 与流 API 如何选择

短文本用 `readString`/`writeString` 简洁；需要按行处理或文件可能很大时，使用 `Files.lines` 并关闭返回的流。完整 API 见 [Path 与 Files 常用 API](/courses/java/07-IO与网络/03-Path与Files常用API)。

```java
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;

public class IoChoiceDemo {
    public static void main(String[] args) throws IOException {
        Path file = Files.createTempFile("java-io-", ".txt");
        Files.writeString(file, "java\napi\n");
        try (var lines = Files.lines(file)) {
            System.out.println(lines.count());
            // 输出：2
        }
        Files.deleteIfExists(file);
    }
}
```

### 字节、字符与缓冲层的组合

二进制协议从 `InputStream`/`OutputStream` 开始，文本再叠加 `Charset` 和 `Reader`/`Writer`；缓冲层只改善访问方式，不会替你修正错误编码。详见 [字节流、字符流与缓冲](/courses/java/07-IO与网络/04-字节流字符流与缓冲)。

```java
import java.io.BufferedReader;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;

public class IoLayerChoiceDemo {
    public static void main(String[] args) throws IOException {
        Path file = Files.createTempFile("java-text-", ".txt");
        Files.writeString(file, "你好", StandardCharsets.UTF_8);
        try (BufferedReader reader = Files.newBufferedReader(file, StandardCharsets.UTF_8)) {
            System.out.println(reader.readLine());
            // 输出：你好
        }
        Files.deleteIfExists(file);
    }
}
```

### Buffer 与 Channel 的配合

`Channel` 负责和文件或网络交换数据，`Buffer` 负责承载这批数据；写入 Buffer 后要 `flip()` 再读取。需要控制 position、limit 和零拷贝传输时阅读 [NIO Buffer 与 Channel](/courses/java/07-IO与网络/05-NIO-Buffer与Channel)。

```java
import java.nio.ByteBuffer;

public class BufferChannelChoiceDemo {
    public static void main(String[] args) {
        ByteBuffer buffer = ByteBuffer.allocate(4);
        buffer.put((byte) 7).put((byte) 8);
        buffer.flip();
        System.out.println(buffer.get() + ", " + buffer.get());
        // 输出：7, 8
    }
}
```
## 不常用但需要知道

### `File` 与 `Path` 的兼容边界

`File` 仍存在于旧库和旧签名中，但它的异常、属性和符号链接表达能力较弱；新代码从 `Path` 开始，需要兼容旧 API 时用 `toPath()` 或 `toFile()` 做边界转换。

```java
import java.io.File;
import java.nio.file.Path;

public class FilePathBridgeDemo {
    public static void main(String[] args) {
        File legacy = new File("notes.txt");
        Path modern = legacy.toPath();
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
