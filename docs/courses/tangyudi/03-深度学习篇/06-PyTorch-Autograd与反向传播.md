---
title: PyTorch Autograd 与反向传播
author: 阿源
date: 2026/09/27
categories:
  - 深度学习快速入门
tags:
  - PyTorch
  - Autograd
  - 反向传播
---

# PyTorch Autograd 与反向传播

Autograd 会记录由 Tensor 运算组成的计算图，并在调用 `backward()` 时使用链式法则计算梯度。训练时要主动管理三个边界：哪些 Tensor 需要梯度、什么时候释放或保留计算图、推理时如何关闭梯度。

## 学习目标

- 用 `requires_grad`、`backward` 和 `.grad` 完成最小梯度计算。
- 理解梯度累积、计算图释放、`detach` 和 `zero_grad`。
- 正确区分 `torch.no_grad()`、`torch.inference_mode()` 与 `model.eval()`。

## 核心知识点

- Autograd 主要服务于浮点 Tensor；整数标签通常不需要梯度。
- 叶子 Tensor 的梯度通常存放在 `.grad`；中间节点若要观察梯度需显式 `retain_grad()`。
- `backward()` 默认把梯度累积到参数的 `.grad`，不会自动清零。
- 一次反向传播后计算图通常被释放；需要重复反向时才考虑 `retain_graph=True`。
- `no_grad` 关闭记录，`inference_mode` 进一步减少推理开销；二者都不等于 `eval()`。

## 常用用法

### `requires_grad=True`：声明需要求导的 Tensor

```python
import torch

weight = torch.tensor(2.0, requires_grad=True)
value = weight * 3
print(weight.requires_grad, value.requires_grad)
# 输出：True True
```

一般只让模型参数和需要优化的输入开启梯度；数据预处理和标签不必开启。

### `backward()` 与 `.grad`：计算一阶梯度

```python
import torch

weight = torch.tensor(2.0, requires_grad=True)
loss = (weight * 3) ** 2
loss.backward()
print(weight.grad.item())
# 输出：36.0
```

这里 `loss = 9 * weight²`，在 `weight=2` 处导数是 36。实际训练中对标量 loss 调用 `backward()` 最常见。

### 非标量输出：给 `backward` 提供梯度

```python
import torch

values = torch.tensor([1.0, 2.0], requires_grad=True)
outputs = values**2
outputs.backward(torch.ones_like(outputs))
print(values.grad.tolist())
# 输出：[2.0, 4.0]
```

非标量 Tensor 没有唯一的“总梯度”，需要传入同形状的向量作为 `gradient`，等价于对向量做加权求和后反向传播。

### `zero_grad`：清理累积梯度

```python
import torch

weight = torch.tensor(2.0, requires_grad=True)
(weight * 2).backward()
first = weight.grad.item()
weight.grad = None
(weight * 3).backward()
print(first, weight.grad.item())
# 输出：4.0 3.0
```

优化器代码通常用 `optimizer.zero_grad(set_to_none=True)` 清理参数梯度；用 `None` 能让框架在下次反向时重新分配梯度。

### `torch.no_grad()`：暂时关闭梯度记录

```python
import torch

weight = torch.tensor(2.0, requires_grad=True)
with torch.no_grad():
    prediction = weight * 3
print(prediction.requires_grad)
# 输出：False
```

验证和推理阶段可以使用它；如果还要切换 Dropout、BatchNorm 等模块行为，需要另外调用 `model.eval()`。

### `torch.inference_mode()`：推理专用上下文

```python
import torch

weight = torch.tensor(2.0, requires_grad=True)
with torch.inference_mode():
    prediction = weight * 3
print(prediction.requires_grad)
# 输出：False
```

`inference_mode` 适合不需要 autograd、也不会把结果重新接回训练图的推理路径；要把结果交回可求导流程时，使用 `no_grad` 或明确 `detach` 并检查边界。

### `detach()`：切断计算图

