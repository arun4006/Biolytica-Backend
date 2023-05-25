const mysqlConnection = require("../db/mysqlConnection");
const util = require("util");
const {ENV_DBCONSTANTS}=require('../../constants/env.dbConstants');
const {notFoundResponse,errorResponse}=require('../../utils/response');
const { ENV_CONSTANTS } = require("../../constants/env.constants");

exports.getuserProfileInfo = async (data) => {
    const query = util.promisify(mysqlConnection.query).bind(mysqlConnection);
  
    console.log("query:" + query);
  
    try {
      const getProfileDataByUser = await query(
        `SELECT * FROM ${ENV_DBCONSTANTS.TABLENAME_USERPROFILE} WHERE userid = ?`,
        [data]
      );
  
      console.log("getProfileDataByUser:" + getProfileDataByUser[0].id);
      // console.log("getProfileDataByUser 1:" + getProfileDataByUser[0].location);
      // console.log("getProfileDataByUser 2:" + getProfileDataByUser[0].name);
      console.log("length of getProfileDataByUser:" + getProfileDataByUser.length);
      //console.log("getPofileDataByUser:" + JSON.stringify(getProfileDataByUser));
      if (getProfileDataByUser.length == 0) {
        return notFoundResponse(ENV_CONSTANTS.NOTFOUND,"User not found");
      }
      return {
         userName: getProfileDataByUser[0].id,
         userLocation: getProfileDataByUser[0].location,
         signedUsername: getProfileDataByUser[0].name
      };
    } catch (err) {
      console.log("error:" + err);
      return errorResponse(ENV_CONSTANTS.INTERNALSERVER_ERROR,err);
    }
  };


  exports.addFileMetaInTable = async (data) => {
    const query = util.promisify(mysqlConnection.query).bind(mysqlConnection);
  
    console.log("query:" + query);
  
    try {
      const addObjectsByUser = await query(
        `INSERT INTO ${ENV_DBCONSTANTS.TABLENAME_IMAGES} (imagename,imageurl, owner,location) VALUES(?, ?, ?,?)`,
        [data[0], data[1], data[2], data[3]]
      );
  
      console.log("addObjectsByUser:" + addObjectsByUser);
      if (addObjectsByUser.length == 0) {
        return errorResponse(ENV_CONSTANTS.BAD_REQUEST,"Files data is not created");
      }
      //console.log(addObjectsByUser);
      return addObjectsByUser;
    } catch (err) {
      console.log("error:" + err);
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
  
      console.log("addnewUser:" + addnewUser);
      if (addnewUser.length == 0) {
        return errorResponse(ENV_CONSTANTS.BAD_REQUEST,"User Data is not Created")
      }
  
     return {
        isCreated:true,
        addnewUser
     };
    } catch (err) {
      console.log("error:" + err);
      return errorResponse(ENV_CONSTANTS.INTERNALSERVER_ERROR,err);
    }
  };
  

  exports.getFilesbyuserLocation = async (data) => {
    const query = util.promisify(mysqlConnection.query).bind(mysqlConnection);
    console.log("query:" + query);
    try 
    {
      const filesbyUserLocation = await query(
        `SELECT * FROM ${ENV_DBCONSTANTS.TABLENAME_IMAGES} WHERE location = ?`,
        [data]
      );
  
      console.log("filesbyuserLocation:" + filesbyUserLocation);
      if (filesbyUserLocation.length == 0) {
        return {
          status: "error",
          message: "Data not found",
        };
      }
      return filesbyUserLocation;
    } catch (err) {
      console.log("error:" + err);
      return err;
    }
  };


  exports.getAllStates= async () => {
    const query = util.promisify(mysqlConnection.query).bind(mysqlConnection);
    console.log("query:" + query);
    try 
    {
      const statesList = await query(
        `SELECT * FROM ${ENV_DBCONSTANTS.TABLENAME_STATESLIST}`
      );
  
      console.log("statesList:" + statesList);
      if (statesList.length == 0) {
        return {
          status: "error",
          message: "Data not found",
        };
      }
      return statesList;
    } catch (err) {
      console.log("error:" + err);
      return err;
    }
  }

  exports.getAllDistricts= async (data) => {
    const query = util.promisify(mysqlConnection.query).bind(mysqlConnection);
    console.log("query:" + query);
    try 
    {
      const districtList = await query(
        `SELECT * FROM ${ENV_DBCONSTANTS.TABLENAME_DISTRICTLIST} WHERE stateId = ?`,
        [data]
      );
  
      console.log("districtList:" + districtList);
      if (districtList.length == 0) {
        return {
          status: "error",
          message: "Data not found",
        };
      }
      return districtList;
    } catch (err) {
      console.log("error:" + err);
      return err;
    }
  }