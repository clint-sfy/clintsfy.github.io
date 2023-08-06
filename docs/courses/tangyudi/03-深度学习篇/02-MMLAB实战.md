---
title: MMLAB
author: 阿源
date: 2023/07/14 12:00
categories:
 - 深度学习快速入门
tags:
 - 深度学习
 - MMLAB
---
# MMLAB

## 1. 模块一：分类任务基本操作

源码：mmclassification-master

### 1.基本参数配置解读

configs -> _base_ -> model -> resnet18.py

```python
# model settings
model = dict(
    type='ImageClassifier',
    # 预处理不用改 没那个能力
    backbone=dict(
        type='ResNet',
        depth=18,
        num_stages=4,
        out_indices=(3, ),
        style='pytorch'),
    neck=dict(type='GlobalAveragePooling'),
    # head层 可以在这改
    head=dict(
        type='LinearClsHead',  # 分类任务就用这个
        num_classes=1000,  # 分类的数量 要改
        in_channels=512, # 自己定 输出的特征图
        loss=dict(type='CrossEntropyLoss', loss_weight=1.0), # 可以去尝试修改损失
        topk=(1, 5), # 评估标准
    ))
```

损失在  mmcls-> models -> losses

```python
# focal_loss
@LOSSES.register_module()
class FocalLoss(nn.Module):
# 直接改就行
```

configs -> _base_ -> datasets-> imagenet_bs32

```python
dataset_type = 'ImageNet'
img_norm_cfg = dict(
    mean=[123.675, 116.28, 103.53], std=[58.395, 57.12, 57.375], to_rgb=True)
# 数据集预处理操作
train_pipeline = [
    dict(type='LoadImageFromFile'), # 读文件
    dict(type='RandomResizedCrop', size=224), # 随机裁剪成224
    dict(type='RandomFlip', flip_prob=0.5, direction='horizontal'), # 水平翻转
    dict(type='Normalize', **img_norm_cfg), # 归一化
    dict(type='ImageToTensor', keys=['img']),
    dict(type='ToTensor', keys=['gt_label']), # 转化成ToTensor
    dict(type='Collect', keys=['img', 'gt_label']) 
]
test_pipeline = [
    dict(type='LoadImageFromFile'),
    dict(type='Resize', size=(256, -1)), # 害怕训练集太小了
    dict(type='CenterCrop', crop_size=224),
    dict(type='Normalize', **img_norm_cfg),
    dict(type='ImageToTensor', keys=['img']),
    dict(type='Collect', keys=['img'])
]
# 训练的配置
data = dict(
    samples_per_gpu=32, # 单卡的话butch_size , 多卡的话每张卡的butch_size
    workers_per_gpu=2,
    train=dict(
        type=dataset_type, # 自己去写 两种方法 读数据
        data_prefix='data/imagenet/train',
        pipeline=train_pipeline),
    val=dict(
        type=dataset_type,
        data_prefix='data/imagenet/val',
        ann_file='data/imagenet/meta/val.txt',
        pipeline=test_pipeline),
    test=dict(
        # replace `data/val` with `data/test` for standard test
        type=dataset_type,
        data_prefix='data/imagenet/val',
        ann_file='data/imagenet/meta/val.txt',
        pipeline=test_pipeline))
evaluation = dict(interval=1, metric='accuracy')
```

### 2. 各模块配置文件组成

策略 优化器：configs -> _base_ -> schedules-> imagenet_bs256

```python
# optimizer
optimizer = dict(type='SGD', lr=0.1, momentum=0.9, weight_decay=0.0001)
optimizer_config = dict(grad_clip=None)
# learning policy 学习率衰减
lr_config = dict(policy='step', step=[30, 60, 90]) # 迭代30 60 90次衰减
runner = dict(type='EpochBasedRunner', max_epochs=100)
```

默认配置：configs -> _base_ -> schedules-> defalut_runtime

```python
# checkpoint saving
checkpoint_config = dict(interval=1)
# yapf:disable
log_config = dict(
    interval=100,
    hooks=[
        dict(type='TextLoggerHook'),
        # dict(type='TensorboardLoggerHook')
    ])
# yapf:enable

dist_params = dict(backend='nccl')
log_level = 'INFO'
load_from = None
resume_from = None
workflow = [('train', 1)]
```

### 3. 生成完整的配置文件

tools -> train.py

加配置文件

```python
# D:\\mmclassification-master\configs\\resnet\resnet18_ 8xb32_lin1k.py
去生成自己的配置文件 然后修改
```

tools -> work_dirs  训练保存文件的位置

会生成一个 文件修改文件名   放到 configs -> resnet里面去

### 4. 根据文件夹自定义数据集

生成好的配置文件configs -> resnet->today_resnet18_8xb32_in1k.py

```python
model = dict(
    type='ImageClassifier',
    backbone=dict(
        type='ResNet',
        depth=18,
        num_stages=4,
        out_indices=(3, ),
        style='pytorch'),
    neck=dict(type='GlobalAveragePooling'),
    head=dict(
        type='LinearClsHead',
        num_classes=102,    # 输出层 102个花的种类
        in_channels=512,
        loss=dict(type='L1Loss', loss_weight=1.0),#L1Loss CrossEntropyLoss
        topk=(1, 5)))
dataset_type = 'ImageNet'
img_norm_cfg = dict(
    mean=[123.675, 116.28, 103.53], std=[58.395, 57.12, 57.375], to_rgb=True)
train_pipeline = [
    dict(type='LoadImageFromFile'),
    dict(type='RandomResizedCrop', size=224), # 如果显存太小 可以改小 不要改的太小
    dict(type='RandomFlip', flip_prob=0.5, direction='horizontal'),
    dict(
        type='Normalize', 
        mean=[123.675, 116.28, 103.53],
        std=[58.395, 57.12, 57.375],
        to_rgb=True),
    dict(type='ImageToTensor', keys=['img']),
    dict(type='ToTensor', keys=['gt_label']),
    dict(type='Collect', keys=['img', 'gt_label'])
]
test_pipeline = [
    dict(type='LoadImageFromFile'),
    dict(type='Resize', size=(256, -1)),
    dict(type='CenterCrop', crop_size=224),
    dict(
        type='Normalize',
        mean=[123.675, 116.28, 103.53],
        std=[58.395, 57.12, 57.375],
        to_rgb=True),
    dict(type='ImageToTensor', keys=['img']),
    dict(type='Collect', keys=['img'])
]
data = dict(
    samples_per_gpu=32,
    workers_per_gpu=2,
    train=dict(
        type='MyFilelist',
        data_prefix='D:\\eclipse-workspace\\PyTorch4\\mmclassification-master\\mmcls\\data\\flower_data\\train_filelist', # 改成自己的文件夹  训练集
        ann_file='D:\\eclipse-workspace\\PyTorch4\\mmclassification-master\\mmcls\\data\\flower_data\\train.txt', # 这个相当于文件名 对应的 标签
        pipeline=[
            dict(type='LoadImageFromFile'),
            dict(type='RandomResizedCrop', size=224),
            dict(type='RandomFlip', flip_prob=0.5, direction='horizontal'),
            dict(
                type='Normalize',
                mean=[123.675, 116.28, 103.53],
                std=[58.395, 57.12, 57.375],
                to_rgb=True),
            dict(type='ImageToTensor', keys=['img']),
            dict(type='ToTensor', keys=['gt_label']),
            dict(type='Collect', keys=['img', 'gt_label'])
        ]),
    val=dict(
        type='ImageNet',
        data_prefix='../mmcls/data/flower_data/val_filelist',
        ann_file='../mmcls/data/flower_data/val.txt', # 把他注释掉 就以文件夹为标签名
        pipeline=[
            dict(type='LoadImageFromFile'),
            dict(type='Resize', size=(256, -1)),
            dict(type='CenterCrop', crop_size=224),
            dict(
                type='Normalize',
                mean=[123.675, 116.28, 103.53],
                std=[58.395, 57.12, 57.375],
                to_rgb=True),
            dict(type='ImageToTensor', keys=['img']),
            dict(type='Collect', keys=['img'])
        ]),
    test=dict(
        type='ImageNet',
        data_prefix='../mmcls/data/flower_data/val_filelist',
        ann_file='../mmcls/data/flower_data/val.txt',
        pipeline=[
            dict(type='LoadImageFromFile'),
            dict(type='Resize', size=(256, -1)),
            dict(type='CenterCrop', crop_size=224),
            dict(
                type='Normalize',
                mean=[123.675, 116.28, 103.53],
                std=[58.395, 57.12, 57.375],
                to_rgb=True),
            dict(type='ImageToTensor', keys=['img']),
            dict(type='Collect', keys=['img'])
        ]))
evaluation = dict(interval=10, metric='accuracy')
optimizer = dict(type='SGD', lr=0.1, momentum=0.9, weight_decay=0.0001)
optimizer_config = dict(grad_clip=None)
lr_config = dict(policy='step', step=[30, 60, 90])
runner = dict(type='EpochBasedRunner', max_epochs=100)
checkpoint_config = dict(interval=50) # 隔50保存一次模型
log_config = dict(interval=100, hooks=[dict(type='TextLoggerHook')])
dist_params = dict(backend='nccl')
log_level = 'INFO'
load_from = None
resume_from = None
workflow = [('train', 1)]
work_dir = './work_dirs/resnet18_8xb32_in1k' # 工作路径 可以保存模型和日志
gpu_ids = [0]
```

运行文件

还是 在 tools -> train.py

