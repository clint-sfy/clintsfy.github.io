---
title: module-info 模块速查
date: 2026-09-27
category: Java基础快速入门
tags:
  - Java
  - module-info
  - JPMS
  - 模块
description: 直接用 Java module-info.java 案例速查 module、requires、exports、opens、uses 与 provides。
---

# module-info 模块速查

## 学习目标

- 能独立读懂和编写常见 `module-info.java` 声明。
- 能选择普通依赖、传递依赖、编译期可选依赖和反射开放方式。
- 能把 ServiceLoader 的 uses/provides 与模块路径运行命令连接起来。

## 核心知识点

### 专业术语

- **module-info.java**：模块描述符的源文件，编译后成为模块元数据。
- **requires**：声明当前模块读取另一个模块。
- **exports/opens**：分别公开普通 API 和开放深度反射。
- **uses/provides**：声明服务使用方与实现方，供 `ServiceLoader` 发现。

### 白话解释与边界

模块描述符解决三类问题：谁能被读取、哪些包对外公开、哪些运行时服务可以被发现。相比 classpath，模块系统会显式检查可读性和封装边界；`exports` 不等于 `opens`，`requires` 也不等于把依赖的包导出给下游。模块系统要求命名和路径一致可解析，迁移 classpath 时要逐步处理自动模块、未命名模块和 split package。

## 常用用法

### `module`：声明模块

```java
// 文件：src/com.example.app/module-info.java
module com.example.app {
}
```

模块名是依赖和运行命令使用的标识；建议使用稳定、唯一且可读的反向域名形式。

### `requires`：读取另一个模块

```java
// 文件：src/com.example.app/module-info.java
module com.example.app {
    requires java.net.http;
    requires com.example.core;
}
```

`requires` 只声明可读性和编译依赖，不会把 `com.example.core` 的包自动暴露给 `com.example.app` 的下游。

### `exports`：导出公共 API 包

```java
// 文件：src/com.example.core/module-info.java
module com.example.core {
    exports com.example.core.api;
}
```

只有导出的包才能被其他模块正常 import；实现包可留在模块内部，避免把内部类和可变细节变成公共契约。

### `exports ... to`：限定导出对象

```java
// 文件：src/com.example.core/module-info.java
module com.example.core {
    exports com.example.core.spi to com.example.plugin;
}
```

限定导出适合只给指定模块的 SPI 或兼容层；新增授权模块时要同步检查依赖图，避免出现隐含耦合。

### `opens`：开放深度反射

```java
// 文件：src/com.example.model/module-info.java
module com.example.model {
    opens com.example.model.entity;
}
```

开放包允许运行时反射访问非公开成员，但不允许其他模块直接编译调用其中的公共类型；开放范围应尽量小。

### `opens ... to`：只给指定框架开放

```java
// 文件：src/com.example.model/module-info.java
module com.example.model {
    opens com.example.model.entity to framework.runtime;
}
```

限定 opens 比整体开放更能保留封装，适合序列化或依赖注入框架；框架模块名必须真实存在并可解析。

### `requires transitive`：向下游传递可读性

```java
// 文件：src/com.example.api/module-info.java
module com.example.api {
    requires transitive java.logging;
}
```

只有公共 API 的签名暴露 `java.logging` 类型时才考虑传递依赖；实现细节普通 requires 即可。

## 不常用但需要知道

### `requires static`：编译时可选依赖

```java
// 文件：src/com.example.core/module-info.java
module com.example.core {
    requires static com.example.annotations;
}
```

`requires static` 让编译时可见而运行时可以缺席，适合注解和编译辅助库；实际执行路径使用的库仍必须在运行时提供。

### `uses`：声明服务使用方

```java
// 文件：src/com.example.app/module-info.java
module com.example.app {
    uses com.example.spi.Formatter;
}
```

声明 uses 后，模块中的 `ServiceLoader.load(Formatter.class)` 才能按模块服务配置发现实现；它不会自动创建任何实现实例。

### `provides ... with`：声明服务提供方

```java
// 文件：src/com.example.json/module-info.java
module com.example.json {
    requires com.example.spi;
    provides com.example.spi.Formatter
            with com.example.json.JsonFormatter;
}
```

实现类必须实现服务接口，通常需要 public 无参构造器或符合服务提供者约定的 provider 方法；具体组合见 [ServiceLoader 服务发现](/courses/java/08-反射与模块/07-ServiceLoader服务发现)。

