const Sequelize = require('sequelize');
const sequelize = require("../db");


const Game = sequelize.define("Game", {
    Id: {
        type: Sequelize.DataTypes.STRING,
        primaryKey: true,
        allowNull: false
    },
    firstPlayer: {
        type: Sequelize.DataTypes.STRING,
        allowNull: true
    },
    secondPlayer: {
        type: Sequelize.DataTypes.STRING,
        allowNull: true
    }
})

module.exports = Game;