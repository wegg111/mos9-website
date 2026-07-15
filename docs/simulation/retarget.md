# 运动重定向 Retargeting

## Retargeting
这个网上的讲解有很多，很多人都用[GMR](https://github.com/YanjieZe/GMR)。原理这里不多讲，本质上做的事情是将动捕数据转成机器人动作数据。


<div class="video-grid">
    <figure class="ros-figure">
        <video controls autoplay loop muted playsinline>
            <source src="../../images/bvh_rotate.mp4" type="video/mp4">
        </video>
        <figcaption>BVH数据</figcaption>
    </figure>
    <figure class="ros-figure">
        <video controls autoplay loop muted playsinline>
            <source src="../../images/robot_rotate.mp4" type="video/mp4">
        </video>
        <figcaption>机器人数据</figcaption>
    </figure>

</div>

<style>
.video-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
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


在使用GMR的时候比较重要的是坐标系对齐，但很多都可以用AI帮你实现。下面这个图是实现SMPLX模型和机器人模型对齐。

<figure class="ros-figure">
    <img src="../../images/axisalign.jpg" alt="axisalign" />
    <figcaption>对齐机器人坐标轴</figcaption>
</figure>

坐标系对齐最关键的是旋转，因为旋转不好判断。我们可以先让坐标系对齐，比如先让所有关节坐标系都对齐到base_link，然后通过统一的变换转到SMPLX坐标系下。实际上我们的坐标系在一开始没有标好，按照Booster K1这种方式标对于retarget过程来说比较方便。

<div class="ros-gallery ros-gallery--pair">
    <figure class="ros-figure ros-figure--paired">
        <img src="../../images/retarget1" alt="retarget1" />
        <figcaption>MOS9关节坐标系</figcaption>
    </figure>
    <figure class="ros-figure ros-figure--paired">
        <img src="../../images/retarget2" alt="retarget2" />
        <figcaption>Booster K1坐标系</figcaption>
    </figure>
</div>

标成Booster K1这种轴之后所有关节轴使用统一坐标变换转到SMPLX一致的轴：

<figure class="ros-figure">
    <img src="../../images/retarget3" alt="retarget3" />
    <figcaption>统一坐标变换</figcaption>
</figure>

最后选择你的数据去retarget即可。