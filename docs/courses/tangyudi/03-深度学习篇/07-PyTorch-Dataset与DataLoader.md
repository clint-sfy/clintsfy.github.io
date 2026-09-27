---
title: PyTorch Dataset 与 DataLoader
author: 阿源
date: 2026/09/27
categories:
  - 深度学习快速入门
tags:
  - PyTorch
  - Dataset
  - DataLoader
---

# PyTorch Dataset 与 DataLoader

`Dataset` 描述“一个样本如何被取出”，`DataLoader` 描述“如何按 batch、顺序和并行策略取样本”。先把数据集边界定义清楚，再在训练循环中消费 DataLoader，模型就不会和磁盘、路径、增强逻辑纠缠在一起。

## 学习目标

- 用 `TensorDataset` 快速包装 Tensor，用自定义 `Dataset` 连接真实数据。
- 掌握 `batch_size`、`shuffle`、`drop_last`、`collate_fn` 和 `next(iter(loader))`。
- 知道数据划分、采样器、多进程和 pinned memory 的使用边界。

## 核心知识点

- 自定义 Dataset 至少实现 `__len__()` 和 `__getitem__()`。
- DataLoader 每次迭代返回一个 batch，默认 collate 会沿第 0 维堆叠同形状 Tensor。
- 训练集常见 `shuffle=True`；验证/测试集通常保持固定顺序，避免统计结果漂移。
- `drop_last=True` 会丢弃最后一个不足 batch 的小批次，适合要求固定 batch shape 的场景。
- `num_workers`、`pin_memory` 和 `persistent_workers` 是性能调优项，应结合机器和数据读取成本测量。

## 常用用法

### `TensorDataset`：把 Tensor 组成样本

```python
import torch
from torch.utils.data import TensorDataset

features = torch.arange(12, dtype=torch.float32).reshape(6, 2)
labels = torch.arange(6)
dataset = TensorDataset(features, labels)
print(len(dataset), dataset[0][0].tolist(), int(dataset[0][1]))
# 输出：6 [0.0, 1.0] 0
```

传入的 Tensor 第 0 维必须长度一致；它适合内存中已经整理好的小型数据。

### `DataLoader`：按 batch 迭代

```python
import torch
from torch.utils.data import DataLoader, TensorDataset

features = torch.arange(12, dtype=torch.float32).reshape(6, 2)
labels = torch.arange(6)
loader = DataLoader(TensorDataset(features, labels), batch_size=2, shuffle=False)
batch_features, batch_labels = next(iter(loader))
print(batch_features.shape, batch_labels.tolist())
# 输出：torch.Size([2, 2]) [0, 1]
```

`next(iter(loader))` 是快速检查 batch 形状和标签顺序的常用写法；训练时使用 `for batch_features, batch_labels in loader` 遍历全部 batch。

### `Dataset.__len__` 与 `__getitem__`：自定义数据集

```python
import torch
from torch.utils.data import Dataset

class ToyDataset(Dataset):
    def __init__(self):
        self.features = torch.tensor([[1.0], [2.0], [3.0]])
        self.labels = torch.tensor([0, 1, 1])

    def __len__(self):
        return len(self.features)

    def __getitem__(self, index):
        return self.features[index], self.labels[index]

dataset = ToyDataset()
print(len(dataset), dataset[1][0].item(), int(dataset[1][1]))
# 输出：3 2.0 1
```

真实项目可以在 `__getitem__` 里读取路径、解码图像、做变换，但不要在这里保存会随样本无限增长的临时状态。

### `shuffle`：训练集随机打乱

```python
import torch
from torch.utils.data import DataLoader, TensorDataset

torch.manual_seed(7)
data = TensorDataset(torch.arange(5))
loader = DataLoader(data, batch_size=2, shuffle=True)
first_batch = next(iter(loader))[0]
print(first_batch.tolist())
# 输出：随机抽取的两个样本（固定种子后通常可复现）
```

验证和测试一般使用 `shuffle=False`，训练集则根据任务需要打乱；时间序列等有顺序约束的数据不要盲目 shuffle。

### `drop_last`：丢弃不完整 batch

```python
import torch
from torch.utils.data import DataLoader, TensorDataset

data = TensorDataset(torch.arange(5))
kept = DataLoader(data, batch_size=2, drop_last=False)
fixed = DataLoader(data, batch_size=2, drop_last=True)
print(len(kept), len(fixed))
# 输出：3 2
```

`drop_last=True` 会舍弃最后 1 个样本；记录样本覆盖率，避免在小数据集上无意损失大量数据。

### `collate_fn`：自定义 batch 组装

