const db = require("../models");
const TeacherAssessment = db.teacherAssessment;
const User = db.user;
const pagination = require("../middleware/pagination");
const jwt = require("jsonwebtoken");

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
      startDate: req.body.startDate,
      endDate: req.body.endDate,
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
      return res.status(404).send({
        status: false,
        message: "There are no ongoing assessment.",
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
      where: { teacherId: JSON.stringify(permissionRoles.id) },
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
      return res.status(404).send({
        status: false,
        message: "There are no upcomming assessment.",
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
      return res.status(404).send({
        status: false,
        message: "There are no previous assessment.",
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
        startDate: req.body.startDate,
        endDate: req.body.endDate,
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
      return res.status(404).send({
        status: false,
        message: "No assessment found",
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
      return res.status(404).send({
        status: false,
        message: "No assessment found",
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
      return res.status(404).send({
        status: false,
        message: "No assessment found",
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
      return res.status(404).send({
        status: false,
        message: "No assessment found",
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

//13) Write a search teacher assessment Api which is using the key assessmentType and assessmentPurpose .

exports.teacherSearchQueryAssessmentPurpose = async (req, res) => {
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
    }
    const results = await TeacherAssessment.findAndCountAll({
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

//14) Write a search teacher assessment Api which is using the key assessmentType and Start Date .

exports.teacherSearchQueryStartDate = async (req, res) => {
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
    const { limit, offset } = pagination.getPagination(req.query.page, 10);
    const data = req.query;
    const { assessmentType, startDate } = data;
    if (!assessmentType) {
      return res
        .status(400)
        .send({ status: false, message: "Please enter assessment type" });
    } else if (assessmentType != "1" && assessmentType != "2") {
      return res.status(400).send({
        status: false,
        message: "Please enter valid assessment type like 1,2",
      });
    }
    else if (
      !/([12]\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01]))/.test(startDate)
    ) {
      return res.status(400).send({
        status: false,
        message: "Please enter date in yyyy-mm-dd format",
      });
    }
    const results = await TeacherAssessment.findAndCountAll({
      limit,
      offset,
      where: {
        assessmentType: assessmentType,
        startDate: startDate,
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

//15) Write a search teacher assessment Api which is using the key assessmentType and  End Date .

exports.teacherSearchQueryEndDate = async (req, res) => {
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
    const { limit, offset } = pagination.getPagination(req.query.page, 10);
    const data = req.query;
    const { assessmentType, endDate } = data;
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
      !/([12]\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01]))/.test(endDate)
    ) {
      return res.status(400).send({
        status: false,
        message: "Please enter date in yyyy-mm-dd format",
      });
    }
    const results = await TeacherAssessment.findAndCountAll({
      limit,
      offset,
      where: {
        assessmentType: assessmentType,
        endDate: endDate,
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
