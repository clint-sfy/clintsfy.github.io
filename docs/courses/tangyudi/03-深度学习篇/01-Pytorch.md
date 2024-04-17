---
title: Pytorch
author: 阿源
date: 2023/07/13 12:00
categories:
 - 深度学习快速入门
tags:
 - 深度学习
 - Pytorch
---
# Pytorch

## 1. 神经网络实战分类与回归任务

### Mnist分类任务

- 网络基本构建与训练方法，常用函数解析
- torch.nn.functional模块
- nn.Module模块

### 读取Mnist数据集

```python
from pathlib import Path
import requests

DATA_PATH = Path("data")
PATH = DATA_PATH / "mnist"

PATH.mkdir(parents=True, exist_ok=True)

URL = "http://deeplearning.net/data/mnist/"
FILENAME = "mnist.pkl.gz"

if not (PATH / FILENAME).exists():
        content = requests.get(URL + FILENAME).content
        (PATH / FILENAME).open("wb").write(content)
        
import pickle
import gzip
# 784是mnist数据集每个样本的像素点个数
with gzip.open((PATH / FILENAME).as_posix(), "rb") as f:
        ((x_train, y_train), (x_valid, y_valid), _) = pickle.load(f, encoding="latin-1")
```

```python
from matplotlib import pyplot
import numpy as np

pyplot.imshow(x_train[0].reshape((28, 28)), cmap="gray")
print(x_train.shape)
```

```python
# 注意数据需转换成tensor才能参与后续建模训练
import torch
# torch 里面的结构不一样
x_train, y_train, x_valid, y_valid = map(
    torch.tensor, (x_train, y_train, x_valid, y_valid)
)
# n 样本个数  c 像素点（特征）个数
n, c = x_train.shape
x_train, x_train.shape, y_train.min(), y_train.max()
print(x_train, y_train)
print(x_train.shape)
print(y_train.min(), y_train.max())
```

### torch.nn.functional 很多层和函数在这里都会见到

torch.nn.functional中有很多功能，后续会常用的。那什么时候使用nn.Module，什么时候使用nn.functional呢？一般情况下，如果模型有可学习的参数，最好用nn.Module，其他情况nn.functional相对更简单一些

```python
import torch.nn.functional as F
# 损失函数  交叉熵cross_entropy
loss_func = F.cross_entropy

def model(xb):
    ## mm矩阵乘法   x*w+b
    return xb.mm(weights) + bias
```

```python
bs = 64
xb = x_train[0:bs]  # a mini-batch from x
yb = y_train[0:bs]
# 权重参数  随机初始化
# [64 * 784] [784 * 10]
weights = torch.randn([784, 10], dtype = torch.float,  requires_grad = True) 
bs = 64
bias = torch.zeros(10, requires_grad=True)
# loss_func(预测值 ，标签)
print(loss_func(model(xb), yb))
```

### 创建一个model来更简化代码

```
必须继承nn.Module且在其构造函数中需调用nn.Module的构造函数
无需写反向传播函数，nn.Module能够利用autograd自动实现反向传播
Module中的可学习参数可以通过named_parameters()或者parameters()返回迭代器
```

```python
from torch import nn

class Mnist_NN(nn.Module):
    def __init__(self):
        super().__init__()
        self.hidden1 = nn.Linear(784, 128) # 输入层 和 中间层1
        self.hidden2 = nn.Linear(128, 256) # 中间层1 和 中间层2
        self.out  = nn.Linear(256, 10)# 中间层2 和 输出层（10个类别）

    def forward(self, x): # 前向传播 
        x = F.relu(self.hidden1(x))
        x = F.relu(self.hidden2(x))
        x = self.out(x)
        return x
```

```python
net = Mnist_NN()
print(net)
Mnist_NN(
  (hidden1): Linear(in_features=784, out_features=128, bias=True)
  (hidden2): Linear(in_features=128, out_features=256, bias=True)
  (out): Linear(in_features=256, out_features=10, bias=True)
)

# 可以打印我们定义好名字里的权重和偏置项
for name, parameter in net.named_parameters():
    print(name, parameter,parameter.size())
    
```

### 使用TensorDataset和DataLoader来简化

```python
from torch.utils.data import TensorDataset
from torch.utils.data import DataLoader

train_ds = TensorDataset(x_train, y_train)
# batch_size 打包完数     shuffle 洗牌操作
train_dl = DataLoader(train_ds, batch_size=bs, shuffle=True)

valid_ds = TensorDataset(x_valid, y_valid)
valid_dl = DataLoader(valid_ds, batch_size=bs * 2)
```

```python
def get_data(train_ds, valid_ds, bs):
    return (
        DataLoader(train_ds, batch_size=bs, shuffle=True),
        DataLoader(valid_ds, batch_size=bs * 2),
    )
# 一般在训练模型时加上model.train()，这样会正常使用Batch Normalization和 Dropout
# 测试的时候一般选择model.eval()，这样就不会使用Batch Normalization和 Dropout
```

```python
import numpy as np

# steps迭代次数 ，model , loss_func , opt 优化器, train_dl 数据的打包器, valid_dl
def fit(steps, model, loss_func, opt, train_dl, valid_dl):
    for step in range(steps):
        model.train()
        for xb, yb in train_dl:
            loss_batch(model, loss_func, xb, yb, opt)

        # 验证的模式  不更新权重
        model.eval()
        with torch.no_grad():
            losses, nums = zip(
                *[loss_batch(model, loss_func, xb, yb) for xb, yb in valid_dl]
            )
        val_loss = np.sum(np.multiply(losses, nums)) / np.sum(nums)
        print('当前step:'+str(step), '验证集损失：'+str(val_loss))
```

