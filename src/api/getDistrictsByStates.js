const {getAllDistricts}=require('../services/db/db.service');
const { successResponse,errorResponse,notFoundResponse } = require("../utils/response");
const { ENV_CONSTANTS } = require("../constants/env.constants");


exports.handler = async (event) => {
    try {
    const reqStateId = event.queryStringParameters.id;
    console.log("reqStateId"+reqStateId);
    // const districtResponse = await getAllDistricts(reqStateId);
    //   console.log("districtResponse:" + districtResponse);
    //   return successResponse(ENV_CONSTANTS.SUCCESS_CODE, districtResponse);
    } catch (err) {
      console.log(err);
      return errorResponse(
        ENV_CONSTANTS.INTERNALSERVER_ERROR,
        err
      );
    }
  };