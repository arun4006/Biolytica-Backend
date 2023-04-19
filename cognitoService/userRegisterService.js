const AWS = require("aws-sdk");
const { sendResponse, validateInput } = require("../helper/utility");
const {
  successCode,
  internalServerError,
} = require("../constant");

const cognito = new AWS.CognitoIdentityServiceProvider();

module.exports.handler = async (event) => {
  try {
    const isValid = validateInput(event.body);
    if (!isValid) return sendResponse(400, { message: "Invalid input" });

    const { email, password } = JSON.parse(event.body);
    const { UserPoolId } = process.env;
    const params = {
      UserPoolId: UserPoolId,
      Username: email,
      UserAttributes: [
        {
          Name: "email",
          Value: email,
        },
        {
          Name: "email_verified",
          Value: "true",
        },
      ],
      MessageAction: "SUPPRESS",
    };
    const response = await cognito.adminCreateUser(params).promise();
    if (response.User) {
      const paramsForSetPass = {
        Password: password,
        UserPoolId: UserPoolId,
        Username: email,
        Permanent: true,
      };
      await cognito.adminSetUserPassword(paramsForSetPass).promise();
    }
    return sendResponse(successCode, { message: "User registration successful" });
  } catch (error) {
    const message = error.message ? error.message : "Internal server error";
    return sendResponse(internalServerError, { message });
  }
};