```python
from torch import optim
def get_model():
    model = Mnist_NN()
    return model, optim.SGD(model.parameters(), lr=0.001) # lr学习率
def loss_batch(model, loss_func, xb, yb, opt=None):
    loss = loss_func(model(xb), yb)

    if opt is not None:
        loss.backward() # 算梯度
        opt.step()      # 沿着梯度更新
        opt.zero_grad() # 清0

    return loss.item(), len(xb) # 损失 , 训练样本总数（要算平均）
```

```python
train_dl, valid_dl = get_data(train_ds, valid_ds, bs)
model, opt = get_model()
fit(25, model, loss_func, opt, train_dl, valid_dl)
```

## 2. 利用pytorch神经网络进行气温预测

```python
import numpy as np
import pandas as pd 
import matplotlib.pyplot as plt
import torch
import torch.optim as optim
import warnings
warnings.filterwarnings("ignore")
%matplotlib inline

features = pd.read_csv('temps.csv')

#看看数据长什么样子
features.head()
	year	month	day	week	temp_2	temp_1	average	actual	friend
0	2016	1	1	Fri	45	45	45.6	45	29
1	2016	1	2	Sat	44	45	45.7	44	61
2	2016	1	3	Sun	45	44	45.8	41	56
```

```
数据表中:
year,moth,day,week分别表示的具体的时间
temp_2：前天的最高温度值
temp_1：昨天的最高温度值
average：在历史中，每年这一天的平均最高温度值
actual：这就是我们的标签值了，当天的真实最高温度
friend：这一列可能是凑热闹的，你的朋友猜测的可能值，咱们不管它就好了
```

```python
print('数据维度:', features.shape)
数据维度: (348, 9)
```

```python
# 处理时间数据
import datetime

# 分别得到年，月，日
years = features['year']
months = features['month']
days = features['day']

# datetime格式
dates = [str(int(year)) + '-' + str(int(month)) + '-' + str(int(day)) for year, month, day in zip(years, months, days)]
dates = [datetime.datetime.strptime(date, '%Y-%m-%d') for date in dates]

dates[:5]
[datetime.datetime(2016, 1, 1, 0, 0),
 datetime.datetime(2016, 1, 2, 0, 0),
 datetime.datetime(2016, 1, 3, 0, 0),
 datetime.datetime(2016, 1, 4, 0, 0),
 datetime.datetime(2016, 1, 5, 0, 0)]
```

```python
# 准备画图
# 指定默认风格
plt.style.use('fivethirtyeight')

# 设置布局
fig, ((ax1, ax2), (ax3, ax4)) = plt.subplots(nrows=2, ncols=2, figsize = (10,10))
fig.autofmt_xdate(rotation = 45)

# 标签值
ax1.plot(dates, features['actual'])
ax1.set_xlabel(''); ax1.set_ylabel('Temperature'); ax1.set_title('Max Temp')

# 昨天
ax2.plot(dates, features['temp_1'])
ax2.set_xlabel(''); ax2.set_ylabel('Temperature'); ax2.set_title('Previous Max Temp')

# 前天
ax3.plot(dates, features['temp_2'])
ax3.set_xlabel('Date'); ax3.set_ylabel('Temperature'); ax3.set_title('Two Days Prior Max Temp')

# 我的逗逼朋友
ax4.plot(dates, features['friend'])
ax4.set_xlabel('Date'); ax4.set_ylabel('Temperature'); ax4.set_title('Friend Estimate')

plt.tight_layout(pad=2)
```

```python
# 独热编码
features = pd.get_dummies(features)
features.head(5)

# 标签
labels = np.array(features['actual'])

# 在特征中去掉标签
features= features.drop('actual', axis = 1)

# 名字单独保存一下，以备后患
feature_list = list(features.columns)

# 转换成合适的格式
features = np.array(features)


features.shape
(348, 14)

from sklearn import preprocessing
input_features = preprocessing.StandardScaler().fit_transform(features)
```

### 1 构建网络模型

```python
x = torch.tensor(input_features, dtype = float)

y = torch.tensor(labels, dtype = float)

# 权重参数初始化
weights = torch.randn((14, 128), dtype = float, requires_grad = True) 
biases = torch.randn(128, dtype = float, requires_grad = True) 
weights2 = torch.randn((128, 1), dtype = float, requires_grad = True) 
biases2 = torch.randn(1, dtype = float, requires_grad = True) 

learning_rate = 0.001 
losses = []

for i in range(1000):
    # 计算隐层
    hidden = x.mm(weights) + biases
    # 加入激活函数
    hidden =  .relu(hidden)
    # 预测结果
    predictions = hidden.mm(weights2) + biases2
    # 通计算损失
    loss = torch.mean((predictions - y) ** 2) 
    losses.append(loss.data.numpy())
    
    # 打印损失值
    if i % 100 == 0:
        print('loss:', loss)
    #返向传播计算
    loss.backward()
    
    #更新参数
    weights.data.add_(- learning_rate * weights.grad.data)  
    biases.data.add_(- learning_rate * biases.grad.data)
    weights2.data.add_(- learning_rate * weights2.grad.data)
    biases2.data.add_(- learning_rate * biases2.grad.data)
    
    # 每次迭代都得记得清空
    weights.grad.data.zero_()
    biases.grad.data.zero_()
    weights2.grad.data.zero_()
    biases2.grad.data.zero_()

predictions.shape
torch.Size([348, 1])
```

### 2 更简单的构建网络模型

```python
input_size = input_features.shape[1]
hidden_size = 128
output_size = 1
batch_size = 16
my_nn = torch.nn.Sequential(
    torch.nn.Linear(input_size, hidden_size),
    torch.nn.Sigmoid(),
    torch.nn.Linear(hidden_size, output_size),
)
# 损失函数
cost = torch.nn.MSELoss(reduction='mean')
# adam 论文引文第一 
optimizer = torch.optim.Adam(my_nn.parameters(), lr = 0.001)
```

