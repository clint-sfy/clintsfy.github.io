---
title: HTTP Client 常用 API
date: 2026-09-27T00:00:00.000Z
category: Java基础快速入门
tags:
  - Java
  - HttpClient
  - HTTP
  - 异步
description: 直接用 Java 案例速查 HttpClient 的请求、响应、超时、异步、重定向和请求体 API。
---

# HTTP Client 常用 API

## 学习目标

- 会构建 GET、POST 请求并读取状态码、响应头和响应体。
- 能区分连接超时、请求超时、异步异常和 HTTP 非 2xx。
- 能选择字符串、字节、文件、行流响应处理器，并正确取消异步请求。

## 核心知识点

### 专业术语

- **HttpClient**：JDK 11 引入的可复用 HTTP 客户端，支持 HTTP/1.1、HTTP/2 和异步调用。
- **HttpRequest**：不可变请求描述，包含 URI、方法、头、超时和请求体发布器。
- **HttpResponse**：一次响应的状态码、头、请求信息和类型化响应体。
- **BodyHandler/BodyPublisher**：决定响应如何落地、请求体如何产生的策略对象。

### 白话解释与边界

`HttpClient` 适合标准 HTTP 调用，但不等于业务 SDK：调用方仍需校验状态码、Content-Type、响应大小、JSON 字段和重试幂等性。客户端可以复用，Request 每次创建；连接超时和 Request timeout 应同时按业务设置。异步只是不阻塞调用线程，异常仍需在 `CompletableFuture` 链中处理。

## 常用用法

### `HttpClient.newBuilder`：设置连接超时

连接超时覆盖建立连接阶段，DNS、TLS、服务器处理和响应读取仍可能耗时；不要把它当成完整请求超时。

```java
// 说明：HttpClient.newBuilder：设置连接超时。
import java.net.http.HttpClient;
import java.time.Duration;

public class HttpClientTimeoutDemo {
    public static void main(String[] args) {
        HttpClient client = HttpClient.newBuilder()
                .connectTimeout(Duration.ofSeconds(3))
                .build();
        // 关键变化：HttpClient client = HttpClient.newBuilder() .connectTimeout(Duration.ofSeconds(3)) .build()；HttpClient.newBuilder(当前参数) 创建或取得具体资源，后续语句使用该对象。
// 输入：client 的初始值为 HttpClient.newBuilder()。
        System.out.println(client.connectTimeout().orElseThrow().toSeconds());
        // 输出：3
    }
}
```

### `HttpClient.Redirect`：配置重定向

`NORMAL` 遵循常见浏览器式重定向规则，`ALWAYS` 更激进，`NEVER` 交给业务处理；跨域重定向还要重新审视凭证和敏感请求头。

```java
// 说明：HttpClient.Redirect：配置重定向。
import java.net.http.HttpClient;

public class HttpRedirectDemo {
    public static void main(String[] args) {
        var client = HttpClient.newBuilder()
                .followRedirects(HttpClient.Redirect.NORMAL)
                .build();
                // 关键变化：.build();；当前对象.build(当前参数) 创建或取得具体资源，后续语句使用该对象。
                // 关键变化：.followRedirects(HttpClient.Redirect.NORMAL) .build();；当前对象；followRedirects；当前对象.followRedirects(HttpClient.Redirect.NORMAL) 返回本次调用的具体结果，后续语句继续使用该值。
                // 关键变化：.build();；当前对象.build(当前参数) 创建或取得具体资源，后续语句使用该对象。
// 初始状态：client 的初始值为 HttpClient.newBuilder()。
        System.out.println(client.followRedirects());
        // 输出：NORMAL
    }
}
```

### 构建 GET 请求：设置 URI 后完成请求

Request 是不可变对象，构建后可以安全地交给同步或异步发送；URI 要在边界校验 scheme、host、端口和允许的重定向范围。

