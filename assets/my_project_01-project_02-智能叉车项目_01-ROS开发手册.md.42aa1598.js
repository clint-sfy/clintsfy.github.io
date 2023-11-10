import{_ as t}from"./chunks/ArticleMetadata.59a467b2.js";import{_ as c,v as l,b as r,t as i,O as y,F as p,L as d,R as _,M as A,C as u,B as D}from"./chunks/framework.5cbdba25.js";import"./chunks/md5.02486a14.js";const M=JSON.parse('{"title":"ROS开发手册","description":"","frontmatter":{"title":"ROS开发手册","author":"阿源","date":"2023/11/10 12:00","categories":["个人项目"],"tags":["个人项目","ROS"]},"headers":[],"relativePath":"my_project/01-project/02-智能叉车项目/01-ROS开发手册.md","filePath":"my_project/01-project/02-智能叉车项目/01-ROS开发手册.md","lastUpdated":1699620752000}'),b={name:"my_project/01-project/02-智能叉车项目/01-ROS开发手册.md"},C=p("h1",{id:"ros开发手册",tabindex:"-1"},[d("ROS开发手册 "),p("a",{class:"header-anchor",href:"#ros开发手册","aria-label":'Permalink to "ROS开发手册"'},"​")],-1),h=_(`<h2 id="_1-roslaunch与参数服务器" tabindex="-1">1.roslaunch与参数服务器 <a class="header-anchor" href="#_1-roslaunch与参数服务器" aria-label="Permalink to &quot;1.roslaunch与参数服务器&quot;">​</a></h2><h2 id="_2-核心代码" tabindex="-1">2. 核心代码 <a class="header-anchor" href="#_2-核心代码" aria-label="Permalink to &quot;2. 核心代码&quot;">​</a></h2><h3 id="循环控制" tabindex="-1">循环控制 <a class="header-anchor" href="#循环控制" aria-label="Permalink to &quot;循环控制&quot;">​</a></h3><div class="language-c++ vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">c++</span><pre class="shiki github-dark-dimmed vp-code-dark"><code><span class="line"><span style="color:#adbac7;">void turn_on_robot::Control()</span></span>
<span class="line"><span style="color:#adbac7;">{</span></span>
<span class="line"><span style="color:#adbac7;">  while(ros::ok())</span></span>
<span class="line"><span style="color:#adbac7;">  {</span></span>
<span class="line"><span style="color:#adbac7;">    if (true == Get_Sensor_Data_New()) //The serial port reads and verifies the data sent by the lower computer, and then the data is converted to international units</span></span>
<span class="line"><span style="color:#adbac7;">                                       //通过串口读取并校验下位机发送过来的数据，然后数据转换为国际单位</span></span>
<span class="line"><span style="color:#adbac7;">    {</span></span>
<span class="line"><span style="color:#adbac7;">      _Now = ros::Time::now();</span></span>
<span class="line"><span style="color:#adbac7;">      if(_Last_Time.toSec()==0) _Last_Time=_Now; //Perform this operation when entering for the first time to avoid excessive integration time</span></span>
<span class="line"><span style="color:#adbac7;">                                                 //首次进入时进行此操作，避免积分时间过大</span></span>
<span class="line"><span style="color:#adbac7;">      Sampling_Time = (_Now - _Last_Time).toSec(); //Retrieves time interval, which is used to integrate velocity to obtain displacement (mileage) </span></span>
<span class="line"><span style="color:#adbac7;">                                                   //获取时间间隔，用于积分速度获得位移(里程)</span></span>
<span class="line"><span style="color:#adbac7;">      </span></span>
<span class="line"><span style="color:#adbac7;">      //Odometer correction parameters</span></span>
<span class="line"><span style="color:#adbac7;">      //里程计误差修正</span></span>
<span class="line"><span style="color:#adbac7;">      Robot_Vel.X=Robot_Vel.X*odom_x_scale;</span></span>
<span class="line"><span style="color:#adbac7;">      Robot_Vel.Y=Robot_Vel.Y*odom_y_scale;</span></span>
<span class="line"><span style="color:#adbac7;">      if(Robot_Vel.Z&gt;=0)</span></span>
<span class="line"><span style="color:#adbac7;">        Robot_Vel.Z=Robot_Vel.Z*odom_z_scale_positive;</span></span>
<span class="line"><span style="color:#adbac7;">      else</span></span>
<span class="line"><span style="color:#adbac7;">        Robot_Vel.Z=Robot_Vel.Z*odom_z_scale_negative;</span></span>
<span class="line"><span style="color:#adbac7;"></span></span>
<span class="line"><span style="color:#adbac7;">      //Speed * Time = displacement (odometer)</span></span>
<span class="line"><span style="color:#adbac7;">      //速度*时间=位移（里程计）</span></span>
<span class="line"><span style="color:#adbac7;">      Robot_Pos.X+=(Robot_Vel.X * cos(Robot_Pos.Z) - Robot_Vel.Y * sin(Robot_Pos.Z)) * Sampling_Time; //Calculate the displacement in the X direction, unit: m //计算X方向的位移，单位：m</span></span>
<span class="line"><span style="color:#adbac7;">      Robot_Pos.Y+=(Robot_Vel.X * sin(Robot_Pos.Z) + Robot_Vel.Y * cos(Robot_Pos.Z)) * Sampling_Time; //Calculate the displacement in the Y direction, unit: m //计算Y方向的位移，单位：m</span></span>
<span class="line"><span style="color:#adbac7;">      Robot_Pos.Z+=Robot_Vel.Z * Sampling_Time; //The angular displacement about the Z axis, in rad //绕Z轴的角位移，单位：rad </span></span>
<span class="line"><span style="color:#adbac7;"></span></span>
<span class="line"><span style="color:#adbac7;">      //Calculate the three-axis attitude from the IMU with the angular velocity around the three-axis and the three-axis acceleration</span></span>
<span class="line"><span style="color:#adbac7;">      //通过IMU绕三轴角速度与三轴加速度计算三轴姿态</span></span>
<span class="line"><span style="color:#adbac7;">      Quaternion_Solution(Mpu6050.angular_velocity.x, Mpu6050.angular_velocity.y, Mpu6050.angular_velocity.z,\\</span></span>
<span class="line"><span style="color:#adbac7;">                Mpu6050.linear_acceleration.x, Mpu6050.linear_acceleration.y, Mpu6050.linear_acceleration.z);</span></span>
<span class="line"><span style="color:#adbac7;"></span></span>
<span class="line"><span style="color:#adbac7;">      Publish_Odom();      //Pub the speedometer topic //发布里程计话题</span></span>
<span class="line"><span style="color:#adbac7;">      Publish_ImuSensor(); //Pub the IMU topic //发布IMU话题    </span></span>
<span class="line"><span style="color:#adbac7;">      Publish_Voltage();   //Pub the topic of power supply voltage //发布电源电压话题</span></span>
<span class="line"><span style="color:#adbac7;"></span></span>
<span class="line"><span style="color:#adbac7;">      _Last_Time = _Now; //Record the time and use it to calculate the time interval //记录时间，用于计算时间间隔</span></span>
<span class="line"><span style="color:#adbac7;">    }</span></span>
<span class="line"><span style="color:#adbac7;">    </span></span>
<span class="line"><span style="color:#adbac7;">    ros::spinOnce();   //The loop waits for the callback function //循环等待回调函数</span></span>
<span class="line"><span style="color:#adbac7;">    }</span></span>
<span class="line"><span style="color:#adbac7;">}</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#24292e;">void turn_on_robot::Control()</span></span>
<span class="line"><span style="color:#24292e;">{</span></span>
<span class="line"><span style="color:#24292e;">  while(ros::ok())</span></span>
<span class="line"><span style="color:#24292e;">  {</span></span>
<span class="line"><span style="color:#24292e;">    if (true == Get_Sensor_Data_New()) //The serial port reads and verifies the data sent by the lower computer, and then the data is converted to international units</span></span>
<span class="line"><span style="color:#24292e;">                                       //通过串口读取并校验下位机发送过来的数据，然后数据转换为国际单位</span></span>
<span class="line"><span style="color:#24292e;">    {</span></span>
<span class="line"><span style="color:#24292e;">      _Now = ros::Time::now();</span></span>
<span class="line"><span style="color:#24292e;">      if(_Last_Time.toSec()==0) _Last_Time=_Now; //Perform this operation when entering for the first time to avoid excessive integration time</span></span>
<span class="line"><span style="color:#24292e;">                                                 //首次进入时进行此操作，避免积分时间过大</span></span>
<span class="line"><span style="color:#24292e;">      Sampling_Time = (_Now - _Last_Time).toSec(); //Retrieves time interval, which is used to integrate velocity to obtain displacement (mileage) </span></span>
<span class="line"><span style="color:#24292e;">                                                   //获取时间间隔，用于积分速度获得位移(里程)</span></span>
<span class="line"><span style="color:#24292e;">      </span></span>
<span class="line"><span style="color:#24292e;">      //Odometer correction parameters</span></span>
<span class="line"><span style="color:#24292e;">      //里程计误差修正</span></span>
<span class="line"><span style="color:#24292e;">      Robot_Vel.X=Robot_Vel.X*odom_x_scale;</span></span>
<span class="line"><span style="color:#24292e;">      Robot_Vel.Y=Robot_Vel.Y*odom_y_scale;</span></span>
<span class="line"><span style="color:#24292e;">      if(Robot_Vel.Z&gt;=0)</span></span>
<span class="line"><span style="color:#24292e;">        Robot_Vel.Z=Robot_Vel.Z*odom_z_scale_positive;</span></span>
<span class="line"><span style="color:#24292e;">      else</span></span>
<span class="line"><span style="color:#24292e;">        Robot_Vel.Z=Robot_Vel.Z*odom_z_scale_negative;</span></span>
<span class="line"><span style="color:#24292e;"></span></span>
<span class="line"><span style="color:#24292e;">      //Speed * Time = displacement (odometer)</span></span>
<span class="line"><span style="color:#24292e;">      //速度*时间=位移（里程计）</span></span>
<span class="line"><span style="color:#24292e;">      Robot_Pos.X+=(Robot_Vel.X * cos(Robot_Pos.Z) - Robot_Vel.Y * sin(Robot_Pos.Z)) * Sampling_Time; //Calculate the displacement in the X direction, unit: m //计算X方向的位移，单位：m</span></span>
<span class="line"><span style="color:#24292e;">      Robot_Pos.Y+=(Robot_Vel.X * sin(Robot_Pos.Z) + Robot_Vel.Y * cos(Robot_Pos.Z)) * Sampling_Time; //Calculate the displacement in the Y direction, unit: m //计算Y方向的位移，单位：m</span></span>
<span class="line"><span style="color:#24292e;">      Robot_Pos.Z+=Robot_Vel.Z * Sampling_Time; //The angular displacement about the Z axis, in rad //绕Z轴的角位移，单位：rad </span></span>
<span class="line"><span style="color:#24292e;"></span></span>
<span class="line"><span style="color:#24292e;">      //Calculate the three-axis attitude from the IMU with the angular velocity around the three-axis and the three-axis acceleration</span></span>
<span class="line"><span style="color:#24292e;">      //通过IMU绕三轴角速度与三轴加速度计算三轴姿态</span></span>
<span class="line"><span style="color:#24292e;">      Quaternion_Solution(Mpu6050.angular_velocity.x, Mpu6050.angular_velocity.y, Mpu6050.angular_velocity.z,\\</span></span>
<span class="line"><span style="color:#24292e;">                Mpu6050.linear_acceleration.x, Mpu6050.linear_acceleration.y, Mpu6050.linear_acceleration.z);</span></span>
<span class="line"><span style="color:#24292e;"></span></span>
<span class="line"><span style="color:#24292e;">      Publish_Odom();      //Pub the speedometer topic //发布里程计话题</span></span>
<span class="line"><span style="color:#24292e;">      Publish_ImuSensor(); //Pub the IMU topic //发布IMU话题    </span></span>
<span class="line"><span style="color:#24292e;">      Publish_Voltage();   //Pub the topic of power supply voltage //发布电源电压话题</span></span>
<span class="line"><span style="color:#24292e;"></span></span>
<span class="line"><span style="color:#24292e;">      _Last_Time = _Now; //Record the time and use it to calculate the time interval //记录时间，用于计算时间间隔</span></span>
<span class="line"><span style="color:#24292e;">    }</span></span>
<span class="line"><span style="color:#24292e;">    </span></span>
<span class="line"><span style="color:#24292e;">    ros::spinOnce();   //The loop waits for the callback function //循环等待回调函数</span></span>
<span class="line"><span style="color:#24292e;">    }</span></span>
<span class="line"><span style="color:#24292e;">}</span></span></code></pre></div><h3 id="构造函数" tabindex="-1">构造函数 <a class="header-anchor" href="#构造函数" aria-label="Permalink to &quot;构造函数&quot;">​</a></h3><p>只执行一次，用于初始化</p><div class="language-c++ vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">c++</span><pre class="shiki github-dark-dimmed vp-code-dark"><code><span class="line"><span style="color:#adbac7;">turn_on_robot::turn_on_robot():Sampling_Time(0),Power_voltage(0)</span></span>
<span class="line"><span style="color:#adbac7;">{</span></span>
<span class="line"><span style="color:#adbac7;">  //Clear the data</span></span>
<span class="line"><span style="color:#adbac7;">  //清空数据</span></span>
<span class="line"><span style="color:#adbac7;">  memset(&amp;Robot_Pos, 0, sizeof(Robot_Pos));</span></span>
<span class="line"><span style="color:#adbac7;">  memset(&amp;Robot_Vel, 0, sizeof(Robot_Vel));</span></span>
<span class="line"><span style="color:#adbac7;">  memset(&amp;Receive_Data, 0, sizeof(Receive_Data)); </span></span>
<span class="line"><span style="color:#adbac7;">  memset(&amp;Send_Data, 0, sizeof(Send_Data));</span></span>
<span class="line"><span style="color:#adbac7;">  memset(&amp;Mpu6050_Data, 0, sizeof(Mpu6050_Data));</span></span>
<span class="line"><span style="color:#adbac7;"></span></span>
<span class="line"><span style="color:#adbac7;">  ros::NodeHandle private_nh(&quot;~&quot;); //Create a node handle //创建节点句柄</span></span>
<span class="line"><span style="color:#adbac7;">  //The private_nh.param() entry parameter corresponds to the initial value of the name of the parameter variable on the parameter server</span></span>
<span class="line"><span style="color:#adbac7;">  //private_nh.param()入口参数分别对应：参数服务器上的名称  参数变量名  初始值</span></span>
<span class="line"><span style="color:#adbac7;">  private_nh.param&lt;std::string&gt;(&quot;usart_port_name&quot;,  usart_port_name,  &quot;/dev/wheeltec_controller&quot;); //Fixed serial port number //固定串口号</span></span>
<span class="line"><span style="color:#adbac7;">  private_nh.param&lt;int&gt;        (&quot;serial_baud_rate&quot;, serial_baud_rate, 115200); //Communicate baud rate 115200 to the lower machine //和下位机通信波特率115200</span></span>
<span class="line"><span style="color:#adbac7;">  private_nh.param&lt;std::string&gt;(&quot;odom_frame_id&quot;,    odom_frame_id,    &quot;odom_combined&quot;);      //The odometer topic corresponds to the parent TF coordinate //里程计话题对应父TF坐标</span></span>
<span class="line"><span style="color:#adbac7;">  private_nh.param&lt;std::string&gt;(&quot;robot_frame_id&quot;,   robot_frame_id,   &quot;base_footprint&quot;); //The odometer topic corresponds to sub-TF coordinates //里程计话题对应子TF坐标</span></span>
<span class="line"><span style="color:#adbac7;">  private_nh.param&lt;std::string&gt;(&quot;gyro_frame_id&quot;,    gyro_frame_id,    &quot;gyro_link&quot;); //IMU topics correspond to TF coordinates //IMU话题对应TF坐标</span></span>
<span class="line"><span style="color:#adbac7;"></span></span>
<span class="line"><span style="color:#adbac7;">  //Odometer correction parameters</span></span>
<span class="line"><span style="color:#adbac7;">  //里程计误差修正参数</span></span>
<span class="line"><span style="color:#adbac7;">  private_nh.param&lt;float&gt;(&quot;odom_x_scale&quot;,    odom_x_scale,    1.0); </span></span>
<span class="line"><span style="color:#adbac7;">  private_nh.param&lt;float&gt;(&quot;odom_y_scale&quot;,    odom_y_scale,    1.0); </span></span>
<span class="line"><span style="color:#adbac7;">  private_nh.param&lt;float&gt;(&quot;odom_z_scale_positive&quot;,    odom_z_scale_positive,    1.0); </span></span>
<span class="line"><span style="color:#adbac7;">  private_nh.param&lt;float&gt;(&quot;odom_z_scale_negative&quot;,    odom_z_scale_negative,    1.0); </span></span>
<span class="line"><span style="color:#adbac7;"></span></span>
<span class="line"><span style="color:#adbac7;"></span></span>
<span class="line"><span style="color:#adbac7;">  voltage_publisher = n.advertise&lt;std_msgs::Float32&gt;(&quot;PowerVoltage&quot;, 10); //Create a battery-voltage topic publisher //创建电池电压话题发布者</span></span>
<span class="line"><span style="color:#adbac7;">  odom_publisher    = n.advertise&lt;nav_msgs::Odometry&gt;(&quot;odom&quot;, 50); //Create the odometer topic publisher //创建里程计话题发布者</span></span>
<span class="line"><span style="color:#adbac7;">  imu_publisher     = n.advertise&lt;sensor_msgs::Imu&gt;(&quot;imu&quot;, 20); //Create an IMU topic publisher //创建IMU话题发布者</span></span>
<span class="line"><span style="color:#adbac7;"></span></span>
<span class="line"><span style="color:#adbac7;">  //Set the velocity control command callback function</span></span>
<span class="line"><span style="color:#adbac7;">  //速度控制命令订阅回调函数设置</span></span>
<span class="line"><span style="color:#adbac7;">  Cmd_Vel_Sub     = n.subscribe(&quot;cmd_vel&quot;,     100, &amp;turn_on_robot::Cmd_Vel_Callback, this); </span></span>
<span class="line"><span style="color:#adbac7;"></span></span>
<span class="line"><span style="color:#adbac7;">  ROS_INFO_STREAM(&quot;Data ready&quot;); //Prompt message //提示信息</span></span>
<span class="line"><span style="color:#adbac7;">  </span></span>
<span class="line"><span style="color:#adbac7;">  try</span></span>
<span class="line"><span style="color:#adbac7;">  { </span></span>
<span class="line"><span style="color:#adbac7;">    //Attempts to initialize and open the serial port //尝试初始化与开启串口</span></span>
<span class="line"><span style="color:#adbac7;">    Stm32_Serial.setPort(usart_port_name); //Select the serial port number to enable //选择要开启的串口号</span></span>
<span class="line"><span style="color:#adbac7;">    Stm32_Serial.setBaudrate(serial_baud_rate); //Set the baud rate //设置波特率</span></span>
<span class="line"><span style="color:#adbac7;">    serial::Timeout _time = serial::Timeout::simpleTimeout(2000); //Timeout //超时等待</span></span>
<span class="line"><span style="color:#adbac7;">    Stm32_Serial.setTimeout(_time);</span></span>
<span class="line"><span style="color:#adbac7;">    Stm32_Serial.open(); //Open the serial port //开启串口</span></span>
<span class="line"><span style="color:#adbac7;">  }</span></span>
<span class="line"><span style="color:#adbac7;">  catch (serial::IOException&amp; e)</span></span>
<span class="line"><span style="color:#adbac7;">  {</span></span>
<span class="line"><span style="color:#adbac7;">    ROS_ERROR_STREAM(&quot;wheeltec_robot can not open serial port,Please check the serial port cable! &quot;); //If opening the serial port fails, an error message is printed //如果开启串口失败，打印错误信息</span></span>
<span class="line"><span style="color:#adbac7;">  }</span></span>
<span class="line"><span style="color:#adbac7;">  if(Stm32_Serial.isOpen())</span></span>
<span class="line"><span style="color:#adbac7;">  {</span></span>
<span class="line"><span style="color:#adbac7;">    ROS_INFO_STREAM(&quot;wheeltec_robot serial port opened&quot;); //Serial port opened successfully //串口开启成功提示</span></span>
<span class="line"><span style="color:#adbac7;">  }</span></span>
<span class="line"><span style="color:#adbac7;">}</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#24292e;">turn_on_robot::turn_on_robot():Sampling_Time(0),Power_voltage(0)</span></span>
<span class="line"><span style="color:#24292e;">{</span></span>
<span class="line"><span style="color:#24292e;">  //Clear the data</span></span>
<span class="line"><span style="color:#24292e;">  //清空数据</span></span>
<span class="line"><span style="color:#24292e;">  memset(&amp;Robot_Pos, 0, sizeof(Robot_Pos));</span></span>
<span class="line"><span style="color:#24292e;">  memset(&amp;Robot_Vel, 0, sizeof(Robot_Vel));</span></span>
<span class="line"><span style="color:#24292e;">  memset(&amp;Receive_Data, 0, sizeof(Receive_Data)); </span></span>
<span class="line"><span style="color:#24292e;">  memset(&amp;Send_Data, 0, sizeof(Send_Data));</span></span>
<span class="line"><span style="color:#24292e;">  memset(&amp;Mpu6050_Data, 0, sizeof(Mpu6050_Data));</span></span>
<span class="line"><span style="color:#24292e;"></span></span>
<span class="line"><span style="color:#24292e;">  ros::NodeHandle private_nh(&quot;~&quot;); //Create a node handle //创建节点句柄</span></span>
<span class="line"><span style="color:#24292e;">  //The private_nh.param() entry parameter corresponds to the initial value of the name of the parameter variable on the parameter server</span></span>
<span class="line"><span style="color:#24292e;">  //private_nh.param()入口参数分别对应：参数服务器上的名称  参数变量名  初始值</span></span>
<span class="line"><span style="color:#24292e;">  private_nh.param&lt;std::string&gt;(&quot;usart_port_name&quot;,  usart_port_name,  &quot;/dev/wheeltec_controller&quot;); //Fixed serial port number //固定串口号</span></span>
<span class="line"><span style="color:#24292e;">  private_nh.param&lt;int&gt;        (&quot;serial_baud_rate&quot;, serial_baud_rate, 115200); //Communicate baud rate 115200 to the lower machine //和下位机通信波特率115200</span></span>
<span class="line"><span style="color:#24292e;">  private_nh.param&lt;std::string&gt;(&quot;odom_frame_id&quot;,    odom_frame_id,    &quot;odom_combined&quot;);      //The odometer topic corresponds to the parent TF coordinate //里程计话题对应父TF坐标</span></span>
<span class="line"><span style="color:#24292e;">  private_nh.param&lt;std::string&gt;(&quot;robot_frame_id&quot;,   robot_frame_id,   &quot;base_footprint&quot;); //The odometer topic corresponds to sub-TF coordinates //里程计话题对应子TF坐标</span></span>
<span class="line"><span style="color:#24292e;">  private_nh.param&lt;std::string&gt;(&quot;gyro_frame_id&quot;,    gyro_frame_id,    &quot;gyro_link&quot;); //IMU topics correspond to TF coordinates //IMU话题对应TF坐标</span></span>
<span class="line"><span style="color:#24292e;"></span></span>
<span class="line"><span style="color:#24292e;">  //Odometer correction parameters</span></span>
<span class="line"><span style="color:#24292e;">  //里程计误差修正参数</span></span>
<span class="line"><span style="color:#24292e;">  private_nh.param&lt;float&gt;(&quot;odom_x_scale&quot;,    odom_x_scale,    1.0); </span></span>
<span class="line"><span style="color:#24292e;">  private_nh.param&lt;float&gt;(&quot;odom_y_scale&quot;,    odom_y_scale,    1.0); </span></span>
<span class="line"><span style="color:#24292e;">  private_nh.param&lt;float&gt;(&quot;odom_z_scale_positive&quot;,    odom_z_scale_positive,    1.0); </span></span>
<span class="line"><span style="color:#24292e;">  private_nh.param&lt;float&gt;(&quot;odom_z_scale_negative&quot;,    odom_z_scale_negative,    1.0); </span></span>
<span class="line"><span style="color:#24292e;"></span></span>
<span class="line"><span style="color:#24292e;"></span></span>
<span class="line"><span style="color:#24292e;">  voltage_publisher = n.advertise&lt;std_msgs::Float32&gt;(&quot;PowerVoltage&quot;, 10); //Create a battery-voltage topic publisher //创建电池电压话题发布者</span></span>
<span class="line"><span style="color:#24292e;">  odom_publisher    = n.advertise&lt;nav_msgs::Odometry&gt;(&quot;odom&quot;, 50); //Create the odometer topic publisher //创建里程计话题发布者</span></span>
<span class="line"><span style="color:#24292e;">  imu_publisher     = n.advertise&lt;sensor_msgs::Imu&gt;(&quot;imu&quot;, 20); //Create an IMU topic publisher //创建IMU话题发布者</span></span>
<span class="line"><span style="color:#24292e;"></span></span>
<span class="line"><span style="color:#24292e;">  //Set the velocity control command callback function</span></span>
<span class="line"><span style="color:#24292e;">  //速度控制命令订阅回调函数设置</span></span>
<span class="line"><span style="color:#24292e;">  Cmd_Vel_Sub     = n.subscribe(&quot;cmd_vel&quot;,     100, &amp;turn_on_robot::Cmd_Vel_Callback, this); </span></span>
<span class="line"><span style="color:#24292e;"></span></span>
<span class="line"><span style="color:#24292e;">  ROS_INFO_STREAM(&quot;Data ready&quot;); //Prompt message //提示信息</span></span>
<span class="line"><span style="color:#24292e;">  </span></span>
<span class="line"><span style="color:#24292e;">  try</span></span>
<span class="line"><span style="color:#24292e;">  { </span></span>
<span class="line"><span style="color:#24292e;">    //Attempts to initialize and open the serial port //尝试初始化与开启串口</span></span>
<span class="line"><span style="color:#24292e;">    Stm32_Serial.setPort(usart_port_name); //Select the serial port number to enable //选择要开启的串口号</span></span>
<span class="line"><span style="color:#24292e;">    Stm32_Serial.setBaudrate(serial_baud_rate); //Set the baud rate //设置波特率</span></span>
<span class="line"><span style="color:#24292e;">    serial::Timeout _time = serial::Timeout::simpleTimeout(2000); //Timeout //超时等待</span></span>
<span class="line"><span style="color:#24292e;">    Stm32_Serial.setTimeout(_time);</span></span>
<span class="line"><span style="color:#24292e;">    Stm32_Serial.open(); //Open the serial port //开启串口</span></span>
<span class="line"><span style="color:#24292e;">  }</span></span>
<span class="line"><span style="color:#24292e;">  catch (serial::IOException&amp; e)</span></span>
<span class="line"><span style="color:#24292e;">  {</span></span>
<span class="line"><span style="color:#24292e;">    ROS_ERROR_STREAM(&quot;wheeltec_robot can not open serial port,Please check the serial port cable! &quot;); //If opening the serial port fails, an error message is printed //如果开启串口失败，打印错误信息</span></span>
<span class="line"><span style="color:#24292e;">  }</span></span>
<span class="line"><span style="color:#24292e;">  if(Stm32_Serial.isOpen())</span></span>
<span class="line"><span style="color:#24292e;">  {</span></span>
<span class="line"><span style="color:#24292e;">    ROS_INFO_STREAM(&quot;wheeltec_robot serial port opened&quot;); //Serial port opened successfully //串口开启成功提示</span></span>
<span class="line"><span style="color:#24292e;">  }</span></span>
<span class="line"><span style="color:#24292e;">}</span></span></code></pre></div><h3 id="析构函数" tabindex="-1">析构函数 <a class="header-anchor" href="#析构函数" aria-label="Permalink to &quot;析构函数&quot;">​</a></h3><div class="language-c++ vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">c++</span><pre class="shiki github-dark-dimmed vp-code-dark"><code><span class="line"><span style="color:#adbac7;">#define FRAME_HEADER      0X7B       //Frame head //帧头</span></span>
<span class="line"><span style="color:#adbac7;">#define FRAME_TAIL        0X7D       //Frame tail //帧尾</span></span>
<span class="line"><span style="color:#adbac7;">#define RECEIVE_DATA_SIZE 24         //下位机发送过来的数据的长度</span></span>
<span class="line"><span style="color:#adbac7;">#define SEND_DATA_SIZE    11         //ROS向下位机发送的数据的长度</span></span>
<span class="line"><span style="color:#adbac7;">//ROS向下位机发送数据的结构体</span></span>
<span class="line"><span style="color:#adbac7;">typedef struct _SEND_DATA_  </span></span>
<span class="line"><span style="color:#adbac7;">{</span></span>
<span class="line"><span style="color:#adbac7;">	    uint8_t tx[SEND_DATA_SIZE];</span></span>
<span class="line"><span style="color:#adbac7;">		float X_speed;	       </span></span>
<span class="line"><span style="color:#adbac7;">		float Y_speed;           </span></span>
<span class="line"><span style="color:#adbac7;">		float Z_speed;         </span></span>
<span class="line"><span style="color:#adbac7;">		unsigned char Frame_Tail; </span></span>
<span class="line"><span style="color:#adbac7;">}SEND_DATA;</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#24292e;">#define FRAME_HEADER      0X7B       //Frame head //帧头</span></span>
<span class="line"><span style="color:#24292e;">#define FRAME_TAIL        0X7D       //Frame tail //帧尾</span></span>
<span class="line"><span style="color:#24292e;">#define RECEIVE_DATA_SIZE 24         //下位机发送过来的数据的长度</span></span>
<span class="line"><span style="color:#24292e;">#define SEND_DATA_SIZE    11         //ROS向下位机发送的数据的长度</span></span>
<span class="line"><span style="color:#24292e;">//ROS向下位机发送数据的结构体</span></span>
<span class="line"><span style="color:#24292e;">typedef struct _SEND_DATA_  </span></span>
<span class="line"><span style="color:#24292e;">{</span></span>
<span class="line"><span style="color:#24292e;">	    uint8_t tx[SEND_DATA_SIZE];</span></span>
<span class="line"><span style="color:#24292e;">		float X_speed;	       </span></span>
<span class="line"><span style="color:#24292e;">		float Y_speed;           </span></span>
<span class="line"><span style="color:#24292e;">		float Z_speed;         </span></span>
<span class="line"><span style="color:#24292e;">		unsigned char Frame_Tail; </span></span>
<span class="line"><span style="color:#24292e;">}SEND_DATA;</span></span></code></pre></div><div class="language-c++ vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">c++</span><pre class="shiki github-dark-dimmed vp-code-dark"><code><span class="line"><span style="color:#adbac7;">turn_on_robot::~turn_on_robot()</span></span>
<span class="line"><span style="color:#adbac7;">{</span></span>
<span class="line"><span style="color:#adbac7;">  //Sends the stop motion command to the lower machine before the turn_on_robot object ends</span></span>
<span class="line"><span style="color:#adbac7;">  //对象turn_on_robot结束前向下位机发送停止运动命令</span></span>
<span class="line"><span style="color:#adbac7;">  Send_Data.tx[0]=FRAME_HEADER;</span></span>
<span class="line"><span style="color:#adbac7;">  Send_Data.tx[1] = 0;  </span></span>
<span class="line"><span style="color:#adbac7;">  Send_Data.tx[2] = 0; </span></span>
<span class="line"><span style="color:#adbac7;"></span></span>
<span class="line"><span style="color:#adbac7;">  //The target velocity of the X-axis of the robot //机器人X轴的目标线速度 </span></span>
<span class="line"><span style="color:#adbac7;">  Send_Data.tx[4] = 0;     </span></span>
<span class="line"><span style="color:#adbac7;">  Send_Data.tx[3] = 0;  </span></span>
<span class="line"><span style="color:#adbac7;"></span></span>
<span class="line"><span style="color:#adbac7;">  //The target velocity of the Y-axis of the robot //机器人Y轴的目标线速度 </span></span>
<span class="line"><span style="color:#adbac7;">  Send_Data.tx[6] = 0;</span></span>
<span class="line"><span style="color:#adbac7;">  Send_Data.tx[5] = 0;  </span></span>
<span class="line"><span style="color:#adbac7;"></span></span>
<span class="line"><span style="color:#adbac7;">  //The target velocity of the Z-axis of the robot //机器人Z轴的目标角速度 </span></span>
<span class="line"><span style="color:#adbac7;">  Send_Data.tx[8] = 0;  </span></span>
<span class="line"><span style="color:#adbac7;">  Send_Data.tx[7] = 0;    </span></span>
<span class="line"><span style="color:#adbac7;">  Send_Data.tx[9]=Check_Sum(9,SEND_DATA_CHECK); //Check the bits for the Check_Sum function //校验位，规则参见Check_Sum函数</span></span>
<span class="line"><span style="color:#adbac7;">  Send_Data.tx[10]=FRAME_TAIL; </span></span>
<span class="line"><span style="color:#adbac7;">  try</span></span>
<span class="line"><span style="color:#adbac7;">  {</span></span>
<span class="line"><span style="color:#adbac7;">    Stm32_Serial.write(Send_Data.tx,sizeof (Send_Data.tx)); //Send data to the serial port //向串口发数据  </span></span>
<span class="line"><span style="color:#adbac7;">  }</span></span>
<span class="line"><span style="color:#adbac7;">  catch (serial::IOException&amp; e)   </span></span>
<span class="line"><span style="color:#adbac7;">  {</span></span>
<span class="line"><span style="color:#adbac7;">    ROS_ERROR_STREAM(&quot;Unable to send data through serial port&quot;); //If sending data fails, an error message is printed //如果发送数据失败,打印错误信息</span></span>
<span class="line"><span style="color:#adbac7;">  }</span></span>
<span class="line"><span style="color:#adbac7;">  Stm32_Serial.close(); //Close the serial port //关闭串口  </span></span>
<span class="line"><span style="color:#adbac7;">  ROS_INFO_STREAM(&quot;Shutting down&quot;); //Prompt message //提示信息</span></span>
<span class="line"><span style="color:#adbac7;">}</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#24292e;">turn_on_robot::~turn_on_robot()</span></span>
<span class="line"><span style="color:#24292e;">{</span></span>
<span class="line"><span style="color:#24292e;">  //Sends the stop motion command to the lower machine before the turn_on_robot object ends</span></span>
<span class="line"><span style="color:#24292e;">  //对象turn_on_robot结束前向下位机发送停止运动命令</span></span>
<span class="line"><span style="color:#24292e;">  Send_Data.tx[0]=FRAME_HEADER;</span></span>
<span class="line"><span style="color:#24292e;">  Send_Data.tx[1] = 0;  </span></span>
<span class="line"><span style="color:#24292e;">  Send_Data.tx[2] = 0; </span></span>
<span class="line"><span style="color:#24292e;"></span></span>
<span class="line"><span style="color:#24292e;">  //The target velocity of the X-axis of the robot //机器人X轴的目标线速度 </span></span>
<span class="line"><span style="color:#24292e;">  Send_Data.tx[4] = 0;     </span></span>
<span class="line"><span style="color:#24292e;">  Send_Data.tx[3] = 0;  </span></span>
<span class="line"><span style="color:#24292e;"></span></span>
<span class="line"><span style="color:#24292e;">  //The target velocity of the Y-axis of the robot //机器人Y轴的目标线速度 </span></span>
<span class="line"><span style="color:#24292e;">  Send_Data.tx[6] = 0;</span></span>
<span class="line"><span style="color:#24292e;">  Send_Data.tx[5] = 0;  </span></span>
<span class="line"><span style="color:#24292e;"></span></span>
<span class="line"><span style="color:#24292e;">  //The target velocity of the Z-axis of the robot //机器人Z轴的目标角速度 </span></span>
<span class="line"><span style="color:#24292e;">  Send_Data.tx[8] = 0;  </span></span>
<span class="line"><span style="color:#24292e;">  Send_Data.tx[7] = 0;    </span></span>
<span class="line"><span style="color:#24292e;">  Send_Data.tx[9]=Check_Sum(9,SEND_DATA_CHECK); //Check the bits for the Check_Sum function //校验位，规则参见Check_Sum函数</span></span>
<span class="line"><span style="color:#24292e;">  Send_Data.tx[10]=FRAME_TAIL; </span></span>
<span class="line"><span style="color:#24292e;">  try</span></span>
<span class="line"><span style="color:#24292e;">  {</span></span>
<span class="line"><span style="color:#24292e;">    Stm32_Serial.write(Send_Data.tx,sizeof (Send_Data.tx)); //Send data to the serial port //向串口发数据  </span></span>
<span class="line"><span style="color:#24292e;">  }</span></span>
<span class="line"><span style="color:#24292e;">  catch (serial::IOException&amp; e)   </span></span>
<span class="line"><span style="color:#24292e;">  {</span></span>
<span class="line"><span style="color:#24292e;">    ROS_ERROR_STREAM(&quot;Unable to send data through serial port&quot;); //If sending data fails, an error message is printed //如果发送数据失败,打印错误信息</span></span>
<span class="line"><span style="color:#24292e;">  }</span></span>
<span class="line"><span style="color:#24292e;">  Stm32_Serial.close(); //Close the serial port //关闭串口  </span></span>
<span class="line"><span style="color:#24292e;">  ROS_INFO_STREAM(&quot;Shutting down&quot;); //Prompt message //提示信息</span></span>
<span class="line"><span style="color:#24292e;">}</span></span></code></pre></div><h3 id="接收下位机数据" tabindex="-1">接收下位机数据 <a class="header-anchor" href="#接收下位机数据" aria-label="Permalink to &quot;接收下位机数据&quot;">​</a></h3><div class="language-c++ vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">c++</span><pre class="shiki github-dark-dimmed vp-code-dark"><code><span class="line"><span style="color:#adbac7;">#define FRAME_HEADER      0X7B       //Frame head //帧头</span></span>
<span class="line"><span style="color:#adbac7;">#define FRAME_TAIL        0X7D       //Frame tail //帧尾</span></span>
<span class="line"><span style="color:#adbac7;">#define RECEIVE_DATA_SIZE 24         //下位机发送过来的数据的长度</span></span>
<span class="line"><span style="color:#adbac7;">#define SEND_DATA_SIZE    11         //ROS向下位机发送的数据的长度</span></span>
<span class="line"><span style="color:#adbac7;">//陀螺仪原始数据转换位弧度(rad)单位，1/65.5/57.30=0.00026644</span></span>
<span class="line"><span style="color:#adbac7;">#define GYROSCOPE_RATIO   0.00026644f</span></span>
<span class="line"><span style="color:#adbac7;">//与IMU加速度计设置的量程有关，量程±2g，对应数据范围±32768</span></span>
<span class="line"><span style="color:#adbac7;">//加速度计原始数据转换位m/s^2单位，32768/2g=32768/19.6=1671.84</span></span>
<span class="line"><span style="color:#adbac7;">#define ACCEl_RATIO 	  1671.84f </span></span>
<span class="line"><span style="color:#adbac7;">//下位机向ROS发送数据的结构体</span></span>
<span class="line"><span style="color:#adbac7;">typedef struct _RECEIVE_DATA_     </span></span>
<span class="line"><span style="color:#adbac7;">{</span></span>
<span class="line"><span style="color:#adbac7;">	    uint8_t rx[RECEIVE_DATA_SIZE];</span></span>
<span class="line"><span style="color:#adbac7;">	    uint8_t Flag_Stop;</span></span>
<span class="line"><span style="color:#adbac7;">		unsigned char Frame_Header;</span></span>
<span class="line"><span style="color:#adbac7;">		float X_speed;  </span></span>
<span class="line"><span style="color:#adbac7;">		float Y_speed;  </span></span>
<span class="line"><span style="color:#adbac7;">		float Z_speed;  </span></span>
<span class="line"><span style="color:#adbac7;">		float Power_Voltage;	</span></span>
<span class="line"><span style="color:#adbac7;">		unsigned char Frame_Tail;</span></span>
<span class="line"><span style="color:#adbac7;">}RECEIVE_DATA;</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#24292e;">#define FRAME_HEADER      0X7B       //Frame head //帧头</span></span>
<span class="line"><span style="color:#24292e;">#define FRAME_TAIL        0X7D       //Frame tail //帧尾</span></span>
<span class="line"><span style="color:#24292e;">#define RECEIVE_DATA_SIZE 24         //下位机发送过来的数据的长度</span></span>
<span class="line"><span style="color:#24292e;">#define SEND_DATA_SIZE    11         //ROS向下位机发送的数据的长度</span></span>
<span class="line"><span style="color:#24292e;">//陀螺仪原始数据转换位弧度(rad)单位，1/65.5/57.30=0.00026644</span></span>
<span class="line"><span style="color:#24292e;">#define GYROSCOPE_RATIO   0.00026644f</span></span>
<span class="line"><span style="color:#24292e;">//与IMU加速度计设置的量程有关，量程±2g，对应数据范围±32768</span></span>
<span class="line"><span style="color:#24292e;">//加速度计原始数据转换位m/s^2单位，32768/2g=32768/19.6=1671.84</span></span>
<span class="line"><span style="color:#24292e;">#define ACCEl_RATIO 	  1671.84f </span></span>
<span class="line"><span style="color:#24292e;">//下位机向ROS发送数据的结构体</span></span>
<span class="line"><span style="color:#24292e;">typedef struct _RECEIVE_DATA_     </span></span>
<span class="line"><span style="color:#24292e;">{</span></span>
<span class="line"><span style="color:#24292e;">	    uint8_t rx[RECEIVE_DATA_SIZE];</span></span>
<span class="line"><span style="color:#24292e;">	    uint8_t Flag_Stop;</span></span>
<span class="line"><span style="color:#24292e;">		unsigned char Frame_Header;</span></span>
<span class="line"><span style="color:#24292e;">		float X_speed;  </span></span>
<span class="line"><span style="color:#24292e;">		float Y_speed;  </span></span>
<span class="line"><span style="color:#24292e;">		float Z_speed;  </span></span>
<span class="line"><span style="color:#24292e;">		float Power_Voltage;	</span></span>
<span class="line"><span style="color:#24292e;">		unsigned char Frame_Tail;</span></span>
<span class="line"><span style="color:#24292e;">}RECEIVE_DATA;</span></span></code></pre></div><div class="language-c++ vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">c++</span><pre class="shiki github-dark-dimmed vp-code-dark"><code><span class="line"><span style="color:#adbac7;">bool turn_on_robot::Get_Sensor_Data_New()</span></span>
<span class="line"><span style="color:#adbac7;">{</span></span>
<span class="line"><span style="color:#adbac7;">  short transition_16=0; //Intermediate variable //中间变量</span></span>
<span class="line"><span style="color:#adbac7;">  uint8_t i=0,check=0, error=1,Receive_Data_Pr[1]; //Temporary variable to save the data of the lower machine //临时变量，保存下位机数据</span></span>
<span class="line"><span style="color:#adbac7;">  static int count; //Static variable for counting //静态变量，用于计数</span></span>
<span class="line"><span style="color:#adbac7;">  Stm32_Serial.read(Receive_Data_Pr,sizeof(Receive_Data_Pr)); //Read the data sent by the lower computer through the serial port //通过串口读取下位机发送过来的数据</span></span>
<span class="line"><span style="color:#adbac7;"></span></span>
<span class="line"><span style="color:#adbac7;">  /*//View the received raw data directly and debug it for use//直接查看接收到的原始数据，调试使用</span></span>
<span class="line"><span style="color:#adbac7;">  ROS_INFO(&quot;%x-%x-%x-%x-%x-%x-%x-%x-%x-%x-%x-%x-%x-%x-%x-%x-%x-%x-%x-%x-%x-%x-%x-%x&quot;,</span></span>
<span class="line"><span style="color:#adbac7;">  Receive_Data_Pr[0],Receive_Data_Pr[1],Receive_Data_Pr[2],Receive_Data_Pr[3],Receive_Data_Pr[4],Receive_Data_Pr[5],Receive_Data_Pr[6],Receive_Data_Pr[7],</span></span>
<span class="line"><span style="color:#adbac7;">  Receive_Data_Pr[8],Receive_Data_Pr[9],Receive_Data_Pr[10],Receive_Data_Pr[11],Receive_Data_Pr[12],Receive_Data_Pr[13],Receive_Data_Pr[14],Receive_Data_Pr[15],</span></span>
<span class="line"><span style="color:#adbac7;">  Receive_Data_Pr[16],Receive_Data_Pr[17],Receive_Data_Pr[18],Receive_Data_Pr[19],Receive_Data_Pr[20],Receive_Data_Pr[21],Receive_Data_Pr[22],Receive_Data_Pr[23]);</span></span>
<span class="line"><span style="color:#adbac7;">  */  </span></span>
<span class="line"><span style="color:#adbac7;"></span></span>
<span class="line"><span style="color:#adbac7;">  Receive_Data.rx[count] = Receive_Data_Pr[0]; //Fill the array with serial data //串口数据填入数组</span></span>
<span class="line"><span style="color:#adbac7;"></span></span>
<span class="line"><span style="color:#adbac7;">  Receive_Data.Frame_Header = Receive_Data.rx[0]; //The first part of the data is the frame header 0X7B //数据的第一位是帧头0X7B</span></span>
<span class="line"><span style="color:#adbac7;">  Receive_Data.Frame_Tail = Receive_Data.rx[23];  //The last bit of data is frame tail 0X7D //数据的最后一位是帧尾0X7D</span></span>
<span class="line"><span style="color:#adbac7;"></span></span>
<span class="line"><span style="color:#adbac7;">  if(Receive_Data_Pr[0] == FRAME_HEADER || count&gt;0) //Ensure that the first data in the array is FRAME_HEADER //确保数组第一个数据为FRAME_HEADER</span></span>
<span class="line"><span style="color:#adbac7;">    count++;</span></span>
<span class="line"><span style="color:#adbac7;">  else </span></span>
<span class="line"><span style="color:#adbac7;">  	count=0;</span></span>
<span class="line"><span style="color:#adbac7;">  if(count == 24) //Verify the length of the packet //验证数据包的长度</span></span>
<span class="line"><span style="color:#adbac7;">  {</span></span>
<span class="line"><span style="color:#adbac7;">    count=0;  //Prepare for the serial port data to be refill into the array //为串口数据重新填入数组做准备</span></span>
<span class="line"><span style="color:#adbac7;">    if(Receive_Data.Frame_Tail == FRAME_TAIL) //Verify the frame tail of the packet //验证数据包的帧尾</span></span>
<span class="line"><span style="color:#adbac7;">    {</span></span>
<span class="line"><span style="color:#adbac7;">      check=Check_Sum(22,READ_DATA_CHECK);  //BCC check passes or two packets are interlaced //BCC校验通过或者两组数据包交错</span></span>
<span class="line"><span style="color:#adbac7;"></span></span>
<span class="line"><span style="color:#adbac7;">      if(check == Receive_Data.rx[22])  </span></span>
<span class="line"><span style="color:#adbac7;">      {</span></span>
<span class="line"><span style="color:#adbac7;">        error=0;  //XOR bit check successful //异或位校验成功</span></span>
<span class="line"><span style="color:#adbac7;">      }</span></span>
<span class="line"><span style="color:#adbac7;">      if(error == 0)</span></span>
<span class="line"><span style="color:#adbac7;">      {</span></span>
<span class="line"><span style="color:#adbac7;">        /*//Check receive_data.rx for debugging use //查看Receive_Data.rx，调试使用 </span></span>
<span class="line"><span style="color:#adbac7;">        ROS_INFO(&quot;%x-%x-%x-%x-%x-%x-%x-%x-%x-%x-%x-%x-%x-%x-%x-%x-%x-%x-%x-%x-%x-%x-%x-%x&quot;,</span></span>
<span class="line"><span style="color:#adbac7;">        Receive_Data.rx[0],Receive_Data.rx[1],Receive_Data.rx[2],Receive_Data.rx[3],Receive_Data.rx[4],Receive_Data.rx[5],Receive_Data.rx[6],Receive_Data.rx[7],</span></span>
<span class="line"><span style="color:#adbac7;">        Receive_Data.rx[8],Receive_Data.rx[9],Receive_Data.rx[10],Receive_Data.rx[11],Receive_Data.rx[12],Receive_Data.rx[13],Receive_Data.rx[14],Receive_Data.rx[15],</span></span>
<span class="line"><span style="color:#adbac7;">        Receive_Data.rx[16],Receive_Data.rx[17],Receive_Data.rx[18],Receive_Data.rx[19],Receive_Data.rx[20],Receive_Data.rx[21],Receive_Data.rx[22],Receive_Data.rx[23]); </span></span>
<span class="line"><span style="color:#adbac7;">        */</span></span>
<span class="line"><span style="color:#adbac7;"></span></span>
<span class="line"><span style="color:#adbac7;">        Receive_Data.Flag_Stop=Receive_Data.rx[1]; //set aside //预留位</span></span>
<span class="line"><span style="color:#adbac7;">        Robot_Vel.X = Odom_Trans(Receive_Data.rx[2],Receive_Data.rx[3]); //Get the speed of the moving chassis in the X direction //获取运动底盘X方向速度</span></span>
<span class="line"><span style="color:#adbac7;">          </span></span>
<span class="line"><span style="color:#adbac7;">        Robot_Vel.Y = Odom_Trans(Receive_Data.rx[4],Receive_Data.rx[5]); //Get the speed of the moving chassis in the Y direction, The Y speed is only valid in the omnidirectional mobile robot chassis</span></span>
<span class="line"><span style="color:#adbac7;">                                                                          //获取运动底盘Y方向速度，Y速度仅在全向移动机器人底盘有效</span></span>
<span class="line"><span style="color:#adbac7;">        Robot_Vel.Z = Odom_Trans(Receive_Data.rx[6],Receive_Data.rx[7]); //Get the speed of the moving chassis in the Z direction //获取运动底盘Z方向速度   </span></span>
<span class="line"><span style="color:#adbac7;">          </span></span>
<span class="line"><span style="color:#adbac7;">        //MPU6050 stands for IMU only and does not refer to a specific model. It can be either MPU6050 or MPU9250</span></span>
<span class="line"><span style="color:#adbac7;">        //Mpu6050仅代表IMU，不指代特定型号，既可以是MPU6050也可以是MPU9250</span></span>
<span class="line"><span style="color:#adbac7;">        Mpu6050_Data.accele_x_data = IMU_Trans(Receive_Data.rx[8],Receive_Data.rx[9]);   //Get the X-axis acceleration of the IMU     //获取IMU的X轴加速度  </span></span>
<span class="line"><span style="color:#adbac7;">        Mpu6050_Data.accele_y_data = IMU_Trans(Receive_Data.rx[10],Receive_Data.rx[11]); //Get the Y-axis acceleration of the IMU     //获取IMU的Y轴加速度</span></span>
<span class="line"><span style="color:#adbac7;">        Mpu6050_Data.accele_z_data = IMU_Trans(Receive_Data.rx[12],Receive_Data.rx[13]); //Get the Z-axis acceleration of the IMU     //获取IMU的Z轴加速度</span></span>
<span class="line"><span style="color:#adbac7;">        Mpu6050_Data.gyros_x_data = IMU_Trans(Receive_Data.rx[14],Receive_Data.rx[15]);  //Get the X-axis angular velocity of the IMU //获取IMU的X轴角速度  </span></span>
<span class="line"><span style="color:#adbac7;">        Mpu6050_Data.gyros_y_data = IMU_Trans(Receive_Data.rx[16],Receive_Data.rx[17]);  //Get the Y-axis angular velocity of the IMU //获取IMU的Y轴角速度  </span></span>
<span class="line"><span style="color:#adbac7;">        Mpu6050_Data.gyros_z_data = IMU_Trans(Receive_Data.rx[18],Receive_Data.rx[19]);  //Get the Z-axis angular velocity of the IMU //获取IMU的Z轴角速度  </span></span>
<span class="line"><span style="color:#adbac7;">        //Linear acceleration unit conversion is related to the range of IMU initialization of STM32, where the range is ±2g=19.6m/s^2</span></span>
<span class="line"><span style="color:#adbac7;">        //线性加速度单位转化，和STM32的IMU初始化的时候的量程有关,这里量程±2g=19.6m/s^2</span></span>
<span class="line"><span style="color:#adbac7;">        Mpu6050.linear_acceleration.x = Mpu6050_Data.accele_x_data / ACCEl_RATIO;</span></span>
<span class="line"><span style="color:#adbac7;">        Mpu6050.linear_acceleration.y = Mpu6050_Data.accele_y_data / ACCEl_RATIO;</span></span>
<span class="line"><span style="color:#adbac7;">        Mpu6050.linear_acceleration.z = Mpu6050_Data.accele_z_data / ACCEl_RATIO;</span></span>
<span class="line"><span style="color:#adbac7;">        //The gyroscope unit conversion is related to the range of STM32&#39;s IMU when initialized. Here, the range of IMU&#39;s gyroscope is ±500°/s</span></span>
<span class="line"><span style="color:#adbac7;">        //Because the robot generally has a slow Z-axis speed, reducing the range can improve the accuracy</span></span>
<span class="line"><span style="color:#adbac7;">        //陀螺仪单位转化，和STM32的IMU初始化的时候的量程有关，这里IMU的陀螺仪的量程是±500°/s</span></span>
<span class="line"><span style="color:#adbac7;">        //因为机器人一般Z轴速度不快，降低量程可以提高精度</span></span>
<span class="line"><span style="color:#adbac7;">        Mpu6050.angular_velocity.x =  Mpu6050_Data.gyros_x_data * GYROSCOPE_RATIO;</span></span>
<span class="line"><span style="color:#adbac7;">        Mpu6050.angular_velocity.y =  Mpu6050_Data.gyros_y_data * GYROSCOPE_RATIO;</span></span>
<span class="line"><span style="color:#adbac7;">        Mpu6050.angular_velocity.z =  Mpu6050_Data.gyros_z_data * GYROSCOPE_RATIO;</span></span>
<span class="line"><span style="color:#adbac7;"></span></span>
<span class="line"><span style="color:#adbac7;">        //Get the battery voltage</span></span>
<span class="line"><span style="color:#adbac7;">        //获取电池电压</span></span>
<span class="line"><span style="color:#adbac7;">        transition_16 = 0;</span></span>
<span class="line"><span style="color:#adbac7;">        transition_16 |=  Receive_Data.rx[20]&lt;&lt;8;</span></span>
<span class="line"><span style="color:#adbac7;">        transition_16 |=  Receive_Data.rx[21];  </span></span>
<span class="line"><span style="color:#adbac7;">        Power_voltage = transition_16/1000+(transition_16 % 1000)*0.001; //Unit conversion millivolt(mv)-&gt;volt(v) //单位转换毫伏(mv)-&gt;伏(v)</span></span>
<span class="line"><span style="color:#adbac7;">          </span></span>
<span class="line"><span style="color:#adbac7;">        return true;</span></span>
<span class="line"><span style="color:#adbac7;"></span></span>
<span class="line"><span style="color:#adbac7;">      }</span></span>
<span class="line"><span style="color:#adbac7;">    }</span></span>
<span class="line"><span style="color:#adbac7;">  }</span></span>
<span class="line"><span style="color:#adbac7;">  return false;</span></span>
<span class="line"><span style="color:#adbac7;">}</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#24292e;">bool turn_on_robot::Get_Sensor_Data_New()</span></span>
<span class="line"><span style="color:#24292e;">{</span></span>
<span class="line"><span style="color:#24292e;">  short transition_16=0; //Intermediate variable //中间变量</span></span>
<span class="line"><span style="color:#24292e;">  uint8_t i=0,check=0, error=1,Receive_Data_Pr[1]; //Temporary variable to save the data of the lower machine //临时变量，保存下位机数据</span></span>
<span class="line"><span style="color:#24292e;">  static int count; //Static variable for counting //静态变量，用于计数</span></span>
<span class="line"><span style="color:#24292e;">  Stm32_Serial.read(Receive_Data_Pr,sizeof(Receive_Data_Pr)); //Read the data sent by the lower computer through the serial port //通过串口读取下位机发送过来的数据</span></span>
<span class="line"><span style="color:#24292e;"></span></span>
<span class="line"><span style="color:#24292e;">  /*//View the received raw data directly and debug it for use//直接查看接收到的原始数据，调试使用</span></span>
<span class="line"><span style="color:#24292e;">  ROS_INFO(&quot;%x-%x-%x-%x-%x-%x-%x-%x-%x-%x-%x-%x-%x-%x-%x-%x-%x-%x-%x-%x-%x-%x-%x-%x&quot;,</span></span>
<span class="line"><span style="color:#24292e;">  Receive_Data_Pr[0],Receive_Data_Pr[1],Receive_Data_Pr[2],Receive_Data_Pr[3],Receive_Data_Pr[4],Receive_Data_Pr[5],Receive_Data_Pr[6],Receive_Data_Pr[7],</span></span>
<span class="line"><span style="color:#24292e;">  Receive_Data_Pr[8],Receive_Data_Pr[9],Receive_Data_Pr[10],Receive_Data_Pr[11],Receive_Data_Pr[12],Receive_Data_Pr[13],Receive_Data_Pr[14],Receive_Data_Pr[15],</span></span>
<span class="line"><span style="color:#24292e;">  Receive_Data_Pr[16],Receive_Data_Pr[17],Receive_Data_Pr[18],Receive_Data_Pr[19],Receive_Data_Pr[20],Receive_Data_Pr[21],Receive_Data_Pr[22],Receive_Data_Pr[23]);</span></span>
<span class="line"><span style="color:#24292e;">  */  </span></span>
<span class="line"><span style="color:#24292e;"></span></span>
<span class="line"><span style="color:#24292e;">  Receive_Data.rx[count] = Receive_Data_Pr[0]; //Fill the array with serial data //串口数据填入数组</span></span>
<span class="line"><span style="color:#24292e;"></span></span>
<span class="line"><span style="color:#24292e;">  Receive_Data.Frame_Header = Receive_Data.rx[0]; //The first part of the data is the frame header 0X7B //数据的第一位是帧头0X7B</span></span>
<span class="line"><span style="color:#24292e;">  Receive_Data.Frame_Tail = Receive_Data.rx[23];  //The last bit of data is frame tail 0X7D //数据的最后一位是帧尾0X7D</span></span>
<span class="line"><span style="color:#24292e;"></span></span>
<span class="line"><span style="color:#24292e;">  if(Receive_Data_Pr[0] == FRAME_HEADER || count&gt;0) //Ensure that the first data in the array is FRAME_HEADER //确保数组第一个数据为FRAME_HEADER</span></span>
<span class="line"><span style="color:#24292e;">    count++;</span></span>
<span class="line"><span style="color:#24292e;">  else </span></span>
<span class="line"><span style="color:#24292e;">  	count=0;</span></span>
<span class="line"><span style="color:#24292e;">  if(count == 24) //Verify the length of the packet //验证数据包的长度</span></span>
<span class="line"><span style="color:#24292e;">  {</span></span>
<span class="line"><span style="color:#24292e;">    count=0;  //Prepare for the serial port data to be refill into the array //为串口数据重新填入数组做准备</span></span>
<span class="line"><span style="color:#24292e;">    if(Receive_Data.Frame_Tail == FRAME_TAIL) //Verify the frame tail of the packet //验证数据包的帧尾</span></span>
<span class="line"><span style="color:#24292e;">    {</span></span>
<span class="line"><span style="color:#24292e;">      check=Check_Sum(22,READ_DATA_CHECK);  //BCC check passes or two packets are interlaced //BCC校验通过或者两组数据包交错</span></span>
<span class="line"><span style="color:#24292e;"></span></span>
<span class="line"><span style="color:#24292e;">      if(check == Receive_Data.rx[22])  </span></span>
<span class="line"><span style="color:#24292e;">      {</span></span>
<span class="line"><span style="color:#24292e;">        error=0;  //XOR bit check successful //异或位校验成功</span></span>
<span class="line"><span style="color:#24292e;">      }</span></span>
<span class="line"><span style="color:#24292e;">      if(error == 0)</span></span>
<span class="line"><span style="color:#24292e;">      {</span></span>
<span class="line"><span style="color:#24292e;">        /*//Check receive_data.rx for debugging use //查看Receive_Data.rx，调试使用 </span></span>
<span class="line"><span style="color:#24292e;">        ROS_INFO(&quot;%x-%x-%x-%x-%x-%x-%x-%x-%x-%x-%x-%x-%x-%x-%x-%x-%x-%x-%x-%x-%x-%x-%x-%x&quot;,</span></span>
<span class="line"><span style="color:#24292e;">        Receive_Data.rx[0],Receive_Data.rx[1],Receive_Data.rx[2],Receive_Data.rx[3],Receive_Data.rx[4],Receive_Data.rx[5],Receive_Data.rx[6],Receive_Data.rx[7],</span></span>
<span class="line"><span style="color:#24292e;">        Receive_Data.rx[8],Receive_Data.rx[9],Receive_Data.rx[10],Receive_Data.rx[11],Receive_Data.rx[12],Receive_Data.rx[13],Receive_Data.rx[14],Receive_Data.rx[15],</span></span>
<span class="line"><span style="color:#24292e;">        Receive_Data.rx[16],Receive_Data.rx[17],Receive_Data.rx[18],Receive_Data.rx[19],Receive_Data.rx[20],Receive_Data.rx[21],Receive_Data.rx[22],Receive_Data.rx[23]); </span></span>
<span class="line"><span style="color:#24292e;">        */</span></span>
<span class="line"><span style="color:#24292e;"></span></span>
<span class="line"><span style="color:#24292e;">        Receive_Data.Flag_Stop=Receive_Data.rx[1]; //set aside //预留位</span></span>
<span class="line"><span style="color:#24292e;">        Robot_Vel.X = Odom_Trans(Receive_Data.rx[2],Receive_Data.rx[3]); //Get the speed of the moving chassis in the X direction //获取运动底盘X方向速度</span></span>
<span class="line"><span style="color:#24292e;">          </span></span>
<span class="line"><span style="color:#24292e;">        Robot_Vel.Y = Odom_Trans(Receive_Data.rx[4],Receive_Data.rx[5]); //Get the speed of the moving chassis in the Y direction, The Y speed is only valid in the omnidirectional mobile robot chassis</span></span>
<span class="line"><span style="color:#24292e;">                                                                          //获取运动底盘Y方向速度，Y速度仅在全向移动机器人底盘有效</span></span>
<span class="line"><span style="color:#24292e;">        Robot_Vel.Z = Odom_Trans(Receive_Data.rx[6],Receive_Data.rx[7]); //Get the speed of the moving chassis in the Z direction //获取运动底盘Z方向速度   </span></span>
<span class="line"><span style="color:#24292e;">          </span></span>
<span class="line"><span style="color:#24292e;">        //MPU6050 stands for IMU only and does not refer to a specific model. It can be either MPU6050 or MPU9250</span></span>
<span class="line"><span style="color:#24292e;">        //Mpu6050仅代表IMU，不指代特定型号，既可以是MPU6050也可以是MPU9250</span></span>
<span class="line"><span style="color:#24292e;">        Mpu6050_Data.accele_x_data = IMU_Trans(Receive_Data.rx[8],Receive_Data.rx[9]);   //Get the X-axis acceleration of the IMU     //获取IMU的X轴加速度  </span></span>
<span class="line"><span style="color:#24292e;">        Mpu6050_Data.accele_y_data = IMU_Trans(Receive_Data.rx[10],Receive_Data.rx[11]); //Get the Y-axis acceleration of the IMU     //获取IMU的Y轴加速度</span></span>
<span class="line"><span style="color:#24292e;">        Mpu6050_Data.accele_z_data = IMU_Trans(Receive_Data.rx[12],Receive_Data.rx[13]); //Get the Z-axis acceleration of the IMU     //获取IMU的Z轴加速度</span></span>
<span class="line"><span style="color:#24292e;">        Mpu6050_Data.gyros_x_data = IMU_Trans(Receive_Data.rx[14],Receive_Data.rx[15]);  //Get the X-axis angular velocity of the IMU //获取IMU的X轴角速度  </span></span>
<span class="line"><span style="color:#24292e;">        Mpu6050_Data.gyros_y_data = IMU_Trans(Receive_Data.rx[16],Receive_Data.rx[17]);  //Get the Y-axis angular velocity of the IMU //获取IMU的Y轴角速度  </span></span>
<span class="line"><span style="color:#24292e;">        Mpu6050_Data.gyros_z_data = IMU_Trans(Receive_Data.rx[18],Receive_Data.rx[19]);  //Get the Z-axis angular velocity of the IMU //获取IMU的Z轴角速度  </span></span>
<span class="line"><span style="color:#24292e;">        //Linear acceleration unit conversion is related to the range of IMU initialization of STM32, where the range is ±2g=19.6m/s^2</span></span>
<span class="line"><span style="color:#24292e;">        //线性加速度单位转化，和STM32的IMU初始化的时候的量程有关,这里量程±2g=19.6m/s^2</span></span>
<span class="line"><span style="color:#24292e;">        Mpu6050.linear_acceleration.x = Mpu6050_Data.accele_x_data / ACCEl_RATIO;</span></span>
<span class="line"><span style="color:#24292e;">        Mpu6050.linear_acceleration.y = Mpu6050_Data.accele_y_data / ACCEl_RATIO;</span></span>
<span class="line"><span style="color:#24292e;">        Mpu6050.linear_acceleration.z = Mpu6050_Data.accele_z_data / ACCEl_RATIO;</span></span>
<span class="line"><span style="color:#24292e;">        //The gyroscope unit conversion is related to the range of STM32&#39;s IMU when initialized. Here, the range of IMU&#39;s gyroscope is ±500°/s</span></span>
<span class="line"><span style="color:#24292e;">        //Because the robot generally has a slow Z-axis speed, reducing the range can improve the accuracy</span></span>
<span class="line"><span style="color:#24292e;">        //陀螺仪单位转化，和STM32的IMU初始化的时候的量程有关，这里IMU的陀螺仪的量程是±500°/s</span></span>
<span class="line"><span style="color:#24292e;">        //因为机器人一般Z轴速度不快，降低量程可以提高精度</span></span>
<span class="line"><span style="color:#24292e;">        Mpu6050.angular_velocity.x =  Mpu6050_Data.gyros_x_data * GYROSCOPE_RATIO;</span></span>
<span class="line"><span style="color:#24292e;">        Mpu6050.angular_velocity.y =  Mpu6050_Data.gyros_y_data * GYROSCOPE_RATIO;</span></span>
<span class="line"><span style="color:#24292e;">        Mpu6050.angular_velocity.z =  Mpu6050_Data.gyros_z_data * GYROSCOPE_RATIO;</span></span>
<span class="line"><span style="color:#24292e;"></span></span>
<span class="line"><span style="color:#24292e;">        //Get the battery voltage</span></span>
<span class="line"><span style="color:#24292e;">        //获取电池电压</span></span>
<span class="line"><span style="color:#24292e;">        transition_16 = 0;</span></span>
<span class="line"><span style="color:#24292e;">        transition_16 |=  Receive_Data.rx[20]&lt;&lt;8;</span></span>
<span class="line"><span style="color:#24292e;">        transition_16 |=  Receive_Data.rx[21];  </span></span>
<span class="line"><span style="color:#24292e;">        Power_voltage = transition_16/1000+(transition_16 % 1000)*0.001; //Unit conversion millivolt(mv)-&gt;volt(v) //单位转换毫伏(mv)-&gt;伏(v)</span></span>
<span class="line"><span style="color:#24292e;">          </span></span>
<span class="line"><span style="color:#24292e;">        return true;</span></span>
<span class="line"><span style="color:#24292e;"></span></span>
<span class="line"><span style="color:#24292e;">      }</span></span>
<span class="line"><span style="color:#24292e;">    }</span></span>
<span class="line"><span style="color:#24292e;">  }</span></span>
<span class="line"><span style="color:#24292e;">  return false;</span></span>
<span class="line"><span style="color:#24292e;">}</span></span></code></pre></div><h3 id="数据转换函数" tabindex="-1">数据转换函数 <a class="header-anchor" href="#数据转换函数" aria-label="Permalink to &quot;数据转换函数&quot;">​</a></h3><div class="language-c++ vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">c++</span><pre class="shiki github-dark-dimmed vp-code-dark"><code><span class="line"><span style="color:#adbac7;">short turn_on_robot::IMU_Trans(uint8_t Data_High,uint8_t Data_Low)</span></span>
<span class="line"><span style="color:#adbac7;">{</span></span>
<span class="line"><span style="color:#adbac7;">  short transition_16;</span></span>
<span class="line"><span style="color:#adbac7;">  transition_16 = 0;</span></span>
<span class="line"><span style="color:#adbac7;">  transition_16 |=  Data_High&lt;&lt;8;   </span></span>
<span class="line"><span style="color:#adbac7;">  transition_16 |=  Data_Low;</span></span>
<span class="line"><span style="color:#adbac7;">  return transition_16;     </span></span>
<span class="line"><span style="color:#adbac7;">}</span></span>
<span class="line"><span style="color:#adbac7;">float turn_on_robot::Odom_Trans(uint8_t Data_High,uint8_t Data_Low)</span></span>
<span class="line"><span style="color:#adbac7;">{</span></span>
<span class="line"><span style="color:#adbac7;">  float data_return;</span></span>
<span class="line"><span style="color:#adbac7;">  short transition_16;</span></span>
<span class="line"><span style="color:#adbac7;">  transition_16 = 0;</span></span>
<span class="line"><span style="color:#adbac7;">  transition_16 |=  Data_High&lt;&lt;8;  //Get the high 8 bits of data   //获取数据的高8位</span></span>
<span class="line"><span style="color:#adbac7;">  transition_16 |=  Data_Low;      //Get the lowest 8 bits of data //获取数据的低8位</span></span>
<span class="line"><span style="color:#adbac7;">  data_return   =  (transition_16 / 1000)+(transition_16 % 1000)*0.001; // The speed unit is changed from mm/s to m/s //速度单位从mm/s转换为m/s</span></span>
<span class="line"><span style="color:#adbac7;">  return data_return;</span></span>
<span class="line"><span style="color:#adbac7;">}</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#24292e;">short turn_on_robot::IMU_Trans(uint8_t Data_High,uint8_t Data_Low)</span></span>
<span class="line"><span style="color:#24292e;">{</span></span>
<span class="line"><span style="color:#24292e;">  short transition_16;</span></span>
<span class="line"><span style="color:#24292e;">  transition_16 = 0;</span></span>
<span class="line"><span style="color:#24292e;">  transition_16 |=  Data_High&lt;&lt;8;   </span></span>
<span class="line"><span style="color:#24292e;">  transition_16 |=  Data_Low;</span></span>
<span class="line"><span style="color:#24292e;">  return transition_16;     </span></span>
<span class="line"><span style="color:#24292e;">}</span></span>
<span class="line"><span style="color:#24292e;">float turn_on_robot::Odom_Trans(uint8_t Data_High,uint8_t Data_Low)</span></span>
<span class="line"><span style="color:#24292e;">{</span></span>
<span class="line"><span style="color:#24292e;">  float data_return;</span></span>
<span class="line"><span style="color:#24292e;">  short transition_16;</span></span>
<span class="line"><span style="color:#24292e;">  transition_16 = 0;</span></span>
<span class="line"><span style="color:#24292e;">  transition_16 |=  Data_High&lt;&lt;8;  //Get the high 8 bits of data   //获取数据的高8位</span></span>
<span class="line"><span style="color:#24292e;">  transition_16 |=  Data_Low;      //Get the lowest 8 bits of data //获取数据的低8位</span></span>
<span class="line"><span style="color:#24292e;">  data_return   =  (transition_16 / 1000)+(transition_16 % 1000)*0.001; // The speed unit is changed from mm/s to m/s //速度单位从mm/s转换为m/s</span></span>
<span class="line"><span style="color:#24292e;">  return data_return;</span></span>
<span class="line"><span style="color:#24292e;">}</span></span></code></pre></div><h3 id="串口校验函数" tabindex="-1">串口校验函数 <a class="header-anchor" href="#串口校验函数" aria-label="Permalink to &quot;串口校验函数&quot;">​</a></h3><p>串口通讯校验函数，数据包n有个字节，第n-1个字节为校验位，第n个字节位帧尾。第1个字节到第n-2个字节数据按位异或的结果与第n-1个字节对比，即为BCC校验</p><p>输入参数： Count_Number：数据包前几个字节加入校验 mode：对发送数据还是接收数据进行校验</p><div class="language-c++ vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">c++</span><pre class="shiki github-dark-dimmed vp-code-dark"><code><span class="line"><span style="color:#adbac7;">unsigned char turn_on_robot::Check_Sum(unsigned char Count_Number,unsigned char mode)</span></span>
<span class="line"><span style="color:#adbac7;">{</span></span>
<span class="line"><span style="color:#adbac7;">  unsigned char check_sum=0,k;</span></span>
<span class="line"><span style="color:#adbac7;">  </span></span>
<span class="line"><span style="color:#adbac7;">  if(mode==0) //Receive data mode //接收数据模式</span></span>
<span class="line"><span style="color:#adbac7;">  {</span></span>
<span class="line"><span style="color:#adbac7;">   for(k=0;k&lt;Count_Number;k++)</span></span>
<span class="line"><span style="color:#adbac7;">    {</span></span>
<span class="line"><span style="color:#adbac7;">     check_sum=check_sum^Receive_Data.rx[k]; //By bit or by bit //按位异或</span></span>
<span class="line"><span style="color:#adbac7;">     }</span></span>
<span class="line"><span style="color:#adbac7;">  }</span></span>
<span class="line"><span style="color:#adbac7;">  if(mode==1) //Send data mode //发送数据模式</span></span>
<span class="line"><span style="color:#adbac7;">  {</span></span>
<span class="line"><span style="color:#adbac7;">   for(k=0;k&lt;Count_Number;k++)</span></span>
<span class="line"><span style="color:#adbac7;">    {</span></span>
<span class="line"><span style="color:#adbac7;">     check_sum=check_sum^Send_Data.tx[k]; //By bit or by bit //按位异或</span></span>
<span class="line"><span style="color:#adbac7;">     }</span></span>
<span class="line"><span style="color:#adbac7;">  }</span></span>
<span class="line"><span style="color:#adbac7;">  return check_sum; //Returns the bitwise XOR result //返回按位异或结果</span></span>
<span class="line"><span style="color:#adbac7;">}</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#24292e;">unsigned char turn_on_robot::Check_Sum(unsigned char Count_Number,unsigned char mode)</span></span>
<span class="line"><span style="color:#24292e;">{</span></span>
<span class="line"><span style="color:#24292e;">  unsigned char check_sum=0,k;</span></span>
<span class="line"><span style="color:#24292e;">  </span></span>
<span class="line"><span style="color:#24292e;">  if(mode==0) //Receive data mode //接收数据模式</span></span>
<span class="line"><span style="color:#24292e;">  {</span></span>
<span class="line"><span style="color:#24292e;">   for(k=0;k&lt;Count_Number;k++)</span></span>
<span class="line"><span style="color:#24292e;">    {</span></span>
<span class="line"><span style="color:#24292e;">     check_sum=check_sum^Receive_Data.rx[k]; //By bit or by bit //按位异或</span></span>
<span class="line"><span style="color:#24292e;">     }</span></span>
<span class="line"><span style="color:#24292e;">  }</span></span>
<span class="line"><span style="color:#24292e;">  if(mode==1) //Send data mode //发送数据模式</span></span>
<span class="line"><span style="color:#24292e;">  {</span></span>
<span class="line"><span style="color:#24292e;">   for(k=0;k&lt;Count_Number;k++)</span></span>
<span class="line"><span style="color:#24292e;">    {</span></span>
<span class="line"><span style="color:#24292e;">     check_sum=check_sum^Send_Data.tx[k]; //By bit or by bit //按位异或</span></span>
<span class="line"><span style="color:#24292e;">     }</span></span>
<span class="line"><span style="color:#24292e;">  }</span></span>
<span class="line"><span style="color:#24292e;">  return check_sum; //Returns the bitwise XOR result //返回按位异或结果</span></span>
<span class="line"><span style="color:#24292e;">}</span></span></code></pre></div><h3 id="发布电压相关信息" tabindex="-1">发布电压相关信息 <a class="header-anchor" href="#发布电压相关信息" aria-label="Permalink to &quot;发布电压相关信息&quot;">​</a></h3><div class="language-h vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">h</span><pre class="shiki github-dark-dimmed vp-code-dark"><code><span class="line"><span style="color:#adbac7;"></span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#24292e;"></span></span></code></pre></div><div class="language-c++ vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">c++</span><pre class="shiki github-dark-dimmed vp-code-dark"><code><span class="line"><span style="color:#adbac7;">void turn_on_robot::Publish_Voltage()</span></span>
<span class="line"><span style="color:#adbac7;">{</span></span>
<span class="line"><span style="color:#adbac7;">    std_msgs::Float32 voltage_msgs; //Define the data type of the power supply voltage publishing topic //定义电源电压发布话题的数据类型</span></span>
<span class="line"><span style="color:#adbac7;">    static float Count_Voltage_Pub=0;</span></span>
<span class="line"><span style="color:#adbac7;">    if(Count_Voltage_Pub++&gt;10)</span></span>
<span class="line"><span style="color:#adbac7;">      {</span></span>
<span class="line"><span style="color:#adbac7;">        Count_Voltage_Pub=0;  </span></span>
<span class="line"><span style="color:#adbac7;">        voltage_msgs.data = Power_voltage; //The power supply voltage is obtained //电源供电的电压获取</span></span>
<span class="line"><span style="color:#adbac7;">        voltage_publisher.publish(voltage_msgs); //Post the power supply voltage topic unit: V, volt //发布电源电压话题单位：V、伏特</span></span>
<span class="line"><span style="color:#adbac7;">      }</span></span>
<span class="line"><span style="color:#adbac7;">}</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#24292e;">void turn_on_robot::Publish_Voltage()</span></span>
<span class="line"><span style="color:#24292e;">{</span></span>
<span class="line"><span style="color:#24292e;">    std_msgs::Float32 voltage_msgs; //Define the data type of the power supply voltage publishing topic //定义电源电压发布话题的数据类型</span></span>
<span class="line"><span style="color:#24292e;">    static float Count_Voltage_Pub=0;</span></span>
<span class="line"><span style="color:#24292e;">    if(Count_Voltage_Pub++&gt;10)</span></span>
<span class="line"><span style="color:#24292e;">      {</span></span>
<span class="line"><span style="color:#24292e;">        Count_Voltage_Pub=0;  </span></span>
<span class="line"><span style="color:#24292e;">        voltage_msgs.data = Power_voltage; //The power supply voltage is obtained //电源供电的电压获取</span></span>
<span class="line"><span style="color:#24292e;">        voltage_publisher.publish(voltage_msgs); //Post the power supply voltage topic unit: V, volt //发布电源电压话题单位：V、伏特</span></span>
<span class="line"><span style="color:#24292e;">      }</span></span>
<span class="line"><span style="color:#24292e;">}</span></span></code></pre></div><h3 id="发布imu数据话题" tabindex="-1">发布IMU数据话题 <a class="header-anchor" href="#发布imu数据话题" aria-label="Permalink to &quot;发布IMU数据话题&quot;">​</a></h3><div class="language-c++ vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">c++</span><pre class="shiki github-dark-dimmed vp-code-dark"><code><span class="line"><span style="color:#adbac7;">void turn_on_robot::Publish_ImuSensor()</span></span>
<span class="line"><span style="color:#adbac7;">{</span></span>
<span class="line"><span style="color:#adbac7;">  sensor_msgs::Imu Imu_Data_Pub; //Instantiate IMU topic data //实例化IMU话题数据</span></span>
<span class="line"><span style="color:#adbac7;">  Imu_Data_Pub.header.stamp = ros::Time::now(); </span></span>
<span class="line"><span style="color:#adbac7;">  Imu_Data_Pub.header.frame_id = gyro_frame_id; //IMU corresponds to TF coordinates, which is required to use the robot_pose_ekf feature pack </span></span>
<span class="line"><span style="color:#adbac7;">                                                //IMU对应TF坐标，使用robot_pose_ekf功能包需要设置此项</span></span>
<span class="line"><span style="color:#adbac7;">  Imu_Data_Pub.orientation.x = Mpu6050.orientation.x; //A quaternion represents a three-axis attitude //四元数表达三轴姿态</span></span>
<span class="line"><span style="color:#adbac7;">  Imu_Data_Pub.orientation.y = Mpu6050.orientation.y; </span></span>
<span class="line"><span style="color:#adbac7;">  Imu_Data_Pub.orientation.z = Mpu6050.orientation.z;</span></span>
<span class="line"><span style="color:#adbac7;">  Imu_Data_Pub.orientation.w = Mpu6050.orientation.w;</span></span>
<span class="line"><span style="color:#adbac7;">  Imu_Data_Pub.orientation_covariance[0] = 1e6; //Three-axis attitude covariance matrix //三轴姿态协方差矩阵</span></span>
<span class="line"><span style="color:#adbac7;">  Imu_Data_Pub.orientation_covariance[4] = 1e6;</span></span>
<span class="line"><span style="color:#adbac7;">  Imu_Data_Pub.orientation_covariance[8] = 1e-6;</span></span>
<span class="line"><span style="color:#adbac7;">  Imu_Data_Pub.angular_velocity.x = Mpu6050.angular_velocity.x; //Triaxial angular velocity //三轴角速度</span></span>
<span class="line"><span style="color:#adbac7;">  Imu_Data_Pub.angular_velocity.y = Mpu6050.angular_velocity.y;</span></span>
<span class="line"><span style="color:#adbac7;">  Imu_Data_Pub.angular_velocity.z = Mpu6050.angular_velocity.z;</span></span>
<span class="line"><span style="color:#adbac7;">  Imu_Data_Pub.angular_velocity_covariance[0] = 1e6; //Triaxial angular velocity covariance matrix //三轴角速度协方差矩阵</span></span>
<span class="line"><span style="color:#adbac7;">  Imu_Data_Pub.angular_velocity_covariance[4] = 1e6;</span></span>
<span class="line"><span style="color:#adbac7;">  Imu_Data_Pub.angular_velocity_covariance[8] = 1e-6;</span></span>
<span class="line"><span style="color:#adbac7;">  Imu_Data_Pub.linear_acceleration.x = Mpu6050.linear_acceleration.x; //Triaxial acceleration //三轴线性加速度</span></span>
<span class="line"><span style="color:#adbac7;">  Imu_Data_Pub.linear_acceleration.y = Mpu6050.linear_acceleration.y; </span></span>
<span class="line"><span style="color:#adbac7;">  Imu_Data_Pub.linear_acceleration.z = Mpu6050.linear_acceleration.z;  </span></span>
<span class="line"><span style="color:#adbac7;">  imu_publisher.publish(Imu_Data_Pub); //Pub IMU topic //发布IMU话题</span></span>
<span class="line"><span style="color:#adbac7;">}</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#24292e;">void turn_on_robot::Publish_ImuSensor()</span></span>
<span class="line"><span style="color:#24292e;">{</span></span>
<span class="line"><span style="color:#24292e;">  sensor_msgs::Imu Imu_Data_Pub; //Instantiate IMU topic data //实例化IMU话题数据</span></span>
<span class="line"><span style="color:#24292e;">  Imu_Data_Pub.header.stamp = ros::Time::now(); </span></span>
<span class="line"><span style="color:#24292e;">  Imu_Data_Pub.header.frame_id = gyro_frame_id; //IMU corresponds to TF coordinates, which is required to use the robot_pose_ekf feature pack </span></span>
<span class="line"><span style="color:#24292e;">                                                //IMU对应TF坐标，使用robot_pose_ekf功能包需要设置此项</span></span>
<span class="line"><span style="color:#24292e;">  Imu_Data_Pub.orientation.x = Mpu6050.orientation.x; //A quaternion represents a three-axis attitude //四元数表达三轴姿态</span></span>
<span class="line"><span style="color:#24292e;">  Imu_Data_Pub.orientation.y = Mpu6050.orientation.y; </span></span>
<span class="line"><span style="color:#24292e;">  Imu_Data_Pub.orientation.z = Mpu6050.orientation.z;</span></span>
<span class="line"><span style="color:#24292e;">  Imu_Data_Pub.orientation.w = Mpu6050.orientation.w;</span></span>
<span class="line"><span style="color:#24292e;">  Imu_Data_Pub.orientation_covariance[0] = 1e6; //Three-axis attitude covariance matrix //三轴姿态协方差矩阵</span></span>
<span class="line"><span style="color:#24292e;">  Imu_Data_Pub.orientation_covariance[4] = 1e6;</span></span>
<span class="line"><span style="color:#24292e;">  Imu_Data_Pub.orientation_covariance[8] = 1e-6;</span></span>
<span class="line"><span style="color:#24292e;">  Imu_Data_Pub.angular_velocity.x = Mpu6050.angular_velocity.x; //Triaxial angular velocity //三轴角速度</span></span>
<span class="line"><span style="color:#24292e;">  Imu_Data_Pub.angular_velocity.y = Mpu6050.angular_velocity.y;</span></span>
<span class="line"><span style="color:#24292e;">  Imu_Data_Pub.angular_velocity.z = Mpu6050.angular_velocity.z;</span></span>
<span class="line"><span style="color:#24292e;">  Imu_Data_Pub.angular_velocity_covariance[0] = 1e6; //Triaxial angular velocity covariance matrix //三轴角速度协方差矩阵</span></span>
<span class="line"><span style="color:#24292e;">  Imu_Data_Pub.angular_velocity_covariance[4] = 1e6;</span></span>
<span class="line"><span style="color:#24292e;">  Imu_Data_Pub.angular_velocity_covariance[8] = 1e-6;</span></span>
<span class="line"><span style="color:#24292e;">  Imu_Data_Pub.linear_acceleration.x = Mpu6050.linear_acceleration.x; //Triaxial acceleration //三轴线性加速度</span></span>
<span class="line"><span style="color:#24292e;">  Imu_Data_Pub.linear_acceleration.y = Mpu6050.linear_acceleration.y; </span></span>
<span class="line"><span style="color:#24292e;">  Imu_Data_Pub.linear_acceleration.z = Mpu6050.linear_acceleration.z;  </span></span>
<span class="line"><span style="color:#24292e;">  imu_publisher.publish(Imu_Data_Pub); //Pub IMU topic //发布IMU话题</span></span>
<span class="line"><span style="color:#24292e;">}</span></span></code></pre></div><h3 id="发布里程计话题" tabindex="-1">发布里程计话题 <a class="header-anchor" href="#发布里程计话题" aria-label="Permalink to &quot;发布里程计话题&quot;">​</a></h3><div class="language-c++ vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">c++</span><pre class="shiki github-dark-dimmed vp-code-dark"><code><span class="line"><span style="color:#adbac7;">void turn_on_robot::Publish_Odom()</span></span>
<span class="line"><span style="color:#adbac7;">{</span></span>
<span class="line"><span style="color:#adbac7;">    //Convert the Z-axis rotation Angle into a quaternion for expression </span></span>
<span class="line"><span style="color:#adbac7;">    //把Z轴转角转换为四元数进行表达</span></span>
<span class="line"><span style="color:#adbac7;">    geometry_msgs::Quaternion odom_quat = tf::createQuaternionMsgFromYaw(Robot_Pos.Z);</span></span>
<span class="line"><span style="color:#adbac7;"></span></span>
<span class="line"><span style="color:#adbac7;">    nav_msgs::Odometry odom; //Instance the odometer topic data //实例化里程计话题数据</span></span>
<span class="line"><span style="color:#adbac7;">    odom.header.stamp = ros::Time::now(); </span></span>
<span class="line"><span style="color:#adbac7;">    odom.header.frame_id = odom_frame_id; // Odometer TF parent coordinates //里程计TF父坐标</span></span>
<span class="line"><span style="color:#adbac7;">    odom.pose.pose.position.x = Robot_Pos.X; //Position //位置</span></span>
<span class="line"><span style="color:#adbac7;">    odom.pose.pose.position.y = Robot_Pos.Y;</span></span>
<span class="line"><span style="color:#adbac7;">    odom.pose.pose.position.z = Robot_Pos.Z;</span></span>
<span class="line"><span style="color:#adbac7;">    odom.pose.pose.orientation = odom_quat; //Posture, Quaternion converted by Z-axis rotation //姿态，通过Z轴转角转换的四元数</span></span>
<span class="line"><span style="color:#adbac7;"></span></span>
<span class="line"><span style="color:#adbac7;">    odom.child_frame_id = robot_frame_id; // Odometer TF subcoordinates //里程计TF子坐标</span></span>
<span class="line"><span style="color:#adbac7;">    odom.twist.twist.linear.x =  Robot_Vel.X; //Speed in the X direction //X方向速度</span></span>
<span class="line"><span style="color:#adbac7;">    odom.twist.twist.linear.y =  Robot_Vel.Y; //Speed in the Y direction //Y方向速度</span></span>
<span class="line"><span style="color:#adbac7;">    odom.twist.twist.angular.z = Robot_Vel.Z; //Angular velocity around the Z axis //绕Z轴角速度 </span></span>
<span class="line"><span style="color:#adbac7;"></span></span>
<span class="line"><span style="color:#adbac7;">    //There are two types of this matrix, which are used when the robot is at rest and when it is moving.Extended Kalman Filtering officially provides 2 matrices for the robot_pose_ekf feature pack</span></span>
<span class="line"><span style="color:#adbac7;">    //这个矩阵有两种，分别在机器人静止和运动的时候使用。扩展卡尔曼滤波官方提供的2个矩阵，用于robot_pose_ekf功能包</span></span>
<span class="line"><span style="color:#adbac7;">    if(Robot_Vel.X== 0&amp;&amp;Robot_Vel.Y== 0&amp;&amp;Robot_Vel.Z== 0)</span></span>
<span class="line"><span style="color:#adbac7;">      //If the velocity is zero, it means that the error of the encoder will be relatively small, and the data of the encoder will be considered more reliable</span></span>
<span class="line"><span style="color:#adbac7;">      //如果velocity是零，说明编码器的误差会比较小，认为编码器数据更可靠</span></span>
<span class="line"><span style="color:#adbac7;">      memcpy(&amp;odom.pose.covariance, odom_pose_covariance2, sizeof(odom_pose_covariance2)),</span></span>
<span class="line"><span style="color:#adbac7;">      memcpy(&amp;odom.twist.covariance, odom_twist_covariance2, sizeof(odom_twist_covariance2));</span></span>
<span class="line"><span style="color:#adbac7;">    else</span></span>
<span class="line"><span style="color:#adbac7;">      //If the velocity of the trolley is non-zero, considering the sliding error that may be brought by the encoder in motion, the data of IMU is considered to be more reliable</span></span>
<span class="line"><span style="color:#adbac7;">      //如果小车velocity非零，考虑到运动中编码器可能带来的滑动误差，认为imu的数据更可靠</span></span>
<span class="line"><span style="color:#adbac7;">      memcpy(&amp;odom.pose.covariance, odom_pose_covariance, sizeof(odom_pose_covariance)),</span></span>
<span class="line"><span style="color:#adbac7;">      memcpy(&amp;odom.twist.covariance, odom_twist_covariance, sizeof(odom_twist_covariance));       </span></span>
<span class="line"><span style="color:#adbac7;">    odom_publisher.publish(odom); //Pub odometer topic //发布里程计话题</span></span>
<span class="line"><span style="color:#adbac7;">}</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#24292e;">void turn_on_robot::Publish_Odom()</span></span>
<span class="line"><span style="color:#24292e;">{</span></span>
<span class="line"><span style="color:#24292e;">    //Convert the Z-axis rotation Angle into a quaternion for expression </span></span>
<span class="line"><span style="color:#24292e;">    //把Z轴转角转换为四元数进行表达</span></span>
<span class="line"><span style="color:#24292e;">    geometry_msgs::Quaternion odom_quat = tf::createQuaternionMsgFromYaw(Robot_Pos.Z);</span></span>
<span class="line"><span style="color:#24292e;"></span></span>
<span class="line"><span style="color:#24292e;">    nav_msgs::Odometry odom; //Instance the odometer topic data //实例化里程计话题数据</span></span>
<span class="line"><span style="color:#24292e;">    odom.header.stamp = ros::Time::now(); </span></span>
<span class="line"><span style="color:#24292e;">    odom.header.frame_id = odom_frame_id; // Odometer TF parent coordinates //里程计TF父坐标</span></span>
<span class="line"><span style="color:#24292e;">    odom.pose.pose.position.x = Robot_Pos.X; //Position //位置</span></span>
<span class="line"><span style="color:#24292e;">    odom.pose.pose.position.y = Robot_Pos.Y;</span></span>
<span class="line"><span style="color:#24292e;">    odom.pose.pose.position.z = Robot_Pos.Z;</span></span>
<span class="line"><span style="color:#24292e;">    odom.pose.pose.orientation = odom_quat; //Posture, Quaternion converted by Z-axis rotation //姿态，通过Z轴转角转换的四元数</span></span>
<span class="line"><span style="color:#24292e;"></span></span>
<span class="line"><span style="color:#24292e;">    odom.child_frame_id = robot_frame_id; // Odometer TF subcoordinates //里程计TF子坐标</span></span>
<span class="line"><span style="color:#24292e;">    odom.twist.twist.linear.x =  Robot_Vel.X; //Speed in the X direction //X方向速度</span></span>
<span class="line"><span style="color:#24292e;">    odom.twist.twist.linear.y =  Robot_Vel.Y; //Speed in the Y direction //Y方向速度</span></span>
<span class="line"><span style="color:#24292e;">    odom.twist.twist.angular.z = Robot_Vel.Z; //Angular velocity around the Z axis //绕Z轴角速度 </span></span>
<span class="line"><span style="color:#24292e;"></span></span>
<span class="line"><span style="color:#24292e;">    //There are two types of this matrix, which are used when the robot is at rest and when it is moving.Extended Kalman Filtering officially provides 2 matrices for the robot_pose_ekf feature pack</span></span>
<span class="line"><span style="color:#24292e;">    //这个矩阵有两种，分别在机器人静止和运动的时候使用。扩展卡尔曼滤波官方提供的2个矩阵，用于robot_pose_ekf功能包</span></span>
<span class="line"><span style="color:#24292e;">    if(Robot_Vel.X== 0&amp;&amp;Robot_Vel.Y== 0&amp;&amp;Robot_Vel.Z== 0)</span></span>
<span class="line"><span style="color:#24292e;">      //If the velocity is zero, it means that the error of the encoder will be relatively small, and the data of the encoder will be considered more reliable</span></span>
<span class="line"><span style="color:#24292e;">      //如果velocity是零，说明编码器的误差会比较小，认为编码器数据更可靠</span></span>
<span class="line"><span style="color:#24292e;">      memcpy(&amp;odom.pose.covariance, odom_pose_covariance2, sizeof(odom_pose_covariance2)),</span></span>
<span class="line"><span style="color:#24292e;">      memcpy(&amp;odom.twist.covariance, odom_twist_covariance2, sizeof(odom_twist_covariance2));</span></span>
<span class="line"><span style="color:#24292e;">    else</span></span>
<span class="line"><span style="color:#24292e;">      //If the velocity of the trolley is non-zero, considering the sliding error that may be brought by the encoder in motion, the data of IMU is considered to be more reliable</span></span>
<span class="line"><span style="color:#24292e;">      //如果小车velocity非零，考虑到运动中编码器可能带来的滑动误差，认为imu的数据更可靠</span></span>
<span class="line"><span style="color:#24292e;">      memcpy(&amp;odom.pose.covariance, odom_pose_covariance, sizeof(odom_pose_covariance)),</span></span>
<span class="line"><span style="color:#24292e;">      memcpy(&amp;odom.twist.covariance, odom_twist_covariance, sizeof(odom_twist_covariance));       </span></span>
<span class="line"><span style="color:#24292e;">    odom_publisher.publish(odom); //Pub odometer topic //发布里程计话题</span></span>
<span class="line"><span style="color:#24292e;">}</span></span></code></pre></div><h2 id="_3-查看里程计、imu-话题信息" tabindex="-1">3. 查看里程计、IMU 话题信息 <a class="header-anchor" href="#_3-查看里程计、imu-话题信息" aria-label="Permalink to &quot;3. 查看里程计、IMU 话题信息&quot;">​</a></h2><p>启动初始化节点(wheeltec 终端)：</p><div class="language-bash vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">bash</span><pre class="shiki github-dark-dimmed vp-code-dark"><code><span class="line"><span style="color:#F69D50;">roslaunch</span><span style="color:#ADBAC7;"> </span><span style="color:#96D0FF;">turn_on_wheeltec_robot</span><span style="color:#ADBAC7;"> </span><span style="color:#96D0FF;">turn_on_wheeltec_robot.launch</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#6F42C1;">roslaunch</span><span style="color:#24292E;"> </span><span style="color:#032F62;">turn_on_wheeltec_robot</span><span style="color:#24292E;"> </span><span style="color:#032F62;">turn_on_wheeltec_robot.launch</span></span></code></pre></div><p>查看里程计信息：</p><div class="language-bash vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">bash</span><pre class="shiki github-dark-dimmed vp-code-dark"><code><span class="line"><span style="color:#F69D50;">rostopic</span><span style="color:#ADBAC7;"> </span><span style="color:#96D0FF;">echo</span><span style="color:#ADBAC7;"> </span><span style="color:#96D0FF;">/odom</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#6F42C1;">rostopic</span><span style="color:#24292E;"> </span><span style="color:#032F62;">echo</span><span style="color:#24292E;"> </span><span style="color:#032F62;">/odom</span></span></code></pre></div><p>查看 IMU 信息：</p><div class="language-bash vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">bash</span><pre class="shiki github-dark-dimmed vp-code-dark"><code><span class="line"><span style="color:#F69D50;">rostopic</span><span style="color:#ADBAC7;"> </span><span style="color:#96D0FF;">echo</span><span style="color:#ADBAC7;"> </span><span style="color:#96D0FF;">/mobile_base/sensors/imu_data</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#6F42C1;">rostopic</span><span style="color:#24292E;"> </span><span style="color:#032F62;">echo</span><span style="color:#24292E;"> </span><span style="color:#032F62;">/mobile_base/sensors/imu_data</span></span></code></pre></div><p>查看小车电压：</p><div class="language-bash vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">bash</span><pre class="shiki github-dark-dimmed vp-code-dark"><code><span class="line"><span style="color:#F69D50;">rostopic</span><span style="color:#ADBAC7;"> </span><span style="color:#96D0FF;">echo</span><span style="color:#ADBAC7;"> </span><span style="color:#96D0FF;">/PowerVoltage</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#6F42C1;">rostopic</span><span style="color:#24292E;"> </span><span style="color:#032F62;">echo</span><span style="color:#24292E;"> </span><span style="color:#032F62;">/PowerVoltage</span></span></code></pre></div><p>查看数据结构</p><div class="language-bash vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">bash</span><pre class="shiki github-dark-dimmed vp-code-dark"><code><span class="line"><span style="color:#F69D50;">rostopic</span><span style="color:#ADBAC7;"> </span><span style="color:#96D0FF;">info</span><span style="color:#ADBAC7;"> </span><span style="color:#96D0FF;">/odom</span></span>
<span class="line"><span style="color:#F69D50;">rosmsg</span><span style="color:#ADBAC7;"> </span><span style="color:#96D0FF;">show</span><span style="color:#ADBAC7;"> </span><span style="color:#96D0FF;">nav_msgs/Odometry</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#6F42C1;">rostopic</span><span style="color:#24292E;"> </span><span style="color:#032F62;">info</span><span style="color:#24292E;"> </span><span style="color:#032F62;">/odom</span></span>
<span class="line"><span style="color:#6F42C1;">rosmsg</span><span style="color:#24292E;"> </span><span style="color:#032F62;">show</span><span style="color:#24292E;"> </span><span style="color:#032F62;">nav_msgs/Odometry</span></span></code></pre></div><h2 id="_4-键盘控制小车移动" tabindex="-1">4. 键盘控制小车移动 <a class="header-anchor" href="#_4-键盘控制小车移动" aria-label="Permalink to &quot;4. 键盘控制小车移动&quot;">​</a></h2><p>功能包：wheeltec_robot_rc</p><p>启动初始化节点(wheeltec终端)：</p><div class="language-bash vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">bash</span><pre class="shiki github-dark-dimmed vp-code-dark"><code><span class="line"><span style="color:#F69D50;">roslaunch</span><span style="color:#ADBAC7;"> </span><span style="color:#96D0FF;">turn_on_wheeltec_robot</span><span style="color:#ADBAC7;"> </span><span style="color:#96D0FF;">turn_on_wheeltec_robot.launch</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#6F42C1;">roslaunch</span><span style="color:#24292E;"> </span><span style="color:#032F62;">turn_on_wheeltec_robot</span><span style="color:#24292E;"> </span><span style="color:#032F62;">turn_on_wheeltec_robot.launch</span></span></code></pre></div><p>按键控制(wheeltec终端)：</p><div class="language-bash vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">bash</span><pre class="shiki github-dark-dimmed vp-code-dark"><code><span class="line"><span style="color:#F69D50;">roslaunch</span><span style="color:#ADBAC7;"> </span><span style="color:#96D0FF;">wheeltec_robot_rc</span><span style="color:#ADBAC7;"> </span><span style="color:#96D0FF;">keyboard_teleop.launch</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#6F42C1;">roslaunch</span><span style="color:#24292E;"> </span><span style="color:#032F62;">wheeltec_robot_rc</span><span style="color:#24292E;"> </span><span style="color:#032F62;">keyboard_teleop.launch</span></span></code></pre></div><h3 id="turtlebot-teleop-key-py" tabindex="-1">turtlebot_teleop_key.py <a class="header-anchor" href="#turtlebot-teleop-key-py" aria-label="Permalink to &quot;turtlebot_teleop_key.py&quot;">​</a></h3><div class="language-py vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">py</span><pre class="shiki github-dark-dimmed vp-code-dark"><code><span class="line"><span style="color:#F47067;">import</span><span style="color:#ADBAC7;"> rospy</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F47067;">from</span><span style="color:#ADBAC7;"> geometry_msgs.msg </span><span style="color:#F47067;">import</span><span style="color:#ADBAC7;"> Twist</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F47067;">import</span><span style="color:#ADBAC7;"> sys, select, termios, tty</span></span>
<span class="line"></span>
<span class="line"><span style="color:#ADBAC7;">msg </span><span style="color:#F47067;">=</span><span style="color:#ADBAC7;"> </span><span style="color:#96D0FF;">&quot;&quot;&quot;</span></span>
<span class="line"><span style="color:#96D0FF;">Control Your Turtlebot!</span></span>
<span class="line"><span style="color:#96D0FF;">---------------------------</span></span>
<span class="line"><span style="color:#96D0FF;">Moving around:</span></span>
<span class="line"><span style="color:#96D0FF;">   u    i    o</span></span>
<span class="line"><span style="color:#96D0FF;">   j    k    l</span></span>
<span class="line"><span style="color:#96D0FF;">   m    ,    .</span></span>
<span class="line"></span>
<span class="line"><span style="color:#96D0FF;">q/z : increase/decrease max speeds by 10%</span></span>
<span class="line"><span style="color:#96D0FF;">w/x : increase/decrease only linear speed by 10%</span></span>
<span class="line"><span style="color:#96D0FF;">e/c : increase/decrease only angular speed by 10%</span></span>
<span class="line"><span style="color:#96D0FF;">space key, k : force stop</span></span>
<span class="line"><span style="color:#96D0FF;">anything else : stop smoothly</span></span>
<span class="line"><span style="color:#96D0FF;">b : switch to OmniMode/CommonMode</span></span>
<span class="line"><span style="color:#96D0FF;">CTRL-C to quit</span></span>
<span class="line"><span style="color:#96D0FF;">&quot;&quot;&quot;</span></span>
<span class="line"><span style="color:#ADBAC7;">Omni </span><span style="color:#F47067;">=</span><span style="color:#ADBAC7;"> </span><span style="color:#6CB6FF;">0</span><span style="color:#ADBAC7;"> </span><span style="color:#768390;">#全向移动模式</span></span>
<span class="line"></span>
<span class="line"><span style="color:#768390;">#键值对应移动/转向方向</span></span>
<span class="line"><span style="color:#ADBAC7;">moveBindings </span><span style="color:#F47067;">=</span><span style="color:#ADBAC7;"> {</span></span>
<span class="line"><span style="color:#ADBAC7;">        </span><span style="color:#96D0FF;">&#39;i&#39;</span><span style="color:#ADBAC7;">:( </span><span style="color:#6CB6FF;">1</span><span style="color:#ADBAC7;">, </span><span style="color:#6CB6FF;">0</span><span style="color:#ADBAC7;">),</span></span>
<span class="line"><span style="color:#ADBAC7;">        </span><span style="color:#96D0FF;">&#39;o&#39;</span><span style="color:#ADBAC7;">:( </span><span style="color:#6CB6FF;">1</span><span style="color:#ADBAC7;">,</span><span style="color:#F47067;">-</span><span style="color:#6CB6FF;">1</span><span style="color:#ADBAC7;">),</span></span>
<span class="line"><span style="color:#ADBAC7;">        </span><span style="color:#96D0FF;">&#39;j&#39;</span><span style="color:#ADBAC7;">:( </span><span style="color:#6CB6FF;">0</span><span style="color:#ADBAC7;">, </span><span style="color:#6CB6FF;">1</span><span style="color:#ADBAC7;">),</span></span>
<span class="line"><span style="color:#ADBAC7;">        </span><span style="color:#96D0FF;">&#39;l&#39;</span><span style="color:#ADBAC7;">:( </span><span style="color:#6CB6FF;">0</span><span style="color:#ADBAC7;">,</span><span style="color:#F47067;">-</span><span style="color:#6CB6FF;">1</span><span style="color:#ADBAC7;">),</span></span>
<span class="line"><span style="color:#ADBAC7;">        </span><span style="color:#96D0FF;">&#39;u&#39;</span><span style="color:#ADBAC7;">:( </span><span style="color:#6CB6FF;">1</span><span style="color:#ADBAC7;">, </span><span style="color:#6CB6FF;">1</span><span style="color:#ADBAC7;">),</span></span>
<span class="line"><span style="color:#ADBAC7;">        </span><span style="color:#96D0FF;">&#39;,&#39;</span><span style="color:#ADBAC7;">:(</span><span style="color:#F47067;">-</span><span style="color:#6CB6FF;">1</span><span style="color:#ADBAC7;">, </span><span style="color:#6CB6FF;">0</span><span style="color:#ADBAC7;">),</span></span>
<span class="line"><span style="color:#ADBAC7;">        </span><span style="color:#96D0FF;">&#39;.&#39;</span><span style="color:#ADBAC7;">:(</span><span style="color:#F47067;">-</span><span style="color:#6CB6FF;">1</span><span style="color:#ADBAC7;">, </span><span style="color:#6CB6FF;">1</span><span style="color:#ADBAC7;">),</span></span>
<span class="line"><span style="color:#ADBAC7;">        </span><span style="color:#96D0FF;">&#39;m&#39;</span><span style="color:#ADBAC7;">:(</span><span style="color:#F47067;">-</span><span style="color:#6CB6FF;">1</span><span style="color:#ADBAC7;">,</span><span style="color:#F47067;">-</span><span style="color:#6CB6FF;">1</span><span style="color:#ADBAC7;">),</span></span>
<span class="line"><span style="color:#ADBAC7;">           }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#768390;">#键值对应速度增量</span></span>
<span class="line"><span style="color:#ADBAC7;">speedBindings</span><span style="color:#F47067;">=</span><span style="color:#ADBAC7;">{</span></span>
<span class="line"><span style="color:#ADBAC7;">        </span><span style="color:#96D0FF;">&#39;q&#39;</span><span style="color:#ADBAC7;">:(</span><span style="color:#6CB6FF;">1.1</span><span style="color:#ADBAC7;">,</span><span style="color:#6CB6FF;">1.1</span><span style="color:#ADBAC7;">),</span></span>
<span class="line"><span style="color:#ADBAC7;">        </span><span style="color:#96D0FF;">&#39;z&#39;</span><span style="color:#ADBAC7;">:(</span><span style="color:#6CB6FF;">0.9</span><span style="color:#ADBAC7;">,</span><span style="color:#6CB6FF;">0.9</span><span style="color:#ADBAC7;">),</span></span>
<span class="line"><span style="color:#ADBAC7;">        </span><span style="color:#96D0FF;">&#39;w&#39;</span><span style="color:#ADBAC7;">:(</span><span style="color:#6CB6FF;">1.1</span><span style="color:#ADBAC7;">,</span><span style="color:#6CB6FF;">1</span><span style="color:#ADBAC7;">),</span></span>
<span class="line"><span style="color:#ADBAC7;">        </span><span style="color:#96D0FF;">&#39;x&#39;</span><span style="color:#ADBAC7;">:(</span><span style="color:#6CB6FF;">0.9</span><span style="color:#ADBAC7;">,</span><span style="color:#6CB6FF;">1</span><span style="color:#ADBAC7;">),</span></span>
<span class="line"><span style="color:#ADBAC7;">        </span><span style="color:#96D0FF;">&#39;e&#39;</span><span style="color:#ADBAC7;">:(</span><span style="color:#6CB6FF;">1</span><span style="color:#ADBAC7;">,  </span><span style="color:#6CB6FF;">1.1</span><span style="color:#ADBAC7;">),</span></span>
<span class="line"><span style="color:#ADBAC7;">        </span><span style="color:#96D0FF;">&#39;c&#39;</span><span style="color:#ADBAC7;">:(</span><span style="color:#6CB6FF;">1</span><span style="color:#ADBAC7;">,  </span><span style="color:#6CB6FF;">0.9</span><span style="color:#ADBAC7;">),</span></span>
<span class="line"><span style="color:#ADBAC7;">          }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#768390;">#获取键值函数</span></span>
<span class="line"><span style="color:#F47067;">def</span><span style="color:#ADBAC7;"> </span><span style="color:#DCBDFB;">getKey</span><span style="color:#ADBAC7;">():</span></span>
<span class="line"><span style="color:#ADBAC7;">    tty.setraw(sys.stdin.fileno())</span></span>
<span class="line"><span style="color:#ADBAC7;">    rlist, _, _ </span><span style="color:#F47067;">=</span><span style="color:#ADBAC7;"> select.select([sys.stdin], [], [], </span><span style="color:#6CB6FF;">0.1</span><span style="color:#ADBAC7;">)</span></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#F47067;">if</span><span style="color:#ADBAC7;"> rlist:</span></span>
<span class="line"><span style="color:#ADBAC7;">        key </span><span style="color:#F47067;">=</span><span style="color:#ADBAC7;"> sys.stdin.read(</span><span style="color:#6CB6FF;">1</span><span style="color:#ADBAC7;">)</span></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#F47067;">else</span><span style="color:#ADBAC7;">:</span></span>
<span class="line"><span style="color:#ADBAC7;">        key </span><span style="color:#F47067;">=</span><span style="color:#ADBAC7;"> </span><span style="color:#96D0FF;">&#39;&#39;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#ADBAC7;">    termios.tcsetattr(sys.stdin, termios.</span><span style="color:#6CB6FF;">TCSADRAIN</span><span style="color:#ADBAC7;">, settings)</span></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#F47067;">return</span><span style="color:#ADBAC7;"> key</span></span>
<span class="line"></span>
<span class="line"></span>
<span class="line"><span style="color:#ADBAC7;">speed </span><span style="color:#F47067;">=</span><span style="color:#ADBAC7;"> </span><span style="color:#6CB6FF;">0.2</span><span style="color:#ADBAC7;"> </span><span style="color:#768390;">#默认移动速度 m/s</span></span>
<span class="line"><span style="color:#ADBAC7;">turn  </span><span style="color:#F47067;">=</span><span style="color:#ADBAC7;"> </span><span style="color:#6CB6FF;">0.5</span><span style="color:#ADBAC7;">   </span><span style="color:#768390;">#默认转向速度 rad/s</span></span>
<span class="line"><span style="color:#768390;">#以字符串格式返回当前速度</span></span>
<span class="line"><span style="color:#F47067;">def</span><span style="color:#ADBAC7;"> </span><span style="color:#DCBDFB;">vels</span><span style="color:#ADBAC7;">(speed,turn):</span></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#F47067;">return</span><span style="color:#ADBAC7;"> </span><span style="color:#96D0FF;">&quot;currently:</span><span style="color:#F47067;">\\t</span><span style="color:#96D0FF;">speed </span><span style="color:#F47067;">%s\\t</span><span style="color:#96D0FF;">turn </span><span style="color:#F47067;">%s</span><span style="color:#96D0FF;"> &quot;</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">%</span><span style="color:#ADBAC7;"> (speed,turn)</span></span>
<span class="line"></span>
<span class="line"><span style="color:#768390;">#主函数</span></span>
<span class="line"><span style="color:#F47067;">if</span><span style="color:#ADBAC7;"> </span><span style="color:#6CB6FF;">__name__</span><span style="color:#F47067;">==</span><span style="color:#96D0FF;">&quot;__main__&quot;</span><span style="color:#ADBAC7;">:</span></span>
<span class="line"><span style="color:#ADBAC7;">    settings </span><span style="color:#F47067;">=</span><span style="color:#ADBAC7;"> termios.tcgetattr(sys.stdin) </span><span style="color:#768390;">#获取键值初始化，读取终端相关属性</span></span>
<span class="line"><span style="color:#ADBAC7;">    </span></span>
<span class="line"><span style="color:#ADBAC7;">    rospy.init_node(</span><span style="color:#96D0FF;">&#39;turtlebot_teleop&#39;</span><span style="color:#ADBAC7;">) </span><span style="color:#768390;">#创建ROS节点</span></span>
<span class="line"><span style="color:#ADBAC7;">    pub </span><span style="color:#F47067;">=</span><span style="color:#ADBAC7;"> rospy.Publisher(</span><span style="color:#96D0FF;">&#39;~cmd_vel&#39;</span><span style="color:#ADBAC7;">, Twist, </span><span style="color:#F69D50;">queue_size</span><span style="color:#F47067;">=</span><span style="color:#6CB6FF;">5</span><span style="color:#ADBAC7;">) </span><span style="color:#768390;">#创建速度话题发布者，&#39;~cmd_vel&#39;=&#39;节点名/cmd_vel&#39;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#ADBAC7;">    x      </span><span style="color:#F47067;">=</span><span style="color:#ADBAC7;"> </span><span style="color:#6CB6FF;">0</span><span style="color:#ADBAC7;">   </span><span style="color:#768390;">#前进后退方向</span></span>
<span class="line"><span style="color:#ADBAC7;">    th     </span><span style="color:#F47067;">=</span><span style="color:#ADBAC7;"> </span><span style="color:#6CB6FF;">0</span><span style="color:#ADBAC7;">   </span><span style="color:#768390;">#转向/横向移动方向</span></span>
<span class="line"><span style="color:#ADBAC7;">    count  </span><span style="color:#F47067;">=</span><span style="color:#ADBAC7;"> </span><span style="color:#6CB6FF;">0</span><span style="color:#ADBAC7;">   </span><span style="color:#768390;">#键值不再范围计数</span></span>
<span class="line"><span style="color:#ADBAC7;">    target_speed </span><span style="color:#F47067;">=</span><span style="color:#ADBAC7;"> </span><span style="color:#6CB6FF;">0</span><span style="color:#ADBAC7;"> </span><span style="color:#768390;">#前进后退目标速度</span></span>
<span class="line"><span style="color:#ADBAC7;">    target_turn  </span><span style="color:#F47067;">=</span><span style="color:#ADBAC7;"> </span><span style="color:#6CB6FF;">0</span><span style="color:#ADBAC7;"> </span><span style="color:#768390;">#转向目标速度</span></span>
<span class="line"><span style="color:#ADBAC7;">    target_HorizonMove </span><span style="color:#F47067;">=</span><span style="color:#ADBAC7;"> </span><span style="color:#6CB6FF;">0</span><span style="color:#ADBAC7;"> </span><span style="color:#768390;">#横向移动目标速度</span></span>
<span class="line"><span style="color:#ADBAC7;">    control_speed </span><span style="color:#F47067;">=</span><span style="color:#ADBAC7;"> </span><span style="color:#6CB6FF;">0</span><span style="color:#ADBAC7;"> </span><span style="color:#768390;">#前进后退实际控制速度</span></span>
<span class="line"><span style="color:#ADBAC7;">    control_turn  </span><span style="color:#F47067;">=</span><span style="color:#ADBAC7;"> </span><span style="color:#6CB6FF;">0</span><span style="color:#ADBAC7;"> </span><span style="color:#768390;">#转向实际控制速度</span></span>
<span class="line"><span style="color:#ADBAC7;">    control_HorizonMove </span><span style="color:#F47067;">=</span><span style="color:#ADBAC7;"> </span><span style="color:#6CB6FF;">0</span><span style="color:#ADBAC7;"> </span><span style="color:#768390;">#横向移动实际控制速度</span></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#F47067;">try</span><span style="color:#ADBAC7;">:</span></span>
<span class="line"><span style="color:#ADBAC7;">        </span><span style="color:#6CB6FF;">print</span><span style="color:#ADBAC7;">(msg) </span><span style="color:#768390;">#打印控制说明</span></span>
<span class="line"><span style="color:#ADBAC7;">        </span><span style="color:#6CB6FF;">print</span><span style="color:#ADBAC7;">(vels(speed,turn)) </span><span style="color:#768390;">#打印当前速度</span></span>
<span class="line"><span style="color:#ADBAC7;">        </span><span style="color:#F47067;">while</span><span style="color:#ADBAC7;">(</span><span style="color:#6CB6FF;">1</span><span style="color:#ADBAC7;">):</span></span>
<span class="line"><span style="color:#ADBAC7;">            key </span><span style="color:#F47067;">=</span><span style="color:#ADBAC7;"> getKey() </span><span style="color:#768390;">#获取键值</span></span>
<span class="line"></span>
<span class="line"><span style="color:#ADBAC7;">            </span><span style="color:#768390;">#切换是否为全向移动模式，全向轮/麦轮小车可以加入全向移动模式</span></span>
<span class="line"><span style="color:#ADBAC7;">            </span><span style="color:#F47067;">if</span><span style="color:#ADBAC7;"> key</span><span style="color:#F47067;">==</span><span style="color:#96D0FF;">&#39;b&#39;</span><span style="color:#ADBAC7;">:               </span></span>
<span class="line"><span style="color:#ADBAC7;">                Omni</span><span style="color:#F47067;">=~</span><span style="color:#ADBAC7;">Omni</span></span>
<span class="line"><span style="color:#ADBAC7;">                </span><span style="color:#F47067;">if</span><span style="color:#ADBAC7;"> Omni: </span></span>
<span class="line"><span style="color:#ADBAC7;">                    </span><span style="color:#6CB6FF;">print</span><span style="color:#ADBAC7;">(</span><span style="color:#96D0FF;">&quot;Switch to OmniMode&quot;</span><span style="color:#ADBAC7;">)</span></span>
<span class="line"><span style="color:#ADBAC7;">                    moveBindings[</span><span style="color:#96D0FF;">&#39;.&#39;</span><span style="color:#ADBAC7;">]</span><span style="color:#F47067;">=</span><span style="color:#ADBAC7;">[</span><span style="color:#F47067;">-</span><span style="color:#6CB6FF;">1</span><span style="color:#ADBAC7;">,</span><span style="color:#F47067;">-</span><span style="color:#6CB6FF;">1</span><span style="color:#ADBAC7;">]</span></span>
<span class="line"><span style="color:#ADBAC7;">                    moveBindings[</span><span style="color:#96D0FF;">&#39;m&#39;</span><span style="color:#ADBAC7;">]</span><span style="color:#F47067;">=</span><span style="color:#ADBAC7;">[</span><span style="color:#F47067;">-</span><span style="color:#6CB6FF;">1</span><span style="color:#ADBAC7;">, </span><span style="color:#6CB6FF;">1</span><span style="color:#ADBAC7;">]</span></span>
<span class="line"><span style="color:#ADBAC7;">                </span><span style="color:#F47067;">else</span><span style="color:#ADBAC7;">:</span></span>
<span class="line"><span style="color:#ADBAC7;">                    </span><span style="color:#6CB6FF;">print</span><span style="color:#ADBAC7;">(</span><span style="color:#96D0FF;">&quot;Switch to CommonMode&quot;</span><span style="color:#ADBAC7;">)</span></span>
<span class="line"><span style="color:#ADBAC7;">                    moveBindings[</span><span style="color:#96D0FF;">&#39;.&#39;</span><span style="color:#ADBAC7;">]</span><span style="color:#F47067;">=</span><span style="color:#ADBAC7;">[</span><span style="color:#F47067;">-</span><span style="color:#6CB6FF;">1</span><span style="color:#ADBAC7;">, </span><span style="color:#6CB6FF;">1</span><span style="color:#ADBAC7;">]</span></span>
<span class="line"><span style="color:#ADBAC7;">                    moveBindings[</span><span style="color:#96D0FF;">&#39;m&#39;</span><span style="color:#ADBAC7;">]</span><span style="color:#F47067;">=</span><span style="color:#ADBAC7;">[</span><span style="color:#F47067;">-</span><span style="color:#6CB6FF;">1</span><span style="color:#ADBAC7;">,</span><span style="color:#F47067;">-</span><span style="color:#6CB6FF;">1</span><span style="color:#ADBAC7;">]</span></span>
<span class="line"><span style="color:#ADBAC7;">            </span></span>
<span class="line"><span style="color:#ADBAC7;">            </span><span style="color:#768390;">#判断键值是否在移动/转向方向键值内</span></span>
<span class="line"><span style="color:#ADBAC7;">            </span><span style="color:#F47067;">if</span><span style="color:#ADBAC7;"> key </span><span style="color:#F47067;">in</span><span style="color:#ADBAC7;"> moveBindings.keys():</span></span>
<span class="line"><span style="color:#ADBAC7;">                x  </span><span style="color:#F47067;">=</span><span style="color:#ADBAC7;"> moveBindings[key][</span><span style="color:#6CB6FF;">0</span><span style="color:#ADBAC7;">]</span></span>
<span class="line"><span style="color:#ADBAC7;">                th </span><span style="color:#F47067;">=</span><span style="color:#ADBAC7;"> moveBindings[key][</span><span style="color:#6CB6FF;">1</span><span style="color:#ADBAC7;">]</span></span>
<span class="line"><span style="color:#ADBAC7;">                count </span><span style="color:#F47067;">=</span><span style="color:#ADBAC7;"> </span><span style="color:#6CB6FF;">0</span></span>
<span class="line"></span>
<span class="line"><span style="color:#ADBAC7;">            </span><span style="color:#768390;">#判断键值是否在速度增量键值内</span></span>
<span class="line"><span style="color:#ADBAC7;">            </span><span style="color:#F47067;">elif</span><span style="color:#ADBAC7;"> key </span><span style="color:#F47067;">in</span><span style="color:#ADBAC7;"> speedBindings.keys():</span></span>
<span class="line"><span style="color:#ADBAC7;">                speed </span><span style="color:#F47067;">=</span><span style="color:#ADBAC7;"> speed </span><span style="color:#F47067;">*</span><span style="color:#ADBAC7;"> speedBindings[key][</span><span style="color:#6CB6FF;">0</span><span style="color:#ADBAC7;">]</span></span>
<span class="line"><span style="color:#ADBAC7;">                turn  </span><span style="color:#F47067;">=</span><span style="color:#ADBAC7;"> turn  </span><span style="color:#F47067;">*</span><span style="color:#ADBAC7;"> speedBindings[key][</span><span style="color:#6CB6FF;">1</span><span style="color:#ADBAC7;">]</span></span>
<span class="line"><span style="color:#ADBAC7;">                count </span><span style="color:#F47067;">=</span><span style="color:#ADBAC7;"> </span><span style="color:#6CB6FF;">0</span></span>
<span class="line"><span style="color:#ADBAC7;">                </span><span style="color:#6CB6FF;">print</span><span style="color:#ADBAC7;">(vels(speed,turn)) </span><span style="color:#768390;">#速度发生变化，打印出来</span></span>
<span class="line"></span>
<span class="line"><span style="color:#ADBAC7;">            </span><span style="color:#768390;">#空键值/&#39;k&#39;,相关变量置0</span></span>
<span class="line"><span style="color:#ADBAC7;">            </span><span style="color:#F47067;">elif</span><span style="color:#ADBAC7;"> key </span><span style="color:#F47067;">==</span><span style="color:#ADBAC7;"> </span><span style="color:#96D0FF;">&#39; &#39;</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">or</span><span style="color:#ADBAC7;"> key </span><span style="color:#F47067;">==</span><span style="color:#ADBAC7;"> </span><span style="color:#96D0FF;">&#39;k&#39;</span><span style="color:#ADBAC7;"> :</span></span>
<span class="line"><span style="color:#ADBAC7;">                x  </span><span style="color:#F47067;">=</span><span style="color:#ADBAC7;"> </span><span style="color:#6CB6FF;">0</span></span>
<span class="line"><span style="color:#ADBAC7;">                th </span><span style="color:#F47067;">=</span><span style="color:#ADBAC7;"> </span><span style="color:#6CB6FF;">0</span></span>
<span class="line"><span style="color:#ADBAC7;">                control_speed </span><span style="color:#F47067;">=</span><span style="color:#ADBAC7;"> </span><span style="color:#6CB6FF;">0</span></span>
<span class="line"><span style="color:#ADBAC7;">                control_turn  </span><span style="color:#F47067;">=</span><span style="color:#ADBAC7;"> </span><span style="color:#6CB6FF;">0</span></span>
<span class="line"><span style="color:#ADBAC7;">                HorizonMove   </span><span style="color:#F47067;">=</span><span style="color:#ADBAC7;"> </span><span style="color:#6CB6FF;">0</span></span>
<span class="line"></span>
<span class="line"><span style="color:#ADBAC7;">            </span><span style="color:#768390;">#长期识别到不明键值，相关变量置0</span></span>
<span class="line"><span style="color:#ADBAC7;">            </span><span style="color:#F47067;">else</span><span style="color:#ADBAC7;">:</span></span>
<span class="line"><span style="color:#ADBAC7;">                count </span><span style="color:#F47067;">=</span><span style="color:#ADBAC7;"> count </span><span style="color:#F47067;">+</span><span style="color:#ADBAC7;"> </span><span style="color:#6CB6FF;">1</span></span>
<span class="line"><span style="color:#ADBAC7;">                </span><span style="color:#F47067;">if</span><span style="color:#ADBAC7;"> count </span><span style="color:#F47067;">&gt;</span><span style="color:#ADBAC7;"> </span><span style="color:#6CB6FF;">4</span><span style="color:#ADBAC7;">:</span></span>
<span class="line"><span style="color:#ADBAC7;">                    x  </span><span style="color:#F47067;">=</span><span style="color:#ADBAC7;"> </span><span style="color:#6CB6FF;">0</span></span>
<span class="line"><span style="color:#ADBAC7;">                    th </span><span style="color:#F47067;">=</span><span style="color:#ADBAC7;"> </span><span style="color:#6CB6FF;">0</span></span>
<span class="line"><span style="color:#ADBAC7;">                </span><span style="color:#F47067;">if</span><span style="color:#ADBAC7;"> (key </span><span style="color:#F47067;">==</span><span style="color:#ADBAC7;"> </span><span style="color:#96D0FF;">&#39;</span><span style="color:#F47067;">\\x03</span><span style="color:#96D0FF;">&#39;</span><span style="color:#ADBAC7;">):</span></span>
<span class="line"><span style="color:#ADBAC7;">                    </span><span style="color:#F47067;">break</span></span>
<span class="line"></span>
<span class="line"><span style="color:#ADBAC7;">            </span><span style="color:#768390;">#根据速度与方向计算目标速度</span></span>
<span class="line"><span style="color:#ADBAC7;">            target_speed </span><span style="color:#F47067;">=</span><span style="color:#ADBAC7;"> speed </span><span style="color:#F47067;">*</span><span style="color:#ADBAC7;"> x</span></span>
<span class="line"><span style="color:#ADBAC7;">            target_turn  </span><span style="color:#F47067;">=</span><span style="color:#ADBAC7;"> turn </span><span style="color:#F47067;">*</span><span style="color:#ADBAC7;"> th</span></span>
<span class="line"><span style="color:#ADBAC7;">            target_HorizonMove </span><span style="color:#F47067;">=</span><span style="color:#ADBAC7;"> speed</span><span style="color:#F47067;">*</span><span style="color:#ADBAC7;">th</span></span>
<span class="line"></span>
<span class="line"><span style="color:#ADBAC7;">            </span><span style="color:#768390;">#平滑控制，计算前进后退实际控制速度</span></span>
<span class="line"><span style="color:#ADBAC7;">            </span><span style="color:#F47067;">if</span><span style="color:#ADBAC7;"> target_speed </span><span style="color:#F47067;">&gt;</span><span style="color:#ADBAC7;"> control_speed:</span></span>
<span class="line"><span style="color:#ADBAC7;">                control_speed </span><span style="color:#F47067;">=</span><span style="color:#ADBAC7;"> </span><span style="color:#6CB6FF;">min</span><span style="color:#ADBAC7;">( target_speed, control_speed </span><span style="color:#F47067;">+</span><span style="color:#ADBAC7;"> </span><span style="color:#6CB6FF;">0.1</span><span style="color:#ADBAC7;"> )</span></span>
<span class="line"><span style="color:#ADBAC7;">            </span><span style="color:#F47067;">elif</span><span style="color:#ADBAC7;"> target_speed </span><span style="color:#F47067;">&lt;</span><span style="color:#ADBAC7;"> control_speed:</span></span>
<span class="line"><span style="color:#ADBAC7;">                control_speed </span><span style="color:#F47067;">=</span><span style="color:#ADBAC7;"> </span><span style="color:#6CB6FF;">max</span><span style="color:#ADBAC7;">( target_speed, control_speed </span><span style="color:#F47067;">-</span><span style="color:#ADBAC7;"> </span><span style="color:#6CB6FF;">0.1</span><span style="color:#ADBAC7;"> )</span></span>
<span class="line"><span style="color:#ADBAC7;">            </span><span style="color:#F47067;">else</span><span style="color:#ADBAC7;">:</span></span>
<span class="line"><span style="color:#ADBAC7;">                control_speed </span><span style="color:#F47067;">=</span><span style="color:#ADBAC7;"> target_speed</span></span>
<span class="line"></span>
<span class="line"><span style="color:#ADBAC7;">            </span><span style="color:#768390;">#平滑控制，计算转向实际控制速度</span></span>
<span class="line"><span style="color:#ADBAC7;">            </span><span style="color:#F47067;">if</span><span style="color:#ADBAC7;"> target_turn </span><span style="color:#F47067;">&gt;</span><span style="color:#ADBAC7;"> control_turn:</span></span>
<span class="line"><span style="color:#ADBAC7;">                control_turn </span><span style="color:#F47067;">=</span><span style="color:#ADBAC7;"> </span><span style="color:#6CB6FF;">min</span><span style="color:#ADBAC7;">( target_turn, control_turn </span><span style="color:#F47067;">+</span><span style="color:#ADBAC7;"> </span><span style="color:#6CB6FF;">0.5</span><span style="color:#ADBAC7;"> )</span></span>
<span class="line"><span style="color:#ADBAC7;">            </span><span style="color:#F47067;">elif</span><span style="color:#ADBAC7;"> target_turn </span><span style="color:#F47067;">&lt;</span><span style="color:#ADBAC7;"> control_turn:</span></span>
<span class="line"><span style="color:#ADBAC7;">                control_turn </span><span style="color:#F47067;">=</span><span style="color:#ADBAC7;"> </span><span style="color:#6CB6FF;">max</span><span style="color:#ADBAC7;">( target_turn, control_turn </span><span style="color:#F47067;">-</span><span style="color:#ADBAC7;"> </span><span style="color:#6CB6FF;">0.5</span><span style="color:#ADBAC7;"> )</span></span>
<span class="line"><span style="color:#ADBAC7;">            </span><span style="color:#F47067;">else</span><span style="color:#ADBAC7;">:</span></span>
<span class="line"><span style="color:#ADBAC7;">                control_turn </span><span style="color:#F47067;">=</span><span style="color:#ADBAC7;"> target_turn</span></span>
<span class="line"></span>
<span class="line"><span style="color:#ADBAC7;">            </span><span style="color:#768390;">#平滑控制，计算横向移动实际控制速度</span></span>
<span class="line"><span style="color:#ADBAC7;">            </span><span style="color:#F47067;">if</span><span style="color:#ADBAC7;"> target_HorizonMove </span><span style="color:#F47067;">&gt;</span><span style="color:#ADBAC7;"> control_HorizonMove:</span></span>
<span class="line"><span style="color:#ADBAC7;">                control_HorizonMove </span><span style="color:#F47067;">=</span><span style="color:#ADBAC7;"> </span><span style="color:#6CB6FF;">min</span><span style="color:#ADBAC7;">( target_HorizonMove, control_HorizonMove </span><span style="color:#F47067;">+</span><span style="color:#ADBAC7;"> </span><span style="color:#6CB6FF;">0.1</span><span style="color:#ADBAC7;"> )</span></span>
<span class="line"><span style="color:#ADBAC7;">            </span><span style="color:#F47067;">elif</span><span style="color:#ADBAC7;"> target_HorizonMove </span><span style="color:#F47067;">&lt;</span><span style="color:#ADBAC7;"> control_HorizonMove:</span></span>
<span class="line"><span style="color:#ADBAC7;">                control_HorizonMove </span><span style="color:#F47067;">=</span><span style="color:#ADBAC7;"> </span><span style="color:#6CB6FF;">max</span><span style="color:#ADBAC7;">( target_HorizonMove, control_HorizonMove </span><span style="color:#F47067;">-</span><span style="color:#ADBAC7;"> </span><span style="color:#6CB6FF;">0.1</span><span style="color:#ADBAC7;"> )</span></span>
<span class="line"><span style="color:#ADBAC7;">            </span><span style="color:#F47067;">else</span><span style="color:#ADBAC7;">:</span></span>
<span class="line"><span style="color:#ADBAC7;">                control_HorizonMove </span><span style="color:#F47067;">=</span><span style="color:#ADBAC7;"> target_HorizonMove</span></span>
<span class="line"><span style="color:#ADBAC7;">         </span></span>
<span class="line"><span style="color:#ADBAC7;">            twist </span><span style="color:#F47067;">=</span><span style="color:#ADBAC7;"> Twist() </span><span style="color:#768390;">#创建ROS速度话题变量</span></span>
<span class="line"><span style="color:#ADBAC7;">            </span><span style="color:#768390;">#根据是否全向移动模式，给速度话题变量赋值</span></span>
<span class="line"><span style="color:#ADBAC7;">            </span><span style="color:#F47067;">if</span><span style="color:#ADBAC7;"> Omni</span><span style="color:#F47067;">==</span><span style="color:#6CB6FF;">0</span><span style="color:#ADBAC7;">:</span></span>
<span class="line"><span style="color:#ADBAC7;">                twist.linear.x  </span><span style="color:#F47067;">=</span><span style="color:#ADBAC7;"> control_speed; twist.linear.y </span><span style="color:#F47067;">=</span><span style="color:#ADBAC7;"> </span><span style="color:#6CB6FF;">0</span><span style="color:#ADBAC7;">;  twist.linear.z </span><span style="color:#F47067;">=</span><span style="color:#ADBAC7;"> </span><span style="color:#6CB6FF;">0</span></span>
<span class="line"><span style="color:#ADBAC7;">                twist.angular.x </span><span style="color:#F47067;">=</span><span style="color:#ADBAC7;"> </span><span style="color:#6CB6FF;">0</span><span style="color:#ADBAC7;">;             twist.angular.y </span><span style="color:#F47067;">=</span><span style="color:#ADBAC7;"> </span><span style="color:#6CB6FF;">0</span><span style="color:#ADBAC7;">; twist.angular.z </span><span style="color:#F47067;">=</span><span style="color:#ADBAC7;"> control_turn</span></span>
<span class="line"><span style="color:#ADBAC7;">            </span><span style="color:#F47067;">else</span><span style="color:#ADBAC7;">:</span></span>
<span class="line"><span style="color:#ADBAC7;">                twist.linear.x  </span><span style="color:#F47067;">=</span><span style="color:#ADBAC7;"> control_speed; twist.linear.y </span><span style="color:#F47067;">=</span><span style="color:#ADBAC7;"> control_HorizonMove; twist.linear.z </span><span style="color:#F47067;">=</span><span style="color:#ADBAC7;"> </span><span style="color:#6CB6FF;">0</span></span>
<span class="line"><span style="color:#ADBAC7;">                twist.angular.x </span><span style="color:#F47067;">=</span><span style="color:#ADBAC7;"> </span><span style="color:#6CB6FF;">0</span><span style="color:#ADBAC7;">;             twist.angular.y </span><span style="color:#F47067;">=</span><span style="color:#ADBAC7;"> </span><span style="color:#6CB6FF;">0</span><span style="color:#ADBAC7;">;                  twist.angular.z </span><span style="color:#F47067;">=</span><span style="color:#ADBAC7;"> </span><span style="color:#6CB6FF;">0</span></span>
<span class="line"></span>
<span class="line"><span style="color:#ADBAC7;">            pub.publish(twist) </span><span style="color:#768390;">#ROS发布速度话题</span></span>
<span class="line"></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#768390;">#运行出现问题则程序终止并打印相关错误信息</span></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#F47067;">except</span><span style="color:#ADBAC7;"> </span><span style="color:#6CB6FF;">Exception</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">as</span><span style="color:#ADBAC7;"> e:</span></span>
<span class="line"><span style="color:#ADBAC7;">        </span><span style="color:#6CB6FF;">print</span><span style="color:#ADBAC7;">(e)</span></span>
<span class="line"></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#768390;">#程序结束前发布速度为0的速度话题</span></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#F47067;">finally</span><span style="color:#ADBAC7;">:</span></span>
<span class="line"><span style="color:#ADBAC7;">        twist </span><span style="color:#F47067;">=</span><span style="color:#ADBAC7;"> Twist()</span></span>
<span class="line"><span style="color:#ADBAC7;">        twist.linear.x </span><span style="color:#F47067;">=</span><span style="color:#ADBAC7;"> </span><span style="color:#6CB6FF;">0</span><span style="color:#ADBAC7;">;  twist.linear.y </span><span style="color:#F47067;">=</span><span style="color:#ADBAC7;"> </span><span style="color:#6CB6FF;">0</span><span style="color:#ADBAC7;">;  twist.linear.z </span><span style="color:#F47067;">=</span><span style="color:#ADBAC7;"> </span><span style="color:#6CB6FF;">0</span></span>
<span class="line"><span style="color:#ADBAC7;">        twist.angular.x </span><span style="color:#F47067;">=</span><span style="color:#ADBAC7;"> </span><span style="color:#6CB6FF;">0</span><span style="color:#ADBAC7;">; twist.angular.y </span><span style="color:#F47067;">=</span><span style="color:#ADBAC7;"> </span><span style="color:#6CB6FF;">0</span><span style="color:#ADBAC7;">; twist.angular.z </span><span style="color:#F47067;">=</span><span style="color:#ADBAC7;"> </span><span style="color:#6CB6FF;">0</span></span>
<span class="line"><span style="color:#ADBAC7;">        pub.publish(twist)</span></span>
<span class="line"></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#768390;">#程序结束前设置终端相关属性</span></span>
<span class="line"><span style="color:#ADBAC7;">    termios.tcsetattr(sys.stdin, termios.</span><span style="color:#6CB6FF;">TCSADRAIN</span><span style="color:#ADBAC7;">, settings)</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#D73A49;">import</span><span style="color:#24292E;"> rospy</span></span>
<span class="line"></span>
<span class="line"><span style="color:#D73A49;">from</span><span style="color:#24292E;"> geometry_msgs.msg </span><span style="color:#D73A49;">import</span><span style="color:#24292E;"> Twist</span></span>
<span class="line"></span>
<span class="line"><span style="color:#D73A49;">import</span><span style="color:#24292E;"> sys, select, termios, tty</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">msg </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> </span><span style="color:#032F62;">&quot;&quot;&quot;</span></span>
<span class="line"><span style="color:#032F62;">Control Your Turtlebot!</span></span>
<span class="line"><span style="color:#032F62;">---------------------------</span></span>
<span class="line"><span style="color:#032F62;">Moving around:</span></span>
<span class="line"><span style="color:#032F62;">   u    i    o</span></span>
<span class="line"><span style="color:#032F62;">   j    k    l</span></span>
<span class="line"><span style="color:#032F62;">   m    ,    .</span></span>
<span class="line"></span>
<span class="line"><span style="color:#032F62;">q/z : increase/decrease max speeds by 10%</span></span>
<span class="line"><span style="color:#032F62;">w/x : increase/decrease only linear speed by 10%</span></span>
<span class="line"><span style="color:#032F62;">e/c : increase/decrease only angular speed by 10%</span></span>
<span class="line"><span style="color:#032F62;">space key, k : force stop</span></span>
<span class="line"><span style="color:#032F62;">anything else : stop smoothly</span></span>
<span class="line"><span style="color:#032F62;">b : switch to OmniMode/CommonMode</span></span>
<span class="line"><span style="color:#032F62;">CTRL-C to quit</span></span>
<span class="line"><span style="color:#032F62;">&quot;&quot;&quot;</span></span>
<span class="line"><span style="color:#24292E;">Omni </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">0</span><span style="color:#24292E;"> </span><span style="color:#6A737D;">#全向移动模式</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D;">#键值对应移动/转向方向</span></span>
<span class="line"><span style="color:#24292E;">moveBindings </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> {</span></span>
<span class="line"><span style="color:#24292E;">        </span><span style="color:#032F62;">&#39;i&#39;</span><span style="color:#24292E;">:( </span><span style="color:#005CC5;">1</span><span style="color:#24292E;">, </span><span style="color:#005CC5;">0</span><span style="color:#24292E;">),</span></span>
<span class="line"><span style="color:#24292E;">        </span><span style="color:#032F62;">&#39;o&#39;</span><span style="color:#24292E;">:( </span><span style="color:#005CC5;">1</span><span style="color:#24292E;">,</span><span style="color:#D73A49;">-</span><span style="color:#005CC5;">1</span><span style="color:#24292E;">),</span></span>
<span class="line"><span style="color:#24292E;">        </span><span style="color:#032F62;">&#39;j&#39;</span><span style="color:#24292E;">:( </span><span style="color:#005CC5;">0</span><span style="color:#24292E;">, </span><span style="color:#005CC5;">1</span><span style="color:#24292E;">),</span></span>
<span class="line"><span style="color:#24292E;">        </span><span style="color:#032F62;">&#39;l&#39;</span><span style="color:#24292E;">:( </span><span style="color:#005CC5;">0</span><span style="color:#24292E;">,</span><span style="color:#D73A49;">-</span><span style="color:#005CC5;">1</span><span style="color:#24292E;">),</span></span>
<span class="line"><span style="color:#24292E;">        </span><span style="color:#032F62;">&#39;u&#39;</span><span style="color:#24292E;">:( </span><span style="color:#005CC5;">1</span><span style="color:#24292E;">, </span><span style="color:#005CC5;">1</span><span style="color:#24292E;">),</span></span>
<span class="line"><span style="color:#24292E;">        </span><span style="color:#032F62;">&#39;,&#39;</span><span style="color:#24292E;">:(</span><span style="color:#D73A49;">-</span><span style="color:#005CC5;">1</span><span style="color:#24292E;">, </span><span style="color:#005CC5;">0</span><span style="color:#24292E;">),</span></span>
<span class="line"><span style="color:#24292E;">        </span><span style="color:#032F62;">&#39;.&#39;</span><span style="color:#24292E;">:(</span><span style="color:#D73A49;">-</span><span style="color:#005CC5;">1</span><span style="color:#24292E;">, </span><span style="color:#005CC5;">1</span><span style="color:#24292E;">),</span></span>
<span class="line"><span style="color:#24292E;">        </span><span style="color:#032F62;">&#39;m&#39;</span><span style="color:#24292E;">:(</span><span style="color:#D73A49;">-</span><span style="color:#005CC5;">1</span><span style="color:#24292E;">,</span><span style="color:#D73A49;">-</span><span style="color:#005CC5;">1</span><span style="color:#24292E;">),</span></span>
<span class="line"><span style="color:#24292E;">           }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D;">#键值对应速度增量</span></span>
<span class="line"><span style="color:#24292E;">speedBindings</span><span style="color:#D73A49;">=</span><span style="color:#24292E;">{</span></span>
<span class="line"><span style="color:#24292E;">        </span><span style="color:#032F62;">&#39;q&#39;</span><span style="color:#24292E;">:(</span><span style="color:#005CC5;">1.1</span><span style="color:#24292E;">,</span><span style="color:#005CC5;">1.1</span><span style="color:#24292E;">),</span></span>
<span class="line"><span style="color:#24292E;">        </span><span style="color:#032F62;">&#39;z&#39;</span><span style="color:#24292E;">:(</span><span style="color:#005CC5;">0.9</span><span style="color:#24292E;">,</span><span style="color:#005CC5;">0.9</span><span style="color:#24292E;">),</span></span>
<span class="line"><span style="color:#24292E;">        </span><span style="color:#032F62;">&#39;w&#39;</span><span style="color:#24292E;">:(</span><span style="color:#005CC5;">1.1</span><span style="color:#24292E;">,</span><span style="color:#005CC5;">1</span><span style="color:#24292E;">),</span></span>
<span class="line"><span style="color:#24292E;">        </span><span style="color:#032F62;">&#39;x&#39;</span><span style="color:#24292E;">:(</span><span style="color:#005CC5;">0.9</span><span style="color:#24292E;">,</span><span style="color:#005CC5;">1</span><span style="color:#24292E;">),</span></span>
<span class="line"><span style="color:#24292E;">        </span><span style="color:#032F62;">&#39;e&#39;</span><span style="color:#24292E;">:(</span><span style="color:#005CC5;">1</span><span style="color:#24292E;">,  </span><span style="color:#005CC5;">1.1</span><span style="color:#24292E;">),</span></span>
<span class="line"><span style="color:#24292E;">        </span><span style="color:#032F62;">&#39;c&#39;</span><span style="color:#24292E;">:(</span><span style="color:#005CC5;">1</span><span style="color:#24292E;">,  </span><span style="color:#005CC5;">0.9</span><span style="color:#24292E;">),</span></span>
<span class="line"><span style="color:#24292E;">          }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D;">#获取键值函数</span></span>
<span class="line"><span style="color:#D73A49;">def</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">getKey</span><span style="color:#24292E;">():</span></span>
<span class="line"><span style="color:#24292E;">    tty.setraw(sys.stdin.fileno())</span></span>
<span class="line"><span style="color:#24292E;">    rlist, _, _ </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> select.select([sys.stdin], [], [], </span><span style="color:#005CC5;">0.1</span><span style="color:#24292E;">)</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#D73A49;">if</span><span style="color:#24292E;"> rlist:</span></span>
<span class="line"><span style="color:#24292E;">        key </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> sys.stdin.read(</span><span style="color:#005CC5;">1</span><span style="color:#24292E;">)</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#D73A49;">else</span><span style="color:#24292E;">:</span></span>
<span class="line"><span style="color:#24292E;">        key </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> </span><span style="color:#032F62;">&#39;&#39;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">    termios.tcsetattr(sys.stdin, termios.</span><span style="color:#005CC5;">TCSADRAIN</span><span style="color:#24292E;">, settings)</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#D73A49;">return</span><span style="color:#24292E;"> key</span></span>
<span class="line"></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">speed </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">0.2</span><span style="color:#24292E;"> </span><span style="color:#6A737D;">#默认移动速度 m/s</span></span>
<span class="line"><span style="color:#24292E;">turn  </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">0.5</span><span style="color:#24292E;">   </span><span style="color:#6A737D;">#默认转向速度 rad/s</span></span>
<span class="line"><span style="color:#6A737D;">#以字符串格式返回当前速度</span></span>
<span class="line"><span style="color:#D73A49;">def</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">vels</span><span style="color:#24292E;">(speed,turn):</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#D73A49;">return</span><span style="color:#24292E;"> </span><span style="color:#032F62;">&quot;currently:</span><span style="color:#005CC5;">\\t</span><span style="color:#032F62;">speed </span><span style="color:#005CC5;">%s\\t</span><span style="color:#032F62;">turn </span><span style="color:#005CC5;">%s</span><span style="color:#032F62;"> &quot;</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">%</span><span style="color:#24292E;"> (speed,turn)</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D;">#主函数</span></span>
<span class="line"><span style="color:#D73A49;">if</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">__name__</span><span style="color:#D73A49;">==</span><span style="color:#032F62;">&quot;__main__&quot;</span><span style="color:#24292E;">:</span></span>
<span class="line"><span style="color:#24292E;">    settings </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> termios.tcgetattr(sys.stdin) </span><span style="color:#6A737D;">#获取键值初始化，读取终端相关属性</span></span>
<span class="line"><span style="color:#24292E;">    </span></span>
<span class="line"><span style="color:#24292E;">    rospy.init_node(</span><span style="color:#032F62;">&#39;turtlebot_teleop&#39;</span><span style="color:#24292E;">) </span><span style="color:#6A737D;">#创建ROS节点</span></span>
<span class="line"><span style="color:#24292E;">    pub </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> rospy.Publisher(</span><span style="color:#032F62;">&#39;~cmd_vel&#39;</span><span style="color:#24292E;">, Twist, </span><span style="color:#E36209;">queue_size</span><span style="color:#D73A49;">=</span><span style="color:#005CC5;">5</span><span style="color:#24292E;">) </span><span style="color:#6A737D;">#创建速度话题发布者，&#39;~cmd_vel&#39;=&#39;节点名/cmd_vel&#39;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">    x      </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">0</span><span style="color:#24292E;">   </span><span style="color:#6A737D;">#前进后退方向</span></span>
<span class="line"><span style="color:#24292E;">    th     </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">0</span><span style="color:#24292E;">   </span><span style="color:#6A737D;">#转向/横向移动方向</span></span>
<span class="line"><span style="color:#24292E;">    count  </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">0</span><span style="color:#24292E;">   </span><span style="color:#6A737D;">#键值不再范围计数</span></span>
<span class="line"><span style="color:#24292E;">    target_speed </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">0</span><span style="color:#24292E;"> </span><span style="color:#6A737D;">#前进后退目标速度</span></span>
<span class="line"><span style="color:#24292E;">    target_turn  </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">0</span><span style="color:#24292E;"> </span><span style="color:#6A737D;">#转向目标速度</span></span>
<span class="line"><span style="color:#24292E;">    target_HorizonMove </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">0</span><span style="color:#24292E;"> </span><span style="color:#6A737D;">#横向移动目标速度</span></span>
<span class="line"><span style="color:#24292E;">    control_speed </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">0</span><span style="color:#24292E;"> </span><span style="color:#6A737D;">#前进后退实际控制速度</span></span>
<span class="line"><span style="color:#24292E;">    control_turn  </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">0</span><span style="color:#24292E;"> </span><span style="color:#6A737D;">#转向实际控制速度</span></span>
<span class="line"><span style="color:#24292E;">    control_HorizonMove </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">0</span><span style="color:#24292E;"> </span><span style="color:#6A737D;">#横向移动实际控制速度</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#D73A49;">try</span><span style="color:#24292E;">:</span></span>
<span class="line"><span style="color:#24292E;">        </span><span style="color:#005CC5;">print</span><span style="color:#24292E;">(msg) </span><span style="color:#6A737D;">#打印控制说明</span></span>
<span class="line"><span style="color:#24292E;">        </span><span style="color:#005CC5;">print</span><span style="color:#24292E;">(vels(speed,turn)) </span><span style="color:#6A737D;">#打印当前速度</span></span>
<span class="line"><span style="color:#24292E;">        </span><span style="color:#D73A49;">while</span><span style="color:#24292E;">(</span><span style="color:#005CC5;">1</span><span style="color:#24292E;">):</span></span>
<span class="line"><span style="color:#24292E;">            key </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> getKey() </span><span style="color:#6A737D;">#获取键值</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">            </span><span style="color:#6A737D;">#切换是否为全向移动模式，全向轮/麦轮小车可以加入全向移动模式</span></span>
<span class="line"><span style="color:#24292E;">            </span><span style="color:#D73A49;">if</span><span style="color:#24292E;"> key</span><span style="color:#D73A49;">==</span><span style="color:#032F62;">&#39;b&#39;</span><span style="color:#24292E;">:               </span></span>
<span class="line"><span style="color:#24292E;">                Omni</span><span style="color:#D73A49;">=~</span><span style="color:#24292E;">Omni</span></span>
<span class="line"><span style="color:#24292E;">                </span><span style="color:#D73A49;">if</span><span style="color:#24292E;"> Omni: </span></span>
<span class="line"><span style="color:#24292E;">                    </span><span style="color:#005CC5;">print</span><span style="color:#24292E;">(</span><span style="color:#032F62;">&quot;Switch to OmniMode&quot;</span><span style="color:#24292E;">)</span></span>
<span class="line"><span style="color:#24292E;">                    moveBindings[</span><span style="color:#032F62;">&#39;.&#39;</span><span style="color:#24292E;">]</span><span style="color:#D73A49;">=</span><span style="color:#24292E;">[</span><span style="color:#D73A49;">-</span><span style="color:#005CC5;">1</span><span style="color:#24292E;">,</span><span style="color:#D73A49;">-</span><span style="color:#005CC5;">1</span><span style="color:#24292E;">]</span></span>
<span class="line"><span style="color:#24292E;">                    moveBindings[</span><span style="color:#032F62;">&#39;m&#39;</span><span style="color:#24292E;">]</span><span style="color:#D73A49;">=</span><span style="color:#24292E;">[</span><span style="color:#D73A49;">-</span><span style="color:#005CC5;">1</span><span style="color:#24292E;">, </span><span style="color:#005CC5;">1</span><span style="color:#24292E;">]</span></span>
<span class="line"><span style="color:#24292E;">                </span><span style="color:#D73A49;">else</span><span style="color:#24292E;">:</span></span>
<span class="line"><span style="color:#24292E;">                    </span><span style="color:#005CC5;">print</span><span style="color:#24292E;">(</span><span style="color:#032F62;">&quot;Switch to CommonMode&quot;</span><span style="color:#24292E;">)</span></span>
<span class="line"><span style="color:#24292E;">                    moveBindings[</span><span style="color:#032F62;">&#39;.&#39;</span><span style="color:#24292E;">]</span><span style="color:#D73A49;">=</span><span style="color:#24292E;">[</span><span style="color:#D73A49;">-</span><span style="color:#005CC5;">1</span><span style="color:#24292E;">, </span><span style="color:#005CC5;">1</span><span style="color:#24292E;">]</span></span>
<span class="line"><span style="color:#24292E;">                    moveBindings[</span><span style="color:#032F62;">&#39;m&#39;</span><span style="color:#24292E;">]</span><span style="color:#D73A49;">=</span><span style="color:#24292E;">[</span><span style="color:#D73A49;">-</span><span style="color:#005CC5;">1</span><span style="color:#24292E;">,</span><span style="color:#D73A49;">-</span><span style="color:#005CC5;">1</span><span style="color:#24292E;">]</span></span>
<span class="line"><span style="color:#24292E;">            </span></span>
<span class="line"><span style="color:#24292E;">            </span><span style="color:#6A737D;">#判断键值是否在移动/转向方向键值内</span></span>
<span class="line"><span style="color:#24292E;">            </span><span style="color:#D73A49;">if</span><span style="color:#24292E;"> key </span><span style="color:#D73A49;">in</span><span style="color:#24292E;"> moveBindings.keys():</span></span>
<span class="line"><span style="color:#24292E;">                x  </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> moveBindings[key][</span><span style="color:#005CC5;">0</span><span style="color:#24292E;">]</span></span>
<span class="line"><span style="color:#24292E;">                th </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> moveBindings[key][</span><span style="color:#005CC5;">1</span><span style="color:#24292E;">]</span></span>
<span class="line"><span style="color:#24292E;">                count </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">0</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">            </span><span style="color:#6A737D;">#判断键值是否在速度增量键值内</span></span>
<span class="line"><span style="color:#24292E;">            </span><span style="color:#D73A49;">elif</span><span style="color:#24292E;"> key </span><span style="color:#D73A49;">in</span><span style="color:#24292E;"> speedBindings.keys():</span></span>
<span class="line"><span style="color:#24292E;">                speed </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> speed </span><span style="color:#D73A49;">*</span><span style="color:#24292E;"> speedBindings[key][</span><span style="color:#005CC5;">0</span><span style="color:#24292E;">]</span></span>
<span class="line"><span style="color:#24292E;">                turn  </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> turn  </span><span style="color:#D73A49;">*</span><span style="color:#24292E;"> speedBindings[key][</span><span style="color:#005CC5;">1</span><span style="color:#24292E;">]</span></span>
<span class="line"><span style="color:#24292E;">                count </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">0</span></span>
<span class="line"><span style="color:#24292E;">                </span><span style="color:#005CC5;">print</span><span style="color:#24292E;">(vels(speed,turn)) </span><span style="color:#6A737D;">#速度发生变化，打印出来</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">            </span><span style="color:#6A737D;">#空键值/&#39;k&#39;,相关变量置0</span></span>
<span class="line"><span style="color:#24292E;">            </span><span style="color:#D73A49;">elif</span><span style="color:#24292E;"> key </span><span style="color:#D73A49;">==</span><span style="color:#24292E;"> </span><span style="color:#032F62;">&#39; &#39;</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">or</span><span style="color:#24292E;"> key </span><span style="color:#D73A49;">==</span><span style="color:#24292E;"> </span><span style="color:#032F62;">&#39;k&#39;</span><span style="color:#24292E;"> :</span></span>
<span class="line"><span style="color:#24292E;">                x  </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">0</span></span>
<span class="line"><span style="color:#24292E;">                th </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">0</span></span>
<span class="line"><span style="color:#24292E;">                control_speed </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">0</span></span>
<span class="line"><span style="color:#24292E;">                control_turn  </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">0</span></span>
<span class="line"><span style="color:#24292E;">                HorizonMove   </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">0</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">            </span><span style="color:#6A737D;">#长期识别到不明键值，相关变量置0</span></span>
<span class="line"><span style="color:#24292E;">            </span><span style="color:#D73A49;">else</span><span style="color:#24292E;">:</span></span>
<span class="line"><span style="color:#24292E;">                count </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> count </span><span style="color:#D73A49;">+</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">1</span></span>
<span class="line"><span style="color:#24292E;">                </span><span style="color:#D73A49;">if</span><span style="color:#24292E;"> count </span><span style="color:#D73A49;">&gt;</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">4</span><span style="color:#24292E;">:</span></span>
<span class="line"><span style="color:#24292E;">                    x  </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">0</span></span>
<span class="line"><span style="color:#24292E;">                    th </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">0</span></span>
<span class="line"><span style="color:#24292E;">                </span><span style="color:#D73A49;">if</span><span style="color:#24292E;"> (key </span><span style="color:#D73A49;">==</span><span style="color:#24292E;"> </span><span style="color:#032F62;">&#39;</span><span style="color:#005CC5;">\\x03</span><span style="color:#032F62;">&#39;</span><span style="color:#24292E;">):</span></span>
<span class="line"><span style="color:#24292E;">                    </span><span style="color:#D73A49;">break</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">            </span><span style="color:#6A737D;">#根据速度与方向计算目标速度</span></span>
<span class="line"><span style="color:#24292E;">            target_speed </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> speed </span><span style="color:#D73A49;">*</span><span style="color:#24292E;"> x</span></span>
<span class="line"><span style="color:#24292E;">            target_turn  </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> turn </span><span style="color:#D73A49;">*</span><span style="color:#24292E;"> th</span></span>
<span class="line"><span style="color:#24292E;">            target_HorizonMove </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> speed</span><span style="color:#D73A49;">*</span><span style="color:#24292E;">th</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">            </span><span style="color:#6A737D;">#平滑控制，计算前进后退实际控制速度</span></span>
<span class="line"><span style="color:#24292E;">            </span><span style="color:#D73A49;">if</span><span style="color:#24292E;"> target_speed </span><span style="color:#D73A49;">&gt;</span><span style="color:#24292E;"> control_speed:</span></span>
<span class="line"><span style="color:#24292E;">                control_speed </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">min</span><span style="color:#24292E;">( target_speed, control_speed </span><span style="color:#D73A49;">+</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">0.1</span><span style="color:#24292E;"> )</span></span>
<span class="line"><span style="color:#24292E;">            </span><span style="color:#D73A49;">elif</span><span style="color:#24292E;"> target_speed </span><span style="color:#D73A49;">&lt;</span><span style="color:#24292E;"> control_speed:</span></span>
<span class="line"><span style="color:#24292E;">                control_speed </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">max</span><span style="color:#24292E;">( target_speed, control_speed </span><span style="color:#D73A49;">-</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">0.1</span><span style="color:#24292E;"> )</span></span>
<span class="line"><span style="color:#24292E;">            </span><span style="color:#D73A49;">else</span><span style="color:#24292E;">:</span></span>
<span class="line"><span style="color:#24292E;">                control_speed </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> target_speed</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">            </span><span style="color:#6A737D;">#平滑控制，计算转向实际控制速度</span></span>
<span class="line"><span style="color:#24292E;">            </span><span style="color:#D73A49;">if</span><span style="color:#24292E;"> target_turn </span><span style="color:#D73A49;">&gt;</span><span style="color:#24292E;"> control_turn:</span></span>
<span class="line"><span style="color:#24292E;">                control_turn </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">min</span><span style="color:#24292E;">( target_turn, control_turn </span><span style="color:#D73A49;">+</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">0.5</span><span style="color:#24292E;"> )</span></span>
<span class="line"><span style="color:#24292E;">            </span><span style="color:#D73A49;">elif</span><span style="color:#24292E;"> target_turn </span><span style="color:#D73A49;">&lt;</span><span style="color:#24292E;"> control_turn:</span></span>
<span class="line"><span style="color:#24292E;">                control_turn </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">max</span><span style="color:#24292E;">( target_turn, control_turn </span><span style="color:#D73A49;">-</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">0.5</span><span style="color:#24292E;"> )</span></span>
<span class="line"><span style="color:#24292E;">            </span><span style="color:#D73A49;">else</span><span style="color:#24292E;">:</span></span>
<span class="line"><span style="color:#24292E;">                control_turn </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> target_turn</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">            </span><span style="color:#6A737D;">#平滑控制，计算横向移动实际控制速度</span></span>
<span class="line"><span style="color:#24292E;">            </span><span style="color:#D73A49;">if</span><span style="color:#24292E;"> target_HorizonMove </span><span style="color:#D73A49;">&gt;</span><span style="color:#24292E;"> control_HorizonMove:</span></span>
<span class="line"><span style="color:#24292E;">                control_HorizonMove </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">min</span><span style="color:#24292E;">( target_HorizonMove, control_HorizonMove </span><span style="color:#D73A49;">+</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">0.1</span><span style="color:#24292E;"> )</span></span>
<span class="line"><span style="color:#24292E;">            </span><span style="color:#D73A49;">elif</span><span style="color:#24292E;"> target_HorizonMove </span><span style="color:#D73A49;">&lt;</span><span style="color:#24292E;"> control_HorizonMove:</span></span>
<span class="line"><span style="color:#24292E;">                control_HorizonMove </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">max</span><span style="color:#24292E;">( target_HorizonMove, control_HorizonMove </span><span style="color:#D73A49;">-</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">0.1</span><span style="color:#24292E;"> )</span></span>
<span class="line"><span style="color:#24292E;">            </span><span style="color:#D73A49;">else</span><span style="color:#24292E;">:</span></span>
<span class="line"><span style="color:#24292E;">                control_HorizonMove </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> target_HorizonMove</span></span>
<span class="line"><span style="color:#24292E;">         </span></span>
<span class="line"><span style="color:#24292E;">            twist </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> Twist() </span><span style="color:#6A737D;">#创建ROS速度话题变量</span></span>
<span class="line"><span style="color:#24292E;">            </span><span style="color:#6A737D;">#根据是否全向移动模式，给速度话题变量赋值</span></span>
<span class="line"><span style="color:#24292E;">            </span><span style="color:#D73A49;">if</span><span style="color:#24292E;"> Omni</span><span style="color:#D73A49;">==</span><span style="color:#005CC5;">0</span><span style="color:#24292E;">:</span></span>
<span class="line"><span style="color:#24292E;">                twist.linear.x  </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> control_speed; twist.linear.y </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">0</span><span style="color:#24292E;">;  twist.linear.z </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">0</span></span>
<span class="line"><span style="color:#24292E;">                twist.angular.x </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">0</span><span style="color:#24292E;">;             twist.angular.y </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">0</span><span style="color:#24292E;">; twist.angular.z </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> control_turn</span></span>
<span class="line"><span style="color:#24292E;">            </span><span style="color:#D73A49;">else</span><span style="color:#24292E;">:</span></span>
<span class="line"><span style="color:#24292E;">                twist.linear.x  </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> control_speed; twist.linear.y </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> control_HorizonMove; twist.linear.z </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">0</span></span>
<span class="line"><span style="color:#24292E;">                twist.angular.x </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">0</span><span style="color:#24292E;">;             twist.angular.y </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">0</span><span style="color:#24292E;">;                  twist.angular.z </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">0</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">            pub.publish(twist) </span><span style="color:#6A737D;">#ROS发布速度话题</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#6A737D;">#运行出现问题则程序终止并打印相关错误信息</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#D73A49;">except</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">Exception</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">as</span><span style="color:#24292E;"> e:</span></span>
<span class="line"><span style="color:#24292E;">        </span><span style="color:#005CC5;">print</span><span style="color:#24292E;">(e)</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#6A737D;">#程序结束前发布速度为0的速度话题</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#D73A49;">finally</span><span style="color:#24292E;">:</span></span>
<span class="line"><span style="color:#24292E;">        twist </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> Twist()</span></span>
<span class="line"><span style="color:#24292E;">        twist.linear.x </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">0</span><span style="color:#24292E;">;  twist.linear.y </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">0</span><span style="color:#24292E;">;  twist.linear.z </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">0</span></span>
<span class="line"><span style="color:#24292E;">        twist.angular.x </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">0</span><span style="color:#24292E;">; twist.angular.y </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">0</span><span style="color:#24292E;">; twist.angular.z </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">0</span></span>
<span class="line"><span style="color:#24292E;">        pub.publish(twist)</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#6A737D;">#程序结束前设置终端相关属性</span></span>
<span class="line"><span style="color:#24292E;">    termios.tcsetattr(sys.stdin, termios.</span><span style="color:#005CC5;">TCSADRAIN</span><span style="color:#24292E;">, settings)</span></span></code></pre></div><h2 id="_5-发布话题控制小车移动" tabindex="-1">5. 发布话题控制小车移动 <a class="header-anchor" href="#_5-发布话题控制小车移动" aria-label="Permalink to &quot;5. 发布话题控制小车移动&quot;">​</a></h2><p>启动初始化节点(wheeltec终端)：</p><div class="language-bash vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">bash</span><pre class="shiki github-dark-dimmed vp-code-dark"><code><span class="line"><span style="color:#F69D50;">roslaunch</span><span style="color:#ADBAC7;"> </span><span style="color:#96D0FF;">turn_on_wheeltec_robot</span><span style="color:#ADBAC7;"> </span><span style="color:#96D0FF;">turn_on_wheeltec_robot.launch</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#6F42C1;">roslaunch</span><span style="color:#24292E;"> </span><span style="color:#032F62;">turn_on_wheeltec_robot</span><span style="color:#24292E;"> </span><span style="color:#032F62;">turn_on_wheeltec_robot.launch</span></span></code></pre></div><p>发布节点(命令行)控制小车移动(wheeltec/passoni终端)：</p><div class="language-bash vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">bash</span><pre class="shiki github-dark-dimmed vp-code-dark"><code><span class="line"><span style="color:#F69D50;">rostopic</span><span style="color:#ADBAC7;"> </span><span style="color:#96D0FF;">pub</span><span style="color:#ADBAC7;"> </span><span style="color:#6CB6FF;">-r</span><span style="color:#ADBAC7;"> </span><span style="color:#96D0FF;">/cmd_vel</span><span style="color:#ADBAC7;"> </span><span style="color:#96D0FF;">geometry_msgs/Twist</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#6F42C1;">rostopic</span><span style="color:#24292E;"> </span><span style="color:#032F62;">pub</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">-r</span><span style="color:#24292E;"> </span><span style="color:#032F62;">/cmd_vel</span><span style="color:#24292E;"> </span><span style="color:#032F62;">geometry_msgs/Twist</span></span></code></pre></div><p>-r无法使用tab键自动补全命令，话题名称补全、数据格式补全、数据内容补全，都需要按一次tab键 删除了速度平滑功能，所以手动发布速度命令后，如果希望小车停止运动，需要再发送一次速度为0的速度命令</p><h2 id="_6-激光雷达建图" tabindex="-1">6. 激光雷达建图 <a class="header-anchor" href="#_6-激光雷达建图" aria-label="Permalink to &quot;6. 激光雷达建图&quot;">​</a></h2><p>启动激光建图</p><div class="language-bash vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">bash</span><pre class="shiki github-dark-dimmed vp-code-dark"><code><span class="line"><span style="color:#F69D50;">roslaunch</span><span style="color:#ADBAC7;"> </span><span style="color:#96D0FF;">turn_on_wheeltec_robot</span><span style="color:#ADBAC7;"> </span><span style="color:#96D0FF;">mapping.launch</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#6F42C1;">roslaunch</span><span style="color:#24292E;"> </span><span style="color:#032F62;">turn_on_wheeltec_robot</span><span style="color:#24292E;"> </span><span style="color:#032F62;">mapping.launch</span></span></code></pre></div><p>查看建图效果：rviz(passoni) 可以使用键盘控制、APP遥控、PS2遥控、航模遥控进行控制小车运动。</p><p>建图完成，保存地图 ①一键保存：</p><div class="language-bash vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">bash</span><pre class="shiki github-dark-dimmed vp-code-dark"><code><span class="line"><span style="color:#F69D50;">roslaunch</span><span style="color:#ADBAC7;"> </span><span style="color:#96D0FF;">turn_on_wheeltec_robot</span><span style="color:#ADBAC7;"> </span><span style="color:#96D0FF;">map_saver.launch</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#6F42C1;">roslaunch</span><span style="color:#24292E;"> </span><span style="color:#032F62;">turn_on_wheeltec_robot</span><span style="color:#24292E;"> </span><span style="color:#032F62;">map_saver.launch</span></span></code></pre></div><p>②打开地图路径：cd /home/wheeltec/wheeltec_robot/src/turn_on_wheeltec_robot/map</p><p>保存地图：rosrun map_server map_saver -f 地图名</p><div class="language-bash vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">bash</span><pre class="shiki github-dark-dimmed vp-code-dark"><code><span class="line"><span style="color:#F69D50;">rosrun</span><span style="color:#ADBAC7;"> </span><span style="color:#96D0FF;">map_server</span><span style="color:#ADBAC7;"> </span><span style="color:#96D0FF;">map_saver</span><span style="color:#ADBAC7;"> </span><span style="color:#6CB6FF;">-f</span><span style="color:#ADBAC7;"> </span><span style="color:#96D0FF;">地图名</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#6F42C1;">rosrun</span><span style="color:#24292E;"> </span><span style="color:#032F62;">map_server</span><span style="color:#24292E;"> </span><span style="color:#032F62;">map_saver</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">-f</span><span style="color:#24292E;"> </span><span style="color:#032F62;">地图名</span></span></code></pre></div><p>注：地图文件可以使用PhotoShop进行编辑</p><div class="language-txt vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">txt</span><pre class="shiki github-dark-dimmed vp-code-dark"><code><span class="line"><span style="color:#adbac7;">建图</span></span>
<span class="line"><span style="color:#adbac7;">mapping.launch</span></span>
<span class="line"><span style="color:#adbac7;"> 小车初始化节点：turn_on_wheeltec_robot.launch</span></span>
<span class="line"><span style="color:#adbac7;"> 雷达节点：rplidar.launch</span></span>
<span class="line"><span style="color:#adbac7;"> gmapping建图节点：algorithm_gmapping.launch</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#24292e;">建图</span></span>
<span class="line"><span style="color:#24292e;">mapping.launch</span></span>
<span class="line"><span style="color:#24292e;"> 小车初始化节点：turn_on_wheeltec_robot.launch</span></span>
<span class="line"><span style="color:#24292e;"> 雷达节点：rplidar.launch</span></span>
<span class="line"><span style="color:#24292e;"> gmapping建图节点：algorithm_gmapping.launch</span></span></code></pre></div>`,62);function m(s,F,v,g,B,E){const e=t,o=A("ClientOnly");return l(),r("div",null,[C,i(o,null,{default:y(()=>{var a,n;return[(((a=s.$frontmatter)==null?void 0:a.aside)??!0)&&(((n=s.$frontmatter)==null?void 0:n.showArticleMetadata)??!0)?(l(),u(e,{key:0,article:s.$frontmatter},null,8,["article"])):D("",!0)]}),_:1}),h])}const k=c(b,[["render",m]]);export{M as __pageData,k as default};
