---
title: Observation、Action 与 Agent Loop
author: 阿源
date: 2026/10/07
categories: [Agent 开发]
tags: [Agent, Observation, Action, Loop]
chapter: 02
---

# Observation、Action 与 Agent Loop

## 学习目标

- 将一次 Agent 决策描述成 Observation → Action → Observation 的状态转移。
- 区分模型提议、运行时校验、工具执行和最终答案四个阶段。
- 编写一个无框架、无密钥、可观测的最小 Agent Loop。

## 前置知识

- 已阅读 [Agent 是什么](./01-Agent是什么)、[Agent 系统组成](./02-Agent系统组成) 和 [Goal、Instructions 与 Constraints](./03-Goal-Instructions与Constraints)。
- 已了解 Tool、State、Context、Goal 和 Constraints 的基本边界。

## 闭环中的四类数据

### Observation

Observation 是运行时从 Environment 取得的事实。它应包含来源、状态和必要数据，例如“build 查询返回 green”，或“读取失败，原因是文件不存在”。Observation 可以是成功、失败、等待或部分结果。

Observation 应带有明确的结构和时间语义。一个几分钟前的“green”不能自动代表当前状态；一个只包含自然语言的“看起来没问题”也不便于后续判断。

### Action

Action 是待执行的结构化请求，至少需要动作名称和参数，必要时还包括请求标识、理由或审批信息。Action 只代表“打算做什么”，不代表动作已经成功。

Action 的参数来自 Model 或固定策略，必须在执行前再次校验。未知名称、参数缺失、违反 Constraints 的 Action 应进入拒绝分支，不能落到默认函数上。

### Final Answer

Final Answer 是面向调用者交付的结果，通常来自一个满足 Success Criteria 的 Observation，或来自明确的失败/暂停状态。它不是所有中间文本的总和，也不应掩盖尚未确认的外部状态。

### Transition

Transition 是从当前 State、Observation 和 Goal 计算下一状态的过程。一次 Transition 可以产生 Action，也可以产生 Final Answer 或失败状态；它不应同时偷偷执行外部副作用。

## Agent Loop 的控制顺序

### 读取当前观察

循环开始时读取当前 Observation 和运行状态。第一次运行可以使用一个明确的初始观察，例如“尚未查询”；不要用未定义的空值让决策器猜测系统状态。

### 生成候选动作

Model 或确定性策略根据 Goal、Instructions 和 Observation 生成 Action 或 Final Answer。该阶段只做决策，不应直接调用文件、网络或数据库。

### 校验并执行动作

Runtime 检查 Action 名称、参数、权限和当前约束，再调用匹配的 Tool。执行阶段记录开始、成功或失败；工具返回值统一包装为 Observation。

### 回填观察

将真实执行结果写回 State，并构造下一次决策所需 Context。只有回填后，下一轮 Model 才能把结果当作输入；模型上一轮的猜测不能越过这一步。

### 判断继续或结束

如果 Observation 满足 Success Criteria，循环交付 Final Answer；如果违反硬约束、出现不可恢复错误或超过预算，则交付明确失败；否则继续下一轮。停止原因的分类会在 [停止条件、超时与失败边界](./06-停止条件超时与失败边界) 中展开。

## 一个可观察的最小循环

下面的代码用两个本地工具模拟“查询状态后生成报告”的任务，展示 Action 校验、Observation 回填和 Final Answer 的完整数据流。

```python
from __future__ import annotations

from dataclasses import dataclass
from typing import Callable


@dataclass(frozen=True)
class Observation:
    kind: str
    value: str


@dataclass(frozen=True)
class Action:
    name: str
    argument: str


def get_status(_: str) -> Observation:
    return Observation("success", "green")


def make_report(status: str) -> Observation:
    return Observation("success", f"report: build={status}")


TOOLS: dict[str, Callable[[str], Observation]] = {
    "get_status": get_status,
    "make_report": make_report,
}


def decide(observation: Observation | None) -> Action | str:
    if observation is None:
        return Action("get_status", "build")
    if observation.kind == "success" and observation.value in {"green", "red"}:
        if observation.value == "green":
            return Action("make_report", observation.value)
        return f"build failed: {observation.value}"
    return "unable to determine build status"


def run_loop(max_actions: int = 3) -> str:
    observation: Observation | None = None
    history: list[str] = []

    for action_count in range(max_actions):
        decision = decide(observation)
        if isinstance(decision, str):
            # 输出契约：字符串只在策略确认结果或明确失败时交付。
            return decision

        if decision.name not in TOOLS:
            return f"rejected unknown action: {decision.name}"

        # 状态变化：工具执行前记录候选 Action，执行后才生成 Observation。
        history.append(f"action={decision.name}({decision.argument})")
        observation = TOOLS[decision.name](decision.argument)
        history.append(f"observation={observation.kind}:{observation.value}")

        if decision.name == "make_report" and observation.kind == "success":
            print(" | ".join(history))
            return observation.value

    return "stopped: action budget exhausted"


print(run_loop())
# 输出：action=get_status(build) | observation=success:green | action=make_report(green) | observation=success:report: build=green
# 输出：report: build=green
```

