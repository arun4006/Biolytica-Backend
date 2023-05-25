const { addUserMetaInTable } = require("../services/db/db.service");
const { successResponse, errorResponse } = require("../utils/response");
const { ENV_COGNITOCONSTANTS } = require("../constants/env.cognitoConstants");
const { ENV_CONSTANTS } = require("../constants/env.constants");
const Log=require('../utils/logging');

exports.handler = async (event) => {
  const userData = JSON.parse(event.body);
  Log.info(userData);
  try {
    const userReg = await addUserMetaInTable(userData);
    if (userReg.isCreated) {
      return successResponse(
        ENV_CONSTANTS.SUCCESS_CODE,
        ENV_COGNITOCONSTANTS.USERREG_MSG
      );
    }
  } catch (err) {
    Log.error(err);
    return errorResponse(
      ENV_CONSTANTS.INTERNALSERVER_ERROR,
      ENV_COGNITOCONSTANTS.USERREG_MSG
    );
  }
};
