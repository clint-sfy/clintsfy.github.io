---
title: Seaborn 统计绘图速查
author: 阿源
date: 2026/09/27
categories:
 - Python进阶
tags:
 - python
 - seaborn
---

# Seaborn 统计绘图速查

Seaborn 建立在 Matplotlib 之上，擅长用 DataFrame 的列名表达统计图。它负责默认主题、颜色和分组统计，底层仍可通过返回的 Axes 或 FacetGrid 继续用 Matplotlib 定制。本文使用现代稳定 API：`histplot`、`catplot`、`relplot`、`displot` 等替代旧的 `distplot`、`factorplot`。

## 学习目标

- 能用 Seaborn 的长表数据绘制关系图、分类图和分布图。
- 能理解 `hue`、`style`、`size`、`col` 等语义映射与分面参数。
- 能选择现代 API 并在返回对象上继续调整 Matplotlib 属性。
- 能避开旧 API 和不必要的全局状态，复制出稳定的统计图。

## 核心知识点

Seaborn 最适合“每一行是一条观测”的长表：列表示变量，`x`/`y` 指定坐标，`hue` 指定颜色分组，`style` 指定点型或线型，`size` 指定大小。`catplot`、`relplot`、`displot` 返回 `FacetGrid`，可以用 `col`、`row`、`col_wrap` 分面；`scatterplot`、`lineplot` 等返回单个 Axes。

统计图会进行聚合、估计或平滑，图形不一定等同于“原始点逐个画出”。报告中要说明聚合函数、误差线和样本量；探索性分析可以先用默认设置，再按需要明确配置。

## 常用用法

### `sns.set_theme` 设置主题

```python
import matplotlib.pyplot as plt
import seaborn as sns

sns.set_theme(style="whitegrid", context="notebook", palette="deep")
fig, ax = plt.subplots()
ax.plot([1, 2, 3], [1, 4, 9])
ax.set_title("Seaborn theme also affects Matplotlib")
fig.tight_layout()
plt.show()
# 图形结果：显示使用白色网格和 deep 调色板的折线图。
```

`set_theme` 会修改当前进程的 Matplotlib 样式；库函数中不要无条件调用它。需要局部样式时，可以用 `sns.axes_style` 或在应用入口统一配置。

### `sns.scatterplot` 关系散点图

```python
import matplotlib.pyplot as plt
import pandas as pd
import seaborn as sns

data = pd.DataFrame({
    "height": [160, 165, 170, 175, 180, 185],
    "weight": [52, 58, 63, 68, 76, 82],
    "group": ["A", "A", "B", "B", "A", "B"],
})
fig, ax = plt.subplots()
sns.scatterplot(data=data, x="height", y="weight", hue="group", style="group", s=80, ax=ax)
ax.set_title("Height and weight")
fig.tight_layout()
plt.show()
# 图形结果：按 group 使用颜色和点型区分身高与体重的观测点。
```

`data` 配合列名比先取数组更可读；`hue`、`style` 和 `size` 可以同时表达不同语义，但不要让图例超过读者可辨识范围。

### `sns.lineplot` 趋势线

```python
import matplotlib.pyplot as plt
import pandas as pd
import seaborn as sns

data = pd.DataFrame({
    "day": [1, 2, 3, 1, 2, 3],
    "sales": [10, 13, 15, 8, 12, 14],
    "store": ["A", "A", "A", "B", "B", "B"],
})
fig, ax = plt.subplots()
sns.lineplot(data=data, x="day", y="sales", hue="store", marker="o", ax=ax)
ax.set_title("Daily sales")
fig.tight_layout()
plt.show()
# 图形结果：按 store 显示两条带点标记的销售趋势线。
```

同一 x 值存在多条观测时，`lineplot` 默认会估计均值并显示不确定性；如果要逐条画原始轨迹，先整理数据或关闭聚合后再确认图例含义。

### `sns.barplot` 分类聚合

```python
import matplotlib.pyplot as plt
import pandas as pd
import seaborn as sns

data = pd.DataFrame({
    "team": ["A", "A", "B", "B"],
    "score": [80, 90, 70, 85],
})
fig, ax = plt.subplots()
sns.barplot(data=data, x="team", y="score", ax=ax)
ax.set_title("Average score by team")
fig.tight_layout()
plt.show()
# 图形结果：显示各 team 的平均 score 及默认误差线。
```

`barplot` 默认对每个类别聚合，柱子的高度不是每条原始记录。明确展示单个观测时使用 `stripplot` 或 `swarmplot`（数据量较大时注意重叠）。

