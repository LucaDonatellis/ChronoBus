import { json } from '@sveltejs/kit';
import { validateToken } from '$lib/utils/auth';
import { mongoose, Report } from '$lib/utils/mongodb.js';

export async function GET({ request, url }) {
    const dayParam = url.searchParams.get('date');
    if (!dayParam) {
        return json({ error: 'Date parameter is required' }, { status: 400 });
    }

    let query = {};
    try {
        const date = new Date(dayParam);
        if (isNaN(date.getTime())) {
            return json({ error: 'Invalid date format. Use YYYY-MM-DD' }, { status: 400 });
        }

        const start = new Date(date);
        start.setHours(0, 0, 0, 0);

        const end = new Date(date);
        end.setHours(23, 59, 59, 999);

        query = { time: { $gte: start, $lte: end } };


    } catch {
        return json({ error: 'Invalid date format. Use YYYY-MM-DD' }, { status: 400 });
    }


    try {
        let reports = await Report.find(query).sort({ time: -1 }).lean();
        let groupedReports = {};
        reports.forEach(report => {
            if (!groupedReports[report.line]) {
                groupedReports[report.line]=[];
                for (let hour = 0; hour < 24; hour++) {
                    groupedReports[report.line].push({ almost_empty: 0, empty_seats: 0, seats_full: 0, crowded: 0, overcrowded: 0 });
                }
            }
            groupedReports[report.line][new Date(report.time).getHours()][report.crowdedness] += 1;
        });
        
        let predictions = Object.entries(groupedReports).map((d) => {
            let [line, data] = d;
            return {
                line, crowdedness: data.map((h)=> ['almost_empty', 'empty_seats', 'seats_full', 'crowded', 'overcrowded']
                [Math.round(
                    (h.almost_empty + h.empty_seats * 2 + h.seats_full * 3 + h.crowded * 4 + h.overcrowded * 5) /
                    (h.empty_seats + h.almost_empty + h.seats_full + h.crowded + h.overcrowded))
                    - 1])
            }
        });

        return json(predictions, { status: 200 });
    } catch (err) {
        console.error('Error fetching reports:', err);
        return json({ error: 'Server error' }, { status: 500 });
    }
}