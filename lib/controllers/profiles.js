const { Router } = require('express');
const Profile = require('../models/Profile');

module.exports = Router()
  .post('/', async (req, res, next) => {
    try {
      const data = await Profile.insert(req.body);
      console.log(req.body);
      res.json(data);
    } catch (e) {
      console.error(e);
      next(e);
    }
  })
  .get('/', async (req, res, next) => {
    try {
      const data = await Profile.getAll();
      if (!data) {
        next();
      }
      res.json(data);
    } catch (e) {
      console.error(e);
      next(e);
    }
  });
