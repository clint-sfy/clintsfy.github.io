---
title: ServiceLoader 服务发现
date: 2026-09-27T00:00:00.000Z
category: Java基础快速入门
tags:
  - Java
  - ServiceLoader
  - SPI
  - 模块化
description: 直接用 Java 案例速查 ServiceLoader 的接口、提供方、惰性加载、过滤、刷新和模块路径边界。
---

# ServiceLoader 服务发现

## 学习目标

- 能定义 SPI 接口、实现提供方，并使用 ServiceLoader 查找实现。
- 能理解 classpath 的 META-INF/services 和模块路径的 uses/provides 对应关系。
- 能处理惰性实例化、重复实现、加载失败、刷新和服务排序边界。

## 核心知识点

### 专业术语

- **SPI（Service Provider Interface）**：由调用方定义、由外部模块实现的扩展接口。
- **ServiceLoader**：按类路径或模块层查找服务提供者的 JDK 工具类。
- **Provider**：实现服务接口的提供者描述，可在需要时再创建实例。
- **服务配置**：classpath 下的 `META-INF/services/接口全名`，或 module-info 中的 `uses/provides`。

### 白话解释与边界

ServiceLoader 是“按约定发现实现”，不是依赖注入容器，也不会自动做版本选择、排序、生命周期管理或线程安全封装。提供方通常在第一次迭代或 `get()` 时惰性创建，因此服务构造器不能有不可控副作用。应用要决定找不到、多个、加载失败和重载时怎么处理。

## 常用用法

### 定义服务接口

接口模块只发布稳定能力，不依赖任何具体实现；实现模块或 JAR 反向依赖服务接口。

```java
// 说明：定义服务接口。
public interface Formatter {
    String format(String value);
}
// 输出：定义可由多个提供方实现的 Formatter 服务契约。
```

### `ServiceLoader.load`：查找服务

`load` 只创建发现器，不保证已经实例化提供方；要看到实现必须在 classpath 配置 `META-INF/services/Formatter`，或在模块中声明 `uses/provides`。

```java
// 说明：ServiceLoader.load：查找服务。
import java.util.ServiceLoader;

interface Formatter { String format(String value); }

public class ServiceLoadDemo {
    public static void main(String[] args) {
        ServiceLoader<Formatter> loader = ServiceLoader.load(Formatter.class);
        System.out.println(loader != null);
        // 输出：true
    }
}
```

### `META-INF/services`：classpath 提供方配置

配置文件每行写一个实现类全名，空行和 `#` 注释会被忽略；文件必须放进提供方 JAR 的正确资源路径，类名拼写和可见构造器都要能被运行时加载。

```java
// 说明：META-INF/services：classpath 提供方配置。
// 文件：META-INF/services/com.example.spi.Formatter
com.example.json.JsonFormatter

// 文件：com/example/json/JsonFormatter.java
package com.example.json;

public class JsonFormatter implements com.example.spi.Formatter {
    public String format(String value) { return "json:" + value; }
}
// 输出：ServiceLoader 可从 classpath 配置发现 JsonFormatter。
```

### `for`：遍历并实例化提供方

增强 for 会按发现顺序惰性创建实例；不要假设遍历顺序就是优先级，多个实现要在业务层按能力、版本或配置选择。

```java
// 说明：loader 按 META-INF/services 发现 Encoder 提供方；每次 for 取出 encoder 时才可能创建实例，count 记录成功遍历数。
import java.util.ServiceLoader;

interface Encoder { String encode(String value); }

public class ServiceIteratorDemo {
    public static void main(String[] args) {
        ServiceLoader<Encoder> loader = ServiceLoader.load(Encoder.class);
        int count = 0;
        for (Encoder encoder : loader) {
            System.out.println(encoder.encode("java"));
            // 输出：由具体提供方决定
            count++;
        }
        System.out.println(count >= 0);
        // 输出：true
    }
}
```

### `findFirst`：选择第一个可用实现

`findFirst` 只适合“任意一个实现都能工作”的协议；若有多个实现，要明确选择规则并把缺失服务当成配置错误还是可选能力。

