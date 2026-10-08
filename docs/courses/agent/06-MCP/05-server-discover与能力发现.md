---
title: server/discover 与能力发现
author: 阿源
date: 2026/10/08 00:00
categories: [Agent 开发]
tags: [MCP, Discovery, Capability]
status: 正文
chapter: 06
---

# server/discover 与能力发现

## 学习目标

- 读懂 server/discover 请求与 DiscoverResult 的字段。
- 区分服务器级能力发现、工具/资源/提示清单和实际权限过滤。
- 理解 capabilities 的每请求声明、缓存提示和 serverInfo 的信任边界。
- 用一个无网络 Python 例子完成版本与能力的安全筛选。

## 前置知识

需要阅读 [无状态模型与版本协商](./04-无状态模型与版本协商) 和第 03 篇的 _meta。本文的代码不依赖 MCP SDK。

## 核心知识点

### server/discover 是什么

2026-07-28 要求 Server 实现 server/discover。它是一个普通 JSON-RPC Request，用于返回：

- supportedVersions：Server 支持的协议版本集合；
- capabilities：Server 支持的能力，例如 tools、resources、prompts、completions；
- instructions：给 Host/模型的自然语言使用说明；
- result._meta 中的 io.modelcontextprotocol/serverInfo：自报的名称和版本；
- ttlMs、cacheScope：DiscoverResult 的缓存提示。

Client 可以在执行任何业务请求之前调用它，也可以跳过，直接请求 tools/list 或 tools/call，在版本不匹配时处理 -32022。

### 请求与结果

每个 DiscoverRequest 都带标准 _meta：

~~~json
{
  "jsonrpc": "2.0",
  "id": "discover-1",
  "method": "server/discover",
  "params": {
    "_meta": {
      "io.modelcontextprotocol/protocolVersion": "2026-07-28",
      "io.modelcontextprotocol/clientInfo": {
        "name": "course-host",
        "version": "1.0.0"
      },
      "io.modelcontextprotocol/clientCapabilities": {}
    }
  }
}
~~~

结果的身份放在 result._meta，而不是把 serverInfo 当作安全凭证：

~~~json
{
  "jsonrpc": "2.0",
  "id": "discover-1",
  "result": {
    "resultType": "complete",
    "supportedVersions": ["2026-07-28"],
    "capabilities": {
      "tools": {"listChanged": true},
      "resources": {}
    },
    "_meta": {
      "io.modelcontextprotocol/serverInfo": {
        "name": "catalog",
        "version": "2.2.0"
      }
    },
    "instructions": "Use tools for search; read resources for documentation.",
    "ttlMs": 600000,
    "cacheScope": "public"
  }
}
~~~

### capabilities 与真实可用性

capabilities 是“服务器实现了哪些方法类别”的声明，而不是一份完整的 Tool 定义。Host 要调用 Tool，通常还需要：

1. 发现结果声明 tools；
2. 调用 tools/list，取得每个工具的 inputSchema；
3. 按当前授权主体过滤和缓存；
4. 在每次 tools/call 前重新执行参数、权限和业务校验。

能力中的 listChanged、subscribe 等细项表示 Server 是否愿意发相关通知。未声明的能力不能从连接历史猜出。某个用户没有权限看到的 Tool 可以在 tools/list 中被过滤；这种过滤应该基于每请求凭证，而不是连接身份。

### 扩展发现

可选扩展放在 capabilities.extensions 中，以命名空间标识符区分，例如 io.modelcontextprotocol/tasks。双方都支持时才可使用；如果一方不支持，另一方必须回退到核心行为或拒绝，而不是把扩展字段静默当作核心字段。

Roots、Sampling、MCP logging 在 2026-07-28 已 deprecated。它们可能出现在兼容实现的能力集合中，但新课程代码不应把它们当成新核心能力。Tasks 是可选 extension，也不能从“有 tools”推断出来。

### 发现与缓存的数据流

~~~mermaid
sequenceDiagram
    participant C as Client
    participant S as Server
    C->>S: server/discover + request._meta
    S-->>C: supportedVersions + capabilities + result._meta/serverInfo
    C->>S: tools/list + 当前 request._meta
    S-->>C: Tool[] + ttlMs/cacheScope
    C->>Host: 版本、能力、缓存的目录
    Host->>C: 选择并授权工具
    C->>S: tools/call + 每请求 _meta
    S-->>C: result 或 error
~~~

注意：discover 结果和 tools/list 都可能缓存，但缓存不能替代每次执行时的权限检查。cacheScope 为 public 只表示该结果被设计为可跨授权上下文共享，不能反向授予访问权限。

### 用标准库筛选可信的可用目录

