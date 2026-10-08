---
title: Cancellation、Progress、Pagination 与错误
author: 阿源
date: 2026/10/08 00:00
categories: [Agent 开发]
tags: [MCP, Cancellation, Progress, Pagination, Errors]
status: 正文
chapter: 06
---

# Cancellation、Progress、Pagination 与错误

## 学习目标

- 实现取消、进度、分页和错误处理的正确协议边界。
- 区分 stdio 与 Streamable HTTP 的取消信号。
- 知道 progressToken 是 Client 选择的关联 token，不是强制进度回调。
- 处理 opaque cursor、resultType、标准 JSON-RPC 错误和 Tool 执行错误。

## 前置知识

需要阅读 [JSON-RPC 请求、响应、通知与 _meta](./03-JSON-RPC请求响应通知与_meta) 和 [stdio 与 Streamable HTTP](./10-stdio与Streamable-HTTP)。

## 核心知识点

### Cancellation：停止等待和停止工作

Client 可以取消仍在处理的请求：

- stdio：发送 notifications/cancelled，params.requestId 指向原 Request；
- Streamable HTTP：关闭该请求的响应流，Server 把断开视为取消；
- Server 收到取消后应尽快停止工作、释放资源，并且现代规范要求不要再为已取消请求发送结果；
- 取消存在竞态，通知可能晚于完成；Client 应忽略迟到的响应。

notifications/cancelled 不能被 Server 用来随意取消其它请求。Server 发送它的唯一现代用途是终止 subscriptions/listen（尤其 stdio 的共享通道）。

### Progress：可选的工作播报

Client 若希望收到进度，在请求 params._meta 放一个唯一的 progressToken，值为字符串或整数。Server 可以发 notifications/progress：

~~~json
{
  "jsonrpc": "2.0",
  "method": "notifications/progress",
  "params": {
    "progressToken": "job-42",
    "progress": 50,
    "total": 100,
    "message": "reading files"
  }
}
~~~

progress 必须随通知增加，total 和 message 可选。Server 可以不发进度；Progress 不替代最大超时，不能让 Client 无限等待。

### Pagination：不透明 cursor

支持分页的现代方法：

- resources/list；
- resources/templates/list；
- prompts/list；
- tools/list。

Client 首次请求不带 cursor，结果若有 nextCursor，就把这个值原样放进下一次请求。cursor 是不透明字符串，不能解析为页码；空字符串也是合法 cursor，不应当等同于“没有更多”。

Server 决定页面大小，Client 应以 nextCursor 是否存在判断结束。cursor 失效通常是 -32602 Invalid params；Client 可丢弃已有页面并从头获取。

### 错误分层

JSON-RPC 标准错误：

- -32700 Parse error；
- -32600 Invalid Request；
- -32601 Method not found；
- -32602 Invalid params；
- -32603 Internal error。

2026-07-28 规范保留的 MCP 错误：

- -32020 HeaderMismatch；
- -32021 MissingRequiredClientCapability；
- -32022 UnsupportedProtocolVersion。

资源不存在使用 -32602，旧版 -32002 仅为兼容接收保留。Tool 的业务执行失败通常是 result.isError=true，让模型能读取并调整；协议结构错误或未知方法则是 JSON-RPC error。

### 取消、进度、分页和错误的状态图

~~~mermaid
stateDiagram-v2
    [*] --> Sent: Client 发 Request + 可选 progressToken
    Sent --> Running: Server 接受
    Running --> Progress: notifications/progress
    Progress --> Running
    Running --> Page: list result + nextCursor
    Page --> Sent: Client 原样携带 cursor
    Running --> Complete: resultType=complete
    Running --> ToolError: result.isError=true
    Running --> ProtocolError: JSON-RPC error
    Sent --> Cancelled: HTTP 关流 / stdio cancelled
    Running --> Cancelled: Server 停止并不再回复
    Complete --> [*]
    ToolError --> [*]
    ProtocolError --> [*]
    Cancelled --> [*]
~~~

### 用标准库消费分页并打印进度

用途：代码展示“不解析 cursor、按 nextCursor 循环、进度不是完成信号”的最小 Client 逻辑。

~~~python
pages = {
    None: {"items": ["a", "b"], "nextCursor": "opaque-1"},
    "opaque-1": {"items": ["c"], "nextCursor": None},
}


