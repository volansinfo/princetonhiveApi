const controller = require("../controllers/studentAIReport.controller")
const { authJwt } = require("../middleware");

module.exports = function (app) {
    app.use(function (req, res, next) {
        res.header(
            "Access-Control-Allow-Headers",
            "aiSecretKey, Origin, Content-Type, Accept"
        );
        next();
    })

    app.post("/api/hiv/student/ai/report", [authJwt.verifyAISecretKey], controller.addStudentAIReport)

    app.get("/api/hiv/student/ai/allreports",  [authJwt.verifyToken],controller.getAllAIReport)

    app.get("/api/hiv/student/ai/report/:reportId", [authJwt.verifyToken], controller.getAIReportDetails)

    app.get("/api/hiv/student/ai/getAssignedTaskStudent",controller.getAssignedTaskStudent)

}