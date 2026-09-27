---
title: Set 去重与集合运算
date: 2026-09-27
category: Java基础快速入门
tags:
  - Java
  - Set
  - HashSet
  - TreeSet
  - 集合运算
description: 速查 HashSet、LinkedHashSet、TreeSet、EnumSet 的去重、排序、邻近查找和集合运算。
---

# Set 去重与集合运算

## 学习目标

- 按是否需要顺序、排序和范围查询选择 Set 实现。
- 使用 add、contains、removeAll、retainAll 等 API 完成去重和集合运算。
- 理解 equals/hashCode、Comparator、null 和不可变 Set 的边界。

## 核心知识点

### 专业术语

- **Set**：不允许重复元素的集合接口。
- **HashSet**：依赖 hashCode/equals 去重，通常不承诺遍历顺序。
- **LinkedHashSet**：去重并保留插入顺序。
- **TreeSet**：按自然顺序或 Comparator 排序，支持范围和邻近查找。
- **EnumSet**：针对单个枚举类型的紧凑集合实现。

### 白话解释与边界

去重的依据不是对象地址，而是 equals 和 hashCode；自定义对象放入 HashSet 后，不要修改参与这两个方法的字段。因此要保留输入顺序用 LinkedHashSet，要排序或找大于等于某值的元素用 TreeSet。Set 不支持按索引读取，若业务需要位置语义应选 List。

## 常用用法

### HashSet.add、contains、remove：去重与查找

add 返回是否真正新增；HashSet 平均查找快，但遍历顺序不属于契约。

```java
import java.util.HashSet;
import java.util.Set;

public class HashSetBasicDemo {
    public static void main(String[] args) {
        Set<String> set = new HashSet<>();
        set.add("java");
        set.add("java");
        boolean found = set.contains("java");
        set.remove("java");
        System.out.println(found + ", " + set.isEmpty());
        // 输出：true, true
    }
}
```

### LinkedHashSet：去重并保留插入顺序

LinkedHashSet 在 HashSet 的去重基础上维护插入顺序，适合去重后稳定展示；需要排序时改用 TreeSet。

```java
import java.util.LinkedHashSet;
import java.util.Set;

public class LinkedHashSetDemo {
    public static void main(String[] args) {
        Set<String> set = new LinkedHashSet<>();
        set.add("b");
        set.add("a");
        set.add("b");
        System.out.println(set);
        // 输出：[b, a]
    }
}
```

### Set.addAll：并集

addAll 把另一个集合的元素加入当前集合，重复元素自动忽略；这是原地操作，需要保留原集合时先复制。

```java
import java.util.LinkedHashSet;
import java.util.Set;

public class SetUnionDemo {
    public static void main(String[] args) {
        Set<String> all = new LinkedHashSet<>(Set.of("java", "sql"));
        all.addAll(Set.of("sql", "web"));
        System.out.println(all);
        // 输出：[java, sql, web]
    }
}
```

### Set.retainAll：交集

retainAll 只保留当前集合和参数集合共有的元素，属于原地修改。

```java
import java.util.LinkedHashSet;
import java.util.Set;

public class SetIntersectionDemo {
    public static void main(String[] args) {
        Set<String> common = new LinkedHashSet<>(Set.of("java", "sql", "web"));
        common.retainAll(Set.of("java", "web"));
        System.out.println(common);
        // 输出：[java, web]
    }
}
```

### Set.removeAll：差集

removeAll 删除当前集合中出现在参数集合里的元素；参数集合很大时可考虑它的查找复杂度。

```java
import java.util.LinkedHashSet;
import java.util.Set;

public class SetDifferenceDemo {
    public static void main(String[] args) {
        Set<String> onlyLeft = new LinkedHashSet<>(Set.of("java", "sql", "web"));
        onlyLeft.removeAll(Set.of("sql"));
        System.out.println(onlyLeft);
        // 输出：[java, web]
    }
}
```

### size、isEmpty、clear：查看与清空

clear 清空当前集合，不会让其他引用自动切换到新集合。

```java
import java.util.HashSet;
import java.util.Set;

public class SetStateDemo {
    public static void main(String[] args) {
        Set<Integer> set = new HashSet<>(Set.of(1, 2));
        System.out.println(set.size() + ", " + set.isEmpty());
        // 输出：2, false
        set.clear();
        System.out.println(set.isEmpty());
        // 输出：true
    }
}
```

### Set.copyOf：创建不可修改快照

Set.copyOf 复制当前元素结构并拒绝 null；结果不能 add、remove，元素本身如果可变仍不自动深复制。

```java
import java.util.HashSet;
import java.util.Set;

public class SetCopyOfDemo {
    public static void main(String[] args) {
        Set<String> source = new HashSet<>(Set.of("java"));
        Set<String> snapshot = Set.copyOf(source);
        source.add("sql");
        System.out.println(snapshot);
        // 输出：[java]
    }
}
```

### TreeSet：自动排序与边界元素

TreeSet 依靠自然顺序或 Comparator 排序，first/last 在空集合上会抛 NoSuchElementException。

```java
import java.util.TreeSet;

public class TreeSetOrderDemo {
    public static void main(String[] args) {
        TreeSet<Integer> set = new TreeSet<>();
        set.add(30);
        set.add(10);
        set.add(20);
        System.out.println(set.first() + ", " + set.last());
        // 输出：10, 30
    }
}
```

### TreeSet.ceiling、floor：邻近元素

ceiling 找大于等于目标的最小值，floor 找小于等于目标的最大值；找不到时返回 null。

