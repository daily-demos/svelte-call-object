<script context="module">
	export const prerender = true;
</script>

<script>
	import RoomForm from '$lib/forms/RoomForm.svelte';
</script>

<sveltekit:head>
	<title>Daily Svelte demo</title>
</sveltekit:head>

<section>
	<h1>Call object Svelte demo</h1>
	<p>Demo a custom call interface built using Daily call object for Svelte.</p>

	<!-- Provide a form to enter name and optional Daily URL -->
	<RoomForm />
	<p class="subtext">If prompted, select "Allow" to use your camera and mic for this call</p>
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
		font-size: 2rem;
		font-weight: 700;
		margin-bottom: 0;
	}
	p {
		text-align: center;
	}
	.subtext {
		font-size: 12px;
		color: var(--dark-grey);
	}
</style>
