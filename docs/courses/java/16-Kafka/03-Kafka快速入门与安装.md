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

## 本地启动：先让 Broker 可用

本篇固定使用官方 Kafka 4.1.2 镜像，后续页面都连接 `localhost:9092`。电脑需先安装并启动 Docker。在 PowerShell 中运行：

```powershell
docker run -d --name kafka-lab -p 9092:9092 apache/kafka:4.1.2
docker logs kafka-lab --tail 30
```

第一条启动单节点 KRaft 服务；第二条查看启动日志。下载镜像需要网络，启动后才运行下面的命令。已有同名容器会使第一条报错，先检查 `docker ps -a`，不要对其他容器执行清理命令。[官方 Docker 快速开始](https://kafka.apache.org/41/getting-started/quickstart/)。

## 创建实验 Topic 并验证

```powershell
docker exec kafka-lab /opt/kafka/bin/kafka-topics.sh --bootstrap-server localhost:9092 --create --topic learning.events --partitions 1 --replication-factor 1
docker exec kafka-lab /opt/kafka/bin/kafka-topics.sh --bootstrap-server localhost:9092 --describe --topic learning.events
```

第一次应显示 `Created topic learning.events.`；第二次看到 `PartitionCount: 1` 和 `ReplicationFactor: 1`。重复创建会提示 Topic 已存在，说明无需再次创建。单节点的副本数只能是 1，适合学习 API，不代表高可用。

## Java 示例需要什么依赖

建立一个普通 Maven 项目，JDK 设为 20。纯 Java 客户端示例使用下面的依赖；Spring Boot 示例改用 Boot 依赖管理的 `spring-kafka`，不要在同一项目硬塞另一版客户端。

```xml
<dependency>
    <groupId>org.apache.kafka</groupId>
    <artifactId>kafka-clients</artifactId>
    <version>4.1.2</version>
</dependency>
```

后续每个纯 Java 代码块都是完整类：复制到同名 `.java` 文件，启动 Broker 后从 `main` 运行。若 Java 客户端连不上，先确认 `docker ps` 中容器在运行、宿主机 `9092` 未被占用，再查 Broker 返回的 `advertised.listeners` 地址。学完后可运行 `docker stop kafka-lab` 停止这个实验容器，保留其数据以便下次继续。
