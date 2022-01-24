import { writable } from 'svelte/store';

// Initialize local username.
// This will be set by the user in RoomForm
export const username = writable('Guest');

// Keep track of the calls chat history (array of objects with the name+message)
export let chatHistory = writable([]);

// Keep track of the calls chat history (array of objects with the name+message)
export let dailyErrorMessage = writable('');
