---
title: C++的deque容器
author: 阿源
date: 2023/02/09 21:29
categories:
 - C++基础快速入门
tags:
 - C++
 - C++基础
 - STL
---
# C++的deque容器
## deque容器

### 1、deque概述

deque:双端动态数组

![](https://cdn.jsdelivr.net/gh/clint-sfy/blogcdn@master/img/c_plus/STL4.png)

Deque容器和vector容器最大的差异，

一在于deque允许使用常数项时间对头端进行元素的插入和删除操作。

二在于deque没有容量的概念。

![](https://cdn.jsdelivr.net/gh/clint-sfy/blogcdn@master/img/c_plus/STL5.png)

### 2、deque的API

如果迭代器能+1 那么该迭代器 为随机访问迭代器

```
1 3.3.3.1 deque构造函数
2 deque<T> deqT;//默认构造形式
3 deque(beg, end);//构造函数将[beg, end)区间中的元素拷贝给本身。
4 deque(n, elem);//构造函数将n个elem拷贝给本身。
5 deque(const deque &deq);//拷贝构造函数。

6 3.3.3.2 deque赋值操作
7 assign(beg, end);//将[beg, end)区间中的数据拷贝赋值给本身。
8 assign(n, elem);//将n个elem拷贝赋值给本身。
9 deque& operator=(const deque &deq); //重载等号操作符
10 swap(deq);// 将deq与本身的元素互换

11 3.3.3.3 deque大小操作
12 deque.size();//返回容器中元素的个数
13 deque.empty();//判断容器是否为空
14 deque.resize(num);//重新指定容器的长度为num,若容器变长，则以默认值填充新位置。如果容器变短，则末尾超出容器长度的元素被删除。
15 deque.resize(num, elem); //重新指定容器的长度为num,若容器变长，则以elem值填充新位置,如果容器变短，则末尾超出容器长度的元素被删除。

16 3.3.3.4 deque双端插入和删除操作
17 push_back(elem);//在容器尾部添加一个数据
18 push_front(elem);//在容器头部插入一个数据
19 pop_back();//删除容器最后一个数据
20 pop_front();//删除容器第一个数据

21 3.3.3.5 deque数据存取
22 at(idx);//返回索引idx所指的数据，如果idx越界，抛出out_of_range。
23 operator[];//返回索引idx所指的数据，如果idx越界，不抛出异常，直接出错。
24 front();//返回第一个数据。
25 back();//返回最后一个数据

26 3.3.3.6 deque插入操作
27 insert(pos,elem);//在pos位置插入一个elem元素的拷贝，返回新数据的位置。
28 insert(pos,n,elem);//在pos位置插入n个elem数据，无返回值。
29 insert(pos,beg,end);//在pos位置插入[beg,end)区间的数据，无返回值。

30 3.3.3.7 deque删除操作
31 clear();//移除容器的所有数据
32 erase(beg,end);//删除[beg,end)区间的数据，返回下一个数据的位置。
33 erase(pos);//删除pos位置的数据，返回下一个数据的位置
```

```cpp
1 #include <iostream>
2 #include <deque>
3 using namespace std;
4 void printfDequeInt(deque<int> &d)
5 {
6 deque<int>::iterator it;
7 for(it=d.begin(); it!=d.end();it++)
8 {
9 cout<<*it<<" ";
10 }
11 cout<<endl;
12 }
13
14 void test01()
15 {
16 deque<int> d1;
17 d1.push_back(1);
18 d1.push_back(2);
19 d1.push_back(3);
20 d1.push_front(4);
21 d1.push_front(5);
22 d1.push_front(6);
23 printfDequeInt(d1);//6 5 4 1 2 3
24
25 cout<<"大小:"<<d1.size()<<endl;
26 d1.pop_front();
27 printfDequeInt(d1);//5 4 1 2 3
28 d1.pop_back();
29 printfDequeInt(d1);//5 4 1 2
30 d1.insert(d1.begin()+1,3, 100);
31 printfDequeInt(d1);//5 100 100 100 4 1 2
32 }
33
34 int main(int argc, char *argv[])
35 {
36 test01();
37 return 0;
38 }
```

### 3、deque容器的案例

vector存放的数据 没有多大的规律 只是纪录数据。

deque容器：用于类似竞技的数据

有5名选手：选手ABCDE，10个评委分别对每一名选手打分，去除最高分，去除评委中最低分，取平均分。

\1. 创建五名选手，放到vector中

\2. 遍历vector容器，取出来每一个选手，执行for循环，可以把10个评分打分存到deque容器中

\3. sort算法对deque容器中分数排序，pop_back pop_front去除最高和最低分

\4. deque容器遍历一遍，累加分数，累加分数/d.size()
\5. person.score = 平均分


```cpp
1 #include<vector>
2 class Player
3 {
4 public:
5 string name;
6 float score;
7 public:
8 Player(){}
9 Player(string name,float score=0.0f)
10 {
11 this‐>name = name;
12 this‐>score=score;
13 }
14 };
15 void createPlayer(vector<Player> &v)
16 {
17 string seedName = "ABCDE";
18 int i=0;
19 for(i=0;i<5;i++)
20 {
21 string tmpName = "选手";
22 tmpName+=seedName[i];
23
24 v.push_back(Player(tmpName));
25 }
26 }

27 #include<stdlib.h>
28 #include<time.h>
29 #include<algorithm>
30 void playGame(vector<Player> &v)
31 {
32 //设置随机数 种子
33 srand(time(NULL));
34 //每名选手都要参加
35 vector<Player>::iterator it;
36 for(it=v.begin(); it!=v.end();it++)
37 {
38 //10个评委打分
39 deque<float> d;
40 int i=0;
41 for(i=0;i<10;i++)
42 {
43 d.push_back(rand()%41+60);
44 }
45
46 // 对d容器排序
47 sort(d.begin(),d.end());
48
49 //去掉最高分
50 d.pop_back();
51 //去掉最低分
52 d.pop_front();
53
54 //求总分数
55 (*it).score = accumulate(d.begin(),d.end(), 0)/d.size();
56 }
57 }
58 void showScore(vector<Player> &v)
59 {
60 vector<Player>::iterator it;
61 for(it=v.begin(); it!=v.end();it++)
62 {
63 cout<<(*it).name<<"所得分数:"<<(*it).score<<endl;
64 }
65 }
66 void test02()
67 {
68 //创建5名选手 放入vector容器中
69 vector<Player> v;
70 createPlayer(v);
71
72 //开始比赛
73 playGame(v);
74
75 //公布成绩
76 showScore(v);
77 }
```