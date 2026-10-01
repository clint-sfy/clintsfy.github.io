---
title: Spring Security 与 JWT
date: 2026-10-01
category: Java后端工程
tags:
  - Java
  - Spring Security
  - JWT
  - OAuth 2.0
description: 速查 Spring Security 的认证授权链路、密码哈希、Bearer JWT、无状态会话以及 401/403 与撤销边界。
---

# Spring Security 与 JWT

## 学习目标

- 能把认证（你是谁）和授权（你能做什么）放在清晰的 Spring Security 请求链路中。
- 能用 `SecurityFilterChain`、`authorizeHttpRequests` 和 `@PreAuthorize` 表达 URL 与方法授权规则。
- 能使用 `BCryptPasswordEncoder` 保存密码哈希，理解 Bearer JWT 的 claims、过期和密钥来源。
- 能区分未认证的 401、已认证但无权限的 403，并判断无状态 token 与撤销列表的取舍。

## 核心知识点

### 专业术语

- **认证（authentication）**：验证请求携带的凭据属于哪个主体，结果通常是 `Authentication`。
- **授权（authorization）**：根据主体、角色、权限和资源规则决定是否允许继续执行。
- **SecurityFilterChain**：Servlet 请求进入 Controller 前经过的安全过滤器链；它可以解析凭据、建立安全上下文并执行授权。
- **Bearer token**：通过 `Authorization: Bearer <token>` 携带访问令牌的 HTTP 约定；Bearer 表示“持有者即可使用”，客户端必须保护它。
- **JWT claims**：JWT 载荷中的声明，如 `sub`（主体）、`iat`（签发时间）、`exp`（过期时间）和 `jti`（令牌标识）。
- **BCrypt**：带随机盐和可调工作因子的密码哈希算法；密码应验证哈希，不应解密或自行比较明文。

### 白话解释与边界

典型请求链路是：客户端提交登录凭据 → 认证器验证用户和 BCrypt 哈希 → 服务签发带 claims 的 JWT → 客户端用 Bearer header 发送 JWT → Security 过滤器验签、检查 `exp` 和撤销状态 → URL 或方法授权器判断权限 → Controller 执行业务。认证只建立“是谁”，授权才决定“能否访问”；JSON 转换和参数校验也不是授权。

JWT 签名验证可以不查询会话表，因此适合横向扩展的无状态 API；但“无状态”不等于“不可撤销”。如果注销、密钥轮换或高风险操作要求即时失效，可以把 `jti` 放入短 TTL 的撤销集合，或使用短时 access token 加 refresh token 轮换。撤销集合、刷新令牌和权限变更会重新引入状态，需明确失败重试、时钟偏差和一致性边界。

### 版本与依赖基线

本文按 JDK 20 的 Java 写法组织，Spring Boot 4.1.0 / Spring Security 7 的配置使用 `jakarta.*` 命名空间；旧项目仍应以实际依赖为准。JJWT 0.9.1、0.11.x 和 0.12.x 的解析器 API 不兼容，不能把三代调用混抄：0.11.x 常见 `Jwts.parserBuilder().setSigningKey(key).build().parseClaimsJws(token)`，0.12.x 改为 `Jwts.parser().verifyWith(key).build().parseSignedClaims(token)`。

JJWT 0.9.1 是旧版单体依赖，坐标为 `io.jsonwebtoken:jjwt:0.9.1`；0.11.x/0.12.x 通常拆成 `jjwt-api`、运行时 `jjwt-impl` 和 JSON 实现 `jjwt-jackson`。示例只从 `System.getenv("JWT_SECRET")` 或密钥管理系统读取 Base64URL 密钥；既然环境变量约定为 Base64URL，代码统一使用 `Base64.getUrlDecoder()`，不与标准 Base64 解码器混用。`<base64url-secret>` 只是占位符，仓库和日志中都不应出现生产密钥。JJWT 0.12.x 的解析器写法不能与 JJWT 0.11.x 混用。

```xml
<dependency>
    <groupId>io.jsonwebtoken</groupId>
    <artifactId>jjwt</artifactId>
    <version>0.9.1</version>
</dependency>
```

JJWT 0.9.1 的旧代码需要在迁移前单独锁定依赖和测试：

```java
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import java.util.Base64;

String encodedSecret = System.getenv("JWT_SECRET");
String compactToken = System.getenv("JWT_COMPACT_TOKEN");
byte[] signingKey = Base64.getUrlDecoder().decode(encodedSecret);
Claims claims = Jwts.parser().setSigningKey(signingKey)
    .parseClaimsJws(compactToken).getBody();
System.out.println(claims.getSubject());
// 输出：user-7
```

### JJWT 0.9.1→0.11/0.12 迁移矩阵