### `sns.countplot` 类别计数

```python
import matplotlib.pyplot as plt
import pandas as pd
import seaborn as sns

data = pd.DataFrame({"status": ["ok", "ok", "warn", "error", "ok", "warn"]})
fig, ax = plt.subplots()
sns.countplot(data=data, x="status", order=["ok", "warn", "error"], ax=ax)
ax.set_ylabel("count")
fig.tight_layout()
plt.show()
# 图形结果：按指定顺序显示 ok、warn、error 的出现次数。
```

`countplot` 直接统计类别频数；如果已经有一个数值列表示计数，应使用 `barplot` 或 Matplotlib `bar`，避免重复计数。

### `sns.boxplot` 箱线图

```python
import matplotlib.pyplot as plt
import pandas as pd
import seaborn as sns

data = pd.DataFrame({
    "team": ["A", "A", "A", "B", "B", "B"],
    "score": [70, 80, 95, 65, 75, 90],
})
fig, ax = plt.subplots()
sns.boxplot(data=data, x="team", y="score", ax=ax)
ax.set_title("Score spread")
fig.tight_layout()
plt.show()
# 图形结果：用中位数、四分位数和须展示两个 team 的分数分布。
```

箱线图适合比较分布位置和离群点，不应只把箱体高度解释为均值。

### `sns.violinplot` 小提琴图

```python
import matplotlib.pyplot as plt
import pandas as pd
import seaborn as sns

data = pd.DataFrame({
    "team": ["A", "A", "A", "A", "B", "B", "B", "B"],
    "score": [70, 72, 85, 95, 65, 76, 88, 90],
})
fig, ax = plt.subplots()
sns.violinplot(data=data, x="team", y="score", inner="quartile", cut=0, ax=ax)
ax.set_title("Score density")
fig.tight_layout()
plt.show()
# 图形结果：用核密度形状并叠加四分位线比较两个 team 的分布。
```

小提琴图会进行核密度估计，样本很少时形状不稳定；配合 `inner="quartile"` 或叠加原始点更容易解释。

### `sns.histplot` 分布直方图

```python
import matplotlib.pyplot as plt
import numpy as np
import seaborn as sns

rng = np.random.default_rng(5)
values = rng.normal(0, 1, 300)
fig, ax = plt.subplots()
sns.histplot(values, bins=20, kde=True, ax=ax)
ax.set_xlabel("value")
ax.set_title("Distribution")
fig.tight_layout()
plt.show()
# 图形结果：显示数值的直方图并叠加核密度曲线。
```

`histplot` 取代旧的 `distplot`；`bins` 控制分箱，`kde=True` 只是额外叠加平滑估计，不能把曲线当成原始频数。

### `sns.kdeplot` 核密度估计

```python
import matplotlib.pyplot as plt
import numpy as np
import seaborn as sns

rng = np.random.default_rng(12)
first = rng.normal(-1, 0.7, 150)
second = rng.normal(1, 0.5, 150)
fig, ax = plt.subplots()
sns.kdeplot(first, fill=True, alpha=0.3, label="first", ax=ax)
sns.kdeplot(second, fill=True, alpha=0.3, label="second", ax=ax)
ax.legend()
ax.set_title("Kernel density")
fig.tight_layout()
plt.show()
# 图形结果：叠加显示两组样本的核密度估计和图例。
```

带宽会影响曲线平滑程度；对离散值、极少样本或有硬边界的数据，直方图或 ECDF 可能更可靠。

### `sns.ecdfplot` 经验累积分布

```python
import matplotlib.pyplot as plt
import pandas as pd
import seaborn as sns

data = pd.DataFrame({
    "score": [55, 62, 70, 70, 81, 90],
    "group": ["A", "A", "A", "B", "B", "B"],
})
fig, ax = plt.subplots()
sns.ecdfplot(data=data, x="score", hue="group", ax=ax)
ax.set_title("Empirical CDF")
fig.tight_layout()
plt.show()
# 图形结果：比较两组分数达到各阈值的累计比例。
```

ECDF 不需要分箱或带宽，适合回答“低于某个阈值的比例是多少”这类问题。

### `sns.heatmap` 矩阵热图

