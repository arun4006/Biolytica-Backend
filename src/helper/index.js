const parseMultipart = require("parse-multipart");
const {ENV_BUCKETCONSTANTS}=require('../constants/env.bucketConstants');
const Log=require('../utils/logging')

const extractFile= (event) => {
    const boundary = parseMultipart.getBoundary(event.headers["content-type"]);
    Log.info("boundary:" + boundary);
    
    const files = parseMultipart.Parse(
      Buffer.from(event.body, ENV_BUCKETCONSTANTS.ENCODED_TYPE),
      boundary
    );
    const fileFormat = files[0].type.split("/")[0];
    Log.info("files format:" + fileFormat);
  
    if (fileFormat !== "image") {
      Log.warn("Not an valid image format");
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