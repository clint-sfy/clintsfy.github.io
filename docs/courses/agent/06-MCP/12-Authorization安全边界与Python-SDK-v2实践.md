---
title: Authorization、安全边界与 Python SDK v2 实践
author: 阿源
date: 2026/10/08 00:00
categories: [Agent 开发]
tags: [MCP, Authorization, Security, Python SDK]
status: 正文
chapter: 06
---

# Authorization、安全边界与 Python SDK v2 实践

## 学习目标

- 按 2026-07-28 Authorization 规范区分 MCP Client、MCP Server 和 Authorization Server。
- 识别 token passthrough、confused deputy、SSRF、DNS rebinding、Prompt Injection 和请求状态重放风险。
- 了解 Python SDK v2 的 Client、MCPServer、Python 版本和依赖边界。
- 能从 v1 迁移到 v2，并知道现代无握手、无协议 Session 对代码的影响。

## 前置知识

建议通读本章前 11 篇，尤其是 [Elicitation 与 Multi-Round-Trip Requests](./09-Elicitation与Multi-Round-Trip-Requests) 和 [stdio 与 Streamable HTTP](./10-stdio与Streamable-HTTP)。

## 核心知识点

### Authorization 的角色

MCP Authorization 是 HTTP transport 的可选授权框架。启用时：

- MCP Server 是 OAuth 2.1 Resource Server，保护资源和 Tool；
- MCP Client 是 OAuth Client，代表 Resource Owner 发请求；
- Authorization Server 负责用户交互、客户端注册、令牌发行和元数据发现。

Server 应通过 OAuth 2.0 Protected Resource Metadata 告知关联的 Authorization Server；Client 再读取 Authorization Server Metadata 或 OpenID Connect Discovery。2026-07-28 强化了 issuer 校验、客户端类型和凭证绑定：Client 不能把某个 issuer 签发的令牌重放到另一个 Authorization Server。

Authorization 对 MCP 实现本身是可选的，但 HTTP 实现若启用保护应遵循规范。stdio 不应套用 HTTP OAuth 流程，通常由 Host 通过受控环境变量、操作系统凭据存储或本地 IPC 提供凭证。

### 安全边界的责任分配

| 边界 | 必须保护什么 | 典型措施 |
| --- | --- | --- |
| Host ↔ 用户 | 用户是否同意操作和数据共享 | 清晰工具卡片、确认、拒绝、审计 |
| Host ↔ Client | 哪个 Server 获得哪些上下文 | 最小权限、租户过滤、字段裁剪 |
| Client ↔ HTTP Server | bearer token、issuer、TLS、Origin | RFC 9728 元数据、issuer 校验、TLS、Origin allowlist |
| Server ↔ 业务系统 | 下游令牌和副作用 | 不透传 Client token、audience 绑定、最小 scope |
| MRTR 重试 | requestState 完整性、主体和过期 | HMAC/AEAD、TTL、参数绑定、single-use |
| Resource/Tool | URI、参数、返回内容 | Schema、路径规范化、沙箱、大小和速率限制 |

### Token passthrough 与 confused deputy

Server 不能拿 Client 给 MCP Server 的 bearer token，未经验证就原样转发给第三方 API。那会把不同资源服务器的 audience 混在一起，导致 token passthrough：

1. Client 授权访问 MCP Server；
2. MCP Server 接到 token；
3. MCP Server 把 token 当成第三方服务的凭据；
4. 第三方错误地认为 Client 直接授权了它。

正确方式是 Server 使用自己的、面向下游 audience 的凭据，或者通过 URL Elicitation 让用户直接在第三方安全页面完成授权。Server 要把下游授权和 MCP Client 授权分开存储、轮换和审计。

### SSRF、DNS rebinding 与本地权限

Resource URI、Tool URL、OAuth discovery 和自定义 headers 都是潜在网络输入。Server 应：

