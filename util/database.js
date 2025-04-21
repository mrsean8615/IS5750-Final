const Sequelize = require("sequelize");

const sequelize = new Sequelize(
  "5750seanpayne_examproject",
  "5750seanpayne",
  "A02266800",
  {
    dialect: "mysql",
    host: "is-5750.ckm1cfmd3i4j.us-west-2.rds.amazonaws.com",
  }
);

module.exports = sequelize;
