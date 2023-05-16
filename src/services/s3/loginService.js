const {ENV_CONSTANTS}=require('../../constants/env.constants')

exports.handler = async (event, context, callback) => {
  const accessToken = JSON.parse(event.body);
    
  try {
    console.log("accessToken"+accessToken);
    return {
        statusCode: ENV_CONSTANTS.SUCCESS_CODE,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Content-Type": "application/json",
          "Access-Control-Allow-Credentials" : true,
          'set-Cookie': accessToken
        },
        body: JSON.stringify({
          result: "access Token stored in cookie"
        })
      };
  } 
  catch (err) {
    return {
      statusCode: ENV_CONSTANTS.INTERNALSERVER_ERROR,
      body: JSON.stringify({ message: err.stack }),
    };
  }
};
