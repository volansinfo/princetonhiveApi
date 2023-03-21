const { authJwt } = require("../middleware");
const controller = require("../controllers/globalConfig.controller");

module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  app.post(
    "/app/vol/globalConfig",
    [authJwt.verifyToken, authJwt.isSupportOrAdmin],
    controller.addServerDetails
  );

  app.get(
    "/app/vol/globalConfig",
    [authJwt.verifyToken, authJwt.isSupportOrAdmin],
    controller.getServerDetails
  );

  app.delete(
    "/app/vol/globalConfig/:id",
    [authJwt.verifyToken, authJwt.isSupportOrAdmin],
    controller.deleteServerDetails
  );

  app.patch(
    "/app/vol/globalConfig",
    [authJwt.verifyToken, authJwt.isSupportOrAdmin],
    controller.updateServerStatus
  );

  app.put(
    "/app/vol/updateServerDetails",
    [authJwt.verifyToken, authJwt.isSupportOrAdmin],
    controller.updateServerDetails
  );
};
