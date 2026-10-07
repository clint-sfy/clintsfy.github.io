---
title: Agent、Workflow 与普通程序的区别
author: 阿源
date: 2026/10/07
categories: [Agent 开发]
tags: [Agent, Workflow, Architecture]
chapter: 02
---

# Agent、Workflow 与普通程序的区别

## 学习目标

- 从控制逻辑、状态、确定性、失败处理和审计角度比较 Agent、Workflow 与普通程序。
- 知道什么时候应把 Agent 放进 Workflow，什么时候普通程序更可靠。
- 用前面学过的 Goal、Action、Observation、RunState 和 StopReason 复盘架构边界。

## 前置知识

- 已阅读本章前七篇，理解 Agent Loop、Run 生命周期、停止条件和同步/异步执行。
- 本文不把“更智能”当作架构判断标准，而是比较谁拥有控制权、谁负责验证和谁承担副作用。

## 三种控制逻辑

### 普通程序

普通程序的主要分支由开发者在代码中预先写出：输入经过条件、循环和函数调用，得到输出。它可以很复杂，也可以调用模型，但控制路径通常是可预测、可测试和可重放的。

普通程序并不等于没有状态或没有失败。数据库事务、编译器和 Web 服务都有状态与异常，只是下一步通常由显式代码决定，而不是由模型根据自然语言动态提出 Action。

### Workflow

Workflow 是一组显式的步骤、条件和状态转移，用于编排可预期的业务过程。它可以是线性流程、状态机或有分支的图；每个节点的输入、输出和失败路径都应能被设计者说明。

Workflow 的优势是可审计、可恢复和可测试。它也可以在某个节点调用 Agent，让模型只负责局部的分类、提取或决策，再由 Workflow 验证并继续。

### Agent

Agent 的控制逻辑允许 Model 根据 Goal、Instructions、Constraints 和 Observation 动态提出下一步 Action。它适合步骤数量或顺序无法完全预先写出的任务，但必须有工具白名单、预算和停止边界。

Agent 不意味着“把整个程序交给模型”。成熟架构通常把 Agent 放在受限的决策节点中，把关键授权、事务和最终提交留在普通代码或 Workflow 中。

## 维度对照

| 维度 | 普通程序 | Workflow | Agent |
| --- | --- | --- | --- |
| 下一步由谁决定 | 代码分支 | 显式节点和边 | Model 在约束内提议 |
| 主要输入 | 类型化数据和事件 | State 与节点输出 | Goal、Context、Observation |
| 可重复性 | 通常较高 | 依赖节点和外部服务 | 模型输出可能变化 |
| 副作用授权 | 代码/服务权限 | 节点和业务边界 | 必须由 Tool/Runtime 再校验 |
| 失败处理 | 异常和返回值 | 节点重试、补偿、暂停 | StopReason、预算和人工确认 |
| 审计重点 | 调用链和输入输出 | 状态转移和节点结果 | 决策、Action、Observation 和模型版本 |
| 适合的问题 | 规则明确、契约稳定 | 多步、审批、恢复流程 | 目标明确但路径开放或输入多变 |

这张表不是价值排名。若输入和规则已知，使用 Agent 反而会增加延迟、成本和不可重复性；Agent 的价值在于处理有限约束下的开放决策，而不是替代所有条件分支。

## Agent 与 Workflow 如何组合

### Workflow 包围 Agent

Workflow 可以先校验请求、加载权限，再把一个局部 Goal 交给 Agent；Agent 结束后，Workflow 验证结果并决定提交、审批或补偿。这样模型不会直接越过业务事务边界。

### Agent 选择 Workflow

Agent 可以在受限的工具集合中选择一个已定义的 Workflow，例如根据用户请求选择“查询状态”或“生成报告”流程。Agent 只选择入口和参数，Workflow 内部仍由显式代码控制。

### 普通程序包围副作用

无论模型如何决定，写数据库、发送付款或修改生产配置都应由普通程序执行，并做幂等、授权和 Postcondition 检查。Agent 负责推荐行动，不应拥有绕过这些服务边界的后门。

### 何时拆成多个 Agent

拆分多个 Agent 不是默认优化。只有当角色、权限、上下文或责任边界确实不同，且协调成本可接受时，才考虑将决策任务分开；否则一个受限 Agent 加 Workflow 通常更容易追踪。

## 一个同一任务的三种实现

下面的代码用“根据状态决定下一步”的小任务对比普通程序、Workflow 和 Agent 风格；Agent 版本仍然使用固定工具和步数上限，避免把开放决策误写成无限循环。

```python
from dataclasses import dataclass


@dataclass(frozen=True)
class Observation:
    status: str


def ordinary_program(observation: Observation) -> str:
    if observation.status == "green":
        return "publish report"
    return "open incident"


def workflow(observation: Observation) -> str:
    state = "check"
    if state == "check" and observation.status == "green":
        state = "report"
    elif state == "check":
        state = "incident"
    return state


def bounded_agent(observation: Observation, allowed_actions: set[str]) -> str:
    candidates = {
        "green": "publish report",
        "red": "open incident",
    }
    action = candidates.get(observation.status, "ask for status")
    if action not in allowed_actions:
        # 约束边界：模型或策略提出的动作不在白名单时必须拒绝。
        return "rejected"
    return action


observation = Observation("green")
print(ordinary_program(observation))
print(workflow(observation))
print(bounded_agent(observation, {"publish report", "open incident"}))
# 输出：publish report
# 输出：report
# 输出：publish report
```

