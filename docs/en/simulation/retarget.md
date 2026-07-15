# Motion Retargeting

## Retargeting
There are already many explanations of this online, and many people use [GMR](https://github.com/YanjieZe/GMR). We will not go into the principles in detail here. At its core, retargeting converts motion-capture data into robot motion data.


<div class="video-grid">
	<figure class="ros-figure">
		<video controls autoplay loop muted playsinline>
			<source src="../../../images/bvh_rotate.mp4" type="video/mp4">
		</video>
		<figcaption>BVH data</figcaption>
	</figure>
	<figure class="ros-figure">
		<video controls autoplay loop muted playsinline>
			<source src="../../../images/robot_rotate.mp4" type="video/mp4">
		</video>
		<figcaption>Robot data</figcaption>
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


When using GMR, coordinate-frame alignment is particularly important, but much of this can be implemented with AI assistance. The figure below shows alignment between the SMPLX model and the robot model.

<figure class="ros-figure">
	<img src="../../../images/axisalign.jpg" alt="axisalign" />
	<figcaption>Aligning the robot coordinate axes</figcaption>
</figure>

The most critical part of coordinate alignment is rotation, because rotation is the hardest thing to judge correctly. We can first align the coordinate systems themselves, for example by aligning all joint coordinate frames to base_link, and then applying a unified transform to convert them into the SMPLX coordinate frame. In fact, our coordinate systems were not labeled correctly at the beginning. Labeling them in the Booster K1 style is more convenient for the retargeting process.

<div class="ros-gallery ros-gallery--pair">
	<figure class="ros-figure ros-figure--paired">
		<img src="../../../images/retarget1" alt="retarget1" />
		<figcaption>MOS9 joint coordinate frames</figcaption>
	</figure>
	<figure class="ros-figure ros-figure--paired">
		<img src="../../../images/retarget2" alt="retarget2" />
		<figcaption>Booster K1 coordinate frames</figcaption>
	</figure>
</div>

After labeling the axes in the Booster K1 style, all joint axes use a unified coordinate transform to convert to axes consistent with SMPLX:

<figure class="ros-figure">
	<img src="../../../images/retarget3" alt="retarget3" />
	<figcaption>Unified coordinate transform</figcaption>
</figure>

Finally, select your data and run retargeting.