| 版本 | 依赖形态 | 验签解析入口 | 迁移边界 |
| --- | --- | --- | --- |
| 0.9.1 | `io.jsonwebtoken:jjwt` 单体依赖 | `Jwts.parser().setSigningKey(key).parseClaimsJws(token)` | 旧 `String`/`byte[]` 密钥写法；先补过期、算法和异常测试 |
| 0.11.x | `jjwt-api` + `jjwt-impl` + `jjwt-jackson` | `Jwts.parserBuilder().setSigningKey(key).build().parseClaimsJws(token)` | 拆分依赖，优先使用 `SecretKey`，按版本锁定实现包 |
| 0.12.x | `jjwt-api` + `jjwt-impl` + `jjwt-jackson` | `Jwts.parser().verifyWith(key).build().parseSignedClaims(token)` | 使用新版 parser、`verifyWith` 和 `Jws<Claims>`，不要与旧 builder API 混用 |

矩阵只描述迁移入口，不建议跨版本复制密钥类型、签名算法或异常处理；升级后至少回归合法 token、过期 token、错误签名、错误 audience 和撤销 `jti`。

## 常用用法

### SecurityFilterChain：建立认证授权过滤链

用途：用于把 CSRF、无状态会话和 URL 授权规则放在一个可审计的过滤链中；仅在明确的 Bearer API 边界关闭 CSRF，浏览器会话仍需按风险评估处理。

```java
import org.springframework.context.annotation.Bean;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;

@Bean
SecurityFilterChain apiSecurity(HttpSecurity http) throws Exception {
    http
        .csrf(csrf -> csrf.disable())
        .sessionManagement(session -> session.sessionCreationPolicy(
            SessionCreationPolicy.STATELESS))
        .authorizeHttpRequests(auth -> auth
            .requestMatchers("/health", "/login").permitAll()
            .anyRequest().authenticated());
    return http.build();
}

System.out.println("policy=" + SessionCreationPolicy.STATELESS);
// 输出：policy=STATELESS
```

过滤链只负责安全管道配置；登录凭据的业务校验、令牌签发和用户查询仍由认证服务负责。不要因为启用了 `STATELESS` 就把 refresh token 或撤销策略省略掉。

### authorizeHttpRequests：表达 URL 授权规则

用途：用于把公开端点、角色权限和默认拒绝边界写成 URL 规则；认证成功不代表每个 URL 都有访问资格。

```java
import org.springframework.security.config.annotation.web.builders.HttpSecurity;

void configure(HttpSecurity http) throws Exception {
    http.authorizeHttpRequests(auth -> auth
        .requestMatchers("/reports/**").hasAuthority("report:read")
        .requestMatchers("/admin/**").hasRole("ADMIN")
        .anyRequest().authenticated());
    System.out.println("/admin requires ROLE_ADMIN");
    // 输出：/admin requires ROLE_ADMIN
}
```

`hasRole("ADMIN")` 默认按 `ROLE_` 前缀匹配，而 `hasAuthority("report:read")` 使用完整权限名。规则顺序、通配符和默认分支应通过请求级测试固定，避免先写宽泛规则导致后续窄规则永远不可达。

### @PreAuthorize：在方法边界做授权

用途：用于把依赖方法参数或细粒度权限的授权放在服务方法入口；它需要 `@EnableMethodSecurity` 和 Spring 容器创建的 Bean 代理，不能代替 URL 层的粗粒度防护。

```java
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.AnnotationConfigApplicationContext;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.authentication.TestingAuthenticationToken;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.core.parameters.P;
import org.springframework.security.core.context.SecurityContextHolder;

@Configuration
@EnableMethodSecurity
class MethodSecurityConfig {
    @Bean ReportService reportService() {
        return new ReportService();
    }
}

class ReportService {
    @PreAuthorize("hasAuthority('report:read') and #ownerId == authentication.name")
    public String read(@P("ownerId") String ownerId) {
        return "report-for-" + ownerId;
    }
}

try (var context = new AnnotationConfigApplicationContext(MethodSecurityConfig.class)) {
    ReportService service = context.getBean(ReportService.class);
    SecurityContextHolder.getContext().setAuthentication(
        new TestingAuthenticationToken("user-7", "n/a", "report:read"));
    System.out.println("授权成功=" + service.read("user-7"));
    SecurityContextHolder.getContext().setAuthentication(
        new TestingAuthenticationToken("user-8", "n/a"));
    try {
        service.read("user-7");
    } catch (AccessDeniedException error) {
        System.out.println("denied=403");
    }
    SecurityContextHolder.clearContext();
}
// 输出：授权成功=report-for-user-7
// 输出：denied=403
```