用途：这个小程序把发现结果当作不可信输入，只选支持的协议版本和允许的能力类别，并把 serverInfo 仅用于显示。

~~~python
SUPPORTED_PROTOCOLS = {"2026-07-28"}
ALLOWED_FEATURES = {"tools", "resources"}


def usable_discovery(result: dict) -> dict:
    supported = set(result.get("supportedVersions", []))
    versions = sorted(supported & SUPPORTED_PROTOCOLS)
    if not versions:
        raise ValueError("no mutually supported protocol version")

    capabilities = result.get("capabilities", {})
    enabled = sorted(ALLOWED_FEATURES & set(capabilities))
    server_info = result.get("_meta", {}).get(
        "io.modelcontextprotocol/serverInfo", {}
    )
    display_name = server_info.get("name", "anonymous-server")
    return {
        "protocolVersion": versions[0],
        "features": enabled,
        "displayName": display_name,
    }


discovery = {
    "supportedVersions": ["2025-11-25", "2026-07-28"],
    "capabilities": {"tools": {}, "resources": {}, "sampling": {}},
    "_meta": {
        "io.modelcontextprotocol/serverInfo": {
            "name": "catalog",
            "version": "2.2.0",
        }
    },
}
print(usable_discovery(discovery))
~~~

输出：

~~~text
{'protocolVersion': '2026-07-28', 'features': ['resources', 'tools'], 'displayName': 'catalog'}
~~~

代码没有因为发现结果出现 sampling 就启用它，也没有用 serverInfo 进行授权；这是一个更安全的默认。

## 术语与白话

### DiscoverResult

**术语**：server/discover 的结果对象，包含版本、能力、说明、身份和缓存提示。
**白话**：服务的“目录页”，告诉你讲哪些协议、有哪些菜单。

### Capability

**术语**：方法类别或可选特性的声明。
**白话**：菜单栏目，不等于每道菜的具体配料和库存。

### listChanged

**术语**：服务器是否会对目录变化发通知。
**白话**：店家是否会告诉你菜单改版；没说会通知，就要依靠 TTL 或主动重新查询。

### cacheScope

**术语**：缓存结果可共享的范围，public 或 private。
**白话**：这张菜单是所有人一样，还是每个顾客不同；它不是门票。

## 易混点

### discover 与 tools/list 的粒度不同

discover 说明服务器支持工具类别；tools/list 才返回具体工具、描述和 inputSchema。Host 不能用 discover 的 tools 空对象去构造调用参数。

### serverInfo 与认证不同

serverInfo 由 Server 自报，可能被代理丢弃或写错。认证和授权依赖 HTTPS、Authorization、OAuth 元数据和服务器端凭证验证。

### 缓存与授权不能混用

用户 A 的 private 清单不能给用户 B 复用；public 清单也只说明内容不包含用户特定数据。每次调用仍要检查当前主体是否可访问。

### “能力发现”不等于“能力自动暴露给模型”

Host 应根据用户意图、租户策略、上下文预算和风险级别裁剪能力，不要把整个 Server 的工具目录盲目塞进模型上下文。

## 课后小问（含解析）

### 问题 1：Client 一定要先调用 server/discover 吗？

**解析**：不一定。Server 必须实现，但 Client 可以直接调用业务 RPC 并处理版本错误。stdio 双时代场景推荐先探测，以便区别现代 Server 与旧 Server。

### 问题 2：如果 discover 声明了 tools，是否可以跳过 tools/list？

**解析**：通常不可以。discover 只告诉你有 tools 类别；要知道工具名、描述、inputSchema 和列表缓存提示，仍应调用 tools/list。

## 小结

server/discover 是现代 MCP 的服务器目录入口，但不是握手。它返回版本、能力、说明和自报身份；Client 仍需按目录细节、用户授权和当前请求上下文做下一步决策。缓存提示有助于降低流量，不能取代权限检查。

## 快速回顾

- Server 必须实现 server/discover，Client 调用可选。
- supportedVersions 用于版本选择；capabilities 用于能力类别选择。
- serverInfo 只用于展示、日志和调试。
- tools/list、resources/list、prompts/list 返回具体目录，常支持分页和缓存。
- deprecated 能力不应被新代码当作核心；Tasks 是可选 extension。

## 官方依据

- [Discovery](https://modelcontextprotocol.io/specification/2026-07-28/server/discover)
- [Versioning and Compatibility](https://modelcontextprotocol.io/specification/2026-07-28/basic/versioning)
- [Caching](https://modelcontextprotocol.io/specification/2026-07-28/server/utilities/caching)
- [2026-07-28 schema.ts](https://github.com/modelcontextprotocol/modelcontextprotocol/blob/main/schema/2026-07-28/schema.ts)
