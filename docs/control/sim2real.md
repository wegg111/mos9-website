# Sim2Real

本节讲最终真机的代码实现。

## Sim2Real影响因素
Sim2Real影响最大的几个成分大概是 电机参数>系统延迟>机械模型精准度，所以真机代码中要控制电机参数和仿真一致，以及写控制循环的时候不能引入额外延迟。我们电机控制循环为500Hz，policy的控制循环为50Hz。我们使用IPC作为通讯中间件。

部署代码在[mos9-deploy](https://github.com/THMOS2025/mos9-deploy)。

## 真机部署效果

### AMP
<div class="amp-video-grid">
    <figure class="amp-video-figure">
        <video controls autoplay loop muted playsinline>
            <source src="../../images/ampreal1.mp4" type="video/mp4">
        </video>
        <figcaption>向前行走</figcaption>
    </figure>
    <figure class="amp-video-figure">
        <video controls autoplay loop muted playsinline>
            <source src="../../images/ampreal2.mp4" type="video/mp4">
        </video>
        <figcaption>横移</figcaption>
    </figure>
    <figure class="amp-video-figure">
        <video controls autoplay loop muted playsinline>
            <source src="../../images/ampreal3.mp4" type="video/mp4">
        </video>
        <figcaption>旋转</figcaption>
    </figure>
</div>

<style>
.amp-video-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 16px;
    align-items: start;
}

.amp-video-grid .amp-video-figure {
    margin: 0;
    text-align: center;
}

.amp-video-grid video {
    width: 100%;
    max-width: 100%;
    height: auto;
    border-radius: 8px;
}

.amp-video-grid figcaption {
    margin-top: 8px;
    font-size: 0.9em;
    color: #666;
}

@media (max-width: 768px) {
    .amp-video-grid {
        grid-template-columns: 1fr;
    }
}
</style>

### Mimic
<div>
    <figure>
        <video controls autoplay loop muted playsinline>
            <source src="../../images/mimicreal1_web.mp4" type="video/mp4">
        </video>
        <figcaption>踢球</figcaption>
    </figure>
</div>


### 草地行走

<div>
    <figure>
        <video controls autoplay loop muted playsinline>
            <source src="../../images/walkongrass_web.mp4" type="video/mp4">
        </video>
        <figcaption>草地上行走</figcaption>
    </figure>
</div>


## 总结
其实走的没有很好，因为训练的其实还不够好。AMP的话是因为缺数据，比如横移只有2条数据。然后鲁棒性还不够，感觉除了训练还有电源的问题，电流不稳定或者电流不够的情况下电机响应会不稳定。