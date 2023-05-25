const AWS = require("aws-sdk");
const { ENV_BUCKETCONSTANTS } = require("../../constants/env.bucketConstants");
const { ENV_CONSTANTS } = require("../../constants/env.constants");
const { notFoundResponse } = require("../../utils/response");
const s3 = new AWS.S3();
const Log=require('../../utils/logging');

exports.getFilesUrl = async () => {
  try {
    var params = {
      Bucket: ENV_BUCKETCONSTANTS.bucketName,
    };
    const allObjects = await s3.listObjects(params).promise();
    const objList = allObjects.Contents.map((obj) => ({
      fileName: obj.Key,
      url: fileSignedurl(obj.Key),
    }));
    Log.info(objList);
    if (objList.length == 0) {
      return notFoundResponse(404, "Users not Found");
    }
    return objList;
      
  } catch (err) {
    Log.error(err);
  }
};

function fileSignedurl(filename) {
  var signedUrl = s3.getSignedUrl("getObject", {
    Bucket: ENV_BUCKETCONSTANTS.bucketName,
    Key: filename,
  });
  return signedUrl;
}
