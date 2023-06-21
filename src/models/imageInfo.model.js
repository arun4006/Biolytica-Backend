
module.exports = (sequelize, DataTypes) => {

const ImageData = sequelize.define("ImageData", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  image_name: { type: DataTypes.STRING, allowNull: false },
  image_url: { type: DataTypes.STRING, allowNull: false},
  owner: { type: DataTypes.INTEGER, allowNull: false },
  location: { type: DataTypes.INTEGER, allowNull: false },
  is_deleted: {type:DataTypes.BOOLEAN, defaultValue:false}
});

return ImageData;

}