<script>
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import { getfwt, postfwt, deletefwt } from '$lib/utils/fetch.js';
	import { errorAlert, successAlert } from '$lib/stores/alert';
	import { browser } from '$app/environment';
	import { get } from 'mongoose';

	let calendarElement = $state(null);
	let reports = $state([]);

	onMount(async () => {
		if (browser) {
			await import('cally');
			calendarElement.addEventListener('focusday', calendarDateHandler);
		}
		const date = new Date().toISOString().split('T')[0];
		getfwt(`reports?date=${date}&groupBy=line`)
			.then((data) => {
				reports = data;
			})
			.catch((error) => {
				errorAlert(error);
				if (error.status === 401) {
					goto('/profile/login');
				}
			});
	});

	function calendarDateHandler(event) {
		const date = event.detail.toISOString().split('T')[0];
		getfwt(`reports?date=${date}&groupBy=line`)
			.then((data) => {
				reports = data;
			})
			.catch((error) => {
				errorAlert(error);
				if (error.status === 401) {
					goto('/profile/login');
				}
			});
	}
</script>

<div class="p-2">
	<calendar-date
		class="cally bg-base-100 border-base-300 rounded-box w-full border shadow-lg"
		bind:this={calendarElement}
	>
		<svg
			aria-label="Previous"
			class="size-4 fill-current"
			slot="previous"
			xmlns="http://www.w3.org/2000/svg"
			viewBox="0 0 24 24"><path fill="currentColor" d="M15.75 19.5 8.25 12l7.5-7.5"></path></svg
		>
		<svg
			aria-label="Next"
			class="size-4 fill-current"
			slot="next"
			xmlns="http://www.w3.org/2000/svg"
			viewBox="0 0 24 24"><path fill="currentColor" d="m8.25 4.5 7.5 7.5-7.5 7.5"></path></svg
		>
		<calendar-month></calendar-month>
	</calendar-date>
	<div class="mb-16 overflow-scroll">
		<table class="table-zebra table-xs table w-full">
			<thead>
				<tr>
					<th>Linea</th>
					<th>0</th>
					<th>1</th>
					<th>2</th>
					<th>3</th>
					<th>4</th>
					<th>5</th>
					<th>6</th>
					<th>7</th>
					<th>8</th>
					<th>9</th>
					<th>10</th>
					<th>11</th>
					<th>12</th>
					<th>13</th>
					<th>14</th>
					<th>15</th>
					<th>16</th>
					<th>17</th>
					<th>18</th>
					<th>19</th>
					<th>20</th>
					<th>21</th>
					<th>22</th>
					<th>23</th>
				</tr>
			</thead>
			<tbody>
				{#each reports as reportLine}
					<tr>
						<td>{reportLine.line}</td>
						{#each { length: 24 } as _, hour}
							<td
								data-tip={Object.entries(
									reportLine.reports
										.filter((r) => new Date(r.time).getHours() === hour)
										.reduce(
											(acc, r) => ({ ...acc, [r.crowdedness]: (acc[r.crowdedness] || 0) + 1 }),
											{}
										)
								)
									.map(([k, v]) => `${k}: ${v}`)
									.join(', ')}
								class="tooltip table-cell bg-{['blue', 'green', 'yellow', 'orange', 'red'][
									Math.round(
										reportLine.reports
											.filter((r) => new Date(r.time).getHours() === hour)
											.map((c) => {
												return [
													'almost_empty',
													'empty_seats',
													'seats_full',
													'crowded',
													'overcrowded'
												].indexOf(c.crowdedness);
											})
											.reduce((a, b) => a + b, 0) /
											reportLine.reports.filter((r) => new Date(r.time).getHours() === hour).length
									)
								]}-500"
							>
							</td>
						{/each}
					</tr>
				{/each}
			</tbody>
		</table>
	</div>
</div>

<style>
	.bg-blue-500 {
		background-color: var(--color-blue-500);
	}
	.bg-green-500 {
		background-color: var(--color-green-500);
	}
	.bg-yellow-500 {
		background-color: var(--color-yellow-500);
	}
	.bg-orange-500 {
		background-color: var(--color-orange-500);
	}
	.bg-red-500 {
		background-color: var(--color-red-500);
	}
</style>
