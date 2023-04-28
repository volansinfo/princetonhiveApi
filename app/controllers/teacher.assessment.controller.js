const db = require("../models");
const TeacherAssessment = db.teacherAssessment;
const User = db.user;
const Role = db.role;
const pagination = require("../middleware/pagination");
const jwt = require("jsonwebtoken");
const { Sequelize } = require("sequelize");

exports.createAssessment = async (req, res) => {
  try {
    const token = req.headers["x-access-token"];
    const decodeToken = jwt.decode(token);
    const teacherId = decodeToken.id;
    const teacherExist = await User.findOne({
      where: {
        id: teacherId,
      },
    });
    const response = await TeacherAssessment.create({
      assessmentName: req.body.assessmentName,
      assessmentType: req.body.assessmentType,
      startDate: req.body.startDate.split("/").reverse().join("/"),
      endDate: req.body.endDate.split("/").reverse().join("/"),
      description: req.body.description,
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
      teacherId:
        teacherExist.uuid.slice(0, 3) == "TEA" ? teacherExist.id : null,
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
  try {
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
      return res.status(401).send({
        status: false,
        message: "You don't have permission to access the asssessment",
      });
    }
    const assessmentData = await TeacherAssessment.findAll({
      where: {
        teacherId: JSON.stringify(permissionRoles.id),
        status: "1",
      },
      order: [["id", "DESC"]],
    });
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
      // console.log(currentTime);
      if (
        currentTime >= convertStartDateEpoch &&
        currentTime <= convertEndDateEpoch
      ) {
        // console.log(convertStartDateEpoch, convertEndDateEpoch);
        ongoing.push(assessmentData[i]);
      }
    }
    const page = parseInt(req.query.page) || 0;
    const limit = 10;

    const startIndex = page * limit;
    const endIndex = (page + 1) * limit;
    console.log(ongoing);
    const results = {};
    results.dataItems = ongoing.slice(startIndex, endIndex);
    results.totalItems = ongoing.length;
    results.currentPage = parseInt(req.query.page) || 0;
    results.totalPages = Math.ceil(ongoing.length / limit);
    if (results.dataItems.length <= 0) {
      return res.status(200).send({
        status: false,
        message: "No ongoing assessment found",
        data: results,
      });
    }
    return res.status(200).send({
      status: true,
      message: "All ongoing assessment found",
      data: results,
    });
  } catch (error) {
    return res.status(500).send({ message: error.message });
  }
};

// 3) Write a get API of active Upcoming Assessment (Have a permission teacher Only)

exports.getAssessmentUpcomming = async (req, res) => {
  try {
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
      return res.status(401).send({
        status: false,
        message: "You don't have permission to access the asssessment",
      });
    }
    const assessmentData = await TeacherAssessment.findAll({
      where: { teacherId: JSON.stringify(permissionRoles.id), status: "1" },
      order: [["id", "DESC"]],
    });
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
      // console.log(currentTime);
      if (
        currentTime < convertStartDateEpoch &&
        currentTime <= convertEndDateEpoch
      ) {
        // console.log(convertStartDateEpoch, convertEndDateEpoch);
        upcoming.push(assessmentData[i]);
      }
    }
    const page = parseInt(req.query.page) || 0;
    const limit = 10;

    const startIndex = page * limit;
    const endIndex = (page + 1) * limit;
    console.log(upcoming);
    const results = {};
    results.dataItems = upcoming.slice(startIndex, endIndex);
    results.totalItems = upcoming.length;
    results.currentPage = parseInt(req.query.page) || 0;
    results.totalPages = Math.ceil(upcoming.length / limit);
    if (results.dataItems.length <= 0) {
      return res.status(200).send({
        status: false,
        message: "There are no upcoming assessment.",
        data: results,
      });
    }
    return res.status(200).send({
      status: true,
      message: "All upcoming assessment found",
      data: results,
    });
  } catch (error) {
    return res.status(500).send({ message: error.message });
  }
};

// 4) Write a get API of active Previous Assessment (Have a permission teacher Only)
exports.getAssessmentPreviousActive = async (req, res) => {
  try {
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
      return res.status(401).send({
        status: false,
        message: "You don't have permission to access the asssessment",
      });
    }
    const assessmentData = await TeacherAssessment.findAll({
      where: {
        status: "1",
        teacherId: JSON.stringify(permissionRoles.id),
      },
      order: [["id", "DESC"]],
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
      if (
        currentTime > convertStartDateEpoch &&
        convertEndDateEpoch < currentTime
      ) {
        // console.log(convertStartDateEpoch, convertEndDateEpoch);
        activeUpcomming.push(assessmentData[i]);
      }
    }
    const page = parseInt(req.query.page) || 0;
    const limit = parseInt(req.query.limit) || 10;

    const startIndex = page * limit;
    const endIndex = (page + 1) * limit;

    const results = {};
    results.dataItems = activeUpcomming.slice(startIndex, endIndex);
    results.totalItems = activeUpcomming.length;
    results.currentPage = parseInt(req.query.page) || 0;
    results.totalPages = Math.ceil(activeUpcomming.length / limit);
    if (results.dataItems.length <= 0) {
      return res.status(200).send({
        status: false,
        message: "No previous assessment found",
        data: results,
      });
    }
    return res.status(200).send({
      status: true,
      message: "All active previous assessment found",
      data: results,
    });
  } catch (error) {
    return res.status(500).send({ message: error.message });
  }
};

