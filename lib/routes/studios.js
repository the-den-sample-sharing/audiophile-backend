const { Router } = require('express');
const authenticate = require('../middleware/authenticate');
const authorize = require('../middleware/authorize.js');
const Studio = require('../models/Studio.js');

module.exports = Router()
  .post('/', authenticate, authorize, async (req, res, next) => {
    try {
      const studio = await Studio.insert(req.body);
      res.send(studio);
    } catch (err) {
      next(err);
    }
  })
  .get('/', async (_req, res, next) => {
    try {
      const studios = await Studio.getAll();
      res.send(studios);
    } catch (err) {
      next(err);
    }
  })
  .get('/:id', async ({ params }, res, next) => {
    try {
      const studio = await Studio.getById(params.id);
      if (!studio) {
        return next();
      }
      res.send(studio);
    } catch (err) {
      next(err);
    }
  })
  .put('/:id', async ({ params, body }, res, next) => {
    try {
      const updatedCount = await Studio.update(params.id, body);
      res.sendStatus(updatedCount === 1 ? 201 : 404);
    } catch (err) {
      next(err);
    }
  })
  .delete('/:id', async ({ params }, res, next) => {
    try {
      const deletedCount = await Studio.del(params.id);
      res.sendStatus(deletedCount > 0 ? 201 : 404);
    } catch (err) {
      next(err);
    }
  });
