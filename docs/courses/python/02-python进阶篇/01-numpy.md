---
title: numpy基础
author: 阿源
date: 2023/05/02 21:29
categories:
 - Python进阶
tags:
 - python
 - numpy
---
# numpy基础

## numpy
### 1. 概述

```python
import numpy as np

array = np.array([1,2,3,4,5])
print (type(array))
<class 'numpy.ndarray'>

array2 = array + 1  #list就不行
array2
array([3, 4, 5, 6, 7])

array.shape
(5,)
```

### 2. array结构

对于ndarray结构来说，里面所有的元素必须是同一类型的 如果不是的话，会自动的向下进行转换

```python
tang_list = [1,2,3,4,5]
tang_array = np.array(tang_list)
tang_array
```

```python 
tang_array.dtype
dtype('int32')

tang_array.itemsize
4

tang_array.shape
(5,)

tang_array.size
5

np.size(tang_array)
5

np.shape(tang_array) 
(5,)

tang_array.ndim # 获取数组的维度
1

tang_array.fill(0)
tang_array
array([0, 0, 0, 0, 0])
```

```python
tang_array[1,1] = 10
tang_array
array([[ 1,  2,  3],
       [ 4, 10,  6],
       [ 7,  8,  9]])

tang_array[1]
array([ 4, 10,  6])

tang_array[:,1]
array([ 2, 10, 8])

tang_array[0,0:2]
array([1, 2])

tang_array2 = tang_array.copy()
```

```python 
tang_array = np.arange(0,100,10)  # 按照间隔
tang_array
array([ 0, 10, 20, 30, 40, 50, 60, 70, 80, 90])

mask = np.array([0,0,0,1,1,1,0,0,1,1],dtype=bool)
mask
array([False, False, False,  True,  True,  True, False, False,  True,  True], dtype=bool)

tang_array[mask]
array([30, 40, 50, 80, 90])
```

```python 
random_array = np.random.rand(10)
random_array
array([ 0.51388374,  0.57986996,  0.05474169,  0.5019837 ,  0.82705166,
        0.95557716,  0.83348612,  0.32385451,  0.52586287,  0.92505535])

np.where(tang_array > 30)
(array([3, 4], dtype=int64),)
```

```python
tang_array = np.array([10,20,30,40,50])
tang_array > 30
array([False, False, False,  True,  True], dtype=bool)

np.where(tang_array > 30)
(array([3, 4], dtype=int64),)

tang_array = np.array([1,2,3,4,5],dtype=np.float32)
tang_array
array([ 1.,  2.,  3.,  4.,  5.], dtype=float32)

tang_array.dtype
dtype('float32')

tang_array.nbytes  # 将返回该数组所占用的字节数
20
```

```python
tang_array = np.array([1,10,3.5,'str'],dtype = np.object)
tang_array
array([1, 10, 3.5, 'str'], dtype=object)

tang_array * 2
array([2, 20, 7.0, 'strstr'], dtype=object)

tang_array = np.array([1,2,3,4,5])
np.asarray(tang_array,dtype = np.float32)
array([ 1.,  2.,  3.,  4.,  5.], dtype=float32)

tang_array2 = np.asarray(tang_array,dtype = np.float32)
array([ 1.,  2.,  3.,  4.,  5.], dtype=float32)

tang_array.astype(np.float32) #转换类型
```

### 3. 数值计算

```python 
import numpy as np
tang_array = np.array([[1,2,3],[4,5,6]])

np.sum(tang_array) # 求和

np.sum(tang_array,axis=0) # 指定要进行的操作是沿着什么轴（维度）
tang_array.sum(axis = 0)
array([5, 7, 9])

np.sum(tang_array,axis=1)  #列相加
tang_array.sum(axis = 1)
array([6, 15])
```

```python
tang_array.prod() # 相乘

tang_array.prod(axis = 0)
array([ 4, 10, 18])

tang_array.prod(axis = 1)
array([  6, 120])
```

```python 
tang_array.min()
1
tang_array.min(axis = 0)
array([1, 2, 3])

tang_array.min(axis = 1)
array([1, 4])

tang_array.max()
6
```

#### 找到索引位置

``` python 
tang_array.argmin() # 将返回它扁平化后的最小元素的索引，应该使用np.unravel_index()函数将其还原到二维坐标下。
0

tang_array.argmin(axis = 0)
array([0, 0, 0], dtype=int64)

tang_array.argmin(axis=1)
array([0, 0], dtype=int64)

tang_array.mean() # 求均值
3.5
```

#### 标准差

```python
tang_array.std()
1.707825127659933
tang_array.std(axis = 1)
array([ 0.81649658,  0.81649658])
```