```java
// 说明：findFirst：选择第一个可用实现。
import java.util.ServiceLoader;

interface ClockSource { String now(); }

public class ServiceFirstDemo {
    public static void main(String[] args) {
        var first = ServiceLoader.load(ClockSource.class).findFirst();
        System.out.println(first.isPresent());
        // 输出：true 或 false
    }
}
```

### 延迟实例化服务：先筛选提供方元数据

`Provider.type()` 可在实例化前读取提供方类型；只有调用 `Provider.get()` 才创建对象，适合先按注解、类名或能力筛选。

```java
// 说明：延迟实例化服务：先筛选提供方元数据。
import java.util.ServiceLoader;

interface Parser { String parse(String value); }

public class ServiceProviderDemo {
    public static void main(String[] args) {
        long providers = ServiceLoader.load(Parser.class).stream()
                .filter(provider -> provider.type().getSimpleName().endsWith("Parser"))
                .count();
        System.out.println(providers >= 0);
        // 输出：true
    }
}
```

### 声明模块服务：连接使用方与提供方

模块路径下优先用声明式服务关系；服务接口所在模块不必 `requires` 每个实现模块，运行时由模块层解析提供方。

```java
// 说明：声明模块服务：连接使用方与提供方。
// 使用方 module-info.java
module app.main {
    uses com.example.spi.Formatter;
}

// 提供方 module-info.java
module app.json {
    requires app.spi;
    provides com.example.spi.Formatter
            with com.example.json.JsonFormatter;
}
// 输出：模块运行时可为 Formatter 使用方发现 JsonFormatter。
```

### `ServiceLoader.load` 指定类加载器

插件式应用常使用上下文类加载器；类加载器层级错误会出现“配置存在但发现不到”的问题，框架应明确谁负责设置和恢复上下文加载器。

```java
// 说明：ServiceLoader.load 指定类加载器。
import java.util.ServiceLoader;

interface Plugin { String name(); }

public class ServiceClassLoaderDemo {
    public static void main(String[] args) {
        ClassLoader loader = Thread.currentThread().getContextClassLoader();
        ServiceLoader<Plugin> services = ServiceLoader.load(Plugin.class, loader);
        System.out.println(services != null);
        // 输出：true
    }
}
```
## 不常用但需要知道

### `reload`：刷新发现结果

`reload` 清除已缓存的提供方信息，下一次遍历会重新查找；它不是热更新机制，已创建的实例和类加载器生命周期仍由应用管理。

```java
// 作用：通过 reload 刷新发现结果。
import java.util.ServiceLoader;

interface Reloadable { }

public class ServiceReloadDemo {
    public static void main(String[] args) {
        ServiceLoader<Reloadable> loader = ServiceLoader.load(Reloadable.class);
        loader.reload();
        System.out.println(loader != null);
        // 输出：true
    }
}
```

### `Provider.get`：按需创建单个实现

Provider 过滤后再 get 可以减少无关实例化；如果构造器失败，异常会在 get/遍历阶段暴露，调用方应记录提供方类型和配置来源。

```java
// 作用：通过 Provider.get 按需创建单个实现。
import java.util.ServiceLoader;

interface Renderer { String render(); }

public class ServiceProviderGetDemo {
    public static void main(String[] args) {
        var provider = ServiceLoader.load(Renderer.class).stream().findFirst();
        if (provider.isPresent()) {
            System.out.println(provider.get().getClass().getSimpleName());
            // 输出：由配置的实现类决定
        } else {
            System.out.println("none");
            // 输出：none
        }
    }
}
```

### `ServiceConfigurationError`：处理服务配置错误

配置文件不存在通常只是没有实现，类名错误、构造器失败或类型不匹配则可能抛 `ServiceConfigurationError`；可选插件可隔离失败，核心服务不应静默吞掉。

```java
// 作用：通过 ServiceConfigurationError 处理服务配置错误。
import java.util.ServiceConfigurationError;
import java.util.ServiceLoader;

interface BrokenService { }

public class ServiceErrorDemo {
    public static void main(String[] args) {
        try {
            for (BrokenService ignored : ServiceLoader.load(BrokenService.class)) {
                System.out.println(ignored);
            }
        } catch (ServiceConfigurationError e) {
            System.out.println(e.getClass().getSimpleName());
            // 输出：ServiceConfigurationError
        }
    }
}
```

