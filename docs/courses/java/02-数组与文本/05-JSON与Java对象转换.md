---
title: JSON 与 Java 对象转换
date: 2026-09-27
category: Java基础快速入门
tags:
  - Java
  - JSON
  - Hutool
  - JSONUtil
description: 使用 Hutool JSONUtil 完成 JSON 字符串、JavaBean、Map、数组与泛型集合之间的转换。
---

# JSON 与 Java 对象转换

## 学习目标

- 了解 JSON 对象、数组、字符串、数字、布尔值和 `null` 的基本形状。
- 使用 Hutool `JSONUtil` 完成对象序列化、对象解析、数组解析和 Bean 映射。
- 为 `List<T>`、嵌套泛型、日期格式和缺失字段选择明确的转换策略。
- 区分 JSON 转换工具与输入校验、业务授权、数据库模型之间的职责。

## 核心知识点

### 专业术语

- **JSON（JavaScript Object Notation）**：以文本表达对象和数组的数据交换格式。
- **JSONObject/JSONArray**：Hutool 提供的动态 JSON 对象和数组容器。
- **序列化（serialization）**：把 Java 对象转换成 JSON 文本。
- **反序列化（deserialization）**：把 JSON 文本映射成 Java 对象或集合。
- **类型擦除（type erasure）**：运行时的 `List.class` 不携带 `User` 等元素类型，需要额外的类型描述。

### 白话解释与边界

`JSONUtil` 是 Hutool 的第三方便利层，不是 JDK 标准库。`toJsonStr` 负责“对象变成文本”，`parseObj`、`parseArray` 负责“文本先变成动态容器”，`toBean` 和 `toList` 负责“映射成明确类型”。转换成功不等于输入可信：字段缺失、类型不匹配、额外字段、日期时区和业务校验都要在边界处明确处理。

本页示例依赖 `hutool-all`，项目接入时以自己的依赖管理和版本策略为准：

```xml
<dependency>
    <groupId>cn.hutool</groupId>
    <artifactId>hutool-all</artifactId>
    <version>5.8.38</version>
</dependency>
```

## 常用用法

### `JSONUtil.toJsonStr`：对象转 JSON 字符串

```java
import cn.hutool.json.JSONUtil;
import java.util.LinkedHashMap;
import java.util.Map;

Map<String, Object> user = new LinkedHashMap<>();
user.put("name", "Ann");
user.put("age", 18);
String json = JSONUtil.toJsonStr(user);
System.out.println(json);
// 输出：{"name":"Ann","age":18}
```

可以序列化 JavaBean、集合和 Map；字段可见性、`null`、日期和自定义配置会影响结果。协议输出不要依赖未经约定的字段顺序。

### `JSONUtil.parseObj`：解析 JSONObject

```java
import cn.hutool.json.JSONUtil;

var object = JSONUtil.parseObj("{\"name\":\"Ann\",\"age\":18}");
String name = object.getStr("name");
System.out.println(name + ", " + object.getInt("age"));
// 输出：Ann, 18
```

适合少量字段读取或先观察结构；字段缺失时要区分 `null`、默认值和“输入无效”，不要把动态读取当作完整校验。

### `JSONUtil.parseArray`：解析 JSONArray

```java
import cn.hutool.json.JSONUtil;

var array = JSONUtil.parseArray("[{\"name\":\"Ann\"},{\"name\":\"Bo\"}]");
System.out.println(array.size() + ", " + array.getJSONObject(0).getStr("name"));
// 输出：2, Ann
```

输入根节点必须是数组；按索引读取前要考虑数组为空、元素不是对象以及字段缺失。

### `JSONUtil.toBean`：JSON 转 JavaBean

```java
import cn.hutool.json.JSONUtil;

class User {
    public String name;
    public int age;
}

User user = JSONUtil.toBean("{\"name\":\"Ann\",\"age\":18}", User.class);
System.out.println(user.name + ", " + user.age);
// 输出：Ann, 18
```

把一个 JSON 对象映射为明确的 Bean，目标类应有可写属性或符合映射要求的构造方式；映射完成后仍应做必填、范围和权限校验。

### `JSONUtil.toList`：JSON 数组转 `List<T>`

