---
title: JMM 与并发内存模型
date: 2026-09-22
category: Java系统补习
tags:
  - Java
  - JMM
  - 并发
description: 理解 Java 内存模型、happens-before、volatile 和安全发布。
---

# JMM 与并发内存模型

## 学习目标

- 理解线程工作内存、主内存和可见性/有序性/原子性。
- 用 happens-before 关系推断并发程序是否正确。
- 正确使用 volatile、final、锁和并发集合完成安全发布。

## 核心知识点

JMM 规定跨线程读写的可见性、有序性与同步语义，不等同于硬件缓存的直观模型。对同一监视器的解锁先于后续加锁；volatile 写先于后续读；线程启动、结束以及 Future 完成也建立 happens-before。volatile 适合状态标志和发布引用，不适合复合更新。final 字段的构造安全发布有特殊保证，但对象仍应通过安全方式共享。数据竞争使推理失效，应先建立同步边界。

## 实践任务

编写一个可停止的工作线程和一次性初始化组件：分别用 volatile 标志、synchronized 和静态 holder 实现；用 jcstress 风格测试或循环压力测试观察错误发布，并解释结果。

## 易错点

- 以为 volatile 同时提供互斥和计数原子性。
- 双重检查锁缺少 volatile，读取到未完整构造对象。
- 只凭单次运行结果断言“没有竞态”。
- 在锁外发布可变对象，调用方绕过保护修改状态。

## 复习清单

- [ ] 能列出常见 happens-before 边。
- [ ] 能判断 volatile 是否足够解决一个并发需求。
- [ ] 能写出安全发布和停止线程的最小实现。

