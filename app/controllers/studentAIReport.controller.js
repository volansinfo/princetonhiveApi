const db = require("../models");
const jwt = require("jsonwebtoken");
const Users = db.user;
const uploadVideo = require("../middleware/studentAIVideo");

const studentAIReport = db.studentAIReport;

exports.addStudentAIReport = async (req, res) => {
  try {
    await uploadVideo(req, res);

    const max = 60;
    const min = 30;

    let yourAverage = Math.floor(Math.random() * (max - min)) + min;
    let industryAverage = Math.floor(Math.random() * (max - min)) + min;
    let intro = Math.floor(Math.random() * (max - min)) + min;
    let bodyLanguage = Math.floor(Math.random() * (max - min)) + min;
    let facialExpression = Math.floor(Math.random() * (max - min)) + min;
    let language = Math.floor(Math.random() * (max - min)) + min;
    let voice = Math.floor(Math.random() * (max - min)) + min;
    let presence = Math.floor(Math.random() * (max - min)) + min;
    let outro = Math.floor(Math.random() * (max - min)) + min;

    let videoQuality = Math.floor(Math.random() * (max - min)) + min;

    let AiReport = JSON.stringify({
      yourAverage: yourAverage,
      industryAverage: industryAverage,
      videoQuality: videoQuality,
      intro: intro,
      bodyLanguage: bodyLanguage,
      facialExpression: facialExpression,
      language: language,
      voice: voice,
      presence: presence,
      outro: outro,
    });

    if (req.file == undefined) {
      return res
        .status(400)
        .send({ success: false, message: "Undefined File." });
    } else {
      if (req.file.originalname.split(".")[1] == "mp4") {
        const fullUrl =
          req.protocol +
          "s://" +
          req.get("host") +
          "/princetonhive/img/studentai/";

        await studentAIReport.create({
          studentId: req.body.studentId,
          teacherId: req.body.teacherId,
          universityId: req.body.universityId,
          assignmentName: req.body.assignmentName,
          studentUUID: req.body.studentUUID,
          aiReport: AiReport,
          totalAverage: yourAverage,
          videoPath: req.file.path,
          videoUrl: fullUrl + req.file.filename,
          status: req.body.status ? req.body.status : 1,
        });

        return res
          .status(200)
          .send({ success: true, message: "AI Report received successfully." });
      } else {
        return res
          .status(400)
          .send({ success: false, message: "File type does not allowed!" });
      }
    }
  } catch (e) {
    return res.status(500).send({ success: false, message: e.message });
  }
};

exports.getAllAIReport = async (req, res) => {
  try {
    let token = req.headers["x-access-token"];

    const tokenData = jwt.decode(token);

    let userId = tokenData.id;

    const AIReport = await studentAIReport.findAll({
      where: {
        studentId: userId,
      },
      order: [["id", "DESC"]],
      attributes: {
        exclude: ["videoPath", "reportDetails"],
      },
    });

    return res.status(200).send({ success: true, AllAIReports: AIReport });
  } catch (e) {
    return res.status(500).send({ success: false, message: e.message });
  }
};

exports.getAIReportDetails = async (req, res) => {
  try {
    const AIReport = await studentAIReport.findOne({
      where: {
        id: req.params.reportId,
      },
      attributes: {
        exclude: ["videoPath", "reportDetails"],
      },
    });

    if (!AIReport) {
      return res
        .status(404)
        .send({ success: false, message: "AI Report not found!" });
    }

    return res.status(200).send({ success: true, AIReport: AIReport });
  } catch (e) {
    return res.status(500).send({ success: false, message: e.message });
  }
};

exports.getAssignedTaskStudent = async (req, res) => {
  try {
    const studentId = req.query.studentId;

    const studentData = await studentAIReport.findAll({
      where: {
        studentId: studentId,
      },

      // order: [['id', 'DESC']],
      // include: [
      //     {
      //         model: Users,
      //         required: true,
      //         as:"hiv_users",
      //         where:{
      //             id:studentId
      //         }
      //     }
      // ]
    });

    let response = [];

    studentData.forEach((element) => {
      response.push({
        // name:element.hiv_users[0].fname + " "+element.hiv_users[0].lname,
        // phoneNumber:element.hiv_users[0].mnumber,
        // email:element.hiv_users[0].email,
        reportId: element.id,
        assignmentName: element.assignmentName,
        totalAverage: element.totalAverage,
        createdAt: element.createdAt,
      });
    });

    return res.status(200).send({ success: true, data: response });
  } catch (e) {
    return res.status(500).send({ success: false, message: e.message });
  }
};

exports.getStudentDetailsTakenAIAssessment = async (req, res) => {
  try {
    const studentdata = [];

    const token = req.headers["x-access-token"];
    const decode = jwt.decode(token);
    const teacherId = decode.id;

    const studentAIdata = await studentAIReport.findAll({
      where: {
        teacherId: teacherId,
      },
      //   include: [
      //     {
      //       model: Users,
      //       required: true,
      //       as: "hiv_users",
      //     },
      //   ],
    });
    // console.log(studentAIdata);
    for (let i = 0; i < studentAIdata.length; i++) {
      const studenTData = await Users.findOne({
        where: {
          id: studentAIdata[i].studentId,
        },
      });
      await studentdata.push({
        id: studenTData.id,
        fname: studenTData.fname,
        lname: studenTData.lname,
        email: studenTData.email,
        mnumber: studenTData.mnumber,
      });
    }

    return res.status(200).send({
      status: true,
      message: "Student details found successfully",
      data: studentdata,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ status: false, message: error.message });
  }
};
