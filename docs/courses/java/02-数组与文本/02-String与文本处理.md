---
title: String 与文本处理
date: 2026-09-22
category: Java基础快速入门
tags:
  - Java
  - String
  - Unicode
  - Hutool
  - JSON
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

## String API 速查

### 字面量/`new String`：创建字符串

优先使用字面量或已有值；只有在字节解码、明确复制等边界才使用构造器。示例：`String text = "Java"; String decoded = new String(bytes, StandardCharsets.UTF_8);`。

### `isEmpty`/`isBlank`：判空字符串

`isEmpty()` 只判断长度为零，`isBlank()` 还把空格、换行等空白视为空；两者都不接受 `null`。示例：`if (value != null && value.isBlank()) { ... }`。

### `length()`：获取 UTF-16 长度

返回 `char` 码元数量，不是 Unicode 码点或用户看到的字符数；表情等补充平面字符通常占两个码元。示例：`int units = text.length();`。

### `charAt`/`codePointAt`/`codePoints`：访问字符与码点

`charAt` 取一个 UTF-16 码元，完整 Unicode 字符应使用 `codePointAt` 或 `codePoints`；索引仍按码元位置计算。示例：`int first = text.codePointAt(0); IntStream stream = text.codePoints();`。

### `equals`/`equalsIgnoreCase`：比较内容

用 `equals` 比较内容，不用 `==`；可能为 `null` 时让常量调用 `"java".equals(value)`，忽略大小写前先确认业务是否允许。示例：`boolean same = "java".equalsIgnoreCase(input);`。

### `compareTo`/`compareToIgnoreCase`：按字典序比较

返回负数、零或正数，适合排序和范围判断，不应把返回值当作固定的 `-1/1`。示例：`int order = left.compareToIgnoreCase(right);`。

### `indexOf`/`lastIndexOf`/`contains`：查找文本

`indexOf` 找首次位置，`lastIndexOf` 找最后位置，找不到返回 `-1`；`contains` 只返回布尔值，三者都按字面文本查找而不是正则。示例：`if (path.contains("/api/") && path.indexOf('?') >= 0) { ... }`。

### `startsWith`/`endsWith`：判断前后缀

用于协议、文件名或路由前后缀判断，可传起始偏移；它们不做路径规范化或大小写自动转换。示例：`boolean json = fileName.endsWith(".json");`。

### `substring`/`subSequence`：截取文本

区间是左闭右开 `[begin, end)`，越界会抛 `StringIndexOutOfBoundsException`；`subSequence` 返回 `CharSequence`，通常仍优先 `substring`。示例：`String prefix = text.substring(0, Math.min(8, text.length()));`。

### `replace`：按字面替换

`replace(char, char)` 和 `replace(CharSequence, CharSequence)` 都按字面匹配，不把参数当正则；原字符串不变。示例：`String normalized = text.replace('，', ',').replace("JAVA", "Java");`。

### `split`：按正则分割

参数是正则表达式，默认丢弃末尾空字段；需要保留时传负 `limit`，元字符要转义。示例：`String[] fields = csv.split(",", -1);`。

### `String.join`/`concat`：拼接字符串

`String.join` 适合分隔符和多个元素，`concat` 只拼接一个非 `null` 字符串（传入 `null` 会失败）；循环拼接不要反复使用 `+`。示例：`String path = String.join("/", "api", "users", id);`。

### `formatted`/`String.format`：格式化字符串

`formatted` 以当前字符串作格式模板，`String.format` 适合静态模板；格式说明符和参数类型必须匹配，日志拼接还要考虑性能和敏感信息。示例：`String line = "id=%d, name=%s".formatted(id, name);`。

### `toUpperCase`/`toLowerCase`：转换大小写

默认受当前 Locale 影响，协议字段、键名等稳定文本应指定 `Locale.ROOT`；转换会返回新字符串。示例：`String key = text.toLowerCase(Locale.ROOT);`。

### `trim`/`strip`：去除两端空白

`trim` 主要按较旧的 `U+0020` 范围处理，`strip` 按 Unicode 空白处理；两者都不修改原字符串。示例：`String clean = input.strip();`。

### `repeat`：重复字符串

重复次数不能为负，零次返回空字符串；大次数可能造成内存压力。示例：`String indent = "  ".repeat(level);`。

### `toCharArray`/`getBytes`：转换为字符数组与字节

`toCharArray` 得到 UTF-16 码元数组；`getBytes` 跨边界时必须显式指定字符集，避免平台默认编码。示例：`byte[] utf8 = text.getBytes(StandardCharsets.UTF_8);`。

### `String.valueOf`：把值转为字符串

支持基本类型和对象，传入 `null` 对象会得到字符串 `"null"`；不要把它与 `null.toString()` 混用。示例：`String label = String.valueOf(maybeNull);`。

### `StringBuilder.append/insert/delete`：高效拼接

单线程循环拼接优先使用可变的 `StringBuilder`，最后调用 `toString()`；它不是线程安全容器，初始容量可按估算设置。示例：`String result = new StringBuilder().append("id=").append(id).toString();`。

### `matches`/`replaceAll`：正则匹配与替换

`matches` 要求整个字符串匹配，`replaceAll` 的参数是正则；大量重复模式应预编译 `Pattern`，替换字面文本优先使用 `replace`。示例：`String digits = text.replaceAll("[^0-9]", "");`。

### `replaceFirst`：替换首个正则匹配（低频）

只替换第一个符合正则的片段，替换文本中的 `$1` 等组引用也有特殊含义；字面替换优先用 `replace`。示例：`String first = text.replaceFirst("\\d+", "N");`。

### `lines`：按行流式处理（低频）

