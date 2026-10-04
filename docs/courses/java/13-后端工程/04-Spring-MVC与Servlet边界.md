---
title: Spring MVC 与 Servlet 边界
date: 2026-10-01T00:00:00.000Z
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
// 说明：HealthController.health() 直接调用返回 "ok"；只有容器中的 @RestController 与 /health 路由才会把返回值写入 HTTP 响应体。
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
class HealthController {
// 输入：表达式为 @RestController。
// // 关键变化：class HealthController { 使用表达式中的具体参数完成本次调用。
    @GetMapping("/health")
    String health() {
        return "ok";
    }
}

System.out.println(new HealthController().health());
// 输出：ok
```

`@RestController` 是 `@Controller` 与 `@ResponseBody` 的组合语义；返回对象是否为 JSON 还取决于可用的消息转换器和协商出的媒体类型。

这里直接 `new HealthController().health()` 只调用普通 Java 方法并得到 `ok`；它没有发起 HTTP 请求，`@RestController`、`@GetMapping` 和消息转换器只有在 Spring MVC 容器与 DispatcherServlet 请求链中才生效。

### `@RequestMapping`：声明共享路径前缀

用途：用于在控制器类上声明共享的路径前缀或媒体类型约束。

```java
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/users")
class UserController {
// 输入：表达式为 @RequestMapping("/users")。
// // 关键变化：class UserController { 使用表达式中的具体参数完成本次调用。
    String basePath() { return "/users"; }
}

System.out.println(new UserController().basePath());
// 输出：/users
// 说明：类级 @RequestMapping("/api/users") 给该控制器内所有方法增加 /api/users 前缀；只有 MVC 容器发现该 Bean 时才注册 URL。
```

`@RequestMapping` 可以同时限定 method、consumes 和 produces；类级别映射要与方法级别路径一起检查，避免冲突。

这里手工创建 `UserController` 只读取方法返回的字符串 `/users`；它没有证明 `/users` 已注册为路由，真实映射由 Spring MVC 启动时扫描控制器后建立。

### `@GetMapping`：匹配 GET 请求

用途：用于把只读 HTTP GET 请求映射到具体处理方法。

```java
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

class UserQueryController {
    @GetMapping("/users/{id}")
    String find(@PathVariable long id) { return "user-" + id; }
// 输入：表达式为 @GetMapping("/users/{id}")。
// // 关键变化：String find(@PathVariable long id) { return "user-" + id; } 使用表达式中的具体参数完成本次调用。
}

System.out.println(new UserQueryController().find(7));
// 输出：user-7
// 说明：GET /api/users/42 把路径变量 42 传给 findById；其他 HTTP 方法不匹配，直接调用方法也不会验证路由或参数转换。
```

`@GetMapping` 是限定了 GET 的组合注解；真实方法应显式声明 `@PathVariable`，不要仅靠参数名猜测绑定。

这里直接传入 `7` 只得到普通方法结果 `user-7`；真实请求中的路径变量解析、类型转换和 4xx 错误处理必须经过 Spring MVC 请求链。

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
// 输入：表达式为 String create(@RequestBody CreateUser request) {。
// // 关键变化：String create(@RequestBody CreateUser request) { 使用表达式中的具体参数完成本次调用。
        return "created:" + request.name();
    }
}

System.out.println(new CreateUserController().create(new CreateUser("Ann")));
// 输出：created:Ann
// 说明：POST JSON 的 name 字段由 HttpMessageConverter 反序列化为 CreateUserRequest；@Valid 再检查 DTO 约束。直接 new DTO 不触发反序列化或校验。
```

缺失 body、媒体类型不支持和 JSON 语法错误通常会在进入方法前失败；使用 `@Valid` 后还要统一处理字段错误。敏感字段不要在 DTO 的 `toString` 或异常信息中原样输出。

这里手工传入 `new CreateUser("Ann")` 只验证 `create` 返回 `created:Ann`；`@RequestBody` 的 JSON 反序列化、媒体类型协商与校验不会在直接 `new CreateUserController()` 时发生。

### 响应体：让返回值表达协议

用途：用于区分业务数据、HTTP 状态和错误信息；响应模型应保持稳定，避免把内部异常对象直接暴露给客户端。

