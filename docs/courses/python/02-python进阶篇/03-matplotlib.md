---
title: Matplotlib 绘图速查
author: 阿源
date: 2026/09/27
categories:
 - Python进阶
tags:
 - python
 - matplotlib
---

# Matplotlib 绘图速查

Matplotlib 是 Python 的通用绘图库。现代代码优先使用面向对象接口：创建 `Figure`（整张画布）和 `Axes`（一个坐标轴），再在 `Axes` 上调用 `plot`、`scatter`、`bar` 等方法。`pyplot` 适合快速脚本，但不要依赖隐式的全局当前坐标轴。

## 学习目标

- 能创建 Figure/Axes，并完成线图、散点图、柱状图和直方图。
- 能设置标题、坐标轴、图例、样式和注释。
- 能用 `subplots` 管理多图，并把结果保存为图片。
- 能理解 `Figure`、`Axes`、`Axis` 和绘图对象的关系。

## 核心知识点

`Figure` 是容器，`Axes` 是真正绘图的坐标区域；`Axis` 是 x/y 轴对象。推荐写成 `fig, ax = plt.subplots()`，所有绘图和配置都通过 `ax` 完成，最后统一 `fig.tight_layout()` 和 `plt.show()`。一个 Figure 可以有多个 Axes，一个 Axes 可以包含多条线或多个图元。

绘图代码应区分“数据变换”和“视觉设置”：先准备 x/y 数据，再明确标签、单位和图例。默认颜色和样式适合探索，但报告或复现任务应显式指定关键配置并保存原始数据处理逻辑。

## 常用用法

### `plt.subplots` 创建 Figure 和 Axes

```python
import matplotlib.pyplot as plt

fig, ax = plt.subplots(figsize=(5, 3))
ax.set_title("Demo")
ax.set_xlabel("x")
ax.set_ylabel("y")
fig.tight_layout()
plt.show()
# 图形结果：显示一张带标题和坐标轴标签的空白坐标图。
```

`figsize` 使用英寸；需要多图时可以给 `nrows`、`ncols`。保存或嵌入应用时保留 `fig` 引用，比依赖 `plt.gca()` 更容易测试。

### `Axes.plot` 线图

```python
import numpy as np
import matplotlib.pyplot as plt

x = np.linspace(0, 2 * np.pi, 100)
fig, ax = plt.subplots()
ax.plot(x, np.sin(x), label="sin(x)", color="tab:blue", linewidth=2)
ax.plot(x, np.cos(x), label="cos(x)", linestyle="--", color="tab:orange")
ax.set_xlabel("radians")
ax.set_ylabel("value")
ax.legend()
fig.tight_layout()
plt.show()
# 图形结果：同一坐标轴上显示正弦和余弦两条带图例的曲线。
```

`plot(x, y)` 要求 x、y 长度匹配。`label` 只有配合 `legend()` 才会显示；线型、颜色和宽度可以用关键字参数控制。

### `Axes.scatter` 散点图

```python
import numpy as np
import matplotlib.pyplot as plt

rng = np.random.default_rng(7)
x = rng.normal(size=30)
y = 0.6 * x + rng.normal(scale=0.4, size=30)
fig, ax = plt.subplots()
ax.scatter(x, y, s=45, alpha=0.75, c=y, cmap="viridis")
ax.set_xlabel("feature")
ax.set_ylabel("target")
fig.tight_layout()
plt.show()
# 图形结果：显示带透明度和颜色映射的散点分布图。
```

`s` 是点面积，`alpha` 控制透明度；`c` 可以传入与点数量相同的数值并配合 `cmap` 表示第三个变量。需要颜色条时调用 `fig.colorbar`。

### `Axes.bar` 柱状图

```python
import matplotlib.pyplot as plt

labels = ["Python", "Java", "Go"]
counts = [88, 64, 42]
fig, ax = plt.subplots()
bars = ax.bar(labels, counts, color=["tab:blue", "tab:orange", "tab:green"])
ax.bar_label(bars, fmt="%d")
ax.set_ylabel("answers")
ax.set_title("Language survey")
fig.tight_layout()
plt.show()
# 图形结果：显示三个类别的垂直柱，并在柱顶标注数值。
```

类别比较使用 `bar`，时间连续趋势通常使用 `plot`。横向柱可使用 `barh`，类别很多时标签更容易阅读。

### `Axes.hist` 直方图

```python
import numpy as np
import matplotlib.pyplot as plt

rng = np.random.default_rng(10)
values = rng.normal(loc=70, scale=8, size=500)
fig, ax = plt.subplots()
ax.hist(values, bins=20, edgecolor="white", alpha=0.85)
ax.set_xlabel("score")
ax.set_ylabel("count")
ax.set_title("Score distribution")
fig.tight_layout()
plt.show()
# 图形结果：按区间显示分数的频数分布。
```

`bins` 控制分箱数量或边界；`density=True` 会把纵轴归一化为密度，不能再直接解读成样本数。

