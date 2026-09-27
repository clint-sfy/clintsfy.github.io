---
title: Pandas 数据分析速查
author: 阿源
date: 2026/09/27
categories:
 - Python进阶
tags:
 - python
 - pandas
---

# Pandas 数据分析速查

Pandas 用 `Series` 表示带标签的一维数据，用 `DataFrame` 表示带行列标签的二维表。本文覆盖日常清洗、筛选、聚合、连接、透视和读写，示例以 Pandas 1.4+ 的稳定 API 为基线，适用于 Pandas 2.x。

## 学习目标

- 能创建并检查 Series/DataFrame，区分标签选择和位置选择。
- 能处理缺失值、类型转换、排序和条件过滤。
- 能使用 `groupby`、`agg`、`transform`、连接与透视完成分析。
- 能安全读写 CSV，并知道 `apply`、`map`、窗口运算的适用边界。

## 核心知识点

DataFrame 可以理解为“共享同一行索引的多个 Series”。列通常有自己的 `dtype`，一列可以是整数、字符串、日期或分类数据。Pandas 的大多数运算会按标签对齐，而不是只按位置相加；这正是它比普通二维列表方便、也容易出错的地方。

`loc` 使用标签，`iloc` 使用从 0 开始的位置；布尔筛选保留满足条件的行。清洗流程通常是：检查结构 → 统一类型 → 处理缺失 → 筛选/排序 → 分组或连接 → 导出。

## 常用用法

### 创建 `Series` 与 `DataFrame`

```python
import pandas as pd

scores = pd.Series([88, 92, 75], index=["Ada", "Lin", "Mo"], name="score")
students = pd.DataFrame({
    "name": ["Ada", "Lin", "Mo"],
    "score": [88, 92, 75],
    "passed": [True, True, False],
})
print(scores.to_dict(), students.shape, students.columns.tolist())
# 输出：{'Ada': 88, 'Lin': 92, 'Mo': 75} (3, 3) ['name', 'score', 'passed']
```

字典键通常成为列名，列表长度必须一致。为业务数据显式建立唯一索引，后续 `loc`、连接和对齐会更清楚。

### 查看 `head`、`dtypes` 与 `describe`

```python
import pandas as pd

df = pd.DataFrame({"age": [20, 31, 28], "score": [88.0, 92.5, 75.0]})
summary = {
    "head": df.head(2).to_dict(orient="records"),
    "dtypes": {key: str(value) for key, value in df.dtypes.items()},
    "describe": df["score"].describe()[["mean", "min", "max"]].round(2).to_dict(),
}
print(summary)
# 输出：{'head': [{'age': 20, 'score': 88.0}, {'age': 31, 'score': 92.5}], 'dtypes': {'age': 'int64', 'score': 'float64'}, 'describe': {'mean': 85.17, 'min': 75.0, 'max': 92.5}}
```

`info()` 适合快速查看内存和非空计数；在脚本或文档中若需要稳定输出，优先把关心的信息整理成字典后 `print`。

### 选择列与 `filter`

```python
import pandas as pd

df = pd.DataFrame({"name": ["Ada", "Lin"], "age": [36, 28], "score": [88, 92]})
one = df["score"]
many = df[["name", "score"]]
matched = df.filter(regex="^(name|score)$")
print(one.tolist(), many.to_dict(orient="records"), matched.columns.tolist())
# 输出：[88, 92] [{'name': 'Ada', 'score': 88}, {'name': 'Lin', 'score': 92}] ['name', 'score']
```

单列选择返回 Series，多列选择仍是 DataFrame；需要保持二维形状时即使只选一列也写成 `df[["score"]]`。`filter` 按列名或正则筛选，不会执行行值条件。

### `loc` 标签选择与布尔筛选

```python
import pandas as pd

df = pd.DataFrame({"score": [88, 92, 75], "city": ["BJ", "SH", "BJ"]}, index=["Ada", "Lin", "Mo"])
selected = df.loc[["Ada", "Mo"], "score"]
beijing = df.loc[df["city"] == "BJ", ["score", "city"]]
df.loc[df["score"] < 80, "level"] = "retry"
print(selected.to_dict(), beijing.to_dict(orient="records"), df["level"].tolist())
# 输出：{'Ada': 88, 'Mo': 75} [{'score': 88, 'city': 'BJ'}, {'score': 75, 'city': 'BJ'}] [nan, nan, 'retry']
```

