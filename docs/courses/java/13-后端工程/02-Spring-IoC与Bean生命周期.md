---
title: Spring IoC 与 Bean 生命周期
date: 2026-10-01
category: Java后端工程
tags:
  - Java
  - Spring IoC
  - Bean
  - 依赖注入
description: 速查 Spring 组件注册、构造器注入、Bean 生命周期、作用域和代理对象边界。
---

# Spring IoC 与 Bean 生命周期

## 学习目标

- 能区分 `@Component`、`@Service`、`@Bean` 三种注册方式，并选择构造器注入。
- 能按实例化、依赖注入、初始化和销毁顺序定位 Bean 生命周期问题。
- 能解释作用域、延迟创建、候选 Bean 和代理对象对运行时行为的影响。

## 核心知识点

### 专业术语

- **IoC（Inversion of Control）**：对象的创建、依赖组装和生命周期由容器协调，而不是业务类自己 `new` 依赖。
- **Bean 定义（Bean definition）**：容器创建对象所需的类型、作用域、依赖和初始化元数据。
- **构造器注入（constructor injection）**：依赖作为构造器参数传入，使对象在构造完成时就满足必需依赖。
- **作用域（scope）**：Bean 在容器中的实例复用策略，常见有 singleton、prototype、request 和 session。
- **代理对象（proxy）**：包装目标 Bean 的运行时对象，用于事务、缓存、安全或切面拦截方法调用。

### 白话解释与边界

IoC 容器像一张对象装配图：先读取 Bean 定义，再按依赖关系创建对象，随后执行初始化回调，最后在容器关闭时销毁可管理资源。构造器注入能让必需依赖显式可见，也更容易写单元测试；可选依赖才应使用 `ObjectProvider` 等延迟入口。

默认 singleton 是“每个容器一个实例”，不是“整个 JVM 永远一个实例”。prototype Bean 由容器创建但通常不负责后续销毁；把短生命周期对象直接注入长生命周期对象时，要通过 provider 或代理解决生命周期错配。代理只拦截经过代理的调用，自调用通常绕过事务和切面。

## 常用用法

### @Component/@Service：注册组件

用途：用于把无须显式工厂逻辑的类交给组件扫描；`@Service` 是表达服务角色的语义化组件注解。

```java
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Service;

@Component
class ClockSource {
    String zone() {
        return "UTC";
    }
}

@Service
class GreetingService {
    private final ClockSource clock;

    GreetingService(ClockSource clock) {
        this.clock = clock;
    }

    String greet() {
        return "hello/" + clock.zone();
    }
}

System.out.println(new GreetingService(new ClockSource()).greet());
// 输出：hello/UTC
```

组件类的包必须在扫描范围内；同类型组件有多个候选时，使用限定符或 `@Primary` 表达选择，而不是依赖类路径顺序。

### @Bean：注册工厂方法结果

用途：用于注册第三方类型、需要组装参数或需要显式生命周期控制的对象；方法返回值就是容器中的 Bean。

```java
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
class ClientConfiguration {
    @Bean
    String endpoint() {
        return "https://api.example.test";
    }
}

System.out.println(new ClientConfiguration().endpoint());
// 输出：https://api.example.test
```

`@Bean` 方法可以声明参数，容器会按类型注入依赖；在 `@Configuration` 类中方法调用还会由配置类增强代理协调 Bean 复用。普通组件类里的直接方法调用不应被误认为容器查找。

### 构造器注入：表达必需依赖

用途：用于让对象在构造完成后就处于可用状态，并让依赖关系在类型签名中可见。

```java
import org.springframework.stereotype.Service;

record UserGateway(String endpoint) {}

@Service
class UserService {
    private final UserGateway gateway;

    UserService(UserGateway gateway) {
        this.gateway = gateway;
    }

    String endpoint() {
        return gateway.endpoint();
    }
}

System.out.println(new UserService(new UserGateway("users")).endpoint());
// 输出：users
```

