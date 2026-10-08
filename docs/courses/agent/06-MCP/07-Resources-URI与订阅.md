---
title: Resources、URI 与订阅
author: 阿源
date: 2026/10/08 00:00
categories: [Agent 开发]
tags: [MCP, Resources, URI, Subscriptions]
status: 正文
chapter: 06
---

# Resources、URI 与订阅

## 学习目标

- 区分 Resource、Resource Template、Resource Contents 和 Tool 返回的 resource link。
- 正确使用 resources/list、resources/templates/list、resources/read 的数据流。
- 理解 URI 是协议标识，不自动等于本地文件路径或可访问权限。
- 按 2026-07-28 的 subscriptions/listen、缓存、分页和更新通知模型设计读取流程。

## 前置知识

需要阅读 [Tools 与 JSON Schema 2020-12](./06-Tools与JSON-Schema-2020-12) 和 [server/discover 与能力发现](./05-server-discover与能力发现)。代码用 Python 标准库做 URI 检查。

## 核心知识点

### Resource 是上下文，不是动作

Resource 是 Server 暴露给 Host/模型使用的上下文数据，例如文档、数据库 schema、代码文件或应用状态快照。它有唯一 URI 和描述信息，内容可以是：

- TextResourceContents：text 字符串；
- BlobResourceContents：base64 编码的 blob；
- 结果中也可出现 ResourceLink，让 Client 以后按 URI 读取。

与 Tool 的区别是：Resource 主要回答“读什么”，Tool 主要回答“做什么”。Server 可以根据当前授权列出不同 Resource，但不能仅凭 URI 猜测调用方拥有文件系统权限。

### URI、URI Template 和读取

resources/list 返回已知 URI，支持分页和缓存。resources/templates/list 返回 URI Template，例如 file:///{path}，客户端可以对变量请求 completion/complete。resources/read 以完整 URI 读取内容。下面每个现代 Request 都要在 params._meta 带协议版本和 Client capabilities：

~~~json
{
  "jsonrpc": "2.0",
  "id": 8,
  "method": "resources/read",
  "params": {
    "uri": "memo://team/project/readme",
    "_meta": {
      "io.modelcontextprotocol/protocolVersion": "2026-07-28",
      "io.modelcontextprotocol/clientCapabilities": {}
    }
  }
}
~~~

URI scheme 可以是 https、file、git 或自定义 scheme。自定义 scheme 仍需符合 RFC 3986。https 资源只有在 Client 能自行安全读取时才适合直接使用，否则应由 Server 处理权限后通过 resources/read 返回。

### 订阅替代旧的 Subscribe

2026-07-28 用 subscriptions/listen 统一长连接通知：

- Client 在 notifications 过滤器中声明 toolsListChanged、promptsListChanged、resourcesListChanged 或 resourceSubscriptions；
- Server 必须先发 notifications/subscriptions/acknowledged；
- ack 和后续通知的 params._meta 携带 io.modelcontextprotocol/subscriptionId；
- HTTP 通过长 SSE 响应流传递；stdio 在同一 stdout 通道中用 subscriptionId 复用；
- HTTP GET stream 和 resources/subscribe 不再是现代核心路径。

订阅只表示“发生变化时提醒我”，不把资源内容永久推送给模型。收到 resources/updated 后，Client 应按 URI 再发 resources/read，并重新做权限和大小检查。

### 缓存和分页

Resource 目录和 read 结果可以带 ttlMs、cacheScope。private 结果不能跨授权上下文共享；public 也只是缓存提示，不是访问许可。分页 cursor 是不透明字符串，Client 不能解析成页码或 offset。

### 资源数据流

~~~mermaid
flowchart LR
    Discover["server/discover<br/>resources capability"] --> List["resources/list<br/>URI + ttlMs"]
    List --> Choose["Host 选择 / 授权"]
    Choose --> Read["resources/read<br/>uri"]
    Read --> Content{"text 或 blob？"}
    Content --> Context["Host 上下文 / UI"]
    List --> Template["resources/templates/list<br/>URI Template"]
    Template --> Complete["completion/complete"]
    Complete --> Read
    Subscribe["subscriptions/listen<br/>resourceSubscriptions"] --> Notify["resources/updated + subscriptionId"]
    Notify --> Read
    classDef core fill:transparent,stroke:currentColor,color:currentColor,stroke-width:1px;
    class Discover,List,Choose,Read,Content,Context,Template,Complete,Subscribe,Notify core;
