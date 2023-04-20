const { authJwt } = require("../middleware");
const controller = require("../controllers/blog.controller");

module.exports = function (app) {
    app.use(function (req, res, next) {
        res.header(
            "Access-Control-Allow-Headers",
            "x-access-token, Origin, Content-Type, Accept"
        );
        next();
    });

    app.post("/api/hiv/blog",  controller.blogAdd);

    app.get("/api/hiv/allblog", [authJwt.verifyToken, authJwt.isSupportOrAdmin], controller.getAllBlogs);

    app.get("/api/hiv/blogs", controller.getActiveBlogs);

    app.get("/api/hiv/blog/:id", [authJwt.verifyToken, authJwt.isSupportOrAdmin], controller.getBlogById);

    app.get("/api/hiv/blog-by-slug/:slug", controller.getBlogBySlug);

    app.delete("/api/hiv/blog/:id", [authJwt.verifyToken, authJwt.isSupportOrAdmin], controller.blogDelete);

    app.post("/api/hiv/blog/:id", [authJwt.verifyToken, authJwt.isSupportOrAdmin], controller.updateBlog);

    app.patch("/api/hiv/blog/:id", [authJwt.verifyToken, authJwt.isSupportOrAdmin], controller.blogStatus);

}

