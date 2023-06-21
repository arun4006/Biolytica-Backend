
module.exports = (sequelize, DataTypes) => {

  const User = sequelize.define("User", {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    name: { type: DataTypes.STRING, allowNull: false },
    email: { type: DataTypes.STRING, allowNull: false, unique: true },
    user_id: { type: DataTypes.STRING, allowNull: false, unique: true },
    hobbies: { type: DataTypes.STRING, allowNull: false },
    bio: { type: DataTypes.TEXT },
    profile_pic: { type: DataTypes.STRING, allowNull: false },
    district_id: { type: DataTypes.INTEGER, allowNull: false },
    state_id: { type: DataTypes.INTEGER, allowNull: false },
    is_admin: { type: DataTypes.BOOLEAN, defaultValue: false },
    is_deleted: { type: DataTypes.BOOLEAN, defaultValue: false },
    num_posts: { type: DataTypes.INTEGER, defaultValue: 0 }
  });

  return User;
};
