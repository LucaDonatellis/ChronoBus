import { User } from '$lib/utils/mongodb.js';
import { json } from '@sveltejs/kit';
import { validateToken } from '$lib/utils/auth.js';

export async function GET({ params, request }) {
    const { id } = params;
    const { valid, payload, error } = validateToken(request);

    if (!valid) {
        return json({ error }, { status: 401 });
    }
    if (!payload.isAdmin) {
        return json({ error: 'Unauthorized' }, { status: 403 });
    }

    try {
        const user = await User.findById(id).lean();
        if (!user) {
            return json({ error: 'User not found' }, { status: 404 });
        }
        return json(user, { status: 200 });
    } catch (err) {
        console.error('Error fetching user:', err);
        return json({ error: 'Server error' }, { status: 500 });
    }
}

export async function DELETE({ params, request }) {
    const { id } = params;
    const { valid, payload, error } = validateToken(request);

    if (!valid) {
        return json({ error }, { status: 401 });
    }
    if (!payload.isAdmin && !payload.userId !== id) {
        return json({ error: 'Unauthorized' }, { status: 403 });
    }

    try {
        const user = await User.findByIdAndDelete(id);
        if (!user) {
            return json({ error: 'User not found' }, { status: 404 });
        }
        return json({ message: 'User deleted successfully' }, { status: 200 });
    } catch (err) {
        console.error('Error deleting user:', err);
        return json({ error: 'Server error' }, { status: 500 });
    }
}

export async function PATCH({ params, request }) {
    const { id } = params;
    const { valid, payload, error } = validateToken(request);

    if (!valid) {
        return json({ error }, { status: 401 });
    }
    if (!payload.isAdmin && !payload.userId !== id) {
        return json({ error: 'Unauthorized' }, { status: 403 });
    }

    try {
        const body = await request.json();
        const updateData = {};
        let updated = false;

        if (body.isAdmin && typeof body.isAdmin === 'boolean' && payload.isAdmin) {
            updateData.isAdmin = body.isAdmin;
            updated = true;
        }
        if (body.notificationsAdvance && typeof body.notificationsAdvance === 'number') {
            updateData.notificationsAdvance = body.notificationsAdvance;
            updated = true;
        }

        const updatedUser = await User.findByIdAndUpdate(id, updateData, {
            new: true
        });

        if (!updatedUser) {
            return json({ error: 'User not found' }, { status: 404 });
        }
        if (!updated) {
            return json({ error: 'No valid fields to update' }, { status: 400 });
        }

        return json({ message: 'User updated', user: updatedUser });
    } catch (err) {
        console.error('Error updating user:', err);
        return json({ error: 'Server error' }, { status: 500 });
    }
}