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

![](https://cdn.staticaly.com/gh/clint-sfy/blogcdn@master/img/c_plus/STL7.png)

​         但是set容器 只有键值，在插入数据的时候 自动根据 键值 排序。不允许有相同的键值。不能修改set容器的元素值，会破坏set的数据结构。set容器的迭代器是只读迭代器（const_iterator）。

```
1 3.7.2.1 set构造函数
2 set<T> st;//set默认构造函数：
3 mulitset<T> mst; //multiset默认构造函数:
4 set(const set &st);//拷贝构造函数

5 3.7.2.2 set赋值操作
6 set& operator=(const set &st);//重载等号操作符
7 swap(st);//交换两个集合容器

8 3.7.2.3 set大小操作
9 size();//返回容器中元素的数目
10 empty();//判断容器是否为空

11 3.7.2.4 set插入和删除操作
12 insert(elem);//在容器中插入元素。
13 clear();//清除所有元素
14 erase(pos);//删除pos迭代器所指的元素，返回下一个元素的迭代器。
15 erase(beg, end);//删除区间[beg,end)的所有元素 ，返回下一个元素的迭代器。
16 erase(elem);//删除容器中值为elem的元素。

17 3.7.2.5 set查找操作
18 find(key);//查找键key是否存在,若存在，返回该键的元素的迭代器；若不存在，返回set.end();
19 count(key);//查找键key的元素个数
20 lower_bound(keyElem);//返回第一个key>=keyElem元素的迭代器。
21 upper_bound(keyElem);//返回第一个key>keyElem元素的迭代器。
22 equal_range(keyElem);//返回容器中key与keyElem相等的上下限的两个迭代器
```

```cpp
1 #include <iostream>
2 #include<set>
3 using namespace std;
4 void printSetInt(set<int> &s)
5 {
6 set<int>::iterator it;
7 for(it=s.begin(); it!=s.end();it++)
8 {
9 cout<<*it<<" ";
10 }
11 cout<<endl;
12 }
13
14 void test01()
15 {
16 set<int> s1;
17 s1.insert(30);
18 s1.insert(10);
19 s1.insert(20);
20 s1.insert(20);
21 s1.insert(40);
22 printSetInt(s1);
23 }
24
25 int main(int argc, char *argv[])
26 {
27 test01();
28 return 0;
29 }
```

### 2、更改set容器的排序规则（定义set容器时 修改)

```
1 set<int,排序规则类> s1;
```

一般都是通过 “仿函数” 修改set容器的排序规则。

```cpp
1 #include <iostream>
2 #include<set>
3 using namespace std;

4 //仿函数
5 class MyCompare
6 {
7 public:
8 bool operator()(int v1, int v2)
9 {
10 return v1>v2;
11 }
12 };

13 void printSetInt(set<int> &s)
14 {
15 set<int>::iterator it;
16 for(it=s.begin(); it!=s.end();it++)
17 {
18 cout<<*it<<" ";
19 }
20 cout<<endl;
21 }
22
23 void printSetInt(set<int,MyCompare> &s)
24 {
25 set<int,MyCompare>::iterator it;
26 for(it=s.begin(); it!=s.end();it++)
27 {
28 cout<<*it<<" ";
29 }
30 cout<<endl;
31 }
32
33
34 void test01()
35 {
36 set<int,MyCompare> s1;
37 s1.insert(30);
38 s1.insert(10);
39 s1.insert(20);
40 s1.insert(20);
41 s1.insert(40);
42 printSetInt(s1);  // 40 30 20 10
43 }
44
45 int main(int argc, char *argv[])
46 {
47 test01();
48 return 0;
49 }
```

### 3、如果set容器存放自定义数据 必须更改排序规则

```cpp
1 class Person
2 {
3 friend class MyComparePerson;
4 friend ostream& operator<<(ostream &out, Person ob);
5 private:
6 int num;
7 string name;
8 float score;
9 public:
10 Person(){}
11 Person(int num,string name, float score)
12 {
13 this‐>num = num;
14 this‐>name = name;
15 this‐>score = score;
16 }
17 };
18 ostream& operator<<(ostream &out, Person ob)
19 {
20 out<<ob.num<<" "<<ob.name<<" "<<ob.score<<endl;
21 return out;
22 }
23
    
24 class MyComparePerson
25 {
26 public:
27 bool operator()(Person ob1, Person ob2)
28 {
29 return ob1.num < ob2.num;
30 }
31 };

32 void printSetInt(set<Person,MyComparePerson> &s)
33 {
34 set<Person,MyComparePerson> ::iterator it;
35 for(it=s.begin(); it!=s.end();it++)
36 {
37 cout<<(*it);
38 }
39 cout<<endl;
40 }
41 void test02()
42 {
43 set<Person,MyComparePerson> s1;
44 s1.insert(Person(100,"lucy", 88.8f));
45 s1.insert(Person(104,"bob", 99.8f));
46 s1.insert(Person(103,"tom", 77.8f));
47 s1.insert(Person(101,"德玛", 66.8f));
48 s1.insert(Person(105,"寒冰", 55.8f));
49 printSetInt(s1);
50 }
```

### 4、set的API

```cpp
1 void test03()
2 {
3 set<int> s1;
4 s1.insert(10);
5 s1.insert(30);
6 s1.insert(50);
7 s1.insert(70);
8 s1.insert(90);
9 printSetInt(s1);
10
11 set<int>::const_iterator ret;
12 ret = s1.find(50);
13 if(ret != s1.end())
14 {
15 cout<<"找到的结果:"<<*ret<<endl;
16 }
17
18 //count(key);//查找键key的元素个数 set容器的结果只能是0或1
19 cout<<s1.count(50)<<endl;
20 }
```

### 5、查找元素的上下限

![](https://cdn.staticaly.com/gh/clint-sfy/blogcdn@master/img/c_plus/STL8.png)

```cpp
1 void test04()
2 {
3 set<int> s1;
4 s1.insert(10);
5 s1.insert(30);
6 s1.insert(50);
7 s1.insert(70);
8 s1.insert(90);
9 printSetInt(s1);
10
11 set<int>::const_iterator ret;
    
12 //lower_bound(keyElem);//返回第一个key>=keyElem元素的迭代器。(下限)
13 ret = s1.lower_bound(50);
14 if(ret !=s1.end())
15 {
16 cout<<"下限为:"<<*ret<<endl;
17 }
    
18 //upper_bound(keyElem);//返回第一个key>keyElem元素的迭代器（上限）
19 ret = s1.upper_bound(50);
20 if(ret !=s1.end())
21 {
22 cout<<"上限为:"<<*ret<<endl;
23 }
    
24 //equal_range(keyElem);//返回容器中key与keyElem相等的上下限的两个迭代器
25 //返回值类型为pair 对组
26 pair< set<int>::const_iterator, set<int>::const_iterator> p;
27 p = s1.equal_range(50);
28 if(p.first != s1.end())
29 {
30 cout<<"下限为:"<<*(p.first)<<endl;
31 }
32 if(p.second != s1.end())
33 {
34 cout<<"上限为:"<<*(p.second)<<endl;
35 }
36 }
```
## multiset容器

set容器：键值不允许重复

multiset容器：键值可以重复

![](https://cdn.staticaly.com/gh/clint-sfy/blogcdn@master/img/c_plus/STL9.png)