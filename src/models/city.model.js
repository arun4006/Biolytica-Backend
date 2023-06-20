const Sequelize = require("sequelize");
const { sequelize} = require("../config/dbConnection");
const State=require('../models/state.model')

const City = sequelize.define("City", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,       
  },
  city_name: { type: Sequelize.STRING, allowNull: false },
  state_id: { type: Sequelize.INTEGER, allowNull: false },
  createdAt: false,
  updatedAt: false
});

City.belongsTo(State, { foreignKey: 'state_id' });

module.exports= City;