---
title: Linux环境配置
author: 阿源
date: 2023/11/22 12:00
categories:
 - 个人项目
tags:
 - 个人项目
 - ROS
---

## Linux环境配置

## 1. Linux软件配置

### 1.1 基础安装

```sh
sudo cp /etc/apt/sources.list /etc/apt/sources.list.bak
sudo vim /etc/apt/sources.list
# ubuntu18
deb http://mirrors.aliyun.com/ubuntu/ bionic main restricted universe multiverse
deb http://mirrors.aliyun.com/ubuntu/ bionic-security main restricted universe multiverse
deb http://mirrors.aliyun.com/ubuntu/ bionic-updates main restricted universe multiverse
deb http://mirrors.aliyun.com/ubuntu/ bionic-proposed main restricted universe multiverse
deb http://mirrors.aliyun.com/ubuntu/ bionic-backports main restricted universe multiverse
deb-src http://mirrors.aliyun.com/ubuntu/ bionic main restricted universe multiverse
deb-src http://mirrors.aliyun.com/ubuntu/ bionic-security main restricted universe multiverse
deb-src http://mirrors.aliyun.com/ubuntu/ bionic-updates main restricted universe multiverse
deb-src http://mirrors.aliyun.com/ubuntu/ bionic-proposed main restricted universe multiverse
deb-src http://mirrors.aliyun.com/ubuntu/ bionic-backports main restricted universe multiverse
```
```sh
E: Could not get lock /var/lib/dpkg/lock-frontend - open (11: Resource temporarily unavailable)

sudo rm /var/lib/apt/lists/lock
sudo rm /var/cache/apt/archives/lock
sudo rm /var/lib/dpkg/lock*

sudo dpkg --configure -a
sudo apt update
```
```sh
sudo apt-get install fcitx-googlepinyin  net-tools  openssh-server  terminator  gnome-tweaks
sudo apt remove fcitx-module-kimpanel
sudo apt-get install libgoogle-glog-dev libgflags-dev libatlas-base-dev libeigen3-dev libsuitesparse-dev

sudo apt-get install -y \
    g++ \
    git \
    google-mock \
    libboost-all-dev \
    libcairo2-dev \
    libeigen3-dev \
    libgflags-dev \
    libgoogle-glog-dev \
    liblua5.2-dev \
    libsuitesparse-dev \
    libwebp-dev \
    ninja-build \
    protobuf-compiler \
    python-sphinx
```

```sh
wget https://cmake.org/files/v3.22/cmake-3.22.1.tar.gz

tar -xvzf cmake-3.22.1.tar.gz

修改CMakeLists.txt，在其中添加set(CMAKE_USE_OPENSSL OFF)
./configure

sudo make -j8

sudo make install -j8

sudo update-alternatives --install /usr/bin/cmake cmake /usr/local/bin/cmake 1 --force

cmake --version
```

### 1.2 Ros相关

```sh
sudo sh -c 'echo "deb http://packages.ros.org/ros/ubuntu $(lsb_release -sc) main" > /etc/apt/sources.list.d/ros-latest.list'
```

```sh
sudo sh -c '. /etc/lsb-release && echo "deb http://mirrors.tuna.tsinghua.edu.cn/ros/ubuntu/ `lsb_release -cs` main" > /etc/apt/sources.list.d/ros-latest.list'

sudo apt-key adv --keyserver 'hkp://keyserver.ubuntu.com:80' --recv-key C1CF6E31E6BADE8868B172B4F42ED6FBAB17C654

sudo apt-get update 

sudo apt-get install ros-melodic-desktop-full
sudo apt-get install ros-noetic-desktop-full

sudo apt install python-rosdep python-rosinstall python-rosinstall-generator python-wstool build-essential

sudo apt install python3-rosdep python3-rosinstall python3-rosinstall-generator python3-wstool build-essential

sudo rosdep init
rosdep update

echo "source /opt/ros/melodic/setup.bash" >> ~/.bashrc
echo "source /opt/ros/noetic/setup.bash" >> ~/.bashrc
source ~/.bashrc
```


