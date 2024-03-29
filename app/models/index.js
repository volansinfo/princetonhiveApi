const config = require("../config/db.config.js");

const { Sequelize, DataTypes } = require("sequelize");

const sequelize = new Sequelize(config.DB, config.USER, config.PASSWORD, {
  host: config.HOST,
  dialect: config.dialect,
  operatorsAliases: 0,
  // logginng:false,
  // operatorsAliases: false,

  pool: {
    max: config.pool.max,
    min: config.pool.min,
    acquire: config.pool.acquire,
    idle: config.pool.idle,
  },
});

// open the MySQL connection

//   sequelize.authenticate()
//   .then(()=>{
//     console.log("Successfully connected to the database.");
//   })
//   .catch(err=>{
//     console.log("Error"+err);
//   });

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.user = require("../models/user.model.js")(sequelize, Sequelize, DataTypes);
db.role = require("../models/role.model.js")(sequelize, Sequelize, DataTypes);
db.slider = require("../models/slider.model")(sequelize, Sequelize, DataTypes);
db.CmsPage = require("../models/cms.model")(sequelize, Sequelize, DataTypes);
db.Menu = require("../models/menu.model")(sequelize, Sequelize, DataTypes);
db.UserPermissions = require("../models/userPermissions.model")(
  sequelize,
  Sequelize,
  DataTypes
);
db.globalConfig = require("../models/globalConfig.model")(
  sequelize,
  Sequelize,
  DataTypes
);
db.WidgetPage = require("../models/widget.model")(
  sequelize,
  Sequelize,
  DataTypes
);
db.StateCountry = require("../models/statecountry.model")(
  sequelize,
  Sequelize,
  DataTypes
);
db.assignment = require("./assessment.model")(sequelize, Sequelize, DataTypes);
db.Department = require("../models/department.model")(
  sequelize,
  Sequelize,
  DataTypes
);
db.Question = require("../models/question.model.js")(
  sequelize,
  Sequelize,
  DataTypes
);
db.teacherAssessment = require("../models/teacher.assessment.model")(
  sequelize,
  Sequelize,
  DataTypes
);
db.Blog = require("../models/blog.model")(sequelize, Sequelize, DataTypes);

db.Gallery = require("../models/gallery.model")(
  sequelize,
  Sequelize,
  DataTypes
);

db.studentAIReport = require("./studentAIReport.model.js")(
  sequelize,
  Sequelize,
  DataTypes
);
db.contactUs = require("./contactUs.model.js")(sequelize, Sequelize, DataTypes);

// db.studentAIReport = require("./studentAIReport.model.js")(
//   sequelize,
//   Sequelize,
//   DataTypes
// );
// db.contactUs = require("./contactUs.model.js")(sequelize, Sequelize, DataTypes);

db.user.belongsToMany(db.role, {
  through: "hiv_user_roles",
  foreignKey: "userId",
  otherKey: "roleId",
  as: "roles",
});

db.category = require("../models/centralLibrary.category.model.js")(
  sequelize,
  Sequelize,
  DataTypes
);
// db.studentAIReport.hasMany(db.user, {
//   as: "hiv_users",
//   foreignKey: "teacherId",
// });

db.library = require("../models/central.library.model.js")(
  sequelize,
  Sequelize,
  DataTypes
);
db.ROLES = ["admin", "university", "teacher", "student", "support"];

module.exports = db;
