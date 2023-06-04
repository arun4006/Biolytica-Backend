const parseMultipart = require("parse-multipart");
const { ENV_BUCKETCONSTANTS } = require("../constants/env.bucketConstants");
const Log = require("../utils/logging");

const extractFile = (event) => {
 
  const Content_Type= event.headers["Content-Type"] ||  event.headers["content-type"] ;

  const boundary = parseMultipart.getBoundary(Content_Type);
  Log.info("boundary:" + boundary);

  const files = parseMultipart.Parse(
    Buffer.from(event.body, ENV_BUCKETCONSTANTS.ENCODED_TYPE),
    boundary
  ); 
  const fileFormat = files[0].type.split("/")[0];
  Log.info("files format:" + fileFormat);
  Log.info("file length"+files.length)

  if (fileFormat !== "image") {
    Log.warn("Not an valid image format");
    return {
      error: ENV_BUCKETCONSTANTS.WARNINGFILE_MSG,
    };
  } else {
    const [{ filename, data }] = files;
    return {
      filename,
      data
    };
  }
};


const emptyProfile= () => {
 return {
  filename:'emptyProfile.png',
  fileUri:'https://aws-demo-files.s3.amazonaws.com/emptyProfile.png',
  isUploaded:'true'
 }
}




module.exports = {
  extractFile,
  emptyProfile 
};


