# 项目背景

<div class="ros-hero">
    <p class="ros-hero__eyebrow"></p>
    <p class="ros-hero__lead">
        介绍一下RoboCup，清华机器人团队，以及MOS-9
    </p>
</div>

## THMOS 和 RoboCup
RoboCup（Robot World Cup Initiative），即机器人世界杯，是国际上主要的科研导向的机器人竞赛之一。该赛事创立初衷是为了促进人工智能、机器人学及相关领域的研究与发展。大多数都是高校团队参加比赛，参赛队伍需要制作自己的机器人，所以这个比赛非常考验团队机器人系统开发能力。

THMOS（Tsinghua Master of Soccsr）是一个清华FuRoC（Future Robot Club）社团旗下的一个机器人足球队。FuRoC总共有3支队伍，每年都会参加机器人世界杯（RoboCup），其中包括THMOS队（简称MOS队）、火神队（Hephaestus）、Tinker队。三个队伍参加三个组别的赛事，分别是Humanoid League KidSize、Humanoid League AdultSize、@Home组别。

可能众所周知的是清华自动化系火神队，因为他们25年获得了RoboCup冠军，这是整个团队一直追求的目标。我是自动化系的同学，我并没有加入火神队，是因为我在22年加入社团时火神队已经有几年没有参加比赛，当时火神队内并没有人，直到24年火神队才重新参加Adult组别的比赛。所以在22年加入FuRoC时社团只有两个队伍，我一直在THMOS队伍中参与Kid-Size人形机器人的开发。

RoboCup有很多组别的比赛，比如Soccer，专注于足球比赛；Rescue面向救援场景；@Home面向家庭场景；Industrial面向工业场景；RoboCupJunior是高中生的比赛。RoboCup Soccer中包含Humanoid League（Major）、Standard Platform League（SPL）、Small Size League（SSL）、Middle Size League（MSL），Humanoid League中又分Kid-Size和Adult-Size（2025年及以前，2026年开始改为Small、Middle、Large三个组别）。
<figure class="ros-figure ros-figure--narrow">
    <img src="../robocup_image/robocup2024.JPG" alt="RoboCup2024" />
    <figcaption>RoboCup2024</figcaption>
</figure>


其中Humanoid League（Major）就是人形机器人踢足球，2025年及以前是每个队伍自己研制机器人参加比赛。由于人形机器人系统非常复杂，Major组别的比赛更看重系统集成能力，谁能制造出更好的硬件平台，应用更好的运动控制算法，谁就更有机会赢得比赛。Standard Platform League是采用公司制作的标准平台，之前的标准平台只有一个就是NAO机器人，由于硬件一致，队伍的胜负只取决于感知、定位、规划决策算法。所以这个组别的队伍在软件层面要远优于Major组别。Small Size League和Middle Size League是多轮小车作为球员在球场上比赛，他们的比赛不看重硬件平台，并且Small Size采用全局定位，所以更加注重决策算法，因此他们的比赛有更多策略的博弈。
<div class="ros-gallery ros-gallery--compact ros-gallery--league">
    <figure class="ros-figure">
        <img src="../robocup_image/adult_play4.JPG" alt="Humanoid Adult" />
        <figcaption>Humanoid Adult</figcaption>
    </figure>
    <figure class="ros-figure">
        <img src="../robocup_image/k1_vs_rhoban.JPG" alt="Humanoid Kid" />
        <figcaption>Humanoid Kid</figcaption>
    </figure>
    <figure class="ros-figure">
        <img src="../robocup_image/nao.JPG" alt="Standard Platform League" />
        <figcaption>Standard Platform League</figcaption>
    </figure>
    <figure class="ros-figure">
        <img src="../robocup_image/small_group.JPG" alt="Small Size League" />
        <figcaption>Small Size League</figcaption>
    </figure>
</div>

THMOS参加的是Humanoid League Kid-Size组别，是自研机器人平台进行比赛。在22年我大一刚加入社团的时候，机器人只有一个躯壳，上面的算法都不work。我最初参与视觉的工作，用YOLO目标检测算法识别球场上的机器人、球、门柱以及边角点。下图是我们在2022-2023年使用的机器人，名叫mos8（是因为这个是团队第8代机器人，虽然我并没有见过8代以前的机器人）。这个机器人使用单目相机，Dynamixel的舵机，算力是TX2，行走用的ZMP，跌倒爬起用的手调动态序列。机器人性能很差，吴奇学长很强，他带我们搞定各个模块，成功让它学会了踢球。

