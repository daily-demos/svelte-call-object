<script>
	import { onMount } from 'svelte';

	export let participant;
	let videoSrc;

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
	});
</script>

<div class="video-tile">
	{#if participant?.video && videoSrc}
		<video id={participant?.session_id} autoPlay muted playsInline use:srcObject={videoSrc} />
	{:else}
		<p>video off</p>
	{/if}
</div>