```java
// 说明：构建 GET 请求：设置 URI 后完成请求。
import java.net.URI;
import java.net.http.HttpRequest;

public class HttpGetRequestDemo {
    public static void main(String[] args) {
        var request = HttpRequest.newBuilder(URI.create("https://example.com/items"))
                .header("Accept", "application/json")
                .GET()
                .build();
// 初始状态：request 的初始值为 HttpRequest.newBuilder(URI.create("https:。
                // 关键变化：.GET() .build();；当前对象.GET() 完成本例中的具体调用，后续语句观察调用后的状态。
        System.out.println(request.method() + " " + request.uri());
        // 输出：GET https://example.com/items
    }
}
```

### 构建文本 POST 请求：发布字符串请求体

请求体字符串默认使用 UTF-8；真实 JSON 仍需使用可信序列化器并设置正确 Content-Type。

```java
// 说明：构建文本 POST 请求：发布字符串请求体。
import java.net.URI;
import java.net.http.HttpRequest;

public class HttpPostRequestDemo {
    public static void main(String[] args) {
        var request = HttpRequest.newBuilder(URI.create("https://example.com/items"))
                .header("Content-Type", "application/json")
                .POST(HttpRequest.BodyPublishers.ofString("{\"name\":\"java\"}"))
                .build();
// 初始状态：request 的初始值为 HttpRequest.newBuilder(URI.create("https:。
                // 关键变化：.POST(HttpRequest.BodyPublishers.ofString("{\"name\":\"java\"}")) .build();；当前对象；POST；当前对象.POST(HttpRequest.BodyPublishers.ofString("{\"name\":\"java\"}")) 返回本次调用的具体结果，后续语句继续使用该值。
        System.out.println(request.method());
        // 输出：POST
    }
}
```

POST 等非幂等方法不能无条件自动重试。

### 同步发送请求：把响应体读取为字符串

`send` 会阻塞当前线程，适合简单同步流程；必须先检查状态码，再决定是否解析响应字符串，且要防止不受控大响应占满内存。

```java
// 说明：同步发送请求：把响应体读取为字符串。
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;

public class HttpSendDemo {
    public static void main(String[] args) throws Exception {
        var client = HttpClient.newHttpClient();
// 关键变化：client 接收表达式 HttpClient.newHttpClient() 的计算结果。
// 初始状态：client 的初始值为 HttpClient.newHttpClient()。
        var request = HttpRequest.newBuilder(URI.create("https://example.com"))
                .GET().build();
        HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());
        System.out.println(response.statusCode());
        // 输出：200
    }
}
```

### 检查 HTTP 响应：读取状态、响应头与正文

响应头名称不区分大小写，但一个名称可能有多个值；`body` 的类型由 BodyHandler 决定，状态码和业务 JSON 要分开验证。

```java
// 说明：检查 HTTP 响应：读取状态、响应头与正文。
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;

public class HttpResponseDemo {
    public static void main(String[] args) throws Exception {
        var request = HttpRequest.newBuilder(URI.create("https://example.com"))
                .GET().build();
// 初始状态：request 的初始值为 HttpRequest.newBuilder(URI.create("https:。
                // 关键变化：.GET().build();；当前对象.GET() 完成本例中的具体调用，后续语句观察调用后的状态。
        var response = HttpClient.newHttpClient().send(request, HttpResponse.BodyHandlers.ofString());
        // 关键变化：var response = HttpClient.newHttpClient().send(request, HttpResponse.BodyHandlers.ofString()); 将返回值写入 response；response 现在保存该具体结果。
        System.out.println(response.statusCode() + ", " + response.headers().firstValue("content-type").isPresent());
        // 输出：200, true
        System.out.println(response.body().isEmpty());
        // 输出：false
    }
}
```

### `HttpRequest.timeout`：请求级超时

请求超时是一次 Request 的等待边界，触发时通常以 `HttpTimeoutException` 表示；重试前仍要判断操作是否幂等。

