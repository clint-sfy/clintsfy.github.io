---
title: Host、Client 与 Server
author: 阿源
date: 2026/10/08 00:00
categories: [Agent 开发]
tags: [MCP, Host, Client, Server]
status: 正文
chapter: 06
---

# Host、Client 与 Server

## 学习目标

- 从运行时职责而不是进程数量理解 Host、Client、Server 三个角色。
- 画出一个 Host 连接多个 Server 时的边界，知道每个 Client 只面向一个 Server。
- 理解 2026-07-28 中“传输存在、协议 Session 不存在”的含义。
- 能识别能力、身份、授权主体和业务状态分别应该放在哪里。

## 前置知识

建议先读[MCP 解决什么问题](./01-MCP解决什么问题)，并了解第 02 章的 Environment 与第 04 章的执行器。本文的代码只用标准库。

## 核心知识点

### Host：编排和责任归属

**Host** 是用户直接使用的 LLM 应用或 Agent 宿主。它拥有：

- 一个或多个 MCP Client；
- 模型上下文和 Agent Loop；
- 用户同意、展示、审计和结果回填；
- 把 Server 能力映射到模型或界面的策略。

白话说，Host 是“总调度台”。它可以让模型看到三个 Server 的工具，也可以只把其中一个只读工具暴露给模型。MCP 不规定 Host 必须如何呈现 UI，但安全建议要求用户知道哪些 Tool 被暴露、何时调用以及如何拒绝。

### Client：面向一个 Server 的协议连接器

**Client** 是 Host 内部负责一个 Server 的组件。它负责：

1. 构造带每请求元数据的 JSON-RPC 请求；
2. 选择 stdio 或 Streamable HTTP 等传输；
3. 解析响应、通知、分页和错误；
4. 把协议结果转换成 Host 可消费的对象。

一个 Host 可以有 Client A、Client B、Client C；不要把所有 Server 拼成一个“共享 Client”。这样可以让授权凭证、能力缓存、超时和故障隔离保持在正确的 Server 边界上。

### Server：能力与业务实现

**Server** 实现 MCP 方法并发布 Tools、Resources、Prompts 等能力。Server 负责：

- 返回稳定、可校验的能力描述；
- 根据每个请求的身份、能力和参数执行；
- 对资源 URI、Tool 参数和业务状态做服务端校验；
- 返回协议错误或可供模型修正的 Tool 执行错误。

Server 不应根据“这个连接之前调用过什么”来推断当前请求的协议版本、能力或用户身份。2026-07-28 把这些信息放在每个请求的 _meta 中。

### 传输、进程和协议边界

stdio 通常表现为“一个 Host 启动一个 Server 子进程”；Streamable HTTP 通常表现为“多个 Client 请求一个 HTTP Endpoint”。这些是部署拓扑，不是协议角色的定义。

2026-07-28 的现代请求是自描述的：

- 没有 initialize/initialized 握手；
- 没有 Mcp-Session-Id，也没有 MCP 协议层 Session；
- 每个请求都声明协议版本和 Client 能力；
- HTTP 允许每次请求落到任意副本；
- Server 若需跨请求状态，应返回显式句柄，并要求后续 Tool 参数携带该句柄。

旧版 2025-11-25 及更早协议仍可通过双时代实现兼容。那是兼容层，不是现代核心流程。

### 多 Server 的数据流

下面的图把 Host 的安全决策画在 Client 外侧：Client 是协议适配器，不是授权替代品。

~~~mermaid
flowchart TD
    User["用户 / UI"] --> Host["Host<br/>模型、Agent Loop、Consent"]
    Host --> Decision{"选择并授权哪一个 Server？"}
    Decision --> C1["Client A"]
    Decision --> C2["Client B"]
    C1 --> S1["Server A<br/>仓库只读能力"]
    C2 --> S2["Server B<br/>工单写入能力"]
    S1 --> R1["Result / Error"]
    S2 --> R2["Result / Error"]
    R1 --> Host
    R2 --> Host
    classDef core fill:transparent,stroke:currentColor,color:currentColor,stroke-width:1px;
    class User,Host,Decision,C1,C2,S1,S2,R1,R2 core;
~~~

图中的 Server A 和 Server B 即使都暴露名为 search 的 Tool，也不应依赖 serverInfo 的显示名称做唯一键。聚合 Host 应使用显式的来源标识或命名空间，避免工具碰撞和越权路由。

### 用标准库建模角色边界

用途：这段代码不建立进程和网络，而是把 Host、Client、Server 的调用方向固定下来。Server 不直接拿到 Host 的模型对象，Client 不决定用户是否同意。

~~~python
from dataclasses import dataclass


