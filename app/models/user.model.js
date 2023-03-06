module.exports = (sequelize, Sequelize, DataTypes) => {
    const User = sequelize.define("hiv_users", {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
          },
        fname:{
            type: Sequelize.STRING,
            allowNull: false,
            validate: {
                len: {
                    args: [3, 50],
                    msg: 'Please enter first name.'
                }
            }
        },

        lname:{
            type: Sequelize.STRING,
            allowNull: true
        },

        uuid: {
            type: DataTypes.STRING,
            allowNull: false,
            
        },

        password: {
             type: Sequelize.STRING,
             allowNull: false,
             validate: {
                len: {
                    args: [5, 72],
                    msg: 'Your password may be 5 to 72 characters only.'
                }
            }
        },

        actualPassword:{
            type: Sequelize.STRING,
            allowNull: true
        },

        tokenKey:{
            type: Sequelize.TEXT,
            allowNull: true
        },

        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: {
                msg: 'This email is already taken.'
            },
            validate: {
                isEmail: {
                    msg: 'Email address must be valid.'
                }
            }
        },

      mnumber:{
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
            notNull: { args: true, msg: "You must enter Phone Number" },
            len: { args: [10,10], msg: 'Phone Number is invalid' },
            isInt: { args: true, msg: "You must enter Phone Number" },
          }
    },

    address:{
        type: Sequelize.TEXT,
        allowNull: true
    },
    
    city:{
        type: Sequelize.STRING,
        allowNull: true
    },

    state:{
        type: Sequelize.STRING,
        allowNull: true
    },

    pincode:{
        type: Sequelize.STRING,
        validate: {
            isNumeric: true
          }
    },

    country:{
        type: Sequelize.STRING,
        allowNull: true
    },

    status: {
        type:   Sequelize.ENUM('0', '1'),
        defaultValue: '0',
        comment: "0-pending,1-active"
      }
     
    });
  
    return User;
  };
  