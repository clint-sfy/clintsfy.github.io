---
title: Velocity 代码生成
date: 2026-10-03
category: Java基础快速入门
tags:
  - Java
  - Velocity
  - 模板引擎
  - 代码生成
description: 使用 Apache Velocity 2.4.1 初始化模板引擎、加载受信任模板、组织上下文并安全生成文本。
---

# Velocity 代码生成

## 学习目标

- 能配置 Velocity 依赖、模板目录和 UTF-8 编码。
- 能把 `VelocityEngine`、`VelocityContext`、`Template` 与 `merge` 串成完整渲染流程。
- 能限制模板来源、上下文能力和输出路径，避免模板注入与任意文件覆盖。

## 核心知识点

Velocity 把稳定文本结构放进模板，把变化数据放进上下文，最后由模板引擎合并为字符串或文件。本文使用 `org.apache.velocity:velocity-engine-core:2.4.1`；Maven 坐标如下：

```xml
<dependency>
  <groupId>org.apache.velocity</groupId>
  <artifactId>velocity-engine-core</artifactId>
  <version>2.4.1</version>
</dependency>
```

Gradle（Groovy DSL）使用同一版本：

```groovy
dependencies {
    implementation 'org.apache.velocity:velocity-engine-core:2.4.1'
}
```

下文约定模板根目录是应用随包发布且经过代码审查的 `templates/`，模板名由代码选择而不是由请求参数决定。上下文只放字符串、数字、DTO 和只读集合，不放数据库连接、Spring 容器、类加载器或反射入口。

## 常用用法

### `Properties()`：创建引擎配置集

`Properties` 的空构造器创建可变的字符串键值集；这里的 `config` 专门承载 Velocity 资源加载器和编码选项，然后整体传给 `VelocityEngine`。

```java
// 说明：Properties()：创建引擎配置集。
import java.util.Properties;

Properties config = new Properties();
config.setProperty("resource.loader.file.path", "templates");
// config 中的 templates 是引擎随后查找 .vm 文件的受信任根目录。
System.out.println(config.getProperty("resource.loader.file.path"));
// 输出：templates
```

### `VelocityEngine.init`：初始化文件资源加载器

用途：用于显式指定受信任模板目录、UTF-8 编码并完成引擎初始化。

```java
// 说明：VelocityEngine.init：初始化文件资源加载器。
import java.util.Properties;
import org.apache.velocity.app.VelocityEngine;

public class VelocityInitDemo {
    public static void main(String[] args) {
        Properties config = new Properties();
        // config 限定 engine 只从 templates 目录按 UTF-8 解码模板。
        config.setProperty("resource.loaders", "file");
        config.setProperty("resource.loader.file.class",
                "org.apache.velocity.runtime.resource.loader.FileResourceLoader");
        config.setProperty("resource.loader.file.path", "templates");
        config.setProperty("resource.default_encoding", "UTF-8");
        VelocityEngine engine = new VelocityEngine(config);
        // init() 根据 config 创建文件资源加载器，之后 engine 才能查找模板。
        engine.init();
        System.out.println("Velocity ready");
        // 输出：Velocity ready
    }
}
```

### `VelocityContext.put`：提供最小模板数据

用途：用于按稳定键名写入模板真正需要的数据，形成可测试的输入契约。

```java
// 说明：VelocityContext.put：提供最小模板数据。
import java.util.List;
import org.apache.velocity.VelocityContext;

public class VelocityContextDemo {
    public static void main(String[] args) {
        List<String> fields = List.of("id", "name");
        // fields 保留字段顺序，模板中的 #foreach 会按 id、name 的顺序迭代。
        VelocityContext context = new VelocityContext();
        context.put("packageName", "example.user");
        context.put("className", "UserView");
        context.put("fields", fields);
        // context 只暴露模板使用的三个键，不向模板传递文件系统或反射能力。
        System.out.println(context.get("className"));
        // 输出：UserView
    }
}
```

### `Template.merge`：把上下文渲染为文本

用途：用于将已加载模板与上下文合并到 writer，并在落盘前检查生成结果。

