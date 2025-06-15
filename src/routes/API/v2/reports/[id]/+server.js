import { json } from '@sveltejs/kit';
import { validateToken } from '$lib/utils/auth.js';
import { Report } from '$lib/utils/mongodb.js';

export async function GET({ params, request }) {
    const { valid, payload, error } = validateToken(request);

    if (!valid) {
        return json({ error: 'Non autorizzato' }, { status: 401 });
    }

    try {
        const report = await Report.findById(params.id);
        
        if (!report) {
            return json({ error: 'Report not found' }, { status: 404 });
        }

        return json(report, { status: 200 });
    } catch (error) {
        return json({ error: 'Invalid ID or server error' }, { status: 500 });
    }
}
export async function DELETE({ params, request }) {
    const { valid, payload, error } = validateToken(request);

    if (!valid) {
        return json({ error: 'Non autorizzato' }, { status: 401 });
    }

    const report = await Report.findByIdAndDelete(params.id);
    
    if (!report) {
        return json({ error: 'Report not found' }, { status: 404 });
    }

    return json({ message: 'Report deleted successfully' }, { status: 200 });
}