---
title: JSON-RPC 请求、响应、通知与 _meta
author: 阿源
date: 2026/10/08 00:00
categories: [Agent 开发]
tags: [MCP, JSON-RPC, Meta]
status: 正文
chapter: 06
---

# JSON-RPC 请求、响应、通知与 _meta

## 学习目标

- 能区分 JSON-RPC Request、Response 和 Notification 的线格式与等待语义。
- 理解 request id、resultType、错误对象以及通知为何没有响应。
- 按 2026-07-28 正确构造每请求 _meta，知道哪些键是保留键。
- 能从 schema.ts 的类型心智模型反推一条消息的解析路径。

## 前置知识

需要理解 [Host、Client 与 Server](./02-Host-Client与Server) 的角色关系。代码只用 Python 标准库演示消息路由，不依赖 JSON-RPC 第三方库。

## 核心知识点

### 三类 JSON-RPC 消息

MCP 的消息都遵循 JSON-RPC 2.0，但在 2026-07-28 中有 MCP 自己的约束：

| 消息 | 关键字段 | 是否等待响应 | 典型方向 |
| --- | --- | --- | --- |
| Request | jsonrpc、id、method、params | 是 | Client → Server |
| Result Response | jsonrpc、id、result | 是 | Server → Client |
| Error Response | jsonrpc、id、error | 是 | Server → Client |
| Notification | jsonrpc、method、params | 否 | 双向，但现代 Server 不发独立 JSON-RPC Request |

Request id 必须是字符串或整数，不能是 null；同一发送方仍未收到响应时，不能复用活动 id。Response 必须复制对应 id，通知绝不能包含 id。

### resultType 与响应分支

现代成功结果必须含 resultType：

- complete：本次操作完成，结果可以交付；
- input_required：请求还不能完成，Server 给出 inputRequests 和可选 requestState，Client 处理后重试原请求；
- 扩展可以增加自己的值，例如 Tasks 扩展的 task，但扩展必须被显式声明。

旧协议没有 resultType 时，兼容 Client 把它当作 complete；这只为兼容早期 Server，不应让新 Server 省略现代字段。

### 每请求 _meta

2026-07-28 的每个 Request params 都必须携带 _meta。最低要求是：

- io.modelcontextprotocol/protocolVersion：本次请求使用的协议版本，例如 2026-07-28；
- io.modelcontextprotocol/clientCapabilities：本次请求可使用的 Client 能力，可以是空对象；
- io.modelcontextprotocol/clientInfo：Client 身份，规范是 SHOULD，未提供时仍可工作。

Response 的 result._meta 可以携带 io.modelcontextprotocol/serverInfo。它是 Server 自报的显示信息，不是授权凭据。通知可在 params._meta 放 subscriptionId，用来标识它属于哪条 subscriptions/listen 流。

自定义 _meta 键应使用带前缀的命名方式，推荐反向 DNS，例如 com.example/trace-id。io.modelcontextprotocol/ 和 dev.mcp/ 等前缀由规范保留；traceparent、tracestate、baggage 是为 W3C Trace Context 保留的例外键。

### JSON-RPC 数据流

~~~mermaid
sequenceDiagram
    participant C as Client
    participant S as Server
    C->>S: Request id=1 + params._meta
    S-->>C: Result id=1 + resultType=complete
    C->>S: Notification 无 id
    Note over S,C: 不发送响应
    C->>S: Request id=2 + params._meta
    S-->>C: Error id=2 code/message/data
    C->>S: Request id=3 + params._meta
    S-->>C: Result id=3 resultType=input_required
    C->>S: 重试原方法，新 id=4 + inputResponses + params._meta
    S-->>C: Result id=4 resultType=complete
~~~

这个顺序说明 MRTR 不是 Server 发送一条“反向 Request”后暂停；它是先返回一个普通结果，再由 Client 发起一条新的原请求。

### 用标准库路由请求、响应和通知

用途：代码只模拟一个固定的 tools/call 和 notifications/progress。它展示 id 回填、无响应通知和 resultType，而不假装已经实现完整 MCP Server。

~~~python
import json


def dispatch(message):
    if "id" not in message:
        return None

    params = message.get("params", {})
    meta = params.get("_meta", {})
    if meta.get("io.modelcontextprotocol/protocolVersion") != "2026-07-28":
        return {
            "jsonrpc": "2.0",
            "id": message["id"],
            "error": {"code": -32602, "message": "missing protocol metadata"},
        }

    if message.get("method") == "tools/call":
        arguments = params.get("arguments", {})
        return {
            "jsonrpc": "2.0",
            "id": message["id"],
            "result": {
                "resultType": "complete",
                "content": [
                    {
                        "type": "text",
                        "text": str(arguments["a"] + arguments["b"]),
                    }
                ],
                "_meta": {
                    "io.modelcontextprotocol/serverInfo": {
                        "name": "stdlib-demo",
                        "version": "0.1.0",
                    }
                },
            },
        }

    return {
        "jsonrpc": "2.0",
        "id": message["id"],
        "error": {"code": -32601, "message": "method not found"},
    }


