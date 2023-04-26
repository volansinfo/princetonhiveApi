const controller = require("../controllers/centralLibrary.category.controller");
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
    "/api/createCategory",
    [authJwt.verifyToken],
    controller.createCategory
  );
  app.get(
    "/api/getCategoryById/:categoryId",
    [authJwt.verifyToken],
    controller.getCategoryById
  );
  app.get(
    "/api/getAllCategory",
    [authJwt.verifyToken],
    controller.getAllCategory
  );
  app.patch(
    "/api/updateCategoryStatus/:categoryId",
    [authJwt.verifyToken],
    controller.updateCategoryStatus
  );
  app.post(
    "/api/updateCategory/:categoryId",
    [authJwt.verifyToken],
    controller.updateCategory
  );
  app.get(
    "/api/deleteCategory/:categoryId",
    [authJwt.verifyToken],
    controller.deleteCategory
  );
};
