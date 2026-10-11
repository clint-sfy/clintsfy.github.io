---
title: C++的set容器
author: 阿源
date: 2023/02/13 21:29
categories:
 - C++基础快速入门
tags:
 - C++
 - C++基础
 - STL
---
# C++的set容器
## set容器

### 1、set容器概述

![](https://cdn.jsdelivr.net/gh/clint-sfy/blogcdn@master/img/c_plus/STL7.png)

​         但是set容器 只有键值，在插入数据的时候 自动根据 键值 排序。不允许有相同的键值。不能修改set容器的元素值，会破坏set的数据结构。set容器的迭代器是只读迭代器（const_iterator）。

```cpp
set构造函数
set<T> st;//set默认构造函数：
mulitset<T> mst; //multiset默认构造函数:
set(const set &st);//拷贝构造函数

set赋值操作
set& operator=(const set &st);//重载等号操作符
swap(st);//交换两个集合容器

set大小操作
size();//返回容器中元素的数目
empty();//判断容器是否为空

set插入和删除操作
insert(elem);//在容器中插入元素。
clear();//清除所有元素
erase(pos);//删除pos迭代器所指的元素，返回下一个元素的迭代器。
erase(beg, end);//删除区间[beg,end)的所有元素 ，返回下一个元素的迭代器。
erase(elem);//删除容器中值为elem的元素。

set查找操作
find(key);//查找键key是否存在,若存在，返回该键的元素的迭代器；若不存在，返回set.end();
count(key);//查找键key的元素个数
lower_bound(keyElem);//返回第一个key>=keyElem元素的迭代器。
upper_bound(keyElem);//返回第一个key>keyElem元素的迭代器。
equal_range(keyElem);//返回容器中key与keyElem相等的上下限的两个迭代器
```

```cpp
#include <iostream>
#include <set>
using namespace std;
void printSetInt(set<int> &s)
{
    set<int>::iterator it;
    for (it=s.begin(); it!=s.end();it++)
    {
        cout << *it << " ";
    }
    cout << endl;
}

void test01()
{
    set<int> s1;
    s1.insert(30);
    s1.insert(10);
    s1.insert(20);
    s1.insert(20);
    s1.insert(40);
    printSetInt(s1);
}

int main(int argc, char *argv[])
{
    test01();
    return 0;
}
```

### 2、更改set容器的排序规则（定义set容器时 修改)

```cpp
set<int,排序规则类> s1;
```

一般都是通过 “仿函数” 修改set容器的排序规则。

```cpp
#include <iostream>
#include <set>
using namespace std;

//仿函数
class MyCompare
{
    public:
    bool operator()(int v1, int v2)
    {
        return v1>v2;
    }
};

void printSetInt(set<int> &s)
{
    set<int>::iterator it;
    for (it=s.begin(); it!=s.end();it++)
    {
        cout << *it << " ";
    }
    cout << endl;
}

void printSetInt(set<int,MyCompare> &s)
{
    set<int,MyCompare>::iterator it;
    for (it=s.begin(); it!=s.end();it++)
    {
        cout << *it << " ";
    }
    cout << endl;
}


void test01()
{
    set<int,MyCompare> s1;
    s1.insert(30);
    s1.insert(10);
    s1.insert(20);
    s1.insert(20);
    s1.insert(40);
    printSetInt(s1);  // 40 30 20 10
}

int main(int argc, char *argv[])
{
    test01();
    return 0;
}
```

### 3、如果set容器存放自定义数据 必须更改排序规则

```cpp
class Person
{
    friend class MyComparePerson;
    friend ostream& operator << (ostream &out, Person ob);
    private:
    int num;
    string name;
    float score;
    public:
    Person(){}
    Person(int num,string name, float score)
    {
        this->num = num;
        this->name = name;
        this->score = score;
    }
};
ostream& operator << (ostream &out, Person ob)
{
    out << ob.num << " " << ob.name << " " << ob.score << endl;
    return out;
}


class MyComparePerson
{
    public:
    bool operator()(Person ob1, Person ob2)
    {
        return ob1.num < ob2.num;
    }
};

void printSetInt(set<Person,MyComparePerson> &s)
{
    set<Person,MyComparePerson> ::iterator it;
    for (it=s.begin(); it!=s.end();it++)
    {
        cout << (*it);
    }
    cout << endl;
}
void test02()
{
    set<Person,MyComparePerson> s1;
    s1.insert(Person(100,"lucy", 88.8f));
    s1.insert(Person(104,"bob", 99.8f));
    s1.insert(Person(103,"tom", 77.8f));
    s1.insert(Person(101,"德玛", 66.8f));
    s1.insert(Person(105,"寒冰", 55.8f));
    printSetInt(s1);
}
```

### 4、set的API

```cpp
void test03()
{
    set<int> s1;
    s1.insert(10);
    s1.insert(30);
    s1.insert(50);
    s1.insert(70);
    s1.insert(90);
    printSetInt(s1);

    set<int>::const_iterator ret;
    ret = s1.find(50);
    if (ret != s1.end())
    {
        cout << "找到的结果:" << *ret << endl;
    }

    //count(key);//查找键key的元素个数 set容器的结果只能是0或1
    cout << s1.count(50) << endl;
}
```

### 5、查找元素的上下限

![](https://cdn.jsdelivr.net/gh/clint-sfy/blogcdn@master/img/c_plus/STL8.png)

```cpp
void test04()
{
    set<int> s1;
    s1.insert(10);
    s1.insert(30);
    s1.insert(50);
    s1.insert(70);
    s1.insert(90);
    printSetInt(s1);

    set<int>::const_iterator ret;

    //lower_bound(keyElem);//返回第一个key>=keyElem元素的迭代器。(下限)
    ret = s1.lower_bound(50);
    if (ret !=s1.end())
    {
        cout << "下限为:" << *ret << endl;
    }

    //upper_bound(keyElem);//返回第一个key>keyElem元素的迭代器（上限）
    ret = s1.upper_bound(50);
    if (ret !=s1.end())
    {
        cout << "上限为:" << *ret << endl;
    }

    //equal_range(keyElem);//返回容器中key与keyElem相等的上下限的两个迭代器
    //返回值类型为pair 对组
    pair< set<int>::const_iterator, set<int>::const_iterator> p;
    p = s1.equal_range(50);
    if (p.first != s1.end())
    {
        cout << "下限为:" << *(p.first) << endl;
    }
    if (p.second != s1.end())
    {
        cout << "上限为:" << *(p.second) << endl;
    }
}
```
## multiset容器

set容器：键值不允许重复

multiset容器：键值可以重复

![](https://cdn.jsdelivr.net/gh/clint-sfy/blogcdn@master/img/c_plus/STL9.png)
