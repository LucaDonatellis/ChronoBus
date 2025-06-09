/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{html,js,svelte,ts}'],
	safelist: [
		'border-blue-500',
		'border-green-500',
		'border-yellow-500',
		'border-orange-500',
		'border-red-500',
		'checked:bg-blue-300',
		'checked:bg-green-300',
		'checked:bg-yellow-300',
		'checked:bg-orange-300',
		'checked:bg-red-300',
		'checked:text-blue-500',
		'checked:text-green-500',
		'checked:text-yellow-500',
		'checked:text-orange-500',
		'checked:text-red-500'
	],
	theme: {
		extend: {}
	},
	plugins: [require('daisyui')]
};
