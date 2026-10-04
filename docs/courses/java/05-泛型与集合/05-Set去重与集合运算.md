---
title: Set 去重与集合运算
date: 2026-09-27T00:00:00.000Z
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

### `HashSet()`：构造空的哈希集合

`HashSet()` 创建一个初始为空的可变集合，它依赖元素的 `hashCode` 和 `equals` 去重，但不保证迭代顺序。

```java
import java.util.HashSet;
import java.util.Set;

Set<String> tags = new HashSet<>();
// 初始状态：tags 由 new HashSet<>() 构造，size 为 0。
// 作用：HashSet 初始为空；加入 "java" 和 "sql" 后保留两个不同元素。
tags.add("java");
tags.add("sql");
System.out.println(tags.size());
// 输出：2
```

### `Set.add`：新增并判断是否重复

add 在元素尚不存在时写入并返回 true，重复元素不会再次加入。

```java
import java.util.HashSet;
import java.util.Set;

public class SetAddDemo {
    public static void main(String[] args) {
        Set<String> set = new HashSet<>();
        // 初始状态：set 当前为 new HashSet<>()。
        System.out.println(set.add("java"));
        // 作用：add 在元素尚不存在时写入并返回 true，重复元素不会再次加入。
        System.out.println(set.add("java"));
        // 输出：true
        // 输出：false
    }
}
```

### Set.contains：判断元素是否存在

contains 按集合的相等规则查询元素，HashSet 通常依赖 hashCode 和 equals。

```java
import java.util.HashSet;
import java.util.Set;

public class SetContainsDemo {
    public static void main(String[] args) {
        Set<String> set = new HashSet<>();
        // 初始状态：set 当前为 new HashSet<>()。
        set.add("java");
        boolean found = set.contains("java");
        // 初始状态：found 当前为 set.contains("java")。
        // 作用：contains 按集合的相等规则查询元素，HashSet 通常依赖 hashCode 和 equals。
        System.out.println(found);
        // 输出：true
    }
}
```

### Set.remove：删除元素

remove 删除匹配元素并返回是否成功，目标不存在时集合保持不变。

```java
import java.util.HashSet;
import java.util.Set;

public class SetRemoveDemo {
    public static void main(String[] args) {
        Set<String> set = new HashSet<>();
        // 初始状态：set 当前为 new HashSet<>()。
        set.add("java");
        boolean removed = set.remove("java");
        // 初始状态：removed 当前为 set.remove("java")。
        // 作用：remove 删除匹配元素并返回是否成功，目标不存在时集合保持不变。
        System.out.println(removed + ", " + set);
        // 输出：true, []
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
        // 初始状态：set 当前为 new LinkedHashSet<>()。
        // 作用：LinkedHashSet 在 HashSet 的去重基础上维护插入顺序，适合去重后稳定展示。
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
        // 初始状态：all 当前为 new LinkedHashSet<>(Set.of("java", "sql"))。
        all.addAll(Set.of("sql", "web"));
        // 作用：addAll 把另一个集合的元素加入当前集合，重复元素自动忽略。
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
        // 初始状态：common 当前为 new LinkedHashSet<>(Set.of("java", "sql", "web"))。
        common.retainAll(Set.of("java", "web"));
        // 作用：retainAll 只保留当前集合和参数集合共有的元素，属于原地修改。
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
        // 初始状态：onlyLeft 当前为 new LinkedHashSet<>(Set.of("java", "sql", "web"))。
        onlyLeft.removeAll(Set.of("sql"));
        // 作用：removeAll 删除当前集合中出现在参数集合里的元素。
        System.out.println(onlyLeft);
        // 输出：[java, web]
    }
}
```

### Set.size：统计元素数量

size 返回去重后的元素个数，而不是 add 的调用次数。

```java
import java.util.HashSet;
import java.util.Set;

public class SetSizeDemo {
    public static void main(String[] args) {
        Set<Integer> set = new HashSet<>();
        // 初始状态：set 当前为 new HashSet<>()。
        set.add(1);
        set.add(1);
        System.out.println(set.size());
        // 作用：size 返回去重后的元素个数，而不是 add 的调用次数。
        // 输出：1
    }
}
```

