const db = require("../models");
const Assessment = db.assignment;
const pagination = require("../middleware/pagination");
const User = db.user;
exports.assignment = async (req, res) => {
  try {
    const assessment = await Assessment.create({
      assessmentName: req.body.assessmentName,
      assessmentResponseType: req.body.assessmentResponseType,
      assessmentPurpose: req.body.assessmentPurpose,
      assessmentAILevel: req.body.assessmentAILevel,
      assessmentStatusType: req.body.assessmentStatusType,
      studentId: req.body.studentId,
      teacherId: req.body.teacherId,
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
