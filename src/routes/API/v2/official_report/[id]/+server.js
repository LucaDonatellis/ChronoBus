import { validateToken } from '$lib/utils/auth.js';
import { mongoose, OfficialReport } from '$lib/utils/mongodb.js';
import { json } from '@sveltejs/kit';

export async function GET({ params }) {
	const { valid, payload, error } = validateToken(request);

	if (!valid) {
		return json({ error }, { status: 401 });
	}

	const { id } = params;

	try {
		const report = await OfficialReport.findById(id).lean();
		if (!report) {
			return json({ error: 'Report not found' }, { status: 404 });
		}

		return json(report, { status: 200 });
	} catch (err) {
		return json({ error: 'Invalid ID or server error' }, { status: 500 });
	}
}

export async function DELETE({ request, params }) {
	const { valid, payload, error } = validateToken(request);

	if (!valid) {
		return json({ error }, { status: 401 });
	}

	const { id } = params;

	try {
		const deleted = await OfficialReport.findByIdAndDelete(id);
		if (!deleted) {
			return json({ error: 'Report not found' }, { status: 404 });
		}

		return json({ message: 'Report deleted successfully' }, { status: 200 });
	} catch (err) {
		return json({ error: 'Invalid ID or server error' }, { status: 500 });
	}
}