```sh
rosdep install --from-paths src --ignore-src --rosdistro=melodic -y
rosdep install --from-paths src --ignore-src --rosdistro=noetic -y
# 这一步会有一些包没有下载完需要反复根据提示下载 知道sucessful
# 注意！如果提示是std_msgs  那么为ros-melodic-std-msgs 
sudo apt-get install ros-melodic-提示的东西
```

#### 1.2.1 cv_brige替换

错误说明：https://github.com/ros-perception/vision_opencv/issues/345

Project 'image_geometry' specifies '/usr/include/opencv' as an include dir

#### 1.2.2 gazebo升级

ubuntu18最好还是不要升级到gazebo11

古月居教程：https://www.guyuehome.com/34875

```sh
dpkg -l | grep gazebo
```

```sh
sudo apt-get remove gazebo9 gazebo9-common gazebo9-plugin-base libgazebo9:amd64 libgazebo9-dev:amd64 ros-melodic-gazebo-* 
```

```sh
sudo apt-get purge gazebo9 gazebo9-common gazebo9-plugin-base libgazebo9:amd64 libgazebo9-dev:amd64 ros-melodic-gazebo-* 
```

```sh
sudo sh -c 'echo "deb http://packages.osrfoundation.org/gazebo/ubuntu-stable `lsb_release -cs` main" > /etc/apt/sources.list.d/gazebo-stable.list'
wget https://packages.osrfoundation.org/gazebo.key -O - | sudo apt-key add -
sudo apt-get update
sudo apt-get install gazebo11
sudo apt-get install libgazebo11-dev
sudo apt install ros-melodic-gazebo11-*
```

```sh
sudo apt-get remove gazebo11 gazebo11-common gazebo11-plugin-base libgazebo11:amd64 libgazebo11-dev:amd64 ros-melodic-gazebo-* 
sudo apt-get purge gazebo11 gazebo11-common gazebo11-plugin-base libgazebo11:amd64 libgazebo11-dev:amd64 ros-melodic-gazebo-* 
sudo apt-get install gazebo9 libgazebo9-dev ros-melodic-gazebo9-*
```

#### 1.3 gazebo模型

一键下载gazebo模型

```sh
cd ~/.gazebo && wget https://gitee.com/ohhuo/scripts/raw/master/gazebo_model.py -O gazebo_model.py && python3 gazebo_model.py
```


### 1.4 PCL库

```SH
sudo apt-get install libpcl-dev pcl-tools libproj-dev
```

### 1.5 Eigen

如果Linux的Cmake找不到eigen的话  那就是软链接的问题

```sh
sudo ln -s /usr/include/eigen3/Eigen 	/usr/include/Eigen
sudo ln -s /usr/include/eigen3/unsupported 	/usr/include/unsupported
```

### 1.6 英特尔相机

```sh
sudo apt install ros-melodic-ddynamic-reconfigure ros-melodic-realsense2-camera ros-melodic-realsense2-description git libssl-dev libusb-1.0-0-dev pkg-config libgtk-3-dev libglfw3-dev

git clone https://github.com/IntelRealSense/librealsense.git -b v2.50.0 
cd librealsense
./scripts/setup_udev_rules.sh
mkdir build && cd build
cmake ..
sudo make -j8
sudo make install
```

检查目录`/etc/udev/rules.d/`下是否有`99-realsense-libusb.rules`，然后重启

