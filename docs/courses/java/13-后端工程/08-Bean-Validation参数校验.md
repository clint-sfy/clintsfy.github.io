---
title: Bean Validation 参数校验
date: 2026-10-01
category: Java后端工程
tags:
  - Java
  - Bean Validation
  - Spring MVC
  - 参数校验
description: 速查 Bean Validation 约束、级联、分组、方法参数、自定义 ConstraintValidator 和字段错误响应。
---

# Bean Validation 参数校验

## 学习目标

- 能为请求 DTO 选择 `@NotBlank`、`@NotNull`、`@Size`、`@Email` 和 `@Pattern` 等常见约束。
- 能用 `@Valid`、`@Validated` 和级联标记校验嵌套对象、集合与方法参数。
- 能用分组表达创建/更新等不同场景，理解 `Default` 组和组序列的边界。
- 能实现 `ConstraintValidator`，并把 `FieldError`/`BindingResult` 转成稳定的字段错误响应。
- 能把 JSON 转换、参数校验和安全授权拆成不同责任，避免校验器承担业务权限判断。

## 核心知识点

### 专业术语

- **约束（constraint）**：声明字段、参数或对象必须满足的可验证规则。
- **验证器（Validator）**：读取约束元数据并产生 `ConstraintViolation` 的执行组件。
- **级联（cascade）**：父对象使用 `@Valid` 后继续验证其嵌套对象、集合元素或 Map value。
- **分组（validation group）**：按场景选择一组约束；未指定时通常使用 `Default`。
- **方法参数校验**：使用 `@Validated` 和方法级约束检查 `@RequestParam`、`@PathVariable` 等参数及返回值。
- **字段错误（FieldError）**：把对象字段名、拒绝值和消息模板关联起来的错误描述，可转换成客户端协议。

### 白话解释与边界

Bean Validation 只回答“输入是否满足声明的格式和规则”，不负责把 JSON 文本转换成 DTO，也不负责认证授权。典型链路是消息转换器先创建对象 → Validation 检查字段、嵌套对象和方法参数 → Security 检查主体权限 → 服务层执行业务规则。转换失败通常是 400 的格式错误，校验失败是字段错误，授权失败是 401/403；应分别记录和响应。

约束注解适合可复用、确定性的输入规则；跨字段、依赖数据库或依赖当前用户的规则要放到领域服务或授权策略中。校验器不要读取请求中的角色并自行放行，也不要把密码、token 等敏感值放进违反约束的消息中。Spring Boot 4 / Spring Framework 7 使用 `jakarta.validation.*`；旧项目仍需以依赖版本为准，不能混用 `javax.validation.*` 与 `jakarta.validation.*`。

## 常用用法

### @NotBlank/@Size：声明基础字段约束

用途：用于限制文本的非空状态和长度范围；`@NotBlank` 处理 null、空串和空白串，`@Size` 只检查长度，不替代格式或权限检查。

```java
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

record CreateNote(
    @NotBlank String title,
    @Size(min = 1, max = 200) String body) {}

System.out.println(new CreateNote("hello", "text").title());
// 输出：hello
```

约束只在验证器被触发时生效；直接调用 record 构造器不会自动抛出校验异常。消息模板可以本地化，但不要把内部堆栈、数据库值或授权判断写入客户端消息。

### @Valid/@Validated：触发对象与分组校验

用途：用于在 Spring MVC 控制器或服务入口触发校验；`@Valid` 常用于默认组级联，`@Validated` 还能声明分组和启用方法校验。

```java
import jakarta.validation.Valid;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

@Validated
class NoteController {
    @PostMapping("/notes")
    String create(@Valid @RequestBody CreateNote request) {
        return "accepted:" + request.title();
    }
}

System.out.println("validation=enabled");
// 输出：validation=enabled
```

`@RequestBody` 负责 JSON 转换，`@Valid` 负责校验；它们不是同一个步骤。方法参数校验需要在对应 Spring 代理和配置下运行，不能因为单元测试直接 new 控制器就认为注解已生效。

### 级联：验证嵌套对象和集合元素

用途：用于让父 DTO 的验证继续进入地址、明细和集合元素；没有 `@Valid` 时，嵌套对象上的约束可能不会被触发。

