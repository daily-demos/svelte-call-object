<script>
	import { goto } from '$app/navigation';
	let dailyUrl = '';
	let dailyName = '';
	let errorMessage = '';

	async function submitForm() {
		const submit = await fetch('/room.json', {
			method: 'POST'
		});
		const data = await submit.json();

		if (data.success && data?.room?.name) {
			goto(`/room/${data.room.name}`);
		} else if (data.status === '200') {
			errorMessage = `bad request`;
		}
		if (data.status === '500') {
			errorMessage = `server error :|`;
		}
	}
</script>

<form on:submit|preventDefault={submitForm}>
	<label for="name">Your name</label>
	<input id="name" type="text" bind:value={dailyName} />
	<label for="url">Daily URL (leave empty to create a new room)</label>
	<input id="url" type="text" bind:value={dailyUrl} />
	<input type="submit" value="Create room" disabled={!dailyUrl} />
</form>
<p>{errorMessage}</p>

<style>
	label,
	input {
		display: block;
	}
</style>
