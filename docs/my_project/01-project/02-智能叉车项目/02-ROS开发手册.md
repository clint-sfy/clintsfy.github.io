---
title: ROS开发手册
author: 阿源
date: 2023/11/05 12:00
categories:
 - 个人项目
tags:
 - 个人项目
 - ROS
---
# ROS开发手册

## 1.roslaunch与参数服务器



## 2. 核心代码

### 循环控制

```cpp
void turn_on_robot::Control()
{
  while(ros::ok())
  {
    if (true == Get_Sensor_Data_New()) //The serial port reads and verifies the data sent by the lower computer, and then the data is converted to international units
                                       //通过串口读取并校验下位机发送过来的数据，然后数据转换为国际单位
    {
      _Now = ros::Time::now();
      if(_Last_Time.toSec()==0) _Last_Time=_Now; //Perform this operation when entering for the first time to avoid excessive integration time
                                                 //首次进入时进行此操作，避免积分时间过大
      Sampling_Time = (_Now - _Last_Time).toSec(); //Retrieves time interval, which is used to integrate velocity to obtain displacement (mileage) 
                                                   //获取时间间隔，用于积分速度获得位移(里程)
      
      //Odometer correction parameters
      //里程计误差修正
      Robot_Vel.X=Robot_Vel.X*odom_x_scale;
      Robot_Vel.Y=Robot_Vel.Y*odom_y_scale;
      if(Robot_Vel.Z>=0)
        Robot_Vel.Z=Robot_Vel.Z*odom_z_scale_positive;
      else
        Robot_Vel.Z=Robot_Vel.Z*odom_z_scale_negative;

      //Speed * Time = displacement (odometer)
      //速度*时间=位移（里程计）
      Robot_Pos.X+=(Robot_Vel.X * cos(Robot_Pos.Z) - Robot_Vel.Y * sin(Robot_Pos.Z)) * Sampling_Time; //Calculate the displacement in the X direction, unit: m //计算X方向的位移，单位：m
      Robot_Pos.Y+=(Robot_Vel.X * sin(Robot_Pos.Z) + Robot_Vel.Y * cos(Robot_Pos.Z)) * Sampling_Time; //Calculate the displacement in the Y direction, unit: m //计算Y方向的位移，单位：m
      Robot_Pos.Z+=Robot_Vel.Z * Sampling_Time; //The angular displacement about the Z axis, in rad //绕Z轴的角位移，单位：rad 

      //Calculate the three-axis attitude from the IMU with the angular velocity around the three-axis and the three-axis acceleration
      //通过IMU绕三轴角速度与三轴加速度计算三轴姿态
      Quaternion_Solution(Mpu6050.angular_velocity.x, Mpu6050.angular_velocity.y, Mpu6050.angular_velocity.z,\
                Mpu6050.linear_acceleration.x, Mpu6050.linear_acceleration.y, Mpu6050.linear_acceleration.z);

      Publish_Odom();      //Pub the speedometer topic //发布里程计话题
      Publish_ImuSensor(); //Pub the IMU topic //发布IMU话题    
      Publish_Voltage();   //Pub the topic of power supply voltage //发布电源电压话题

      _Last_Time = _Now; //Record the time and use it to calculate the time interval //记录时间，用于计算时间间隔
    }
    
    ros::spinOnce();   //The loop waits for the callback function //循环等待回调函数
    }
}
```

### 构造函数

只执行一次，用于初始化

