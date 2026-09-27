---
title: PyTorch 2.x 速查路线
author: 阿源
date: 2026/09/27
categories:
  - 深度学习快速入门
tags:
  - PyTorch
  - 深度学习
  - 速查
---

# PyTorch 2.x 速查路线

这篇是 PyTorch 目录的入口和路线图。示例以 Python 3.11+、PyTorch 2.x 为基线，默认先在 CPU 上运行；需要 GPU 时统一使用 `torch.cuda.is_available()` 做安全判断。Tensor、自动求导、数据加载、模型、训练、保存和迁移学习分别拆到专题页，遇到 API 时可以直接跳到对应章节。

## 学习目标

- 建立“数据 Tensor → Dataset/DataLoader → Module → loss → optimizer → checkpoint → inference”的完整心智模型。
- 知道训练态与推理态、梯度与参数、CPU 与 GPU 之间的边界。
- 能按专题页复制最小可运行片段，再逐步替换为自己的数据集和模型。

## 核心知识点

| 阶段 | 主要对象 | 首选专题 |
| --- | --- | --- |
| 数据表示 | `torch.Tensor`、shape、dtype、device | [Tensor 与设备](./05-PyTorch-Tensor与设备.md) |
| 梯度计算 | `requires_grad`、`backward`、`no_grad` | [Autograd 与反向传播](./06-PyTorch-Autograd与反向传播.md) |
| 数据输入 | `Dataset`、`DataLoader`、batch | [Dataset 与 DataLoader](./07-PyTorch-Dataset与DataLoader.md) |
| 模型定义 | `nn.Module`、层、`train/eval` | [nn.Module 与模型结构](./08-PyTorch-nn.Module与模型结构.md) |
| 参数更新 | 损失、优化器、训练循环 | [损失函数、优化器与训练循环](./09-PyTorch-损失函数优化器与训练循环.md) |
| 工程化 | `state_dict`、checkpoint、推理 | [模型保存、加载与推理](./10-PyTorch-模型保存加载与推理.md) |
| 加速与复用 | `device`、冻结参数、迁移学习 | [GPU 与迁移学习](./11-PyTorch-GPU与迁移学习.md) |

PyTorch 的核心约定是：模型参数属于 `nn.Module`，输入和标签是 Tensor，前向计算产生 loss，`loss.backward()` 计算梯度，优化器的 `step()` 更新参数。保存时优先保存 `state_dict`，因为它只描述参数，不把 Python 类定义和运行环境一起锁死。

## 常用用法

### `torch.__version__`：确认版本

```python
import torch

print(torch.__version__)
# 输出：2.x 版本号（具体小版本取决于当前环境）
```

版本号只用于定位文档和兼容性问题；安装命令应根据操作系统、Python、CUDA/ROCm 和驱动从 [PyTorch 官方选择器](https://pytorch.org/get-started/locally/)生成，不要照抄别人的 CUDA 命令。

### `torch.manual_seed`：固定随机性

```python
import torch

torch.manual_seed(7)
values = torch.rand(3)
print(values.shape)
# 输出：torch.Size([3])
```

固定种子方便复现实验，但不保证所有硬件、算子和多进程 DataLoader 都完全逐位一致；正式实验应同时记录版本、数据划分和配置。

### `torch.device` 与 `torch.cuda.is_available`：选择计算设备

```python
import torch

device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
sample = torch.ones(2, device=device)
print(sample.device)
# 输出：cpu，或可用时的 cuda:0
```

设备选择集中放在入口处，之后把模型、输入和标签都迁移到同一个 `device`。不要在每个 batch 内重新判断设备。

### 端到端最小训练骨架：串起主要对象

```python
import torch
from torch import nn

torch.manual_seed(7)
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
model = nn.Linear(2, 1).to(device)
features = torch.tensor([[1.0, 2.0], [2.0, 1.0]], device=device)
targets = torch.tensor([[3.0], [3.0]], device=device)
optimizer = torch.optim.SGD(model.parameters(), lr=0.1)
criterion = nn.MSELoss()

model.train()
optimizer.zero_grad(set_to_none=True)
loss = criterion(model(features), targets)
loss.backward()
optimizer.step()
print(loss.item())
# 输出：训练损失的浮点数（会随初始化和设备略有变化）
```

真正的数据集训练通常把 `features` 和 `targets` 换成 DataLoader 产生的 batch，把模型换成自定义 `nn.Module`；更新顺序仍保持 `zero_grad → forward → loss → backward → step`。

## 不常用但需要知道

### `torch.set_default_dtype`：设置浮点默认类型

```python
import torch

old_dtype = torch.get_default_dtype()
torch.set_default_dtype(torch.float64)
created = torch.ones(2)
torch.set_default_dtype(old_dtype)
print(created.dtype)
# 输出：torch.float64
```

全局默认 dtype 会影响后续创建的浮点 Tensor，容易让内存和计算变慢；库代码通常显式写 dtype，而不是长期修改全局状态。

### `torch.set_grad_enabled`：按条件启用梯度

```python
import torch

training = False
x = torch.ones(2, requires_grad=True)
with torch.set_grad_enabled(training):
    y = x * 2
print(y.requires_grad)
# 输出：False
```

一般推理优先使用 `torch.inference_mode()`；这个 API 更适合需要根据训练标志统一包裹代码的库函数。

## 易混点

- `torch.Tensor` 是数据容器，不等于 Python 列表；模型计算前要确认 `shape`、`dtype` 和 `device`。
- `model.train()` / `model.eval()` 只切换模块行为，不会自动开启或关闭梯度；推理通常组合 `model.eval()` 和 `torch.inference_mode()`。
- `optimizer.zero_grad()` 清的是参数梯度，不是把模型参数重置为零；梯度默认会累积。
- `loss.item()` 把单元素 Tensor 转成 Python 数值用于日志；不要用已经废弃的 `loss.data` 绕过 autograd。
- `state_dict` 是参数/缓冲区映射，加载它前仍要先创建结构相同的模型实例。

## 课后小问

1. 为什么训练循环不能只写 `loss.backward()` 而不写 `optimizer.step()`？

   答案： `backward()` 只根据当前计算图计算并累积参数梯度，`step()` 才会按照优化器规则用梯度修改参数。

   解析： 两者是“求方向”和“执行更新”的分工。还要在下一个 batch 前调用 `zero_grad()`，否则旧梯度会与新梯度相加。

2. 为什么入口页的设备判断使用 `torch.cuda.is_available()`，而不是直接写 `cuda:0`？

   答案： 因为不同机器可能没有 NVIDIA GPU、驱动不可用或只有 CPU，直接写 `cuda:0` 会在这些环境报错。

   解析： 用安全分支得到 `cpu` 或 `cuda` 后，让模型和 batch 统一 `.to(device)`，同一份示例就能在 CPU 和 GPU 上运行。

## 本节小结

PyTorch 速查可以沿着一条主线阅读：先掌握 Tensor 的 shape/dtype/device，再理解 autograd；随后用 Dataset/DataLoader 组织 batch，用 `nn.Module` 描述模型，最后用损失、优化器和训练循环更新参数。保存和 GPU 页面解决工程化与性能边界，02–04 页则保留 MMLAB、OpenCV、YOLO 等相邻主题，不在这里重复正文。

## 快速回顾

```text
Tensor（数据）
  → Dataset/DataLoader（batch）
  → nn.Module（前向）
  → loss（目标）
  → backward（梯度）
  → optimizer.step（更新）
  → state_dict（保存）
  → eval + inference_mode（推理）
```
