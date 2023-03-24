const { authJwt } = require("../middleware");
const controller = require("../controllers/question.controller");

module.exports = function (app) {
    app.use(function (req, res, next) {
        res.header(
            "Access-Control-Allow-Headers",
            "x-access-token, Origin, Content-Type, Accept"
        );
        next();
    });
    app.post(
        "/api/vol/question",
        [authJwt.verifyToken, authJwt.isTeacher],
        controller.questionAdd
    );
}