```java
// 说明：HttpRequest.timeout：请求级超时。
import java.net.URI;
import java.net.http.HttpRequest;
import java.time.Duration;

public class HttpRequestTimeoutDemo {
    public static void main(String[] args) {
        var request = HttpRequest.newBuilder(URI.create("https://example.com"))
                .timeout(Duration.ofSeconds(5))
                .GET().build();
                // 关键变化：.timeout(Duration.ofSeconds(5)) .GET().build();；当前对象；timeout；当前对象.timeout(Duration.ofSeconds(5)) 返回本次调用的具体结果，后续语句继续使用该值。
                // 初始状态：request 当前保存 HttpRequest.newBuilder(URI.create("https://example.com")) .timeout(Duration.ofSeconds(5)) .GET().build()的计算结果。
        System.out.println(request.timeout().orElseThrow().toSeconds());
        // 输出：5
    }
}
```

### `sendAsync`：异步请求与结果链

`sendAsync` 返回 `CompletableFuture`，`join` 会重新抛出包装后的异常；生产代码要在链上使用 `exceptionally`/`handle`，不要无条件阻塞等待所有 Future。

```java
// 说明：sendAsync：异步请求与结果链。
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;

public class HttpAsyncDemo {
    public static void main(String[] args) throws Exception {
        var request = HttpRequest.newBuilder(URI.create("https://example.com"))
                .GET().build();
                // 初始状态：request 当前保存 HttpRequest.newBuilder(URI.create("https://example.com")) .GET().build()的计算结果。
        var future = HttpClient.newHttpClient().sendAsync(
                request, HttpResponse.BodyHandlers.ofString());
        // 关键变化：var future = HttpClient.newHttpClient().sendAsync( request, HttpResponse.BodyHandlers.ofString())；future 接收 newHttpClient(当前参数) 的返回值，当前值变为这次调用得到的具体结果。
        int status = future.thenApply(HttpResponse::statusCode).join();
        System.out.println(status);
        // 输出：200
    }
}
```

### `BodyHandlers.ofByteArray`：处理二进制响应

二进制响应不要强行转 String；图片、压缩数据和协议字节应使用 byte[] 或文件 BodyHandler，并设置大小保护。

```java
// 说明：BodyHandlers.ofByteArray：处理二进制响应。
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;

public class HttpBytesResponseDemo {
    public static void main(String[] args) throws Exception {
        var request = HttpRequest.newBuilder(URI.create("https://example.com"))
                .GET().build();
                // 初始状态：request 当前保存 HttpRequest.newBuilder(URI.create("https://example.com")) .GET().build()的计算结果。
        var response = HttpClient.newHttpClient().send(request, HttpResponse.BodyHandlers.ofByteArray());
        // 关键变化：var response = HttpClient.newHttpClient().send(request, HttpResponse.BodyHandlers.ofByteArray()); 的返回值写入 response，调用后 response 保存该具体结果。
        System.out.println(response.body().length > 0);
        // 输出：true
    }
}
```

### `BodyHandlers.ofFile`：直接写入文件

`ofFile` 适合下载大响应，目标文件的覆盖、权限、磁盘空间和失败清理仍由调用方负责。

```java
// 说明：BodyHandlers.ofFile：直接写入文件。
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.nio.file.Files;
import java.nio.file.Path;

public class HttpFileResponseDemo {
    public static void main(String[] args) throws Exception {
        Path target = Files.createTempFile("http-body-", ".bin");
        // 初始状态：target 当前为 Files.createTempFile("http-body-", ".bin")。
        var request = HttpRequest.newBuilder(URI.create("https://example.com"))
                .GET().build();
        var response = HttpClient.newHttpClient().send(request, HttpResponse.BodyHandlers.ofFile(target));
        // 关键变化：var response = HttpClient.newHttpClient().send(request, HttpResponse.BodyHandlers.ofFile(target)); 的返回值写入 response，调用后 response 保存该具体结果。
        System.out.println(response.statusCode() + ", " + (Files.size(target) > 0));
        // 输出：200, true
        Files.deleteIfExists(target);
    }
}
```

### `BodyHandlers.ofLines`：按行处理响应

响应行 Stream 也要关闭；它适合边读边处理，但不应在没有协议限制时无限累积到集合。

