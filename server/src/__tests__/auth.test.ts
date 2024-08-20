import request from 'supertest';
import app from '../server'; // Correctly import the app instance

describe('Auth API', () => {
  it('should register a new user', async () => {
    const res = await request(app)
      .post('/api/v1/auth/register')  // Make sure the route matches your app setup
      .send({
        username: 'testuser',
        password: 'Test@123',
      });
    
      console.log("res");

    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('token');
    expect(res.body).toHaveProperty('user');
  });

  it('should login a user', async () => {
    const res = await request(app)
      .post('/api/v1/auth/login')  // Ensure the route matches
      .send({
        username: 'testuser',
        password: 'Test@123',
      });

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('token');
  });
});
