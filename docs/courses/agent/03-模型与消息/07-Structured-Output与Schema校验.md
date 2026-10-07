---
title: Structured-Output 与 Schema 校验
author: 阿源
date: 2026/10/07 00:00
categories: [Agent 开发]
tags: [StructuredOutput, JSON, Schema, Validation]
description: 从解析、结构校验到业务校验建立可靠的结构化模型输出边界。
chapter: 03
---

# Structured-Output 与 Schema 校验

## 学习目标

- 区分“模型说了 JSON”“JSON 可解析”“符合 Schema”和“业务上可信”四个层次。
- 用标准库 `json` 和数据类实现最小结构化输出解析与校验。
- 设计字段缺失、类型错误、额外字段和语义错误的失败契约。
- 理解结构化输出与流式拼装、重试、版本演进和工具权限之间的边界。

## 核心知识点

Structured Output 是对模型输出形状的约束或期望，不是事实保证，也不是权限授予。一个完整管线至少包含：

```text
模型文本/事件
      ↓
JSON 解析       —— 能否读成数据？
      ↓
Schema 校验    —— 字段、类型、枚举、额外字段？
      ↓
业务校验       —— 值是否符合现实状态与权限？
      ↓
下游使用       —— 仍需副作用门控
```

消息与内容块见前面的[Message](./02-Message-Role与消息顺序)和[Content-Block](./03-Text-Image-Audio与Content-Block)；生成参数见[Temperature、Top-P 与生成参数](./06-Temperature-Top-P与生成参数)。本篇不把结构化字段提前当成工具调用。

## `json.loads`：先做语法解析

### JSON 文本与 Python 对象

用途：用标准库解析一个最小 JSON 响应，并把语法错误与成功结果区分开。

```python
import json


def parse_json(text: str) -> object:
    try:
        # 关键输入：模型返回的是不可信文本，不能直接 eval。
        value = json.loads(text)
    except json.JSONDecodeError as error:
        raise ValueError(f"model output is not valid JSON: {error.msg}") from error
    # 输出契约：返回 JSON 对应的基础对象，尚未完成 Schema 校验。
    return value


print(parse_json('{"answer": "ok"}'))
# 输出：{'answer': 'ok'}
```

绝对不要用 `eval` 执行模型输出；合法 Python 表达式和 JSON 不是同一个语言，执行还会带来任意代码风险。解析成功也不代表顶层是对象，可能是列表、字符串或 `null`，下一层必须继续检查。

### `parse_json_object`：限制顶层形状

用途：先要求顶层是对象，为后续字段 Schema 提供稳定输入。

```python
import json
from typing import Any


def parse_json_object(text: str) -> dict[str, Any]:
    value = json.loads(text)
    if not isinstance(value, dict):
        raise ValueError("structured output must be a JSON object")
    # 输出契约：顶层形状是对象，字段含义仍待校验。
    return value


print(parse_json_object('{"status": "ok"}') ["status"])
# 输出：ok
```

代码示例故意不处理 Markdown 代码围栏。生产协议应要求纯 JSON，若兼容围栏，先用严格且可测试的提取规则再解析，不能用贪婪正则吞掉多个对象或自然语言。

## `Schema`：描述字段契约

### `TaskResult` dataclass：把已校验数据变成领域对象

用途：用数据类表达通过 Schema 后的最小领域对象，禁止下游继续处理任意字典。

```python
from dataclasses import dataclass
from typing import Literal


@dataclass(frozen=True)
class TaskResult:
    status: Literal["ok", "needs_review"]
    answer: str
    confidence: float


result = TaskResult("needs_review", "需要人工确认", 0.45)
print(result.status, result.confidence)
# 输出：needs_review 0.45
```

领域对象的构造函数仍可能被内部代码直接调用，因此不要把“数据类能实例化”当成完整输入验证。对外部 JSON，先执行显式校验，再构造对象。

### `validate_task_result`：检查必填、类型和范围

用途：用标准库实现一个可读的 Schema 校验器，展示失败路径如何携带字段位置。

```python
from dataclasses import dataclass
from typing import Literal, Any


@dataclass(frozen=True)
class TaskResult:
    status: Literal["ok", "needs_review"]
    answer: str
    confidence: float


def validate_task_result(value: Any) -> TaskResult:
    if not isinstance(value, dict):
        raise ValueError("result must be an object")
    required = {"status", "answer", "confidence"}
    missing = required - value.keys()
    if missing:
        raise ValueError(f"missing fields: {sorted(missing)}")
    if set(value) != required:
        extra = set(value) - required
        raise ValueError(f"unexpected fields: {sorted(extra)}")
    if value["status"] not in {"ok", "needs_review"}:
        raise ValueError("status must be ok or needs_review")
    if not isinstance(value["answer"], str):
        raise ValueError("answer must be a string")
    if not isinstance(value["confidence"], (int, float)) or isinstance(value["confidence"], bool):
        raise ValueError("confidence must be a number")
    if not 0 <= value["confidence"] <= 1:
        raise ValueError("confidence must be between 0 and 1")
    # 关键状态变化：只有完整通过检查后才创建领域对象。
    return TaskResult(value["status"], value["answer"], float(value["confidence"]))


print(validate_task_result({"status": "ok", "answer": "完成", "confidence": 0.9}))
# 输出：TaskResult(status='ok', answer='完成', confidence=0.9)
```