```python
import matplotlib.pyplot as plt
import pandas as pd
import seaborn as sns

matrix = pd.DataFrame(
    [[1.0, 0.4, -0.2], [0.4, 1.0, 0.6], [-0.2, 0.6, 1.0]],
    index=["a", "b", "c"],
    columns=["a", "b", "c"],
)
fig, ax = plt.subplots()
sns.heatmap(matrix, annot=True, fmt=".1f", cmap="vlag", center=0, ax=ax)
ax.set_title("Correlation-like matrix")
fig.tight_layout()
plt.show()
# 图形结果：用颜色和单元格文本展示带行列标签的三乘三矩阵。
```

相关矩阵常用 `center=0` 的发散色图；不要让色阶范围被少量极端值完全占据，必要时明确 `vmin`、`vmax`。

### `sns.pairplot` 成对关系

```python
import pandas as pd
import seaborn as sns
import matplotlib.pyplot as plt

data = pd.DataFrame({
    "height": [160, 165, 170, 175, 180],
    "weight": [52, 58, 63, 68, 76],
    "age": [20, 22, 25, 28, 31],
    "group": ["A", "A", "B", "B", "A"],
})
grid = sns.pairplot(data, vars=["height", "weight", "age"], hue="group", corner=True)
grid.fig.suptitle("Pairwise relationships", y=1.02)
plt.show()
# 图形结果：以矩阵形式展示多个数值变量的成对关系，并按 group 着色。
```

`pairplot` 会快速生成很多子图，变量多或样本大时成本较高；先选择少量关键列，并用 `corner=True` 减少重复面板。

### `sns.catplot` 分类分面

```python
import pandas as pd
import seaborn as sns
import matplotlib.pyplot as plt

data = pd.DataFrame({
    "team": ["A", "A", "B", "B", "A", "B"],
    "score": [80, 90, 70, 85, 88, 78],
    "phase": ["train", "test", "train", "test", "train", "test"],
})
grid = sns.catplot(data=data, x="team", y="score", col="phase", kind="box", height=3, aspect=0.9)
grid.set_axis_labels("team", "score")
plt.show()
# 图形结果：按 phase 分面显示各 team 的分数箱线图。
```

`catplot` 是分类图的分面入口，`kind` 可以选择 `strip`、`swarm`、`box`、`violin`、`bar` 等；它返回 FacetGrid，不要把它当作单个 Axes 使用。

### `sns.relplot` 关系分面

```python
import pandas as pd
import seaborn as sns
import matplotlib.pyplot as plt

data = pd.DataFrame({
    "day": [1, 2, 3, 1, 2, 3],
    "sales": [10, 13, 15, 8, 12, 14],
    "store": ["A", "A", "A", "B", "B", "B"],
    "channel": ["online", "online", "offline", "online", "offline", "offline"],
})
grid = sns.relplot(data=data, x="day", y="sales", hue="store", col="channel", kind="line", marker="o")
grid.set_axis_labels("day", "sales")
plt.show()
# 图形结果：按 channel 分面并按 store 区分两组销售趋势。
```

`relplot` 是 `scatterplot`/`lineplot` 的分面入口；`kind` 决定每个面板中使用散点还是线图。

### `sns.displot` 分布分面

```python
import pandas as pd
import seaborn as sns
import matplotlib.pyplot as plt

data = pd.DataFrame({
    "score": [55, 62, 70, 70, 81, 90, 65, 77],
    "group": ["A", "A", "A", "A", "B", "B", "B", "B"],
})
grid = sns.displot(data=data, x="score", col="group", kind="hist", bins=5, height=3)
grid.set_axis_labels("score", "count")
plt.show()
# 图形结果：按 group 分面显示分数直方图。
```

`displot` 是 `histplot`/`kdeplot`/`ecdfplot` 的分面入口，使用 `kind` 选择分布图类型；它替代旧的 `distplot` 分面需求。

## 不常用但需要知道

### `sns.stripplot` 叠加原始观测

```python
import matplotlib.pyplot as plt
import pandas as pd
import seaborn as sns

data = pd.DataFrame({"team": ["A", "A", "A", "B", "B", "B"], "score": [70, 80, 95, 65, 75, 90]})
fig, ax = plt.subplots()
sns.boxplot(data=data, x="team", y="score", ax=ax)
sns.stripplot(data=data, x="team", y="score", color="black", alpha=0.55, jitter=0.12, ax=ax)
fig.tight_layout()
plt.show()
# 图形结果：在箱线图上叠加每条原始观测，便于查看样本量和离群点。
```

### `sns.swarmplot` 避免点重叠

