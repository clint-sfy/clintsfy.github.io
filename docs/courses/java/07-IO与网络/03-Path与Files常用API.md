---
title: Path 与 Files 常用 API
date: 2026-09-27T00:00:00.000Z
category: Java基础快速入门
tags:
  - Java
  - Path
  - Files
  - NIO
description: 直接用 Java 案例速查 Path 与 Files 的路径、读写、复制移动、遍历和属性 API。
---

# Path 与 Files 常用 API

## 学习目标

- 会用 `Path` 表达路径，用 `Files` 完成文件系统操作。
- 能安全处理字符集、覆盖策略、流关闭、符号链接和异常。
- 能在“读完整内容、按行流式处理、分块传输、遍历目录”之间做选择。

## 核心知识点

### 专业术语

- **Path**：平台无关的路径值对象，不代表路径一定已经存在。
- **Files**：以静态方法提供文件创建、读写、复制、移动、删除、遍历和属性读取。
- **文件属性**：大小、时间、类型、权限等元数据；符号链接是否跟随要明确指定。
- **文件流**：`Files.lines`、`list`、`walk` 等方法返回的 Stream 持有系统资源。

### 白话解释与边界

`Path` 只负责描述和组合路径，真正访问磁盘由 `Files` 完成。小文本可用 `readString`，大文件要用缓冲流、`lines` 或 Channel；复制和移动还要明确是否覆盖、是否要求原子操作。用户输入的路径必须在规范化后校验根目录，不能只靠字符串拼接。

## 常用用法

### 创建路径：从字符串得到 `Path`

JDK 11 以后优先写 `Path.of`；`Paths.get` 在旧代码和重载阅读中仍常见。

```java
// 说明：创建路径：从字符串得到 Path。
import java.nio.file.Path;
import java.nio.file.Paths;

public class PathCreateDemo {
    public static void main(String[] args) {
        Path first = Path.of("logs", "app.log");
        // 输入：Path first = Path.of("logs", "app.log");；右侧表达式 Path.of("logs", "app.log") 的结果赋给 first。
        // 关键变化：Path first = Path.of("logs", "app.log");；按 "logs", "app.log" 调用 of 创建值，结果写入 first。
        Path second = Paths.get("logs", "app.log");
        // 输入：Path second = Paths.get("logs", "app.log");；右侧表达式 Paths.get("logs", "app.log") 的结果赋给 second。
        // 关键变化：Path second = Paths.get("logs", "app.log");；把路径片段 "logs" 和 "app.log" 组合为 Path 并写入 second；路径对象创建完成。
        System.out.println(first.equals(second));
        // 输出：true
    }
}
```

相对路径的基准是当前工作目录，不是源码文件所在目录。

### `resolve`：拼接子路径

`resolve` 适合把受控的子路径接到根目录；如果参数是绝对路径，结果可能直接采用该绝对路径，因此用户输入仍需做根目录校验。

```java
// 说明：resolve：拼接子路径。
import java.nio.file.Path;

public class PathResolveDemo {
    public static void main(String[] args) {
        Path root = Path.of("data");
        // 输入：Path root = Path.of("data");；右侧表达式 Path.of("data") 的结果赋给 root。
        // 关键变化：Path root = Path.of("data");；按 "data" 调用 of 创建值，结果写入 root。
        Path file = root.resolve("2026").resolve("report.txt");
        // 输入：Path file = root.resolve("2026").resolve("report.txt");；右侧表达式 root.resolve("2026").resolve("report.txt") 的结果赋给 file。
        // 关键变化：Path file = root.resolve("2026").resolve("report.txt");；调用 resolve，实参为 "2026"，返回值写入 file。
        System.out.println(file);
        // 输出：data/2026/report.txt
    }
}
```

### 规范化路径：得到无冗余的绝对路径

`normalize` 只处理 `.` 和 `..`，不会检查文件是否存在，也不会解析符号链接；需要真实路径时使用 `toRealPath`，并准备处理 `IOException`。

```java
// 说明：规范化路径：得到无冗余的绝对路径。
import java.nio.file.Path;

public class PathNormalizeDemo {
    public static void main(String[] args) {
        Path path = Path.of("data", "logs", "..", "app.log");
        // 输入：Path path = Path.of("data", "logs", "..", "app.log");；右侧表达式 Path.of("data", "logs", "..", "app.log") 的结果赋给 path。
        // 关键变化：Path path = Path.of("data", "logs", "..", "app.log");；按 "data", "logs", "..", "app.log" 调用 of 创建值，结果写入 path。
        System.out.println(path.normalize());
        // 输出：data/app.log
    }
}
```

### `relativize`：计算相对路径

两个路径必须都为绝对或都为相对，并且通常来自同一文件系统；跨盘符或不同根时可能抛 `IllegalArgumentException`。

```java
// 说明：relativize：计算相对路径。
import java.nio.file.Path;

public class PathRelativizeDemo {
    public static void main(String[] args) {
        Path root = Path.of("/srv/app");
        // 输入：Path root = Path.of("/srv/app");；右侧表达式 Path.of("/srv/app") 的结果赋给 root。
        // 关键变化：Path root = Path.of("/srv/app");；按 "/srv/app" 调用 of 创建值，结果写入 root。
        Path file = Path.of("/srv/app/config/app.yml");
        // 输入：Path file = Path.of("/srv/app/config/app.yml");；右侧表达式 Path.of("/srv/app/config/app.yml") 的结果赋给 file。
        // 关键变化：Path file = Path.of("/srv/app/config/app.yml");；按 "/srv/app/config/app.yml" 调用 of 创建值，结果写入 file。
        System.out.println(root.relativize(file));
        // 输出：config/app.yml
    }
}
```

