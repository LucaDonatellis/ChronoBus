import { json } from '@sveltejs/kit';
import {
    TRENTINO_TRASPORTI_API_URL,
    TRENTINO_TRASPORTI_API_USERNAME,
    TRENTINO_TRASPORTI_API_PASSWORD,
    ALLOWED_ORIGIN
} from '$env/static/private';
import { parse } from 'csv-parse/sync';
import { readFileSync } from 'fs';
import { join } from 'path';

export async function GET({ request, params, url }) {
    const { id } = params;
    const groupByRoute = url.searchParams.get('groupBy') === 'route';
    const origin = request.headers.get('origin');

    if (origin && origin !== ALLOWED_ORIGIN) {
        return json({ error: 'Forbidden' }, { status: 403 });
    }

    try {
        const auth = btoa(`${TRENTINO_TRASPORTI_API_USERNAME}:${TRENTINO_TRASPORTI_API_PASSWORD}`);
        const stopRes = await fetch(`${TRENTINO_TRASPORTI_API_URL}/stops?type=U`, {
            headers: {
                Authorization: `Basic ${auth}`,
                'Content-Type': 'application/json'
            }
        });

        if (!stopRes.ok) {
            return json({ error: 'Error fetching stop data' }, { status: stopRes.status });
        }

        const stops = await stopRes.json();
        const stop = stops.find(s => s.stopId == id);

        if (!stop) {
            return json({ error: 'Stop not found' }, { status: 404 });
        }

        const filePath = join(process.cwd(), 'static', 'stop_depart_route_joined.csv');
        const fileContent = readFileSync(filePath, 'utf-8');
        const timetables = parse(fileContent, {
            columns: true,
            skip_empty_lines: true,
            trim: true
        });

        const stopTimetables = timetables.filter(t => t.stop_id === id);

         if (groupByRoute) {
            const groupedTimetables = stopTimetables.reduce((acc, curr) => {
                const routeId = curr.route_id;
                if (!acc[routeId]) {
                    acc[routeId] = [];
                }
                acc[routeId].push(curr);
                return acc;
            }, {});

            return json({
                stop,
                timetables: groupedTimetables
            });
        }

        return json({
            stop,
            timetables: stopTimetables
        });

    } catch (error) {
        console.error('Error processing request:', error);
        return json({ error: 'Server error' }, { status: 500 });
    }
}