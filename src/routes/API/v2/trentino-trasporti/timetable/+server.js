import { json } from '@sveltejs/kit';
import { parse } from 'csv-parse/sync';
import { readFileSync } from 'fs';
import { join } from 'path';

export async function GET({ url }) {
    try {
        const filePath = join(process.cwd(), 'static', 'stop_depart_route_joined.csv');
        const fileContent = readFileSync(filePath, 'utf-8');

        const records = parse(fileContent, {
            columns: true,
            skip_empty_lines: true,
            trim: true
        });

        const tripId = url.searchParams.get('trip_id');
        const stopId = url.searchParams.get('stop_id');

        let filteredRecords = records;

        if (tripId) {
            filteredRecords = filteredRecords.filter(record => record.trip_id === tripId);
        }

        if (stopId) {
            filteredRecords = filteredRecords.filter(record => record.stop_id === stopId);
        }

        return json(filteredRecords);

    } catch (error) {
        console.error('Error reading timetable:', error);
        return json({ error: 'Server error' }, { status: 500 });
    }
}