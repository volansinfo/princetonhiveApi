module.exports = (sequelize, Sequelize, DataTypes) => {
    const Menu = sequelize.define("hiv_user_permissions", {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
          },
          
        userId:{
            type: Sequelize.INTEGER,
            allowNull: false,
        },

        moduleId:{
            type: Sequelize.INTEGER,
            allowNull: false,
        },

        isAdd: {
            type:   Sequelize.ENUM('0', '1'),
            defaultValue: '0',
            comment: "0-no,1-yes"
        },

        isUpdate: {
            type:   Sequelize.ENUM('0', '1'),
            defaultValue: '0',
            comment: "0-no,1-yes"
        },

        isRead:{
            type:   Sequelize.ENUM('0', '1'),
            defaultValue: '0',
            comment: "0-no,1-yes"
        },

        isDelete:{
            type:   Sequelize.ENUM('0', '1'),
            defaultValue: '0',
            comment: "0-no,1-yes"
        },

        isStatus: {
            type:   Sequelize.ENUM('0', '1'),
            defaultValue: '0',
            comment: "0-no,1-yes"
        },

       
     
    },

    {
        indexes:[
            {
                unique: false,
                fields:['userId']
            },
            {
                unique: false,
                fields:['moduleId']
            }
        ]

    });
  
    return Menu;
  };
  