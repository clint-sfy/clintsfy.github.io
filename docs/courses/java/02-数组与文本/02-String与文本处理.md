---
title: String 与文本处理
date: 2026-09-27T00:00:00.000Z
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

## 常用用法

### String API：快速入口

需要快速完成文本清理与规范化时使用这段最小示例。

```java
// 语义：需要快速完成文本清理与规范化时使用这段最小示例。
// 初始状态：value 初始为 " Java "；normalized 初始为 value.strip().toLowerCase()。
String value = " Java ";
// 关键变化：String value = " Java "；value 取右侧具体表达式的值，当前状态变为 " Java "。
// 初始状态：value 当前为 " Java "。
String normalized = value.strip().toLowerCase();
// 关键变化：String normalized = value.strip().toLowerCase()；value.strip(当前参数) 返回转换后的具体值，赋给当前示例中的接收变量。
System.out.println(normalized);
// 输出：java
```

按字面查找和替换先看本页；需要正则捕获组时转到[正则表达式与文本匹配](/courses/java/02-数组与文本/04-正则表达式与文本匹配)。

### `JSONUtil`：JSON 转换专题入口

需要把 Java 对象序列化为 JSON 文本时使用 `JSONUtil.toJsonStr`，完整边界转到 JSON 专题查阅。

```java
import cn.hutool.json.JSONUtil;
import java.util.Map;

String json = JSONUtil.toJsonStr(Map.of("name", "Ann"));
// 关键变化：String json = JSONUtil.toJsonStr(Map.of("name", "Ann"))；json 接收 toJsonStr(Map.of("name", "Ann")) 的返回值，当前值变为这次调用得到的具体结果。
// 初始状态：json 当前为 JSONUtil.toJsonStr(Map.of("name", "Ann"))。
System.out.println(json);
// 输出：{"name":"Ann"}
```

JSON 的完整依赖、Bean、数组和泛型边界见[JSON 与 Java 对象转换](/courses/java/02-数组与文本/05-JSON与Java对象转换)。

### 字符串字面量：创建字符串

已知文本内容时优先使用字符串字面量；`new String("Java")` 不会带来内容收益。

```java
// 语义：已知文本内容时优先使用字符串字面量。
// 初始状态：literal 初始为 "Java"；same 初始为 "Java"。
String literal = "Java";
// 关键变化：literal 接收表达式 "Java" 的计算结果。
// 初始状态：literal 的初始值为 "Java"。
String same = "Java";
boolean sameContent = literal.equals(same);
System.out.println(literal);
// 输出：Java
System.out.println(sameContent);
// 输出：true
```

### `new String`：按字符集解码字节

已有外部字节时用带字符集的构造器解码，并显式指定字符集。

```java
// 语义：已有外部字节时用带字符集的构造器解码，并显式指定字符集。
// 初始状态：bytes 初始为 {74, 97, 118, 97}；decoded 初始为 new String(bytes, StandardCharsets.UTF_8)。
import java.nio.charset.StandardCharsets;
// 输入：// 初始状态：bytes 初始为 {74, 97, 118, 97}；decoded 初始为 new String(bytes, StandardCharsets.UTF_8)。 import java.nio.charset.StandardCharsets; 使用语句中的具体实参或初始值，当前对象 从这里进入后续操作。

byte[] bytes = {74, 97, 118, 97};
// 初始状态：bytes 当前为 {74, 97, 118, 97}。
String decoded = new String(bytes, StandardCharsets.UTF_8);
// 关键变化：String decoded = new String(bytes, StandardCharsets.UTF_8); 将返回值写入 decoded；decoded 现在保存该具体结果。
System.out.println(decoded);
// 输出：Java
System.out.println(decoded.length());
// 输出：4
```

### `isEmpty`：判断空字符串

`isEmpty()` 只判断长度是否为零，不会把空格或换行视为空字符串。

