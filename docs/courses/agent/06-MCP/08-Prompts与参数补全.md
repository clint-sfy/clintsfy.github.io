---
title: Prompts 与参数补全
author: 阿源
date: 2026/10/08 00:00
categories: [Agent 开发]
tags: [MCP, Prompts, Completion]
status: 正文
chapter: 06
---

# Prompts 与参数补全

## 学习目标

- 区分 Prompts 的用户控制模型与 Tools 的模型控制模型。
- 读懂 prompts/list、prompts/get 的数据和消息内容。
- 使用 completion/complete 为 Prompt 参数或 Resource Template 参数提供建议。
- 识别 Prompt 注入、敏感建议泄露和错误的自动执行边界。

## 前置知识

需要阅读 [Resources、URI 与订阅](./07-Resources-URI与订阅) 和第 03 章的 Message/Content Block。本文用标准库模拟补全服务，不依赖 MCP SDK。

## 核心知识点

### Prompt 是用户可选的模板

MCP Prompt 是 Server 发布给 Client 的结构化消息模板。规范强调 Prompts 是 user-controlled：通常由用户在 UI 中显式选择，例如 slash command；Server 定义内容，Host 决定如何展示和何时插入模型上下文。

这与 Tools 的 model-controlled 语义不同：

- Tool 可由模型根据上下文自动提出调用，但高风险操作应给用户确认；
- Prompt 通常由用户主动选择，再由 Client 用 arguments 请求具体内容；
- 两者都不自动绕过 Host 的同意、内容安全和权限策略。

### prompts/list 与 prompts/get

Server 声明 prompts capability 后，Client 可请求 prompts/list。下面每个现代 Request 都要在 params._meta 带协议版本和 Client capabilities。每个 Prompt 可能包含：

- name：唯一标识；
- title、description、icons：显示信息；
- arguments：可填参数，name、description、required；
- listChanged：是否通过 subscriptions/listen 通知清单变化。

prompts/get 使用 name 和可选的字符串 arguments 返回 messages。每条 PromptMessage 有 role（user 或 assistant）和 content。Content 可以是 text、image、audio、resource_link 或 embedded resource。

### 一个请求的完整形状

~~~json
{
  "jsonrpc": "2.0",
  "id": 9,
  "method": "prompts/get",
  "params": {
    "name": "code_review",
    "arguments": {"language": "python"},
    "_meta": {
      "io.modelcontextprotocol/protocolVersion": "2026-07-28",
      "io.modelcontextprotocol/clientCapabilities": {}
    }
  }
}
~~~

响应中每个 message 的 content 都可能影响模型上下文，所以 Host 应显示来源、应用大小限制、按用户请求选择，并对远程 Prompt 内容做不可信输入处理。

### completion/complete 的语义

Completion 是 Server 为 Prompt 参数或 Resource Template 参数提供的交互式建议。请求包含：

- ref/prompt + prompt name，或 ref/resource + URI/URI Template；
- argument.name 和 argument.value；
- 可选 context.arguments，表示已经解析的其它参数。

结果包含 values（最多 100 个）、可选 total 和 hasMore。它不是模型生成，也不是 Tool Calling；它是帮助用户更快填参数的服务端建议。Client 应防抖、缓存并控制敏感值的展示。

### Prompt 与补全数据流

~~~mermaid
flowchart LR
    Server["MCP Server"] --> PL["prompts/list"]
    PL --> UI["Host Prompt Picker<br/>用户选择"]
    UI --> C["completion/complete<br/>当前前缀 + context"]
    C --> UI
    UI --> PG["prompts/get<br/>name + arguments"]
    PG --> Messages["PromptMessage[]"]
    Messages --> Review["Host 检查来源、大小与注入"]
    Review --> Model["模型上下文"]
    Server --> RL["resources/templates/list"]
    RL --> RC["同一个 completion 机制"]
    classDef core fill:transparent,stroke:currentColor,color:currentColor,stroke-width:1px;
    class Server,PL,UI,C,PG,Messages,Review,Model,RL,RC core;
~~~

### 用标准库实现前缀补全

用途：这个例子只模拟 completion/complete 的排序和 hasMore，不实现 JSON-RPC 传输。它能验证“补全是建议列表，不是直接填值或执行 Prompt”。