#### 方差的计算

```python
tang_array.var()  # 方差
2.9166666666666665

tang_array
array([[1, 2, 3], [4, 5, 6]])

# tang_array.clip(a_min=None, a_max=None)会返回截取（裁剪）之后的数组
tang_array.clip(2,4)
array([[2, 2, 3],[4, 4, 4]])

tang_array = np.array([1.2,3.56,6.41])
tang_array.round()  # 舍入到指定小数位数的新数组
array([ 1.,  4.,  6.])

tang_array.round(decimals=1)  # 保存指定位数的小数
array([ 1.2,  3.6,  6.4])
```

### 4. 排序

```python 
import numpy as np
tang_array = np.array([[1.5,1.3,7.5],
                      [5.6,7.8,1.2]])

np.sort(tang_array)
array([[ 1.3,  1.5,  7.5],
       [ 1.2,  5.6,  7.8]])

np.sort(tang_array,axis = 0)
array([[ 1.5,  1.3,  1.2],
       [ 5.6,  7.8,  7.5]])

# 将返回一个索引数组，该数组将tang_array数组的元素从小到大排序后的索引值
np.argsort(tang_array)
array([[1, 0, 2],
       [2, 0, 1]], dtype=int64)

# 返回一个开始值为0，结束值为10，含有10个等间距元素的一维数组。
tang_array = np.linspace(0,10,10)
tang_array
array([  0.        ,   1.11111111,   2.22222222,   3.33333333,
         4.44444444,   5.55555556,   6.66666667,   7.77777778,
         8.88888889,  10.        ])

# 在tang_array中，值2.5应插入到索引位置3，值6.5应插入到索引位置6，值9.5应插入到索引位置9。
# 用于在已排序的数组中查找指定值应插入的索引位置
values = np.array([2.5,6.5,9.5])
np.searchsorted(tang_array,values)
array([3, 6, 9], dtype=int64)
```

```python
tang_array = np.array([[1,0,6],
                       [1,7,0],
                       [2,3,1],
                       [2,4,0]])
# lexsort(keys, axis=None)可以按照键的值进行稳定排序，其中keys为排序键，axis为要排序的轴
# 按照第一列降序，第三列升序
# 返回一个数组，其中元素是tang_array的每一行的索引值，这些索引值代表了经过排序后该行所处的位置
index = np.lexsort([-1*tang_array[:,0],tang_array[:,2]])
index
array([0, 1, 3, 2], dtype=int64)

tang_array = tang_array[index] 
tang_array
array([[2, 4, 0],
       [1, 7, 0],
       [2, 3, 1],
       [1, 0, 6]])
```

### 5. 数组形状

```python 
import numpy as np
tang_array = np.arange(10)
tang_array
array([0, 1, 2, 3, 4, 5, 6, 7, 8, 9])

tang_array.shape
(10,)

tang_array.shape = 2,5
tang_array
array([[0, 1, 2, 3, 4],
       [5, 6, 7, 8, 9]])

tang_array.reshape(1,10)
array([[0, 1, 2, 3, 4, 5, 6, 7, 8, 9]])
# 大小必须不能改变
```

```python
tang_array = np.arange(10)
tang_array.shape
(10,)
# np.newaxis是在NumPy中广泛使用的一个特殊索引，用于增加数组的维度。
tang_array = tang_array[np.newaxis,:]
tang_array.shape
(1, 10)

tang_array = np.arange(10)
tang_array.shape
(10,)

tang_array = tang_array[:,np.newaxis]
tang_array.shape
(10, 1)

tang_array = tang_array[:,np.newaxis,np.newaxis]
tang_array.shape
(10, 1, 1, 1)

tang_array = tang_array.squeeze() #用于移除多余的单维度
tang_array.shape
(10,)
```

```python
# 用于将数组进行转置操作。在二维情况下，它相当于将数组的行和列进行对调；在多维情况下，它可以实现任意轴的对调。
tang_array.transpose()
tang_array.T
```

#### 数组的连接

```python
a = np.array([[123,456,678],[3214,456,134]])
b = np.array([[1235,3124,432],[43,13,134]])

c = np.concatenate((a,b))
array([[ 123,  456,  678],
       [3214,  456,  134],
       [1235, 3124,  432],
       [  43,   13,  134]])


c = np.concatenate((a,b),axis = 0)
c
array([[ 123,  456,  678],
       [3214,  456,  134],
       [1235, 3124,  432],
       [  43,   13,  134]])

c = np.concatenate((a,b),axis = 1)
c
array([[ 123,  456,  678, 1235, 3124,  432],
       [3214,  456,  134,   43,   13,  134]])
```

