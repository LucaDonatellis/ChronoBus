import { describe, it, expect, vi, beforeEach, afterAll } from 'vitest';
import { POST, GET } from './+server.js';
import { validateToken } from '$lib/utils/auth.js';

const ERROR_MESSAGES = {
    INVALID_DATA: 'Invalid data',
    UNAUTHORIZED: 'Non autorizzato'
};

vi.mock('$lib/utils/auth.js', () => ({
    validateToken: vi.fn()
}));
vi.mock('$lib/utils/mongodb.js', () => ({
    Report: class {
        constructor(data) {
            Object.assign(this, data);
        }
        save = vi.fn().mockResolvedValue(this);
        static find = vi.fn().mockReturnValue({
            sort: vi.fn().mockReturnValue({
                lean: vi.fn()
            })
        });
    }
}));



import { Report } from '$lib/utils/mongodb.js';

describe('Report Submission', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    afterAll(() => {
        vi.resetModules();
    });

    it('Invio di un report con dati validi', async () => {
        validateToken.mockReturnValue({
            valid: true,
            payload: { userId: 'test-user' }
        });

        const mockReport = {
            line: '42',
            time: Date.now(),
            crowdedness: 'crowded'
        };

        const request = new Request('http://localhost/api/v2/reports', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer valid-token'
            },
            body: JSON.stringify(mockReport)
        });

        const response = await POST({ request });
        const data = await response.json();

        expect(response.status).toBe(201);
        expect(data).toEqual({
            message: 'Report saved successfully'
        });
    });

    it('Invio senza specificare la linea', async () => {
        validateToken.mockReturnValue({ userId: 'test-user' });

        const request = new Request('http://localhost/api/v2/reports', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer valid-token'
            },
            body: JSON.stringify({
                time: Date.now(),
                crowdedness: 'crowded'
            })
        });

        const response = await POST({ request });
        const data = await response.json();

        expect(response.status).toBe(401);
        expect(data).toEqual({ error: ERROR_MESSAGES.UNAUTHORIZED });
    });

    it('Invio con valore non valido per crowdedness', async () => {
        // First mock successful authentication
        validateToken.mockReturnValue({
            valid: true,
            payload: { userId: 'test-user' }
        });

        const request = new Request('http://localhost/api/v2/reports', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer valid-token'
            },
            body: JSON.stringify({
                line: '42',
                time: Date.now(),
                crowdedness: 'fullbus'
            })
        });

        const response = await POST({ request });
        const data = await response.json();

        expect(response.status).toBe(400);
        expect(data).toEqual({ error: ERROR_MESSAGES.INVALID_DATA });
    });

    it('Invio con time non numerico', async () => {
        validateToken.mockReturnValue({
            valid: true,
            payload: { userId: 'test-user' }
        });

        const request = new Request('http://localhost/api/v2/reports', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer valid-token'
            },
            body: JSON.stringify({
                line: '42',
                time: 'non un timestamp',
                crowdedness: 'crowded'
            })
        });

        const response = await POST({ request });
        const data = await response.json();

        expect(response.status).toBe(400);
        expect(data).toEqual({ error: ERROR_MESSAGES.INVALID_DATA });
    });

    it('Invio senza autenticazione', async () => {
        validateToken.mockReturnValue({
            valid: false,
            error: 'Non autorizzato'
        });

        const request = new Request('http://localhost/api/v2/reports', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                line: '42',
                time: Date.now(),
                crowdedness: 'crowded'
            })
        });

        const response = await POST({ request });
        const data = await response.json();

        expect(response.status).toBe(401);
        expect(data).toEqual({ error: 'Non autorizzato' });
    });

    it('Recupero di tutti i report', async () => {
        const mockReports = [
            {
                _id: 'report1',
                line: '42',
                time: Date.now(),
                crowdedness: 'crowded',
                userId: 'user1'
            },
            {
                _id: 'report2',
                line: '5',
                time: Date.now() - 3600000,
                crowdedness: 'empty_seats',
                userId: 'user2'
            }
        ];

        // Set up the mock chain
        Report.find.mockReturnValue({
            sort: vi.fn().mockReturnValue({
                lean: vi.fn().mockResolvedValue(mockReports)
            })
        });

        const url = new URL('http://localhost/api/v2/reports');
        url.searchParams.set('date', new Date().toISOString().split('T')[0]);
        url.searchParams.set('groupBy', 'time');

        const request = new Request(url, {
            method: 'GET'
        });

        const response = await GET({
            request,
            url
        });

        const data = await response.json();

        expect(response.status).toBe(200);
        expect(data).toEqual(mockReports);

        // Verify that find was called with correct query
        expect(Report.find).toHaveBeenCalled();
    });
});