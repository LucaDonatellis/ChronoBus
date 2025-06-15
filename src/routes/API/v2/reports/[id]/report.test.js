import { describe, it, expect, vi, beforeEach, afterAll } from 'vitest';
import { GET, DELETE } from './+server.js';
import { validateToken } from '$lib/utils/auth.js';

const ERROR_MESSAGES = {
    UNAUTHORIZED: 'Non autorizzato',
    REPORT_NOT_FOUND: 'Report not found',
    INVALID_ID: 'Invalid ID or server error'
};

// Mock modules
vi.mock('$lib/utils/mongodb.js', () => ({
    Report: {
        findById: vi.fn(),
        findByIdAndDelete: vi.fn()
    }
}));

vi.mock('$lib/utils/auth.js', () => ({
    validateToken: vi.fn()
}));

import { Report } from '$lib/utils/mongodb.js';

describe('Single Report Operations', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    afterAll(() => {
        vi.resetModules();
    });

    describe('GET /reports/{id}', () => {
        it('Recupero di un report tramite ID valido', async () => {
            validateToken.mockReturnValue({
                valid: true,
                payload: { userId: 'test-user' }
            });

            const mockReport = {
                _id: 'valid-id',
                line: '42',
                time: Date.now(),
                crowdedness: 'crowded',
                userId: 'test-user'
            };

            Report.findById.mockResolvedValue(mockReport);

            const response = await GET({
                params: { id: 'valid-id' },
                request: new Request('http://test.com')
            });

            const data = await response.json();

            expect(response.status).toBe(200);
            expect(data).toEqual(mockReport);
        });

        it('Recupero con ID non valido (formato errato)', async () => {
            validateToken.mockReturnValue({
                valid: true,
                payload: { userId: 'test-user' }
            });

            Report.findById.mockRejectedValue(new Error('Invalid ID'));

            const response = await GET({
                params: { id: '1234' },
                request: new Request('http://test.com')
            });

            const data = await response.json();

            expect(response.status).toBe(500);
            expect(data).toEqual({ error: ERROR_MESSAGES.INVALID_ID });
        });

        it('Recupero con ID valido ma non esistente', async () => {
            validateToken.mockReturnValue({
                valid: true,
                payload: { userId: 'test-user' }
            });

            Report.findById.mockResolvedValue(null);

            const response = await GET({
                params: { id: 'non-existent-id' },
                request: new Request('http://test.com')
            });

            const data = await response.json();

            expect(response.status).toBe(404);
            expect(data).toEqual({ error: ERROR_MESSAGES.REPORT_NOT_FOUND });
        });
    });

    describe('DELETE /reports/{id}', () => {
        it('Eliminazione con ID valido e token JWT', async () => {
            validateToken.mockReturnValue({
                valid: true,
                payload: { userId: 'test-user' }
            });

            Report.findByIdAndDelete.mockResolvedValue({ id: 'valid-id' });

            const response = await DELETE({
                params: { id: 'valid-id' },
                request: new Request('http://test.com')
            });

            const data = await response.json();

            expect(response.status).toBe(200);
            expect(data).toEqual({ message: 'Report deleted successfully' });
        });

        it('Eliminazione con JWT non valido', async () => {
            validateToken.mockReturnValue({
                valid: false,
                error: ERROR_MESSAGES.UNAUTHORIZED
            });

            const response = await DELETE({
                params: { id: 'valid-id' },
                request: new Request('http://test.com')
            });

            const data = await response.json();

            expect(response.status).toBe(401);
            expect(data).toEqual({ error: ERROR_MESSAGES.UNAUTHORIZED });
        });

        it('Eliminazione con ID non presente', async () => {
            validateToken.mockReturnValue({
                valid: true,
                payload: { userId: 'test-user' }
            });

            Report.findByIdAndDelete.mockResolvedValue(null);

            const response = await DELETE({
                params: { id: 'non-existent-id' },
                request: new Request('http://test.com')
            });

            const data = await response.json();

            expect(response.status).toBe(404);
            expect(data).toEqual({ error: ERROR_MESSAGES.REPORT_NOT_FOUND });
        });

        it('Eliminazione senza autenticazione', async () => {
            validateToken.mockReturnValue({
                valid: false,
                error: ERROR_MESSAGES.UNAUTHORIZED
            });

            const response = await DELETE({
                params: { id: 'valid-id' },
                request: new Request('http://test.com', {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                })
            });

            const data = await response.json();

            expect(response.status).toBe(401);
            expect(data).toEqual({ error: ERROR_MESSAGES.UNAUTHORIZED });
        });
    });
});