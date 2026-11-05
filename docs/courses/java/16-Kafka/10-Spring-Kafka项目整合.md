---
title: Spring Kafka 项目整合
date: 2026-11-05
category: Java课程
tags: [Java, Kafka, Spring Boot]
description: 使用 KafkaTemplate 发送、@KafkaListener 消费并处理失败边界。
---

# Spring Kafka 项目整合

## 从零准备这个 Spring Boot 项目

先按[快速入门](./03-Kafka快速入门与安装)启动 Kafka。新建 Maven 项目，把下面的 `pom.xml` 放在项目根目录；这里固定 Boot 3.4.13、JDK 20，`spring-kafka` 的版本由 Boot 管理。镜像是 Kafka 4.1.2；客户端和服务端跨版本通信时应核对[兼容性文档](https://kafka.apache.org/41/getting-started/compatibility/)。

```xml
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 https://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>
    <parent>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-parent</artifactId>
        <version>3.4.13</version>
    </parent>
    <groupId>demo</groupId>
    <artifactId>kafka-lab</artifactId>
    <version>1.0.0</version>
    <properties><java.version>20</java.version></properties>
    <dependencies>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter</artifactId>
        </dependency>
        <dependency>
            <groupId>org.springframework.kafka</groupId>
            <artifactId>spring-kafka</artifactId>
        </dependency>
    </dependencies>
    <build><plugins><plugin>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-maven-plugin</artifactId>
    </plugin></plugins></build>
</project>
```

在 `src/main/resources/application.properties` 写入：

```properties
spring.kafka.bootstrap-servers=localhost:9092
spring.kafka.producer.key-serializer=org.apache.kafka.common.serialization.StringSerializer
spring.kafka.producer.value-serializer=org.apache.kafka.common.serialization.StringSerializer
spring.kafka.consumer.key-deserializer=org.apache.kafka.common.serialization.StringDeserializer
spring.kafka.consumer.value-deserializer=org.apache.kafka.common.serialization.StringDeserializer
spring.kafka.consumer.group-id=order-projection
spring.kafka.consumer.auto-offset-reset=earliest
```

## 完整收发案例

把下面保存为 `src/main/java/demo/kafka/KafkaLabApplication.java`。启动后 `ApplicationRunner` 发一条 `order-7=created`；监听器消费并打印。`NewTopic` 只负责本地实验 Topic，避免运行前还要手工创建。

```java
package demo.kafka;

import org.apache.kafka.clients.admin.NewTopic;
import org.apache.kafka.clients.consumer.ConsumerRecord;
import org.springframework.boot.ApplicationRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.kafka.config.TopicBuilder;
import org.springframework.kafka.core.KafkaTemplate;

@SpringBootApplication
public class KafkaLabApplication {
    public static void main(String[] args) {
        SpringApplication.run(KafkaLabApplication.class, args);
    }

    @Bean
    NewTopic learningTopic() {
        return TopicBuilder.name("learning.events").partitions(1).replicas(1).build();
    }

    @Bean
    ApplicationRunner sendExample(KafkaTemplate<String, String> kafka) {
        return args -> kafka.send("learning.events", "order-7", "created")
            .whenComplete((result, error) -> {
                if (error != null) {
                    System.err.println("发送失败：" + error.getMessage());
                    return;
                }
                System.out.println("发送确认 offset="
                    + result.getRecordMetadata().offset());
            });
    }

    @KafkaListener(topics = "learning.events")
    public void onMessage(ConsumerRecord<String, String> record) {
        System.out.println("消费到 " + record.key() + "=" + record.value());
        // 输出示例：消费到 order-7=created
    }
}
```

在项目根目录运行 `mvn spring-boot:run`。正常情况会看到“发送确认 offset=…”和“消费到 order-7=created”；两行出现的先后顺序不固定。再次启动会再发送一条，offset 增加；固定消费组会从上次提交的位置继续读，不会每次重放全部历史。若没看到消费者输出，先检查 Broker、Topic、序列化配置和消费组位移。[发送 API](https://docs.spring.io/spring-kafka/reference/kafka/sending-messages.html)与[监听器 API](https://docs.spring.io/spring-kafka/reference/kafka/receiving-messages/listener-annotation.html)。

### `NewTopic`：启动时准备实验 Topic

`learningTopic()` 返回一个 `NewTopic` Bean，Spring Kafka 的管理组件会在启动时尝试创建 `learning.events`。`.partitions(1)` 指定一个分区，`.replicas(1)` 适合本地单 Broker；它不负责把已有 Topic 的所有配置自动调整为代码里的值，因此排查时仍要用 Admin API 查询实际分区和副本。

### `KafkaTemplate.send()`：发送并取得确认结果

示例的三个参数依次是 Topic、消息 key、消息 value。`send()` 返回 `CompletableFuture<SendResult<String, String>>`，`whenComplete` 在完成时检查错误或读取 `RecordMetadata.offset()`。Future 完成且没有错误，说明这次发送得到 Broker 确认；它不能证明下游已经处理。案例把发送放在 `ApplicationRunner` 中，只为启动后立刻看到一轮结果，业务项目通常在明确的服务方法里调用。[Spring Kafka 发送文档](https://docs.spring.io/spring-kafka/reference/kafka/sending-messages.html)。

### `@KafkaListener`：交给容器持续消费

`@KafkaListener(topics = "learning.events")` 让 Spring 管理消费者循环，方法参数 `ConsumerRecord<String, String>` 提供 key、value、分区与 offset。示例只打印内容，没有模拟数据库写入；真实处理要同时考虑异常、重试、位移提交和重复消息。监听方法不要用无限阻塞操作占住消费线程，具体并发数和确认模式由监听容器配置决定。[Spring Kafka 监听器文档](https://docs.spring.io/spring-kafka/reference/kafka/receiving-messages/listener-annotation.html)。

## 发送成功不等于业务完成

`KafkaTemplate.send()` 返回 `CompletableFuture`。回调成功只说明 Broker 接收了消息；监听器还可能重试、失败或在提交位移前崩溃。正式业务要选择确认模式、错误处理器、死信 Topic，并用业务 ID 做幂等。启动时自动发送仅为教学示例，真实服务通常在业务动作完成后由服务方法触发发送。

## 与数据库事务的边界

数据库提交成功而 Kafka 发送失败会造成事件缺失；反过来也可能出现事件先被看到。需要同一业务事实可靠落库并投递时，优先理解事务 Outbox 和可重复发布，再考虑 Kafka 事务能覆盖的范围。[Spring Kafka 发送](https://docs.spring.io/spring-kafka/reference/kafka/sending-messages.html)与[监听容器](https://docs.spring.io/spring-kafka/reference/kafka/receiving-messages/listener-annotation.html)。
