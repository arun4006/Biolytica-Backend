const {Sequelize, DataTypes} = require('sequelize');
const {ENV_DBCONSTANTS}=require('../constants/env.dbConstants')

const sequelize = new Sequelize(ENV_DBCONSTANTS.DATABASE,ENV_DBCONSTANTS.USERNAME, ENV_DBCONSTANTS.PASSWORD, {
  host: ENV_DBCONSTANTS.HOST,
  dialect: ENV_DBCONSTANTS.DIALECT,
//   pool: {
//   max: ENV_DBCONSTANTS.POOL.MAX,
//   min: ENV_DBCONSTANTS.POOL.MIN,
//   acquire:ENV_DBCONSTANTS.POOL.ACQUIRE,
//   idle: ENV_DBCONSTANTS.POOL.IDLE
// }
});


sequelize.authenticate().then(() => {
  console.log('Connected to mysql ..!');
}).catch((error) => {
  console.error('Unable to connect to the database: ', error);
});

const db = {}

db.Sequelize = Sequelize
db.sequelize = sequelize

db.user = require('../models/user.model')(sequelize, DataTypes)
db.imageInfo = require('../models/imageInfo.model')(sequelize, DataTypes)
db.state = require('../models/state.model')(sequelize, DataTypes)
db.city = require('../models/city.model')(sequelize, DataTypes)

db.sequelize.sync({ force: false })
.then(() => {
    console.log('yes re-sync done!')
})

db.user.hasMany(db.imageInfo, {
  foreignKey: 'owner'
})

db.state.hasMany(db.city, {
  foreignKey: 'state_id'
})

db.user.belongsTo(db.state,{
  foreignKey:'state_id'
})

db.user.belongsTo(db.city,{
  foreignKey:'district_id'
})
module.exports = db;