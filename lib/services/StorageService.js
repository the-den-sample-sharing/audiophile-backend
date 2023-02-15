require('dotenv').config();
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

// upload folder to S3
async function uploadFile(file) {
  const uploadParams = {
    Bucket: bucketName,
    Key: file.name,
    Body: file.body,
    ContentType: file.type,
  };

  try {
    const resp = await s3.upload(uploadParams).promise();
    return resp;
  } catch (error) {
    console.error(error);
  }
}

module.exports = { uploadFile };
