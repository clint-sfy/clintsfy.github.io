---
title: D435i相机
author: 阿源
date: 2024/04/18 18:00
categories:
 - SLAM
tags:
 - D435i
 - OpenCV
---
# D435i相机说明

## 基本环境

### 格式说明

1. **MJPEG**：Motion JPEG，是一种基于JPEG压缩的视频编码格式。MJPEG将视频流中的每一帧都单独压缩为JPEG图像，因此每帧都是一个独立的JPEG图像。虽然MJPEG相比于其他视频编码方式（如H.264）具有较低的压缩比率，但它的优势在于解码速度快、处理简单，适用于对实时性要求较高的应用场景，如视频监控。
2. **YUYV**：YUYV是一种色彩空间和数据格式，也称为YUV 4:2:2。它将图像的亮度（Y）和色度（U、V）分离开来，并以交错的形式存储像素数据。在YUYV格式中，每四个像素共享两个色度样本，因此它的数据量相比于RGB格式更小，但仍保持了较好的图像质量。YUYV常用于摄像头和视频捕获设备输出的格式之一。
3. **RGB**：Red-Green-Blue，是一种将颜色表示为红色、绿色和蓝色三个通道的色彩空间。在RGB图像中，每个像素由三个分量组成，分别表示红、绿、蓝三种颜色的强度。RGB格式通常用于显示器和图像处理领域，因为它直观且易于理解，但相比YUV格式，它需要更多的存储空间和带宽。

这些格式和编码方式在视频处理和图像传输中具有不同的特性和应用场景，选择适合的格式取决于具体的应用需求和硬件支持。

## launch文件

这篇博客中，我们会以`rs_camera`节点为例，对其launch文件中的参数进行进一步分析，从而更好地使用。

### enable_depth 深度相关

布尔型变量，默认为`true`，用于指定传感器是否发布深度相关Topic。其主要影响`/camera/depth/`相关Topic的发布，如下。

```txt
/camera/depth/camera_info
/camera/depth/color/points
/camera/depth/image_rect_raw
/camera/depth/image_rect_raw/compressed
/camera/depth/image_rect_raw/compressed/parameter_descriptions
/camera/depth/image_rect_raw/compressed/parameter_updates
/camera/depth/image_rect_raw/compressedDepth
/camera/depth/image_rect_raw/compressedDepth/parameter_descriptions
/camera/depth/image_rect_raw/compressedDepth/parameter_updates
/camera/depth/image_rect_raw/theora
/camera/depth/image_rect_raw/theora/parameter_descriptions
/camera/depth/image_rect_raw/theora/parameter_updates
```

### enable_infra 红外影像

其实一共包括`enable_infra`、`enable_infra1`、`enable_infra2`三个变量，用于控制是否输出红外影像。`enable_infra1`、`enable_infra2`分别表示左、右红外相机的影像。这三个变量默认都为`false`。其主要影响`/camera/infra1/`和`/camera/infra2/`相关Topic的发布，如下。

```txt
/camera/infra1/camera_info
/camera/infra1/image_rect_raw
/camera/infra1/image_rect_raw/compressed
/camera/infra1/image_rect_raw/compressed/parameter_descriptions
/camera/infra1/image_rect_raw/compressed/parameter_updates
/camera/infra1/image_rect_raw/compressedDepth
/camera/infra1/image_rect_raw/compressedDepth/parameter_descriptions
/camera/infra1/image_rect_raw/compressedDepth/parameter_updates
/camera/infra1/image_rect_raw/theora
/camera/infra1/image_rect_raw/theora/parameter_descriptions
/camera/infra1/image_rect_raw/theora/parameter_updates

/camera/infra2/camera_info
/camera/infra2/image_rect_raw
/camera/infra2/image_rect_raw/compressed
/camera/infra2/image_rect_raw/compressed/parameter_descriptions
/camera/infra2/image_rect_raw/compressed/parameter_updates
/camera/infra2/image_rect_raw/compressedDepth
/camera/infra2/image_rect_raw/compressedDepth/parameter_descriptions
/camera/infra2/image_rect_raw/compressedDepth/parameter_updates
/camera/infra2/image_rect_raw/theora
/camera/infra2/image_rect_raw/theora/parameter_descriptions
/camera/infra2/image_rect_raw/theora/parameter_updates
```

