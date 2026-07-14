# 电机系统辨识
本节讲解电机控制环以及电机系统辨识。

## 电机控制器
因为我们使用强化学习控制器，控制器的表现取决于真机和仿真动态特性是否一致。最影响Sim2Real Gap的就是电机动态特性。所以我们在上policy之前要处理好电机的控制器。

伺服电机控制器一般有不同的处理方法。传统方法是使用三环控制器，兼顾了精度、动态响应、抗扰能力和工程可实现性，机床、工业机械臂都采用这种控制方式，并且可能还会加前馈。因为工业机械臂、机床都要求精度，所以会在三环控制器的基础上不断优化。

<figure class="ros-figure">
	<img src="../../images/control_loop.png" alt="control_loop" />
</figure>

但是对于机器人强化学习运动控制器来说，更重要的是动态相应。因为强化学习控制器是在仿真里训练的，我们希望仿真器和真机数据分布尽量一致，所以希望机器人真机动态特性贴近仿真，其中最重要的一个部分就是电机动态特性和仿真一致。

在仿真当中，电机都使用PD控制器，这是一个非常理想的控制器：

$$
\tau = k_p \cdot \left( \theta_{cmd} - \theta \right) - k_d \cdot \dot{\theta}
$$

仿真PD控制器和上面的单位置环控制器的公式是一致的：

$$
\tau = I \cdot K_{\tau} = k_p \cdot \left( \theta_{cmd} - \theta \right) - k_d \cdot \dot{\theta}
$$

但有一个区别在于真机内部是电流环，电流和力矩之间有一个系数$K_t$：

$$
I =
\frac{
k_p \cdot \left( \theta_{cmd} - \theta \right) - k_d \cdot \dot{\theta}
}{
K_{\tau}
}
$$

所以使用ENCOS电机时我们需要使用说明书里的力位控制模式：

<figure class="ros-figure ros-figure--narrow">
	<img src="../../images/control_formulation.png" alt="control_formulation" />
	<figcaption>ENCOS力位控制器</figcaption>
</figure>

这个$K_t$和电机电流环相关，一般情况下我们认为$K_t$是一个常数，但是实际上这个参数并不是一个恒定值。下图为电机力矩—电流曲线，可见曲线并非完全线性。下面两张图都是ENCOS 6408电机参数曲线。

<figure class="ros-figure ros-figure--narrow">
	<img src="../../images/ti_param.png" alt="ti_param" />
	<figcaption>电机力矩—电流曲线</figcaption>
</figure>

下面这个是TN曲线，这个也很影响Sim2Real，因为一般情况下在仿真中只设置最大力矩和最大转速，但实际上电机最大功率是恒定的，电机不可能同时达到最大转速和最大力矩，所以TN曲线不是矩形，这个在空翻等剧烈的动作中会有影响，所以如果要做复杂动作，需要在仿真中加入TN曲线约束。
<figure class="ros-figure ros-figure--narrow">
	<img src="../../images/tn_curve.png" alt="tn_curve" />
	<figcaption>电机转速—力矩曲线</figcaption>
</figure>



## 电机系统辨识
了解了电机控制器，我们知道单位置环控制器最重要的两个参数是$K_p$，$K_d$。拿到电机之后我们希望看出来真机的参数和仿真是否一致，或者说在设置同样参数情况下真机和仿真是否一致，或者他们之前有什么区别。在电机无负载低频转动时，比如一个很慢的正弦曲线，三环控制器和单位置环控制器体现不出来区别，而且单位置环控制器不同$K_p$，$K_d$情况下区别也不大，所以为了辨识出$K_p$，$K_d$，我们需要给电机高频信号。

一个比较标准的操作是对电机进行线性扫频。线性扫频中，瞬时频率从 \(f_{\mathrm{start}}\) 线性增加到 \(f_{\mathrm{end}}\)。


$$
P(t)
=
A
\sin
\left[
2\pi
\left(
f_{\mathrm{start}}t
+
\frac{f_{\mathrm{end}} - f_{\mathrm{start}}}{2T}t^2
\right)
\right]
$$

