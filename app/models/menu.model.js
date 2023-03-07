module.exports = (sequelize, Sequelize, DataTypes) => {
    const Menu = sequelize.define("hiv_menus", {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        moduleName: {
            type: Sequelize.TEXT,
            allowNull: false,
            validate: {
                len: {
                    args: [1, 50],
                    msg: 'Please enter module name!'
                }
            }
        },

        displayName: {
            type: Sequelize.STRING,
            allowNull: false,
            validate: {
                len: {
                    args: [1, 50],
                    msg: 'Please enter display name!'
                }
            }
        },

        isParent: {
            type: Sequelize.ENUM('0', '1'),
            defaultValue: '0',
            comment: "0-no,1-yes"
        },

        parentId: {
            type: Sequelize.INTEGER,
            allowNull: true
        },

        iconTag: {
            type: Sequelize.TEXT,
            allowNull: true,
        },

        iconImage: {
            type: Sequelize.TEXT,
            allowNull: true
        },

        slug: {
            type: DataTypes.TEXT,
            allowNull: false,
            validate: {
                len: {
                    args: [1, 50],
                    msg: 'Please enter slug!'
                }
            }
        },

        status: {
            type: Sequelize.ENUM('0', '1'),
            defaultValue: '0',
            comment: "0-pending,1-active"
        }

    });

    return Menu;
};
