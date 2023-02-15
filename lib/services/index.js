// const multer = require('multer');
// const upload = multer({ dest: 'uploads/' });
const { uploadFile } = require('./AWS_Storage_Service.js');

// Specify the file to upload
const file = './pizza.jpg';

// // Upload file to S3
async function handleFileUpload() {
  const result = await uploadFile(file);
  console.log('result', result);
}

handleFileUpload();