链式索引如 `df[df["score"] < 80]["level"] = ...` 容易产生 `SettingWithCopyWarning`；赋值时使用单次 `loc`。

### `iloc` 位置选择

```python
import pandas as pd

df = pd.DataFrame({"name": ["Ada", "Lin", "Mo"], "score": [88, 92, 75]})
first_row = df.iloc[0]
block = df.iloc[0:2, 1:]
last_score = df.iloc[-1, 1]
print(first_row.to_dict(), block.to_dict(orient="records"), int(last_score))
# 输出：{'name': 'Ada', 'score': 88} [{'score': 88}, {'score': 92}] 75
```

切片的结束位置在 `iloc` 中不包含；`iloc` 不理解列名。数据清洗脚本中不要把列顺序当成永久契约，稳定业务代码优先使用 `loc` 和列名。

### `query` 表达式过滤

```python
import pandas as pd

df = pd.DataFrame({"age": [18, 25, 31], "score": [72, 88, 95], "city": ["BJ", "SH", "BJ"]})
minimum = 80
filtered = df.query("score >= @minimum and city == 'BJ'")
print(filtered.to_dict(orient="records"))
# 输出：[{'age': 31, 'score': 95, 'city': 'BJ'}]
```

`@name` 引用外部 Python 变量；字段名含空格或关键字时用反引号，复杂逻辑直接使用布尔数组通常更容易调试。

### 缺失值：`isna`、`fillna` 与 `dropna`

```python
import pandas as pd

df = pd.DataFrame({"score": [88, None, 75], "city": ["BJ", None, "SH"]})
missing = df.isna().sum().to_dict()
filled = df.assign(score=df["score"].fillna(df["score"].median()), city=df["city"].fillna("unknown"))
complete = df.dropna(subset=["score"])
print(missing, filled.to_dict(orient="records"), len(complete))
# 输出：{'score': 1, 'city': 1} [{'score': 88.0, 'city': 'BJ'}, {'score': 81.5, 'city': 'unknown'}, {'score': 75.0, 'city': 'SH'}] 2
```

先区分“缺失”与业务中的空字符串或特殊数值。`fillna` 可以填常量、统计量或按列传入字典；删除前要确认缺失比例和业务含义。

### `astype`、`to_numeric` 与 `to_datetime`

```python
import pandas as pd

raw = pd.DataFrame({"score": ["88", "bad", "75"], "date": ["2026-01-02", "2026-01-03", None]})
clean = raw.assign(
    score=pd.to_numeric(raw["score"], errors="coerce").astype("Float64"),
    date=pd.to_datetime(raw["date"], errors="coerce"),
)
print(clean.dtypes.astype(str).to_dict(), clean.isna().sum().to_dict())
# 输出：{'score': 'Float64', 'date': 'datetime64[ns]'} {'score': 1, 'date': 1}
```

`astype` 适合确定格式的转换，脏数据先使用 `to_numeric(..., errors="coerce")`；日期解析也可用 `errors="coerce"` 把异常值变成缺失，再统一处理。

### `sort_values` 与 `sort_index`

```python
import pandas as pd

df = pd.DataFrame({"name": ["Ada", "Lin", "Mo"], "score": [88, 92, 75]})
by_score = df.sort_values("score", ascending=False)
by_two = df.sort_values(["score", "name"], ascending=[False, True])
indexed = df.set_index("name").sort_index()
print(by_score["name"].tolist(), by_two["name"].tolist(), indexed.index.tolist())
# 输出：['Lin', 'Ada', 'Mo'] ['Lin', 'Ada', 'Mo'] ['Ada', 'Lin', 'Mo']
```

排序默认返回副本；需要稳定地保留原表时不要依赖 `inplace=True`，把返回值赋给新变量往往更易组合和测试。

### `groupby` 与 `agg`

