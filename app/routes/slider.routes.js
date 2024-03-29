const { authJwt } = require("../middleware");
const controller = require("../controllers/slider.controller");


module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  //Add the banner slider
  app.post(
    "/api/vol/slider",
    [
      authJwt.verifyToken,
      authJwt.checkUserAddPermission,

    ],
    controller.bannerSliderAdd
  );

  //Find the banner slider list

  app.get("/api/vol/slider", authJwt.checkUserReadPermission, controller.findSlider);

  // Update a slider data using id

  app.post("/api/vol/slider/:id",
    [authJwt.verifyToken, authJwt.checkUserUpdatePermission],
    controller.updateSlider
  );

  // status update using slider id
  app.patch("/api/vol/slider/:id",
    [
      authJwt.verifyToken,
      authJwt.checkUserUpdateStatusPermission,
    ],
    controller.sliderstatus
  );

  // Delete a Slider with id
  app.delete("/api/vol/slider/:id",
    [authJwt.verifyToken, authJwt.checkUserDeletePermission],
    controller.sliderdelete
  );


};
