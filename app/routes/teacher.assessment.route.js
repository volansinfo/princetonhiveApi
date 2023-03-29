const controller = require("../controllers/teacher.assessment.controller");
const errorValidation = require("../middleware/teacher.assessmentError.middlewe");
const { authJwt } = require("../middleware");

module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });
  app.post(
    "/api/vol/addAssessment",
    [authJwt.verifyToken, errorValidation.errorHandingTeacherAssessment],
    controller.createAssessment
  );
  app.get(
    "/api/vol/getAssessmentOngoing",
    [authJwt.verifyToken],
    controller.getAssessmentOngoing
  );
  app.get(
    "/api/vol/getAssessmentUpcomming",
    [authJwt.verifyToken],
    controller.getAssessmentUpcomming
  );
  app.get(
    "/api/vol/getAssessmentActiveUpcomming",
    [authJwt.verifyToken],
    controller.getAssessmentActiveUpcomming
  );
};