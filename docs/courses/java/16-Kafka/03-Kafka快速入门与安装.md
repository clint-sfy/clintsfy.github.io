---
title: Kafka 快速入门与安装
date: 2026-11-05
category: Java课程
tags: [Java, Kafka, KRaft]
description: 使用 KRaft 启动本地 Kafka 并建立第一个 Topic。
---

# Kafka 快速入门与安装

## KRaft 与旧版 ZooKeeper

KRaft 把元数据控制面放进 Kafka 自己的 controller quorum。截图里的 ZooKeeper 安装步骤只适合维护旧集群；新实验从 KRaft 开始，Kafka 4.0 已移除 ZooKeeper 模式。[官方升级说明](https://kafka.apache.org/40/getting-started/upgrade/)。

## 本地启动顺序

下载与所选版本一致的官方二进制包，先阅读包内 `config` 示例，再按[官方快速开始](https://kafka.apache.org/quickstart/)生成 cluster ID、格式化**新建的实验数据目录**并启动服务。格式化操作会初始化元数据，绝不能对已有生产数据目录重新执行。

```bash
bin/kafka-topics.sh --bootstrap-server localhost:9092 --create --topic learning.events --partitions 1 --replication-factor 1
bin/kafka-topics.sh --bootstrap-server localhost:9092 --describe --topic learning.events
```

单节点的副本数只能是 1，适合学习 API，不代表高可用。`advertised.listeners` 决定客户端拿到的 Broker 地址；容器内服务可用但宿主机 Java 连不上时，先检查这个配置。
