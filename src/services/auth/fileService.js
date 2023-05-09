const path = require("path");
const AWS = require("aws-sdk");
const { ENV_BUCKETCONSTANTS } = require("../../constants/env.bucketConstants");
const { ENV_DBCONSTANTS } = require("../../constants/env.dbConstants");
const s3 = new AWS.S3({
  signatureVersion: ENV_BUCKETCONSTANTS.SIGNATURE_VERSION,
  region: ENV_BUCKETCONSTANTS.AWS_REGION,
});
const mysqlConnection = require("../../services/db/mysqlConnection");
const util = require("util");

exports.fileUpload = async (req, res) => {
  //res.send("fileupload UI");
  res.redirect('http://localhost:4200/upload')

};

exports.getallObjects = async (req, res) => {
  try {
    var params = {
      Bucket: ENV_BUCKETCONSTANTS.bucketName,
    };
    const data = await s3.listObjects(params).promise();
    const filelist = data.Contents.map((obj) => ({
      fileName: obj.Key,
      url: geturl(obj.Key),
    }));
    console.log(filelist);
    res.status(200).json({
      Counts: filelist?.length,
      data: filelist,
    });
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

exports.getObjectByLocation = async (req, res) => {
  const query = util.promisify(mysqlConnection.query).bind(mysqlConnection);

  try {
    const objectsByLocation = await query(
      `SELECT * FROM ${ENV_DBCONSTANTS.TABLENAME_IMAGES} where location="${req.params.locationName}"`
    );
    if (objectsByLocation.length == 0) {
     return res.status(404).json({
        status: 'error',
        message: 'Location not found'
      });
    }
    const listObjects = getObejctUrlByLocation(objectsByLocation);
    res.status(200).json({
      Location:req.params.locationName,
      Counts: objectsByLocation?.length,
      data: listObjects,
    });
  } catch (err) {
    res.send(err);
  }
};

function getObejctUrlByLocation(file) {
  const objUrlList = file.map((obj) => ({
    fileName: obj.imagename,
    url: geturl(obj.imagename),
  }));

  return objUrlList;
}
