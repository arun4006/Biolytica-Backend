const mysql = require('mysql');
const {ENV_DBCONSTANTS}=require('../../constants/env.dbConstants')
const mysqlConnection = mysql.createConnection({
 host: ENV_DBCONSTANTS.HOST,
 user: ENV_DBCONSTANTS.USER,
 password: ENV_DBCONSTANTS.PASSWORD,
 database: ENV_DBCONSTANTS.DATABASE,
 port:ENV_DBCONSTANTS.PORT
});

mysqlConnection.connect(function(err) {  
    if (err){
        console.log("error:"+err);
        throw err;
       
    }   

    console.log("Connected!");  
  });

module.exports = mysqlConnection;

