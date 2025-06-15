import { describe, it, expect, vi, beforeEach, afterAll } from 'vitest';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { POST } from './+server.js';

const ERROR_MESSAGES = {
    INVALID_CREDENTIALS: 'Email and password required.',
    EMAIL_EXISTS: 'Account already exists with this email.',
    PASSWORD_TOO_SHORT: 'Password must be at least 8 characters long.',
    INVALID_EMAIL: 'Invalid email format.'
};

// Mock external modules
vi.mock('bcryptjs');
vi.mock('jsonwebtoken');
vi.mock('$lib/utils/mongodb.js', () => ({
    User: class {
        constructor(data) {
            this.email = data.email;
            this.password = data.password;
            this._id = 'test-id';
            this.isAdmin = false;
        }
        static findOne = vi.fn();
        static create = vi.fn();
        save = vi.fn().mockResolvedValue(this);
    }
}));
vi.mock('$env/static/private', () => ({
    JWT_PASSWORD: 'test-secret'
}));
vi.mock('$lib/utils/auth.js', () => ({
    validateToken: vi.fn()
}));

import { User } from '$lib/utils/mongodb.js';

describe('User Registration', () => {
    afterAll(() => {
        vi.resetModules();
    });

    beforeEach(() => {
        vi.clearAllMocks();
        // Add JWT mock implementation
        jwt.sign.mockReturnValue('test-token');
    });

    it('Registrazione di un nuovo utente con email e password validi', async () => {
    User.findOne.mockResolvedValue(null);
    bcrypt.hash.mockResolvedValue('hashed-password');
    
    const mockUser = {
        email: 'test@gmail.com',
        password: 'hashed-password',
        _id: 'test-id',
        isAdmin: false,
        save: vi.fn().mockResolvedValue(this)
    };
    
    User.create.mockResolvedValue(mockUser);

    const request = new Request('http://localhost/api/v2/users/register', {
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
        message: 'Registration successful',
        token: 'test-token'
    });
    
    // Updated JWT verification to match actual implementation
    expect(jwt.sign).toHaveBeenCalledWith(
        {
            userId: mockUser._id,
            email: mockUser.email,
            isAdmin: mockUser.isAdmin
        },
        'test-secret',
        { expiresIn: '30d' }
    );
});

    it('Registrazione con un indirizzo email non valido (email vuota)', async () => {
        const request = new Request('http://localhost/api/v2/users/register', {
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

    it('Registrazione con email già registrata', async () => {
        User.findOne.mockResolvedValue({ email: 'test@gmail.com' });

        const request = new Request('http://localhost/api/v2/users/register', {
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

        expect(response.status).toBe(409);
        expect(data).toEqual({ error: ERROR_MESSAGES.EMAIL_EXISTS });
    });

    it('Registrazione con campo email vuoto', async () => {
        const request = new Request('http://localhost/api/v2/users/register', {
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
        expect(data).toEqual({ 
            error: ERROR_MESSAGES.INVALID_CREDENTIALS 
        });
    });

    it('Registrazione con campo password vuoto', async () => {
        const request = new Request('http://localhost/api/v2/users/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: 'test2@gmail.com',
                password: ''
            })
        });

        const response = await POST({ request });
        const data = await response.json();

        expect(response.status).toBe(400);
        expect(data).toEqual({ 
            error: ERROR_MESSAGES.INVALID_CREDENTIALS 
        });
    });
});