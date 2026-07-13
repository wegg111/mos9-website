# XML和USD模型

本节讲解XML和USD导出方式

## XML模型导出
URDF和XML是类似的，区别只是描述方式，所以可以用AI直接生成。Prompt可以直接给“请根据这个URDF来导出XML”。

XML的格式如下，可以看到和URDF非常类似：
```
<body name="base_link" pos="0 0 0.45">
    <inertial pos="-0.01659 -0.00137 0.08826"
            mass="5.71912"
            fullinertia="0.08215553052 0.06587478666 0.03079655054 0.00011239289 0.00069285862 -0.00017794141"/>
    <freejoint name="root_free_joint"/>
    <geom type="mesh" mesh="body" rgba="1 1 1 1" contype="0" conaffinity="0"/>
    <geom name="base_link_col_1" type="cylinder" pos="-0.02 0 0.14"
        size="0.10 0.1" group="3" rgba="0.2 0.8 0.2 0.25"/>
    <site name="imu_in_base_link" pos="0 0 0.1" size="0.01"/>
```

## USD模型导出
USD是IsaacSim和IsaacLab独有的数据结构，所以需要使用IsaacSim来单独导出。

首先打开IsaacSim->File->Import->选取你的机器人URDF路径。

<figure class="ros-figure">
    <img src="../../images/usd1" alt="usd1" />
    <figcaption>导入URDF</figcaption>
</figure>

导入之后会自动生成并保存USD，USD目录结构如下：

```
├── configuration
│   ├── MOS92_urdf_0517_v3_simplified_base.usd
│   ├── MOS92_urdf_0517_v3_simplified_physics.usd
│   ├── MOS92_urdf_0517_v3_simplified_robot.usd
│   └── MOS92_urdf_0517_v3_simplified_sensor.usd
└── MOS92_urdf_0517_v3_simplified.usd
```

<figure class="ros-figure">
    <img src="../../images/usd2" alt="usd2" />
    <figcaption>生成USD</figcaption>
</figure>

导入之后可能会有一个root_joint出现，需要在physics.usd中将它删掉。

<figure class="ros-figure">
    <img src="../../images/usd3" alt="usd2" />
    <figcaption>删除root_joint</figcaption>
</figure>

然后你的USD大概是可以用了，如果还有其他bug通过你的AI解决即可。