```
##Version=1.1##
# Device rules for Intel RealSense devices (R200, F200, SR300 LR200, ZR300, D400, L500, T200)
SUBSYSTEMS=="usb", ATTRS{idVendor}=="8086", ATTRS{idProduct}=="0a80", MODE:="0666", GROUP:="plugdev", RUN+="/usr/local/bin/usb-R200-in_udev"
SUBSYSTEMS=="usb", ATTRS{idVendor}=="8086", ATTRS{idProduct}=="0a66", MODE:="0666", GROUP:="plugdev"
SUBSYSTEMS=="usb", ATTRS{idVendor}=="8086", ATTRS{idProduct}=="0aa5", MODE:="0666", GROUP:="plugdev"
SUBSYSTEMS=="usb", ATTRS{idVendor}=="8086", ATTRS{idProduct}=="0abf", MODE:="0666", GROUP:="plugdev"
SUBSYSTEMS=="usb", ATTRS{idVendor}=="8086", ATTRS{idProduct}=="0acb", MODE:="0666", GROUP:="plugdev"
SUBSYSTEMS=="usb", ATTRS{idVendor}=="8086", ATTRS{idProduct}=="0ad0", MODE:="0666", GROUP:="plugdev"
SUBSYSTEMS=="usb", ATTRS{idVendor}=="8086", ATTRS{idProduct}=="04b4", MODE:="0666", GROUP:="plugdev"
SUBSYSTEMS=="usb", ATTRS{idVendor}=="8086", ATTRS{idProduct}=="0ad1", MODE:="0666", GROUP:="plugdev"
SUBSYSTEMS=="usb", ATTRS{idVendor}=="8086", ATTRS{idProduct}=="0ad2", MODE:="0666", GROUP:="plugdev"
SUBSYSTEMS=="usb", ATTRS{idVendor}=="8086", ATTRS{idProduct}=="0ad3", MODE:="0666", GROUP:="plugdev"
SUBSYSTEMS=="usb", ATTRS{idVendor}=="8086", ATTRS{idProduct}=="0ad4", MODE:="0666", GROUP:="plugdev"
SUBSYSTEMS=="usb", ATTRS{idVendor}=="8086", ATTRS{idProduct}=="0ad5", MODE:="0666", GROUP:="plugdev"
SUBSYSTEMS=="usb", ATTRS{idVendor}=="8086", ATTRS{idProduct}=="0ad6", MODE:="0666", GROUP:="plugdev"
SUBSYSTEMS=="usb", ATTRS{idVendor}=="8086", ATTRS{idProduct}=="0af2", MODE:="0666", GROUP:="plugdev"
SUBSYSTEMS=="usb", ATTRS{idVendor}=="8086", ATTRS{idProduct}=="0af6", MODE:="0666", GROUP:="plugdev"
SUBSYSTEMS=="usb", ATTRS{idVendor}=="8086", ATTRS{idProduct}=="0afe", MODE:="0666", GROUP:="plugdev"
SUBSYSTEMS=="usb", ATTRS{idVendor}=="8086", ATTRS{idProduct}=="0aff", MODE:="0666", GROUP:="plugdev"
SUBSYSTEMS=="usb", ATTRS{idVendor}=="8086", ATTRS{idProduct}=="0b00", MODE:="0666", GROUP:="plugdev"
SUBSYSTEMS=="usb", ATTRS{idVendor}=="8086", ATTRS{idProduct}=="0b01", MODE:="0666", GROUP:="plugdev"
SUBSYSTEMS=="usb", ATTRS{idVendor}=="8086", ATTRS{idProduct}=="0b03", MODE:="0666", GROUP:="plugdev"
SUBSYSTEMS=="usb", ATTRS{idVendor}=="8086", ATTRS{idProduct}=="0b07", MODE:="0666", GROUP:="plugdev"
SUBSYSTEMS=="usb", ATTRS{idVendor}=="8086", ATTRS{idProduct}=="0b0c", MODE:="0666", GROUP:="plugdev"
SUBSYSTEMS=="usb", ATTRS{idVendor}=="8086", ATTRS{idProduct}=="0b0d", MODE:="0666", GROUP:="plugdev"
SUBSYSTEMS=="usb", ATTRS{idVendor}=="8086", ATTRS{idProduct}=="0b3a", MODE:="0666", GROUP:="plugdev"
SUBSYSTEMS=="usb", ATTRS{idVendor}=="8086", ATTRS{idProduct}=="0b3d", MODE:="0666", GROUP:="plugdev"
SUBSYSTEMS=="usb", ATTRS{idVendor}=="8086", ATTRS{idProduct}=="0b48", MODE:="0666", GROUP:="plugdev"
SUBSYSTEMS=="usb", ATTRS{idVendor}=="8086", ATTRS{idProduct}=="0b49", MODE:="0666", GROUP:="plugdev"
SUBSYSTEMS=="usb", ATTRS{idVendor}=="8086", ATTRS{idProduct}=="0b4b", MODE:="0666", GROUP:="plugdev"
SUBSYSTEMS=="usb", ATTRS{idVendor}=="8086", ATTRS{idProduct}=="0b4d", MODE:="0666", GROUP:="plugdev"
SUBSYSTEMS=="usb", ATTRS{idVendor}=="8086", ATTRS{idProduct}=="0b52", MODE:="0666", GROUP:="plugdev"
SUBSYSTEMS=="usb", ATTRS{idVendor}=="8086", ATTRS{idProduct}=="0b5b", MODE:="0666", GROUP:="plugdev"
SUBSYSTEMS=="usb", ATTRS{idVendor}=="8086", ATTRS{idProduct}=="0b5c", MODE:="0666", GROUP:="plugdev"
SUBSYSTEMS=="usb", ATTRS{idVendor}=="8086", ATTRS{idProduct}=="0b64", MODE:="0666", GROUP:="plugdev"

# Intel RealSense recovery devices (DFU)
SUBSYSTEMS=="usb", ATTRS{idVendor}=="8086", ATTRS{idProduct}=="0ab3", MODE:="0666", GROUP:="plugdev"
SUBSYSTEMS=="usb", ATTRS{idVendor}=="8086", ATTRS{idProduct}=="0adb", MODE:="0666", GROUP:="plugdev"
SUBSYSTEMS=="usb", ATTRS{idVendor}=="8086", ATTRS{idProduct}=="0adc", MODE:="0666", GROUP:="plugdev"
SUBSYSTEMS=="usb", ATTRS{idVendor}=="8086", ATTRS{idProduct}=="0b55", MODE:="0666", GROUP:="plugdev"

# Intel RealSense devices (Movidius, T265)
SUBSYSTEMS=="usb", ENV{DEVTYPE}=="usb_device", ATTRS{idVendor}=="8087", ATTRS{idProduct}=="0af3", MODE="0666", GROUP="plugdev"
SUBSYSTEMS=="usb", ENV{DEVTYPE}=="usb_device", ATTRS{idVendor}=="8087", ATTRS{idProduct}=="0b37", MODE="0666", GROUP="plugdev"
SUBSYSTEMS=="usb", ENV{DEVTYPE}=="usb_device", ATTRS{idVendor}=="03e7", ATTRS{idProduct}=="2150", MODE="0666", GROUP="plugdev"

KERNEL=="iio*", ATTRS{idVendor}=="8086", ATTRS{idProduct}=="0ad5", MODE:="0777", GROUP:="plugdev", RUN+="/bin/sh -c 'chmod -R 0777 /sys/%p'"
DRIVER=="hid_sensor_custom", ATTRS{idVendor}=="8086", ATTRS{idProduct}=="0ad5", RUN+="/bin/sh -c 'chmod -R 0777 /sys/%p && chmod 0777 /dev/%k'"
KERNEL=="iio*", ATTRS{idVendor}=="8086", ATTRS{idProduct}=="0af2", MODE:="0777", GROUP:="plugdev", RUN+="/bin/sh -c 'chmod -R 0777 /sys/%p'"
DRIVER=="hid_sensor*", ATTRS{idVendor}=="8086", ATTRS{idProduct}=="0af2", RUN+="/bin/sh -c 'chmod -R 0777 /sys/%p && chmod 0777 /dev/%k'"
KERNEL=="iio*", ATTRS{idVendor}=="8086", ATTRS{idProduct}=="0afe", MODE:="0777", GROUP:="plugdev", RUN+="/bin/sh -c 'chmod -R 0777 /sys/%p'"
DRIVER=="hid_sensor_custom", ATTRS{idVendor}=="8086", ATTRS{idProduct}=="0afe", RUN+="/bin/sh -c 'chmod -R 0777 /sys/%p && chmod 0777 /dev/%k'"
KERNEL=="iio*", ATTRS{idVendor}=="8086", ATTRS{idProduct}=="0aff", MODE:="0777", GROUP:="plugdev", RUN+="/bin/sh -c 'chmod -R 0777 /sys/%p'"
DRIVER=="hid_sensor_custom", ATTRS{idVendor}=="8086", ATTRS{idProduct}=="0aff", RUN+="/bin/sh -c 'chmod -R 0777 /sys/%p && chmod 0777 /dev/%k'"
KERNEL=="iio*", ATTRS{idVendor}=="8086", ATTRS{idProduct}=="0b00", MODE:="0777", GROUP:="plugdev", RUN+="/bin/sh -c 'chmod -R 0777 /sys/%p'"
DRIVER=="hid_sensor_custom", ATTRS{idVendor}=="8086", ATTRS{idProduct}=="0b00", RUN+="/bin/sh -c 'chmod -R 0777 /sys/%p && chmod 0777 /dev/%k'"
KERNEL=="iio*", ATTRS{idVendor}=="8086", ATTRS{idProduct}=="0b01", MODE:="0777", GROUP:="plugdev", RUN+="/bin/sh -c 'chmod -R 0777 /sys/%p'"
DRIVER=="hid_sensor_custom", ATTRS{idVendor}=="8086", ATTRS{idProduct}=="0b01", RUN+="/bin/sh -c 'chmod -R 0777 /sys/%p && chmod 0777 /dev/%k'"
KERNEL=="iio*", ATTRS{idVendor}=="8086", ATTRS{idProduct}=="0b3a", MODE:="0777", GROUP:="plugdev", RUN+="/bin/sh -c 'chmod -R 0777 /sys/%p'"
DRIVER=="hid_sensor*", ATTRS{idVendor}=="8086", ATTRS{idProduct}=="0b3a", RUN+="/bin/sh -c ' chmod -R 0777 /sys/%p && chmod 0777 /dev/%k'"
KERNEL=="iio*", ATTRS{idVendor}=="8086", ATTRS{idProduct}=="0b3d", MODE:="0777", GROUP:="plugdev", RUN+="/bin/sh -c 'chmod -R 0777 /sys/%p'"
DRIVER=="hid_sensor*", ATTRS{idVendor}=="8086", ATTRS{idProduct}=="0b3d", RUN+="/bin/sh -c ' chmod -R 0777 /sys/%p && chmod 0777 /dev/%k'"
KERNEL=="iio*", ATTRS{idVendor}=="8086", ATTRS{idProduct}=="0b4b", MODE:="0777", GROUP:="plugdev", RUN+="/bin/sh -c 'chmod -R 0777 /sys/%p'"
DRIVER=="hid_sensor*", ATTRS{idVendor}=="8086", ATTRS{idProduct}=="0b4b", RUN+="/bin/sh -c ' chmod -R 0777 /sys/%p && chmod 0777 /dev/%k'"
KERNEL=="iio*", ATTRS{idVendor}=="8086", ATTRS{idProduct}=="0b4d", MODE:="0777", GROUP:="plugdev", RUN+="/bin/sh -c 'chmod -R 0777 /sys/%p'"
DRIVER=="hid_sensor*", ATTRS{idVendor}=="8086", ATTRS{idProduct}=="0b4d", RUN+="/bin/sh -c ' chmod -R 0777 /sys/%p && chmod 0777 /dev/%k'"
KERNEL=="iio*", ATTRS{idVendor}=="8086", ATTRS{idProduct}=="0b5b", MODE:="0777", GROUP:="plugdev", RUN+="/bin/sh -c 'chmod -R 0777 /sys/%p'"
DRIVER=="hid_sensor*", ATTRS{idVendor}=="8086", ATTRS{idProduct}=="0b5b", RUN+="/bin/sh -c ' chmod -R 0777 /sys/%p && chmod 0777 /dev/%k'"
KERNEL=="iio*", ATTRS{idVendor}=="8086", ATTRS{idProduct}=="0b5c", MODE:="0777", GROUP:="plugdev", RUN+="/bin/sh -c 'chmod -R 0777 /sys/%p'"
DRIVER=="hid_sensor*", ATTRS{idVendor}=="8086", ATTRS{idProduct}=="0b5c", RUN+="/bin/sh -c ' chmod -R 0777 /sys/%p && chmod 0777 /dev/%k'"
KERNEL=="iio*", ATTRS{idVendor}=="8086", ATTRS{idProduct}=="0b64", MODE:="0777", GROUP:="plugdev", RUN+="/bin/sh -c 'chmod -R 0777 /sys/%p'"
DRIVER=="hid_sensor*", ATTRS{idVendor}=="8086", ATTRS{idProduct}=="0b64", RUN+="/bin/sh -c ' chmod -R 0777 /sys/%p && chmod 0777 /dev/%k'"
```



