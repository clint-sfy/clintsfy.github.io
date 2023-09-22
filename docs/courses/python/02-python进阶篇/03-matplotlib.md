---
title: matplotlib基础
author: 阿源
date: 2023/05/04 21:29
categories:
 - Python进阶
tags:
 - python
 - matplotlib
---
# Matplotlib基础
## Matplotlib

### 1. 基本操作

```python
import numpy as np
import matplotlib.pyplot as plt
%matplotlib inline

plt.plot([1,2,3,4,5],[1,4,9,16,25])
plt.xlabel('xlabel',fontsize = 16)
plt.ylabel('ylabel')

plt.plot([1,2,3,4,5],[1,4,9,16,25],'-.')
plt.xlabel('xlabel',fontsize = 16)
plt.ylabel('ylabel',fontsize = 16)

plt.plot([1,2,3,4,5],[1,4,9,16,25],'-.',color='r')
plt.xlabel('xlabel',fontsize = 16)
plt.ylabel('ylabel',fontsize = 16)
```

| 字符        | 类型       | 字符   | 类型      |
| ----------- | ---------- | ------ | --------- |
| `  '-'	` | 实线       | `'--'` | 虚线      |
| `'-.'`      | 虚点线     | `':'`  | 点线      |
| `'.'`       | 点         | `','`  | 像素点    |
| `'o'`       | 圆点       | `'v'`  | 下三角点  |
| `'^'`       | 上三角点   | `'<'`  | 左三角点  |
| `'>'`       | 右三角点   | `'1'`  | 下三叉点  |
| `'2'`       | 上三叉点   | `'3'`  | 左三叉点  |
| `'4'`       | 右三叉点   | `'s'`  | 正方点    |
| `'p'`       | 五角点     | `'*'`  | 星形点    |
| `'h'`       | 六边形点1  | `'H'`  | 六边形点2 |
| `'+'`       | 加号点     | `'x'`  | 乘号点    |
| `'D'`       | 实心菱形点 | `'d'`  | 瘦菱形点  |
| `'_'`       | 横线点     |        |           |

颜色
表示颜色的字符参数有：

| 字符  | 颜色          |
| ----- | ------------- |
| `‘b’` | 蓝色，blue    |
| `‘g’` | 绿色，green   |
| `‘r’` | 红色，red     |
| `‘c’` | 青色，cyan    |
| `‘m’` | 品红，magenta |
| `‘y’` | 黄色，yellow  |
| `‘k’` | 黑色，black   |
| `‘w’` | 白色，white   |

### 2.  风格设置



### 3. 条形图

```python
import numpy as np
import matplotlib
matplotlib.use('nbagg')
import matplotlib.pyplot as plt

np.random.seed(0)
x = np.arange(5)
y = np.random.randint(-5,5,5)
print (y)
fig,axes = plt.subplots(ncols = 2)
v_bars = axes[0].bar(x,y,color='red') # 横着画
h_bars = axes[1].barh(x,y,color='red')# 竖着画

axes[0].axhline(0,color='grey',linewidth=2) # 在0处加条线
axes[1].axvline(0,color='grey',linewidth=2)
plt.show()
```