<div class="ros-gallery ros-gallery--pair">
    <figure class="ros-figure ros-figure--paired">
        <img src="../robocup_image/mos8.JPG" alt="2023年参赛的机器人mos8" />
        <figcaption>2023年参赛的机器人mos8</figcaption>
    </figure>
    <figure class="ros-figure ros-figure--paired">
        <img src="../robocup_image/2023France.jpg" alt="RoboCup2023 法国波尔多" />
        <figcaption>RoboCup2023 法国波尔多</figcaption>
    </figure>
</div>

由于疫情，22年RoboCup世界赛在线上举行仿真赛，很有幸，23年去法国参加了比赛，也是疫情原因，很多机器人都退步了，但是我们这一年取得了不小的进步，从一个不能动的机器人到让它能够踢球。我们在世界赛中有4粒进球，并且获得了第4的成绩。我们在比赛当中见到了一些很强的对手，比如来自法国本土的Rhoban队，他们以优秀的机械设计以及出色的传接球决策算法赢得了23年的冠军。来自日本的CIT队伍虽然有很出色的机械设计，但是软件略逊一筹获得亚军。这让我们意识到想要获得这个组别的冠军需要在机械本体、系统设计、视觉定位、规划决策上做的都很优秀。

<div class="ros-gallery ros-gallery--teams">
    <figure class="ros-figure ros-figure--team">
        <img src="../robocup_image/cit2.JPG" alt="CIT" />
        <figcaption>CIT 2024冠军</figcaption>
    </figure>
    <figure class="ros-figure ros-figure--team">
        <img src="../robocup_image/Rhoban2.JPG" alt="Rhoban" />
        <figcaption>Rhoban 2023冠军</figcaption>
    </figure>
    <figure class="ros-figure ros-figure--team">
        <img src="../robocup_image/ZJUdancer.JPG" alt="ZJU Dancer" />
        <figcaption>ZJU Dancer 浙大曾获得过亚军的成绩</figcaption>
    </figure>
    <figure class="ros-figure ros-figure--team">
        <img src="../robocup_image/kerean.JPG" alt="Korean Team" />
        <figcaption>Korean Team</figcaption>
    </figure>
    <figure class="ros-figure ros-figure--team">
        <img src="../robocup_image/kidsizerobot.JPG" alt="Kid-Size Robot" />
        <figcaption>Kid-Size Robot</figcaption>
    </figure>
    <figure class="ros-figure ros-figure--team">
        <img src="../robocup_image/NUbots2.JPG" alt="NUbots" />
        <figcaption>NUbots</figcaption>
    </figure>
</div>

2023年开始出现越来越多的伺服电机驱动的机器人，比如RoMeLa的ARTEMIS，Agility Robotics的Cassie，傅利叶的GR-1，宇树的H1，伺服电机功率密度大，动态性能好，并且能做位控力控，成为了下一代机器人的必然选择。但Kid-Size的比赛此时还都使用舵机，舵机功率密度小，想要提升动态性能，就要采用下一代执行器。我们想做下一代Kid-Size机器人，于是我们开始考虑开发新一代机器人。

从23年开始我们就从构型上设计下一代机器人，但是由于种种原因，下一代机器人的研发被中断。24年我们的进展只有将TX2升级为Orin Nano，单目相机换成了双目相机Zed Mini，并且更新了定位算法。虽然踢球的效果好了很多，但是在8强赛上对方的机器人走路非常稳定，我们的机器人一碰就倒，导致没有进球，遗憾止步。

RoMeLa是很早就开始做伺服电机驱动的机器人，他们自己设计电机，以及整个机器人系统。Adult-Size对于学校团队很难，因为人形研发消耗的资源很多，所以这个组别的队伍只有4-5支，并且场上每个队伍只有两个机器人。但Dennis Hong非常喜欢RoboCup，他们努力了很久，终于在24年决赛当中击败了传统强队NimbRo，获得了冠军，也证明了伺服电机机器人就是要优于传统舵机驱动的机器人。那一年很有幸见证了RoMeLa赢得冠军，和Dennis Hong合了影，并且交流了很多机器人设计的内容。

23年加速进化成立，他们几个月时间内搓出来一个人形机器人，公司人员作为主要队员参加24年的比赛，火神队就是这时候重新参加RoboCup。但他们还是采用之前MPC+WBC的方案，优化的时间没有RoMeLa那么长，所以性能还比不上RoMeLa。但是T1的雏形已经有了，他们在未来会加速进化。