### 1.7 python

```sh
1）初始化：
#更新软件源
sudo apt-get update
sudo apt-get upgrade
#安装python3和pip3
sudo apt-get install python3-dev
sudo apt-get install python3-pip
pip3 install --upgrade pip
#换源
mkdir ~/.pip
vim ~/.pip/pip.conf
#添加下面内容，清华镜像源
[global]
index-url = https://pypi.tuna.tsinghua.edu.cn/simple
[install]
trusted-host = https://pypi.tuna.tsinghua.edu.cn
```

### 1.8 opencv

### 1.9 osqp

```sh
git clone --recursive -b release-0.6.3 https://github.com/oxfordcontrol/osqp.git

git clone https://github.com/robotology/osqp-eigen.git
```



## 2. 实用开源项目

### 2.1 Cartographer

在ubuntu18中protobuf与gazebo冲突问题：https://zhuanlan.zhihu.com/p/573559407

```sh
git clone https://github.com/google/protobuf.git
cd protobuf

##### 2. 修改protobuf版本为v3.4.1,安装时会自动安装3.4.0
git checkout tags/v3.4.1
git checkout -b v3.4.1

# 如果这一步报错“Google Mock not present.  Fetching gmock-1.7.0 from the web..../autogen.sh: 34: ./autogen.sh: curl: not found ”
# 需要安装一个依赖包 curl
# sudo apt  install curl
./autogen.sh

##### 3. 修改安装路径 
# ./configure --prefix=/home/yours/local_install/google/protocbuff/ #yours是你对你计算机取的名字
#【下面不同用户名是我为了方便配环境自己加的，修改为自己的用户名运行一个即可】
./configure --prefix=/home/ros/software/local_install/google/protocbuff/ # ros
./configure --prefix=/home/pzz/local_install/google/protocbuff/ # pzz 

##### 4. 编译protobuf源码
make -j8

##### 5.安装protobuf3.4.0
make install
```