### 查询路径组成：读取文件名、父路径或名称元素

这些方法只拆路径字符串结构，不访问磁盘；根路径可能没有父路径，调用结果要允许为 `null`。

```java
// 说明：查询路径组成：读取文件名、父路径或名称元素。
import java.nio.file.Path;

public class PathPartsDemo {
    public static void main(String[] args) {
        Path path = Path.of("data", "app.log");
        // 输入：Path path = Path.of("data", "app.log");；右侧表达式 Path.of("data", "app.log") 的结果赋给 path。
        // 关键变化：Path path = Path.of("data", "app.log");；按 "data", "app.log" 调用 of 创建值，结果写入 path。
        System.out.println(path.getFileName() + " / " + path.getParent() + " / " + path.getName(0));
        // 输出：app.log / data / data
    }
}
```

### 检查路径状态：确认存在性、类型与权限

检查结果可能在返回后立即失效，不能替代真正操作时的异常处理；`exists` 默认跟随符号链接，需要不跟随时传 `LinkOption.NOFOLLOW_LINKS`。

```java
// 说明：检查路径状态：确认存在性、类型与权限。
import java.nio.file.Files;
import java.nio.file.Path;

public class FilesCheckDemo {
    public static void main(String[] args) throws Exception {
        Path file = Files.createTempFile("java-files-", ".txt");
        // 输入：Path file = Files.createTempFile("java-files-", ".txt");；右侧表达式 Files.createTempFile("java-files-", ".txt") 的结果赋给 file。
        // 关键变化：Path file = Files.createTempFile("java-files-", ".txt");；调用 createTempFile，实参为 "java-files-", ".txt"，返回值写入 file。
        System.out.println(Files.exists(file) + ", " + Files.isRegularFile(file) + ", " + Files.isReadable(file));
        // 输出：true, true, true
        Files.deleteIfExists(file);
        // 输入：Files.deleteIfExists(file);；接收对象为 Files，调用 deleteIfExists 的实参为 file。
        // 关键变化：Files.deleteIfExists(file);；删除路径 file；路径存在时返回 true，不存在时返回 false；文件系统状态更新。
    }
}
```

### 创建文件系统节点：按需建立目录或文件

`createDirectories` 会按需创建中间目录；`createFile` 要求目标不存在，避免无意覆盖。

```java
// 说明：创建文件系统节点：按需建立目录或文件。
import java.nio.file.Files;
import java.nio.file.Path;

public class FilesCreateDemo {
    public static void main(String[] args) throws Exception {
        Path directory = Files.createTempDirectory("java-dir-");
        // 输入：Path directory = Files.createTempDirectory("java-dir-");；右侧表达式 Files.createTempDirectory("java-dir-") 的结果赋给 directory。
        // 关键变化：Path directory = Files.createTempDirectory("java-dir-");；调用 createTempDirectory，实参为 "java-dir-"，返回值写入 directory。
        Path nested = directory.resolve("a").resolve("b");
        // 输入：Path nested = directory.resolve("a").resolve("b");；右侧表达式 directory.resolve("a").resolve("b") 的结果赋给 nested。
        // 关键变化：Path nested = directory.resolve("a").resolve("b");；调用 resolve，实参为 "a"，返回值写入 nested。
        Files.createDirectories(nested);
        // 输入：Files.createDirectories(nested);；接收对象为 Files，调用 createDirectories 的实参为 nested。
        // 关键变化：Files.createDirectories(nested);；调用 createDirectories，实参为 nested；创建 nested 及缺失的父目录；返回创建后的 Path。
        Path file = Files.createFile(nested.resolve("app.txt"));
        // 输入：Path file = Files.createFile(nested.resolve("app.txt"));；右侧表达式 Files.createFile(nested.resolve("app.txt")) 的结果赋给 file。
        // 关键变化：Path file = Files.createFile(nested.resolve("app.txt"));；调用 resolve，实参为 "app.txt"，返回值写入 file。
        System.out.println(Files.isRegularFile(file));
        // 输出：true
        Files.deleteIfExists(file);
        // 输入：Files.deleteIfExists(file);；接收对象为 Files，调用 deleteIfExists 的实参为 file。
        // 关键变化：Files.deleteIfExists(file);；删除路径 file；路径存在时返回 true，不存在时返回 false；文件系统状态更新。
        Files.deleteIfExists(nested);
        // 输入：Files.deleteIfExists(nested);；接收对象为 Files，调用 deleteIfExists 的实参为 nested。
        // 关键变化：Files.deleteIfExists(nested);；删除路径 nested；路径存在时返回 true，不存在时返回 false；文件系统状态更新。
        Files.deleteIfExists(nested.getParent());
        // 输入：Files.deleteIfExists(nested.getParent());；接收对象为 Files，调用 deleteIfExists 的实参为 nested.getParent()。
        // 关键变化：Files.deleteIfExists(nested.getParent());；删除路径 nested.getParent()；路径存在时返回 true，不存在时返回 false；文件系统状态更新。
        Files.deleteIfExists(directory);
        // 输入：Files.deleteIfExists(directory);；接收对象为 Files，调用 deleteIfExists 的实参为 directory。
        // 关键变化：Files.deleteIfExists(directory);；删除路径 directory；路径存在时返回 true，不存在时返回 false；文件系统状态更新。
    }
}
```

并发场景仍需处理“检查后被其他进程创建”的异常。

### 读写短文本文件：使用明确字符集

