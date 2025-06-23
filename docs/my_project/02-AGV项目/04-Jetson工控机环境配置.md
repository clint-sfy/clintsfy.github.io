---
title: Jetson工控机环境配置
author: 阿源
date: 2024/4/22 12:00
categories:
 - 个人项目
tags:
 - 个人项目
 - ROS
---

# Jetson工控机环境配置

本人使用的Jetson版本为Jetson TX2NX  操作系统ubuntu18

jetson分辨率问题

```sh
xrandr --fb 1920x1080
```

## 1. 初始化

### 1.1 烧录Jetpack

版本选择 Jetpack4.6  Opencv4.5.3 Python3.6.9

### 1.2 增加内存



### 1.3 增加 swap空间

```sh
#新增swapfile文件大小自定义
sudo fallocate -l 8G /var/swapfile
#配置该文件的权限
sudo chmod 600 /var/swapfile
#建立交换分区
sudo mkswap /var/swapfile
#启用交换分区
sudo swapon /var/swapfile

sudo bash -c 'echo "/var/swapfile swap swap defaults 0 0" >> /etc/fstab'
```

```sh
# 删除
sudo vi /etc/fstab
#/var/swapfile swap swap defaults 0 0
sudo reboot
sudo rm -rf /var/swapfile 
```

### 1.4 开启战斗模式

```sh
sudo nvpmodel -m 0
```

https://forums.developer.nvidia.com/t/two-cores-disabled/48637/19

TX2 最大性能模式两个内核不工作

```sh
# 可以解决，只是我的情况是使用ssd扩展的，导致需要修改两个文件：
sudo find / -name "extlinux.conf"
#我的显示
#/boot/extlinux/extlinux.conf
#/media/tx2nx/02742802-5576-479c-8dec-5bec58ed6925/boot/extlinux/extlinux.conf
```

两个文件都要修改，isolcpus=不存在的[cpu]

```sh
isolcpus=9
#或者
isolcpus=
```

### 1.5 禁用内核更新

之前和大佬学习AI的时候，apt update把板子内核更了，很多之前烧的东西因为版本适配问题用不了，无奈自己水平太菜只能SDK manager 重新烧，后面大佬说了一下禁更内核的方法，是以为记录。

```sh
cd ./etc/apt/sources.list.d
mv nvidia-l4t-apt-source.list  mynvidia.list
```

小伙伴们接下来就可以愉快的

```sh
sudo apt update
sudo apt upgrade 
```

## 2. 基础安装

### 2.1 输入法安装

arm只支持googlepinyin，不支持sunpingyin

```SH
sudo apt-get install fcitx-googlepinyin  net-tools  openssh-server  terminator
```

[Ubuntu安装Fcitx以及Fcitx输入中文不显示候选词框的解决办法]

```sh
sudo apt remove fcitx-module-kimpanel
```

### 2.2 jtop

jtop可以查看开发板的cpu，gpu以及内存和系统版本号，是一个很好用的工具相当于x86系统下的nvidia-msi，在这里下载主要是为了查看opencv的版本以及CUDA状态。

```sh
sudo apt install python3-pip
sudo -H pip3 install -U jetson-stats
sudo systemctl restart jetson_stats.service
sudo reboot
```

### 2.3 opencv

卸载旧版本opencv

```sh
sudo apt-get purge libopencv*
sudo apt autoremove
sudo apt-get update
```

安装依赖库

```sh
sudo apt install -y build-essential checkinstall cmake pkg-config yasm git gfortran
sudo apt install -y libgstreamer1.0-dev libgstreamer-plugins-base1.0-dev
sudo apt install -y libjpeg8-dev libjasper-dev libpng12-dev libtiff5-dev libavcodec-dev libavformat-dev libswscale-dev libdc1394-22-dev libxine2-dev libv4l-dev
sudo apt install -y libgstreamer1.0-dev libgstreamer-plugins-base1.0-dev libgtk2.0-dev libtbb-dev libatlas-base-dev libfaac-dev libmp3lame-dev libtheora-dev libvorbis-dev libxvidcore-dev libopencore-amrnb-dev libopencore-amrwb-dev x264 v4l-utils
sudo apt install python-dev python-numpy libtbb2 libtbb-dev libjpeg-dev libpng-dev libtiff-dev libjasper-dev libdc1394-22-dev
```