```java
String empty = "";
// 关键变化：String empty = ""；empty 取右侧具体表达式的值，当前状态变为 ""。
// 初始状态：empty 当前为 ""。
String spaces = "  \n";
// 关键变化：String spaces = " \n"；spaces 取右侧具体表达式的值，当前状态变为 " \n"。
// 初始状态：spaces 当前为 " \n"。
System.out.println(empty.isEmpty());
// 输出：true
System.out.println(spaces.isEmpty());
// 输出：false
```

### `isBlank`：判断空白字符串

`isBlank()` 判断空串或仅包含 Unicode 空白的字符串；调用前仍需单独处理 `null`。

```java
String spaces = "  \n";
// 初始状态：spaces 当前为 " \n"。
String word = " Java ";
// 初始状态：word 当前为 " Java "。
boolean blank = spaces.isBlank();
// 关键变化：boolean blank = spaces.isBlank(); 将返回值写入 blank；blank 现在保存该具体结果。
boolean wordBlank = word.isBlank();
// 关键变化：boolean wordBlank = word.isBlank(); 将返回值写入 wordBlank；wordBlank 现在保存该具体结果。
System.out.println(blank);
// 输出：true
System.out.println(wordBlank);
// 输出：false
```

### `charAt`：访问 UTF-16 码元

`charAt` 按 UTF-16 索引返回一个 `char` 码元，可能只取得补充平面字符的一半。

```java
String text = "A🙂B";
// 初始状态：text 当前为 "A🙂B"。
char first = text.charAt(0);
// 初始状态：first 当前为 text.charAt(0)。
// 作用：charAt 按 UTF-16 索引返回一个 char 码元，可能只取得补充平面字符的一半。
char surrogate = text.charAt(1);
// 关键变化：char surrogate = text.charAt(1); 将返回值写入 surrogate；surrogate 现在保存该具体结果。
int surrogateValue = surrogate;
System.out.println(first);
// 输出：A
System.out.println(surrogateValue);
// 输出：55357
```

### `codePointAt`：访问 Unicode 码点

`codePointAt` 从指定 UTF-16 索引读取完整码点，适合处理表情等补充平面字符。

```java
String text = "A🙂B";
// 初始状态：text 当前为 "A🙂B"。
int point = text.codePointAt(1);
// 初始状态：point 当前为 text.codePointAt(1)。
// 作用：codePointAt 从指定 UTF-16 索引读取完整码点，适合处理表情等补充平面字符。
String hex = Integer.toHexString(point);
String restored = new String(Character.toChars(point));
System.out.println(hex);
// 输出：1f642
System.out.println(restored);
// 输出：🙂
```

### `codePoints`：遍历 Unicode 码点

`codePoints()` 生成码点流，避免按 `char` 遍历时拆开补充平面字符。

```java
String text = "A🙂B";
// 初始状态：text 当前为 "A🙂B"。
long count = text.codePoints().count();
// 初始状态：count 当前为 text.codePoints().count()。
// 作用：codePoints() 生成码点流，避免按 char 遍历时拆开补充平面字符。
String joined = text.codePoints()
        .mapToObj(cp -> new String(Character.toChars(cp)))
        .reduce("", String::concat);
// 关键变化：String joined = text.codePoints() .mapToObj(cp -> new String(Character.toChars(cp))) .reduce("", String::concat)；joined 接收 codePoints(当前参数) 的返回值，当前值变为这次调用得到的具体结果。
System.out.println(count);
// 输出：3
System.out.println(joined);
// 输出：A🙂B
```

### `equals`：比较字符串内容

`equals` 区分大小写地比较内容，不能用 `==` 代替；可能为 `null` 时可让常量调用。

```java
String input = new String("Java");
// 初始状态：input 当前为 new String("Java")。
boolean sameContent = "Java".equals(input);
// 初始状态：sameContent 当前为 "Java".equals(input)。
// 关键变化：boolean sameContent = "Java".equals(input); 将返回值写入 sameContent；sameContent 现在保存该具体结果。
boolean sameObject = "Java" == input;
System.out.println(sameContent);
// 输出：true
System.out.println(sameObject);
// 输出：false
```

