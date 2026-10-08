---
title: 完整可观测 Agent Loop
author: 阿源
date: 2026/10/08 00:00
categories: [Agent 开发]
tags: [Agent Loop, Trace, Span, Observability]
chapter: 04
---

# 完整可观测 Agent Loop

## 学习目标

- 把模型决策、工具校验、审批、执行、重试、回填和停止原因串成一条可回放轨迹。
- 区分 Trace、Span、RunLog 和 CostMetric 的粒度与责任。
- 设计成功、失败、PendingApproval、UnknownSideEffect、超时、取消和预算耗尽的明确终态。
- 用一个无网络、无密钥的 Python 模拟运行展示如何从失败轨迹回到测试用例。

## 前置知识

- 已完成本章前八篇，理解 ToolCall、ToolResult、RetryBudget、Approval、Permission、Sandbox 和 Audit。
- 已了解第 02 章的 AgentLoop、StopReason、Run、State，以及第 03 章的 Usage 和 EventStream。
- 本篇把前面抽象组合起来，不新增任何真实供应商 API。

## 核心知识点

可观测 Agent Loop 不只是“多打几行日志”。它要为每个决策和副作用建立稳定关联，让人能回答：模型看到了什么、提出了什么、Runtime 拒绝了什么、工具实际做了什么、为何重试、是否审批、最终为何停止。Trace 是一次 Run 的轨迹，Span 是其中一个有开始/结束的操作，RunLog 是可检索事件记录，CostMetric 是用量、延迟、重试和费用等指标。Run 可以是 running、suspended 或 closed；暂停不是成功/失败终态，只有明确 StopReason 才能关闭 Run trace。

```mermaid
flowchart TD
    Start["Run start + Trace"] --> Model["Model decision Span"]
    Model --> Parse{"ToolCall / Final / ParseError？"}
    Parse -->|Final| Success["Success terminal"]
    Parse -->|ParseError| Feedback["有限反馈"]
    Parse -->|ToolCall| Validate["Schema + allowlist + Permission"]
    Validate -->|拒绝| Failed["Failed terminal / StopReason"]
    Validate -->|需审批| PendingApproval["PendingApproval"]
    PendingApproval --> Checkpoint["checkpoint saved"]
    Checkpoint --> ApprovalSuspended["run suspended; approval span close"]
    ApprovalSuspended -->|决定到达| ApprovalDecision{"批准？"}
    ApprovalDecision -->|拒绝/过期| Failed
    ApprovalDecision -->|批准| Recheck["恢复后重新校验"]
    Recheck --> Validate
    Validate -->|通过| Execute["Tool execution Span"]
    Execute --> Outcome{"成功、可重试或未知？"}
    Outcome -->|成功| Succeeded["record tool_succeeded"]
    Succeeded --> SuccessSpanClosed["tool span close"]
    SuccessSpanClosed --> Result["ToolResult + Audit"]
    Outcome -->|可重试| Retryable["record tool_retry"]
    Retryable --> RetrySpanClosed["tool span close"]
    RetrySpanClosed --> Retry{"RetryBudget / deadline？"}
    Retry -->|允许| Execute
    Retry -->|耗尽| Failed
    Outcome -->|未知副作用| UnknownSideEffect["record unknown_side_effect"]
    UnknownSideEffect --> UnknownSpanClosed["tool span close"]
    UnknownSpanClosed --> Query["query / reconcile"]
    Query -->|已确认提交| Result
    Query -->|已确认未提交| Execute
    Query -->|仍未知| ManualIntervention["ManualIntervention"]
    ManualIntervention --> ManualSuspended["span close; run suspended"]
    Result --> Backfill["Message/State 回填"]
    Backfill --> Model
    Feedback --> Model
    Success --> StopReason["明确 StopReason"]
    Failed --> StopReason
    StopReason --> RunClosed["close Run trace + CostMetric"]

    classDef core fill:transparent,stroke:currentColor,color:currentColor,stroke-width:1px;
    class Start,Model,Parse,Success,Feedback,Validate,Failed,PendingApproval,Checkpoint,ApprovalSuspended,ApprovalDecision,Recheck,Execute,Outcome,Succeeded,SuccessSpanClosed,Retryable,RetrySpanClosed,Retry,Result,UnknownSideEffect,UnknownSpanClosed,Query,ManualIntervention,ManualSuspended,Backfill,StopReason,RunClosed core;
```

阅读提示：PendingApproval 会 checkpoint 并 suspend，决定到达后重新校验；UnknownSideEffect 只能 query/reconcile 或转 ManualIntervention。只有带明确 StopReason 的 Success/Failed 才 close Run trace，暂停路径只 close 对应 span。

### Trace：一次 Run 的关联容器

