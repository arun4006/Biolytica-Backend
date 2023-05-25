const {getAllStates}=require('../services/db/db.service');
const { successResponse,errorResponse,notFoundResponse } = require("../utils/response");
const { ENV_CONSTANTS } = require("../constants/env.constants");


exports.handler = async (event) => {
    try {
      const statesResponse = await getAllStates();
      console.log("statesResponse:" + statesResponse);
      return successResponse(ENV_CONSTANTS.SUCCESS_CODE, statesResponse);
    } catch (err) {
      console.log(err);
      return errorResponse(
        ENV_CONSTANTS.INTERNALSERVER_ERROR,
        err
      );
    }
  };
  