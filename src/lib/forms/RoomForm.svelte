<script>
	import { dailyErrorMessage, username } from '../../store.js';
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	let dailyUrl = '';
	let dailyName = '';

	onMount(() => {
		/**
		 * Use name and url from local storage to pre-populate form
		 * when available.
		 */
		const storedUrl = localStorage?.getItem('DAILY_SVELTE_URL');
		if (storedUrl) {
			dailyUrl = storedUrl;
		}
		const storedName = localStorage?.getItem('DAILY_SVELTE_NAME');
		if (storedName) {
			dailyName = storedName;
		}
	});

	async function submitForm() {
		// Set Daily name in store for future use
		username.set(dailyName);
		localStorage?.setItem('DAILY_SVELTE_NAME', dailyName);

		/**
		 * If a Daily URL has been included, use it.
		 * (We're trusting it's valid at this point!)
		 */
		if (dailyUrl) {
			localStorage?.setItem('DAILY_SVELTE_URL', dailyUrl);
			const roomName = dailyUrl.split('/').at(-1);
			goto(`/room/${roomName}`);
			return;
		}

		/**
		 * If there isn't a Daily URL, we can create a new
		 * room with a random name
		 */
		const submit = await fetch('/room.json', {
			method: 'POST'
		});
		const data = await submit.json();
		const DOMAIN = import.meta.env.VITE_DAILY_DOMAIN;

		if (data.success && data?.room?.name) {
			localStorage?.setItem('DAILY_SVELTE_URL', `https://${DOMAIN}.daily.co/${data.room.name}`);
			goto(`/room/${data.room.name}`);
			dailyErrorMessage.set('');
		} else if (data.status === '400') {
			dailyErrorMessage.set('bad request');
		} else if (data.status === '500') {
			dailyErrorMessage.set('server error :|');
		} else {
			dailyErrorMessage.set('Oops, something went wrong!');
		}
	}
</script>

<!-- In this form, the username is required for the call but
	the Daily URL is optional. If left empty, we will create
	a new Daily room using VITE_DAILY_API_KEY. -->
<form on:submit|preventDefault={submitForm}>
	<label for="name">Your name</label>
	<input id="name" type="text" bind:value={dailyName} required />
	<label for="url">Daily URL (leave empty to create a new room)</label>
	<input id="url" type="text" bind:value={dailyUrl} />
	<input type="submit" value={!dailyUrl ? 'Create room' : 'Join call'} />
</form>
{#if $dailyErrorMessage}
	<p class="error-message">{$dailyErrorMessage}</p>
{/if}

<style>
	form {
		width: 300px;
	}
	label,
	input {
		display: block;
	}
	input {
		width: 100%;
	}
	input[type='submit'] {
		margin: 1rem auto 0;
		width: 100px;
		font-size: 12px;
		background-color: var(--turquoise);
		font-weight: 700;
		cursor: pointer;
	}
	.error-message {
		color: var(--red);
		font-weight: 600;
		font-size: 12px;
	}
</style>