这两个方法适合小文本；显式传 `Charset`，避免依赖平台默认编码。

```java
// 说明：读写短文本文件：使用明确字符集。
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;

public class FilesTextDemo {
    public static void main(String[] args) throws Exception {
        Path file = Files.createTempFile("java-text-", ".txt");
        // 输入：Path file = Files.createTempFile("java-text-", ".txt");；右侧表达式 Files.createTempFile("java-text-", ".txt") 的结果赋给 file。
        // 关键变化：Path file = Files.createTempFile("java-text-", ".txt");；调用 createTempFile，实参为 "java-text-", ".txt"，返回值写入 file。
        Files.writeString(file, "你好 Java", StandardCharsets.UTF_8);
        // 输入：Files.writeString(file, "你好 Java", StandardCharsets.UTF_8);；接收对象为 Files，调用 writeString 的实参为 file, "你好 Java", StandardCharsets.UTF_8。
        // 关键变化：Files.writeString(file, "你好 Java", StandardCharsets.UTF_8);；将 "你好 Java"，字符集为 StandardCharsets.UTF_8 写入路径 file；writeString 返回目标 Path，文件内容更新。
        System.out.println(Files.readString(file, StandardCharsets.UTF_8));
        // 输出：你好 Java
        Files.deleteIfExists(file);
        // 输入：Files.deleteIfExists(file);；接收对象为 Files，调用 deleteIfExists 的实参为 file。
        // 关键变化：Files.deleteIfExists(file);；删除路径 file；路径存在时返回 true，不存在时返回 false；文件系统状态更新。
    }
}
```

大文件使用它们会增加内存峰值。

### 读写短二进制文件：一次处理全部字节

二进制小文件可以一次处理；文件大小不受控时改用 `InputStream` 或 `FileChannel` 分块读取。

```java
// 说明：读写短二进制文件：一次处理全部字节。
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.Arrays;

public class FilesBytesDemo {
    public static void main(String[] args) throws Exception {
        Path file = Files.createTempFile("java-bytes-", ".bin");
        // 输入：Path file = Files.createTempFile("java-bytes-", ".bin");；右侧表达式 Files.createTempFile("java-bytes-", ".bin") 的结果赋给 file。
        // 关键变化：Path file = Files.createTempFile("java-bytes-", ".bin");；调用 createTempFile，实参为 "java-bytes-", ".bin"，返回值写入 file。
        Files.write(file, new byte[]{1, 2, 3});
        // 输入：Files.write(file, new byte[]{1, 2, 3});；接收对象为 Files，调用 write 的实参为 file, new byte[]{1, 2, 3}。
        // 关键变化：Files.write(file, new byte[]{1, 2, 3});；将 new byte[]{1, 2, 3} 写入路径 file；write 返回目标 Path，文件内容更新。
        System.out.println(Arrays.toString(Files.readAllBytes(file)));
        // 输出：[1, 2, 3]
        Files.deleteIfExists(file);
        // 输入：Files.deleteIfExists(file);；接收对象为 Files，调用 deleteIfExists 的实参为 file。
        // 关键变化：Files.deleteIfExists(file);；删除路径 file；路径存在时返回 true，不存在时返回 false；文件系统状态更新。
    }
}
```

### 流式读写文本：创建带缓冲的字符端点

缓冲字符流适合逐行或逐段处理；关闭 writer 才能保证缓冲数据真正写出。

```java
// 说明：流式读写文本：创建带缓冲的字符端点。
import java.io.BufferedReader;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;

public class FilesBufferedTextDemo {
    public static void main(String[] args) throws Exception {
        Path file = Files.createTempFile("java-buffered-", ".txt");
        // 输入：Path file = Files.createTempFile("java-buffered-", ".txt");；右侧表达式 Files.createTempFile("java-buffered-", ".txt") 的结果赋给 file。
        // 关键变化：Path file = Files.createTempFile("java-buffered-", ".txt");；调用 createTempFile，实参为 "java-buffered-", ".txt"，返回值写入 file。
        try (var writer = Files.newBufferedWriter(file, StandardCharsets.UTF_8)) {
        // 输入：try (var writer = Files.newBufferedWriter(file, StandardCharsets.UTF_8)) {；资源变量 writer 接收 Files.newBufferedWriter(file, StandardCharsets.UTF_8)，try 结束时自动关闭。
        // 关键变化：try (var writer = Files.newBufferedWriter(file, StandardCharsets.UTF_8)) {；创建资源 writer，构造表达式为 Files.newBufferedWriter(file, StandardCharsets.UTF_8)；try 结束时关闭该资源。
            writer.write("first");
            // 输入：writer.write("first");；接收对象为 writer，调用 write 的实参为 "first"。
            // 关键变化：writer.write("first");；向 writer 写入 "first"，write 返回 void；目标内容更新。
            writer.newLine();
            // 输入：writer.newLine();；接收对象为 writer，调用 newLine 的实参为 无显式参数。
            // 关键变化：writer.newLine();；调用 newLine，实参为 无显式参数；向 writer 写入平台换行符；文本内容追加换行。
            writer.write("second");
            // 输入：writer.write("second");；接收对象为 writer，调用 write 的实参为 "second"。
            // 关键变化：writer.write("second");；向 writer 写入 "second"，write 返回 void；目标内容更新。
        }
        try (BufferedReader reader = Files.newBufferedReader(file, StandardCharsets.UTF_8)) {
        // 输入：try (BufferedReader reader = Files.newBufferedReader(file, StandardCharsets.UTF_8)) {；资源变量 reader 接收 Files.newBufferedReader(file, StandardCharsets.UTF_8)，try 结束时自动关闭。
        // 关键变化：try (BufferedReader reader = Files.newBufferedReader(file, StandardCharsets.UTF_8)) {；创建资源 reader，构造表达式为 Files.newBufferedReader(file, StandardCharsets.UTF_8)；try 结束时关闭该资源。
            System.out.println(reader.readLine());
            // 输出：first
        }
        Files.deleteIfExists(file);
        // 输入：Files.deleteIfExists(file);；接收对象为 Files，调用 deleteIfExists 的实参为 file。
        // 关键变化：Files.deleteIfExists(file);；删除路径 file；路径存在时返回 true，不存在时返回 false；文件系统状态更新。
    }
}
```