THMOS在23年和傅利叶合作，傅利叶用GR-1机器人支持我们参加Adult组别比赛，但GR-1并不是根据赛事设计的机器人，很多设计比如身高、体重、头部设计都不是最优解，并且运动控制能力不是很强，而且几个人组成的本科生团队工程能力并不强，所以我们并没有取得好成绩，但是也算是做了一次尝试。
<div class="ros-gallery ros-gallery--teams">
    <figure class="ros-figure ros-figure--team">
        <img src="../robocup_image/T12024_3.JPG" alt="T1 2024" />
        <figcaption>Booster T1 2024</figcaption>
    </figure>
    <figure class="ros-figure ros-figure--team">
        <img src="../robocup_image/T12024_pickup.JPG" alt="T1 Pickup" />
        <figcaption>T1 Pickup</figcaption>
    </figure>
    <figure class="ros-figure ros-figure--team">
        <img src="../robocup_image/romela3.JPG" alt="RoMeLa" />
        <figcaption>RoMeLa</figcaption>
    </figure>
    <figure class="ros-figure ros-figure--team">
        <img src="../robocup_image/kerean_adult.JPG" alt="Korean Adult Team" />
        <figcaption>Korean Adult Team HERoEHS</figcaption>
    </figure>
    <figure class="ros-figure ros-figure--team">
        <img src="../robocup_image/adult_play4.JPG" alt="NimbRo" />
        <figcaption>NimbRo VS RoMeLa</figcaption>
    </figure>
    <figure class="ros-figure ros-figure--team">
        <img src="../robocup_image/adult_size_play.JPG" alt="Adult Size Play" />
        <figcaption>HERoEHS VS RoMeLa</figcaption>
    </figure>
</div>


## MOS-9
2024年是一个重大的失利，我们本该取得更好的成绩，我们需要做更多的工作，但我们的工作始终不及预期。在清华，很少有人能几年坚持一件事，也很少有人能一直在这个社团中留下来，每年比赛过后至少会有一半的队员会离开队伍。其他国外队伍的学生可以通过RoboCup的项目来毕业（本科硕士都有），国内其他队伍比如浙大前几年可以通过比赛成绩保研，或者有些学校可以加综测。但是在清华你不会获得任何额外的奖励，甚至有可能因为在比赛花很多时间导致耽误成绩和发paper，所有人都是用爱发电，其实这个比例在清华非常少，所以我们一直很缺人和时间来开发。

24年参加比赛的十几个人中应该只有四五个留了下来，金印和我依然想做下一代机器人，于是我们开始认真设计mos9，做一个伺服电机驱动的Kid-Size人形足球机器人。起初我们做机械设计都很困难，因为即使是机械系也不教你做机械设计的很多细节，比如如何设计构型、如何设计连杆、板件结构，如何考虑强度、整体重量，甚至是走线我们都没有经验。所以我们买了一个拓竹的打印机，在机加工之前能够用打印件做机械的验证，从而加快开发进度。其实我们做的速度并不慢，在25年我们已经做出来了整机。不幸的是我们买的大然电机质量很差，甚至调不了位置控制环的Kp、Kd，导致和仿真中响应差的很多。在仿真中训练的policy无法迁移到真机上。

<div class="ros-gallery ros-gallery--pair ros-gallery--pair-full">
    <figure class="ros-figure ros-figure--paired">
        <img class="ros-image--full" src="../robocup_image/mos91front.png" alt="mos91 front" />
        <figcaption>mos9.1 正面</figcaption>
    </figure>
    <figure class="ros-figure ros-figure--paired">
        <img class="ros-image--full" src="../robocup_image/mos91back.png" alt="mos91 back" />
        <figcaption>mos9.1 背面</figcaption>
    </figure>
</div>

但这一年加速进化更新的非常快，他们的T1机器人已经非常完整，并且他们也做出来了一个小尺寸人形机器人K1。K1在25年就被用在了Kid-Size比赛上。我们的指导老师刘莉和加速进化交谈的很融洽，加速进化的人说会在比赛前赞助我们几台K1用来比赛，希望我们两个队伍都拿世界冠军。

25年世界赛改了很多规则，比如之前规定不能使用主动双目，所以大家统一使用Zed系列被动双目，25年更改可以使用Realsense系列。大仿人的规则需要机器人有跌倒爬起的能力（与Kid-Size对齐），所以24年的冠军RoMeLa在25年无法参加比赛；Kid-Size也改了一些规则，比如Major组别允许使用商业化机器人（以往商业化机器人都是在Standard Platform League组别，比如NAO机器人）。25年大仿人的比赛只有清华火神队、THMOS队、UT Austin、中国农大山海队，24年的NimbRo。其中火神队、UT Austin、山海队使用加速进化赞助的T1，我们使用宇树的G1。加速进化这一年进步非常多，火神队取得了冠军，这是清华参加比赛十几年来第一次获取RoboCup冠军，也是国内在RoboCup Humanoid组别的第一次冠军。

