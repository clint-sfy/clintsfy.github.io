---
title: Trace、Span 与事件日志
author: 阿源
date: 2026/10/09 00:00
categories: [Agent 开发]
tags: [Evals, Tracing, Observability]
status: 正文
chapter: 10
---

# Trace、Span 与事件日志

## 学习目标

- 能从一次 Agent 运行中区分 Trace、Span、Event 和普通应用日志。
- 能用关联 ID、父子关系、状态和时间把一次失败串起来。
- 知道哪些字段适合记录，哪些字段必须脱敏或禁止进入日志。
- 能从事件轨迹定位“模型决定错了、工具执行错了，还是上下文回填错了”。

## 前置知识

需要理解第 02–09 章的 Agent Loop、Tool、Workflow、状态和失败边界。本文不要求安装 OpenTelemetry；示例用 Python 标准库演示观测数据模型。

## 核心知识点

### 为什么 Agent 需要一条可关联的轨迹

普通请求通常可以用一条 access log 描述，但 Agent 一次运行可能包含多轮模型请求、多个并行工具、审批、重试和异步回填。只看最后的错误消息，很难判断失败发生在决策、执行还是数据拼接阶段。

可观测性（Observability）的目标不是“把所有东西都打印出来”，而是让系统能根据外部信号推断内部状态。对 Agent 来说，最小信号通常包括：

- Trace：一次用户任务或一次端到端运行。
- Span：Trace 中一个有开始、结束和状态的操作区间，例如模型请求或工具调用。
- Event：Span 内发生的离散事实，例如收到 delta、触发重试、用户拒绝审批。
- Metric：聚合后的数值，例如成功率、P95 延迟、token 数。
- Log：面向检索的文本或结构化记录；它可以挂在 Span 上，但不等于 Span。

### Trace、Span 与 Event 的边界

Trace 是查询入口，通常拥有一个 trace_id。Span 是有时长的工作单元，拥有 span_id 和 parent_span_id；父 Span 结束后，子 Span 的结果应该已经被汇总或明确标记为未完成。Event 没有独立的持续时间，适合记录某一瞬间的事实。

例如一次“总结仓库”的运行可以拆成：

1. root span：接收用户任务，记录最终状态。
2. model span：发送上下文并接收模型响应。
3. tool span：执行文件搜索。
4. event：tool 参数校验失败。
5. model span：把错误回填，再让模型决定是否改写参数。

把每一行都建成 Span 会导致轨迹过细、存储变贵；把所有内容写成一条日志又会丢失层级和持续时间。建模时应围绕“一个可独立计时、重试、授权和诊断的操作”划分 Span。

### Correlation ID 与业务 ID

Correlation ID 是跨组件串联同一请求的标识。trace_id 适合观测系统，业务系统还可能有 user_id、conversation_id、run_id、tool_call_id。它们用途不同，不应互相替代：

- trace_id：查一次完整运行。
- run_id：查 Agent 运行状态或恢复记录。
- conversation_id：查一个会话的多次运行。
- tool_call_id：把模型提出的调用与实际执行对应起来。

ID 不应由用户任意传入后直接当作可信租户边界。外部 request_id 可以作为原始字段保存，但服务端应生成自己的内部关联 ID。

### Span 的关键属性

每个 Span 至少需要：

- name：稳定、低基数的操作名，例如 tool.search_files，不要把完整文件名拼进 name。
- start_time、end_time 或 duration_ms：用于定位慢点。
- status：ok、error 或 cancelled。
- parent_span_id：保持层级关系。
- attributes：模型名、工具名、输入大小、输出大小、重试次数等。
- error.type、error.message：结构化错误摘要，不直接塞完整敏感堆栈。

高基数值（完整 prompt、文件路径、用户输入）不宜作为指标标签；它们可以在受控事件或关联存储中保存，并设置权限、保留期和脱敏策略。

### Event Log 应该记录什么

Event Log 记录“已经发生且可验证”的事实，例如 model.requested、tool.started、tool.completed、approval.denied、run.failed。不要把模型写在文本中的“我已经发送邮件”当作事件；只有真实执行器返回成功后，才能记录 email.sent。

推荐采用结构化字段：

~~~text
timestamp, trace_id, run_id, span_id, event_name, actor, status,
tool_call_id, attempt, input_digest, output_digest, policy_decision
~~~

input_digest 是输入摘要或哈希，方便判断两次请求是否相同；它不能替代必要的取证内容，也不能把密码的原文哈希当成安全存储。事件还应区分 actor=model、actor=runtime、actor=user，避免把候选动作和实际动作混在一起。

### 脱敏、采样与成本

观测本身也可能造成泄露。默认策略应当是：

