# Adversarial Motion Priors (AMP)
This section introduces the robot reinforcement learning algorithm PPO as well as AMP.

## PPO
We will not repeat the theoretical details of reinforcement learning here, as there are already many good textbooks. Please refer to other materials for theory study, such as [Hands-on Reinforcement Learning](https://hrl.boyuai.com/chapter/intro). Here we briefly review the PPO formulas.


Let the policy network be \(\pi_\theta(a_t|s_t)\), and the value function be \(V_\phi(s_t)\), where \(s_t\) is the policy observation and \(a_t\) is the policy action. \(\theta\) and \(\phi\) denote the parameters of the policy network and value network, respectively. During training, the policy samples trajectories in the environment and receives immediate rewards, after which it is updated using PPO. Unlike standard PPO, our immediate reward is composed of both the environment task reward and the AMP reward, so the policy update is simultaneously constrained by the task objective and the motion prior.

Let the mixed reward at time step \(t\) be \(r_t\). Then the temporal-difference residual can be written as:

\[
\delta_t = r_t + \gamma(1 - d_t)V_\phi(s_{t+1}) - V_\phi(s_t)
	ag{1}
\]

where \(\gamma\) is the discount factor, and \(d_t\) denotes the termination flag. Based on Generalized Advantage Estimation (GAE), the advantage function is computed recursively as:

\[
A_t = \delta_t + \gamma\lambda(1 - d_t)A_{t+1}
	ag{2}
\]

where \(\lambda\) is the GAE parameter. The return can then be obtained as:

\[
R_t = A_t + V_\phi(s_t)
	ag{3}
\]

and the advantage is normalized as:

\[
\hat{A}_t = \frac{A_t - \mu_A}{\sigma_A + \epsilon}
	ag{4}
\]

Let the probability ratio between the current policy and the old policy be:

\[
\rho_t(\theta) =
\frac{\pi_\theta(a_t|s_t)}
{\pi_{\mathrm{old}}(a_t|s_t)}
	ag{5}
\]

Then the clipped PPO policy objective is written as:

\[
\mathcal{L}_{\pi}
=
\mathbb{E}_t
\left[
\max
\left(
-\rho_t(\theta)\hat{A}_t,
-\operatorname{clip}
\left(
\rho_t(\theta), 1-\epsilon, 1+\epsilon
\right)
\hat{A}_t
\right)
\right]
	ag{6}
\]

where \(\epsilon\) is the clipping coefficient. The value-function loss is:

\[
\mathcal{L}_{V}
=
\mathbb{E}_t
\left[
\max
\left(
\left(V_\phi(s_t) - R_t\right)^2,
\left(V_\phi^{\mathrm{clip}}(s_t) - R_t\right)^2
\right)
\right]
	ag{7}
\]

where \(V_\phi^{\mathrm{clip}}(s_t)\) denotes the clipped value estimate. In addition, to preserve the policy's exploration capability, an entropy regularization term \(H(\pi_\theta)\) is added to the total loss. Therefore, the optimization objective for the PPO part can be written as:

\[
\mathcal{L}_{\mathrm{PPO}}
=
\mathcal{L}_{\pi}
+
c_v\mathcal{L}_{V}
-
c_eH(\pi_\theta)
	ag{8}
\]

where \(c_v\) and \(c_e\) are the weight of the value loss and the weight of the entropy regularization term, respectively.

---

## AMP
AMP, or Adversarial Motion Priors, essentially introduces a style reward into the reinforcement learning process. In the figure, this is the $r_t^S$ term, which measures the difference between the robot state $S_t$ in the simulation environment and the motions in the dataset. By introducing the style reward into the total reward, the robot's motion style is pushed closer to the dataset by increasing the reward value $r_t^S$. The difference in style is measured using a discriminator, which is a neural network used to measure the difference between two data distributions. Below we explain the formulas for each part of AMP.

<figure class="ros-figure ros-figure--narrow">
	<img src="../../../images/amp_framework.png" alt="amp_framework" />
	<figcaption>AMP framework</figcaption>
</figure>

### AMP Observations and Discriminator Input

AMP does not discriminate directly on the full policy state. Instead, it learns a motion prior in a specially constructed motion-observation space. We define the AMP observation at time step \(t\) as:

\[
o_t^{\mathrm{amp}}
=
\left[
q_t,\dot{q}_t,v_t^{\mathrm{body}}
\right]
	ag{9}
\]

where \(q_t\) is the joint position, \(\dot{q}_t\) is the joint velocity, and \(v_t^{\mathrm{body}}\) is the trunk linear velocity in the body frame. To model short-term motion continuity explicitly, we use the transition pair formed by concatenating AMP observations from two adjacent frames as the discriminator input:

\[
x_t^{\mathrm{amp}}
=
\left[
o_t^{\mathrm{amp}}, o_{t+1}^{\mathrm{amp}}
\right]
	ag{10}
\]

Let the discriminator be \(D_\psi(x_t^{\mathrm{amp}})\), where \(\psi\) denotes the discriminator parameters. Then its output is:

\[
d_t^{\mathrm{amp}}
=
D_\psi
\left(
o_t^{\mathrm{amp}}, o_{t+1}^{\mathrm{amp}}
\right)
	ag{11}
\]

This output reflects how consistent the current motion segment is with the reference motion distribution.

---

### AMP Reward Construction

We map the discriminator output into an AMP reward in order to guide the policy toward generating motions that are closer to the expert distribution. The AMP reward is defined as:

\[
r_{\mathrm{amp},t}
=
w_{\mathrm{amp}}
\cdot
\max
\left(
0,
1 -
\frac{1}{4}
\left(
d_t^{\mathrm{amp}} - 1
\right)^2
\right)
	ag{12}
\]

where \(w_{\mathrm{amp}}\) is the AMP reward coefficient. When the discriminator output is close to 1, the current motion segment is closer to the expert motion distribution, and the corresponding reward is larger. When the output deviates from 1, the reward decays quadratically and is clipped to remain nonnegative.

Let the original environment task reward be \(r_{\mathrm{task},t}\). Then the mixed reward finally used for the PPO update is written as:

\[
r_t
=
(1-\alpha)r_{\mathrm{amp},t}
+
\alpha r_{\mathrm{task},t}
	ag{13}
\]

where \(\alpha\) is the interpolation coefficient for the task reward. This mixing method allows the policy to satisfy both the task completion objective and the motion-style constraint during optimization.

---

### Discriminator Supervised Loss

Let the expert sample be:

\[
\left(
o_t^{E}, o_{t+1}^{E}
\right)
	ag{14}
\]

and the policy sample be:

\[
\left(
o_t^{\pi}, o_{t+1}^{\pi}
\right)
	ag{15}
\]

We train the discriminator using a mean-squared-error form such that it outputs a value close to \(+1\) for expert samples and close to \(-1\) for policy samples. The corresponding losses are:

\[
\mathcal{L}_{\mathrm{exp}}
=
\mathbb{E}
\left[
\left(
D_\psi(o_t^{E}, o_{t+1}^{E}) - 1
\right)^2
\right]
	ag{16}
\]

\[
\mathcal{L}_{\mathrm{pol}}
=
\mathbb{E}
\left[
\left(
D_\psi(o_t^{\pi}, o_{t+1}^{\pi}) + 1
\right)^2
\right]
	ag{17}
\]

Therefore, the base discriminator loss is:

\[
\mathcal{L}_{\mathrm{AMP}}
=
\frac{1}{2}
\left(
\mathcal{L}_{\mathrm{exp}}
+
\mathcal{L}_{\mathrm{pol}}
\right)
	ag{18}
\]

Through this loss, the discriminator continually pushes apart the outputs of expert motion and policy motion, while the policy, by maximizing the AMP reward, drives the motion segments it generates toward the expert distribution.

---

### Gradient Penalty and Input Normalization

To improve the stability of adversarial training, we add a gradient-penalty term during discriminator training. Let the expert input be:

\[
x_t^{E}
=
\left[
o_t^{E}, o_{t+1}^{E}
\right]
	ag{19}
\]

Then the gradient penalty is defined as:

\[
\mathcal{L}_{\mathrm{GP}}
=
\lambda_{\mathrm{gp}}
\mathbb{E}
\left[
\left\|
\nabla_{x_t^{E}}
D_\psi(x_t^{E})
\right\|_2^2
\right]
	ag{20}
\]

where \(\lambda_{\mathrm{gp}}\) is the gradient-penalty coefficient. This term suppresses excessive sensitivity of the discriminator to its inputs and thereby reduces training oscillation.

In addition, to eliminate the influence of state variables with different physical scales on discriminator training, we normalize the AMP input. Let the raw input be \(x\), and the normalized input be \(\hat{x}\). Then:

\[
\hat{x}
=
\operatorname{clip}
\left(
\frac{x-\mu}
{\sqrt{\sigma^2+\epsilon}},
-c,
c
\right)
	ag{21}
\]

where \(\mu\) and \(\sigma^2\) are the running mean and variance, respectively, \(\epsilon\) is the numerical stability term, and \(c\) is the clipping threshold. The expert samples and policy samples share the same normalizer so that discrimination is performed on a unified scale.

---

### Joint Optimization Objective

Combining all of the above terms, the overall optimization objective of the training process can be written as:

\[
\mathcal{L}_{\mathrm{total}}
=
\mathcal{L}_{\mathrm{PPO}}
+
\mathcal{L}_{\mathrm{AMP}}
+
\mathcal{L}_{\mathrm{GP}}
	ag{22}
\]

that is,

\[
\mathcal{L}_{\mathrm{total}}
=
\mathcal{L}_{\pi}
+
c_v\mathcal{L}_{V}
-
c_eH(\pi_\theta)
+
\mathcal{L}_{\mathrm{AMP}}
+
\mathcal{L}_{\mathrm{GP}}
	ag{23}
\]

Here, the PPO part is responsible for optimizing task performance, the AMP part provides motion-style constraints, and the gradient-penalty term is used to stabilize discriminator training. Through this joint optimization process, the policy can learn more natural, smoother, and more expert-like motion behaviors while still completing control tasks such as velocity tracking.



## Simulation Training Results
The training code is open-sourced at: [MOS9-AMP](https://github.com/THMOS2025/MOS9-AMP/tree/main).

The final omnidirectional walking results of the robot are shown below. Although the lateral walking may not look especially natural, that is how the retargeted data turned out, and in fact only two data clips were used for the lateral motion.


<div class="video-grid">
	<figure class="ros-figure">
		<video controls autoplay loop muted playsinline>
			<source src="../../../images/ampsim1.mp4" type="video/mp4">
		</video>
		<figcaption>Forward walking</figcaption>
	</figure>
	<figure class="ros-figure">
		<video controls autoplay loop muted playsinline>
			<source src="../../../images/ampsim2.mp4" type="video/mp4">
		</video>
		<figcaption>Lateral walking</figcaption>
	</figure>
	<figure class="ros-figure">
		<video controls autoplay loop muted playsinline>
			<source src="../../../images/ampsim3.mp4" type="video/mp4">
		</video>
		<figcaption>Turning</figcaption>
	</figure>
</div>

<style>
.video-grid {
	display: grid;
	grid-template-columns: repeat(3, 1fr);
	gap: 16px;
	align-items: start;
}

.video-grid .ros-figure {
	margin: 0;
	text-align: center;
}

.video-grid video {
	width: 100%;
	max-width: 100%;
	height: auto;
	border-radius: 8px;
}

.video-grid figcaption {
	margin-top: 8px;
	font-size: 0.9em;
	color: #666;
}

@media (max-width: 768px) {
	.video-grid {
		grid-template-columns: 1fr;
	}
}
</style>





## References
[1] Peng, X. B., Ma, Z., Abbeel, P., Levine, S., & Kanazawa, A. (2021). Amp: Adversarial motion priors for stylized physics-based character control. ACM Transactions on Graphics (ToG), 40(4), 1-20.
