---
title: 确定性断言与 LLM-as-Judge
author: 阿源
date: 2026/10/09 00:00
categories: [Agent 开发]
tags: [Evals, Judge, Assertions]
status: 正文
chapter: 10
---

# 确定性断言与 LLM-as-Judge

## 学习目标

- 能为结构、工具轨迹、安全和最终答案选择确定性断言。
- 能解释 LLM-as-Judge 适合评估什么，以及它为什么不是绝对真值。
- 能设计 Rubric、评分理由、校准样本和人工复核流程。
- 能把 judge 放在软质量指标中，不让一个不稳定的模型评分绕过硬安全门禁。

## 前置知识

需要理解 [Dataset 与回归评测](./02-Dataset与回归评测) 和第 03 章的 Structured Output。示例不调用真实 LLM，用一个固定 judge 函数说明接口和偏差。

## 核心知识点

### 确定性断言是什么

确定性断言是给定同一个输入，结果应稳定一致的检查。它不一定只检查字符串相等，常见类型包括：

- Schema 断言：结果能否解析成约定的 JSON，字段类型是否正确。
- 事实断言：必需事实是否存在，数值误差是否在阈值内。
- 轨迹断言：必须调用或禁止调用哪些工具，顺序、次数和参数是否合规。
- 安全断言：是否在外发、删除、付款前经过审批，是否把秘密放进输出。
- 工程断言：最大步数、超时、token、成本和错误重试是否超过预算。

确定性断言应该先执行，因为它便宜、可解释、容易复现。失败消息要说明“哪条规则、观察到什么、期望什么”，不要只返回 False。

### LLM-as-Judge 是什么

LLM-as-Judge 是使用一个模型按照明确的 Rubric 对回答或轨迹评分。它适合处理难以写成规则的质量问题，例如解释是否清楚、回答是否覆盖用户意图、多个合法方案哪个更有帮助。

它的输出应当结构化，包括：

- score：有限且定义清楚的等级。
- rubric_id：使用的评分标准版本。
- reasons：引用输入或轨迹证据的简短理由。
- violations：具体违反了哪些条件。
- confidence：仅表示 judge 对这次评分的自评，不是概率真值。

Judge 只能看到被授权的评测输入，不应看到 hidden label、实现版本秘密或不该暴露的内部字段。

### Rubric 如何写

一个好的 Rubric 每个维度只评估一件事，并给出锚点。例如“事实完整性 0–2 分”：

- 0：遗漏关键事实或出现与证据矛盾的结论。
- 1：主要事实正确，但缺少一个非关键限定。
- 2：关键事实完整且没有超出证据的断言。

不要把“专业、详细、好看”写成一条不可操作的标准。指定输入、证据、维度、等级、反例和拒绝条件，必要时要求 judge 先列证据再给分。

### 评分答案与评分轨迹

答案 judge 只看最终回答，容易忽略 Agent 做了危险工具调用后又在文字里道歉。轨迹 judge 应同时查看：

- 模型提出的 Action。
- 实际执行的 Tool Call。
- 权限和审批结果。
- Observation 是否被真实回填。
- 最终结果是否与轨迹一致。

安全和契约必须用确定性断言锁死；judge 只能评价剩余的开放性质量。

### Judge 的偏差与校准

常见偏差包括：

- 长答案偏好：更长不等于更完整。
- 位置偏差：比较两个答案时偏爱先出现或后出现者。
- 风格偏差：把措辞风格当事实正确。
- 自我偏好：judge 偏爱自己的生成方式。
- 证据遗漏：没有看到工具轨迹却对事实下结论。

校准方法：

1. 用人工已判定的正例、负例和边界例建立 calibration set。
2. 先让 judge 单独评分，再与人工结果比较。
3. 调整 Rubric、输入证据和输出格式，不要只调阈值。
4. 持续抽样人工复核，并记录 judge 版本。

## 断言与 Judge 的组合

~~~mermaid
flowchart TD
    Run["Agent Run / Trace"] --> Hard["确定性断言"]
    Hard -->|结构/安全失败| Block["阻断并保留证据"]
    Hard -->|通过| Soft["LLM-as-Judge / 人工抽样"]
    Soft --> Calibrate["Rubric 与校准"]
    Calibrate --> Report["分层评测报告"]
    Report --> Gate{"发布门禁"}
    Gate -->|硬门禁通过且质量达标| Release["候选发布"]
    Gate -->|任一关键条件失败| Fix["修复或人工复核"]
    classDef core fill:transparent,stroke:currentColor,color:currentColor,stroke-width:1px;
    class Run,Hard,Block,Soft,Calibrate,Report,Gate,Release,Fix core;
~~~

阅读顺序是先硬后软：结构和安全失败不应被 judge 的高分抵消；judge 的低分则需要结合 Rubric、样本和人工复核判断。

## 一个确定性断言与固定 Judge 示例

用途：下面的例子展示断言如何返回可解释的失败，以及 judge 如何按 Rubric 输出结构化结果。固定 judge 只是教学替身，生产中要记录模型版本并做校准。