```java
import java.util.TreeSet;

public class TreeSetNearestDemo {
    public static void main(String[] args) {
        TreeSet<Integer> set = new TreeSet<>();
        set.add(10);
        set.add(20);
        set.add(30);
        System.out.println(set.ceiling(15) + ", " + set.floor(15));
        // 输出：20, 10
    }
}
```
## 不常用但需要知道

### TreeSet.lower、higher：严格邻近元素

lower 和 higher 排除等于目标的元素，边界不存在时返回 null。

```java
import java.util.TreeSet;

public class TreeSetStrictNearestDemo {
    public static void main(String[] args) {
        TreeSet<Integer> set = new TreeSet<>(java.util.Set.of(10, 20, 30));
        System.out.println(set.lower(20) + ", " + set.higher(20));
        // 输出：10, 30
    }
}
```

### TreeSet.subSet、headSet、tailSet：范围视图

范围方法返回排序集合的视图，参数的包含边界要看重载；需要独立结果时复制到新集合。

```java
import java.util.TreeSet;

public class TreeSetRangeDemo {
    public static void main(String[] args) {
        TreeSet<Integer> set = new TreeSet<>(java.util.Set.of(1, 2, 3, 4));
        System.out.println(set.subSet(2, true, 4, false));
        // 输出：[2, 3]
    }
}
```

### EnumSet.of：枚举状态集合

EnumSet 只能保存同一种枚举，适合权限或标志集合；它通常比 HashSet 更紧凑。

```java
import java.util.EnumSet;

public class EnumSetDemo {
    enum Permission { READ, WRITE, DELETE }

    public static void main(String[] args) {
        EnumSet<Permission> set = EnumSet.of(Permission.READ, Permission.WRITE);
        System.out.println(set.contains(Permission.WRITE));
        // 输出：true
    }
}
```

### EnumSet.complementOf：枚举补集

补集只在同一个枚举类型内有意义；空集合需要用 EnumSet.noneOf(Permission.class) 提供类型。

```java
import java.util.EnumSet;

public class EnumSetComplementDemo {
    enum Permission { READ, WRITE, DELETE }

    public static void main(String[] args) {
        EnumSet<Permission> missing =
            EnumSet.complementOf(EnumSet.of(Permission.READ));
        System.out.println(missing);
        // 输出：[WRITE, DELETE]
    }
}
```

### Collections.disjoint：判断两个集合是否没有交集

disjoint 只回答是否相交，不会生成交集；需要结果集合时使用 retainAll 的副本。

```java
import java.util.Collections;
import java.util.Set;

public class DisjointSetDemo {
    public static void main(String[] args) {
        boolean disjoint = Collections.disjoint(Set.of("java"), Set.of("sql"));
        System.out.println(disjoint);
        // 输出：true
    }
}
```

### 用自定义 Comparator 构造 TreeSet

TreeSet 把 Comparator 的比较结果当作元素身份；本例中长度相同的 bb 和 cc 会被视为重复，比较器必须符合业务语义。

```java
import java.util.Comparator;
import java.util.TreeSet;

public class TreeSetComparatorDemo {
    public static void main(String[] args) {
        TreeSet<String> set = new TreeSet<>(Comparator.comparingInt(String::length));
        set.add("a");
        set.add("bb");
        set.add("cc");
        System.out.println(set);
        // 输出：[a, bb]
    }
}
```
## 简单案例

```java
import java.util.LinkedHashSet;
import java.util.Set;

public class SetSummaryDemo {
    public static void main(String[] args) {
        Set<String> tags = new LinkedHashSet<>();
        tags.add("java");
        tags.add("java");
        System.out.println(tags);
        // 输出：[java]
    }
}
```

Set 的核心路径是去重与判断存在；需要顺序或排序时再选择对应实现。

## 易混点

- HashSet 不承诺顺序，LinkedHashSet 保留插入顺序，TreeSet 按比较结果排序。
- HashSet 依赖 equals/hashCode，TreeSet 依赖 compareTo/Comparator；两者可能对“相等”的定义不同。
- Set 没有按索引 get；需要位置访问时使用 List。
- TreeSet 的范围方法返回视图，Set.copyOf 返回不可修改快照，二者不要混用。

## 课后小问

1. 为什么 TreeSet 中比较器返回 0 会让两个不同对象只保留一个？
答案：TreeSet 使用比较结果判断元素是否重复，返回 0 就认为排序意义上的同一元素。
解析：比较器必须与业务唯一性一致；如果只按姓名长度比较，长度相同的对象会互相覆盖。

2. Set.retainAll 与 Set.copyOf 的作用有什么不同？
答案：retainAll 做原地交集修改，copyOf 创建当前内容的不可修改副本。
解析：前者改变原 Set，后者隔离容器结构；它们都不会自动深复制可变元素。

## 本节小结

- HashSet 用于通用去重，LinkedHashSet 用于去重并保序，TreeSet 用于排序和范围查询。
- addAll、retainAll、removeAll 分别表达并集、交集和差集。
- EnumSet 适合枚举状态，Set.copyOf 适合不可修改快照。
- 自定义比较器决定 TreeSet 的排序和唯一性语义。

## 快速回顾

- 能按顺序、排序、范围查询需求选择 Set 实现。
- 能写出并集、交集和差集。
- 能解释 HashSet 与 TreeSet 的等价判断依据。
- 能识别 TreeSet 视图、Set.copyOf 快照和可变元素边界。