```java
import cn.hutool.json.JSONUtil;
import java.util.List;

class User {
    public String name;
}

var array = JSONUtil.parseArray("[{\"name\":\"Ann\"}]");
List<User> users = JSONUtil.toList(array, User.class);
System.out.println(users.get(0).name);
// 输出：Ann
```

显式传入元素类型，避免只得到原始 `List`；转换后要考虑空数组、元素类型和异常元素的错误处理。

### `JSONUtil.parse`：根据根节点解析 JSON

```java
import cn.hutool.json.JSON;
import cn.hutool.json.JSONUtil;

JSON parsed = JSONUtil.parse("[1, 2]");
System.out.println(parsed.getClass().getSimpleName());
// 输出：JSONArray
```

返回更宽的 `JSON` 抽象，适合根节点形状暂时不确定的场景；确定协议后优先使用 `parseObj`、`parseArray` 或 `toBean`。

### `JSONUtil.toBean` + `TypeReference`：转换嵌套泛型

```java
import cn.hutool.core.lang.TypeReference;
import cn.hutool.json.JSONUtil;
import java.util.List;
import java.util.Map;

class User {
    public String name;
}

String json = "{\"admins\":[{\"name\":\"Ann\"}]}";
Map<String, List<User>> grouped = JSONUtil.toBean(
    json, new TypeReference<Map<String, List<User>>>() {}, false);
System.out.println(grouped.get("admins").get(0).name);
// 输出：Ann
```

`Class<T>` 无法表达 `Map<String, List<User>>` 等嵌套参数，使用 `TypeReference` 捕获泛型，并明确 `ignoreError` 等错误策略。

### `JSONUtil.toJsonStr` + `toBean`：复制一个对象

```java
import cn.hutool.json.JSONUtil;

class User {
    public String name;
}

User source = new User();
source.name = "Ann";
String json = JSONUtil.toJsonStr(source);
User copy = JSONUtil.toBean(json, User.class);
System.out.println(copy.name + ", same=" + (source == copy));
// 输出：Ann, same=false
```

序列化再映射可以得到独立对象，但性能、字段丢失、日期和嵌套引用都要评估；它不是通用深复制保证。

### `JSONConfig.setDateFormat`：固定日期文本格式

```java
import cn.hutool.json.JSONConfig;
import cn.hutool.json.JSONUtil;
import java.util.Date;

JSONConfig config = JSONConfig.create().setDateFormat("yyyy-MM-dd HH:mm:ss");
String json = JSONUtil.toJsonStr(java.util.Map.of("date", new Date(0)), config);
System.out.println(config.getDateFormat());
// 输出：yyyy-MM-dd HH:mm:ss
```

日期格式、时区和类型转换必须由项目协议明确约定；跨服务优先考虑带时区的 ISO-8601，而不是依赖机器默认时区。

## 不常用但需要知道

### `JSONUtil.toJsonPrettyStr`：输出缩进 JSON

```java
import cn.hutool.json.JSONUtil;
import java.util.Map;

String pretty = JSONUtil.toJsonPrettyStr(Map.of("name", "Ann"));
System.out.println(pretty.contains("\n"));
// 输出：true
```

适合日志和人工阅读，不建议把带缩进的文本直接当作高频网络协议格式。

### `JSONUtil.readJSON`：从文件读取 JSON

```java
import cn.hutool.json.JSON;
import cn.hutool.json.JSONUtil;
import java.io.File;
import java.nio.charset.StandardCharsets;

JSON json = JSONUtil.readJSON(new File("user.json"), StandardCharsets.UTF_8);
System.out.println(json != null);
// 输出：true
```

快捷读取仍需自行处理文件不存在、文件大小、权限、字符集和异常；不应把本地文件内容直接当作可信输入。

### `JSONUtil.parseObj`：从动态对象读取嵌套结构

```java
import cn.hutool.json.JSONUtil;

var object = JSONUtil.parseObj("{\"profile\":{\"name\":\"Ann\"}}");
String name = object.getJSONObject("profile").getStr("name");
System.out.println(name);
// 输出：Ann
```

动态容器适合渐进式读取，但嵌套字段较多时容易出现空指针或类型假设；稳定协议优先映射成 Bean。

### `JSONUtil.toList`：读取标量列表

