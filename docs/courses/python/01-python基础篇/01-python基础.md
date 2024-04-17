---
title: Python基础
author: 阿源
date: 2023/05/01 21:29
categories:
 - Python基础快速入门
tags:
 - python
 - python基础
---
# Python基础

## python语言基础

### 1. 数值运算

基本数值操作

```python
abs(15.6)
15.6

round(15.6)
16

round(15.4)
15

min(2,3,4,5)
2
max(2,3,4,5)
5

1.3e-5
1.3e-05

1.3e5
130000.0

0xFF
255
```

### 2.  字符串

```
tang_str = 'hello python'

tang = 'hello'+'python'
tang
'hellopython'

tang_str * 3
```

#### 字符串操作

```python
tang = '1 2 3 4 5'
tang.split
['1', '2', '3', '4', '5']

tang = '1,2,3,4,5'
tang = tang.split(',')
```

```
tang_str = ' '
tang_str.join(tang)
'1 2 3 4 5'
```

```
tang = 'hello python'
tang.replace('python','world')

'hello world'
```

```
tang2.upper()
'HELLO WORLD'
```

```python
tang = '    hello python    '
tang.strip()  # 去空操作
'hello python'

tang.lstrip()
'hello python    '
tang.rstrip()
'    hello python'
```

```python
'{} {} {}'.format('tang','yu','di')
'tang yu di'
'{2} {1} {0}'.format('tang','yu','di')
'di yu tang'
'{tang} {yu} {di}'.format(tang = 10, yu =5, di = 1)
'10 5 1'
```

```python
tang = 'tang yu di:'
b = 456.0
c = 789 
result = '%s %f %d' % (tang,b,c) 
result
'tang yu di: 456.000000 789'
```

### 3. 索引

```python
tang = 'tang yu di'
tang[0]
't'
tang[5]
'y'
tang[-1]
'i
```

```python
tang[0:4] # 切片 左闭右开
'tang'
tang[5:]
'yu di'
tang[:7]
'tang yu'
tang[1:-2] 
'ang yu '
tang[-3:]
' di'
tang[:]
'tang yu di'
tang[::2] # 步长为2 取偶数列
'tn ud'
```

### 4. list结构

```python
tang = []
type(tang)
list
```

```python
tang = [1,2,3,4]
tang = ['1','2','3','4']
tang = [1,'tangyudi',3.5]
tang = list([1,2,3])
tang
```

#### 操作

```python
a = [123,456]
b = ['tang','yudi']
a + b
[123, 456, 'tang', 'yudi']


a * 3
[123, 456, 123, 456, 123, 456]


a[0:]
[123, 456]
```

```python
a
[1, 2, 3, 4, 5, 6, 7, 8, 9]
del a[0]
a
[2, 3, 4, 5, 6, 7, 8, 9]
del a[3:]
a
[2, 3, 4]
```

```python
a = [1,2,3,4,5,6,7,8,9]
8 in a
False

tang = 'tang yu di'
'tang' in tang
True
```

```python
a = [1,2,[3,4]]
a
[1, 2, [3, 4]]

a[2]
[3, 4]
```

```python
tang =['apple','banana','apple','apple','apple','banana','banana']
tang.count('apple')
4

tang =['apple','1','2','3','4','5','6']
tang.index('apple') # 找索引
0
```

#### 列表添加

```python
tang = []
tang.append(['tang','yudi'])
tang
['tang', 'tang', 'tang', ['tang', 'yudi']]


tang.insert(2,'python')
tang
['tang', 'tang', 'python', 'tang', ['tang', 'yudi'], 'tang', 'tang']


tang.remove(['tang', 'yudi'])
tang
['tang', 'tang', 'python', 'tang', 'tang', 'tang']

tang.pop(1)
```

```python 
tang = [1,2,3,9,6,3,2]
tang.sort()
tang
[1, 2, 2, 3, 3, 6, 9]

tang = [1,2,3,9,6,3,2]
tang2 = sorted(tang)
[1, 2, 2, 3, 3, 6, 9]

tang = ['di','yu','tang']
tang.reverse()
['tang', 'yu', 'di']
```

### 5. 字典

```python
tang = {}
type(tang)
dict

tang = dict()
type(tang)

tang = dict()
type(tang)
dict
```

#### 字典结构操作

```python
tang['first'] = 123
tang
{'first': 123, 'python': 456}

tang['python']
456



tang = {'tang':123,'yu':456,'di':789}
tang
{'di': 789, 'tang': 123, 'yu': 456}

tang_value = [1,2,3]
tang = {}
tang['yudi'] = tang_value
tang['yudi2'] = 3
tang['yudi2'] = '4'
{'yudi': [1, 2, 3], 'yudi2': '4'}


tang = dict([('tang',123),('yudi',456)])
tang
{'tang': 123, 'yudi': 456}


tang['tang'] += 1
tang
{'tang': 125, 'yudi': 456}

tang.get('tang') # 取值

tang.pop('tang')
tang
{'yudi': 456}

del tang['yudi']


tang = {'tang':123,'yudi':456}
tang2 = {'tang':789,'python':888}
tang.update(tang2)
tang
{'python': 888, 'tang': 789, 'yudi': 456}
```

```python
tang.keys()
dict_keys(['tang', 'python', 'yudi'])

tang.values()
dict_values([789, 888, 456])

tang.items()
dict_items([('tang', 789), ('python', 888), ('yudi', 456)])
```

