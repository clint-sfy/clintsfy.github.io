---
title: pandas基础
author: 阿源
date: 2023/05/03 21:29
categories:
 - Python进阶
tags:
 - python
 - pandas
---
# pandas基础
## pandas
### 1. 概述

```python
import pandas as pd
df = pd.read_csv('')

df.head(5)

df.info() # 返回当前信息
df.index
df.columns
df.dtypes
df.values
```

### 2. 基本操作

```python
df = pd.DataFrame(data)


df['Age'] # 取指定的一列
df['Age'][:5] # 取前五个

df = df.set_index('Name')  # 指定某一列为索引

age = df['Age']
age.mean()
age.min()

df.describe() # 统计  包括样本值、均值、最小、最大、四分位
```

### 3. 索引

```python
df = pd.read_csv('')
df[['Age','Fare']][:5]
 
# iloc 用position1去定位
# loc 用label去定位 df.loc['A':'C' , 's':'d'] 标签行到行  字段列到列
df.iloc[0:5 , 1:3]

df = df.set_index('Name')
df.loc['Laina']
df.loc['Laina':"Alex",'Fare']

df['Fare'] > 40 #bool
df[df['Fare'] > 40]

df.loc[df['sex'] == 'male', 'Age'].mean()
(df['Age'] > 70).sum()
```

### 4. groupby

```python
df.groupby('key').aggregate(np.sum)

df.groupby('sex')['Age'].mean()
```

### 5. 数值运算

```python
df.sum(axis = 0)
df.median # 中位数
```

```python
# 二元统计
df.cov()  #协方差
df.corr() #相关系数  

df['age'].value_counts #在不同年龄段 人数个数
df['age'].value_counts(ascending = True,bins = 5) #会升序 分成五组

df['age'].count() #整体有多少个
```

### 6. 对象操作

```python
data = [10,11,12]
index = ['a','b','c']
s = pd.Series(data = data , index = index)

s1 = s.copy()
s1['a'] = 100
s1.replace(to_replace = 100 , value=101 , inplace=False)
s1.index = ['a','d','b']
s1.rename(index = {'a' = 'A'} , inplace = True)

s1.append(s2 , ignore_index = False) # 不会生成新索引
```

```python
# 删除操作
del s1['A']
s1.drop(['d','b'] , inplace = True)
```

### 7. merge

```python
pd.merge(left , right , on = 'key') # 合并表
pd.merge(left , right , on = ['key1','key2'],how='outer')
```

### 8. 显示设置

```python
pd.get_option('display.max_rows')
60

pd.set_option('display.max_rows',6)
```

### 9. 数据透视表

```python
example.privot(index = 'Category' , colums='Month' , values='Amount') 
```

### 10. 时间操作

```python
import pandas as pd

ts = pd.Timestamp('2017-11-24')
ts.month
ts.day

s = pd.Series(['','',''])
ts = pd.to_datetime(s)

pd.Series(pd.data_range(start='2017-11-24' , periods = 10 . freq = '12H'))
data['time'] = pd.to_datatime(data['Time'])

data.between_time('8:00','12:00')

data.resample('D').mean().head

```

### 11. 字符串操作

```python
import pandas as pd
s Series
s.str.lower()
s.str.len()

index.str.strip()
index.str.lstrip() # 去左边的空格

df = pd.DataFrame(np.random.randn(3,2) , colums )
```

### 数据处理技巧

```python
import panads as pd

g1 = pd.read_csv('')
g1.head

g1.shape
g1.info(字段 = 'deep')

for dtype in ['float64','int64','object']:
    selected = g1.select_dytpe(include = [dtype])
    mean_usage_b = selected_dtype.memory_usage(deep=True).mean()
    mean_usage_md = mean_usage_b/1024**2
    print('平均内存占用' , dtype , mean_usage_mb)
    
import numpy as np
int_types = ['uint8' , 'int8' , 'int16' , 'int32' , 'int64']
for it in int_types:
    print np.iinfo(it)

def mem_usage(pandas_pbj):
    if isinstance(pandas_obj , pd.DataFrame):
        usage_b = pandas_obj.memory_usage(deep=True).sum()
    else:
        usage_b = pandas_obj.memory_usage(deep=True)
    usage_mb = usage_b / 1024**2
    return '{:03.2f} MB' , format(usae_mb)

g1_int = g1_select_dtypes(include = ['int64'])
coverted_int = g1_int.apply(pd.to_numeric , downcast='unsigned')
print(mem_usage(g1_int))
print(mem_usage(coverted_int))

g1_float = g1.select_dtypes(intclude = ['float64'])
converted_float = g1_float.apply(pd.to_numeric , downcast='float')
print(mem_usage(g1_float))
print(mem_usage(coverted_float))

optimized_g1 = g1.copy()
optimized_g1[coverted_int.columns] = coverted_int
optimized_g1[converted_float.columns] = coverted_float
print(g1)
print(optimized_g1)

g1_obj = g1.select_dtypes(include = ['object']).copy()
dow = g1_obj.day_of_week
dow_cat = dow.astype('category')

converted_obj = pd.DataFrame()
for col in g1_obj.columns:
    num_ unique.values = len(g1._obj[co1].unique())
    num_ total_values = len(g1_obj[co1])
    if num_unique_values / num_total_values < 0.5:
    	converted_ obj. 1oc[:,co1] = gl_obj[co1].astype(' category' )
    else:
    	converted_ obj. loc[:,col] = gl._obj[co1]
        
print(mem_ usage(gl_obj))
print(mem_usage (converted_obj)|
751.64 MB
51.67 MB

```
