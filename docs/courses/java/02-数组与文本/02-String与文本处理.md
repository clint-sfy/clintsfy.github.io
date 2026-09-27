---
title: String 与文本处理
date: 2026-09-27
category: Java基础快速入门
tags:
  - Java
  - String
  - Unicode
  - 文本处理
description: 掌握不可变字符串、字符编码、StringBuilder 和常用文本 API，并能按标题快速查用法。
---

# String 与文本处理

## 学习目标

- 理解 `String` 不可变性、字符串池和内容比较规则。
- 使用查找、截取、替换、分割、格式化和 `StringBuilder` 完成常见文本处理。
- 区分 UTF-8 字节、UTF-16 码元、Unicode 码点与用户可见字符。
- 能根据“字面匹配还是正则匹配”选择当前页面或[正则表达式专题](/courses/java/02-数组与文本/04-正则表达式与文本匹配)。

## 核心知识点

### 专业术语

- **不可变对象（immutable object）**：`String` 创建后内容不再改变，拼接或替换会返回新的字符串对象。
- **字符串池（string pool）**：运行时保存部分字符串字面量的共享区域，不能作为 `==` 内容比较的依据。
- **字符集（charset）**：把字符与字节编码互相转换的规则；跨边界文本应显式指定 `UTF-8` 等字符集。
- **UTF-16 code unit 与 Unicode code point**：Java 的 `char` 是 16 位码元，一个码点可能需要两个码元。
- **字面匹配与正则匹配**：`replace` 等 API 按字面处理，`replaceAll`、`split` 的参数按正则解释。

### 白话解释与边界

字符串像一张不可擦写的纸：`trim`、`replace` 或 `+` 不会修改原对象，而是产生新值。少量拼接没有问题；循环中大量拼接应使用 `StringBuilder`，避免反复创建中间字符串。文本离开 Java 内存时才是字节，读写必须指定字符集，不能把当前系统默认编码当成稳定协议。

`String.length()` 返回 UTF-16 码元数量，不一定等于 Unicode 码点数量，更不等于用户看到的字素簇数量。正则适合字段级清洗；嵌套语法或需要精确错误位置的格式应使用专门解析器。JSON 转换已拆到[JSON 与 Java 对象转换](/courses/java/02-数组与文本/05-JSON与Java对象转换)，大数运算已拆到[大数与精确计算](/courses/java/02-数组与文本/06-大数与精确计算)。

## String API 速查

### String API：快速入口

```java
String value = " Java ";
String normalized = value.strip().toLowerCase();
System.out.println(normalized);
// 输出：java
```

按字面查找和替换先看本页；需要正则捕获组时转到[正则表达式与文本匹配](/courses/java/02-数组与文本/04-正则表达式与文本匹配)。

## 项目常用：Hutool JSONUtil

### `JSONUtil`：JSON 转换专题入口

```java
import cn.hutool.json.JSONUtil;
import java.util.Map;

String json = JSONUtil.toJsonStr(Map.of("name", "Ann"));
System.out.println(json);
// 输出：{"name":"Ann"}
```

JSON 的完整依赖、Bean、数组和泛型边界见[JSON 与 Java 对象转换](/courses/java/02-数组与文本/05-JSON与Java对象转换)。

## 常用用法

### 字面量/`new String`：创建字符串

```java
import java.nio.charset.StandardCharsets;

String literal = "Java";
byte[] bytes = literal.getBytes(StandardCharsets.UTF_8);
String decoded = new String(bytes, StandardCharsets.UTF_8);
System.out.println(literal + " / " + decoded);
// 输出：Java / Java
```

优先使用字面量或已有值；只有在字节解码、明确复制等边界才使用构造器。`new String("Java")` 不会带来内容上的收益。

### `isEmpty`/`isBlank`：判断空字符串或空白

```java
String empty = "";
String spaces = "  \n";
System.out.println(empty.isEmpty());
// 输出：true
System.out.println(spaces.isBlank());
// 输出：true
```

`isEmpty()` 只判断长度为零，`isBlank()` 还把空格、换行等 Unicode 空白视为空；两者都不接受 `null`，外部输入要先决定 `null` 的业务含义。

### `length()`：获取 UTF-16 码元长度

```java
String text = "Java🙂";
System.out.println(text.length());
// 输出：6
System.out.println(text.codePointCount(0, text.length()));
// 输出：5
```