需要注意的是，`enable_infra`并不会真正影响红外影像的发布，真正影像开关的是`enable_infra1`和`enable_infra2`。虽然一般应该不会这么做，但是我们完全可以只打开一个红外相机，关闭另一个。

### enable_color RGB影像

布尔型变量，默认为`true`，用于指定RGB相机是否发布RGB影像相关Topic。其主要影响`/camera/color/`相关Topic的发布，如下。

```markdown
/camera/color/camera_info
/camera/color/image_raw
/camera/color/image_raw/compressed
/camera/color/image_raw/compressed/parameter_descriptions
/camera/color/image_raw/compressed/parameter_updates
/camera/color/image_raw/compressedDepth
/camera/color/image_raw/compressedDepth/parameter_descriptions
/camera/color/image_raw/compressedDepth/parameter_updates
/camera/color/image_raw/theora
/camera/color/image_raw/theora/parameter_descriptions
/camera/color/image_raw/theora/parameter_updates
```

### enable_gyro  陀螺仪

布尔型变量，默认为`false`，用于指定陀螺仪是否发布相关Topic。其主要影响`/camera/gyro/`相关Topic的发布，如下。

```txt
/camera/gyro/imu_info
/camera/gyro/sample
```

### enable_accel 加速度计

布尔型变量，默认为`false`，用于指定加速度计是否发布相关Topic。其主要影响`/camera/accel/`相关Topic的发布，如下。

```txt
/camera/accel/imu_info
/camera/accel/sample
```

### enable_sync 同步频率

布尔型变量，默认为`false`，顾名思义，用于同步各传感器之间的数据，这样由D435i发出的各个Topic的频率就相同了。

### align_depth 对齐RGB和深度

布尔型变量，默认为`false`，顾名思义，用于将RGB图像与深度图像对齐，它并不会修改之前发出的Topic，而是重新发出两类多个Topic：`/camera/aligned_depth_to_color`和`/camera/aligned_depth_to_infra1`，如下。

```txt
/camera/aligned_depth_to_color/camera_info
/camera/aligned_depth_to_color/image_raw
/camera/aligned_depth_to_color/image_raw/compressed
/camera/aligned_depth_to_color/image_raw/compressed/parameter_descriptions
/camera/aligned_depth_to_color/image_raw/compressed/parameter_updates
/camera/aligned_depth_to_color/image_raw/compressedDepth
/camera/aligned_depth_to_color/image_raw/compressedDepth/parameter_descriptions
/camera/aligned_depth_to_color/image_raw/compressedDepth/parameter_updates
/camera/aligned_depth_to_color/image_raw/theora
/camera/aligned_depth_to_color/image_raw/theora/parameter_descriptions
/camera/aligned_depth_to_color/image_raw/theora/parameter_updates

/camera/aligned_depth_to_infra1/camera_info
/camera/aligned_depth_to_infra1/image_raw
/camera/aligned_depth_to_infra1/image_raw/compressed
/camera/aligned_depth_to_infra1/image_raw/compressed/parameter_descriptions
/camera/aligned_depth_to_infra1/image_raw/compressed/parameter_updates
/camera/aligned_depth_to_infra1/image_raw/compressedDepth
/camera/aligned_depth_to_infra1/image_raw/compressedDepth/parameter_descriptions
/camera/aligned_depth_to_infra1/image_raw/compressedDepth/parameter_updates
/camera/aligned_depth_to_infra1/image_raw/theora
/camera/aligned_depth_to_infra1/image_raw/theora/parameter_descriptions
/camera/aligned_depth_to_infra1/image_raw/theora/parameter_updates
```

### 相机比对

