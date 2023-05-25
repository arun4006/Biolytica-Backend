const AWS = require("aws-sdk");
const s3 = new AWS.S3();
const { ENV_BUCKETCONSTANTS } = require("../../constants/env.bucketConstants");
const { extractFile } = require("../../helper/index");
const Log=require("../../utils/logging")

exports.uploadFiles = async (event) => {
  const { filename, data } = extractFile(event);
  Log.info(filename);
  
  const bucketName = ENV_BUCKETCONSTANTS.bucketName;
  const objectKey = Date.now() + "_" + filename;
  const params = {
    Bucket: bucketName,
    Key: objectKey,
    ACL: ENV_BUCKETCONSTANTS.bukcetACL,
    Body: data,
  };
  const fileuploadResponse = await s3.putObject(params).promise();
  return {   
    fileName: objectKey,
    fileUri: `https://${bucketName}.s3.amazonaws.com/${objectKey}`,
    isUploaded:true
  };
};

