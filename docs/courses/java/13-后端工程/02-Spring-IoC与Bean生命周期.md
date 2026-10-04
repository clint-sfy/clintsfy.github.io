---
title: Spring IoC 与 Bean 生命周期
date: 2026-10-01T00:00:00.000Z
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

### 版本与兼容基线

本文按 JDK 20 的写法组织示例，使用的 `var`、record 等语法在 Java 17 已可用，不依赖 JDK 20 之后才出现的 API。项目兼容基线是 Java 17、Spring Boot 4.1.0 与 Spring Framework 7。Spring Boot 4 使用 Jakarta EE 命名空间，示例使用 `jakarta.*`，它替代旧版 `javax.*`；迁移旧项目时要以实际依赖版本为准。

## 常用用法

### `@Component`：注册通用组件

用途：用于把无须显式工厂逻辑的通用类交给组件扫描。

```java
import org.springframework.stereotype.Component;

@Component
class ClockSource {
    String zone() {
        return "UTC";
    }
}

System.out.println(new ClockSource().zone());
// 输出：UTC
// 作用：@Component 将 ClockSource 标记为组件扫描候选
```

组件类的包必须在扫描范围内；同类型组件有多个候选时，使用限定符或 `@Primary` 表达选择，而不是依赖类路径顺序。

### `@Service`：注册服务组件

用途：用于在组件扫描中显式标记承载业务逻辑的服务类。

```java
import org.springframework.stereotype.Service;

@Service
class GreetingService {
    String greet() {
        return "hello";
    }
}

System.out.println(new GreetingService().greet());
// 输出：hello
// 作用：@Service 将 GreetingService 标记为业务服务候选
```

`@Service` 本质上是 `@Component` 的语义化特殊形式；它不会自动建立事务边界，事务仍需明确配置。

这里的 `new GreetingService().greet()` 只验证普通方法返回 `hello`；组件扫描、依赖注入以及可能叠加的事务或缓存代理，只有从 Spring 容器取得该 Bean 时才生效。

### `@Bean`：注册工厂方法结果

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
// 作用：用于注册第三方类型、需要组装参数或需要显式生命周期控制的对象；方法返回值就是容器中的 Bean。
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
// 作用：用于让对象在构造完成后就处于可用状态，并让依赖关系在类型签名中可见。
```

单构造器通常不需要 `@Autowired`；必需依赖不要用字段注入隐藏。若两个服务互相需要，构造器注入会在启动时暴露循环依赖，通常应拆分职责或引入事件/端口，而不是随意改成字段注入。

这里手工构造 `UserService` 只展示构造器把 `UserGateway("users")` 传入后返回 `users`；它没有演示 Spring 已完成自动注入，真实注入必须由容器创建并装配 `UserService`。

### `@PostConstruct`：完成初始化校验

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
// 作用：@PostConstruct 调用 initialize，把 prefix 初始化为 "Bearer "
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
// 作用：用于根据状态共享范围选择 singleton、prototype 或 Web 作用域；状态型对象必须避免被错误地跨请求共享。
```

prototype 的每次获取语义需要通过容器或 provider 才能体现；直接把它注入 singleton 只会得到一次实例。Web 作用域需要相应的请求上下文，后台线程不能无条件读取 request-scoped Bean。

### 代理对象：识别被包装的 Bean

用途：用于理解事务、缓存和安全切面为什么依赖代理，以及为什么自调用可能绕过拦截器。

```java
import org.springframework.aop.framework.ProxyFactory;
import org.springframework.aop.support.AopUtils;
import org.aopalliance.intercept.MethodInterceptor;

interface Greeting {
    String text();
}

class GreetingTarget implements Greeting {
    public String text() {
        return "hello";
    }
}

var factory = new ProxyFactory(new GreetingTarget());
factory.addAdvice((MethodInterceptor) invocation -> invocation.proceed());
Greeting proxy = (Greeting) factory.getProxy();
System.out.println(AopUtils.isAopProxy(proxy) + "/" + proxy.text());
// 输出：true/hello
// 作用：用于理解事务、缓存和安全切面为什么依赖代理，以及为什么自调用可能绕过拦截器。
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
// 作用：ObjectProvider.getIfAvailable 在 provider 缺少 Runnable 时返回 fallback
```

`getIfAvailable` 适合有安全默认值的可选依赖；多个候选时仍会触发歧义异常，应配合 `@Primary` 或限定符。不要用 provider 掩盖本来应该必需的依赖缺失。

### @Lazy：延迟创建 Bean

用途：用于推迟昂贵 Bean 的实例化或打破经过评估的初始化时序，但不能把它当成循环依赖的通用修复。