返回 `char` 码元数量，不是 Unicode 码点或用户看到的字符数；表情等补充平面字符通常占两个码元。

### `charAt`/`codePointAt`/`codePoints`：访问码元与码点

```java
String text = "A🙂B";
char unit = text.charAt(1);
int point = text.codePointAt(1);
long points = text.codePoints().count();
System.out.println((int) unit + ", " + point + ", " + points);
// 输出：55357, 128578, 3
```

`charAt` 取一个 UTF-16 码元，完整 Unicode 字符应使用 `codePointAt` 或 `codePoints`；索引仍按码元位置计算。

### `equals`/`equalsIgnoreCase`：比较字符串内容

```java
String input = "JAVA";
boolean same = "java".equals(input);
boolean sameIgnoreCase = "java".equalsIgnoreCase(input);
System.out.println(same + ", " + sameIgnoreCase);
// 输出：false, true
```

用 `equals` 比较内容，不用 `==`；可能为 `null` 时让常量调用方法，忽略大小写前先确认业务是否允许。

### `compareTo`/`compareToIgnoreCase`：按字典序比较

```java
String left = "Java";
String right = "java";
int order = left.compareTo(right);
int ignoreCaseOrder = left.compareToIgnoreCase(right);
System.out.println(order < 0);
// 输出：true
System.out.println(ignoreCaseOrder == 0);
// 输出：true
```

返回负数、零或正数，适合排序和范围判断，不应把返回值当成固定的 `-1` 或 `1`。

### `indexOf`/`lastIndexOf`/`contains`：查找文本

```java
String path = "/api/users/api";
System.out.println(path.indexOf("/api"));
// 输出：0
System.out.println(path.lastIndexOf("/api"));
// 输出：10
System.out.println(path.contains("users"));
// 输出：true
```

`indexOf` 找首次位置，`lastIndexOf` 找最后位置，找不到返回 `-1`；`contains` 只返回布尔值，三者都按字面文本查找而不是正则。

### `startsWith`/`endsWith`：判断前后缀

```java
String fileName = "backup/data.json";
boolean json = fileName.endsWith(".json");
boolean backup = fileName.startsWith("backup/");
System.out.println(json + ", " + backup);
// 输出：true, true
```

适合协议、文件名或路由前后缀判断，可传起始偏移；它们不做路径规范化或大小写自动转换。

### `substring`：截取字符串区间

```java
String text = "Java速查";
String prefix = text.substring(0, 4);
String suffix = text.substring(4);
System.out.println(prefix + " / " + suffix);
// 输出：Java / 速查
```

区间是左闭右开 `[begin, end)`，越界会抛 `StringIndexOutOfBoundsException`；索引按 UTF-16 码元计算，不能把一个补充平面字符拆开。

### `replace`：按字面替换

```java
String text = "JAVA，Java";
String normalized = text.replace('，', ',').replace("JAVA", "Java");
System.out.println(normalized);
// 输出：Java,Java
```

`replace(char, char)` 和 `replace(CharSequence, CharSequence)` 都按字面匹配，不把参数当正则；原字符串不变。

### `split`：按正则分割简单文本

```java
String csv = "Java,,SQL,";
String[] fields = csv.split(",", -1);
System.out.println(java.util.Arrays.toString(fields));
// 输出：[Java, , SQL, ]
```

参数是正则表达式，默认丢弃末尾空字段；需要保留时传负 `limit`，元字符要转义。复杂引用、转义和嵌套格式应使用专门解析器。

### `String.join`/`concat`：带分隔符拼接

```java
String id = "42";
String path = String.join("/", "api", "users", id);
String label = "Java".concat("速查");
System.out.println(path + " / " + label);
// 输出：api/users/42 / Java速查
```

`String.join` 适合分隔符和多个元素，`concat` 只拼接一个非 `null` 字符串；循环拼接不要反复使用 `+`。

### `formatted`/`String.format`：格式化字符串

```java
int id = 7;
String name = "Ann";
String line = "id=%d, name=%s".formatted(id, name);
String same = String.format("id=%d, name=%s", id, name);
System.out.println(line);
// 输出：id=7, name=Ann
System.out.println(same);
// 输出：id=7, name=Ann
```

