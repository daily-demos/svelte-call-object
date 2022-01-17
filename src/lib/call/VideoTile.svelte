<script>
	import { onMount } from 'svelte';
	import Controls from './Controls.svelte';
	import micOnIcon from './assets/mic_on.svg';
	import micOffIcon from './assets/mic_off.svg';

	export let participant;
	let videoSrc;
	let audioSrc;

	/**
	 * Set the video stream (Svelte-specific workaround via
	 * https://github.com/sveltejs/svelte/issues/3492#issuecomment-583794947)
	 */
	function srcObject(node, stream) {
		console.log(node, stream);
		node.srcObject = stream;
		return {
			update(newStream) {
				if (node.srcObject != newStream) {
					node.srcObject = newStream;
				}
			}
		};
	}

	onMount(() => {
		const videoTrack = participant?.tracks?.video?.persistentTrack;
		videoSrc = new MediaStream([videoTrack]);
		const audioTrack = participant?.tracks?.audio?.persistentTrack;
		audioSrc = new MediaStream([audioTrack]);
	});
</script>

<div class="video-tile">
	<video
		id={`video-${participant?.session_id}`}
		autoPlay
		muted
		playsInline
		use:srcObject={videoSrc}
	/>
	<!-- Add audio for remote participants (avoid local users hearing their own audio) -->
	{#if !participant?.local}
		<audio id={`audio-${participant?.session_id}`} autoPlay playsInline use:srcObject={audioSrc}>
			<track kind="captions" />
		</audio>
	{/if}

	<!-- Add audio icon when video is on for remote participants -->
	{#if participant?.video && !participant?.local}
		<span class="audio-icon">
			<img src={participant?.audio ? micOnIcon : micOffIcon} alt="Toggle local audio" />
		</span>
	{/if}

	<!-- Add placeholder view when video is off with the participant's name -->
	{#if !participant?.video}
		<div class="video-placeholder">
			<span class="name">{participant?.user_name || 'Guest'}</span>
			<img src={participant?.audio ? micOnIcon : micOffIcon} alt="Toggle local audio" />
		</div>
	{/if}
	<!-- Display device controls for the local user -->
	{#if participant?.local}
		<Controls />
	{/if}
</div>

<style>
	.video-tile {
		position: relative;
		max-width: 50%;
		flex: 1 1 350px;
		margin: 10px 20px;
		position: relative;
	}
	video {
		width: 100%;
		border-radius: 8px;
	}
	.video-placeholder {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		aspect-ratio: 16/9;
		border-radius: 8px;
		background-color: var(--blue);
		z-index: 10;
		display: flex;
		justify-content: center;
		align-items: center;
		color: var(--white);
	}
	.name {
		margin-right: 0.75rem;
	}
	.audio-icon {
		position: absolute;
		right: 1rem;
		bottom: 1rem;
	}
</style>
