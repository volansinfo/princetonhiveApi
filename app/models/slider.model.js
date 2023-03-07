module.exports = (sequelize, Sequelize, DataTypes) => {
    const Slider = sequelize.define("hiv_slider", {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        title: {
            type: Sequelize.STRING,
            allowNull: false,
            validate: {
                len: {
                    args: [1, 500],
                    msg: 'Please enter the title!'
                }
            }
        },

        path: {
            type: Sequelize.TEXT,
            allowNull: true
        },

        fileSrc: {
            type: Sequelize.TEXT,
            allowNull: false,
            validate: {
                notEmpty: false,
                len: {
                    args: [2, 2000],
                    msg: 'The type of the uploaded file should be an image!'
                }
            }
        },

        urlLink: {
            type: Sequelize.TEXT,
            allowNull: true
        },

        status: {
            type: Sequelize.ENUM('0', '1'),
            defaultValue: '0',
            comment: "0-pending,1-active"
        }

    });

    return Slider;
};