```java
record ApiResponse<T>(String code, T data) {
    static <T> ApiResponse<T> ok(T data) {
        return new ApiResponse<>("OK", data);
// 返回：return new ApiResponse<>("OK", data) 把该表达式交给调用方。
// 初始状态：表达式为 return new ApiResponse<>("OK", data)。
    }
}

ApiResponse<String> response = ApiResponse.ok("ready");
System.out.println(response.code() + "/" + response.data());
// 输出：OK/ready
// 作用：用于区分业务数据、HTTP 状态和错误信息；响应模型应保持稳定，避免把内部异常对象直接暴露给客户端。
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
// 作用：用于把领域异常、参数错误和未知异常映射为稳定的 HTTP 响应，避免 Controller 到处复制 try/catch。
```

异常处理器要区分客户端可修复错误和服务端未知错误；生产响应不要返回堆栈、SQL 或密钥。记录日志时保留关联 ID 和 cause，但对用户只返回稳定错误码。

### `Filter`：拦截 Servlet 请求

用途：用于在 Servlet 层覆盖非 MVC 资源并插入请求 ID、编码或前置检查。

```java
import jakarta.servlet.Filter;
Filter servletFilter = (request, response, chain) -> chain.doFilter(request, response);
// 关键变化：servletFilter 接收右侧表达式 (request, response, chain) -> chain.doFilter(request, response) 的计算结果。
System.out.println(servletFilter != null);
// 输出：true
// 说明：Filter 读取 X-Trace-Id、写入 request 属性 traceId 后调用 chain.doFilter；漏调会在此终止请求，直接 new 不验证容器映射或链顺序。
```

Filter 必须通过 `FilterChain` 继续请求，否则会短路；它不知道最终选中的 MVC Handler。

### `HandlerInterceptor`：拦截 MVC Handler

用途：用于在 MVC 已选定 Handler 后执行权限、审计或耗时处理。

```java
import org.springframework.web.servlet.HandlerInterceptor;

HandlerInterceptor interceptor = new HandlerInterceptor() {};
// 输入：interceptor 的初始值为 new HandlerInterceptor() {}。
// 关键变化：interceptor 接收右侧表达式 new HandlerInterceptor() {} 的计算结果。
System.out.println(interceptor.preHandle(null, null, new Object()));
// 输出：true
// 说明：HandlerInterceptor.preHandle 在目标 Controller 前检查 X-User-Id；返回 true 才继续。只有 addInterceptors 注册后生效，直接 new 不会拦截请求。
```

`preHandle` 返回 `false` 会阻止 Controller 执行；需要覆盖非 MVC 请求时应选择 Filter。

## 不常用但需要知道

### ResponseEntity：显式设置状态和响应头

用途：用于需要精确控制 HTTP 状态码、Content-Type 或缓存头的响应；简单 JSON 可直接返回 DTO。

```java
import org.springframework.http.ResponseEntity;

ResponseEntity<String> response = ResponseEntity
    .status(201)
    .header("X-Request-Id", "req-7")
    .body("created");
    // 初始状态：response 当前保存 ResponseEntity .status(201) .header("X-Request-Id", "req-7") .body("created")的计算结果。
// // 关键变化：.body("created") 使用表达式中的具体参数完成本次调用。
System.out.println(response.getStatusCode().value() + "/" + response.getBody());
// 输出：201/created
// 说明：ResponseEntity 同时携带示例 body、明确状态码和响应头；例如 X-Request-Id=req-1 会随响应返回，而不是写进 JSON 对象。
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
// // 关键变化：class RequestIdFilter extends OncePerRequestFilter { 使用表达式中的具体参数完成本次调用。
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
// 说明：OncePerRequestFilter 用请求属性避免同一分派重复执行 doFilterInternal；示例设置安全响应头后放行，直接 new 不验证过滤器注册。
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
// // 关键变化：registry.addInterceptor(new RequestTraceInterceptor()).order(10) 使用表达式中的具体参数完成本次调用。
// 初始状态：表达式为 registry.addInterceptor(new RequestTraceInterceptor()).order(10)。
        System.out.println("trace-order=10");
        // 输出：trace-order=10
    }
}

class RequestTraceInterceptor implements org.springframework.web.servlet.HandlerInterceptor {}
// 作用：用于让多个 `HandlerInterceptor` 的前置、后置和完成回调形成可预测顺序，避免审计依赖尚未建立的上下文。
```

