const util = require("util");
const multer = require("multer");
const maxSize = 2 * 1024 * 1024;

let storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, __basedir + "/uploads/menuicon/");
  },
  filename: (req, file, cb) => {

    var filetype = file.mimetype;
    var fileformate = filetype.split("/")[1];

    var  data = req.body.moduleName;
    var  num = data.toLowerCase();
    var imageName = num.replace(/\s+/g, '-');
    cb(null, `${file.fieldname}_${imageName}.${fileformate}`);
  },
});

let uploadFile = multer({
  storage: storage,
  limits: { fileSize: maxSize },
}).single("iconImage");

// .fields([
//     {
//         name:'iconTag',
//         maxCount:1
//     },
//     {
//         name:'iconImage',
//         maxCount:1
//     }
// ]);


let uploadFileMiddleware = util.promisify(uploadFile);
module.exports = uploadFileMiddleware;