获取opencv 和 opencv_contrib源码并编译

地址1：https://github.com/opencv/opencv/

地址2：https://github.com/opencv/opencv_contrib/
```sh
cd opencv-4.5.3
mkdir build
cd build
```

```sh
cmake \
-DCMAKE_BUILD_TYPE=Release \
-DCMAKE_INSTALL_PREFIX=/usr/local \
-DOPENCV_ENABLE_NONFREE=1 \
-DBUILD_opencv_python2=1 \
-DBUILD_opencv_python3=1 \
-DWITH_FFMPEG=1 \
-DCUDA_TOOLKIT_ROOT_DIR=/usr/local/cuda \
-DCUDA_ARCH_BIN=6.2 \
-DCUDA_ARCH_PTX=6.2 \
-DWITH_CUDA=1 \
-DWITH_CUDNN=ON \
-DENABLE_FAST_MATH=1 \
-DCUDA_FAST_MATH=1 \
-DWITH_CUBLAS=1 \
-DOPENCV_GENERATE_PKGCONFIG=1 \
-DOPENCV_EXTRA_MODULES_PATH=../opencv_contrib-4.5.3/modules \
..
```

注意DOPENCV_EXTRA_MODULES_PATH需要改成自己的路径，DCUDA_ARCH_BIN以及DCUDA_ARCH_PTX后面的数字如果是其他的tx2开发板需要改成对应的数字,在jtop面板中的INFO面板可以查看，6.2表示jetson tx2

```sh
sudo make -j6(六核编译)
sudo make install
```

```sh
python3
import cv2
cv2.__version__
```

### 2.4 Ros

```sh
sudo sh -c 'echo "deb http://packages.ros.org/ros/ubuntu $(lsb_release -sc) main" > /etc/apt/sources.list.d/ros-latest.list'

sudo apt-key adv --keyserver 'hkp://keyserver.ubuntu.com:80' --recv-key C1CF6E31E6BADE8868B172B4F42ED6FBAB17C654
```

```sh
sudo apt update
```

```sh
sudo apt install ros-melodic-desktop-full
```

```sh
echo "source /opt/ros/melodic/setup.bash" >> ~/.bashrc
source ~/.bashrc
```

```sh
sudo apt install python-rosdep python-rosinstall python-rosinstall-generator python-wstool build-essential
```

```sh
sudo rosdep init
rosdep update
```

```sh
rosdep install --from-paths src --ignore-src --rosdistro=melodic -y
# 这一步会有一些包没有下载完需要反复根据提示下载 知道sucessful
# 注意！如果提示是std_msgs  那么为ros-melodic-std-msgs 
sudo apt-get install ros-melodic-提示的东西
```

#### 小问题

- **问题2:**[Err] [REST.cc:205] Error in REST request

  **解决:**`sudo gedit ~/.ignition/fuel/config.yaml`

  然后将`url : https://api.ignitionfuel.org`使用 # 注释

  再添加`url: https://api.ignitionrobotics.org`

- **问题3:**启动时抛出异常:`[gazebo-2] process has died [pid xxx, exit code 255, cmd.....`

  **解决:**`killall gzserver`和`killall gzclient`

#### 2.4.1 cv_brige替换

https://github.com/ros-perception/vision_opencv/issues/345
Project 'image_geometry' specifies '/usr/include/opencv' as an include dir

#### 2.4.2 gazebo升级

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

### 2.5 安装conda

