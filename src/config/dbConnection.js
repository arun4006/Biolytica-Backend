const Sequelize = require("sequelize");
const {ENV_DBCONSTANTS}=require('../constants/env.dbConstants')

const sequelize = new Sequelize(ENV_DBCONSTANTS.DATABASE,ENV_DBCONSTANTS.USERNAME, ENV_DBCONSTANTS.PASSWORD, {
  host: ENV_DBCONSTANTS.HOST,
  dialect: ENV_DBCONSTANTS.DIALECT,
  pool: {
  max: ENV_DBCONSTANTS.POOL.MAX,
  min: ENV_DBCONSTANTS.POOL.MIN,
  acquire:ENV_DBCONSTANTS.POOL.ACQUIRE,
  idle: ENV_DBCONSTANTS.POOL.IDLE
}
});

sequelize.sync({ force: false })

sequelize.authenticate().then(() => {
  console.log('Connection has been established successfully.');
}).catch((error) => {
  console.error('Unable to connect to the database: ', error);
});

module.exports = {sequelize }