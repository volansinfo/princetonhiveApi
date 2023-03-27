const util = require("util");
const multer = require("multer");
const maxSize = 2 * 1024 * 1024;

let storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, __basedir + "/uploads/slider/");
  },
  filename: (req, file, cb) => {
    var filetype = file.mimetype;
    var fileformate = filetype.split("/")[1];

    var data = req.body.title;
    var num = data.toLowerCase();
    var imageName = num.replace(/\s+/g, "-");

    //console.log(req.body);
    //console.log(file.originalname);
    //console.log(req.body.title);
    //cb(null, file.originalname);
    //cb(null, `${Date.now()}_${req.body.title}_${file.originalname}`);
    cb(null, `${Date.now()}_${imageName}.${fileformate}`);
  },
});

let uploadFile = multer({
  storage: storage,
  limits: { fileSize: maxSize },
}).single("fileSrc");

let uploadFileMiddleware = util.promisify(uploadFile);
module.exports = uploadFileMiddleware;
