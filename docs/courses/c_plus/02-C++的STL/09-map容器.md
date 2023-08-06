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
 - map
---
# map容器
## pair对组

对组(pair)将一对值组合成一个值，这一对值可以具有不同的数据类型，两个值可以分别用pair的两个公有属性first和second访问

![](https://cdn.staticaly.com/gh/clint-sfy/blogcdn@master/img/c_plus/STL10.png)

## map容器

map容器：每个元素都是 键值-实值 成对存储，自动根据键值排序， 键值不能重复，不能修改。

map<int, Person>::const_iterator it;  他的迭代器很奇怪

```
1 map构造函数
2 map<T1, T2> mapTT;//map默认构造函数:
3 map(const map &mp);//拷贝构造函数

4 3.8.2.2 map赋值操作
5 map& operator=(const map &mp);//重载等号操作符
6 swap(mp);//交换两个集合容器

7 3.8.2.3 map大小操作
8 size();//返回容器中元素的数目
9 empty();//判断容器是否为空

10 3.8.2.4 map插入数据元素操作
11 map.insert(...); //往容器插入元素，返回pair<iterator,bool>
12 map<int, string> mapStu;
13 // 第一种 通过pair的方式插入对象
14 mapStu.insert(pair<int, string>(3, "小张"));
15 // 第二种 通过pair的方式插入对象
16 mapStu.inset(make_pair(‐1, "校长"));
17 // 第三种 通过value_type的方式插入对象
18 mapStu.insert(map<int, string>::value_type(1, "小李"));
19 // 第四种 通过数组的方式插入值
20 mapStu[3] = "小刘";
21 mapStu[5] = "小王";

22 3.8.2.5 map删除操作
23 clear();//删除所有元素
24 erase(pos);//删除pos迭代器所指的元素，返回下一个元素的迭代器。
25 erase(beg,end);//删除区间[beg,end)的所有元素 ，返回下一个元素的迭代器。
26 erase(keyElem);//删除容器中key为keyElem的对组。

27 3.8.2.6 map查找操作
28 find(key);//查找键key是否存在,若存在，返回该键的元素的迭代器；/若不存在，返回map.end();
29 count(keyElem);//返回容器中key为keyElem的对组个数。对map来说，要么是0，要么是1。对multimap来说，值可能大于1。
30 lower_bound(keyElem);//返回第一个key>=keyElem元素的迭代器。
31 upper_bound(keyElem);//返回第一个key>keyElem元素的迭代器。
32 equal_range(keyElem);//返回容器中key与keyElem相等的上下限的两个迭代器
```

```cpp
1 #include <iostream>
2 #include <map>
3 using namespace std;
4 class Person
5 {
6 friend void test01();
7 friend void printMapAll(map<int, Person> &m);
8 private:
9 int num;
10 string name;
11 float score;
12 public:
13 Person(){}
14 Person(int num,string name, float score);
15 };

16 void printMapAll(map<int, Person> &m)
17 {
18 map<int, Person>::const_iterator it;
19 for(it=m.begin(); it!=m.end();it++)
20 {
21 //(*it) ==pair<int, Person>
22 cout<<"学号:"<<(*it).first<<" 姓名:"<<(*it).second.name<<" \
23 分数:"<<(*it).second.score<<endl;
24 }
25 }
26
    
27 void test01()
28 {
29 map<int, Person> m;
30 //方式1：
31 m.insert(pair<int,Person>(103, Person(103,"lucy", 88.8f)));
32 //方式2：推荐
33 m.insert(make_pair(101,Person(101,"bob", 77.7f)));
34 //方式3：
35 m.insert( map<int, Person>::value_type( 102 , Person(102,"tom",
66.6f)));
36 //方式4:
37 m[104] = Person(104,"德玛", 99.9f);
38
39 printMapAll(m);
40
41 //假如key值存在 m[key]代表对应的实值
42 cout<< m[107].num<<" "<<m[107].name<<" "<<m[107].score<<endl;
43
44 cout<<"‐‐‐‐‐‐‐‐‐‐"<<endl;
45 printMapAll(m);
46
47 m.erase(104);
48 cout<<"‐‐‐‐‐‐‐‐‐‐"<<endl;
49 printMapAll(m);
50
51 //查找key为103的数据
52 map<int, Person>::const_iterator ret;
53 ret = m.find(103);
54 if(ret != m.end())
55 {
56 //*ret == pair<int,Person>
57 cout<<(*ret).first<<" "<<(*ret).second.name<<" "
<<(*ret).second.score<<endl;
58 }
59 }
60
61 int main(int argc, char *argv[])
62 {
63 test01();
64 return 0;
65 }
66
67 Person::Person(int num, string name, float score)
68 {
69 this‐>num = num;
70 this‐>name = name;
71 this‐>score = score;
72 }
```

## multimap案例

```cpp
1 #define SALE_DEPATMENT 1 //销售部门
2 #define DEVELOP_DEPATMENT 2 //研发部门
3 #define FINACIAL_DEPATMENT 3 //财务部门
1 #include <iostream>
2 #include <vector>
3 #include <string>
4 #include <stdlib.h>
5 #include <time.h>
6 #include <map>
7 using namespace std;
8 class Person
9 {
10 friend void showDepartmentPerson(multimap<int,Person> &m);
11 friend void personJoinDepartment(vector<Person> &v,
multimap<int,Person> &m);
12 private:
13 string name;
14 int age;
15 int money;
16 string tel;
17 public:
18 Person(){}
19 Person(string name, int age, int money, string tel);
20 };
21
22 void createVectorPerson(vector<Person> &v);
23 void personJoinDepartment(vector<Person> &v, multimap<int,Person> &m);
24 void showDepartmentPerson(multimap<int,Person> &m);
25 int main(int argc, char *argv[])
26 {
27 //创建vector容器 存放 员工
28 vector<Person> v;
29 createVectorPerson(v);
30
31 //5名员工加入部门
32 multimap<int, Person> m;
33 personJoinDepartment(v, m);
34
35 //显示部门员工
36 showDepartmentPerson(m);
37
38 return 0;
39 }
40
41 Person::Person(string name, int age, int money, string tel)
42 {
43 this‐>name = name;
44 this‐>age = age;
45 this‐>money = money;
46 this‐>tel = tel;
47 }
48
49 void createVectorPerson(vector<Person> &v)
50 {
51 //设置随机数种子
52 srand(time(NULL));
53 int i=0;
54 for(i=0;i<5; i++)
55 {
56 string seedName="ABCDE";
57 string tmpName = "员工";
58 tmpName += seedName[i];
59 int age = 20+i;
60 int money = 15000+rand()%10*1000;
61 string tel = to_string(rand());
62
63 v.push_back(Person(tmpName,age,money,tel));
64 }
65 return;
66 }
67
68 void personJoinDepartment(vector<Person> &v, multimap<int,Person> &m)
69 {
70 vector<Person>::iterator it;
71 for(it=v.begin(); it != v.end(); it++)
72 {
73 //*it == Person
74 cout<<"请输入["<<(*it).name<<"]加入的部门0(销售)、1(研发)、2(财务):";
75 int op = 0;
76 cin>>op;
77
78 m.insert(make_pair(op, *it));
79 //(m[op]) = (*it);
80 }
81 }
82
83 void showDepartmentPerson(multimap<int,Person> &m)
84 {
85 cout<<"请选择你要显示的部门0(销售)、1(研发)、2(财务):";
86 int op = 0;
87 cin>>op;
88
89 switch (op) {
90 case 0:
91 cout<<"‐‐‐‐‐‐‐销售部门员工如下‐‐‐‐‐‐‐‐‐‐"<<endl;
92 break;
93 case 1:
94 cout<<"‐‐‐‐‐‐‐研发部门员工如下‐‐‐‐‐‐‐‐‐‐"<<endl;
95 break;
96 case 2:
97 cout<<"‐‐‐‐‐‐‐财务部门员工如下‐‐‐‐‐‐‐‐‐‐"<<endl;
98 break;
99 }
100
101 //0 1 1 1 2
102 //寻找op的位置
103 multimap<int,Person>::const_iterator ret;
104 ret = m.find(op);
105 if(ret == m.end())
106 return;
107 //统计op的个数
108 int count = m.count(op);
109
110 //从op的位置 按照个数 逐个遍历
111 int i=0;
112 for(i=0;i<count; i++, ret++)
113 {
114 //*ret == pair<int, Person>
115 cout<<"\t"<<(*ret).second.name<<" "<<(*ret).second.age<<" "\
116 <<(*ret).second.money<<" "<<(*ret).second.tel<<endl;
117 }
118 return;
119 }
```
