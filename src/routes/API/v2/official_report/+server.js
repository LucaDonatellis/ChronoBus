import { json } from '@sveltejs/kit';
import { validateToken } from '$lib/utils/auth';
import { mongoose, OfficialReport } from '$lib/utils/mongodb.js';

export async function GET({ request }) {
	try {
		const reports = await OfficialReport.find().lean();
		return json(reports, { status: 200 });
	} catch (err) {
		return json({ error: 'Server error' }, { status: 500 });
	}
}

export async function POST({ request }) {
	const { valid, payload, error } = validateToken(request);

	if (!valid) {
		return json({ error }, { status: 401 });
	}
	if (!payload.isAdmin) {
		return json({ error: 'Unauthorized' }, { status: 403 });
	}

	try {
		const data = await request.json();
		let { text, expireAt } = data;

		if (!text || !expireAt || typeof text !== 'string' || typeof expireAt !== 'string') {
			return json({ error: 'Missing fields' }, { status: 201 });
		}
		expireAt = new Date(new Date(expireAt).toISOString()).getTime();
		if (expireAt < Date.now()) {
			return json({ error: 'Invalid ending time' }, { status: 400 });
		}

		const officialReport = new OfficialReport({ text, expireAt });

		await officialReport.save();

		return json({ message: 'Report saved successfully' }, { status: 201 });
	} catch (err) {
		return json({ error: 'Server error' }, { status: 500 });
	}
}