`context.getBean(ReportService.class)` 取得的是由 Spring 创建的代理，调用它才会进入方法授权拦截器；直接 `new ReportService()` 会绕过代理。示例中的 `denied=403` 是方法授权拒绝的概念映射：这里捕获 `AccessDeniedException` 便于展示失败路径，真正 HTTP 请求的 403 响应由 `AccessDeniedHandler` 生成。`#ownerId` 通过 `@P("ownerId")` 显式绑定；如果不使用 `@P`，就要在编译时开启 `-parameters` 保留方法参数名。方法授权要与数据查询的租户边界一起设计；只在 Controller 上检查角色，不能保证内部异步调用或其他入口也经过同样的限制。表达式中不应拼接用户输入来生成规则。

### BCrypt：保存和验证密码哈希

用途：用于让密码只以带盐哈希形式持久化，并用 `matches` 验证登录输入；密码哈希不是可逆加密，也不应写入日志。

```java
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

var encoder = new BCryptPasswordEncoder();
String storedHash = encoder.encode("correct-horse");
System.out.println(encoder.matches("correct-horse", storedHash));
// 输出：true
```

每次 `encode` 产生的哈希通常不同，这是随机盐的效果；数据库字段要有足够长度并记录必要的升级策略。用户不存在和密码错误应尽量返回相同的外部错误，避免泄露账号是否存在。

### Bearer token：从请求头携带访问令牌

用途：用于让客户端在每次请求中提交访问令牌；服务端必须先验证签名、算法、受众、过期时间和撤销状态，再把主体放进安全上下文。

```java
String authorization = "Bearer <access-token>";
boolean bearer = authorization.regionMatches(true, 0, "Bearer ", 0, 7)
    && authorization.length() > 7;
System.out.println("bearer=" + bearer);
// 输出：bearer=true
```

这个片段只展示 header 形状，不代表已完成认证；不要把 `<access-token>` 当作已可信 claims。应使用框架的资源服务器过滤器或经过审查的 JWT 验证器，并限制 token 大小和算法集合。

### claims/过期：读取主体和时间声明

用途：用于把 JWT 的 `sub`、`iat`、`exp`、`jti` 解释为明确的身份和生命周期；时间判断要使用统一时钟并允许经过评估的时钟偏差。

```java
import java.time.Instant;
import java.util.Map;

Map<String, Object> claims = Map.of(
    "sub", "user-7", "iat", 1_735_689_600L,
    "exp", 4_102_444_800L, "jti", "token-7");
boolean active = Instant.now().getEpochSecond() < (Long) claims.get("exp");
System.out.println(claims.get("sub") + "/active=" + active);
// 输出：user-7/active=true
```

解析 claims 只是读取已验签的载荷；不要在验签前据此授权。`exp` 过期应进入认证失败路径，`jti` 可用于撤销集合和审计关联，`aud`/`iss` 等声明要按服务契约检查。

## 不常用但需要知道

### AuthenticationEntryPoint：把未认证映射为 401

用途：用于把缺少凭据、凭据无效或 JWT 已过期的请求统一映射为 HTTP 401；不要把未认证伪装成业务 403。

```java
import org.springframework.security.web.AuthenticationEntryPoint;

AuthenticationEntryPoint entryPoint = (request, response, exception) ->
    response.sendError(401, "unauthorized");
System.out.println("entry-point=401");
// 输出：entry-point=401
```

响应体应使用稳定错误码而不是堆栈或验签异常细节。浏览器重定向登录页和纯 API 的 JSON 401 是不同边界，不能只依赖默认行为。

### AccessDeniedHandler：把已认证但无权映射为 403

用途：用于把已通过认证但不满足角色或权限规则的请求统一映射为 HTTP 403；这能区分“需要登录”和“登录后仍无权”。

```java
import org.springframework.security.web.access.AccessDeniedHandler;

AccessDeniedHandler denied = (request, response, exception) ->
    response.sendError(403, "forbidden");
System.out.println("access-denied=403");
// 输出：access-denied=403
```

403 响应不要泄露资源是否存在、内部角色列表或数据库信息。对象级授权还需要检查资源所有者，不能只返回一个看似正确的状态码。

### 测试替身：为方法授权提供可控身份

用途：用于在安全测试中注入明确的主体和权限，验证 401/403/成功三条路径；它是测试替身，不是生产认证实现。

```java
import org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors;

var request = SecurityMockMvcRequestPostProcessors.jwt()
    .jwt(jwt -> jwt.subject("user-7").claim("scope", "report:read"));
System.out.println(request != null ? "scope=report:read" : "missing");
// 输出：scope=report:read
```