```java
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import java.util.List;

record Address(@NotBlank String city) {}
record Order(@Valid Address address, List<@Valid Address> stops) {}

System.out.println(new Order(new Address("Shanghai"), List.of(new Address("Beijing"))).stops().size());
// 输出：1
```

容器元素约束需要兼容的 Bean Validation 版本和 value extractor；级联集合还要明确空集合是否允许。校验嵌套对象不等于检查对象是否属于当前用户，所有者授权仍由 Security 或领域服务完成。

### 分组：按场景选择规则

用途：用于让创建、更新等操作选择不同约束集合；分组解决校验时机，不应被用来模拟角色授权或业务状态机。

```java
import jakarta.validation.constraints.NotNull;
import jakarta.validation.groups.Default;

interface OnCreate {}
record Account(
    @NotNull(groups = OnCreate.class) Long id,
    @NotNull(groups = Default.class) String owner) {}

System.out.println("groups=" + OnCreate.class.getSimpleName() + "/" + Default.class.getSimpleName());
// 输出：groups=OnCreate/Default
```

调用方必须明确传入哪个分组；多个分组的组合顺序要有测试，避免新增约束后某个入口静默跳过。若规则有先后依赖，可以定义组序列，但跨字段业务条件仍放在服务层。

## 不常用但需要知道

### ConstraintValidator：实现自定义约束

用途：用于封装跨格式但与输入本身有关的可复用规则，例如固定前缀或校验码；验证器应保持无副作用、线程安全，并正确处理 null 语义。

```java
import jakarta.validation.Constraint;
import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;

@Constraint(validatedBy = StrongCodeValidator.class)
@interface StrongCode { String message() default "invalid code"; }

class StrongCodeValidator implements ConstraintValidator<StrongCode, String> {
    @Override public boolean isValid(String value, ConstraintValidatorContext context) {
        return value == null || value.matches("[A-Z]{2}-\\d{4}");
    }
}

System.out.println(new StrongCodeValidator().isValid("AB-1234", null));
// 输出：true
```

如果 null 应由 `@NotNull` 负责，就让自定义验证器返回 true；把空值和格式规则混在一起会影响组合约束。验证器不应查询当前登录用户、读取数据库后决定能否操作，那是授权或领域规则。

### 字段错误响应：稳定输出 FieldError

用途：用于把 `BindingResult` 中的 `FieldError` 转成只包含字段名和公开消息的响应，避免直接暴露内部对象、拒绝值和异常堆栈。

```java
import org.springframework.validation.BindingResult;
import org.springframework.validation.FieldError;
import java.util.List;

String fieldErrors(BindingResult result) {
    List<String> errors = result.getFieldErrors().stream()
        .map(FieldError::getField)
        .toList();
    return String.join(",", errors);
}

System.out.println("title,body");
// 输出：title,body
```

实际异常处理器还应固定错误码、HTTP 状态和 trace id，并对嵌套路径、类型转换错误和方法参数错误分别归类。不要把 `FieldError.getRejectedValue()` 原样写入日志或响应，尤其是密码、token 和大对象。

### 转换/校验/授权职责：分离请求边界

用途：用于在代码审查和故障排查时明确三层责任：转换器创建类型、Validation 检查输入、Security/领域策略决定权限；每层只返回自己的错误。

```java
record RequestBoundary(String rawJson, boolean valid, boolean authorized) {}

RequestBoundary boundary = new RequestBoundary("{...}", true, false);
String result = boundary.authorized() ? "service-call" : "403";
System.out.println(result);
// 输出：403
```

JSON 文本不能因为“能解析”就直接写入数据库；校验通过也不能跳过对象所有者和权限判断；授权通过更不能替代字段类型转换。把三步拆开能让 400、401/403 与业务失败分别可观测、可测试。

### 方法参数：校验 RequestParam 与 PathVariable

用途：用于保护不在请求 body 中的查询参数和路径参数；方法级校验需要 `@Validated` 触发，且转换失败与约束失败应分别处理。

```java
import jakarta.validation.constraints.Min;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;

@Validated
class SearchController {
    @GetMapping("/users/{id}")
    String find(@PathVariable @Min(1) long id,
                @RequestParam(defaultValue = "0") @Min(0) int page) {
        return id + "/" + page;
    }
}

System.out.println("7/0");
// 输出：7/0
```

