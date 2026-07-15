# Sim2Real

This section discusses the final real-robot implementation.

## Factors Affecting Sim2Real
The components that most strongly affect Sim2Real are roughly motor parameters > system latency > accuracy of the mechanical model. Therefore, in the real-robot code, the motor parameters must be kept consistent with those used in simulation, and the control loop must not introduce additional delay. Our motor control loop runs at 500 Hz, and the policy control loop runs at 50 Hz. We use IPC as the communication middleware.

The deployment code is available at [mos9-deploy](https://github.com/THMOS2025/mos9-deploy).

## Real-Robot Deployment Results

### AMP
<div class="amp-video-grid">
	<figure class="amp-video-figure">
		<video controls autoplay loop muted playsinline>
			<source src="../../../images/ampreal1.mp4" type="video/mp4">
		</video>
		<figcaption>Forward walking</figcaption>
	</figure>
	<figure class="amp-video-figure">
		<video controls autoplay loop muted playsinline>
			<source src="../../../images/ampreal2.mp4" type="video/mp4">
		</video>
		<figcaption>Lateral walking</figcaption>
	</figure>
	<figure class="amp-video-figure">
		<video controls autoplay loop muted playsinline>
			<source src="../../../images/ampreal3.mp4" type="video/mp4">
		</video>
		<figcaption>Turning</figcaption>
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
			<source src="../../../images/mimicreal1_web.mp4" type="video/mp4">
		</video>
		<figcaption>Kicking</figcaption>
	</figure>
</div>


### Walking on Grass

<div>
	<figure>
		<video controls autoplay loop muted playsinline>
			<source src="../../../images/walkongrass_web.mp4" type="video/mp4">
		</video>
		<figcaption>Walking on grass</figcaption>
	</figure>
</div>


## Summary
In fact, the walking performance is not yet very good, because the training itself is still not good enough. For AMP, one reason is insufficient data; for example, there are only two clips for lateral walking. In addition, robustness is still insufficient. It also feels like there are power-supply issues besides training: if the current is unstable or insufficient, the motor response also becomes unstable.