![](https://cdn.jsdelivr.net/gh/clint-sfy/blogcdn@master/python/matplotlib/直方图1.png)

```python
fig,ax = plt.subplots()
v_bars = ax.bar(x,y,color='lightblue')
for bar,height in zip(v_bars,y):  # 大于0一个颜色 ，小于0一个颜色
    if height < 0:
        bar.set(edgecolor = 'darkred',color = 'green',linewidth = 3)
plt.show()
```

![](https://cdn.jsdelivr.net/gh/clint-sfy/blogcdn@master/python/matplotlib/直方图2.png)

```python
x = np.linspace(0,10,200)
y1 = 2*x +1
y2 = 3*x +1.2
y_mean = 0.5*x*np.cos(2*x) + 2.5*x +1.1
fig,ax = plt.subplots()
ax.fill_between(x,y1,y2,color='red')
ax.plot(x,y_mean,color='black')
plt.show()
```

![](https://cdn.jsdelivr.net/gh/clint-sfy/blogcdn@master/python/matplotlib/直方图3.png)

```python
mean_values = [1,2,3]
variance = [0.2,0.4,0.5]
bar_label = ['bar1','bar2','bar3']

x_pos = list(range(len(bar_label)))
plt.bar(x_pos,mean_values,yerr=variance,alpha=0.3)
max_y = max(zip(mean_values,variance))
plt.ylim([0,(max_y[0]+max_y[1])*1.2])
plt.ylabel('variable y')
plt.xticks(x_pos,bar_label)
plt.show()
```

![](https://cdn.jsdelivr.net/gh/clint-sfy/blogcdn@master/python/matplotlib/直方图4.png)

```python
x1 = np.array([1,2,3])
x2 = np.array([2,2,3])

bar_labels = ['bat1','bar2','bar3']
fig = plt.figure(figsize = (8,6))
y_pos = np.arange(len(x1))
y_pos = [x for x in y_pos]

plt.barh(y_pos,x1,color='g',alpha = 0.5)
plt.barh(y_pos,-x2,color='b',alpha = 0.5)

plt.xlim(-max(x2)-1,max(x1)+1)
plt.ylim(-1,len(x1)+1)
plt.show()
```

![](https://cdn.jsdelivr.net/gh/clint-sfy/blogcdn@master/python/matplotlib/直方图5.png)

```python
green_data = [1, 2, 3]
blue_data = [3, 2, 1]
red_data = [2, 3, 3]
labels = ['group 1', 'group 2', 'group 3']

pos = list(range(len(green_data))) 
width = 0.2 
fig, ax = plt.subplots(figsize=(8,6))

plt.bar(pos,green_data,width,alpha=0.5,color='g',label=labels[0])
plt.bar([p+width for p in pos],blue_data,width,alpha=0.5,color='b',label=labels[1])
plt.bar([p+width*2 for p in pos],red_data,width,alpha=0.5,color='r',label=labels[2])
plt.show()
```

![](https://cdn.jsdelivr.net/gh/clint-sfy/blogcdn@master/python/matplotlib/直方图6.png)

```python
data = range(200, 225, 5)

bar_labels = ['a', 'b', 'c', 'd', 'e']
fig = plt.figure(figsize=(10,8))
y_pos = np.arange(len(data))

plt.yticks(y_pos, bar_labels, fontsize=16)
bars = plt.barh(y_pos,data,alpha = 0.5,color='g')
plt.vlines(min(data),-1,len(data)+0.5,linestyle = 'dashed')
for b,d in zip(bars,data):
    plt.text(b.get_width()+b.get_width()*0.05,b.get_y()+b.get_height()/2,'{0:.2%}'.format(d/min(data)))
plt.show()
```

![](https://cdn.jsdelivr.net/gh/clint-sfy/blogcdn@master/python/matplotlib/直方图7.png)

```python
mean_values = range(10,18)
x_pos = range(len(mean_values))

import matplotlib.colors as col
import matplotlib.cm as cm

cmap1 = cm.ScalarMappable(col.Normalize(min(mean_values),max(mean_values),cm.hot))
cmap2 = cm.ScalarMappable(col.Normalize(0,20,cm.hot))

plt.subplot(121)
plt.bar(x_pos,mean_values,color = cmap1.to_rgba(mean_values))

plt.subplot(122)
plt.bar(x_pos,mean_values,color = cmap2.to_rgba(mean_values))
plt.show()
```

![](https://cdn.jsdelivr.net/gh/clint-sfy/blogcdn@master/python/matplotlib/直方图8.png)

```python
patterns = ('-', '+', 'x', '\\', '*', 'o', 'O', '.')

fig = plt.gca()

mean_value = range(1,len(patterns)+1)
x_pos = list(range(len(mean_value)))

bars = plt.bar(x_pos,mean_value,color='white')

for bar,pattern in zip(bars,patterns):
    bar.set_hatch(pattern)
plt.show()
```

![](https://cdn.jsdelivr.net/gh/clint-sfy/blogcdn@master/python/matplotlib/直方图9.png)

### 4. 盒图

```python
import matplotlib.pyplot as plt
import numpy as np

tang_data = [np.random.normal(0,std,100) for std in range(1,4)]
fig = plt.figure(figsize = (8,6))
plt.boxplot(tang_data,notch=False,sym='s',vert=True)

plt.xticks([y+1 for y in range(len(tang_data))],['x1','x2','x3'])
plt.xlabel('x')
plt.title('box plot')
```

![](https://cdn.jsdelivr.net/gh/clint-sfy/blogcdn@master/python/matplotlib/盒图1.png)

```python
tang_data = [np.random.normal(0,std,100) for std in range(1,4)]
fig = plt.figure(figsize = (8,6))
bplot = plt.boxplot(tang_data,notch=False,sym='s',vert=True)

plt.xticks([y+1 for y in range(len(tang_data))],['x1','x2','x3'])
plt.xlabel('x')
plt.title('box plot')

for components in bplot.keys():
    for line in bplot[components]:
        line.set_color('black')
```

![](https://cdn.jsdelivr.net/gh/clint-sfy/blogcdn@master/python/matplotlib/盒图2.png)

```python
tang_data = [np.random.normal(0,std,100) for std in range(1,4)]
fig = plt.figure(figsize = (8,6))
plt.boxplot(tang_data,notch=False,sym='s',vert=False)

plt.yticks([y+1 for y in range(len(tang_data))],['x1','x2','x3'])
plt.ylabel('x')
plt.title('box plot')
```

![](https://cdn.jsdelivr.net/gh/clint-sfy/blogcdn@master/python/matplotlib/盒图3.png)

```python
tang_data = [np.random.normal(0,std,100) for std in range(1,4)]
fig = plt.figure(figsize = (8,6))
plt.boxplot(tang_data,notch=True,sym='s',vert=False)

plt.xticks([y+1 for y in range(len(tang_data))],['x1','x2','x3'])
plt.xlabel('x')
plt.title('box plot')
```

![](https://cdn.jsdelivr.net/gh/clint-sfy/blogcdn@master/python/matplotlib/盒图4.png)

```python
tang_data = [np.random.normal(0,std,100) for std in range(1,4)]
fig = plt.figure(figsize = (8,6))
bplot = plt.boxplot(tang_data,notch=False,sym='s',vert=True,patch_artist=True)

plt.xticks([y+1 for y in range(len(tang_data))],['x1','x2','x3'])
plt.xlabel('x')
plt.title('box plot')

colors = ['pink','lightblue','lightgreen']
for pathch,color in zip(bplot['boxes'],colors):
    pathch.set_facecolor(color)
```

![](https://cdn.jsdelivr.net/gh/clint-sfy/blogcdn@master/python/matplotlib/盒图5.png)

```python
fig,axes = plt.subplots(nrows=1,ncols=2,figsize=(12,5))
tang_data = [np.random.normal(0,std,100) for std in range(6,10)]
axes[0].violinplot(tang_data,showmeans=False,showmedians=True)
axes[0].set_title('violin plot')

axes[1].boxplot(tang_data)
axes[1].set_title('box plot')

for ax in axes:
    ax.yaxis.grid(True)
    ax.set_xticks([y+1 for y in range(len(tang_data))])
plt.setp(axes,xticks=[y+1 for y in range(len(tang_data))],xticklabels=['x1','x2','x3','x4'])
```

![](https://cdn.jsdelivr.net/gh/clint-sfy/blogcdn@master/python/matplotlib/盒图6.png)

### 5. 直方图

```python
import numpy as np
import matplotlib.pyplot as plt

data = np.random.normal(0,20,1000)
bins = np.arange(-100,100,5)

plt.hist(data,bins=bins)
plt.xlim([min(data)-5,max(data)+5])
plt.show()
```

![](https://cdn.jsdelivr.net/gh/clint-sfy/blogcdn@master/python/matplotlib/直方图10.png)

```python
import random
data1 = [random.gauss(15,10) for i in range(500)]
data2 = [random.gauss(5,5) for i in range(500)]
bins = np.arange(-50,50,2.5)

plt.hist(data1,bins=bins,label='class 1',alpha = 0.3)
plt.hist(data2,bins=bins,label='class 2',alpha = 0.3)
plt.legend(loc='best')
plt.show()
```

![](https://cdn.jsdelivr.net/gh/clint-sfy/blogcdn@master/python/matplotlib/直方图11.png)

### 6. 散点图

```python
mu_vec1 = np.array([0,0])
cov_mat1 = np.array([[2,0],[0,2]])

x1_samples = np.random.multivariate_normal(mu_vec1, cov_mat1, 100)
x2_samples = np.random.multivariate_normal(mu_vec1+0.2, cov_mat1+0.2, 100)
x3_samples = np.random.multivariate_normal(mu_vec1+0.4, cov_mat1+0.4, 100)

plt.figure(figsize = (8,6))
plt.scatter(x1_samples[:,0],x1_samples[:,1],marker ='x',color='blue',alpha=0.6,label='x1')
plt.scatter(x2_samples[:,0],x2_samples[:,1],marker ='o',color='red',alpha=0.6,label='x2')
plt.scatter(x3_samples[:,0],x3_samples[:,1],marker ='^',color='green',alpha=0.6,label='x3')
plt.legend(loc='best')
plt.show()
```

![](https://cdn.jsdelivr.net/gh/clint-sfy/blogcdn@master/python/matplotlib/散点图1.png)

```python
x_coords = [0.13, 0.22, 0.39, 0.59, 0.68, 0.74, 0.93]
y_coords = [0.75, 0.34, 0.44, 0.52, 0.80, 0.25, 0.55]

plt.figure(figsize = (8,6))
plt.scatter(x_coords,y_coords,marker='s',s=50)

for x,y in zip(x_coords,y_coords):
    plt.annotate('(%s,%s)'%(x,y),xy=(x,y),xytext=(0,-15),textcoords = 'offset points',ha='center')
plt.show()
```

![](https://cdn.jsdelivr.net/gh/clint-sfy/blogcdn@master/python/matplotlib/散点图2.png)

```python
mu_vec1 = np.array([0,0])
cov_mat1 = np.array([[1,0],[0,1]])
X = np.random.multivariate_normal(mu_vec1, cov_mat1, 500)
fig = plt.figure(figsize=(8,6))

R=X**2
R_sum=R.sum(axis = 1)

plt.scatter(X[:,0],X[:,1],color='grey',marker='o',s=20*R_sum,alpha=0.5)
plt.show()
```

![](https://cdn.jsdelivr.net/gh/clint-sfy/blogcdn@master/python/matplotlib/散点图3.png)

### 7. 3D图

```python
import matplotlib.pyplot as plt
import numpy as np
from mpl_toolkits.mplot3d import Axes3D

fig = plt.figure()
ax = Axes3D(fig)

x = np.arange(-4,4,0.25)
y = np.arange(-4,4,0.25)

X,Y = np.meshgrid(x,y)

Z = np.sin(np.sqrt(X**2+Y**2))
ax.plot_surface(X,Y,Z,rstride = 1,cstride = 1,cmap='rainbow')
ax.contour(X,Y,Z,zdim='z',offset = -2 ,cmap='rainbow')

ax.set_zlim(-2,2)
plt.show()
```

![](https://cdn.jsdelivr.net/gh/clint-sfy/blogcdn@master/python/matplotlib/3d图.png)

```python
fig = plt.figure()
ax = fig.gca(projection='3d')

theta = np.linspace(-4 * np.pi, 4 * np.pi, 100)
z = np.linspace(-2, 2, 100)
r = z**2 + 1
x = r * np.sin(theta)
y = r * np.cos(theta)

ax.plot(x,y,z)
plt.show()
```

![](https://cdn.jsdelivr.net/gh/clint-sfy/blogcdn@master/python/matplotlib/3d图2.png)

```python
np.random.seed(1)
def randrange(n,vmin,vmax):
    return (vmax-vmin)*np.random.rand(n)+vmin


fig = plt.figure()
ax = fig.add_subplot(111,projection = '3d')
n = 100
for c,m,zlow,zhigh in [('r','o',-50,-25),('b','x','-30','-5')]:
    xs = randrange(n,23,32)
    ys = randrange(n,0,100)
    zs = randrange(n,int(zlow),int(zhigh))
    ax.scatter(xs,ys,zs,c=c,marker=m)

ax.view_init(40,0) # 可以换方向    
plt.show()
```

![](https://cdn.jsdelivr.net/gh/clint-sfy/blogcdn@master/python/matplotlib/3d图3.png)

```python
fig = plt.figure()  
ax = fig.add_subplot(111, projection='3d') 

for c, z in zip(['r', 'g', 'b', 'y'], [30, 20, 10, 0]): 
    xs = np.arange(20)
    ys = np.random.rand(20)
    cs = [c]*len(xs)
    ax.bar(xs,ys,zs = z,zdir='y',color = cs,alpha = 0.5)
plt.show()
```

![](https://cdn.jsdelivr.net/gh/clint-sfy/blogcdn@master/python/matplotlib/3d图4.png)

### 8. pie与子图

```python
m = 51212.
f = 40742.
m_perc = m/(m+f)
f_perc = f/(m+f)

colors = ['navy','lightcoral']
labels = ["Male","Female"]

plt.figure(figsize=(8,8))
paches,texts,autotexts = plt.pie([m_perc,f_perc],labels = labels,autopct = '%1.1f%%',explode=[0,0.05],colors = colors)

for text in texts+autotexts:
    text.set_fontsize(20)
for text in autotexts:
    text.set_color('white')
```

![](https://cdn.jsdelivr.net/gh/clint-sfy/blogcdn@master/python/matplotlib/pie.png)

```python
ax1 = plt.subplot2grid((3,3),(0,0))
ax2 = plt.subplot2grid((3,3),(1,0))
ax3 = plt.subplot2grid((3,3),(0,2),rowspan=3)
ax4 = plt.subplot2grid((3,3),(2,0),colspan = 2)
ax5 = plt.subplot2grid((3,3),(0,1),rowspan=2)
```

![](https://cdn.jsdelivr.net/gh/clint-sfy/blogcdn@master/python/matplotlib/子图1.png)

```python
import numpy as np

x = np.linspace(0,10,1000)
y2 = np.sin(x**2)
y1 = x**2

fig,ax1 = plt.subplots()

left,bottom,width,height = [0.22,0.45,0.3,0.35]
ax2 = fig.add_axes([left,bottom,width,height])

ax1.plot(x,y1)
ax2.plot(x,y2)
```

![](https://cdn.jsdelivr.net/gh/clint-sfy/blogcdn@master/python/matplotlib/子图2.png)

```python
import matplotlib.pyplot as plt
from mpl_toolkits.axes_grid1.inset_locator import inset_axes

def autolabel(rects):
    for rect in rects:
        height = rect.get_height()
        ax1.text(rect.get_x() + rect.get_width()/2., 1.02*height,
        "{:,}".format(float(height)),
        ha='center', va='bottom',fontsize=18)
        
top10_arrivals_countries = ['CANADA','MEXICO','UNITED\nKINGDOM',\
                            'JAPAN','CHINA','GERMANY','SOUTH\nKOREA',\
                            'FRANCE','BRAZIL','AUSTRALIA']
top10_arrivals_values = [16.625687, 15.378026, 3.934508, 2.999718,\
                         2.618737, 1.769498, 1.628563, 1.419409,\
                         1.393710, 1.136974]
arrivals_countries = ['WESTERN\nEUROPE','ASIA','SOUTH\nAMERICA',\
                      'OCEANIA','CARIBBEAN','MIDDLE\nEAST',\
                      'CENTRAL\nAMERICA','EASTERN\nEUROPE','AFRICA']
arrivals_percent = [36.9,30.4,13.8,4.4,4.0,3.6,2.9,2.6,1.5]

fig, ax1 = plt.subplots(figsize=(20,12))
tang = ax1.bar(range(10),top10_arrivals_values,color='blue')
plt.xticks(range(10),top10_arrivals_countries,fontsize=18)
ax2 = inset_axes(ax1,width = 6,height = 6,loc = 5)
explode = (0.08, 0.08, 0.05, 0.05,0.05,0.05,0.05,0.05,0.05)
patches, texts, autotexts = ax2.pie(arrivals_percent,labels=arrivals_countries,autopct='%1.1f%%',explode=explode)

for text in texts+autotexts:
    text.set_fontsize(16)
for spine in ax1.spines.values():
    spine.set_visible(False)

autolabel(tang) 
```

![](https://cdn.jsdelivr.net/gh/clint-sfy/blogcdn@master/python/matplotlib/子图3.png)