```cpp
turn_on_robot::turn_on_robot():Sampling_Time(0),Power_voltage(0)
{
  //Clear the data
  //清空数据
  memset(&Robot_Pos, 0, sizeof(Robot_Pos));
  memset(&Robot_Vel, 0, sizeof(Robot_Vel));
  memset(&Receive_Data, 0, sizeof(Receive_Data)); 
  memset(&Send_Data, 0, sizeof(Send_Data));
  memset(&Mpu6050_Data, 0, sizeof(Mpu6050_Data));

  ros::NodeHandle private_nh("~"); //Create a node handle //创建节点句柄
  //The private_nh.param() entry parameter corresponds to the initial value of the name of the parameter variable on the parameter server
  //private_nh.param()入口参数分别对应：参数服务器上的名称  参数变量名  初始值
  private_nh.param<std::string>("usart_port_name",  usart_port_name,  "/dev/wheeltec_controller"); //Fixed serial port number //固定串口号
  private_nh.param<int>        ("serial_baud_rate", serial_baud_rate, 115200); //Communicate baud rate 115200 to the lower machine //和下位机通信波特率115200
  private_nh.param<std::string>("odom_frame_id",    odom_frame_id,    "odom_combined");      //The odometer topic corresponds to the parent TF coordinate //里程计话题对应父TF坐标
  private_nh.param<std::string>("robot_frame_id",   robot_frame_id,   "base_footprint"); //The odometer topic corresponds to sub-TF coordinates //里程计话题对应子TF坐标
  private_nh.param<std::string>("gyro_frame_id",    gyro_frame_id,    "gyro_link"); //IMU topics correspond to TF coordinates //IMU话题对应TF坐标

  //Odometer correction parameters
  //里程计误差修正参数
  private_nh.param<float>("odom_x_scale",    odom_x_scale,    1.0); 
  private_nh.param<float>("odom_y_scale",    odom_y_scale,    1.0); 
  private_nh.param<float>("odom_z_scale_positive",    odom_z_scale_positive,    1.0); 
  private_nh.param<float>("odom_z_scale_negative",    odom_z_scale_negative,    1.0); 


  voltage_publisher = n.advertise<std_msgs::Float32>("PowerVoltage", 10); //Create a battery-voltage topic publisher //创建电池电压话题发布者
  odom_publisher    = n.advertise<nav_msgs::Odometry>("odom", 50); //Create the odometer topic publisher //创建里程计话题发布者
  imu_publisher     = n.advertise<sensor_msgs::Imu>("imu", 20); //Create an IMU topic publisher //创建IMU话题发布者

  //Set the velocity control command callback function
  //速度控制命令订阅回调函数设置
  Cmd_Vel_Sub     = n.subscribe("cmd_vel",     100, &turn_on_robot::Cmd_Vel_Callback, this); 

  ROS_INFO_STREAM("Data ready"); //Prompt message //提示信息
  
  try
  { 
    //Attempts to initialize and open the serial port //尝试初始化与开启串口
    Stm32_Serial.setPort(usart_port_name); //Select the serial port number to enable //选择要开启的串口号
    Stm32_Serial.setBaudrate(serial_baud_rate); //Set the baud rate //设置波特率
    serial::Timeout _time = serial::Timeout::simpleTimeout(2000); //Timeout //超时等待
    Stm32_Serial.setTimeout(_time);
    Stm32_Serial.open(); //Open the serial port //开启串口
  }
  catch (serial::IOException& e)
  {
    ROS_ERROR_STREAM("wheeltec_robot can not open serial port,Please check the serial port cable! "); //If opening the serial port fails, an error message is printed //如果开启串口失败，打印错误信息
  }
  if(Stm32_Serial.isOpen())
  {
    ROS_INFO_STREAM("wheeltec_robot serial port opened"); //Serial port opened successfully //串口开启成功提示
  }
}
```

### 析构函数

```cpp
#define FRAME_HEADER      0X7B       //Frame head //帧头
#define FRAME_TAIL        0X7D       //Frame tail //帧尾
#define RECEIVE_DATA_SIZE 24         //下位机发送过来的数据的长度
#define SEND_DATA_SIZE    11         //ROS向下位机发送的数据的长度
//ROS向下位机发送数据的结构体
typedef struct _SEND_DATA_  
{
	    uint8_t tx[SEND_DATA_SIZE];
		float X_speed;	       
		float Y_speed;           
		float Z_speed;         
		unsigned char Frame_Tail; 
}SEND_DATA;
```

```cpp
turn_on_robot::~turn_on_robot()
{
  //Sends the stop motion command to the lower machine before the turn_on_robot object ends
  //对象turn_on_robot结束前向下位机发送停止运动命令
  Send_Data.tx[0]=FRAME_HEADER;
  Send_Data.tx[1] = 0;  
  Send_Data.tx[2] = 0; 

  //The target velocity of the X-axis of the robot //机器人X轴的目标线速度 
  Send_Data.tx[4] = 0;     
  Send_Data.tx[3] = 0;  

  //The target velocity of the Y-axis of the robot //机器人Y轴的目标线速度 
  Send_Data.tx[6] = 0;
  Send_Data.tx[5] = 0;  

  //The target velocity of the Z-axis of the robot //机器人Z轴的目标角速度 
  Send_Data.tx[8] = 0;  
  Send_Data.tx[7] = 0;    
  Send_Data.tx[9]=Check_Sum(9,SEND_DATA_CHECK); //Check the bits for the Check_Sum function //校验位，规则参见Check_Sum函数
  Send_Data.tx[10]=FRAME_TAIL; 
  try
  {
    Stm32_Serial.write(Send_Data.tx,sizeof (Send_Data.tx)); //Send data to the serial port //向串口发数据  
  }
  catch (serial::IOException& e)   
  {
    ROS_ERROR_STREAM("Unable to send data through serial port"); //If sending data fails, an error message is printed //如果发送数据失败,打印错误信息
  }
  Stm32_Serial.close(); //Close the serial port //关闭串口  
  ROS_INFO_STREAM("Shutting down"); //Prompt message //提示信息
}
```

