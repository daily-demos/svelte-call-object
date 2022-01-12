<script>
	import { goto } from '$app/navigation';

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
	<input type="submit" value="Create room" />
</form>
<p>{errorMessage}</p>
