---
title: Redis
date: 2026-10-06
category: Java课程
tags: [Java, Redis]
description: 按数据模型、String、Hash、集合及专用数据结构学习 Redis 命令和使用边界。
---

# Redis

本章以 Redis 8 稳定主版本为语义基线，官方文档核对日期为 2026-10-06；不声明未验证的补丁版本。先在独立本机实验服务使用 redis-cli 重建输入并读取结果，明确学习 key 的命名、容量和清理范围。[Redis 官方文档](https://redis.io/docs/latest/develop/data-types/) 是技术事实依据。

- [基础连接与数据模型](./01-基础连接与数据模型)
- [String 与计数器](./02-String与计数器)
- [Hash 与对象字段](./03-Hash与对象字段)
- [List、Set 与 Sorted Set](./04-List-Set与Sorted-Set)
- [Bitmap、HyperLogLog、GEO 与 Stream](./05-Bitmap-HyperLogLog-GEO与Stream)

依次掌握连接与字节模型、单值与原子计数、局部字段读写、队列与去重排名，再选择精确位图、近似基数、空间检索和事件日志。String 适合完整值，Hash 适合字段更新，List 适合简易队列，Set 适合精确名单，Sorted Set 适合按分数排名；Bitmap 需要有界 ID，HyperLogLog 接受统计误差，GEO 接受距离近似，Stream 需要保留与消费进度策略。

此处五篇是 Redis Core 的数据结构事实源。后续章节继续讨论 key 生命周期、事务与脚本、持久化与缓存一致性、消费组、锁、Java 客户端和集群生产运行；连接 Java 前先读懂原生命令返回与超时边界。
