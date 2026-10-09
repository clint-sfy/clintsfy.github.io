---
title: Sandbox、最小权限与审计
author: 阿源
date: 2026/10/09 00:00
categories: [Agent 开发]
tags: [Sandbox, Permission, Audit]
status: 正文
chapter: 10
---

# Sandbox、最小权限与审计

## 学习目标

- 能说明 Sandbox 解决什么问题，以及它不能保证什么。
- 能用 capability allowlist、资源范围、租约和主体身份落实最小权限。
- 能区分“能调用工具”和“工具能访问哪些资源”。
- 能设计带清理、恢复、人工接管和防篡改线索的审计记录。

## 前置知识

需要理解 [Prompt Injection 与数据泄露](./05-Prompt-Injection与数据泄露) 和第 04 章的 DangerousOperation。本文的 Python 示例只模拟策略评估，不在本机执行命令。

## 核心知识点

### Sandbox 的职责

Sandbox 是把不可信代码、工具和文件操作放在受限制环境中运行的机制。隔离层可能包括容器、虚拟机、操作系统权限、独立工作区、网络出口和资源配额。

它主要降低：

- 文件越界读取和写入。
- 未授权网络连接。
- 进程、线程、CPU、内存和磁盘消耗。
- 工具之间的相互污染。
- 代码执行对宿主环境的影响。

Sandbox 不是绝对安全边界。内核、运行时、挂载、凭据、网络服务、供应链和配置错误都可能产生逃逸或旁路。高风险场景仍需要隔离主机、短期凭据、出口策略和人工审批。

### Least Privilege

最小权限原则要求主体只获得完成当前任务所需的最小能力、资源范围和时间。它不是“给一个 admin 工具再让模型自律”，而是每次调用都明确：

- subject：哪个用户、租户、Agent Run 或插件。
- capability：例如 filesystem.read、filesystem.write、network.fetch。
- resource：哪个路径、域名、数据库表或对象。
- operation：read、write、delete、send。
- expiry：能力何时失效。
- approval：是否需要用户同意。

能力列表和资源范围都要由运行时持有。模型提出的 owner_id、role=admin 或 path=all 只能当作不可信参数。

### Capability Allowlist 与 Denylist

Allowlist 明确列出可以做什么，默认拒绝未列出的能力；denylist 只列出已知危险项，容易遗漏新能力和别名。安全边界应优先 allowlist，再为明确的高风险模式加 deny 规则。

能力名称要稳定、可审计，避免“万能 execute”这类难以细分的入口。把 delete、write、network 和 secret.read 分开，便于审批、配额和事故响应。

### 租约、撤销和时间边界

能力租约是带过期时间的授权记录。长任务中，授权可能被用户撤销、租户状态可能变化、资源可能被删除；执行器不能只在 Run 开始时检查一次。

每次危险调用前至少重新确认：

- 租约未过期且未撤销。
- Run、用户、租户仍然有效。
- 资源归属和范围仍然匹配。
- 参数摘要和审批绑定的版本没有变化。

重试也要重新过授权检查，不能复制上一次的 allow 结果。

### 审计记录

审计记录回答“谁在什么时候，以什么能力，对什么资源，提出了什么动作，策略如何决定，实际结果是什么”。推荐字段：

~~~text
audit_id, trace_id, run_id, actor, tenant, capability, resource,
request_digest, policy_version, approval_id, decision, outcome, timestamp
~~~

审计事件应追加写入，限制普通 Agent、插件和业务服务的删除或修改权限。它不必保存所有敏感原文，但要能关联到受控证据存储。审计数据的读取和导出也要审计。

路径边界不能依赖 PurePosixPath 的字符串或词法父子关系；包含 .. 时，词法判断可能与实际文件位置不一致。应从可信根目录出发 resolve，再用 relative_to 判断；符号链接、挂载点和 TOCTOU 仍由 Sandbox 执行器在打开或执行瞬间再次校验。

### 清理、恢复与人工接管

任务结束或超时后，必须回收临时目录、进程、网络凭据、文件锁和租约。清理要幂等，即重复执行不会破坏恢复所需的检查点。

当检测到逃逸迹象、未知网络目的地、权限冲突、资源爆炸或审计断裂时，应暂停 Agent、撤销租约、保留现场并交给人工。不要为了“自动完成”而继续扩大权限。

## 从意图到执行的安全链

~~~mermaid
flowchart TD
    Intent["模型候选动作"] --> Normalize["参数规范化<br/>路径/域名/对象"]
    Normalize --> Policy["Capability + Resource Policy"]
    Policy --> Lease{"租约与审批有效？"}
    Lease -->|否| Deny["拒绝并审计"]
    Lease -->|是| Sandbox["Sandbox / 隔离执行器"]
    Sandbox --> Limit["CPU/内存/时间/网络配额"]
    Limit --> Result["结果与清理"]
    Result --> Audit["追加审计事件"]
    Audit --> Release["回填可信 Observation"]
    Sandbox -->|逃逸/异常| Incident["撤销能力与人工接管"]
    classDef core fill:transparent,stroke:currentColor,color:currentColor,stroke-width:1px;
    class Intent,Normalize,Policy,Lease,Deny,Sandbox,Limit,Result,Audit,Release,Incident core;
~~~

阅读顺序是从模型候选向下走到执行器：每一层都可以拒绝，但只有 Sandbox 和资源配额能限制已经进入执行过程的代码。审计不授权，授权也不替代清理。

## 一个最小的能力策略与审计示例

用途：下面的例子模拟路径规范化、能力 allowlist、过期租约和追加审计。它不执行文件操作，用来理解检查应该发生在工具真正执行之前。

