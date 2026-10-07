---
title: Token、上下文窗口与 Usage
author: 阿源
date: 2026/10/07 00:00
categories: [Agent 开发]
tags: [Token, ContextWindow, Usage, Budget]
description: 计算输入输出预算，理解上下文窗口和模型使用量的观测边界。
chapter: 03
---

# Token、上下文窗口与 Usage

## 学习目标

- 区分 Token、字符、字节、上下文窗口和费用计量。
- 说清输入、输出、缓存、推理和多模态使用量的记录边界。
- 设计上下文预算、预检和裁剪策略，避免把超限错误当作普通重试。
- 用不依赖真实 tokenizer 的 Python 代码表达预算和截断；知道近似估算不能替代供应商计量。

## 核心知识点

`Token` 是模型处理文本的离散单位，既不是字符也不是单词；不同模型、语言和 tokenizer 的分割方式不同。`Context Window` 是一次调用可接受的输入与输出容量上限，通常还受系统规则、消息历史、媒体和内部推理预算影响。`Usage` 是供应商或 Adapter 返回的实际计量，不应由应用用字符数“猜成账单”。

一次调用可以画成预算账本：

```text
输入预算 = system/developer + 用户消息 + 历史 + 外部资料 + 多模态计量
输出预算 = 可见回答 + 结构化字段 + 可能的内部推理计量
总窗口   = 输入预算 + 输出预算（具体规则随模型而变）
```

本篇沿用[Prompt 边界](./04-System-Instructions与Prompt边界)的来源模型，说明如何选择上下文；消息字段与块类型见[Message](./02-Message-Role与消息顺序)和[Content-Block](./03-Text-Image-Audio与Content-Block)。

## `Token`：模型的离散计量单位

### 字符数、字节数和 Token 数

中文、英文、代码、emoji 和混合文本的 Token 比例都可能不同。字符数适合做粗略的输入长度保护，字节数适合传输和文件限制，Token 数才接近模型窗口和计费接口；三者应分别记录。

用途：用一个明确标注为“粗略估算”的函数展示为什么不能把字符数直接当 Token 数。

```python
def rough_token_estimate(text: str) -> int:
    # 关键输入：该估算只用于本地提前保护，不代表任何供应商计量。
    ascii_chars = sum(ord(char) < 128 for char in text)
    non_ascii_chars = len(text) - ascii_chars
    return max(1, ascii_chars // 4 + non_ascii_chars)


sample = "hello，模型"
print(len(sample), len(sample.encode("utf-8")), rough_token_estimate(sample))
# 输出：8 14 4
```

真实系统可使用目标模型的 tokenizer 或供应商预估端点，但仍要为消息包装、特殊 token、图片分辨率和服务端规则留余量。估算器的名字应带 `rough` 等提示，避免被误用于计费对账。

### Token 计量的模型依赖

同一句文本换模型后可能有不同 Token 数；同一模型升级 tokenizer 后也可能变化。模型名称、版本、Tokenizer 版本和 Adapter 版本应跟 Usage 一起记录。跨模型比较成本时，要统一任务样本和计量字段，不能只比较输出字符数。

## `Context Window`：一次请求的容量边界

### 输入与输出共享窗口

很多模型把输入、输出和内部预算共同放进一个窗口，但具体上限与字段名称依赖供应商。设置 `max_output_tokens` 过大并不代表一定能生成那么多；输入已经很长时，可用输出会变小。窗口溢出通常应先裁剪或改变模型，而不是无脑重试原请求。

用途：用本地预算函数在网络调用前拒绝明显超限请求，并把输入与输出预算分开。

```python
from dataclasses import dataclass


@dataclass(frozen=True)
class Window:
    limit: int
    reserved_output: int

    def available_input(self) -> int:
        if self.reserved_output < 0 or self.reserved_output > self.limit:
            raise ValueError("reserved output is outside the window")
        return self.limit - self.reserved_output


window = Window(limit=1000, reserved_output=200)
print(window.available_input())
# 输出：800
```

