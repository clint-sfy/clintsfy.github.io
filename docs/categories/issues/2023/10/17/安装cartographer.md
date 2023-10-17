---
title: cartographer安装教程
author: 阿源
date: 2023/10/17 19:30
categories:
 - Bug万象集
tags:
 - cartographer
 - slam
---
# 2023cartographer安装教程（超详细，保姆级教程）

参考博客：https://blog.csdn.net/m0_45805756/article/details/126309855?ops_request_misc=%257B%2522request%255Fid%2522%253A%2522169734591016800182159728%2522%252C%2522scm%2522%253A%252220140713.130102334..%2522%257D&request_id=169734591016800182159728&biz_id=0&utm_medium=distribute.pc_search_result.none-task-blog-2~all~top_positive~default-1-126309855-null-null.142^v96^pc_search_result_base2&utm_term=cartographer&spm=1018.2226.3001.4187

最好全程开魔法，下载速度会很快，开TUN模式

## Ubuntu选择

去官网下载：https://releases.ubuntu.com/18.04.6/?_ga=2.223457176.2063223167.1697532208-1499210918.1697373224

Ubuntu 18.04.6 LTS (Bionic Beaver)

选择：[ ubuntu-18.04.6-desktop-amd64.iso]

## 源码安装

### 安装依赖
cere官网教程http://www.ceres-solver.org/installation.html#linux
```bash
sudo apt-get install net-tools
sudo apt-get install openssh-server
```
```bash
# google-glog + gflags
sudo apt-get install libgoogle-glog-dev libgflags-dev
# Use ATLAS for BLAS & LAPACK
sudo apt-get install libatlas-base-dev
# Eigen3 开魔法的话 自动就是3.3.4 就是要这个版本！！！
sudo apt-get install libeigen3-dev
# SuiteSparse (optional)
sudo apt-get install libsuitesparse-dev

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

这里注意！cmake一定要3.16以上，但是ubuntu自带的版本太低了！！

```
wget -O - https://apt.kitware.com/keys/kitware-archive-latest.asc 2>/dev/null | sudo apt-key add -

sudo apt-add-repository 'deb https://apt.kitware.com/ubuntu/ bionic main'
sudo apt-get update
sudo apt-get install cmake
```

### 安装cere

cere一定要选择2.1.0的版本！！！自己去官网下，用xftp传上去

```bash
mkdir carto_ws
cd carto_ws
mkdir src
cd src
git clone https://github.com/googlecartographer/cartographer_ros.git
git clone https://github.com/googlecartographer/cartographer.git
# 这一步 自己去下载2.1.0的版本 ，放到src的目录里面！！！
# git clone https://github.com/ceres-solver/ceres-solver.git
```

由于在cmake的时候，默认是c++11，但是cere需要c++17

修改文件carto_ws/cartographer/CmakeList.txt

修改文件carto_ws/ceres-solver-2.1.0/CmakeList.txt

在cmake_minimum_required(VERSION3.10)下添加这两句

```
cmake_minimum_required(VERSION3.10)

set(CMAKE_CXX_STANDARD 17) 
set(CMAKE_CXX_STANDARD_REQUIRED TRUE)
```

### 构建ceres

```bash
cd ceres-solver-2.1.0
mkdir ceres-bin
cd ceres-bin
cmake ..
make
make test
sudo make install
```

### 安装protobuf3

```bash
sudo apt-get remove libprotobuf-dev
which protoc
// 运行完“which protoc”会显示一个protoc的路径，如果没有显示则下面这条命令不必执行
rm /usr/local/bin/protoc
// 具体路径以“which protoc”显示的为准，如果是默认的话更有可能是usr/bin/protoc
 到此，低版本的protobuf卸载完成。
