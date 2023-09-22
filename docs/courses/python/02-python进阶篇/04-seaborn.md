---
title: seaborn基础
author: 阿源
date: 2023/05/05 21:29
categories:
 - Python进阶
tags:
 - python
 - seaborn
---
# Seaborn基础
## Seaborn

### 1. 基础风格

```python
import seaborn as sns
import numpy as np
import matplotlib as mpl
import matplotlib.pyplot as plt
%matplotlib inline
def sinplot(flip=1):
    x = np.linspace(0, 14, 100)
    for i in range(1, 7):
        plt.plot(x, np.sin(x + i * .5) * (7 - i) * flip)
```

```
5种主题风格
* darkgrid
* whitegrid
* dark
* white
* ticks
```

```python
sns.set_style("whitegrid")
data = np.random.normal(size=(20, 6)) + np.arange(6) / 2
sns.boxplot(data=data)
```

![](https://cdn.jsdelivr.net/gh/clint-sfy/blogcdn@master/python/seaborn/风格1.png)

```python
sns.set_style("dark")
sinplot()
```

![](https://cdn.jsdelivr.net/gh/clint-sfy/blogcdn@master/python/seaborn/风格2.png)

```python
sns.set_style("white")
sinplot()
```

![](https://cdn.jsdelivr.net/gh/clint-sfy/blogcdn@master/python/seaborn/风格3.png)

```python
sns.set_style("ticks")
sinplot()
```

![](https://cdn.jsdelivr.net/gh/clint-sfy/blogcdn@master/python/seaborn/风格4.png)

```python
sinplot()
sns.despine() # 不要上框线和右框线
sns.despine(offset=10) # 设置图距离下面的距离
sns.despine(left=True) # 不要左框线

```

```python
# 上下两个图  用两个不同的主题
with sns.axes_style("darkgrid"):
    plt.subplot(211)
    sinplot()
plt.subplot(212)
sinplot(-1)
```

```python
sns.set_context("paper")
plt.figure(figsize=(8, 6))
sinplot()

sns.set_context("talk")

sns.set_context("poster")

sns.set_context("notebook", font_scale=1.5, rc={"lines.linewidth": 2.5}) # 这个还行
```

### 2. 调色

* 颜色很重要
* color_palette()能传入任何Matplotlib所支持的颜色
* color_palette()不写参数则默认颜色
* set_palette()设置所有图的颜色

```python
import numpy as np
import seaborn as sns
import matplotlib.pyplot as plt
%matplotlib inline
sns.set(rc={"figure.figsize": (6, 6)})

current_palette = sns.color_palette()
sns.palplot(current_palette)
```

![](https://cdn.jsdelivr.net/gh/clint-sfy/blogcdn@master/python/seaborn/调色1.png)

6个默认的颜色循环主题： deep, muted, pastel, bright, dark, colorblind

#### 圆形画板

当你有六个以上的分类要区分时，最简单的方法就是在一个圆形的颜色空间中画出均匀间隔的颜色(这样的色调会保持亮度和饱和度不变)。这是大多数的当他们需要使用比当前默认颜色循环中设置的颜色更多时的默认方案。

最常用的方法是使用hls的颜色空间，这是RGB值的一个简单转换。

```python
sns.palplot(sns.color_palette("hls", 8))
```

![](https://cdn.jsdelivr.net/gh/clint-sfy/blogcdn@master/python/seaborn/调色2.png)

```python
data = np.random.normal(size=(20, 8)) + np.arange(8) / 2
sns.boxplot(data=data,palette=sns.color_palette("hls", 8))
```

```
hls_palette()函数来控制颜色的亮度和饱和
* l-亮度 lightness 
* s-饱和 saturation
```

```python
sns.palplot(sns.hls_palette(8, l=.7, s=.9))
```

![](https://cdn.jsdelivr.net/gh/clint-sfy/blogcdn@master/python/seaborn/调色3.png)

```python
sns.palplot(sns.color_palette("Paired",8))
```

![](https://cdn.jsdelivr.net/gh/clint-sfy/blogcdn@master/python/seaborn/调色4.png)

####  使用xkcd颜色来命名颜色 ###
xkcd包含了一套众包努力的针对随机RGB色的命名。产生了954个可以随时通过xdcd_rgb字典中调用的命名颜色。

```python
plt.plot([0, 1], [0, 1], sns.xkcd_rgb["pale red"], lw=3)
plt.plot([0, 1], [0, 2], sns.xkcd_rgb["medium green"], lw=3)
plt.plot([0, 1], [0, 3], sns.xkcd_rgb["denim blue"], lw=3)
```

![](https://cdn.jsdelivr.net/gh/clint-sfy/blogcdn@master/python/seaborn/调色5.png)

```python
colors = ["windows blue", "amber", "greyish", "faded green", "dusty purple"]
sns.palplot(sns.xkcd_palette(colors))
```

![](https://cdn.jsdelivr.net/gh/clint-sfy/blogcdn@master/python/seaborn/调色6.png)

####  连续色板
色彩随数据变换，比如数据越来越重要则颜色越来越深

```python
sns.palplot(sns.color_palette("Blues"))
```

![](https://cdn.jsdelivr.net/gh/clint-sfy/blogcdn@master/python/seaborn/调色7.png)

```python
# 如果想要翻转渐变，可以在面板名称中添加一个_r后缀
sns.palplot(sns.color_palette("BuGn_r"))
```

![](https://cdn.jsdelivr.net/gh/clint-sfy/blogcdn@master/python/seaborn/调色8.png)

#### cubehelix_palette()调色板
色调线性变换

```python
sns.palplot(sns.color_palette("cubehelix", 8))
sns.palplot(sns.cubehelix_palette(8, start=.5, rot=-.75))
sns.palplot(sns.cubehelix_palette(8, start=.75, rot=-.150))
```

![](https://cdn.jsdelivr.net/gh/clint-sfy/blogcdn@master/python/seaborn/调色9.png)

####  light_palette() 和dark_palette()调用定制连续调色板

```python
sns.palplot(sns.light_palette("green"))
sns.palplot(sns.dark_palette("purple"))
sns.palplot(sns.light_palette("navy", reverse=True))
```

![](https://cdn.jsdelivr.net/gh/clint-sfy/blogcdn@master/python/seaborn/调色10.png)

```python
sns.palplot(sns.light_palette((210, 90, 60), input="husl"))
```

![](https://cdn.jsdelivr.net/gh/clint-sfy/blogcdn@master/python/seaborn/调色11.png)

### 3. 单变量分析绘图

```python
%matplotlib inline
import numpy as np
import pandas as pd
from scipy import stats, integrate
import matplotlib.pyplot as plt

import seaborn as sns
sns.set(color_codes=True)
np.random.seed(sum(map(ord, "distributions")))
```

```python
x = np.random.normal(size=100)
sns.distplot(x,kde=False)

sns.distplot(x, bins=20, kde=False)
```

![](https://cdn.jsdelivr.net/gh/clint-sfy/blogcdn@master/python/seaborn/单变量分析1.png)

```python
x = np.random.gamma(6, size=200)
sns.distplot(x, kde=False, fit=stats.gamma)
```

![](https://cdn.jsdelivr.net/gh/clint-sfy/blogcdn@master/python/seaborn/单变量分析2.png)

```python
# 观测两个变量之间的分布关系最好用散点图
sns.jointplot(x="x", y="y", data=df);
```

![](https://cdn.jsdelivr.net/gh/clint-sfy/blogcdn@master/python/seaborn/单变量分析3.png)

```python
x, y = np.random.multivariate_normal(mean, cov, 1000).T
with sns.axes_style("white"):
    sns.jointplot(x=x, y=y, kind="hex", color="k")
```

![](https://cdn.jsdelivr.net/gh/clint-sfy/blogcdn@master/python/seaborn/单变量分析4.png)

```python
iris = sns.load_dataset("iris")
sns.pairplot(iris)
# 有4个特征  观察特征之间的关系
```

![](https://cdn.jsdelivr.net/gh/clint-sfy/blogcdn@master/python/seaborn/单变量分析5.png)

### 4. REG

```PYTHON
%matplotlib inline
import numpy as np
import pandas as pd
import matplotlib as mpl
import matplotlib.pyplot as plt

import seaborn as sns
sns.set(color_codes=True)

np.random.seed(sum(map(ord, "regression")))

tips = sns.load_dataset("tips")
```

```python
# regplot()和lmplot()都可以绘制回归关系,推荐regplot()
sns.regplot(x="total_bill", y="tip", data=tips)
sns.lmplot(x="total_bill", y="tip", data=tips);

sns.regplot(data=tips,x="size",y="tip")
sns.regplot(x="size", y="tip", data=tips, x_jitter=.05)

anscombe = sns.load_dataset("anscombe")
sns.regplot(x="x", y="y", data=anscombe.query("dataset == 'I'"),
           ci=None, scatter_kws={"s": 100})

sns.lmplot(x="x", y="y", data=anscombe.query("dataset == 'II'"),
           ci=None, scatter_kws={"s": 80})
sns.lmplot(x="x", y="y", data=anscombe.query("dataset == 'II'"),
           order=2, ci=None, scatter_kws={"s": 80});

sns.lmplot(x="total_bill", y="tip", hue="smoker", data=tips);
sns.lmplot(x="total_bill", y="tip", hue="smoker", data=tips,
           markers=["o", "x"], palette="Set1");

sns.lmplot(x="total_bill", y="tip", hue="smoker", col="time", data=tips);
sns.lmplot(x="total_bill", y="tip", hue="smoker",
           col="time", row="sex", data=tips);

f, ax = plt.subplots(figsize=(5, 5))
sns.regplot(x="total_bill", y="tip", data=tips, ax=ax);

sns.lmplot(x="total_bill", y="tip", col="day", data=tips,
           col_wrap=2, size=4);

sns.lmplot(x="total_bill", y="tip", col="day", data=tips,
           aspect=.8);
```

### 5. category

```python
%matplotlib inline
import numpy as np
import pandas as pd
import matplotlib as mpl
import matplotlib.pyplot as plt
import seaborn as sns
sns.set(style="whitegrid", color_codes=True)

np.random.seed(sum(map(ord, "categorical")))
titanic = sns.load_dataset("titanic")
tips = sns.load_dataset("tips")
iris = sns.load_dataset("iris")
```

```python
sns.stripplot(x="day", y="total_bill", data=tips);

# 重叠是很常见的现象，但是重叠影响我观察数据的量了
sns.stripplot(x="day", y="total_bill", data=tips, jitter=True)
sns.swarmplot(x="day", y="total_bill", data=tips)
sns.swarmplot(x="day", y="total_bill", hue="sex",data=tips)

sns.swarmplot(x="total_bill", y="day", hue="time", data=tips);
```

```python
sns.boxplot(x="day", y="total_bill", hue="time", data=tips);
sns.violinplot(x="total_bill", y="day", hue="time", data=tips);

sns.violinplot(x="day", y="total_bill", hue="sex", data=tips, split=True);
sns.violinplot(x="day", y="total_bill", data=tips, inner=None)
sns.swarmplot(x="day", y="total_bill", data=tips, color="w", alpha=.5)

sns.barplot(x="sex", y="survived", hue="class", data=titanic);
sns.pointplot(x="sex", y="survived", hue="class", data=titanic);

sns.pointplot(x="class", y="survived", hue="sex", data=titanic,
              palette={"male": "g", "female": "m"},
              markers=["^", "o"], linestyles=["-", "--"]);

sns.boxplot(data=iris,orient="h");
sns.factorplot(x="day", y="total_bill", hue="smoker", data=tips)
sns.factorplot(x="day", y="total_bill", hue="smoker", data=tips, kind="bar")
sns.factorplot(x="day", y="total_bill", hue="smoker",
               col="time", data=tips, kind="swarm")

sns.factorplot(x="time", y="total_bill", hue="smoker",
               col="day", data=tips, kind="box", size=4, aspect=.5)
```

### 6.  FacetGrid

```python
%matplotlib inline
import numpy as np
import pandas as pd
import seaborn as sns
from scipy import stats
import matplotlib as mpl
import matplotlib.pyplot as plt

sns.set(style="ticks")
np.random.seed(sum(map(ord, "axis_grids")))
```

```python
tips = sns.load_dataset("tips")
total_bill	tip	sex	smoker	day	  time	size

g = sns.FacetGrid(tips, col="time")
g.map(plt.hist, "tip");
```

![](https://cdn.jsdelivr.net/gh/clint-sfy/blogcdn@master/python/seaborn/facet1.png)

```python
g = sns.FacetGrid(tips, col="sex", hue="smoker")
g.map(plt.scatter, "total_bill", "tip", alpha=.7)
g.add_legend();
```

![](https://cdn.jsdelivr.net/gh/clint-sfy/blogcdn@master/python/seaborn/facet2.png)

```python
g = sns.FacetGrid(tips, row="smoker", col="time", margin_titles=True)
g.map(sns.regplot, "size", "total_bill", color=".1", fit_reg=False, x_jitter=.1);
```

![](https://cdn.jsdelivr.net/gh/clint-sfy/blogcdn@master/python/seaborn/facet3.png)

```python
from pandas import Categorical
ordered_days = tips.day.value_counts().index
print (ordered_days)
ordered_days = Categorical(['Thur', 'Fri', 'Sat', 'Sun'])
g = sns.FacetGrid(tips, row="day", row_order=ordered_days,
                  size=1.7, aspect=4,)
g.map(sns.boxplot, "total_bill");
```

![](https://cdn.jsdelivr.net/gh/clint-sfy/blogcdn@master/python/seaborn/facet4.png)

```python
pal = dict(Lunch="seagreen", Dinner="gray")
g = sns.FacetGrid(tips, hue="time", palette=pal, size=5)
g.map(plt.scatter, "total_bill", "tip", s=50, alpha=.7, linewidth=.5, edgecolor="white")
g.add_legend();
```

![](https://cdn.jsdelivr.net/gh/clint-sfy/blogcdn@master/python/seaborn/facet5.png)

```python
g = sns.FacetGrid(tips, hue="sex", palette="Set1", size=5, hue_kws={"marker": ["^", "v"]})
g.map(plt.scatter, "total_bill", "tip", s=100, linewidth=.5, edgecolor="white")
g.add_legend();
```

![](https://cdn.jsdelivr.net/gh/clint-sfy/blogcdn@master/python/seaborn/facet6.png)

```python
iris = sns.load_dataset("iris")
g = sns.PairGrid(iris)
g.map(plt.scatter);

g = sns.PairGrid(iris)
g.map_diag(plt.hist)
g.map_offdiag(plt.scatter);

g = sns.PairGrid(iris, hue="species")
g.map_diag(plt.hist)
g.map_offdiag(plt.scatter)
g.add_legend();

g = sns.PairGrid(iris, vars=["sepal_length", "sepal_width"], hue="species")
g.map(plt.scatter);
```

### 7. HeatMap

```python
%matplotlib inline
import matplotlib.pyplot as plt
import numpy as np; 
np.random.seed(0)
import seaborn as sns;
sns.set()

uniform_data = np.random.rand(3, 3)
print (uniform_data)
heatmap = sns.heatmap(uniform_data)
```

```python
flights = sns.load_dataset("flights")
flights.head()

flights = flights.pivot("month", "year", "passengers")
print (flights)
ax = sns.heatmap(flights)

ax = sns.heatmap(flights, annot=True,fmt="d") # 显示数字
ax = sns.heatmap(flights, linewidths=.5)

ax = sns.heatmap(flights, cmap="YlGnBu")
ax = sns.heatmap(flights, cbar=False)
```

