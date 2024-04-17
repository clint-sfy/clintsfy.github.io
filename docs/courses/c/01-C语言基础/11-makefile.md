---
title: C语言makefile
author: 阿源
date: 2023/01/11 11:15
categories:
 - C基础快速入门
tags:
 - C
 - C基础
---
# C语言makefile
## makefile的概述

```c
gcc a.c b.c c.c ‐o main
```

如果只修改了b.c 使用gcc编译 需要对所有文件重新编译。

make 是个命令，是个可执行程序，用来解析 Makefile 文件的命令

makefile 是个文件，这个文件中描述了咱们程序的编译规则。

采用 Makefile 的好处：

1、简化编译程序的时候输入得命令，编译的时候只需要敲 make 命令就可以了

2、可以节省编译时间，提高编译效率

## makefile的语法规则

```c
1 目标:依赖文件
2 命令列表
```

gcc a.c b.c c.c -o main

目标：就是需要生成的文件

依赖文件：通过依赖文件 生成 目标文件

命令列表：实现 将依赖文件 生成 目标文件

```c
1 main:a.c b.c c.c
2 gcc a.c b.c c.c ‐o main
```

```c
main:00_code.c
gcc 00_code.c ‐o main
```

make 默认在工作目录中寻找名为 GNUmakefile、makefile、Makefile 的文件作为

makefile 输入文件

make -f 自定义makefle文件名

make 工具默认会实现 makefile 文件内的第一个目标。

make 目标 ----->选择目标执行

## makefile的变量

### 1、自定义变量

1 变量名=变量值

引用变量： $(变量名)或${变量名}

```c
1 cc=gcc
2 exec=main
3 obj=main.o fun.o
4 $(exec):$(obj)
5 $(cc) $(obj) ‐o $(exec)
6 main.o:main.c
7 $(cc) ‐c main.c ‐o main.o
8 fun.o:fun.c
9 $(cc) ‐c fun.c ‐o fun.o
10 clean:
11 rm *.o $(exec)
```

###  **2、系统环境变量**

make 可以识别系统环境变量，在 makefile 中可直接读取或修改拷贝后的变量

查看环境变量：env

### 3、预定义变量

![](https://cdn.jsdelivr.net/gh/clint-sfy/blogcdn@master/img/c/makefile.png)

```make
1 cc=gcc
2 exec=main
3 obj=main.o fun.o
4 flags=‐Wall
5 $(exec):$(obj)
6 $(cc) $^ ‐o $@ $(flags)
7 %.o:%.c
8 $(cc) ‐c $< ‐o $@ $(flags)
9
10 clean:
11 rm $(obj) $(exec)
```