```sh
######################################
#### 编译PX4时，将如下内容注释掉，编译cartographer时，将如下内容打开 
####### add protobuf lib path ########/home/scout/local_install/lib
export PATH=/home/ros/software/local_install/google/protocbuff/bin/:$PATH
#(动态库搜索路径) 程序加载运行期间查找动态链接库时指定除了系统默认路径之外的其他路径
export LD_LIBRARY_PATH=$LD_LIBRARY_PATH:/home/ros/software/local_install/google/protocbuff/lib/
#(静态库搜索路径) 程序编译期间查找动态链接库时指定查找共享库的路径
export LIBRARY_PATH=$LIBRARY_PATH:/home/ros/software/local_install/google/protocbuff/lib/
#执行程序搜索路径
export PATH=$PATH:/home/ros/software/local_install/google/protocbuff/bin/
#c程序头文件搜索路径
export C_INCLUDE_PATH=$C_INCLUDE_PATH:/home/ros/software/local_install/google/protocbuff/include/
#c++程序头文件搜索路径
export CPLUS_INCLUDE_PATH=$CPLUS_INCLUDE_PATH:/home/ros/software/local_install/google/protocbuff/include/
#pkg-config 路径
export PKG_CONFIG_PATH=/home/ros/software/local_install/google/protocbuff/lib/pkgconfig/
######################################
```