### `equalsIgnoreCase`：忽略大小写比较内容

业务规则明确允许忽略大小写时使用 `equalsIgnoreCase`，它不负责完整的语言区域规范化。

```java
String input = "JAVA";
// 初始状态：input 当前为 "JAVA"。
boolean exact = "java".equals(input);
// 初始状态：exact 当前为 "java".equals(input)。
boolean relaxed = "java".equalsIgnoreCase(input);
// 关键变化：boolean relaxed = "java".equalsIgnoreCase(input); 将返回值写入 relaxed；relaxed 现在保存该具体结果。
System.out.println(exact);
// 输出：false
System.out.println(relaxed);
// 输出：true
```

### `indexOf`：查找首次出现位置

`indexOf` 按字面文本返回首次匹配的 UTF-16 索引，找不到时返回 `-1`。

```java
String path = "/api/users/api";
// 初始状态：path 当前为 "/api/users/api"。
int first = path.indexOf("/api");
// 初始状态：first 当前为 path.indexOf("/api")。
// 作用：indexOf 按字面文本返回首次匹配的 UTF-16 索引，找不到时返回 -1。
int missing = path.indexOf("orders");
// 关键变化：int missing = path.indexOf("orders"); 将返回值写入 missing；missing 现在保存该具体结果。
System.out.println(first);
// 输出：0
System.out.println(missing);
// 输出：-1
```

### `lastIndexOf`：查找最后出现位置

`lastIndexOf` 按字面文本返回最后一次匹配的位置，适合定位最后一个分隔符。

```java
String path = "/api/users/api";
// 初始状态：path 当前为 "/api/users/api"。
int lastApi = path.lastIndexOf("/api");
// 初始状态：lastApi 当前为 path.lastIndexOf("/api")。
// 作用：lastIndexOf 按字面文本返回最后一次匹配的位置，适合定位最后一个分隔符。
int lastSlash = path.lastIndexOf('/');
// 关键变化：int lastSlash = path.lastIndexOf('/'); 将返回值写入 lastSlash；lastSlash 现在保存该具体结果。
System.out.println(lastApi);
// 输出：10
System.out.println(lastSlash);
// 输出：System.out 调用参数为 lastSlash。
```

### `contains`：判断是否包含文本

只关心有无字面子串时使用 `contains`，它不把参数解释为正则表达式。

```java
String path = "/api/users";
// 初始状态：path 当前为 "/api/users"。
boolean hasUsers = path.contains("users");
// 初始状态：hasUsers 当前为 path.contains("users")。
// 作用：只关心有无字面子串时使用 contains，它不把参数解释为正则表达式。
boolean hasPattern = path.contains(".*");
// 关键变化：boolean hasPattern = path.contains(".*"); 将返回值写入 hasPattern；hasPattern 现在保存该具体结果。
System.out.println(hasUsers);
// 输出：true
System.out.println(hasPattern);
// 输出：false
```

### `String.join`：按分隔符拼接

需要用同一分隔符连接多个元素时使用 `String.join`。

```java
String id = "42";
// 初始状态：id 当前为 "42"。
String path = String.join("/", "api", "users", id);
// 初始状态：path 当前为 String.join("/", "api", "users", id)。
// 作用：需要用同一分隔符连接多个元素时使用 String.join。
String csv = String.join(",", "Java", "SQL");
// 关键变化：String csv = String.join(",", "Java", "SQL"); 将返回值写入 csv；csv 现在保存该具体结果。
System.out.println(path);
// 输出：api/users/42
System.out.println(csv);
// 输出：Java,SQL
```

### `concat`：拼接一个字符串

`concat` 把一个非 `null` 字符串追加到末尾并返回新字符串，循环拼接仍应使用 `StringBuilder`。

