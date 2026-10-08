---
title: stdio 与 Streamable HTTP
author: 阿源
date: 2026/10/08 00:00
categories: [Agent 开发]
tags: [MCP, Transport, stdio, HTTP]
status: 正文
chapter: 06
---

# stdio 与 Streamable HTTP

## 学习目标

- 说清 stdio 和 Streamable HTTP 如何承载相同的 MCP JSON-RPC 语义。
- 知道现代请求中协议版本与 Client 能力始终在 body 的 _meta，HTTP 头只是镜像。
- 为 stdio 子进程和 HTTP Endpoint 设置正确的日志、Origin、取消和关闭边界。
- 区分现代 Streamable HTTP 与旧 HTTP+SSE/Session 兼容路径。

## 前置知识

需要阅读 [无状态模型与版本协商](./04-无状态模型与版本协商) 和第 03 篇的消息类型。示例只用标准库模拟 framing；不要求本机安装 MCP SDK。

## 核心知识点

### Transport 只负责承载

Transport 定义消息如何分帧、如何传递元数据、如何取消和终止。它不改变 JSON-RPC 方法和 MCP 结果语义：同一个 tools/call 在 stdio 和 Streamable HTTP 的 body 结构相同。

2026-07-28 的现代核心还有一个重要边界：Client 发 Request/Notification，Server 发 Response/Notification；没有独立的 Server→Client JSON-RPC Request。需要 Elicitation、Sampling 或 Roots 时，使用 MRTR 的 InputRequiredResult。

### stdio：一行一个 JSON-RPC 消息

stdio 中 Client 启动 Server 子进程：

- Server 从 stdin 读取，每条消息占一行；
- Server 向 stdout 写 JSON-RPC 消息，不能写任何普通日志；
- stderr 可用于日志，Client 可捕获、转发或忽略；
- 消息是 UTF-8，不能包含嵌入换行；
- stdio 没有每请求响应流，取消用 notifications/cancelled；
- 关闭 stdin 后，Server 应尽快退出。

现代 stdio 请求仍没有协议 Session。进程只是承载多条自描述消息；如果进程重启，未完成请求丢失，Client 可按业务幂等性决定是否重试。

### Streamable HTTP：每个消息一个 POST

现代 Streamable HTTP 使用一个 MCP Endpoint：

- Client 为每个 Request 或 Notification 发一个 HTTP POST；
- Request 的响应可以是 application/json 单对象，也可以是该请求范围内的 text/event-stream；
- Accept 必须同时列 application/json 和 text/event-stream；
- 每个现代 POST 带 MCP-Protocol-Version 和 Mcp-Method；tools/call、resources/read、prompts/get 还带 Mcp-Name；
- Server 不再提供现代 GET stream，也不依赖 Mcp-Session-Id；
- 长生命周期通知通过 subscriptions/listen 的响应流；
- Client 关闭某个 SSE 响应流即表示取消该请求。

现代 HTTP 必须校验 Origin，避免 DNS rebinding；本机服务优先只绑定 127.0.0.1，并为远端部署配置认证。

### HTTP header 与 body 一致性

body 的 _meta.protocolVersion 是协议来源；MCP-Protocol-Version 是镜像。method/name 头也要和 body 一致。Server 发现缺少、格式错误或不一致时，应返回 400 和 HeaderMismatch（-32020）。负载均衡器可以先读头路由，但应用 Server 仍必须比较 body。

### 两种传输的数据流

~~~mermaid
flowchart LR
    Client["MCP Client"]
    Client -->|"一行 JSON-RPC"| STDIN["stdio stdin"]
    STDOUT["stdio stdout"] --> Client
    Client -->|"HTTP POST + headers"| HTTP["/mcp Endpoint"]
    HTTP -->|"JSON response 或 request-scoped SSE"| Client
    STDIN --> Server["同一 MCP Server 语义"]
    HTTP --> Server
    Server --> STDOUT
    Server --> HTTP
    Client -.->|"stdio: notifications/cancelled"| Server
    Client -.->|"HTTP: close response stream"| Server
    classDef core fill:transparent,stroke:currentColor,color:currentColor,stroke-width:1px;
    class Client,STDIN,STDOUT,HTTP,Server core;
~~~

### 标准库模拟 stdio framing

用途：代码验证“一行一个 JSON-RPC 消息、stderr 与 stdout 分离”的基础约束。它不是完整 MCP Server，也不模拟子进程生命周期。

~~~python
import json


messages = [
    {
        "jsonrpc": "2.0",
        "id": 1,
        "method": "server/discover",
        "params": {
            "_meta": {
                "io.modelcontextprotocol/protocolVersion": "2026-07-28",
                "io.modelcontextprotocol/clientCapabilities": {},
            }
        },
    },
    {
        "jsonrpc": "2.0",
        "method": "notifications/progress",
        "params": {"progressToken": "job-1", "progress": 1},
    },
]