这样可以测量出电机在一组参数下的不同频率相应特性，可以通过线性回归来计算$K_p$，$K_d$。为了方便理解，我们找一个比较好的电机进行讲解。



### 1.电机基本参数

| 额定电压 | 空载峰值转速 | 额定功率 | 额定扭矩 | 额定转速 | 峰值扭矩 | 扭矩常数 | 电机重量 | 转子惯量 | 减速比 | 直径 | 长度 |
|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| 48 V | 132 rpm | 47.840 W | 116.000 Nm | 119.600 rpm | 0.115 Nm | 0.115 Nm/A | 1850 g | 0.159221308 kg·m² | 25 | 100 mm | 79.8 mm |

!!! note
    原始表格中部分字段可能来自整机/减速后关节侧数据，例如额定扭矩、峰值扭矩、转子惯量等。
    后续计算默认使用测试文档中的关节侧转动惯量：

    $$
    J = 0.159221308 \ \mathrm{kg \cdot m^2}
    $$


### 2.二阶系统模型

假设机器人关节可以简化为一个旋转的弹簧-阻尼系统。

#### 2.1 变量定义

| \(I\) 或 \(J\) | \(\theta\) | \(\dot{\theta}\) | \(\ddot{\theta}\) | \(\tau\) | \(K_p\) | \(K_d\) | \(\zeta\) | \(\omega_n\) | \(f_n\) |
|---|---|---|---|---|---|---|---|---|---|
| 转动惯量，单位 \(\mathrm{kg \cdot m^2}\) | 关节角度，单位 rad | 关节角速度，单位 rad/s | 关节角加速度，单位 rad/s² | 电机输出力矩，单位 Nm | 位置比例增益 | 速度微分增益 | 阻尼比 | 自然角频率，单位 rad/s | 自然频率，单位 Hz |

自然角频率和自然频率之间的关系为：

$$
\omega_n = 2\pi f_n
$$


### 2.2 旋转运动方程

根据牛顿第二定律的旋转形式：

$$
\tau = J \ddot{\theta}
$$

PD 控制器输出力矩：

$$
\tau = K_p(\theta_{\mathrm{target}} - \theta) - K_d \dot{\theta}
$$

当目标位置为零，或者只分析误差动态时：

$$
\theta_{\mathrm{target}} = 0
$$

则有：

$$
\tau = -K_p \theta - K_d \dot{\theta}
$$

代入旋转动力学方程：

$$
J\ddot{\theta} = -K_p \theta - K_d \dot{\theta}
$$

移项得到：

$$
J\ddot{\theta} + K_d\dot{\theta} + K_p\theta = 0
$$

两边同时除以 \(J\)：

$$
\ddot{\theta} + \frac{K_d}{J}\dot{\theta} + \frac{K_p}{J}\theta = 0
$$


### 2.3 标准二阶系统形式

标准二阶系统为：

$$
\ddot{\theta} + 2\zeta\omega_n\dot{\theta} + \omega_n^2\theta = 0
$$

对比可得：

$$
\omega_n^2 = \frac{K_p}{J}
$$

因此：

$$
K_p = J\omega_n^2
$$

又因为：

$$
2\zeta\omega_n = \frac{K_d}{J}
$$

所以：

$$
K_d = 2\zeta J \omega_n
$$

也可以写成：

$$
K_d = 2\zeta\sqrt{J K_p}
$$


### 2.4 由PD参数反算系统参数

由 \(K_p\) 和 \(J\) 可反算自然角频率：

$$
\omega_n = \sqrt{\frac{K_p}{J}}
$$

自然频率：

$$
f_n = \frac{\omega_n}{2\pi}
$$

阻尼比：

$$
\zeta = \frac{K_d}{2\sqrt{J K_p}}
$$



### 2.5 调节时间

二阶系统近似调节时间：

$$
t_s \approx \frac{4}{\zeta\omega_n}
$$

其中：

| \(t_s\) | \(\zeta\) | \(\omega_n\) |
|---|---|---|
| 调节时间 | 阻尼比 | 自然角频率 |

