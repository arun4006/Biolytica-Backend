const { getUserTokenInfo } = require("../services/auth/authServices");
const {
  getuserProfileInfo,
  addFileMetaInTable,
} = require("../services/db/db.service");
const { unauthorizedResponse } = require("../utils/response");
const { uploadFiles } = require("../services/s3/fileUploadService");
const { successResponse,errorResponse } = require("../utils/response");
const { ENV_BUCKETCONSTANTS } = require("../constants/env.bucketConstants");
const { ENV_CONSTANTS } = require("../constants/env.constants");
const Log= require("../utils/logging")

exports.handler = async (event) => {
  try {
    const userTokenInfo = await getUserTokenInfo(event);
    Log.info("userTokenInfo Status:" + userTokenInfo);    
    if (userTokenInfo == "TOKEN_EXPIRED") {
      return unauthorizedResponse(ENV_CONSTANTS.UNAUTHORIZED, userTokenInfo);
    }
    console.log("event"+event);
    const fileuploadResponse = await uploadFiles(event);
    Log.info(fileuploadResponse.isUploaded);

    if (fileuploadResponse.isUploaded) {
      const userData = await getuserProfileInfo(userTokenInfo);
      Log.info("--userData--"+userData.userName);
      
      const filetableResponse = await addFileMetaInTable([
        fileuploadResponse.fileName,
        fileuploadResponse.fileUri,
        userData.userName,
        userData.userLocation,
      ]);
      Log.info("filetableResponse:" + filetableResponse);
    
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