Trace 通常绑定 run_id、subject、目标摘要、开始/结束时间和终态。它不应保存未经脱敏的所有 Prompt 或凭证；完整输入可按安全策略引用到受控存储，模型 Context 与审计视图可以不同。`PendingApproval` 和 `ManualIntervention` 只把 Run 标成 suspended 并保存 checkpoint，不写结束时间或伪造终态。

### Span：一个有边界的操作

Span 适合表示一次模型请求、参数校验、审批等待、工具尝试、回填和人工接管。每个 Span 要有开始、结束、状态、父子关系和可检索属性；重试可以是同一工具 Span 的子 Span，也可以按系统的统计口径单独计数，但要固定口径。Approval span 可以 close 后让 Run suspended；未知副作用的工具 span 也可以 close，但 Run 要等 query/reconcile 或人工决定。

### RunLog：事件比自然语言日志更可回放

RunLog 应记录事件类型、时间、trace_id、step、call_id、状态和安全摘要，例如 tool_call_proposed、validation_rejected、approval_requested、tool_retry、tool_result、run_failed。事件字段要有版本，未知事件不可静默丢弃。

### CostMetric：用量和资源预算

CostMetric 可以包括模型调用次数、输入/输出 Token、工具尝试次数、等待时长、并发峰值和估算费用。估算不是账单事实，尤其是本地模拟和供应商计费规则不同；指标要标明来源和计算口径。

### PendingApproval：checkpoint 后暂停并恢复

PendingApproval 表示调用尚未执行，Runtime 要保存足够恢复的 checkpoint，关闭当前 approval span，并把 Run 标为 suspended。审批决定到达后，恢复流程必须重新检查参数、权限、资源版本和幂等键，再回到校验边界；批准本身不会关闭 Run trace。示例的 `resume_after_approval` 只恢复生命周期并记录 recheck，后续仍要经过校验/执行分支。

### UnknownSideEffect 与 ManualIntervention：未确认副作用不能伪装成失败

UnknownSideEffect 表示请求可能已经发出但结果不确定。Runtime 应先 query/reconcile：确认提交就复用结果，确认未提交才按契约重试；无法确认且没有原子幂等保证时转入 ManualIntervention。此时可以关闭工具/对账 span，但 Run 只保持 suspended，直到人工决定或得到明确 StopReason。

### ObservableLoop：本地完整模拟

用途：用脚本模型、一次可重试的本地工具和 Trace 记录展示成功路径，并用两个小状态轨迹展示 PendingApproval 与 UnknownSideEffect 如何 suspend；它不访问网络，也不执行危险操作。

