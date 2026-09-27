---
title: PyTorch 损失函数、优化器与训练循环
author: 阿源
date: 2026/09/27
categories:
  - 深度学习快速入门
tags:
  - PyTorch
  - 损失函数
  - 优化器
  - 训练循环
---

# PyTorch 损失函数、优化器与训练循环

训练循环把模型输出转换成可优化的目标，再把梯度交给优化器更新参数。最稳妥的顺序是：`model.train()` → 取 batch → `.to(device)` → `zero_grad` → 前向 → loss → `backward` → 可选梯度裁剪 → `step` → 记录 `loss.item()`。

## 学习目标

- 根据任务选择分类、回归和二分类损失。
- 正确编写训练/验证循环，管理梯度、模式和设备。
- 使用 AdamW、SGD、scheduler、梯度裁剪，并了解 AMP 的进阶边界。

## 核心知识点

- 多分类 `CrossEntropyLoss` 接收未归一化 logits 和 `long` 类别索引，不要先手动 softmax。
- 回归常用 `MSELoss` 或 `L1Loss`；二分类常用 `BCEWithLogitsLoss`，不要先 sigmoid 再传入。
- `zero_grad → backward → step` 的顺序不可乱；默认梯度会累积。
- 验证要 `model.eval()` 并在 `no_grad`/`inference_mode` 中运行，不更新参数。
- scheduler 的 `step()` 时机取决于 scheduler 类型；记录学习率以便排查训练异常。

## 常用用法

### `CrossEntropyLoss`：多分类

```python
import torch
from torch import nn

logits = torch.tensor([[2.0, 0.5, -1.0], [0.2, 1.2, 0.1]])
targets = torch.tensor([0, 1], dtype=torch.long)
criterion = nn.CrossEntropyLoss()
loss = criterion(logits, targets)
print(loss.item())
# 输出：非负浮点损失（具体值由 logits 决定）
```

输入 shape 通常是 `[N, C]`，标签是 `[N]` 的类别索引；模型最后一层不要加 softmax。

### `MSELoss`：回归

```python
import torch
from torch import nn

prediction = torch.tensor([[2.0], [4.0]])
target = torch.tensor([[1.0], [5.0]])
loss = nn.MSELoss()(prediction, target)
print(loss.item())
# 输出：1.0
```

预测和标签 shape 要一致或明确广播；对异常值敏感时可比较 `L1Loss`、`SmoothL1Loss`。

### `BCEWithLogitsLoss`：二分类或多标签

```python
import torch
from torch import nn

logits = torch.tensor([0.0, 2.0])
targets = torch.tensor([0.0, 1.0])
loss = nn.BCEWithLogitsLoss()(logits, targets)
print(loss.item())
# 输出：非负浮点损失（具体值由 logits 决定）
```

它内部组合 sigmoid 与二元交叉熵，数值更稳定；推理时才使用 `torch.sigmoid(logits)` 得到概率。

### `AdamW`：常用自适应优化器

```python
import torch
from torch import nn

model = nn.Linear(2, 1)
optimizer = torch.optim.AdamW(model.parameters(), lr=1e-3, weight_decay=1e-2)
print(optimizer.param_groups[0]["lr"])
# 输出：0.001
```

AdamW 把 weight decay 与梯度更新解耦，常作为 Transformer 和多数基线的起点；学习率和 weight decay 仍需通过验证集调参。

### `SGD`：带动量的随机梯度下降

```python
import torch
from torch import nn

model = nn.Linear(2, 1)
optimizer = torch.optim.SGD(model.parameters(), lr=0.1, momentum=0.9)
print(optimizer.param_groups[0]["momentum"])
# 输出：0.9
```

SGD 的学习率更敏感但行为简单、常有良好泛化；不要只因为 AdamW 默认收敛快就跳过基线比较。

### `zero_grad`、`backward`、`step`：一次参数更新

