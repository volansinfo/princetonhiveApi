module.exports = (sequelize, Sequelize, DataTypes) => {
    const Question = sequelize.define("hiv_question", {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        questionName: {
            type: Sequelize.STRING,
            allowNull: false
        },

        departments: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        level: {
            type: Sequelize.ENUM('0', '1', '2'),
            defaultValue: '0',
            comment: "0-Beginner, 1-Intermediate, 2-Expert"
        },

        questionImgUrl: {
            type: Sequelize.TEXT,
            allowNull: false
        },

        status: {
            type: Sequelize.ENUM('0', '1'),
            defaultValue: '0',
            comment: "0-pending,1-active"
        }
    });

    return Question;
};
