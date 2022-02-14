<script>
	import Controls from './Controls.svelte';
	import micOnIcon from './assets/mic_on.svg';
	import micOffIcon from './assets/mic_off.svg';
	import NoVideoPlaceholder from './NoVideoPlaceholder.svelte';

	export let participant;
	export let callObject;
	export let screen;
	export let screensList;

	let videoTrackSet = false;
	let videoSrc;
	$: videoTrack = participant?.tracks?.video;
	$: screenTrack = screen?.tracks?.screenVideo;
	$: {
		// videoSrc could be a participant track or a screen share so we
		// check for both possibilities.

		// In either case, we wait until the track is playable and then only
		// set it once to avoid rerendering it
		if (!screen && videoTrack.state === 'playable' && !videoTrackSet) {
			videoSrc = new MediaStream([videoTrack.persistentTrack]);
			videoTrackSet = true;
		} else if (screen && screenTrack.state === 'playable' && !videoTrackSet) {
			videoSrc = new MediaStream([screenTrack.track]);
			videoTrackSet = true;
		}
	}

	let audioTrackSet = false;
	let audioSrc;
	$: audioTrack = participant?.tracks?.audio;
	$: {
		// Wait until the track is playable and then only set it once to avoid rerendering it
		if (audioTrack.state === 'playable' && !audioTrackSet) {
			// Use persistentTrack to avoid issues in Safari
			audioSrc = new MediaStream([audioTrack.persistentTrack]);
			audioTrackSet = true;
		}
	}

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
</script>

<div class={screen ? 'video-tile screen' : 'video-tile'}>
	<!-- Add video element when video is playable -->
	{#if !videoSrc}
		<NoVideoPlaceholder {participant} />
	{:else}
		<!-- This will render either the participant video or screen share video -->
		<video
			id={`video-${participant?.session_id || screen?.session_id}`}
			autoPlay
			muted
			playsInline
			use:srcObject={videoSrc}
		/>
	{/if}

	<!-- Hide black video behind name card when video is off -->
	{#if !participant?.video && (!screen || screen?.length === 0)}
		<NoVideoPlaceholder {participant} />
	{/if}

	<!-- Add audio for remote participants (avoid local users hearing their own audio) -->
	{#if !participant?.local && audioSrc}
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

	<!-- Display device controls for the local user -->
	{#if participant?.local}
		<Controls {callObject} {screensList} />
	{/if}
</div>

<style>
	.video-tile {
		position: relative;
		flex: 1 1 350px;
		margin: 10px 20px;
		min-height: 100px;
		display: flex;
	}
	.video-tile.screen {
		flex: 0;
		max-height: 50vh;
	}
	video {
		width: 100%;
		border-radius: 8px;
	}
	.screen video {
		max-height: inherit;
	}
	.audio-icon {
		position: absolute;
		right: 0.5rem;
		bottom: 0.75rem;
		background-color: var(--dark-grey);
		padding: 0.5rem 0.5rem 0.25rem;
		border-radius: 50%;
		opacity: 0.8;
	}
</style>
