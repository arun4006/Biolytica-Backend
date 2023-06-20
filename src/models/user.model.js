const Sequelize = require("sequelize");
const { sequelize, connectToDatabase } = require("../config/dbConnection");

const User = sequelize.define("User", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  name: { type: Sequelize.STRING, allowNull: false },
  email: { type: Sequelize.STRING, allowNull: false, unique: true },
  user_id: { type: Sequelize.STRING, allowNull: false, unique: true },
  hobbies: { type: Sequelize.STRING, allowNull: false },
  bio: { type: Sequelize.TEXT },
  profile_pic: { type: Sequelize.STRING, allowNull: false },
  district_id: { type: Sequelize.INTEGER, allowNull: false },
  state_id: { type: Sequelize.INTEGER, allowNull: false },
  is_admin: {type:Sequelize.BOOLEAN, defaultValue:false},
  is_deleted: {type:Sequelize.BOOLEAN, defaultValue:false},
  num_posts:{type:Sequelize.INTEGER, defaultValue:0},
  createdAt: false,
  updatedAt: false
});

module.exports=User;