```

```bash
1)首先安装依赖库
sudo apt-get install autoconf automake libtool curl make g++ unzip
2)接下来克隆源码，注意，git submodule update --init --recursive这一步克隆子模块必须有，否则后面会报错（报找不到文件的错），当然，之前如果你没有解决github下载慢的问题(0-1)，这里可能就要慢的绝望了。
git clone -b v3.6.0 https://github.com/protocolbuffers/protobuf.git
// 上述命令表示克隆版本为3.6.0的protobuf源码
cd protobuf
git submodule update --init --recursive
// 该命令表示克隆protobuf的子模块，主要是gtest
3)编译并安装
// 进入到克隆的protobuf目录，当然，如果之前就在这个目录下不必再次cd
cd protobuf
./autogen.sh
./configure
make
// 如果没有克隆子模块，make check会失败但是可以继续make install,但是使用某些功能时可能会出错
make check
sudo make install
sudo ldconfig
// 输出protobuf版本信息则表示安装成功
protoc --version
最后，查看安装位置
which protoc
可以看到，其默认下载位置为 /usr/local/bin/protoc
这是我们不想要的，因为carto的搜索protoc的路径为/ usr/bin/protoc，选择直接copy过去
sudo cp /usr/local/bin/protoc /usr/bin
```

### 安装ros

如果您使用的是Ubuntu 18.04，那么适合您的ROS版本是ROS Melodic，而不是Kinetic。ROS Melodic是专为Ubuntu 18.04设计的ROS版本。

要在Ubuntu 18.04上安装ROS Melodic，请按照以下步骤进行操作：

1. 打开终端并运行以下命令，以添加ROS软件包源的密钥：

```
sudo apt install curl

curl -s https://raw.githubusercontent.com/ros/rosdistro/master/ros.asc | sudo apt-key add -
```

2. 运行以下命令，以添加ROS软件包源到软件源列表：

```
sudo sh -c 'echo "deb http://packages.ros.org/ros/ubuntu $(lsb_release -sc) main" > /etc/apt/sources.list.d/ros-latest.list'
```

3. 运行以下命令，以更新软件包列表：

```
sudo apt update
```

4. 运行以下命令，以安装ROS Melodic的完整桌面安装包：
```
sudo apt install ros-melodic-desktop-full
```

5. 安装完成后，运行以下命令，以初始化ROS环境：

```
echo "source /opt/ros/melodic/setup.bash" >> ~/.bashrc
source ~/.bashrc
```

6. 运行以下命令，以安装额外的依赖项：

```
sudo apt install python-rosdep python-rosinstall python-rosinstall-generator python-wstool build-essential
```

7. 运行以下命令，以初始化rosdep：

```
cd carto_ws
sudo rosdep init
rosdep update
```

现在，您已经成功安装了ROS Melodic。您可以通过运行以下命令来验证已安装的ROS版本：

```
rosversion -d
```

如果输出为`melodic`，则表示您已成功安装了ROS Melodic。

请注意，确保您的操作系统版本与您选择的ROS版本相匹配。如果您的操作系统版本不同，请选择适合您操作系统的其他ROS版本。


### 编译cartographer

```bash
# cd carto_ws
# rosdep update

# 从这一步开始
rosdep install --from-paths src --ignore-src --rosdistro=melodic -y
# 这一步会有一些包没有下载完需要反复根据提示下载 知道sucessful
# 注意！如果提示是std_msgs  那么为ros-melodic-std-msgs 
sudo apt-get install ros-melodic-提示的东西

cd cartographer
mkdir build
cd build
cmake .. -G Ninja
ninja//需要很长时间
ninja test
sudo ninja install
```

## 编译安装

```bash
cd carto_ws
catkin_make_isolated --install --use-ninja//需要很长时间(下次编译会很快完成)
source install_isolated/setup.bash
```

## 测试

```bash
wget -P ~/Downloads https://storage.googleapis.com/cartographer-public-data/bags/backpack_2d/cartographer_paper_deutsches_museum.bag

roslaunch cartographer_ros demo_backpack_2d.launch bag_filename:=${HOME}/Downloads/cartographer_paper_deutsches_museum.bag

wget -P ~/Downloads https://storage.googleapis.com/cartographer-public-data/bags/backpack_3d/with_intensities/b3-2016-04-05-14-14-00.bag

roslaunch cartographer_ros demo_backpack_3d.launch bag_filename:=${HOME}/Downloads/b3-2016-04-05-14-14-00.bag
```



