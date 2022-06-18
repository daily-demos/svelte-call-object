<script context="module">
	export const prerender = true;
</script>

<script>
	import RoomForm from '$lib/forms/RoomForm.svelte';
</script>

<sveltekit:head>
	<title>Misiki Live</title>
</sveltekit:head>

<section>
	<h1>Connect with your customers through video call</h1>
	<p>Join a group video call to discuss about the product</p>

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
