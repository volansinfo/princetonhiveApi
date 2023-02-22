const controller = require("../controllers/role.controller")

module.exports = function(app){
    app.post("/api/vol/role",controller.addRole)

    app.get("/api/vol/role",controller.getAllRoles)

    app.delete("/api/vol/role/:id",controller.deleteRole)
}