### 接收下位机数据

```cpp
#define FRAME_HEADER      0X7B       //Frame head //帧头
#define FRAME_TAIL        0X7D       //Frame tail //帧尾
#define RECEIVE_DATA_SIZE 24         //下位机发送过来的数据的长度
#define SEND_DATA_SIZE    11         //ROS向下位机发送的数据的长度
//陀螺仪原始数据转换位弧度(rad)单位，1/65.5/57.30=0.00026644
#define GYROSCOPE_RATIO   0.00026644f
//与IMU加速度计设置的量程有关，量程±2g，对应数据范围±32768
//加速度计原始数据转换位m/s^2单位，32768/2g=32768/19.6=1671.84
#define ACCEl_RATIO 	  1671.84f 
//下位机向ROS发送数据的结构体
typedef struct _RECEIVE_DATA_     
{
	    uint8_t rx[RECEIVE_DATA_SIZE];
	    uint8_t Flag_Stop;
		unsigned char Frame_Header;
		float X_speed;  
		float Y_speed;  
		float Z_speed;  
		float Power_Voltage;	
		unsigned char Frame_Tail;
}RECEIVE_DATA;
```

```cpp
bool turn_on_robot::Get_Sensor_Data_New()
{
  short transition_16=0; //Intermediate variable //中间变量
  uint8_t i=0,check=0, error=1,Receive_Data_Pr[1]; //Temporary variable to save the data of the lower machine //临时变量，保存下位机数据
  static int count; //Static variable for counting //静态变量，用于计数
  Stm32_Serial.read(Receive_Data_Pr,sizeof(Receive_Data_Pr)); //Read the data sent by the lower computer through the serial port //通过串口读取下位机发送过来的数据

  /*//View the received raw data directly and debug it for use//直接查看接收到的原始数据，调试使用
  ROS_INFO("%x-%x-%x-%x-%x-%x-%x-%x-%x-%x-%x-%x-%x-%x-%x-%x-%x-%x-%x-%x-%x-%x-%x-%x",
  Receive_Data_Pr[0],Receive_Data_Pr[1],Receive_Data_Pr[2],Receive_Data_Pr[3],Receive_Data_Pr[4],Receive_Data_Pr[5],Receive_Data_Pr[6],Receive_Data_Pr[7],
  Receive_Data_Pr[8],Receive_Data_Pr[9],Receive_Data_Pr[10],Receive_Data_Pr[11],Receive_Data_Pr[12],Receive_Data_Pr[13],Receive_Data_Pr[14],Receive_Data_Pr[15],
  Receive_Data_Pr[16],Receive_Data_Pr[17],Receive_Data_Pr[18],Receive_Data_Pr[19],Receive_Data_Pr[20],Receive_Data_Pr[21],Receive_Data_Pr[22],Receive_Data_Pr[23]);
  */  

  Receive_Data.rx[count] = Receive_Data_Pr[0]; //Fill the array with serial data //串口数据填入数组

  Receive_Data.Frame_Header = Receive_Data.rx[0]; //The first part of the data is the frame header 0X7B //数据的第一位是帧头0X7B
  Receive_Data.Frame_Tail = Receive_Data.rx[23];  //The last bit of data is frame tail 0X7D //数据的最后一位是帧尾0X7D

  if(Receive_Data_Pr[0] == FRAME_HEADER || count>0) //Ensure that the first data in the array is FRAME_HEADER //确保数组第一个数据为FRAME_HEADER
    count++;
  else 
  	count=0;
  if(count == 24) //Verify the length of the packet //验证数据包的长度
  {
    count=0;  //Prepare for the serial port data to be refill into the array //为串口数据重新填入数组做准备
    if(Receive_Data.Frame_Tail == FRAME_TAIL) //Verify the frame tail of the packet //验证数据包的帧尾
    {
      check=Check_Sum(22,READ_DATA_CHECK);  //BCC check passes or two packets are interlaced //BCC校验通过或者两组数据包交错

      if(check == Receive_Data.rx[22])  
      {
        error=0;  //XOR bit check successful //异或位校验成功
      }
      if(error == 0)
      {
        /*//Check receive_data.rx for debugging use //查看Receive_Data.rx，调试使用 
        ROS_INFO("%x-%x-%x-%x-%x-%x-%x-%x-%x-%x-%x-%x-%x-%x-%x-%x-%x-%x-%x-%x-%x-%x-%x-%x",
        Receive_Data.rx[0],Receive_Data.rx[1],Receive_Data.rx[2],Receive_Data.rx[3],Receive_Data.rx[4],Receive_Data.rx[5],Receive_Data.rx[6],Receive_Data.rx[7],
        Receive_Data.rx[8],Receive_Data.rx[9],Receive_Data.rx[10],Receive_Data.rx[11],Receive_Data.rx[12],Receive_Data.rx[13],Receive_Data.rx[14],Receive_Data.rx[15],
        Receive_Data.rx[16],Receive_Data.rx[17],Receive_Data.rx[18],Receive_Data.rx[19],Receive_Data.rx[20],Receive_Data.rx[21],Receive_Data.rx[22],Receive_Data.rx[23]); 
        */

        Receive_Data.Flag_Stop=Receive_Data.rx[1]; //set aside //预留位
        Robot_Vel.X = Odom_Trans(Receive_Data.rx[2],Receive_Data.rx[3]); //Get the speed of the moving chassis in the X direction //获取运动底盘X方向速度
          
        Robot_Vel.Y = Odom_Trans(Receive_Data.rx[4],Receive_Data.rx[5]); //Get the speed of the moving chassis in the Y direction, The Y speed is only valid in the omnidirectional mobile robot chassis
                                                                          //获取运动底盘Y方向速度，Y速度仅在全向移动机器人底盘有效
        Robot_Vel.Z = Odom_Trans(Receive_Data.rx[6],Receive_Data.rx[7]); //Get the speed of the moving chassis in the Z direction //获取运动底盘Z方向速度   
          
        //MPU6050 stands for IMU only and does not refer to a specific model. It can be either MPU6050 or MPU9250
        //Mpu6050仅代表IMU，不指代特定型号，既可以是MPU6050也可以是MPU9250
        Mpu6050_Data.accele_x_data = IMU_Trans(Receive_Data.rx[8],Receive_Data.rx[9]);   //Get the X-axis acceleration of the IMU     //获取IMU的X轴加速度  
        Mpu6050_Data.accele_y_data = IMU_Trans(Receive_Data.rx[10],Receive_Data.rx[11]); //Get the Y-axis acceleration of the IMU     //获取IMU的Y轴加速度
        Mpu6050_Data.accele_z_data = IMU_Trans(Receive_Data.rx[12],Receive_Data.rx[13]); //Get the Z-axis acceleration of the IMU     //获取IMU的Z轴加速度
        Mpu6050_Data.gyros_x_data = IMU_Trans(Receive_Data.rx[14],Receive_Data.rx[15]);  //Get the X-axis angular velocity of the IMU //获取IMU的X轴角速度  
        Mpu6050_Data.gyros_y_data = IMU_Trans(Receive_Data.rx[16],Receive_Data.rx[17]);  //Get the Y-axis angular velocity of the IMU //获取IMU的Y轴角速度  
        Mpu6050_Data.gyros_z_data = IMU_Trans(Receive_Data.rx[18],Receive_Data.rx[19]);  //Get the Z-axis angular velocity of the IMU //获取IMU的Z轴角速度  
        //Linear acceleration unit conversion is related to the range of IMU initialization of STM32, where the range is ±2g=19.6m/s^2
        //线性加速度单位转化，和STM32的IMU初始化的时候的量程有关,这里量程±2g=19.6m/s^2
        Mpu6050.linear_acceleration.x = Mpu6050_Data.accele_x_data / ACCEl_RATIO;
        Mpu6050.linear_acceleration.y = Mpu6050_Data.accele_y_data / ACCEl_RATIO;
        Mpu6050.linear_acceleration.z = Mpu6050_Data.accele_z_data / ACCEl_RATIO;
        //The gyroscope unit conversion is related to the range of STM32's IMU when initialized. Here, the range of IMU's gyroscope is ±500°/s
        //Because the robot generally has a slow Z-axis speed, reducing the range can improve the accuracy
        //陀螺仪单位转化，和STM32的IMU初始化的时候的量程有关，这里IMU的陀螺仪的量程是±500°/s
        //因为机器人一般Z轴速度不快，降低量程可以提高精度
        Mpu6050.angular_velocity.x =  Mpu6050_Data.gyros_x_data * GYROSCOPE_RATIO;
        Mpu6050.angular_velocity.y =  Mpu6050_Data.gyros_y_data * GYROSCOPE_RATIO;
        Mpu6050.angular_velocity.z =  Mpu6050_Data.gyros_z_data * GYROSCOPE_RATIO;

        //Get the battery voltage
        //获取电池电压
        transition_16 = 0;
        transition_16 |=  Receive_Data.rx[20]<<8;
        transition_16 |=  Receive_Data.rx[21];  
        Power_voltage = transition_16/1000+(transition_16 % 1000)*0.001; //Unit conversion millivolt(mv)->volt(v) //单位转换毫伏(mv)->伏(v)
          
        return true;

      }
    }
  }
  return false;
}
```



