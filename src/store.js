import { writable } from 'svelte/store';

// Initialize local username.
// This will be set by the user in RoomForm
export const username = writable('');

// Keep track of the calls chat history (array of objects with the name+message)
export let chatMessages = writable([]);

// Keep track of the calls chat history (array of objects with the name+message)
export let dailyErrorMessage = writable('');
