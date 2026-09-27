---
title: PyTorch 模型保存、加载与推理
author: 阿源
date: 2026/09/27
categories:
  - 深度学习快速入门
tags:
  - PyTorch
  - state_dict
  - 推理
---

# PyTorch 模型保存、加载与推理

PyTorch 工程里优先保存参数和训练状态，而不是直接 pickle 整个模型对象。常见边界是：保存 `state_dict` 供部署或分享，保存 checkpoint 供断点续训，加载时用 `map_location` 适配设备，推理时切换 `eval()` 并关闭 autograd。

## 学习目标

- 保存和加载 `state_dict`、优化器和 scheduler 的状态。
- 正确处理 CPU/GPU 之间的 `map_location`、结构匹配和 `strict`。
- 编写单样本、batch 和多类别概率的推理代码。

## 核心知识点

- `model.state_dict()` 返回参数和 buffer 的有序映射，推荐用 `torch.save` 保存。
- 加载前先实例化同结构模型，再 `load_state_dict`；保存文件不自动包含 Python 类定义。
- 断点续训需要同时保存 epoch、模型、优化器、scheduler、随机性或配置等状态。
- 从 GPU 保存的权重加载到 CPU 时使用 `map_location="cpu"`，避免没有 CUDA 的机器报错。
- 推理至少使用 `model.eval()`；不需要梯度时用 `torch.inference_mode()`，输出概率再做后处理。

## 常用用法

### `torch.save(model.state_dict(), path)`：保存参数

```python
from pathlib import Path
import torch
from torch import nn

model = nn.Linear(2, 1)
path = Path("model-state.pt")
torch.save(model.state_dict(), path)
print(path.name, path.exists())
# 输出：model-state.pt True
```

保存目录应由配置或命令行传入，代码示例使用相对路径只是为了演示；生产环境还要记录模型版本、数据版本和指标。

### `load_state_dict`：加载参数

```python
import torch
from torch import nn

model = nn.Linear(2, 1)
state = model.state_dict()
restored = nn.Linear(2, 1)
result = restored.load_state_dict(state)
print(result.missing_keys, result.unexpected_keys)
# 输出：[] []
```

默认 `strict=True` 会检查键和 shape 是否完全匹配，适合确认结构没有漂移；加载失败应修复结构或权重版本，而不是盲目忽略错误。

### `torch.load(..., map_location=...)`：跨设备加载

```python
import torch
from torch import nn

device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
model = nn.Linear(2, 1)
state = model.state_dict()
path = "model-state.pt"
torch.save(state, path)
loaded = torch.load(path, map_location=device, weights_only=True)
model.to(device)
model.load_state_dict(loaded)
print(next(model.parameters()).device)
# 输出：cpu，或可用时的 cuda:0
```

`weights_only=True` 适合可信的参数映射并减少反序列化风险；在具体 PyTorch 小版本不支持该参数时，应按对应官方文档调整，而不是执行不可信 pickle 文件。

### 完整 checkpoint：断点续训

```python
from pathlib import Path
import torch
from torch import nn

model = nn.Linear(2, 1)
optimizer = torch.optim.AdamW(model.parameters(), lr=1e-3)
checkpoint = {
    "epoch": 3,
    "model": model.state_dict(),
    "optimizer": optimizer.state_dict(),
    "config": {"lr": 1e-3},
}
path = Path("checkpoint.pt")
torch.save(checkpoint, path)
print(sorted(checkpoint.keys()))
# 输出：['config', 'epoch', 'model', 'optimizer']
```

断点恢复时先创建相同模型和优化器，再分别加载状态，并从保存的 epoch、scheduler 和 scaler 状态继续；checkpoint 不应混入不可序列化的运行时对象。

### 恢复训练状态：模型、优化器和 epoch

```python
import torch
from torch import nn

model = nn.Linear(2, 1)
optimizer = torch.optim.AdamW(model.parameters(), lr=1e-3)
checkpoint = {"epoch": 3, "model": model.state_dict(), "optimizer": optimizer.state_dict()}
model.load_state_dict(checkpoint["model"])
optimizer.load_state_dict(checkpoint["optimizer"])
start_epoch = checkpoint["epoch"] + 1
print(start_epoch)
# 输出：4
```

优化器状态包含动量等额外 Tensor，加载后再将模型和优化器状态迁移到目标 device，并检查 dtype/设备是否一致。

### `eval()` 与 `inference_mode()`：单 batch 推理

```python
import torch
from torch import nn

model = nn.Linear(2, 3)
features = torch.tensor([[1.0, 2.0]])
model.eval()
with torch.inference_mode():
    logits = model(features)
    predicted_class = logits.argmax(dim=1)
print(predicted_class.tolist())
# 输出：长度为 1 的类别索引列表（具体类别取决于参数）
```

`eval()` 处理 Dropout/BatchNorm 的推理行为，`inference_mode()` 处理 autograd；二者职责不同，通常一起出现。