```python
import torch
from torch import nn

model = nn.Linear(1, 1)
optimizer = torch.optim.SGD(model.parameters(), lr=0.1)
criterion = nn.MSELoss()
features = torch.tensor([[1.0], [2.0]])
targets = torch.tensor([[2.0], [4.0]])

optimizer.zero_grad(set_to_none=True)
loss = criterion(model(features), targets)
loss.backward()
optimizer.step()
print(loss.item())
# 输出：更新前的损失浮点数（随随机初始化变化）
```

每个 batch 都执行这三个优化器动作；若使用梯度累积，则按设计延后 `zero_grad` 和 `step`。

### 训练循环：按 epoch 消费 DataLoader

```python
import torch
from torch import nn
from torch.utils.data import DataLoader, TensorDataset

torch.manual_seed(7)
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
model = nn.Linear(1, 1).to(device)
loader = DataLoader(TensorDataset(torch.arange(1, 5, dtype=torch.float32).reshape(-1, 1)), batch_size=2)
optimizer = torch.optim.SGD(model.parameters(), lr=0.01)
criterion = nn.MSELoss()

model.train()
for features, in loader:
    features = features.to(device)
    targets = (2 * features).to(device)
    optimizer.zero_grad(set_to_none=True)
    loss = criterion(model(features), targets)
    loss.backward()
    optimizer.step()
print(loss.item())
# 输出：最后一个 batch 的训练损失（具体值可能变化）
```

实际项目应累计 `loss.item() * batch_size` 再除以样本数，避免最后一个小 batch 让 epoch 平均值偏差。

### 验证循环：`eval` 与 `inference_mode`

```python
import torch
from torch import nn

model = nn.Linear(2, 2)
features = torch.ones(3, 2)
targets = torch.tensor([0, 1, 0])
criterion = nn.CrossEntropyLoss()

model.eval()
with torch.inference_mode():
    logits = model(features)
    loss = criterion(logits, targets)
print(loss.item())
# 输出：验证损失浮点数（不建立反向图）
```

验证不调用 `backward()` 和 `optimizer.step()`；需要计算准确率时可使用 `logits.argmax(dim=1)` 与标签比较。

### `StepLR`：按 epoch 调整学习率

```python
import torch
from torch import nn

model = nn.Linear(2, 1)
optimizer = torch.optim.SGD(model.parameters(), lr=0.1)
scheduler = torch.optim.lr_scheduler.StepLR(optimizer, step_size=2, gamma=0.5)
for _ in range(2):
    optimizer.step()
    scheduler.step()
print(optimizer.param_groups[0]["lr"])
# 输出：0.05
```

多数按 epoch 更新的 scheduler 在 epoch 训练完成后调用 `scheduler.step()`；使用验证指标的 scheduler（如 ReduceLROnPlateau）则应传入指标。

### `clip_grad_norm_`：限制梯度范数

```python
import torch
from torch import nn

model = nn.Linear(2, 1)
features = torch.ones(2, 2)
loss = model(features).sum()
loss.backward()
grad_norm = torch.nn.utils.clip_grad_norm_(model.parameters(), max_norm=1.0)
print(float(grad_norm))
# 输出：裁剪前的梯度范数（可能大于或等于 1）
```

梯度裁剪适合 RNN、Transformer 或已观察到梯度爆炸的训练；它不是替代合理学习率和数据归一化的万能修复。

### 梯度累积：用多个小 batch 模拟大 batch

```python
import torch
from torch import nn

model = nn.Linear(2, 1)
optimizer = torch.optim.SGD(model.parameters(), lr=0.1)
optimizer.zero_grad(set_to_none=True)
for _ in range(2):
    features = torch.ones(2, 2)
    loss = model(features).sum() / 2
    loss.backward()
optimizer.step()
print(model.weight.grad is not None)
# 输出：True
```

累积 `steps` 个 batch 时通常把 loss 除以 `steps`，并在累积完成后才 `step`；注意最后一个不足累积周期的 batch 也要处理。

## 不常用但需要知道

### `CosineAnnealingLR`：余弦学习率