@dataclass(frozen=True)
class Server:
    name: str
    tools: dict[str, object]

    def call(self, tool_name: str, arguments: dict[str, int]) -> int:
        return self.tools[tool_name](arguments)


@dataclass
class Client:
    server: Server

    def list_tools(self) -> list[str]:
        return sorted(self.server.tools)

    def call_tool(self, name: str, arguments: dict[str, int]) -> int:
        return self.server.call(name, arguments)


def add(arguments: dict[str, int]) -> int:
    return arguments["a"] + arguments["b"]


def delete_ticket(arguments: dict[str, int]) -> int:
    return arguments["ticket_id"]


repo = Client(Server("repo", {"add": add}))
ticket = Client(Server("ticket", {"delete_ticket": delete_ticket}))

print("repo tools:", repo.list_tools())
print("ticket tools:", ticket.list_tools())
print("repo add:", repo.call_tool("add", {"a": 2, "b": 3}))
~~~

输出：

~~~text
repo tools: ['add']
ticket tools: ['delete_ticket']
repo add: 5
~~~

即使两个 Client 都暴露 call_tool，调用也仍然被绑定到各自的 Server。真实 SDK 会把这里的纯函数替换成 JSON-RPC 和传输，但角色关系不变。

## 术语与白话

### Host

**术语**：拥有用户、模型和 Agent Loop 的应用。
**白话**：决定“现在要完成什么、问谁、是否让模型看到”的总控台。

### Client

**术语**：Host 到一个 Server 的协议适配器。
**白话**：一条专线翻译员，只替一个远端服务传话。

### Server

**术语**：按 MCP 方法提供能力的服务。
**白话**：菜单和后厨；菜单写得再好也不代表顾客已经授权点菜。

### 身份、凭证和 serverInfo

**术语**：凭证用于授权，serverInfo 用于自报身份、展示、日志和调试。
**白话**：门禁卡决定能不能进，名牌只告诉你“对方自称是谁”。自报名称不能当作安全依据。

## 易混点

### Client 不是“模型客户端”

MCP Client 可以由模型应用拥有，但其职责是 MCP 协议适配；它不一定调用 LLM，也不负责选择模型。一个桌面 Host 可以在没有模型的情况下用 Client 读取 Resource。

### Server 不是“拥有用户 Session 的后端”

2026-07-28 没有协议 Session。身份应从 HTTP Authorization 或 Host 传入的业务上下文获得；跨请求业务状态应由显式句柄、数据库或 Tasks 等可选扩展管理。

### serverInfo 不是授权主体

_meta 中的 serverInfo 和请求中的 clientInfo 都是自报值。规范明确它们用于展示、日志和调试，不可用于改变安全策略或作访问控制判断。

### 一个进程可以拥有多个角色

测试时可以把 Server 对象直接交给 Python SDK v2 的 Client 做进程内连接；这是一种测试拓扑，不意味着协议把 Host、Client、Server 合并成一个安全主体。

## 课后小问（含解析）

### 问题 1：为什么每个 Server 都要有自己的 Client？

**解析**：这样能隔离传输、凭证、能力集合、缓存、超时和故障。把多个 Server 复用成一个无边界 Client，容易把 A 的权限或缓存错误地用于 B。

### 问题 2：HTTP 负载均衡把请求送到不同副本，会破坏现代 MCP 吗？

**解析**：不会。现代请求自带协议版本、Client 能力和需要的参数，副本可以独立处理。只有应用层状态需要通过显式句柄或共享存储设计；不能偷偷依赖连接粘性。

## 小结

Host 管用户和编排，Client 管 MCP 协议适配，Server 管能力和业务实现。2026-07-28 把“传输连接”与“协议 Session”彻底分开：现代核心没有 initialize 握手和协议 Session，任何请求都应自带处理所需的元数据。

## 快速回顾

- 一个 Host 可以有多个 Client；通常一个 Client 面向一个 Server。
- Client 负责消息和传输，不替代 Host 的同意与授权。
- Server 的能力描述、serverInfo 和业务状态是三件事。
- 连接、进程、HTTP worker 都不是现代协议 Session。
- 跨请求状态使用显式句柄或应用存储，不从先前请求推断。

## 官方依据

- [MCP Architecture overview](https://modelcontextprotocol.io/docs/2026-07-28/learn/architecture.md)
- [Understanding MCP clients](https://modelcontextprotocol.io/docs/2026-07-28/learn/client-concepts.md)
- [Base Protocol: Statelessness and _meta](https://modelcontextprotocol.io/specification/2026-07-28/basic)
- [Versioning and Compatibility](https://modelcontextprotocol.io/specification/2026-07-28/basic/versioning)
