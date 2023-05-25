const {getAllDistricts}=require('../services/db/db.service');
const { successResponse,errorResponse,notFoundResponse } = require("../utils/response");
const { ENV_CONSTANTS } = require("../constants/env.constants");
const Log=require('../utils/logging')

exports.handler = async (event) => {
    try {
    const reqStateId = event.queryStringParameters.id;
    Log.info("reqStateId"+reqStateId);

    const districtResponse = await getAllDistricts(reqStateId);
    Log.info("districtResponse:" + districtResponse);
    return successResponse(ENV_CONSTANTS.SUCCESS_CODE, districtResponse);
    } catch (err) {
      Log.error(err);
      return errorResponse(
        ENV_CONSTANTS.INTERNALSERVER_ERROR,
        err
      );
    }
  };