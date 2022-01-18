<script>
	import { goto } from '$app/navigation';
	import {} from '../../store';
	import camOnIcon from './assets/vid_on.svg';
	import camOffIcon from './assets/vid_off.svg';
	import micOnIcon from './assets/mic_on.svg';
	import micOffIcon from './assets/mic_off.svg';
	import screenIcon from './assets/screen.svg';
	import leaveIcon from './assets/leave_call.svg';

	export let callObject;
	$: camOn = callObject?.localVideo();
	$: micOn = callObject?.localAudio();

	const toggleVideo = () => {
		if (!callObject) return;
		const currentVid = callObject.localVideo();
		camOn = !currentVid;
		callObject.setLocalVideo(!currentVid);
	};
	const toggleAudio = () => {
		if (!callObject) return;
		const currentAudio = callObject.localAudio();
		micOn = !currentAudio;
		callObject.setLocalAudio(!currentAudio);
	};
	const toggleScreenShare = () => {
		if (!callObject) return;
		// TODO: check if screenshare is supported co.supportedBrowser?.()?.supportsScreenShare;

		const isScreenSharing = Object.values(callObject.participants()).filter(
			(p) => p?.screen && p?.local
		);
		if (isScreenSharing?.length) {
			callObject.stopScreenShare();
		} else {
			callObject.startScreenShare();
		}
	};
	const leaveCall = async () => {
		if (!callObject) return;
		await callObject.leave();
		await callObject.destroy();
		document?.body?.classList?.remove('in-call');
		goto(`/`);
	};
</script>

<div class="controls-container">
	<div class="devices">
		<button on:click={toggleVideo}>
			<img src={camOn ? camOnIcon : camOffIcon} alt="Toggle local video" />
		</button>
		<button on:click={toggleAudio}>
			<img src={micOn ? micOnIcon : micOffIcon} alt="Toggle local audio" />
		</button>
		<button on:click={toggleScreenShare}><img src={screenIcon} alt="Toggle screen share" /></button>
	</div>
	<button class="leave" on:click={leaveCall}><img src={leaveIcon} alt="Leave call" /></button>
</div>

<style>
	img {
		height: 24px;
	}
	.controls-container {
		position: absolute;
		bottom: 12px;
		left: 8px;
		justify-content: space-between;
		display: flex;
		width: calc(100% - 16px);
		z-index: 20;
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
	button.leave {
		background-color: var(--red);
		opacity: 0.85;
		padding: 14px 16px 15px;
		border-radius: 12px;
	}
</style>
