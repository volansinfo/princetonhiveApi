const { authJwt } = require("../middleware");
const controller = require("../controllers/widget.controller");


module.exports = function(app){

app.use(function(req, res, next){
    res.header(
        "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
});

app.post(
    "/api/vol/widget",
    [authJwt.verifyToken, authJwt.isSupportOrAdmin],
    controller.widgetAdd
  );

app.get("/api/vol/widget",
  [authJwt.verifyToken, authJwt.isSupportOrAdmin],
   controller.getAllWidgets
   );


app.post("/api/vol/widget/:id",
   [authJwt.verifyToken, authJwt.isSupportOrAdmin],
   controller.updateWidget
  );

app.patch("/api/vol/widget/:id",
  [authJwt.verifyToken, authJwt.isSupportOrAdmin],
  controller.widgetstatus
 );

app.delete("/api/vol/widget/:id",
 [authJwt.verifyToken, authJwt.isSupportOrAdmin],
 controller.widgetDelete
);
};