是否拒绝额外字段要按契约决定。拒绝可以发现模型误输出和版本漂移；忽略可以兼容向前扩展，但可能把重要的新字段静默丢掉。无论选择哪种策略，都要在 Schema 版本中固定。

### `SchemaVersion`：结构演进

用途：为结构化结果携带版本，防止字段含义变化时下游误读旧数据。

```python
from dataclasses import dataclass


@dataclass(frozen=True)
class VersionedResult:
    schema_name: str
    schema_version: int
    payload: dict[str, object]


result = VersionedResult("task-result", 1, {"status": "ok"})
print(result.schema_name, result.schema_version)
# 输出：task-result 1
```

版本号不应让模型自己随意选择；应用模板、解析器和下游消费者应共同约定。升级时可以短期兼容旧版本并记录转换，而不是遇到未知字段就猜测含义。

## Schema 与模型能力

### `strict` structured output：服务端约束的边界

某些模型端点支持按 JSON Schema 约束解码，某些只支持提示词约定，另一些仅保证部分字段。服务端约束可以减少格式错误，但不能保证字段事实正确、枚举选择合理或没有敏感数据。Adapter 仍应在本地解析和校验。

### `Schema` 与 Prompt 的关系

Prompt 可以解释字段用途和示例，Schema 定义机器可验证的形状；两者要保持一致。若示例说 `confidence` 是百分比而 Schema 说 0 到 1，模型可能稳定地产生错误结果。把 Schema 版本和 Prompt 版本一起记录，回归时才能定位冲突。

用途：让 Schema 和 Prompt 共享一份字段定义，避免手写两套互相矛盾的规则。

```python
SCHEMA_DESCRIPTION = {
    "status": "ok 或 needs_review",
    "answer": "面向用户的文本",
    "confidence": "0 到 1 的小数",
}


def prompt_for_schema(task: str) -> str:
    fields = "; ".join(f"{name}: {meaning}" for name, meaning in SCHEMA_DESCRIPTION.items())
    # 关键状态变化：任务与字段解释在同一个模板中生成。
    return f"只返回 JSON。字段定义：{fields}。任务：{task}"


print(prompt_for_schema("判断是否需要人工复核"))
# 输出：只返回 JSON。字段定义：status: ok 或 needs_review; answer: 面向用户的文本; confidence: 0 到 1 的小数。任务：判断是否需要人工复核
```

这个模板只是帮助模型，不替代本地 `validate_task_result`。不要让模型返回一段“通过校验”的文字来替代代码真正执行验证。

## 业务校验：结构不等于事实

### `validate_business_rules`：检查跨字段语义

用途：在 Schema 通过后执行简单业务规则，演示“字段类型正确但组合不合法”的情况。

```python
from dataclasses import dataclass


@dataclass(frozen=True)
class Result:
    status: str
    confidence: float


def validate_business_rules(result: Result) -> None:
    if result.status == "ok" and result.confidence < 0.6:
        raise ValueError("ok result needs confidence >= 0.6")
    if result.status == "needs_review" and result.confidence > 0.95:
        raise ValueError("needs_review with very high confidence needs review")
    # 输出契约：通过表示组合规则成立，不代表外部事实已经核实。


validate_business_rules(Result("ok", 0.9))
print("business rules passed")
# 输出：business rules passed
```

业务规则应尽量由确定性代码表达，而不是让模型“自证”。涉及真实数据库状态、权限或金额时，要在可信数据源和事务边界中再次检查。

### `confidence`：模型自报分数不是概率真值

模型输出的 confidence 可能只是模型生成的主观标记，未经校准不能当作准确概率。应用应在评测集上校准、设定人工复核阈值，并记录模型/版本变化。字段叫 `confidence` 不会自动获得统计保证。

## 失败、重试与幂等边界

### `StructuredOutputError`：区分解析失败与业务拒绝

用途：定义两类结构化失败，让调用方决定是否重试格式问题，而不是重试所有不符合业务的结果。

```python
class StructuredOutputError(Exception):
    pass


class ParseError(StructuredOutputError):
    pass


class SchemaError(StructuredOutputError):
    pass


class BusinessRuleError(StructuredOutputError):
    pass


failures = (ParseError("invalid JSON"), SchemaError("missing status"), BusinessRuleError("forbidden state"))
print([type(error).__name__ for error in failures])
# 输出：['ParseError', 'SchemaError', 'BusinessRuleError']
```

