const {
  addUserMetaInTable,
} = require("../services/db/db.service");
const { uploadFiles } = require("../services/s3/fileUploadService");
const { successResponse,errorResponse } = require("../utils/response");
const { ENV_CONSTANTS } = require("../constants/env.constants");
const {ENV_COGNITOCONSTANTS}=require('../constants/env.cognitoConstants')
const Log= require("../utils/logging");
const {  extractFilesAndData } = require("../helper");


exports.handler = async (event) => {

 try {
    
    const { fields, files } = await extractFilesAndData(event);
    console.log('Fields:', fields);
    console.log('Files:', files);

  const fileuploadResponse = await uploadFiles(files);
   Log.info(fileuploadResponse.isUploaded);

    if (fileuploadResponse.isUploaded) {
            
      const filetableResponse = await addUserMetaInTable([
        fields.userName,
        fields.email,
        fields.name,     
        fields.hobbies,
        fields.bio,
        fileuploadResponse.fileUri,
        fields.districtId,
        fields.stateId
      ]);
      Log.info("filetableResponse:" + filetableResponse);
    
    }

  
    
    return successResponse(                                                                             
      ENV_CONSTANTS.SUCCESS_CODE,
      ENV_COGNITOCONSTANTS.USERREG_MSG
    );
  } catch (err) {
    Log.error(err);
    return errorResponse(ENV_CONSTANTS.INTERNALSERVER_ERROR,err.stack)
  }
};


