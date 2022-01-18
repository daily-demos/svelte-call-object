<script>
	import { createEventDispatcher } from 'svelte';

	const dispatch = createEventDispatcher();

	const tryAgain = () => {
		dispatch('clear-device-error');
	};
</script>

<div class="wrapper">
	<div class="permissions-card">
		<h2>Camera or mic blocked</h2>
		<p>Update your browser device permissions to join call.</p>
		<button on:click={tryAgain}>Try again</button>
		<a
			href="https://help.daily.co/en/articles/2528184-unblock-camera-mic-access-on-a-computer"
			rel="noreferrer noopener"
			target="_blank"
		>
			Get help
		</a>
	</div>
</div>

<style scoped>
	.wrapper {
		display: flex;
		justify-content: center;
		align-items: center;
		height: 100%;
	}
	.permissions-card {
		background-color: var(--blue);
		border-radius: 16px;
		margin: 10px 20px;
		flex: 1 1 350px;
		max-width: 480px;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		padding: 2px 0;
		aspect-ratio: 16/9;
	}
	h2 {
		color: var(--red);
		margin: 0;
		font-size: 1.25rem;
	}
	button {
		color: var(--white);
		background-color: var(--dark-blue);
		border: none;
		font-size: 12px;
		border: 1px solid var(--blue);
		border-radius: 8px;
		padding: 8px 12px;
		cursor: pointer;
		margin: 16px;
	}
	p {
		color: var(--white);
		margin-bottom: 0;
	}
	a {
		color: var(--white);
		text-decoration: underline;
		font-size: 12px;
	}
</style>
