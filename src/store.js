import { writable } from 'svelte/store';

// Initialize local username.
// This will be set by the user in RoomForm
export const username = writable('Guest');
// Use Daily's call object to interact with the Daily API
export const callObject = writable(null);
