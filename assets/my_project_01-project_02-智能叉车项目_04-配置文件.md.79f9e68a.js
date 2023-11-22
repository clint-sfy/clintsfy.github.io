import{_ as c}from"./chunks/ArticleMetadata.59a467b2.js";import{_ as t,v as l,b as r,t as i,O as y,F as p,L as d,R as u,M as _,C as A,B as b}from"./chunks/framework.5cbdba25.js";import"./chunks/md5.02486a14.js";const v=JSON.parse('{"title":"配置文件合集","description":"","frontmatter":{"title":"配置文件合集","author":"阿源","date":"2023/11/22 12:00","categories":["个人项目"],"tags":["个人项目","ROS"]},"headers":[],"relativePath":"my_project/01-project/02-智能叉车项目/04-配置文件.md","filePath":"my_project/01-project/02-智能叉车项目/04-配置文件.md","lastUpdated":1700640502000}'),C={name:"my_project/01-project/02-智能叉车项目/04-配置文件.md"},m=p("h1",{id:"配置文件合集",tabindex:"-1"},[d("配置文件合集 "),p("a",{class:"header-anchor",href:"#配置文件合集","aria-label":'Permalink to "配置文件合集"'},"​")],-1),D=u(`<h2 id="cartographer配置" tabindex="-1">cartographer配置 <a class="header-anchor" href="#cartographer配置" aria-label="Permalink to &quot;cartographer配置&quot;">​</a></h2><p>a) 在只使用激光雷达的时候(tracking_frame=&quot;laser,publish_frame=&quot;laser&quot;)</p><p>b) 使用里程计+激光雷达时(tracking_frame=&quot;base_link&quot;, publish_frame=&quot;odom&quot;)</p><p>c) 使用IMU+激光+里程计时(tracking_frame=&quot;imu_link&quot;, publish_frame=&quot;odom&quot;)</p><h3 id="_2d激光小车" tabindex="-1">2D激光小车 <a class="header-anchor" href="#_2d激光小车" aria-label="Permalink to &quot;2D激光小车&quot;">​</a></h3><div class="language-lua vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">lua</span><pre class="shiki github-dark-dimmed vp-code-dark"><code><span class="line"><span style="color:#6CB6FF;">include</span><span style="color:#ADBAC7;"> </span><span style="color:#96D0FF;">&quot;map_builder.lua&quot;</span></span>
<span class="line"><span style="color:#6CB6FF;">include</span><span style="color:#ADBAC7;"> </span><span style="color:#96D0FF;">&quot;trajectory_builder.lua&quot;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#ADBAC7;">options </span><span style="color:#F47067;">=</span><span style="color:#ADBAC7;"> {</span></span>
<span class="line"><span style="color:#ADBAC7;">  map_builder </span><span style="color:#F47067;">=</span><span style="color:#ADBAC7;"> MAP_BUILDER,                </span><span style="color:#768390;">-- map_builder.lua的配置信息</span></span>
<span class="line"><span style="color:#ADBAC7;">  trajectory_builder </span><span style="color:#F47067;">=</span><span style="color:#ADBAC7;"> TRAJECTORY_BUILDER,  </span><span style="color:#768390;">-- trajectory_builder.lua的配置信息</span></span>
<span class="line"><span style="color:#ADBAC7;">  </span></span>
<span class="line"><span style="color:#ADBAC7;">  map_frame </span><span style="color:#F47067;">=</span><span style="color:#ADBAC7;"> </span><span style="color:#96D0FF;">&quot;map&quot;</span><span style="color:#ADBAC7;">,                        </span><span style="color:#768390;">-- 地图坐标系的名字</span></span>
<span class="line"><span style="color:#ADBAC7;">  </span><span style="color:#768390;">--tracking_frame 有 imu 的 link 就设置成 imu 的 link, 没有就设置成 base_link</span></span>
<span class="line"><span style="color:#ADBAC7;">  tracking_frame </span><span style="color:#F47067;">=</span><span style="color:#ADBAC7;"> </span><span style="color:#96D0FF;">&quot;base_footprint&quot;</span><span style="color:#ADBAC7;">,        </span><span style="color:#768390;">-- 将所有传感器数据转换到这个坐标系下</span></span>
<span class="line"><span style="color:#ADBAC7;">  </span><span style="color:#768390;">-- 发布的 tf 的最下边一个坐标系, 就是 bag 文件中 tf树的最上边的一个坐标系</span></span>
<span class="line"><span style="color:#ADBAC7;">  published_frame </span><span style="color:#F47067;">=</span><span style="color:#ADBAC7;"> </span><span style="color:#96D0FF;">&quot;base_footprint&quot;</span><span style="color:#ADBAC7;">,       </span><span style="color:#768390;">-- tf: map -&gt; footprint</span></span>
<span class="line"><span style="color:#ADBAC7;">  odom_frame </span><span style="color:#F47067;">=</span><span style="color:#ADBAC7;"> </span><span style="color:#96D0FF;">&quot;odom_combined&quot;</span><span style="color:#ADBAC7;">,             </span><span style="color:#768390;">-- 里程计的坐标系名字</span></span>
<span class="line"><span style="color:#ADBAC7;">  provide_odom_frame </span><span style="color:#F47067;">=</span><span style="color:#ADBAC7;"> </span><span style="color:#6CB6FF;">true</span><span style="color:#ADBAC7;">,                </span><span style="color:#768390;">-- 是否提供odom的tf, 如果为true,则tf树为map-&gt;odom-&gt;footprint</span></span>
<span class="line"><span style="color:#ADBAC7;">                                            </span><span style="color:#768390;">-- 如果为false tf树为map-&gt;footprint</span></span>
<span class="line"><span style="color:#ADBAC7;">  publish_frame_projected_to_2d </span><span style="color:#F47067;">=</span><span style="color:#ADBAC7;"> </span><span style="color:#6CB6FF;">false</span><span style="color:#ADBAC7;">,    </span><span style="color:#768390;">-- 是否将坐标系投影到平面上</span></span>
<span class="line"><span style="color:#ADBAC7;">  </span><span style="color:#768390;">--use_pose_extrapolator = false,            -- 发布tf时是使用pose_extrapolator的位姿还是前端计算出来的位姿</span></span>
<span class="line"></span>
<span class="line"><span style="color:#ADBAC7;">  use_odometry </span><span style="color:#F47067;">=</span><span style="color:#ADBAC7;"> </span><span style="color:#6CB6FF;">true</span><span style="color:#ADBAC7;">,                     </span><span style="color:#768390;">-- 是否使用里程计,如果使用要求一定要有odom的tf</span></span>
<span class="line"><span style="color:#ADBAC7;">  use_nav_sat </span><span style="color:#F47067;">=</span><span style="color:#ADBAC7;"> </span><span style="color:#6CB6FF;">false</span><span style="color:#ADBAC7;">,                      </span><span style="color:#768390;">-- 是否使用gps</span></span>
<span class="line"><span style="color:#ADBAC7;">  use_landmarks </span><span style="color:#F47067;">=</span><span style="color:#ADBAC7;"> </span><span style="color:#6CB6FF;">false</span><span style="color:#ADBAC7;">,                    </span><span style="color:#768390;">-- 是否使用landmark</span></span>
<span class="line"><span style="color:#ADBAC7;">  num_laser_scans </span><span style="color:#F47067;">=</span><span style="color:#ADBAC7;"> </span><span style="color:#6CB6FF;">1</span><span style="color:#ADBAC7;">,                      </span><span style="color:#768390;">-- 是否使用单线激光数据</span></span>
<span class="line"><span style="color:#ADBAC7;">  num_multi_echo_laser_scans </span><span style="color:#F47067;">=</span><span style="color:#ADBAC7;"> </span><span style="color:#6CB6FF;">0</span><span style="color:#ADBAC7;">,           </span><span style="color:#768390;">-- 是否使用multi_echo_laser_scans数据</span></span>
<span class="line"><span style="color:#ADBAC7;">  num_subdivisions_per_laser_scan </span><span style="color:#F47067;">=</span><span style="color:#ADBAC7;"> </span><span style="color:#6CB6FF;">1</span><span style="color:#ADBAC7;">,      </span><span style="color:#768390;">-- 1帧数据被分成几次处理,一般为1</span></span>
<span class="line"><span style="color:#ADBAC7;">  num_point_clouds </span><span style="color:#F47067;">=</span><span style="color:#ADBAC7;"> </span><span style="color:#6CB6FF;">0</span><span style="color:#ADBAC7;">,                     </span><span style="color:#768390;">-- 是否使用点云数据</span></span>
<span class="line"><span style="color:#ADBAC7;">  </span></span>
<span class="line"><span style="color:#ADBAC7;">  lookup_transform_timeout_sec </span><span style="color:#F47067;">=</span><span style="color:#ADBAC7;"> </span><span style="color:#6CB6FF;">0.2</span><span style="color:#ADBAC7;">,       </span><span style="color:#768390;">-- 查找tf时的超时时间</span></span>
<span class="line"><span style="color:#ADBAC7;">  submap_publish_period_sec </span><span style="color:#F47067;">=</span><span style="color:#ADBAC7;"> </span><span style="color:#6CB6FF;">0.3</span><span style="color:#ADBAC7;">,          </span><span style="color:#768390;">-- 发布数据的时间间隔</span></span>
<span class="line"><span style="color:#ADBAC7;">  pose_publish_period_sec </span><span style="color:#F47067;">=</span><span style="color:#ADBAC7;"> </span><span style="color:#6CB6FF;">5e-3</span><span style="color:#ADBAC7;">,</span></span>
<span class="line"><span style="color:#ADBAC7;">  trajectory_publish_period_sec </span><span style="color:#F47067;">=</span><span style="color:#ADBAC7;"> </span><span style="color:#6CB6FF;">30e-3</span><span style="color:#ADBAC7;">,</span></span>
<span class="line"></span>
<span class="line"><span style="color:#ADBAC7;">  rangefinder_sampling_ratio </span><span style="color:#F47067;">=</span><span style="color:#ADBAC7;"> </span><span style="color:#6CB6FF;">1.</span><span style="color:#ADBAC7;">,          </span><span style="color:#768390;">-- 传感器数据的采样频率</span></span>
<span class="line"><span style="color:#ADBAC7;">  odometry_sampling_ratio </span><span style="color:#F47067;">=</span><span style="color:#ADBAC7;"> </span><span style="color:#6CB6FF;">1.</span><span style="color:#ADBAC7;">,</span></span>
<span class="line"><span style="color:#ADBAC7;">  fixed_frame_pose_sampling_ratio </span><span style="color:#F47067;">=</span><span style="color:#ADBAC7;"> </span><span style="color:#6CB6FF;">1.</span><span style="color:#ADBAC7;">,</span></span>
<span class="line"><span style="color:#ADBAC7;">  imu_sampling_ratio </span><span style="color:#F47067;">=</span><span style="color:#ADBAC7;"> </span><span style="color:#6CB6FF;">1.</span><span style="color:#ADBAC7;">,</span></span>
<span class="line"><span style="color:#ADBAC7;">  landmarks_sampling_ratio </span><span style="color:#F47067;">=</span><span style="color:#ADBAC7;"> </span><span style="color:#6CB6FF;">1.</span><span style="color:#ADBAC7;">,</span></span>
<span class="line"><span style="color:#ADBAC7;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#ADBAC7;">MAP_BUILDER.</span><span style="color:#6CB6FF;">use_trajectory_builder_2d</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">=</span><span style="color:#ADBAC7;"> </span><span style="color:#6CB6FF;">true</span><span style="color:#ADBAC7;">   </span></span>
<span class="line"></span>
<span class="line"><span style="color:#ADBAC7;">TRAJECTORY_BUILDER_2D.</span><span style="color:#6CB6FF;">use_imu_data</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">=</span><span style="color:#ADBAC7;"> </span><span style="color:#6CB6FF;">false</span><span style="color:#ADBAC7;">   </span><span style="color:#768390;">-- 设置IMU数据</span></span>
<span class="line"><span style="color:#ADBAC7;">TRAJECTORY_BUILDER_2D.</span><span style="color:#6CB6FF;">min_range</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">=</span><span style="color:#ADBAC7;"> </span><span style="color:#6CB6FF;">0.1</span><span style="color:#ADBAC7;">   </span><span style="color:#768390;">--雷达的最大最小距离，根据雷达硬件设定</span></span>
<span class="line"><span style="color:#ADBAC7;">TRAJECTORY_BUILDER_2D.</span><span style="color:#6CB6FF;">max_range</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">=</span><span style="color:#ADBAC7;"> </span><span style="color:#6CB6FF;">18.</span><span style="color:#ADBAC7;">  </span><span style="color:#768390;">--雷达的最大最小距离，根据雷达硬件设定</span></span>
<span class="line"><span style="color:#768390;">-- TRAJECTORY_BUILDER_2D.min_z = 0.2  --使用多点高以上的点云，单线的时候不要设置，多线防止打到地面上的点干扰建图</span></span>
<span class="line"><span style="color:#768390;">--TRAJECTORY_BUILDER_2D.max_z = 1.4</span></span>
<span class="line"><span style="color:#768390;">--TRAJECTORY_BUILDER_2D.voxel_filter_size = 0.02</span></span>
<span class="line"></span>
<span class="line"><span style="color:#768390;">--TRAJECTORY_BUILDER_2D.adaptive_voxel_filter.max_length = 0.5</span></span>
<span class="line"><span style="color:#768390;">--TRAJECTORY_BUILDER_2D.adaptive_voxel_filter.min_num_points = 200.</span></span>
<span class="line"><span style="color:#768390;">--TRAJECTORY_BUILDER_2D.adaptive_voxel_filter.max_range = 50.</span></span>
<span class="line"></span>
<span class="line"><span style="color:#768390;">--TRAJECTORY_BUILDER_2D.loop_closure_adaptive_voxel_filter.max_length = 0.9</span></span>
<span class="line"><span style="color:#768390;">--TRAJECTORY_BUILDER_2D.loop_closure_adaptive_voxel_filter.min_num_points = 100</span></span>
<span class="line"><span style="color:#768390;">--TRAJECTORY_BUILDER_2D.loop_closure_adaptive_voxel_filter.max_range = 50.</span></span>
<span class="line"><span style="color:#768390;">-- 这个参数用于指定在传感器数据中缺失时，算法应该考虑的最大距离</span></span>
<span class="line"><span style="color:#ADBAC7;">TRAJECTORY_BUILDER_2D.</span><span style="color:#6CB6FF;">missing_data_ray_length</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">=</span><span style="color:#ADBAC7;"> </span><span style="color:#6CB6FF;">1.</span></span>
<span class="line"><span style="color:#768390;">-- 通过在传感器数据中搜索相关的特征来进行实时的定位和地图构建  仿真的时候不用开</span></span>
<span class="line"><span style="color:#ADBAC7;">TRAJECTORY_BUILDER_2D.</span><span style="color:#6CB6FF;">use_online_correlative_scan_matching</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">=</span><span style="color:#ADBAC7;"> </span><span style="color:#6CB6FF;">true</span></span>
<span class="line"><span style="color:#768390;">-- 指定在线实时相关扫描匹配器的线性搜索窗口大小</span></span>
<span class="line"><span style="color:#ADBAC7;">TRAJECTORY_BUILDER_2D.</span><span style="color:#6CB6FF;">real_time_correlative_scan_matcher</span><span style="color:#ADBAC7;">.</span><span style="color:#6CB6FF;">linear_search_window</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">=</span><span style="color:#ADBAC7;"> </span><span style="color:#6CB6FF;">0.1</span></span>
<span class="line"><span style="color:#768390;">-- 指定在线实时相关扫描匹配器中平移变化成本的权重</span></span>
<span class="line"><span style="color:#ADBAC7;">TRAJECTORY_BUILDER_2D.</span><span style="color:#6CB6FF;">real_time_correlative_scan_matcher</span><span style="color:#ADBAC7;">.</span><span style="color:#6CB6FF;">translation_delta_cost_weight</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">=</span><span style="color:#ADBAC7;"> </span><span style="color:#6CB6FF;">10.</span></span>
<span class="line"><span style="color:#768390;">-- 指定在线实时相关扫描匹配器中旋转变化成本的权重</span></span>
<span class="line"><span style="color:#ADBAC7;">TRAJECTORY_BUILDER_2D.</span><span style="color:#6CB6FF;">real_time_correlative_scan_matcher</span><span style="color:#ADBAC7;">.</span><span style="color:#6CB6FF;">rotation_delta_cost_weight</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">=</span><span style="color:#ADBAC7;"> </span><span style="color:#6CB6FF;">1e-1</span></span>
<span class="line"></span>
<span class="line"><span style="color:#768390;">--ceres地图的扫描，平移，旋转的权重，影响建图效果，其他基本上是影响计算量等</span></span>
<span class="line"><span style="color:#768390;">--扫描匹配点云和地图匹配程度，值越大，点云和地图匹配置信度越高</span></span>
<span class="line"><span style="color:#ADBAC7;">TRAJECTORY_BUILDER_2D.</span><span style="color:#6CB6FF;">ceres_scan_matcher</span><span style="color:#ADBAC7;">.</span><span style="color:#6CB6FF;">occupied_space_weight</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">=</span><span style="color:#ADBAC7;"> </span><span style="color:#6CB6FF;">1.</span></span>
<span class="line"><span style="color:#768390;">--残差平移、旋转分量，值越大，越不相信和地图匹配的效果，而是越相信先验位姿的结果</span></span>
<span class="line"><span style="color:#ADBAC7;">TRAJECTORY_BUILDER_2D.</span><span style="color:#6CB6FF;">ceres_scan_matcher</span><span style="color:#ADBAC7;">.</span><span style="color:#6CB6FF;">translation_weight</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">=</span><span style="color:#ADBAC7;"> </span><span style="color:#6CB6FF;">1.</span></span>
<span class="line"><span style="color:#768390;">--如果imu不好，接入后地图旋转厉害，可以将这里的旋转权重减小</span></span>
<span class="line"><span style="color:#ADBAC7;">TRAJECTORY_BUILDER_2D.</span><span style="color:#6CB6FF;">ceres_scan_matcher</span><span style="color:#ADBAC7;">.</span><span style="color:#6CB6FF;">rotation_weight</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">=</span><span style="color:#ADBAC7;"> </span><span style="color:#6CB6FF;">1.</span></span>
<span class="line"><span style="color:#768390;">--TRAJECTORY_BUILDER_2D.ceres_scan_matcher.ceres_solver_options.max_num_iterations = 12</span></span>
<span class="line"></span>
<span class="line"><span style="color:#768390;">--TRAJECTORY_BUILDER_2D.motion_filter.max_distance_meters = 0.1</span></span>
<span class="line"><span style="color:#768390;">--TRAJECTORY_BUILDER_2D.motion_filter.max_angle_radians = 0.004</span></span>
<span class="line"><span style="color:#768390;">--TRAJECTORY_BUILDER_2D.imu_gravity_time_constant = 1.</span></span>
<span class="line"></span>
<span class="line"><span style="color:#ADBAC7;">TRAJECTORY_BUILDER_2D.</span><span style="color:#6CB6FF;">submaps</span><span style="color:#ADBAC7;">.</span><span style="color:#6CB6FF;">num_range_data</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">=</span><span style="color:#ADBAC7;"> </span><span style="color:#6CB6FF;">35.</span><span style="color:#ADBAC7;">  </span><span style="color:#768390;">--一个子图插入多少个节点，根据laser和运动速度进行具体的调整</span></span>
<span class="line"><span style="color:#ADBAC7;">TRAJECTORY_BUILDER_2D.</span><span style="color:#6CB6FF;">submaps</span><span style="color:#ADBAC7;">.</span><span style="color:#6CB6FF;">grid_options_2d</span><span style="color:#ADBAC7;">.</span><span style="color:#6CB6FF;">resolution</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">=</span><span style="color:#ADBAC7;"> </span><span style="color:#6CB6FF;">0.1</span></span>
<span class="line"></span>
<span class="line"><span style="color:#ADBAC7;">POSE_GRAPH.</span><span style="color:#6CB6FF;">optimize_every_n_nodes</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">=</span><span style="color:#ADBAC7;"> </span><span style="color:#6CB6FF;">70.</span><span style="color:#ADBAC7;">   </span><span style="color:#768390;">-- 2倍的num_range_data以上</span></span>
<span class="line"><span style="color:#ADBAC7;">POSE_GRAPH.</span><span style="color:#6CB6FF;">constraint_builder</span><span style="color:#ADBAC7;">.</span><span style="color:#6CB6FF;">sampling_ratio</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">=</span><span style="color:#ADBAC7;"> </span><span style="color:#6CB6FF;">0.3</span><span style="color:#ADBAC7;">   </span><span style="color:#768390;">-- 如果添加的约束与潜在约束的比例低于此比例,则将添加约束</span></span>
<span class="line"><span style="color:#ADBAC7;">POSE_GRAPH.</span><span style="color:#6CB6FF;">constraint_builder</span><span style="color:#ADBAC7;">.</span><span style="color:#6CB6FF;">max_constraint_distance</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">=</span><span style="color:#ADBAC7;"> </span><span style="color:#6CB6FF;">15.</span><span style="color:#ADBAC7;"> </span><span style="color:#768390;">-- 在子图附近考虑姿势的阈值,大于这个值将被略过</span></span>
<span class="line"><span style="color:#ADBAC7;">POSE_GRAPH.</span><span style="color:#6CB6FF;">optimization_problem</span><span style="color:#ADBAC7;">.</span><span style="color:#6CB6FF;">huber_scale</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">=</span><span style="color:#ADBAC7;"> </span><span style="color:#6CB6FF;">1e2</span><span style="color:#ADBAC7;"> </span><span style="color:#768390;">-- 用于指定Huber损失函数中的尺度参数</span></span>
<span class="line"><span style="color:#768390;">-- 回环检测阈值，如果不稳定有错误匹配，可以提高这两个值，场景重复可以降低或者关闭回环</span></span>
<span class="line"><span style="color:#ADBAC7;">POSE_GRAPH.</span><span style="color:#6CB6FF;">constraint_builder</span><span style="color:#ADBAC7;">.</span><span style="color:#6CB6FF;">min_score</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">=</span><span style="color:#ADBAC7;"> </span><span style="color:#6CB6FF;">0.65</span></span>
<span class="line"><span style="color:#ADBAC7;">POSE_GRAPH.</span><span style="color:#6CB6FF;">constraint_builder</span><span style="color:#ADBAC7;">.</span><span style="color:#6CB6FF;">global_localization_min_score</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">=</span><span style="color:#ADBAC7;"> </span><span style="color:#6CB6FF;">0.60</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F47067;">return</span><span style="color:#ADBAC7;"> options</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#005CC5;">include</span><span style="color:#24292E;"> </span><span style="color:#032F62;">&quot;map_builder.lua&quot;</span></span>
<span class="line"><span style="color:#005CC5;">include</span><span style="color:#24292E;"> </span><span style="color:#032F62;">&quot;trajectory_builder.lua&quot;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">options </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> {</span></span>
<span class="line"><span style="color:#24292E;">  map_builder </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> MAP_BUILDER,                </span><span style="color:#6A737D;">-- map_builder.lua的配置信息</span></span>
<span class="line"><span style="color:#24292E;">  trajectory_builder </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> TRAJECTORY_BUILDER,  </span><span style="color:#6A737D;">-- trajectory_builder.lua的配置信息</span></span>
<span class="line"><span style="color:#24292E;">  </span></span>
<span class="line"><span style="color:#24292E;">  map_frame </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> </span><span style="color:#032F62;">&quot;map&quot;</span><span style="color:#24292E;">,                        </span><span style="color:#6A737D;">-- 地图坐标系的名字</span></span>
<span class="line"><span style="color:#24292E;">  </span><span style="color:#6A737D;">--tracking_frame 有 imu 的 link 就设置成 imu 的 link, 没有就设置成 base_link</span></span>
<span class="line"><span style="color:#24292E;">  tracking_frame </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> </span><span style="color:#032F62;">&quot;base_footprint&quot;</span><span style="color:#24292E;">,        </span><span style="color:#6A737D;">-- 将所有传感器数据转换到这个坐标系下</span></span>
<span class="line"><span style="color:#24292E;">  </span><span style="color:#6A737D;">-- 发布的 tf 的最下边一个坐标系, 就是 bag 文件中 tf树的最上边的一个坐标系</span></span>
<span class="line"><span style="color:#24292E;">  published_frame </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> </span><span style="color:#032F62;">&quot;base_footprint&quot;</span><span style="color:#24292E;">,       </span><span style="color:#6A737D;">-- tf: map -&gt; footprint</span></span>
<span class="line"><span style="color:#24292E;">  odom_frame </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> </span><span style="color:#032F62;">&quot;odom_combined&quot;</span><span style="color:#24292E;">,             </span><span style="color:#6A737D;">-- 里程计的坐标系名字</span></span>
<span class="line"><span style="color:#24292E;">  provide_odom_frame </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">true</span><span style="color:#24292E;">,                </span><span style="color:#6A737D;">-- 是否提供odom的tf, 如果为true,则tf树为map-&gt;odom-&gt;footprint</span></span>
<span class="line"><span style="color:#24292E;">                                            </span><span style="color:#6A737D;">-- 如果为false tf树为map-&gt;footprint</span></span>
<span class="line"><span style="color:#24292E;">  publish_frame_projected_to_2d </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">false</span><span style="color:#24292E;">,    </span><span style="color:#6A737D;">-- 是否将坐标系投影到平面上</span></span>
<span class="line"><span style="color:#24292E;">  </span><span style="color:#6A737D;">--use_pose_extrapolator = false,            -- 发布tf时是使用pose_extrapolator的位姿还是前端计算出来的位姿</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">  use_odometry </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">true</span><span style="color:#24292E;">,                     </span><span style="color:#6A737D;">-- 是否使用里程计,如果使用要求一定要有odom的tf</span></span>
<span class="line"><span style="color:#24292E;">  use_nav_sat </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">false</span><span style="color:#24292E;">,                      </span><span style="color:#6A737D;">-- 是否使用gps</span></span>
<span class="line"><span style="color:#24292E;">  use_landmarks </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">false</span><span style="color:#24292E;">,                    </span><span style="color:#6A737D;">-- 是否使用landmark</span></span>
<span class="line"><span style="color:#24292E;">  num_laser_scans </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">1</span><span style="color:#24292E;">,                      </span><span style="color:#6A737D;">-- 是否使用单线激光数据</span></span>
<span class="line"><span style="color:#24292E;">  num_multi_echo_laser_scans </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">0</span><span style="color:#24292E;">,           </span><span style="color:#6A737D;">-- 是否使用multi_echo_laser_scans数据</span></span>
<span class="line"><span style="color:#24292E;">  num_subdivisions_per_laser_scan </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">1</span><span style="color:#24292E;">,      </span><span style="color:#6A737D;">-- 1帧数据被分成几次处理,一般为1</span></span>
<span class="line"><span style="color:#24292E;">  num_point_clouds </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">0</span><span style="color:#24292E;">,                     </span><span style="color:#6A737D;">-- 是否使用点云数据</span></span>
<span class="line"><span style="color:#24292E;">  </span></span>
<span class="line"><span style="color:#24292E;">  lookup_transform_timeout_sec </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">0.2</span><span style="color:#24292E;">,       </span><span style="color:#6A737D;">-- 查找tf时的超时时间</span></span>
<span class="line"><span style="color:#24292E;">  submap_publish_period_sec </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">0.3</span><span style="color:#24292E;">,          </span><span style="color:#6A737D;">-- 发布数据的时间间隔</span></span>
<span class="line"><span style="color:#24292E;">  pose_publish_period_sec </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">5e-3</span><span style="color:#24292E;">,</span></span>
<span class="line"><span style="color:#24292E;">  trajectory_publish_period_sec </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">30e-3</span><span style="color:#24292E;">,</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">  rangefinder_sampling_ratio </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">1.</span><span style="color:#24292E;">,          </span><span style="color:#6A737D;">-- 传感器数据的采样频率</span></span>
<span class="line"><span style="color:#24292E;">  odometry_sampling_ratio </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">1.</span><span style="color:#24292E;">,</span></span>
<span class="line"><span style="color:#24292E;">  fixed_frame_pose_sampling_ratio </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">1.</span><span style="color:#24292E;">,</span></span>
<span class="line"><span style="color:#24292E;">  imu_sampling_ratio </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">1.</span><span style="color:#24292E;">,</span></span>
<span class="line"><span style="color:#24292E;">  landmarks_sampling_ratio </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">1.</span><span style="color:#24292E;">,</span></span>
<span class="line"><span style="color:#24292E;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">MAP_BUILDER.</span><span style="color:#6F42C1;">use_trajectory_builder_2d</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">true</span><span style="color:#24292E;">   </span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">TRAJECTORY_BUILDER_2D.</span><span style="color:#6F42C1;">use_imu_data</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">false</span><span style="color:#24292E;">   </span><span style="color:#6A737D;">-- 设置IMU数据</span></span>
<span class="line"><span style="color:#24292E;">TRAJECTORY_BUILDER_2D.</span><span style="color:#6F42C1;">min_range</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">0.1</span><span style="color:#24292E;">   </span><span style="color:#6A737D;">--雷达的最大最小距离，根据雷达硬件设定</span></span>
<span class="line"><span style="color:#24292E;">TRAJECTORY_BUILDER_2D.</span><span style="color:#6F42C1;">max_range</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">18.</span><span style="color:#24292E;">  </span><span style="color:#6A737D;">--雷达的最大最小距离，根据雷达硬件设定</span></span>
<span class="line"><span style="color:#6A737D;">-- TRAJECTORY_BUILDER_2D.min_z = 0.2  --使用多点高以上的点云，单线的时候不要设置，多线防止打到地面上的点干扰建图</span></span>
<span class="line"><span style="color:#6A737D;">--TRAJECTORY_BUILDER_2D.max_z = 1.4</span></span>
<span class="line"><span style="color:#6A737D;">--TRAJECTORY_BUILDER_2D.voxel_filter_size = 0.02</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D;">--TRAJECTORY_BUILDER_2D.adaptive_voxel_filter.max_length = 0.5</span></span>
<span class="line"><span style="color:#6A737D;">--TRAJECTORY_BUILDER_2D.adaptive_voxel_filter.min_num_points = 200.</span></span>
<span class="line"><span style="color:#6A737D;">--TRAJECTORY_BUILDER_2D.adaptive_voxel_filter.max_range = 50.</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D;">--TRAJECTORY_BUILDER_2D.loop_closure_adaptive_voxel_filter.max_length = 0.9</span></span>
<span class="line"><span style="color:#6A737D;">--TRAJECTORY_BUILDER_2D.loop_closure_adaptive_voxel_filter.min_num_points = 100</span></span>
<span class="line"><span style="color:#6A737D;">--TRAJECTORY_BUILDER_2D.loop_closure_adaptive_voxel_filter.max_range = 50.</span></span>
<span class="line"><span style="color:#6A737D;">-- 这个参数用于指定在传感器数据中缺失时，算法应该考虑的最大距离</span></span>
<span class="line"><span style="color:#24292E;">TRAJECTORY_BUILDER_2D.</span><span style="color:#6F42C1;">missing_data_ray_length</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">1.</span></span>
<span class="line"><span style="color:#6A737D;">-- 通过在传感器数据中搜索相关的特征来进行实时的定位和地图构建  仿真的时候不用开</span></span>
<span class="line"><span style="color:#24292E;">TRAJECTORY_BUILDER_2D.</span><span style="color:#6F42C1;">use_online_correlative_scan_matching</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">true</span></span>
<span class="line"><span style="color:#6A737D;">-- 指定在线实时相关扫描匹配器的线性搜索窗口大小</span></span>
<span class="line"><span style="color:#24292E;">TRAJECTORY_BUILDER_2D.</span><span style="color:#6F42C1;">real_time_correlative_scan_matcher</span><span style="color:#24292E;">.</span><span style="color:#6F42C1;">linear_search_window</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">0.1</span></span>
<span class="line"><span style="color:#6A737D;">-- 指定在线实时相关扫描匹配器中平移变化成本的权重</span></span>
<span class="line"><span style="color:#24292E;">TRAJECTORY_BUILDER_2D.</span><span style="color:#6F42C1;">real_time_correlative_scan_matcher</span><span style="color:#24292E;">.</span><span style="color:#6F42C1;">translation_delta_cost_weight</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">10.</span></span>
<span class="line"><span style="color:#6A737D;">-- 指定在线实时相关扫描匹配器中旋转变化成本的权重</span></span>
<span class="line"><span style="color:#24292E;">TRAJECTORY_BUILDER_2D.</span><span style="color:#6F42C1;">real_time_correlative_scan_matcher</span><span style="color:#24292E;">.</span><span style="color:#6F42C1;">rotation_delta_cost_weight</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">1e-1</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D;">--ceres地图的扫描，平移，旋转的权重，影响建图效果，其他基本上是影响计算量等</span></span>
<span class="line"><span style="color:#6A737D;">--扫描匹配点云和地图匹配程度，值越大，点云和地图匹配置信度越高</span></span>
<span class="line"><span style="color:#24292E;">TRAJECTORY_BUILDER_2D.</span><span style="color:#6F42C1;">ceres_scan_matcher</span><span style="color:#24292E;">.</span><span style="color:#6F42C1;">occupied_space_weight</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">1.</span></span>
<span class="line"><span style="color:#6A737D;">--残差平移、旋转分量，值越大，越不相信和地图匹配的效果，而是越相信先验位姿的结果</span></span>
<span class="line"><span style="color:#24292E;">TRAJECTORY_BUILDER_2D.</span><span style="color:#6F42C1;">ceres_scan_matcher</span><span style="color:#24292E;">.</span><span style="color:#6F42C1;">translation_weight</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">1.</span></span>
<span class="line"><span style="color:#6A737D;">--如果imu不好，接入后地图旋转厉害，可以将这里的旋转权重减小</span></span>
<span class="line"><span style="color:#24292E;">TRAJECTORY_BUILDER_2D.</span><span style="color:#6F42C1;">ceres_scan_matcher</span><span style="color:#24292E;">.</span><span style="color:#6F42C1;">rotation_weight</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">1.</span></span>
<span class="line"><span style="color:#6A737D;">--TRAJECTORY_BUILDER_2D.ceres_scan_matcher.ceres_solver_options.max_num_iterations = 12</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D;">--TRAJECTORY_BUILDER_2D.motion_filter.max_distance_meters = 0.1</span></span>
<span class="line"><span style="color:#6A737D;">--TRAJECTORY_BUILDER_2D.motion_filter.max_angle_radians = 0.004</span></span>
<span class="line"><span style="color:#6A737D;">--TRAJECTORY_BUILDER_2D.imu_gravity_time_constant = 1.</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">TRAJECTORY_BUILDER_2D.</span><span style="color:#6F42C1;">submaps</span><span style="color:#24292E;">.</span><span style="color:#6F42C1;">num_range_data</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">35.</span><span style="color:#24292E;">  </span><span style="color:#6A737D;">--一个子图插入多少个节点，根据laser和运动速度进行具体的调整</span></span>
<span class="line"><span style="color:#24292E;">TRAJECTORY_BUILDER_2D.</span><span style="color:#6F42C1;">submaps</span><span style="color:#24292E;">.</span><span style="color:#6F42C1;">grid_options_2d</span><span style="color:#24292E;">.</span><span style="color:#6F42C1;">resolution</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">0.1</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">POSE_GRAPH.</span><span style="color:#6F42C1;">optimize_every_n_nodes</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">70.</span><span style="color:#24292E;">   </span><span style="color:#6A737D;">-- 2倍的num_range_data以上</span></span>
<span class="line"><span style="color:#24292E;">POSE_GRAPH.</span><span style="color:#6F42C1;">constraint_builder</span><span style="color:#24292E;">.</span><span style="color:#6F42C1;">sampling_ratio</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">0.3</span><span style="color:#24292E;">   </span><span style="color:#6A737D;">-- 如果添加的约束与潜在约束的比例低于此比例,则将添加约束</span></span>
<span class="line"><span style="color:#24292E;">POSE_GRAPH.</span><span style="color:#6F42C1;">constraint_builder</span><span style="color:#24292E;">.</span><span style="color:#6F42C1;">max_constraint_distance</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">15.</span><span style="color:#24292E;"> </span><span style="color:#6A737D;">-- 在子图附近考虑姿势的阈值,大于这个值将被略过</span></span>
<span class="line"><span style="color:#24292E;">POSE_GRAPH.</span><span style="color:#6F42C1;">optimization_problem</span><span style="color:#24292E;">.</span><span style="color:#6F42C1;">huber_scale</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">1e2</span><span style="color:#24292E;"> </span><span style="color:#6A737D;">-- 用于指定Huber损失函数中的尺度参数</span></span>
<span class="line"><span style="color:#6A737D;">-- 回环检测阈值，如果不稳定有错误匹配，可以提高这两个值，场景重复可以降低或者关闭回环</span></span>
<span class="line"><span style="color:#24292E;">POSE_GRAPH.</span><span style="color:#6F42C1;">constraint_builder</span><span style="color:#24292E;">.</span><span style="color:#6F42C1;">min_score</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">0.65</span></span>
<span class="line"><span style="color:#24292E;">POSE_GRAPH.</span><span style="color:#6F42C1;">constraint_builder</span><span style="color:#24292E;">.</span><span style="color:#6F42C1;">global_localization_min_score</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">0.60</span></span>
<span class="line"></span>
<span class="line"><span style="color:#D73A49;">return</span><span style="color:#24292E;"> options</span></span></code></pre></div><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki github-dark-dimmed vp-code-dark"><code><span class="line"><span style="color:#adbac7;">&lt;!--</span></span>
<span class="line"><span style="color:#adbac7;">  Copyright 2016 The Cartographer Authors</span></span>
<span class="line"><span style="color:#adbac7;"></span></span>
<span class="line"><span style="color:#adbac7;">  Licensed under the Apache License, Version 2.0 (the &quot;License&quot;);</span></span>
<span class="line"><span style="color:#adbac7;">  you may not use this file except in compliance with the License.</span></span>
<span class="line"><span style="color:#adbac7;">  You may obtain a copy of the License at</span></span>
<span class="line"><span style="color:#adbac7;"></span></span>
<span class="line"><span style="color:#adbac7;">       http://www.apache.org/licenses/LICENSE-2.0</span></span>
<span class="line"><span style="color:#adbac7;"></span></span>
<span class="line"><span style="color:#adbac7;">  Unless required by applicable law or agreed to in writing, software</span></span>
<span class="line"><span style="color:#adbac7;">  distributed under the License is distributed on an &quot;AS IS&quot; BASIS,</span></span>
<span class="line"><span style="color:#adbac7;">  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.</span></span>
<span class="line"><span style="color:#adbac7;">  See the License for the specific language governing permissions and</span></span>
<span class="line"><span style="color:#adbac7;">  limitations under the License.</span></span>
<span class="line"><span style="color:#adbac7;">--&gt;</span></span>
<span class="line"><span style="color:#adbac7;"></span></span>
<span class="line"><span style="color:#adbac7;">&lt;launch&gt;</span></span>
<span class="line"><span style="color:#adbac7;">  &lt;!-- bag的地址与名称 --&gt;</span></span>
<span class="line"><span style="color:#adbac7;">  &lt;arg name=&quot;bag_filename&quot; default=&quot;$(env HOME)/bagfiles/rslidar-outdoor-gps-notf.bag&quot;/&gt;</span></span>
<span class="line"><span style="color:#adbac7;"></span></span>
<span class="line"><span style="color:#adbac7;">  &lt;!-- 使用bag的时间戳 --&gt;</span></span>
<span class="line"><span style="color:#adbac7;">  &lt;param name=&quot;/use_sim_time&quot; value=&quot;true&quot; /&gt;</span></span>
<span class="line"><span style="color:#adbac7;"></span></span>
<span class="line"><span style="color:#adbac7;">  &lt;!-- 启动cartographer --&gt;</span></span>
<span class="line"><span style="color:#adbac7;">  &lt;node name=&quot;cartographer_node&quot; pkg=&quot;cartographer_ros&quot;</span></span>
<span class="line"><span style="color:#adbac7;">      type=&quot;cartographer_node&quot; args=&quot;</span></span>
<span class="line"><span style="color:#adbac7;">          -configuration_directory $(find cartographer_ros)/configuration_files</span></span>
<span class="line"><span style="color:#adbac7;">          -configuration_basename lx_rs16_2d_outdoor.lua&quot;</span></span>
<span class="line"><span style="color:#adbac7;">      output=&quot;screen&quot;&gt;</span></span>
<span class="line"><span style="color:#adbac7;">    &lt;remap from=&quot;points2&quot; to=&quot;rslidar_points&quot; /&gt;</span></span>
<span class="line"><span style="color:#adbac7;">    &lt;remap from=&quot;scan&quot; to=&quot;front_scan&quot; /&gt;</span></span>
<span class="line"><span style="color:#adbac7;">    &lt;remap from=&quot;odom&quot; to=&quot;odom_scout&quot; /&gt;</span></span>
<span class="line"><span style="color:#adbac7;">    &lt;remap from=&quot;imu&quot; to=&quot;imu&quot; /&gt;</span></span>
<span class="line"><span style="color:#adbac7;">  &lt;/node&gt;</span></span>
<span class="line"><span style="color:#adbac7;"></span></span>
<span class="line"><span style="color:#adbac7;">  &lt;!-- 生成ros格式的地图 --&gt;</span></span>
<span class="line"><span style="color:#adbac7;">  &lt;node name=&quot;cartographer_occupancy_grid_node&quot; pkg=&quot;cartographer_ros&quot;</span></span>
<span class="line"><span style="color:#adbac7;">      type=&quot;cartographer_occupancy_grid_node&quot; args=&quot;-resolution 0.05&quot; /&gt;</span></span>
<span class="line"><span style="color:#adbac7;"></span></span>
<span class="line"><span style="color:#adbac7;">  &lt;!-- 启动rviz --&gt;</span></span>
<span class="line"><span style="color:#adbac7;">  &lt;node name=&quot;rviz&quot; pkg=&quot;rviz&quot; type=&quot;rviz&quot; required=&quot;true&quot;</span></span>
<span class="line"><span style="color:#adbac7;">      args=&quot;-d $(find cartographer_ros)/configuration_files/lx_2d.rviz&quot; /&gt;</span></span>
<span class="line"><span style="color:#adbac7;"></span></span>
<span class="line"><span style="color:#adbac7;">  &lt;!-- 启动rosbag --&gt;</span></span>
<span class="line"><span style="color:#adbac7;">  &lt;node name=&quot;playbag&quot; pkg=&quot;rosbag&quot; type=&quot;play&quot;</span></span>
<span class="line"><span style="color:#adbac7;">      args=&quot;--clock $(arg bag_filename)&quot; /&gt;</span></span>
<span class="line"><span style="color:#adbac7;"></span></span>
<span class="line"><span style="color:#adbac7;">&lt;/launch&gt;</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#24292e;">&lt;!--</span></span>
<span class="line"><span style="color:#24292e;">  Copyright 2016 The Cartographer Authors</span></span>
<span class="line"><span style="color:#24292e;"></span></span>
<span class="line"><span style="color:#24292e;">  Licensed under the Apache License, Version 2.0 (the &quot;License&quot;);</span></span>
<span class="line"><span style="color:#24292e;">  you may not use this file except in compliance with the License.</span></span>
<span class="line"><span style="color:#24292e;">  You may obtain a copy of the License at</span></span>
<span class="line"><span style="color:#24292e;"></span></span>
<span class="line"><span style="color:#24292e;">       http://www.apache.org/licenses/LICENSE-2.0</span></span>
<span class="line"><span style="color:#24292e;"></span></span>
<span class="line"><span style="color:#24292e;">  Unless required by applicable law or agreed to in writing, software</span></span>
<span class="line"><span style="color:#24292e;">  distributed under the License is distributed on an &quot;AS IS&quot; BASIS,</span></span>
<span class="line"><span style="color:#24292e;">  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.</span></span>
<span class="line"><span style="color:#24292e;">  See the License for the specific language governing permissions and</span></span>
<span class="line"><span style="color:#24292e;">  limitations under the License.</span></span>
<span class="line"><span style="color:#24292e;">--&gt;</span></span>
<span class="line"><span style="color:#24292e;"></span></span>
<span class="line"><span style="color:#24292e;">&lt;launch&gt;</span></span>
<span class="line"><span style="color:#24292e;">  &lt;!-- bag的地址与名称 --&gt;</span></span>
<span class="line"><span style="color:#24292e;">  &lt;arg name=&quot;bag_filename&quot; default=&quot;$(env HOME)/bagfiles/rslidar-outdoor-gps-notf.bag&quot;/&gt;</span></span>
<span class="line"><span style="color:#24292e;"></span></span>
<span class="line"><span style="color:#24292e;">  &lt;!-- 使用bag的时间戳 --&gt;</span></span>
<span class="line"><span style="color:#24292e;">  &lt;param name=&quot;/use_sim_time&quot; value=&quot;true&quot; /&gt;</span></span>
<span class="line"><span style="color:#24292e;"></span></span>
<span class="line"><span style="color:#24292e;">  &lt;!-- 启动cartographer --&gt;</span></span>
<span class="line"><span style="color:#24292e;">  &lt;node name=&quot;cartographer_node&quot; pkg=&quot;cartographer_ros&quot;</span></span>
<span class="line"><span style="color:#24292e;">      type=&quot;cartographer_node&quot; args=&quot;</span></span>
<span class="line"><span style="color:#24292e;">          -configuration_directory $(find cartographer_ros)/configuration_files</span></span>
<span class="line"><span style="color:#24292e;">          -configuration_basename lx_rs16_2d_outdoor.lua&quot;</span></span>
<span class="line"><span style="color:#24292e;">      output=&quot;screen&quot;&gt;</span></span>
<span class="line"><span style="color:#24292e;">    &lt;remap from=&quot;points2&quot; to=&quot;rslidar_points&quot; /&gt;</span></span>
<span class="line"><span style="color:#24292e;">    &lt;remap from=&quot;scan&quot; to=&quot;front_scan&quot; /&gt;</span></span>
<span class="line"><span style="color:#24292e;">    &lt;remap from=&quot;odom&quot; to=&quot;odom_scout&quot; /&gt;</span></span>
<span class="line"><span style="color:#24292e;">    &lt;remap from=&quot;imu&quot; to=&quot;imu&quot; /&gt;</span></span>
<span class="line"><span style="color:#24292e;">  &lt;/node&gt;</span></span>
<span class="line"><span style="color:#24292e;"></span></span>
<span class="line"><span style="color:#24292e;">  &lt;!-- 生成ros格式的地图 --&gt;</span></span>
<span class="line"><span style="color:#24292e;">  &lt;node name=&quot;cartographer_occupancy_grid_node&quot; pkg=&quot;cartographer_ros&quot;</span></span>
<span class="line"><span style="color:#24292e;">      type=&quot;cartographer_occupancy_grid_node&quot; args=&quot;-resolution 0.05&quot; /&gt;</span></span>
<span class="line"><span style="color:#24292e;"></span></span>
<span class="line"><span style="color:#24292e;">  &lt;!-- 启动rviz --&gt;</span></span>
<span class="line"><span style="color:#24292e;">  &lt;node name=&quot;rviz&quot; pkg=&quot;rviz&quot; type=&quot;rviz&quot; required=&quot;true&quot;</span></span>
<span class="line"><span style="color:#24292e;">      args=&quot;-d $(find cartographer_ros)/configuration_files/lx_2d.rviz&quot; /&gt;</span></span>
<span class="line"><span style="color:#24292e;"></span></span>
<span class="line"><span style="color:#24292e;">  &lt;!-- 启动rosbag --&gt;</span></span>
<span class="line"><span style="color:#24292e;">  &lt;node name=&quot;playbag&quot; pkg=&quot;rosbag&quot; type=&quot;play&quot;</span></span>
<span class="line"><span style="color:#24292e;">      args=&quot;--clock $(arg bag_filename)&quot; /&gt;</span></span>
<span class="line"><span style="color:#24292e;"></span></span>
<span class="line"><span style="color:#24292e;">&lt;/launch&gt;</span></span></code></pre></div><div class="language-rviz vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">rviz</span><pre class="shiki github-dark-dimmed has-diff vp-code-dark"><code><span class="line"><span style="color:#adbac7;">Panels:</span></span>
<span class="line"><span style="color:#adbac7;">  - Class: rviz/Displays</span></span>
<span class="line"><span style="color:#adbac7;">    Help Height: 78</span></span>
<span class="line"><span style="color:#adbac7;">    Name: Displays</span></span>
<span class="line"><span style="color:#adbac7;">    Property Tree Widget:</span></span>
<span class="line"><span style="color:#adbac7;">      Expanded: ~</span></span>
<span class="line"><span style="color:#adbac7;">      Splitter Ratio: 0.544444442</span></span>
<span class="line"><span style="color:#adbac7;">    Tree Height: 463</span></span>
<span class="line"><span style="color:#adbac7;">  - Class: rviz/Selection</span></span>
<span class="line"><span style="color:#adbac7;">    Name: Selection</span></span>
<span class="line"><span style="color:#adbac7;">  - Class: rviz/Tool Properties</span></span>
<span class="line"><span style="color:#adbac7;">    Expanded:</span></span>
<span class="line"><span style="color:#adbac7;">      - /2D Pose Estimate1</span></span>
<span class="line"><span style="color:#adbac7;">      - /2D Nav Goal1</span></span>
<span class="line"><span style="color:#adbac7;">      - /Publish Point1</span></span>
<span class="line"><span style="color:#adbac7;">    Name: Tool Properties</span></span>
<span class="line"><span style="color:#adbac7;">    Splitter Ratio: 0.588679016</span></span>
<span class="line"><span style="color:#adbac7;">  - Class: rviz/Views</span></span>
<span class="line"><span style="color:#adbac7;">    Expanded:</span></span>
<span class="line"><span style="color:#adbac7;">      - /Current View1</span></span>
<span class="line"><span style="color:#adbac7;">    Name: Views</span></span>
<span class="line"><span style="color:#adbac7;">    Splitter Ratio: 0.5</span></span>
<span class="line"><span style="color:#adbac7;">  - Class: rviz/Time</span></span>
<span class="line"><span style="color:#adbac7;">    Experimental: false</span></span>
<span class="line"><span style="color:#adbac7;">    Name: Time</span></span>
<span class="line"><span style="color:#adbac7;">    SyncMode: 0</span></span>
<span class="line"><span style="color:#adbac7;">    SyncSource: PointCloud2</span></span>
<span class="line"><span style="color:#adbac7;">Toolbars:</span></span>
<span class="line"><span style="color:#adbac7;">  toolButtonStyle: 2</span></span>
<span class="line"><span style="color:#adbac7;">Visualization Manager:</span></span>
<span class="line"><span style="color:#adbac7;">  Class: &quot;&quot;</span></span>
<span class="line"><span style="color:#adbac7;">  Displays:</span></span>
<span class="line"><span style="color:#adbac7;">    - Alpha: 0.5</span></span>
<span class="line"><span style="color:#adbac7;">      Cell Size: 5</span></span>
<span class="line"><span style="color:#adbac7;">      Class: rviz/Grid</span></span>
<span class="line"><span style="color:#adbac7;">      Color: 160; 160; 164</span></span>
<span class="line"><span style="color:#adbac7;">      Enabled: true</span></span>
<span class="line"><span style="color:#adbac7;">      Line Style:</span></span>
<span class="line"><span style="color:#adbac7;">        Line Width: 0.0299999993</span></span>
<span class="line"><span style="color:#adbac7;">        Value: Lines</span></span>
<span class="line"><span style="color:#adbac7;">      Name: Grid</span></span>
<span class="line"><span style="color:#adbac7;">      Normal Cell Count: 0</span></span>
<span class="line"><span style="color:#adbac7;">      Offset:</span></span>
<span class="line"><span style="color:#adbac7;">        X: 0</span></span>
<span class="line"><span style="color:#adbac7;">        Y: 0</span></span>
<span class="line"><span style="color:#adbac7;">        Z: 0</span></span>
<span class="line"><span style="color:#adbac7;">      Plane: XY</span></span>
<span class="line"><span style="color:#adbac7;">      Plane Cell Count: 100</span></span>
<span class="line"><span style="color:#adbac7;">      Reference Frame: &lt;Fixed Frame&gt;</span></span>
<span class="line"><span style="color:#adbac7;">      Value: true</span></span>
<span class="line"><span style="color:#adbac7;">    - Class: rviz/TF</span></span>
<span class="line"><span style="color:#adbac7;">      Enabled: true</span></span>
<span class="line"><span style="color:#adbac7;">      Frame Timeout: 15</span></span>
<span class="line"><span style="color:#adbac7;">      Frames:</span></span>
<span class="line"><span style="color:#adbac7;">        All Enabled: true</span></span>
<span class="line"><span style="color:#adbac7;">        GPS_back_link:</span></span>
<span class="line"><span style="color:#adbac7;">          Value: true</span></span>
<span class="line"><span style="color:#adbac7;">        GPS_front_link:</span></span>
<span class="line"><span style="color:#adbac7;">          Value: true</span></span>
<span class="line"><span style="color:#adbac7;">        base_link:</span></span>
<span class="line"><span style="color:#adbac7;">          Value: true</span></span>
<span class="line"><span style="color:#adbac7;">        footprint:</span></span>
<span class="line"><span style="color:#adbac7;">          Value: true</span></span>
<span class="line"><span style="color:#adbac7;">        front_laser_link:</span></span>
<span class="line"><span style="color:#adbac7;">          Value: true</span></span>
<span class="line"><span style="color:#adbac7;">        imu_link:</span></span>
<span class="line"><span style="color:#adbac7;">          Value: true</span></span>
<span class="line"><span style="color:#adbac7;">        map:</span></span>
<span class="line"><span style="color:#adbac7;">          Value: true</span></span>
<span class="line"><span style="color:#adbac7;">      Marker Scale: 1</span></span>
<span class="line"><span style="color:#adbac7;">      Name: TF</span></span>
<span class="line"><span style="color:#adbac7;">      Show Arrows: true</span></span>
<span class="line"><span style="color:#adbac7;">      Show Axes: true</span></span>
<span class="line"><span style="color:#adbac7;">      Show Names: true</span></span>
<span class="line"><span style="color:#adbac7;">      Tree:</span></span>
<span class="line"><span style="color:#adbac7;">        map:</span></span>
<span class="line"><span style="color:#adbac7;">          footprint:</span></span>
<span class="line"><span style="color:#adbac7;">            base_link:</span></span>
<span class="line"><span style="color:#adbac7;">              GPS_back_link:</span></span>
<span class="line"><span style="color:#adbac7;">                {}</span></span>
<span class="line"><span style="color:#adbac7;">              GPS_front_link:</span></span>
<span class="line"><span style="color:#adbac7;">                {}</span></span>
<span class="line"><span style="color:#adbac7;">              front_laser_link:</span></span>
<span class="line"><span style="color:#adbac7;">                {}</span></span>
<span class="line"><span style="color:#adbac7;">              imu_link:</span></span>
<span class="line"><span style="color:#adbac7;">                {}</span></span>
<span class="line"><span style="color:#adbac7;">      Update Interval: 0</span></span>
<span class="line"><span style="color:#adbac7;">      Value: true</span></span>
<span class="line"><span style="color:#adbac7;">    - Class: Submaps</span></span>
<span class="line"><span style="color:#adbac7;">      Enabled: true</span></span>
<span class="line"><span style="color:#adbac7;">      Fade-out distance: 1</span></span>
<span class="line"><span style="color:#adbac7;">      High Resolution: true</span></span>
<span class="line"><span style="color:#adbac7;">      Low Resolution: false</span></span>
<span class="line"><span style="color:#adbac7;">      Name: Submaps</span></span>
<span class="line"><span style="color:#adbac7;">      Submap query service: /submap_query</span></span>
<span class="line"><span style="color:#adbac7;">      Submaps:</span></span>
<span class="line"><span style="color:#adbac7;">        All: true</span></span>
<span class="line"><span style="color:#adbac7;">        All Submap Pose Markers: true</span></span>
<span class="line"><span style="color:#adbac7;">        Trajectory 0:</span></span>
<span class="line"><span style="color:#adbac7;">          0.160: true</span></span>
<span class="line"><span style="color:#adbac7;">          1.160: true</span></span>
<span class="line"><span style="color:#adbac7;">          10.156: true</span></span>
<span class="line"><span style="color:#adbac7;">          11.76: true</span></span>
<span class="line"><span style="color:#adbac7;">          2.160: true</span></span>
<span class="line"><span style="color:#adbac7;">          3.160: true</span></span>
<span class="line"><span style="color:#adbac7;">          4.160: true</span></span>
<span class="line"><span style="color:#adbac7;">          5.160: true</span></span>
<span class="line"><span style="color:#adbac7;">          6.160: true</span></span>
<span class="line"><span style="color:#adbac7;">          7.160: true</span></span>
<span class="line"><span style="color:#adbac7;">          8.160: true</span></span>
<span class="line"><span style="color:#adbac7;">          9.160: true</span></span>
<span class="line"><span style="color:#adbac7;">          Submap Pose Markers: true</span></span>
<span class="line"><span style="color:#adbac7;">          Value: true</span></span>
<span class="line"><span style="color:#adbac7;">      Topic: /submap_list</span></span>
<span class="line"><span style="color:#adbac7;">      Tracking frame: base_link</span></span>
<span class="line"><span style="color:#adbac7;">      Unreliable: false</span></span>
<span class="line"><span style="color:#adbac7;">      Value: true</span></span>
<span class="line"><span style="color:#adbac7;">    - Alpha: 1</span></span>
<span class="line"><span style="color:#adbac7;">      Autocompute Intensity Bounds: true</span></span>
<span class="line"><span style="color:#adbac7;">      Autocompute Value Bounds:</span></span>
<span class="line"><span style="color:#adbac7;">        Max Value: 10</span></span>
<span class="line"><span style="color:#adbac7;">        Min Value: -10</span></span>
<span class="line"><span style="color:#adbac7;">        Value: true</span></span>
<span class="line"><span style="color:#adbac7;">      Axis: Z</span></span>
<span class="line"><span style="color:#adbac7;">      Channel Name: intensity</span></span>
<span class="line"><span style="color:#adbac7;">      Class: rviz/PointCloud2</span></span>
<span class="line"><span style="color:#adbac7;">      Color: 0; 255; 0</span></span>
<span class="line"><span style="color:#adbac7;">      Color Transformer: FlatColor</span></span>
<span class="line"><span style="color:#adbac7;">      Decay Time: 0</span></span>
<span class="line"><span style="color:#adbac7;">      Enabled: true</span></span>
<span class="line"><span style="color:#adbac7;">      Invert Rainbow: false</span></span>
<span class="line"><span style="color:#adbac7;">      Max Color: 255; 255; 255</span></span>
<span class="line"><span style="color:#adbac7;">      Max Intensity: 4096</span></span>
<span class="line"><span style="color:#adbac7;">      Min Color: 0; 0; 0</span></span>
<span class="line"><span style="color:#adbac7;">      Min Intensity: 0</span></span>
<span class="line"><span style="color:#adbac7;">      Name: PointCloud2</span></span>
<span class="line"><span style="color:#adbac7;">      Position Transformer: XYZ</span></span>
<span class="line"><span style="color:#adbac7;">      Queue Size: 10</span></span>
<span class="line"><span style="color:#adbac7;">      Selectable: true</span></span>
<span class="line"><span style="color:#adbac7;">      Size (Pixels): 3</span></span>
<span class="line"><span style="color:#adbac7;">      Size (m): 0.0500000007</span></span>
<span class="line"><span style="color:#adbac7;">      Style: Flat Squares</span></span>
<span class="line"><span style="color:#adbac7;">      Topic: /scan_matched_points2</span></span>
<span class="line"><span style="color:#adbac7;">      Unreliable: false</span></span>
<span class="line"><span style="color:#adbac7;">      Use Fixed Frame: true</span></span>
<span class="line"><span style="color:#adbac7;">      Use rainbow: true</span></span>
<span class="line"><span style="color:#adbac7;">      Value: true</span></span>
<span class="line"><span style="color:#adbac7;">    - Class: rviz/MarkerArray</span></span>
<span class="line"><span style="color:#adbac7;">      Enabled: true</span></span>
<span class="line"><span style="color:#adbac7;">      Marker Topic: /trajectory_node_list</span></span>
<span class="line"><span style="color:#adbac7;">      Name: Trajectories</span></span>
<span class="line"><span style="color:#adbac7;">      Namespaces:</span></span>
<span class="line"><span style="color:#adbac7;">        Trajectory 0: true</span></span>
<span class="line"><span style="color:#adbac7;">      Queue Size: 100</span></span>
<span class="line"><span style="color:#adbac7;">      Value: true</span></span>
<span class="line"><span style="color:#adbac7;">    - Class: rviz/MarkerArray</span></span>
<span class="line"><span style="color:#adbac7;">      Enabled: true</span></span>
<span class="line"><span style="color:#adbac7;">      Marker Topic: /landmark_poses_list</span></span>
<span class="line"><span style="color:#adbac7;">      Name: Landmark Poses</span></span>
<span class="line"><span style="color:#adbac7;">      Namespaces:</span></span>
<span class="line"><span style="color:#adbac7;">        {}</span></span>
<span class="line"><span style="color:#adbac7;">      Queue Size: 100</span></span>
<span class="line"><span style="color:#adbac7;">      Value: true</span></span>
<span class="line"><span style="color:#adbac7;">    - Class: rviz/MarkerArray</span></span>
<span class="line"><span style="color:#adbac7;">      Enabled: true</span></span>
<span class="line"><span style="color:#adbac7;">      Marker Topic: /constraint_list</span></span>
<span class="line"><span style="color:#adbac7;">      Name: Constraints</span></span>
<span class="line"><span style="color:#adbac7;">      Namespaces:</span></span>
<span class="line"><span style="color:#adbac7;">        Inter constraints, different trajectories: true</span></span>
<span class="line"><span style="color:#adbac7;">        Inter constraints, same trajectory: true</span></span>
<span class="line"><span style="color:#adbac7;">        Inter residuals, different trajectories: true</span></span>
<span class="line"><span style="color:#adbac7;">        Inter residuals, same trajectory: true</span></span>
<span class="line"><span style="color:#adbac7;">        Intra constraints: true</span></span>
<span class="line"><span style="color:#adbac7;">        Intra residuals: true</span></span>
<span class="line"><span style="color:#adbac7;">      Queue Size: 100</span></span>
<span class="line"><span style="color:#adbac7;">      Value: true</span></span>
<span class="line"><span style="color:#adbac7;">    - Alpha: 1</span></span>
<span class="line"><span style="color:#adbac7;">      Class: rviz/Map</span></span>
<span class="line"><span style="color:#adbac7;">      Color Scheme: map</span></span>
<span class="line"><span style="color:#adbac7;">      Draw Behind: false</span></span>
<span class="line"><span style="color:#adbac7;">      Enabled: false</span></span>
<span class="line"><span style="color:#adbac7;">      Name: Map</span></span>
<span class="line"><span style="color:#adbac7;">      Topic: /map</span></span>
<span class="line"><span style="color:#adbac7;">      Unreliable: false</span></span>
<span class="line"><span style="color:#adbac7;">      Use Timestamp: false</span></span>
<span class="line"><span style="color:#adbac7;">      Value: false</span></span>
<span class="line"><span style="color:#adbac7;">    - Class: rviz/Axes</span></span>
<span class="line"><span style="color:#adbac7;">      Enabled: true</span></span>
<span class="line"><span style="color:#adbac7;">      Length: 2</span></span>
<span class="line"><span style="color:#adbac7;">      Name: Axes</span></span>
<span class="line"><span style="color:#adbac7;">      Radius: 0.100000001</span></span>
<span class="line"><span style="color:#adbac7;">      Reference Frame: front_laser_link</span></span>
<span class="line"><span style="color:#adbac7;">      Value: true</span></span>
<span class="line"><span style="color:#adbac7;">  Enabled: true</span></span>
<span class="line"><span style="color:#adbac7;">  Global Options:</span></span>
<span class="line"><span style="color:#adbac7;">    Background Color: 100; 100; 100</span></span>
<span class="line"><span style="color:#adbac7;">    Default Light: true</span></span>
<span class="line"><span style="color:#adbac7;">    Fixed Frame: map</span></span>
<span class="line"><span style="color:#adbac7;">    Frame Rate: 30</span></span>
<span class="line"><span style="color:#adbac7;">  Name: root</span></span>
<span class="line"><span style="color:#adbac7;">  Tools:</span></span>
<span class="line"><span style="color:#adbac7;">    - Class: rviz/Interact</span></span>
<span class="line"><span style="color:#adbac7;">      Hide Inactive Objects: true</span></span>
<span class="line"><span style="color:#adbac7;">    - Class: rviz/MoveCamera</span></span>
<span class="line"><span style="color:#adbac7;">    - Class: rviz/Select</span></span>
<span class="line"><span style="color:#adbac7;">    - Class: rviz/FocusCamera</span></span>
<span class="line"><span style="color:#adbac7;">    - Class: rviz/Measure</span></span>
<span class="line"><span style="color:#adbac7;">    - Class: rviz/SetInitialPose</span></span>
<span class="line"><span style="color:#adbac7;">      Topic: /initialpose</span></span>
<span class="line"><span style="color:#adbac7;">    - Class: rviz/SetGoal</span></span>
<span class="line"><span style="color:#adbac7;">      Topic: /move_base_simple/goal</span></span>
<span class="line"><span style="color:#adbac7;">    - Class: rviz/PublishPoint</span></span>
<span class="line"><span style="color:#adbac7;">      Single click: true</span></span>
<span class="line"><span style="color:#adbac7;">      Topic: /clicked_point</span></span>
<span class="line"><span style="color:#adbac7;">  Value: true</span></span>
<span class="line"><span style="color:#adbac7;">  Views:</span></span>
<span class="line"><span style="color:#adbac7;">    Current:</span></span>
<span class="line"><span style="color:#adbac7;">      Angle: 0.174999982</span></span>
<span class="line"><span style="color:#adbac7;">      Class: rviz/TopDownOrtho</span></span>
<span class="line"><span style="color:#adbac7;">      Enable Stereo Rendering:</span></span>
<span class="line"><span style="color:#adbac7;">        Stereo Eye Separation: 0.0599999987</span></span>
<span class="line"><span style="color:#adbac7;">        Stereo Focal Distance: 1</span></span>
<span class="line"><span style="color:#adbac7;">        Swap Stereo Eyes: false</span></span>
<span class="line"><span style="color:#adbac7;">        Value: false</span></span>
<span class="line"><span style="color:#adbac7;">      Invert Z Axis: false</span></span>
<span class="line"><span style="color:#adbac7;">      Name: Current View</span></span>
<span class="line"><span style="color:#adbac7;">      Near Clip Distance: 0.00999999978</span></span>
<span class="line"><span style="color:#adbac7;">      Scale: 10.3141413</span></span>
<span class="line"><span style="color:#adbac7;">      Target Frame: &lt;Fixed Frame&gt;</span></span>
<span class="line"><span style="color:#adbac7;">      Value: TopDownOrtho (rviz)</span></span>
<span class="line"><span style="color:#adbac7;">      X: -19.0468502</span></span>
<span class="line"><span style="color:#adbac7;">      Y: -2.51346016</span></span>
<span class="line"><span style="color:#adbac7;">    Saved: ~</span></span>
<span class="line"><span style="color:#adbac7;">Window Geometry:</span></span>
<span class="line"><span style="color:#adbac7;">  Displays:</span></span>
<span class="line"><span style="color:#adbac7;">    collapsed: false</span></span>
<span class="line"><span style="color:#adbac7;">  Height: 744</span></span>
<span class="line"><span style="color:#adbac7;">  Hide Left Dock: false</span></span>
<span class="line"><span style="color:#adbac7;">  Hide Right Dock: true</span></span>
<span class="line"><span style="color:#adbac7;">  QMainWindow State: 000000ff00000000fd00000004000000000000016a0000025efc0200000008fb0000001200530065006c0065006300740069006f006e00000001e10000009b0000006100fffffffb0000001e0054006f006f006c002000500072006f007000650072007400690065007302000001ed000001df00000185000000a3fb000000120056006900650077007300200054006f006f02000001df000002110000018500000122fb000000200054006f006f006c002000500072006f0070006500720074006900650073003203000002880000011d000002210000017afb000000100044006900730070006c00610079007301000000280000025e000000d700fffffffb0000002000730065006c0065006300740069006f006e00200062007500660066006500720200000138000000aa0000023a00000294fb00000014005700690064006500530074006500720065006f02000000e6000000d2000003ee0000030bfb0000000c004b0069006e0065006300740200000186000001060000030c00000261000000010000010f0000025efc0200000003fb0000001e0054006f006f006c002000500072006f00700065007200740069006500730100000041000000780000000000000000fb0000000a0056006900650077007300000000280000025e000000ad00fffffffb0000001200530065006c0065006300740069006f006e010000025a000000b200000000000000000000000200000490000000a9fc0100000001fb0000000a00560069006500770073030000004e00000080000002e10000019700000003000005150000003efc0100000002fb0000000800540069006d00650100000000000005150000030000fffffffb0000000800540069006d00650100000000000004500000000000000000000003a50000025e00000004000000040000000800000008fc0000000100000002000000010000000a0054006f006f006c00730100000000ffffffff0000000000000000</span></span>
<span class="line"><span style="color:#adbac7;">  Selection:</span></span>
<span class="line"><span style="color:#adbac7;">    collapsed: false</span></span>
<span class="line"><span style="color:#adbac7;">  Time:</span></span>
<span class="line"><span style="color:#adbac7;">    collapsed: false</span></span>
<span class="line"><span style="color:#adbac7;">  Tool Properties:</span></span>
<span class="line"><span style="color:#adbac7;">    collapsed: false</span></span>
<span class="line"><span style="color:#adbac7;">  Views:</span></span>
<span class="line"><span style="color:#adbac7;">    collapsed: true</span></span>
<span class="line"><span style="color:#adbac7;">  Width: 1301</span></span>
<span class="line"><span style="color:#adbac7;">  X: 65</span></span>
<span class="line"><span style="color:#adbac7;">  Y: 24</span></span></code></pre><pre class="shiki github-light has-diff vp-code-light"><code><span class="line"><span style="color:#24292e;">Panels:</span></span>
<span class="line"><span style="color:#24292e;">  - Class: rviz/Displays</span></span>
<span class="line"><span style="color:#24292e;">    Help Height: 78</span></span>
<span class="line"><span style="color:#24292e;">    Name: Displays</span></span>
<span class="line"><span style="color:#24292e;">    Property Tree Widget:</span></span>
<span class="line"><span style="color:#24292e;">      Expanded: ~</span></span>
<span class="line"><span style="color:#24292e;">      Splitter Ratio: 0.544444442</span></span>
<span class="line"><span style="color:#24292e;">    Tree Height: 463</span></span>
<span class="line"><span style="color:#24292e;">  - Class: rviz/Selection</span></span>
<span class="line"><span style="color:#24292e;">    Name: Selection</span></span>
<span class="line"><span style="color:#24292e;">  - Class: rviz/Tool Properties</span></span>
<span class="line"><span style="color:#24292e;">    Expanded:</span></span>
<span class="line"><span style="color:#24292e;">      - /2D Pose Estimate1</span></span>
<span class="line"><span style="color:#24292e;">      - /2D Nav Goal1</span></span>
<span class="line"><span style="color:#24292e;">      - /Publish Point1</span></span>
<span class="line"><span style="color:#24292e;">    Name: Tool Properties</span></span>
<span class="line"><span style="color:#24292e;">    Splitter Ratio: 0.588679016</span></span>
<span class="line"><span style="color:#24292e;">  - Class: rviz/Views</span></span>
<span class="line"><span style="color:#24292e;">    Expanded:</span></span>
<span class="line"><span style="color:#24292e;">      - /Current View1</span></span>
<span class="line"><span style="color:#24292e;">    Name: Views</span></span>
<span class="line"><span style="color:#24292e;">    Splitter Ratio: 0.5</span></span>
<span class="line"><span style="color:#24292e;">  - Class: rviz/Time</span></span>
<span class="line"><span style="color:#24292e;">    Experimental: false</span></span>
<span class="line"><span style="color:#24292e;">    Name: Time</span></span>
<span class="line"><span style="color:#24292e;">    SyncMode: 0</span></span>
<span class="line"><span style="color:#24292e;">    SyncSource: PointCloud2</span></span>
<span class="line"><span style="color:#24292e;">Toolbars:</span></span>
<span class="line"><span style="color:#24292e;">  toolButtonStyle: 2</span></span>
<span class="line"><span style="color:#24292e;">Visualization Manager:</span></span>
<span class="line"><span style="color:#24292e;">  Class: &quot;&quot;</span></span>
<span class="line"><span style="color:#24292e;">  Displays:</span></span>
<span class="line"><span style="color:#24292e;">    - Alpha: 0.5</span></span>
<span class="line"><span style="color:#24292e;">      Cell Size: 5</span></span>
<span class="line"><span style="color:#24292e;">      Class: rviz/Grid</span></span>
<span class="line"><span style="color:#24292e;">      Color: 160; 160; 164</span></span>
<span class="line"><span style="color:#24292e;">      Enabled: true</span></span>
<span class="line"><span style="color:#24292e;">      Line Style:</span></span>
<span class="line"><span style="color:#24292e;">        Line Width: 0.0299999993</span></span>
<span class="line"><span style="color:#24292e;">        Value: Lines</span></span>
<span class="line"><span style="color:#24292e;">      Name: Grid</span></span>
<span class="line"><span style="color:#24292e;">      Normal Cell Count: 0</span></span>
<span class="line"><span style="color:#24292e;">      Offset:</span></span>
<span class="line"><span style="color:#24292e;">        X: 0</span></span>
<span class="line"><span style="color:#24292e;">        Y: 0</span></span>
<span class="line"><span style="color:#24292e;">        Z: 0</span></span>
<span class="line"><span style="color:#24292e;">      Plane: XY</span></span>
<span class="line"><span style="color:#24292e;">      Plane Cell Count: 100</span></span>
<span class="line"><span style="color:#24292e;">      Reference Frame: &lt;Fixed Frame&gt;</span></span>
<span class="line"><span style="color:#24292e;">      Value: true</span></span>
<span class="line"><span style="color:#24292e;">    - Class: rviz/TF</span></span>
<span class="line"><span style="color:#24292e;">      Enabled: true</span></span>
<span class="line"><span style="color:#24292e;">      Frame Timeout: 15</span></span>
<span class="line"><span style="color:#24292e;">      Frames:</span></span>
<span class="line"><span style="color:#24292e;">        All Enabled: true</span></span>
<span class="line"><span style="color:#24292e;">        GPS_back_link:</span></span>
<span class="line"><span style="color:#24292e;">          Value: true</span></span>
<span class="line"><span style="color:#24292e;">        GPS_front_link:</span></span>
<span class="line"><span style="color:#24292e;">          Value: true</span></span>
<span class="line"><span style="color:#24292e;">        base_link:</span></span>
<span class="line"><span style="color:#24292e;">          Value: true</span></span>
<span class="line"><span style="color:#24292e;">        footprint:</span></span>
<span class="line"><span style="color:#24292e;">          Value: true</span></span>
<span class="line"><span style="color:#24292e;">        front_laser_link:</span></span>
<span class="line"><span style="color:#24292e;">          Value: true</span></span>
<span class="line"><span style="color:#24292e;">        imu_link:</span></span>
<span class="line"><span style="color:#24292e;">          Value: true</span></span>
<span class="line"><span style="color:#24292e;">        map:</span></span>
<span class="line"><span style="color:#24292e;">          Value: true</span></span>
<span class="line"><span style="color:#24292e;">      Marker Scale: 1</span></span>
<span class="line"><span style="color:#24292e;">      Name: TF</span></span>
<span class="line"><span style="color:#24292e;">      Show Arrows: true</span></span>
<span class="line"><span style="color:#24292e;">      Show Axes: true</span></span>
<span class="line"><span style="color:#24292e;">      Show Names: true</span></span>
<span class="line"><span style="color:#24292e;">      Tree:</span></span>
<span class="line"><span style="color:#24292e;">        map:</span></span>
<span class="line"><span style="color:#24292e;">          footprint:</span></span>
<span class="line"><span style="color:#24292e;">            base_link:</span></span>
<span class="line"><span style="color:#24292e;">              GPS_back_link:</span></span>
<span class="line"><span style="color:#24292e;">                {}</span></span>
<span class="line"><span style="color:#24292e;">              GPS_front_link:</span></span>
<span class="line"><span style="color:#24292e;">                {}</span></span>
<span class="line"><span style="color:#24292e;">              front_laser_link:</span></span>
<span class="line"><span style="color:#24292e;">                {}</span></span>
<span class="line"><span style="color:#24292e;">              imu_link:</span></span>
<span class="line"><span style="color:#24292e;">                {}</span></span>
<span class="line"><span style="color:#24292e;">      Update Interval: 0</span></span>
<span class="line"><span style="color:#24292e;">      Value: true</span></span>
<span class="line"><span style="color:#24292e;">    - Class: Submaps</span></span>
<span class="line"><span style="color:#24292e;">      Enabled: true</span></span>
<span class="line"><span style="color:#24292e;">      Fade-out distance: 1</span></span>
<span class="line"><span style="color:#24292e;">      High Resolution: true</span></span>
<span class="line"><span style="color:#24292e;">      Low Resolution: false</span></span>
<span class="line"><span style="color:#24292e;">      Name: Submaps</span></span>
<span class="line"><span style="color:#24292e;">      Submap query service: /submap_query</span></span>
<span class="line"><span style="color:#24292e;">      Submaps:</span></span>
<span class="line"><span style="color:#24292e;">        All: true</span></span>
<span class="line"><span style="color:#24292e;">        All Submap Pose Markers: true</span></span>
<span class="line"><span style="color:#24292e;">        Trajectory 0:</span></span>
<span class="line"><span style="color:#24292e;">          0.160: true</span></span>
<span class="line"><span style="color:#24292e;">          1.160: true</span></span>
<span class="line"><span style="color:#24292e;">          10.156: true</span></span>
<span class="line"><span style="color:#24292e;">          11.76: true</span></span>
<span class="line"><span style="color:#24292e;">          2.160: true</span></span>
<span class="line"><span style="color:#24292e;">          3.160: true</span></span>
<span class="line"><span style="color:#24292e;">          4.160: true</span></span>
<span class="line"><span style="color:#24292e;">          5.160: true</span></span>
<span class="line"><span style="color:#24292e;">          6.160: true</span></span>
<span class="line"><span style="color:#24292e;">          7.160: true</span></span>
<span class="line"><span style="color:#24292e;">          8.160: true</span></span>
<span class="line"><span style="color:#24292e;">          9.160: true</span></span>
<span class="line"><span style="color:#24292e;">          Submap Pose Markers: true</span></span>
<span class="line"><span style="color:#24292e;">          Value: true</span></span>
<span class="line"><span style="color:#24292e;">      Topic: /submap_list</span></span>
<span class="line"><span style="color:#24292e;">      Tracking frame: base_link</span></span>
<span class="line"><span style="color:#24292e;">      Unreliable: false</span></span>
<span class="line"><span style="color:#24292e;">      Value: true</span></span>
<span class="line"><span style="color:#24292e;">    - Alpha: 1</span></span>
<span class="line"><span style="color:#24292e;">      Autocompute Intensity Bounds: true</span></span>
<span class="line"><span style="color:#24292e;">      Autocompute Value Bounds:</span></span>
<span class="line"><span style="color:#24292e;">        Max Value: 10</span></span>
<span class="line"><span style="color:#24292e;">        Min Value: -10</span></span>
<span class="line"><span style="color:#24292e;">        Value: true</span></span>
<span class="line"><span style="color:#24292e;">      Axis: Z</span></span>
<span class="line"><span style="color:#24292e;">      Channel Name: intensity</span></span>
<span class="line"><span style="color:#24292e;">      Class: rviz/PointCloud2</span></span>
<span class="line"><span style="color:#24292e;">      Color: 0; 255; 0</span></span>
<span class="line"><span style="color:#24292e;">      Color Transformer: FlatColor</span></span>
<span class="line"><span style="color:#24292e;">      Decay Time: 0</span></span>
<span class="line"><span style="color:#24292e;">      Enabled: true</span></span>
<span class="line"><span style="color:#24292e;">      Invert Rainbow: false</span></span>
<span class="line"><span style="color:#24292e;">      Max Color: 255; 255; 255</span></span>
<span class="line"><span style="color:#24292e;">      Max Intensity: 4096</span></span>
<span class="line"><span style="color:#24292e;">      Min Color: 0; 0; 0</span></span>
<span class="line"><span style="color:#24292e;">      Min Intensity: 0</span></span>
<span class="line"><span style="color:#24292e;">      Name: PointCloud2</span></span>
<span class="line"><span style="color:#24292e;">      Position Transformer: XYZ</span></span>
<span class="line"><span style="color:#24292e;">      Queue Size: 10</span></span>
<span class="line"><span style="color:#24292e;">      Selectable: true</span></span>
<span class="line"><span style="color:#24292e;">      Size (Pixels): 3</span></span>
<span class="line"><span style="color:#24292e;">      Size (m): 0.0500000007</span></span>
<span class="line"><span style="color:#24292e;">      Style: Flat Squares</span></span>
<span class="line"><span style="color:#24292e;">      Topic: /scan_matched_points2</span></span>
<span class="line"><span style="color:#24292e;">      Unreliable: false</span></span>
<span class="line"><span style="color:#24292e;">      Use Fixed Frame: true</span></span>
<span class="line"><span style="color:#24292e;">      Use rainbow: true</span></span>
<span class="line"><span style="color:#24292e;">      Value: true</span></span>
<span class="line"><span style="color:#24292e;">    - Class: rviz/MarkerArray</span></span>
<span class="line"><span style="color:#24292e;">      Enabled: true</span></span>
<span class="line"><span style="color:#24292e;">      Marker Topic: /trajectory_node_list</span></span>
<span class="line"><span style="color:#24292e;">      Name: Trajectories</span></span>
<span class="line"><span style="color:#24292e;">      Namespaces:</span></span>
<span class="line"><span style="color:#24292e;">        Trajectory 0: true</span></span>
<span class="line"><span style="color:#24292e;">      Queue Size: 100</span></span>
<span class="line"><span style="color:#24292e;">      Value: true</span></span>
<span class="line"><span style="color:#24292e;">    - Class: rviz/MarkerArray</span></span>
<span class="line"><span style="color:#24292e;">      Enabled: true</span></span>
<span class="line"><span style="color:#24292e;">      Marker Topic: /landmark_poses_list</span></span>
<span class="line"><span style="color:#24292e;">      Name: Landmark Poses</span></span>
<span class="line"><span style="color:#24292e;">      Namespaces:</span></span>
<span class="line"><span style="color:#24292e;">        {}</span></span>
<span class="line"><span style="color:#24292e;">      Queue Size: 100</span></span>
<span class="line"><span style="color:#24292e;">      Value: true</span></span>
<span class="line"><span style="color:#24292e;">    - Class: rviz/MarkerArray</span></span>
<span class="line"><span style="color:#24292e;">      Enabled: true</span></span>
<span class="line"><span style="color:#24292e;">      Marker Topic: /constraint_list</span></span>
<span class="line"><span style="color:#24292e;">      Name: Constraints</span></span>
<span class="line"><span style="color:#24292e;">      Namespaces:</span></span>
<span class="line"><span style="color:#24292e;">        Inter constraints, different trajectories: true</span></span>
<span class="line"><span style="color:#24292e;">        Inter constraints, same trajectory: true</span></span>
<span class="line"><span style="color:#24292e;">        Inter residuals, different trajectories: true</span></span>
<span class="line"><span style="color:#24292e;">        Inter residuals, same trajectory: true</span></span>
<span class="line"><span style="color:#24292e;">        Intra constraints: true</span></span>
<span class="line"><span style="color:#24292e;">        Intra residuals: true</span></span>
<span class="line"><span style="color:#24292e;">      Queue Size: 100</span></span>
<span class="line"><span style="color:#24292e;">      Value: true</span></span>
<span class="line"><span style="color:#24292e;">    - Alpha: 1</span></span>
<span class="line"><span style="color:#24292e;">      Class: rviz/Map</span></span>
<span class="line"><span style="color:#24292e;">      Color Scheme: map</span></span>
<span class="line"><span style="color:#24292e;">      Draw Behind: false</span></span>
<span class="line"><span style="color:#24292e;">      Enabled: false</span></span>
<span class="line"><span style="color:#24292e;">      Name: Map</span></span>
<span class="line"><span style="color:#24292e;">      Topic: /map</span></span>
<span class="line"><span style="color:#24292e;">      Unreliable: false</span></span>
<span class="line"><span style="color:#24292e;">      Use Timestamp: false</span></span>
<span class="line"><span style="color:#24292e;">      Value: false</span></span>
<span class="line"><span style="color:#24292e;">    - Class: rviz/Axes</span></span>
<span class="line"><span style="color:#24292e;">      Enabled: true</span></span>
<span class="line"><span style="color:#24292e;">      Length: 2</span></span>
<span class="line"><span style="color:#24292e;">      Name: Axes</span></span>
<span class="line"><span style="color:#24292e;">      Radius: 0.100000001</span></span>
<span class="line"><span style="color:#24292e;">      Reference Frame: front_laser_link</span></span>
<span class="line"><span style="color:#24292e;">      Value: true</span></span>
<span class="line"><span style="color:#24292e;">  Enabled: true</span></span>
<span class="line"><span style="color:#24292e;">  Global Options:</span></span>
<span class="line"><span style="color:#24292e;">    Background Color: 100; 100; 100</span></span>
<span class="line"><span style="color:#24292e;">    Default Light: true</span></span>
<span class="line"><span style="color:#24292e;">    Fixed Frame: map</span></span>
<span class="line"><span style="color:#24292e;">    Frame Rate: 30</span></span>
<span class="line"><span style="color:#24292e;">  Name: root</span></span>
<span class="line"><span style="color:#24292e;">  Tools:</span></span>
<span class="line"><span style="color:#24292e;">    - Class: rviz/Interact</span></span>
<span class="line"><span style="color:#24292e;">      Hide Inactive Objects: true</span></span>
<span class="line"><span style="color:#24292e;">    - Class: rviz/MoveCamera</span></span>
<span class="line"><span style="color:#24292e;">    - Class: rviz/Select</span></span>
<span class="line"><span style="color:#24292e;">    - Class: rviz/FocusCamera</span></span>
<span class="line"><span style="color:#24292e;">    - Class: rviz/Measure</span></span>
<span class="line"><span style="color:#24292e;">    - Class: rviz/SetInitialPose</span></span>
<span class="line"><span style="color:#24292e;">      Topic: /initialpose</span></span>
<span class="line"><span style="color:#24292e;">    - Class: rviz/SetGoal</span></span>
<span class="line"><span style="color:#24292e;">      Topic: /move_base_simple/goal</span></span>
<span class="line"><span style="color:#24292e;">    - Class: rviz/PublishPoint</span></span>
<span class="line"><span style="color:#24292e;">      Single click: true</span></span>
<span class="line"><span style="color:#24292e;">      Topic: /clicked_point</span></span>
<span class="line"><span style="color:#24292e;">  Value: true</span></span>
<span class="line"><span style="color:#24292e;">  Views:</span></span>
<span class="line"><span style="color:#24292e;">    Current:</span></span>
<span class="line"><span style="color:#24292e;">      Angle: 0.174999982</span></span>
<span class="line"><span style="color:#24292e;">      Class: rviz/TopDownOrtho</span></span>
<span class="line"><span style="color:#24292e;">      Enable Stereo Rendering:</span></span>
<span class="line"><span style="color:#24292e;">        Stereo Eye Separation: 0.0599999987</span></span>
<span class="line"><span style="color:#24292e;">        Stereo Focal Distance: 1</span></span>
<span class="line"><span style="color:#24292e;">        Swap Stereo Eyes: false</span></span>
<span class="line"><span style="color:#24292e;">        Value: false</span></span>
<span class="line"><span style="color:#24292e;">      Invert Z Axis: false</span></span>
<span class="line"><span style="color:#24292e;">      Name: Current View</span></span>
<span class="line"><span style="color:#24292e;">      Near Clip Distance: 0.00999999978</span></span>
<span class="line"><span style="color:#24292e;">      Scale: 10.3141413</span></span>
<span class="line"><span style="color:#24292e;">      Target Frame: &lt;Fixed Frame&gt;</span></span>
<span class="line"><span style="color:#24292e;">      Value: TopDownOrtho (rviz)</span></span>
<span class="line"><span style="color:#24292e;">      X: -19.0468502</span></span>
<span class="line"><span style="color:#24292e;">      Y: -2.51346016</span></span>
<span class="line"><span style="color:#24292e;">    Saved: ~</span></span>
<span class="line"><span style="color:#24292e;">Window Geometry:</span></span>
<span class="line"><span style="color:#24292e;">  Displays:</span></span>
<span class="line"><span style="color:#24292e;">    collapsed: false</span></span>
<span class="line"><span style="color:#24292e;">  Height: 744</span></span>
<span class="line"><span style="color:#24292e;">  Hide Left Dock: false</span></span>
<span class="line"><span style="color:#24292e;">  Hide Right Dock: true</span></span>
<span class="line"><span style="color:#24292e;">  QMainWindow State: 000000ff00000000fd00000004000000000000016a0000025efc0200000008fb0000001200530065006c0065006300740069006f006e00000001e10000009b0000006100fffffffb0000001e0054006f006f006c002000500072006f007000650072007400690065007302000001ed000001df00000185000000a3fb000000120056006900650077007300200054006f006f02000001df000002110000018500000122fb000000200054006f006f006c002000500072006f0070006500720074006900650073003203000002880000011d000002210000017afb000000100044006900730070006c00610079007301000000280000025e000000d700fffffffb0000002000730065006c0065006300740069006f006e00200062007500660066006500720200000138000000aa0000023a00000294fb00000014005700690064006500530074006500720065006f02000000e6000000d2000003ee0000030bfb0000000c004b0069006e0065006300740200000186000001060000030c00000261000000010000010f0000025efc0200000003fb0000001e0054006f006f006c002000500072006f00700065007200740069006500730100000041000000780000000000000000fb0000000a0056006900650077007300000000280000025e000000ad00fffffffb0000001200530065006c0065006300740069006f006e010000025a000000b200000000000000000000000200000490000000a9fc0100000001fb0000000a00560069006500770073030000004e00000080000002e10000019700000003000005150000003efc0100000002fb0000000800540069006d00650100000000000005150000030000fffffffb0000000800540069006d00650100000000000004500000000000000000000003a50000025e00000004000000040000000800000008fc0000000100000002000000010000000a0054006f006f006c00730100000000ffffffff0000000000000000</span></span>
<span class="line"><span style="color:#24292e;">  Selection:</span></span>
<span class="line"><span style="color:#24292e;">    collapsed: false</span></span>
<span class="line"><span style="color:#24292e;">  Time:</span></span>
<span class="line"><span style="color:#24292e;">    collapsed: false</span></span>
<span class="line"><span style="color:#24292e;">  Tool Properties:</span></span>
<span class="line"><span style="color:#24292e;">    collapsed: false</span></span>
<span class="line"><span style="color:#24292e;">  Views:</span></span>
<span class="line"><span style="color:#24292e;">    collapsed: true</span></span>
<span class="line"><span style="color:#24292e;">  Width: 1301</span></span>
<span class="line"><span style="color:#24292e;">  X: 65</span></span>
<span class="line"><span style="color:#24292e;">  Y: 24</span></span></code></pre></div>`,8);function f(s,E,B,F,g,R){const e=c,o=_("ClientOnly");return l(),r("div",null,[m,i(o,null,{default:y(()=>{var a,n;return[(((a=s.$frontmatter)==null?void 0:a.aside)??!0)&&(((n=s.$frontmatter)==null?void 0:n.showArticleMetadata)??!0)?(l(),A(e,{key:0,article:s.$frontmatter},null,8,["article"])):b("",!0)]}),_:1}),D])}const S=t(C,[["render",f]]);export{v as __pageData,S as default};
