# 机器人构型设计

本页用于说明人形机器人构型选型及整体设计。

## 人形机器人

在具体讲构型与选型之前，我们先看看各种各样的人形机器人。

在第一章项目背景时我们介绍了RoboCup一些机器人，实际上图片中的机器人就已经能表现出人形机器人三个时代的特征。人形机器人发展大致可以分为三个时间段，每个时代有其代表的控制算法。2015年以前都是用ZMP控制器，代表的机器人有NAO、Asimo，以及MOS8一类的舵机机器人都是这个时代的产物。15年到22年大多都采用优化控制器，代表的是波士顿动力Atlas，以及DARPA挑战赛的各种机器人。23年及以后采用强化学习控制器的机器人不断涌现，并且性能还在不断提升，代表的就是宇树机器人G1。


### ZMP时期
2015 年以前的人形机器人主要采用 ZMP + 线性倒立摆模型（LIPM） 的控制框架。ZMP（Zero Moment Point）即零力矩点，指人或机器人在站立或行走时，若要保持动态平衡，脚底某个点除垂直方向外合力矩为零。通过步态规划将 ZMP 始终约束在脚底支撑区域内，机器人就能实现稳定行走。

<figure class="ros-figure">
    <img src="../../images/zmp.png" alt="zmp" />
    <figcaption>ZMP+LIPM控制框架[1]</figcaption>
</figure>

为了保证 ZMP 更容易落在支撑区域内，这一时期机器人的脚底板通常做得较大，缺点是移动不够灵活。ZMP 方法的局限在于依赖平整、刚性的接触面，难以适应松软、滑动或复杂未知地形。由于ZMP的动态性能并不强，而且大多基于位置控制驱动器，所以在驱动器选型上大多机器人都采用舵机。

<figure class="ros-figure">
    <img src="../../images/zmp_robot.png" alt="zmp_robot" />
    <figcaption>ZMP时期的机器人设计</figcaption>
</figure>
<figure class="ros-figure">
    <img src="../../images/asimo.png" alt="asimo" />
    <figcaption>Asimo机器人（1986 - 2015）</figcaption>
</figure>


### 优化控制时期

在2013年，波士顿动力Atlas横空出世，2017年Atlas能做出空翻动作惊艳世人。Atlas使用的是优化控制的方案，优化控制核心难点在于建模，因为机器人模型一般是复杂的非线性方程，用MPC（Model Predictive Control）滚动优化非常吃算力，所以有很多简化的方案，比如单刚体模型、简化全身动力学模型。MPC通常作为规划器计算期望足底力或者期望轨迹，再接一个WBC（Whole Body Control）的优化器，通过完整动力学公式约束来计算关节力矩。总之方案多种多样，但其核心区别主要体现在模型的选择和优化问题的构建与求解方式上。

