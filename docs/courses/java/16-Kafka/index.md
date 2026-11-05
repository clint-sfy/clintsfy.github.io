---
title: Kafka
date: 2026-11-05
category: Java课程
tags: [Java, Kafka, 消息队列]
description: 从消息模型到 Java 客户端、Spring Kafka、可靠性与集群的顺序学习路线。
---

# Kafka

按下面顺序读。先理解消息为什么要异步传递，再动手创建 Topic，最后学习可靠性与集群。图片课程中的 Spring Boot 2.x 和 ZooKeeper 作为历史背景；这里的实践统一采用 JDK 20、Spring Boot 3 和 KRaft。Kafka 4.0 已移除 ZooKeeper 模式，见 [Apache Kafka 升级说明](https://kafka.apache.org/40/getting-started/upgrade/)。

1. [学习路线与目标](./01-学习路线与目标)：先认清整条学习路径。
2. [消息队列与 MQ 核心知识](./02-消息队列与MQ核心知识)：理解异步、解耦与不同交付语义。
3. [Kafka 快速入门与安装](./03-Kafka快速入门与安装)：搭建 KRaft 单节点并收发消息。
4. [命令行生产消费与消息模型](./04-命令行生产消费与消息模型)：用命令验证 Topic、分区、偏移量。
5. [Spring Boot 集成与 Admin API](./05-Spring-Boot集成与Admin-API)：配置连接、创建和查看 Topic。
6. [Producer API 与发送实践](./06-Producer-API与发送实践)：学习发送、回调、幂等和分区。
7. [Consumer API 与消费实践](./07-Consumer-API与消费实践)：学习轮询、消费组、位移和再均衡。
8. [存储、复制与可靠性](./08-存储复制与可靠性)：理解日志、ISR、ACK 和水位。
9. [高可用与性能](./09-高可用与性能)：规划集群、故障恢复和吞吐。
10. [Spring Kafka 项目整合](./10-Spring-Kafka项目整合)：将发送与监听接入服务。
11. [总结与选型](./11-总结与选型)：回顾边界，决定什么时候使用 Kafka。

示例默认使用本机 `localhost:9092` 和实验 Topic；业务环境应配置认证、权限、超时与监控。[Kafka 官方文档](https://kafka.apache.org/documentation/)和[Spring Kafka 文档](https://docs.spring.io/spring-kafka/reference/)是后续速查入口。
