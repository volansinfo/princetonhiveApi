module.exports = (sequelize, Sequelize, DataTypes) => {
    const Assessment = sequelize.define("hiv_assessment", {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            require: false
        },
        assessmentName: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        assessmentResponseType: {
            type: Sequelize.ENUM('1', '2', '3', '4'),
            defaultValue: '1',
            comment: "1-video,2-audio,3-text,4-MCQ",
            allowNull: false,
        },
        assessmentPurpose: {
            type: Sequelize.ENUM('1', '2', '3', '4', '5'),
            defaultValue: '1',
            comment: "1-speaking,2-listening,3-reading,4-writing,5-others",
            allowNull: false,
        },
        assessmentAILevel: {
            type: Sequelize.ENUM('1', '2', '3'),
            defaultValue: '1',
            comment: "1-basic,2-intermediate,3-advanced",
            allowNull: true,
        },
        studentId:{
            type: Sequelize.INTEGER,
            allowNull: false,
        },
        teacherId:{
            type: Sequelize.INTEGER,
            allowNull: false,
        },
        status:{
            type: Sequelize.ENUM('0','1'),
            defaultValue:'0',
            comment: "0-deactive,1-active"
        }
    },{
        indexes:[
            {
                unique: false,
                fields:['studentId']
            },
            {
                unique: false,
                fields:['teacherId']
            }
        ]
    })

    return Assessment
}