注册顺序、`order` 和 `addPathPatterns` 共同影响生效范围；前置回调通常按外层到内层进入，完成回调按相反方向收尾。对关键顺序写集成测试，不要只靠类名排序。

### `HttpServletResponse.flushBuffer`：理解响应提交边界

用途：用于定位 request 属性、输入流和 response 缓冲的时序问题；一次请求结束后不要保存容器对象到异步长期任务。

```java
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

void inspect(HttpServletRequest request, HttpServletResponse response) throws Exception {
    request.setAttribute("trace", "req-7");
    response.setContentType("text/plain;charset=UTF-8");
    response.getWriter().write("ok");
    response.flushBuffer();
// 输入：表达式为 response.flushBuffer()。
    // 作用：用于定位 request 属性、输入流和 response 缓冲的时序问题；一次请求结束后不要保存容器对象到异步长期任务。
    System.out.println(request.getAttribute("trace") + "/" + response.isCommitted());
    // 输出：req-7/true
}
```

`getWriter` 或 `getOutputStream` 的选择应与响应体类型一致；flush、缓冲区溢出或容器提交后，状态码和头部可能不能再改。异步 Servlet 场景还要使用异步上下文并保证超时、取消和资源释放。

## 常用调用标题补齐

### `@PostMapping`：接收创建命令

`@PostMapping` 映射 POST 请求；对重试敏感的创建操作要另行设计幂等键。

```java
// 结果：POST `/orders` 返回 `201` 和订单 ID `42`。
@RestController
@RequestMapping("/orders")
class OrderController {
    @PostMapping
    ResponseEntity<Long> create(@RequestBody CreateOrder body) {
// 输入：表达式为 @PostMapping。
    // 作用：@PostMapping 映射 POST 请求；对重试敏感的创建操作要另行设计幂等键。
    // 作用：通过 @PostMapping 接收创建命令。
        long id = 42L;
        return ResponseEntity.status(201).body(id);
    }
    record CreateOrder(String sku) {}
}
```

输出：POST `/orders` 返回 `201` 和订单 ID `42`。

### `@PutMapping`：处理可幂等更新

`@PutMapping` 通常表示对已知资源的整体替换；局部更新应明确 PATCH 语义。

```java
// 结果：对同一 ID 重复提交同一请求体，得到相同资源状态。
@RestController
class ProfileController {
    @PutMapping("/profiles/{id}")
    Profile replace(@PathVariable long id, @RequestBody Profile body) {
// 输入：表达式为 @PutMapping("/profiles/{id}")。
    // 作用：@PutMapping 通常表示对已知资源的整体替换；局部更新应明确 PATCH 语义。
    // 作用：通过 @PutMapping 处理可幂等更新。
        return new Profile(id, body.name());
    }
    record Profile(long id, String name) {}
    String route() { return "PUT /profiles/{id}"; }
}
```

输出：对同一 ID 重复提交同一请求体，得到相同资源状态。

### `@DeleteMapping`：处理删除命令

`@DeleteMapping` 将 DELETE 映射到方法；返回值应明确区分成功、不存在与无权。

```java
// 结果：DELETE `/sessions/a1` 打印 `delete a1` 并返回 `204`。
@RestController
class SessionController {
    @DeleteMapping("/sessions/{id}")
    ResponseEntity<Void> delete(@PathVariable String id) {
// 输入：表达式为 @DeleteMapping("/sessions/{id}")。
    // 作用：@DeleteMapping 将 DELETE 映射到方法；返回值应明确区分成功、不存在与无权。
    // 作用：通过 @DeleteMapping 处理删除命令。
        System.out.println("delete " + id);
// 输出：System.out 调用参数为 "delete " + id。
        return ResponseEntity.noContent().build();
    }
    String route() { return "DELETE /sessions/{id}"; }
}
```

输出：DELETE `/sessions/a1` 打印 `delete a1` 并返回 `204`。

### `@PathVariable`：读取路径变量

`@PathVariable` 适合资源标识；即使类型转换成功，仍需要业务层授权校验。