// 5)Write the update Api of teacher assessment (Have a permission university, admin and support) {on workin after some time}

exports.updateAssessment = async (req, res) => {
  try {
    const assessmentId = req.params.id;
    const token = req.headers["x-access-token"];
    const tokenData = jwt.decode(token);
    const userId = tokenData.id;

    const permissionRoles = await User.findOne({
      where: {
        id: userId,
      },
    });
    const roles = permissionRoles.uuid.slice(0, 3);
    if (roles != "UNI" && roles != "ADM" && roles != "SUP") {
      return res.status(401).send({
        status: false,
        message: "You don't have permission to update the assessment",
      });
    }
    const existAssessment = await TeacherAssessment.findOne({
      where: {
        id: assessmentId,
      },
    });
    if (!existAssessment) {
      return res
        .status(404)
        .send({ status: false, message: "Assessment does not found" });
    }

    const response = await TeacherAssessment.update(
      {
        assessmentName: req.body.assessmentName,
        assessmentType: req.body.assessmentType,
        startDate: req.body.startDate.split("/").reverse().join("/"),
        endDate: req.body.endDate.split("/").reverse().join("/"),
        description: req.body.description,
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
      },
      { where: { id: assessmentId } }
    );
    return res.status(200).send({
      status: true,
      message: "Updated assessment successfully",
      response,
    });
  } catch (error) {
    console.log(error);
    return res.status(400).send({ status: false, message: error.message });
  }
};

// 6) Write the status update Api (Have a permission university, admin and support)
exports.updateStatus = async (req, res) => {
  try {
    const data = req.body;
    const { status } = data;
    const assessmentId = req.params.id;
    const token = req.headers["x-access-token"];
    const tokenData = jwt.decode(token);
    const userId = tokenData.id;

    const permissionRoles = await User.findOne({
      where: {
        id: userId,
      },
    });
    const roles = permissionRoles.uuid.slice(0, 3);
    if (roles != "UNI" && roles != "ADM" && roles != "SUP") {
      return res.status(401).send({
        status: false,
        message: "You don't have permission to update the status",
      });
    }

    const isValidRequestBody = function (requestBody) {
      return Object.keys(requestBody).length > 0;
    };

    if (!isValidRequestBody(data)) {
      return res
        .status(400)
        .send({ status: false, msg: "Please enter data in body" });
    } else if (!status) {
      return res
        .status(400)
        .send({ status: false, msg: "Please enter status " });
    } else if (status != "0" && status != "1") {
      return res
        .status(400)
        .send({ status: false, msg: "Please enter status 0 or 1" });
    }
    const existAssessment = await TeacherAssessment.findOne({
      where: {
        id: assessmentId,
      },
    });
    if (!existAssessment) {
      return res
        .status(404)
        .send({ status: false, message: "Assessment does not found" });
    }
    if (status == "1") {
      const response = await TeacherAssessment.update(
        {
          status: status,
        },
        {
          where: { id: assessmentId },
        }
      );
      return res.status(200).send({
        status: true,
        message: "status has been enable",
      });
    } else {
      const responce = await TeacherAssessment.update(
        {
          status: status,
        },
        {
          where: { id: assessmentId },
        }
      );
      return res.status(200).send({
        status: true,
        message: "status has been disabled",
      });
    }
  } catch (error) {
    return res.status(500).send({ message: error.message });
  }
};

// 7) Write the delete api (Have a permission university, admin and support)

exports.deleteAssessment = async (req, res) => {
  try {
    const assessmentId = req.params.id;
    const token = req.headers["x-access-token"];
    const tokenData = jwt.decode(token);
    const userId = tokenData.id;

    const permissionRoles = await User.findOne({
      where: {
        id: userId,
      },
    });
    const roles = permissionRoles.uuid.slice(0, 3);
    if (roles != "UNI" && roles != "ADM" && roles != "SUP") {
      return res.status(401).send({
        status: false,
        message: "You don't have permission to delete the assessment",
      });
    }

    const existAssessment = await TeacherAssessment.findOne({
      where: {
        id: assessmentId,
      },
    });
    if (!existAssessment) {
      return res
        .status(404)
        .send({ status: false, message: "Assessment does not found" });
    }

    const response = await TeacherAssessment.destroy({
      where: {
        id: assessmentId,
      },
    });
    return res.status(200).send({
      status: true,
      message: "Assessment deleted successfully",
    });
  } catch (error) {
    return res.status(500).send({ message: error.message });
  }
};

