const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
//const cookieSession = require("cookie-session");
const app = express();
const port = process.env.PORT || 3000;
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
<<<<<<< HEAD
app.use(bodyParser.json());
app.use("/vol/img", express.static("uploads"));

=======
app.use("/princetonhive/img", express.static('uploads'));
>>>>>>> 0cd7c662142e73a21a928dc09c6ebb35a020a75a
global.__basedir = __dirname;

// app.use(
//   cookieSession({
//     name: "vol-session",
//     secret: "COOKIE_SECRET", // should use as secret environment variable
//     httpOnly: true,
//     sameSite: 'strict'
//   })
// );
app.get("/", (req, res) => {
  res.setHeader("Content-Type", "application/json");
  res.send("Hello World!");
  res.setHeader("Content-type", "multipart/form-data");
  res.setHeader("Content-Type", "text/csv");
});

// database
const db = require("./app/models");
const Role = db.role;
db.sequelize.sync();

// app.post("/students",(req,res)=>{
//         console.log(req.body);
//     res.status(200).send("yay==");
// });

//require("./app/routes/stuReg.routes")(app);
require("./app/routes/auth.routes")(app);
require("./app/routes/user.routes")(app);
require("./app/routes/slider.routes")(app);
require("./app/routes/cms.routes")(app);
require("./app/routes/menu.routes")(app);
require("./app/routes/role.routes")(app);
require("./app/routes/globalConfig.routes")(app);
require("./app/routes/widget.routes")(app);
require("./app/routes/stateCountry.routes")(app);
require("./app/routes/admin.routes")(app);
<<<<<<< HEAD
require("./app/routes/student.routes")(app);
require("./app/routes/teacher.routes")(app);
require("./app/routes/university.routes")(app);
require("./app/routes/support.routes")(app);
require("./app/routes/assessment.route")(app);
=======
require("./app/routes/student.routes")(app)
require("./app/routes/teacher.routes")(app)
require("./app/routes/university.routes")(app)
require("./app/routes/support.routes")(app)
require("./app/routes/assessment.route")(app)
require("./app/routes/department.routes")(app)
require("./app/routes/question.routes")(app)
>>>>>>> 0cd7c662142e73a21a928dc09c6ebb35a020a75a
app.listen(port, () => {
  console.log(`Connection is setup at ${port}`);
});
