module.exports = (sequelize, Sequelize, DataTypes) => {
    const User = sequelize.define("hiv_users", {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        fname: {
            type: Sequelize.STRING,
            allowNull: false,
        },

        lname: {
            type: Sequelize.STRING,
            allowNull: true
        },
        profileImg: {
            type: Sequelize.TEXT,
            allowNull: true,
        },


        uuid: {
            type: DataTypes.STRING,
            allowNull: false,

        },

        password: {
            type: Sequelize.STRING,
            allowNull: true,
            require: false,
            validate: {
                len: {
                    args: [5, 72],
                    msg: 'Your password may be 5 to 72 characters only.'
                }
            }
        },

        actualPassword: {
            type: Sequelize.STRING,
            allowNull: true,
            require: false

        },

        tokenKey: {
            type: Sequelize.TEXT,
            allowNull: true
        },

        email: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        gender: {
            type: Sequelize.ENUM('1', '2', '3'),
            comment: "1-male,2-female,3-other",
            allowNull: false
        },
        dob: {
            type: Sequelize.DATEONLY
        },
        mnumber: {
            type: Sequelize.STRING,
            allowNull: false,
        },

        address: {
            type: Sequelize.TEXT,
            allowNull: true
        },

        city: {
            type: Sequelize.STRING,
            allowNull: true
        },

        state: {
            type: Sequelize.STRING,
            allowNull: true
        },

        pincode: {
            type: Sequelize.STRING,
        },

        country: {
            type: Sequelize.STRING,
            allowNull: true
        },

        status: {
            type: Sequelize.ENUM('0', '1'),
            defaultValue: '0',
            comment: "0-pending,1-active"
        }

    });

    return User;
};