// 9 Write a Api get all teacher Assessment (Have a permission admin)

exports.getAllAssessment = async (req, res) => {
  try {
    const token = req.headers["x-access-token"];
    const tokenData = jwt.decode(token);
    const userId = tokenData.id;

    const permissionRoles = await User.findOne({
      where: {
        id: userId,
      },
    });
    const roles = permissionRoles.uuid.slice(0, 3);
    if (roles != "ADM") {
      return res.status(401).send({
        status: false,
        message: "You don't have permission to access the asssessment",
      });
    }

    const assessmentData = await TeacherAssessment.findAll({
      order: [["id", "DESC"]],
    });
    const page = parseInt(req.query.page) || 0;
    const limit = parseInt(req.query.limit) || 10;

    const startIndex = page * limit;
    const endIndex = (page + 1) * limit;

    const results = {};
    results.dataItems = assessmentData.slice(startIndex, endIndex);
    results.totalItems = assessmentData.length;
    results.currentPage = parseInt(req.query.page) || 0;
    results.totalPages = Math.ceil(assessmentData.length / limit);
    if (results.dataItems.length <= 0) {
      return res.status(200).send({
        status: false,
        message: "No assessment found",
        data: results,
      });
    }
    return res.status(200).send({
      status: true,
      message: "All assessment",
      data: results,
    });
  } catch (error) {
    return res.status(500).send({ message: error.message });
  }
};

// 10)Write a API total number of active Assigned Assesments which is used by teacher Id

exports.getAllActiveAssignedAssessment = async (req, res) => {
  try {
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
      return res.status(401).send({
        status: false,
        message: "You don't have permission to access the asssessment",
      });
    }

    const assessmentData = await TeacherAssessment.findAll({
      where: {
        teacherId: JSON.stringify(userId),
        status: "1",
      },
      order: [["id", "DESC"]],
    });
    const page = parseInt(req.query.page) || 0;
    const limit = parseInt(req.query.limit) || 10;

    const startIndex = page * limit;
    const endIndex = (page + 1) * limit;

    const results = {};
    results.dataItems = assessmentData.slice(startIndex, endIndex);
    results.totalItems = assessmentData.length;
    results.currentPage = parseInt(req.query.page) || 0;
    results.totalPages = Math.ceil(assessmentData.length / limit);
    if (results.dataItems.length <= 0) {
      return res.status(200).send({
        status: false,
        message: "No assessment found",
        data: results,
      });
    }
    return res.status(200).send({
      status: true,
      message: "All assessment",
      data: results,
    });
  } catch (error) {
    return res.status(500).send({ message: error.message });
  }
};

// 11)Write a API total number of active Assesments which is used by teacher Id

exports.getAllActiveAssessment = async (req, res) => {
  try {
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
      return res.status(401).send({
        status: false,
        message: "You don't have permission to access the asssessment",
      });
    }

    const assessmentData = await TeacherAssessment.findAll({
      where: {
        teacherId: JSON.stringify(userId),
        assessmentType: "1",
        status: "1",
      },
      order: [["id", "DESC"]],
    });
    const page = parseInt(req.query.page) || 0;
    const limit = parseInt(req.query.limit) || 10;

    const startIndex = page * limit;
    const endIndex = (page + 1) * limit;

    const results = {};
    results.dataItems = assessmentData.slice(startIndex, endIndex);
    results.totalItems = assessmentData.length;
    results.currentPage = parseInt(req.query.page) || 0;
    results.totalPages = Math.ceil(assessmentData.length / limit);
    if (results.dataItems.length <= 0) {
      return res.status(200).send({
        status: false,
        message: "No assessment found",
        data: results,
      });
    }
    return res.status(200).send({
      status: true,
      message: "All assessment active",
      data: results,
    });
  } catch (error) {
    return res.status(500).send({ message: error.message });
  }
};

// 12)Write a API total number of active Practice Assesments which is used by teacher Id

exports.getAllActivePracticeAssessment = async (req, res) => {
  try {
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
      return res.status(401).send({
        status: false,
        message: "You don't have permission to access the asssessment",
      });
    }

    const assessmentData = await TeacherAssessment.findAll({
      where: {
        teacherId: JSON.stringify(userId),
        assessmentType: "2",
        status: "1",
      },
      order: [["id", "DESC"]],
    });
    console.log(assessmentData);
    const page = parseInt(req.query.page) || 0;
    const limit = parseInt(req.query.limit) || 10;

    const startIndex = page * limit;
    const endIndex = (page + 1) * limit;

    const results = {};
    results.dataItems = assessmentData.slice(startIndex, endIndex);
    results.totalItems = assessmentData.length;
    results.currentPage = parseInt(req.query.page) || 0;
    results.totalPages = Math.ceil(assessmentData.length / limit);
    if (results.dataItems.length <= 0) {
      return res.status(200).send({
        status: false,
        message: "No assessment found",
        data: results,
      });
    }
    return res.status(200).send({
      status: true,
      message: "All assessment",
      data: results,
    });
  } catch (error) {
    return res.status(500).send({ message: error.message });
  }
};