### `copy`：复制文件或目录项

默认不覆盖已存在目标；复制目录只复制目录项本身，不会自动递归复制内容，需要配合 `walk`。

```java
// 说明：copy：复制文件或目录项。
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.StandardCopyOption;

public class FilesCopyDemo {
    public static void main(String[] args) throws Exception {
        Path source = Files.createTempFile("java-source-", ".txt");
        // 输入：Path source = Files.createTempFile("java-source-", ".txt");；右侧表达式 Files.createTempFile("java-source-", ".txt") 的结果赋给 source。
        // 关键变化：Path source = Files.createTempFile("java-source-", ".txt");；调用 createTempFile，实参为 "java-source-", ".txt"，返回值写入 source。
        Path target = source.resolveSibling("java-copy.txt");
        // 输入：Path target = source.resolveSibling("java-copy.txt");；右侧表达式 source.resolveSibling("java-copy.txt") 的结果赋给 target。
        // 关键变化：Path target = source.resolveSibling("java-copy.txt");；调用 resolveSibling，实参为 "java-copy.txt"，返回值写入 target。
        Files.copy(source, target, StandardCopyOption.REPLACE_EXISTING);
        // 输入：Files.copy(source, target, StandardCopyOption.REPLACE_EXISTING);；接收对象为 Files，调用 copy 的实参为 source, target, StandardCopyOption.REPLACE_EXISTING。
        // 关键变化：Files.copy(source, target, StandardCopyOption.REPLACE_EXISTING);；将 source 复制到 target，返回目标 Path；目标文件更新。
        System.out.println(Files.exists(target));
        // 输出：true
        Files.deleteIfExists(source);
        // 输入：Files.deleteIfExists(source);；接收对象为 Files，调用 deleteIfExists 的实参为 source。
        // 关键变化：Files.deleteIfExists(source);；删除路径 source；路径存在时返回 true，不存在时返回 false；文件系统状态更新。
        Files.deleteIfExists(target);
        // 输入：Files.deleteIfExists(target);；接收对象为 Files，调用 deleteIfExists 的实参为 target。
        // 关键变化：Files.deleteIfExists(target);；删除路径 target；路径存在时返回 true，不存在时返回 false；文件系统状态更新。
    }
}
```

### `move`：移动或重命名

同一文件系统内移动通常比复制再删除更合适；`ATOMIC_MOVE` 是请求，不保证所有文件系统都支持，失败时应决定是否降级。

```java
// 说明：move：移动或重命名。
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.StandardCopyOption;

public class FilesMoveDemo {
    public static void main(String[] args) throws Exception {
        Path source = Files.createTempFile("java-before-", ".txt");
        // 输入：Path source = Files.createTempFile("java-before-", ".txt");；右侧表达式 Files.createTempFile("java-before-", ".txt") 的结果赋给 source。
        // 关键变化：Path source = Files.createTempFile("java-before-", ".txt");；调用 createTempFile，实参为 "java-before-", ".txt"，返回值写入 source。
        Path target = source.resolveSibling("java-after.txt");
        // 输入：Path target = source.resolveSibling("java-after.txt");；右侧表达式 source.resolveSibling("java-after.txt") 的结果赋给 target。
        // 关键变化：Path target = source.resolveSibling("java-after.txt");；调用 resolveSibling，实参为 "java-after.txt"，返回值写入 target。
        Files.move(source, target, StandardCopyOption.ATOMIC_MOVE, StandardCopyOption.REPLACE_EXISTING);
        // 输入：Files.move(source, target, StandardCopyOption.ATOMIC_MOVE, StandardCopyOption.REPLACE_EXISTING);；接收对象为 Files，调用 move 的实参为 source, target, StandardCopyOption.ATOMIC_MOVE, StandardCopyOption.REPLACE_EXISTING。
        // 关键变化：Files.move(source, target, StandardCopyOption.ATOMIC_MOVE, StandardCopyOption.REPLACE_EXISTING);；调用 move，实参为 source, target, StandardCopyOption.ATOMIC_MOVE, StandardCopyOption.REPLACE_EXISTING；将 source 移至 target；返回目标 Path。
        System.out.println(Files.exists(target));
        // 输出：true
        Files.deleteIfExists(target);
        // 输入：Files.deleteIfExists(target);；接收对象为 Files，调用 deleteIfExists 的实参为 target。
        // 关键变化：Files.deleteIfExists(target);；删除路径 target；路径存在时返回 true，不存在时返回 false；文件系统状态更新。
    }
}
```

### 删除路径：选择严格或幂等语义

`delete` 目标不存在会抛异常，`deleteIfExists` 返回是否实际删除；非空目录不能直接删除，要先删除其中内容。

