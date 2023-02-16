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
      const sampleData = extractSampleData(sample);
      const sampleFormattedForS3 = formatSampleForS3(samplePack, sampleData);
      try {
        const s3response = await uploadFile(sampleFormattedForS3);
        console.info(`${sampleData.name} uploaded at: ${s3response.Location}`);
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

// Extract sample data from file
function extractSampleData(sample) {
  const sampleData = {
    name: sample.originalname, // original file name
    type: sample.fieldname, // input field name in form
    data: fs.createReadStream(sample.path), // actual sample data
  };
  return sampleData;
}

// Format sample data for S3
function formatSampleForS3(samplePack, sampleData) {
  const formattedSample = {
    Key: `${samplePack.name}/${sampleData.type}/${sampleData.name}`, // file key (emulates folder structure)
    Body: sampleData.data, // file data
    ContentType: 'audio/mp3', // file type
  };
  return formattedSample;
}
