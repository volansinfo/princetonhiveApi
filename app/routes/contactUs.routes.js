
const controller=require("../controllers/contactUs.controller")
const authJwt=require("../middleware/authJwt")
const errorHanding=require("../middleware/teacher.assessmentError.middlewe")
module.exports = function (app) {
    app.use(function (req, res, next) {
        res.header(
            "Access-Control-Allow-Headers",
            "x-access-token, Origin, Content-Type, Accept"
        );
        next();
    });
    app.post(
        "/api/vol/contactUs",
        [authJwt.verifyToken,errorHanding.errorHandingContactUs],
        controller.createContact
    );
}