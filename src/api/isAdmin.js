const { getUserTokenInfo } = require("../services/auth/authServices");
const {ENV_CONSTANTS}=require('../constants/env.constants');
const { getuserProfileInfo } = require("../services/db/db.service");
const {
  successResponse,
  errorResponse,
  unauthorizedResponse,
} = require("../utils/response");
const Log= require("../utils/logging")

exports.handler = async (event) => {
  try {
    const userTokenInfo = await getUserTokenInfo(event);
    Log.info("userTokenInfo Status:" + userTokenInfo);
    if (userTokenInfo == "TOKEN_EXPIRED") {
      return unauthorizedResponse(ENV_CONSTANTS.UNAUTHORIZED, userTokenInfo);
    }
    const userProfile = await getuserProfileInfo(userTokenInfo);
    Log.info("user "+userProfile.isAdmin);
    return successResponse(
        ENV_CONSTANTS.SUCCESS_CODE,
        userProfile.isAdmin
      );
  } catch (err) {
    Log.error(err);
    return errorResponse(ENV_CONSTANTS.INTERNALSERVER_ERROR,err.stack)
  }
};
