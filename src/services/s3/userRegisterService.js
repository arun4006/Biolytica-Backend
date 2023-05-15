const util = require("util");
const mysqlConnection = require("../db/mysqlConnection");
const { ENV_DBCONSTANTS } = require("../../constants/env.dbConstants");
const { ENV_BUCKETCONSTANTS } = require("../../constants/env.bucketConstants");
const { ENV_COGNITOCONSTANTS } = require("../../constants/env.cognitoConstants");

exports.handler = async (event) => {
  const userData = JSON.parse(event.body);
  console.log(userData);
  try {
   const result = await addUserMetaInTable(userData);

    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: ENV_COGNITOCONSTANTS.USERREG_MSG,
       // results: result,
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
        message: ENV_BUCKETCONSTANTS.ERROR_FROM_S3BUCKET,
      }),
    };
  }
};

const addUserMetaInTable = async (data) => {
  const query = util.promisify(mysqlConnection.query).bind(mysqlConnection);

  try {
    const addnewUser = await query(
      `INSERT INTO ${ENV_DBCONSTANTS.TABLENAME_USERPROFILE} (username,location,email,name) VALUES(?, ?, ?,?)`,
      [data.usersub, data.locale, data.email,data.name]
    );

    console.log("addnewUser:" + addnewUser);
    if (addnewUser.length == 0) {
      return {
        status: "error",
        message: "Data not found",
      };
    }

   return addnewUser;
  } catch (err) {
    console.log("error:" + err);
    return err;
  }
};
