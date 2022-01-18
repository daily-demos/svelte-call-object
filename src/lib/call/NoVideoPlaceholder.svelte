<script>
	import micOnIcon from './assets/mic_on.svg';
	import micOffIcon from './assets/mic_off.svg';
	export let participant;
</script>

<div class="video-placeholder">
	<span class="name">{participant?.user_name || 'Guest'}</span>
	<img src={participant?.audio ? micOnIcon : micOffIcon} alt="Toggle local audio" />
</div>

<style>
	.video-placeholder {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
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
</style>
