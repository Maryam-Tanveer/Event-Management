const request = require('supertest');
const app = require('../server');
const dbSetup = require('./db-setup');
const User = require('../models/User');

beforeAll(async () => {
  await dbSetup.connect();
});

afterEach(async () => {
  await dbSetup.clearDatabase();
});

afterAll(async () => {
  await dbSetup.closeDatabase();
});

describe('Auth API Endpoints', () => {
  const testUser = {
    name: 'Test User',
    email: 'test@example.com',
    password: 'password123',
    role: 'user'
  };

  it('should register a new user successfully', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send(testUser);
      
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('token');
    expect(res.body.user).toHaveProperty('email', testUser.email);
  });

  it('should not register user if email already exists', async () => {
    // Register first time
    await request(app).post('/api/auth/register').send(testUser);
    
    // Register second time
    const res = await request(app)
      .post('/api/auth/register')
      .send(testUser);
      
    expect(res.statusCode).toEqual(400); // Usually 400 for bad request
  });

  it('should login user and return a token', async () => {
    // Create user directly in db
    await request(app).post('/api/auth/register').send(testUser);
    
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: testUser.email,
        password: testUser.password
      });

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('token');
  });
});
