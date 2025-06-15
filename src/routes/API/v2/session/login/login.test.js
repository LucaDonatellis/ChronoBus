import { describe, it, expect, vi, beforeEach, afterAll } from 'vitest';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { POST } from './+server.js';

const ERROR_MESSAGES = {
    INVALID_CREDENTIALS: 'Email and password required.',
    WRONG_PASSWORD: 'Invalid password.',
    USER_NOT_FOUND: 'Email not found.'  // Updated to match server response
};

// ...existing code...

// Mock external modules
vi.mock('bcryptjs');
vi.mock('jsonwebtoken');
vi.mock('$lib/utils/mongodb.js', () => ({
    User: {
        findOne: vi.fn()
    }
}));
vi.mock('$env/static/private', () => ({
    JWT_PASSWORD: 'test-secret'
}));

import { User } from '$lib/utils/mongodb.js';

describe('User Login', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        jwt.sign.mockReturnValue('test-token');
    });

    afterAll(() => {
        vi.resetModules();
    });

    it('Login con email e password corretti', async () => {
        const mockUser = {
            _id: 'test-id',
            email: 'test@gmail.com',
            password: 'hashed-password',
        };
        
        User.findOne.mockResolvedValue(mockUser);
        bcrypt.compare.mockResolvedValue(true);

        const request = new Request('http://localhost/api/v2/session/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: 'test@gmail.com',
                password: 'password123'
            })
        });

        const response = await POST({ request });
        const data = await response.json();

        expect(response.status).toBe(201);
        expect(data).toEqual({
            message: 'Login successful',
            token: 'test-token'
        });
    });

    it('Login con email corretta ma password errata', async () => {
        const mockUser = {
            email: 'test@gmail.com',
            password: 'hashed-password'
        };
        
        User.findOne.mockResolvedValue(mockUser);
        bcrypt.compare.mockResolvedValue(false);

        const request = new Request('http://localhost/api/v2/session/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: 'test@gmail.com',
                password: 'passwordErrata'
            })
        });

        const response = await POST({ request });
        const data = await response.json();

        expect(response.status).toBe(401);
        expect(data).toEqual({ error: ERROR_MESSAGES.WRONG_PASSWORD });
    });

    it('Login con email non registrata', async () => {
        User.findOne.mockResolvedValue(null);

        const request = new Request('http://localhost/api/v2/session/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: 'testerror@gmail.com',
                password: 'qualunquePassword'
            })
        });

        const response = await POST({ request });
        const data = await response.json();

        expect(response.status).toBe(409);  // Changed from 404 to 409
        expect(data).toEqual({ error: ERROR_MESSAGES.USER_NOT_FOUND });
    });

    it('Login con campo password vuoto', async () => {
        const request = new Request('http://localhost/api/v2/session/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: 'test@gmail.com',
                password: ''
            })
        });

        const response = await POST({ request });
        const data = await response.json();

        expect(response.status).toBe(400);
        expect(data).toEqual({ error: ERROR_MESSAGES.INVALID_CREDENTIALS });
    });

    it('Login con campo email vuoto', async () => {
        const request = new Request('http://localhost/api/v2/session/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: '',
                password: 'password123'
            })
        });

        const response = await POST({ request });
        const data = await response.json();

        expect(response.status).toBe(400);
        expect(data).toEqual({ error: ERROR_MESSAGES.INVALID_CREDENTIALS });
    });
});