- 允许的 scheme、host、端口采用 allowlist；
- 禁止 loopback、link-local、私网地址的意外访问；
- 限制重定向、响应大小、超时和 DNS 解析变化；
- 对 Streamable HTTP 校验 Origin，本地服务优先绑定 127.0.0.1；
- 不把 file URI、根目录提示或 serverInfo 当作权限证明。

### 不可信模型上下文

Tool 描述、Prompt、Resource 内容、工具输出和 Completion 建议都可能包含 Prompt Injection。Host 应把这些内容标记为外部数据，不能让它们覆盖系统约束或自动授予新权限。危险 Tool 需要用户确认；审计日志应记录 Server 来源、工具名、参数摘要、授权结果和执行结果，但不要记录 token、密码或完整隐私内容。

### 安全数据流

~~~mermaid
flowchart LR
    User["用户同意"] --> Host["Host<br/>权限、上下文、审计"]
    Host --> Client["MCP Client<br/>每请求 _meta + Bearer"]
    Client --> AS["Authorization Server<br/>发现 / 授权 / Token"]
    Client --> Server["MCP Server<br/>Resource Server"]
    Server --> Check{"issuer、audience、scope、Origin"}
    Check -->|通过| Gate["参数 Schema + 业务授权 + 沙箱"]
    Check -->|失败| Deny["401 / 403 / JSON-RPC error"]
    Gate --> Downstream["下游 API<br/>Server 自有凭证"]
    Downstream --> Result["脱敏 Result / 审计"]
    Result --> Host
    classDef core fill:transparent,stroke:currentColor,color:currentColor,stroke-width:1px;
    class User,Host,Client,AS,Server,Check,Gate,Deny,Downstream,Result core;
~~~

### Python SDK v2 的版本和包边界

官方 Python SDK v2 目前是稳定的 2.x 线，安装包名仍是 mcp，要求 Python 3.10+。为了让示例可复现，下面按 mcp==2.2.0 书写；项目也可以使用 mcp>=2,<3，但应锁定依赖并在升级时查看官方 Migration Guide。mcp-types 与 mcp 严格同版本，不能自行单独 pin。

建议的最小 pyproject 片段：

~~~toml
[project]
requires-python = ">=3.10"
dependencies = [
  "mcp==2.2.0",
]
~~~

HTTP 传输还会带入 SDK 的 httpx2、Starlette、sse-starlette 和验证相关依赖；如果代码直接构造 HTTP Client，应按 v2 文档使用 httpx2，而不是把 v1 的 httpx 异常处理照搬过来。

### MCPServer：高层服务的最小结构

用途：这段代码展示 v2 的服务器命名和装饰器表面，使用进程内标准输出作为默认 stdio。它需要 Python 3.10+ 和 mcp==2.2.0；协议行为以 SDK 实际版本的官方文档为准。

~~~python
from mcp.server.mcpserver import MCPServer


mcp = MCPServer("course-demo", version="1.0.0")


@mcp.tool()
def add(a: int, b: int) -> str:
    return str(a + b)


if __name__ == "__main__":
    mcp.run()
~~~

保存为 server.py 后，mcp run server.py 或直接 python server.py 会由 Host 通过 stdio 启动。不要在 stdout 写普通日志；需要日志时写 stderr 或应用日志。

### Client：进程内可验证的最小调用

用途：官方 v2 Client 可以接收 URL、StdioServerParameters、Transport 或测试用的 MCPServer 实例。下面使用同一个 MCPServer 对象做进程内测试，避免依赖端口和子进程；这验证 SDK 的 Client/MCPServer 组合，不等于验证实际 HTTP。

~~~python
import asyncio

from mcp import Client
from mcp.server.mcpserver import MCPServer


mcp = MCPServer("course-demo", version="1.0.0")


@mcp.tool()
def add(a: int, b: int) -> str:
    return str(a + b)


async def main() -> None:
    async with Client(mcp) as client:
        tools = await client.list_tools()
        result = await client.call_tool("add", {"a": 2, "b": 3})
        print([tool.name for tool in tools.tools])
        print(result.is_error, result.content[0].text)


