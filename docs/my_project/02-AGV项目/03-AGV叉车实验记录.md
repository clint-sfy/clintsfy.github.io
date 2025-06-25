---
title: AGV叉车实验记录
author: 阿源
date: 2025/06/23 19:00
categories:
 - 个人项目
tags:
 - 个人项目
 - ROS
---

# AGV叉车实验记录

## 1. 实验说明

### 1.1 仿真实验准备

#### 1.1.1 通讯实验准备

- 检查是否有/dev/forklift_controller

```sh
ubuntu20_sfy@agv20:~$ ll /dev/fork*
lrwxrwxrwx 1 root root 6 6月  25 14:00 /dev/forklift_apriltag_camera -> video2
lrwxrwxrwx 1 root root 6 6月  25 13:59 /dev/forklift_artag_camera -> video0
lrwxrwxrwx 1 root root 7 6月  25 11:50 /dev/forklift_controller -> ttyUSB0
```



#### 1.1.2 Gazebo准备



### 1.2 实机实验准备





## 2. 单片机实验

### 2. 仿真实验：验证STM32与ROS通讯

#### 实验说明

- 启动文件

```sh

```



#### 实验结果



## 3. AGV 叉车初始化定位任务

### 3.1 仿真实验：查看相机初始化定位结果（Apriltag）

#### 3.1.1 实验说明

修改代码

```cpp

修改为：

```

- 重新编译

r

#### 测试不同遮盖程度的定位结果



#### 测试不同位置距离的定位结果

包括二维码的大小







### 3.2 实机实验：查看叉车初始化定位结果（Apriltag）

> [!CAUTION]
>
> 叉车的基坐标系为base_footprint  叉车定位相机坐标系为usb_cam  请注意实验结果是否正确

#### 实验结果

- 文件位置：

```cpp
```




## 4. AGV叉车测试任务



## 5. AGV叉车取货任务

### 5.1 仿真实验：验证取货路径规划结果



## 6. AGV叉车放货任务



## 7. AGV叉车停车任务



## 8. 其他实验

### 8.1 仿真实验：MoveBase控制算法测试（仿真实体场景）

- 启动文件

```sh
roslaunch sfy_ros test_sfy_warehouse_gazebo.launch
```

- 启动后，点击2D NAV GOAL
- 然后再地图上随机发布目标点就行，发布的路径为之前设定好的

```cpp
 <rosparam param="wx">[0.5, 4.0, 4.0 , 0]</rosparam>
 <rosparam param="wy">[0.0, 0.0, 8.7 , 8.7]</rosparam>
```

> [!WARNING]
>
> movebase `只能执行一次任务`，任务完成后，请关闭程序

> [!TIP]
>
> 仿真场景可选择：warehouse   warehouse_2   factory  empty_world

### 8.2 仿真实验：MoveBase控制算法测试（空场景）

- 启动文件

```sh
roslaunch sfy_ros test_sfy_empty_gazebo.launch
```

- 启动后，点击2D NAV GOAL
- 然后再地图上随机发布目标点就行，发布的路径为之前设定好的

```cpp
 <rosparam param="wx">[0.5, 4.0, 4.0 , 0]</rosparam>
 <rosparam param="wy">[0.0, 0.0, 8.7 , 8.7]</rosparam>
```

> [!WARNING]
>
> movebase `只能执行一次任务`，任务完成后，请关闭程序

### 8.3 仿真实验：查看AGV叉车模型和TF坐标变换

- 启动文件

```SH
roslaunch sfy_ros rviz_sfy_forklift_model.launch
```

