---
title: C++的stack容器
author: 阿源
date: 2023/02/10 21:29
categories:
 - C++基础快速入门
tags:
 - C++
 - C++基础
 - STL
---
# C++的stack栈容器
## stack栈容器

stack是一种先进后出(First In Last Out,FILO)的数据结构。

操作数据的一端 叫栈顶。

top永远指向栈顶元素。

**栈容器没有迭代器。不支持遍历行为。**

```cpp
stack构造函数
stack<T> stkT;//stack采用模板类实现， stack对象的默认构造形式：
stack(const stack &stk);//拷贝构造函数

stack赋值操作
stack& operator=(const stack &stk);//重载等号操作符

stack数据存取操作
push(elem);//向栈顶添加元素
pop();//从栈顶移除第一个元素
top();//返回栈顶元素

stack大小操作
empty();//判断堆栈是否为空
size();//返回堆栈的大小
```