```java
import cn.hutool.json.JSONUtil;
import java.util.List;

List<Integer> values = JSONUtil.toList(JSONUtil.parseArray("[1, 2, 3]"), Integer.class);
System.out.println(values);
// 输出：[1, 2, 3]
```

元素不是对象时同样要显式声明类型；类型转换失败不要用空列表掩盖输入错误。

## 常见边界

- **字段缺失**：引用字段通常保持 `null`，基本类型可能是默认值；这不等于输入完整，接口边界仍应做必填校验。
- **类型不匹配**：字符串到数字、布尔值或日期的宽松转换取决于字段类型和 Hutool 配置；无法转换时可能抛出 `JSONException` 或转换异常。
- **额外字段**：是否忽略未知字段取决于映射配置和目标类型，不能把“成功构造对象”理解成字段已全部审计。
- **泛型与嵌套类型**：`User.class` 只能表达一个具体根类型，`List.class` 无法保留元素泛型；嵌套结构使用 `TypeReference`。
- **日期与时区**：字符串或时间戳的解释依赖格式和时区；项目应统一 ISO-8601 或显式 `JSONConfig`，并覆盖时区测试。
- **安全边界**：转换不会自动做授权、SQL 防注入、HTML 转义或大小限制；这些属于业务和输入边界责任。

## 简单案例

```java
import cn.hutool.json.JSONUtil;
import java.util.List;

public class JsonDemo {
    public static class User {
        public String name;
        public int age;
    }

    public static void main(String[] args) {
        String input = "[{\"name\":\"Ann\",\"age\":18}]";
        List<User> users = JSONUtil.toList(JSONUtil.parseArray(input), User.class);
        User first = users.get(0);
        String output = JSONUtil.toJsonStr(first);

        System.out.println(first.name + ", " + first.age);
        // 输出：Ann, 18
        System.out.println(output);
        // 输出：{"name":"Ann","age":18}
    }
}
```

案例展示“数组文本 → `JSONArray` → `List<User>` → JSON 文本”的完整路径。生产代码还要在读取数组前做长度限制、字段校验和异常翻译。

## 易混点

- `parseObj` 和 `parseArray` 先得到动态容器，`toBean` 和 `toList` 才是面向明确 Java 类型的映射入口。
- `List.class` 没有 `User` 的元素信息；单层对象列表使用 `toList(array, User.class)`，嵌套泛型使用 `TypeReference`。
- 转换成功不代表字段齐全、类型可信或权限合法，JSON 映射后仍要做领域校验。
- Hutool `JSONUtil` 是第三方库，不是 JDK 20 API；版本、配置、日期时区和异常类型应以项目依赖为准。

## 课后小问

1. 为什么 `JSONUtil.toBean(json, List.class)` 不能可靠表达 `List<User>`？
答案：`List.class` 在运行时没有保留元素的 `User` 泛型信息，映射器无法据此稳定地把每个对象转换成 User。
解析：单层列表可以使用 `JSONUtil.toList(array, User.class)`；多层泛型应使用 `TypeReference`，并对缺失字段、类型不匹配和日期格式做契约校验。

2. `toBean` 成功返回对象后，为什么还要做业务校验？
答案：映射只说明文本可以按目标类型构造，不保证必填字段、数值范围、状态转换或当前用户权限满足业务规则。
解析：把 JSON 转换、输入校验和领域授权分成不同步骤，才能明确错误来源，也避免宽松转换掩盖恶意或错误输入。

## 本节小结

- `toJsonStr` 负责序列化，`parseObj`/`parseArray` 负责动态解析，`toBean`/`toList` 负责明确类型映射。
- `TypeReference` 用于保留嵌套泛型，`JSONConfig` 用于显式约定日期等格式。
- 缺失字段、类型转换、额外字段、时区和输入大小都需要项目契约约束。
- JSONUtil 简化数据转换，但不替代安全检查、业务校验和错误处理。

## 快速回顾

- 能用 `toJsonStr` 把 Java 对象转成 JSON 文本。
- 能区分 `parseObj`、`parseArray`、`toBean` 和 `toList` 的使用场景。
- 能为 `List<User>` 与嵌套泛型选择正确的类型描述。
- 能说出 JSON 映射成功后仍需做字段、日期、权限和安全边界校验的原因。
