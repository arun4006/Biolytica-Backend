const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
const { CognitoJwtVerifier } = require("aws-jwt-verify");
const { ENV_BUCKETCONSTANTS } = require("../../constants/env.bucketConstants");
const { ENV_DBCONSTANTS } = require("../../constants/env.dbConstants");
const mysqlConnection = require("../../services/db/mysqlConnection");
const util = require("util");
const {
  ENV_COGNITOCONSTANTS,
} = require("../../constants/env.cognitoConstants");
const s3Client = new S3Client({ region: ENV_BUCKETCONSTANTS.AWS_REGION });

exports.handler = async (event) => {
   const fileContent = Buffer.from(event.body, ENV_BUCKETCONSTANTS.ENCODED_TYPE);
   const bucketName = ENV_BUCKETCONSTANTS.bucketName;
   const objectKey = Date.now() + ".png";
  const params = {
    Bucket: bucketName,
    Key: objectKey,
    Body: fileContent,
  };

  try {
       const result = await s3Client.send(new PutObjectCommand(params));
       if ((result.$metadata.statusCode = 200)) {
      const userName = await getUserInfo(event);
      console.log("userName:" + userName);
      const tableResponse = await addFileMetaInTable([
        objectKey,
        userName,
        'madurai',
      ]);
      console.log("tableResponse:" + tableResponse);
      }
    console.log(`File uploaded successfully` + result);
    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: "File uploaded successfully",
        isBase64Encoded: false,
        // url: result,
        event: event,
      }),
    };
  } catch (err) {
    console.log(err);
    return {
      statusCode: 500,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: "An error occurred while uploading the file",
      }),
    };
  }
};

const getUserInfo = async (event) => {
  let accessToken = event.headers.Authorization;

  const verifier = CognitoJwtVerifier.create({
    userPoolId: ENV_COGNITOCONSTANTS.USERPOOL_ID,
    tokenUse: ENV_COGNITOCONSTANTS.TOKEN_USE,
    clientId: ENV_COGNITOCONSTANTS.CLIENT_ID,
    scope: ENV_COGNITOCONSTANTS.SCOPE,
  });

  const useraccessToken =accessToken.split(" ")[1];
  try {
    //console.log("token type:" + typeof useraccessToken);
    const userPayload = await verifier.verify(useraccessToken);
    console.log("Token is valid. Payload:", userPayload);
    return userPayload.username;
  } catch (err) {
    console.log(err);
    return "Token is expired";
  }
};

const addFileMetaInTable = async (data) => {

   const query = util.promisify(mysqlConnection.query).bind(mysqlConnection);

   console.log("query:"+query);

   try {
   
    const addObjectsByUser = await query(
      `INSERT INTO ${ENV_DBCONSTANTS.TABLENAME_IMAGES} (imagename, owner,location) VALUES(?, ?, ?)`,[data[0],data[1],data[2]]
    );
    
    console.log("addObjectsByUser:"+addObjectsByUser);
    if (addObjectsByUser.length == 0) {
     return {
        status: 'error',
        message: 'Data not found'
      };
    }
    //console.log(addObjectsByUser);
    return addObjectsByUser;

  } catch (err) {
    console.log("error:"+err);
    return err;
    
  }
};
