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


const extractFilesAndData= (event) => {
 
  const Content_Type= event.headers["Content-Type"] ||  event.headers["content-type"] ;

  const boundary = parseMultipart.getBoundary(Content_Type);
    const parts = parseMultipart.Parse(Buffer.from(event.body, 'base64'), boundary);
    const [{ filename, data }] = parts;
  
    const keyValuePairs = {};
    for (const part of parts) {
      const { name, value } = part;
      console.log("name"+name);
      keyValuePairs[name] = value;
    }
  
    const formData = JSON.parse(keyValuePairs); 
    console.log("formData"+formData);
    
    return {
      filename,
      data,
      keyValuePairs,
      formData
    };

  
}





module.exports = {
  extractFile,
  extractFilesAndData,
  
};


