const AWS = require("aws-sdk");
const {ENV_CONSTANTS}=require('../../constants/env.constants')
const { ENV_BUCKETCONSTANTS }=require('../../constants/env.bucketConstants')

const s3 = new AWS.S3({ signatureVersion:ENV_BUCKETCONSTANTS.SIGNATURE_VERSION, region:ENV_BUCKETCONSTANTS.AWS_REGION });

exports.handler = async (event) => {
  const body = JSON.parse(event.body);
  const fileName = body.fileName;
  const base64String = body.base64String;
  const buffer = Buffer.from(base64String, ENV_BUCKETCONSTANTS.ENCODED_TYPE);

  try {
    const params = {
      Body: buffer,
      Bucket: process.env.bucketName,
      Key: fileName,
    };

    await s3.putObject(params).promise();

    return {
      statusCode: ENV_CONSTANTS.SUCCESS_CODE,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Credentials": true,
      },
      body: fileUploaded,
    };
  } catch (err) {
    console.log(err);
    return {
      statusCode: ENV_CONSTANTS.INTERNALSERVER_ERROR,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Credentials": true,
      },
      body: JSON.stringify(err),
    };
  }
};
