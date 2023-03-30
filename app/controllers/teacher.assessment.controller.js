const db = require("../models");
const TeacherAssessment = db.teacherAssessment;
const User = db.user;
const jwt = require("jsonwebtoken");
const moment = require("moment");
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

//2) Write a get API of active Ongoing Assessment (Have a permission teacher Only)

exports.getAssessmentOngoing = async (req, res) => {
  const token = req.headers["x-access-token"];
  const tokenData = jwt.decode(token);
  const userId = tokenData.id;

  const permissionRoles = await User.findOne({
    where: {
      id: userId,
    },
  });
  const roles = permissionRoles.uuid.slice(0, 3);
  if (roles != "TEA") {
    return res
      .status(401)
      .send({ status: false, message: "permission denied" });
  }
  const assessmentData = await TeacherAssessment.findAll();
  const ongoing = [];
  // console.log(assessmentData);
  for (let i = 0; i < assessmentData.length; i++) {
    const startDate = assessmentData[i].startDate;
    const endDate = assessmentData[i].endDate;
    let convertStartDate = new Date(startDate);
    let convertEndDate = new Date(endDate);
    let convertStartDateEpoch = convertStartDate.getTime() / 1000.0;
    let convertEndDateEpoch = convertEndDate.getTime() / 1000.0;
    const currentTime = Math.floor(new Date().getTime() / 1000.0);
    console.log(currentTime);
    if (currentTime <= convertEndDateEpoch) {
      console.log(convertStartDateEpoch, convertEndDateEpoch);
      ongoing.push(assessmentData[i]);
    }
  }
  return res.status(200).send({
    status: true,
    message: "Ongoing assessment",
    data: ongoing,
  });
};

// 3) Write a get API of active Upcoming Assessment (Have a permission teacher Only)

exports.getAssessmentUpcomming = async (req, res) => {
  const token = req.headers["x-access-token"];
  const tokenData = jwt.decode(token);
  const userId = tokenData.id;

  const permissionRoles = await User.findOne({
    where: {
      id: userId,
    },
  });
  const roles = permissionRoles.uuid.slice(0, 3);
  if (roles != "TEA") {
    return res
      .status(401)
      .send({ status: false, message: "permission denied" });
  }
  const assessmentData = await TeacherAssessment.findAll();
  const upcoming = [];
  // console.log(assessmentData);
  for (let i = 0; i < assessmentData.length; i++) {
    const startDate = assessmentData[i].startDate;
    const endDate = assessmentData[i].endDate;
    let convertStartDate = new Date(startDate);
    let convertEndDate = new Date(endDate);
    let convertStartDateEpoch = convertStartDate.getTime() / 1000.0;
    let convertEndDateEpoch = convertEndDate.getTime() / 1000.0;
    const currentTime = Math.floor(new Date().getTime() / 1000.0);
    console.log(currentTime);
    if (currentTime < convertStartDateEpoch) {
      console.log(convertStartDateEpoch, convertEndDateEpoch);
      upcoming.push(assessmentData[i]);
    }
  }
  return res.status(200).send({
    status: true,
    message: "upcoming assessment",
    data: upcoming,
  });
};

// 4) Write a get API of active Previous Assessment (Have a permission teacher Only)
exports.getAssessmentActiveUpcomming = async (req, res) => {
  const token = req.headers["x-access-token"];
  const tokenData = jwt.decode(token);
  const userId = tokenData.id;

  const permissionRoles = await User.findOne({
    where: {
      id: userId,
    },
  });
  const roles = permissionRoles.uuid.slice(0, 3);
  if (roles != "TEA") {
    return res
      .status(401)
      .send({ status: false, message: "permission denied" });
  }
  const assessmentData = await TeacherAssessment.findAll({
    where: {
      status: "1",
    },
  });
  const activeUpcomming = [];
  // console.log(assessmentData);
  for (let i = 0; i < assessmentData.length; i++) {
    const startDate = assessmentData[i].startDate;
    const endDate = assessmentData[i].endDate;
    let convertStartDate = new Date(startDate);
    let convertEndDate = new Date(endDate);
    let convertStartDateEpoch = convertStartDate.getTime() / 1000.0;
    let convertEndDateEpoch = convertEndDate.getTime() / 1000.0;
    const currentTime = Math.floor(new Date().getTime() / 1000.0);
    // console.log(currentTime);
    if (currentTime < convertStartDateEpoch) {
      // console.log(convertStartDateEpoch, convertEndDateEpoch);
      activeUpcomming.push(assessmentData[i]);
    }
  }
  return res.status(200).send({
    status: true,
    message: "Active upcoming assessment",
    data: activeUpcomming,
  });
};

// 5)Write the update Api of teacher assessment (Have a permission university, admin and support)

exports.updateAssessment = async () => {
  
};