这只是应用侧预算，不保证服务端接受请求。若模型还有 reasoning、tool result 或媒体计量，`reserved_output` 应按目标 API 的语义留出安全余量，并在收到 Usage 后校准。

### `Budget`：把预算当成显式状态

用途：通过数据类记录估算输入、预留输出和最终使用量，避免预算在多个函数中用魔法数字传递。

```python
from dataclasses import dataclass


@dataclass
class Budget:
    window_limit: int
    input_estimate: int = 0
    output_reserved: int = 0

    @property
    def fits(self) -> bool:
        return self.input_estimate + self.output_reserved <= self.window_limit

    def reserve_output(self, amount: int) -> None:
        if amount < 0:
            raise ValueError("output reservation cannot be negative")
        # 关键状态变化：调用前增加本次输出预算，再检查窗口。
        self.output_reserved = amount


budget = Budget(window_limit=120, input_estimate=90)
budget.reserve_output(30)
print(budget.fits)
# 输出：True
```

预算对象不应在调用成功后直接当作账单。调用结束还要写入实际 `Usage`，并记录是否发生了截断、重试或降级；一次用户请求可能消耗多次模型调用。

## `Usage`：实际使用量的观测

### `Usage` dataclass：统一字段但保留未知值

用途：用可扩展字段承接不同供应商返回的输入、输出、缓存和推理计量。

```python
from __future__ import annotations

from dataclasses import dataclass, field


@dataclass(frozen=True)
class Usage:
    input_tokens: int | None = None
    output_tokens: int | None = None
    total_tokens: int | None = None
    cached_input_tokens: int | None = None
    reasoning_tokens: int | None = None
    provider_fields: dict[str, int] = field(default_factory=dict)


usage = Usage(input_tokens=84, output_tokens=31, total_tokens=115)
print(usage.input_tokens, usage.total_tokens)
# 输出：84 115
```

`None` 表示供应商没有提供或当前事件还没有该值，不应当作零。`total_tokens` 有时包含缓存、推理或其他计量，有时只等于可见输入加输出；Adapter 应记录来源语义，不能随意自行相加覆盖供应商值。

### `Usage` 与费用估算

费用估算应使用“模型版本 + 供应商价格版本 + Usage 字段”的显式表。价格会变化，缓存 token 是否折扣、推理 token 是否单独计费也可能不同。课程示例不连接真实账单服务，下面只演示将 Usage 传入一个本地价格表。

用途：用本地价格配置估算一笔调用成本，强调估算结果不是供应商账单。

```python
from dataclasses import dataclass


@dataclass(frozen=True)
class Usage:
    input_tokens: int
    output_tokens: int


def estimate_cost(usage: Usage, input_per_million: float, output_per_million: float) -> float:
    # 关键输入：价格版本应由配置管理，示例使用本地常量而非在线查询。
    return usage.input_tokens / 1_000_000 * input_per_million + usage.output_tokens / 1_000_000 * output_per_million


cost = estimate_cost(Usage(1_000, 500), 1.0, 2.0)
print(f"${cost:.4f}")
# 输出：$0.0020
```

不要把这个估算结果当作精确扣费；生产对账应以供应商账单、请求 ID 和其官方计量规则为准。日志可以记录估算值和计量来源，以便发现异常消耗。

### Usage 与流式响应

流式传输中，Usage 可能只在终止事件出现，也可能由独立事件发送；中途断线时可能没有完整计量。不要因为 UI 已经显示若干 token 就声称账单就是这个数。第 08 篇会说明结束事件和部分输出的关系。

## 上下文组装与裁剪

### `select_messages`：保留规则和最近上下文

用途：按完整 turn 和工具关联组裁剪上下文，避免把一个 assistant 回合或工具结果拆成孤立消息。

