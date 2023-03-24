module.exports = (sequelize, Sequelize, DataTypes) => {
    const Department = sequelize.define("hiv_departments", {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            require: false
        },
        departmentName: {
            type: Sequelize.TEXT,
            allowNull: true,
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
    return Department;
};