因为jetson [tx2](https://so.csdn.net/so/search?q=tx2&spm=1001.2101.3001.7020) 是aarch架构所以Anaconda在tx2上使用不了，只能使用archiconda

下载地址：https://github.com/Archiconda/build-tools/releases

```sh
sudo chmod 777 Archiconda3-0.2.3-Linux-aarch64.sh
./Archiconda3-0.2.3-Linux-aarch64.sh
```

```sh
gedit ~/.bashrc
export PATH=~/home/anaconda3/bin:$PATH ####加在最后一行

source ~/.bashrc
```

```sh
conda activate base
```



## 3. D435i相机

### 3.1 相机驱动安装

https://github.com/IntelRealSense/librealsense/issues/11391

下载的版本一定要记住，在后续的安装中有用。如果通过命令下不下来建议直接去网页下载，也更方便选择版本，下载的是2.50.0版本，一定选择此版本

```sh
git clone https://github.com/IntelRealSense/librealsense.git
```
注意：这里的jetpack版本一定要 <= 4.6，否则你的补丁打不上
```sh
cd librealsense
./scripts/patch-realsense-ubuntu-L4T.sh  
```

```sh
sudo apt-get install git libssl-dev libusb-1.0-0-dev pkg-config libgtk-3-dev -y
./scripts/setup_udev_rules.sh  
mkdir build && cd build  
```

```sh
cmake .. -DBUILD_EXAMPLES=true -DCMAKE_BUILD_TYPE=release -DFORCE_RSUSB_BACKEND=false -DBUILD_WITH_CUDA=true && make -j$(($(nproc)-1)) && sudo make install
```

```sh
realsense-viewer
```

若出现界面则说明安装成功

### 3.2 Realsense-Ros

```sh
sudo apt-get install libudev-dev pkg-config libgtk-3-dev
sudo apt-get install libusb-1.0-0-dev pkg-config
sudo apt-get install libglfw3-dev
sudo apt-get install libssl-dev
```

```sh
mkdir -p ~/catkin_ws/src
cd ~/catkin_ws/src/
catkin_init_workspace
```

```sh
git clone https://github.com/IntelRealSense/realsense-ros.git
git clone https://github.com/pal-robotics/ddynamic_reconfigure.git
```

```sh
cd realsense-ros/
git checkout `git tag | sort -V | grep -P "^2.\d+\.\d+" | tail -1`
# 请注意 这个检查的2.50的驱动，如果你安装的不对的话。。。
```
```sh
cd ~/catkin_ws/src/realsense-ros/realsense2_camera
gedit CMakeLists.txt
```

是否安装成功

```sh
roslaunch realsense2_camera rs_camera.launch
```

## 4. 深度学习相关

```sh
I Confirm that the workaround survives a reeboot by adding:
echo -n "5000" > /sys/devices/c250000.i2c/i2c-7/7-0040/iio\:device0/crit_current_limit_0
echo -n "5000" > /sys/devices/3180000.i2c/i2c-2/2-0040/iio\:device0/crit_current_limit_0
```

### 4.1 yolov5环境安装Pytorch

```sh
conda create -n yolov5 python==3.6.9
```

```sh
conda activate yolov5
```

会一直报这个错误，这是因为1：pip的版本不对建议安装pip19.1.1.但是pip和pip3是使用不了的所以选用conda安装

```sh
conda install pip=19.1.1
```

注意！numpy的版本，该版本是否支持arm架构的jetson

查询地址：https://anaconda.org/search?q=numpy

```sh
conda install conda-forge::numpy
```

```sh
sudo apt-get install libblas-dev checkinstall
sudo apt-get install liblapack-dev checkinstall
sudo apt-get install gfortran
pip3 install scipy
# 不要着急，编译半小时。。
```

```sh
SyntaxError: future feature annotations is not defined
https://github.com/csuhan/ReDet/issues/14
Try Python>=3.7
For Python<=3.6, you need:
git clone -b legacy_py3.6 https://github.com/QUVA-Lab/e2cnn.git
cd e2cnn
python setup.py install
```



### 4.2 yolov8安装环境

```sh
conda create -n yolov8 python=3.8.13
pip install ultralytics onnx lapx gdown numpy==1.23.1 -i https://pypi.tuna.tsinghua.edu.cn/simple
# pytorch 1.11.0 
gdown https://drive.google.com/uc?id=1hs9HM0XJ2LouoPFghcn7ZMOs5qu5HexPXwM 
# torchvision 0.12.0
gdown https://drive.google.com/uc?id=1m0d8ruUY8RvCP9eVjZw4Nc8LAwM8yuGV 
#安装
pip install torch-*.whl torchvision-*.whl
python -m pip install build/dist/tensorrt-*.whl
```

#### 4.2.1 自我编译

```sh
https://blog.csdn.net/m0_49586319/article/details/134362312
```

## 5. 项目

### slam

protobuf与gazebo冲突问题：https://zhuanlan.zhihu.com/p/573559407

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
INCLUDE_DIRECTORIES(/home/scout/local_install/google/protocbuff/include/)
LINK_DIRECTORIES(/home/scout/local_install/google/protocbuff/lib/)
###################################################
```



