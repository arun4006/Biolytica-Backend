const { getuserProfileInfo,updateUser} = require("../services/db/db.service");
const { getUserTokenInfo,isMe,isOwnProfile } = require('../services/auth/authServices');
const { unauthorizedResponse, successResponse, errorResponse } = require("../utils/response");
const { ENV_CONSTANTS } = require("../constants/env.constants");
const { ENV_COGNITOCONSTANTS} = require("../constants/env.cognitoConstants");
const {userPayload}=require('../helper/index')
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

  const isCurrentUserProfile= await isOwnProfile(userTokenInfo,event.pathParameters.id);
  Log.info("isCurrentUserProfile"+isCurrentUserProfile);
 
  const isAdmin=JSON.parse(userProfile.isAdmin);
 

  if (isAdmin || isCurrentUserProfile ) {
    const reqBody =await parser.parse(event); 
    const userData=await userPayload(reqBody,event.pathParameters.id);
    const updateUserResponse=await updateUser(userData,event.pathParameters.id);  
    Log.info("updateUserResponse"+updateUserResponse)
    
    return successResponse(
      ENV_CONSTANTS.SUCCESS_CODE,
      ENV_COGNITOCONSTANTS.USERUPDATE_MSG
    );
  }
  else {
    Log.info("you are not admin");
    return unauthorizedResponse(
      ENV_CONSTANTS.UNAUTHORIZED,
      ENV_COGNITOCONSTANTS.UNAUTHORIZED_MSG
    );
  }

};
