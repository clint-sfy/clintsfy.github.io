---
title: AGV 项目导读
projectName: AGV 智能叉车
summary: 围绕 ROS、STM32、Jetson 与 Cartographer，整理 AGV 智能叉车从通信协议到环境部署和实车验证的完整实践。
stack: [ROS, C++, STM32, Jetson, Cartographer]
status: learning
order: 2
showArticleMetadata: false
showComment: false
---

# AGV 智能叉车项目导读

这组文档记录 AGV 智能叉车项目的工程实践：上位机以 ROS 为核心组织导航与设备协作，STM32 承担底层控制，Jetson 提供边缘计算环境，并使用 Cartographer 完成建图与定位相关配置。

## 阅读路线

1. [项目总体说明](/open-source/02-AGV项目/00-项目总体说明)：项目背景与目标。
2. [项目代码说明](/open-source/02-AGV项目/01-项目代码说明)：代码组织与入口。
3. [ROS 与 STM32 通讯规则](/open-source/02-AGV项目/02-ROS与STM32通讯规则)：上下位机协议约定。
4. [AGV 叉车实验记录](/open-source/02-AGV项目/03-AGV叉车实验记录)：实车调试与验证过程。
5. [Jetson 工控机环境配置](/open-source/02-AGV项目/04-Jetson工控机环境配置)：边缘计算环境准备。
6. [Linux 环境配置](/open-source/02-AGV项目/05-Linux环境配置)：基础系统与工具链配置。
7. [Cartographer 配置及建议](/open-source/02-AGV项目/06-Cartographer配置及建议)：建图配置与经验整理。

## 这组文档关注什么

- ROS 与嵌入式控制器之间如何定义稳定的通信边界；
- 从开发机到 Jetson 实机环境的部署差异；
- 建图、定位和叉车执行机构如何在实验中逐步联调；
- 实际工程中出现的问题、验证方式和调整记录。
