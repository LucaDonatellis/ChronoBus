import mongoose from 'mongoose';
import jwt from "jsonwebtoken";
import { json } from '@sveltejs/kit';
import { validateToken } from '$lib/utils/auth';

const JWT_SECRET = 'a_secret_key';

mongoose.connect('mongodb+srv://lorenzociroluongo:QvmW8bxBiyZIpDRo@cluster0.dthxrpi.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0');

const reportSchema = new mongoose.Schema({
    line: { type: String, required: true },
    time: { type: Number, required: true },
    crowdedness: {
        type: String,
        enum: ['almost_empty', 'empty_seats', 'seats_full', 'crowded', 'overcrowded'],
        required: true
    }
});

const Report = mongoose.models.Report || mongoose.model('Report', reportSchema);

export async function POST({ request }) {
    const { valid, payload, error } = validateToken(request);

    if (!valid) {
        return new Response(JSON.stringify({ error }), { status: 401 });
    }

    try {
        const data = await request.json();
        let { line, time, crowdedness } = data;
        time = new Date(time).getTime();

        if (!line || typeof time !== 'number' || !['almost_empty', 'empty_seats', 'seats_full', 'crowded', 'overcrowded'].includes(crowdedness)) {
            return json({ error: 'Invalid data' }, { status: 400 });
        }

        const report = new Report({ line, time, crowdedness });
  
        await report.save();
    
        return json({ message: 'Report saved successfully' }, { status: 201 });
    } catch (err) {
        console.error('Error saving report:', err);
        return json({ error: 'Server error' }, { status: 500 });
    }
}

export async function GET({request}) {
    const { valid, payload, error } = validateToken(request);

    if (!valid) {
        return new Response(JSON.stringify({ error }), { status: 401 });
    }

    try {
        const reports = await Report.find().sort({ time: -1 }).lean();
        return json(reports, { status: 200 });
    } catch (err) {
        console.error('Error fetching reports:', err);
        return json({ error: 'Server error' }, { status: 500 });
    }
}

