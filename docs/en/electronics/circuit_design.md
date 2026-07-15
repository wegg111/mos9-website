# Circuit Design and PCB Production

## Circuit Design

The previous section summarized the electrical design requirements. Our circuit requirements can be represented by the following block diagram:
```mermaid
flowchart LR
	A[Battery 48V] --> B[Motor switch]
	B --> B1[Motors]

	A --> C[Converter 48V->19V]
	A --> D[Digital voltage display]

	C --> C1[Mainboard switch]
	C1 --> C2[Orin AGX]
	C2 --> D1[IMU]
	C2 --> D2[Camera]
	C2 --> D3[Motor CAN bus]

	D3 <-.-> B1
```

In the first version of the design, we directly used NMOS transistors as switches, and an off-the-shelf voltage converter module for power conversion. The module supports 30-60 V input and provides 19 V, 5 A output. This circuit could perform its function stably when the current was relatively small, but because the peak current of 20 motors is quite high and there can also be surge current, the MOS switch was repeatedly burned out.

<figure class="ros-figure ros-figure--narrow">
	<img src="../../../images/pcb1.png" alt="pcb1" />
	<figcaption>Circuit schematic V1</figcaption>
</figure>

<div class="ros-gallery ros-gallery--pair">
	<figure class="ros-figure ros-figure--paired">
		<img src="../../../images/pcb2.png" alt="pcb2" />
		<figcaption>PCB layout V1</figcaption>
	</figure>
	<figure class="ros-figure ros-figure--paired">
		<img src="../../../images/pcb3.png" alt="pcb3" />
		<figcaption>PCB hardware V1</figcaption>
	</figure>
</div>


In the second version, we added a relay and the circuit became somewhat more stable, but the relay could still break down when the battery was connected. We will need to think of a better solution in the next version.

<figure class="ros-figure ros-figure--narrow">
	<img src="../../../images/pcb8.jpg" alt="pcb8" />
	<figcaption>Circuit schematic V2</figcaption>
</figure>

<div class="ros-gallery ros-gallery--pair ros-gallery--pair-full">
	<figure class="ros-figure ros-figure--paired">
		<img src="../../../images/pcb9.jpg" alt="pcb9" />
		<figcaption>PCB layout V2</figcaption>
	</figure>
	<figure class="ros-figure ros-figure--paired ros-gallery--pair-full">
		<img src="../../../images/pcb10.jpg" alt="pcb10" />
		<figcaption>PCB hardware V2</figcaption>
	</figure>
</div>

Because the motors require four CAN buses, we purchased a CAN breakout board. It takes XT60 current input, and its other four CAN plus power interfaces connect to the four motor branches. The CAN signal wires on this board happen to be reversed relative to the motor signal wires, so on the first motor connection the signal wires need to be swapped. The four CAN signals are then converted to USB and connected to the mainboard.

The converter, relay, battery, and CAN breakout board are shown below.

<div class="ros-gallery ros-gallery--compact ros-gallery--league">
	<figure class="ros-figure">
		<img src="../../../images/pcb4.jpg" alt="pcb4" />
		<figcaption>Converter</figcaption>
	</figure>
	<figure class="ros-figure">
		<img src="../../../images/pcb5.jpg" alt="pcb5" />
		<figcaption>Relay</figcaption>
	</figure>
	<figure class="ros-figure">
		<img src="../../../images/pcb6.jpg" alt="pcb6" />
		<figcaption>Battery</figcaption>
	</figure>
	<figure class="ros-figure">
		<img src="../../../images/pcb7.jpg" alt="pcb7" />
		<figcaption>CAN breakout board</figcaption>
	</figure>
</div>
