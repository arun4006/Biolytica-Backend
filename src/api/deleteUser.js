const { getUserTokenInfo } = require("../services/auth/authServices");
const {getuserProfileInfo} = require("../services/db/database.service");
const {deleteUserFromTable} = require("../helper/index");
const {unauthorizedResponse, successResponse, errorResponse } = require("../utils/response");
const {ENV_COGNITOCONSTANTS}=require('../constants/env.cognitoConstants')
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

    const isAdmin=userProfile.is_admin;
    Log.info("isAdmin"+isAdmin);
    
    if (isAdmin) 
    {
        const deleteuserfromDB = await deleteUserFromTable(event.pathParameters.id);
      return successResponse(
        ENV_CONSTANTS.SUCCESS_CODE,
        ENV_COGNITOCONSTANTS.USERDELETE_MSG
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

