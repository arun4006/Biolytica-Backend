const AWS = require("aws-sdk");
const s3 = new AWS.S3();
const {
  errorFromS3Bukcet,
  successCode,
  internalServerError,
} = require("../constant");

exports.handler = async (event, context) => {
  const prefix = "";

  const params = {
    Bucket: process.env.bucketName,
    Prefix: prefix,
  };

  try {
    const response = await s3.listObjectsV2(params).promise();
    const files = response.Contents.map((file) => file.Key);
    console.log(files);
    return {
      statusCode: successCode,
      body: JSON.stringify(files),
    };
  } catch (error) {
    console.error(error);
    return {
      statusCode: internalServerError,
      body: JSON.stringify({ message: errorFromS3Bukcet }),
    };
  }
};