这里的 decide 只读当前 Observation，TOOLS 才拥有执行能力；history 让每一次状态转移可观察。为了保持示例简单，错误用字符串返回，实际系统应把错误原因和停止原因放进结构化运行状态。

### 解析失败的 Action

如果模型输出缺少动作名称、参数不是预期类型或包含未知字段，解析器应把它转成可诊断的失败 Observation。不要把解析失败当成“没有 Action”并静默结束，否则用户会看到没有原因的空回答。

### 工具失败的 Observation

工具抛出异常或返回业务失败时，Runtime 应统一包装成错误 Observation，并保留工具名、参数摘要和可恢复性。下一轮可以根据错误重试或改用其他动作，但不能把异常消息直接当成成功事实。

### 空观察与部分观察

空观察只有在协议明确表示“没有结果”时才有意义；第一次运行应使用显式的起始状态。部分观察要标明缺失字段，决策器不能根据缺失值推断“没有问题”。

### Action 与副作用

Action 被执行后可能改变 Environment。日志记录“执行请求已发出”不等于环境已经改变；需要 Postcondition 或新的 Observation 才能判断结果。对重复执行有风险的 Action，要在工具层设计幂等键或审批边界。

## 源码阅读时追踪闭环

### 找到决策出口

先找 Model 返回结果被解析的位置，识别它是 Final Answer、Tool Call 还是解析错误。不同框架可能叫 response、step result 或 next action，但都应有一个明确出口。

### 找到执行入口

再找工具注册表或 executor 的调用入口，检查它如何处理未知工具、参数校验、异常和返回值。若模型结果直接被传给任意函数，这是需要重点审查的危险边界。

### 找到回填位置

追踪工具结果如何进入下一次模型输入或 State。只把结果写日志、不回填 Context 的代码不会形成真正的闭环；相反，直接把未经筛选的外部文本拼进指令会产生信息边界问题。

### 找到停止出口

最后确认循环在什么条件下返回 Final Answer、失败或暂停，并检查每个出口是否写入 StopReason。不要只看最常见的成功路径。

## 与主线项目的对应关系

### smolagents

smolagents 的执行方法通常把模型输出解析成工具调用或最终结果，再把工具结果加入下一次上下文。阅读时优先画出这条调用链，并标出工具异常和停止分支。

### OpenAI Agents SDK

OpenAI Agents SDK 的 Runner 会把一次模型结果转成工具执行、转交或最终输出。理解这个循环比记住同步和流式入口的名称更重要；后续第 07 篇再比较执行模式。

### LangGraph

LangGraph 用节点输出和边条件表达 Transition。一个节点可能产出 Action，另一个节点执行 Tool，再把 Observation 写回 State；图的边就是循环的显式控制点。

### DeepSeek Harness

DeepSeek Harness 可能通过事件、Hook 和 Plugin 扩展 Action 与 Observation 的记录方式。源码阅读时应先还原基础闭环，再查看扩展是否改变了执行顺序、错误传播或停止判断。

## 易混点

- **Observation 不是 Action 的回声**：请求发出只能说明动作开始，实际结果要以环境返回为准。
- **Final Answer 不是任意文本**：它应对应成功条件、明确失败或暂停原因。
- **空观察不等于成功**：缺少数据时应保留 unknown/partial 语义。
- **解析通过不等于执行成功**：Action 结构合法仍可能被权限、业务条件或工具故障拒绝。
- **日志不等于回填**：只有进入下一次 Context 或 State 的结果，才会影响下一步决策。

## 课后小问

1. 为什么工具抛出异常后不能直接返回“任务失败”而不保留工具信息？

   **答案**：调用者需要知道哪个动作、哪类输入和哪种错误导致失败，才能判断是否重试或修正目标。

   **解析**：统一的错误 Observation 可以保留诊断上下文，同时让运行时决定可恢复性；吞掉工具信息会让源码调试和用户反馈都失去依据。

2. Agent Loop 中为什么要把执行前的 Action 和执行后的 Observation 都记录下来？

   **答案**：二者分别说明系统打算做什么和环境实际发生了什么。

   **解析**：只记录 Observation 看不出决策原因，只记录 Action 又无法判断副作用是否成功；两者配对才能复盘状态转移。

## 本节小结

- Agent Loop 是由 Observation 驱动 Action，再由 Action 产生新 Observation 的闭环。
- Model 只提出候选，Runtime 负责解析和校验，Tool 负责执行，State 负责回填事实。
- Final Answer 必须对应成功条件或明确的失败/暂停状态。
- 阅读源码要同时找到决策出口、执行入口、回填位置和停止出口。

## 快速回顾

- 能画出 Observation → Action → Tool → Observation 的循环。
- 能指出未知动作、解析失败、工具异常和空观察各自应落在哪个边界。
- 能解释为什么“请求发出”与“环境状态已改变”不是同一件事。
- 下一篇阅读 [Run、Turn、Step 与运行状态](./05-Run-Turn-Step与运行状态)，为这个循环补上时间和生命周期层次。
