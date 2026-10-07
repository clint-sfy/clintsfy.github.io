---
title: Temperature、Top-P 与生成参数
author: 阿源
date: 2026/10/07 00:00
categories: [Agent 开发]
tags: [Temperature, TopP, Generation, Sampling]
description: 理解生成参数如何改变采样分布、输出长度和可复现性。
chapter: 03
---

# Temperature、Top-P 与生成参数

## 学习目标

- 理解 `temperature`、`top_p` 如何改变候选 token 的采样分布。
- 区分随机性参数、长度参数、停止条件、重复惩罚和 reasoning/seed 等模型能力。
- 用统一配置对象校验参数，避免同时无目的地调很多旋钮。
- 知道结构化输出、流式输出和重试都可能改变参数的工程含义。

## 核心知识点

生成参数是“这一次推理怎样生成”的输入，不是模型能力本身。`temperature` 通常控制分布的平滑程度；`top_p` 只在累计概率达到阈值的候选集合中采样；`max_output_tokens` 限制输出预算；`stop` 指定遇到某些序列时停止。供应商可能不支持其中某项，或者对范围、默认值和组合方式有不同约定。

最重要的调参原则是：先确定任务契约，再只改变一个主要因素。抽取、分类和结构化输出通常需要低随机性与严格校验；创意生成需要更大的候选空间，但仍要限制长度、成本和安全边界。

## `temperature`：调整分布平滑度

模型在每一步会为候选 token 产生 logits/概率。温度较低时，高概率候选更占优势；温度较高时，低概率候选也更有机会。`temperature=0` 常被当作“尽量确定”，但不保证跨请求、跨副本或跨模型版本绝对一致。

### `temperature` 参数校验

用途：用本地配置校验演示把温度限制在应用选择的范围内，不假设所有供应商范围完全相同。

```python
from __future__ import annotations

from dataclasses import dataclass


@dataclass(frozen=True)
class GenerationConfig:
    temperature: float = 0.2

    def validate(self) -> None:
        if not 0.0 <= self.temperature <= 2.0:
            raise ValueError("temperature must be between 0 and 2 for this profile")
        # 输出契约：通过表示本地 profile 接受该参数。


config = GenerationConfig(temperature=0.1)
config.validate()
print(config.temperature)
# 输出：0.1
```

示例范围只是本地 profile，不应复制为所有模型的事实。Adapter 应把“参数不支持/范围不合法”分类为请求错误，不能等网络失败后再盲目重试。

### `sample_with_temperature`：本地直觉模型

用途：用标准库随机数展示温度对候选权重的影响；它不是目标模型 tokenizer 或真实采样器。

```python
import math
import random


def sample_with_temperature(
    candidates: tuple[tuple[str, float], ...], temperature: float, seed: int = 7
) -> str:
    if temperature <= 0:
        return max(candidates, key=lambda item: item[1])[0]
    scores = [score / temperature for _, score in candidates]
    weights = [math.exp(score - max(scores)) for score in scores]
    random.seed(seed)
    # 关键状态变化：温度重新缩放候选权重，随后按权重抽样。
    return random.choices([item[0] for item in candidates], weights=weights)[0]


candidates = (("A", 2.0), ("B", 1.0), ("C", 0.0))
print(sample_with_temperature(candidates, 0.0))
print(sample_with_temperature(candidates, 1.0))
# 输出：A
# 输出：A（固定 seed 的示例结果；真实模型并不共享此概率空间）
```

温度并不是“创意值”或“质量值”；它只改变候选分布。较高温度可能增加多样性，也可能降低格式稳定性和事实可靠性。

## `top_p`：累计概率截断

`top_p`（nucleus sampling）先按概率从高到低排序，再保留累计概率达到 `p` 的最小候选集合。它控制候选集合大小，不等同于保留固定数量的 token。`top_p=1` 通常表示不做这层截断；较小值会排除长尾候选。

### `top_p` 参数校验

用途：校验 nucleus sampling 的概率范围，并把它与温度配置放入同一个可审计对象。

