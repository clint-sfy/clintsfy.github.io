---
title: Tools 与 JSON Schema 2020-12
author: 阿源
date: 2026/10/08 00:00
categories: [Agent 开发]
tags: [MCP, Tools, JSON Schema]
status: 正文
chapter: 06
---

# Tools 与 JSON Schema 2020-12

## 学习目标

- 从 tools/list 和 tools/call 还原一个 MCP Tool 的发现、校验、执行、返回数据流。
- 正确理解 inputSchema、outputSchema、content、structuredContent 和 isError。
- 知道没有参数的工具也要使用有效的 object Schema。
- 区分 Schema 形状校验、业务校验、授权和普通 Tool Calling。

## 前置知识

需要先读 [server/discover 与能力发现](./05-server-discover与能力发现) 以及第 04 章的 Function Calling。本文所有可运行代码只使用 Python 标准库；生产环境应使用明确支持 JSON Schema 2020-12 的校验器。

## 核心知识点

### Tool 是服务器发布的契约

一个 Tool 至少包含：

- name：Server 内唯一的标识；
- description：给人和模型理解用途的说明；
- inputSchema：期望 arguments 的 JSON Schema；
- 可选 outputSchema：structuredContent 的 JSON Schema；
- 可选 title、icons、annotations 等展示或行为提示。

Tool 是“可调用契约”，不是 Python 函数指针，也不授予调用方权限。Host 先通过 tools/list 获取定义，再决定是否将它转换为模型的普通 Tool Calling schema。

### inputSchema 的 2020-12 约束

规范建议并要求实现支持 JSON Schema 2020-12。缺少 $schema 时，默认按 2020-12 解释；显式写 draft-07 等其他方言时，双方必须按实现支持情况处理，不能静默当作另一种方言。

最重要的边界是：

1. JSON 解析只说明文本是合法 JSON；
2. Schema 校验只说明形状、字段和类型符合；
3. 业务校验还要检查允许的日期、金额、资源范围；
4. 授权检查决定当前主体是否可以做；
5. 审批和沙箱才决定是否产生副作用。

没有参数的 Tool 不应使用空对象 {} 作为 inputSchema。规范要求一个有效 Schema 对象，推荐：

~~~json
{
  "type": "object",
  "additionalProperties": false
}
~~~

### 调用与结果

Client 发送 tools/call：

~~~json
{
  "jsonrpc": "2.0",
  "id": 42,
  "method": "tools/call",
  "params": {
    "name": "calculate_sum",
    "arguments": {"a": 2, "b": 3},
    "_meta": {
      "io.modelcontextprotocol/protocolVersion": "2026-07-28",
      "io.modelcontextprotocol/clientCapabilities": {}
    }
  }
}
~~~

成功结果可以同时提供：

- content：给模型或用户消费的内容块列表，常见是 text；
- structuredContent：给程序消费的任意 JSON 值，可按 outputSchema 校验；
- resultType：现代结果的 complete；
- isError：工具执行失败时为 true，但仍是一个 Tool 结果。

未知工具、坏 arguments 形状或不支持的方法是 JSON-RPC error；外部 API 失败、业务规则失败和可由模型修正的参数错误，更适合返回 isError 为 true 的结果。

### x-mcp-header 与普通参数

2026-07-28 的 Streamable HTTP 允许在 inputSchema 的 primitive 属性上标注 x-mcp-header。Client 可把值镜像到 Mcp-Param-Name，网关因此能路由而不解析 body；Server 必须比较 header 和 body，不一致时返回 -32020。它是路由优化和一致性校验，不是绕过 JSON Schema 或授权的通道。

### Tool 调用数据流

~~~mermaid
flowchart TD
    List["tools/list<br/>Tool + inputSchema"] --> Host["Host 筛选与用户授权"]
    Host --> Model["模型或 UI 生成 arguments"]
    Model --> Parse["解析 JSON"]
    Parse --> Schema{"JSON Schema 2020-12？"}
    Schema -->|否| ProtocolError["JSON-RPC -32602"]
    Schema -->|是| Business["业务校验 + 当前主体授权"]
    Business -->|否| ToolError["result.isError = true"]
    Business -->|是| Execute["执行器 / 沙箱"]
    Execute --> Result["content + structuredContent"]
    Result --> ValidateOut["可选 outputSchema 校验"]
    ValidateOut --> Host
    classDef core fill:transparent,stroke:currentColor,color:currentColor,stroke-width:1px;
    class List,Host,Model,Parse,Schema,ProtocolError,Business,ToolError,Execute,Result,ValidateOut core;
~~~

### 用标准库验证一个最小输入 Schema

用途：标准库没有完整 JSON Schema 2020-12 校验器，下面只实现课程示例需要的 object、required、integer 和 additionalProperties。它帮助理解“形状校验在执行前发生”，不应冒充生产级校验器。

