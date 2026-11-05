---
title: Spring Boot 集成与 Admin API
date: 2026-11-05
category: Java课程
tags: [Java, Kafka, Spring Boot, AdminClient]
description: 配置 Spring Kafka，创建 Topic，并通过 AdminClient 查询元数据。
---

# Spring Boot 集成与 Admin API

## 接入依赖与连接

Spring Boot 3 项目加入 `spring-kafka` 依赖，并让 Boot 的依赖管理选择兼容版本。开发环境配置 `spring.kafka.bootstrap-servers=localhost:9092`；生产环境还要配置认证、TLS 和超时。不要把截图中的 Boot 2.x 配置照搬到当前项目。[Spring Kafka 参考文档](https://docs.spring.io/spring-kafka/reference/)。

## `NewTopic`：声明实验 Topic

在 Spring 配置类里声明 Topic，启动时由 KafkaAdmin 尝试创建；已有 Topic 不等于会自动改好所有分区与副本设置。

```java
@org.springframework.context.annotation.Bean
org.apache.kafka.clients.admin.NewTopic learningTopic() {
    return org.springframework.kafka.config.TopicBuilder.name("learning.events")
        .partitions(1).replicas(1).build();
}
```

## `AdminClient.describeTopics()`：查询分区

原生客户端用于检查实际集群状态，不要仅依赖 Bean 声明推测结果。

```java
try (var admin = org.apache.kafka.clients.admin.AdminClient.create(
        java.util.Map.of("bootstrap.servers", "localhost:9092"))) {
    var result = admin.describeTopics(java.util.List.of("learning.events"))
        .allTopicNames().get();
    System.out.println(result.get("learning.events").partitions().size());
    // 输出：1（按上面的实验 Topic 配置）
}
```

`get()` 会阻塞并可能抛异常，实际服务要设置超时并处理 Topic 不存在、权限不足和 Broker 不可达。[Kafka Admin API](https://kafka.apache.org/documentation/#adminapi)。
