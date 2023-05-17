const {getFilesUrl}=require('../services/s3/getFilesUrlService');
const {successResponse,errorResponse}=require('../utils/response');
const {ENV_CONSTANTS}=require('../constants/env.constants');
const {ENV_BUCKETCONSTANTS}=require('../constants/env.bucketConstants')

exports.handler =  async (event) => {
    try {
        const fileResponse=await getFilesUrl();        
        return successResponse(ENV_CONSTANTS.SUCCESS_CODE,fileResponse);        
        } 
        catch (err) {
          console.log(err);
          return errorResponse(ENV_CONSTANTS.INTERNALSERVER_ERROR,ENV_BUCKETCONSTANTS.ERROR_FROM_S3BUCKET);                    
        }
    }

    

