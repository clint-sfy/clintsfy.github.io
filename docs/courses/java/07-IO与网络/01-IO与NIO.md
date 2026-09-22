---
title: I/O 与 NIO 文件处理
date: 2026-09-22
category: Java系统补习
tags:
  - Java
  - I/O
  - NIO
  - 文件
description: 掌握字节流、字符流、Path/Files、通道与缓冲区的文件处理方法。
---

# I/O 与 NIO 文件处理

## 学习目标

- 区分字节流、字符流、缓冲流和对象序列化。
- 用 Path/Files 完成遍历、复制、原子移动和权限检查。
- 理解 NIO Channel、Buffer、Selector 与阻塞/非阻塞边界。

## 核心知识点

字节流适合二进制，Reader/Writer 适合文本，文本读写始终显式指定字符集。优先使用 `Path` 和 `Files`；大文件用缓冲、分块或流式遍历，避免一次性读入内存。try-with-resources 管理流和通道。序列化有版本和安全风险，跨服务数据优先使用明确格式。NIO 的 Buffer 有 position、limit、capacity 状态，调用 `flip` 切换读写模式；Selector 适合管理大量非阻塞通道。

## 实践任务

实现目录备份工具：递归复制、过滤扩展名、校验文件大小和 SHA-256，失败时保留错误清单；再用 Files.lines 统计大文件，观察内存占用。

## 易错点

- 忘记关闭流、通道，或关闭顺序错误导致文件句柄泄漏。
- 用默认字符集读写跨平台文件。
- Buffer 写入后忘记 flip，读到空数据。
- 路径拼接未规范化，产生目录穿越风险。

## 复习清单

- [ ] 能为二进制、文本和大文件选择 I/O API。
- [ ] 能解释 Buffer 的 position/limit/capacity。
- [ ] 能为文件输入做路径、权限、编码和资源关闭检查。

