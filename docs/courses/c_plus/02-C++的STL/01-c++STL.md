---
title: C++的STL概述
author: 阿源
date: 2023/02/06 21:29
categories:
 - C++基础快速入门
tags:
 - C++
 - C++基础
 - STL
---
# C++的STL概述
## STL的概述

STL(Standard Template Library,标准模板库)

STL的6大组件：容器、算法、迭代器、适配器、仿函数、空间配置

容器：存放数据

算法：操作数据

迭代器：算法 通过迭代器 操作 容器

适配器：为算法 提供更多的接口

仿函数：为算法 提供策略

空间配置：为算法、容器提供动态空间


算法分类：质变算法、非质变算法

质变算法：会更改容器的值（拷贝，替换，删除等等）

非质变算法：是指运算过程中不会更改区间内的元素内容，例如查找、计数、遍历、寻找极值等等

迭代器：算法和容器的桥梁

![](https://cdn.jsdelivr.net/gh/clint-sfy/blogcdn@master/img/c_plus/STL1.png)
