---
title: String 与文本处理
date: 2026-09-22
category: Java基础快速入门
tags:
  - Java
  - String
  - Unicode
description: 掌握不可变字符串、字符编码、StringBuilder 和正则表达式的基础用法。
---

# String 与文本处理

## 学习目标

- 理解 `String` 不可变性、字符串池和内容比较规则。
- 使用 `StringBuilder`、`split` 和正则表达式完成可读的文本清洗。
- 区分 UTF-8 字节、UTF-16 码元、Unicode 码点与用户可见字符。
- 了解项目中常见的 Hutool `JSONUtil` 转换入口，并识别它与 JDK 标准库的边界。

## 核心知识点

### 专业术语

- **不可变对象（immutable object）**：`String` 创建后内容不再改变，拼接或替换会返回新的字符串对象。
- **字符串池（string pool）**：运行时保存部分字符串字面量的共享区域，不能作为 `==` 内容比较的依据。
- **字符集（charset）**：把字符与字节编码互相转换的规则；跨边界文本应显式指定 `UTF-8` 等字符集。
- **UTF-16 code unit 与 Unicode code point**：Java 的 `char` 是 16 位码元，一个码点可能需要两个码元。
- **正则表达式（regular expression）**：按模式匹配文本的语言；`split` 的参数也会按正则解释。
- **JSON**：以文本表达对象和数组的数据格式；`JSONUtil` 是 Hutool 提供的第三方转换工具，不属于 JDK 20。

### 白话解释与边界

字符串像一张不可擦写的纸：`trim`、`replace` 或 `+` 不会修改原对象，而是产生新值。少量拼接没有问题；循环中大量拼接应使用 `StringBuilder`，避免反复创建中间字符串。文本离开 Java 内存时才是字节，读写必须指定字符集，不能把“当前系统默认编码”当成稳定协议。

`String.length()` 返回 UTF-16 码元数量，不一定等于 Unicode 码点数量，更不等于用户看到的字素簇数量；复杂排版还可能需要更高层的文本分段。正则适合字段级清洗，嵌套语法或需要精确错误位置的格式应使用专门解析器。

## 项目常用：Hutool JSONUtil

`JSONUtil` 来自 Hutool，是第三方库，不是 JDK 20 标准库；本仓库当前没有新增 Hutool 运行依赖，下面只作为项目速查示例。示例使用 `5.8.38`，这是文档示例版本，不代表仓库已锁定该版本；接入项目时应以项目的 `dependencyManagement` 和 Maven Central 可用版本为准。

```xml
<dependency>
    <groupId>cn.hutool</groupId>
    <artifactId>hutool-all</artifactId>
    <version>5.8.38</version>
</dependency>
```

### 高频转换

| 任务 | 写法 | 说明 |
| --- | --- | --- |
| 对象转 JSON | `String json = JSONUtil.toJsonStr(user);` | `user` 可以是常规 JavaBean、集合或 Map；输出策略受配置和字段类型影响。 |
| JSON 转 Bean | `User user = JSONUtil.toBean(json, User.class);` | 适合单一明确的 Bean 类型；目标类的可写属性、构造方式要符合映射要求。 |
| 解析对象 | `JSONObject obj = JSONUtil.parseObj(json);` | 再用 `obj.getStr("name")`、`obj.getInt("age")` 按字段读取。 |
| 解析数组 | `JSONArray array = JSONUtil.parseArray(json);` | 可用 `array.getJSONObject(index)` 读取数组中的对象。 |
| JSON 数组转 `List<T>` | `JSONUtil.toList(JSONUtil.parseArray(json), User.class)` | 显式给出元素类型，避免只得到原始 `List`。 |

```java
String userJson = JSONUtil.toJsonStr(user);
User copy = JSONUtil.toBean(userJson, User.class);
JSONObject object = JSONUtil.parseObj(userJson);
String name = object.getStr("name");

JSONArray array = JSONUtil.parseArray("[{\"name\":\"Ann\"}]");
List<User> users = JSONUtil.toList(array, User.class);
System.out.println("name=" + name + ", users=" + users.size());
// 输出：name=Ann, users=1
```

### 常见边界

- **字段缺失**：映射后的引用字段通常保持 `null`，基本类型可能是默认值；这不等于输入完整，接口边界仍应做必填校验。
- **类型不匹配**：字符串到数字/日期的宽松转换取决于字段类型和 Hutool 配置；无法转换时可能抛出 `JSONException` 或转换异常，不要默认静默成功。
- **日期格式**：JSON 里的日期通常是字符串或时间戳，格式和时区不应依赖机器默认值；项目应统一 ISO-8601 或在 `JSONConfig` 中显式设置格式，并覆盖时区测试。
- **泛型与嵌套类型**：`User.class` 只能表达一个具体根类型，`List.class` 无法保留元素泛型；嵌套结构使用 `TypeReference` 捕获参数化类型，例如 `JSONUtil.toBean(json, new TypeReference<Map<String, List<User>>>() {}, false)`。

