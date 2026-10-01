---
title: Spring MVC 与 Servlet 边界
date: 2026-10-01
category: Java后端工程
tags:
  - Java
  - Spring MVC
  - Servlet
  - HTTP
description: 速查 Spring MVC 路由、请求体、响应体、异常处理以及 Filter、Interceptor 与 Servlet 生命周期边界。
---

# Spring MVC 与 Servlet 边界

## 学习目标

- 能用 `@RestController`、`@RequestMapping`、`@GetMapping` 和 `@RequestBody` 组织 HTTP 端点。
- 能区分参数绑定、JSON 消息转换、校验、异常处理和响应体封装的责任。
- 能判断 Filter、Interceptor 与 Servlet request/response 生命周期的执行顺序和适用范围。

## 核心知识点

### 专业术语

- **Spring MVC**：基于 `DispatcherServlet` 的请求分发框架，负责路由、参数绑定、控制器调用和消息转换。
- **Servlet**：Servlet 容器定义的请求/响应编程模型，提供 `HttpServletRequest`、`HttpServletResponse` 和过滤器链。
- **Filter**：Servlet 层的链式拦截器，能覆盖静态资源和所有经过容器的请求，并通过 `FilterChain` 继续执行。
- **Interceptor**：Spring MVC Handler 层的拦截器，围绕已匹配的控制器处理，可访问 handler 信息。
- **消息转换（message conversion）**：把 HTTP body 与 Java 对象互相转换的组件，例如 JSON converter。

### 白话解释与边界

一次请求通常先进入 Servlet 容器和 Filter，再到 `DispatcherServlet`，随后由 Interceptor 和 Controller 处理；返回值再经过消息转换写回 response。Filter 不知道最终会匹配哪个 Controller，Interceptor 也不会拦截未进入 Spring MVC 的静态资源或其他 Servlet。

参数绑定只负责把输入放到方法参数，`@Valid`/`@Validated` 负责校验，安全授权由 Security 或方法安全负责，JSON 转换由消息转换器负责。把这些职责混在 Controller 中会让错误响应和边界行为不一致。读取或写入 response 后要尊重提交状态，不能在响应已经提交后再次改写头部。

### 版本与兼容基线

本文按 JDK 20 的写法组织示例，使用的 `var`、record 等语法在 Java 17 已可用，不依赖 JDK 20 之后才出现的 API。项目兼容基线是 Java 17、Spring Boot 4.1.0 与 Spring Framework 7。Spring Boot 4 使用 Jakarta EE 命名空间，示例使用 `jakarta.*`，它替代旧版 `javax.*`；迁移旧项目时要以实际依赖版本为准。

## 常用用法

### @RestController：声明 JSON 控制器

用途：用于让控制器方法返回值默认写入 HTTP 响应体，适合 REST 风格接口；页面渲染应使用普通 `@Controller`。

```java
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
class HealthController {
    @GetMapping("/health")
    String health() {
        return "ok";
    }
}

System.out.println(new HealthController().health());
// 输出：ok
```

`@RestController` 是 `@Controller` 与 `@ResponseBody` 的组合语义；返回对象是否为 JSON 还取决于可用的消息转换器和协商出的媒体类型。

### @RequestMapping/@GetMapping：匹配路由

用途：用于按 HTTP 方法、路径和媒体类型约束请求；优先让路径表达资源而不是把业务分支全部塞进一个方法。

```java
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/users")
class UserController {
    @GetMapping("/{id}")
    String find(@PathVariable long id) {
        return "user-" + id;
    }
}

System.out.println(new UserController().find(7));
// 输出：user-7
```

真实方法应使用 `@PathVariable` 声明路径参数；同一条路径存在多个方法映射时，Spring 会按条件选择，冲突则在启动期报告。不要仅靠方法参数名猜测绑定规则。

### @RequestBody：读取 JSON 请求体

用途：用于让消息转换器把请求 body 反序列化为 DTO；转换成功不代表字段已通过业务校验或已获授权。

```java
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

record CreateUser(String name) {}

@RestController
class CreateUserController {
    @PostMapping("/users")
    String create(@RequestBody CreateUser request) {
        return "created:" + request.name();
    }
}

System.out.println(new CreateUserController().create(new CreateUser("Ann")));
// 输出：created:Ann
```

缺失 body、媒体类型不支持和 JSON 语法错误通常会在进入方法前失败；使用 `@Valid` 后还要统一处理字段错误。敏感字段不要在 DTO 的 `toString` 或异常信息中原样输出。

### 响应体：让返回值表达协议

