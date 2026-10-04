---
title: JVM 诊断命令与 JFR
date: 2026-09-27T00:00:00.000Z
category: Java基础快速入门
tags:
  - Java
  - JVM
  - jcmd
  - JFR
description: 用 jps、jcmd、jstack、jmap、jstat 和 JFR 采集 JVM 现场证据并建立诊断顺序。
---

# JVM 诊断命令与 JFR

## 学习目标

- 根据现象选择进程、线程、堆、GC、类加载和 JFR 诊断命令。
- 使用 jcmd、jstack、jmap、jstat 得到可复核的现场数据。
- 用 JFR 低开销记录 CPU、锁、分配、GC 和虚拟线程事件，并结合时间线定位问题。

## 核心知识点

### 专业术语

- **jps**：列出本机可见 Java 进程及主类/参数。
- **jcmd**：向指定 JVM 发送诊断命令，统一入口查看 VM、GC、线程和 JFR。
- **jstack**：打印 Java 线程栈和锁等待信息。
- **jmap**：查看堆摘要、类直方图或生成堆转储。
- **jstat**：周期采样 GC、类加载和编译统计。
- **JFR（Java Flight Recorder）**：JDK 内置的事件记录器，适合按时间线分析运行时行为。

### 白话解释与边界

先记录现象、时间、PID、实例和负载，再按“进程是否存活 → 线程是否阻塞 → 堆/GC 是否异常 → CPU/锁/分配热点”的顺序采证。命令输出是快照或采样，不是永久真相；连续两三份快照比单份更能说明趋势。

诊断命令可能需要同用户权限、目标 JVM 启动参数和本机 JDK 工具；jmap/JFR dump 等操作可能造成停顿或占磁盘。生产操作要有时间窗口、文件保留和敏感数据管理。

## 常用用法

### ProcessHandle：取得当前进程 PID

拿到 PID 后，jcmd、jstack、jmap、jstat 和 JFR 命令才能定位到目标 JVM；PID 会变化，复制命令前再次确认进程名和启动时间。

```java
// 说明：ProcessHandle：取得当前进程 PID。
public class ProcessIdDemo {
// 作用：拿到 PID 后，jcmd、jstack、jmap、jstat 和 JFR 命令才能定位到目标 JVM；PID 会变化，复制命令前再次确认进程名和启动时间。
    public static void main(String[] args) {
        System.out.println("pid=" + ProcessHandle.current().pid());
        // 输出：pid=12345（进程号可能不同）
    }
}
```

### jps -lv：列出 Java 进程

`jps -lv` 适合快速发现 PID、主类和 JVM 参数；容器、远程或权限隔离场景可能看不到全部进程，应配合操作系统进程工具。

```java
// 说明：jps -lv：列出 Java 进程。
public class JpsHintDemo {
// 作用：jps -lv 适合快速发现 PID、主类和 JVM 参数；容器、远程或权限隔离场景可能看不到全部进程，应配合操作系统进程工具。
    public static void main(String[] args) {
        System.out.println("jps -lv");
        // 输出：jps -lv
    }
}
```

### jcmd VM.version：确认目标 JVM

先确认目标确实是预期 JDK 版本，再解释 GC 参数或 API 行为；不同发行版的诊断输出字段可能不同。

```java
// 说明：jcmd VM.version：确认目标 JVM。
public class JcmdVersionHintDemo {
// 作用：先确认目标确实是预期 JDK 版本，再解释 GC 参数或 API 行为；不同发行版的诊断输出字段可能不同。
    public static void main(String[] args) {
        System.out.println("jcmd <pid> VM.version");
        // 输出：jcmd <pid> VM.version
    }
}
```

### 捕获线程快照：同时记录线程与锁信息

重点观察 RUNNABLE、BLOCKED、WAITING、锁拥有者、等待对象和调用栈。

```java
// 说明：捕获线程快照：同时记录线程与锁信息。
public class ThreadPrintHintDemo {
    public static void main(String[] args) {
        System.out.println("jcmd <pid> Thread.print -l");
        // 输出：jcmd <pid> Thread.print -l
    }
}
```

连续采集多份并按时间对比，能区分短暂竞争与长期卡住。

### jstack -l：线程转储兼容入口

`-l` 请求更详细的锁信息；如果目标 JVM 被阻塞、权限不够或平台限制，命令可能失败。

```java
// 说明：jstack -l：线程转储兼容入口。
public class JstackHintDemo {
// 作用：-l 请求更详细的锁信息；如果目标 JVM 被阻塞、权限不够或平台限制，命令可能失败。
    public static void main(String[] args) {
        System.out.println("jstack -l <pid>");
        // 输出：jstack -l <pid>
    }
}
```

不要因一次空输出就判断没有线程问题。

