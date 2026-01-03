const app = require("./src/app");
const sequelize = require("./src/config/database");

// Sync database and start server
sequelize.sync({ alter: true }).then(() => {
    app.listen(5000, () => console.log("Server running on port 5000"));
}).catch(err => {
    console.error("Unable to connect to the database:", err);
});