格式说明符和参数类型必须匹配；日志拼接还要考虑性能和敏感信息，不能把密码、令牌直接格式化进日志。

### `toUpperCase`/`toLowerCase`：转换大小写

```java
import java.util.Locale;

String text = "Java Api";
String upper = text.toUpperCase(Locale.ROOT);
String lower = text.toLowerCase(Locale.ROOT);
System.out.println(upper + " / " + lower);
// 输出：JAVA API / java api
```

协议字段、键名等稳定文本应指定 `Locale.ROOT`；转换会返回新字符串，不能当作原地修改。

### `trim`/`strip`：去除两端空白

```java
String input = "  Java速查  ";
String trimResult = input.trim();
String stripResult = input.strip();
System.out.println(trimResult + " / " + stripResult);
// 输出：Java速查 / Java速查
```

`trim` 主要按较旧的 `U+0020` 范围处理，`strip` 按 Unicode 空白处理；两者都不修改原字符串。

### `repeat`：重复字符串

```java
int level = 3;
String indent = "  ".repeat(level);
System.out.println(indent.length());
// 输出：6
```

重复次数不能为负，零次返回空字符串；大次数可能造成内存压力。

### `toCharArray`/`getBytes`：转换为字符数组与字节

```java
import java.nio.charset.StandardCharsets;

String text = "Java";
char[] chars = text.toCharArray();
byte[] utf8 = text.getBytes(StandardCharsets.UTF_8);
System.out.println(chars.length + ", " + utf8.length);
// 输出：4, 4
```

`toCharArray` 得到 UTF-16 码元数组；`getBytes` 跨边界时必须显式指定字符集，避免平台默认编码。

### `String.valueOf`：把值转换为字符串

```java
Object maybeNull = null;
String label = String.valueOf(maybeNull);
String number = String.valueOf(42);
System.out.println(label + " / " + number);
// 输出：null / 42
```

传入 `null` 对象会得到字符串 `"null"`；不要把它与 `null.toString()` 混用。

### `StringBuilder.append/insert/delete`：高效拼接

```java
StringBuilder builder = new StringBuilder("Java");
builder.append("速查");
builder.insert(0, "《");
builder.append("》");
builder.delete(builder.length() - 1, builder.length());
builder.append("》");
String result = builder.toString();
System.out.println(result);
// 输出：《Java速查》
```

单线程循环拼接优先使用可变的 `StringBuilder`，最后调用 `toString()`；它不是线程安全容器，初始容量可按估算设置。

## 不常用但需要知道

### `subSequence`：以 `CharSequence` 截取

```java
String text = "Java速查";
CharSequence suffix = text.subSequence(4, text.length());
System.out.println(suffix);
// 输出：速查
```

区间仍是左闭右开，返回接口类型 `CharSequence`；只需要 `String` 时优先使用 `substring`。

### `contentEquals`：与其他字符序列比较

```java
String text = "Java";
StringBuilder builder = new StringBuilder("Java");
System.out.println(text.contentEquals(builder));
// 输出：true
```

它可直接比较 `StringBuilder` 等 `CharSequence`，与 `equals` 的参数类型和对称性语义不同。

### `regionMatches`：比较局部区域

```java
String text = "Java速查";
boolean matched = text.regionMatches(true, 0, "java", 0, 4);
System.out.println(matched);
// 输出：true
```

适合避免创建临时子串的局部比较；参数多且容易写错，普通场景优先 `startsWith` 或 `substring`。

### `getChars`：复制指定码元区间

```java
String text = "Java速查";
char[] target = new char[4];
text.getChars(0, 4, target, 0);
System.out.println(new String(target));
// 输出：Java
```

按 UTF-16 码元复制到已有数组，目标空间和区间必须足够；新代码通常用 `toCharArray` 更直观。

### `intern`：访问字符串池

```java
String dynamic = new String("Java");
String pooled = dynamic.intern();
System.out.println(pooled == "Java");
// 输出：true
```

返回字符串池中的规范引用，但会影响池和内存行为；业务代码不要用它替代 `equals`。

### `lines`：按行流式处理

```java
String text = "Java\n\nString\n集合";
long nonEmpty = text.lines().filter(line -> !line.isBlank()).count();
System.out.println(nonEmpty);
// 输出：3
```