### jmap -histo:live：类直方图

类直方图能帮助定位数量异常的 String、数组、集合和业务对象；live 选项可能触发 GC 或停顿，线上应先评估成本。

```java
// 说明：jmap -histo:live：类直方图。
public class JmapHistogramHintDemo {
// 作用：类直方图能帮助定位数量异常的 String、数组、集合和业务对象；live 选项可能触发 GC 或停顿，线上应先评估成本。
    public static void main(String[] args) {
        System.out.println("jmap -histo:live <pid>");
        // 输出：jmap -histo:live <pid>
    }
}
```

### jmap -dump：生成堆转储

堆转储通常很大且可能包含业务数据，目录、权限、加密和保留周期要提前规划。

```java
// 说明：jmap -dump：生成堆转储。
public class JmapDumpHintDemo {
// 作用：堆转储通常很大且可能包含业务数据，目录、权限、加密和保留周期要提前规划。
    public static void main(String[] args) {
        System.out.println("jmap -dump:live,format=b,file=app.hprof <pid>");
        // 输出：jmap -dump:live,format=b,file=app.hprof <pid>
    }
}
```

OOM 自动转储与 jcmd GC.heap_dump 也是常见替代方案。

### jstat -gcutil：采样 GC 利用率

这个命令每秒采样一次、共十次；结果适合快速看趋势，不替代统一 GC 日志，也不应只根据某一列百分比调整参数。

```java
// 说明：jstat -gcutil：采样 GC 利用率。
public class JstatGcHintDemo {
// 作用：这个命令每秒采样一次、共十次；结果适合快速看趋势，不替代统一 GC 日志，也不应只根据某一列百分比调整参数。
    public static void main(String[] args) {
        System.out.println("jstat -gcutil <pid> 1000 10");
        // 输出：jstat -gcutil <pid> 1000 10
    }
}
```

### 完成一次 JFR 记录：启动、导出并停止

JFR.start 可以用 default/profile 配置和 duration 限制范围；先短时记录，发现问题后再 dump。

```java
// 说明：完成一次 JFR 记录：启动、导出并停止。
public class JfrCommandHintDemo {
    public static void main(String[] args) {
        System.out.println("jcmd <pid> JFR.start name=diag settings=profile duration=60s filename=diag.jfr");
        // 输出：JFR.start 命令
        System.out.println("jcmd <pid> JFR.dump name=diag filename=diag-now.jfr");
        // 输出：JFR.dump 命令
        System.out.println("jcmd <pid> JFR.stop name=diag");
        // 输出：JFR.stop 命令
    }
}
```

文件包含线程、类、分配和业务事件，保存和共享前要审查敏感字段。

### Recording API：在代码中控制 JFR

Recording API 适合应用自己围绕一次请求或测试控制记录，但必须设置时长、事件和文件目录，避免无界记录。

```java
// 说明：Recording API：在代码中控制 JFR。
import jdk.jfr.Recording;
import java.nio.file.Path;

public class JfrApiDemo {
// 作用：Recording API 适合应用自己围绕一次请求或测试控制记录，但必须设置时长、事件和文件目录，避免无界记录。
    public static void main(String[] args) throws Exception {
        try (Recording recording = new Recording()) {
// 关键变化：recording 接收表达式 new Recording()) { 的计算结果。
// 初始状态：recording 的初始值为 new Recording())。
            recording.start();
            System.out.println("recording");
            // 输出：recording
            recording.stop();
            recording.dump(Path.of("diagnostic.jfr"));
        }
    }
}
```

JFR 记录结束后用 JDK Mission Control 等工具分析事件时间线。
## 不常用但需要知道

### 获取对象直方图：不生成完整堆转储

它比完整堆转储轻量但仍可能触发较重操作；适合先粗看对象数量，再决定是否采集 hprof。

```java
public class JcmdHistogramHintDemo {
    public static void main(String[] args) {
        System.out.println("jcmd <pid> GC.class_histogram");
        // 输出：jcmd <pid> GC.class_histogram
    }
}
```

### jcmd VM.native_memory：本地内存分类

Native Memory Tracking 必须在启动时启用，不能事后补开；它有运行时开销，适合专门诊断元空间、线程栈、代码缓存和本地分配的异常。

```java
// 说明：先用 -XX:NativeMemoryTracking=summary 启动 app.jar，再将 <pid> 替换为该 JVM 进程号查询线程栈、元空间和代码缓存等本地内存分类。
public class NativeMemoryHintDemo {
// 作用：Native Memory Tracking 必须在启动时启用，不能事后补开；它有运行时开销，适合专门诊断元空间、线程栈、代码缓存和本地分配的异常。
    public static void main(String[] args) {
        System.out.println("java -XX:NativeMemoryTracking=summary -jar app.jar");
        // 输出：NMT 启动参数
        System.out.println("jcmd <pid> VM.native_memory summary");
        // 输出：NMT 查询命令
    }
}
```