//14) Write a search teacher assessment Api which is using the key assessmentType and  End Date .

function dateFormate(date) {
  let convertUpdateAtDate = new Date(date);

  let convertUpdateAtEpoch = convertUpdateAtDate.getTime() / 1000.0;
  const inDate = new Date(convertUpdateAtEpoch * 1000);
  let actualDate = inDate.toGMTString();
  return actualDate;
}

exports.teacherSearchQuery = async (req, res) => {
  try {
    const rangeDataDatee = [];
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
      return res.status(401).send({
        status: false,
        message: "You don't have permission to access the asssessment",
      });
    }
    const { limit, offset } = pagination.getPagination(req.query.page, 10);
    const data = req.query;
    const { assessmentType, assessmentPurpose, startDate, endDate } = data;
    if (!assessmentType) {
      return res
        .status(400)
        .send({ status: false, message: "Please enter assessment type" });
    } else if (assessmentType != "1" && assessmentType != "2") {
      return res.status(400).send({
        status: false,
        message: "Please enter valid assessment type like 1,2",
      });
    } else if (
      assessmentPurpose &&
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
    } else if (endDate && !startDate) {
      return res.status(400).send({
        status: false,
        message: "Please select start date also",
      });
    }

    let convertStartDate = new Date(startDate?.split("/").reverse().join("-"));
    let convertEndDate = new Date(endDate?.split("/").reverse().join("-"));
    let convertStartDateEpoch = convertStartDate.getTime() / 1000.0;
    let convertEndDateEpoch = convertEndDate.getTime() / 1000.0;
    // const currentTime = Math.floor(new Date().getTime() / 1000.0);
    if (convertEndDateEpoch < convertStartDateEpoch) {
      return res.status(400).send({
        status: false,
        message: "Start date should not greater than end date",
      });
    }

    function endDateItems(items) {
      if (items) {
        return items;
      } else {
        return null;
      }
    }
    function assessmentPurposeItems(items) {
      if (items) {
        return items;
      } else {
        return null;
      }
    }
    function startDateItems(items) {
      if (items) {
        return items;
      } else {
        return null;
      }
    }

    if (assessmentPurpose && assessmentType && startDate && endDate) {
      let startDateFormate = startDate.split("/").reverse().join("-");
      console.log(typeof startDateFormate, typeof startDate, "PALKJ");
      let endDateFormate = endDate.split("/").reverse().join("-");
      const results = await TeacherAssessment.findAll({
        where: {
          assessmentType: assessmentType,
          assessmentPurpose: assessmentPurpose,
          teacherId: JSON.stringify(userId),

          status: "1",
        },
      });
      for (let i = 0; i < results.length; i++) {
        if (
          results[i].endDate <= endDateFormate &&
          startDateFormate <= results[i].startDate
        ) {
          let convertUpdateAtDate = new Date(results[i].updatedAt);

          let convertUpdateAtEpoch = convertUpdateAtDate.getTime() / 1000.0;
          const date = new Date(convertUpdateAtEpoch * 1000);
          let actualDate = date.toGMTString();
          rangeDataDatee.push({
            id: results[i].id,
            assessmentName: results[i].assessmentName,
            assessmentType: results[i].assessmentType,
            description: results[i].description,
            startDate: results[i].startDate.split("-").reverse().join("/"),
            endDate: results[i].endDate.split("-").reverse().join("/"),
            assessmentPurpose: results[i].assessmentPurpose,
            assessmentAILevel: results[i].assessmentAILevel,
            assessmentResponseType: results[i].assessmentResponseType,
            questionId: results[i].questionId,
            studentId: results[i].studentId,
            aiParametersLevel: results[i].aiParametersLevel,
            weightage: results[i].weightage,
            aiParametersIntro: results[i].aiParametersIntro,
            aiParametersMainContext: results[i].aiParametersMainContext,
            aiParametersOutro: results[i].aiParametersOutro,
            aiParametersEnvironment: results[i].aiParametersEnvironment,
            teacherId: results[i].teacherId,
            status: results[i].status,
            createdAt: dateFormate(results[i].createdAt),
            updatedAt: actualDate,
          });
        }
      }
      const page = parseInt(req.query.page) || 0;
      const limit = parseInt(req.query.limit) || 10;

      const startIndex = page * limit;
      const endIndex = (page + 1) * limit;

      const data = {};
      data.dataItems = rangeDataDatee.slice(startIndex, endIndex);
      data.totalItems = rangeDataDatee.length;
      data.currentPage = parseInt(req.query.page) || 0;
      data.totalPages = Math.ceil(rangeDataDatee.length / limit);
      if (data.dataItems.length <= 0) {
        return res.status(200).send({
          status: true,
          message: "Assessment not found ",
          data: data,
        });
      }
      return res.status(200).send({
        status: true,
        message: "Assessment found successfully ",
        data: data,
      });
    } else if (assessmentType && startDate && endDate && !assessmentPurpose) {
      let startDateFormate = startDate.split("/").reverse().join("-");

      let endDateFormate = endDate.split("/").reverse().join("-");
      const results = await TeacherAssessment.findAll({
        where: {
          assessmentType: assessmentType,
          teacherId: JSON.stringify(userId),

          status: "1",
        },
      });
      for (let i = 0; i < results.length; i++) {
        if (
          results[i].endDate <= endDateFormate &&
          startDateFormate <= results[i].startDate
        ) {
          let convertUpdateAtDate = new Date(results[i].updatedAt);

          let convertUpdateAtEpoch = convertUpdateAtDate.getTime() / 1000.0;
          const date = new Date(convertUpdateAtEpoch * 1000);
          let actualDate = date.toGMTString();
          rangeDataDatee.push({
            id: results[i].id,
            assessmentName: results[i].assessmentName,
            assessmentType: results[i].assessmentType,
            description: results[i].description,
            startDate: results[i].startDate.split("-").reverse().join("/"),
            endDate: results[i].endDate.split("-").reverse().join("/"),
            assessmentPurpose: results[i].assessmentPurpose,
            assessmentAILevel: results[i].assessmentAILevel,
            assessmentResponseType: results[i].assessmentResponseType,
            questionId: results[i].questionId,
            studentId: results[i].studentId,
            aiParametersLevel: results[i].aiParametersLevel,
            weightage: results[i].weightage,
            aiParametersIntro: results[i].aiParametersIntro,
            aiParametersMainContext: results[i].aiParametersMainContext,
            aiParametersOutro: results[i].aiParametersOutro,
            aiParametersEnvironment: results[i].aiParametersEnvironment,
            teacherId: results[i].teacherId,
            status: results[i].status,
            createdAt: dateFormate(results[i].createdAt),
            updatedAt: actualDate,
          });
        }
      }
      const page = parseInt(req.query.page) || 0;
      const limit = parseInt(req.query.limit) || 10;

      const startIndex = page * limit;
      const endIndex = (page + 1) * limit;

      const data = {};
      data.dataItems = rangeDataDatee.slice(startIndex, endIndex);
      data.totalItems = rangeDataDatee.length;
      data.currentPage = parseInt(req.query.page) || 0;
      data.totalPages = Math.ceil(rangeDataDatee.length / limit);
      if (data.dataItems.length <= 0) {
        return res.status(200).send({
          status: true,
          message: "Assessment not found ",
          data: data,
        });
      }
      return res.status(200).send({
        status: true,
        message: "Assessment found successfully ",
        data: data,
      });
    } else if (startDate && assessmentPurpose && assessmentType) {
      const data = [];
      const results = await TeacherAssessment.findAll({
        where: {
          teacherId: JSON.stringify(userId),
          status: "1",
          assessmentType: assessmentType,

          startDate: startDate?.split("/").reverse().join("-"),
          assessmentPurpose: assessmentPurpose,
        },
      });
      for (let i = 0; i < results.length; i++) {
        let convertUpdateAtDate = new Date(results[i].updatedAt);

        let convertUpdateAtEpoch = convertUpdateAtDate.getTime() / 1000.0;
        const date = new Date(convertUpdateAtEpoch * 1000);
        let actualDate = date.toGMTString();
        data.push({
          id: results[i].id,
          assessmentName: results[i].assessmentName,
          assessmentType: results[i].assessmentType,
          description: results[i].description,
          startDate: results[i].startDate.split("-").reverse().join("/"),
          endDate: results[i].endDate.split("-").reverse().join("/"),
          assessmentPurpose: results[i].assessmentPurpose,
          assessmentAILevel: results[i].assessmentAILevel,
          assessmentResponseType: results[i].assessmentResponseType,
          questionId: results[i].questionId,
          studentId: results[i].studentId,
          aiParametersLevel: results[i].aiParametersLevel,
          weightage: results[i].weightage,
          aiParametersIntro: results[i].aiParametersIntro,
          aiParametersMainContext: results[i].aiParametersMainContext,
          aiParametersOutro: results[i].aiParametersOutro,
          aiParametersEnvironment: results[i].aiParametersEnvironment,
          teacherId: results[i].teacherId,
          status: results[i].status,
          createdAt: dateFormate(results[i].createdAt),
          updatedAt: actualDate,
        });
      }
      const page = parseInt(req.query.page) || 0;
      const limit = parseInt(req.query.limit) || 10;

      const startIndex = page * limit;
      const endIndex = (page + 1) * limit;

      const data1 = {};
      data1.dataItems = data.slice(startIndex, endIndex);
      data1.totalItems = data.length;
      data1.currentPage = parseInt(req.query.page) || 0;
      data1.totalPages = Math.ceil(data.length / limit);
      if (data1.dataItems.length <= 0) {
        return res.status(200).send({
          status: true,
          message: "Assessment not found ",
          data: data1,
        });
      }
      return res.status(200).send({
        status: true,
        message: "Assessment found successfully ",
        data: data1,
      });
    } else if (assessmentPurpose && assessmentType && !startDate && !endDate) {
      const data = [];
      const results = await TeacherAssessment.findAll({
        where: {
          assessmentType: assessmentType,
          teacherId: JSON.stringify(userId),
          status: "1",
          [Sequelize.Op.and]: [
            { assessmentPurpose: assessmentPurposeItems(assessmentPurpose) },
          ],
        },
      });
      console.log(results, "assessmentTyp994e");
      for (let i = 0; i < results.length; i++) {
        let convertUpdateAtDate = new Date(results[i].updatedAt);

        let convertUpdateAtEpoch = convertUpdateAtDate.getTime() / 1000.0;
        const date = new Date(convertUpdateAtEpoch * 1000);
        let actualDate = date.toGMTString();

        data.push({
          id: results[i].id,
          assessmentName: results[i].assessmentName,
          assessmentType: results[i].assessmentType,
          description: results[i].description,
          startDate: results[i].startDate.split("-").reverse().join("/"),
          endDate: results[i].endDate.split("-").reverse().join("/"),
          assessmentPurpose: results[i].assessmentPurpose,
          assessmentAILevel: results[i].assessmentAILevel,
          assessmentResponseType: results[i].assessmentResponseType,
          questionId: results[i].questionId,
          studentId: results[i].studentId,
          aiParametersLevel: results[i].aiParametersLevel,
          weightage: results[i].weightage,
          aiParametersIntro: results[i].aiParametersIntro,
          aiParametersMainContext: results[i].aiParametersMainContext,
          aiParametersOutro: results[i].aiParametersOutro,
          aiParametersEnvironment: results[i].aiParametersEnvironment,
          teacherId: results[i].teacherId,
          status: results[i].status,
          createdAt: dateFormate(results[i].createdAt),
          updatedAt: actualDate,
        });
      }
      const page = parseInt(req.query.page) || 0;
      const limit = parseInt(req.query.limit) || 10;

      const startIndex = page * limit;
      const endIndex = (page + 1) * limit;

      const data1 = {};
      data1.dataItems = data.slice(startIndex, endIndex);
      data1.totalItems = data.length;
      data1.currentPage = parseInt(req.query.page) || 0;
      data1.totalPages = Math.ceil(data.length / limit);
      if (data1.dataItems.length <= 0) {
        return res.status(200).send({
          status: true,
          message: "Assessment not found ",
          data: data1,
        });
      }
      return res.status(200).send({
        status: true,
        message: "Assessment found successfully ",
        data: data1,
      });
    } else if (startDate && assessmentType) {
      const data = [];
      const results = await TeacherAssessment.findAll({
        where: {
          assessmentType: assessmentType,

          teacherId: JSON.stringify(userId),
          status: "1",
          [Sequelize.Op.and]: [
            { startDate: startDate?.split("/").reverse().join("-") },
          ],
        },
      });
      console.log(results, "assessmentType1049");
      for (let i = 0; i < results.length; i++) {
        let convertUpdateAtDate = new Date(results[i].updatedAt);

        let convertUpdateAtEpoch = convertUpdateAtDate.getTime() / 1000.0;
        const date = new Date(convertUpdateAtEpoch * 1000);
        let actualDate = date.toGMTString();
        data.push({
          id: results[i].id,
          assessmentName: results[i].assessmentName,
          assessmentType: results[i].assessmentType,
          description: results[i].description,
          startDate: results[i].startDate.split("-").reverse().join("/"),
          endDate: results[i].endDate.split("-").reverse().join("/"),
          assessmentPurpose: results[i].assessmentPurpose,
          assessmentAILevel: results[i].assessmentAILevel,
          assessmentResponseType: results[i].assessmentResponseType,
          questionId: results[i].questionId,
          studentId: results[i].studentId,
          aiParametersLevel: results[i].aiParametersLevel,
          weightage: results[i].weightage,
          aiParametersIntro: results[i].aiParametersIntro,
          aiParametersMainContext: results[i].aiParametersMainContext,
          aiParametersOutro: results[i].aiParametersOutro,
          aiParametersEnvironment: results[i].aiParametersEnvironment,
          teacherId: results[i].teacherId,
          status: results[i].status,
          createdAt: dateFormate(results[i].createdAt),
          updatedAt: actualDate,
        });
      }
      const page = parseInt(req.query.page) || 0;
      const limit = parseInt(req.query.limit) || 10;

      const startIndex = page * limit;
      const endIndex = (page + 1) * limit;

      const data1 = {};
      data1.dataItems = data.slice(startIndex, endIndex);
      data1.totalItems = data.length;
      data1.currentPage = parseInt(req.query.page) || 0;
      data1.totalPages = Math.ceil(data.length / limit);
      if (data1.dataItems.length <= 0) {
        return res.status(200).send({
          status: true,
          message: "Assessment not found ",
          data: data1,
        });
      }
      return res.status(200).send({
        status: true,
        message: "Assessment found successfully ",
        data: data1,
      });
    } else if (assessmentType) {
      const data = [];
      const results = await TeacherAssessment.findAll({
        where: {
          assessmentType: assessmentType,
          teacherId: JSON.stringify(userId),
          status: "1",
        },
      });

      for (let i = 0; i < results.length; i++) {
        let convertUpdateAtDate = new Date(results[i].updatedAt);

        let convertUpdateAtEpoch = convertUpdateAtDate.getTime() / 1000.0;
        const date = new Date(convertUpdateAtEpoch * 1000);
        let actualDate = date.toGMTString();
        data.push({
          id: results[i].id,
          assessmentName: results[i].assessmentName,
          assessmentType: results[i].assessmentType,
          description: results[i].description,
          startDate: results[i].startDate.split("-").reverse().join("/"),
          endDate: results[i].endDate.split("-").reverse().join("/"),
          assessmentPurpose: results[i].assessmentPurpose,
          assessmentAILevel: results[i].assessmentAILevel,
          assessmentResponseType: results[i].assessmentResponseType,
          questionId: results[i].questionId,
          studentId: results[i].studentId,
          aiParametersLevel: results[i].aiParametersLevel,
          weightage: results[i].weightage,
          aiParametersIntro: results[i].aiParametersIntro,
          aiParametersMainContext: results[i].aiParametersMainContext,
          aiParametersOutro: results[i].aiParametersOutro,
          aiParametersEnvironment: results[i].aiParametersEnvironment,
          teacherId: results[i].teacherId,
          status: results[i].status,
          createdAt: dateFormate(results[i].createdAt),
          updatedAt: actualDate,
        });
      }
      const page = parseInt(req.query.page) || 0;
      const limit = parseInt(req.query.limit) || 10;

      const startIndex = page * limit;
      const endIndex = (page + 1) * limit;

      const data1 = {};
      data1.dataItems = data.slice(startIndex, endIndex);
      data1.totalItems = data.length;
      data1.currentPage = parseInt(req.query.page) || 0;
      data1.totalPages = Math.ceil(data.length / limit);
      if (data1.dataItems.length <= 0) {
        return res.status(200).send({
          status: true,
          message: "Assessment not found ",
          data: data1,
        });
      }
      return res.status(200).send({
        status: true,
        message: "Assessment found successfully ",
        data: data1,
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).send({ status: false, message: error.message });
  }
};

// get api assessment for student

exports.getAssessmentStudent = async (req, res) => {
  const token = req.headers["x-access-token"];
  const tokenData = jwt.decode(token);
  const studentId = tokenData.id;
  const data = [];

  const result = await TeacherAssessment.findAll({
    order: [["id", "DESC"]],
  });
  for (let i = 0; i < result.length; i++) {
    const studentIdInArray = await result[i].studentId;
    // console.log(mapId)
    const mapId = await studentIdInArray.map((id) => {
      if (id == studentId) {
        data.push(result[i]);
      }
    });
  }
  // console.log(data)

  return res.status(200).send({ success: true, data: data });
};

// Api for pending assessment
exports.getPendingAssessment = async (req, res) => {
  const token = req.headers["x-access-token"];
  const tokenData = jwt.decode(token);
  const studentId = tokenData.id;

  //give permission only student
  const getRoles = await User.findOne({
    where: {
      id: studentId,
    },
  });
  const roles = await getRoles.getRoles();
  for (let i = 0; i < roles.length; i++) {
    if (roles[i].name != "student") {
      return res.status(400).send({
        status: false,
        message: `You don't have permission to access this module!`,
      });
    }
  }

  const data = [];
  const result = await TeacherAssessment.findAll({
    order: [["startDate", "ASC"]],
  });
  for (let i = 0; i < result.length; i++) {
    const studentIdInArray = await result[i].studentId;
    const startingDate = result[i].startDate;
    let currentDate = new Date().toJSON().slice(0, 10);
    const mapId = await studentIdInArray.map((id) => {
      if (id == studentId && startingDate > currentDate) {
        data.push(result[i]);
      }
    });
  }
  if (data.length == 0) {
    return res
      .status(200)
      .send({ status: false, message: "No assessment found", data: data });
  }
  return res.status(200).send({
    status: true,
    message: "Assessment found successfully",
    data: data[0],
  });
};

//Get Api for student find assessment by params
exports.getAssessmentByParams = async (req, res) => {
  const token = req.headers["x-access-token"];
  const tokenData = jwt.decode(token);
  const studentId = tokenData.id;

  //give permission only student
  const getRoles = await User.findOne({
    where: {
      id: studentId,
    },
  });
  const roles = await getRoles.getRoles();
  for (let i = 0; i < roles.length; i++) {
    if (roles[i].name != "student") {
      return res.status(400).send({
        status: false,
        message: `You don't have permission to access this module!`,
      });
    }
  }

  const data = [];
  const result = await TeacherAssessment.findAll({
    where: {
      status: "1",
      teacherId: req.params.teacherId,
    },
    order: [["id", "DESC"]],
  });
  for (let i = 0; i < result.length; i++) {
    const studentIdInArray = await result[i].studentId;

    const mapId = await studentIdInArray.map((id) => {
      if (id == studentId) {
        data.push({
          id: result[i].id,
          assessmentName: result[i].assessmentName,
          startDate: result[i].startDate,
        });
      }
    });
  }
  if (data.length == 0) {
    return res
      .status(200)
      .send({ status: false, message: "No assessment found", data: data });
  }
  return res.status(200).send({
    status: true,
    message: "Assessment found successfully",
    data: data,
  });
};

// Get api for completed assessment
exports.getCompletedAssessment = async (req, res) => {
  try {
    const token = req.headers["x-access-token"];
    const tokenData = jwt.decode(token);
    const userId = tokenData.id;
    const getRoles = await User.findOne({
      where: {
        id: userId,
      },
    });
    const roles = await getRoles.getRoles();
    for (let i = 0; i < roles.length; i++) {
      if (roles[i].name != "student") {
        return res.status(400).send({
          status: false,
          message: `You don't have permission to access this module!`,
        });
      }
    }
    const assessmentData = await TeacherAssessment.findAll({
      where: {
        status: "1",
      },
      order: [["id", "DESC"]],
    });
    // console.log(assessmentData);
    const resultData = [];

    for (let i = 0; i < assessmentData.length; i++) {
      {
        const studentIdInArray = await assessmentData[i].studentId;
        const endDate = assessmentData[i].endDate;
        let currentDate = new Date().toJSON().slice(0, 10);
        // console.log(currentDate, endDate);
        const mapId = await studentIdInArray.map((id) => {
          if (id == userId && endDate < currentDate) {
            resultData.push(assessmentData[i]);
          }
        });
      }
    }
    const page = parseInt(req.query.page) || 0;
    const limit = parseInt(req.query.limit) || 10;

    const startIndex = page * limit;
    const endIndex = (page + 1) * limit;

    const results = {};
    results.dataItems = resultData.slice(startIndex, endIndex);
    results.totalItems = resultData.length;
    results.currentPage = parseInt(req.query.page) || 0;
    results.totalPages = Math.ceil(resultData.length / limit);
    if (results.dataItems.length <= 0) {
      return res.status(200).send({
        status: false,
        message: "No completed assessment found",
        data: results,
      });
    }
    return res.status(200).send({
      status: true,
      message: "All completed assessment found",
      data: results,
    });
  } catch (error) {
    return res.status(500).send({ message: error.message });
  }
};

exports.getStudentDetailsAssinedAssessment = async (req, res) => {
  try {
    const studentDetailsData = [];

    const studentId = [];
    const token = req.headers["x-access-token"];
    const decode = jwt.decode(token);
    const teacherId = decode.id;
    const assessmentData = await TeacherAssessment.findAll({
      where: {
        teacherId: JSON.stringify(teacherId),
        status: "1",
      },
    });
    for (let i = 0; i < assessmentData.length; i++) {
      const studentIdInArray = await assessmentData[i].studentId;
      const mapStudentDetails = await studentIdInArray.map((id) => {
        studentId.push(id);
      });
    }
    let arrayStudentId = [...new Set(studentId)];
    for (let i = 0; i < arrayStudentId.length; i++) {
      const studentDetails = await User.findOne({
        where: {
          id: parseInt(arrayStudentId[i]),
        },
      });
      studentDetailsData.push({
        id: studentDetails.id,
        name: studentDetails.fname + " " + studentDetails.lname,
        email: studentDetails.email,
        mnumber: studentDetails.mnumber,
      });
    }
    const page = parseInt(req.query.page) || 0;
    const limit = parseInt(req.query.limit) || 10;

    const startIndex = page * limit;
    const endIndex = (page + 1) * limit;

    const data1 = {};
    data1.dataItems = studentDetailsData.slice(startIndex, endIndex);
    data1.totalItems = studentDetailsData.length;
    data1.currentPage = parseInt(req.query.page) || 0;
    data1.totalPages = Math.ceil(studentDetailsData.length / limit);

    return res.status(200).send({
      status: true,
      message: "All student details",
      data: data1,
    });
  } catch (error) {
    return res.status(500).send({ status: false, message: error.message });
  }
};
