---
title: cartographer配置及建议
author: 阿源
date: 2023/11/15 12:00
categories:
 - 个人项目
tags:
 - 个人项目
 - ROS
---
# Cartographer配置及建议

cartographer是google开发的实时室内SLAM项目,它采用基于ceres非线性优化的方法,其亮点在于代码规范与工程化,非常适合于商业应用和再开发。并且cartographer基于submap子图构建全局地图的思想,能有效的避免建图过程中环境中移动物体的干扰。

此外,cartographer支持多传感器数据(odometry、IMU、LaserScan等)建图,也支持2D_SLAM和3D_SLAM建图。该算法能天然的输出协方差矩阵,后端优化的输入项,即便是使用成本较低的雷达也能跑出不错的效果。

## 1. 工程化建议

### 1.1 优点  

代码架构十分优美，各个模块独立性很强,可以很方便的进行修改, 或则是单独拿出来做其他应用代码鲁棒性非常高, 很少出现莫名崩掉的情况，错误提示很好，代码命名非常规范，能够清楚的根据变量名与函数名判断其代表的含义。总之，cartographer 的代码十分值得学习与借鉴。

### 1.2 缺点

#### 点云的预处理
发生的拷贝次数太多自适应体素滤波如果参数不好时计算量太大  。

#### 位姿推测器  

- 计算 pose 的线速度与角速度时, 是采用的数据队列开始和末尾的 2 个数据计算的
- 计算里程计的线速度与角速度时, 是采用的数据队列开始和末尾的 2 个数据计算的
- 使用里程计, 不使用 imu 时, 计算里程计的线速度方向和姿态的预测时, 用的是里程计数据队列开始和末尾的 2 个数据的平均角速度计算的, 时间长了就不准
- 不使用里程计, 不使用 imu 时, 用的是 pose 数据队列开始和末尾的 2 个数据的平均角速度计算的, 时间长了就不准
- 添加位姿时, 没有用 pose 的姿态对 imu_tracker_进行校准, 也没有对整体位姿预测器进行校准, 只计算了 pose 的线速度与角速度
- 从代码上看, cartographer 认为位姿推测器推测出来的位姿与姿态是准确的
#### 改进建议
- pose 的距离越小, 匀速模型越能代替机器人的线速度与角速度, 计算 pose 的线速度与角速度时, 可以考虑使用最近的 2 个数据进行计算  
- 里程计距离越短数据越准, 计算里程计的线速度与角速度时, 可以考虑使用最近的2 个数据进行计算 
- 使用里程计, 不使用 imu 时, 计算里程计的线速度方向时, 可以考虑使用里程计的角度进行计算  
- 使用里程计, 不使用 imu 时, 进行姿态的预测时, 可以考虑使用里程计的角度进行预测
- 不使用里程计, 不使用 imu 时, 可以考虑用最近的 2 个 pose 计算线速度与角速度  
- 使用 pose 对 imu_tracker_的航向角进行校准
#### 基于 Ceres 的扫描匹配

平移和旋转的残差项是逼近于先验位姿的, 当先验位姿不准确时会产生问题 。

可能的改进建议先将地图的权重调大, 平移旋转的权重调小, 如 1000, 1, 1, 或者 100, 1, 1 。

调参没有作用的时候可以将平移和旋转的残差项注释掉 。

#### 后端优化  

优化时的计算量太大, 可以根据自己需求调整参数, 或者增加计算前的过滤。

在计算子图间约束的时候, 目前 cartographer 是根据节点个数来做的, 定位时又根据时间来决定是否进行全子图的匹配, 这部分计算的判断可以根据自己的需求增加一些, 以减少计算量. 。

### 1.3 工程化的目的  

根据机器人的传感器硬件, 最终能够实现稳定地构建一张不叠图的二维栅格地图。

由于 cartographer 代码十分的优秀, 所以 cartographer 的稳定性目前已经很好了, 比目前的大部分 slam 的代码都稳定, 很少会出现崩掉的情况，最多就是会由于某些原因提示错误。

### 1.4 如何提升建图质量  

最简单的一种方式，选择好的传感器。选择频率高(25hz 以上), 精度高的雷达, 精度高的imu, 这样的传感器配置下很难有建不好的地图.。

####  如果只能用频率低的雷达呢？
由于频率低时的叠图基本都是在旋转时产生的, 所以推荐使用一个好的 imu, 然后建图的时候让机器人的移动与旋转速度慢一点(建图轨迹与建图速度十分影响建图效果), 这时候再看建图效果.
如果效果还不行, 调 ceres 的匹配权重, 将地图权重调大, 平移旋转权重调小.
如果效果还不行, 可以将代码中平移和旋转的残差注释掉.
如果效果还不行, 那就得改代码了, 去改位姿推测器那部分的代码, 让预测的准一点  

#### 里程计  

为什么一直没有说里程计, 就是由于 cartographer 中对里程计的使用不太好.
cartographer 中对里程计的使用有 2 部分, 一个是前端的位姿推测器, 一个是后端根据里程计数据计算残差. 后端部分的使用是没有问题的.
如果想要在 cartographer 中使用里程计达到比较好的效果, 前端的位姿推测器这部分需要自己重写.
可以将 karto 与 gmapping 的使用里程计进行预测的部分拿过来进行使用, 改完了之后就能够达到比较好的位姿预测效果了.  