```python
from __future__ import annotations

from dataclasses import dataclass


@dataclass(frozen=True)
class SamplingConfig:
    temperature: float = 0.2
    top_p: float = 1.0

    def validate(self) -> None:
        if self.temperature < 0:
            raise ValueError("temperature cannot be negative")
        if not 0.0 < self.top_p <= 1.0:
            raise ValueError("top_p must be in (0, 1]")
        # 输出契约：通过表示参数形状合法，尚不代表目标模型支持它。


config = SamplingConfig(temperature=0.4, top_p=0.9)
config.validate()
print(config)
# 输出：SamplingConfig(temperature=0.4, top_p=0.9)
```

不同供应商可能允许 `top_p=0` 作为特殊模式，也可能拒绝它；应用 profile 应明确规则。若 Provider 不支持该参数，Adapter 应删除或拒绝并记录，而不是假装发送成功。

### `nucleus_candidates`：理解候选集合

用途：用一组已归一化概率展示 top-p 如何截取候选，帮助理解概念而不连接真实模型。

```python
def nucleus_candidates(
    candidates: tuple[tuple[str, float], ...], top_p: float
) -> tuple[str, ...]:
    cumulative = 0.0
    selected: list[str] = []
    for token, probability in sorted(candidates, key=lambda item: item[1], reverse=True):
        selected.append(token)
        cumulative += probability
        if cumulative >= top_p:
            break
    # 输出契约：返回累计概率达到 top_p 的最小候选集合。
    return tuple(selected)


print(nucleus_candidates((("A", 0.6), ("B", 0.25), ("C", 0.15)), 0.8))
# 输出：('A', 'B')
```

真实模型的 logits、tokenizer 和过滤规则远比示例复杂；不要用这个函数预测某个 API 的具体输出。调参时通常固定 temperature 或 top_p 其中一个，先观察质量、格式失败和成本变化。

## `max_output_tokens`：输出预算

### `max_output_tokens` 与 `finish_reason`

用途：用本地生成器模拟长度上限，展示“达到上限”与“自然停止”是不同状态。

```python
from dataclasses import dataclass


@dataclass(frozen=True)
class Result:
    text: str
    finish_reason: str


def generate_words(words: tuple[str, ...], max_output_tokens: int) -> Result:
    if max_output_tokens < 1:
        raise ValueError("max_output_tokens must be positive")
    selected = words[:max_output_tokens]
    reason = "length" if len(selected) < len(words) else "stop"
    # 关键状态变化：输出预算决定可见文本长度和结束原因。
    return Result(" ".join(selected), reason)


result = generate_words(("one", "two", "three"), 2)
print(result)
# 输出：Result(text='one two', finish_reason='length')
```

达到 `length` 并不一定表示模型失败，但 JSON、代码或引用可能被截断，必须在解析层处理。输出预算还要纳入[上下文窗口](./05-Token-上下文窗口与Usage)，不能只设置一个很大的常量。

### `stop`：可选的停止序列

`stop` 适合明确、稳定的分隔符，例如多段模板的结束标记。它不是安全边界：模型可能在停止序列前输出敏感内容，也可能在文本中自然出现相同序列而提前终止。结构化输出应优先依赖解析/Schema 校验而不是把一个 stop 字符当完整验证。

用途：用本地函数展示遇到停止序列时截取文本，并保留停止原因。

```python
def stop_at(text: str, stop: tuple[str, ...]) -> tuple[str, str]:
    positions = [(text.find(marker), marker) for marker in stop if text.find(marker) >= 0]
    if not positions:
        return text, "stop"
    position, marker = min(positions)
    # 关键状态变化：截断到最先出现的停止序列，并记录可解释原因。
    return text[:position], f"stop:{marker}"


print(stop_at("answer\nEND\nignored", ("END",)))
# 输出：('answer\n', 'stop:END')
```

真实 API 可能不返回具体停止序列，或者有数量/长度限制。适配器应把它映射成稳定的 finish reason，并让上层知道是否可安全解析。

## 重复控制参数

