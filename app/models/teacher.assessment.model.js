module.exports = (sequelize, Sequelize, DataTypes) => {
  const TeacherAssessment = sequelize.define("hiv_teacherAssessment", {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      require: false,
    },
    assessmentName: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    assessmentType: {
      type: Sequelize.ENUM("1", "2"),
      comment: "1-assessment,2-practice",
      allowNull: false,
    },
    description: {
      type: Sequelize.TEXT,
      allowNull: true,
    },
    startDate: {
      type: Sequelize.DATEONLY,
      allowNull: false,
    },
    endDate: {
      type: Sequelize.DATEONLY,
      allowNull: false,
    },
    assessmentPurpose: {
      type: Sequelize.ENUM("1", "2", "3", "4", "5"),
      comment: "1-Speaking,2-Listening,3-Reading,4-Writing,5-Others",
      allowNull: false,
    },
    assessmentAILevel: {
      type: Sequelize.ENUM("1", "2", "3"),
      comment: "1-Basic,2-Intermediate,3-Advanced",
      allowNull: false,
    },
    assessmentResponseType: {
      type: Sequelize.ENUM("1", "2", "3", "4"),
      comment: "1-Video,2-Audio,3-Text,4MCQ",
      allowNull: false,
    },
    questionId: {
      type: Sequelize.TEXT,
      allowNull: false,
    },
    studentId: {
      type: Sequelize.TEXT,
      allowNull: false,
    },
    aiParametersLevel: {
      type: Sequelize.ENUM("1", "2", "3"),
      comment: "1-beginner,2-intermediate,3-expert",
      allowNull: false,
    },
    weightage: {
      type: Sequelize.ENUM("1", "2", "3", "4"),
      comment: "1-intro,2-mainContext,3-environment,4-outro",
      allowNull: false,
    },
    aiParametersIntro: {
      type: Sequelize.TEXT,
      allowNull: false,
    },
    aiParametersMainContext: {
      type: Sequelize.TEXT,
      allowNull: false,
    },
    aiParametersOutro: {
      type: Sequelize.TEXT,
      allowNull: false,
    },
    aiParametersEnvironment: {
      type: Sequelize.TEXT,
      allowNull: false,
    },
    status: {
      type: Sequelize.ENUM("0", "1"),
      comment: "0-pending,1-active",
      defaultValue: "0",
    },
  });
  return TeacherAssessment;
};
