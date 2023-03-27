const util = require("util");
const multer = require("multer");
const maxSize = 2 * 1024 * 1024;

let storage = multer.diskStorage({

    destination: (req, file, cb) => {
        cb(null, __basedir + "/uploads/question/");
    },
    filename: (req, file, cb) => {

        var filetype = file.mimetype;
        var fileformate = filetype.split("/")[1];

        var data = req.body.questionName;
        var num = data.toLowerCase();
        var imageName = num.replace(/\s+/g, '-');
        cb(null, `${Date.now()}_${imageName}.${fileformate}`);
    },
});

let uploadFile = multer({
    storage: storage,
    limits: { fileSize: maxSize },
}).single("questionImgUrl");

let authUserImage = util.promisify(uploadFile);
module.exports = authUserImage;