Kid-Size同样来了很多传统强队，比如Rhoban。但是我们MOS队和德国HTWK使用加速进化K1机器人，场上的机器人有代际差异，K1在场上有压倒性的优势，即使是23年冠军Rhoban，在拥有很强的软件系统的情况下也无法在K1面前取得优势。两个拥有K1的队伍在决赛会面，但是HTWK之前是参与Standard Platform League的队伍，他们之前不需要做硬件与控制的内容，所以在感知定位、规划决策的软件方面有十几年的经验和积累，在这方面要远比我们强，在最终的比赛中我们取得了第二名的成绩。

<div class="ros-gallery ros-gallery--pair">
    <figure class="ros-figure ros-figure--paired">
        <img src="../robocup_image/T1_and_G1.JPG" alt="T1 and G1" />
        <figcaption>T1 and G1</figcaption>
    </figure>
    <figure class="ros-figure ros-figure--paired">
        <img src="../robocup_image/k1_vs_rhoban.JPG" alt="K1 vs Rhoban" />
        <figcaption>THMOS vs Rhoban</figcaption>
    </figure>
    <figure class="ros-figure ros-figure--paired">
        <img src="../robocup_image/2025htwk_vs_thmos.JPG" alt="2025 HTWK vs THMOS" />
        <figcaption>2025 HTWK vs THMOS</figcaption>
    </figure>
    <figure class="ros-figure ros-figure--paired">
        <img src="../robocup_image/Cup_.jpg" alt="Cup" />
        <figcaption>第二名奖杯</figcaption>
    </figure>
</div>


又过了一年，MOS 9.2做出来了，并且我们搞懂了怎么将policy Sim2Real。但是此时已经太晚了，国内人形机器人发展的飞快，K1现在已经性能很强了，MOS9已经不具备与K1竞争的能力，并且现在国内有了很多小尺寸人形机器人。MOS9并不稳定，因为并不是公司的产品，没人做QC，很多机械设计上的细节都做的不是很好。但毕竟是学生作品，几个学生在日常学习、科研时间中压榨出来的课外时间能够做出来一个完整的人形机器人已经是极限了。

<div class="ros-gallery ros-gallery--pair ros-gallery--pair-full">
    <figure class="ros-figure ros-figure--paired">
        <img class="ros-image--full" src="../robocup_image/mos92front.JPG" alt="mos92 front" />
        <figcaption>mos9.2 正面</figcaption>
    </figure>
    <figure class="ros-figure ros-figure--paired">
        <img class="ros-image--full" src="../robocup_image/mos92back.JPG" alt="mos92 back" />
        <figcaption>mos9.2 背面</figcaption>
    </figure>
</div>


26年又改了很多规则，Standard Platform League从比赛中删除，RoboCup不再鼓励自研机器人，而是比赛中可以使用任意平台。所以26年比赛赛场上大部分都是加速进化T1、K1，高擎的Pi-Plus。国内队伍蜂拥而至，比如北信科、武汉大学、湖南大学、农大、北京矿业大学，在25年以前只有清华和浙大参赛。还有之前的标准平台组的队伍比如B-Human（在标准平台组获得过十几年冠军），拥有很强的软件系统能力，在新的比赛规则中有很大的优势。

由于硬件平台都是一样的，整机自研能力相对不再是最核心的竞争点，比赛相当于合并成了标准平台组，团队更关注视觉定位、规划决策的软件算法，而较少考虑机械、系统、以及运动控制部分的内容。MOS队由于近几年积累的内容更偏向于整机系统，所以在新的比赛规则中处于弱势，如果想在比赛中获取竞争力，需要将更多精力投入软件开发中。


## 结语

有人觉得MOS9已经失去了意义，它很难具备和商业化机器人竞争的能力，MOS队很难依靠它取得好成绩。但MOS9设计之初就是一个开源项目，它不只是希望赢得比赛，也希望以此作为开放平台提升RoboCup社区的系统开发能力，推动社区技术进步。因此我们开源MOS9的模型、代码以及设计思路，希望此项目能够为机器人初学者提供较全面的机器人系统知识，为以后的机器人开发者提供设计参考。



