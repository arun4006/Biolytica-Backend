const { getuserProfileInfo, getUsersbyAdmin } = require("../services/db/db.service");
const {getUsers}=require('../services/db/database.service');
const { getUserTokenInfo } = require('../services/auth/authServices');
const { unauthorizedResponse, successResponse, errorResponse } = require("../utils/response");
const { ENV_CONSTANTS } = require("../constants/env.constants");
const Log = require('../utils/logging');


exports.handler = async (event) => {
  try {
    const userTokenInfo = await getUserTokenInfo(event);
    Log.info("userTokenInfo Status:" + userTokenInfo);
    if (userTokenInfo == "TOKEN_EXPIRED") {
      return unauthorizedResponse(ENV_CONSTANTS.UNAUTHORIZED, userTokenInfo);
    }
    const userProfile = await getuserProfileInfo(userTokenInfo);
    Log.info(userProfile);

    Log.info("typeof isadmin"+typeof userProfile.isAdmin);
    const isAdmin=JSON.parse(userProfile.isAdmin);
    
    if (isAdmin) {
      const usersList = await getUsers();
      return successResponse(
        ENV_CONSTANTS.SUCCESS_CODE,
        usersList
      );
    }
    else {
      Log.info("you are not admin");
      return unauthorizedResponse(
        ENV_CONSTANTS.UNAUTHORIZED,
        "You are not authorized to access admin page"
      );
    }

  } catch (err) {
    return errorResponse(ENV_CONSTANTS.INTERNALSERVER_ERROR, err.stack)
  }
};