```java
String prefix = "Java";
// 初始状态：prefix 当前为 "Java"。
String result = prefix.concat("速查");
// 初始状态：result 当前为 prefix.concat("速查")。
// 作用：concat 把一个非 null 字符串追加到末尾并返回新字符串，循环拼接仍应使用 StringBuilder。
boolean unchanged = prefix.equals("Java");
System.out.println(result);
// 输出：Java速查
System.out.println(unchanged);
// 输出：true
```

### `formatted`：用模板实例格式化

已有格式模板时使用实例方法 `formatted` 代入参数，格式说明符必须和参数类型匹配。

```java
int id = 7;
// 初始状态：id 当前为 7。
String name = "Ann";
// 初始状态：name 当前为 "Ann"。
String template = "id=%d, name=%s";
String line = template.formatted(id, name);
// 关键变化：String line = template.formatted(id, name); 将返回值写入 line；line 现在保存该具体结果。
System.out.println(line);
// 输出：id=7, name=Ann
System.out.println(template);
// 输出：id=%d, name=%s
```

### `String.format`：静态格式化字符串

动态选择模板或语言区域时使用 `String.format`，稳定协议文本宜显式指定 `Locale`。

```java
import java.util.Locale;

double rate = 0.25;
// 初始状态：rate 当前为 0.25。
String line = String.format(Locale.ROOT, "rate=%.2f", rate);
// 初始状态：line 当前为 String.format(Locale.ROOT, "rate=%.2f", rate)。
// 作用：动态选择模板或语言区域时使用 String.format，稳定协议文本宜显式指定 Locale。
System.out.println(line);
// 输出：rate=0.25
System.out.println(rate);
// 输出：0.25
```

### `toUpperCase`：转换为大写

协议字段或键名转大写时指定 `Locale.ROOT`，方法会返回新字符串。

```java
import java.util.Locale;

String text = "Java Api";
// 初始状态：text 当前为 "Java Api"。
String upper = text.toUpperCase(Locale.ROOT);
// 初始状态：upper 当前为 text.toUpperCase(Locale.ROOT)。
// 作用：协议字段或键名转大写时指定 Locale.ROOT，方法会返回新字符串。
System.out.println(upper);
// 输出：JAVA API
System.out.println(text);
// 输出：Java Api
```

### `toLowerCase`：转换为小写

协议字段或键名转小写时指定 `Locale.ROOT`，避免依赖默认语言区域。

```java
import java.util.Locale;

String text = "Java API";
// 初始状态：text 当前为 "Java API"。
String lower = text.toLowerCase(Locale.ROOT);
// 初始状态：lower 当前为 text.toLowerCase(Locale.ROOT)。
// 作用：协议字段或键名转小写时指定 Locale.ROOT，避免依赖默认语言区域。
System.out.println(lower);
// 输出：java api
System.out.println(text);
// 输出：Java API
```

### `trim`：去除旧式两端空白

兼容旧代码时用 `trim` 去除两端不大于 `U+0020` 的字符，新代码处理 Unicode 空白通常选 `strip`。

```java
String input = "  Java  ";
// 初始状态：input 当前为 " Java "。
String result = input.trim();
// 初始状态：result 当前为 input.trim()。
// 作用：兼容旧代码时用 trim 去除两端不大于 U+0020 的字符，新代码处理 Unicode 空白通常选 strip。
int length = result.length();
System.out.println(result);
// 输出：Java
System.out.println(length);
// 输出：4
```

### `strip`：去除 Unicode 两端空白

使用 `strip` 按 Unicode 空白规则清理字符串两端，原字符串不会改变。

```java
String input = "\u2003Java\u2003";
// 初始状态：input 当前为 "\u2003Java\u2003"。
String result = input.strip();
// 初始状态：result 当前为 input.strip()。
// 作用：使用 strip 按 Unicode 空白规则清理字符串两端，原字符串不会改变。
boolean originalChanged = input.equals(result);
System.out.println(result);
// 输出：Java
System.out.println(originalChanged);
// 输出：false
```

### `toCharArray`：转换为字符数组

需要可修改的 UTF-16 码元副本时用 `toCharArray`，它不保证每项都是完整 Unicode 字符。

