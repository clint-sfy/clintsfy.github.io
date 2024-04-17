---
title: C++的string容器
author: 阿源
date: 2023/02/07 21:29
categories:
 - C++基础快速入门
tags:
 - C++
 - C++基础
 - STL
---
# C++的string容器
## C++的string容器

### 1、构造函数以及赋值

```
1 3.1.2.1 string 构造函数
2 string();//创建一个空的字符串 例如: string str;
3 string(const string& str);//使用一个string对象初始化另一个string对象
4 string(const char* s);//使用字符串s初始化
5 string(int n, char c);//使用n个字符c初始化 v

6 3.1.2.2 string基本赋值操作
7 string& operator=(const char* s);//char*类型字符串 赋值给当前的字符串
8 string& operator=(const string &s);//把字符串s赋给当前的字符串
9 string& operator=(char c);//字符赋值给当前的字符串
10 string& assign(const char *s);//把字符串s赋给当前的字符串
11 string& assign(const char *s, int n);//把字符串s的前n个字符赋给当前的字符串
12 string& assign(const string &s);//把字符串s赋给当前字符串
13 string& assign(int n, char c);//用n个字符c赋给当前字符串
14 string& assign(const string &s, int start, int n);//将s从start开始n个字符赋值给字符串
```

```cpp
void test01()
{
   string str1("hello world");
   cout<<str1<<endl;   // hello world
   string str2(5,'A');
   cout<<str2<<endl;   // AAAAA
   string str3 = str2;
   cout<<str3<<endl;   // AAAAA
   
   string str4;
   str4 = "hello world";
   cout<<str4<<endl; // hello world
   str4 = 'W';
   cout<<str4<<endl;// 	W
   
   str4.assign("hello world", 5);
   cout<<str4<<endl; //hello 
   str4.assign(str1, 2, 3);
   cout<<str4<<endl; // llo
}
```

注意：以上代码是使用C++编写的。

### 2、string存取字符操作

```
1 char& operator[](int n);//通过[]方式取字符
2 char& at(int n);//通过at方法获取字符
```

```cpp
1 void test02()
2 {
3 string str1="hello world";
4 cout<<str1[1]<<" "<<str1.at(1)<<endl; //e  e
5 str1[1]='E';   // 取了之后赋值
6 str1.at(6)='H';
7 cout<<str1<<endl; // hEllo Horld
8
9 //[] 越界不会抛出异常 at越界会抛出异常
10 try
11 {
12 //str1[1000]='A';
13 str1.at(1000)='A';
14 }
15 catch(exception &e)
16 {
17 cout<<"捕获到异常:"<<e.what()<<endl;
18 }
19 }
```

### 3、string拼接操作

```
1 3.1.2.4
2 string& operator+=(const string& str);//重载+=操作符
3 string& operator+=(const char* str);//重载+=操作符
4 string& operator+=(const char c);//重载+=操作符
5 string& append(const char *s);//把字符串s连接到当前字符串结尾
6 string& append(const char *s, int n);//把字符串s的前n个字符连接到当前字符串结尾
7 string& append(const string &s);//同operator+=()
8 string& append(const string &s, int pos, int n);//把字符串s中从pos开始的n个字符连接到当前字符串结尾
9 string& append(int n, char c);//在当前字符串结尾添加n个字符c
```

```cpp
1 void test03()
2 {
3 string str1="hello";
4 str1 += "world";
5 cout<<str1<<endl;
6
7 string str2="hehe";
8 str1 += str2;
9 cout<<str1<<endl;
10
11 string str3="hello";
12 string str4="world";
13 cout<<str3+str4<<endl;
14
15 string str5="hello";
16 string str6="world";
17 str5.append(str6, 2, 3);
18 cout<<str5<<endl;
19 str5.append("world", 3);
20 cout<<str5<<endl;
21 }

helloworld
helloworldhehe
helloworld
hellorld
hellorldwor
```

### 4、string查找和替换

```
1 int find(const string& str, int pos = 0) const; //查找str第一次出现位置,pos开始查找
2 int find(const char* s, int pos = 0) const; //查找s第一次出现位置,从pos开始查找
3 int find(const char* s, int pos, int n) const; //从pos位置查找s的前n个字第一次位置
4 int find(const char c, int pos = 0) const; //查找字符c第一次出现位置
5 int rfind(const string& str, int pos = npos) const;//查找str最后一次位置,从pos开始查找
6 int rfind(const char* s, int pos = npos) const;//查找s最后一次出现位置,从pos开始查找
7 int rfind(const char* s, int pos, int n) const;//从pos查找s的前n个字符最后一次位置
8 int rfind(const char c, int pos = 0) const; //查找字符c最后一次出现位置
9 string& replace(int pos, int n, const string& str); //替换从pos开始n个字符为字符串str
10 string& replace(int pos, int n, const char* s); //替换从pos开始的n个字符为字符串s
```

### 5、string比较操作

```
1 > < == != 运算符 可用
2 /*
3 compare函数在>时返回 1，<时返回 ‐1，==时返回 0。
4 比较区分大小写，比较时参考字典顺序，排越前面的越小。
5 大写的A比小写的a小。
6 */
7 int compare(const string &s) const;//与字符串s比较
8 int compare(const char *s) const;//与字符串s比较
```

### 6、提取string子串

```
1 string substr(int pos = 0, int n = npos) const;//返回由pos开始的n个字符组成的字符串
```

```cpp
1 void test06()
2 {
3 string str1="hehehe:hahaha:xixixi:lalala";
4 int pos = 0;
5 while(1)
6 {
7 int ret = str1.find(":", pos);
8 if(ret < 0)
9 {
10 string tmp = str1.substr(pos, str1.size()‐pos);
11 cout<<tmp<<endl;
12 break;
13 }
14
15 string tmp = str1.substr(pos, ret‐pos);
16 cout<<tmp<<endl;
17
18 pos = ret+1;
19 }
20 }
```

### 7、string插入和删除操作

```
1 string& insert(int pos, const char* s); //插入字符串
2 string& insert(int pos, const string& str); //插入字符串
3 string& insert(int pos, int n, char c);//在指定位置插入n个字符c
4 string& erase(int pos, int n = npos);//删除从Pos开始的n个字符
```

### 8、 string和c-style字符串转换

![](https://cdn.jsdelivr.net/gh/clint-sfy/blogcdn@master/img/c_plus/STL2.png)

## 