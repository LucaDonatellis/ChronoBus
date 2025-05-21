import mongoose from 'mongoose';
import jwt from "jsonwebtoken";

const JWT_SECRET = 'a_secret_key';

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


export async function GET({ params }) {
    const { id } = params;

    try {
        const report = await Report.findById(id).lean();
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
    const { id } = params;

    try {
        const deleted = await Report.findByIdAndDelete(id);
        if (!deleted) {
            return json({ error: 'Report not found' }, { status: 404 });
        }

        return json({ message: 'Report deleted successfully' }, { status: 200 });
    } catch (err) {
        console.error('Error deleting report:', err);
        return json({ error: 'Invalid ID or server error' }, { status: 500 });
    }
}
