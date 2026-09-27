---
title: PyTorch GPU 与迁移学习
author: 阿源
date: 2026/09/27
categories:
  - 深度学习快速入门
tags:
  - PyTorch
  - CUDA
  - 迁移学习
---

# PyTorch GPU 与迁移学习

GPU 加速的核心不是把某一行改成 `.cuda()`，而是让模型、输入、标签和参与计算的 buffer 保持在同一个 device。迁移学习则是在已有权重上替换任务头，先冻结大部分 backbone，再按验证集表现逐步解冻。

安装 PyTorch 时不要固定复制某条 CUDA 命令：请打开 [官方安装选择器](https://pytorch.org/get-started/locally/)，按操作系统、Python、包管理器和 CUDA/ROCm/CPU 环境生成命令，并确认驱动满足要求。

## 学习目标

- 用安全分支选择 CPU/CUDA，并正确迁移模型、batch 和 buffer。
- 理解 pinned memory、非阻塞拷贝、显存检查和设备不匹配错误。
- 使用现代 torchvision `weights=` API 做冻结、替换头部和逐步解冻。

## 核心知识点

- `torch.cuda.is_available()` 只说明当前进程能否使用 CUDA，不代表显存足够或模型一定更快。
- `model.to(device)` 会迁移参数和 registered buffer；输入和标签也必须迁移到同一 device。
- 训练数据可用 `pin_memory=True`，再配合 `.to(device, non_blocking=True)`，但收益需要测量。
- 迁移学习先冻结 `requires_grad=False` 的 backbone，只把可训练参数交给优化器；解冻后要重新创建或更新 optimizer 参数组。
- torchvision 新写法使用 `weights=ResNet18_Weights.DEFAULT`，不使用已废弃的 `pretrained=True`。

## 常用用法

### `torch.cuda.is_available()`：安全选择设备

```python
import torch

device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
print(device)
# 输出：cpu，或可用时的 cuda:0
```

把 device 作为配置传入训练和推理函数，避免在模块内部到处写硬编码的 `cuda:0`。

### `model.to(device)` 与 `tensor.to(device)`：迁移计算对象

```python
import torch
from torch import nn

device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
model = nn.Linear(2, 1).to(device)
features = torch.ones(3, 2, device=device)
prediction = model(features)
print(next(model.parameters()).device, prediction.device)
# 输出：同一个 cpu，或同一个 cuda:0
```

不要只迁移输入或只迁移模型；遇到 Expected all tensors to be on the same device 时先检查模型参数、输入、标签和 buffer。

### batch 迁移：训练循环中的标准写法

```python
import torch
from torch import nn

device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
model = nn.Linear(2, 2).to(device)
features = torch.ones(4, 2).to(device)
targets = torch.zeros(4, dtype=torch.long).to(device)
logits = model(features)
loss = nn.CrossEntropyLoss()(logits, targets)
print(loss.device)
# 输出：cpu，或可用时的 cuda:0
```

实际 DataLoader 里通常写 `features = features.to(device)`、`targets = targets.to(device)`；标签 dtype 仍需匹配损失函数。

### `pin_memory` 与 `non_blocking`：主机到 GPU 拷贝

```python
import torch
from torch.utils.data import DataLoader, TensorDataset

device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
loader = DataLoader(
    TensorDataset(torch.ones(4, 2)),
    batch_size=2,
    pin_memory=device.type == "cuda",
)
features = next(iter(loader))[0].to(device, non_blocking=True)
print(features.device)
# 输出：cpu，或可用时的 cuda:0
```

`pin_memory` 只对 CPU 到 CUDA 的传输有意义；不要在没有测量的情况下把所有 Loader 参数都调到最大。

### `torch.cuda.memory_allocated`：观察显存

```python
import torch

if torch.cuda.is_available():
    allocated = torch.cuda.memory_allocated() / 1024**2
    print(round(allocated, 2))
    # 输出：当前进程已分配的显存 MiB（可能变化）
else:
    print(0)
    # 输出：CPU 环境没有 CUDA 显存统计
```

显存统计是诊断线索，不等于系统监控中的全部显存；要定位泄漏还要检查是否把带计算图的 Tensor 长期存进列表。

### torchvision `weights=`：加载现代预训练权重

```python
from torchvision.models import ResNet18_Weights, resnet18

weights = ResNet18_Weights.DEFAULT
model = resnet18(weights=weights)
print(type(weights).__name__)
# 输出：ResNet18_Weights
```

预训练权重下载和 torchvision 版本需要网络与兼容环境；没有 torchvision 时可先用随机初始化的模型验证训练流程。不要使用 `pretrained=True`。

### 冻结 backbone：只训练任务头

```python
import torch
from torch import nn

backbone = nn.Sequential(nn.Linear(4, 8), nn.ReLU())
head = nn.Linear(8, 2)
for parameter in backbone.parameters():
    parameter.requires_grad = False
model = nn.Sequential(backbone, head)
optimizer = torch.optim.AdamW((p for p in model.parameters() if p.requires_grad), lr=1e-3)
print(sum(parameter.requires_grad for parameter in model.parameters()))
# 输出：2（只有任务头参数可训练）
```

冻结后不要把所有参数无条件传给优化器；过滤 `requires_grad` 能减少状态和计算。BatchNorm 等状态仍可能在训练态更新，需按任务决定是否保持 eval。

### 替换分类头：适配新类别数

```python
import torch
from torch import nn

backbone = nn.Sequential(nn.Linear(4, 8), nn.ReLU())
model = nn.Sequential(backbone, nn.Linear(8, 3))
output = model(torch.ones(2, 4))
print(output.shape)
# 输出：torch.Size([2, 3])
```

真实 torchvision 模型通常替换 `model.fc`（ResNet）或 `model.classifier`（MobileNet/EfficientNet）；先打印 `named_modules()` 确认具体结构，不要凭模型名字猜属性。

### 逐步解冻：降低学习率微调 backbone

```python
import torch
from torch import nn

backbone = nn.Linear(4, 8)
head = nn.Linear(8, 2)
model = nn.Sequential(backbone, nn.ReLU(), head)
for parameter in backbone.parameters():
    parameter.requires_grad = False
optimizer = torch.optim.AdamW((p for p in model.parameters() if p.requires_grad), lr=1e-3)
for parameter in backbone.parameters():
    parameter.requires_grad = True
optimizer = torch.optim.AdamW(
    [
        {"params": backbone.parameters(), "lr": 1e-4},
        {"params": head.parameters(), "lr": 1e-3},
    ]
)
print(len(optimizer.param_groups))
# 输出：2（backbone 和 head 使用不同学习率）
```

解冻后需要重新创建 optimizer，或显式添加新的参数组；使用更小的 backbone 学习率可以减少破坏预训练特征的风险。

### `named_modules()`：确认预训练模型结构

```python
from torch import nn

model = nn.Sequential(nn.Linear(4, 8), nn.ReLU(), nn.Linear(8, 2))
module_names = [name for name, _ in model.named_modules()]
print(module_names)
# 输出：['', '0', '1', '2']
```

修改第三方模型前先查看模块名字、参数 shape 和 forward 输入；这是比复制网上旧代码更可靠的迁移学习起点。

### 混合精度与 GPU：只在 CUDA 上启用

```python
import torch
from torch import nn

device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
model = nn.Linear(2, 1).to(device)
features = torch.ones(2, 2, device=device)
enabled = device.type == "cuda"
with torch.autocast(device_type=device.type, dtype=torch.float16, enabled=enabled):
    prediction = model(features)
print(prediction.device)
# 输出：cpu，或可用时的 cuda:0
```

完整训练还需要 GradScaler 和正确的 optimizer 更新，见训练循环专题；CPU 分支不强行启用 float16。

## 不常用但需要知道

### 多 GPU 的 `DataParallel` 边界

```python
import torch
from torch import nn

model = nn.Linear(2, 1)
if torch.cuda.device_count() > 1:
    model = nn.DataParallel(model)
print(type(model).__name__)
# 输出：Linear，或多卡环境下的 DataParallel
```

`DataParallel` 使用简单但效率和可控性有限；生产多 GPU 训练通常优先研究 `DistributedDataParallel`，不要把多卡封装当成单机单卡的无成本替换。

### `torch.cuda.synchronize`：测量 GPU 时间

```python
import time
import torch

start = time.perf_counter()
if torch.cuda.is_available():
    torch.cuda.synchronize()
elapsed = time.perf_counter() - start
print(elapsed >= 0)
# 输出：True（计时结果仅表示同步调用完成）
```

CUDA 运算通常是异步的，测量 kernel 时间前需要同步；同步会影响性能，只应在基准测试和诊断中使用。

### `torch.cuda.amp` 的兼容边界

```python
import torch

has_amp = hasattr(torch, "amp") and hasattr(torch.amp, "autocast")
print(has_amp)
# 输出：True（PyTorch 2.x 通常可用）
```

PyTorch 2.x 推荐围绕 `torch.autocast`/`torch.amp` 组织 AMP；遇到旧项目时先查当前版本文档，再决定兼容层，不要机械复制 `torch.cuda.amp.autocast` 的旧写法。

### `to(dtype=...)`：调整精度与设备分开处理

```python
import torch

value = torch.ones(2, dtype=torch.float32)
half = value.to(dtype=torch.float16)
print(value.dtype, half.dtype)
# 输出：torch.float32 torch.float16
```

dtype 变化会影响数值稳定性和算子支持，设备迁移不等于精度转换；混合精度应由 autocast 管理，而不是全局把模型改成 half。

## 易混点

- CUDA 可用不代表每个 batch 都要放 CUDA；小模型或数据读取瓶颈可能在 CPU 更快，先测量。
- `model.to(device)` 会返回/修改模块引用，但新创建的 Tensor、标签和 buffer 仍需检查 device。
- 冻结 `requires_grad` 只阻止参数梯度，不会自动让 BatchNorm 停止更新 running statistics；必要时对子模块调用 `eval()`。
- 解冻参数后要更新优化器参数组，否则新梯度不会被 optimizer.step 使用。
- 预训练权重的 transforms、输入归一化和类别标签必须匹配，不能只替换最后一层。

## 课后小问

1. 为什么只写 `model.to("cuda")` 仍可能遇到设备不匹配？

   答案： 输入、标签、手动创建的中间 Tensor 或未注册的 Tensor 属性可能仍在 CPU。

   解析： 迁移模型后要让每个参与运算的 Tensor 统一到同一 device；固定状态应通过 `register_buffer` 注册，才能跟随模型迁移。

2. 迁移学习为什么常先冻结 backbone，再逐步解冻？

   答案： 预训练 backbone 已有通用特征，先训练新头能降低随机初始化头部对特征的破坏，再用较小学习率微调整体。

   解析： 解冻后重新配置 optimizer 参数组和学习率，并用验证集判断是否真的带来收益；不是解冻越多越好。

## 本节小结

GPU 代码的核心是 device 一致性和有证据的性能调优；迁移学习的核心是正确使用权重、输入变换、冻结策略和 optimizer 参数组。安装与驱动遵循官方选择器，示例始终保留 CPU 安全分支。

## 快速回顾

```text
device = cuda if available else cpu
model.to(device)
batch.to(device)
pin_memory + non_blocking（测量后启用）
weights=...（现代 torchvision）
freeze → train head → unfreeze → smaller lr
```
