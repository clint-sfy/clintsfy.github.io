---
title: Guardrail、输入输出与工具校验
author: 阿源
date: 2026/10/09 00:00
categories: [Agent 开发]
tags: [Guardrail, Validation, Safety]
status: 正文
chapter: 10
---

# Guardrail、输入输出与工具校验

## 学习目标

- 能区分输入 Guardrail、输出 Guardrail 和工具执行前校验。
- 能把 Schema 校验、业务规则、能力授权和人工审批放在正确位置。
- 能设计失败关闭、重试、澄清和升级人工的处理方式。
- 明白 Guardrail 是安全边界的一层，不能替代沙箱、最小权限和审计。

## 前置知识

需要理解 [确定性断言与 LLM-as-Judge](./03-确定性断言与LLM-as-Judge) 以及第 04 章的 ToolCall、Permission 和 DangerousOperation。示例使用 Python 标准库，不调用真实模型。

## 核心知识点

### Guardrail 是什么

Guardrail 是运行时在关键边界上执行的约束、检查和处置逻辑。它不等于一条系统提示词，也不等于让模型“自觉遵守”。真正的 Guardrail 必须能在不信任模型输出的情况下阻断或降级。

常见边界有三处：

1. 输入边界：任务进入 Agent 前，识别不允许的请求、租户范围、格式和风险。
2. 输出边界：答案交付用户前，检查格式、敏感信息、事实来源和业务状态。
3. 工具边界：模型提出 ToolCall 后、产生副作用前，校验参数、能力、资源和审批。

Guardrail 的结果不应只有 pass/fail，还应包含 reason、policy_id、evidence、action（block、ask、escalate、allow）和审计关联 ID。

### InputGuardrail

输入 Guardrail 保护系统免受明显不符合范围的任务和恶意输入。它可以检查：

- 用户和租户身份是否有效。
- 请求大小、编码、附件类型和资源范围。
- 是否包含高风险操作意图，需要先确认。
- 是否超出产品服务范围。

输入检查不能证明后续内容安全。网页、文档、工具结果都可能在进入上下文后带来间接注入，因此还要在资源和工具边界重复检查。

### OutputGuardrail

输出 Guardrail 在最终交付前检查结果是否符合契约。结构化输出应先解析再检查业务条件；文本输出则可检测秘密、个人信息、内部提示和未经证实的承诺。

当输出不通过时，处置方式可能是：

- 重新生成：只适合低风险格式错误，并设置次数上限。
- 澄清：缺少事实或用户选择时，不要让模型猜。
- 部分交付：隐藏未经核实或敏感部分，并明确限制。
- 升级人工：高影响决策、外发动作或规则冲突。
- 阻断：发现秘密外泄、越权或违反硬契约。

### ToolValidation

工具校验至少分四层：

- Schema：类型、必填项、枚举、长度和格式。
- 业务规则：金额范围、资源归属、状态迁移和幂等键。
- Capability：当前运行是否拥有调用此工具和访问此资源的能力。
- Approval：删除、支付、发信、部署等副作用是否需要用户同意。

Schema 通过只说明“参数形状正确”，不能说明“调用者有权对这个对象执行操作”。能力校验通过也不等于资源一定存在，执行后仍要记录真实结果。

### 失败关闭与恢复

安全不确定时默认失败关闭（fail closed）：拒绝调用、暂停运行或升级人工，而不是让模型猜一个允许的值。低风险、无副作用的格式问题可以自动修复，但要有次数和时间预算。

恢复必须明确是否重新执行：

- Schema 错误：返回结构化错误，让模型改参数。
- 权限拒绝：不要重试同一调用，应请求授权或换成只读能力。
- 超时：只有工具声明幂等且可查询状态时才重试。
- 审批拒绝：结束该分支，不能把拒绝改写成同意。

## 三道 Guardrail 的数据流

~~~mermaid
flowchart LR
    Input["用户输入"] --> In["Input Guardrail"]
    In -->|通过| Model["模型/策略"]
    In -->|拒绝或澄清| Stop["停止或询问"]
    Model --> Proposed["候选 ToolCall / Answer"]
    Proposed --> ToolCheck["Schema + 业务 + Capability"]
    ToolCheck -->|需审批| Approval["用户审批"]
    Approval -->|同意| Execute["执行工具"]
    Approval -->|拒绝| Deny["记录拒绝"]
    ToolCheck -->|不可执行| Deny
    Execute --> Observe["可信 Observation"]
    Observe --> Model
    Model --> Output["Output Guardrail"]
    Output -->|通过| Deliver["交付"]
    Output -->|失败| Repair["修复/澄清/人工"]
    classDef core fill:transparent,stroke:currentColor,color:currentColor,stroke-width:1px;
    class Input,In,Model,Proposed,ToolCheck,Approval,Execute,Deny,Observe,Output,Deliver,Repair,Stop core;
~~~

图中的 ToolCheck 必须位于真正的 Execute 之前；把校验放在模型提示里，不能替代运行时检查。Output Guardrail 只保护交付，不会撤销已经发生的工具副作用。

## 一个最小的 Guardrail 管道

用途：下面的例子把输入检查、工具参数检查、审批和输出检查串成一条失败可解释的管道。它演示拒绝逻辑，不会访问真实文件或网络。