### `subplots` 多图布局

```python
import numpy as np
import matplotlib.pyplot as plt

x = np.linspace(0, 1, 50)
fig, axes = plt.subplots(1, 2, figsize=(8, 3), sharex=True)
axes[0].plot(x, x ** 2)
axes[0].set_title("square")
axes[1].plot(x, np.sqrt(x), color="tab:orange")
axes[1].set_title("square root")
for ax in axes:
    ax.set_xlabel("x")
    ax.grid(alpha=0.25)
fig.tight_layout()
plt.show()
# 图形结果：并排显示平方和平方根两张共享 x 轴的子图。
```

当只有一个子图时 `axes` 是一个 Axes；多个子图时通常是数组。需要统一处理时可以用 `np.asarray(axes).ravel()`，或在创建时设置 `squeeze=False`。

### 标题、标签、范围与刻度

```python
import matplotlib.pyplot as plt

fig, ax = plt.subplots()
ax.plot([1, 2, 3], [2, 4, 3])
ax.set(title="Weekly sales", xlabel="week", ylabel="orders")
ax.set_xlim(1, 3)
ax.set_ylim(0, 5)
ax.set_xticks([1, 2, 3], labels=["Mon", "Tue", "Wed"])
fig.tight_layout()
plt.show()
# 图形结果：显示带范围和自定义刻度标签的折线图。
```

用 `set_*` 方法配置明确的 Axes；`plt.xlabel` 等状态式函数仍可用，但在多图代码中容易设置错当前坐标轴。

### 图例与网格

```python
import matplotlib.pyplot as plt

fig, ax = plt.subplots()
ax.plot([1, 2, 3], [1, 4, 9], label="observed")
ax.plot([1, 2, 3], [2, 4, 8], label="predicted", linestyle="--")
ax.legend(loc="upper left", frameon=False)
ax.grid(axis="y", linestyle=":", alpha=0.5)
fig.tight_layout()
plt.show()
# 图形结果：显示两条曲线、左上角图例和水平参考网格。
```

图例位置可用字符串或坐标控制；不要为了“好看”让网格线遮挡数据，通常设置较低的 `alpha` 即可。

### `plt.style.context` 临时切换样式

```python
import matplotlib.pyplot as plt

with plt.style.context("seaborn-whitegrid"):
    fig, ax = plt.subplots()
    ax.plot([0, 1, 2], [0, 1, 4], marker="o")
    ax.set_title("Temporary style")
    fig.tight_layout()
    plt.show()
# 图形结果：只在上下文中使用白色网格样式绘制带标记的折线图。
```

样式上下文离开后会恢复之前的全局设置；项目级脚本也可以使用 `plt.style.use`，但应在入口处统一设置一次。

### `annotate` 添加注释

```python
import matplotlib.pyplot as plt

fig, ax = plt.subplots()
x = [1, 2, 3]
y = [3, 5, 4]
ax.plot(x, y, marker="o")
ax.annotate("peak", xy=(2, 5), xytext=(2.2, 5.5), arrowprops={"arrowstyle": "->"})
ax.set_xlim(0.8, 3.5)
fig.tight_layout()
plt.show()
# 图形结果：在最高点旁显示带箭头的 peak 注释。
```

`xy` 是被标注数据点，`xytext` 是文本位置；坐标默认使用数据坐标。注释应服务于读者理解，避免每个点都堆叠文字。

### `savefig` 保存图片

```python
from pathlib import Path
import tempfile
import matplotlib.pyplot as plt

with tempfile.TemporaryDirectory() as directory:
    path = Path(directory) / "trend.png"
    fig, ax = plt.subplots(figsize=(4, 3))
    ax.plot([1, 2, 3], [1, 4, 9])
    fig.savefig(path, dpi=150, bbox_inches="tight")
    print(path.suffix, path.exists())
# 输出：.png True
```

先 `tight_layout` 或在 `savefig` 使用 `bbox_inches="tight"` 再保存，避免标签被裁切。`dpi` 影响栅格图片清晰度，矢量输出可以使用 `.svg` 或 `.pdf`。

## 不常用但需要知道

### `twinx` 双 y 轴

```python
import matplotlib.pyplot as plt

fig, ax_left = plt.subplots()
ax_right = ax_left.twinx()
ax_left.plot([1, 2, 3], [10, 20, 15], color="tab:blue")
ax_right.plot([1, 2, 3], [0.2, 0.5, 0.4], color="tab:orange")
ax_left.set_ylabel("orders", color="tab:blue")
ax_right.set_ylabel("rate", color="tab:orange")
fig.tight_layout()
plt.show()
# 图形结果：一张图中用左右两个 y 轴显示不同量纲的两条曲线。
```

双轴容易让读者误判相关性；能标准化到同一量纲时优先使用子图或第二个面板。

### `errorbar` 误差线

