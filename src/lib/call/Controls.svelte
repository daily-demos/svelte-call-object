<script>
	import { goto } from '$app/navigation';
	import { callObject } from '../../store';
	import camOnIcon from './vid_on.svg';
	import camOffIcon from './vid_off.svg';
	import micOnIcon from './mic_on.svg';
	import micOffIcon from './mic_off.svg';
	import screenIcon from './screen.svg';
	import { onMount } from 'svelte';

	let co;
	let camOn = false;
	let micOn = false;
	// TODO: check if screenshare is supported co.supportedBrowser?.()?.supportsScreenShare;
	let showScreenShareButton = true;

	onMount(() => {
		if (!co) return;

		camOn = co.localVideo();
		micOn = co.localAudio();
	});

	callObject.subscribe((value) => {
		co = value;
	});

	const toggleVideo = () => {
		if (!co) return;
		const currentVid = co.localVideo();
		camOn = !currentVid;
		co.setLocalVideo(!currentVid);
	};
	const toggleAudio = () => {
		if (!co) return;
		const currentAudio = co.localAudio();
		micOn = !currentAudio;
		co.setLocalAudio(!currentAudio);
	};
	const toggleScreenShare = () => {
		if (!co) return;
		// TODO: toggle screen share via button
		const currentAudio = co.startScreenShare();
	};
	const leaveCall = async () => {
		if (!co) return;
		await co.leave();
		co.destroy();
		goto(`/`);
	};
</script>

<div class="controls-container">
	<div class="devices">
		<button on:click={toggleVideo}>
			<img src={camOn ? camOnIcon : camOffIcon} alt="Toggle local video" />
		</button>
		<button on:click={toggleAudio}
			><img src={micOn ? micOnIcon : micOffIcon} alt="Toggle local audio" /></button
		>
		<button on:click={toggleScreenShare}><img src={screenIcon} alt="Toggle screen share" /></button>
	</div>
	<button on:click={leaveCall}> leave</button>
</div>

<style>
	.controls-container {
		position: absolute;
		bottom: 12px;
		left: 8px;
		justify-content: space-between;
		display: flex;
		width: calc(100% - 16px);
	}
	.devices {
		border-radius: 12px;
		background-color: #121a24;
		opacity: 0.85;
		padding: 14px 10px 15px;
	}
	button {
		background-color: transparent;
		border: none;
		cursor: pointer;
	}
</style>