~~~python
from dataclasses import dataclass


@dataclass(frozen=True)
class Decision:
    action: str
    reason: str
    policy_id: str


def input_guardrail(text):
    if len(text) > 200:
        return Decision("block", "输入过长", "input.length.v1")
    return Decision("allow", "输入格式可接受", "input.length.v1")


def validate_tool_call(call, allowed_capabilities):
    required = {"path", "content"}
    arguments = call.get("arguments", {})
    if call.get("name") != "write_file":
        return Decision("block", "工具不在白名单", "tool.allowlist.v1")
    if not required <= arguments.keys():
        return Decision("block", "缺少 path 或 content", "tool.schema.v1")
    if "filesystem.write" not in allowed_capabilities:
        return Decision("escalate", "当前运行没有写文件能力", "tool.capability.v1")
    if not arguments["path"].startswith("/workspace/"):
        return Decision("block", "路径不在工作区", "tool.path.v1")
    return Decision("ask", "写文件是副作用，需要审批", "tool.approval.v1")


def output_guardrail(answer):
    if "Authorization:" in answer or "api_key=" in answer:
        return Decision("block", "输出疑似包含秘密", "output.secret.v1")
    return Decision("allow", "输出通过交付检查", "output.secret.v1")


print(input_guardrail("请读取项目配置").action)
call = {"name": "write_file", "arguments": {
    "path": "/workspace/demo.txt", "content": "hello",
}}
print(validate_tool_call(call, {"filesystem.write"}).action)
print(output_guardrail("已完成，未展示凭据。").action)
# 输出：allow
# 输出：ask
# 输出：allow
~~~

这个例子没有把 ask 当成 allow；真实运行时应暂停执行、展示清晰的动作和资源范围，收到用户同意后才进入 Execute。

## 业务规则与能力授权不要混在一起

Schema 校验函数回答“参数长什么样”，授权策略回答“当前主体能不能做”，业务规则回答“现在做是否合理”。三者混在一个大函数中，会导致测试难写、审计不清和绕过风险。

建议保留独立结果：

~~~text
schema: valid
business: allowed
capability: denied
approval: not_requested
~~~

只要其中一个硬边界拒绝，就不能把总结果写成 allowed。对于多租户系统，资源归属必须使用服务端解析的主体和资源信息，不能相信模型在参数中传来的 owner_id。

## 源码阅读锚点

- OpenAI Agents SDK：对照 input/output guardrail 的触发时机和 tripwire 行为，注意 guardrail 是否覆盖工具执行。
- LangGraph：观察节点、条件边和 interrupt 如何表达审批与恢复。
- MCP SDK：把工具 inputSchema 看作协议层结构约束，另行寻找 Host 的权限与用户同意策略。
- DeepSeek Harness：从 Plugin/Hook 的执行顺序定位输入、工具和输出检查，确认失败如何传播到 Driver。

## 易混点

- **系统提示不是 Guardrail**：提示可指导模型，运行时检查才有阻断能力。
- **Schema 通过不等于授权通过**：形状正确的参数仍可能越权。
- **输出被拦截不等于副作用被撤销**：工具动作需要在执行前控制。
- **重试不等于恢复**：权限拒绝、审批拒绝和非幂等副作用不能盲重试。
- **fail closed 不等于永远拒绝**：低风险可自动修复，高风险应暂停、澄清或人工接管。

## 课后小问（含解析）

### 问题 1：为什么写文件工具必须在执行前检查路径？

**答案**：执行后再检查已经可能造成越权写入。

**解析**：模型提供的路径是不可信输入。应先做规范化、工作区边界、租户归属和能力校验，再交给执行器；输出 Guardrail 无法撤销已写入的数据。

### 问题 2：Guardrail 检查失败后是否总是重新调用模型？

**答案**：不是。

**解析**：格式错误可以把结构化错误回填并限次修复；权限或审批拒绝应停止该动作；高风险情形要升级人工。统一重试会造成循环和重复副作用。

### 问题 3：为什么审批结果必须是独立事件？

**答案**：因为模型的候选动作和用户的授权决定是两件事。

**解析**：独立事件可以证明谁在什么时间批准了哪个资源、哪个参数和哪个版本的策略，也能区分用户拒绝后模型是否继续尝试。

## 本节小结

Guardrail 位于输入、工具和输出三个边界，分别保护进入系统、产生副作用和交付用户的过程。结构 Schema、业务规则、能力授权和用户审批必须分层，安全不确定时默认失败关闭；恢复策略要根据错误类型决定澄清、有限修复、人工接管或停止。

## 快速回顾

- 能说出 InputGuardrail、OutputGuardrail 和 ToolValidation 的职责。
- 能解释 Schema、业务、Capability 和 Approval 的区别。
- 能判断一个失败应该修复、澄清、升级还是阻断。
- 下一篇将讨论不可信内容如何通过 Prompt Injection 影响决策并导致数据泄露。

## 官方依据

- [OpenAI Agents SDK guardrails](https://openai.github.io/openai-agents-python/guardrails/)
- [JSON Schema validation](https://json-schema.org/learn/getting-started-step-by-step)
- [MCP Tools](https://modelcontextprotocol.io/specification/2025-06-18/server/tools)