```java
// 说明：删除路径：选择严格或幂等语义。
import java.nio.file.Files;
import java.nio.file.Path;

public class FilesDeleteDemo {
    public static void main(String[] args) throws Exception {
        Path file = Files.createTempFile("java-delete-", ".txt");
        // 输入：Path file = Files.createTempFile("java-delete-", ".txt");；右侧表达式 Files.createTempFile("java-delete-", ".txt") 的结果赋给 file。
        // 关键变化：Path file = Files.createTempFile("java-delete-", ".txt");；调用 createTempFile，实参为 "java-delete-", ".txt"，返回值写入 file。
        Files.delete(file);
        // 输入：Files.delete(file);；接收对象为 Files，调用 delete 的实参为 file。
        // 关键变化：Files.delete(file);；删除存在的路径 file，返回 void；路径不存在时抛出 NoSuchFileException。
        System.out.println(Files.deleteIfExists(file));
        // 输出：false
    }
}
```

### `lines`：按行流式处理

`lines` 不会在创建 Stream 时一次读完文件，且 Stream 必须关闭；异常发生在终端操作或关闭阶段时也要按 I/O 处理。

```java
// 说明：lines：按行流式处理。
import java.nio.file.Files;
import java.nio.file.Path;

public class FilesLinesDemo {
    public static void main(String[] args) throws Exception {
        Path file = Files.createTempFile("java-lines-", ".txt");
        // 输入：Path file = Files.createTempFile("java-lines-", ".txt");；右侧表达式 Files.createTempFile("java-lines-", ".txt") 的结果赋给 file。
        // 关键变化：Path file = Files.createTempFile("java-lines-", ".txt");；调用 createTempFile，实参为 "java-lines-", ".txt"，返回值写入 file。
        Files.writeString(file, "java\nsql\njava\n");
        // 输入：Files.writeString(file, "java\nsql\njava\n");；接收对象为 Files，调用 writeString 的实参为 file, "java\nsql\njava\n"。
        // 关键变化：Files.writeString(file, "java\nsql\njava\n");；将 "java\nsql\njava\n" 写入路径 file；writeString 返回目标 Path，文件内容更新。
        try (var lines = Files.lines(file)) {
        // 输入：try (var lines = Files.lines(file)) {；资源变量 lines 接收 Files.lines(file)，try 结束时自动关闭。
        // 关键变化：try (var lines = Files.lines(file)) {；创建资源 lines，构造表达式为 Files.lines(file)；try 结束时关闭该资源。
            System.out.println(lines.filter("java"::equals).count());
            // 输出：2
        }
        Files.deleteIfExists(file);
        // 输入：Files.deleteIfExists(file);；接收对象为 Files，调用 deleteIfExists 的实参为 file。
        // 关键变化：Files.deleteIfExists(file);；删除路径 file；路径存在时返回 true，不存在时返回 false；文件系统状态更新。
    }
}
```

### 遍历目录：选择单层或递归范围

`list` 只看一层，`walk` 递归遍历；两者都返回持有目录句柄的 Stream，必须关闭，并注意深目录和符号链接循环。

```java
// 说明：遍历目录：选择单层或递归范围。
import java.nio.file.Files;
import java.nio.file.Path;

public class FilesWalkDemo {
    public static void main(String[] args) throws Exception {
        Path directory = Files.createTempDirectory("java-walk-");
        // 输入：Path directory = Files.createTempDirectory("java-walk-");；右侧表达式 Files.createTempDirectory("java-walk-") 的结果赋给 directory。
        // 关键变化：Path directory = Files.createTempDirectory("java-walk-");；调用 createTempDirectory，实参为 "java-walk-"，返回值写入 directory。
        Files.writeString(directory.resolve("a.txt"), "a");
        // 输入：Files.writeString(directory.resolve("a.txt"), "a");；接收对象为 Files，调用 writeString 的实参为 directory.resolve("a.txt"), "a"。
        // 关键变化：Files.writeString(directory.resolve("a.txt"), "a");；将 "a" 写入路径 directory.resolve("a.txt")；writeString 返回目标 Path，文件内容更新。
        Files.createDirectory(directory.resolve("sub"));
        // 输入：Files.createDirectory(directory.resolve("sub"));；接收对象为 directory，调用 resolve 的实参为 "sub"。
        // 关键变化：Files.createDirectory(directory.resolve("sub"));；向 directory 追加路径片段 "sub"，返回新的 Path；原路径不变。
        try (var paths = Files.walk(directory)) {
        // 输入：try (var paths = Files.walk(directory)) {；资源变量 paths 接收 Files.walk(directory)，try 结束时自动关闭。
        // 关键变化：try (var paths = Files.walk(directory)) {；创建资源 paths，构造表达式为 Files.walk(directory)；try 结束时关闭该资源。
            System.out.println(paths.filter(Files::isRegularFile).count());
            // 输出：1
        }
        Files.deleteIfExists(directory.resolve("a.txt"));
        // 输入：Files.deleteIfExists(directory.resolve("a.txt"));；接收对象为 directory，调用 resolve 的实参为 "a.txt"。
        // 关键变化：Files.deleteIfExists(directory.resolve("a.txt"));；删除路径 directory.resolve("a.txt")；路径存在时返回 true，不存在时返回 false；文件系统状态更新。
        Files.deleteIfExists(directory.resolve("sub"));
        // 输入：Files.deleteIfExists(directory.resolve("sub"));；接收对象为 directory，调用 resolve 的实参为 "sub"。
        // 关键变化：Files.deleteIfExists(directory.resolve("sub"));；删除路径 directory.resolve("sub")；路径存在时返回 true，不存在时返回 false；文件系统状态更新。
        Files.deleteIfExists(directory);
        // 输入：Files.deleteIfExists(directory);；接收对象为 Files，调用 deleteIfExists 的实参为 directory。
        // 关键变化：Files.deleteIfExists(directory);；删除路径 directory；路径存在时返回 true，不存在时返回 false；文件系统状态更新。
    }
}
```

