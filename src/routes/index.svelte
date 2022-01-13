<script context="module">
	export const prerender = true;
</script>

<script>
	import RoomForm from '$lib/forms/RoomForm.svelte';
</script>

<svelte:head>
	<title>Daily Svelte demo</title>
</svelte:head>

<section>
	<h1>Call object Svelte demo</h1>
	<p>Demo a custom call interface built using Daily call object for Svelte.</p>

	<RoomForm />
	<p class="subtext">
		Select "Allow" in the browser device prompt to use your camera and mic for this call.
	</p>
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
		text-align: center;
	}
	p {
		text-align: center;
	}
</style>