用途：用于区分业务数据、HTTP 状态和错误信息；响应模型应保持稳定，避免把内部异常对象直接暴露给客户端。

```java
record ApiResponse<T>(String code, T data) {
    static <T> ApiResponse<T> ok(T data) {
        return new ApiResponse<>("OK", data);
    }
}

ApiResponse<String> response = ApiResponse.ok("ready");
System.out.println(response.code() + "/" + response.data());
// 输出：OK/ready
```

统一响应包装不是强制规范；文件流、分页和错误响应可能需要不同的协议。先确定状态码、Content-Type 和错误字段，再选择 DTO、`ResponseEntity` 或流式响应。

### 异常处理：统一错误边界

用途：用于把领域异常、参数错误和未知异常映射为稳定的 HTTP 响应，避免 Controller 到处复制 try/catch。

```java
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
class ApiErrors {
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    @ExceptionHandler(IllegalArgumentException.class)
    String badRequest(IllegalArgumentException ex) {
        return ex.getMessage();
    }
}

System.out.println(new ApiErrors().badRequest(new IllegalArgumentException("invalid id")));
// 输出：invalid id
```

异常处理器要区分客户端可修复错误和服务端未知错误；生产响应不要返回堆栈、SQL 或密钥。记录日志时保留关联 ID 和 cause，但对用户只返回稳定错误码。

### Filter/Interceptor：选择请求拦截层

用途：用于在 Servlet 层或 MVC Handler 层插入请求 ID、鉴权前置检查和耗时记录；先确认是否需要覆盖非 MVC 请求。

```java
import jakarta.servlet.Filter;
import org.springframework.web.servlet.HandlerInterceptor;

Filter servletFilter = (request, response, chain) -> chain.doFilter(request, response);
HandlerInterceptor mvcInterceptor = new HandlerInterceptor() {};
System.out.println(servletFilter != null && mvcInterceptor != null);
// 输出：true
```

Filter 必须通过 `FilterChain` 继续请求，否则会短路；Interceptor 的 `preHandle` 返回 `false` 会阻止 Controller 执行。请求 ID、跨域和编码常在 Filter 层处理，面向具体 Handler 的权限或审计可放在 Interceptor 或方法安全层。

## 不常用但需要知道

### ResponseEntity：显式设置状态和响应头

用途：用于需要精确控制 HTTP 状态码、Content-Type 或缓存头的响应；简单 JSON 可直接返回 DTO。

```java
import org.springframework.http.ResponseEntity;

ResponseEntity<String> response = ResponseEntity
    .status(201)
    .header("X-Request-Id", "req-7")
    .body("created");
System.out.println(response.getStatusCode().value() + "/" + response.getBody());
// 输出：201/created
```

响应头一旦提交就不能可靠修改；下载场景要正确设置 `Content-Disposition` 和媒体类型。不要把用户可控值直接拼入头部，需处理换行和编码边界。

### OncePerRequestFilter：每次请求一次的 Servlet Filter

用途：用于在一次 Servlet 请求分派中只执行一次前置逻辑，例如生成请求 ID；异步和错误分派仍需明确是否重入。

```java
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import org.springframework.web.filter.OncePerRequestFilter;

class RequestIdFilter extends OncePerRequestFilter {
    @Override
    protected void doFilterInternal(
        HttpServletRequest request, HttpServletResponse response, FilterChain chain)
        throws ServletException, IOException {
        response.setHeader("X-Request-Id", "generated");
        chain.doFilter(request, response);
        System.out.println("filter-finished");
        // 输出：filter-finished
    }
}
```

`OncePerRequestFilter` 仍然属于 Servlet Filter 层，不会自动知道 Controller 方法。异步请求、错误分派和排除路径要通过相应钩子与注册配置确认，不能把“一次”理解成跨多个独立请求的全局去重。

### 拦截器顺序：注册与执行方向

用途：用于让多个 `HandlerInterceptor` 的前置、后置和完成回调形成可预测顺序，避免审计依赖尚未建立的上下文。

```java
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

class WebConfig implements WebMvcConfigurer {
    @Override
    public void addInterceptors(InterceptorRegistry registry) {
        registry.addInterceptor(new RequestTraceInterceptor()).order(10);
        System.out.println("trace-order=10");
        // 输出：trace-order=10
    }
}

class RequestTraceInterceptor implements org.springframework.web.servlet.HandlerInterceptor {}
```

注册顺序、`order` 和 `addPathPatterns` 共同影响生效范围；前置回调通常按外层到内层进入，完成回调按相反方向收尾。对关键顺序写集成测试，不要只靠类名排序。

### Servlet request/response 生命周期：理解提交边界

