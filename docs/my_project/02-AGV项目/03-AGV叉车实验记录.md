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



```sh
ubuntu20_sfy@agv20:~$ ll /dev/fork*
lrwxrwxrwx 1 root root 6 6月  25 14:00 /dev/forklift_apriltag_camera -> video2
lrwxrwxrwx 1 root root 6 6月  25 13:59 /dev/forklift_artag_camera -> video0
lrwxrwxrwx 1 root root 7 6月  25 11:50 /dev/forklift_controller -> ttyUSB0
```



#### 1.1.2 Gazebo准备



### 1.2 实机实验准备



## 2. 单片机实验

### 2.1 仿真实验：单独验证STM32与ROS通讯

#### 2.1.1 实验说明

- 检查是否有/dev/forklift_controller

```sh
ubuntu20_sfy@agv20:~$ ll /dev/fork*
lrwxrwxrwx 1 root root 7 6月  25 11:50 /dev/forklift_controller -> ttyUSB0
```

- 打开`sfy_robot.cpp`的注释，并重新编译

```cpp
bool turn_on_sfy_robot::Get_Sensor_Data_New()
{
    //Check receive_data.rx for debugging use //查看Receive_Data.rx，调试使用 
    // cout << "================================" << endl;
    // ROS_INFO("Receive_Data.rx[1] = %02x", Receive_Data.rx[1]);
    // ROS_INFO("Receive_Data.rx[2] = %02x", Receive_Data.rx[2]);
    // ROS_INFO("Receive_Data.rx[3] = %02x", Receive_Data.rx[3]);
    // ROS_INFO("Receive_Data.rx[4] = %02x", Receive_Data.rx[4]);
    // ROS_INFO("Receive_Data.rx[5] = %02x", Receive_Data.rx[5]);
    // ROS_INFO("Receive_Data.rx[6] = %02x", Receive_Data.rx[6]);
    // ROS_INFO("Receive_Data.rx[7] = %02x", Receive_Data.rx[7]);
    // ROS_INFO("Receive_Data.rx[8] = %02x", Receive_Data.rx[8]);
    // ROS_INFO("Receive_Data.rx[9] = %02x", Receive_Data.rx[9]);
    // ROS_INFO("Receive_Data.rx[10] = %02x", Receive_Data.rx[10]);
    // ROS_INFO("Receive_Data.rx[11] = %02x", Receive_Data.rx[11]);
    // ROS_INFO("Receive_Data.rx[12] = %02x", Receive_Data.rx[12]);
    // ROS_INFO("Receive_Data.rx[13] = %02x", Receive_Data.rx[13]);
    // ROS_INFO("Robot_Vel.X:%f,Robot_Vel.Y:%f,Robot_Vel.Z:%f", Robot_Vel.X, Robot_Vel.Y, Robot_Vel.Z);
}
```

- 启动文件

```sh
roslaunch turn_on_sfy_robot test_forklift_serial.launch
```

#### 2.1.2 实验设计和结果

- [ ] 使用cmd_vel发数，查看单片机断点，并截图Keil。图片命名：测试下发速度
- [ ] 单片机给Ros发数，截图命令窗口。图片命名：测试上发速度
- [ ] 查看单片机Fcode，编码器测速结果。图片命名：编码器测速

## 3. AGV 叉车初始化定位任务

### 3.1 仿真实验：查看相机初始化定位结果（Apriltag）

#### 3.1.1 实验说明1

- 检查`test_path_plannning_gazebo.launch`,仿真只能使用1个相机 ，相机默认是/dev/video0

```cpp
<!-- 打开Apriltag定位功能-->
<include file="$(find sfy_ros)/launch/test_apriltag_cam.launch" />
<include file="$(find turn_on_sfy_robot)/launch/continuous_detection.launch" />

<!-- 打开看托盘的相机  只能2选1-->
<!-- <include file="$(find sfy_ros)/launch/test_pallet_cam.launch" /> -->
```

- 修改代码`sfy_forklift_mission_planning.cpp`，确保在仿真模式下，直接跳入初始化定位任务

```cpp
SfyForkliftMissionPlanning::SfyForkliftMissionPlanning()
{
    current_forklift_status_ = AGV_STOPPED;
    // current_forklift_task_type_ = FORKLIFT_NO_TASK;
    current_forklift_task_type_ = FORKLIFT_INIT_LOCATION_TASK;
}
```

- 重新编译   启动文件

```sh
roslaunch sfy_ros test_path_plannning_gazebo.launch
```

#### 3.1.2 实验说明2



#### 实验结果



#### 测试不同遮盖程度的定位结果





### 3.2 实机实验：查看叉车初始化定位结果（Apriltag）

> [!CAUTION]
>
> 叉车的基坐标系为base_footprint  叉车定位相机坐标系为usb_cam  请注意实验结果是否正确

#### 实验结果

- 文件位置：

```cpp
roslaunch sfy_ros
```




## 4. AGV叉车测试任务



## 5. AGV叉车取货任务

### 5.1 仿真实验：验证取货路径规划结果（拓扑地图）

#### 5.1.1 实验说明

- 设置叉车的起始位置，在`test_path_plannning_gazebo.launch`

```cpp
    <!--  ************** GAZEBO Simulator ***************  -->
    <arg name="x_pos" default="0.5"/>
    <arg name="y_pos" default="0.0"/>
    <arg name="z_pos" default="0.0"/>
    <arg name="roll" default="0"/>
    <arg name="pitch" default="0"/>
    <arg name="yaw" default="0"/>
```

- 检查代码`sfy_forklift_mission_planning.cpp`，确保在进入取货任务后  跳进取货路径规划

```cpp
else if(current_forklift_task_type_ == FORKLIFT_PICKUP_TASK){

        if(current_forklift_status_ == AGV_STOPPED){               //叉车状态  停车
            if(forklift_model_choose_.click_is_next_step){
                current_forklift_status_ = AGV_PICKUP_PATH_PLANNING;
                // current_forklift_status_ = AGV_ARRIVED_AT_PICKUP;
            }else{
                ROS_INFO("取货任务开始 请点击下一步");
            }      
```

- 路径规划完成后，会自动卡住，当点击`下一步`时才会进行路径跟踪

- 本次路径规划会规划两条路径，叉车只能先正向行驶，然后倒车

- 叉车起始位置斜率与四个方向不能超0.4rad = 

- 启动文件

```sh
roslaunch sfy_ros test_path_plannning_gazebo.launch
```

  

#### 5.1.2 实验结果

叉车起始位置：（x, y, yaw），最近点（编号，方向），取货点（编号，方向）

- [ ] 测试案例1：叉车起始位置：（），取货点（），截图RVIZ ，图片命名：取货路径规划1

```sh

```

- [ ] 测试案例2：
- [ ] 测试案例3：



### 5.2 仿真实验：验证路径跟踪结果（正向和逆向）

### 5.2.1 实验说明

- 实验5.1成功后，点击`下一步`，会自动跳入路径跟踪
- 会实现两次路径跟踪，跟踪完后

### 5.2.2 实验结果

叉车起始位置：（x, y, yaw），最近点（编号，方向），取货点（编号，方向）

- [ ] 测试案例1：叉车起始位置：（），取货点（），录屏RVIZ ，GIF命名：取货路径跟踪1



## 5.3 仿真实验：验证托盘定位结果

#### 5.3.1 实验说明



#### 5.3.2 实验设计



#### 测试不同位置距离的定位结果

90度相机

往前极限距离：          往左极限距离：             往右极限距离：



135度相机



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