```python
from __future__ import annotations

from dataclasses import dataclass, field
from typing import Any


class RetryableError(Exception):
    pass


FINAL_STOP_REASONS = {
    "success",
    "unknown_tool",
    "validation_error",
    "permission_denied",
    "approval_denied",
    "approval_expired",
    "tool_failed",
    "retry_budget_exhausted",
    "timeout",
    "cancelled",
    "max_steps",
    "unresolved_side_effect",
}
SUSPEND_REASONS = {"pending_approval", "unknown_side_effect", "manual_intervention"}


@dataclass
class Trace:
    trace_id: str
    events: list[str] = field(default_factory=list)
    model_calls: int = 0
    tool_attempts: int = 0
    lifecycle: str = "running"
    stop_reason: str | None = None
    suspend_reason: str | None = None

    def record(self, event: str) -> None:
        self.events.append(event)

    def close(self, stop_reason: str) -> None:
        if stop_reason not in FINAL_STOP_REASONS:
            raise ValueError(f"not a closing stop reason: {stop_reason}")
        self.stop_reason = stop_reason
        self.suspend_reason = None
        self.lifecycle = "closed"
        self.record("run_trace_closed")

    def suspend(self, reason: str) -> None:
        if reason not in SUSPEND_REASONS:
            raise ValueError(f"not a suspension reason: {reason}")
        self.suspend_reason = reason
        self.lifecycle = "suspended"
        self.record("run_suspended")

    def resume(self) -> None:
        if self.lifecycle != "suspended":
            raise ValueError("only a suspended Run can resume")
        self.suspend_reason = None
        self.lifecycle = "running"
        self.record("run_resumed")

    def summary(self, status: str) -> dict[str, Any]:
        return {
            "trace_id": self.trace_id,
            "status": status,
            "lifecycle": self.lifecycle,
            "stop_reason": self.stop_reason,
            "suspend_reason": self.suspend_reason,
            "events": list(self.events),
            "cost_metric": {
                "model_calls": self.model_calls,
                "tool_attempts": self.tool_attempts,
                "estimated_tokens": self.model_calls * 10,
            },
        }


class ScriptedModel:
    def __init__(self) -> None:
        self.turn = 0

    def generate(self, _: list[dict[str, Any]]) -> dict[str, Any]:
        self.turn += 1
        if self.turn == 1:
            return {
                "kind": "tool_call",
                "call_id": "call_1",
                "name": "get_status",
                "arguments": {"project": "demo"},
            }
        return {"kind": "final", "text": "build is green"}


class LocalStatusTool:
    def __init__(self) -> None:
        self.attempts = 0

    def run(self, arguments: dict[str, Any]) -> dict[str, str]:
        self.attempts += 1
        if self.attempts == 1:
            raise RetryableError("temporary read failure")
        return {"status": "green", "project": arguments["project"]}


def run_agent(model: ScriptedModel, tool: LocalStatusTool, max_steps: int = 3) -> dict[str, Any]:
    trace = Trace("run-demo")
    trace.record("run_started")
    messages: list[dict[str, Any]] = [{"role": "user", "content": "检查 demo"}]

    for _ in range(max_steps):
        trace.model_calls += 1
        trace.record("model_requested")
        decision = model.generate(messages)
        if decision["kind"] == "final":
            trace.record("model_final")
            trace.close("success")
            return trace.summary("completed")
        if decision.get("name") != "get_status":
            trace.record("validation_rejected")
            trace.close("unknown_tool")
            return trace.summary("failed")

        result: dict[str, str] | None = None
        for attempt in range(2):
            trace.tool_attempts += 1
            trace.record("tool_started")
            try:
                result = tool.run(decision["arguments"])
                trace.record("tool_succeeded")
                trace.record("tool_span_closed")
                break
            except RetryableError:
                trace.record("tool_retry")
                trace.record("tool_span_closed")
        if result is None:
            trace.close("retry_budget_exhausted")
            return trace.summary("failed")

        # 关键状态变化：真实 ToolResult 先回填，模型下一轮才可形成最终答案。
        messages.append({
            "role": "tool",
            "tool_call_id": decision["call_id"],
            "content": result,
        })
        trace.record("tool_result_backfilled")

    trace.close("max_steps")
    return trace.summary("failed")


def pending_approval() -> tuple[dict[str, Any], Trace]:
    trace = Trace("run-approval")
    trace.record("approval_requested")
    trace.record("checkpoint_saved")
    trace.record("approval_span_closed")
    trace.suspend("pending_approval")
    return trace.summary("waiting"), trace


def resume_after_approval(trace: Trace) -> dict[str, Any]:
    trace.record("approval_decision_received")
    trace.record("approval_recheck")
    trace.resume()
    return trace.summary("resumed")


def unknown_side_effect() -> dict[str, Any]:
    trace = Trace("run-unknown")
    trace.record("unknown_side_effect")
    trace.record("tool_span_closed")
    trace.suspend("unknown_side_effect")
    trace.record("reconcile_requested")
    trace.record("manual_intervention")
    trace.record("reconcile_span_closed")
    trace.suspend("manual_intervention")
    return trace.summary("waiting")


def unresolved_side_effect() -> dict[str, Any]:
    trace = Trace("run-unresolved")
    trace.record("unknown_side_effect")
    trace.record("tool_span_closed")
    trace.record("reconcile_requested")
    trace.record("reconcile_unresolved")
    trace.close("unresolved_side_effect")
    return trace.summary("failed")


demo = run_agent(ScriptedModel(), LocalStatusTool())
print({key: demo[key] for key in ("status", "lifecycle", "stop_reason", "suspend_reason")})
approval, approval_trace = pending_approval()
resumed = resume_after_approval(approval_trace)
assert resumed["lifecycle"] == "running"
print({key: approval[key] for key in ("status", "lifecycle", "suspend_reason")})
unknown = unknown_side_effect()
print({key: unknown[key] for key in ("status", "lifecycle", "suspend_reason")})
unresolved = unresolved_side_effect()
print({key: unresolved[key] for key in ("status", "lifecycle", "stop_reason")})
# 输出：{'status': 'completed', 'lifecycle': 'closed', 'stop_reason': 'success', 'suspend_reason': None}
# 输出：{'status': 'waiting', 'lifecycle': 'suspended', 'suspend_reason': 'pending_approval'}
# 输出：{'status': 'waiting', 'lifecycle': 'suspended', 'suspend_reason': 'manual_intervention'}
# 输出：{'status': 'failed', 'lifecycle': 'closed', 'stop_reason': 'unresolved_side_effect'}
```

示例中的 estimated_tokens 是固定的测试指标，不是任何供应商账单；真实系统应从 ModelResponse 或 Usage 事件读取实际口径。若模型返回危险 ToolCall，循环应在 validation/approval 分支终止或等待，而不能沿成功脚本继续。

### StopReason：终态必须可分类