```python
# 训练网络
losses = []
for i in range(1000):
    batch_loss = []
    # MINI-Batch方法来进行训练    batch_size间隔
    for start in range(0, len(input_features), batch_size):
        end = start + batch_size if start + batch_size < len(input_features) else len(input_features)
        xx = torch.tensor(input_features[start:end], dtype = torch.float, requires_grad = True)
        yy = torch.tensor(labels[start:end], dtype = torch.float, requires_grad = True)
        prediction = my_nn(xx)
        loss = cost(prediction, yy)
        optimizer.zero_grad()
        loss.backward(retain_graph=True)
        optimizer.step()
        batch_loss.append(loss.data.numpy())
    
    # 打印损失
    if i % 100==0:
        losses.append(np.mean(batch_loss))
        print(i, np.mean(batch_loss))
```

```python
x = torch.tensor(input_features, dtype = torch.float)
predict = my_nn(x).data.numpy()
```

```python
# 转换日期格式
dates = [str(int(year)) + '-' + str(int(month)) + '-' + str(int(day)) for year, month, day in zip(years, months, days)]
dates = [datetime.datetime.strptime(date, '%Y-%m-%d') for date in dates]

# 创建一个表格来存日期和其对应的标签数值
true_data = pd.DataFrame(data = {'date': dates, 'actual': labels})

# 同理，再创建一个来存日期和其对应的模型预测值
months = features[:, feature_list.index('month')]
days = features[:, feature_list.index('day')]
years = features[:, feature_list.index('year')]

test_dates = [str(int(year)) + '-' + str(int(month)) + '-' + str(int(day)) for year, month, day in zip(years, months, days)]
 
test_dates = [datetime.datetime.strptime(date, '%Y-%m-%d') for date in test_dates]

predictions_data = pd.DataFrame(data = {'date': test_dates, 'prediction': predict.reshape(-1)}) 
```

```python
# 真实值
plt.plot(true_data['date'], true_data['actual'], 'b-', label = 'actual')

# 预测值
plt.plot(predictions_data['date'], predictions_data['prediction'], 'ro', label = 'prediction')
plt.xticks(rotation = '60'); 
plt.legend()

# 图名
plt.xlabel('Date'); plt.ylabel('Maximum Temperature (F)'); plt.title('Actual and Predicted Values');
```

## 3. 卷积神将网络参数解读

### 1 构建卷积神经网络

```python
# 卷积网络中的输入和层与传统神经网络有些区别，需重新设计，训练模块基本一致
import torch
import torch.nn as nn
import torch.optim as optim
import torch.nn.functional as F
from torchvision import datasets,transforms 
import matplotlib.pyplot as plt
import numpy as np
%matplotlib inline
```

### 2 首先读取数据

```python
# 分别构建训练集和测试集（验证集）
# DataLoader来迭代取数据

# 定义超参数 
input_size = 28  #图像的总尺寸28*28
num_classes = 10  #标签的种类数
num_epochs = 3  #训练的总循环周期
batch_size = 64  #一个撮（批次）的大小，64张图片

# 训练集
train_dataset = datasets.MNIST(root='./data',  
                            train=True,   
                            transform=transforms.ToTensor(),  
                            download=True) 

# 测试集
test_dataset = datasets.MNIST(root='./data', 
                           train=False, 
                           transform=transforms.ToTensor())

# 构建batch数据
train_loader = torch.utils.data.DataLoader(dataset=train_dataset, 
                                           batch_size=batch_size, 
                                           shuffle=True)
test_loader = torch.utils.data.DataLoader(dataset=test_dataset, 
                                           batch_size=batch_size, 
                                           shuffle=True)
```

### 3 卷积网络模块构建

```python
# 一般卷积层，relu层，池化层可以写成一个套餐
# 注意卷积最后结果还是一个特征图，需要把图转换成向量才能做分类或者回归任务
class CNN(nn.Module):
    def __init__(self):
        super(CNN, self).__init__()
        self.conv1 = nn.Sequential(         # 输入大小 (1, 28, 28)
            # 2d的卷积做任务   图像    3d的话就是视频数据
            nn.Conv2d(
                in_channels=1,              # 灰度图
                out_channels=16,            # 要得到几多少个特征图  卷积核的个数
                kernel_size=5,              # 卷积核大小 5*5
                stride=1,                   # 步长 
                padding=2,                  # 如果希望卷积后大小跟原来一样，需要设置padding=(kernel_size-1)/2 if stride=1
            ),                              # 输出的特征图为 (16, 28, 28)
            nn.ReLU(),                      # relu层
            nn.MaxPool2d(kernel_size=2),    # 进行池化操作（2x2 区域）, 输出结果为： (16, 14, 14) 压缩完为原来的一半
        )
        self.conv2 = nn.Sequential(         # 下一个套餐的输入 (16, 14, 14)
            # 输出 16  需要32个特征
            nn.Conv2d(16, 32, 5, 1, 2),     # 输出 (32, 14, 14) 
            nn.ReLU(),                      # relu层
            nn.Conv2d(32, 32, 5, 1, 2),
            nn.ReLU(),
            nn.MaxPool2d(2),                # 输出 (32, 7, 7)
        )
        
        self.conv3 = nn.Sequential(         # 下一个套餐的输入 (16, 14, 14)
            nn.Conv2d(32, 64, 5, 1, 2),     # 输出 (32, 14, 14)
            nn.ReLU(),             # 输出 (64, 7, 7)
        )
        
        self.out = nn.Linear(64 * 7 * 7, 10)   # 全连接层得到的结果

    def forward(self, x): # 前向传播
        x = self.conv1(x) # x有4个维度   bactch,c,h,w
        x = self.conv2(x)
        x = self.conv3(x)
        # view = reshape   （bactch不变,特征个数） 四维变成二维矩阵
        x = x.view(x.size(0), -1)           # flatten操作，结果为：(batch_size, 32 * 7 * 7)
        output = self.out(x)
        return output
```

