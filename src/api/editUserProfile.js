const { getuserProfileInfo,updateUserInUsers,updateUserInImageData} = require("../services/db//database.service");
const { getUserTokenInfo,isMe,isOwnProfile } = require('../services/auth/authServices');
const { unauthorizedResponse, successResponse, errorResponse } = require("../utils/response");
const { ENV_CONSTANTS } = require("../constants/env.constants");
const { ENV_COGNITOCONSTANTS} = require("../constants/env.cognitoConstants");
const {userPayload}=require('../helper/index')
const Log = require('../utils/logging');
const parser = require("lambda-multipart-parser");
const { connectToDB, disconnectFromDB } = require('../services/auth/authServices')

exports.handler = async (event, context) => {
  const userTokenInfo = await getUserTokenInfo(event);
  Log.info("userTokenInfo Status:" + userTokenInfo);
  if (userTokenInfo == "TOKEN_EXPIRED") {
    return unauthorizedResponse(ENV_CONSTANTS.UNAUTHORIZED, userTokenInfo);
  }
  await connectToDB();
  const userProfile = await getuserProfileInfo(userTokenInfo);
  Log.info(userProfile);

  const isCurrentUserProfile= await isOwnProfile(userTokenInfo,event.pathParameters.id);
  Log.info("isCurrentUserProfile"+isCurrentUserProfile);
 
  const isAdmin=userProfile.is_admin;

  if (isAdmin || isCurrentUserProfile ) {
    const reqBody =await parser.parse(event); 
    const userData=await userPayload(reqBody,event.pathParameters.id);
    const updateUserResponse=await updateUserInUsers(userData,event.pathParameters.id);
    if(reqBody.district){
      const updateUserInImageDataResponse=await updateUserInImageData(event.pathParameters.id,reqBody.district);
      Log.info("updateUserInImageDataResponse"+updateUserInImageDataResponse);
    }
    Log.info("updateUserResponse"+updateUserResponse);

    await disconnectFromDB();
    return successResponse(
      ENV_CONSTANTS.SUCCESS_CODE,
      ENV_COGNITOCONSTANTS.USERUPDATE_MSG
    );
  }
  else {
    Log.info("you are not admin");
    await disconnectFromDB();
    return unauthorizedResponse(
      ENV_CONSTANTS.UNAUTHORIZED,
      ENV_COGNITOCONSTANTS.UNAUTHORIZED_MSG
    );
  }

};
