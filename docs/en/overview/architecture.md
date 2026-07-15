# System Architecture

This page describes the overall organization of the robot system from hardware to software.

## System Composition

In general, robot design can be divided into four main parts:

1. Mechanical design: configuration design, degree-of-freedom allocation and distribution, configuration space, structural design, industrial design, and so on. Mechanical design determines what functions the robot can achieve when interacting with the physical world.

2. Electrical system design: power supply circuits and communication circuits. The power system includes the battery, switches, voltage conversion, and related components. Communication circuits are used by drivers, sensors, and other devices. Electrical design ensures that actuators and sensors operate correctly.

3. Communication system design: this can be divided into external communication and internal communication. A robot generally has a host computer that connects to sensors, drivers, or lower-level controllers, which is considered external communication. Physical communication methods include wired communication such as CAN and USB, and wireless communication such as Wi-Fi and Bluetooth. Internal communication refers to communication between processes inside the host, using frameworks such as DDS, ROS, and ZMQ.

4. Motion control design: the robot's motion control method, which ultimately enables the robot to move and interact with the physical world.

## Architecture Diagram

```mermaid
flowchart TD
	A(Requirement analysis and performance target definition) --> B(Mechanical structure design)

	A --> H(Sensor design)
	H --> I1[Inertial Measurement Unit IMU]
	H --> I2[Camera]

	B --> B1[Configuration: DOF allocation and distribution]
	B1 --> B2[Joint range optimization]
	B2 --> B4[Determine dynamic parameters]
	B4 --> B5[Actuator selection]


	B5 --> C(Circuit and driver design)
	B5 --> B3[Structural design and lightweight optimization]

	C --> C1[Power management]
	C1 --> C2[Driver circuit development]
	C2 --> C3[Integrated PCB for main controller and execution units]

	B5 --> D(Communication system design)
	D --> D1[Driver communication]
	D1 --> D3[State feedback and command dispatch]
	D --> D4[Sensor fusion]
	D4 --> D3
	I1 --> D4
	I2 --> D4

	D3 --> E(Motion control design)
	A --> E

	E --> E1[Dynamics modeling]
	B3 --> E1
	E1 --> E2[Algorithm design]
	E2 --> E3[Sim2Sim and Sim2Real deployment]
	C3 --> E3

	E3 --> F[Validation of stable walking and dynamic kicking]
```

The diagram above shows the overall design workflow of the robot system from requirement analysis to functional validation, as well as the dependencies among the different modules.

The system starts by defining overall performance requirements based on the target tasks, such as stable walking, posture perception, and dynamic kicking. On this basis, the team carries out mechanical design, including degree-of-freedom allocation, structural design, dynamic parameter determination, and actuator selection, which together provide the foundation for the robot's motion capability.

Sensor design proceeds in parallel with mechanical design. Sensors such as the IMU and camera are used to obtain the robot's internal state and information about the external environment. Through the communication system, they are connected to the main controller and provide input for state estimation, perception fusion, and motion control.

At the hardware level, the electrical system is responsible for power management, driver circuit development, and integration of the main controller with the execution units, ensuring that actuators and sensors work reliably. The communication system connects drivers, sensors, and the main controller, enabling state feedback, command dispatch, and multi-source data fusion.

After the hardware and communication foundations are completed, the system enters the motion-control design stage, including dynamics modeling, control algorithm design, and Sim2Sim and Sim2Real deployment. Finally, the overall design is validated through tasks such as stable walking and dynamic kicking. In practice, motion control depends strongly on actuator selection, so the controller type must be determined before choosing the motors. Reinforcement-learning controllers, for example, require the motor control loop to satisfy certain performance conditions. In this sense, robot design is fundamentally tightly coupled from end to end.

Overall, this architecture reflects a layered and progressively integrated development style: requirements are clarified first, then the mechanical and hardware foundations are completed, followed by communication and perception pipelines, and finally control algorithms and full-system validation.

The following sections introduce the core parts of the robot system in more detail, including:

- Mechanical design
- Electrical system design
- Communication system design
- Motion control design

Each chapter explains the design ideas and implementation methods through specific modules.