~~~python
def validate_add(schema: dict, arguments: dict) -> list[str]:
    errors = []
    if schema.get("type") != "object" or not isinstance(arguments, dict):
        return ["arguments must be an object"]

    for name in schema.get("required", []):
        if name not in arguments:
            errors.append(f"missing required property: {name}")

    properties = schema.get("properties", {})
    if schema.get("additionalProperties") is False:
        extra = set(arguments) - set(properties)
        errors.extend(f"unexpected property: {name}" for name in sorted(extra))

    for name, definition in properties.items():
        if name not in arguments:
            continue
        value = arguments[name]
        if definition.get("type") == "integer" and (
            isinstance(value, bool) or not isinstance(value, int)
        ):
            errors.append(f"{name} must be integer")
    return errors


schema = {
    "type": "object",
    "properties": {
        "a": {"type": "integer"},
        "b": {"type": "integer"},
    },
    "required": ["a", "b"],
    "additionalProperties": False,
}

for args in ({"a": 2, "b": 3}, {"a": 2, "c": 3}):
    print(args, "OK" if not validate_add(schema, args) else validate_add(schema, args))
~~~

输出：

~~~text
{'a': 2, 'b': 3} OK
{'a': 2, 'c': 3} ['missing required property: b', 'unexpected property: c']
~~~

### 普通 Tool Calling 的映射边界

Host 可以把：

~~~json
{
  "name": "calculate_sum",
  "description": "Add two integers",
  "inputSchema": {
    "type": "object",
    "properties": {"a": {"type": "integer"}, "b": {"type": "integer"}},
    "required": ["a", "b"]
  }
}
~~~

映射成模型供应商的 function/tool 定义。但模型返回 arguments 以后，仍需走 MCP Client、JSON-RPC、Server 端校验和授权。JSON Schema 只描述形状，不能让模型直接拥有文件、数据库或网络权限。

## 术语与白话

### inputSchema

**术语**：Tool arguments 的 JSON Schema。
**白话**：填写订单的表格格式，说明哪些栏位必填、类型是什么。

### outputSchema

**术语**：structuredContent 的可选 JSON Schema。
**白话**：厨房给机器读的标准出餐单；content 仍可提供人能读的说明。

### content

**术语**：ToolResult 的内容块列表。
**白话**：给模型或用户看的“说明纸”，可以是文字、图片、音频或资源引用。

### isError

**术语**：表示 Tool 已执行到结果层，但失败信息可反馈给模型。
**白话**：订单格式没错，但厨房说库存不足；模型可以据此调整，不是协议本身坏了。

## 易混点

### description 不是授权策略

工具说明写“只读”不会阻止函数删文件。授权、审批和执行器必须由 Host/Server 强制执行。

### Schema 通过不是业务通过

字符串符合 pattern、整数在 range 内，只代表形状规则满足。资源是否属于当前租户、目标账号是否允许操作，还要由业务层验证。

### content 与 structuredContent 不是二选一

程序可读取 structuredContent，模型和 UI 可读取 content。outputSchema 如果存在，Server 应让 structuredContent 与它一致；不应把未校验的任意对象当作结构化契约。

### Tool list 与模型工具列表不同

tools/list 是 MCP Server 的协议目录；Host 还可以按风险、上下文预算、租户和模型供应商限制进行裁剪。

## 课后小问（含解析）

### 问题 1：为什么无参数 Tool 仍需要 type 为 object 的 Schema？

**解析**：Schema 必须告诉 Client/校验器 arguments 的根形状。用 type object、additionalProperties false 可以表达“只接受空对象”，比 {} 清晰且符合 2020-12 约束。

### 问题 2：工具抛异常时应该总是返回 JSON-RPC error 吗？

**解析**：未知方法、协议结构错误等应是 JSON-RPC error；可供模型理解和修正的业务失败应是 result 中 isError true。异常分类要由 SDK 适配层和业务代码明确决定。

## 小结

MCP Tool 是由 Server 发布的结构化能力契约。inputSchema 采用 JSON Schema 2020-12 语义，调用要经过解析、Schema、业务、授权和执行多层边界；结果可同时包含 content 与 structuredContent。它可以被映射成普通 Tool Calling，却不等于模型直接获得执行权限。

## 快速回顾

- tools/list 返回 Tool 定义；tools/call 执行一次调用。
- inputSchema 默认 2020-12；无参数工具推荐 object + additionalProperties false。
- Schema 只检查形状，不能代替业务校验和授权。
- content 面向内容消费，structuredContent 面向程序消费。
- Tool 执行失败可以用 isError true；协议失败用 JSON-RPC error。

## 官方依据

- [Tools](https://modelcontextprotocol.io/specification/2026-07-28/server/tools)
- [JSON Schema Usage](https://modelcontextprotocol.io/specification/2026-07-28/basic)
- [2026-07-28 schema.ts](https://github.com/modelcontextprotocol/modelcontextprotocol/blob/main/schema/2026-07-28/schema.ts)
