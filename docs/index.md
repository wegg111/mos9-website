# MOS-9 开源文档

MOS-9 是面向 RoboCup 人形足球场景的开源机器人项目。本文档围绕一台机器人从设计到落地的完整链路展开：

- 机械与电气设计
- 电机与进程间通信
- 仿真模型与动作数据
- 运动控制与 Sim2Real
- 开发环境与测试验证

## 文档结构速览

- [项目背景](robocup_intro.md)：RoboCup 赛事背景、团队经历与项目定位。
- [系统总览](overview/architecture.md)：机器人整体软硬件架构。
- [机械设计](mechanical/index.md)：构型设计、电机选型、结构设计、材料加工与装配。
- [电气系统](electronics/index.md)：电路设计与 PCB 制作流程。
- [通信系统](communication/index.md)：电机 CAN 通信、进程间通信与 Robot IPC 框架。
- [仿真模型与数据](simulation/index.md)：仿真模型构建、文件格式转换与动作数据处理。
- [运动控制](control/index.md)：优化控制、强化学习、AMP/Mimic、系统辨识与 Sim2Real。
- [开发指南](development/setup.md)：环境搭建、测试工具与验证脚本。
- [FAQ](faq/index.md)：常见问题汇总。
- [结语](conclusion.md)

## 适用人群

- 机器人初学者：可以按阅读路径快速建立系统工程认知。
- 研究与竞赛团队：可以复用通信、仿真、控制与测试流程。
- 工程开发者：可以参考文档中的模块拆分与实机验证方法。
