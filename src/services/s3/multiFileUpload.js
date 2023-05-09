const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
const { ENV_BUCKETCONSTANTS } = require('../../constants/env.bucketConstants');
const s3Client = new S3Client({ region: ENV_BUCKETCONSTANTS.AWS_REGION });

exports.handler = async (event) => {
  const files = JSON.parse(event.body);

  try {
    const results = [];

    for (const file of files) {
      const fileContent = Buffer.from(file.content, ENV_BUCKETCONSTANTS.ENCODED_TYPE);
      const bucketName = ENV_BUCKETCONSTANTS.bucketName;
      const objectKey = Date.now() + '_' + file.filename;
      const params = {
        Bucket: bucketName,
        Key: objectKey,
        Body: fileContent,
      };
      const result = await s3Client.send(new PutObjectCommand(params));
      console.log(`File uploaded successfully: ${file.filename}`);
      results.push({ filename: file.filename, url: result });
    }

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: 'Files uploaded successfully',
        isBase64Encoded: false,
        results: results,
      }),
    };
  } catch (err) {
    console.log(err);
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: 'An error occurred while uploading the files',
      }),
    };
  }
};
