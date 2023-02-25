const { setupDb, registerAndLogin, mockUser } = require('./utils');
const request = require('supertest');
const app = require('../lib/app');

describe('user routes', () => {
  beforeEach(setupDb);

  it('creates a new user', async () => {
    const res = await request(app).post('/api/v1/users').send(mockUser);
    const { email } = mockUser;

    expect(res.body).toEqual({
      id: expect.any(String),
      email,
    });
  });

  it('signs in an existing user', async () => {
    await request(app).post('/api/v1/users').send(mockUser);
    const { email, password } = mockUser;
    const res = await request(app)
      .post('/api/v1/users/sessions')
      .send({ email, password });
    expect(res.status).toEqual(200);
  });

  it('/me should return a 401 if not authenticated', async () => {
    const res = await request(app).get('/api/v1/users/me');
    expect(res.status).toEqual(401);
  });

  it('/me should return user/token if authenticated', async () => {
    const [agent, user] = await registerAndLogin();
    const res = await agent.get('/api/v1/users/me');
    expect(res.status).toEqual(200);
    expect(res.body).toEqual(expect.objectContaining(user));
  });

  it('DELETE /sessions deletes the user session', async () => {
    const [agent] = await registerAndLogin();
    const resp = await agent.delete('/api/v1/users/sessions');
    expect(resp.status).toBe(204);
  });
});
