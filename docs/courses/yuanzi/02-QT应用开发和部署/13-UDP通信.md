---
title: UDP通信
author: 阿源
date: 2023/08/12 12:00
categories:
 - QT快速入门
tags:
 - C++
 - QT5
---

# 正点原子QT之UDP通信
## 15. UDP通信  

```
UDP（User Datagram Protocol 即用户数据报协议）是一个轻量级的，不可靠的，面向数据
报的无连接协议。 
但是由于 UDP 的特性：它不属于连接型协议，因而具有资源消耗小，处理速度快的优点，所以通常音频、视频和普通数据在传送时使用 UDP 较多，因为它们即使偶尔丢失一两个数据包，也不会对接收结果产生太大影响。
QUdpSocket 类提供了一个 UDP 套接字。 QUdpSocket 是 QAbstractSocket 的子类，允许发送和接收 UDP 数据报。使用该类最常见的方法是使用 bind()绑定到一个地址和端口，然后调用writeDatagram()和 readDatagram() / receiveDatagram()来传输数据。 注意发送数据般少于 512字节。如果发送多于 512 字节的数据，即使我们发送成功了，也会在 IP 层被分片（分成小片段）。
```

### 15.1 UDP 单播与广播  

```
广播 UDP 与单播 UDP 的区别就是 IP 地址不同，所以我们的实例可以写成一个。我们可以这么理解，单播实际上是通信上对应一对一，广播则是一对多（多，这里指广播地址内的所有主机）。
```

### 案例：UDP 单播 与广播应用  

本例大体流程首先获取本地 IP 地址。创建一个 udpSocket 套接字， 然后绑定本地主机的端口（也就是监听端口）。 我们可以使用 QUdpSocket 类提供的读写函数 readDatagram 和 writeDatagram，知道目标 IP 地址和端口，即可完成消息的接收发送。  

```

```

### 15.2 UDP 组播  

```
在广播方式下，信息会发送到不需要该信息的主机从而浪费带宽资源，甚至引起广播风暴：而单播方式下，会因为数据包的多次重复而浪费带宽资源，同时，源主机的负荷会因为多次的数据复制而加大，所以，单播与广播对于多点发送问题有缺陷。在此情况下，组播技术就应用而生了。
组播类似于 QQ 群，如果把腾讯向 QQ 每个用户发送推送消息比作广播，那么组播就像是QQ 群一样，只有群内的用户才能收到消息。想要收到消息，我们得先加群。
```

```
QUdpSocket 类支持 UDP 组播，提供了 joinMulticastGroup 方法使本地主机加入多播组，leaveMulticastGroup 离开多播组。其他绑定端口，发送接收功能与 UDP 单播和广播完全一样。实际上我们在上一个实例学会使用 joinMulticastGroup 和 leaveMulticastGroup 的应用即可！
```

### 案例：UDP 单播与广播应用  

### 15.3 qt网络下载

```
Qt 网 络 模 块 还 提 供 了 直 接 访 问 如 HTTP ， FTP 等 网 络 协 议 的 类 ， 这 些 类 是QNetworkAccessManager、 QNetworkRequest 和 QNetworkReply。
由 QNetworkRequest 类设置一个 URL 地址发起网络协议请求， QNetworkRequest 类保存要用 QNetworkAccessManager 发送的请求。 QNetworkRequest 是网络访问 API 的一部分，是一个持有通过网络发送请求所需信息的类。它包含一个 URL 和一些可用于修改请求的辅助信息。
QNetworkAccessManager 类允许应用程序发送网络请求并接收响应。 在 QNetworkRequest发起网络请求后， QNetworkAccessManager 负责发送网络请求，创建网络响应。
```

### 案例：下载小图片  

本例目的：了解 QNetworkAccessManager、 QNetworkRequest 和 QNetworkReply 类的使用。  

本例大体流程，设置一个下载图片的 URL，通过 networkReply 处理响应后，从流中读取图片的数据，然后保存到本地。  