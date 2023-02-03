const { readFileSync } = require('node:fs');
const request = require('supertest');
const pool = require('../sql/pool');
const app = require('../lib/app');
const sql = readFileSync('./sql/setup.sql', 'utf-8');

function setupDb() {
  return pool.query(sql);
}

function closeAll() {
  return pool.end();
}

afterAll(closeAll);

// Dummy user for testing
const mockUser = {
  username: 'testuser',
  firstName: 'Test',
  lastName: 'User',
  email: 'test@example.com',
  password: '12345',
};

async function registerAndLogin (userProps = {}) {
  const password = userProps.password ?? mockUser.password;

  // Create an "agent" that gives us the ability
  // to store cookies between requests in a test
  const agent = request.agent(app);

  // Create a user to sign in with
  const { body: user } = await request(app).post('/api/v1/users').send({ ...mockUser, ...userProps });
   
  // ...then sign in
  const { email } = user;
  await agent.post('/api/v1/users/sessions').send({ email, password });

  return [agent, user];
}

module.exports = {
  setupDb,
  registerAndLogin,
  mockUser,
};