```java
import org.springframework.context.annotation.AnnotationConfigApplicationContext;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Lazy;

class ExpensiveCatalog {
    ExpensiveCatalog() {
        System.out.println("constructed-on-getBean");
        // 输出：constructed-on-getBean
    }

    String name() {
        return "catalog";
    }
}

@Configuration
class LazyConfiguration {
    @Bean
    @Lazy
    ExpensiveCatalog catalog() {
        return new ExpensiveCatalog();
    }
}

try (var context = new AnnotationConfigApplicationContext()) {
    context.register(LazyConfiguration.class);
    context.refresh();
    System.out.println("refreshed");
    // 输出：refreshed
    System.out.println("lazy=" + context.getBean(ExpensiveCatalog.class).name());
    // 输出：lazy=catalog
}
// 作用：用于推迟昂贵 Bean 的实例化或打破经过评估的初始化时序，但不能把它当成循环依赖的通用修复。
```

懒加载把失败从启动期推迟到第一次访问，排障和健康检查会更复杂。对关键 Bean，应权衡启动速度、首请求延迟和失败可见性，并为第一次创建提供监控。

### @Primary：声明默认候选

用途：用于同一接口存在多个实现时指定默认注入对象；只有一个候选需要时才使用，复杂场景改用限定符更清晰。

```java
// 初始状态：@Primary 标记 systemClockNotifier，容器中另有 backupClockNotifier
import org.springframework.context.annotation.AnnotationConfigApplicationContext;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;

interface Notifier {
    String channel();
}

class AlertService {
    private final Notifier notifier;

    AlertService(Notifier notifier) {
        this.notifier = notifier;
    }

    String selectedChannel() {
        return notifier.channel();
    }
}

@Configuration
class PrimaryConfiguration {
    @Bean
    @Primary
    Notifier systemClockNotifier() {
        return () -> "system-clock";
    }

    @Bean
    Notifier backupClockNotifier() {
        return () -> "backup-clock";
    }

    @Bean
    AlertService alertService(Notifier notifier) {
        return new AlertService(notifier);
    }
}

try (var context = new AnnotationConfigApplicationContext(PrimaryConfiguration.class)) {
    System.out.println(context.getBean(Notifier.class).channel());
    // 输出：system-clock
    System.out.println(context.getBean(AlertService.class).selectedChannel());
    // 输出：system-clock
}
```

`@Primary` 只影响容器按类型选择：上例既验证 `getBean(Notifier.class)` 的解析，也验证构造器参数选择。直接 `new` 某个实现会绕过 Spring 候选解析，不能证明 `@Primary` 生效；它也不会改变 Bean 名称或覆盖显式限定符。

## 常用调用标题补齐

### `@Autowired`：旧代码的按类型注入

`@Autowired` 按类型解析依赖；新代码优先用单构造器注入，避免隐藏必需依赖。

```java
// 作用：通过 @Autowired 旧代码的按类型注入。
// 结果：`now()` 使用容器中的 `Clock` Bean 返回当前时刻。
@Service
class BillingService {
    private final Clock clock;
    @Autowired
    BillingService(Clock clock) {
        this.clock = clock;
    }
    Instant now() { return clock.instant(); }
}
```

输出：`now()` 使用容器中的 `Clock` Bean 返回当前时刻。

### `@Value`：注入单个配置值

`@Value` 适合少量标量配置；成组配置应改用 `@ConfigurationProperties` 以获得类型校验。

```java
// 作用：通过 @Value 注入单个配置值。
// 结果：未配置时，`accepts(1024)` 返回 `true`。
@Component
class UploadLimits {
    private final long maxBytes;
    UploadLimits(@Value("${app.upload.max-bytes:10485760}") long maxBytes) {
        this.maxBytes = maxBytes;
    }
    boolean accepts(long size) {
        return size <= maxBytes;
    }
}
```

输出：未配置时，`accepts(1024)` 返回 `true`。

### `@ConditionalOnProperty`：按开关装配 Bean

`@ConditionalOnProperty` 只决定 Bean 是否注册；不要把它当成运行期功能开关。

```java
// 作用：通过 @ConditionalOnProperty 按开关装配 Bean。
// 结果：仅当 `app.audit.enabled=true` 时容器中存在 `AuditSink`。
@Configuration
class AuditConfiguration {
    @Bean
    @ConditionalOnProperty(name = "app.audit.enabled", havingValue = "true")
    AuditSink auditSink() {
        return event -> System.out.println(event);
    }
    interface AuditSink { void write(String event); }
}
```

输出：仅当 `app.audit.enabled=true` 时容器中存在 `AuditSink`。

### `SpringApplication.run`：启动并取得容器

`SpringApplication.run` 创建并刷新 Spring 容器；启动参数会进入外部配置优先级链。

