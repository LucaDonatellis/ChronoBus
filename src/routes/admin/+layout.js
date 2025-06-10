import { redirect } from '@sveltejs/kit';
import { errorAlert } from '$lib/stores/alert';

export function load() {
    if (typeof window !== 'undefined') {
        const token = localStorage.getItem('token');
        
        if (!token) {
            errorAlert("Accesso negato");
            throw redirect(303, '/profile/login');
        }

        try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            
            if (!payload.isAdmin) {
                errorAlert("Accesso negato");
                throw redirect(303, '/profile/login');
            }

            throw redirect(303, '/admin/announcements');
        } catch (e) {
            localStorage.removeItem('token');
            errorAlert("Accesso negato");
            throw redirect(303, '/profile/login');
        }
    }

    return {};
}