字符串到 `long` 的转换失败通常先于 `@Min` 发生；不要把“类型转换成功”当作“值域合法”。路径参数、分页大小和排序字段仍要限制上限，授权要在确定资源主体后单独执行。

## 继续阅读

- [List 基础](/courses/java/05-泛型与集合/04-List常用API)：构建字段错误列表和级联集合时查 List 的快照语义。
- [Map 基础](/courses/java/05-泛型与集合/07-Map常用API)：组织错误码、消息模板和分组映射时查 Map 的键值选择。
- [String 文本处理](/courses/java/02-数组与文本/02-String与文本处理)：规范化字段、消息和路径参数时查字符串边界。
- [JSON 与 Java 对象转换](/courses/java/02-数组与文本/05-JSON与Java对象转换)：区分 JSON 转换与字段校验。
- [Spring MVC 与 Servlet 边界](/courses/java/13-后端工程/04-Spring-MVC与Servlet边界)：查看 `@RequestBody`、异常处理和响应提交边界。
- [Spring Security 与 JWT](/courses/java/13-后端工程/05-Spring-Security与JWT)：查看认证、授权与 401/403 责任。

## 简单案例

```java
import jakarta.validation.Valid;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

record RegisterRequest(
    @NotBlank String name,
    @Email String email) {}

class RegistrationService {
    String accept(@Valid RegisterRequest request) {
        return "created:" + request.name();
    }
}

System.out.println(new RegistrationService().accept(new RegisterRequest("Ann", "ann@example.test")));
// 输出：created:Ann
```

框架片段需容器运行：消息转换器先把 body 变成 `RegisterRequest`，Bean Validation 再检查约束，Security 决定主体是否有注册权限，服务层最后处理业务。案例没有把验证器当作授权器，也没有让 JSON 转换承担必填规则。

## 易混点

- `@NotNull` 只拒绝 null，`@NotBlank` 还拒绝空白文本；`@Size` 检查长度，不检查文本内容格式。
- `@Valid` 触发默认组和级联，`@Validated` 可声明分组并参与方法校验；都不负责 JSON 反序列化。
- 自定义 `ConstraintValidator` 适合纯输入规则；依赖当前用户、数据库或资源所有者的判断属于授权/领域服务。
- 字符串到数字的转换失败可能在约束执行前发生；错误响应应区分转换错误和字段约束错误。
- `FieldError` 只应输出公开字段名和消息，拒绝值可能包含敏感信息，不应原样回显。
- 分组是校验选择机制，不是角色系统；通过 `OnCreate` 不表示主体拥有创建权限。

## 课后小问

1. 为什么嵌套对象上的约束没有自动生效？
答案：父对象需要在嵌套字段或集合元素上标记 `@Valid`，验证器才会沿对象图继续级联。
解析：级联只负责走到下一级并执行约束，不会替代资源所有者检查；授权仍要在 Security 或服务层完成。

2. `@Validated(OnCreate.class)` 是否能替代登录和权限检查？
答案：不能，分组只选择要运行的校验规则，不证明请求主体已认证或有创建权限。
解析：转换、校验和授权分别产生不同错误边界，混在一个注解里会让越权和输入错误难以审计。

3. 为什么字段错误响应不应包含 rejected value？
答案：拒绝值可能是密码、token、大段输入或内部数据，原样回显会造成敏感信息泄露和响应膨胀。
解析：客户端通常只需要字段名、稳定错误码和可本地化消息；详细值应留在受控的诊断上下文中，且按敏感级别脱敏。

## 本节小结

- 常见约束描述字段和参数边界，`@Valid`/`@Validated` 触发对象、级联和方法校验。
- 分组选择校验场景，`ConstraintValidator` 承载无副作用的可复用输入规则。
- `BindingResult`/`FieldError` 应转换为稳定、脱敏的字段错误响应。
- JSON 转换、参数校验、认证授权和业务规则各自负责一层，不能相互替代。

## 快速回顾

- 能选择 `@NotBlank`、`@NotNull`、`@Size`、`@Email`、`@Pattern` 等约束。
- 能说明 `@Valid`、`@Validated`、级联和 `Default`/自定义分组的关系。
- 能写出 `ConstraintValidator` 与 `@Constraint(validatedBy = ...)` 的最小结构。
- 能从 `FieldError` 构造脱敏响应，并区分转换、校验和授权错误。
