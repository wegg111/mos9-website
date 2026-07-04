# 快速开始

本页帮助你快速理解并运行整个机器人系统。

## 你将完成什么

- 了解文档结构
- 配置本地开发环境
- 跑通最小示例
- 找到后续阅读路径

## 前置知识

建议你至少具备以下基础之一：

- 机器人学基础
- Linux / Python 基础
- 控制理论基础
- 仿真环境使用经验

## 推荐阅读顺序

1. [系统总体架构](overview/architecture.md)
2. [仓库结构](overview/repo-structure.md)
3. [环境配置](development/setup.md)
4. [从零启动系统](tutorials/bringup.md)

## 模块速览

| 模块 | 内容 |
|---|---|
| 机械设计 | 本体结构、关节、传动、材料、装配 |
| 电路系统 | 供电、主控、传感器、驱动、安全 |
| 通信框架 | 消息传输、节点关系、时间同步 |
| 运动控制 | 运动学、动力学、状态机、步态、技能 |
| 仿真与模型 | URDF、XML、USD、资源组织、Sim-to-Real |

## 最小命令示例

```bash
git clone https://github.com/yourname/open-robot-docs.git
cd open-robot-docs
```

!!! tip "提示"
    如果你还没有真正的机器人代码仓库，这个文档仓库可以先独立存在。