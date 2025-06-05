import { set } from 'mongoose';
import { writable } from 'svelte/store';
export const alert = writable(undefined);

export function errorAlert(message) {
    alert.set({ class: 'alert-error', text: message.message || message });
    setTimeout(() => {
        alert.set(undefined);
    }, 3000);
}
export function successAlert(message) {
    alert.set({ class: 'alert-success', text: message });
    setTimeout(() => {
        alert.set(undefined);
    }, 3000);
}