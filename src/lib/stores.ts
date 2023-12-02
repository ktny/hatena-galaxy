import { derived, writable } from "svelte/store";

export const isLightTheme = writable(false);

export const theme = derived(isLightTheme, ($isLightTheme) => ($isLightTheme ? "light" : "dracula"));
