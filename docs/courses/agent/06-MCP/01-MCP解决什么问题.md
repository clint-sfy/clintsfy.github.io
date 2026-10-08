---
title: MCP 解决什么问题
author: 阿源
date: 2026/10/08 00:00
categories: [Agent 开发]
tags: [MCP, Protocol, Tool Calling]
status: 正文
chapter: 06
---

# MCP 解决什么问题

## 学习目标

- 解释 MCP 解决的是“应用如何以可互操作的方式接入外部上下文与能力”，而不是“模型如何生成文本”。
- 区分普通 Tool Calling、MCP Server、MCP Client 和 Host 的责任。
- 能从一次 tools/call 的协议数据流定位模型、运行时、传输和授权边界。
- 以 2026-07-28 为准理解无协议 Session、每请求元数据和扩展的基本位置。

## 前置知识

需要理解第 02 章的 Agent Loop，以及第 04 章的 Tool Definition、参数校验和执行器。本文不要求先安装 MCP SDK；代码使用 Python 标准库模拟协议边界。

## 核心知识点

### MCP 的问题域

**MCP（Model Context Protocol）** 是一组开放的消息、数据类型和传输约束，用来让 LLM 应用把外部数据与动作能力接入自己的运行时。2026-07-28 规范把核心拆成 JSON-RPC 消息、每请求元数据、Server Features（Tools、Resources、Prompts）和 Client Features（例如 Elicitation）等层。

白话说：一个 Host 不必为每个数据库、代码仓库或 SaaS 服务重新发明一套“列工具、调工具、读数据、显示提示”的私有协议。Server 描述自己能提供的能力，Client 负责把 Host 的请求送到某一个 Server，Host 决定哪些能力可见、哪些操作需要用户同意。

MCP 不负责以下事情：

- 它不是模型，不决定模型如何推理。
- 它不是 Agent Loop，不负责决定任务何时结束。
- 它不是权限系统本身；HTTP Authorization 只定义互操作的授权框架，Host 和 Server 仍要落实自己的策略。
- 它不是一个隐含的业务 Session。2026-07-28 的协议请求必须自带处理所需的上下文。

### 为什么会出现 N×M 集成问题

假设有 N 个 Host（IDE、聊天应用、自动化 Agent）和 M 个能力提供方。如果每个 Host 都直接对接每个提供方，就会出现 N×M 个适配器：每个适配器都要约定工具定义、参数格式、资源读取、错误、取消、流式输出和权限提示。更麻烦的是，工具的自然语言描述容易被某个模型适配器绑死，能力难以迁移到另一个 Host。

MCP 把接口收敛成两类：

1. **Host ↔ Client**：Host 的应用逻辑决定如何把模型、用户和多个 Server 组合起来。
2. **Client ↔ Server**：Client 通过 MCP 消息发现能力、读取 Resource、获取 Prompt 或调用 Tool。

模型只是 Host 内部的一个决策组件。Host 可以把 MCP Tool 定义转换成某个模型供应商的工具定义，也可以完全不使用模型而由用户界面直接调用。

### 普通 Tool Calling 与 MCP 的区别

两者都可能出现工具名和 JSON 参数，但抽象层不同：

| 对比维度 | 普通 Tool Calling | MCP |
| --- | --- | --- |
| 谁定义工具 | 一次模型请求的应用代码 | 可独立部署的 Server 通过协议暴露 |
| 发现方式 | 应用把工具定义塞进模型请求 | Client 用 tools/list 或发现结果获取 |
| 作用范围 | 通常是一个应用、一个模型供应商 | 多个 Host、多个 Server、多个传输 |
| 形态 | 模型输出调用提议 | JSON-RPC 请求、响应、通知及标准结果 |
| 除工具外的能力 | 由应用自定义 | 还有 Resources、Prompts、Completion、Subscriptions 等 |
| 安全边界 | 应用自行实现 | 协议给出元数据、授权、取消与错误语义，仍需应用落实同意和权限 |

因此，MCP Tool 可以被 Host 转成普通 Tool Calling 的工具定义，但 MCP 不等于“模型直接调用远端函数”。准确的数据流是：模型提出候选动作，Host/运行时校验和授权，MCP Client 发送请求，Server 执行后返回结果。

### 一次调用的协议数据流

下面的图刻意把模型放在 Host 内部；Client 不替模型决定调用什么，Server 也不直接收到自然语言任务。

~~~mermaid
flowchart LR
    User["用户目标"] --> Host["Host<br/>模型 + Agent Loop + 同意界面"]
    Host -->|"tools/list / resources/list"| Client["MCP Client<br/>一个 Server 连接器"]
    Client -->|"JSON-RPC + 每请求 _meta"| Server["MCP Server<br/>能力与业务实现"]
    Server -->|"result / error / notification"| Client
    Client --> Host
    Host -->|"校验、授权、回填 Observation"| Model["模型或应用决策器"]
    Model -->|"调用提议"| Host
    classDef core fill:transparent,stroke:currentColor,color:currentColor,stroke-width:1px;
    class User,Host,Client,Server,Model core;
~~~

阅读图时要记住：箭头表示数据流，不等于“谁拥有谁的权限”。Host 仍是用户同意和模型上下文的边界；Server 获得什么数据，取决于 Host 是否把它放进请求并通过授权检查。

### 用标准库模拟最小 MCP 边界

用途：下面的代码不实现完整 JSON-RPC Server，而是把“工具描述由 Server 提供、Host 选择后形成调用请求、执行结果回到 Host”这条最小链路固定下来。这样可以在没有密钥和第三方依赖的情况下验证概念。