### 数据转换函数

```cpp
short turn_on_robot::IMU_Trans(uint8_t Data_High,uint8_t Data_Low)
{
  short transition_16;
  transition_16 = 0;
  transition_16 |=  Data_High<<8;   
  transition_16 |=  Data_Low;
  return transition_16;     
}
float turn_on_robot::Odom_Trans(uint8_t Data_High,uint8_t Data_Low)
{
  float data_return;
  short transition_16;
  transition_16 = 0;
  transition_16 |=  Data_High<<8;  //Get the high 8 bits of data   //获取数据的高8位
  transition_16 |=  Data_Low;      //Get the lowest 8 bits of data //获取数据的低8位
  data_return   =  (transition_16 / 1000)+(transition_16 % 1000)*0.001; // The speed unit is changed from mm/s to m/s //速度单位从mm/s转换为m/s
  return data_return;
}
```

### 串口校验函数

串口通讯校验函数，数据包n有个字节，第n-1个字节为校验位，第n个字节位帧尾。第1个字节到第n-2个字节数据按位异或的结果与第n-1个字节对比，即为BCC校验

输入参数： Count_Number：数据包前几个字节加入校验  mode：对发送数据还是接收数据进行校验

```cpp
unsigned char turn_on_robot::Check_Sum(unsigned char Count_Number,unsigned char mode)
{
  unsigned char check_sum=0,k;
  
  if(mode==0) //Receive data mode //接收数据模式
  {
   for(k=0;k<Count_Number;k++)
    {
     check_sum=check_sum^Receive_Data.rx[k]; //By bit or by bit //按位异或
     }
  }
  if(mode==1) //Send data mode //发送数据模式
  {
   for(k=0;k<Count_Number;k++)
    {
     check_sum=check_sum^Send_Data.tx[k]; //By bit or by bit //按位异或
     }
  }
  return check_sum; //Returns the bitwise XOR result //返回按位异或结果
}
```

