const jwt = require("jsonwebtoken");
const db = require("../models");
const User = db.user;
const errorHandingTeacherAssessment = async (req, res, next) => {
  const dateFormate = new Date("2012/09/11");
  const data = req.body;
  const {
    assessmentName,
    assessmentType,
    startDate,
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
  } = data;

  const token = req.headers["x-access-token"];
  const tokenData = jwt.decode(token);
  const userId = tokenData.id;

  const permissionRoles = await User.findOne({
    where: {
      id: userId,
    },
  });
  const roles = permissionRoles.uuid.slice(0, 3);
  if (roles != "TEA" || roles != "UNI" || roles != "SUP" || roles != "ADM") {
    return res
      .status(401)
      .send({ status: false, message: "permission denied" });
  }
  if (!assessmentName) {
    return res
      .status(400)
      .send({ status: false, message: "Please enter assessment name" });
  } else if (!assessmentType) {
    return res
      .status(400)
      .send({ status: false, message: "Please enter assessment type" });
  } else if (assessmentType != "1" && assessmentType != "2") {
    return res.status(400).send({
      status: false,
      message: "Please enter valid assessment type like 1,2",
    });
  } else if (!startDate) {
    return res.status(400).send({
      status: false,
      message: "Please enter start date",
    });
  } else if (startDate != dateFormate) {
    return res.status(400).send({
      status: false,
      message: "Please enter valid start date in formate yyyy/mm/dd",
    });
  } else if (!endDate) {
    return res.status(400).send({
      status: false,
      message: "Please enter end date",
    });
  } else if (endDate != dateFormate) {
    return res.status(400).send({
      status: false,
      message: "Please enter valid end date in formate yyyy/mm/dd",
    });
  } else if (!assessmentPurpose) {
    return res.status(400).send({
      status: false,
      message: "Please enter assessment purpose",
    });
  } else if (
    assessmentPurpose != "1" &&
    assessmentPurpose != "2" &&
    assessmentPurpose != "3" &&
    assessmentPurpose != "4" &&
    assessmentPurpose != "5"
  ) {
    return res.status(400).send({
      status: false,
      message: "Please enter valid assessment purpose like 1,2,3,4,5",
    });
  } else if (!assessmentAILevel) {
    return res.status(400).send({
      status: false,
      message: "Please enter assessment AI level",
    });
  } else if (
    assessmentAILevel != "1" &&
    assessmentAILevel != "2" &&
    assessmentAILevel != "3"
  ) {
    return res.status(400).send({
      status: false,
      message: "Please enter assessment AI level",
    });
  } else if (!assessmentResponseType) {
    return res.status(400).send({
      status: false,
      message: "Please enter assessment AI level",
    });
  } else if (
    assessmentResponseType != "1" &&
    assessmentResponseType != "2" &&
    assessmentResponseType != "3"
  ) {
    return res.status(400).send({
      status: false,
      message: "Please enter valid assessment response type like 1,2,3",
    });
  } else if (!questionId) {
    return res.status(400).send({
      status: false,
      message: "Please enter questionId",
    });
  } else if (!studentId) {
    return res.status(400).send({
      status: false,
      message: "Please enter studentId",
    });
  } else if (!aiParametersLevel) {
    return res.status(400).send({
      status: false,
      message: "Please enter AI parameters level",
    });
  } else if (
    aiParametersLevel != "1" &&
    aiParametersLevel != "2" &&
    aiParametersLevel != "3"
  ) {
    return res.status(400).send({
      status: false,
      message: "Please enter valid AI parameters level likes 1,2,3,4",
    });
  } else if (!weightage) {
    return res.status(400).send({
      status: false,
      message: "Please enter weightage",
    });
  } else if (
    weightage != "1" &&
    weightage != "2" &&
    weightage != "3" &&
    weightage != "4"
  ) {
    return res.status(400).send({
      status: false,
      message: "Please enter valid weightage likes 1,2,3,4",
    });
  } else if (!aiParametersIntro) {
    return res.status(400).send({
      status: false,
      message: "Please enter ai parameters intro",
    });
  } else if (!aiParametersMainContext) {
    return res.status(400).send({
      status: false,
      message: "Please enter ai parameters main context",
    });
  } else if (!aiParametersOutro) {
    return res.status(400).send({
      status: false,
      message: "Please enter ai parameters outro",
    });
  } else if (!aiParametersEnvironment) {
    return res.status(400).send({
      status: false,
      message: "Please enter ai parameters environment",
    });
  } else if (!status) {
    return res.status(400).send({
      status: false,
      message: "Please enter status",
    });
  } else if (status != "1" && status != "0") {
    return res.status(400).send({
      status: false,
      message: "Please enter valid status like 0,1",
    });
  }
  next();
};

module.exports = {
  errorHandingTeacherAssessment,
};
