# 电路设计及PCB制作

## 电路设计
上一节梳理了电路设计需求，我们电路需求如下框图：
```mermaid
flowchart LR
    A[电池48V] --> B[电机开关]
    B --> B1[电机]

    A --> C[变压器48V->19V]
    A --> D[数字电压显示]

    C --> C1[主板开关]
    C1 --> C2[Orin AGX]
    C2 --> D1[IMU]
    C2 --> D2[相机]
    C2 --> D3[电机CAN总线]

    D3 <-.-> B1
```

第一版设计的时候我们直接采用NMOS管做开关；买的变压器用于电压转换（模块支持30-60V输入，19V、5A输出）。这个电路在电流比较小的情况下可以稳定实现他的功能，但是由于20个电机峰值电流比较大，而且会有浪涌电流，导致MOS管开关多次会被烧坏。

<figure class="ros-figure ros-figure--narrow">
    <img src="../../images/pcb1.png" alt="pcb1" />
    <figcaption>电路原理图V1</figcaption>
</figure>

<div class="ros-gallery ros-gallery--pair">
    <figure class="ros-figure ros-figure--paired">
        <img src="../../images/pcb2.png" alt="pcb2" />
        <figcaption>PCB Layout V1</figcaption>
    </figure>
    <figure class="ros-figure ros-figure--paired">
        <img src="../../images/pcb3.png" alt="pcb3" />
        <figcaption>PCB实物图V1</figcaption>
    </figure>
</div>


第二版设计加入了一个继电器,电路变稳定了一些，但是在接入电池的时候还是会击穿继电器。下一版再想想办法。

<figure class="ros-figure ros-figure--narrow">
    <img src="../../images/pcb8.jpg" alt="pcb8" />
    <figcaption>电路原理图V2</figcaption>
</figure>

<div class="ros-gallery ros-gallery--pair ros-gallery--pair-full">
    <figure class="ros-figure ros-figure--paired">
        <img src="../../images/pcb9.jpg" alt="pcb9" />
        <figcaption>PCB Layout V2</figcaption>
    </figure>
    <figure class="ros-figure ros-figure--paired ros-gallery--pair-full">
        <img src="../../images/pcb10.jpg" alt="pcb10" />
        <figcaption>PCB实物图V2</figcaption>
    </figure>
</div>

由于电机需要4路CAN总线，所以我们买了一个CAN转接板，XT60输入电流，其他四个CAN+电源线的接口接4路电机。这个板子的CAN信号线和电机信号线刚好相反，所以第一个电机连线需要把信号线反过来。然后4路CAN信号转成USB连接到主板上。

如下为变压器、继电器、电池、CAN转接板。

<div class="ros-gallery ros-gallery--compact ros-gallery--league">
    <figure class="ros-figure">
        <img src="../../images/pcb4.jpg" alt="pcb4" />
        <figcaption>变压器</figcaption>
    </figure>
    <figure class="ros-figure">
        <img src="../../images/pcb5.jpg" alt="pcb5" />
        <figcaption>继电器</figcaption>
    </figure>
    <figure class="ros-figure">
        <img src="../../images/pcb6.jpg" alt="pcb6" />
        <figcaption>电池</figcaption>
    </figure>
    <figure class="ros-figure">
        <img src="../../images/pcb7.jpg" alt="pcb7" />
        <figcaption>CAN转接板</figcaption>
    </figure>
</div>
