---
title: Dataset 与回归评测
author: 阿源
date: 2026/10/09 00:00
categories: [Agent 开发]
tags: [Evals, Dataset, Regression]
status: 正文
chapter: 10
---

# Dataset 与回归评测

## 学习目标

- 能设计可版本化的 Agent 评测数据集，而不是把几个手工问题散落在脚本里。
- 能区分 Golden Task、fixture、运行轨迹、断言和评测报告。
- 能选择答案、轨迹、工具、安全和成本等不同层次的指标。
- 能理解数据泄漏、样本偏差和回归门禁，知道什么结果不能直接下结论。

## 前置知识

需要理解 [Trace、Span 与事件日志](./01-Trace-Span与事件日志) 以及第 08 章的 RetrievalEval/GenerationEval。本文用 Python 标准库实现一个离线回归评测器，不依赖真实模型。

## 核心知识点

### Dataset 不只是问题列表

评测 Dataset 是可复现输入、期望行为和评测元数据的集合。一个最小样本至少要说明：

- id：稳定的样本标识，不能用数组下标代替。
- input：用户任务或消息。
- expected：可判定的目标，例如必须包含字段、必须拒绝某工具。
- tags：场景、风险、语言、难度和来源。
- fixture：模型、工具、数据库和时间等外部依赖的固定环境。
- version：数据集版本和变更原因。

如果只保存问题和人工印象，下一次运行无法判断“系统变差”还是“题目、工具、模型变了”。数据集本身也要像代码一样进行评审和变更记录。

### GoldenTask 的边界

GoldenTask 是有明确验收条件的代表性任务，不是“唯一正确的自然语言答案”。对 Agent，golden 可以描述：

- 最终结果的字段或事实必须满足什么条件。
- 必须经过哪些工具，禁止调用哪些工具。
- 遇到权限或不确定信息时必须停下并请求确认。
- 最大步数、最大成本和允许的延迟。

一个任务可以有多个合法答案。把生成文本逐字比较当成唯一指标，常常会把正确的改写判成失败。

### Fixture 与隔离

Fixture 是运行时固定的外部环境，例如假的天气工具、内存数据库和冻结时间。它的作用是把模型或代码的变化与网络、数据和时间变化隔离开。

常见隔离层次：

1. 工具 Fixture：拦截真实网络和写操作。
2. 数据 Fixture：使用只读快照或临时数据库。
3. 模型 Fixture：使用确定性策略、录制响应或固定测试模型。
4. 进程 Fixture：清空环境变量、工作目录和缓存。

离线回归应该默认禁止真实付款、发信、删除文件和访问生产数据库。需要真实服务的测试应单独标记为集成或演练，不与普通提交门禁混在一起。

### 回归评测的指标分层

建议从硬到软分层：

- **协议/结构**：JSON 是否可解析、必需字段是否存在、工具参数是否符合 Schema。
- **行为/轨迹**：是否调用了允许的工具、是否遵守顺序和步数、是否在危险动作前请求审批。
- **结果/事实**：答案是否包含关键事实、数值误差是否在范围内、引用是否来自允许来源。
- **质量/偏好**：表达清晰度、完整性、帮助程度，可使用 LLM-as-Judge 或人工抽样。
- **工程指标**：成功率、P95 延迟、token/cost、重试率、超时率和安全拒绝率。

先判定硬门禁，再看质量分数。平均分上升但安全违规增加，不能算回归通过。

### 基线、回归与门禁

把当前版本称为 baseline，把待测版本称为 candidate。不要只比较总分，应同时比较：

- 总体通过率与置信区间。
- 每个标签、风险等级和难度桶的通过率。
- 关键样本是否从通过变为失败。
- 延迟、成本和工具错误率是否超过预算。

门禁是发布决策，不是统计魔法。小数据集的 1 次失败可能只是波动，但高风险样本的 1 次越权也可能必须阻断发布。阈值要与风险和样本量一起记录。

## 评测数据流

~~~mermaid
flowchart LR
    Dataset["版本化 Dataset"] --> Runner["隔离 Runner"]
    Fixture["模型/工具/数据 Fixture"] --> Runner
    Runner --> Trace["Trace + Result"]
    Trace --> Assertions["结构/行为/事实断言"]
    Assertions --> Judge["质量判分或人工抽样"]
    Assertions --> Report["按标签聚合"]
    Judge --> Report
    Report --> Gate{"回归门禁"}
    Gate -->|通过| Release["允许发布"]
    Gate -->|失败| Investigate["保留样本并排查"]
    classDef core fill:transparent,stroke:currentColor,color:currentColor,stroke-width:1px;
    class Dataset,Fixture,Runner,Trace,Assertions,Judge,Report,Gate,Release,Investigate core;
~~~

图中的 Runner 必须把环境固定，否则报告只是“这一次网络和模型的结果”。门禁失败后保留完整样本、轨迹和版本，先复现再修改。

## 一个最小的离线回归评测器

用途：下面的例子用固定策略模拟 Agent，按样本执行、检查结构和行为，并与基线比较。真实项目只需替换 run_case，不要改变报告和门禁的语义。

~~~python
from dataclasses import dataclass


