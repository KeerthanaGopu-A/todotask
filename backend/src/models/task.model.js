const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const User = require("./user.model");

const Task = sequelize.define("Task", {
    title: DataTypes.STRING,
    status: {
        type: DataTypes.ENUM("Todo", "In Progress", "Completed"),
        defaultValue: "Todo"
    },
    dueDate: {
        type: DataTypes.DATEONLY,
        allowNull: true
    },
    priority: {
        type: DataTypes.ENUM("Low", "Medium", "High"),
        defaultValue: "Medium"
    }
});

User.hasMany(Task);
Task.belongsTo(User);

module.exports = Task;