### 4 准确率作为评估标准

```python
def accuracy(predictions, labels):
    # torch.max有两个返回值  [0]最大值  [1]索引
    pred = torch.max(predictions.data, 1)[1] 
    rights = pred.eq(labels.data.view_as(pred)).sum() 
    return rights, len(labels)
```

### 5 训练网络模型

```python
# 实例化
net = CNN() 
#损失函数
criterion = nn.CrossEntropyLoss() 
#优化器
optimizer = optim.Adam(net.parameters(), lr=0.001) #定义优化器，普通的随机梯度下降算法

#开始训练循环
for epoch in range(num_epochs):
    #当前epoch的结果保存下来
    train_rights = [] 
    
    for batch_idx, (data, target) in enumerate(train_loader):  #针对容器中的每一个批进行循环
        net.train()                             
        output = net(data) 
        loss = criterion(output, target) 
        optimizer.zero_grad() 
        loss.backward() 
        optimizer.step() 
        right = accuracy(output, target) 
        train_rights.append(right) 

    
        if batch_idx % 100 == 0: 
            
            net.eval() 
            val_rights = [] 
            
            for (data, target) in test_loader:
                output = net(data) 
                right = accuracy(output, target) 
                val_rights.append(right)
                
            #准确率计算
            train_r = (sum([tup[0] for tup in train_rights]), sum([tup[1] for tup in train_rights]))
            val_r = (sum([tup[0] for tup in val_rights]), sum([tup[1] for tup in val_rights]))

            print('当前epoch: {} [{}/{} ({:.0f}%)]\t损失: {:.6f}\t训练集准确率: {:.2f}%\t测试集正确率: {:.2f}%'.format(
                epoch, batch_idx * batch_size, len(train_loader.dataset),
                100. * batch_idx / len(train_loader), 
                loss.data, 
                100. * train_r[0].numpy() / train_r[1], 
                100. * val_r[0].numpy() / val_r[1]))
```

```
当前epoch: 2 [25600/60000 (43%)]	损失: 0.018130	训练集准确率: 99.16%	测试集正确率: 99.09%
当前epoch: 2 [32000/60000 (53%)]	损失: 0.006968	训练集准确率: 99.15%	测试集正确率: 99.11%
```

## 4. 图像识别模型与训练策略

### 1.0.1 数据预处理部分：

- 数据增强：torchvision中transforms模块自带功能，比较实用
- 数据预处理：torchvision中transforms也帮我们实现好了，直接调用即可
- DataLoader模块直接读取batch数据

### 1.0.2 网络模块设置：

- 加载预训练模型，torchvision中有很多经典网络架构，调用起来十分方便，并且可以用人家训练好的权重参数来继续训练，也就是所谓的迁移学习
- 需要注意的是别人训练好的任务跟咱们的可不是完全一样，需要把最后的head层改一改，一般也就是最后的全连接层，改成咱们自己的任务
- 训练时可以全部重头训练，也可以只训练最后咱们任务的层，因为前几层都是做特征提取的，本质任务目标是一致的

### 1.0.3 网络模型保存与测试

- 模型保存的时候可以带有选择性，例如在验证集中如果当前效果好则保存
- 读取模型进行实际测试

```python
import os
import matplotlib.pyplot as plt
%matplotlib inline
import numpy as np
import torch
from torch import nn
import torch.optim as optim
import torchvision
#pip install torchvision
from torchvision import transforms, models, datasets
#https://pytorch.org/docs/stable/torchvision/index.html
import imageio
import time
import warnings
warnings.filterwarnings("ignore")
import random
import sys
import copy
import json
from PIL import Image
```

### 1.0.4 数据读取与预处理操作

```python
data_dir = './flower_data/'
train_dir = data_dir + '/train'
valid_dir = data_dir + '/valid'
```

### 1.0.5 制作好数据源：

- data_transforms中指定了所有图像预处理操作
- ImageFolder假设所有的文件按文件夹保存好，每个文件夹下面存贮同一类别的图片，文件夹的名字为分类的名字

```python
data_transforms = {
    'train': 
        transforms.Compose([
        transforms.Resize([96, 96]),
        transforms.RandomRotation(45),#随机旋转，-45到45度之间随机选  数据增强
        transforms.CenterCrop(64),#从中心开始裁剪
        transforms.RandomHorizontalFlip(p=0.5),#随机水平翻转 选择一个概率概率
        transforms.RandomVerticalFlip(p=0.5),#随机垂直翻转
        transforms.ColorJitter(brightness=0.2, contrast=0.1, saturation=0.1, hue=0.1),#参数1为亮度，参数2为对比度，参数3为饱和度，参数4为色相
        transforms.RandomGrayscale(p=0.025),#概率转换成灰度率，3通道就是R=G=B
        transforms.ToTensor(), # 转化为torch支持的数据结构
        transforms.Normalize([0.485, 0.456, 0.406], [0.229, 0.224, 0.225])#均值，标准差
    ]),
    'valid': 
        transforms.Compose([
        transforms.Resize([64, 64]),
        transforms.ToTensor(),
        transforms.Normalize([0.485, 0.456, 0.406], [0.229, 0.224, 0.225])
    ]),
}

batch_size = 128 

image_datasets = {x: datasets.ImageFolder(os.path.join(data_dir, x), data_transforms[x]) for x in ['train', 'valid']}
dataloaders = {x: torch.utils.data.DataLoader(image_datasets[x], batch_size=batch_size, shuffle=True) for x in ['train', 'valid']}
dataset_sizes = {x: len(image_datasets[x]) for x in ['train', 'valid']}
class_names = image_datasets['train'].classes
```

