
import request  from'supertest';
import {app} from '../server';

describe('HNG13 Stage Zero Backend API', () => {
  describe('GET /me', () => {
    it('should return 200 OK with correct response structure', async () => {
      const response = await request(app).get('/me');
      
      expect(response.status).toBe(200);
      expect(response.headers['content-type']).toMatch(/application\/json/);
      
      // Check response structure
      expect(response.body).toHaveProperty('status', 'success');
      expect(response.body).toHaveProperty('user');
      expect(response.body).toHaveProperty('timestamp');
      expect(response.body).toHaveProperty('fact');
      
      // Check user object structure
      expect(response.body.user).toHaveProperty('email');
      expect(response.body.user).toHaveProperty('name');
      expect(response.body.user).toHaveProperty('stack');
      
      // Check data types
      expect(typeof response.body.user.email).toBe('string');
      expect(typeof response.body.user.name).toBe('string');
      expect(typeof response.body.user.stack).toBe('string');
      expect(typeof response.body.timestamp).toBe('string');
      expect(typeof response.body.fact).toBe('string');
      
      // Check timestamp format (ISO 8601)
      expect(new Date(response.body.timestamp).toISOString()).toBe(response.body.timestamp);
    });

    it('should have different timestamps on subsequent requests', async () => {
      const response1 = await request(app).get('/me');
      const response2 = await request(app).get('/me');
      
      expect(response1.body.timestamp).not.toBe(response2.body.timestamp);
    });

    it('should always return status as "success"', async () => {
      const response = await request(app).get('/me');
      expect(response.body.status).toBe('success');
    });
  });

  describe('GET /health', () => {
    it('should return 200 OK with health status', async () => {
      const response = await request(app).get('/health');
      
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('status', 'success');
      expect(response.body).toHaveProperty('message', 'Service is healthy');
      expect(response.body).toHaveProperty('timestamp');
      expect(response.body).toHaveProperty('uptime');
    });
  });

  describe('GET /', () => {
    it('should return API information', async () => {
      const response = await request(app).get('/');
      
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('status', 'success');
      expect(response.body).toHaveProperty('message');
      expect(response.body).toHaveProperty('endpoints');
    });
  });

  describe('404 Handler', () => {
    it('should return 404 for unknown endpoints', async () => {
      const response = await request(app).get('/unknown-endpoint');
      
      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('status', 'error');
      expect(response.body).toHaveProperty('message', 'Endpoint not found');
    });
  });
});