```java
// 结果：GET `/users/7` 返回 `user:7`。
@RestController
class UserController {
    @GetMapping("/users/{id}")
    String find(@PathVariable("id") long userId) {
// 输入：表达式为 String find(@PathVariable("id") long userId) {。
    // 作用：通过 @PathVariable 读取路径变量。
        if (userId <= 0) throw new ResponseStatusException(HttpStatus.BAD_REQUEST);
        return "user:" + userId;
    }
    String example() { return find(7); }
}
```

输出：GET `/users/7` 返回 `user:7`。

### `@RequestParam`：读取查询或表单参数

`@RequestParam` 适合筛选和小型标量参数；复杂输入应改用独立 DTO。

```java
// 结果：GET `/search?limit=200` 返回 `["limit=100"]`。
@RestController
class SearchController {
    @GetMapping("/search")
    List<String> search(
            @RequestParam(defaultValue = "10") int limit) {
// 输入：defaultValue 的初始值为 "10") int limit) {。
            // 作用：通过 @RequestParam 读取查询或表单参数。
        int safeLimit = Math.min(limit, 100);
        return List.of("limit=" + safeLimit);
    }
}
```

输出：GET `/search?limit=200` 返回 `["limit=100"]`。

### `@ResponseBody`：将返回值写入响应体

`@ResponseBody` 跳过视图解析，由 `HttpMessageConverter` 序列化返回值；`@RestController` 已组合该语义。

```java
// 结果：GET `/health` 返回 JSON `{"status":"UP"}`。
@Controller
class HealthController {
    @GetMapping("/health")
    @ResponseBody
    Map<String, String> health() {
// 输入：表达式为 @ResponseBody。
    // 作用：@ResponseBody 跳过视图解析，由 HttpMessageConverter 序列化返回值；@RestController 已组合该语义。
    // 作用：通过 @ResponseBody 将返回值写入响应体。
        return Map.of("status", "UP");
    }
    String mediaType() { return "application/json"; }
}
```

输出：GET `/health` 返回 JSON `{"status":"UP"}`。

### `@ExceptionHandler`：映射已知异常

`@ExceptionHandler` 只处理声明的异常类型；不要用一个笼统的 `Exception` 分支掩盖编程错误。

```java
// 结果：`IllegalArgumentException` 被转为 `400` 和稳定错误码 `BAD_INPUT`。
@RestControllerAdvice
class ApiErrors {
    @ExceptionHandler(IllegalArgumentException.class)
    ResponseEntity<Map<String, String>> badInput(IllegalArgumentException ex) {
// 输入：表达式为 @ExceptionHandler(IllegalArgumentException.class)。
    // 作用：@ExceptionHandler 只处理声明的异常类型；不要用一个笼统的 Exception 分支掩盖编程错误。
    // 作用：通过 @ExceptionHandler 映射已知异常。
        return ResponseEntity.badRequest()
            .body(Map.of("code", "BAD_INPUT"));
    }
    String boundary() { return "validation"; }
}
```

输出：`IllegalArgumentException` 被转为 `400` 和稳定错误码 `BAD_INPUT`。

### `@RestControllerAdvice`：集中处理 REST 异常

`@RestControllerAdvice` 组合全局 advice 与响应体语义；应输出稳定协议，不向客户端暴露堆栈。

```java
// 结果：未找到资源时返回 `404` Problem Detail。
@RestControllerAdvice
class GlobalErrors {
// 输入：表达式为 @RestControllerAdvice。
// 作用：@RestControllerAdvice 组合全局 advice 与响应体语义；应输出稳定协议，不向客户端暴露堆栈。
// 作用：通过 @RestControllerAdvice 集中处理 REST 异常。
    @ExceptionHandler(NoSuchElementException.class)
    ProblemDetail notFound(NoSuchElementException ex) {
        ProblemDetail detail = ProblemDetail.forStatus(404);
        detail.setTitle("resource not found");
        return detail;
    }
    String format() { return "problem+json"; }
}
```

输出：未找到资源时返回 `404` Problem Detail。

### `FilterChain.doFilter`：放行到下一个过滤器

`FilterChain.doFilter` 是过滤链继续的显式边界；不调用即表示当前 Filter 终止请求。

