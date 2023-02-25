const { Router } = require('express');
const authenticate = require('../middleware/authenticate');
const storeSamples = require('../middleware/storeSamples.js');
const Sample = require('../models/Sample.js');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

// Specify form fields to be parsed by multer
const formParams = [
  { name: 'packName', maxCount: 1 },
  { name: 'kicks', maxCount: 50 },
  { name: 'basses', maxCount: 50 },
];
// Configure multer middleware
// This will add our files to the req object
const multerUpload = upload.fields(formParams);

module.exports = Router().post(
  '/',
  [authenticate, multerUpload, storeSamples],
  async (req, res, next) => {
    const samples = []; // Array to store samples from OUR database - needed later for tags

    // 🔁 Loop through urls -> insert into OUR database
    for (const sampleUrl of req.sampleUrls) {
      try {
        const sample = await Sample.insert({
          url: sampleUrl,
          userId: req.user.id,
        });
        samples.push(sample);
      } catch (e) {
        // eslint-disable-next-line no-console
        console.error(e);
        next(e);
      }
    }
    res.sendStatus(200);
  }
);

// TODO: add pack_id foreign key to samples table
// TODO: store samples with tag_id in join table
