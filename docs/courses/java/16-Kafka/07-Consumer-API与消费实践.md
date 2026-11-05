---
title: Consumer API 与消费实践
date: 2026-11-05
category: Java课程
tags: [Java, Kafka, Consumer]
description: Consumer poll 循环、消费组、位移提交、再均衡和重复处理。
---

# Consumer API 与消费实践

## 常用 API

### `KafkaConsumer.subscribe()`：加入消费组并订阅 Topic

`subscribe(List.of("learning.events"))` 告诉消费者从哪个 Topic 获取记录。分区由消费组协调后分配，调用 `subscribe()` 本身不会返回消息，也不保证此时已经拿到分区；需要持续调用 `poll()` 推进组协调和读取。下面使用随机组名，仅为了每次练习都能从已有消息开始观察，正式服务应使用稳定组名。

### `KafkaConsumer.poll()`：拉取一批记录

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

`poll(Duration.ofSeconds(1))` 最多等待约一秒取得当前批次，返回的 `ConsumerRecords` 可以是空的；第一次调用还可能先完成分区分配。遍历批次时，`record.key()` 和 `record.value()` 是前面生产者写入的字符串，`record.offset()` 是该分区中的位置，不是全 Topic 的全局序号。成功时会打印类似 `offset=0, order-7=created`；offset 随已有消息数量变化。[KafkaConsumer API](https://kafka.apache.org/41/javadoc/org/apache/kafka/clients/consumer/KafkaConsumer.html)。

## 位移与消费组

### `KafkaConsumer.commitSync()`：处理后提交读取位置

同一组的分区在实例间分配；一个分区在同一时刻只由组内一个消费者处理。示例在整批记录打印后调用 `commitSync()`，提交下一次应读的位置。业务处理成功但提交失败会重读，因此业务侧仍需幂等；先提交再处理则可能丢业务结果。正式服务需要持续循环、关闭信号、再均衡处理和失败重试，不能照搬本页的 15 秒教学退出条件。Consumer 实例不能跨线程共享。[官方 Consumer API](https://kafka.apache.org/41/javadoc/org/apache/kafka/clients/consumer/KafkaConsumer.html)。

### `group.id`：确定谁共享消费进度

同一个 `group.id` 下的消费者协作分担 Topic 分区，并共用已提交位移。换一个组名相当于建立独立的读取进度；示例每次生成新组名，是为了演示旧消息，不是生产建议。

### `auto.offset.reset`：没有有效位移时从哪里读

`earliest` 只在消费组没有有效已提交位移时从最早可用记录开始。已有位移时它不会让消费者重放历史；想验证旧消息，应使用新的实验组或明确管理位移，不能仅反复修改此配置。

### `enable.auto.commit`：是否自动提交位移

设为 `false` 后，本例需要自己在处理成功后调用 `commitSync()`。如果设为 `true`，客户端会按周期自动提交，可能在业务尚未处理完成时前移位移；三项配置一起看，才知道“为什么这次没读到旧消息”。
