const axios = require('axios');

describe('API Login - E2E Test', () => {

  const LOGIN_API_URL = 'https://chronobus-44gy.onrender.com/profile/login';

  const validUser = {
    email: 'test@gmail.com',
    password: 'password123'
  };

  it('Login con credenziali corrette restituisce token', async () => {
    const res = await axios.post(LOGIN_API_URL, validUser);
    
    expect(res.status).toBe(201);
    expect(res.data).toHaveProperty('message', 'Login successful');
    expect(res.data).toHaveProperty('token');
    expect(res.data).toHaveProperty('isAdmin');
    expect(typeof res.data.token).toBe('string');
  });

  it('Login fallisce senza email', async () => {
    try {
      await axios.post(LOGIN_API_URL, { password: 'password123' });
    } catch (err) {
      expect(err.response.status).toBe(400);
      expect(err.response.data.error).toBe('Email and password required.');
    }
  });

  it('Login fallisce senza password', async () => {
    try {
      await axios.post(LOGIN_API_URL, { email: 'test@gmail.com' });
    } catch (err) {
      expect(err.response.status).toBe(400);
      expect(err.response.data.error).toBe('Email and password required.');
    }
  });

  it('Login fallisce con email non presente', async () => {
    try {
      await axios.post(LOGIN_API_URL, {
        email: 'nonpresente@example.com',
        password: 'abcd'
      });
    } catch (err) {
      expect(err.response.status).toBe(409);
      expect(err.response.data.error).toBe('Email not found.');
    }
  });

  it('Login fallisce con password errata', async () => {
    try {
      await axios.post(LOGIN_API_URL, {
        email: 'test@gmail.com',
        password: 'wrongpassword'
      });
    } catch (err) {
      expect(err.response.status).toBe(401);
      expect(err.response.data.error).toBe('Invalid password.');
    }
  });

});