def list_all():
    cursor = None
    items = []
    while True:
        page = pages[cursor]
        items.extend(page["items"])
        print(f"progress={len(items)}")
        next_cursor = page.get("nextCursor")
        if next_cursor is None:
            return items
        cursor = next_cursor


print("items:", list_all())
~~~

输出：

~~~text
progress=2
progress=3
items: ['a', 'b', 'c']
~~~

注意：真实 JSON-RPC 请求的每一页都要附带新的 _meta，且下一页 id 应与上一页不同。上述 pages 字典只是模拟 Server。

### 幂等和重试

超时或连接断开后，Client 不知道 Server 是否已产生副作用。读取和纯查询通常可以重试；创建订单、付款、删除等动作要依赖幂等键、显式业务句柄或用户确认。取消不是回滚，Server 可能已经完成操作，必须在业务语义中明确这一点。

## 术语与白话

### Cancellation

**术语**：请求仍在处理时，发送方表达不再需要结果。
**白话**：停止等餐并请厨房尽快停火，不保证已经做好的菜会自动撤销。

### ProgressToken

**术语**：Client 选出的进度关联标识。
**白话**：订单号，进度广播用它告诉你是哪一单。

### Cursor

**术语**：分页位置的不透明 token。
**白话**：书签；只负责下一页，不要拆开研究页码。

### Tool Execution Error

**术语**：工具已进入结果层但执行失败，通过 isError 表示。
**白话**：订单格式没问题，业务操作失败，模型有机会改参数或解释给用户。

## 易混点

### 取消不是错误响应

现代 Server 对已取消请求不应再发结果或 error；发送方停止等待。不要为了“完整日志”强行制造一个错误响应，让 Client 误以为服务端仍然处理了请求。

### Progress 不是心跳，也不是保证

Server 可以不发 progress；收到 progress 也不代表最终结果一定会到。即使不断进度，Client 仍应执行最大超时。

### nextCursor 不是数组下标

opaque cursor 的内部编码由 Server 决定，可能包含签名、快照或数据库游标。Client 修改它会导致 -32602 或更糟的跨租户数据错误。

### error 与 isError 不是同一回事

无效方法、坏参数和 HeaderMismatch 属于协议错误；可修正的业务失败应作为 Tool 结果。错误分类错误会让模型无法自愈，或把协议问题错误地暴露成普通文本。

### -32002 不是现代资源不存在码

2026-07-28 用 -32602；Client 可以兼容读取旧 Server 的 -32002，但新 Server 不应继续发旧码。

## 课后小问（含解析）

### 问题 1：收到一条 progress 后，Client 是否可以取消超时计时？

**解析**：可以把 progress 作为“工作仍在进行”的信号，但规范仍建议设置绝对最大超时。否则恶意或失常 Server 可以永远发送进度而不返回结果。

### 问题 2：HTTP Client 要不要发送 notifications/cancelled？

**解析**：现代 Streamable HTTP 的取消信号是关闭对应响应流，不要求也不期待发送该通知；stdio 没有每请求流，才必须发送 notifications/cancelled。

## 小结

Cancellation 表示停止等待并协作释放资源，Progress 是可选播报，Pagination 使用不透明 cursor，Error 要按协议错误与 Tool 执行错误分层。现代请求取消后通常没有错误响应；重试是否安全取决于业务幂等性而不是 MCP 自动保证。

## 快速回顾

- stdio 取消发送通知；HTTP 取消关闭响应流。
- progressToken 在每请求 _meta 中，由 Client 选择且必须在活动请求中唯一。
- list 方法用 nextCursor 分页，cursor 原样回传。
- -32020/-32021/-32022 是现代 MCP 保留错误。
- 资源不存在用 -32602；Tool 可修正失败用 isError=true。

## 官方依据

- [Cancellation](https://modelcontextprotocol.io/specification/2026-07-28/basic/patterns/cancellation)
- [Progress](https://modelcontextprotocol.io/specification/2026-07-28/basic/patterns/progress)
- [Pagination](https://modelcontextprotocol.io/specification/2026-07-28/server/utilities/pagination)
- [Base Protocol error codes](https://modelcontextprotocol.io/specification/2026-07-28/basic)
