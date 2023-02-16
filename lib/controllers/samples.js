const { Router } = require('express');
const authenticate = require('../middleware/authenticate');
const storeFolder = require('../middleware/storeFolder.js');
const Sample = require('../models/Sample.js');

module.exports = Router().post(
  '/',
  [authenticate, storeFolder],
  async (req, res, next) => {
    console.log('req.fileUrl', req.fileUrl);
    const files = req.fileUrls;
    for (let file of files) {
      try {
        // store fileUrls in database
        const res = await Sample.insert({
          url: file,
          profileId: req.user.id,
        });
        res.json();
      } catch (e) {
        console.error(e);
        next(e);
      }
    }
  }
);
