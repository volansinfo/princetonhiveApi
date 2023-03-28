const controller = require("../controllers/assessment.controller");
const { authJwt } = require("../middleware");
const assessmentError = require("../middleware/assessment.middlewere");

const csvController = require("../controllers/csv.controller");

const upload = require("../middleware/multer");

module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  app.post(
    "/api/user/assessment",

    [authJwt.verifyToken, assessmentError.assignmenErrorHanding],
    controller.assignment
  );

  app.get(
    "/api/user/allAssessment",
    [authJwt.verifyToken],
    controller.getAllAssessment
  );
  app.get(
    "/api/user/assessmentSelf",
    [authJwt.verifyToken],
    controller.getAssessmentBySelf
  );
  app.get(
    "/api/user/assessmentAssigned",
    [authJwt.verifyToken],
    controller.getAssessmentByAssigned
  );
  app.get(
    "/api/user/assessmentCompleted",
    [authJwt.verifyToken],
    controller.getAssessmentByCompleted
  );
  app.post(
    "/api/csv-file",
    [authJwt.verifyToken, upload.single("file")],
    csvController.uploadCsv
  );
};
