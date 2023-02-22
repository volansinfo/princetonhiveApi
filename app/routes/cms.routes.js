const { authJwt } = require("../middleware");
const controller = require("../controllers/cms.controller");


module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  //Add the banner CMS Page
  app.post(
    "/api/vol/page",
    [authJwt.verifyToken, authJwt.isSupportOrAdmin],
    controller.pageAdd
  );

  //Find the banner CMS Page

  app.get("/api/vol/page",
  [authJwt.verifyToken, authJwt.isSupportOrAdmin],
   controller.getPages);

 // Update a CMS Page data using id

 app.post("/api/vol/page/:id",
 [authJwt.verifyToken, authJwt.isSupportOrAdmin],
 controller.updatePage
);

  // status update using CMS Page id
  app.patch("/api/vol/page/:id",
  [authJwt.verifyToken, authJwt.isSupportOrAdmin],
  controller.pagestatus
 );

  // Delete a CMS Page with id
  app.delete("/api/vol/page/:id",
    [authJwt.verifyToken, authJwt.isSupportOrAdmin],
    controller.pageDelete
   );

  
};
