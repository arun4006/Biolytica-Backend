const mysqlConnection = require("../db/mysqlConnection");
const util = require("util");
const {ENV_DBCONSTANTS}=require('../../constants/env.dbConstants');
const {notFoundResponse,errorResponse}=require('../../utils/response');
const { ENV_CONSTANTS } = require("../../constants/env.constants");
const Log = require("../../utils/logging");

exports.getuserProfileInfo = async (data) => {
    const query = util.promisify(mysqlConnection.query).bind(mysqlConnection);
  
    console.log("query:" + query);
  
    try {
      const getProfileDataByUser = await query(
        `SELECT * FROM ${ENV_DBCONSTANTS.TABLENAME_USERPROFILE} WHERE userid = ?`,
        [data]
      );
      
      Log.info("getProfileDataByUser:" + getProfileDataByUser[0].id);
      Log.info("length of getProfileDataByUser:" + getProfileDataByUser.length);
      if (getProfileDataByUser.length == 0) {
        return notFoundResponse(ENV_CONSTANTS.NOTFOUND,"User not found");
      }
      return {
         userName: getProfileDataByUser[0].id,
         userLocation: getProfileDataByUser[0].location,
         signedUsername: getProfileDataByUser[0].name
      };
    } catch (err) {
      Log.error("error:" + err);
      return errorResponse(ENV_CONSTANTS.INTERNALSERVER_ERROR,err);
    }
  };


  exports.addFileMetaInTable = async (data) => {
    const query = util.promisify(mysqlConnection.query).bind(mysqlConnection);
    Log.info("query:" + query);

    try {
      const addObjectsByUser = await query(
        `INSERT INTO ${ENV_DBCONSTANTS.TABLENAME_IMAGES} (imagename,imageurl, owner,location) VALUES(?, ?, ?,?)`,
        [data[0], data[1], data[2], data[3]]
      );
  
      Log.info("addObjectsByUser:" + addObjectsByUser);
      if (addObjectsByUser.length == 0) {
        return errorResponse(ENV_CONSTANTS.BAD_REQUEST,"Files data is not created");
      }
      return addObjectsByUser;
    } catch (err) {
      Log.error("error"+err);
      return errorResponse (ENV_CONSTANTS.INTERNALSERVER_ERROR,err);
    }
  };
  

  exports.addUserMetaInTable = async (data) => {
    const query = util.promisify(mysqlConnection.query).bind(mysqlConnection);
  
    try {
      const addnewUser = await query(
        `INSERT INTO ${ENV_DBCONSTANTS.TABLENAME_USERPROFILE} (userid,location,email,name) VALUES(?, ?, ?,?)`,
        [data.usersub, data.locale, data.email,data.name]
      );
      
      Log.info("addnewUser:" + addnewUser);
      if (addnewUser.length == 0) {
        return errorResponse(ENV_CONSTANTS.BAD_REQUEST,"User Data is not Created")
      }
  
     return {
        isCreated:true,
        addnewUser
     };
    } catch (err) {
      Log.error("error:" + err);
      return errorResponse(ENV_CONSTANTS.INTERNALSERVER_ERROR,err);
    }
  };
  

  exports.getFilesbyuserLocation = async (data) => {
    const query = util.promisify(mysqlConnection.query).bind(mysqlConnection); 
    Log.error("query:" + query);

    try 
    {
      const filesbyUserLocation = await query(
        `SELECT * FROM ${ENV_DBCONSTANTS.TABLENAME_IMAGES} WHERE location = ?`,
        [data]
      );
      Log.info("filesbyuserLocation:" + filesbyUserLocation);

      if (filesbyUserLocation.length == 0) {
        return {
          status: "error",
          message: "Data not found",
        };
      }
      return filesbyUserLocation;
    } catch (err) {
     Log.error("error:" + err);
      return err;
    }
  };


  exports.getAllStates= async () => {
    const query = util.promisify(mysqlConnection.query).bind(mysqlConnection);
    Log.info("query:" + query);
    try 
    {
      const statesList = await query(
        `SELECT * FROM ${ENV_DBCONSTANTS.TABLENAME_STATESLIST}`
      );
      
      Log.info("statesList:" + statesList);
      if (statesList.length == 0) {
        return {
          status: "error",
          message: "Data not found",
        };
      }
      return statesList;
    } catch (err) {
      Log.error("error:" + err);
      return err;
    }
  }

  exports.getAllDistricts= async (data) => {
    const query = util.promisify(mysqlConnection.query).bind(mysqlConnection);
    Log.info("query:" + query);
    try 
    {
      const districtList = await query(
        `SELECT * FROM ${ENV_DBCONSTANTS.TABLENAME_DISTRICTLIST} WHERE stateId = ?`,
        [data]
      );

      Log.info("districtList:" + districtList);
      if (districtList.length == 0) {
        return {
          status: "error",
          message: "Data not found",
        };
      }
      return districtList;
    } catch (err) {
      Log.error("error:" + err);
      return err;
    }
  }