```java
// 说明：BodyHandlers.ofLines：按行处理响应。
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;

public class HttpLinesResponseDemo {
    public static void main(String[] args) throws Exception {
        var request = HttpRequest.newBuilder(URI.create("https://example.com"))
                .GET().build();
                // 初始状态：request 当前保存 HttpRequest.newBuilder(URI.create("https://example.com")) .GET().build()的计算结果。
        var response = HttpClient.newHttpClient().send(request, HttpResponse.BodyHandlers.ofLines());
        // 关键变化：var response = HttpClient.newHttpClient().send(request, HttpResponse.BodyHandlers.ofLines()); 的返回值写入 response，调用后 response 保存该具体结果。
        try (var lines = response.body()) {
            System.out.println(lines.findFirst().isPresent());
            // 输出：true
        }
    }
}
```

### 处理 HTTP 标头：写入请求并读取响应

认证、Cookie、Trace ID 等头必须有明确的信任边界；不要把密码、Token 或内部地址写进日志。

```java
// 说明：处理 HTTP 标头：写入请求并读取响应。
import java.net.URI;
import java.net.http.HttpRequest;

public class HttpHeadersDemo {
    public static void main(String[] args) {
        var request = HttpRequest.newBuilder(URI.create("https://example.com"))
                .header("Accept", "application/json")
                .header("X-Request-Id", "demo-1")
                .GET().build();
// 初始状态：request 的初始值为 HttpRequest.newBuilder(URI.create("https:。
                // 关键变化：.GET().build();；当前对象.GET() 完成本例中的具体调用，后续语句观察调用后的状态。
        System.out.println(request.headers().firstValue("accept").orElse("missing"));
        // 输出：application/json
    }
}
```
## 不常用但需要知道

### `HttpClient.Version`：偏好 HTTP/2 或 HTTP/1.1

这是偏好而不是对端强制结果；HTTP/2 需要服务端、TLS 和代理链路共同支持。

```java
import java.net.http.HttpClient;

public class HttpVersionDemo {
    public static void main(String[] args) {
        var client = HttpClient.newBuilder().version(HttpClient.Version.HTTP_1_1).build();
        // 关键变化：var client = HttpClient.newBuilder().version(HttpClient.Version.HTTP_1_1).build()；HttpClient.newBuilder(当前参数) 创建或取得具体资源，后续语句使用该对象。
// 初始状态：client 的初始值为 HttpClient.newBuilder().version(HttpClient.Version.HTTP_1_1).build()。
        System.out.println(client.version());
        // 输出：HTTP_1_1
    }
}
```

### `CompletableFuture.cancel`：取消异步请求

取消是协作式的，可能已经建立连接或收到部分响应；业务代码还要停止后续解析、重试和界面更新。

```java
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;

public class HttpCancelDemo {
    public static void main(String[] args) {
        var request = HttpRequest.newBuilder(URI.create("https://example.com"))
                .GET().build();
                // 关键变化：.GET().build();；当前对象.GET() 完成本例中的具体调用，后续语句观察调用后的状态。
                // 关键变化：.GET().build();；当前对象.GET() 完成本例中的具体调用，后续语句观察调用后的状态。
                // 初始状态：request 当前保存 HttpRequest.newBuilder(URI.create("https://example.com")) .GET().build()的计算结果。
        var future = HttpClient.newHttpClient().sendAsync(request,
                java.net.http.HttpResponse.BodyHandlers.ofString());
        // 关键变化：var future = HttpClient.newHttpClient().sendAsync(request, java.net.http.HttpResponse.BodyHandlers.ofString())；future 接收 newHttpClient(当前参数) 的返回值，当前值变为这次调用得到的具体结果。
                // 关键变化：java.net.http.HttpResponse.BodyHandlers.ofString())；BodyHandlers.ofString() 完成本例中的具体调用，后续语句观察调用后的状态。
        System.out.println(future.cancel(true));
// 输出：true
    }
}
```

### `BodyPublishers.ofFile`：从文件上传请求体

上传要设置大小上限、内容类型和重试策略；文件变更、权限和删除时机都属于调用方责任。