#### 粗匹配  

cartographer 的扫描匹配中的粗匹配是一种暴力匹配的方法, 目的是对位姿预测出的位姿进行校准, 但是这个扫描匹配的计算量太大了, 导致不太好用.
这块可以进行改进, 可以将 karto 的扫描匹配的粗匹配放过来, karto 的扫描匹配的计算量很小, 当做粗匹配很不错.  

#### 地图  

有时前端部分生成的地图出现了叠图, 而前端建的地图在后端是不会被修改的, 后端优化只会优化节点位姿与子图位姿。

同时 cartographer_ros 最终生成的地图是将所有地图叠加起来的, 就会导致这个叠图始终都存在, 又或者是后边的地图的空白部分将前边的地图的边给覆盖住了, 导致墙的黑边消失了。

后端优化会将节点与子图的位姿进行优化, 但是不会改动地图，所以可以在最终生成地图的时候使用后端优化后的节点重新生成一次地图, 这样生成的地图的效果会比前端地图的叠加要好很多。

这块的实现可以参考一下实时生成三维点云地图部分的代码。

#### 更极致的修改  

后端优化后的节点与子图位姿是不会对前端产生影响的, 这块可以进行优化一下, 就是前端匹配的时候, 不再使用前端生成的地图进行匹配, 而是使用后端生成的地图进行匹配, 这样就可以将后端优化后的效果带给前端. 但是这要对代码进行大改, 比较费劲. 。

### 1.5 降低计算量与内存  

- 体素滤波与自适应体素滤波的计算量(不是很大)
- 后端进行子图间约束时的计算量很大
- 分支定界算法的计算量很大
- 降低内存, 内存的占用基本就是多分辨率地图这, 每个子图的多分辨率地图都进行保存是否有必要  
### 1.6 纯定位的建议
目前 cartographer 的纯定位和正常的建图是一样的, 只是仅保存 3 个子图, 依然要进行后端优化。

这就导致了几个问题:

第一个: 前端的扫描匹配, 是当前的雷达点云与当前轨迹的地图进行匹配, 而不是和之前的地图进行匹配, 这就导致了定位时机器人当前的点云与之前的地图不一定能匹配很好,就是因为当前的点云是匹配当前轨迹的地图的, 不是与之前的地图进行匹配。

第二个: 纯定位其实就是建图, 所以依然会进行回环检测与后端优化, 而后端优化的计算在定位这是没有必要的, 带来了额外的计算量.

第三个: 纯定位依然会进行回环检测, 回环检测有可能导致机器人的位姿发生跳变。

#### 改进思路
将纯定位模式与建图拆分开, 改成读取之前轨迹的地图进行匹配。

新的轨迹只进行位姿预测, 拿到预测后的位姿与之前轨迹的地图进行匹配, 新的轨迹不再进行地图的生成与保存. 同时将整个后端的功能去掉.

去掉了后端优化之后, 会导致没有重定位功能, 这时候可以将 cartographer 的回环检测(子图间约束的计算)部分单独拿出来, 做成一个重定位功能. 通过服务来调用这个重定位功能, 根据当前点云确定机器人在之前地图的位姿。这样才是一个比较好的定位功能的思路。

## 2. cartographer运行

源码添加东西

```
lx_rs16_2d_outdoor.lua
lx_rs16_2d_outdoor.launch
lx_2d.rviz

rslidar-outdoor-gps-notf.bag
一个户外的园区，大概30m*100m，使用速腾16线雷达，范围最远150m
```

### 地图保存

通过map_server保存是没有地图边界的（不是黑色的），map_server占用的像素值一定要是100才表示占用，但是cartographer会小一点 

自己写脚本：finish_slam_2d.sh

```sh
#!/bin/bash

source install_isolated/setup.bash

map_dir="${HOME}/carto_ws/map"
map_name="2d-1"

# 检查文件夹是否存在, 如果不存在就创建文件夹
if [ ! -d "$map_dir" ];then
  echo "文件夹不存在, 正在创建文件夹"
  mkdir -p $map_dir
fi


# finish slam  结束轨迹
rosservice call /finish_trajectory 0

# make pbstream  生成pbstream文件
rosservice call /write_state "{filename: '$map_dir/$map_name.pbstream'}"

# pbstream to map
rosrun cartographer_ros cartographer_pbstream_to_ros_map \
-pbstream_filename=$map_dir/$map_name.pbstream \
-map_filestem=$map_dir/$map_name
```

3d保存

```sh
#!/bin/bash

source install_isolated/setup.bash

map_dir="${HOME}/carto_ws/map"
map_name="3d-1"

# 检查文件夹是否存在, 如果不存在就创建文件夹
if [ ! -d "$map_dir" ];then
  echo "文件夹不存在, 正在创建文件夹"
  mkdir -p $map_dir
fi

# finish slam
rosservice call /finish_trajectory 0

# make pbstream
rosservice call /write_state "{filename: '$map_dir/$map_name.pbstream'}"
```