~~~

### 用标准库拒绝危险的 file URI

用途：这不是完整的文件沙箱，只演示在进入文件读取器之前做 URI scheme、主机和路径规范化。真实实现还需要根目录策略、符号链接检查、租户权限和文件大小上限。

~~~python
from pathlib import PurePosixPath
from urllib.parse import unquote, urlsplit


def safe_file_uri(uri: str, allowed_root: str) -> bool:
    parsed = urlsplit(uri)
    if parsed.scheme != "file" or parsed.netloc not in ("", "localhost"):
        return False

    path = PurePosixPath(unquote(parsed.path))
    root = PurePosixPath(allowed_root)
    try:
        path.relative_to(root)
    except ValueError:
        return False
    return ".." not in path.parts


for uri in (
    "file:///srv/project/readme.md",
    "file:///srv/project/../secrets.env",
    "https://example.com/readme",
):
    print(uri, safe_file_uri(uri, "/srv/project"))
~~~

输出：

~~~text
file:///srv/project/readme.md True
file:///srv/project/../secrets.env False
https://example.com/readme False
~~~

注意：URL 解码、Windows 驱动器、符号链接、大小和 MIME 解析都要纳入生产级读取器；不要把这个小函数直接当作完整安全方案。

## 术语与白话

### Resource

**术语**：由 Server 标识并可读取的上下文对象。
**白话**：图书馆里可借阅的一本书，URI 是索书号。

### Resource Template

**术语**：含变量的 URI 模板，用于生成一批相关资源。
**白话**：书架上的“按作者和年份查书”的检索规则。

### URI

**术语**：资源的协议级唯一标识。
**白话**：地址标签，不自动代表你能进那栋楼。

### subscriptions/listen

**术语**：Client 按过滤器打开的长生命周期通知请求。
**白话**：订阅菜单变更提醒；提醒到了还要自己重新取菜单。

## 易混点

### Resource URI 不等于本地路径

file:// 可能映射到虚拟文件系统，custom scheme 甚至可能来自数据库或 API。Server 仍应把 URI 当不可信输入，明确解析和允许范围。

### 资源列表变化与资源内容变化不同

resources/list_changed 表示目录集合变化；resources/updated 表示某个已订阅 URI 内容变化。收到任一种通知后都应按相应范围重新列表或读取。

### 订阅不是协议 Session

subscriptions/listen 是一个长生命周期 Request 的响应流，状态属于这个请求；它不让其他请求获得隐含 Session，也不允许 Server 发独立 JSON-RPC Request。

### 缓存 public 不是放开权限

cacheScope 只影响缓存是否能跨授权上下文共享。每次读取仍要验证访问权限，不能通过一个 public 缓存绕过 Server 的策略。

## 课后小问（含解析）

### 问题 1：为什么 Server 不直接把整个文件内容塞进 tools/list？

**解析**：工具目录的职责是描述可执行动作；Resource 有 URI、MIME、缓存、分页和订阅语义，能按需读取和缓存，避免把大上下文一次放入模型。

### 问题 2：收到 resources/updated 后可以直接把旧缓存继续给模型吗？

**解析**：通知表示旧结果应视为可能过期。Client 应重新 resources/read，并在当前身份下检查权限、大小和内容，再决定是否更新上下文。

## 小结

Resources 用 URI 描述可读取上下文，templates 让 URI 参数化，read 返回 text 或 blob。2026-07-28 用 subscriptions/listen 统一变化通知，并用 subscriptionId 做关联；缓存和分页提高效率，但不能取代 URI 校验和访问控制。

## 快速回顾

- Resource 读上下文，Tool 做动作。
- resources/list、resources/templates/list、resources/read 都是独立的现代请求。
- URI 是标识，不是权限；file URI 必须防目录穿越。
- subscriptions/listen 替代现代 resources/subscribe 和 GET stream。
- ttlMs、cacheScope、cursor 都要按规范解释，不能当安全边界。

## 官方依据

- [Resources](https://modelcontextprotocol.io/specification/2026-07-28/server/resources)
- [Subscriptions](https://modelcontextprotocol.io/specification/2026-07-28/basic/patterns/subscriptions)
- [Pagination](https://modelcontextprotocol.io/specification/2026-07-28/server/utilities/pagination)
- [Caching](https://modelcontextprotocol.io/specification/2026-07-28/server/utilities/caching)
