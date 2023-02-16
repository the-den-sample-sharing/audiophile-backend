const { uploadFile } = require('../services/StorageService.js');
const fs = require('fs');
const path = require('path');

const folderPath = './Claps';

module.exports = async (req, res, next) => {
  console.log(folderPath);
  const fileUrls = [];
  fs.readdir(folderPath, (err, files) => {
    if (err) {
      console.error(`Failed to read directory: ${folderPath}`);
      return;
    }
    files.forEach(async (file) => {
      const filePath = path.join(folderPath, file);
      const fileStream = fs.createReadStream(filePath);
      const contentType = `audio/${path.extname(file).slice(1)}`;

      const fileParams = {
        ...file,
        Key: filePath,
        Body: fileStream,
        ContentType: contentType,
      };

      try {
        // // Upload file to S3
        const s3response = await uploadFile(fileParams);
        fileUrls.push(s3response.Location);
      } catch (err) {
        err.status = 401;
        next(err);
      }
    });
    req.fileUrls = fileUrls;
    next();
  });
};
