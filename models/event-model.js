const { DataTypes } = require("sequelize");
const sequelize = require("../util/database");

const Event = sequelize.define(
  "event",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    summary: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    imageUrl: {
      type: DataTypes.STRING(350),
      allowNull: false,
      validate: {
        is: {
          args: /\.(jpg|png)$/i,
          msg: "Image URL must end with jpg or png",
        },
      },
    },
    date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  },
  {
    tableName: "events",
    underscored: true,
  }
);

module.exports = Event;