@dataclass(frozen=True)
class GoldenTask:
    case_id: str
    prompt: str
    expected_answer: str
    allowed_tools: tuple[str, ...]
    tags: tuple[str, ...] = ()


DATASET = (
    GoldenTask("sum-01", "计算 2+3", "5", (), ("deterministic",)),
    GoldenTask("search-01", "查找文档", "found", ("search_docs",), ("tool",)),
)


def run_case(task):
    if task.case_id == "sum-01":
        return {"answer": "5", "tools": [], "trace_status": "ok"}
    return {"answer": "found", "tools": ["search_docs"], "trace_status": "ok"}


def evaluate(task, result):
    answer_ok = task.expected_answer in result["answer"]
    tools_ok = set(result["tools"]) <= set(task.allowed_tools)
    return {
        "case_id": task.case_id,
        "answer_ok": answer_ok,
        "tools_ok": tools_ok,
        "passed": answer_ok and tools_ok and result["trace_status"] == "ok",
        "tags": task.tags,
    }


report = [evaluate(task, run_case(task)) for task in DATASET]
passed = sum(item["passed"] for item in report)
pass_rate = passed / len(report)
print(f"passed={passed}/{len(report)} pass_rate={pass_rate:.0%}")
# 输出：passed=2/2 pass_rate=100%
~~~

这个例子只展示确定性门禁。真实评测还要保存 dataset_version、code_version、model_version、fixture_version、seed 和运行时间；否则两个 100% 很可能不是同一个实验。

## 防止数据泄漏与判定失真

### 训练数据泄漏

如果题目、答案或轨迹已经出现在模型训练、提示模板或缓存中，分数不能代表泛化能力。应将评测集与开发集、提示调优集分离，必要时使用私有、时间切分或新生成的样本，并记录来源。

### 工具和答案泄漏

如果工具 Fixture 直接返回 expected_answer，Agent 可能只是在读取答案。Fixture 应模拟真实接口的噪声、错误和权限，但不能把验收标签混入模型上下文。

### 样本偏差

只测成功、中文、短问题或单一工具，会高估质量。按任务类型、风险、长度、语言和失败原因分桶；总体分数之外必须显示每个桶。

### 版本混淆

更换模型、系统提示、工具 Schema、检索数据或评测器，都可能改变结果。报告必须记录这些版本，不能把“重新跑了一遍”叫作代码回归。

## 源码阅读锚点

- OpenAI Evals：看 Registry、Task、Run 和记录结果如何分离，重点理解评测定义与执行器边界。
- LangSmith Evaluation：对照 dataset、target、evaluator 和 experiment 的数据流。
- OpenAI Agents SDK：结合 tracing 和 run result，查一次运行如何生成可评测轨迹。
- DeepSeek Harness：寻找任务样本、工具环境和事件轨迹的落盘位置，确认测试是否真的隔离副作用。

## 易混点

- **Dataset 不等于生产日志**：日志是观测记录，Dataset 是经过选择和版本化的评测输入。
- **通过率不等于质量**：还要看分桶、风险、成本、延迟和关键失败样本。
- **Fixture 不等于真实环境**：它提高可复现性，但不能替代少量受控集成测试。
- **高分不等于无泄漏**：题目过拟合、答案泄漏和 judge 偏差都会虚高分数。
- **门禁不等于任意阈值**：阈值必须结合风险、样本量和发布策略解释。

## 课后小问（含解析）

### 问题 1：为什么 golden task 不建议逐字比较最终答案？

**答案**：一个目标可能有多个等价的正确表达。

**解析**：逐字比较会把换序、同义表达和额外说明误判为失败。应按结构、事实、行为和安全要求分层断言，只有格式契约才适合严格比较。

### 问题 2：回归评测中为什么要记录 Fixture 版本？

**答案**：外部工具和数据变化也会改变结果。

**解析**：如果天气、搜索索引或时间没有固定，结果变化无法归因于代码。Fixture 版本让失败可以复现，并提醒我们哪些结论只适用于模拟环境。

### 问题 3：所有样本通过但高风险样本越权一次，可以发布吗？

**答案**：不能仅凭总体通过率发布。

**解析**：安全违规应作为独立门禁，可能需要阻断发布、保留轨迹并进行人工复核。平均分不能抵消高风险边界失败。

## 本节小结

Dataset 用版本化任务描述评测范围，Fixture 固定外部环境，Runner 产生轨迹，断言和 Judge 生成报告，门禁决定是否发布。可靠回归不只看平均分，还要检查分桶、风险、成本、延迟、数据泄漏和判分偏差。

## 快速回顾

- 能写出 Dataset、GoldenTask 和 Fixture 的最小字段。
- 能区分结构、行为、事实、质量和工程指标。
- 能解释 baseline/candidate、关键样本和回归门禁。
- 下一篇将学习确定性断言与 LLM-as-Judge 的组合边界。

## 官方依据

- [OpenAI Evals](https://github.com/openai/evals)
- [LangSmith evaluation concepts](https://docs.langchain.com/langsmith/evaluation-concepts)
- [OpenAI Agents SDK tracing](https://openai.github.io/openai-agents-python/tracing/)