asyncio.run(main())
~~~

预期输出（mcp==2.2.0）：

~~~text
['add']
False 5
~~~

运行前请先安装 pip install mcp==2.2.0；当前知识库的标准库示例不依赖此包，环境没有 mcp 时不要把上面的 SDK 输出误称为已经在本机执行。

### v1 到 v2 的迁移心智模型

| v1 | v2 |
| --- | --- |
| FastMCP from mcp.server.fastmcp | MCPServer from mcp.server.mcpserver |
| 手动 transport + ClientSession + initialize | 高层 Client，进入 async with 后连接；现代路径无 initialize 握手 |
| 低层 ClientSession.initialize() | legacy（2025-11-25 及更早）；现代显式 ClientSession.discover() |
| get_context() / ambient ContextVar | 在函数参数中声明 ctx: Context |
| mcp.shared.version | mcp.types.version |
| Python 属性常见 camelCase | Python 属性 snake_case，线上 JSON 仍 camelCase |
| httpx / httpx-sse | httpx2 |
| mcp.shared.exceptions.McpError | MCPError |
| v1 实验 Tasks API | 2026-07-28 的 Tasks extension；Python SDK v2 需检查当前实现状态 |

迁移顺序应是：先把依赖锁到 mcp 2.x；机械替换 import 和类名；把 transport 参数从构造器移到 run()/app；迁移 Client；处理 v2 的严格验证、异常和 deprecation warning；最后用现代和旧版测试矩阵验证。

### Python SDK v2 与现代协议

v2 的 Client 可以与现代 2026-07-28 Server 工作，也可以根据模式兼容旧版 Server。高层 Client 在 async with 进入时负责探测/回退，业务代码不需要手写 initialize。对于需要用户输入的工具，使用 resolver 函数与 Resolve 标记：resolver 返回 Elicit(...) 时，SDK 对 legacy 使用实时 elicitation，对现代时代使用 MRTR；若手写 InputRequiredResult，必须遵循本章第 09 篇的 state 安全规则。现代连接中直接 ctx.elicit() 会抛 NoBackChannelError，不会自动改写成 MRTR。

Roots、Sampling 和 MCP logging 在规范中 deprecated；不要因为 v2 仍暴露兼容 API 就在新系统把它们当作核心设计。Tasks 是可选 extension，不应从 Client 的普通 list_tools 结果中自行推断。

## 术语与白话

### Resource Server

**术语**：接受并验证 access token、向资源所有者提供受保护资源的一方。
**白话**：门卫，检查这张票是不是本门发行、属于哪位客人和哪些区域。

### Authorization Server

**术语**：发现、注册、用户授权和发行 token 的 OAuth 服务。
**白话**：发票机构，不是实际执行 Tool 的后厨。

### Audience

**术语**：令牌预期服务的资源标识。
**白话**：票面写的“只能进哪个场馆”，不能拿 A 场馆门票进 B 场馆。

### Python SDK v2 Client

**术语**：官方高层客户端，按 URL、stdio 参数、Transport 或 Server 对象选择连接方式。
**白话**：一个统一遥控器，真正插电（async with）后才开始通信。

### MCPServer

**术语**：Python SDK v2 的高层 Server 类，替代 v1 FastMCP。
**白话**：把装饰器注册的 Tool、Resource、Prompt 交给协议引擎服务。

## 易混点

### Authorization 与 Elicitation URL 不是一回事

前者保护 Client 到 MCP Server；后者可以让 MCP Server 让用户去第三方页面授权或填写秘密。两者的 token、issuer、audience 和责任主体不能混用。

### serverInfo 不是 token

_meta.serverInfo 只是自报身份，不应作为授权判断或路由唯一键。访问控制必须验证凭证和服务器端策略。

### SDK v2 的 Client 仍有低层 ClientSession

