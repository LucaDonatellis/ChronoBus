import { json } from '@sveltejs/kit';
import { validateToken } from '$lib/utils/auth';
import { mongoose, Report } from '$lib/utils/mongodb.js';

export async function POST({ request }) {
    const { valid, payload, error } = validateToken(request);

    if (!valid) {
        return json({ error }, { status: 401 });
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

export async function GET({ request }) {
    const { valid, payload, error } = validateToken(request);

    if (!valid) {
        return json({ error }, { status: 401 });
    }

    try {
        const reports = await Report.find().sort({ time: -1 }).lean();
        return json(reports, { status: 200 });
    } catch (err) {
        return json({ error: 'Server error' }, { status: 500 });
    }
}

