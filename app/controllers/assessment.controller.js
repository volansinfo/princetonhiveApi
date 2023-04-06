const db = require("../models");
const Assessment = db.assignment;
const pagination = require("../middleware/pagination");
const User = db.user;
const jwt = require("jsonwebtoken");
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
    if (response.dataItems.length <= 0) {
      return res
        .status(404)
        .send({ status: false, message: "Assessment not available" });
    }
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
    const { limit, offset } = pagination.getPagination(req.query.page, 10);
    // const studentId = req.params.studentId;
    const results = await Assessment.findAndCountAll({
      limit,
      offset,
      where: {
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
    if (response.dataItems.length <= 0) {
      return res
        .status(404)
        .send({ status: false, message: "Assessment not available" });
    }
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
    if (response.dataItems.length <= 0) {
      return res
        .status(404)
        .send({ status: false, message: "Assessment not available" });
    }
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
    if (response.dataItems.length <= 0) {
      return res
        .status(404)
        .send({ status: false, message: "Assessment not available" });
    }
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
    const { limit, offset } = pagination.getPagination(req.query.page, 10);
    const data = req.query;
    const { assessmentType, assessmentPurpose } = data;
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
      !/([12]\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01]))/.test(startDate)
    ) {
      return res.status(400).send({
        status: false,
        message: "Please enter date in yyyy-mm-dd format",
      });
    }
    const results = await Assessment.findAndCountAll({
      limit,
      offset,
      where: {
        assessmentType: assessmentType,
        assessmentPurpose: assessmentPurpose,
        teacherId: JSON.stringify(permissionRoles.id),
      },
    });
    const response = pagination.getPaginationData(
      results,
      req.query.page,
      limit
    );
    if (response.dataItems.length <= 0) {
      return res
        .status(404)
        .send({ status: false, message: "Assessment not available" });
    }
    return res.status(200).send({
      status: true,
      message: "Assessment found successfully ",
      data: response,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ status: false, message: error.message });
  }
};
