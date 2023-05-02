const { S3Client, GetObjectCommand , ListObjectsV2Command} = require("@aws-sdk/client-s3");
const {ENV_BUCKETCONSTANTS} = require('../../constants/env.bucketConstants')

const s3 = new S3Client({ region: 'us-east-1' });
const bucketName = ENV_BUCKETCONSTANTS.bucketName;

exports.handler = async (event, context) => {
  try {
    const data = await s3.send(new ListObjectsV2Command({ Bucket: bucketName }));
    const objects = data.Contents;

    const urls = await Promise.all(
      objects.map((object) => {
        const params = {
          Bucket: bucketName,
          Key: object.Key,
          Expires: 3600, // URL expiration time in seconds
        };
        const command = new GetObjectCommand(params);
        return s3.getSignedUrlPromise(command);
      })
    );
    
    return {
      statusCode: 200,
      body: JSON.stringify(urls),
    };
  } catch (err) {
    console.log("Error", err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Internal Server Error" }),
    };
  }
};
