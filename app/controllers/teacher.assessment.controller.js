const db = require("../models");
const TeacherAssessment = db.teacherAssessment;

const createAssessment = async (req, res) => {
  try {
    const response = await TeacherAssessment.create({
      assessmentName: req.body.assessmentName,
      assessmentType: req.body.assessmentType,
      startDate: req.body.startDate,
      endDate,
      assessmentPurpose,
      assessmentAILevel,
      assessmentResponseType,
      questionId,
      studentId,
      aiParametersLevel,
      weightage,
      aiParametersIntro,
      aiParametersMainContext,
      aiParametersOutro,
      aiParametersEnvironment,
      status,
    });
  } catch (error) {
    return res.status(500).send({ status: false, message: error.message });
  }
};
