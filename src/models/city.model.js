module.exports = (sequelize, DataTypes) => {

const City = sequelize.define("City", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,       
  },
  city_name: { type: DataTypes.STRING, allowNull: false },
  state_id: { type: DataTypes.INTEGER, allowNull: false }
})

return City;

}