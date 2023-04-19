const AWS = require("aws-sdk");
const {
  region,
  signatureVersion,
  encodedType,
  fileUploaded,
  successCode,
  internalServerError,
} = require("../constant");

const s3 = new AWS.S3({ signatureVersion, region });

exports.handler = async (event) => {
  const body = JSON.parse(event.body);
  const fileName = body.fileName;
  const base64String = body.base64String;
  const buffer = Buffer.from(base64String, encodedType);

  try {
    const params = {
      Body: buffer,
      Bucket: process.env.bucketName,
      Key: fileName,
    };

    await s3.putObject(params).promise();

    return {
      statusCode: successCode,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Credentials": true,
      },
      body: fileUploaded,
    };
  } catch (err) {
    console.log(err);
    return {
      statusCode: internalServerError,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Credentials": true,
      },
      body: JSON.stringify(err),
    };
  }
};
