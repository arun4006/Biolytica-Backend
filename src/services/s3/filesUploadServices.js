const AWS = require("aws-sdk");
const { CognitoJwtVerifier } = require("aws-jwt-verify");
const parseMultipart = require("parse-multipart");
const { ENV_BUCKETCONSTANTS } = require("../../constants/env.bucketConstants");
const { ENV_CONSTANTS } = require("../../constants/env.constants");
const {
  ENV_COGNITOCONSTANTS,
} = require("../../constants/env.cognitoConstants");
const { ENV_DBCONSTANTS } = require("../../constants/env.dbConstants");
const mysqlConnection = require("../db/mysqlConnection");
const util = require("util");
const s3 = new AWS.S3();

exports.handler = async (event) => {
  try {
    const userTokenInfo = await getUserTokenInfo(event);
    console.log("userTokenInfo Status:" + userTokenInfo);
    if (userTokenInfo == "TOKEN_EXPIRED") {
      return {
        statusCode: ENV_CONSTANTS.UNAUTHORIZED,
        body: JSON.stringify({ message: "Token is expired" }),
      };
    }

    const { filename, data } = extractFile(event);
    const bucketName = ENV_BUCKETCONSTANTS.bucketName;
    const objectKey = Date.now() + "_" + filename;
    const params = {
      Bucket: bucketName,
      Key: objectKey,
      ACL: ENV_BUCKETCONSTANTS.bukcetACL,
      Body: data,
    };
    const fileuploadResponse = await s3.putObject(params).promise();
    console.log(fileuploadResponse);
    if (fileuploadResponse.ETag) {
      //console.log("success");

      const userData = await getuserProfileInfo(userTokenInfo);
      console.log("userData" + userData.userLocation);
      const filetableResponse = await addFileMetaInTable([
        objectKey,
        `https://${bucketName}.s3.amazonaws.com/${objectKey}`,
        userData.userName,
        userData.userLocation,
      ]);
      console.log("filetableResponse:" + filetableResponse);
    }

    return {
      statusCode: ENV_CONSTANTS.SUCCESS_CODE,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: ENV_BUCKETCONSTANTS.SUCESSFILEUPLOAD_MSG,
        //  res: fileuploadResponse,
       imageUrl: `https://${bucketName}.s3.amazonaws.com/${objectKey}`
      }),
    };
  } catch (err) {
    return {
      statusCode: ENV_CONSTANTS.INTERNALSERVER_ERROR,
      body: JSON.stringify({ message: err.stack }),
    };
  }
};

function extractFile(event) {
  const boundary = parseMultipart.getBoundary(event.headers["content-type"]);
  console.log("boundary:" + boundary);
  const files = parseMultipart.Parse(
    Buffer.from(event.body, ENV_BUCKETCONSTANTS.ENCODED_TYPE),
    boundary
  );
  const fileFormat = files[0].type.split("/")[0];
  console.log("files:" + fileFormat);

  if (fileFormat !== "image") {
    console.log("not valid image format");
    return {
      error: ENV_BUCKETCONSTANTS.WARNINGFILE_MSG,
    };
  } else {
    const [{ filename, data }] = files;
    return {
      filename,
      data,
    };
  }
}

const getUserTokenInfo = async (event) => {
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

const getuserProfileInfo = async (data) => {
  const query = util.promisify(mysqlConnection.query).bind(mysqlConnection);

  console.log("query:" + query);

  try {
    const getPofileDataByUser = await query(
      `SELECT * FROM ${ENV_DBCONSTANTS.TABLENAME_USERPROFILE} WHERE username = ?`,
      [data]
    );

    console.log("getPofileDataByUser:" + getPofileDataByUser[0].username);
    console.log("type getPofileDataByUser:" + getPofileDataByUser.length);
    //console.log("getPofileDataByUser:" + JSON.stringify(getPofileDataByUser));
    if (getPofileDataByUser.length == 0) {
      return {
        status: "error",
        message: "user Data not found",
      };
    }
    return {
      userName: getPofileDataByUser[0].username,
      userLocation: getPofileDataByUser[0].location,
    };
  } catch (err) {
    console.log("error:" + err);
    return err;
  }
};

const addFileMetaInTable = async (data) => {
  const query = util.promisify(mysqlConnection.query).bind(mysqlConnection);

  console.log("query:" + query);

  try {
    const addObjectsByUser = await query(
      `INSERT INTO ${ENV_DBCONSTANTS.TABLENAME_IMAGES} (imagename,imageurl, owner,location) VALUES(?, ?, ?,?)`,
      [data[0], data[1], data[2], data[3]]
    );

    console.log("addObjectsByUser:" + addObjectsByUser);
    if (addObjectsByUser.length == 0) {
      return {
        status: "error",
        message: "Data not found",
      };
    }
    //console.log(addObjectsByUser);
    return addObjectsByUser;
  } catch (err) {
    console.log("error:" + err);
    return err;
  }
};
