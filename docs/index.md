# MOS-9

<div class="ros-hero">
    <p class="ros-hero__eyebrow"></p>
    <h1>开源小尺寸人形足球机器人</h1>
    <p class="ros-hero__lead">
        MOS-9 面向 RoboCup 小型人形足球场景，强调稳定步态、快速感知、可复现控制链路和工程化迭代能力。
    </p>
</div>

## 关于 MOS-9

<div class="ros-blog">
    <article class="ros-post">
        <p class="ros-post__meta">RoboCup / Platform</p>
        <h3>一台为比赛场景设计的开源足球机器人</h3>
        <p>
            MOS-9 的目标不是只完成实验室里的单项动作，而是在 RoboCup 对抗环境中完成持续感知、决策、行走、控球和恢复。整机设计围绕比赛节奏展开，因此机械、电控、通信和控制模块都需要保证实时性与稳定性。
        </p>
    </article>
</div>

## 文档分区

<div class="ros-grid ros-grid--3">
    <div class="ros-card">
        <h3><a href="mechanical/">机械设计</a></h3>
        <p>本体结构、关节自由度、传动、材料与装配流程。</p>
    </div>
    <div class="ros-card">
        <h3><a href="electronics/">电路系统</a></h3>
        <p>供电、主控、驱动、传感器、线束和安全设计。</p>
    </div>
    <div class="ros-card">
        <h3><a href="communication/">通信框架</a></h3>
        <p>节点关系、消息定义、Topic 设计和时间同步。</p>
    </div>
    <div class="ros-card">
        <h3><a href="control/">运动控制</a></h3>
        <p>运动学、动力学、状态机、步态和技能控制。</p>
    </div>
    <div class="ros-card">
        <h3><a href="simulation/">仿真与模型</a></h3>
        <p>URDF、XML、USD、资源组织和 sim-to-real 迁移。</p>
    </div>
    <div class="ros-card">
        <h3><a href="tutorials/">教程</a></h3>
        <p>从 bringup 到策略训练与部署的实践路径。</p>
    </div>
</div>