~~~python
import json


TOOLS = [
    {
        "name": "add",
        "description": "Add two integers.",
        "inputSchema": {
            "type": "object",
            "properties": {
                "a": {"type": "integer"},
                "b": {"type": "integer"},
            },
            "required": ["a", "b"],
        },
    }
]


def server_list_tools():
    return {"resultType": "complete", "tools": TOOLS}


def server_call_tool(name, arguments):
    if name != "add":
        raise ValueError("unknown tool")
    return {
        "resultType": "complete",
        "content": [{"type": "text", "text": str(arguments["a"] + arguments["b"])}],
        "structuredContent": {"value": arguments["a"] + arguments["b"]},
    }


catalog = server_list_tools()
call = {
    "jsonrpc": "2.0",
    "id": 1,
    "method": "tools/call",
    "params": {
        "name": catalog["tools"][0]["name"],
        "arguments": {"a": 2, "b": 3},
        "_meta": {
            "io.modelcontextprotocol/protocolVersion": "2026-07-28",
            "io.modelcontextprotocol/clientCapabilities": {},
        },
    },
}

print(json.dumps(catalog, ensure_ascii=False))
print(json.dumps({"jsonrpc": "2.0", "id": call["id"], "result": server_call_tool(
    call["params"]["name"], call["params"]["arguments"]
)}, ensure_ascii=False))
~~~

预期输出（字段顺序可能因 Python 版本不同而不同）：

~~~text
{"resultType": "complete", "tools": [{"name": "add", "description": "Add two integers.", "inputSchema": {"type": "object", "properties": {"a": {"type": "integer"}, "b": {"type": "integer"}}, "required": ["a", "b"]}}]}
{"jsonrpc": "2.0", "id": 1, "result": {"resultType": "complete", "content": [{"type": "text", "text": "5"}], "structuredContent": {"value": 5}}}
~~~

这个例子没有让模型“执行” add。选择工具、构造参数、把参数交给执行器和处理结果，都是 Host/运行时的责任；Server 只实现协议约定的能力。

## 术语与白话

### Host

**术语**：发起和编排 LLM 应用的程序，拥有 Agent Loop、用户界面、同意策略和多个 Client。
**白话**：餐厅前台，决定把哪张订单交给哪个后厨，还要让顾客确认高风险操作。

### Client

**术语**：Host 内部面向某个 Server 的 MCP 连接器，负责编码、传输、解析和调用。
**白话**：前台和某个后厨之间的专线适配器。一个 Host 可以同时有多个 Client。

### Server

**术语**：实现 MCP 方法并提供 Tools、Resources、Prompts 等能力的一端。
**白话**：提供菜单、食材或加工动作的后厨；它不能假定前台会把所有用户数据交给它。

### Capability

**术语**：可被发现和按请求声明的能力集合。
**白话**：菜单上的“本店能做什么”，不是“现在一定允许做什么”；授权仍要逐请求判断。

## 易混点

### “有连接”不等于“有协议 Session”

stdio 进程或 HTTP TCP 连接只是传输载体。2026-07-28 要求每个请求都带协议版本和 Client 能力，Server 不得从先前请求推断上下文；需要跨请求状态时，要把显式句柄作为后续参数传回。

### “Server 能做”不等于“Model 一定能调用”

Server 的能力列表只是协议层可用性。Host 还要做租户过滤、用户同意、模型上下文裁剪、参数校验和执行沙箱。

### “MCP 支持工具”不等于“工具安全”

工具描述、注释和返回内容可能来自不可信 Server。描述中的“只读”不能代替执行器的权限检查；用户对删除、支付、发信等操作仍应看到清晰的确认界面。

## 课后小问（含解析）

### 问题 1：把一个函数的 JSON Schema 发给模型，算不算 MCP？

**解析**：不算充分条件。那是普通 Tool Calling 的工具定义。只有当能力通过 MCP 的 JSON-RPC 消息、方法、结果和传输约定接入，并由 MCP Client/Server 交互时，才称为 MCP 集成。

### 问题 2：为什么 Host 不能把 MCP Server 返回的文字直接当成事实？

**解析**：Server 输出是 Observation 候选，可能过期、被污染或越权。Host 必须按来源、授权、业务校验和用户意图处理，再决定是否回填给模型或展示给用户。

## 小结

MCP 解决的是跨应用、跨服务的能力互操作：Server 发布结构化能力，Client 连接和翻译，Host 负责编排、同意与安全。普通 Tool Calling 解决“这次模型请求如何提出一个调用”，MCP 解决“能力如何被多个 Host 以统一协议发现、读取、调用和诊断”。2026-07-28 的关键前提是无协议 Session、每请求元数据和严格的 JSON-RPC 消息边界。

## 快速回顾

- MCP 是协议，不是模型、Agent Loop 或权限系统。
- Host 编排多个 Client；每个 Client 面向一个 Server。
- Tools 是动作，Resources 是上下文，Prompts 是用户可选择的模板。
- 普通 Tool Calling 可以是 MCP 的适配目标，但两者不是同一层。
- 2026-07-28 的请求自描述；跨请求状态必须显式传递。

## 官方依据

- [MCP 2026-07-28 Specification](https://modelcontextprotocol.io/specification/2026-07-28)
- [Base Protocol Overview](https://modelcontextprotocol.io/specification/2026-07-28/basic)
- [2026-07-28 TypeScript schema.ts](https://github.com/modelcontextprotocol/modelcontextprotocol/blob/main/schema/2026-07-28/schema.ts)
