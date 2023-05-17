const parseMultipart = require("parse-multipart");
const {ENV_BUCKETCONSTANTS}=require('../constants/env.bucketConstants')

const extractFile= (event) => {
    const boundary = parseMultipart.getBoundary(event.headers["content-type"]);
    console.log("boundary:" + boundary);
    const files = parseMultipart.Parse(
      Buffer.from(event.body, ENV_BUCKETCONSTANTS.ENCODED_TYPE),
      boundary
    );
    const fileFormat = files[0].type.split("/")[0];
    console.log("files:" + fileFormat);
  
    if (fileFormat !== "image") {
      console.log("not valid image format");
      return {
        error: ENV_BUCKETCONSTANTS.WARNINGFILE_MSG,
      };
    } else {
      const [{ filename, data }] = files;
      return {
        filename,
        data,
      };
    }
  }


module.exports = {
    extractFile
};