---
title: NumPy 数据处理速查
author: 阿源
date: 2026/09/27
categories:
 - Python进阶
tags:
 - python
 - numpy
---

# NumPy 数据处理速查

NumPy 的核心是 `ndarray`：同一数组中的元素通常拥有统一的 `dtype`，并通过向量化运算一次处理一批数据。本文以 NumPy 1.23+ 的稳定 API 为基线，代码也适用于 NumPy 2.x。

## 学习目标

- 能创建、检查、索引和变形多维数组。
- 能用布尔索引、广播、聚合和排序完成常见数据处理。
- 能使用新的 `np.random.Generator` 生成可复现实验数据。
- 能读写常见数组文件，并知道视图、拷贝和维度的边界。

## 核心知识点

`shape` 是每个轴的长度，`ndim` 是轴的数量，`size` 是元素总数；`dtype` 决定每个元素如何存储。把它们想成“表格的形状、层数、格子数和格子材质”即可。索引从 0 开始，`axis=0` 通常沿行方向聚合（结果保留列），`axis=1` 沿列方向聚合（结果保留行）。

广播是 NumPy 在形状不完全相同的数组之间对齐维度的规则：从末尾轴开始比较，长度相等或其中一个为 1 才能对齐。向量化表达式通常比 Python 循环更简洁，但并不意味着可以无限制地创建临时大数组。

## 常用用法

### `np.array` 与 `dtype`

```python
import numpy as np

scores = np.array([[80, 91], [76, 88]], dtype=np.float32)
print(scores.dtype, scores.shape, scores.ndim)
# 输出：float32 (2, 2) 2
```

`np.array` 会复制输入数据（除非明确使用了合适的选项），`dtype` 可以写成 `np.float32`、`np.int64` 等。整数和浮点数混合时，NumPy 会选择能容纳所有值的共同类型。

### `zeros`、`ones`、`full`、`arange` 与 `linspace`

```python
import numpy as np

empty = np.zeros((2, 3), dtype=np.float32)
filled = np.full((2, 2), 7)
steps = np.arange(0, 5, 2)
points = np.linspace(0, 1, 5)
print(empty.shape, filled.tolist(), steps.tolist(), points.tolist())
# 输出：(2, 3) [[7, 7], [7, 7]] [0, 2, 4] [0.0, 0.25, 0.5, 0.75, 1.0]
```

`arange` 按步长生成，浮点步长可能有累计误差；需要“固定个数且包含终点”时优先用 `linspace`。初始化大数组时显式指定 `dtype`，可以控制内存占用。

### 检查 `ndim`、`shape`、`size` 与 `itemsize`

```python
import numpy as np

matrix = np.arange(12, dtype=np.int32).reshape(3, 4)
print(matrix.ndim, matrix.shape, matrix.size, matrix.itemsize, matrix.nbytes)
# 输出：2 (3, 4) 12 4 48
```

`nbytes` 是数组元素实际占用的字节数，不包含 Python 对象本身的额外开销。调试形状时，先打印 `shape` 往往比打印整块数据更有用。

### 索引、切片与复制

```python
import numpy as np

matrix = np.arange(1, 10).reshape(3, 3)
row = matrix[1]
column = matrix[:, 0]
middle = matrix[:2, 1:]
copied = matrix.copy()
copied[0, 0] = 99
print(row.tolist(), column.tolist(), middle.tolist(), matrix[0, 0], copied[0, 0])
# 输出：[4, 5, 6] [1, 4, 7] [[2, 3], [5, 6]] 1 99
```

基础切片通常返回视图，修改切片可能影响原数组；需要独立数据时调用 `.copy()`。单个整数索引会减少一个轴，而切片会保留轴。

### 布尔索引与条件筛选

```python
import numpy as np

values = np.array([3, -1, 8, 0, 5])
positive = values[values > 0]
selected = values[(values >= 0) & (values < 6)]
print(positive.tolist(), selected.tolist())
# 输出：[3, 8, 5] [3, 0, 5]
```

