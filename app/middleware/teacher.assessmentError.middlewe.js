const jwt = require("jsonwebtoken");
const db = require("../models");
const User = db.user;
const Question = db.Question;
const TeacherAssessment = db.teacherAssessment;
const errorHandingTeacherAssessment = async (req, res, next) => {
  // const dateFormate = new Date("2012/09/11");
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
  if (roles != "TEA" && roles != "UNI" && roles != "SUP" && roles != "ADM") {
    return res.status(401).send({
      status: false,
      message: "You don't have permission to add the asssessment",
    });
  }
  const findTeacherId = await TeacherAssessment.findAll();
  for (let i = 0; i < findTeacherId.length; i++) {
    if (
      findTeacherId[i].teacherId == permissionRoles.id &&
      findTeacherId[i].assessmentName == assessmentName
    ) {
      return res.status(400).send({
        status: false,
        message: "Assessment name is  already exist",
      });
    }
  }

  const isValidRequestBody = function (requestBody) {
    return Object.keys(requestBody).length > 0;
  };

  if (!isValidRequestBody(data)) {
    return res.status(400).send({ status: false, msg: "enter data in body" });
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
  } else if (!endDate) {
    return res.status(400).send({
      status: false,
      message: "Please enter end date",
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
      message: "Please enter valid assessment AI level like 1,2,3",
    });
  } else if (!assessmentResponseType) {
    return res.status(400).send({
      status: false,
      message: "Please enter assessment response type",
    });
  } else if (
    assessmentResponseType != "1" &&
    assessmentResponseType != "2" &&
    assessmentResponseType != "3" &&
    assessmentResponseType != "4"
  ) {
    return res.status(400).send({
      status: false,
      message: "Please enter valid assessment response type like 1,2,3,4",
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

  for (let i = 0; i < studentId.length; i++) {
    const studentExist = await User.findOne({
      where: {
        id: studentId[i],
      },
    });
    if (!studentExist) {
      return res
        .status(404)
        .send({ status: false, message: "Student id does not exist!" });
    }
    const uuidStudent = studentExist.uuid;
    console.log(uuidStudent.slice(0, 3) != "STU");
    if (!studentExist || uuidStudent.slice(0, 3) != "STU") {
      return res
        .status(404)
        .send({ status: false, message: "Student id does not exist!" });
    }
  }
  for (let i = 0; i < questionId.length; i++) {
    const questionExist = await Question.findOne({
      where: {
        id: questionId[i],
      },
    });
    if (!questionExist) {
      return res
        .status(404)
        .send({ status: false, message: "Question id does not exist!" });
    }
  }

  const startDateValidation = startDate.split("/").reverse().join("/");
  const endDateValidation = endDate.split("/").reverse().join("/");
  let convertStartDate = new Date(startDateValidation);
  let convertEndDate = new Date(endDateValidation);
  let convertStartDateEpoch = convertStartDate.getTime() / 1000.0;
  let convertEndDateEpoch = convertEndDate.getTime() / 1000.0;
  // const currentTime = Math.floor(new Date().getTime() / 1000.0);
  if (convertEndDateEpoch < convertStartDateEpoch) {
    return res.status(400).send({
      status: false,
      message: "Start date should not greater than end date",
    });
  }

  next();
};

const erroHandlingUpdate = async (req, res, next) => {
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
  if (roles != "UNI" && roles != "SUP" && roles != "ADM") {
    return res.status(401).send({
      status: false,
      message: "You don't have permission to update the asssessment",
    });
  }

  const isValidRequestBody = function (requestBody) {
    return Object.keys(requestBody).length > 0;
  };

  if (!isValidRequestBody(data)) {
    return res.status(400).send({ status: false, msg: "enter data in body" });
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
  } else if (!endDate) {
    return res.status(400).send({
      status: false,
      message: "Please enter end date",
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
      message: "Please enter valid assessment AI level like 1,2,3",
    });
  } else if (!assessmentResponseType) {
    return res.status(400).send({
      status: false,
      message: "Please enter assessment response type",
    });
  } else if (
    assessmentResponseType != "1" &&
    assessmentResponseType != "2" &&
    assessmentResponseType != "3" &&
    assessmentResponseType != "4"
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
  }
  for (let i = 0; i < studentId.length; i++) {
    const studentExist = await User.findOne({
      where: {
        id: studentId[i],
      },
    });
    if (!studentExist) {
      return res
        .status(404)
        .send({ status: false, message: "Student id does not exist!" });
    }
    const uuidStudent = studentExist.uuid;
    console.log(uuidStudent.slice(0, 3) != "STU");
    if (!studentExist || uuidStudent.slice(0, 3) != "STU") {
      return res
        .status(404)
        .send({ status: false, message: "Student id does not exist!" });
    }
  }
  for (let i = 0; i < questionId.length; i++) {
    const questionExist = await Question.findOne({
      where: {
        id: questionId[i],
      },
    });
    if (!questionExist) {
      return res
        .status(404)
        .send({ status: false, message: "Question id does not exist!" });
    }
  }
  const startDateValidation = startDate.split("/").reverse().join("/");
  const endDateValidation = endDate.split("/").reverse().join("/");
  let convertStartDate = new Date(startDateValidation);
  let convertEndDate = new Date(endDateValidation);
  let convertStartDateEpoch = convertStartDate.getTime() / 1000.0;
  let convertEndDateEpoch = convertEndDate.getTime() / 1000.0;
  // const currentTime = Math.floor(new Date().getTime() / 1000.0);
  if (convertEndDateEpoch < convertStartDateEpoch) {
    return res.status(400).send({
      status: false,
      message: "Start date should not greater than end date",
    });
  }
  next();
};

module.exports = {
  errorHandingTeacherAssessment,
  erroHandlingUpdate,
};