- 不记录 API key、Cookie、Authorization、密码和完整身份证件等秘密。
- prompt、工具参数、资源内容按来源和权限分级；必要时只存摘要、字段名或哈希。
- 错误堆栈保留路径时要考虑租户、主机和密钥参数。
- 采样针对低风险成功 Trace；错误、拒绝、越权和安全事件应提高采样率或强制保留。
- 记录观测数据的访问、导出和删除事件。

这不是“把日志删光”的理由。目标是用最少的字段恢复因果链，并让真正需要阅读原文的人经过额外授权。

脱敏必须覆盖所有观测入口，而不是只处理 Event。attributes、事件字段和异常摘要都要走同一个递归脱敏函数；异常消息默认只保留类型和固定摘要，不能把原始异常文本写入观测系统。敏感键至少包括 api_key、token、cookie、secret、password、authorization 及其常见连字符或下划线变体。

## 一张图看清数据流

~~~mermaid
flowchart LR
    User["用户任务"] --> Run["Run / Trace"]
    Run --> Root["Root Span"]
    Root --> Model["Model Span"]
    Root --> Tool["Tool Span"]
    Model --> Event["Event: decision / retry"]
    Tool --> Event2["Event: validation / result"]
    Root --> Metric["Metrics: latency / cost / success"]
    Event --> Store["受控观测存储"]
    Event2 --> Store
    Metric --> Dashboard["诊断与告警"]
    classDef core fill:transparent,stroke:currentColor,color:currentColor,stroke-width:1px;
    class User,Run,Root,Model,Tool,Event,Event2,Store,Metric,Dashboard core;
~~~

阅读这张图时，先沿 Trace 看一次运行，再进入 Span 看耗时和层级，最后用 Event 看具体转折。Metric 只告诉你“哪一类问题变多”，不能单独解释某一次失败。

## 一个标准库实现：生成可检索的 Agent 轨迹

用途：下面的例子实现最小 Trace/Span/Event 模型，并演示工具失败如何被记录。它不连接外部观测平台，但输出字段已经接近真实 SDK 要发送的结构。

~~~python
from contextlib import contextmanager
from dataclasses import dataclass, field
from time import perf_counter
from typing import Optional
from uuid import uuid4


def new_id(prefix):
    return f"{prefix}_{uuid4().hex[:8]}"


SENSITIVE_KEY_NAMES = {
    "api_key", "apikey", "access_token", "refresh_token", "token",
    "cookie", "set_cookie", "authorization", "password", "secret",
    "secret_key", "private_key",
}


def is_sensitive_key(key):
    normalized = str(key).lower().replace("-", "_")
    return (
        normalized in SENSITIVE_KEY_NAMES
        or "cookie" in normalized
        or normalized.endswith(("_token", "_secret", "_password", "_key"))
    )


def redact(value):
    if isinstance(value, dict):
        return {
            key: ("***" if is_sensitive_key(key) else redact(item))
            for key, item in value.items()
        }
    if isinstance(value, list):
        return [redact(item) for item in value]
    if isinstance(value, tuple):
        return tuple(redact(item) for item in value)
    return value


@dataclass
class Span:
    name: str
    trace_id: str
    parent_span_id: Optional[str]
    span_id: str = field(default_factory=lambda: new_id("span"))
    status: str = "ok"
    events: list[dict] = field(default_factory=list)
    attributes: dict = field(default_factory=dict)


class Trace:
    def __init__(self, name):
        self.trace_id = new_id("trace")
        self.name = name
        self.spans = []

    @contextmanager
    def span(self, name, parent=None, **attributes):
        current = Span(name, self.trace_id, parent.span_id if parent else None)
        current.attributes.update(redact(attributes))
        self.spans.append(current)
        started = perf_counter()
        try:
            yield current
        except Exception as exc:
            current.status = "error"
            current.events.append(redact({
                "name": "exception",
                "type": type(exc).__name__,
                "message": "redacted",
            }))
            raise
        finally:
            current.attributes["duration_ms"] = round((perf_counter() - started) * 1000, 3)

    def event(self, span, name, **fields):
        span.events.append({"name": name, **redact(fields)})

    def export(self):
        return {
            "trace_id": self.trace_id,
            "name": self.name,
            "spans": [
                {
                    "span_id": span.span_id,
                    "parent_span_id": span.parent_span_id,
                    "name": span.name,
                    "status": span.status,
                    "attributes": span.attributes,
                    "events": span.events,
                }
                for span in self.spans
            ],
        }


trace = Trace("summarize_repository")
with trace.span("agent.run", user_id="user-7", api_key="secret-key", cookie="session-value") as root:
    trace.event(root, "model.requested", model="demo-model", token="secret-token")
    with trace.span("tool.search_files", root, tool_name="search_files") as tool:
        trace.event(tool, "tool.started", query="*.py", authorization="Bearer hidden")
        trace.event(tool, "tool.completed", result_count=3)
    try:
        with trace.span("tool.failing", root) as failing:
            raise RuntimeError("raw secret should never enter the trace")
    except RuntimeError:
        pass

