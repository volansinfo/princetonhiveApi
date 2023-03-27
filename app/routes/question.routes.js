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
    app.get(
        "/api/vol/question",
        [authJwt.verifyToken, authJwt.isSupportOrAdminOrTeacher],
        controller.getAllQuestion
    );
    app.delete(
        "/api/vol/question/:id",
        [authJwt.verifyToken, authJwt.isSupportOrAdminOrTeacher],
        controller.questionDelete
    );
    app.post(
        "/api/vol/question/:id",
        [authJwt.verifyToken, authJwt.isSupportOrAdminOrTeacher],
        controller.updateQuestion
    );
    app.patch(
        "/api/vol/question/:id",
        [authJwt.verifyToken, authJwt.isSupportOrAdmin],
        controller.questionStatus
    );
}
