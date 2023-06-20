const ENV_DBCONSTANTS = {
  HOST: 'filemanagement.cdgkfoacvf6u.us-east-1.rds.amazonaws.com',
  USERNAME: 'admin',
  PASSWORD:'Test1234',
  DATABASE: 'file_management_db',
  TABLENAME_IMAGES:'Imageinfo',
  TABLENAME_USERPROFILE:'UserProfile',
  TABLENAME_STATESLIST:'statesList',
  TABLENAME_DISTRICTLIST:'districtList',
  PORT:'3306',
  DIALECT:'mysql',
  POOL: {
    MAX: 5,
    MIN: 0,
    ACQUIRE: 30000,
    IDLE: 10000
  }
  };
  
module.exports= {ENV_DBCONSTANTS};