```python
import pandas as pd

sales = pd.DataFrame({
    "team": ["A", "A", "B", "B"],
    "product": ["pen", "book", "pen", "book"],
    "amount": [10, 30, 20, 40],
})
summary = sales.groupby("team", as_index=False).agg(
    total=("amount", "sum"),
    average=("amount", "mean"),
    orders=("amount", "size"),
)
print(summary.to_dict(orient="records"))
# 输出：[{'team': 'A', 'total': 40, 'average': 20.0, 'orders': 2}, {'team': 'B', 'total': 60, 'average': 30.0, 'orders': 2}]
```

命名聚合 `(列名, 函数)` 可以一次得到清晰列名；`as_index=False` 直接把分组键保留为普通列，适合继续连接或导出。

### `transform` 保留原行数

```python
import pandas as pd

scores = pd.DataFrame({"team": ["A", "A", "B"], "score": [80, 100, 90]})
scores["team_mean"] = scores.groupby("team")["score"].transform("mean")
scores["ratio"] = scores["score"] / scores["team_mean"]
print(scores.round(2).to_dict(orient="records"))
# 输出：[{'team': 'A', 'score': 80, 'team_mean': 90.0, 'ratio': 0.89}, {'team': 'A', 'score': 100, 'team_mean': 90.0, 'ratio': 1.11}, {'team': 'B', 'score': 90, 'team_mean': 90.0, 'ratio': 1.0}]
```

`agg` 通常把每组压成一行，`transform` 返回与原表等长的结果，适合计算组内标准化、占比或组均值。

### `merge` 按键连接

```python
import pandas as pd

users = pd.DataFrame({"user_id": [1, 2], "name": ["Ada", "Lin"]})
orders = pd.DataFrame({"user_id": [1, 1, 3], "amount": [10, 20, 99]})
joined = users.merge(orders, on="user_id", how="left", validate="one_to_many")
print(joined.to_dict(orient="records"))
# 输出：[{'user_id': 1, 'name': 'Ada', 'amount': 10.0}, {'user_id': 1, 'name': 'Ada', 'amount': 20.0}, {'user_id': 2, 'name': 'Lin', 'amount': nan}]
```

`how` 可选 `inner`、`left`、`right`、`outer`；`validate` 能把预期的一对多关系变成可检查的约束。连接前先确认键的类型和唯一性。

### `join` 按索引连接

```python
import pandas as pd

profile = pd.DataFrame({"name": ["Ada", "Lin"]}, index=[1, 2])
levels = pd.DataFrame({"level": ["senior", "junior"]}, index=[1, 2])
joined = profile.join(levels, how="left")
print(joined.to_dict(orient="index"))
# 输出：{1: {'name': 'Ada', 'level': 'senior'}, 2: {'name': 'Lin', 'level': 'junior'}}
```

`join` 默认使用索引；如果业务键在列中，`merge` 通常更直观。列名冲突时使用 `lsuffix`、`rsuffix`。

### `concat` 纵向或横向合并

```python
import pandas as pd

jan = pd.DataFrame({"name": ["Ada"], "score": [88]})
feb = pd.DataFrame({"name": ["Lin"], "score": [92]})
rows = pd.concat([jan, feb], ignore_index=True)
columns = pd.concat([jan.set_index("name"), feb.set_index("name")], axis=1)
print(rows.to_dict(orient="records"), columns.index.tolist())
# 输出：[{'name': 'Ada', 'score': 88}, {'name': 'Lin', 'score': 92}] ['Ada', 'Lin']
```

`concat` 是拼接，不是按键匹配；使用 `ignore_index=True` 可以在纵向追加后重建连续索引。不要再使用已移除的 `DataFrame.append`。

### `pivot_table` 汇总成透视表

```python
import pandas as pd

sales = pd.DataFrame({
    "team": ["A", "A", "B", "B"],
    "month": ["Jan", "Feb", "Jan", "Feb"],
    "amount": [10, 30, 20, 40],
})
pivot = sales.pivot_table(index="team", columns="month", values="amount", aggfunc="sum", fill_value=0)
print(pivot.to_dict())
# 输出：{'Feb': {'A': 30, 'B': 40}, 'Jan': {'A': 10, 'B': 20}}
```

