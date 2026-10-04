---
title: Socket 与网络边界
date: 2026-09-27T00:00:00.000Z
category: Java基础快速入门
tags:
  - Java
  - Socket
  - TCP
  - UDP
description: 直接用 Java 案例理解 ServerSocket、Socket、UDP、半关闭、超时和 TCP 消息边界。
---

# Socket 与网络边界

## 学习目标

- 能用 `ServerSocket` 和 `Socket` 建立最小 TCP 客户端/服务端。
- 能区分 TCP 字节流、应用层消息、UDP 数据报和 HTTP 客户端。
- 能处理超时、半关闭、资源关闭、部分读写和本地/远程地址边界。

## 核心知识点

### 专业术语

- **ServerSocket**：监听 TCP 端口并接受连接的服务端入口。
- **Socket**：一条 TCP 连接，两端通过 InputStream/OutputStream 交换字节。
- **DatagramSocket/DatagramPacket**：UDP 数据报 API，发送和接收保留报文边界。
- **半包/粘包**：一次读取少于或多于一条应用消息，来自 TCP 没有消息边界。

### 白话解释与边界

Socket 只解决“连接和字节传输”，不会定义一条消息什么时候结束。应用协议需要长度前缀、换行分隔或固定长度，并循环读取到完整内容。HTTP 请求优先交给 `HttpClient`，长连接、自定义协议或学习 TCP 时才直接使用 Socket。所有 Socket、输入流和输出流都要关闭，超时要按连接、读取和业务分别考虑。

## 常用用法

### `ServerSocket`：监听端口

传入 0 让操作系统分配临时端口，适合测试；生产服务要明确绑定地址、端口占用、backlog 和防火墙边界。

```java
//说明： 说明：ServerSocket：监听端口。
import java.net.ServerSocket;

public class ServerSocketBindDemo {
    public static void main(String[] args) throws Exception {
        try (ServerSocket server = new ServerSocket(0)) {
            System.out.println(server.getLocalPort() > 0);
            // 输出：true
        }
    }
}
```

### 接收 TCP 连接：从监听套接字得到通信端点

`accept` 会阻塞直到有连接；真实服务通常为每个连接提交任务或使用 NIO，且要限制连接数、空闲时间和输入大小。

```java
// 说明：接收 TCP 连接：从监听套接字得到通信端点。
import java.net.ServerSocket;
import java.net.Socket;
import java.util.concurrent.Executors;

public class SocketAcceptDemo {
    public static void main(String[] args) throws Exception {
        try (ServerSocket server = new ServerSocket(0);
             var executor = Executors.newSingleThreadExecutor()) {
            executor.submit(() -> {
                try (Socket socket = server.accept()) {
                    System.out.println(socket.getInetAddress().isLoopbackAddress());
                    // 输出：true
                } catch (Exception e) {
                    throw new RuntimeException(e);
                }
            });
            try (Socket client = new Socket("127.0.0.1", server.getLocalPort())) {
                client.getOutputStream().close();
            }
        }
    }
}
```

### 交换 TCP 字节：取得双向流端点

示例用换行定义消息边界；真实二进制协议通常使用长度前缀，不能把 `readLine` 当作通用 TCP 解包器。

```java
// 说明：交换 TCP 字节：取得双向流端点。
import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.io.PrintWriter;
import java.net.ServerSocket;
import java.net.Socket;
import java.nio.charset.StandardCharsets;

public class SocketTextDemo {
    public static void main(String[] args) throws Exception {
        try (ServerSocket server = new ServerSocket(0)) {
            Thread service = new Thread(() -> {
                try (Socket socket = server.accept();
                     var reader = new BufferedReader(new InputStreamReader(socket.getInputStream(), StandardCharsets.UTF_8));
                     var writer = new PrintWriter(socket.getOutputStream(), true, StandardCharsets.UTF_8)) {
                    writer.println(reader.readLine().toUpperCase());
                } catch (Exception e) {
                    throw new RuntimeException(e);
                }
            }, "socket-text-service");
            service.start();
            try (Socket client = new Socket("127.0.0.1", server.getLocalPort());
                 var reader = new BufferedReader(new InputStreamReader(client.getInputStream(), StandardCharsets.UTF_8));
                 var writer = new PrintWriter(client.getOutputStream(), true, StandardCharsets.UTF_8)) {
                writer.println("java");
                System.out.println(reader.readLine());
                // 输出：JAVA
            }
            service.join();
        }
    }
}
```

### `setSoTimeout`：限制读取阻塞

`SoTimeout` 限制一次阻塞读取，不会自动关闭 Socket，也不等于连接超时；捕获后要决定重试、断开还是继续读取。

