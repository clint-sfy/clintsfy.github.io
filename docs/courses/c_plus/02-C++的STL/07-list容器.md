---
title: C++的list容器
author: 阿源
date: 2023/02/12 21:29
categories:
 - C++基础快速入门
tags:
 - C++
 - C++基础
 - STL
---
# C++的list容器
## list链表容器

list是双向循环链表

![](https://cdn.jsdelivr.net/gh/clint-sfy/blogcdn@master/img/c_plus/STL6.png)

list容器的迭代器是 双向迭代器。

```cpp
list构造函数
list<T> lstT;//list采用采用模板类实现,对象的默认构造形式：
list(beg,end);//构造函数将[beg, end)区间中的元素拷贝给本身。
list(n,elem);//构造函数将n个elem拷贝给本身。
list(const list &lst);//拷贝构造函数。

list数据元素插入和删除操作
push_back(elem);//在容器尾部加入一个元素
pop_back();//删除容器中最后一个元素
push_front(elem);//在容器开头插入一个元素
pop_front();//从容器开头移除第一个元素
insert(pos,elem);//在pos位置插elem元素的拷贝，返回新数据的位置。
insert(pos,n,elem);//在pos位置插入n个elem数据，无返回值。
insert(pos,beg,end);//在pos位置插入[beg,end)区间的数据，无返回值。
clear();//移除容器的所有数据
erase(beg,end);//删除[beg,end)区间的数据，返回下一个数据的位置。
erase(pos);//删除pos位置的数据，返回下一个数据的位置。
remove(elem);//删除容器中所有与elem值匹配的元素。

list大小操作
size();//返回容器中元素的个数
empty();//判断容器是否为空
resize(num);//重新指定容器的长度为num，
若容器变长，则以默认值填充新位置。
如果容器变短，则末尾超出容器长度的元素被删除。
resize(num, elem);//重新指定容器的长度为num，
若容器变长，则以elem值填充新位置。
如果容器变短，则末尾超出容器长度的元素被删除。

list赋值操作
assign(beg, end);//将[beg, end)区间中的数据拷贝赋值给本身。
assign(n, elem);//将n个elem拷贝赋值给本身。
list& operator=(const list &lst);//重载等号操作符
swap(lst);//将lst与本身的元素互换。

list数据的存取
front();//返回第一个元素。
back();//返回最后一个元素。

list反转排序
reverse();//反转链表，比如lst包含1,3,5元素，运行此方法后，lst就包含5,3,1元素。
sort(); //list排序
```

```cpp
#include <iostream>
#include <list>
#include <algorithm>
using namespace std;
void printListInt(list<int> &l)
{
    list<int>::iterator it;
    for (it=l.begin(); it!=l.end();it++)
    {
        cout << *it << " ";
    }
    cout << endl;
}

void test01()
{
    list<int> l1;
    l1.push_back(10);
    l1.push_back(20);
    l1.push_back(30);
    l1.push_front(40);
    l1.push_front(50);
    l1.push_front(60);

    printListInt(l1);//60 50 40 10 20 30
    //list容器 是双向迭代器 不支持+2 支持++
    list<int>::iterator it=l1.begin();
    it++;
    it++;
    l1.insert(it, 3, 100);
    printListInt(l1);//60 50 100 100 100 40 10 20 30

    //删除所有100
    l1.remove(100);
    printListInt(l1);//60 50 40 10 20 30

    //对链表排序
    //STL提供的算法 只支持 随机访问迭代器，而list是双向迭代器 所以sort不支持list
    // l1.sort(greater<int>());
    l1.sort();
    printListInt(l1);//10 20 30 40 50 60
}

int main(int argc, char *argv[])
{
    test01();
    return 0;
}

```
