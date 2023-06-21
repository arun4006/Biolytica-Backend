
module.exports = (sequelize, DataTypes) => {
  const State = sequelize.define("State", {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    state_name: { type: DataTypes.STRING, allowNull: false },
  });
  return State;
};
