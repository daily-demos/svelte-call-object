<script>
	import { page } from '$app/stores';
</script>

<div class="waiting-tile">
	<h2>Waiting for others!</h2>
	<h3>Invite someone by sharing this link:</h3>
	<p>{$page.url.href}</p>
</div>

<style>
	.waiting-tile {
		position: relative;
		flex: 1 1 350px;
		margin: 10px 20px;
		position: relative;
		width: 100%;
		aspect-ratio: 16/9;
		border-radius: 8px;
		background-color: var(--blue);
		display: flex;
		justify-content: center;
		align-items: center;
		flex-direction: column;
	}
	h2 {
		color: var(--turquoise);
		font-size: 1.25rem;
		margin: 0.25rem;
	}
	h3 {
		color: var(--white);
		font-size: 1.25rem;
		font-weight: normal;
		margin: 0.25rem;
		text-align: center;
	}
	p {
		color: var(--white);
		font-size: 0.75rem;
		word-break: break-word;
	}
</style>
