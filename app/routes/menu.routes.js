const { authJwt } = require("../middleware");
const controller = require("../controllers/menu.controller");


module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

   //Get all menu list
 app.get(
    "/api/vol/admin/menu",
    [authJwt.verifyToken, authJwt.isAdmin],
    controller.getAllMenuList
  );
  
  //To add a menu
  app.post(
    "/api/vol/admin/menu",
    [authJwt.verifyToken, authJwt.isAdmin],
    controller.addMenuList
  );
  //To update the menu using by id
  app.post(
    "/api/vol/admin/menu/:id",
    [authJwt.verifyToken, authJwt.isAdmin],
    controller.updateMenuList
  );
  //Delete the menu using by id
  app.delete(
    "/api/vol/admin/menu/:id",
    [authJwt.verifyToken, authJwt.isAdmin],
    controller.deleteMenuList
  );
  //Change the ststus using by id
  app.patch(
    "/api/vol/admin/menu/:id",
    [authJwt.verifyToken, authJwt.isAdmin],
    controller.statusMenuList
  );

  //UAC Add
  app.post(
    "/api/vol/admin/uac/",
    [authJwt.verifyToken, authJwt.isAdmin],
    controller.addUac
  );
  //UAC update using by id
  app.post(
    "/api/vol/admin/uac/:id",
    [authJwt.verifyToken, authJwt.isAdmin],
    controller.updateUac
  );

   //Get all UAC list
 app.get(
  "/api/vol/admin/uac",
  [authJwt.verifyToken, authJwt.isAdmin],
  controller.getAllUacList
);

  
};
