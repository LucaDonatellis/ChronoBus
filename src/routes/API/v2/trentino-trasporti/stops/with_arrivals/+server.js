import { json } from '@sveltejs/kit';
import {
	TRENTINO_TRASPORTI_API_URL,
	TRENTINO_TRASPORTI_API_USERNAME,
	TRENTINO_TRASPORTI_API_PASSWORD,
	ALLOWED_ORIGIN
} from '$env/static/private';

function haversine(lat1, lon1, lat2, lon2) {
	const R = 6371e3; // raggio terrestre in metri
	const toRad = (deg) => (deg * Math.PI) / 180;

	const φ1 = toRad(lat1);
	const φ2 = toRad(lat2);
	const Δφ = toRad(lat2 - lat1);
	const Δλ = toRad(lon2 - lon1);

	const a = Math.sin(Δφ / 2) ** 2 + Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) ** 2;

	const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
	return R * c;
}

export async function GET({ request, url }) {
	const origin = request.headers.get('origin');

	if (origin && origin !== ALLOWED_ORIGIN) {
		return new Response('Forbidden', { status: 403 });
	}

	const lat = parseFloat(url.searchParams.get('lat'));
	const lon = parseFloat(url.searchParams.get('lon'));
	const limit = parseInt(url.searchParams.get('limit') || '0');

	const auth = btoa(`${TRENTINO_TRASPORTI_API_USERNAME}:${TRENTINO_TRASPORTI_API_PASSWORD}`);

	const res = await fetch(`${TRENTINO_TRASPORTI_API_URL}/stops?type=U`, {
		method: 'GET',
		headers: {
			Authorization: `Basic ${auth}`,
			'Content-Type': 'application/json'
		}
	});

	if (!res.ok) {
		return json({ error: 'Errore nel recupero delle fermate' }, { status: res.status });
	}

	let data = await res.json();

	// Filtra per Trento
	data = data.filter((stop) => stop.town === 'Trento');

	// Se lat/lon sono forniti, calcola distanza e ordina
	if (!isNaN(lat) && !isNaN(lon)) {
		data = data
			.map((stop) => ({
				...stop,
				distance: haversine(lat, lon, stop.stopLat, stop.stopLon)
			}))
			.sort((a, b) => a.distance - b.distance);
	}

	// Applica limit se presente
	if (limit > 0) {
		data = data.slice(0, limit);
	}

	for (let stop of data) {
		let arrivals = await (
			await fetch(`${TRENTINO_TRASPORTI_API_URL}/trips_new?stopId=${stop.stopId}&type=U&limit=4`, {
				method: 'GET',
				headers: {
					Authorization: `Basic ${auth}`,
					'Content-Type': 'application/json'
				}
			})
		).json();
		stop.arrivals = arrivals
			.map((arr) => ({
				ritardo: Math.round(
					(new Date(arr.oraArrivoEffettivaAFermataSelezionata) - new Date()) / 60000
				),
				routeColor: (
					stop.routes.find((route) => route.routeId === arr.routeId) || { routeColor: '000000' }
				).routeColor,
				routeShortName: (
					stop.routes.find((route) => route.routeId === arr.routeId) || { routeShortName: '?' }
				).routeShortName
			}))
			.filter((arr) => arr.ritardo < 100);
	}
	return json(data);
}