```sh
cd cartographer_detailed_comments_ws/src/cartographer
# 修改
gedit CMakeLists.txt 
# 记得修改为自己的用户名 
############## this is for protocol version
###################################################
INCLUDE_DIRECTORIES(/home/ros/software/local_install/google/protocbuff/include/)
LINK_DIRECTORIES(/home/ros/software/local_install/google/protocbuff/lib/)
###################################################
```

### 2.2 patchwork   

pgm_map_creator

```sh
sudo apt-get install ros-melodic-jsk-recognition  ros-melodic-jsk-common-msgs  ros-melodic-jsk-rviz-plugins
```

### 2.2 mpc_ros

项目地址：https://github.com/Geonhee-LEE/mpc_ros

```sh
sudo apt install ros-melodic-costmap-2d \
ros-melodic-move-base \
ros-melodic-global-planner \
ros-melodic-amcl
```

下载ipopt

https://github.com/Geonhee-LEE/mpc_ros/tree/melodic/assets/document/ipopt_install

然后再双击进入Mumps，再打开get.Mumps，把第31行的地址更换成以下地址：

```sh
wgetcmd http://graal.ens-lyon.fr/MUMPS/MUMPS_${mumps_ver}.tar.gz
```

### 2.3 ros_motion_planning

https://github.com/ai-winter/ros_motion_planning?tab=readme-ov-file

