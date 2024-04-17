---
title: 正电原子QT教程速查
author: 阿源
date: 2023/08/01 12:00
categories:
 - QT快速入门
tags:
 - C++
 - QT5
---
# 正电原子QT教程
- 官网：http://www.openedv.com/docs/boards/arm-linux/zdyz-i.mx6ull.html
- 资料：https://pan.baidu.com/s/1Z_AlP2M1H8R_TjIWN-Pk0g 提取码：2df1

## 1. linux安装qt
安装ubuntu18.04

```bash
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

```bash
sudo apt-get install net-tools openssh-server vim git
sudo apt-get install gcc g++ lsb-core lib32stdc++6 libglu1-mesa-dev \
gstreamer1.0-plugins-base gstreamer1.0-plugins-bad gstreamer1.0-libav \
gstreamer1.0-plugins-good gstreamer1.0-plugins-ugly gstreamer1.0-pulseaudio \
cmake
```

```bash
sudo apt-get install gcc g++
sudo apt-get install lsb-core lib32stdc++6 // 安装其他库

g++ -v
gcc -v
```

```bash
cd /my_xftp
chmod +x qt-opensource-linux-x64-5.12.9.run
sudo ./qt-opensource-linux-x64-5.12.9.run

sudo apt-get install fcitx-table-wubi // 五笔输入法
sudo apt-get install fcitx-sunpinyin

sudo apt install fcitx-frontend-qt5 
sudo cp /usr/lib/x86_64-linux-gnu/qt5/plugins/platforminputcontexts/libfcitxplatforminputcontextplugin.so /opt/Qt5*/Tools/QtCreator/lib/Qt/plugins/platforminputcontexts
```

### 多媒体

播放音乐需要安装 Gst 解码插件。  

```bash
sudo apt-get install gstreamer1.0-plugins-base gstreamer1.0-plugins-bad gstreamer1.0-plugins-good gstreamer1.0-plugins-ugly gstreamer1.0-pulseaudio gstreamer1.0-libav
```

### 安装出厂系统交叉编译器

```bash
cd /my_xftp
chmod u+x fsl-imx-x11-glibc-x86_64-meta-toolchain-qt5-cortexa7hf-neon-toolchain-4.1.15-2.1.0.sh
./fsl-imx-x11-glibc-x86_64-meta-toolchain-qt5-cortexa7hf-neon-toolchain-4.1.15-2.1.0.sh
# 每次打开都要
source /opt/fsl-imx-x11/4.1.15-2.1.0/environment-setup-cortexa7hf-neon-poky-linux-gnueabi
qmake -v
arm-poky-linux-gnueabi-gcc --version
```

```bash
cd QT/
qmake 55.pro
# 删除makefile
make distclean
# 直接qmake就好
qmake
# 快一点 2个线程
make -j 2
```

```bash
# u盘拷贝到开发板
cp 55 /usb
sync

killall /opt/QDesktop
df
cd /run/media/sdal
./55

# 永久关闭桌面
vi etc/rc.local
```



## 2. 信号与槽


## 3. 快捷键