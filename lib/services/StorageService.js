require('dotenv').config();
const S3 = require('aws-sdk/clients/s3');

// env variables
const sampleBucketName = process.env.AWS_SAMPLE_BUCKET_NAME;
const avatarBucketName = process.env.AWS_AVATAR_BUCKET_NAME;
const region = process.env.AWS_BUCKET_REGION;
const accessKeyId = process.env.AWS_ACCESS_KEY;
const secretAccessKey = process.env.AWS_SECRET_KEY;

// Set up the S3 client
const s3 = new S3({
  region,
  accessKeyId,
  secretAccessKey,
});

// upload file to S3 (called in storeFolder.js)
async function uploadFile({ Key, Body, ContentType }) {
  const uploadParams = {
    Bucket: sampleBucketName,
    Key, // file path/name
    Body, // file data
    ContentType, // file type
  };

  try {
    const resp = await s3.upload(uploadParams).promise();
    return resp;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(`Error uploading ${Key} to S3`);
    throw new Error(error);
  }
}
async function uploadAvatar({ Key, Body, ContentType }) {
  const uploadParams = {
    Bucket: avatarBucketName,
    Key, // file path/name
    Body, // file data
    ContentType, // file type
  };

  try {
    const resp = await s3.upload(uploadParams).promise();
    return resp;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(`Error uploading ${Key} to S3`);
    throw new Error(error);
  }
}

module.exports = { uploadFile, uploadAvatar };
