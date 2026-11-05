---
title: Consumer API 与消费实践
date: 2026-11-05
category: Java课程
tags: [Java, Kafka, Consumer]
description: Consumer poll 循环、消费组、位移提交、再均衡和重复处理。
---

# Consumer API 与消费实践

## `subscribe()` 与 `poll()`：消费循环

同一组的分区在实例间分配；一个分区在同一时刻只由组内一个消费者处理。`poll()` 不等于业务处理完成，提交位移前应明确失败策略。

```java
var props = new java.util.Properties();
props.put("bootstrap.servers", "localhost:9092");
props.put("group.id", "learning-workers");
props.put("key.deserializer", "org.apache.kafka.common.serialization.StringDeserializer");
props.put("value.deserializer", "org.apache.kafka.common.serialization.StringDeserializer");
props.put("auto.offset.reset", "earliest");
props.put("enable.auto.commit", "false");

try (var consumer = new org.apache.kafka.clients.consumer.KafkaConsumer<String, String>(props)) {
    consumer.subscribe(java.util.List.of("learning.events"));
    var records = consumer.poll(java.time.Duration.ofSeconds(1));
    for (var record : records) {
        System.out.println(record.key() + "=" + record.value());
        // 输出：例如 order-7=created
    }
    // 仅在这批记录的业务处理全部成功后提交。
    consumer.commitSync();
}
```

## `commitSync()` 与再均衡

提交的是下一次应读的位置。处理成功但提交失败会重读，因此业务侧仍需幂等。单次 `poll()` 示例便于观察；正式服务需要持续循环、关闭处理，以及对再均衡时未完成任务和耗时处理的策略。Consumer 实例不能跨线程共享。[Consumer API](https://kafka.apache.org/documentation/#consumerapi)。