### rviz参数说明

![](https://cdn.jsdelivr.net/gh/clint-sfy/blogcdn@master/ros/cartographer/20231116121244.png)

第一个是雷达的原始数据，第二个是处理过后的数据

Trajectories：小车的轨迹

 constraints：约束可视化，两个节点间相对坐标变换

## 3. bag文件说明

### 查看bag文件

```bash
rosbag info
```

```
path:        rslidar-outdoor-gps.bag
version:     2.0
duration:    3:33s (213s)
start:       Dec 01 2020 15:44:09.49 (1606808649.49)
end:         Dec 01 2020 15:47:43.48 (1606808863.48)
size:        2.1 GB
messages:    41623
compression: none [2064/2064 chunks]
types:       geometry_msgs/QuaternionStamped [e57f1e547e0e1fd13504588ffc8334e2]
             nav_msgs/Odometry               [cd5e73d190d741a2f92e81eda573aca7]
             sensor_msgs/Imu                 [6a62c6daae103f4ff57a132d6f95cec2]
             sensor_msgs/LaserScan           [90c7ef2dc6895d81024acba2ac42f369]
             sensor_msgs/NavSatFix           [2d3a8cd499b9b4a0249fb98fd05cfa48]
             sensor_msgs/PointCloud2         [1158d486dd51d683ce2f1be655c3c181]
             tf2_msgs/TFMessage              [94810edda583a504dfda3829e70d7eec]
topics:      /fix               1070 msgs    : sensor_msgs/NavSatFix          
             /front_scan        4127 msgs    : sensor_msgs/LaserScan          
             /heading            214 msgs    : geometry_msgs/QuaternionStamped
             /imu              21400 msgs    : sensor_msgs/Imu                
             /odom_scout        4279 msgs    : nav_msgs/Odometry              
             /rslidar_points    4126 msgs    : sensor_msgs/PointCloud2        
             /tf                6406 msgs    : tf2_msgs/TFMessage              (2 connections)
             /tf_static            1 msg     : tf2_msgs/TFMessage
```

### IMU数据格式

```
std_msgs/Header header
  uint32 seq
  time stamp
  string frame_id
geometry_msgs/Quaternion orientation
  float64 x
  float64 y
  float64 z
  float64 w
float64[9] orientation_covariance
geometry_msgs/Vector3 angular_velocity
  float64 x
  float64 y
  float64 z
float64[9] angular_velocity_covariance
geometry_msgs/Vector3 linear_acceleration
  float64 x
  float64 y
  float64 z
float64[9] linear_acceleration_covariance
```

### 单线雷达

```
std_msgs/Header header
  uint32 seq
  time stamp
  string frame_id
float32 angle_min
float32 angle_max
float32 angle_increment
float32 time_increment
float32 scan_time
float32 range_min
float32 range_max
float32[] ranges
float32[] intensities
```

### 多线点云

```
std_msgs/Header header
  uint32 seq
  time stamp
  string frame_id
uint32 height
uint32 width
sensor_msgs/PointField[] fields
  uint8 INT8=1
  uint8 UINT8=2
  uint8 INT16=3
  uint8 UINT16=4
  uint8 INT32=5
  uint8 UINT32=6
  uint8 FLOAT32=7
  uint8 FLOAT64=8
  string name
  uint32 offset
  uint8 datatype
  uint32 count
bool is_bigendian
uint32 point_step
uint32 row_step
uint8[] data
bool is_dense
```

### 里程计

```
std_msgs/Header header
  uint32 seq
  time stamp
  string frame_id
string child_frame_id
geometry_msgs/PoseWithCovariance pose
  geometry_msgs/Pose pose
    geometry_msgs/Point position
      float64 x
      float64 y
      float64 z
    geometry_msgs/Quaternion orientation
      float64 x
      float64 y
      float64 z
      float64 w
  float64[36] covariance
geometry_msgs/TwistWithCovariance twist
  geometry_msgs/Twist twist
    geometry_msgs/Vector3 linear
      float64 x
      float64 y
      float64 z
    geometry_msgs/Vector3 angular
      float64 x
      float64 y
      float64 z
  float64[36] covariance
```

## 4. 如何配置 Launch 与 Lua 文件  

### 了解 bag 文件  

播放 bag 文件需要在 bag 的文件夹内启动五个终端

第一个终端执行 roscore

第二个终端执行 rosbag info rslidar-outdoor-gps.bag   了解 bag 中 topic 的名称与类型

第三个执行 rosbag play rslidar-outdoor-gps.bag

第四个终端执行 rqt  了解 bag 中的 tf 树.  

### 配置 launch 文件  

```vue
<launch>
  <!-- bag的地址与名称 -->
  <arg name="bag_filename" default="$(env HOME)/bagfiles/rslidar-outdoor-gps-notf.bag"/>

  <!-- 使用bag的时间戳 -->
  <param name="/use_sim_time" value="true" />

  <!-- 启动cartographer --> 
  <node name="cartographer_node" pkg="cartographer_ros"
      type="cartographer_node" args="
          -configuration_directory $(find cartographer_ros)/configuration_files
          -configuration_basename lx_rs16_2d_outdoor.lua"
      output="screen">
    <!-- 点云 --> 
    <remap from="points2" to="rslidar_points" />
    <!-- 单线雷达 -->
    <remap from="scan" to="front_scan" />
    <remap from="odom" to="odom_scout" />
    <remap from="imu" to="imu" />
  </node>

  <!-- 生成ros格式的地图 -->
  <node name="cartographer_occupancy_grid_node" pkg="cartographer_ros"
      type="cartographer_occupancy_grid_node" args="-resolution 0.05" />

  <!-- 启动rviz -->
  <node name="rviz" pkg="rviz" type="rviz" required="true"
      args="-d $(find cartographer_ros)/configuration_files/lx_2d.rviz" />

  <!-- 启动rosbag -->
  <node name="playbag" pkg="rosbag" type="play"
      args="--clock $(arg bag_filename)" />

</launch>
```

### 配置 lua 文件  

• tracking_frame 有 imu 的 link 就设置成 imu 的 link, 没有就设置成 base_link

• published_frame cartographer 发布的 tf 的最下边一个坐标系, 就是 bag 文件中 tf树的最上边的一个坐标系

• provide_odom_frame 是否提供里程计, 如果 bag 中有里程计的坐标系, 这个就是false, 如果没有, 就根据需要决定是否提供里程计的坐标系

• use_pose_extrapolator = false 这个一定要设置成 false

• use_odometry 是否使用里程计的传感器数据, 如果为 true, tf 树中一定要存在odom 这个坐标系

• use_nav_sat/use_landmarks 是否订阅里程计话题的数据, 以及 landmark 话题的数据

• num_laser_scans/num_point_clouds 单线点云与多线点云的话题的数量, 可以同时为 1, 不可以同时为 0

• num_subdivisions_per_laser_scan 一帧点云数据会被分成几次处理, 设置成 1 就行了

• MAP_BUILDER.use_trajectory_builder_2d = true 建二维图时一定要有这句话, 建三维图就把 2d 改成 3d  

• TRAJECTORY_BUILDER_2D.use_imu_data 是否使用 imu, 如果用 imu,tracking_frame 一定要设置成 imu 的 link

• TRAJECTORY_BUILDER_2D.min_z 点云的最小 z 的范围, 单线点云不能设置大于 0 的值(不设置), 多线点云的这个值要大于 0  

```lua
include "map_builder.lua"
include "trajectory_builder.lua"

options = {
  map_builder = MAP_BUILDER,                -- map_builder.lua的配置信息
  trajectory_builder = TRAJECTORY_BUILDER,  -- trajectory_builder.lua的配置信息
  
  map_frame = "map",                        -- 地图坐标系的名字
  --tracking_frame 有 imu 的 link 就设置成 imu 的 link, 没有就设置成 base_link
  tracking_frame = "imu_link",              -- 将所有传感器数据转换到这个坐标系下
  -- 发布的 tf 的最下边一个坐标系, 就是 bag 文件中 tf树的最上边的一个坐标系
  published_frame = "footprint",            -- tf: map -> footprint
  odom_frame = "odom",                      -- 里程计的坐标系名字
  provide_odom_frame = false,               -- 是否提供odom的tf, 如果为true,则tf树为map->odom->footprint
                                            -- 如果为false tf树为map->footprint
  publish_frame_projected_to_2d = false,    -- 是否将坐标系投影到平面上
  --use_pose_extrapolator = false,            -- 发布tf时是使用pose_extrapolator的位姿还是前端计算出来的位姿

  use_odometry = false,                     -- 是否使用里程计,如果使用要求一定要有odom的tf
  use_nav_sat = false,                      -- 是否使用gps
  use_landmarks = false,                    -- 是否使用landmark
  num_laser_scans = 0,                      -- 是否使用单线激光数据
  num_multi_echo_laser_scans = 0,           -- 是否使用multi_echo_laser_scans数据
  num_subdivisions_per_laser_scan = 1,      -- 1帧数据被分成几次处理,一般为1
  num_point_clouds = 1,                     -- 是否使用点云数据
  
  lookup_transform_timeout_sec = 0.2,       -- 查找tf时的超时时间
  submap_publish_period_sec = 0.3,          -- 发布数据的时间间隔
  pose_publish_period_sec = 5e-3,
  trajectory_publish_period_sec = 30e-3,

  rangefinder_sampling_ratio = 1.,          -- 传感器数据的采样频率
  odometry_sampling_ratio = 1.,
  fixed_frame_pose_sampling_ratio = 1.,
  imu_sampling_ratio = 1.,
  landmarks_sampling_ratio = 1.,
}

MAP_BUILDER.use_trajectory_builder_2d = true   

TRAJECTORY_BUILDER_2D.use_imu_data = true   -- 设置IMU数据
TRAJECTORY_BUILDER_2D.min_range = 0.3   --雷达的最大最小距离，根据雷达硬件设定
TRAJECTORY_BUILDER_2D.max_range = 100.  --雷达的最大最小距离，根据雷达硬件设定
TRAJECTORY_BUILDER_2D.min_z = 0.2  --使用多点高以上的点云，单线的时候不要设置，多线防止打到地面上的点干扰建图
--TRAJECTORY_BUILDER_2D.max_z = 1.4
--TRAJECTORY_BUILDER_2D.voxel_filter_size = 0.02

--TRAJECTORY_BUILDER_2D.adaptive_voxel_filter.max_length = 0.5
--TRAJECTORY_BUILDER_2D.adaptive_voxel_filter.min_num_points = 200.
--TRAJECTORY_BUILDER_2D.adaptive_voxel_filter.max_range = 50.

--TRAJECTORY_BUILDER_2D.loop_closure_adaptive_voxel_filter.max_length = 0.9
--TRAJECTORY_BUILDER_2D.loop_closure_adaptive_voxel_filter.min_num_points = 100
--TRAJECTORY_BUILDER_2D.loop_closure_adaptive_voxel_filter.max_range = 50.

TRAJECTORY_BUILDER_2D.use_online_correlative_scan_matching = false

--ceres地图的扫描，平移，旋转的权重，影响建图效果，其他基本上是影响计算量等
--扫描匹配点云和地图匹配程度，值越大，点云和地图匹配置信度越高
TRAJECTORY_BUILDER_2D.ceres_scan_matcher.occupied_space_weight = 1.
--残差平移、旋转分量，值越大，越不相信和地图匹配的效果，而是越相信先验位姿的结果
TRAJECTORY_BUILDER_2D.ceres_scan_matcher.translation_weight = 1.
--如果imu不好，接入后地图旋转厉害，可以将这里的旋转权重减小
TRAJECTORY_BUILDER_2D.ceres_scan_matcher.rotation_weight = 1.
--TRAJECTORY_BUILDER_2D.ceres_scan_matcher.ceres_solver_options.max_num_iterations = 12

--TRAJECTORY_BUILDER_2D.motion_filter.max_distance_meters = 0.1
--TRAJECTORY_BUILDER_2D.motion_filter.max_angle_radians = 0.004
--TRAJECTORY_BUILDER_2D.imu_gravity_time_constant = 1.

TRAJECTORY_BUILDER_2D.submaps.num_range_data = 80.  --一个子图插入多少个节点，根据laser和运动速度进行具体的调整
TRAJECTORY_BUILDER_2D.submaps.grid_options_2d.resolution = 0.1

POSE_GRAPH.optimize_every_n_nodes = 160.   -- 2倍的num_range_data以上
POSE_GRAPH.constraint_builder.sampling_ratio = 0.3   -- 如果添加的约束与潜在约束的比例低于此比例,则将添加约束
POSE_GRAPH.constraint_builder.max_constraint_distance = 15. -- 在子图附近考虑姿势的阈值,大于这个值将被略过
-- 回环检测阈值，如果不稳定有错误匹配，可以提高这两个值，场景重复可以降低或者关闭回环
POSE_GRAPH.constraint_builder.min_score = 0.48
POSE_GRAPH.constraint_builder.global_localization_min_score = 0.60

return options
```

既有单线又有多线的时候，考虑TRAJECTORY_BUILDER_2D.min_z = ，过滤掉地面的同时，也会过滤掉单线的数据，默认是-0.8，多线点云会打到地面，2d地图会变得不能用

## 5. 参数的详解与调参总结  

### trajectory_builder.lua

```lua
include "trajectory_builder_2d.lua"
include "trajectory_builder_3d.lua"

TRAJECTORY_BUILDER = {
  trajectory_builder_2d = TRAJECTORY_BUILDER_2D,
  trajectory_builder_3d = TRAJECTORY_BUILDER_3D,
--  pure_localization_trimmer = {
--    max_submaps_to_keep = 3,
--  },
  collate_fixed_frame = true, -- 是否将数据放入阻塞队列中
  collate_landmarks = false,  -- 是否将数据放入阻塞队列中
}
```

### trajectory_builder_2d.lua

```lua
TRAJECTORY_BUILDER_2D.use_imu_data = true   -- 对应自己配置的Lua文件
TRAJECTORY_BUILDER_2D.min_range = 0.3
TRAJECTORY_BUILDER_2D.max_range = 100.
TRAJECTORY_BUILDER_2D.min_z = 0.2
```

```lua
TRAJECTORY_BUILDER_2D = {
  use_imu_data = true,            -- 是否使用imu数据
  min_range = 0.,                 -- 雷达数据的最远最近滤波, 保存中间值
  max_range = 30.,
  min_z = -0.8,                   -- 雷达数据的最高与最低的过滤, 保存中间值
  max_z = 2.,
  missing_data_ray_length = 5.,   -- 超过最大距离范围的数据点用这个距离代替
  num_accumulated_range_data = 1, -- 几帧有效的点云数据进行一次扫描匹配 来一帧做一次 一般就是1
  voxel_filter_size = 0.025,      -- 体素滤波的立方体的边长

  -- 使用固定的voxel滤波之后, 再使用自适应体素滤波器
  -- 体素滤波器 用于生成稀疏点云 以进行 扫描匹配
  adaptive_voxel_filter = {
    max_length = 0.5,             -- 尝试确定最佳的立方体边长, 边长最大为0.5
    min_num_points = 200,         -- 如果存在 较多点 并且大于'min_num_points', 则减小体素长度以尝试获得该最小点数
    max_range = 50.,              -- 距远离原点超过max_range 的点被移除
  },

  -- 闭环检测的自适应体素滤波器, 用于生成稀疏点云 以进行 闭环检测
  loop_closure_adaptive_voxel_filter = {
    max_length = 0.9,
    min_num_points = 100,
    max_range = 50.,
  },

  -- 是否使用 real_time_correlative_scan_matcher 为ceres提供先验信息
  -- 计算复杂度高 , 但是很鲁棒 , 在odom或者imu不准时依然能达到很好的效果
  -- 只使用单线激光雷达，建图效果不好，设置位true，代价是计算量提高
  use_online_correlative_scan_matching = false,
  real_time_correlative_scan_matcher = {
    linear_search_window = 0.1,             -- 线性搜索窗口的大小
    angular_search_window = math.rad(20.),  -- 角度搜索窗口的大小
    translation_delta_cost_weight = 1e-1,   -- 用于计算各部分score的权重
    rotation_delta_cost_weight = 1e-1,
  },
 
  -- ceres匹配的一些配置参数
  ceres_scan_matcher = {
    occupied_space_weight = 1.,   -- 点云和地图匹配的权重
    translation_weight = 10.,     -- 先验位姿和匹配之后位姿的平移偏移量
    rotation_weight = 40.,
    ceres_solver_options = {
      use_nonmonotonic_steps = false,
      max_num_iterations = 20,
      num_threads = 1,
    },
  },

  -- 为了防止子图里插入太多数据, 在插入子图之前之前对数据进行过滤
  motion_filter = {
    max_time_seconds = 5.,
    max_distance_meters = 0.2,
    max_angle_radians = math.rad(1.),
  },

  -- TODO(schwoere,wohe): Remove this constant. This is only kept for ROS.
  imu_gravity_time_constant = 10.,

  -- 位姿预测器
  pose_extrapolator = {
    use_imu_based = false,
    constant_velocity = {
      imu_gravity_time_constant = 10.,
      pose_queue_duration = 0.001,
    },
    imu_based = {
      pose_queue_duration = 5.,
      gravity_constant = 9.806,
      pose_translation_weight = 1.,
      pose_rotation_weight = 1.,
      imu_acceleration_weight = 1.,
      imu_rotation_weight = 1.,
      odometry_translation_weight = 1.,
      odometry_rotation_weight = 1.,
      solver_options = {
        use_nonmonotonic_steps = false;
        max_num_iterations = 10;
        num_threads = 1;
      },
    },
  },

  -- 子图相关的一些配置
  submaps = {
    num_range_data = 90,          -- 一个子图里插入雷达数据的个数的一半
    grid_options_2d = {
      grid_type = "PROBABILITY_GRID", -- 地图的种类, 还可以是tsdf格式
      resolution = 0.05,   -- 地图的分辨率 很重要可以改
    },
    range_data_inserter = {
      range_data_inserter_type = "PROBABILITY_GRID_INSERTER_2D",
      -- 概率占用栅格地图的一些配置
      probability_grid_range_data_inserter = {
        insert_free_space = true,
        hit_probability = 0.55,
        miss_probability = 0.49,
      },
      -- tsdf地图的一些配置
      tsdf_range_data_inserter = {
        truncation_distance = 0.3,
        maximum_weight = 10.,
        update_free_space = false,
        normal_estimation_options = {
          num_normal_samples = 4,
          sample_radius = 0.5,
        },
        project_sdf_distance_to_scan_normal = true,
        update_weight_range_exponent = 0,
        update_weight_angle_scan_normal_to_ray_kernel_bandwidth = 0.5,
        update_weight_distance_cell_to_hit_kernel_bandwidth = 0.5,
      },
    },
  },
}
```

### trajectory_builder_3d.lua

```lua
MAX_3D_RANGE = 60.
INTENSITY_THRESHOLD = 40

TRAJECTORY_BUILDER_3D = {
  min_range = 1.,
  max_range = MAX_3D_RANGE,
  num_accumulated_range_data = 1,
  voxel_filter_size = 0.15,

  -- 在3d slam 时会有2个自适应体素滤波, 一个生成高分辨率点云, 一个生成低分辨率点云
  high_resolution_adaptive_voxel_filter = {
    max_length = 2.,
    min_num_points = 150,
    max_range = 15.,
  },

  low_resolution_adaptive_voxel_filter = {
    max_length = 4.,
    min_num_points = 200,
    max_range = MAX_3D_RANGE,
  },

  use_online_correlative_scan_matching = false,
  real_time_correlative_scan_matcher = {
    linear_search_window = 0.15,
    angular_search_window = math.rad(1.),
    translation_delta_cost_weight = 1e-1,
    rotation_delta_cost_weight = 1e-1,
  },

  ceres_scan_matcher = {
    -- 在3D中,occupied_space_weight_0和occupied_space_weight_1参数分别与高分辨率和低分辨率滤波点云相关
    occupied_space_weight_0 = 1.,
    occupied_space_weight_1 = 6.,
    intensity_cost_function_options_0 = {
        weight = 0.5,
        huber_scale = 0.3,
        intensity_threshold = INTENSITY_THRESHOLD,
    },
    translation_weight = 5.,
    rotation_weight = 4e2,
    only_optimize_yaw = false,
    ceres_solver_options = {
      use_nonmonotonic_steps = false,
      max_num_iterations = 12,
      num_threads = 1,
    },
  },

  motion_filter = {
    max_time_seconds = 0.5,
    max_distance_meters = 0.1,
    max_angle_radians = 0.004,
  },

  rotational_histogram_size = 120,

  -- TODO(schwoere,wohe): Remove this constant. This is only kept for ROS.
  imu_gravity_time_constant = 10.,
  pose_extrapolator = {
    use_imu_based = false,
    constant_velocity = {
      imu_gravity_time_constant = 10.,
      pose_queue_duration = 0.001,
    },
    -- TODO(wohe): Tune these parameters on the example datasets.
    imu_based = {
      pose_queue_duration = 5.,
      gravity_constant = 9.806,
      pose_translation_weight = 1.,
      pose_rotation_weight = 1.,
      imu_acceleration_weight = 1.,
      imu_rotation_weight = 1.,
      odometry_translation_weight = 1.,
      odometry_rotation_weight = 1.,
      solver_options = {
        use_nonmonotonic_steps = false;
        max_num_iterations = 10;
        num_threads = 1;
      },
    },
  },

  submaps = {
    -- 2种分辨率的地图
    high_resolution = 0.10,           -- 用于近距离测量的高分辨率hybrid网格 for local SLAM and loop closure, 用来与小尺寸voxel进行精匹配
    high_resolution_max_range = 20.,  -- 在插入 high_resolution map 之前过滤点云的最大范围
    low_resolution = 0.45,
    num_range_data = 160,             -- 用于远距离测量的低分辨率hybrid网格 for local SLAM only, 用来与大尺寸voxel进行粗匹配
    range_data_inserter = {
      hit_probability = 0.55,
      miss_probability = 0.49,
      num_free_space_voxels = 2,
      intensity_threshold = INTENSITY_THRESHOLD,
    },
  },

  -- When setting use_intensites to true, the intensity_cost_function_options_0
  -- parameter in ceres_scan_matcher has to be set up as well or otherwise
  -- CeresScanMatcher will CHECK-fail.
  use_intensities = false,
}
```

### map_builder.lua

```lua
include "pose_graph.lua"

MAP_BUILDER = {
  use_trajectory_builder_2d = false,    -- 这两个一定有一个是true
  use_trajectory_builder_3d = false,    -- 这两个一定有一个是true
  num_background_threads = 4,
  pose_graph = POSE_GRAPH,
  collate_by_trajectory = false,
}
```

### pose_graph.lua

```lua
POSE_GRAPH = {
  -- 每隔多少个节点执行一次后端优化  子图插入到160个节点，
  optimize_every_n_nodes = 90,    -- 可以设置为TRAJECTORY_BUILDER_2D.submaps.num_range_data的两倍

  -- 约束构建的相关参数
  constraint_builder = {
    sampling_ratio = 0.3,                 -- 对局部子图进行回环检测时的计算频率, 数值越大, 计算次数越多
    max_constraint_distance = 15.,        -- 对局部子图进行回环检测时能成为约束的最大距离
    min_score = 0.55,                     -- 对局部子图进行回环检测时的最低分数阈值
    global_localization_min_score = 0.6,  -- 对整体子图进行回环检测时的最低分数阈值
    loop_closure_translation_weight = 1.1e4,
    loop_closure_rotation_weight = 1e5,
    log_matches = true,                   -- 打印约束计算的log
    
    -- 基于分支定界算法的2d粗匹配器
    fast_correlative_scan_matcher = {
      linear_search_window = 7.,
      angular_search_window = math.rad(30.),
      branch_and_bound_depth = 7,
    },

    -- 基于ceres的2d精匹配器
    ceres_scan_matcher = {
      occupied_space_weight = 20.,
      translation_weight = 10.,
      rotation_weight = 1.,
      ceres_solver_options = {
        use_nonmonotonic_steps = true,
        max_num_iterations = 10,
        num_threads = 1,
      },
    },

    -- 基于分支定界算法的3d粗匹配器
    fast_correlative_scan_matcher_3d = {
      branch_and_bound_depth = 8,
      full_resolution_depth = 3,
      min_rotational_score = 0.77,
      min_low_resolution_score = 0.55,
      linear_xy_search_window = 5.,
      linear_z_search_window = 1.,
      angular_search_window = math.rad(15.),
    },

    -- 基于ceres的3d精匹配器
    ceres_scan_matcher_3d = {
      occupied_space_weight_0 = 5.,
      occupied_space_weight_1 = 30.,
      translation_weight = 10.,
      rotation_weight = 1.,
      only_optimize_yaw = false,
      ceres_solver_options = {
        use_nonmonotonic_steps = false,
        max_num_iterations = 10,
        num_threads = 1,
      },
    },
  },

  matcher_translation_weight = 5e2,
  matcher_rotation_weight = 1.6e3,

  -- 优化残差方程的相关参数
  optimization_problem = {
    huber_scale = 1e1,                -- 值越大,（潜在）异常值的影响就越大
    acceleration_weight = 1.1e2,      -- 3d里imu的线加速度的权重
    rotation_weight = 1.6e4,          -- 3d里imu的旋转的权重
     
    -- 前端结果残差的权重
    local_slam_pose_translation_weight = 1e5,
    local_slam_pose_rotation_weight = 1e5,
    -- 里程计残差的权重
    odometry_translation_weight = 1e5,
    odometry_rotation_weight = 1e5,
    -- gps残差的权重
    fixed_frame_pose_translation_weight = 1e1,
    fixed_frame_pose_rotation_weight = 1e2,
    fixed_frame_pose_use_tolerant_loss = false,
    fixed_frame_pose_tolerant_loss_param_a = 1,
    fixed_frame_pose_tolerant_loss_param_b = 1,

    log_solver_summary = false,
    use_online_imu_extrinsics_in_3d = true,
    fix_z_in_3d = false,
    ceres_solver_options = {
      use_nonmonotonic_steps = false,
      max_num_iterations = 50,
      num_threads = 7,
    },
  },

  max_num_final_iterations = 200,   -- 在建图结束之后执行一次全局优化, 不要求实时性, 迭代次数多
  global_sampling_ratio = 0.003,    -- 纯定位时候查找回环的频率
  log_residual_histograms = true,
  global_constraint_search_after_n_seconds = 10., -- 纯定位时多少秒执行一次全子图的约束计算

  --  overlapping_submaps_trimmer_2d = {
  --    fresh_submaps_count = 1,
  --    min_covered_area = 2,
  --    min_added_submaps_count = 5,
  --  },
}
```

### 常调的参数

```lua
TRAJECTORY_BUILDER_2D.min_range = 0.3
TRAJECTORY_BUILDER_2D.max_range = 100.
TRAJECTORY_BUILDER_2D.min_z = 0.2 -- / -0.8
TRAJECTORY_BUILDER_2D.voxel_filter_size = 0.02

-- 调参建图效果 
TRAJECTORY_BUILDER_2D.ceres_scan_matcher.occupied_space_weight =10.
-- 平移和旋转
TRAJECTORY_BUILDER_2D.ceres_scan_matcher.translation_weight = 1.
TRAJECTORY_BUILDER_2D.ceres_scan_matcher.rotation_weight = 1.

TRAJECTORY_BUILDER_2D.submaps.num_range_data = 80.
TRAJECTORY_BUILDER_2D.submaps.grid_options_2d.resolution = 0.1 -- /0.02

POSE_GRAPH.optimize_every_n_nodes = 160. -- 2 倍的 num_range_data 以上
POSE_GRAPH.constraint_builder.sampling_ratio = 0.3
POSE_GRAPH.constraint_builder.max_constraint_distance = 15. -- 回环检测最大距离
POSE_GRAPH.constraint_builder.min_score = 0.48  -- 回环检测阈值
POSE_GRAPH.constraint_builder.global_localization_min_score = 0.60 
```

### 降低延迟与减小计算量  

#### 前端部分

• 减小 max_range, 减小了需要处理的点数, 在雷达数据远距离的点不准时一定要减小这个值

• 增大 voxel_filter_size, 相当于减小了需要处理的点数

• 增大 submaps.resolution, 相当于减小了匹配时的搜索量

• 对于自适应体素滤波 减小 min_num_points 与 max_range, 增大 max_length, 相当于减小了需要处理的点数  

#### 后端部分
• 增大 optimize_every_n_nodes, 降低优化频率, 减小了计算量

• 增大 MAP_BUILDER.num_background_threads, 增加计算速度

• 减小 global_sampling_ratio, 减小计算全局约束的频率

• 减小 constraint_builder.sampling_ratio, 减少了约束的数量

• 增大 constraint_builder.min_score, 减少了约束的数量  

• 减小分枝定界搜索窗的大小, 包括linear_xy_search_window,inear_z_search_window,angular_search_window

• 增大 global_constraint_search_after_n_seconds, 减小计算全局约束的频率

• 减小 max_num_iterations, 减小迭代次数  

#### 降低内存
增大子图的分辨率 submaps.resolution  

#### 降低纯定位时错误重定位的概率
修改 pose_graph.lua 中的如下参数

• 提高 optimize_every_n_nodes , 减小了优化的次数

• 减小 sampling_ratio, 减小了计算约束的次数

• 减小 max_constraint_distance, 减小了计算约束的距离

• 提高 min_score, 减小了计算约束的数量, 提高约束正确的概率

• 提高 global_localization_min_score, 减小了计算约束的数量, 提高约束正确的概率

• 提高 global_constraint_search_after_n_seconds , 减小了回环的次数(隔多长时间计算一次)  

## 6. 论文解读