~~~python
from dataclasses import dataclass
from datetime import datetime, timedelta, timezone
from pathlib import Path


@dataclass(frozen=True)
class Lease:
    subject: str
    capabilities: frozenset[str]
    expires_at: datetime


SANDBOX_ROOT = Path("/workspace").resolve()


def resolve_sandbox_path(raw_path):
    candidate = (SANDBOX_ROOT / raw_path).resolve()
    try:
        candidate.relative_to(SANDBOX_ROOT)
    except ValueError:
        return None
    return candidate


def authorize(lease, capability, path, now):
    if lease.expires_at <= now:
        return False, "租约已过期"
    if capability not in lease.capabilities:
        return False, "能力不在 allowlist"
    if resolve_sandbox_path(path) is None:
        return False, "资源不在工作区"
    return True, "允许"


def audit(event):
    print({
        "event": event["event"],
        "subject": event["subject"],
        "capability": event["capability"],
        "resource": event["resource"],
        "decision": event["decision"],
    })


now = datetime.now(timezone.utc)
lease = Lease("run-7", frozenset({"filesystem.read"}), now + timedelta(minutes=5))
allowed, reason = authorize(lease, "filesystem.read", "/workspace/readme.md", now)
audit({
    "event": "capability.check",
    "subject": lease.subject,
    "capability": "filesystem.read",
    "resource": "/workspace/readme.md",
    "decision": reason,
})
print(allowed)
# 输出：{'event': 'capability.check', 'subject': 'run-7', 'capability': 'filesystem.read', 'resource': '/workspace/readme.md', 'decision': '允许'}
# 输出：True
print(authorize(lease, "filesystem.read", "/workspace/../secret.txt", now))
# 输出： (False, '资源不在工作区')
~~~

示例只验证了词法后的可信根目录；它没有处理真实的符号链接、挂载、Windows 路径、网络代理和容器逃逸。生产策略必须使用经过验证的执行器和平台隔离，不能把 Path.resolve 当作完整 Sandbox；执行器还要在打开文件时再次检查符号链接和挂载边界。

## 防御边界和不能保证之处

### 可以保证的边界

在正确配置和可信执行器前提下，可以把能力细分、限制资源、缩短凭据有效期、阻断未授权调用、回收临时环境，并提供审计线索。

### 不能单独保证的事情

- Sandbox 不能保证内核和虚拟化层绝不会有漏洞。
- Allowlist 不能保证一个被允许的工具不会有逻辑漏洞。
- 审计不能阻止副作用，只能帮助发现和追责。
- 最小权限不能弥补错误的资源归属判断。
- 容器退出不等于外部副作用被回滚，邮件、支付和远程提交仍需业务补偿。

安全设计应明确假设、边界和失效时的动作，而不是只写“在沙箱运行”。

## 源码阅读锚点

- Python subprocess/容器执行器：查环境变量、工作目录、挂载、网络和超时如何传递。
- OpenAI Agents SDK：对照 tool approval、guardrail 和 tracing，看授权决定是否与工具执行绑定。
- MCP：区分协议层 Server 能力和 Host 实际授予的用户/租户能力。
- DeepSeek Harness：关注 Plugin、Session 和 Workspace 的资源边界、凭据生命周期和清理路径。

## 易混点

- **Sandbox 不等于权限策略**：Sandbox 限制执行环境，Policy 决定当前动作能否执行。
- **工具 allowlist 不等于资源 allowlist**：允许 read_file 仍要限制路径、租户和对象。
- **审计不等于日志**：审计要有主体、资源、策略和结果，且要限制篡改。
- **撤销租约不等于撤销已发生副作用**：需要查询、补偿或人工处理。
- **重试不继承旧授权**：每次重试都要重新验证状态和审批绑定。

## 课后小问（含解析）

### 问题 1：为什么 execute 这种万能工具危险？

**答案**：它把多个能力、资源和副作用隐藏在一个入口中，难以做到最小授权和精确审计。

**解析**：文件读取、写入、网络和进程控制应拆分，分别设置参数、资源和审批策略。工具越泛化，模型被诱导后的影响面越大。

### 问题 2：容器销毁后，为什么不能说系统已经回滚？

**答案**：外部服务的副作用不会因为本地容器销毁而自动消失。

**解析**：邮件、远程提交、支付和数据库写入需要幂等查询、业务补偿或人工确认。Sandbox 只负责本地执行环境。

### 问题 3：审计记录丢失时应该继续执行吗？

**答案**：高风险动作应暂停或失败关闭。

**解析**：审计断裂意味着无法证明策略、审批和实际结果，继续执行会扩大不可追踪的影响。低风险动作也应产生告警并保留降级原因。

## 本节小结

Sandbox、最小权限、租约和审计分别解决隔离、授权时空范围、追踪取证问题。能力与资源必须拆开、执行前再次校验，失败或审计断裂时要撤销能力和人工接管；这些措施降低影响面，但不能保证没有平台漏洞或业务副作用。

## 快速回顾

- 能解释 Sandbox、Capability、Resource、Lease 和 Audit 的关系。
- 能判断一个工具是否违反最小权限。
- 能说明为什么重试、清理和审计都需要明确策略。
- 下一篇把这些观测与防御知识放进生产故障排查顺序。

## 官方依据

- [OWASP LLM Top 10](https://genai.owasp.org/llm-top-10/)
- [NIST AI Risk Management Framework](https://www.nist.gov/itl/ai-risk-management-framework)
- [OpenAI Agents SDK tool approval](https://openai.github.io/openai-agents-python/tools/)
- [MCP 2026-07-28 security best practices](https://modelcontextprotocol.io/specification/2026-07-28/basic/security_best_practices)
