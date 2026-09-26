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

## 核心知识点

### 专业术语

- **不可变对象（immutable object）**：`String` 创建后内容不再改变，拼接或替换会返回新的字符串对象。
- **字符串池（string pool）**：运行时保存部分字符串字面量的共享区域，不能作为 `==` 内容比较的依据。
- **字符集（charset）**：把字符与字节编码互相转换的规则；跨边界文本应显式指定 `UTF-8` 等字符集。
- **UTF-16 code unit 与 Unicode code point**：Java 的 `char` 是 16 位码元，一个码点可能需要两个码元。
- **正则表达式（regular expression）**：按模式匹配文本的语言；`split` 的参数也会按正则解释。

### 白话解释与边界

字符串像一张不可擦写的纸：`trim`、`replace` 或 `+` 不会修改原对象，而是产生新值。少量拼接没有问题；循环中大量拼接应使用 `StringBuilder`，避免反复创建中间字符串。文本离开 Java 内存时才是字节，读写必须指定字符集，不能把“当前系统默认编码”当成稳定协议。

`String.length()` 返回 UTF-16 码元数量，不一定等于 Unicode 码点数量，更不等于用户看到的字素簇数量；复杂排版还可能需要更高层的文本分段。正则适合字段级清洗，嵌套语法或需要精确错误位置的格式应使用专门解析器。

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
        System.out.println("fields=" + line + ", utf8Bytes=" + utf8.length);
        System.out.println("units=" + cleaned.length() + ", codePoints="
                + cleaned.codePointCount(0, cleaned.length()));
    }
}
```

案例先用指定 UTF-8 解码，再清理两端空白、全角逗号和连续空白；输出中的 `units` 和 `codePoints` 对表情会出现差异。`split` 使用正则，逗号本身不需转义，若分隔符是点号或竖线则必须写成正则转义形式。

## 易混点

- `String` 不可变，`replace` 的返回值必须接住；`StringBuilder` 可变，适合单线程局部拼接。
- `==` 比较字符串引用身份，`equals` 才比较内容；字符串池让错误代码有时“碰巧通过”。
- UTF-8 是字节编码，UTF-16 是 Java 内部码元表示，Unicode 码点是抽象字符编号，三者不能互换。
- `split` 参数是正则而非普通字面量，且默认丢弃末尾空字段；需要保留时使用负 `limit`。

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
- 正则和 `split` 很方便，但分隔符转义、末尾空字段和解析复杂度都有边界。

## 快速回顾

- 能说明不可变字符串为何会产生新对象。
- 能为字节与字符串转换显式选择 `StandardCharsets.UTF_8`。
- 能区分 `length()`、码点数量和用户可见字符数量。
- 能发现 `split` 正则元字符与 `limit` 参数带来的差异。
