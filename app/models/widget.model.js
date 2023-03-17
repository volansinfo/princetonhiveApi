module.exports = (sequelize, Sequelize, DataTypes) => {
    const WidgetPage = sequelize.define("hiv_widgets", {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            require: false
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

        },
        status: {
            type: Sequelize.ENUM('0', '1'),
            defaultValue: '0',
            comment: "0-pending,1-active"
        }
    });
    return WidgetPage;
};