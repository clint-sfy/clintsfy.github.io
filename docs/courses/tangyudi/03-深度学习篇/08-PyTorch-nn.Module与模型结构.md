---
title: PyTorch nn.Module 与模型结构
author: 阿源
date: 2026/09/27
categories:
  - 深度学习快速入门
tags:
  - PyTorch
  - nn.Module
  - 神经网络
---

# PyTorch `nn.Module` 与模型结构

`nn.Module` 是 PyTorch 模型的基本组织单元：它负责注册参数、子模块和缓冲区，并提供 `.to()`、`.train()`、`.eval()`、`state_dict()` 等工程能力。模型结构页面只关注“怎样声明和组合计算”，损失、优化器和训练循环见下一页。

## 学习目标

- 用 `nn.Module` 和 `forward` 定义可训练模型。
- 选择 `Sequential`、显式 `forward`、`ModuleList` 和 `ModuleDict`。
- 理解常用层的 shape、训练/推理差异和参数注册规则。

## 核心知识点

- 自定义模型继承 `nn.Module`，在 `__init__` 中声明层，在 `forward` 中描述计算。
- 赋给 Module 属性的子模块会被注册，普通 Python list 里的层不会自动注册。
- `nn.Linear` 处理最后一维；`Conv2d` 常用 `[N, C, H, W]`；`BatchNorm` 与 `Dropout` 依赖训练/推理状态。
- `model.parameters()` 交给优化器；`named_parameters()` 和 `state_dict()` 适合检查和保存。
- `torch.nn.functional` 是无状态函数，带可学习参数的运算优先使用模块实例。

## 常用用法

### `nn.Module`：定义最小模型

```python
import torch
from torch import nn

class Regressor(nn.Module):
    def __init__(self):
        super().__init__()
        self.linear = nn.Linear(2, 1)

    def forward(self, features):
        return self.linear(features)

model = Regressor()
prediction = model(torch.ones(3, 2))
print(prediction.shape)
# 输出：torch.Size([3, 1])
```

调用 `model(x)` 会进入 `forward`，不要手动直接调用 `model.forward(x)`，这样才能保留 Module 的钩子和封装行为。

### `nn.Sequential`：按顺序组合层

```python
import torch
from torch import nn

model = nn.Sequential(
    nn.Linear(4, 8),
    nn.ReLU(),
    nn.Linear(8, 2),
)
output = model(torch.ones(5, 4))
print(output.shape)
# 输出：torch.Size([5, 2])
```

`Sequential` 适合单一路径、层间只传一个 Tensor 的网络；有残差连接、多个输入或分支时写显式 `forward` 更清晰。

### `nn.Linear`：全连接层

```python
import torch
from torch import nn

layer = nn.Linear(3, 2)
features = torch.ones(4, 3)
output = layer(features)
print(output.shape, sum(parameter.numel() for parameter in layer.parameters()))
# 输出：torch.Size([4, 2]) 8
```

参数量为 `in_features * out_features + out_features`（包含 bias）；输入最后一维必须是 `in_features`。

### `nn.ReLU`：激活函数

```python
import torch
from torch import nn

activation = nn.ReLU()
values = activation(torch.tensor([[-1.0, 2.0]]))
print(values.tolist())
# 输出：[[0.0, 2.0]]
```

`nn.ReLU()` 是无可学习参数的模块；需要函数式写法时可用 `torch.nn.functional.relu`，但两者都不会自动改变训练状态。

### `nn.Conv2d`：图像卷积层

```python
import torch
from torch import nn

layer = nn.Conv2d(in_channels=3, out_channels=8, kernel_size=3, padding=1)
images = torch.ones(2, 3, 16, 16)
feature_map = layer(images)
print(feature_map.shape)
# 输出：torch.Size([2, 8, 16, 16])
```

卷积输入通常是 NCHW；`padding=1` 配合 3×3 卷积保持空间尺寸，具体输出仍要结合 stride、dilation 和 kernel 计算。

### `nn.BatchNorm1d`：批归一化

```python
import torch
from torch import nn

features = torch.randn(4, 6)
layer = nn.BatchNorm1d(6)
layer.train()
normalized = layer(features)
print(normalized.shape)
# 输出：torch.Size([4, 6])
```

`BatchNorm1d` 常用于 `[N, C]` 或序列特征，`BatchNorm2d` 常用于 `[N, C, H, W]`；训练态更新 running statistics，推理态使用已保存的统计量。

### `nn.Dropout`、`train()` 与 `eval()`：切换模块状态

```python
import torch
from torch import nn

dropout = nn.Dropout(p=0.5)
dropout.train()
training_state = dropout.training
dropout.eval()
evaluation_state = dropout.training
print(training_state, evaluation_state)
# 输出：True False
```