### batch 推理：只在最后转换需要的结果

```python
import torch
from torch import nn

model = nn.Linear(2, 2)
features = torch.ones(4, 2)
model.eval()
with torch.inference_mode():
    probabilities = torch.softmax(model(features), dim=1)
    predictions = probabilities.argmax(dim=1)
print(probabilities.shape, predictions.shape)
# 输出：torch.Size([4, 2]) torch.Size([4])
```

保持结果为 Tensor 可以继续批量处理；只在写日志、JSON 或 Python 控制流时使用 `.item()`、`.tolist()` 或 `.cpu()`。

### `strict=False`：有意加载部分参数

```python
import torch
from torch import nn

source = nn.Sequential(nn.Linear(2, 2))
target = nn.Sequential(nn.Linear(2, 2), nn.Linear(2, 2))
result = target.load_state_dict(source.state_dict(), strict=False)
print(result.missing_keys, result.unexpected_keys)
# 输出：['1.weight', '1.bias'] []
```

`strict=False` 只适合明确知道哪些键可以缺失（例如替换分类头）；加载后要检查返回的键列表，不能把它当作静默忽略所有错误的开关。

## 不常用但需要知道

### 保存 CPU 权重副本：方便跨环境分发

```python
import torch
from torch import nn

model = nn.Linear(2, 1)
cpu_state = {name: value.detach().cpu() for name, value in model.state_dict().items()}
print(next(iter(cpu_state.values())).device)
# 输出：cpu
```

保存 CPU 权重便于没有 GPU 的环境读取，但会复制/迁移数据；大模型分发时要权衡存储和转换时间。

### `torch.no_grad` 与 `detach`：导出预测值

```python
import torch
from torch import nn

model = nn.Linear(2, 1)
with torch.no_grad():
    output = model(torch.ones(1, 2))
prediction = output.detach().cpu().tolist()
print(prediction)
# 输出：二维 Python 列表（具体值取决于模型参数）
```

`no_grad` 控制上下文内是否记录梯度，`detach` 让结果脱离图；外部服务通常还要把 Tensor 转为 CPU 上的 Python 类型。

### checkpoint 中记录 scheduler 与 scaler

```python
import torch
from torch import nn

model = nn.Linear(2, 1)
optimizer = torch.optim.AdamW(model.parameters(), lr=1e-3)
scheduler = torch.optim.lr_scheduler.StepLR(optimizer, step_size=1)
checkpoint = {"scheduler": scheduler.state_dict(), "scaler": None}
print(sorted(checkpoint.keys()))
# 输出：['scaler', 'scheduler']
```

启用 AMP 时还应保存 GradScaler 状态；不保存这些状态会让断点续训的学习率或动态 loss scale 与原实验不一致。

### 使用 `weights_only` 读取可信参数边界

```python
import torch

payload = {"weight": torch.ones(2)}
torch.save(payload, "weights-only.pt")
loaded = torch.load("weights-only.pt", weights_only=True)
print(list(loaded.keys()))
# 输出：['weight']
```

权重文件仍应来自可信来源并经过校验；`weights_only` 不是网络下载、文件权限或供应链审计的替代品。

## 易混点

- `state_dict` 保存参数，不保存模型类代码；加载前必须创建同样结构。
- `torch.save(model, path)` 会依赖 Python pickle 和类路径，跨项目、跨版本更脆弱；优先 state dict。
- `map_location` 解决加载设备，`model.to(device)` 解决运行设备，二者经常都要写。
- `strict=False` 不会自动修复 shape 不兼容，也不会替你检查 missing/unexpected keys。
- 推理概率是 `softmax(logits)`，训练多分类 loss 通常直接接 logits。

## 课后小问

1. 为什么在 CPU 机器上加载 GPU 保存的权重常需要 `map_location="cpu"`？

   答案： 否则反序列化可能尝试初始化不存在的 CUDA 设备，导致加载失败。

   解析： 先把权重映射到 CPU，再按目标环境决定是否 `model.to(device)`；这样保存文件和运行机器解耦。

2. 为什么加载 checkpoint 后不能只恢复模型而忽略 optimizer？

   答案： AdamW、SGD momentum 等优化器保存了动量和步数，忽略它们会改变后续更新轨迹。

   解析： 断点续训应恢复模型、优化器、scheduler、AMP scaler 和起始 epoch；只做推理则通常只需模型 state_dict。

## 本节小结

保存优先 `state_dict`，续训使用完整 checkpoint，加载跨设备指定 `map_location`，推理使用 `eval()` + `inference_mode()`。任何宽松加载都要检查 missing/unexpected keys，并把版本、配置和指标一起记录。

## 快速回顾

```text
训练权重：torch.save(model.state_dict(), path)
恢复：model.load_state_dict(torch.load(path, map_location=device, weights_only=True))
续训：model + optimizer + scheduler + scaler + epoch
推理：model.eval() + inference_mode()
设备：map_location（加载）+ to(device)（运行）
```
