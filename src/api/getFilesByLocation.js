const {getuserProfileInfo,getFilesbyuserLocation} = require("../services/db/db.service");
const {getUserTokenInfo} = require('../services/auth/authServices');
const { unauthorizedResponse, successResponse,errorResponse } = require("../utils/response");
const { ENV_CONSTANTS } = require("../constants/env.constants");
const Log=require('../utils/logging');


exports.handler = async (event) => {
    try {
      const userTokenInfo = await getUserTokenInfo(event);
      Log.info("userTokenInfo Status:" + userTokenInfo);
      if (userTokenInfo == "TOKEN_EXPIRED") {
        return unauthorizedResponse(ENV_CONSTANTS.UNAUTHORIZED, userTokenInfo);
      }
      const userProfile = await getuserProfileInfo(userTokenInfo);
      Log.info(userProfile.userLocation);
      
      const filesbyUserLocation=await getFilesbyuserLocation(userProfile.userLocation);
      const response={
        files:filesbyUserLocation,
        user:userProfile
      }
      return successResponse(
        ENV_CONSTANTS.SUCCESS_CODE,
        response
      );
    } catch (err) {
      return errorResponse(ENV_CONSTANTS.INTERNALSERVER_ERROR,err.stack)
    }
  };