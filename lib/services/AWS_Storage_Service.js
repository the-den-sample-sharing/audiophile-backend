require('dotenv').config();
const fs = require('fs');
const S3 = require('aws-sdk/clients/s3');

// env variables
const bucketName = process.env.AWS_BUCKET_NAME;
const region = process.env.AWS_BUCKET_REGION;
const accessKeyId = process.env.AWS_ACCESS_KEY;
const secretAccessKey = process.env.AWS_SECRET_KEY;

// Set up the S3 client
const s3 = new S3({
  region,
  accessKeyId,
  secretAccessKey,
});

// upload file to S3
function uploadFile(file) {
  const fileStream = fs.createReadStream(file);

  const uploadParams = {
    Bucket: bucketName,
    Body: fileStream,
    Key: file,
  };

  return s3.upload(uploadParams).promise();
}

module.exports = { uploadFile };
