const parseMultipart = require("parse-multipart");
const { ENV_BUCKETCONSTANTS } = require("../constants/env.bucketConstants");
const Log = require("../utils/logging");
const {getUser}=require('../services/db/db.service')
const { uploadFiles } = require("../services/s3/fileUploadService");

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

const userPayload=async (reqData,id) =>{

console.log("id"+id);
const getUserData= await getUser(id);
const firstGetUser =getUserData[0];
const name = reqData.name ?? firstGetUser.name;
const hobbies = reqData.hobbies ?? firstGetUser.hobbies;
const bio = reqData.bio ?? firstGetUser.bio;
const district = reqData.district ?? firstGetUser.district;
const state = reqData.state ?? firstGetUser.state;

let files;
if(reqData.files.length === 0 || reqData.files === undefined ){
 files=firstGetUser.profilepic;
 Log.info("files already here"+files);
}else{
 let file=await uploadFiles(reqData.files[0].filename, reqData.files[0].content);
 files=file.fileUri;
 Log.info("files new here"+files);
}

return {name,hobbies,bio,district,state,files};

}


module.exports = {
  extractFile,
  emptyProfile,
  userPayload 
};


