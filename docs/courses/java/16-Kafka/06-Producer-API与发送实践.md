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

先完成[Broker、Topic 和 Maven 依赖](./03-Kafka快速入门与安装)。把下面保存为 `ProducerDemo.java`，从 `main` 运行。输入是 `key=order-7`、`value=created`；目标是 `learning.events`。

```java
import java.nio.charset.StandardCharsets;
import java.util.Properties;
import java.util.concurrent.TimeUnit;
import org.apache.kafka.clients.producer.KafkaProducer;
import org.apache.kafka.clients.producer.ProducerRecord;
import org.apache.kafka.common.serialization.StringSerializer;

public class ProducerDemo {
    public static void main(String[] args) throws Exception {
        Properties props = new Properties();
        props.put("bootstrap.servers", "localhost:9092");
        props.put("key.serializer", StringSerializer.class.getName());
        props.put("value.serializer", StringSerializer.class.getName());
        props.put("acks", "all");
        props.put("enable.idempotence", "true");

        try (KafkaProducer<String, String> producer = new KafkaProducer<>(props)) {
            ProducerRecord<String, String> record =
                new ProducerRecord<>("learning.events", "order-7", "created");
            record.headers().add("source", "java-demo".getBytes(StandardCharsets.UTF_8));

            var metadata = producer.send(record).get(10, TimeUnit.SECONDS);
            System.out.println("topic=" + metadata.topic()
                + ", partition=" + metadata.partition()
                + ", offset=" + metadata.offset());
            // 输出示例：topic=learning.events, partition=0, offset=0
        }
    }
}
```

`send()` 先进入客户端缓冲队列；这里用 `get(10, TimeUnit.SECONDS)` 等 Broker 结果，适合第一个练习，不适合在高吞吐请求线程中每条都阻塞等待。第一次写入空 Topic 时 offset 通常是 0；重复运行会继续增长。异常说明这次没有拿到确认，不能据此断言 Broker 一定没写入。随后运行[Consumer 示例](./07-Consumer-API与消费实践)，应能读到 `order-7=created`。

### `send(record, callback)`：异步获知结果

在已经创建的 `producer` 上调用回调重载：

```java
producer.send(record, (metadata, error) -> {
    if (error != null) {
        System.err.println("发送失败：" + error.getMessage());
        return;
    }
    System.out.println("确认位置：" + metadata.partition() + ":" + metadata.offset());
});
```

回调在客户端线程执行，里面不要做耗时业务；关闭 Producer 前应等待未完成发送。

## ACK、幂等与重试

`acks=0` 不等确认，`acks=1` 等 Leader，`acks=all` 等当前 ISR 中满足要求的副本；因此 `acks=all` 仍需结合副本数与 `min.insync.replicas`。幂等生产者避免同一生产者会话内重试造成的重复写入；跨进程业务重复请求仍要靠业务 ID 处理。相同 key 的记录默认路由到相同分区，单分区内才有顺序保证。批量发送时再研究 `linger.ms`、`batch.size`、`compression.type`，先用默认值建立正确结果。[官方 Producer 配置](https://kafka.apache.org/41/configuration/producer-configs/)。
