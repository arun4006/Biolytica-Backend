const { getUserTokenInfo, removeUser } = require("../services/auth/authServices");
const {deleteUser,getuserProfileInfo} = require("../services/db/db.service")
const { unauthorizedResponse, successResponse, errorResponse } = require("../utils/response");
const { ENV_CONSTANTS} = require("../constants/env.constants");
const { ENV_COGNITOCONSTANTS} = require("../constants/env.cognitoConstants");
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

    if (userProfile.isAdmin == 'true') 
    {
      const deleteuserfromCognito = await removeUser(userTokenInfo)
      const deleteuserfromDB = await deleteUser(event.pathParameters.id);
      return successResponse(
        ENV_CONSTANTS.SUCCESS_CODE,
        ENV_COGNITOCONSTANTS.USERDELETE_MSG
      );
    }
    else {
      Log.info("you are not admin");
      return unauthorizedResponse(
        ENV_CONSTANTS.UNAUTHORIZED,
        ENV_COGNITOCONSTANTS.UNAUTHORIZED_MSG
      );
    }
  } catch (err) {
    return errorResponse(ENV_CONSTANTS.INTERNALSERVER_ERROR, err.stack)
  }
};