解析失败可以在有限次数内用同一输入请求“只修复格式”，但每次重试都可能产生费用和不同答案；业务规则拒绝通常不应靠重复采样解决；权限或事实错误要返回上游处理。若结构化结果会触发副作用，重试前必须保证下游未执行，或使用幂等键和人工确认。

### `repair_once`：受限格式修复

用途：对已知的可修复语法错误只允许一次修复尝试，并保留失败原因。

```python
import json


def repair_once(text: str) -> dict[str, object]:
    try:
        value = json.loads(text)
    except json.JSONDecodeError as error:
        # 关键状态变化：只把错误交给调用方，不执行模型返回的任何表达式。
        raise ValueError(f"parse failed: {error.msg}") from error
    if not isinstance(value, dict):
        raise ValueError("top-level object required")
    return value


print(repair_once('{"ok": true}'))
# 输出：{'ok': True}
```

真正的“再请求模型修复”需要单独的 retry budget、原始响应和幂等策略；不要在解析函数内部递归调用模型，否则很容易造成重试风暴和难以追踪的输入变化。

## 流式结构化输出

流式响应到达时，单个 delta 往往不是完整 JSON，不能每收到一小段就把它当最终对象。应按事件顺序拼装、在完成事件后解析，再执行 Schema 和业务校验。若 UI 需要展示部分字段，可以使用增量解析器，但它的“不完整状态”不能触发副作用。

具体的 Delta、结束事件、断线和重复事件见[Streaming、Delta 与模型事件](./08-Streaming-Delta与模型事件)。

## 四个主线项目中的对应位置

### smolagents：结构化结果和模型输出的消费

smolagents 的模型输出可能被 Agent 步骤、代码执行或工具参数消费。阅读时确认框架在哪里解析 JSON、哪里验证字段、哪里把结果传给执行器；如果某类模型只返回文本，结构化约束可能完全由应用模板和本地校验承担。

### OpenAI Agents SDK：输出类型与验证层

OpenAI Agents SDK 支持以结构化输出类型描述 Agent 结果，运行时会在模型响应和最终结果之间执行解析/校验。源码阅读时分开看“模型端格式约束”“SDK 类型解析”“应用业务验证”；类型成功不代表业务事实或权限成立。

### LangGraph：把结构化结果写入 State

LangGraph 节点常把模型结果写入 State 并由后续节点消费。关键是校验发生在写 State 前还是后，checkpoint 是否保存了未校验草稿，以及失败节点重试会不会重复副作用。Schema 通过应是状态转换的前置条件。

### DeepSeek Harness：插件/事件中的结构化协议

DeepSeek Harness 的插件和事件可能定义自己的 payload 类型。阅读源码时找 schema 声明、解析入口和错误事件，确认未知字段与版本如何处理；开发预览期不要把内部 payload 当长期公共协议。

## 易混点

- JSON 可解析不等于字段齐全；Schema 通过也不等于事实正确。
- JSON Schema 是数据形状契约，不是权限批准或事实来源。
- 模型自报 `confidence` 未经校准不能当概率真值。
- 额外字段是拒绝还是忽略，必须由版本化契约决定。
- 流式 delta 未完成前不能触发 Schema 成功或外部副作用。
- 解析重试、格式修复和业务拒绝是不同失败；不能全部无限重试。
- 绝不能用 `eval` 执行模型返回的“结构化”文本。

## 课后小问

1. `{"status":"ok","answer":123,"confidence":0.9}` 为什么不能直接进入业务代码？

   答案：JSON 语法正确，但 `answer` 类型违反 Schema。先做类型校验再构造领域对象，可以把失败固定为 SchemaError，而不是让下游出现隐蔽类型问题。

2. 为什么 Schema 通过仍要做业务校验？

   答案：Schema 只能检查形状、类型和枚举，无法知道数据库状态、权限或跨字段业务条件。业务规则需要可信数据和确定性代码。

3. 结构化解析失败时，为什么最多只尝试有限修复？

   答案：每次模型调用都可能改变答案、消耗成本并触发限流；无限修复会形成重试风暴。应限制次数、保留原始错误，并在最终失败时给出可观测结果。

## 本节小结

可靠的 Structured Output 不是让模型“保证 JSON”，而是把模型文本经过解析、Schema 校验和业务校验，最后才交给下游。服务端严格模式可以减少格式错误，不能替代本地验证、权限和事实检查。流式结果必须等完成事件再判定，失败重试要有限、可观测且不重复副作用。

## 快速回顾

- 解析：`json.loads`，不执行模型文本。
- 结构：必填、类型、枚举、额外字段和版本。
- 语义：跨字段规则、外部事实和权限另行验证。
- 流式：先拼装完成，再解析和校验。
- 失败：区分 Parse、Schema、Business，限制修复与重试。