```python
image_datasets

dataloaders
{'train': <torch.utils.data.dataloader.DataLoader at 0x1e4c50b9400>,
 'valid': <torch.utils.data.dataloader.DataLoader at 0x1e4c51ad128>}

dataset_sizes
{'train': 6552, 'valid': 818}
```

### 1.0.6 读取标签对应的实际名字

```python
with open('cat_to_name.json', 'r') as f:
    cat_to_name = json.load(f)

cat_to_name
{'1': 'pink primrose',
 '10': 'globe thistle',
```

### 1.0.7 加载models中提供的模型
并且直接用训练的好权重当做初始化参数

- 第一次执行需要下载，可能会比较慢，我会提供给大家一份下载好的，可以直接放到相应路径

```python
model_name = 'resnet'  #可选的比较多 ['resnet', 'alexnet', 'vgg', 'squeezenet', 'densenet', 'inception']
#是否用人家训练好的特征来做
feature_extract = True #都用人家特征，咱先不更新
```

```python
# 是否用GPU训练
train_on_gpu = torch.cuda.is_available()

if not train_on_gpu:
    print('CUDA is not available.  Training on CPU ...')
else:
    print('CUDA is available!  Training on GPU ...')
    
device = torch.device("cuda:0" if torch.cuda.is_available() else "cpu")
```

```python
# 有时候用人家模型，就一直用了，更不更新咱们可以自己定
def set_parameter_requires_grad(model, feature_extracting):
    if feature_extracting:
        for param in model.parameters():
            param.requires_grad = False  # 反向传播的时候不计算梯度
            
model_ft = models.resnet18()#18层的能快点，条件好点的也可以选152
model_ft
```

### 1.0.8 把模型输出层改成自己的

```python
def initialize_model(model_name, num_classes, feature_extract, use_pretrained=True):
    
    model_ft = models.resnet18(pretrained=use_pretrained) # use_pretrained 别人训练好的参数 
    set_parameter_requires_grad(model_ft, feature_extract)
    
    num_ftrs = model_ft.fc.in_features
    model_ft.fc = nn.Linear(num_ftrs, 102)#类别数自己根据自己任务来 102个类别
                            
    input_size = 64#输入大小根据自己配置来

    return model_ft, input_size
```

### 1.0.9 设置哪些层需要训练

```python

model_ft, input_size = initialize_model(model_name, 102, feature_extract, use_pretrained=True)

#GPU还是CPU计算
model_ft = model_ft.to(device)

# 模型保存，名字自己起
filename='checkpoint.pth'

# 是否训练所有层
params_to_update = model_ft.parameters()
print("Params to learn:")
if feature_extract:
    params_to_update = []
    for name,param in model_ft.named_parameters():
        if param.requires_grad == True:
            params_to_update.append(param)
            print("\t",name)
else:
    for name,param in model_ft.named_parameters():
        if param.requires_grad == True:
            print("\t",name)
Params to learn:
	 fc.weight
	 fc.bias
```

### 1.0.10 优化器设置

```python
# 优化器设置
optimizer_ft = optim.Adam(params_to_update, lr=1e-2)#要训练啥参数，你来定
scheduler = optim.lr_scheduler.StepLR(optimizer_ft, step_size=10, gamma=0.1)#学习率每7个epoch衰减成原来的1/10
criterion = nn.CrossEntropyLoss()
```

### 1.0.11 训练模块

```python
def train_model(model, dataloaders, criterion, optimizer, num_epochs=25,filename='best.pt'):
    #咱们要算时间的
    since = time.time()
    #也要记录最好的那一次
    best_acc = 0
    #模型也得放到你的CPU或者GPU
    model.to(device)
    #训练过程中打印一堆损失和指标
    val_acc_history = []
    train_acc_history = []
    train_losses = []
    valid_losses = []
    #学习率
    LRs = [optimizer.param_groups[0]['lr']]
    #最好的那次模型，后续会变的，先初始化
    best_model_wts = copy.deepcopy(model.state_dict())
    #一个个epoch来遍历
    for epoch in range(num_epochs):
        print('Epoch {}/{}'.format(epoch, num_epochs - 1))
        print('-' * 10)

        # 训练和验证
        for phase in ['train', 'valid']:
            if phase == 'train':
                model.train()  # 训练
            else:
                model.eval()   # 验证

            running_loss = 0.0
            running_corrects = 0

            # 把数据都取个遍
            for inputs, labels in dataloaders[phase]:
                inputs = inputs.to(device)#放到你的CPU或GPU
                labels = labels.to(device)

                # 清零
                optimizer.zero_grad()
                # 只有训练的时候计算和更新梯度
                outputs = model(inputs)
                loss = criterion(outputs, labels)
                _, preds = torch.max(outputs, 1)
                # 训练阶段更新权重
                if phase == 'train':
                    loss.backward()
                    optimizer.step()

                # 计算损失
                running_loss += loss.item() * inputs.size(0)#0表示batch那个维度
                running_corrects += torch.sum(preds == labels.data)#预测结果最大的和真实值是否一致
                
            
            
            epoch_loss = running_loss / len(dataloaders[phase].dataset)#算平均
            epoch_acc = running_corrects.double() / len(dataloaders[phase].dataset)
            
            time_elapsed = time.time() - since#一个epoch我浪费了多少时间
            print('Time elapsed {:.0f}m {:.0f}s'.format(time_elapsed // 60, time_elapsed % 60))
            print('{} Loss: {:.4f} Acc: {:.4f}'.format(phase, epoch_loss, epoch_acc))
            

            # 得到最好那次的模型
            if phase == 'valid' and epoch_acc > best_acc:
                best_acc = epoch_acc
                best_model_wts = copy.deepcopy(model.state_dict())
                state = {
                  'state_dict': model.state_dict(),#字典里key就是各层的名字，值就是训练好的权重
                  'best_acc': best_acc,
                  'optimizer' : optimizer.state_dict(),
                }
                torch.save(state, filename)
            if phase == 'valid':
                val_acc_history.append(epoch_acc)
                valid_losses.append(epoch_loss)
                #scheduler.step(epoch_loss)#学习率衰减
            if phase == 'train':
                train_acc_history.append(epoch_acc)
                train_losses.append(epoch_loss)
        
        print('Optimizer learning rate : {:.7f}'.format(optimizer.param_groups[0]['lr']))
        LRs.append(optimizer.param_groups[0]['lr'])
        print()
        scheduler.step()#学习率衰减

    time_elapsed = time.time() - since
    print('Training complete in {:.0f}m {:.0f}s'.format(time_elapsed // 60, time_elapsed % 60))
    print('Best val Acc: {:4f}'.format(best_acc))

    # 训练完后用最好的一次当做模型最终的结果,等着一会测试
    model.load_state_dict(best_model_wts)
    return model, val_acc_history, train_acc_history, valid_losses, train_losses, LRs 
```