### 读取文件属性：选择单项或批量查询

需要多个属性时批量读取通常更清楚；属性可能在读取后变化，业务一致性不能靠多次属性查询保证。

```java
// 说明：读取文件属性：选择单项或批量查询。
import java.nio.file.Files;
import java.nio.file.Path;

public class FilesAttributesDemo {
    public static void main(String[] args) throws Exception {
        Path file = Files.createTempFile("java-attr-", ".txt");
        // 输入：Path file = Files.createTempFile("java-attr-", ".txt");；右侧表达式 Files.createTempFile("java-attr-", ".txt") 的结果赋给 file。
        // 关键变化：Path file = Files.createTempFile("java-attr-", ".txt");；调用 createTempFile，实参为 "java-attr-", ".txt"，返回值写入 file。
        long size = (long) Files.getAttribute(file, "basic:size");
        // 输入：long size = (long) Files.getAttribute(file, "basic:size");；右侧表达式 (long) Files.getAttribute(file, "basic:size") 的结果赋给 size。
        // 关键变化：long size = (long) Files.getAttribute(file, "basic:size");；调用 getAttribute，实参为 file, "basic:size"，返回值写入 size。
        var attributes = Files.readAttributes(file, "basic:size,lastModifiedTime");
        // 输入：var attributes = Files.readAttributes(file, "basic:size,lastModifiedTime");；右侧表达式 Files.readAttributes(file, "basic:size,lastModifiedTime") 的结果赋给 attributes。
        // 关键变化：var attributes = Files.readAttributes(file, "basic:size,lastModifiedTime");；调用 readAttributes，实参为 file, "basic:size,lastModifiedTime"，返回值写入 attributes。
        System.out.println(size == (long) attributes.get("size"));
        // 输出：true
        Files.deleteIfExists(file);
        // 输入：Files.deleteIfExists(file);；接收对象为 Files，调用 deleteIfExists 的实参为 file。
        // 关键变化：Files.deleteIfExists(file);；删除路径 file；路径存在时返回 true，不存在时返回 false；文件系统状态更新。
    }
}
```
## 不常用但需要知道

### `LinkOption.NOFOLLOW_LINKS`：不跟随符号链接

涉及权限、归档或上传目录时，要明确是否跟随链接；不跟随链接能减少把检查目标偷偷切换到其他目录的风险，但不是完整安全方案。

```java
import java.nio.file.Files;
import java.nio.file.LinkOption;
import java.nio.file.Path;

public class NoFollowLinksDemo {
    public static void main(String[] args) {
        Path path = Path.of("config");
        // 输入：Path path = Path.of("config");；右侧表达式 Path.of("config") 的结果赋给 path。
        // 关键变化：Path path = Path.of("config");；按 "config" 调用 of 创建值，结果写入 path。
        System.out.println(Files.exists(path, LinkOption.NOFOLLOW_LINKS));
        // 输出：false
    }
}
```

### `Files.isSameFile`：判断两个路径是否指向同一文件

该方法可能访问文件系统并解析符号链接，和 `Path.equals` 的字符串结构比较不是一回事。

```java
import java.nio.file.Files;
import java.nio.file.Path;

public class SameFileDemo {
    public static void main(String[] args) throws Exception {
        Path file = Files.createTempFile("java-same-", ".txt");
        // 输入：Path file = Files.createTempFile("java-same-", ".txt");；右侧表达式 Files.createTempFile("java-same-", ".txt") 的结果赋给 file。
        // 关键变化：Path file = Files.createTempFile("java-same-", ".txt");；调用 createTempFile，实参为 "java-same-", ".txt"，返回值写入 file。
        System.out.println(Files.isSameFile(file, file.toAbsolutePath()));
        // 输出：true
        Files.deleteIfExists(file);
        // 输入：Files.deleteIfExists(file);；接收对象为 Files，调用 deleteIfExists 的实参为 file。
        // 关键变化：Files.deleteIfExists(file);；删除路径 file；路径存在时返回 true，不存在时返回 false；文件系统状态更新。
    }
}
```

### `Files.mismatch`：查找首个不同字节

返回 `-1` 表示内容相同，否则返回首个不同位置；它仍需读取文件，不能当作恒定时间的安全比较。