```java
String text = "Java";
// 初始状态：text 当前为 "Java"。
char[] chars = text.toCharArray();
// 初始状态：chars 当前为 text.toCharArray()。
// 作用：需要可修改的 UTF-16 码元副本时用 toCharArray，它不保证每项都是完整 Unicode 字符。
chars[0] = 'L';
String changed = new String(chars);
System.out.println(changed);
// 输出：Lava
System.out.println(text);
// 输出：Java
```

### `getBytes`：按字符集编码为字节

跨文件或网络边界时用 `getBytes` 并显式指定字符集，避免平台默认编码差异。

```java
import java.nio.charset.StandardCharsets;

String text = "Java";
// 初始状态：text 当前为 "Java"。
byte[] bytes = text.getBytes(StandardCharsets.UTF_8);
// 初始状态：bytes 当前为 text.getBytes(StandardCharsets.UTF_8)。
// 作用：跨文件或网络边界时用 getBytes 并显式指定字符集，避免平台默认编码差异。
String decoded = new String(bytes, StandardCharsets.UTF_8);
System.out.println(bytes.length);
// 输出：4
System.out.println(decoded);
// 输出：Java
```

### `StringBuilder.append`：追加内容

循环构建文本时用 `append` 追加内容，最后调用 `toString` 取得不可变字符串。

```java
StringBuilder builder = new StringBuilder();
// 关键变化：StringBuilder builder = new StringBuilder()；builder 接收 该操作(当前参数) 的返回值，当前值变为这次调用得到的具体结果。
// 初始状态：builder 当前为 new StringBuilder()。
builder.append("Java");
// 关键变化：builder.append("Java") 把 "Java" 追加到 builder，当前文本为 "Java"。
builder.append(' ');
// 关键变化：builder.append(' ') 把空格追加到 builder，当前文本为 "Java "。
builder.append(21);
// 关键变化：builder.append(21) 把数字 21 追加到 builder，当前文本为 "Java 21"。
String result = builder.toString();
// 初始状态：result 当前为 builder.toString()。
System.out.println(result);
// 输出：Java 21
```

### `StringBuilder.insert`：在指定位置插入内容

需要在已有可变文本中间插入内容时使用 `insert`，索引按 UTF-16 码元计算。

```java
StringBuilder builder = new StringBuilder("Java速查");
// 关键变化：StringBuilder builder = new StringBuilder("Java速查")；builder 接收 该操作("Java速查") 的返回值，当前值变为这次调用得到的具体结果。
// 初始状态：builder 当前为 new StringBuilder("Java速查")。
builder.insert(0, '《');
// 关键变化：builder.insert(0, '《');；builder；insert；builder.insert(0) 返回本次调用的具体结果，后续语句继续使用该值。
builder.insert(builder.length(), '》');
// 关键变化：builder.insert(builder.length(), '》');；builder；insert；builder.insert(builder.length()) 返回本次调用的具体结果，后续语句继续使用该值。
String result = builder.toString();
// 初始状态：result 当前为 builder.toString()。
System.out.println(result);
// 输出：《Java速查》
System.out.println(builder.length());
// 输出：8
```

### `StringBuilder.delete`：删除指定区间

使用 `delete` 删除左闭右开的码元区间，调用会直接修改当前构建器。

```java
StringBuilder builder = new StringBuilder("Java--速查");
// 关键变化：StringBuilder builder = new StringBuilder("Java--速查");；builder 按具体参数 "Java--速查" 删除目标内容。
// 初始状态：builder 当前为 new StringBuilder("Java--速查")。
int start = builder.indexOf("--");
// 初始状态：start 当前为 builder.indexOf("--")。
builder.delete(start, start + 2);
// 关键变化：builder.delete(start, start + 2);；builder 按具体参数 start 删除目标内容。
String result = builder.toString();
System.out.println(result);
// 输出：Java速查
System.out.println(builder.length());
// 输出：6
```

### `length()`：获取 UTF-16 码元长度

`length()` 返回 UTF-16 码元数量，不等同于 Unicode 码点数或用户看到的字符数。

