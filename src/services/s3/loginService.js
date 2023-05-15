const cookie = require('cookie');
const {ENV_CONSTANTS}=require('../../constants/env.constants')

exports.handler = async (event, context, callback) => {
    const accessToken = JSON.parse(event.body);
    
  try {
    console.log("accessToken"+accessToken);
    var setCookie = cookie.serialize('accessToken', accessToken,{
        httpOnly: true
    });
    
    const cookies = cookie.parse(event.headers.setCookie || '');
    return {
        statusCode: ENV_CONSTANTS.SUCCESS_CODE,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Content-Type": "application/json",
          "Access-Control-Allow-Credentials" : true,
          'Set-Cookie': setCookie
        },
        body: JSON.stringify({
          result: "access Token stored in cookie",
          CookieValue: cookies.accessToken
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
