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

```cpp
string 构造函数
string();//创建一个空的字符串 例如: string str;
string(const string& str);//使用一个string对象初始化另一个string对象
string(const char* s);//使用字符串s初始化
string(int n, char c);//使用n个字符c初始化 v

string基本赋值操作
string& operator=(const char* s);//char*类型字符串 赋值给当前的字符串
string& operator=(const string &s);//把字符串s赋给当前的字符串
string& operator=(char c);//字符赋值给当前的字符串
string& assign(const char *s);//把字符串s赋给当前的字符串
string& assign(const char *s, int n);//把字符串s的前n个字符赋给当前的字符串
string& assign(const string &s);//把字符串s赋给当前字符串
string& assign(int n, char c);//用n个字符c赋给当前字符串
string& assign(const string &s, int start, int n);//将s从start开始n个字符赋值给字符串
```

```cpp
void test01()
{
    string str1("hello world");
    cout << str1 << endl;   // hello world
    string str2(5,'A');
    cout << str2 << endl;   // AAAAA
    string str3 = str2;
    cout << str3 << endl;   // AAAAA

    string str4;
    str4 = "hello world";
    cout << str4 << endl; // hello world
    str4 = 'W';
    cout << str4 << endl;// 	W

    str4.assign("hello world", 5);
    cout << str4 << endl; //hello
    str4.assign(str1, 2, 3);
    cout << str4 << endl; // llo
}
```

### 2、string存取字符操作

```cpp
char& operator[](int n);//通过[]方式取字符
char& at(int n);//通过at方法获取字符
```

```cpp
void test02()
{
    string str1="hello world";
    cout << str1[1] << " " << str1.at(1) << endl; //e  e
    str1[1]='E';   // 取了之后赋值
    str1.at(6)='H';
    cout << str1 << endl; // hEllo Horld

    //[] 越界不会抛出异常 at越界会抛出异常
    try
    {
        //str1[1000]='A';
        str1.at(1000)='A';
    }
    catch (exception &e)
    {
        cout << "捕获到异常:" << e.what() << endl;
    }
}
```

### 3、string拼接操作

```cpp

string& operator+=(const string& str);//重载+=操作符
string& operator+=(const char* str);//重载+=操作符
string& operator+=(const char c);//重载+=操作符
string& append(const char *s);//把字符串s连接到当前字符串结尾
string& append(const char *s, int n);//把字符串s的前n个字符连接到当前字符串结尾
string& append(const string &s);//同operator+=()
string& append(const string &s, int pos, int n);//把字符串s中从pos开始的n个字符连接到当前字符串结尾
string& append(int n, char c);//在当前字符串结尾添加n个字符c
```

```cpp
void test03()
{
    string str1="hello";
    str1 += "world";
    cout << str1 << endl;

    string str2="hehe";
    str1 += str2;
    cout << str1 << endl;

    string str3="hello";
    string str4="world";
    cout << str3+str4 << endl;

    string str5="hello";
    string str6="world";
    str5.append(str6, 2, 3);
    cout << str5 << endl;
    str5.append("world", 3);
    cout << str5 << endl;
}

// 输出：helloworld
// 输出：helloworldhehe
// 输出：helloworld
// 输出：hellorld
// 输出：hellorldwor
```

### 4、string查找和替换

```cpp
int find(const string& str, int pos = 0) const; //查找str第一次出现位置,pos开始查找
int find(const char* s, int pos = 0) const; //查找s第一次出现位置,从pos开始查找
int find(const char* s, int pos, int n) const; //从pos位置查找s的前n个字第一次位置
int find(const char c, int pos = 0) const; //查找字符c第一次出现位置
int rfind(const string& str, int pos = npos) const;//查找str最后一次位置,从pos开始查找
int rfind(const char* s, int pos = npos) const;//查找s最后一次出现位置,从pos开始查找
int rfind(const char* s, int pos, int n) const;//从pos查找s的前n个字符最后一次位置
int rfind(const char c, int pos = 0) const; //查找字符c最后一次出现位置
string& replace(int pos, int n, const string& str); //替换从pos开始n个字符为字符串str
string& replace(int pos, int n, const char* s); //替换从pos开始的n个字符为字符串s
```

### 5、string比较操作

```cpp
> < == != 运算符 可用
/*
compare函数在>时返回 1，<时返回 -1，==时返回 0。
比较区分大小写，比较时参考字典顺序，排越前面的越小。
大写的A比小写的a小。
*/
int compare(const string &s) const;//与字符串s比较
int compare(const char *s) const;//与字符串s比较
```

### 6、提取string子串

```cpp
string substr(int pos = 0, int n = npos) const;//返回由pos开始的n个字符组成的字符串
```

```cpp
void test06()
{
    string str1="hehehe:hahaha:xixixi:lalala";
    int pos = 0;
    while (1)
    {
        int ret = str1.find(":", pos);
        if (ret < 0)
        {
            string tmp = str1.substr(pos, str1.size()-pos);
            cout << tmp << endl;
            break;
        }

        string tmp = str1.substr(pos, ret-pos);
        cout << tmp << endl;

        pos = ret+1;
    }
}
```

### 7、string插入和删除操作

```cpp
string& insert(int pos, const char* s); //插入字符串
string& insert(int pos, const string& str); //插入字符串
string& insert(int pos, int n, char c);//在指定位置插入n个字符c
string& erase(int pos, int n = npos);//删除从Pos开始的n个字符
```

### 8、 string和c-style字符串转换

![](https://cdn.jsdelivr.net/gh/clint-sfy/blogcdn@master/img/c_plus/STL2.png)