```python
import torch
from torch.utils.data import DataLoader, Dataset

class VariableLengthDataset(Dataset):
    def __init__(self):
        self.items = [torch.tensor([1, 2]), torch.tensor([3]), torch.tensor([4, 5, 6])]

    def __len__(self):
        return len(self.items)

    def __getitem__(self, index):
        return self.items[index]

def pad_collate(items):
    return torch.nn.utils.rnn.pad_sequence(items, batch_first=True, padding_value=0)

loader = DataLoader(VariableLengthDataset(), batch_size=3, collate_fn=pad_collate)
batch = next(iter(loader))
print(batch.shape, batch.tolist())
# 输出：torch.Size([3, 3]) [[1, 2, 0], [3, 0, 0], [4, 5, 6]]
```

变长文本、检测框等数据不能直接用默认 collate；自定义函数要明确 padding、mask 和标签的形状。

### `random_split`：划分训练集与验证集

```python
import torch
from torch.utils.data import random_split, TensorDataset

dataset = TensorDataset(torch.arange(10))
generator = torch.Generator().manual_seed(7)
train_set, valid_set = random_split(dataset, [8, 2], generator=generator)
print(len(train_set), len(valid_set))
# 输出：8 2
```

固定 Generator 能复现划分；实际项目还应记录划分索引，避免后续数据更新造成训练/验证泄漏。

## 不常用但需要知道

### `Subset`：按索引复用数据集

```python
import torch
from torch.utils.data import Subset, TensorDataset

dataset = TensorDataset(torch.arange(6))
subset = Subset(dataset, [1, 3, 5])
print(len(subset), int(subset[0][0]))
# 输出：3 1
```

`Subset` 不复制底层数据，适合交叉验证或使用预先计算的训练/验证索引。

### `WeightedRandomSampler`：按权重采样类别

```python
import torch
from torch.utils.data import DataLoader, TensorDataset, WeightedRandomSampler

labels = torch.tensor([0, 0, 0, 1])
weights = torch.where(labels == 1, torch.tensor(3.0), torch.tensor(1.0))
sampler = WeightedRandomSampler(weights, num_samples=4, replacement=True)
loader = DataLoader(TensorDataset(torch.arange(4)), batch_size=2, sampler=sampler)
batch = next(iter(loader))[0]
print(batch.shape)
# 输出：torch.Size([2, 1])（具体索引按随机采样变化）
```

使用 `sampler` 时不要同时设置 `shuffle=True`；权重应按样本给出，不能把类别权重数组直接传进去。

### `pin_memory` 与 `non_blocking`：加速 CPU 到 CUDA 的拷贝

```python
import torch
from torch.utils.data import DataLoader, TensorDataset

device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
loader = DataLoader(TensorDataset(torch.ones(4, 2)), batch_size=2, pin_memory=device.type == "cuda")
batch = next(iter(loader))[0].to(device, non_blocking=True)
print(batch.device)
# 输出：cpu，或可用时的 cuda:0
```

只有在 CUDA 拷贝确实是瓶颈时才启用并测量收益；CPU 上 `non_blocking` 不会把同步读取变成异步计算。

### `num_workers`：并行读取样本

```python
import torch
from torch.utils.data import DataLoader, TensorDataset

loader = DataLoader(TensorDataset(torch.arange(4)), batch_size=2, num_workers=0)
print(loader.num_workers)
# 输出：0（先用单进程确认逻辑，再按平台调优）
```

Windows、Notebook 和包含不可序列化对象的 Dataset 对 worker 更敏感；先保证 `num_workers=0` 正确，再逐步增加并测量。

## 易混点

- `len(loader)` 是 batch 数，不是样本数；最后一个 batch 是否完整由 `drop_last` 决定。
- `shuffle` 和 `sampler` 通常不能同时指定；采样策略要集中在一个地方。
- Dataset 返回字典、元组或 Tensor 会影响默认 collate 的结果结构，第一次使用先打印一个 batch。
- `pin_memory` 只涉及主机内存到 CUDA 的拷贝，不等价于“把数据放进显存”。
- 数据增强应只用于训练集；验证和测试需要固定、可比较的预处理。

## 课后小问

1. 为什么建议先运行 `next(iter(loader))`？

   答案： 它能在训练开始前快速检查 batch 的类型、shape、标签范围和设备迁移边界。

   解析： DataLoader 的错误通常在首次取样时才暴露，提前检查能把“数据管道问题”和“模型问题”分开。

2. `drop_last=True` 是否一定更好？

   答案： 不一定；它保证 batch 尺寸一致，却会丢弃最后不足一批的样本。

   解析： BatchNorm、固定 shape 的编译或多卡同步可能需要固定 batch；小数据集或验证统计则通常不应无意丢数据。

## 本节小结

Dataset 负责单样本，DataLoader 负责 batch 和采样策略。先用 TensorDataset 和单进程 Loader 验证契约，再按需加入自定义 Dataset、collate、采样器、多进程和 pinned memory。

## 快速回顾

```text
Dataset：__len__ + __getitem__
DataLoader：batch_size / shuffle / sampler
快速验形：next(iter(loader))
变长数据：collate_fn
划分：random_split / Subset
性能：pin_memory + non_blocking + num_workers（测量后启用）
```