```python
import matplotlib.pyplot as plt

fig, ax = plt.subplots()
ax.errorbar([1, 2, 3], [10, 12, 11], yerr=[1, 0.8, 1.2], fmt="o-", capsize=4)
ax.set_xlabel("experiment")
ax.set_ylabel("mean ± error")
fig.tight_layout()
plt.show()
# 图形结果：显示带垂直误差线和端帽的实验均值。
```

误差线必须在图注或数据说明中解释是标准差、置信区间还是测量误差。

### `fill_between` 填充区间

```python
import numpy as np
import matplotlib.pyplot as plt

x = np.linspace(0, 1, 50)
mean = x ** 2
spread = 0.1 * (1 - x)
fig, ax = plt.subplots()
ax.plot(x, mean, label="mean")
ax.fill_between(x, mean - spread, mean + spread, alpha=0.2, label="interval")
ax.legend()
fig.tight_layout()
plt.show()
# 图形结果：显示均值曲线及其上下不确定性带。
```

### `imshow` 与 `colorbar` 热图

```python
import numpy as np
import matplotlib.pyplot as plt

matrix = np.array([[1, 2, 3], [3, 2, 1]])
fig, ax = plt.subplots()
image = ax.imshow(matrix, cmap="viridis", aspect="auto")
fig.colorbar(image, ax=ax, label="value")
ax.set_xlabel("column")
ax.set_ylabel("row")
fig.tight_layout()
plt.show()
# 图形结果：以颜色深浅展示二维矩阵，并在右侧显示颜色刻度条。
```

### `rc_context` 局部参数

```python
import matplotlib.pyplot as plt

with plt.rc_context({"font.size": 12, "axes.titlesize": 14}):
    fig, ax = plt.subplots()
    ax.plot([1, 2], [1, 4])
    ax.set_title("Local font settings")
    fig.tight_layout()
    plt.show()
# 图形结果：只在上下文中使用放大的字体绘制折线图。
```

`rc_context` 适合单张图或局部报告配置；团队项目要统一风格时可以集中设置 rcParams 或样式文件。

### `GridSpec` 不规则布局

```python
import matplotlib.pyplot as plt

fig = plt.figure(figsize=(6, 3))
grid = fig.add_gridspec(1, 2, width_ratios=[2, 1])
left = fig.add_subplot(grid[0, 0])
right = fig.add_subplot(grid[0, 1])
left.plot([1, 2, 3], [1, 4, 9])
right.bar(["A", "B"], [3, 5])
fig.tight_layout()
plt.show()
# 图形结果：显示一个宽度为右侧两倍的折线图和柱状图组合布局。
```

## 易混点

- `Figure` 是画布，`Axes` 是坐标区域；绘图方法应优先调用 `ax.plot` 而不是依赖当前状态。
- `plt.show()` 负责显示，`fig.savefig()` 负责保存；保存前要设置布局，显示后不要假定仍能修改同一窗口。
- `scatter` 的 `s` 是面积，`plot` 的 `linewidth` 是线宽；两者视觉大小不是同一单位。
- `bar` 比较离散类别，`hist` 统计连续数值的分箱频数，不能仅凭“都有柱子”互换。
- 多子图时先确认 `axes` 是单个 Axes 还是数组；`squeeze=False` 可以统一成二维数组。
- 样式和字体是全局或上下文状态，库函数不应偷偷修改调用者的全局 rcParams。

## 课后小问

1. 为什么推荐 `fig, ax = plt.subplots()` 而不是到处调用 `plt.plot()`？
答案：面向对象接口明确指定绘图目标，多个子图时不容易把配置应用到错误的坐标轴。
解析：`pyplot` 是状态式 API，会依赖当前 Figure/Axes；显式持有 `ax` 更容易复用、测试和保存。

2. `bar`、`hist` 和 `plot` 应如何选择？
答案：离散类别比较用 `bar`，连续变量分布用 `hist`，有序趋势或连续关系用 `plot`。
解析：图形的形状不是选择依据，数据的语义和横轴类型才是；错误的图形会让读者误解数据。

3. 如何避免保存的图裁掉标签？
答案：绘制完成后调用 `fig.tight_layout()`，保存时可补充 `bbox_inches="tight"`。
解析：布局计算要在标签和图例都创建后进行；`bbox_inches` 是最后一道边界裁剪保障，但不能替代合理的画布大小。

## 本节小结

Matplotlib 的稳定套路是“创建 Figure/Axes → 在 Axes 上绘图 → 设置语义标签和样式 → tight_layout → show/savefig”。掌握四类基础图，再用子图、误差带、注释和颜色条表达不确定性与额外变量。

## 快速回顾

```text
画布：fig, ax = plt.subplots()
基础图：ax.plot / scatter / bar / hist
布局：plt.subplots / GridSpec / tight_layout
说明：set_title / set_xlabel / set_ylabel / legend / annotate
样式：plt.style.context / rc_context
保存：fig.savefig(path, dpi=..., bbox_inches="tight")
```
