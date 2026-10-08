---
title: Elicitation 与 Multi-Round-Trip Requests
author: 阿源
date: 2026/10/08 00:00
categories: [Agent 开发]
tags: [MCP, Elicitation, MRTR]
status: 正文
chapter: 06
---

# Elicitation 与 Multi-Round-Trip Requests

## 学习目标

- 理解 Elicitation 的 form/url 两种模式和用户同意边界。
- 画出 2026-07-28 Multi-Round-Trip Requests（MRTR）的往返数据流。
- 正确处理 inputRequests、inputResponses、requestState 和新的 JSON-RPC id。
- 知道 Roots、Sampling 已 deprecated，Tasks 是可选扩展，不把它们写成核心能力。

## 前置知识

需要理解 [无状态模型与版本协商](./04-无状态模型与版本协商) 和 [JSON-RPC 请求、响应、通知与 _meta](./03-JSON-RPC请求响应通知与_meta)。

## 核心知识点

### Elicitation 是谁来问、谁来答

Elicitation 允许 Server 在处理 Client 发起的请求时，请求用户补充信息。用户界面由 Client/Host 控制；Server 只提出结构化请求，不应该直接弹出一个脱离用户任务的对话框。

两种模式：

- **form**：通过 Client 收集非敏感的结构化数据，requestedSchema 只能是顶层 object 和 primitive 属性；
- **url**：把用户引导到外部 HTTPS 页面，适合 API key、密码、支付或第三方 OAuth 等敏感交互。除 URL 外，敏感内容不会流过 MCP Client。

Form 模式禁止请求密码、访问令牌、API key 和支付凭据。Client 必须显示哪个 Server 在请求、允许用户修改或拒绝；URL 模式还要显示目标 host 并在跳转前征得同意。

### 为什么需要 MRTR

旧版允许 Server 在一个长连接上独立发送 elicitation/create、sampling/createMessage 或 roots/list Request。2026-07-28 的无状态核心移除了 Server→Client 独立 JSON-RPC Request 通道，改用 MRTR：

1. Client 发起 tools/call、prompts/get 或 resources/read；
2. Server 返回 resultType=input_required；
3. 结果携带 inputRequests 和可选 requestState；
4. Client 通过 UI、回调或其它来源获得 InputResponses；每个答案的 key 必须对应 inputRequests 的 key，Elicitation 答案还要带 action；
5. Client 重试原方法，在 params 中把 inputResponses 和 requestState 作为同级字段传回，并使用新的 JSON-RPC id；
6. Server 完成并返回 resultType=complete，或继续要求输入。

只有上述三种 Client Request 可以返回 InputRequiredResult。它不是所有 RPC 都能随意使用的通用包装。

### requestState 是不透明且不可信的

Client 必须按字节原样回显 requestState，不能解析、修改或跨请求复用。Server 收到它时必须当作攻击者控制输入。如果它影响授权、资源访问或业务逻辑，Server 应使用 HMAC/AEAD 保护，并在状态中绑定：

- 认证主体；
- 短过期时间；
- 原始 method 和关键参数摘要；
- 若要求一次性消费，还要在服务端落实 single-use。

MRTR 可以让不同副本处理重试，但不等于 Server 可以把未经保护的 JSON 当成可信 Session。

### MRTR 数据流

~~~mermaid
sequenceDiagram
    participant C as Client/Host
    participant S as Server
    C->>S: tools/call id=10 + arguments + _meta
    S-->>C: resultType=input_required<br/>inputRequests + opaque requestState
    C->>User: 展示 form 或 URL，并等待同意
    User-->>C: accept / decline / cancel 或表单内容
    C->>S: tools/call id=11 + inputResponses(action=accept) + 原样 requestState
    S-->>C: resultType=complete 或再次 input_required
    Note over C,S: Server 不发送独立 elicitation/create Request
~~~

Client 应为重试使用新 id，因为初始请求和重试是两条独立的 JSON-RPC Request。inputResponses 和 requestState 只属于这次原始调用，不能被另一个并行请求借用。