组合条件要使用 `&`、`|`、`~`，并给每个条件加括号；Python 的 `and`、`or` 不能直接用于数组。

### `np.where` 做条件替换

```python
import numpy as np

temperatures = np.array([16, 22, 31, 27])
labels = np.where(temperatures >= 25, "hot", "mild")
clamped = np.where(temperatures < 18, 18, temperatures)
print(labels.tolist(), clamped.tolist())
# 输出：['mild', 'mild', 'hot', 'hot'] [18, 22, 31, 27]
```

只需要位置时可以写 `np.where(condition)`；提供第二、第三个参数时，它会逐元素选择真值或假值。

### 广播与向量化运算

```python
import numpy as np

prices = np.array([[10, 20, 30], [12, 18, 24]], dtype=np.float64)
tax_rate = np.array([1.1, 1.2, 1.3])
after_tax = prices * tax_rate
normalized = prices - prices.mean(axis=0)
print(after_tax.tolist())
# 输出：[[11.0, 24.0, 39.0], [13.2, 21.599999999999998, 31.200000000000003]]
print(normalized.mean(axis=0).tolist())
# 输出：[0.0, 0.0, 0.0]
```

`(2, 3)` 与 `(3,)` 可以广播，后者会按列对齐；不能广播的形状要先 `reshape`。浮点数显示的尾差是二进制浮点表示的正常现象。

### `reshape`、`ravel` 与 `flatten`

```python
import numpy as np

values = np.arange(12)
table = values.reshape(3, 4)
view_1d = table.ravel()
copy_1d = table.flatten()
view_1d[0] = 99
print(table.shape, table[0, 0], copy_1d[0])
# 输出：(3, 4) 99 0
```

`reshape` 只改变视图的形状（必要时可能复制），`ravel` 尽量返回视图，`flatten` 总是返回拷贝。使用 `-1` 可以让 NumPy 自动推导一个维度，例如 `reshape(-1, 2)`。

### `transpose` 与轴顺序

```python
import numpy as np

image = np.zeros((2, 3, 4), dtype=np.uint8)  # 高、宽、通道
channel_last = image.transpose(1, 2, 0)
same_as_transpose = image.T
print(image.shape, channel_last.shape, same_as_transpose.shape)
# 输出：(2, 3, 4) (3, 4, 2) (4, 3, 2)
```

`transpose(*axes)` 明确指定轴的新顺序；`.T` 适合二维矩阵，处理高维数组时也会反转所有轴，所以不应把它当作通用的“交换最后两轴”。

### `concatenate`、`stack` 与 `vstack`/`hstack`

```python
import numpy as np

left = np.array([[1, 2], [3, 4]])
right = np.array([[5, 6], [7, 8]])
joined = np.concatenate([left, right], axis=0)
columns = np.concatenate([left, right], axis=1)
new_axis = np.stack([left, right], axis=0)
print(joined.shape, columns.shape, new_axis.shape)
# 输出：(4, 2) (2, 4) (2, 2, 2)
```

`concatenate` 沿已有轴拼接，其他轴必须相等；`stack` 会新增一个轴。`vstack`/`hstack` 是更直观但规则略有不同的快捷写法，复杂形状优先使用带 `axis` 的函数。

### 聚合函数与 `axis`

```python
import numpy as np

scores = np.array([[80, 90, 70], [60, 88, 95]])
column_mean = scores.mean(axis=0)
row_max = scores.max(axis=1)
total = scores.sum()
print(column_mean.tolist(), row_max.tolist(), int(total))
# 输出：[70.0, 89.0, 82.5] [90, 95] 483
```

`axis=0` 压掉第 0 轴，留下列；`axis=1` 压掉第 1 轴，留下行。需要保留被聚合轴以便广播时使用 `keepdims=True`。

### `sort`、`argsort` 与 `argmax`

