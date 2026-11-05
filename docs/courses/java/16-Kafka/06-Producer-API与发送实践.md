---
title: Producer API 与发送实践
date: 2026-11-05
category: Java课程
tags: [Java, Kafka, Producer]
description: ProducerRecord、异步回调、分区选择、幂等和发送确认。
---

# Producer API 与发送实践

## `ProducerRecord`：消息由什么组成

Topic 指向目标日志；key 影响默认分区选择，value 是业务数据。headers 可放追踪 ID，不要放密码。需要同一业务实体的顺序时使用稳定 key，并让相关消息进入同一分区。

## `KafkaProducer.send()`：异步发送

`send()` 返回 Future 只代表已经提交给客户端发送流程；回调成功才拿到 Broker 确认的分区和 offset。

```java
var props = new java.util.Properties();
props.put("bootstrap.servers", "localhost:9092");
props.put("key.serializer", "org.apache.kafka.common.serialization.StringSerializer");
props.put("value.serializer", "org.apache.kafka.common.serialization.StringSerializer");
props.put("acks", "all");
props.put("enable.idempotence", "true");

try (var producer = new org.apache.kafka.clients.producer.KafkaProducer<String, String>(props)) {
    var record = new org.apache.kafka.clients.producer.ProducerRecord<>(
        "learning.events", "order-7", "created");
    producer.send(record, (metadata, error) -> {
        if (error != null) { error.printStackTrace(); return; }
        System.out.println(metadata.partition() + ":" + metadata.offset());
        // 输出：实际分区和 offset，例如 0:3
    });
    producer.flush();
}
```

## ACK、幂等与重试

`acks=all` 等待 ISR 中要求的副本确认，仍须结合副本数和 `min.insync.replicas`。幂等生产者避免同一生产者会话内重试造成的重复写入；跨进程业务重复请求仍要靠业务 ID 或事务边界解决。自定义分区器前先确认默认 key 分区是否已满足需求。[Producer 配置](https://kafka.apache.org/documentation/#producerconfigs)。
