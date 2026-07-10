# 电机选型
本节介绍机器人SimuLink动力学仿真以及电机选型

## 机器人SimuLink仿真
实际上如果想确定机器人行走时各个关节力矩，需要把机器人连杆设计好了之后，或者大概确定质量，并且设计好算法之后部署到机器人仿真中才能得到电机力矩，但矛盾的是你需要在设计机械之前就确定好电机选型，并且估算出来电机力矩。但行走的力矩计算比较复杂，所以我们考虑在确定机器人之后通过构建抽象仿真的方式来估算电机力矩。

MathWorks 曾开源一个 MATLAB/Simulink 项目[msra-walking-robot](https://github.com/mathworks-robotics/msra-walking-robot
)，在SimuLink中先构建电机控制器，然后串成一个机器人。这个机器人是一个刚体连两个6自由度腿，刚好符合我们机器人构型需求，所以我们对其参数进行修改，然后写一个ZMP的开环步态，让机器人行走，虽然走的不是很稳定，但是力矩足够作为参考。我们修改后的仓库在[MOS-MatLab-Simulation](https://github.com/THMOS2025/MOS-MatLab-Simulation)。


<figure class="ros-figure ros-figure--narrow">
    <img src="../../images/simulink.png" alt="simulink" />
    <figcaption>Simulink模型</figcaption>
</figure>

<figure class="ros-figure ros-figure--narrow">
    <img src="../../images/robot_walk.gif" alt="robot_walk" />
    <figcaption>Simulink 机器人行走</figcaption>
</figure>

执行完轨迹之后得到如下力矩图，6根曲线代表左腿6个关节力矩，截取其中一个周期获得的数据图。可以得到一些结论：knee pitch关节力矩是最大的，峰值越40Nm；在受到地面冲击时hip（roll、pitch）关节可能会受到大力矩；常规行走踝关节力矩在20Nm范围内，可以使用串联小电机。

<figure class="ros-figure ros-figure--narrow">
    <img src="../../images/motor_torque.png" alt="motor_torque" />
    <figcaption>机器人行走关节力矩图</figcaption>
</figure>

## 电机选型
由此我们可以在市面上电机进行选型，我们最后选择因克斯（ENCOS）的电机，因克斯电机在很多人形机器人上都应用过，所以使用因克斯的电机能够满足我们的要求。4310是小电机，峰值力矩36Nm，用于头部、手臂等部位；6408是大电机，峰值力矩60Nm，用于腿部。

<div class="ros-gallery ros-gallery--pair">
    <figure class="ros-figure ros-figure--paired">
        <img class="ros-image--full" src="../../images/4310.png" alt="4310" />
        <figcaption>4310电机</figcaption>
    </figure>
    <figure class="ros-figure ros-figure--paired">
        <img class="ros-image--full" src="../../images/6408.png" alt="6408" />
        <figcaption>6408电机</figcaption>
    </figure>
</div>

最后各关节电机分布如图所示：

<figure class="ros-figure">
    <img src="../../images/motor_selection.png" alt="motor_selection" />
    <figcaption>机器人关节电机分布</figcaption>
</figure>