```python
import torch
from torch import nn

model = nn.Linear(2, 1)
optimizer = torch.optim.SGD(model.parameters(), lr=0.1)
scheduler = torch.optim.lr_scheduler.CosineAnnealingLR(optimizer, T_max=4)
for _ in range(4):
    optimizer.step()
    scheduler.step()
print(optimizer.param_groups[0]["lr"])
# 输出：接近 0 的学习率（具体浮点表示可能略有差异）
```

学习率策略要和总 epoch、warmup 以及 checkpoint 恢复一起设计；只替换 scheduler 不会自动修复训练不稳定。

### AMP：自动混合精度的安全分支

```python
import torch
from torch import nn

device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
model = nn.Linear(2, 1).to(device)
optimizer = torch.optim.AdamW(model.parameters(), lr=1e-3)
features = torch.ones(2, 2, device=device)
targets = torch.ones(2, 1, device=device)
enabled = device.type == "cuda"
scaler = torch.amp.GradScaler("cuda", enabled=enabled)

optimizer.zero_grad(set_to_none=True)
with torch.autocast(device_type=device.type, dtype=torch.float16, enabled=enabled):
    loss = nn.MSELoss()(model(features), targets)
if enabled:
    scaler.scale(loss).backward()
    scaler.step(optimizer)
    scaler.update()
else:
    loss.backward()
    optimizer.step()
print(loss.item())
# 输出：混合精度训练损失浮点数（CPU 分支仍可运行）
```

AMP 是进阶优化项，先让全精度训练稳定，再根据 GPU、算子和数值误差验证收益；不同 PyTorch 小版本的 AMP 入口可能有细微差异，遇到兼容性问题以当前官方文档为准。

### `ReduceLROnPlateau`：根据验证指标降学习率

```python
import torch
from torch import nn

model = nn.Linear(2, 1)
optimizer = torch.optim.AdamW(model.parameters(), lr=1e-3)
scheduler = torch.optim.lr_scheduler.ReduceLROnPlateau(optimizer, mode="min", patience=2)
scheduler.step(0.8)
print(optimizer.param_groups[0]["lr"])
# 输出：0.001（尚未达到 patience，具体变化取决于历史指标）
```

这个 scheduler 的 `step` 接收验证指标，不要像 `StepLR` 一样无参数调用；恢复 checkpoint 时也要恢复 scheduler 状态。

## 易混点

- `CrossEntropyLoss` 接 logits 和类别索引；`BCEWithLogitsLoss` 接 logits 和 0/1 浮点目标，二者不要混用。
- `loss.item()` 只用于日志；参与梯度计算的 loss 不要先 `.item()` 再 backward。
- `optimizer.zero_grad()` 必须发生在对应反向前；`scheduler.step()` 的 epoch/batch 粒度要与配置一致。
- `model.eval()` 不会关闭梯度；`inference_mode()` 也不会替你切换 Dropout/BatchNorm 状态。
- AMP 的 scaler、optimizer 和 scheduler 都属于训练状态，保存 checkpoint 时不要遗漏。

## 课后小问

1. 为什么多分类模型最后一层通常不写 softmax？

   答案： `CrossEntropyLoss` 内部已经对 logits 做了数值稳定的 log-softmax 和负对数似然计算。

   解析： 提前 softmax 不仅重复计算，还可能损失数值稳定性；只有展示概率或推理后处理时才显式调用 softmax。

2. 验证集损失为什么不能用训练循环里的 `optimizer.step()`？

   答案： 验证的目标是测量当前参数在未参与更新的数据上的表现，调用 step 会改变参数并污染评估。

   解析： 验证阶段应 `eval()`、`inference_mode()`，只累计指标；调度器如果依赖验证指标，也只接收该指标而不直接更新模型参数。

## 本节小结

先匹配损失函数和标签形状，再固定训练循环的更新顺序。AdamW/SGD 是优化器，scheduler 调整学习率，裁剪和梯度累积解决特定训练边界，AMP 先验证稳定性再启用。

## 快速回顾

```text
train()
  → zero_grad(set_to_none=True)
  → forward
  → loss
  → backward
  → clip（可选）
  → optimizer.step()
  → scheduler.step()（按策略）
验证：eval() + inference_mode()
日志：loss.item()
```
