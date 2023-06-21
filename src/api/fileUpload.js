const { getUserTokenInfo } = require("../services/auth/authServices");
const {addFileMetaInTable,updateUserPostCount,getuserProfileInfo}=require('../services/db/database.service')
const { unauthorizedResponse } = require("../utils/response");
const { uploadFiles } = require("../services/s3/fileUploadService");
const { successResponse,errorResponse } = require("../utils/response");
const { ENV_BUCKETCONSTANTS } = require("../constants/env.bucketConstants");
const { ENV_CONSTANTS } = require("../constants/env.constants");
const {extractFile}=require('../helper/index')
const Log= require("../utils/logging")

exports.handler = async (event) => {
  try {
    const userTokenInfo = await getUserTokenInfo(event);
    Log.info("userTokenInfo Status:" + userTokenInfo);    
    if (userTokenInfo == "TOKEN_EXPIRED") {
      return unauthorizedResponse(ENV_CONSTANTS.UNAUTHORIZED, userTokenInfo);
    }
    const { filename, data } = extractFile(event);
    const fileuploadResponse = await uploadFiles(filename,data);
    //const fileuploadResponse = await uploadFiles(event);
    Log.info(fileuploadResponse.isUploaded);

    if (fileuploadResponse.isUploaded) {
      const userData = await getuserProfileInfo(userTokenInfo);
      Log.info("--userData--"+userData.name);

      const fileData={
        image_name:fileuploadResponse.fileName,
        image_url :fileuploadResponse.fileUri,
        owner:userData.id,
        location:userData.district_id
      }
      
      const filetableResponse = await addFileMetaInTable(fileData);
      Log.info("filetableResponse:" + filetableResponse);
     
      const updatePostCountByUser=await updateUserPostCount(userData.id);
      Log.info("updatePostCountByUser:" + updatePostCountByUser);
    }
    return successResponse(
      ENV_CONSTANTS.SUCCESS_CODE,
      fileuploadResponse
    );
  } catch (err) {
    Log.error(err);
    return errorResponse(ENV_CONSTANTS.INTERNALSERVER_ERROR,err.stack)
  }
};
