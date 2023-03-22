const db = require("../models");
const Assessment = db.assignment;
const pagination = require("../middleware/pagination");
const User = db.user;
exports.assignment = async (req, res) => {
  try {
    const data = req.body;
    const {
      assessmentName,
      assessmentResponseType,
      assessmentPurpose,
      assessmentAILevel,
      assessmentStatusType,
      studentId,
      teacherId,
      status,
    } = data;

    if (!assessmentName) {
      return res
        .status(400)
        .send({ status: false, message: "Please enter assessment name" });
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
        message: "Please Enter valid assessment response type like [1,2,3,4]",
      });
    } else if (!assessmentPurpose) {
      return res
        .status(400)
        .send({ status: false, message: "Please enter assessment purpose" });
    } else if (
      assessmentPurpose != "1" &&
      assessmentPurpose != "2" &&
      assessmentPurpose != "3" &&
      assessmentPurpose != "4" &&
      assessmentPurpose != "5"
    ) {
      return res.status(400).send({
        status: false,
        message: "Please Enter valid assessment purpose like [1,2,3,4,5]",
      });
    } else if (!assessmentAILevel) {
      return res
        .status(400)
        .send({ status: false, message: "Please Enter assessment AI level" });
    } else if (
      assessmentAILevel != "1" &&
      assessmentAILevel != "2" &&
      assessmentAILevel != "3"
    ) {
      return res.status(400).send({
        status: false,
        message: "Please enter valid assessment AI level like [1,2,3]",
      });
    } else if (!assessmentStatusType) {
      return res.status(400).send({
        status: false,
        message: "Please Enter Assessment Status Type",
      });
    } else if (
      assessmentStatusType != "1" &&
      assessmentStatusType != "2" &&
      assessmentStatusType != "3" &&
      assessmentStatusType != "4"
    ) {
      return res.status(400).send({
        status: false,
        message: "Please enter valid assessment status like [1,2,3,4]",
      });
    } else if (!status) {
      return res
        .status(400)
        .send({ status: false, message: "Please Enter Status" });
    } else if (status != "0" && status != "1") {
      return res.status(400).send({
        status: false,
        message: "Please enter valid enum like [0,1] of status type",
      });
    }

    const findStudentId = await Assessment.findAll();
    for (let i = 0; i < findStudentId.length; i++) {
      if (
        findStudentId[i].studentId == studentId &&
        findStudentId[i].assessmentName == assessmentName
      ) {
        return res.status(400).send({
          status: false,
          message: "Assessment name is  already exist",
        });
      }
    }

    const userId = await User.findOne({
      where: {
        id: req.body.studentId,
      },
    });
    if (!studentId) {
      return res
        .status(400)
        .send({ status: false, message: "Please Enter StudentId" });
    } else if (!userId) {
      return res
        .status(400)
        .send({ status: false, message: "Student does not exist" });
    }

    const assessment = await Assessment.create(data);
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
