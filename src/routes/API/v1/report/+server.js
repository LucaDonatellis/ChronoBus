import mongoose from 'mongoose';
import jwt from "jsonwebtoken";

const JWT_SECRET = 'a_secret_key';

// Connessione a MongoDB
mongoose.connect('mongodb+srv://lorenzociroluongo:QvmW8bxBiyZIpDRo@cluster0.dthxrpi.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0');

import { json } from '@sveltejs/kit';

// 2. Definizione schema e modello
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

// 3. Metodo POST per salvare i dati
export async function POST({ request }) {
    try {
        const data = await request.json();
        const { line, time, crowdedness } = data;

        if (!line || typeof time !== 'number' || !['low', 'medium', 'high'].includes(crowdedness)) {
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

export async function GET() {
    try {
        const reports = await Report.find().sort({ time: -1 }).lean();
        return json(reports, { status: 200 });
    } catch (err) {
        console.error('Error fetching reports:', err);
        return json({ error: 'Server error' }, { status: 500 });
    }
}

