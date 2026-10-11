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

```cpp
deque构造函数
deque<T> deqT;//默认构造形式
deque(beg, end);//构造函数将[beg, end)区间中的元素拷贝给本身。
deque(n, elem);//构造函数将n个elem拷贝给本身。
deque(const deque &deq);//拷贝构造函数。

deque赋值操作
assign(beg, end);//将[beg, end)区间中的数据拷贝赋值给本身。
assign(n, elem);//将n个elem拷贝赋值给本身。
deque& operator=(const deque &deq); //重载等号操作符
swap(deq);// 将deq与本身的元素互换

deque大小操作
deque.size();//返回容器中元素的个数
deque.empty();//判断容器是否为空
deque.resize(num);//重新指定容器的长度为num,若容器变长，则以默认值填充新位置。如果容器变短，则末尾超出容器长度的元素被删除。
deque.resize(num, elem); //重新指定容器的长度为num,若容器变长，则以elem值填充新位置,如果容器变短，则末尾超出容器长度的元素被删除。

deque双端插入和删除操作
push_back(elem);//在容器尾部添加一个数据
push_front(elem);//在容器头部插入一个数据
pop_back();//删除容器最后一个数据
pop_front();//删除容器第一个数据

deque数据存取
at(idx);//返回索引idx所指的数据，如果idx越界，抛出out_of_range。
operator[];//返回索引idx所指的数据，如果idx越界，不抛出异常，直接出错。
front();//返回第一个数据。
back();//返回最后一个数据

deque插入操作
insert(pos,elem);//在pos位置插入一个elem元素的拷贝，返回新数据的位置。
insert(pos,n,elem);//在pos位置插入n个elem数据，无返回值。
insert(pos,beg,end);//在pos位置插入[beg,end)区间的数据，无返回值。

deque删除操作
clear();//移除容器的所有数据
erase(beg,end);//删除[beg,end)区间的数据，返回下一个数据的位置。
erase(pos);//删除pos位置的数据，返回下一个数据的位置
```

```cpp
#include <iostream>
#include <deque>
using namespace std;
void printfDequeInt(deque<int> &d)
{
    deque<int>::iterator it;
    for (it=d.begin(); it!=d.end();it++)
    {
        cout << *it << " ";
    }
    cout << endl;
}

void test01()
{
    deque<int> d1;
    d1.push_back(1);
    d1.push_back(2);
    d1.push_back(3);
    d1.push_front(4);
    d1.push_front(5);
    d1.push_front(6);
    printfDequeInt(d1);//6 5 4 1 2 3

    cout << "大小:" << d1.size() << endl;
    d1.pop_front();
    printfDequeInt(d1);//5 4 1 2 3
    d1.pop_back();
    printfDequeInt(d1);//5 4 1 2
    d1.insert(d1.begin()+1,3, 100);
    printfDequeInt(d1);//5 100 100 100 4 1 2
}

int main(int argc, char *argv[])
{
    test01();
    return 0;
}
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
#include <vector>
class Player
{
    public:
    string name;
    float score;
    public:
    Player(){}
    Player(string name,float score=0.0f)
    {
        this->name = name;
        this->score=score;
    }
};
void createPlayer(vector<Player> &v)
{
    string seedName = "ABCDE";
    int i=0;
    for (i=0;i<5;i++)
    {
        string tmpName = "选手";
        tmpName+=seedName[i];

        v.push_back(Player(tmpName));
    }
}

#include <stdlib.h>
#include <time.h>
#include <algorithm>
void playGame(vector<Player> &v)
{
    //设置随机数 种子
    srand(time(NULL));
    //每名选手都要参加
    vector<Player>::iterator it;
    for (it=v.begin(); it!=v.end();it++)
    {
        //10个评委打分
        deque<float> d;
        int i=0;
        for (i=0;i<10;i++)
        {
            d.push_back(rand()%41+60);
        }

        // 对d容器排序
        sort(d.begin(),d.end());

        //去掉最高分
        d.pop_back();
        //去掉最低分
        d.pop_front();

        //求总分数
        (*it).score = accumulate(d.begin(),d.end(), 0)/d.size();
    }
}
void showScore(vector<Player> &v)
{
    vector<Player>::iterator it;
    for (it=v.begin(); it!=v.end();it++)
    {
        cout << (*it).name << "所得分数:" << (*it).score << endl;
    }
}
void test02()
{
    //创建5名选手 放入vector容器中
    vector<Player> v;
    createPlayer(v);

    //开始比赛
    playGame(v);

    //公布成绩
    showScore(v);
}
```
