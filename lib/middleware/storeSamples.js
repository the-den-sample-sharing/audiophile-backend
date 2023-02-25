const { uploadFile } = require('../services/StorageService.js');
const fs = require('fs');

// This middleware reads from a folder and uploads files to S3
module.exports = async (req, res, next) => {
  const sampleUrls = [];
  // Multer adds sample files to req object, so we can access them here
  const samplePack = extractSamplePackData(req.body, req.files);

  // 🔁 Loop through each sample type: (kicks, basses, etc)
  for (const type of samplePack.types) {
    // 🔁 Loop through each sample within that type (kick1, kick2, etc)
    for (const sample of samplePack.typeFolders[type]) {
      const sampleFormattedForS3 = formatSampleForS3(samplePack, sample);
      try {
        const s3response = await uploadFile(sampleFormattedForS3);
        console.info(`Uploaded ${sample.originalname} to s3 bucket`);
        sampleUrls.push(s3response.Location);
      } catch (e) {
        e.status = 500;
        next(e);
      }
    }
  }
  // 🚂 Add sample urls to req object -> /samples POST route
  req.sampleUrls = sampleUrls;
  next();
};

/* Helper functions */

// Extract sample pack from req object
function extractSamplePackData(body, files) {
  const samplePack = {
    name: body.packName,
    typeFolders: files, // Obj with folders of samples
    types: Object.keys(files), // The names of those folders: (kicks, basses, etc)
  };
  return samplePack;
}

// Format sample data for S3
function formatSampleForS3(samplePack, sample) {
  const formattedSample = {
    Key: `${samplePack.name}/${sample.fieldname}/${sample.originalname}`, // file key (emulates folder structure)
    Body: fs.createReadStream(sample.path), // file data
    ContentType: 'audio/mp3', // file type
  };
  return formattedSample;
}