```java
import java.net.URI;
import java.net.http.HttpRequest;
import java.nio.file.Files;

public class HttpFileUploadDemo {
    public static void main(String[] args) throws Exception {
        var file = Files.createTempFile("http-upload-", ".txt");
        // 初始状态：file 当前为 Files.createTempFile("http-upload-", ".txt")。
        Files.writeString(file, "payload");
        var request = HttpRequest.newBuilder(URI.create("https://example.com/upload"))
                .header("Content-Type", "text/plain")
                .POST(HttpRequest.BodyPublishers.ofFile(file))
                .build();
                // 关键变化：.POST(HttpRequest.BodyPublishers.ofFile(file)) .build();；当前对象；POST；当前对象.POST(HttpRequest.BodyPublishers.ofFile(file)) 返回本次调用的具体结果，后续语句继续使用该值。
        System.out.println(request.method() + ", " + Files.size(file));
        // 输出：POST, 7
        Files.deleteIfExists(file);
    }
}
```

### `Authenticator`：代理或服务端认证回调

不要在源码中硬编码凭证；认证回调可能被多次触发，需结合 host、port、protocol 和凭证存储做限制。

```java
import java.net.Authenticator;
import java.net.PasswordAuthentication;

public class HttpAuthenticatorDemo {
    public static void main(String[] args) {
        Authenticator authenticator = new Authenticator() {
// 输入：authenticator 的初始值为 new Authenticator()。
        // 作用：通过 Authenticator 代理或服务端认证回调。
            @Override
            protected PasswordAuthentication getPasswordAuthentication() {
                return new PasswordAuthentication("user", "secret".toCharArray());
            }
        };
        System.out.println(authenticator != null);
        // 输出：true
    }
}
```

### 自定义 `BodyHandler`：限制响应大小

示例展示响应大小保护的入口；生产代码还要考虑流式限制，避免先把超大响应完整收进内存再判断。

```java
import java.net.http.HttpResponse;

public class HttpBodyHandlerBoundaryDemo {
    public static void main(String[] args) {
        HttpResponse.BodyHandler<byte[]> handler = info ->
                HttpResponse.BodySubscribers.mapping(
                        HttpResponse.BodySubscribers.ofByteArray(), bytes -> {
                        // 关键变化：HttpResponse.BodySubscribers.ofByteArray(), bytes -> {；BodySubscribers.ofByteArray() 完成本例中的具体调用，后续语句观察调用后的状态。
                        // 关键变化：HttpResponse.BodySubscribers.ofByteArray(), bytes -> {；BodySubscribers.ofByteArray() 完成本例中的具体调用，后续语句观察调用后的状态。
// 初始状态：handler 的初始值为 info ->。
                            if (bytes.length > 1024) throw new IllegalStateException("too large");
                            // 关键变化：if (bytes.length > 1024) throw new IllegalStateException("too large");；当前对象；if；当前对象.if(bytes.length > 1024) 返回本次调用的具体结果，后续语句继续使用该值。
                            return bytes;
                        });
        System.out.println(handler != null);
        // 输出：true
    }
}
```
## 简单案例

### `URLEncoder.encode`：编码查询参数值

它执行 `application/x-www-form-urlencoded` 编码，只编码参数值，不能直接编码整条 URL。

```java
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
String keyword = URLEncoder.encode("Java 入门", StandardCharsets.UTF_8);
// 输入：keyword 的初始值为 URLEncoder.encode("Java 入门", StandardCharsets.UTF_8)。
// 作用：通过 URLEncoder.encode 编码查询参数值。
String url = "https://example.test/search?q=" + keyword;
System.out.println(keyword);
// 输出：Java+%E5%85%A5%E9%97%A8
System.out.println(url);
// 输出：System.out 调用参数为 url。
```

### `URL(String)`：解析绝对资源地址

`URL` 构造器把协议、主机、端口和路径解析为结构化地址，但不会在构造时连接服务器。固定地址可以直接构造；新代码通常优先用 `URI` 表达和校验地址，再在需要旧 API 时转为 `URL`。

