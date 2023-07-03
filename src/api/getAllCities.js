const {getAllCities}=require('../services/db/database.service');
const { successResponse,errorResponse,notFoundResponse } = require("../utils/response");
const { ENV_CONSTANTS } = require("../constants/env.constants");
const Log=require('../utils/logging')
const { connectToDB, disconnectFromDB } = require('../services/auth/authServices');

exports.handler = async (event) => {
    try {
    await connectToDB();
    const reqStateId = event.queryStringParameters.id;
    Log.info("reqStateId"+reqStateId);

    const cityResponse = await getAllCities(reqStateId);
    Log.info("cityResponse:" + cityResponse);
    await disconnectFromDB();
    return successResponse(ENV_CONSTANTS.SUCCESS_CODE, cityResponse);
    } catch (err) {
      Log.error(err);
      return errorResponse(
        ENV_CONSTANTS.INTERNALSERVER_ERROR,
        err
      );
    }
  };