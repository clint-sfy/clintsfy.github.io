---
title: Producer API 与发送实践
date: 2026-11-05
category: Java课程
tags: [Java, Kafka, Producer]
description: ProducerRecord、异步回调、分区选择、幂等和发送确认。
---

# Producer API 与发送实践

## 常用 API

### `ProducerRecord`：给消息指定 Topic、key 和 value

`new ProducerRecord<>(topic, key, value)` 创建一条待发送消息：`topic` 是目标日志，`key` 决定默认分区路由，`value` 是业务内容。下例的 `order-7` 是订单标识，`created` 是事件内容；相同 key 通常进入相同分区，所以同一订单的消息才能在该分区内按写入顺序读取。`headers()` 可附加追踪 ID 等元数据，不要放密码；显式指定分区时，分区参数优先于按 key 选择。这个对象只描述消息，构造它不会发送。

### `KafkaProducer.send()`：把消息交给生产者

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

            var metadata = producer.send(record, (confirmed, error) -> {
                if (error != null) {
                    System.err.println("发送失败：" + error.getMessage());
                    return;
                }
                System.out.println("异步确认 partition=" + confirmed.partition());
            }).get(10, TimeUnit.SECONDS);
            System.out.println("topic=" + metadata.topic()
                + ", partition=" + metadata.partition()
                + ", offset=" + metadata.offset());
            // 输出示例：topic=learning.events, partition=0, offset=0
        }
    }
}
```

`send(record, callback)` 返回 `Future<RecordMetadata>`；返回 Future 只表示客户端接收了发送请求，不代表 Broker 已确认。上例用 `get(10, TimeUnit.SECONDS)` 最多等 10 秒，成功后从 `RecordMetadata` 取出实际 Topic、分区和 offset。这适合第一次练习；高吞吐程序不要每条发送后立即阻塞。第一次写入空 Topic 时 offset 通常是 0，重复运行会增长。超时或断线表示没有拿到确定结果，不能据此断言 Broker 一定没写入。随后运行[Consumer 示例](./07-Consumer-API与消费实践)，应能读到 `order-7=created`。[KafkaProducer API](https://kafka.apache.org/41/javadoc/org/apache/kafka/clients/producer/KafkaProducer.html)。

### `send(record, callback)`：异步获知结果

上面完整类里的第二个参数就是回调：发送成功时 `confirmed` 包含分区和 offset，失败时 `error` 非空，二者应分别处理。回调在客户端线程执行，不要在里面做耗时业务或调用 `flush()`；后面的 `get(10, TimeUnit.SECONDS)` 让这个一次性练习等待完成。真实批量发送通常收集 Future 或在回调汇总结果，而不是每条都立即 `get()`。

## ACK、幂等与重试

### `acks`：选择写入确认边界

`acks=0` 不等确认，`acks=1` 等 Leader，`acks=all` 等当前 ISR 中满足要求的副本。示例使用 `all`，但它仍需结合 Topic 副本数与 `min.insync.replicas`：单节点实验只有一个副本，不能把这次成功当成多副本容错证明。确认失败时要记录业务 ID 和不确定结果，避免直接盲重试非幂等业务。

### `enable.idempotence`：约束生产者重试重复

设为 `true` 后，客户端对同一生产者会话内的发送重试进行去重；它不识别另一进程再次发出的同一业务请求，也不替消费者完成幂等处理。因此订单事件仍需稳定业务 ID。相同 key 的记录默认路由到相同分区，顺序保证也只在单个分区内成立。

### `linger.ms`、`batch.size` 与 `compression.type`：批量发送

`linger.ms` 控制等待凑批的上限，`batch.size` 限制单分区批次缓冲目标大小，`compression.type` 选择批次压缩方式。它们影响延迟、吞吐和网络字节量，初学时先保持默认值跑通收发，再针对真实消息大小与延迟要求测量调整。[官方 Producer 配置](https://kafka.apache.org/41/configuration/producer-configs/)。
