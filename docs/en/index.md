# MOS-9 Open Documentation

MOS-9 is an open-source robot project for the RoboCup humanoid soccer scenario. This documentation covers the complete chain from robot design to deployment:

- Mechanical and electrical design
- Motor communication and inter-process communication
- Simulation models and motion data
- Motion control and Sim2Real
- Development environment and test validation

## Documentation Structure at a Glance

- [Project Background](robocup_intro.md): RoboCup background, team experience, and project positioning.
- [System Overview](overview/architecture.md): Overall software and hardware architecture of the robot.
- [Mechanical Design](mechanical/index.md): Configuration design, motor selection, structural design, materials and manufacturing, and assembly.
- [Electrical System](electronics/index.md): Circuit design and PCB production workflow.
- [Communication System](communication/index.md): Motor CAN communication, inter-process communication, and the Robot IPC framework.
- [Simulation Models and Data](simulation/index.md): Simulation model construction, file format conversion, and motion data processing.
- [Motion Control](control/index.md): Optimization-based control, reinforcement learning, AMP/Mimic, system identification, and Sim2Real.
- [Development Guide](development/setup.md): Environment setup, test tools, and validation scripts.
- [FAQ](faq/index.md): Frequently asked questions.
- [Conclusion](conclusion.md)

## Intended Readers

- Robotics beginners: can quickly build a system-engineering understanding by following the reading path.
- Research and competition teams: can reuse the communication, simulation, control, and testing workflows.
- Engineering developers: can refer to the module decomposition and real-robot validation methods described in the documentation.
