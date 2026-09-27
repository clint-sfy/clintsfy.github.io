---
title: PyTorch Tensor 与设备
author: 阿源
date: 2026/09/27
categories:
  - 深度学习快速入门
tags:
  - PyTorch
  - Tensor
  - CUDA
---

# PyTorch Tensor 与设备

Tensor 是 PyTorch 中承载输入、参数、中间结果和标签的多维数组。速查 Tensor 时先看三个属性：`shape`（维度和尺寸）、`dtype`（元素类型）、`device`（所在设备）。本页默认使用 CPU；代码会在有 CUDA 时安全选择设备。

## 学习目标

- 用正确的 dtype、shape 和 device 创建 Tensor。
- 掌握索引、切片、广播、变形、拼接和常见统计操作。
- 知道 `view/reshape`、`detach/clone`、CPU/GPU 迁移之间的边界。

## 核心知识点

- `torch.tensor` 通常复制输入数据；`torch.as_tensor` 尽量复用已有内存。
- 默认浮点类型通常是 `torch.float32`；分类标签常用 `torch.int64`（别名 `torch.long`）。
- `shape` 从外层 batch 到内层特征约定为 `[batch, ...]`；卷积图像常见 `[N, C, H, W]`。
- 广播让尺寸兼容的 Tensor 自动扩展，但不会改变原 Tensor 的 shape。
- `.to(device)` 返回迁移后的 Tensor；迁移模型和数据时要使用相同的 device。

## 常用用法

### `torch.tensor`：从 Python 数据创建 Tensor

```python
import torch

features = torch.tensor([[1.0, 2.0], [3.0, 4.0]], dtype=torch.float32)
labels = torch.tensor([0, 1], dtype=torch.long)
print(features.dtype, labels.dtype, features.shape)
# 输出：torch.float32 torch.int64 torch.Size([2, 2])
```

显式指定 dtype 能避免整数输入意外参与浮点模型计算，也能让分类标签匹配 `CrossEntropyLoss` 的要求。

### `torch.zeros`、`torch.ones` 与 `torch.full`：创建固定值 Tensor

```python
import torch

zeros = torch.zeros((2, 3))
ones = torch.ones(2, 3)
filled = torch.full((2, 3), 0.5)
print(zeros.shape, float(ones.sum()), float(filled[0, 0]))
# 输出：torch.Size([2, 3]) 6.0 0.5
```

传入 `dtype=` 和 `device=` 可以一次性控制类型和设备；形状建议使用元组，阅读时更清楚。

### `torch.arange` 与 `torch.linspace`：创建序列

```python
import torch

steps = torch.arange(0, 6, 2)
points = torch.linspace(0.0, 1.0, steps=3)
print(steps.tolist(), points.tolist())
# 输出：[0, 2, 4] [0.0, 0.5, 1.0]
```

`arange` 按步长生成，浮点步长可能有累计误差；需要固定数量的等间隔点时使用 `linspace`。

### `shape`、`dtype` 与 `device`：检查 Tensor

```python
import torch

tensor = torch.randn(2, 3, dtype=torch.float32)
print(tensor.shape, tensor.dtype, tensor.device)
# 输出：torch.Size([2, 3]) torch.float32 cpu（设备可能是 cuda）
```

遇到矩阵乘法报错时，先打印这三个属性，通常比盲目调用 `reshape` 更快找到问题。

### `.to(device)`：迁移 dtype 或设备

```python
import torch

device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
features = torch.ones(2, 3, dtype=torch.float32)
moved = features.to(device)
print(moved.device, moved.dtype)
# 输出：cpu torch.float32，或可用时的 cuda:0 torch.float32
```

`.to()` 默认返回新引用；不能假设原变量已经迁移。模型通常写成 `model.to(device)`，batch 写成 `batch.to(device)`。

### 索引与切片：选择 batch 和特征

```python
import torch

batch = torch.arange(12).reshape(3, 4)
first_row = batch[0]
last_column = batch[:, -1]
middle = batch[1:, 1:3]
print(first_row.tolist(), last_column.tolist(), middle.shape)
# 输出：[0, 1, 2, 3] [3, 7, 11] torch.Size([2, 2])
```

整数索引通常会减少一个维度；如果希望保留 batch 维，使用 `batch[0:1]` 而不是 `batch[0]`。

### `reshape` 与 `flatten`：变形而不改元素数量

```python
import torch

images = torch.arange(24).reshape(2, 3, 4)
flat = images.flatten(start_dim=1)
restored = flat.reshape(2, 3, 4)
print(flat.shape, torch.equal(images, restored))
# 输出：torch.Size([2, 12]) True
```

变形前后元素总数必须相同；`flatten(start_dim=1)` 常用于把 `[N, C, H, W]` 展成 `[N, C*H*W]`。

