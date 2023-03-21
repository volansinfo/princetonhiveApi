const db = require("../models");
const Assessment = db.assignment;
exports.assignment = async (req, res) => {
  try {
    data = req.body;
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
        .send({ status: false, message: "Please Enter Assessment Name" });
    } else if (!assessmentResponseType) {
      return res.status(400).send({
        status: false,
        message: "Please Enter Assessment Response Type",
      });
    } else if (!assessmentPurpose) {
      return res
        .status(400)
        .send({ status: false, message: "Please Enter Assessment Purpose" });
    } else if (!assessmentAILevel) {
      return res
        .status(400)
        .send({ status: false, message: "Please Enter Assessment AI Level" });
    } else if (!assessmentStatusType) {
      return res
        .status(400)
        .send({
          status: false,
          message: "Please Enter Assessment Status Type",
        });
    } else if (!studentId) {
      return res
        .status(400)
        .send({ status: false, message: "Please Enter StudentId" });
    } else if (!teacherId) {
      return res
        .status(400)
        .send({ status: false, message: "Please Enter teacherId" });
    } else if (!status) {
      return res
        .status(400)
        .send({ status: false, message: "Please Enter Status" });
    }

    const findStudentId = await Assessment.findAll();
    for (let i = 0; i < findStudentId.length; i++) {
      if (
        findStudentId[i].studentId == studentId &&
        findStudentId[i].assessmentName == assessmentName
      ) {
        return res.status(400).send({
          status: false,
          message: "Assessment Name is  Already Exist",
        });
      }
      console.log(
        findStudentId[i].studentId,
        findStudentId[i].assessmentName,
        "findassessement"
      );
    }
    // console.log(findAssessement[0].studentId, "findassessement");

    const assessment = await Assessment.create(data);
    return res.status(201).send({
      status: 201,
      message: "created Assignment successfully",
      data: assessment,
    });
  } catch (error) {
    return res.status(500).send(error);
  }
};