### 发布电压相关信息

```h

```

```cpp
void turn_on_robot::Publish_Voltage()
{
    std_msgs::Float32 voltage_msgs; //Define the data type of the power supply voltage publishing topic //定义电源电压发布话题的数据类型
    static float Count_Voltage_Pub=0;
    if(Count_Voltage_Pub++>10)
      {
        Count_Voltage_Pub=0;  
        voltage_msgs.data = Power_voltage; //The power supply voltage is obtained //电源供电的电压获取
        voltage_publisher.publish(voltage_msgs); //Post the power supply voltage topic unit: V, volt //发布电源电压话题单位：V、伏特
      }
}
```

### 发布IMU数据话题

```cpp
void turn_on_robot::Publish_ImuSensor()
{
  sensor_msgs::Imu Imu_Data_Pub; //Instantiate IMU topic data //实例化IMU话题数据
  Imu_Data_Pub.header.stamp = ros::Time::now(); 
  Imu_Data_Pub.header.frame_id = gyro_frame_id; //IMU corresponds to TF coordinates, which is required to use the robot_pose_ekf feature pack 
                                                //IMU对应TF坐标，使用robot_pose_ekf功能包需要设置此项
  Imu_Data_Pub.orientation.x = Mpu6050.orientation.x; //A quaternion represents a three-axis attitude //四元数表达三轴姿态
  Imu_Data_Pub.orientation.y = Mpu6050.orientation.y; 
  Imu_Data_Pub.orientation.z = Mpu6050.orientation.z;
  Imu_Data_Pub.orientation.w = Mpu6050.orientation.w;
  Imu_Data_Pub.orientation_covariance[0] = 1e6; //Three-axis attitude covariance matrix //三轴姿态协方差矩阵
  Imu_Data_Pub.orientation_covariance[4] = 1e6;
  Imu_Data_Pub.orientation_covariance[8] = 1e-6;
  Imu_Data_Pub.angular_velocity.x = Mpu6050.angular_velocity.x; //Triaxial angular velocity //三轴角速度
  Imu_Data_Pub.angular_velocity.y = Mpu6050.angular_velocity.y;
  Imu_Data_Pub.angular_velocity.z = Mpu6050.angular_velocity.z;
  Imu_Data_Pub.angular_velocity_covariance[0] = 1e6; //Triaxial angular velocity covariance matrix //三轴角速度协方差矩阵
  Imu_Data_Pub.angular_velocity_covariance[4] = 1e6;
  Imu_Data_Pub.angular_velocity_covariance[8] = 1e-6;
  Imu_Data_Pub.linear_acceleration.x = Mpu6050.linear_acceleration.x; //Triaxial acceleration //三轴线性加速度
  Imu_Data_Pub.linear_acceleration.y = Mpu6050.linear_acceleration.y; 
  Imu_Data_Pub.linear_acceleration.z = Mpu6050.linear_acceleration.z;  
  imu_publisher.publish(Imu_Data_Pub); //Pub IMU topic //发布IMU话题
}
```