```sh
git clone -b release-0.6.3 --recursive https://github.com/oxfordcontrol/osqp
cd osqp && mkdir build && cd build
cmake .. -DBUILD_SHARED_LIBS=ON
make -j6
sudo make install
sudo cp /usr/local/include/osqp/* /usr/local/include

git clone https://github.com/robotology/osqp-eigen.git
cd osqp-eigen && mkdir build && cd build
cmake ..
make
sudo make install
```

```sh
sudo apt install python-is-python3 \
ros-melodic-amcl \
ros-melodic-base-local-planner \
ros-melodic-map-server \
ros-melodic-move-base \
ros-melodic-navfn
```

## 3. Cartographer配置

a) 在只使用激光雷达的时候(tracking_frame="laser,publish_frame="laser")

b) 使用里程计+激光雷达时(tracking_frame="base_link", publish_frame="odom")

c)  使用IMU+激光+里程计时(tracking_frame="imu_link", publish_frame="odom")

### 3.1 2D激光小车

```lua
include "map_builder.lua"
include "trajectory_builder.lua"

options = {
  map_builder = MAP_BUILDER,                -- map_builder.lua的配置信息
  trajectory_builder = TRAJECTORY_BUILDER,  -- trajectory_builder.lua的配置信息
  
  map_frame = "map",                        -- 地图坐标系的名字
  --tracking_frame 有 imu 的 link 就设置成 imu 的 link, 没有就设置成 base_link
  tracking_frame = "base_footprint",        -- 将所有传感器数据转换到这个坐标系下
  -- 发布的 tf 的最下边一个坐标系, 就是 bag 文件中 tf树的最上边的一个坐标系
  published_frame = "base_footprint",       -- tf: map -> footprint
  odom_frame = "odom_combined",             -- 里程计的坐标系名字
  provide_odom_frame = true,                -- 是否提供odom的tf, 如果为true,则tf树为map->odom->footprint
                                            -- 如果为false tf树为map->footprint
  publish_frame_projected_to_2d = false,    -- 是否将坐标系投影到平面上
  --use_pose_extrapolator = false,            -- 发布tf时是使用pose_extrapolator的位姿还是前端计算出来的位姿

  use_odometry = true,                     -- 是否使用里程计,如果使用要求一定要有odom的tf
  use_nav_sat = false,                      -- 是否使用gps
  use_landmarks = false,                    -- 是否使用landmark
  num_laser_scans = 1,                      -- 是否使用单线激光数据
  num_multi_echo_laser_scans = 0,           -- 是否使用multi_echo_laser_scans数据
  num_subdivisions_per_laser_scan = 1,      -- 1帧数据被分成几次处理,一般为1
  num_point_clouds = 0,                     -- 是否使用点云数据
  
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

TRAJECTORY_BUILDER_2D.use_imu_data = false   -- 设置IMU数据
TRAJECTORY_BUILDER_2D.min_range = 0.1   --雷达的最大最小距离，根据雷达硬件设定
TRAJECTORY_BUILDER_2D.max_range = 18.  --雷达的最大最小距离，根据雷达硬件设定
-- TRAJECTORY_BUILDER_2D.min_z = 0.2  --使用多点高以上的点云，单线的时候不要设置，多线防止打到地面上的点干扰建图
--TRAJECTORY_BUILDER_2D.max_z = 1.4
--TRAJECTORY_BUILDER_2D.voxel_filter_size = 0.02

--TRAJECTORY_BUILDER_2D.adaptive_voxel_filter.max_length = 0.5
--TRAJECTORY_BUILDER_2D.adaptive_voxel_filter.min_num_points = 200.
--TRAJECTORY_BUILDER_2D.adaptive_voxel_filter.max_range = 50.

--TRAJECTORY_BUILDER_2D.loop_closure_adaptive_voxel_filter.max_length = 0.9
--TRAJECTORY_BUILDER_2D.loop_closure_adaptive_voxel_filter.min_num_points = 100
--TRAJECTORY_BUILDER_2D.loop_closure_adaptive_voxel_filter.max_range = 50.
-- 这个参数用于指定在传感器数据中缺失时，算法应该考虑的最大距离
TRAJECTORY_BUILDER_2D.missing_data_ray_length = 1.
-- 通过在传感器数据中搜索相关的特征来进行实时的定位和地图构建  仿真的时候不用开
TRAJECTORY_BUILDER_2D.use_online_correlative_scan_matching = true
-- 指定在线实时相关扫描匹配器的线性搜索窗口大小
TRAJECTORY_BUILDER_2D.real_time_correlative_scan_matcher.linear_search_window = 0.1
-- 指定在线实时相关扫描匹配器中平移变化成本的权重
TRAJECTORY_BUILDER_2D.real_time_correlative_scan_matcher.translation_delta_cost_weight = 10.
-- 指定在线实时相关扫描匹配器中旋转变化成本的权重
TRAJECTORY_BUILDER_2D.real_time_correlative_scan_matcher.rotation_delta_cost_weight = 1e-1

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

TRAJECTORY_BUILDER_2D.submaps.num_range_data = 35.  --一个子图插入多少个节点，根据laser和运动速度进行具体的调整
TRAJECTORY_BUILDER_2D.submaps.grid_options_2d.resolution = 0.1

POSE_GRAPH.optimize_every_n_nodes = 70.   -- 2倍的num_range_data以上
POSE_GRAPH.constraint_builder.sampling_ratio = 0.3   -- 如果添加的约束与潜在约束的比例低于此比例,则将添加约束
POSE_GRAPH.constraint_builder.max_constraint_distance = 15. -- 在子图附近考虑姿势的阈值,大于这个值将被略过
POSE_GRAPH.optimization_problem.huber_scale = 1e2 -- 用于指定Huber损失函数中的尺度参数
-- 回环检测阈值，如果不稳定有错误匹配，可以提高这两个值，场景重复可以降低或者关闭回环
POSE_GRAPH.constraint_builder.min_score = 0.65
POSE_GRAPH.constraint_builder.global_localization_min_score = 0.60

return options
```

```
<!--
  Copyright 2016 The Cartographer Authors

  Licensed under the Apache License, Version 2.0 (the "License");
  you may not use this file except in compliance with the License.
  You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

  Unless required by applicable law or agreed to in writing, software
  distributed under the License is distributed on an "AS IS" BASIS,
  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  See the License for the specific language governing permissions and
  limitations under the License.
-->

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
    <remap from="points2" to="rslidar_points" />
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

```rviz

```

## 报错合集

 
