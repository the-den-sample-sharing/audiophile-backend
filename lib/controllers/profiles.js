const { Router } = require('express');
const authenticate = require('../middleware/authenticate');
const storeAvatar = require('../middleware/storeAvatar');
const Profile = require('../models/Profile');

module.exports = Router()
  .post('/', [authenticate, storeAvatar], async (req, res, next) => {
    try {
      const data = await Profile.insert({
        userId: req.user.id,
        avatarUrl: req.file.location,
        ...req.body,
      });
      res.json(data);
    } catch (e) {
      console.error(e);
      next(e);
    }
  })
  .get('/', authenticate, async (req, res, next) => {
    try {
      const data = await Profile.getById(req.user.id);
      console.log('get route', data);
      res.json(data);
    } catch (e) {
      console.error(e);
      next(e);
    }
  });