在Youtube上可以看Atlas的方案讲解：[波士顿动力控制方案talk](https://www.youtube.com/watch?v=LzmQTf4ODKI&t=348s)。

<figure class="ros-figure">
    <img src="../../images/boston_dynamics.png" alt="boston_dynamics" />
    <figcaption>波士顿动力控制方案</figcaption>
</figure>

这一段时间的机器人有很多种，比如RoMeLa实验室的ARTEMIS，Cassie机器人，以及DARPA挑战赛中的很多机器人。可以看到这些机器人和之前的有很多区别，比如有些设计会把膝关节电机放在髋部，通过连杆连接膝关节轴承，这样做的好处是可以减小腿部转动惯量，能让行走运动更灵活，另外一点是可以方便简化建模，因为这样可以在简化动力学模型中忽略掉腿部质量，好解优化问题；以及足底设计有些机器人会采用“线”足，是因为这样可以简化足底约束，同样是好解优化问题。在ARTEMIS，Cassie这两点会有明显体现。另外由于优化控制很多最后输出的控制量是关节力矩，所以机器人都使用伺服电机作为驱动器。
<figure class="ros-figure">
    <img src="../../images/optimal_robot.png" alt="optimal_robot" />
    <figcaption>采用优化控制方案的机器人</figcaption>
</figure>

### 强化学习时期
在23年人形机器人强化学习开始火起来，越来越多的机器人开始在仿真器当中训练。仿真器每次都使用完整的刚体动力学公式进行迭代，机器人在仿真器中不断学习，可以学到完整动力学模型的动态性质，以及适应不同地形、外界干扰，弥补了优化控制方案中要采用简化动力学模型、无法观测外力、无法引入地形的缺点。由于机器人构型不再受建模约束，所以采用强化学习控制器的机器人在设计构型时只需满足基本的自由度要求，剩下更多考虑的是结构稳定性以及关节性能要求。关于驱动器，因为真机需要和仿真动态性能一致，所以机器人关节都采用伺服电机，使用和仿真一样的PD位置控制器。

<figure class="ros-figure">
    <img src="../../images/robots_rl.png" alt="robots_rl" />
    <figcaption>多种人形机器人</figcaption>
</figure>


## 构型设计
上面看了很多机器人，你会发现实际上机器人本体设计和驱动器、控制算法关联非常强。算法从ZMP->优化控制->强化学习，对于驱动器的要求是舵机->伺服电机力控->伺服电机位控，对于足底设计要求是大脚掌->线型脚->类人脚掌。所以在设计之初就需要对构型、驱动器、控制器进行综合考虑。

MOS9希望采用强化学习控制器，则需要选择能进行位控的伺服电机，构型上和大多数机器人一样采用6自由度腿部构型，由于机器人需要跌倒爬起，手臂需要有3自由度，头部需要能够环视足球场，则头部需要2自由度。

### 腿部构型
大腿构型有一些选择，但是在自由度分布上都区别不大，大家的选择都是髋关节3自由度，膝盖1自由度，踝关节2自由度。人体腿部是7自由度，踝关节3自由度，在经验上踝关节少一个自由度也够用，所以基本上都采用6自由度方案。

髋关节3自由度的区别在于排布方案，即roll、pitch、yaw的旋转顺序，这个在动力学性质上区别不大，只要关节活动空间合适即可。膝关节一般有两种方案，比如（a）方案中将膝关节电机放在髋部，通过连杆连接膝关节，另一种比如（b）是直接将膝关节放在膝盖，在动力学上（a）方案腿部惯量小一些，但是在机械上引入了更多的结构，两种方案都不错，如果想跑得快就用（a），比如机器人马拉松赛的冠军荣耀机器人采用这个方案，宇树的H1同理。如果想有综合性能以及更好的稳定性，则选用（b）方案。MOS9选用（b）方案。

<figure class="ros-figure">
    <img src="../../images/thigh.png" alt="thigh" />
    <figcaption>大腿构型</figcaption>
</figure>

另外一个是小腿构型，很多公司采用（c）构型，考虑是这样脚踝活动会更灵活，但是引入了连杆机构，但对于公司来说这个机构不是很复杂，所以优先考虑性能。但对于我们来说更希望简单一点，（a）构型虽然脚踝略显臃肿，但活动空间以及动力学性能不会差太多，并且26年波士顿动力新Atlas采用的也是这个构型，所以（a）也是权衡之选。

<figure class="ros-figure">
    <img src="../../images/calf.png" alt="calf" />
    <figcaption>小腿构型</figcaption>
</figure>

### 头部手臂构型
头部由于需要观察球场，则需要有偏航（yaw）和俯仰（pitch）自由度。手臂由于需要跌到爬起，我们选择肩膀2自由度，手肘1自由度。
<figure class="ros-figure">
    <img src="../../images/head_arm.png" alt="head_arm" />
    <figcaption>头部、手臂构型</figcaption>
</figure>


再把整机的图片拿过来，可以观察一下自由度分布。另外前面有很多张机器人图片，可以观察一下其他机器人自由度是怎么排布的。
<div class="ros-gallery ros-gallery--pair ros-gallery--pair-full">
    <figure class="ros-figure ros-figure--paired">
        <img class="ros-image--full" src="../../robocup_image/mos92front.JPG" alt="mos92 front" />
        <figcaption>mos9.2 正面</figcaption>
    </figure>
    <figure class="ros-figure ros-figure--paired">
        <img class="ros-image--full" src="../../robocup_image/mos92back.JPG" alt="mos92 back" />
        <figcaption>mos9.2 背面</figcaption>
    </figure>
</div>



## 参考文献

[1]Kajita, Shuuji & Hirukawa, Hirohisa & Harada, Kensuke & Yokoi, Kazuhito. (2014). Introduction to Humanoid Robotics. 10.1007/978-3-642-54536-8. 

[2]Ficht, G., & Behnke, S. (2021). Bipedal humanoid hardware design: A technology review. Current Robotics Reports, 2(2), 201-210.

