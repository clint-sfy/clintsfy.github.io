---
title: Spring Boot 集成与 Admin API
date: 2026-11-05
category: Java课程
tags: [Java, Kafka, Spring Boot, AdminClient]
description: 配置 Spring Kafka，创建 Topic，并通过 AdminClient 查询元数据。
---

# Spring Boot 集成与 Admin API

## 接入依赖与连接

管理 Topic 有两种入口：普通 Java 程序用 Kafka 自带 `AdminClient`；Spring Boot 项目可声明 `NewTopic` Bean。先启动[本地 Broker](./03-Kafka快速入门与安装)，普通 Java 示例沿用该页的 `kafka-clients` 依赖。Spring Boot 示例使用 Boot 管理的 `spring-kafka` 版本。不要把截图中的 Boot 2.x 配置照搬到当前项目。[Spring Kafka 参考文档](https://docs.spring.io/spring-kafka/reference/)。

## `NewTopic`：声明实验 Topic

在 Spring 配置类里声明 Topic，启动时由 KafkaAdmin 尝试创建。把下面保存为 `KafkaTopicConfig.java`，放进 Spring Boot 应用的扫描包；`application.properties` 配置 `spring.kafka.bootstrap-servers=localhost:9092`。

```java
import org.apache.kafka.clients.admin.NewTopic;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.kafka.config.TopicBuilder;

@Configuration
public class KafkaTopicConfig {
    @Bean
    NewTopic learningTopic() {
        return TopicBuilder.name("learning.events")
            .partitions(1).replicas(1).build();
    }
}
```

已有 Topic 不等于会自动改好所有分区与副本设置；运行下一段查询实际状态。单节点实验用副本数 1，生产按故障域规划。

## `AdminClient.describeTopics()`：查询分区

把下面保存为 `TopicAdminDemo.java` 并运行。它会先确认 Topic 是否存在；不存在时创建，再打印分区数与副本数。这样单独运行一次，也能看到 Admin API 的完整输入和结果。

```java
import java.util.List;
import java.util.Map;
import java.util.concurrent.TimeUnit;
import org.apache.kafka.clients.admin.AdminClient;
import org.apache.kafka.clients.admin.NewTopic;

public class TopicAdminDemo {
    public static void main(String[] args) throws Exception {
        try (AdminClient admin = AdminClient.create(
                Map.of("bootstrap.servers", "localhost:9092"))) {
            String topic = "learning.events";
            var existing = admin.listTopics().names().get(10, TimeUnit.SECONDS);
            if (!existing.contains(topic)) {
                admin.createTopics(List.of(new NewTopic(topic, 1, (short) 1)))
                    .all().get(10, TimeUnit.SECONDS);
            }

            var description = admin.describeTopics(List.of(topic))
                .allTopicNames().get(10, TimeUnit.SECONDS).get(topic);
            var partition = description.partitions().get(0);
            System.out.println("topic=" + description.name()
                + ", partitions=" + description.partitions().size()
                + ", replicas=" + partition.replicas().size());
            // 输出：topic=learning.events, partitions=1, replicas=1
        }
    }
}
```

`get(10, TimeUnit.SECONDS)` 是本次元数据请求的等待上限；实际服务还要处理 Topic 被其他进程同时创建、权限不足和 Broker 不可达。若已有 Topic 的分区数不同，输出应以实际集群为准，不要把 1 当固定值。[Kafka Admin API](https://kafka.apache.org/documentation/#adminapi)。