至少区分 success、unknown_tool、validation_error、permission_denied、approval_denied、approval_expired、tool_failed、retry_budget_exhausted、timeout、cancelled、max_steps 和 unresolved_side_effect。unknown_side_effect 是 query/reconcile 前的中间状态；pending_approval、manual_intervention 是 suspended 原因，不是最终 StopReason。只有明确的 StopReason 才能关闭 Run trace；分类决定用户反馈、是否可恢复、评测断言和告警路由。

### 失败轨迹到回归测试

从一次失败 Trace 提炼测试用例时，保留最小输入、模型候选、allowlist、参数错误、审批决定、每次尝试和最终 StopReason。不要只复制最终异常字符串；需要断言关键边界没有被跳过，例如 permission_denied 后工具函数调用次数必须为零。

### 审批与重试的可观测关系

审批等待应有独立 Span 和过期时间，恢复后重新创建校验事件；等待期间 Run 是 suspended，不是 closed。重试应记录错误分类、attempt、backoff、幂等键摘要和结果复用；如果状态未知，Trace 应先进入 query/reconcile，仍无法确认则进入 manual_intervention，而不是记录为普通可重试失败。

## 源码阅读心智模型

### smolagents

先找到 Agent 的主循环和终态，再把模型调用、工具执行和异常包装映射到 Span。检查日志是否能回答“哪一个工具调用导致终止”，以及脚本/代码执行是否有独立安全事件。

### OpenAI Agents SDK

沿 Runner、工具、handoff、guardrail 和 tracing 的关系阅读。重点是一次 Run 的 span 父子层级、工具重试口径和最终输出如何与错误/等待状态区分。

### LangGraph

把每个节点和边视为可观测的状态转换，检查 checkpoint、interrupt 和重放事件能否重建 ToolCall 与审批决定。图成功结束不等于每个节点的业务副作用已确认。

### DeepSeek Harness

优先定位 Driver 的 Run 生命周期、事件总线、Plugin/Hook 的 span 注入和 Session 关联。预览期内部事件字段可能改变，应关注 trace 关联、错误传播和审计边界。

## 易混点

- **有日志不等于可观测**：缺少 trace_id、call_id、状态和顺序就无法回放。
- **Span 不等于重试次数**：一个操作可以有多个尝试，统计口径要显式。
- **成功终态不等于所有副作用已确认**：accepted、unknown 和 waiting 要单独分类；PendingApproval/ManualIntervention 只暂停 Run。
- **CostMetric 不等于账单**：模拟值和估算值必须标注来源。
- **Trace 不应保存所有秘密**：可观测性也需要脱敏、访问控制和保留期限。

## 课后小问

1. 为什么需要同时记录 model_requested 和 tool_started？

   **答案**：前者表示模型提出/请求了什么，后者表示 Runtime 确实进入了工具执行边界。

   **解析**：如果只有模型事件，无法证明副作用发生；如果只有工具事件，无法复盘为何选中该工具。二者之间的校验、审批和拒绝事件也要可见。

2. 审批被拒绝时，Trace 应该怎样结束？

   **答案**：记录 approval_requested、approval_denied；如果流程结束则用明确 StopReason 关闭 Run，若等待决定则保存 checkpoint、关闭 approval span 并保持 Run suspended，工具执行次数为零。

   **解析**：拒绝不是普通工具失败，也不应自动重试；用户需要知道是无权限、审批拒绝还是审批过期。

3. 如何从“重试三次后失败”判断是否可以继续重试？

   **答案**：检查错误分类、总 deadline、RetryBudget、幂等/未知状态和用户策略，而不是只看次数。

   **解析**：可恢复网络错误和参数错误的处理不同；副作用已发出但响应未知时，继续重试可能造成重复操作。

## 本节小结

- 完整可观测 Loop 把决策、校验、审批、执行、重试、回填和终态放进同一条关联轨迹。
- Trace、Span、RunLog 和 CostMetric 分别解决 Run 关联、操作边界、事件回放和资源统计。
- StopReason 必须区分成功、拒绝、超时、取消、预算耗尽和无法恢复的 unresolved_side_effect；unknown_side_effect 进入 query/reconcile，pending_approval/manual_intervention 是 suspended，不提前 close Run trace。
- 失败 Trace 应能被压缩成可重复的回归测试，而不是只留下自然语言日志。

## 快速回顾

- 先画事件顺序，再看每个失败边界是否有终态。
- 记录 trace_id、run_id、step、call_id、attempt 和安全摘要。
- 审批恢复后重检；重试遵守预算和幂等；未知状态先 query/reconcile，仍未知就暂停并人工接管。
- 下一章阅读[State 与 Context](/courses/agent/05-状态上下文会话与记忆/01-State与Context)，把本章产生的 ToolResult、Trace 和运行状态放进可持久化上下文。