```java
// 说明：setSoTimeout：限制读取阻塞。
import java.net.ServerSocket;
import java.net.Socket;
import java.net.SocketTimeoutException;

public class SocketTimeoutDemo {
    public static void main(String[] args) throws Exception {
        try (ServerSocket server = new ServerSocket(0)) {
            new Thread(() -> {
                try (Socket ignored = server.accept()) { }
                catch (Exception ignored) { }
            }, "socket-timeout-service").start();
            try (Socket socket = new Socket("127.0.0.1", server.getLocalPort())) {
                socket.setSoTimeout(50);
                try {
                    socket.getInputStream().read();
                } catch (SocketTimeoutException e) {
                    System.out.println("timeout");
                    // 输出：timeout
                }
            }
        }
    }
}
```

### `InetSocketAddress`：明确主机与端口

地址对象可以用于绑定和连接；主机名解析可能阻塞或返回多个地址，生产代码要考虑 DNS 超时、IPv4/IPv6 和 SSRF 校验。

```java
// 说明：InetSocketAddress：明确主机与端口。
import java.net.InetSocketAddress;

public class SocketAddressDemo {
    public static void main(String[] args) {
        var address = new InetSocketAddress("127.0.0.1", 8080);
        System.out.println(address.getHostString() + ":" + address.getPort());
        // 输出：127.0.0.1:8080
    }
}
```

### 交换 UDP 数据报：发送并接收报文

UDP 一次 receive 对应一个数据报，但过大的数据可能被截断；应用仍需处理丢失、重复、乱序和伪造来源。

```java
// 说明：交换 UDP 数据报：发送并接收报文。
import java.net.DatagramPacket;
import java.net.DatagramSocket;
import java.net.InetAddress;
import java.nio.charset.StandardCharsets;

public class UdpLoopbackDemo {
    public static void main(String[] args) throws Exception {
        try (DatagramSocket receiver = new DatagramSocket(0);
             DatagramSocket sender = new DatagramSocket()) {
            byte[] bytes = "ping".getBytes(StandardCharsets.UTF_8);
            sender.send(new DatagramPacket(bytes, bytes.length,
                    InetAddress.getLoopbackAddress(), receiver.getLocalPort()));
            byte[] received = new byte[16];
            DatagramPacket packet = new DatagramPacket(received, received.length);
            receiver.receive(packet);
            System.out.println(new String(packet.getData(), packet.getOffset(), packet.getLength(), StandardCharsets.UTF_8));
            // 输出：ping
        }
    }
}
```

### `shutdownOutput`：TCP 半关闭

客户端关闭输出后，服务端读到 EOF，但连接的另一方向仍可能可用；只有协议定义了结束方向时才使用半关闭。

```java
// 说明：shutdownOutput：TCP 半关闭。
import java.net.ServerSocket;
import java.net.Socket;

public class SocketHalfCloseDemo {
    public static void main(String[] args) throws Exception {
        try (ServerSocket server = new ServerSocket(0)) {
            new Thread(() -> {
                try (Socket socket = server.accept()) {
                    System.out.println(socket.getInputStream().read() == -1);
                    // 输出：true
                } catch (Exception e) {
                    throw new RuntimeException(e);
                }
            }, "socket-half-close-service").start();
            try (Socket client = new Socket("127.0.0.1", server.getLocalPort())) {
                client.shutdownOutput();
            }
        }
    }
}
```
## 不常用但需要知道

### `setReuseAddress`：端口重用选项

选项要在 bind 前设置才更有机会生效；端口重用不是绕过端口冲突的万能开关，平台语义也可能不同。

```java
// 作用：通过 setReuseAddress 端口重用选项。
import java.net.ServerSocket;

public class SocketOptionDemo {
    public static void main(String[] args) throws Exception {
        try (ServerSocket server = new ServerSocket()) {
            server.setReuseAddress(true);
            server.bind(new java.net.InetSocketAddress("127.0.0.1", 0));
            System.out.println(server.getReuseAddress());
            // 输出：true
        }
    }
}
```

### `setTcpNoDelay`：禁用 Nagle 合并

低延迟小消息可能需要 `TCP_NODELAY`，但它会增加包数量和网络开销；必须用真实延迟和吞吐数据验证。

```java
// 作用：通过 setTcpNoDelay 禁用 Nagle 合并。
import java.net.Socket;

public class TcpNoDelayDemo {
    public static void main(String[] args) throws Exception {
        try (Socket socket = new Socket()) {
            socket.setTcpNoDelay(true);
            System.out.println(socket.getTcpNoDelay());
            // 输出：true
        }
    }
}
```

### `setKeepAlive`：内核级保活

Keep-alive 不能替代应用心跳、请求超时和连接池空闲淘汰；内核探测周期也通常不是业务可控的。

```java
// 作用：通过 setKeepAlive 内核级保活。
import java.net.Socket;

public class TcpKeepAliveDemo {
    public static void main(String[] args) throws Exception {
        try (Socket socket = new Socket()) {
            socket.setKeepAlive(true);
            System.out.println(socket.getKeepAlive());
            // 输出：true
        }
    }
}
```