```java
String text = "Java🙂";
// 关键变化：text 接收表达式 "Java🙂" 的计算结果。
// 初始状态：text 当前为 "Java🙂"。
int units = text.length();
// 初始状态：units 当前为 text.length()。
// 关键变化：int units = text.length(); 将返回值写入 units；units 现在保存该具体结果。
int points = text.codePointCount(0, units);
// 关键变化：int points = text.codePointCount(0, units); 将返回值写入 points；points 现在保存该具体结果。
boolean differs = units != points;
// 关键变化：boolean differs = units != points; 将返回值写入 differs；differs 现在保存该具体结果。
System.out.println(units);
// 输出：6
System.out.println(points);
// 输出：5
System.out.println(differs);
// 输出：true
```

### `compareTo`：区分大小写地按字典序比较

`compareTo` 返回负数、零或正数，适合排序，不应假定非零结果一定是 `-1` 或 `1`。

```java
String left = "Java";
// 初始状态：left 当前为 "Java"。
String right = "java";
// 初始状态：right 当前为 "java"。
int order = left.compareTo(right);
// 关键变化：int order = left.compareTo(right); 将返回值写入 order；order 现在保存该具体结果。
boolean before = order < 0;
System.out.println(before);
// 输出：true
System.out.println(order == 0);
// 输出：false
```

### `compareToIgnoreCase`：忽略大小写地按字典序比较

排序规则允许忽略大小写时使用 `compareToIgnoreCase`，复杂本地化排序应改用 `Collator`。

```java
String left = "Java";
// 初始状态：left 当前为 "Java"。
String right = "java";
// 初始状态：right 当前为 "java"。
int order = left.compareToIgnoreCase(right);
// 关键变化：int order = left.compareToIgnoreCase(right); 将返回值写入 order；order 现在保存该具体结果。
boolean sameOrder = order == 0;
System.out.println(order);
// 输出：0
System.out.println(sameOrder);
// 输出：true
```

### `startsWith`：判断字符串前缀

`startsWith` 按字面内容判断开头，可用偏移重载从指定位置开始匹配。

```java
String path = "backup/data.json";
// 初始状态：path 当前为 "backup/data.json"。
// 初始状态：backup 当前为 path.startsWith("backup/")。
boolean backup = path.startsWith("backup/");
// 关键变化：boolean backup = path.startsWith("backup/"); 将返回值写入 backup；backup 现在保存该具体结果。
boolean dataAtSeven = path.startsWith("data", 7);
// 关键变化：boolean dataAtSeven = path.startsWith("data", 7); 将返回值写入 dataAtSeven；dataAtSeven 现在保存该具体结果。
System.out.println(backup);
// 输出：true
System.out.println(dataAtSeven);
// 输出：System.out 调用参数为 dataAtSeven。
```

### `endsWith`：判断字符串后缀

`endsWith` 按字面内容判断结尾，适合已完成大小写和路径规范化后的扩展名检查。

```java
String fileName = "data.json";
// 初始状态：fileName 当前为 "data.json"。
// 初始状态：json 当前为 fileName.endsWith(".json")。
boolean json = fileName.endsWith(".json");
// 关键变化：boolean json = fileName.endsWith(".json"); 将返回值写入 json；json 现在保存该具体结果。
boolean xml = fileName.endsWith(".xml");
// 关键变化：boolean xml = fileName.endsWith(".xml"); 将返回值写入 xml；xml 现在保存该具体结果。
System.out.println(json);
// 输出：true
System.out.println(xml);
// 输出：false
```

### `String.substring`：截取字符串区间

`substring` 按左闭右开区间截取文本，索引按 UTF-16 码元计算。

```java
String text = "Java速查";
// 初始状态：text 当前为 "Java速查"。
String prefix = text.substring(0, 4);
// 初始状态：prefix 当前为 text.substring(0, 4)。
// 作用：substring 按左闭右开区间截取文本，索引按 UTF-16 码元计算。
String suffix = text.substring(4);
// 关键变化：String suffix = text.substring(4); 将返回值写入 suffix；suffix 现在保存该具体结果。
System.out.println(prefix);
// 输出：Java
System.out.println(suffix);
// 输出：速查
```

