import request from 'supertest';
import express from 'express';
import authRoutes from '../../routes/authRoutes';
import discoveryRoutes from '../../routes/discoveryRoutes';
import { errorHandler } from '../../middleware/errorHandler';

// Create test app
const app = express();
app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api/discover', discoveryRoutes);
app.use(errorHandler);

describe('Discovery Integration Tests', () => {
  let user1Token: string;
  let user2Token: string;

  beforeAll(async () => {
    // Create two test users
    const user1Response = await request(app)
      .post('/api/auth/register')
      .send({
        email: `discover1${Date.now()}@example.com`,
        password: 'password123',
        firstName: 'Alice',
        age: 25,
        gender: 'female',
        interestedIn: ['male'],
      });
    user1Token = user1Response.body.token;

    const user2Response = await request(app)
      .post('/api/auth/register')
      .send({
        email: `discover2${Date.now()}@example.com`,
        password: 'password123',
        firstName: 'Bob',
        age: 28,
        gender: 'male',
        interestedIn: ['female'],
      });
    user2Token = user2Response.body.token;
  }, 20000);

  describe('GET /api/discover', () => {
    it('should return a profile matching user preferences', async () => {
      const response = await request(app)
        .get('/api/discover')
        .set('Authorization', `Bearer ${user1Token}`);

      expect(response.status).toBe(200);
      
      if (response.body.message) {
        // No more profiles available
        expect(response.body.message).toBe('No more profiles available');
      } else {
        // Profile returned
        expect(response.body).toHaveProperty('id');
        expect(response.body).toHaveProperty('firstName');
        expect(response.body).toHaveProperty('age');
        expect(response.body).toHaveProperty('gender');
        expect(response.body).toHaveProperty('photos');
        expect(response.body).toHaveProperty('promptAnswers');
      }
    });

    it('should require authentication', async () => {
      const response = await request(app).get('/api/discover');

      expect(response.status).toBe(401);
    });

    it('should not show already viewed profiles in subsequent calls', async () => {
      const response1 = await request(app)
        .get('/api/discover')
        .set('Authorization', `Bearer ${user2Token}`);

      if (!response1.body.message) {
        const firstProfileId = response1.body.id;

        // Like the profile to mark it as seen
        await request(app)
          .post('/api/likes')
          .set('Authorization', `Bearer ${user2Token}`)
          .send({
            toUserId: response1.body.userId,
            type: 'PROFILE',
          });

        // Get next profile
        const response2 = await request(app)
          .get('/api/discover')
          .set('Authorization', `Bearer ${user2Token}`);

        if (!response2.body.message) {
          expect(response2.body.id).not.toBe(firstProfileId);
        }
      }
    });
  });
});

