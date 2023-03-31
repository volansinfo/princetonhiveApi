const controller = require("../controllers/studentTeacher.controller")
const { authJwt } = require("../middleware")

module.exports = function (app) {
    app.use(function (req, res, next) {
        res.header(
            "Access-Control-Allow-Headers",
            "x-access-token, Origin, Content-Type, Accept"
        )
        next()
    })
    app.get("/api/vol/allstudents-counts", [authJwt.verifyToken, authJwt.isTeacher], controller.getAllStudentsCountByTeacher)
    app.get("/api/vol/allstudents", [authJwt.verifyToken, authJwt.isTeacher], controller.getAllStudentByTeacher)
    app.post("/api/vol/student/:id", [authJwt.verifyToken], controller.updateStudentData)
}