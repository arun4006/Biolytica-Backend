const AWS = require("aws-sdk");
const { ENV_CONSTANTS } = require("../constants/env.constants");
const {ENV_COGNITOCONSTANTS}=require('../constants/env.cognitoConstants')
const {unauthorizedResponse, successResponse, errorResponse } = require("../utils/response");
const Log = require('../utils/logging');

exports.handler = async (event) => {
    var email=event.queryStringParameters.email;
    const params = {
      UserPoolId: ENV_COGNITOCONSTANTS.USERPOOL_ID,
      Filter: `email = "${email}"`,
      Limit: 1
    };
    
    try {
      const cognito = new AWS.CognitoIdentityServiceProvider();
      const users = await cognito.listUsers(params).promise();
      
      if (users.Users.length > 0) {
        Log.info("User already exist..!");
        return successResponse(200,ENV_COGNITOCONSTANTS.USER_EXISTSMSG);

      } else {
        Log.info("User not already exist..!");
        return successResponse(200, ENV_COGNITOCONSTANTS.USER_NOTEXISTSMSG);
      }
    } catch (err) {
      return errorResponse(ENV_CONSTANTS.INTERNALSERVER_ERROR, err.stack);
    }
  };
  