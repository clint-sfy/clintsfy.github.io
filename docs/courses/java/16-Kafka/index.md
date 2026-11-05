---
title: Kafka
date: 2026-11-05
category: Java课程
tags: [Java, Kafka, 消息队列]
description: 从消息模型到 Java 客户端、Spring Kafka、可靠性与集群的顺序学习路线。
---

# Kafka

Kafka 是分布式事件流平台。学习时先问三个问题：**谁写入事件？事件按什么顺序存储？谁从哪个位置读取？** 这分别对应 Producer（生产者）、Topic 分区日志和 Consumer（消费者）的 offset（位移）。

## 为什么按这个顺序学

先用命令行发一条消息，能看见原始行为；再写 Java 客户端，才知道 API 映射到哪一步。理解分区与 offset 后，再学消费组、ACK、复制和故障恢复。直接从 Spring 注解入手，容易把自动提交、重试和重复消费混在一起。

打个比方：如果你开一家快递站，得先搞清楚"谁寄包裹""包裹按什么顺序放在货架上""谁取包裹"，再去研究怎么批量收件、怎么保证不丢件。Kafka 的学习也是同样的逻辑。

## 学完应能做什么

- 画出 Producer → Broker 分区 → Consumer Group 的完整数据流。
- 用 Java 创建 Topic、发送消息、读取消息和处理失败。
- 解释"至少一次"为什么会重复，以及业务如何做幂等。
- 区分四个阶段：消息已到 Broker、已被复制、已被消费、业务已完成。
- 规划分区数、副本数和消费组实例数的关系。
- 判断什么时候该用 Kafka，什么时候不该用。

## 阅读顺序

按下面顺序读。先理解消息为什么要异步传递，再动手创建 Topic，最后学习可靠性与集群。

1. [消息队列与 MQ 核心知识](./02-消息队列与MQ核心知识)：理解异步、解耦与不同交付语义。
2. [Kafka 快速入门与安装](./03-Kafka快速入门与安装)：搭建 KRaft 单节点并收发消息。
3. [命令行生产消费与消息模型](./04-命令行生产消费与消息模型)：用命令验证 Topic、分区、偏移量。
4. [Spring Boot 集成与 Admin API](./05-Spring-Boot集成与Admin-API)：配置连接、创建和查看 Topic。
5. [Producer API 与发送实践](./06-Producer-API与发送实践)：学习发送、回调、幂等和分区。
6. [Consumer API 与消费实践](./07-Consumer-API与消费实践)：学习轮询、消费组、位移和再均衡。
7. [存储、复制与可靠性](./08-存储复制与可靠性)：理解日志、ISR、ACK 和水位。
8. [高可用、性能与总结选型](./09-高可用与性能)：规划集群、故障恢复、吞吐，回顾边界并决定什么时候使用 Kafka。
9. [Spring Kafka 项目整合](./10-Spring-Kafka项目整合)：将发送与监听接入服务。

图片课程中的 Spring Boot 2.x 和 ZooKeeper 作为历史背景；这里的实践统一采用 JDK 20、Spring Boot 3 和 KRaft。Kafka 4.0 已移除 ZooKeeper 模式，见 [Apache Kafka 升级说明](https://kafka.apache.org/40/getting-started/upgrade/)。

示例默认使用本机 `localhost:9092` 和实验 Topic；业务环境应配置认证、权限、超时与监控。[Kafka 官方文档](https://kafka.apache.org/documentation/)和[Spring Kafka 文档](https://docs.spring.io/spring-kafka/reference/)是后续速查入口。
