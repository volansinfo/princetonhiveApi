module.exports = (sequelize, Sequelize, DataTypes) => {
    const Gallery = sequelize.define("hiv_gallery", {
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
        imgUrl: {
            type: Sequelize.TEXT,
            allowNull: false,
            validate: {
                notEmpty: false,
            }
        },

        galleryType: {
            type: Sequelize.ENUM('1', '2'),
            comment: "1-photo,2-video",
            allowNull: false,
            validate: {
                notEmpty: false,
            }
        },

        status: {
            type: Sequelize.ENUM('0', '1'),
            defaultValue: '0',
            comment: "0-pending,1-active"
        }

    });

    return Gallery;
};