一个是将深度对齐到RGB彩色图像，另一个是将深度对齐到红外左影像。如下是未对齐的RGB影像和深度影像：

```
/camera/color/image_raw
/camera/depth/image_rect_raw
```

可以看到，深度影像中的物体轮廓明显是要小于RGB影像的，所以不是对齐的。而将深度对齐到RGB影像的效果如下。

```txt
/camera/color/image_raw
/camera/aligned_depth_to_infra1/image_raw
```

可以看到，深度图和RGB图拥有基本相同的轮廓了。同理，下面是将深度图对齐到左红外影像的结果

```markdown
/camera/infra2/image_rect_raw
/camera/aligned_depth_to_infra1/image_raw
```



## Topic说明

这里，我们把深度(`enable_depth`)、双目红外(`enable_infra`)、RGB相机(`enable_color`)、陀螺仪(`enable_gyro`)、加速度计(`enable_accel`)全部打开，其余默认。然后输入`roslaunch realsense2_camera rs_camera.launch`启动节点。正常情况下，终端中就会输出一长串的提示信息，如下图所示，这里我们就简单对这些数据的信息进行分析。

### 带有`info`的Topic

如果想获得传感器相关信息，直接订阅带`info`的Topic即可。

```
/camera/depth/camera_info	# 深度相机信息
/camera/infra1/camera_info	# 左红外相机信息
/camera/infra2/camera_info	# 右红外相机信息
/camera/color/camera_info	# RGB相机信息
/camera/gyro/imu_info	# 陀螺仪信息
/camera/accel/imu_info	# 加速度计信息
/camera/aligned_depth_to_color/camera_info	# 对齐到RGB影像的深度图信息
/camera/aligned_depth_to_infra1/camera_info	# 对齐到左红外影像的深度图信息
```

比如下面利用`rostopic echo /camera/infra1/camera_info`展示了左红外相机影像的相关信息。

### 其他的Topic

另外，还有很多带`compress`的Topic，顾名思义也非常简单，就是经过压缩后的数据流，大小更小。但同时数据的质量可能会有一定的下降。

和上面压缩的数据流对应，带有`raw`的Topic就是未经过压缩的原始数据流。如果数据传输带宽不是特别限制，一般使用原始数据(带有`raw`的Topic)就好。

上面看到过很多次的包含`theora`的Topic，这些Topic其实从内容上来说，和不带`theora`的Topic是一样的，差别在于编码方式。Theora是一种开放而且免费的视频压缩编码技术。因此在使用的时候如果没什么特别需求，直接使用一般的就可以了。

另外，带有`rect`的Topic是表示校正后的数据，Rectify的缩写。

如果需要获得加速度计或陀螺仪的数据，订阅`/camera/gyro/sample`和`/camera/accel/sample`就可以了。如下获得的是加速度计的内容。

## 相机标定

- 相机（摄像头）是一种非常精密的光学仪器，对外界环境的感知非常敏感。
- 由于摄像头内部和外部的一些原因，摄像头采集的图像常常会发生一定的畸变。
- 如果直接将采集到的图像拿来进行图像处理，会产生很大的问题。
- 为了避免图像数据源造成的误差，需要对摄像头的相关参数进行标定。
- 本教程将会说明如何标定单目（monocular）相机，从而获取单目相机的标定参数

什么情况需要标定?

1. 传感器没有出厂标定参数

2. 传感器出厂批量标定不准确,如果需要比较高精度的标定参数,需要自行标定

3. 如果传感器在使用过程中因为特殊原因(如跌落、剧烈震动等)发生了变化,需要自行标定。手机摄像头、汽车环视。

显示相机的基本信息,包括固件、支持的模式、分辨率、帧率等

```bash
rs-enumerate-devices -C
```

RealSense D455相机内参无需标定，可以直接读取。有两种方式:

1、通过话题可以直接输出内参:

```bash
#启动RealSense d455相机
roslaunch realsense2camera rsrgbd.launch
#显示彩色相机内参
rostopic echo /camera/color/camera_info
```

