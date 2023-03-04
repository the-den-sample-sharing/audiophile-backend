const { Router } = require('express');
const authenticate = require('../middleware/authenticate');
const storeAvatar = require('../middleware/storeAvatar');
const Profile = require('../models/Profile');
const multer = require('multer');
const ProfileAvatar = require('../models/ProfileAvatar');
const upload = multer();

module.exports = Router()
  .post('/', [authenticate], async (req, res, next) => {
    try {
      const data = await Profile.insert({
        userId: req.user.id,
        ...req.body,
      });
      res.json(data);
    } catch (e) {
      console.error(e);
      next(e);
    }
  })
  .post('/avatars', [authenticate, storeAvatar], async (req, res, next) => {
    try {
      const data = await ProfileAvatar.insert({
        profileId: req.user.id,
        avatarUrl: req.imageUrl,
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
