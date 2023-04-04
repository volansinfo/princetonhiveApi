const { authJwt } = require("../middleware");
const controller = require("../controllers/gallery.controller");

module.exports = function (app) {
    app.use(function (req, res, next) {
        res.header(
            "Access-Control-Allow-Headers",
            "x-access-token, Origin, Content-Type, Accept"
        );
        next();
    });

    app.post("/api/hiv/gallery", [authJwt.verifyToken, authJwt.isSupportOrAdmin], controller.galleryAdd);
    app.get("/api/hiv/allgallery", [authJwt.verifyToken, authJwt.isSupportOrAdmin], controller.getAllGallery);
    app.post("/api/hiv/gallery/:id", [authJwt.verifyToken, authJwt.isSupportOrAdmin], controller.updateGallery);
    app.delete("/api/hiv/gallery/:id", [authJwt.verifyToken, authJwt.isSupportOrAdmin], controller.galleryDelete);
    app.patch("/api/hiv/gallery/:id", [authJwt.verifyToken, authJwt.isSupportOrAdmin], controller.galleryStatus);
    app.get("/api/hiv/gallery-active", [authJwt.verifyToken, authJwt.isSupportOrAdmin], controller.getActiveGallery);
}
