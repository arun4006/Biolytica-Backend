const {getAllCities}=require('../services/db/database.service');
const { successResponse,errorResponse,notFoundResponse } = require("../utils/response");
const { ENV_CONSTANTS } = require("../constants/env.constants");
const Log=require('../utils/logging')

exports.handler = async (event) => {
    try {
    const reqStateId = event.queryStringParameters.id;
    Log.info("reqStateId"+reqStateId);

    const cityResponse = await getAllCities(reqStateId);
    Log.info("cityResponse:" + cityResponse);
    return successResponse(ENV_CONSTANTS.SUCCESS_CODE, cityResponse);
    } catch (err) {
      Log.error(err);
      return errorResponse(
        ENV_CONSTANTS.INTERNALSERVER_ERROR,
        err
      );
    }
  };