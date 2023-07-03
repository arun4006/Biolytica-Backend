const { getAllStates } = require('../services/db/database.service');
const { successResponse, errorResponse, notFoundResponse } = require("../utils/response");
const { ENV_CONSTANTS } = require("../constants/env.constants");
const Log = require('../utils/logging');
const { connectToDB, disconnectFromDB } = require('../services/auth/authServices')

exports.handler = async (event) => {

  try {
    await connectToDB();
    const statesResponse = await getAllStates();
    Log.info("statesResponse:" + statesResponse);
    await disconnectFromDB();
    return successResponse(ENV_CONSTANTS.SUCCESS_CODE, statesResponse);
  } catch (err) {
    Log.error(err);
    return errorResponse(
      ENV_CONSTANTS.INTERNALSERVER_ERROR,
      err
    );
  }
};
