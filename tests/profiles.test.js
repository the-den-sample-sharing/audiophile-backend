const { setupDb, mockProfile, mockUser } = require('./utils');
const request = require('supertest');
const app = require('../lib/app');

describe('profile routes', () => {
  beforeEach(setupDb);

  it('creates new profile', async () => {
    const agent = request.agent(app);
    await agent.post('/api/v1/users').send(mockUser);
    await agent.post('/api/v1/users/sessions').send(mockUser);
    const res = await agent.post('/api/v1/profiles').send(mockProfile);
    const { username, firstName, lastName } = mockProfile;
    expect(res.body).toEqual({
      userId: expect.any(String),
      username,
      firstName,
      lastName,
    });
  });
});
