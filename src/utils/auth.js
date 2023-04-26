const request = require("request");
const { ENV_COGNITOCONSTANTS }=require('../constants/env.cognitoConstants')

const auth = async (req, res, next) => {
  try {
    let accessToken = req.cookies["accessToken"];
    if (accessToken != "none") {
      // Get user info
      const userInfoUrl = `https://${ENV_COGNITOCONSTANTS.COGNITO_DOMAIN}.auth.us-east-1.amazoncognito.com/oauth2/userInfo`;

      const options = {
        url: userInfoUrl,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      };

      const userInfoResponse = await getUserInfo(options);
      const { email_verified, username } = JSON.parse(userInfoResponse);
      if (email_verified == "true") {
        req.user = username;
        next();
      }
    } else {
      res.redirect("/login");
    }
  } catch (e) {
    console.log(e);
    res.redirect("/login");
  }
};

function getUserInfo(options) {
  return new Promise((resolve, reject) => {
    request.get(options, (error, response, body) => {
      if (error) {
        console.error(error);
        reject(error);
      } else {
        resolve(body);
      }
    });
  });
}

module.exports = auth;
