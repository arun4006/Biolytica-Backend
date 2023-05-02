const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
const {ENV_BUCKETCONSTANTS} = require('../../constants/env.bucketConstants')
const s3Client = new S3Client({ region: ENV_BUCKETCONSTANTS.AWS_REGION }); 


exports.handler = async (event) => {
  const fileContent = Buffer.from(event.body, ENV_BUCKETCONSTANTS.ENCODED_TYPE);
  const bucketName = ENV_BUCKETCONSTANTS.bucketName; 
  const objectKey = Date.now()+'.png' 
  const params = {
    Bucket: bucketName,
    Key: objectKey,
    Body: fileContent
  };

  try {
    const result = await s3Client.send(new PutObjectCommand(params));
    console.log(`File uploaded successfully`);
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*', 
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        message: 'File uploaded successfully',
        "isBase64Encoded": false,
        url: event
      })
    };
  } catch (err) {
    
    console.log(err);
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*', 
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        message: 'An error occurred while uploading the file'
      })
    };
  }
};
