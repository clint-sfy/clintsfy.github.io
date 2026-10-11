---
title: C++的map容器
author: 阿源
date: 2023/02/14 21:29
categories:
 - C++基础快速入门
tags:
 - C++
 - C++基础
 - STL
---
# map容器
## pair对组

对组(pair)将一对值组合成一个值，这一对值可以具有不同的数据类型，两个值可以分别用pair的两个公有属性first和second访问

![](https://cdn.jsdelivr.net/gh/clint-sfy/blogcdn@master/img/c_plus/STL10.png)

## map容器

map容器：每个元素都是 键值-实值 成对存储，自动根据键值排序， 键值不能重复，不能修改。

map<int, Person>::const_iterator it;  他的迭代器很奇怪

```cpp
map构造函数
map<T1, T2> mapTT;//map默认构造函数:
map(const map &mp);//拷贝构造函数

map赋值操作
map& operator=(const map &mp);//重载等号操作符
swap(mp);//交换两个集合容器

map大小操作
size();//返回容器中元素的数目
empty();//判断容器是否为空

map插入数据元素操作
map.insert(...); //往容器插入元素，返回pair<iterator,bool>
map<int, string> mapStu;
// 第一种 通过pair的方式插入对象
mapStu.insert(pair<int, string>(3, "小张"));
// 第二种 通过pair的方式插入对象
mapStu.inset(make_pair(-1, "校长"));
// 第三种 通过value_type的方式插入对象
mapStu.insert(map<int, string>::value_type(1, "小李"));
// 第四种 通过数组的方式插入值
mapStu[3] = "小刘";
mapStu[5] = "小王";

map删除操作
clear();//删除所有元素
erase(pos);//删除pos迭代器所指的元素，返回下一个元素的迭代器。
erase(beg,end);//删除区间[beg,end)的所有元素 ，返回下一个元素的迭代器。
erase(keyElem);//删除容器中key为keyElem的对组。

map查找操作
find(key);//查找键key是否存在,若存在，返回该键的元素的迭代器；/若不存在，返回map.end();
count(keyElem);//返回容器中key为keyElem的对组个数。对map来说，要么是0，要么是1。对multimap来说，值可能大于1。
lower_bound(keyElem);//返回第一个key>=keyElem元素的迭代器。
upper_bound(keyElem);//返回第一个key>keyElem元素的迭代器。
equal_range(keyElem);//返回容器中key与keyElem相等的上下限的两个迭代器
```

```cpp
#include <iostream>
#include <map>
using namespace std;
class Person
{
    friend void test01();
    friend void printMapAll(map<int, Person> &m);
    private:
    int num;
    string name;
    float score;
    public:
    Person(){}
    Person(int num,string name, float score);
};

void printMapAll(map<int, Person> &m)
{
    map<int, Person>::const_iterator it;
    for (it=m.begin(); it!=m.end();it++)
    {
        //(*it) ==pair<int, Person>
        cout << "学号:" << (*it).first << " 姓名:" << (*it).second.name << " \
        分数:" << (*it).second.score << endl;
    }
}


void test01()
{
    map<int, Person> m;
    //方式1：
    m.insert(pair<int,Person>(103, Person(103,"lucy", 88.8f)));
    //方式2：推荐
    m.insert(make_pair(101,Person(101,"bob", 77.7f)));
    //方式3：
    m.insert( map<int, Person>::value_type( 102 , Person(102,"tom",
    66.6f)));
    //方式4:
    m[104] = Person(104,"德玛", 99.9f);

    printMapAll(m);

    //假如key值存在 m[key]代表对应的实值
    cout << m[107].num << " " << m[107].name << " " << m[107].score << endl;

    cout << "----------" << endl;
    printMapAll(m);

    m.erase(104);
    cout << "----------" << endl;
    printMapAll(m);

    //查找key为103的数据
    map<int, Person>::const_iterator ret;
    ret = m.find(103);
    if (ret != m.end())
    {
        //*ret == pair<int,Person>
        cout << (*ret).first << " " << (*ret).second.name << " "
         << (*ret).second.score << endl;
    }
}

int main(int argc, char *argv[])
{
    test01();
    return 0;
}

Person::Person(int num, string name, float score)
{
    this->num = num;
    this->name = name;
    this->score = score;
}
```

## multimap案例

```cpp
#define SALE_DEPATMENT 1 //销售部门
#define DEVELOP_DEPATMENT 2 //研发部门
#define FINACIAL_DEPATMENT 3 //财务部门
#include <iostream>
#include <vector>
#include <string>
#include <stdlib.h>
#include <time.h>
#include <map>
using namespace std;
class Person
{
    friend void showDepartmentPerson(multimap<int,Person> &m);
    friend void personJoinDepartment(vector<Person> &v,
    multimap<int,Person> &m);
    private:
    string name;
    int age;
    int money;
    string tel;
    public:
    Person(){}
    Person(string name, int age, int money, string tel);
};

void createVectorPerson(vector<Person> &v);
void personJoinDepartment(vector<Person> &v, multimap<int,Person> &m);
void showDepartmentPerson(multimap<int,Person> &m);
int main(int argc, char *argv[])
{
    //创建vector容器 存放 员工
    vector<Person> v;
    createVectorPerson(v);

    //5名员工加入部门
    multimap<int, Person> m;
    personJoinDepartment(v, m);

    //显示部门员工
    showDepartmentPerson(m);

    return 0;
}

Person::Person(string name, int age, int money, string tel)
{
    this->name = name;
    this->age = age;
    this->money = money;
    this->tel = tel;
}

void createVectorPerson(vector<Person> &v)
{
    //设置随机数种子
    srand(time(NULL));
    int i=0;
    for (i=0;i<5; i++)
    {
        string seedName="ABCDE";
        string tmpName = "员工";
        tmpName += seedName[i];
        int age = 20+i;
        int money = 15000+rand()%10*1000;
        string tel = to_string(rand());

        v.push_back(Person(tmpName,age,money,tel));
    }
    return;
}

void personJoinDepartment(vector<Person> &v, multimap<int,Person> &m)
{
    vector<Person>::iterator it;
    for (it=v.begin(); it != v.end(); it++)
    {
        //*it == Person
        cout << "请输入[" << (*it).name << "]加入的部门0(销售)、1(研发)、2(财务):";
        int op = 0;
        cin >> op;

        m.insert(make_pair(op, *it));
        //(m[op]) = (*it);
    }
}

void showDepartmentPerson(multimap<int,Person> &m)
{
    cout << "请选择你要显示的部门0(销售)、1(研发)、2(财务):";
    int op = 0;
    cin >> op;

    switch (op) {
        case 0:
        cout << "-------销售部门员工如下----------" << endl;
        break;
        case 1:
        cout << "-------研发部门员工如下----------" << endl;
        break;
        case 2:
        cout << "-------财务部门员工如下----------" << endl;
        break;
    }

    //0 1 1 1 2
    //寻找op的位置
    multimap<int,Person>::const_iterator ret;
    ret = m.find(op);
    if (ret == m.end())
    return;
    //统计op的个数
    int count = m.count(op);

    //从op的位置 按照个数 逐个遍历
    int i=0;
    for (i=0;i<count; i++, ret++)
    {
        //*ret == pair<int, Person>
        cout << "\t" << (*ret).second.name << " " << (*ret).second.age << " "\
         << (*ret).second.money << " " << (*ret).second.tel << endl;
    }
    return;
}
```
