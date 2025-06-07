// src/routes/api/stops/+server.js

import { json } from '@sveltejs/kit';
import {
    TRENTINO_TRASPORTI_API_URL,
    TRENTINO_TRASPORTI_API_USERNAME,
    TRENTINO_TRASPORTI_API_PASSWORD,
    ALLOWED_ORIGIN
} from '$env/static/private';

export async function GET({ request, url }) {
    const origin = request.headers.get('origin');

    if (origin && origin !== ALLOWED_ORIGIN) {
        return new Response('Forbidden', { status: 403 });
    }

    const auth = btoa(`${TRENTINO_TRASPORTI_API_USERNAME}:${TRENTINO_TRASPORTI_API_PASSWORD}`);

    const res = await fetch(`${TRENTINO_TRASPORTI_API_URL}/routes?areas=23`, {
        method: 'GET',
        headers: {
            Authorization: `Basic ${auth}`,
            'Content-Type': 'application/json'
        }
    });

    if (!res.ok) {
        return json({ error: 'Errore nel recupero delle linee' }, { status: res.status });
    }

    let data = await res.json();

    return json(data);
}