```python
np.vstack((a,b)) #表示对这两个数组按垂直方向进行堆叠（竖直方向上堆叠）
array([[ 123,  456,  678],
       [3214,  456,  134],
       [1235, 3124,  432],
       [  43,   13,  134]])

np.hstack((a,b))
array([[ 123,  456,  678, 1235, 3124,  432],
       [3214,  456,  134,   43,   13,  134]])
```

```python
a
array([[ 123,  456,  678],
       [3214,  456,  134]])
# 这两个方法都可以将多维数组降为一维。
a.flatten() # 返回的将是一个拷贝（copy）。
array([ 123,  456,  678, 3214,  456,  134])

a.ravel() # 返回的将是一个视图。
array([ 123,  456,  678, 3214,  456,  134])
```

### 6. 数组生成

```python 
import numpy as np

np.arange(10)
array([0, 1, 2, 3, 4, 5, 6, 7, 8, 9])

np.arange(2,20,2) # 会生成一个从2开始，步长为2到20的一维数组
array([ 2,  4,  6,  8, 10, 12, 14, 16, 18])

np.arange(2,20,2,dtype=np.float32)
array([  2.,   4.,   6.,   8.,  10.,  12.,  14.,  16.,  18.], dtype=float32)

np.linspace(0,10,10)
array([  0.        ,   1.11111111,   2.22222222,   3.33333333,
         4.44444444,   5.55555556,   6.66666667,   7.77777778,
         8.88888889,  10.        ])

# 会生成一个在对数尺度上均匀分布的一维数组 默认是10 
# 起始数：0  终止数：1*10 数组长度：5  均匀分布
np.logspace(0,1,5)
array([  1.        ,   1.77827941,   3.16227766,   5.62341325,  10.        ])
```

```python
x = [1,2]
y = [3,4,5]
# 是用于生成网格点坐标矩阵的函数
# 那么 x 和 y 都会被广播为 n*m 的二维数组。
x, y= np.meshgrid(x,y)
x
[[1, 2],
 [1, 2],
 [1, 2]]

y
[[3, 3],
 [4, 4],
 [5, 5]]
```

```python
np.r_[0:10:1] 
array([0, 1, 2, 3, 4, 5, 6, 7, 8, 9])


np.c_[0:10:1]
array([[0],
       [1],
       [2],
       [3],
       [4],
       [5],
       [6],
       [7],
       [8],
       [9]])
```

```python
np.zeros(3)
array([ 0.,  0.,  0.])

np.zeros((3,3))
array([[ 0.,  0.,  0.],
       [ 0.,  0.,  0.],
       [ 0.,  0.,  0.]])
np.ones((3,3))
array([[ 1.,  1.,  1.],
       [ 1.,  1.,  1.],
       [ 1.,  1.,  1.]])
np.ones((3,3)) * 8
array([[ 8.,  8.,  8.],
       [ 8.,  8.,  8.],
       [ 8.,  8.,  8.]])

a = np.empty(6)
(6,)
a.fill(1)
a
array([ 1.,  1.,  1.,  1.,  1.,  1.])

# 清0 和 清1操作
tang_array = np.array([1,2,3,4])
np.zeros_like(tang_array)
array([0, 0, 0, 0])
np.ones_like(tang_array)
array([1, 1, 1, 1])

# 对角矩阵
np.identity(5)
array([[ 1.,  0.,  0.,  0.,  0.],
       [ 0.,  1.,  0.,  0.,  0.],
       [ 0.,  0.,  1.,  0.,  0.],
       [ 0.,  0.,  0.,  1.,  0.],
       [ 0.,  0.,  0.,  0.,  1.]])
```



### 7. 运算

```python 
x = np.array([5,5])
y = np.array([2,2])

np.multiply(x,y)
array([10, 10])
```

```python
# 计算两个向量 x 和 y 的点积（也称为内积或标量积）
# 对于两个长度相同的一维数组，点积的结果等于它们的对应元素相乘之和
np.dot(x,y)
20

x.shape = 2,1
array([[5],
       [5]])
y.shape = 1,2
array([[2, 2]])


np.dot(x,y)
array([[10, 10],
       [10, 10]])
np.dot(y,x)
array([[20]])
```

```python
# 与或非
y = np.array([1,1,1,4])
x = np.array([1,1,1,2])
x == y
array([ True,  True,  True, False], dtype=bool)
np.logical_and(x,y)
array([ True,  True,  True,  True], dtype=bool)
np.logical_or(x,y)
array([ True,  True,  True,  True], dtype=bool)
np.logical_not(x,y)
array([0, 0, 0, 0])
```