### 发布里程计话题

```cpp
void turn_on_robot::Publish_Odom()
{
    //Convert the Z-axis rotation Angle into a quaternion for expression 
    //把Z轴转角转换为四元数进行表达
    geometry_msgs::Quaternion odom_quat = tf::createQuaternionMsgFromYaw(Robot_Pos.Z);

    nav_msgs::Odometry odom; //Instance the odometer topic data //实例化里程计话题数据
    odom.header.stamp = ros::Time::now(); 
    odom.header.frame_id = odom_frame_id; // Odometer TF parent coordinates //里程计TF父坐标
    odom.pose.pose.position.x = Robot_Pos.X; //Position //位置
    odom.pose.pose.position.y = Robot_Pos.Y;
    odom.pose.pose.position.z = Robot_Pos.Z;
    odom.pose.pose.orientation = odom_quat; //Posture, Quaternion converted by Z-axis rotation //姿态，通过Z轴转角转换的四元数

    odom.child_frame_id = robot_frame_id; // Odometer TF subcoordinates //里程计TF子坐标
    odom.twist.twist.linear.x =  Robot_Vel.X; //Speed in the X direction //X方向速度
    odom.twist.twist.linear.y =  Robot_Vel.Y; //Speed in the Y direction //Y方向速度
    odom.twist.twist.angular.z = Robot_Vel.Z; //Angular velocity around the Z axis //绕Z轴角速度 

    //There are two types of this matrix, which are used when the robot is at rest and when it is moving.Extended Kalman Filtering officially provides 2 matrices for the robot_pose_ekf feature pack
    //这个矩阵有两种，分别在机器人静止和运动的时候使用。扩展卡尔曼滤波官方提供的2个矩阵，用于robot_pose_ekf功能包
    if(Robot_Vel.X== 0&&Robot_Vel.Y== 0&&Robot_Vel.Z== 0)
      //If the velocity is zero, it means that the error of the encoder will be relatively small, and the data of the encoder will be considered more reliable
      //如果velocity是零，说明编码器的误差会比较小，认为编码器数据更可靠
      memcpy(&odom.pose.covariance, odom_pose_covariance2, sizeof(odom_pose_covariance2)),
      memcpy(&odom.twist.covariance, odom_twist_covariance2, sizeof(odom_twist_covariance2));
    else
      //If the velocity of the trolley is non-zero, considering the sliding error that may be brought by the encoder in motion, the data of IMU is considered to be more reliable
      //如果小车velocity非零，考虑到运动中编码器可能带来的滑动误差，认为imu的数据更可靠
      memcpy(&odom.pose.covariance, odom_pose_covariance, sizeof(odom_pose_covariance)),
      memcpy(&odom.twist.covariance, odom_twist_covariance, sizeof(odom_twist_covariance));       
    odom_publisher.publish(odom); //Pub odometer topic //发布里程计话题
}
```

## 3. 查看里程计、IMU 话题信息  

启动初始化节点(wheeltec 终端)：

```bash
roslaunch turn_on_wheeltec_robot turn_on_wheeltec_robot.launch  
```

查看里程计信息：

```bash
rostopic echo /odom
```

查看 IMU 信息： 

```bash
rostopic echo /mobile_base/sensors/imu_data
```


查看小车电压：

```bash
rostopic echo /PowerVoltage  
```

查看数据结构

```bash
rostopic info /odom
rosmsg show nav_msgs/Odometry
```

## 4. 键盘控制小车移动

功能包：wheeltec_robot_rc

启动初始化节点(wheeltec终端)：

```bash
roslaunch turn_on_wheeltec_robot turn_on_wheeltec_robot.launch
```

按键控制(wheeltec终端)：