配置文件改一下pycharm的 debug configuration 

```
mmclassification-master\\configs\\resnet\\today_resnet18_8xb32_in1k.py
```

### 5. 构建自己的数据集

#### 方法一

注意类别从0开始

```python
# filelist.py
import numpy as np
import os
import shutil
# 根据文件夹分类的数据放到一个文件夹中，并做好标签

train_path = './train'
train_out = './train.txt'
val_path = './valid'
val_out = './val.txt'

data_train_out = './train_filelist'
data_val_out = './val_filelist'

def get_filelist(input_path,output_path):
    with open(output_path,'w') as f:
        for dir_path,dir_names,file_names in os.walk(input_path):
            if dir_path != input_path:
                label = int(dir_path.split('\\')[-1]) -1
            #print(label)
            for filename in file_names:
                f.write(filename +' '+str(label)+"\n")

def move_imgs(input_path,output_path):
    for dir_path, dir_names, file_names in os.walk(input_path):
        for filename in file_names:
            #print(os.path.join(dir_path,filename))
            source_path = os.path.join(dir_path,filename)

            shutil.copyfile(source_path, os.path.join(output_path,filename))

get_filelist(train_path,train_out) # txt
get_filelist(val_path,val_out)
move_imgs(train_path,data_train_out) # 图片放到一个文件夹
move_imgs(val_path,data_val_out)
```

#### 方法二  

去mmcls -> datasets -> my_filelist.py

```python
import numpy as np

from .builder import DATASETS
from .base_dataset import BaseDataset

@DATASETS.register_module()
class MyFilelist(BaseDataset):
    # 这个会用到展示结果上  中文展示不出来
    CLASSES = [
        '我懒得写名字了，有102个。。。',
        '我懒得写名字了，有102个。。。',
        '我懒得写名字了，有102个。。。',
        '我懒得写名字了，有102个。。。',
        ]
    # 重写一下这个方法
    def load_annotations(self):
        assert isinstance(self.ann_file, str)

        data_infos = []
        with open(self.ann_file) as f:
            samples = [x.strip().split(' ') for x in f.readlines()]
            for filename, gt_label in samples:
                    info = {'img_prefix': self.data_prefix}
                    info['img_info'] = {'filename': filename}
                    info['gt_label'] = np.array(gt_label, dtype=np.int64)
                    data_infos.append(info)
                return data_infos
```

还需要在 mmcls -> datasets ->__init__.py    把自己文件导进去

```python
from .my_filelist import MyFilelist
# 还有个 MyFilelist
__all__ = [
    'BaseDataset', 'ImageNet', 'CIFAR10', 'CIFAR100', 'MNIST', 'FashionMNIST',
    'VOC', 'MultiLabelDataset', 'build_dataloader', 'build_dataset',
    'DistributedSampler', 'ConcatDataset', 'RepeatDataset',
    'ClassBalancedDataset', 'DATASETS', 'PIPELINES', 'ImageNet21k', 'SAMPLERS',
    'build_sampler', 'RepeatAugSampler', 'KFoldDataset', 'MyFilelist'
]
```

### 6. 问题

可能环境有问题 打印日志有问题 降低版本 1.4.7

```python
# trian.py 打印日志的代码注释
env_info_dict = collect_env()
env_info = '\n'.join([(f'{k}: {v}') for k, v in env_info_dict.items()])

meta['env_info'] = env_info
```

102 与 1000

在 mmcls -> datasets -> imagenet.py

