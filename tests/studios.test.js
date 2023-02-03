const { setupDb, registerAndLogin } = require('./utils');
const request = require('supertest');
const app = require('../lib/app');

describe('studios routes', () => {
  beforeEach(setupDb);

  it('POST /', async () => {
    const [agent] = await registerAndLogin({ username: 'admin' });

    const studio = {
      name: 'films R Us',
      city: 'Santa Barbara',
      country: 'USA',
    };

    const res = await agent.post('/api/v1/studios').send(studio);

    expect(res.status).toBe(200);
    expect(res.body).toMatchInlineSnapshot(
      {
        id: expect.any(String),
      },
      `
      Object {
        "city": "Santa Barbara",
        "country": "USA",
        "id": Any<String>,
        "name": "films R Us",
      }
    `
    );
  });

  it('POST / 401', async () => {
    const res = await request(app).post('/api/v1/studios').send({});
    expect(res.status).toBe(401);
  });

  it('POST / 403', async () => {
    const [agent] = await registerAndLogin();
    const res = await agent.post('/api/v1/studios').send({});
    expect(res.status).toBe(403);
  });

  it('GET /', async () => {
    const [agent] = await registerAndLogin({ username: 'admin' });
    const { body: studio } = await agent.post('/api/v1/studios').send({
      name: 'films R Us',
      city: 'Santa Barbara',
      country: 'USA',
    });

    const res = await request(app).get(`/api/v1/studios/${studio.id}`);

    expect(res.status).toBe(200);
    expect(res.body).toEqual(studio);
  });

  it('GET / 404 on non-existent id', async () => {
    const res = await request(app).get('/api/v1/studios/99999');
    expect(res.status).toBe(404);
  });

  it('PUT /:id', async () => {
    const [agent] = await registerAndLogin({ username: 'admin' });
    const { body: studio } = await agent.post('/api/v1/studios').send({
      name: 'Roaring Lion Studios',
      city: 'Where you can find lions',
      country: 'USA',
    });
    const updated = {
      name: 'Roaring Lion Studio',
      city: 'Where you can find just one lion',
      country: 'USA',
    };
    const updateRes = await agent
      .put(`/api/v1/studios/${studio.id}`)
      .send(updated);
    expect(updateRes.status).toBe(201);
    const res = await agent.get(`/api/v1/studios/${studio.id}`);
    expect(res.body).toEqual({ ...updated, id: studio.id });
  });

  it('PUT /:id on non-existent ID', async () => {
    const [agent] = await registerAndLogin({ username: 'admin' });
    const updated = {
      name: 'Roaring Lion Studio',
      city: 'Where you can find just one lion',
      country: 'USA',
    };
    const updateRes = await agent.put('/api/v1/studios/0').send(updated);
    expect(updateRes.status).toBe(404);
  });

  it('DELETE /:id', async () => {
    const [agent] = await registerAndLogin({ username: 'admin' });
    const { body: studio } = await agent.post('/api/v1/studios').send({
      name: 'Roaring Lion Studios',
      city: 'Where you can find lions',
      country: 'USA',
    });
    const deleteRes = await agent.delete(`/api/v1/studios/${studio.id}`);
    expect(deleteRes.status).toBe(201);
    const res = await agent.get(`/api/v1/studios/${studio.id}`);
    expect(res.status).toBe(404);
  });

  it('DELETE /:id on non-existent ID', async () => {
    const [agent] = await registerAndLogin({ username: 'admin' });
    const deleteRes = await agent.delete('/api/v1/studios/0');
    expect(deleteRes.status).toBe(404);
  });
});