返回按换行符拆分的 `Stream<String>`，流只能消费一次；大量文本仍要考虑内存占用。

### `indent`/`stripIndent`：整理多行缩进

```java
String text = "    one\n      two\n";
String normalized = text.stripIndent().indent(2);
System.out.println(normalized.replace("\n", "|").stripTrailing());
// 输出：  one|    two
```

用于文本块整理，正数缩进增加、负数尝试删除；它不是 Java 代码格式化器。

### `translateEscapes`：解析 Java 转义文本

```java
String escaped = "Java\\nString\\t速查";
String actual = escaped.translateEscapes();
System.out.println(actual.replace("\n", "|").replace("\t", "→"));
// 输出：Java|String→速查
```

将字符串中的 `\\n`、`\\t` 等转义变成对应字符，不等同于 JSON 解析；非法转义会抛异常。

### `StringBuffer`：同步的可变字符序列

```java
StringBuffer shared = new StringBuffer("Java");
shared.append("速查");
System.out.println(shared);
// 输出：Java速查
```

提供与 `StringBuilder` 类似的同步方法，只有确实需要共享可变字符缓冲区时才考虑；普通局部拼接优先 `StringBuilder`。

## 继续阅读

- [正则表达式与文本匹配](/courses/java/02-数组与文本/04-正则表达式与文本匹配)：`Pattern`、`Matcher`、捕获组和正则替换。
- [JSON 与 Java 对象转换](/courses/java/02-数组与文本/05-JSON与Java对象转换)：Hutool `JSONUtil` 的对象、数组和泛型转换。
- [大数与精确计算](/courses/java/02-数组与文本/06-大数与精确计算)：`BigInteger`、`BigDecimal` 和精确舍入。

## 简单案例

```java
import java.nio.charset.StandardCharsets;

public class TextDemo {
    public static void main(String[] args) {
        byte[] utf8 = "  张三，Java 🙂  ".getBytes(StandardCharsets.UTF_8);
        String raw = new String(utf8, StandardCharsets.UTF_8);
        String cleaned = raw.strip().replace('，', ',').replaceAll("\\s+", " ");
        String[] fields = cleaned.split(",", -1);
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

- `String` 不可变，`replace`、`strip` 和 `+` 的返回值必须接住；`StringBuilder` 可变，适合单线程局部拼接。
- `==` 比较字符串引用身份，`equals` 才比较内容；字符串池让错误代码有时“碰巧通过”。
- UTF-8 是字节编码，UTF-16 是 Java 内部码元表示，Unicode 码点是抽象字符编号，三者不能互换。
- `split` 参数是正则而非普通字面量，且默认丢弃末尾空字段；需要保留时使用负 `limit`。
- 需要正则捕获组、预编译或复杂替换时转到正则专题，不要把 `replaceAll` 当成普通 `replace`。

## 课后小问

1. 为什么包含表情的字符串可能出现 `length() == 2` 而码点数为 1？
答案：该表情的一个 Unicode 码点在 UTF-16 中由一对 `char` 码元表示。
解析：`length()` 数的是码元；需要按码点遍历时使用 `codePointCount` 或 `codePoints()`，用户可见字素还可能需要更高层处理。

2. 把 `split("|")` 当作按竖线切分有什么问题？
答案：`|` 在正则中表示“或”，不是普通竖线；应写成 `split("\\|")` 或使用 `Pattern.quote("|")`。
解析：`split` 接受正则表达式，元字符必须转义，否则匹配语义与字面分隔符不同，清洗结果会被错误拆分。

## 本节小结

- `String` 不可变，循环拼接应考虑 `StringBuilder`，内容比较使用 `equals`。
- 字符串池只影响共享与身份，不能改变内容比较的规则。
- UTF-8、UTF-16 码元和 Unicode 码点位于不同抽象层，长度含义必须说清。
- `replace` 按字面替换，`split` 等 API 按正则解释；复杂匹配转到独立正则专题。

## 快速回顾

- 能说明不可变字符串为何会产生新对象。
- 能为字节与字符串转换显式选择 `StandardCharsets.UTF_8`。
- 能区分 `length()`、码点数量和用户可见字符数量。
- 能发现 `split` 正则元字符与 `limit` 参数带来的差异。
- 能按字面匹配、Unicode 码点和显式字符集选择合适的 String API。
