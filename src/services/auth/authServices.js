const AWS = require("aws-sdk");
const cognito = new AWS.CognitoIdentityServiceProvider();
const { ENV_COGNITOCONSTANTS } = require("../../constants/env.cognitoConstants");
const { CognitoJwtVerifier } = require("aws-jwt-verify");
const Log = require("../../utils/logging");
const {ENV_CONSTANTS} = require("../../constants/env.constants");
const {getUser}=require('../db/db.service')
const {errorResponse} = require("../../utils/response");



exports.getUserTokenInfo = async (event) => {
  let accessToken = event.headers.Authorization;

  const verifier = CognitoJwtVerifier.create({
    userPoolId: ENV_COGNITOCONSTANTS.USERPOOL_ID,
    tokenUse: ENV_COGNITOCONSTANTS.TOKEN_USE,
    clientId: ENV_COGNITOCONSTANTS.CLIENT_ID,
    // scope: ENV_COGNITOCONSTANTS.SCOPE,
  });

  const useraccessToken = accessToken.split(" ")[1];
  try {
    const userPayload = await verifier.verify(useraccessToken);
    Log.info("Token is valid. Payload:", userPayload);
    return userPayload.username;
  } catch (err) {
    Log.error(err);
    //console.log(err);
    return "TOKEN_EXPIRED";
  }
};

exports.cognitoUserToDelete = async (username) => {
  const params =
  {
    UserPoolId: ENV_COGNITOCONSTANTS.USERPOOL_ID,
    Username: username
  };
  try {
    const removeUser = await cognito.adminDeleteUser(params).promise();
    Log.info(removeUser);
    return removeUser;
  } catch (err) {
    return errorResponse(ENV_CONSTANTS.INTERNALSERVER_ERROR, err.stack)
  }
}; 

exports.isOwnProfile= async (reqUserId,currentUserId) => {
   const userData=await getUser(currentUserId);
   const result=userData[0].userid === reqUserId;
   return result;
}