# 环境配置与测试

本页用于说明开发所需依赖、工具链和测试说明。

## 环境配置
工作站采用的环境是Ubuntu22.04，IsaacSim 5.0.0, IsaacLab 2.2.0。

主板的环境是Orin AGX Ubuntu22.04，因为不依赖ROS2等，所以主板环境并不受限制，可以换其他主板或者其他版本Ubuntu系统。

## 测试工具
每一个代码仓库里都有测试代码，比如deploy的仓库里有很多测试代码，都是为Sim2Real服务的。

deploy 仓库里常用的测试、验证和分析脚本主要在 scripts 目录：

### 真机电机与姿态检查
- scripts/mos9_motor_connectivity_init_test.py：用于只初始化 encos-driver 并读取一次全部电机状态，快速检查电机数量、通信链路和基础反馈是否正常。
- scripts/test_all_motors.py：用于在真实硬件上回放参考关节轨迹并记录位置、速度和力矩数据，验证整机多电机联调效果并输出测试图表。
- scripts/test_single_motor.py：用于初始化单电机测试环境并预留单电机位置指令实验入口，便于后续做单关节连线与控制调试。
- scripts/mos9_all_zero_slow.py：用于以较小增益和缓慢轨迹把全部电机回到零位，方便整机上电后的安全复位。
- scripts/mos9_init_pose.py：用于把机器人缓慢移动到站立初始姿态，作为部署或测试前的统一准备动作。
- scripts/mos9_set_zero_by_joint.py：用于按关节名单独设置编码器零位，便于装配后校零和单关节误差修正。

### Sim2Real 与策略回放
- scripts/mos9_sim2real_bridge.py：用于把 MuJoCo 轨迹命令转发到真机并记录真机与仿真差异，是基础的 Sim2Real 回放桥接脚本。
- scripts/mos9_sim2real_bridge_with_imu.py：用于在 Sim2Real 轨迹回放时同步记录和滤波 IMU 数据，便于联合分析关节响应与机身姿态。
- scripts/mos9_amp_deploy.py：用于在真机上闭环部署 AMP 的 ONNX 策略，并结合 IMU 反馈进行整机控制测试。
- scripts/mos9_mimic_deploy.py：用于在真机上闭环部署 Mimic 的 ONNX 策略，并记录部署过程中的策略输入输出与电机数据。
- scripts/mos9_amp_sim2sim_mujoco.py：用于在 MuJoCo 中回放 AMP 策略并测试不同速度指令下的仿真行为，是上真机前的 sim2sim 验证脚本。
- scripts/mos9_hanging_action_replay_mujoco.py：用于在 MuJoCo 吊挂场景中直接回放离线动作序列，检查动作数据本身是否稳定可执行。
- scripts/mos9_hanging_joint_test_mujoco.py：用于在 MuJoCo 吊挂场景中不经过策略、直接测试关节 PD 控制和参考轨迹跟踪效果。
- scripts/mos9_hanging_policy_test_mujoco.py：用于在 MuJoCo 吊挂场景中运行 ONNX 策略，检查策略在受限条件下的输出稳定性和可执行性。

### IMU 与观测分析
- scripts/imu_real_only_plot.py：用于从 IPC 读取真机 IMU 数据并对不同截止频率的滤波结果作图，比较姿态与角速度信号质量。
- scripts/imu_sim.py：用于在 MuJoCo 中模拟 IMU 姿态对齐过程，验证坐标系、四元数和角速度变换是否正确。
- scripts/imu_sim_with_real.py：用于把真机 IPC 的 IMU 数据接入 MuJoCo 对比仿真 IMU，检查实际传感器与仿真模型的一致性。
- scripts/analyze_action_imu_correlation.py：用于分析策略动作与 IMU 欧拉角、角速度之间的相关性，定位动作和机身姿态耦合关系。
- scripts/analyze_action_jump_obs_contrib.py：用于分析策略动作突变时哪些观测维度贡献最大，帮助排查观测设计或传感器噪声问题。

### 电机系统辨识与日志处理
- scripts/estimate_motor_delay.py：用于从部署日志中估计电机响应延迟，帮助标定控制回路中的时延参数。
- scripts/identify_kp_kd_from_npz.py：用于从 Sim2Real 或部署日志里拟合各关节的 kp 和 kd，评估真机电机控制器与仿真参数的一致性。
- scripts/sysid_chirp.py：用于给单电机生成线性扫频激励的系统辨识测试入口，便于采集频响数据做控制参数辨识。
- scripts/mos9_fk_npz.py：用于在 Isaac Sim 中回放动作 npz 并导出仿真状态日志，验证动作数据和模型运动学是否匹配。
- scripts/replay_mos9_fk_motion.py：用于在 Isaac Sim 中可视化回放 FK 动作 npz，快速人工检查动作序列是否合理。