```bash
roslaunch wheeltec_robot_rc keyboard_teleop.launch
```

### turtlebot_teleop_key.py

```py
import rospy

from geometry_msgs.msg import Twist

import sys, select, termios, tty

msg = """
Control Your Turtlebot!
---------------------------
Moving around:
   u    i    o
   j    k    l
   m    ,    .

q/z : increase/decrease max speeds by 10%
w/x : increase/decrease only linear speed by 10%
e/c : increase/decrease only angular speed by 10%
space key, k : force stop
anything else : stop smoothly
b : switch to OmniMode/CommonMode
CTRL-C to quit
"""
Omni = 0 #全向移动模式

#键值对应移动/转向方向
moveBindings = {
        'i':( 1, 0),
        'o':( 1,-1),
        'j':( 0, 1),
        'l':( 0,-1),
        'u':( 1, 1),
        ',':(-1, 0),
        '.':(-1, 1),
        'm':(-1,-1),
           }

#键值对应速度增量
speedBindings={
        'q':(1.1,1.1),
        'z':(0.9,0.9),
        'w':(1.1,1),
        'x':(0.9,1),
        'e':(1,  1.1),
        'c':(1,  0.9),
          }

#获取键值函数
def getKey():
    tty.setraw(sys.stdin.fileno())
    rlist, _, _ = select.select([sys.stdin], [], [], 0.1)
    if rlist:
        key = sys.stdin.read(1)
    else:
        key = ''

    termios.tcsetattr(sys.stdin, termios.TCSADRAIN, settings)
    return key


speed = 0.2 #默认移动速度 m/s
turn  = 0.5   #默认转向速度 rad/s
#以字符串格式返回当前速度
def vels(speed,turn):
    return "currently:\tspeed %s\tturn %s " % (speed,turn)

#主函数
if __name__=="__main__":
    settings = termios.tcgetattr(sys.stdin) #获取键值初始化，读取终端相关属性
    
    rospy.init_node('turtlebot_teleop') #创建ROS节点
    pub = rospy.Publisher('~cmd_vel', Twist, queue_size=5) #创建速度话题发布者，'~cmd_vel'='节点名/cmd_vel'

    x      = 0   #前进后退方向
    th     = 0   #转向/横向移动方向
    count  = 0   #键值不再范围计数
    target_speed = 0 #前进后退目标速度
    target_turn  = 0 #转向目标速度
    target_HorizonMove = 0 #横向移动目标速度
    control_speed = 0 #前进后退实际控制速度
    control_turn  = 0 #转向实际控制速度
    control_HorizonMove = 0 #横向移动实际控制速度
    try:
        print(msg) #打印控制说明
        print(vels(speed,turn)) #打印当前速度
        while(1):
            key = getKey() #获取键值

            #切换是否为全向移动模式，全向轮/麦轮小车可以加入全向移动模式
            if key=='b':               
                Omni=~Omni
                if Omni: 
                    print("Switch to OmniMode")
                    moveBindings['.']=[-1,-1]
                    moveBindings['m']=[-1, 1]
                else:
                    print("Switch to CommonMode")
                    moveBindings['.']=[-1, 1]
                    moveBindings['m']=[-1,-1]
            
            #判断键值是否在移动/转向方向键值内
            if key in moveBindings.keys():
                x  = moveBindings[key][0]
                th = moveBindings[key][1]
                count = 0

            #判断键值是否在速度增量键值内
            elif key in speedBindings.keys():
                speed = speed * speedBindings[key][0]
                turn  = turn  * speedBindings[key][1]
                count = 0
                print(vels(speed,turn)) #速度发生变化，打印出来

            #空键值/'k',相关变量置0
            elif key == ' ' or key == 'k' :
                x  = 0
                th = 0
                control_speed = 0
                control_turn  = 0
                HorizonMove   = 0

            #长期识别到不明键值，相关变量置0
            else:
                count = count + 1
                if count > 4:
                    x  = 0
                    th = 0
                if (key == '\x03'):
                    break

            #根据速度与方向计算目标速度
            target_speed = speed * x
            target_turn  = turn * th
            target_HorizonMove = speed*th

            #平滑控制，计算前进后退实际控制速度
            if target_speed > control_speed:
                control_speed = min( target_speed, control_speed + 0.1 )
            elif target_speed < control_speed:
                control_speed = max( target_speed, control_speed - 0.1 )
            else:
                control_speed = target_speed

            #平滑控制，计算转向实际控制速度
            if target_turn > control_turn:
                control_turn = min( target_turn, control_turn + 0.5 )
            elif target_turn < control_turn:
                control_turn = max( target_turn, control_turn - 0.5 )
            else:
                control_turn = target_turn

            #平滑控制，计算横向移动实际控制速度
            if target_HorizonMove > control_HorizonMove:
                control_HorizonMove = min( target_HorizonMove, control_HorizonMove + 0.1 )
            elif target_HorizonMove < control_HorizonMove:
                control_HorizonMove = max( target_HorizonMove, control_HorizonMove - 0.1 )
            else:
                control_HorizonMove = target_HorizonMove
         
            twist = Twist() #创建ROS速度话题变量
            #根据是否全向移动模式，给速度话题变量赋值
            if Omni==0:
                twist.linear.x  = control_speed; twist.linear.y = 0;  twist.linear.z = 0
                twist.angular.x = 0;             twist.angular.y = 0; twist.angular.z = control_turn
            else:
                twist.linear.x  = control_speed; twist.linear.y = control_HorizonMove; twist.linear.z = 0
                twist.angular.x = 0;             twist.angular.y = 0;                  twist.angular.z = 0

            pub.publish(twist) #ROS发布速度话题

    #运行出现问题则程序终止并打印相关错误信息
    except Exception as e:
        print(e)

    #程序结束前发布速度为0的速度话题
    finally:
        twist = Twist()
        twist.linear.x = 0;  twist.linear.y = 0;  twist.linear.z = 0
        twist.angular.x = 0; twist.angular.y = 0; twist.angular.z = 0
        pub.publish(twist)

    #程序结束前设置终端相关属性
    termios.tcsetattr(sys.stdin, termios.TCSADRAIN, settings)
```