K：[fx  cx  fy  cy]

评价相机标定结果

https://www.ncnynl.com/archives/202110/4707.html

查询相机设备
```bash
sudo apt install v4l2-utils
v4l2-ctl -d /dev/video0 --all

2.查看摄像头支持的视频参数
sudo v4l2-ctl --all --list-formats-ext
```

https://www.cnblogs.com/zkwarrior/p/16189869.html

**RGB图像分辨率与支持的帧率**

| Resolution  | Frame Rate（FPS） |
| ----------- | ----------------- |
| 1920 × 1080 | 6，15，30         |
| 1280 × 720  | 6，15，30         |
| 960 × 540   | 6，15，30，60     |
| 848 × 480   | 6，15，30，60     |
| 640 × 480   | 6，15，30，60     |
| 640 × 360   | 6，15，30，60     |
| 424 × 240   | 6，15，30，60     |
| 320 × 240   | 6，30，60         |
| 320 × 180   | 6，30，60         |

```markdown
<launch>
  	<node name="usb_cam" pkg="usb_cam" type="usb_cam_node" output="screen" >
  	<!--节点的名字叫做usb_cam，然后运行一个叫usb_cam_node的可执行文件，这个文件在ros的lib里面，找不到源码文件，只有这个包装好可执行文件-->
 
    <param name="video_device" value="/dev/video0" /> <!--摄像头的编号，类型：string-->
    <param name="image_width" value="640" /> <!--图像的横向分辨率，类型int-->
    <param name="image_height" value="480" /> <!--图像的纵向分辨率，类型int-->
    <param name="pixel_format" value="yuyv" /> <!--像素编码，可选值：mjepg、yuyv、uyvy，类型：string-->    
    <param name="camera_frame_id" value="usb_cam" /> <!--摄像头坐标系，类型：string-->
 
    <param name="io_method" value="mmap"/>  <!--IO通道，可选值：mmap、read、userptr，类型：string-->
	<param name="camera_info_url" value="package://usb_cam/camera_info/camera_calibration20220531.yaml"/>
  	</node>

	<node name="image_view" pkg="image_view" type="image_view" respawn="false" output="screen">
	<remap from="image" to="/usb_cam/image_raw"/>
	<!--话题的名字映射为/usb_cam/image_raw-->
 
    <param name="autosize" value="true" />
  </node>
</launch>
```

framerate：类型-int；默认值-30；帧率
brightness：类型-int；默认值-32；亮度-0~255
saturation：类型-int；默认值-32；饱和度-0~255
contrast：类型-int；默认值-32；对比度-0~255
sharpness：类型-int；默认值-22；清晰度-0~255
autofocus：类型-bool；默认值-false；自动对焦
focus：类型-int；默认值-51；焦点（非自动对焦状态下有效）
camera_info_url：类型-string；默认值- —；摄像头校准文件路径
camera_name：类型-string；默认值-“head_camera”；摄像头名字


```
height: 720
width: 1280
distortion_model: "plumb_bob"
D: [0.0, 0.0, 0.0, 0.0, 0.0]
K: [911.425537109375, 0.0, 628.3302612304688, 0.0, 909.815185546875, 347.19207763671875, 0.0, 0.0, 1.0]
R: [1.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0.0, 0.0, 1.0]
P: [911.425537109375, 0.0, 628.3302612304688, 0.0, 0.0, 909.815185546875, 347.19207763671875, 0.0, 0.0, 0.0, 1.0, 0.0]
binning_x: 0
binning_y: 0
```

### 标定流程

Kalibr相机校正工具安装与使用笔记

https://zhaoxuhui.top/blog/2020/09/09/kalibr-installation-and-use.html#5%E5%88%B7%E6%96%B0%E5%B7%A5%E4%BD%9C%E7%A9%BA%E9%97%B4

录制rosbag

https://zhaoxuhui.top/blog/2019/10/22/ros-note-9.html

