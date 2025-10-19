import request from 'supertest';
import express from 'express';
import authRoutes from '../../routes/authRoutes';
import { errorHandler } from '../../middleware/errorHandler';

// Create test app
const app = express();
app.use(express.json());
app.use('/api/auth', authRoutes);
app.use(errorHandler);

describe('Auth Integration Tests', () => {
  describe('POST /api/auth/register', () => {
    it('should register a new user with valid data', async () => {
      const userData = {
        email: `test${Date.now()}@example.com`,
        password: 'password123',
        firstName: 'John',
        age: 25,
        gender: 'male',
        interestedIn: ['female'],
      };

      const response = await request(app)
        .post('/api/auth/register')
        .send(userData);

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('token');
      expect(response.body).toHaveProperty('user');
      expect(response.body.user.email).toBe(userData.email);
      expect(response.body.user).toHaveProperty('profile');
      expect(response.body.user.profile.firstName).toBe(userData.firstName);
    }, 15000);

    it('should reject registration with missing fields', async () => {
      const userData = {
        email: 'test@example.com',
        password: 'password123',
        // Missing firstName, age, gender, interestedIn
      };

      const response = await request(app)
        .post('/api/auth/register')
        .send(userData);

      expect(response.status).toBe(400);
    });

    it('should reject registration with invalid email', async () => {
      const userData = {
        email: 'invalid-email',
        password: 'password123',
        firstName: 'John',
        age: 25,
        gender: 'male',
        interestedIn: ['female'],
      };

      const response = await request(app)
        .post('/api/auth/register')
        .send(userData);

      expect(response.status).toBe(400);
    });

    it('should reject registration with age under 18', async () => {
      const userData = {
        email: 'test@example.com',
        password: 'password123',
        firstName: 'John',
        age: 16,
        gender: 'male',
        interestedIn: ['female'],
      };

      const response = await request(app)
        .post('/api/auth/register')
        .send(userData);

      expect(response.status).toBe(400);
    });
  });

  describe('POST /api/auth/login', () => {
    const testUser = {
      email: `logintest${Date.now()}@example.com`,
      password: 'password123',
      firstName: 'Jane',
      age: 24,
      gender: 'female',
      interestedIn: ['male'],
    };

    beforeAll(async () => {
      // Register test user
      await request(app).post('/api/auth/register').send(testUser);
    }, 15000);

    it('should login with correct credentials', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: testUser.email,
          password: testUser.password,
        });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('token');
      expect(response.body).toHaveProperty('user');
      expect(response.body.user.email).toBe(testUser.email);
    }, 15000);

    it('should reject login with incorrect password', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: testUser.email,
          password: 'wrongpassword',
        });

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('error');
    });

    it('should reject login with non-existent email', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'nonexistent@example.com',
          password: 'password123',
        });

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('error');
    });
  });

  describe('GET /api/auth/me', () => {
    let authToken: string;
    const testUser = {
      email: `metest${Date.now()}@example.com`,
      password: 'password123',
      firstName: 'Test',
      age: 26,
      gender: 'non-binary',
      interestedIn: ['male', 'female'],
    };

    beforeAll(async () => {
      // Register and get token
      const response = await request(app)
        .post('/api/auth/register')
        .send(testUser);
      authToken = response.body.token;
    }, 15000);

    it('should return current user with valid token', async () => {
      const response = await request(app)
        .get('/api/auth/me')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body.email).toBe(testUser.email);
      expect(response.body).toHaveProperty('profile');
    });

    it('should reject request without token', async () => {
      const response = await request(app).get('/api/auth/me');

      expect(response.status).toBe(401);
    });

    it('should reject request with invalid token', async () => {
      const response = await request(app)
        .get('/api/auth/me')
        .set('Authorization', 'Bearer invalid.token.here');

      expect(response.status).toBe(401);
    });
  });
});