```python
import numpy as np

values = np.array([40, 10, 30, 20])
order = np.argsort(values)
sorted_values = np.sort(values)
best_index = np.argmax(values)
print(order.tolist(), sorted_values.tolist(), int(best_index), int(values[best_index]))
# 输出：[1, 3, 2, 0] [10, 20, 30, 40] 0 40
```

`sort` 返回排序后的副本，`argsort` 返回排序索引；需要同时重排多个数组时先保存索引再使用高级索引。数组方法 `.sort()` 会原地修改数组。

### `np.random.default_rng` 随机数生成器

```python
import numpy as np

rng = np.random.default_rng(42)
sample = rng.normal(loc=10, scale=2, size=4)
choice = rng.choice(["A", "B", "C"], size=3, replace=True)
print(sample.round(3).tolist(), choice.tolist())
# 输出：[10.609, 7.92, 11.501, 11.881] ['B', 'C', 'C']
```

优先使用 `default_rng(seed)`，不要在库代码中修改全局随机状态。固定种子只保证同一版本和同一算法路径下的可复现，不代表所有 NumPy 版本永远得到相同序列。

### `np.unique` 统计唯一值

```python
import numpy as np

labels = np.array(["cat", "dog", "cat", "bird", "dog"])
values, counts = np.unique(labels, return_counts=True)
print(values.tolist(), counts.tolist())
# 输出：['bird', 'cat', 'dog'] [1, 2, 2]
```

`return_index=True` 可得到首次出现位置，`return_inverse=True` 可把原数组编码为唯一值的下标，适合建立类别映射。

### `np.linalg` 基础线性代数

```python
import numpy as np

matrix = np.array([[2.0, 1.0], [1.0, 3.0]])
vector = np.array([5.0, 6.0])
solution = np.linalg.solve(matrix, vector)
determinant = np.linalg.det(matrix)
print(solution.round(4).tolist(), round(float(determinant), 4))
# 输出：[1.8, 1.4] 5.0
```

解方程优先使用 `np.linalg.solve(A, b)`，不要先求逆再相乘；求逆更慢且数值稳定性通常更差。矩阵乘法用 `@` 或 `np.matmul`，逐元素乘法用 `*`。

### `np.save`/`np.load` 与 `savetxt`/`loadtxt`

```python
from pathlib import Path
import tempfile
import numpy as np

scores = np.array([[80, 91], [76, 88]], dtype=np.int16)
with tempfile.TemporaryDirectory() as directory:
    binary_path = Path(directory) / "scores.npy"
    text_path = Path(directory) / "scores.txt"
    np.save(binary_path, scores)
    np.savetxt(text_path, scores, fmt="%d")
    restored = np.load(binary_path)
    text_restored = np.loadtxt(text_path, dtype=np.int16)
    print(restored.tolist(), text_restored.tolist())
# 输出：[[80, 91], [76, 88]] [[80, 91], [76, 88]]
```

`.npy` 保留形状和 `dtype`，适合 NumPy 自己读写；文本格式便于跨语言查看但体积更大、类型信息更少。读取不可信的 `.npy` 时不要随意打开 `allow_pickle=True`。

## 不常用但需要知道

低频函数不代表没有价值：它们常出现在性能优化、科学计算或数据管道中。下面保留最小可复制例子，遇到类似需求可以按标题检索。

### `np.einsum` 表达张量收缩

```python
import numpy as np

left = np.array([[1, 2], [3, 4]])
right = np.array([[5, 6], [7, 8]])
product = np.einsum("ik,kj->ij", left, right)
print(product.tolist())
# 输出：[[19, 22], [43, 50]]
```

### `np.take` 与 `np.put`

```python
import numpy as np

values = np.array([10, 20, 30, 40])
picked = np.take(values, [3, 0])
updated = values.copy()
np.put(updated, [1, 3], [99, 77])
print(picked.tolist(), updated.tolist())
# 输出：[40, 10] [10, 99, 30, 77]
```

### `np.array_split` 不等长切分

