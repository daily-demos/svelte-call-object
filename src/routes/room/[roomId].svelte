<script>
	import { onDestroy, onMount } from 'svelte';
	import daily from '@daily-co/daily-js';
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import { browser } from '$app/env';
	import VideoTile from '$lib/call/VideoTile.svelte';
	import WaitingForOthersTile from '../../lib/call/WaitingForOthersTile.svelte';
	import Chat from '../../lib/call/Chat.svelte';
	import Loading from '../../lib/call/Loading.svelte';
	import PermissionErrorMessage from '../../lib/call/PermissionErrorMessage.svelte';
	import { chatMessages, dailyErrorMessage, username } from '../../store';

	let callObject;
	let participants = [];
	let loading = true;
	let deviceError = false;
	let hasNewNotification = false;
	$: screensList = participants?.filter((p) => p?.screen);

	const clearNotification = () => (hasNewNotification = false);

	const destroyCall = async () => {
		if (!callObject) return;
		await callObject.leave();
		await callObject.destroy();
	};

	const goHome = async () => {
		await destroyCall();
		document?.body?.classList?.remove('in-call');
		goto(`/`);
	};

	const clearDeviceError = () => {
		goHome();
		deviceError = false;
	};

	/**
	 * DAILY EVENT CALLBACKS
	 */
	const handleJoinedMeeting = (e) => {
		console.log('[joined-meeting]', e);
		loading = false;
		updateParticpants(e);
	};
	const updateParticpants = (e) => {
		console.log('[update participants]', e);
		if (!callObject) return;

		// Use call object as source of truth for current participant list
		participants = Object.values(callObject.participants());
	};
	const handleError = async () => {
		console.error('Error: ending call and returning to home page');
		await goHome();
	};
	const handleDeviceError = () => {
		deviceError = true;
	};
	const handleAppMessage = (e) => {
		/*
		 * app-message can be used for data exchange other
		 than just chat messages.
		Don't update chat unless it's in the message format 
		we're expecting.
		 */
		if (!e?.data?.name && !e?.data?.text) return;
		// add chat message to message history
		$chatMessages = [...$chatMessages, e?.data];
		hasNewNotification = true;
	};
	/**
	 * END - DAILY EVENT CALLBACKS
	 */

	const createAndJoinCall = async () => {
		const roomName = $page.params.roomId;
		const domain = import.meta.env.VITE_DAILY_DOMAIN;
		if (!roomName || !domain) {
			// TODO: eep no valid url to use. show error
			return;
		}

		const url = `https://${domain}.daily.co/${roomName}`;
		// Create instance of Daily call object
		callObject = daily.createCallObject({ url, userName: $username });
		// Add call and participant event handler
		// Visit https://docs.daily.co/reference/daily-js/events for more event info
		callObject
			.on('joining-meeting', updateParticpants)
			.on('joined-meeting', handleJoinedMeeting)
			.on('participant-joined', updateParticpants)
			.on('participant-left', updateParticpants)
			.on('participant-left', updateParticpants)
			.on('participant-updated', updateParticpants)
			.on('error', handleError)
			// camera-error = device error, like device in use or permissions issues
			.on('camera-error', handleDeviceError)
			.on('app-message', handleAppMessage);

		// Join the call with the name set in the Home.vue form
		try {
			await callObject.join();
			// reset possible existing error message
			dailyErrorMessage.set('');
		} catch (e) {
			dailyErrorMessage.set(e);
		}
	};

	onMount(() => {
		if (!browser) return;
		createAndJoinCall();

		// updates background colour
		if (!document) return;
		document.body.classList.add('in-call');
	});

	onDestroy(() => {
		if (!callObject) return;
		// Remove Daily event handling when call ends
		callObject
			.off('joining-meeting', updateParticpants)
			.off('joined-meeting', handleJoinedMeeting)
			.off('participant-joined', updateParticpants)
			.off('participant-left', updateParticpants)
			.off('track-started', updateParticpants)
			.off('track-stopped', updateParticpants)
			.off('participant-left', updateParticpants)
			.off('error', handleError)
			.off('camera-error', handleDeviceError)
			.off('app-message', handleAppMessage);
	});
</script>

<sveltekit:head>
	<title>Daily call</title>
</sveltekit:head>

<!-- Include a button to return to the home screen in case 
there are any errors loading the call -->
<div class="call-info">
	<button on:click={goHome}>Home</button>

	<p>{$page.url.href}</p>
</div>
{#if loading}
	<div class="loading">
		<Loading />
	</div>
{:else if deviceError}
	<PermissionErrorMessage on:clear-device-error={clearDeviceError} />
{:else}
	<!-- Render an optional screen share above the participant tiles -->
	{#if screensList?.length > 0}
		<!-- Note: We'll only allow one screen share to be displayed
		for this demo. Take the first one available -->
		<VideoTile {callObject} screen={screensList[0]} />
	{/if}
	<!-- This in-call view is _not_ optimized for large meetings.
	Please see our large meetings series to learn more about 
	pagination, manual track subscription, and updating 
	video track receive settings. 
	https://www.daily.co/blog/tag/large-meeting-series/ -->
	<div class="call-container">
		<!-- Render a video tile for each participant -->
		{#each participants as participant}
			<VideoTile {callObject} {participant} {screensList} />
		{/each}

		<!-- Show a waiting message if the local user is alone in the call -->
		{#if participants?.length === 1}
			<WaitingForOthersTile />
		{/if}

		<!-- Chat is displayed as soon as you're in the call  -->
		<Chat {callObject} {hasNewNotification} on:clear-notification={clearNotification} />
	</div>
{/if}

<style>
	.loading {
		margin: auto;
	}
	.call-container {
		display: flex;
		flex-wrap: wrap;
	}
	button {
		border: 1px solid var(--grey);
		border-radius: 8px;
		margin-left: 1rem;
		margin-bottom: 1rem;
		padding-left: 0.5rem;
		padding-right: 0.5rem;
		padding-top: 0.25rem;
		padding-bottom: 0.25rem;
		background-color: var(--white);
		cursor: pointer;
		font-size: 10px;
		text-transform: uppercase;
		font-weight: 700;
	}
	.call-info {
		display: flex;
		flex-direction: flex-start;
	}
	.call-info p {
		color: var(--turquoise);
		margin: 0;
		padding-left: 1rem;
		font-size: 14px;
	}
</style>