!!! note
    该公式通常用于估算 2% 稳态误差带内的调节时间。


### 2.6 带宽计算

闭环二阶系统带宽通常定义为频率响应幅值下降到 \(-3 \mathrm{dB}\) 的频率，即幅值为：

$$
\frac{1}{\sqrt{2}} \approx 0.707
$$

二阶系统带宽角频率：

$$
\omega_{\mathrm{BW}}
=
\omega_n
\sqrt{
1 - 2\zeta^2
+
\sqrt{
4\zeta^4 - 4\zeta^2 + 2
}
}
$$

转换为 Hz：

$$
f_{\mathrm{BW}} = \frac{\omega_{\mathrm{BW}}}{2\pi}
$$


### 3.电机空载计算参数

#### 3.1 设计输入参数

| 转动惯量 \(J\) | 目标自然频率 \(f_n\) | 目标自然角频率 \(\omega_n\) |
|---:|---:|---:|
| 0.159221308 kg·m² | 5 Hz | \(2\pi \times 5\) rad/s |

自然角频率：

$$
\omega_n = 2\pi f_n = 2\pi \times 5 = 31.4159 \ \mathrm{rad/s}
$$

比例增益：

$$
K_p = J\omega_n^2
$$

代入：

$$
K_p = 0.159221308 \times 31.4159^2
$$

得到：

$$
K_p \approx 157.1451
$$


#### 3.2 三组阻尼比参数

三组测试分别取：

| 测试编号 | 测试一 | 测试二 | 测试三 |
|---|---:|---:|---:|
| 阻尼比 \(\zeta\) | 0.707 | 1.2 | 2.0 |

微分增益：

$$
K_d = 2\zeta J\omega_n
$$


#### 3.3 空载参数表

| 参数 | 单位 | 测试一 | 测试二 | 测试三 |
|---|---:|---:|---:|---:|
| 转动惯量 \(J\) | kg·m² | 0.159221308 | 0.159221308 | 0.159221308 |
| 阻尼比 \(\zeta\) | - | 0.707 | 1.2 | 2.0 |
| 自然频率 \(f_n\) | Hz | 5 | 5 | 5 |
| 比例增益 \(K_p\) | - | 157.1451 | 157.1451 | 157.1451 |
| 微分增益 \(K_d\) | - | 7.0729 | 12.005 | 20.0083 |
| 增益比例 \(K_p / K_d\) | - | 22.2179 | 13.0900 | 7.8540 |
| 响应时间 \(t_s\) | s | 0.1801 | 0.1061 | 0.0637 |
| 带宽 \(BW\) | Hz | 5.0 | 2.5 | 1.33 |
| 2 倍带宽终止频率 \(F_{\mathrm{end},2x}\) | Hz | 10.0 | 4.99 | 2.67 |
| 2 倍带宽角度 \(A_{2x}\) | deg | 8.860409 | 17.744336 | 33.241674 |
| 3 倍带宽终止频率 \(F_{\mathrm{end},3x}\) | Hz | 15.0 | 7.49 | 4.0 |
| 3 倍带宽角度 \(A_{3x}\) | deg | 5.906939 | 11.829558 | 22.161116 |
| 5 倍带宽终止频率 \(F_{\mathrm{end},5x}\) | Hz | 25.0 | 12.49 | 6.66 |
| 5 倍带宽角度 \(A_{5x}\) | deg | 3.544164 | 7.097735 | 13.29667 |


### 4. Chirp 扫频公式

扫频信号用于测试系统在不同频率下的动态响应能力。

#### 4.1 变量定义

| \(A\) | \(f_{\mathrm{start}}\) | \(f_{\mathrm{end}}\) | \(T\) | \(t\) | \(V_{\mathrm{limit}}\) | \(k\) |
|---|---|---|---|---|---|---|
| 扫频位置振幅 | 起始频率，单位 Hz | 终止频率，单位 Hz | 扫频总时间，单位 s | 当前时间，满足 \(0 \le t \le T\) | 电机速度限制 | 速度裕量系数 |

推荐扫频范围：

$$
f_{\mathrm{start}} = 0.1 \ \mathrm{Hz}
$$

