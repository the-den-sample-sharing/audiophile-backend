const { uploadAvatar } = require('../services/StorageService.js');
const fs = require('fs');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

// This middleware uploads a single image file to S3
module.exports = async (req, res, next) => {
  let imageUrl = '';
  try {
    // Multer adds the image file to req object, so we can access it here
    upload.single('avatar')(req, res, (err) => {
      if (err) {
        err.status = 400;
        return next(err);
      }
      // Format image data for S3
      const formattedImage = {
        Key: `avatars/${req.file.originalname}`, // file key (emulates folder structure)
        Body: fs.createReadStream(req.file.path), // file data
        ContentType: req.file.mimetype, // file type
      };
      if (!req.file || !req.file.originalname) {
        const err = new Error('File not found');
        err.status = 400;
        return next(err);
      }
      // Upload image to S3
      uploadAvatar(formattedImage)
        .then((s3response) => {
          console.info(`Uploaded ${req.file.originalname} to S3 bucket`);
          imageUrl = s3response.Location;
          req.imageUrl = imageUrl;
          next(); // Call next() here to move to the next middleware function
        })
        .catch((e) => {
          e.status = 500;
          next(e);
        });
    });
  } catch (e) {
    next(e);
  }
};
