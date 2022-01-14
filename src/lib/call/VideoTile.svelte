<script>
	import { onMount } from 'svelte';
	import Controls from './Controls.svelte';

	export let participant;
	let videoSrc;
	let audioSrc;

	/**
	 * Set the video stream (Svelte-specific workaround via
	 * https://github.com/sveltejs/svelte/issues/3492#issuecomment-583794947)
	 */
	function srcObject(node, stream) {
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
		const audioTrack = participant?.tracks?.video?.persistentTrack;
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
	<!-- Add placeholder view when video is off with the participant's name -->
	{#if !participant?.video}
		<div class="video-placeholder">video off</div>
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
	}
</style>