$$
f_{\mathrm{end}} = n f_{\mathrm{BW}}, \quad n = 2, 3, 5, \ldots
$$

扫频时间建议：

$$
T = 20 \sim 30 \ \mathrm{s}
$$

测试中可取：

$$
T = 20 \ \mathrm{s}
$$


### 5. 线性扫频公式

#### 5.1 位置输入

线性扫频中，瞬时频率从 \(f_{\mathrm{start}}\) 线性增加到 \(f_{\mathrm{end}}\)。

位置输入：

$$
P(t)
=
A
\sin
\left[
2\pi
\left(
f_{\mathrm{start}}t
+
\frac{f_{\mathrm{end}} - f_{\mathrm{start}}}{2T}t^2
\right)
\right]
$$


#### 5.2 相位函数

定义相位：

$$
\phi(t)
=
2\pi
\left(
f_{\mathrm{start}}t
+
\frac{f_{\mathrm{end}} - f_{\mathrm{start}}}{2T}t^2
\right)
$$


#### 5.3 瞬时角频率

对相位求导：

$$
\phi'(t)
=
2\pi
\left(
f_{\mathrm{start}}
+
\frac{f_{\mathrm{end}} - f_{\mathrm{start}}}{T}t
\right)
$$

瞬时频率：

$$
f(t)
=
f_{\mathrm{start}}
+
\frac{f_{\mathrm{end}} - f_{\mathrm{start}}}{T}t
$$


#### 5.4 最大速度

位置为：

$$
P(t)=A\sin(\phi(t))
$$

速度为：

$$
\dot{P}(t)=A\cos(\phi(t))\phi'(t)
$$

因此速度幅值为：

$$
|\dot{P}(t)|_{\mathrm{amp}} = A\phi'(t)
$$

最大速度发生在 \(t = T\)，即频率最高处：

$$
V_{\mathrm{max,reached}} = A \cdot 2\pi f_{\mathrm{end}}
$$


### 6. 扫频幅度计算

幅度需要根据电机速度限制以及约束条件确定。

速度约束：

$$
A \cdot 2\pi f_{\mathrm{end}} \le V_{\mathrm{limit}}
$$

因此：

$$
A \le \frac{V_{\mathrm{limit}}}{2\pi f_{\mathrm{end}}}
$$

引入安全系数 \(k\)：

$$
A = k \cdot \frac{V_{\mathrm{limit}}}{2\pi f_{\mathrm{end}}}
$$

测试中可取：

$$
k = 0.8
$$



#### 6.1 弧度转角度

如果 \(A\) 的单位为 rad，则转换为 deg：

$$
A_{\mathrm{deg}} = A_{\mathrm{rad}} \cdot \frac{180}{\pi}
$$


#### 6.2 角度转弧度

如果输入命令需要 rad：

$$
A_{\mathrm{rad}} = A_{\mathrm{deg}} \cdot \frac{\pi}{180}
$$


### 7.电机空载线性扫频测试参数

| 测试项 | 转动惯量 \(J\) | 阻尼比 \(\zeta\) | 自然频率 \(f_n\) | \(K_p\) | \(K_d\) | \(K_p/K_d\) | 响应时间 \(t_s\) | 带宽 \(BW\) | \(F_{\mathrm{end},2x}\) | \(A_{2x}\) | \(F_{\mathrm{end},3x}\) | \(A_{3x}\) | \(F_{\mathrm{end},5x}\) | \(A_{5x}\) |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| 测试一 | 0.159221308 kg·m² | 0.707 | 5 Hz | 157.1451 | 7.0729 | 22.2179 | 0.1801 s | 5.0 Hz | 10.0 Hz | 8.860409 deg | 15.0 Hz | 5.906939 deg | 25.0 Hz | 3.544164 deg |
| 测试二 | 0.159221308 kg·m² | 1.2 | 5 Hz | 157.1451 | 12.005 | 13.0900 | 0.1061 s | 2.5 Hz | 4.99 Hz | 17.744336 deg | 7.49 Hz | 11.829558 deg | 12.49 Hz | 7.097735 deg |
| 测试三 | 0.159221308 kg·m² | 2.0 | 5 Hz | 157.1451 | 20.0083 | 7.8540 | 0.0637 s | 1.33 Hz | 2.67 Hz | 33.241674 deg | 4.0 Hz | 22.161116 deg | 6.66 Hz | 13.29667 deg |