```java
// 结果：下游处理完成后打印 `response completed`。
final class RequestIdFilter implements Filter {
    public void doFilter(ServletRequest request,
                         ServletResponse response,
                         FilterChain chain) throws IOException, ServletException {
// 输入：表达式为 public void doFilter(ServletRequest request,。
                         // 作用：FilterChain.doFilter 是过滤链继续的显式边界；不调用即表示当前 Filter 终止请求。
                         // 作用：通过 FilterChain.doFilter 放行到下一个过滤器。
        request.setAttribute("requestId", UUID.randomUUID().toString());
        chain.doFilter(request, response);
// // 关键变化：chain.doFilter(request, response) 使用表达式中的具体参数完成本次调用。
        System.out.println("response completed");
// 输出：System.out 调用参数为 "response completed"。
    }
}
```

输出：下游处理完成后打印 `response completed`。

### `InterceptorRegistry.addInterceptor`：注册 MVC 拦截器

`addInterceptor` 注册的是 Handler 拦截器，不会覆盖在 Servlet 层就终止的请求。

```java
// 结果：拦截器匹配 `/api/**`，但跳过 `/api/public/**`。
@Configuration
class WebConfiguration implements WebMvcConfigurer {
    public void addInterceptors(InterceptorRegistry registry) {
        registry.addInterceptor(new LocaleInterceptor())
            .addPathPatterns("/api/**")
            .excludePathPatterns("/api/public/**");
// 输入：表达式为 registry.addInterceptor(new LocaleInterceptor())。
            // 作用：addInterceptor 注册的是 Handler 拦截器，不会覆盖在 Servlet 层就终止的请求。
            // 作用：通过 InterceptorRegistry.addInterceptor 注册 MVC 拦截器。
    }
    String scope() { return "handler"; }
}
```

输出：拦截器匹配 `/api/**`，但跳过 `/api/public/**`。

### `ResourceHandlerRegistry.addResourceHandler`：注册静态资源 URL

`addResourceHandler` 定义对外 URL pattern；对应的物理位置仍必须限制在白名单根目录。

```java
// 结果：`classpath:/public/app.js` 可由 `/assets/app.js` 访问。
@Configuration
class StaticConfiguration implements WebMvcConfigurer {
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        registry.addResourceHandler("/assets/**")
            .addResourceLocations("classpath:/public/")
            .setCachePeriod(3600);
// 输入：表达式为 registry.addResourceHandler("/assets/**")。
            // 作用：addResourceHandler 定义对外 URL pattern；对应的物理位置仍必须限制在白名单根目录。
            // 作用：通过 ResourceHandlerRegistry.addResourceHandler 注册静态资源 URL。
    }
    String publicPath() { return "/assets/**"; }
}
```

输出：`classpath:/public/app.js` 可由 `/assets/app.js` 访问。

### `CorsConfiguration`：声明 CORS 白名单

`CorsConfiguration` 必须显式限制来源、方法和请求头；携带凭证时不能把来源设为通配符。

```java
// 结果：只允许 `https://app.example.com` 按列出的方法跨域访问。
@Bean
CorsConfiguration apiCors() {
// 作用：通过 CorsConfiguration 声明 CORS 白名单。
    CorsConfiguration cors = new CorsConfiguration();
// 输入：cors 的初始值为 new CorsConfiguration()。
    // 作用：CorsConfiguration 必须显式限制来源、方法和请求头；携带凭证时不能把来源设为通配符。
    cors.setAllowedOrigins(List.of("https://app.example.com"));
    cors.setAllowedMethods(List.of("GET", "POST"));
    cors.setAllowedHeaders(List.of("Authorization", "Content-Type"));
    cors.setAllowCredentials(true);
    return cors;
}
```

输出：只允许 `https://app.example.com` 按列出的方法跨域访问。

### `UrlBasedCorsConfigurationSource.registerCorsConfiguration`：按 URL 注册 CORS

`registerCorsConfiguration` 将一组 CORS 规则绑定到路径；更具体的路径应使用独立规则。

```java
// 结果：`/api/**` 和 `/docs/**` 分别使用各自的 CORS 规则。
@Bean
UrlBasedCorsConfigurationSource corsSource(CorsConfiguration apiCors) {
    UrlBasedCorsConfigurationSource source =
        new UrlBasedCorsConfigurationSource();
        // 初始状态：source 当前保存 new UrlBasedCorsConfigurationSource()的计算结果。
    source.registerCorsConfiguration("/api/**", apiCors);
    // 作用：通过 UrlBasedCorsConfigurationSource.registerCorsConfiguration 按 URL 注册 CORS。
    CorsConfiguration open = new CorsConfiguration();
    open.setAllowedOrigins(List.of("https://docs.example.com"));
    source.registerCorsConfiguration("/docs/**", open);
// // 关键变化：source.registerCorsConfiguration("/docs/**", open) 使用表达式中的具体参数完成本次调用。
    return source;
}
```

输出：`/api/**` 和 `/docs/**` 分别使用各自的 CORS 规则。

### `CorsFilter`：在 Servlet 链前置处理 CORS

`CorsFilter` 适合在 MVC 之前处理预检请求；已由 Spring Security 统一配置时不要重复注册。

```java
// 结果：匹配规则的 `OPTIONS` 预检请求在 Servlet 过滤链中得到 CORS 响应。
@Bean
CorsFilter corsFilter(UrlBasedCorsConfigurationSource source) {
// 作用：通过 CorsFilter 在 Servlet 链前置处理 CORS。
    CorsFilter filter = new CorsFilter(source);
// 输入：filter 的初始值为 new CorsFilter(source)。
    // 作用：CorsFilter 适合在 MVC 之前处理预检请求；已由 Spring Security 统一配置时不要重复注册。
    return filter;
}

String preflightMethod() {
    return "OPTIONS";
}
```

输出：匹配规则的 `OPTIONS` 预检请求在 Servlet 过滤链中得到 CORS 响应。

### `HttpServletResponse.addHeader`：追加可重复响应头

`addHeader` 会保留同名旧值；必须唯一的响应头应使用 `setHeader`，且要在响应提交前设置。

```java
// 结果：响应包含两个 `Vary` 值和一个下载文件名。
void writeDownloadHeaders(HttpServletResponse response) {
    response.setContentType("application/octet-stream");
    response.addHeader("Vary", "Origin");
// 输入：表达式为 response.addHeader("Vary", "Origin")。
    // 作用：通过 HttpServletResponse.addHeader 追加可重复响应头。
    response.addHeader("Vary", "Access-Control-Request-Method");
// // 关键变化：response.addHeader("Vary", "Access-Control-Request-Method") 使用表达式中的具体参数完成本次调用。
    response.setHeader(
        "Content-Disposition",
        "attachment; filename=report.csv");
}
```

输出：响应包含两个 `Vary` 值和一个下载文件名。

### `HttpServletResponse.sendError`：交给容器生成错误响应

`sendError` 可能立即提交响应；调用后应立即结束当前处理，不再写响应体。

```java
// 结果：缺少 `X-Api-Key` 时返回 `401`，且不继续写正常响应。
void requireApiKey(HttpServletRequest request,
                   HttpServletResponse response) throws IOException {
    String apiKey = request.getHeader("X-Api-Key");
    // 初始状态：apiKey 当前为 request.getHeader("X-Api-Key")。
    if (apiKey == null) {
        response.sendError(401, "missing api key");
        // 作用：通过 HttpServletResponse.sendError 交给容器生成错误响应。
        return;
    }
    response.setStatus(204);
}
```

输出：缺少 `X-Api-Key` 时返回 `401`，且不继续写正常响应。

### `ServletInputStream`：适配 Servlet 请求体字节流

`ServletInputStream` 是容器管理的请求体入口；要重复读取时应缓存有限字节，并正确实现非阻塞状态。

```java
// 结果：读完缓存字节后 `isFinished()` 返回 `true`。
final class ByteArrayServletInputStream extends ServletInputStream {
// 作用：通过 ServletInputStream 适配 Servlet 请求体字节流。
    private final ByteArrayInputStream delegate;
    ByteArrayServletInputStream(byte[] body) {
        this.delegate = new ByteArrayInputStream(body);
// 关键变化：delegate 接收右侧表达式 new ByteArrayInputStream(body) 的计算结果。
// 初始状态：delegate 的初始值为 new ByteArrayInputStream(body)。
    }
    public int read() { return delegate.read(); }
    public boolean isFinished() { return delegate.available() == 0; }
    public boolean isReady() { return true; }
    public void setReadListener(ReadListener listener) {}
}
```

输出：读完缓存字节后 `isFinished()` 返回 `true`。

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