### `frequency_penalty` 与 `presence_penalty`

一些供应商提供频率惩罚（重复越多惩罚越强）和存在惩罚（出现过就施加惩罚）。它们适合部分长文本或创意场景，但会损害代码、固定术语、JSON 键和需要精确重复的内容。参数名称相同也不保证实现相同，应该按模型 profile 验证。

用途：用配置对象表达可选惩罚参数，并在结构化任务 profile 中拒绝它们，避免把“少重复”误用于 JSON。

```python
from dataclasses import dataclass


@dataclass(frozen=True)
class PenaltyConfig:
    frequency_penalty: float = 0.0
    presence_penalty: float = 0.0
    structured_task: bool = False

    def validate(self) -> None:
        if self.frequency_penalty < 0 or self.presence_penalty < 0:
            raise ValueError("penalties cannot be negative in this profile")
        if self.structured_task and (self.frequency_penalty or self.presence_penalty):
            raise ValueError("keep penalties at zero for structured tasks")


PenaltyConfig(structured_task=True).validate()
print("penalty profile accepted")
# 输出：penalty profile accepted
```

参数范围和默认值要查对应 Provider 的文档，不应把一个端点的惩罚公式当成通用数学事实。

## `seed` 与可复现性

### `seed`：尽力而为的重复实验

`seed` 在支持的模型上可以帮助复现实验，但不保证跨硬件、模型版本、服务端更新或并发条件完全一致。即便输出一致，Usage、延迟和供应商事件仍可能不同。生产审计应保存输入、模型身份、参数和响应摘要，不要只保存 seed。

用途：用本地随机生成器展示固定 seed 的实验可复现性边界。

```python
import random


def sample(seed: int) -> tuple[int, int, int]:
    generator = random.Random(seed)
    # 关键输入：seed 固定的是这个本地生成器，而不是任意远程模型。
    return tuple(generator.randrange(10) for _ in range(3))


print(sample(7) == sample(7))
# 输出：True
```

如果 Provider 不支持 seed，应把它标成未应用，而不是在日志中记录“seed=7”造成假可复现感。

## `reasoning_effort` 与生成参数边界

某些模型提供 reasoning effort、思考预算或类似设置，它可能影响内部推理 Token、延迟和答案质量，不能简单等同于 temperature。应用应将它作为能力/版本相关参数单独记录，并在输出中区分可见文本与内部计量；不要假定调高 reasoning 一定更准确。

### `GenerationConfig`：汇总并检查参数

用途：使用一个完整配置对象表达参数优先级和互相约束，便于在 Model-Adapter 前做一次校验。

```python
from __future__ import annotations

from dataclasses import dataclass


@dataclass(frozen=True)
class GenerationConfig:
    temperature: float = 0.2
    top_p: float = 1.0
    max_output_tokens: int = 256
    stop: tuple[str, ...] = ()
    seed: int | None = None
    reasoning_effort: str | None = None

    def validate(self) -> None:
        if self.temperature < 0:
            raise ValueError("temperature cannot be negative")
        if not 0 < self.top_p <= 1:
            raise ValueError("top_p must be in (0, 1]")
        if self.max_output_tokens < 1:
            raise ValueError("max_output_tokens must be positive")
        if any(not marker for marker in self.stop):
            raise ValueError("stop markers cannot be empty")
        # 输出契约：通过表示本地 profile 可序列化这份配置。


config = GenerationConfig(temperature=0.1, top_p=0.95, max_output_tokens=128)
config.validate()
print(config.max_output_tokens)
# 输出：128
```

配置校验通过并不表示供应商支持所有字段；Adapter 还要按能力清单映射、忽略或拒绝参数，并在 trace 中记录实际生效值。

## 参数优先级与实验记录

### 模型默认、应用配置与单次请求

常见优先级是“单次请求 > Agent/任务配置 > 应用默认 > Provider 默认”，但项目可以选择其他规则。关键是只实现一套可观察的合并逻辑，避免 `temperature=0` 被错误当作“未设置”而被默认值覆盖。

