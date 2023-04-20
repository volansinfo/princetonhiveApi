module.exports = (sequelize, Sequelize, DataTypes) => {
    const studentAIReport = sequelize.define("hiv_studentAIReport", {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            require: false,
        },
        studentId: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        teacherId: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        universityId: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        studentUUID: {
            type: Sequelize.STRING,
            allowNull: false
        },
        videoPath: {
            type: Sequelize.STRING,
            allowNull: true
        },
        videoUrl: {
            type: Sequelize.STRING,
            allowNull: true
        },
        totalAverage: {
            type: Sequelize.STRING,
            allowNull: true
        },
        reportDetails: {
            type: Sequelize.TEXT,
            allowNull: true
        },
        aiReport: {
            type: Sequelize.TEXT,
            allowNull: false
        },
        status: {
            type: Sequelize.ENUM("0", "1"),
            defaultValue: "0",
            comment: "0-deactive,1-active",

        }

    }, {
        indexes: [
            {
                unique: false,
                fields: ["studentId"],
            },
            {
                unique: false,
                fields: ["teacherId"],
            },
            {
                unique: false,
                fields: ["universityId"],
            }
        ]
    })

    return studentAIReport
}