### `replace`：按字面替换

`replace` 按字面匹配字符或字符序列并返回新字符串，不把参数解释为正则。

```java
String text = "JAVA，Java";
// 初始状态：text 当前为 "JAVA，Java"。
String punctuation = text.replace('，', ',');
// 初始状态：punctuation 当前为 text.replace('，', ',')。
// 作用：replace 按字面匹配字符或字符序列并返回新字符串，不把参数解释为正则。
String normalized = punctuation.replace("JAVA", "Java");
// 关键变化：String normalized = punctuation.replace("JAVA", "Java"); 将返回值写入 normalized；normalized 现在保存该具体结果。
System.out.println(normalized);
// 输出：Java,Java
System.out.println(text);
// 输出：JAVA，Java
```

### `split`：按正则分割文本

`split` 的参数是正则表达式；传负 `limit` 可保留末尾空字段。

```java
String csv = "Java,,SQL,";
// 初始状态：csv 当前为 "Java,,SQL,"。
String[] fields = csv.split(",", -1);
// 初始状态：fields 当前为 csv.split(",", -1)。
// 作用：split 的参数是正则表达式。
int count = fields.length;
System.out.println(java.util.Arrays.toString(fields));
// 输出：[Java, , SQL, ]
System.out.println(count);
// 输出：4
```

### `repeat`：重复字符串

`repeat` 返回重复指定次数的新字符串，次数为零时返回空串，负数会抛异常。

```java
int level = 3;
// 初始状态：level 当前为 3。
String unit = "  ";
// 初始状态：unit 当前为 " "。
String indent = unit.repeat(level);
// 关键变化：String indent = unit.repeat(level); 将返回值写入 indent；indent 现在保存该具体结果。
int length = indent.length();
System.out.println(length);
// 输出：6
System.out.println(indent.isEmpty());
// 输出：false
```

### `String.valueOf`：把值转换为字符串

`String.valueOf` 可统一转换基本值或对象，传入 `null` 对象时返回文本 `"null"`。

```java
Object maybeNull = null;
// 初始状态：maybeNull 当前为 null。
String label = String.valueOf(maybeNull);
// 初始状态：label 当前为 String.valueOf(maybeNull)。
// 作用：String.valueOf 可统一转换基本值或对象，传入 null 对象时返回文本 "null"。
String number = String.valueOf(42);
// 关键变化：String number = String.valueOf(42); 将返回值写入 number；number 现在保存该具体结果。
System.out.println(label);
// 输出：null
System.out.println(number);
// 输出：42
```
## 不常用但需要知道

### `subSequence`：以 `CharSequence` 截取

区间仍是左闭右开，返回接口类型 `CharSequence`；只需要 `String` 时优先使用 `substring`。

```java
String text = "Java速查";
// 初始状态：text 当前为 "Java速查"。
CharSequence suffix = text.subSequence(4, text.length());
// 作用：通过 subSequence 以 CharSequence 截取。
System.out.println(suffix);
// 输出：速查
```

### `contentEquals`：与其他字符序列比较

它可直接比较 `StringBuilder` 等 `CharSequence`，与 `equals` 的参数类型和对称性语义不同。

```java
String text = "Java";
// 关键变化：String text = "Java"；text 取右侧具体表达式的值，当前状态变为 "Java"。
// 初始状态：text 当前为 "Java"。
StringBuilder builder = new StringBuilder("Java");
// 关键变化：StringBuilder builder = new StringBuilder("Java")；builder 接收 该操作("Java") 的返回值，当前值变为这次调用得到的具体结果。
System.out.println(text.contentEquals(builder));
// 输出：true
```

### `regionMatches`：比较局部区域

适合避免创建临时子串的局部比较；参数多且容易写错，普通场景优先 `startsWith` 或 `substring`。