```python
import matplotlib.pyplot as plt
import pandas as pd
import seaborn as sns

data = pd.DataFrame({"team": ["A", "A", "A", "B", "B", "B"], "score": [70, 80, 95, 65, 75, 90]})
fig, ax = plt.subplots()
sns.swarmplot(data=data, x="team", y="score", size=6, ax=ax)
fig.tight_layout()
plt.show()
# 图形结果：以自动避让的点展示两个类别的原始观测。
```

样本很多时 `swarmplot` 可能变慢或挤在一起，使用透明度较低的 `stripplot` 更经济。

### `sns.jointplot` 联合分布

```python
import pandas as pd
import seaborn as sns
import matplotlib.pyplot as plt

data = pd.DataFrame({"x": [1, 2, 3, 4, 5], "y": [2, 1, 4, 3, 5]})
grid = sns.jointplot(data=data, x="x", y="y", kind="scatter", marginal_kws={"bins": 4})
grid.fig.suptitle("Joint distribution", y=1.02)
plt.show()
# 图形结果：中央显示散点关系，顶部和右侧显示两个变量的边际分布。
```

### `sns.despine` 清理边框

```python
import matplotlib.pyplot as plt
import seaborn as sns

fig, ax = plt.subplots()
ax.plot([1, 2, 3], [1, 4, 9])
sns.despine(ax=ax, right=True, top=True)
fig.tight_layout()
plt.show()
# 图形结果：显示去掉右侧和顶部边框的简洁折线图。
```

### 使用返回的 Axes 继续定制

```python
import matplotlib.pyplot as plt
import pandas as pd
import seaborn as sns

data = pd.DataFrame({"x": [1, 2, 3], "y": [2, 4, 3]})
ax = sns.scatterplot(data=data, x="x", y="y")
ax.set(xlim=(0, 4), ylim=(0, 5), title="Customized Axes")
ax.figure.tight_layout()
plt.show()
# 图形结果：显示通过返回的 Axes 设置范围和标题的散点图。
```

## 易混点

- `histplot` 是现代直方图入口，`distplot` 已废弃；`catplot` 取代 `factorplot` 的分类分面场景。
- `barplot` 默认聚合均值，`countplot` 统计行数；已有计数列时不要再次使用 `countplot`。
- `scatterplot`/`lineplot` 返回 Axes，`relplot` 返回 FacetGrid；分面对象要通过 `.set_axis_labels` 或 `.fig` 定制。
- `hue` 是颜色语义，不等于“给图上色”；颜色分组要在图例中解释类别顺序。
- `kdeplot` 会平滑估计，`ecdfplot` 不分箱，`histplot` 展示分箱频数；三者回答的问题不同。
- `sns.set_theme` 会影响 Matplotlib 全局样式；在可复用库函数里不要隐式修改全局状态。
- 不要把旧式 Notebook 魔法或网络数据集加载混进可复制代码，示例数据应在代码块内可重建。

## 课后小问

1. 为什么 `barplot` 的柱高不一定等于某一条原始记录？
答案：`barplot` 默认按类别聚合数值列，柱高通常是均值并伴随误差估计。
解析：要展示每条记录应使用 `stripplot`/`swarmplot` 或直接使用散点图；要展示已有计数则准备好计数列后使用柱状图。

2. `relplot` 和 `scatterplot` 该如何选择？
答案：单个坐标轴用 `scatterplot`，需要按 `row`/`col` 分面或统一管理多个关系图时用 `relplot`。
解析：前者返回 Axes，后者返回 FacetGrid；返回对象不同决定了后续定制方法也不同。

3. 什么时候 ECDF 比 KDE 更合适？
答案：需要避免带宽和分箱假设，或想直接读取阈值累计比例时使用 ECDF。
解析：KDE 是平滑估计，带宽会改变形状；ECDF 直接基于经验样本，适合小样本和阈值比较。

## 本节小结

Seaborn 的核心是“长表 + 语义映射 + 返回对象定制”。单图使用 `scatterplot`、`lineplot`、分类图和分布图；需要分面时选择 `relplot`、`catplot`、`displot`。牢记 `histplot` 替代 `distplot`、`catplot` 替代 `factorplot`，并解释统计聚合和不确定性。

## 快速回顾

```text
主题：sns.set_theme
关系：scatterplot / lineplot / relplot
分类：barplot / countplot / boxplot / violinplot / catplot
分布：histplot / kdeplot / ecdfplot / displot
矩阵：heatmap / pairplot
对象：Axes、FacetGrid、grid.fig
旧 API：不要使用 distplot、factorplot
```
