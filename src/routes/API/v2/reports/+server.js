import { json } from '@sveltejs/kit';
import { validateToken } from '$lib/utils/auth';
import { mongoose, Report } from '$lib/utils/mongodb.js';

export async function POST({ request }) {
    const { valid, payload, error } = validateToken(request);

    if (!valid) {
        return json({ error: 'Non autorizzato' }, { status: 401 });
    }

    try {
        const data = await request.json();
        let { line, time, crowdedness } = data;
        time = new Date(time).getTime();

        if (!line || !time || !crowdedness || typeof time !== 'number' || !['almost_empty', 'empty_seats', 'seats_full', 'crowded', 'overcrowded'].includes(crowdedness)) {
            return json({ error: 'Invalid data' }, { status: 400 });
        }

        const report = new Report({ line, time, crowdedness });

        await report.save();

        return json({ message: 'Report saved successfully' }, { status: 201 });
    } catch (err) {
        return json({ error: 'Server error' }, { status: 500 });
    }
}

export async function GET({ request,url }) {
    const dayParam = url.searchParams.get('date');
    const groupByLine = url.searchParams.get('groupBy') === 'line';

    let query = {};
    if (dayParam) {
        try {
            const date = new Date(dayParam);
            if (isNaN(date.getTime())) {
                return json({ error: 'Invalid day format. Use YYYY-MM-DD' }, { status: 400 });
            }

            const start = new Date(date);
            start.setHours(0, 0, 0, 0);

            const end = new Date(date);
            end.setHours(23, 59, 59, 999);

            query = { time: { $gte: start, $lte: end } };
            
            
        } catch {
            return json({ error: 'Invalid day format. Use YYYY-MM-DD' }, { status: 400 });
        }
    }

    try {
        let reports = await Report.find(query).sort({ time: -1 }).lean();
        if (groupByLine) {
            const groupedReports = {};
            reports.forEach(report => {
                if (!groupedReports[report.line]) {
                    groupedReports[report.line] = [];
                }
                groupedReports[report.line].push(report);
            });
            reports = Object.entries(groupedReports).map(([line, reports]) => ({
                line,
                reports
            }));
        }

        return json(reports, { status: 200 });
    } catch (err) {
        return json({ error: 'Server error' }, { status: 500 });
    }
}