### 8. 随机模块

```python
import numpy as np
#所有的值都是从0到1
np.random.rand(3,2)
array([[ 0.87876027,  0.98090867],
       [ 0.07482644,  0.08780685],
       [ 0.6974858 ,  0.35695858]])


#返回的是随机的整数，左闭右开
np.random.randint(10,size = (5,4))
array([[8, 0, 3, 7],
       [4, 6, 3, 4],
       [6, 9, 9, 8],
       [9, 1, 4, 0],
       [5, 9, 0, 5]])

np.random.rand()
# 用于生成服从均匀分布的随机数的函数
np.random.random_sample() # 没有参数时和np.random.rand()一样，可以加形状

# 数组长度3，0-9生成随机数
np.random.randint(0,10,3)
array([7, 7, 5])

# 这些随机数都是从一个均值为 mu，标准差为 sigma 的正态分布中生成的。
mu, sigma = 0,0.1
np.random.normal(mu,sigma,10)

# 将设置数组中用于表示小数的位数为 2
np.set_printoptions(precision = 2)
mu, sigma = 0,0.1
np.random.normal(mu,sigma,10)
array([ 0.01,  0.02,  0.12, -0.01, -0.04,  0.07,  0.14, -0.08, -0.01, -0.03])
```

#### 洗牌

```python
tang_array = np.arange(10)
tang_array
array([0, 1, 2, 3, 4, 5, 6, 7, 8, 9])
np.random.shuffle(tang_array)
tang_array
array([6, 2, 5, 7, 4, 3, 1, 0, 8, 9])
```

#### 随机种子

```python
np.random.seed(100) #在同一个随机数种子下使用相同的随机数生成算法和参数，可以得到相同的随机数序列。
mu, sigma = 0,0.1
np.random.normal(mu,sigma,10)
array([-0.17,  0.03,  0.12, -0.03,  0.1 ,  0.05,  0.02, -0.11, -0.02,  0.03])
```

### 9. 读写

```python
%%writefile tang.txt
1 2 3 4 5 6
2 3 5 8 7 9
```

```python
data = []
with open('tang.txt') as f:
    for line in f.readlines():
        fileds = line.split()
        cur_data = [float(x) for x in fileds]
        data.append(cur_data)
data = np.array(data)
data
array([[ 1.,  2.,  3.,  4.,  5.,  6.],
       [ 2.,  3.,  5.,  8.,  7.,  9.]])
```

```python
data = np.loadtxt('tang.txt')
data
array([[ 1.,  2.,  3.,  4.,  5.,  6.],
       [ 2.,  3.,  5.,  8.,  7.,  9.]])

```

```python

%%writefile tang2.txt
1,2,3,4,5,6
2,3,5,8,7,9

data = np.loadtxt('tang2.txt',delimiter = ',')
data
array([[ 1.,  2.,  3.,  4.,  5.,  6.],
       [ 2.,  3.,  5.,  8.,  7.,  9.]])


%%writefile tang2.txt
x,y,z,w,a,b
1,2,3,4,5,6
2,3,5,8,7,9
Overwriting tang2.txt
# skiprows : 去掉几行
# delimiter = ',' :分隔符
# usecols = (0,1,4) ：指定使用哪几列
data = np.loadtxt('tang2.txt',delimiter = ',',skiprows = 1)
data
array([[ 1.,  2.,  3.,  4.,  5.,  6.],
       [ 2.,  3.,  5.,  8.,  7.,  9.]])
```

```python
tang_array = np.array([[1,2,3],[4,5,6]])
np.savetxt('tang4.txt',tang_array)
np.savetxt('tang4.txt',tang_array,fmt='%d')
np.savetxt('tang4.txt',tang_array,fmt='%d',delimiter = ',')
np.savetxt('tang4.txt',tang_array,fmt='%.2f',delimiter = ',')
```

```python
# 读写array结构
tang_array = np.array([[1,2,3],[4,5,6]])
np.save('tang_array.npy',tang_array)

tang = np.load('tang_array.npy')
tang
array([[1, 2, 3],
       [4, 5, 6]])

tang_array2 = np.arange(10)
tang_array2
array([0, 1, 2, 3, 4, 5, 6, 7, 8, 9])
# 存两个array
np.savez('tang.npz',a=tang_array,b=tang_array2)
data = np.load('tang.npz')
data.keys()
['b', 'a']
data['a']
array([[1, 2, 3],
       [4, 5, 6]])
data['b']
array([0, 1, 2, 3, 4, 5, 6, 7, 8, 9])
```