单构造器通常不需要 `@Autowired`；必需依赖不要用字段注入隐藏。若两个服务互相需要，构造器注入会在启动时暴露循环依赖，通常应拆分职责或引入事件/端口，而不是随意改成字段注入。

### @PostConstruct：完成初始化校验

用途：用于依赖注入完成后执行轻量、确定性的初始化；不要在这里启动不可控的长循环或阻塞网络调用。

```java
import jakarta.annotation.PostConstruct;
import org.springframework.stereotype.Component;

@Component
class TokenRules {
    private String prefix;

    @PostConstruct
    void initialize() {
        prefix = "Bearer ";
        System.out.println(prefix.strip());
        // 输出：Bearer
    }
}
```

初始化回调发生在依赖注入之后、应用完全可服务之前；抛出异常通常会让 Bean 创建失败并阻止启动。资源释放对应 `@PreDestroy` 或显式关闭接口，不能假定所有 prototype Bean 都会收到销毁回调。

### 作用域：选择实例复用边界

用途：用于根据状态共享范围选择 singleton、prototype 或 Web 作用域；状态型对象必须避免被错误地跨请求共享。

```java
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Component;

@Component
@Scope("prototype")
class RequestDraft {
    private int count;

    int next() {
        return ++count;
    }
}

var first = new RequestDraft();
var second = new RequestDraft();
System.out.println(first.next() + "/" + second.next());
// 输出：1/1
```

prototype 的每次获取语义需要通过容器或 provider 才能体现；直接把它注入 singleton 只会得到一次实例。Web 作用域需要相应的请求上下文，后台线程不能无条件读取 request-scoped Bean。

### 代理对象：识别被包装的 Bean

用途：用于理解事务、缓存和安全切面为什么依赖代理，以及为什么自调用可能绕过拦截器。

```java
import org.springframework.aop.support.AopUtils;

interface Greeting {
    String text();
}

Greeting target = () -> "hello";
Greeting proxy = (Greeting) java.lang.reflect.Proxy.newProxyInstance(
    Greeting.class.getClassLoader(), new Class<?>[] {Greeting.class},
    (object, method, args) -> method.invoke(target, args));
System.out.println(AopUtils.isAopProxy(proxy) + "/" + proxy.text());
// 输出：true/hello
```

实际 Spring Bean 可能是 JDK 动态代理或 CGLIB/类代理；注入接口通常更稳妥。代理只能拦截从代理入口进入的方法，类内 `this.otherMethod()` 不会重新经过代理链。

## 不常用但需要知道

### ObjectProvider：延迟获取与可选依赖

用途：用于表达可选依赖、延迟实例化或按需获取 prototype Bean，避免在构造器中强制创建昂贵对象。

```java
import org.springframework.beans.factory.ObjectProvider;

class OptionalReporter {
    OptionalReporter(ObjectProvider<Runnable> provider) {
        Runnable task = provider.getIfAvailable(() -> () -> System.out.println("fallback"));
        task.run();
        // 输出：fallback
    }
}
```

`getIfAvailable` 适合有安全默认值的可选依赖；多个候选时仍会触发歧义异常，应配合 `@Primary` 或限定符。不要用 provider 掩盖本来应该必需的依赖缺失。

### @Lazy：延迟创建 Bean

用途：用于推迟昂贵 Bean 的实例化或打破经过评估的初始化时序，但不能把它当成循环依赖的通用修复。

```java
import org.springframework.context.annotation.Lazy;
import org.springframework.stereotype.Component;

@Lazy
@Component
class ExpensiveCatalog {
    ExpensiveCatalog() {
        System.out.println("created-on-first-use");
        // 输出：created-on-first-use
    }
}
```

懒加载把失败从启动期推迟到第一次访问，排障和健康检查会更复杂。对关键 Bean，应权衡启动速度、首请求延迟和失败可见性，并为第一次创建提供监控。

### @Primary：声明默认候选

用途：用于同一接口存在多个实现时指定默认注入对象；只有一个候选需要时才使用，复杂场景改用限定符更清晰。