### 1.0.12 开始训练

```python
model_ft, val_acc_history, train_acc_history, valid_losses, train_losses, LRs  = train_model(model_ft, dataloaders, criterion, optimizer_ft, num_epochs=20)
```

### 1.0.13 再继续训练所有层

```python
for param in model_ft.parameters():
    param.requires_grad = True

# 再继续训练所有的参数，学习率调小一点
optimizer = optim.Adam(model_ft.parameters(), lr=1e-3)
scheduler = optim.lr_scheduler.StepLR(optimizer_ft, step_size=7, gamma=0.1)

# 损失函数
criterion = nn.CrossEntropyLoss()

# 加载之前训练好的权重参数
checkpoint = torch.load(filename)
best_acc = checkpoint['best_acc']
model_ft.load_state_dict(checkpoint['state_dict'])

model_ft, val_acc_history, train_acc_history, valid_losses, train_losses, LRs  = train_model(model_ft, dataloaders, criterion, optimizer, num_epochs=10,)
```

### 1.0.14 加载训练好的模型

```python
model_ft, input_size = initialize_model(model_name, 102, feature_extract, use_pretrained=True)

# GPU模式
model_ft = model_ft.to(device)

# 保存文件的名字
filename='best.pt'

# 加载模型
checkpoint = torch.load(filename)
best_acc = checkpoint['best_acc']
model_ft.load_state_dict(checkpoint['state_dict'])
```

### 1.0.15 测试数据预处理

- 测试数据处理方法需要跟训练时一直才可以
- crop操作的目的是保证输入的大小是一致的
- 标准化操作也是必须的，用跟训练数据相同的mean和std,但是需要注意一点训练数据是在0-1上进行标准化，所以测试数据也需要先归一化
- 最后一点，PyTorch中颜色通道是第一个维度，跟很多工具包都不一样，需要转换

```python
# 得到一个batch的测试数据
dataiter = iter(dataloaders['valid'])
images, labels = dataiter.next()
 
model_ft.eval()

if train_on_gpu:
    output = model_ft(images.cuda())
else:
    output = model_ft(images)
```

```python
# output表示对一个batch中每一个数据得到其属于各个类别的可能性
output.shape
torch.Size([128, 102])
```

### 1.0.16 得到概率最大的那个

```python
_, preds_tensor = torch.max(output, 1)

preds = np.squeeze(preds_tensor.numpy()) if not train_on_gpu else np.squeeze(preds_tensor.cpu().numpy())
preds
```

### 1.0.17 展示预测结果

```python
def im_convert(tensor):
    """ 展示数据"""
    image = tensor.to("cpu").clone().detach()
    image = image.numpy().squeeze()
    image = image.transpose(1,2,0)
    image = image * np.array((0.229, 0.224, 0.225)) + np.array((0.485, 0.456, 0.406))
    image = image.clip(0, 1)

    return image

fig=plt.figure(figsize=(20, 20))
columns =4
rows = 2 

for idx in range (columns*rows):
    ax = fig.add_subplot(rows, columns, idx+1, xticks=[], yticks=[])
    plt.imshow(im_convert(images[idx]))
    ax.set_title("{} ({})".format(cat_to_name[str(preds[idx])], cat_to_name[str(labels[idx].item())]),
                 color=("green" if cat_to_name[str(preds[idx])]==cat_to_name[str(labels[idx].item())] else "red"))
plt.show()
```

##  5.数据集Dataloader制作

### 1.1 如何自定义数据集：

- 1.数据和标签的目录结构先搞定(得知道到哪读数据)
- 2.写好读取数据和标签路径的函数(根据自己数据集情况来写)
- 3.完成单个数据与标签读取函数(给dataloader举一个例子)

### 1.2 咱们以花朵数据集为例：

- 原来数据集都是以文件夹为类别ID，现在咱们换一个套路，用txt文件指定数据路径与标签(实际情况基本都这样)
- 这回咱们的任务就是在txt文件中获取图像路径与标签，然后把他们交给dataloader
- 核心代码非常简单，按照对应格式传递需要的数据和标签就可以啦

```python
import os
import matplotlib.pyplot as plt
%matplotlib inline
import numpy as np
import torch
from torch import nn
import torch.optim as optim
import torchvision
#pip install torchvision
from torchvision import transforms, models, datasets
#https://pytorch.org/docs/stable/torchvision/index.html
import imageio
import time
import warnings
import random
import sys
import copy
import json
from PIL import Image
```

