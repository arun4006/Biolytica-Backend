const mysql = require('mysql');
const {ENV_DBCONSTANTS}=require('../../constants/env.dbConstants')
const mysqlConnection = mysql.createConnection({
 host: ENV_DBCONSTANTS.HOST,
 user: ENV_DBCONSTANTS.USER,
 password: ENV_DBCONSTANTS.PASSWORD,
 database: ENV_DBCONSTANTS.DATABASE,
});

mysqlConnection.connect();

module.exports = mysqlConnection;