`pivot` 要求每个索引-列组合唯一；可能重复时使用 `pivot_table` 并指定聚合函数。

### `melt` 宽表转长表

```python
import pandas as pd

wide = pd.DataFrame({"name": ["Ada", "Lin"], "Jan": [10, 20], "Feb": [12, 18]})
long = wide.melt(id_vars="name", var_name="month", value_name="amount")
print(long.to_dict(orient="records"))
# 输出：[{'name': 'Ada', 'month': 'Jan', 'amount': 10}, {'name': 'Lin', 'month': 'Jan', 'amount': 20}, {'name': 'Ada', 'month': 'Feb', 'amount': 12}, {'name': 'Lin', 'month': 'Feb', 'amount': 18}]
```

长表更适合分组和可视化：一列表示一个变量，一行表示一条观测；`melt` 是把多个测量列堆叠成“变量-值”两列。

### `rolling` 窗口统计

```python
import pandas as pd

series = pd.Series([10, 12, 15, 13], name="sales")
moving = series.rolling(window=2, min_periods=1).mean()
expanding = series.expanding(min_periods=1).mean()
print(moving.round(2).tolist(), expanding.round(2).tolist())
# 输出：[10.0, 11.0, 13.5, 14.0] [10.0, 11.0, 12.33, 12.5]
```

窗口对象默认按位置滚动；时间序列可以用时间偏移量窗口。`min_periods` 决定窗口未满时是否返回结果。

### `apply` 与 `map`

```python
import pandas as pd

df = pd.DataFrame({"name": ["Ada", "Lin"], "score": [88, 92]})
df["grade"] = df["score"].map(lambda value: "A" if value >= 90 else "B")
df["name_length"] = df["name"].apply(len)
row_totals = df[["score", "name_length"]].apply("sum", axis=1)
print(df.to_dict(orient="records"), row_totals.tolist())
# 输出：[{'name': 'Ada', 'score': 88, 'grade': 'B', 'name_length': 3}, {'name': 'Lin', 'score': 92, 'grade': 'A', 'name_length': 3}] [91, 95]
```

能用向量化方法就不要逐行 `apply`；`Series.map` 适合逐元素映射，`DataFrame.apply(axis=1)` 更灵活但通常更慢。

### `read_csv` 与 `to_csv`

```python
from pathlib import Path
import tempfile
import pandas as pd

source = pd.DataFrame({"name": ["Ada", "Lin"], "score": [88, 92]})
with tempfile.TemporaryDirectory() as directory:
    path = Path(directory) / "scores.csv"
    source.to_csv(path, index=False, encoding="utf-8")
    restored = pd.read_csv(path)
    print(restored.to_dict(orient="records"))
# 输出：[{'name': 'Ada', 'score': 88}, {'name': 'Lin', 'score': 92}]
```

读文件时常用 `usecols`、`dtype`、`parse_dates`、`na_values` 控制成本和类型；导出时明确 `index=False`，避免把旧索引意外写成一列。

## 不常用但需要知道

### `resample` 时间重采样

```python
import pandas as pd

dates = pd.date_range("2026-01-01", periods=4, freq="D")
daily = pd.Series([10, 12, 9, 15], index=dates)
weekly = daily.resample("2D").sum()
print(weekly.tolist())
# 输出：[22, 24]
```

### `pd.cut` 与 `pd.qcut` 分箱

```python
import pandas as pd

scores = pd.Series([55, 72, 88, 96])
levels = pd.cut(scores, bins=[0, 60, 80, 100], labels=["C", "B", "A"])
quantiles = pd.qcut(scores, q=2, labels=["low", "high"])
print(levels.tolist(), quantiles.tolist())
# 输出：['C', 'B', 'A', 'A'] ['low', 'low', 'high', 'high']
```

### `explode` 展开列表列

