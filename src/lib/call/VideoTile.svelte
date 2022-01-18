<script>
	import { onMount, createEventDispatcher } from 'svelte';
	import Controls from './Controls.svelte';
	import micOnIcon from './assets/mic_on.svg';
	import micOffIcon from './assets/mic_off.svg';
	import NoVideoPlaceholder from './NoVideoPlaceholder.svelte';

	const dispatch = createEventDispatcher();

	export let participant;
	export let callObject;
	export let screen;

	const INTERVAL_DELAY = 1500;
	let videoSrc;
	let audioSrc;
	let videoInterval;
	let audioInterval;

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

	const initializeTracks = () => {
		/**
		 * Handle mounting issue where tracks may still be loading when the
		 * tile first mounts. Update callObject value in parent component if it's
		 * loading.
		 * Note: We use persistantTrack to avoid audio bugs in Safari.
		 */
		videoInterval = setInterval(() => {
			console.log('[video state]', participant?.tracks?.video?.state);
			if (participant?.tracks?.video?.state === 'loading') {
				dispatch('update-participants');
			} else {
				videoSrc = new MediaStream([participant?.tracks?.video?.persistentTrack]);
				// Clear loading svg in parent component when the video is ready
				dispatch('loaded');
				clearInterval(videoInterval);
			}
		}, INTERVAL_DELAY);

		audioInterval = setInterval(() => {
			console.log('[audio state]', participant?.tracks?.audio?.state);
			if (participant?.tracks?.audio?.state === 'loading') {
				dispatch('update-participants');
			} else {
				audioSrc = new MediaStream([participant?.tracks?.audio?.persistentTrack]);
				clearInterval(audioInterval);
			}
		}, INTERVAL_DELAY);
	};
	const initializeScreen = () => {
		videoSrc = new MediaStream([screen?.screenVideoTrack]);
	};

	onMount(() => {
		if (screen) {
			/**
			 * Render screen share video track.
			 * We're not currently considering a possible screenAudioTrack.
			 */
			initializeScreen();
		} else {
			/**
			 * Render the video and audio tracks for the participant.
			 */
			initializeTracks();
		}
	});
</script>

<div class={screen ? 'video-tile screen' : 'video-tile'}>
	<!-- Add video element when video is playable -->
	{#if !videoSrc}
		<NoVideoPlaceholder {participant} />
	{:else}
		<video
			id={`video-${participant?.session_id || screen?.session_id}`}
			autoPlay
			muted
			playsInline
			use:srcObject={videoSrc}
		/>
	{/if}

	<!-- Hide black video behind name card when video is off -->
	{#if !participant?.video && !screen}
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
		<Controls {callObject} />
	{/if}
</div>

<style>
	.video-tile {
		position: relative;
		flex: 1 1 350px;
		margin: 10px 20px;
		min-height: 100px;
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
