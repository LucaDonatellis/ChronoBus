import jwt from "jsonwebtoken";
import { validateToken } from '$lib/utils/auth.js';
import { JWT_PASSWORD } from '$env/static/private';

import mongoose from 'mongoose';
import { MONGO_URI } from '$env/static/private';
mongoose.connect(MONGO_URI);

import { json } from '@sveltejs/kit';

const officialReportSchema = new mongoose.Schema({
    text: { type: String, required: true },
    endingTime: { type: Date, required: true },
});
const OfficialReport = mongoose.models.OfficialReport || mongoose.model('OfficialReport', officialReportSchema);

export async function GET({ params }) {
    const { valid, payload, error } = validateToken(request);

    if (!valid) {
        return new Response(JSON.stringify({ error }), { status: 401 });
    }

    const { id } = params;

    try {
        const report = await OfficialReport.findById(id).lean();
        if (!report) {
            return json({ error: 'Report not found' }, { status: 404 });
        }

        return json(report, { status: 200 });
    } catch (err) {
        console.error('Error fetching report:', err);
        return json({ error: 'Invalid ID or server error' }, { status: 500 });
    }
}

export async function DELETE({ params }) {
    const { valid, payload, error } = validateToken(request);

    if (!valid) {
        return new Response(JSON.stringify({ error }), { status: 401 });
    }

    const { id } = params;

    try {
        const deleted = await OfficialReport.findByIdAndDelete(id);
        if (!deleted) {
            return json({ error: 'Report not found' }, { status: 404 });
        }

        return json({ message: 'Report deleted successfully' }, { status: 200 });
    } catch (err) {
        console.error('Error deleting report:', err);
        return json({ error: 'Invalid ID or server error' }, { status: 500 });
    }
}
