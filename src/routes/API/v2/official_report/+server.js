import jwt from "jsonwebtoken";
import { json } from '@sveltejs/kit';
import { validateToken } from '$lib/utils/auth';
import { JWT_PASSWORD } from '$env/static/private';

import mongoose from 'mongoose';
import { MONGO_URI } from '$env/static/private';
mongoose.connect(MONGO_URI);

const officialReportSchema = new mongoose.Schema({
    text: { type: String, required: true },
    endingTime: { type: Date, required: true },
});
const OfficialReport = mongoose.models.OfficialReport || mongoose.model('OfficialReport', officialReportSchema);

export async function GET({request}) {
    const { valid, payload, error } = validateToken(request);

    if (!valid) {
        return new Response(JSON.stringify({ error }), { status: 401 });
    }

    try {
        const reports = await OfficialReport.find().lean();
        return json(reports, { status: 200 });
    } catch (err) {
        console.error('Error fetching official reports:', err);
        return json({ error: 'Server error' }, { status: 500 });
    }
}

export async function POST({ request }) {
    const { valid, payload, error } = validateToken(request);

    if (!valid) {
        return new Response(JSON.stringify({ error }), { status: 401 });
    }

    try {
        const data = await request.json();
        let { text, endingTime } = data;

        if (!text || !endingTime || typeof text !== 'string' || typeof endingTime !== 'string') {
            return new Response('Missing fields', { status: 400 });
        }
        endingTime = new Date(endingTime).getTime();
        if (endingTime < Date.now()) {
            return new Response('Invalid ending time', { status: 400 });
        }

        const officialReport = new OfficialReport({ text, endingTime });

        await officialReport.save();

        return json({ message: 'Report saved successfully' }, { status: 201 });
    } catch (err) {
        console.error('Error saving report:', err);
        return json({ error: 'Server error' }, { status: 500 });
    }
}