低频补充：`JSONUtil.toJsonPrettyStr` 用于人类阅读的缩进输出，`JSONUtil.parse` 返回更宽的 JSON 抽象，`JSONConfig` 用于日期、忽略大小写等序列化配置；跨服务协议仍应优先固定 schema 并做校验。

## 简单案例

```java
import java.nio.charset.StandardCharsets;

public class TextDemo {
    public static void main(String[] args) {
        byte[] utf8 = "  张三，Java 🙂  ".getBytes(StandardCharsets.UTF_8);
        String raw = new String(utf8, StandardCharsets.UTF_8);
        String cleaned = raw.strip().replace('，', ',').replaceAll("\\s+", " ");
        String[] fields = cleaned.split(",", -1); // -1 保留末尾空字段
        StringBuilder line = new StringBuilder();
        for (String field : fields) {
            if (!line.isEmpty()) {
                line.append("|");
            }
            line.append(field);
        }

        System.out.println("cleaned=" + cleaned);
        // 输出：cleaned=张三,Java 🙂
        System.out.println("fields=" + line + ", utf8Bytes=" + utf8.length);
        // 输出：fields=张三|Java 🙂, utf8Bytes=22
        System.out.println("units=" + cleaned.length() + ", codePoints=" + cleaned.codePointCount(0, cleaned.length()));
        // 输出：units=10, codePoints=9
    }
}
```

案例先用指定 UTF-8 解码，再清理两端空白、全角逗号和连续空白；`units` 和 `codePoints` 对表情会出现差异。`split` 使用正则，逗号本身不需转义，若分隔符是点号或竖线则必须写成正则转义形式。

## 易混点

- `String` 不可变，`replace` 的返回值必须接住；`StringBuilder` 可变，适合单线程局部拼接。
- `==` 比较字符串引用身份，`equals` 才比较内容；字符串池让错误代码有时“碰巧通过”。
- UTF-8 是字节编码，UTF-16 是 Java 内部码元表示，Unicode 码点是抽象字符编号，三者不能互换。
- `split` 参数是正则而非普通字面量，且默认丢弃末尾空字段；需要保留时使用负 `limit`。
- Hutool `JSONUtil` 是第三方便利层，不是 JDK 20 API；字段缺失、类型转换和日期格式都应按项目契约显式验证。

## 课后小问

1. 为什么包含表情的字符串可能出现 `length() == 2` 而码点数为 1？
答案：该表情的一个 Unicode 码点在 UTF-16 中由一对 `char` 码元表示。
解析：`length()` 数的是码元；需要按码点遍历时使用 `codePointCount` 或 `codePoints()`，用户可见字素还可能需要更高层处理。

2. 把 `split("|")` 当作按竖线切分有什么问题？
答案：`|` 在正则中表示“或”，不是普通竖线；应写成 `split("\\|")` 或使用 `Pattern.quote("|")`。
解析：`split` 接受正则表达式，元字符必须转义，否则匹配语义与字面分隔符不同，清洗结果会被错误拆分。

3. 为什么 `JSONUtil.toBean(json, List.class)` 不能可靠表达 `List<User>`？
答案：`List.class` 在运行时没有保留元素的 `User` 泛型信息，映射器无法据此稳定地把每个对象转换成 User。
解析：单层列表可以使用 `JSONUtil.toList(array, User.class)`；多层泛型应使用 `TypeReference`，并对缺失字段、类型不匹配和日期格式做契约校验。

## 本节小结

- `String` 不可变，循环拼接应考虑 `StringBuilder`，内容比较使用 `equals`。
- 字符串池只影响共享与身份，不能改变内容比较的规则。
- UTF-8、UTF-16 码元和 Unicode 码点位于不同抽象层，长度含义必须说清。
- 正则和 `split` 很方便，但分隔符转义、末尾空字段和解析复杂度都有边界。
- Hutool `JSONUtil` 可简化常见 JSON 转换，但它是第三方库；Bean 映射、日期格式和嵌套泛型仍需显式约束。

## 快速回顾

- 能说明不可变字符串为何会产生新对象。
- 能为字节与字符串转换显式选择 `StandardCharsets.UTF_8`。
- 能区分 `length()`、码点数量和用户可见字符数量。
- 能发现 `split` 正则元字符与 `limit` 参数带来的差异。
- 能用 `JSONUtil.toJsonStr`、`toBean`、`parseObj` 和 `toList` 完成常见转换，并说出其第三方与泛型边界。
