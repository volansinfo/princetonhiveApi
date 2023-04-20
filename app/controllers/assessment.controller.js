const db = require("../models");
const Assessment = db.assignment;
const pagination = require("../middleware/pagination");
const User = db.user;
const jwt = require("jsonwebtoken");

const { Sequelize } = require("sequelize");
exports.assignment = async (req, res) => {
  try {
    const token = req.headers["x-access-token"];
    const decodeToken = jwt.decode(token);
    const teacherId = decodeToken.id;
    const teacherExist = await User.findOne({
      where: {
        id: teacherId,
      },
    });

    const assessment = await Assessment.create({
      assessmentName: req.body.assessmentName,
      assessmentResponseType: req.body.assessmentResponseType,
      assessmentPurpose: req.body.assessmentPurpose,
      assessmentAILevel: req.body.assessmentAILevel,
      assessmentStatusType: req.body.assessmentStatusType,
      studentId: req.body.studentId,
      teacherId:
        teacherExist.uuid.slice(0, 3) == "TEA" ? teacherExist.id : null,
      status: req.body.status,
    });
    return res.status(200).send({
      status: 200,
      message: "Assessment created successfully",
      data: assessment,
    });
  } catch (error) {
    return res.status(500).send({ success: false, message: error.message });
  }
};

exports.getAllAssessment = async (req, res) => {
  try {
    const { limit, offset } = pagination.getPagination(req.query.page, 10);

    const results = await Assessment.findAndCountAll({
      limit,
      offset,
      where: {
        status: "1",
      },
      order: [["id", "DESC"]],
    });

    const response = pagination.getPaginationData(
      results,
      req.query.page,
      limit
    );

    // console.log(response.dataItems, "aaaaaa");
    return res.status(200).send({
      status: true,
      message: "Data found successfully ",
      data: response,
    });
  } catch (error) {
    return res.status(500).send({ success: false, message: error.message });
  }
};

exports.getAssessmentBySelf = async (req, res) => {
  try {
    const token = req.headers["x-access-token"];
    const tokenData = jwt.decode(token);
    const studentId = tokenData.id;
    const { limit, offset } = pagination.getPagination(req.query.page, 10);
    // const studentId = req.params.studentId;
    // console.log(studentId, "studentId");
    const results = await Assessment.findAndCountAll({
      limit,
      offset,
      where: {
        studentId: studentId,
        assessmentStatusType: "1",
        status: "1",
      },
      order: [["id", "DESC"]],
    });

    const response = pagination.getPaginationData(
      results,
      req.query.page,
      limit
    );

    res.status(200).send({
      status: true,
      message: "Data found successfully ",
      data: response,
    });
  } catch (error) {
    return res.status(500).send({ success: false, message: error.message });
  }
};

exports.getAssessmentByAssigned = async (req, res) => {
  try {
    const { limit, offset } = pagination.getPagination(req.query.page, 10);
    // const studentId = req.params.studentId;
    const results = await Assessment.findAndCountAll({
      limit,
      offset,
      where: {
        assessmentStatusType: "2",
        status: "1",
      },
      order: [["id", "DESC"]],
    });

    const response = pagination.getPaginationData(
      results,
      req.query.page,
      limit
    );

    res.status(200).send({
      status: true,
      message: "Data found successfully ",
      data: response,
    });
  } catch (error) {
    return res.status(500).send({ success: false, message: error.message });
  }
};

exports.getAssessmentByCompleted = async (req, res) => {
  try {
    const { limit, offset } = pagination.getPagination(req.query.page, 10);
    // const studentId = req.params.studentId;
    const results = await Assessment.findAndCountAll({
      limit,
      offset,
      where: {
        assessmentStatusType: "3",
        status: "1",
      },
      order: [["id", "DESC"]],
    });

    const response = pagination.getPaginationData(
      results,
      req.query.page,
      limit
    );

    res.status(200).send({
      status: true,
      message: "Data found successfully ",
      data: response,
    });
  } catch (error) {
    return res.status(500).send({ success: false, message: error.message });
  }
};

//14) Write a search teacher assessment Api which is using the key assessmentType and Start Date .
function dateFormate(date) {
  let convertUpdateAtDate = new Date(date);

  let convertUpdateAtEpoch = convertUpdateAtDate.getTime() / 1000.0;
  const inDate = new Date(convertUpdateAtEpoch * 1000);
  let actualDate = inDate.toGMTString();
  return actualDate;
}

exports.studentSearchQuery = async (req, res) => {
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
    if (roles != "STU") {
      return res.status(401).send({
        status: false,
        message: "You don't have permission to access the asssessment",
      });
    }

    const data = req.query;
    const { assessmentResponseType, assessmentPurpose } = data;
    if (!assessmentResponseType) {
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
    }

    if (assessmentResponseType && !assessmentPurpose) {
      const data = [];
      const results = await Assessment.findAll({
        where: {
          assessmentResponseType: assessmentResponseType,
          studentId: JSON.stringify(permissionRoles.id),
          status: "1",
        },
      });
      for (let i = 0; i < results.length; i++) {
        data.push({
          id: results[i].id,
          assessmentName: results[i].assessmentName,
          assessmentResponseType: results[i].assessmentResponseType,
          assessmentPurpose: results[i].assessmentPurpose,
          assessmentAILevel: results[i].assessmentAILevel,
          assessmentStatusType: results[i].assessmentStatusType,
          studentId: results[i].studentId,
          teacherId: results[i].teacherId,
          status: results[i].status,
          createdAt: dateFormate(results[i].createdAt),
          updatedAt: dateFormate(results[i].createdAt),
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
    } else if (assessmentResponseType && assessmentPurpose) {
      const data = [];
      const results = await Assessment.findAll({
        where: {
          assessmentResponseType: assessmentResponseType,
          assessmentPurpose: assessmentPurpose,
          studentId: JSON.stringify(permissionRoles.id),
          status: "1",
        },
      });
      for (let i = 0; i < results.length; i++) {
        data.push({
          id: results[i].id,
          assessmentName: results[i].assessmentName,
          assessmentResponseType: results[i].assessmentResponseType,
          assessmentPurpose: results[i].assessmentPurpose,
          assessmentAILevel: results[i].assessmentAILevel,
          assessmentStatusType: results[i].assessmentStatusType,
          studentId: results[i].studentId,
          teacherId: results[i].teacherId,
          status: results[i].status,
          createdAt: dateFormate(results[i].createdAt),
          updatedAt: dateFormate(results[i].createdAt),
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
      console.log(data1);
      if (data1.dataItems.length <= 0) {
        return res.status(200).send({
          status: true,
          message: "Assessment not found successfully ",
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
