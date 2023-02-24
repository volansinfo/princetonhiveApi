const { sequelize, Sequelize } = require(".");

module.exports = (sequelize,Sequelize,DataTypes)=>{

    const StateCountry = sequelize.define("hiv_state_country",{
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        statename: {
            type: Sequelize.TEXT,
            allowNull: true,
            validate: {
                notEmpty: false,

            }
        },
        statecode: {
            type: Sequelize.STRING,
            allowNull: true,
            validate: {
                notEmpty: false,

            }
        },
        countryname: {
            type: Sequelize.STRING,
            allowNull: true,
            validate: {
                notEmpty: false,

            }
        },
        countrycode: {
            type: Sequelize.STRING,
            allowNull: true,
            validate: {
                notEmpty: false,

            }
        },
    });
    return StateCountry;
};