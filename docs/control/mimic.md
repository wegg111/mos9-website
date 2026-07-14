# Mimic模仿学习
本节介绍人形机器人模仿学习动作方案。

## Mimic
上一节AMP是引入风格奖励让机器人学习数据分布，如果想让机器人学单一动作就不需要衡量分布之间的区别，直接衡量状态量之间的差即可。

设时刻 \(t\) 的总奖励为：

\[
r_t =
\sum_{k \in T} w_k
\exp \left(
-
\frac{e_{k,t}}{\sigma_k^2}
\right)
+
\sum_{k \in P} w_k p_{k,t}
\tag{1}
\]

其中，\(T\) 表示参考动作跟踪项集合，\(P\) 表示正则化项集合；\(e_{k,t}\) 为第 \(k\) 个跟踪误差，\(\sigma_k\) 为对应误差项的尺度参数，\(w_k\) 表示各奖励项和惩罚项的权重。在踢球动作训练中，我们主要从关节状态、根部位姿以及关键刚体运动状态三个层面对参考动作进行跟踪。

### 关节位置与关节速度跟踪

为保证机器人能够准确复现参考动作的关节时序变化，首先定义关节位置与关节速度的跟踪奖励：

\[
e_{\mathrm{jpos},t}
=
\sum_{i=1}^{N_j}
\left\|
q_{i,t}^{\mathrm{ref}} - q_{i,t}
\right\|_2^2,
\quad
r_{\mathrm{jpos},t}
=
\exp
\left(
-
\frac{
e_{\mathrm{jpos},t}
}{
\sigma_{\mathrm{jpos}}^2
}
\right)
\tag{2}
\]

\[
e_{\mathrm{jvel},t}
=
\sum_{i=1}^{N_j}
\left\|
\dot{q}_{i,t}^{\mathrm{ref}} - \dot{q}_{i,t}
\right\|_2^2,
\quad
r_{\mathrm{jvel},t}
=
\exp
\left(
-
\frac{
e_{\mathrm{jvel},t}
}{
\sigma_{\mathrm{jvel}}^2
}
\right)
\tag{3}
\]

其中，\(q_{i,t}\) 和 \(\dot{q}_{i,t}\) 分别表示第 \(i\) 个关节在时刻 \(t\) 的位置和速度，\(q_{i,t}^{\mathrm{ref}}\) 和 \(\dot{q}_{i,t}^{\mathrm{ref}}\) 为对应参考值，\(N_j\) 为机器人可控关节数。

### 根部位置与姿态跟踪

为了保证踢球动作整体时空结构的正确性，进一步对机器人根部的位姿进行跟踪。根部位置与姿态奖励分别定义为：

\[
e_{\mathrm{apos},t}
=
\left\|
p_{a,t}^{\mathrm{ref}} - p_{a,t}
\right\|_2^2,
\quad
r_{\mathrm{apos},t}
=
\exp
\left(
-
\frac{
e_{\mathrm{apos},t}
}{
\sigma_{\mathrm{apos}}^2
}
\right)
\tag{4}
\]

\[
e_{\mathrm{aori},t}
=
d_q
\left(
Q_{a,t}^{\mathrm{ref}},
Q_{a,t}
\right)^2,
\quad
r_{\mathrm{aori},t}
=
\exp
\left(
-
\frac{
e_{\mathrm{aori},t}
}{
\sigma_{\mathrm{aori}}^2
}
\right)
\tag{5}
\]

其中，\(p_{a,t}\) 与 \(Q_{a,t}\) 分别表示机器人根部在时刻 \(t\) 的位置与姿态，\(p_{a,t}^{\mathrm{ref}}\) 与 \(Q_{a,t}^{\mathrm{ref}}\) 为参考轨迹中对应的根部状态，\(d_q(\cdot,\cdot)\) 表示四元数之间的姿态误差度量。

### 关键刚体位置、姿态与速度跟踪

由于踢球动作不仅依赖下肢摆动，还涉及躯干稳定、支撑腿协调及上肢配合，因此我们还对多个关键刚体的运动状态进行跟踪。其位置、姿态和速度误差分别定义为：

\[
e_{\mathrm{bpos},t}
=
\frac{1}{N_b}
\sum_{b=1}^{N_b}
\left\|
p_{b,t}^{\mathrm{ref}} - p_{b,t}
\right\|_2^2,
\quad
r_{\mathrm{bpos},t}
=
\exp
\left(
-
\frac{
e_{\mathrm{bpos},t}
}{
\sigma_{\mathrm{bpos}}^2
}
\right)
\tag{6}
\]

\[
e_{\mathrm{bori},t}
=
\frac{1}{N_b}
\sum_{b=1}^{N_b}
d_q
\left(
Q_{b,t}^{\mathrm{ref}},
Q_{b,t}
\right)^2,
\quad
r_{\mathrm{bori},t}
=
\exp
\left(
-
\frac{
e_{\mathrm{bori},t}
}{
\sigma_{\mathrm{bori}}^2
}
\right)
\tag{7}
\]

\[
e_{\mathrm{bvel},t}
=
\frac{1}{N_b}
\sum_{b=1}^{N_b}
\left\|
v_{b,t}^{\mathrm{ref}} - v_{b,t}
\right\|_2^2,
\quad
r_{\mathrm{bvel},t}
=
\exp
\left(
-
\frac{
e_{\mathrm{bvel},t}
}{
\sigma_{\mathrm{bvel}}^2
}
\right)
\tag{8}
\]

其中，\(N_b\) 为参与跟踪的关键刚体数量，\(p_{b,t}\)、\(Q_{b,t}\) 和 \(v_{b,t}\) 分别表示第 \(b\) 个刚体的位置、姿态和速度，带有上标 \(\mathrm{ref}\) 的量表示参考轨迹中的对应值。

### 正则化约束

除参考动作跟踪项外，为提高训练过程中的稳定性和物理合理性，我们还引入动作变化率惩罚、关节越界惩罚以及非期望碰撞惩罚等正则项。它们用于抑制控制信号突变、限制关节偏离物理范围，并减少非目标部位与环境之间的不合理接触。

通过参考跟踪项与正则项的共同作用，策略不仅能够复现参考踢球动作的主要运动特征，还能够保持较好的稳定性与可执行性。

## 仿真训练结果
训了一个踢球动作：


<div class="video-grid">
    <figure class="ros-figure">
        <video controls autoplay loop muted playsinline>
            <source src="../../images/mimicsim1.mp4" type="video/mp4">
        </video>
        <figcaption>踢球</figcaption>
    </figure>
</div>

## 参考文献
[1] Liao Q, Truong T E, Huang X, et al. Beyondmimic: From motion tracking to versatile humanoid control via guided diffusion[J]. arXiv preprint arXiv:2508.08241, 2025.