普通程序和 Workflow 的下一步在代码中显式可见；bounded_agent 可以把 candidates 替换成模型提议，但仍然需要白名单、预算和结果验证。三种实现都可以是正确的，选择取决于路径是否开放和边界是否可验证。

### 用普通程序承载确定性规则

状态映射、格式校验、权限判断、计费和事务提交应优先使用普通程序。规则越重要、越需要可重复，越不应该只依赖模型文本。

### 用 Workflow 承载长流程

审批、等待外部回调、补偿和人工接管适合用 Workflow 表达。Workflow 可以把 waiting、failed、completed 作为显式状态，并让每个节点拥有清楚的重试和恢复策略。

### 用 Agent 处理开放决策

输入分类、从非结构化材料提取字段、在受限工具中选择调查顺序等问题，可能适合 Agent。即使如此，输出也应转成结构化 Action，通过工具和 Constraints 执行。

### 用混合边界减少风险

常见的可靠边界是：普通程序校验输入 → Workflow 调度 → Agent 提议局部 Action → Tool 执行并回传 Observation → Workflow 验证 Postcondition → 普通程序提交结果。每层都能独立测试和审计。

## 源码阅读时判断抽象层

### 找动态决策点

如果下一步来自 Model 输出或策略解析，那里是 Agent 边界。继续看它是否受限于 Tool registry、schema、Guardrail 和预算；动态决策本身不等于安全或高质量。

### 找显式状态图

如果代码有固定的节点、边、状态枚举和条件转移，它更接近 Workflow。即使节点内调用模型，也要把节点外的调度和模型内的局部决策分开。

### 找业务事务边界

数据库提交、发送请求和权限检查通常属于普通程序或服务层。若它们直接在模型回调中执行且没有独立的 Postcondition/幂等处理，应视为需要改进的边界。

### 找可重放与审计机制

普通程序和 Workflow 常通过输入、状态和事件重放；Agent 还要记录模型版本、Instructions、候选 Action、Observation 和工具结果。缺少这些记录时，无法解释同一个 Goal 为什么走了不同路径。

## 与主线项目的对应关系

### smolagents

smolagents 主要展示 Agent Loop 和工具执行。将它放进更大应用时，文件、网络和业务提交仍应由外层 Workflow 或服务负责，不要把示例执行器直接当成生产事务编排器。

### OpenAI Agents SDK

OpenAI Agents SDK 同时提供 Agent、Runner、转交和 guardrail 等组合方式。阅读时可观察哪些部分是动态决策，哪些部分是固定运行时；转交并不会自动消除权限和停止边界。

### LangGraph

LangGraph 更容易显式表达 Workflow 的 State、Node 和 Edge，也能把 Agent 放在一个节点中。源码阅读的关键是区分图的确定性调度与节点内部的模型决策。

### DeepSeek Harness

DeepSeek Harness 把 Agent Driver、Plugin、Hook 和事件组织成更完整的 Harness。阅读时应先找固定生命周期和扩展点，再判断哪些插件允许动态决策、哪些插件只是普通的事件或能力适配。

## 易混点

- **Workflow 不等于没有模型**：Workflow 可以包含 Agent 节点，但调度和业务边界仍是显式的。
- **Agent 不等于随机代码**：Agent 也需要 Goal、Constraints、Tool 白名单和 StopReason。
- **动态决策不等于必须多 Agent**：一个受限 Agent 足够时，拆分会增加协调和审计成本。
- **普通程序不等于简单程序**：事务、并发和恢复都可由普通程序严谨实现。
- **模型负责建议不等于模型负责提交**：副作用应停留在可授权、可校验的执行层。

## 课后小问

1. “超过金额阈值必须人工审批”适合写在 Agent 提示里还是 Workflow 中？

   **答案**：应在 Workflow/业务服务中强制执行，提示只能作为辅助说明。

   **解析**：审批是副作用前的硬边界，不能依赖模型始终遵守文字。Agent 可以整理申请理由，但提交前必须由程序检查阈值和审批状态。

2. 什么时候把普通条件分支改成 Agent 反而是退步？

   **答案**：当规则稳定、输入结构明确、结果要求可重复时。

   **解析**：Agent 会引入模型延迟、成本和输出变化；若普通程序能直接校验和执行，就更容易测试、审计和恢复。

## 本节小结

- 普通程序由显式代码控制，Workflow 编排显式状态转移，Agent 在约束内动态提出下一步。
- 三者可以组合：Workflow 控制生命周期，Agent 处理开放决策，普通程序承载权限、事务和副作用。
- Agent 不是越多越好，动态决策也不能绕过 Tool、Constraints、Postcondition 和 StopReason。
- 阅读源码时要找动态决策点、状态图、事务边界和审计/重放机制。

## 快速回顾

- 能根据控制权、确定性和副作用边界判断一个组件属于 Agent、Workflow 还是普通程序。
- 能设计“程序校验 → Workflow 调度 → Agent 提议 → Tool 执行 → 程序提交”的混合结构。
- 能解释为什么固定规则不应为了展示智能而交给模型。
- 至此完成第 02 章；下一步进入 [第 03 章：模型与消息](/courses/agent/03-模型与消息/01-Model与推理边界)，学习 Model 输入输出的消息边界。