```python
from dataclasses import dataclass
from typing import Optional


@dataclass(frozen=True)
class Message:
    role: str
    content: str
    turn_id: Optional[str] = None
    tool_call_id: Optional[str] = None


def select_messages(history: tuple[Message, ...], turn_count: int) -> tuple[Message, ...]:
    if turn_count < 1:
        raise ValueError("turn_count must be positive")
    system = tuple(message for message in history if message.role == "system")
    groups: list[tuple[str, list[Message]]] = []
    for message in (item for item in history if item.role != "system"):
        if message.turn_id is None:
            raise ValueError("non-system message needs a turn_id")
        if not groups or groups[-1][0] != message.turn_id:
            groups.append((message.turn_id, []))
        groups[-1][1].append(message)
    for turn_id, group in groups:
        calls = {item.tool_call_id for item in group if item.role == "assistant" and item.tool_call_id}
        results = {item.tool_call_id for item in group if item.role == "tool" and item.tool_call_id}
        if calls != results:
            raise ValueError(f"incomplete tool association in {turn_id}")
    selected = groups[-turn_count:]
    # 关键状态变化：系统消息始终保留，最近完整 turn 按原顺序整体加入。
    return system + tuple(item for _, group in selected for item in group)


history = (
    Message("system", "遵守输出格式"),
    Message("user", "旧问题", "turn-1"),
    Message("assistant", "旧答案", "turn-1"),
    Message("user", "查天气", "turn-2"),
    Message("assistant", "查询中", "turn-2", "call-1"),
    Message("tool", "晴天", "turn-2", "call-1"),
    Message("assistant", "今天晴天", "turn-2"),
)
print([(item.role, item.content) for item in select_messages(history, 1)])
# 输出：[('system', '遵守输出格式'), ('user', '查天气'), ('assistant', '查询中'), ('tool', '晴天'), ('assistant', '今天晴天')]
```

这里用 turn_id 表示完整回合，并要求 assistant 的 tool_call_id 与 tool 结果在同一组且成对出现；真实协议可能把调用 ID 放在 content block 中，Adapter 应先归一化再分组。函数只裁剪消息，不执行工具，也不修复缺失结果；发现孤立 assistant/tool 就拒绝输入。生产策略还要考虑摘要、用户目标优先级、多模态块和 Token 预算。

### 截断、摘要与显式状态

截断直接丢弃历史，适合旧闲聊或可重新获取的资料；摘要保留语义但可能引入错误；显式状态把关键事实存为结构化字段，减少每轮重复发送。三者可以组合：系统规则固定保留，最近轮次保留原文，较旧轮次摘要，业务 ID 存在状态中。会话持久化与恢复属于后续章节，但本节要避免把关键事实只放在自然语言历史里。

### `truncate_text`：不要在 UTF-8 字节中间截断

用途：展示一个按 Python 字符边界截短文本的安全下限，并明确它仍不是 Token 级截断。

```python
def truncate_text(text: str, max_chars: int) -> str:
    if max_chars < 0:
        raise ValueError("max_chars cannot be negative")
    if len(text) <= max_chars:
        return text
    # 关键状态变化：按字符边界截短，并标记内容不完整。
    return text[:max_chars] + "…"


print(truncate_text("模型输入需要预算", 4))
# 输出：模型输入…
```

按字符截短可能仍超出目标 Token 预算，也可能破坏 JSON、代码或消息关联。结构化内容应优先整体保留或用解析器裁剪，不能把半个 schema 当完整结果发送。

## 超预算与降级

### `ContextOverflow`：不可盲目重试

用途：定义一个专门的超预算异常，让上层知道应重新组装上下文，而不是原样重试。

```python
class ContextOverflow(Exception):
    def __init__(self, estimated: int, limit: int) -> None:
        super().__init__(f"context estimate {estimated} exceeds limit {limit}")
        self.estimated = estimated
        self.limit = limit


def ensure_window(estimated: int, limit: int) -> None:
    if estimated > limit:
        raise ContextOverflow(estimated, limit)
    # 输出契约：返回表示估算没有超过本地窗口。


try:
    ensure_window(120, 100)
except ContextOverflow as error:
    print(type(error).__name__, error.limit)
# 输出：ContextOverflow 100
```