### Set.isEmpty：判断集合是否为空

isEmpty 直接表达“没有元素”，比比较 size 是否为 0 更清晰。

```java
import java.util.HashSet;
import java.util.Set;

public class SetIsEmptyDemo {
    public static void main(String[] args) {
        Set<Integer> set = new HashSet<>();
        // 初始状态：set 当前为 new HashSet<>()。
        System.out.println(set.isEmpty());
        // 作用：isEmpty 直接表达“没有元素”，比比较 size 是否为 0 更清晰。
        set.add(1);
        System.out.println(set.isEmpty());
        // 输出：true
        // 输出：false
    }
}
```

### Set.clear：清空集合

clear 删除当前集合的全部元素，但其他指向同一集合的引用仍指向它。

```java
import java.util.HashSet;
import java.util.Set;

public class SetClearDemo {
    public static void main(String[] args) {
        Set<Integer> set = new HashSet<>(Set.of(1, 2));
        // 初始状态：set 当前为 new HashSet<>(Set.of(1, 2))。
        set.clear();
        // 作用：clear 删除当前集合的全部元素，但其他指向同一集合的引用仍指向它。
        System.out.println(set);
        // 输出：[]
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
        // 初始状态：source 当前为 new HashSet<>(Set.of("java"))。
        Set<String> snapshot = Set.copyOf(source);
        // 初始状态：snapshot 当前为 Set.copyOf(source)。
        // 作用：Set.copyOf 复制当前元素结构并拒绝 null。
        source.add("sql");
        System.out.println(snapshot);
        // 输出：[java]
    }
}
```

### TreeSet：自动排序

TreeSet 依靠自然顺序或 Comparator 排列元素，并用比较结果判断重复。

```java
import java.util.TreeSet;

public class TreeSetOrderDemo {
    public static void main(String[] args) {
        TreeSet<Integer> set = new TreeSet<>();
        // 初始状态：set 当前为 new TreeSet<>()。
        // 作用：TreeSet 依靠自然顺序或 Comparator 排列元素，并用比较结果判断重复。
        set.add(30);
        set.add(10);
        set.add(20);
        System.out.println(set);
        // 输出：[10, 20, 30]
    }
}
```

### TreeSet.first：读取最小元素

first 返回排序后的第一个元素，空集合调用会抛 NoSuchElementException。

```java
import java.util.TreeSet;

public class TreeSetFirstDemo {
    public static void main(String[] args) {
        TreeSet<Integer> set = new TreeSet<>();
        // 初始状态：set 当前为 new TreeSet<>()。
        set.add(30);
        set.add(10);
        System.out.println(set.first());
        // 作用：first 返回排序后的第一个元素，空集合调用会抛 NoSuchElementException。
        // 输出：10
    }
}
```

### TreeSet.last：读取最大元素

last 返回排序后的最后一个元素，调用前要确认集合不为空。

```java
import java.util.TreeSet;

public class TreeSetLastDemo {
    public static void main(String[] args) {
        TreeSet<Integer> set = new TreeSet<>();
        // 初始状态：set 当前为 new TreeSet<>()。
        set.add(10);
        set.add(30);
        System.out.println(set.last());
        // 作用：last 返回排序后的最后一个元素，调用前要确认集合不为空。
        // 输出：30
    }
}
```

### TreeSet.ceiling：查询大于等于目标的最小元素

ceiling 返回不小于目标的最近元素，不存在时返回 null。

```java
import java.util.TreeSet;

public class TreeSetCeilingDemo {
    public static void main(String[] args) {
        TreeSet<Integer> set = new TreeSet<>(java.util.Set.of(10, 20, 30));
        // 初始状态：set 当前为 new TreeSet<>(java.util.Set.of(10, 20, 30))。
        System.out.println(set.ceiling(15));
        // 作用：ceiling 返回不小于目标的最近元素，不存在时返回 null。
        System.out.println(set.ceiling(31));
        // 输出：20
        // 输出：null
    }
}
```