### 一个最小的纯 Python MRTR 模拟

用途：代码使用 HMAC 保护 requestState，模拟一个需要用户确认的删除操作。它不实现 MCP 传输，只验证“先返回 input_required，再带答案重试”的状态机。

~~~python
import base64
import hashlib
import hmac
import json


SECRET = b"course-demo-secret"


def seal(principal: str, item: str) -> str:
    payload = json.dumps(
        {"principal": principal, "item": item},
        separators=(",", ":"),
        sort_keys=True,
    ).encode()
    tag = hmac.new(SECRET, payload, hashlib.sha256).digest()
    return base64.urlsafe_b64encode(payload + b"." + tag).decode()


def verify(state: str, principal: str, item: str) -> bool:
    try:
        raw = base64.urlsafe_b64decode(state.encode())
        payload, tag = raw.rsplit(b".", 1)
        expected = hmac.new(SECRET, payload, hashlib.sha256).digest()
        data = json.loads(payload)
    except (ValueError, KeyError, json.JSONDecodeError):
        return False
    return (
        hmac.compare_digest(tag, expected)
        and data.get("principal") == principal
        and data.get("item") == item
    )


def handle_call(
    principal: str,
    item: str,
    input_responses=None,
    request_state=None,
):
    if input_responses is None:
        return {
            "resultType": "input_required",
            "inputRequests": {
                "confirm": {
                    "method": "elicitation/create",
                    "params": {
                        "mode": "form",
                        "message": f"Delete {item}?",
                        "requestedSchema": {
                            "type": "object",
                            "properties": {"approved": {"type": "boolean"}},
                            "required": ["approved"],
                        },
                    },
                }
            },
            "requestState": seal(principal, item),
        }

    if request_state is None or not verify(request_state, principal, item):
        raise ValueError("invalid requestState")

    answer = input_responses.get("confirm", {})
    if answer.get("action") != "accept":
        return {
            "resultType": "complete",
            "content": [
                {
                    "type": "text",
                    "text": f"deleted=False ({answer.get('action', 'missing')})",
                }
            ],
        }

    content = answer.get("content")
    if not isinstance(content, dict):
        raise ValueError("accept requires content")
    accepted = content.get("approved")
    return {
        "resultType": "complete",
        "content": [{"type": "text", "text": f"deleted={bool(accepted)}"}],
    }


first = handle_call("alice", "draft.txt")
print(first["resultType"], sorted(first["inputRequests"]))
second_input = {
    "confirm": {"action": "accept", "content": {"approved": True}},
}
retry_params = {
    "inputResponses": second_input,
    "requestState": first["requestState"],
}
print(
    handle_call(
        "alice",
        "draft.txt",
        input_responses=retry_params["inputResponses"],
        request_state=retry_params["requestState"],
    )["content"][0]["text"]
)
~~~

输出：

~~~text
input_required ['confirm']
deleted=True
~~~

真实 MCP 的 inputResponses 与 requestState 在原始请求 params 中是同级字段；每个 inputResponses key 对应一个 inputRequests key，Elicitation 的 accept 才读取 content，decline/cancel 通常不带 content。上面的代码仅保留核心安全检查，不应当把 HMAC 密钥硬编码在生产代码中。

### Python SDK v2 的现代/legacy 分流

官方 Python SDK v2.2.0 推荐使用 resolver 函数与 `Resolve` 标记，让同一个工具在旧时代和现代时代都能获取用户输入。现代 MRTR 只有两条路径：`Annotated[..., Resolve(resolver_fn)]` 中的 resolver 函数返回 `Elicit(...)`，或底层代码手写 `InputRequiredResult`。在现代 2026-07-28 连接上，工具内直接调用 `ctx.elicit()` 会抛 `NoBackChannelError`，SDK 不会把它自动转换成 MRTR；`ctx.elicit()` 应只放在保留 server→client 通道的 legacy（2025-11-25 及更早）连接语境中。示例应锁定 Python 3.10+ 和 mcp==2.2.0，并以 Migration Guide 为准。

## 术语与白话

### Elicitation

