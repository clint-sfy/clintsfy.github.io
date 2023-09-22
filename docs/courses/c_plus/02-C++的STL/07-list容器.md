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

```
1 3.6.4.1 list构造函数
2 list<T> lstT;//list采用采用模板类实现,对象的默认构造形式：
3 list(beg,end);//构造函数将[beg, end)区间中的元素拷贝给本身。
4 list(n,elem);//构造函数将n个elem拷贝给本身。
5 list(const list &lst);//拷贝构造函数。

6 3.6.4.2 list数据元素插入和删除操作
7 push_back(elem);//在容器尾部加入一个元素
8 pop_back();//删除容器中最后一个元素
9 push_front(elem);//在容器开头插入一个元素
10 pop_front();//从容器开头移除第一个元素
11 insert(pos,elem);//在pos位置插elem元素的拷贝，返回新数据的位置。
12 insert(pos,n,elem);//在pos位置插入n个elem数据，无返回值。
13 insert(pos,beg,end);//在pos位置插入[beg,end)区间的数据，无返回值。
14 clear();//移除容器的所有数据
15 erase(beg,end);//删除[beg,end)区间的数据，返回下一个数据的位置。
16 erase(pos);//删除pos位置的数据，返回下一个数据的位置。
17 remove(elem);//删除容器中所有与elem值匹配的元素。

18 3.6.4.3 list大小操作
19 size();//返回容器中元素的个数
20 empty();//判断容器是否为空
21 resize(num);//重新指定容器的长度为num，
22 若容器变长，则以默认值填充新位置。
23 如果容器变短，则末尾超出容器长度的元素被删除。
24 resize(num, elem);//重新指定容器的长度为num，
25 若容器变长，则以elem值填充新位置。
26 如果容器变短，则末尾超出容器长度的元素被删除。
    
27 3.6.4.4 list赋值操作
28 assign(beg, end);//将[beg, end)区间中的数据拷贝赋值给本身。
29 assign(n, elem);//将n个elem拷贝赋值给本身。
30 list& operator=(const list &lst);//重载等号操作符
31 swap(lst);//将lst与本身的元素互换。

32 3.6.4.5 list数据的存取
33 front();//返回第一个元素。
34 back();//返回最后一个元素。

35 3.6.4.6 list反转排序
36 reverse();//反转链表，比如lst包含1,3,5元素，运行此方法后，lst就包含5,3,1元素。
37 sort(); //list排序
```

```cpp
1 #include <iostream>
2 #include <list>
3 #include <algorithm>
4 using namespace std;
5 void printListInt(list<int> &l)
6 {
7 list<int>::iterator it;
8 for(it=l.begin(); it!=l.end();it++)
9 {
10 cout<<*it<<" ";
11 }
12 cout<<endl;
13 }
14
15 void test01()
16 {
17 list<int> l1;
18 l1.push_back(10);
19 l1.push_back(20);
20 l1.push_back(30);
21 l1.push_front(40);
22 l1.push_front(50);
23 l1.push_front(60);
24
25 printListInt(l1);//60 50 40 10 20 30
26 //list容器 是双向迭代器 不支持+2 支持++
27 list<int>::iterator it=l1.begin();
28 it++;
29 it++;
30 l1.insert(it, 3, 100);
31 printListInt(l1);//60 50 100 100 100 40 10 20 30
32
33 //删除所有100
34 l1.remove(100);
35 printListInt(l1);//60 50 40 10 20 30
36
37 //对链表排序
38 //STL提供的算法 只支持 随机访问迭代器，而list是双向迭代器 所以sort不支持list
39 // l1.sort(greater<int>());
40 l1.sort();
41 printListInt(l1);//10 20 30 40 50 60
42 }
43
44 int main(int argc, char *argv[])
45 {
46 test01();
47 return 0;
48 }
49
```