### TreeSet.floor：查询小于等于目标的最大元素

floor 返回不大于目标的最近元素，不存在时返回 null。

```java
import java.util.TreeSet;

public class TreeSetFloorDemo {
    public static void main(String[] args) {
        TreeSet<Integer> set = new TreeSet<>(java.util.Set.of(10, 20, 30));
        // 初始状态：set 当前为 new TreeSet<>(java.util.Set.of(10, 20, 30))。
        System.out.println(set.floor(15));
        // 作用：floor 返回不大于目标的最近元素，不存在时返回 null。
        System.out.println(set.floor(9));
        // 输出：10
        // 输出：null
    }
}
```
## 不常用但需要知道

### TreeSet.lower：查询严格小于目标的最大元素

lower 排除等于目标的元素，较小元素不存在时返回 null。

```java
import java.util.TreeSet;

public class TreeSetLowerDemo {
    public static void main(String[] args) {
        TreeSet<Integer> set = new TreeSet<>(java.util.Set.of(10, 20, 30));
        // 初始状态：set 当前为 new TreeSet<>(java.util.Set.of(10, 20, 30))。
        System.out.println(set.lower(20));
        // 作用：通过 TreeSet.lower 查询严格小于目标的最大元素。
        // 输出：10
    }
}
```

### TreeSet.higher：查询严格大于目标的最小元素

higher 排除等于目标的元素，较大元素不存在时返回 null。

```java
import java.util.TreeSet;

public class TreeSetHigherDemo {
    public static void main(String[] args) {
        TreeSet<Integer> set = new TreeSet<>(java.util.Set.of(10, 20, 30));
        // 初始状态：set 当前为 new TreeSet<>(java.util.Set.of(10, 20, 30))。
        System.out.println(set.higher(20));
        // 作用：通过 TreeSet.higher 查询严格大于目标的最小元素。
        // 输出：30
    }
}
```

### TreeSet.subSet：查询区间视图

subSet 返回指定上下界之间的动态视图，需要独立结果时再复制。

```java
import java.util.TreeSet;

public class TreeSetRangeDemo {
    public static void main(String[] args) {
        TreeSet<Integer> set = new TreeSet<>(java.util.Set.of(1, 2, 3, 4));
        // 初始状态：set 当前为 new TreeSet<>(java.util.Set.of(1, 2, 3, 4))。
        System.out.println(set.subSet(2, true, 4, false));
        // 作用：通过 TreeSet.subSet 查询区间视图。
        // 输出：[2, 3]
    }
}
```

### TreeSet.headSet：查询小于上界的视图

headSet 返回上界之前的动态视图，布尔参数决定是否包含上界。

```java
import java.util.TreeSet;

public class TreeSetHeadSetDemo {
    public static void main(String[] args) {
        TreeSet<Integer> set = new TreeSet<>(java.util.Set.of(1, 2, 3, 4));
        // 初始状态：set 当前为 new TreeSet<>(java.util.Set.of(1, 2, 3, 4))。
        System.out.println(set.headSet(3, true));
        // 作用：通过 TreeSet.headSet 查询小于上界的视图。
        // 输出：[1, 2, 3]
    }
}
```

### TreeSet.tailSet：查询大于下界的视图

tailSet 返回下界之后的动态视图，布尔参数决定是否包含下界。

```java
import java.util.TreeSet;

public class TreeSetTailSetDemo {
    public static void main(String[] args) {
        TreeSet<Integer> set = new TreeSet<>(java.util.Set.of(1, 2, 3, 4));
        // 初始状态：set 当前为 new TreeSet<>(java.util.Set.of(1, 2, 3, 4))。
        System.out.println(set.tailSet(3, false));
        // 作用：通过 TreeSet.tailSet 查询大于下界的视图。
        // 输出：[4]
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
        // 作用：通过 EnumSet.of 枚举状态集合。
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
            // 作用：通过 EnumSet.complementOf 枚举补集。
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
        // 作用：通过 Collections.disjoint 判断两个集合是否没有交集。
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