```python
# 这个CLASSES 随便生成102个东西就行 删掉重新弄
@DATASETS.register_module()
class ImageNet(BaseDataset):
    """`ImageNet <http://www.image-net.org>`_ Dataset.

    This implementation is modified from
    https://github.com/pytorch/vision/blob/master/torchvision/datasets/imagenet.py
    """  # noqa: E501

    IMG_EXTENSIONS = ('.jpg', '.jpeg', '.png', '.ppm', '.bmp', '.pgm', '.tif')
    CLASSES = [
        'tench, Tinca tinca',
        'goldfish, Carassius auratus',
```

## 2. 模块一：训练结果测试与验证

### 1. 测试demo效果

demo -> image_demo.py

去修改pycharm 的配置 image_05094.jpg ../configs/resnet/today_resnet18_8xb32_in1k.py ../tools/work_dirs/resnet18_8xb32_in1k/epoch_100.pth

```python
# image_05094.jpg ../configs/resnet/today_resnet18_8xb32_in1k.py ../tools/work_dirs/resnet18_8xb32_in1k/epoch_100.pth
# 最后那个是训练好的模型
def main():
    parser = ArgumentParser()
    parser.add_argument('img', help='Image file')
    parser.add_argument('config', help='Config file')
    parser.add_argument('checkpoint', help='Checkpoint file')
    parser.add_argument(
        '--device', default='cuda:0', help='Device used for inference')
    args = parser.parse_args()

    # build the model from a config file and a checkpoint file
    model = init_model(args.config, args.checkpoint, device=args.device)
    # test a single image
    result = inference_model(model, args.img)
    # show the results
    show_result_pyplot(model, args.img, result)


if __name__ == '__main__':
    main()
```

### 2. 测试评估模型效果

tools -> test.py

修改 pycharm的配置  

第一个 把--show删掉 第二个是放文件的位置（这个可以删掉 太慢了）  第三个是评估指标

```python
# ../configs/resnet/today_resnet18_8xb32_in1k.py ../tools/work_dirs/resnet18_8xb32_in1k/epoch_100.pth
#--show-dir ../tools/work_dirs/resnet18_8xb32_in1k/val_result
#--metrics accuracy recall
def parse_args():
```

### 3. MMLS中新增模块

```python
model = dict(
    type='ImageClassifier',
    backbone=dict(
        type='ResNet',
        depth=18,
        num_stages=4,
        out_indices=(3, ),
        style='pytorch'),
    neck=dict(type='GlobalAveragePooling'),
    head=dict(
        type='LinearClsHead',
        num_classes=102,    # 输出层 102个花的种类
        in_channels=512,
        # 自己设计损失函数
        loss=dict(type='L1Loss', loss_weight=1.0),#L1Loss CrossEntropyLoss
        topk=(1, 5)))
dataset_type = 'ImageNet'
```

#### 自己设计损失函数

自己去定义一个 L1Loss

```python
import torch
import torch.nn as nn
from ..builder import LOSSES
from .utils import weighted_loss

@weighted_loss
def l1_loss(pred, target):
    target = nn.functional.one_hot(target,num_classes=102)
    assert pred.size() == target.size() and target.numel() > 0
    loss = torch.abs(pred - target)
    return loss

@LOSSES.register_module()
class L1Loss(nn.Module):

    def __init__(self, reduction='mean', loss_weight=1.0):
        super(L1Loss, self).__init__()
        self.reduction = reduction
        self.loss_weight = loss_weight

    def forward(self,
                pred,
                target,
                weight=None,
                avg_factor=None,
                reduction_override=None):
        assert reduction_override in (None, 'none', 'mean', 'sum')
        reduction = (
            reduction_override if reduction_override else self.reduction)
        loss = self.loss_weight * l1_loss(
            pred, target, weight, reduction=reduction, avg_factor=avg_factor)
        return loss
```

```python
# 记得去导入
from .l1_loss import L1Loss, l1_loss
```

#### 新增预训练模型

去github网上下  找对应的 resnet18_8xb32

```python
log_config = dict(interval=100, hooks=[dict(type='TextLoggerHook')])
dist_params = dict(backend='nccl')
log_level = 'INFO'
load_from = \mmcls\data\resnet18_8xb32_in1k_20210831-fbbb1da6.pth  # 这里
resume_from = None
workflow = [('train', 1)]
work_dir = './work_dirs/resnet18_8xb32_in1k'
gpu_ids = [0]
```

#### 多加一个数据增强mixup

狗0.6 + 猫0.4

```python
model = dict(
    type='ImageClassifier',
    backbone=dict(
        type='ResNet',
        depth=18,
        num_stages=4,
        out_indices=(3, ),
        style='pytorch'),
    neck=dict(type='GlobalAveragePooling'),
    head=dict(
        type='LinearClsHead',
        num_classes=102,
        in_channels=512,
        loss=dict(type='L1Loss', loss_weight=1.0),#L1Loss CrossEntropyLoss
        topk=(1, 5)),
    # 这里
    train_cfg=dict(augments=dict(type= 'BatchMixup', alpha=0.2， num_classes=102, prob=1.))
)
```

### 4. 数据增强可视化模块

tools -> visualizations

#### 中间结果 vis_pipeline.py 

可以去看保存的文件 只弄了十张  查看输入和输出的数据 

--phase train --number 10 --mode pipeline/transformed

```python
#../../configs/resnet/today_resnet18_8xb32_in1k.py  --output-dir ../work_dirs/resnet18_8xb32_in1k/vis/vis_pipeline
#--phase train --number 10 --mode concat
```

#### 可视化模型效果 vim_cam.py

查看模型在训练的过程中主要关注的区域 

```python
# pip install "grad-cam>=1.3.6"

#image_05094.jpg ../../configs/resnet/today_resnet18_8xb32_in1k.py ../work_dirs/resnet18_8xb32_in1k/epoch_100.pth
#--target-category

#cat-dog.png ../../configs/resnet/resnet18_8xb32_in1k.py D:\\eclipse-workspace\\PyTorch4\\mmclassification-master\\mmcls\\data\\resnet18_8xb32_in1k_20210831-fbbb1da6.pth
#--target-category 238 --target-category 281

#backbone.layer1.1.conv1 backbone.layer2.1.conv1 backbone.layer1.1.conv1 backbone.layer4.1.conv2
#--target-layers backbone.layer2.1.conv2
```

### 5. 模型分析脚本

tools -> analysis_tools

#### analyze_logs.py

```python
#plot_curve ../work_dirs/resnet18_8xb32_in1k/flower-100epoch.json --keys loss accuracy_top-1

#cal_train_time ../work_dirs/resnet18_8xb32_in1k/flower-100epoch.json
```

#### get_flops.py  获取计算量

```python
#../../configs/resnet/today_resnet18_8xb32_in1k.py --shape 224 224
```

## 3. 模块一：模型源码debug

### 1. VIT任务概述

一般在哪打断点  在for_word()



## 4. 模块二：使用分割模块训练自己的数据集

源码：mmsegementation

### 1. 数据集标注

使用labelme  需要把文件夹整个复制过去

如果要用分割的话

```python
cell my_cell_voc --labels cell_labels.txt
```

```
# cell_labels.txt  有多少个类别标注多少个
__ignore__
_background_
aeroplane
bicycle
bird
boat
bottle
bus
```

利用labelme 生成的 my_cell_voc  放到mmsegementation中

train.txt  是训练的文件名

test.txt 

val.txt 是测试的文件名   这三个文件自己去写脚本

### 2. 预测类别数修改配置文件

这个文件名`deeplabv3plus_r18-d8_512x1024_80k_cityscapes.py`来自于深度学习库MMsegmentation，它是一个用于语义分割的开源库。文件名包含了一些关于模型配置的重要信息。我们可以将其分解为以下几部分：

1. **deeplabv3plus**: 这是所使用的模型的名称。在这种情况下，它是DeepLabv3+，这是一种用于图像分割的深度学习模型。

2. **r18**: 这是模型的骨干网络(backbone)。在这种情况下, `r18`代表ResNet-18，这是一种常用的卷积神经网络，通常用作深度学习模型的基础。

3. **d8**: 这是模型的深度因子。在这种情况下，`d8`代表深度因子为8。这个参数通常影响模型的大小和计算复杂度。

4. **512x1024**: 这是输入图像的大小。在这种情况下，模型接受512x1024像素的图像作为输入。

5. **80k**: 这是训练步数。在这种情况下，模型在80,000步后停止训练。

6. **cityscapes**: 这是所使用的数据集的名称。在这种情况下，它是Cityscapes数据集，这是一个用于语义理解的大规模数据集，包含了来自50个不同城市的街景图片。

总的来说，这个文件名提供了关于模型配置和训练的一些重要信息。

最后这个预训练模型的，最好找相似的这样训练比较快

去 train.py 找模型执行

```python
# D:\\eclipse-workspace\\PyTorch4\\mmsegmentation-0.20.2\\configs\\deeplabv3plus\\deeplabv3plus_r18-d8_512x1024_80k_cityscapes.py
```

执行完后去tools -> word_dirs找生成的模型  改成自己的名字my_deeplabv3plus_r50-d8_480x480_40k_pascal_context.py，然后去修改配置

```python
# D:\\eclipse-workspace\\PyTorch4\\mmsegmentation-0.20.2\\configs\\deeplabv3plus\\my_deeplabv3plus_r50-d8_480x480_40k_pascal_context.py
```
my_deeplabv3plus_r50-d8_480x480_40k_pascal_context.py
```python
norm_cfg = dict(type='SyncBN', requires_grad=True)
model = dict(
    type='EncoderDecoder',
    pretrained='open-mmlab://resnet50_v1c',
    backbone=dict(
        type='ResNetV1c',
        depth=50,
        num_stages=4,
        out_indices=(0, 1, 2, 3),
        dilations=(1, 1, 2, 4),
        strides=(1, 2, 1, 1),
        norm_cfg=dict(type='SyncBN', requires_grad=True),
        norm_eval=False,#BN的统计项不更新
        style='pytorch',#3*3conv stride2
        contract_dilation=True),
    decode_head=dict(
        type='DepthwiseSeparableASPPHead',
        in_channels=2048,
        in_index=3,
        channels=512,
        dilations=(1, 12, 24, 36),
        c1_in_channels=256,
        c1_channels=48,
        dropout_ratio=0.1,
        num_classes=2,  # 自己的类别 默认有个背景 要记得+1
        norm_cfg=dict(type='SyncBN', requires_grad=True),
        align_corners=False,
        loss_decode=dict(
            type='CrossEntropyLoss', use_sigmoid=False, loss_weight=1.0)),
    auxiliary_head=dict(
        type='FCNHead',
        in_channels=1024,
        in_index=2,
        channels=256,
        num_convs=1,
        concat_input=False,
        dropout_ratio=0.1,
        num_classes=2, # 自己的类别 默认有个背景 要记得+1
        norm_cfg=dict(type='SyncBN', requires_grad=True),
        align_corners=False,
        loss_decode=dict(
            type='CrossEntropyLoss', use_sigmoid=False, loss_weight=0.4)),
    train_cfg=dict(),
    test_cfg=dict(mode='slide', crop_size=(480, 480), stride=(320, 320)))
img_norm_cfg = dict(
    mean=[123.675, 116.28, 103.53], std=[58.395, 57.12, 57.375], to_rgb=True)
img_scale = (520, 520)
crop_size = (480, 480)
train_pipeline = [
    dict(type='LoadImageFromFile'),
    dict(type='LoadAnnotations'),
    dict(type='Resize', img_scale=(520, 520), ratio_range=(0.5, 2.0)),
    dict(type='RandomCrop', crop_size=(480, 480), cat_max_ratio=0.75),
    dict(type='RandomFlip', prob=0.5),
    dict(type='PhotoMetricDistortion'),
    dict(
        type='Normalize',
        mean=[123.675, 116.28, 103.53],
        std=[58.395, 57.12, 57.375],
        to_rgb=True),
    dict(type='Pad', size=(480, 480), pad_val=0, seg_pad_val=255),
    dict(type='DefaultFormatBundle'),
    dict(type='Collect', keys=['img', 'gt_semantic_seg'])
]
test_pipeline = [
    dict(type='LoadImageFromFile'),
    dict(
        type='MultiScaleFlipAug',
        img_scale=(520, 520),
        flip=False,
        transforms=[
            dict(type='Resize', keep_ratio=True),
            dict(type='RandomFlip'),
            dict(
                type='Normalize',
                mean=[123.675, 116.28, 103.53],
                std=[58.395, 57.12, 57.375],
                to_rgb=True),
            dict(type='ImageToTensor', keys=['img']),
            dict(type='Collect', keys=['img'])
        ])
]
data = dict(
    samples_per_gpu=3,
    workers_per_gpu=1,
    train=dict(
        type='PascalVOCDataset', # 不能改
        data_root='D:\\eclipse-workspace\\PyTorch4\\mmsegmentation-0.20.2\\data\\my_cell_voc',
        img_dir='JPEGImages', # 脚本生成的 不用改了
        ann_dir='SegmentationClassPNG',
        split='train.txt',
        pipeline=[
            dict(type='LoadImageFromFile'),
            dict(type='LoadAnnotations'),
            dict(type='Resize', img_scale=(520, 520), ratio_range=(0.5, 2.0)),
            dict(type='RandomCrop', crop_size=(480, 480), cat_max_ratio=0.75), # 预训练模型用的512的 应该也可以 
            dict(type='RandomFlip', prob=0.5),
            dict(type='PhotoMetricDistortion'),
            dict(
                type='Normalize',
                mean=[123.675, 116.28, 103.53],
                std=[58.395, 57.12, 57.375],
                to_rgb=True),
            dict(type='Pad', size=(480, 480), pad_val=0, seg_pad_val=255),
            dict(type='DefaultFormatBundle'),
            dict(type='Collect', keys=['img', 'gt_semantic_seg'])
        ]),
    val=dict(
        type='PascalVOCDataset',
        data_root='D:\\eclipse-workspace\\PyTorch4\\mmsegmentation-0.20.2\\data\\my_cell_voc',
        img_dir='JPEGImages',
        ann_dir='SegmentationClassPNG',
        split='val.txt',
        pipeline=[
            dict(type='LoadImageFromFile'),
            dict(
                type='MultiScaleFlipAug',
                img_scale=(520, 520),
                flip=False,
                transforms=[
                    dict(type='Resize', keep_ratio=True),
                    dict(type='RandomFlip'),
                    dict(
                        type='Normalize',
                        mean=[123.675, 116.28, 103.53],
                        std=[58.395, 57.12, 57.375],
                        to_rgb=True),
                    dict(type='ImageToTensor', keys=['img']),
                    dict(type='Collect', keys=['img'])
                ])
        ]),
    test=dict(
        type='PascalVOCDataset',
        data_root='D:\\eclipse-workspace\\PyTorch4\\mmsegmentation-0.20.2\\data\\my_cell_voc',
        img_dir='JPEGImages',
        ann_dir='SegmentationClassPNG',
        split='test.txt',
        pipeline=[
            dict(type='LoadImageFromFile'),
            dict(
                type='MultiScaleFlipAug',
                img_scale=(520, 520),
                flip=False,
                transforms=[
                    dict(type='Resize', keep_ratio=True),
                    dict(type='RandomFlip'),
                    dict(
                        type='Normalize',
                        mean=[123.675, 116.28, 103.53],
                        std=[58.395, 57.12, 57.375],
                        to_rgb=True),
                    dict(type='ImageToTensor', keys=['img']),
                    dict(type='Collect', keys=['img'])
                ])
        ]))
log_config = dict(
    interval=10, hooks=[dict(type='TextLoggerHook', by_epoch=False)]) # 没迭代多少次打印信息，可以改小一点
dist_params = dict(backend='nccl')
log_level = 'INFO'
load_from = 'D:\\eclipse-workspace\\PyTorch4\\mmsegmentation-0.20.2\\tools\\work_dirs\\deeplabv3plus_r50-d8_480x480_40k_pascal_context\\deeplabv3plus_r50-d8_512x512_20k_voc12aug_20200617_102323-aad58ef1.pth' # 预训练模型
resume_from = None
workflow = [('train', 1)]
cudnn_benchmark = True
optimizer = dict(type='SGD', lr=0.004, momentum=0.9, weight_decay=0.0001)
optimizer_config = dict()
lr_config = dict(policy='poly', power=0.9, min_lr=0.0001, by_epoch=False)
runner = dict(type='IterBasedRunner', max_iters=1000)
checkpoint_config = dict(by_epoch=False, interval=1000)
evaluation = dict(interval=40, metric='mIoU', pre_eval=True) # 多少次迭代 走一次验证集的评估
work_dir = './work_dirs\deeplabv3plus_r50-d8_480x480_40k_pascal_context' # 模型训练后保存路径
gpu_ids = range(0, 1)
```

mmseg -> datasets -> voc.py

```python
# 一定要去改成对应的  background不要删
CLASSES = ('background', 'cell')
PALETTE = [[0, 0, 0], [128, 0, 0]]
```

mmseg -> core -> evaluation -> class_names.py

```python
def voc_classes():
    """Pascal VOC class names for external use."""
    """
    return [
        'background', 'aeroplane', 'bicycle', 'bird', 'boat', 'bottle', 'bus',
        'car', 'cat', 'chair', 'cow', 'diningtable', 'dog', 'horse',
        'motorbike', 'person', 'pottedplant', 'sheep', 'sofa', 'train',
        'tvmonitor'
    ]
    """
    return [
        'background', 'cell'
    ]
```

### 3. 开始训练

训练开始前 用小工具看标注是否正确

tools -> browse_dataset.py

```python
# D:\\eclipse-workspace\\PyTorch4\\mmsegmentation-0.20.2\\configs\\deeplabv3plus\\my_deeplabv3plus_r50-d8_480x480_40k_pascal_context.py
#--show
```

预训练模型在哪下

https://github.com/open-mmlab/mmsegmentation/blob/main/docs/en/model_zoo.md

https://github.com/open-mmlab/mmsegmentation/tree/main/configs/deeplabv3plus

### 4. 预测demo

demo -> image_demo.py

```python
"""
my_cell.jpg
D:\\eclipse-workspace\\PyTorch4\\mmsegmentation-0.20.2\\configs\\deeplabv3plus\\my_deeplabv3plus_r50-d8_480x480_40k_pascal_context.py
D:\\eclipse-workspace\\PyTorch4\\mmsegmentation-0.20.2\\tools\\work_dirs\\deeplabv3plus_r50-d8_480x480_40k_pascal_context\iter_1000.pth
--palette voc
"""

"""
my_cell.jpg
D:\\eclipse-workspace\\PyTorch4\\mmsegmentation-0.20.2\\configs\\deeplabv3plus\\student_deeplabv3plus_r50-d8_480x480_40k_pascal_context.py
D:\\eclipse-workspace\\PyTorch4\mmrazor-master\\tools\mmseg\\work_dirs\\cwd_cls_head_pspnet_r101_d8_pspnet_r18_d8_512x1024_cityscapes_80k\\deeplabv3+student+iter200.pth
--palette voc
"""

#T
"""
my_cell.jpg
D:\\eclipse-workspace\\PyTorch4\\mmsegmentation-0.20.2\\configs\\deeplabv3plus\\my_deeplabv3plus_r50-d8_480x480_40k_pascal_context.py
D:\\eclipse-workspace\\PyTorch4\\mmsegmentation-0.20.2\\tools\\work_dirs\\deeplabv3plus_r50-d8_480x480_40k_pascal_context\iter_1000.pth
--palette voc
"""

#S
"""
my_cell.jpg
D:\\eclipse-workspace\\PyTorch4\\mmsegmentation-0.20.2\\configs\\deeplabv3plus\\student_deeplabv3plus_r50-d8_480x480_40k_pascal_context.py
D:\\eclipse-workspace\\PyTorch4\\mmrazor-master\\tools\\mmseg\\work_dirs\\cwd_cls_head_pspnet_r101_d8_pspnet_r18_d8_512x1024_cityscapes_80k\\deeplabv3+student+iter200.pth
--palette voc
"""
```

## 5. 模块二：基于Unet进行各种策略修改

### 1. 配置文件解读

my_fcn_unet_s5-d16_64x64_40k_drive.py

```python
norm_cfg = dict(type='SyncBN', requires_grad=True)
model = dict(
    type='EncoderDecoder', 
    pretrained=None,
    backbone=dict(
        type='UNet', # 打断点
        in_channels=3, # 输入的颜色通道 一般不改
        base_channels=64,
        num_stages=5, 
        strides=(1, 1, 1, 1, 1),
        enc_num_convs=(2, 2, 2, 2, 2),
        dec_num_convs=(2, 2, 2, 2),
        downsamples=(True, True, True, True),
        enc_dilations=(1, 1, 1, 1, 1),
        dec_dilations=(1, 1, 1, 1),
        with_cp=False,
        conv_cfg=None,
        norm_cfg=dict(type='SyncBN', requires_grad=True),
        act_cfg=dict(type='ReLU'),
        upsample_cfg=dict(type='InterpConv'),
        norm_eval=False),
    decode_head=dict(
        type='FCNHead', # 打断点
        in_channels=64, # 输入的通道数
        in_index=4, # debug 选最后一个
        channels=64,
        num_convs=1,
        concat_input=False,
        dropout_ratio=0.1,
        num_classes=2,
        norm_cfg=dict(type='SyncBN', requires_grad=True),
        align_corners=False,
        loss_decode=dict(
            type='CrossEntropyLoss', use_sigmoid=False, loss_weight=1.0)),
    auxiliary_head=dict(
        type='FCNHead',
        in_channels=128,
        in_index=3,
        channels=64,
        num_convs=1,
        concat_input=False,
        dropout_ratio=0.1,
        num_classes=2,
        norm_cfg=dict(type='SyncBN', requires_grad=True),
        align_corners=False,
        loss_decode=dict(
            type='CrossEntropyLoss', use_sigmoid=False, loss_weight=0.4)),
    train_cfg=dict(),
    test_cfg=dict(mode='slide', crop_size=(128, 128), stride=(85, 85)))
dataset_type = 'PascalVOCDataset'
data_root = 'D:\\eclipse-workspace\\PyTorch4\\mmsegmentation-0.20.2\\data\\VOC2012'
img_norm_cfg = dict(
    mean=[123.675, 116.28, 103.53], std=[58.395, 57.12, 57.375], to_rgb=True)
img_scale = (605, 700)
crop_size = (128, 128)
train_pipeline = [
    dict(type='LoadImageFromFile'),
    dict(type='LoadAnnotations'),
    dict(type='Resize', img_scale=(605, 700), ratio_range=(0.5, 2.0)),
    dict(type='RandomCrop', crop_size=(128, 128), cat_max_ratio=0.75),
    dict(type='RandomFlip', prob=0.5),
    dict(type='PhotoMetricDistortion'),
    dict(
        type='Normalize',
        mean=[123.675, 116.28, 103.53],
        std=[58.395, 57.12, 57.375],
        to_rgb=True),
    dict(type='Pad', size=(128, 128), pad_val=0, seg_pad_val=255),
    dict(type='DefaultFormatBundle'),
    dict(type='Collect', keys=['img', 'gt_semantic_seg'])
]
test_pipeline = [
    dict(type='LoadImageFromFile'),
    dict(
        type='MultiScaleFlipAug',
        img_scale=(605, 700),
        flip=False,
        transforms=[
            dict(type='Resize', keep_ratio=True),
            dict(type='RandomFlip'),
            dict(
                type='Normalize',
                mean=[123.675, 116.28, 103.53],
                std=[58.395, 57.12, 57.375],
                to_rgb=True),
            dict(type='ImageToTensor', keys=['img']),
            dict(type='Collect', keys=['img'])
        ])
]
data = dict(
    samples_per_gpu=1,
    workers_per_gpu=1,
    train=dict(
        type='RepeatDataset',
        times=40000,
        dataset=dict(
            type='PascalVOCDataset',
            data_root='D:\\eclipse-workspace\\PyTorch4\\mmsegmentation-0.20.2\\data\\VOC2012',
            img_dir='JPEGImages',
            ann_dir='SegmentationClassPNG',
            split='train.txt',
            pipeline=[
                dict(type='LoadImageFromFile'),
                dict(type='LoadAnnotations'),
                dict(
                    type='Resize',
                    img_scale=(605, 700),
                    ratio_range=(0.5, 2.0)),
                dict(
                    type='RandomCrop',
                    crop_size=(128, 128),
                    cat_max_ratio=0.75),
                dict(type='RandomFlip', prob=0.5),
                dict(type='PhotoMetricDistortion'),
                dict(
                    type='Normalize',
                    mean=[123.675, 116.28, 103.53],
                    std=[58.395, 57.12, 57.375],
                    to_rgb=True),
                dict(type='Pad', size=(128, 128), pad_val=0, seg_pad_val=255),
                dict(type='DefaultFormatBundle'),
                dict(type='Collect', keys=['img', 'gt_semantic_seg'])
            ])),
    val=dict(
        type='PascalVOCDataset',
        data_root='D:\\eclipse-workspace\\PyTorch4\\mmsegmentation-0.20.2\\data\\VOC2012',
        img_dir='JPEGImages',
        ann_dir='SegmentationClassPNG',
        split='val.txt',
        pipeline=[
            dict(type='LoadImageFromFile'),
            dict(
                type='MultiScaleFlipAug',
                img_scale=(605, 700),
                flip=False,
                transforms=[
                    dict(type='Resize', keep_ratio=True),
                    dict(type='RandomFlip'),
                    dict(
                        type='Normalize',
                        mean=[123.675, 116.28, 103.53],
                        std=[58.395, 57.12, 57.375],
                        to_rgb=True),
                    dict(type='ImageToTensor', keys=['img']),
                    dict(type='Collect', keys=['img'])
                ])
        ]),
    test=dict(
        type='PascalVOCDataset',
        data_root='D:\\eclipse-workspace\\PyTorch4\\mmsegmentation-0.20.2\\data\\VOC2012',
        img_dir='JPEGImages',
        ann_dir='SegmentationClassPNG',
        split='test.txt',
        pipeline=[
            dict(type='LoadImageFromFile'),
            dict(
                type='MultiScaleFlipAug',
                img_scale=(605, 700),
                flip=False,
                transforms=[
                    dict(type='Resize', keep_ratio=True),
                    dict(type='RandomFlip'),
                    dict(
                        type='Normalize',
                        mean=[123.675, 116.28, 103.53],
                        std=[58.395, 57.12, 57.375],
                        to_rgb=True),
                    dict(type='ImageToTensor', keys=['img']),
                    dict(type='Collect', keys=['img'])
                ])
        ]))
log_config = dict(
    interval=50, hooks=[dict(type='TextLoggerHook', by_epoch=False)])
dist_params = dict(backend='nccl')
log_level = 'INFO'
load_from = None
resume_from = None
workflow = [('train', 1)]
cudnn_benchmark = True
optimizer = dict(type='SGD', lr=0.01, momentum=0.9, weight_decay=0.0005)
optimizer_config = dict()
lr_config = dict(policy='poly', power=0.9, min_lr=0.0001, by_epoch=False)
runner = dict(type='IterBasedRunner', max_iters=40000)
checkpoint_config = dict(by_epoch=False, interval=4000)
evaluation = dict(interval=4000, metric='mDice', pre_eval=True)
work_dir = './work_dirs/fcn_unet_s5-d16_128x128_40k_stare'
gpu_ids = range(0, 1)
```

### 优化

```python
norm_cfg = dict(type='BN', requires_grad=True)

model = dict(
    type='EncoderDecoder',
    pretrained=None,
    #pretrained='D:\\eclipse-workspace\\PyTorch4\\mmsegmentation-0.20.2\\data\\fcn_unet_s5-d16_64x64_40k_drive_20201223_191051-5daf6d3b.pth',
    backbone=dict(
        type='VisionTransformer',
        img_size=(96, 96),
        patch_size=16,
        in_channels=3,
        embed_dims=768,
        num_layers=12,
        num_heads=12,
        mlp_ratio=4,
        out_indices=(2, 3, 5, 8, 11),
        qkv_bias=True,
        drop_rate=0.0,
        attn_drop_rate=0.0,
        drop_path_rate=0.0,
        with_cls_token=True,
        norm_cfg=dict(type='LN', eps=1e-6),
        act_cfg=dict(type='GELU'),
        norm_eval=False,
        interpolate_mode='bicubic'),
    neck=dict(
            type='FPN',
            in_channels=[768, 768, 768, 768, 768],
            out_channels=64,
            num_outs=5),
    decode_head=dict(
        type='FCNHead',
        in_channels=64,
        in_index=4,
        channels=64,
        num_convs=1,
        concat_input=False,
        dropout_ratio=0.1,
        num_classes=2,
        norm_cfg=dict(type='BN', requires_grad=True),
        align_corners=False,
        loss_decode=dict(
            type='FocalLoss', use_sigmoid=True, loss_weight=1.0)),#CrossEntropyLoss
    auxiliary_head=dict(
        type='FCNHead',#deep-supervised，可以参考https://github.com/open-mmlab/mmsegmentation/issues/503
        in_channels=64,
        in_index=3,
        channels=64,
        num_convs=1,
        concat_input=False,
        dropout_ratio=0.1,
        num_classes=2, #mmsegmentation/mmseg/datasets里修改voc.py，对应好类别和颜色;mmsegmentation/mmseg/core/evaluation里修改class_names.py
        norm_cfg=dict(type='BN', requires_grad=True),
        align_corners=False,
        loss_decode=dict(
            type='FocalLoss', use_sigmoid=True, loss_weight=0.4)),
    train_cfg=dict(),
    test_cfg=dict(mode='slide', crop_size=(96, 96), stride=(42, 42)))
dataset_type = 'PascalVOCDataset'
data_root = 'D:\\eclipse-workspace\\PyTorch4\\mmsegmentation-0.20.2\\data\\my_cell'
img_norm_cfg = dict(
    mean=[123.675, 116.28, 103.53], std=[58.395, 57.12, 57.375], to_rgb=True)
img_scale = (584, 565)
crop_size = (96, 96)
train_pipeline = [
    dict(type='LoadImageFromFile'),
    dict(type='LoadAnnotations'),
    dict(type='Resize', img_scale=(584, 565), ratio_range=(0.5, 2.0)),
    dict(type='RandomCrop', crop_size=(96, 96), cat_max_ratio=0.75),
    dict(type='RandomFlip', prob=0.5),
    dict(type='PhotoMetricDistortion'),
    dict(
        type='Normalize',
        mean=[123.675, 116.28, 103.53],
        std=[58.395, 57.12, 57.375],
        to_rgb=True),
    dict(type='Pad', size=(96, 96), pad_val=0, seg_pad_val=255),
    dict(type='DefaultFormatBundle'),
    dict(type='Collect', keys=['img', 'gt_semantic_seg'])
]
test_pipeline = [
    dict(type='LoadImageFromFile'),
    dict(
        type='MultiScaleFlipAug',
        img_scale=(584, 565),
        flip=False,
        transforms=[
            dict(type='Resize', keep_ratio=True),
            dict(type='RandomFlip'),
            dict(
                type='Normalize',
                mean=[123.675, 116.28, 103.53],
                std=[58.395, 57.12, 57.375],
                to_rgb=True),
            dict(type='ImageToTensor', keys=['img']),
            dict(type='Collect', keys=['img'])
        ])
]
data = dict(
    samples_per_gpu=3,
    workers_per_gpu=1,
    train=dict(
        type='RepeatDataset',
        times=40000,
        dataset=dict(
            type='PascalVOCDataset',
            data_root='D:\\eclipse-workspace\\PyTorch4\\mmsegmentation-0.20.2\\data\\my_cell',
            img_dir='JPEGImages',
            ann_dir='SegmentationClassPNG',
            split='train.txt',
            pipeline=[
                dict(type='LoadImageFromFile'),
                dict(type='LoadAnnotations'),
                dict(
                    type='Resize',
                    img_scale=(584, 565),
                    ratio_range=(0.5, 2.0)),
                dict(
                    type='RandomCrop', crop_size=(96, 96), cat_max_ratio=0.75),
                dict(type='RandomFlip', prob=0.5),
                dict(type='PhotoMetricDistortion'),
                dict(
                    type='Normalize',
                    mean=[123.675, 116.28, 103.53],
                    std=[58.395, 57.12, 57.375],
                    to_rgb=True),
                dict(type='Pad', size=(96, 96), pad_val=0, seg_pad_val=255),
                dict(type='DefaultFormatBundle'),
                dict(type='Collect', keys=['img', 'gt_semantic_seg'])
            ])),
    val=dict(
        type='PascalVOCDataset',
        data_root='D:\\eclipse-workspace\\PyTorch4\\mmsegmentation-0.20.2\\data\\my_cell',
        img_dir='JPEGImages',
        ann_dir='SegmentationClassPNG',
        split='val.txt',
        pipeline=[
            dict(type='LoadImageFromFile'),
            dict(
                type='MultiScaleFlipAug',
                img_scale=(584, 565),
                flip=False,
                transforms=[
                    dict(type='Resize', keep_ratio=True),
                    dict(type='RandomFlip'),
                    dict(
                        type='Normalize',
                        mean=[123.675, 116.28, 103.53],
                        std=[58.395, 57.12, 57.375],
                        to_rgb=True),
                    dict(type='ImageToTensor', keys=['img']),
                    dict(type='Collect', keys=['img'])
                ])
        ]),
    test=dict(
        type='PascalVOCDataset',
        data_root='D:\\eclipse-workspace\\PyTorch4\\mmsegmentation-0.20.2\\data\\my_cell',
        img_dir='JPEGImages',
        ann_dir='SegmentationClassPNG',
        split='test.txt',
        pipeline=[
            dict(type='LoadImageFromFile'),
            dict(
                type='MultiScaleFlipAug',
                img_scale=(584, 565),
                flip=False,
                transforms=[
                    dict(type='Resize', keep_ratio=True),
                    dict(type='RandomFlip'),
                    dict(
                        type='Normalize',
                        mean=[123.675, 116.28, 103.53],
                        std=[58.395, 57.12, 57.375],
                        to_rgb=True),
                    dict(type='ImageToTensor', keys=['img']),
                    dict(type='Collect', keys=['img'])
                ])
        ]))
log_config = dict(
    interval=50, hooks=[dict(type='TextLoggerHook', by_epoch=False)])
dist_params = dict(backend='nccl')
log_level = 'INFO'
load_from = None
resume_from = None
workflow = [('train', 1)]
cudnn_benchmark = True
#optimizer = dict(type='SGD', lr=0.01, momentum=0.9, weight_decay=0.0005)
optimizer = dict(type='Adam', lr=0.01, weight_decay=0.0005)
optimizer_config = dict()
lr_config = dict(policy='poly', power=0.9, min_lr=0.0001, by_epoch=False)
runner = dict(type='IterBasedRunner', max_iters=40000)
checkpoint_config = dict(by_epoch=False, interval=40000)
evaluation = dict(interval=2000, metric='mIoU', pre_eval=True)
work_dir = './work_dirs/my_fcn_unet_s5-d16_64x64_40k_drive-cell'
gpu_ids = range(0, 1)

```

## 6. 第二模块：（论文）分割任务CVPR最新Backbone设计及其应用

参考论文：MPViT : Multi-Path Vision Transformer for Dense Prediction

对vit模型进行创新

**Backbone**：在机器学习和计算机视觉中，Backbone通常指的是神经网络的主要部分，也通常被称为基础网络。Backbone网络负责提取输入数据（例如图像）中的特征，这些特征会被送到网络的下一部分用于更具体的任务，例如物体探测或语义分割。

### 1. 注册自己的Backbone

**MPViT** 是 "Multi-scale Pyramid Vision Transformer" 的缩写，这是一种基于 Vision Transformer (ViT) 的新型网络结构。ViT 是一种将 Transformer 应用于视觉任务的网络结构，它将输入图像划分为一系列的小块，然后使用 Transformer 对这些小块进行处理。MPViT 则在此基础上进行了改进，它使用了多尺度的策略，可以在不同的尺度上提取图像特征，这有助于捕捉到更丰富的图像信息。

具体来说，MPViT 通过在不同的空间分辨率上应用 Transformer，可以有效地处理不同尺度的视觉信息。这种设计使得 MPViT 在一些视觉任务，例如图像分割，上表现出了优秀的性能。

"mpvit.py" 文件中的代码就是实现了这种 MPViT 结构。在进行图像分割任务时，可以使用这个文件中的 MPViT 网络作为 Backbone，以提取输入图像的特征。

upernet_mpvit_small_160k_ade20k.py

```python
_base_ = [
    '../../_base_/models/upernet_mpvit.py', '../../_base_/datasets/ade20k.py',
    '../../_base_/default_runtime.py', '../../_base_/schedules/schedule_160k.py'
]
model = dict(
    pretrained=r'https://dl.dropbox.com/s/1o07eti5rgve1i6/mpvit_small_mm.pth',
    backbone=dict(
        type='MPViT',
        num_path=[2, 3, 3, 3],
        num_layers=[1, 3, 6, 3],
        embed_dims=[64, 128, 216, 288],
        drop_path_rate=0.2,
        norm_cfg=dict(type='SyncBN', requires_grad=True),
        norm_eval=False
    ),
    decode_head=dict(
        in_channels=[128, 216, 288, 288],
        num_classes=150,
    ),
    auxiliary_head=dict(
        in_channels=288,
        num_classes=150
    ))

optimizer = dict(_delete_=True, type='AdamW', lr=0.00006, betas=(0.9, 0.999), weight_decay=0.01)

lr_config = dict(_delete_=True, policy='poly',
                 warmup='linear',
                 warmup_iters=1500,
                 warmup_ratio=1e-6,
                 power=1.0, min_lr=0.0, by_epoch=False)

# By default, models are trained on 8 GPUs with 2 images per GPU
data=dict(samples_per_gpu=2)
work_dir = './work_dirs/mpvit_small'
```

### 2. 配置文件指定

04_MMLAB\MPViT-main\semantic_segmentation\mmseg\models\segmentors\encoder_decoder.py

encoder_decoder在这里面去打断点  139行  602行  711  715

mpvit 里面打断点  77 170 233

入口函数 train.py

```python
# D:\\eclipse-workspace\\PyTorch4\\MPViT-main\\semantic_segmentation\\configs\\mpvit\\upernet\\upernet_mpvit_small_160k_ade20k.py
```

### 3. debug解读backbone



 ### 4. patchembedding作用和实现

```python
  # mpvit
    def forward_features(self, x):

        # x's shape : [B, C, H, W]
        outs = []
        x = self.stem(x)  # Shape : [B, C, H/4, W/4]

        for idx in range(self.num_stages):
            att_inputs = self.patch_embed_stages[idx](x) # 这里
            x = self.mhca_stages[idx](att_inputs)

            outs.append(x)

        return outs
```

pe 就是patchembedding的缩写

保证transfomer输入是一样的

### 5. 卷积位置编码计算方法

cpe卷积位置编码

```python
   def forward(self, x, size):
        B, N, C = x.shape
        H, W = size

        feat = x.transpose(1, 2).contiguous().view(B, C, H, W)
        x = self.proj(feat) + feat
        x = x.flatten(2).transpose(1, 2).contiguous()

        return x
```

mpvit   429

解决了变长的事情

### 6. 近似attention实现

```python
class FactorAtt_ConvRelPosEnc(nn.Module):
    """Factorized attention with convolutional relative position encoding class."""

    def __init__(
        self,
        dim,
        num_heads=8,
        qkv_bias=False,
        qk_scale=None,
        attn_drop=0.0,
        proj_drop=0.0,
        shared_crpe=None,
    ):
        super().__init__()
        self.num_heads = num_heads
        head_dim = dim // num_heads
        self.scale = qk_scale or head_dim ** -0.5

        self.qkv = nn.Linear(dim, dim * 3, bias=qkv_bias)
        self.attn_drop = nn.Dropout(attn_drop)  # Note: attn_drop is actually not used.
        self.proj = nn.Linear(dim, dim)
        self.proj_drop = nn.Dropout(proj_drop)

        # Shared convolutional relative position encoding.
        self.crpe = shared_crpe

    def forward(self, x, size):
        B, N, C = x.shape

        # Generate Q, K, V.
        qkv = (
            self.qkv(x)
            .reshape(B, N, 3, self.num_heads, C // self.num_heads)
            .permute(2, 0, 3, 1, 4)
            .contiguous()
        )  # Shape: [3, B, h, N, Ch].
        q, k, v = qkv[0], qkv[1], qkv[2]  # Shape: [B, h, N, Ch].

        # Factorized attention.
        k_softmax = k.softmax(dim=2)  # Softmax on dim N.
        k_softmax_T_dot_v = einsum(
            "b h n k, b h n v -> b h k v", k_softmax, v
        )  # Shape: [B, h, Ch, Ch].
        factor_att = einsum(
            "b h n k, b h k v -> b h n v", q, k_softmax_T_dot_v
        )  # Shape: [B, h, N, Ch].

        # Convolutional relative position encoding.
        crpe = self.crpe(q, v, size=size)  # Shape: [B, h, N, Ch].

        # Merge and reshape.
        x = self.scale * factor_att + crpe
        x = (
            x.transpose(1, 2).reshape(B, N, C).contiguous()
        )  # Shape: [B, h, N, Ch] -> [B, N, h, Ch] -> [B, N, C].

        # Output projection.
        x = self.proj(x)
        x = self.proj_drop(x)

        return x
```

### 7. 完成特征提取与融合模块

```python
class MHCA_stage(nn.Module):
    def __init__(
        self,
        embed_dim,
        out_embed_dim,
        num_layers=1,
        num_heads=8,
        mlp_ratio=3,
        num_path=4,
        norm_cfg=dict(type="BN"),
        drop_path_list=[],
    ):
        super().__init__()

        self.mhca_blks = nn.ModuleList(
            [
                MHCAEncoder(
                    embed_dim,
                    num_layers,
                    num_heads,
                    mlp_ratio,
                    drop_path_list=drop_path_list,
                )
                for _ in range(num_path)
            ]
        )

        self.InvRes = ResBlock(
            in_features=embed_dim, out_features=embed_dim, norm_cfg=norm_cfg
        )
        self.aggregate = Conv2d_BN(
            embed_dim * (num_path + 1),
            out_embed_dim,
            act_layer=nn.Hardswish,
            norm_cfg=norm_cfg,
        )

    def forward(self, inputs):
        att_outputs = [self.InvRes(inputs[0])]
        for x, encoder in zip(inputs, self.mhca_blks):
            # [B, C, H, W] -> [B, N, C]
            _, _, H, W = x.shape
            x = x.flatten(2).transpose(1, 2).contiguous()
            att_outputs.append(encoder(x, size=(H, W)))

        out_concat = torch.cat(att_outputs, dim=1)
        out = self.aggregate(out_concat)

        return out
```

### 8. 分割任务输出模块

decode_head文件夹  用的uper_head.py

论文：Unified Perceptual Parsing for Scene Understanding

### 9. 全局特征的作用和实现

psp_head.py

论文：Pyramid Scene Parsing Network

 

## 7. 第三模块：mmdet训练自己的数据任务

### 1.数据集标注

mmdetection-master  检测任务

deformale_detr  可变形的dtr  玩这个

### 2. coco数据标注格式

04_MMLAB\mmdetection-master\mmdet\data\json2coco.py

```python
import os
import json
import numpy as np
import glob
import shutil
import cv2
from sklearn.model_selection import train_test_split

np.random.seed(41)

classname_to_id = {
    "mask": 0, #改成自己的类别
    "person": 1
}


class Lableme2CoCo:

    def __init__(self):
        self.images = []
        self.annotations = []
        self.categories = []
        self.img_id = 0
        self.ann_id = 0

    def save_coco_json(self, instance, save_path):
        json.dump(instance, open(save_path, 'w', encoding='utf-8'), ensure_ascii=False, indent=1)  # indent=2 更加美观显示

    # 由json文件构建COCO
    def to_coco(self, json_path_list):
        self._init_categories()
        for json_path in json_path_list:
            obj = self.read_jsonfile(json_path)
            self.images.append(self._image(obj, json_path))
            shapes = obj['shapes']
            for shape in shapes:
                annotation = self._annotation(shape)
                self.annotations.append(annotation)
                self.ann_id += 1
            self.img_id += 1
        instance = {}
        instance['info'] = 'spytensor created'
        instance['license'] = ['license']
        instance['images'] = self.images
        instance['annotations'] = self.annotations
        instance['categories'] = self.categories
        return instance

    # 构建类别
    def _init_categories(self):
        for k, v in classname_to_id.items():
            category = {}
            category['id'] = v
            category['name'] = k
            self.categories.append(category)

    # 构建COCO的image字段
    def _image(self, obj, path):
        image = {}
        from labelme import utils
        img_x = utils.img_b64_to_arr(obj['imageData'])
        h, w = img_x.shape[:-1]
        image['height'] = h
        image['width'] = w
        image['id'] = self.img_id
        image['file_name'] = os.path.basename(path).replace(".json", ".jpg")
        return image

    # 构建COCO的annotation字段
    def _annotation(self, shape):
        # print('shape', shape)
        label = shape['label']
        points = shape['points']
        annotation = {}
        annotation['id'] = self.ann_id
        annotation['image_id'] = self.img_id
        annotation['category_id'] = int(classname_to_id[label])
        annotation['segmentation'] = [np.asarray(points).flatten().tolist()]
        annotation['bbox'] = self._get_box(points)
        annotation['iscrowd'] = 0
        annotation['area'] = 1.0
        return annotation

    # 读取json文件，返回一个json对象
    def read_jsonfile(self, path):
        with open(path, "r", encoding='utf-8') as f:
            return json.load(f)

    # COCO的格式： [x1,y1,w,h] 对应COCO的bbox格式
    def _get_box(self, points):
        min_x = min_y = np.inf
        max_x = max_y = 0
        for x, y in points:
            min_x = min(min_x, x)
            min_y = min(min_y, y)
            max_x = max(max_x, x)
            max_y = max(max_y, y)
        return [min_x, min_y, max_x - min_x, max_y - min_y]

#训练过程中，如果遇到Index put requires the source and destination dtypes match, got Long for the destination and Int for the source
#参考：https://github.com/open-mmlab/mmdetection/issues/6706
if __name__ == '__main__':
    labelme_path = "./labelme-data/maskdataset"
    saved_coco_path = "./labelme-data/coco-format"
    print('reading...')
    # 创建文件
    if not os.path.exists("%scoco/annotations/" % saved_coco_path):
        os.makedirs("%scoco/annotations/" % saved_coco_path)
    if not os.path.exists("%scoco/images/train2017/" % saved_coco_path):
        os.makedirs("%scoco/images/train2017" % saved_coco_path)
    if not os.path.exists("%scoco/images/val2017/" % saved_coco_path):
        os.makedirs("%scoco/images/val2017" % saved_coco_path)
    # 获取images目录下所有的joson文件列表
    print(labelme_path + "/*.json")
    json_list_path = glob.glob(labelme_path + "/*.json")
    print('json_list_path: ', len(json_list_path))
    # 数据划分,这里没有区分val2017和tran2017目录，所有图片都放在images目录下
    train_path, val_path = train_test_split(json_list_path, test_size=0.1, train_size=0.9)
    print("train_n:", len(train_path), 'val_n:', len(val_path))

    # 把训练集转化为COCO的json格式
    l2c_train = Lableme2CoCo()
    train_instance = l2c_train.to_coco(train_path)
    l2c_train.save_coco_json(train_instance, '%scoco/annotations/instances_train2017.json' % saved_coco_path)
    for file in train_path:
        # shutil.copy(file.replace("json", "jpg"), "%scoco/images/train2017/" % saved_coco_path)
        img_name = file.replace('json', 'jpg')
        temp_img = cv2.imread(img_name)
        try:
            cv2.imwrite("{}coco/images/train2017/{}".format(saved_coco_path, img_name.split('\\')[-1].replace('png', 'jpg')), temp_img)
        except Exception as e:
            print(e)
            print('Wrong Image:', img_name )
            continue
        print(img_name + '-->', img_name.replace('png', 'jpg'))

    for file in val_path:
        # shutil.copy(file.replace("json", "jpg"), "%scoco/images/val2017/" % saved_coco_path)
        img_name = file.replace('json', 'jpg')
        temp_img = cv2.imread(img_name)
        try:
            cv2.imwrite("{}coco/images/val2017/{}".format(saved_coco_path, img_name.split('\\')[-1].replace('png', 'jpg')), temp_img)
        except Exception as e:
            print(e)
            print('Wrong Image:', img_name)
            continue
        print(img_name + '-->', img_name.replace('png', 'jpg'))

    # 把验证集转化为COCO的json格式
    l2c_val = Lableme2CoCo()
    val_instance = l2c_val.to_coco(val_path)
    l2c_val.save_coco_json(val_instance, '%scoco/annotations/instances_val2017.json' % saved_coco_path)
```

### 3. 通过脚本生成coco

记得改 04_MMLAB\mmdetection-master\mmdet\datasets\coco.py

```python
 CLASSES = ('mask', 'person')
 PALETTE = [(220, 20, 60), (119, 11, 32)]
```

记得改 04_MMLAB\mmdetection-master\mmdet\core\evaluation\class_names.py

```python
def coco_classes():
    return [
        'mask', 'person']
```

04_MMLAB\mmdetection-master\configs\deformable_detr\my_deformable_detr_r50_16x2_50e_coco.py  生成模型后要改Nums

### 4. 配置文件数据增强

deformable_detr\my_deformable_detr_r50_16x2_50e_coco.py

```python
dataset_type = 'CocoDataset'
data_root = 'data/coco/'
#mmdet/core/evaluation/classnames.py中将coco_classes中的内容改成自己的
#mmdet/datasets/coco.py中将cocodatasets中的内容改成自己的
#num_classes改成自己的
img_norm_cfg = dict(
    mean=[123.675, 116.28, 103.53], std=[58.395, 57.12, 57.375], to_rgb=True)
train_pipeline = [
    dict(type='LoadImageFromFile'),
    dict(type='LoadAnnotations', with_bbox=True),
    dict(type='RandomFlip', flip_ratio=0.5),
    dict(
        type='AutoAugment',
        policies=[[{#随机带走一个小朋友
            'type':'Resize',
            'img_scale': [(480, 1333), (512, 1333), (544, 1333), (576, 1333),
                          (608, 1333), (640, 1333), (672, 1333), (704, 1333),
                          (736, 1333), (768, 1333), (800, 1333)],
            'multiscale_mode':'value',#多尺度训练，在上面随机找一个
            'keep_ratio':True#True的时候以h和w中比例差异小的为基准倍数，对h和w按照相同比例resize（保持原有长宽比）
        }],                  #False时直接按照上面大小resize
                  [{
                      'type': 'Resize',
                      'img_scale': [(400, 4200), (500, 4200), (600, 4200)],
                      'multiscale_mode': 'value',
                      'keep_ratio': True
                  }, {
                      'type': 'RandomCrop',
                      'crop_type': 'absolute_range',
                      'crop_size': (384, 600),
                      'allow_negative_crop': True
                  }, {
                      'type':
                      'Resize',
                      'img_scale': [(480, 1333), (512, 1333), (544, 1333),
                                    (576, 1333), (608, 1333), (640, 1333),
                                    (672, 1333), (704, 1333), (736, 1333),
                                    (768, 1333), (800, 1333)],
                      'multiscale_mode':
                      'value',
                      'override':
                      True,
                      'keep_ratio':
                      True
                  }]]),
    dict(
        type='Normalize',
        mean=[123.675, 116.28, 103.53],
        std=[58.395, 57.12, 57.375],
        to_rgb=True),
    dict(type='Pad', size_divisor=1),
    dict(type='DefaultFormatBundle'),
    dict(type='Collect', keys=['img', 'gt_bboxes', 'gt_labels'])
]
test_pipeline = [
    dict(type='LoadImageFromFile'),
    dict(
        type='MultiScaleFlipAug',
        img_scale=(1333, 800),
        flip=False,
        transforms=[
            dict(type='Resize', keep_ratio=True),
            dict(type='RandomFlip'),
            dict(
                type='Normalize',
                mean=[123.675, 116.28, 103.53],
                std=[58.395, 57.12, 57.375],
                to_rgb=True),
            dict(type='Pad', size_divisor=1),
            dict(type='ImageToTensor', keys=['img']),
            dict(type='Collect', keys=['img'])
        ])
]

data = dict(
    samples_per_gpu=1,
    workers_per_gpu=1,
    train=dict(
        type='CocoDataset',
        ann_file='D:\\eclipse-workspace\\PyTorch4\\mmdetection-master\\mmdet\\data\\labelme-data\\coco-formatcoco\\annotations\\instances_train2017.json',
        img_prefix='D:\\eclipse-workspace\\PyTorch4\\mmdetection-master\\mmdet\\data\\labelme-data\\coco-formatcoco\\images\\train2017',
        pipeline=[
            dict(type='LoadImageFromFile'),
            dict(type='LoadAnnotations', with_bbox=True),
            dict(type='RandomFlip', flip_ratio=0.5),
            dict(
                type='AutoAugment',
                policies=[[{
                    'type':
                    'Resize',
                    'img_scale': [(480, 1333), (512, 1333), (544, 1333),
                                  (576, 1333), (608, 1333), (640, 1333),
                                  (672, 1333), (704, 1333), (736, 1333),
                                  (768, 1333), (800, 1333)],
                    'multiscale_mode':
                    'value',
                    'keep_ratio':
                    True
                }],
                          [{
                              'type': 'Resize',
                              'img_scale': [(400, 4200), (500, 4200),
                                            (600, 4200)],
                              'multiscale_mode': 'value',
                              'keep_ratio': True
                          }, {
                              'type': 'RandomCrop',
                              'crop_type': 'absolute_range',
                              'crop_size': (384, 600),
                              'allow_negative_crop': True
                          }, {
                              'type':
                              'Resize',
                              'img_scale': [(480, 1333), (512, 1333),
                                            (544, 1333), (576, 1333),
                                            (608, 1333), (640, 1333),
                                            (672, 1333), (704, 1333),
                                            (736, 1333), (768, 1333),
                                            (800, 1333)],
                              'multiscale_mode':
                              'value',
                              'override':
                              True,
                              'keep_ratio':
                              True
                          }]]),
            dict(
                type='Normalize',
                mean=[123.675, 116.28, 103.53],
                std=[58.395, 57.12, 57.375],
                to_rgb=True),
            dict(type='Pad', size_divisor=1),
            dict(type='DefaultFormatBundle'),
            dict(type='Collect', keys=['img', 'gt_bboxes', 'gt_labels'])
        ],
        filter_empty_gt=False),
    val=dict(
        type='CocoDataset',
        ann_file='D:\\eclipse-workspace\\PyTorch4\\mmdetection-master\\mmdet\\data\\labelme-data\\coco-formatcoco\\annotations\\instances_val2017.json',
        img_prefix='D:\\eclipse-workspace\\PyTorch4\\mmdetection-master\\mmdet\\data\\labelme-data\\coco-formatcoco\\images\\val2017',
        pipeline=[
            dict(type='LoadImageFromFile'),
            dict(
                type='MultiScaleFlipAug',
                img_scale=(1333, 800),
                flip=False,
                transforms=[
                    dict(type='Resize', keep_ratio=True),
                    dict(type='RandomFlip'),
                    dict(
                        type='Normalize',
                        mean=[123.675, 116.28, 103.53],
                        std=[58.395, 57.12, 57.375],
                        to_rgb=True),
                    dict(type='Pad', size_divisor=1),
                    dict(type='ImageToTensor', keys=['img']),
                    dict(type='Collect', keys=['img'])
                ])
        ]),
    test=dict(
        type='CocoDataset',
        ann_file='D:\\eclipse-workspace\\PyTorch4\\mmdetection-master\\mmdet\\data\\labelme-data\\coco-formatcoco\\annotations\\instances_val2017.json',
        img_prefix='D:\\eclipse-workspace\\PyTorch4\\mmdetection-master\\mmdet\\data\\labelme-data\\coco-formatcoco\\images\\val2017',
        pipeline=[
            dict(type='LoadImageFromFile'),
            dict(
                type='MultiScaleFlipAug',
                img_scale=(1333, 800),
                flip=False,
                transforms=[
                    dict(type='Resize', keep_ratio=True),
                    dict(type='RandomFlip'),
                    dict(
                        type='Normalize',
                        mean=[123.675, 116.28, 103.53],
                        std=[58.395, 57.12, 57.375],
                        to_rgb=True),
                    dict(type='Pad', size_divisor=1),
                    dict(type='ImageToTensor', keys=['img']),
                    dict(type='Collect', keys=['img'])
                ])
        ]))
evaluation = dict(interval=10, metric='bbox')
checkpoint_config = dict(interval=50)
log_config = dict(interval=10, hooks=[dict(type='TextLoggerHook')])
custom_hooks = [dict(type='NumClassCheckHook')]
dist_params = dict(backend='nccl')
log_level = 'INFO'
load_from = './work_dirs/deformable_detr_r50_16x2_50e_coco/deformable_detr_r50_16x2_50e_coco_20210419_220030-a12b9512.pth'
#https://github.com/open-mmlab/mmdetection/tree/master/configs/deformable_detr
resume_from = None
workflow = [('train', 1)]
opencv_num_threads = 0
mp_start_method = 'fork'
model = dict(
    type='DeformableDETR',
    backbone=dict(
        type='ResNet',
        depth=50,
        num_stages=4,
        out_indices=(1, 2, 3),
        frozen_stages=1,
        norm_cfg=dict(type='BN', requires_grad=False),
        norm_eval=True,
        style='pytorch',
        init_cfg=dict(type='Pretrained', checkpoint='torchvision://resnet50')),
    neck=dict(
        type='ChannelMapper',
        in_channels=[512, 1024, 2048],
        kernel_size=1,
        out_channels=256,
        act_cfg=None,
        norm_cfg=dict(type='GN', num_groups=32),
        num_outs=4),
    bbox_head=dict(
        type='DeformableDETRHead',
        num_query=300,
        num_classes=2,
        in_channels=2048,
        sync_cls_avg_factor=True,
        as_two_stage=False,
        transformer=dict(
            type='DeformableDetrTransformer',
            encoder=dict(
                type='DetrTransformerEncoder',
                num_layers=6,
                transformerlayers=dict(
                    type='BaseTransformerLayer',
                    attn_cfgs=dict(
                        type='MultiScaleDeformableAttention', embed_dims=256),
                    feedforward_channels=1024,
                    ffn_dropout=0.1,
                    operation_order=('self_attn', 'norm', 'ffn', 'norm'))),
            decoder=dict(
                type='DeformableDetrTransformerDecoder',
                num_layers=6,
                return_intermediate=True,
                transformerlayers=dict(
                    type='DetrTransformerDecoderLayer',
                    attn_cfgs=[
                        dict(
                            type='MultiheadAttention',
                            embed_dims=256,
                            num_heads=8,
                            dropout=0.1),
                        dict(
                            type='MultiScaleDeformableAttention',
                            embed_dims=256)
                    ],
                    feedforward_channels=1024,
                    ffn_dropout=0.1,
                    operation_order=('self_attn', 'norm', 'cross_attn', 'norm',
                                     'ffn', 'norm')))),
        positional_encoding=dict(
            type='SinePositionalEncoding',
            num_feats=128,
            normalize=True,
            offset=-0.5),
        loss_cls=dict(
            type='FocalLoss',
            use_sigmoid=True,
            gamma=2.0,
            alpha=0.25,
            loss_weight=2.0),
        loss_bbox=dict(type='L1Loss', loss_weight=5.0),
        loss_iou=dict(type='GIoULoss', loss_weight=2.0)),
    train_cfg=dict(
        assigner=dict(
            type='HungarianAssigner',
            cls_cost=dict(type='FocalLossCost', weight=2.0),
            reg_cost=dict(type='BBoxL1Cost', weight=5.0, box_format='xywh'),
            iou_cost=dict(type='IoUCost', iou_mode='giou', weight=2.0))),
    test_cfg=dict(max_per_img=100))
optimizer = dict(
    type='AdamW',
    lr=0.0002,
    weight_decay=0.0001,
    paramwise_cfg=dict(
        custom_keys=dict(
            backbone=dict(lr_mult=0.1),
            sampling_offsets=dict(lr_mult=0.1),
            reference_points=dict(lr_mult=0.1))))
optimizer_config = dict(grad_clip=dict(max_norm=0.1, norm_type=2))
lr_config = dict(policy='step', step=[40])
runner = dict(type='EpochBasedRunner', max_epochs=50)
work_dir = './work_dirs/deformable_detr_r50_16x2_50e_coco'
auto_resume = False
gpu_ids = [0]

```

### 5.  训练配置

## 6. 第三模块：DeformableDetr物体检测源码分析

https://github.com/fundamentalvision/Deformable-DETR

论文：By [Xizhou Zhu](https://scholar.google.com/citations?user=02RXI00AAAAJ), [Weijie Su](https://www.weijiesu.com/), [Lewei Lu](https://www.linkedin.com/in/lewei-lu-94015977/), [Bin Li](http://staff.ustc.edu.cn/~binli/), [Xiaogang Wang](http://www.ee.cuhk.edu.hk/~xgwang/), [Jifeng Dai](https://jifengdai.org/).

[Deformable DETR: Deformable Transformers for End-to-End Object Detection](https://arxiv.org/abs/2010.04159).

mmvc最好用1.4.2



## 7. 第四模块：DBNET文字检测

https://rrc.cvc.uab.es/?ch=4&com=tasks

论文：DBNET

项目：mmocr

