const { uploadFile } = require('../services/StorageService.js');

module.exports = async (req, res, next) => {
  const files = req.files;
  const fileUrls = [];
  for (const file of files) {
    console.log('uploading file:', file);
    try {
      // // Upload file to S3
      const s3response = await uploadFile(file);
      fileUrls.push(s3response.Location);
      next();
    } catch (err) {
      err.status = 401;
      next(err);
    }
  }
  req.fileUrls = fileUrls;
  next();
};
