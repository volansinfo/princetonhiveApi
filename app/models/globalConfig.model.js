module.exports = (sequelize, Sequelize, DataTypes) => {
    const globalConfig = sequelize.define("hiv_global_config",{
        id:{
            type:DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        hostName:{
            type: Sequelize.TEXT,
            allowNull: false,
            validate: {
                notEmpty: false,

            }
        },
        portNumber:{
            type:DataTypes.INTEGER,
            allowNull:false,
            validate:{
                notEmpty:false
            }
        },
        authUser:{
            type:Sequelize.STRING,
            allowNull:false,
            validate:{
                notEmpty:false
            }
        },
        authPassword:{
            type:Sequelize.STRING,
            allowNull:false,
            validate:{
                notEmpty:false
            }
        },
        hostType:{
            type:Sequelize.STRING,
            allowNull:false,
            validate:{
                notEmpty:false
            }
        },
        status:{
            type: Sequelize.ENUM('0','1'),
            defaultValue:'0',
            comment: "0-deactive,1-active"
        }
    })

    return globalConfig;
}