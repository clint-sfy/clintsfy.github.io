---
title: C++的queue容器
author: 阿源
date: 2023/02/11 21:29
categories:
 - C++基础快速入门
tags:
 - C++
 - C++基础
 - STL
---
# C++的queue队列容器
## queue队列容器

Queue是一种先进先出(First In First Out,FIFO)的数据结构



出数据的一方叫队头，入数据的一方叫队尾。

queue容器没有迭代器 不支持遍历行为。

```
1 queue<T> queT;//queue采用模板类实现，queue对象的默认构造形式：
2 queue(const queue &que);//拷贝构造函数

3 3.5.3.2 queue存取、插入和删除操作
4 push(elem);//往队尾添加元素
5 pop();//从队头移除第一个元素
6 back();//返回最后一个元素
7 front();//返回第一个元素

8 3.5.3.3 queue赋值操作
9 queue& operator=(const queue &que);//重载等号操作符
10 3.5.3.4 queue大小操作
11 empty();//判断队列是否为空
12 size();//返回队列的大小
```
