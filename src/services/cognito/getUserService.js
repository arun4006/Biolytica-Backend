const AWS = require("aws-sdk");
const {
  ENV_COGNITOCONSTANTS,
} = require("../../constants/env.cognitoConstants");
const cognito = new AWS.CognitoIdentityServiceProvider({
  region: ENV_COGNITOCONSTANTS.AWS_REGION,
});

exports.getUserService = async (req, res) => {
  const params = {
    UserPoolId: ENV_COGNITOCONSTANTS.USERPOOL_ID,
    Username: req.params.userId,
  };
  try {
    const data = await cognito.adminGetUser(params).promise();
    const UserInfo = data.UserAttributes;

    const getUserDetail = {};
    UserInfo.forEach((obj) => {
      getUserDetail[obj.Name.toLowerCase()] = obj.Value;
    });
    // console.log(getUserDetail);
    res.json(getUserDetail);
  } catch (err) {
    console.log(err, err.stack);
  }
};


