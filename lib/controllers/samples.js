const { Router } = require('express');
const authenticate = require('../middleware/authenticate');
const storeFolder = require('../middleware/storeFolder.js');
const Sample = require('../models/Sample.js');

module.exports = Router().post(
  '/',
  [authenticate, storeFolder],
  async (req, res, next) => {
    const fileUrls = req.fileUrls; // 🌐 Array of urls from S3
    const samples = []; // Array to store samples from OUR database - needed later for tags

    // 🔁 Loop through urls -> insert into OUR database
    for (const url of fileUrls) {
      try {
        // 💾 Insert sample into OUR database
        const sample = await Sample.insert({
          url,
          userId: req.user.id,
        });

        // Add returned sample to array
        samples.push(sample);
      } catch (e) {
        // eslint-disable-next-line no-console
        console.error(e);
        next(e);
      }
    }

    // 📩 Return samples to client (for now)
    res.json(samples);
  }
);

// TODO: add pack_id foreign key to samples table
// TODO: store samples with tag_id in join table
