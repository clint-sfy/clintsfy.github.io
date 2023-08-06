---
title: C++的vector容器
author: 阿源
date: 2023/02/08 21:29
categories:
 - C++基础快速入门
tags:
 - C++
 - C++基础
 - STL
 - vector
---
# C++的vector容器
## vector容器

### 1.vector的概述

```
vector容器：单端动态数组容器
必须包含头文件：#include<vector>
```

![](https://cdn.staticaly.com/gh/clint-sfy/blogcdn@master/img/c_plus/STL3.png)

push_back尾部插入元素、pop_back尾部删除元素

front()头元素、back()尾元素

begin()得到的是 容器的 起始迭代器（首元素的位置）

end() 得到的是 结束迭代器（尾元素的下一个元素位置）


```cpp
1 #include <iostream>
2 #include <vector>
3 using namespace std;
4 void test01()
5 {
6 vector<int> v1;
7 v1.push_back(10);
8 v1.push_back(30);
9 v1.push_back(50);
10 v1.push_back(20);
11 v1.push_back(40);
12
13 //遍历容器
14 //定义一个迭代器iterator 保存是元素的位置
15 vector<int>::iterator it=v1.begin();
16 for(;it!=v1.end(); it++)
17 {
18 //*it == int
19 cout<<*it<<" ";
20 }
21 cout<<endl;
22 }
23
24 int main(int argc, char *argv[])
25 {
26 test01();
27 return 0;
28 }

10 30 50 20 40
```

```cpp
1 void test01()
2 {
3 vector<int> v1;
4 cout<<"容量:"<<v1.capacity()<<" 大小:"<<v1.size()<<endl;
5 vector<int>::iterator it;
6 int i=0;
7 int count = 0;
8 for(i=1;i<=1000;i++)
9 {
10 v1.push_back(1);
11 if(it != v1.begin())
12 {
13 count++;
14 cout<<"第"<<count<<"次开辟空间，容量为："<<v1.capacity()<<endl;
15 it=v1.begin();
16 }
17 }
18 }
```

### 2、vector API

```
1 3.2.4.1 vector构造函数
2 vector<T> v; //采用模板实现类实现，默认构造函数
3 vector(v.begin(), v.end());//将v[begin(), end())区间中的元素拷贝给本身。
4 vector(n, elem);//构造函数将n个elem拷贝给本身。
5 vector(const vector &vec);//拷贝构造函数。

6
7 //例子 使用第二个构造函数 我们可以...
8 int arr[] = {2,3,4,1,9};
9 vector<int> v1(arr, arr + sizeof(arr) / sizeof(int));
10 3.2.4.2 vector常用赋值操作
11 assign(beg, end);//将[beg, end)区间中的数据拷贝赋值给本身。
12 assign(n, elem);//将n个elem拷贝赋值给本身。
13 vector& operator=(const vector &vec);//重载等号操作符
14 swap(vec);// 将vec与本身的元素互换。

15 3.2.4.3 vector大小操作
16 size();//返回容器中元素的个数
17 empty();//判断容器是否为空
18 resize(int num);//重新指定容器的长度为num，若容器变长，则以默认值填充新位置。
如果容器变短，则末尾超出容器长度的元素被删除。
19 resize(int num, elem);//重新指定容器的长度为num，若容器变长，则以elem值填充新
位置。如果容器变短，则末尾超出容器长>度的元素被删除。
20 capacity();//容器的容量
21 reserve(int len);//容器预留len个元素长度，预留位置不初始化，元素不可访问。

22 3.2.4.4 vector数据存取操作
23 at(int idx); //返回索引idx所指的数据，如果idx越界，抛出out_of_range异常。
24 operator[];//返回索引idx所指的数据，越界时，运行直接报错
25 front();//返回容器中第一个数据元素
26 back();//返回容器中最后一个数据元素

27 3.2.4.5 vector插入和删除操作
28 insert(const_iterator pos, int count, ele);//迭代器指向位置pos插入count个元素ele.
29 push_back(ele); //尾部插入元素ele
30 pop_back();//删除最后一个元素
31 erase(const_iterator start, const_iterator end);//删除迭代器从start到end之间的元素
32 erase(const_iterator pos);//删除迭代器指向的元素
33 clear();
```

### 3、巧用swap收缩空间

```cpp
1 void test04()
2 {
3 vector<int> v1;
4 v1.reserve(1000);
5 v1.assign(5,100);
6 cout<<"大小:"<<v1.size()<<" 容量:"<<v1.capacity()<<endl;
7 //v1.resize(3);
8 vector<int>(v1).swap(v1);
9 cout<<"大小:"<<v1.size()<<" 容量:"<<v1.capacity()<<endl;
10 }
```

```
大小：5 容量：1000
大小：5 容量：5
```

### 4、vector容器 嵌套 容器

```cpp
1 void test05()
2 {
3 vector<int> v1(5,10);
4 vector<int> v2(5,100);
5 vector<int> v3(5,1000);
6
7 //需求：定义一个容器 存放v1 v2 v3
8 vector< vector<int> > v;
9 v.push_back(v1);
10 v.push_back(v2);
11 v.push_back(v3);
12
13 //遍历
14 vector< vector<int> >::iterator it;
15 for(it=v.begin(); it!=v.end(); it++)
16 {
17 //*it == vector<int>
18     vector<int>::iterator mit;
19     for(mit=(*it).begin();mit!=(*it).end();mit++ )
20     {
21        //*mit == int
22        cout<<*mit<<" ";
23      }
24      cout<<endl;
25 }
26 }
```

### 5、使用算法 对 vector容器排序

```cpp
1 #include<algorithm>//算法头文件
2 bool myCompare(int value1, int value2)
3 {
4 return value1<value2;
5 }
6 void test06()
7 {
8 vector<int> v1;
9 v1.push_back(20);
10 v1.push_back(60);
11 v1.push_back(30);
12 v1.push_back(50);
13 v1.push_back(40);
14 v1.push_back(10);
15 printVectorInt(v1);
16
17 //sort算法排序
18 sort(v1.begin(), v1.end());
19 //sort(v1.begin(), v1.end(), greater<int>());
20 //sort(v1.begin(), v1.end(), myCompare);
21 printVectorInt(v1);
22 }
```

### 6、vector存放自定义数据类型

```cpp
1 class Person
2 {
3 friend void printVectorPerson(vector<Person> &v);
4 friend bool myComparePerson(const Person &ob1, const Person &ob2);
5 private:
6 int num;
7 string name;
8 float score;
9 public:
10 Person(){}
11 Person(int num, string name, float score)
12 {
13 this‐>num = num;
14 this‐>name = name;
15 this‐>score = score;
16 }
17 #if 0
18 //方法2：重载自定义数据的<运算符
19 bool operator<(const Person &ob)
20 {
21 return this‐>num < ob.num;
22 }
23 #endif
24 };
25 void printVectorPerson(vector<Person> &v)
26 {
27 vector<Person>::iterator it;
28 for(it=v.begin(); it!=v.end(); it++)
29 {
30 //*it == Person
31 cout<<(*it).num<<" "<<(*it).name<<" "<<(*it).score<<endl;
32 }
33 }
34 //方法1：对于自定义容器排序 必须实现 排序规则
35 bool myComparePerson(const Person &ob1, const Person &ob2)
36 {
37 if(ob1.num == ob2.num)
38 return ob1.score<ob2.score;
39 return ob1.num > ob2.num;
40 }
41
42 void test07()
43 {
44 vector<Person> v;
45
46 v.push_back(Person(100, "lucy", 88.8f));
47 v.push_back(Person(103, "bob", 99.8f));
48 v.push_back(Person(103, "tom", 77.8f));
49 v.push_back(Person(103, "德玛", 88.8f));
50 v.push_back(Person(101, "小法", 66.8f));
51
52 printVectorPerson(v);
53 //方法1：对于自定义容器排序 必须实现 排序规则
54 sort(v.begin(), v.end(), myComparePerson);
55 //方法2：重载自定义数据的<运算符
56 //sort(v.begin(), v.end());
57 cout<<"‐‐‐‐‐‐‐‐‐‐‐‐‐‐"<<endl;
58 printVectorPerson(v);
59 }
```
