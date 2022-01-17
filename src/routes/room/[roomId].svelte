<script>
	import { onMount } from 'svelte';
	import daily from '@daily-co/daily-js';
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import { browser } from '$app/env';
	import VideoTile from '$lib/call/VideoTile.svelte';
	import { callObject, chatHistory } from '../../store';
	import WaitingForOthersTile from '../../lib/call/WaitingForOthersTile.svelte';
	import Chat from '../../lib/call/Chat.svelte';
	import Loading from '../../lib/call/Loading.svelte';

	let participants = [];
	let loading = true;

	const destroyCall = async () => {
		if ($callObject) {
			await $callObject.leave();
			await $callObject.destroy();
			return;
		}
		return;
	};

	const goHome = async () => {
		await destroyCall();
		document?.body?.classList?.remove('in-call');
		goto(`/`);
	};

	const confirmedParticipants = (e) => {
		const particpantArr = Object.values($callObject.participants());
		return particpantArr.map((p) =>
			p?.session_id === e?.participant?.session_id ? e?.participant : p
		);
	};

	/**
	 * DAILY EVENT CALLBACKS
	 */

	const handleJoinedMeeting = (e) => {
		console.log('[joined-meeting]', e);
		loading = false;
		if (!$callObject) return;
		participants = confirmedParticipants(e);
	};
	const updateParticpants = (e) => {
		console.log('[update participants]', e);
		if (!$callObject) return;

		participants = confirmedParticipants(e);
	};
	const handleError = async () => {
		console.error('Error: ending call and returning to home page');
		await goHome();
	};
	const handleDeviceError = () => {
		// TODO: device permissions
	};
	const handleAppMessage = (e) => {
		// add chat message to message history
		$chatHistory = [...$chatHistory, e?.data];
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
		const call = daily.createCallObject({ url });

		// Add call and participant event handler
		// Visit https://docs.daily.co/reference/daily-js/events for more event info
		call
			.on('joining-meeting', updateParticpants)
			.on('joined-meeting', handleJoinedMeeting)
			.on('participant-joined', updateParticpants)
			.on('participant-left', updateParticpants)
			.on('track-started', updateParticpants)
			.on('track-stopped', updateParticpants)
			.on('participant-left', updateParticpants)
			.on('error', handleError)
			// camera-error = device permissions issue
			.on('camera-error', handleDeviceError)
			.on('app-message', handleAppMessage);

		// Join the call with the name set in the Home.vue form
		await call.join();

		// Assign in store for future reference
		callObject.set(call);
	};

	const updateLoading = () => (loading = false);

	onMount(() => {
		if (browser) {
			createAndJoinCall();
		}

		// updates background colour
		if (document) {
			document?.body?.classList?.add('in-call');
		}
	});
</script>

<svelte:head>
	<title>Daily call</title>
</svelte:head>

<div>
	<button on:click={goHome}>Go back</button>
</div>
{#if loading}
	<div class="loading">
		<Loading />
	</div>
{:else}
	<div class="call-container">
		{#each participants as participant}
			<VideoTile
				{participant}
				on:update-participants={updateParticpants}
				on:loaded={updateLoading}
			/>
		{/each}
		{#if participants?.length === 1}
			<WaitingForOthersTile />
		{/if}
		<Chat />
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
		padding-left: 1rem;
		padding-right: 1rem;
		padding-top: 0.5rem;
		padding-bottom: 0.5rem;
		background-color: var(--white);
		cursor: pointer;
	}
</style>
