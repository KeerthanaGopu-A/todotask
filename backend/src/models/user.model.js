const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const User = sequelize.define("User", {
    name: { type: DataTypes.STRING, allowNull: false, defaultValue: "User" },
    email: { type: DataTypes.STRING, unique: true },
    password: DataTypes.STRING
});

module.exports = User;
