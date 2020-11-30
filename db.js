const { Sequelize } = require("sequelize");

// const sequelize = new Sequelize({
//     host: process.env.DB_HOST,
//     username: process.env.DB_USER,
//     database: process.env.DB_DATABASE,
//     password: process.env.DB_PASSWORD || "",
//     dialect: "mysql",
// });

const sequelize = new Sequelize({
    host: 'localhost',
    username: 'root',
    database: 'hex_game',
    password: '',
    dialect: "mysql",
});


module.exports = sequelize;