```java
import java.nio.file.Files;
import java.nio.file.Path;

public class FilesMismatchDemo {
    public static void main(String[] args) throws Exception {
        Path left = Files.createTempFile("java-left-", ".bin");
        // 输入：Path left = Files.createTempFile("java-left-", ".bin");；右侧表达式 Files.createTempFile("java-left-", ".bin") 的结果赋给 left。
        // 关键变化：Path left = Files.createTempFile("java-left-", ".bin");；调用 createTempFile，实参为 "java-left-", ".bin"，返回值写入 left。
        Path right = Files.createTempFile("java-right-", ".bin");
        // 输入：Path right = Files.createTempFile("java-right-", ".bin");；右侧表达式 Files.createTempFile("java-right-", ".bin") 的结果赋给 right。
        // 关键变化：Path right = Files.createTempFile("java-right-", ".bin");；调用 createTempFile，实参为 "java-right-", ".bin"，返回值写入 right。
        Files.write(left, new byte[]{1, 2, 3});
        // 输入：Files.write(left, new byte[]{1, 2, 3});；接收对象为 Files，调用 write 的实参为 left, new byte[]{1, 2, 3}。
        // 关键变化：Files.write(left, new byte[]{1, 2, 3});；将 new byte[]{1, 2, 3} 写入路径 left；write 返回目标 Path，文件内容更新。
        Files.write(right, new byte[]{1, 9, 3});
        // 输入：Files.write(right, new byte[]{1, 9, 3});；接收对象为 Files，调用 write 的实参为 right, new byte[]{1, 9, 3}。
        // 关键变化：Files.write(right, new byte[]{1, 9, 3});；将 new byte[]{1, 9, 3} 写入路径 right；write 返回目标 Path，文件内容更新。
        System.out.println(Files.mismatch(left, right));
        // 输出：1
        Files.deleteIfExists(left);
        // 输入：Files.deleteIfExists(left);；接收对象为 Files，调用 deleteIfExists 的实参为 left。
        // 关键变化：Files.deleteIfExists(left);；删除路径 left；路径存在时返回 true，不存在时返回 false；文件系统状态更新。
        Files.deleteIfExists(right);
        // 输入：Files.deleteIfExists(right);；接收对象为 Files，调用 deleteIfExists 的实参为 right。
        // 关键变化：Files.deleteIfExists(right);；删除路径 right；路径存在时返回 true，不存在时返回 false；文件系统状态更新。
    }
}
```

### `FileTime`：读写文件时间

文件系统的时间精度和可写性因平台而异，时间戳不能单独作为版本或并发控制依据。

```java
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.attribute.FileTime;

public class FileTimeDemo {
    public static void main(String[] args) throws Exception {
        Path file = Files.createTempFile("java-time-", ".txt");
        // 输入：Path file = Files.createTempFile("java-time-", ".txt");；右侧表达式 Files.createTempFile("java-time-", ".txt") 的结果赋给 file。
        // 关键变化：Path file = Files.createTempFile("java-time-", ".txt");；调用 createTempFile，实参为 "java-time-", ".txt"，返回值写入 file。
        FileTime now = FileTime.fromMillis(0);
        // 输入：FileTime now = FileTime.fromMillis(0);；右侧表达式 FileTime.fromMillis(0) 的结果赋给 now。
        // 关键变化：FileTime now = FileTime.fromMillis(0);；调用 fromMillis，实参为 0，返回值写入 now。
        Files.setLastModifiedTime(file, now);
        // 输入：Files.setLastModifiedTime(file, now);；接收对象为 Files，调用 setLastModifiedTime 的实参为 file, now。
        // 关键变化：Files.setLastModifiedTime(file, now);；调用 setLastModifiedTime，实参为 file, now；把 file 的最后修改时间设为 now；返回目标 Path。
        System.out.println(Files.getLastModifiedTime(file).toMillis());
        // 输出：0
        Files.deleteIfExists(file);
        // 输入：Files.deleteIfExists(file);；接收对象为 Files，调用 deleteIfExists 的实参为 file。
        // 关键变化：Files.deleteIfExists(file);；删除路径 file；路径存在时返回 true，不存在时返回 false；文件系统状态更新。
    }
}
```

### Zip 文件系统：把压缩包当作 Path

Zip 文件系统适合批处理压缩包内容；必须关闭 FileSystem，且不要把不可信压缩包直接展开到未校验的目录。

```java
// 说明：zip 是新建的 .zip 路径；create=true 让 Zip FileSystem 创建容器，writeString 以 UTF-8 写入 /inside.txt 的 3 个 ASCII 字节。
import java.net.URI;
import java.nio.file.FileSystem;
import java.nio.file.FileSystems;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.Map;

public class ZipFileSystemDemo {
    public static void main(String[] args) throws Exception {
        Path zip = Files.createTempFile("java-zip-", ".zip");
        // 输入：Path zip = Files.createTempFile("java-zip-", ".zip");；右侧表达式 Files.createTempFile("java-zip-", ".zip") 的结果赋给 zip。
        // 关键变化：Path zip = Files.createTempFile("java-zip-", ".zip");；调用 createTempFile，实参为 "java-zip-", ".zip"，返回值写入 zip。
        URI uri = URI.create("jar:" + zip.toUri());
        // 输入：URI uri = URI.create("jar:" + zip.toUri());；右侧表达式 URI.create("jar:" + zip.toUri()) 的结果赋给 uri。
        // 关键变化：URI uri = URI.create("jar:" + zip.toUri());；按 "jar:" + zip.toUri() 调用 create 创建值，结果写入 uri。
        try (FileSystem fs = FileSystems.newFileSystem(uri, Map.of("create", "true"))) {
        // 输入：try (FileSystem fs = FileSystems.newFileSystem(uri, Map.of("create", "true"))) {；资源变量 fs 接收 FileSystems.newFileSystem(uri, Map.of("create", "true"))，try 结束时自动关闭。
        // 关键变化：try (FileSystem fs = FileSystems.newFileSystem(uri, Map.of("create", "true"))) {；创建资源 fs，构造表达式为 FileSystems.newFileSystem(uri, Map.of("create", "true"))；try 结束时关闭该资源。
            Files.writeString(fs.getPath("/inside.txt"), "zip");
            // 输入：Files.writeString(fs.getPath("/inside.txt"), "zip");；接收对象为 Files，调用 writeString 的实参为 fs.getPath("/inside.txt"), "zip"。
            // 关键变化：Files.writeString(fs.getPath("/inside.txt"), "zip");；将 "zip" 写入路径 fs.getPath("/inside.txt")；writeString 返回目标 Path，文件内容更新。
            System.out.println(Files.exists(fs.getPath("/inside.txt")));
            // 输出：true
        }
        Files.deleteIfExists(zip);
        // 输入：Files.deleteIfExists(zip);；接收对象为 Files，调用 deleteIfExists 的实参为 zip。
        // 关键变化：Files.deleteIfExists(zip);；删除路径 zip；路径存在时返回 true，不存在时返回 false；文件系统状态更新。
    }
}
```
## 简单案例

