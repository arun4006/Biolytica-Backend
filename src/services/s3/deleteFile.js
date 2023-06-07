const aws = require('aws-sdk');
const { ENV_BUCKETCONSTANTS } = require("../../constants/env.bucketConstants");
const s3 = new aws.S3();

exports.deleteFile = async (filename) => {

    const params = {
        Bucket: ENV_BUCKETCONSTANTS.bucketName,
        Key: filename
    };

    s3.deleteObject(params, (error, data) => {
        if (error) {
            console.log(error);
        }
        console.log("File Deleted Successfully")
    })

}