用途：用于定位 request 属性、输入流和 response 缓冲的时序问题；一次请求结束后不要保存容器对象到异步长期任务。

```java
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

void inspect(HttpServletRequest request, HttpServletResponse response) throws Exception {
    request.setAttribute("trace", "req-7");
    response.setContentType("text/plain;charset=UTF-8");
    response.getWriter().write("ok");
    response.flushBuffer();
    System.out.println(request.getAttribute("trace") + "/" + response.isCommitted());
    // 输出：req-7/true
}
```

`getWriter` 或 `getOutputStream` 的选择应与响应体类型一致；flush、缓冲区溢出或容器提交后，状态码和头部可能不能再改。异步 Servlet 场景还要使用异步上下文并保证超时、取消和资源释放。

## 继续阅读

- [List 基础](/courses/java/05-泛型与集合/04-List常用API)：处理批量请求、字段错误列表和分页结果时查 List 的索引与不可变快照。
- [Map 基础](/courses/java/05-泛型与集合/07-Map常用API)：组织请求参数、错误码和响应头映射时查 Map 的键和值边界。
- [String 文本处理](/courses/java/02-数组与文本/02-String与文本处理)：规范化路径、媒体类型、请求 ID 和错误消息时查字符串 API。
- [JSON 与 Java 对象转换](/courses/java/02-数组与文本/05-JSON与Java对象转换)：比较基础 JSON 转换与 MVC 消息转换的职责边界。

## 简单案例

```java
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

record CreateNote(@NotBlank String title) {}
record NoteView(long id, String title) {}

@RestController
class NoteController {
    @PostMapping("/notes")
    ResponseEntity<NoteView> create(@Valid @RequestBody CreateNote request) {
        var view = new NoteView(1L, request.title().strip());
        System.out.println("note=" + view.id());
        // 输出：note=1
        return ResponseEntity.status(201).body(view);
    }
}
```

框架片段需容器运行：请求先经过 Filter，再由 `DispatcherServlet` 找到映射，消息转换器创建 `CreateNote`，校验通过后才调用 Controller。校验失败应由全局异常处理器转换成字段错误响应；授权、事务和持久化分别由对应层负责，不要把所有逻辑堆进方法体。

## 易混点

- Filter 属于 Servlet 容器层，Interceptor 属于 Spring MVC Handler 层；前者可覆盖更多请求，后者能看到 Handler。
- `@RequestBody` 只负责消息转换，不等于 `@Valid` 校验，更不等于权限授权。
- `@RestController` 默认写响应体，但状态码和响应头需要 `ResponseEntity` 或其他显式机制。
- response 提交后通常不能再修改状态码和头部；写入流、flush 和异步完成点要统一管理。
- 异常处理器应返回稳定错误协议，日志保留 cause 与请求 ID，但不要把堆栈和敏感值发给客户端。

## 课后小问

1. 为什么 Filter 能拦截静态资源，而普通 Interceptor 不一定能？
答案：Filter 位于 Servlet 容器层，所有经过该过滤器链的请求都会经过它；Interceptor 需要先进入 Spring MVC 并匹配 Handler。
解析：因此编码、请求 ID和跨域等通用前置逻辑常放在 Filter，而依赖具体 Controller 的逻辑更适合 Interceptor。

2. `@RequestBody` 成功后是否代表请求可以直接写入数据库？
答案：不代表，反序列化只完成格式转换，还需要校验、认证授权和业务规则检查。
解析：转换、校验、授权和持久化是不同责任，分层后才能给客户端稳定错误并减少越权风险。

3. 为什么响应已经提交后不能随意改状态码？
答案：容器可能已经把响应头和状态行写出，后续修改无法回到客户端已接收的部分。
解析：需要在写 body 前确定状态和头部；流式响应还要处理异常、超时和取消时的资源释放。

## 本节小结

- Spring MVC 通过 `DispatcherServlet` 连接路由、参数绑定、消息转换、Controller 和响应写回。
- `@RestController`、`@RequestBody` 和 `@Valid` 分别表达控制器、转换和校验，不应混为授权。
- Filter 与 Interceptor 位于不同层次，执行范围和可见信息不同；顺序要通过注册与测试固定。
- response 提交、异步分派和流式下载都要求明确生命周期和资源边界。

## 快速回顾

- 能写出路径映射、JSON body、响应体和异常处理的最小 MVC 端点。
- 能说明 Filter、Interceptor、DispatcherServlet 与 Controller 的先后关系。
- 能用 `ResponseEntity` 设置状态码和头部，并识别响应提交后的限制。
- 能把转换、校验、授权和持久化拆成独立责任。