wire = "\n".join(json.dumps(item, ensure_ascii=False) for item in messages) + "\n"
print("wire lines:", len(wire.splitlines()))
for line in wire.splitlines():
    decoded = json.loads(line)
    print(decoded.get("id", "notification"), decoded["method"])
~~~

输出：

~~~text
wire lines: 2
1 server/discover
notification notifications/progress
~~~

若把 print 日志写进真实 Server 的 stdout，Client 会把那一行当成 JSON-RPC 解析并失步。日志请写 stderr 或应用日志系统。

### HTTP 请求的最小形状

用途：下面只展示现代 Streamable HTTP 的头与 body 关系，使用示例地址而不发真实网络请求。

~~~http
POST /mcp HTTP/1.1
Content-Type: application/json
Accept: application/json, text/event-stream
MCP-Protocol-Version: 2026-07-28
Mcp-Method: tools/call
Mcp-Name: add

{
  "jsonrpc": "2.0",
  "id": 2,
  "method": "tools/call",
  "params": {
    "name": "add",
    "arguments": {"a": 2, "b": 3},
    "_meta": {
      "io.modelcontextprotocol/protocolVersion": "2026-07-28",
      "io.modelcontextprotocol/clientCapabilities": {}
    }
  }
}
~~~

## 术语与白话

### stdio

**术语**：客户端启动子进程，以换行分隔的 JSON-RPC 字符串通信。
**白话**：Host 开一个子进程电话线，一行一句话，stdout 只能说协议。

### Streamable HTTP

**术语**：每条消息 POST 到一个 MCP Endpoint，响应可为 JSON 或请求范围的 SSE。
**白话**：每次寄一张 HTTP 订单，回信可能一次寄回，也可能在同一回信通道持续播报。

### Request-scoped SSE

**术语**：只属于一个请求的 Server-Sent Events 响应流。
**白话**：这次订单的进度广播，不是整个服务器的公共广播。

### Origin validation

**术语**：Server 检查 HTTP Origin，防止 DNS rebinding 把浏览器请求导向本地服务。
**白话**：确认来访网页不是借地址变化冒充可信入口。

## 易混点

### Streamable HTTP 不是旧 HTTP+SSE

旧 HTTP+SSE 和 initialize Session 仍可能被双时代 SDK 兼容，但新系统应使用一个 POST Endpoint 的 Streamable HTTP。现代版本移除了 GET stream 和协议 Session。

### SSE 流不是 Server 反向请求通道

SSE 可以传 progress、message 或 subscriptions/listen 通知，但现代 Server 不得把 elicitation/create 作为独立 JSON-RPC Request 写入流；使用 MRTR。

### stdio stderr 不一定是错误

规范允许 Server 把信息、调试和错误都写 stderr。Client 不应把“stderr 有内容”直接当作进程失败；应结合退出码和协议响应判断。

### close HTTP 流与 notifications/cancelled 不同时使用

现代 HTTP 取消是关闭该请求的响应流；stdio 没有每请求流，才发送 notifications/cancelled。不要把 stdio 的通知机械复制到 HTTP。

## 课后小问（含解析）

### 问题 1：为什么现代 HTTP 不需要 sticky session？

**解析**：每个请求携带版本、Client 能力和业务参数；Server 不依赖连接之前的协议状态。只要应用状态通过显式句柄或共享存储传递，任意副本都可处理。

### 问题 2：为什么 MCP Server 的日志不能写 stdout？

**解析**：stdio 以换行拆分 JSON-RPC 消息。普通日志会污染协议流，使 Client 解析失败；应写 stderr 或外部日志。

## 小结

stdio 和 Streamable HTTP 是两个 transport binding，方法和结果语义相同。stdio 依靠一行一个 JSON-RPC 消息和进程生命周期，HTTP 依靠每消息 POST、请求范围 JSON/SSE、标准头、Origin 校验和流关闭取消。现代两者都没有协议 Session，也没有独立 Server→Client Request。

## 快速回顾

- stdio：stdin/stdout 只放 JSON-RPC，一行一条；日志写 stderr。
- HTTP：一个 Endpoint，每个消息一个 POST，Accept 同时支持 JSON 和 SSE。
- HTTP body 的 _meta 与标准头必须一致。
- 现代 HTTP 移除了 GET stream 和 Mcp-Session-Id。
- stdio 取消发通知；HTTP 取消关响应流。

## 官方依据

- [Transport Overview](https://modelcontextprotocol.io/specification/2026-07-28/basic/transports)
- [stdio](https://modelcontextprotocol.io/specification/2026-07-28/basic/transports/stdio)
- [Streamable HTTP](https://modelcontextprotocol.io/specification/2026-07-28/basic/transports/streamable-http)
- [MCP Python SDK v2 running servers](https://github.com/modelcontextprotocol/python-sdk/blob/main/docs/run/index.md)
