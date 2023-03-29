const db = require("../models");
const TeacherAssessment = db.teacherAssessment;

exports.createAssessment = async (req, res) => {
  try {
    const response = await TeacherAssessment.create({
      assessmentName: req.body.assessmentName,
      assessmentType: req.body.assessmentType,
      startDate: req.body.startDate,
      endDate: req.body.endDate,
      assessmentPurpose: req.body.assessmentPurpose,
      assessmentAILevel: req.body.assessmentAILevel,
      assessmentResponseType: req.body.assessmentResponseType,
      questionId: req.body.questionId,
      studentId: req.body.studentId,
      aiParametersLevel: req.body.aiParametersLevel,
      weightage: req.body.weightage,
      aiParametersIntro: req.body.aiParametersIntro,
      aiParametersMainContext: req.body.aiParametersMainContext,
      aiParametersOutro: req.body.aiParametersOutro,
      aiParametersEnvironment: req.body.aiParametersEnvironment,
      status: req.body.status,
    });
    return res
      .status(200)
      .send({ status: true, message: "created successfully", response });
  } catch (error) {
    return res.status(500).send({ status: false, message: error.message });
  }
};
