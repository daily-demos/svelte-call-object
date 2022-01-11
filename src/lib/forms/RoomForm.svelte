<script>
	import { goto } from '$app/navigation';

	let errorMessage = '';

	async function submitForm() {
		const submit = await fetch('/room.json', {
			method: 'POST'
		});
		const data = await submit.json();

		if (data.success) {
			goto(`/room/${data.room.name}`);
		} else if (data.status === '200') {
			errorMessage = `bad request`;
		}
		if (data.status === '500') {
			errorMessage = `server error :|`;
		}
	}
</script>

<button on:click={submitForm}> Create room </button>
<p>{errorMessage}</p>