```java
// 作用：通过 SpringApplication.run 启动并取得容器。
// 结果：打印已启动容器的 ID，例如 `application`。
@SpringBootApplication
public class DemoApplication {
    public static void main(String[] args) {
        ConfigurableApplicationContext context =
            SpringApplication.run(DemoApplication.class, args);
        String id = context.getId();
        System.out.println(id);
    }
}
```

输出：打印已启动容器的 ID，例如 `application`。

### `FilterRegistrationBean`：以 Bean 方式注册 Servlet Filter

`FilterRegistrationBean` 用于非 Spring Security 的 Servlet Filter；安全链内的过滤器应由 `SecurityFilterChain` 排序。

```java
// 作用：通过 FilterRegistrationBean 以 Bean 方式注册 Servlet Filter。
// 结果：容器以顺序 `10` 注册 `RequestIdFilter`。
@Configuration
class FilterConfiguration {
    @Bean
    FilterRegistrationBean<RequestIdFilter> requestIdFilter() {
        FilterRegistrationBean<RequestIdFilter> bean =
            new FilterRegistrationBean<>(new RequestIdFilter());
        bean.setOrder(10);
        return bean;
    }
}
```

输出：容器以顺序 `10` 注册 `RequestIdFilter`。

### `FilterRegistrationBean.addUrlPatterns`：限制 Filter 映射

`addUrlPatterns` 接收 Servlet URL pattern，不是 Spring MVC 的 Ant 路径规则。

```java
// 作用：通过 FilterRegistrationBean.addUrlPatterns 限制 Filter 映射。
// 结果：`RequestIdFilter` 只匹配 `/api/*` 的 Servlet 请求。
@Bean
FilterRegistrationBean<RequestIdFilter> apiFilter() {
    FilterRegistrationBean<RequestIdFilter> bean =
        new FilterRegistrationBean<>();
    bean.setFilter(new RequestIdFilter());
    bean.addUrlPatterns("/api/*");
    bean.setName("requestIdFilter");
    return bean;
}
```

输出：`RequestIdFilter` 只匹配 `/api/*` 的 Servlet 请求。

### `@EnableCaching`：开启 Spring 缓存代理

`@EnableCaching` 启用 `@Cacheable` 等注解的代理处理；同类自调用仍会绕过代理。

```java
// 作用：通过 @EnableCaching 开启 Spring 缓存代理。
// 结果：容器启用缓存切面，并提供名为 `users` 的缓存。
@Configuration
@EnableCaching
class CacheConfiguration {
    @Bean
    CacheManager cacheManager() {
        return new ConcurrentMapCacheManager("users");
    }
    String configuredCache() { return "users"; }
}
```

输出：容器启用缓存切面，并提供名为 `users` 的缓存。

### `@PropertySource`：引入额外 properties 资源

`@PropertySource` 适合补充 `.properties` 文件；它不直接支持 YAML，也不应覆盖 Boot 的常规配置约定。

```java
// 作用：通过 @PropertySource 引入额外 properties 资源。
// 结果：未配置 `gen.author` 时，`author()` 返回 `team`。
@Configuration
@PropertySource("classpath:generator.properties")
class GeneratorConfiguration {
    private final Environment environment;
    GeneratorConfiguration(Environment environment) {
        this.environment = environment;
    }
    String author() { return environment.getProperty("gen.author", "team"); }
}
```

输出：未配置 `gen.author` 时，`author()` 返回 `team`。

### `@Resource`：按名称优先注入

`@Resource` 默认先按名称匹配，适合需要明确 Bean 名的旧代码；必需依赖仍优先构造器注入。

```java
// 作用：通过 @Resource 按名称优先注入。
// 结果：容器按名称注入 `stringRedisTemplate`，`ready()` 返回 `true`。
@Component
class CaptchaFacade {
    @Resource(name = "stringRedisTemplate")
    private StringRedisTemplate redis;
    void save(String key, String value) {
        redis.opsForValue().set(key, value);
    }
    boolean ready() { return redis != null; }
}
```

输出：容器按名称注入 `stringRedisTemplate`，`ready()` 返回 `true`。

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

这里的 `new ProfileService(new Profile("dev"))` 只验证普通构造器和 `name()` 返回 `dev`；`@PostConstruct` 等生命周期回调不会因手工 `new` 自动执行。真正的 Spring 应用还要通过 `@Bean` 或配置属性提供 `Profile`，并由容器创建 `ProfileService`。如果依赖是按请求变化的状态，应使用正确作用域或 provider，不能把它塞进 singleton 服务的可变字段。

## 易混点

框架片段需容器运行：生命周期回调、条件装配和代理行为都由 Spring 容器驱动，单独运行片段不能复现完整时序；测试时应启动最小应用上下文并断言 Bean 状态。

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