状态切换会递归影响子模块，但不会自动开启或关闭 autograd；推理循环还应配合 `torch.inference_mode()`。

### `named_parameters` 与 `state_dict`：检查已注册参数

```python
from torch import nn

model = nn.Sequential(nn.Linear(2, 3), nn.Linear(3, 1))
names = [name for name, _ in model.named_parameters()]
keys = list(model.state_dict().keys())
print(names[:2], keys[:2])
# 输出：参数名字列表前两项（例如 ['0.weight', '0.bias']）和 state_dict 键
```

`state_dict` 还包含 registered buffer；保存和加载模型时优先围绕它设计，具体见保存专题。

## 不常用但需要知道

### `nn.ModuleList`：注册动态层列表

```python
import torch
from torch import nn

layers = nn.ModuleList([nn.Linear(2, 2), nn.Linear(2, 2)])
value = torch.ones(1, 2)
for layer in layers:
    value = layer(value)
print(len(list(layers.parameters())), value.shape)
# 输出：4 torch.Size([1, 2])
```

普通 `list` 不会自动注册参数；需要遍历的一组动态层使用 `ModuleList`，否则优化器和 `state_dict` 都看不到它们。

### `nn.ModuleDict`：按名字注册分支

```python
import torch
from torch import nn

heads = nn.ModuleDict({"regression": nn.Linear(4, 1), "classification": nn.Linear(4, 2)})
features = torch.ones(3, 4)
result = heads["classification"](features)
print(sorted(heads.keys()), result.shape)
# 输出：['classification', 'regression'] torch.Size([3, 2])
```

`ModuleDict` 让配置驱动的多头模型保持参数注册和可读的命名，分支选择仍应在 `forward` 中集中处理。

### `register_buffer`：注册不训练的状态

```python
import torch
from torch import nn

class WithMean(nn.Module):
    def __init__(self):
        super().__init__()
        self.register_buffer("mean", torch.tensor(0.5))

    def forward(self, value):
        return value - self.mean

model = WithMean()
print(list(model.state_dict().keys()), model(torch.tensor(1.0)).item())
# 输出：['mean'] 0.5
```

Buffer 会跟随 `model.to(device)` 并进入 `state_dict`，但不会出现在 `parameters()` 中；running mean、固定 mask 等状态适合这样注册。

### `forward` 中的残差连接：显式组合张量

```python
import torch
from torch import nn

class ResidualBlock(nn.Module):
    def __init__(self, width):
        super().__init__()
        self.layers = nn.Sequential(nn.Linear(width, width), nn.ReLU(), nn.Linear(width, width))

    def forward(self, value):
        return value + self.layers(value)

block = ResidualBlock(4)
print(block(torch.ones(2, 4)).shape)
# 输出：torch.Size([2, 4])
```

残差相加要求两条路径 shape 兼容；维度变化时需要额外的投影层，而不能直接相加。

## 易混点

- `nn.Module` 会递归注册子模块，普通 Python list、dict 不会；动态结构使用 `ModuleList`、`ModuleDict`。
- `F.relu(x)` 没有参数；`nn.ReLU()` 是模块。需要可学习参数或持久化状态时使用模块。
- `train()` / `eval()` 是状态切换，不是“开始训练/开始推理”的完整命令。
- `Linear` 只要求最后一维匹配；卷积层则要求通道维和布局匹配。
- `state_dict` 包含参数和 buffer，不等于整个模型对象；加载前必须有对应结构。

## 课后小问

1. 为什么把层放进普通 Python 列表会导致优化器更新不到它们？

   答案： 普通列表不会触发 `nn.Module` 的子模块注册，`model.parameters()` 和 `state_dict()` 看不到这些层。

   解析： 使用 `nn.ModuleList` 或 `nn.Sequential` 注册后，参数才会被 `.to()`、优化器和保存逻辑统一管理。

2. 为什么验证前既要 `model.eval()` 又常常要 `inference_mode()`？

   答案： 前者切换 Dropout/BatchNorm 的行为，后者关闭 autograd 并减少推理开销。

   解析： 一个是模块状态，一个是梯度上下文，职责不同；只调用其中一个都可能得到错误的验证行为或不必要的显存占用。

## 本节小结

`nn.Module` 解决的是模型结构与参数管理：简单串联用 `Sequential`，有分支或残差时写 `forward`，动态层用 `ModuleList/ModuleDict`，固定状态用 `register_buffer`。训练和保存都依赖正确的注册。

## 快速回顾

```text
Module：__init__ 注册层，forward 描述计算
串联：Sequential
动态层：ModuleList / ModuleDict
参数：parameters / named_parameters
状态：train / eval / register_buffer
持久化：state_dict
```