返回按换行符拆分的 `Stream<String>`，适合逐行过滤；流只能消费一次。示例：`long nonEmpty = text.lines().filter(line -> !line.isBlank()).count();`。

### `indent`：统一增加或删除缩进（低频）

按行调整缩进并规范换行，正数增加、负数尝试删除；不要把它当作代码格式化器。示例：`String indented = text.indent(2);`。

### `stripIndent`：移除公共缩进（低频）

去除多行文本的公共前导空白，适合文本块整理；单行或不齐的缩进要先验证结果。示例：`String plain = text.stripIndent();`。

### `translateEscapes`：解析转义序列（低频）

将字符串中的 `\\n`、`\\t` 等 Java 转义转成对应字符，不等同于 JSON 解析；输入含非法转义会抛异常。示例：`String actual = escaped.translateEscapes();`。

### `StringBuffer`：线程安全拼接（低频）

提供与 `StringBuilder` 类似的同步方法，只有确实需要共享可变字符缓冲区时才考虑；普通局部拼接优先 `StringBuilder`。示例：`StringBuffer shared = new StringBuffer();`。

## 项目常用：Hutool JSONUtil

`JSONUtil` 来自 Hutool，是第三方库，不是 JDK 20 标准库；本仓库当前没有新增 Hutool 运行依赖，下面只作为项目速查示例。示例使用 `5.8.38`，这是文档示例版本，不代表仓库已锁定该版本；接入项目时应以项目的 `dependencyManagement` 和 Maven Central 可用版本为准。

```xml
<dependency>
    <groupId>cn.hutool</groupId>
    <artifactId>hutool-all</artifactId>
    <version>5.8.38</version>
</dependency>
```

### `JSONUtil`：高频转换总览

| 任务 | 写法 | 说明 |
| --- | --- | --- |
| 对象转 JSON | `String json = JSONUtil.toJsonStr(user);` | `user` 可以是常规 JavaBean、集合或 Map；输出策略受配置和字段类型影响。 |
| JSON 转 Bean | `User user = JSONUtil.toBean(json, User.class);` | 适合单一明确的 Bean 类型；目标类的可写属性、构造方式要符合映射要求。 |
| 解析对象 | `JSONObject obj = JSONUtil.parseObj(json);` | 再用 `obj.getStr("name")`、`obj.getInt("age")` 按字段读取。 |
| 解析数组 | `JSONArray array = JSONUtil.parseArray(json);` | 可用 `array.getJSONObject(index)` 读取数组中的对象。 |
| JSON 数组转 `List<T>` | `JSONUtil.toList(JSONUtil.parseArray(json), User.class)` | 显式给出元素类型，避免只得到原始 `List`。 |

### `JSONUtil.toJsonStr`：对象转 JSON

将 Bean、Map 或集合序列化为 JSON 字符串；字段别名、`null` 和日期表现受 Hutool 配置及对象属性影响。示例：`String json = JSONUtil.toJsonStr(user);`。

### `JSONUtil.toBean`：JSON 转 Bean

把一个 JSON 对象映射为明确的 JavaBean，目标类应有可写属性或符合映射要求的构造方式；字段缺失不等于输入校验通过。示例：`User user = JSONUtil.toBean(json, User.class);`。

### `JSONUtil.parseObj`：解析 JSONObject

把 JSON 对象文本解析成 `JSONObject`，适合少量字段读取或先观察结构；字段读取要考虑缺失值和类型转换。示例：`JSONObject obj = JSONUtil.parseObj(json); String name = obj.getStr("name");`。

### `JSONUtil.parseArray`：解析 JSONArray

把 JSON 数组文本解析成 `JSONArray`，可按索引读取对象或标量；输入必须是数组形状，不能把对象文本当数组解析。示例：`JSONArray array = JSONUtil.parseArray(json); JSONObject first = array.getJSONObject(0);`。

### `JSONUtil.toList`：JSON 数组转 `List<T>`

显式传入元素类型，把 `JSONArray` 转为带泛型的 Bean 列表，默认得到可变 `ArrayList`；不要只使用 `List.class` 丢失元素类型。示例：`List<User> users = JSONUtil.toList(array, User.class);`。

### `JSONUtil.toBean` + `TypeReference`：解析嵌套泛型

`Class<T>` 无法表达 `Map<String, List<User>>` 等嵌套参数，使用 `TypeReference` 捕获泛型，并明确 `ignoreError` 策略。示例：`Map<String, List<User>> grouped = JSONUtil.toBean(json, new TypeReference<Map<String, List<User>>>() {}, false);`。

### `JSONConfig.setDateFormat`：固定日期格式

日期字符串和时间戳的转换依赖格式、时区及配置，不应依赖机器默认值；跨服务协议优先统一 ISO-8601。示例：`JSONConfig config = JSONConfig.create().setDateFormat("yyyy-MM-dd HH:mm:ss");`。

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

### `JSONUtil.toJsonPrettyStr`：格式化 JSON（低频）

输出带缩进的 JSON，主要用于日志和人工阅读，不建议直接作为协议格式。示例：`String pretty = JSONUtil.toJsonPrettyStr(user);`。

### `JSONUtil.parse`：解析为通用 JSON 抽象（低频）

返回更宽的 `JSON` 类型，适合暂时不确定根节点形状的场景；后续仍需转成明确对象。示例：`JSON parsed = JSONUtil.parse(json);`。

### `JSONUtil.readJSON`：从文件读取 JSON（低频）

提供文件读取快捷入口，生产代码仍需明确字符集、文件大小和异常处理。示例：`JSON json = JSONUtil.readJSON(file, StandardCharsets.UTF_8);`。

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
- 能按字面匹配、正则匹配、Unicode 码点和显式字符集选择合适的 String API。