### `cat` 与 `stack`：拼接和新增维度

```python
import torch

left = torch.ones(2, 3)
right = torch.zeros(2, 3)
joined = torch.cat([left, right], dim=0)
stacked = torch.stack([left, right], dim=0)
print(joined.shape, stacked.shape)
# 输出：torch.Size([4, 3]) torch.Size([2, 2, 3])
```

`cat` 沿已有维度拼接，其他维度必须相等；`stack` 会新增一个维度，适合把同形状样本组成 batch。

### 广播：让尺寸兼容的 Tensor 对齐

```python
import torch

scores = torch.tensor([[1.0, 2.0], [3.0, 4.0]])
bias = torch.tensor([0.5, 1.0])
shifted = scores + bias
print(shifted.tolist())
# 输出：[[1.5, 3.0], [3.5, 5.0]]
```

广播从最后一个维度开始对齐；尺寸必须相等或其中一个为 1。广播方便但也可能把错误的 shape 悄悄扩展，关键边界要显式断言。

## 不常用但需要知道

### `view` 与 `contiguous`：处理内存布局

```python
import torch

matrix = torch.arange(6).reshape(2, 3)
transposed = matrix.t()
flat = transposed.contiguous().view(-1)
print(flat.tolist())
# 输出：[0, 3, 1, 4, 2, 5]
```

`view` 要求底层内存连续；经过转置、步进切片后可以先 `.contiguous()`，或直接使用更稳妥的 `reshape()`。

### `clone`：复制数据并保留梯度关系

```python
import torch

source = torch.tensor([1.0, 2.0], requires_grad=True)
copied = source.clone()
copied[0] = 9.0
print(source.tolist(), copied.tolist())
# 输出：[1.0, 2.0] [9.0, 2.0]
```

`clone()` 会复制存储，但复制结果仍可能连接到原计算图；若还要切断梯度，使用 `source.detach().clone()`。

### `detach`：从计算图中取出不追踪梯度的视图

```python
import torch

source = torch.tensor([2.0], requires_grad=True)
detached = (source * 3).detach()
print(detached.requires_grad)
# 输出：False
```

日志、缓存 NumPy 数据或把中间结果交给非 PyTorch 代码时常用 `detach()`；不要把它当成修改参数的捷径。

### `torch.einsum`：按下标表达张量收缩

```python
import torch

left = torch.ones(2, 3)
right = torch.full((3, 4), 2.0)
product = torch.einsum("ik,kj->ij", left, right)
print(product.shape, float(product[0, 0]))
# 输出：torch.Size([2, 4]) 6.0
```

`einsum` 适合表达注意力、批量矩阵乘等高阶运算，但下标写错时不易读；普通矩阵乘优先用 `@` 或 `matmul`。

## 易混点

- `torch.tensor(list)` 和 `torch.from_numpy(array)` 的复制/共享内存语义不同；修改 NumPy 数组前先确认是否共享。
- `reshape` 可能返回视图也可能复制；需要明确共享内存时不要只凭方法名猜测。
- `dtype` 不匹配常见于模型参数是 `float32`、输入却是 `float64`；统一输入和模型 dtype。
- `.cuda()` 只能表达 CUDA 迁移，`.to(device)` 更容易同时支持 CPU、CUDA 和其他后端。
- `requires_grad=True` 适合需要求导的浮点 Tensor；整数 Tensor 不能参与 autograd。

## 课后小问

1. `[N, C, H, W]` 的图像 Tensor 为什么通常用 `flatten(start_dim=1)` 而不是 `flatten()`？

   答案： `start_dim=1` 保留第 0 维的 batch，得到 `[N, C*H*W]`；直接 `flatten()` 会把整个 batch 也合成一维。

   解析： 全连接层通常按样本逐行接收输入，batch 维不能丢。卷积输出接线性层时，这个写法尤其常见。

2. 为什么把 Tensor 迁移到 GPU 后，标签也必须迁移？

   答案： loss 通常同时访问预测值和标签，二者在不同设备时会产生设备不匹配错误。

   解析： 一个 batch 的输入、标签和参与计算的模型参数应在同一 device；日志值才在需要时用 `.item()` 回到 Python。

## 本节小结

Tensor 速查的优先级是 shape、dtype、device，然后才是算子。创建数据时明确类型，进入模型前统一设备；变形保持元素数量，拼接分清 `cat` 与 `stack`，涉及梯度的缓存用 `detach`，需要独立副本用 `clone`。

## 快速回顾

```text
创建：tensor / zeros / arange
检查：shape / dtype / device
变形：reshape / flatten
组合：cat（已有维度）/ stack（新增维度）
迁移：to(device)
梯度边界：detach（断图）/ clone（复制）
```
