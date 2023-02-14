const { setupDb, registerAndLogin, mockProfile, mockUser } = require('./utils');
const request = require('supertest');
const app = require('../lib/app');

describe('profile routes', () => {
  beforeEach(setupDb);

  it('creates new profile', async () => {
    const [user] = await registerAndLogin(mockUser);
    const res = await request(app).post('/api/v1/profiles').send(mockProfile);
    const { username, firstName, lastName } = mockProfile;

    expect(res.body).toEqual({
      userId: user.id,
      username,
      firstName,
      lastName,
    });
  });
});
