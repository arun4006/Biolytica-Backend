const parser = require("lambda-multipart-parser");
const { uploadProfilePic } = require("../services/s3/fileUploadService");
const { addUserMetaInTable } = require("../services/db/db.service");
const { ENV_COGNITOCONSTANTS } = require("../constants/env.cognitoConstants");
const { successResponse, errorResponse } = require("../utils/response");
const { emptyProfile } = require("../helper/index");
const Log = require("../utils/logging");

exports.handler = async (event, context) => {
  const reqBody = await parser.parse(event);
  Log.info("files" + reqBody.files);

  if (reqBody.files.length === 0) {
    //if file did not uplaod ,set default empty profile image
    profileImageUpload = emptyProfile();
  } else {
    profileImageUpload = await uploadProfilePic(
      reqBody.files[0].filename,
      reqBody.files[0].content
    );
  }

  Log.info(profileImageUpload);

  if (profileImageUpload.isUploaded) {
    const filetableResponse = await addUserMetaInTable([
      reqBody.name,
      reqBody.email,
      reqBody.userId,
      reqBody.hobbies,
      reqBody.bio,
      profileImageUpload.fileUri,
      reqBody.districtId,
      reqBody.stateId,
    ]);
    Log.info("filetableResponse:" + filetableResponse);
  }

  return successResponse(200, 
    ENV_COGNITOCONSTANTS.USERREG_MSG
   );
};
