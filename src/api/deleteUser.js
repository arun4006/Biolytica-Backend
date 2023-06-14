const { getUserTokenInfo, cognitoUserToDelete } = require("../services/auth/authServices");
const {getuserProfileInfo,getUser} = require("../services/db/db.service")
const {deleteUserFromTable}=require('../helper/index');
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

    const isAdmin=JSON.parse(userProfile.isAdmin);
    if (isAdmin) 
    {
        const currentUser=await getUser(event.pathParameters.id);
        let currentUserId=currentUser[0].userid;
        Log.info("user id"+currentUserId);
        
        const deleteuserfromCognito = await cognitoUserToDelete(currentUserId);
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