用途：合并可选配置，演示 `None` 表示未设置，而 0 是一个有意义的显式值。

```python
from __future__ import annotations

def merge_temperature(default: float, override: float | None) -> float:
    # 关键输入：0.0 是有效覆盖值，只有 None 才表示未提供。
    return default if override is None else override


print(merge_temperature(0.7, 0.0), merge_temperature(0.7, None))
# 输出：0.0 0.7
```

实验记录至少包含模型身份、Prompt/指令版本、采样参数、上下文估计、Usage、响应结束原因和评测结果。只记录“temperature=0.2”无法解释质量变化，因为模型、Prompt 和历史可能同时变了。

## 四个主线项目中的对应位置

### smolagents：构造模型时的生成参数

smolagents 的模型类通常接收 temperature、max_tokens、top_p 等额外参数，并由 API 模型层转交供应商。阅读源码时关注参数是否被保留在模型实例、是否每次请求覆盖、以及不支持的参数如何处理；不要把构造函数签名当成所有 Provider 的共同保证。

### OpenAI Agents SDK：`ModelSettings` 与模型能力

OpenAI Agents SDK 用模型设置把采样、长度和供应商特有选项传给具体 Model。阅读时先看设置的合并优先级，再看 Responses/Chat Completions 适配器怎样过滤不兼容字段；一个 Agent 的设置不必等同于所有下游模型都能接受。

### LangGraph：节点配置与模型实例的生命周期

LangGraph 的图节点可以持有一个配置好的模型，或在运行时从 State/Context 选择模型。关键是记录参数属于图定义、节点配置还是单次调用，避免并发运行共享可变采样配置而互相污染。

### DeepSeek Harness：Provider/插件贡献的生成设置

DeepSeek Harness 的插件化运行时可能让模型、会话和用户配置共同贡献生成参数。阅读源码时追踪最终合并点和实际发送值，关注 Preview 版本是否改变默认参数；不要只看 UI 显示的设置就认定请求已经使用。

## 易混点

- `temperature=0` 通常降低随机性，但不是跨版本、跨服务的绝对确定性。
- `top_p` 控制累计概率候选集合，不是固定保留 N 个 token。
- `max_output_tokens` 是预算，不是保证输出长度；达到上限要看结束原因。
- `stop` 可以截断文本，不能替代 Schema、权限和内容安全校验。
- `seed` 帮助实验复现，不保证远程服务完全一致。
- reasoning effort 影响内部推理预算，不能当作 temperature 的别名。
- 同时调 temperature 和 top_p 会让实验难以解释；先固定一个再比较。

## 课后小问

1. 抽取 JSON 时把 temperature 调高能解决字段缺失吗？

   答案：通常不能，反而可能增加格式波动。应明确 Schema、限制输出、解析并校验，参数只作为实验变量。

2. 为什么 `max_output_tokens` 过大可能导致输入上下文错误？

   答案：很多模型把输入和预留输出共同纳入窗口；输入已接近上限时，过大的预留会让请求超限。应先计算总预算并留出安全余量。

3. 供应商不支持 `top_p` 时，Adapter 最安全的行为是什么？

   答案：按明确 profile 选择拒绝并提示，或记录后使用默认值；不能静默声称参数已生效。任务若依赖采样控制，应优先拒绝以避免隐性质量变化。

## 本节小结

生成参数描述的是一次推理的采样、长度和停止行为。`temperature` 调整分布平滑度，`top_p` 截断候选集合，长度/停止/惩罚/seed/reasoning 各有独立语义。参数先经过本地 profile 和模型能力校验，再由 Adapter 映射；实际生效值、模型身份和 Usage 必须共同记录，才能解释实验和回归。

## 快速回顾

- 先定任务契约，再选一个主要采样旋钮。
- `temperature`：分布平滑；`top_p`：累计概率截断。
- `max_output_tokens` 与窗口预算联动；`stop` 不等于安全校验。
- `seed` 是实验辅助；reasoning effort 是独立能力。
- 参数合并要区分 `None` 和 0，并记录实际生效配置。
