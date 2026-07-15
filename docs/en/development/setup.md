# Environment Setup and Testing

This page explains the dependencies, toolchain, and testing notes required for development.

## Environment Setup

The workstation environment uses Ubuntu 22.04, Isaac Sim 5.0.0, and Isaac Lab 2.2.0.

The mainboard environment is Orin AGX running Ubuntu 22.04. Since the system does not depend on ROS2 and similar middleware, the mainboard environment is not heavily constrained. Other mainboards or other Ubuntu versions can also be used.

## Testing Tools

Each code repository contains test code. For example, the deploy repository includes many test scripts, all of which are designed to support Sim2Real work.

In the deploy repository, the commonly used testing, validation, and analysis scripts are mainly located in the scripts directory:

### Real-Robot Motor and Posture Checks
- scripts/mos9_motor_connectivity_init_test.py: initializes only encos-driver and reads the status of all motors once, allowing a quick check of motor count, communication links, and basic feedback.
- scripts/test_all_motors.py: replays reference joint trajectories on real hardware and records position, velocity, and torque data, validating multi-motor integration on the whole robot and producing test plots.
- scripts/test_single_motor.py: initializes the single-motor test environment and provides an entry point for single-motor position command experiments, which is convenient for later wiring and control debugging of individual joints.
- scripts/mos9_all_zero_slow.py: returns all motors to zero position using low gains and a slow trajectory, providing a safe reset after power-on.
- scripts/mos9_init_pose.py: moves the robot slowly into its standing initial pose as a standard preparation step before deployment or testing.
- scripts/mos9_set_zero_by_joint.py: sets encoder zero positions joint by joint according to a joint list, which is convenient for post-assembly zeroing and single-joint error correction.

### Sim2Real and Policy Replay
- scripts/mos9_sim2real_bridge.py: forwards MuJoCo trajectory commands to the real robot and records differences between the real robot and simulation; it is the basic Sim2Real replay bridge script.
- scripts/mos9_sim2real_bridge_with_imu.py: records and filters IMU data during Sim2Real trajectory replay, making it easier to analyze joint response together with body posture.
- scripts/mos9_amp_deploy.py: deploys the AMP ONNX policy in closed loop on the real robot and combines it with IMU feedback for full-robot control testing.
- scripts/mos9_mimic_deploy.py: deploys the Mimic ONNX policy in closed loop on the real robot and records policy inputs and outputs together with motor data during deployment.
- scripts/mos9_amp_sim2sim_mujoco.py: replays the AMP policy in MuJoCo and tests simulated behavior under different velocity commands; it is a sim2sim validation script before real-robot deployment.
- scripts/mos9_hanging_action_replay_mujoco.py: directly replays offline action sequences in a hanging MuJoCo setup to check whether the action data itself is stable and executable.
- scripts/mos9_hanging_joint_test_mujoco.py: tests joint PD control and reference trajectory tracking directly in a hanging MuJoCo setup, without using a policy.
- scripts/mos9_hanging_policy_test_mujoco.py: runs an ONNX policy in a hanging MuJoCo setup to check output stability and executability under constrained conditions.

### IMU and Observation Analysis
- scripts/imu_real_only_plot.py: reads real-robot IMU data from IPC and plots filtered results with different cutoff frequencies to compare the quality of posture and angular-velocity signals.
- scripts/imu_sim.py: simulates IMU alignment in MuJoCo and validates coordinate frames, quaternions, and angular-velocity transformations.
- scripts/imu_sim_with_real.py: feeds real-robot IMU data from IPC into MuJoCo for comparison with simulated IMU data, checking consistency between the actual sensor and the simulation model.
- scripts/analyze_action_imu_correlation.py: analyzes the correlation between policy actions and IMU Euler angles and angular velocities, helping identify coupling between actions and body posture.
- scripts/analyze_action_jump_obs_contrib.py: analyzes which observation dimensions contribute most when policy actions jump suddenly, helping diagnose observation design problems or sensor-noise issues.

### Motor System Identification and Log Processing
- scripts/estimate_motor_delay.py: estimates motor response delay from deployment logs, helping calibrate delay parameters in the control loop.
- scripts/identify_kp_kd_from_npz.py: fits kp and kd for each joint from Sim2Real or deployment logs, evaluating consistency between the real motor controller and the simulation parameters.
- scripts/sysid_chirp.py: provides a system-identification test entry for a single motor using linear chirp excitation, making it easier to collect frequency-response data for control parameter identification.
- scripts/mos9_fk_npz.py: replays action npz files in Isaac Sim and exports simulation state logs, verifying that action data matches model kinematics.
- scripts/replay_mos9_fk_motion.py: visualizes FK action npz replay in Isaac Sim, allowing quick manual inspection of whether the motion sequence is reasonable.
