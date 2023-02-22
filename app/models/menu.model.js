module.exports = (sequelize, Sequelize, DataTypes) => {
    const Menu = sequelize.define("hiv_menus", {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
          },
          moduleName:{
            type: Sequelize.TEXT,
            allowNull: false,
            validate: {
                len: {
                    args: [3, 50],
                    msg: 'Your module name may be 3 to 50 characters only.'
                }
            }
        },

        displayName:{
            type: Sequelize.STRING,
            allowNull: false,
            validate: {
                len: {
                    args: [3, 50],
                    msg: 'Your display name may be 3 to 50 characters only.'
                }
            }
        },

        isParent: {
            type:   Sequelize.ENUM('0', '1'),
            defaultValue: '0',
            comment: "0-no,1-yes"
        },

        parentId: {
             type: Sequelize.INTEGER,
             allowNull: true
        },

        iconTag:{
            type: Sequelize.TEXT,
            allowNull: true,
        },

        iconImage:{
            type: Sequelize.TEXT,
            allowNull: true
        },

        slug: {
            type: DataTypes.TEXT,
            allowNull: false,
            validate: {
                len: {
                    args: [3, 50],
                    msg: 'Your slug may be 3 to 50 characters only.'
                }
            }
        },

    status: {
        type:   Sequelize.ENUM('0', '1'),
        defaultValue: '0',
        comment: "0-pending,1-active"
      }
     
    });
  
    return Menu;
  };
  