```java
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;

public class PathFilesDemo {
    public static void main(String[] args) throws Exception {
        Path directory = Files.createTempDirectory("path-files-demo-");
        // 输入：Path directory = Files.createTempDirectory("path-files-demo-");；右侧表达式 Files.createTempDirectory("path-files-demo-") 的结果赋给 directory。
        // 关键变化：Path directory = Files.createTempDirectory("path-files-demo-");；调用 createTempDirectory，实参为 "path-files-demo-"，返回值写入 directory。
        Path source = directory.resolve("source.txt");
        // 输入：Path source = directory.resolve("source.txt");；右侧表达式 directory.resolve("source.txt") 的结果赋给 source。
        // 关键变化：Path source = directory.resolve("source.txt");；调用 resolve，实参为 "source.txt"，返回值写入 source。
        Path copy = directory.resolve("copy.txt");
        // 输入：Path copy = directory.resolve("copy.txt");；右侧表达式 directory.resolve("copy.txt") 的结果赋给 copy。
        // 关键变化：Path copy = directory.resolve("copy.txt");；调用 resolve，实参为 "copy.txt"，返回值写入 copy。
        Files.writeString(source, "Path + Files", StandardCharsets.UTF_8);
        // 输入：Files.writeString(source, "Path + Files", StandardCharsets.UTF_8);；接收对象为 Files，调用 writeString 的实参为 source, "Path + Files", StandardCharsets.UTF_8。
        // 关键变化：Files.writeString(source, "Path + Files", StandardCharsets.UTF_8);；将 "Path + Files"，字符集为 StandardCharsets.UTF_8 写入路径 source；writeString 返回目标 Path，文件内容更新。
        Files.copy(source, copy);
        // 输入：Files.copy(source, copy);；接收对象为 Files，调用 copy 的实参为 source, copy。
        // 关键变化：Files.copy(source, copy);；将 source 复制到 copy，返回目标 Path；目标文件更新。
        try (var paths = Files.list(directory)) {
        // 输入：try (var paths = Files.list(directory)) {；资源变量 paths 接收 Files.list(directory)，try 结束时自动关闭。
        // 关键变化：try (var paths = Files.list(directory)) {；创建资源 paths，构造表达式为 Files.list(directory)；try 结束时关闭该资源。
            System.out.println(paths.map(Path::getFileName).count());
            // 输出：2
        }
        System.out.println(Files.readString(copy, StandardCharsets.UTF_8));
        // 输出：Path + Files
        Files.deleteIfExists(copy);
        // 输入：Files.deleteIfExists(copy);；接收对象为 Files，调用 deleteIfExists 的实参为 copy。
        // 关键变化：Files.deleteIfExists(copy);；删除路径 copy；路径存在时返回 true，不存在时返回 false；文件系统状态更新。
        Files.deleteIfExists(source);
        // 输入：Files.deleteIfExists(source);；接收对象为 Files，调用 deleteIfExists 的实参为 source。
        // 关键变化：Files.deleteIfExists(source);；删除路径 source；路径存在时返回 true，不存在时返回 false；文件系统状态更新。
        Files.deleteIfExists(directory);
        // 输入：Files.deleteIfExists(directory);；接收对象为 Files，调用 deleteIfExists 的实参为 directory。
        // 关键变化：Files.deleteIfExists(directory);；删除路径 directory；路径存在时返回 true，不存在时返回 false；文件系统状态更新。
    }
}
```

示例覆盖了创建目录、写入、复制、列举和读取；生产代码还要在 finally 或清理策略中处理异常中断留下的临时文件。

## 易混点

- `Path.equals` 比较路径结构，`Files.isSameFile` 比较实际文件对象，不能混用。
- `list` 是一层遍历，`walk` 是递归遍历；两者返回 Stream，都需要关闭。
- `readString`/`readAllBytes` 是一次性读取，文件大小不可控时要改用缓冲或 Channel。
- `normalize` 不解析符号链接；处理外部路径还要做真实路径和根目录校验。

## 课后小问

1. 为什么 `Files.exists(path)` 不能替代后续的 `Files.readString(path)` 异常处理？
答案：检查和实际读取之间可能发生删除、权限变化或替换，结果存在竞态。
解析：把预检查当作提示即可，真正操作仍要捕获 `IOException` 和具体异常。

2. 为什么 `Files.walk` 必须放进 try-with-resources？
答案：遍历 Stream 可能持有打开的目录句柄，关闭终端操作并不总是自动释放它。
解析：资源关闭还能保证异常路径不泄漏句柄，尤其是 Windows 上的目录删除场景。

## 本节小结

- Path 负责路径值，Files 负责文件系统操作。
- 文本、字节、小文件、大文件和目录遍历应选择不同读写 API。
- 复制、移动、删除、属性和符号链接都存在明确的选项和异常边界。
- 文件流、目录流和 Zip 文件系统都必须按资源管理。

## 快速回顾

- 用 `Path.of`/`resolve` 组合路径，用 `Files` 完成访问。
- 小文本用 `readString`，大文件用流式或分块 API。
- `copy`、`move` 是否覆盖和是否原子要显式选择。
- `list`/`walk`/`lines` 返回的 Stream 必须关闭。