**术语**：Server 请求用户补充非敏感信息或打开外部 URL 的机制。
**白话**：后厨在处理订单时问前台“需要哪种规格”，但前台仍由顾客控制。

### MRTR

**术语**：Multi-Round-Trip Requests，多轮往返请求模式。
**白话**：先拿到一张“请补材料”的回执，补齐后重新递交原订单。

### InputRequiredResult

**术语**：resultType 为 input_required 的中间结果。
**白话**：这不是失败，而是“我还缺一项信息”。

### requestState

**术语**：由 Server 生成、Client 原样回显的 opaque string。
**白话**：封好的取件条码，前台不能拆开改内容，后厨仍要验真。

## 易混点

### MRTR 不是 Server 发起的 JSON-RPC Request

inputRequests 的值看起来像 elicitation/create，但它嵌在 Server 的结果里；Client 处理后重试原方法。现代 Server 不应把它单独写到 HTTP SSE 或 stdio 通道。

### URL Elicitation 不等于 MCP Authorization

MCP Authorization 保护 Client 到 MCP Server 的访问；URL Elicitation 常用于 Server 到第三方服务的 OAuth、支付或凭据收集，两条信任链要分开。

### decline 和 cancel 不是 accept

Client 应保留 action 的语义。URL 模式的 accept 只表示用户同意打开交互，不表示第三方流程已经完成；Server 可以在重试时继续返回 input_required。

### requestState 不是 JWT 解析教学

规范要求 Client 不解释它；Server 可以使用任意不透明编码。若状态影响安全，重点是完整性、主体绑定、过期和重放防护，不是“把 JSON base64 一下”。

### Deprecated 能力不应被新代码当作核心

Roots、Sampling 和 MCP logging 在 2026-07-28 已 deprecated；它们的旧消息可在兼容场景出现。Tasks 是可选 extension。MRTR 的机制可以承载兼容请求，但新设计优先考虑显式参数和用户输入。

## 课后小问（含解析）

### 问题 1：为什么重试必须换 JSON-RPC id？

**解析**：初次调用已经收到 InputRequiredResult，生命周期上已完成；重试是新的 Request。复用 id 会让并发 Client 无法区分哪一条结果属于哪一次请求。

### 问题 2：Server 能把 requestState 解码后直接信任其中的 user_id 吗？

**解析**：不能。requestState 经过 Client 传递，是攻击者可控输入。Server 必须验证签名/认证标签、当前主体、过期时间、原方法与参数，并在需要时防止重复消费。

## 小结

Elicitation 保留用户控制，form 收集非敏感字段，url 把敏感交互留在外部安全页面。MRTR 用 input_required、inputRequests、inputResponses 和 opaque requestState 在无协议 Session 的现代核心中实现多轮交互。它不是独立的 Server→Client 请求通道，Roots/Sampling 仍是 deprecated，Tasks 仍是可选扩展。

## 快速回顾

- form 不请求密码、token、API key 或支付凭据；敏感数据使用 url。
- MRTR 只用于 tools/call、prompts/get、resources/read 的补充输入。
- retry 使用新的 id，原样回显 requestState。
- requestState 必须视为不可信；影响安全时要完整性保护和重放防护。
- 现代 Server 不发送独立 elicitation/create、sampling/createMessage 或 roots/list Request。

## 官方依据

- [Elicitation](https://modelcontextprotocol.io/specification/2026-07-28/client/elicitation)
- [Multi Round-Trip Requests](https://modelcontextprotocol.io/specification/2026-07-28/basic/patterns/mrtr)
- [2026-07-28 schema.ts](https://github.com/modelcontextprotocol/modelcontextprotocol/blob/main/schema/2026-07-28/schema.ts)
- [Python SDK v2.2.0 Elicitation handlers](https://github.com/modelcontextprotocol/python-sdk/blob/v2.2.0/docs/handlers/elicitation.md)
- [Python SDK v2.2.0 Migration Guide](https://github.com/modelcontextprotocol/python-sdk/blob/v2.2.0/docs/migration.md)