处理顺序通常是：记录估算与实际窗口 → 减少可选历史/资料 → 降低预留输出 → 选择有足够能力的模型 → 向用户报告无法完成。不能无限摘要或不断重试，因为每次失败都可能消耗时间、费用和限流配额。

### 输入超限与输出截断

输入超限表示请求无法开始或被服务端拒绝；输出达到上限可能仍返回部分回答并以 `length` 等结束原因结束。二者对重试含义不同：输入要改变上下文，输出可以在明确状态下追加或让用户继续，但追加本身会增加上下文，必须重新预算。

## 四个主线项目中的对应位置

### smolagents：模型参数和 API Usage

smolagents 的模型实现通常接收 `max_tokens`、`temperature` 等参数，并可能在 API 模型层处理限流和响应计量。阅读时确认参数究竟在哪一层汇总、Usage 是否返回给 Agent 步骤、模型输出是否已经包含了消息/代码执行开销；不要把单次 API 字段等同于整个 Agent 运行成本。

### OpenAI Agents SDK：Usage 附着于模型响应和运行结果

OpenAI Agents SDK 的模型响应与运行结果会承载 usage，Runner 还可能产生多次模型调用、工具和 handoff。源码阅读要从单次 `ModelResponse` 看字段，再追到 Runner 如何聚合；聚合后的总量不能反推每条用户消息的单独费用。

### LangGraph：状态增长与 checkpoint 不是 Token 计量

LangGraph 可以把消息历史保存在 State 和 checkpoint 中，但持久化字节数不等于模型 Token 数。阅读图节点时看它在哪里选择消息、何时压缩或摘要，并把 checkpoint 存储成本和模型调用 usage 分开观测。

### DeepSeek Harness：会话上下文与模型计量的双层账本

DeepSeek Harness 的会话/事件可能记录比某次 LLM 请求更完整的运行轨迹。源码阅读时区分“会话保留了多少内容”和“供应商实际计量了多少 Token”；预览期模型与事件字段可能改变，Adapter 应保留未知 Usage 字段而不是静默丢弃。

## 易混点

- Token 不是字符、字节或单词；估算值不能直接当账单。
- 上下文窗口通常同时约束输入和输出，预留输出越大，可用输入越少。
- `None` 的 Usage 表示未知或尚未结束，不是零。
- 历史裁剪、摘要和显式状态是不同策略；不能只靠最近 N 条保护语义。
- 输入超限应重组上下文，输出长度结束可能允许续写；两者不要同样重试。
- checkpoint、日志大小和模型 Token 使用量是三本账，不应混为一谈。

## 课后小问

1. 为什么字符数估算不能用来做精确费用结算？

   答案：Token 分割依赖模型、语言和 tokenizer，消息包装与多模态计量也会影响实际使用量。字符数只能做提前保护，结算应使用供应商 Usage/账单。

2. 输入已有 90 个单位预算、窗口上限 100，还能请求 50 个输出单位吗？

   答案：不能按原预算发送；输入加预留输出为 140，超过窗口。应裁剪/摘要输入、降低输出预算或换窗口更大的模型，并明确记录决定。

3. 为什么遇到上下文超限不能直接指数退避重试？

   答案：它是确定性输入错误，等待不会改变消息长度，还会消耗时间和配额。应先改变上下文或模型，并向调用方返回可操作错误。

## 本节小结

Token 是模型相关的离散计量，Context Window 是一次调用的容量边界，Usage 是实际服务计量。工程上应把输入/输出预算显式化，先估算和裁剪，再调用并记录实际 usage；超预算、部分输出、缓存和多模态计量都要保留语义，不能靠字符数或异常字符串猜测。

## 快速回顾

- 估算：字符/字节只是本地保护，Token 需目标 tokenizer 或服务计量。
- 预算：输入 + 预留输出不能超过窗口，并为隐藏计量留余量。
- 裁剪：规则、关联消息和关键状态优先，摘要需可追踪。
- Usage：`None` 不等于 0；供应商字段和版本要记录。
- 超限：改变输入或模型，不对确定性错误盲目重试。
