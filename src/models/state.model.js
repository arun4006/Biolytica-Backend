const Sequelize = require("sequelize");
const { sequelize} = require("../config/dbConnection");

const State = sequelize.define("State", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  state_name: { type: Sequelize.STRING, allowNull: false },
  createdAt: false,
  updatedAt: false
});

module.exports= State;