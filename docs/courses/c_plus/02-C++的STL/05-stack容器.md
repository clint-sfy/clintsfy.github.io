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
 - stack
---
# C++的stack栈容器
## stack栈容器

stack是一种先进后出(First In Last Out,FILO)的数据结构。

操作数据的一端 叫栈顶。

top永远指向栈顶元素。

**栈容器没有迭代器。不支持遍历行为。**

```
1 3.4.3.1 stack构造函数
2 stack<T> stkT;//stack采用模板类实现， stack对象的默认构造形式：
3 stack(const stack &stk);//拷贝构造函数

4 3.4.3.2 stack赋值操作
5 stack& operator=(const stack &stk);//重载等号操作符

6 3.4.3.3 stack数据存取操作
7 push(elem);//向栈顶添加元素
8 pop();//从栈顶移除第一个元素
9 top();//返回栈顶元素

10 3.4.3.4 stack大小操作
11 empty();//判断堆栈是否为空
12 size();//返回堆栈的大小
```