```java
import java.net.URL;

URL endpoint = new URL("https://example.test:8443/api/users");
// 初始状态：endpoint 的初始值为 new URL("https:。
// 作用：通过 URL(String) 解析绝对资源地址。
// endpoint 只保存地址组件，这一行没有发生 DNS 查询或网络 I/O。
System.out.println(endpoint.getHost() + ":" + endpoint.getPort());
// 输出：example.test:8443
```

### `URL.openConnection`：创建底层 URLConnection

它只创建连接对象；真实网络访问还需读写，并应显式设置连接与读取超时。

```java
import java.net.URL;
URL endpoint = new URL("https://example.test/api");
// 关键变化：URL endpoint = new URL("https://example.test/api")；endpoint 接收 该操作("https://example.test/api") 的返回值，当前值变为这次调用得到的具体结果。
// 初始状态：endpoint 当前为 new URL("https://example.test/api")。
var connection = endpoint.openConnection();
// 作用：通过 URL.openConnection 创建底层 URLConnection。
// connection 还未读写网络；先在它上设置连接与读取超时。
connection.setConnectTimeout(3_000);
connection.setReadTimeout(5_000);
System.out.println(connection.getConnectTimeout());
// 输出：3000、5000；示例未发起网络读取
System.out.println(connection.getReadTimeout());
// 输出：System.out 调用参数为 connection.getReadTimeout()。
```

```java
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.Duration;

public class HttpClientDemo {
    public static void main(String[] args) throws Exception {
        var client = HttpClient.newBuilder()
                .connectTimeout(Duration.ofSeconds(3))
                .followRedirects(HttpClient.Redirect.NORMAL)
                .build();
// 初始状态：client 的初始值为 HttpClient.newBuilder()。
        var request = HttpRequest.newBuilder(URI.create("https://example.com"))
                .timeout(Duration.ofSeconds(5))
                .header("Accept", "text/html")
                .GET().build();
        var response = client.send(request, HttpResponse.BodyHandlers.ofString());
        if (response.statusCode() / 100 == 2) {
            System.out.println(response.body().contains("Example Domain"));
            // 输出：true
        } else {
            System.out.println("HTTP " + response.statusCode());
            // 输出：HTTP 4xx 或 HTTP 5xx
        }
    }
}
```

该案例需要网络可达；真实客户端还需按 API 契约处理错误 JSON、Content-Type、响应大小、日志脱敏和幂等重试。

## 易混点

- `connectTimeout` 只管连接，Request timeout 才是一次调用的等待边界；两者都不能替代业务超时。
- HTTP 非 2xx 不会自动抛成业务异常，必须显式检查 statusCode。
- `ofString`、`ofByteArray`、`ofFile` 和 `ofLines` 决定内存、编码和资源行为，不能随意互换。
- 异步 Future 的异常通常在 `join/get` 或完成阶段暴露，取消也不等于对端一定停止工作。

## 课后小问

1. 为什么收到 500 时 `HttpClient.send` 通常不会直接抛 IOException？
答案：500 是 HTTP 协议层的合法响应，网络传输本身可能成功。
解析：调用方要单独检查 statusCode，并把协议错误映射为业务异常或重试决策。

2. 下载大文件为什么优先 `BodyHandlers.ofFile` 而不是 `ofByteArray`？
答案：ofFile 可以边接收边写文件，避免把完整响应一次性放进堆内存。
解析：仍要处理临时文件、磁盘空间、部分下载和校验，不能把文件落盘视为自动可靠。

## 本节小结

- HttpClient 复用连接，HttpRequest 描述调用，HttpResponse 描述结果。
- 连接超时、请求超时、状态码和业务错误要分别处理。
- BodyHandler 决定响应的内存和资源策略，BodyPublisher 决定请求体来源。
- 异步、重定向、认证和重试都必须服从安全、大小和幂等边界。

## 快速回顾

- GET/POST 由 Request builder 表达，BodyPublisher 提供请求体。
- `send` 阻塞，`sendAsync` 返回 CompletableFuture。
- 先看 statusCode 和 headers，再解析 body。
- 大响应优先文件或流式处理，敏感头和认证信息不能泄露。
