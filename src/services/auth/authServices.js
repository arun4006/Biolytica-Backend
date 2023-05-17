const {ENV_COGNITOCONSTANTS}=require('../../constants/env.cognitoConstants');
const { CognitoJwtVerifier } = require("aws-jwt-verify");


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
    //console.log("token type:" + typeof useraccessToken);
    const userPayload = await verifier.verify(useraccessToken);
    console.log("Token is valid. Payload:", userPayload);
    return userPayload.username;
  } catch (err) {
    console.log(err);
    return "TOKEN_EXPIRED";
  }
};



