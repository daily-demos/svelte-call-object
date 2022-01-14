<script>
	import { callObject, chatHistory } from '../../store';
	let messages;
	let co;
	let newText = '';

	chatHistory.subscribe((value) => {
		console.log(value);
		messages = value;
	});
	callObject.subscribe((value) => {
		co = value;
	});

	const sendMessage = (e) => {
		if (!co) return;
		const local = co.participants().local.user_name || 'Guest';
		const newMessage = {
			name: local,
			text: newText
		};
		co.sendAppMessage(newMessage);
		/**
		 * Update chat history in store for the local user.
		 * (Participants do not receive Daily app-message events for
		 * their own messages, btw!)
		 */
		$chatHistory = [...$chatHistory, newMessage];

		// Clear input value
		newText = '';
	};
</script>

<div class="chat-container">
	{console.log(messages)}
	<div class="messages">
		{#each $chatHistory as message}
			<p class="message">{message.name}: {message.text}</p>
		{/each}
	</div>
	<form on:submit|preventDefault={sendMessage}>
		<label for="message" />
		<input id="message" type="text" placeholder="Enter your message" bind:value={newText} />
		<input type="submit" value="send" />
	</form>
</div>

<style>
	.chat-container {
		background-color: var(--white);
		position: fixed;
		right: 0;
		top: 51px; /* header height */
		height: calc(100vh - 51px);
		z-index: 30;
		display: flex;
		flex-direction: column;
	}
	.messages {
		display: flex;
		flex-direction: column;
		flex: 1;
	}
</style>
