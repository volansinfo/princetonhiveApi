const controller = require("../controllers/assessment.controller");
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
    "/api/user/assessment",
    [authJwt.verifyToken],
    controller.assignment
  );

  app.get(
    "/api/user/allAssessment/:studentId",
    [authJwt.verifyToken],
    controller.getAllAssessment
  );
  app.get(
    "/api/user/assessmentSelf/:studentId",
    [authJwt.verifyToken],
    controller.getAssessmentBySelf
  );
  app.get(
    "/api/user/assessmentAssigned/:studentId",
    [authJwt.verifyToken],
    controller.getAssessmentByAssigned
  );
  app.get(
    "/api/user/assessmentCompleted/:studentId",
    [authJwt.verifyToken],
    controller.getAssessmentByCompleted
  );
};
