const path = require("path");
const AWS = require("aws-sdk");
const {ENV_BUCKETCONSTANTS} = require('../../constants/env.bucketConstants')
const s3 = new AWS.S3({ signatureVersion: ENV_BUCKETCONSTANTS.SIGNATURE_VERSION, region: ENV_BUCKETCONSTANTS.AWS_REGION });

exports.fileUpload = async (req, res) => {
  //res.send("fileupload");
  //res.sendFile(path.join(__dirname +'/index.html'));
  res.send("fileupload UI");
};

exports.getallObjects = async (req, res) => {
  try {
    var params = {
      Bucket: ENV_BUCKETCONSTANTS.bucketName,
    };
    const data = await s3.listObjects(params).promise();
    const filelist = data.Contents.map( obj => ({
       "fileName":obj.Key,
       "url": geturl(obj.Key)
     
    }));
    console.log(filelist);
    res.send(filelist);
  } catch (err) {
    res.send(err);
  }
};

function geturl(filename) {
  var url = s3.getSignedUrl("getObject", {
    Bucket: ENV_BUCKETCONSTANTS.bucketName,
    Key: filename,
  });
  return url;
}
