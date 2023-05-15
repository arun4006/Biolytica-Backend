const AWS = require("aws-sdk")  ;
const { ENV_BUCKETCONSTANTS } = require("../../constants/env.bucketConstants");
const {ENV_CONSTANTS}=require('../../constants/env.constants')
const s3 = new AWS.S3();

exports.handler = async (event, context, callback) => {
  try {
    var params = {
      Bucket: ENV_BUCKETCONSTANTS.bucketName,
    };
    const allObjects = await s3.listObjects(params).promise();
    const objList = allObjects.Contents.map((obj) => ({
      fileName: obj.Key,
      url: fileSignedurl(obj.Key),
    }));

    console.log(objList);
    const response = {
      "statusCode": ENV_CONSTANTS.SUCCESS_CODE,
      "headers": {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json",
      },
      "body":JSON.stringify(objList),
      "isBase64Encoded": false
    };
    callback(null, response);
  } catch (err) {
    console.log(err);
    const errResponse = {
      "statusCode": ENV_CONSTANTS.INTERNALSERVER_ERROR,
      "headers": {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json",
      },
      "body": JSON.stringify({
        message: ENV_BUCKETCONSTANTS.ERROR_FROM_S3BUCKET,
      }),
    };

    callback(err, errResponse);
  }
};

function fileSignedurl(filename) {
  var signedUrl = s3.getSignedUrl("getObject", {
    Bucket: ENV_BUCKETCONSTANTS.bucketName,
    Key: filename,
  });
  return signedUrl;
}
