const { INTEGER } = require("sequelize")

module.exports = (sequelize, Sequelize, DataTypes) =>{
    const globalConfig = sequelize.define("hiv_global_config",{
        id:{
            type:DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        hostName:{
            type: Sequelize.TEXT,
            allowNull: true,
            validate: {
                notEmpty: false,

            }
        },
        portNumber:{
            type:DataTypes.INTEGER,
            allowNull:true,
            validate:{
                notEmpty:false
            }
        }
    })
}