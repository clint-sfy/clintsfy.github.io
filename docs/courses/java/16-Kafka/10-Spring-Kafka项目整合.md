---
title: Spring Kafka 项目整合
date: 2026-11-05
category: Java课程
tags: [Java, Kafka, Spring Boot]
description: 使用 KafkaTemplate 发送、@KafkaListener 消费并处理失败边界。
---

# Spring Kafka 项目整合

## `KafkaTemplate.send()`：服务里发送事件

注入模板后发送 key/value，返回 `CompletableFuture`；异步成功代表 Kafka 发送成功，不代表下游业务完成。

```java
@org.springframework.stereotype.Service
class OrderEvents {
    private final org.springframework.kafka.core.KafkaTemplate<String, String> kafka;
    OrderEvents(org.springframework.kafka.core.KafkaTemplate<String, String> kafka) {
        this.kafka = kafka;
    }

    java.util.concurrent.CompletableFuture<org.springframework.kafka.support.SendResult<String, String>> created(long id) {
        return kafka.send("learning.events", "order-" + id, "created");
    }
}
```

## `@KafkaListener`：消费事件

监听方法由容器调用。下面只演示最小入口；正式业务要配置反序列化错误、重试、死信 Topic、确认模式与幂等。

```java
@org.springframework.stereotype.Component
class OrderEventListener {
    @org.springframework.kafka.annotation.KafkaListener(topics = "learning.events", groupId = "order-projection")
    void onMessage(org.apache.kafka.clients.consumer.ConsumerRecord<String, String> record) {
        System.out.println(record.key() + "=" + record.value());
        // 输出：例如 order-7=created
    }
}
```

## 与数据库事务的边界

数据库提交成功而 Kafka 发送失败会造成事件缺失；反过来也可能出现事件先被看到。需要同一业务事实可靠落库并投递时，优先理解事务 Outbox 和可重复发布，再考虑 Kafka 事务能覆盖的范围。[Spring Kafka 发送](https://docs.spring.io/spring-kafka/reference/kafka/sending-messages.html)与[监听容器](https://docs.spring.io/spring-kafka/reference/kafka/receiving-messages/listener-annotation.html)。
