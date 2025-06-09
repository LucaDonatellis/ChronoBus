import { validateToken } from '$lib/utils/auth.js';
import { json } from '@sveltejs/kit';
import { mongoose, Report } from '$lib/utils/mongodb.js';

export async function GET({ params }) {
	const { valid, payload, error } = validateToken(request);

	if (!valid) {
		return json({ error }, { status: 401 });
	}

	const { id } = params;

	try {
		const report = await Report.findById(id).lean();
		if (!report) {
			return json({ error: 'Report not found' }, { status: 404 });
		}

		return json(report, { status: 200 });
	} catch (err) {
		return json({ error: 'Invalid ID or server error' }, { status: 500 });
	}
}

export async function DELETE({ params }) {
	const { valid, payload, error } = validateToken(request);

	if (!valid) {
		return json({ error }, { status: 401 });
	}

	const { id } = params;

	try {
		const deleted = await Report.findByIdAndDelete(id);
		if (!deleted) {
			return json({ error: 'Report not found' }, { status: 404 });
		}

		return json({ message: 'Report deleted successfully' }, { status: 200 });
	} catch (err) {
		return json({ error: 'Invalid ID or server error' }, { status: 500 });
	}
}
