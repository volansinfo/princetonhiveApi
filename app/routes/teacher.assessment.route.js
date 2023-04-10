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
    "/api/vol/getAssessmentPreviousActive",
    [authJwt.verifyToken],
    controller.getAssessmentPreviousActive
  );
  app.patch(
    "/api/vol/updateAssessment/:id",
    [authJwt.verifyToken, errorValidation.erroHandlingUpdate],
    controller.updateAssessment
  );
  app.patch(
    "/api/vol/updateAssessmentStatus/:id",
    [authJwt.verifyToken],
    controller.updateStatus
  );
  app.delete(
    "/api/vol/deleteAssessment/:id",
    [authJwt.verifyToken],
    controller.deleteAssessment
  );
  app.get(
    "/api/vol/getAllAssessment",
    [authJwt.verifyToken],
    controller.getAllAssessment
  );
  app.get(
    "/api/vol/getAllActiveAssessment",
    [authJwt.verifyToken],
    controller.getAllActiveAssignedAssessment
  );
  app.get(
    "/api/vol/getAssignedAssessment",
    [authJwt.verifyToken],
    controller.getAllActiveAssessment
  );
  app.get(
    "/api/vol/getPracticeAssessment",
    [authJwt.verifyToken],
    controller.getAllActivePracticeAssessment
  );

  app.get(
    "/api/vol/teacherSearchQuery",
    [authJwt.verifyToken],
    controller.teacherSearchQuery
  );
};