### 2.0.1 任务1：读取txt文件中的路径和标签

- 第一个小任务，从标注文件中读取数据和标签
- 至于你准备存成什么格式，都可以的，一会能取出来东西就行

```python
def load_annotations(ann_file):
    data_infos = {}
    with open(ann_file) as f:
        # image_06734.jpg 0
        samples = [x.strip().split(' ') for x in f.readlines()]
        for filename, gt_label in samples: 
            # 'image_06734.jpg': array(0, dtype=int64)
            data_infos[filename] = np.array(gt_label, dtype=np.int64)
    return data_infos
print(load_annotations('./flower_data/train.txt'))
```

### 2.0.2 任务2：分别把数据和标签都存在list里

- 不是我非让你存list里，因为dataloader到时候会在这里取数据
- 按照人家要求来，不要耍个性，让整list咱就给人家整

```python
img_label = load_annotations('./flower_data/train.txt')
image_name = list(img_label.keys())
label = list(img_label.values()
```

### 2.0.3 任务3：图像数据路径得完整

- 因为一会咱得用这个路径去读数据，所以路径得加上前缀
- 以后大家任务不同，数据不同，怎么加你看着来就行，反正得能读到图像

```python
data_dir = './flower_data/'
train_dir = data_dir + '/train_filelist'
valid_dir = data_dir + '/val_filelist'

image_path = [os.path.join(train_dir,img) for img in image_name]
image_path
```

### 2.0.4 任务4：把上面那几个事得写在一起

- 1.注意要使用from torch.utils.data import Dataset, DataLoader
- 2.类名定义class FlowerDataset(Dataset)，其中FlowerDataset可以改成自己的名字
- 3.def **init**(self, root_dir, ann_file, transform=None):咱们要根据自己任务重写
- 4.def **getitem**(self, idx):根据自己任务，返回图像数据和标签数据

```python
from torch.utils.data import Dataset, DataLoader
class FlowerDataset(Dataset):
    def __init__(self, root_dir, ann_file, transform=None):
        self.ann_file = ann_file # txt
        self.root_dir = root_dir # 图像所在文件夹
        # 字典格式的 'image_06734.jpg': array(0, dtype=int64)
        self.img_label = self.load_annotations()
        # 图像路径
        self.img = [os.path.join(self.root_dir,img) for img in list(self.img_label.keys())]
        self.label = [label for label in list(self.img_label.values())]
        self.transform = transform
 
    def __len__(self):
        return len(self.img)
 
    def __getitem__(self, idx):
        image = Image.open(self.img[idx])
        label = self.label[idx]
        if self.transform:
            image = self.transform(image)
        label = torch.from_numpy(np.array(label))
        return image, label
    
    # 返回字典形式 
    def load_annotations(self):
        data_infos = {}
        with open(self.ann_file) as f:
            samples = [x.strip().split(' ') for x in f.readlines()]
            for filename, gt_label in samples:
                # 'image_06734.jpg': array(0, dtype=int64)
                data_infos[filename] = np.array(gt_label, dtype=np.int64)
            
        return data_infos
```

### 2.0.5 任务5：数据预处理(transform)

- 1.预处理的事都在上面的**getitem**中完成，需要对图像和标签咋咋地的，要整啥事，都在上面整
- 2.返回的数据和标签就是建模时模型的输入和损失函数中标签的输入，一定整明白自己模型要啥
- 3.预处理这个事是你定的，不同的数据需要的方法也不一样，下面给出的是比较通用的方法

```python
data_transforms = {
    'train': 
        transforms.Compose([
        transforms.Resize(64),
        transforms.RandomRotation(45),#随机旋转，-45到45度之间随机选
        transforms.CenterCrop(64),#从中心开始裁剪
        transforms.RandomHorizontalFlip(p=0.5),#随机水平翻转 选择一个概率概率
        transforms.RandomVerticalFlip(p=0.5),#随机垂直翻转
        transforms.ColorJitter(brightness=0.2, contrast=0.1, saturation=0.1, hue=0.1),#参数1为亮度，参数2为对比度，参数3为饱和度，参数4为色相
        transforms.RandomGrayscale(p=0.025),#概率转换成灰度率，3通道就是R=G=B
        transforms.ToTensor(),
        transforms.Normalize([0.485, 0.456, 0.406], [0.229, 0.224, 0.225])#均值，标准差
    ]),
    'valid': 
        transforms.Compose([
        transforms.Resize(64),
        transforms.CenterCrop(64),
        transforms.ToTensor(),
        transforms.Normalize([0.485, 0.456, 0.406], [0.229, 0.224, 0.225])
    ]),
}
```

### 2.0.6 任务6：根据写好的class FlowerDataset(Dataset):来实例化咱们的dataloader

- 1.构建数据集：分别创建训练和验证用的数据集（如果需要测试集也一样的方法）
- 2.用Torch给的DataLoader方法来实例化(batch啥的自己定，根据你的显存来选合适的)
- 3.打印看看数据里面是不是有东西了

``` python
train_dataset = FlowerDataset(root_dir=train_dir, ann_file = './flower_data/train.txt', transform=data_transforms['train'])
val_dataset = FlowerDataset(root_dir=valid_dir, ann_file = './flower_data/val.txt', transform=data_transforms['valid'])

train_loader = DataLoader(train_dataset, batch_size=64, shuffle=True)
val_loader = DataLoader(val_dataset, batch_size=64, shuffle=True)

len(train_dataset)
6552
len(val_dataset)
818
```

### 2.0.7 任务7：用之前先试试，整个数据和标签对应下，看看对不对

