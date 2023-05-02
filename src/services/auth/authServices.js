const request = require("request");
const AWS = require("aws-sdk");
const cognitoidentityserviceprovider = new AWS.CognitoIdentityServiceProvider();
const {ENV_COGNITOCONSTANTS}=require('../../constants/env.cognitoConstants')

exports.login = async (req, res) => {
  res.send("hello");
};

exports.generateToken = async (req, res) => {
  const code = req.query.code;

  const options = {
    url: `https://${ENV_COGNITOCONSTANTS.COGNITO_DOMAIN}.auth.us-east-1.amazoncognito.com/oauth2/token`,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    form: {
      grant_type: "authorization_code",
      client_id: ENV_COGNITOCONSTANTS.CLIENT_ID,
      client_secret: ENV_COGNITOCONSTANTS.CLIENT_SECRET,
      redirect_uri: ENV_COGNITOCONSTANTS.REDIRECT_URI,
      code: code,
    },
  };

  request.post(options, async (error, response, body) => {
    if (error) {
      console.error(error);
      res.send(error);
    } else {
      const accessToken = JSON.parse(body).access_token;
      //console.log(accessToken);
      res.cookie("accessToken", accessToken, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
      });
      res.redirect("/fileUpload");
      
    }
  });
};

exports.logout = async (req, res) => {
  res.cookie("accessToken", "none", {
    httpOnly: true,
  });

  res.render("logout");
};
