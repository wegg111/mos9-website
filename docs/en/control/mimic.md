# Mimic Imitation Learning
This section introduces the imitation-learning motion scheme for humanoid robots.

## Mimic
In the previous section, AMP introduced a style reward so that the robot could learn a data distribution. If we instead want the robot to learn a single motion, then we no longer need to measure the difference between distributions, and can directly measure the difference between state variables.

Let the total reward at time step \(t\) be:

\[
r_t =
\sum_{k \in T} w_k
\exp \left(
-
\frac{e_{k,t}}{\sigma_k^2}
\right)
+
\sum_{k \in P} w_k p_{k,t}
	ag{1}
\]

where \(T\) denotes the set of reference-motion tracking terms, and \(P\) denotes the set of regularization terms. \(e_{k,t}\) is the tracking error of the \(k\)-th term, \(\sigma_k\) is the scale parameter of the corresponding error term, and \(w_k\) is the weight of each reward or penalty term. In kick-motion training, we mainly track the reference motion from three levels: joint state, root pose, and key rigid-body motion state.

### Joint Position and Joint Velocity Tracking

To ensure that the robot can accurately reproduce the temporal evolution of the joints in the reference motion, we first define the tracking rewards for joint position and joint velocity:

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
	ag{2}
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
	ag{3}
\]

where \(q_{i,t}\) and \(\dot{q}_{i,t}\) denote the position and velocity of the \(i\)-th joint at time step \(t\), respectively; \(q_{i,t}^{\mathrm{ref}}\) and \(\dot{q}_{i,t}^{\mathrm{ref}}\) are the corresponding reference values; and \(N_j\) is the number of controllable joints of the robot.

### Root Position and Orientation Tracking

To ensure the correctness of the overall spatiotemporal structure of the kick motion, we further track the pose of the robot root. The root position and orientation rewards are defined as:

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
	ag{4}
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
	ag{5}
\]

where \(p_{a,t}\) and \(Q_{a,t}\) denote the position and orientation of the robot root at time step \(t\), respectively; \(p_{a,t}^{\mathrm{ref}}\) and \(Q_{a,t}^{\mathrm{ref}}\) are the corresponding root states in the reference trajectory; and \(d_q(\cdot,\cdot)\) denotes the orientation error metric between two quaternions.

### Tracking of Key Rigid-Body Position, Orientation, and Velocity

Because the kick motion depends not only on lower-limb swing but also on trunk stability, support-leg coordination, and upper-limb cooperation, we also track the motion state of multiple key rigid bodies. Their position, orientation, and velocity errors are defined as:

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
	ag{6}
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
	ag{7}
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
	ag{8}
\]

where \(N_b\) is the number of key rigid bodies included in tracking, and \(p_{b,t}\), \(Q_{b,t}\), and \(v_{b,t}\) denote the position, orientation, and velocity of the \(b\)-th rigid body, respectively. Quantities with the superscript \(\mathrm{ref}\) denote the corresponding values in the reference trajectory.

### Regularization Constraints

In addition to the reference-motion tracking terms, we also introduce regularization terms such as action-rate penalty, joint-limit violation penalty, and undesired-collision penalty to improve training stability and physical plausibility. These terms are used to suppress abrupt changes in control signals, constrain joints from deviating beyond their physical range, and reduce unreasonable contacts between non-target body parts and the environment.

Through the combined effect of the reference tracking terms and the regularization terms, the policy can not only reproduce the main motion characteristics of the reference kicking motion, but also maintain good stability and executability.

## Simulation Training Results
We trained a kicking motion:


<div class="video-grid">
	<figure class="ros-figure">
		<video controls autoplay loop muted playsinline>
			<source src="../../../images/mimicsim1.mp4" type="video/mp4">
		</video>
		<figcaption>Kicking</figcaption>
	</figure>
</div>

## References
[1] Liao Q, Truong T E, Huang X, et al. Beyondmimic: From motion tracking to versatile humanoid control via guided diffusion[J]. arXiv preprint arXiv:2508.08241, 2025.