### `ServerSocket` backlog：连接排队边界

backlog 是内核等待队列的建议值，不等于应用能同时处理的连接数；服务端仍需线程池、连接上限和过载策略。

```java
// 说明：0 让内核分配本地端口，32 是尚未 accept 连接的排队建议值，不会创建 32 个处理线程。
import java.net.ServerSocket;

public class BacklogDemo {
    public static void main(String[] args) throws Exception {
        try (ServerSocket server = new ServerSocket(0, 32)) {
            System.out.println(server.getLocalPort() > 0);
            // 输出：true
        }
    }
}
```

### `SocketChannel`：从阻塞 Socket 迁移到 NIO

非阻塞 Channel 必须配合 Selector 或连接状态机处理 `finishConnect`、部分读写和 `OP_*` 事件；不能只把 blocking 改成 false 就得到高性能服务。

```java
// 作用：通过 SocketChannel 从阻塞 Socket 迁移到 NIO。
import java.nio.channels.SocketChannel;

public class SocketChannelDemo {
    public static void main(String[] args) throws Exception {
        try (SocketChannel channel = SocketChannel.open()) {
            channel.configureBlocking(false);
            System.out.println(channel.isBlocking());
            // 输出：false
        }
    }
}
```

### 表达网络地址：区分结构化标识与旧式访问入口

`URI` 适合解析和构造地址，`URL` 搭配 `URLConnection` 是旧式访问入口；标准 HTTP 请求优先使用 `HttpClient`。

```java
import java.net.URI;
import java.net.URL;

public class UriUrlDemo {
    public static void main(String[] args) throws Exception {
        URI uri = URI.create("https://example.com");
        URL url = uri.toURL();
        System.out.println(uri.getHost() + " / " + url.getProtocol());
        // 输出：example.com / https
    }
}
```
## 简单案例

```java
import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.io.PrintWriter;
import java.net.ServerSocket;
import java.net.Socket;
import java.nio.charset.StandardCharsets;

public class SocketDemo {
    public static void main(String[] args) throws Exception {
        try (ServerSocket server = new ServerSocket(0)) {
            Thread service = new Thread(() -> {
                try (Socket socket = server.accept();
                     var in = new BufferedReader(new InputStreamReader(socket.getInputStream(), StandardCharsets.UTF_8));
                     var out = new PrintWriter(socket.getOutputStream(), true, StandardCharsets.UTF_8)) {
                    out.println("echo:" + in.readLine());
                } catch (Exception e) {
                    throw new RuntimeException(e);
                }
            }, "socket-echo-service");
            service.start();
            try (Socket client = new Socket("127.0.0.1", server.getLocalPort());
                 var in = new BufferedReader(new InputStreamReader(client.getInputStream(), StandardCharsets.UTF_8));
                 var out = new PrintWriter(client.getOutputStream(), true, StandardCharsets.UTF_8)) {
                out.println("java");
                System.out.println(in.readLine());
                // 输出：echo:java
            }
            service.join();
        }
    }
}
```

这里以换行作为应用消息边界并使用 loopback，避免示例依赖外部服务器；生产协议必须定义长度、编码、认证和超时。

## 易混点

- TCP 的 `read` 不保证返回一条消息，UDP 的 `receive` 才保留数据报边界。
- `setSoTimeout` 限制读取阻塞，`connect` 超时限制建立连接，两者不等价。
- `shutdownOutput` 只关闭一个方向，`close` 才是完整释放 Socket。
- `TCP_NODELAY`、KeepAlive、backlog 是低层选项，不是应用层重试、心跳和限流的替代品。

## 课后小问

1. 为什么 TCP 服务端要设计消息长度或分隔符？
答案：TCP 只提供有序字节流，不知道业务消息从哪里开始和结束。
解析：可以用换行、固定长度、长度前缀或更高层协议定义边界，并循环读取完整消息。

2. UDP 为什么不能简单替换 TCP 来“提升性能”？
答案：UDP 放弃了可靠、有序、拥塞控制等能力，应用必须自己承担丢包和重传。
解析：只有业务能容忍或自行处理这些风险时，才选择 UDP；实时性不是唯一指标。

## 本节小结

- ServerSocket 监听，Socket 连接，流读写；三者都要做资源和超时管理。
- TCP 是可靠字节流，应用层必须补上消息边界。
- UDP 保留数据报边界但不保证可靠送达。
- 低层 Socket 选项必须结合协议和测量使用，HTTP 场景优先 HttpClient。

## 快速回顾

- `accept` 阻塞等待连接，`setSoTimeout` 控制读取等待。
- TCP 文本示例可以用换行分隔，二进制协议通常用长度前缀。
- 半关闭允许单向结束，完全关闭要 `close`。
- 网络输入永远要限制大小、时间和并发连接数。
