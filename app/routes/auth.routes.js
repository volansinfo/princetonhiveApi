const { verifySignUp } = require("../middleware");
const { authJwt } = require("../middleware");
const controller = require("../controllers/auth.controller");

module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  app.post(
    "/api/user/signup",
    [
      verifySignUp.checkDuplicateUsernameOrEmail,
      verifySignUp.checkRolesExisted,
      verifySignUp.validatefname,
      verifySignUp.fnameValidation,
      verifySignUp.validateEmail,
      verifySignUp.emailValidation,
      verifySignUp.validateMnumber,
      verifySignUp.mnumberValidation,
      verifySignUp.validatePincode,
      verifySignUp.pincodeValidation
    ],
    controller.signup
  );

  app.post("/api/user/signin", controller.signin);

  app.post("/api/user/signout", controller.signout);

  app.post("/api/user/changePassword/:userId",
    [
      authJwt.verifyToken,
      verifySignUp.validatePwdAndConfirmPwd,
      verifySignUp.passwordValidation
    ],
    controller.changePassword);

  app.post("/api/user/forgotPassword", [verifySignUp.validateEmail,
  verifySignUp.emailValidation], controller.forgotPassword);

};
