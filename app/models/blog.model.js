module.exports = (sequelize, Sequelize, DataTypes) => {
    const Blog = sequelize.define("hiv_blogs", {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        title: {
            type: Sequelize.STRING,
            allowNull: false,
            validate: {
                notEmpty: false,
            }
        },

        description: {
            type: Sequelize.TEXT,
            allowNull: false,
            validate: {
                notEmpty: false,
            }
        },

        imgUrl: {
            type: Sequelize.TEXT,
            allowNull: false,
            validate: {
                notEmpty: false,
            }
        },
        slug: {
            type: Sequelize.TEXT,
            allowNull: true,
            validate: {
                notEmpty: false,
            }
        },


        metaData: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        metaKeywords: {
            type: DataTypes.TEXT,
            allowNull: true
        },

        metaDescription: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        status: {
            type: Sequelize.ENUM('0', '1'),
            defaultValue: '0',
            comment: "0-pending,1-active"
        }

    });

    return Blog;
};

