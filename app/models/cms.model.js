module.exports = (sequelize, Sequelize, DataTypes) => {
    const CmsPage = sequelize.define("hiv_cms_pages", {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        title: {
            type: Sequelize.TEXT,
            allowNull: true,
            validate: {
                notEmpty: false,

            }
        },

        description: {
            type: Sequelize.TEXT,
            allowNull: true,
            validate: {
                notEmpty: false,
            }
        },

        pageSlug: {
            type: Sequelize.TEXT,
            allowNull: true,
            validate: {
                notEmpty: false,
            }
        },

        fileSrc: {
            type: Sequelize.TEXT,
            allowNull: true,
        },

        metaTitle: {
            type: DataTypes.TEXT,
            allowNull: true,
        },

        metaDescription: {
            type: DataTypes.TEXT,
            allowNull: true,
        },

        metaKeywords: {
            type: DataTypes.TEXT,
            allowNull: true
        },

        status: {
            type: Sequelize.ENUM('0', '1'),
            defaultValue: '0',
            comment: "0-pending,1-active"
        }

    });

    return CmsPage;
};
