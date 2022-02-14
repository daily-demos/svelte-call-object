<script>
	import { createEventDispatcher } from 'svelte';
	import { slide } from 'svelte/transition';
	import { quintOut } from 'svelte/easing';
	import { chatMessages } from '../../store';
	import chat from './assets/chat.svg';
	import close from './assets/x.svg';
	import send from './assets/send.svg';

	const dispatch = createEventDispatcher();

	export let callObject;
	export let hasNewNotification;
	let newText = '';
	let chatIsOpen = false;

	$: {
		if (hasNewNotification && chatIsOpen) {
			dispatch('clear-notification');
		}
	}

	const sendMessage = () => {
		if (!callObject) return;
		const local = callObject.participants().local.user_name || 'Guest';
		const newMessage = {
			name: local,
			text: newText
		};
		callObject.sendAppMessage(newMessage);
		/**
		 * Update chat history in store for the local user.
		 * (Participants do not receive Daily app-message events for
		 * their own messages, btw!)
		 */
		$chatMessages = [...$chatMessages, newMessage];

		// Clear input value
		newText = '';
	};
	const toggleChat = () => (chatIsOpen = !chatIsOpen);
</script>

<!-- Chat wrapper including drawer and button to toggle drawer -->
<div class={chatIsOpen ? 'chat-open chat-container' : 'chat-close chat-container'}>
	<div class="chat-view-button">
		<!-- overlay notification animation on chat button -->
		{#if hasNewNotification}
			<span class="new-notification" />
		{/if}
		<!-- Show a button to toggle the chat in/out of view  -->
		<button on:click={toggleChat}
			>{#if chatIsOpen}
				<img src={close} alt="Close chat" />
			{:else}
				<img src={chat} alt="Open chat" />
			{/if}
		</button>
	</div>

	<div class="chat">
		<!-- Render each message in the existing chat history -->
		<div class="messages">
			{#each $chatMessages as message}
				<p transition:slide|local={{ easing: quintOut }} class="message">
					<span class="message-name">{message.name}</span>: {message.text}
				</p>
			{/each}
		</div>

		<!-- Render a form for the local user to write and send a chat message -->
		<form on:submit|preventDefault={sendMessage}>
			<input type="text" placeholder="Type a message..." bind:value={newText} />
			<button type="submit">
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
		background-color: var(--white);
		border: none;
		cursor: pointer;
		border-radius: 16px 0 0 16px;
		padding: 16px 14px 13px 18px;
	}
	.new-notification {
		position: absolute;
		top: 0;
		right: 0;
		background: rgba(255, 82, 82, 1);
		box-shadow: 0 0 0 0 rgb(255 82 82);
		animation: pulse-red 2s infinite;
		border-radius: 50%;
		margin: 6px;
		height: 15px;
		width: 15px;
		transform: scale(1);
	}
	@keyframes pulse-red {
		0% {
			transform: scale(0.95);
			box-shadow: 0 0 0 0 rgba(255, 82, 82, 0.7);
		}

		70% {
			transform: scale(1);
			box-shadow: 0 0 0 10px rgba(255, 82, 82, 0);
		}

		100% {
			transform: scale(0.95);
			box-shadow: 0 0 0 0 rgba(255, 82, 82, 0);
		}
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
		overflow-y: scroll;
	}
	.message-name {
		color: var(--dark-grey);
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
