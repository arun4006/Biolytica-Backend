const parseMultipart = require("parse-multipart");
const { ENV_BUCKETCONSTANTS } = require("../constants/env.bucketConstants");
const Log = require("../utils/logging");
const dbService = require("../services/db/database.service");
const { uploadFiles } = require("../services/s3/fileUploadService");
const { deleteFile } = require("../services/s3/deleteFile");

const extractFile = (event) => {
  const Content_Type =
    event.headers["Content-Type"] || event.headers["content-type"];

  const boundary = parseMultipart.getBoundary(Content_Type);
  Log.info("boundary:" + boundary);

  const files = parseMultipart.Parse(
    Buffer.from(event.body, ENV_BUCKETCONSTANTS.ENCODED_TYPE),
    boundary
  );
  const fileFormat = files[0].type.split("/")[0];
  Log.info("files format:" + fileFormat);
  Log.info("file length" + files.length);

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
};

const emptyProfile = () => {
  return {
    filename: "emptyProfile.png",
    fileUri: "https://aws-demo-files.s3.amazonaws.com/emptyProfile.png",
    isUploaded: "true",
  };
};

const userPayload = async (reqData, id) => {
  console.log("id" + id);
  const getUserData = await dbService.getUser(id);
  let files;
  if (reqData.files.length === 0 || reqData.files === undefined) {
    files = getUserData.profile_pic;
    Log.info("files already here" + files);
  } else {
    let file = await uploadFiles(
      reqData.files[0].filename,
      reqData.files[0].content
    );
    files = file.fileUri;
    Log.info("files new here" + files);
  }
  
  let reqPayload = {
    name: reqData.name ?? getUserData.name,
    hobbies: reqData.hobbies ?? getUserData.hobbies,
    bio: reqData.bio ?? getUserData.bio,
    profile_pic: files,
    district_id:reqData.district ?? getUserData.district_id,
    state_id:reqData.state ?? getUserData.state_id
}
  Log.info("reqPayload"+JSON.stringify(reqPayload))
  return reqPayload;         
};

const deleteUserFromTable = async (id) => {
  const deleteImageData = await dbService.deleteUserInImageData(id);
  const deleteUser = await dbService.deleteUserInUsers(id);

  Log.info("deleteImageData " + deleteImageData);
  Log.info("deleteUser" + deleteUser);
};

const getPagination = (page) => {
  const limit = 5;
  const offset = page ? (page-1) * limit : 0;

  return { limit, offset };
};

const getPagingData = (data, page, limit) => {
  const { count: totalItems, rows: users } = data;
  const currentPage = page ? +page : 1;
  const totalPages = Math.ceil(totalItems / limit);

  return { totalItems, users, totalPages, currentPage };
};

module.exports = {
  extractFile,
  emptyProfile,
  userPayload,
  deleteUserFromTable,
  getPagination,
  getPagingData
};
