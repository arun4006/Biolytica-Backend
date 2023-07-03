const { getuserProfileInfo } = require("../services/db/database.service");
const {getUsers}=require('../services/db/database.service');
const { getUserTokenInfo } = require('../services/auth/authServices');
const { unauthorizedResponse, successResponse, errorResponse } = require("../utils/response");
const { ENV_CONSTANTS } = require("../constants/env.constants");
const Log = require('../utils/logging');
const {getPagination}=require('../helper/index');
const { connectToDB, disconnectFromDB } = require('../services/auth/authServices')


exports.handler = async (event) => {
  try {
    const userTokenInfo = await getUserTokenInfo(event);
    Log.info("userTokenInfo Status:" + userTokenInfo);
    if (userTokenInfo == "TOKEN_EXPIRED") {
      return unauthorizedResponse(ENV_CONSTANTS.UNAUTHORIZED, userTokenInfo);
    }
    await connectToDB();
    const userProfile = await getuserProfileInfo(userTokenInfo);
    Log.info(userProfile);

    const isAdmin=userProfile.is_admin;
    
    const page=event['queryStringParameters']['page']?? 1;
    const searchText=event['queryStringParameters']['search'] || ''; 

    const { limit, offset } = getPagination(page);
    Log.info("limit"+limit);
    Log.info("offset"+offset);

    if (isAdmin) {
      const usersList = await getUsers(page,limit,offset,searchText);
      await disconnectFromDB();
      return successResponse(
        ENV_CONSTANTS.SUCCESS_CODE,
        usersList
      );
    }
    else {
      Log.info("you are not admin");
      await disconnectFromDB();
      return unauthorizedResponse(
        ENV_CONSTANTS.UNAUTHORIZED,
        "You are not authorized to access admin page"
      );
    }

  } catch (err) {
    return errorResponse(ENV_CONSTANTS.INTERNALSERVER_ERROR, err.stack)
  }
};