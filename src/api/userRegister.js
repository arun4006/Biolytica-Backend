const parser = require("lambda-multipart-parser");
const { uploadFiles } = require("../services/s3/fileUploadService");
const { addUserMetaInTable } = require("../services/db/database.service");
const { ENV_COGNITOCONSTANTS } = require("../constants/env.cognitoConstants");
const { successResponse, errorResponse } = require("../utils/response");
const Log = require("../utils/logging");

exports.handler = async (event, context) => {
  const reqBody = await parser.parse(event);
  Log.info("files" + reqBody.files);
  var profileImageUpload;

 if (reqBody.files.length === 0) {
    profileImageUpload = 'https://aws-demo-files.s3.amazonaws.com/emptyProfile.png';
  } else {
   const uploadedFile = await uploadFiles(reqBody.files[0].filename, reqBody.files[0].content);
   profileImageUpload = uploadedFile.fileUri || 'https://aws-demo-files.s3.amazonaws.com/emptyProfile.png'; 
 }

  Log.info("profileImageUpload"+profileImageUpload);

  let reqPayload = {
    name: reqBody.name,
    email: reqBody.email,
    user_id: reqBody.userId,
    hobbies:  reqBody.hobbies,
    bio: reqBody.bio,
    profile_pic: profileImageUpload,
    district_id: reqBody.districtId,
    state_id:reqBody.stateId
}

 Log.info("req"+ JSON.stringify(reqPayload))
 let userData=JSON.stringify(reqPayload);
 const filetableResponse = await addUserMetaInTable(reqPayload);
 Log.info("filetableResponse:" + filetableResponse);
  
  return successResponse(200, 
    ENV_COGNITOCONSTANTS.USERREG_MSG
   );
};
