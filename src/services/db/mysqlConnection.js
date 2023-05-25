const mysql = require('mysql');
const {ENV_DBCONSTANTS}=require('../../constants/env.dbConstants')
const Log=require('../../utils/logging')
const mysqlConnection = mysql.createConnection({
 host: ENV_DBCONSTANTS.HOST,
 user: ENV_DBCONSTANTS.USER,
 password: ENV_DBCONSTANTS.PASSWORD,
 database: ENV_DBCONSTANTS.DATABASE,
 port:ENV_DBCONSTANTS.PORT,
 connectTimeout : 60000
});

mysqlConnection.connect((err) => {
    if (err) {
      Log.error('Error connecting to MySQL database: ', err);
      return;
    }
    Log.info('Connected to MySQL database successfully!');
  });

module.exports = mysqlConnection;

