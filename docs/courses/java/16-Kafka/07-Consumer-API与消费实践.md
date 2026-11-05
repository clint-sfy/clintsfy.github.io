---
title: Consumer API 与消费实践
date: 2026-11-05
category: Java课程
tags: [Java, Kafka, Consumer]
description: Consumer poll 循环、消费组、位移提交、再均衡和重复处理。
---

# Consumer API 与消费实践

## `subscribe()` 与 `poll()`：消费循环

先运行[ProducerDemo](./06-Producer-API与发送实践)写入 `order-7=created`，再把下面保存为 `ConsumerDemo.java` 运行。它使用新的实验消费组，从已有消息开始读，最多等 15 秒，不会无限挂着。

```java
import java.time.Duration;
import java.util.List;
import java.util.Properties;
import java.util.UUID;
import org.apache.kafka.clients.consumer.KafkaConsumer;
import org.apache.kafka.common.serialization.StringDeserializer;

public class ConsumerDemo {
    public static void main(String[] args) {
        Properties props = new Properties();
        props.put("bootstrap.servers", "localhost:9092");
        props.put("group.id", "learning-demo-" + UUID.randomUUID());
        props.put("key.deserializer", StringDeserializer.class.getName());
        props.put("value.deserializer", StringDeserializer.class.getName());
        props.put("auto.offset.reset", "earliest");
        props.put("enable.auto.commit", "false");

        try (KafkaConsumer<String, String> consumer = new KafkaConsumer<>(props)) {
            consumer.subscribe(List.of("learning.events"));
            long deadline = System.nanoTime() + Duration.ofSeconds(15).toNanos();
            boolean found = false;
            while (!found && System.nanoTime() < deadline) {
                var records = consumer.poll(Duration.ofSeconds(1));
                for (var record : records) {
                    System.out.println("offset=" + record.offset() + ", "
                        + record.key() + "=" + record.value());
                    if ("order-7".equals(record.key())) found = true;
                }
                // 这批记录全部处理完才提交下一读取位置。
                if (!records.isEmpty()) consumer.commitSync();
            }
            if (!found) System.out.println("15 秒内没有读到 order-7；先运行 ProducerDemo");
        }
    }
}
```

成功时会打印类似 `offset=0, order-7=created`；offset 随已有消息数量变化。用新组名是为了确保练习能从头看到旧消息，生产环境不能每次启动都换组名。`poll()` 还负责消费组协调，第一次调用可能先完成分区分配，返回空批次很正常。

## `commitSync()` 与再均衡

同一组的分区在实例间分配；一个分区在同一时刻只由组内一个消费者处理。`commitSync()` 提交下一次应读的位置。业务处理成功但提交失败会重读，因此业务侧仍需幂等；先提交再处理则可能丢业务结果。正式服务需要持续循环、关闭信号、再均衡处理和失败重试，不能照搬本页的 15 秒教学退出条件。Consumer 实例不能跨线程共享。[官方 Consumer API](https://kafka.apache.org/documentation/#consumerapi)。

### `group.id`、`auto.offset.reset` 与 `enable.auto.commit`

`group.id` 决定谁共享消费进度；`auto.offset.reset=earliest` 只在该组没有有效提交位移时生效；`enable.auto.commit=false` 让示例在处理成功后手动提交。三者一起看，才知道“为什么这次没读到旧消息”。
