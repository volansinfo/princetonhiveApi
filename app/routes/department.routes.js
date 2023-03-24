const { authJwt } = require("../middleware");
const controller = require("../controllers/department.controller");

module.exports = function (app) {
    app.use(function (req, res, next) {
        res.header(
            "Access-Control-Allow-Headers",
            "x-access-token, Origin, Content-Type, Accept"
        );
        next();
    });
    app.post(
        "/api/vol/department",
        [authJwt.verifyToken, authJwt.isTeacher],
        controller.departmentAdd
    );
    app.get("/api/vol/department",
        [authJwt.verifyToken, authJwt.isSupportOrAdmin],
        controller.getAllDepartments
    );
    app.get("/api/vol/department/:id",
        [authJwt.verifyToken, authJwt.isSupportOrAdmin],
        controller.getDepartment
    );
    app.patch("/api/vol/department/:id",
        [authJwt.verifyToken, authJwt.isSupportOrAdmin],
        controller.departmentstatus
    )

    app.delete("/api/vol/department/:id",
        [authJwt.verifyToken, authJwt.isSupportOrAdmin],
        controller.departmentDelete
    );
    app.post(
        "/api/vol/department/:id",
        [authJwt.verifyToken, authJwt.isSupportOrAdmin],
        controller.updateDepartment
    );
}