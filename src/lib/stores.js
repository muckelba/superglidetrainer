import { writable } from "svelte/store";
import { colorScheme } from "$lib/config";

export const devices = {
  Keyboard: "keyboard",
  Mouse: "mouse",
  Wheel: "wheel",
  Controller: "controller",
};

// default settings
export const settings = writable({
  mnk: {
    jump: { type: devices.Keyboard, bind: " " },
    crouch: { type: devices.Keyboard, bind: "Control" },
  },
  controller: {
    jump: 0,
    crouch: 1,
  },
  fps: 144,
});

export let history = writable([]);
export let trainingActive = writable(false);
export let sharingModalActive = writable(false);

// Controller stuff
export let isController = writable(false);
export let loopDelayAvg = writable(0);

// Stat stores
export let analyticsHidden = writable(true);
export let attempts = writable([]);
export let potentialSuperglides = writable([]);
export let wrongInputCount = writable(0);
export let crouchTooLateCount = writable(0);

// Initialize with just the 5 basic colors
export let gradientArray = writable(Object.values(colorScheme));