### JFR EventSettings：按事件降低噪声

按需开启事件、设置阈值和采样周期可以减少文件大小；事件名称和字段以目标 JDK 文档为准，不能把某一版本的事件集合当成永久稳定清单。

```java
// 说明：recording 只启用 jdk.CPULoad 事件并设为每 1 秒记录；start/stop 之间没有长工作负载，此例只验证事件配置。
import jdk.jfr.Recording;

public class JfrEventSettingDemo {
// 作用：按需开启事件、设置阈值和采样周期可以减少文件大小；事件名称和字段以目标 JDK 文档为准，不能把某一版本的事件集合当成永久稳定清单。
    public static void main(String[] args) throws Exception {
        try (Recording recording = new Recording()) {
// 关键变化：recording 接收表达式 new Recording()) { 的计算结果。
// 初始状态：recording 的初始值为 new Recording())。
            recording.enable("jdk.CPULoad").withPeriod(java.time.Duration.ofSeconds(1));
            recording.start();
            recording.stop();
            System.out.println("cpu event configured");
            // 输出：cpu event configured
        }
    }
}
```

### jcmd Compiler.queue：观察编译队列

编译队列适合调查热方法迟迟未优化或启动抖动，但解释 JIT 问题还要结合 JFR ExecutionSample、编译日志和实际 CPU。

```java
// 说明：将 <pid> 替换为目标 JVM 进程号，Compiler.queue 输出当前等待 C1/C2 JIT 编译的方法，不会生成转储文件。
public class CompilerQueueHintDemo {
// 作用：编译队列适合调查热方法迟迟未优化或启动抖动，但解释 JIT 问题还要结合 JFR ExecutionSample、编译日志和实际 CPU。
    public static void main(String[] args) {
        System.out.println("jcmd <pid> Compiler.queue");
        // 输出：jcmd <pid> Compiler.queue
    }
}
```
## 简单案例

```java
public class DiagnosticOrderDemo {
    public static void main(String[] args) {
        System.out.println("1. confirm pid and JVM version");
        // 输出：1. confirm pid and JVM version
        System.out.println("2. capture thread/GC snapshot");
        // 输出：2. capture thread/GC snapshot
        System.out.println("3. record short JFR window");
        // 输出：3. record short JFR window
    }
}
```

诊断顺序先确认对象，再采集低成本快照，最后用有限时长 JFR 深挖；每一步都记录时间和参数，方便和业务指标对齐。

## 易混点

- jps 看不到进程不一定代表进程不存在，容器和权限隔离会影响可见性。
- jstack/jcmd Thread.print 是线程快照，jstat 是采样，JFR 是带时间线的事件记录。
- jmap -histo:live、heap dump 和 JFR 的成本与数据敏感度不同，不能无条件在线上执行。
- JFR 的低开销不是零开销，记录时长、事件、阈值和文件管理仍需限制。
- PID 会变化，诊断命令前应再次核对主类、启动时间和 JVM 版本。

## 课后小问

1. 线程卡住时为什么先用 jcmd Thread.print 而不是立刻 dump 堆？
答案：线程转储成本较低，能先确认锁等待、死锁、I/O 和调用栈方向。
解析：堆转储可能造成停顿并生成大文件，应在需要对象引用链时再采集。

2. jstat 和 JFR 的关系是什么？
答案：jstat 适合快速周期采样，JFR 记录带时间线的多维事件，二者互补。
解析：先用 jstat 看是否有明显 GC 趋势，再用 JFR 关联 CPU、锁、分配、线程和 GC 时间。

3. 为什么 JFR 文件不能直接上传到公共位置？
答案：事件可能包含类名、线程名、参数、路径和业务上下文等敏感信息。
解析：先审查事件和设置、做访问控制与保留策略，再在受控环境分析。

## 本节小结

- JVM 诊断先确认 PID/JDK，再按线程、GC、堆、CPU 和分配层次采证。
- jcmd 是主入口，jstack 看线程，jmap 看堆，jstat 看采样，JFR 看时间线。
- 诊断命令可能有停顿、权限和敏感数据成本，生产使用要有窗口与保留策略。
- 连续快照、统一时间和业务指标对齐，比孤立的一条命令更可靠。

## 快速回顾

- 会用 jps、jcmd、jstack、jmap、jstat 的基本诊断方向。
- 会启动、dump、停止一段有限时长 JFR。
- 能根据现象选择线程转储、堆直方图或完整 hprof。
- 知道诊断数据的权限、停顿、磁盘和敏感信息边界。
