// exports.getAllTeacher

const controller = require("../controllers/teacher.controller")
const { authJwt } = require("../middleware")

module.exports = function (app) {
    app.use(function (req, res, next) {
        res.header(
            "Access-Control-Allow-Headers",
            "x-access-token, Origin, Content-Type, Accept"
        )
        next()
    })


    app.get("/api/vol/allTeacher",
        [authJwt.verifyToken],
        controller.getAllTeacher
    )

}