### 提供者工厂方法

服务机制可识别符合约定的 provider 工厂；工厂适合隐藏构造细节，但仍需让模块声明和接口类型正确，不能把任意静态方法当成服务提供者。

```java
// 提供方可以声明静态 provider() 工厂，而不必暴露公开构造器
public final class FactoryFormatter implements com.example.spi.Formatter {
    private FactoryFormatter() { }

    public static FactoryFormatter provider() {
        return new FactoryFormatter();
    }

    public String format(String value) { return "factory:" + value; }
}
// 结果：ServiceLoader 通过 provider() 创建 FactoryFormatter，format("demo") 返回 "factory:demo"
```

### 服务发现与线程安全

ServiceLoader 的迭代和缓存使用要遵循其线程安全约定；需要并发消费时，先在单线程完成发现，再把已创建、不可变的服务实例交给并发代码。

```java
import java.util.ServiceLoader;

interface ThreadService { }

public class ServiceThreadBoundaryDemo {
    public static void main(String[] args) {
        ServiceLoader<ThreadService> loader = ServiceLoader.load(ThreadService.class);
        System.out.println(loader != null);
        // 输出：true
        // 不应让多个线程无协调地共享同一个 ServiceLoader 迭代器
    }
}
```

### `ModuleLayer`：从模块层加载服务

自定义 ModuleLayer 适合插件隔离和版本并存，但涉及模块解析、类加载器和生命周期；普通应用优先使用 boot layer 或 classpath ServiceLoader。

```java
// 作用：通过 ModuleLayer 从模块层加载服务。
import java.util.ServiceLoader;

public class ModuleLayerServiceDemo {
    public static void main(String[] args) {
        ServiceLoader<Object> loader = ServiceLoader.load(ModuleLayer.boot(), Object.class);
        System.out.println(loader != null);
        // 输出：true
    }
}
```
## 简单案例

```java
import java.util.ServiceLoader;

interface Formatter { String format(String value); }

public class ServiceLoaderDemo {
    public static void main(String[] args) {
        ServiceLoader<Formatter> services = ServiceLoader.load(Formatter.class);
        Formatter formatter = services.findFirst().orElse(value -> "default:" + value);
        System.out.println(formatter.format("java"));
        // 输出：由配置的实现决定，未配置时为 default:java
    }
}
```

使用时把实现类放入 `META-INF/services/Formatter`，或在模块中配置 uses/provides；示例保留默认实现，便于服务可选时安全降级。

## 易混点

- ServiceLoader 只做发现和惰性创建，不负责排序、版本协商、生命周期或依赖注入。
- classpath 用 META-INF/services，模块路径用 uses/provides；两边的类加载器和可见性都必须正确。
- `findFirst` 的“第一”不是业务优先级；多个实现要显式过滤或排序。
- 找不到服务和服务配置损坏是两类问题，前者可选、后者通常应报告错误。

## 课后小问

1. 为什么写了服务接口和实现类，ServiceLoader 仍然找不到实现？
答案：还缺少正确的 META-INF/services 文件，或模块缺少 uses/provides、类加载器不可见。
解析：服务发现依赖“接口全名→实现全名”的配置契约，不能只靠实现类在 classpath 上存在。

2. 为什么不能把 ServiceLoader 的遍历顺序当成优先级？
答案：发现顺序不是业务选择契约，可能随 classpath、模块层或打包顺序变化。
解析：需要优先级时给实现加能力元数据、配置或明确排序函数。

## 本节小结

- ServiceLoader 通过 SPI 把接口定义与实现发现解耦。
- classpath 使用 META-INF/services，模块化使用 uses/provides。
- 遍历和 Provider 都是惰性的，实例化、异常和资源生命周期由应用负责。
- 复杂插件需要处理类加载器、版本选择、隔离、线程安全和失败策略。

## 快速回顾

- `ServiceLoader.load` 创建发现器，迭代或 get 时才加载实现。
- `stream`/Provider 可先看类型，再决定是否实例化。
- `reload` 只刷新发现缓存，不是热更新。
- 找不到服务、实现重复和配置错误都要有明确业务处理。
