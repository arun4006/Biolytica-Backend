const {getAllStates}=require('../services/db/db.service');
const { successResponse,errorResponse,notFoundResponse } = require("../utils/response");
const { ENV_CONSTANTS } = require("../constants/env.constants");
const Log=require('../utils/logging')

exports.handler = async (event) => {
    try {
      const statesResponse = await getAllStates();
      
      Log.info("statesResponse:" + statesResponse);
      return successResponse(ENV_CONSTANTS.SUCCESS_CODE, statesResponse);
    } catch (err) {
      Log.error(err);
      return errorResponse(
        ENV_CONSTANTS.INTERNALSERVER_ERROR,
        err
      );
    }
  };
  