## 5. 发布话题控制小车移动
启动初始化节点(wheeltec终端)：
```bash
roslaunch turn_on_wheeltec_robot turn_on_wheeltec_robot.launch
```
发布节点(命令行)控制小车移动(wheeltec/passoni终端)：
```bash
rostopic pub -r /cmd_vel geometry_msgs/Twist
```
-r无法使用tab键自动补全命令，话题名称补全、数据格式补全、数据内容补全，都需要按一次tab键
删除了速度平滑功能，所以手动发布速度命令后，如果希望小车停止运动，需要再发送一次速度为0的速度命令

## 6. 激光雷达建图
启动激光建图
```bash
roslaunch turn_on_wheeltec_robot mapping.launch 
```
查看建图效果：rviz(passoni)
可以使用键盘控制、APP遥控、PS2遥控、航模遥控进行控制小车运动。

建图完成，保存地图
  ①一键保存：

  ```bash
  roslaunch turn_on_wheeltec_robot map_saver.launch 
  ```

  ②打开地图路径：cd /home/wheeltec/wheeltec_robot/src/turn_on_wheeltec_robot/map     

保存地图：rosrun map_server map_saver -f 地图名

```bash
rosrun map_server map_saver -f 地图名
```

注：地图文件可以使用PhotoShop进行编辑

```txt
建图
mapping.launch
 小车初始化节点：turn_on_wheeltec_robot.launch
 雷达节点：rplidar.launch
 gmapping建图节点：algorithm_gmapping.launch
```

## 7. 自主建图

把小车放置在地图起点/rviz手动设置起点

运行导航：

```bash
roslaunch turn_on_wheeltec_robot navigation.launch
```

手动发布目标点

```bash
rostopic pub /move_base_simple/goal
```

四元数
x  = ax * sin(theta/2)    
y  = ay * sin(theta/2)    
z  = 1* sin(180°/2)  =1
w = cos(180°/2)  =0

### WHEELTEC.yaml

```yaml
image: /home/wheeltec/wheeltec_robot/src/turn_on_wheeltec_robot/map/WHEELTEC.pgm
#地图分辨率,每像素代表0.05
resolution: 0.050000
#地图右下角坐标值,修改该值可以改变地图原点
origin: [-5.000000, -4.000000, 0.000000]
#大于该值认为是占用的， 0-1对应图片灰度值0-255, rviz内表现为黑色障碍
occupied_thresh: 0.65
#小于该值认为是自由的,对应图片灰度值o-255, rviz内表现为白色自由空间
free_thresh: 0.196
#占用/自由的判断是否取反，例如negate为1时，小于0.65认为是占用的，大于0.196认为是自由的
negate: 0
```

## 8. 多点导航

把小车放置在地图起点/rviz手动设置起点

运行导航：
roslaunch turn_on_wheeltec_robot navigation.launch

rviz添加path_ponit(MarkerArray数据格式)话题订阅，进行可视化

使用rviz的Publish Point功能
