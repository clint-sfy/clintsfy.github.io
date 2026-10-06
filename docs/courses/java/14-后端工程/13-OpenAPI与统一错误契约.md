---
title: OpenAPI 与统一错误契约
date: 2026-10-05
category: Java后端工程
tags: [Java, Spring, OpenAPI, ProblemDetail]
description: 将接口文档、HTTP 状态、校验错误和稳定错误码组成可测试的客户端契约。
---

# OpenAPI 与统一错误契约

## 学习目标

- 能为接口声明请求、成功和失败结构，并验证生成的 OpenAPI。
- 能用 ProblemDetail 统一异常响应，区分状态码、业务错误码和关联 ID。
- 能规定分页、排序和幂等语义，让客户端知道失败后能否重试。

## 核心知识点

OpenAPI 是接口的机器可读描述，springdoc 根据 Spring MVC 映射和注解生成它；生成成功不意味着描述与实际响应完全一致。ProblemDetail 是 RFC 9457 的错误载体，`type` 标识问题类型、`status` 表示 HTTP 状态、`detail` 面向用户，扩展 `code` 给程序判断。correlation ID 用来定位日志，不能作为认证凭证。

本文采用 JDK 20、Spring Boot 3.4 / Framework 6.2、springdoc 2.8 的兼容线，依赖 `springdoc-openapi-starter-webmvc-ui` 和 Boot validation starter，补丁由项目依赖管理锁定。Boot 4 使用 springdoc 3.x 并核对官方兼容矩阵；不要混用两个主版本。以下片段放入 Boot MVC 工程，使用注释给出的完整限定类名或相应 import，不要求独立 main。官方依据：[springdoc 配置及兼容矩阵](https://springdoc.org/)、[Spring 错误响应](https://docs.spring.io/spring-framework/reference/web/webmvc/mvc-ann-rest-exceptions.html)。

契约先约定语义，再写注解。创建成功返回 201 与 Location；找不到返回 404；状态冲突返回 409；格式/字段校验失败返回 400；认证失败 401 和权限不足 403 分开。不要把失败包装成 HTTP 200。分页限定 page≥0、1≤size≤100，排序只接受白名单 `id`、`createdAt` 并追加唯一键保证顺序；total 与数据可能因并发变动，不能承诺快照一致。幂等键必须绑定身份、操作和请求摘要，在服务端原子记录处理中/完成状态；同键不同请求拒绝，保留期结束后的重试不再保证去重。

## 常用用法

### `GroupedOpenApi`：按业务路径生成文档

用途：用于把订单接口组成独立文档组，减少客户端在无关接口中查找的成本。

```java
// 初始状态：MVC 工程已有 /orders/{id} 和 /admin/users 两类路径。
org.springdoc.core.models.GroupedOpenApi group =
    org.springdoc.core.models.GroupedOpenApi.builder()
        .group("orders").pathsToMatch("/orders/**").build();
// 关键变化：orders 组仅扫描订单路径；Bean 注册后提供 /v3/api-docs/orders。
org.junit.jupiter.api.Assertions.assertEquals("orders", group.getGroup());
// 结果：分组名是 orders；还要用集成测试检查生成 paths 不含 /admin/users。
```

把 group 作为 `@Bean` 返回；文档端点和 UI 在生产必须通过安全规则限制，关闭 UI 不会自动关闭 `/v3/api-docs`。配置 `springdoc.api-docs.enabled=false` 可以关闭生成端点；公开文档需移除管理接口、内部主机和密钥样例。

### `@Operation`：声明实际存在的成功响应

用途：用于给订单查询标注稳定 operationId 和成功结构，方便生成客户端并核对契约。

```java
// 初始状态：教学订单 7 存在，真实项目将固定返回替换为服务查询。
@org.springframework.web.bind.annotation.RestController
class OrderController {
    record OrderView(long id, String state) {}
    @io.swagger.v3.oas.annotations.Operation(operationId = "findOrder", summary = "查询订单")
    @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "订单存在")
    @org.springframework.web.bind.annotation.GetMapping("/orders/{id}")
    OrderView find(@org.springframework.web.bind.annotation.PathVariable("id") long id) {
        if (id != 7) throw new IllegalArgumentException("ORDER_NOT_FOUND");
        // 关键变化：只有 id=7 分支产生成功数据；其他 ID 进入异常契约。
        return new OrderView(id, "PAID");
    }
}
// 结果：GET /orders/7 返回 200 与 {"id":7,"state":"PAID"}；失败由下节 advice 映射。
```

在真实接口另加 404 的 `@ApiResponse` 与 ProblemDetail schema；API 注解描述响应，不执行权限、校验或异常映射。operationId 应唯一且稳定，改名可能破坏生成客户端。测试应同时断言真实 JSON 和 `/v3/api-docs` 的 response/schema。

### `OpenApiCustomizer`：集中补充 API 元数据

用途：用于对生成的 OpenAPI 文档补充版本信息，而不在每个 Controller 重复维护。

```java
// 初始状态：新 OpenAPI 没有 info，定制器将为 v1 订单契约设置元数据。
io.swagger.v3.oas.models.OpenAPI document = new io.swagger.v3.oas.models.OpenAPI();
org.springdoc.core.customizers.OpenApiCustomizer customizer = api ->
    api.info(new io.swagger.v3.oas.models.info.Info().title("Order API").version("v1"));
customizer.customise(document);
// 关键变化：info 从空变成 Order API/v1；Bean 注册后作用于生成文档。
org.junit.jupiter.api.Assertions.assertEquals("v1", document.getInfo().getVersion());
// 结果：版本字段为 v1；它是契约版本，不是依赖或数据库版本。
```

### `ProblemDetail.forStatusAndDetail`：建立可公开的错误体

用途：用于将已分类的业务失败转换为统一结构，同时保留稳定错误码和安全关联 ID。

```java
// 初始状态：订单 7 已取消，客户端请求支付；外部关联 ID 已经过长度/字符白名单校验。
org.springframework.http.ProblemDetail problem =
    org.springframework.http.ProblemDetail.forStatusAndDetail(
        org.springframework.http.HttpStatus.CONFLICT, "订单已取消，不能支付");
problem.setType(java.net.URI.create("https://api.example.com/problems/order-state"));
problem.setTitle("订单状态冲突");
problem.setProperty("code", "ORDER_STATE_CONFLICT");
problem.setProperty("correlationId", "req-7");
// 关键变化：错误同时携带 409 和稳定 code；detail 没有异常类名或 SQL。
org.junit.jupiter.api.Assertions.assertEquals(409, problem.getStatus());
org.junit.jupiter.api.Assertions.assertEquals("ORDER_STATE_CONFLICT", problem.getProperties().get("code"));
// 结果：Spring MVC 按 problem.status 输出 HTTP 409，Jackson 扩展字段输出在顶层。
```

### `@RestControllerAdvice`：统一分类异常

用途：用于把已知异常映射为公开错误，避免直接把异常 message、堆栈或数据库信息返回客户端。

```java
// 初始状态：前面的 Controller 对非 7 ID 抛出教学用 IllegalArgumentException。
@org.springframework.web.bind.annotation.RestControllerAdvice
class OrderErrors {
    @org.springframework.web.bind.annotation.ExceptionHandler(IllegalArgumentException.class)
    org.springframework.http.ProblemDetail missing(IllegalArgumentException failure) {
        org.springframework.http.ProblemDetail p = org.springframework.http.ProblemDetail
            .forStatusAndDetail(org.springframework.http.HttpStatus.NOT_FOUND, "订单不存在");
        p.setProperty("code", "ORDER_NOT_FOUND");
        // 关键变化：内部异常被映射为固定公开描述，不回显 failure.getMessage()。
        return p;
    }
}
// 结果：GET /orders/8 为 404，code=ORDER_NOT_FOUND；教学异常类型不可泛化到全部参数错误。
```

生产应用使用专用 `OrderNotFoundException`，以免把编程错误误分类为 404。未知异常输出脱敏的 500 错误码，在服务端记录堆栈与同一 correlation ID。框架校验/解析错误可继承 `ResponseEntityExceptionHandler` 统一处理；Boot 的 `spring.mvc.problemdetails.enabled` 提供内置处理时注意 advice 顺序，避免重复 handler。

### `@Valid`：验证请求结构

用途：用于在 MVC 参数绑定后验证订单输入，并把字段拒绝映射为明确的 400 契约。

```java
// 初始状态：工程包含 jakarta.validation provider，name="" 违反 @NotBlank。
record CreateOrder(@jakarta.validation.constraints.NotBlank String name) {}
@org.springframework.web.bind.annotation.RestController
class CreateOrders {
    @org.springframework.web.bind.annotation.PostMapping("/orders")
    org.springframework.http.ResponseEntity<CreateOrder> create(
        @jakarta.validation.Valid @org.springframework.web.bind.annotation.RequestBody CreateOrder input) {
        // 关键变化：合法输入进入方法；空 name 在调用方法前成为校验失败。
        return org.springframework.http.ResponseEntity.created(java.net.URI.create("/orders/7")).body(input);
    }
}
// 结果：合法 name 返回 201/Location；空 name 为 400，需统一 advice 增加 VALIDATION_FAILED。
```

字段错误只返回白名单字段名和可公开的说明，不回显 rejectedValue；密码字段尤其如此。`@Valid` 不替代唯一约束、权限与并发业务检查。方法级校验与 MVC 参数校验的异常类型取决于 Spring 版本和代理配置，应各用测试固定契约，参见[参数校验](/courses/java/14-后端工程/08-Bean-Validation参数校验)。

## 易混点

`status` 给 HTTP 工具分类，`code` 给客户端稳定分支，`detail` 给人阅读，三者不能相互替代。客户端不要按中文 detail 判断重试。公开错误必须脱敏，但服务端仍应保留诊断原因；关联 ID 应由可信服务生成或严格校验。文档里的幂等声明只有配套持久化与并发测试才成立。

## 课后小问

1. POST 超时后换一个幂等键重试安全吗？答案：可能重复创建。解析：原请求可能已提交，新键绕过去重；先查询旧键状态或按原键恢复。
2. 为何不返回数据库异常 message？答案：可能泄露表名、SQL 或敏感值。解析：公开固定 code，内部日志关联调查。
3. OpenAPI 标注 404 后能自动返回 404 吗？答案：不能。解析：实际状态由 Controller/advice 决定，要同时测试文档与实现。

## 本节小结

错误契约是一组稳定行为：真实 HTTP 状态、安全描述、错误码和关联 ID。springdoc 帮助发布文档，校验和异常处理负责执行契约。

## 快速回顾

先定状态/分页/排序/幂等约束 → 注解与定制文档 → ProblemDetail 分类错误 → 测试真实请求与文档输出 → 检查安全暴露与脱敏。