```java
String text = "Java速查";
// 初始状态：text 当前为 "Java速查"。
boolean matched = text.regionMatches(true, 0, "java", 0, 4);
// 关键变化：boolean matched = text.regionMatches(true, 0, "java", 0, 4); 将返回值写入 matched；matched 现在保存该具体结果。
System.out.println(matched);
// 输出：true
```

### `getChars`：复制指定码元区间

按 UTF-16 码元复制到已有数组，目标空间和区间必须足够；新代码通常用 `toCharArray` 更直观。

```java
String text = "Java速查";
// 初始状态：text 当前为 "Java速查"。
char[] target = new char[4];
text.getChars(0, 4, target, 0);
// 关键变化：text.getChars(0, 4, target, 0);；text；getChars；text.getChars(0) 返回本次调用的具体结果，后续语句继续使用该值。
System.out.println(new String(target));
// 输出：Java
```

### `intern`：访问字符串池

返回字符串池中的规范引用，但会影响池和内存行为；业务代码不要用它替代 `equals`。

```java
String dynamic = new String("Java");
// 初始状态：dynamic 当前为 new String("Java")。
String pooled = dynamic.intern();
// 关键变化：String pooled = dynamic.intern(); 将返回值写入 pooled；pooled 现在保存该具体结果。
System.out.println(pooled == "Java");
// 输出：true
```

### `lines`：按行流式处理

返回按换行符拆分的 `Stream<String>`，流只能消费一次；大量文本仍要考虑内存占用。

```java
String text = "Java\n\nString\n集合";
// 初始状态：text 当前为 "Java\n\nString\n集合"。
long nonEmpty = text.lines().filter(line -> !line.isBlank()).count();
// 作用：通过 lines 按行流式处理。
System.out.println(nonEmpty);
// 输出：3
```

### `indent`：调整每行缩进

`indent` 用于给每行增加或尝试删除指定数量的前导空格，并统一行结束符。

```java
String text = "one\ntwo";
// 初始状态：text 当前为 "one\ntwo"。
String indented = text.indent(2);
// 关键变化：String indented = text.indent(2); 将返回值写入 indented；indented 现在保存该具体结果。
String visible = indented.replace("\n", "|");
System.out.println(visible);
// 输出：  one|  two|
System.out.println(indented.lines().count());
// 输出：2
```

### `stripIndent`：删除多行公共缩进

`stripIndent` 按文本块规则删除各非空行共有的前导空白，适合规范化多行文本。

```java
String text = "    one\n      two";
// 初始状态：text 当前为 "    one\n      two"。
String normalized = text.stripIndent();
// 关键变化：String normalized = text.stripIndent(); 将返回值写入 normalized；normalized 现在保存该具体结果。
String visible = normalized.replace("\n", "|");
System.out.println(visible);
// 输出：one|  two
System.out.println(normalized.lines().count());
// 输出：2
```

### `translateEscapes`：解析 Java 转义文本

将字符串中的 `\\n`、`\\t` 等转义变成对应字符，不等同于 JSON 解析；非法转义会抛异常。

```java
String escaped = "Java\\nString\\t速查";
// 初始状态：escaped 当前为 "Java\\nString\\t速查"。
String actual = escaped.translateEscapes();
// 关键变化：String actual = escaped.translateEscapes(); 将返回值写入 actual；actual 现在保存该具体结果。
System.out.println(actual.replace("\n", "|").replace("\t", "→"));
// 输出：Java|String→速查
```

### `StringBuffer`：同步的可变字符序列

提供与 `StringBuilder` 类似的同步方法，只有确实需要共享可变字符缓冲区时才考虑；普通局部拼接优先 `StringBuilder`。

```java
StringBuffer shared = new StringBuffer("Java");
// 输入：shared 的初始值为 new StringBuffer("Java")。
// 作用：通过 StringBuffer 同步的可变字符序列。
shared.append("速查");
System.out.println(shared);
// 输出：Java速查
```
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