```java
// 说明：Template.merge：把上下文渲染为文本。
import java.io.StringWriter;
import org.apache.velocity.Template;
import org.apache.velocity.VelocityContext;

public class VelocityMergeDemo {
    static String render(Template template) {
        VelocityContext context = new VelocityContext();
        context.put("className", "UserService");
        // 模板中的 $className 会从 context 取得 UserService。
        StringWriter writer = new StringWriter();
        // merge() 执行 template 并把结果写入内存 writer，此时还没有覆盖任何文件。
        template.merge(context, writer);
        String source = writer.toString();
        System.out.println(source.contains("UserService"));
        // 输出：模板使用 $className 时为 true
        return source;
    }
}
```

## 不常用但需要知道

### `VelocityEngine.getTemplate`：按 UTF-8 加载受信任模板

用途：用于从初始化时配置的资源目录加载固定模板名，并返回可重复合并的模板对象。

```java
// 作用：通过 VelocityEngine.getTemplate 按 UTF-8 加载受信任模板。
import java.nio.charset.StandardCharsets;
import org.apache.velocity.Template;
import org.apache.velocity.app.VelocityEngine;

public class VelocityLoadDemo {
    static Template load(VelocityEngine engine) {
        String templateName = "java/model.vm";
        // templateName 是代码选定的相对路径，不接受请求参数拼接的 ../。
        Template template = engine.getTemplate(
                templateName,
                StandardCharsets.UTF_8.name());
        // template 来自 engine 配置的 templates 根目录，并以 UTF-8 解码。
        System.out.println(template.getName());
        // 输出：java/model.vm
        return template;
    }
}
```

## 简单案例

在受信任目录创建 `templates/java/model.vm`：

```text
package $packageName;

public record $className(long id, String name) {}
```

下面的完整程序初始化引擎、加载模板、准备上下文并合并；四个对象使用同一组变量和模板名，因此示例可以直接串起来理解。

```java
import java.io.StringWriter;
import java.nio.charset.StandardCharsets;
import java.util.Properties;
import org.apache.velocity.Template;
import org.apache.velocity.VelocityContext;
import org.apache.velocity.app.VelocityEngine;

public class GenerateModelDemo {
    public static void main(String[] args) {
        Properties config = new Properties();
        // config 把 engine 的模板根目录固定为 templates。
        config.setProperty("resource.loaders", "file");
        config.setProperty("resource.loader.file.path", "templates");
        config.setProperty("resource.default_encoding", "UTF-8");
        VelocityEngine engine = new VelocityEngine(config);
        engine.init();
        VelocityContext context = new VelocityContext();
        context.put("packageName", "example.user");
        context.put("className", "UserView");
        // context 为 model.vm 中的 $packageName 和 $className 提供确定值。
        Template template = engine.getTemplate("java/model.vm", StandardCharsets.UTF_8.name());
        StringWriter writer = new StringWriter();
        // template 从 engine 的受信任目录加载；merge 只把渲染结果写入 writer。
        template.merge(context, writer);
        System.out.println(writer.toString().replace(System.lineSeparator(), " ").trim());
        // 输出：package example.user;  public record UserView(long id, String name) {}
    }
}
```

## 易混点

- `VelocityContext.put` 不会替 Java、SQL、HTML 或路径做转义；应按目标语言校验标识符和文本。
- `Template.merge` 成功只表示渲染完成，不表示生成的 Java 能编译或 SQL 可以安全执行。
- 模板目录和模板名必须来自配置或代码白名单；不要允许外部输入拼接 `../` 选择任意文件。
- 若要落盘，应先规范化目标路径并确认它仍位于允许的生成根目录，再明确拒绝覆盖或采用原子替换。
- 要求输出稳定时，应给模板传入有稳定顺序的 `List` 或 `LinkedHashMap`。

## 课后小问

1. 为什么不能把数据库连接或 Spring 容器放进上下文？
   答：模板只需要数据，能力对象会扩大模板可调用面，也会让模板难以隔离测试和审计。
2. 为什么合并后还应编译或解析生成物？
   答：模板语法正确不代表目标语言正确，编译或解析能发现缺值、非法标识符和结构错误。
3. 如何避免模板或生成文件越过允许目录？
   答：模板名使用代码白名单，目标路径规范化后校验仍在固定根目录内，并拒绝未经授权的覆盖。

## 本节小结

Velocity 代码生成的主线是：用固定版本依赖创建 `VelocityEngine`，从受信任资源目录取得 `Template`，用 `VelocityContext.put` 提供最小数据，再由 `Template.merge` 写入内存并校验结果。模板、输入、生成内容和落盘路径都需要独立边界，生成物仍应进入格式化、编译、测试与代码审查。
