const { uploadFile } = require('../services/StorageService.js');
const fs = require('fs');
const path = require('path');

const folderPath = 'lib/mockSamples/mp3/kicks'; // Temporary until we use multer

// Middleware reads from folder and uploads files to S3
module.exports = async (req, res, next) => {
  const fileUrls = [];

  // 🗄️ This function retrieves the sample files from our folder
  fs.readdir(folderPath, async (err, files) => {
    if (err) {
      // eslint-disable-next-line no-console
      console.error(`Failed to read directory: ${folderPath}`);
      throw new Error(err);
    }

    // 🔁 Loop through each file in the folder
    for (const file of files) {
      // 💽 Get file data
      const filePath = path.join(folderPath, file); // full path to file
      const fileStream = fs.createReadStream(filePath); // this is the ACTUAL data
      const contentType = `audio/${path.extname(file).slice(1)}`; // file type (mp3, wav, etc)

      // 📦 Package up file data for our upload function
      const fileParams = {
        Key: filePath, // file name... probably should change this
        Body: fileStream, // file data
        ContentType: contentType, // file type
      };

      // ➡ ✉️ Upload file to S3 with our upload function
      try {
        const s3response = await uploadFile(fileParams);
        fileUrls.push(s3response.Location);
      } catch (e) {
        err.status = 500;
        next(e);
      }
    }

    // 🚂 Add file urls to req object -> /samples POST route
    req.fileUrls = fileUrls;
    next();
  });
};