测试应覆盖过期 token、错误 audience、撤销后的 `jti`、无权限角色以及跨用户资源访问。只测 Controller 返回 200 不能证明过滤链和方法授权真实生效。

## 继续阅读

- [List 基础](/courses/java/05-泛型与集合/04-List常用API)：组织权限列表、字段错误和撤销集合时查 List 的可变性边界。
- [Map 基础](/courses/java/05-泛型与集合/07-Map常用API)：读取 claims、权限映射和错误响应时查 Map 的键值边界。
- [String 文本处理](/courses/java/02-数组与文本/02-String与文本处理)：规范化 Bearer header、角色名和错误码时查字符串 API。
- [JSON 与 Java 对象转换](/courses/java/02-数组与文本/05-JSON与Java对象转换)：比较 JSON 转换与 JWT claims 映射的职责边界。
- [Spring MVC 与 Servlet 边界](/courses/java/13-后端工程/04-Spring-MVC与Servlet边界)：理解 Filter、Interceptor 与响应错误边界。

## 简单案例

```java
import java.util.Set;

record AccessDecision(String subject, Set<String> authorities, boolean active) {}

class TokenBoundary {
    static AccessDecision authorize(String subject, Set<String> authorities,
                                    long expiresAt, long now) {
        boolean active = now < expiresAt;
        if (!active || !authorities.contains("report:read")) {
            return new AccessDecision(subject, authorities, false);
        }
        return new AccessDecision(subject, authorities, true);
    }
}

var decision = TokenBoundary.authorize("user-7", Set.of("report:read"), 200L, 100L);
System.out.println(decision.subject() + "/allowed=" + decision.active());
// 输出：user-7/allowed=true
```

框架片段需容器运行：生产链路由 Security 过滤器完成 Bearer 解析和验签，方法安全完成细粒度授权；案例只把过期与权限判断的边界显式化。转换、校验和授权应分别由消息转换器、Validation 和 Security 负责，业务服务再执行资源访问。

## 易混点

- 认证回答“是谁”，授权回答“能做什么”；有有效 JWT 不代表拥有所有资源权限。
- `401` 表示缺少或无效认证，`403` 表示已经识别身份但被拒绝；不要用一个默认异常处理器覆盖两者。
- `SessionCreationPolicy.STATELESS` 表示请求不依赖服务器会话，不表示 access token 永久有效或不可撤销。
- JWT claims 在验签并检查 `exp`、`iss`、`aud` 后才可用于授权；客户端提交的 header 本身不是可信身份。
- BCrypt 哈希不可解密；JJWT 0.11.x 与 0.12.x 的 parser API 要随依赖版本成组升级。
- 撤销集合是有状态补充：它能降低注销等待时间，但会带来 TTL、Redis 可用性和跨节点一致性问题。

## 课后小问

1. 为什么认证成功仍可能返回 403？
答案：认证只建立主体，授权规则还可能要求角色、权限或资源所有者条件。
解析：先由过滤器确认身份，再由 URL 或方法授权器判断能力；两个阶段的失败状态码和排查方式不同。

2. JJWT 0.11.x 的 `parserBuilder` 能否原样替换成 0.12.x 的 `parser`？
答案：不能直接替换，0.12.x 使用 `verifyWith(key)` 和 `parseSignedClaims` 等新 API，需按版本一起调整依赖与类型。
解析：解析器 API、返回类型和密钥接口存在版本差异；升级时要锁定依赖版本并用过期、错误签名和错误 audience 测试验证。

3. 无状态 JWT 如何支持注销后的即时失效？
答案：用短过期时间降低窗口，或把 `jti` 写入短 TTL 撤销集合，在验签后检查它。
解析：撤销集合本身是有状态边界，需要处理存储不可用、时间过期和重试；“无状态”只描述主认证不依赖服务器会话。

## 本节小结

- Security 过滤链负责把认证上下文带入请求，URL 和方法安全负责授权决策。
- BCrypt 只保存密码哈希；Bearer JWT 的 claims 必须在验签、过期和受众检查后才可信。
- 无状态策略、401/403 错误处理和撤销机制要分别设计，不能把一个概念当成另一个概念。
- JJWT 0.9.1、0.11.x 与 0.12.x 的 API 必须按实际依赖版本选择，生产密钥只能从安全配置来源读取。

## 快速回顾

- 能写出 `SecurityFilterChain` 的无状态 URL 规则并说明 CSRF 边界。
- 能区分 `@PreAuthorize`、`AuthenticationEntryPoint` 和 `AccessDeniedHandler` 的责任。
- 能解释 `sub`、`iat`、`exp`、`jti`，并知道 Bearer token 不是未经验证的可信输入。
- 能说清 BCrypt、JJWT 版本差异、401/403 和撤销集合之间的关系。
