# Motor Selection

This section introduces robot Simulink dynamic simulation and motor selection.

## Robot Simulink Simulation

In principle, if we want to determine the torque required at each joint while the robot walks, we need to finish the link design, or at least determine the approximate mass distribution, and then deploy the control algorithm in a robot simulator before we can obtain the motor torques. The contradiction is that motor selection must be decided before the mechanical design is finalized, so the joint torques must be estimated in advance. Since walking torque calculation is fairly complicated, we chose to estimate the joint torques after the robot concept was determined by building an abstract simulation.

MathWorks has open-sourced a MATLAB/Simulink project called [msra-walking-robot](https://github.com/mathworks-robotics/msra-walking-robot
). In Simulink, it first builds the motor controllers and then connects them into a robot. This robot consists of one rigid body with two six-degree-of-freedom legs, which matches our robot configuration needs quite well. We therefore modified its parameters and wrote an open-loop ZMP gait to make the robot walk. Although the walking was not very stable, the resulting torque values were sufficient for reference. Our modified repository is available at [MOS-MatLab-Simulation](https://github.com/THMOS2025/MOS-MatLab-Simulation).


<figure class="ros-figure ros-figure--narrow">
	<img src="../../../images/simulink.png" alt="simulink" />
	<figcaption>Simulink model</figcaption>
</figure>

<figure class="ros-figure ros-figure--narrow">
	<img src="../../../images/robot_walk.gif" alt="robot_walk" />
	<figcaption>Robot walking in Simulink</figcaption>
</figure>

After executing the trajectory, we obtain the torque plot shown below. The six curves represent the torques of the six joints of the left leg, and the data shown correspond to one selected gait cycle. A few conclusions can be drawn. The knee pitch joint has the largest torque, with a peak above 40 Nm. During ground impact, the hip roll and hip pitch joints may also experience large torques. During normal walking, ankle torque remains within about 20 Nm, so a serial arrangement of smaller motors can be used there.

<figure class="ros-figure ros-figure--narrow">
	<img src="../../../images/motor_torque.png" alt="motor_torque" />
	<figcaption>Joint torque plot during robot walking</figcaption>
</figure>

## Motor Selection

Based on this, we could choose motors available on the market. In the end, we selected motors from ENCOS. ENCOS motors have already been used on many humanoid robots, so they are able to meet our requirements. The 4310 is the smaller motor, with a peak torque of 36 Nm, and is used for the head, arms, and similar locations. The 6408 is the larger motor, with a peak torque of 60 Nm, and is used for the legs.

<div class="ros-gallery ros-gallery--pair">
	<figure class="ros-figure ros-figure--paired">
		<img class="ros-image--full" src="../../../images/4310.png" alt="4310" />
		<figcaption>4310 motor</figcaption>
	</figure>
	<figure class="ros-figure ros-figure--paired">
		<img class="ros-image--full" src="../../../images/6408.png" alt="6408" />
		<figcaption>6408 motor</figcaption>
	</figure>
</div>

The final motor distribution across the joints is shown below.

<figure class="ros-figure">
	<img src="../../../images/motor_selection.png" alt="motor_selection" />
	<figcaption>Motor distribution across the robot joints</figcaption>
</figure>
