const AWS = require("aws-sdk");
const s3 = new AWS.S3();
const {ENV_CONSTANTS}=require('../../constants/env.constants')
const { ENV_BUCKETCONSTANTS }=require('../../constants/env.bucketConstants')

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
      statusCode: ENV_CONSTANTS.SUCCESS_CODE,
      body: JSON.stringify(files),
    };
  } catch (error) {
    console.error(error);
    return {
      statusCode: ENV_CONSTANTS.INTERNALSERVER_ERROR,
      body: JSON.stringify({ message: ENV_BUCKETCONSTANTS.ERROR_FROM_S3BUCKET }),
    };
  }
};
