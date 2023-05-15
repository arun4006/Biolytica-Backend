const ENV_BUCKETCONSTANTS = {
  AWS_REGION: 'us-east-1',
  SIGNATURE_VERSION: "v4",
  ENCODED_TYPE: 'base64',
  SUCESSFILEUPLOAD_MSG: "File uploaded successfully.",
  SUCESSFILE_MSG: "File retrieved successfully.",
  WARNINGFILE_MSG:"Invalid file format. Please upload a valid image file.",
  ERROR_FROM_S3BUCKET: "Error retrieving files from S3 bucket",
  AccessKeyId:'ASIA4Y2YIVR4T2DREXUZ',
  secretAccessKey: 'xn21IWyzPQld9hWw5USliD+qfj/WnYCrWSgkART6',
  bucketName:'aws-demo-files',
  bukcetACL:"public-read"
};

module.exports =  {ENV_BUCKETCONSTANTS} ;
