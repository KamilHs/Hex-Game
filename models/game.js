const { DataTypes } = require("sequelize/types");
const sequelize = require("../db");

const Game = sequelize.define("Game", {
    Id: {
        type: DataTypes.STRING,
        primaryKey: true,
        allowNull: false
    },
    firstPlayer: {
        type: DataTypes.STRING,
        allowNull: false
    },
    secondPlayer: {
        type: DataTypes.STRING,
        allowNull: false
    }
})

module.exports = Game;