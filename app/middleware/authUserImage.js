const util = require("util");
const multer = require("multer");
const maxSize = 2 * 1024 * 1024;
const multerStorage = multer.memoryStorage();

var path = require("path");

const upload = multer({
  storage: multerStorage,
  limits: { fileSize: maxSize },
  fileFilter: function (req, file, callback) {
    var ext = path.extname(file.originalname);

    if (ext != ".png" && ext != ".jpg" && ext != ".jpeg") {
      return callback(new Error("File type does not allow!"));
    }
    callback(null, true);
  },
}).single("profileImg");

let authUserImage = util.promisify(upload);
module.exports = authUserImage;
