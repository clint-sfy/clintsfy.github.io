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
---
# C++的vector容器
## vector容器

### 1.vector的概述

```cpp
vector容器：单端动态数组容器
必须包含头文件：#include<vector>
```

![](https://cdn.jsdelivr.net/gh/clint-sfy/blogcdn@master/img/c_plus/STL3.png)

push_back尾部插入元素、pop_back尾部删除元素

front()头元素、back()尾元素

begin()得到的是 容器的 起始迭代器（首元素的位置）

end() 得到的是 结束迭代器（尾元素的下一个元素位置）


```cpp
#include <iostream>
#include <vector>
using namespace std;
void test01()
{
    vector<int> v1;
    v1.push_back(10);
    v1.push_back(30);
    v1.push_back(50);
    v1.push_back(20);
    v1.push_back(40);

    //遍历容器
    //定义一个迭代器iterator 保存是元素的位置
    vector<int>::iterator it=v1.begin();
    for (;it!=v1.end(); it++)
    {
        //*it == int
        cout << *it << " ";
    }
    cout << endl;
}

int main(int argc, char *argv[])
{
    test01();
    return 0;
}

// 输出：10 30 50 20 40
```

```cpp
void test01()
{
    vector<int> v1;
    cout << "容量:" << v1.capacity() << " 大小:" << v1.size() << endl;
    vector<int>::iterator it;
    int i=0;
    int count = 0;
    for (i=1;i<=1000;i++)
    {
        v1.push_back(1);
        if (it != v1.begin())
        {
            count++;
            cout << "第" << count << "次开辟空间，容量为：" << v1.capacity() << endl;
            it=v1.begin();
        }
    }
}
```

### 2、vector API

```cpp
vector构造函数
vector<T> v; //采用模板实现类实现，默认构造函数
vector(v.begin(), v.end());//将v[begin(), end())区间中的元素拷贝给本身。
vector(n, elem);//构造函数将n个elem拷贝给本身。
vector(const vector &vec);//拷贝构造函数。


//例子 使用第二个构造函数 我们可以...
int arr[] = {2,3,4,1,9};
vector<int> v1(arr, arr + sizeof(arr) / sizeof(int));
vector常用赋值操作
assign(beg, end);//将[beg, end)区间中的数据拷贝赋值给本身。
assign(n, elem);//将n个elem拷贝赋值给本身。
vector& operator=(const vector &vec);//重载等号操作符
swap(vec);// 将vec与本身的元素互换。

vector大小操作
size();//返回容器中元素的个数
empty();//判断容器是否为空
resize(int num);//重新指定容器的长度为num，若容器变长，则以默认值填充新位置。
如果容器变短，则末尾超出容器长度的元素被删除。
resize(int num, elem);//重新指定容器的长度为num，若容器变长，则以elem值填充新
位置。如果容器变短，则末尾超出容器长>度的元素被删除。
capacity();//容器的容量
reserve(int len);//容器预留len个元素长度，预留位置不初始化，元素不可访问。

vector数据存取操作
at(int idx); //返回索引idx所指的数据，如果idx越界，抛出out_of_range异常。
operator[];//返回索引idx所指的数据，越界时，运行直接报错
front();//返回容器中第一个数据元素
back();//返回容器中最后一个数据元素

vector插入和删除操作
insert(const_iterator pos, int count, ele);//迭代器指向位置pos插入count个元素ele.
push_back(ele); //尾部插入元素ele
pop_back();//删除最后一个元素
erase(const_iterator start, const_iterator end);//删除迭代器从start到end之间的元素
erase(const_iterator pos);//删除迭代器指向的元素
clear();
```

### 3、巧用swap收缩空间

```cpp
void test04()
{
    vector<int> v1;
    v1.reserve(1000);
    v1.assign(5,100);
    cout << "大小:" << v1.size() << " 容量:" << v1.capacity() << endl;
    //v1.resize(3);
    vector<int>(v1).swap(v1);
    cout << "大小:" << v1.size() << " 容量:" << v1.capacity() << endl;
}
```

```cpp
// 输出：大小：5 容量：1000
// 输出：大小：5 容量：5
```

### 4、vector容器 嵌套 容器

```cpp
void test05()
{
    vector<int> v1(5,10);
    vector<int> v2(5,100);
    vector<int> v3(5,1000);

    //需求：定义一个容器 存放v1 v2 v3
    vector< vector<int> > v;
    v.push_back(v1);
    v.push_back(v2);
    v.push_back(v3);

    //遍历
    vector< vector<int> >::iterator it;
    for (it=v.begin(); it!=v.end(); it++)
    {
        //*it == vector<int>
        vector<int>::iterator mit;
        for (mit=(*it).begin();mit!=(*it).end();mit++ )
        {
            //*mit == int
            cout << *mit << " ";
        }
        cout << endl;
    }
}
```

### 5、使用算法 对 vector容器排序

```cpp
#include <algorithm>//算法头文件
bool myCompare(int value1, int value2)
{
    return value1<value2;
}
void test06()
{
    vector<int> v1;
    v1.push_back(20);
    v1.push_back(60);
    v1.push_back(30);
    v1.push_back(50);
    v1.push_back(40);
    v1.push_back(10);
    printVectorInt(v1);

    //sort算法排序
    sort(v1.begin(), v1.end());
    //sort(v1.begin(), v1.end(), greater<int>());
    //sort(v1.begin(), v1.end(), myCompare);
    printVectorInt(v1);
}
```

### 6、vector存放自定义数据类型

```cpp
class Person
{
    friend void printVectorPerson(vector<Person> &v);
    friend bool myComparePerson(const Person &ob1, const Person &ob2);
    private:
    int num;
    string name;
    float score;
    public:
    Person(){}
    Person(int num, string name, float score)
    {
        this->num = num;
        this->name = name;
        this->score = score;
    }
    #if 0
    //方法2：重载自定义数据的<运算符
    bool operator<(const Person &ob)
    {
        return this->num < ob.num;
    }
    #endif
};
void printVectorPerson(vector<Person> &v)
{
    vector<Person>::iterator it;
    for (it=v.begin(); it!=v.end(); it++)
    {
        //*it == Person
        cout << (*it).num << " " << (*it).name << " " << (*it).score << endl;
    }
}
//方法1：对于自定义容器排序 必须实现 排序规则
bool myComparePerson(const Person &ob1, const Person &ob2)
{
    if (ob1.num == ob2.num)
    return ob1.score<ob2.score;
    return ob1.num > ob2.num;
}

void test07()
{
    vector<Person> v;

    v.push_back(Person(100, "lucy", 88.8f));
    v.push_back(Person(103, "bob", 99.8f));
    v.push_back(Person(103, "tom", 77.8f));
    v.push_back(Person(103, "德玛", 88.8f));
    v.push_back(Person(101, "小法", 66.8f));

    printVectorPerson(v);
    //方法1：对于自定义容器排序 必须实现 排序规则
    sort(v.begin(), v.end(), myComparePerson);
    //方法2：重载自定义数据的<运算符
    //sort(v.begin(), v.end());
    cout << "--------------" << endl;
    printVectorPerson(v);
}
```
