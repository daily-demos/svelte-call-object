<script context="module">
	export const prerender = true;
</script>

<script>
	import RoomForm from '$lib/forms/RoomForm.svelte';
</script>

<svelte:head>
	<title>Daily demo</title>
</svelte:head>

<section>
	<h1>Daily demo</h1>

	<RoomForm />
</section>

<style>
	section {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		flex: 1;
	}

	h1 {
		width: 100%;
	}
</style>
