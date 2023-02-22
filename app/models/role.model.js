module.exports = (sequelize, Sequelize, DataTypes) => {
    const Role = sequelize.define("hiv_roles", {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
            validate: {
                len: {
                    args: [3, 50],
                    msg: 'Your full name may be 3 to 50 characters only.'
                }
            }
      },
      status: {
        type:   Sequelize.ENUM('0', '1'),
        defaultValue: '0',
        comment: "0-pending,1-active"
      }
    });
  
    return Role;
  };