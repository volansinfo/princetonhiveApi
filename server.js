const express = require("express");
const cors = require("cors");
//const cookieSession = require("cookie-session");
const app = express();
const port = process.env.PORT || 3000
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/vol/img", express.static('uploads'));
global.__basedir = __dirname;

// app.use(
//   cookieSession({
//     name: "vol-session",
//     secret: "COOKIE_SECRET", // should use as secret environment variable
//     httpOnly: true,
//     sameSite: 'strict'
//   })
// );

// database
const db = require("./app/models");
const Role = db.role;
db.sequelize.sync();

// app.post("/students",(req,res)=>{
//         console.log(req.body);
//     res.status(200).send("yay==");
// });

//require("./app/routes/stuReg.routes")(app);
require('./app/routes/auth.routes')(app);
require('./app/routes/user.routes')(app);
require('./app/routes/slider.routes')(app);
require('./app/routes/cms.routes')(app);
require('./app/routes/menu.routes')(app);
require('./app/routes/role.routes')(app);
require('./app/routes/globalConfig.routes')(app);
require('./app/routes/widget.routes')(app);
require("./app/routes/stateCountry.routes")(app);
require("./app/routes/admin.routes")(app);

app.listen(port, () => {
        console.log(`Connection is setup at ${port}`);
});