~~~python
import json
from dataclasses import dataclass


@dataclass(frozen=True)
class Check:
    name: str
    passed: bool
    reason: str


def deterministic_checks(result, trace):
    if not isinstance(result, dict):
        return [Check("json_shape", False, "结果必须是对象")]
    checks = [
        Check("json_shape", isinstance(result, dict), "结果必须是对象"),
        Check("answer_present", bool(result.get("answer")), "answer 不能为空"),
        Check(
            "tool_allowlist",
            set(trace.get("tools", [])) <= {"search_docs"},
            "只能调用 search_docs",
        ),
    ]
    return checks


def fixed_judge(answer, rubric):
    words = {"事实": "包含事实", "清晰": "分点说明"}
    reasons = [text for key, text in words.items() if key in answer]
    score = 2 if len(reasons) == len(words) else 1 if reasons else 0
    return {
        "rubric_id": rubric,
        "score": score,
        "reasons": reasons,
        "confidence": "教学示例，不代表概率",
    }


result = {"answer": "事实已核对，内容清晰，分点说明如下。"}
trace = {"tools": ["search_docs"]}
hard = deterministic_checks(result, trace)
soft = fixed_judge(result["answer"], "answer-quality-v1")
print(json.dumps({
    "hard_passed": all(check.passed for check in hard),
    "judge": soft,
}, ensure_ascii=False))
# 输出：{"hard_passed": true, "judge": {"rubric_id": "answer-quality-v1", "score": 2, "reasons": ["包含事实", "分点说明"], ...}}
~~~

如果把 result 改成字符串，deterministic_checks 会先返回 json_shape 失败，而不会调用 result.get；如果把 search_docs 改成 delete_file，hard_passed 必须为 False，即使 judge 觉得回答很清晰，也不能通过安全门禁。

## 哪些问题适合哪种方法

### 适合确定性断言

Schema、必填字段、工具白名单、审批状态、引用 ID、步数、超时、成本和秘密检测都应优先使用规则。规则失败时要输出证据，便于回归。

### 适合 LLM-as-Judge

多种回答均可能正确时，可让 judge 对完整性、相关性、解释清晰度和用户帮助程度进行分级。但要提供事实来源、工具轨迹和明确 Rubric。

### 适合人工复核

新风险、Rubric 边界、judge 与人工差异较大、高影响决策和生产事故样本，不能只靠自动 judge。人工结果还应回流到 calibration set。

## 源码阅读锚点

- OpenAI Evals：观察 evaluator 如何把样本、模型输出和评分器分开。
- LangSmith：重点看 evaluator 返回标量、反馈理由和实验比较的接口。
- OpenAI Agents SDK：把 tracing 中的工具事件交给轨迹断言，而不是只看最终文本。
- DeepSeek Harness：查评测入口是否能保存完整动作链，确认“输出正确”没有掩盖工具越权。

## 易混点

- **Judge 不是事实数据库**：它的分数必须有证据和 Rubric 支撑。
- **分数高不等于安全**：安全边界应由确定性规则或审批机制阻断。
- **结构化输出不等于正确**：JSON 可解析并不保证事实和权限合规。
- **confidence 不是真概率**：它只是 judge 的自评字段，不能替代校准。
- **多模型一致不等于真相**：共享训练偏差可能让多个 judge 同时错。

## 课后小问（含解析）

### 问题 1：为什么工具白名单不交给 LLM-as-Judge 判断？

**答案**：工具白名单是硬安全约束，应该由确定性代码执行。

**解析**：judge 可能漏读轨迹、受语言表述影响或给出不稳定评分。权限和审批必须在工具执行前用规则阻断，judge 最多补充质量分析。

### 问题 2：judge 评分下降，能直接改模型提示吗？

**答案**：不能直接改。

**解析**：先确认样本、Fixture、Rubric、judge 版本和人工标注是否一致，再查看失败样本。否则可能是在追逐 judge 偏差，而不是修复 Agent。

### 问题 3：什么时候必须人工复核？

**答案**：新风险类型、边界样本、自动评分与事实证据矛盾或高影响决策时。

**解析**：自动化适合扩大覆盖率，人工复核负责校准和处理不可形式化的边界。人工结果应沉淀为新的样本和 Rubric 案例。

## 本节小结

先用确定性断言锁住结构、轨迹、权限和工程预算，再用 LLM-as-Judge 评估开放性的答案质量；两者都需要版本、证据和失败样本。Judge 是有偏的测量工具，不是真理来源，必须用校准集和人工抽样持续检查。

## 快速回顾

- 能把一个需求拆成硬断言和软 Rubric。
- 能说明 judge 为什么需要证据、结构化输出和版本。
- 能识别长答案偏好、位置偏差和样本泄漏。
- 下一篇将把断言前移到输入、输出和工具边界，形成 Guardrail。

## 官方依据

- [OpenAI Evals](https://github.com/openai/evals)
- [LangSmith evaluation concepts](https://docs.langchain.com/langsmith/evaluation-concepts)
- [OpenAI Agents SDK guardrails](https://openai.github.io/openai-agents-python/guardrails/)
