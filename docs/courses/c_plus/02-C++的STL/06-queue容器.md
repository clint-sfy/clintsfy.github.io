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

```cpp
queue<T> queT;//queue采用模板类实现，queue对象的默认构造形式：
queue(const queue &que);//拷贝构造函数

queue存取、插入和删除操作
push(elem);//往队尾添加元素
pop();//从队头移除第一个元素
back();//返回最后一个元素
front();//返回第一个元素

queue赋值操作
queue& operator=(const queue &que);//重载等号操作符
queue大小操作
empty();//判断队列是否为空
size();//返回队列的大小
```
