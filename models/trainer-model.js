const { DataTypes } = require("sequelize");
const sequelize = require("../util/database");

const Trainer = sequelize.define(
  "trainer",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    subject: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    imageUrl: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        is: {
          args: /\.(jpg|png)$/i,
          msg: "Image URL must end with jpg or png",
        },
      },
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
  },
  {
    tableName: "trainers",
    underscored: true,
  }
);

module.exports = Trainer;