### 6. 集合

```python
tang = set([123,123,123,456,456,456,789])
tang
{123, 456, 789}
```

```python
a = {1,2,3,4}
b = {2,3,4,5}
a.union(b)  # 并集
{1, 2, 3, 4, 5}

a|b # 并集
{1, 2, 3, 4, 5}

b.intersection(a) # 交集
{2, 3, 4}
a & b
{2, 3, 4}

a.difference(b) # 差集
{1}
b.difference(a)
{5}
a - b
{1}
b - a
{5}

a = {1,2,3,4,5,6}
b = {2,3,4}
b.issubset(a) # 是否
True
a.issubset(b)
False

b <= a
True
b > a
False
a <= a
True
a < a
False

a = {1,2,3}
a.add(4)
a
{1, 2, 3, 4}

a.update([4,5,6])
a
{1, 2, 3, 4, 5, 6}

a.remove(1)
a
{2, 3, 4, 5, 6}

a.pop()
a
{3, 4, 5, 6}
```

### 7. 赋值机制

为了提高内存效率，如果值较小，两个地址是一样的

```python
tang = 1000
yudi = tang
id(tang)
2683811812688
id(yudi)
2683811812688
```

### 8. 判断结构 

```python
tang = 50
if tang >200:
    print ('200')
elif tang < 100:
    print ('100')
else:
    print ('100-200')
    

tang = [123,456,789]
if 123 in tang:
    print ('ok')
ok

tang = {'tang':123,'yudi':456}
if 'tang' in tang:
    print  ('ok')
ok
```

### 9.  循环结构

```python
tangs = set(['tang','yu','di'])
while tangs:
    tang = tangs.pop()
    print (tang)
    
for name in tangs:
    print (name)
```

### 10. python函数

```python
def add_ab(a=1,b=2):
    return (a+b)
tang = add_ab()
tang


def add_number(a,*args):  # 可以不指定输入个数
    b = 0
    for i in args:
        a += i
        b += a
    return a,b
a,b = add_number(1,2,3)
print (a,b)
6 9


def add_number2(a,**kwargs):
    for arg,value in kwargs.items():
        print (arg,value)
add_number2(1,x=2,y=3)
y 3
x 2
```

### 11. python模块和包

```python
%%writefile tang.py   # 写成一个脚本
tang_v = 10

def tang_add(tang_list):
    tang_sum = 0
    for i in range(len(tang_list)):
        tang_sum += tang_list[i]
    return tang_sum
tang_list = [1,2,3,4,5]
print (tang_add(tang_list))

%run tang.py
15

import tang
15
```

### 12. 异常

```python
import math

for i in range(10):
    try:
        input_number = input('write a number')
        
        if input_number == 'q':
            break
        result = 1/math.log(float(input_number))
        print (result)
    except ValueError:
        print ('ValueError: input must > 0')
    except ZeroDivisionError:
        print ('log(value) must != 0')
    except Exception:
        print ('ubknow error')
```

```python
class TangError(ValueError):
    pass

cur_list = ['tang','yu','di']
while True:
    cur_input = input()
    if cur_input not in cur_list:
        raise TangError('Invalid input: %s' %cur_input)
```

### 13. 文件操作

```python
%%writefile tang.txt
hello python
tang yu di
jin tian tian qi bu cuo

txt = open('./data/tang.txt')
txt_read = txt.read()


lines = txt.readlines()
print (type(lines))
print (lines)
<class 'list'>
['hello python\n', 'tang yu di\n', 'jin tian tian qi bu cuo']

txt.close()
```

```python
txt = open('tang_write.txt','w')
txt.write('jin tian tian qi bu cuo')
txt.write('\n')
txt.write('tang yu di')
txt.close()

txt = open('tang_write.txt','w')
for i in range(100):
    txt.write(str(i)+'\n')
txt2 = open('tang_write.txt','r')
print (txt2.read())
```

```python
txt = open('tang_write.txt','w')
try:
    for i in range(100):
        10/(i-50)
        txt.write(str(i)+'\n')
except Exception:
    print ('error:',i)
finally:
    txt.close()
    
with open('tang_write.txt','w') as f:
    f.write('jin tian tian qi bu cuo')
```

### 14. 类

```python
class people:
    '帮助信息：XXXXXX'
    #所有实力都会共享
    number = 100
    #构造函数，初始化的方法，当创建一个类的时候，首先会调用它
    def __init__(self,name,age):
        self.name = name
        self.age = age
    def display(self):
        print ('number = :',people.number)
    def display_name(self):
        print (self.name)
```

```python 
people.__doc__
'帮助信息：XXXXXX'

p1 = people('tangyudi',30)
```

### 15. 时间

```python
import time

print (time.time())


print (time.localtime(time.time()))
time.struct_time(tm_year=2017, tm_mon=11, tm_mday=15, tm_hour=14, tm_min=59, tm_sec=5, tm_wday=2, tm_yday=319, tm_isdst=0)


print (time.asctime(time.localtime(time.time())))
Wed Nov 15 15:00:15 2017
        
print (time.strftime('%Y-%m-%d %H:%M:%S',time.localtime()))
2017-11-15 15:02:07

import calendar
print (calendar.month(2017,11))
#print (help(calendar.month))
```
