const { getFilesUrl } = require("../services/s3/getFilesUrlService");
const { successResponse, errorResponse } = require("../utils/response");
const { ENV_CONSTANTS } = require("../constants/env.constants");
const { ENV_BUCKETCONSTANTS } = require("../constants/env.bucketConstants");
const {getUserTokenInfo}=require('../services/auth/authServices')
const {unauthorizedResponse}=require('../utils/response');
const Log=require('../utils/logging')

exports.handler = async (event) => {
  try {
    const userTokenInfo = await getUserTokenInfo(event);
    Log.info("userTokenInfo Status:" + userTokenInfo);
    if (userTokenInfo == "TOKEN_EXPIRED") {
      Log.warn("Not Authorized");
      return unauthorizedResponse(ENV_CONSTANTS.UNAUTHORIZED, userTokenInfo);
    }
    const fileResponse = await getFilesUrl();
    return successResponse(ENV_CONSTANTS.SUCCESS_CODE, fileResponse);
  } catch (err) {
    Log.error(err);
    return errorResponse(
      ENV_CONSTANTS.INTERNALSERVER_ERROR,
      ENV_BUCKETCONSTANTS.ERROR_FROM_S3BUCKET
    );
  }
};
