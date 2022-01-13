import { writable } from 'svelte/store';

// Initialize local username.
// This will be set by the user in RoomForm
export const username = writable('Guest');
