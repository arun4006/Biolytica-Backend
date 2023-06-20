const Sequelize = require("sequelize");
const { sequelize, connectToDatabase } = require("../config/dbConnection");
const User=require('./user.model')

const ImageData = sequelize.define("ImageData", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  image_name: { type: Sequelize.STRING, allowNull: false },
  image_url: { type: Sequelize.STRING, allowNull: false},
  user_id: { type: Sequelize.STRING, allowNull: false},
  owner: { type: Sequelize.INTEGER, allowNull: false },
  location: { type: Sequelize.INTEGER, allowNull: false },
  is_deleted: {type:Sequelize.BOOLEAN, defaultValue:false},
  createdAt: false,
  updatedAt: false
});

ImageData.belongsTo(User, { foreignKey: 'owner' });

module.exports= ImageData;