```python
import numpy as np

parts = np.array_split(np.arange(10), 3)
print([part.tolist() for part in parts])
# 输出：[[0, 1, 2, 3], [4, 5, 6], [7, 8, 9]]
```

### `np.meshgrid` 生成坐标网格

```python
import numpy as np

x = np.arange(3)
y = np.arange(2)
grid_x, grid_y = np.meshgrid(x, y)
print(grid_x.tolist(), grid_y.tolist())
# 输出：[[0, 1, 2], [0, 1, 2]] [[0, 0, 0], [1, 1, 1]]
```

### `np.clip` 限制数值范围

```python
import numpy as np

values = np.array([-2, 4, 9])
limited = np.clip(values, 0, 6)
print(limited.tolist())
# 输出：[0, 4, 6]
```

### `np.isclose` 比较浮点数

```python
import numpy as np

left = np.array([0.1 + 0.2, 1.0])
right = np.array([0.3, 1.0000001])
print(np.isclose(left, right, rtol=1e-6).tolist())
# 输出：[True, True]
```

### 结构化数组 `dtype`

```python
import numpy as np

people = np.array([("Ada", 36), ("Lin", 28)], dtype=[("name", "U8"), ("age", "i4")])
print(people["name"].tolist(), people["age"].tolist())
# 输出：['Ada', 'Lin'] [36, 28]
```

结构化数组适合与固定字段的低级数据交换；日常表格分析优先使用 Pandas DataFrame。

## 易混点

- `*` 是逐元素乘法，`@` 才是矩阵乘法；二维数组的 `.T` 不是“只交换最后两轴”。
- `axis=0`/`axis=1` 表示被压掉的轴，不是“第几列”或“第几行”的固定别名。
- 切片常常是视图，高级索引和布尔索引通常返回副本；不确定时用 `.copy()` 明确意图。
- `np.random.seed` 会影响全局状态，新的代码优先创建局部 `Generator`。
- `arange` 的终点通常不包含，`linspace` 默认包含终点；浮点步长不要用 `arange` 期待精确个数。
- `np.concatenate` 不会新增轴，`np.stack` 会新增轴；拼接前先检查 `shape`。

## 课后小问

1. 形状为 `(2, 3)` 的数组与形状为 `(3,)` 的数组相乘时，NumPy 按什么规则对齐？
答案：从最后一个轴开始对齐；`(3,)` 被视为 `(1, 3)`，因此可以按列广播。
解析：广播要求对应轴长度相等或有一方为 1。若第二个数组是 `(2,)`，最后一轴的 3 与 2 不兼容，需要先 reshape。

2. 为什么 `matrix[:, 0][0] = 99` 可能修改 `matrix`，而布尔筛选后的数组通常不会？
答案：基础切片通常返回视图，布尔索引通常创建副本。
解析：视图共享底层内存，副本拥有独立内存；需要确定隔离时显式调用 `.copy()`，不要依赖“看起来像新数组”。

3. 什么时候选择 `np.linalg.solve` 而不是 `np.linalg.inv`？
答案：求解 `Ax=b` 时直接使用 `solve`。
解析：`solve` 通常更快、更稳定，也避免显式构造逆矩阵；只有确实需要整个逆矩阵时才考虑 `inv`。

## 本节小结

先用 `shape`、`dtype` 建立数组心智模型，再按“索引/广播/变形/聚合/排序”的顺序处理数据。随机实验用 `default_rng`，线性方程用 `linalg.solve`，保存数组时根据是否需要保留类型选择二进制或文本格式。

## 快速回顾

```text
创建：np.array / zeros / ones / full / arange / linspace
选择：arr[i, j] / arr[mask] / np.where
变形：reshape / ravel / transpose / concatenate / stack
统计：sum / mean / min / max / argsort / unique
随机：np.random.default_rng(seed)
线性代数：@ / np.linalg.solve
持久化：np.save / np.load / np.savetxt / np.loadtxt
```