```python
import pandas as pd

df = pd.DataFrame({"name": ["Ada", "Lin"], "skills": [["python", "sql"], ["java"]]})
exploded = df.explode("skills", ignore_index=True)
print(exploded.to_dict(orient="records"))
# 输出：[{'name': 'Ada', 'skills': 'python'}, {'name': 'Ada', 'skills': 'sql'}, {'name': 'Lin', 'skills': 'java'}]
```

### `pd.json_normalize` 展平嵌套记录

```python
import pandas as pd

records = [{"id": 1, "profile": {"city": "BJ"}}, {"id": 2, "profile": {"city": "SH"}}]
flat = pd.json_normalize(records)
print(flat.to_dict(orient="records"))
# 输出：[{'id': 1, 'profile.city': 'BJ'}, {'id': 2, 'profile.city': 'SH'}]
```

### `MultiIndex` 多级索引

```python
import pandas as pd

index = pd.MultiIndex.from_tuples([("A", "Jan"), ("A", "Feb"), ("B", "Jan")], names=["team", "month"])
series = pd.Series([10, 30, 20], index=index)
print(series.loc["A"].to_dict(), series.index.names)
# 输出：{'Jan': 10, 'Feb': 30} ['team', 'month']
```

### `select_dtypes` 按类型选列

```python
import pandas as pd

df = pd.DataFrame({"name": ["Ada"], "age": [36], "active": [True]})
numeric = df.select_dtypes(include="number")
print(numeric.columns.tolist())
# 输出：['age']
```

### `Categorical` 控制类别

```python
import pandas as pd

levels = pd.Categorical(["low", "high", "low"], categories=["low", "medium", "high"], ordered=True)
print(levels.min(), levels.max(), levels.categories.tolist())
# 输出：low high ['low', 'medium', 'high']
```

## 易混点

- `loc` 按标签、`iloc` 按位置；`loc` 的切片端点通常包含，`iloc` 的结束位置不包含。
- `merge` 按列或键连接，`join` 默认按索引，`concat` 只是拼接，三者不是同一个操作。
- `agg` 会减少每组行数，`transform` 保持原行数；想把组统计回填到原表时用 `transform`。
- `pivot` 要求组合唯一，重复数据应使用 `pivot_table` 指定聚合函数。
- Pandas 会按索引标签对齐 Series；给另一表赋值前先确认索引是否一致。
- 不要用已移除的 `DataFrame.append`；多个表顺序拼接使用 `pd.concat`。
- `apply` 是通用回退方案，不是默认的性能优化方案；优先找 `fillna`、`where`、`str`、`dt` 等向量化操作。

## 课后小问

1. `df.loc["Ada"]` 和 `df.iloc[0]` 有什么区别？
答案：前者按行标签选取，后者按第一行的位置选取。
解析：如果索引标签改变或不是整数，`iloc[0]` 仍表示第一行，而 `loc["Ada"]` 只有在标签存在且稳定时才有效。

2. 什么时候用 `transform` 而不是 `agg`？
答案：需要得到与原表等长、可直接赋回的组统计时用 `transform`。
解析：`agg` 将每组压缩为汇总行，`transform` 会把每组结果广播回组内每一行，例如计算每个员工相对团队均值的比例。

3. `merge`、`join`、`concat` 如何快速选择？
答案：按键匹配用 `merge`，按索引补列用 `join`，同结构表上下或左右拼接用 `concat`。
解析：先描述数据关系再选 API，不要把“追加几行”和“按 user_id 匹配”混为同一类操作。

## 本节小结

把 DataFrame 看作带标签的表，先检查 `shape`、`dtypes` 和缺失，再用 `loc`/`iloc` 定位。分组分析掌握 `agg` 与 `transform` 的行数差异，表关系掌握 `merge`/`join`/`concat`，数据布局掌握 `pivot_table` 与 `melt`，写文件时明确编码和索引策略。

## 快速回顾

```text
结构：Series / DataFrame / shape / dtypes
选择：[] / loc / iloc / filter / query
清洗：isna / fillna / dropna / astype / to_numeric / to_datetime
分析：sort_values / groupby / agg / transform / rolling
关系：merge / join / concat
布局：pivot_table / melt / explode
读写：read_csv / to_csv
```