- 1.别着急往模型里传，对不对都不知道呢
- 2.用这个方法：iter(train_loader).next()来试试，得到的数据和标签是啥
- 3.看不出来就把图画出来，标签打印出来，确保自己整的数据集没啥问题

```python
image, label = iter(train_loader).next() # .next()取一个batch数据
sample = image[0].squeeze() # 3*64*64
sample = sample.permute((1, 2, 0)).numpy() # 64*64*3 
sample *= [0.229, 0.224, 0.225] # 标准差
sample += [0.485, 0.456, 0.406] # 均值
plt.imshow(sample)
plt.show()
print('Label is: {}'.format(label[0].numpy()))


image, label = iter(val_loader).next()
sample = image[0].squeeze()
sample = sample.permute((1, 2, 0)).numpy()
sample *= [0.229, 0.224, 0.225]
sample += [0.485, 0.456, 0.406]
plt.imshow(sample)
plt.show()
print('Label is: {}'.format(label[0].numpy()))
```

### 2.0.8 任务8：咋用就是你来定了，把模型啥的整好往里面传吧

- 下面这些事之前都唠过了，按照自己习惯的方法整就得了

```python
dataloaders = {'train':train_loader,'valid':val_loader}
model_name = 'resnet'  #可选的比较多 ['resnet', 'alexnet', 'vgg', 'squeezenet', 'densenet', 'inception']
#是否用人家训练好的特征来做
feature_extract = True 
```

```python
# 是否用GPU训练
train_on_gpu = torch.cuda.is_available()

if not train_on_gpu:
    print('CUDA is not available.  Training on CPU ...')
else:
    print('CUDA is available!  Training on GPU ...')
    
device = torch.device("cuda:0" if torch.cuda.is_available() else "cpu")
```

```python
model_ft = models.resnet18()
model_ft
```

```python
num_ftrs = model_ft.fc.in_features
model_ft.fc = nn.Sequential(nn.Linear(num_ftrs, 102))
input_size = 64
model_ft
```

```python
# 优化器设置
optimizer_ft = optim.Adam(model_ft.parameters(), lr=1e-3)
scheduler = optim.lr_scheduler.StepLR(optimizer_ft, step_size=7, gamma=0.1)#学习率每7个epoch衰减成原来的1/10
criterion = nn.CrossEntropyLoss()
```

```python
def train_model(model, dataloaders, criterion, optimizer, num_epochs=25, is_inception=False, filename='best.pth'):
    since = time.time()
    best_acc = 0
    model.to(device)

    val_acc_history = []
    train_acc_history = []
    train_losses = []
    valid_losses = []
    LRs = [optimizer.param_groups[0]['lr']]

    best_model_wts = copy.deepcopy(model.state_dict())

    for epoch in range(num_epochs):
        print('Epoch {}/{}'.format(epoch, num_epochs - 1))
        print('-' * 10)

        # 训练和验证
        for phase in ['train', 'valid']:
            if phase == 'train':
                model.train()  # 训练
            else:
                model.eval()   # 验证

            running_loss = 0.0
            running_corrects = 0

            # 把数据都取个遍
            for inputs, labels in dataloaders[phase]:
                inputs = inputs.to(device)
                labels = labels.to(device)

                # 清零
                optimizer.zero_grad()
                # 只有训练的时候计算和更新梯度
                with torch.set_grad_enabled(phase == 'train'):
                    outputs = model(inputs)
                    loss = criterion(outputs, labels)
                    _, preds = torch.max(outputs, 1)
                    #print(loss)

                    # 训练阶段更新权重
                    if phase == 'train':
                        loss.backward()
                        optimizer.step()

                # 计算损失
                running_loss += loss.item() * inputs.size(0)
                running_corrects += torch.sum(preds == labels.data)

            epoch_loss = running_loss / len(dataloaders[phase].dataset)
            epoch_acc = running_corrects.double() / len(dataloaders[phase].dataset)
            
            
            time_elapsed = time.time() - since
            print('Time elapsed {:.0f}m {:.0f}s'.format(time_elapsed // 60, time_elapsed % 60))
            print('{} Loss: {:.4f} Acc: {:.4f}'.format(phase, epoch_loss, epoch_acc))
            

            # 得到最好那次的模型
            if phase == 'valid' and epoch_acc > best_acc:
                best_acc = epoch_acc
                best_model_wts = copy.deepcopy(model.state_dict())
                state = {
                  'state_dict': model.state_dict(),#字典里key就是各层的名字，值就是训练好的权重
                  'best_acc': best_acc,
                  'optimizer' : optimizer.state_dict(),#优化器的状态信息
                }
                torch.save(state, filename)
            if phase == 'valid':
                val_acc_history.append(epoch_acc)
                valid_losses.append(epoch_loss)
                scheduler.step(epoch_loss)#学习率衰减
            if phase == 'train':
                train_acc_history.append(epoch_acc)
                train_losses.append(epoch_loss)
        
        print('Optimizer learning rate : {:.7f}'.format(optimizer.param_groups[0]['lr']))
        LRs.append(optimizer.param_groups[0]['lr'])
        print()

    time_elapsed = time.time() - since
    print('Training complete in {:.0f}m {:.0f}s'.format(time_elapsed // 60, time_elapsed % 60))
    print('Best val Acc: {:4f}'.format(best_acc))

    # 训练完后用最好的一次当做模型最终的结果,等着一会测试
    model.load_state_dict(best_model_wts)
    return model, val_acc_history, train_acc_history, valid_losses, train_losses, LRs 
```

```python
model_ft, val_acc_history, train_acc_history, valid_losses, train_losses, LRs  = train_model(model_ft, dataloaders, criterion, optimizer_ft, num_epochs=20, filename='best.pth')
```

## 6. LSTM文本分类实战

见pycharm

## 7. flask部署

见pycharm  测试成功