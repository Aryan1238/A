/**
 * PrepPilot - Authentication Test Suite
 * Validates registration, login, JWT validation, and /me endpoints.
 */

const request = require('supertest');
const app = require('../src/app');
require('./setup');

describe('Auth API Endpoints', () => {
  const testUser = {
    name: 'College Candidate',
    email: 'candidate@university.edu',
    password: 'SecurePassword123'
  };

  describe('POST /api/auth/register', () => {
    it('should register a new user successfully and return token', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send(testUser);

      expect(res.statusCode).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty('token');
      expect(res.body.data.user.email).toBe(testUser.email);
      expect(res.body.data.user.name).toBe(testUser.name);
      expect(res.body.data.user).not.toHaveProperty('passwordHash');
    });

    it('should return 409 when registering with existing email', async () => {
      await request(app).post('/api/auth/register').send(testUser);

      const duplicateRes = await request(app)
        .post('/api/auth/register')
        .send(testUser);

      expect(duplicateRes.statusCode).toBe(409);
      expect(duplicateRes.body.success).toBe(false);
    });

    it('should reject registration if password is less than 6 characters', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          name: 'Short Pass',
          email: 'short@example.com',
          password: '123'
        });

      expect(res.statusCode).toBe(400);
      expect(res.body.success).toBe(false);
    });
  });

  describe('POST /api/auth/login', () => {
    beforeEach(async () => {
      await request(app).post('/api/auth/register').send(testUser);
    });

    it('should log in with valid credentials and return a token', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: testUser.email,
          password: testUser.password
        });

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty('token');
      expect(res.body.data.user.email).toBe(testUser.email);
    });

    it('should reject login with wrong password', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: testUser.email,
          password: 'IncorrectPassword'
        });

      expect(res.statusCode).toBe(401);
      expect(res.body.success).toBe(false);
    });
  });

  describe('GET /api/auth/me', () => {
    it('should return user profile when authenticated with valid token', async () => {
      const regRes = await request(app).post('/api/auth/register').send(testUser);
      const token = regRes.body.data.token;

      const meRes = await request(app)
        .get('/api/auth/me')
        .set('Authorization', `Bearer ${token}`);

      expect(meRes.statusCode).toBe(200);
      expect(meRes.body.success).toBe(true);
      expect(meRes.body.data.user.email).toBe(testUser.email);
    });

    it('should return 401 when no token is provided', async () => {
      const res = await request(app).get('/api/auth/me');

      expect(res.statusCode).toBe(401);
      expect(res.body.success).toBe(false);
    });
  });
});
