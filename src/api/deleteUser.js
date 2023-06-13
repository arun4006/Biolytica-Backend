const { getUserTokenInfo, removeUser } = require("../services/auth/authServices");
const {deleteUser,getuserProfileInfo,getUser} = require("../services/db/db.service")
const {unauthorizedResponse, successResponse, errorResponse } = require("../utils/response");
const {ENV_CONSTANTS } = require("../constants/env.constants");
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
       const currentUser=await getUser(event.pathParameters.id);
       console.log("currentUser"+currentUser[0].userid);
       const deleteuserfromCognito = await removeUser(currentUser[0].userid);
       const deleteuserfromDB = await deleteUser(event.pathParameters.id);
      return successResponse(
        ENV_CONSTANTS.SUCCESS_CODE,
        "user deleted successfully"
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
    Log.error(err);
    return errorResponse(ENV_CONSTANTS.INTERNALSERVER_ERROR, err.stack)
  }
};