request = {
    "jsonrpc": "2.0",
    "id": 7,
    "method": "tools/call",
    "params": {
        "name": "add",
        "arguments": {"a": 2, "b": 3},
        "_meta": {
            "io.modelcontextprotocol/protocolVersion": "2026-07-28",
            "io.modelcontextprotocol/clientCapabilities": {},
        },
    },
}
notification = {
    "jsonrpc": "2.0",
    "method": "notifications/progress",
    "params": {"progressToken": "job-7", "progress": 1},
}

print(json.dumps(dispatch(request), ensure_ascii=False))
print(dispatch(notification))
~~~

输出：

~~~text
{"jsonrpc": "2.0", "id": 7, "result": {"resultType": "complete", "content": [{"type": "text", "text": "5"}], "_meta": {"io.modelcontextprotocol/serverInfo": {"name": "stdlib-demo", "version": "0.1.0"}}}}
None
~~~

### schema.ts 的源码心智模型

官方 schema.ts 不是某个 SDK 的实现细节，而是协议数据类型的来源。阅读时可以按四层定位：

1. Common Types：MetaObject、RequestParams、Result、Cursor、ProgressToken；
2. JSON-RPC：JSONRPCRequest、JSONRPCNotification、JSONRPCResponse；
3. 方法类型：DiscoverRequest、ListToolsRequest、CallToolRequest 等；
4. 结果内容：Tool、Resource、Prompt、InputRequiredResult 和各类 ContentBlock。

Python SDK v2 会把线上的 camelCase 字段映射成 Python 的 snake_case 属性，例如 inputSchema 对应 tool.input_schema，isError 对应 result.is_error；这属于 SDK 对 wire shape 的映射，不是协议把 JSON 字段改成 snake_case。

## 术语与白话

### Request

**术语**：带 id、期待对应结果的调用消息。
**白话**：带取餐号的订单，厨房必须用同一个号回单。

### Notification

**术语**：没有 id、接收方不回响应的一路消息。
**白话**：广播“进度到 50%”，说完就走；不能等一张回执。

### resultType

**术语**：告诉 Client 如何解释 result 的判别字段。
**白话**：结果信封上贴的“这是最终件还是还要补资料”标签。

### _meta

**术语**：协议保留和应用扩展共享的元数据容器。
**白话**：不改变业务参数，但告诉对方“这次请求用哪个版本、我声明了什么能力”。

## 易混点

### 错误响应与 Tool 执行错误

未知方法、坏 JSON、缺少必需字段是 JSON-RPC error；业务执行失败可以作为 result 中 isError 为 true 的 Tool 结果交给模型修正。两者不要都塞进 error，也不要把未知 Tool 当成正常 Tool 结果。

### Notification 不等于“服务器主动调用”

通知可以由 Server 发送进度或订阅事件，但现代 2026-07-28 不允许 Server 独立发起 JSON-RPC Request。需要用户输入、采样或 roots 的场景使用 MRTR。

### _meta 不等于任意字典

保留键有规范语义；自定义键需要命名空间。Server 不能信任 clientInfo/serverInfo，也不能把 traceparent 当作认证凭证。每请求能力未声明时，Server 不得凭历史推断。

## 课后小问（含解析）

### 问题 1：通知需要一个“空响应”吗？

**解析**：不需要，甚至不能发送。通知没有 id，接收方必须不返回响应；若业务需要确认，应改成有 id 的 Request。

### 问题 2：为什么响应 id 不能写成“当前时间”而不回填请求 id？

**解析**：Client 依赖 id 将并发响应与原请求关联。回填错误会把结果交给错误的等待者，严重时可能把一个用户的结果交给另一条任务。

## 小结

MCP 的线格式是 JSON-RPC 2.0，但 2026-07-28 增加了现代结果判别和每请求元数据模型。掌握 id、通知无响应、resultType 和 _meta，才能继续理解 server/discover、MRTR、分页与订阅。

## 快速回顾

- Request 有 id；Notification 没有 id，也没有响应。
- Result 必须回同一 id；现代成功结果带 resultType。
- 每个请求都带协议版本和 Client capabilities 的 _meta。
- serverInfo 是自报显示信息，不是安全依据。
- schema.ts 是协议类型来源；SDK 只做语言映射和运行时校验。

## 官方依据

- [Base Protocol: Messages and _meta](https://modelcontextprotocol.io/specification/2026-07-28/basic)
- [2026-07-28 schema.ts](https://github.com/modelcontextprotocol/modelcontextprotocol/blob/main/schema/2026-07-28/schema.ts)
- [Multi Round-Trip Requests](https://modelcontextprotocol.io/specification/2026-07-28/basic/patterns/mrtr)
