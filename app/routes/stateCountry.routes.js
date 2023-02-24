// const { authJwt } = require("../middleware");
const controller = require("../controllers/stateCountry.controller");


module.exports = function(app) {
    app.get("/api/vol/statecountry",
     controller.getStateCountry);

    app.post("/api/vol/statecountry",
     controller.addStateCountry
    );

}