### `open module`：整体开放

```java
// 文件：src/com.example.legacy/module-info.java
open module com.example.legacy {
    requires framework.runtime;
}
```

open module 允许所有包被深度反射，但仍不等于 exports；它适合迁移阶段，长期最好收敛到具体包和框架模块。

### `requires` 与 `exports` 的最小可运行模块

```java
// 文件：src/lib/module-info.java
module lib {
    exports lib.api;
}

// 文件：src/lib/lib/api/Message.java
package lib.api;

public class Message {
    public static String text() { return "module"; }
}

// 文件：src/app/module-info.java
module app {
    requires lib;
}

// 文件：src/app/app/Main.java
package app;

import lib.api.Message;

public class Main {
    public static void main(String[] args) {
        System.out.println(Message.text());
        // 输出：module
    }
}
```

编译时使用 `javac -d out --module-source-path src -m lib,app`，运行时使用 `java --module-path out -m app/app.Main`；删掉 `exports lib.api` 就会失去跨模块可见性。

### 模块路径与 classpath 迁移

```java
// Windows PowerShell 示例
javac -d out --module-source-path src -m app
java --module-path out --module app/app.Main
```

模块路径按模块描述解析依赖，classpath 上的旧 JAR 会落入未命名模块；迁移时先检查第三方 JAR 的自动模块名、重复包和反射需求。

### `jdeps`：静态依赖审计

```java
// Windows PowerShell 示例
jdeps --module-path lib --check app
jdeps --module-path lib -s app.jar
```

jdeps 能发现静态引用和模块关系，但反射、ServiceLoader、配置文件和动态类名可能不在结果中；它不是运行时完整测试。

### `jlink`：裁剪运行时

```java
// Windows PowerShell 示例
jlink --module-path "$env:JAVA_HOME/jmods;out" --add-modules app --output runtime
```

jlink 只适用于模块化依赖图，生成结果与操作系统和 CPU 平台相关；打包后仍要验证 TLS、字体、本地库和服务发现。

## 简单案例

```java
// 文件：src/app.api/module-info.java
module app.api {
    exports com.example.api;
}

// 文件：src/app.api/com/example/api/Hello.java
package com.example.api;

public class Hello {
    public static String message() { return "hello module"; }
}

// 文件：src/app.main/module-info.java
module app.main {
    requires app.api;
}

// 文件：src/app.main/com/example/main/Main.java
package com.example.main;

import com.example.api.Hello;

public class Main {
    public static void main(String[] args) {
        System.out.println(Hello.message());
        // 输出：hello module
    }
}
```

最小模块项目中，API 模块导出包，应用模块 requires 它；这就是“能读到”和“允许别人读到”的两层关系。

## 易混点

- `exports` 允许普通编译/调用，`opens` 允许深度反射；开放不等于导出。
- `requires` 是当前模块的依赖，`requires transitive` 才会影响下游模块可读性。
- `uses/provides` 是服务声明，ServiceLoader 才是运行时发现入口。
- `open module` 只是反射开放范围更大，不会自动让包成为公共 API。

模块路径与 classpath 的区别是解析和封装规则不同；open module 也只是扩大反射入口，而不是替代 `exports` 的公共 API 声明。

## 课后小问

1. 如果模块中有 public 类但没有 exports，其他模块能 import 它吗？
答案：不能，public 只解决 Java 访问修饰符，模块还必须导出所在包。
解析：模块系统和类成员访问是两层边界，缺少 exports 会在编译或运行解析阶段失败。

2. 为什么 `requires static` 不适合真正运行时必需的库？
答案：它允许运行时不提供依赖，实际调用时可能出现缺失模块错误。
解析：只有编译期注解等“不参与运行”的依赖才适合 static，业务执行依赖应使用普通 requires。

## 本节小结

- module-info.java 描述模块名称、依赖、公开包、反射开放和服务关系。
- requires/exports/opens 是模块封装的三条主线。
- transitive、static、qualified exports/opens 用于更细的依赖控制。
- 模块化命令、jdeps、jlink 要和真实运行、反射及服务发现一起验证。

## 快速回顾

- `module` 命名，`requires` 依赖，`exports` 公开 API。
- `opens` 开放反射，`uses` 声明使用服务，`provides` 声明实现服务。
- `requires transitive` 影响下游，`requires static` 允许运行时缺席。
- 模块路径强化封装，classpath/自动模块是迁移兼容手段。