```python
import torch

source = torch.tensor(2.0, requires_grad=True)
feature = (source * 3).detach()
print(feature.requires_grad)
# 输出：False
```

把特征送进另一个不希望反向影响上游的模块、保存日志或转换 NumPy 时，先 `detach()`；不要用 `.data`。

## 不常用但需要知道

### `retain_grad()`：观察中间节点梯度

```python
import torch

weight = torch.tensor(2.0, requires_grad=True)
hidden = weight * 3
hidden.retain_grad()
loss = hidden**2
loss.backward()
print(hidden.grad.item())
# 输出：12.0
```

非叶子 Tensor 默认不保留 `.grad`，调试梯度流或写研究代码时才需要 `retain_grad()`，生产训练不要为大量中间节点保留梯度。

### `autograd.grad`：直接取梯度而不写入 `.grad`

```python
import torch

weight = torch.tensor(2.0, requires_grad=True)
loss = weight**3
gradient = torch.autograd.grad(loss, weight)
print(gradient[0].item(), weight.grad)
# 输出：24.0 None
```

`autograd.grad` 常用于梯度惩罚、元学习和高阶导数；普通参数训练优先使用 `loss.backward()` 配合优化器。

### `create_graph=True`：构建高阶导数图

```python
import torch

weight = torch.tensor(2.0, requires_grad=True)
first = torch.autograd.grad(weight**3, weight, create_graph=True)[0]
second = torch.autograd.grad(first, weight)[0]
print(first.item(), second.item())
# 输出：12.0 12.0
```

高阶图会占用更多显存，并让生命周期更复杂；只在确实需要二阶优化或梯度惩罚时开启。

### `torch.autograd.set_detect_anomaly`：定位反向异常

```python
import torch

with torch.autograd.set_detect_anomaly(True):
    value = torch.tensor(1.0, requires_grad=True)
    loss = value * value
    loss.backward()
print(value.grad.item())
# 输出：2.0
```

异常检测会记录更多信息并显著变慢，只应在定位 NaN 或反向报错时短暂开启，不能作为常驻训练选项。

## 易混点

- `model.eval()` 改变模块行为，`torch.no_grad()` 改变梯度记录；验证循环通常两个都要用。
- `zero_grad` 是清梯度，不是清计算图；计算图由 Tensor 运算和反向生命周期决定。
- `detach()` 返回不追踪梯度的 Tensor，`clone()` 主要解决数据存储复制；两者可以组合为 `detach().clone()`。
- `retain_graph=True` 不是“让训练更稳定”的开关，会增加内存；先检查是否意外重复使用同一计算图。
- 训练中记录 loss 应使用 `loss.item()` 或 `loss.detach()`，不要把整张计算图存进列表。

## 课后小问

1. 为什么同一个 `loss` 连续调用两次 `backward()` 往往会报计算图已释放？

   答案： 第一次反向传播后，Autograd 默认释放中间缓存；第二次再使用同一图时所需节点已经不存在。

   解析： 先判断是否真的需要重复反向。需要时可以重新做一次前向，或在特殊场景使用 `retain_graph=True` 并承担额外内存成本。

2. 为什么训练循环里的梯度会“越跑越大”？

   答案： 参数 `.grad` 默认累积，若每个 batch 前不清零，当前梯度会与历史 batch 梯度相加。

   解析： 这是 PyTorch 的明确设计，支持梯度累积训练；普通 batch 更新用 `optimizer.zero_grad(set_to_none=True)`，有意累积时则按步数缩放 loss。

## 本节小结

Autograd 的最小闭环是“创建需要梯度的 Tensor → 前向得到标量 loss → `backward()` → 读取或交给 optimizer 更新”。训练前清梯度，推理时组合 `eval()` 与 `inference_mode()`，调试高阶或异常路径时再使用低频 API。

## 快速回顾

```text
requires_grad → forward → loss
                      ↓
                  backward
                      ↓
              parameter.grad
                      ↓
              zero_grad / step
推理：eval + inference_mode
断图：detach
```