```java
import org.springframework.context.annotation.Primary;
import org.springframework.stereotype.Component;

interface Clock {
    String name();
}

@Primary
@Component
class SystemClock implements Clock {
    public String name() {
        return "system";
    }
}

System.out.println(new SystemClock().name());
// 输出：system
```

`@Primary` 只影响按类型选择，不会改变 Bean 名称，也不会覆盖显式限定符。新增实现时要检查原有注入点是否仍只有一个默认候选。

## 继续阅读

- [List 基础](/courses/java/05-泛型与集合/04-List常用API)：容器注入多个实现时，先查 `List` 的顺序、可变性和快照边界。
- [Map 基础](/courses/java/05-泛型与集合/07-Map常用API)：按 Bean 名称收集多个实现时，查 `Map` 的键和值视图语义。
- [String 文本处理](/courses/java/02-数组与文本/02-String与文本处理)：处理 Bean 名称、限定符和配置键时，查字符串比较与规范化。
- [异常处理常用写法](/courses/java/04-现代Java类型/05-异常处理常用写法)：初始化失败和依赖缺失需要统一异常边界时参考。

## 简单案例

```java
import jakarta.annotation.PostConstruct;
import org.springframework.stereotype.Service;

record Profile(String name) {}

@Service
class ProfileService {
    private final Profile profile;

    ProfileService(Profile profile) {
        this.profile = profile;
    }

    @PostConstruct
    void check() {
        if (profile.name().isBlank()) {
            throw new IllegalStateException("profile name is blank");
        }
    }

    String name() {
        return profile.name();
    }
}

System.out.println(new ProfileService(new Profile("dev")).name());
// 输出：dev
```

这里把必需依赖放进构造器，把不变量检查放在初始化回调；真正的 Spring 应用还要通过 `@Bean` 或配置属性提供 `Profile`。如果依赖是按请求变化的状态，应使用正确作用域或 provider，不能把它塞进 singleton 服务的可变字段。

## 易混点

- `@Component`/`@Service` 依赖组件扫描，`@Bean` 依赖配置方法；两者都注册 Bean，但表达意图不同。
- singleton 是容器级复用，不是线程安全保证；可变字段仍需并发设计。
- prototype 只保证获取时创建新实例，容器通常不替你完成完整销毁流程。
- 注入代理后调用经过代理的方法才会触发切面；同类 `this` 调用通常绕过代理。
- `@Lazy` 可以推迟失败，不能自动解决设计上的循环依赖；构造器依赖环应优先拆分职责。

## 课后小问

1. 为什么构造器注入有助于发现循环依赖？
答案：容器必须在构造对象前提供全部构造器参数，互相等待的依赖环会在启动阶段明确失败。
解析：这比隐藏在字段注入后的半初始化对象更早暴露设计问题，通常应拆出共同职责或改为事件协作。

2. singleton Bean 一定线程安全吗？
答案：不一定，singleton 只描述实例复用范围，不会自动保护可变字段。
解析：并发请求会共享同一实例；状态应尽量保持无状态，必须共享时要采用明确的并发控制。

3. 为什么自调用可能绕过 `@Transactional` 或切面？
答案：自调用使用目标对象的 `this` 引用，没有从 Spring 代理对象入口经过拦截器链。
解析：可拆分到另一个 Bean、从外部代理调用，或谨慎使用其他设计；不要仅靠注解文字推断拦截已经发生。

## 本节小结

- IoC 容器负责 Bean 定义、依赖组装、初始化和可管理资源的销毁。
- 构造器注入让必需依赖显式可见，`ObjectProvider` 只应表达可选或延迟依赖。
- 作用域描述实例生命周期，singleton 不等于线程安全，prototype 也不等于自动销毁。
- 代理支撑事务、缓存和安全拦截，但自调用和直接 `new` 都可能绕开容器能力。

## 快速回顾

- 能为普通组件、第三方对象和多个候选选择 `@Component`、`@Bean` 或限定符。
- 能按实例化、注入、初始化和销毁顺序解释 Bean 生命周期。
- 能说明 singleton、prototype、request 作用域的共享边界。
- 能识别代理对象、自调用和循环依赖造成的常见误判。

