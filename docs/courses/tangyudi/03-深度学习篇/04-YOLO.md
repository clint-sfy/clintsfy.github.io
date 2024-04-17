---
title: YOLO
author: 阿源
date: 2023/07/16 12:00
categories:
 - 深度学习快速入门
tags:
 - 深度学习
 - YOLO
---
# YOLO

##  1_深度学习经典检测方法概述

深度学习经典检测方法
two-stage（两阶段）：Faster-rcnn Mask-Rcnn系列
one-stage（单阶段）：YOLO系列  

one-stage：
最核心的优势：速度非常快，适合做实时检测任务！
但是缺点也是有的，效果通常情况下不会太好  

two-stage：
速度通常较慢（5FPS），但是效果通常还是不错的！
非常实用的通用框架MaskRcnn，建议熟悉下  

指标分析
map指标：综合衡量检测效果；单看精度和recall不行吗  

## 2_YOLO-V1整体思想与网络架构

经典的one-stage方法
You Only Look Once，名字就已经说明了一切！
把检测问题转化成回归问题，一个CNN就搞定了！
可以对视频进行实时检测，应用领域非常广！

## 3_YOLO-V2改进细节详解

YOLO-V2-Batch Normalization：
V2版本舍弃Dropout，卷积后全部加入Batch Normalization
网络的每一层的输入都做了归一化，收敛相对更容易
经过Batch Normalization处理后的网络会提升2%的mAP
从现在的角度来看，Batch Normalization已经成网络必备处理  

YOLO-V2-更大的分辨率
V1训练时用的是224*224，测试时使用448*448
可能导致模型水土不服，V2训练时额外又进行了10次448*448 的微调
使用高分辨率分类器后，YOLOv2的mAP提升了约4%  

## 4_YOLO-V3核心网络模型

YOLO-V3
终于到V3了，最大的改进就是网络结构，使其更适合小目标检测
特征做的更细致，融入多持续特征图信息来预测不同规格物体
先验框更丰富了，3种scale，每种3个规格，一共9种
softmax改进，预测多标签任务  

## 5_项目实战-基于V3版本进行源码解读
