<script>
	import { slide } from 'svelte/transition';
	import { quintOut } from 'svelte/easing';
	import { callObject, chatHistory } from '../../store';
	import chat from './assets/chat.svg';
	import close from './assets/x.svg';
	import send from './assets/send.svg';

	let messages;
	let co;
	let newText = '';
	let chatIsOpen = false;

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
	const toggleChat = () => (chatIsOpen = !chatIsOpen);
</script>

<div class={chatIsOpen ? 'chat-open chat-container' : 'chat-close chat-container'}>
	<div class="chat-view-button">
		<button on:click={toggleChat}
			>{#if chatIsOpen}
				<img src={close} alt="Close chat" />
			{:else}
				<img src={chat} alt="Open chat" />
			{/if}
		</button>
	</div>
	<div class="chat">
		<div class="messages">
			{#each $chatHistory as message}
				<p transition:slide|local={{ easing: quintOut }} class="message">
					{message.name}: {message.text}
				</p>
			{/each}
		</div>
		<form on:submit|preventDefault={sendMessage}>
			<input type="text" placeholder="Type a message..." bind:value={newText} />
			<button>
				<img src={send} alt="send message" />
			</button>
		</form>
	</div>
</div>

<style>
	.chat-container {
		background-color: var(--white);
		position: absolute;
		top: 51px; /* header height */
		height: calc(100vh - 51px);
		z-index: 30;
		display: flex;
		width: 300px;
		right: -300px;
		transition: right 0.3s ease-out; /* Svelte has lots of transitions you can use too! https://svelte.dev/tutorial/transition */
	}
	.chat-view-button {
		position: absolute;
		left: -56px;
		top: 0;
		bottom: 0;
		margin: auto 0;
		height: 56px;
	}
	.chat-view-button button {
		background-color: #fff;
		border: none;
		cursor: pointer;
		border-radius: 16px 0 0 16px;
		padding: 16px 14px 13px 18px;
	}
	.chat-open {
		right: 0;
	}
	.chat {
		display: flex;
		flex-direction: column;
		width: 100%;
	}
	.messages {
		display: flex;
		flex-direction: column;
		height: calc(100vh - 51px);
		padding: 1rem;
	}
	form {
		border-bottom: var(--grey) 1px solid;
		margin: 1rem;
		display: flex;
		justify-content: space-between;
	}
	input {
		border: none;
	}
	form button {
		background: transparent;
		border: none;
		cursor: pointer;
	}
</style>
