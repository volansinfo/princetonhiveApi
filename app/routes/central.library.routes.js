const controller = require("../controllers/central.library.controller");
const { authJwt } = require("../middleware");

module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  app.post(
    "/api/createLibrary",
    [authJwt.verifyToken],
    controller.createLibrary
  );
  app.get(
    "/api/getLibraryById/:libraryId",
    [authJwt.verifyToken],
    controller.getLibraryById
  );
  app.get(
    "/api/getAllLibrary",
    [authJwt.verifyToken],
    controller.getAllLibrary
  );
  app.post(
    "/api/updateLibraryStatus/:libraryId",
    [authJwt.verifyToken],
    controller.updateLibraryStatus
  );
  app.post(
    "/api/updateLibrary/:libraryId",
    [authJwt.verifyToken],
    controller.updateLibrary
  );
  app.get(
    "/api/deleteLibrary/:libraryId",
    [authJwt.verifyToken],
    controller.deleteLibrary
  );
};
