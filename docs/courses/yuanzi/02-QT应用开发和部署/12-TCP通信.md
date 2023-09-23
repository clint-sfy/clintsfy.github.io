---
title: TCP通信
author: 阿源
date: 2023/08/12 12:00
categories:
 - QT快速入门
tags:
 - C++
 - QT5
---
# 正点原子QT之TCP通信
## 14. TCP通信

### 14.1 网络通信

```
获取本机的网络信息,在 Windows 通过调出命令行 cmd 窗口输入 ipconfig 或者在 Linux 系统中使用 ifconfig 命令就可以查看相关信息了,
```

### 案例：获 取 本 机 网 络 接 口 信 息  

本例目的：了解如何通过 QHostInfo 和 QNetworkInterface 类获取本地网络所有接口的信息。  

```cpp
QString MainWindow::getHostInfo()
91 {
92 /* 通过 QHostInfo 的 localHostName 函数获取主机名称 */
93 QString str = "主机名称： " + QHostInfo::localHostName() + "\n";
94
95 /* 获取所有的网络接口，
96 * QNetworkInterface 类提供主机的 IP 地址和网络接口的列表 */
97 QList<QNetworkInterface> list
98 = QNetworkInterface::allInterfaces();
99
100 /* 遍历 list */
101 foreach (QNetworkInterface interface, list) {
102 str+= "网卡设备:" + interface.name() + "\n";
103 str+= "MAC 地址:" + interface.hardwareAddress() + "\n";
104
105 /* QNetworkAddressEntry 类存储 IP 地址子网掩码和广播地址 */
106 QList<QNetworkAddressEntry> entryList
107 = interface.addressEntries();
108
109 /* 遍历 entryList */
110 foreach (QNetworkAddressEntry entry, entryList) {
111 /* 过滤 IPv6 地址，只留下 IPv4 */
112 if (entry.ip().protocol() ==
113 QAbstractSocket::IPv4Protocol) {
114 str+= "IP 地址:" + entry.ip().toString() + "\n";
115 str+= "子网掩码:" + entry.netmask().toString() + "\n";
116 str+= "广播地址:" + entry.broadcast().toString() + "\n\n";
117 }
118 }
119 }
120
121 /* 返回网络信息 */
122 return str;
123 }
```

### 14.2 TCP 通信 简介

```
TCP 协议（Transmission Control Protocol）全称是传输控制协议是一种面向连接的、可靠的、基于字节流的传输层通信协议。
TCP 通信必须先建立 TCP 连接，通信端分为客户端和服务端。服务端通过监听某个端口来监听是否有客户端连接到来，如果有连接到来，则建立新的 socket 连接；客户端通过 ip 和port 连接服务端，当成功建立连接之后，就可进行数据的收发了。需要注意的是，在 Qt 中，Qt 把 socket 当成输入输出流来对待的，数据的收发是通过 read()和 write()来进行的，需要与我们常见的 send()与 recv()进行区分。
```

### 案例：TCP 服务端

例 08_tcpserver， TCP 服务端（难度：一般）。  本例大体流程首先获取本地 IP 地址。创建一个 tcpSocket 套接字，一个 tcpServer 服务端。点击监听即监听本地的主机 IP 地址和端口，同时等待服务端的连接。此程序需要结合客户端一起使用。  

### 案例：TCP客户端

本例大体流程：首先获取本地 IP 地址。创建一个 tcpSocket 套接字， 然后用 tcpSocket 套接字使用 connectToHost函数连接服务端的主机 IP 地址和端口，即可相互通信。  