~~~python
LANGUAGES = ["python", "pytorch", "pyside", "rust", "typescript"]


def complete(prefix: str, limit: int = 3) -> dict:
    values = [item for item in LANGUAGES if item.startswith(prefix.lower())]
    return {
        "resultType": "complete",
        "completion": {
            "values": values[:limit],
            "total": len(values),
            "hasMore": len(values) > limit,
        },
    }


print(complete("py"))
print(complete("p", limit=2))
~~~

输出：

~~~text
{'resultType': 'complete', 'completion': {'values': ['python', 'pytorch', 'pyside'], 'total': 3, 'hasMore': False}}
{'resultType': 'complete', 'completion': {'values': ['python', 'pytorch'], 'total': 3, 'hasMore': True}}
~~~

真正的 Server 还要验证 ref 是否存在、argument 是否允许、用户是否有权看到建议，并防止把内部项目名、邮箱或密钥前缀当作补全结果泄露。

## 术语与白话

### Prompt

**术语**：可由用户选择并参数化的结构化消息模板。
**白话**：菜单里的“代码审查模板”，用户点它后再填语言和代码。

### PromptMessage

**术语**：Prompt 返回的 role + content 消息。
**白话**：模板展开后要放进对话的每一条消息。

### Completion

**术语**：基于当前参数前缀返回的建议集合。
**白话**：输入框下拉菜单，不是自动点击确定。

### context.arguments

**术语**：已经解析的其他参数，为当前补全提供上下文。
**白话**：填写地区后再补全城市，补全器知道你选了哪个地区。

## 易混点

### Prompt 不是系统提示词注入器

Prompt 内容仍由 Host 决定是否加入模型上下文。Server 返回的 instructions、description 和消息都可能是外部不可信文本，不能自动获得最高优先级或覆盖 Host 的系统约束。

### Completion 不是 Tool

completion/complete 没有副作用。它提供建议；prompts/get 才展开模板；Host 仍需让用户确认 Prompt 是否插入上下文。

### arguments 的值都是字符串

PromptArgument 的协议形状是字符串参数；若业务需要整数、枚举或复杂对象，应在模板展开前做显式解析和验证，不要把字符串直接拼进 SQL、Shell 或 URL。

### Prompt 内容可能包含 Resource

resource_link 只是一条 URI 引用，embedded resource 包含实际内容。Host 应分别应用 URI 权限和内容大小策略，不能因它出现在 Prompt 里就信任。

## 课后小问（含解析）

### 问题 1：为什么 Prompt 默认是用户控制而 Tool 默认是模型控制？

**解析**：Prompt 通常代表一段有意选择的工作流指令，用户应明确选择；Tool 是模型根据任务上下文提出动作的结构化接口。但这只是规范的交互模型建议，Host 仍可选择其它 UI，只要保留同意与安全边界。

### 问题 2：补全结果返回了内部项目名，Schema 合法就可以展示吗？

**解析**：不可以。Schema 只约束形状，Completion 还要经过权限、敏感信息和信息泄露检查，并限制每次结果数量和频率。

## 小结

Prompts 给用户可选择的消息模板，prompts/list 发现、prompts/get 展开；completion/complete 为 Prompt 和 Resource Template 参数提供最多 100 项的交互建议。Prompt、描述、补全都属于不可信输入，Host 必须控制来源、注入、权限和上下文大小。

## 快速回顾

- Prompt 是用户控制的模板，Tool 通常是模型控制的动作。
- Prompt 参数是字符串，展开后得到 PromptMessage[]。
- completion/complete 的 ref 可以指向 prompt 或 resource template。
- Completion 是建议列表，无副作用，最多返回 100 个值。
- Prompt 内容和 Resource 引用都要经过 Host 安全处理。

## 官方依据

- [Prompts](https://modelcontextprotocol.io/specification/2026-07-28/server/prompts)
- [Completion](https://modelcontextprotocol.io/specification/2026-07-28/server/utilities/completion)
- [2026-07-28 schema.ts](https://github.com/modelcontextprotocol/modelcontextprotocol/blob/main/schema/2026-07-28/schema.ts)
