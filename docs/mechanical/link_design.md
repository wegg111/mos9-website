# 结构件设计
本节介绍机器人结构件设计

## 整体思路
上一节已经确定好了整体构型，下面无非就是考虑两件事，一是怎么设计连接件能够保证关节活动空间，二是电路板、通讯板、上位机要放在哪。做好了这些机器人基本上就设计好了，下面我们给出MOS9的思路作为参考。

## 胸腔设计
胸腔主要考虑的是电池、电路板、上位机的排布，我们把胸腔分前后两个半区，前半区放电路，后半区放上位机。前半区上面放电路板，下面放电池。前后壳都是3D打印件，为了轻量化。后壳上放了散热孔以及走线孔，后壳下面放电路开关以及电压显示，方便观测电池电量。此外我们还放了TPU的减震材料，目的是机器人摔倒的时候减缓冲击力。


<div class="ros-gallery ros-gallery--pair ros-gallery--pair-full">
    <figure class="ros-figure ros-figure--paired">
        <img class="ros-image--full" src="../../images/body1.png" alt="body1" />
        <figcaption>胸腔前视图</figcaption>
    </figure>
    <figure class="ros-figure ros-figure--paired">
        <img class="ros-image--full" src="../../images/body2.png" alt="body2" />
        <figcaption>胸腔后视图</figcaption>
    </figure>
</div>


## 腿部设计
腿部、手臂、头部都是串联自由度，只需要考虑连杆连接好所有电机即可。这个设计会比较灵活，主要考虑的是结构强度、重量等等细节问题。

由于ENCOS的电机都是单边连接，所以我们设计的转子连接件也都是单边的。如果设计转子双边连接的话需要在电机另一侧装轴承，会增加装配复杂度，对于铝合金来说，加厚的单边连接件和双边连接件强度差不多，所以都采用单边连接，通过侧视图可以看的比较清晰。

<div class="ros-gallery ros-gallery--pair ros-gallery--pair-full">
    <figure class="ros-figure ros-figure--paired">
        <img class="ros-image--full" src="../../images/leg1.jpg" alt="leg1" />
        <figcaption>腿部前视图</figcaption>
    </figure>
    <figure class="ros-figure ros-figure--paired">
        <img class="ros-image--full" src="../../images/leg2.jpg" alt="leg2" />
        <figcaption>腿部侧视图</figcaption>
    </figure>
</div>

## 总体图纸
其他具体细节可以通过打开SolidWorks图纸来查看。

<div class="ros-gallery ros-gallery--pair ros-gallery--pair-full">
    <figure class="ros-figure ros-figure--paired">
        <img class="ros-image--full" src="../../images/wholebody1.jpg" alt="wholebody1" />
        <figcaption>整机前视图</figcaption>
    </figure>
    <figure class="ros-figure ros-figure--paired">
        <img class="ros-image--full" src="../../images/wholebody2.jpg" alt="wholebody2" />
        <figcaption>整机后视图</figcaption>
    </figure>
</div>

我们在做9.1的时候因为找了厂家帮忙画2D图以及机加工，所以我们有一整套的2D图纸。9.2后来用嘉立创CNC，所以没画2D图纸，只有有螺纹孔的画了2D图，下面是部分图纸内容，供参考。


<figure class="ros-figure">
    <img src="../../images/2dgraph.png" alt="2dgraph" />
    <figcaption>MOS9.1 2D图纸</figcaption>
</figure>
