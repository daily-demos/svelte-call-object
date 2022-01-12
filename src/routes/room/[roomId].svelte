<script>
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import daily from '@daily-co/daily-js';
	import { browser } from '$app/env';

	let callObject = null;

	const goHome = () => {
		if (callObject) {
			callObject.destroy();
		}
		goto(`/`);
		// TODO: handle destroying callframe if currently in call
	};

	/**
	 * DAILY EVENT CALLBACKS
	 */

	const handleJoiningMeeting = () => {};
	const updateParticpants = () => {};
	const handleError = () => {};
	const handleDeviceError = () => {};
	const updateMessages = () => {};
	/**
	 * END - DAILY EVENT CALLBACKS
	 */

	const createAndJoinCall = () => {
		const roomName = $page.params.roomId;
		const domain = import.meta.env.VITE_DAILY_DOMAIN;
		if (!roomName || !domain) {
			// TODO: eep no valid url to use. show error
			return;
		}
		const url = `https://${domain}.daily.co/${roomName}`;
		// Create instance of Daily call object
		const co = daily.createCallObject({ url });
		// Assign in data obj for future reference
		callObject = co;

		// Join the call with the name set in the Home.vue form
		co.join();

		// Add call and participant event handler
		// Visit https://docs.daily.co/reference/daily-js/events for more event info
		co.on('joining-meeting', handleJoiningMeeting)
			.on('joined-meeting', updateParticpants)
			.on('participant-joined', updateParticpants)
			.on('participant-updated', updateParticpants)
			.on('participant-left', updateParticpants)
			.on('error', handleError)
			// camera-error = device permissions issue
			.on('camera-error', handleDeviceError)
			// app-message handles receiving remote chat messages
			.on('app-message', updateMessages);
	};

	onMount(() => {
		if (browser) {
			createAndJoinCall();
		}
	});
</script>

<svelte:head>
	<title>Daily call</title>
</svelte:head>

<button on:click={goHome}>Go back</button>
<div class="content">in call view</div>

<style>
	.content {
		width: 100%;
		max-width: var(--column-width);
		margin: var(--column-margin-top) auto 0 auto;
	}
</style>
