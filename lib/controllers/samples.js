const { Router } = require('express');
// const authenticate = require('../middleware/authenticate');
const storeFolder = require('../middleware/storeFolder.js');

module.exports = Router().post('/', [storeFolder], async (req, res, next) => {
  console.log('req.fileUrl', req.fileUrl);
  try {
    // store fileUrls in database
  } catch (e) {
    console.error(e);
    next(e);
  }
});
