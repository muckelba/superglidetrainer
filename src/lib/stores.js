import { writable } from 'svelte/store';
import { colorScheme } from "$lib/config";

export let history = writable([])
export let trainingActive = writable(false);

// Stat stores
export let attempts = writable([]);
export let potentialSuperglides = writable([]);
export let wrongInputCount = writable(0);
export let crouchTooLateCount = writable(0);

// Initialize with just the 5 basic colors
export let gradientArray = writable(Object.values(colorScheme))