### 8.实验结果

测试之后的曲线基于如下力矩模型进行拟合：

$$
\mathrm{Torque} = K_p \cdot \mathrm{Err} - K_d \cdot \mathrm{Vel}
$$

结果如图，其实直接辨识效果并不好，线性程度不高，而且识别的$K_p$，$K_d$并不对：

<figure class="ros-figure">
    <img src="../../images/chrip1.png" alt="chrip1" />
    <figcaption>系统辨识结果</figcaption>
</figure>

但是假设电机有5ms延迟时，可以发现$K_p$，$K_d$识别的值很准确，并且线性程度很高（test3阻尼比最高，测试效果不好说明电机调大阻尼比会产生更多非线性，这个不同电机会不一样）。说明电机确实有5ms左右的延迟。

<figure class="ros-figure">
    <img src="../../images/chrip2.png" alt="chrip2" />
    <figcaption>加延迟系统辨识结果</figcaption>
</figure>

下图为扫频结果图（注意位置单位是弧度，数值很大是因为初始值设置的比较大）：

<figure class="ros-figure">
    <img src="../../images/chrip3.png" alt="chrip3" />
    <figcaption>扫频数据图</figcaption>
</figure>

为了比对仿真和真机的区别，我们在Mujoco中设置一个电机，设置同样的转动惯量和$K_p$，$K_d$，发送同样的控制指令，对比真机和仿真的响应曲线。可以看到，如果控制环正确、$K_p$，$K_d$，则仿真和真机的电机响应应该一致。

<figure class="ros-figure">
    <img src="../../images/chrip4.png" alt="chrip4" />
    <figcaption>扫频对比图</figcaption>
</figure>

上图看出来一些区别，在于力矩，真机力矩会有一些毛刺，是因为电机在换向时速度为0,电机滑动摩擦转为静摩擦，电机力矩需要增大才能推动电机继续转动。另外齿轮背隙也有影响。但是摩擦由于数值非常小，近似于噪声，在系统辨识中很难辨识出来，线性程度会很差。

<figure class="ros-figure">
    <img src="../../images/chrip5.png" alt="chrip5" />
    <figcaption>电机摩擦</figcaption>
</figure>

通过电机系统辨识，我们了解了电机的$K_p$，$K_d$，以及延迟、摩擦特性，它们对Sim2Real都有影响。


## ENCOS电机
因克斯电机我们也做了扫频，但是效果没有上面的那么好。

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

上面是因克斯电机参数，我们设置自然频率为8，阻尼比为1。因为在不同阻尼比扫频测试中发现因克斯电机如果阻尼比变大，会让速度噪声更明显，线性程度会变差，所以选了临界阻尼大一点的阻尼比。

<figure class="ros-figure ros-figure--narrow">
    <img src="../../images/encos_chrip1.jpg" alt="encos_chrip1" />
</figure>

因克斯电机虽然辨识线性程度非常好，但是辨识结果总是和设置值差一些。问题还没有排查清楚，但是实际policy上真机是能work的。
<figure class="ros-figure">
    <img src="../../images/encos_chrip2.jpg" alt="chrip2" />
    <figcaption>ENCOS电机系统辨识结果</figcaption>
</figure>

只有当位置误差较大时辨识结果才比较准，下面的图是在机器人走路时对所有电机系统辨识结果，其中hip_roll关节辨识结果是对的，线性程度也很好：
<figure class="ros-figure">
    <img src="../../images/encos_chrip3.jpg" alt="chrip3" />
    <figcaption>机器人走路系统辨识结果</figcaption>
</figure>

<figure class="ros-figure">
    <img src="../../images/encos_chrip4.jpg" alt="chrip4" />
    <figcaption>机器人走路电机数据图</figcaption>
</figure>