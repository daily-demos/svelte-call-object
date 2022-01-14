<script>
	import { onDestroy, onMount } from 'svelte';
	import daily from '@daily-co/daily-js';
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import { browser } from '$app/env';
	import VideoTile from '$lib/call/VideoTile.svelte';
	import { callObject } from '../../store';
	import WaitingForOthersTile from '../../lib/call/WaitingForOthersTile.svelte';

	let participants = [];
	let co;

	callObject.subscribe((value) => {
		co = value;
	});

	const destroyCall = async () => {
		if (co) {
			await co.leave();
			await co.destroy();
			return;
		}
		return;
	};

	const goHome = async () => {
		await destroyCall();
		goto(`/`);
	};

	/**
	 * DAILY EVENT CALLBACKS
	 */

	const handleJoiningMeeting = (e) => {
		console.log('[joined-meeting]', e);
		if (!co) return;
		participants = Object.values(co.participants());
	};
	const updateParticpants = (e) => {
		console.log('[update participants]', e);
		if (!co) return;
		participants = Object.values(co.participants());
	};
	const handleError = async () => {
		console.error('Error: ending call and returning to home page');
		await goHome();
	};
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
		const call = daily.createCallObject({ url });

		// Join the call with the name set in the Home.vue form
		call.join();

		// Add call and participant event handler
		// Visit https://docs.daily.co/reference/daily-js/events for more event info
		call
			.on('joining-meeting', handleJoiningMeeting)
			.on('joined-meeting', updateParticpants)
			.on('participant-joined', updateParticpants)
			.on('participant-updated', updateParticpants)
			.on('participant-left', updateParticpants)
			.on('error', handleError)
			// camera-error = device permissions issue
			.on('camera-error', handleDeviceError);

		// Assign in store for future reference
		callObject.set(call);
	};

	onMount(() => {
		if (browser) {
			createAndJoinCall();
		}

		// updates background colour
		document?.body?.classList?.add('in-call');
	});
	onDestroy(() => {
		// resets background colour
		if (document) {
			document?.body?.classList?.remove('in-call');
		}
	});
</script>

<svelte:head>
	<title>Daily call</title>
</svelte:head>

<div>
	<button on:click={goHome}>Go back</button>
</div>
<div class="call-container">
	{#each participants as participant}
		<VideoTile {participant} />
	{/each}
	{#if participants?.length === 1}
		<WaitingForOthersTile />
	{/if}
</div>

<style>
	.call-container {
		display: flex;
		flex-wrap: wrap;
	}
	button {
		border: 1px solid var(--grey);
		border-radius: 8px;
		padding-left: 1rem;
		padding-right: 1rem;
		padding-top: 0.5rem;
		padding-bottom: 0.5rem;
		background-color: var(--white);
		cursor: pointer;
	}
</style>
