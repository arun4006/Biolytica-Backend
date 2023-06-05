const { getuserProfileInfo, getUsersbyAdmin,updateUser } = require("../services/db/db.service");
const { getUserTokenInfo } = require('../services/auth/authServices');
const { uploadFiles } = require("../services/s3/fileUploadService");
const { unauthorizedResponse, successResponse, errorResponse } = require("../utils/response");
const { ENV_CONSTANTS } = require("../constants/env.constants");
const Log = require('../utils/logging');
const parser = require("lambda-multipart-parser");

exports.handler = async (event, context) => {
  const userTokenInfo = await getUserTokenInfo(event);
  Log.info("userTokenInfo Status:" + userTokenInfo);
  if (userTokenInfo == "TOKEN_EXPIRED") {
    return unauthorizedResponse(ENV_CONSTANTS.UNAUTHORIZED, userTokenInfo);
  }
  const userProfile = await getuserProfileInfo(userTokenInfo);
  Log.info(userProfile);

  if (userProfile.isAdmin == 'true') {
    const reqBody =await parser.parse(event); 
    const profileImageUpload = await uploadFiles(
        reqBody.files[0].filename,
        reqBody.files[0].content    
      );
  const updateUserResponse=await updateUser(reqBody,profileImageUpload.fileUri,event.pathParameters.id);  
  Log.info("updateUserResponse"+updateUserResponse)
    
    return successResponse(
      ENV_CONSTANTS.SUCCESS_CODE,
      "user updated successfully"
    );
  }
  else {
    Log.info("you are not admin");
    return unauthorizedResponse(
      ENV_CONSTANTS.UNAUTHORIZED,
      "You are not authorized to access admin page"
    );
  }

};
