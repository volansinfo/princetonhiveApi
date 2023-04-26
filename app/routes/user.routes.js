const { authJwt } = require("../middleware");
const controller = require("../controllers/user.controller");
const { verifySignUp } = require("../middleware");

module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  app.get("/api/vol/all", [authJwt.verifyToken], controller.allAccess);

  app.get("/api/vol/user", [authJwt.verifyToken], controller.userBoard);

  app.get(
    "/api/vol/mod",
    [authJwt.verifyToken, authJwt.isSupport],
    controller.moderatorBoard
  );

  app.get(
    "/api/vol/admin",
    [authJwt.verifyToken, authJwt.isAdmin],
    controller.adminBoard
  );

  // Delete a User with id
  app.delete(
    "/api/vol/user/:id",
    [authJwt.verifyToken, authJwt.isSupportOrAdminOrTeacher],
    controller.userdelete
  );

  // status a User with id
  app.patch(
    "/api/vol/user/:id",
    [authJwt.verifyToken, authJwt.isSupportOrAdmin],
    controller.userstatus
  );

  // Update a User data using id
  app.post(
    "/api/vol/user/:id",
    [authJwt.verifyToken],
    controller.updateUserData
  );
};