低层对象是逃生舱，不代表业务代码必须回到 v1 的手动 initialize。默认优先使用高层 Client；只有需要自定义 dispatcher 或协议扩展时才下沉。使用低层 `ClientSession` 时，legacy（2025-11-25 及更早）调用 `session.initialize()`；现代 2026-07-28 显式调用 `session.discover()`。高层 `Client` 在 `async with` 中自动探测 `server/discover`，必要时回退 legacy `initialize`，不要求业务代码手动调用 `initialize()`；具体签名按 v2.2.0 Migration Guide。

### mcp==2.2.0 不是 MCP 协议版本

2.2.0 是 Python 包版本；2026-07-28 是 MCP wire protocol revision。升级 SDK 不等于修改请求中的协议版本字符串。

### 取消不等于回滚

SDK 能够传播取消信号，但数据库事务是否回滚、第三方请求是否已提交，仍由应用业务设计和幂等键决定。

## 课后小问（含解析）

### 问题 1：stdio 连接是否需要 OAuth Authorization header？

**解析**：MCP Authorization 规范针对 HTTP。stdio 通常从受控环境或操作系统凭据获得认证材料，不能把 HTTP bearer header 规则机械套在本地子进程上。

### 问题 2：把 Client 收到的 token 原样转给 GitHub API，为什么不行？

**解析**：这是 token passthrough，令牌的 audience 和授权主体可能不属于 GitHub。Server 应使用自己的下游凭证，或让用户通过 URL Elicitation 直接完成第三方授权。

### 问题 3：v1 教程里 await session.initialize()，迁移 v2 后应该放到哪里？

**解析**：高层 v2 Client 通过 async with 进入连接，自动探测 modern/legacy，业务代码无需手动 initialize。若使用低层 ClientSession，legacy 调用 initialize()，现代 2026-07-28 显式调用 discover()；不要在现代路径调用 initialize()。

## 小结

安全边界先于 API：Host 管同意，Client 管传输和元数据，Server 验证当前主体、参数和下游权限，Authorization Server 发行合适 audience 的 token。Python SDK v2 稳定线以 mcp==2.2.0 示例展示 MCPServer 与 Client，要求 Python 3.10+，并通过 resolver 函数、Resolve 标记与 MRTR 适应现代无握手协议。v1 到 v2 的迁移要同时处理包名、snake_case、Client 生命周期、transport 配置和 deprecated 能力。

## 快速回顾

- HTTP Authorization 可选；HTTP 服务器启用时遵循 OAuth 发现、issuer、audience 和 scope 规则。
- stdio 走受控环境凭证，不套用 HTTP Authorization。
- 禁止 token passthrough；第三方授权和 MCP 授权分开。
- 防 SSRF、DNS rebinding、路径穿越、Prompt Injection、requestState 重放。
- v2 用 MCPServer 替 FastMCP，用高层 Client 替手动三层连接；mcp-types 与 mcp 同版本。
- Roots、Sampling、MCP logging 已 deprecated；Tasks 是可选 extension，不是核心。
- 下一章进入 [Skills、Plugin 与 Hook](/courses/agent/07-Skills插件与Hook/01-Skill-Tool-MCP-Plugin与Hook边界)，把协议能力接回宿主扩展和生命周期边界。

## 官方依据

- [MCP Authorization 2026-07-28](https://modelcontextprotocol.io/specification/2026-07-28/basic/authorization)
- [MCP Security Best Practices](https://modelcontextprotocol.io/docs/2026-07-28/tutorials/security/security_best_practices.md)
- [Python SDK v2.2.0 What's new](https://github.com/modelcontextprotocol/python-sdk/blob/v2.2.0/docs/whats-new.md)
- [Python SDK v2.2.0 Migration Guide](https://github.com/modelcontextprotocol/python-sdk/blob/v2.2.0/docs/migration.md)
- [Python SDK v2.2.0 Client](https://github.com/modelcontextprotocol/python-sdk/blob/v2.2.0/docs/client/index.md)