record = trace.export()
print(record["name"], len(record["spans"]))
print(record["spans"][1]["events"][0])
# 输出：summarize_repository 3
# 输出：{'name': 'tool.started', 'query': '*.py', 'authorization': '***'}
print(record["spans"][0]["attributes"]["api_key"])
# 输出：***
print(record["spans"][2]["events"][0])
# 输出：{'name': 'exception', 'type': 'RuntimeError', 'message': 'redacted'}
~~~

代码里的 Trace.span 只负责观测，不负责执行工具或授予权限。真实系统应在运行时执行成功后再写 tool.completed；如果工具抛异常，Span 状态为 error，根 Trace 可以根据异常类型决定重试、恢复或交付失败，但不能把异常原文直接写进事件。

## 从一条轨迹定位失败

### 先看 Trace 是否完整

如果只有 model.requested 没有 model.completed，先判断进程崩溃、超时、网络断开还是观测导出失败。没有结束事件不等于模型没有返回，观测管道本身也可能丢数据。

### 再看 Span 的层级与时间

父 Span 的总耗时减去子 Span 耗时，常常能发现排队、序列化、权限检查或回填等“未命名时间”。并行工具应有相同父 Span，而不是互相伪造父子关系。

### 最后用 Event 判断状态转移

沿 decision.proposed → policy.checked → tool.started → tool.completed → observation.appended 检查是否缺边。模型提出调用但没有 policy.checked，说明安全边界可能被绕过；工具完成但没有 observation.appended，说明回填或上下文更新可能丢失。

## 源码阅读锚点

- OpenTelemetry：先看 Trace、Span、Event、Attributes 和 Context 之间的接口，再看 exporter；不要先从某个框架装饰器反推语义。
- OpenAI Agents SDK：重点看 tracing 如何把 Agent、模型请求、工具调用和 handoff 组织成层级轨迹。
- LangGraph：对照节点执行、状态更新和 checkpointer 事件，寻找“状态变更发生后何时记录”。
- DeepSeek Harness：从 Driver/Session 的事件发布入口追到插件和工具执行，区分 UI 事件、模型事件和实际副作用。

## 易混点

- **Log 不等于 Trace**：日志是记录载体，Trace 是一次关联运行的结构。
- **Span 不等于函数调用**：只有需要独立计时、状态和诊断的操作才值得建 Span。
- **模型输出不等于事件事实**：候选动作必须经过执行器确认。
- **Correlation ID 不等于权限**：ID 用于关联查询，不能证明调用者拥有资源权限。
- **采样不等于删除安全审计**：拒绝、越权、密钥泄露和生产故障需要单独保留策略。

## 课后小问（含解析）

### 问题 1：为什么只打印最终回答无法定位 Agent 失败？

**答案**：最终回答丢失了中间决策、工具执行、重试和回填信息。

**解析**：同样的最终错误可能来自模型选错工具、工具超时、权限拒绝或结果没有进入下一轮。Trace 提供范围，Span 提供操作层级，Event 提供转折事实，三者合起来才有因果链。

### 问题 2：把完整用户 prompt 放到 Span 属性中是否方便？

**答案**：短期方便，生产默认不应这样做。

**解析**：prompt 可能包含秘密、个人信息和第三方数据，还会造成高基数和存储成本。应按风险分级保存，默认使用摘要、哈希、受控原文存储和访问审计。

### 问题 3：工具返回成功后可以直接记录任务完成吗？

**答案**：不可以。

**解析**：工具成功只代表这一步成功，目标是否完成还要由 Agent 读取 Observation 并判断。应分别记录 tool.completed 和 run.completed。

## 本节小结

Trace 是一次运行的查询入口，Span 表示可独立计时和诊断的操作，Event 表示已经发生的离散事实。Agent 观测的价值在于串出“决策—校验—执行—观察—回填”的因果链，而不是堆积文本日志。记录时要控制高基数、脱敏秘密、区分模型候选与真实副作用，并为错误和安全事件设置更强的保留策略。

## 快速回顾

- 能解释 trace_id、span_id、parent_span_id 和 tool_call_id 的不同作用。
- 能用 Span 的时间、状态、属性和 Event 定位一次失败。
- 能判断哪些内容应摘要、脱敏、采样或禁止记录。
- 下一篇将把可观察轨迹放进 Dataset 和回归评测，判断新版本是否真的变好。

## 官方依据

- [OpenTelemetry Traces](https://opentelemetry.io/docs/concepts/signals/traces/)
- [OpenTelemetry Logs](https://opentelemetry.io/docs/concepts/signals/logs/)
- [OpenTelemetry Python instrumentation](https://opentelemetry.io/docs/languages/python/instrumentation/)
- [OpenAI Agents SDK tracing](https://openai.github.io/openai-agents-python/tracing/)
